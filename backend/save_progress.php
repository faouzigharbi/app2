<?php
/**
 * Enregistre le résultat d'un exercice et met à jour la gamification :
 * XP, niveau, titre, série (streak), badges, et les statistiques.
 *
 * Appelé par une page d'exercice après validation.
 *
 * POST JSON :
 * {
 *   user_id?,          // id de l'élève (facultatif si l'élève est connecté)
 *   chapitre_id,       // ex : "division-fractions"
 *   theme?,            // ex : "fractions"
 *   activite_id?, activite_nom?,
 *   score, total,      // ex : 8 sur 10
 *   erreurs?,          // texte/JSON facultatif
 *   duree_secondes?
 * }
 */

declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/labels.php';
require __DIR__ . '/gamification.php';

require_method('POST');
$in = json_input();

// --- Qui est l'élève ? Session en priorité, sinon user_id fourni. ---
$me = current_user();
$eleveId = ($me && $me['role'] === 'eleve') ? $me['id'] : (string)($in['user_id'] ?? '');
if ($eleveId === '') {
    json_response(['ok' => false, 'error' => "Élève non identifié."], 401);
}

$chapitre = trim((string)($in['chapitre_id'] ?? 'exercice'));
$theme    = trim((string)($in['theme'] ?? ''));
$actId    = trim((string)($in['activite_id'] ?? $chapitre));
$actNom   = trim((string)($in['activite_nom'] ?? $chapitre));
$score    = max(0, (int)($in['score'] ?? 0));
$total    = max(0, (int)($in['total'] ?? 0));
$erreurs  = isset($in['erreurs']) ? (string)$in['erreurs'] : null;
$duree    = max(0, (int)($in['duree_secondes'] ?? 0));
$today    = date('Y-m-d');

// --- Élève existant ? ---
$stmt = db()->prepare('SELECT id, xp, niveau, streak, last_streak_date, badges FROM dv_users WHERE id = ? LIMIT 1');
$stmt->execute([$eleveId]);
$eleve = $stmt->fetch();
if (!$eleve) {
    json_response(['ok' => false, 'error' => "Élève introuvable."], 404);
}

// --- Calculs de gamification ---
$gain    = compute_xp_gain($score, $total);
$newXp   = (int)$eleve['xp'] + $gain;
$level   = compute_level($newXp);
$leveledUp = $level['niveau'] > (int)$eleve['niveau'];

$streakInfo = compute_streak((int)$eleve['streak'], $eleve['last_streak_date'], $today);

$badges = [];
if (!empty($eleve['badges'])) {
    $decoded = json_decode($eleve['badges'], true);
    if (is_array($decoded)) { $badges = $decoded; }
}
$badgesBefore = $badges;
$badges = award_badges($badges, $score, $total, $streakInfo['streak'], $level['niveau']);
$newBadges = array_values(array_diff($badges, $badgesBefore));

// --- Écritures en base (transaction) ---
try {
    db()->beginTransaction();

    // 1) Mise à jour de l'élève.
    $upd = db()->prepare(
        'UPDATE dv_users
            SET xp = ?, niveau = ?, niveau_titre = ?, xp_next_level = ?,
                streak = ?, last_streak_date = ?, badges = ?,
                last_seen = ?, updated_at = NOW()
          WHERE id = ?'
    );
    $upd->execute([
        $newXp, $level['niveau'], $level['niveau_titre'], $level['xp_next_level'],
        $streakInfo['streak'], $streakInfo['last_streak_date'], json_encode($badges, JSON_UNESCAPED_UNICODE),
        $today, $eleveId,
    ]);

    // 2) Ligne de progression.
    $ins = db()->prepare(
        'INSERT INTO dv_progress
           (user_id, chapitre_id, etat, etape, etapes_total, progression,
            activite_id, activite_nom, score, erreurs, started_at, completed_at, updated_at)
         VALUES (?, ?, "termine", ?, ?, 100, ?, ?, ?, ?, ?, ?, NOW())'
    );
    $ins->execute([
        $eleveId, $chapitre, $total, max(1, $total),
        $actId, $actNom, $score . '/' . $total, $erreurs, $today, $today,
    ]);

    // 3) Statistiques (dv_analytics) : une ligne par élève.
    $minutes = (int)ceil($duree / 60);
    $stmt = db()->prepare('SELECT id, total_sessions, total_minutes, total_xp, daily_data FROM dv_analytics WHERE user_id = ? LIMIT 1');
    $stmt->execute([$eleveId]);
    $an = $stmt->fetch();

    $daily = [];
    if ($an && !empty($an['daily_data'])) {
        $d = json_decode($an['daily_data'], true);
        if (is_array($d)) { $daily = $d; }
    }
    $daily[$today] = [
        'sessions' => (int)($daily[$today]['sessions'] ?? 0) + 1,
        'minutes'  => (int)($daily[$today]['minutes'] ?? 0) + $minutes,
        'xp'       => (int)($daily[$today]['xp'] ?? 0) + $gain,
    ];
    $dailyJson = json_encode($daily, JSON_UNESCAPED_UNICODE);

    if ($an) {
        $stmt = db()->prepare(
            'UPDATE dv_analytics
                SET total_sessions = total_sessions + 1,
                    total_minutes  = total_minutes + ?,
                    total_xp       = total_xp + ?,
                    daily_data     = ?, updated_at = NOW()
              WHERE id = ?'
        );
        $stmt->execute([$minutes, $gain, $dailyJson, $an['id']]);
    } else {
        $stmt = db()->prepare(
            'INSERT INTO dv_analytics (user_id, total_sessions, total_minutes, total_xp, daily_data, updated_at)
             VALUES (?, 1, ?, ?, ?, NOW())'
        );
        $stmt->execute([$eleveId, $minutes, $gain, $dailyJson]);
    }

    db()->commit();
} catch (Throwable $e) {
    if (db()->inTransaction()) { db()->rollBack(); }
    json_response(['ok' => false, 'error' => "Enregistrement impossible."], 500);
}

// --- Réponse : le front peut animer le gain d'XP, le level-up, etc. ---
json_response([
    'ok' => true,
    'gain_xp'       => $gain,
    'xp'            => $newXp,
    'niveau'        => $level['niveau'],
    'niveau_titre'  => $level['niveau_titre'],
    'niveau_label'  => label(DV_NIVEAU_TITRES, $level['niveau_titre'], 'ar'),
    'xp_next_level' => $level['xp_next_level'],
    'streak'        => $streakInfo['streak'],
    'level_up'      => $leveledUp,
    'nouveaux_badges' => $newBadges,
]);
