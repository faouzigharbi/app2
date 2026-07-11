<?php
/**
 * Liste des élèves inscrits dans une classe. GET ?classe_id=...
 * Réservé au prof gérant la classe ou à l'admin.
 */

declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/util.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/authz.php';
require __DIR__ . '/labels.php';

$me = require_role('prof', 'admin');
$classeId = clean_str($_GET['classe_id'] ?? '', 36);
if ($classeId === '') json_response(['ok' => false, 'error' => "Classe manquante."], 422);

if ($me['role'] !== 'admin' && !prof_manages_classe($me['id'], $classeId)) {
    json_response(['ok' => false, 'error' => "Accès refusé à cette classe."], 403);
}

$stmt = db()->prepare(
    'SELECT u.id, u.nom, u.prenom, u.login, u.niveau, u.niveau_titre, u.xp, u.streak, u.statut, u.last_seen
     FROM dv_classe_eleve ce JOIN dv_users u ON u.id = ce.eleve_id
     WHERE ce.classe_id = ? AND ce.statut = "inscrit" AND u.deleted_at IS NULL
     ORDER BY u.nom, u.prenom'
);
$stmt->execute([$classeId]);
$rows = $stmt->fetchAll();

foreach ($rows as &$r) {
    $r['niveau_titre_label'] = label(DV_NIVEAU_TITRES, $r['niveau_titre'] ?? null, 'ar');
    $r['xp'] = (int)$r['xp']; $r['niveau'] = (int)$r['niveau']; $r['streak'] = (int)$r['streak'];
}
unset($r);

json_response(['ok' => true, 'eleves' => $rows]);
