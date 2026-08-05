# البريفي — مراجعة المناظرة

Portage du **livre de révision** `Revision_9eme_2025_3.pdf` (فوزي الغربي,
جوان 2025), organisé en treize **séances**. La méthode est décrite dans
[`../METHODE.md`](../METHODE.md).

Une page par **exercice**, un volet par **question de l'énoncé** — sans en
retrancher une seule. La clé numérique code la séance et le rang : `21` =
séance 2, exercice 1 ; les séances suivantes s'y glissent sans rien déplacer.

C'est une **partie à part** de la bibliothèque, pas un chapitre de plus : une
seule séance mêle radicaux, factorisation, équations, inéquations et relation
métrique. La ranger sous « العمليات في ℝ » la rendrait introuvable.

## Séance 2 — ce qui est en place

| page | exercice | volets | questions |
|---|---|---|---|
| `ex21.html` | التمرين 1 | 7 | le levier · a · b · c · a et b inverses · 2a×c · le nombre صمّ |
| `ex22.html` | التمرين 2 | 8 | A en √2−1 · A+49/4 · تفكيك A · deux équations · une inéquation · relation métrique · aire |
| `ex23.html` | التمرين 3 | 13 | rectangle · symétrique · isocèle · projection · losange · Thalès · deux milieux · GN · repère (B;E;G) |
| `ex24.html` | التمرين 4 | 12 | C · ABC rectangle · AC, BC, AB · CP · BC/OE · E · milieu · N≡P · aire · K deux fois · AF/AL · trapèze isocèle |

Seul l'exercice 5 manque : c'est de la **géométrie de l'espace** (pyramide
`SABC`), qui n'a aucun chapitre.

## Séance 7 — entière, les quatre exercices

| page | exercice | volets | ce qui s'y joue |
|---|---|---|---|
| `ex71.html` | التمرين 1 | 9 | réduire pour **comparer** : m = 4√6, n = 7√2, les carrés 96 et 98, puis √3 < 1,75 · et le piège du produit de deux facteurs négatifs |
| `ex72.html` | التمرين 2 | 12 | deux cercles emboîtés : diamètre ⇒ angle droit, Pythagore, relation métrique, Thalès, médiane de l'hypoténuse, centre de gravité, rectangle, **orthocentre** |
| `ex73.html` | التمرين 3 | 12 | intervalles et valeur absolue · **F = 2E + 12** · l'aire grise d'un carré découpé |
| `ex74.html` | التمرين 4 | 8 | relation métrique par **deux chemins**, puis un triangle équilatéral et un losange |

Trois choses que ces exercices disent et que l'énoncé tait :

- **ex71** — tout le premier bloc n'existe que pour encadrer √3. On réduit deux
  sommes de radicaux, on les compare *par leurs carrés* (96 et 98), et
  l'inégalité `4√6 < 7√2` devient `√3 < 7/4`. Le second bloc est l'inverse :
  deux facteurs **négatifs**, et multiplier par `(1 − √3)` retourne le sens.
  C'est là qu'un élève perd l'exercice.
- **ex72** — le triangle 6-8-10 est choisi pour que tout tombe juste :
  `SK = 24/5`, `AK = 32/5`, `RI = 3/2`, `KJ = 4`. Seule `BG = 4√13/3` ne se
  devine pas — elle se calcule. L'énoncé n'a **aucun repère** ; le validateur,
  lui, en pose un, et `S` n'y est pas recopié : il est contraint par les deux
  faits qui le définissent, « sur le cercle de diamètre [AB] » et « SB = 6 ».
- **ex73** — tout tient dans une égalité que l'énoncé ne dit jamais :
  **F = 2E + 12**. C'est elle qui fait passer de E à F sans recalculer, elle qui
  donne la factorisation par `2E + 16 = (x+1)²`, et elle encore qui relie l'aire
  grise aux deux expressions : `2S = x² + 2x + 8`, donc `S = E + 23/2` et
  `S = (F + 11)/2`. D'où les deux valeurs demandées — `S = 23/2 ⟺ E = 0 ⟺ x = 3`.

## Séance 9 — lue en entier, trois pages

| page | exercice | volets | ce qui s'y joue |
|---|---|---|---|
| `ex91.html` | التمرين 1 | 9 | `√(u²) = |u|` et `√2 < √3` · encadrements à 10⁻¹ jusqu'au produit `ab` · une inéquation dont le coefficient `a + b = −√3` est **négatif** |
| `ex92.html` | التمرين 2 | 8 | trapèze rectangle · segment des milieux · Thalès · `BD = BC` ⇒ isocèle ⇒ **deux médianes** · centre de gravité · orthocentre |
| — | التمرين 3 | — | **doublon exact de la séance 7, exercice 4** — mêmes données, mêmes questions, numérotation simplement continuée (IV, V, VI). `ex74` le porte déjà ; on ne double pas la page. |
| `ex94.html` | التمرين 4 | 8 | trapèze rectangle où **un seul angle droit se propage** : BIJ, puis BIM, puis l'orthocentre, puis le cercle de diamètre [BM] |

Deux choses que ces exercices cachent :

- **ex92** — `BD = BC` n'est pas un ornement : il fait de `BDC` un **isocèle**,
  donc le pied de la hauteur issue de `B` est le milieu `N` de `[DC]`. Dès lors
  `[DI]` et `[BN]` sont deux **médianes**, leur intersection est le centre de
  gravité, et le `MI/MD = 1/2` de l'énoncé n'est que la propriété des deux
  tiers écrite à l'envers.
- **ex94** — `BI = BJ` n'est **pas une donnée libre** : dès que `I` et `J` sont
  les milieux, les deux longueurs sont égales quelle que soit la hauteur du
  trapèze. Le « = 4 » ne fixe donc qu'une chose, `AN = 4√2`. L'angle droit en
  `B` qui en résulte se propage ensuite dans toute la figure, parce que `J` est
  sur `[BM]` : l'angle `IBM` est le même que l'angle `IBJ`.

## Le repère — `repere.js`

Les exercices 3 et 4 attendaient un fait que le moteur n'avait pas : les
**coordonnées**. `repere.js` le donne, en arithmétique **exacte** sur ℚ[√d] —
la même que les radicaux, donc `GN = 2√5` se démontre au lieu de se constater
à 10⁻⁹ près. Les longueurs y vivent en **carrés** et ne passent sous le radical
qu'au dernier moment, comme dans `thales9`.

Il ne rédige RIEN. La démonstration reste écrite à la main, dans la langue du
maître, et prend la route qu'il veut faire prendre — Thalès, la droite des
milieux, le centre de gravité. `repere.js` sert à la **contredire** : la figure
est construite point par point (`['sym','A','B']`, `['inter','G','E','O','J']`,
`['translate','E','J','A']`), jamais recopiée, et chaque affirmation de
l'énoncé est recalculée dessus — « OABJ est un rectangle », « E est le milieu
de [GM] », « N et P sont confondues », « EFBL est un trapèze isocèle ».

Vingt-quatre falsifications le mettent à l'épreuve, et la plus parlante ne
touche aucune étape : elle **déplace un point**. Si la figure peut bouger sans
que rien ne proteste, alors rien n'était vérifié.

L'exercice 4 n'est d'ailleurs pas un exercice de coordonnées : c'est un
exercice de **Thalès** posé dans un repère. Le diamètre donne l'angle droit,
les parallèles donnent les rapports, et `A` se révèle être le **centre de
gravité** du triangle `EFC` — `CA/CO = 2/3` le dit, et c'est ce qui donne `K`
par une seconde méthode.

## Fidèle à l'original

Les nombres sont ceux du livre, pas un tirage. Le bouton « أرقام جديدة » n'y
rebat que l'ordre des étapes. Ce que le validateur contrôle reste entier :
chaque étape est réanalysée et **recalculée** en arithmétique exacte sur
ℚ[√d], et chaque affirmation de l'énoncé aussi.

    node verifier.js 40             # 4 240 questions, 62 160 relations, 0 erreur
    CONTRE_EXEMPLES=1 node verifier.js   # 166/166
    node _build.js .                # régénérer les pages

## Six coquilles du livre, relevées par le calcul

Le validateur ne lit pas une intention : il recalcule. Six énoncés ne se
referment pas sur eux-mêmes, et **six falsifications le prouvent** — chacune
remet le nombre du livre et se fait rejeter.

1. **التمرين 1، 1)أ** — le livre écrit `(3√3 − 1)(4 − 5√3)`, qui vaut
   `17√3 − 49`. Or la question suivante demande d'en **déduire** `a`, dont le
   numérateur est `−34 + 13√3`. Le seul facteur qui le donne est `(2√3 − 1)` :
   `(2√3 − 1)(4 − 5√3) = 13√3 − 34`. Tout l'exercice le confirme ensuite —
   `a = 2√3 − 3` est bien celui qui vérifie `a × b = 1` et `2a × c = √3`.
   **Le 3 est un 2.**

2. **التمرين 2، I-3)ب** — le livre écrit `A = 4(x + 7)`, ce qui donne
   `x² − 5x − 40 = 0` : un discriminant de 185, hors de portée d'un élève de
   9ᵉ, et surtout étranger à la factorisation `A = (x − 4)(x + 3)` que la
   question précédente vient d'établir. Avec `4(x + 3)`, le facteur commun
   saute aux yeux : `x = −3` ou `x = 8`.

3. **التمرين 2، II** — le livre écrit « `BH = x − 3` et `CH = x − 3` et
   `AH = √7` ». La figure porte `x − 3` d'un côté de `H` et `x + 2` de
   l'autre : le second `x − 3` est une répétition. Reste `AH` : la relation
   métrique donne `AH² = BH × CH`, donc `(x − 3)(x + 2) = AH²`. Pour que
   l'équation soit `x² − x − 12 = 0` — c'est-à-dire `A = 0`, la factorisation
   de la partie I —, il faut `AH² = 6`. Avec `√7` on tombe sur `x² − x − 13 = 0`,
   avec le `5` de la figure sur `x² − x − 31 = 0` : ni l'un ni l'autre ne se
   factorise. **`AH = √6`** donne `x = 4`, `BH = 1`, `CH = 6`, et l'aire `√6/2`.

4. **الحصّة 7، التمرين 3، 5)أ** — le livre écrit « A و M و I على نفس
   الاستقامة ». Ces trois points ne sont **jamais** alignés : `A` et `M` sont
   tous deux sur `[AB]`, `I` est sur `[CD]`. Il s'agit de **A, N, I** — et la
   relation imprimée, `x/(x+1/2) = 2/(x+4)`, est exactement leur condition
   d'alignement. La relation est juste ; c'est la lettre qui a glissé.

5. **الحصّة 7، التمرين 3، 5)ب** — le livre conclut `S = 11/2`. Or `S = 11/2`
   équivaut à `F = 0`, donc à `x = 1`, alors que l'alignement donne
   `x² + 2x = 1`, donc `x = √2 − 1`. Avec cette valeur, `S = 9/2`.
   Contrôle croisé : la question précédente demande `S = 23/2`, ce qui donne
   `x = 3` — et c'est exactement `E = 0`. La formule `S = (x² + 2x + 8)/2` est
   donc bien la bonne, et **`11/2` est un `9/2`**.

6. **الحصّة 9، التمرين 2، 5** — le livre écrit `BM = 16/8`. Or `BN = 8` et `M`
   est le centre de gravité du triangle `BDC`, donc `BM` en vaut les deux
   tiers : **`BM = 16/3`**. Le `8` du dénominateur est un `3`.

Ces six corrections sont écrites dans `seances.js` et signalées au maître ;
elles ne sont pas glissées en silence.

## Ce que les falsifications ont appris

Deux d'entre elles ont d'abord **refusé de mordre**, et le défaut était dans la
visée, pas dans le validateur : l'une déplaçait un point dont la question ne
parlait pas, l'autre changeait le sens d'un vecteur directeur — ce qui donne
la **même** droite parallèle, donc le même point. Elles ont été réarmées sur ce
qui porte vraiment. C'est le principe : une falsification qui passe est un
renseignement, jamais un succès.

## Ce que la séance a demandé

La séance 9 n'a demandé qu'une pièce : la construction `normale` — un second
point de la perpendiculaire à une droite menée par un point qui est **déjà
dessus**, cas où la projection ne dirait rien (le `J` milieu de `[BM]`).

La séance 7 a demandé trois faits de plus à `repere.js` — la **projection
orthogonale** (le pied d'une hauteur), le **centre de gravité** et
l'**orthocentre** — plus `sur-cercle` et `equilateral`. Et elle a montré la
limite honnête du noyau : `s/t` avec `t = √11 − 5 − √33 + 5√3` a **quatre**
termes, et la division par conjugué s'arrête à deux. Le noyau refuse, et il a
raison — l'ordre des trois nombres se lit sur `s < t`, sans jamais poser la
division.

Rien de neuf au noyau : `ℚ[√d]` de `revision2` suffisait, y compris pour la
division par conjugué de `(−34 + 13√3)/(4 − 5√3)` et pour les identités en `x`
testées sur trente tirages. Une seule pièce a dû être écrite — `repere.js` —,
et elle sert déjà bien au-delà de cette séance : le livre pose un exercice de
repère par séance. Il ne reste que l'**espace**.
