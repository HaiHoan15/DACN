<?php

<<<<<<< HEAD
// Đường dẫn đến file API key
require_once "D:\\HocDaiHoc\\CNTT\\NAM 5\\DACN\\openai-config\\config.php";

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
=======
require_once "openai-config/config.php";
require_once "connect.php";

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://haihoanpetcare.online');
header('Access-Control-Allow-Methods: POST, OPTIONS');
>>>>>>> f018ac1 (update)
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Nhận dữ liệu từ client
$input = json_decode(file_get_contents('php://input'), true);
$message = $input['message'] ?? '';
$imageBase64 = $input['image'] ?? '';
<<<<<<< HEAD

if (empty($imageBase64)) {
    echo json_encode(['success' => false, 'reply' => 'Không tìm thấy hình ảnh.']);
    exit;
}

// Sử dụng OpenAI GPT-4 Vision API
$apiUrl = "https://api.openai.com/v1/chat/completions";

// Tạo request body cho OpenAI
$requestBody = [
    'model' => 'gpt-4o-mini', 
    // 'model' => 'o3-mini', 
    'messages' => [
        [
            'role' => 'system',
            'content' => 'Bạn là chuyên gia chăm sóc thú cưng, đặc biệt giỏi phân tích hình ảnh về sức khỏe và tình trạng của thú cưng. Hãy trả lời bằng tiếng Việt một cách chi tiết và chuyên nghiệp.'
=======
$userID = $input['user_id'] ?? 0;

// Xử lý Session ID
$sessionID = $input['session_id'] ?? uniqid("session_");

// Nếu không có hình ảnh
if (empty($imageBase64)) {
    echo json_encode([
        'success' => false,
        'reply' => 'Không tìm thấy hình ảnh.'
    ]);
    exit;
}

/*
|--------------------------------------------------------------------------
| 1. CHUẨN HÓA BASE64 CHO OpenAI
|--------------------------------------------------------------------------
*/
if (strpos($imageBase64, 'data:image') !== 0) {
    $imageBase64 = "data:image/jpeg;base64," . $imageBase64;
}

/*
|--------------------------------------------------------------------------
| 2. LƯU TIN NHẮN USER (có ảnh)
|--------------------------------------------------------------------------
*/
$saveUser = $conn->prepare("
    INSERT INTO chat_history (User_ID, SessionID, Role, Message, Image)
    VALUES (?, ?, 'user', ?, ?)
");
$saveUser->bind_param("isss", $userID, $sessionID, $message, $imageBase64);
$saveUser->execute();


/*
|--------------------------------------------------------------------------
| 3. REQUEST TỚI OPENAI VISION
|--------------------------------------------------------------------------
*/

$apiUrl = "https://api.openai.com/v1/chat/completions";

$requestBody = [
    'model' => 'gpt-4o',
    'messages' => [
        [
            'role' => 'system',
            'content' =>
"Bạn là bác sĩ thú y ảo của HaiHoanPetCare. 
Hãy phân tích hình ảnh thú cưng và tư vấn ngắn gọn, rõ ràng, chính xác bằng tiếng Việt."
>>>>>>> f018ac1 (update)
        ],
        [
            'role' => 'user',
            'content' => [
                [
                    'type' => 'text',
<<<<<<< HEAD
                    'text' => $message ?: 'Hãy phân tích hình ảnh thú cưng này và cho tôi biết tình trạng sức khỏe, đặc điểm và lời khuyên chăm sóc.'
=======
                    'text' => $message ?: "Hãy phân tích hình ảnh thú cưng này giúp tôi."
>>>>>>> f018ac1 (update)
                ],
                [
                    'type' => 'image_url',
                    'image_url' => [
<<<<<<< HEAD
                        'url' => $imageBase64
=======
                        'url' => $imageBase64,
                        'detail' => 'high'
>>>>>>> f018ac1 (update)
                    ]
                ]
            ]
        ]
    ],
<<<<<<< HEAD
    'max_tokens' => 1024,
    'temperature' => 0.7
];

// Gửi request đến OpenAI API
=======
    'temperature' => 0.7,
    'max_tokens' => 1024
];

>>>>>>> f018ac1 (update)
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . OPENAI_API_KEY
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestBody));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

<<<<<<< HEAD
// Log để debug
error_log("HTTP Code: " . $httpCode);
error_log("Response: " . $response);

if ($httpCode !== 200) {
    $errorData = json_decode($response, true);
    error_log("Error from OpenAI: " . json_encode($errorData));
    
    $errorMessage = isset($errorData['error']['message']) 
        ? $errorData['error']['message'] 
        : 'Lỗi không xác định từ OpenAI API';
    
    echo json_encode([
        'success' => false,
        'reply' => 'Xin lỗi, tôi không thể phân tích hình ảnh lúc này. Lỗi: ' . $errorMessage,
        'debug' => $errorData
=======
// Log server (debug nội bộ)
error_log("IMG HTTP Code: " . $httpCode);
error_log("IMG Response: " . $response);

if ($httpCode !== 200) {
    $errorData = json_decode($response, true);
    $errorMessage = $errorData['error']['message'] ?? 'Lỗi không xác định từ OpenAI';

    echo json_encode([
        'success' => false,
        'reply' => "Xin lỗi, tôi không thể phân tích hình ảnh lúc này. Lỗi: $errorMessage"
>>>>>>> f018ac1 (update)
    ]);
    exit;
}

<<<<<<< HEAD
$result = json_decode($response, true);

// Lấy nội dung trả về từ OpenAI
if (isset($result['choices'][0]['message']['content'])) {
    $reply = $result['choices'][0]['message']['content'];
    echo json_encode([
        'success' => true,
        'reply' => $reply
    ]);
} else {
    echo json_encode([
        'success' => false,
        'reply' => 'Không thể nhận được phản hồi từ AI.'
    ]);
}
=======
/*
|--------------------------------------------------------------------------
| 4. XỬ LÝ KẾT QUẢ
|--------------------------------------------------------------------------
*/
$result = json_decode($response, true);
$reply = $result['choices'][0]['message']['content'] ?? null;

if (!$reply) {
    echo json_encode([
        'success' => false,
        'reply' => 'Không nhận được phản hồi từ AI.'
    ]);
    exit;
}

/*
|--------------------------------------------------------------------------
| 5. LƯU PHẢN HỒI CỦA AI
|--------------------------------------------------------------------------
*/
$saveBot = $conn->prepare("
    INSERT INTO chat_history (User_ID, SessionID, Role, Message, Image)
    VALUES (?, ?, 'assistant', ?, NULL)
");
$saveBot->bind_param("iss", $userID, $sessionID, $reply);
$saveBot->execute();

/*
|--------------------------------------------------------------------------
| 6. TRẢ VỀ KẾT QUẢ CHO CLIENT
|--------------------------------------------------------------------------
*/

echo json_encode([
    'success' => true,
    'reply' => $reply,
    'session_id' => $sessionID
]);

>>>>>>> f018ac1 (update)
?>
