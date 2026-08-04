// 2 — Signes opposés : la conclusion tombe sans aucun calcul.
(function (racine) {
  'use strict';
  const F = (typeof module !== 'undefined' && module.exports) ? require('./frac.js') : racine.Frac;

  function f() {
    const a = F.rat(-F.ent(1, 25), F.ent(2, 15));
    const b = F.rat(F.ent(1, 25), F.ent(2, 15));
    const [g, d] = Math.random() < 0.5 ? [a, b] : [b, a];
    const op = F.cmp(g, d) < 0 ? '<' : '>';
    return {
      enonce: ['قارن العددين:', F.txt(g) + '  ;  ' + F.txt(d)],
      indice: 'انظر إلى الإشارتين قبل أن تحسب',
      etapes: [
        ['نلاحظ الإشارتين', 'أحد العددين سالب والآخر موجب'],
        ['القاعدة', 'كلّ عدد سالب أصغر من كلّ عدد موجب'],
        ['نتحقّق', F.txt(a) + ' < 0 ; 0 < ' + F.txt(b)],
        ['النتيجة', F.txt(g) + ' ' + op + ' ' + F.txt(d)]
      ],
      res: F.txt(g) + ' ' + op + ' ' + F.txt(d),
      controle: { type: 'compare', a: F.txt(g), b: F.txt(d), op }
    };
  }
  F.enregistrer(2, { titre: 'إشارتان مختلفتان', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
