# التعامد و التوازي — 7ème

Cinq familles de démonstrations, tirées de la feuille
« المستقيمات المتوازية و المستقيمات المتعامدة » (فوزي الغربي, المدرسة
الإعدادية النموذجية ضفاف البحيرة).

```
noyau.js     la géométrie exacte, les prédicats, la figure
regles.js    le catalogue des six règles, et le moteur qui les enchaîne
items.js     les énoncés, relevés sur les feuilles
chaines.js   de la scène à la démonstration
verifier.js  refait chaque affirmation sur les coordonnées
gens.js      le montage de la fiche
```

## Ce qui change ici par rapport aux autres fiches

**La géométrie se vérifie par les coordonnées.** Une démonstration ne se relit
pas — on croit toujours ce qu'on a écrit. Mais dès qu'un point a des
coordonnées, chaque affirmation devient un calcul :

| l'énoncé dit | on recalcule |
|---|---|
| `(D) // (D')` | le déterminant des deux vecteurs est nul |
| `(AH) ⊥ (BC)` | leur produit scalaire est nul |
| `MA = MB` | les deux carrés de distance sont égaux |
| `I milieu de [AB]` | 2·I = A + B |
| `(Δ) médiatrice de [AB]` | ⊥ à `(AB)` **et** passant par son milieu |

Tout est en fractions de BigInt. En flottants, « le produit scalaire est nul »
deviendrait « il est petit », et un angle presque droit passerait pour droit.

**Le raisonnement est CHERCHÉ, pas écrit.** On donne les règles du programme,
les hypothèses de l'énoncé et le but ; le moteur cherche le chemin en largeur,
donc celui qu'il trouve est le plus court. C'est celui que le maître attend, et
celui qu'un élève peut refaire.

Le moteur ne prouve rien : il propose. Ce sont les coordonnées qui tranchent.
Une règle mal écrite dans le catalogue produirait une étape fausse, et le
validateur la refuserait.

**La figure naît des mêmes points.** Elle n'est pas dessinée à côté de
l'énoncé, elle en sort. Si le générateur change une longueur, le dessin suit,
et il ne peut pas mentir sur ce que le texte affirme. Le validateur contrôle
qu'elle existe, qu'elle est équilibrée, et qu'aucun point n'y figure qui ne
soit dans l'énoncé.

**La pose change à chaque tirage.** Toutes les figures dessinées à
l'horizontale se ressemblent, et l'élève finit par reconnaître le dessin au
lieu de lire l'énoncé. On incline donc le repère — par des rotations exactes
tirées des triplets pythagoriciens, pour que les coordonnées restent
rationnelles et les longueurs entières.

## Deux sortes de chaînes

**Celles qui démontrent** — le moteur enchaîne les règles. « برهن أنّ
(D) // (D') ».

**Celles qui calculent** — « أحسب بعد A عن (BC) », « ما هي الوضعية النسبية
لـ (Δ) و (C) ؟ ». On calcule, puis on compare : le moteur ne sert à rien ici,
et vouloir l'y forcer produirait une démonstration tordue. Chacune a sa
chaîne, mais la même exigence — ce qui est écrit est recalculé, verdict
compris. « المستقيم مماس للدائرة » n'est pas une opinion : c'est
d(O, (D)) = r, et rien d'autre.

## Les treize règles

1. `مستقيمان عموديان على نفس المستقيم متوازيان`
2. `إذا كان مستقيم عموديا على أحد مستقيمين متوازيين فهو عمودي على الآخر`
3. `مستقيمان متوازيان لنفس المستقيم متوازيان`
4. `الموسط العمودي لقطعة مستقيم عمودي على حاملها`
5. `المستقيم العمودي على قطعة و المارّ من منتصفها هو موسطها العمودي`
6. `كلّ نقطة من الموسط العمودي لقطعة متساوية البعد عن طرفيها`
7. `المماس لدائرة في نقطة عمودي على الشعاع في تلك النقطة`
8. `منتصف قطعة متساوي البعد عن طرفيها`
9. `إذا كان طولان يساويان طولا ثالثا فهما متساويان`
10. `كلّ نقطة متساوية البعد عن طرفي قطعة تنتمي إلى موسطها العمودي`
11. `المستقيم المارّ من نقطتين متساويتي البعد عن طرفي قطعة هو موسطها العمودي`
12. `الرباعي الذي أضلاعه متوازية مثنى مثنى هو متوازي أضلاع`
13. `متوازي أضلاع له زاوية قائمة هو مستطيل`

Treize et pas une de plus : un élève de 7ème qui n'a pas vu les angles
alternes-internes ne doit pas lire une démonstration qui s'en sert.

## Ce qui a été écarté, et pourquoi

Toute la première moitié de chaque exercice est une **construction** —
« ارسم », « عيّن », « أنشئ ». Elle ne se vérifie pas : un tracé juste et un
tracé faux ont le même texte. Elle reste dans l'énoncé, comme mise en place, et
c'est le « برهن أنّ » qui devient la question.

## Vérifier

```
node verifier.js 60
CONTRE_EXEMPLES=1 node verifier.js
```

Onze falsifications sont tentées à chaque fois — un point déplacé d'une unité,
une perpendiculaire changée en parallèle, une droite réduite à un point, un
verdict retourné, une distance changée, **le rayon donné pour tangente** (un
point commun ne suffit pas), une étape dupliquée, une chaîne tronquée, l'aide
retirée, la figure retirée, **un quadrilatère promu** (un rectangle donné pour
un carré). Le validateur doit les refuser toutes.

Une falsification peut échouer de deux façons, et les deux se voient : ne
RIEN changer — chercher un verdict dans une chaîne qui n'en a pas —, ou
changer quelque chose qui reste VRAI — promouvoir en carré un rectangle qui
se trouve en être un. On retire dans les deux cas, et si l'on n'y arrive
jamais, on le dit.

## Tout ce que l'énoncé écrit est une affirmation

Deux fois le même défaut, trouvé deux fois de la même façon — en imprimant.

**Les longueurs.** « AB = 6 » écrit dans l'énoncé est aussi vérifiable que
« (D) // (D') », et l'oublier a coûté : un repère qui doublait les
coordonnées donnait une figure où AB valait 18 quand le texte annonçait 9, et
rien ne le voyait — jusqu'à ce que la famille des distances calcule la réponse
et la trahisse.

**Les alignements.** « I est le point d'intersection avec (UT) » aussi. Posé
au petit bonheur en face de A, I n'était pas sur (UT), et la démonstration
restait vraie… sur une figure fausse. Les items déclarent donc `alignements`,
et le validateur les recalcule. Il a mordu dans la minute.

Sous ce dernier se cachait un troisième défaut : la conversion des coordonnées
n'acceptait que les entiers et les moitiés, et **arrondissait le reste en
silence** — 3,75 devenait 3,5. Elle refuse désormais ce qu'elle ne sait pas
rendre exactement, et les coordonnées qui ne sont ni entières ni demies se
passent en rationnel.


