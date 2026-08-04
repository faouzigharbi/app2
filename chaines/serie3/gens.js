// Une page par EXERCICE de la fiche « الضرب و القسمة في مجموعة الأعداد الحقيقية » ;
// à l'intérieur, un volet par question de l'énoncé.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;
  const P = M ? require('./produit.js') : racine.Produit;

  const page = (n, titre, f, questions) => F.enregistrer(n, { titre, f, questions });

  page(11, 'A و B يتقاسمان عاملا — من الاختصار إلى الفرق', P.type11, 3);
  page(12, 'عددان مقلوبان — جداء واحد و أربع قراءات', P.type12, 6);
  page(13, 'مقلوبان بالجذور، ثمّ النشر و التفكيك', P.type13, 5);
})(typeof window !== 'undefined' ? window : globalThis);
