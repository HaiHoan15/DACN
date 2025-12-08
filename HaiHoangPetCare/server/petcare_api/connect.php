<?php
<<<<<<< HEAD
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "petcare_db";
=======
header("Access-Control-Allow-Origin: https://haihoanpetcare.online");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

$servername = "localhost";
$username   = "haihvqqc_haihoan";
$password   = "Muinhon@15122002";
$dbname     = "haihvqqc_petcare_db";
>>>>>>> f018ac1 (update)

$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    die(json_encode(["error" => "Kết nối thất bại: " . $conn->connect_error]));
}
?>