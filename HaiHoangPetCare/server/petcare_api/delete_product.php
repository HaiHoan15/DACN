<?php
include 'connect.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['Product_ID'])) {
  echo json_encode(["success" => false, "message" => "Thiếu Product_ID"]); exit;
}

$Product_ID = (int)$data['Product_ID'];
$sql = "DELETE FROM product WHERE Product_ID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $Product_ID);

if ($stmt->execute()) {
  if ($stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Xóa sản phẩm thành công"]);
  } else {
    echo json_encode(["success" => false, "message" => "Không tìm thấy Product_ID"]);
  }
} else {
  echo json_encode(["success" => false, "message" => $conn->error]);
}
$stmt->close();
$conn->close();