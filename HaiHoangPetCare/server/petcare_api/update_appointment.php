<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once 'connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['Appointment_ID'])) {
    echo json_encode(["success" => false, "message" => "Thiếu Appointment_ID!"]);
    exit;
}

$appointmentId = $data['Appointment_ID'];
$userId = $data['User_ID'];
$petId = $data['Pet_ID'];
$branchId = isset($data['Branch_ID']) ? $data['Branch_ID'] : null;
$roomId = isset($data['Room_ID']) ? $data['Room_ID'] : null;
$doctorId = isset($data['Doctor_ID']) ? $data['Doctor_ID'] : null;
$appointmentDate = $data['AppointmentDate'];
$period = $data['Period'];
$periodEnd = isset($data['PeriodEnd']) && !empty($data['PeriodEnd']) ? $data['PeriodEnd'] : $period;
$reason = isset($data['Reason']) ? trim($data['Reason']) : null;
$result = isset($data['Result']) ? trim($data['Result']) : null;
$status = isset($data['Status']) ? $data['Status'] : 'pending';

$sql = "UPDATE appointment SET 
        User_ID = ?, 
        Pet_ID = ?, 
        Branch_ID = ?, 
        Room_ID = ?, 
        Doctor_ID = ?, 
        AppointmentDate = ?, 
        Period = ?,
        PeriodEnd = ?,
        Reason = ?, 
        Result = ?, 
        Status = ?
        WHERE Appointment_ID = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("iiiiisiisssi", $userId, $petId, $branchId, $roomId, $doctorId, $appointmentDate, $period, $periodEnd, $reason, $result, $status, $appointmentId);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Cập nhật lịch khám thành công!"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>