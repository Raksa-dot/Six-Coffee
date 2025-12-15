<?php
require_once __DIR__ . "/../config/config.php";
requireAdmin();

$id = (int)($_POST['id'] ?? 0);
if ($id <= 0) {
  setFlash('error', "Gagal: ID tidak valid.");
  header("Location: " . BASE_URL . "/pages/admin_menu.php");
  exit;
}

$pdo->prepare("DELETE FROM menu_items WHERE id=?")->execute([$id]);

setFlash('success', "Menu berhasil dihapus.");

header("Location: " . BASE_URL . "/pages/admin_menu.php");
exit;
