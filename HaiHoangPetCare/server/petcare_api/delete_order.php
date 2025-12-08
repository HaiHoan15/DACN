<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include_once 'connect.php';

// Handle OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

// Nhận cả Order_ID và order_id
$orderId = 0;
if (isset($data['Order_ID'])) {
    $orderId = intval($data['Order_ID']);
} elseif (isset($data['order_id'])) {
    $orderId = intval($data['order_id']);
}

if ($orderId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Thiếu thông tin Order_ID']);
    exit;
}

$conn->begin_transaction();

try {
    // Xóa các item trước
    $deleteItems = "DELETE FROM order_items WHERE Order_ID = ?";
    $stmt1 = $conn->prepare($deleteItems);
    $stmt1->bind_param('i', $orderId);
    $stmt1->execute();
    $stmt1->close();

    // Xóa chính đơn hàng
    $deleteOrder = "DELETE FROM orders WHERE Order_ID = ?";
    $stmt2 = $conn->prepare($deleteOrder);
    $stmt2->bind_param('i', $orderId);
    $stmt2->execute();
    $stmt2->close();

    $conn->commit();

    echo json_encode(['success' => true, 'message' => 'Xóa đơn hàng thành công']);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Lỗi: '.$e->getMessage()]);
}

$conn->close();
?>
