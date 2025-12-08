<?php
include 'connect.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data = json_decode(file_get_contents("php://input"), true);

// Validation
if (!isset($data['ProductName']) || empty(trim($data['ProductName']))) {
    echo json_encode([
        "success" => false,
        "message" => "Tên sản phẩm không được để trống"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!isset($data['Price']) || $data['Price'] === '' || $data['Price'] < 0) {
    echo json_encode([
        "success" => false,
        "message" => "Giá sản phẩm không hợp lệ"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$ProductName = trim($data['ProductName']);
$Description = isset($data['Description']) && !empty(trim($data['Description'])) 
    ? trim($data['Description']) 
    : null;
$Price = floatval($data['Price']);
$Supplier = isset($data['Supplier']) && !empty(trim($data['Supplier'])) 
    ? trim($data['Supplier']) 
    : null;
$Category = isset($data['Category']) && !empty(trim($data['Category'])) 
    ? trim($data['Category']) 
    : null;
$ProductPicture = isset($data['ProductPicture']) && !empty($data['ProductPicture']) 
    ? $data['ProductPicture'] 
    : null;

// Insert vào database (CreatedAt và UpdatedAt tự động do MySQL)
$sql = "INSERT INTO product (ProductName, Description, Price, Supplier, Category, ProductPicture) 
        VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssdsss", $ProductName, $Description, $Price, $Supplier, $Category, $ProductPicture);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Thêm sản phẩm thành công!",
        "Product_ID" => $conn->insert_id
    ], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi khi thêm sản phẩm: " . $conn->error
    ], JSON_UNESCAPED_UNICODE);
}

$stmt->close();
$conn->close();
?>