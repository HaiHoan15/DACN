<?php
include_once 'connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

$orderId = isset($data['Order_ID']) ? intval($data['Order_ID']) : (isset($data['order_id']) ? intval($data['order_id']) : 0);
$status = isset($data['Status']) ? $data['Status'] : (isset($data['status']) ? $data['status'] : '');

if ($orderId <= 0 || empty($status)) {
    echo json_encode(array('success' => false, 'message' => 'Thiếu thông tin bắt buộc'));
    exit;
}

$allowedStatus = array('pending', 'confirmed', 'shipping', 'delivered', 'cancelled');
if (!in_array($status, $allowedStatus)) {
    echo json_encode(array('success' => false, 'message' => 'Trạng thái không hợp lệ'));
    exit;
}

$query = "UPDATE orders SET Status = ?, UpdatedAt = NOW() WHERE Order_ID = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param('si', $status, $orderId);

if ($stmt->execute()) {
    echo json_encode(array('success' => true, 'message' => 'Cập nhật trạng thái thành công'));
} else {
    echo json_encode(array('success' => false, 'message' => 'Cập nhật thất bại'));
}

$stmt->close();
$conn->close();
?>
