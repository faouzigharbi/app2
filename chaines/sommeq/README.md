# الجمع و الطرح في ℚ — تمارين شاملة (8 أساسي)

Chaînes de démonstration bâties sur la fiche *الجمع و الطرح في مجموعة الأعداد
الكسرية — تمارين شاملة* (riadhyet, 2018-2019). **Dix exercices portés** :
4, 5, 6, 7, 8, 10, 14, 15, 16 et 18 — **43 questions par tirage**.

## Une page = un exercice entier, toutes les questions à la fois

Chaque page pose **toutes les sous-questions de l'exercice en même temps**,
chacune dans un volet d'accordéon. Rater la première n'empêche pas de traiter
les suivantes, et chaque volet a ses propres boutons :

| Bouton | Effet |
|---|---|
| ✅ تحقق | contrôle l'ordre de cette question seule |
| 👁 التصحيح | affiche l'ordre attendu, en toutes lettres |
| 💡 مساعدة | l'indice de départ |
| 🔁 إعادة | rebat les étapes de cette question |
| 🎲 أرقام جديدة | retire tout l'exercice (en haut de page) |
| 🗂 اطوِ الكلّ | replie ou déplie tous les volets |

L'en-tête du volet se colore : vert quand la réponse est juste, rouge quand
elle est fausse, orange quand l'élève a demandé le corrigé. Le compteur en
haut de page suit l'avancement, pas une note.

Les sous-questions d'une même page partagent **un tirage commun** — comme dans
la fiche, où 1-a, 1-b et 1-c parlent des mêmes E et F.

## Ce que la fiche demande, exercice par exercice

| Ex. | Forme réduite | Sous-questions |
|-----|----------------|----------------|
| 4  | `A = x + k` | montrer ; calculer pour x donné ; trouver x |
| 5  | `E = a + k`, `F = b + k'` | simplifier les deux ; calculer E ; trouver b |
| 6  | `E = a − b + k` | montrer ; calculer sachant a − b ; **comparer a et b si E = 0** |
| 7  | `F = a − b + k` | montrer ; calculer ; trouver a − b ; **comparer a et b** |
| 8  | `A = y − x + k`, `B = x − y + k'` | montrer les deux ; calculer chacune sous x − y donné ; **les comparer** |
| 10 | `E = a − b + k` | montrer ; calculer pour a, b donnés ; calculer sachant a − b |
| 14 | `A = x + k` | montrer ; calculer si \|x − q\| = r (**deux cas**) ; trouver x |
| 15 | `E = a + b + k`, `F = a + b + k'` | montrer les deux ; **les comparer** ; calculer E ; trouver a + b |
| 16 | `A = y − x + k` | montrer ; trouver y − x ; calculer (deux cas) ; deux équations en x |
| 18 | `E = a + b + k`, `F = −(a + b) + k'` | calculer E et F ; a et b opposés ; a = b ; trois équations |

## Deux règles de méthode, tenues partout

**La méthode prime sur le résultat.** Une expression comme
`E = 3/8 − [−a + 17/9 − 5/4] + (−b + 17/9)` ne se calcule pas en cherchant a
puis b — l'énoncé ne les donne pas. On lève les parenthèses une par une, du
plus interne au plus externe, on regroupe les termes semblables, la forme
`a − b + 13/8` apparaît, et *ensuite* on exploite la donnée. C'est pourquoi
« نجمّع الحدود المتشابهة » et « نُظهر المعطى » sont des étapes à part entière.

**Une comparaison portant sur des inconnues se règle par le signe de la
différence, et par rien d'autre.** Les propriétés de l'ordre — « ajouter le
même nombre aux deux membres conserve l'ordre », « additionner deux inégalités
membre à membre » — sont au programme de 9e année. Le validateur refuse toute
chaîne qui les invoque (voir plus bas).

Troisième garde-fou, plus discret : les équations à valeur absolue tirent
**une fois sur deux le cas impossible**, avec un second membre toujours
positif pour que l'impossibilité se mérite par le calcul. Un élève qui conclut
« x = ±k » sans regarder le signe de k tombe dans le piège de la fiche
(`12/5 + |x| + 3/4 = 3` n'a pas de solution).

## Validation

```
node verifier.js 250        # 250 tirages par exercice
CONTRE_EXEMPLES=1 node verifier.js
```

Le validateur n'inspecte pas le code des générateurs, il les exécute et
**re-démontre** chaque affirmation :

1. toute relation écrite dans une étape est recalculée par l'analyseur — pour
   **trente environnements** tirés au hasard parmi ceux que l'énoncé autorise,
   pas pour un seul. Une étape juste par hasard échoue ;
2. la forme réduite annoncée est confrontée à la **définition imprimée dans
   l'énoncé** : c'est la seule preuve que la levée des parenthèses est juste ;
3. les équations sont **résolues à nouveau à partir du texte affiché** — on
   évalue « gauche − droite » en 0 et en 1, ce qui donne la fonction affine,
   donc l'unique solution ;
4. pour `|x| = k`, la conclusion doit suivre le signe de k — deux solutions
   opposées si k > 0, aucune si k < 0 ;
5. les trois formulations du programme de 9e sont sur liste noire ;
6. aucune étape dupliquée (deux ordres seraient corrects, l'exercice serait
   injuste) et chaque expression isolée en `dir="ltr"`.

Dernière exécution :

```
250 tirages par exercice, 10750 questions,
1008438 relations recalculées et 193500 affirmations re-démontrées, 0 erreur.
7/7 falsifications détectées.
```

Les sept falsifications éprouvées : forme réduite falsifiée, comparaison
inversée, propriété de l'ordre (9e), solution d'équation décalée, conclusion
opposée au signe de |x|, étape dupliquée, parenthèse mal levée.

## Écriture bidirectionnelle

Le texte arabe court de droite à gauche, les mathématiques de gauche à droite.
Chaque expression est enfermée dans `<span dir="ltr" class="expr">`, insécable,
sans quoi une parenthèse coupée en fin de ligne se retourne. Une ligne qui mêle
les deux — « x = 8/5 أو x = −8/5 » — voit **chaque** morceau mathématique isolé
séparément. `<` et `>` sont échappés avant la pose du balisage : sans cela
« −3/4 < 0 » ouvre une balise aux yeux du navigateur et la fin de la ligne
disparaît.

## Fichiers

| Fichier | Rôle |
|---|---|
| `noyau.js` | rationnels exacts, analyseur (décimaux « 1,5 », valeurs absolues, juxtaposition « 2a »), rendu des fractions, registre |
| `formes.js` | les motifs de parenthèses de la fiche, un par exercice, et leur réduction `αu + βv + k` |
| `questions.js` | les sous-questions que la fiche répète : montrer, calculer, chercher, comparer, résoudre |
| `genNN.js` | un exercice = un tirage commun + sa suite de sous-questions |
| `_build.js` | émet les pages en accordéon et l'index |
| `verifier.js` | validation par exécution + mode contre-exemples |

Pour ajouter un exercice : décrire son motif dans `formes.js`, écrire
`genNN.js` en piochant dans `questions.js`, ajouter son numéro à la liste
`EXOS` de `_build.js` et de `verifier.js`, puis `node _build.js .`

Restent à porter : les exercices 11, 12, 13 et 17, qui mêlent valeurs absolues
et comparaisons sous hypothèse.
