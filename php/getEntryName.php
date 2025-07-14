<?php
ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");
header('Content-Type: application/json; charset=UTF-8');
$id = $_GET['id'] ?? '';
$type = $_GET['type'] ?? '';
$name = '';
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);
if ($id && $type) {
    switch ($type) {
        case 'personnel':
            $stmt = $conn->prepare("SELECT firstName, lastName FROM personnel WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->bind_result($first, $last);
            if ($stmt->fetch()) {
                $name = "$last $first";
            }
            break;

        case 'department':
            $stmt = $conn->prepare("SELECT name FROM department WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->bind_result($deptName);
            if ($stmt->fetch()) {
                $name = $deptName;
            }
            break;

        case 'location':
            $stmt = $conn->prepare("SELECT name FROM location WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->bind_result($locName);
            if ($stmt->fetch()) {
                $name = $locName;
            }
            break;
    }
}

echo json_encode([
    "success" => !empty($name),
    "name" => $name
]);
