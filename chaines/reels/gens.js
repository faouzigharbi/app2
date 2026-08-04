// Une page par EXERCICE de la fiche ; à l'intérieur, un volet par question de
// l'énoncé. Le nombre de volets n'est pas un réglage : c'est celui de l'énoncé.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;
  const A = M ? require('./reels.js') : racine.Fiche;

  const page = (n, titre, f, questions) => F.enregistrer(n, { titre, f, questions });

  page(17, 'جداء عددين يساوي 1 — من المتساوية إلى المعادلة', A.type17, 4);
  page(18, 'A و B مقلوبان — الجذور و المتطابقات', A.type18, 5);
  page(19, 'عبارتان مقلوبتان — من التبسيط إلى الاستنتاج', A.type19, 5);
})(typeof window !== 'undefined' ? window : globalThis);
