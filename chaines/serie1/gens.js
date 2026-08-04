// Une page par EXERCICE de la fiche ; à l'intérieur, un volet par question.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;
  const D = M ? require('./devoir.js') : racine.Devoir;

  const page = (n, titre, f, questions) => F.enregistrer(n, { titre, f, questions });

  page(1, 'عددان جداؤهما 4 — أحد عشر سؤالا حولهما', D.exercice1, 11);
})(typeof window !== 'undefined' ? window : globalThis);
