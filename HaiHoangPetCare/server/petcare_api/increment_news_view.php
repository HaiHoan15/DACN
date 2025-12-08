<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once 'connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['News_ID'])) {
    echo json_encode(["success" => false]);
    exit;
}

$newsId = intval($data['News_ID']);

$query = "UPDATE news SET Views = Views + 1 WHERE News_ID = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $newsId);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}

$stmt->close();
$conn->close();
?>