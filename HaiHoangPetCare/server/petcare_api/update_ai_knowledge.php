<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'connect.php';

$input = json_decode(file_get_contents('php://input'), true);

$id = $input['id'] ?? '';
$species = $input['species'] ?? '';
$breed = $input['breed'] ?? '';
$symptoms = $input['symptoms'] ?? '';
$diagnosis = $input['diagnosis'] ?? '';
$treatment = $input['treatment'] ?? '';

if (empty($id) || empty($species) || empty($breed) || empty($symptoms) || empty($diagnosis) || empty($treatment)) {
    echo json_encode([
        'success' => false,
        'message' => 'Vui lòng điền đầy đủ thông tin'
    ]);
    exit;
}

$id = $conn->real_escape_string($id);
$species = $conn->real_escape_string($species);
$breed = $conn->real_escape_string($breed);
$symptoms = $conn->real_escape_string($symptoms);
$diagnosis = $conn->real_escape_string($diagnosis);
$treatment = $conn->real_escape_string($treatment);

$sql = "UPDATE ai_knowledge 
        SET species = '$species', 
            breed = '$breed', 
            symptoms = '$symptoms', 
            diagnosis = '$diagnosis', 
            treatment = '$treatment'
        WHERE id = $id";

if ($conn->query($sql) === TRUE) {
    echo json_encode([
        'success' => true,
        'message' => 'Cập nhật thành công'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi: ' . $conn->error
    ]);
}

$conn->close();
?>
