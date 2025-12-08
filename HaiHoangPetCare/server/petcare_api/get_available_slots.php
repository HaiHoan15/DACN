<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once 'connect.php';

$doctorId = isset($_GET['doctor_id']) ? intval($_GET['doctor_id']) : 0;
$branchId = isset($_GET['branch_id']) ? intval($_GET['branch_id']) : 0;
$roomId = isset($_GET['room_id']) ? intval($_GET['room_id']) : 0;
$date = isset($_GET['date']) ? $_GET['date'] : '';

if ($doctorId <= 0 || $branchId <= 0 || $roomId <= 0 || empty($date)) {
    echo json_encode([
        "success" => false,
        "message" => "Thiếu thông tin bắt buộc (doctor_id, branch_id, room_id, date)"
    ]);
    exit;
}

// Định nghĩa tất cả các khung giờ trong ngày (7:00 - 18:00)
// Mỗi khung giờ là 1 tiếng
$allSlots = [];
for ($hour = 7; $hour <= 17; $hour++) {
    $allSlots[] = [
        'period' => $hour,
        'period_end' => $hour,
        'time_display' => sprintf("%02d:00 - %02d:59", $hour, $hour),
        'available' => true
    ];
}

// Lấy các lịch đã đặt trong ngày (bao gồm cả pending và confirmed)
$query = "SELECT a.Period, a.PeriodEnd, a.Status, a.User_ID, 
          u.Fullname as UserName,
          p.PetName
          FROM appointment a
          LEFT JOIN user u ON a.User_ID = u.User_ID
          LEFT JOIN pet p ON a.Pet_ID = p.Pet_ID
          WHERE a.Doctor_ID = ? 
          AND a.Branch_ID = ? 
          AND a.Room_ID = ? 
          AND a.AppointmentDate = ?
          AND a.Status IN ('pending', 'confirmed')
          ORDER BY a.Period";

$stmt = $conn->prepare($query);
$stmt->bind_param("iiis", $doctorId, $branchId, $roomId, $date);
$stmt->execute();
$result = $stmt->get_result();

$bookedSlots = [];
while ($row = $result->fetch_assoc()) {
    $start = intval($row['Period']);
    $end = isset($row['PeriodEnd']) && !empty($row['PeriodEnd']) ? intval($row['PeriodEnd']) : $start;
    
    for ($i = $start; $i <= $end; $i++) {
        $bookedSlots[$i] = [
            'status' => $row['Status'],
            'user_name' => $row['UserName'],
            'pet_name' => $row['PetName']
        ];
    }
}

// Đánh dấu các slot đã bị book
foreach ($allSlots as &$slot) {
    $period = $slot['period'];
    if (isset($bookedSlots[$period])) {
        $slot['available'] = false;
        $slot['status'] = $bookedSlots[$period]['status'];
        $slot['user_name'] = $bookedSlots[$period]['user_name'];
        $slot['pet_name'] = $bookedSlots[$period]['pet_name'];
    }
}

echo json_encode([
    "success" => true,
    "date" => $date,
    "slots" => $allSlots
]);

$stmt->close();
$conn->close();
?>
