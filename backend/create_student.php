<?php
/**
 * Création d'un compte ÉLÈVE par un PROFESSEUR ou un PARENT connecté.
 *  - Créé par un prof   -> l'élève reçoit la "classe" du prof.
 *  - Créé par un parent -> l'élève est relié au parent (parent_id).
 *
 * POST JSON : { nom, annee, login, password, classe? }
 */

declare(strict_types=1);
require __DIR__ . '/db.php';

require_method('POST');
$me = require_user();  // doit être connecté

if (!in_array($me['role'], ['prof', 'parent', 'admin'], true)) {
    json_response(['ok' => false, 'error' => "Seuls un professeur ou un parent peuvent créer un élève."], 403);
}

$in       = json_input();
$nom      = trim((string)($in['nom']    ?? ''));
$annee    = trim((string)($in['annee']  ?? ''));
$login    = trim((string)($in['login']  ?? ''));
$password = (string)($in['password'] ?? '');
$classe   = trim((string)($in['classe'] ?? '')) ?: ($me['classe'] ?? null);

$errors = [];
if (mb_strlen($nom) < 2)      { $errors[] = "Le nom de l'élève est requis."; }
if ($login === '')            { $errors[] = "L'identifiant de connexion est requis."; }
if (strlen($password) < 4)    { $errors[] = "Le mot de passe doit contenir au moins 4 caractères."; }
if ($errors) {
    json_response(['ok' => false, 'error' => implode(' ', $errors)], 422);
}

// Identifiant déjà pris ?
$stmt = db()->prepare('SELECT id FROM dv_users WHERE login = ? LIMIT 1');
$stmt->execute([$login]);
if ($stmt->fetch()) {
    json_response(['ok' => false, 'error' => "Cet identifiant est déjà utilisé."], 409);
}

// Lien selon le créateur.
$parentId = $me['role'] === 'parent' ? $me['id'] : null;

$id    = uuid4();
$hash  = password_hash($password, PASSWORD_DEFAULT);
$today = date('Y-m-d');

$stmt = db()->prepare(
    'INSERT INTO dv_users
       (id, nom, role, login, password_hash, annee, parent_id, classe,
        xp, niveau, niveau_titre, xp_next_level, streak, created_at, last_seen, updated_at)
     VALUES (?, ?, "eleve", ?, ?, ?, ?, ?, 0, 1, "debutant", 100, 0, ?, ?, NOW())'
);
$stmt->execute([$id, $nom, $login, $hash, $annee, $parentId, $classe, $today, $today]);

json_response([
    'ok'    => true,
    'eleve' => ['id' => $id, 'nom' => $nom, 'login' => $login, 'annee' => $annee, 'classe' => $classe],
]);
