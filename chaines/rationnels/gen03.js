// 3 — Comparer en passant par 1 (ou par −1) : l'un est en dessous, l'autre
// au-dessus, et le repère tranche.
(function (racine) {
  'use strict';
  const F = (typeof module !== 'undefined' && module.exports) ? require('./frac.js') : racine.Frac;

  function f() {
    const negatif = Math.random() < 0.5;
    const s = negatif ? -1 : 1;
    const repere = F.rat(s, 1);
    let petit, grand;
    do {
      const d1 = F.ent(3, 15), d2 = F.ent(3, 15);
      const sous = F.rat(s * F.ent(1, d1 - 1), d1);      // |·| < 1
      const sur = F.rat(s * F.ent(d2 + 1, d2 + 20), d2); // |·| > 1
      petit = negatif ? sur : sous;                       // le plus petit des deux
      grand = negatif ? sous : sur;
    } while (F.cmp(petit, grand) >= 0);

    const [g, d] = Math.random() < 0.5 ? [petit, grand] : [grand, petit];
    const op = F.cmp(g, d) < 0 ? '<' : '>';
    return {
      enonce: ['قارن العددين:', F.txt(g) + '  ;  ' + F.txt(d)],
      indice: 'قارن كلّ عدد بالوحدة',
      etapes: [
        ['نقارن الأوّل بالمرجع', F.txt(petit) + ' < ' + F.txt(repere)],
        ['نقارن الثاني بالمرجع', F.txt(grand) + ' > ' + F.txt(repere)],
        ['نرتّب', F.txt(petit) + ' < ' + F.txt(repere) + ' < ' + F.txt(grand)],
        ['النتيجة', F.txt(g) + ' ' + op + ' ' + F.txt(d)]
      ],
      res: F.txt(g) + ' ' + op + ' ' + F.txt(d),
      controle: { type: 'compare', a: F.txt(g), b: F.txt(d), op }
    };
  }
  F.enregistrer(3, { titre: 'المقارنة بالوحدة', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
