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

    node verifier.js 40             # 1 600 questions, 23 240 relations, 0 erreur
    CONTRE_EXEMPLES=1 node verifier.js   # 58/58
    node _build.js .                # régénérer les pages

## Trois coquilles du livre, relevées par le calcul

Le validateur ne lit pas une intention : il recalcule. Trois énoncés de cette
séance ne se referment pas sur eux-mêmes, et **trois falsifications le
prouvent** — chacune remet le nombre du livre et se fait rejeter.

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

Ces trois corrections sont écrites dans `seances.js` et signalées au maître ;
elles ne sont pas glissées en silence.

## Ce que la séance a demandé

Rien de neuf au noyau : `ℚ[√d]` de `revision2` suffisait, y compris pour la
division par conjugué de `(−34 + 13√3)/(4 − 5√3)` et pour les identités en `x`
testées sur trente tirages. Une seule pièce a dû être écrite — `repere.js` —,
et elle sert déjà bien au-delà de cette séance : le livre pose un exercice de
repère par séance. Il ne reste que l'**espace**.
