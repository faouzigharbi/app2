// 7 — PGCD par décomposition : facteurs communs, chacun au plus petit exposant.
(function (racine) {
  'use strict';
  const A = (typeof module !== 'undefined' && module.exports) ? require('./arith.js') : racine.Arith;
  const O = (typeof module !== 'undefined' && module.exports) ? require('./outils.js') : racine.Outils;

  function tirage() {
    for (;;) {
      const commun = O.tirerFacteurs(A.ent(1, 2), 1, 2, 60, [2, 3, 5, 7]);
      const d = O.valeur(commun);
      const x = A.ent(2, 30), y = A.ent(2, 30);
      if (x === y || A.pgcd(x, y) !== 1) continue;        // sinon le PGCD dépasse d
      const a = d * x, b = d * y;
      if (a > 9000 || b > 9000 || d < 4) continue;
      // Un PGCD premier donnerait l'étape « 7 = 7 » : sans contenu.
      if (A.combiner([a, b], 'min').texte === String(d)) continue;
      return { a: Math.max(a, b), b: Math.min(a, b), d };
    }
  }

  function f() {
    const { a, b, d } = tirage();
    return {
      enonce: 'احسب ق.م.أ (' + a + ' , ' + b + ') بالتفكيك إلى جداء عوامل أوّلية.',
      indice: 'العوامل المشتركة، كلّ واحد بأصغر أسّ',
      etapes: [
        ['نفكّك إلى عوامل أوّلية', A.decomposer(a) + ' و ' + A.decomposer(b)],
        ['القاعدة', 'نأخذ العوامل المشتركة فقط، كلّ واحد بأصغر أسّ'],
        ['نطبّق', A.combiner([a, b], 'min').texte + ' = ' + d],
        ['النتيجة', '= ' + d]
      ],
      res: d,
      controle: { type: 'pgcd', a, b, d }
    };
  }
  A.enregistrer(7, { titre: 'ق.م.أ بالتفكيك', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
