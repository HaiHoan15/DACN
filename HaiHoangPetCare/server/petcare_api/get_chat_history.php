<?php
include 'connect.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$user_id = $_GET['user_id'] ?? null;
$session_id = $_GET['session_id'] ?? null;

if (!$user_id) {
    echo json_encode(["success" => false, "message" => "Thiếu User ID!"]);
    exit;
}

if ($session_id) {
    $sql = "SELECT * FROM chat_history 
            WHERE User_ID = ? AND SessionID = ? 
            ORDER BY CreatedAt ASC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("is", $user_id, $session_id);
<<<<<<< HEAD
} else {
    $sql = "SELECT * FROM chat_history 
            WHERE User_ID = ? AND SessionID = (
                SELECT SessionID FROM chat_history 
                WHERE User_ID = ? 
=======

} else {
    // Lấy session mới nhất của user
    $sql = "SELECT * FROM chat_history 
            WHERE User_ID = ? AND SessionID = (
                SELECT SessionID FROM chat_history 
                WHERE User_ID = ?
>>>>>>> f018ac1 (update)
                ORDER BY CreatedAt DESC 
                LIMIT 1
            )
            ORDER BY CreatedAt ASC";
<<<<<<< HEAD
=======

>>>>>>> f018ac1 (update)
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $user_id, $user_id);
}

$stmt->execute();
$result = $stmt->get_result();

$messages = [];
$current_session = null;

while ($row = $result->fetch_assoc()) {
    $current_session = $row['SessionID'];
<<<<<<< HEAD
    $messages[] = [
        "role" => $row['Role'],
        "content" => $row['Message'],
=======

    $messages[] = [
        "role" => $row['Role'],
        "content" => $row['Message'],
        "image" => $row['Image'],      
>>>>>>> f018ac1 (update)
        "timestamp" => $row['CreatedAt']
    ];
}

echo json_encode([
    "success" => true,
    "session_id" => $current_session,
    "messages" => $messages
]);

$stmt->close();
$conn->close();
<<<<<<< HEAD
?>
=======
?>
>>>>>>> f018ac1 (update)
