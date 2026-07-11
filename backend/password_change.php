<?php
/**
 * Changer SON PROPRE mot de passe (gère aussi le cas must_change_password).
 * POST JSON : { ancien_mot_de_passe, nouveau_mot_de_passe }
 */

declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/authz.php';
require __DIR__ . '/audit.php';

require_method('POST');
$me = require_login();
require_can($me, 'password.change_self');

$in      = json_input();
$ancien  = (string)($in['ancien_mot_de_passe'] ?? '');
$nouveau = (string)($in['nouveau_mot_de_passe'] ?? '');

if (strlen($nouveau) < 6) {
    json_response(['ok' => false, 'error' => "Le nouveau mot de passe doit contenir au moins 6 caractères."], 422);
}

// Vérifier l'ancien mot de passe.
$s = db()->prepare('SELECT password_hash FROM dv_users WHERE id = ?');
$s->execute([$me['id']]);
$hash = $s->fetchColumn();
if (!verify_password($ancien, $hash ?: null)) {
    json_response(['ok' => false, 'error' => "Ancien mot de passe incorrect."], 401);
}

db()->prepare('UPDATE dv_users SET password_hash = ?, must_change_password = 0, updated_at = ? WHERE id = ?')
    ->execute([hash_password($nouveau), now(), $me['id']]);

journaliser('password.change', 'user', $me['id'], ['self' => true]);
json_response(['ok' => true]);
