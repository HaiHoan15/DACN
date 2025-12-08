<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once 'connect.php';

$userId = isset($_GET['userId']) ? (int)$_GET['userId'] : 0;

if ($userId <= 0) {
    echo json_encode(array('count' => 0));
    exit();
}

try {
    // Đếm số loại sản phẩm trong wishlist (giỏ hàng)
    $query = "SELECT COUNT(DISTINCT Product_ID) as count FROM wishlist WHERE User_ID = $userId";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    
    echo json_encode(array('count' => (int)$row['count']));

} catch (Exception $e) {
    echo json_encode(array('count' => 0, 'error' => $e->getMessage()));
}

$conn->close();
?>
