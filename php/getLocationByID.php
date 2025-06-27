<?php

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
		echo json_encode($output);
		exit;
	}

	$query = $conn->prepare('SELECT * FROM location WHERE id = ?');
	$query->bind_param("i", $_REQUEST['id']);
	$query->execute();

	$result = $query->get_result();
	$data = $result->fetch_assoc();

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['data'] = $data;

	mysqli_close($conn);

	echo json_encode($output);
?>
