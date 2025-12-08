<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once 'connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['Branch_ID'])) {
    echo json_encode(["success" => false, "message" => "Thiếu Branch_ID!"]);
    exit;
}

$branchId = $data['Branch_ID'];

$sql = "DELETE FROM branch WHERE Branch_ID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $branchId);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Xóa chi nhánh thành công!"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>