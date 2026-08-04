# الضرب و القسمة في مجموعة الأعداد الحقيقية — سلاسل البرهان

Portage en pages « chaîne de démonstration » des exercices 11 à 13 de la fiche
riadhyet « الضرب و القسمة في مجموعة الأعداد الحقيقية » (جوهر سويسي, 2018-2019,
page 3). La méthode est décrite dans [`../METHODE.md`](../METHODE.md).

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

Le 12 mérite un mot : ses quatre dernières questions ne sont **qu'une seule**
factorisation lue quatre fois. Une fois `E = b(x - K)` obtenu, calculer `E` en
`x = √w + K`, résoudre `E = 0` et résoudre `E = b` ne demandent plus aucun
calcul — seulement de lire le produit. Le générateur impose donc `p - r = 1`,
sans quoi le facteur `(x - K)` n'apparaîtrait pas.

## Vérification

    node verifier.js 400
    CONTRE_EXEMPLES=1 node verifier.js

État actuel :

    11 ✓  12 ✓  13 ✓
    400 tirages par exercice, 5600 questions,
    331600 relations recalculées et 64800 contrôles, 0 erreur.
    13/13 falsifications détectées.

## Régénérer les pages

    node _build.js .
