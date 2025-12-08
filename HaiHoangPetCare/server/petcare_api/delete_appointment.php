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

// Lấy thông tin trước khi xóa để cập nhật schedule_slot
$getQuery = "SELECT Room_ID, AppointmentDate, Period FROM appointment WHERE Appointment_ID = ?";
$getStmt = $conn->prepare($getQuery);
$getStmt->bind_param("i", $appointmentId);
$getStmt->execute();
$getResult = $getStmt->get_result();
$appointment = $getResult->fetch_assoc();

$sql = "DELETE FROM appointment WHERE Appointment_ID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $appointmentId);

if ($stmt->execute()) {
    // Cập nhật lại schedule_slot thành available
    if ($appointment) {
        $updateSlot = "UPDATE schedule_slot SET Status = 'available' WHERE Room_ID = ? AND DayOfWeek = DAYOFWEEK(?) AND Period = ?";
        $updateStmt = $conn->prepare($updateSlot);
        $updateStmt->bind_param("isi", $appointment['Room_ID'], $appointment['AppointmentDate'], $appointment['Period']);
        $updateStmt->execute();
    }
    
    echo json_encode(["success" => true, "message" => "Xóa lịch khám thành công!"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>