// Une page par FAMILLE, cinq questions par page — tirées à chaque chargement.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;
  const A = M ? require('./familles.js') : racine.Familles;
  const page = (n, titre, f) =>
    F.enregistrer(n, { entete: 'العائلة ' + n + ' — ', titre, f, questions: 5 });

  page(1, 'قراءة جدول: التكرار الجملي و المنوال و المدى', A.lectures);
  page(2, 'المعدّل الحسابي لسلسلة متقطّعة', A.moyennes);
  page(3, 'التكرارات المتراكمة الصاعدة و النازلة', A.cumuls);
  page(4, 'التواتر و النسب المائوية و زوايا المخطّط الدائري', A.frequences);
  page(5, 'موسّط سلسلة متقطّعة', A.mediaDiscretes);
  page(6, 'مركز الفئة و معدّل سلسلة متّصلة', A.moyennesContinues);
  page(7, 'موسّط سلسلة متّصلة — فاصلة النقطة ذات الترتيب N/2', A.mediaContinues);
  page(8, 'الاحتمال انطلاقا من سلسلة إحصائية', A.probabilites);
})(typeof window !== 'undefined' ? window : globalThis);
