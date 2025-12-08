<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once 'connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['Room_ID'])) {
    echo json_encode(["success" => false, "message" => "Thiếu Room_ID!"]);
    exit;
}

$roomId = $data['Room_ID'];

$sql = "DELETE FROM room WHERE Room_ID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $roomId);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Xóa phòng thành công!"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>