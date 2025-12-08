<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once 'connect.php';

$weekStart = isset($_GET['week_start']) ? $_GET['week_start'] : date('Y-m-d');
$doctorId = isset($_GET['doctor_id']) ? intval($_GET['doctor_id']) : 0;

if ($doctorId <= 0) {
    echo json_encode([]);
    exit;
}

$weekEnd = date('Y-m-d', strtotime($weekStart . ' +6 days'));

// Lấy TẤT CẢ appointments của bác sĩ trong tuần (từ tất cả chi nhánh/phòng)
$query = "SELECT 
    a.*,
    d.DoctorName,
    d.DoctorCode,
    b.BranchName,
    r.RoomName,
    r.RoomCode,
    u.Fullname as UserName,
    p.PetName,
    a.AppointmentDate
  FROM appointment a
  LEFT JOIN doctor d ON a.Doctor_ID = d.Doctor_ID
  LEFT JOIN branch b ON a.Branch_ID = b.Branch_ID
  LEFT JOIN room r ON a.Room_ID = r.Room_ID
  LEFT JOIN user u ON a.User_ID = u.User_ID
  LEFT JOIN pet p ON a.Pet_ID = p.Pet_ID
  WHERE a.Doctor_ID = ?
    AND a.AppointmentDate BETWEEN ? AND ?
    AND a.Status != 'cancelled'
  ORDER BY a.AppointmentDate, a.Period";

$stmt = $conn->prepare($query);
$stmt->bind_param("iss", $doctorId, $weekStart, $weekEnd);
$stmt->execute();

$result = $stmt->get_result();
$slots = [];

while ($row = $result->fetch_assoc()) {
    $date1 = new DateTime($weekStart);
    $date2 = new DateTime($row['AppointmentDate']);
    $diff = $date1->diff($date2);
    $dayIndex = $diff->days;
    
    $dayOfWeek = $dayIndex + 2;
    if ($dayOfWeek > 7) $dayOfWeek = 8;
    
    $slots[] = [
        'Room_ID' => $row['Room_ID'],
        'DayOfWeek' => $dayOfWeek,
        'Period' => $row['Period'],
        'PeriodEnd' => $row['PeriodEnd'] ?? $row['Period'],
        'DoctorName' => $row['DoctorName'],
        'DoctorCode' => $row['DoctorCode'],
        'BranchName' => $row['BranchName'],
        'RoomName' => $row['RoomName'],
        'RoomCode' => $row['RoomCode'],
        'UserName' => $row['UserName'],
        'PetName' => $row['PetName'],
        'Status' => 'booked',
        'Appointment_ID' => $row['Appointment_ID'],
        'AppointmentDate' => $row['AppointmentDate']
    ];
}

echo json_encode($slots);
$stmt->close();
$conn->close();
?>