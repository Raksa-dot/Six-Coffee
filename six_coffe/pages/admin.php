<?php
require_once __DIR__ . "/../config/config.php";
requireAdmin();

$orders = $pdo->query("
  SELECT o.*, u.name AS user_name, u.email
  FROM orders o
  JOIN users u ON u.id = o.user_id
  ORDER BY (o.status='pending') DESC, o.id DESC
")->fetchAll();

$orderIds = array_map(fn($o) => (int)$o['id'], $orders);
$itemsByOrder = [];

if ($orderIds) {
  $placeholders = implode(',', array_fill(0, count($orderIds), '?'));
  $stmt = $pdo->prepare("
    SELECT oi.order_id, oi.quantity, oi.price,
           mi.name AS menu_name, mi.category
    FROM order_items oi
    JOIN menu_items mi ON mi.id = oi.menu_item_id
    WHERE oi.order_id IN ($placeholders)
    ORDER BY oi.order_id DESC
  ");
  $stmt->execute($orderIds);
  $rows = $stmt->fetchAll();

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

<h1 class="text-3xl font-extrabold">Dashboard Admin</h1>
<p class="mt-2 muted">Selamat datang, <b class="text-zinc-100"><?= htmlspecialchars($_SESSION['user']['name']) ?></b></p>

<div class="mt-6 space-y-4">
  <?php if(!$orders): ?>
    <div class="card card-pad text-zinc-300">Belum ada pesanan.</div>
  <?php endif; ?>

  <?php foreach($orders as $o): ?>
    <?php
      $oid = (int)$o['id'];
      $isPending = ($o['status'] === 'pending');
      $cardExtra = $isPending
        ? "border-amber-500/40 bg-gradient-to-br from-zinc-900 to-zinc-950"
        : "";
    ?>

    <div class="card card-pad <?= $cardExtra ?>">
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div class="text-lg font-bold flex items-center gap-2">
            Order #<?= $oid ?>
            <?php if($isPending): ?>
              <span class="text-xs px-2 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-extrabold">
                BUTUH VERIFIKASI
              </span>
            <?php endif; ?>
          </div>

          <div class="text-sm muted mt-1">
            <?= htmlspecialchars($o['user_name']) ?> (<?= htmlspecialchars($o['email']) ?>)
          </div>
          <div class="text-xs muted mt-1"><?= htmlspecialchars($o['created_at']) ?></div>
        </div>

        <span class="<?= statusBadge($o['status']) ?>"><?= htmlspecialchars($o['status']) ?></span>
      </div>

      <!-- Quick actions (1 klik) -->
      <div class="mt-4 flex flex-wrap gap-2">
        <form method="post" action="<?= BASE_URL ?>/actions/admin_update_order.php">
          <input type="hidden" name="order_id" value="<?= $oid ?>">
          <input type="hidden" name="status" value="accepted">
          <button class="btn btn-success" type="submit">Accept</button>
        </form>

        <form method="post" action="<?= BASE_URL ?>/actions/admin_update_order.php"
              onsubmit="return confirm('Yakin reject order ini?')">
          <input type="hidden" name="order_id" value="<?= $oid ?>">
          <input type="hidden" name="status" value="rejected">
          <button class="btn btn-danger" type="submit">Reject</button>
        </form>

        <form class="flex gap-2" method="post" action="<?= BASE_URL ?>/actions/admin_update_order.php">
          <input type="hidden" name="order_id" value="<?= $oid ?>">
          <select name="status" class="inp" style="width:auto; min-width: 180px;">
            <option value="pending"  <?= $o['status']==='pending'?'selected':'' ?>>pending</option>
            <option value="accepted" <?= $o['status']==='accepted'?'selected':'' ?>>accepted</option>
            <option value="rejected" <?= $o['status']==='rejected'?'selected':'' ?>>rejected</option>
          </select>
          <button class="btn btn-warning" type="submit">Update</button>
        </form>
      </div>

      <!-- Detail order items -->
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
