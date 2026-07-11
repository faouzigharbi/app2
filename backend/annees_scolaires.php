<?php
/**
 * Années scolaires (admin). GET : liste ; POST : création.
 * POST JSON : { libelle, date_debut, date_fin, active?, etablissement_id? }
 */

declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/util.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/authz.php';
require __DIR__ . '/audit.php';

$me = require_login();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET') {
    $rows = db()->query('SELECT id, etablissement_id, libelle, date_debut, date_fin, active FROM dv_annees_scolaires ORDER BY libelle DESC')->fetchAll();
    json_response(['ok' => true, 'annees' => $rows]);
}

require_method('POST');
require_can($me, 'annee.manage');

$in      = json_input();
$libelle = clean_str($in['libelle'] ?? '', 20);
$debut   = clean_str($in['date_debut'] ?? '', 10) ?: null;
$fin     = clean_str($in['date_fin'] ?? '', 10) ?: null;
$active  = !empty($in['active']) ? 1 : 0;
$etabId  = clean_str($in['etablissement_id'] ?? '', 36) ?: null;
if ($libelle === '') json_response(['ok' => false, 'error' => "Le libellé est requis (ex. 2025-2026)."], 422);

// Une seule année active à la fois (par établissement).
if ($active) {
    db()->prepare('UPDATE dv_annees_scolaires SET active = 0 WHERE etablissement_id <=> ?')->execute([$etabId]);
}

$id = uuid4();
db()->prepare('INSERT INTO dv_annees_scolaires (id, etablissement_id, libelle, date_debut, date_fin, active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    ->execute([$id, $etabId, $libelle, $debut, $fin, $active, now()]);

journaliser('annee.create', 'annee_scolaire', $id, ['libelle' => $libelle]);
json_response(['ok' => true, 'annee' => ['id' => $id, 'libelle' => $libelle, 'active' => $active]]);
