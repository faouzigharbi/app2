# المعلم المتعامد و المتجانس في المستوي — 9 أساسي

La **leçon** du repère, et non un devoir : huit familles, une page chacune,
cinq questions par page, **tirées à chaque chargement**. C'est le contraire du
dossier [`../brevet`](../brevet), qui reprend les nombres d'une feuille
précise ; ici l'élève doit pouvoir recommencer autant de fois qu'il veut.

| page | famille |
|---|---|
| `ex1` | le milieu d'un segment |
| `ex2` | le symétrique d'un point par rapport à un point |
| `ex3` | la distance entre deux points |
| `ex4` | la nature d'un quadrilatère |
| `ex5` | trois points sont-ils alignés ? |
| `ex6` | droites parallèles ou perpendiculaires ? |
| `ex7` | le quatrième sommet d'un parallélogramme |
| `ex8` | triangle rectangle et cercle circonscrit |

## Pourquoi ce chapitre existe

Il est né d'un manque **constaté**, pas supposé : deux exercices sur cinq de la
séance 2 du livre de révision sont dans un repère, et la géométrie qu'ils
demandent — milieu, symétrique, parallélogramme, cercle de diamètre — était
déjà connue ailleurs. Il ne manquait que les **coordonnées**. Le repère revient
ensuite aux séances 3, 6, 12 et 13.

La page 8 est le pont avec [`../thales9`](../thales9) : le repère y sert à
**démontrer** l'angle droit, et le centre du cercle circonscrit tombe alors au
milieu de l'hypoténuse — la propriété que tout le chapitre de Thalès emploie.

## Ce que le validateur contrôle

    node verifier.js 150            # 6 000 questions, 24 367 relations, 0 erreur
    CONTRE_EXEMPLES=1 node verifier.js   # 34/34
    node _build.js .                # régénérer les pages

Chaque question porte sa **figure**. Le validateur ne relit pas le générateur :
il reconstruit la figure à partir des points posés et **recalcule** chaque
affirmation — « ABCD est un losange », « les trois points sont alignés »,
« AB = 5 » — en arithmétique exacte sur ℚ[√d], via
[`repere.js`](../brevet/README.md).

## Cinq défauts trouvés par le validateur, et non par la relecture

Aucun n'était visible à l'œil ; tous sont sortis d'un tirage sur des milliers.

1. **La famille 5 répondait « non alignés » sur trois points alignés.** Pour
   sortir un point d'une droite, le générateur décalait son **abscisse** — ce
   qui le laisse sur la droite dès que celle-ci est horizontale. Il décale
   maintenant du vecteur **normal**, qui n'est jamais colinéaire.
2. Ce défaut n'a pu être vu que parce qu'une règle manquait : **`non-alignes`**.
   Sans elle, seule la réponse « oui » était contrôlée — une page pouvait
   affirmer « non » sur n'importe quoi. La négation est une affirmation comme
   une autre.
3. La famille 5 pouvait poser `C = A`, question sans énoncé.
4. Les familles 1 et 3 produisaient **deux fois la même relation** quand les
   deux sommes (ou les deux différences) tombaient égales : l'élève ne pouvait
   plus décider laquelle ranger où. Les opérandes sont maintenant nommés —
   `xA + xB = …` et `yA + yB = …`.
5. La famille 6 divisait par `u[0]`, nul dès que la droite était verticale.

## Deux falsifications qui refusaient de mordre

Elles visaient un point qu'on décale d'une unité — et **selon le tirage**, la
réponse restait vraie : une droite axiale absorbe le décalage, et la famille 5
pose une question dont la réponse est tantôt « oui », tantôt « non ». Ce
n'était pas le validateur qui était faible, c'était la visée.

Elles frappent maintenant ce qui ne dépend d'aucun tirage : on **retourne la
réponse** (aligné ↔ non aligné, parallèle ↔ perpendiculaire), et on **aplatit
la figure** en confondant deux points — un vecteur nul étant à la fois
colinéaire et orthogonal à tout, c'est exactement ce que les `distincts` sont
là pour refuser.
