<?php
require_once __DIR__ . "/../config/config.php";
requireLogin();

$userId = (int)$_SESSION['user']['id'];
$menuItemIdRaw = trim($_POST['menu_item_id'] ?? '');
$menuItemId = ($menuItemIdRaw === '') ? null : (int)$menuItemIdRaw;

$rating = (int)($_POST['rating'] ?? 5);
if ($rating < 1) $rating = 1;
if ($rating > 5) $rating = 5;

$content = trim($_POST['content'] ?? '');
if ($content === '') {
  setFlash('error', "Review kosong. Tulis dulu ya.");
  header("Location: " . BASE_URL . "/pages/reviews.php");
  exit;
}

// validasi menu_item_id kalau ada
if ($menuItemId !== null) {
  $chk = $pdo->prepare("SELECT id FROM menu_items WHERE id=?");
  $chk->execute([$menuItemId]);
  if (!$chk->fetch()) {
    $menuItemId = null; // kalau menu tidak ada, simpan sebagai general review
  }
}

$pdo->prepare("INSERT INTO reviews (user_id, menu_item_id, content, rating) VALUES (?,?,?,?)")
    ->execute([$userId, $menuItemId, $content, $rating]);

setFlash('success', "Review berhasil dikirim. Terima kasih!");

// redirect: kalau review untuk menu tertentu, balik ke halaman detail menu
if ($menuItemId !== null) {
  header("Location: " . BASE_URL . "/pages/menu_detail.php?id=" . $menuItemId);
  exit;
}

// kalau review umum (tanpa menu), balik ke halaman reviews
header("Location: " . BASE_URL . "/pages/reviews.php");
exit;
