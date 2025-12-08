<?php
header('Content-type: application/json; charset=utf-8');
include_once 'connect.php'; 

function execPostRequest($url, $data)
{
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'Content-Length: ' . strlen($data))
    );
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
    $result = curl_exec($ch);
    $errno = curl_errno($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if ($errno) {
        return json_encode(['error' => true, 'curl_errno' => $errno, 'curl_error' => $err]);
    }
    return $result;
}

$endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

$partnerCode = 'MOMOBKUN20180529';
$accessKey   = 'klm05TvNBzhg7h7j';
$secretKey   = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';

// Data từ frontend
$user_id          = intval($input['user_id']);
$amount           = (int) round($input['amount']);
$total_amount     = (int) round($input['total_amount']);
$orderInfo        = $input['orderInfo'] ?? "Thanh toán đơn hàng";
$items            = $input['items'] ?? [];
$shipping_address = $input['shipping_address'] ?? "";
$phone            = $input['phone'] ?? "";
$note             = $input['note'] ?? "";

if (!$user_id || $amount <= 0 || empty($items)) {
    echo json_encode(['success' => false, 'message' => 'Thiếu dữ liệu']);
    exit;
}

// Thay đổi: Không tạo đơn hàng ở đây
// Thay vào đó, chuẩn bị extraData với đầy đủ thông tin
$extraDataArr = [
    "user_id" => $user_id,
    "total_amount" => $total_amount,
    "items" => $items,
    "shipping_address" => $shipping_address,
    "phone" => $phone,
    "note" => $note
];
$extraData = base64_encode(json_encode($extraDataArr));

// MoMo params
$requestId   = time() . "_temp";
$orderId     = "ORDER_TEMP_" . time();  // ID giả, không liên quan DB

// Lưu tạm vào DB để dùng trong IPN hoặc thankyou
$tempStmt = $conn->prepare("INSERT INTO temp_payments (orderId, extraData) VALUES (?, ?)");
$tempStmt->bind_param("ss", $orderId, $extraData);
$tempStmt->execute();
$tempStmt->close();
$redirectUrl = "https://haihoanpetcare.online/petcare_api/thankyou.php";
$ipnUrl      = "https://haihoanpetcare.online/petcare_api/momo_ipn.php";
$requestType = "payWithATM";
$orderType   = "momo_atm";

// ===== SIGNATURE ATM (KHÔNG có orderType theo log MoMo) =====
$rawHash =
    "accessKey=" . $accessKey .
    "&amount=" . $amount .
    "&extraData=" . $extraData .
    "&ipnUrl=" . $ipnUrl .
    "&orderId=" . $orderId .
    "&orderInfo=" . $orderInfo .
    "&partnerCode=" . $partnerCode .
    "&redirectUrl=" . $redirectUrl .
    "&requestId=" . $requestId .
    "&requestType=" . $requestType;

$signature = hash_hmac("sha256", $rawHash, $secretKey);

// Payload
$payload = [
    "partnerCode" => $partnerCode,
    "partnerName" => "PetCare",
    "storeId" => "PetCareStore",
    "requestId" => $requestId,
    "amount" => (string)$amount,
    "orderId" => $orderId,
    "orderInfo" => $orderInfo,
    "orderType" => $orderType,    // vẫn gửi nhưng không ký
    "redirectUrl" => $redirectUrl,
    "ipnUrl" => $ipnUrl,
    "lang" => "vi",
    "extraData" => $extraData,
    "requestType" => $requestType,
    "signature" => $signature
];

$result = execPostRequest($endpoint, json_encode($payload));
$jsonResult = json_decode($result, true);

// Nếu lỗi
if (!$jsonResult || !isset($jsonResult['payUrl'])) {
    // file_put_contents("momo_create_log.txt", date("Y-m-d H:i:s") . " - create response: " . $result . PHP_EOL, FILE_APPEND);
    echo json_encode(['success' => false, 'message' => 'MoMo không trả payUrl', 'raw_response' => $result]);
    exit;
}

// Thành công
echo json_encode([
    "success" => true,
    "payUrl"  => $jsonResult["payUrl"]
]);
