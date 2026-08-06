# قابلية القسمة — 8 أساسي

Trois séries génératrices, d'après les exercices 8, 9 et 10 de la fiche
« قابلية القسمة على 4 و 25 و 8 » (فوزي الغربي).

Ouvrir `index.html`. Chaque page tire 3 énoncés ; « أرقام جديدة » en refait autant.

| Page | Exercice | Geste | Étapes |
|---|---|---|---|
| `ex08` | deux termes de **même base** | mettre la plus petite puissance en facteur | 5 |
| `ex09` | bases **déguisées** (`9^1020` = `3^2040`) | unifier la base, puis factoriser | 7 |
| `ex10` | **trois** termes, bases mélangées | unifier, factoriser, lire le crochet | 7 |

`ex08` propose aussi la variante « termes identiques » de la fiche :
`3⁴ + 3⁴ + 3⁴ + 3⁴ = 4 × 3⁴`.

## Trois énoncés de la fiche ne tiennent pas

Vérifié en calcul exact (BigInt), sur les nombres tels que je les lis sur la
photo :

| Exercice | Énoncé | Réalité |
|---|---|---|
| 9-3 | `3²⁰⁴ + 9¹⁰⁰` divisible par **42** | `= 3²⁰⁰ × 82`. Divisible par 2 et par 3, **pas par 7** — donc pas par 42. |
| 10-1 | `3 × 49⁶⁰ + 2 × 7¹²¹` divisible par **51** | `= 7¹²⁰ × 17`. Divisible par **17**, pas par 3 — donc pas par 51. |
| 10-2 | `2³⁰¹⁴ + 4¹⁵⁰⁶ + 3 × 8¹⁰⁰⁵` divisible par **44** | `= 2³⁰¹² × 29`. Divisible par 4, **pas par 11**. Avec `9 × 8¹⁰⁰⁵` au lieu de `3 × 8¹⁰⁰⁵`, le crochet vaut 77 et l'énoncé devient juste. |

Les onze autres items sont exacts. Les générateurs, eux, **construisent** le
diviseur à partir du crochet : l'énoncé ne peut pas être faux par construction,
et le validateur le revérifie en calcul exact.

## Un point sur les signes

La fiche écrit `2 × 25⁵⁰ − 5¹⁰³` et `13 × 3⁵⁰⁰⁰ − 243¹⁰⁰¹`, qui sont **négatifs**
(le second terme l'emporte). La divisibilité reste vraie, et en 8ᵉ les relatifs
sont au programme — mais les générateurs orientent toujours la soustraction pour
que le nombre reste positif, comme partout ailleurs dans la bibliothèque.

## Vérification

```bash
node verifier.js 400
```

Le point dur : la page ne calcule jamais `3^2013`, elle met en facteur. Le
validateur, lui, le calcule **pour de bon** — `Number` déborde bien avant, donc
tout passe en **BigInt** :

1. chaque égalité écrite dans une étape est évaluée en BigInt, division exacte
   comprise ;
2. la dernière étape annonce le diviseur ;
3. le crochet annoncé vaut la somme des termes ramenés au socle ;
4. **le nombre entier est réellement divisible par D**, et strictement positif ;
5. aucune étape dupliquée, chaque expression isolée en `dir="ltr"`.

Dernier passage : **3 600 instances, 19 000 contrôles dont 3 600 divisibilités
calculées en BigInt, 0 erreur**, et les 3 pages ouvertes dans Chromium sans
erreur JS.

Variété : environ 900 énoncés distincts par série sur 300 tirages.

## Fichiers

```
index.html            sommaire
moteur.js             copiés depuis ../serie1 et ../pgcd à chaque build
arith.js
outils.js             bases déguisées, valeur exacte en BigInt
gen08.js gen09.js gen10.js
ex08.js … ex10.js     tirage initial
ex08.html … ex10.html
style.css
verifier.js           validation (Node, BigInt)
_build.js             régénère les pages
```
