// LE MONTAGE DU NIVEAU — quelles familles, à quelle difficulté, en quel ordre.
//
// C'est le SEUL fichier qui distingue puiss7, puiss8 et puiss9. Les familles
// sont les mêmes, le noyau est le même, le validateur est le même : ici on dit
// lesquelles ce niveau enseigne, et avec quels nombres elles ont le droit de
// tirer. Alléger un niveau, en réordonner les pages, en retirer une : cela se
// fait ici, et nulle part ailleurs.
//
// Une page = une famille à une difficulté, et DIX questions retirées à chaque
// chargement. La réserve est donc inépuisable : deux élèves côte à côte n'ont
// jamais la même feuille.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Puiss;
  const X = M ? require('./familles.js') : racine.Familles;

  const NIVEAU = 9;
  const QUESTIONS = 10;

  // Deux fois plus de « difficile » que des autres : c'est là que le chapitre
  // se joue, et c'est là que l'élève a besoin de répétition.
  const DIFFICULTES = [
    ['facile', 'مستوى سهل'],
    ['moyen', 'مستوى متوسّط'],
    ['difficile', 'مستوى صعب'],
    ['difficile', 'مستوى صعب — تمارين إضافية']
  ];

  const FAMILLES = [
    [X.produitMemeBase, 'جداء قوى لنفس الأساس'],
    [X.puissanceDePuissance, 'قوّة القوّة'],
    [X.memeExposant, 'نفس الأسّ — أساسان'],
    [X.baseAReconnaitre, 'الأساس المشترك يجب أن يُكتشف'],
    [X.facteurCommun, 'إخراج القوّة المشتركة'],
    [X.calcul, 'حساب عبارة — ترتيب العمليات']
  ];

  let n = 0;
  for (const [f, titre] of FAMILLES) {
    for (const [diff, etiquette] of DIFFICULTES) {
      n++;
      F.enregistrer(n, {
        titre: titre + ' — ' + etiquette,
        famille: titre,
        difficulte: diff,
        questions: QUESTIONS,
        f: () => Array.from({ length: QUESTIONS }, () => f(NIVEAU, diff))
      });
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
