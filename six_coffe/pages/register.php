<?php
require_once __DIR__ . "/../config/config.php";

$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name  = trim($_POST['name'] ?? '');
  $email = trim($_POST['email'] ?? '');
  $pass  = $_POST['password'] ?? '';

  if ($name === '' || $email === '' || strlen($pass) < 6) {
    $error = "Nama/email wajib. Password minimal 6 karakter.";
  } else {
    $hash = password_hash($pass, PASSWORD_DEFAULT);
    try {
      $pdo->prepare("INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,'user')")
          ->execute([$name,$email,$hash]);
      header("Location: " . BASE_URL . "/pages/login.php");
      exit;
    } catch (Throwable $e) {
      $error = "Email sudah dipakai.";
    }
  }
}

include __DIR__ . "/../templates/header.php";
?>

<div class="max-w-md mx-auto card card-pad">
  <h1 class="text-2xl font-extrabold">Register</h1>
  <p class="mt-2 muted text-sm">Buat akun untuk mulai pesan dan memberi review.</p>

  <?php if($error): ?>
    <div class="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
      <?= htmlspecialchars($error) ?>
    </div>
  <?php endif; ?>

  <form class="mt-6 space-y-3" method="post">
    <input class="inp" name="name" placeholder="Nama" required>
    <input class="inp" name="email" type="email" placeholder="Email" required>
    <input class="inp" name="password" type="password" placeholder="Password (min 6)" required>
    <button class="btn btn-primary w-full" type="submit">Daftar</button>
  </form>

  <div class="mt-4 text-sm muted">
    Sudah punya akun?
    <a class="text-white underline" href="<?= BASE_URL ?>/pages/login.php">Login</a>
  </div>
</div>

<?php include __DIR__ . "/../templates/footer.php"; ?>
