<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (session_status() === PHP_SESSION_NONE) session_start();

define('BASE_URL', '/six_coffe');

// ===== DB =====
$host = "localhost";
$db   = "sixcoffe_db";
$user = "root";
$pass = "";
$charset = "utf8mb4";

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  PDO::ATTR_EMULATE_PREPARES => false,
];

try {
  $pdo = new PDO($dsn, $user, $pass, $options);
} catch (Throwable $e) {
  die("DB Error: " . $e->getMessage());
}

// ===== AUTH HELPERS =====
function isLoggedIn(): bool {
  return isset($_SESSION['user']);
}

function isAdmin(): bool {
  return isLoggedIn() && (($_SESSION['user']['role'] ?? '') === 'admin');
}

function requireLogin() {
  if (!isLoggedIn()) {
    header("Location: " . BASE_URL . "/pages/login.php");
    exit;
  }
}

function requireAdmin() {
  requireLogin();
  if (!isAdmin()) {
    http_response_code(403);
    die("403 Forbidden");
  }
}
function setFlash(string $type, string $message): void {
  $_SESSION['flash'] = ['type' => $type, 'message' => $message];
}

function getFlash(): ?array {
  if (!isset($_SESSION['flash'])) return null;
  $f = $_SESSION['flash'];
  unset($_SESSION['flash']);
  return $f;
}

