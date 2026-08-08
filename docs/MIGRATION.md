# Migration — de `generateurs_pdf9` au pilier consolidé

Les 21 pages HTML d'origine sont conservées dans `legacy/`. Elles ne sont plus
référencées par le site : ce document dit où est passé chaque fichier.

## Fractions — 14 fichiers → 8 générateurs

| Fichier d'origine | Remplacé par |
|---|---|
| `arabic-fraction-simplification.html` | `fractions-simplification` |
| `fraction-simplification-exercise.html` | `fractions-simplification` |
| `addition fractions.html` | `fractions-somme` |
| `addition fractions2.html` | `fractions-somme` |
| `addition fractions3.html` | `fractions-somme` (niveau « ثلاثة كسور ») |
| `Factorisation Fractions 2.html` | `fractions-produit` |
| `Division fractions4.html` | `fractions-quotient` |
| `addition fractions4.html` | `fractions-quotient` (le fichier était mal nommé : il traitait la division) |
| `4 opération Fractions.html` | `fractions-operations` |
| `operations fractions .html` | `fractions-operations` |
| `additionFractParenthese.html` | `fractions-parentheses` |
| `Fractions DEcimales.html` | `fractions-decimales` |
| `Factorisation Fractions.html` | `fractions-factorisation` |
| `factorisatioon0.html` | `fractions-factorisation` |

## Puissances — 7 fichiers → 4 générateurs

| Fichier d'origine | Remplacé par |
|---|---|
| `pUISSANCE PRODUIT (2).html` | `puissances-produit` |
| `produit puisssance.html` | `puissances-produit` |
| `puissance prod 2.html` | `puissances-produit` |
| `puissance prod 3.html` | `puissances-produit` (export Poe de 628 Ko) |
| `power-exponent-exercises.html` | `puissances-produit`, `puissances-quotient`, `puissances-puissance` (les trois modes de la page) |
| `exe Puissance.html` | `puissances-expressions` |
| `exe Puissance2.html` | `puissances-expressions` |

## Ce qui a été corrigé au passage

Les doublons n'étaient pas identiques : chaque version rejouait sa propre
arithmétique, avec ses propres défauts. Les bugs suivants existaient dans les
fichiers d'origine et ne sont plus reproductibles, l'arithmétique étant
désormais centralisée dans `assets/js/core/frac.js`.

- **Intervalle aléatoire inversé.** Dans `arabic-fraction-simplification.html`,
  `getRandomInt(Math.max(num, 2), 20)` était appelé avec `num` déjà multiplié
  par le facteur, donc souvent supérieur à 20 : la borne minimale dépassait la
  borne maximale et le tirage devenait incohérent. `Rng.int()` remet
  désormais les bornes en ordre, et le test le vérifie explicitement.

- **Comparaison de réponses par chaîne de caractères.** Dans
  `addition fractions3.html`, la vérification était `userAnswer === correctAnswer`
  sur du texte : `"6/8"` était compté faux face à `"3/4"`, et le moindre espace
  invalidait une bonne réponse. Le moteur compare maintenant par produit en
  croix, et distingue « juste mais non simplifié » de « faux ».

- **Résultats négatifs non voulus.** Le même fichier tirait `a > b > c` puis
  réaffectait des dénominateurs aléatoires indépendants, ce qui détruisait
  l'ordre : des soustractions donnaient des résultats négatifs alors que
  l'énoncé les présentait comme des exercices de niveau élémentaire. Les
  générateurs contrôlent désormais le signe du résultat par niveau.

- **Signe perdu à la simplification.** `Division fractions4.html` et
  `Factorisation Fractions.html` appelaient `findGCD` sur des valeurs signées
  et pouvaient produire un dénominateur négatif. `Frac` normalise le signe sur
  le numérateur.

- **Correction déduite du DOM.** `Factorisation Fractions.html` choisissait les
  étapes du corrigé avec `problem.innerText.includes('+')` : n'importe quel
  changement d'affichage cassait la correction. Les étapes sont maintenant
  produites en même temps que l'énoncé.

- **Dépendances externes mortes.** Plusieurs fichiers chargeaient
  `polyfill.io` — domaine dont le contrôle a changé de mains en 2024 et qui a
  servi à distribuer du code malveillant — et MathJax depuis un CDN. Les pages
  ne fonctionnaient donc pas hors ligne. Le pilier n'a aucune dépendance
  externe : le rendu mathématique est fait en CSS.

- **Contenu parasite.** `addition fractions.html` (190 Ko) et
  `puissance prod 3.html` (628 Ko) étaient des exports de conversations Poe :
  ils embarquaient une bannière de consentement OneTrust et du balisage
  d'application sans rapport avec l'exercice. À eux deux, ils représentaient
  76 % du poids du dossier.

## Ce qui a été ajouté

- **La génération PDF.** Aucun des fichiers du dossier `generateurs_pdf9` ne
  produisait de document imprimable ; deux d'entre eux appelaient `window.print()`
  sur une page non mise en forme pour l'impression. `fiche.html` compose une
  vraie fiche A4 avec en-tête (établissement, nom, classe, date), énoncés sur
  une ou deux colonnes, et corrigé sur une page séparée.
- **Les niveaux de difficulté**, homogènes sur tous les chapitres.
- **Le code de fiche**, qui rend une fiche et son corrigé reproductibles.
- **Les tests** (`node tools/selftest.js`).

## Sécurité

Le fichier `API devoirati.txt` contenait une clé d'API OpenAI en clair. Il a été
supprimé de l'arborescence, mais **il reste présent dans l'historique Git** :
la clé doit être révoquée sur la console OpenAI, et l'historique réécrit si le
dépôt est public.
