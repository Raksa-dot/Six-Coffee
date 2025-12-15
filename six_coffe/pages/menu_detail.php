<?php
require_once __DIR__ . "/../config/config.php";

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) { http_response_code(404); die("Menu tidak ditemukan."); }

$stmt = $pdo->prepare("SELECT * FROM menu_items WHERE id=?");
$stmt->execute([$id]);
$item = $stmt->fetch();
if (!$item) { http_response_code(404); die("Menu tidak ditemukan."); }

$stmt = $pdo->prepare("SELECT COUNT(*) AS total_reviews, AVG(rating) AS avg_rating FROM reviews WHERE menu_item_id=?");
$stmt->execute([$id]);
$st = $stmt->fetch();
$cnt = (int)($st['total_reviews'] ?? 0);
$avg = (float)($st['avg_rating'] ?? 0);

$stmt = $pdo->prepare("
  SELECT r.*, u.name AS user_name
  FROM reviews r
  JOIN users u ON u.id=r.user_id
  WHERE r.menu_item_id=?
  ORDER BY r.id DESC
  LIMIT 50
");
$stmt->execute([$id]);
$reviews = $stmt->fetchAll();

function catLabel($c) {
  if ($c === 'coffee') return 'Coffee';
  if ($c === 'non-coffee') return 'Non-Coffee';
  if ($c === 'food') return 'Food';
  return $c ?: 'Other';
}
function starText($avg) {
  $full = (int)round($avg);
  $full = max(0, min(5, $full));
  return str_repeat("★", $full) . str_repeat("☆", 5 - $full);
}

include __DIR__ . "/../templates/header.php";
?>

<div class="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
  <div>
    <div class="text-xs text-amber-400 font-extrabold"><?= htmlspecialchars(catLabel($item['category'] ?? '')) ?></div>
    <h1 class="text-3xl font-extrabold mt-1"><?= htmlspecialchars($item['name']) ?></h1>
    <p class="mt-2 muted"><?= htmlspecialchars($item['description'] ?? '') ?></p>
  </div>

  <div class="flex gap-2">
    <a href="<?= BASE_URL ?>/pages/menu.php" class="btn btn-secondary">Kembali</a>
    <a href="<?= BASE_URL ?>/pages/reviews.php" class="btn btn-secondary">Semua Review</a>
  </div>
</div>

<div class="mt-6 grid md:grid-cols-2 gap-4">
  <div class="card card-pad">
    <div class="muted text-sm">Harga</div>
    <div class="mt-1 text-3xl font-extrabold">Rp <?= number_format((int)$item['price'],0,',','.') ?></div>

    <div class="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
      <div class="text-sm font-extrabold text-zinc-100">
        <?= $cnt > 0 ? starText($avg) : "☆☆☆☆☆" ?>
        <span class="muted font-normal">(<?= $cnt ?> review)</span>
      </div>
      <div class="mt-2 text-xs muted">
        <?= $cnt > 0 ? "Rata-rata: " . number_format($avg,1) . "/5" : "Belum ada review untuk menu ini." ?>
      </div>
    </div>

    <form class="mt-5 flex gap-2 items-center" method="post" action="<?= BASE_URL ?>/actions/order.php">
      <input type="hidden" name="menu_item_id" value="<?= (int)$item['id'] ?>">
      <input type="number" name="qty" min="1" value="1" class="inp" style="width: 110px;">
      <button class="btn btn-success w-full" type="submit">Pesan Sekarang</button>
    </form>

    <?php if (!isLoggedIn()): ?>
      <div class="mt-2 text-xs muted">* Untuk pesan/review kamu akan diarahkan login.</div>
    <?php endif; ?>
  </div>

  <div class="card card-pad">
    <h2 class="text-xl font-extrabold">Tulis Review</h2>

    <?php if (!isLoggedIn()): ?>
      <div class="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <p class="text-zinc-300">
          Kamu harus login untuk menulis review.
          <a class="underline text-white" href="<?= BASE_URL ?>/pages/login.php">Login</a>
        </p>
      </div>
    <?php else: ?>
      <form class="mt-4 space-y-3" method="post" action="<?= BASE_URL ?>/actions/review_create.php">
        <input type="hidden" name="menu_item_id" value="<?= (int)$item['id'] ?>">

        <div>
          <label class="text-sm muted">Rating</label>
          <select name="rating" class="inp mt-2">
            <option value="5">5 - Mantap</option>
            <option value="4">4 - Enak</option>
            <option value="3">3 - Oke</option>
            <option value="2">2 - Kurang</option>
            <option value="1">1 - Tidak suka</option>
          </select>
        </div>

        <div>
          <label class="text-sm muted">Komentar</label>
          <textarea name="content" required rows="4" class="inp mt-2"
            placeholder="Tulis review kamu..."></textarea>
        </div>

        <button class="btn btn-primary w-full" type="submit">Kirim Review</button>
      </form>
    <?php endif; ?>
  </div>
</div>

<h2 class="text-2xl font-extrabold mt-10">Review Terbaru</h2>
<p class="mt-2 muted">Menampilkan hingga 50 review terbaru untuk menu ini.</p>

<div class="mt-4 space-y-4">
  <?php if (!$reviews): ?>
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
          <div class="text-sm muted mt-1"><?= htmlspecialchars($r['created_at']) ?></div>
        </div>
        <div class="text-amber-400 font-extrabold">
          <span class="text-sm"><?= $stars ?></span>
          <span class="text-sm">(<?= $rating ?>/5)</span>
        </div>
      </div>

      <div class="mt-3 text-zinc-200 leading-relaxed">
        <?= nl2br(htmlspecialchars($r['content'] ?? '')) ?>
      </div>
    </div>
  <?php endforeach; ?>
</div>

<?php include __DIR__ . "/../templates/footer.php"; ?>
