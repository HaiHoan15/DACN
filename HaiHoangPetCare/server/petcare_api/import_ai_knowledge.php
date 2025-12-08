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
$data = $input['data'] ?? [];

if (empty($data)) {
    echo json_encode([
        'success' => false,
        'message' => 'Không có dữ liệu để import'
    ]);
    exit;
}

$conn->autocommit(FALSE);
$count = 0;
$duplicates = 0;
$errors = [];

foreach ($data as $row) {
    if (empty($row['species']) || empty($row['breed']) || empty($row['symptoms']) || 
        empty($row['diagnosis']) || empty($row['treatment'])) {
        continue;
    }

    $species = $conn->real_escape_string($row['species']);
    $breed = $conn->real_escape_string($row['breed']);
    $symptoms = $conn->real_escape_string($row['symptoms']);
    $diagnosis = $conn->real_escape_string($row['diagnosis']);
    $treatment = $conn->real_escape_string($row['treatment']);

    // Kiểm tra trùng lặp
    $checkSql = "SELECT id FROM ai_knowledge 
                 WHERE species = '$species' 
                 AND breed = '$breed' 
                 AND symptoms = '$symptoms'
                 LIMIT 1";
    $checkResult = $conn->query($checkSql);
    
    if ($checkResult && $checkResult->num_rows > 0) {
        $duplicates++;
        continue; // Bỏ qua dòng trùng
    }

    $sql = "INSERT INTO ai_knowledge (species, breed, symptoms, diagnosis, treatment) 
            VALUES ('$species', '$breed', '$symptoms', '$diagnosis', '$treatment')";
    
    if ($conn->query($sql) === TRUE) {
        $count++;
    } else {
        $errors[] = $conn->error;
    }
}

if (empty($errors)) {
    $conn->commit();
    $message = "Import thành công {$count} bản ghi";
    if ($duplicates > 0) {
        $message .= ", bỏ qua {$duplicates} bản ghi trùng lặp";
    }
    echo json_encode([
        'success' => true,
        'message' => $message,
        'count' => $count,
        'duplicates' => $duplicates
    ]);
} else {
    $conn->rollback();
    echo json_encode([
        'success' => false,
        'message' => 'Có lỗi xảy ra: ' . implode(', ', $errors)
    ]);
}

$conn->autocommit(TRUE);
$conn->close();
?>
