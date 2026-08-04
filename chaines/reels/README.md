# العمليات في مجموعة الأعداد الحقيقية — سلاسل البرهان

Portage en pages « chaîne de démonstration » de deux fiches du même chapitre.
La méthode est décrite dans [`../METHODE.md`](../METHODE.md).

## Structure

Une page par **exercice**, et dans la page **un volet par question de l'énoncé** :

| page | exercice | volets | questions de l'énoncé |
|---|---|---|---|
| `ex11.html` | التفكيك إلى جداء عوامل | 5 | a, b, c, d, e |
| `ex12.html` | عددان مقلوبان — إنطاق المقام | 5 | 1, puis A, B, C, D |
| `ex13.html` | القيمة المطلقة | 8 | 1) A, B, C, D + 2) quatre équations |
| `ex14.html` | عبارة حرفية | 3 | 1)أ, 1)ب, 2 |
| `ex17.html` | جداء عددين يساوي 1 | 4 | 1, 2)أ, 2)ب, 3 |
| `ex18.html` | A و B مقلوبان | 5 | 1, 2)أ, 2)ب, 3)أ, 3)ب |
| `ex19.html` | عبارتان مقلوبتان | 5 | 1, 2, 3, 4)أ, 4)ب |
| `ex20.html` | أربعة عشر سؤالا على عددين مقلوبين | 14 | 1 (A, B), 2)أ→د, 3)أ→د |

`serie2.js` porte les exercices 11 à 14, `reels.js` les exercices 17 à 20.

## Ce qui se tire, et pourquoi

Les nombres changent à chaque chargement (« أرقام جديدة »), mais la structure de
l'énoncé ne bouge jamais — et on ne tire que ce que l'exercice supporte.

**Libres — 11, 14, et 17.** Chaque expression y est un schéma dont on tire les
paramètres. Le `26/5` du 17 n'est que `5 + 1/5` ; le `(x-2)(x+2)` du 14 ne
demande que `p - r = 1` et `q - s = k`.

**Contraints — 12, 18 et 20.** Tous trois reposent sur `(u + v√r)(u - v√r) = 1`, donc
sur `u² - r v² = 1` : l'équation de Pell. On ne tire pas `(u, v, r)` au hasard,
on choisit dans une liste de ses solutions — sinon « العددان مقلوبان » serait
faux. Au 18, les écritures de `A`, `B`, `E`, `F` et la constante de `D` se
recalculent ensuite à partir de `(u, v, r)`. Au 20, c'est tout l'exercice : une
fois `A × B = 1` acquis à la question 3, les onze questions suivantes ne sont
plus des calculs mais des **lectures** — `1/A` c'est `B`, `1/B` c'est `A`, et
tout tombe. Trois de ses réponses ne dépendent même pas du tirage : `M = 1`,
`N = -1`, et `E(D-1) - 1 = -E` quel que soit le couple choisi. Le 20 restreint
en revanche la liste de Pell aux couples pour lesquels son écriture de `A`
admet encore des entiers.

**Contraint par les signes — 13.** Lever une valeur absolue, c'est d'abord
établir un signe. `|5 - √3|` ne se lève pas comme `|√3 - 5|`. Les majorants sont
donc tirés d'abord, et les radicandes choisis parmi ceux qu'ils dominent : un
tirage ne peut pas renverser un signe. Pour `|2x - 1| = 3`, ce sont les deux
**solutions** qu'on tire, seul moyen qu'elles tombent juste.

**Rigide — 19.** Les nombres y sont imposés par les questions elles-mêmes :
« `a - b` et `-2ab` opposés » force `a - b = 2`, et `ab = 1` force alors
`a = 1 + √2`, `b = √2 - 1` ; la question 4)ب force `√8`. Seul l'**habillage**
varie : les quatre écritures en radicaux à réduire pour retomber dessus.

## Réserve sur l'expression « e » de l'exercice 11

La fiche imprime `e = 3(√3-2) + √2(√3-2) + 3(√3+2)`. Ce troisième terme, avec
son `+2`, ne partage aucun facteur avec les deux premiers : la somme vaut
`6√3 + √6 - 2√2`, qui **n'est pas un produit**. L'exercice demandant de
factoriser, la page lit le troisième terme comme un `q(√3 - 2)` — le schéma des
deux autres — ce qui donne `(√3 - 2)(3 + q + √2)`. Si la fiche voulait vraiment
`+2`, c'est l'énoncé qui est à corriger.

## Arithmétique

Ces exercices ne vivent pas dans les rationnels. Le noyau travaille en exact sur
les nombres de la forme

    c₀ + c₁√d₁ + c₂√d₂ + …        (cᵢ rationnels, dᵢ sans facteur carré)

`√5 × √2 = √10` y est une multiplication, pas une approximation ; la division
par une somme de deux termes passe par le **conjugué** — le geste même de la
leçon (`إنطاق المقام`). `A × B = 1` s'y démontre au lieu de se constater à 10⁻⁹
près.

## Impression

Bouton « ورقة للطباعة » : la feuille sort en deux parties séparées par un saut
de page — **ورقة التلميذ** (étapes en désordre, case à numéroter) puis
**ورقة الوليّ** (les mêmes dans l'ordre). Le parent corrige sans avoir à refaire
l'exercice.

## Vérification

    node verifier.js 300            # 300 tirages par exercice
    CONTRE_EXEMPLES=1 node verifier.js

État actuel :

    التمرين 11 ✓  12 ✓  13 ✓  14 ✓  17 ✓  18 ✓  19 ✓  20 ✓
    300 tirages par exercice, 14700 questions,
    163800 relations recalculées et 59700 contrôles, 0 erreur.
    34/34 falsifications détectées.

## Régénérer les pages

    node _build.js .

Les `exNN.html` et `index.html` sont engendrés — ils ne s'éditent pas à la main.
