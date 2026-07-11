<?php
/**
 * Inscription d'un PARENT ou d'un PROFESSEUR (avec e-mail + mot de passe).
 * Les comptes ÉLÈVES ne se créent pas ici : voir create_student.php
 * (créés par le prof ou le parent).
 *
 * POST JSON : { role: "parent"|"prof", nom, email, password, classe? }
 */

declare(strict_types=1);
require __DIR__ . '/db.php';

require_method('POST');
$in = json_input();

$role     = $in['role']     ?? '';
$nom      = trim((string)($in['nom']   ?? ''));
$email    = trim((string)($in['email'] ?? ''));
$password = (string)($in['password'] ?? '');
$classe   = trim((string)($in['classe'] ?? '')) ?: null;

// --- Validation ---
$errors = [];
if (!in_array($role, ['parent', 'prof'], true)) {
    $errors[] = "Rôle invalide.";
}
if (mb_strlen($nom) < 2) {
    $errors[] = "Le nom est requis.";
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "L'adresse e-mail n'est pas valide.";
}
if (strlen($password) < 6) {
    $errors[] = "Le mot de passe doit contenir au moins 6 caractères.";
}
if ($errors) {
    json_response(['ok' => false, 'error' => implode(' ', $errors)], 422);
}

// --- E-mail déjà utilisé ? ---
$stmt = db()->prepare('SELECT id FROM dv_users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    json_response(['ok' => false, 'error' => "Cette adresse e-mail est déjà utilisée."], 409);
}

// --- Création du compte ---
$id   = uuid4();
$hash = password_hash($password, PASSWORD_DEFAULT);
$today = date('Y-m-d');

$stmt = db()->prepare(
    'INSERT INTO dv_users (id, nom, role, login, email, password_hash, annee, classe, created_at, last_seen, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())'
);
$stmt->execute([$id, $nom, $role, $email, $email, $hash, '', $classe, $today, $today]);

// Connexion immédiate après inscription.
$_SESSION['user_id'] = $id;

json_response([
    'ok'   => true,
    'user' => ['id' => $id, 'nom' => $nom, 'role' => $role, 'email' => $email, 'classe' => $classe],
]);
