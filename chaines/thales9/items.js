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

  // ── UN TRIANGLE DONT LES TROIS CÔTÉS SONT RATIONNELS ────────────────────
  //
  // Les exercices 5 à 9 de Thales 2008 donnent et demandent des longueurs sur
  // LES TROIS côtés à la fois — AT, TH et SH ; GH, GD et HD. Un triplet
  // pythagoricien n'y suffit plus : il ne rend rationnel qu'un triangle
  // rectangle, et l'angle droit se verrait sur toutes les figures. On pose
  // donc des triangles héroniens, dont les trois côtés sont entiers en
  // coordonnées entières, puis on met à l'échelle par un rationnel — ce qui
  // rend les décimales des feuilles : 17,5 ; 14,2 ; 7,3 ; 12,6.
  //
  //   [b, cx, cy] : A = (0,0), B = (b,0), C = (cx,cy), les trois côtés entiers.
  const HERON = [[6, 3, 4], [14, 5, 12], [10, 5, 12], [21, 6, 8], [12, 6, 8],
                 [25, 7, 24], [11, 16, 12], [4, 9, 12],
                 [4, 0, 3], [9, 0, 12], [8, 0, 6], [5, 0, 12], [16, 0, 12]];
  const ECHELLES = [[1, 1], [1, 2], [3, 2], [7, 10], [4, 5], [1, 5], [2, 1],
                    [5, 2], [3, 10], [9, 10], [1, 4]];
  function triangle(entier) {
    const [b, cx, cy] = F.choix(HERON);
    const [n, d] = entier ? [F.ent(1, 3), 1] : F.choix(ECHELLES);
    const s = F.q(n, d);
    return { A: F.pt(0, 0),
             B: F.pt(F.qMul(F.q(b), s), F.Q0),
             C: F.pt(F.qMul(F.q(cx), s), F.qMul(F.q(cy), s)) };
  }
  // Un rapport strictement compris entre 0 et 1 — le pied d'une parallèle.
  const rapport = () => { const n = F.ent(1, 5); return F.q(n, n + F.ent(1, 5)); };

  // LES DONNÉES DE LA FEUILLE S'ÉCRIVENT AVEC UNE VIRGULE.
  //
  // Un tirage au hasard donne des rationnels parfaitement exacts et
  // parfaitement étrangers aux feuilles : « RQ = 65/18 » est juste, mais le
  // maître écrit 3 ; 7,5 ; 12,6 ; 17,5. On retire donc la pose jusqu'à ce que
  // TOUTES les données aient une écriture décimale finie. Les RÉPONSES, elles,
  // ne changent pas de régime : elles restent des fractions irréductibles dès
  // qu'elles n'ont pas de virgule — c'est la règle du maître, et elle ne vaut
  // que parce que l'énoncé, lui, est propre.
  function toutesDecimales(pts, cles) {
    const P = F.plan(1);
    for (const k of cles) {
      const A = pts[k[0]], C = pts[k[1]];
      if (!A || !C) return false;
      const r = F.racQ(P.carre(A, C));
      if (!r) return false;
      let d = r.d;
      while (d % 2n === 0n) d /= 2n;
      while (d % 5n === 0n) d /= 5n;
      if (d !== 1n) return false;
    }
    return true;
  }
  const jolie = poser => () => {
    let s = poser();
    for (let i = 0; i < 400; i++) {
      if (toutesDecimales(s.points, (s.donne || []).map(k => k.split('')))) return s;
      s = poser();
    }
    return s;
  };

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
        but: ['prop', nS + nM + '|' + nS + nB,
                      nS + nN + '|' + nS + nC,
                      nM + nN + '|' + nB + nC],
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
    const I = F.milieu(B, C), P2 = F.plan(1);
    return {
      K: 1,
      points: { A, B, C, I, H: P2.projete(A, B, C) },
      triangles: [['B', 'A', 'C']],
      rects: [['B', 'A', 'C']],
      milieux: [['I', 'B', 'C']],
      pieds: { ['A' + seg('B', 'C')]: 'H' },
      donne: [seg('B', 'C'), seg('A', 'B'), seg('A', 'C')],
      buts: [{ but: ['lg2', seg('B', 'I'), null], question: 'أحسب BI.' },
             { but: ['lg2', seg('I', 'A'), null], question: 'استنتج IA.' },
             { but: ['lg2', seg('A', 'H'), null], question: 'أحسب الارتفاع AH.' }],
      texte: g => ['ABC مثلّث قائم الزاوية في A حيث BC = ' + g(seg('B', 'C'))
                   + ' و AB = ' + g(seg('A', 'B')) + ' و AC = ' + g(seg('A', 'C')) + '.',
                   'I منتصف [BC]، و H هو المسقط العمودي لـ A على (BC).'],
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
      points: { A, B, C, H, I: F.milieu(B, C) },
      triangles: [['B', 'A', 'C']],
      rects: [['B', 'A', 'C']],
      pieds: { ['A' + seg('B', 'C')]: 'H' },
      milieux: [['I', 'B', 'C']],
      donne: [seg('A', 'B'), seg('A', 'C'), seg('B', 'C')],
      buts: [{ but: ['lg2', seg('A', 'H'), null], question: 'أحسب الارتفاع AH.' },
             { but: ['lg2', seg('B', 'I'), null], question: 'أحسب BI.' },
             { but: ['lg2', seg('I', 'A'), null], question: 'استنتج IA.' }],
      texte: g => ['ABC مثلّث قائم الزاوية في A حيث AB = ' + g(seg('A', 'B'))
                   + ' و AC = ' + g(seg('A', 'C')) + ' و BC = ' + g(seg('B', 'C')) + '.',
                   'H هو المسقط العمودي للنقطة A على (BC)، و I منتصف [BC].'],
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['A', 'H'], ['I', 'A']],
                angles: [['B', 'A', 'C'], ['A', 'H', 'B']],
                marques: [['B', 'I', 1], ['I', 'C', 1]] },
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

  // SES SIX QUESTIONS, ET NON LA TROISIÈME SEULE. On n'en gardait qu'une —
  // la relation harmonique — parce que le moteur ne savait pas en tirer EF,
  // ni prolonger jusqu'à G, H et AH. Il le sait ; l'exercice reprend sa
  // longueur, et sa dernière question — AH = 6 — est une équation dont
  // l'inconnue est des deux côtés, comme le menhir.
  item('THALES0 2014 ex5 — ستّ مراحل', 'probleme', 'difficile', () => {
    // AB < CD : le point H, rencontre des côtés non parallèles, tombe alors
    // au-delà de A, et le rapport du partage extérieur reste inférieur à 1.
    const ab = F.ent(2, 7), cd = ab + F.ent(1, 6), ad = F.ent(3, 9);
    const A = F.pt(0, 0), B = F.pt(ab, 0);
    const D = F.pt(F.Q0, F.q(-ad)), C = F.pt(F.q(cd), F.q(-ad));
    const E = F.intersection(A, C, B, D);
    const Fp = F.pt(F.Q0, E.y);                  // le projeté de E sur (AD)
    const G = F.intersection(E, Fp, B, C);       // (EF) recoupe (BC) en G
    const H = F.intersection(A, D, B, C);        // (AD) et (BC) se rencontrent
    if (!E || !G || !H) throw new Error('pose dégénérée');
    // HA/HF = AB/FG, et FG = 2·EF = 2·AB·CD/(AB + CD) : le rapport vaut donc
    // (AB + CD)/(2·CD) — on le calcule ici pour que l'énoncé le porte.
    const rapHF = F.q(ab + cd, 2 * cd);
    return {
      K: 1, points: { A, B, C, D, E, F: Fp, G, H },
      // Le trapèze est droit en A et en D : (EF), perpendiculaire à (AD)
      // comme (AB) et (CD), leur est donc parallèle — et (FG) est la même
      // droite que (EF), puisque G est dessus.
      para: [[dr('A', 'B'), dr('D', 'C')], [dr('E', 'F'), dr('A', 'B')],
             [dr('E', 'F'), dr('C', 'D')], [dr('F', 'G'), dr('D', 'C')]],
      thales: [{ S: 'D', B: 'B', C: 'A', M: 'E', N: 'F' },
               { S: 'A', B: 'C', C: 'D', M: 'E', N: 'F' },
               { S: 'H', B: 'D', C: 'C', M: 'A', N: 'B' },
               { S: 'H', B: 'D', C: 'C', M: 'F', N: 'G' }],
      entre: [['A', 'F', 'D'], ['F', 'E', 'G'], ['H', 'A', 'D'], ['H', 'F', 'D']],
      relations: [
        { op: 'somme', rapports: [['E', 'F', 'A', 'B'], ['E', 'F', 'C', 'D']],
          valeur: F.Q1, depuis: [[dr('A', 'B'), dr('D', 'C')]] },
        { op: 'somme', rapports: [['E', 'G', 'A', 'B'], ['E', 'G', 'C', 'D']],
          valeur: F.Q1, depuis: [[dr('A', 'B'), dr('D', 'C')]] },
        // HA/HD = AB/DC et HF/HD = FG/DC : le quotient des deux donne
        // HA/HF = AB/FG, la cinquième question du maître.
        { op: 'produit', rapports: [['H', 'A', 'H', 'F']], valeur: rapHF,
          longueurs: [seg('A', 'B'), seg('F', 'G')],
          depuis: [[dr('F', 'G'), dr('D', 'C')], [dr('A', 'B'), dr('D', 'C')]] }
      ],
      donne: [seg('A', 'B'), seg('C', 'D'), seg('A', 'D')],
      buts: [
        { but: ['prop', 'DE|DB', 'DF|DA', 'EF|BA'],
          question: 'بيّن أنّ DE/DB = DF/DA = EF/BA.' },
        { but: ['prop', 'AE|AC', 'AF|AD', 'EF|CD'],
          question: 'بيّن أنّ AE/AC = AF/AD = EF/CD.' },
        { but: ['relation', 'somme', 'E|F|A|B;E|F|C|D', '1/1'],
          question: 'استنتج أنّ EF/AB + EF/CD = 1.' },
        { but: ['lg2', seg('E', 'F'), null], question: 'استنتج EF.' },
        { but: ['lg2', seg('E', 'G'), null], question: 'أحسب EG بنفس الطريقة.' },
        { but: ['milieu', 'E', 'F', 'G'], question: 'بيّن أنّ E هي منتصف [FG].' },
        { but: ['lg2', seg('F', 'G'), null], question: 'أحسب FG.' },
        { but: ['relation', 'produit', 'H|A|H|F', rapHF.n + '/' + rapHF.d],
          question: 'بيّن أنّ HA/HF = AB/FG.' },
        { but: ['lg2', seg('A', 'H'), null], question: 'أحسب AH.' }
      ],
      texte: g => ['ABCD شبه منحرف قاعدتاه (AB) و (CD)، قائم في A و في D،',
                   'حيث AB = ' + g(seg('A', 'B')) + ' و CD = ' + g(seg('C', 'D'))
                   + ' و AD = ' + g(seg('A', 'D')) + '.',
                   'E نقطة تقاطع القطرين (AC) و (BD)، و F المسقط العمودي لـ E على (AD).',
                   'G نقطة تقاطع (EF) و (BC)، و H نقطة تقاطع (AD) و (BC).'],
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'],
                           ['A', 'C'], ['B', 'D'], ['F', 'G'], ['H', 'D'], ['H', 'C']],
                angles: [['B', 'A', 'D'], ['A', 'D', 'C']] },
      indice: 'طالس مرّتين للنّسبتين، ثمّ المجموع يعطي EF ؛ و AH مجهول في الطّرفين'
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

  // MÊME RAISON POUR L'ex4 : quatre questions sur huit, et le maître n'y
  // donne que AB et AD. L'exercice entier vit dans « مسائل ».

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

  // CET EXERCICE N'EST PLUS ICI, ET C'EST VOULU. Il n'en restait que deux
  // questions sur sept — « أحسب IC » et « أحسب DI ». Le maître en pose sept,
  // et elles sont maintenant toutes dans « مسألة » (THALES0 2014 ex1 — سبع
  // مراحل). Garder en plus la version courte, c'était garder la troncature.

  // ═══════════════════════════════════════════════════════════════════════
  // LE TRAPÈZE ET SES DIAGONALES — THALES0 2014 ex3 et ex5
  //
  // « MNPQ شبه منحرف قاعدتاه [MN] و [PQ] و I نقطة تقاطع قطريه ». Les deux
  // diagonales se croisent, et Thalès y joue en PAPILLON : le sommet est le
  // point de croisement, et les deux bases sont de part et d'autre. C'est la
  // configuration la plus fréquente des feuilles de concours, et la seule que
  // le chapitre n'avait pas.
  // ═══════════════════════════════════════════════════════════════════════

  item('THALES0 2014 ex3 — ثماني مراحل', 'trapeze', 'difficile', () => {
    // I à l'origine ; la grande base en bas, la petite en haut, obtenue par
    // une homothétie négative de rapport t — d'où le papillon. G, sommet des
    // deux côtés, est alors au-dessus de la petite base.
    // QUATRE DONNÉES RATIONNELLES À LA FOIS. Le maître donne MN, PQ, NQ et
    // MQ — une base, l'autre, une diagonale et un côté. Une pose au hasard
    // rendait le côté irrationnel : « MQ = √505 », exact et introuvable sur
    // une feuille. On prend donc deux triplets pythagoriciens de même côté w,
    // avec h < H < 2h : la petite base, la grande, la diagonale et le côté
    // tombent alors tous justes ensemble.
    //
    //   [w, h, H] : PQ = w, h la hauteur, H = h(1 + t) — d'où t = H/h − 1.
    const [w, h, haut] = F.choix([[15, 20, 36], [20, 15, 21], [30, 40, 72],
                               [33, 44, 56], [36, 27, 48], [39, 52, 80],
                               [40, 30, 42], [60, 25, 45], [60, 45, 63]]);
    const t = F.qSub(F.q(haut, h), F.Q1);
    const I2 = F.pt(0, 0), P = F.pt(0, -h), Q = F.pt(w, -h);
    const Mp = F.pt(F.Q0, F.qMul(t, F.q(h)));
    const N = F.pt(F.qMul(t, F.q(-w)), F.qMul(t, F.q(h)));
    // E sur [MQ] et F sur [NP], sur la parallèle aux bases menée par I.
    const E = F.intersection(I2, F.pt(F.Q1, F.Q0), Mp, Q);
    const Fp = F.intersection(I2, F.pt(F.Q1, F.Q0), N, P);
    const G = F.intersection(Mp, Q, N, P);          // sommet des deux côtés
    const J = F.intersection(G, I2, P, Q);          // (GI) coupe la grande base
    const H = F.intersection(G, I2, Mp, N);         // et la petite
    if (!E || !Fp || !G || !J || !H) throw new Error('pose dégénérée');
    return {
      K: 1, points: { I: I2, M: Mp, N, P, Q, E, F: Fp, G, J, H },
      thales: [{ S: 'I', B: 'P', C: 'Q', M: 'M', N: 'N' },
               { S: 'M', B: 'P', C: 'Q', M: 'I', N: 'E' },
               { S: 'N', B: 'Q', C: 'P', M: 'I', N: 'F' },
               { S: 'G', B: 'J', C: 'Q', M: 'I', N: 'E' },
               { S: 'G', B: 'J', C: 'P', M: 'I', N: 'F' },
               { S: 'G', B: 'H', C: 'M', M: 'I', N: 'E' },
               { S: 'G', B: 'H', C: 'N', M: 'I', N: 'F' }],
      para: [[dr('M', 'N'), dr('P', 'Q')], [dr('I', 'E'), dr('P', 'Q')],
             [dr('I', 'F'), dr('P', 'Q')], [dr('I', 'E'), dr('J', 'Q')],
             [dr('I', 'F'), dr('J', 'P')], [dr('I', 'E'), dr('H', 'M')],
             [dr('I', 'F'), dr('H', 'N')]],
      entre: [['N', 'I', 'Q'], ['M', 'I', 'P'], ['E', 'I', 'F'],
              ['P', 'J', 'Q'], ['M', 'H', 'N']],
      donne: [seg('M', 'N'), seg('P', 'Q'), seg('N', 'Q'), seg('M', 'Q')],
      buts: [
        { but: ['lg2', seg('I', 'N'), null], question: 'أحسب IN.' },
        { but: ['lg2', seg('I', 'Q'), null], question: 'أحسب IQ.' },
        { but: ['rapport', 'MI|MP', null], question: 'بيّن أنّ MI/MP = MN/(MN + PQ).' },
        { but: ['lg2', seg('I', 'E'), null], question: 'أحسب IE.' },
        { but: ['lg2', seg('I', 'F'), null], question: 'أحسب IF.' },
        { but: ['milieu', 'I', 'E', 'F'], question: 'استنتج أنّ I منتصف [EF].' },
        { but: ['lg2', seg('E', 'F'), null], question: 'أحسب EF.' },
        { but: ['lg2', seg('M', 'E'), null], question: 'أحسب ME.' },
        { but: ['prop', 'GI|GJ', 'GE|GQ', 'IE|JQ'],
          question: 'بيّن أنّ GI/GJ = GE/GQ = IE/JQ.' },
        { but: ['prop', 'GI|GJ', 'GF|GP', 'IF|JP'],
          question: 'بيّن أنّ GI/GJ = GF/GP = IF/JP.' },
        { but: ['milieu', 'J', 'P', 'Q'], question: 'استنتج أنّ J منتصف [PQ].' },
        { but: ['milieu', 'H', 'M', 'N'], question: 'بيّن أنّ H منتصف [MN].' }
      ],
      texte: g => ['MNPQ شبه منحرف قاعدتاه [MN] و [PQ]، و I نقطة تقاطع قطريه.',
                   'MN = ' + g(seg('M', 'N')) + ' و PQ = ' + g(seg('P', 'Q'))
                   + ' و NQ = ' + g(seg('N', 'Q')) + ' و MQ = ' + g(seg('M', 'Q')) + '.',
                   'الموازي لـ (MN) المارّ من I يقطع [MQ] في E و [NP] في F.',
                   'G نقطة تقاطع (MQ) و (NP)، و (GI) يقطع (PQ) في J و (MN) في H.'],
      figure: { segments: [['M', 'N'], ['P', 'Q'], ['G', 'P'], ['G', 'Q'],
                           ['M', 'Q'], ['N', 'P'], ['E', 'F'], ['G', 'J']] },
      indice: 'الفراشة في I، ثمّ المثلّثات ذات الرّأس G : كلّ النّسب واحدة'
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
      donne: [seg('C', 'H')],
      buts: [{ but: ['pgram', 'AICH'],
               question: 'ما هي طبيعة الرّباعي AICH ؟ علّل جوابك.' },
             { but: ['lg2', seg('A', 'I'), null], question: 'استنتج AI.' }],
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
      donne: [seg('A', 'B'), seg('B', 'C'), seg('A', 'C')],
      buts: [{ but: ['losange', 'ABCD'], question: 'أثبت أنّ الرّباعي ABCD معيّن.' },
             { but: ['lg2', seg('A', 'O'), null], question: 'أحسب AO.' }],
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

  // ═══════════════════════════════════════════════════════════════════════
  // THALES 2008, ex5 à ex9 — les figures nues, une inconnue par question
  //
  // « أحسب الأعداد الحقيقية x و y و z التالية » : trois figures, trois
  // inconnues, et aucune phrase. C'est l'exercice d'entraînement pur, celui
  // que la feuille pose une fois la théorie faite — et ses trois cas ne se
  // ressemblent pas : le premier demande une somme avant Thalès, le deuxième
  // est un papillon, le troisième met l'inconnue DERRIÈRE le rapport.
  // ═══════════════════════════════════════════════════════════════════════

  // ex5 a. — (MT)//(SH) ; AT = 3, TH = 7, SH = 17,5 ; x = MT
  item('Thales 2008 ex5-a', 'thales-inconnues', 'moyen', jolie(() => {
    const g = triangle();                       // A, B → H, C → S
    const A = g.A, H = g.B, S = g.C;
    const t = rapport();
    const T = F.surDroite(A, H, t), Mp = F.surDroite(A, S, t);
    return {
      K: 1, points: { A, S, H, M: Mp, T },
      thales: [{ S: 'A', B: 'S', C: 'H', M: 'M', N: 'T' }],
      para: [[dr('M', 'T'), dr('S', 'H')]],
      entre: [['A', 'T', 'H']],
      donne: [seg('A', 'T'), seg('T', 'H'), seg('S', 'H')],
      but: ['lg2', seg('M', 'T'), null],
      texte: g2 => ['ASH مثلّث، M نقطة من [AS] و T نقطة من [AH] حيث (MT) // (SH).',
                    'AT = ' + g2(seg('A', 'T')) + ' و TH = ' + g2(seg('T', 'H'))
                    + ' و SH = ' + g2(seg('S', 'H')) + '.'],
      question: 'أحسب العدد الحقيقي x حيث x = MT.',
      figure: { segments: [['A', 'S'], ['S', 'H'], ['H', 'A'], ['M', 'T']] },
      indice: 'AH لا يُعطى : أحسبه أوّلا بجمع AT و TH'
    };
  }));

  // ex5 b. — le papillon : (RO)//(SK) ; RC = 3, SC = 10,5, CK = 7 ; y = CO
  item('Thales 2008 ex5-b', 'thales-inconnues', 'facile', jolie(() => {
    const g = triangle();                       // A → C, B → K, C → S
    const Cp = g.A, K = g.B, S = g.C;
    const t = F.qNeg(rapport());
    const R = F.surDroite(Cp, K, t), O = F.surDroite(Cp, S, t);
    return {
      K: 1, points: { C: Cp, K, S, R, O },
      thales: [{ S: 'C', B: 'K', C: 'S', M: 'R', N: 'O' }],
      para: [[dr('R', 'O'), dr('K', 'S')]],
      entre: [['R', 'C', 'K'], ['O', 'C', 'S']],
      donne: [seg('C', 'R'), seg('C', 'K'), seg('C', 'S')],
      but: ['lg2', seg('C', 'O'), null],
      texte: g2 => ['النّقط R و C و K على استقامة واحدة، و كذلك O و C و S،',
                    'و (RO) // (SK).',
                    'RC = ' + g2(seg('C', 'R')) + ' و CK = ' + g2(seg('C', 'K'))
                    + ' و SC = ' + g2(seg('C', 'S')) + '.'],
      question: 'أحسب العدد الحقيقي y حيث y = CO.',
      figure: { segments: [['R', 'K'], ['O', 'S'], ['R', 'O'], ['S', 'K']] },
      indice: 'وضعية الفراشة : الرّأس هو C، و النّسب هي نفسها'
    };
  }));

  // ex5 c. — (HO)//(IK) ; CO = 2, HO = 3, IK = 9 ; z = OK
  //
  // ICI L'INCONNUE EST DERRIÈRE. Thalès donne CK et non OK : il faut ensuite
  // retrancher CO. C'est le seul des trois cas qui demande deux notions, et
  // c'est celui que la feuille met en dernier.
  item('Thales 2008 ex5-c', 'thales-inconnues', 'moyen', jolie(() => {
    const g = triangle();                       // A → C, B → K, C → I
    const Cp = g.A, K = g.B, Ip = g.C;
    const t = rapport();
    const O = F.surDroite(Cp, K, t), H = F.surDroite(Cp, Ip, t);
    return {
      K: 1, points: { C: Cp, I: Ip, K, H, O },
      thales: [{ S: 'C', B: 'K', C: 'I', M: 'O', N: 'H' }],
      para: [[dr('O', 'H'), dr('K', 'I')]],
      entre: [['C', 'O', 'K']],
      donne: [seg('C', 'O'), seg('H', 'O'), seg('I', 'K')],
      but: ['lg2', seg('O', 'K'), null],
      texte: g2 => ['CIK مثلّث، H نقطة من [CI] و O نقطة من [CK] حيث (HO) // (IK).',
                    'CO = ' + g2(seg('C', 'O')) + ' و HO = ' + g2(seg('H', 'O'))
                    + ' و IK = ' + g2(seg('I', 'K')) + '.'],
      question: 'أحسب العدد الحقيقي z حيث z = OK.',
      figure: { segments: [['C', 'I'], ['I', 'K'], ['K', 'C'], ['H', 'O']] },
      indice: 'طالس يعطي CK ، و OK = CK − CO'
    };
  }));

  // ═══════════════════════════════════════════════════════════════════════
  // THALES 2008 ex6 — « أوجد الأعداد المجهولة »
  //
  // Sa première figure superpose DEUX configurations de Thalès sur le même
  // sommet : (RQ)//(CD) dans ACD et (RP)//(CB) dans ACB, la seconde parallèle
  // portant la première. Trois inconnues s'y suivent — x = CD, y = QP,
  // z = PB —, et chacune se sert de ce que la précédente a donné.
  // ═══════════════════════════════════════════════════════════════════════

  item('Thales 2008 ex6 — الشكل الأول', 'cascade', 'difficile', jolie(() => {
    const g = triangle();
    const A = g.A, B = g.B, C = g.C;
    const mu = rapport(), lam = rapport();
    const D = F.surDroite(C, B, mu);
    const R = F.surDroite(A, C, lam), P = F.surDroite(A, B, lam),
          Q = F.surDroite(A, D, lam);
    return {
      K: 1, points: { A, B, C, D, R, P, Q },
      thales: [{ S: 'A', B: 'C', C: 'D', M: 'R', N: 'Q' },
               { S: 'A', B: 'C', C: 'B', M: 'R', N: 'P' }],
      para: [[dr('R', 'Q'), dr('C', 'D')], [dr('R', 'P'), dr('C', 'B')]],
      entre: [['A', 'R', 'C'], ['C', 'D', 'B'], ['R', 'Q', 'P'], ['A', 'P', 'B']],
      donne: [seg('A', 'R'), seg('R', 'C'), seg('R', 'Q'), seg('D', 'B'), seg('A', 'B')],
      buts: [{ but: ['lg2', seg('C', 'D'), null], question: 'أحسب x = CD.' },
             { but: ['lg2', seg('Q', 'P'), null], question: 'استنتج y = QP.' },
             { but: ['lg2', seg('P', 'B'), null], question: 'استنتج z = PB.' }],
      texte: g2 => ['ABC مثلّث، R نقطة من [AC] و P نقطة من [AB] حيث (RP) // (BC).',
                    'D نقطة من [CB]، و (AD) يقطع [RP] في Q.',
                    'AR = ' + g2(seg('A', 'R')) + ' و RC = ' + g2(seg('R', 'C'))
                    + ' و RQ = ' + g2(seg('R', 'Q')) + ' و DB = ' + g2(seg('D', 'B'))
                    + ' و AB = ' + g2(seg('A', 'B')) + '.'],
      figure: { segments: [['A', 'C'], ['C', 'B'], ['A', 'B'], ['R', 'P'], ['A', 'D']] },
      indice: 'نفس النّسبة AR/AC تخدم في المثلّثين ACD و ACB'
    };
  }));

  // ═══════════════════════════════════════════════════════════════════════
  // L'INCONNUE DES DEUX CÔTÉS — Thales 2008 ex6, seconde figure et menhir
  //
  // « (BC)//(DE) ; AB = 5 ; BC = 3 ; DE = 4 ; CE = 2 : أحسب AC ». Ni AC ni AE
  // n'est donné : ce que la figure fournit, c'est leur DIFFÉRENCE. Le rapport
  // seul ne conclut pas, et c'est exactement l'équation « x/(x+3) = 45/50 »
  // que l'ex1 de la même feuille faisait résoudre en algèbre.
  // ═══════════════════════════════════════════════════════════════════════

  item('Thales 2008 ex6 — الشكل الثاني', 'thales-part', 'moyen', jolie(() => {
    const g = triangle();                       // A, B → D, C → E
    const A = g.A, D = g.B, E = g.C;
    const r = rapport();
    const B = F.surDroite(A, D, r), C = F.surDroite(A, E, r);
    return {
      K: 1, points: { A, B, C, D, E },
      thales: [{ S: 'A', B: 'D', C: 'E', M: 'B', N: 'C' }],
      para: [[dr('B', 'C'), dr('D', 'E')]],
      entre: [['A', 'B', 'D'], ['A', 'C', 'E']],
      donne: [seg('A', 'B'), seg('B', 'C'), seg('D', 'E'), seg('C', 'E')],
      buts: [{ but: ['lg2', seg('A', 'D'), null], question: 'أحسب AD.' },
             { but: ['lg2', seg('A', 'C'), null], question: 'أحسب x = AC.' }],
      texte: g2 => ['ADE مثلّث، B نقطة من [AD] و C نقطة من [AE] حيث (BC) // (DE).',
                    'AB = ' + g2(seg('A', 'B')) + ' و BC = ' + g2(seg('B', 'C'))
                    + ' و DE = ' + g2(seg('D', 'E')) + ' و CE = ' + g2(seg('C', 'E')) + '.'],
      figure: { segments: [['A', 'D'], ['A', 'E'], ['D', 'E'], ['B', 'C']] },
      indice: 'AC و AE مجهولان معا، لكنّ فرقهما CE معلوم'
    };
  }));

  // Le menhir de la même feuille : « Le menhir est à … ». On vise le sommet
  // inaccessible depuis deux jalons, et la mesure se lit sur le sol.
  item('Thales 2008 ex6 — المنهير', 'thales-part', 'moyen', jolie(() => {
    // UN MENHIR SE MESURE EN MÈTRES, PAS EN CENTIMÈTRES. L'échelle ordinaire
    // des figures donnait « CD = 1,875 m » : exact, et absurde sur le terrain.
    // La feuille dit 45 m et 50 m ; on tire donc dans cet ordre de grandeur.
    const g = triangle();                       // A → M, B → A, C → B
    const f = F.q(F.ent(4, 14));
    const ech = X => F.pt(F.qMul(X.x, f), F.qMul(X.y, f));
    const Mp = g.A, A = ech(g.B), B = ech(g.C);
    const r = rapport();
    const C = F.surDroite(Mp, A, r), D = F.surDroite(Mp, B, r);
    return {
      K: 1, points: { M: Mp, A, B, C, D },
      thales: [{ S: 'M', B: 'A', C: 'B', M: 'C', N: 'D' }],
      para: [[dr('C', 'D'), dr('A', 'B')]],
      entre: [['M', 'C', 'A'], ['M', 'D', 'B']],
      donne: [seg('C', 'D'), seg('A', 'B'), seg('A', 'C')],
      buts: [{ but: ['lg2', seg('C', 'M'), null], question: 'أحسب المسافة CM.' },
             { but: ['lg2', seg('A', 'M'), null], question: 'استنتج المسافة AM.' }],
      texte: g2 => ['M حجر منتصب (منهير) يتعذّر الوصول إليه.',
                    'النّقط M و C و A على استقامة واحدة، و كذلك M و D و B،',
                    'و (CD) // (AB) حيث CD = ' + g2(seg('C', 'D')) + ' m و AB = '
                    + g2(seg('A', 'B')) + ' m و CA = ' + g2(seg('A', 'C')) + ' m.'],
      question: 'أحسب المسافة CM.',
      figure: { segments: [['M', 'A'], ['M', 'B'], ['A', 'B'], ['C', 'D']] },
      indice: 'CM و AM مجهولان، و فرقهما CA معلوم'
    };
  }));

  // ═══════════════════════════════════════════════════════════════════════
  // THALES 2008 ex7 — LE PARALLÉLISME N'EST PAS DONNÉ, IL SE DÉMONTRE
  //
  // Deux angles de 60°, de part et d'autre de la sécante : c'est de là que
  // vient le parallélisme, et Thalès ne vient qu'après. L'exercice est le
  // seul de la feuille où la première étape n'est pas une longueur.
  //
  // LA FEUILLE ÉCRIT 60°, NOUS ÉCRIVONS « MÊME MESURE ». Un angle de 60°
  // n'existe pas en coordonnées rationnelles, et l'on n'énonce jamais ici ce
  // que la figure ne porte pas exactement. L'égalité, elle, est exacte — et
  // c'est elle seule qui sert.
  // ═══════════════════════════════════════════════════════════════════════

  item('Thales 2008 ex7', 'angles-paralleles', 'moyen', jolie(() => {
    const g = triangle();                       // A → O, B → T, C → E
    const O = g.A, T = g.B, E = g.C;
    const t = F.qNeg(rapport());
    const Ip = F.surDroite(O, T, t), R = F.surDroite(O, E, t);
    return {
      K: 1, points: { E, T, O, I: Ip, R },
      alternes: [{ p: 'E', s1: 'T', s2: 'I', q: 'R' }],
      thales: [{ S: 'O', B: 'I', C: 'R', M: 'T', N: 'E' }],
      entre: [['T', 'O', 'I'], ['E', 'O', 'R']],
      donne: [seg('E', 'T'), seg('O', 'T'), seg('O', 'R'), seg('R', 'I')],
      buts: [{ but: ['lg2', seg('O', 'E'), null], question: 'أحسب OE.' },
             { but: ['lg2', seg('O', 'I'), null], question: 'أحسب OI.' }],
      texte: g2 => ['النّقط T و O و I على استقامة واحدة، و كذلك E و O و R.',
                    'الزاويتان ETI و RIT متقايستان.',
                    'ET = ' + g2(seg('E', 'T')) + ' cm و OT = ' + g2(seg('O', 'T'))
                    + ' cm و OR = ' + g2(seg('O', 'R')) + ' cm و RI = '
                    + g2(seg('R', 'I')) + ' cm.'],
      figure: { segments: [['T', 'E'], ['I', 'R'], ['T', 'I'], ['E', 'R']],
                arcs: [['E', 'T', 'I', 1], ['R', 'I', 'T', 1]] },
      indice: 'الزاويتان متبادلتان داخليا : ابدأ بإثبات (ET) // (IR)'
    };
  }));

  // ═══════════════════════════════════════════════════════════════════════
  // THALES 2008 ex8 — le papillon en décimaux
  // GH = 15 ; GF = 6 ; GD = 14,2 ; HD = 7,3 → EG et EF
  // ═══════════════════════════════════════════════════════════════════════

  item('Thales 2008 ex8', 'thales-decimaux', 'facile', jolie(() => {
    const g = triangle();                       // A → G, B → H, C → D
    const G = g.A, H = g.B, D = g.C;
    const t = F.qNeg(rapport());
    const Fp = F.surDroite(G, H, t), E = F.surDroite(G, D, t);
    return {
      K: 1, points: { E, F: Fp, G, H, D },
      thales: [{ S: 'G', B: 'H', C: 'D', M: 'F', N: 'E' }],
      para: [[dr('E', 'F'), dr('H', 'D')]],
      entre: [['F', 'G', 'H'], ['E', 'G', 'D']],
      donne: [seg('G', 'H'), seg('G', 'F'), seg('G', 'D'), seg('H', 'D')],
      buts: [{ but: ['lg2', seg('E', 'G'), null], question: 'أحسب EG.' },
             { but: ['lg2', seg('E', 'F'), null], question: 'أحسب EF.' }],
      texte: g2 => ['النّقط F و G و H على استقامة واحدة، و كذلك E و G و D،',
                    'و (EF) // (HD).',
                    'GH = ' + g2(seg('G', 'H')) + ' cm و GF = ' + g2(seg('G', 'F'))
                    + ' cm و GD = ' + g2(seg('G', 'D')) + ' cm و HD = '
                    + g2(seg('H', 'D')) + ' cm.'],
      figure: { segments: [['E', 'F'], ['H', 'D'], ['F', 'H'], ['E', 'D']] },
      indice: 'النّسبة GF/GH هي نفسها لـ EG/GD و EF/HD'
    };
  }));

  // ═══════════════════════════════════════════════════════════════════════
  // THALES 2008 ex9 — « استعمل المعطيات في كل حالة »
  //
  // La même figure, quatre jeux de données, quatre inconnues différentes :
  // c'est l'exercice qui apprend à choisir SON rapport plutôt qu'à réciter
  // le premier. Le quatrième cas de la feuille demande AC en donnant BC, DE
  // et AB — trois données qui déterminent AD et non AC ; on garde ses
  // données et l'on demande ce qu'elles donnent.
  // ═══════════════════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════════════════
  // THALES 2008 ex6 — « OD/OE = ? »
  //
  // Deux parallèles emboîtées : (AD)//(BE) et (DB)//(EC). La feuille propose
  // quatre réponses — OB/OC, 4/5, OA/OB, 4/9 — dont trois sont justes ; ce
  // qu'elle veut faire voir, c'est que le MÊME rapport se lit à deux endroits
  // de la figure. On garde la figure et l'on pose les questions dans l'ordre
  // où l'élève doit les traverser.
  // ═══════════════════════════════════════════════════════════════════════

  item('Thales 2008 ex6 — OD/OE', 'relation-rapports', 'difficile', jolie(() => {
    // OA/OB = OB/OC : c'est la condition pour que les DEUX parallèles
    // coexistent sur la même figure. OC se déduit donc de OA et de OB.
    const a = F.ent(2, 8), b = a + F.ent(1, 6);
    const O = F.pt(0, 0), A = F.pt(a, 0), B = F.pt(b, 0);
    const C = F.pt(F.q(b * b, a), F.Q0);
    const [ex, ey] = F.choix([[3, 4], [5, 12], [8, 15], [7, 24], [20, 21]]);
    const m = F.ent(1, 3);
    const E = F.pt(F.q(ex * m), F.q(ey * m));
    const D = F.surDroite(O, E, F.q(a, b));
    const r = F.q(a, b);
    return {
      K: 1, points: { O, A, B, C, D, E },
      thales: [{ S: 'O', B: 'B', C: 'E', M: 'A', N: 'D' },
               { S: 'O', B: 'C', C: 'E', M: 'B', N: 'D' }],
      para: [[dr('A', 'D'), dr('B', 'E')], [dr('D', 'B'), dr('E', 'C')]],
      entre: [['O', 'A', 'B'], ['O', 'B', 'C'], ['O', 'D', 'E']],
      relations: [{ op: 'produit', rapports: [['O', 'D', 'O', 'E']], valeur: r,
                    longueurs: [seg('O', 'A'), seg('O', 'B')],
                    depuis: [[dr('A', 'D'), dr('B', 'E')]] },
                  { op: 'produit', rapports: [['O', 'B', 'O', 'C']], valeur: r,
                    longueurs: [seg('O', 'D'), seg('O', 'E')],
                    depuis: [[dr('D', 'B'), dr('E', 'C')]] }],
      donne: [seg('O', 'A'), seg('A', 'B'), seg('O', 'E')],
      buts: [{ but: ['lg2', seg('O', 'B'), null], question: 'أحسب OB.' },
             { but: ['relation', 'produit', 'O|D|O|E', r.n + '/' + r.d],
               question: 'أحسب النّسبة OD/OE.' },
             { but: ['lg2', seg('O', 'D'), null], question: 'استنتج OD.' },
             { but: ['relation', 'produit', 'O|B|O|C', r.n + '/' + r.d],
               question: 'بيّن أنّ OB/OC = OD/OE.' }],
      texte: g2 => ['النّقط O و A و B و C على استقامة واحدة، و D نقطة من [OE].',
                    '(AD) // (BE) و (DB) // (EC).',
                    'OA = ' + g2(seg('O', 'A')) + ' و AB = ' + g2(seg('A', 'B'))
                    + ' و OE = ' + g2(seg('O', 'E')) + '.'],
      figure: { segments: [['O', 'C'], ['O', 'E'], ['A', 'D'], ['B', 'E'],
                           ['D', 'B'], ['E', 'C']] },
      indice: 'طالس في المثلّث OBE يعطي OD/OE = OA/OB'
    };
  }));

  // ═══════════════════════════════════════════════════════════════════════
  // THALES0 2014 ex1 — SEPT QUESTIONS, ET PAS UNE DE MOINS
  //
  // « ABC مثلّث بحيث AB = 2 و AC = 3 و D نقطة من [AC] بحيث AD = 1 » — puis
  // sept questions qui s'appuient l'une sur l'autre :
  //
  //   1) I, projeté de C sur (BD) selon (AB) : بيّن أنّ DI/DB = DC/DA = IC/AB
  //   2) أحسب IC
  //   3) J, projeté de C sur (AB) selon (BD) : بيّن أنّ BJ = 4
  //   4) M = (IJ) ∩ (AC) : بيّن أنّ MJ/MI = MA/MC = AJ/IC
  //   5) بيّن أنّ MA/3 = MC/2
  //   6) استنتج MA و MC
  //   7) بيّن أنّ MC² = MA × MD
  //
  // On n'en gardait que deux. Le maître le dit depuis le premier jour :
  // couper un exercice à sa première question, ce n'est pas le raccourcir,
  // c'est le supprimer — ce qui reste tient en une application de Thalès, et
  // c'est pourquoi tout sortait « moyen ».
  //
  // La septième est une identité, et non un accident du tirage : avec A = 0,
  // C = c et D = d sur la droite, M = c²/(2c − d), d'où MC² = MA·MD quels que
  // soient c et d. Le validateur la recalcule sur les coordonnées à chaque
  // tirage, comme tout le reste.
  // ═══════════════════════════════════════════════════════════════════════

  item('THALES0 2014 ex1 — سبع مراحل', 'probleme', 'difficile', jolie(() => {
    const g = triangle();
    const A = g.A, B = g.B, C = g.C;
    const mu = rapport();
    const D = F.surDroite(A, C, mu);                 // D ∈ [AC]
    // I : sur (BD), tel que (IC) // (AB) — le projeté selon la direction (AB).
    const Ip = F.intersection(B, D, C, F.translate(C, A, B));
    // J : sur (AB), tel que (JC) // (BD).
    const J = F.intersection(A, B, C, F.translate(C, B, D));
    const Mp = F.intersection(Ip, J, A, C);
    if (!Ip || !J || !Mp) throw new Error('pose dégénérée');
    const P = F.plan(1);
    const rap = F.racQ(F.qDiv(P.carre(A, J), P.carre(Ip, C)));
    if (!rap) throw new Error('rapport irrationnel');
    return {
      K: 1, points: { A, B, C, D, I: Ip, J, M: Mp },
      thales: [{ S: 'D', B: 'B', C: 'A', M: 'I', N: 'C' },
               { S: 'A', B: 'B', C: 'D', M: 'J', N: 'C' },
               { S: 'M', B: 'I', C: 'C', M: 'J', N: 'A' }],
      // (AJ) et (AB) sont le même mستقيم — J est sur (AB) par construction ;
      // la figure le montre, et l'énoncé le dit.
      para: [[dr('I', 'C'), dr('A', 'B')], [dr('J', 'C'), dr('B', 'D')],
             [dr('A', 'J'), dr('C', 'I')]],
      entre: [['A', 'D', 'C'], ['A', 'B', 'J'], ['A', 'M', 'C'], ['A', 'D', 'M']],
      relations: [{ op: 'produit', rapports: [['M', 'A', 'M', 'C']], valeur: rap,
                    longueurs: [seg('A', 'J'), seg('I', 'C')],
                    depuis: [[dr('A', 'J'), dr('C', 'I')]] },
                  { op: 'produit',
                    rapports: [['M', 'C', 'M', 'A'], ['M', 'C', 'M', 'D']],
                    valeur: F.Q1,
                    longueurs: [seg('M', 'A'), seg('M', 'C'), seg('M', 'D')],
                    depuis: [[dr('A', 'J'), dr('C', 'I')]] }],
      donne: [seg('A', 'B'), seg('A', 'C'), seg('A', 'D')],
      buts: [
        { but: ['prop', 'DI|DB', 'DC|DA', 'IC|BA'],
          question: 'بيّن أنّ DI/DB = DC/DA = IC/BA.' },
        { but: ['lg2', seg('I', 'C'), null], question: 'أحسب IC.' },
        { but: ['lg2', seg('B', 'J'), null], question: 'أحسب BJ.' },
        { but: ['prop', 'MJ|MI', 'MA|MC', 'JA|IC'],
          question: 'بيّن أنّ MJ/MI = MA/MC = JA/IC.' },
        { but: ['relation', 'produit', 'M|A|M|C', rap.n + '/' + rap.d],
          question: 'بيّن أنّ النّسبة MA/MC تساوي AJ/IC.' },
        { but: ['lg2', seg('M', 'A'), null], question: 'استنتج MA.' },
        { but: ['lg2', seg('M', 'C'), null], question: 'استنتج MC.' },
        { but: ['relation', 'produit', 'M|C|M|A;M|C|M|D', '1/1'],
          question: 'بيّن أنّ MC² = MA × MD.' }
      ],
      texte: g2 => ['ABC مثلّث حيث AB = ' + g2(seg('A', 'B')) + ' و AC = '
                    + g2(seg('A', 'C')) + '، و D نقطة من [AC] بحيث AD = '
                    + g2(seg('A', 'D')) + '.',
                    'I هي مسقط C على (BD) وفقا لمنحى (AB)، و J هي مسقط C على (AB) وفقا لمنحى (BD).',
                    'M هي نقطة تقاطع (IJ) و (AC).'],
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['B', 'D'],
                           ['I', 'C'], ['J', 'C'], ['I', 'J']],
                droites: [['B', 'D'], ['A', 'J']] },
      indice: 'ثلاث وضعيات لطالس : في المثلّث DBA، ثمّ في ABD، ثمّ الفراشة في M'
    };
  }));

  // ═══════════════════════════════════════════════════════════════════════
  // UNE MÊME FIGURE, TOUT LE CHAPITRE — Pythagore (3) مسألة, TRIANGLES9_23
  //
  // Le maître le dit : le triangle rectangle — Pythagore, sa réciproque, le
  // cercle et son diamètre — et le centre de gravité — les médianes, les deux
  // tiers — SONT des exercices de Thalès. Ils ne sont pas un autre chapitre
  // qu'on visiterait à côté : ce sont ses conséquences, et ses feuilles les
  // posent sur la même figure.
  //
  // C'est ce qui manquait pour qu'un exercice de Thalès soit difficile. Une
  // application de Thalès, même répétée sept fois, ne fait choisir qu'une
  // fois ; ici il faut choisir à chaque pas — Pythagore, puis le cercle
  // circonscrit, puis les rayons, puis les milieux, puis les deux tiers.
  // ═══════════════════════════════════════════════════════════════════════

  item('Pythagore (3) مسألة — الشكل الواحد', 'probleme', 'difficile', () => {
    const [x, y] = F.choix(TRIPLETS);
    const k = F.ent(1, 3);
    const A = F.pt(0, 0), B = F.pt(x * k, 0), C = F.pt(F.Q0, F.q(y * k));
    const Ip = F.milieu(B, C), Mp = F.milieu(A, B), J = F.milieu(A, C);
    const G = F.plan(1).centreGravite(A, B, C);
    return {
      K: 1, points: { A, B, C, I: Ip, M: Mp, J, G },
      rects: [['B', 'A', 'C']],
      milieux: [['I', 'B', 'C'], ['M', 'A', 'B'], ['J', 'A', 'C']],
      gravites: [{ G: 'G', tri: 'ABC', I: 'I', J: 'J' }],
      // Deux configurations de Thalès sur la même figure : la droite des
      // milieux [MJ] parallèle à (BC), et [MI] parallèle à (AC).
      thales: [{ S: 'A', B: 'B', C: 'C', M: 'M', N: 'J' },
               { S: 'B', B: 'A', C: 'C', M: 'M', N: 'I' }],
      entre: [['A', 'G', 'I']],
      donne: [seg('A', 'B'), seg('A', 'C')],
      buts: [
        { but: ['lg2', seg('B', 'C'), null], question: 'أحسب BC.' },
        { but: ['cercle', 'I', 'ABC'],
          question: 'بيّن أنّ النّقط A و B و C تنتمي إلى دائرة مركزها I.' },
        { but: ['lg2', seg('I', 'A'), null], question: 'استنتج IA.' },
        { but: ['para', dr('M', 'I'), dr('A', 'C')],
          question: 'بيّن أنّ (MI) // (AC).' },
        { but: ['lg2', seg('M', 'I'), null], question: 'أحسب MI.' },
        { but: ['lg2', seg('A', 'G'), null], question: 'أحسب AG.' },
        { but: ['lg2', seg('G', 'I'), null], question: 'استنتج GI.' }
      ],
      texte: g2 => ['ABC مثلّث قائم الزاوية في A حيث AB = ' + g2(seg('A', 'B'))
                    + ' و AC = ' + g2(seg('A', 'C')) + '.',
                    'I منتصف [BC] و M منتصف [AB] و J منتصف [AC].',
                    'G هي نقطة تقاطع (AI) و (BJ).'],
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['A', 'I'],
                           ['B', 'J'], ['M', 'I'], ['M', 'J']],
                angles: [['B', 'A', 'C']],
                marques: [['B', 'I', 1], ['I', 'C', 1], ['A', 'M', 2], ['M', 'B', 2]] },
      indice: 'بيتاغور، ثمّ الدائرة المحيطة، ثمّ المنتصفان، ثمّ مركز الثقل'
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // LE TRIANGLE RECTANGLE PAR LE CERCLE — et non par Pythagore
  //
  // « [AB] قطر للدائرة (C) و M نقطة من (C) إذن المثلّث AMB قائم الزاوية في M ».
  // C'est cela, le triangle rectangle du chapitre de Thalès : l'angle droit
  // vient du DIAMÈTRE, pas d'un calcul de carrés. La réciproque suit — le
  // milieu de l'hypoténuse est à égale distance des trois sommets —, et de là
  // les médianes et les deux tiers.
  //
  // La règle « كلّ مثلّث يقبل الارتسام في دائرة أحد أضلاعه قطر لها فهو مثلّث
  // قائم » était au catalogue depuis le premier jour et n'avait jamais servi :
  // aucun énoncé ne lui donnait de cercle. Une règle que rien n'appelle est
  // une règle qui n'existe pas.
  //
  // AUCUN PYTHAGORE ICI, et aucune relation métrique : tout se lit sur le
  // cercle, sur les milieux et sur le centre de gravité.
  // ═══════════════════════════════════════════════════════════════════════

  item('TRIANGLES9_23 — القطر و الزاوية القائمة', 'probleme', 'difficile', () => {
    // M sur le cercle de diamètre [AB] : on le pose par un triplet, ce qui
    // rend AM et BM rationnels sans jamais les calculer par Pythagore.
    const [a, b, c] = F.choix(TRIPLETS);
    const k = F.q(F.ent(2, 6));
    const A = F.pt(0, 0), B = F.pt(F.qMul(F.q(c), k), F.Q0);
    const Mp = F.pt(F.qMul(F.q(a * a, c), k), F.qMul(F.q(a * b, c), k));
    const O = F.milieu(A, B), Ip = F.milieu(A, Mp);
    const G = F.plan(1).centreGravite(A, B, Mp);
    return {
      K: 1, points: { A, B, M: Mp, O, I: Ip, G },
      cercles: [['O', 'ABM']],
      diametres: [{ O: 'O', A: 'A', C: 'B', sur: ['M'] }],
      milieux: [['O', 'A', 'B'], ['I', 'A', 'M']],
      // La droite des milieux : O milieu de [AB], I milieu de [AM].
      thales: [{ S: 'A', B: 'B', C: 'M', M: 'O', N: 'I' }],
      gravites: [{ G: 'G', tri: 'ABM', I: 'O', J: 'I' }],
      entre: [['M', 'G', 'O']],
      donne: [seg('A', 'B'), seg('B', 'M')],
      buts: [
        { but: ['rect', 'A', 'M', 'B'],
          question: 'بيّن أنّ المثلّث AMB قائم الزاوية في M.' },
        { but: ['lg2', seg('O', 'M'), null], question: 'أحسب OM.' },
        { but: ['para', dr('O', 'I'), dr('B', 'M')],
          question: 'بيّن أنّ (OI) // (BM).' },
        { but: ['lg2', seg('O', 'I'), null], question: 'أحسب OI.' },
        { but: ['lg2', seg('M', 'G'), null], question: 'أحسب MG.' },
        { but: ['lg2', seg('G', 'O'), null], question: 'استنتج GO.' }
      ],
      texte: g2 => ['(C) دائرة قطرها [AB] و مركزها O، و M نقطة من (C).',
                    'AB = ' + g2(seg('A', 'B')) + ' و BM = ' + g2(seg('B', 'M')) + '.',
                    'I منتصف [AM]، و G هي نقطة تقاطع (MO) و (BI).'],
      figure: { segments: [['A', 'B'], ['B', 'M'], ['M', 'A'], ['O', 'I'],
                           ['M', 'O'], ['B', 'I']],
                marques: [['A', 'O', 1], ['O', 'B', 1], ['A', 'I', 2], ['I', 'M', 2]] },
      indice: 'الزاوية القائمة تأتي من القطر، ثمّ مبرهنة المنتصفين، ثمّ مركز الثقل'
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // THALES0 2014 ex4 — LA CASCADE QUI REVIENT À SON POINT DE DÉPART
  //
  // « AB = 5 و AD = 2 » : deux longueurs, et huit questions. On mène la
  // parallèle à (BC) par D, puis celle à (AB) par le point obtenu, puis celle
  // à (AC), et ainsi de suite — six parallèles, et la sixième ramène en D.
  //
  //   1) (DE)//(BC)  : بيّن أنّ AE/AC = AD/AB
  //   2) (EF)//(AB)  : بيّن أنّ AE/AC = BF/BC ثمّ استنتج AD/AB = BF/BC
  //   3) (FG)//(AC)  : بيّن أنّ BG/BA = BF/BC
  //   4) استنتج BG
  //   5) (GH)//(BC)  : بيّن أنّ CH/CA = AD/AB
  //   6) استنتج AE = CH
  //   7) (HI)//(AB)  : بيّن أنّ CI = BF
  //   8) (IJ)//(AC)  : بيّن أنّ AJ = AD، أي أنّ J هي D
  //
  // LA HUITIÈME N'Y EST PAS, et je le dis plutôt que de la maquiller : elle
  // affirme que DEUX POINTS SONT CONFONDUS, et le moteur n'a pas de fait pour
  // cela — il sait dire que deux longueurs sont égales, non que J est D. La
  // poser en ajoutant un point J superposé à D donnerait une figure où deux
  // lettres se chevauchent. Elle attend un fait « نقطتان متطابقتان ».
  //
  // AC et BC ne sont JAMAIS donnés, et ne le seront pas : tout se joue sur
  // les rapports. C'est pour cela que l'exercice attendait l'algèbre des
  // rapports — sans elle, le moteur ne pouvait répondre qu'à la première
  // question, et l'on aurait cru l'exercice court.
  // ═══════════════════════════════════════════════════════════════════════

  item('THALES0 2014 ex4 — ثماني مراحل', 'probleme', 'difficile', () => {
    // Des entiers : le maître écrit AB = 5 et AD = 2, et l'échelle ordinaire
    // des figures donnait « AB = 0,8 » — exact, et sans rapport avec sa page.
    const g = triangle(1);
    const A = g.A, B = g.B, C = g.C;
    const t = rapport();                                   // AD/AB
    const un = F.qSub(F.Q1, t);
    const D = F.surDroite(A, B, t);
    const E = F.surDroite(A, C, t);                         // (DE)//(BC)
    const Fp = F.surDroite(C, B, un);                       // (EF)//(AB)
    const G = F.surDroite(B, A, t);                         // (FG)//(AC)
    const H = F.surDroite(C, A, t);                         // (GH)//(BC)
    const Ip = F.surDroite(C, B, t);                        // (HI)//(AB)
    const J = F.surDroite(A, B, t);                         // (IJ)//(AC) : J = D
    return {
      K: 1, points: { A, B, C, D, E, F: Fp, G, H, I: Ip },
      thales: [{ S: 'A', B: 'B', C: 'C', M: 'D', N: 'E' },
               { S: 'C', B: 'A', C: 'B', M: 'E', N: 'F' },
               { S: 'B', B: 'A', C: 'C', M: 'G', N: 'F' },
               { S: 'A', B: 'B', C: 'C', M: 'G', N: 'H' },
               { S: 'C', B: 'A', C: 'B', M: 'H', N: 'I' }],
      para: [[dr('D', 'E'), dr('B', 'C')], [dr('E', 'F'), dr('A', 'B')],
             [dr('F', 'G'), dr('A', 'C')], [dr('G', 'H'), dr('B', 'C')],
             [dr('H', 'I'), dr('A', 'B')]],
      entre: [['A', 'D', 'B'], ['A', 'E', 'C'], ['B', 'F', 'C'], ['A', 'G', 'B'],
              ['A', 'H', 'C'], ['B', 'I', 'C']],
      donne: [seg('A', 'B'), seg('A', 'D')],
      buts: [
        { but: ['prop', 'AD|AB', 'AE|AC', 'DE|BC'],
          question: 'بيّن أنّ AD/AB = AE/AC = DE/BC.' },
        { but: ['rapport', 'BF|BC', t.n + '/' + t.d],
          question: 'بيّن أنّ BF/BC = AD/AB.' },
        { but: ['rapport', 'BG|BA', t.n + '/' + t.d],
          question: 'بيّن أنّ BG/BA = BF/BC.' },
        { but: ['lg2', seg('B', 'G'), null], question: 'استنتج BG.' },
        { but: ['rapport', 'CH|CA', t.n + '/' + t.d],
          question: 'بيّن أنّ CH/CA = AD/AB.' },
        { but: ['rapport', 'AE|CH', '1/1'], question: 'استنتج أنّ AE = CH.' },
        { but: ['rapport', 'CI|BF', '1/1'], question: 'بيّن أنّ CI = BF.' }
      ],
      texte: g2 => ['ABC مثلّث حيث AB = ' + g2(seg('A', 'B')) + ' و D نقطة من [AB] بحيث AD = '
                    + g2(seg('A', 'D')) + '.',
                    'الموازي لـ (BC) المارّ من D يقطع (AC) في E،',
                    'و الموازي لـ (AB) المارّ من E يقطع (BC) في F،',
                    'و الموازي لـ (AC) المارّ من F يقطع (AB) في G،',
                    'و الموازي لـ (BC) المارّ من G يقطع (AC) في H،',
                    'و الموازي لـ (AB) المارّ من H يقطع (BC) في I.'],
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['D', 'E'],
                           ['E', 'F'], ['F', 'G'], ['G', 'H'], ['H', 'I']] },
      indice: 'لا تحسب الأطوال : اشتغل على النّسب، و انتقل من واحدة إلى أخرى'
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // SÉRIE THALÈS 9B 2018 ex1 — LE TRIANGLE ISOCÈLE, LE SYMÉTRIQUE, LES QUARTS
  //
  // « ABC مثلّث متقايس الضّلعين قمته A حيث AB = 6، I منتصف [BC]. المستقيم
  // المارّ من I و الموازي لـ (AC) يقطع [AB] في J. » Puis :
  //
  //   1) J est le milieu de [AB] ; en déduire IJ = 3
  //   2) D symétrique de I par rapport à C, K = (AC) ∩ (DJ) :
  //      K milieu de [DJ] ; CK = AC/4 ; en déduire AK/AC = 3/4
  //
  // Tout y est réciproque : on ne calcule pas J, on démontre que c'en est le
  // milieu — puis on s'en sert. Deux fois de suite, dans deux triangles
  // différents, et la seconde fois le triangle n'existe qu'après la symétrie.
  //
  // SA TROISIÈME QUESTION N'Y EST PAS : « MK = 3/8 BC », où M est sur (AD) et
  // (MK)//(BD). Le calcul est juste — je l'ai refait — mais la configuration
  // de Thalès qui le porte a pour troisième côté la droite (BD), et son
  // sommet est le point où (BD) coupe (AC). Ce point, le maître ne le nomme
  // pas ; l'ajouter serait ajouter à sa figure, et je ne le fais pas sans
  // qu'il le dise.
  // ═══════════════════════════════════════════════════════════════════════

  item('Série Thalès 9B 2018 ex1', 'probleme', 'difficile', () => {
    // Isocèle en A : AB = AC. Un couple pythagoricien rend les deux côtés
    // rationnels en même temps que la base.
    const [w, h] = F.choix([[3, 4], [4, 3], [6, 8], [5, 12], [8, 15], [12, 5]]);
    const k = F.ent(1, 3);
    const A = F.pt(0, h * k), B = F.pt(-w * k, 0), C = F.pt(w * k, 0);
    const Ip = F.milieu(B, C), J = F.milieu(A, B);
    const D = F.symetriqueCentre(Ip, C);
    const K = F.intersection(A, C, D, J);
    if (!K) throw new Error('pose dégénérée');
    return {
      K: 1, points: { A, B, C, I: Ip, J, D, K },
      // Ce que l'énoncé donne : le milieu I, la symétrie, les parallèles.
      // J et K ne sont PAS donnés milieux — c'est ce qu'il faut démontrer.
      milieux: [['I', 'B', 'C'], ['C', 'I', 'D']],
      para: [[dr('I', 'J'), dr('A', 'C')], [dr('C', 'K'), dr('I', 'J')]],
      // LE MILIEU CONNU EST I, PAS J. La configuration se lit dans ce sens :
      // I est sur [BC], J est celui qu'on cherche sur [BA] — l'écrire à
      // l'envers, c'est demander au moteur de partir de la conclusion.
      thales: [{ S: 'B', B: 'C', C: 'A', M: 'I', N: 'J' },
               { S: 'D', B: 'I', C: 'J', M: 'C', N: 'K' }],
      entre: [['A', 'K', 'C']],
      rapports: ['AK|AC'],
      donne: [seg('A', 'B'), seg('A', 'C')],
      buts: [
        { but: ['milieu', 'J', 'A', 'B'], question: 'بيّن أنّ J هي منتصف [AB].' },
        { but: ['lg2', seg('I', 'J'), null], question: 'استنتج IJ.' },
        { but: ['milieu', 'K', 'D', 'J'], question: 'بيّن أنّ K هي منتصف [DJ].' },
        { but: ['lg2', seg('C', 'K'), null], question: 'بيّن أنّ CK = AC/4.' },
        { but: ['lg2', seg('A', 'K'), null], question: 'أحسب AK.' },
        { but: ['rapport', 'AK|AC', '3/4'], question: 'استنتج أنّ AK/AC = 3/4.' }
      ],
      texte: g => ['ABC مثلّث متقايس الضّلعين قمته A حيث AB = ' + g(seg('A', 'B'))
                   + ' و AC = ' + g(seg('A', 'C')) + '، و I منتصف [BC].',
                   'المستقيم المارّ من I و الموازي لـ (AC) يقطع [AB] في J.',
                   'D هي نظيرة I بالنسبة إلى C، و K نقطة تقاطع (AC) و (DJ).'],
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['I', 'J'],
                           ['D', 'J'], ['C', 'D']],
                marques: [['B', 'I', 1], ['I', 'C', 1], ['I', 'C', 2], ['C', 'D', 2]] },
      indice: 'مبرهنة المنتصفين مرّتين : في المثلّث ABC، ثمّ في المثلّث DIJ'
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // SÉRIE THALÈS 9B 2018 ex2 — LE LOSANGE, ET TROIS MILIEUX SANS UNE MESURE
  //
  // « نعتبر مُعيّنا ABCD قيس طول ضلعه 6، M منتصف [CD] و N من [AD] حيث DN = 2 »
  //
  //   1) E = (AB) ∩ (MN) : NE/NM = AE/DM = 2، puis A milieu de [BE]
  //   2) F = (MN) ∩ (BC) : N milieu de [EF] ; BF ; M milieu de [NF]
  //
  // C'EST UN LOSANGE, PAS UN CARRÉ, et cela change tout pour le moteur : dans
  // un losange, NM n'a pas de valeur exacte — elle dépend de l'angle, que
  // l'énoncé ne donne pas. NE, NM, NF sont donc irrationnels, et le maître ne
  // les demande jamais : il demande des MILIEUX, c'est-à-dire des rapports.
  //
  // D'où les deux règles qu'il a fallu poser : composer deux rapports
  // (NE/NM × NM/NF = NE/NF) et conclure un milieu d'un rapport égal à 1. On
  // démontre ainsi que N est le milieu de [EF] sans avoir mesuré quoi que ce
  // soit — ce qui est exactement la leçon de l'exercice.
  // ═══════════════════════════════════════════════════════════════════════

  item('Série Thalès 9B 2018 ex2', 'probleme', 'difficile', () => {
    // Un losange : quatre côtés égaux, les côtés opposés parallèles. On le
    // pose par une diagonale et un demi-axe, ce qui garde le côté rationnel.
    // LES DONNÉES DU MAÎTRE NE SONT PAS ARBITRAIRES. « A milieu de [BE] » ne
    // tient que si DN vaut LE TIERS du côté : AE = DM × NA/ND = (côté/2) ×
    // (1 − t)/t, et cela ne fait le côté que pour t = 1/3. Il écrit DN = 2
    // dans un losange de côté 6 ; un tirage libre cassait sa question, et
    // c'est la chaîne qui l'a dit en refusant de conclure.
    const [u, v] = F.choix([[3, 4], [4, 3]]);
    const k = 3 * F.ent(1, 2);                  // le côté 5k reste multiple de 3
    const A = F.pt(0, 0), B = F.pt(F.q(5 * k), F.Q0);
    const D = F.pt(F.q(u * k), F.q(v * k));
    const C = F.pt(F.q(u * k + 5 * k), F.q(v * k));
    const Mp = F.milieu(C, D);
    const t = F.q(1, 3);                        // DN = côté/3
    const N = F.surDroite(D, A, t);
    const E = F.intersection(A, B, Mp, N);
    const Fp = F.intersection(B, C, Mp, N);
    if (!E || !Fp) throw new Error('pose dégénérée');
    return {
      K: 1, points: { A, B, C, D, M: Mp, N, E, F: Fp },
      // Le losange donne les deux parallélismes ; le reste se démontre.
      para: [[dr('A', 'B'), dr('D', 'C')], [dr('A', 'D'), dr('B', 'C')],
             [dr('A', 'E'), dr('D', 'M')], [dr('C', 'F'), dr('D', 'N')]],
      thales: [{ S: 'N', B: 'D', C: 'M', M: 'A', N: 'E' },
               { S: 'M', B: 'D', C: 'N', M: 'C', N: 'F' }],
      milieux: [['M', 'C', 'D']],
      // C EST ENTRE B ET F, ET NON L'INVERSE : la droite (MN) coupe (BC)
      // AU-DELÀ de C, si bien que BF = BC + CF. Déclaré à l'envers, le
      // validateur a répondu « BF vaut 20 et non 10 » — c'est la troisième
      // fois qu'un « entre » lu de travers se fait prendre, toujours de la
      // même façon : par le dessin, jamais par le texte.
      entre: [['A', 'D', 'N'], ['B', 'A', 'E'], ['E', 'N', 'F'], ['N', 'M', 'F'],
              ['B', 'C', 'F']],
      donne: [seg('A', 'B'), seg('A', 'D'), seg('B', 'C'), seg('C', 'D'),
              seg('D', 'N'), seg('A', 'N')],
      buts: [
        { but: ['prop', 'NA|ND', 'NE|NM', 'AE|DM'],
          question: 'بيّن أنّ NA/ND = NE/NM = AE/DM.' },
        { but: ['lg2', seg('A', 'E'), null], question: 'أحسب AE.' },
        { but: ['milieu', 'A', 'B', 'E'], question: 'استنتج أنّ A هي منتصف [BE].' },
        { but: ['lg2', seg('C', 'F'), null], question: 'أحسب CF.' },
        { but: ['lg2', seg('B', 'F'), null], question: 'استنتج البعد BF.' },
        // Le fait se nomme avec le segment dans l'ordre alphabétique — [FN] —
        // sinon le but ne rejoint jamais la conclusion, alors que les deux
        // disent la même chose.
        { but: ['milieu', 'M', 'F', 'N'], question: 'بيّن أنّ M هي منتصف [NF].' },
        { but: ['milieu', 'N', 'E', 'F'], question: 'بيّن أنّ N هي منتصف [EF].' }
      ],
      texte: g => ['ABCD مُعيّن قيس طول ضلعه ' + g(seg('A', 'B')) + '.',
                   'M منتصف [CD]، و N نقطة من [AD] حيث DN = ' + g(seg('D', 'N')) + '.',
                   'E نقطة تقاطع (AB) و (MN)، و F نقطة تقاطع (BC) و (MN).'],
      figure: { segments: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'],
                           ['E', 'F'], ['A', 'E'], ['B', 'F']],
                marques: [['C', 'M', 1], ['M', 'D', 1]] },
      indice: 'المعيّن يعطي التوازيين ؛ و لا تحسب NM : اشتغل على النّسب'
    };
  });

  const CAS9 = [
    { nom: '1', donne: [['A', 'B'], ['A', 'D'], ['A', 'E']], but: ['A', 'C'] },
    { nom: '2', donne: [['A', 'B'], ['A', 'D'], ['B', 'C']], but: ['D', 'E'] },
    { nom: '3', donne: [['A', 'C'], ['D', 'E'], ['B', 'C']], but: ['A', 'E'] },
    { nom: '4', donne: [['B', 'C'], ['D', 'E'], ['A', 'B']], but: ['A', 'D'] }
  ];
  for (const cas of CAS9) {
    item('Thales 2008 ex9-' + cas.nom, 'thales-cas', 'facile', jolie(() => {
      const g = triangle();
      const A = g.A, B = g.B, C = g.C;
      const t = rapport();
      const D = F.surDroite(A, B, t), E = F.surDroite(A, C, t);
      const noms = cas.donne.map(x => x.join(''));
      return {
        K: 1, points: { A, B, C, D, E },
        thales: [{ S: 'A', B: 'B', C: 'C', M: 'D', N: 'E' }],
        para: [[dr('D', 'E'), dr('B', 'C')]],
        entre: [['A', 'D', 'B'], ['A', 'E', 'C']],
        donne: cas.donne.map(x => seg(x[0], x[1])),
        but: ['lg2', seg(cas.but[0], cas.but[1]), null],
        texte: g2 => ['ABC مثلّث، D نقطة من [AB] و E نقطة من [AC] حيث (DE) // (BC).',
                      noms.map((n, i) => n + ' = '
                        + g2(seg(cas.donne[i][0], cas.donne[i][1]))).join(' و ') + '.'],
        question: 'أحسب ' + cas.but.join('') + '.',
        figure: { segments: [['A', 'B'], ['A', 'C'], ['B', 'C'], ['D', 'E']] },
        indice: 'اختر النّسبتين اللّتين تجمعان المعطيات و المطلوب'
      };
    }));
  }

  const API = { ITEMS, TRIPLETS };
  if (M) module.exports = API; else racine.Items = API;
})(typeof window !== 'undefined' ? window : globalThis);
