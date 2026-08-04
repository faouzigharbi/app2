// Exercice 10 :  E = -[-p - (a - q)] - (p + b) + r
//   1) montrer E = a - b + k   2) calculer E pour a et b donnés
(function (racine) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports;
  const F = M ? require('./noyau.js') : racine.Somme;
  const S = M ? require('./formes.js') : racine.Formes;
  const Q = M ? require('./questions.js') : racine.Questions;

  function f() {
    const sh = S.forme10();
    const va = F.rat(S.entNonNul(-9, 9), F.choix([2, 4]));
    const vb = F.rat(S.entNonNul(-9, 9), F.choix([2, 4]));
    const s = F.rat(S.entNonNul(-10, 10), F.choix([2, 3, 4]));
    return [Q.montrer(sh), Q.parValeurs(sh, va, vb), Q.parRelation(sh, s)];
  }
  F.enregistrer(10, { titre: 'أقواس متداخلة تختصر إلى a - b', f, questions: 3 });
  if (M) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
