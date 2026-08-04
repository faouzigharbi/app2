// 6 — Même numérateur. Le point délicat : avec un numérateur NÉGATIF, l'ordre
// s'inverse. 13/5 > 13/8 mais −13/5 < −13/8.
(function (racine) {
  'use strict';
  const F = (typeof module !== 'undefined' && module.exports) ? require('./frac.js') : racine.Frac;

  function f() {
    const n = F.ent(3, 25) * F.choix([1, -1]);
    let d1, d2;
    do { d1 = F.ent(2, 15); d2 = F.ent(2, 15); } while (d1 === d2);
    const a = F.rat(n, d1), b = F.rat(n, d2);
    const op = F.cmp(a, b) < 0 ? '<' : '>';
    const opD = d1 < d2 ? '<' : '>';
    return {
      enonce: ['قارن العددين:', n + '/' + d1 + '  ;  ' + n + '/' + d2],
      indice: 'البسط نفسه — انتبه إلى إشارته',
      etapes: [
        ['نلاحظ', 'البسط نفسه في العددين'],
        ['نقارن المقامين', d1 + ' ' + opD + ' ' + d2],
        ['القاعدة', n < 0 ? 'البسط سالب: كلّما كبر المقام كبر الكسر — الترتيب ينعكس'
                          : 'البسط موجب: كلّما كبر المقام صغر الكسر'],
        ['النتيجة', n + '/' + d1 + ' ' + op + ' ' + n + '/' + d2]
      ],
      res: n + '/' + d1 + ' ' + op + ' ' + n + '/' + d2,
      controle: { type: 'compare', a: n + '/' + d1, b: n + '/' + d2, op }
    };
  }
  F.enregistrer(6, { titre: 'نفس البسط', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
