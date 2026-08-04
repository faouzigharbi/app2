# سلسلة تمارين عدد 1 — chaînes générées

11 exercices, **64 opérations par tirage**, d'après `fichier_scripts.md`
(سلسلة تمارين عدد 1, 7 أساسي, الأستاذ صابر بنجدو).

Les nombres **changent à chaque tirage** : bouton « أرقام جديدة » ou rechargement
de la page. La chaîne de correction n'est donc pas écrite, elle est **calculée**
à partir des valeurs tirées.

Ouvrir `index.html`.

| Exercice | Contenu | Questions |
|---|---|---|
| 1 | QCM de la fiche converti en chaînes (priorité, problème, équations) | 4 |
| 2 | أحسب العبارات التالية — priorité, parenthèses, crochets | 6 |
| 3 | أكمل بالعدد المناسب | 6 |
| 4 | `(a − c) − (b − c) = a − b` | 6 |
| 5 | `(a + c) − (b + c) = a − b` | 6 |
| 6 | `(a − c) + (b + c) = a + b` | 6 |
| 7 | `(a + b) − c` | 6 |
| 8 | `a − (b + c)` | 6 |
| 9 | regroupement des facteurs | 6 |
| 10 | facteur commun, `a×b + a×c` | 6 |
| 11 | facteur commun, `a×b − a×c` | 6 |

## Corrections apportées au fichier d'origine

Les scripts fournis annonçaient « pas de valeurs négatives » mais leurs bornes
ne le garantissaient pas. Corrigé :

| Origine | Problème | Correction |
|---|---|---|
| `generate_ex1_q3` | `145 = 29 − (38 + x)` n'a **pas de solution dans ℕ** (`x = −154`) ; `x`, `b`, `target` étaient tirés puis inutilisés | forme `(x + b) − c = cible` avec `b > c`, tirages réellement utilisés |
| `generate_ex1_q4` | `335 = (530 − 461) − (461 − a)` donne `a = 727` mais passe par `−266` ; `a` tiré puis inutilisé | forme `(a − c) − (d − c) = cible`, aucun négatif |
| `generate_ex2` (F) | `f2 ∈ [200,300[` et `f3+f4` jusqu'à 218 → crochet **négatif** | `f2 > f3 + f4 + 20` garanti |
| `generate_ex3` (6) | `q1 − target6 − q3` pouvait être **négatif** (ex. 80 − 69 − 19) | bornes resserrées, réponse toujours ≥ 5 |
| `generate_ex4` | `a2 − b` pouvait être **négatif** (`a2 = a1 − 100`) | `b < a2 < a1`, écart tiré parmi 50/100/111/200/500/1000 |
| `generate_ex9/10/11` | valeurs codées en dur, aucun tirage | facteurs tirés, produits ronds garantis |
| `generate_ex1_q2` | l'énoncé demandait l'effectif *après* la station, le corrigé expliquait l'inverse | énoncé et chaîne cohérents |
| tous | `$$…$$` + `\times` supposaient MathJax, absent de la bibliothèque et injoignable hors ligne | notation directe `×`, isolée en `dir="ltr"` |

Un point de fond : les QCM de l'exercice 1 sont devenus des chaînes, puisque
c'est le format demandé. Les distracteurs (`ans + 20`, `ans - 10`) n'ont donc
plus d'emploi.

## Vérification

```bash
node verifier.js 300     # 300 tirages par exercice
```

Un générateur ne se relit pas, il faut l'exécuter. Le validateur tire chaque
exercice des centaines de fois et contrôle sur **chaque** instance :

1. l'énoncé, calculé directement, vaut le résultat annoncé par la chaîne ;
2. chaque étape qui est une expression vaut le résultat final, chaque étape
   qui est une égalité est exacte ;
3. aucun résultat négatif, aucune division inexacte, aucune décimale ;
4. aucune étape dupliquée — l'ordre attendu reste unique ;
5. chaque expression est isolée en `dir="ltr"`.

Il affiche aussi la **variété** : le pourcentage d'énoncés distincts sur
l'ensemble des tirages, pour repérer un générateur trop pauvre.

Dernier passage : **19 200 questions tirées, 66 600 contrôles arithmétiques,
0 erreur**, et les 11 pages ouvertes dans Chromium sans erreur JS.

## Fichiers

```
index.html          sommaire
moteur.js           chaînes + isolation bidi (navigateur et Node)
generateurs.js      les 11 générateurs
ex01.js … ex11.js   tirage initial de chaque exercice
ex01.html … ex11.html
style.css
verifier.js         validation (Node)
_build.js           régénère les pages
```

Pour ajouter un exercice : une fonction dans `generateurs.js`, une entrée dans
`EXERCICES`, puis `node _build.js .` et `node verifier.js`.
