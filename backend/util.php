<?php
/**
 * Utilitaires transverses : validation, codes d'association, hachage de code.
 */

declare(strict_types=1);

/** Nettoie une chaîne d'entrée (trim + longueur max). */
function clean_str($v, int $max = 255): string
{
    return mb_substr(trim((string)$v), 0, $max);
}

/** E-mail valide ? */
function is_email(string $v): bool
{
    return (bool) filter_var($v, FILTER_VALIDATE_EMAIL);
}

/**
 * Génère un code d'association lisible, aléatoire et difficile à deviner.
 * Alphabet sans caractères ambigus (0/O, 1/I/L).
 */
function generate_code(int $length = 8): string
{
    $alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    $max = strlen($alphabet) - 1;
    $out = '';
    for ($i = 0; $i < $length; $i++) {
        $out .= $alphabet[random_int(0, $max)];
    }
    return $out;
}

/**
 * Hash déterministe d'un code (HMAC-SHA256 avec le secret applicatif).
 * Déterministe -> permet de retrouver l'invitation par son hash, sans
 * jamais stocker le code en clair.
 */
function hash_code(string $code): string
{
    $secret = (string)($GLOBALS['dv_config']['app_secret'] ?? '');
    return hash_hmac('sha256', strtoupper(trim($code)), $secret);
}

/** Génère un mot de passe temporaire simple (pour réinitialisation élève). */
function generate_temp_password(int $length = 6): string
{
    return generate_code($length);
}
