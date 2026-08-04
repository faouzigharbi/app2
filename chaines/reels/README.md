# العمليات في مجموعة الأعداد الحقيقية — سلاسل البرهان

Portage en pages « chaîne de démonstration » des fiches du même chapitre.
La méthode est décrite dans [`../METHODE.md`](../METHODE.md).

## Structure

Une page par **exercice**, et dans la page **un volet par question de l'énoncé** :

| page | exercice | volets | questions de l'énoncé |
|---|---|---|---|
| `ex11.html` | التفكيك إلى جداء عوامل | 5 | a, b, c, d, e |
| `ex12.html` | عددان مقلوبان — إنطاق المقام | 5 | 1, puis A, B, C, D |
| `ex13.html` | القيمة المطلقة | 8 | 1) A, B, C, D + 2) quatre équations |
| `ex14.html` | عبارة حرفية | 3 | 1)أ, 1)ب, 2 |
| `ex26.html` | العامل المشترك المخفيّ وراء إشارة | 4 | 1 (a, b), 2, 3 |
| `ex27.html` | عامل مشترك بين ثلاثة حدود | 3 | 1, 2, 3 |
| `ex28.html` | ارفع، انشر، فكّك | 4 | 1, 2, 3)أ, 3)ب |
| `ex29.html` | معادلات و عبارة من الدرجة الأولى | 7 | 1 (trois équations), 2)أ→د |
| `ex17.html` | جداء عددين يساوي 1 | 4 | 1, 2)أ, 2)ب, 3 |
| `ex18.html` | A و B مقلوبان | 5 | 1, 2)أ, 2)ب, 3)أ, 3)ب |
| `ex19.html` | عبارتان مقلوبتان | 5 | 1, 2, 3, 4)أ, 4)ب |
| `ex20.html` | أربعة عشر سؤالا على عددين مقلوبين | 14 | 1 (A, B), 2)أ→د, 3)أ→د |
| `ex41.html` | a مربّع كامل | 7 | 1, 2)أ (en deux), 2)ب, 3)أ, 3)ب, 3)ج |

`serie2.js` porte les exercices 11 à 14, `serie3.js` les exercices 26 à 29,
`reels.js` les exercices 17 à 20 et 41.

L'énoncé du 41 ne compte que six sous-questions ; le septième volet vient de
2)أ, coupée en « احسب الجداء a × b » puis « استنتج أنّ العددين مقلوبان » —
le même découpage qu'au 20, où calculer un produit et en tirer une conclusion
sont deux gestes distincts.

## Ce qui se tire, et pourquoi

Les nombres changent à chaque chargement (« أرقام جديدة »), mais la structure de
l'énoncé ne bouge jamais — et on ne tire que ce que l'exercice supporte.

**Libres — 11, 14, 17 et 26 à 29.** Chaque expression y est un schéma dont on
tire les paramètres. Au 26, le schéma est `√r - k = -(k - √r)` : le facteur
commun n'est visible qu'après ce changement de signe, et c'est tout l'exercice. Le `26/5` du 17 n'est que `5 + 1/5` ; le `(x-2)(x+2)` du 14 ne
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

**Commandé par un seul paramètre — 41.** Sa clef n'est énoncée qu'à la
question 3 : `a` est un carré, `a = (√r - 1)²`. Tout en découle — `b = 1/a`
s'écrit avec `(r-1)²` au dénominateur, et le quotient final se simplifie par
`(√r - 1)` au lieu de se rationaliser. Seul `r` se tire, plus l'habillage de
`c` ; imposer `p - q = r - 1` est ce qui fait tomber `(c - a)/(√r - 1)` sur un
entier, et l'exercice n'a pas d'autre objet que ce moment-là.

**Rigide — 19.** Les nombres y sont imposés par les questions elles-mêmes :
« `a - b` et `-2ab` opposés » force `a - b = 2`, et `ab = 1` force alors
`a = 1 + √2`, `b = √2 - 1` ; la question 4)ب force `√8`. Seul l'**habillage**
varie : les quatre écritures en radicaux à réduire pour retomber dessus.

## Réserve sur la question 4 de l'exercice 26

La fiche imprime « أوجد x في حالة C و D متقابلان » — mais `C` et `D` ne sont
définis **nulle part** dans l'exercice. C'est la question 3 recopiée avec
d'autres lettres. Elle n'est pas portée : il n'y a rien à démontrer sur deux
objets qui n'existent pas. La lire « a et b مقلوبان » ne la sauverait pas non
plus — `a×b = (2√7 - 7)(4x-3)²` est toujours négatif ou nul, donc jamais égal
à 1. La page a donc 4 volets : `a` en produit, `b` en produit, `a + b`, et
l'équation de la question 3.

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

`π` n'appartient pas à cet ensemble et n'y appartiendra jamais. Mais
`|x - π| = 3` ne demande rien de sa valeur : il demande seulement que ce soit un
réel. Il est donc traité comme une **lettre libre**, et le validateur teste
chaque étape sur des dizaines de valeurs — une étape qui dépendrait de `π`
serait aussitôt rejetée.

## Impression

Bouton « ورقة للطباعة » : la feuille sort en deux parties séparées par un saut
de page — **ورقة التلميذ** (étapes en désordre, case à numéroter) puis
**ورقة الوليّ** (les mêmes dans l'ordre). Le parent corrige sans avoir à refaire
l'exercice.

## Vérification

    node verifier.js 400            # 400 tirages par exercice
    CONTRE_EXEMPLES=1 node verifier.js

État actuel :

    11 ✓  12 ✓  13 ✓  14 ✓  17 ✓  18 ✓  19 ✓  20 ✓  26 ✓  27 ✓  28 ✓  29 ✓  41 ✓
    400 tirages par exercice, 29600 questions,
    720400 relations recalculées et 198000 contrôles, 0 erreur.
    49/49 falsifications détectées.

## Régénérer les pages

    node _build.js .

Les `exNN.html` et `index.html` sont engendrés — ils ne s'éditent pas à la main.
