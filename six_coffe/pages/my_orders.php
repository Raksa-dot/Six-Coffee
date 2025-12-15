<?php
require_once __DIR__ . "/../config/config.php";
requireLogin();

$userId = (int)$_SESSION['user']['id'];

$stmt = $pdo->prepare("SELECT * FROM orders WHERE user_id=? ORDER BY id DESC");
$stmt->execute([$userId]);
$orders = $stmt->fetchAll();

$orderIds = array_map(fn($o) => (int)$o['id'], $orders);
$itemsByOrder = [];

if ($orderIds) {
  $placeholders = implode(',', array_fill(0, count($orderIds), '?'));
  $stmt2 = $pdo->prepare("
    SELECT oi.order_id, oi.quantity, oi.price,
           mi.name AS menu_name, mi.category
    FROM order_items oi
    JOIN menu_items mi ON mi.id = oi.menu_item_id
    WHERE oi.order_id IN ($placeholders)
    ORDER BY oi.order_id DESC
  ");
  $stmt2->execute($orderIds);
  $rows = $stmt2->fetchAll();

  foreach ($rows as $r) {
    $oid = (int)$r['order_id'];
    if (!isset($itemsByOrder[$oid])) $itemsByOrder[$oid] = [];
    $itemsByOrder[$oid][] = $r;
  }
}

function statusBadge($s){
  if ($s === 'accepted') return 'badge badge-accepted';
  if ($s === 'rejected') return 'badge badge-rejected';
  return 'badge badge-pending';
}

include __DIR__ . "/../templates/header.php";
?>

<h1 class="text-3xl font-extrabold">Pesanan Saya</h1>
<p class="mt-2 muted">Status berubah setelah admin verifikasi.</p>

<div class="mt-6 space-y-4">
  <?php if (!$orders): ?>
    <div class="card card-pad text-zinc-300">Belum ada pesanan.</div>
  <?php endif; ?>

  <?php foreach($orders as $o): ?>
    <?php $oid = (int)$o['id']; ?>
    <div class="card card-pad">
      <div class="flex justify-between items-start gap-4">
        <div>
          <div class="text-lg font-bold">Order #<?= $oid ?></div>
          <div class="text-xs muted mt-1"><?= htmlspecialchars($o['created_at']) ?></div>
        </div>
        <span class="<?= statusBadge($o['status']) ?>"><?= htmlspecialchars($o['status']) ?></span>
      </div>

      <div class="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <div class="text-sm font-bold">Detail Pesanan</div>

        <?php $list = $itemsByOrder[$oid] ?? []; ?>
        <?php if (!$list): ?>
          <div class="mt-2 text-sm muted">Tidak ada item.</div>
        <?php else: ?>
          <div class="mt-3 overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="text-zinc-400">
                <tr class="border-b border-zinc-800">
                  <th class="text-left py-2">Menu</th>
                  <th class="text-right py-2">Qty</th>
                  <th class="text-right py-2">Harga</th>
                  <th class="text-right py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <?php foreach($list as $it): ?>
                  <?php
                    $qty = (int)$it['quantity'];
                    $price = (int)$it['price'];
                    $sub = $qty * $price;
                  ?>
                  <tr class="border-b border-zinc-800">
                    <td class="py-2"><?= htmlspecialchars($it['menu_name']) ?></td>
                    <td class="py-2 text-right"><?= $qty ?></td>
                    <td class="py-2 text-right">Rp <?= number_format($price,0,',','.') ?></td>
                    <td class="py-2 text-right">Rp <?= number_format($sub,0,',','.') ?></td>
                  </tr>
                <?php endforeach; ?>
              </tbody>
            </table>
          </div>
        <?php endif; ?>
      </div>

      <div class="mt-4">
        Total: <b>Rp <?= number_format((int)$o['total_price'],0,',','.') ?></b>
      </div>
    </div>
  <?php endforeach; ?>
</div>

<?php include __DIR__ . "/../templates/footer.php"; ?>
