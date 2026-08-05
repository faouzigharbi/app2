# Le composeur de feuilles de révision

Une page qui **choisit** des exercices et les **met en page**. Elle ne calcule
rien : tout ce qu'elle imprime, quelqu'un l'a écrit avant elle.

L'élève coche ses rubriques, dit combien il en veut de chacune, et imprime.
« Imprimer → Enregistrer au format PDF » suffit : pas de serveur, pas
d'installation, pas de connexion.

```
revision/
  index.html            la machine — écran de choix, mise en page, impression
  exporter.js           fige les fiches engendrées en bibliothèques
  biblio-<fiche>.js     ENGENDRÉS. 22 fiches, 3 988 exercices
  biblio-geometrie.js   ÉCRIT À LA MAIN. C'est celui-ci qu'on remplit.
```

## Ce qu'il y a dedans

Vingt-deux chapitres, rangés par niveau, dépliables un à un. Les 192 rubriques
sont celles des fiches elles-mêmes : une page de chaîne, une rubrique.

Les corrigés ont ce qu'aucune bibliothèque écrite à la main n'aura : **ils
sortent des générateurs vérifiés**. Chaque relation y a été recalculée, et les
validateurs n'ont rien laissé passer.

## Pourquoi `.js` et non `.json`

Chrome interdit à une page ouverte par double-clic (`file://`) de charger un
fichier voisin : le `fetch` d'un `.json` échoue, et cela ressemble à une panne
alors que tout est correct. Un `.js` chargé par `<script src>` n'a pas ce
problème — il marche hors ligne, au double-clic, sans rien installer.

## Pourquoi la police n'est pas dans le `<head>`

Une feuille de style déclarée avant un `<script>` retarde son exécution
jusqu'à ce qu'elle réponde. Hors ligne — et cette page est faite pour l'être —
la requête vers Google met **treize secondes** à échouer, écran blanc compris.
Mesuré : 12 808 ms avec le lien dans le `<head>`, 274 ms sans. La police est
donc ajoutée par le script, une fois la page bâtie.

## Ajouter des exercices à la main

Ouvrir `biblio-geometrie.js` et écrire une accolade de plus. Le format est
décrit en tête du fichier. Ajouter une rubrique, c'est ajouter un exercice qui
la porte : l'écran de choix se met à jour tout seul, et les compteurs avec lui.

Le mathématique s'entoure de `<span dir="ltr">…</span>`, sinon il se retourne
dans la page arabe. Une figure est un `<svg>` posé tel quel dans l'énoncé.

## Réexporter les fiches

```
node exporter.js --tout          toutes les fiches, 20 exercices par rubrique
node exporter.js --tout 40       plus fourni
node exporter.js puiss9          une seule
```

L'exportateur tire dans chaque fiche jusqu'à ce qu'elle cesse de se renouveler,
dédoublonne, écrit `biblio-<fiche>.js`, puis **recoud la liste des `<script>`
dans `index.html`** entre les repères `<!-- BIBLIOS -->`. Rien à tenir à jour
à la main.

Les vingt-deux fiches ne se ressemblent pas — elles ont été écrites sur deux
ans et leur charpente a bougé. Le registre s'appelle `PROBLEMES` ici, `PREUVES`
là, `EXERCICES` ailleurs ; il vit dans `noyau.js`, ou dans `arith.js` ; il est
vide au chargement et se remplit ensuite. L'exportateur ne les réécrit pas : il
les relit, emprunte à chaque validateur l'ordre de chargement que sa fiche
s'impose, et prend ce qui répond.

## Ce que la machine promet, elle le tient

Si une rubrique ne contient pas assez d'exercices au niveau demandé, l'écran le
dit **avant** d'imprimer — nom de la rubrique et compte réel. Annoncer six
exercices et en servir cinq, ce serait mentir sur la feuille.

Les fiches qui ne déclarent pas de difficulté n'en ont pas : leurs exercices se
tirent à tous les niveaux. Seules les puissances distinguent سهل / متوسّط /
صعب, parce que leur catalogue le dit ; ailleurs on ne l'invente pas.

Le tirage se souvient de ce qu'il a servi : deux feuilles de suite ne se
ressemblent pas. Quand une case est épuisée, elle se rouvre — mieux vaut un
exercice déjà vu qu'une feuille trop courte.

## Mesuré

| | |
|---|---|
| écran utilisable | 253 ms |
| feuille produite | 101 ms |
| bibliothèques | 6,6 Mo, 23 fichiers |
