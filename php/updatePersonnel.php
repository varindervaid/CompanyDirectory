<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if ($conn->connect_errno) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Get raw POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($data['id'], $data['firstName'], $data['lastName'], $data['email'], $data['departmentID'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "bad request";
    $output['status']['description'] = "missing required fields";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

$id = $data['id'];
$firstName = $data['firstName'];
$lastName = $data['lastName'];
$email = $data['email'];
$departmentID = $data['departmentID'];

$query = $conn->prepare('UPDATE personnel SET firstName = ?, lastName = ?, email = ?, departmentID = ? WHERE id = ?');
if (!$query) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "query failed";
    $output['status']['description'] = "prepare failed";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

$query->bind_param("sssii", $firstName, $lastName, $email, $departmentID, $id);
@file_put_contents("debug_update.txt", "Updating: $firstName, $lastName, $email, deptID: $departmentID for ID: $id");

$query->execute();

if ($query->affected_rows === -1) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "query failed";
    $output['status']['description'] = $query->error;
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "Personnel updated successfully";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [];

$conn->close();
echo json_encode($output);
?>