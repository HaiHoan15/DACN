<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once 'connect.php';

$query = "SELECT * FROM doctor ORDER BY Doctor_ID ASC";
$stmt = $conn->prepare($query);
$stmt->execute();

$result = $stmt->get_result();
$doctors = [];

while ($row = $result->fetch_assoc()) {
    $doctors[] = $row;
}

echo json_encode($doctors);
$stmt->close();
$conn->close();
?>