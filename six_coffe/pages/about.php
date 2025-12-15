<?php
require_once __DIR__ . "/../config/config.php";
include __DIR__ . "/../templates/header.php";

$crew = [
  ["name"=>"Dika R", "role"=>"Manager"],
  ["name"=>"Reno S", "role"=>"Barista"],
  ["name"=>"Iman CH", "role"=>"Waiters"],
  ["name"=>"Pasha P", "role"=>"Waiters"],
  ["name"=>"Jibran S", "role"=>"Cashier"],
  ["name"=>"Rangga Akhdan", "role"=>"Head Bar"],
];
?>

<div class="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
  <div>
    <h1 class="text-3xl font-extrabold">About SIX COFFE</h1>
    <p class="mt-2 muted">Profil coffee shop, kualitas produk, dan tim yang melayani kamu.</p>
  </div>
  <a href="<?= BASE_URL ?>/pages/menu.php" class="btn btn-secondary">Lihat Menu</a>
</div>

<div class="mt-6 grid md:grid-cols-2 gap-4">
  <div class="card card-pad">
    <h2 class="text-xl font-extrabold">Profil Coffee Shop</h2>
    <p class="mt-3 muted">
      SIX COFFE fokus pada rasa yang konsisten: espresso yang clean, susu seimbang,
      serta non-kopi yang tetap “niat” dari bahan berkualitas. Cocok untuk nongkrong, nugas,
      dan meeting santai.
    </p>
    <div class="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-200">
      <div class="font-extrabold">Value</div>
      <ul class="mt-2 space-y-1 muted">
        <li>• Konsistensi rasa</li>
        <li>• Kebersihan bar</li>
        <li>• Pelayanan ramah</li>
      </ul>
    </div>
  </div>

  <div class="card card-pad">
    <h2 class="text-xl font-extrabold">Kualitas Kopi & Non-Kopi</h2>
    <ul class="mt-3 space-y-2 muted">
      <li>✅ Grind & extraction dijaga untuk hasil yang stabil.</li>
      <li>✅ Non-kopi dibuat dari bahan premium dan takaran konsisten.</li>
      <li>✅ Kebersihan alat dan area bar jadi prioritas.</li>
    </ul>

    <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
      <div class="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <div class="muted text-xs">Signature</div>
        <div class="font-extrabold mt-1">Espresso & Cappuccino</div>
      </div>
      <div class="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <div class="muted text-xs">Non-kopi</div>
        <div class="font-extrabold mt-1">Chocolate Milk</div>
      </div>
    </div>
  </div>
</div>

<h2 class="text-2xl font-extrabold mt-10">Crew</h2>
<p class="mt-2 muted">Tim SIX COFFE yang siap melayani kamu setiap hari.</p>

<div class="mt-6 grid md:grid-cols-3 gap-4">
  <?php foreach($crew as $c): ?>
    <div class="card card-pad">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center font-extrabold">
          <?= htmlspecialchars(mb_substr($c['name'],0,1)) ?>
        </div>
        <div>
          <div class="text-lg font-extrabold"><?= htmlspecialchars($c['name']) ?></div>
          <div class="text-sm text-amber-400 font-extrabold"><?= htmlspecialchars($c['role']) ?></div>
        </div>
      </div>

      <div class="mt-4 flex gap-3">
        <!-- icon sosial placeholder -->
        <a href="#" class="btn btn-secondary" title="Instagram" style="padding:.5rem .7rem;">IG</a>
        <a href="#" class="btn btn-secondary" title="Twitter/X" style="padding:.5rem .7rem;">X</a>
        <a href="#" class="btn btn-secondary" title="LinkedIn" style="padding:.5rem .7rem;">IN</a>
      </div>

      <div class="mt-4 text-sm muted">
        Crew profile dapat dihubungkan ke sosial media asli jika sudah ada linknya.
      </div>
    </div>
  <?php endforeach; ?>
</div>

<?php include __DIR__ . "/../templates/footer.php"; ?>
