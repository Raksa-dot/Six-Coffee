<?php
require_once __DIR__ . "/../config/config.php";

/**
 * Nav active helper (simple & stable)
 * - Checks if current URL contains the file name (index.php, menu.php, etc.)
 */
function navItem(string $file, string $label): void {
  $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '';
  $isActive = (strpos($path, '/' . $file) !== false);
  $cls = $isActive ? "nav-pill nav-pill-active" : "nav-pill";
  echo '<a href="'. BASE_URL . '/pages/' . htmlspecialchars($file) . '" class="'. $cls .'">'. htmlspecialchars($label) .'</a>';
}
?>
<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>SIX COFFE</title>

  <style>
    /* =========================
       THEME: DARK ELEGANT GRADIENT
       ========================= */
    :root{
      --bg-main:#09090b;
      --bg-card:#101014;
      --border-soft:#27272a;
      --text-main:#f4f4f5;
      --text-muted:#a1a1aa;

      --accent-from:#f59e0b; /* amber */
      --accent-to:#fb923c;   /* orange */
      --success-from:#22c55e;
      --success-to:#4ade80;
      --danger-from:#ef4444;
      --danger-to:#f87171;
    }

    body{
      background:
        radial-gradient(1200px 600px at 10% -10%, rgba(245,158,11,.10), transparent 45%),
        radial-gradient(900px 500px at 90% 5%, rgba(34,197,94,.08), transparent 42%),
        radial-gradient(800px 500px at 50% 120%, rgba(251,146,60,.08), transparent 55%),
        var(--bg-main);
      color:var(--text-main);
    }

    /* Layout */
    .container-app{max-width:72rem;margin:0 auto;padding:0 1rem;}
    .muted{color:var(--text-muted);}

    /* Card */
    .card{
      background:
        linear-gradient(180deg, rgba(255,255,255,.03), transparent),
        var(--bg-card);
      border:1px solid var(--border-soft);
      border-radius:1.35rem;
      box-shadow: 0 18px 60px rgba(0,0,0,.40);
      position: relative;
      overflow: hidden;
    }
    .card::before{
      content:"";
      position:absolute;
      inset:0;
      pointer-events:none;
      background: radial-gradient(700px 240px at 20% 0%, rgba(245,158,11,.10), transparent 55%);
      opacity:.9;
    }
    .card-pad{padding:1.25rem;}
    @media (min-width:768px){.card-pad{padding:1.6rem;}}

    /* Buttons */
    .btn{
      display:inline-flex;align-items:center;justify-content:center;gap:.5rem;
      padding:.70rem 1.10rem;border-radius:999px;font-weight:800;letter-spacing:.02em;
      transition: all .18s ease;border:1px solid transparent;user-select:none;
      position:relative;overflow:hidden;
    }
    .btn:active{transform:translateY(1px);}
    .btn-primary{
      background:linear-gradient(135deg,var(--accent-from),var(--accent-to));
      color:#0a0a0a;
      box-shadow: 0 12px 30px rgba(245,158,11,.18);
    }
    .btn-primary:hover{filter:brightness(1.05);transform:translateY(-1px);}
    .btn-secondary{
      background:rgba(255,255,255,.04);
      border-color:var(--border-soft);
      color:var(--text-main);
    }
    .btn-secondary:hover{background:rgba(255,255,255,.07);}
    .btn-success{
      background:linear-gradient(135deg,var(--success-from),var(--success-to));
      color:#0a0a0a;
    }
    .btn-success:hover{filter:brightness(1.03);transform:translateY(-1px);}
    .btn-danger{
      background:linear-gradient(135deg,var(--danger-from),var(--danger-to));
      color:#fff;
    }
    .btn-danger:hover{filter:brightness(1.03);transform:translateY(-1px);}
    .btn-warning{
      background:linear-gradient(135deg,var(--accent-from),var(--accent-to));
      color:#0a0a0a;
    }

    /* Inputs */
    .inp{
      width:100%;
      padding:.75rem 1rem;
      border-radius:999px;
      background:rgba(255,255,255,.04);
      border:1px solid var(--border-soft);
      color:var(--text-main);
      outline:none;
    }
    .inp:focus{
      border-color:rgba(245,158,11,.75);
      box-shadow:0 0 0 2px rgba(245,158,11,.18);
    }
    textarea.inp{border-radius:1.05rem;}

    /* Badges */
    .badge{
      display:inline-flex;align-items:center;
      padding:.28rem .70rem;border-radius:999px;
      font-size:.72rem;font-weight:900;letter-spacing:.06em;
      border:1px solid transparent;
    }
    .badge-pending{
      background:linear-gradient(135deg,rgba(245,158,11,.16),rgba(251,146,60,.14));
      border-color:rgba(245,158,11,.35);
      color:#fde68a;
    }
    .badge-accepted{
      background:rgba(34,197,94,.14);
      border-color:rgba(34,197,94,.35);
      color:#86efac;
    }
    .badge-rejected{
      background:rgba(239,68,68,.14);
      border-color:rgba(239,68,68,.35);
      color:#fca5a5;
    }

    /* Navbar */
    nav{
      position: sticky;
      top: 0;
      z-index: 50;
      background: rgba(9,9,11,.65);
      border-bottom: 1px solid rgba(39,39,42,.9);
      backdrop-filter: blur(12px);
    }
    .nav-pill{
      padding:.50rem .90rem;border-radius:999px;
      color:var(--text-muted);
      transition: all .16s ease;
    }
    .nav-pill:hover{
      background:rgba(255,255,255,.05);
      color:var(--text-main);
    }
    .nav-pill-active{
      background:linear-gradient(135deg,rgba(245,158,11,.18),rgba(251,146,60,.14));
      border:1px solid rgba(245,158,11,.35);
      color:#fde68a;
    }

    /* Subtle page divider */
    .soft-divider{
      height:1px;
      background: linear-gradient(90deg, transparent, rgba(245,158,11,.22), rgba(255,255,255,.08), transparent);
    }
  </style>
</head>

<body>

<nav>
  <div class="container-app py-4 flex flex-wrap items-center justify-between gap-3">
    <!-- Brand -->
    <a href="<?= BASE_URL ?>/pages/index.php" class="text-xl font-extrabold tracking-wide">
      SIX <span style="background:linear-gradient(135deg,var(--accent-from),var(--accent-to));-webkit-background-clip:text;background-clip:text;color:transparent;">COFFE</span>
    </a>

    <!-- Menu -->
    <div class="flex flex-wrap items-center gap-2 text-sm">
      <?php
        navItem("index.php", "Home");
        navItem("menu.php", "Menu");
        navItem("about.php", "About");
        navItem("reviews.php", "Review");
      ?>

      <?php if (isLoggedIn()): ?>
        <?php if (isAdmin()): ?>
          <a href="<?= BASE_URL ?>/pages/admin.php" class="btn btn-warning">Admin</a>
          <a href="<?= BASE_URL ?>/pages/admin_menu.php" class="btn btn-secondary">Kelola Menu</a>
        <?php else: ?>
          <a href="<?= BASE_URL ?>/pages/my_orders.php" class="btn btn-success">Pesanan</a>
        <?php endif; ?>

        <a href="<?= BASE_URL ?>/actions/logout.php" class="btn btn-secondary">Logout</a>
      <?php else: ?>
        <a href="<?= BASE_URL ?>/pages/login.php" class="btn btn-primary">Login</a>
      <?php endif; ?>
    </div>
  </div>
  <div class="soft-divider"></div>
</nav>

<main class="container-app py-8">
  <?php $flash = getFlash(); ?>
  <?php if ($flash): ?>
    <?php
      $type = $flash['type'] ?? 'info';
      $msg  = $flash['message'] ?? '';
      $box = "border-zinc-700 bg-zinc-900/60 text-zinc-200";
      if ($type === 'success') $box = "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
      if ($type === 'error')   $box = "border-red-500/30 bg-red-500/10 text-red-200";
      if ($type === 'warning') $box = "border-amber-500/30 bg-amber-500/10 text-amber-200";
    ?>
    <div class="mb-6 rounded-2xl border p-4 <?= $box ?>">
      <div class="font-extrabold text-sm"><?= htmlspecialchars($msg) ?></div>
    </div>
  <?php endif; ?>
