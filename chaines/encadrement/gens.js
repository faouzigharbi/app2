// Une page par exercice de la fiche ; à l'intérieur, un volet par question,
// dans l'ordre de l'énoncé.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;
  const V = M ? require('./encadrement.js') : racine.Encadrement;

  const page = (n, titre, f, questions) => F.enregistrer(n, { titre, f, questions });

  page(1, 'مجالان، ثمّ حصر لعبارة كسرية', V.exercice1, 5);
  page(2, 'من القيمة المطلقة إلى المجال، ثمّ ثلاثة حصور', V.exercice2, 5);
  page(3, 'مجالان بقيمة مطلقة، ثمّ حصر لمجموع مربّع و كسر', V.exercice3, 5);
  page(10, 'حصر جداء و خارج، ثمّ مجالات و تقاطعات', V.exercice10, 9);
  page(11, 'عبارة واحدة، سبع قراءات — معادلات و متراجحات', V.exercice11, 7);
  page(12, 'معادلتان، ثمّ حصر انطلاقا من عبارة أخرى', V.exercice12, 6);
  page(13, 'معادلتان، ثمّ حصر لكسر بمقام سالب', V.exercice13, 6);
  page(15, 'الشكل النموذجي: حلّ، حصر، ثمّ جداء حصرين', V.exercice15, 7);
  page(16, 'مجالان، تقاطع، أعداد صحيحة و عدد أصمّ', V.exercice16, 4);
  page(17, 'كل شيء يمرّ بـ E — تسعة أسئلة', V.exercice17, 9);
})(typeof window !== 'undefined' ? window : globalThis);
