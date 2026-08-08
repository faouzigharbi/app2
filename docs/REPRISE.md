# Dossier de reprise — Pilier « Mathématiques 9ème année »

Tout ce qui a été fait, et comment le remettre en place sur votre PC.

- **Dépôt** : `faouzigharbi/app2`
- **Branche** : `claude/pdf-generators-consolidation-i9kdhn`
- **Remplace** : `C:\mon-site-SAUVEGARDE-AVANT-MIGRATION\Devoirati\outils\Generateurs\generateur_erc\9eme\generateurs_pdf9`

---

## 1. Récupérer le travail

Le code est **déjà écrit et poussé**. Il n'y a rien à refaire à la main : il faut
seulement le rapatrier.

### Option A — sans Git (le plus simple)

1. Ouvrir <https://github.com/faouzigharbi/app2/tree/claude/pdf-generators-consolidation-i9kdhn>
2. Bouton vert **Code** → **Download ZIP**
3. Décompresser, puis copier le contenu dans votre arborescence (voir §2)

### Option B — avec Git

```bash
cd C:\chemin\vers\votre\clone\app2
git fetch origin
git checkout claude/pdf-generators-consolidation-i9kdhn
```

Si vous n'avez pas encore de clone :

```bash
git clone https://github.com/faouzigharbi/app2.git
cd app2
git checkout claude/pdf-generators-consolidation-i9kdhn
```

### Vérifier que tout est là

```bash
node tools/selftest.js
```

Attendu : `61 vérifications, 0 échec(s).` — le test génère ~10 200 exercices et
valide l'arithmétique, les réponses et les fiches. S'il passe, l'installation
est bonne.

Puis ouvrir `index.html` par double-clic. Aucun serveur, aucune installation,
aucune connexion internet n'est nécessaire.

---

## 2. Où le poser dans le site

Le pilier est autonome : un dossier, aucune dépendance externe. Suggestion :

```
Devoirati\outils\Generateurs\generateur_erc\9eme\
├── generateurs_pdf9\          ← ancien dossier, à garder de côté le temps de la bascule
└── maths9\                    ← le nouveau pilier (contenu du ZIP)
    ├── index.html
    ├── exercice.html
    ├── fiche.html
    ├── assets\
    ├── docs\
    ├── tools\
    └── legacy\                ← les 21 anciens fichiers, conservés tels quels
```

Le point d'entrée à référencer depuis le site est `maths9/index.html`.

Les chemins internes sont tous relatifs : le dossier peut être déplacé ou
renommé sans rien casser.

---

## 3. Ce qui a été fait, en une page

**Constat.** Les 21 fichiers de `generateurs_pdf9` n'étaient pas des doublons
inertes : c'étaient des versions successives d'une poignée d'exercices, chacune
avec sa propre arithmétique, son propre rendu, sa propre correction — et ses
propres bugs. Et malgré le nom du dossier, **aucun ne produisait de PDF** :
deux appelaient `window.print()` sur une page non mise en forme pour
l'impression.

**Réponse.** Un noyau partagé et 12 générateurs déclaratifs. Un générateur est
écrit **une seule fois** et alimente à la fois l'entraînement interactif et la
fiche imprimable. C'est ce qui empêche la re-divergence : il n'y a plus deux
endroits où un même exercice peut être calculé différemment.

| | Avant | Après |
|---|---|---|
| Fichiers d'exercices | 21 | 12 générateurs |
| Lignes de code | 6 586 | 2 290 |
| Poids | 1,1 Mo | 108 Ko |
| Dépendances externes | polyfill.io, MathJax, OneTrust | aucune |
| Fonctionne hors ligne | non | oui |
| Génération PDF | non | oui |
| Tests | aucun | 61 vérifications |

---

## 4. Inventaire des fichiers

### Pages

| Fichier | Rôle |
|---|---|
| `index.html` | Catalogue des 12 générateurs, construit automatiquement depuis le registre |
| `exercice.html` | Entraînement interactif — `?g=<id>&n=<niveau>` |
| `fiche.html` | Constructeur de fiche PDF — `?g=<id>` pour pré-remplir |

### Noyau — `assets/js/core/`

| Fichier | Rôle |
|---|---|
| `frac.js` | Arithmétique exacte sur les rationnels : signe normalisé, réduction automatique, refus de la division par zéro |
| `rng.js` | Aléatoire **déterministe** : une graine produit toujours la même suite |
| `render.js` | Rendu HTML/CSS des fractions et des puissances, sans MathJax |
| `registry.js` | Registre des générateurs — l'interface s'y branche toute seule |
| `engine.js` | Moteur d'entraînement unique : saisie, vérification, indice, correction, score |
| `worksheet.js` | Composition de la fiche A4 imprimable |

### Générateurs — `assets/js/generators/`

| Fichier | Contenu |
|---|---|
| `fractions.js` | 8 générateurs (chapitre الكسور) |
| `puissances.js` | 4 générateurs (chapitre القوى) |

### Reste

| Fichier | Rôle |
|---|---|
| `assets/css/pilier.css` | Design, rendu mathématique, **styles d'impression A4** |
| `tools/selftest.js` | Tests — `node tools/selftest.js` |
| `docs/MIGRATION.md` | Correspondance ancien → nouveau, détail des bugs |
| `docs/REPRISE.md` | Ce document |
| `legacy/` | Les 21 fichiers d'origine, intacts, plus référencés |

---

## 5. Les 12 générateurs

### الكسور — fractions

| id | Titre | Niveaux |
|---|---|---|
| `fractions-simplification` | تبسيط الكسور | سهل / متوسط / صعب |
| `fractions-somme` | جمع وطرح الكسور | نفس المقام / مقامات مختلفة / ثلاثة كسور |
| `fractions-produit` | ضرب الكسور | كسران / كسر × عدد صحيح / ثلاثة كسور |
| `fractions-quotient` | قسمة الكسور | سهل / متوسط / كسر طابقي |
| `fractions-operations` | أولوية العمليات | ضرب ثم جمع / قسمة ثم طرح / مختلط |
| `fractions-parentheses` | الكسور والأقواس | ضرب في قوس / قسمة على قوس / قوسان |
| `fractions-decimales` | الكسور العشرية | مقامات مباشرة / يجب التبسيط أولا |
| `fractions-factorisation` | التحليل بالعامل المشترك | حدّان / ثلاثة حدود |

### القوى — puissances

| id | Titre | Niveaux |
|---|---|---|
| `puissances-produit` | جداء قوى لنفس الأساس | عاملان / ثلاثة عوامل / مع أسس سالبة |
| `puissances-quotient` | خارج قوى لنفس الأساس | نتيجة موجبة / نتيجة قد تكون سالبة / كتابة كسرية |
| `puissances-puissance` | قوة القوة | مباشر / قوة قوة × قوة / أسس سالبة |
| `puissances-expressions` | تبسيط تعابير القوى | نفس الأساس / نفس الأس / مختلط |

---

## 6. Correspondance ancien → nouveau

### Fractions — 14 fichiers → 8 générateurs

| Ancien fichier | Remplacé par |
|---|---|
| `arabic-fraction-simplification.html` | `fractions-simplification` |
| `fraction-simplification-exercise.html` | `fractions-simplification` |
| `addition fractions.html` | `fractions-somme` |
| `addition fractions2.html` | `fractions-somme` |
| `addition fractions3.html` | `fractions-somme` (niveau ثلاثة كسور) |
| `Factorisation Fractions 2.html` | `fractions-produit` |
| `Division fractions4.html` | `fractions-quotient` |
| `addition fractions4.html` | `fractions-quotient` — le fichier était mal nommé, il traitait la division |
| `4 opération Fractions.html` | `fractions-operations` |
| `operations fractions .html` | `fractions-operations` |
| `additionFractParenthese.html` | `fractions-parentheses` |
| `Fractions DEcimales.html` | `fractions-decimales` |
| `Factorisation Fractions.html` | `fractions-factorisation` |
| `factorisatioon0.html` | `fractions-factorisation` |

### Puissances — 7 fichiers → 4 générateurs

| Ancien fichier | Remplacé par |
|---|---|
| `pUISSANCE PRODUIT (2).html` | `puissances-produit` |
| `produit puisssance.html` | `puissances-produit` |
| `puissance prod 2.html` | `puissances-produit` |
| `puissance prod 3.html` | `puissances-produit` (export Poe, 628 Ko) |
| `power-exponent-exercises.html` | `puissances-produit` + `puissances-quotient` + `puissances-puissance` |
| `exe Puissance.html` | `puissances-expressions` |
| `exe Puissance2.html` | `puissances-expressions` |

---

## 7. Bugs corrigés au passage

Ces défauts existaient dans les fichiers d'origine. Ils ne sont plus
reproductibles : l'arithmétique est centralisée dans `frac.js` et couverte par
les tests.

**Intervalle aléatoire inversé.** Dans `arabic-fraction-simplification.html`,
`getRandomInt(Math.max(num, 2), 20)` recevait un `num` déjà multiplié par le
facteur, donc souvent supérieur à 20 : la borne minimale dépassait la borne
maximale. `Rng.int()` remet désormais les bornes en ordre, et un test le vérifie.

**Réponses comparées comme du texte.** `addition fractions3.html` faisait
`userAnswer === correctAnswer` sur des chaînes : `"6/8"` était compté faux face
à `"3/4"`, et un espace suffisait à invalider une bonne réponse. Le moteur
compare maintenant par produit en croix, et distingue « juste mais non
simplifié » de « faux ».

**Résultats négatifs non voulus.** Le même fichier tirait `a > b > c` puis
réaffectait des dénominateurs aléatoires indépendants, ce qui détruisait
l'ordre : des soustractions donnaient des résultats négatifs sur des exercices
présentés comme élémentaires. Le signe du résultat est maintenant contrôlé par
niveau.

**Signe perdu à la réduction.** `Division fractions4.html` et
`Factorisation Fractions.html` appelaient `findGCD` sur des valeurs signées et
pouvaient produire un dénominateur négatif. `Frac` normalise le signe sur le
numérateur.

**Corrigé déduit du DOM.** `Factorisation Fractions.html` choisissait les étapes
de correction avec `problem.innerText.includes('+')` : tout changement
d'affichage cassait le corrigé. Les étapes sont désormais produites en même
temps que l'énoncé.

**Dépendances externes mortes.** Plusieurs fichiers chargeaient `polyfill.io` —
domaine passé sous un autre contrôle en 2024 et utilisé pour distribuer du code
malveillant — ainsi que MathJax depuis un CDN. Les pages ne fonctionnaient donc
pas hors ligne. Le pilier n'a aucune dépendance externe.

**Contenu parasite.** `addition fractions.html` (190 Ko) et
`puissance prod 3.html` (628 Ko) étaient des exports de conversations Poe, avec
bannière de consentement OneTrust incluse. À eux deux : 76 % du poids du dossier.

---

## 8. La génération PDF

C'est la fonctionnalité que le nom du dossier promettait sans l'implémenter.

`fiche.html` compose une vraie fiche A4 :

- en-tête : établissement, titre, nom, classe, date, durée
- énoncés sur une ou deux colonnes
- emplacements de réponse adaptés au type (cadre de fraction, ligne, نعم/لا)
- **corrigé sur une page séparée**, au choix détaillé (étape par étape) ou
  abrégé (résultats seuls)

L'export passe par l'impression du navigateur — `Ctrl+P` → *Enregistrer au
format PDF* — et non par une bibliothèque JavaScript type jsPDF. C'est un choix
délibéré : c'est le seul moyen fiable d'obtenir un texte arabe correctement
ligaturé et écrit de droite à gauche. La fiche reste sélectionnable, accessible
et légère.

### Le code de fiche

Chaque fiche porte un code court, par exemple `K7M2QX`, affiché en en-tête.

Le même code régénère **exactement** les mêmes exercices et le même corrigé.
Concrètement :

- réimprimer une évaluation distribuée le mois dernier
- donner le corrigé aux élèves une semaine après le devoir
- fabriquer deux sujets différents pour deux rangées : deux codes, un clic

C'est le rôle de `rng.js` : l'aléatoire est déterministe, la graine est le code.

---

## 9. Ajouter un exercice

Trois étapes, aucune liste à maintenir à la main.

**1.** Ouvrir (ou créer) un fichier dans `assets/js/generators/`.

**2.** Appeler `DV.registry.register({...})` :

```js
DV.registry.register({
  id: 'fractions-mon-exercice',      // identifiant stable, utilisé dans les URL
  chapter: 'fractions',
  title: 'عنوان التمرين',
  summary: 'وصف قصير يظهر في الفهرس.',
  levels: [
    { id: 'facile', label: 'سهل' },
    { id: 'difficile', label: 'صعب' }
  ],
  instruction: 'التعليمة الافتراضية.',

  make: function (rng, level) {
    var a = rng.frac(1, 9, 2, 10);          // fraction aléatoire réduite
    var b = rng.frac(1, 9, 2, 10);
    var res = a.add(b);                     // arithmétique exacte

    return {
      prompt: R.expr(R.frac(a) + R.op('+') + R.frac(b)),
      instruction: 'أحسب.',
      answer: { kind: 'frac', frac: res },  // 'frac' | 'int' | 'bool'
      answerHTML: R.expr(R.frac(res)),
      hint: 'وحّد المقامات أولا.',
      steps: ['الخطوة الأولى…', 'الخطوة الثانية…']
    };
  }
});
```

**3.** Ajouter la balise `<script>` dans `index.html`, `exercice.html` et
`fiche.html`.

Le catalogue, les menus déroulants, le moteur interactif et le constructeur de
fiche se mettent à jour seuls. Le contrat complet est documenté en tête de
`assets/js/core/registry.js`.

Pour un **nouveau chapitre**, ajouter aussi son libellé dans
`DV.CHAPTER_LABELS` (fin de `registry.js`).

### Rendre un exercice — mémo

```js
R.frac(f)                  // fraction empilée, signe sorti de la barre
R.rawFrac(n, d)            // fraction non réduite (étape de calcul)
R.fracExpr('3 + 8', '12')  // fraction dont le numérateur est une expression
R.pow(2, 5)                // 2⁵
R.powUnknown(2)            // 2^?
R.paren(html)              // parenthèses
R.op('×')                  // opérateur
R.expr(html)               // conteneur — force la lecture de gauche à droite
```

`R.expr()` n'est pas optionnel : dans une page arabe en RTL, une expression
mathématique doit rester lue de gauche à droite. C'est ce conteneur qui le
garantit.

---

## 10. Tester

```bash
node tools/selftest.js
```

Le test rejoue chaque générateur sur chaque niveau — 300 tirages par
combinaison, soit environ 10 200 exercices — et vérifie :

- l'arithmétique exacte des rationnels (signe, réduction, cas limites)
- le déterminisme des graines : même code → même fiche
- que chaque exercice a un énoncé, une réponse et des étapes non vides
- que **toute réponse fractionnaire est irréductible**
- l'équilibrage des balises HTML produites
- pour les fractions décimales : le verdict recalculé indépendamment
- pour les puissances : l'exposant attendu = l'exposant affiché
- la construction des fiches, la numérotation continue et leur reproductibilité

À lancer après toute modification d'un générateur. C'est le filet qui manquait
aux 21 fichiers d'origine.

---

## 11. Ce qui reste à décider

### La clé API — à traiter en priorité

`API devoirati.txt` contenait une clé OpenAI en clair. Elle a été retirée de
l'arborescence, **mais elle reste dans l'historique Git** et sur les autres
branches du dépôt.

Deux actions, dans cet ordre :

1. **Révoquer la clé** sur <https://platform.openai.com/api-keys>. C'est le seul
   geste qui la neutralise vraiment — supprimer le fichier ne suffit pas.
2. Réécrire l'historique si le dépôt est ou devient public.

### `generateur_pdf_divers` et `generateur_pdf_IR.html`

Ce dossier n'a jamais été poussé sur GitHub : il est resté sur votre PC, donc
invisible depuis la session. Pour l'intégrer, le téléverser sur la branche :
<https://github.com/faouzigharbi/app2/upload/claude/pdf-generators-consolidation-i9kdhn>

À noter, d'après la capture d'écran que vous avez montrée :
**`generateur_pdf_IR.html` est plus abouti que les 21 fichiers consolidés ici.**
Menu à cases à cocher, exercices typés `M1–M12` / `F1–F10` avec niveaux, ligne
de découpe, corrigé paginé à part, rendu LaTeX — c'est déjà une architecture de
pilier.

La vraie question n'est donc pas de le fondre dans celui-ci, mais de choisir
lequel des deux devient le modèle de référence. À première vue : le vôtre, et on
y branche le noyau d'arithmétique (`frac.js`) et les tests (`selftest.js`)
plutôt que l'inverse.

### Déplacer le menu à droite

Demandé sur `generateur_pdf_IR.html`, pas encore fait faute d'accès au fichier.
La page est en `dir="rtl"` ; un menu affiché à gauche vient d'une de ces causes :

```css
.sidebar { left: 0; }                      /* → right: 0; */
.layout  { flex-direction: row-reverse; }  /* → supprimer */
.layout  { direction: ltr; }               /* → rtl sur la mise en page,
                                              ltr uniquement sur les formules */
.layout  { grid-template-columns: 300px 1fr; }  /* → 1fr 300px */
```

Laquelle s'applique dépend du fichier. Une modification à l'aveugle risquerait
de casser la mise en page d'impression — la ligne de découpe et la pagination du
corrigé sont visibles sur votre capture.

---

## 12. Aide-mémoire

```bash
# récupérer
git fetch origin
git checkout claude/pdf-generators-consolidation-i9kdhn

# vérifier
node tools/selftest.js        # attendu : 0 échec

# utiliser
index.html                    # double-clic, rien à installer
fiche.html   → Ctrl+P         # → Enregistrer au format PDF
```

Rien à installer, rien à compiler, aucune connexion requise. Node n'est
nécessaire que pour lancer les tests.
