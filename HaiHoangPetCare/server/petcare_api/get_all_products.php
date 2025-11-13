<?php
include 'connect.php';
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

$sql = "SELECT Product_ID, ProductName, Description, Price, Supplier, ProductPicture, Category
        FROM product ORDER BY Product_ID DESC";
$result = $conn->query($sql);

$items = [];
if ($result) {
  while ($row = $result->fetch_assoc()) {
    $items[] = $row;
  }
  echo json_encode($items, JSON_UNESCAPED_UNICODE);
} else {
  http_response_code(500);
  echo json_encode(["success" => false, "message" => "Query failed: ".$conn->error], JSON_UNESCAPED_UNICODE);
}
$conn->close();