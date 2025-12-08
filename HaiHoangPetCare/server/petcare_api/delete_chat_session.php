<?php
include 'connect.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['user_id'] ?? null;
$session_id = $data['session_id'] ?? null;

if (!$user_id || !$session_id) {
    echo json_encode(["success" => false, "message" => "Thiếu thông tin!"]);
    exit;
}

// Xóa tất cả tin nhắn của session này
$sql = "DELETE FROM chat_history WHERE User_ID = ? AND SessionID = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $user_id, $session_id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true, 
        "message" => "Đã xóa lịch sử chat thành công!"
    ]);
} else {
    echo json_encode([
        "success" => false, 
        "message" => "Lỗi: " . $conn->error
    ]);
}

$stmt->close();
$conn->close();
?>