// Une page par EXERCICE de la fiche ; à l'intérieur, un volet par question de
// l'énoncé. Le nombre de volets n'est pas un réglage : c'est celui de l'énoncé.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;
  const A = M ? require('./reels.js') : racine.Fiche;
  const C = M ? require('./serie3.js') : racine.Fiche3;
  const D = M ? require('./serie4.js') : racine.Fiche4;

  const page = (n, titre, f, questions) => F.enregistrer(n, { titre, f, questions });

  page(10, 'إنطاق المقام — الكتابة الكسرية بلا جذور', D.type10, 3);
  page(11, 'عددان مقلوبان — من التبسيط إلى الحساب', D.type11, 3);
  page(12, 'E و F — النسبة و مقلوبها', D.type12, 3);
  page(13, 'مقلوبان و عدد صحيح طبيعي كبير', D.type13, 4);

  page(26, 'العامل المشترك المخفيّ وراء إشارة', C.type26, 4);
  page(27, 'عامل مشترك بين ثلاثة حدود', C.type27, 3);
  page(28, 'ارفع، انشر، فكّك', C.type28, 4);
  page(29, 'معادلات بالقيمة المطلقة و عبارة من الدرجة الأولى', C.type29, 7);

  page(17, 'جداء عددين يساوي 1 — من المتساوية إلى المعادلة', A.type17, 4);
  page(18, 'A و B مقلوبان — الجذور و المتطابقات', A.type18, 5);
  page(19, 'عبارتان مقلوبتان — من التبسيط إلى الاستنتاج', A.type19, 5);
  page(20, 'أربعة عشر سؤالا على عددين مقلوبين', A.type20, 14);
  page(41, 'a مربّع كامل — من المقلوب إلى العدد الطبيعي', A.type41, 7);
})(typeof window !== 'undefined' ? window : globalThis);
