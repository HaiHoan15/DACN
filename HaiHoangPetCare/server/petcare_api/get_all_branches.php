<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once 'connect.php';

$query = "SELECT * FROM branch ORDER BY Branch_ID ASC";
$stmt = $conn->prepare($query);
$stmt->execute();

$result = $stmt->get_result();
$branches = [];

while ($row = $result->fetch_assoc()) {
    $branches[] = $row;
}

echo json_encode($branches);
$stmt->close();
$conn->close();
?>