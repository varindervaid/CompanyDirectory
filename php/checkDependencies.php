<?php
// Show errors (for development only)
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");
header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
  echo json_encode(['error' => 'Database connection failed']);
  exit;
}

$type = $_GET['type'] ?? '';
$id = intval($_GET['id'] ?? 0);
$response = ['hasDependencies' => false];

if ($type === 'department') {
  $stmt = $conn->prepare("SELECT COUNT(*) FROM personnel WHERE departmentID = ?");
  $stmt->bind_param("i", $id);
} elseif ($type === 'location') {
  $stmt = $conn->prepare("SELECT COUNT(*) FROM department WHERE locationID = ?");
  $stmt->bind_param("i", $id);
} else {
  echo json_encode(['error' => 'Invalid type']);
  exit;
}

if ($stmt->execute()) {
  $stmt->bind_result($count);
  $stmt->fetch();
  $response['hasDependencies'] = $count > 0;
   $response['count'] = $count;
  $stmt->close();
} else {
  $response['error'] = 'Query failed';
}

$conn->close();
echo json_encode($response);
?>
