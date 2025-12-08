<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once 'connect.php';

$userId = isset($_GET['userId']) ? (int)$_GET['userId'] : 0;

if ($userId <= 0) {
    echo json_encode(array('error' => 'User ID is required'));
    exit();
}

$notifications = array();

try {
    // Đếm lịch khám hôm nay
    $today = date('Y-m-d');
    $query = "SELECT COUNT(*) as count FROM appointment 
              WHERE User_ID = $userId 
              AND DATE(AppointmentDate) = '$today' 
              AND Status != 'cancelled'";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    $notifications['todayAppointments'] = (int)$row['count'];
    
    // Đếm số loại sản phẩm trong giỏ hàng (từ bảng wishlist)
    $query = "SELECT COUNT(DISTINCT Product_ID) as count FROM wishlist WHERE User_ID = $userId";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    $notifications['cartItems'] = (int)$row['count'];
    
    // Lấy danh sách sản phẩm trong giỏ hàng (3 sản phẩm mới nhất)
    if ($notifications['cartItems'] > 0) {
        $query = "SELECT w.Wishlist_ID, w.Quantity, p.ProductName, p.Price
                  FROM wishlist w
                  LEFT JOIN product p ON w.Product_ID = p.Product_ID
                  WHERE w.User_ID = $userId
                  ORDER BY w.Wishlist_ID DESC
                  LIMIT 3";
        $result = $conn->query($query);
        while ($row = $result->fetch_assoc()) {
            $notifications['items'][] = array(
                'type' => 'cart',
                'message' => $row['ProductName'] . " (SL: " . $row['Quantity'] . ")",
                'time' => null,
                'link' => '/user?tab=cart'
            );
        }
    }
    
    // Đếm đơn hàng đang xử lý (pending hoặc processing)
    $query = "SELECT COUNT(*) as count FROM orders 
              WHERE User_ID = $userId 
              AND Status IN ('pending', 'processing')";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    $notifications['processingOrders'] = (int)$row['count'];
    
    // Tổng số thông báo (không tính giỏ hàng)
    $notifications['total'] = $notifications['todayAppointments'] + $notifications['processingOrders'];
    
    // Danh sách chi tiết
    $notifications['items'] = array();
    
    // Lấy lịch khám hôm nay
    $query = "SELECT a.Appointment_ID, a.AppointmentDate, a.Status, p.PetName, d.DoctorName
              FROM appointment a
              LEFT JOIN pet p ON a.Pet_ID = p.Pet_ID
              LEFT JOIN doctor d ON a.Doctor_ID = d.Doctor_ID
              WHERE a.User_ID = $userId 
              AND DATE(a.AppointmentDate) = '$today'
              AND a.Status != 'cancelled'
              ORDER BY a.AppointmentDate ASC";
    $result = $conn->query($query);
    while ($row = $result->fetch_assoc()) {
        $statusText = $row['Status'] == 'confirmed' ? 'đã xác nhận' : 'chờ xác nhận';
        $notifications['items'][] = array(
            'type' => 'appointment',
            'message' => "Lịch khám " . $row['PetName'] . " với BS " . $row['DoctorName'] . " (" . $statusText . ")",
            'time' => $row['AppointmentDate'],
            'link' => '/user?tab=schedule'
        );
    }
    
    // Lấy đơn hàng đang xử lý
    $query = "SELECT Order_ID, TotalAmount, Status, CreatedAt
              FROM orders
              WHERE User_ID = $userId
              AND Status IN ('pending', 'processing')
              ORDER BY CreatedAt DESC
              LIMIT 3";
    $result = $conn->query($query);
    while ($row = $result->fetch_assoc()) {
        $statusText = $row['Status'] == 'pending' ? 'chờ xác nhận' : 'đang xử lý';
        $notifications['items'][] = array(
            'type' => 'order',
            'message' => "Đơn hàng #" . $row['Order_ID'] . " " . $statusText,
            'time' => $row['CreatedAt'],
            'link' => '/user?tab=order'
        );
    }
    
    echo json_encode($notifications);

} catch (Exception $e) {
    echo json_encode(array('error' => $e->getMessage()));
}

$conn->close();
?>
