<?php
/**
 * Déconnexion : ferme la session en cours.
 * POST (sans corps).
 */

declare(strict_types=1);
require __DIR__ . '/db.php';

require_method('POST');

$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $p = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
}
session_destroy();

json_response(['ok' => true]);
