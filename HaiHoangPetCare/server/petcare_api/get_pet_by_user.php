<?php
include 'connect.php'; 

// Tăng memory limit và buffer size cho base64 lớn
ini_set('memory_limit', '256M');
ini_set('post_max_size', '64M');
ini_set('upload_max_filesize', '64M');

// Clear any output buffer trước khi gửi JSON
if (ob_get_level()) ob_end_clean();
ob_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

if (isset($_GET['user_id'])) {
    $user_id = $_GET['user_id'];
    $sql = "SELECT * FROM pet WHERE User_ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $pets = [];
    while ($row = $result->fetch_assoc()) {
        $pets[] = $row;
    }

    // Xóa buffer và gửi JSON với flag không escape slashes
    ob_clean();
    echo json_encode($pets, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    ob_end_flush();
} else {
    ob_clean();
    echo json_encode(["error" => "Thiếu user_id"]);
    ob_end_flush();
}
?>