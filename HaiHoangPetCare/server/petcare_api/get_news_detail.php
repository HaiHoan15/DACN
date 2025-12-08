<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once 'connect.php';

$newsId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($newsId <= 0) {
    echo json_encode(["success" => false, "message" => "ID không hợp lệ"]);
    exit;
}

$query = "SELECT * FROM news WHERE News_ID = ? AND Status = 'published'";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $newsId);
$stmt->execute();

$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(["success" => false, "message" => "Không tìm thấy tin tức"]);
}

$stmt->close();
$conn->close();
?>