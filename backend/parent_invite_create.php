<?php
/**
 * Génère un code d'association parent-élève (point 7).
 * Code aléatoire, stocké HASHÉ, à validité limitée, usage unique par défaut,
 * révocable. Émis par un prof gérant l'élève, un parent déjà associé, ou l'admin.
 *
 * POST JSON : { eleve_id, relation?, validite_heures?, max_utilisations? }
 * Réponse : le code EN CLAIR (une seule fois) à transmettre au parent.
 */

declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/util.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/authz.php';
require __DIR__ . '/audit.php';

require_method('POST');
$me = require_login();

$in       = json_input();
$eleveId  = clean_str($in['eleve_id'] ?? '', 36);
$relation = clean_str($in['relation'] ?? 'autre', 20);
$heures   = max(1, min(720, (int)($in['validite_heures'] ?? 72)));   // 1h..30j, défaut 72h
$maxUse   = max(1, min(5, (int)($in['max_utilisations'] ?? 1)));
if ($eleveId === '') json_response(['ok' => false, 'error' => "Élève requis."], 422);
if (!in_array($relation, ['pere', 'mere', 'tuteur', 'autre'], true)) $relation = 'autre';

// La cible doit être un élève.
$s = db()->prepare('SELECT role FROM dv_users WHERE id = ? AND deleted_at IS NULL');
$s->execute([$eleveId]);
if ($s->fetchColumn() !== 'eleve') json_response(['ok' => false, 'error' => "Élève introuvable."], 404);

require_can($me, 'parent.invite_create', ['eleve_id' => $eleveId, 'cible_type' => 'user']);

$code     = generate_code(8);
$codeHash = hash_code($code);
$expires  = date('Y-m-d H:i:s', strtotime('+' . $heures . ' hours'));

$id = uuid4();
db()->prepare(
    'INSERT INTO dv_parent_eleve_invitations
       (id, eleve_id, code_hash, relation, created_by_user_id, expires_at,
        max_utilisations, utilisations, statut, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, "en_attente", ?, ?)'
)->execute([$id, $eleveId, $codeHash, $relation, $me['id'], $expires, $maxUse, now(), now()]);

journaliser('parent.invite_create', 'user', $eleveId, ['invitation_id' => $id, 'relation' => $relation]);

json_response([
    'ok'   => true,
    'code' => $code,                 // EN CLAIR une seule fois
    'invitation' => ['id' => $id, 'expire_le' => $expires, 'relation' => $relation],
]);
