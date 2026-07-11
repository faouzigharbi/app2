<?php
/**
 * Renvoie l'utilisateur actuellement connecté (ou connecté:false).
 * Sert au front pour savoir qui est connecté et adapter l'affichage.
 * GET.
 */

declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/labels.php';

$user = current_user();
if (!$user) {
    json_response(['ok' => true, 'connecte' => false, 'user' => null]);
}

// On enrichit avec les libellés arabes (le front peut aussi le faire lui-même).
$user['role_label']         = label(DV_ROLES, $user['role'], 'ar');
$user['niveau_titre_label'] = label(DV_NIVEAU_TITRES, $user['niveau_titre'] ?? null, 'ar');

json_response(['ok' => true, 'connecte' => true, 'user' => $user]);
