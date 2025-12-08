<?php
include 'connect.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(["success" => false, "message" => "Thiếu User ID!"]);
    exit;
}

$sql = "SELECT SessionID, 
               MIN(CreatedAt) as StartTime,
               MAX(CreatedAt) as LastTime,
               COUNT(*) as MessageCount
        FROM chat_history 
        WHERE User_ID = ?
        GROUP BY SessionID
        ORDER BY LastTime DESC
        LIMIT 10";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$sessions = [];
while ($row = $result->fetch_assoc()) {
    $sessions[] = $row;
}

echo json_encode(["success" => true, "sessions" => $sessions]);

$stmt->close();
$conn->close();
?>