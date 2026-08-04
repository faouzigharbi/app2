# قواسم عدد صحيح طبيعي — 10 séries générées

D'après la fiche « قواسم عدد صحيح طبيعي » (7 أساسي, 2024, فوزي الغربي).
Les nombres changent à chaque tirage ; la chaîne est reconstruite avec eux.

Ouvrir `index.html`. Chaque page tire 3 énoncés ; le bouton « أرقام جديدة »
en refait autant.

| Page | Chaîne | Réponse | Variété |
|---|---|---|---|
| `ex01` | nombre de diviseurs, lu sur les exposants | nombre de diviseurs | 281 |
| `ex02` | les deux ensembles de diviseurs → PGCD | PGCD | 106 |
| `ex03` | A multiple de B, et le quotient euclidien | quotient | 342 |
| `ex04` | N est le cube d'un entier | racine cubique | 28 |
| `ex05` | racine carrée par décomposition | √N | 57 |
| `ex06` | racine carrée d'un **produit** `k × a × c` | √(k·a·c) | 166 |
| `ex07` | PGCD par décomposition | PGCD | 414 |
| `ex08` | PPCM par décomposition | PPCM | 278 |
| `ex09` | problème de partage (bonbons / sucettes) | nombre d'amis | 446 |
| `ex10` | arbres autour d'un jardin, valeurs possibles | nombre d'arbres | 324 |

Le nombre d'énoncés distincts est mesuré par le validateur sur 400 tirages.
`ex04` reste le plus pauvre — un cube grandit vite et au-delà de 66³ les
nombres cessent d'être lisibles pour une 7ᵉ.

## Deux méthodes pour le même PGCD

C'est voulu, et c'est ce que fait la fiche : `ex02` l'obtient en écrivant les
**deux listes de diviseurs** et en cherchant la plus grande valeur commune ;
`ex07` l'obtient par **décomposition**, facteurs communs au plus petit
exposant. L'élève doit savoir passer de l'une à l'autre.

## Ce que les tirages garantissent

**Le PGCD est bien celui annoncé.** Construire `a = d×x` et `b = d×y` ne
suffit pas : si `x` et `y` ont un facteur commun, le vrai PGCD dépasse `d`.
Le tirage n'est retenu que si `pgcd(x, y) = 1`.

**Pas d'étape vide.** Un PGCD réduit à un seul nombre premier donnerait
l'étape « 19 = 19 », qui n'apprend rien. Ces tirages sont rejetés (`ex07`,
`ex09`).

**La réponse du jardin est unique.** `ex10` demande la distance comprise dans
un intervalle : le tirage compte les diviseurs communs qui y tombent et
recommence s'il n'y en a pas exactement un.

**Les listes de diviseurs restent écrivables.** `ex02` rejette les nombres à
plus de 10 diviseurs — sinon la méthode devient impraticable au tableau.

**Un énoncé ne doit pas souffler sa réponse.** Dans `ex06`, un tirage où la
racine cherchée serait égale à `a` ou à `c` est rejeté.

## Vérification

```bash
node verifier.js 400
```

Le validateur tire chaque série des centaines de fois et, sur chaque instance :

1. contrôle chaque égalité écrite — y compris quand plusieurs sont réunies
   dans la même étape et séparées par « و » ;
2. vérifie que la dernière étape annonce le résultat ;
3. exige au moins trois étapes réellement calculables ;
4. **recalcule l'affirmation indépendamment du générateur** : nombre de
   diviseurs (par comptage *et* par la règle des exposants, les deux devant
   concorder), listes de diviseurs, PGCD, PPCM, racines exactes, quotients,
   périmètre et nombre d'arbres ;
5. contrôle qu'aucune étape n'est dupliquée et que chaque expression est
   isolée en `dir="ltr"`.

Dernier passage : **12 000 instances, 67 000 contrôles, 0 erreur**, et les
10 pages ouvertes dans Chromium sans erreur JS.

## Fichiers

```
index.html            sommaire
moteur.js             copiés depuis ../serie1 et ../pgcd à chaque build :
arith.js              une seule implémentation pour toute la bibliothèque
outils.js             compte des diviseurs, racines exactes, tirage de facteurs
gen01.js … gen10.js   un générateur par série
ex01.js … ex10.js     tirage initial
ex01.html … ex10.html
style.css
verifier.js           validation (Node)
_build.js             régénère les pages
```
