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

## Le livre 2026 — et ce que le balayage des radicaux a trouvé

`Revision_9eme_2026.pdf` n'est **pas une réédition** : 38 pages contre 47, huit
séances contre treize, une quarantaine d'exercices contre 76. Les clés du 2026
commencent par `26` (`2611` = 2026, séance 1, exercice 1) ; rien ne bouge des
pages du 2025.

Sa **séance 1 est neuve** et cinq exercices en sont portés (`ex2611`, `ex2612`,
`ex2616`, `ex2617`) plus `ex2621` de la séance 2.

Mais le balayage de **l'arithmétique et des radicaux sur les huit séances** a
donné un résultat net : **les cinq exercices de radicaux repérés hors séance 1
sont tous déjà dans la bibliothèque.** Chaque identification est un
**recalcul**, pas une ressemblance — les nombres coïncident au chiffre près :

| 2026 | vaut | déjà porté par |
|---|---|---|
| séance 3, ex 1 | `a = 2√3−3`, `b = (2√3+3)/3`, `ab = 1`, `2ac = √3` | `ex21` |
| séance 4, ex 3 | `a = 2√6−5`, `b = 3√2−7` (24 < 25, 18 < 49) | `ex33` |
| séance 4, ex 4 | `a = 4−2√5`, `b = 1−√5`, `(a−b)² = ab = 14−6√5` | `ex34` |
| séance 6, ex 1 | `a = 17−12√2 = (3−2√2)²`, inverse de `b²` | `ex51` |
| séance 6, ex 3 | `b = 5√3+√11−5−√33` — le `t` à quatre termes | `ex71` |

**La couche « radicaux » de la nouvelle édition est donc recyclée.** Ce qui est
neuf est ailleurs : l'arithmétique de la séance 1, et la géométrie.

Deux choses relevées au passage :

- **La coquille n° 1 n'a pas été corrigée.** Le livre 2026 imprime encore
  `(3√3−1)(4−5√3)`, qui vaut `17√3−49`, là où la déduction exige
  `(2√3−1)(4−5√3) = 13√3−34`.
- Le 2026 **ajoute des questions** à ses reprises : la séance 6 exercice 1 en
  gagne quatre, dont `(1−a⁻²)/b² + 24√2`, qui vaut exactement **0**.

Et une limite matérielle : **les pages 26 à 38 (séance 8) n'ont aucune couche
de texte** — elles sont scannées, et demandent une lecture visuelle page à page.

## Séance 1 — six exercices sur douze, et l'arbre de choix

La plus longue du livre, et la **dernière ouverte** — parce qu'elle vit
presque entièrement de **dénombrement**, la pièce qui manquait.

| page | exercice | volets | ce qui s'y joue |
|---|---|---|---|
| `ex11.html` | التمرين 1 | 3 | `35a3b` par 12 · `27⁴⁰ + 7×3¹²¹ = 22 × 3¹²⁰` · l'arbre du restaurant : **2 × 4 × 3**, pas 2 + 4 + 3 |
| `ex12.html` | التمرين 2 | 3 | trois dénombrements · le troisième n'a qu'**une** solution, `671` |
| `ex15.html` | التمرين 5 | 2 | les restes modulo 4 : `card A = 4`, **pas 5** — le reste n'atteint jamais le diviseur |
| `ex16.html` | التمرين 6 | 3 | trois familles de chiffres · le produit brut donne 48, le compte vrai **42** |
| `ex17.html` | التمرين 7 | 3 | chiffres consécutifs · `2⁴³ − 5×32⁸ = 3 × 2⁴⁰` |
| `ex110.html` | التمرين 11 | 8 | un rectangle dans un repère — **et la figure que la séance 13 avait perdue** |

**L'exercice 11 est exactement l'exercice 5 de la séance 13**, mot pour mot.
Mais ici il porte **sa figure**, qui manquait là-bas : on y lit `C(0 ; 3√2)`,
`M(3 ; 0)`, `B(6 ; 3√2)`. L'exclusion notée pour la séance 13 tombe donc — et
c'est cette page qui porte l'exercice.

Restent six exercices : le **3**, le **4**, le **8** (un QCM de sept items puis
neuf questions — le plus gros du livre), le **9**, le **10** et le **12** (douze
volets sur `x² = 36 − 16√5`). Tous sont **désormais portables** : `denombrer.js`
et `entiers.js` ont levé les deux blocages.

## L'arbre de choix — `denombrer.js`

C'était le dernier manque nommé de l'inventaire. Une chaîne d'arbre de choix
raisonne par le **produit** : « 2 choix de centaine, puis 3 de dizaine, puis 2
d'unité, donc 12 ». Si le validateur refaisait ce produit, il ne vérifierait
rien — il répéterait l'argument.

Il fait donc autre chose : il **parcourt les mille nombres à trois chiffres** un
par un et compte ceux qui passent. Les deux chemins n'ont rien en commun, et
c'est ce qui donne au contrôle sa valeur.

Les contraintes sont des **données**, jamais du code : un objet que la question
déclare et que le noyau interprète (`chiffres`, `distincts`, `divisiblePar`,
`centaines`/`dizaines`/`unites` — une liste ou une famille nommée —, et des
`relations` nommées comme `dizaine-multiple-unite`). Une contrainte inconnue est
**refusée**, pas ignorée.

L'exercice 6 montre pourquoi ce détour compte : les trois familles se recoupent
(2 et 3 sont à la fois diviseurs de 6 et premiers), six branches de l'arbre
meurent, et le compte vrai est **42** quand le produit brut annonce 48. Une
falsification rejoue le 48.

## Séance 2 — ce qui est en place

| page | exercice | volets | questions |
|---|---|---|---|
| `ex21.html` | التمرين 1 | 7 | le levier · a · b · c · a et b inverses · 2a×c · le nombre صمّ |
| `ex22.html` | التمرين 2 | 8 | A en √2−1 · A+49/4 · تفكيك A · deux équations · une inéquation · relation métrique · aire |
| `ex23.html` | التمرين 3 | 13 | rectangle · symétrique · isocèle · projection · losange · Thalès · deux milieux · GN · repère (B;E;G) |
| `ex24.html` | التمرين 4 | 12 | C · ABC rectangle · AC, BC, AB · CP · BC/OE · E · milieu · N≡P · aire · K deux fois · AF/AL · trapèze isocèle |

L'exercice 5 est un **tétraèdre régulier** (pyramide
`SABC`), qui n'a aucun chapitre.

## Séance 3 — quatre exercices sur sept

| page | exercice | volets | ce qui s'y joue |
|---|---|---|---|
| `ex31.html` | التمرين 1 | 6 | Thalès **quatre fois** sur une seule figure — toutes les parallèles ont la même direction, et les segments qu'elles portent grandissent régulièrement : `RJ = 1`, `AB = 3`, `MP = 5`, `CD = 15` |
| `ex32.html` | التمرين 2 | 6 | un losange dans un repère, **trahi par ses diagonales** : elles se coupent en `K(2 ; 0)`, leur milieu commun, et sont perpendiculaires — aucune longueur de côté n'est nécessaire |
| `ex33.html` | التمرين 3 | 5 | `a` et `b` sont tous deux **négatifs** (24 < 25 et 18 < 49), donc `b < a < 0` donne `b/a > 1` — et non l'inverse |
| `ex34.html` | التمرين 4 | 6 | une identité qui ferme tout : `(a − b)² = ab`, d'où `1/b − 1/a = 1/(a − b)` sans rien calculer |
| `ex36.html` | التمرين 6 | **20** | « نموذجية مدنين » — le plus long exercice du livre, vingt volets sur **une seule figure** |

**L'exercice 6** mérite qu'on s'y arrête. `B(3√2 + 1 ; 0)` n'est pas un nombre
décoratif : il place `D` exactement en `2√2`, donc `E` sur `(AJ)` à la hauteur
`√2 + 1` — et c'est ce qui fait de `BCE` un triangle **à la fois** isocèle et
rectangle. Un autre `B` casserait la moitié de l'exercice, et c'est exactement
ce que la première falsification vérifie. Tout y vit dans ℚ[√2], donc rien
n'est approché : `AB = 3 + 3√2` se divise par 3 sans reste — d'où le `AC = AB/3`
de l'énoncé —, et `1/(√2 + 1) = √2 − 1` rend lisible le changement de repère
final, où huit points doivent être relus dans `(D, B, E)`.

Deux exercices restent : le **5** (sa partie I est de l'arithmétique, sa
partie II demande l'**arbre de choix**, qui n'a aucun chapitre) et le **7**, un
prisme droit — porté sous la clé `ex56`, et sans un seul nombre.

## Séance 4 — cinq exercices sur six

Mon comptage automatique annonçait **deux** exercices pour cette séance. Il y
en a **six** : la couche de texte des pages 15 et 16 est trop abîmée pour
porter les en-têtes, et seule la lecture les a vus. Le total du livre passe
de 72 à **76**.

| page | exercice | volets | ce qui s'y joue |
|---|---|---|---|
| `ex41.html` | التمرين 1 | 6 | la question 5 **refabrique** l'équation : `x/8 = 4/(4+x)` donne `x²+4x−32 = 0` — la figure n'existe que pour `x = 4` |
| `ex42.html` | التمرين 2 | 8 | `H(3+√5 ; 3+√5)` a ses **deux coordonnées égales** — c'est tout ce qu'il faut pour l'angle de 45°. Puis `A` est sommet, centre de gravité **et** milieu |
| `ex43.html` | التمرين 3 | 4 | `a` et `b` sont le **nombre d'or** et son inverse : `ab = 1`, donc `a/b = a²`, et l'identité se déroule sans un calcul de radical |
| `ex44.html` | التمرين 4 | 7 | `a` et `b` sont les deux racines de `u²−3u+1` : somme 3, produit 1. L'énoncé ne le dit pas, mais tout en découle |
| `ex45.html` | التمرين 5 | 7 | un triangle isocèle qui porte un angle de **60°** est équilatéral — c'est de là que part toute la figure |

L'exercice 6 est une **pyramide posée sur un coin** — porté sous `ex46`.

## Séance 5 — sept exercices sur huit

| page | exercice | volets | ce qui s'y joue |
|---|---|---|---|
| `ex51.html` | التمرين 1 | 7 | `a = 17 − 12√2` est **l'inverse de `b²`** — et il vaut à peine 0,03, d'où `1/a` énorme : c'est là que le rangement des inverses se joue |
| `ex52.html` | التمرين 2 | 6 | rectangle où **aucune longueur n'est donnée** : `BI² = IA × IC` avec `IA = 2 IC` donne `IC = 2`, et tout en découle |
| `ex53.html` | التمرين 3 | 8 | **les mêmes deux nombres** que la séance 7 — découpés en huit questions au lieu de quatre, avec une comparaison de plus |
| `ex54.html` | التمرين 4 | 5 | `(2x−1)² = 4(x²−x)+1` : encadrer le **carré** encadre `x²−x` sans jamais multiplier deux encadrements l'un par l'autre |
| `ex55.html` | التمرين 5 | 3 | sur `]0 ; 1[`, `3x−5` et `x−4` sont **tous deux négatifs** : les deux valeurs absolues se lèvent de la même façon |
| `ex57.html` | التمرين 7 | 5 | la partie II **refabrique** l'équation de la partie I : `S₁ = √3 S₂` donne `5+2x = 3x²`, c'est-à-dire `M = 0` |
| `ex58.html` | التمرين 8 | 7 | `x² + (4−x)² = 2(x−2)² + 8` : le minimum 8 est atteint au milieu |

L'exercice 6 est un **prisme droit sans aucun nombre** — porté sous `ex56`.

L'exercice 3 mérite un mot : ce sont **littéralement les mêmes deux nombres**
que la séance 7, exercice 1, partie 2, où ils s'appellent `s` et `t`. On garde
les deux pages, parce que le découpage diffère — quatre questions là-bas, huit
ici — et que **le découpage est la leçon**.

## Séance 6 — quatre exercices portés

Cette séance a deux singularités de numérotation, et je les note plutôt que de
les lisser : l'en-tête **« التمرين رقم 4 » ne porte aucun énoncé** — il est
suivi immédiatement du suivant —, et **deux exercices y portent le numéro 5**
(celui de منزه et celui de l'espace).

| page | exercice | volets | ce qui s'y joue |
|---|---|---|---|
| `ex61.html` | التمرين 1 | 8 | `MK² + 2S = 100` : la diagonale et l'aire **se compensent exactement**, parce que `x² + (10−x)² + 2x(10−x) = (x + 10 − x)²` |
| `ex62.html` | التمرين 2 | 8 | `ab = 25 − 24 = 1` : `F` vaut `√(a²+b²−2ab) = |b−a| = 4√6`, **sans aucune racine à extraire** |
| `ex63.html` | التمرين 3 | 8 | `BM = 6,4` n'est pas choisi : c'est `OB²/AB = 64/10`, la valeur qui fait de `M` le **pied de la hauteur** issue de `O` |
| `ex65.html` | التمرين 5 (منزه) | 7 | la construction classique du **nombre d'or** : dans le carré de côté 1, `CE = a`, `CF = b`, et `BC² = CF × CE` dit que `ab = 1` |

Le dernier exercice est un **parallélépipède** — porté sous `ex66`.

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

## Séance 8 — trois exercices portés

| page | exercice | volets | ce qui s'y joue |
|---|---|---|---|
| `ex81.html` | التمرين 1 | 8 | le `5/4` est exactement ce qu'il faut pour qu'**un 1 de plus ferme le carré** ; puis deux carrés positifs démontrent `m ≥ n ≥ h` et `n² = m h` |
| — | التمرين 2 | — | **doublon des exercices 4 et 5 de la séance 5**, fusionnés — mêmes intervalles, mêmes expressions, jusqu'à la numérotation cassée (4, 5, 6 puis 4, 3, 4). `ex54` et `ex55` les portent déjà. |
| `ex83.html` | التمرين 3 | 9 | `C` est le milieu de `[OA]`, donc `[BC]` est une **médiane** de `OAB` — et `BI = 2BC/3` fait de `I` son centre de gravité. Tout s'enchaîne de là, jusqu'à quatre points concycliques |
| `ex85.html` | التمرين 5 | 6 | le numérateur de `b` ne se réduit pas, il se **factorise** : `3(1−√3) + √6 − 3√2 = (1−√3)(3+√6)`, et le dénominateur s'en va |

L'exercice 4 est une **pyramide penchée** — portée sous `ex84`.

L'exercice 1 a demandé une pièce au validateur : `c.positifs`, un tirage
**strictement positif** pour les lettres qui passent sous un radical. Sans lui,
l'identité `(1/√a − 1/√b)² = 1/a + 1/b − 2/√(ab)` n'aurait pas pu être testée —
le tirage aurait rendu un négatif une fois sur deux, et la vérification se
serait arrêtée sur une exception au lieu de dire quelque chose.

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

## Séance 10 — quatre exercices neufs, deux reprises

Le comptage automatique disait 2 ; la lecture en a trouvé **six**, comme pour
la séance 4 — la couche de texte des pages intérieures ne porte pas les
en-têtes. Et deux de ces six sont des **reprises mot pour mot**.

| page | exercice | volets | ce qui s'y joue |
|---|---|---|---|
| `ex101.html` | التمرين 1 | 8 | deux nombres **microscopiques** · comparer par les carrés · signe d'un produit · multiplier une inégalité par `ab` · ordonner `√(a/b)`, `1`, `√(b/a)` · `a+b = 4−2√3 = (√3−1)²` · inverser deux fractions |
| — | التمرين 2 | — | **doublon exact de la séance 3, exercice 1** — mêmes données (`AB = 3`, `AC = 5`, `BC = 6`, `BM = 1`) et jusqu'à la même numérotation cassée 2, 3, 4, 5. `ex31` le porte déjà. |
| `ex103.html` | التمرين 3 | 8 | `E = x² + √6x − 3` · forme canonique · différence de deux carrés · relation métrique `AH×BC = AB×AC` · Thalès entre deux hauteurs · et `BK = √3` qui **redonne** `E = 0` |
| `ex104.html` | التمرين 4 | 6 | `A = x² − (10/3)x + 1` · hauteur d'un équilatéral lue à l'envers · le symétrique qui fait un cercle de diamètre · Pythagore qui **redonne** `9A = 0` |
| `ex105.html` | التمرين 5 | 9 | le nombre d'or · `(√5−1)² = 6−2√5` sous le radical · `ab = 1` et `a+b = √5` · `a²` et `1−√5a` opposés · Thalès qui **redonne** `p² − √5p + 1 = 0` |
| — | التمرين 6 | — | **doublon exact de la séance 9, exercice 4** — mêmes données (`MN = 6√2`, `AB = 2√2`, `BI = BJ = 4`), et l'énoncé renvoie lui-même « الشكل المرافق (الصفحة 3) ». `ex94` le porte déjà. |

Trois choses que ces exercices cachent :

- **ex101** — `a ≈ 0,072` et `b ≈ 0,464`. La calculette ne les sépare pas de
  zéro, et c'est le sujet : tout se démontre par les **carrés**. `48 < 49`
  donne `a > 0`, `100 < 108` donne `a < b`, `972 < 1024` ordonne les deux
  dénominateurs de la question 7.
- **ex104** — `C` symétrique de `B` par rapport à `D` fait de `D` le centre du
  cercle circonscrit à `ABD` **et** le milieu de `[BC]` : `A` voit `[BC]` sous
  un angle droit sans qu'on ait rien à démontrer d'autre. Et la question ج) est
  celle qui referme tout : Pythagore avec `AC = √3(x+1)` donne `9x² − 30x + 9 = 0`,
  c'est-à-dire `9A = 0`, et la factorisation de la question 2 livre `x = 3`.
- **ex105** — la figure **ne proteste pas** si l'on prend `p = a`. C'est normal :
  `a` est l'autre racine de `p² − √5p + 1 = 0`, donc Thalès tient encore. Seule
  la condition `p > 1` tranche. Une falsification le vérifie explicitement.

Et une curiosité que la machine a trouvée seule : dans **ex103**, à la racine
`x = (3√2−√6)/2`, on a `MK = AM = x`. Le point mobile est exactement à la
distance de `(BC)` qu'il est de `A`.

## Séance 11 — la première séance ENTIÈRE du livre

## Le livre 2026 — le balayage est terminé

Les huit séances ont été lues. Le résultat tient en une phrase : **la géométrie
du 2026 est entièrement recyclée**, et ce qui est neuf tient dans sa séance 1.

| séance 2026 | ce qu'elle est |
|---|---|
| 6 | **la séance 5 du 2025, exercice pour exercice** — huit sur huit (`ex51`, `ex52`, `ex71`, `ex54`, `ex55`, `ex56`, `ex57`, `ex58`) |
| 7 | **la séance 12 du 2025** (`ex121`, `ex122`, `ex123`) plus le `ex45` |
| 8 | un **recueil** : six reprises à couche de texte (`ex124`, `ex125`, `ex62`, `ex65`, `ex126`, `ex66`), puis treize pages **scannées** |

Le QCM sans bonne réponse de `ex121` y est reconduit tel quel, et la coquille
`AB = 3√2` de la pyramide aussi : **cinq** coquilles du 2025 reparaissent
intactes dans la nouvelle édition.

Six exercices, six portés. Ni doublon, ni exercice d'espace, ni statistiques —
c'est la première fois.

| page | exercice | volets | ce qui s'y joue |
|---|---|---|---|
| `ex111.html` | التمرين 1 | 3 | `3a4b` par 15, `36a8b` par 12, `3a5b` par 6 · casser le diviseur en deux critères indépendants · **trente-trois divisions posées**, pas une annoncée |
| `ex112.html` | التمرين 2 | 7 | sept nombres de **deux mille chiffres** · un seul geste : unifier la base, sortir la plus petite puissance · et la 13ᵉ coquille |
| `ex113.html` | التمرين 3 | 11 | `a = x² − 8x + 11` · forme canonique · Pythagore réciproque · Thalès · une **aire** qui redonne l'équation |
| `ex114.html` | التمرين 4 | 6 | `A = (x+3)(3x−1)` et `B = (2x+1)(x+3)` · le facteur commun rend `A − B` sans rien développer |
| `ex115.html` | التمرين 5 | 5 | `A = (2x+7)(2x−1)` · un rectangle, une diagonale qui sort du cadre · l'aire de `DCG` redonne `A = 0` |
| `ex116.html` | التمرين 6 | 10 | un diamètre, et **tout** en découle : `OBC` équilatéral, `AH = 6`, `AC = 4√3`, `ABE` équilatéral, `F` sur le cercle |

Trois choses que ces exercices cachent :

- **ex111** — trente-trois solutions en tout, et chacune est **divisée**. Écrire
  « `a ∈ {2;5;8}` » sans poser les trois divisions, ce serait demander à
  l'élève de croire un résultat au lieu de le vérifier.
- **ex113** — l'énoncé imprime `AC = 25`. Avec `AB = 4` et `BC = 6` cela ne fait
  même pas un triangle. C'est `2√5`, dont le radical n'a pas survécu à la mise
  en page : `4² + (2√5)² = 16 + 20 = 36 = 6²`, et le triangle est rectangle en
  `A` — ce que la question suivante demande justement de montrer.
- **ex116** — `BC = 4` sur un cercle de **rayon** 4 : `OB`, `OC` et `BC` sont
  égaux, donc `OBC` est équilatéral. Tout le reste n'est que la lecture de
  cette figure — `H` est le milieu de `[OB]` donc `AH = 6`, `CH = 2√3` est la
  hauteur de l'équilatéral, et `E`, symétrique de `B` par rapport à `C`, fait
  de `ABE` un équilatéral de côté 8 dont le milieu de `[AE]` retombe sur le
  cercle.

## Les grands entiers — `entiers.js`

L'exercice 2 de la séance 11 affirme sept fois qu'un nombre est divisible par
3, par 21, par 42. Ces nombres ont **deux mille chiffres** : `243^1001` ne
tient pas dans un flottant, `3^40` y est déjà faux d'une centaine d'unités, et
une vérification qui déborde répond « vrai » sans avoir rien calculé. C'est
exactement ce que cette machine refuse.

`entiers.js` est donc un évaluateur minuscule, en **BigInt** : des entiers,
`+`, `−`, `×`, `^` et des parenthèses. Rien d'autre — pas de fraction, pas de
radical ; dès qu'une division apparaîtrait, elle ne serait plus entière, et le
module refuse au lieu d'arrondir.

Le validateur l'active par le drapeau `grands` : toute la chaîne bascule alors
sur l'arithmétique entière, et deux contrôles neufs s'y ajoutent — `entiers`
(une égalité exacte) et `divisibles` (un reste nul, pas un reste approché).

C'est ce qui a permis de trouver la treizième coquille. Et c'est la
falsification qui ouvre la séance : rejouer le `3^204` imprimé, et vérifier que
`42` **ne** divise **pas**.

## Séance 12 — six exercices, et un QCM sans bonne réponse

Elle ne porte **aucune statistique**, contrairement à ce que l'estimation
annonçait. Elle est portée **entière**, exercice 6 compris : c'est la première
**pyramide** de la bibliothèque, et elle n'a pu entrer que le jour où
[`espace.js`](#lespace--espacejs) a donné au vérificateur des coordonnées en
trois dimensions.

| page | exercice | volets | ce qui s'y joue |
|---|---|---|---|
| `ex121.html` | التمرين 1 | 3 | QCM · comparer par les carrés · le **mode** d'une série · la diagonale de face d'un cube |
| `ex122.html` | التمرين 2 | 11 | `M = a²+2a−2` · un repère où `BED` rectangle en `E` **redonne** `M = 0` |
| `ex123.html` | التمرين 3 | 7 | `a = √7+1` et `b = √7−1` sont **les deux côtés du triangle** : `BC² = 16` sans un radical |
| `ex124.html` | التمرين 4 | 7 | un isocèle qu'une symétrie redresse en 6-8-10 · deux médianes · un losange · une aire |
| `ex125.html` | التمرين 5 | 9 | un équilatéral et son symétrique · centre de gravité · rectangle · losange |

Deux choses que ces exercices cachent :

- **ex124** — `C` symétrique de `A` par rapport à `O` fait de `O` à la fois le
  milieu de `[AC]` **et** le centre du cercle circonscrit (`OA = OB = OC = 5`) :
  `ABC` devient le triangle 6-8-10 sans qu'on ait rien à démontrer d'autre. Et
  `(CI)` et `(BO)` deviennent alors deux **médianes**, d'où tout le reste.
- **ex123** — les deux nombres de la partie I ne sont pas décoratifs : ce sont
  **exactement** les deux côtés du triangle de la partie II. `(√7+1)² + (√7−1)²`
  vaut 16 parce que les `2√7` se compensent, et `AH = (√7+1)(√7−1)/4 = 3/2`.

## Séance 13 — quatre exercices sur six

| page | exercice | volets | ce qui s'y joue |
|---|---|---|---|
| `ex131.html` | التمرين 1 | 8 | un repère · `(IJ) : x + y = 1` · un parallélogramme · une projection selon une direction · deux aires égales |
| `ex132.html` | التمرين 2 | 6 | le nombre d'or · un encadrement qui **lève deux valeurs absolues d'un coup** · `b² − 3√5/2 = 7/2` est rationnel |
| `ex133.html` | التمرين 3 | 7 | un équilatéral **caché dans un demi-triangle** · losange · orthocentre · cercle de diamètre |
| `ex136.html` | التمرين 6 | 6 | **le seul exercice de statistiques du livre** |

**Deux exercices ne sont pas portés, et les raisons sont nommées :**

- **l'exercice 4** est une pyramide régulière — portée sous `ex134` ;
- **l'exercice 5** renvoie à « الرسم المصاحب » pour lire les coordonnées de `C`,
  `B` et `M`, et ce dessin est absent **de cette page**. ~~À redemander au
  maître.~~ **EXCLUSION LEVÉE** : c'est le même exercice que le **11 de la
  séance 1**, mot pour mot, et celui-là porte sa figure. `ex110` le porte.

**La partie II de l'exercice 2 ne se referme pas non plus.** Avec les données
imprimées — `AB = 1`, `AC = 1/2`, l'angle droit en `C`, `BD = 3/2` — on obtient
`BC = √(1 − 1/4) = √3/2`, puis `DC = 3/2 − √3/2 = (3−√3)/2`. Or l'énoncé demande
`DC = a`, qui vaut `(3−√5)/2`. Il faudrait `BC = √5/2`, ce qui rendrait
`AC² = 1 − 5/4` **négatif**. La partie I (six volets) est portée ; la partie II
attend l'arbitrage du maître.

Deux choses que ces exercices cachent :

- **ex131** — le `xA < 0` de l'énoncé n'est pas décoratif : sur `(IJ)`, **deux**
  points sont à la distance 4 de `E(0 ; 5)`, et le second est `J` lui-même. La
  condition est ce qui les départage. (Deux remarques pour le maître : l'énoncé
  fait couper « `(AB)` et `(IJ)` » en `A`, alors que `A` est justement ce qu'on
  cherche — la droite est `(BE)`, celle du 1)أ, et tout se referme avec elle ;
  et le point `D(2 ; 3)`, donné en tête, n'est utilisé par **aucune** question.)
- **ex133** — `CDH` est **équilatéral** de côté `6√3`. `B` en est donc à la fois
  le centre de gravité, l'orthocentre *et* le centre du cercle circonscrit —
  c'est pourquoi la question 3)ج tombe sans calcul.

### L'exercice de statistiques

`ex136.html` — six volets. C'est **le seul exercice de statistiques du livre**,
et c'est pour lui que [`../stat9`](../stat9) a été ouvert ; son noyau
(`stat.js`) est copié ici comme `repere.js` l'a été pour la géométrie.

Deux effectifs y sont inconnus, et le tableau ne donne qu'une prise : « 30 % »
sur la ligne des fréquences cumulées croissantes. Elle porte sur la **première**
classe — c'est la seule lecture qui referme l'énoncé, puisqu'elle donne `b = 15`
puis `a = 20`, les deux valeurs que la question 3 annonce. (Lue sur la deuxième
classe elle donnerait `b = 7` et `a = 28`, que l'énoncé contredit. Une
falsification rejoue cette lecture-là.)

Et la médiane tombe juste : cumuls 15, 23, 43, 50, moitié 25, donc la lecture
sur le polygone donne **exactement 62**. Rien à interpoler — c'est tout ce que
le programme de 9ᵉ demande ici.

## L'espace — `espace.js`

Pendant tout le dépouillement des deux livres, une dizaine d'exercices ont été
écartés sous le même motif : « la géométrie de l'espace n'a aucun chapitre ».
Le motif était honnête, mais il ne portait pas sur les mathématiques — il
portait sur la **machine**. `repere.js` ne connaît que des couples `(x ; y)` ;
un sommet de pyramide n'y entre pas. Et la règle du projet est de ne jamais
porter ce qu'on ne sait pas **recalculer**.

`espace.js` supprime le motif. Un point est un **triplet** de nombres de ℚ[√d],
et tout le reste suit :

- le **produit scalaire** donne l'orthogonalité de deux droites ;
- le **produit vectoriel** donne l'alignement, et la direction normale d'un
  plan ;
- le **déterminant** des trois vecteurs donne la coplanarité — donc
  « ces quatre points sont dans un même plan » se recalcule ;
- le **volume** d'un tétraèdre est le sixième de ce déterminant, donc exact,
  sans passer par une hauteur qui ne tomberait pas toujours dans ℚ[√d].

Les faits contrôlés sont ceux que l'énoncé prononce, et la liste est **fermée**
comme celle du plan : `perpendiculaire-plan` (« (AC) ⊥ (SBD) » — le fait
central de tous ces exercices), `parallele-plan`, `dans-plan`, `hors-plan`,
`coplanaires`, `pyramide-reguliere` (le sommet se projette **exactement** sur
le centre de la base, et les sommets de la base sont **équidistants** de ce
centre), `projete-droite`, `projete-plan`, `volume`, `aire`, plus toutes les
règles du plan qui gardent un sens en dimension 3.

Il ne rédige RIEN, et c'est encore plus vrai qu'en dimension 2 : **l'élève de
neuvième ne pose pas de coordonnées dans l'espace**. Il applique « une droite
perpendiculaire à un plan est perpendiculaire à toute droite de ce plan », puis
Pythagore dans un triangle qu'il a su placer. Les coordonnées ne servent qu'à
**contredire**.

Et elles ont contredit dès le premier exercice — la **dix-neuvième coquille**
du livre : la séance 12 donne `AB = 3√2`, et rien ne se referme dessus (on
trouverait `SA = 3√2` là où le د\ demande 6). Avec `AB = 6`, tout tombe juste
et **rien d'autre ne change** : `OA = 3√2`, `SO = OA`, `SA = 6`, `OK = 3`,
`CK = 3√3`. Le `3√2` du brouillon est celui de `OA`, il a glissé d'une ligne.

### Les huit solides

`espace.js` a ouvert d'un coup une famille entière, écartée depuis le début :

| page | exercice | ce qui s'y joue |
|---|---|---|
| `ex25.html` | 2025 · séance 2, ex 5 | **tétraèdre régulier** d'arête 4√3 · `OA = 4`, `SO = 4√2` · `AOSE` parallélogramme donc `(ES)//(ABC)` · `M` centre de gravité de `EBC`, `BF = 2√5` |
| `ex46.html` | 2025 · séance 4, ex 6 | pyramide **posée sur un coin** — le « منتظم » de l'énoncé est un lapsus · `SBD` équilatéral · `BK = 4√6/3` · `M`, milieu de `[SC]`, engendre la vraie pyramide régulière, volume `32/3` |
| `ex56.html` | 2025 · séance 5, ex 6 | prisme droit **sans un seul nombre** — les chaînes n'écrivent que des égalités entre longueurs · `C` milieu de `[MD]` · `MBH` et `MDH` partagent l'hypoténuse, donc `NB = ND` |
| `ex66.html` | 2025 · séance 6, ex 5 (bis) | parallélépipède · `ENH` isocèle ⇒ `N` milieu de `[FG]` ⇒ `ENH` **équilatéral** · la médiane `[EH]` vaut `MN/2`, donc angle droit en `E` · `KN = 4` |
| `ex84.html` | 2025 · séance 8, ex 4 | pyramide **penchée** — le 3-4-5 dressé dans l'espace · la verticale de `G` tombe sur `(SI)` · `JG = 4/3`, et `JABC` est régulier, volume `4√3/3` |
| `ex126.html` | 2025 · séance 12, ex 6 | pyramide régulière · `(AC) ⊥ (SBD)` · `OK = 3`, `CK = 3√3` — **coquille n° 19** sur `AB` |
| `ex134.html` | 2025 · séance 13, ex 4 | pyramide régulière · les deux relations métriques · `(OJ)` perpendiculaire par un **centre de gravité** déguisé |

Deux exercices restent dehors, et pour une raison qui n'est plus la machine :
la séance 3 exercice 7 du 2025 — reprise à l'identique en 2026, séance 4
exercice 7 — a **deux questions qui ne se referment pas**. Les données `EF = 4`,
`HG = 2` et `IE = 3` forcent `EG = 9/2` ; avec `EH = 3√5/2` le trapèze est
entièrement déterminé, et alors la question 3 est **vide** (`J` tombe sur `(BD)`,
donc `(DJ) = (DB)` rencontre `(BC)` en `B` et `BL = 0`) tandis que la question
5أ est **fausse** (« `AIH` rectangle en `I` » équivaut exactement à
`(EG) ⊥ (HF)`, et le produit scalaire des diagonales vaut `−3/4`). Il s'en faut
de peu : avec `EH = √43/2` les diagonales seraient perpendiculaires. C'est la
donnée `EH` qui est en cause, et c'est au maître de trancher.

Dix-huit falsifications le mettent à l'épreuve — et **la plus instructive a
refusé de mordre**. En allongeant `[OB]`, la base cesse d'être un carré et la
pyramide cesse d'être régulière ; le contrôle **passe**. La raison est que la
question « (AC) ⊥ (SBD) » ne se sert ni du carré ni de la régularité : elle se
sert de `(AC) ⊥ (BD)` et de `(AC) ⊥ (SO)`, et un cerf-volant les garde tous les
deux. La bonne falsification n'était pas d'abîmer le carré, c'était de **sortir
B de l'axe**.

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

    node verifier.js 120            # 52 200 questions, 915 960 relations, 0 erreur
    CONTRE_EXEMPLES=1 node verifier.js   # 677/677
    node _build.js .                # régénérer les pages

## Dix-huit coquilles du livre, relevées par le calcul

Le validateur ne lit pas une intention : il recalcule. Dix-huit énoncés ne se
referment pas sur eux-mêmes.

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

7. **الحصّة 5، التمرين 8، 3** — « جد x لكي يصبح الرباعي HCEA معيّنا ». Le
   quadrilatère `HCEA` n'est un losange pour **aucune** valeur de `x` :
   `HC = CE` donne `x = 8/3`, et à cette valeur `AH = 8√2/3` alors que
   `HC = 4√5/3`. Ce que `x = 8/3` donne, c'est `AH = EA` **et** `HC = CE` —
   un **cerf-volant** d'axe `(CA)`, dont les diagonales sont perpendiculaires.
   (À `x = 2` on obtient l'autre cerf-volant, d'axe `(HE)`.) La page conclut
   ainsi, et laisse le maître arbitrer.

8. **الحصّة 4، التمرين 4، 5** — « بيّن أن DC = a », avec `a = (3−√5)/2`. Avec
   `AB = 1`, `AC = 1/2` et l'angle droit en `C`, on obtient `BC = √3/2` puis
   `DC = (3−√3)/2` — un `√3` et non un `√5`. Pour que `DC` vaille `a` il
   faudrait `BC = √5/2`, ce qui rendrait `AC² = 1 − 5/4` négatif. **La question
   5 n'est donc pas portée** ; les quatre premières le sont.

9. **الحصّة 6، التمرين 2، 6)ت** — « `√((1−d²)/d) + m` ». Sous le radical,
   `(1−d²)/d` vaut `3√5/2 − 5`, un nombre **négatif** : la racine n'existe pas.
   Avec `c` à la place de `d`, la même expression vaut exactement **4**, et la
   racine vaut 2. C'est un `c`.

10. **الحصّة 6، التمرين 5 (منزه)، 1** — `b = 1/5 − (6 − (1+√5)²)/4` donne
    `1/5 + √5/2`, et non `(√5+1)/2` comme l'énoncé le demande lui-même. Avec
    `1/2` à la place de `1/5`, on tombe juste. **Le 5 est un 2.**

11. **الحصّة 10، التمرين 1** — `b = 1/(2 − √3) − 3/(2 + √3) + 1` vaut
    `4√3 − 3 ≈ 3,93`. Or la question 3 du **même énoncé** demande de montrer
    que `b < 1`, et la question 1 annonce `b = 2√3 − 3`. L'énoncé se contredit
    lui-même. Avec `1/(2 + √3)` on retrouve exactement `2√3 − 3`, et les huit
    questions s'enchaînent. **Le − est un +.** C'est la falsification qui ouvre
    la séance : elle rejoue le dénominateur imprimé, et le validateur le rejette.

12. **الحصّة 10، التمرين 3، 2)ب** — « `CM/CA = MK/MH` ». `MH` n'existe pas dans
    la figure : c'est **`AH`**. Le rapport de Thalès compare les deux hauteurs,
    celle du petit triangle `CMK` et celle du grand `CAH`.

13. **الحصّة 11، التمرين 2، 6** — « `9^100 + 3^204` divisible par 42 ». Ce
    nombre vaut `82 × 3^200`, et `82 = 2 × 41` ne contient **pas** de 7 : 42 ne
    divise pas. Avec `3^203` on obtient `28 × 3^200 = 4 × 7 × 3^200`, et 42
    divise. **Le 4 est un 3.** C'est la seule des sept affirmations de
    l'exercice qui ne se referme pas — les six autres sont exactes, vérifiées
    en BigInt.

14. **الحصّة 11، التمرين 3، II** — « `AC = 25` » avec `AB = 4` et `BC = 6`. Ces
    trois longueurs ne font même pas un triangle. C'est `2√5`, dont le radical
    n'a pas survécu à la mise en page : `16 + 20 = 36`, et le triangle est
    rectangle en `A`.

15. **الحصّة 11، التمرين 3، II 4)أ** — « `S_AMN = 5√5` ». La question 2)ت vient
    de faire montrer que l'aire ne dépasse pas `4√5 ≈ 8,94` ; or `5√5 ≈ 11,18`.
    Avec `5√5/4`, la condition donne exactement `(4 − x)² = 5`, c'est-à-dire
    `x² − 8x + 11 = 0` — l'équation de la partie I —, puis `x = 4 − √5` et
    `AN = 5/2`. **Le `/4` est tombé.**

16. **الحصّة 12، التمرين 1، 2** — d'un genre nouveau : un QCM dont **aucune
    option n'est correcte**. De `a − 2√2 = b + 2√3 = c + 3` on tire
    `a = b + 2√3 + 2√2` et `c = b + 2√3 − 3` ; comme `2√3 > 3` on a `c > b`, et
    comme `2√2 + 3 > 0` on a `a > c`. L'ordre est donc **`b < c < a`**, qui
    n'est proposé nulle part. La question est posée sans choix multiple.

17. **الحصّة 12، التمرين 2، 2)أ** — « استنتج أن `CE = 2a+4` ». Avec `C(0 ; 3)`
    et `E(2a+2 ; 3)`, `CE = 2a+2`. Les deux questions suivantes le confirment
    sans appel : `BE² = 4a²+8a+40` et `DE² = 4a²+8a+8` ne sortent que d'une
    abscisse égale à `2a+2`. **Le 4 est un 2.**

18. **الحصّة 12، التمرين 3، I 1** — « بيّن أن `a = √7−1` و `a = √7+1` » : le
    même nom deux fois. Le premier est `b`, et c'est ce que la question 2
    (`a` inverse de `b/6`) exige.

Ces dix-huit corrections sont écrites dans `seances.js` et signalées au maître ;
elles ne sont pas glissées en silence.

## Ce que les falsifications ont appris

Deux d'entre elles ont d'abord **refusé de mordre**, et le défaut était dans la
visée, pas dans le validateur : l'une déplaçait un point dont la question ne
parlait pas, l'autre changeait le sens d'un vecteur directeur — ce qui donne
la **même** droite parallèle, donc le même point. Elles ont été réarmées sur ce
qui porte vraiment. C'est le principe : une falsification qui passe est un
renseignement, jamais un succès.

La séance 10 en a ajouté deux qui **mordent au bon endroit sans toucher la
figure**, et c'est instructif :

- prendre `p = a` dans `ex105` laisse la figure entièrement cohérente — `AB`,
  `AI`, le parallélisme `(IJ)//(BC)` : tout tient, parce que `a` est l'autre
  racine de la même équation. Ce qui tombe, c'est `1 < p`. La falsification
  mord donc sur la **condition**, pas sur la géométrie — et c'est exactement ce
  que l'exercice demande de comprendre.
- accepter la racine `1/3` dans `ex104` ne casse rien non plus : le triangle se
  reconstruit à l'envers et `AC = √3(x+1)` reste vraie. C'est `1 < 1/3` qui
  ment.

## Ce que la séance a demandé

La séance 11 a demandé une pièce entière : **`entiers.js`**, l'arithmétique
BigInt décrite plus haut. C'est la deuxième fois que le livre force une pièce
neuve, et c'est la même raison qu'au repère — non pas une difficulté
mathématique, mais un **domaine de nombres** que le noyau ne portait pas.
Elle resservira : la séance 1, encore entièrement « à faire », est pleine
d'arithmétique de ce genre.

Elle a aussi appris quelque chose sur la façon de viser une falsification :
trois d'entre elles ont d'abord refusé de mordre, et **les trois disaient une
vérité**. `8^666 + 5×2^2000 = 21 × 2^1998` est bien divisible par 8 ;
`3^2013 + 3^2015 = 10 × 3^2013` est bien divisible par 45 ; et déplacer la
perpendiculaire de `B` vers `C` dans `ex115` donne la **même** droite, puisque
les deux points ont la même abscisse. Il a fallu viser le facteur qui *manque*
(5 dans le premier, 4 dans le second) et, pour le troisième, la position de
`E` — ce qui porte réellement l'exercice.

La séance 10 n'a demandé **aucune pièce neuve**. Ses trois figures se posent
avec ce qui existait déjà — `proj`, `milieu`, `sym` — et ses paramètres passent
par `env`, comme le `x` du carré qui glisse de la séance 5. Une seule chose a
dû être contournée, et elle est honnête : `BM` dans `ex103` vaut `√(9 − 3√3)`,
qui n'appartient pas à `ℚ[√d]`. Le nom `BM` n'existe donc pas, et la longueur
se contrôle en **carré** (`longueur-carree`), là où la démonstration ne parle
de toute façon que de `BM²`.

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
repère par séance. Il ne restait que l'**espace** — et `espace.js` l'a levé.
