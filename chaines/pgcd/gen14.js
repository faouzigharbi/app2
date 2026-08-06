// Exercice 14 — nombre de stylos, rangés en boîtes de a, b ou c.
// Même ressort que le 13 (PPCM), mais l'intervalle est large de 1000 : il faut
// donc un PPCM supérieur à 1000 pour que la réponse reste unique.
(function (racine) {
  'use strict';
  const A = (typeof module !== 'undefined' && module.exports)
    ? require('./arith.js') : racine.Arith;
  const BOITES = [15, 20, 24, 25, 30, 36, 40, 45, 48, 50];

  function tirage() {
    for (;;) {
      const t = BOITES.slice();
      const nb = [];
      for (let i = 0; i < 3; i++) nb.push(t.splice(Math.floor(Math.random() * t.length), 1)[0]);
      nb.sort((x, y) => x - y);
      const L = A.ppcmN(nb);
      if (L <= 1000 || L > 3000) continue;
      const k = A.ent(2, Math.floor(9000 / L));
      const N = k * L;
      if (N % 1000 === 0) continue;
      const min = 1000 * (Math.ceil(N / 1000) - 1), max = min + 1000;
      let combien = 0;
      for (let m = L; m <= max; m += L) if (m > min && m < max) combien++;
      if (combien !== 1) continue;
      return { nb, L, k, N, min, max };
    }
  }

  function f() {
    const { nb, L, k, N, min, max } = tirage();
    const comb = A.combiner(nb, 'max');
    return {
      enonce: 'في مصنع للأقلام الفاخرة يمكن وضع الأقلام في علب تتسع إلى ' + nb[0]
        + ' أو ' + nb[1] + ' أو ' + nb[2] + ' قلما. ما هو عدد الأقلام إذا علمت أنّه محصور بين '
        + min + ' و ' + max + '؟',
      indice: 'العدد مضاعف مشترك لسعات العلب',
      etapes: [
        ['نترجم', 'العلب تمتلئ تماما، إذن العدد مضاعف مشترك للسعات'],
        ['نفكّك إلى عوامل أوّلية', nb.map(A.decomposer).join(' و ')],
        ['م.م.أ: كل عامل بأكبر أسّ', comb.texte + ' = ' + L],
        ['نبحث عن مضاعف لـ ' + L + ' بين ' + min + ' و ' + max, k + ' × ' + L + ' = ' + N],
        ['النتيجة', '= ' + N]
      ],
      res: N,
      controle: { nb, L, N, min, max, type: 'ppcm' }
    };
  }

  A.enregistrer(14, { titre: 'عدد الأقلام — م.م.أ', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
