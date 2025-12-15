<?php
require_once __DIR__ . "/../config/config.php";
requireAdmin();

$items = $pdo->query("SELECT * FROM menu_items ORDER BY category, name")->fetchAll();
include __DIR__ . "/../templates/header.php";
?>

<h1 class="text-3xl font-extrabold">Admin - Kelola Menu</h1>
<p class="mt-2 muted">Tambah, edit, hapus menu.</p>

<div class="mt-6 card card-pad">
  <h2 class="text-xl font-bold">Tambah Menu</h2>

  <form class="mt-4 grid md:grid-cols-2 gap-3" method="post" action="<?= BASE_URL ?>/actions/menu_create.php">
    <input name="name" placeholder="Nama menu (contoh: Cappuccino)" required class="inp">
    <input name="price" type="number" min="1" placeholder="Harga (contoh: 20000)" required class="inp">

    <input name="category" placeholder="Kategori (coffee / non-coffee / food)" required class="inp">
    <input name="image_url" placeholder="Image URL (opsional)" class="inp">

    <textarea name="description" placeholder="Deskripsi (opsional)"
              class="inp md:col-span-2" rows="3"></textarea>

    <button class="btn btn-warning md:col-span-2" type="submit">
      Simpan Menu
    </button>
  </form>

  <div class="mt-3 text-xs muted">
    Tips: kategori yang konsisten bikin filter menu rapi: <b>coffee</b>, <b>non-coffee</b>, <b>food</b>.
  </div>
</div>

<div class="mt-8 card card-pad">
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
    <h2 class="text-xl font-bold">Daftar Menu</h2>
    <div class="text-sm muted">Total: <b class="text-zinc-100"><?= count($items) ?></b> item</div>
  </div>

  <div class="mt-4 overflow-x-auto">
    <table class="w-full text-sm">
      <thead class="text-zinc-400">
        <tr class="border-b border-zinc-800">
          <th class="text-left py-2">Nama</th>
          <th class="text-left py-2">Kategori</th>
          <th class="text-right py-2">Harga</th>
          <th class="text-left py-2">Aksi</th>
        </tr>
      </thead>

      <tbody>
        <?php foreach($items as $it): ?>
          <tr class="border-b border-zinc-800">
            <td class="py-2 font-semibold"><?= htmlspecialchars($it['name']) ?></td>
            <td class="py-2"><?= htmlspecialchars($it['category'] ?? '-') ?></td>
            <td class="py-2 text-right">Rp <?= number_format((int)$it['price'],0,',','.') ?></td>
            <td class="py-2">
              <div class="flex flex-wrap gap-2">
                <a class="btn btn-secondary"
                   href="<?= BASE_URL ?>/pages/admin_menu_edit.php?id=<?= (int)$it['id'] ?>">
                  Edit
                </a>

                <form method="post" action="<?= BASE_URL ?>/actions/menu_delete.php"
                      onsubmit="return confirm('Hapus menu ini?')">
                  <input type="hidden" name="id" value="<?= (int)$it['id'] ?>">
                  <button class="btn btn-danger" type="submit">Hapus</button>
                </form>
              </div>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>

<?php include __DIR__ . "/../templates/footer.php"; ?>
