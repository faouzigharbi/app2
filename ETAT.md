# Devoirati — où en est la bibliothèque

*État au 6 août 2026. Branche `claude/chaine-demo-multi-question-1jv5r6`.*

Ce fichier est fait pour être lu **en premier**, par le maître comme par une
session neuve qui reprend le travail à froid.

---

## 1. Ce qu'on fabrique

Les feuilles d'exercices du maître — deux livres de révision pour le brevet,
plus une trentaine de fiches de 7ᵉ, 8ᵉ et 9ᵉ — deviennent des **pages web
génératives** : à chaque ouverture, les nombres changent, mais l'exercice reste
le même exercice.

Et la promesse est plus forte que « ça se génère » : **tout est recalculé**.
Aucune valeur n'est recopiée d'un corrigé. Un exercice faux ne passe pas.

---

## 2. Les règles, et elles ne se négocient pas

1. **L'exercice est ENTIER.** Jamais de troncature : ni dans les questions
   qu'on porte, ni dans ce que la page affiche, ni dans ce que la feuille
   imprime. Une page qui montre « استنتج x/y + y/x » sans dire ce qu'est `x`
   n'est pas un exercice, c'est un débris.
2. **L'énoncé vient de la feuille du maître.** Seul le raisonnement est
   engendré — et il est **recalculé** par un validateur qui ne relit rien.
3. **Une falsification qui refuse de mordre est le signal, pas le succès.**
   Quand un énoncé volontairement faussé passe le contrôle, c'est qu'on a visé
   à côté — et ça enseigne toujours quelque chose sur l'exercice.
4. **Tout exercice écarté est nommé, avec sa raison.** Rien ne disparaît en
   silence.
5. **Quand on trouve une erreur, on la CORRIGE** — c'est la consigne du maître.
   Si la correction est déterminée, la chaîne porte la valeur juste ; si
   plusieurs corrections referment l'exercice, on en retient une et l'on dit
   laquelle et pourquoi ; si aucune ne le referme, l'exercice reste
   « à arbitrer ». Et dans tous les cas **la version imprimée est rejouée par
   une falsification** — c'est ce qui fait de la correction un calcul et non
   une opinion.
6. **Aucun flottant dans une égalité.** Tout vit en arithmétique exacte.

---

## 3. Comment c'est bâti

```
chaines/            30 chapitres, chacun autonome
  brevet/             le livre de révision — le plus gros
    noyau.js            arithmétique exacte sur ℚ[√d] + le rendu des pages
    repere.js           géométrie analytique EXACTE du plan
    espace.js           la même en dimension 3
    entiers.js          BigInt : 3^5000, divisibilités, diviseurs
    stat.js             séries statistiques exactes
    denombrer.js        arbres de choix, par énumération exhaustive
    figure.js           LE DESSIN, déduit des faits
    seances.js          tous les exercices
    gens.js             une page par exercice
    verifier.js         le validateur + les falsifications
    exNN.html/.js       les pages engendrées
revision/           l'inventaire, l'exportateur, la feuille imprimable
  inventaire.js       ce qui est lu, porté, écarté — et les 22 coquilles
  exporter.js         fige les fiches en bibliothèques
  index.html          la feuille de révision : niveau → chapitre → rubrique → exercice
  biblio-*.js         les bibliothèques figées
  verif-page.js       ouvre la page dans un vrai navigateur
  verif-figures.js    compte les figures d'une page
  verif-entier.js     vérifie qu'un exercice s'imprime ENTIER
```

### Les pièces d'arithmétique

| pièce | ce qu'elle a débloqué |
|---|---|
| `noyau.js` | ℚ[√d] : `√32 − √8 = 2√2` se **démontre** |
| `repere.js` | les coordonnées — un énoncé de repère se fait contredire |
| `espace.js` | les solides : pyramides, prismes, parallélépipèdes |
| `entiers.js` | BigInt — `243^1001` débordait, `3^40` était faux |
| `stat.js` | la médiane par lecture du polygone, **sans interpolation** (hors programme) |
| `denombrer.js` | l'arbre de choix, **par énumération exhaustive** des 1000 nombres |
| `figure.js` | le dessin, déduit des faits vérifiés |

### Le principe de contrôle, qui vaut pour tout

Le validateur **ne relit jamais** ce que la chaîne affirme : il refait le calcul
par un autre chemin.

- une chaîne d'arbre de choix multiplie des branches → le validateur **parcourt
  les mille nombres** un par un ;
- une chaîne de géométrie invoque Thalès → le validateur **recalcule sur les
  coordonnées** ;
- une chaîne de divisibilité factorise → le validateur **divise en BigInt**.

Les deux chemins n'ont rien en commun. C'est ce qui donne au contrôle sa valeur.

---

## 4. Les chiffres

| | |
|---|---|
| chapitres validés | **30** |
| pages d'exercices | **286** |
| exercices dans la bibliothèque imprimable | **2 013** — 23,4 Mo, chargés un chapitre à la fois |
| questions tirées à chaque passage complet | **239 160** |
| relations recalculées | **6,5 millions** |
| falsifications, toutes détectées | **1 241** *(dont 868 pour le seul brevet)* |
| erreurs | **0** |
| coquilles trouvées dans les livres | **22** *(dont 5 reconduites telles quelles dans l'édition 2026)* |

Le dépouillement : 39 documents, 264 pages lues, 265 exercices recensés — dont
**178 portés**, 27 à faire, 8 hors machinerie, 2 à arbitrer.

---

## 5. Ce qui reste

### Bloqué sur le maître

- **le prisme** (2025 séance 3 ex 7, repris en 2026 séance 4 ex 7) — sa question
  5)أ équivaut exactement à « les diagonales du trapèze sont perpendiculaires »,
  et elle est fausse de peu ; `EH = √43/2` au lieu de `3√5/2` la rendrait vraie.
  Mais sa question 3 reste **vide** quelle que soit la donnée : `J`, projeté de
  `I`, est l'intersection des diagonales de la base, donc `(DJ) = (DB)` coupe
  `(BC)` en `B` et `BL = 0` ;
- **2026 séance 2 ex 5** — avec `A(1 ; 2)` il n'y a aucun parallélogramme, alors
  que `I(1 ; 0)` est bien le centre de gravité de `B`, `C`, `D` ;
- **la vieille clé OpenAI** dans l'historique git — morte (elle finissait par
  `UCkA`, elle n'est plus dans le compte), mais toujours lisible dans deux
  commits d'un dépôt public. Nettoyage à faire, purement cosmétique.

### À écrire

- **livre 2026, séance 1** : six exercices d'arithmétique, tous portables ;
- **livre 2026, séance 8** : treize pages **scannées**, à lire à l'image ;
- **`thales9`** : 13 exercices en attente, rien de bloqué ;
- **quatre manques de machinerie nommés** : une famille « erreurs » (QCM), un
  fait « coordonnées » dans `thales9`, les aires, les constructions ;
- **Pythagore** : 48 pages jamais ouvertes — le vrai chantier neuf.

---

## 6. Comment on s'en sert

```bash
# valider un chapitre — recalcule tout
cd chaines/brevet && node verifier.js

# rejouer les énoncés faussés : ils doivent TOUS être refusés
CONTRE_EXEMPLES=1 node verifier.js

# rebâtir les pages du chapitre
node _build.js

# figer les bibliothèques imprimables
cd revision && node exporter.js --tout

# OUVRIR la page dans un vrai navigateur — le contrôle qui manquait longtemps
node revision/verif-page.js    revision/index.html
node revision/verif-figures.js chaines/brevet/ex52.html
node revision/verif-entier.js  revision/index.html
```

`BUDGET` dans `revision/exporter.js` règle le poids : le budget se compte en
**questions par rubrique**, pas en exercices. À 20 → 15,5 Mo ; à 30 → 23,4 Mo.

---

## 7. Les trois fautes qui ont coûté le plus

Elles sont écrites ici parce qu'elles se reproduiront si on les oublie.

**Vérifier le vrai, jamais le lisible.** Le validateur recalculait un million de
relations pendant que la moitié des pages affichaient une ligne nue. On avait
une preuve de justesse et aucune preuve de lisibilité. D'où les trois `verif-*`
qui **ouvrent** la page.

**Supprimer à moitié.** En retirant deux réglages devenus inutiles, la ligne qui
les branchait est restée : `el('#niv')` valait `null`, le script mourait à cette
ligne, et toute la page devenait inerte. Une suppression à moitié faite est pire
qu'une suppression pas faite.

**Livrer sans ouvrir.** Les pages ne chargeaient pas `figure.js` : l'export Node
produisait 42 figures, l'écran n'en montrait aucune. Le travail existait sans
être visible.

---

## 8. Où vit le savoir

- `chaines/brevet/README.md` — le récit du chapitre : les 22 coquilles une par
  une, les pièces d'arithmétique, le plan des figures ;
- `revision/inventaire.js` — la carte d'identité du dépouillement : chaque
  exercice de chaque document, son sort et **pourquoi** ;
- les **messages de commit** — le raisonnement, pas seulement le diff.
