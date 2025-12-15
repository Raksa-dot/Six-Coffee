<?php
require_once __DIR__ . "/../config/config.php";

// ===== FILTER INPUT =====
$cat = trim($_GET['cat'] ?? 'all');
$q   = trim($_GET['q'] ?? '');

$allowedCats = ['all','coffee','non-coffee','food'];
if (!in_array($cat, $allowedCats)) $cat = 'all';

// ===== AMBIL MENU (dengan filter) =====
$sql = "SELECT * FROM menu_items WHERE 1=1";
$params = [];

if ($cat !== 'all') {
  $sql .= " AND category = ?";
  $params[] = $cat;
}
if ($q !== '') {
  $sql .= " AND name LIKE ?";
  $params[] = "%" . $q . "%";
}
$sql .= " ORDER BY category, name";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$items = $stmt->fetchAll();

// ===== REVIEW STATS =====
$stats = $pdo->query("
  SELECT menu_item_id,
         COUNT(*) AS total_reviews,
         AVG(rating) AS avg_rating
  FROM reviews
  WHERE menu_item_id IS NOT NULL
  GROUP BY menu_item_id
")->fetchAll();

$reviewStats = [];
foreach ($stats as $s) {
  $mid = (int)$s['menu_item_id'];
  $reviewStats[$mid] = [
    'count' => (int)$s['total_reviews'],
    'avg'   => (float)$s['avg_rating'],
  ];
}

// ===== 2 REVIEW TERBARU PER MENU =====
$rows = $pdo->query("
  SELECT r.menu_item_id, r.rating, r.content,
         u.name AS user_name
  FROM reviews r
  JOIN users u ON u.id = r.user_id
  WHERE r.menu_item_id IS NOT NULL
  ORDER BY r.id DESC
")->fetchAll();

$latestReviews = [];
foreach ($rows as $r) {
  $mid = (int)$r['menu_item_id'];
  if (!isset($latestReviews[$mid])) $latestReviews[$mid] = [];
  if (count($latestReviews[$mid]) < 2) $latestReviews[$mid][] = $r;
}

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

function activeBtn($isActive) {
  return $isActive ? "btn btn-primary" : "btn btn-secondary";
}

include __DIR__ . "/../templates/header.php";
?>

<div class="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
  <div>
    <h1 class="text-3xl font-extrabold">Menu</h1>
    <p class="mt-2 muted">
      Filter kategori & cari menu. Klik <b>Detail</b> untuk lihat review lengkap.
    </p>
  </div>
  <a href="<?= BASE_URL ?>/pages/reviews.php" class="btn btn-secondary">Ke Review</a>
</div>

<!-- FILTER BAR -->
<div class="mt-6 card card-pad">
  <div class="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">

    <div class="flex flex-wrap gap-2">
      <a href="<?= BASE_URL ?>/pages/menu.php?cat=all&q=<?= urlencode($q) ?>" class="<?= activeBtn($cat==='all') ?>">All</a>
      <a href="<?= BASE_URL ?>/pages/menu.php?cat=coffee&q=<?= urlencode($q) ?>" class="<?= activeBtn($cat==='coffee') ?>">Coffee</a>
      <a href="<?= BASE_URL ?>/pages/menu.php?cat=non-coffee&q=<?= urlencode($q) ?>" class="<?= activeBtn($cat==='non-coffee') ?>">Non-Coffee</a>
      <a href="<?= BASE_URL ?>/pages/menu.php?cat=food&q=<?= urlencode($q) ?>" class="<?= activeBtn($cat==='food') ?>">Food</a>
    </div>

    <form class="flex gap-2 w-full md:w-auto" method="get" action="<?= BASE_URL ?>/pages/menu.php">
      <input type="hidden" name="cat" value="<?= htmlspecialchars($cat) ?>">
      <input name="q" value="<?= htmlspecialchars($q) ?>" placeholder="Cari menu... (contoh: cappuccino)"
             class="inp w-full md:w-80">
      <button class="btn btn-warning" type="submit">Cari</button>
    </form>

  </div>

  <div class="mt-3 text-sm muted">
    Hasil: <b class="text-zinc-100"><?= count($items) ?></b> item
    <?php if ($cat !== 'all'): ?> • kategori <b class="text-zinc-100"><?= htmlspecialchars($cat) ?></b><?php endif; ?>
    <?php if ($q !== ''): ?> • keyword <b class="text-zinc-100"><?= htmlspecialchars($q) ?></b><?php endif; ?>
  </div>
</div>

<!-- LIST MENU -->
<div class="mt-6 grid md:grid-cols-3 gap-4">
  <?php if(!$items): ?>
    <div class="md:col-span-3 card card-pad text-zinc-300">
      Tidak ada menu yang cocok.
      <a class="underline text-white" href="<?= BASE_URL ?>/pages/menu.php">Reset filter</a>
    </div>
  <?php endif; ?>

  <?php foreach($items as $it): ?>
    <?php
      $mid = (int)$it['id'];
      $st = $reviewStats[$mid] ?? ['count'=>0, 'avg'=>0.0];
      $avg = $st['avg'];
      $cnt = $st['count'];
      $two = $latestReviews[$mid] ?? [];
    ?>

    <div class="card card-pad">
      <div class="text-xs text-amber-400 font-extrabold"><?= htmlspecialchars(catLabel($it['category'] ?? '')) ?></div>
      <div class="text-lg font-extrabold mt-1"><?= htmlspecialchars($it['name']) ?></div>
      <div class="text-sm muted mt-1"><?= htmlspecialchars($it['description'] ?? '') ?></div>

      <div class="mt-3 text-2xl font-extrabold">
        Rp <?= number_format((int)$it['price'],0,',','.') ?>
      </div>

      <div class="mt-3 flex flex-wrap gap-2">
        <a class="btn btn-secondary"
           href="<?= BASE_URL ?>/pages/menu_detail.php?id=<?= $mid ?>">
          Detail
        </a>

        <form class="flex gap-2 items-center" method="post" action="<?= BASE_URL ?>/actions/order.php">
          <input type="hidden" name="menu_item_id" value="<?= $mid ?>">
          <input type="number" name="qty" min="1" value="1" class="inp" style="width: 90px;">
          <button class="btn btn-success" type="submit">Pesan</button>
        </form>
      </div>

      <?php if (!isLoggedIn()): ?>
        <div class="mt-2 text-xs muted">* Pesan akan meminta login.</div>
      <?php endif; ?>

      <!-- Rating -->
      <div class="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <div class="flex items-center justify-between gap-3">
          <div class="text-sm font-extrabold text-zinc-100">
            <?= $cnt > 0 ? starText($avg) : "☆☆☆☆☆" ?>
            <span class="muted font-normal">(<?= $cnt ?>)</span>
          </div>
          <a class="text-xs text-white underline"
             href="<?= BASE_URL ?>/pages/menu_detail.php?id=<?= $mid ?>">
            Lihat review
          </a>
        </div>

        <?php if ($cnt === 0): ?>
          <div class="mt-2 text-xs muted">Belum ada review.</div>
        <?php else: ?>
          <div class="mt-2 space-y-2">
            <?php foreach($two as $rv): ?>
              <div class="text-xs text-zinc-200">
                <span class="muted"><?= htmlspecialchars($rv['user_name']) ?></span>
                • <span class="text-amber-400 font-extrabold"><?= (int)$rv['rating'] ?>/5</span>
                <div class="muted">
                  <?= nl2br(htmlspecialchars(mb_strimwidth($rv['content'] ?? '', 0, 85, '...'))) ?>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      </div>
    </div>
  <?php endforeach; ?>
</div>

<?php include __DIR__ . "/../templates/footer.php"; ?>
