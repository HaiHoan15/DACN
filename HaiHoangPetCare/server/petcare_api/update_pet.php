<?php
include 'connect.php';

// Tăng memory limit và buffer size cho base64 lớn
ini_set('memory_limit', '256M');
ini_set('post_max_size', '64M');
ini_set('upload_max_filesize', '64M');

// Clear any output buffer trước khi gửi JSON
if (ob_get_level())
    ob_end_clean();
ob_start();

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Nhận dữ liệu JSON
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    ob_clean();
    echo json_encode([
        'success' => false,
        'message' => 'Dữ liệu không hợp lệ'
    ]);
    ob_end_flush();
    exit();
}

// Validate các trường bắt buộc
if (!isset($data['Pet_ID']) || !isset($data['PetName']) || !isset($data['Species'])) {
    ob_clean();
    echo json_encode([
        'success' => false,
        'message' => 'Thiếu thông tin bắt buộc (Pet_ID, PetName, Species)'
    ]);
    ob_end_flush();
    exit();
}

$pet_id = $data['Pet_ID'];
$pet_name = trim($data['PetName']);
$species = trim($data['Species']);
$breed = isset($data['Breed']) ? trim($data['Breed']) : '';
$gender = isset($data['Gender']) ? $data['Gender'] : 'Đực';
$birthday = isset($data['Birthday']) ? $data['Birthday'] : null;
$pet_picture = isset($data['PetPicture']) ? $data['PetPicture'] : null;

// Validate độ dài
if (strlen($pet_name) > 30) {
    ob_clean();
    echo json_encode([
        'success' => false,
        'message' => 'Tên thú cưng tối đa 30 ký tự'
    ]);
    ob_end_flush();
    exit();
}

if (strlen($species) > 50 || strlen($breed) > 50) {
    ob_clean();
    echo json_encode([
        'success' => false,
        'message' => 'Loài và giống tối đa 50 ký tự'
    ]);
    ob_end_flush();
    exit();
}

// Validate ngày sinh không được sau hôm nay
if ($birthday && strtotime($birthday) > time()) {
    ob_clean();
    echo json_encode([
        'success' => false,
        'message' => 'Ngày sinh không được sau hôm nay'
    ]);
    ob_end_flush();
    exit();
}

try {
    // Chuẩn bị câu lệnh SQL
    if ($pet_picture) {
        // Cập nhật cả ảnh
        $sql = "UPDATE pet SET 
                PetName = ?, 
                Species = ?, 
                Breed = ?, 
                Gender = ?, 
                Birthday = ?, 
                PetPicture = ? 
                WHERE Pet_ID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssssi", $pet_name, $species, $breed, $gender, $birthday, $pet_picture, $pet_id);
    } else {
        // Không cập nhật ảnh
        $sql = "UPDATE pet SET 
                PetName = ?, 
                Species = ?, 
                Breed = ?, 
                Gender = ?, 
                Birthday = ? 
                WHERE Pet_ID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssssi", $pet_name, $species, $breed, $gender, $birthday, $pet_id);
    }

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            // Lấy thông tin đã cập nhật
            $select_sql = "SELECT * FROM pet WHERE Pet_ID = ?";
            $select_stmt = $conn->prepare($select_sql);
            $select_stmt->bind_param("i", $pet_id);
            $select_stmt->execute();
            $result = $select_stmt->get_result();
            $updated_pet = $result->fetch_assoc();

            ob_clean();
            echo json_encode([
                'success' => true,
                'message' => 'Cập nhật thông tin thú cưng thành công!',
                'pet' => $updated_pet
            ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            ob_end_flush();
        } else {
            ob_clean();
            echo json_encode([
                'success' => true,
                'message' => 'Không có thay đổi nào được thực hiện'
            ]);
            ob_end_flush();
        }
    } else {
        ob_clean();
        echo json_encode([
            'success' => false,
            'message' => 'Lỗi khi cập nhật: ' . $stmt->error
        ]);
        ob_end_flush();
    }

    $stmt->close();
} catch (Exception $e) {
    ob_clean();
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi server: ' . $e->getMessage()
    ]);
    ob_end_flush();
}

$conn->close();
?>