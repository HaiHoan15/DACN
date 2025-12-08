<?php
include_once "connect.php";

// Lấy thông tin redirect từ MoMo
$resultCode   = $_GET['resultCode']   ?? null;
$orderIdMoMo  = $_GET['orderId']      ?? null;   // ví dụ: ORDER_34_1764487944
$amount       = $_GET['amount']       ?? null;
$transId      = $_GET['transId']      ?? null;
$responseTime = $_GET['responseTime'] ?? null;
$message      = $_GET['message']      ?? "Thanh toán hoàn tất!";

$message = htmlspecialchars(urldecode($message));

$status = "pending"; // trạng thái mặc định

// ===============================================
// 1. Nếu redirect báo lỗi → khả năng cao là fail
// ===============================================
if ($resultCode != 0) {
    $status = "failed";
}

// ==============================
// 2. Nếu có transId và resultCode == 0 → tìm order
// ==============================
$orderRow = null;

if ($transId && $resultCode == 0) {
    $stmt = $conn->prepare("SELECT Order_ID, Status, TotalAmount FROM orders WHERE MoMo_TransId=? LIMIT 1");
    $stmt->bind_param("s", $transId);
    $stmt->execute();
    $orderRow = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($orderRow) {
        $status = $orderRow['Status']; //  failed / pending
    } else {
        // Nếu không tìm thấy, thử tạo từ temp_payments
        $tempStmt = $conn->prepare("SELECT extraData FROM temp_payments WHERE orderId=? LIMIT 1");
        $tempStmt->bind_param("s", $orderIdMoMo);
        $tempStmt->execute();
        $tempRow = $tempStmt->get_result()->fetch_assoc();
        $tempStmt->close();

        if ($tempRow) {
            $decoded = json_decode(base64_decode($tempRow['extraData']), true);
            $userId = $decoded["user_id"];
            $totalAmount = $decoded["total_amount"];
            $items = $decoded["items"];
            $shippingAddress = $decoded["shipping_address"];
            $phone = $decoded["phone"];
            $note = $decoded["note"];

            // Tạo đơn hàng
            $conn->begin_transaction();
            try {
                $orderQuery = "INSERT INTO orders 
                    (User_ID, TotalAmount, Status, PaymentMethod, ShippingAddress, Phone, Note, MoMo_TransId, UpdatedAt) 
                    VALUES (?, ?, 'pending', 'MOMO', ?, ?, ?, ?, NOW())";
                $stmt = $conn->prepare($orderQuery);
                $stmt->bind_param('idssss', $userId, $totalAmount, $shippingAddress, $phone, $note, $transId);
                $stmt->execute();
                $orderId = $conn->insert_id;
                $stmt->close();

                // Insert items
                $itemQuery = "INSERT INTO order_items
                    (Order_ID, Product_ID, ProductName, Price, Quantity, Subtotal)
                    VALUES (?, ?, ?, ?, ?, ?)";
                $stmtItem = $conn->prepare($itemQuery);
                foreach ($items as $item) {
                    $productId = intval($item['product_id']);
                    $productName = $conn->real_escape_string($item['product_name']);
                    $price = floatval($item['price']);
                    $quantity = intval($item['quantity']);
                    $subtotal = $price * $quantity;
                    $stmtItem->bind_param("iisdid", $orderId, $productId, $productName, $price, $quantity, $subtotal);
                    $stmtItem->execute();
                }
                $stmtItem->close();
                $conn->commit();

                // Xóa wishlist và temp
                $del = $conn->prepare("DELETE FROM wishlist WHERE User_ID=?");
                $del->bind_param("i", $userId);
                $del->execute();
                $del->close();

                $delTemp = $conn->prepare("DELETE FROM temp_payments WHERE orderId=?");
                $delTemp->bind_param("s", $orderIdMoMo);
                $delTemp->execute();
                $delTemp->close();

                $status = "paid";
            } catch (Exception $e) {
                $conn->rollback();
                $status = "failed";
            }
        }
    }
}

// ===================================================================
// 3. Nếu KHÔNG có transId hoặc resultCode != 0 → không tìm
// ===================================================================

// Convert time
$payDate = null;
if ($responseTime) {
    $payDate = date("d/m/Y H:i:s", $responseTime / 1000);
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>Trạng thái thanh toán MoMo</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
    body { font-family: Arial; background:#f7f8fa; text-align:center; padding:40px; }
    .box { background:white; padding:30px; border-radius:12px; max-width:500px; margin:auto; box-shadow:0 4px 15px rgba(0,0,0,0.1); }
    h1 { color:#4CAF50; }
    .error { color:#e53935; }
    .pending { color:#ff9800; }
</style>
</head>
<body>
<div class="box">

<?php if ($status === "failed"): ?>
    <h1 class="error">❌ Thanh toán thất bại!</h1>
    <p><?= $message ?></p>

<?php elseif ($status === "paid"): ?>
    <h1>🎉 Thanh toán thành công!</h1>
    <p>Mã giao dịch: <b><?= $transId ?></b></p>
    <p>Số tiền: <b><?= number_format($amount, 0, ',', '.') ?> VND</b></p>

    <?php if ($payDate): ?>
        <p>Thời gian: <?= $payDate ?></p>
    <?php endif; ?>

    <p>Đơn hàng đã được xác nhận và thanh toán thành công!</p>

<?php else: ?>
    <h1 class="pending">⏳ Đang xác nhận thanh toán...</h1>
    <p>Đợi MoMo gửi tín hiệu thanh toán về hệ thống.</p>
    <p>Vui lòng kiểm tra lại sau 1–2 phút.</p>
<?php endif; ?>

<a href="https://haihoanpetcare.online/nguoi-dung?tab=order" style="
        display:inline-block; margin-top:20px; padding:10px 20px;
        background:#4CAF50; color:white; text-decoration:none; border-radius:8px;">
        Quay lại trang
</a>

</div>
</body>
</html>
