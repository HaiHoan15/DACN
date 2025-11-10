<?php

$origin = "http://localhost:5173"; //link url
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

header("Content-Type: application/json; charset=UTF-8");

include 'connect.php';

// Lấy ID từ query string 
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
  echo json_encode(["error" => "Thiếu hoặc sai User_ID"]);
  exit;
}

$sql = "SELECT * FROM user WHERE User_ID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
  $user = $result->fetch_assoc();
  echo json_encode($user, JSON_UNESCAPED_UNICODE);
} else {
  echo json_encode(["error" => "Không tìm thấy người dùng"]);
}

$stmt->close();
$conn->close();
?>
