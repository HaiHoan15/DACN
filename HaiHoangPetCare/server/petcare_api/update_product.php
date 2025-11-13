<?php
include 'connect.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['Product_ID'])) {
  echo json_encode(["success" => false, "message" => "Thiếu Product_ID"]); exit;
}

$Product_ID     = (int)$data['Product_ID'];
$ProductName    = $data['ProductName'] ?? "";
$Description    = $data['Description'] ?? null;
$Price          = $data['Price'] ?? 0;
$Supplier       = $data['Supplier'] ?? null;
$ProductPicture = $data['ProductPicture'] ?? null;
$Category       = $data['Category'] ?? null;

$sql = "UPDATE product 
        SET ProductName=?, Description=?, Price=?, Supplier=?, ProductPicture=?, Category=?
        WHERE Product_ID=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssdsssi", $ProductName, $Description, $Price, $Supplier, $ProductPicture, $Category, $Product_ID);

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "message" => $conn->error]);
}
$stmt->close();
$conn->close();