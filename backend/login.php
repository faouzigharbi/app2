<?php
/**
 * Connexion. Accepte un e-mail (parent/prof) OU un identifiant (élève),
 * plus le mot de passe.
 *
 * POST JSON : { identifiant, password }
 */

declare(strict_types=1);
require __DIR__ . '/db.php';

require_method('POST');
$in = json_input();

$identifiant = trim((string)($in['identifiant'] ?? ''));
$password    = (string)($in['password'] ?? '');

if ($identifiant === '' || $password === '') {
    json_response(['ok' => false, 'error' => "Identifiant et mot de passe requis."], 422);
}

// On cherche par login OU par e-mail.
$stmt = db()->prepare(
    'SELECT id, nom, role, password_hash FROM dv_users
     WHERE login = ? OR email = ? LIMIT 1'
);
$stmt->execute([$identifiant, $identifiant]);
$user = $stmt->fetch();

// Message volontairement générique (on ne révèle pas si le compte existe).
if (!$user || !$user['password_hash'] || !password_verify($password, $user['password_hash'])) {
    json_response(['ok' => false, 'error' => "Identifiant ou mot de passe incorrect."], 401);
}

// Session ouverte.
$_SESSION['user_id'] = $user['id'];

// On note le passage.
$upd = db()->prepare('UPDATE dv_users SET last_seen = ?, updated_at = NOW() WHERE id = ?');
$upd->execute([date('Y-m-d'), $user['id']]);

json_response([
    'ok'   => true,
    'user' => ['id' => $user['id'], 'nom' => $user['nom'], 'role' => $user['role']],
]);
