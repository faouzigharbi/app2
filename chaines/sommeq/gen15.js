// Exercice 15 : E et F se réduisent tous deux à a + b + constante.
//   1) simplifier les deux   2) les comparer   3) calculer E   4) trouver a + b
(function (racine) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports;
  const F = M ? require('./noyau.js') : racine.Somme;
  const S = M ? require('./formes.js') : racine.Formes;
  const Q = M ? require('./questions.js') : racine.Questions;

  function f() {
    for (;;) {
      const e = S.forme15E(), g = S.forme15F();
      if (F.egaux(e.cible.k, g.cible.k)) continue;   // sinon E = F, rien à comparer
      const va = F.rat(S.entNonNul(-9, 9), F.choix([2, 5]));
      const vb = F.rat(S.entNonNul(-9, 9), F.choix([2, 3]));
      const cible = F.rat(S.entNonNul(-8, 8));
      return [
        Q.montrer(e, [g]),
        Q.montrer(g, [e]),
        Q.comparerFormes(e, g),
        Q.parValeurs(e, va, vb, [g]),
        Q.trouverCombinaison(g, cible, [e])
      ];
    }
  }
  F.enregistrer(15, { titre: 'عبارتان تختصران إلى a + b — مقارنة و حساب', f, questions: 5 });
  if (M) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
