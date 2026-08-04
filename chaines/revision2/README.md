# العمليات الأربعة في IR — مراجعة — سلاسل البرهان

Portage en pages « chaîne de démonstration » de la fiche de révision
« العمليات الأربعة في IR » — المدرسة الإعدادية النموذجية ضفاف البحيرة
(فوزي الغربي). La méthode est décrite dans [`../METHODE.md`](../METHODE.md).

Cette fiche n'est pas découpée en exercices numérotés mais en **parties**.
Chaque partie devient une page, et chaque question de la partie un volet.

## Structure

| page | partie | volets | questions |
|---|---|---|---|
| `ex1.html` | الجزء الأوّل | 11 | أ) E, D, C · ب) E×D + déduction · ج) équation · د) M, L, K · ع) T + équation |
| `ex2.html` | الجزء الثاني | 5 | simplification de z et y · 1 · 2 · 3 · 4 |
| `ex3.html` | الجزء الثالث | 7 | 1 · 2 · 3 · 4 · 5)أ · 5)ب · 5)ج |

Le premier volet de la partie 2 n'est pas dans l'énoncé : celui-ci demande
directement « بيّن أنّ y هو مقلوب z », mais on ne peut rien en dire avant
d'avoir réduit `z` et `y`. Cette réduction est donc son propre volet, plutôt
qu'une chaîne de neuf étapes greffée sur la question 1.

## La partie 4 manque

L'écran envoyé s'arrête sur الجزء الرابع : l'incrustation « Résumer ce fichier »
du lecteur PDF et la barre de navigation en masquent les questions. Seule la
première ligne d'expressions est lisible, et pas les consignes. Elle sera
ajoutée dès qu'une capture la montrera.

## Ce qui se tire, et pourquoi

Le fil commun des trois parties est un couple de nombres inverses :
`(j + √u)(√u - j) = 1`, donc `u = j² + 1`. On tire `j`, et `u` suit.

**Partie 1 — libre.** Chaque expression est un schéma. `E` et `D` valent
`j + √u` et `√u - j` quelle que soit l'écriture choisie ; `C` se réduit toujours
à `(p + 2m)√r - q` ; `L` vaut `1/n - e` parce que les quatre radicandes sont
construits pour que leur quotient soit `e²`.

**Partie 2 — deux nombres imposés.** `z = u + √w` avec `w = u² - 1`, ce qui
laisse `u ∈ {2, 4, 6}` (au-delà, `w` a un facteur carré). Surtout, **les entiers
3 et 4 ne peuvent pas bouger** : ce sont les seuls entiers consécutifs qui
encadrent `π`, et tout l'exercice tient à `|4 - π| + |3 - π| = 1`. Ce qui varie
est l'habillage — les écritures en radicaux de `z` et `y`, et les deux
radicandes de la valeur absolue.

**Partie 3 — libre, mais couplée.** `E = (a x - b)(-c x - b)` et
`G = (x + g)(a x - b)` partagent le facteur `(a x - b)`, et c'est lui qui permet
de répondre aux questions 4 et 5)ج sans jamais développer. L'écriture longue de
`E` est reconstruite à partir de `(a, b, c)` : le terme constant impose
`R = b(b+1)`, les autres coefficients suivent.

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

    الجزء الأوّل ✓   الجزء الثاني ✓   الجزء الثالث ✓
    300 tirages par partie, 6900 questions,
    335100 relations recalculées et 69900 contrôles, 0 erreur.
    17/17 falsifications détectées.

## Régénérer les pages

    node _build.js .
