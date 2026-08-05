// المعلم المتعامد و المتجانس في المستوي — 9 أساسي.
//
// La leçon, et non un devoir : huit familles, une page chacune, cinq questions
// par page, TIRÉES À CHAQUE CHARGEMENT. C'est le contraire du dossier
// « brevet », qui reprend les nombres d'une feuille précise ; ici l'élève doit
// pouvoir recommencer autant de fois qu'il veut.
//
// Le chapitre est né d'un manque constaté : deux exercices sur cinq de la
// séance 2 du livre de révision sont dans un repère, et la géométrie qu'ils
// demandent — milieu, symétrique, parallélogramme, cercle de diamètre — était
// déjà connue ailleurs. Il ne manquait que les COORDONNÉES.
//
// Chaque question porte sa figure. Le validateur ne relit pas le générateur :
// il RECONSTRUIT la figure à partir des points posés et recalcule chaque
// affirmation — « ABCD est un losange », « les trois points sont alignés »,
// « AB = 5 ». Un tirage qui produirait un faux losange ne passerait pas.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;
  const R = M ? require('./repere.js') : racine.Repere;
  const { ent, choix, rat, sTxt } = F;

  // ── Petits outils d'écriture ────────────────────────────────────────────
  const n = v => String(v);
  // « (2 ; -3) » — les coordonnées telles que l'élève les écrit.
  const co = (x, y) => '(' + n(x) + ' ; ' + n(y) + ')';
  // Un couple nu n'est PAS une relation — le validateur le refuse, et il a
  // raison : « (4 ; 1) » ne dit rien qu'on puisse recalculer. On l'annonce donc
  // en toutes lettres, et c'est le `fait` de la figure qui le contrôle.
  const dirV = (q, x, y) => 'الشعاع ' + q + ' إحداثياته ' + co(x, y);
  const dirP = (q, x, y) => 'النقطة ' + q + ' إحداثياتها ' + co(x, y);
  // Une différence prête à être lue : « 5 - (-3) » et non « 5 - -3 ».
  const moins = v => (v < 0 ? '(' + v + ')' : String(v));
  // Un couple de coordonnées entières, pour la déclaration de figure.
  const P = (x, y) => ['point', String(x), String(y)];
  // Un demi-entier écrit en fraction quand il le faut : 5/2, pas 2,5.
  const demi = v => (v % 2 === 0 ? String(v / 2) : v + '/2');

  // Deux points distincts, à coordonnées entières, dans une fenêtre lisible.
  function deuxPoints(min, max) {
    for (;;) {
      const a = [ent(min, max), ent(min, max)], b = [ent(min, max), ent(min, max)];
      if (a[0] !== b[0] || a[1] !== b[1]) return [a, b];
    }
  }
  // Un vecteur non nul, assez petit pour que la figure tienne dans la fenêtre.
  function vecteur(m) {
    for (;;) {
      const u = [ent(-m, m), ent(-m, m)];
      if (u[0] || u[1]) return u;
    }
  }
  const q = (enonce, indice, etapes, controle) => ({ enonce, indice, etapes, controle });
  // Cinq tirages d'une même famille — l'élève voit la règle cinq fois.
  const cinq = f => { const t = []; for (let i = 0; i < 5; i++) t.push(f()); return t; };

  // =========================================================================
  // 1 — LE MILIEU D'UN SEGMENT
  //     Les coordonnées du milieu sont les MOYENNES. C'est la seule formule de
  //     la page, et elle se lit deux fois : une par axe.
  // =========================================================================
  function unMilieu() {
    const [[xa, ya], [xb, yb]] = deuxPoints(-6, 6);
    const sx = xa + xb, sy = ya + yb;
    return q(
      ['المستوي منسوب إلى معلم متعامد و متجانس (O, I, J).',
       'أحسب إحداثيات النقطة M منتصف [AB] حيث A' + co(xa, ya) + ' و B' + co(xb, yb)],
      'فاصلة المنتصف هي معدّل الفاصلتين، و ترتيبته معدّل الترتيبتين',
      [
        ['القاعدة', 'إحداثيات منتصف [AB] هما (xA + xB)/2 و (yA + yB)/2'],
        ['نجمع الفاصلتين', 'xA + xB = ' + n(xa) + ' + ' + moins(xb) + ' = ' + sx],
        ['نقسم على 2', 'xM = ' + demi(sx)],
        ['نجمع الترتيبتين', 'yA + yB = ' + n(ya) + ' + ' + moins(yb) + ' = ' + sy],
        ['نقسم على 2', 'yM = ' + demi(sy)],
        ['النتيجة', dirP('M', demi(sx), demi(sy))]
      ],
      { points: { A: P(xa, ya), B: P(xb, yb), M: ['milieu', 'A', 'B'] },
        faits: [['milieu', 'M', 'A', 'B'],
                ['abscisse', 'M', demi(sx)], ['ordonnee', 'M', demi(sy)],
                ['abscisse', 'A', n(xa)], ['ordonnee', 'B', n(yb)]] });
  }

  // =========================================================================
  // 2 — LE SYMÉTRIQUE D'UN POINT PAR RAPPORT À UN POINT
  //     C'est la formule du milieu LUE À L'ENVERS : B est le milieu de [AE],
  //     donc xE = 2xB - xA. L'élève qui écrit xE = xB - xA a oublié le 2.
  // =========================================================================
  function unSymetrique() {
    const [[xa, ya], [xb, yb]] = deuxPoints(-5, 5);
    const xe = 2 * xb - xa, ye = 2 * yb - ya;
    return q(
      ['المستوي منسوب إلى معلم متعامد و متجانس (O, I, J).',
       'حدّد إحداثيات النقطة E مناظرة A' + co(xa, ya) + ' بالنسبة إلى B' + co(xb, yb)],
      'B هو منتصف [AE]: اقلب صيغة المنتصف',
      [
        ['القاعدة', 'E مناظرة A بالنسبة إلى B معناه أنّ B منتصف [AE]'],
        ['نكتب صيغة المنتصف', '(xA + xE)/2 = xB'],
        ['نستخرج الفاصلة', 'xE = 2 × ' + moins(xb) + ' - ' + moins(xa)],
        ['نحسب', 'xE = ' + xe],
        ['نفعل نفس الشيء للترتيبة', 'yE = 2 × ' + moins(yb) + ' - ' + moins(ya)],
        ['نحسب', 'yE = ' + ye],
        ['النتيجة', dirP('E', xe, ye)]
      ],
      { points: { A: P(xa, ya), B: P(xb, yb), E: ['sym', 'A', 'B'] },
        faits: [['symetrique', 'E', 'A', 'B'], ['milieu', 'B', 'A', 'E'],
                ['abscisse', 'E', n(xe)], ['ordonnee', 'E', n(ye)]] });
  }

  // =========================================================================
  // 3 — LA DISTANCE ENTRE DEUX POINTS
  //     On calcule LE CARRÉ, et l'on ne passe sous le radical qu'à la fin.
  //     La moitié des tirages tombe sur un entier, l'autre sur un radical à
  //     simplifier : les deux cas doivent être vus.
  // =========================================================================
  const ECARTS = [[3, 4], [4, 3], [6, 8], [5, 12], [8, 15], [1, 1], [2, 2],
                  [1, 2], [2, 3], [3, 3], [1, 3], [2, 4], [4, 4], [2, 6], [3, 6]];
  function uneDistance() {
    const [dx0, dy0] = choix(ECARTS);
    const sx = choix([1, -1]), sy = choix([1, -1]);
    const dx = sx * dx0, dy = sy * dy0;
    const xa = ent(-5, 5), ya = ent(-5, 5);
    const xb = xa + dx, yb = ya + dy;
    const carre = dx0 * dx0 + dy0 * dy0;
    const val = sTxt(F.sSqrt(F.num(carre)));
    return q(
      ['المستوي منسوب إلى معلم متعامد و متجانس (O, I, J).',
       'أحسب المسافة AB حيث A' + co(xa, ya) + ' و B' + co(xb, yb)],
      'ابدأ بالمربّع: AB^2 = (xB - xA)^2 + (yB - yA)^2',
      [
        ['القاعدة', 'في معلم متعامد و متجانس: AB^2 = (xB - xA)^2 + (yB - yA)^2'],
        ['نحسب فرق الفاصلتين', 'xB - xA = ' + moins(xb) + ' - ' + moins(xa) + ' = ' + dx],
        ['نحسب فرق الترتيبتين', 'yB - yA = ' + moins(yb) + ' - ' + moins(ya) + ' = ' + dy],
        ['نربّع و نجمع', '(' + dx + ')^2 + (' + dy + ')^2 = ' + carre],
        ['نأخذ الجذر', 'AB^2 = ' + carre],
        ['النتيجة', 'AB = ' + val]
      ],
      { points: { A: P(xa, ya), B: P(xb, yb) },
        faits: [['longueur-carree', 'A', 'B', n(carre)], ['longueur', 'A', 'B', val]] });
  }

  // =========================================================================
  // 4 — LA NATURE D'UN QUADRILATÈRE
  //     On part TOUJOURS du parallélogramme — AB→ = DC→ —, puis on regarde ce
  //     qui s'y ajoute : un côté égal fait le losange, un angle droit le
  //     rectangle, les deux le carré. C'est l'ordre de la leçon.
  // =========================================================================
  // Des couples (u, v) qui donnent chacun une nature, et rien d'autre.
  const NATURES = [
    { cle: 'pgram',     nom: 'متوازي أضلاع', u: [4, 1], v: [1, 3] },
    { cle: 'pgram',     nom: 'متوازي أضلاع', u: [5, 2], v: [-1, 3] },
    { cle: 'losange',   nom: 'معيّن',        u: [3, 4], v: [5, 0] },
    { cle: 'losange',   nom: 'معيّن',        u: [4, 3], v: [0, 5] },
    { cle: 'rectangle', nom: 'مستطيل',       u: [3, 4], v: [-8, 6] },
    { cle: 'rectangle', nom: 'مستطيل',       u: [4, 3], v: [-3, 4] },
    { cle: 'carre',     nom: 'مربّع',        u: [3, 4], v: [-4, 3] },
    { cle: 'carre',     nom: 'مربّع',        u: [2, 0], v: [0, 2] }
  ];
  function uneNature() {
    const m = choix(NATURES);
    const xa = ent(-4, 2), ya = ent(-4, 2);
    const B = [xa + m.u[0], ya + m.u[1]];
    const C = [B[0] + m.v[0], B[1] + m.v[1]];
    const D = [xa + m.v[0], ya + m.v[1]];
    const ab2 = m.u[0] * m.u[0] + m.u[1] * m.u[1];
    const bc2 = m.v[0] * m.v[0] + m.v[1] * m.v[1];
    const sca = m.u[0] * m.v[0] + m.u[1] * m.v[1];
    const etapes = [
      ['القاعدة', 'الرباعي ABCD متوازي أضلاع إذا و فقط إذا كان الشعاعان AB و DC متساويين'],
      ['نحسب إحداثيات الشعاع AB', dirV('AB', m.u[0], m.u[1])],
      ['نحسب إحداثيات الشعاع DC', dirV('DC', m.u[0], m.u[1])],
      ['الشعاعان متساويان', 'إذن الرباعي ABCD متوازي أضلاع'],
      ['نحسب مربّع الضلع الأوّل', 'AB^2 = ' + ab2],
      ['نحسب مربّع الضلع المجاور', 'BC^2 = ' + bc2]
    ];
    const faits = [['parallelogramme', 'A', 'B', 'C', 'D'],
                   ['longueur-carree', 'A', 'B', n(ab2)],
                   ['longueur-carree', 'B', 'C', n(bc2)]];
    if (m.cle === 'pgram') {
      etapes.push(['المربّعان مختلفان', 'الضلعان المتجاوران غير متقايسين'],
                  ['و الجداء السلّمي غير منعدم', 'الزاوية ليست قائمة'],
                  ['النتيجة', 'الرباعي ABCD متوازي أضلاع، و ليس أكثر']);
      faits.push(['milieu', 'M', 'A', 'C'], ['milieu', 'M', 'B', 'D']);
    } else if (m.cle === 'losange') {
      etapes.push(['المربّعان متساويان', 'AB = BC'],
                  ['النتيجة', 'متوازي أضلاع له ضلعان متجاوران متقايسان، إذن ABCD معيّن']);
      faits.push(['losange', 'A', 'B', 'C', 'D']);
    } else if (m.cle === 'rectangle') {
      etapes.push(['نحسب الجداء السلّمي للشعاعين AB و BC', 'الجداء السلّمي يساوي ' + n(sca)],
                  ['الجداء منعدم', 'إذن الزاوية في B قائمة'],
                  ['النتيجة', 'متوازي أضلاع له زاوية قائمة، إذن ABCD مستطيل']);
      faits.push(['rectangle', 'A', 'B', 'C', 'D']);
    } else {
      etapes.push(['المربّعان متساويان', 'AB = BC'],
                  ['و الجداء السلّمي منعدم', 'إذن الزاوية في B قائمة'],
                  ['النتيجة', 'متوازي أضلاع له ضلعان متجاوران متقايسان و زاوية قائمة، إذن ABCD مربّع']);
      faits.push(['carre', 'A', 'B', 'C', 'D']);
    }
    return q(
      ['المستوي منسوب إلى معلم متعامد و متجانس (O, I, J).',
       'حدّد طبيعة الرباعي ABCD حيث A' + co(xa, ya) + ' و B' + co(B[0], B[1])
       + ' و C' + co(C[0], C[1]) + ' و D' + co(D[0], D[1])],
      'ابدأ دائما بمتوازي الأضلاع: قارن الشعاعين AB و DC',
      etapes,
      { points: { A: P(xa, ya), B: P(B[0], B[1]), C: P(C[0], C[1]), D: P(D[0], D[1]),
                  M: ['milieu', 'A', 'C'] },
        faits });
  }

  // =========================================================================
  // 5 — TROIS POINTS SONT-ILS ALIGNÉS ?
  //     Le test est celui du PRODUIT EN CROIX sur les coordonnées des deux
  //     vecteurs. Une page sur deux propose un cas où ils ne le sont PAS :
  //     répondre « non » est une réponse, et il faut savoir la justifier.
  // =========================================================================
  function unAlignement() {
    const xa = ent(-5, 3), ya = ent(-5, 3);
    const u = vecteur(4);
    const k = choix([2, 3, -2, -1]);
    const B = [xa + u[0], ya + u[1]];
    const aligne = choix([true, true, false]);
    // POUR SORTIR DE LA DROITE, IL FAUT SORTIR PERPENDICULAIREMENT. Décaler la
    // seule abscisse laissait le point SUR la droite dès que (AB) était
    // horizontal — et la page répondait alors « non alignés » sur trois points
    // qui l'étaient. C'est la règle « non-alignes » qui l'a dit ; on décale
    // donc du vecteur normal, qui n'est jamais colinéaire à u.
    const s0 = choix([1, -1]);
    const C = aligne ? [xa + k * u[0], ya + k * u[1]]
                     : [xa + k * u[0] - s0 * u[1], ya + k * u[1] + s0 * u[0]];
    const v = [C[0] - xa, C[1] - ya];
    const croix = u[0] * v[1] - u[1] * v[0];
    return q(
      ['المستوي منسوب إلى معلم متعامد و متجانس (O, I, J).',
       'هل النقاط A' + co(xa, ya) + ' و B' + co(B[0], B[1]) + ' و C' + co(C[0], C[1])
       + ' على استقامة واحدة؟ علّل'],
      'احسب إحداثيات الشعاعين AB و AC، ثمّ الجداء في تقاطع',
      [
        ['القاعدة', 'النقاط A و B و C على استقامة واحدة إذا و فقط إذا انعدم الجداء '
                  + 'في تقاطع إحداثيات الشعاعين AB و AC'],
        ['إحداثيات الشعاع AB', dirV('AB', u[0], u[1])],
        ['إحداثيات الشعاع AC', dirV('AC', v[0], v[1])],
        // Les deux produits sont souvent ÉGAUX — c'est même le cas quand les
        // points sont alignés. Écrits dans le même ordre ils donneraient deux
        // fois la même relation, et l'élève ne saurait plus laquelle ranger où.
        ['نحسب الجداء الأوّل', n(u[0]) + ' × ' + moins(v[1]) + ' = ' + (u[0] * v[1])],
        ['نحسب الجداء الثاني', moins(v[0]) + ' × ' + moins(u[1]) + ' = ' + (u[1] * v[0])],
        ['نطرح', moins(u[0] * v[1]) + ' - ' + moins(u[1] * v[0]) + ' = ' + croix],
        ['النتيجة', aligne ? 'الجداء في تقاطع منعدم، إذن النقاط الثلاث على استقامة واحدة'
                           : 'الجداء في تقاطع غير منعدم، إذن النقاط الثلاث ليست على استقامة واحدة']
      ],
      { points: { A: P(xa, ya), B: P(B[0], B[1]), C: P(C[0], C[1]) },
        faits: aligne ? [['alignes', 'A', 'B', 'C'], ['distincts', 'A', 'B'],
                         ['distincts', 'A', 'C']]
                      : [['non-alignes', 'A', 'B', 'C'], ['distincts', 'A', 'C'],
                         ['distincts', 'B', 'C']] });
  }

  // =========================================================================
  // 6 — DROITES PARALLÈLES OU PERPENDICULAIRES
  //     Deux tests jumeaux, et il ne faut pas les confondre : le produit EN
  //     CROIX pour le parallélisme, le produit SCALAIRE pour la perpendicularité.
  // =========================================================================
  function uneDirection() {
    const perp = choix([true, false]);
    const u = vecteur(4);
    const mu = choix([2, -2, 3, -1]);
    const v = perp ? [-u[1], u[0]] : [mu * u[0], mu * u[1]];
    const xa = ent(-5, 2), ya = ent(-5, 2);
    const B = [xa + u[0], ya + u[1]];
    const xc = ent(-5, 2), yc = ent(-5, 2);
    const D = [xc + v[0], yc + v[1]];
    const croix = u[0] * v[1] - u[1] * v[0];
    const scal = u[0] * v[0] + u[1] * v[1];
    return q(
      ['المستوي منسوب إلى معلم متعامد و متجانس (O, I, J).',
       'ما هو وضع المستقيمين (AB) و (CD) حيث A' + co(xa, ya) + ' و B' + co(B[0], B[1])
       + ' و C' + co(xc, yc) + ' و D' + co(D[0], D[1]) + '؟'],
      'الجداء في تقاطع يقيس التوازي، و الجداء السلّمي يقيس التعامد',
      [
        ['القاعدة', 'المستقيمان متوازيان إذا انعدم الجداء في تقاطع الشعاعين، '
                  + 'و متعامدان إذا انعدم جداؤهما السلّمي'],
        ['إحداثيات الشعاع AB', dirV('AB', u[0], u[1])],
        ['إحداثيات الشعاع CD', dirV('CD', v[0], v[1])],
        ['نحسب الجداء في تقاطع', n(u[0]) + ' × ' + moins(v[1]) + ' - ' + moins(u[1])
          + ' × ' + moins(v[0]) + ' = ' + croix],
        ['نحسب الجداء السلّمي', n(u[0]) + ' × ' + moins(v[0]) + ' + ' + moins(u[1])
          + ' × ' + moins(v[1]) + ' = ' + scal],
        ['النتيجة', perp ? 'الجداء السلّمي منعدم، إذن المستقيمان (AB) و (CD) متعامدان'
                         : 'الجداء في تقاطع منعدم، إذن المستقيمان (AB) و (CD) متوازيان']
      ],
      { points: { A: P(xa, ya), B: P(B[0], B[1]), C: P(xc, yc), D: P(D[0], D[1]) },
        // Les DEUX distinctions sont posées dans les deux cas : un vecteur nul est
        // à la fois « colinéaire » et « orthogonal » à tout, et sans elles une
        // figure aplatie passerait pour une réponse.
        faits: [perp ? ['perpendiculaires', 'A', 'B', 'C', 'D']
                     : ['paralleles', 'A', 'B', 'C', 'D'],
                ['distincts', 'A', 'B'], ['distincts', 'C', 'D']] });
  }

  // =========================================================================
  // 7 — LE QUATRIÈME SOMMET D'UN PARALLÉLOGRAMME
  //     ABCD parallélogramme ⟺ AB→ = DC→, donc D = A + C - B. C'est la seule
  //     page où l'élève CONSTRUIT un point au lieu de le vérifier.
  // =========================================================================
  function unQuatrieme() {
    const xa = ent(-5, 4), ya = ent(-5, 4);
    const u = vecteur(5), w = vecteur(5);
    if (u[0] * w[1] - u[1] * w[0] === 0) return unQuatrieme();     // aplati : on retire
    const B = [xa + u[0], ya + u[1]];
    const C = [B[0] + w[0], B[1] + w[1]];
    const D = [xa + w[0], ya + w[1]];
    return q(
      ['المستوي منسوب إلى معلم متعامد و متجانس (O, I, J).',
       'حدّد إحداثيات النقطة D بحيث يكون الرباعي ABCD متوازي أضلاع، حيث A'
       + co(xa, ya) + ' و B' + co(B[0], B[1]) + ' و C' + co(C[0], C[1])],
      'اكتب تساوي الشعاعين AB و DC، ثمّ استخرج إحداثيات D',
      [
        ['القاعدة', 'الرباعي ABCD متوازي أضلاع إذا و فقط إذا كان الشعاعان AB و DC متساويين'],
        ['نكتب تساوي الفاصلتين', 'xB - xA = xC - xD'],
        ['نستخرج', 'xD = ' + moins(C[0]) + ' - ' + moins(B[0]) + ' + ' + moins(xa)],
        ['نحسب', 'xD = ' + D[0]],
        ['نفعل نفس الشيء للترتيبة', 'yD = ' + moins(C[1]) + ' - ' + moins(B[1])
          + ' + ' + moins(ya)],
        ['نحسب', 'yD = ' + D[1]],
        ['نتحقّق بالقطرين', 'إذن للقطرين [AC] و [BD] نفس المنتصف'],
        ['النتيجة', dirP('D', D[0], D[1])]
      ],
      { points: { A: P(xa, ya), B: P(B[0], B[1]), C: P(C[0], C[1]), D: P(D[0], D[1]),
                  M: ['milieu', 'A', 'C'] },
        faits: [['parallelogramme', 'A', 'B', 'C', 'D'],
                ['abscisse', 'D', n(D[0])], ['ordonnee', 'D', n(D[1])],
                ['milieu', 'M', 'A', 'C'], ['milieu', 'M', 'B', 'D']] });
  }

  // =========================================================================
  // 8 — LE TRIANGLE RECTANGLE ET SON CERCLE CIRCONSCRIT
  //     Le repère sert ici à DÉMONTRER l'angle droit — par le produit scalaire
  //     ou par la réciproque de Pythagore —, et le centre du cercle circonscrit
  //     tombe alors au milieu de l'hypoténuse. C'est le pont avec « thales9 ».
  // =========================================================================
  const PATTES = [[3, 4], [6, 8], [5, 12], [4, 3], [8, 6], [1, 1], [2, 2], [2, 1], [1, 3]];
  function unCercle() {
    const p = choix(PATTES);
    const k = choix([1, 1, 2]);
    const u = [p[0] * k, p[1] * k];
    const v = [-u[1], u[0]];
    const xa = ent(-4, 2), ya = ent(-4, 2);
    const B = [xa + u[0], ya + u[1]];
    const C = [xa + v[0], ya + v[1]];
    const ab2 = u[0] * u[0] + u[1] * u[1];
    const ac2 = v[0] * v[0] + v[1] * v[1];
    const bc2 = ab2 + ac2;
    const bc = sTxt(F.sSqrt(F.num(bc2)));
    const ray = sTxt(F.sEch(F.sSqrt(F.num(bc2)), rat(1, 2)));
    const mx = (B[0] + C[0]) % 2 === 0 ? String((B[0] + C[0]) / 2) : (B[0] + C[0]) + '/2';
    const my = (B[1] + C[1]) % 2 === 0 ? String((B[1] + C[1]) / 2) : (B[1] + C[1]) + '/2';
    return q(
      ['المستوي منسوب إلى معلم متعامد و متجانس (O, I, J).',
       'بيّن أنّ المثلّث ABC قائم في A، ثمّ حدّد مركز و شعاع دائرته المحيطة، حيث A'
       + co(xa, ya) + ' و B' + co(B[0], B[1]) + ' و C' + co(C[0], C[1])],
      'في مثلّث قائم، مركز الدائرة المحيطة هو منتصف الوتر',
      [
        ['القاعدة', 'المثلّث قائم في A إذا انعدم الجداء السلّمي للشعاعين AB و AC، '
                  + 'و عندئذ مركز دائرته المحيطة هو منتصف الوتر [BC]'],
        ['نحسب مربّع الضلع الأوّل', 'AB^2 = ' + ab2],
        ['نحسب مربّع الضلع الثاني', 'AC^2 = ' + ac2],
        ['نحسب مربّع الضلع الثالث', 'BC^2 = ' + bc2],
        ['المساواة الفيتاغورية محقّقة', 'AB^2 + AC^2 = BC^2'],
        ['إذن المثلّث قائم في A', 'BC = ' + bc],
        ['المركز هو منتصف الوتر', dirP('M', mx, my)],
        ['و الشعاع نصف الوتر', 'BC/2 = ' + ray],
        ['النتيجة', 'المثلّث ABC قائم في A، و دائرته المحيطة مركزها M'
                  + co(mx, my) + ' و شعاعها ' + ray]
      ],
      { points: { A: P(xa, ya), B: P(B[0], B[1]), C: P(C[0], C[1]),
                  M: ['milieu', 'B', 'C'] },
        faits: [['rectangle-en', 'A', 'B', 'C'], ['milieu', 'M', 'B', 'C'],
                ['longueur', 'B', 'C', bc], ['longueur', 'M', 'A', ray],
                ['longueur', 'M', 'B', ray],
                ['longueur-carree', 'A', 'B', n(ab2)],
                ['longueur-carree', 'A', 'C', n(ac2)]] });
  }

  const API = {
    milieux:      () => cinq(unMilieu),
    symetriques:  () => cinq(unSymetrique),
    distances:    () => cinq(uneDistance),
    natures:      () => cinq(uneNature),
    alignements:  () => cinq(unAlignement),
    directions:   () => cinq(uneDirection),
    quatriemes:   () => cinq(unQuatrieme),
    cercles:      () => cinq(unCercle)
  };
  if (M) module.exports = API; else racine.Familles = API;
})(typeof window !== 'undefined' ? window : globalThis);
