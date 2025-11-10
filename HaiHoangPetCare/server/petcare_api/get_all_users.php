<?php
// ⚙️ Cho phép React frontend truy cập
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Kết nối DB
include 'connect.php';

// Lấy tất cả user (chỉ cần Email và ID)
$sql = "SELECT User_ID, Email FROM user";
$result = $conn->query($sql);

$users = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
}

// Trả dữ liệu
echo json_encode($users, JSON_UNESCAPED_UNICODE);

$conn->close();
?>