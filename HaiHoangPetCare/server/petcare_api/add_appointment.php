<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once 'connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['User_ID']) || !isset($data['Pet_ID']) || !isset($data['AppointmentDate']) || !isset($data['Period'])) {
    echo json_encode(["success" => false, "message" => "Thiếu thông tin bắt buộc!"]);
    exit;
}

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

// Kiểm tra trùng lịch toàn diện (cả bác sĩ, phòng và thời gian)
// Kiểm tra 1: Trùng phòng + thời gian (không ai có thể dùng cùng phòng cùng lúc)
if ($roomId) {
    $checkQuery = "SELECT a.*, u.Fullname, p.PetName 
                   FROM appointment a
                   LEFT JOIN user u ON a.User_ID = u.User_ID
                   LEFT JOIN pet p ON a.Pet_ID = p.Pet_ID
                   WHERE a.Room_ID = ? 
                   AND a.AppointmentDate = ? 
                   AND a.Status IN ('pending', 'confirmed')
                   AND (
                       (a.Period <= ? AND a.PeriodEnd >= ?) OR
                       (a.Period <= ? AND a.PeriodEnd >= ?) OR
                       (a.Period >= ? AND a.PeriodEnd <= ?)
                   )";
    $checkStmt = $conn->prepare($checkQuery);
    $checkStmt->bind_param("isiiiiii", $roomId, $appointmentDate, $period, $period, $periodEnd, $periodEnd, $period, $periodEnd);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        $conflict = $checkResult->fetch_assoc();
        $conflictStatus = $conflict['Status'] === 'pending' ? 'đang chờ duyệt' : 'đã được duyệt';
        echo json_encode([
            "success" => false, 
            "message" => "Phòng này đã có lịch khám ($conflictStatus) vào khung giờ bạn chọn!\nKhách hàng: " . $conflict['Fullname'] . " - Thú cưng: " . $conflict['PetName']
        ]);
        exit;
    }
}

// Kiểm tra 2: Trùng bác sĩ + thời gian (bác sĩ không thể khám 2 nơi cùng lúc)
if ($doctorId) {
    $checkQuery2 = "SELECT a.*, b.BranchName, r.RoomName 
                    FROM appointment a
                    LEFT JOIN branch b ON a.Branch_ID = b.Branch_ID
                    LEFT JOIN room r ON a.Room_ID = r.Room_ID
                    WHERE a.Doctor_ID = ? 
                    AND a.AppointmentDate = ? 
                    AND a.Status IN ('pending', 'confirmed')
                    AND (
                        (a.Period <= ? AND a.PeriodEnd >= ?) OR
                        (a.Period <= ? AND a.PeriodEnd >= ?) OR
                        (a.Period >= ? AND a.PeriodEnd <= ?)
                    )";
    $checkStmt2 = $conn->prepare($checkQuery2);
    $checkStmt2->bind_param("isiiiiii", $doctorId, $appointmentDate, $period, $period, $periodEnd, $periodEnd, $period, $periodEnd);
    $checkStmt2->execute();
    $checkResult2 = $checkStmt2->get_result();

    if ($checkResult2->num_rows > 0) {
        $conflict = $checkResult2->fetch_assoc();
        $conflictStatus = $conflict['Status'] === 'pending' ? 'đang chờ duyệt' : 'đã được duyệt';
        echo json_encode([
            "success" => false, 
            "message" => "Bác sĩ đã có lịch khám ($conflictStatus) tại " . $conflict['BranchName'] . " - " . $conflict['RoomName'] . " vào khung giờ này!"
        ]);
        exit;
    }
}

$sql = "INSERT INTO appointment (User_ID, Pet_ID, Branch_ID, Room_ID, Doctor_ID, AppointmentDate, Period, PeriodEnd, Reason, Result, Status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("iiiiisiisss", $userId, $petId, $branchId, $roomId, $doctorId, $appointmentDate, $period, $periodEnd, $reason, $result, $status);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Thêm lịch khám thành công!"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>