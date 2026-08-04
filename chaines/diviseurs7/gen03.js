// 3 — A est un multiple de B : tous les facteurs de B se retrouvent dans A
// avec un exposant au moins égal. Le quotient se lit sur les exposants.
(function (racine) {
  'use strict';
  const A = (typeof module !== 'undefined' && module.exports) ? require('./arith.js') : racine.Arith;
  const O = (typeof module !== 'undefined' && module.exports) ? require('./outils.js') : racine.Outils;

  function f() {
    let facB, facA, k;
    do {
      facB = O.tirerFacteurs(2, 1, 3, 400);
      // On augmente les exposants : A garde les mêmes premiers, en plus grand.
      facA = facB.map(([p, e]) => [p, e + A.ent(0, 2)]);
      if (Math.random() < 0.5) facA.push([A.choix([2, 3, 5, 7, 11])
        .valueOf(), 1]);                                  // un premier en plus
      const vus = {};
      facA = facA.filter(([p, e]) => (vus[p] ? false : (vus[p] = 1)));
      facA.sort((x, y) => x[0] - y[0]);
      k = O.valeur(facA) / O.valeur(facB);
    } while (O.valeur(facA) > 40000 || k === 1 || !Number.isInteger(k));

    const Av = O.valeur(facA), Bv = O.valeur(facB);
    return {
      enonce: 'بيّن أنّ العدد ' + Av + ' مضاعف للعدد ' + Bv
        + '، ثمّ حدّد خارج القسمة الإقليدية لـ ' + Av + ' على ' + Bv + '.',
      indice: 'قارن الأسس عاملا بعامل',
      etapes: [
        ['نفكّك إلى عوامل أوّلية', A.decomposer(Av) + ' و ' + A.decomposer(Bv)],
        ['نلاحظ', 'كلّ عوامل ' + Bv + ' موجودة في ' + Av + ' بأسّ أكبر أو يساوي'],
        ['نكتب الجداء', Av + ' = ' + Bv + ' × ' + k],
        ['إذن', Av + ' مضاعف للعدد ' + Bv],
        ['خارج القسمة', Av + ' : ' + Bv + ' = ' + k],
        ['النتيجة', '= ' + k]
      ],
      res: k,
      controle: { type: 'multiple', A: Av, B: Bv, k }
    };
  }
  A.enregistrer(3, { titre: 'مضاعف وخارج القسمة', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
