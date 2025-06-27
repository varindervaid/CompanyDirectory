<?php
// Include database configuration
require 'config.php';

// Set the content type to JSON for API responses
header('Content-Type: application/json');

// Create a new MySQLi connection using config credentials
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Get the 'action' parameter from the URL, default to empty string if not set
$action = $_GET['action'] ?? '';

try {
    // Handle GET request to retrieve all locations
    if ($action === 'get') {
        // Prepare SQL query to get all location records, ordered by descending ID
        $query = $conn->prepare("SELECT * FROM `location` ORDER BY id DESC");
        $query->execute();

        // Get result set from executed query
        $result = $query->get_result();

        // Initialize an empty array to store the data
        $data = [];
        
        // Fetch each row as an associative array and append to $data
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        // Return success response with fetched data
        echo json_encode(['status' => 'success', 'data' => $data]);

    // Handle ADD request to insert a new location
    } elseif ($action === 'add') {
        // Get the name parameter from the URL and trim whitespace
        $name = trim($_GET['name'] ?? '');

        // Validate the name parameter
        if ($name === '') {
            echo json_encode(['status' => 'error', 'message' => 'Name is required']);
            exit;
        }

        // Prepare SQL query to insert new location
        $stmt = $conn->prepare("INSERT INTO location (name) VALUES (?)");

        // Execute the prepared statement with the name parameter
        $stmt->execute([$name]);

        // Return success response
        echo json_encode(['status' => 'success', 'message' => 'Location added']);

    // Handle EDIT request to update a location by ID
    } elseif ($action === 'edit') {
        // Get ID and name from POST data
        $id = (int)($_POST['id'] ?? 0);
        $name = trim($_POST['name'] ?? '');

        // Validate that both ID and name are present
        if ($id === 0 || $name === '') {
            echo json_encode(['status' => 'error', 'message' => 'Missing ID or name']);
            exit;
        }

        // Prepare SQL query to update location name where ID matches
        $stmt = $conn->prepare("UPDATE location SET name = ? WHERE id = ?");

        // Execute the update with new name and ID
        $stmt->execute([$name, $id]);

        // Return success response
        echo json_encode(['status' => 'success', 'message' => 'Location updated']);

    // Handle DELETE request to remove a location by ID
    } elseif ($action === 'delete') {
        // Get ID from URL query string
        $id = (int)($_GET['id'] ?? 0);

        // Validate that ID is a non-zero integer
        if ($id === 0) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid ID']);
            exit;
        }

        // Prepare SQL query to delete location with the given ID
        $stmt = $conn->prepare("DELETE FROM location WHERE id = ?");

        // Execute the delete statement with the ID
        $stmt->execute([$id]);

        // Return success response
        echo json_encode(['status' => 'success', 'message' => 'Location deleted']);

    // If none of the above actions match, return an error
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
    }

// Catch any PDO-related database errors (note: you're using MySQLi, not PDO, so this won't catch MySQLi exceptions)
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
