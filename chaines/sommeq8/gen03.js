// Exercice 3 : « احسب بأيسر طريقة » — le calcul astucieux, puis quatre
// équations. Ce n'est pas le résultat qui est en jeu, c'est le chemin :
// on repère les termes opposés AVANT de calculer quoi que ce soit.
(function (racine) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports;
  const F = M ? require('./noyau.js') : racine.Somme;
  const S = M ? require('./formes.js') : racine.Formes;
  const Q = M ? require('./questions.js') : racine.Questions;
  const { rat, add, sub, neg, abs, signe, txt, par, plus, ent, choix } = F;

  function f() {
    // 1) A = [p + (-t)] + [q + t]   — t et -t s'annulent
    let p, q, t, A;
    do {
      p = rat(ent(1, 11), choix([5, 3, 4])); q = rat(ent(-11, -1), choix([15, 5, 6]));
      t = rat(ent(1, 19), choix([21, 12, 14]));
      A = add(p, q);
    } while (A.n === 0 || F.egaux(p, neg(q)));
    const exprA = '[' + txt(p) + ' + (' + txt(neg(t)) + ')] + [' + par(q) + ' + ' + txt(t) + ']';
    const platA = txt(p) + ' - ' + txt(t) + plus(q) + ' + ' + txt(t);
    const resteA = txt(p) + plus(q);

    // 2) B = |−r + s| − |−u + s|   — deux valeurs absolues à évaluer d'abord
    let r, u, s, b1, b2, B;
    do {
      r = rat(ent(1, 9), choix([7, 5])); u = rat(ent(1, 9), choix([2, 4]));
      s = rat(ent(1, 13), choix([14, 10]));
      b1 = abs(add(neg(r), s)); b2 = abs(add(neg(u), s));
      B = sub(b1, b2);
    } while (B.n === 0 || b1.n === 0 || b2.n === 0);
    const exprB = '|' + txt(neg(r)) + ' + ' + txt(s) + '| - |' + txt(neg(u)) + ' + ' + txt(s) + '|';

    // 3) et 4) : deux équations
    const c3 = rat(S.entNonNul(-9, 9), choix([18, 9, 6]));
    const eq3 = txt(neg(c3)) + ' + x = 0';

    let d4, e4, sol4;
    do {
      d4 = rat(ent(1, 17), choix([18, 12])); e4 = rat(ent(1, 17), choix([20, 10]));
      sol4 = sub(e4, d4);
    } while (sol4.n === 0);
    const eq4 = 'x + ' + txt(d4) + ' = ' + txt(e4);

    // 5) une équation à valeur absolue, impossible une fois sur deux
    const voulu = Math.random() < 0.5 ? -1 : 1;
    let g5, h5, m5;
    for (;;) {
      g5 = rat(ent(1, 9), choix([15, 5])); h5 = rat(S.entNonNul(-7, 7), choix([5, 10]));
      m5 = sub(h5, g5);
      if (m5.n !== 0 && signe(m5) === voulu) break;
    }
    const eq5 = '|x| + ' + txt(g5) + ' = ' + txt(h5);

    // 6) c + (d - x) = c
    let c6, d6;
    do { c6 = rat(ent(1, 11), choix([12, 6])); d6 = rat(ent(1, 11), choix([3, 4])); }
    while (c6.d === 1 || d6.d === 1 || F.egaux(c6, d6));
    const eqC = txt(c6) + ' + (' + txt(d6) + ' - x) = ' + txt(c6);

    return [
      Q.calculAstucieux('A', exprA, platA, [txt(neg(t)), txt(t)], resteA, A),
      {
        enonce: ['احسب:', 'B = ' + exprB],
        indice: 'احسب ما بداخل كل قيمة مطلقة أولا',
        etapes: [
          ['القيمة المطلقة الأولى', '|' + txt(neg(r)) + ' + ' + txt(s) + '| = |'
           + txt(add(neg(r), s)) + '| = ' + txt(b1)],
          ['القيمة المطلقة الثانية', '|' + txt(neg(u)) + ' + ' + txt(s) + '| = |'
           + txt(add(neg(u), s)) + '| = ' + txt(b2)],
          ['نطرح', 'B = ' + txt(b1) + ' - ' + txt(b2)],
          ['النتيجة', 'B = ' + txt(B)]
        ],
        controle: { type: 'signe', defs: { B: exprB }, libres: [],
                    claims: [{ nom: 'B', vaut: B }] }
      },
      {
        enonce: ['جد العدد الكسري النسبي x بحيث:', eq3],
        indice: 'مجموعهما منعدم: العددان متقابلان',
        etapes: [
          ['نعزل المجهول', 'x = 0 - ' + par(neg(c3))],
          ['القاعدة', 'العددان اللذان مجموعهما صفر متقابلان'],
          ['نكتب المقابل', 'x = ' + txt(c3)],
          ['نتحقّق', txt(neg(c3)) + ' + ' + par(c3) + ' = 0']
        ],
        controle: { type: 'equation', eq: eq3, sol: c3 }
      },
      {
        enonce: ['جد العدد الكسري النسبي x بحيث:', eq4],
        indice: 'انقل الثابت إلى العضو الآخر بتغيير إشارته',
        etapes: [
          ['ننقل الثابت', 'x = ' + par(e4) + ' - ' + par(d4)],
          ['نحسب', par(e4) + ' - ' + par(d4) + ' = ' + txt(sol4)],
          ['النتيجة', 'x = ' + txt(sol4)],
          ['نتحقّق', txt(sol4) + ' + ' + txt(d4) + ' = ' + txt(e4)]
        ],
        controle: { type: 'equation', eq: eq4, sol: sol4 }
      },
      {
        // c + (d - x) = c : le c est de part et d'autre, il s'en va.
        enonce: ['جد العدد الكسري النسبي x بحيث:', eqC],
        indice: 'الحدّ نفسه موجود في العضوين: ماذا يبقى ؟',
        etapes: [
          ['نلاحظ الحدّ المشترك', txt(c6) + ' موجود في العضوين'],
          ['نحذفه', txt(d6) + ' - x = 0'],
          ['القاعدة', 'الفرق منعدم يعني العددين متساويين'],
          ['النتيجة', 'x = ' + txt(d6)],
          ['نتحقّق', txt(c6) + ' + (' + txt(d6) + ' - ' + txt(d6) + ') = ' + txt(c6)]
        ],
        controle: { type: 'equation', eq: eqC, sol: d6 }
      },
      Q.equationAbsolue(eq5, txt(h5) + ' - ' + txt(g5), m5,
                        'اعزل |x| ثمّ انظر إلى إشارة العضو الثاني')
    ];
  }
  F.enregistrer(3, { titre: 'حساب بأيسر طريقة، ثمّ معادلات', f, questions: 6 });
  if (M) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
