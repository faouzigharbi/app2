// Exercice 9 : une forme à coefficients 2, puis trois comparaisons — toutes
// par le signe de la différence, jamais autrement.
(function (racine) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports;
  const F = M ? require('./noyau.js') : racine.Somme;
  const S = M ? require('./formes.js') : racine.Formes;
  const Q = M ? require('./questions.js') : racine.Questions;
  const { rat, add, sub, neg, txt, ent, choix } = F;

  function f() {
    const sh = S.forme09();
    // 2) comparer x + c1 et x + c2
    let c1, c2;
    do { c1 = S.fracPos([4, 3]); c2 = S.fracPos([3, 4]); } while (F.egaux(c1, c2));
    // 3) a - b connu : comparer -a - p et -b + q
    //    différence = (b - a) - p - q, calculable
    let d3, p3, q3;
    do {
      d3 = rat(S.entNonNul(-9, 9), choix([2, 7, 14]));
      p3 = S.fracPos([7, 14]); q3 = S.fracPos([14, 7]);
    } while (add(neg(d3), F.sub(neg(p3), q3)).n === 0);
    // 4) a - b et c - a donnés : (a - c) - (a - b) = b - c
    let ab, ca;
    do { ab = rat(S.entNonNul(-8, 8), choix([2, 4])); ca = rat(S.entNonNul(-8, 8), choix([2, 4])); }
    while (add(neg(ca), neg(ab)).n === 0);
    const bc = sub(neg(ca), ab);          // b - c = -(c-a) - (a-b)
    const petit = F.signe(bc) < 0;

    return [
      Q.montrer(sh),
      Q.comparerMemeInconnue('x', c1, c2),
      Q.comparerParDifferenceCalculee({
        vars: 'a و b', combi: 'b - a', valeur: neg(d3),
        cste: F.sub(neg(p3), q3),
        g: '-a - ' + txt(p3), d: '-b + ' + txt(q3),
        libres: ['a'], lie: { nom: 'b', via: 'difference', autre: 'a', valeur: d3 }
      }),
      {
        enonce: ['ليكن a و b و c أعدادا كسرية نسبية حيث', 'a - b = ' + txt(ab)
                 + ' و c - a = ' + txt(ca), '؛ احسب', '(a - c) - (a - b)',
                 'ثمّ استنتج مقارنة b و c'],
        indice: 'انشر الفرق: a يختفي، و يبقى b - c',
        etapes: [
          ['نرفع القوسين', '(a - c) - (a - b) = a - c - a + b'],
          ['يختفي a', 'a - c - a + b = b - c'],
          ['نعبّر بالمعطيين', 'b - c = -(c - a) - (a - b)'],
          ['نعوّض', 'b - c = -' + F.par(ca) + ' - ' + F.par(ab)],
          ['نحسب', 'b - c = ' + txt(bc)],
          ['نحدّد إشارة الفرق', txt(bc) + (petit ? ' < 0' : ' > 0')],
          ['النتيجة', 'b' + (petit ? ' < ' : ' > ') + 'c']
        ],
        controle: { type: 'signe', defs: {}, libres: ['a'],
                    lie: [{ nom: 'b', via: 'difference', autre: 'a', valeur: ab },
                          { nom: 'c', via: 'plus', autre: 'a', valeur: ca }],
                    relation: { g: 'b', d: 'c', sens: petit ? -1 : 1 } }
      }
    ];
  }
  F.enregistrer(9, { titre: 'معاملات مضاعفة، ثمّ ثلاث مقارنات', f, questions: 4 });
  if (M) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
