# العمليات في مجموعة الأعداد الحقيقية — سلاسل البرهان

Portage de la fiche « العمليات في مجموعة الأعداد الحقيقية — تمـارين شاملة »
(riadhyet.com, جوهر سويسي, 2018-2019), exercices **17, 18 et 19**, en pages
« chaîne de démonstration ».

La méthode est décrite dans [`../METHODE.md`](../METHODE.md).

## Structure

Une page par **exercice**, et dans la page **un volet par question de l'énoncé** :

| page | exercice | volets | questions de l'énoncé |
|---|---|---|---|
| `ex17.html` | جداء عددين يساوي 1 | 4 | 1, 2)أ, 2)ب, 3 |
| `ex18.html` | A و B مقلوبان | 5 | 1, 2)أ, 2)ب, 3)أ, 3)ب |
| `ex19.html` | عبارتان مقلوبتان | 5 | 1, 2, 3, 4)أ, 4)ب |

## Ce qui se tire, et pourquoi

Les nombres changent à chaque chargement (« أرقام جديدة »), mais la structure de
l'énoncé ne bouge jamais — et on ne tire que ce que l'exercice supporte.

**Exercice 17 — libre.** Tout y repose sur : si `ab = 1` alors
`a² - a(b + 1/b) + 1 = 0`. Autrement dit, dès qu'un coefficient s'écrit « un
nombre plus son inverse », l'équation `x² - kx + 1 = 0` se résout de tête. Le
`26/5` de la fiche n'est que `5 + 1/5`, et le `5/2` que `2 + 1/2` : n'importe
quel entier ferait l'affaire, et c'est ce qu'on tire.

**Exercice 18 — contraint.** `A = u + v√r`, `B = u - v√r`, et l'énoncé affirme
que `A` est l'inverse de `B` — ce qui exige `u² - r v² = 1`, l'équation de Pell.
On ne tire donc pas `(u, v, r)` au hasard : on choisit dans une liste de
solutions (`(3,2,2)` est celle de la fiche, `A = 3 + 2√2`). Tout le reste — les
écritures en radicaux de `A`, `B`, `E`, `F`, la constante de `D` — se recalcule à
partir de `(u, v, r)` par des identités démontrées en commentaire dans
`reels.js`.

**Exercice 19 — rigide.** Les nombres y sont imposés par les questions
elles-mêmes : « `a - b` et `-2ab` sont opposés » force `a - b = 2`, et `ab = 1`
force alors `a = 1 + √2` et `b = √2 - 1` ; la question 4)ب force `√8`. Ces
nombres-là ne peuvent pas bouger. Ce qui bouge est l'**habillage** : les quatre
écritures en radicaux (`a`, `b`, `c`, `d`) que l'élève doit réduire pour
retomber dessus.

## Arithmétique

Ces exercices ne vivent pas dans les rationnels. Le noyau travaille donc en
exact sur les nombres de la forme

    c₀ + c₁√d₁ + c₂√d₂ + …        (cᵢ rationnels, dᵢ sans facteur carré)

`√5 × √2 = √10` y est une multiplication, pas une approximation ; la division
par une somme de deux termes passe par le **conjugué** — le geste même de la
leçon. `A × B = 1` s'y démontre au lieu de se constater à 10⁻⁹ près.

## Impression

Bouton « ورقة للطباعة » : la feuille sort en deux parties séparées par un saut
de page — **ورقة التلميذ** (étapes en désordre, case à numéroter) puis
**ورقة الوليّ** (les mêmes dans l'ordre). Le parent corrige sans avoir à refaire
l'exercice.

## Vérification

    node verifier.js 200            # 200 tirages par exercice
    CONTRE_EXEMPLES=1 node verifier.js

État actuel :

    التمرين 17 ✓   التمرين 18 ✓   التمرين 19 ✓
    200 tirages par exercice, 2800 questions,
    51000 relations recalculées et 19000 contrôles, 0 erreur.
    15/15 falsifications détectées.

## Régénérer les pages

    node _build.js .

`ex17.html`, `ex18.html`, `ex19.html` et `index.html` sont engendrés — ils ne
s'éditent pas à la main.
