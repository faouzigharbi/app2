// Une page par famille ; les nombres et les radicandes changent à chaque
// chargement.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Radic;
  const X = M ? require('./exercices.js') : racine.Exos;
  const page = (n, titre, f, k) => F.enregistrer(n, { titre, f, questions: k });

  page(1, 'الكتابة على شكل a√b', X.exercice1, 4);
  page(2, 'الجمع و الطرح — جذور متشابهة', X.exercice2, 3);
  page(3, 'الجداء و القسمة', X.exercice3, 4);
  page(4, 'النشر — متطابقات شهيرة و متلازمان', X.exercice4, 4);
  page(5, 'التفكيك بعامل مشترك جذري', X.exercice5, 3);
  page(6, 'جعل المقام ناطقا', X.exercice6, 4);
  page(7, 'عددان مقلوبان', X.exercice7, 3);
  page(8, '√(x^2) = |x| — الإشارة قبل كلّ شيء', X.exercice8, 4);
})(typeof window !== 'undefined' ? window : globalThis);
