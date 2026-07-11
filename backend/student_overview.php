<?php
/**
 * Vue de synthèse d'un élève : gamification + statistiques + activité récente.
 * GET ?eleve_id=...   (l'élève lui-même, un parent associé, un prof gérant, admin)
 */

declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/util.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/authz.php';
require __DIR__ . '/labels.php';

$me = require_login();
$eleveId = clean_str($_GET['eleve_id'] ?? '', 36) ?: $me['id'];

require_can($me, 'progress.read', ['eleve_id' => $eleveId]);

// Profil + gamification
$s = db()->prepare('SELECT id, nom, prenom, niveau, niveau_titre, xp, xp_next_level, streak, badges FROM dv_users WHERE id = ? AND deleted_at IS NULL');
$s->execute([$eleveId]);
$u = $s->fetch();
if (!$u) json_response(['ok' => false, 'error' => "Élève introuvable."], 404);

$badges = [];
if (!empty($u['badges'])) { $d = json_decode($u['badges'], true); if (is_array($d)) $badges = $d; }

// Statistiques
$s = db()->prepare('SELECT total_sessions, total_minutes, total_xp, daily_data FROM dv_analytics WHERE user_id = ?');
$s->execute([$eleveId]);
$an = $s->fetch() ?: ['total_sessions' => 0, 'total_minutes' => 0, 'total_xp' => 0, 'daily_data' => null];

// Activité récente
$s = db()->prepare('SELECT chapitre_id, activite_nom, score, etat, completed_at, updated_at FROM dv_progress WHERE user_id = ? ORDER BY updated_at DESC LIMIT 10');
$s->execute([$eleveId]);
$recent = $s->fetchAll();

json_response([
    'ok' => true,
    'eleve' => [
        'id' => $u['id'], 'nom' => $u['nom'], 'prenom' => $u['prenom'],
        'niveau' => (int)$u['niveau'],
        'niveau_titre' => $u['niveau_titre'],
        'niveau_titre_label' => label(DV_NIVEAU_TITRES, $u['niveau_titre'] ?? null, 'ar'),
        'xp' => (int)$u['xp'], 'xp_next_level' => (int)$u['xp_next_level'],
        'streak' => (int)$u['streak'],
        'badges' => $badges,
    ],
    'stats' => [
        'total_sessions' => (int)$an['total_sessions'],
        'total_minutes'  => (int)$an['total_minutes'],
        'total_xp'       => (int)$an['total_xp'],
    ],
    'activite_recente' => $recent,
]);
