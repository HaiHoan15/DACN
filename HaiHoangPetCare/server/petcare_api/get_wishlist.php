<?php
include 'connect.php';
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

$user_id = $_GET['user_id'] ?? null;
if (!$user_id) {
    echo json_encode([]);
    exit;
}

$sql = "SELECT w.Wishlist_ID, w.Product_ID, w.Quantity, p.ProductName, p.Price, p.ProductPicture
        FROM wishlist w
        INNER JOIN product p ON w.Product_ID = p.Product_ID
        WHERE w.User_ID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$wishlist = [];
while ($row = $result->fetch_assoc()) {
    $wishlist[] = $row;
}

echo json_encode($wishlist);
?>