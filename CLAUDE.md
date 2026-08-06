# devoirati — chaînes de démonstration

Site d'exercices de mathématiques en **arabe**, pour le collège tunisien
(7ème, 8ème, 9ème). Le format phare est la **chaîne de démonstration** : les
étapes d'un raisonnement sont mélangées, l'élève les remet dans l'ordre par
glisser-déposer.

**Avant d'écrire une ligne de code pour un nouveau chapitre, lire
[`chaines/METHODE.md`](chaines/METHODE.md).** Tout y est : l'architecture, le
schéma de données, les règles pédagogiques de l'auteur, la discipline de
vérification, et la liste des pièges déjà rencontrés.

## Les règles pédagogiques de l'auteur — elles priment sur tout

1. **La méthode compte plus que le résultat.** `299 + 277 − 77` doit montrer
   `299 + (277 − 77)`. `(57 + 34) − (47 + 34)` ne se développe jamais : on
   remarque que 34 s'élimine.
2. **Comparer des expressions à inconnues se fait par le SIGNE DE LA
   DIFFÉRENCE**, jamais par les propriétés de l'ordre — celles-ci sont au
   programme de **9ème** seulement, et sont donc autorisées à partir de là.
3. **Respecter le niveau.** Pas de négatifs ni de puissances dans les chapitres
   d'entiers naturels ; la 7ème ne connaît que les rationnels **positifs**
   (« عدد كسري », sans « نسبي ») ; ℝ et l'ordre arrivent en 9ème.
4. **Une page par exercice** (ou par type), toutes les questions visibles en
   même temps dans un accordéon : rater la première n'empêche pas de faire les
   suivantes. Chaque question a son « تحقق » et son « التصحيح ».
5. **Toute page est imprimable** en deux parties : feuille élève (étapes
   mélangées + cases à numéroter), saut de page, feuille parent (étapes dans
   l'ordre). Le parent doit pouvoir corriger sans savoir refaire l'exercice.

## Livraison

Quand un chapitre est prêt : **envoyer le zip SEUL et EN PREMIER**, avant toute
explication. Un fichier enterré sous un long message n'arrive pas.

## Chapitres existants — à copier plutôt qu'à réinventer

| dossier | leçon | niveau | ce qu'il apporte de neuf |
|---|---|---|---|
| `chaines/expr7` | العبارات الحرفية | 7ème | figure SVG (périmètre), rationnels positifs |
| `chaines/sommeq` | الجمع و الطرح في ℚ | 8ème | sous-questions d'un même tirage |
| `chaines/produitq` | الجداء و القسمة في ℚ | 8ème | puissances dans l'analyseur |
| `chaines/factq` | التفكيك في ℚ | 8ème | une page par type, modèles internes |
| `chaines/addz` | الأعداد الصحيحة النسبية | 8ème | équations avec valeur absolue |
| `chaines/gradue` | المستقيم المدرّج | 8ème | SVG relu par le validateur |
| `chaines/arith9` | القسمة و القابلية للقسمة | 9ème | **BigInt** (2²⁰¹¹), vrai/faux, dénombrement |
| `chaines/reel9` | الجمع في ℝ | 9ème | combinaisons linéaires sur {1, x, √2, π…} |
| `chaines/radic9` | العمليات في ℝ (جذور) | 9ème | **moteur exact des radicaux** a√b, rationalisation |

Le plus récent d'un niveau est le meilleur point de départ : `radic9` pour un
moteur numérique, `reel9` pour de l'algèbre symbolique, `expr7` pour une figure.
