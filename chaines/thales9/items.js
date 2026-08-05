// LE CATALOGUE DES ÉNONCÉS — relevés sur les feuilles, et sur elles seules.
//
// Trente-quatre documents de 9ᵉ (فوزي الغربي, plus des épreuves de concours).
// Ce qui est engendré, c'est le RAISONNEMENT et les NOMBRES ; la question est
// celle du maître.
//
// LES VALEURS SONT LUES SUR LES COORDONNÉES. Un item pose des points, puis
// DÉCLARE quelles longueurs l'énoncé donne — et leur valeur est relevée sur la
// figure, jamais saisie à côté. C'est la leçon de droites7, où le texte
// annonçait 9 pendant que le dessin montrait 18 : rien ne les reliait.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Thales;
  const R = M ? require('./regles.js') : racine.Regles;

  const ITEMS = [];
  const item = (src, f, d, monter) => ITEMS.push({ src, f, n: 9, d, monter });
  const seg = R.seg, dr = R.dr;

  // Un triplet pythagoricien, pour que les longueurs tombent juste quand
  // l'énoncé les veut entières.
  const TRIPLETS = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15],
                    [12, 16, 20], [7, 24, 25], [20, 21, 29]];

  // ═══════════════════════════════════════════════════════════════════════
  // THALÈS — calculer une longueur (THALES9 ex11-13 ; Thales 2021 ex5, ex8)
  // ═══════════════════════════════════════════════════════════════════════

  // Thales 2021 modifié ex8 — ABC, M sur [BC], la parallèle à (AB) coupe [AC]
  item('Thales 2021 ex8', 'thales-longueur', 'moyen', () => {
    // LES TROIS CÔTÉS DOIVENT ÊTRE RATIONNELS. La seconde question soustrait
    // BM à BC : sans un triplet pythagoricien, BC est irrationnel, la règle se
    // tait — et l'item ENTIER disparaît, ce qui est pire que la question
    // manquante. On pose donc l'angle droit en A.
    const [p2, q3] = F.choix(TRIPLETS);
    const num = F.ent(1, 4), den = num + F.ent(1, 3);    // BM/BC = num/den
    const t = F.q(num, den);
    const S = F.pt(0, 0), B = F.pt(p2, 0), C = F.pt(F.Q0, F.q(q3));
    // Le sommet est B : M sur [BC], N sur [BA], (MN)//(AC)… on prend le
    // triangle vu de B, comme la feuille.
    const Mp = F.surDroite(B, C, t), N = F.surDroite(B, S, t);
    return {
      K: 1,
      points: { A: S, B, C, M: Mp, N },
      thales: [{ S: 'B', B: 'C', C: 'A', M: 'M', N: 'N' }],
      para: [[dr('M', 'N'), dr('C', 'A')]],
      entre: [['B', 'M', 'C']],
      donne: [seg('B', 'M'), seg('B', 'C'), seg('C', 'A')],
      buts: [{ but: ['lg2', seg('M', 'N'), null], question: 'أحسب المسافة MN.' },
             { but: ['lg2', seg('M', 'C'), null], question: 'استنتج المسافة MC.' }],
      texte: g => ['ABC مثلّث حيث BC = ' + g(seg('B', 'C')) + ' و AC = '
                   + g(seg('C', 'A')) + '.',
                   'M نقطة من [BC] بحيث BM = ' + g(seg('B', 'M')) + '.',
                   'المستقيم المارّ من M و الموازي لـ (AB) يقطع [AC] في N.'],
      question: 'أحسب المسافة MN.',
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['M', 'N']] },
      indice: 'طبّق نظرية طالس في المثلّث ABC مع الموازي (MN)'
    };
  });

  // THALES9 ex12 — M sur [AB], deux parallèles successives
  item('THALES9 ex12', 'thales-longueur', 'moyen', () => {
    // Même raison : NC = AC − AN et MB = AB − AM exigent AC et AB rationnels.
    const p = F.ent(4, 12), q2 = F.ent(4, 12);
    const num = F.ent(1, 3), den = num + F.ent(1, 4);
    const t = F.q(num, den);
    const A = F.pt(0, 0), B = F.pt(3 * p, 0), C = F.pt(F.Q0, F.q(3 * q2));
    const Mp = F.surDroite(A, B, t), N = F.surDroite(A, C, t);
    return {
      K: 1,
      points: { A, B, C, M: Mp, N },
      thales: [{ S: 'A', B: 'B', C: 'C', M: 'M', N: 'N' }],
      para: [[dr('M', 'N'), dr('B', 'C')]],
      entre: [['A', 'N', 'C'], ['A', 'M', 'B']],
      donne: [seg('A', 'M'), seg('A', 'B'), seg('A', 'C')],
      buts: [{ but: ['lg2', seg('A', 'N'), null], question: 'أحسب المسافة AN.' },
             { but: ['lg2', seg('N', 'C'), null], question: 'استنتج المسافة NC.' },
             { but: ['lg2', seg('M', 'B'), null], question: 'أحسب المسافة MB.' }],
      texte: g => ['ABC مثلّث و M نقطة من [AB] بحيث AM = ' + g(seg('A', 'M'))
                   + ' و AB = ' + g(seg('A', 'B')) + '.',
                   'AC = ' + g(seg('A', 'C')) + '.',
                   'المستقيم المارّ من M و الموازي لـ (BC) يقطع (AC) في N.'],
      question: 'أحسب المسافة AN.',
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['M', 'N']] },
      indice: 'AM/AB = AN/AC'
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // LIRE LA CONFIGURATION — « النشاط الأول », neuf figures, AUCUN nombre
  //
  // La feuille ne demande pas de calculer : elle demande de reconnaître le
  // triangle, la parallèle, les appartenances, et d'écrire les trois rapports.
  // C'est l'exercice de démarrage, et le seul de tout le chapitre dont la
  // conclusion n'est pas une longueur mais la proportion elle-même.
  //
  // DEUX POSES, PAS UNE. La parallèle coupe les côtés (M et B du même côté du
  // sommet), ou bien elle coupe leurs prolongements — le « papillon ». Thalès
  // vaut dans les deux cas, et la feuille les mélange à dessein : quatre de
  // ses neuf figures sont des papillons.
  // ═══════════════════════════════════════════════════════════════════════

  const poseThales = (papillon) => {
    const a = F.ent(3, 9), b = F.ent(3, 9);
    const num = F.ent(1, 4), den = num + F.ent(1, 4);
    const t = F.q(papillon ? -num : num, den);
    const S = F.pt(0, 0), B = F.pt(4 * a, F.q(a)), C = F.pt(F.q(b), F.q(3 * b));
    return { S, B, C, M: F.surDroite(S, B, t), N: F.surDroite(S, C, t) };
  };

  for (const papillon of [false, true]) {
    item('Ajustement_thales النشاط الأول' + (papillon ? ' — فراشة' : ''),
         'thales-configuration', papillon ? 'moyen' : 'facile', () => {
      const g = poseThales(papillon);
      const noms = F.melanger(['A', 'B', 'C', 'M', 'N', 'E', 'F', 'G', 'I', 'J', 'K']);
      const [nS, nB, nC, nM, nN] = noms;
      const pts = {}; pts[nS] = g.S; pts[nB] = g.B; pts[nC] = g.C;
      pts[nM] = g.M; pts[nN] = g.N;
      return {
        K: 1, points: pts,
        thales: [{ S: nS, B: nB, C: nC, M: nM, N: nN }],
        para: [[dr(nM, nN), dr(nB, nC)]],
        donne: [],
        but: ['prop', seg(nS, nM) + '|' + seg(nS, nB),
                      seg(nS, nN) + '|' + seg(nS, nC),
                      seg(nM, nN) + '|' + seg(nB, nC)],
        texte: () => ['في المثلّث ' + nS + nB + nC + ' لدينا (' + nM + nN
                      + ') // (' + nB + nC + ')،',
                      'و ' + nM + ' ∈ (' + nS + nB + ') و ' + nN
                      + ' ∈ (' + nS + nC + ').'],
        question: 'أكتب النّسب المتساوية حسب نظرية طالس.',
        figure: { segments: [[nS, nB], [nS, nC], [nB, nC], [nM, nN]],
                  droites: [[nM, nN]] },
        indice: 'الرّؤوس تُقرأ انطلاقا من ' + nS + ' : ثلاث نسب متساوية'
      };
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // LA QUATRIÈME PROPORTIONNELLE, EN DÉCIMAUX — « النشاط الثالث » ex2
  //
  // Ses figures 4, 5 et 6 concluent « إذن AN ≈ ..... ». On ne conclut jamais
  // par une approximation : avec AM = 4,3 ; AB = 7,9 ; AC = 8,8 la réponse
  // est 1892/395, et c'est cela qu'on écrit. Les données, elles, gardent
  // l'écriture décimale de la feuille.
  // ═══════════════════════════════════════════════════════════════════════

  for (const papillon of [false, true]) {
    item('Applications_Thales النشاط الثالث ex2' + (papillon ? ' — فراشة' : ''),
         'thales-decimaux', 'difficile', () => {
      // Des dixièmes, comme sur la feuille : 4,3 ; 7,9 ; 8,8.
      const ab = F.q(F.ent(45, 99), 10);
      // LE RAPPORT RESTE LOIN DE 0 ET DE 1. À 6,8 contre 7,3, M se colle sur B
      // et la figure ne se lit plus ; à 0,9 contre 8, il se colle sur A. Les
      // nombres restaient exacts, mais le dessin ne montrait plus rien.
      const brut = Number(ab.n);
      const am = F.q(F.ent(Math.round(brut * 0.3), Math.round(brut * 0.7)), 10);
      const ac = F.q(F.ent(45, 99), 10);
      const t = F.qDiv(am, ab);
      // AC est porté par l'axe des ordonnées, dont le poids vaut AC² : la
      // longueur devient exacte quel que soit le décimal choisi.
      const K = F.qMul(ac, ac);
      const A = F.pt(0, 0), B = F.pt(ab, F.Q0), C = F.pt(F.Q0, F.Q1);
      const s = papillon ? F.qNeg(t) : t;
      return {
        K, points: { A, B, C, M: F.surDroite(A, B, s), N: F.surDroite(A, C, s) },
        thales: [{ S: 'A', B: 'B', C: 'C', M: 'M', N: 'N' }],
        para: [[dr('M', 'N'), dr('B', 'C')]],
        // PAS D'ENTRE DANS LE PAPILLON. Là, N est sur le PROLONGEMENT : il
        // n'est pas entre A et C, et CN vaut AC + AN, non AC − AN. Déclarer
        // l'entre sans regarder la pose, c'est affirmer de la figure ce
        // qu'elle ne montre pas — le validateur l'a refusé.
        entre: papillon ? [] : [['A', 'N', 'C']],
        buts: papillon
          ? [{ but: ['lg2', seg('A', 'N'), null], question: 'أحسب AN.' }]
          : [{ but: ['lg2', seg('A', 'N'), null], question: 'أحسب AN.' },
             { but: ['lg2', seg('N', 'C'), null], question: 'استنتج NC.' }],
        donne: [seg('A', 'M'), seg('A', 'B'), seg('A', 'C')],

        texte: g => ['المستقيمان (MN) و (BC) متوازيان، و :',
                     'AM = ' + g(seg('A', 'M')) + ' ؛ AB = ' + g(seg('A', 'B'))
                     + ' ؛ AC = ' + g(seg('A', 'C')) + '.'],
        question: 'أحسب AN. (أترك النتيجة في شكل كسر غير قابل للاختزال)',
        figure: { segments: [['A', 'B'], ['A', 'C'], ['B', 'C'], ['M', 'N']],
                  droites: [['M', 'N']] },
        indice: 'AM/AB = AN/AC ، و لا تُعطِ قيمة تقريبية'
      };
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // OÙ L'ON DÉMONTRE UN PARALLÉLISME — عكس طالس (THALES9 ex1, ex4)
  // ═══════════════════════════════════════════════════════════════════════

  item('THALES9 ex4', 'thales-parallele', 'difficile', () => {
    const p = F.ent(3, 7), num = F.ent(1, 3), den = num + F.ent(1, 3);
    const t = F.q(num, den);
    const A = F.pt(0, 0), B = F.pt(4 * p, 0), C = F.pt(F.q(p), F.q(3 * p));
    const K2 = F.surDroite(A, C, t), L = F.surDroite(A, B, t);
    return {
      K: 1,
      points: { A, B, C, K: K2, L },
      thales: [{ S: 'A', B: 'C', C: 'B', M: 'K', N: 'L' }],
      donne: [seg('A', 'K'), seg('A', 'C'), seg('A', 'L'), seg('A', 'B'),
              seg('B', 'C')],
      buts: [{ but: ['para', dr('K', 'L'), dr('C', 'B')],
               question: 'بيّن أنّ (KL) // (BC).' },
             { but: ['lg2', seg('K', 'L'), null], question: 'أحسب KL.' }],
      texte: g => ['ABC مثلّث، K نقطة من [AC] و L نقطة من [AB] بحيث :',
                   'AK = ' + g(seg('A', 'K')) + ' ، AC = ' + g(seg('A', 'C'))
                   + ' ، AL = ' + g(seg('A', 'L')) + ' ، AB = ' + g(seg('A', 'B')) + '.'],
      question: 'بيّن أنّ (KL) // (BC).',
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['K', 'L']] },
      indice: 'قارن النّسبتين AK/AC و AL/AB'
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // MBRHANAT AL-MUNTASAFAYN — مبرهنة المنتصفين (THALES9 ex1 ; Thales 2021 ex5)
  // ═══════════════════════════════════════════════════════════════════════

  item('THALES9 ex1', 'milieux', 'moyen', () => {
    const p = F.ent(3, 9);
    const A = F.pt(0, 0), B = F.pt(4 * p, 0), C = F.pt(F.q(2 * p), F.q(3 * p));
    const I = F.milieu(A, B), J = F.milieu(A, C);
    return {
      K: 1,
      points: { A, B, C, I, J },
      thales: [{ S: 'A', B: 'B', C: 'C', M: 'I', N: 'J' }],
      milieux: [['I', 'A', 'B'], ['J', 'A', 'C']],
      donne: [seg('B', 'C'), seg('A', 'B')],
      buts: [{ but: ['lg2', seg('I', 'J'), null], question: 'أحسب IJ.' },
             { but: ['lg2', seg('A', 'I'), null], question: 'أحسب AI.' }],
      texte: g => ['ABC مثلّث حيث BC = ' + g(seg('B', 'C')) + ' و AB = '
                   + g(seg('A', 'B')) + '.',
                   'I و J منتصفا الضّلعين [AB] و [AC] على التّوالي.'],
      question: 'أحسب المسافة IJ.',
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['I', 'J']],
                marques: [['A', 'I', 1], ['I', 'B', 1], ['A', 'J', 2], ['J', 'C', 2]] },
      indice: 'المستقيم المارّ من منتصفَي ضلعين يوازي الثالث و طوله نصف طوله'
    };
  });

  item('Thales 2021 ex5', 'milieux', 'difficile', () => {
    const p = F.ent(3, 8);
    const A = F.pt(0, 0), B = F.pt(4 * p, 0), C = F.pt(F.q(p), F.q(3 * p));
    const Mp = F.milieu(B, C);
    // La parallèle à (AB) menée de M coupe (AC) en N — donc N est le milieu.
    const N = F.intersection(Mp, F.translate(Mp, A, B), A, C);
    return {
      K: 1,
      points: { A, B, C, M: Mp, N },
      thales: [{ S: 'C', B: 'B', C: 'A', M: 'M', N: 'N' }],
      milieux: [['M', 'B', 'C']],
      para: [[dr('M', 'N'), dr('A', 'B')]],
      donne: [seg('A', 'C')],
      buts: [{ but: ['milieu', 'N', ...seg('A', 'C').split('')],
               question: 'بيّن أنّ N منتصف [AC].' },
             { but: ['lg2', seg('A', 'N'), null], question: 'استنتج AN.' }],
      texte: g => ['ABC مثلّث و M منتصف [BC]، و AC = ' + g(seg('A', 'C')) + '.',
                    'المستقيم المارّ من M و الموازي للمستقيم (AB) يقطع [AC] في النّقطة N.'],
      question: 'بيّن أنّ N منتصف [AC].',
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['M', 'N']],
                marques: [['B', 'M', 1], ['M', 'C', 1]] },
      indice: 'المارّ من منتصف ضلع و الموازي لضلع ثانٍ يمرّ من منتصف الثالث'
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // PYTHAGORE (Pythagore (3) ex3 ; TRIANGLES9_23 ex7 ; RevisBeja)
  // ═══════════════════════════════════════════════════════════════════════

  item('Pythagore (3) ex3', 'pythagore', 'facile', () => {
    const [a, b] = [F.ent(2, 9), F.ent(2, 9)];
    const A = F.pt(0, 0), E = F.pt(a, 0), Bp = F.pt(0, b);
    return {
      K: 1,
      points: { E: A, A: E, B: Bp },        // l'angle droit est en E
      triangles: [['A', 'E', 'B']],
      rects: [['A', 'E', 'B']],
      donne: [seg('A', 'E'), seg('E', 'B')],
      but: ['lg2', seg('A', 'B'), null],
      texte: g => ['ABE مثلّث قائم الزاوية في E بحيث AE = ' + g(seg('A', 'E'))
                   + ' و EB = ' + g(seg('E', 'B')) + '.'],
      question: 'أحسب المسافة AB.',
      figure: { segments: [['A', 'E'], ['E', 'B'], ['B', 'A']],
                angles: [['A', 'E', 'B']] },
      indice: 'المثلّث قائم في E : طبّق نظرية بيتاغور'
    };
  });

  item('TRIANGLES9_23 ex7', 'pythagore', 'moyen', () => {
    const [x, y, z] = F.choix(TRIPLETS);
    const A = F.pt(0, 0), B = F.pt(x, 0), C = F.pt(0, y);
    const P = F.plan(1);
    return {
      K: 1,
      points: { A, B, C, H: P.projete(A, B, C), I: F.milieu(B, C) },
      triangles: [['B', 'A', 'C']],
      rects: [['B', 'A', 'C']],
      pieds: { ['A' + seg('B', 'C')]: 'H' },
      milieux: [['I', 'B', 'C']],
      donne: [seg('A', 'B'), seg('B', 'C')],
      buts: [{ but: ['lg2', seg('A', 'C'), null], question: 'أحسب المسافة AC.' },
             { but: ['lg2', seg('A', 'H'), null], question: 'أحسب الارتفاع AH.' },
             { but: ['lg2', seg('I', 'A'), null], question: 'استنتج المسافة IA.' }],
      texte: g => ['ABC مثلّث قائم الزاوية في A حيث AB = ' + g(seg('A', 'B'))
                   + ' و BC = ' + g(seg('B', 'C')) + '.',
                   'H هو المسقط العمودي لـ A على (BC)، و I منتصف [BC].'],
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['A', 'H'], ['I', 'A']],
                angles: [['B', 'A', 'C']],
                marques: [['B', 'I', 1], ['I', 'C', 1]] },
      indice: 'بيتاغور، ثمّ العلاقة القياسية، ثمّ الدائرة المحيطة'
    };
  });

  // TRIANGLES9_23 ex7, AVEC SES NOMBRES À LUI — AB = 2, AC = 4√2, BC = 6.
  //
  // On a d'abord forcé des triplets pythagoriciens pour que tout tombe rond ;
  // c'était s'éloigner de la feuille sans nécessité. Le dessin est
  // schématique — le maître ne fait construire à l'échelle que lorsque
  // l'exercice le demande —, et le poids K rend le côté irrationnel EXACT
  // pour le contrôle : AC² = K·n², rationnel, quoi que vaille AC.
  item('TRIANGLES9_23 ex7 — قيسات صمّاء', 'pythagore', 'difficile', () => {
    const k = F.choix([2, 3, 5, 6, 7]);
    const m = F.ent(2, 7), n = F.ent(2, 5);
    const A = F.pt(0, 0), B = F.pt(m, 0), C = F.pt(0, n);   // C = (0, n√k)
    return {
      K: k,
      points: { A, B, C },
      triangles: [['B', 'A', 'C']],
      rects: [['B', 'A', 'C']],
      donne: [seg('A', 'B'), seg('A', 'C')],
      but: ['lg2', seg('B', 'C'), null],
      texte: g => ['ABC مثلّث قائم الزاوية في A حيث AB = ' + g(seg('A', 'B'))
                   + ' و AC = ' + g(seg('A', 'C')) + '.'],
      question: 'أحسب المسافة BC.',
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'A']],
                angles: [['B', 'A', 'C']] },
      indice: 'BC² = AB² + AC² ، و لا تنس أنّ (a√b)² = a²b'
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // عكس بيتاغور — démontrer un angle droit
  // ═══════════════════════════════════════════════════════════════════════

  item('Pythagore (3) — عكس', 'pythagore-reciproque', 'moyen', () => {
    const [x, y] = F.choix(TRIPLETS);
    const A = F.pt(0, 0), B = F.pt(x, 0), C = F.pt(0, y);
    const P = F.plan(1);
    return {
      K: 1,
      points: { A, B, C, H: P.projete(A, B, C) },
      triangles: [['B', 'A', 'C']],
      pieds: { ['A' + seg('B', 'C')]: 'H' },
      donne: [seg('A', 'B'), seg('A', 'C'), seg('B', 'C')],
      buts: [{ but: ['rect', 'B', 'A', 'C'],
               question: 'بيّن أنّ المثلّث ABC قائم الزاوية في A.' },
             { but: ['lg2', seg('A', 'H'), null], question: 'أحسب الارتفاع AH.' }],
      texte: g => ['ABC مثلّث حيث AB = ' + g(seg('A', 'B')) + ' و AC = '
                   + g(seg('A', 'C')) + ' و BC = ' + g(seg('B', 'C')) + '.'],
      question: 'بيّن أنّ المثلّث ABC قائم الزاوية في A.',
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'A']] },
      indice: 'قارن BC² بـ AB² + AC²'
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // LE TRIANGLE RECTANGLE ET SON CERCLE (Pythagore (3) — مراجعة)
  // ═══════════════════════════════════════════════════════════════════════

  item('Pythagore (3) — مراجعة', 'cercle-rectangle', 'difficile', () => {
    const [x, y] = F.choix(TRIPLETS);
    const A = F.pt(0, 0), B = F.pt(x, 0), C = F.pt(0, y);
    const I = F.milieu(B, C);
    return {
      K: 1,
      points: { A, B, C, I },
      triangles: [['B', 'A', 'C']],
      rects: [['B', 'A', 'C']],
      milieux: [['I', 'B', 'C']],
      donne: [seg('B', 'C')],
      but: ['lg2', seg('I', 'A'), null],
      texte: g => ['ABC مثلّث قائم الزاوية في A حيث BC = ' + g(seg('B', 'C')) + '.',
                   'I منتصف [BC].'],
      question: 'أحسب المسافة IA.',
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['I', 'A']],
                angles: [['B', 'A', 'C']],
                marques: [['B', 'I', 1], ['I', 'C', 1]] },
      indice: 'مركز الدائرة المحيطة بمثلّث قائم هو منتصف وتره : فـ I متساوي البعد عن A و B و C'
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // LA RELATION MÉTRIQUE — AH × BC = AB × AC
  //
  // Sa مراجعة la liste ; les épreuves de concours (RevisBeja ex3) s'en
  // servent. C'est la règle nº 7 du catalogue soumis.
  // ═══════════════════════════════════════════════════════════════════════

  item('RevisBeja ex3', 'relation-metrique', 'difficile', () => {
    const [x, y] = F.choix(TRIPLETS);
    const A = F.pt(0, 0), B = F.pt(x, 0), C = F.pt(0, y);
    const P = F.plan(1), H = P.projete(A, B, C);
    return {
      K: 1,
      points: { A, B, C, H },
      triangles: [['B', 'A', 'C']],
      rects: [['B', 'A', 'C']],
      pieds: { ['A' + seg('B', 'C')]: 'H' },
      donne: [seg('A', 'B'), seg('A', 'C'), seg('B', 'C')],
      but: ['lg2', seg('A', 'H'), null],
      texte: g => ['ABC مثلّث قائم الزاوية في A حيث AB = ' + g(seg('A', 'B'))
                   + ' و AC = ' + g(seg('A', 'C')) + ' و BC = ' + g(seg('B', 'C')) + '.',
                   'H هو المسقط العمودي للنقطة A على (BC).'],
      question: 'أحسب الارتفاع AH.',
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['A', 'H']],
                angles: [['B', 'A', 'C'], ['A', 'H', 'B']] },
      indice: 'العلاقة القياسية : AH × BC = AB × AC'
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // LES CHAÎNES LONGUES — donner MOINS, demander PLUS LOIN
  //
  // Le maître demande des exercices difficiles depuis le premier jour, et le
  // classement par longueur de correction a montré que le chapitre était à
  // CENT POUR CENT facile. La cause n'était pas le classement : c'était que
  // chaque item donnait exactement ce qu'il faut pour UNE application, donc
  // la chaîne faisait un pas. Le moteur, qui cherche en largeur, trouvait
  // évidemment ce pas unique.
  //
  // On ne change ni le moteur ni les règles : on donne MOINS, et l'on demande
  // PLUS LOIN. Le chemin s'allonge de lui-même.
  // ═══════════════════════════════════════════════════════════════════════

  // Pythagore, puis la relation métrique : deux théorèmes pour une hauteur.
  item('Pythagore (3) — سلسلة طويلة', 'chaine-longue', 'difficile', () => {
    const [x, y] = F.choix(TRIPLETS);
    const A = F.pt(0, 0), B = F.pt(x, 0), C = F.pt(0, y);
    const P = F.plan(1), H = P.projete(A, B, C);
    return {
      K: 1, points: { A, B, C, H },
      triangles: [['B', 'A', 'C']], rects: [['B', 'A', 'C']],
      pieds: { ['A' + seg('B', 'C')]: 'H' },
      donne: [seg('A', 'B'), seg('A', 'C')],       // BC n'est PAS donné
      but: ['lg2', seg('A', 'H'), null],
      texte: g => ['ABC مثلّث قائم الزاوية في A حيث AB = ' + g(seg('A', 'B'))
                   + ' و AC = ' + g(seg('A', 'C')) + '.',
                   'H هو المسقط العمودي للنقطة A على (BC).'],
      question: 'أحسب الارتفاع AH.',
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['A', 'H']],
                angles: [['B', 'A', 'C'], ['A', 'H', 'B']] },
      indice: 'ابدأ ببيتاغور لإيجاد BC، ثمّ استعمل العلاقة القياسية'
    };
  });

  // Pythagore, le cercle circonscrit, puis le rayon : trois théorèmes.
  item('Pythagore (3) مراجعة — سلسلة طويلة', 'chaine-longue', 'difficile', () => {
    const [x, y] = F.choix(TRIPLETS);
    const A = F.pt(0, 0), B = F.pt(x, 0), C = F.pt(0, y);
    const I2 = F.milieu(B, C);
    return {
      K: 1, points: { A, B, C, I: I2 },
      triangles: [['B', 'A', 'C']], rects: [['B', 'A', 'C']],
      milieux: [['I', 'B', 'C']],
      donne: [seg('A', 'B'), seg('A', 'C')],       // ni BC ni BI
      but: ['lg2', seg('I', 'A'), null],
      texte: g => ['ABC مثلّث قائم الزاوية في A حيث AB = ' + g(seg('A', 'B'))
                   + ' و AC = ' + g(seg('A', 'C')) + '، و I منتصف [BC].'],
      question: 'أحسب المسافة IA.',
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['I', 'A']],
                angles: [['B', 'A', 'C']],
                marques: [['B', 'I', 1], ['I', 'C', 1]] },
      indice: 'بيتاغور، ثمّ الدائرة المحيطة، ثمّ نصف القطر'
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // LA RELATION HARMONIQUE — THALES0 2014 ex5
  //
  // « ABCD شبه منحرف قاعدتاه (AB) و (CD) و قائم في A و D » ; E est le point de
  // rencontre des diagonales, F son projeté sur (AD). Alors
  //
  //     EF/AB + EF/CD = 1
  //
  // et ce, quelles que soient les longueurs. C'est la plus jolie de la feuille,
  // et elle attendait qu'on sache ADDITIONNER deux rapports.
  // ═══════════════════════════════════════════════════════════════════════

  item('THALES0 2014 ex5', 'relation-rapports', 'difficile', () => {
    const ab = F.ent(2, 9), cd = F.ent(2, 9), ad = F.ent(3, 9);
    const A = F.pt(0, 0), B = F.pt(ab, 0);
    const D = F.pt(F.Q0, F.q(-ad)), C = F.pt(F.q(cd), F.q(-ad));
    const E = F.intersection(A, C, B, D);
    const Fp = F.pt(F.Q0, E.y);                  // le projeté de E sur (AD)
    return {
      K: 1, points: { A, B, C, D, E, F: Fp },
      para: [[dr('A', 'B'), dr('D', 'C')], [dr('E', 'F'), dr('A', 'B')]],
      relations: [{ op: 'somme',
                    rapports: [['E', 'F', 'A', 'B'], ['E', 'F', 'C', 'D']],
                    valeur: F.Q1,
                    depuis: [[dr('A', 'B'), dr('D', 'C')]] }],
      donne: [seg('A', 'B'), seg('C', 'D'), seg('A', 'D')],
      // Le rapport s'écrit en QUATRE morceaux — E|F|A|B —, comme la règle le
      // produit : deux points au numérateur, deux au dénominateur. Écrit en
      // deux (« EF|AB »), le but ne rejoignait jamais la conclusion.
      but: ['relation', 'somme', 'E|F|A|B;E|F|C|D', '1/1'],
      texte: g => ['ABCD شبه منحرف قاعدتاه (AB) و (CD)، قائم في A و في D،',
                   'حيث AB = ' + g(seg('A', 'B')) + ' و CD = ' + g(seg('C', 'D'))
                   + ' و AD = ' + g(seg('A', 'D')) + '.',
                   'E نقطة تقاطع القطرين (AC) و (BD)، و F المسقط العمودي لـ E على (AD).'],
      question: 'بيّن أنّ EF/AB + EF/CD = 1.',
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'],
                           ['A', 'C'], ['B', 'D'], ['E', 'F']],
                angles: [['B', 'A', 'D'], ['A', 'D', 'C']] },
      indice: 'طالس مرّتين : EF/AB dans le triangle DAB، و EF/CD dans CDA'
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // LA CASCADE DE PARALLÈLES — THALES0 2014 ex4
  //
  // Une parallèle, puis une autre menée du point qu'elle vient de créer, puis
  // une troisième. L'exercice attendait la SOUSTRACTION de longueurs — CE =
  // CA − AE —, que le moteur ne savait pas faire ; c'est la brique qu'on
  // vient de poser. Cinq maillons, et chacun est refait par le validateur.
  // ═══════════════════════════════════════════════════════════════════════

  item('THALES0 2014 ex4', 'cascade', 'difficile', () => {
    const [b, c] = F.choix([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5], [8, 15]]);
    const d = F.ent(1, b - 1);
    const A = F.pt(0, 0), B = F.pt(b, 0), C = F.pt(F.Q0, F.q(c));
    const D = F.pt(F.q(d), F.Q0);
    const E = F.pt(F.Q0, F.q(c * d, b));                 // (DE) // (BC)
    const Fp = F.pt(F.q(b - d), F.q(c * d, b));          // (EF) // (AB)
    return {
      K: 1, points: { A, B, C, D, E, F: Fp },
      thales: [{ S: 'A', B: 'B', C: 'C', M: 'D', N: 'E' },
               { S: 'C', B: 'A', C: 'B', M: 'E', N: 'F' }],
      para: [[dr('D', 'E'), dr('B', 'C')], [dr('E', 'F'), dr('A', 'B')]],
      entre: [['A', 'E', 'C'], ['B', 'F', 'C']],
      donne: [seg('A', 'B'), seg('A', 'D'), seg('A', 'C'), seg('B', 'C')],
      // LES QUATRE QUESTIONS DE LA FEUILLE, dans son ordre. Le maître ne
      // demande pas BF d'un coup : il fait passer par AE, puis CE, puis CF.
      // N'en garder que la dernière, c'était couper son exercice.
      buts: [{ but: ['lg2', seg('A', 'E'), null], question: 'أحسب AE.' },
             { but: ['lg2', seg('C', 'E'), null], question: 'استنتج CE.' },
             { but: ['lg2', seg('C', 'F'), null], question: 'أحسب CF.' },
             { but: ['lg2', seg('B', 'F'), null], question: 'استنتج BF.' }],
      texte: g => ['ABC مثلّث حيث AB = ' + g(seg('A', 'B')) + ' و AC = '
                   + g(seg('A', 'C')) + ' و BC = ' + g(seg('B', 'C')) + '.',
                   'D نقطة من [AB] بحيث AD = ' + g(seg('A', 'D')) + '.',
                   'الموازي لـ (BC) المارّ من D يقطع (AC) في E،',
                   'و الموازي لـ (AB) المارّ من E يقطع (BC) في F.'],
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['D', 'E'], ['E', 'F']] },
      indice: 'طالس مرّتين : أوّلا في ABC، ثمّ في CAB ؛ و CE = CA − AE'
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // LA PROJECTION PARALLÈLE — THALES0 2014 ex1
  //
  // « لتكن I مسقط C على (BD) وفقا لمنحى (AB) » : le projeté de C sur (BD)
  // SELON LA DIRECTION (AB), qui n'est pas le projeté orthogonal.
  //
  // On l'avait mise de côté comme demandant une notion neuve. C'était faux :
  // dire que I est le projeté de C sur (BD) selon (AB), c'est exactement dire
  // que I est sur (DB), que C est sur (DA), et que (IC) // (AB) — une
  // configuration de Thalès de sommet D, que le moteur sait déjà traiter. Il
  // n'y avait pas de règle à ajouter, seulement une CONSTRUCTION.
  // ═══════════════════════════════════════════════════════════════════════

  item('THALES0 2014 ex1', 'projection-parallele', 'difficile', () => {
    const b = F.ent(2, 9), d = F.ent(1, 5), c = d + F.ent(1, 6);
    // (DA) portée par l'axe des ordonnées, (AB) par celui des abscisses :
    // le projeté selon (AB) est alors le point de (DB) à la hauteur de C.
    const A = F.pt(0, 0), B = F.pt(b, 0), C = F.pt(F.Q0, F.q(c)), D = F.pt(F.Q0, F.q(d));
    const I2 = F.intersection(D, B, C, F.translate(C, A, B));
    return {
      K: 1, points: { A, B, C, D, I: I2 },
      thales: [{ S: 'D', B: 'B', C: 'A', M: 'I', N: 'C' }],
      para: [[dr('I', 'C'), dr('A', 'B')]],
      donne: [seg('A', 'B'), seg('D', 'A'), seg('D', 'C')],
      but: ['lg2', seg('I', 'C'), null],
      texte: g => ['ABC مثلّث حيث AB = ' + g(seg('A', 'B')) + ' و AC = '
                   + g(seg('A', 'C')) + '، و D نقطة من [AC] بحيث AD = '
                   + g(seg('A', 'D')) + '.',
                   'I هي مسقط C على (BD) وفقا لمنحى (AB).'],
      question: 'أحسب المسافة IC.',
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['D', 'B'], ['I', 'C']],
                droites: [['D', 'B']] },
      indice: 'المسقط وفقا لمنحى (AB) يعني (IC) // (AB) : طالس في المثلّث DAB'
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // LE TRAPÈZE ET SES DIAGONALES — THALES0 2014 ex3 et ex5
  //
  // « MNPQ شبه منحرف قاعدتاه [MN] و [PQ] و I نقطة تقاطع قطريه ». Les deux
  // diagonales se croisent, et Thalès y joue en PAPILLON : le sommet est le
  // point de croisement, et les deux bases sont de part et d'autre. C'est la
  // configuration la plus fréquente des feuilles de concours, et la seule que
  // le chapitre n'avait pas.
  // ═══════════════════════════════════════════════════════════════════════

  item('THALES0 2014 ex3', 'trapeze', 'difficile', () => {
    const [w, h] = F.choix([[3, 4], [6, 8], [5, 12], [8, 15], [20, 21]]);
    // I à l'origine ; la grande base en bas, la petite en haut, obtenue par
    // une homothétie négative de rapport t — d'où le papillon.
    const num = F.ent(1, 3), den = num + F.ent(1, 3);
    const t = F.q(num, den);
    const I2 = F.pt(0, 0), P = F.pt(0, -h), Q = F.pt(w, -h);
    const Mp = F.pt(F.Q0, F.qMul(t, F.q(h)));
    const N = F.pt(F.qMul(t, F.q(-w)), F.qMul(t, F.q(h)));
    return {
      K: 1, points: { I: I2, M: Mp, N, P, Q },
      thales: [{ S: 'I', B: 'P', C: 'Q', M: 'M', N: 'N' }],
      para: [[dr('M', 'N'), dr('P', 'Q')]],
      entre: [['N', 'I', 'Q'], ['M', 'I', 'P']],
      donne: [seg('M', 'N'), seg('P', 'Q'), seg('N', 'Q'), seg('M', 'P')],
      // LES QUESTIONS DE LA FEUILLE, dans son ordre : « أحسب IN و IQ », puis
      // le partage de l'autre diagonale. On ne donnait IQ que parce que le
      // moteur ne savait pas partager un segment ; il le sait maintenant, et
      // l'énoncé retrouve les données du maître — les deux diagonales.
      buts: [{ but: ['lg2', seg('I', 'N'), null], question: 'أحسب IN.' },
             { but: ['lg2', seg('I', 'Q'), null], question: 'أحسب IQ.' },
             { but: ['lg2', seg('M', 'I'), null], question: 'أحسب MI.' }],
      texte: g => ['MNPQ شبه منحرف قاعدتاه [MN] و [PQ]، و I نقطة تقاطع قطريه.',
                   'MN = ' + g(seg('M', 'N')) + ' و PQ = ' + g(seg('P', 'Q'))
                   + ' و NQ = ' + g(seg('N', 'Q')) + ' و MP = ' + g(seg('M', 'P')) + '.'],
      figure: { segments: [['M', 'N'], ['P', 'Q'], ['M', 'P'], ['N', 'Q'],
                           ['M', 'Q'], ['N', 'P']] },
      indice: 'القطران يتقاطعان في I : طبّق طالس في وضعية الفراشة'
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // LES QUADRILATÈRES — règles 16 à 19
  //
  // TRIANGLES9_23 ex1 « بيّن أنّ OIJA متوازي أضلاع », ex7 « أثبت أنّ الرّباعي
  // EFDI متوازي أضلاع » puis « أثبت أنّ EFIC مستطيل » ; Thales 2021 ex1
  // « استنتج أنّ APMN مستطيل » ; Pythagore (3) مسألة1 « ما هي طبيعة الرّباعي
  // AHCI ؟ ». La question est toujours la NATURE, jamais la construction.
  // ═══════════════════════════════════════════════════════════════════════

  // Pythagore (3) مسألة1 — H est le symétrique de I par le centre O
  item('Pythagore (3) مسألة1', 'quadrilatere', 'moyen', () => {
    const a = F.ent(3, 8), b = F.ent(3, 8), c = F.ent(2, 7);
    const A = F.pt(0, 0), C = F.pt(4 * a, F.q(c));
    const O = F.milieu(A, C);
    const Ip = F.pt(F.q(b), F.q(3 * b));
    const H = F.symetriqueCentre(Ip, O);
    return {
      K: 1, points: { A, C, I: Ip, H, O },
      quadrilateres: ['AICH'],
      milieux: [['O', 'A', 'C'], ['O', 'I', 'H']],
      donne: [],
      but: ['pgram', 'AICH'],
      texte: () => ['O منتصف [AC]، و H هي نظيرة I بالتناظر المركزي الذي مركزه O.'],
      question: 'ما هي طبيعة الرّباعي AICH ؟ علّل جوابك.',
      figure: { segments: [['A', 'I'], ['I', 'C'], ['C', 'H'], ['H', 'A'],
                           ['A', 'C'], ['I', 'H']],
                marques: [['A', 'O', 1], ['O', 'C', 1], ['I', 'O', 2], ['O', 'H', 2]] },
      indice: 'قطرا الرّباعي لهما نفس المنتصف'
    };
  });

  // TRIANGLES9_23 ex7 — d'abord parallélogramme, puis rectangle
  item('TRIANGLES9_23 ex7', 'quadrilatere', 'difficile', () => {
    const a = F.ent(3, 8), b = F.ent(3, 8);
    // Un rectangle se pose par son sommet droit : E en bas à gauche.
    const E = F.pt(0, 0), Fp = F.pt(4 * a, 0), C = F.pt(4 * a, F.q(3 * b));
    const D = F.pt(0, F.q(3 * b));
    const O = F.milieu(E, C);
    return {
      K: 1, points: { E, F: Fp, C, D, O },
      quadrilateres: ['EFCD'],
      milieux: [['O', 'E', 'C'], ['O', 'F', 'D']],
      rects: [['E', 'F', 'C']],
      donne: [],
      but: ['rect4', 'EFCD'],
      texte: () => ['O منتصف [EC] و منتصف [FD] في نفس الوقت،',
                    'و المثلّث EFC قائم الزاوية في F.'],
      question: 'أثبت أنّ الرّباعي EFCD مستطيل.',
      figure: { segments: [['E', 'F'], ['F', 'C'], ['C', 'D'], ['D', 'E'],
                           ['E', 'C'], ['F', 'D']],
                angles: [['E', 'F', 'C']] },
      indice: 'أثبت أوّلا أنّه متوازي أضلاع، ثمّ استعمل الزاوية القائمة'
    };
  });

  // Le losange — TRIANGLES9_23 ex1 « ما نوع المثلّث ABI » et la مراجعة
  item('TRIANGLES9_23 ex1 — معيّن', 'quadrilatere', 'difficile', () => {
    const [x, y] = F.choix([[3, 4], [6, 8], [5, 12], [8, 15]]);
    // Les diagonales d'un losange se coupent en leur milieu ET à angle droit.
    const O = F.pt(0, 0);
    const A = F.pt(-x, 0), C = F.pt(x, 0), B = F.pt(0, -y), D = F.pt(0, y);
    return {
      K: 1, points: { A, B, C, D, O },
      quadrilateres: ['ABCD'],
      milieux: [['O', 'A', 'C'], ['O', 'B', 'D']],
      donne: [seg('A', 'B'), seg('B', 'C')],
      but: ['losange', 'ABCD'],
      texte: g => ['O منتصف [AC] و منتصف [BD]،',
                   'و AB = ' + g(seg('A', 'B')) + ' و BC = ' + g(seg('B', 'C')) + '.'],
      question: 'أثبت أنّ الرّباعي ABCD معيّن.',
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'],
                           ['A', 'C'], ['B', 'D']],
                marques: [['A', 'B', 1], ['B', 'C', 1]] },
      indice: 'متوازي أضلاع له ضلعان متتاليان متقايسان'
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // LE CENTRE DE GRAVITÉ — règle 14
  // TRIANGLES9_23 ex1 « ما هو مركز ثقل المثلّث ABC ؟ », ex5 « ماذا تمثّل H
  // بالنسبة للمثلّث ABC », Pythagore (3) ex4 « بيّن أنّ F هي مركز ثقل ABC »
  // ═══════════════════════════════════════════════════════════════════════

  item('Pythagore (3) ex4', 'centre-gravite', 'difficile', () => {
    // LA MÉDIANE DOIT ÊTRE RATIONNELLE : la seconde question soustrait AG à
    // AI, et sans cela la règle se tait. On pose donc I sur un triplet, puis
    // on en déduit B — au lieu de poser B et C et d'espérer.
    const m = F.ent(1, 4), c1 = F.ent(1, 9), c2 = F.ent(1, 9);
    const A = F.pt(0, 0), Ip = F.pt(3 * m, 4 * m);
    const C = F.pt(c1, c2), B = F.pt(6 * m - c1, 8 * m - c2);
    const J = F.milieu(A, C);
    const P = F.plan(1);
    const G = P.centreGravite(A, B, C);
    return {
      K: 1, points: { A, B, C, I: Ip, J, G },
      gravites: [{ G: 'G', tri: 'ABC', I: 'I', J: 'J' }],
      milieux: [['I', 'B', 'C'], ['J', 'A', 'C']],
      entre: [['A', 'G', 'I']],
      donne: [seg('A', 'I')],
      buts: [{ but: ['lg2', seg('A', 'G'), null], question: 'أحسب AG.' },
             { but: ['lg2', seg('G', 'I'), null], question: 'استنتج GI.' }],
      texte: g => ['I منتصف [BC] و J منتصف [AC]، و G نقطة تقاطع (AI) و (BJ).',
                   'AI = ' + g(seg('A', 'I')) + '.'],
      question: 'أحسب AG.',
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['A', 'I'], ['B', 'J']],
                marques: [['B', 'I', 1], ['I', 'C', 1], ['A', 'J', 2], ['J', 'C', 2]] },
      indice: 'G هو مركز الثقل : AG يساوي ثلثَي المتوسّط AI'
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // L'ORTHOCENTRE — règle 15 (TRIANGLES9_23 ex1 ex5, ex6)
  // ═══════════════════════════════════════════════════════════════════════

  item('TRIANGLES9_23 ex5', 'orthocentre', 'difficile', () => {
    const a = F.ent(2, 6), b = F.ent(2, 6);
    // SANS NOMBRES, RIEN NE VARIE. La démonstration de l'orthocentre ne
    // contient pas un chiffre : à lettrage fixe, une page en montrait quatre
    // fois la même. Les feuilles du maître changent de lettrage d'un exercice
    // à l'autre pour la même raison — c'est ce qu'on fait ici.
    const [A2, B2, C2, H2] = F.melanger(['A', 'B', 'C', 'D', 'E', 'F', 'H', 'M', 'N', 'K']);
    const A = F.pt(0, 0), B = F.pt(4 * a, 0), C = F.pt(F.q(a), F.q(3 * b));
    const P = F.plan(1);
    const H = P.orthocentre(A, B, C);
    const pts = {}; pts[A2] = A; pts[B2] = B; pts[C2] = C; pts[H2] = H;
    return {
      K: 1, points: pts,
      orthos: [{ H: H2, tri: A2 + B2 + C2,
                 h1: [A2, H2], c1: [B2, C2],
                 h2: [B2, H2], c2: [A2, C2],
                 h3: [C2, H2], c3: [A2, B2] }],
      perps: [[dr(A2, H2), dr(B2, C2)], [dr(B2, H2), dr(A2, C2)]],
      donne: [],
      but: ['perp', dr(C2, H2), dr(A2, B2)],
      texte: () => ['في المثلّث ' + A2 + B2 + C2 + '، النّقطة ' + H2 + ' تحقّق ('
                    + A2 + H2 + ') ⊥ (' + B2 + C2 + ') و (' + B2 + H2 + ') ⊥ ('
                    + A2 + C2 + ').'],
      question: 'بيّن أنّ (' + C2 + H2 + ') ⊥ (' + A2 + B2 + ').',
      figure: { segments: [[A2, B2], [B2, C2], [C2, A2]],
                droites: [[A2, H2], [B2, H2], [C2, H2]] },
      indice: H2 + ' هو المركز القائم : الارتفاع الثالث يمرّ منه بدوره'
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // LA SYMÉTRIE CENTRALE — règle 22 (THALES9 ex5 ; Thales 2021 ex7)
  // ═══════════════════════════════════════════════════════════════════════

  item('THALES9 ex5', 'symetrie', 'moyen', () => {
    const a = F.ent(3, 9), b = F.ent(2, 8);
    const O = F.pt(0, 0);
    const A = F.pt(3 * a, F.q(b)), B = F.pt(F.q(b), F.q(3 * a));
    const A2 = F.symetriqueCentre(A, O), B2 = F.symetriqueCentre(B, O);
    return {
      K: 1, points: { O, A, B, C: A2, D: B2 },
      symetries: [['C', 'A', 'O'], ['D', 'B', 'O']],
      donne: [seg('A', 'B')],
      buts: [{ but: ['lg2', seg('C', 'D'), null], question: 'أحسب CD.' },
             { but: ['para', dr('A', 'B'), dr('C', 'D')],
               question: 'بيّن أنّ (AB) // (CD).' }],
      texte: g => ['C هي نظيرة A و D هي نظيرة B بالتناظر المركزي الذي مركزه O.',
                   'AB = ' + g(seg('A', 'B')) + '.'],
      question: 'أحسب CD.',
      figure: { segments: [['A', 'B'], ['C', 'D'], ['A', 'C'], ['B', 'D']],
                marques: [['A', 'O', 1], ['O', 'C', 1], ['B', 'O', 2], ['O', 'D', 2]] },
      indice: 'التناظر المركزي يحفظ المسافات'
    };
  });

  const API = { ITEMS, TRIPLETS };
  if (M) module.exports = API; else racine.Items = API;
})(typeof window !== 'undefined' ? window : globalThis);
