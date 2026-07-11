<?php
/**
 * Logique de gamification : niveau, titre, série (streak), badges.
 * Utilisé au moment où un élève termine un exercice (save_progress.php).
 */

declare(strict_types=1);

/**
 * À partir d'un total d'XP, calcule le niveau, le code du titre et l'XP du
 * prochain niveau. Règle simple : 100 XP par niveau.
 *
 * @return array{niveau:int, niveau_titre:string, xp_next_level:int}
 */
function compute_level(int $xp): array
{
    $niveau = intdiv(max(0, $xp), 100) + 1;

    if ($niveau >= 10)      { $titre = 'expert'; }
    elseif ($niveau >= 6)   { $titre = 'avance'; }
    elseif ($niveau >= 3)   { $titre = 'intermediaire'; }
    else                    { $titre = 'debutant'; }

    return [
        'niveau'        => $niveau,
        'niveau_titre'  => $titre,          // code latin, traduit à l'affichage
        'xp_next_level' => $niveau * 100,   // XP cumulée pour le niveau suivant
    ];
}

/**
 * Met à jour la série de jours (streak) selon la dernière date d'activité.
 *
 * @param int         $streak    série actuelle
 * @param string|null $lastDate  dernière date de streak (Y-m-d) ou null
 * @param string      $today     date du jour (Y-m-d)
 * @return array{streak:int, last_streak_date:string}
 */
function compute_streak(int $streak, ?string $lastDate, string $today): array
{
    if ($lastDate === $today) {
        // Déjà compté aujourd'hui : rien ne change.
        return ['streak' => max(1, $streak), 'last_streak_date' => $today];
    }
    $yesterday = date('Y-m-d', strtotime($today . ' -1 day'));
    if ($lastDate === $yesterday) {
        $streak = $streak + 1;      // jour consécutif
    } else {
        $streak = 1;                // série cassée : on repart à 1
    }
    return ['streak' => $streak, 'last_streak_date' => $today];
}

/**
 * XP gagnée pour un exercice, selon le pourcentage de réussite.
 * Base 10 XP + bonus jusqu'à 40 XP pour un sans-faute.
 */
function compute_xp_gain(int $score, int $total): int
{
    if ($total <= 0) {
        return 0;
    }
    $ratio = max(0.0, min(1.0, $score / $total));
    return (int) round(10 + $ratio * 40);
}

/**
 * Décide des badges à débloquer, à partir de l'état de l'élève.
 * Renvoie la liste complète (anciens + nouveaux) sans doublon.
 *
 * @param string[] $current  badges déjà obtenus (codes latins)
 */
function award_badges(array $current, int $score, int $total, int $streak, int $niveau): array
{
    $has = array_flip($current);

    $maybe = static function (string $code) use (&$has) {
        if (!isset($has[$code])) {
            $has[$code] = true;
        }
    };

    if ($total > 0 && $score === $total) { $maybe('sans_faute'); }   // 100 %
    if ($streak >= 5)                    { $maybe('serie_5'); }
    if ($streak >= 30)                   { $maybe('serie_30'); }
    if ($niveau >= 10)                   { $maybe('niveau_10'); }
    $maybe('premier_exercice');                                     // au moins un exercice fait

    return array_keys($has);
}

/** Badges : code -> libellés + emoji (pour l'affichage). */
const DV_BADGES = [
    'premier_exercice' => ['emoji' => '🎯', 'ar' => 'أول تمرين',      'fr' => 'Premier exercice'],
    'sans_faute'       => ['emoji' => '💯', 'ar' => 'بدون خطأ',       'fr' => 'Sans faute'],
    'serie_5'          => ['emoji' => '🔥', 'ar' => 'سلسلة 5 أيام',   'fr' => 'Série de 5'],
    'serie_30'         => ['emoji' => '💎', 'ar' => 'سلسلة 30 يوم',   'fr' => 'Série de 30'],
    'niveau_10'        => ['emoji' => '🏆', 'ar' => 'المستوى 10',     'fr' => 'Niveau 10'],
];
