# التمرين عدد 1 — سلاسل البرهان

Portage en page « chaîne de démonstration » de l'exercice 1 d'une fiche sur les
opérations dans ℝ. La méthode est décrite dans [`../METHODE.md`](../METHODE.md).

> **Dossier neuf, à une seule page pour l'instant.** La fiche dont vient cet
> exercice n'est pas celle des autres dossiers ; les exercices 2, 3… viendront
> ici quand ils arriveront. Si elle s'avère être la même fiche que
> [`../serie2/`](../serie2/), les deux dossiers fusionnent en une commande.

## Fidèle à l'original

Les nombres sont ceux de la fiche, à l'identique. Le bouton « أرقام جديدة » n'y
rebat que l'ordre des étapes. Le validateur, lui, vérifie exactement les mêmes
choses : chaque étape réanalysée et recalculée en arithmétique exacte, chaque
affirmation de l'énoncé contrôlée.

## Structure

| page | volets | questions de l'énoncé |
|---|---|---|
| `ex1.html` | 11 | 1) a · 1) b · 2) a×b · 2) signe de a · 3) (2+√3)² · 3) c · 4)أ · 4)ب · 5) E · 6) F · 6) G |

Tout l'exercice tient à un seul fait, acquis à la question 3 : `a × b = 4`. Les
sept questions qui suivent n'en sont que des lectures — `b = 4/a` donne `E`,
`b/4 = 1/a` donne `F = 0`, et `√(ab) = 2` donne `d² = 12` puis `G = 2`.

## Ce que cet exercice a demandé au noyau

La question 4 pose `d = √a - √b`. Or `√(8 - 2√15)` vaut **√5 - √3** : un radical
imbriqué, qui ne s'écrit pas sous la forme `r + s√15` avec `r` et `s`
rationnels — il vit dans ℚ[√3, √5].

Le noyau le trouve en résolvant `t² - p·t + q²d/4 = 0`, dont les deux racines
`t₁` et `t₂` sont rationnelles, puis en reprenant **la racine de chacune** au
lieu d'exiger qu'elle tombe juste. L'égalité est ensuite re-vérifiée exactement
avant que la racine soit rendue.

    √(8 - 2√15) = √5 - √3        √(7 + 4√3) = 2 + √3

## Vérification

    node verifier.js 300
    CONTRE_EXEMPLES=1 node verifier.js

État actuel :

    التمرين 1 ✓
    300 tirages, 3300 questions,
    20100 relations recalculées et 4800 contrôles, 0 erreur.
    14/14 falsifications détectées.

## Régénérer la page

    node _build.js .
