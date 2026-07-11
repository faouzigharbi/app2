<?php
/**
 * Inscrire / retirer un élève d'une classe (point 8 : historisé, jamais supprimé).
 * Réservé au prof gérant la classe ou à l'admin.
 * POST JSON : { classe_id, eleve_id, action:"inscrire"|"retirer" }
 */

declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/util.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/authz.php';
require __DIR__ . '/audit.php';

require_method('POST');
$me = require_role('prof', 'admin');

$in       = json_input();
$classeId = clean_str($in['classe_id'] ?? '', 36);
$eleveId  = clean_str($in['eleve_id'] ?? '', 36);
$action   = clean_str($in['action'] ?? 'inscrire', 12);
if ($classeId === '' || $eleveId === '') json_response(['ok' => false, 'error' => "Classe et élève requis."], 422);

require_can($me, 'enrollment.manage', ['classe_id' => $classeId]);

$s = db()->prepare('SELECT annee_scolaire_id FROM dv_classes WHERE id = ?');
$s->execute([$classeId]);
$cl = $s->fetch();
if (!$cl) json_response(['ok' => false, 'error' => "Classe introuvable."], 404);
$anneeId = $cl['annee_scolaire_id'];

if ($action === 'retirer') {
    // Suppression LOGIQUE : on renseigne la sortie, on ne supprime pas la ligne.
    db()->prepare('UPDATE dv_classe_eleve SET statut = "sorti", date_sortie = ? WHERE classe_id = ? AND eleve_id = ? AND annee_scolaire_id <=> ? AND statut = "inscrit"')
        ->execute([date('Y-m-d'), $classeId, $eleveId, $anneeId]);
    journaliser('classe.unenroll', 'classe', $classeId, ['eleve_id' => $eleveId]);
    json_response(['ok' => true, 'statut' => 'sorti']);
}

// Inscrire (ou ré-inscrire) — l'unicité (classe,eleve,annee) évite les doublons.
try {
    db()->prepare('INSERT INTO dv_classe_eleve (id, classe_id, eleve_id, annee_scolaire_id, date_inscription, statut, created_by_user_id) VALUES (?, ?, ?, ?, ?, "inscrit", ?)
                   ON DUPLICATE KEY UPDATE statut = "inscrit", date_sortie = NULL, date_inscription = VALUES(date_inscription)')
        ->execute([uuid4(), $classeId, $eleveId, $anneeId, date('Y-m-d'), $me['id']]);
} catch (Throwable $e) {
    json_response(['ok' => false, 'error' => "Inscription impossible."], 500);
}

journaliser('classe.enroll', 'classe', $classeId, ['eleve_id' => $eleveId]);
json_response(['ok' => true, 'statut' => 'inscrit']);
