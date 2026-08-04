// Une page par PARTIE de la fiche ; à l'intérieur, un volet par question.
// L'en-tête est fourni ici : cette fiche est découpée en أجزاء, pas en تمارين.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;
  const V = M ? require('./revision.js') : racine.Revision;

  const page = (n, entete, titre, f, questions) =>
    F.enregistrer(n, { entete, titre, f, questions });

  page(1, 'الجزء الأوّل — ', 'حساب و اختصار و تفكيك', V.partie1, 11);
  page(2, 'الجزء الثاني — ', 'عددان مقلوبان و قيم مطلقة', V.partie2, 5);
  page(3, 'الجزء الثالث — ', 'عبارة واحدة، ثلاث قراءات', V.partie3, 7);
  page(4, 'الجزء الرابع — ', 'إنطاق المقامات و القيم المطلقة', V.partie4, 12);
  page(5, 'الجزء الخامس — ', 'ثلاث مرّات نفس العامل المخفيّ', V.partie5, 3);
  page(6, 'الجزء السادس — ', 'خمس معادلات، خمس طرق', V.partie6, 5);
  page(7, 'الجزء السابع — ', 'عبارة واحدة و ستّ أسئلة حولها', V.partie7, 9);
})(typeof window !== 'undefined' ? window : globalThis);
