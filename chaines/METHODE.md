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

Règles de composition des étapes :

* une étape = **un geste**, et un seul ;
* une étape porte une **relation vérifiable** (`√32 = √(16 × 2) = 4√2`), sauf
  les étapes de cadrage rédigées en arabe (« شرط الوجود : … ») ;
* jamais deux étapes identiques — l'élève ne pourrait pas les départager, et le
  contrôle d'ordre deviendrait ambigu ;
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
