<<<<<<< HEAD
﻿<?php
=======
<?php
>>>>>>> f018ac1 (update)
include_once 'connect.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

<<<<<<< HEAD
if (!isset($data['user_id']) || !isset($data['total_amount']) ||
    !isset($data['shipping_address']) || !isset($data['phone']) ||
    !isset($data['items']) || empty($data['items'])) {
    echo json_encode(array('success' => false, 'message' => 'Thiếu thông tin bắt buộc'));
=======
// Kiểm tra dữ liệu bắt buộc
if (!isset($data['user_id']) || 
    !isset($data['total_amount']) ||
    !isset($data['shipping_address']) || 
    !isset($data['phone']) ||
    !isset($data['items']) || empty($data['items'])) 
{
    echo json_encode([
        'success' => false,
        'message' => 'Thiếu thông tin bắt buộc'
    ]);
>>>>>>> f018ac1 (update)
    exit;
}

$userId = intval($data['user_id']);
$totalAmount = floatval($data['total_amount']);
$shippingAddress = $conn->real_escape_string($data['shipping_address']);
$phone = $conn->real_escape_string($data['phone']);
$note = isset($data['note']) ? $conn->real_escape_string($data['note']) : '';
$items = $data['items'];

$paymentMethod = isset($data['payment_method']) ? $data['payment_method'] : 'COD';

<<<<<<< HEAD
/* ---------------------------------------------------
   CASE 1: USER CHỌN VNPAY → KHÔNG LƯU ĐƠN HÀNG
--------------------------------------------------- */
if ($paymentMethod === 'VNPAY') {
    echo json_encode([
        'success' => true,
        'need_vnpay' => true
    ]);
    exit();
}

/* ---------------------------------------------------
   CASE 2: COD → LƯU ĐƠN HÀNG NHƯ BÌNH THƯỜNG
--------------------------------------------------- */
=======
/* =======================================================
   🔥 CASE 1: THANH TOÁN MOMO → KHÔNG TẠO ĐƠN TẠI ĐÂY
   Chỉ return success để frontend chuyển sang create_momo
========================================================= */
if ($paymentMethod === "MOMO") {
    echo json_encode([
        'success' => true,
        'message' => 'Chuẩn bị thanh toán MoMo...'
    ]);
    exit;
}

/* =======================================================
   🟢 CASE 2: THANH TOÁN COD → TẠO ĐƠN NGAY
========================================================= */
>>>>>>> f018ac1 (update)

$conn->begin_transaction();

try {
    $orderQuery = "INSERT INTO orders 
        (User_ID, TotalAmount, Status, PaymentMethod, ShippingAddress, Phone, Note) 
        VALUES (?, ?, 'pending', 'COD', ?, ?, ?)";
<<<<<<< HEAD
=======

>>>>>>> f018ac1 (update)
    $stmt = $conn->prepare($orderQuery);
    $stmt->bind_param('idsss', $userId, $totalAmount, $shippingAddress, $phone, $note);
    $stmt->execute();

    $orderId = $conn->insert_id;
    $stmt->close();

<<<<<<< HEAD
    $itemQuery = "INSERT INTO order_items 
        (Order_ID, Product_ID, ProductName, Price, Quantity, Subtotal) 
        VALUES (?, ?, ?, ?, ?, ?)";
    $itemStmt = $conn->prepare($itemQuery);
=======
    // Insert từng item
    $itemQuery = "INSERT INTO order_items
        (Order_ID, Product_ID, ProductName, Price, Quantity, Subtotal)
        VALUES (?, ?, ?, ?, ?, ?)";

    $stmtItem = $conn->prepare($itemQuery);
>>>>>>> f018ac1 (update)

    foreach ($items as $item) {
        $productId = intval($item['product_id']);
        $productName = $conn->real_escape_string($item['product_name']);
        $price = floatval($item['price']);
        $quantity = intval($item['quantity']);
        $subtotal = $price * $quantity;

<<<<<<< HEAD
        $itemStmt->bind_param('iisdid', $orderId, $productId, $productName, $price, $quantity, $subtotal);
        $itemStmt->execute();
    }

    $itemStmt->close();
=======
        $stmtItem->bind_param("iisdid", $orderId, $productId, $productName, $price, $quantity, $subtotal);
        $stmtItem->execute();
    }

    $stmtItem->close();
>>>>>>> f018ac1 (update)
    $conn->commit();

    echo json_encode([
        'success' => true,
<<<<<<< HEAD
        'message' => 'Đặt hàng thành công (COD)',
=======
        'message' => 'Đặt hàng thành công',
>>>>>>> f018ac1 (update)
        'order_id' => $orderId
    ]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
