# العمليات في ℝ — حساب عبارات بها جذور تربيعية (9 أساسي)

D'après les deux séries de Jawher Souissi (riadhyet.com, 2018-19). Huit
familles, une page chacune.

| page | famille |
|---|---|
| ex01 | écrire √n sous la forme a√b |
| ex02 | somme et différence — radicaux semblables |
| ex03 | produit et quotient |
| ex04 | développer — identités remarquables et conjugués |
| ex05 | factoriser par un radical commun |
| ex06 | rendre le dénominateur rationnel |
| ex07 | deux nombres inverses |
| ex08 | √(x²) = |x| — la faute du chapitre |

## Le moteur

`racines.js` calcule **exactement** sur les sommes `Σ qᵢ√dᵢ` avec dᵢ sans
facteur carré. √48 n'existe pas : il vaut 4√3. L'ensemble est clos — produit
(`√a·√b = √(ab)` renormalisé) et quotient par **conjugaisons successives**, le
geste même que la fiche demande. `√(6 − 4√2)` est extrait exactement en
résolvant `(a + b√d)² = p + q√d` en rationnels, ce qui permet `√((x−√3)²)`.

Aucun flottant n'intervient dans une égalité ; les décimales ne servent qu'à
décider un signe sous une valeur absolue.

    node moteur_test.js     # 47 expressions PRISES DANS LES FICHES, 0 écart

## Trois contrôles

    node verifier.js 40             # les mathématiques sont-elles justes ?
    CONTRE_EXEMPLES=1 node verifier.js
    node audit.js 50                # un professeur écrirait-il cela ?

`audit.js` a trouvé six défauts réels, tous corrigés : des `1√15`, des `/1`,
un indice qui donnait la réponse, et surtout des **carrés parfaits restés sous
le radical** — une réponse `2√12` est fausse en tant que réponse, même si le
nombre est bon.

## Régénérer les pages

    node _build.js .
