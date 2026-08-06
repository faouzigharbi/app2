// 5 — Produit en croix. Valable seulement si les deux nombres sont positifs,
// et la chaîne le dit explicitement.
(function (racine) {
  'use strict';
  const F = (typeof module !== 'undefined' && module.exports) ? require('./frac.js') : racine.Frac;

  function f() {
    let a, b;
    do {
      a = F.rat(F.ent(1, 30), F.ent(7, 80));
      b = F.rat(F.ent(1, 30), F.ent(7, 80));
    } while (F.cmp(a, b) === 0 || a.d === 1 || b.d === 1 || a.d === b.d);

    const g = a.n * b.d, dr = b.n * a.d;
    const op = g > dr ? '>' : '<';
    return {
      enonce: ['قارن العددين:', F.txt(a) + '  ;  ' + F.txt(b)],
      indice: 'اضرب تقاطعيا — العددان موجبان',
      etapes: [
        ['نلاحظ', 'العددان موجبان، إذن الضرب التقاطعي مشروع'],
        ['نضرب تقاطعيا', a.n + ' × ' + b.d + ' = ' + g + ' ; ' + b.n + ' × ' + a.d + ' = ' + dr],
        ['نقارن الجداءين', g + ' ' + op + ' ' + dr],
        ['النتيجة', F.txt(a) + ' ' + op + ' ' + F.txt(b)]
      ],
      res: F.txt(a) + ' ' + op + ' ' + F.txt(b),
      controle: { type: 'compare', a: F.txt(a), b: F.txt(b), op }
    };
  }
  F.enregistrer(5, { titre: 'الضرب التقاطعي', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
