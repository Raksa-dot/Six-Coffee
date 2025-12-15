<?php
require_once __DIR__ . "/../config/config.php";
requireAdmin();

$name = trim($_POST['name'] ?? '');
$price = (int)($_POST['price'] ?? 0);
$category = trim($_POST['category'] ?? '');
$desc = trim($_POST['description'] ?? '');
$image = trim($_POST['image_url'] ?? '');

if ($name === '' || $price <= 0 || $category === '') {
  setFlash('error', "Gagal: input menu tidak valid.");
  header("Location: " . BASE_URL . "/pages/admin_menu.php");
  exit;
}

$pdo->prepare("INSERT INTO menu_items (name, description, price, category, image_url) VALUES (?,?,?,?,?)")
    ->execute([$name, $desc, $price, $category, $image]);

setFlash('success', "Menu '$name' berhasil ditambahkan.");

header("Location: " . BASE_URL . "/pages/admin_menu.php");
exit;
