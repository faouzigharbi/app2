# Méthode — les pages « chaîne de démonstration »

Cette note décrit la méthode telle qu'elle est appliquée dans `chaines/`. Elle a
été reconstituée à partir du portage de référence `expressions littérales — 7
أساسي` ; le dossier `chaines/reels/` en est la seconde application.

---

## 1. Ce qu'est une chaîne de démonstration

L'élève ne rédige pas la démonstration : il la **remet dans l'ordre**. Les
étapes lui sont données en vrac dans une colonne « المراحل (غير مرتبة) », il les
déplace (clic ou glisser) vers la colonne « ترتيبك », puis il valide.

C'est un exercice de *raisonnement*, pas de calcul. Il n'y a rien à saisir au
clavier, donc rien à rejeter pour une virgule ou un espace, et l'élève qui sait
faire mais écrit mal n'est pas puni. Ce qui est évalué est le seul point qui
compte : est-ce qu'il sait dans quel ordre les gestes s'enchaînent.

Le retour d'erreur dit **combien** de maillons sont bien placés et **où** se
trouve le premier faux. « Faux » tout court n'apprend rien ; « 4/6 en place, le
premier écart est au rang 3 » dit où reprendre.

## 2. Une page par exercice, un volet par question

> Une page = un exercice entier de la fiche.
> Dans la page, **autant de volets que l'énoncé a de questions** — pas un de
> plus, pas un de moins.

Chaque volet est un `<details>` autonome : son énoncé, sa chaîne, ses boutons
« تحقق / التصحيح / مساعدة / إعادة », son propre état. Rater la question 1
n'empêche pas de traiter la 2. L'en-tête de page compte les volets réussis.

Les sous-questions comptent comme des questions : un énoncé numéroté
« 1, 2)أ, 2)ب, 3 » donne **quatre** volets, parce que chacune a sa propre
démonstration donc sa propre chaîne.

Le **tirage est commun à toute la page**, parce que l'exercice l'est : le `B` de
la question 3 doit être le `B` de la question 2.

Et **l'ordre des volets est celui de l'énoncé**. Attention au piège de la fiche
arabe : quand elle pose plusieurs expressions côte à côte sur une même ligne,
cette ligne se lit de droite à gauche. Recopiée de gauche à droite, elle sort à
l'envers — `a, b, c, d` devient `d, c, b, a`, et l'élève ne retrouve plus ses
questions. Le signe qui trahit la faute est une suite de noms qui *descend*
(`E, D, C`, `M, L, K`) : aucune fiche ne nomme ses expressions à rebours.

## 3. Génératif, mais jamais au hasard

Les nombres changent à chaque chargement (bouton « أرقام جديدة »). La fiche
papier ne montre qu'un exemplaire de chaque exercice ; la page en montre autant
qu'on veut, sous la même méthode.

Mais on ne tire que ce que l'exercice **supporte**, et la structure de l'énoncé
ne bouge jamais. Trois cas se présentent :

* **Exercice libre** — n'importe quel tirage marche. On tire (ex. 17 : « 26/5 »
  n'est que « 5 + 1/5 », tout entier ferait l'affaire).
* **Exercice contraint** — le résultat repose sur une identité. On tire dans
  l'ensemble des solutions de cette identité, jamais en dehors (ex. 18 : il faut
  `u² - r v² = 1`, l'équation de Pell — sinon « A مقلوب B » est faux).
* **Exercice rigide** — les nombres sont imposés par les questions elles-mêmes.
  On ne touche alors qu'à l'**habillage** : les écritures en radicaux que
  l'élève doit réduire pour retomber sur les mêmes nombres (ex. 19).

Et un quatrième cas, qui n'est pas une contrainte mathématique mais une
demande : **la fidélité**. Quand la fiche est celle d'un professeur précis pour
ses élèves, on reprend ses nombres à l'identique et l'on ne tire rien — le
bouton « أرقام جديدة » ne rebat alors que l'ordre des étapes. Le validateur,
lui, ne perd rien : il vérifie exactement les mêmes choses (`chaines/revision2/`).

Quand un tirage produirait un énoncé illisible (radicande à quatre chiffres,
coefficient 1 écrit « 1√2 », deux étapes identiques), on le rejette et on
retire — d'où les boucles `for (…) { … continue }` des générateurs.

## 4. Structure d'une question

Le générateur d'un exercice rend le **tableau de ses questions**, chacune de la
forme :

```js
{
  enonce: ['…', '…'],           // lignes de l'énoncé ; rendues chacune à la ligne
  indice: '…',                  // le bouton « مساعدة »
  etapes: [['libellé', 'math'], …],   // LA CHAÎNE, dans l'ordre attendu
  controle: { … }               // de quoi permettre au validateur de tout recalculer
}
```

Une étape doit être le geste **qu'on enseigne**, pas seulement un geste vrai.
Sur les encadrements, par exemple : **on ne multiplie jamais les termes d'un
encadrement par une variable.** Pour encadrer `xy` avec `−3 ≤ x ≤ −2` et
`2 ≤ y ≤ 4`, on ne multiplie pas le premier encadrement par `y` ; on rend les
deux encadrements positifs (`2 ≤ −x ≤ 3`), on les multiplie **l'un par
l'autre** (`4 ≤ (−x)y ≤ 12`), puis on revient (`−12 ≤ xy ≤ −4`). Le raccourci
donne le même résultat et reste vrai — le validateur ne verrait rien — mais il
enseigne un geste faux, qui tombera dès que le signe de la variable ne sera
plus connu.

Règles de composition des étapes :

* une étape = **un geste**, et un seul ;
* une étape porte une **relation vérifiable** (`√32 = √(16 × 2) = 4√2`), sauf
  les étapes de cadrage rédigées en arabe (« شرط الوجود : … ») ;
* jamais deux étapes identiques — l'élève ne pourrait pas les départager, et le
  contrôle d'ordre deviendrait ambigu. **Et pas davantage deux étapes portant la
  même relation sous des libellés différents** : « نحلّ : x = 3 » puis
  « النتيجة : x = 3 » sont deux cartes que rien ne distingue mathématiquement.
  La faute est facile à commettre quand l'avant-dernière étape tombe déjà sur le
  résultat ; le validateur la refuse désormais ;
* au moins quatre étapes, dont deux vérifiables.

## 5. Le rendu : l'arabe coule à droite, les mathématiques à gauche

La page est en `dir="rtl"`. Toute expression laissée nue s'y affiche à l'envers.
Chaque morceau mathématique est donc isolé dans un `<span dir="ltr">` — **y
compris dans les libellés d'étapes et dans les indices**, qui citent souvent des
mathématiques. Sans cela, « نطرح فيتلاشى √10 » ressort en « 10√ ».

Une expression ne se coupe pas en fin de ligne (`white-space: nowrap`) : coupée,
ses termes seraient réordonnés par l'algorithme bidi. Trop longue, elle défile
dans son cadre (`overflow-x: auto`).

Les fractions s'empilent sur une barre horizontale, et le radical porte la barre
qui court au-dessus de son radicande. Cette barre n'est pas un ornement : c'est
elle qui dit où le radical s'arrête. `√2(2√2 + 1)` et `√(2(2√2 + 1))` ne sont
pas le même nombre.

## 6. La feuille imprimable, en deux parties

Chaque page porte son bouton « ورقة للطباعة ». La feuille sort en deux parties
séparées par un saut de page :

* **ورقة التلميذ** — les étapes dans le désordre, avec une case à numéroter ;
* **ورقة الوليّ** — les mêmes étapes dans l'ordre.

Le parent peut donc corriger **sans savoir refaire l'exercice**. C'est l'objet
de la coupure, et la raison pour laquelle la partie élève reprend exactement le
désordre affiché à l'écran.

## 7. Le validateur

    node verifier.js 200          # 200 tirages par exercice
    CONTRE_EXEMPLES=1 node verifier.js

Le validateur **n'inspecte pas le code : il exécute les générateurs**, réanalyse
chaque étape avec son propre analyseur et la recalcule en arithmétique exacte.
Il contrôle trois choses :

1. **chaque étape** de chaque chaîne est une relation vraie — une étape fausse
   est un mensonge qu'on demanderait à l'élève de ranger au bon endroit ;
2. **chaque ligne d'énoncé** est analysable, et vérifiée quand elle pose une
   égalité (`C = |A| - |B|`) ;
3. **chaque affirmation** de l'exercice (les `claims`). Une identité sur des
   lettres n'est pas testée sur une valeur mais sur des dizaines de tirages :
   une égalité qui ne tiendrait que pour le nombre choisi par le générateur ne
   serait pas une identité.

Le mode `CONTRE_EXEMPLES` **abîme volontairement des exercices justes** (une
racine décalée, un radical oublié, un facteur amputé, une étape dupliquée). Si
le validateur les acceptait, c'est lui qui serait faux. Toute falsification doit
être rejetée.

L'arithmétique du validateur doit être **exacte**, jamais approchée. Sur une
fiche de radicaux, un contrôle à 10⁻⁹ près laisserait passer un exercice faux.

Une affirmation qui ne porte pas sur *un* nombre se contrôle sur *un domaine*.
Un encadrement — « −7/2 ≤ A ≤ 1/10 pour x ∈ [−1/2 ; 3/2] » — vérifié sur la
seule valeur choisie par le générateur ne prouve rien : le validateur tire donc
des dizaines de x **dans** le domaine, bornes atteintes comprises, et exige que
l'encadrement tienne sur tous. De même, quand l'énoncé demande d'écrire un
ensemble en intervalle, on balaie des rationnels **des deux côtés de chaque
frontière** et l'on exige que « x vérifie la condition » et « x est dans
l'intervalle annoncé » soient vraies exactement ensemble : c'est le seul
contrôle qui voie un crochet retourné (`chaines/encadrement/`).

## 8. Fichiers d'un dossier

| fichier | rôle |
|---|---|
| `noyau.js` | arithmétique exacte, analyseur, rendu, registre des exercices |
| `<fiche>.js` | un générateur par exercice de la fiche |
| `gens.js` | déclare les pages : numéro, titre, générateur, nombre de questions |
| `exNN.js` | trois lignes — le tirage initial de la page NN |
| `exNN.html` | la page, engendrée par `_build.js` |
| `index.html` | le sommaire |
| `style.css` | style commun |
| `verifier.js` | le validateur |
| `_build.js` | `node _build.js .` régénère toutes les pages et l'index |

Les pages `exNN.html` sont **engendrées**, jamais éditées à la main : c'est ce
qui garantit qu'elles se comportent toutes pareil. Une modification de la page
se fait dans `_build.js`, suivie de `node _build.js .`.

**Un dossier par fiche, et il est autonome.** Deux fiches différentes numérotent
souvent les mêmes exercices — il y a un « exercice 11 » dans presque chacune.
Elles ne peuvent donc pas cohabiter dans un même dossier : le second `ex11.html`
écraserait le premier. Chaque fiche emporte sa copie de `noyau.js`, `style.css`,
`_build.js` et `verifier.js`, ce qui la rend déposable telle quelle. La
contrepartie est qu'une correction du noyau doit être reportée dans chaque
dossier — un `diff` entre deux `noyau.js` le dit en une seconde.

Cette autonomie a un second usage : elle laisse une fiche **étendre** son noyau
sans toucher aux autres. Celui de `encadrement/` porte une couche d'intervalles
(bornes exactes, crochets, ∩, ∪, appartenance, tirage dans un intervalle) dont
aucune autre fiche n'a l'emploi — et les quatre autres n'en portent pas une
ligne.

## 9. Les pages « أين الخطأ؟ » — le miroir de la chaîne

Une seconde famille de pages, bâtie sur les mêmes exercices et le même noyau.

> Dans la **chaîne**, les étapes sont justes et en désordre : l'élève
> **reconstruit** le raisonnement.
> Dans la page **erreurs**, elles sont dans l'ordre et l'une d'elles est
> fausse : l'élève **juge** le raisonnement.

C'est le geste du correcteur, et c'est celui qui manque le plus : on sait
appliquer une règle bien avant de savoir repérer qu'elle a été mal appliquée.

Deux niveaux : **متوسّط** (une étape fausse) et **متقدّم** (deux). Comme chaque
étape d'une chaîne est une relation vraie *en elle-même* et non une ligne de
calcul qui hérite de la précédente, deux fautes ne peuvent pas se masquer l'une
l'autre — la structure des chaînes offre la garantie sans qu'on ait à la
construire.

L'élève clique l'étape qu'il condamne, puis choisit la bonne réécriture parmi
deux ou trois. **Rien à taper**, comme dans la chaîne.

### On choisit la FAUTE, pas l'étape

Le premier jet tirait une étape au hasard, puis prenait la meilleure famille
applicable *sur cette étape*. Une étape où seule la famille générique mordait
l'emportait donc sur une étape où une faute conceptuelle était possible — et la
page se remplissait de coquilles. On énumère maintenant **tous les couples
(étape, famille) de la chaîne entière**, et l'on prend le meilleur, où qu'il
soit. La faute d'inattention ne sert plus que de dernier recours, et jamais deux
fois dans la même question.

### Aucune faute de calcul

C'est la règle, et elle est absolue. Un chiffre changé, un signe recopié de
travers, une addition ratée : l'élève qui les trouve n'a rien appris, et celui
qui les manque n'a rien à réviser. Il aurait appris à **relire**, quand on veut
lui apprendre à **raisonner**.

Chaque famille est donc une faute de *compréhension*, prise dans ce que le
chapitre enseigne. La première du catalogue de 7ème est celle que le professeur
voit le plus souvent :

    5a + 10b + 15 = 5(a + 2b + 15)

l'élève croit que le terme constant échappe à la factorisation. Il a divisé
`5a` et `10b` par 5, et laissé `15` intact.

### Jamais deux fois la même faute à la suite

Deux volets de suite sur la même règle et l'élève cesse de juger : il applique.
L'interdit est donc **dur** — la famille du volet précédent est écartée —, et
si la question n'offre rien d'autre, **on n'y met aucune faute** plutôt que de
répéter. Mieux vaut un volet qui fait réfléchir qu'un volet qui fait appliquer.
Sur `expr7` : zéro répétition consécutive sur 264 enchaînements.

### Quand aucune faute n'est possible, on n'en invente pas

Certains volets — une évaluation numérique, une chaîne de trois calculs — ne
portent aucune faute de raisonnement. On y laisse alors **le corrigé juste**, et
l'élève doit le dire (« لا خطأ في هذا الحلّ »). C'est même le meilleur usage
qu'on puisse en faire : tant qu'une page promet une faute, l'élève cherche la
faute ; il ne *juge* que s'il peut répondre « ce corrigé est bon ». La page
n'annonce donc jamais combien de fautes elle contient.

### Des familles, pas du bruit

Une faute n'a de valeur que si c'est celle qu'un élève commet. D'où un
catalogue de familles **nommées** — الترتيب لم ينقلب, القوس مقلوب, القيمة
المطلقة رُفعت دون تغيير الإشارة, التقاطع مكان الاتّحاد, حدّ ضائع في المتطابقة,
إشارة مقلوبة في حدّ. Le retour ne dit pas « faux », il dit *quelle* faute. La
page n'enseigne pas une correction, elle enseigne une famille de fautes.

Une famille peut exiger le **geste** qui la produit : renverser un encadrement
n'est la faute de la leçon que là où l'on multiplie, divise ou inverse.
Ailleurs, ce ne serait qu'une coquille — et l'élève apprendrait à chercher des
coquilles.

Une faute doit aussi rester **crédible** : pas de coefficient « 1x », pas de
fraction non réduite « 4/2 », pas de « x x », pas de membre identique à son
voisin. Aucune copie ne porte ces écritures-là — et une faute qui se repère à
sa laideur plutôt qu'à son erreur n'apprend rien.

Le même souci gouverne le détail de chaque famille. Un signe ne se retourne par
erreur que s'il y avait une **soustraction à mal manier**, et sur une expression
littérale : sur « 1/3 + 3/4 », écrire « − » est une faute de copie, pas de
raisonnement. La distributivité partielle ne s'écrit que si le premier terme du
crochet est **nu** : « 5/2(x + 3/2) » donne « 5/2 x + 3/2 », qu'un élève écrit
vraiment ; « 2/3(3/5 a + …) » donnerait « 2/3 3/5 a », que personne n'écrit. Et
sur une somme de fractions, l'élève n'efface pas la somme : il en écrit le
mauvais **résultat**, « 3/7 + 10/3 = 13/10 ».

### Le catalogue est écrit fiche par fiche

Une famille n'est pas devinée : elle est écrite après avoir lu le **vocabulaire
réel des étapes** de la fiche — les quelques centaines de libellés et de
relations que ses générateurs produisent. Les familles d'intervalles n'ont rien
à faire en 7ème, et « جمع البسطين و المقامين » rien à faire sur une fiche de
radicaux.

Cela reste une généralisation : la famille, une fois écrite, s'applique seule à
toute étape qui s'y prête. C'est ce qui permet de couvrir cent volets ; ce n'est
pas ce qui permet de rendre *une* faute précise sur *une* question précise. Pour
cela, on la déclare à la main dans `MAIN`, et elle l'emporte sur le catalogue —
le validateur la contrôle comme les autres. C'est là que viennent se poser les
fautes vues dans les copies.

### Ce que le validateur contrôle

    ERREURS=1 node verifier.js 25

1. chaque étape **plantée** est fausse — sinon on demande à l'élève de
   condamner du vrai ;
2. chaque étape **non plantée** est vraie — sinon la page porte une faute
   qu'elle ignore, et l'élève qui la trouve est compté en échec ;
3. le nombre de fautes est celui du niveau demandé ;
4. dans la phase « corrige », la bonne réécriture est vraie et **chaque leurre
   est faux**.

Le juge est **le même** des deux côtés : la page évalue ses fautes, dans le
navigateur, avec la fonction qu'emploie le validateur. Et l'échantillon sur
lequel il juge est **déterministe** — même intervalle, même taille, mêmes
points. Sans cela une faute pourrait être fausse pour le validateur et vraie
pour la page, et l'élève aurait raison de contester.

### Deux commandes pour les vingt fiches

    sh _regles/rejouer.sh            # rejoue tout le portage
    sh _regles/rejouer.sh radic9     # ou une seule fiche
    sh _regles/valider.sh 20         # chaînes ET pages d'erreurs, toutes

`rejouer.sh` garde, pour chaque fiche, **avec quels arguments elle a été
portée** : son noyau, le nom que son validateur lui donne, ses modules, son
badge, et la liste des règles du programme que son chapitre met en jeu. Sans
ce fichier, la source unique des règles restait une intention : on ne peut pas
rejouer ce qu'on ne sait plus reconstituer. Une règle corrigée dans
`_regles/catalogue.js` se retrouve donc partout d'une seule commande, et
`valider.sh` dit aussitôt si quelque chose a bougé.

### Un leurre garde le premier membre

Dans la phase « corrige », les trois options se lisent **côte à côte**, comme
trois réécritures d'une même ligne. Celle qui change le membre donné ne réécrit
plus rien : elle change la question. On a proposé « √10 = 5 » pour corriger
« √5 × √5 = 5 » — l'élève n'y choisissait plus, il devinait.

La règle ne vaut que pour l'**égalité à deux membres**, « donné = travail ».
Un encadrement « -3 < x < -2 » n'a pas de donné à gauche : ses trois membres
forment un seul énoncé, et tous ont le droit de bouger.

### Le niveau est une intention, pas une exigence

Quand une chaîne n'offre pas de quoi placer deux fautes en laissant du vrai
après elles, on en place **une** plutôt que de rendre le volet sain. Un volet
sain doit rester un choix — « aucune règle n'est en jeu ici » — jamais un aveu
d'impuissance.

### Les fiches d'arithmétique — ce qu'on ne peut pas y planter

Dans `diviseurs7`, `pgcd7`, `premiers7`, `divisibilite8`, une étape est une
**égalité numérique fermée** : « 2^3 × 3^2 × 5 = 360 ». Une faute de règle qui
change les deux membres à la fois — prendre le plus grand exposant au lieu du
plus petit, et écrire « 5^3 = 125 » — reste **vraie en elle-même**, et le juge
ne peut pas la certifier fausse. Elle ne serait fausse que *relativement à la
question*, ce qui n'est pas de son ressort.

On n'y plante donc que les fautes qui laissent le donné en place et se trompent
sur la valeur : la puissance lue comme un produit, les parenthèses ignorées, la
somme mise à la place du produit, l'exposant soustrait au lieu d'être divisé.
Ce sont aussi, et ce n'est pas un hasard, les seules qu'un élève écrit vraiment.

Le `geste` de ces règles est écrit **à l'envers** des autres : au lieu
d'énumérer les libellés où la règle a un sens, il énumère ceux où elle n'en a
pas — « النتيجة », « نترجم », « نلاحظ », « القاعدة ». C'est que dans ces fiches
toute étape calculée est un pivot. Lister les pivots un par un revenait à en
oublier, et l'on a vu « م.م.أ: كل عامل بأكبر أسّ » — le pivot même de la leçon
— rester hors d'atteinte parce que son libellé ne commençait pas par « نحسب ».

Deux détails du juge, chèrement acquis. Passé `2^53`, deux écritures d'un même
nombre s'arrondissent différemment : le juge s'abstient au-delà de l'entier
exact, faute de quoi il déclarait fausse l'identité juste
« 3 × 3^65 + … = 3^65 × (…) ». Et « = 8 », sans membre gauche, annonce le
résultat de la chaîne : il ne se calcule pas tout seul.

`naturels7` est à part : ses étapes ne sont pas des égalités mais des
**expressions** — « 26 × 9 + 3 », puis « 234 + 3 », puis « = 237 » —, chacune
la précédente réécrite plus simplement. L'invariant de la fiche est qu'elles
valent toutes le résultat final ; son juge tranche donc là-dessus, et une faute
de règle s'y voit à ce que la réécriture change la valeur.

### Quand une fiche ne parle pas la langue du porteur

`premiers7` nomme ses familles `PREUVES`, `naturels7` livre ses étapes déjà
rendues en HTML. On ne réécrit pas la fiche pour lui faire parler la langue de
l'outil : on ajoute un `pont.js`, qui traduit. Il n'invente rien qui n'existe
déjà — il renomme, il redécoupe, et il complète ce qui manquait vraiment : un
`controle` qui porte le résultat, un indice.

### Ce qui reste debout après la faute

Une chaîne dont **tout** serait faux ne demanderait plus de juger — mais ce
qui compte est le nombre d'étapes qui restent debout, pas le nombre d'étapes
*calculables*. Une chaîne peut n'avoir qu'une ligne de calcul et trois lignes
de raisonnement en arabe, et l'élève y juge très bien. On exigeait deux étapes
calculables : un exercice entier de `rationnels8` — l'anti­sélection des
éléments d'un ensemble — sortait sain à chaque tirage sans qu'on le voie.

### rationnels8 — et les deux exercices qu'on n'a pas pu servir

Le chapitre compare des rationnels ; ses règles sont l'ordre des négatifs
(« entre deux négatifs, le plus grand en valeur absolue est le plus petit »),
la comparaison au zéro, la mise au même dénominateur, et le signe de la
différence. Une étape peut y porter plusieurs comparaisons séparées par « ; » :
les règles les parcourent une à une et n'en faussent qu'une, les autres restant
justes — c'est ainsi qu'un élève se trompe.

Deux exercices restent **sans faute plantée**, et il faut le dire :

* **« الضرب التقاطعي »** — la faute de règle y est de mal apparier les facteurs
  (`1 × 12` au lieu de `1 × 65`). L'égalité écrite reste alors **vraie en
  elle-même** ; elle n'est fausse que relativement à la question, ce que le juge
  ne peut pas certifier ;
* **« نفس البسط »** — la règle du chapitre (« numérateur négatif : l'ordre
  s'inverse quand le dénominateur grandit ») ne s'applique que dans l'étape
  « النتيجة », et l'on ne plante jamais sur le résultat.

Leurs volets sortent donc avec un corrigé juste, que l'élève doit reconnaître
comme tel. C'est le quatrième point du contrat, et non un contournement — mais
c'est un cas où il s'impose au lieu d'être choisi.

### Où vivent les pages

Les pages « أين الخطأ؟ » sont dans un dossier `erreurs/` **à l'intérieur de la
fiche**, à côté des pages de chaîne et non parmi elles :

    radic9/
      index.html  ex01.html … ex08.html      les chaînes
      noyau.js  racines.js  juge.js  erreurs.js
      erreurs/
        index.html  err01.html … err08.html   les pages d'erreurs

La fiche reste un bloc qu'on dépose tel quel : les pages d'erreurs remontent
d'un cran — `../noyau.js`, `../style.css` — et **rien n'est dupliqué**. Chaque
page porte un lien vers sa chaîne jumelle, chaque index un lien vers l'autre.

Le nom de la page de chaîne n'est pas deviné : une fiche écrit `preuve1.html`,
une autre `ex1.html` sans zéro. Le générateur regarde ce qui existe, et
n'écrit pas de lien mort quand il ne trouve rien.
