# سلاسل البرهان — التفكيك إلى عوامل أوّلية

Quatre chaînes de démonstration générées, d'après les quatre `demo_chain_*.html`.
Les nombres changent à chaque tirage ; la chaîne est reconstruite avec eux.

Ouvrir `index.html`.

| Page | Preuve | Étapes |
|---|---|---|
| `preuve1` | un nombre est un **carré parfait**, et son racine carrée | 6 |
| `preuve2` | un nombre est le **cube** d'un entier naturel | 6 |
| `preuve3` | un nombre est **multiple** d'un autre, et le quotient euclidien | 6 |
| `preuve4` | le **produit** de deux nombres est un carré parfait | 9 |

Chaque page propose 4 énoncés tirés au hasard.

## Corrections apportées aux fichiers d'origine

| Origine | Problème | Correction |
|---|---|---|
| `demo_chain_algebraic_square` | **entièrement codé en dur** : `p1, p2, k1, k2` sont tirés puis jamais utilisés, `a_expr` est calculée et jamais lue. Le bouton « nouveaux nombres » ne changeait rien | tout est construit à partir des tirages ; 36 énoncés distincts |
| `demo_chain_cube` | `exp1 = exp2 = 1` et `p2` toujours égal à 5 : **deux énoncés possibles en tout** (1000 et 3375) | exposants et premiers tirés, 17 énoncés distincts |
| `demo_chain_algebraic_square` | la chaîne partait de la factorisation puis revenait au calcul numérique (`… = 7²×5×(5−4) = 25×49 − 20×49 = …`) : l'ordre du raisonnement était inversé | on met en facteur puis on conclut, dans cet ordre |
| tous | `{{ }}` — accolades doubles héritées d'un f-string Python — laissaient passer `$${N}$$` à l'intérieur d'un `$…$`, donc des délimiteurs mathématiques mal appariés | plus de LaTeX ; puissances en `<sup>` |
| tous | MathJax chargé depuis un CDN : injoignable hors ligne, et absent du reste de la bibliothèque | rendu direct, aucune dépendance réseau |
| `demo_chain_divisibility` | `b = 10` n'est pas premier, alors que l'énoncé parlait de « عوامل أوّلية » | bases tirées parmi 2, 3, 5, 7 — l'énoncé redevient exact |

## La méthode

La règle vaut ici aussi : **on met en facteur, on ne développe jamais.**

```
a = 3² × 2² − 3² × 2
  = 3² × (2² − 2)        ← facteur commun 3², la parenthèse reste
  = 3² × 2
```

Et la preuve du carré parfait passe par les exposants, pas par une racine
calculée à la machine :

```
2⁶ × 2² × 3⁴ = (3² × 2 × 2³)²      ← tous les exposants sont pairs
             = 144²
√(a × b) = 144
```

## Vérification

```bash
node verifier.js 400
```

Le validateur tire chaque preuve des centaines de fois et contrôle, sur
**chaque** instance :

1. chaque étape qui est une égalité de deux expressions calculables est exacte,
   puissances comprises ;
2. la dernière étape annonce bien le résultat de la démonstration ;
3. au moins deux étapes sont réellement vérifiables — une chaîne entièrement
   rédigée en prose passerait sinon sans aucun contrôle ;
4. **l'affirmation prouvée est vraie** : le carré est bien un carré, le cube
   bien un cube, le multiple bien un multiple, et le produit `a × b` bien un
   carré parfait dont la racine est celle annoncée ;
5. aucune étape dupliquée, et chaque expression isolée en `dir="ltr"`.

Il compte aussi les énoncés distincts, ce qui a révélé la pauvreté du
générateur de cubes d'origine.

Dernier passage : **3 200 instances tirées, 20 800 contrôles, 0 erreur**, et
les 4 pages ouvertes dans Chromium sans erreur JS.

Le cube reste le moins varié (17 énoncés) : un cube grandit vite, et au-delà
de 60³ les nombres cessent d'être lisibles pour une 7ᵉ année.

## Fichiers

```
index.html          sommaire
moteur.js           copié depuis ../serie1 à chaque build — une seule implémentation
generateurs.js      les 4 preuves + le rendu
preuve1.js … preuve4.js
preuve1.html … preuve4.html
style.css
verifier.js         validation (Node)
_build.js           régénère les pages
```
