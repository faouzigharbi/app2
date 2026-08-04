// Exercice 8 : deux expressions en x, y, a ; une seule hypothèse x - y = s.
//   1) montrer A et B   2) calculer A, calculer B, comparer A et B
(function (racine) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports;
  const F = M ? require('./noyau.js') : racine.Somme;
  const S = M ? require('./formes.js') : racine.Formes;
  const Q = M ? require('./questions.js') : racine.Questions;

  function f() {
    for (;;) {
      const A = S.forme08A(), B = S.forme08B();
      const d = S.decNonRonde();
      const s = F.neg(d.v);                       // x - y = -1,2 comme sur la fiche
      const vA = F.add(F.neg(s), A.cible.k);      // A = (y - x) + kA
      const vB = F.add(s, B.cible.k);             // B = (x - y) + kB
      if (F.egaux(vA, vB)) continue;              // il faut pouvoir les comparer
      return [
        Q.montrer(A, [B]),
        Q.montrer(B, [A]),
        Q.parRelation(A, s, [B], 'x - y'),
        Q.parRelation(B, s, [A], 'x - y'),
        Q.comparerNombres('A', vA, 'B', vB)
      ];
    }
  }
  F.enregistrer(8, { titre: 'عبارتان بفرضية واحدة، ثمّ مقارنة', f, questions: 5 });
  if (M) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
