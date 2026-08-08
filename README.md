# Devoirati — pilier « Mathématiques 9ème année »

Générateurs d'exercices de mathématiques pour la 9ème année de base
(chapitres **الكسور** / fractions et **القوى** / puissances), en arabe.

Deux usages, une seule base de code :

- **Élève** — s'entraîner à l'écran sur des exercices renouvelés à l'infini,
  avec vérification, indice et correction détaillée.
- **Enseignant** — composer une **fiche imprimable / PDF** (énoncés + corrigé
  sur une page séparée) en choisissant les chapitres, les niveaux et le nombre
  d'exercices.

## Démarrer

Aucun build, aucune dépendance. Ouvrir `index.html` — directement depuis le
disque (`file://`) ou derrière n'importe quel serveur statique.

```
index.html       fenêtre d'entrée : catalogue des 12 générateurs
exercice.html    entraînement interactif   (?g=<id>&n=<niveau>)
fiche.html       constructeur de fiche PDF (?g=<id> pour pré-remplir)
```

## Architecture

```
assets/css/pilier.css          design, rendu mathématique, styles d'impression
assets/js/core/frac.js         arithmétique exacte sur les rationnels
assets/js/core/rng.js          aléatoire déterministe (graine → fiche reproductible)
assets/js/core/render.js       rendu HTML des fractions et des puissances
assets/js/core/registry.js     registre des générateurs
assets/js/core/engine.js       moteur d'entraînement interactif
assets/js/core/worksheet.js    construction de la fiche imprimable
assets/js/generators/*.js      les générateurs, un fichier par chapitre
tools/selftest.js              tests (node tools/selftest.js)
legacy/                        les 21 pages d'origine, conservées telles quelles
```

Le point clé : **un générateur est écrit une seule fois** et alimente à la fois
l'entraînement interactif et la fiche PDF. Auparavant, chacune des 21 pages
réimplémentait sa propre arithmétique, son propre rendu et sa propre correction.

### Ajouter un exercice

1. Créer (ou compléter) un fichier dans `assets/js/generators/`.
2. Appeler `DV.registry.register({...})` en respectant le contrat documenté en
   tête de `assets/js/core/registry.js`.
3. Ajouter la balise `<script>` dans les trois pages HTML.

Le catalogue, les menus déroulants, le moteur interactif et le constructeur de
fiche se mettent à jour tout seuls — il n'y a aucune liste à maintenir à la main.

### Le code de fiche

Chaque fiche porte un code court (ex. `K7M2QX`). Le même code régénère
exactement les mêmes exercices et le même corrigé : on peut réimprimer une
évaluation, distribuer le corrigé plus tard, ou donner deux sujets différents à
deux rangées d'élèves en changeant simplement le code.

### PDF

L'export passe par l'impression du navigateur (`Ctrl+P` → *Enregistrer au
format PDF*), pas par une bibliothèque JavaScript : c'est le seul moyen fiable
d'obtenir un texte arabe correctement ligaturé et écrit de droite à gauche. La
fiche reste sélectionnable, accessible et légère.

## Tests

```bash
node tools/selftest.js
```

Le test rejoue chaque générateur sur chaque niveau (300 tirages par
combinaison, ~10 000 exercices) et vérifie l'arithmétique exacte, le
déterminisme des graines, la validité et l'irréductibilité des réponses,
l'équilibrage du HTML produit, ainsi que la construction et la reproductibilité
des fiches.

## Historique

Ce dossier remplace `outils/Generateurs/generateur_erc/9eme/generateurs_pdf9`.
La correspondance ancien fichier → nouveau générateur est dans
[`docs/MIGRATION.md`](docs/MIGRATION.md). Les fichiers d'origine sont conservés
dans `legacy/` et ne sont plus référencés.
