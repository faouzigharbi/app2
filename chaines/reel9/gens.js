// Une page par exercice de la fiche ; les nombres et les irrationnels changent
// à chaque chargement.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;
  const X = M ? require('./exercices.js') : racine.Exos;

  const page = (n, titre, f, questions) => F.enregistrer(n, { titre, f, questions });

  page(1, 'اختصار عبارة ثمّ استعمالها — حرف واحد', X.exercice1, 6);
  page(2, 'عبارتان C و D — حرفان و عددان أصمّان', X.exercice2, 6);
  page(3, 'عبارة بحرفين و π', X.exercice3, 4);
  page(4, 'قيمة مطلقة في صدر العبارة', X.exercice4, 4);
  page(5, 'عبارتان E و F — علاقات تجمع بينهما', X.exercice5, 4);
  page(6, 'معادلات في ℝ', X.exercice6, 4);
  page(7, 'M و N — متقابلان ثمّ متساويان', X.exercice7, 4);
  page(8, 'القيمة المطلقة — حلاّن، حلّ واحد، أو لا حلّ', X.exercice8, 4);
})(typeof window !== 'undefined' ? window : globalThis);
