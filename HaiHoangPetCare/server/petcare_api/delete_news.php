<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['News_ID'])) {
    echo json_encode(["success" => false, "message" => "Thiếu News_ID!"]);
    exit;
}

$newsId = $data['News_ID'];

$sql = "DELETE FROM news WHERE News_ID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $newsId);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Xóa tin tức thành công!"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>