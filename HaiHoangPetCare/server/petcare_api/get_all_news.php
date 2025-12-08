<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connect.php';

$query = "SELECT * FROM news ORDER BY CreatedAt DESC";
$stmt = $conn->prepare($query);
$stmt->execute();

$result = $stmt->get_result();
$news = [];

while ($row = $result->fetch_assoc()) {
    $news[] = $row;
}

echo json_encode($news);
?>