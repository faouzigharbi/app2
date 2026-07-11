<?php
/**
 * Un PARENT utilise un code d'association (point 7) pour se lier à un élève.
 * Vérifie : code valide, non expiré, non épuisé, non révoqué. Crée l'association
 * validée (dv_parent_eleve) et met à jour l'invitation.
 *
 * POST JSON : { code }
 */

declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/util.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/authz.php';
require __DIR__ . '/audit.php';

require_method('POST');
$me = require_role('parent');
require_can($me, 'parent.invite_accept');

$in   = json_input();
$code = clean_str($in['code'] ?? '', 32);
if ($code === '') json_response(['ok' => false, 'error' => "Code requis."], 422);

$codeHash = hash_code($code);

try {
    db()->beginTransaction();

    // Verrouille l'invitation le temps de la traiter.
    $s = db()->prepare(
        'SELECT id, eleve_id, relation, expires_at, max_utilisations, utilisations, statut
         FROM dv_parent_eleve_invitations WHERE code_hash = ? LIMIT 1 FOR UPDATE'
    );
    $s->execute([$codeHash]);
    $inv = $s->fetch();

    if (!$inv || $inv['statut'] === 'revoque' || $inv['statut'] === 'refuse') {
        db()->rollBack();
        json_response(['ok' => false, 'error' => "Code invalide."], 404);
    }
    if ($inv['statut'] === 'expire' || strtotime($inv['expires_at']) < time()) {
        db()->prepare('UPDATE dv_parent_eleve_invitations SET statut = "expire", updated_at = ? WHERE id = ?')->execute([now(), $inv['id']]);
        db()->commit();
        json_response(['ok' => false, 'error' => "Ce code a expiré."], 410);
    }
    if ((int)$inv['utilisations'] >= (int)$inv['max_utilisations']) {
        db()->rollBack();
        json_response(['ok' => false, 'error' => "Ce code a déjà été utilisé."], 409);
    }

    $eleveId  = $inv['eleve_id'];
    $relation = $inv['relation'] ?: 'autre';

    // Association déjà existante ?
    $chk = db()->prepare('SELECT id FROM dv_parent_eleve WHERE parent_id = ? AND eleve_id = ?');
    $chk->execute([$me['id'], $eleveId]);
    if (!$chk->fetchColumn()) {
        db()->prepare('INSERT INTO dv_parent_eleve (id, parent_id, eleve_id, relation, invitation_id, statut, validated_at, created_at) VALUES (?, ?, ?, ?, ?, "actif", ?, ?)')
            ->execute([uuid4(), $me['id'], $eleveId, $relation, $inv['id'], now(), now()]);
    }

    $newUse = (int)$inv['utilisations'] + 1;
    $newStatut = $newUse >= (int)$inv['max_utilisations'] ? 'accepte' : 'en_attente';
    db()->prepare('UPDATE dv_parent_eleve_invitations SET utilisations = ?, statut = ?, accepted_by_parent_id = ?, updated_at = ? WHERE id = ?')
        ->execute([$newUse, $newStatut, $me['id'], now(), $inv['id']]);

    db()->commit();
} catch (Throwable $e) {
    if (db()->inTransaction()) db()->rollBack();
    json_response(['ok' => false, 'error' => "Association impossible."], 500);
}

journaliser('parent.link', 'user', $eleveId, ['invitation_id' => $inv['id'], 'relation' => $relation]);
json_response(['ok' => true, 'eleve_id' => $eleveId, 'relation' => $relation]);
