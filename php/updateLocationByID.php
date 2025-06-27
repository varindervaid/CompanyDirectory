<?php

// updateLocationByID.php
// example usage:
// call with POST request: id + name

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {

    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}
// Get raw POST data
$data = json_decode(file_get_contents('php://input'), true);
// Validate input
if (!isset($data['id']) || !isset($data['name'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "invalid input";
    $output['status']['description'] = "missing required parameters";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);
    exit;
}

$query = $conn->prepare('UPDATE location SET name = ? WHERE id = ?');
$query->bind_param("si", $data['name'], $data['id']);

$query->execute();

if ($query->affected_rows === -1) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [];

mysqli_close($conn);

echo json_encode($output);
