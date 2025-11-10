<?php
$origin = "http://localhost:5173"; // link url
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Xử lý preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

header("Content-Type: application/json; charset=UTF-8");

include 'connect.php';

// Lấy danh sách sản phẩm
$sql = "SELECT * FROM product";
$result = $conn->query($sql);

$products = [];
while ($row = $result->fetch_assoc()) {
  $products[] = $row;
}

echo json_encode($products, JSON_UNESCAPED_UNICODE);
?>
