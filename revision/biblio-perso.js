// LA BIBLIOTHÈQUE ÉCRITE À LA MAIN — la seule qu'on modifie.
//
// Les autres `biblio-*.js` sont ENGENDRÉS : `node exporter.js --tout` les
// réécrit d'un bloc, et tout ce qu'on y aurait ajouté disparaîtrait. Celui-ci
// n'est jamais touché par l'exportateur.
//
// À quoi il sert : aux exercices qu'aucun générateur ne produit. Un énoncé
// avec une photo, une question de cours, un problème pris tel quel dans un
// devoir. Tout ce dont le corrigé s'écrit à la main.
//
// À quoi il ne sert pas : à ce qu'une fiche sait déjà engendrer. Un corrigé
// écrit à la main n'est vérifié par personne ; un corrigé engendré l'a été
// des milliers de fois. Quand le choix existe, il n'en est pas un.
//
// UN EXERCICE, C'EST :
//
//   chapitre       la clé du chapitre, sans espace ni accent
//   chapitreNom    le nom arabe, affiché sur l'écran et sur la feuille
//   niveau         7, 8 ou 9 — c'est lui qui range le chapitre sur l'écran
//   rubrique       la clé de la rubrique
//   rubriqueNom    son nom arabe
//   difficulte     'facile' | 'moyen' | 'difficile', ou '' si l'on ne sait pas
//                  — une case vide se tire à tous les niveaux, et c'est mieux
//                  que d'inventer un niveau
//   enonce         l'énoncé, en HTML. Le mathématique s'entoure de
//                  <span dir="ltr" class="expr">…</span>, sinon il se retourne
//                  dans la page arabe. Une figure est un <svg> posé là.
//   correction     la suite des étapes : { quoi: 'ce qu'on fait',
//                                          math: 'ce que ça donne' }
//                  C'est cette liste qui décide aussi de la place laissée à
//                  l'élève : six étapes, six lignes de blanc.
//   source         la feuille d'où l'exercice vient. On doit toujours pouvoir
//                  y remonter.
//
// Ajouter une rubrique, c'est ajouter un exercice qui la porte : l'écran de
// choix se met à jour tout seul, et les compteurs avec lui.
//
// EXEMPLE (à effacer) :
//
//   { id: 'perso-01', chapitre: 'geometrie', chapitreNom: 'الهندسة', niveau: 8,
//     rubrique: 'aires', rubriqueNom: 'المساحات', difficulte: 'moyen',
//     enonce: 'ABC مثلّث حيث <span dir="ltr" class="expr">BC = 8 cm</span> و '
//           + 'الارتفاع الصادر من A طوله <span dir="ltr" class="expr">5 cm</span>.'
//           + '<br>أحسب مساحة المثلّث ABC.',
//     correction: [
//       { quoi: 'القاعدة', math: '<span dir="ltr" class="expr">S = (b × h) : 2</span>' },
//       { quoi: 'نعوّض',  math: '<span dir="ltr" class="expr">S = (8 × 5) : 2</span>' },
//       { quoi: 'النتيجة', math: '<span dir="ltr" class="expr">S = 20 cm²</span>' }
//     ],
//     source: 'à remplir' }

window.BIBLIO = (window.BIBLIO || []).concat([

]);
