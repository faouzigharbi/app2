# الإحصاء — 9 أساسي

La **leçon** de statistiques, et non un devoir : huit familles, une page
chacune, cinq questions par page, **tirées à chaque chargement**. L'élève peut
recommencer autant de fois qu'il veut.

Le chapitre comble un manque nommé depuis longtemps dans
[`../../revision/inventaire.js`](../../revision/inventaire.js) : les séances 12
et 13 du livre de révision portent des statistiques, et aucun chapitre ne les
accueillait. Il ne manquait ni géométrie ni radicaux — il manquait un noyau
capable de compter **exactement**.

## Les huit familles

| page | famille | ce qui s'y joue |
|---|---|---|
| `ex1.html` | قراءة جدول | effectif total, **mode**, étendue — les trois lectures que l'élève confond |
| `ex2.html` | المعدّل الحسابي | Σ(valeur × effectif) / N, et le rappel que le dénominateur est `N`, pas le nombre de valeurs |
| `ex3.html` | التكرارات المتراكمة | croissant (« au plus ») et décroissant (« au moins »), avec le contrôle `Cₖ = N` |
| `ex4.html` | التواتر و النسب و الزوايا | une seule proportion, **trois échelles** : part de 1, de 100, de 360 |
| `ex5.html` | موسّط سلسلة متقطّعة | rang `(N+1)/2` si `N` impair ; demi-somme des rangs `N/2` et `N/2+1` s'il est pair |
| `ex6.html` | مركز الفئة و المعدّل | la classe remplacée par son centre : la seule approximation de la leçon, et elle est nommée |
| `ex7.html` | **موسّط سلسلة متّصلة** | **la pièce centrale** — on trace le polygone et on **lit** ; voir ci-dessous |
| `ex8.html` | الاحتمال | cas favorables sur effectif total, le seuil pris sur une **borne** |

## La médiane d'une série continue — la règle, prise au mot

> « La médiane d'une série continue se calcule par l'**abscisse du point
> d'ordonnée 50 %** — ou `N/2`, ou `(N+1)/2`. »

Les trois écritures désignent **le même point** du polygone des fréquences
cumulées croissantes ; seule l'échelle verticale change :

| axe vertical | on lit à |
|---|---|
| pourcentages | 50 % |
| proportions | 0,5 |
| effectifs cumulés | `N/2` |

Le polygone joint les points (borne **supérieure** de la classe ; cumul), en
partant de (première borne ; 0). L'élève **trace**, puis **lit** :

1. il dresse le tableau des cumuls croissants ;
2. il place les points et les joint ;
3. il calcule `N/2` ;
4. il trace l'horizontale à cette hauteur ;
5. il **lit l'abscisse** du point d'intersection.

C'est tout. Rien d'autre n'est demandé, et rien d'autre n'apparaît dans les
chaînes.

### La formule d'interpolation est celle du VALIDATEUR, pas celle de l'élève

Entre deux sommets le polygone est un segment, et l'abscisse cherchée s'écrit

```
Me = bᵢ₋₁ + (h − Cᵢ₋₁) × (bᵢ − bᵢ₋₁) / (Cᵢ − Cᵢ₋₁)
```

**Cette formule est hors programme en 9ᵉ, et elle n'est écrite nulle part dans
un énoncé ni dans une étape.** Elle vit uniquement dans `stat.js`, où elle sert
à *contrôler* que la valeur lue sur le graphique est la bonne. La distinction
est la même que partout ailleurs dans ce dossier : la machine a le droit de
calculer plus que l'élève, à condition de ne jamais le lui montrer.

### Une médiane qui se lit vraiment

Une conséquence directe, et elle contraint le générateur : la médiane doit être
un nombre **lisible**. Une réponse valant `237/5` obligerait l'élève à
interpoler — c'est-à-dire à sortir du programme pour retrouver le résultat
affiché.

`serieMediane()` ne rend donc que des séries dont la médiane est un **entier**
tombant **strictement à l'intérieur** d'une classe. La lecture graphique et la
valeur exacte coïncident alors, et il n'y a plus d'écart à expliquer.

### La variante `(N+1)/2`

Elle est fournie dans le noyau (`medianeN1`) parce que vous la nommez, mais
elle ne sert à aucune question : sur une série continue elle déplace la lecture
d'un demi-effectif, donc d'autant moins que `N` est grand. Sur la série de
population du corrigé (`N = 1000`) : `220/7 ≈ 31,429` contre
`1541/49 ≈ 31,449` — deux centièmes, invisibles au crayon.

## Ce que le noyau refuse plutôt que d'arrondir

- **Les classes de largeurs inégales.** Le programme lit le mode sur le plus
  grand effectif, ce qui n'est légitime que si les classes ont la même largeur.
  Sinon on comparerait des aires à des hauteurs, et `stat.js` refuse en le
  disant.
- **Une série non rangée.** La médiane d'une série discrète suppose les valeurs
  triées ; une série en désordre lève une erreur au lieu de rendre un nombre.
- **Un palier horizontal.** Une classe d'effectif nul ne peut pas porter la
  médiane — on ne divise pas par zéro en silence.

## Ce qui est resté hors des chaînes, volontairement

Le programme de 9ᵉ fixe la limite, et le dossier s'y tient :

| dans le noyau, pour contrôler | jamais dans une étape |
|---|---|
| l'interpolation affine sur le polygone | l'élève **lit**, il ne calcule pas de pente |
| `effectifSous` à un seuil quelconque | les seuils des questions tombent toujours sur une **borne** |
| la variante `(N+1)/2` | aucune question ne s'en sert |

Une première version de la famille 7 affichait la ligne
`Me = 40 + (58,5 − 40) × 20/50`. C'était juste, et c'était hors programme :
retiré.

## Le décimal, et un piège qu'il a fallu retirer du noyau

Le noyau commun découpait `« 33.4 »` en `33` puis `4`, que la juxtaposition
**multiplie** : il lisait **132**. Et `« 0.5 »` valait **0**. Tant qu'on ne
faisait que des radicaux, cela ne s'était jamais vu ; en statistiques, où les
poids sont en `0,5 kg` et les moyennes en `33,4`, c'était une bombe à
retardement — le genre exact d'erreur muette que cette machine existe pour
empêcher.

Le lexeur reconnaît désormais un décimal comme **un seul jeton**, et le
convertit en **fraction exacte** : `0.25` est `25/100` réduit, jamais `0.25`
arrondi. La correction a été portée aussi dans `chaines/brevet/noyau.js`, et
ses 41 880 questions et 556 falsifications repassent à l'identique.

## Ce que le validateur fait

Il n'inspecte pas le générateur : il l'**exécute**, reconstruit la série à
partir de ses seules données brutes — valeurs (ou bornes) et effectifs — et
recalcule tout ce qu'elle affirme. Une moyenne, un cumul, une médiane annoncés
dans une étape sont confrontés à la série, jamais crus sur parole.

```
node verifier.js 60             # 2 400 questions, 12 000 relations, 0 erreur
CONTRE_EXEMPLES=1 node verifier.js   # 26/26
node _build.js .                # régénérer les pages
```

Sur une série, la falsification qui compte n'est pas de retoucher une étape :
c'est de **changer un effectif**. Si la série peut bouger sans que rien ne
proteste, alors rien n'était recalculé — tout était recopié.

## Deux falsifications qui ont refusé de mordre

Les deux avaient tort dans la **visée**, pas dans le validateur — et les deux
ont appris quelque chose :

- **« la dernière borne décalée »** sur la médiane : élargir la dernière classe
  ne déplace **pas** la médiane quand celle-ci tombe avant. Les cumuls sont
  intacts, les segments traversés aussi. La falsification a été réarmée sur la
  borne basse de la **classe médiane** — celle qui la porte vraiment.
- **« l'étendue lue comme la plus grande valeur »** : quand la série commence à
  0, l'étendue **est** la plus grande valeur. Ce n'était donc pas une
  falsification, c'était parfois la vérité. Réarmée sur la confusion qui, elle,
  est toujours fausse : l'étendue prise pour le **nombre** de valeurs.
