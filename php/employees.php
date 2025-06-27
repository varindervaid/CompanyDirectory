<?php
require 'db_connect.php';
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

try {
    if ($action === 'get') {
        // Fetch all employees
        $stmt = $pdo->query("SELECT * FROM employees ORDER BY id DESC");
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['status' => 'success', 'data' => $data]);
    }

    elseif ($action === 'add') {
        $name = trim($_POST['name'] ?? '');

        if ($name === '') {
            echo json_encode(['status' => 'error', 'message' => 'Name is required']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO employees (name) VALUES (?)");
        $stmt->execute([$name]);
        echo json_encode(['status' => 'success', 'message' => 'Employee added']);
    }

    elseif ($action === 'edit') {
        $id = (int)($_POST['id'] ?? 0);
        $name = trim($_POST['name'] ?? '');

        if ($id === 0 || $name === '') {
            echo json_encode(['status' => 'error', 'message' => 'Missing ID or name']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE employees SET name = ? WHERE id = ?");
        $stmt->execute([$name, $id]);
        echo json_encode(['status' => 'success', 'message' => 'Employee updated']);
    }

    elseif ($action === 'delete') {
        $id = (int)($_GET['id'] ?? 0);

        if ($id === 0) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid ID']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM employees WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success', 'message' => 'Employee deleted']);
    }

    else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
    }

} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
