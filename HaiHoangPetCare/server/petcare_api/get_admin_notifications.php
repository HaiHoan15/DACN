<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once 'connect.php';

$notifications = array();

try {
    // Đếm số đơn hàng cần duyệt (pending)
    $query = "SELECT COUNT(*) as count FROM orders WHERE Status = 'pending'";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    $notifications['pendingOrders'] = (int)$row['count'];
    
    // Đếm số lịch khám cần duyệt (pending)
    $query = "SELECT COUNT(*) as count FROM appointment WHERE Status = 'pending'";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    $notifications['pendingAppointments'] = (int)$row['count'];
    
    // Tổng số thông báo
    $notifications['total'] = $notifications['pendingOrders'] + $notifications['pendingAppointments'];
    
    // Danh sách chi tiết (lấy 5 mới nhất)
    $notifications['items'] = array();
    
    // Lấy đơn hàng pending
    $query = "SELECT o.Order_ID, o.CreatedAt, u.Fullname as UserName 
              FROM orders o 
              LEFT JOIN user u ON o.User_ID = u.User_ID 
              WHERE o.Status = 'pending' 
              ORDER BY o.CreatedAt DESC 
              LIMIT 3";
    $result = $conn->query($query);
    while ($row = $result->fetch_assoc()) {
        $notifications['items'][] = array(
            'type' => 'order',
            'message' => "Đơn hàng #" . $row['Order_ID'] . " từ " . $row['UserName'] . " cần duyệt",
            'time' => $row['CreatedAt'],
            'link' => '/admin?tab=order'
        );
    }
    
    // Lấy lịch khám pending
    $query = "SELECT a.Appointment_ID, a.AppointmentDate, u.Fullname as UserName, p.PetName
              FROM appointment a
              LEFT JOIN user u ON a.User_ID = u.User_ID
              LEFT JOIN pet p ON a.Pet_ID = p.Pet_ID
              WHERE a.Status = 'pending'
              ORDER BY a.AppointmentDate DESC
              LIMIT 3";
    $result = $conn->query($query);
    while ($row = $result->fetch_assoc()) {
        $notifications['items'][] = array(
            'type' => 'appointment',
            'message' => "Lịch khám cho " . $row['PetName'] . " của " . $row['UserName'] . " cần duyệt",
            'time' => $row['AppointmentDate'],
            'link' => '/admin?tab=schedule'
        );
    }
    
    echo json_encode($notifications);

} catch (Exception $e) {
    echo json_encode(array('error' => $e->getMessage()));
}

$conn->close();
?>
