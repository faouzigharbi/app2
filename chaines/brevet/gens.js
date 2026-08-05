// Une page par EXERCICE du livre de révision ; à l'intérieur, un volet par
// question de l'énoncé. L'en-tête est fourni ici : le livre numérote ses
// exercices À L'INTÉRIEUR de chaque séance, et « التمرين 1 » tout court serait
// ambigu dès la séance 3.
//
// La clé numérique code la séance et le rang : 21 = séance 2, exercice 1.
// Les séances suivantes s'y glissent sans rien déplacer.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;
  const S = M ? require('./seances.js') : racine.Seances;

  const page = (n, entete, titre, f, questions) =>
    F.enregistrer(n, { entete, titre, f, questions });

  page(21, 'الحصّة 2 — التمرين 1 — ', 'ثلاث عبارات صمّاء، و مقلوبان في آخر سطر',
       S.seance2ex1, 7);
  page(22, 'الحصّة 2 — التمرين 2 — ', 'عبارة واحدة A، و ثمانية أسئلة حولها',
       S.seance2ex2, 8);
  page(23, 'الحصّة 2 — التمرين 3 — ', 'معيّن، و مستطيل يفتح على معيَّن آخر',
       S.seance2ex3, 13);
  page(24, 'الحصّة 2 — التمرين 4 — ', 'دائرة قطرها [AB]، و طالس في معلم',
       S.seance2ex4, 12);

  page(31, 'الحصّة 3 — التمرين 1 — ', 'اتّجاه واحد، و أربع مرّات طالس',
       S.seance3ex1, 6);
  page(32, 'الحصّة 3 — التمرين 2 — ', 'معلم، و معيّن يفضحه قطراه',
       S.seance3ex2, 6);
  page(33, 'الحصّة 3 — التمرين 3 — ', 'عددان سالبان، و مقارنات تنقلب',
       S.seance3ex3, 5);
  page(34, 'الحصّة 3 — التمرين 4 — ', 'متطابقة واحدة تغلق التمرين كلّه',
       S.seance3ex4, 6);

  page(36, 'الحصّة 3 — التمرين 6 — ', 'نموذجية مدنين — أطول تمرين في الكتاب',
       S.seance3ex6, 20);

  page(71, 'الحصّة 7 — التمرين 1 — ', 'نختصر لكي نُقارن، و الضرب في عدد سالب يقلب',
       S.seance7ex1, 9);
  page(72, 'الحصّة 7 — التمرين 2 — ', 'دائرتان متداخلتان، من القطر إلى مركز التعامد',
       S.seance7ex2, 12);
  page(73, 'الحصّة 7 — التمرين 3 — ', 'مجالات، ثمّ F = 2E + 12 تحكم كلّ شيء',
       S.seance7ex3, 12);
  page(74, 'الحصّة 7 — التمرين 4 — ', 'العلاقة المترية، ثمّ مثلّث متقايس الأضلاع',
       S.seance7ex4, 8);

  // La séance 9 ne compte que trois pages : son exercice 3 est le MÊME que
  // celui de la séance 7 — mêmes données, mêmes questions, numérotation
  // continuée (IV, V, VI). On ne le double pas ; ex74 le porte déjà.
  page(91, 'الحصّة 9 — التمرين 1 — ', 'قيمة مطلقة تحت جذر، و حصر يُضرب في عدد سالب',
       S.seance9ex1, 9);
  page(92, 'الحصّة 9 — التمرين 2 — ', 'شبه منحرف قائم، و متوسّطان يتقاطعان',
       S.seance9ex2, 8);
  page(94, 'الحصّة 9 — التمرين 4 — ', 'زاوية قائمة في B تنتشر في كلّ الشكل',
       S.seance9ex4, 8);
})(typeof window !== 'undefined' ? window : globalThis);
