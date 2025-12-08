<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Hiển thị lỗi để debug (có thể xóa khi chạy thật)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'connect.php';

// Nhận dữ liệu JSON từ body
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['User_ID'])) {
    echo json_encode([
        "success" => false,
        "message" => "Thiếu tham số User_ID"
    ]);
    exit;
}

$user_id = intval($data['User_ID']);

if ($user_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "User_ID không hợp lệ"
    ]);
    exit;
}

// Kiểm tra user có tồn tại và chưa bị xóa
$checkQuery = "SELECT * FROM users WHERE User_ID = $user_id AND (is_deleted IS NULL OR is_deleted = 0)";
$checkResult = mysqli_query($conn, $checkQuery);

if (!$checkResult) {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi SQL: " . mysqli_error($conn)
    ]);
    exit;
}

if (mysqli_num_rows($checkResult) === 0) {
    echo json_encode([
        "success" => false,
        "message" => "User không tồn tại hoặc đã bị xóa"
    ]);
    exit;
}

// Thực hiện soft delete (thay vì xóa thật để tránh lỗi foreign key)
$updateQuery = "UPDATE users SET is_deleted = 1 WHERE User_ID = $user_id";
$updateResult = mysqli_query($conn, $updateQuery);

if ($updateResult) {
    echo json_encode([
        "success" => true,
        "message" => "Xóa thành công (soft delete)"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi SQL: " . mysqli_error($conn)
    ]);
}

mysqli_close($conn);
?>