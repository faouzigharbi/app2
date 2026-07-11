<?php
/**
 * Authentification : utilisateur courant, ouverture/fermeture de session,
 * hachage/vérification de mot de passe.
 *
 * Requiert db.php.
 */

declare(strict_types=1);

/** Colonnes publiques d'un utilisateur (jamais password_hash). */
const DV_USER_PUBLIC_COLS =
    'id, role, nom, prenom, login, email, statut, etablissement_id,
     niveau_code, annee, xp, niveau, niveau_titre, streak,
     must_change_password, created_by_user_id';

/** Utilisateur connecté (tableau) ou null. Compte actif uniquement. */
function current_user(): ?array
{
    static $cache = false;
    if ($cache !== false) return $cache;

    if (empty($_SESSION['user_id'])) return $cache = null;

    $stmt = db()->prepare(
        'SELECT ' . DV_USER_PUBLIC_COLS . '
         FROM dv_users
         WHERE id = ? AND statut = "actif" AND deleted_at IS NULL'
    );
    $stmt->execute([$_SESSION['user_id']]);
    $u = $stmt->fetch();
    return $cache = ($u ?: null);
}

/** Exige un utilisateur connecté ; sinon 401. */
function require_login(): array
{
    $u = current_user();
    if (!$u) json_response(['ok' => false, 'error' => "Non connecté."], 401);
    return $u;
}

/** Exige l'un des rôles donnés ; sinon 403. */
function require_role(string ...$roles): array
{
    $u = require_login();
    if (!in_array($u['role'], $roles, true)) {
        json_response(['ok' => false, 'error' => "Accès refusé."], 403);
    }
    return $u;
}

/** Ouvre la session pour un utilisateur (régénère l'id de session). */
function login_user(string $userId): void
{
    session_regenerate_id(true);
    $_SESSION['user_id'] = $userId;
}

/** Ferme la session courante. */
function logout_user(): void
{
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
}

/** Hache un mot de passe. */
function hash_password(string $plain): string
{
    return password_hash($plain, PASSWORD_DEFAULT);
}

/** Vérifie un mot de passe contre son hash. */
function verify_password(string $plain, ?string $hash): bool
{
    return $hash !== null && $hash !== '' && password_verify($plain, $hash);
}
