<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: GET');

include_once 'connect.php';

$weekStart = isset($_GET['week_start']) ? $_GET['week_start'] : date('Y-m-d');
$userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if ($userId <= 0) {
    echo json_encode([]);
    exit;
}

$weekEnd = date('Y-m-d', strtotime($weekStart . ' +6 days'));

// Lấy appointments của user trong tuần
$query = "SELECT
    a.*,
    d.DoctorName,
    b.BranchName,
    r.RoomName,
    p.PetName,
    a.AppointmentDate
  FROM appointment a
  LEFT JOIN doctor d ON a.Doctor_ID = d.Doctor_ID
  LEFT JOIN branch b ON a.Branch_ID = b.Branch_ID
  LEFT JOIN room r ON a.Room_ID = r.Room_ID
  LEFT JOIN pet p ON a.Pet_ID = p.Pet_ID
  WHERE a.User_ID = ?
    AND a.AppointmentDate BETWEEN ? AND ?
    AND a.Status != 'cancelled'
  ORDER BY a.AppointmentDate, a.Period";

$stmt = $conn->prepare($query);
$stmt->bind_param('iss', $userId, $weekStart, $weekEnd);
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
        'BranchName' => $row['BranchName'],
        'RoomName' => $row['RoomName'],
        'PetName' => $row['PetName'],
        'Status' => 'booked',
        'Appointment_ID' => $row['Appointment_ID'],
        'AppointmentDate' => $row['AppointmentDate'],
        'isUserAppointment' => true
    ];
}

echo json_encode($slots);
$stmt->close();
$conn->close();
?>