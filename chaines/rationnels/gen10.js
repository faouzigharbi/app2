// 10 — Réduire chaque expression, puis comparer par la différence.
// Les crochets imbriqués sont là pour travailler la suppression des
// parenthèses précédées d'un signe −.
(function (racine) {
  'use strict';
  const F = (typeof module !== 'undefined' && module.exports) ? require('./frac.js') : racine.Frac;
  const avecX = (x, c) => (c === 0 ? x : c < 0 ? x + ' - ' + (-c) : x + ' + ' + c);
  const nb = c => (c < 0 ? '(' + c + ')' : String(c));

  function f() {
    const x = F.choix(['x', 'a']);
    let p, q, r, s, t, cA, cB;
    do {
      p = F.ent(-9, 9); q = F.ent(-9, 9);
      r = F.ent(-9, 9); s = F.ent(-9, 9); t = F.ent(-9, 9);
      cA = p + q;                    //  p + (q + x)      = x + (p+q)
      cB = r - s - t;                //  r - [s - (x - t)] = x + (r-s-t)
    } while (cA === cB || cA === 0 || cB === 0);

    const exprA = p + ' + (' + nb(q) + ' + ' + x + ')';
    const exprB = r + ' - [' + s + ' - (' + x + ' - ' + t + ')]';
    const redA = avecX(x, cA), redB = avecX(x, cB);
    const diff = cA - cB;
    const op = diff > 0 ? '>' : '<';
    return {
      enonce: ['نعتبر العبارتين:', 'A = ' + exprA + '   ;   B = ' + exprB],
      indice: 'اختصر كلّ عبارة ثمّ استعمل الفرق',
      etapes: [
        ['نختصر الأولى', exprA + ' = ' + redA],
        ['نختصر الثانية', exprB + ' = ' + redB],
        ['نحسب الفرق', '(' + redA + ') - (' + redB + ') = ' + diff],
        ['نحدّد إشارة الفرق', diff + ' ' + op + ' 0'],
        ['النتيجة', redA + ' ' + op + ' ' + redB]
      ],
      res: redA + ' ' + op + ' ' + redB,
      controle: { type: 'litteral', vars: [x],
        claim: redA + ' ' + op + ' ' + redB,
        egalites: [exprA + ' = ' + redA, exprB + ' = ' + redB] }
    };
  }
  F.enregistrer(10, { titre: 'اختصار ثمّ مقارنة', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
