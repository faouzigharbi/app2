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

  // ── LE LIVRE 2026 — une REFONTE, pas une réédition ──────────────────────
  // 38 pages, HUIT séances, une quarantaine d'exercices — contre 47 pages,
  // treize séances et 76 exercices en 2025. Ses exercices sont en grande
  // majorité NEUFS. Les clés commencent par 26 : 2611 = 2026, séance 1, ex 1.
  page(2611, '2026 · الحصّة 1 — التمرين 1 — ', 'ثلاث عائلات، و قاسم مشترك يربطها',
       S.livre26seance1ex1, 1);
  page(2612, '2026 · الحصّة 1 — التمرين 2 — ', 'باق واحد يعبر قوّتين',
       S.livre26seance1ex2, 4);
  page(2616, '2026 · الحصّة 1 — التمرين 6 — ', 'باقيان يكمّل أحدهما الآخر',
       S.livre26seance1ex6, 3);
  page(2617, '2026 · الحصّة 1 — التمرين 7 — ', 'شجرة اختيار، ثمّ باق منعدم',
       S.livre26seance1ex7, 2);

  page(2621, '2026 · الحصّة 2 — التمرين 1 — ', 'سلسلة حصر تنغلق على نفسها',
       S.livre26seance2ex1, 5);
  // L'exercice 5 de cette séance N'EST PAS porté : voir le README — son A(1;2)
  // ne donne aucun parallélogramme, alors que I(1;0) est bien le centre de
  // gravité de B, C et D. À faire arbitrer par le maître.
  page(2626, '2026 · الحصّة 2 — التمرين 6 — ', 'معلم حيث كلّ شيء يسقط على معيّن',
       S.livre26seance2ex6, 6);
  // La séance 3 du 2026 est ENTIÈREMENT faite de reprises : son exercice 1 est
  // ex21, son 3 est ex23, son 4 est ex24 — mêmes coordonnées —, et son 5 est
  // une pyramide. Rien à porter.
  //
  // La séance 4 : son 1 est ex31, ses 3 et 4 sont ex33 et ex34, son 6 est le
  // « نموذجية مدنين » d'ex36, et son 7 est un prisme. Seul son exercice 2 est
  // neuf.
  page(2642, '2026 · الحصّة 4 — التمرين 2 — ', 'معيّن يكفي قطراه للتعرّف عليه',
       S.livre26seance4ex2, 6);
  // La séance 5 : son ex1 est ex41, son ex4 est ex132 (et sa partie II ne se
  // referme pas plus qu'en 2025), son ex5 « منزه » est ex65 — et le livre 2026
  // y REPRODUIT la coquille n° 10, le 1/5 qui devrait être 1/2. Seul ex2 est neuf.
  page(2652, '2026 · الحصّة 5 — التمرين 2 — ', 'زاوية 45° مخبّأة، ثمّ شبه منحرف ينغلق',
       S.livre26seance5ex2, 7);

  // LA SÉANCE 1 — la plus longue du livre (douze exercices) et la dernière
  // ouverte, parce qu'elle vit presque entièrement d'ARBRE DE CHOIX. La pièce
  // manquait ; c'est `denombrer.js`, et il compte en parcourant les mille
  // nombres à trois chiffres, jamais en refaisant le produit de la chaîne.
  //
  // Son exercice 11 est LE MÊME que l'exercice 5 de la séance 13 — mais il
  // porte SA FIGURE, que la séance 13 avait perdue. L'exclusion notée là-bas
  // tombe : c'est cette page qui porte l'exercice.
  page(11, 'الحصّة 1 — التمرين 1 — ', 'رقمان، و قوّة، و شجرة اختيار',
       S.seance1ex1, 3);
  page(12, 'الحصّة 1 — التمرين 2 — ', 'ثلاثة تعدادات، و حلّ واحد في آخرها',
       S.seance1ex2, 3);
  page(15, 'الحصّة 1 — التمرين 5 — ', 'بواقي القسمة على 4، و ما يُبنى عليها',
       S.seance1ex5, 2);
  page(16, 'الحصّة 1 — التمرين 6 — ', 'ثلاث عائلات من الأرقام، و 42 عددا',
       S.seance1ex6, 3);
  page(17, 'الحصّة 1 — التمرين 7 — ', 'رقمان متتاليان، و قوّة',
       S.seance1ex7, 3);
  page(19, 'الحصّة 1 — التمرين 9 — ', 'حرف زوجي، و قواسم العدد 15',
       S.seance1ex9, 4);
  // La clé est 1010, pas 110 : le livre numérote À L'INTÉRIEUR de la séance, et
  // le 110 était déjà pris par l'exercice 11.
  page(1010, 'الحصّة 1 — التمرين 10 — ', 'ستّ قابليات للقسمة، و سابعة خاطئة',
       S.seance1ex10, 5);
  page(110, 'الحصّة 1 — التمرين 11 — ', 'مستطيل في معلم — و الشكل الضائع من الحصّة 13',
       S.seance1ex11, 8);

  page(21, 'الحصّة 2 — التمرين 1 — ', 'ثلاث عبارات صمّاء، و مقلوبان في آخر سطر',
       S.seance2ex1, 7);
  page(22, 'الحصّة 2 — التمرين 2 — ', 'عبارة واحدة A، و ثمانية أسئلة حولها',
       S.seance2ex2, 8);
  page(23, 'الحصّة 2 — التمرين 3 — ', 'معيّن، و مستطيل يفتح على معيَّن آخر',
       S.seance2ex3, 13);
  page(24, 'الحصّة 2 — التمرين 4 — ', 'دائرة قطرها [AB]، و طالس في معلم',
       S.seance2ex4, 12);
  page(25, 'الحصّة 2 — التمرين 5 — ', 'رباعي أوجه منتظم، و مركز ثقل يغلقه',
       S.seance2ex5, 8);

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
  page(46, 'الحصّة 4 — التمرين 6 — ', 'هرم على ركن، و آخر منتظم يولد منه',
       S.seance4ex6, 7);

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
  page(56, 'الحصّة 5 — التمرين 6 — ', 'موشور قائم بلا عدد واحد',
       S.seance5ex6, 7);
  page(57, 'الحصّة 5 — التمرين 7 — ', 'عبارة، ثمّ مساحة تعيد تكوينها',
       S.seance5ex7, 5);
  page(58, 'الحصّة 5 — التمرين 8 — ', 'مربّع ينزلق، و مجموع مساحتين',
       S.seance5ex8, 7);

  // La séance 6 : son en-tête « التمرين رقم 4 » ne porte AUCUN énoncé. Le livre
  // y numérote DEUX exercices « 5 » : celui de منزه et le parallélépipède —
  // les deux sont portés, sous les clés 65 et 66.
  page(61, 'الحصّة 6 — التمرين 1 — ', 'مستطيل ينزلق، و مجموع لا يتغيّر',
       S.seance6ex1, 8);
  page(62, 'الحصّة 6 — التمرين 2 — ', 'مقلوبان، و أربع عبارات تنهار',
       S.seance6ex2, 8);
  page(63, 'الحصّة 6 — التمرين 3 — ', 'المثلّث 6-8-10 موضوعا في معلم',
       S.seance6ex3, 8);
  page(65, 'الحصّة 6 — التمرين 5 (منزه) — ', 'العدد الذهبي، و مربّع يرسمه',
       S.seance6ex5, 7);
  page(66, 'الحصّة 6 — التمرين 5 (متوازي المستطيلات) — ', 'متوسّط يساوي نصف الوتر، في الفضاء',
       S.seance6ex6, 7);

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
  page(84, 'الحصّة 8 — التمرين 4 — ', 'هرم مائل يولّد هرما منتظما',
       S.seance8ex4, 8);
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

  // La séance 10 compte SIX exercices, et deux d'entre eux sont des reprises
  // mot pour mot : son exercice 2 est l'exercice 1 de la séance 3 (ABC avec
  // AB = 3, AC = 5, BC = 6, BM = 1 — jusqu'à la numérotation cassée 2, 3, 4, 5)
  // et son exercice 6 est l'exercice 4 de la séance 9 (ABMN, MN = 6√2,
  // AB = 2√2, BI = BJ = 4). ex31 et ex94 les portent déjà.
  page(101, 'الحصّة 10 — التمرين 1 — ', 'عددان مجهريّان، و مربّع يجمعهما',
       S.seance10ex1, 8);
  page(103, 'الحصّة 10 — التمرين 3 — ', 'عبارة، ثمّ مثلّث قائم يعيد تكوينها',
       S.seance10ex3, 8);
  page(104, 'الحصّة 10 — التمرين 4 — ', 'مثلّث متقايس الأضلاع يصير قائما',
       S.seance10ex4, 6);
  page(105, 'الحصّة 10 — التمرين 5 — ', 'العدد الذهبي، و طالس يعثر عليه',
       S.seance10ex5, 9);

  // La séance 11 est la première ENTIÈRE du livre : ses six exercices sont
  // portés, sans doublon ni exercice d'espace. Son exercice 2 a demandé une
  // pièce neuve — `entiers.js` —, parce que 243^1001 ne tient pas dans un
  // flottant, et qu'une vérification qui déborde ne vérifie rien.
  page(111, 'الحصّة 11 — التمرين 1 — ', 'رقمان يُبحث عنهما، ثلاث مرّات',
       S.seance11ex1, 3);
  page(112, 'الحصّة 11 — التمرين 2 — ', 'سبعة أعداد من ألفي رقم',
       S.seance11ex2, 7);
  page(113, 'الحصّة 11 — التمرين 3 — ', 'عبارة، ثمّ مثلّث يعيدها كاملة',
       S.seance11ex3, 11);
  page(114, 'الحصّة 11 — التمرين 4 — ', 'عبارتان، و عامل مشترك يجمعهما',
       S.seance11ex4, 6);
  page(115, 'الحصّة 11 — التمرين 5 — ', 'مستطيل، و قطر يخرج من الإطار',
       S.seance11ex5, 5);
  page(116, 'الحصّة 11 — التمرين 6 — ', 'قطر واحد، و كلّ الباقي يتبعه',
       S.seance11ex6, 10);

  // La séance 12 est portée ENTIÈRE, exercice 6 compris — c'est la première
  // pyramide de la bibliothèque, et elle n'a pu entrer que le jour où
  // espace.js a donné au vérificateur des coordonnées en trois dimensions.
  page(121, 'الحصّة 12 — التمرين 1 — ', 'اختيار من متعدّد، و سؤال بلا جواب صحيح',
       S.seance12ex1, 3);
  page(122, 'الحصّة 12 — التمرين 2 — ', 'عبارة، ثمّ معلم يعيد تكوين معادلتها',
       S.seance12ex2, 11);
  page(123, 'الحصّة 12 — التمرين 3 — ', 'مرافقان، و مثلّث يحملهما ضلعين',
       S.seance12ex3, 7);
  page(124, 'الحصّة 12 — التمرين 4 — ', 'متقايس الضلعين، و مناظرة تجعله قائما',
       S.seance12ex4, 7);
  page(125, 'الحصّة 12 — التمرين 5 — ', 'متقايس الأضلاع، و مناظرته',
       S.seance12ex5, 9);
  page(126, 'الحصّة 12 — التمرين 6 — ', 'هرم منتظم، و مستقيم عمودي على مستو',
       S.seance12ex6, 7);

  // La séance 13 porte LE SEUL exercice de statistiques du livre — et c'est
  // pour lui que chaines/stat9 a été ouvert. Le noyau statistique est copié
  // ici (stat.js) comme repere.js l'a été pour la géométrie.
  // Deux exercices de la séance 13 ne sont PAS portés, et les raisons sont
  // nommées : l'exercice 4 est une pyramide (espace, sans chapitre) et
  // l'exercice 5 renvoie à « الرسم المصاحب » — un dessin ABSENT du document,
  // sans lequel les coordonnées de C, B et M sont inconnaissables. La partie II
  // de l'exercice 2 ne se referme pas non plus ; le détail est dans le README.
  page(131, 'الحصّة 13 — التمرين 1 — ', 'معلم، و متوازي أضلاع يغلقه',
       S.seance13ex1, 8);
  page(132, 'الحصّة 13 — التمرين 2 — ', 'العدد الذهبي، و حصر يرفع قيمتين مطلقتين',
       S.seance13ex2, 6);
  page(133, 'الحصّة 13 — التمرين 3 — ', 'متقايس الأضلاع مخبّأ في نصف مثلّث',
       S.seance13ex3, 7);
  page(134, 'الحصّة 13 — التمرين 4 — ', 'هرم منتظم، و مركز ثقل يعطي التعامد الأخير',
       S.seance13ex4, 7);
  page(136, 'الحصّة 13 — التمرين 6 — ', 'خمسون سيارة، و تكراران مجهولان',
       S.seance13ex6, 6);
})(typeof window !== 'undefined' ? window : globalThis);
