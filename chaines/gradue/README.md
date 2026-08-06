# بعد نقطتين من مستقيم مدرج (8 أساسي)

Chaînes de démonstration bâties sur la fiche *بعد نقطتين من مستقيم مدرج*
(riadhyet, 2018-2019). **8 exercices, 26 questions par tirage.**

Tout part d'une seule formule — `AB = |x_B − x_A|` — et tout le reste en
découle : le symétrique par rapport à O, le milieu, les deux solutions quand
seule la distance est connue.

## Ce que la fiche demande

| Ex. | Ce que l'élève doit faire |
|-----|---------------------------|
| 1 | deux distances à partir de trois abscisses données |
| 2 | trois distances, les points étant placés sur une figure |
| 3 | deux distances, puis **démontrer qu'un point est le milieu** |
| 4 | ranger des abscisses, **ranger les distances** (ce n'est pas le même ordre), puis une abscisse **non unique** |
| 5 | le symétrique par rapport à O, puis trois distances |
| 6 | symétrique, distance, et **deux points sous condition de signe** |
| 7 | distances à l'origine, puis distance entre deux points |
| 8 | deux distances, puis la démonstration du milieu |

## Ce que ce chapitre apporte de neuf

**Des figures générées.** La fiche est pleine de droites graduées ; sans elles
la moitié des exercices n'a plus de sens. Chaque figure est un **SVG construit
à partir des nombres tirés** — quand le générateur change les abscisses, le
dessin suit. Un SVG plutôt qu'une image : net à toute taille, trois lignes de
poids, et surtout il échappe au bidi.

Deux pièges de rendu, tous deux corrigés et vérifiés :

- sans `direction="ltr"` sur les `<text>`, un SVG dans une page RTL affiche
  `-3` en `3-`. L'élève lit alors une abscisse fausse ;
- deux points trop proches se chevauchent et la figure devient illisible. Le
  tirage impose un écart minimal entre les points, **et avec les repères O et
  I** qui sont dessinés eux aussi.

**Le piège de l'ordre.** Ranger `−18/5 ; −5/2 ; 9/4` puis ranger les distances
`OD ; OB ; OA` ne donne pas la même suite : la distance est une valeur
absolue. Le générateur veille à ce que les distances soient deux à deux
distinctes, sans quoi « ranger » n'aurait pas de réponse unique.

**La distance ne suffit pas.** `AM = 3` donne **deux** points ; c'est la
condition de signe qui tranche. Encore faut-il qu'elle tranche : le tirage
impose `d > |x_A|`, ce qui place les deux solutions de part et d'autre de O.
Sans cette contrainte, ou bien aucune des deux ne convient, ou bien les deux
conviennent — et l'énoncé est faux dans les deux cas. Et quand rien ne
tranche (`OP = 23`), donner **les deux réponses** fait partie de la réponse.

## Validation

```
node verifier.js 120
CONTRE_EXEMPLES=1 node verifier.js
```

Le validateur exécute les générateurs et re-démontre chaque affirmation : la
distance depuis `|x_B − x_A|`, le symétrique depuis l'opposé, le milieu depuis
les deux distances **et** la demi-somme **et** la position entre les
extrémités, l'ordre depuis un tri indépendant.

Surtout, **il relit la figure** : il retrouve dans le SVG le point dessiné
sous chaque étiquette, mesure son écart au repère O en unités `OI`, et le
compare à l'abscisse annoncée. Une figure fausse tromperait l'élève plus
sûrement qu'un calcul faux.

```
120 tirages par exercice, 3120 questions, 12343 relations recalculées,
11520 affirmations re-démontrées et 2160 figures confrontées aux nombres,
0 erreur.
7/7 falsifications détectées.
```

Les sept falsifications éprouvées : distance faussée, distance négative,
symétrique confondu avec le point, mauvaise racine retenue malgré la condition
de signe, milieu décalé, étape dupliquée, **point déplacé sur la figure**.

Trois défauts réels ont été trouvés par ce tirage massif, pas par relecture :
un groupe d'un seul élément écrit comme une comparaison, deux distances égales
rendant l'ordre ambigu, et une condition de signe qui ne tranchait pas.

## Fichiers

| Fichier | Rôle |
|---|---|
| `noyau.js` | rationnels exacts, analyseur (valeurs absolues, décimaux), rendu des fractions, registre |
| `droite.js` | le dessin de la droite graduée, en SVG |
| `outils.js` | les gestes de la leçon : distance, symétrique, point à distance donnée, milieu, ordre |
| `gens.js` | les huit exercices |
| `_build.js` | émet les pages en accordéon et l'index |
| `verifier.js` | validation par exécution, figures comprises, + contre-exemples |
