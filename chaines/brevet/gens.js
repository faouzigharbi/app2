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
})(typeof window !== 'undefined' ? window : globalThis);
