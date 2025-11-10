<?php

include 'connect.php';
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");

$data = json_decode(file_get_contents("php://input"), true);
$wishlist_id = $data['Wishlist_ID'] ?? null;

if (!$wishlist_id) {
    echo json_encode(["success" => false, "message" => "Thiếu Wishlist_ID"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM wishlist WHERE Wishlist_ID = ?");
$stmt->bind_param("i", $wishlist_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Đã xóa khỏi Wishlist"]);
} else {
    echo json_encode(["success" => false, "message" => "Không thể xóa"]);
}
?>