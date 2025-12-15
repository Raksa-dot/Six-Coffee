<?php
require_once __DIR__ . "/../config/config.php";

// list review (umum + yang terkait menu)
$reviews = $pdo->query("
  SELECT r.*, u.name AS user_name, mi.name AS menu_name
  FROM reviews r
  JOIN users u ON u.id = r.user_id
  LEFT JOIN menu_items mi ON mi.id = r.menu_item_id
  ORDER BY r.id DESC
  LIMIT 50
")->fetchAll();

// dropdown menu (buat review per item)
$items = $pdo->query("SELECT id, name FROM menu_items ORDER BY name")->fetchAll();

include __DIR__ . "/../templates/header.php";
?>

<div class="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
  <div>
    <h1 class="text-3xl font-extrabold">Review</h1>
    <p class="mt-2 muted">Lihat ulasan pelanggan dan kirim review kamu juga.</p>
  </div>
  <a href="<?= BASE_URL ?>/pages/menu.php" class="btn btn-secondary">Lihat Menu</a>
</div>

<!-- FORM REVIEW -->
<div class="mt-6 card card-pad">
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
    <h2 class="text-xl font-bold">Tulis Review</h2>
    <div class="text-sm muted">Review yang sopan & jujur bikin SIX COFFE makin baik.</div>
  </div>

  <?php if (!isLoggedIn()): ?>
    <div class="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
      <p class="text-zinc-300">
        Kamu harus login untuk menulis review.
        <a class="text-white underline" href="<?= BASE_URL ?>/pages/login.php">Login</a>
      </p>
    </div>
  <?php else: ?>
    <form class="mt-4 grid md:grid-cols-2 gap-3" method="post" action="<?= BASE_URL ?>/actions/review_create.php">
      <div class="md:col-span-1">
        <label class="text-sm muted">Menu (opsional)</label>
        <select name="menu_item_id" class="inp mt-2">
          <option value="">(Umum) Tidak spesifik menu</option>
          <?php foreach($items as $it): ?>
            <option value="<?= (int)$it['id'] ?>"><?= htmlspecialchars($it['name']) ?></option>
          <?php endforeach; ?>
        </select>
      </div>

      <div class="md:col-span-1">
        <label class="text-sm muted">Rating</label>
        <select name="rating" class="inp mt-2">
          <option value="5">5 - Mantap</option>
          <option value="4">4 - Enak</option>
          <option value="3">3 - Oke</option>
          <option value="2">2 - Kurang</option>
          <option value="1">1 - Tidak suka</option>
        </select>
      </div>

      <div class="md:col-span-2">
        <label class="text-sm muted">Komentar</label>
        <textarea name="content" required rows="4"
          class="inp mt-2"
          placeholder="Tulis review kamu..."></textarea>
      </div>

      <div class="md:col-span-2 flex flex-col md:flex-row gap-2">
        <button class="btn btn-primary w-full md:w-auto" type="submit">Kirim Review</button>
        <a class="btn btn-secondary w-full md:w-auto" href="<?= BASE_URL ?>/pages/menu.php">Cari Menu</a>
      </div>
    </form>
  <?php endif; ?>
</div>

<!-- LIST REVIEW -->
<div class="mt-8 flex items-end justify-between gap-4">
  <div>
    <h2 class="text-2xl font-extrabold">Ulasan Terbaru</h2>
    <p class="mt-1 muted text-sm">Menampilkan 50 review terakhir.</p>
  </div>
</div>

<div class="mt-4 space-y-4">
  <?php if(!$reviews): ?>
    <div class="card card-pad text-zinc-300">Belum ada review.</div>
  <?php endif; ?>

  <?php foreach($reviews as $r): ?>
    <?php
      $rating = (int)($r['rating'] ?? 5);
      $stars = str_repeat("★", max(0, min(5, $rating))) . str_repeat("☆", 5 - max(0, min(5, $rating)));
    ?>
    <div class="card card-pad">
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <div class="font-bold text-lg"><?= htmlspecialchars($r['user_name']) ?></div>
          <div class="text-sm muted mt-1">
            <?= htmlspecialchars($r['created_at']) ?>
            <?php if (!empty($r['menu_name'])): ?>
              • <span class="text-zinc-200">Menu:</span> <?= htmlspecialchars($r['menu_name']) ?>
            <?php else: ?>
              • <span class="text-zinc-200">Review Umum</span>
            <?php endif; ?>
          </div>
        </div>

        <div class="text-amber-400 font-extrabold">
          <span class="text-sm"><?= $stars ?></span>
          <span class="text-sm">(<?= $rating ?>/5)</span>
        </div>
      </div>

      <div class="mt-3 text-zinc-200 leading-relaxed">
        <?= nl2br(htmlspecialchars($r['content'] ?? '')) ?>
      </div>

      <?php if (!empty($r['menu_item_id'])): ?>
        <div class="mt-4">
          <a class="btn btn-secondary"
             href="<?= BASE_URL ?>/pages/menu_detail.php?id=<?= (int)$r['menu_item_id'] ?>">
            Lihat Detail Menu
          </a>
        </div>
      <?php endif; ?>
    </div>
  <?php endforeach; ?>
</div>

<?php include __DIR__ . "/../templates/footer.php"; ?>
