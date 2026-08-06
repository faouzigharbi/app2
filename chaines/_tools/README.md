# الأعداد الصحيحة الطبيعية والعمليات عليها — 7 أساسي

**207 opérations, 4 chapitres × 5 niveaux = 20 chaînes de démonstration.**

Contenu relevé intégralement sur deux fiches :

- **فوزي الغربي** — « الأعداد الصحيحة والعمليات عليها », 5 pages, exercices 1 à 10
- **صابر بنجدو** — « سلسلة تمارين عدد 1 », 7 أساسي نموذجي 2021-2022, exercices 1 à 11
  (fiche scannée, lue à l'image)

Aucune puissance. Aucun nombre négatif, aucune décimale : tous les résultats
intermédiaires et finaux sont des entiers naturels, toutes les divisions
tombent juste.

## Les 4 chapitres

| Fichier | Chapitre | Contenu | Questions |
|---|---|---|---|
| `nat1_*` | أولوية العمليات | priorité, parenthèses, crochets imbriqués | 51 |
| `nat2_*` | أيسر طريقة: الأقواس | terme commun `(a±c)−(b±c)`, `a−(b+c)`, `(a+c)−c'` | 92 |
| `nat3_*` | تجميع المجاميع | regroupement, sommes remarquables, terme manquant | 28 |
| `nat4_*` | الجداء: العامل المشترك | associativité du produit, distributivité | 36 |

Progression `easy → medium → hard → expert → extreme` dans chaque chapitre.

## Deux partis pris pédagogiques

**Les calculs indépendants tiennent dans une seule étape.** Dans `52×4 − 3×6`,
commencer par `3×6` est aussi correct ; deux étapes séparées auraient compté
faux un ordre légitime. L'ordre attendu de chaque chaîne est donc **unique**.

**Les parenthèses négatives ne sont jamais calculées.** Neuf opérations de la
fiche Gharbi — dont `(1000−876)−(500−876)` et `(35+22)+(11−22)` — ont une
parenthèse négative si on la calcule littéralement. C'est précisément ce que
l'astuce évite : la chaîne applique `(a+c)−(b+c) = a−b` et ne développe pas.
Aucun signe négatif n'apparaît à l'écran. `verifier.js` les liste en fin de
rapport pour mémoire.

## Écarté, et pourquoi

| Origine | Écarté | Raison |
|---|---|---|
| Gharbi ex 9, `x` | `112 − 11×10 + 4×2.5` | décimale |
| Gharbi ex 4, n°5 | `(789−65−23) + (59−65−23)` | seconde parenthèse négative, sans astuce possible |
| Gharbi ex 6, partie ب | opérations avec `/` | opérateurs illisibles dans le PDF — non devinés |
| Gharbi ex 1, `h` | doublon de `g` | identique |
| Gharbi ex 3, `e` et `j` | recopiés de l'exercice 1 | doublons |
| Gharbi ex 5, `v` | doublon de `r` | identique |

## Erreurs relevées dans la fiche Gharbi

- **page 2, exemple b** : `(325+75)+(125−75) = 325+125 = 200` → le résultat est
  **450**. Le 200 vient de la page 1, où l'opération était une soustraction.
- **page 1, g et h** : la même opération est proposée deux fois.
- **page 2, section « + »** : les items c, i, e, j sont des soustractions ; la
  ligne de réponse de `c` porte un `−` alors que l'opération porte un `+`.
- **page 5, ex 10 h** : `345×168 × −42×345 − 345×26` — un `×` de trop ; lu
  `345×168 − 42×345 − 345×26`, qui donne `345×100 = 34500`.

## Outils

```bash
node _tools/build.js .                 # régénère les 20 paires .js/.html + nat_index.html
node _tools/verifier.js .              # valide (sortie non nulle si erreur)
node _tools/build.js <dossier> index.html   # build autonome, index nommé index.html
```

- `donnees.js` — tout le contenu, une ligne par opération. C'est le seul
  fichier à modifier pour ajouter des exercices.
- `moteur.js` — génère les chaînes. Pour la priorité des opérations, la chaîne
  est **calculée**, pas écrite à la main : à chaque étape le moteur réduit
  toutes les opérations de même priorité au même niveau de parenthèses.
- `verifier.js` — contrôle par question :
  1. le calcul direct de l'énoncé donne bien le résultat de la chaîne
     (l'astuce et le calcul brut doivent concorder) ;
  2. chaque étape qui est une expression vaut le résultat final ; chaque étape
     qui est une égalité est exacte ;
  3. aucun résultat négatif, aucune division inexacte dans une chaîne ;
  4. aucune étape dupliquée ;
  5. chaque expression des fichiers générés est isolée en `dir="ltr"`.

Dernier passage : **207 questions valides, 0 erreur**, et 20 pages ouvertes
dans Chromium sans erreur JS.

## Sens d'écriture

Dans une page `dir="rtl"`, une expression laissée nue est réordonnée par le
navigateur : `2³×2⁴` s'affiche `2⁴×2³`. Chaque expression est donc enveloppée
dans un `<span dir="ltr">` insécable, le texte arabe restant dans le flux RTL.
Une expression n'est jamais coupée en fin de ligne — coupée, ses parenthèses
seraient inversées ; si elle est trop longue, son cadre défile
(`overflow-x: auto`).
