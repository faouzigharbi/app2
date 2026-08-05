# Le composeur de feuilles de révision

Une page qui **choisit** des exercices et les **met en page**. Elle ne calcule
rien : tout ce qu'elle imprime, quelqu'un l'a écrit avant elle.

L'élève coche ses rubriques, dit combien il en veut de chacune, et imprime.
« Imprimer → Enregistrer au format PDF » suffit : pas de serveur, pas
d'installation, pas de connexion.

```
revision/
  index.html            la machine — écran de choix, mise en page, impression
  biblio-puiss9.js      ENGENDRÉ. 819 exercices tirés de la fiche « القوى »
  biblio-geometrie.js   ÉCRIT À LA MAIN. C'est celui-ci qu'on remplit.
  exporter.js           fige une fiche engendrée en bibliothèque
```

## Pourquoi `.js` et non `.json`

Chrome interdit à une page ouverte par double-clic (`file://`) de charger un
fichier voisin : le `fetch` d'un `.json` échoue, et cela ressemble à une panne
alors que tout est correct. Un `.js` chargé par `<script src>` n'a pas ce
problème — il marche hors ligne, au double-clic, sans rien installer.

## Ajouter des exercices

Ouvrir `biblio-geometrie.js` et écrire une accolade de plus. Le format est
décrit en tête du fichier. Ajouter une rubrique, c'est ajouter un exercice qui
la porte : l'écran de choix se met à jour tout seul, et le compteur avec lui.

Le mathématique s'entoure de `<span dir="ltr">…</span>`, sinon il se retourne
dans la page arabe. Une figure est un `<svg>` posé tel quel dans l'énoncé.

## Ajouter un chapitre déjà engendré

```
node exporter.js <dossier> "<nom arabe>" <niveau> [par-case]
node exporter.js puiss9 "القوى" 9
```

L'exportateur tire dans la fiche jusqu'à ce qu'elle cesse de se renouveler,
dédoublonne, et écrit `biblio-<dossier>.js`. Il reste à ajouter la ligne
`<script src="biblio-<dossier>.js">` dans `index.html`.

Ce que ces exercices ont et qu'une bibliothèque écrite à la main n'aura
jamais : **leurs corrigés sortent du générateur vérifié**. Chaque relation y a
été recalculée, et le validateur n'a rien laissé passer.

## Ce que la machine promet, elle le tient

Si une rubrique ne contient pas assez d'exercices au niveau demandé, l'écran
le dit **avant** d'imprimer — nom de la rubrique et compte réel. Annoncer six
exercices et en servir cinq, ce serait mentir sur la feuille.

Le tirage se souvient de ce qu'il a servi : deux feuilles de suite ne se
ressemblent pas. Quand une case est épuisée, elle se rouvre — mieux vaut un
exercice déjà vu qu'une feuille trop courte.
