<?php
/**
 * Qui est connecté ? GET.
 * Renvoie l'utilisateur courant enrichi de ses libellés arabes.
 */

declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/labels.php';

$u = current_user();
if (!$u) json_response(['ok' => true, 'connecte' => false, 'user' => null]);

$u['role_label']         = label(DV_ROLES, $u['role'], 'ar');
$u['niveau_titre_label'] = label(DV_NIVEAU_TITRES, $u['niveau_titre'] ?? null, 'ar');
$u['niveau_scolaire_label'] = label(DV_NIVEAUX, $u['niveau_code'] ?? null, 'ar');
$u['must_change_password']  = (int)($u['must_change_password'] ?? 0) === 1;

json_response(['ok' => true, 'connecte' => true, 'user' => $u]);
