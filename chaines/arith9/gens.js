// Une page par EXERCICE de la fiche ; à l'intérieur, le générateur retire les
// nombres et choisit un modèle différent à chaque chargement.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Arith;
  const C = M ? require('./criteres.js') : racine.Crit;
  const P = M ? require('./puissances.js') : racine.Puiss;

  const page = (n, titre, f, questions) => F.enregistrer(n, { titre, f, questions });

  page(1, 'شجرة الإختيار — رقمان مجهولان', C.exercice1, 4);
  page(2, 'بيّن أنّ العدد يقبل القسمة — قوى نفس الأساس', P.exercice2, 4);
  page(3, 'صواب أو خطأ مع التعليل', C.exercice3, 4);
  page(4, 'عدد كبير و قسمة إقليدية لجداء قوى', C.exercice4, 2);
  page(5, 'أعداد بأرقام مختلفة — الزوجية ثمّ القسمة على 4', C.exercice5, 2);
  page(6, 'التعداد — مبدأ الضرب', C.exercice6, 3);
  page(7, 'توحيد الأساس ثمّ التفكيك', P.exercice7, 4);
  // Deux tirages indépendants : la page pose la même question sur deux
  // expressions différentes, sinon elle n'aurait qu'un seul volet.
  page(8, 'أوجد كلّ قيم n لتقبل E القسمة',
    () => [...P.exercice8(), ...P.exercice8()], 2);
  page(9, 'M = (an + b)/(n + c) — متى يكون صحيحا', P.exercice9, 3);
})(typeof window !== 'undefined' ? window : globalThis);
