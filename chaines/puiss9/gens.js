// LE MONTAGE DU NIVEAU — quelles familles, à quelle difficulté, en quel ordre.
//
// C'est le SEUL fichier qui distingue puiss7, puiss8 et puiss9. Le catalogue
// d'énoncés est le même, le noyau est le même, le constructeur de chaînes est
// le même : ici on dit ce que CE niveau enseigne. Alléger un niveau, en
// réordonner les pages, en retirer une : cela se fait ici et nulle part ailleurs.
//
// Une page = une famille à une difficulté. Ses questions sont les ITEMS RÉELS
// de la feuille, pris dans cette case — jamais inventés. Quand la case en
// contient plus que la page n'en montre, on en tire dix au hasard : deux élèves
// côte à côte n'ont pas la même feuille, et pourtant tous deux travaillent sur
// les énoncés du maître.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Puiss;
  const I = M ? require('./items.js') : racine.Items;
  const C = M ? require('./chaines.js') : racine.Chaines;

  const NIVEAU = 9;
  const PAR_PAGE = 10;

  // Deux fois plus de « difficile » que des autres : c'est là que le chapitre
  // se joue, et c'est là que l'élève a besoin de répétition.
  const DIFFICULTES = [
    ['facile', 'مستوى سهل'],
    ['moyen', 'مستوى متوسّط'],
    ['difficile', 'مستوى صعب'],
    ['difficile', 'مستوى صعب — تمارين إضافية']
  ];

  const FAMILLES = [
    ['produit', 'جداء قوى لنفس الأساس'],
    ['base-commune', 'الأساس المشترك يجب أن يُكتشف'],
    ['puissance-de-puissance', 'قوّة القوّة'],
    ['meme-exposant', 'نفس الأسّ — أساسان'],
    ['facteur-commun', 'إخراج القوّة المشتركة'],
    ['calcul', 'حساب عبارة — ترتيب العمليات']
  ];

  // Tire n items d'une case, sans répétition, en complétant par les autres
  // difficultés de la même famille si la case est trop petite pour la page.
  function puiser(famille, diff, n) {
    const case1 = I.par(famille, NIVEAU, diff);
    const reste = I.ITEMS.filter(x => x.f === famille && x.n <= NIVEAU && x.d !== diff);
    const pool = case1.slice();
    const sac = [];
    while (sac.length < n && pool.length) sac.push(pool.splice(F.ent(0, pool.length - 1), 1)[0]);
    const p2 = reste.slice();
    while (sac.length < n && p2.length) sac.push(p2.splice(F.ent(0, p2.length - 1), 1)[0]);
    return sac;
  }

  let n = 0;
  for (const [famille, titre] of FAMILLES) {
    for (const [diff, etiquette] of DIFFICULTES) {
      if (!I.par(famille, NIVEAU, diff).length) continue;
      n++;
      F.enregistrer(n, {
        titre: titre + ' — ' + etiquette,
        famille, difficulte: diff,
        questions: PAR_PAGE,
        f: () => puiser(famille, diff, PAR_PAGE).map(C.chaine).filter(Boolean)
      });
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
