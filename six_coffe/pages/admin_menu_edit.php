<?php
require_once __DIR__ . "/../config/config.php";
requireAdmin();

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) die("ID tidak valid.");

$stmt = $pdo->prepare("SELECT * FROM menu_items WHERE id=?");
$stmt->execute([$id]);
$item = $stmt->fetch();
if (!$item) die("Menu tidak ditemukan.");

$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name = trim($_POST['name'] ?? '');
  $price = (int)($_POST['price'] ?? 0);
  $category = trim($_POST['category'] ?? '');
  $desc = trim($_POST['description'] ?? '');
  $image = trim($_POST['image_url'] ?? '');

  if ($name === '' || $price <= 0 || $category === '') {
    $error = "Input tidak valid.";
  } else {
    $pdo->prepare("UPDATE menu_items SET name=?, description=?, price=?, category=?, image_url=? WHERE id=?")
        ->execute([$name, $desc, $price, $category, $image, $id]);

    header("Location: " . BASE_URL . "/pages/admin_menu.php");
    exit;
  }
}

include __DIR__ . "/../templates/header.php";
?>

<h1 class="text-3xl font-bold">Edit Menu</h1>

<?php if($error): ?>
  <div class="mt-4 p-3 rounded bg-red-500/20 border border-red-500/40 text-sm">
    <?= htmlspecialchars($error) ?>
  </div>
<?php endif; ?>

<div class="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
  <form class="grid md:grid-cols-2 gap-3" method="post">
    <input name="name" value="<?= htmlspecialchars($item['name']) ?>" required
           class="rounded bg-zinc-800 border border-zinc-700 px-3 py-2">
    <input name="price" type="number" min="1" value="<?= (int)$item['price'] ?>" required
           class="rounded bg-zinc-800 border border-zinc-700 px-3 py-2">

    <input name="category" value="<?= htmlspecialchars($item['category'] ?? '') ?>" required
           class="rounded bg-zinc-800 border border-zinc-700 px-3 py-2">
    <input name="image_url" value="<?= htmlspecialchars($item['image_url'] ?? '') ?>"
           class="rounded bg-zinc-800 border border-zinc-700 px-3 py-2">

    <textarea name="description"
              class="md:col-span-2 rounded bg-zinc-800 border border-zinc-700 px-3 py-2"><?= htmlspecialchars($item['description'] ?? '') ?></textarea>

    <div class="md:col-span-2 flex gap-2">
      <button class="px-4 py-2 rounded bg-amber-500 text-black font-semibold">Update</button>
      <a href="<?= BASE_URL ?>/pages/admin_menu.php"
         class="px-4 py-2 rounded border border-zinc-700">Kembali</a>
    </div>
  </form>
</div>

<?php include __DIR__ . "/../templates/footer.php"; ?>
