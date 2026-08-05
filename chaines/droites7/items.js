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
  function repere() {
    const [a, b] = F.choix(POSES);
    const h = Math.hypot(a, b);
    // (u, v) est une base orthonormée à coordonnées rationnelles
    const u = F.pt(F.q(a, Math.round(h)), F.q(b, Math.round(h)));
    const v = F.pt(F.qNeg(u.y), u.x);
    return (x, y) => F.pt(
      F.qAdd(F.qMul(F.q(x * 2), u.x), F.qMul(F.q(y * 2), v.x)),
      F.qAdd(F.qMul(F.q(x * 2), u.y), F.qMul(F.q(y * 2), v.y)));
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
      fig: { segments: [['B', 'C'], ['S', 'B'], ['S', 'C']],
             droites: [['N', 'S']],
             angles: [['B', 'N', 'S']],
             marques: [['B', 'N'], ['N', 'C']] }
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
