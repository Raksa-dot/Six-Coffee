<?php
require_once __DIR__ . "/../config/config.php";
include __DIR__ . "/../templates/header.php";
?>

<!-- HERO (Brand-first, no menu list) -->
<section class="card card-pad">
  <div class="absolute inset-0 pointer-events-none"
       style="background: radial-gradient(900px 340px at 20% 0%, rgba(245,158,11,.14), transparent 55%),
                           radial-gradient(700px 320px at 95% 10%, rgba(34,197,94,.10), transparent 60%);">
  </div>

  <div class="relative grid md:grid-cols-2 gap-8 items-center">
    <div>
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-950/40 text-xs text-zinc-200">
        ☕ Premium Coffee Experience
      </div>

      <h1 class="mt-4 text-4xl md:text-5xl font-extrabold leading-tight">
        SIX COFFE
        <span class="block text-zinc-200/90 text-2xl md:text-3xl font-extrabold mt-2">
          Dark, elegant, and consistently crafted.
        </span>
      </h1>

      <p class="mt-4 muted">
        Coffee shop yang fokus pada konsistensi rasa: espresso clean, susu seimbang, dan non-kopi yang tetap “niat”.
        Tempat nyaman untuk nongkrong, nugas, atau meeting santai.
      </p>

      <div class="mt-6 flex flex-wrap gap-2">
        <a href="<?= BASE_URL ?>/pages/menu.php" class="btn btn-primary">Lihat Menu</a>

        <?php if (isLoggedIn() && !isAdmin()): ?>
          <a href="<?= BASE_URL ?>/pages/my_orders.php" class="btn btn-secondary">Pesanan Saya</a>
        <?php elseif (!isLoggedIn()): ?>
          <a href="<?= BASE_URL ?>/pages/login.php" class="btn btn-secondary">Login untuk Pesan</a>
        <?php endif; ?>

        <a href="<?= BASE_URL ?>/pages/about.php" class="btn btn-secondary">Tentang Kami</a>
      </div>

      <div class="mt-7 grid grid-cols-2 gap-3 text-sm">
        <div class="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
          <div class="muted text-xs">Jam buka</div>
          <div class="font-extrabold mt-1">10.00 – 22.00</div>
        </div>
        <div class="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
          <div class="muted text-xs">Lokasi</div>
          <div class="font-extrabold mt-1">Isi alamat kamu</div>
        </div>
      </div>
    </div>

    <!-- Right panel: value + flow -->
    <div class="relative">
      <div class="rounded-2xl border border-zinc-800 bg-zinc-950/55 p-6">
        <h2 class="text-xl font-extrabold">Kenapa SIX COFFE?</h2>

        <div class="mt-4 grid gap-3">
          <div class="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div class="text-sm font-extrabold">Konsistensi rasa</div>
            <div class="text-sm muted mt-1">Takaran, extraction, dan kebersihan bar terjaga.</div>
          </div>

          <div class="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div class="text-sm font-extrabold">Non-kopi tetap premium</div>
            <div class="text-sm muted mt-1">Bahan berkualitas, rasa creamy dan balanced.</div>
          </div>

          <div class="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div class="text-sm font-extrabold">Tempat nyaman</div>
            <div class="text-sm muted mt-1">Cocok untuk kerja, ngobrol, dan santai.</div>
          </div>
        </div>

        <div class="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
          <div class="text-xs muted">Flow pemesanan</div>
          <div class="mt-2 text-sm text-zinc-200 leading-relaxed">
            Pilih menu → Login → Pesan → Status <span class="badge badge-pending">pending</span> →
            Admin verifikasi → <span class="badge badge-accepted">accepted</span> / <span class="badge badge-rejected">rejected</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- BRAND SECTION (Story) -->
<section class="mt-10 grid md:grid-cols-3 gap-4">
  <div class="card card-pad md:col-span-2">
    <h2 class="text-2xl font-extrabold">Signature Experience</h2>
    <p class="mt-3 muted">
      Kami percaya coffee shop yang baik itu bukan hanya soal “kopi enak”, tapi juga pengalaman: rasa konsisten,
      layanan ramah, dan tempat yang bikin betah.
    </p>

    <div class="mt-6 grid md:grid-cols-3 gap-3">
      <div class="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
        <div class="text-sm font-extrabold">Clean Espresso</div>
        <div class="text-sm muted mt-1">Aroma kuat, aftertaste rapi.</div>
      </div>
      <div class="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
        <div class="text-sm font-extrabold">Balanced Milk</div>
        <div class="text-sm muted mt-1">Foam halus, tidak eneg.</div>
      </div>
      <div class="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
        <div class="text-sm font-extrabold">Premium Non-Coffee</div>
        <div class="text-sm muted mt-1">Cokelat & creamy yang “niat”.</div>
      </div>
    </div>
  </div>

  <div class="card card-pad">
    <h3 class="text-xl font-extrabold">Info</h3>
    <div class="mt-4 space-y-3 text-sm">
      <div class="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
        <div class="muted text-xs">WhatsApp</div>
        <div class="font-extrabold mt-1">08xx-xxxx-xxxx</div>
      </div>
      <div class="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
        <div class="muted text-xs">Instagram</div>
        <div class="font-extrabold mt-1">@sixcoffe</div>
      </div>
      <div class="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
        <div class="muted text-xs">Alamat</div>
        <div class="font-extrabold mt-1">Kota kamu</div>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="mt-10 card card-pad">
  <div class="absolute inset-0 pointer-events-none"
       style="background: radial-gradient(900px 320px at 10% 0%, rgba(245,158,11,.12), transparent 55%),
                           radial-gradient(900px 320px at 90% 100%, rgba(251,146,60,.10), transparent 60%);">
  </div>

  <div class="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div>
      <h3 class="text-2xl font-extrabold">Ready to order?</h3>
      <p class="mt-2 muted">Buka halaman menu untuk mulai pesan. Admin akan memverifikasi pesananmu.</p>
    </div>
    <div class="flex flex-wrap gap-2">
      <a href="<?= BASE_URL ?>/pages/menu.php" class="btn btn-primary">Buka Menu</a>
      <a href="<?= BASE_URL ?>/pages/about.php" class="btn btn-secondary">Kenal Crew</a>
    </div>
  </div>
</section>

<?php include __DIR__ . "/../templates/footer.php"; ?>
