<?php
/**
 * Fondations partagées par toutes les API :
 *  - connexion à la base (PDO, sécurisée)
 *  - démarrage de session
 *  - petites fonctions utilitaires pour lire l'entrée JSON et répondre en JSON
 *
 * Aucun fichier public n'a besoin de dupliquer ce code : il fait  require 'db.php';
 */

declare(strict_types=1);

// -- Erreurs : on ne les affiche jamais à l'écran (fuite d'infos), on les logge.
error_reporting(E_ALL);
ini_set('display_errors', '0');

// -- Chargement de la configuration (identifiants de la base).
$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => "config.php manquant. Copie config.sample.php en config.php et renseigne tes identifiants."]);
    exit;
}
$config = require $configFile;

// -- Session (cookie) sécurisée. Doit être appelé avant tout envoi de contenu.
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        // 'secure' => true,  // ← décommente quand le site est en HTTPS
    ]);
    session_name('devoirati_session');
    session_start();
}

/**
 * Renvoie une connexion PDO unique à la base (réutilisée à chaque appel).
 */
function db(): PDO
{
    static $pdo = null;
    global $config;

    if ($pdo === null) {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            $config['db_host'],
            $config['db_port'],
            $config['db_name']
        );
        try {
            $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            json_response(['ok' => false, 'error' => "Connexion à la base impossible."], 500);
        }
    }
    return $pdo;
}

/**
 * Lit le corps JSON de la requête et le renvoie en tableau associatif.
 */
function json_input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/**
 * Répond en JSON puis arrête le script.
 */
function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Renvoie l'utilisateur connecté (tableau) ou null.
 */
function current_user(): ?array
{
    if (empty($_SESSION['user_id'])) {
        return null;
    }
    $stmt = db()->prepare('SELECT id, role, prenom, nom, identifiant, email, classe, parent_id, xp, niveau, serie_jours FROM dv_users WHERE id = ? AND actif = 1');
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();
    return $user ?: null;
}

/**
 * Exige un utilisateur connecté (et éventuellement un rôle précis),
 * sinon répond 401/403 et arrête.
 */
function require_user(?string $role = null): array
{
    $user = current_user();
    if (!$user) {
        json_response(['ok' => false, 'error' => "Non connecté."], 401);
    }
    if ($role !== null && $user['role'] !== $role && $user['role'] !== 'admin') {
        json_response(['ok' => false, 'error' => "Accès refusé."], 403);
    }
    return $user;
}

/**
 * N'accepte qu'une méthode HTTP donnée (ex : 'POST').
 */
function require_method(string $method): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== $method) {
        json_response(['ok' => false, 'error' => "Méthode non autorisée."], 405);
    }
}
