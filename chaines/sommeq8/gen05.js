// Exercice 5 :  E = -p - q + a   et   F = c - (a + d - b) + (-e + a)
//   1) simplifier E et F   2) calculer E pour a donné   3) trouver b sachant F
(function (racine) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports;
  const F = M ? require('./noyau.js') : racine.Somme;
  const S = M ? require('./formes.js') : racine.Formes;
  const Q = M ? require('./questions.js') : racine.Questions;

  function f() {
    const e = S.forme05E(), g = S.forme05F();
    const va = F.rat(S.entNonNul(-9, 9), F.choix([1, 2, 7, 4]));
    const cible = F.rat(S.entNonNul(-8, 8));
    return [
      Q.montrer(e, [g]),
      Q.montrer(g, [e]),
      Q.parValeurs(e, va, null, [g]),
      Q.trouverCombinaison(g, cible, [e])
    ];
  }
  F.enregistrer(5, { titre: 'عبارتان تختصران، ثمّ حساب و بحث', f, questions: 4 });
  if (M) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
