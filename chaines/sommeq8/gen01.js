// Exercice 1 :  A = p - q + 1  ;  puis trouver x tel que x + A = 0.
// Deux gestes, pas un : réduire au même dénominateur, puis reconnaître
// l'opposé — « x + A = 0 » ne se résout pas, il se lit.
(function (racine) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports;
  const F = M ? require('./noyau.js') : racine.Somme;
  const S = M ? require('./formes.js') : racine.Formes;
  const { rat, add, sub, neg, txt, par, ent, choix } = F;

  function f() {
    let p, q, A;
    for (;;) {
      p = rat(ent(1, 9), choix([5, 4, 3, 8])); q = rat(ent(1, 9), choix([3, 6, 7, 5]));
      A = add(sub(p, q), rat(1));
      if (A.n !== 0 && A.d !== 1 && p.d !== q.d) break;
    }
    const D = p.d * q.d / F.pgcd(p.d, q.d);
    const expr = txt(p) + ' - ' + txt(q) + ' + 1';
    return [
      {
        enonce: ['احسب العبارة', 'A = ' + expr],
        indice: 'وحّد المقامات أولا: المقام المشترك هو ' + D,
        etapes: [
          ['نوحّد المقامات', 'A = ' + (p.n * (D / p.d)) + '/' + D + ' - ' + (q.n * (D / q.d))
           + '/' + D + ' + ' + D + '/' + D],
          ['نجمع البسوط', 'A = ' + (p.n * (D / p.d) - q.n * (D / q.d) + D) + '/' + D],
          ['نختصر', (p.n * (D / p.d) - q.n * (D / q.d) + D) + '/' + D + ' = ' + txt(A)],
          ['النتيجة', 'A = ' + txt(A)]
        ],
        controle: { type: 'signe', defs: { A: expr }, libres: [],
                    claims: [{ nom: 'A', vaut: A }] }
      },
      {
        enonce: ['جد العدد الكسري النسبي x بحيث', 'x + A = 0', 'حيث', 'A = ' + txt(A)],
        indice: 'مجموعهما منعدم: ماذا نسمّي عددين مجموعهما صفر ؟',
        etapes: [
          ['نعوّض بقيمة A', 'x + ' + par(A) + ' = 0'],
          ['القاعدة', 'العددان اللذان مجموعهما صفر متقابلان'],
          ['نكتب المقابل', 'x = -' + par(A)],
          ['النتيجة', 'x = ' + txt(neg(A))]
        ],
        controle: { type: 'equation', eq: 'x + ' + par(A) + ' = 0', sol: neg(A) }
      }
    ];
  }
  F.enregistrer(1, { titre: 'حساب عبارة، ثمّ المقابل', f, questions: 2 });
  if (M) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
