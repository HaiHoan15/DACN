<?php
include_once "connect.php";

$data = json_decode(file_get_contents("php://input"), true);

// Thêm log vào error_log để debug
// error_log("MoMo IPN received: " . json_encode($data));

// file_put_contents(__DIR__ . "/momo_ipn_log.txt",
//     date("Y-m-d H:i:s") . " - " . json_encode($data) . "\n",
//     FILE_APPEND
// );

if (!$data || !isset($data["orderId"])) {
    echo "INVALID_DATA";
    exit();
}

$resultCode = $data["resultCode"];
$orderIdMoMo = $data["orderId"];
$amount = $data["amount"];
$extraData = $data["extraData"];
$transId = $data["transId"];
$message = $data["message"];
$partnerCode = $data["partnerCode"];
$requestId = $data["requestId"];
$responseTime = $data["responseTime"];

$accessKey = "klm05TvNBzhg7h7j";
$secretKey = "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa";

// ===== VERIFY SIGNATURE =====
$rawHash =
    "accessKey=$accessKey" .
    "&amount=$amount" .
    "&extraData=$extraData" .
    "&message=$message" .
    "&orderId=$orderIdMoMo" .
    "&orderInfo={$data['orderInfo']}" .
    "&partnerCode=$partnerCode" .
    "&requestId=$requestId" .
    "&responseTime=$responseTime" .
    "&resultCode=$resultCode" .
    "&transId=$transId";

$computedSignature = hash_hmac("sha256", $rawHash, $secretKey);

if ($computedSignature !== $data["signature"]) {
    echo "INVALID_SIGNATURE";
    exit();
}

// ===== DECODE EXTRA DATA =====
$decoded = json_decode(base64_decode($extraData), true);
// Lấy dữ liệu từ extraData
$userId = $decoded["user_id"];
$totalAmount = $decoded["total_amount"];
$items = $decoded["items"];
$shippingAddress = $decoded["shipping_address"];
$phone = $decoded["phone"];
$note = $decoded["note"];

// ===== TẠO ĐƠN HÀNG NẾU THÀNH CÔNG =====
if ($resultCode == 0) {
    // Tạo đơn hàng mới với status 'paid'
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

        // Xóa wishlist
        $del = $conn->prepare("DELETE FROM wishlist WHERE User_ID=?");
        $del->bind_param("i", $userId);
        $del->execute();
        $del->close();

        // Xóa temp
        $delTemp = $conn->prepare("DELETE FROM temp_payments WHERE orderId=?");
        $delTemp->bind_param("s", $orderIdMoMo);
        $delTemp->execute();
        $delTemp->close();
    } catch (Exception $e) {
        $conn->rollback();
        echo "DB_ERROR";
        exit();
    }
} else {
    // Nếu thất bại, không tạo đơn
}

echo "SUCCESS";
