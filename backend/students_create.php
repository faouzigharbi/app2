<?php
/**
 * Création d'un compte ÉLÈVE par un prof, un parent ou un admin (point 6).
 *  - prof   : classe_id requis (une de ses classes) -> inscription automatique.
 *  - parent : association parent-élève immédiate.
 * Identifiant généré automatiquement s'il n'est pas fourni. Mot de passe
 * temporaire si non fourni, avec changement imposé à la 1ʳᵉ connexion.
 *
 * POST JSON : { nom, prenom?, login?, password?, niveau_code?, classe_id?, relation? }
 */

declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/util.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/authz.php';
require __DIR__ . '/audit.php';

require_method('POST');
$me = require_role('prof', 'parent', 'admin');

$in       = json_input();
$nom      = clean_str($in['nom'] ?? '', 80);
$prenom   = clean_str($in['prenom'] ?? '', 80) ?: null;
$login    = clean_str($in['login'] ?? '', 60);
$password = (string)($in['password'] ?? '');
$niveau   = clean_str($in['niveau_code'] ?? '', 20) ?: null;
$classeId = clean_str($in['classe_id'] ?? '', 36) ?: null;
$relation = clean_str($in['relation'] ?? 'autre', 20);

if (mb_strlen($nom) < 2) json_response(['ok' => false, 'error' => "Le nom de l'élève est requis."], 422);

// Autorisation selon le rôle (prof -> doit gérer la classe).
require_can($me, 'student.create', ['classe_id' => $classeId]);

// Contexte de la classe (année + établissement) pour l'inscription.
$anneeId = null; $etabId = $me['etablissement_id'] ?? null;
if ($me['role'] === 'prof') {
    if ($classeId === null) json_response(['ok' => false, 'error' => "La classe est requise."], 422);
    $s = db()->prepare('SELECT annee_scolaire_id, etablissement_id, niveau_code FROM dv_classes WHERE id = ?');
    $s->execute([$classeId]);
    $cl = $s->fetch();
    if (!$cl) json_response(['ok' => false, 'error' => "Classe introuvable."], 404);
    $anneeId = $cl['annee_scolaire_id'];
    $etabId  = $cl['etablissement_id'];
    if ($niveau === null) $niveau = $cl['niveau_code'];
}

// Identifiant : fourni ou généré (unique).
if ($login === '') {
    $base = strtolower(preg_replace('/[^a-z0-9]/i', '', $nom)) ?: 'eleve';
    do { $login = $base . random_int(100, 999); }
    while (db()->query('SELECT 1 FROM dv_users WHERE login = ' . db()->quote($login))->fetchColumn());
} else {
    if (db()->query('SELECT 1 FROM dv_users WHERE login = ' . db()->quote($login))->fetchColumn()) {
        json_response(['ok' => false, 'error' => "Cet identifiant est déjà utilisé."], 409);
    }
}

// Mot de passe : fourni (>=4) ou temporaire généré, à changer ensuite.
$mustChange = 0;
if ($password === '') { $password = generate_temp_password(6); $mustChange = 1; }
elseif (strlen($password) < 4) json_response(['ok' => false, 'error' => "Le mot de passe doit contenir au moins 4 caractères."], 422);

$id = uuid4();
try {
    db()->beginTransaction();

    db()->prepare(
        'INSERT INTO dv_users
           (id, role, nom, prenom, login, password_hash, must_change_password, statut,
            etablissement_id, niveau_code, annee, xp, niveau, niveau_titre, xp_next_level,
            streak, created_by_user_id, created_at, last_seen, updated_at)
         VALUES (?, "eleve", ?, ?, ?, ?, ?, "actif", ?, ?, ?, 0, 1, "debutant", 100, 0, ?, ?, ?, ?)'
    )->execute([$id, $nom, $prenom, $login, hash_password($password), $mustChange,
        $etabId, $niveau, ($niveau ?: ''), $me['id'], date('Y-m-d'), date('Y-m-d'), now()]);

    // prof -> inscription dans la classe (historisée).
    if ($me['role'] === 'prof' && $classeId !== null) {
        db()->prepare('INSERT INTO dv_classe_eleve (id, classe_id, eleve_id, annee_scolaire_id, date_inscription, statut, created_by_user_id) VALUES (?, ?, ?, ?, ?, "inscrit", ?)')
            ->execute([uuid4(), $classeId, $id, $anneeId, date('Y-m-d'), $me['id']]);
    }

    // parent -> association immédiate.
    if ($me['role'] === 'parent') {
        db()->prepare('INSERT INTO dv_parent_eleve (id, parent_id, eleve_id, relation, statut, validated_at, created_at) VALUES (?, ?, ?, ?, "actif", ?, ?)')
            ->execute([uuid4(), $me['id'], $id, $relation, now(), now()]);
    }

    db()->commit();
} catch (Throwable $e) {
    if (db()->inTransaction()) db()->rollBack();
    json_response(['ok' => false, 'error' => "Création de l'élève impossible."], 500);
}

journaliser('user.create', 'user', $id, ['role' => 'eleve', 'par_role' => $me['role'], 'classe_id' => $classeId]);

// login + mot de passe temporaire renvoyés UNE fois (à transmettre à l'élève).
json_response([
    'ok'    => true,
    'eleve' => ['id' => $id, 'nom' => $nom, 'prenom' => $prenom, 'login' => $login, 'niveau_code' => $niveau],
    'identifiants' => ['login' => $login, 'mot_de_passe' => $password, 'a_changer' => (bool)$mustChange],
]);
