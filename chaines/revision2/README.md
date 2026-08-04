# العمليات الأربعة في IR — مراجعة — سلاسل البرهان

Portage en pages « chaîne de démonstration » de la fiche de révision
« العمليات الأربعة في IR » — المدرسة الإعدادية النموذجية ضفاف البحيرة
(فوزي الغربي). La méthode est décrite dans [`../METHODE.md`](../METHODE.md).

Cette fiche n'est pas découpée en exercices numérotés mais en **parties**.
Chaque partie devient une page, et chaque question de la partie un volet.

## Fidèle à l'original

Les autres dossiers tirent leurs nombres à chaque chargement. **Pas celui-ci** :
il reprend ceux de la fiche, à l'identique, parce que c'est la fiche d'un
professeur précis pour ses élèves. Le bouton « أرقام جديدة » y rebat donc
l'ordre des étapes, et rien d'autre.

Ce que le validateur contrôle reste entier : chaque étape est réanalysée et
recalculée en arithmétique exacte, chaque affirmation de l'énoncé vérifiée, et
les identités en `x` testées sur des dizaines de valeurs.

## Structure

| page | partie | volets | questions |
|---|---|---|---|
| `ex1.html` | الجزء الأوّل | 11 | أ) E, D, C · ب) E×D + déduction · ج) équation · د) M, L, K · ع) T + équation |
| `ex2.html` | الجزء الثاني | 5 | réduction de z et y · 1 · 2 · 3 · 4 |
| `ex3.html` | الجزء الثالث | 7 | 1 · 2 · 3 · 4 · 5)أ · 5)ب · 5)ج |
| `ex4.html` | الجزء الرابع | 12 | 1) d, c, b, a · 2 · 3) n, p, w, z, y, x · 4) X |
| `ex5.html` | الجزء الخامس | 3 | A · B · C |
| `ex6.html` | الجزء السادس | 5 | les cinq équations |
| `ex7.html` | الجزء السابع | 9 | 1 · 2 · 3) les quatre cas · 4 · 5) les deux cas |

Le premier volet de la partie 2 n'est pas dans l'énoncé : celui-ci demande
directement « بيّن أنّ y هو مقلوب z », mais on ne peut rien en dire avant
d'avoir réduit `z` et `y`. Cette réduction est donc son propre volet, plutôt
qu'une chaîne de neuf étapes greffée sur la question 1.

## Deux formes à ne pas confondre — partie 7

La fiche oppose délibérément, dans sa dernière question :

    √((x + 5)²) - 1 = -√2x     l'exposant est SOUS le radical  →  |x + 5|
    (√(x + 1))² + 1 = 5        l'exposant est DEHORS           →  x + 1

La première demande une valeur absolue et une discussion de cas ; la seconde
n'est qu'une condition d'existence. Les deux chaînes le disent explicitement.

## Ce que cette fiche a demandé au noyau

Deux capacités, ajoutées pour elle et partagées avec les autres dossiers :

**Les carrés parfaits de ℚ[√d].** Le `n` de la partie 4 vaut
`√((3 + √5)/(3 - √5))`, dont le radicande est irrationnel — mais qui est le
carré de `(3 + √5)/2`. Le noyau les cherche désormais en résolvant
`(r + s√d)² = p + q√d`, et **re-vérifie** l'égalité exactement avant de rendre
la racine.

**La valeur absolue juxtaposée.** `2|√3 - 5|` est un produit — la barre y ouvre
— tandis que dans `|t y|` la barre qui suit `y` ferme. Les deux se distinguent
par un compteur de profondeur, et par lui seul : hors de toute barre `|` ouvre,
à l'intérieur il ferme.

## Le π de la partie 2

`π` n'appartient pas à ℚ[√d] et n'y appartiendra jamais. Ailleurs (fiche
`serie3`), il n'était là que pour s'éliminer, et le noyau pouvait le traiter en
lettre libre. Ici c'est différent : l'exercice utilise **l'encadrement
3 < π < 4**, une propriété numérique. Le validateur lie donc `π` à un rationnel
de cet intervalle. Une valeur suffit, puisque c'est cet encadrement — et lui
seul — que les étapes utilisent.

Le signe et la levée de chaque valeur absolue sont deux étapes **distinctes**,
et toutes deux portent une relation. Rédigées en une seule phrase arabe
(« 4 - π > 0، إذن |4 - π| = 4 - π »), elles échapperaient au validateur, qui
saute les étapes de cadrage : une levée fausse y passerait inaperçue.

## Vérification

    node verifier.js 300
    CONTRE_EXEMPLES=1 node verifier.js

État actuel :

    الأوّل ✓  الثاني ✓  الثالث ✓  الرابع ✓  الخامس ✓  السادس ✓  السابع ✓
    300 tirages par partie, 15600 questions,
    666000 relations recalculées et 127200 contrôles, 0 erreur.
    41/41 falsifications détectées.

## Régénérer les pages

    node _build.js .
