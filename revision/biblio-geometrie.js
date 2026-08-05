// LA BIBLIOTHÈQUE ÉCRITE À LA MAIN — celle-ci, on la modifie.
//
// Le générateur des puissances remplit `biblio-puiss9.js` tout seul ; la
// géométrie n'a pas de générateur, et n'en aura pas : ses exercices sont
// choisis, pas calculés. Ils s'écrivent donc ici, un par accolade.
//
// UN EXERCICE, C'EST :
//
//   rubrique       la clé, sans espace ni accent — c'est elle qui regroupe
//   rubriqueNom    le nom affiché sur l'écran de choix et sur la feuille
//   difficulte     'facile' | 'moyen' | 'difficile'
//   enonce         l'énoncé, en HTML. Le mathématique s'entoure de
//                  <span dir="ltr">…</span>, sinon il se retourne dans la page
//                  arabe. Une figure est un <svg> posé là, tel quel.
//   correction     la suite des étapes : { quoi: 'ce qu'on fait',
//                                          math: 'ce que ça donne' }
//                  C'est cette liste qui décide aussi de la place laissée à
//                  l'élève pour écrire : six étapes, six lignes de blanc.
//   source         la feuille d'où l'exercice vient. On doit toujours pouvoir
//                  y remonter.
//
// Rien d'autre n'est obligatoire. Ajouter une rubrique, c'est ajouter un
// exercice qui la porte : l'écran de choix se met à jour tout seul.

window.BIBLIO = (window.BIBLIO || []).concat([

  {
    id: 'geo-haut-01', chapitre: 'geometrie', chapitreNom: 'الهندسة', niveau: 8,
    rubrique: 'hauteurs', rubriqueNom: 'الارتفاعات في المثلّث', difficulte: 'moyen',
    enonce: 'ABC مثلّث حيث <span dir="ltr">BC = 8 cm</span> و الارتفاع '
          + 'الصادر من A طوله <span dir="ltr">5 cm</span>.<br>'
          + 'أحسب مساحة المثلّث ABC.',
    correction: [
      { quoi: 'القاعدة', math: '<span dir="ltr">S = (base × hauteur) : 2</span>' },
      { quoi: 'نعوّض', math: '<span dir="ltr">S = (8 × 5) : 2</span>' },
      { quoi: 'نحسب البسط', math: '<span dir="ltr">8 × 5 = 40</span>' },
      { quoi: 'النتيجة', math: '<span dir="ltr">S = 20 cm²</span>' }
    ],
    source: 'exemple — à remplacer'
  }

]);
