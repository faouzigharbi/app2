# Exercices 11 à 14 — سلاسل البرهان

Portage en pages « chaîne de démonstration » des exercices 11 à 14 d'une fiche
distincte de celle de [`../reels/`](../reels/). La méthode est décrite dans
[`../METHODE.md`](../METHODE.md).

> **Pourquoi un dossier à part.** La fiche riadhyet « تمـارين شـاملة » a elle
> aussi des exercices 11, 12 et 13 — d'un contenu tout autre. Deux fiches ne
> peuvent pas partager un même `ex11.html` : chacune a donc son dossier, son
> index et son noyau, comme le veut la méthode.

## Structure

| page | exercice | volets | questions de l'énoncé |
|---|---|---|---|
| `ex11.html` | التفكيك إلى جداء عوامل | 5 | a, b, c, d, e |
| `ex12.html` | عددان مقلوبان — إنطاق المقام | 5 | 1, puis A, B, C, D |
| `ex13.html` | القيمة المطلقة | 8 | 1) A, B, C, D + 2) quatre équations |
| `ex14.html` | عبارة حرفية | 3 | 1)أ, 1)ب, 2 |

## Ce qui se tire, et pourquoi

**Libres — 11 et 14.** Chaque expression est un schéma dont on tire les
paramètres ; le `(x-2)(x+2)` du 14 ne demande que `p - r = 1` et `q - s = k`.

**Contraint — 12.** Tout repose sur `(u + v√r)(u - v√r) = 1`, donc sur
`u² - r v² = 1` : l'équation de Pell. On choisit dans une liste de ses
solutions, sinon « العددان مقلوبان » serait faux.

**Contraint par les signes — 13.** Lever une valeur absolue, c'est d'abord
établir un signe. `|5 - √3|` ne se lève pas comme `|√3 - 5|`. Les majorants sont
donc tirés d'abord, et les radicandes choisis parmi ceux qu'ils dominent. Pour
`|2x - 1| = 3`, ce sont les deux **solutions** qu'on tire, seul moyen qu'elles
tombent juste.

## Réserve sur l'expression « e » de l'exercice 11

La fiche imprime `e = 3(√3-2) + √2(√3-2) + 3(√3+2)`. Ce troisième terme, avec
son `+2`, ne partage aucun facteur avec les deux premiers : la somme vaut
`6√3 + √6 - 2√2`, qui **n'est pas un produit**. L'exercice demandant de
factoriser, la page lit le troisième terme comme un `q(√3 - 2)` — le schéma des
deux autres — ce qui donne `(√3 - 2)(3 + q + √2)`. Si la fiche voulait vraiment
`+2`, c'est l'énoncé qui est à corriger.

## Vérification

    node verifier.js 300
    CONTRE_EXEMPLES=1 node verifier.js

État actuel :

    11 ✓  12 ✓  13 ✓  14 ✓
    300 tirages par exercice, 6300 questions,
    65100 relations recalculées et 26400 contrôles, 0 erreur.
    13/13 falsifications détectées.

## Régénérer les pages

    node _build.js .
