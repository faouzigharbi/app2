// Exercice 16 — remplir une boîte de cubes identiques sans laisser de vide.
// L'arête divise les trois dimensions : toutes les solutions sont les diviseurs
// communs, c'est-à-dire les diviseurs du PGCD. La plus grande est le PGCD.
(function (racine) {
  'use strict';
  const A = (typeof module !== 'undefined' && module.exports)
    ? require('./arith.js') : racine.Arith;

  function tirage() {
    for (;;) {
      const d = A.choix([12, 14, 15, 16, 17, 18, 20, 21, 24]);
      const x = A.ent(6, 40), y = A.ent(6, 40), z = A.ent(6, 40);
      if (A.pgcdN([x, y, z]) !== 1) continue;       // sinon le PGCD dépasse d
      const t = [d * x, d * y, d * z].sort((m, n) => n - m);
      if (t[2] < 100 || t[0] > 900) continue;
      return { d, dims: t };
    }
  }

  function f() {
    const { d, dims } = tirage();
    const divs = A.diviseurs(d);
    const comb = A.combiner(dims, 'min');

    return {
      enonce: 'صندوق أبعاده بالملمتر ' + dims[0] + ' و ' + dims[1] + ' و ' + dims[2]
        + '، نريد أن نملأه بمكعّبات متطابقة من الصابون دون أن تبقى فراغات. '
        + 'ما هو طول حرف المكعّب؟ أعط جميع الحلول الممكنة، ثمّ أكبرها.',
      indice: 'طول الحرف يقسم الأبعاد الثلاثة',
      etapes: [
        ['نترجم', 'الحرف يقسم الأبعاد الثلاثة، إذن هو قاسم مشترك لها'],
        ['نفكّك إلى عوامل أوّلية', dims.map(A.decomposer).join(' و ')],
        ['ق.م.أ: العوامل المشتركة بأصغر أسّ', comb.texte + ' = ' + d],
        ['كل الحلول = قواسم ' + d, divs.join(' و ') + ' ملمتر'],
        ['أكبر حرف ممكن', '= ' + d]
      ],
      res: d,
      controle: { dims, d, divs, type: 'pgcd3' }
    };
  }

  A.enregistrer(16, { titre: 'مكعّبات داخل صندوق — ق.م.أ', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
