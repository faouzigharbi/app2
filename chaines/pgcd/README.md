# ال ق.م.أ و ال م.م.أ لعددين صحيحين — مسائل

Quatre générateurs de chaînes de résolution, d'après les exercices 13, 14, 15
et 16 de la fiche « ال ق.م.أ و ال م.م.أ لعددين صحيحين » (7 أساسي, فوزي الغربي).

Les nombres changent à chaque tirage ; la chaîne est reconstruite avec eux.
Ouvrir `index.html`.

| Page | Problème | Outil | Étapes |
|---|---|---|---|
| `ex13` | effectif d'un collège réparti en classes de a, b ou c | **م.م.أ** (PPCM) | 5 |
| `ex14` | nombre de stylos rangés en boîtes de a, b ou c | **م.م.أ** (PPCM) | 5 |
| `ex15` | arbres équidistants autour d'un terrain, puis leur prix | **ق.م.أ** (PGCD) | 7 |
| `ex16` | cubes de savon remplissant une boîte, toutes les solutions | **ق.م.أ** (PGCD) | 5 |

Chaque page tire 3 énoncés ; le bouton « أرقام جديدة » en refait autant.

## Un générateur, quatre fichiers

Chaque problème vit dans son propre fichier — `gen13.js` … `gen16.js` — et
s'enregistre auprès de `arith.js`, qui porte les outils communs :
décomposition en facteurs premiers, PGCD, PPCM, diviseurs, et le rendu.

## Ce que les générateurs garantissent

**La réponse doit être unique.** Pour 13 et 14, l'énoncé donne un intervalle
(« محصور بين 1000 و 1100 ») : s'il contenait deux multiples du PPCM, la
question n'aurait pas de réponse. Le générateur ne se contente pas de le
supposer, il **compte** les multiples dans l'intervalle et rejette le tirage
s'il n'y en a pas exactement un. Le validateur le recompte de son côté.

**Le PGCD doit être celui annoncé.** Pour 15 et 16, les dimensions sont
construites comme `d × x`, `d × y`, `d × z` — mais cela ne suffit pas : si
`x`, `y`, `z` ont eux-mêmes un facteur commun, le vrai PGCD dépasse `d`. Le
tirage n'est retenu que si `pgcd(x, y, z) = 1`.

**Le nombre d'arbres doit être entier.** Il vaut `2(a+b) ÷ d`, ce qui est
automatique puisque `d` divise `a` et `b` — mais le validateur le vérifie
plutôt que de le déduire.

## La méthode

La résolution passe par la **décomposition en facteurs premiers**, pas par une
division essayée à la main :

```
154 = 2 × 7 × 11
 66 = 2 × 3 × 11
ق.م.أ = les facteurs communs au plus petit exposant = 2 × 11 = 22
```

Et pour le PPCM, les mêmes facteurs au plus **grand** exposant. C'est la même
règle que partout ailleurs dans la bibliothèque : on met en évidence la
structure, on ne calcule pas en aveugle.

## Vérification

```bash
node verifier.js 300
```

Le validateur tire chaque problème des centaines de fois et contrôle :

1. chaque égalité écrite dans une étape — plusieurs égalités séparées par
   « و » dans la même étape sont contrôlées une par une ;
2. la dernière étape annonce bien le résultat ;
3. **l'affirmation est vraie** : le PPCM et le PGCD sont recalculés
   indépendamment du générateur et comparés à ce que la chaîne annonce ;
4. la réponse est unique dans l'intervalle donné ;
5. périmètre, nombre d'arbres, prix et liste des diviseurs concordent, et
   chaque diviseur listé divise réellement les trois dimensions ;
6. aucune étape dupliquée, chaque expression isolée en `dir="ltr"`.

Dernier passage : **3 600 instances, 25 200 contrôles, 0 erreur**, et les
4 pages ouvertes dans Chromium sans erreur JS.

## Fichiers

```
index.html            sommaire
moteur.js             copié depuis ../serie1 à chaque build
arith.js              PGCD, PPCM, facteurs premiers, diviseurs, rendu, registre
gen13.js … gen16.js   un générateur par problème
ex13.js … ex16.js     tirage initial
ex13.html … ex16.html
style.css
verifier.js           validation (Node)
_build.js             régénère les pages
```
