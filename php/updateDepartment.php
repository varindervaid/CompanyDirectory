<?php
// Enable error reporting for debugging during development
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Record the script start time for performance tracking
$executionStartTime = microtime(true);

// Include database configuration variables
include("config.php");

// Set the response content type to JSON with UTF-8 encoding
header('Content-Type: application/json; charset=UTF-8');

// Create a new connection to the MySQL database using credentials from config.php
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Check if the database connection failed
if ($conn->connect_errno) {
    // Prepare and return an error response
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Read and decode the incoming JSON POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate that required fields are present
if (!isset($data['id'], $data['name'], $data['locationID'])) {
    // If any required field is missing, return a bad request error
    $output['status']['code'] = "400";
    $output['status']['name'] = "bad request";
    $output['status']['description'] = "missing required fields";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Assign POST data to local variables
$departmentID= $data['id'];
$departmentName= $data['name'];
$locationID=$data['locationID'];

// Prepare the SQL UPDATE statement to update department info
$query = $conn->prepare('UPDATE department SET name = ?, locationID = ? WHERE id = ?');

// Check if the preparation of the SQL statement failed
if (!$query) {
    // If preparation failed, return a query error
    $output['status']['code'] = "400";
    $output['status']['name'] = "query failed";
    $output['status']['description'] = "prepare failed";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Bind parameters to the SQL statement: name (string), locationID (int), id (int)
$query->bind_param('sii', $departmentName, $locationID, $departmentID);

// Execute the prepared SQL statement
$query->execute();

// Log the update operation for debugging purposes
@file_put_contents("debug_update.txt", "Updating: $departmentName, $locationID, for departmentID: $departmentID");

// Execute the statement again (Note: This may be redundant and should likely be removed)
$query->execute();

// Check if the update operation failed (affected_rows of -1 means error occurred)
if ($query->affected_rows === -1) {
    // If update failed, return an error with the SQL error message
    $output['status']['code'] = "400";
    $output['status']['name'] = "query failed";
    $output['status']['description'] = $query->error;
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// If everything succeeded, return a success response
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "Personnel updated successfully";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [];

// Close the database connection
$conn->close();

// Send the JSON response back to the client
echo json_encode($output);
?>
