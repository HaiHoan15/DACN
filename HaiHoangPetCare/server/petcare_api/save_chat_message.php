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
$role = $data['role'] ?? null;
$message = $data['message'] ?? null;
$session_id = $data['session_id'] ?? null;

if (!$user_id || !$role || !$message) {
    echo json_encode(["success" => false, "message" => "Thiếu thông tin!"]);
    exit;
}

if (!$session_id) {
    $session_id = uniqid('chat_', true);
}

$sql = "INSERT INTO chat_history (User_ID, SessionID, Role, Message, CreatedAt) 
        VALUES (?, ?, ?, ?, NOW())";

$stmt = $conn->prepare($sql);
$stmt->bind_param("isss", $user_id, $session_id, $role, $message);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true, 
        "session_id" => $session_id,
        "message" => "Lưu tin nhắn thành công!"
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>