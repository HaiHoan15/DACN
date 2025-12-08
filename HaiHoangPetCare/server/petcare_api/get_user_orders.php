<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

include_once 'connect.php';

$userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if ($userId <= 0) {
    echo json_encode([]);
    exit;
}

$query = "SELECT o.*, u.Fullname as UserName
          FROM orders o
          LEFT JOIN user u ON o.User_ID = u.User_ID
          WHERE o.User_ID = ?
          ORDER BY o.CreatedAt DESC";

$stmt = $conn->prepare($query);
$stmt->bind_param('i', $userId);
$stmt->execute();
$result = $stmt->get_result();

$orders = [];
while ($row = $result->fetch_assoc()) {
    // Lấy chi tiết sản phẩm của đơn hàng
    $itemQuery = "SELECT * FROM order_items WHERE Order_ID = ?";
    $itemStmt = $conn->prepare($itemQuery);
    $itemStmt->bind_param('i', $row['Order_ID']);
    $itemStmt->execute();
    $itemResult = $itemStmt->get_result();
    
    $items = [];
    while ($itemRow = $itemResult->fetch_assoc()) {
        $items[] = $itemRow;
    }
    
    $row['items'] = $items;
    $orders[] = $row;
}

echo json_encode($orders);
$stmt->close();
$conn->close();
?>
