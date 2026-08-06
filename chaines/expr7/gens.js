// Une page par TYPE ; à l'intérieur, le générateur tire parmi les modèles.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Expr;
  const A = M ? require('./expressions.js') : racine.Litt;

  const page = (n, titre, f, questions) => F.enregistrer(n, { titre, f, questions });
  const lot = (fabrique, k) => () => Array.from({ length: k }, fabrique);

  page(1, 'الاختصار — حدود من نفس الطبيعة', lot(A.typeReduire, 4), 4);
  page(2, 'النشر ثمّ الاختصار', lot(A.typeDevelopper, 4), 4);
  page(3, 'التفكيك — عامل مشترك عددي و حرفي', lot(A.typeFactoriser, 4), 4);
  page(4, 'تمرين كامل — انشر، فكّك، احسب، حلّ', A.typeComplet, 4);
  page(5, 'المعادلات من الدرجة الأولى', A.typeEquations, 4);
  page(6, 'المحيط بدلالة x — مع الشكل', A.typePerimetre, 3);
  page(7, 'عددان طبيعيان تحت شرط', A.typeNaturels, 4);
})(typeof window !== 'undefined' ? window : globalThis);
