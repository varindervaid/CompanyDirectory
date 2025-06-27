<?php
header("Content-Type: application/json");
include("db.php");

if (!isset($_GET['id'])) {
    echo json_encode(["success" => false, "message" => "No employee ID provided."]);
    exit;
}

$id = intval($_GET['id']);

$stmt = $conn->prepare("DELETE FROM personnel WHERE id = ?");
$stmt->bind_param("i", $id);
$success = $stmt->execute();
$stmt->close();

echo json_encode(["success" => $success]);
?>
