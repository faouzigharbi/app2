// Exercice 16 :  A = -p - (x - q) - [r - (y + s)]
//   1) montrer A = y - x + k   2) trouver y - x   3) calculer A (deux cas)
//   4) deux équations en z, dont une à valeur absolue
(function (racine) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports;
  const F = M ? require('./noyau.js') : racine.Somme;
  const S = M ? require('./formes.js') : racine.Formes;
  const Q = M ? require('./questions.js') : racine.Questions;
  const { rat, add, sub, neg, txt } = F;

  function f() {
    const sh = S.forme16();
    const cible = rat(S.entNonNul(-15, 15));
    const vx = rat(S.entNonNul(-9, 9)), vy = rat(S.entNonNul(-9, 9));
    const s = rat(S.entNonNul(-14, 14));

    // 4-a)  A0 - (-B0 - x) = C0   ⟹   A0 + B0 + x = C0
    const A0 = rat(S.entNonNul(-9, 9)), B0 = rat(S.entNonNul(-9, 9));
    const C0 = rat(S.entNonNul(-9, 9));
    const K0 = add(A0, B0), sol0 = sub(C0, K0);
    const eq0 = {
      enonce: ['جد العدد الكسري النسبي x بحيث:', txt(A0) + ' - (' + txt(neg(B0)) + ' - x) = ' + txt(C0)],
      indice: 'القوس مسبوق بعلامة الطرح: كل حدّ بداخله يغيّر علامته',
      etapes: [
        ['نرفع القوس', txt(A0) + ' + ' + F.par(B0) + ' + x = ' + txt(C0)],
        ['نحسب الثابت', txt(A0) + ' + ' + F.par(B0) + ' = ' + txt(K0)],
        ['نكتب المعادلة', txt(K0) + ' + x = ' + txt(C0)],
        ['نعزل المجهول', 'x = ' + F.par(C0) + ' - ' + F.par(K0)],
        ['النتيجة', 'x = ' + txt(sol0)]
      ],
      controle: { type: 'equation', eq: txt(A0) + ' - (' + txt(neg(B0)) + ' - x) = ' + txt(C0), sol: sol0 }
    };

    // 4-b)  D0 + (|x| - E0) = G0   ⟹   |x| = G0 - D0 + E0
    let D0, E0, G0, m;
    for (;;) {
      D0 = rat(F.ent(1, 14)); E0 = rat(F.ent(1, 9)); G0 = rat(S.entNonNul(-6, 6));
      m = add(sub(G0, D0), E0);
      if (m.n !== 0) break;
    }
    const abs = Q.equationAbsolue(
      txt(D0) + ' + (|x| - ' + txt(E0) + ') = ' + txt(G0),
      txt(G0) + ' - ' + txt(D0) + ' + ' + txt(E0), m,
      'ارفع القوس أولا، ثمّ اعزل |x| و انظر إلى إشارته');

    return [
      Q.montrer(sh),
      Q.trouverCombinaison(sh, cible),
      Q.parValeurs(sh, vy, vx),
      Q.parRelation(sh, s, null, 'x - y'),
      eq0, abs
    ];
  }
  F.enregistrer(16, { titre: 'عبارة في x و y، ثمّ معادلتان', f, questions: 6 });
  if (M) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
