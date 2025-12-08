<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// Lấy dữ liệu từ frontend (JSON)
$data = json_decode(file_get_contents("php://input"), true);
$order_id = $data['order_id'];
$amount = $data['amount'];

// Cấu hình VNPay Sandbox của bạn
$vnp_Url        = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
$vnp_Returnurl  = "http://localhost:5173/nguoi-dung?tab=order";
$vnp_TmnCode    = "IY275AJH";
$vnp_HashSecret = "1I0AGRFLGR8DP91CETAJF680CH2V2O4J";

// Chuẩn bị dữ liệu thanh toán
$vnp_TxnRef     = $order_id;
$vnp_OrderInfo  = "Thanh toán đơn hàng #" . $order_id;
$vnp_Amount     = $amount * 100;  // VNPay yêu cầu nhân 100
$vnp_Locale     = "vn";
$vnp_IpAddr     = $_SERVER['REMOTE_ADDR'];

$inputData = array(
    "vnp_Version"   => "2.1.0",
    "vnp_TmnCode"   => $vnp_TmnCode,
    "vnp_Amount"    => $vnp_Amount,
    "vnp_Command"   => "pay",
    "vnp_CreateDate"=> date('YmdHis'),
    "vnp_CurrCode"  => "VND",
    "vnp_IpAddr"    => $vnp_IpAddr,
    "vnp_Locale"    => $vnp_Locale,
    "vnp_OrderInfo" => $vnp_OrderInfo,
    "vnp_OrderType" => "other",
    "vnp_ReturnUrl" => $vnp_Returnurl,
    "vnp_TxnRef"    => $vnp_TxnRef
);

// Sắp xếp theo thứ tự alphabet như tài liệu VNPay
ksort($inputData);

// Tạo chuỗi hash và query
$query = "";
$hashdata = "";
$first = true;

foreach ($inputData as $key => $value) {
    $query .= urlencode($key) . "=" . urlencode($value) . "&";

    if ($first) {
        $hashdata .= $key . "=" . $value;
        $first = false;
    } else {
        $hashdata .= "&" . $key . "=" . $value;
    }
}

// Tạo SecureHash
$vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);

// Link thanh toán đầy đủ
$paymentUrl = $vnp_Url . "?" . $query . "vnp_SecureHash=" . $vnpSecureHash;

// Trả link thanh toán cho frontend
echo json_encode(["url" => $paymentUrl]);
?>
