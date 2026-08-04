// Exercice 14 :  A = -p - (q + x) - [r - (x + q)] + (x - s)
//   1) montrer A = x + k   2) calculer A si |x - q| = r   3) trouver x si A + t = 0
(function (racine) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports;
  const F = M ? require('./noyau.js') : racine.Somme;
  const S = M ? require('./formes.js') : racine.Formes;
  const Q = M ? require('./questions.js') : racine.Questions;

  function f() {
    const sh = S.forme14();
    const q = S.fracPos([2, 4]), r = S.fracPos([4, 2]);
    const t = S.fracPos([4, 2]);
    // A + t = 0  ⟹  x = -k - t
    return [
      Q.montrer(sh),
      Q.parValeurAbsolue(sh, q, r),
      Q.trouverCombinaison(sh, F.neg(t))
    ];
  }
  F.enregistrer(14, { titre: 'عبارة في x، مع قيمة مطلقة', f, questions: 3 });
  if (M) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
