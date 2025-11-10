<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include 'connect.php';

$sql = "SELECT * FROM user";
$result = $conn->query($sql);

$users = [];

while ($row = $result->fetch_assoc()) {
  $users[] = $row;
}

echo json_encode($users, JSON_UNESCAPED_UNICODE);
?>
