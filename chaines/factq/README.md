# التفكيك في مجموعة الأعداد الكسرية النسبية (8 أساسي)

Bâti sur la fiche *التفكيك في مجموعة الأعداد الكسرية النسبية* (ضفاف البحيرة,
2021). **5 pages, une par TYPE, 20 questions par tirage.**

## Une page par type, plusieurs modèles par page

C'est la différence avec les chapitres précédents. La fiche papier aligne dix
lignes du même type, toutes différentes ; ici **une page = un type**, et à
l'intérieur le générateur **tire au hasard parmi les modèles de ce type**.
L'élève rencontre la même méthode sous ses différents habillages — ce qu'un
exercice papier ne peut pas offrir, puisque ses lignes sont figées.

| Page | Type | Modèles tirés |
|---|---|---|
| 1 | **facteur commun numérique** | deux termes ; constante + monôme ; trois termes dont une constante ; **facteur littéral partagé** (`xy`, `xyz`, `xyt`) |
| 2 | **facteur commun visible** | `UV + UW` ; `UV − U` ; `UV + U²` ; trois termes |
| 3 | **facteur commun caché** | parenthèse opposée ; coefficient à sortir ; queue à reconnaître |
| 4 | **équation produit** | trois façons de faire apparaître le facteur commun |
| 5 | **exercice complet** | développer, calculer, factoriser, résoudre — sur une même expression |

## Le point de méthode, type par type

**Type 1.** Le facteur commun ne se devine pas, il se calcule : c'est le
**PGCD des numérateurs sur le PPCM des dénominateurs**. Pour
`16/15 a + 8/5 b`, c'est `8/15`, et il reste `2a + 3b`. La chaîne fait de ces
deux calculs deux étapes distinctes.

Les nombres sont construits **à partir de la réponse** : on choisit un facteur
commun simple et de petites parts, puis on en déduit les coefficients — c'est
ainsi que la fiche est faite, `16/15 a + 8/5 b` venant de `8/15(2a + 3b)` et
non l'inverse. Tirer les coefficients au hasard donnerait des nombres qu'aucun
professeur n'écrirait. Le générateur recalcule ensuite le PGCD/PPCM depuis les
coefficients affichés et rejette le tirage s'il ne retombe pas sur le facteur
prévu : la méthode enseignée doit donner exactement la réponse annoncée. Il
écarte aussi les tirages où tous les dénominateurs sont égaux — l'étape du
PPCM serait vide.

Et pour `12/49 xy − 24/35 xyz + 36/70 xyt`, le facteur commun est **aussi
littéral** : c'est `xy`, et c'est lui qu'on oublie. Le validateur ne s'y laisse
pas prendre — il donne à `xy`, `xyz`, `xyt` des valeurs **déduites de celles
de x, y, z, t**, sans quoi l'identité `xy(1 + z) = xy + xyz` serait vraie par
accident. Une falsification du banc d'essai ampute exprès ce facteur.

**Type 3.** Le facteur commun est là, mais déguisé. `5x(2/3x − 3) − 7/2(3 − 2/3x)` :
la seconde parenthèse est **l'opposée** de la première. Tant qu'on ne l'a pas
retournée, il n'y a rien à mettre en facteur. C'est l'étape « نُظهره ».

**Type 4.** On ne développe surtout pas. On factorise, et **un produit est nul
si et seulement si l'un de ses facteurs est nul** — deux équations du premier
degré au lieu d'une du second.

## Validation

```
node verifier.js 250
CONTRE_EXEMPLES=1 node verifier.js
```

Une factorisation est une **identité** : la forme factorisée et la forme
développée doivent coïncider *partout*. Elles sont donc évaluées en des
dizaines de valeurs tirées au hasard — un facteur commun mal choisi, un signe
retourné, un coefficient oublié ne survivent pas au premier essai. Pour les
équations produit, les deux racines annoncées sont réinjectées dans
l'expression de départ, et la forme factorisée est confrontée à l'originale
en quarante points de plus.

Une équation produit décrit une **disjonction** : « x = x₁ **ou** x = x₂ ».
Chaque racine ne vaut que dans son cas ; le validateur demande donc que ces
étapes-là tiennent dans au moins un des deux, et c'est le contrôle de la
conclusion qui fait le vrai travail. Partout ailleurs, une étape doit tenir
dans *tous* les environnements.

```
250 tirages par type, 5000 questions,
376000 relations recalculées et 332750 identités re-démontrées, 0 erreur.
9/9 falsifications détectées.
5 pages — 0 en défaut (Chromium).
```

Le tirage massif garantit aussi que **chaque modèle sort** : le validateur
compte les modèles rencontrés et les affiche à côté de chaque type.

## Fichiers

| Fichier | Rôle |
|---|---|
| `noyau.js` | rationnels exacts, analyseur (puissances, juxtaposition), rendu |
| `fact.js` | les cinq types, chacun avec ses modèles |
| `gens.js` | une page par type |
| `_build.js` | émet les pages en accordéon et l'index |
| `verifier.js` | validation par exécution + contre-exemples |
