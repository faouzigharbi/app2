// Exercice 2 : trois expressions à simplifier — rien que la levée des
// parenthèses, mais trois motifs différents.
(function (racine) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports;
  const F = M ? require('./noyau.js') : racine.Somme;
  const S = M ? require('./formes.js') : racine.Formes;
  const Q = M ? require('./questions.js') : racine.Questions;

  function f() {
    const a = S.forme02A(), b = S.forme02B(), c = S.forme02C();
    return [Q.montrer(a), Q.montrer(b), Q.montrer(c)];
  }
  F.enregistrer(2, { titre: 'اختصار ثلاث عبارات', f, questions: 3 });
  if (M) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
