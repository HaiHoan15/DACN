<?php
$origin = "http://localhost:5173"; // link url frontend
header("Access-Control-Allow-Origin: $origin");
header("Vary: Origin");
header("Access-Control-Allow-Credentials: false");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Nếu là preflight (OPTIONS) thì trả OK
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

header("Content-Type: application/json; charset=UTF-8");
include 'connect.php';

// --- Nhận dữ liệu JSON từ frontend ---
$input = file_get_contents("php://input");
$data = json_decode($input, true);

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

// --- Kiểm tra dữ liệu rỗng ---
if (empty($email) || empty($password)) {
  echo json_encode(["success" => false, "message" => "Vui lòng nhập đủ thông tin!"]);
  exit;
}

// --- Truy vấn tìm người dùng theo email ---
$sql = "SELECT * FROM user WHERE Email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
  echo json_encode(["success" => false, "message" => "Email không tồn tại!"]);
  exit;
}

$user = $res->fetch_assoc();

// ---  Kiểm tra mật khẩu bằng password_verify ---
if (!password_verify($password, $user["Password"])) {
  echo json_encode(["success" => false, "message" => "Sai mật khẩu!"]);
  exit;
}

// --- Nếu đúng mật khẩu ---
unset($user["Password"]); // ẩn mật khẩu không gửi ra frontend

echo json_encode([
  "success" => true,
  "message" => "Đăng nhập thành công!",
  "user" => $user
], JSON_UNESCAPED_UNICODE);
?>
