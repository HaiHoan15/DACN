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
$branchId = $data['Branch_ID'];
$roomName = trim($data['RoomName']);
$roomCode = trim($data['RoomCode']);
$status = isset($data['Status']) ? $data['Status'] : 'active';

$sql = "UPDATE room SET Branch_ID = ?, RoomName = ?, RoomCode = ?, Status = ? WHERE Room_ID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("isssi", $branchId, $roomName, $roomCode, $status, $roomId);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Cập nhật phòng thành công!"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>