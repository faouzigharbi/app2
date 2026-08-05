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
    const a = F.ent(3, 9), b = F.ent(3, 9);              // pose du triangle
    const num = F.ent(1, 4), den = num + F.ent(1, 3);    // BM/BC = num/den
    const t = F.q(num, den);
    const S = F.pt(0, 0), B = F.pt(4 * a, 0), C = F.pt(F.q(a), F.q(3 * b));
    // Le sommet est B : M sur [BC], N sur [BA], (MN)//(AC)… on prend le
    // triangle vu de B, comme la feuille.
    const Mp = F.surDroite(B, C, t), N = F.surDroite(B, S, t);
    return {
      K: 1,
      points: { A: S, B, C, M: Mp, N },
      thales: [{ S: 'B', B: 'C', C: 'A', M: 'M', N: 'N' }],
      para: [[dr('M', 'N'), dr('C', 'A')]],
      donne: [seg('B', 'M'), seg('B', 'C'), seg('C', 'A')],
      but: ['lg2', seg('M', 'N'), null],
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
    const [p, q2] = [F.ent(4, 10), F.ent(4, 10)];
    const num = F.ent(1, 3), den = num + F.ent(1, 4);
    const t = F.q(num, den);
    const A = F.pt(0, 0), B = F.pt(3 * p, 0), C = F.pt(F.q(q2), F.q(2 * q2));
    const Mp = F.surDroite(A, B, t), N = F.surDroite(A, C, t);
    return {
      K: 1,
      points: { A, B, C, M: Mp, N },
      thales: [{ S: 'A', B: 'B', C: 'C', M: 'M', N: 'N' }],
      para: [[dr('M', 'N'), dr('B', 'C')]],
      donne: [seg('A', 'M'), seg('A', 'B'), seg('A', 'C')],
      but: ['lg2', seg('A', 'N'), null],
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
        donne: [seg('A', 'M'), seg('A', 'B'), seg('A', 'C')],
        but: ['lg2', seg('A', 'N'), null],
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
      donne: [seg('A', 'K'), seg('A', 'C'), seg('A', 'L'), seg('A', 'B')],
      but: ['para', dr('K', 'L'), dr('C', 'B')],
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
      donne: [seg('B', 'C')],
      but: ['lg2', seg('I', 'J'), null],
      texte: g => ['ABC مثلّث حيث BC = ' + g(seg('B', 'C')) + '.',
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
      donne: [],
      but: ['milieu', 'N', ...seg('A', 'C').split('')],
      texte: () => ['ABC مثلّث و M منتصف [BC].',
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
    return {
      K: 1,
      points: { A, B, C },
      triangles: [['B', 'A', 'C']],
      rects: [['B', 'A', 'C']],
      donne: [seg('A', 'B'), seg('B', 'C')],
      but: ['lg2', seg('A', 'C'), null],
      texte: g => ['ABC مثلّث قائم الزاوية في A حيث AB = ' + g(seg('A', 'B'))
                   + ' و BC = ' + g(seg('B', 'C')) + '.'],
      question: 'أحسب المسافة AC.',
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'A']],
                angles: [['B', 'A', 'C']] },
      indice: 'BC هو الوتر : BC² = AB² + AC²'
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
    return {
      K: 1,
      points: { A, B, C },
      triangles: [['B', 'A', 'C']],
      donne: [seg('A', 'B'), seg('A', 'C'), seg('B', 'C')],
      but: ['rect', 'B', 'A', 'C'],
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
      donne: [seg('M', 'N'), seg('P', 'Q'), seg('I', 'Q')],
      but: ['lg2', seg('I', 'N'), null],
      texte: g => ['MNPQ شبه منحرف قاعدتاه [MN] و [PQ]، و I نقطة تقاطع قطريه.',
                   'MN = ' + g(seg('M', 'N')) + ' و PQ = ' + g(seg('P', 'Q'))
                   + ' و IQ = ' + g(seg('I', 'Q')) + '.'],
      question: 'أحسب المسافة IN.',
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
    const a = F.ent(3, 7), b = F.ent(3, 7);
    const A = F.pt(0, 0), B = F.pt(6 * a, 0), C = F.pt(F.q(2 * b), F.q(3 * b));
    const Ip = F.milieu(B, C), J = F.milieu(A, C);
    const P = F.plan(1);
    const G = P.centreGravite(A, B, C);
    return {
      K: 1, points: { A, B, C, I: Ip, J, G },
      gravites: [{ G: 'G', tri: 'ABC', I: 'I', J: 'J' }],
      milieux: [['I', 'B', 'C'], ['J', 'A', 'C']],
      donne: [seg('A', 'I')],
      but: ['lg2', seg('A', 'G'), null],
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
      but: ['lg2', seg('C', 'D'), null],
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
