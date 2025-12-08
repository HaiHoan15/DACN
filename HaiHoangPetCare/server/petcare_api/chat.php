<?php
<<<<<<< HEAD
// =======================================================
//  HaiHoanPetCare - Chat API (Small Talk + RAG-Lite SQL)
//  Version: Stable 1.0
//  Author: Hai Hoang
// =======================================================

error_reporting(0);
ini_set('display_errors', 0);

require_once "D:/HocDaiHoc/CNTT/NAM 5/DACN/openai-config/config.php";
require_once "connect.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=utf-8");

// =======================================================
// 1. Nhận input
// =======================================================
$input = json_decode(file_get_contents('php://input'), true);
if (!$input || !isset($input['message'])) {
    echo json_encode(["reply" => "Hệ thống không nhận được nội dung bạn gửi."]);
=======
ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once "openai-config/config.php";
require_once "connect.php";

header("Access-Control-Allow-Origin: https://haihoanpetcare.online");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// =========================
// NHẬN INPUT
// =========================
$input = json_decode(file_get_contents('php://input'), true);
if (!$input || !isset($input['message'])) {
    echo json_encode(["reply" => "Không nhận được nội dung!"], JSON_UNESCAPED_UNICODE);
>>>>>>> f018ac1 (update)
    exit;
}

$userMessage = trim($input['message']);
<<<<<<< HEAD


// =======================================================
// 2️⃣ PHÂN LOẠI CÂU NÓI (GPT xác định loại câu)
// =======================================================
$classificationPrompt = <<<SYS
Bạn là bộ phân loại câu nói.

Hãy phân loại câu dưới đây thành đúng 1 trong 3 loại sau:

1. "small_talk" → các câu chào hỏi, giao tiếp bình thường, cảm ơn, nói chuyện vui.
2. "health_issue" → câu mô tả bệnh, triệu chứng, dấu hiệu bất thường ở thú cưng.
3. "system_question" → câu hỏi về HaiHoanPetCare (liên hệ, hotline, email, địa chỉ, chức năng của hệ thống).
4. "other" → các trường hợp khác.

Chỉ trả về đúng 1 từ duy nhất như mẫu:
small_talk
hoặc
health_issue
hoặc
system_question
hoặc
other

Không giải thích thêm.
SYS;

$payloadType = [
    "model" => "gpt-4o-mini",
    // "model" => "o3-mini",
    "messages" => [
        ["role" => "system", "content" => $classificationPrompt],
        ["role" => "user", "content" => $userMessage]
    ],
    "temperature" => 0.0,
];

$ch = curl_init("https://api.openai.com/v1/chat/completions");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Authorization: Bearer " . OPENAI_API_KEY
    ],
    CURLOPT_POSTFIELDS => json_encode($payloadType)
]);
$respType = curl_exec($ch);
curl_close($ch);

$type = trim(strtolower($respType ? json_decode($respType, true)['choices'][0]['message']['content'] : "other"));


// ======================================================================
// 3️⃣ XỬ LÝ SMALL TALK
// ======================================================================
if ($type === "small_talk") {
    echo json_encode([
        "reply" =>
            "Chào bạn! Mình là HaiHoan AI Assistant.\n".
            "Bạn cần tư vấn gì cho thú cưng hoặc muốn tìm hiểu thông tin gì không?"
    ]);
    exit;
}


// ======================================================================
// 4️⃣ XỬ LÝ CÂU HỎI VỀ HỆ THỐNG
// ======================================================================
if ($type === "system_question") {
    echo json_encode([
        "reply" =>
            "HaiHoanPetCare là nền tảng chăm sóc thú cưng thông minh, hỗ trợ quản lý hồ sơ, đặt lịch khám, mua sắm phụ kiện và nhận tư vấn trực tuyến từ AI và bác sĩ thú y.\n\n".
            "Email: haihoanpetcare@gmail.com\n".
            "Hotline: 6969-696-###\n".
            "Địa chỉ: TP.HCM, Việt Nam"
    ]);
    exit;
}


// ======================================================================
// 5️⃣ NẾU KHÔNG PHẢI MÔ TẢ BỆNH → trả lời tự nhiên
// ======================================================================
if ($type !== "health_issue") {
    echo json_encode([
        "reply" => 
            "Bạn vui lòng mô tả rõ triệu chứng hoặc vấn đề mà thú cưng đang gặp phải để mình hỗ trợ tốt hơn nhé."
    ]);
    exit;
}


// ======================================================================
// 6️⃣ HEALTH ISSUE — TRÍCH TRIỆU CHỨNG TỪ DB
// ======================================================================
$symptomOptions = [];
$q = $conn->query("SELECT DISTINCT symptoms FROM ai_knowledge");

while ($r = $q->fetch_assoc()) {
    $sym = trim($r['symptoms']);
    if ($sym !== "") $symptomOptions[] = mb_strtolower($sym, "UTF-8");
}

if (empty($symptomOptions)) {
    echo json_encode(["reply" => "Cơ sở dữ liệu hiện chưa có triệu chứng nào."]);
    exit;
}

$symptomTextList = implode('","', array_map("addslashes", $symptomOptions));


// ======================================================================
// 7️⃣ GPT EXTRACT TRIỆU CHỨNG TỪ DANH SÁCH
// ======================================================================
$extractPrompt = <<<SYS
Bạn là hệ thống phân tích triệu chứng.

Bên dưới là danh sách triệu chứng hợp lệ (không được tạo thêm triệu chứng ngoài danh sách):

["$symptomTextList"]

Hãy chọn triệu chứng phù hợp với câu mô tả và trả về JSON:
{"symptoms": ["triệu chứng"]}

Không thêm lời giải thích.
SYS;

$payloadExtract = [
    "model" => "gpt-4o-mini",
    "messages" => [
        ["role" => "system", "content" => $extractPrompt],
        ["role" => "user", "content" => $userMessage]
    ],
    "temperature" => 0.0
];

$ch = curl_init("https://api.openai.com/v1/chat/completions");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Authorization: Bearer " . OPENAI_API_KEY
    ],
    CURLOPT_POSTFIELDS => json_encode($payloadExtract)
]);

$resp = curl_exec($ch);
curl_close($ch);

$data = json_decode($resp, true);
$extractJson = json_decode($data['choices'][0]['message']['content'] ?? "{}", true);

if (!$extractJson || empty($extractJson["symptoms"])) {
    echo json_encode([
        "reply" => "Mình chưa nhận diện được triệu chứng. Bạn mô tả rõ hơn được không?"
    ]);
    exit;
}

$symptomDetected = mb_strtolower($extractJson["symptoms"][0], "UTF-8");


// ======================================================================
// 8️⃣ QUERY DATABASE
// ======================================================================
$stmt = $conn->prepare("SELECT * FROM ai_knowledge WHERE LOWER(symptoms) LIKE ? LIMIT 1");
$pattern = "%$symptomDetected%";
$stmt->bind_param("s", $pattern);
$stmt->execute();
$res = $stmt->get_result();

if ($row = $res->fetch_assoc()) {

    $species   = $row['species'];
    $breed     = $row['breed'];
    $symptoms  = $row['symptoms'];
    $diagnosis = $row['diagnosis'];
    $treatment = $row['treatment'];

    $reply =
        "Thú cưng của bạn thuộc loài: $species.\n" .
        "Giống: $breed.\n\n" .
        "Bé đang có biểu hiện: $symptoms.\n" .
        "Theo dữ liệu của HaiHoanPetCare, đây là dấu hiệu liên quan đến: $diagnosis.\n\n" .
        "Hướng xử lý phù hợp: $treatment.\n\n" .
        "Thông tin trên được trích xuất từ cơ sở dữ liệu thú y của HaiHoanPetCare. " .
        "Nếu tình trạng kéo dài hoặc xuất hiện dấu hiệu nghiêm trọng hơn, bạn nên đưa thú cưng đến phòng khám để được bác sĩ kiểm tra.";

    echo json_encode(["reply" => $reply]);
    exit;
}

// ======================================================================
// 9️⃣ KHÔNG TÌM THẤY TRONG DB
// ======================================================================
echo json_encode([
    "reply" => "Hệ thống chưa có dữ liệu về triệu chứng này. Bạn có thể mô tả chi tiết hơn?"
]);
exit;

=======
$clean = mb_strtolower($userMessage, "UTF-8");


// =========================
// 0 — THÔNG TIN LIÊN LẠC
// =========================
$contact_keywords = [
    "liên lạc", "hotline", "sđt", "sdt", "địa chỉ", "email", 
    "liên hệ", "contact", "support"
];

foreach ($contact_keywords as $c) {
    if (mb_stripos($clean, $c) !== false) {

        echo json_encode([
            "reply" => "Đây là các địa chỉ liên hệ của chúng tôi:
📧 Email: haihoanpetcare@gmail.com
📞 Hotline: 6969-696-###
📍 TP.HCM, Việt Nam
"
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }
}


// =========================
// 1 — SMALL TALK CHUẨN
// =========================
$smallTalkPatterns = [
    "xin chào", "chào bạn", "chào ad", "chào ai", "hello", "hi", "hê lô", "alo"
];

$medicalKeywords = [
    "bị", "ngứa", "đau", "ghẻ", "mẩn đỏ", "sưng", "ói", "nôn", "ỉa", 
    "tiêu chảy", "ho", "khò khè", "sốt", "mụn", "lở", "triệu chứng"
];

foreach ($medicalKeywords as $m) {
    if (mb_stripos($clean, $m) !== false) {
        goto SKIP_SMALL_TALK;
    }
}

if (strlen($clean) > 15 && strpos($clean, '?') !== false) {
    goto SKIP_SMALL_TALK;
}

foreach ($smallTalkPatterns as $s) {
    if ($clean === $s || strpos($clean, $s) === 0) {
        echo json_encode([
            "reply" => "Chào bạn! Mình là trợ lý AI thú cưng của HaiHoanPetCare. Bạn cần hỗ trợ điều gì nè?"
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

SKIP_SMALL_TALK:


// =========================
// 2 — SQL (match triệu chứng)
// =========================
$q = $conn->query("SELECT * FROM ai_knowledge");
$foundSQL = false;
$sqlReply = "";

while ($row = $q->fetch_assoc()) {

    $symptom = mb_strtolower(trim($row['symptoms']), "UTF-8");

    if ($symptom !== "" && mb_stripos($clean, $symptom) !== false) {
        $foundSQL = true;

        // TRẢ LỜI NGẮN GỌN
        $sqlReply = "Theo dữ liệu ghi nhận từ HaiHoanPetCare, thú cưng của bạn thuộc loài {$row['species']} và giống {$row['breed']}.
Triệu chứng được tìm thấy trùng khớp: {$row['symptoms']}.
Chẩn đoán gợi ý bên chúng tôi: {$row['diagnosis']}.
Cách điều trị phù hợp bên chúng tôi: {$row['treatment']}.
Nếu như tình trạng kéo dài hoặc trở nên nghiêm trọng hơn, bạn nên đưa thú cưng đến bác sĩ thú y để được thăm khám và chăm sóc kịp thời.";

        break;
    }
}


// =========================
// 3 — KẾT QUẢ
// =========================

// Nếu tìm thấy SQL → chỉ trả về SQL (không GPT fallback)
if ($foundSQL) {
    echo json_encode([
        "reply" => $sqlReply
    ], JSON_UNESCAPED_UNICODE);
    exit;
}


// =========================
// 4 — GPT FALLBACK (khi không có SQL)
// =========================
function callGPT($text)
{
    $payload = [
        "model" => "gpt-4o-mini",
        "temperature" => 0.6,
        "messages" => [
            [
                "role" => "system",
                "content" =>
"Bạn là bác sĩ thú y ảo của HaiHoanPetCare.
Luôn trả lời tiếng Việt, ngắn gọn, thân thiện, dễ hiểu."
            ],
            [
                "role" => "user",
                "content" => $text
            ]
        ]
    ];

    $ch = curl_init("https://api.openai.com/v1/chat/completions");
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_TIMEOUT => 12,
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json",
            "Authorization: Bearer " . OPENAI_API_KEY
        ],
        CURLOPT_POSTFIELDS => json_encode($payload)
    ]);

    $resp = curl_exec($ch);

    if ($resp === false) {
        return "Máy chủ đang bận, bạn thử lại sau nhé!";
    }

    $data = json_decode($resp, true);

    return $data["choices"][0]["message"]["content"] ?? "Không thể xử lý yêu cầu.";
}


echo json_encode([
    "reply" => callGPT($userMessage)
], JSON_UNESCAPED_UNICODE);

exit;
>>>>>>> f018ac1 (update)
?>
