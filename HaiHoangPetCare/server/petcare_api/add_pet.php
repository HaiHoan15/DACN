<?php
include 'connect.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data['PetName']) ||
    !isset($data['Species']) ||
    !isset($data['Breed']) ||
    !isset($data['Gender']) ||
    !isset($data['Birthday']) ||
    !isset($data['User_ID'])
) {
    echo json_encode(["success" => false, "message" => "Thiếu dữ liệu bắt buộc"], JSON_UNESCAPED_UNICODE);
    exit;
}

$petName = trim($data['PetName']);
$species = trim($data['Species']);
$breed = trim($data['Breed']);
$gender = $data['Gender'];
$birthday = $data['Birthday'];
$userId = (int)$data['User_ID'];
$petPicture = isset($data['PetPicture']) && !empty($data['PetPicture']) ? $data['PetPicture'] : null;

// Validate độ dài
if (strlen($petName) > 30) {
    echo json_encode(["success" => false, "message" => "Tên thú cưng tối đa 30 ký tự"], JSON_UNESCAPED_UNICODE);
    exit;
}

if (strlen($species) > 50 || strlen($breed) > 50) {
    echo json_encode(["success" => false, "message" => "Loài và giống tối đa 50 ký tự"], JSON_UNESCAPED_UNICODE);
    exit;
}

// Validate ngày sinh
if ($birthday && strtotime($birthday) > time()) {
    echo json_encode(["success" => false, "message" => "Ngày sinh không được sau hôm nay"], JSON_UNESCAPED_UNICODE);
    exit;
}

$sql = "INSERT INTO pet (PetName, Species, Breed, Gender, Birthday, PetPicture, User_ID)
        VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssssi", $petName, $species, $breed, $gender, $birthday, $petPicture, $userId);

if ($stmt->execute()) {
    $newPetId = $conn->insert_id;
    
    // Lấy thông tin pet vừa thêm
    $selectSql = "SELECT * FROM pet WHERE Pet_ID = ?";
    $selectStmt = $conn->prepare($selectSql);
    $selectStmt->bind_param("i", $newPetId);
    $selectStmt->execute();
    $result = $selectStmt->get_result();
    $newPet = $result->fetch_assoc();
    
    echo json_encode([
        "success" => true, 
        "message" => "Thêm thú cưng thành công",
        "pet" => $newPet
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi khi thêm thú cưng: " . $stmt->error], JSON_UNESCAPED_UNICODE);
}

$stmt->close();
$conn->close();
?>
