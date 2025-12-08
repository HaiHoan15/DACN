<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once 'connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['BranchName']) || empty(trim($data['BranchName']))) {
    echo json_encode(["success" => false, "message" => "Tên chi nhánh không được để trống!"]);
    exit;
}

$branchName = trim($data['BranchName']);
$address = isset($data['Address']) ? trim($data['Address']) : null;
$phone = isset($data['Phone']) ? trim($data['Phone']) : null;
$status = isset($data['Status']) ? $data['Status'] : 'active';

$sql = "INSERT INTO branch (BranchName, Address, Phone, Status) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $branchName, $address, $phone, $status);

if ($stmt->execute()) {
    $newBranchId = $conn->insert_id;
    
    $getDoctors = "SELECT Doctor_ID FROM doctor WHERE Status = 'active'";
    $doctorsResult = $conn->query($getDoctors);
    
    if ($doctorsResult && $doctorsResult->num_rows > 0) {
        while ($doctor = $doctorsResult->fetch_assoc()) {
        
        }
    }
    
    echo json_encode(["success" => true, "message" => "Thêm chi nhánh thành công!"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>