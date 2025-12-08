<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once 'connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['Branch_ID'])) {
    echo json_encode(["success" => false, "message" => "Thiếu Branch_ID!"]);
    exit;
}

$branchId = $data['Branch_ID'];
$branchName = trim($data['BranchName']);
$address = isset($data['Address']) ? trim($data['Address']) : null;
$phone = isset($data['Phone']) ? trim($data['Phone']) : null;
$status = isset($data['Status']) ? $data['Status'] : 'active';

$sql = "UPDATE branch SET BranchName = ?, Address = ?, Phone = ?, Status = ? WHERE Branch_ID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssi", $branchName, $address, $phone, $status, $branchId);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Cập nhật chi nhánh thành công!"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>