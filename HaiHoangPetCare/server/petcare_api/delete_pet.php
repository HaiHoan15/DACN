<?php
include 'connect.php';
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if (isset($_GET['pet_id'])) {
    $pet_id = $_GET['pet_id'];
    $sql = "DELETE FROM pet WHERE Pet_ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $pet_id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Xóa thú cưng thành công"]);
    } else {
        echo json_encode(["success" => false, "message" => "Không tìm thấy Pet_ID"]);
    }
} else {
    echo json_encode(["error" => "Thiếu pet_id"]);
}
?>