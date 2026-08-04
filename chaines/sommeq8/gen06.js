// Exercice 6 :  E = p - [-a + q - r] + (-b + q)
//   1) montrer E = a - b + k   2) calculer E sachant a - b   3) comparer a et b si E = 0
(function (racine) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports;
  const F = M ? require('./noyau.js') : racine.Somme;
  const S = M ? require('./formes.js') : racine.Formes;
  const Q = M ? require('./questions.js') : racine.Questions;

  function f() {
    const sh = S.forme06();
    const s = F.rat(S.entNonNul(-14, 14), F.choix([2, 3, 5, 4]));
    return [Q.montrer(sh), Q.parRelation(sh, s), Q.comparerVariables(sh)];
  }
  F.enregistrer(6, { titre: 'عبارة تختصر إلى a - b، ثمّ مقارنة', f, questions: 3 });
  if (M) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
