<?php

	// Show errors (for development only)
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

	// Check for dependent departments first
	$checkQuery = $conn->prepare('SELECT id FROM department WHERE locationID = ?');
	$checkQuery->bind_param("i", $_REQUEST['id']);
	$checkQuery->execute();
	$checkResult = $checkQuery->get_result();

	if ($checkResult->num_rows > 0) {
		$output['status']['code'] = "409";
		$output['status']['name'] = "conflict";
		$output['status']['description'] = "Cannot delete location with assigned departments";
		$output['data'] = [];
		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}

	// Safe to delete
	$deleteQuery = $conn->prepare('DELETE FROM `location` WHERE id = ?');		
	$deleteQuery->bind_param("i", $_REQUEST['id']);
	$deleteQuery->execute();

	if ($deleteQuery === false) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "delete failed";
		$output['data'] = [];
		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "location deleted";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output);
?>
