// Exercice 17 : une expression bourrée de valeurs absolues, puis QUATRE
// comparaisons — toutes réglées par le signe de la différence. C'est
// l'exercice qui interdit le plus nettement les propriétés de l'ordre.
(function (racine) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports;
  const F = M ? require('./noyau.js') : racine.Somme;
  const S = M ? require('./formes.js') : racine.Formes;
  const Q = M ? require('./questions.js') : racine.Questions;
  const { rat, add, sub, neg, abs, txt, par, plus, ent, choix, decimal } = F;

  function f() {
    // 1) A = -p - |a + d| + |a - q| + |a| - (-r)  évalué en a = v
    let p, d, q, r, v, t1, t2, t3, A;
    for (;;) {
      p = S.fracPos([5, 10]); d = S.decNonRonde(); q = S.fracPos([2, 4]);
      r = S.fracPos([3, 6]); v = rat(S.entNonNul(-9, 9), choix([2, 4]));
      t1 = abs(add(v, d.v)); t2 = abs(sub(v, q)); t3 = abs(v);
      A = add(sub(add(sub(neg(p), t1), t2), rat(0)), add(t3, r));
      if (t1.n && t2.n && t3.n && A.n) break;
    }
    const exprA = txt(neg(p)) + ' - |a + ' + d.t + '| + |a - ' + txt(q) + '| + |a| - ('
                  + txt(neg(r)) + ')';

    // 2) a < b : trois comparaisons, chacune d'un type différent
    const p2 = S.fracPos([3, 6]), q2 = S.fracPos([2, 4]);
    const p3 = S.fracPos([5, 10]), q3 = S.fracPos([4, 8]);
    const m4 = ent(2, 12), n4 = ent(1, 9);

    // 3) m - n = s : comparer Z et T. La différence Z - T ne doit pas être
    // nulle : Z = T ne se compare ni par « < » ni par « > », et la chaîne
    // n'aurait pas de conclusion.
    let s, c5, d5, e5;
    do {
      s = rat(S.entNonNul(-60, 60));
      c5 = ent(2, 20); d5 = ent(1, 9); e5 = ent(2, 25);
    } while (add(s, rat(c5 - d5 + e5 - 1)).n === 0);
    return [
      {
        enonce: ['احسب', 'A', 'إذا كان', 'a = ' + txt(v), 'حيث', 'A = ' + exprA],
        indice: 'عوّض أولا، ثمّ احسب كل قيمة مطلقة على حدة',
        etapes: [
          ['نعوّض', 'A = ' + txt(neg(p)) + ' - |' + txt(v) + ' + ' + d.t + '| + |'
           + txt(v) + ' - ' + txt(q) + '| + |' + txt(v) + '| + ' + txt(r)],
          ['القيمة المطلقة الأولى', '|' + txt(v) + ' + ' + d.t + '| = ' + txt(t1)],
          ['القيمة المطلقة الثانية', '|' + txt(v) + ' - ' + txt(q) + '| = ' + txt(t2)],
          ['القيمة المطلقة الثالثة', '|' + txt(v) + '| = ' + txt(t3)],
          ['نجمع', 'A = ' + txt(neg(p)) + ' - ' + txt(t1) + ' + ' + txt(t2) + ' + '
           + txt(t3) + ' + ' + txt(r)],
          ['النتيجة', 'A = ' + txt(A)]
        ],
        controle: { type: 'signe', defs: { A: exprA }, fixes: { a: v }, libres: [],
                    claims: [{ nom: 'A', vaut: A }] }
      },
      Q.comparerParSigne({
        vars: 'a و b', hypothese: 'a < b', libres: ['a', 'b'],
        g: 'a - ' + txt(p2), d: 'b + ' + txt(q2),
        combi: 'a - b', cste: sub(neg(p2), q2), sens: -1
      }),
      Q.comparerParSigne({
        vars: 'a و b', hypothese: 'a < b', libres: ['a', 'b'],
        g: txt(p3) + ' - a', d: txt(neg(q3)) + ' - b',
        combi: 'b - a', cste: add(p3, q3), sens: 1
      }),
      {
        enonce: ['ليكن a و b عددين كسريّين نسبيّين؛ قارن', 'X و Y', 'حيث',
                 'X = (' + m4 + ' + a) - b  و  Y = (a - ' + n4 + ') - b'],
        indice: 'الفرق لا يحتوي أيّ مجهول: احسبه',
        etapes: [
          ['نحسب الفرق', 'X - Y = (' + m4 + ' + a - b) - (a - ' + n4 + ' - b)'],
          ['تختفي المجهولات', 'X - Y = ' + m4 + ' + ' + n4],
          ['نحسب', 'X - Y = ' + (m4 + n4)],
          ['نحدّد إشارة الفرق', (m4 + n4) + ' > 0'],
          ['القاعدة', 'الفرق موجب، إذن X أكبر من Y'],
          ['النتيجة', 'X > Y']
        ],
        controle: { type: 'signe', libres: ['a', 'b'],
                    defs: { X: '(' + m4 + ' + a) - b', Y: '(a - ' + n4 + ') - b' },
                    relation: { g: 'X', d: 'Y', sens: 1 } }
      },
      (function () {
        // Z = c - (d - m)  ;  T = -e + (n + 1)
        // Z - T = c - d + m + e - n - 1 = (m - n) + (c - d + e - 1)
        const cste = rat(c5 - d5 + e5 - 1);
        const D = add(s, cste);
        const petit = F.signe(D) < 0;
        return {
          enonce: ['ليكن m و n عددين كسريّين نسبيّين حيث', 'm - n = ' + txt(s),
                   '؛ قارن', 'Z و T', 'حيث',
                   'Z = ' + c5 + ' - (' + d5 + ' - m)  و  T = -' + e5 + ' + (n + 1)'],
          indice: 'انشر ثمّ أظهر m - n',
          etapes: [
            ['نبسّط Z', 'Z = ' + c5 + ' - ' + d5 + ' + m'],
            ['نبسّط T', 'T = -' + e5 + ' + n + 1'],
            ['نحسب الفرق', 'Z - T = (m - n) + (' + c5 + ' - ' + d5 + ' + ' + e5 + ' - 1)'],
            ['نعوّض بالمعطى', 'Z - T = ' + par(s) + ' + ' + par(cste)],
            ['نحسب', 'Z - T = ' + txt(D)],
            ['نحدّد إشارة الفرق', txt(D) + (petit ? ' < 0' : ' > 0')],
            ['النتيجة', 'Z' + (petit ? ' < ' : ' > ') + 'T']
          ],
          controle: { type: 'signe', libres: ['m'],
                      lie: { nom: 'n', via: 'difference', autre: 'm', valeur: s },
                      defs: { Z: c5 + ' - (' + d5 + ' - m)', T: '-' + e5 + ' + (n + 1)' },
                      relation: { g: 'Z', d: 'T', sens: petit ? -1 : 1 } }
        };
      })()
    ];
  }
  F.enregistrer(17, { titre: 'قيم مطلقة، ثمّ أربع مقارنات بالفرق', f, questions: 5 });
  if (M) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
