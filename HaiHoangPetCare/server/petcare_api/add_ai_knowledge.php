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

$species = $input['species'] ?? '';
$breed = $input['breed'] ?? '';
$symptoms = $input['symptoms'] ?? '';
$diagnosis = $input['diagnosis'] ?? '';
$treatment = $input['treatment'] ?? '';

if (empty($species) || empty($breed) || empty($symptoms) || empty($diagnosis) || empty($treatment)) {
    echo json_encode([
        'success' => false,
        'message' => 'Vui lòng điền đầy đủ thông tin'
    ]);
    exit;
}

$species = $conn->real_escape_string($species);
$breed = $conn->real_escape_string($breed);
$symptoms = $conn->real_escape_string($symptoms);
$diagnosis = $conn->real_escape_string($diagnosis);
$treatment = $conn->real_escape_string($treatment);

$sql = "INSERT INTO ai_knowledge (species, breed, symptoms, diagnosis, treatment) 
        VALUES ('$species', '$breed', '$symptoms', '$diagnosis', '$treatment')";

if ($conn->query($sql) === TRUE) {
    echo json_encode([
        'success' => true,
        'message' => 'Thêm mới thành công',
        'id' => $conn->insert_id
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi: ' . $conn->error
    ]);
}

$conn->close();
?>
