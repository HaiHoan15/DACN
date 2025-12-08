<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once 'connect.php';

// Hiển thị TẤT CẢ chi nhánh (bác sĩ có thể làm việc ở mọi chi nhánh)
$query = "SELECT * FROM branch WHERE Status = 'active' ORDER BY Branch_ID ASC";

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