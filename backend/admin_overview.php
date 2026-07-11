<?php
/**
 * Synthèse administrateur : comptages + dernières actions du journal d'audit. GET.
 */

declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/authz.php';

$me = require_role('admin');
require_can($me, 'audit.read');

$byRole = [];
foreach (db()->query('SELECT role, COUNT(*) n FROM dv_users WHERE deleted_at IS NULL GROUP BY role') as $r) {
    $byRole[$r['role']] = (int)$r['n'];
}

$counts = [
    'eleves'         => $byRole['eleve']  ?? 0,
    'parents'        => $byRole['parent'] ?? 0,
    'professeurs'    => $byRole['prof']   ?? 0,
    'admins'         => $byRole['admin']  ?? 0,
    'classes'        => (int) db()->query('SELECT COUNT(*) FROM dv_classes WHERE statut = "actif"')->fetchColumn(),
    'etablissements' => (int) db()->query('SELECT COUNT(*) FROM dv_etablissements WHERE archived_at IS NULL')->fetchColumn(),
];

$audit = db()->query(
    'SELECT acteur_id, action, cible_type, cible_id, created_at
     FROM dv_audit_logs ORDER BY created_at DESC LIMIT 20'
)->fetchAll();

json_response(['ok' => true, 'compteurs' => $counts, 'journal' => $audit]);
