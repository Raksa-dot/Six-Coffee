<?php
require_once __DIR__ . "/../config/config.php";
requireAdmin();

$orderId = (int)($_POST['order_id'] ?? 0);
$status  = $_POST['status'] ?? 'pending';

$allowed = ['pending','accepted','rejected'];
if (!in_array($status, $allowed)) $status = 'pending';

$pdo->prepare("UPDATE orders SET status=? WHERE id=?")->execute([$status, $orderId]);

setFlash('success', "Order #$orderId berhasil diupdate menjadi '$status'.");

header("Location: " . BASE_URL . "/pages/admin.php");
exit;
