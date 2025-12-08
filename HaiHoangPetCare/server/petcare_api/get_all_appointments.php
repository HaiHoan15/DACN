<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once 'connect.php';

$branchId = isset($_GET['branch_id']) ? intval($_GET['branch_id']) : 0;
$roomId = isset($_GET['room_id']) ? intval($_GET['room_id']) : 0;
$doctorId = isset($_GET['doctor_id']) ? intval($_GET['doctor_id']) : 0;
$userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
$date = isset($_GET['date']) ? $_GET['date'] : '';

$query = "SELECT 
    a.*,
    u.Fullname as UserName,
    p.PetName,
    b.BranchName,
    r.RoomName,
    d.DoctorName
  FROM appointment a
  LEFT JOIN user u ON a.User_ID = u.User_ID
  LEFT JOIN pet p ON a.Pet_ID = p.Pet_ID
  LEFT JOIN branch b ON a.Branch_ID = b.Branch_ID
  LEFT JOIN room r ON a.Room_ID = r.Room_ID
  LEFT JOIN doctor d ON a.Doctor_ID = d.Doctor_ID
  WHERE 1=1";

if ($branchId > 0) {
    $query .= " AND a.Branch_ID = $branchId";
}
if ($roomId > 0) {
    $query .= " AND a.Room_ID = $roomId";
}
if ($doctorId > 0) {
    $query .= " AND a.Doctor_ID = $doctorId";
}
if ($userId > 0) {
    $query .= " AND a.User_ID = $userId";
}
if (!empty($date)) {
    $query .= " AND a.AppointmentDate = '$date'";
}

$query .= " ORDER BY a.AppointmentDate DESC, a.Period ASC";

$stmt = $conn->prepare($query);
$stmt->execute();

$result = $stmt->get_result();
$appointments = [];

while ($row = $result->fetch_assoc()) {
    $appointments[] = $row;
}

echo json_encode($appointments);
$stmt->close();
$conn->close();
?>