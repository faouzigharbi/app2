<?php
/**
 * Connexion : identifiant (login OU e-mail) + mot de passe.
 * POST JSON : { identifiant, password }
 */

declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/util.php';
require __DIR__ . '/auth.php';

require_method('POST');
$in = json_input();

$identifiant = clean_str($in['identifiant'] ?? '', 190);
$password    = (string)($in['password'] ?? '');

if ($identifiant === '' || $password === '') {
    json_response(['ok' => false, 'error' => "Identifiant et mot de passe requis."], 422);
}

$s = db()->prepare(
    'SELECT id, role, nom, prenom, password_hash, statut, deleted_at, must_change_password
     FROM dv_users WHERE (login = ? OR email = ?) LIMIT 1'
);
$s->execute([$identifiant, $identifiant]);
$u = $s->fetch();

// Message générique : on ne révèle pas si le compte existe.
if (!$u || !verify_password($password, $u['password_hash'])) {
    json_response(['ok' => false, 'error' => "Identifiant ou mot de passe incorrect."], 401);
}
if ($u['statut'] !== 'actif' || $u['deleted_at'] !== null) {
    json_response(['ok' => false, 'error' => "Ce compte n'est pas actif."], 403);
}

login_user($u['id']);
db()->prepare('UPDATE dv_users SET last_seen = ?, updated_at = ? WHERE id = ?')
    ->execute([date('Y-m-d'), now(), $u['id']]);

json_response([
    'ok'   => true,
    'user' => ['id' => $u['id'], 'role' => $u['role'], 'nom' => $u['nom'], 'prenom' => $u['prenom']],
    'must_change_password' => (int)$u['must_change_password'] === 1,
]);
