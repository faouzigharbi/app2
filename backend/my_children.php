<?php
/**
 * Liste des enfants associés au parent connecté, avec leur gamification. GET.
 */

declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/labels.php';

$me = require_role('parent');

$stmt = db()->prepare(
    'SELECT u.id, u.nom, u.prenom, u.niveau, u.niveau_titre, u.xp, u.streak, u.last_seen, pe.relation
     FROM dv_parent_eleve pe JOIN dv_users u ON u.id = pe.eleve_id
     WHERE pe.parent_id = ? AND pe.statut = "actif" AND u.deleted_at IS NULL
     ORDER BY u.nom, u.prenom'
);
$stmt->execute([$me['id']]);
$rows = $stmt->fetchAll();

foreach ($rows as &$r) {
    $r['niveau_titre_label'] = label(DV_NIVEAU_TITRES, $r['niveau_titre'] ?? null, 'ar');
    $r['relation_label'] = label(DV_RELATIONS, $r['relation'] ?? null, 'ar');
    $r['xp'] = (int)$r['xp']; $r['niveau'] = (int)$r['niveau']; $r['streak'] = (int)$r['streak'];
}
unset($r);

json_response(['ok' => true, 'enfants' => $rows]);
