// 1 — Nombre de diviseurs d'un entier, lu sur les exposants.
(function (racine) {
  'use strict';
  const A = (typeof module !== 'undefined' && module.exports) ? require('./arith.js') : racine.Arith;
  const O = (typeof module !== 'undefined' && module.exports) ? require('./outils.js') : racine.Outils;

  function f() {
    const fac = O.tirerFacteurs(A.ent(2, 3), 1, 4, 20000);
    const N = O.valeur(fac), n = O.nbDiv(fac);
    return {
      enonce: 'فكّك العدد ' + N + ' إلى جداء عوامل أوّلية، ثمّ استنتج عدد قواسمه.',
      indice: 'عدد القواسم يُقرأ على الأسس',
      etapes: [
        ['نفكّك إلى عوامل أوّلية', A.decomposer(N)],
        ['القاعدة', 'نضيف 1 إلى كلّ أسّ ثمّ نضرب'],
        ['نطبّق', O.detailNbDiv(fac) + ' = ' + n],
        ['النتيجة', '= ' + n]
      ],
      res: n,
      controle: { type: 'nbdiv', N, n }
    };
  }
  A.enregistrer(1, { titre: 'عدد القواسم', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
