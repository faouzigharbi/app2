// 5 — Racine carrée exacte par décomposition : tous les exposants sont pairs.
(function (racine) {
  'use strict';
  const A = (typeof module !== 'undefined' && module.exports) ? require('./arith.js') : racine.Arith;
  const O = (typeof module !== 'undefined' && module.exports) ? require('./outils.js') : racine.Outils;

  function f() {
    let base, N;
    do {
      base = O.tirerFacteurs(A.ent(2, 3), 1, 2, 400, [2, 3, 5, 7, 11]);
      N = Math.pow(O.valeur(base), 2);
    } while (N > 200000 || O.valeur(base) < 10);
    const r = O.valeur(base);
    const carre = base.map(([p, e]) => [p, 2 * e]);
    return {
      enonce: 'احسب ' + '√' + N + ' بالتفكيك إلى جداء عوامل أوّلية.',
      indice: 'انظر إن كانت كلّ الأسس زوجية',
      etapes: [
        ['نفكّك إلى عوامل أوّلية', N + ' = ' + A.ecrire(carre)],
        ['نلاحظ', 'كلّ الأسس زوجية'],
        ['نكتب على شكل مربّع', N + ' = (' + A.ecrire(base) + ')^2'],
        ['نحسب الأساس', A.ecrire(base) + ' = ' + r],
        ['الجذر التربيعي', '= ' + r]
      ],
      res: r,
      controle: { type: 'racine', N, r }
    };
  }
  A.enregistrer(5, { titre: 'الجذر التربيعي بالتفكيك', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
