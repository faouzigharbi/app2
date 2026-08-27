<?php
/**
 * Devoirati — boite aux lettres des carnets.
 *
 *   GET  sync.php?code=ABCD-EFGH   -> { "carnet": {...} }  ou { "carnet": null }
 *   POST sync.php  { code, carnet } -> fusionne et enregistre
 *
 * Le POST FUSIONNE au lieu d'ecraser. C'est la piece essentielle :
 * l'envoi part par sendBeacon quand l'onglet se ferme, donc sans
 * aller-retour possible cote navigateur. Si le serveur ecrasait, un
 * PC dont l'onglet est reste ouvert toute la soiree effacerait en le
 * fermant ce que le telephone a fait entre-temps.
 *
 * La fusion n'utilise que des unions et des maximums : elle donne le
 * meme resultat quel que soit l'ordre d'arrivee des synchronisations.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

const TAILLE_MAX  = 524288;   // 512 Ko par carnet — tres au-dela d'un usage normal
const PAGES_MAX   = 5000;     // garde-fou contre un carnet fabrique a la main
const RECENTS_MAX = 60;

function sortir(array $x, int $etat = 200): never {
    http_response_code($etat);
    echo json_encode($x, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** Le code est le seul identifiant : on le valide strictement. */
function codeValide(?string $c): ?string {
    if ($c === null) return null;
    $c = strtoupper(trim($c));
    return preg_match('/^[A-Z0-9]{4}-[A-Z0-9]{4}$/', $c) === 1 ? $c : null;
}

function base(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;
    $c = require __DIR__ . '/config.php';
    $pdo = new PDO(
        "mysql:host={$c['hote']};dbname={$c['base']};charset=utf8mb4",
        $c['util'], $c['mdp'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]
    );
    return $pdo;
}

/* --------------------------------------------------------------------
   Validation du carnet entrant. On ne fait confiance a rien : le code
   est public, n'importe qui peut envoyer n'importe quoi a cette URL.
   -------------------------------------------------------------------- */
function carnetPropre(mixed $x): ?array {
    if (!is_array($x) || !isset($x['pages']) || !is_array($x['pages'])) return null;
    if (count($x['pages']) > PAGES_MAX) return null;

    $pages = [];
    foreach ($x['pages'] as $chemin => $p) {
        if (!is_string($chemin) || $chemin === '' || strlen($chemin) > 300) continue;
        if ($chemin[0] !== '/' || str_contains($chemin, '..')) continue;   // un chemin du site, rien d'autre
        if (!is_array($p)) continue;

        $q = [
            'n'  => min(100000, max(0, (int)($p['n']  ?? 0))),
            'd'  => max(0, (int)($p['d']  ?? 0)),
            'f'  => !empty($p['f']) ? 1 : 0,
            'fd' => max(0, (int)($p['fd'] ?? 0)),
            'm'  => !empty($p['m']) ? 1 : 0,
            'sd' => max(0, (int)($p['sd'] ?? 0)),
        ];
        $q['t'] = is_string($p['t'] ?? null) ? mb_substr($p['t'], 0, 120) : '';
        $q['c'] = is_string($p['c'] ?? null) ? mb_substr($p['c'], 0, 60)  : '';
        $s = $p['s'] ?? null;
        $q['s'] = in_array($s, ['ok', 'err', 'dur'], true) ? $s : null;
        if (isset($p['b']) && is_array($p['b']) && count($p['b']) === 2) {
            $bo = (int)$p['b'][0]; $bt = (int)$p['b'][1];
            if ($bt > 0 && $bo >= 0 && $bo <= $bt && $bt <= 100000) $q['b'] = [$bo, $bt];
        }
        $pages[$chemin] = $q;
    }
    if (!$pages) return null;

    $recents = [];
    foreach (($x['recents'] ?? []) as $k) {
        if (is_string($k) && isset($pages[$k]) && !in_array($k, $recents, true)) $recents[] = $k;
        if (count($recents) >= RECENTS_MAX) break;
    }
    return ['v' => 2, 'pages' => $pages, 'recents' => $recents];
}

/* --------------------------------------------------------------------
   Fusion. Meme regle que cote navigateur :
     - n, d, b : monotones, on prend le maximum ;
     - f et s  : l'eleve peut les ANNULER, donc chacun porte sa propre
                 date et c'est la modification la plus recente qui gagne.
                 Sans ca, un favori retire sur le telephone reviendrait
                 a la synchro suivante depuis le PC.
   -------------------------------------------------------------------- */
function fusionner(array $a, array $b): array {
    $pages = $a['pages'];
    foreach ($b['pages'] as $k => $y) {
        if (!isset($pages[$k])) { $pages[$k] = $y; continue; }
        $x = $pages[$k];
        $p = [
            'n' => max($x['n'] ?? 0, $y['n'] ?? 0),
            'd' => max($x['d'] ?? 0, $y['d'] ?? 0),
            't' => ($x['d'] ?? 0) >= ($y['d'] ?? 0) ? ($x['t'] ?: $y['t']) : ($y['t'] ?: $x['t']),
            'c' => $x['c'] ?: $y['c'],
        ];
        if (($x['fd'] ?? 0) >= ($y['fd'] ?? 0)) { $p['f'] = $x['f']; $p['fd'] = $x['fd'] ?? 0; }
        else                                    { $p['f'] = $y['f']; $p['fd'] = $y['fd'] ?? 0; }
        if (($x['sd'] ?? 0) >= ($y['sd'] ?? 0)) { $p['s'] = $x['s']; $p['m'] = $x['m']; $p['sd'] = $x['sd'] ?? 0; }
        else                                    { $p['s'] = $y['s']; $p['m'] = $y['m']; $p['sd'] = $y['sd'] ?? 0; }
        $xb = $x['b'] ?? null; $yb = $y['b'] ?? null;
        if ($xb && $yb) $p['b'] = ($xb[0] / $xb[1]) >= ($yb[0] / $yb[1]) ? $xb : $yb;
        elseif ($xb || $yb) $p['b'] = $xb ?: $yb;
        $pages[$k] = $p;
    }

    $recents = [];
    foreach (array_merge($a['recents'] ?? [], $b['recents'] ?? []) as $k) {
        if (isset($pages[$k]) && !in_array($k, $recents, true)) $recents[] = $k;
    }
    usort($recents, fn($u, $w) => ($pages[$w]['d'] ?? 0) <=> ($pages[$u]['d'] ?? 0));

    return ['v' => 2, 'pages' => $pages, 'recents' => array_slice($recents, 0, RECENTS_MAX)];
}

/* ==================================================================== */

try {
    $methode = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($methode === 'GET') {
        $code = codeValide($_GET['code'] ?? null);
        if (!$code) sortir(['erreur' => 'code'], 400);

        $st = base()->prepare('SELECT donnees FROM carnets WHERE code = ?');
        $st->execute([$code]);
        $ligne = $st->fetchColumn();
        sortir(['carnet' => $ligne ? json_decode((string)$ligne, true) : null]);
    }

    if ($methode === 'POST') {
        $brut = file_get_contents('php://input', false, null, 0, TAILLE_MAX + 1);
        if ($brut === false || strlen($brut) > TAILLE_MAX) sortir(['erreur' => 'taille'], 413);

        $envoi = json_decode($brut, true);
        $code  = codeValide($envoi['code'] ?? null);
        if (!$code) sortir(['erreur' => 'code'], 400);

        $entrant = carnetPropre($envoi['carnet'] ?? null);
        if (!$entrant) sortir(['erreur' => 'carnet'], 400);

        $pdo = base();
        $pdo->beginTransaction();
        // FOR UPDATE : deux appareils qui deposent en meme temps ne
        // doivent pas se marcher dessus.
        $st = $pdo->prepare('SELECT donnees FROM carnets WHERE code = ? FOR UPDATE');
        $st->execute([$code]);
        $ancien = $st->fetchColumn();

        $final = $ancien
            ? fusionner(json_decode((string)$ancien, true) ?: ['pages' => [], 'recents' => []], $entrant)
            : $entrant;

        $json = json_encode($final, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $pdo->prepare(
            'INSERT INTO carnets (code, donnees, maj, cree) VALUES (?, ?, NOW(), NOW())
             ON DUPLICATE KEY UPDATE donnees = VALUES(donnees), maj = NOW()'
        )->execute([$code, $json]);
        $pdo->commit();

        sortir(['ok' => true, 'pages' => count($final['pages'])]);
    }

    sortir(['erreur' => 'methode'], 405);

} catch (Throwable $e) {
    // On ne renvoie jamais le detail : le message pourrait contenir des
    // identifiants de connexion.
    error_log('devoirati sync : ' . $e->getMessage());
    sortir(['erreur' => 'serveur'], 500);
}
