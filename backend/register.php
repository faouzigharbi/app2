<?php
/**
 * Inscription d'un PARENT ou d'un PROFESSEUR (e-mail + mot de passe).
 * Les comptes élèves sont créés via students_create.php.
 *
 * POST JSON : { role:"parent"|"prof", nom, prenom?, email, password }
 */

declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/util.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/audit.php';

require_method('POST');
$in = json_input();

$role     = clean_str($in['role'] ?? '', 20);
$nom      = clean_str($in['nom'] ?? '', 80);
$prenom   = clean_str($in['prenom'] ?? '', 80);
$email    = clean_str($in['email'] ?? '', 190);
$password = (string)($in['password'] ?? '');

$errors = [];
if (!in_array($role, ['parent', 'prof'], true)) $errors[] = "Rôle invalide.";
if (mb_strlen($nom) < 2)      $errors[] = "Le nom est requis.";
if (!is_email($email))        $errors[] = "L'adresse e-mail n'est pas valide.";
if (strlen($password) < 8)    $errors[] = "Le mot de passe doit contenir au moins 8 caractères.";
if ($errors) json_response(['ok' => false, 'error' => implode(' ', $errors)], 422);

// E-mail / login déjà utilisés ?
$s = db()->prepare('SELECT 1 FROM dv_users WHERE email = ? OR login = ? LIMIT 1');
$s->execute([$email, $email]);
if ($s->fetchColumn()) {
    json_response(['ok' => false, 'error' => "Cette adresse e-mail est déjà utilisée."], 409);
}

$id = uuid4();
$ins = db()->prepare(
    'INSERT INTO dv_users
       (id, role, nom, prenom, login, email, password_hash, statut, annee,
        created_at, last_seen, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, "actif", "", ?, ?, ?)'
);
$today = date('Y-m-d');
$ins->execute([$id, $role, $nom, $prenom ?: null, $email, $email,
    hash_password($password), $today, $today, now()]);

journaliser('user.create', 'user', $id, ['role' => $role, 'self' => true], $id);
login_user($id);

json_response([
    'ok'   => true,
    'user' => ['id' => $id, 'role' => $role, 'nom' => $nom, 'prenom' => $prenom, 'email' => $email],
]);
