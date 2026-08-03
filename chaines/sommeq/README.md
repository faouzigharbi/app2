# الجمع و الطرح في ℚ — تمارين شاملة (8 أساسي)

Chaînes de démonstration bâties sur la fiche *الجمع و الطرح في مجموعة الأعداد
الكسرية — تمارين شاملة* (riadhyet, 2018-2019). Premier exercice porté :
**l'exercice 18**.

## Une page = un exercice entier

C'est la différence avec les chapitres précédents, où une page tirait trois
fois le même type d'exercice. Ici la page déroule **les sept sous-questions de
l'exercice 18**, dans l'ordre de l'énoncé, sur **un tirage commun** — comme
dans la fiche, où 1-a, 1-b et 1-c parlent des mêmes E et F.

| # | Sous-question de la fiche | Ce que l'élève doit reconnaître |
|---|---------------------------|---------------------------------|
| 1 | 1-a) calculer E sachant a + b | lever les parenthèses, regrouper a et b, voir apparaître (a + b) |
| 2 | 1-a) calculer F | ici c'est **−(a + b)** qui apparaît, pas (a + b) |
| 3 | 1-b) E quand a et b sont opposés | « opposés » se traduit b = −a, donc a + b = 0 |
| 4 | 1-c) F quand a = b | a + b = 2a : le résultat reste **en fonction de a** |
| 5 | 2-a) A − (x + B) = C | la parenthèse précédée d'un « − » change les signes |
| 6 | 2-b) A + [(−p) − x] = C | le crochet précédé d'un « + » se lève sans rien changer |
| 7 | 2-c) p + \|x\| + q = C | **une valeur absolue n'est jamais négative** |

## La méthode, pas le résultat

E et F ne se calculent **pas** en cherchant a puis b — l'énoncé ne les donne
pas, et il n'en a pas besoin. On lève les parenthèses, on regroupe les deux
inconnues, la somme (a + b) apparaît, on remplace. C'est pour cela que
« نجمّع المجهولين » est une étape à part entière de la chaîne : c'est *le*
geste de l'exercice.

Pour la même raison, la question 7 tire **une fois sur deux le cas
impossible**. Un élève qui conclut « x = ±k » sans regarder le signe de k
tombe dans le piège de la fiche (12/5 + |x| + 3/4 = 3 n'a pas de solution).
La chaîne impose donc une étape « نقارن بالصفر » avant toute conclusion.

## Générateur

Tous les nombres sont retirés à chaque chargement et à chaque clic sur
« أرقام جديدة » : la somme a + b, les constantes de E et de F, les trois
équations. Les garde-fous du tirage écartent les cas dégénérés (constante
nulle, résultat nul, deux constantes égales, second membre négatif dans
l'équation à valeur absolue — l'impossibilité doit se mériter par le calcul).

## Validation

```
node verifier.js 300        # 300 tirages
CONTRE_EXEMPLES=1 node verifier.js
```

Le validateur n'inspecte pas le code du générateur, il l'exécute et
**re-démontre** chaque affirmation :

1. toute relation écrite dans une étape est recalculée par un analyseur
   d'expressions — pour **quarante couples (a, b)** tirés au hasard parmi ceux
   que l'énoncé autorise, pas pour un seul. Une étape juste par hasard échoue ;
2. la valeur annoncée de E ou de F est recalculée depuis la **définition
   imprimée dans l'énoncé**, jamais depuis les variables internes du
   générateur. C'est ce qui prouve que E ne dépend bien que de a + b ;
3. les équations sont **résolues à nouveau à partir du texte affiché** : on
   évalue « gauche − droite » en 0 et en 1, ce qui donne la fonction affine,
   donc l'unique solution, qui doit coïncider avec celle annoncée ;
4. pour l'équation à valeur absolue, |x| = k est retrouvé depuis l'énoncé et
   la conclusion doit suivre le signe de k — deux solutions opposées si k > 0,
   aucune si k < 0 ;
5. aucune étape dupliquée (deux ordres seraient corrects, l'exercice serait
   injuste) et chaque expression isolée en `dir="ltr"`.

Dernière exécution :

```
300 tirages, 2100 questions, 256474 relations recalculées
et 38100 affirmations re-démontrées, 0 erreur.
5/5 falsifications détectées.
```

## Écriture bidirectionnelle

Le texte arabe court de droite à gauche, les mathématiques de gauche à droite.
Chaque expression est enfermée dans `<span dir="ltr" class="expr">`, insécable,
sans quoi une parenthèse coupée en fin de ligne se retourne. Une ligne qui mêle
les deux — « x = 8/5 أو x = −8/5 » — voit **chaque** morceau mathématique isolé
séparément.

`<` et `>` sont échappés avant la pose du balisage : sans cela « −3/4 < 0 »
ouvre une balise aux yeux du navigateur et la fin de la ligne disparaît.

## Fichiers

| Fichier | Rôle |
|---|---|
| `noyau.js` | rationnels exacts, analyseur (décimaux « 1,5 », valeurs absolues, juxtaposition « 2a »), rendu des fractions, registre |
| `gen18.js` | l'exercice 18 : tirage commun + sept sous-questions |
| `_build.js` | émet `ex18.html`, `ex18.js` et `index.html` |
| `verifier.js` | validation par exécution + mode contre-exemples |
| `ex18.html` | la page (générateur, glisser-déposer) |

Pour ajouter un exercice de la fiche : écrire `genNN.js` sur le modèle de
`gen18.js`, l'ajouter à la liste de `_build.js` et de `verifier.js`, puis
`node _build.js .`
