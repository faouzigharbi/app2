// Outils propres à la leçon « قواسم عدد صحيح طبيعي ».
// Complète arith.js (PGCD, PPCM, facteurs premiers, diviseurs, rendu, registre)
// avec ce que demande cette leçon : compte des diviseurs, racines exactes
// lues sur les exposants, et fabrication de nombres à décomposition choisie.
(function (racine) {
  'use strict';
  const A = (typeof module !== 'undefined' && module.exports)
    ? require('./arith.js') : racine.Arith;

  const PREMIERS = [2, 3, 5, 7, 11, 13];

  // Un nombre construit à partir de facteurs imposés : c'est ainsi qu'on
  // maîtrise ce que l'élève va devoir lire dans la décomposition.
  const valeur = f => f.reduce((r, [p, e]) => r * Math.pow(p, e), 1);

  // Tire `combien` premiers distincts, avec des exposants dans [emin, emax].
  // Rejette tant que le nombre dépasse `plafond` — un énoncé doit rester lisible.
  function tirerFacteurs(combien, emin, emax, plafond, pool) {
    const dispo = (pool || PREMIERS).slice();
    for (;;) {
      const t = dispo.slice(), f = [];
      for (let i = 0; i < combien; i++) {
        const p = t.splice(Math.floor(Math.random() * t.length), 1)[0];
        f.push([p, A.ent(emin, emax)]);
      }
      f.sort((x, y) => x[0] - y[0]);
      const v = valeur(f);
      if (v <= plafond && v > 1) return f;
    }
  }

  // Nombre de diviseurs : (e₁+1)(e₂+1)… — lu directement sur les exposants.
  const nbDiv = f => f.reduce((r, [, e]) => r * (e + 1), 1);
  const detailNbDiv = f => f.map(([, e]) => '(' + e + ' + 1)').join(' × ');

  // Racine k-ième exacte : on divise chaque exposant par k.
  const racineK = (f, k) => f.map(([p, e]) => [p, e / k]);
  const divisiblePar = (f, k) => f.every(([, e]) => e % k === 0);

  const ensemble = t => '{ ' + t.join(' ; ') + ' }';

  // Diviseurs communs = diviseurs du PGCD.
  const communs = (a, b) => A.diviseurs(A.pgcd(a, b));

  const API = { PREMIERS, valeur, tirerFacteurs, nbDiv, detailNbDiv,
                racineK, divisiblePar, ensemble, communs };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Outils = API;
})(typeof window !== 'undefined' ? window : globalThis);
