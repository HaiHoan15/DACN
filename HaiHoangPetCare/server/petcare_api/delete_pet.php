<?php
include 'connect.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Xử lý preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Nhận dữ liệu từ request body
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['Pet_ID'])) {
    $pet_id = $data['Pet_ID'];
    
    $sql = "DELETE FROM pet WHERE Pet_ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $pet_id);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode([
                "success" => true, 
                "message" => "Xóa thú cưng thành công"
            ]);
        } else {
            echo json_encode([
                "success" => false, 
                "message" => "Không tìm thấy thú cưng với ID này"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false, 
            "message" => "Lỗi khi xóa: " . $conn->error
        ]);
    }
    
    $stmt->close();
} else {
    echo json_encode([
        "success" => false, 
        "message" => "Thiếu Pet_ID"
    ]);
}

$conn->close();
?>