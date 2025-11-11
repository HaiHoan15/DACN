<?php
include 'connect.php';
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if (
    isset($data->PetName) &&
    isset($data->Species) &&
    isset($data->Breed) &&
    isset($data->Gender) &&
    isset($data->Birthday) &&  
    isset($data->User_ID)
) {
    $sql = "INSERT INTO pet (PetName, Species, Breed, Gender, Birthday, PetPicture, User_ID)
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "ssssssi",
        $data->PetName,
        $data->Species,
        $data->Breed,
        $data->Gender,
        $data->Birthday,
        $data->PetPicture,
        $data->User_ID
    );

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Thêm thú cưng thành công"]);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi khi thêm thú cưng"]);
    }
} else {
    echo json_encode(["error" => "Thiếu dữ liệu"]);
}
?>
