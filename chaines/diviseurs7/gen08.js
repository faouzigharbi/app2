// 8 — PPCM par décomposition : TOUS les facteurs, chacun au plus grand exposant.
(function (racine) {
  'use strict';
  const A = (typeof module !== 'undefined' && module.exports) ? require('./arith.js') : racine.Arith;
  const O = (typeof module !== 'undefined' && module.exports) ? require('./outils.js') : racine.Outils;

  function tirage() {
    for (;;) {
      const a = O.valeur(O.tirerFacteurs(A.ent(1, 2), 1, 3, 200, [2, 3, 5, 7]));
      const b = O.valeur(O.tirerFacteurs(A.ent(1, 2), 1, 3, 200, [2, 3, 5, 7]));
      if (a === b || a < 6 || b < 6) continue;
      const L = A.ppcm(a, b);
      if (L > 20000 || L === a || L === b) continue;   // sinon la question est vide
      return { a: Math.max(a, b), b: Math.min(a, b), L };
    }
  }

  function f() {
    const { a, b, L } = tirage();
    return {
      enonce: 'احسب م.م.أ (' + a + ' , ' + b + ') بالتفكيك إلى جداء عوامل أوّلية.',
      indice: 'كلّ العوامل، كلّ واحد بأكبر أسّ',
      etapes: [
        ['نفكّك إلى عوامل أوّلية', A.decomposer(a) + ' و ' + A.decomposer(b)],
        ['القاعدة', 'نأخذ كلّ العوامل، كلّ واحد بأكبر أسّ'],
        ['نطبّق', A.combiner([a, b], 'max').texte + ' = ' + L],
        ['النتيجة', '= ' + L]
      ],
      res: L,
      controle: { type: 'ppcm', a, b, L }
    };
  }
  A.enregistrer(8, { titre: 'م.م.أ بالتفكيك', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
