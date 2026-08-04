// Une page par exercice de la fiche ; à l'intérieur, un volet par question,
// dans l'ordre de l'énoncé.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;
  const V = M ? require('./encadrement.js') : racine.Encadrement;

  const page = (n, titre, f, questions) => F.enregistrer(n, { titre, f, questions });

  page(1, 'مجالان، ثمّ حصر لعبارة كسرية', V.exercice1, 5);
  page(2, 'من القيمة المطلقة إلى المجال، ثمّ ثلاثة حصور', V.exercice2, 5);
  page(3, 'مجالان بقيمة مطلقة، ثمّ حصر لمجموع مربّع و كسر', V.exercice3, 5);
})(typeof window !== 'undefined' ? window : globalThis);
