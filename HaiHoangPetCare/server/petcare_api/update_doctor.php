<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once 'connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['Doctor_ID'])) {
    echo json_encode(["success" => false, "message" => "Thiếu Doctor_ID!"]);
    exit;
}

$doctorId = $data['Doctor_ID'];
$doctorName = trim($data['DoctorName']);
$doctorCode = trim($data['DoctorCode']);
$phone = isset($data['Phone']) ? trim($data['Phone']) : null;
$email = isset($data['Email']) ? trim($data['Email']) : null;
$specialization = isset($data['Specialization']) ? trim($data['Specialization']) : null;
$status = isset($data['Status']) ? $data['Status'] : 'active';

$sql = "UPDATE doctor SET DoctorName = ?, DoctorCode = ?, Phone = ?, Email = ?, Specialization = ?, Status = ? WHERE Doctor_ID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssssi", $doctorName, $doctorCode, $phone, $email, $specialization, $status, $doctorId);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Cập nhật bác sĩ thành công!"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>