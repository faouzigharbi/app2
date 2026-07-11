# Brancher un exercice à la plateforme

Chaque exercice `.html` reste **autonome** : ouvert seul, il fonctionne comme
avant. Branché à la plateforme, il envoie le résultat de l'élève connecté →
XP, niveau, série et badges se mettent à jour, avec une petite animation.

## Les 2 ajouts (non destructifs)

### 1. Inclure le connecteur — juste avant `</body>`
```html
<script src="app/assets/devoirati-exercice.js"></script>
```
> Adapter le chemin selon l'emplacement du fichier : depuis la **racine** du
> site c'est `app/assets/devoirati-exercice.js` ; depuis un sous-dossier,
> ajuster (`../app/assets/...`).

### 2. Envoyer le résultat — là où l'exercice conclut (bonne réponse, fin de série…)
```js
if (window.Devoirati) {
  Devoirati.enregistrer({
    chapitre_id: 'fraction-simplification',   // identifiant stable de l'exercice
    theme: 'fractions',                       // 'fractions' | 'puissances'
    activite_nom: 'Simplification de fractions',
    score: 1, total: 1,                       // ex. 1 bonne réponse sur 1
    duree_secondes: 0                          // facultatif
  });
}
```

C'est tout. Si l'élève n'est pas connecté (ou page ouverte en local), l'appel
est **ignoré silencieusement** — l'exercice n'est pas perturbé.

## Exemple déjà branché

`fraction-simplification-exercise.html` sert de démonstration : à chaque bonne
réponse, il appelle `Devoirati.enregistrer(...)`. À reproduire sur les autres
exercices au fur et à mesure.

## Codes de thème / chapitre (rappel)

- Toujours des **codes latins** (`fractions`, `puissances`, `division_fractions`).
- Jamais d'arabe dans ces valeurs : la traduction se fait à l'affichage
  (`backend/labels.php`).

## Champs acceptés par `Devoirati.enregistrer`

| Champ | Requis | Exemple |
|---|---|---|
| `chapitre_id` | oui | `'fraction-simplification'` |
| `theme` | conseillé | `'fractions'` |
| `activite_nom` | conseillé | `'Simplification de fractions'` |
| `score` | oui | `8` |
| `total` | oui | `10` |
| `duree_secondes` | non | `120` |
| `erreurs` | non | texte/JSON |
