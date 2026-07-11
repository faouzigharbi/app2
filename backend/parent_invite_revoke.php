<?php
/**
 * Révoquer une invitation (code) ou une association parent-élève existante.
 * POST JSON : { invitation_id? , parent_id?+eleve_id? }
 * Autorisé au prof gérant l'élève, au parent concerné, ou à l'admin.
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

$invitationId = clean_str($in['invitation_id'] ?? '', 36);
$parentId     = clean_str($in['parent_id'] ?? '', 36);
$eleveId      = clean_str($in['eleve_id'] ?? '', 36);

// Cas 1 : révoquer une invitation (code) encore en attente.
if ($invitationId !== '') {
    $s = db()->prepare('SELECT eleve_id FROM dv_parent_eleve_invitations WHERE id = ?');
    $s->execute([$invitationId]);
    $target = $s->fetchColumn();
    if (!$target) json_response(['ok' => false, 'error' => "Invitation introuvable."], 404);

    require_can($me, 'parent.invite_revoke', ['eleve_id' => $target, 'cible_type' => 'user']);
    db()->prepare('UPDATE dv_parent_eleve_invitations SET statut = "revoque", updated_at = ? WHERE id = ?')->execute([now(), $invitationId]);
    journaliser('parent.invite_revoke', 'user', $target, ['invitation_id' => $invitationId]);
    json_response(['ok' => true]);
}

// Cas 2 : révoquer une association validée.
if ($parentId !== '' && $eleveId !== '') {
    // Un parent peut retirer sa propre association ; sinon contrôle de périmètre.
    if (!($me['role'] === 'parent' && $me['id'] === $parentId)) {
        require_can($me, 'parent.invite_revoke', ['eleve_id' => $eleveId, 'cible_type' => 'user']);
    }
    db()->prepare('UPDATE dv_parent_eleve SET statut = "revoque" WHERE parent_id = ? AND eleve_id = ?')->execute([$parentId, $eleveId]);
    journaliser('parent.unlink', 'user', $eleveId, ['parent_id' => $parentId]);
    json_response(['ok' => true]);
}

json_response(['ok' => false, 'error' => "Préciser invitation_id, ou parent_id + eleve_id."], 422);
