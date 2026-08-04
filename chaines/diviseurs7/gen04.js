// 4 — Montrer qu'un nombre est le cube d'un entier : tous les exposants de sa
// décomposition sont multiples de 3.
(function (racine) {
  'use strict';
  const A = (typeof module !== 'undefined' && module.exports) ? require('./arith.js') : racine.Arith;
  const O = (typeof module !== 'undefined' && module.exports) ? require('./outils.js') : racine.Outils;

  function f() {
    let base, N;
    do {
      base = O.tirerFacteurs(A.ent(1, 2), 1, 2, 66, [2, 3, 5, 7, 11, 13]);
      N = Math.pow(O.valeur(base), 3);
    } while (N > 300000 || O.valeur(base) < 6);
    const r = O.valeur(base);
    const cube = base.map(([p, e]) => [p, 3 * e]);
    return {
      enonce: 'بيّن بالتفكيك إلى جداء عوامل أوّلية أنّ العدد ' + N
        + ' مكعّب لعدد صحيح طبيعي، ثمّ حدّد هذا العدد.',
      indice: 'انظر إن كانت الأسس مضاعفات للعدد 3',
      etapes: [
        ['نفكّك إلى عوامل أوّلية', N + ' = ' + A.ecrire(cube)],
        ['نلاحظ', 'كلّ الأسس مضاعفات للعدد 3'],
        ['نكتب على شكل مكعّب', N + ' = (' + A.ecrire(base) + ')^3'],
        ['نحسب الأساس', A.ecrire(base) + ' = ' + r],
        ['العدد المطلوب', '= ' + r]
      ],
      res: r,
      controle: { type: 'cube', N, r }
    };
  }
  A.enregistrer(4, { titre: 'مكعّب لعدد صحيح', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
