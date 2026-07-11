<?php
/**
 * Liste des classes du professeur connecté (ou toutes pour l'admin),
 * avec le nombre d'élèves inscrits. GET.
 */

declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/labels.php';

$me = require_role('prof', 'admin');

if ($me['role'] === 'admin') {
    $stmt = db()->query(
        'SELECT c.id, c.nom, c.niveau_code, c.annee_scolaire_id,
                (SELECT COUNT(*) FROM dv_classe_eleve ce WHERE ce.classe_id = c.id AND ce.statut = "inscrit") AS nb_eleves
         FROM dv_classes c WHERE c.statut = "actif" ORDER BY c.nom'
    );
    $rows = $stmt->fetchAll();
} else {
    $stmt = db()->prepare(
        'SELECT c.id, c.nom, c.niveau_code, c.annee_scolaire_id, cp.est_professeur_principal,
                (SELECT COUNT(*) FROM dv_classe_eleve ce WHERE ce.classe_id = c.id AND ce.statut = "inscrit") AS nb_eleves
         FROM dv_classes c
         JOIN dv_classe_professeur cp ON cp.classe_id = c.id
         WHERE cp.professeur_id = ? AND cp.statut = "actif" AND c.statut = "actif"
         ORDER BY c.nom'
    );
    $stmt->execute([$me['id']]);
    $rows = $stmt->fetchAll();
}

foreach ($rows as &$r) {
    $r['niveau_label'] = label(DV_NIVEAUX, $r['niveau_code'] ?? null, 'ar');
    $r['nb_eleves'] = (int)$r['nb_eleves'];
}
unset($r);

json_response(['ok' => true, 'classes' => $rows]);
