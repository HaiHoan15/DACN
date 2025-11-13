<?php
include 'connect.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$uploadDir = __DIR__ . '/uploads/products/';
$publicBase = '/petcare_api/uploads/products/'; // URL public, điều chỉnh nếu bạn đặt khác

if (!is_dir($uploadDir)) {
  if (!mkdir($uploadDir, 0777, true)) {
    echo json_encode(['success' => false, 'message' => 'Không tạo được thư mục upload']); exit;
  }
}

if (!isset($_FILES['image'])) {
  echo json_encode(['success' => false, 'message' => 'Thiếu file ảnh']); exit;
}

$file = $_FILES['image'];
if ($file['error'] !== UPLOAD_ERR_OK) {
  echo json_encode(['success' => false, 'message' => 'Lỗi upload: ' . $file['error']]); exit;
}

$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$allowed = ['jpg','jpeg','png','webp'];
if (!in_array($ext, $allowed)) {
  echo json_encode(['success' => false, 'message' => 'Định dạng không hỗ trợ']); exit;
}

$filename = uniqid('prod_', true) . '.' . $ext;
$dest = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
  echo json_encode(['success' => false, 'message' => 'Không thể lưu file']); exit;
}

$url = $publicBase . $filename;
echo json_encode(['success' => true, 'url' => $url], JSON_UNESCAPED_UNICODE);