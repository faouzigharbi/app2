# جمع و طرح الأعداد الصحيحة النسبية (8 أساسي)

Chaînes de démonstration bâties sur la fiche de la *المدرسة الإعدادية النموذجية
ضفاف البحيرة* (2023). **16 exercices portés, 72 questions par tirage.**

Même chapitre que la fiche en ℚ (dossier `sommeq`), mais sur les **entiers** —
et surtout beaucoup plus d'équations : six exercices n'en contiennent pas
autre chose.

## Ce que la fiche demande

| Ex. | Ce que l'élève doit faire |
|-----|---------------------------|
| 1 | réduire cinq expressions, dont une où **tout s'annule** — variables comprises |
| 2 | réduire F, l'évaluer, puis remonter à x |
| 3 | six équations, dont plusieurs à valeur absolue |
| 4 | une expression à **trois inconnues** qui survivent toutes |
| 5 | P et Q, puis deux comparaisons sous hypothèse |
| 6 et 16 | `A = y − x + k` : montrer, chercher y − x, évaluer |
| 7 | une expression à **coefficient 2** (`x − 2y`), puis quatre équations |
| 8 | quatre équations |
| 9 | E et F sous `a + b` donné, puis des équations |
| 11 | un groupe écrit deux fois **s'élimine**, puis `b + \|−G\| + c` |
| 12 | valeurs absolues empilées, puis une expression en x, y, z |
| 13, 14, 15 | trois batteries d'équations, dont huit en `\|x\|` |
| 17 | quatre comparaisons, toutes par le signe de la différence |

Non portés, et pourquoi : les exercices **10 et 18** reprennent exactement les
familles de la fiche en ℚ (`sommeq`, exercices 18 et 15) sur des fractions —
les refaire ici serait un doublon ; l'exercice **19** est tronqué dans le
document source (« Erreur ! Signet non défini »).

## Deux moteurs, l'un neuf

**Les équations.** Deux familles seulement — linéaire en `x`, linéaire en
`|x|` — mais sept habillages : `a − x = c`, `a − (x + b) = c`, `a − (b − x) = c`,
`a + [b − x] = c`… Chaque habillage sait s'écrire, se dépouiller, et donner sa
réponse ; la famille en `|x|` ajoute l'examen du signe.

Ce n'est pas la même équation déguisée : `|x| = k` n'a de solution que si
k ≥ 0, et **la fiche multiplie exprès les cas impossibles** (`|x| + 4 = −3`,
`|x| + 7 = −6`…). Le générateur en place au moins un par batterie. Un élève
qui applique la recette sans regarder le signe tombe à chaque fois.

**Trois inconnues.** L'exercice 4 est le seul de la fiche où trois inconnues
survivent à la réduction ; les formes réduites acceptent donc désormais un
troisième terme. Ailleurs (exercices 1-D et 12), la troisième inconnue figure
dans l'énoncé mais **disparaît en chemin** — et le voir est tout l'exercice.

## Validation

```
node verifier.js 200
CONTRE_EXEMPLES=1 node verifier.js
```

Le validateur exécute les générateurs et re-démontre chaque affirmation.
Deux mécanismes ont dû être repris pour cette fiche :

- **`|x|` se re-dérive maintenant en tenant compte de son coefficient.** Dans
  `7 − |x| = −1`, le coefficient vaut −1 : la re-dérivation naïve donnait −8 au
  lieu de 8, et déclarait impossible une équation qui a deux solutions. On
  évalue le membre de gauche en `|x| = 0` puis `|x| = 1`, ce qui donne la
  fonction affine, donc la valeur exacte de `|x|` ;
- chaque équation gagne une étape de calcul explicite, sans quoi les
  habillages les plus courts donnaient des chaînes de deux maillons.

```
200 tirages par exercice, 14400 questions,
838227 relations recalculées et 172000 affirmations re-démontrées, 0 erreur.
7/7 falsifications détectées.
```

Trois défauts réels trouvés par le tirage, pas par relecture : le coefficient
de `|x|` ci-dessus, une constante fausse dans la réduction de l'exercice 7
(`−p − q` au lieu de `−p + q`), et un seuil de comparaison qui pouvait tomber
sur la valeur comparée — « comparer » deux nombres égaux n'a pas de conclusion
en `<` ou `>`.

## Fichiers

| Fichier | Rôle |
|---|---|
| `noyau.js` | rationnels exacts, analyseur (valeurs absolues, décimaux), rendu, registre |
| `formes.js` | les motifs de parenthèses de cette fiche, et leur réduction |
| `questions.js` | les sous-questions communes (montrer, calculer, chercher, comparer) |
| `equations.js` | les sept habillages d'équations, en `x` et en `\|x\|` |
| `gens.js` | les seize exercices |
| `_build.js` | émet les pages en accordéon et l'index |
| `verifier.js` | validation par exécution + contre-exemples |
