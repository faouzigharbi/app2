<?php
/**
 * Socle bas niveau, requis par toutes les API :
 *   - chargement de la configuration (identifiants base)
 *   - connexion PDO sécurisée
 *   - session cookie
 *   - utilitaires : uuid4(), now(), json_input(), json_response(), require_method()
 *
 * L'authentification et les autorisations sont dans auth.php / authz.php.
 */

declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '0');   // on ne divulgue jamais d'erreur à l'écran

$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => "config.php manquant. Copier config.sample.php en config.php."]);
    exit;
}
$GLOBALS['dv_config'] = require $configFile;

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 0, 'path' => '/', 'httponly' => true, 'samesite' => 'Lax',
        // 'secure' => true,  // ← décommenter en HTTPS
    ]);
    session_name('devoirati_session');
    session_start();
}

/** Connexion PDO unique (réutilisée). */
function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $c = $GLOBALS['dv_config'];
        $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            $c['db_host'], $c['db_port'], $c['db_name']);
        try {
            $pdo = new PDO($dsn, $c['db_user'], $c['db_pass'], [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
            // Sécurité de portabilité : garantir que les guillemets doubles
            // dans nos requêtes sont bien traités comme des chaînes, quel que
            // soit le sql_mode de l'hébergement (retrait éventuel d'ANSI_QUOTES).
            $pdo->exec("SET SESSION sql_mode = REPLACE(@@sql_mode, 'ANSI_QUOTES', '')");
        } catch (PDOException $e) {
            json_response(['ok' => false, 'error' => "Connexion à la base impossible."], 500);
        }
    }
    return $pdo;
}

/** Identifiant unique (UUID v4). */
function uuid4(): string
{
    $d = random_bytes(16);
    $d[6] = chr((ord($d[6]) & 0x0f) | 0x40);
    $d[8] = chr((ord($d[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($d), 4));
}

/** Horodatage courant, format SQL DATETIME. */
function now(): string { return date('Y-m-d H:i:s'); }

/** Corps JSON de la requête -> tableau. */
function json_input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) return [];
    $d = json_decode($raw, true);
    return is_array($d) ? $d : [];
}

/** Réponse JSON puis arrêt. */
function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

/** N'accepte qu'une méthode HTTP donnée. */
function require_method(string $method): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== $method) {
        json_response(['ok' => false, 'error' => "Méthode non autorisée."], 405);
    }
}
