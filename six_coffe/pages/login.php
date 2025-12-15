<?php
require_once __DIR__ . "/../config/config.php";

$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $email = trim($_POST['email'] ?? '');
  $pass  = $_POST['password'] ?? '';

  $stmt = $pdo->prepare("SELECT id,name,email,password_hash,role FROM users WHERE email=?");
  $stmt->execute([$email]);
  $u = $stmt->fetch();

  if ($u && password_verify($pass, $u['password_hash'])) {
    $_SESSION['user'] = [
      'id' => (int)$u['id'],
      'name' => $u['name'],
      'email' => $u['email'],
      'role' => $u['role'],
    ];

    header("Location: " . ($u['role']==='admin'
      ? BASE_URL . "/pages/admin.php"
      : BASE_URL . "/pages/index.php"));
    exit;
  } else {
    $error = "Email atau password salah.";
  }
}

include __DIR__ . "/../templates/header.php";
?>

<div class="max-w-md mx-auto card card-pad">
  <h1 class="text-2xl font-extrabold">Login</h1>
  <p class="mt-2 muted text-sm">Masuk untuk melakukan pemesanan dan review.</p>

  <?php if($error): ?>
    <div class="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
      <?= htmlspecialchars($error) ?>
    </div>
  <?php endif; ?>

  <form class="mt-6 space-y-3" method="post">
    <input class="inp" name="email" type="email" placeholder="Email" required>
    <input class="inp" name="password" type="password" placeholder="Password" required>
    <button class="btn btn-primary w-full" type="submit">Masuk</button>
  </form>

  <div class="mt-4 text-sm muted">
    Belum punya akun?
    <a class="text-white underline" href="<?= BASE_URL ?>/pages/register.php">Register</a>
  </div>
</div>

<?php include __DIR__ . "/../templates/footer.php"; ?>
