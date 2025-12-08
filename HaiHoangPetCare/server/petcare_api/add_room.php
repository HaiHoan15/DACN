<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once 'connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['Branch_ID']) || !isset($data['RoomName']) || !isset($data['RoomCode'])) {
    echo json_encode(["success" => false, "message" => "Thiếu thông tin bắt buộc!"]);
    exit;
}

$branchId = $data['Branch_ID'];
$roomName = trim($data['RoomName']);
$roomCode = trim($data['RoomCode']);
$status = isset($data['Status']) ? $data['Status'] : 'active';

$sql = "INSERT INTO room (Branch_ID, RoomName, RoomCode, Status) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("isss", $branchId, $roomName, $roomCode, $status);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Thêm phòng khám thành công!"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>