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

  // La séance 4 : son exercice 6 est une pyramide — de l'espace, sans chapitre.
  page(41, 'الحصّة 4 — التمرين 1 — ', 'عبارة، ثمّ شبه منحرف يعيد تكوين معادلتها',
       S.seance4ex1, 6);
  page(42, 'الحصّة 4 — التمرين 2 — ', 'معلم، و نقطة A تلعب ثلاثة أدوار',
       S.seance4ex2, 8);
  page(43, 'الحصّة 4 — التمرين 3 — ', 'العدد الذهبي و مقلوبه',
       S.seance4ex3, 4);
  page(44, 'الحصّة 4 — التمرين 4 — ', 'نحصر بدل أن نحسب',
       S.seance4ex4, 7);
  page(45, 'الحصّة 4 — التمرين 5 — ', 'زاوية 60° تصنع مثلّثا متقايس الأضلاع',
       S.seance4ex5, 7);

  // La séance 5 : son exercice 6 est un prisme droit — de l'espace, sans chapitre.
  page(51, 'الحصّة 5 — التمرين 1 — ', 'عدد صغير جدّا، و مقلوبه هائل',
       S.seance5ex1, 7);
  page(52, 'الحصّة 5 — التمرين 2 — ', 'مستطيل حيث العلاقة المترية تعطي كلّ شيء',
       S.seance5ex2, 6);
  page(53, 'الحصّة 5 — التمرين 3 — ', 'نفس العددين، مقطّعين بثماني درجات',
       S.seance5ex3, 8);
  page(54, 'الحصّة 5 — التمرين 4 — ', 'مجالان، و مربّع يحصر ما لا يُحصر مباشرة',
       S.seance5ex4, 5);
  page(55, 'الحصّة 5 — التمرين 5 — ', 'قيمتان مطلقتان يرفعهما حصر واحد',
       S.seance5ex5, 3);
  page(57, 'الحصّة 5 — التمرين 7 — ', 'عبارة، ثمّ مساحة تعيد تكوينها',
       S.seance5ex7, 5);
  page(58, 'الحصّة 5 — التمرين 8 — ', 'مربّع ينزلق، و مجموع مساحتين',
       S.seance5ex8, 7);

  // La séance 6 : son en-tête « التمرين رقم 4 » ne porte AUCUN énoncé, et son
  // dernier exercice (parallélépipède) est de l'espace. Le livre y numérote
  // deux exercices « 5 » : celui de منزه et celui de l'espace.
  page(61, 'الحصّة 6 — التمرين 1 — ', 'مستطيل ينزلق، و مجموع لا يتغيّر',
       S.seance6ex1, 8);
  page(62, 'الحصّة 6 — التمرين 2 — ', 'مقلوبان، و أربع عبارات تنهار',
       S.seance6ex2, 8);
  page(63, 'الحصّة 6 — التمرين 3 — ', 'المثلّث 6-8-10 موضوعا في معلم',
       S.seance6ex3, 8);
  page(65, 'الحصّة 6 — التمرين 5 (منزه) — ', 'العدد الذهبي، و مربّع يرسمه',
       S.seance6ex5, 7);

  page(71, 'الحصّة 7 — التمرين 1 — ', 'نختصر لكي نُقارن، و الضرب في عدد سالب يقلب',
       S.seance7ex1, 9);
  page(72, 'الحصّة 7 — التمرين 2 — ', 'دائرتان متداخلتان، من القطر إلى مركز التعامد',
       S.seance7ex2, 12);
  page(73, 'الحصّة 7 — التمرين 3 — ', 'مجالات، ثمّ F = 2E + 12 تحكم كلّ شيء',
       S.seance7ex3, 12);
  page(74, 'الحصّة 7 — التمرين 4 — ', 'العلاقة المترية، ثمّ مثلّث متقايس الأضلاع',
       S.seance7ex4, 8);

  // La séance 8 : son exercice 2 REPREND mot pour mot les exercices 4 et 5 de la
  // séance 5 — mêmes intervalles, mêmes expressions, jusqu'à la numérotation
  // cassée (4, 5, 6 puis 4, 3, 4). ex54 et ex55 les portent déjà. Son exercice 4
  // est une pyramide, donc de l'espace.
  page(81, 'الحصّة 8 — التمرين 1 — ', 'عبارة، ثمّ سلسلة المعدّلات الثلاثة',
       S.seance8ex1, 8);
  page(83, 'الحصّة 8 — التمرين 3 — ', 'مثلّث متقايس الأضلاع يصير قائما',
       S.seance8ex3, 9);
  page(85, 'الحصّة 8 — التمرين 5 — ', 'قيمتان مطلقتان، و تفكيك مخفيّ',
       S.seance8ex5, 6);

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
