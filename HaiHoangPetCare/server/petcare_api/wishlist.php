<?php
include 'connect.php';
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['User_ID'] ?? null;
$product_id = $data['Product_ID'] ?? null;
$quantity = $data['Quantity'] ?? 1;

if (!$user_id || !$product_id) {
    echo json_encode(["success" => false, "message" => "Thiếu thông tin User_ID hoặc Product_ID"]);
    exit;
}

// Kiểm tra xem sản phẩm đã tồn tại trong wishlist chưa
$check = $conn->prepare("SELECT * FROM wishlist WHERE User_ID = ? AND Product_ID = ?");
$check->bind_param("ii", $user_id, $product_id);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    // Nếu có, cập nhật số lượng
    $stmt = $conn->prepare("UPDATE wishlist SET Quantity = Quantity + ? WHERE User_ID = ? AND Product_ID = ?");
    $stmt->bind_param("iii", $quantity, $user_id, $product_id);
    $stmt->execute();
    echo json_encode(["success" => true, "message" => "Cập nhật số lượng sản phẩm trong Wishlist!"]);
    exit;
}

// Nếu chưa có, thêm mới
$stmt = $conn->prepare("INSERT INTO wishlist (User_ID, Product_ID, Quantity) VALUES (?, ?, ?)");
$stmt->bind_param("iii", $user_id, $product_id, $quantity);
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Đã thêm vào Wishlist!"]);
} else {
    echo json_encode(["success" => false, "message" => "Không thể thêm sản phẩm."]);
}
?>