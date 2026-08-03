// Outils de la leçon « قابلية القسمة » (8 أساسي).
//
// Ces exercices manient des puissances énormes — 3^2013, 5^336 — que le type
// Number ne peut pas représenter. La page ne les calcule jamais : elle met en
// facteur. Le validateur, lui, les calcule vraiment, en BigInt.
(function (racine) {
  'use strict';
  const A = (typeof module !== 'undefined' && module.exports)
    ? require('./arith.js') : racine.Arith;

  // Bases « déguisées » : 9 s'écrit 3², 125 s'écrit 5³, 49 s'écrit 7²…
  // C'est le premier geste de l'exercice : tout ramener à la même base.
  const DEGUISEES = {
    2: [[4, 2], [8, 3], [16, 4], [32, 5], [64, 6]],
    3: [[9, 2], [27, 3], [81, 4]],
    5: [[25, 2], [125, 3]],
    7: [[49, 2], [343, 3]]
  };

  const pui = (b, e) => (e === 1 ? String(b) : b + '^' + e);

  // Valeur exacte de Σ coef × b^exp — la seule façon honnête de contrôler
  // que le nombre est bien divisible par D.
  function valeurExacte(b, termes) {
    let v = 0n;
    const B = BigInt(b);
    for (const [coef, exp] of termes) v += BigInt(coef) * (B ** BigInt(exp));
    return v;
  }

  // Diviseurs stricts utilisables comme énoncé : ni 1, ni le nombre lui-même
  // quand il est composé (on veut que l'élève ait quelque chose à voir).
  const diviseursUtiles = n => A.diviseurs(n).filter(d => d > 1);

  const API = { DEGUISEES, pui, valeurExacte, diviseursUtiles };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Outils = API;
})(typeof window !== 'undefined' ? window : globalThis);
