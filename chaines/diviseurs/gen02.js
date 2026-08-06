// 2 — PGCD lu sur les DEUX ensembles de diviseurs (méthode de l'exercice 3
// de la fiche : on écrit les deux listes, on prend la plus grande commune).
(function (racine) {
  'use strict';
  const A = (typeof module !== 'undefined' && module.exports) ? require('./arith.js') : racine.Arith;
  const O = (typeof module !== 'undefined' && module.exports) ? require('./outils.js') : racine.Outils;

  function tirage() {
    for (;;) {
      const d = A.choix([6, 10, 14, 15, 21, 22, 26, 33, 35, 39]);
      const x = A.ent(2, 9), y = A.ent(2, 9);
      if (x === y || A.pgcd(x, y) !== 1) continue;
      const a = d * x, b = d * y;
      // Les deux listes doivent rester écrivables au tableau.
      if (A.diviseurs(a).length > 10 || A.diviseurs(b).length > 10) continue;
      if (a > 900 || b > 900) continue;
      return { a: Math.max(a, b), b: Math.min(a, b), d };
    }
  }

  function f() {
    const { a, b, d } = tirage();
    const comm = O.communs(a, b);
    return {
      enonce: 'حدّد مجموعة قواسم العددين ' + a + ' و ' + b + '، ثمّ استنتج ق.م.أ (' + a + ' , ' + b + ').',
      indice: 'اكتب القائمتين ثمّ ابحث عن المشترك',
      etapes: [
        ['نفكّك إلى عوامل أوّلية', A.decomposer(a) + ' و ' + A.decomposer(b)],
        ['قواسم ' + a, O.ensemble(A.diviseurs(a))],
        ['قواسم ' + b, O.ensemble(A.diviseurs(b))],
        ['القواسم المشتركة', O.ensemble(comm)],
        ['أكبر قاسم مشترك', A.combiner([a, b], 'min').texte + ' = ' + d],
        ['النتيجة', '= ' + d]
      ],
      res: d,
      controle: { type: 'pgcd-listes', a, b, d, comm }
    };
  }
  A.enregistrer(2, { titre: 'مجموعة القواسم ← ق.م.أ', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
