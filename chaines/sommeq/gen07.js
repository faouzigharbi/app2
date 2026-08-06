// Exercice 7 :  F = a - p - [a - (q - b)] - (-a + q)
//   1) montrer   2) calculer pour a et b donnés   3) trouver a - b   4) comparer a et b
(function (racine) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports;
  const F = M ? require('./noyau.js') : racine.Somme;
  const S = M ? require('./formes.js') : racine.Formes;
  const Q = M ? require('./questions.js') : racine.Questions;

  function f() {
    const sh = S.forme07();
    const va = F.rat(S.entNonNul(-11, 11), F.choix([2, 3, 6]));
    const vb = F.rat(S.entNonNul(-11, 11), F.choix([2, 3, 4]));
    const cible = F.rat(S.entNonNul(-6, 6));
    return [
      Q.montrer(sh),
      Q.parValeurs(sh, va, vb),
      Q.trouverCombinaison(sh, cible),
      Q.comparerVariables(sh)
    ];
  }
  F.enregistrer(7, { titre: 'عبارة تختصر إلى a - b — أربعة أسئلة', f, questions: 4 });
  if (M) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
