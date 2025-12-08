<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connect.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['News_ID'])) {
    echo json_encode(["success" => false, "message" => "Thiếu News_ID!"]);
    exit;
}

if (!isset($data['Title']) || empty(trim($data['Title']))) {
    echo json_encode(["success" => false, "message" => "Tiêu đề không được để trống!"]);
    exit;
}

if (!isset($data['Content']) || empty(trim($data['Content']))) {
    echo json_encode(["success" => false, "message" => "Nội dung không được để trống!"]);
    exit;
}

$newsId = $data['News_ID'];
$title = trim($data['Title']);
$summary = isset($data['Summary']) ? trim($data['Summary']) : null;
$content = trim($data['Content']);
$author = isset($data['Author']) ? trim($data['Author']) : null;
$category = isset($data['Category']) ? trim($data['Category']) : 'Chung';
$newsPicture = isset($data['NewsPicture']) ? $data['NewsPicture'] : null;
$status = isset($data['Status']) ? $data['Status'] : 'draft';

$sql = "UPDATE news SET 
        Title = ?, 
        Summary = ?, 
        Content = ?, 
        Author = ?, 
        Category = ?, 
        NewsPicture = ?, 
        Status = ?
        WHERE News_ID = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssssi", $title, $summary, $content, $author, $category, $newsPicture, $status, $newsId);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Cập nhật tin tức thành công!"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>