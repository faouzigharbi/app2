# الجمع في ℝ — 9 أساسي

Portage de la fiche « Addition dans ℝ — bons exercices 2023 » (8 exercices) en
pages génératives : une page par exercice.

## Ce que le chapitre demande

Réduire une expression écrite avec des parenthèses ET des crochets imbriqués,
contenant des lettres réelles et des irrationnels (√2, √3, √5, π), puis s'en
servir : calculer, chercher une lettre sachant que deux réels sont opposés ou
égaux, résoudre une équation avec valeur absolue.

**On ne calcule jamais √2 — on le transporte.** Dans ce chapitre l'irrationnel
se comporte comme une lettre de plus : il s'ajoute à lui-même, il se simplifie
avec son opposé, et il reste tel quel dans le résultat. Aucune page ne demande
d'approcher une racine.

| page | exercice | ce qui varie |
|---|---|---|
| ex01 | une lettre, un irrationnel — 6 questions | l'irrationnel, l'habillage, les nombres |
| ex02 | deux expressions C et D | deux lettres, deux irrationnels |
| ex03 | deux lettres dans la même expression, avec π | les coefficients |
| ex04 | valeur absolue **en tête** de l'expression | le signe à décider avant de l'ôter |
| ex05 | deux expressions E et F liées par une relation | l'habillage des deux |
| ex06 | quatre équations dans ℝ | la lettre, l'irrationnel, l'habillage |
| ex07 | M et N — opposés puis égaux | coefficients croisés (p ; q) et (q ; p) |
| ex08 | la valeur absolue : deux solutions, ou **aucune** | le cas impossible est tiré une fois sur deux |

## L'algèbre : exacte, jamais approchée

Un réel est une **combinaison linéaire à coefficients rationnels** sur la base
{ 1, x, y, a, b, √2, √3, √5, π }. Deux expressions sont égales si et seulement
si tous leurs coefficients coïncident — pas « à 10⁻⁹ près », exactement.

Les flottants ne servent qu'à **une** chose : décider le signe de ce qu'il y a
sous une valeur absolue. Et le générateur refuse tout tirage où ce signe
frôlerait zéro : un `1/6 + √2 − √3 ≈ −0,15` est un piège d'arrondi, pas un
exercice.

## Le générateur part de la réponse

Il choisit d'abord la forme réduite qu'il veut, puis il l'habille : un arbre de
parenthèses et de crochets tiré au hasard, dont une feuille est laissée libre
et ajustée pour retomber sur la cible. Puis **il relit ce qu'il vient
d'écrire** : si le texte affiché ne redonne pas la cible, le tirage est jeté.

## Deux contrôles, pas un

    node verifier.js 40             # les mathématiques sont-elles justes ?
    CONTRE_EXEMPLES=1 node verifier.js
    node audit.js 40                # un professeur écrirait-il cela ?

`verifier.js` recalcule chaque étape et re-démontre chaque conclusion.
`audit.js` juge autre chose : pas de « + −3 », pas de « 1x », pas de groupe qui
vaut zéro, pas de parenthèse enfermant du texte arabe, pas d'indice qui donne
la réponse, une forme réduite qui garde un irrationnel (sinon on a quitté ℝ),
et une chaîne d'une longueur qu'on peut faire glisser à l'écran.

Le rendu bidi se contrôle **par la mesure des positions à l'écran**, pas à
l'œil : chaque fragment isolé doit avoir son premier caractère à gauche.

## Impression

Chaque page porte son bouton « ورقة للطباعة » : feuille élève (étapes
mélangées, cases à numéroter), saut de page, feuille parent (étapes dans
l'ordre).

## Régénérer les pages

    node _build.js .
