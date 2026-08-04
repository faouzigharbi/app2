// Une page par TYPE ; à l'intérieur, le générateur tire parmi les modèles.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Fact;
  const A = M ? require('./fact.js') : racine.Facto;

  const page = (n, titre, f, questions) => F.enregistrer(n, { titre, f, questions });
  const lot = (fabrique, k) => () => Array.from({ length: k }, fabrique);

  page(1, 'عامل مشترك عددي — ق.م.أ على م.م.أ', lot(A.typeNumerique, 4), 4);
  page(2, 'عامل مشترك ظاهر — قوس يتكرّر', lot(A.typeBinomeVisible, 4), 4);
  page(3, 'عامل مشترك خفيّ — أظهره أوّلا', lot(A.typeBinomeCache, 4), 4);
  page(4, 'معادلة جداء — لا تنشر، فكّك', lot(A.typeEquationProduit, 4), 4);
  page(5, 'تمرين كامل — انشر، احسب، فكّك، حلّ', A.typeComplet, 4);
})(typeof window !== 'undefined' ? window : globalThis);
