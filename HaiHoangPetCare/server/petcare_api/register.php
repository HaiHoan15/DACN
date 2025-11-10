<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

include "connect.php";

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(["success" => false, "message" => "Không nhận được dữ liệu!"]);
    exit;
}

$fullname = trim($data["Fullname"] ?? "");
$email = trim($data["Email"] ?? "");
$password = $data["Password"] ?? "";
$phone = trim($data["Phone"] ?? "");
$birthday = $data["Birthday"] ?? null;
$userPicture = $data["UserPicture"] ?? "";
$role = $data["Role"] ?? "KH";
$address = $data["Address"] ?? "";

// kiểm tra bắt buộc
if (empty($fullname) || empty($email) || empty($password) || empty($phone) || empty($birthday)) {
    echo json_encode(["success" => false, "message" => "Vui lòng nhập đầy đủ thông tin!"]);
    exit;
}

// kiểm tra trùng email
$checkEmail = $conn->prepare("SELECT User_ID FROM `user` WHERE Email = ?");
$checkEmail->bind_param("s", $email);
$checkEmail->execute();
$result = $checkEmail->get_result();
if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email đã được đăng ký!"]);
    exit;
}

// hash mật khẩu
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// escape userPicture nếu cần
if (!empty($userPicture)) {
    $userPicture = mysqli_real_escape_string($conn, $userPicture);
} else {
    $userPicture = "";
}

// Insert (không dùng CreatedAt vì bảng của bạn chưa có)
$stmt = $conn->prepare("
    INSERT INTO `user` 
      (Fullname, Email, Password, Phone, Birthday, UserPicture, Role, Address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
");
$stmt->bind_param("ssssssss", $fullname, $email, $hashedPassword, $phone, $birthday, $userPicture, $role, $address);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Đăng ký thành công!"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi khi thêm người dùng: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>