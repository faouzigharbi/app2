# الحساب و القابلية للقسمة — 9 أساسي

Portage de la fiche tasi3a.tn « رياضيات تاسعة أساسي » (9 exercices) en pages
génératives : une page par exercice, tous les nombres retirés à chaque
chargement.

## Les neuf pages

| page | exercice | ce qui varie |
|---|---|---|
| ex01 | شجرة الإختيار — deux chiffres inconnus | motif, position de x, diviseur composé |
| ex02 | بيّن أنّ العدد يقبل القسمة (même base) | somme, différence, base déguisée, répétition |
| ex03 | صواب أو خطأ مع التعليل | 8 affirmations paramétrées, 4 tirées |
| ex04 | grand nombre + division euclidienne d'un produit de puissances | critères, base, exposants |
| ex05 | nombres à chiffres distincts : pairs puis divisibles par 4 | les 4 chiffres de départ |
| ex06 | التعداد — principe multiplicatif | nombre d'objets, nombre de places |
| ex07 | توحيد الأساس ثمّ التفكيك | deux bases déguisées, coefficients |
| ex08 | toutes les valeurs de n pour que E soit divisible | base, diviseur, borne |
| ex09 | M = (an + b)/(n + c) entier | a, c, et le reste dont on cherche les diviseurs |

## L'élève ne calcule pas

C'est le point de la leçon, et les chaînes le respectent : aucune page
n'affiche jamais un nombre de six cents chiffres. Le geste est toujours
« je mets la plus petite puissance en facteur → la parenthèse vaut un petit
nombre → je lis le diviseur ». De même pour les critères : on décompose le
diviseur en deux facteurs **premiers entre eux**, on applique le critère de
chacun, et on croise. On ne divise jamais.

## Le validateur, lui, calcule

C'est sa seule raison d'être. `noyau.js` travaille en BigInt exact, et le
validateur vérifie que `2^2011 - 2^2008 = -7 × 2^2008` est vrai sur les 606
chiffres — pas modulo quelque chose, exactement. Une factorisation dont le
signe a glissé, un cofacteur faux, un diviseur annoncé qui ne divise pas :
rien ne passe.

Pour les affirmations vraies/fausses, le validateur **re-décide lui-même** de
la vérité (PGCD recalculés, primalité testée, restes recalculés, tous les
chiffres essayés) avant de la comparer au verdict qu'annonce la chaîne.

    node verifier.js 120            # 120 tirages par exercice
    CONTRE_EXEMPLES=1 node verifier.js

Le mode `CONTRE_EXEMPLES` abîme volontairement des exercices justes — couple
(x ; y) en trop, verdict retourné, quotient décalé, base mal unifiée, dernier
chiffre modifié… — et échoue si le validateur en laisse passer un seul.

## Bidi

Les listes et les couples s'écrivent avec le point-virgule arabe : `(3 ؛ 2)`.
Ce point-virgule fait partie du RUN isolé en `dir="ltr"`, sans quoi le couple
partirait au régime RTL et s'afficherait `(2 ؛ 3)` — retourné, donc faux. Une
parenthèse ne doit jamais enfermer du texte arabe si elle est encadrée de
mathématiques : elle se retournerait aussi. Ces deux points se vérifient par
la mesure des positions à l'écran, pas à l'œil.

## Impression

Chaque page porte son bouton « ورقة للطباعة » : feuille élève (étapes
mélangées, cases à numéroter), saut de page, feuille parent (étapes dans
l'ordre).

## Régénérer les pages

    node _build.js .
