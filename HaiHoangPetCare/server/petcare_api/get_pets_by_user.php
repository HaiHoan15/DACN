<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once 'connect.php';

$userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if ($userId <= 0) {
    echo json_encode([]);
    exit;
}

$query = "SELECT * FROM pet WHERE User_ID = ? ORDER BY Pet_ID DESC";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $userId);
$stmt->execute();

$result = $stmt->get_result();
$pets = [];

while ($row = $result->fetch_assoc()) {
    $pets[] = $row;
}

echo json_encode($pets);
$stmt->close();
$conn->close();
?>