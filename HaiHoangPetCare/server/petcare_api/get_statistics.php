<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once 'connect.php';

$statistics = array();

try {
    // Đếm số lượng user (khách hàng - role = 'KH')
    $query = "SELECT COUNT(*) as total FROM user WHERE Role = 'KH'";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    $statistics['totalUsers'] = (int)$row['total'];
    
    // Lấy danh sách khách hàng (chỉ tên)
    $query = "SELECT User_ID, Fullname FROM user WHERE Role = 'KH' ORDER BY Fullname";
    $result = $conn->query($query);
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    $statistics['userList'] = $users;

    // Đếm số lượng bác sĩ
    $query = "SELECT COUNT(*) as total FROM doctor";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    $statistics['totalDoctors'] = (int)$row['total'];
    
    // Lấy danh sách bác sĩ
    $query = "SELECT Doctor_ID, DoctorName FROM doctor ORDER BY DoctorName";
    $result = $conn->query($query);
    $doctors = [];
    while ($row = $result->fetch_assoc()) {
        $doctors[] = $row;
    }
    $statistics['doctorList'] = $doctors;

    // Đếm số lượng chi nhánh
    $query = "SELECT COUNT(*) as total FROM branch";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    $statistics['totalBranches'] = (int)$row['total'];
    
    // Lấy danh sách chi nhánh
    $query = "SELECT Branch_ID, BranchName FROM branch ORDER BY BranchName";
    $result = $conn->query($query);
    $branches = [];
    while ($row = $result->fetch_assoc()) {
        $branches[] = $row;
    }
    $statistics['branchList'] = $branches;

    // Đếm số lượng phòng
    $query = "SELECT COUNT(*) as total FROM room";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    $statistics['totalRooms'] = (int)$row['total'];
    
    // Lấy danh sách phòng
    $query = "SELECT r.Room_ID, r.RoomName, b.BranchName FROM room r LEFT JOIN branch b ON r.Branch_ID = b.Branch_ID ORDER BY r.RoomName";
    $result = $conn->query($query);
    $rooms = [];
    while ($row = $result->fetch_assoc()) {
        $rooms[] = $row;
    }
    $statistics['roomList'] = $rooms;

    // Đếm số lượng sản phẩm
    $query = "SELECT COUNT(*) as total FROM product";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    $statistics['totalProducts'] = (int)$row['total'];
    
    // Lấy danh sách sản phẩm
    $query = "SELECT Product_ID, ProductName FROM product ORDER BY ProductName";
    $result = $conn->query($query);
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
    $statistics['productList'] = $products;

    // Đếm số lượng thú cưng
    $query = "SELECT COUNT(*) as total FROM pet";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    $statistics['totalPets'] = (int)$row['total'];
    
    // Lấy danh sách thú cưng
    $query = "SELECT p.Pet_ID, p.PetName, u.Fullname as OwnerName FROM pet p LEFT JOIN user u ON p.User_ID = u.User_ID ORDER BY p.PetName";
    $result = $conn->query($query);
    $pets = [];
    while ($row = $result->fetch_assoc()) {
        $pets[] = $row;
    }
    $statistics['petList'] = $pets;

    // Tính tổng thu nhập (tổng đơn hàng đã giao - status = 'delivered')
    $query = "SELECT COALESCE(SUM(TotalAmount), 0) as total FROM orders WHERE Status = 'delivered'";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    $statistics['totalRevenue'] = (float)$row['total'];

    // Đếm tổng số đơn hàng
    $query = "SELECT COUNT(*) as total FROM orders";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    $statistics['totalOrders'] = (int)$row['total'];

    // Đếm số đơn hàng đã giao
    $query = "SELECT COUNT(*) as total FROM orders WHERE Status = 'delivered'";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    $statistics['deliveredOrders'] = (int)$row['total'];

    // Đếm số đơn hàng chờ xử lý
    $query = "SELECT COUNT(*) as total FROM orders WHERE Status = 'pending'";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    $statistics['pendingOrders'] = (int)$row['total'];

    // Đếm tổng số lịch khám
    $query = "SELECT COUNT(*) as total FROM appointment";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    $statistics['totalAppointments'] = (int)$row['total'];

    // Đếm số lịch khám chờ duyệt
    $query = "SELECT COUNT(*) as total FROM appointment WHERE Status = 'pending'";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    $statistics['pendingAppointments'] = (int)$row['total'];

    // Đếm số lịch khám đã xác nhận
    $query = "SELECT COUNT(*) as total FROM appointment WHERE Status = 'confirmed'";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    $statistics['confirmedAppointments'] = (int)$row['total'];

    // Đếm số tin tức
    $query = "SELECT COUNT(*) as total FROM news";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    $statistics['totalNews'] = (int)$row['total'];
    
    // Lấy danh sách tin tức
    $query = "SELECT News_ID, Title FROM news ORDER BY News_ID DESC";
    $result = $conn->query($query);
    $newsList = [];
    while ($row = $result->fetch_assoc()) {
        $newsList[] = $row;
    }
    $statistics['newsList'] = $newsList;
    
    // Lấy danh sách đơn hàng đã giao với chi tiết sản phẩm
    $query = "SELECT o.Order_ID, o.TotalAmount, o.CreatedAt, u.Fullname as UserName 
              FROM orders o 
              LEFT JOIN user u ON o.User_ID = u.User_ID 
              WHERE o.Status = 'delivered' 
              ORDER BY o.CreatedAt DESC";
    $result = $conn->query($query);
    $deliveredOrderList = [];
    while ($row = $result->fetch_assoc()) {
        // Lấy chi tiết sản phẩm cho mỗi đơn hàng
        $orderId = $row['Order_ID'];
        $itemQuery = "SELECT ProductName, Quantity, Price FROM order_items WHERE Order_ID = $orderId";
        $itemResult = $conn->query($itemQuery);
        $items = [];
        while ($item = $itemResult->fetch_assoc()) {
            $items[] = $item;
        }
        $row['items'] = $items;
        $deliveredOrderList[] = $row;
    }
    $statistics['deliveredOrderList'] = $deliveredOrderList;
    
    // Lấy danh sách sản phẩm đã bán (từ đơn hàng đã giao)
    $query = "SELECT 
                oi.ProductName,
                p.Category,
                SUM(oi.Quantity) as TotalSold,
                SUM(oi.Price * oi.Quantity) as TotalRevenue,
                p.Product_ID
              FROM order_items oi
              LEFT JOIN orders o ON oi.Order_ID = o.Order_ID
              LEFT JOIN product p ON oi.ProductName COLLATE utf8mb4_unicode_ci = p.ProductName COLLATE utf8mb4_unicode_ci
              WHERE o.Status = 'delivered'
              GROUP BY oi.ProductName, p.Category, p.Product_ID
              ORDER BY TotalSold DESC";
    $result = $conn->query($query);
    $soldProductList = [];
    while ($row = $result->fetch_assoc()) {
        $soldProductList[] = $row;
    }
    $statistics['soldProductList'] = $soldProductList;

    echo json_encode($statistics);

} catch (Exception $e) {
    echo json_encode(array('error' => $e->getMessage()));
}

$conn->close();
?>
