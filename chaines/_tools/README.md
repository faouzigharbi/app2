# Chapitre `nat` — أولوية العمليات في الأعداد الصحيحة الطبيعية

Chaînes de démonstration (type `chaine` : remettre les étapes dans l'ordre) sur la
priorité des opérations dans ℕ, d'après la fiche « الأعداد الصحيحة والعمليات عليها — 7 أساسي ».

**Contrainte respectée partout : aucun nombre négatif, aucune décimale.** Tous les
résultats intermédiaires et finaux sont des entiers naturels, et toutes les divisions
tombent juste.

## Progression

| Niveau | Compétence | Questions |
|---|---|---|
| `easy` | × et : prioritaires sur + et −, sans parenthèses | 5 |
| `medium` | plusieurs produits dans la même expression, gauche→droite | 5 |
| `hard` | parenthèses simples (dont le couple `(7+2)×3+5` / `7+2×3+5`) | 6 |
| `expert` | parenthèses imbriquées `8×[16−(8+4)]` | 5 |
| `extreme` | chaînes longues avec division `120−4×5−7×8+54:9` | 6 |

Chaque chaîne commence par une étape « نحدّد الأولوية » qui nomme la règle, puis
déroule les calculs et se termine par le résultat. Les calculs indépendants sont
regroupés dans une seule étape, pour que l'ordre attendu soit **unique** — sinon
l'élève serait pénalisé pour un ordre également valable.

## Outils

```bash
node _tools/build_nat.js .    # régénère les 5 paires .js/.html du chapitre
node _tools/verify_nat.js .   # valide le contenu (sortie non nulle si erreur)
```

`verify_nat.js` contrôle, pour chaque question :

1. l'expression de l'énoncé s'évalue bien selon la priorité des opérations ;
2. la valeur annoncée par la dernière étape correspond à ce calcul ;
3. **chaque égalité écrite dans les étapes** est exacte, prise isolément ;
4. aucun résultat intermédiaire négatif, aucune division non exacte ;
5. aucune étape dupliquée (l'ordre correct doit être unique).

Dernier passage : 27 questions, 0 erreur.

## Ajouter des exercices

Tout le contenu est dans la table `DATA` de `build_nat.js`, une entrée par question :

```js
{ nom: 'G', expr: '24 + 6 × 3',
  steps: [
    ['نحدّد الأولوية', 'الضرب قبل الجمع'],
    ['ننجز الضرب', '6 × 3 = 18'],
    ['نعوّض', '24 + 18'],
    ['النتيجة', '= 42']
  ],
  hint: 'ابدأ دائما بالضرب قبل الجمع' }
```

Le libellé arabe reste dans le flux RTL ; la partie mathématique est isolée
automatiquement en `dir="ltr"` et rendue insécable. Plusieurs égalités dans une même
étape se séparent par ` و ` : le générateur les enveloppe une par une.

Relancer `build_nat.js` puis `verify_nat.js` après toute modification.
