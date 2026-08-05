// Une page par FAMILLE, cinq questions par page — tirées à chaque chargement.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;
  const A = M ? require('./familles.js') : racine.Familles;
  const page = (n, titre, f) =>
    F.enregistrer(n, { entete: 'العائلة ' + n + ' — ', titre, f, questions: 5 });

  page(1, 'منتصف قطعة', A.milieux);
  page(2, 'مناظرة نقطة بالنسبة إلى نقطة', A.symetriques);
  page(3, 'المسافة بين نقطتين', A.distances);
  page(4, 'طبيعة رباعي', A.natures);
  page(5, 'ثلاث نقاط على استقامة واحدة؟', A.alignements);
  page(6, 'مستقيمان متوازيان أم متعامدان؟', A.directions);
  page(7, 'الرأس الرابع لمتوازي أضلاع', A.quatriemes);
  page(8, 'مثلّث قائم و دائرته المحيطة', A.cercles);
})(typeof window !== 'undefined' ? window : globalThis);
