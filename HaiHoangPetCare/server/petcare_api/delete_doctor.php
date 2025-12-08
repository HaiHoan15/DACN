<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once 'connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['Doctor_ID'])) {
    echo json_encode(["success" => false, "message" => "Thiếu Doctor_ID!"]);
    exit;
}

$doctorId = $data['Doctor_ID'];

$sql = "DELETE FROM doctor WHERE Doctor_ID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $doctorId);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Xóa bác sĩ thành công!"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>