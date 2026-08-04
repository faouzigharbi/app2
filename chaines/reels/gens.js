// Une page par EXERCICE de la fiche ; à l'intérieur, un volet par question de
// l'énoncé. Le nombre de volets n'est pas un réglage : c'est celui de l'énoncé.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;
  const A = M ? require('./reels.js') : racine.Fiche;
  const B = M ? require('./serie2.js') : racine.Fiche2;

  const page = (n, titre, f, questions) => F.enregistrer(n, { titre, f, questions });

  page(11, 'التفكيك إلى جداء عوامل — العامل المشترك', B.type11, 5);
  page(12, 'عددان مقلوبان — إنطاق المقام و الاختصار', B.type12, 5);
  page(13, 'القيمة المطلقة — الاختصار ثمّ المعادلات', B.type13, 8);
  page(14, 'عبارة حرفية — فكّك، حلّ، ثمّ احسب |A|', B.type14, 3);

  page(17, 'جداء عددين يساوي 1 — من المتساوية إلى المعادلة', A.type17, 4);
  page(18, 'A و B مقلوبان — الجذور و المتطابقات', A.type18, 5);
  page(19, 'عبارتان مقلوبتان — من التبسيط إلى الاستنتاج', A.type19, 5);
})(typeof window !== 'undefined' ? window : globalThis);
