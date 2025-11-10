<?php

// update_user.php
$origin = "http://localhost:5173";
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
header("Content-Type: application/json; charset=UTF-8");

include 'connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["User_ID"])) {
    echo json_encode(["success" => false, "message" => "Thiếu thông tin user!"]);
    exit;
}

$id = intval($data["User_ID"]);
$fullname = $data["Fullname"] ?? "";
$email = $data["Email"] ?? "";
$phone = $data["Phone"] ?? "";
$birthday = $data["Birthday"] ?? null;
$role = $data["Role"] ?? "";
$address = $data["Address"] ?? "";

// IMPORTANT: Distinguish between "not provided" and "provided but empty string"
// We use array_key_exists to know whether frontend sent the field.
$userPictureProvided = array_key_exists("UserPicture", $data);
$userPicture = $userPictureProvided ? $data["UserPicture"] : null;

$currentPassword = $data["CurrentPassword"] ?? "";
$newPassword = $data["NewPassword"] ?? "";

// --- Validate and handle password change if user requested ---
if (!empty($newPassword)) {
    // server-side validation of strength
    if (!preg_match('/^.{8,}$/', $newPassword)) {
        echo json_encode(["success" => false, "message" => "Mật khẩu mới chưa đủ 8 ký tự."]);
        exit;
    }
    if (!preg_match('/[A-Z]/', $newPassword)) {
        echo json_encode(["success" => false, "message" => "Mật khẩu mới phải có ít nhất 1 chữ cái in hoa."]);
        exit;
    }
    if (!preg_match('/\d/', $newPassword)) {
        echo json_encode(["success" => false, "message" => "Mật khẩu mới phải có ít nhất 1 chữ số."]);
        exit;
    }
    if (!preg_match('/[^A-Za-z0-9]/', $newPassword)) {
        echo json_encode(["success" => false, "message" => "Mật khẩu mới phải có ít nhất 1 ký tự đặc biệt."]);
        exit;
    }

    // verify current password
    $checkPwd = $conn->prepare("SELECT Password FROM user WHERE User_ID=?");
    $checkPwd->bind_param("i", $id);
    $checkPwd->execute();
    $res = $checkPwd->get_result()->fetch_assoc();
    if (!$res || $res["Password"] !== $currentPassword) {
        echo json_encode(["success" => false, "message" => "Mật khẩu hiện tại không đúng!"]);
        exit;
    }

    // update password
    $updPwd = $conn->prepare("UPDATE user SET Password=? WHERE User_ID=?");
    $updPwd->bind_param("si", $newPassword, $id);
    $updPwd->execute();
}

// --- Build update query dynamically so we don't overwrite UserPicture when not provided ---
if ($userPictureProvided) {
    $sql = "UPDATE user SET Fullname=?, Email=?, Phone=?, Birthday=?, Role=?, Address=?, UserPicture=? WHERE User_ID=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssi", $fullname, $email, $phone, $birthday, $role, $address, $userPicture, $id);
} else {
    $sql = "UPDATE user SET Fullname=?, Email=?, Phone=?, Birthday=?, Role=?, Address=? WHERE User_ID=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssi", $fullname, $email, $phone, $birthday, $role, $address, $id);
}

if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Lỗi khi cập nhật: " . $stmt->error]);
    exit;
}

// After update, fetch fresh user row and return it to frontend
$fetch = $conn->prepare("SELECT User_ID, Fullname, Email, Phone, Birthday, UserPicture, Role, Address FROM user WHERE User_ID=?");
$fetch->bind_param("i", $id);
$fetch->execute();
$user = $fetch->get_result()->fetch_assoc();

echo json_encode(["success" => true, "message" => "Cập nhật thông tin thành công!", "user" => $user], JSON_UNESCAPED_UNICODE);

$stmt->close();
$conn->close();
?>