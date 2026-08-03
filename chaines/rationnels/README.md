# مقارنة عددين كسريين نسبيين — 13 séries générées

D'après la fiche « الجمع و الطرح في ℚ — مقارنة عددين كسريين نسبيين »
(8 أساسي, جوهر سويسي, 2018-2019), 17 exercices.

Ouvrir `index.html`. Chaque page tire 3 énoncés ; « أرقام جديدة » en refait autant.

## Les 13 chaînes

**Comparer deux nombres — 6 méthodes**

| Page | Méthode | Exercices de la fiche |
|---|---|---|
| `ex01` | même dénominateur | 7-1, 17-1ب, 17-2 |
| `ex02` | signes opposés | 5-1ج, 17-1ج |
| `ex03` | comparaison à 1 (ou à −1) | 5-1أ, 7-1أ |
| `ex04` | **par la différence** — la méthode centrale | 2, 5-3, 8-2ب, 17-4 |
| `ex05` | produit en croix | 3-1, 3-2 |
| `ex06` | même numérateur | 17-1أ, 17-1د |

**Ordonner — 2**

| `ex07` | ranger une liste par ordre croissant | 3-3, 6-1, 7-2, 9-2, 13-1, 16-1, 17-2 |
| `ex08` | intercaler des rationnels entre deux fractions | 13-2, 13-3 |

**Expressions littérales — 4**

| `ex09` | ajouter le même nombre aux deux membres | 8-1, 11-1, 16-2, 17-3 |
| `ex10` | réduire l'expression puis comparer | 4, 8-2, 12, 15-2, 17-4 |
| `ex11` | déduire d'une hypothèse `x > y` | 9-1, 10, 11, 14 |
| `ex12` | calculer une expression à partir d'une relation | 15-1 |

**Ensembles — 1**

| `ex13` | sélectionner les éléments d'un ensemble par encadrement | 6-2 |

## Les négatifs sont ici la matière, pas un accident

Les chapitres précédents de la bibliothèque interdisaient tout nombre négatif.
**Ce chapitre-ci porte précisément dessus** : ce sont des rationnels *relatifs*.
Le piège que la fiche travaille est exactement celui-là —

```
13/5 > 13/8      mais      −13/5 < −13/8
```

`ex06` le met en scène : même numérateur, et l'ordre s'inverse dès qu'il est
négatif. La règle « aucun signe » ne s'applique donc plus, et c'est voulu.

## Deux régimes de vérification

**Numérique.** Pour les séries 1 à 8 et 13, chaque comparaison et chaque
égalité écrite dans une étape est recalculée en **arithmétique rationnelle
exacte** — pas de flottants, donc pas d'erreur d'arrondi : les fractions sont
gardées sous forme `n/d` réduite et comparées par produit croisé.

**Par échantillonnage.** Pour les séries 9 à 12, une affirmation comme
`a + 1/2 < a + 2/3` n'a aucune valeur à recalculer : elle doit être vraie
**pour tout `a`**. Le validateur la teste donc sur **120 valeurs tirées au
hasard** par instance, en respectant l'hypothèse quand il y en a une (`x > y`
pour `ex11`). Si l'énoncé est faux pour un seul `a`, ça se voit immédiatement.

C'est la seule méthode honnête pour du littéral, et elle est solide : sur
7 800 instances, cela fait plus de 280 000 évaluations.

## Ce que les tirages refusent

- un entier déguisé en fraction là où la mise au même dénominateur perd son
  sens (`ex01`) ;
- un produit en croix sur des nombres qui ne sont pas tous les deux positifs —
  la méthode serait fausse (`ex05`) ;
- une hypothèse `u < v` dans `ex11` : on ne peut alors **rien** conclure, et le
  générateur n'écrit jamais une conclusion non justifiée ;
- un élément posé exactement sur une borne dans `ex13`, où `>` et `≤` seraient
  ambigus à lire ;
- une relation `= 0` dans `ex12`, qui viderait l'exercice.

## Vérification

```bash
node verifier.js 300
```

Sur chaque instance : les comparaisons et égalités, la conformité de la
dernière étape au résultat annoncé, l'absence d'étape dupliquée, l'affirmation
propre à la famille (tri recalculé, encadrement revérifié, valeur de
l'expression retrouvée en tirant `x` et `y` qui satisfont la relation), et une
règle de forme — **une part mathématique ne mêle jamais arabe et symboles**,
ce sur quoi repose tout le rendu.

Dernier passage : **11 700 instances, 373 000 contrôles dont 432 000
évaluations littérales échantillonnées, 0 erreur**, et les 13 pages ouvertes
dans Chromium sans erreur JS ni expression débordant de son cadre.

## Fractions à barre horizontale

Contrairement aux chapitres précédents (écriture en ligne `-13/5`), ce chapitre
affiche les fractions empilées, comme la fiche. Le style est dans `style.css`
(`.frac`, `.expr`). Chaque expression reste **d'un seul bloc** : coupée en fin
de ligne, ses termes seraient réordonnés par l'algorithme bidi de la page RTL.

## Fichiers

```
index.html            sommaire
frac.js               rationnels exacts, analyseur d'expressions, rendu, registre
gen01.js … gen13.js   un générateur par série
ex01.js … ex13.js     tirage initial
ex01.html … ex13.html
style.css
verifier.js           validation (Node)
_build.js             régénère les pages
```

`frac.js` contient un analyseur complet (`+ − × / ( ) [ ]`, variables,
multiplication implicite comme `6x`) : c'est lui qui permet au validateur de
recalculer n'importe quelle étape, littérale comprise.
