<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include_once 'connect.php';

try {
    // Query để lấy tất cả thú cưng
    $query = "SELECT 
                Pet_ID,
                PetName,
                Species,
                Breed,
                Gender,
                Birthday,
                PetPicture,
                User_ID
              FROM pet
              ORDER BY Pet_ID DESC";
    
    $result = $conn->query($query);
    
    if (!$result) {
        throw new Exception("Lỗi query: " . $conn->error);
    }
    
    $pets = array();
    
    while ($row = $result->fetch_assoc()) {
        $pet = array(
            "Pet_ID" => $row['Pet_ID'],
            "PetName" => $row['PetName'],
            "Species" => $row['Species'],
            "Breed" => $row['Breed'],
            "Gender" => $row['Gender'],
            "Birthday" => $row['Birthday'],
            "PetPicture" => $row['PetPicture'],
            "User_ID" => $row['User_ID']
        );
        array_push($pets, $pet);
    }
    
    // Trả về danh sách pets
    echo json_encode($pets, JSON_UNESCAPED_UNICODE);
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Lỗi khi lấy danh sách thú cưng: " . $e->getMessage()
    ), JSON_UNESCAPED_UNICODE);
}

$conn->close();
?>