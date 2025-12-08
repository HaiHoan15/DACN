<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once 'connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['DoctorName']) || !isset($data['DoctorCode'])) {
    echo json_encode(["success" => false, "message" => "Thiếu thông tin bắt buộc!"]);
    exit;
}

$doctorName = trim($data['DoctorName']);
$doctorCode = trim($data['DoctorCode']);
$phone = isset($data['Phone']) ? trim($data['Phone']) : null;
$email = isset($data['Email']) ? trim($data['Email']) : null;
$specialization = isset($data['Specialization']) ? trim($data['Specialization']) : null;
$status = isset($data['Status']) ? $data['Status'] : 'active';

$sql = "INSERT INTO doctor (DoctorName, DoctorCode, Phone, Email, Specialization, Status) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssss", $doctorName, $doctorCode, $phone, $email, $specialization, $status);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Thêm bác sĩ thành công!"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>