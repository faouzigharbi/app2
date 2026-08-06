// Exercice 4 :  A = x - p - (x - y - q) + (x - y) - r
//   1) montrer A = x + k     2) calculer A pour x donné     3) trouver x
(function (racine) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports;
  const F = M ? require('./noyau.js') : racine.Somme;
  const S = M ? require('./formes.js') : racine.Formes;
  const Q = M ? require('./questions.js') : racine.Questions;

  function f() {
    const sh = S.forme04();
    const vx = F.rat(S.entNonNul(-12, 12), F.choix([1, 2, 3, 4, 5]));
    let cible;
    do { cible = F.rat(S.entNonNul(-9, 9), F.choix([1, 2, 3, 4])); }
    while (F.egaux(F.sub(cible, sh.cible.k), vx));
    return [
      Q.montrer(sh),
      Q.parValeurs(sh, vx, null),
      Q.trouverCombinaison(sh, cible)
    ];
  }
  F.enregistrer(4, { titre: 'عبارة بمجهولين تختصر إلى x', f, questions: 3 });
  if (M) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
