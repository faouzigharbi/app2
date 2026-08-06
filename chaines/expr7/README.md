# العبارات الحرفية — 7 أساسي

Portage de la fiche « العبارات الحرفية » (كتاب الحساب والجبر, تمارين 6 → 11,
pages 56-63) en pages génératives.

## Structure

Une page par **TYPE**, et à l'intérieur d'un type le générateur tire parmi
plusieurs **MODÈLES**. Les nombres changent à chaque chargement (bouton
« أرقام جديدة »), et le modèle aussi : l'élève rencontre la même méthode sous
tous ses habillages.

| page | type | modèles |
|---|---|---|
| ex01 | الاختصار — حدود من نفس الطبيعة | somme, difference, troisTermes, deuxLettres |
| ex02 | النشر ثمّ الاختصار | uneLettre, deuxLettres, soustraction, constante |
| ex03 | التفكيك — عامل مشترك عددي و حرفي | numerique, litteral, carre, trois |
| ex04 | تمرين كامل — انشر، فكّك، احسب، حلّ | deuxParentheses, parentheseEtTermes |
| ex05 | المعادلات من الدرجة الأولى | 8 modèles, 4 tirés sans répétition |
| ex06 | المحيط بدلالة x — مع الشكل | pentagone, quadrilatere, triangle, rectangle |
| ex07 | عددان طبيعيان تحت شرط | ecart, somme |

## Contrainte de niveau

En 7ème on ne travaille que dans les rationnels **positifs** (« عدد كسري »,
sans « نسبي »). Aucun coefficient, aucun résultat intermédiaire, aucune
solution n'est négatif : les générateurs rejettent tout tirage qui en
produirait, et le validateur relit chaque énoncé et chaque étape pour s'en
assurer (`NEGATIF` dans `verifier.js`).

## Impression

Chaque page porte son bouton « ورقة للطباعة ». La feuille sort en deux
parties séparées par un saut de page :

* **ورقة التلميذ** — les étapes dans le désordre, avec une case à numéroter ;
* **ورقة الوليّ** — les mêmes étapes dans l'ordre.

Le parent peut donc corriger sans savoir refaire l'exercice. La figure du
type 6 est reprise dans les deux parties.

## Vérification

    node verifier.js 150            # 150 tirages par type
    CONTRE_EXEMPLES=1 node verifier.js

Le validateur n'inspecte pas le code : il **exécute** les générateurs, ré-analyse
chaque étape et la recalcule. Une abréviation ou une factorisation est une
identité et doit tenir pour des dizaines de valeurs tirées au hasard ; une
équation ne doit tenir qu'en sa solution — et sa solution doit vraiment en
être une, et être unique.

Le mode `CONTRE_EXEMPLES` abîme volontairement des exercices justes (facteur
littéral `xy` amputé, racine décalée, côté du polygone oublié, couple (a ; b)
invalide…) : si le validateur les acceptait, ce serait lui qui serait faux.

## Régénérer les pages

    node _build.js .
