<?php
require_once __DIR__ . "/../config/config.php";
requireLogin();

$userId = (int)$_SESSION['user']['id'];
$menuId = (int)($_POST['menu_item_id'] ?? 0);
$qty    = max(1, (int)($_POST['qty'] ?? 1));

$stmt = $pdo->prepare("SELECT price FROM menu_items WHERE id=?");
$stmt->execute([$menuId]);
$item = $stmt->fetch();
if (!$item) die("Menu tidak ditemukan.");

$priceEach = (int)$item['price'];
$total = $priceEach * $qty;

$pdo->beginTransaction();
try {
  // orders
  $pdo->prepare("INSERT INTO orders (user_id,total_price,status) VALUES (?,?, 'pending')")
      ->execute([$userId, $total]);
  $orderId = (int)$pdo->lastInsertId();

  // order_items
  $pdo->prepare("INSERT INTO order_items (order_id,menu_item_id,quantity,price) VALUES (?,?,?,?)")
      ->execute([$orderId, $menuId, $qty, $priceEach]);

  $pdo->commit();
} catch (Throwable $e) {
  $pdo->rollBack();
  die("Gagal membuat pesanan: " . $e->getMessage());
}

header("Location: " . BASE_URL . "/pages/my_orders.php");
exit;
