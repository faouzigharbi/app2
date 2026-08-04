# Comment on fabrique un chapitre de chaînes de démonstration

Recette complète, écrite pour être suivie par quelqu'un qui n'a pas assisté aux
chapitres précédents. Elle décrit **ce qui marche** et **ce qui a déjà cassé**.

---

## 1. Le principe

Une **chaîne** est une suite d'étapes de raisonnement. Le moteur les mélange ;
l'élève les remet dans l'ordre. La comparaison se fait **par chaîne de
caractères exacte, position par position** :

```js
for (let k = 0; k < q.steps.length; k++)
  if (ordre[k] !== q.steps[k]) { bon = false; break; }
```

**Conséquence fondamentale : l'ordre attendu doit être UNIQUE.** Deux étapes
interchangeables rendent l'exercice injuste. Deux étapes identiques aussi — le
validateur refuse les doublons pour cette raison.

---

## 2. L'architecture — sept fichiers, toujours les mêmes

```
chaines/<chapitre>/
  noyau.js       rationnels exacts, rendu (fractions, bidi), registre des pages
  <moteur>.js    l'algèbre propre au chapitre (algebre.js, racines.js, …)
  exercices.js   les générateurs : un par exercice/type de la fiche
  gens.js        le registre : page(n, titre, générateur, nbQuestions)
  _build.js      émet exNN.html + exNN.js + index.html  (node _build.js .)
  verifier.js    « les mathématiques sont-elles justes ? »
  audit.js       « un professeur écrirait-il cela ? »
  style.css      copié depuis le chapitre précédent
  README.md
```

Les modules sont **double-usage Node/navigateur** :

```js
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Nom;
  /* … */
  if (M) module.exports = API; else racine.Autre = API;
})(typeof window !== 'undefined' ? window : globalThis);
```

C'est ce qui permet de **vérifier en Node ce que le navigateur affichera**.

---

## 3. Le schéma de données

Un générateur rend un objet **brut** :

```js
{
  enonce: ['بيّن أنّ', 'A = ' + forme, {brut: '<svg…>'}],   // objet {brut} = HTML tel quel
  indice: 'texte de l’aide',
  etapes: [['étiquette', 'mathématiques ou phrase arabe'], …],
  controle: { type: '…', /* de quoi re-démontrer la conclusion */ }
}
```

`noyau.rendre()` le transforme en ce que la page consomme :

```js
window.exerciceData = { id, title, questions: [{ operation, steps, hint }] };
```

où `steps[i] = etapes[i][0] + ': ' + <math rendu>`.

**Une étape dont le texte contient de l'arabe est ignorée par le validateur** —
c'est ainsi qu'on écrit les règles générales (« علامة الطرح أمام قوس تغيّر
الإشارة »). Une étape purement mathématique, elle, **doit être une relation
vraie** (`=`, `<`, `>`), et elle sera recalculée.

---

## 4. Le rendu arabe — le piège permanent

Le texte coule de droite à gauche, les mathématiques de gauche à droite. Sans
précaution, `(3 ؛ 2)` s'affiche `(2 ؛ 3)` : le couple est **retourné, donc
faux**.

`noyau.js` isole chaque fragment mathématique :

```js
const CAR = '0-9A-Za-z+\\-*×÷/:=^().,|<>≤≥≠؛\\[\\]∈{}∞√π';
const RUN = new RegExp('[' + CAR + ']+(?:\\s+[' + CAR + ']+)*', 'g');
const ISOLER = /[+\-*×÷/=^|<>≤≥≠؛∈]|\(\s*[0-9]/;
// → <span dir="ltr" class="expr">…</span>, après échappement de < et >
```

Règles à respecter :

* le **point-virgule arabe `؛`** des listes et des couples doit être DANS le
  fragment isolé, sinon la liste part en RTL ;
* les signes d'ordre `< > ≤ ≥` aussi ;
* **jamais de parenthèse enfermant du texte arabe** entre deux morceaux de
  mathématiques : `n = (قاسم) - 1` s'affiche à l'envers. Écrire la phrase en
  toutes lettres à la place ;
* `échapper` avant de poser le balisage, jamais après.

**Ne jamais juger le bidi à l'œil sur une capture — mesurer.** Ouvrir la page
avec Playwright et comparer les positions écran :

```js
// dans un fragment isolé, le premier caractère doit être le plus à GAUCHE
range.setStart(n, k); const gauche = range.getBoundingClientRect().left;
```

J'ai cru deux fois qu'un affichage était retourné alors qu'il était correct, et
inversement. La mesure tranche, la lecture non.

---

## 5. Les générateurs — partir de la réponse

**Ne jamais tirer les nombres au hasard puis chercher ce qu'ils donnent.** On
obtient des `437/1080` que personne n'écrirait, et souvent rien d'intéressant.

On part de la **forme finale voulue**, puis on l'habille :

```js
// on veut A = 3/2 (x + 5/11 y) → on écrit A = 3/2 x + 15/22 y
const c = frac(9, 11);            // le facteur commun
const r = frac(9, 11);            // la part
const brut = ecrire([T(c, 'x'), T(mul(c, r), 'y')]);
```

Puis **on relit ce qu'on vient d'écrire** — c'est le texte affiché qui fait
foi, pas l'intention :

```js
let relu; try { relu = analyser(texte); } catch (e) { continue; }
if (!memes(relu, cible)) continue;      // l'habillage ne redonne pas la cible
```

Les boucles `for (let essai = 0; essai < 300; essai++) … continue` sont la
norme : on retire jusqu'à obtenir un énoncé acceptable.

⚠ **Une contrainte impossible fait boucler à l'infini.** Toujours se demander
si le rejet peut réussir. Exemples vécus :

* demander `a + b` PUIS `a − b` sur deux expressions exige des coefficients
  **croisés** `(p ; q)` et `(q ; p)` ; avec des ±1 partout, l'une des deux
  questions perd toujours son inconnue — boucle infinie ;
* « trouver y » quand `x` est encore libre : la réponse contiendrait `x`, le
  garde-fou rejette tout — boucle infinie. Il faut fixer `x` avant.

Tester chaque générateur isolément avec un `timeout` avant d'aller plus loin.

---

## 6. Le validateur — on n'inspecte pas le code, on l'exécute

`verifier.js` fait tourner les générateurs des centaines de fois et, pour
chaque question :

1. **recalcule chaque étape** dans les environnements où elle a le droit d'être
   vraie ;
2. **re-démontre la conclusion** à partir du `controle`, indépendamment de la
   chaîne ;
3. refuse les doublons, les chaînes trop courtes (< 4) ou trop longues (> 10-14
   étapes — au-delà, le glisser-déposer devient pénible), l'absence d'indice.

Les environnements selon la nature de l'étape :

| nature | environnement |
|---|---|
| identité (vraie pour toute valeur) | 20-30 tirages aléatoires |
| égalité vraie seulement à la solution | un env par solution ; l'étape doit tenir dans **au moins un** |
| expression fermée (aucune lettre) | env vide, l'étape doit tenir telle quelle |
| valeurs données (a, b entiers de l'énoncé) | l'env fixé de l'énoncé |

Le **nom** d'une expression (`E`, `M`, `C`) n'est pas une inconnue : c'est une
désignation. Le mettre dans l'environnement via `controle.noms = {E: '<texte>'}`,
sinon toute étape écrite « E = … » est illisible.

### Le mode falsification — indispensable

```bash
CONTRE_EXEMPLES=1 node verifier.js
```

On abîme volontairement des exercices justes (racine décalée, signe retourné,
facteur littéral amputé, verdict vrai/faux inversé, valeur en trop dans une
liste…). **Si le validateur en accepte un seul, c'est lui qui est faux.**

⚠ Une falsification doit **mordre quelle que soit la forme tirée**. Remplacer
le premier `+` par `−` ne fait rien sur une expression sans `+`. Préférer
`'(' + membre + ') + 1'`, qui casse toujours.

---

## 7. L'audit pédagogique — l'autre moitié du travail

`verifier.js` dit si c'est **vrai**. `audit.js` dit si c'est **enseignable**.
Il a trouvé des défauts réels dans chaque chapitre :

* `+ -1/3` au lieu de `- 1/3` (raccord des signes) ;
* `1√15`, `1x`, `/1`, `- 0`, parenthèse vide ;
* un **groupe qui vaut zéro** — `(5/2 - 5/2)` — l'élève croit avoir mal lu ;
* une valeur absolue **visiblement** positive : rien à décider, rien à apprendre ;
* un signe à décider qui **frôle zéro** (`1/6 + √2 − √3 ≈ −0,15`) : c'est un
  piège d'arrondi, pas un exercice → exiger `|valeur| ≥ 0,3` ;
* une forme réduite dont l'irrationnel s'annule : l'exercice quitte ℝ ;
* un **carré parfait resté sous le radical** : `2√12` est faux *en tant que
  réponse* même si le nombre est bon ;
* un **indice qui donne la réponse** ;
* un énoncé qui ne rappelle pas son expression (la feuille imprimée doit se
  suffire à elle-même).

---

## 8. Le balayage navigateur

Avant de livrer, ouvrir **chaque** page avec Playwright et :

* remettre les étapes dans l'ordre attendu → le moteur doit répondre juste ;
* cliquer « التصحيح » → le corrigé doit apparaître ;
* vérifier `scrollWidth <= clientWidth` (aucun débordement horizontal) ;
* construire la feuille imprimable : cases côté élève, listes ordonnées côté
  parent, exactement **une** `.coupure` ;
* cliquer « أرقام جديدة » → le contenu doit changer ;
* zéro erreur JS.

Chromium : `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`.
Les échecs réseau sur `fonts.googleapis.com` sont normaux hors ligne — les
filtrer, ils ne comptent pas.

---

## 9. Les pièges d'analyseur déjà payés

| symptôme | cause | correction |
|---|---|---|
| `1/3 : 2/3` vaut `1/18` | `:` et `/` au même niveau | `:` (division) se lie **moins fort** que `/` (barre de fraction) et que `×` |
| `-x^2` vaut `x²` | moins unaire trop prioritaire | le moins unaire appelle `puissance()`, pas `facteur()` |
| `√72/√6` vaut `√12` | raccourci « √n/m » | pas de raccourci : une fraction sous le radical s'écrit `√(n/m)` |
| boucle infinie dans un tirage | `pgcdB` du noyau est en **BigInt** ; comparé à `1` avec des `Number`, toujours faux | garder un `pgcd` local sur les entiers JS |
| `3^2006` très lent | puissance par multiplications successives | exponentiation rapide (par carrés) |
| `xy` traité comme une variable inconnue | `xy` est un seul jeton | dériver `env['xy'] = x·y` (`composites: true`) |
| `<` avale la suite de la ligne | non échappé | `echapper()` avant le balisage |

---

## 10. Le déroulé complet, dans l'ordre

1. **Lire la fiche** (PDF → PNG avec `pdfjs-dist` + `@napi-rs/canvas`, échelle 2)
   et faire l'inventaire des exercices et des familles.
2. **Choisir/écrire le moteur** : rationnels seuls ? BigInt ? combinaisons
   linéaires ? radicaux exacts ? Le tester d'abord **sur les expressions de la
   fiche**, en comparant aux réponses qu'elle publie (`moteur_test.js`).
3. **Écrire les générateurs**, un par exercice, en partant de la réponse.
4. `node verifier.js 5` puis, quand c'est vert, `node verifier.js 40+`.
5. `CONTRE_EXEMPLES=1 node verifier.js` → doit être 100 %.
6. `node audit.js 50` → doit être vert.
7. `node _build.js .` puis balayage navigateur.
8. `zip -rq …` → **envoyer le zip seul, en premier**.
9. Lier le chapitre depuis `chaines/index.html`, écrire le `README.md`,
   commettre et pousser.

---

## 11. Le gabarit de page

`_build.js` se recopie d'un chapitre à l'autre ; seuls changent les `<script>`,
le nom du registre (`window.Xxx.construire`) et les titres. Il produit déjà :

* l'**accordéon** (`<details class="q">`), un volet par question, tous ouverts ;
* par volet : réserve d'étapes mélangées, zone de dépôt, `🔁 إعادة`,
  `💡 مساعدة`, `👁 التصحيح`, `✅ تحقق` ;
* la coloration du volet selon l'état (juste / faux / corrigé consulté) ;
* le compteur « أجبت عن n/N » ;
* `🎲 أرقام جديدة` (nouveau tirage), `🗂 اطوِ الكلّ`, `🖨 ورقة للطباعة` ;
* la **feuille imprimable** en deux parties, avec `@media print` qui masque
  l'interface. L'ordre mélangé affiché à l'écran est mémorisé pour que la
  feuille élève montre exactement la même chose.

Une figure SVG passe dans l'énoncé sous la forme `{brut: '<svg…>'}` : elle
traverse le rendu sans être échappée, et se retrouve dans les deux feuilles.
