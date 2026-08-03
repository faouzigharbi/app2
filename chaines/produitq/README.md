# الجداء و القسمة في ℚ (8 أساسي)

Bâti sur la leçon *الضرب و القسمة في ℚ* (riadhyet) et sur les devoirs de la
*المدرسة الإعدادية النموذجية ضفاف البحيرة*. **10 exercices, 36 questions par
tirage.**

Ces cinq devoirs partagent un même noyau algébrique — produit et quotient de
rationnels, développement, factorisation, fractions étagées — et une partie
géométrique (triangles, milieux, bissectrices) qui demande un tout autre type
de chaîne. C'est le noyau algébrique qui est porté ici ; voir « La suite ».

## Ce que ce chapitre couvre

| Ex. | Ce que l'élève doit faire |
|-----|---------------------------|
| 1 | quatre produits de deux fractions — **en simplifiant avant de multiplier** |
| 2 | trois produits de trois fractions |
| 3 | division et **fractions étagées** |
| 4 | développer `k(ax + b)`, puis réduire |
| 5 | **produit de deux parenthèses** — quatre produits, pas trois |
| 6 | factoriser : reconnaître le facteur commun |
| 7 | les **éléments remarquables** : ×0, ×1, ×(−1), et deux inverses |
| 8 | **déterminer un signe sans calculer** — les nombres sont hors de portée |
| 9 | **ℚ₊ ou ℚ₋ ?** — composer des signes sur des lettres |
| 10 | la valeur absolue traverse le produit : \|ab\| = \|a\|·\|b\| |

## La méthode, encore

`4/9 × 3/8` ne se calcule pas en `12/72` puis en réduisant. On barre le 4 avec
le 8, le 3 avec le 9, et il reste `1/6` : **le produit des grands nombres
n'apparaît jamais**. La chaîne impose ce chemin, et le signe se détermine
à part, en comptant les facteurs négatifs, avant tout calcul de valeur.

Pour le produit de deux parenthèses, l'étape qui compte est celle du **carré**.
Un élève qui écrit trois produits au lieu de quatre perd le terme de degré 2 ;
la chaîne l'isole donc explicitement.

## Ce qui ne se calcule pas

Les exercices 7, 8 et 9 sont ceux où **il ne faut surtout pas calculer**.

`915486254 × (−5169428735) = −n` : personne ne fera ce produit, et c'est le
propos. On compte les facteurs négatifs, on en déduit le signe du produit,
donc celui de `−n`, donc celui de `n`. Le générateur tire exprès des nombres
à douze chiffres : la tentation du calcul est écartée d'office.

De même, `a/b` avec a et b négatifs n'a pas de valeur — il a un signe. Et
`(−31/29) × (−1)` ne demande pas une multiplication mais une **reconnaissance** :
multiplier par −1, c'est prendre l'opposé.

Ces chaînes ne contiennent donc, par construction, aucune égalité à
recalculer. Le validateur ne leur impose pas le minimum d'étapes calculables
qu'il exige ailleurs — mais il re-démontre leur conclusion : le signe annoncé
doit se déduire des seuls signes des facteurs, et pour la classe ℚ₊/ℚ₋ il
donne à `a` et `b` trente valeurs négatives au hasard et vérifie le signe
obtenu.

## Validation

```
node verifier.js 250
CONTRE_EXEMPLES=1 node verifier.js
```

Deux régimes, selon la nature de l'affirmation :

- **numérique** — produit, quotient, fraction étagée : chaque égalité est
  recalculée en rationnels exacts, le résultat est re-dérivé du produit des
  facteurs, et le signe est confronté à la parité du nombre de facteurs
  négatifs ;
- **identité** — développement, factorisation : les deux membres sont évalués
  en **quatre-vingt-dix valeurs tirées au hasard**. Deux polynômes qui
  coïncident en quatre-vingt-dix points sont le même polynôme ; un carré
  oublié ou un signe faussé ne survit pas au premier essai.

```
250 tirages par exercice, 9000 questions,
236310 relations recalculées et 267250 affirmations re-démontrées, 0 erreur.
10/10 falsifications détectées.
```

C'est ce contrôle par échantillonnage qui a débusqué **un bug de l'analyseur
lui-même** : `-x^2` était lu `(-x)^2`, c'est-à-dire `+x^2`. Le moins unaire se
lie moins fort que la puissance ; le lire à l'envers change le signe du terme
dominant — exactement l'erreur qu'un élève commet. Aucune relecture ne
l'aurait vu : il fallait évaluer.

## La suite

Ces devoirs contiennent aussi :

- des expressions à calculer connaissant `a + b` et `ab`, des équations
  produit (`F = 0`), des inverses — le prolongement naturel de ce chapitre ;
- de la **géométrie** : triangles isocèles, milieux, bissectrices, parallèles,
  angles droits. Une chaîne de démonstration y est un enchaînement
  d'implications, pas un calcul : elle ne se valide pas en évaluant des
  nombres, mais en vérifiant que chaque étape cite une propriété du programme
  et que ses hypothèses sont établies par les étapes précédentes. C'est un
  moteur à écrire, et il vaut d'être écrit séparément.

## Fichiers

| Fichier | Rôle |
|---|---|
| `noyau.js` | rationnels exacts, analyseur (puissances, valeurs absolues, juxtaposition), rendu |
| `produits.js` | les gestes : produit, quotient, fraction étagée, développement, factorisation, éléments remarquables, raisonnement sur les signes, valeur absolue |
| `gens.js` | les dix exercices |
| `_build.js` | émet les pages en accordéon et l'index |
| `verifier.js` | validation par exécution + contre-exemples |
