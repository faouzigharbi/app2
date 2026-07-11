<?php
/**
 * Réinitialisation du mot de passe d'un ÉLÈVE par un prof/parent/admin autorisé.
 * Génère un mot de passe temporaire (rendu UNE fois dans la réponse) et impose
 * son changement à la prochaine connexion. Jamais de mot de passe en clair en base.
 *
 * POST JSON : { eleve_id }
 */

declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/util.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/authz.php';
require __DIR__ . '/audit.php';

require_method('POST');
$me = require_login();

$in = json_input();
$eleveId = clean_str($in['eleve_id'] ?? '', 36);
if ($eleveId === '') json_response(['ok' => false, 'error' => "Élève manquant."], 422);

// La cible doit être un élève.
$s = db()->prepare('SELECT id, role FROM dv_users WHERE id = ? AND deleted_at IS NULL');
$s->execute([$eleveId]);
$eleve = $s->fetch();
if (!$eleve || $eleve['role'] !== 'eleve') {
    json_response(['ok' => false, 'error' => "Élève introuvable."], 404);
}

// Autorisation côté serveur (prof qui le gère, parent associé, ou admin).
require_can($me, 'password.reset', ['eleve_id' => $eleveId, 'cible_type' => 'user']);

$temp = generate_temp_password(6);
db()->prepare('UPDATE dv_users SET password_hash = ?, must_change_password = 1, updated_at = ? WHERE id = ?')
    ->execute([hash_password($temp), now(), $eleveId]);

journaliser('password.reset', 'user', $eleveId, ['par_role' => $me['role']]);

// Le mot de passe temporaire est renvoyé UNE seule fois, à transmettre à l'élève.
json_response(['ok' => true, 'mot_de_passe_temporaire' => $temp]);
