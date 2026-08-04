// Exercice 13 : calcul astucieux, valeurs absolues, comparaison à même
// inconnue, puis deux expressions sous une hypothèse sur a - b.
(function (racine) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports;
  const F = M ? require('./noyau.js') : racine.Somme;
  const S = M ? require('./formes.js') : racine.Formes;
  const Q = M ? require('./questions.js') : racine.Questions;
  const { rat, add, sub, neg, abs, txt, par, plus, ent, choix } = F;

  function f() {
    // 1) A = (-p - t) - (-q - t) : le t disparaît
    let p, q, t;
    do {
      p = rat(ent(1, 12), choix([25, 5])); q = rat(ent(1, 12), choix([25, 5]));
      t = rat(ent(1, 40), choix([309, 103]));
    } while (F.egaux(p, q));
    const A = sub(q, p);
    const exprA = '(' + txt(neg(p)) + ' - ' + txt(t) + ') - (' + txt(neg(q)) + ' - ' + txt(t) + ')';

    // 2) B = |-r + s| - |-u + s|
    let r, u, s, b1, b2, B;
    do {
      r = rat(ent(1, 9), choix([7, 14])); u = rat(ent(1, 9), choix([2, 4]));
      s = rat(ent(1, 13), choix([14, 7]));
      b1 = abs(add(neg(r), s)); b2 = abs(add(neg(u), s));
      B = sub(b1, b2);
    } while (B.n === 0 || b1.n === 0 || b2.n === 0);
    const exprB = '|' + txt(neg(r)) + ' + ' + txt(s) + '| - |' + txt(neg(u)) + ' + ' + txt(s) + '|';

    // 3) comparaison à même inconnue
    let c1, c2;
    do { c1 = S.fracPos([4, 3]); c2 = S.fracPos([3, 4]); } while (F.egaux(c1, c2));

    // 4) a - b = d : deux expressions à calculer
    const d = rat(S.entNonNul(-11, 11), choix([15, 5, 3]));
    const p4 = S.fracPos([5, 10]), q4 = S.fracPos([3, 6]);
    const r4 = S.fracPos([3, 6]), t4 = S.fracPos([3, 6]), u4 = S.fracPos([5, 10]);
    const C = sub(sub(neg(d), p4), q4);            // (b - a) - p4 - q4
    const D = add(add(sub(d, r4), t4), u4);        // (a - b) - r4 + t4 + u4
    const exprC = '(' + txt(neg(p4)) + ' - a) - (' + txt(q4) + ' - b)';
    const exprD = '(a - ' + txt(r4) + ') - [' + txt(neg(t4)) + ' - (' + txt(u4) + ' - b)]';

    return [
      Q.calculAstucieux('A', exprA, txt(neg(p)) + ' - ' + txt(t) + ' + ' + txt(q) + ' + ' + txt(t),
                        ['-' + txt(t), txt(t)], txt(neg(p)) + ' + ' + txt(q), A),
      {
        enonce: ['احسب:', 'B = ' + exprB],
        indice: 'احسب ما بداخل كل قيمة مطلقة قبل كل شيء',
        etapes: [
          ['القيمة المطلقة الأولى', '|' + txt(neg(r)) + ' + ' + txt(s) + '| = |'
           + txt(add(neg(r), s)) + '| = ' + txt(b1)],
          ['القيمة المطلقة الثانية', '|' + txt(neg(u)) + ' + ' + txt(s) + '| = |'
           + txt(add(neg(u), s)) + '| = ' + txt(b2)],
          ['نطرح', 'B = ' + txt(b1) + ' - ' + txt(b2)],
          ['النتيجة', 'B = ' + txt(B)]
        ],
        controle: { type: 'signe', defs: { B: exprB }, libres: [], claims: [{ nom: 'B', vaut: B }] }
      },
      Q.comparerMemeInconnue('x', c1, c2),
      {
        enonce: ['ليكن a و b عددين كسريّين نسبيّين حيث', 'a - b = ' + txt(d),
                 '؛ احسب', 'C = ' + exprC],
        indice: 'أظهر b - a: هو مقابل المعطى',
        etapes: [
          ['نرفع القوسين', 'C = ' + txt(neg(p4)) + ' - a - ' + txt(q4) + ' + b'],
          ['نجمّع المجهولين', 'C = (b - a) + (' + txt(neg(p4)) + ' - ' + txt(q4) + ')'],
          ['نقلب المعطى', 'b - a = ' + txt(neg(d))],
          ['نعوّض', 'C = ' + par(neg(d)) + ' + ' + par(sub(neg(p4), q4))],
          ['النتيجة', 'C = ' + txt(C)]
        ],
        controle: { type: 'signe', defs: { C: exprC }, libres: ['a'],
                    lie: { nom: 'b', via: 'difference', autre: 'a', valeur: d },
                    claims: [{ nom: 'C', vaut: C }] }
      },
      {
        enonce: ['ليكن a و b عددين كسريّين نسبيّين حيث', 'a - b = ' + txt(d),
                 '؛ احسب', 'D = ' + exprD],
        indice: 'ارفع القوس الداخلي أولا',
        etapes: [
          ['نرفع القوس الداخلي', txt(neg(t4)) + ' - (' + txt(u4) + ' - b) = '
           + txt(neg(t4)) + ' - ' + txt(u4) + ' + b'],
          ['نرفع القوس المربّع', 'D = a - ' + txt(r4) + ' + ' + txt(t4) + ' + ' + txt(u4) + ' - b'],
          ['نجمّع المجهولين', 'D = (a - b) + (' + txt(neg(r4)) + ' + ' + txt(t4) + ' + ' + txt(u4) + ')'],
          ['نعوّض', 'D = ' + par(d) + ' + ' + par(add(add(neg(r4), t4), u4))],
          ['النتيجة', 'D = ' + txt(D)]
        ],
        controle: { type: 'signe', defs: { D: exprD }, libres: ['a'],
                    lie: { nom: 'b', via: 'difference', autre: 'a', valeur: d },
                    claims: [{ nom: 'D', vaut: D }] }
      }
    ];
  }
  F.enregistrer(13, { titre: 'حساب ذكي، قيم مطلقة و عبارتان بفرضية', f, questions: 5 });
  if (M) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
