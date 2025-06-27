<?php
require 'db_connect.php';
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

try {
    if ($action === 'get') {
        // Fetch all departments
        $stmt = $pdo->query("SELECT * FROM departments ORDER BY id DESC");
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['status' => 'success', 'data' => $data]);
    }

    elseif ($action === 'add') {
        $name = trim($_POST['name'] ?? '');
        if ($name === '') {
            echo json_encode(['status' => 'error', 'message' => 'Name is required']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO departments (name) VALUES (?)");
        $stmt->execute([$name]);
        echo json_encode(['status' => 'success', 'message' => 'Department added']);
    }

    elseif ($action === 'edit') {
        $id = (int)($_POST['id'] ?? 0);
        $name = trim($_POST['name'] ?? '');
        
        if ($id === 0 || $name === '') {
            echo json_encode(['status' => 'error', 'message' => 'Missing ID or name']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE departments SET name = ? WHERE id = ?");
        $stmt->execute([$name, $id]);
        echo json_encode(['status' => 'success', 'message' => 'Department updated']);
    }

    elseif ($action === 'delete' && isset($_GET['id'])) {
        $id = (int)$_GET['id'];

        $stmt = $pdo->prepare("DELETE FROM departments WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success', 'message' => 'Department deleted']);
    }

    else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
    }

} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
