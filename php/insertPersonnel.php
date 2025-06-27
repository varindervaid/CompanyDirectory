<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

// Connect to DB
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if ($conn->connect_errno) {
    $output = [
        'status' => [
            'code' => "300",
            'name' => "failure",
            'description' => "Database connection failed: " . $conn->connect_error,
            'returnedIn' => number_format((microtime(true) - $executionStartTime) * 1000, 2) . " ms"
        ],
        'data' => []
    ];
    echo json_encode($output);
    exit;
}

// Prepare query
$query = $conn->prepare('INSERT INTO personnel (firstName, lastName, email, departmentID) VALUES (?, ?, ?, ?)');

if (!$query) {
    $output = [
        'status' => [
            'code' => "400",
            'name' => "failure",
            'description' => "Statement preparation failed: " . $conn->error,
            'returnedIn' => number_format((microtime(true) - $executionStartTime) * 1000, 2) . " ms"
        ],
        'data' => []
    ];
    $conn->close();
    echo json_encode($output);
    exit;
}

// Bind parameters
$bindSuccess = $query->bind_param("sssi", $_POST['firstName'], $_POST['lastName'], $_POST['email'], $_POST['departmentID']);

if (!$bindSuccess) {
    $output = [
        'status' => [
            'code' => "400",
            'name' => "failure",
            'description' => "Parameter binding failed: " . $query->error,
            'returnedIn' => number_format((microtime(true) - $executionStartTime) * 1000, 2) . " ms"
        ],
        'data' => []
    ];
    $conn->close();
    echo json_encode($output);
    exit;
}

// Execute query
$execSuccess = $query->execute();

if (!$execSuccess) {
    $output = [
        'status' => [
            'code' => "400",
            'name' => "failure",
            'description' => "Execution failed: " . $query->error,
            'returnedIn' => number_format((microtime(true) - $executionStartTime) * 1000, 2) . " ms"
        ],
        'data' => []
    ];
    $conn->close();
    echo json_encode($output);
    exit;
}

// Success
$output = [
    'status' => [
        'code' => "200",
        'name' => "ok",
        'description' => "Personnel added successfully",
        'returnedIn' => number_format((microtime(true) - $executionStartTime) * 1000, 2) . " ms"
    ],
    'data' => []
];

$conn->close();
echo json_encode($output);

?>
