<?php
/**
 * Établissements (admin). GET : liste ; POST : création.
 * POST JSON : { nom, code?, ville?, pays? }
 */

declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/util.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/authz.php';
require __DIR__ . '/audit.php';

$me = require_login();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET') {
    $rows = db()->query('SELECT id, nom, code, ville, pays, statut FROM dv_etablissements WHERE archived_at IS NULL ORDER BY nom')->fetchAll();
    json_response(['ok' => true, 'etablissements' => $rows]);
}

require_method('POST');
require_can($me, 'etablissement.manage');

$in    = json_input();
$nom   = clean_str($in['nom'] ?? '', 150);
$code  = clean_str($in['code'] ?? '', 30) ?: null;
$ville = clean_str($in['ville'] ?? '', 80) ?: null;
$pays  = clean_str($in['pays'] ?? '', 2) ?: null;
if (mb_strlen($nom) < 2) json_response(['ok' => false, 'error' => "Le nom est requis."], 422);

$id = uuid4();
db()->prepare('INSERT INTO dv_etablissements (id, nom, code, ville, pays, statut, created_at, updated_at) VALUES (?, ?, ?, ?, ?, "actif", ?, ?)')
    ->execute([$id, $nom, $code, $ville, $pays, now(), now()]);

journaliser('etablissement.create', 'etablissement', $id, ['nom' => $nom]);
json_response(['ok' => true, 'etablissement' => ['id' => $id, 'nom' => $nom, 'code' => $code]]);
