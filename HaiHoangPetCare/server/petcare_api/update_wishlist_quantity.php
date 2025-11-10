<?php
include 'connect.php';
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");

$data = json_decode(file_get_contents("php://input"), true);
$wishlist_id = $data['Wishlist_ID'] ?? null;
$qty = $data['Quantity'] ?? null;

if (!$wishlist_id || !$qty) {
    echo json_encode(["success" => false, "message" => "Thiếu thông tin"]);
    exit;
}

$qty = (int) $qty;
if ($qty < 1)
    $qty = 1;

$stmt = $conn->prepare("UPDATE wishlist SET Quantity = ? WHERE Wishlist_ID = ?");
$stmt->bind_param("ii", $qty, $wishlist_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Cập nhật số lượng thành công"]);
} else {
    echo json_encode(["success" => false, "message" => "Không thể cập nhật"]);
}
?>