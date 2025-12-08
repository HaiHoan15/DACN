<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

include_once 'connect.php';

$query = "SELECT o.*, u.Fullname as UserName, u.Email
          FROM orders o
          LEFT JOIN user u ON o.User_ID = u.User_ID
          ORDER BY o.CreatedAt DESC";

$result = $conn->query($query);

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
$conn->close();
?>
