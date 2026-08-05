// LE CATALOGUE DES ÉNONCÉS — transcrits des feuilles, et d'elles seules.
//
// Règle absolue, la même que pour les puissances : les questions viennent des
// feuilles du maître, pas d'un tirage. Ce qui est engendré, c'est le
// RAISONNEMENT — la suite des règles qui mène des données au but —, parce
// qu'il n'est pas sur la feuille et qu'il doit être recalculé pour être sûr.
//
// CE QUI VARIE, CE SONT LES NOMBRES ET LA POSE. La feuille dit « AB = 3 » ;
// le générateur tire 3, ou 4, ou 6, et incline la figure. C'est le même
// exercice pour le maître et un exercice neuf pour l'élève — et la figure,
// née des mêmes points, suit sans qu'on ait à la redessiner.
//
// CE QUI NE VARIE PAS, C'EST LA QUESTION. « Montre que (D) // (D') » reste
// « montre que (D) // (D') ».
//
//   src     la feuille et l'exercice d'où l'item vient
//   f       la famille — la règle du programme qu'il met en jeu
//   d       la difficulté, lue sur l'item et non décrétée
//   monter  la scène : les points, les droites nommées, les données, le but
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Droites;

  const ITEMS = [];
  const item = (src, f, d, monter) => ITEMS.push({ src, f, n: 7, d, monter });

  // LA POSE. Toutes les figures d'une feuille dessinées à l'horizontale se
  // ressemblent, et l'élève finit par reconnaître le dessin au lieu de lire
  // l'énoncé. On incline donc le repère — par des rotations EXACTES, tirées
  // des triplets pythagoriciens, pour que les coordonnées restent rationnelles
  // et les longueurs entières.
  const POSES = [[1, 0], [4, 3], [3, 4], [-3, 4], [4, -3], [-4, 3], [5, 12], [12, 5]];
  // Une demie reste exacte en rationnels : « ab/2 » n'a pas besoin qu'on
  // double tout le reste pour rester un nombre.
  // UN QUART N'EST PAS UNE DEMIE. La conversion n'acceptait que les entiers et
  // les moitiés, et arrondissait le reste en silence : 3,75 devenait 3,5, et le
  // point censé être sur (UT) tombait à côté. Les coordonnées qui ne sont ni
  // l'un ni l'autre se passent donc en RATIONNEL, exactement.
  const nb = x => {
    if (x && typeof x === 'object') return x;              // déjà un rationnel
    if (Number.isInteger(x)) return F.q(x);
    if (Number.isInteger(x * 2)) return F.q(x * 2, 2);
    throw new Error('coordonnée inexacte: ' + x);
  };
  function repere() {
    const [a, b] = F.choix(POSES);
    const h = Math.hypot(a, b);
    // (u, v) est une base orthonormée à coordonnées rationnelles
    const u = F.pt(F.q(a, Math.round(h)), F.q(b, Math.round(h)));
    const v = F.pt(F.qNeg(u.y), u.x);
    // LES LONGUEURS SONT CELLES DE L'ÉNONCÉ, au facteur près — c'est-à-dire
    // sans facteur du tout. Un repère qui doublerait les coordonnées donnerait
    // une figure où AB vaut 18 alors que le texte annonce 9, et le calcul de
    // distance trahirait aussitôt le mensonge. La rotation, elle, conserve les
    // longueurs : c'est tout ce qu'on lui demande.
    return (x, y) => F.pt(
      F.qAdd(F.qMul(nb(x), u.x), F.qMul(nb(y), v.x)),
      F.qAdd(F.qMul(nb(x), u.y), F.qMul(nb(y), v.y)));
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 7ème — « المستقيمات المتوازية و المستقيمات المتعامدة » (droite PC 2)
  // فوزي الغربي، المدرسة الإعدادية النموذجية ضفاف البحيرة
  // ═══════════════════════════════════════════════════════════════════════

  // Exercice 1-b — deux perpendiculaires à une même droite
  item('droite PC 2 ex1', 'perp-perp-para', 'facile', () => {
    const P = repere();
    const ab = F.ent(3, 6);
    const pts = { A: P(0, 0), B: P(ab, 0), E: P(0, 2), G: P(ab, 2) };
    return {
      pts,
      lignes: [{ nom: '(Δ)', A: 'A', B: 'B' },
               { nom: '(D)', A: 'A', B: 'E' },
               { nom: "(D')", A: 'B', B: 'G' }],
      hyp: [['perp', '(D)', '(Δ)'], ['perp', "(D')", '(Δ)']],
      but: ['para', '(D)', "(D')"],
      donnees: ['(D) و (Δ) مستقيمان متعامدان في النقطة A.',
                'B نقطة من (Δ) حيث AB = ' + ab + ' صم.',
                "(D') هو المستقيم المارّ من B و العمودي على (Δ)."],
      longueurs: [['A', 'B', ab]],
      fig: { droites: [['A', 'B'], ['A', 'E'], ['B', 'G']],
             angles: [['B', 'A', 'E'], ['A', 'B', 'G']], caches: ['E', 'G'] }
    };
  });

  // Exercice 1-c — la médiatrice s'invite : elle est perpendiculaire à (AB),
  // et (AB) n'est autre que (Δ)
  item('droite PC 2 ex1', 'mediatrice-para', 'moyen', () => {
    const P = repere();
    const ab = 2 * F.ent(2, 4);
    const pts = { A: P(0, 0), B: P(ab, 0), E: P(0, 2), I: P(ab / 2, 0), J: P(ab / 2, 2) };
    return {
      pts,
      lignes: [{ nom: '(Δ)', A: 'A', B: 'B' },
               { nom: '(AB)', A: 'A', B: 'B' },
               { nom: '(D)', A: 'A', B: 'E' },
               { nom: '(D")', A: 'I', B: 'J' }],
      segments: [{ nom: '[AB]', A: 'A', B: 'B', milieu: 'I' }],
      hyp: [['perp', '(D)', '(Δ)'], ['med', '(D")', '[AB]']],
      but: ['para', '(D")', '(D)'],
      donnees: ['(D) و (Δ) مستقيمان متعامدان في النقطة A.',
                'B نقطة من (Δ) حيث AB = ' + ab + ' صم.',
                '(D") هو الموسط العمودي للقطعة [AB]، و I منتصفها.'],
      longueurs: [['A', 'B', ab], ['A', 'I', ab / 2]],
      fig: { droites: [['A', 'B'], ['A', 'E'], ['I', 'J']],
             angles: [['B', 'A', 'E'], ['A', 'I', 'J']],
             marques: [['A', 'I'], ['I', 'B']], caches: ['E', 'J'] }
    };
  });

  // Exercice 2 — le triangle rectangle, et deux perpendiculaires successives
  item('droite PC 2 ex2', 'perp-perp-para', 'moyen', () => {
    const P = repere();
    const bt = F.ent(3, 5), bu = F.ent(5, 8), ua = F.ent(2, bu - 2);
    const pts = { B: P(0, 0), T: P(bt, 0), U: P(0, bu),
                  A: P(0, bu - ua), I: P(bt, bu - ua) };
    return {
      pts,
      lignes: [{ nom: '(BU)', A: 'B', B: 'U' },
               { nom: '(BT)', A: 'B', B: 'T' },
               { nom: '(IA)', A: 'A', B: 'I' }],
      hyp: [['perp', '(BT)', '(BU)'], ['perp', '(IA)', '(BU)']],
      but: ['para', '(IA)', '(BT)'],
      donnees: ['BUT مثلّث قائم الزاوية في B حيث BT = ' + bt + ' و BU = ' + bu + '.',
                'A نقطة من القطعة [BU] حيث UA = ' + ua + '.',
                'المستقيم العمودي على (BU) و المارّ من A يقطع (UT) في النقطة I.'],
      longueurs: [['B', 'T', bt], ['B', 'U', bu], ['U', 'A', ua]],
      fig: { segments: [['B', 'T'], ['B', 'U'], ['U', 'T']],
             droites: [['A', 'I']],
             angles: [['T', 'B', 'U'], ['B', 'A', 'I']] }
    };
  });

  // Exercice 3 — perpendiculaire à l'un de deux parallèles
  item('droite PC 2 ex3', 'perp-para-perp', 'moyen', () => {
    const P = repere();
    const ab = F.ent(3, 5), ac = F.ent(3, 6);
    const pts = { A: P(0, 0), B: P(0, ab), C: P(ac, 0),
                  D: P(ac, 3), E: P(2, ab) };
    return {
      pts,
      lignes: [{ nom: '(AB)', A: 'A', B: 'B' },
               { nom: '(AC)', A: 'A', B: 'C' },
               { nom: '(Δ)', A: 'C', B: 'D' },
               { nom: "(Δ')", A: 'B', B: 'E' }],
      hyp: [['perp', '(Δ)', '(AC)'], ['para', "(Δ')", '(AC)']],
      but: ['perp', '(Δ)', "(Δ')"],
      donnees: ['ABC مثلّث قائم الزاوية في A حيث AB = ' + ab + ' و AC = ' + ac + '.',
                '(Δ) هو المستقيم المارّ من C و العمودي على (AC).',
                "(Δ') هو المستقيم المارّ من B و الموازي لـ (AC)."],
      longueurs: [['A', 'B', ab], ['A', 'C', ac]],
      fig: { segments: [['A', 'B'], ['A', 'C'], ['B', 'C']],
             droites: [['C', 'D'], ['B', 'E']],
             angles: [['B', 'A', 'C'], ['A', 'C', 'D']], caches: ['D', 'E'] }
    };
  });

  // Exercice 4 — deux médiatrices d'une même droite
  item('droite PC 2 ex4', 'mediatrice-para', 'difficile', () => {
    const P = repere();
    const ab = 2 * F.ent(3, 5), ad = 2 * F.ent(2, 3);
    const pts = { A: P(0, 0), B: P(ab, 0), C: P(ab, ad), D: P(0, ad),
                  I: P(ab / 2, 0), J: P(ab / 2, ad), K: P(0, ad / 2), L: P(ab, ad / 2) };
    return {
      pts,
      lignes: [{ nom: '(AB)', A: 'A', B: 'B' },
               { nom: '(BF)', A: 'I', B: 'J' },
               { nom: '(DG)', A: 'K', B: 'L' },
               { nom: '(AD)', A: 'A', B: 'D' }],
      segments: [{ nom: '[AB]', A: 'A', B: 'B', milieu: 'I' },
                 { nom: '[AD]', A: 'A', B: 'D', milieu: 'K' }],
      hyp: [['med', '(BF)', '[AB]'], ['perp', '(AD)', '(AB)'],
            ['para', '(DG)', '(AB)']],
      but: ['perp', '(BF)', '(DG)'],
      donnees: ['ABCD مستطيل حيث AB = ' + ab + ' و AD = ' + ad + '.',
                '(BF) هو الموسط العمودي للقطعة [AB]، و I منتصفها.',
                '(DG) مستقيم موازٍ لـ (AB).'],
      longueurs: [['A', 'B', ab], ['A', 'D', ad]],
      fig: { segments: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']],
             droites: [['I', 'J'], ['K', 'L']],
             angles: [['B', 'A', 'D'], ['A', 'I', 'J']],
             marques: [['A', 'I'], ['I', 'B']], caches: ['J', 'L'] }
    };
  });

  // Exercice 5 — reconnaître une médiatrice : perpendiculaire ET par le milieu
  item('droite PC 2 ex5', 'reconnaitre-mediatrice', 'moyen', () => {
    const P = repere();
    const ab = 2 * F.ent(2, 5), ac = F.ent(3, 6);
    const pts = { A: P(0, 0), B: P(ab, 0), C: P(0, ac),
                  M: P(ab / 2, 0), N: P(ab / 2, 3) };
    return {
      pts,
      lignes: [{ nom: '(AB)', A: 'A', B: 'B' },
               { nom: '(Δ)', A: 'M', B: 'N' }],
      segments: [{ nom: '[AB]', A: 'A', B: 'B', milieu: 'M' }],
      hyp: [['perp', '(Δ)', '(AB)'], ['mil', 'M', '[AB]']],
      but: ['med', '(Δ)', '[AB]'],
      donnees: ['ABC مثلّث قائم الزاوية في A حيث AB = ' + ab + ' و AC = ' + ac + '.',
                'M منتصف القطعة [AB].',
                '(Δ) هو المستقيم المارّ من M و العمودي على (AB).'],
      longueurs: [['A', 'B', ab], ['A', 'C', ac]],
      indice: 'الموسط العمودي: عمودي على القطعة، و يمرّ من منتصفها',
      fig: { segments: [['A', 'B'], ['A', 'C'], ['B', 'C']],
             droites: [['M', 'N']],
             angles: [['B', 'A', 'C'], ['A', 'M', 'N']],
             marques: [['A', 'M'], ['M', 'B']], caches: ['N'] }
    };
  });

  // Exercice 6 — de la médiatrice à l'équidistance
  item('droite PC 2 ex6', 'mediatrice-equidistance', 'moyen', () => {
    const P = repere();
    const bc = 2 * F.ent(2, 5), h = F.ent(2, 5);
    const pts = { B: P(0, 0), C: P(bc, 0), N: P(bc / 2, 0), S: P(bc / 2, h) };
    return {
      pts,
      lignes: [{ nom: '(BC)', A: 'B', B: 'C' },
               { nom: '(Δ)', A: 'N', B: 'S' }],
      segments: [{ nom: '[BC]', A: 'B', B: 'C', milieu: 'N' }],
      hyp: [['med', '(Δ)', '[BC]']],
      but: ['egal', 'SB', 'SC'],
      donnees: ['[BC] قطعة مستقيم حيث BC = ' + bc + ' صم.',
                '(Δ) هو الموسط العمودي للقطعة [BC]، و N منتصفها.',
                'S نقطة من (Δ).'],
      longueurs: [['B', 'C', bc]],
      fig: { segments: [['B', 'C'], ['S', 'B'], ['S', 'C']],
             droites: [['N', 'S']],
             angles: [['B', 'N', 'S']],
             marques: [['B', 'N'], ['N', 'C']] }
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // 7ème — « المسقط العمودي لنقطة على مستقيم » (projection Orthogonale)
  // فوزي الغربي
  //
  // Ici on ne démontre plus, on CALCULE : « أحسب بعد A عن (BC) ». La réponse
  // est un nombre, et le nombre se vérifie — c'est la famille la plus sûre de
  // toute la géométrie.
  // ═══════════════════════════════════════════════════════════════════════

  // Exercice 2 — le triangle rectangle, et ses quatre distances
  const TRIANGLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]];
  item('projection Orthogonale ex2', 'distance', 'facile', () => {
    const P = repere();
    const [a, b] = F.choix(TRIANGLES);
    const pts = { B: P(0, 0), A: P(0, a), C: P(b, 0) };
    return {
      pts,
      lignes: [{ nom: '(BC)', A: 'B', B: 'C' }, { nom: '(AB)', A: 'A', B: 'B' },
               { nom: '(AC)', A: 'A', B: 'C' }],
      question: { point: 'A', droite: ['B', 'C'], nomDroite: '(BC)' },
      donnees: ['ABC مثلّث قائم الزاوية في B حيث AB = ' + a + ' و BC = ' + b + '.'],
      longueurs: [['A', 'B', a], ['B', 'C', b]],
      fig: { segments: [['A', 'B'], ['B', 'C'], ['A', 'C']],
             angles: [['A', 'B', 'C']] }
    };
  });
  // Le cas que les élèves manquent : la distance d'un point à une droite qui
  // le porte. Elle est nulle, et il faut savoir le dire.
  item('projection Orthogonale ex2', 'distance', 'facile', () => {
    const P = repere();
    const [a, b] = F.choix(TRIANGLES);
    const pts = { B: P(0, 0), A: P(0, a), C: P(b, 0) };
    return {
      pts,
      lignes: [{ nom: '(AC)', A: 'A', B: 'C' }, { nom: '(AB)', A: 'A', B: 'B' },
               { nom: '(BC)', A: 'B', B: 'C' }],
      question: { point: 'A', droite: ['A', 'C'], nomDroite: '(AC)' },
      donnees: ['ABC مثلّث قائم الزاوية في B حيث AB = ' + a + ' و BC = ' + b + '.'],
      longueurs: [['A', 'B', a], ['B', 'C', b]],
      fig: { segments: [['A', 'B'], ['B', 'C'], ['A', 'C']],
             angles: [['A', 'B', 'C']] }
    };
  });

  // Exercice 3 — le rectangle et ses diagonales
  item('projection Orthogonale ex3', 'distance', 'moyen', () => {
    const P = repere();
    const l = 2 * F.ent(3, 6), h = 2 * F.ent(2, 4);
    const pts = { A: P(0, h), D: P(l, h), C: P(l, 0), B: P(0, 0),
                  E: P(l / 2, h / 2) };
    return {
      pts,
      lignes: [{ nom: '(BC)', A: 'B', B: 'C' }, { nom: '(AB)', A: 'A', B: 'B' },
               { nom: '(CD)', A: 'C', B: 'D' }, { nom: '(AD)', A: 'A', B: 'D' }],
      question: { point: F.choix(['D', 'A', 'E']), droite: ['B', 'C'],
                  nomDroite: '(BC)' },
      donnees: ['ABCD مستطيل حيث AB = ' + h + ' و BC = ' + l + '.',
                'E هي نقطة تقاطع قطريه.'],
      longueurs: [['A', 'B', h], ['B', 'C', l]],
      fig: { segments: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'],
                        ['A', 'C'], ['B', 'D']],
             angles: [['A', 'B', 'C']] }
    };
  });

  // Exercice 4 — l'aire donne la distance, et réciproquement
  item('projection Orthogonale ex4', 'distance', 'moyen', () => {
    const P = repere();
    const [a, b] = F.choix(TRIANGLES);
    const pts = { A: P(0, 0), B: P(b, 0), C: P(0, a) };
    return {
      pts,
      lignes: [{ nom: '(AB)', A: 'A', B: 'B' }, { nom: '(AC)', A: 'A', B: 'C' }],
      question: { point: 'C', droite: ['A', 'B'], nomDroite: '(AB)' },
      donnees: ['(AB) مستقيم حيث AB = ' + b + '، و C نقطة لا تنتمي إليه.',
                'المثلّث ABC قائم الزاوية في A، و AC = ' + a + '.'],
      longueurs: [['A', 'B', b], ['A', 'C', a]],
      fig: { droites: [['A', 'B']], segments: [['A', 'C'], ['B', 'C']],
             angles: [['B', 'A', 'C']] }
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // 7ème — « الوضعية النسبية لدائرة و مستقيم » (cercle7, Droites_70)
  // فوزي الغربي
  // ═══════════════════════════════════════════════════════════════════════

  // cercle7 ex2 / Droites_70 ex36 — les deux tangentes aux bouts d'un diamètre
  item('cercle7 ex2', 'tangente-para', 'moyen', () => {
    const P = repere();
    const r = F.ent(2, 5);
    const pts = { I: P(0, 0), A: P(-r, 0), B: P(r, 0),
                  E: P(-r, 2), G: P(r, 2) };
    return {
      pts,
      lignes: [{ nom: '(AB)', A: 'A', B: 'B' },
               { nom: '(Δ)', A: 'A', B: 'E' },
               { nom: '(D)', A: 'B', B: 'G' }],
      cercles: [{ nom: '(C)', centre: 'I', bord: 'A' }],
      hyp: [['tang', '(Δ)', 'A@(C)'], ['tang', '(D)', 'B@(C)']],
      but: ['para', '(Δ)', '(D)'],
      donnees: ['(C) دائرة مركزها I و [AB] قطر لها، حيث AB = ' + (2 * r) + '.',
                '(Δ) هو المماس لـ (C) في A، و (D) هو المماس لـ (C) في B.'],
      longueurs: [['A', 'B', 2 * r], ['I', 'A', r]],
      fig: { cercles: [['I', 'A']], segments: [['A', 'B']],
             droites: [['A', 'E'], ['B', 'G']],
             angles: [['I', 'A', 'E'], ['I', 'B', 'G']], caches: ['E', 'G'] }
    };
  });

  // cercle7 ex6 — le rayon vaut la moitié : la médiatrice touche sans couper
  item('cercle7 ex6', 'position-droite-cercle', 'moyen', () => {
    const P = repere();
    const ab = 2 * F.ent(2, 5);
    const pts = { A: P(0, 0), B: P(ab, 0), I: P(ab / 2, 0), J: P(ab / 2, 3) };
    return {
      pts,
      lignes: [{ nom: '(AB)', A: 'A', B: 'B' }, { nom: '(Δ)', A: 'I', B: 'J' }],
      question: { centre: 'A', bord: 'I', droite: ['I', 'J'],
                  nomDroite: '(Δ)', nomCercle: '(C)' },
      donnees: ['[AB] قطعة مستقيم حيث AB = ' + ab + '، و I منتصفها.',
                '(C) هي الدائرة التي مركزها A و شعاعها AI.',
                '(Δ) هو الموسط العمودي للقطعة [AB].'],
      longueurs: [['A', 'B', ab], ['A', 'I', ab / 2]],
      fig: { cercles: [['A', 'I']], segments: [['A', 'B']],
             droites: [['I', 'J']], marques: [['A', 'I'], ['I', 'B']],
             angles: [['A', 'I', 'J']], caches: ['J'] }
    };
  });

  // cercle7 ex3 — le cercle de diamètre [AC] et le côté (AB)
  item('cercle7 ex3', 'position-droite-cercle', 'difficile', () => {
    const P = repere();
    const [a, b] = F.choix(TRIANGLES);
    const pts = { A: P(0, 0), B: P(0, 2 * a), C: P(2 * b, 0), O: P(b, 0) };
    return {
      pts,
      lignes: [{ nom: '(AB)', A: 'A', B: 'B' }, { nom: '(AC)', A: 'A', B: 'C' }],
      question: { centre: 'O', bord: 'A', droite: ['A', 'B'],
                  nomDroite: '(AB)', nomCercle: '(C)' },
      donnees: ['ABC مثلّث قائم الزاوية في A حيث AB = ' + (2 * a)
                + ' و AC = ' + (2 * b) + '.',
                '(C) هي الدائرة التي قطرها [AC]، و O منتصفه.'],
      longueurs: [['A', 'B', 2 * a], ['A', 'C', 2 * b], ['O', 'A', b]],
      fig: { cercles: [['O', 'A']],
             segments: [['A', 'B'], ['A', 'C'], ['B', 'C']],
             angles: [['B', 'A', 'C']] }
    };
  });

  // Une droite qui coupe franchement, et une qui passe au large : les trois
  // verdicts doivent tous se rencontrer, sinon l'élève n'en apprend qu'un.
  item('cercle7 ex15', 'position-droite-cercle', 'moyen', () => {
    const P = repere();
    const r = F.ent(3, 6), d = F.choix([0, 1, 2, r + 1, r + 3]);
    const pts = { O: P(0, 0), A: P(r, 0), M: P(0, d), N: P(3, d) };
    return {
      pts,
      lignes: [{ nom: '(D)', A: 'M', B: 'N' }],
      question: { centre: 'O', bord: 'A', droite: ['M', 'N'],
                  nomDroite: '(D)', nomCercle: '(C)' },
      donnees: ['(C) دائرة مركزها O و شعاعها ' + r + ' صم.',
                '(D) مستقيم يبعد عن O بـ ' + d + ' صم.'],
      longueurs: [['O', 'A', r]],
      fig: { cercles: [['O', 'A']], droites: [['M', 'N']],
             segments: [['O', 'A']], caches: ['N'] }
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // 7ème — « الوضعية النسبية لدائرتين » (cercle7 ex8, Droites_70 ex42)
  // ═══════════════════════════════════════════════════════════════════════

  // ex8 — trois cercles bâtis sur la même corde : tous les cas y passent
  item('cercle7 ex8', 'position-deux-cercles', 'moyen', () => {
    const P = repere();
    const ab = 2 * F.ent(2, 5), r2 = F.ent(1, 6);
    const pts = { A: P(0, 0), B: P(ab, 0), I: P(ab / 2, 0),
                  J: P(ab / 2 + r2, 0) };
    return {
      pts,
      lignes: [{ nom: '(AB)', A: 'A', B: 'B' }],
      question: { centre1: 'A', bord1: 'I', centre2: 'I', bord2: 'J',
                  nom1: '(C)', nom2: "(C')" },
      donnees: ['[AB] قطعة مستقيم حيث AB = ' + ab + '، و I منتصفها.',
                '(C) هي الدائرة التي مركزها A و شعاعها AI.',
                "(C') هي الدائرة التي مركزها I و شعاعها " + r2 + '.'],
      longueurs: [['A', 'B', ab], ['A', 'I', ab / 2], ['I', 'J', r2]],
      fig: { cercles: [['A', 'I'], ['I', 'J']], segments: [['A', 'B']],
             marques: [['A', 'I'], ['I', 'B']], caches: ['J'] }
    };
  });

  // Droites_70 ex42 — deux cercles bâtis sur les deux moitiés d'une corde
  item('Droites_70 ex42', 'position-deux-cercles', 'difficile', () => {
    const P = repere();
    const ab = 2 * F.ent(3, 6);
    const pts = { A: P(0, 0), B: P(ab, 0), I: P(ab / 2, 0) };
    return {
      pts,
      lignes: [{ nom: '(AB)', A: 'A', B: 'B' }],
      question: { centre1: 'A', bord1: 'I', centre2: 'B', bord2: 'I',
                  nom1: '(C)', nom2: '(C1)' },
      donnees: ['[AB] قطعة مستقيم حيث AB = ' + ab + '، و I منتصفها.',
                '(C) هي الدائرة التي مركزها A و شعاعها AI.',
                '(C1) هي الدائرة التي مركزها B و شعاعها IB.'],
      longueurs: [['A', 'B', ab], ['A', 'I', ab / 2], ['I', 'B', ab / 2]],
      fig: { cercles: [['A', 'I'], ['B', 'I']], segments: [['A', 'B']],
             marques: [['A', 'I'], ['I', 'B']] }
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // 7ème — LA NATURE D'UN RÉBAEI, déduite des perpendiculaires et des
  // parallèles. « ما نوع الرباعي BAIE ؟ علّل جوابك » revient dans presque
  // tous les exercices des feuilles, et c'est toujours le même geste : deux
  // parallélismes font un parallélogramme, un angle droit en fait un rectangle.
  // ═══════════════════════════════════════════════════════════════════════

  // droite PC 2 ex2-4 — BAIE, bâti sur le triangle rectangle BUT
  item('droite PC 2 ex2', 'nature-quadrilatere', 'difficile', () => {
    const P = repere();
    // BAIE DOIT ÊTRE UN RECTANGLE, PAS UN CARRÉ. Si BA venait à valoir BE, la
    // réponse « مستطيل » serait incomplète — l'élève qui répondrait « مربّع »
    // aurait plus raison que le corrigé. On écarte donc le cas.
    let bt, bu, ua, ba;
    do {
      bt = F.ent(3, 6); bu = F.ent(5, 9); ua = F.ent(2, bu - 2); ba = bu - ua;
    } while (ba === bt);
    // I EST SUR (UT), l'énoncé le dit. Posé au petit bonheur en face de A, il
    // n'y était pas, et rien ne s'en apercevait : la démonstration restait
    // vraie sur une figure fausse. On le calcule donc là où (UT) le met —
    // x/bt + y/bu = 1 — et l'on DÉCLARE l'alignement pour qu'il soit vérifié.
    const ix = F.q(bt * (bu - ba), bu);
    const pts = { B: P(0, 0), T: P(bt, 0), U: P(0, bu),
                  A: P(0, ba), I: P(ix, ba), E: P(ix, 0) };
    return {
      pts,
      // Les côtés du quadrilatère sont nommés EN PREMIER : quand deux noms
      // désignent la même droite, c'est celui-là qu'on veut lire dans la
      // démonstration, pas le nom du triangle qui l'a fait naître.
      lignes: [{ nom: '(BA)', A: 'B', B: 'A' }, { nom: '(AI)', A: 'A', B: 'I' },
               { nom: '(IE)', A: 'I', B: 'E' }, { nom: '(EB)', A: 'E', B: 'B' },
               { nom: '(BU)', A: 'B', B: 'U' }, { nom: '(BT)', A: 'B', B: 'T' }],
      quads: [{ nom: 'BAIE', sommets: ['B', 'A', 'I', 'E'] }],
      hyp: [['para', '(BA)', '(IE)'], ['para', '(AI)', '(EB)'],
            ['perp', '(BA)', '(EB)']],
      but: ['nature', 'BAIE', 'rectangle'],
      donnees: ['BUT مثلّث قائم الزاوية في B حيث BT = ' + bt + ' و BU = ' + bu + '.',
                'A نقطة من [BU] حيث BA = ' + ba + '، و I نقطة حيث (AI) ⊥ (BU).',
                'E هي نقطة تقاطع العمودي على (BT) المارّ من I مع (BT).'],
      longueurs: [['B', 'T', bt], ['B', 'U', bu], ['B', 'A', ba]],
      alignements: [['U', 'T', 'I'], ['B', 'T', 'E']],
      indice: 'ابدأ بالتوازيين، ثمّ انظر إلى الزاوية',
      fig: { segments: [['B', 'T'], ['B', 'U'], ['U', 'T'],
                        ['B', 'A'], ['A', 'I'], ['I', 'E'], ['E', 'B']],
             angles: [['A', 'B', 'E'], ['B', 'A', 'I'], ['A', 'I', 'E']] }
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // 7ème — LE MOSSATT ET LE CERCLE CIRCONSCRIT (Droites_70 ex28 à 31)
  //
  // Trois points non alignés, deux médiatrices, et un point à égale distance
  // des trois. C'est le cercle circonscrit, et il se démontre en trois lignes
  // avec la seule propriété d'équidistance.
  // ═══════════════════════════════════════════════════════════════════════

  // ex28-1 — pourquoi MA = MC
  item('Droites_70 ex28', 'cercle-circonscrit', 'difficile', () => {
    const P = repere();
    const [a, b] = F.choix([[6, 8], [8, 6], [12, 10], [10, 12]]);
    const pts = { A: P(0, 0), B: P(a, 0), C: P(0, b),
                  I: P(a / 2, 0), J: P(a / 2, 3), K: P(0, b / 2), L: P(3, b / 2),
                  M: P(a / 2, b / 2) };
    return {
      pts,
      lignes: [{ nom: '(AB)', A: 'A', B: 'B' }, { nom: '(AC)', A: 'A', B: 'C' },
               { nom: '(d1)', A: 'I', B: 'J' }, { nom: '(d2)', A: 'K', B: 'L' }],
      segments: [{ nom: '[AB]', A: 'A', B: 'B', milieu: 'I' },
                 { nom: '[AC]', A: 'A', B: 'C', milieu: 'K' }],
      hyp: [['med', '(d1)', '[AB]'], ['med', '(d2)', '[AC]']],
      but: ['egal', 'MB', 'MC'],
      donnees: ['A و B و C ثلاث نقاط ليست على استقامة واحدة.',
                '(d1) هو الموسط العمودي للقطعة [AB]، و (d2) هو الموسط العمودي للقطعة [AC].',
                'M هي نقطة تقاطع (d1) و (d2).'],
      longueurs: [['A', 'B', a], ['A', 'C', b]],
      indice: 'كلّ موسط عمودي يعطي تساوي بعد، ثمّ اجمع النتيجتين',
      fig: { segments: [['A', 'B'], ['A', 'C'], ['B', 'C'],
                        ['M', 'A'], ['M', 'B'], ['M', 'C']],
             droites: [['I', 'J'], ['K', 'L']],
             marques: [['A', 'I'], ['I', 'B']],
             caches: ['J', 'L'] }
    };
  });

  // ex28-2 — et alors le moussat de [BC] passe par M
  item('Droites_70 ex28', 'cercle-circonscrit', 'difficile', () => {
    const P = repere();
    const [a, b] = F.choix([[6, 8], [8, 6], [12, 10], [10, 12]]);
    const pts = { A: P(0, 0), B: P(a, 0), C: P(0, b), M: P(a / 2, b / 2) };
    // le milieu de [BC], et la médiatrice qui en part
    pts.O = F.milieu(pts.B, pts.C);
    pts.Q = F.perpDepuis(pts.O, pts.B, pts.C, F.q(1, 3));
    return {
      pts,
      lignes: [{ nom: '(BC)', A: 'B', B: 'C' }, { nom: '(d3)', A: 'O', B: 'Q' }],
      segments: [{ nom: '[BC]', A: 'B', B: 'C', milieu: 'O' }],
      hyp: [['med', '(d3)', '[BC]'],
            ['egal', 'MA', 'MB'], ['egal', 'MA', 'MC']],
      but: ['passe', '(d3)', 'M'],
      donnees: ['A و B و C ثلاث نقاط ليست على استقامة واحدة.',
                'M نقطة حيث MA = MB و MA = MC.',
                '(d3) هو الموسط العمودي للقطعة [BC]، و O منتصفها.'],
      longueurs: [['A', 'B', a], ['A', 'C', b]],
      indice: 'استعمل عكس خاصية الموسط العمودي',
      fig: { segments: [['A', 'B'], ['A', 'C'], ['B', 'C'],
                        ['M', 'A'], ['M', 'B'], ['M', 'C']],
             droites: [['O', 'Q']], marques: [['B', 'O'], ['O', 'C']],
             caches: ['Q'] }
    };
  });

  // ex30 / ex31 — le triangle isocèle : (AI) est le moussat de [BC]
  item('Droites_70 ex30', 'cercle-circonscrit', 'moyen', () => {
    const P = repere();
    const [c, h] = F.choix([[6, 4], [8, 3], [10, 12], [6, 8]]);
    const pts = { B: P(0, 0), C: P(c, 0), I: P(c / 2, 0), A: P(c / 2, h) };
    return {
      pts,
      lignes: [{ nom: '(BC)', A: 'B', B: 'C' }, { nom: '(AI)', A: 'A', B: 'I' }],
      segments: [{ nom: '[BC]', A: 'B', B: 'C', milieu: 'I' }],
      hyp: [['egal', 'AB', 'AC'], ['mil', 'I', '[BC]']],
      but: ['med', '(AI)', '[BC]'],
      donnees: ['ABC مثلّث متقايس الضلعين قمته الرئيسية A، حيث BC = ' + c + '.',
                'I منتصف القطعة [BC].'],
      longueurs: [['B', 'C', c], ['B', 'I', c / 2]],
      indice: 'نقطتان متساويتا البعد عن B و C تكفيان لتحديد الموسط العمودي',
      fig: { segments: [['A', 'B'], ['A', 'C'], ['B', 'C'], ['A', 'I']],
             marques: [['B', 'I'], ['I', 'C']],
             angles: [['B', 'I', 'A']] }
    };
  });

  // ═══════════════════════════════════════════════════════════════════════
  // ÉCARTÉ DE CES FEUILLES, ET POURQUOI
  //
  //   Toute la première moitié de chaque exercice est une CONSTRUCTION :
  //   « ارسم »، « عيّن »، « انشئ ». Elle ne se vérifie pas — un tracé juste et
  //   un tracé faux ont le même texte — et le maître dit qu'elle ne fait pas
  //   un bon exercice à elle seule. Elle reste donc dans l'énoncé, comme mise
  //   en place, et c'est le « برهن أنّ » qui devient la question.
  //
  //   La feuille de l'Ustadh بوطبية (أولى متوسط) est presque entièrement
  //   constructive : « أنشئ »، « عيّن » de bout en bout. Deux questions y
  //   échappent — « ما هو الوضع النسبي للمستقيمين » et « أكمل بـ ⊥ أو // » —
  //   et elles rejoindront la famille qui leur convient.
  //
  //   Les feuilles « الوضعية النسبية لدائرة و مستقيم » et « الدائرة و المماس »
  //   demandent le cercle et sa tangente : d'autres règles, un autre lot. Le
  //   noyau les porte déjà (cercles, distances exactes), les items viendront.
  // ═══════════════════════════════════════════════════════════════════════

  const par = (f, d) => ITEMS.filter(x => x.f === f && x.d === d);
  const familles = () => [...new Set(ITEMS.map(x => x.f))];

  const API = { ITEMS, par, familles, repere };
  if (M) module.exports = API; else racine.Items = API;
})(typeof window !== 'undefined' ? window : globalThis);
