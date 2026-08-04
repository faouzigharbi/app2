# الضرب و القسمة في مجموعة الأعداد الحقيقية — سلاسل البرهان

Portage en pages « chaîne de démonstration » des exercices 11 à 17 de la fiche
riadhyet « الضرب و القسمة في مجموعة الأعداد الحقيقية » (جوهر سويسي, 2018-2019,
pages 3-4). La méthode est décrite dans [`../METHODE.md`](../METHODE.md).

> **Une fiche, un dossier.** Trois fiches de ce chapitre ont chacune un
> « exercice 11 » — celle-ci, [`../reels/`](../reels/) et
> [`../serie2/`](../serie2/) — et leurs contenus n'ont rien de commun. Elles ne
> peuvent donc pas partager un même `ex11.html`.

## Structure

| page | exercice | volets | questions de l'énoncé |
|---|---|---|---|
| `ex11.html` | A و B يتقاسمان عاملا | 3 | 1, 2, 3 |
| `ex12.html` | عددان مقلوبان | 6 | 1, 2, 3)أ, 3)ب, 3)ج, 3)د |
| `ex13.html` | مقلوبان بالجذور، ثمّ النشر و التفكيك | 5 | 1)أ, 1)ب, 2)أ, 2)ب, 2)ج |
| `ex14.html` | E و F يتقاسمان قوسا | 4 | 1, 2)أ, 2)ب, 2)ج |
| `ex15.html` | π يدخل ثمّ يخرج | 3 | 1)أ, 1)ب, 2 |
| `ex16.html` | x يتلاشى، ثمّ عددان مقلوبان | 4 | 1, 2, 3)أ, 3)ب |
| `ex17.html` | انشر و اختصر، ثمّ فكّك | 4 | 1) E, 1) F, 2) G, 2) H |

## Ce qui se tire, et pourquoi

**11 — libre.** `A` et `B` partagent le facteur `(x - j)`, et c'est là tout
l'exercice : l'énoncé ne le montre qu'à la question 3, mais il est présent dès
le départ. `B - A` se factorise alors sans rien développer. Le générateur ne
tire que `n`, `k`, `m`, `j` et le radicande, en calculant la constante de `A`
pour que le facteur reste exact.

**12 et 13 — contraints.** Les deux reposent sur un couple de nombres inverses.
Au 12 c'est `u² - v²w = 1` (l'équation de Pell) ; au 13 c'est `p²s - t = 1`, la
même chose sous la forme `a = p√s + √t`. On tire dans une liste de solutions,
jamais au hasard — sinon « a مقلوب b » serait faux.

**14, 16 et 17 — libres.** Au 14, `E` et `F` partagent le facteur `(√r x - 1)`,
que `F` ne montre qu'une fois `√r` mis en facteur. Au 16, `a` contient `x` — et
`x` s'en va : c'est la même leçon que le 15, sur une lettre au lieu de `π`.

**15 — rigide.** Ses nombres sont imposés par ses propres questions : « a et c
مقلوبان » force `(√u - 2)(√u + 2) = 1`, donc `u = 5`, et « a et b متقابلان »
force la somme des deux constantes à valoir 2. Seul l'**habillage** varie : le
partage de cette constante, et les deux radicaux qui accompagnent `π`.

Le 12 mérite un mot : ses quatre dernières questions ne sont **qu'une seule**
factorisation lue quatre fois. Une fois `E = b(x - K)` obtenu, calculer `E` en
`x = √w + K`, résoudre `E = 0` et résoudre `E = b` ne demandent plus aucun
calcul — seulement de lire le produit. Le générateur impose donc `p - r = 1`,
sans quoi le facteur `(x - K)` n'apparaîtrait pas.

## Le π de l'exercice 15

`π` n'appartient pas à ℚ[√d] et n'y appartiendra jamais. Mais l'exercice ne
demande rien de sa valeur : il ne le met là **que pour l'éliminer** — les deux
expressions le contiennent, aucune des deux réponses ne le contient. Le noyau le
traite donc comme une lettre libre, et le validateur vérifie chaque étape sur
des dizaines de valeurs : si une seule dépendait de `π`, elle serait rejetée.

## Vérification

    node verifier.js 400
    CONTRE_EXEMPLES=1 node verifier.js

État actuel :

    11 ✓  12 ✓  13 ✓  14 ✓  15 ✓  16 ✓  17 ✓
    400 tirages par exercice, 11600 questions,
    954800 relations recalculées et 223600 contrôles, 0 erreur.
    26/26 falsifications détectées.

## Régénérer les pages

    node _build.js .
