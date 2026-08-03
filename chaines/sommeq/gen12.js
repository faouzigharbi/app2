// Exercice 12 : deux expressions longues, A en x et B en y.
//   1) les réduire   2) calculer A si |x| donné, trouver x si |A| = 0
//   3) calculer B, puis trouver x + y si A et B sont opposés
(function (racine) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports;
  const F = M ? require('./noyau.js') : racine.Somme;
  const S = M ? require('./formes.js') : racine.Formes;
  const Q = M ? require('./questions.js') : racine.Questions;
  const { rat, add, sub, neg, txt, par, plus } = F;

  function f() {
    const A = S.forme12A(), B = S.forme12B();     // A = -x + kA ; B = -y + kB
    const m = S.fracPos([4, 5, 10]);              // |x| = m
    const vy = rat(S.entNonNul(-9, 9), F.choix([5, 3]));
    const somme = add(A.cible.k, B.cible.k);      // A + B = 0 ⟹ x + y = kA + kB

    return [
      Q.montrer(A, [B]),
      Q.montrer(B, [A]),
      {
        enonce: ['احسب', 'A', 'في حالة', '|x| = ' + txt(m), 'حيث', 'A = ' + Q.forme(A)],
        indice: 'القيمة المطلقة تفتح حالتين',
        etapes: [
          ['القاعدة', 'إذا كان |x| = ' + txt(m) + ' فإنّ x = ' + txt(m) + '  أو  x = ' + txt(neg(m))],
          ['نستعمل الشكل المختصر', 'A = -x' + plus(A.cible.k)],
          ['الحالة الأولى', '-' + par(m) + plus(A.cible.k) + ' = ' + txt(sub(A.cible.k, m))],
          ['الحالة الثانية', '-' + par(neg(m)) + plus(A.cible.k) + ' = ' + txt(add(A.cible.k, m))],
          ['النتيجة', 'A = ' + txt(sub(A.cible.k, m)) + '  أو  A = ' + txt(add(A.cible.k, m))]
        ],
        controle: { type: 'deux-cas', defs: { A: A.txt }, sh: A,
                    x1: m, x2: neg(m),
                    v1: sub(A.cible.k, m), v2: add(A.cible.k, m) }
      },
      {
        enonce: ['أوجد', 'x', 'في حالة', '|A| = 0', 'حيث', 'A = ' + Q.forme(A)],
        indice: 'قيمة مطلقة منعدمة تعني عددا منعدما',
        etapes: [
          ['القاعدة', 'إذا كان |A| = 0 فإنّ A = 0'],
          ['نكتب المعادلة', '-x' + plus(A.cible.k) + ' = 0'],
          ['نعزل المجهول', 'x = ' + txt(A.cible.k)],
          ['نتحقّق', '-' + par(A.cible.k) + plus(A.cible.k) + ' = 0']
        ],
        controle: { type: 'equation', eq: '-x' + plus(A.cible.k) + ' = 0', sol: A.cible.k }
      },
      Q.parValeurs(B, vy, null, [A]),
      {
        enonce: ['أوجد', 'x + y', 'في حالة', 'A و B متقابلان', 'حيث',
                 'A = ' + Q.forme(A) + '  و  B = ' + Q.forme(B)],
        indice: 'متقابلان يعني مجموعهما منعدم',
        etapes: [
          ['نترجم « متقابلان »', 'A + B = 0'],
          ['نجمع الشكلين المختصرين', '-x - y + (' + txt(A.cible.k) + plus(B.cible.k) + ') = 0'],
          ['نحسب الثابت', txt(A.cible.k) + plus(B.cible.k) + ' = ' + txt(somme)],
          ['نعزل المجموع', 'x + y = ' + txt(somme)]
        ],
        controle: { type: 'signe', defs: { A: A.txt, B: B.txt }, libres: ['x'],
                    lie: { nom: 'y', via: 'somme', autre: 'x', valeur: somme },
                    relation: { g: 'A + B', d: '0', sens: 0 } }
      }
    ];
  }
  F.enregistrer(12, { titre: 'عبارتان طويلتان، قيمة مطلقة و متقابلان', f, questions: 6 });
  if (M) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
