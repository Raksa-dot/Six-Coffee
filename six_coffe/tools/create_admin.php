<?php
require_once __DIR__ . "/../config/config.php";

$name = "Admin SIX COFFE";
$email = "admin@sixcoffe.com";
$plainPassword = "admin123";

try {
  $check = $pdo->prepare("SELECT id FROM users WHERE email=? LIMIT 1");
  $check->execute([$email]);

  if ($check->fetch()) {
    die("Admin sudah ada. Email: $email");
  }

  $hash = password_hash($plainPassword, PASSWORD_DEFAULT);
  $pdo->prepare("INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,'admin')")
      ->execute([$name,$email,$hash]);

  echo "✅ Admin dibuat.<br>Email: $email<br>Password: $plainPassword<br><br>Hapus file ini setelah selesai.";
} catch (Throwable $e) {
  echo "ERROR: " . $e->getMessage();
}
