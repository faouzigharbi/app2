<?php
/**
 * Création d'une classe par un professeur (devient prof principal) ou un admin.
 * POST JSON : { nom, niveau_code, annee_scolaire_id, etablissement_id?, matiere_code? }
 */

declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/util.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/authz.php';
require __DIR__ . '/audit.php';

require_method('POST');
$me = require_role('prof', 'admin');
require_can($me, 'classe.create');

$in       = json_input();
$nom      = clean_str($in['nom'] ?? '', 60);
$niveau   = clean_str($in['niveau_code'] ?? '', 20);
$anneeId  = clean_str($in['annee_scolaire_id'] ?? '', 36);
$etabId   = clean_str($in['etablissement_id'] ?? ($me['etablissement_id'] ?? ''), 36) ?: null;
$matiere  = clean_str($in['matiere_code'] ?? 'MATHEMATIQUES', 30);

$errors = [];
if (mb_strlen($nom) < 1) $errors[] = "Le nom de la classe est requis.";
if ($niveau === '')      $errors[] = "Le niveau est requis.";
if ($anneeId === '')     $errors[] = "L'année scolaire est requise.";
if ($errors) json_response(['ok' => false, 'error' => implode(' ', $errors)], 422);

// Vérifs référentielles.
if (!db()->query('SELECT 1 FROM dv_niveaux WHERE code = ' . db()->quote($niveau))->fetchColumn()) {
    json_response(['ok' => false, 'error' => "Niveau inconnu."], 422);
}

$classeId = uuid4();
try {
    db()->beginTransaction();

    db()->prepare('INSERT INTO dv_classes (id, nom, niveau_code, etablissement_id, annee_scolaire_id, statut, created_by_user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, "actif", ?, ?, ?)')
        ->execute([$classeId, $nom, $niveau, $etabId, $anneeId, $me['id'], now(), now()]);

    // Le créateur prof devient professeur principal de la classe.
    if ($me['role'] === 'prof') {
        db()->prepare('INSERT INTO dv_classe_professeur (id, classe_id, professeur_id, matiere_code, est_professeur_principal, role_dans_classe, date_debut, statut) VALUES (?, ?, ?, ?, 1, "titulaire", ?, "actif")')
            ->execute([uuid4(), $classeId, $me['id'], $matiere, date('Y-m-d')]);
    }

    db()->commit();
} catch (Throwable $e) {
    if (db()->inTransaction()) db()->rollBack();
    json_response(['ok' => false, 'error' => "Création de la classe impossible (doublon ?)."], 409);
}

journaliser('classe.create', 'classe', $classeId, ['nom' => $nom, 'niveau' => $niveau]);
json_response(['ok' => true, 'classe' => ['id' => $classeId, 'nom' => $nom, 'niveau_code' => $niveau]]);
