<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once 'connect.php';

$branchId = isset($_GET['branch_id']) ? intval($_GET['branch_id']) : 0;

if ($branchId <= 0) {
    echo json_encode([]);
    exit;
}

// Hiển thị TẤT CẢ phòng của chi nhánh (bác sĩ có thể làm việc ở mọi phòng)
$query = "SELECT * FROM room WHERE Branch_ID = ? AND Status = 'active' ORDER BY Room_ID ASC";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $branchId);
$stmt->execute();

$result = $stmt->get_result();
$rooms = [];

while ($row = $result->fetch_assoc()) {
    $rooms[] = $row;
}

echo json_encode($rooms);
$stmt->close();
$conn->close();
?>