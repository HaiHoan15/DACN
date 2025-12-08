<?php
<<<<<<< HEAD
header("Access-Control-Allow-Origin: http://localhost:5173");
=======
header("Access-Control-Allow-Origin: https://haihoanpetcare.online");
>>>>>>> f018ac1 (update)
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include_once 'connect.php';

try {
    // Query để lấy tất cả thú cưng với tên chủ sở hữu
    $query = "SELECT 
                p.Pet_ID,
                p.PetName,
                p.Species,
                p.Breed,
                p.Gender,
                p.Birthday,
                p.PetPicture,
                p.User_ID,
                u.Fullname,
                u.Email
              FROM pet p
              LEFT JOIN user u ON p.User_ID = u.User_ID
              ORDER BY p.Pet_ID DESC";
    
    $result = $conn->query($query);
    
    if (!$result) {
        throw new Exception("Lỗi query: " . $conn->error);
    }
    
    $pets = array();
    
    while ($row = $result->fetch_assoc()) {
        // Tạo OwnerName với format "Tên - Email"
        $ownerName = null;
        if ($row['Fullname'] && $row['Email']) {
            $ownerName = $row['Fullname'] . " - " . $row['Email'];
        } elseif ($row['Fullname']) {
            $ownerName = $row['Fullname'];
        }
        
        $pet = array(
            "Pet_ID" => $row['Pet_ID'],
            "PetName" => $row['PetName'],
            "Species" => $row['Species'],
            "Breed" => $row['Breed'],
            "Gender" => $row['Gender'],
            "Birthday" => $row['Birthday'],
            "PetPicture" => $row['PetPicture'],
            "User_ID" => $row['User_ID'],
            "OwnerName" => $ownerName
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