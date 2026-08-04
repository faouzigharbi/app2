// Fiche de révision « العمليات الأربعة في IR » — المدرسة الإعدادية النموذجية
// ضفاف البحيرة (فوزي الغربي).
//
// Elle n'est pas découpée en exercices numérotés mais en PARTIES ; chaque
// partie devient une page, et chaque question de la partie un volet. La méthode
// est décrite dans ../METHODE.md.
//
//   الجزء الأول  — 11 volets : trois calculs, un produit et sa déduction, une
//                  équation, trois réductions, une factorisation et son équation.
//   الجزء الثاني —  5 volets : deux nombres inverses, une valeur absolue avec π.
//   الجزء الثالث —  7 volets : une expression du second degré lue de trois
//                  façons — développée, factorisée, puis confrontée à une autre.
//
// Ce qui se tire : partout où l'exercice le supporte. Le fil commun des trois
// parties est un couple de nombres inverses (j + √u)(√u - j) = 1, donc
// u = j² + 1 ; on tire j et tout en découle. Deux choses en revanche ne peuvent
// pas bouger, et le commentaire les signale sur place : les entiers 3 et 4 de
// la partie 2 (ce sont les seuls qui encadrent π à une unité près) et la forme
// du couple (E, G) de la partie 3.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;
  const { rat, num, S, sAdd, sSub, sNeg, sMul, sSqrt, sTxt, plus, ent, choix } = F;

  const R = (c, r) => (c === 1 ? '√' + r : c + '√' + r);
  const carre = n => n * n;
  const LIBRES = [2, 3, 5, 6, 7, 10, 11, 13];
  const mono = (c, v) => (c === 1 ? v : c === -1 ? '-' + v : c + v);
  const frac = (n, d) => {
    const g = F.pgcd(Math.abs(n), d) || 1;
    return (d / g === 1) ? String(n / g) : (n / g) + '/' + (d / g);
  };
  const deux = liste => {
    const l = liste.slice();
    const a = l.splice(ent(0, l.length - 1), 1)[0];
    return [a, l[ent(0, l.length - 1)]];
  };

  // =========================================================================
  // الجزء الأول — E = j + √u et D = √u - j, avec u = j² + 1 donc E × D = 1.
  // =========================================================================
  function partie1() {
    const j = ent(2, 3), u = carre(j) + 1;              // u = 5 ou 10
    const aD = ent(2, 4), bD = choix(LIBRES.filter(x => x !== u));
    // C = √(2p²r / 2) - √(3q² / 3) + 2·√(u m² r)/√u
    const rC = choix(LIBRES), p = ent(2, 4), q = ent(3, 6), mC = ent(1, 3);
    // ب) √u/(√u - j) - k√u
    const kB = ent(2, 5);
    // ج) √(x² + e) = j2√u,  x² = j2²u - e = g²h
    const j2 = ent(2, 3);
    const g2 = ent(2, 4), h2 = choix(LIBRES);
    const e2 = j2 * j2 * u - g2 * g2 * h2;
    // د) L = 1/nL - eL ;  K = kK - x/rK - mK·sK·x - 1/nK
    const nL = ent(2, 4), eL = ent(2, 4), bL = choix(LIBRES), cL = choix(LIBRES);
    const rK = choix(LIBRES), kK = ent(2, 3), sK = choix(LIBRES), mK = ent(1, 3),
          nK = ent(2, 4);
    // ع) T = (aT x - √rT)(x + bT) - aT x √rT - aT bT √rT ;  T et cT(x + bT) opposés
    const aT = ent(2, 4), bT = ent(1, 3), rT = choix(LIBRES), cT = ent(2, 5);

    if (e2 < 1 || bL === cL || carre(mC) * u * rC > 900) return partie1();

    const E = sAdd(num(j), sSqrt(num(u)));
    const D = sSub(sSqrt(num(u)), num(j));
    const C = sSub(S(rat(p + 2 * mC), rC), num(q));
    const exprE = '1/√' + u + ' × (√' + carre(j) * u + ' + 1/√' + u + ') - (1/' + u
                + ' - √' + u + ')';
    const exprD = '(' + aD + '(√' + u + ' - ' + j + ') + √' + bD * u + ' - ' + R(j, bD)
                + ')/(' + aD + ' + √' + bD + ')';
    const exprC = '√(' + 2 * carre(p) * rC + '/2) - √(' + 3 * carre(q) + '/3) + 2(√'
                + u * carre(mC) * rC + '/√' + u + ')';
    const exprB = '√' + u + '/(√' + u + ' - ' + j + ') - ' + R(kB, u);
    const valB = sAdd(num(u), S(rat(j - kB), u));
    const exprEq = '√(x^2 + ' + e2 + ') = ' + R(j2, u);
    const solEq = R(g2, h2);
    const exprM = '(√' + bD * u + ' - ' + R(j, bD) + ')/√' + bD;
    const exprL = '1/' + nL + ' - √(' + eL * cL + '/' + bL + ') : (√' + cL + '/√'
                + eL * bL + ')';
    const valL = sSub(S(rat(1, nL)), num(eL));
    const exprK = '1/√' + rK + ' (√' + carre(kK) * rK + ' - x/√' + rK + ') - √' + sK
                + '(√' + carre(mK) * sK + 'x + 1/√' + carre(nK) * sK + ')';
    const cxK = sNeg(sAdd(S(rat(1, rK)), num(mK * sK)));
    const c0K = sSub(num(kK), S(rat(1, nK)));
    const devK = sTxt(c0K) + plus(cxK).replace(/ $/, '') + ' x';
    const exprT = '(' + mono(aT, 'x') + ' - √' + rT + ')(x + ' + bT + ') - '
                + mono(aT, 'x') + '√' + rT + ' - ' + R(aT * bT, rT);
    const facT = '(x + ' + bT + ')(' + mono(aT, 'x') + ' - ' + R(aT + 1, rT) + ')';
    const solT = '(' + R(aT + 1, rT) + ' - ' + cT + ')/' + aT;

    return [
      {
        enonce: ['أحسب العبارة التالية:', 'E = ' + exprE],
        indice: 'ابدأ بنشر القوس: 1/√' + u + ' × √' + carre(j) * u + ' = ' + j,
        etapes: [
          ['ننشر الجداء الأوّل',
           '1/√' + u + ' × √' + carre(j) * u + ' = √' + carre(j) * u + '/√' + u
           + ' = ' + j],
          ['ننشر الجداء الثاني', '1/√' + u + ' × 1/√' + u + ' = 1/' + u],
          ['نرفع القوس الثاني', '-(1/' + u + ' - √' + u + ') = -1/' + u + ' + √' + u],
          ['يتلاشى الكسر', '1/' + u + ' - 1/' + u + ' = 0'],
          ['النتيجة', 'E = ' + sTxt(E)]
        ],
        controle: { env: { E: exprE }, claims: [['E', sTxt(E)]] }
      },
      {
        enonce: ['أحسب العبارة التالية:', 'D = ' + exprD],
        indice: 'البسط يقبل (' + aD + ' + √' + bD + ') عاملا مشتركا',
        etapes: [
          ['نفكّك الحدّين الأخيرين',
           '√' + bD * u + ' - ' + R(j, bD) + ' = √' + bD + '(√' + u + ' - ' + j + ')'],
          ['نضع (√' + u + ' - ' + j + ') عاملا مشتركا',
           aD + '(√' + u + ' - ' + j + ') + √' + bD + '(√' + u + ' - ' + j
           + ') = (√' + u + ' - ' + j + ')(' + aD + ' + √' + bD + ')'],
          ['نبسّط الكسر',
           '(√' + u + ' - ' + j + ')(' + aD + ' + √' + bD + ')/(' + aD + ' + √' + bD
           + ') = √' + u + ' - ' + j],
          ['النتيجة', 'D = ' + sTxt(D)]
        ],
        controle: { env: { D: exprD }, claims: [['D', sTxt(D)]] }
      },
      {
        enonce: ['أحسب العبارة التالية:', 'C = ' + exprC],
        indice: 'ابدأ بتبسيط ما تحت كل جذر: ' + 2 * carre(p) * rC + '/2 = '
                + carre(p) * rC,
        etapes: [
          ['نبسّط الجذر الأوّل',
           '√(' + 2 * carre(p) * rC + '/2) = √' + carre(p) * rC + ' = ' + R(p, rC)],
          ['نبسّط الجذر الثاني', '√(' + 3 * carre(q) + '/3) = √' + carre(q) + ' = ' + q],
          ['نبسّط الحدّ الثالث',
           '√' + u * carre(mC) * rC + '/√' + u + ' = √' + carre(mC) * rC + ' = '
           + R(mC, rC)],
          ['نجمع حدود √' + rC,
           R(p, rC) + ' + ' + R(2 * mC, rC) + ' = ' + R(p + 2 * mC, rC)],
          ['النتيجة', 'C = ' + sTxt(C)]
        ],
        controle: { env: { C: exprC }, claims: [['C', sTxt(C)]] }
      },
      {
        enonce: ['أحسب الجداء:', 'E × D'],
        indice: 'استعمل المتطابقة (x + y)(x - y) = x^2 - y^2',
        etapes: [
          ['نعوّض بالقيمتين', 'E × D = (' + sTxt(E) + ')(' + sTxt(D) + ')'],
          ['نستعمل المتطابقة',
           '(' + sTxt(E) + ')(' + sTxt(D) + ') = (√' + u + ')^2 - ' + j + '^2'],
          ['نحسب المربّعين', '(√' + u + ')^2 - ' + j + '^2 = ' + u + ' - ' + carre(j)],
          ['النتيجة', 'E × D = 1']
        ],
        controle: {
          env: { E: exprE, D: exprD },
          claims: [['E × D', '1'], ['E', '1/D']]
        }
      },
      {
        enonce: ['استنتج حسابا للعدد:', exprB],
        indice: 'من E × D = 1 نستنتج أنّ مقلوب (√' + u + ' - ' + j + ') هو ' + sTxt(E),
        etapes: [
          ['نستعمل الجداء السابق',
           '1/(√' + u + ' - ' + j + ') = ' + sTxt(E)],
          ['نضرب في √' + u,
           '√' + u + '/(√' + u + ' - ' + j + ') = √' + u + '(' + sTxt(E) + ')'],
          ['ننشر', '√' + u + '(' + sTxt(E) + ') = ' + u + ' + ' + R(j, u)],
          ['نطرح', u + ' + ' + R(j, u) + ' - ' + R(kB, u) + ' = ' + sTxt(valB)],
          ['النتيجة', exprB + ' = ' + sTxt(valB)]
        ],
        controle: { claims: [[exprB, sTxt(valB)]] }
      },
      {
        enonce: ['أوجد العدد الحقيقي x بحيث:', exprEq],
        indice: 'ربّع الطرفين: √(x^2 + ' + e2 + ') يصير x^2 + ' + e2,
        etapes: [
          ['نربّع الطرفين', '(' + R(j2, u) + ')^2 = ' + carre(j2) * u],
          ['نكتب المعادلة بدون جذر', 'x^2 + ' + e2 + ' = ' + carre(j2) * u],
          ['ننقل الحدّ الثابت', 'x^2 = ' + (carre(j2) * u - e2)],
          ['نأخذ الجذر', '√' + (carre(j2) * u - e2) + ' = ' + solEq],
          ['نتحقّق', '√((' + solEq + ')^2 + ' + e2 + ') = ' + R(j2, u)],
          ['النتيجة', 'x = ' + solEq + ' أو x = -' + solEq]
        ],
        controle: {
          env: { x: solEq },
          claims: [['√(x^2 + ' + e2 + ')', R(j2, u)],
                   ['√((-' + solEq + ')^2 + ' + e2 + ')', R(j2, u)]]
        }
      },
      {
        enonce: ['أنشر و اختصر العبارة:', 'M = ' + exprM],
        indice: 'اقسم كل حدّ من البسط على √' + bD,
        etapes: [
          ['نقسم الحدّ الأوّل', '√' + bD * u + '/√' + bD + ' = √' + u],
          ['نقسم الحدّ الثاني', R(j, bD) + '/√' + bD + ' = ' + j],
          ['نطرح', 'M = √' + u + ' - ' + j],
          ['النتيجة', 'M = ' + sTxt(D)]
        ],
        controle: { env: { M: exprM }, claims: [['M', sTxt(D)]] }
      },
      {
        enonce: ['أنشر و اختصر العبارة:', 'L = ' + exprL],
        indice: 'القسمة على كسر هي الضرب في مقلوبه: الجذور تجتمع تحت جذر واحد',
        etapes: [
          ['نقلب الكسر الثاني',
           '√(' + eL * cL + '/' + bL + ') : (√' + cL + '/√' + eL * bL
           + ') = √(' + eL * cL + '/' + bL + ') × √' + eL * bL + '/√' + cL],
          ['نجمع تحت جذر واحد',
           '√(' + eL * cL + '/' + bL + ') × √' + eL * bL + '/√' + cL + ' = √('
           + eL * cL * eL * bL + '/' + bL * cL + ')'],
          ['نبسّط ما تحت الجذر',
           '√(' + eL * cL * eL * bL + '/' + bL * cL + ') = √' + carre(eL) + ' = ' + eL],
          ['نطرح', 'L = 1/' + nL + ' - ' + eL],
          ['النتيجة', 'L = ' + sTxt(valL)]
        ],
        controle: { env: { L: exprL }, claims: [['L', sTxt(valL)]] }
      },
      {
        enonce: ['أنشر و اختصر العبارة، حيث x عدد حقيقي:', 'K = ' + exprK],
        indice: '√' + carre(kK) * rK + '/√' + rK + ' = ' + kK + '، و √' + sK
                + ' × √' + carre(mK) * sK + ' = ' + mK * sK,
        etapes: [
          ['ننشر القوس الأوّل',
           '1/√' + rK + ' (√' + carre(kK) * rK + ' - x/√' + rK + ') = ' + kK
           + ' - x/' + rK],
          ['ننشر القوس الثاني',
           '√' + sK + '(√' + carre(mK) * sK + 'x + 1/√' + carre(nK) * sK + ') = '
           + mono(mK * sK, 'x') + ' + 1/' + nK],
          ['نطرح',
           'K = ' + kK + ' - x/' + rK + ' - ' + mono(mK * sK, 'x') + ' - 1/' + nK],
          ['نجمع حدود x',
           '-x/' + rK + ' - ' + mono(mK * sK, 'x') + ' = ' + sTxt(cxK) + ' x'],
          ['نجمع الأعداد', kK + ' - 1/' + nK + ' = ' + sTxt(c0K)],
          ['النتيجة', 'K = ' + devK]
        ],
        controle: {
          libres: ['x'], derives: { K: exprK },
          claims: [[exprK, devK]]
        }
      },
      {
        enonce: ['أكتب العبارة في صيغة جداء عوامل، حيث x عدد حقيقي:', 'T = ' + exprT],
        indice: 'الحدّان الأخيران يقبلان ' + R(aT, rT) + ' عاملا مشتركا',
        etapes: [
          ['نفكّك الحدّين الأخيرين',
           '-' + mono(aT, 'x') + '√' + rT + ' - ' + R(aT * bT, rT) + ' = -' + R(aT, rT)
           + '(x + ' + bT + ')'],
          ['نعيد كتابة T',
           'T = (' + mono(aT, 'x') + ' - √' + rT + ')(x + ' + bT + ') - ' + R(aT, rT)
           + '(x + ' + bT + ')'],
          ['نضع (x + ' + bT + ') عاملا مشتركا',
           'T = (x + ' + bT + ')((' + mono(aT, 'x') + ' - √' + rT + ') - ' + R(aT, rT) + ')'],
          ['نجمع حدود √' + rT,
           '-√' + rT + ' - ' + R(aT, rT) + ' = -' + R(aT + 1, rT)],
          ['النتيجة', 'T = ' + facT]
        ],
        controle: {
          libres: ['x'], derives: { T: exprT },
          claims: [[exprT, facT]]
        }
      },
      {
        enonce: ['أوجد الأعداد الحقيقية x التي تحقّق أنّ T و ' + mono(cT, 'x') + ' + '
                 + cT * bT + ' متقابلان'],
        indice: 'متقابلان يعني مجموعهما معدوم، و ' + mono(cT, 'x') + ' + ' + cT * bT
                + ' = ' + cT + '(x + ' + bT + ')',
        etapes: [
          ['شرط التقابل', 'T + (' + mono(cT, 'x') + ' + ' + cT * bT + ') = 0'],
          ['نفكّك الحدّ الثاني',
           mono(cT, 'x') + ' + ' + cT * bT + ' = ' + cT + '(x + ' + bT + ')'],
          ['نضع (x + ' + bT + ') عاملا مشتركا',
           facT + ' + ' + cT + '(x + ' + bT + ') = (x + ' + bT + ')(' + mono(aT, 'x')
           + ' - ' + R(aT + 1, rT) + ' + ' + cT + ')'],
          ['جداء معدوم',
           'يعني x + ' + bT + ' = 0 أو ' + mono(aT, 'x') + ' - ' + R(aT + 1, rT)
           + ' + ' + cT + ' = 0'],
          ['الحلّ الأوّل', 'x = -' + bT],
          // La seconde racine ne peut pas s'écrire « x = … » : x est lié à la
          // première, qui seule vérifie ce membre. On la mène donc en nombres.
          ['الحلّ الثاني يحقّق العامل',
           aT + ' × (' + solT + ') - ' + R(aT + 1, rT) + ' + ' + cT + ' = 0'],
          ['النتيجة', 'x = -' + bT + ' أو x = ' + solT]
        ],
        controle: {
          env: { x: '-' + bT, T: exprT },
          claims: [['T + (' + mono(cT, 'x') + ' + ' + cT * bT + ')', '0']]
        }
      }
    ];
  }

  // =========================================================================
  // الجزء الثاني — z = u + √w et y = u - √w, avec w = u² - 1 donc z × y = 1.
  //
  // Les entiers 4 et 3 de la valeur absolue NE PEUVENT PAS bouger : ce sont les
  // seuls entiers consécutifs qui encadrent π, et tout l'exercice tient à
  // |4 - π| + |3 - π| = 1. Le validateur lie donc π à un rationnel de ]3 ; 4[ —
  // une valeur y suffit, puisque c'est cet encadrement, et lui seul, que les
  // étapes utilisent.
  // =========================================================================
  function partie2() {
    const u = choix([2, 4, 6]), w = carre(u) - 1;       // 3, 15, 35 — sans facteur carré
    const [p, q] = (() => { const [a, b] = deux(LIBRES); return a < b ? [a, b] : [b, a]; })();
    // z = u + c1√(k1²w) - √(k2²w) - √(k3²w),  c1k1 - k2 - k3 = 1
    const k1 = ent(2, 3), k2 = ent(2, 4), c1 = ent(3, 6);
    const k3 = c1 * k1 - k2 - 1;
    // y = d1√(m1²w) - d2√(m2²w) + √(u²) - d3√w + d4√(m3²w),  somme des coefficients = -1
    const m1 = ent(2, 3), d1 = ent(2, 3), m2 = ent(4, 5), d2 = ent(2, 3),
          d3 = ent(3, 6), m3 = ent(2, 3), d4 = ent(3, 5);
    const reste = d1 * m1 - d2 * m2 - d3 + d4 * m3;
    if (k3 < 2 || reste !== -1) return partie2();
    if ([k1, k2, k3, m1, m2, m3].some(k => carre(k) * w > 900)) return partie2();

    const z = sAdd(num(u), sSqrt(num(w)));
    const y = sSub(num(u), sSqrt(num(w)));
    const t = sSub(num(1), sSqrt(num(p)));
    const exprZ = u + ' + ' + c1 + '√' + carre(k1) * w + ' - √' + carre(k2) * w
                + ' - √' + carre(k3) * w;
    const exprY = d1 + '√' + carre(m1) * w + ' - ' + d2 + '√' + carre(m2) * w + ' + √'
                + carre(u) + ' - ' + R(d3, w) + ' + ' + d4 + '√' + carre(m3) * w;
    const exprT = '|4 - π| + |3 - π| + |√' + p + ' - √' + q + '| - |-√' + q + '|';
    const exprF = '|t y| + z + √' + p * w;
    const valF = sAdd(S(rat(2), w), S(rat(u), p));      // 2√w + u√p
    const num3 = ent(2, 5);
    let num2 = ent(2, 5);
    if (num2 === num3) num2 = num3 + 1;
    const exprQ2 = num3 + '/z - ' + num2 + '/y';
    const valQ2 = sSub(sMul(num(num3), y), sMul(num(num2), z));
    // π lié dans ]3 ; 4[ — c'est la seule chose que l'exercice demande de lui.
    const env = { 'π': '22/7', z: exprZ, y: exprY, t: exprT };

    return [
      {
        enonce: ['نعتبر العددين:', 'z = ' + exprZ, 'y = ' + exprY,
                 'بيّن أنّ z = ' + sTxt(z) + ' و y = ' + sTxt(y)],
        indice: 'أخرج المربّعات الكاملة من تحت كل جذر، ثمّ اجمع حدود √' + w,
        etapes: [
          ['نبسّط جذور z',
           c1 + '√' + carre(k1) * w + ' = ' + R(c1 * k1, w)],
          ['نبسّط الجذرين الآخرين في z',
           '√' + carre(k2) * w + ' + √' + carre(k3) * w + ' = ' + R(k2 + k3, w)],
          ['نجمع حدود √' + w + ' في z',
           R(c1 * k1, w) + ' - ' + R(k2 + k3, w) + ' = √' + w],
          ['نتيجة z', 'z = ' + sTxt(z)],
          ['نبسّط الجذر العددي في y', '√' + carre(u) + ' = ' + u],
          ['نبسّط جذور y',
           d1 + '√' + carre(m1) * w + ' - ' + d2 + '√' + carre(m2) * w + ' + ' + d4
           + '√' + carre(m3) * w + ' = ' + R(d1 * m1 - d2 * m2 + d4 * m3, w)],
          ['نجمع حدود √' + w + ' في y',
           R(d1 * m1 - d2 * m2 + d4 * m3, w) + ' - ' + R(d3, w) + ' = -√' + w],
          ['نتيجة y', 'y = ' + sTxt(y)]
        ],
        controle: { env, claims: [['z', sTxt(z)], ['y', sTxt(y)]] }
      },
      {
        enonce: ['بيّن أنّ y هو مقلوب z'],
        indice: 'استعمل المتطابقة (x + y)(x - y) = x^2 - y^2',
        etapes: [
          ['نكتب الجداء', 'z × y = (' + sTxt(z) + ')(' + sTxt(y) + ')'],
          ['نستعمل المتطابقة',
           '(' + sTxt(z) + ')(' + sTxt(y) + ') = ' + u + '^2 - (√' + w + ')^2'],
          ['نحسب المربّعين', u + '^2 - (√' + w + ')^2 = ' + carre(u) + ' - ' + w],
          ['نستنتج', carre(u) + ' - ' + w + ' = 1'],
          ['النتيجة', 'z × y = 1، إذن y مقلوب z']
        ],
        controle: { env, claims: [['z × y', '1'], ['y', '1/z']] }
      },
      {
        enonce: ['أحسب:', exprQ2],
        indice: 'مقلوب z هو y، و مقلوب y هو z: لا حاجة لتوحيد المقامين',
        etapes: [
          ['مقلوب z', '1/z = y'],
          ['مقلوب y', '1/y = z'],
          ['نعوّض', exprQ2 + ' = ' + num3 + ' y - ' + num2 + ' z'],
          ['ننشر',
           num3 + '(' + sTxt(y) + ') - ' + num2 + '(' + sTxt(z) + ') = ' + sTxt(valQ2)],
          ['النتيجة', exprQ2 + ' = ' + sTxt(valQ2)]
        ],
        controle: { env, claims: [[exprQ2, sTxt(valQ2)]] }
      },
      {
        enonce: ['اختصر العبارة:', 't = ' + exprT],
        indice: 'العدد π محصور بين 3 و 4: حدّد إشارة كل عبارة قبل رفع قيمتها المطلقة',
        // Le SIGNE et la LEVÉE sont deux étapes distinctes, et toutes deux
        // portent une relation. Rédigées en une seule phrase arabe, elles
        // échapperaient au validateur — qui saute les étapes de cadrage.
        etapes: [
          ['نحصر π', 'العدد π محصور بين 3 و 4'],
          ['إشارة العبارة الأولى', 'π < 4'],
          ['نرفع القيمة المطلقة الأولى', '|4 - π| = 4 - π'],
          ['إشارة العبارة الثانية', 'π > 3'],
          ['نرفع القيمة المطلقة الثانية', '|3 - π| = π - 3'],
          ['يتلاشى π', '(4 - π) + (π - 3) = 1'],
          ['نرفع القيمتين الأخيرتين',
           '|√' + p + ' - √' + q + '| - |-√' + q + '| = (√' + q + ' - √' + p
           + ') - √' + q],
          ['نختصر', '(√' + q + ' - √' + p + ') - √' + q + ' = -√' + p],
          ['النتيجة', 't = ' + sTxt(t)]
        ],
        controle: { env, claims: [['t', sTxt(t)]] }
      },
      {
        enonce: ['أحسب:', exprF],
        indice: 'ابدأ بالجداء t y، ثمّ حدّد إشارته قبل رفع القيمة المطلقة',
        etapes: [
          ['نكتب الجداء', 't y = (' + sTxt(t) + ')(' + sTxt(y) + ')'],
          ['إشارة العاملين',
           't سالب لأنّ √' + p + ' > 1، و y موجب لأنّ ' + u + ' > √' + w],
          ['إشارة الجداء', 'موجب في سالب يعطي سالبا، إذن t y < 0'],
          ['نرفع القيمة المطلقة', '|t y| = -(' + sTxt(t) + ')(' + sTxt(y) + ')'],
          ['ننشر',
           '-(' + sTxt(t) + ')(' + sTxt(y) + ') = ' + sTxt(sNeg(sMul(t, y)))],
          ['نجمع مع z و √' + p * w,
           sTxt(sNeg(sMul(t, y))) + ' + (' + sTxt(z) + ') + √' + p * w + ' = '
           + sTxt(valF)],
          ['النتيجة', exprF + ' = ' + sTxt(valF)]
        ],
        controle: { env, claims: [[exprF, sTxt(valF)]] }
      }
    ];
  }

  // =========================================================================
  // الجزء الثالث — E = (a x - b)(-c x - b) et G = (x + g)(a x - b).
  //
  // Les deux partagent le facteur (a x - b), et c'est ce qui permet de répondre
  // aux questions 4 et 5)ج sans jamais développer. L'écriture longue de E est
  // reconstruite à partir de (a, b, c) : le terme constant impose R = b(b+1),
  // les autres coefficients suivent.
  // =========================================================================
  function partie3() {
    const a = ent(2, 4), b = ent(2, 5), c = ent(5, 8), Sc = ent(8, 20);
    const g = ent(3, 8);
    const Rc = b * (b + 1);
    const P = -a * c - a + 2 * Sc;
    const Q = a - b + 2 * Rc - Sc - b * (c - a);
    const m = ent(2, 4), n = choix(LIBRES);
    const h1 = ent(2, 6), h2 = ent(1, 3);
    if (P < 1 || Q < 1 || h1 % h2 || h1 / h2 < 2) return partie3();
    if (b === g || (b - g) % (1 - c)) return partie3();

    const k = h1 / h2;                                   // E = k(a x - b)
    const exprE = '(' + mono(a, 'x') + ' - ' + b + ')(x + 1) + ' + mono(P, 'x^2')
                + ' - ' + mono(Q, 'x') + ' + (2x + 1)(' + Rc + ' - ' + mono(Sc, 'x') + ')';
    const devE = mono(-a * c, 'x^2') + ' + ' + mono(b * (c - a), 'x') + ' + ' + carre(b);
    const facE = '(' + mono(a, 'x') + ' - ' + b + ')(' + mono(-c, 'x') + ' - ' + b + ')';
    const x0 = m + ' - √' + n;
    const valE = sAdd(sAdd(sMul(num(-a * c), F.sPuis(F.analyser(x0, {}), 2)),
                           sMul(num(b * (c - a)), F.analyser(x0, {}))), num(carre(b)));
    const exprG = mono(a, 'x^2') + ' + ' + mono(a * g - b, 'x') + ' - ' + b * g;
    const scindG = mono(a, 'x^2') + ' + ' + mono(a * g, 'x') + ' - ' + mono(b, 'x')
                 + ' - ' + b * g;
    const facG = '(x + ' + g + ')(' + mono(a, 'x') + ' - ' + b + ')';
    const sol1 = frac(b, a);
    const sol4 = frac(-(b + k), c);
    const sol5 = frac(b - g, 1 - c);

    return [
      {
        enonce: ['نعتبر العبارة، حيث x عدد حقيقي:', 'E = ' + exprE,
                 'أنشر و اختصر العبارة E'],
        indice: 'انشر الجداءين، ثمّ اجمع حدود x^2 و حدود x و الأعداد',
        etapes: [
          ['ننشر الجداء الأوّل',
           '(' + mono(a, 'x') + ' - ' + b + ')(x + 1) = ' + mono(a, 'x^2') + ' + '
           + mono(a - b, 'x') + ' - ' + b],
          ['ننشر الجداء الثاني',
           '(2x + 1)(' + Rc + ' - ' + mono(Sc, 'x') + ') = ' + mono(-2 * Sc, 'x^2')
           + ' + ' + mono(2 * Rc - Sc, 'x') + ' + ' + Rc],
          ['نجمع حدود x^2',
           mono(a, 'x^2') + ' + ' + mono(P, 'x^2') + ' + ' + mono(-2 * Sc, 'x^2')
           + ' = ' + mono(-a * c, 'x^2')],
          ['نجمع حدود x',
           mono(a - b, 'x') + ' - ' + mono(Q, 'x') + ' + ' + mono(2 * Rc - Sc, 'x')
           + ' = ' + mono(b * (c - a), 'x')],
          ['نجمع الأعداد', '-' + b + ' + ' + Rc + ' = ' + carre(b)],
          ['النتيجة', 'E = ' + devE]
        ],
        controle: {
          libres: ['x'], derives: { E: exprE },
          claims: [[exprE, devE]]
        }
      },
      {
        enonce: ['أحسب E إذا علمت أنّ:', 'x = ' + x0],
        indice: 'استعمل الشكل المنشور، و تذكّر أنّ (' + x0 + ')^2 = '
                + sTxt(F.sPuis(F.analyser(x0, {}), 2)),
        etapes: [
          ['نحسب المربّع',
           '(' + x0 + ')^2 = ' + sTxt(F.sPuis(F.analyser(x0, {}), 2))],
          ['نضرب في المعامل الأوّل',
           mono(-a * c, '') + ' × (' + sTxt(F.sPuis(F.analyser(x0, {}), 2)) + ') = '
           + sTxt(sMul(num(-a * c), F.sPuis(F.analyser(x0, {}), 2)))],
          ['نضرب في المعامل الثاني',
           b * (c - a) + '(' + x0 + ') = '
           + sTxt(sMul(num(b * (c - a)), F.analyser(x0, {})))],
          ['نجمع مع الحدّ الثابت',
           sTxt(sMul(num(-a * c), F.sPuis(F.analyser(x0, {}), 2))) + ' + '
           + sTxt(sMul(num(b * (c - a)), F.analyser(x0, {}))) + ' + ' + carre(b)
           + ' = ' + sTxt(valE)],
          ['النتيجة', 'E = ' + sTxt(valE)]
        ],
        controle: { env: { x: x0, E: exprE }, claims: [['E', sTxt(valE)]] }
      },
      {
        enonce: ['بيّن أنّ:', 'E = ' + facE],
        indice: 'انشر الجداء ' + facE + ' و قارنه بالشكل المنشور لـ E',
        etapes: [
          ['ننشر الجداء',
           facE + ' = ' + mono(-a * c, 'x^2') + ' - ' + mono(a * b, 'x') + ' + '
           + mono(b * c, 'x') + ' + ' + carre(b)],
          ['نجمع حدود x',
           '-' + mono(a * b, 'x') + ' + ' + mono(b * c, 'x') + ' = '
           + mono(b * (c - a), 'x')],
          ['نقارن بالشكل المنشور', devE + ' = E'],
          ['النتيجة', 'E = ' + facE]
        ],
        controle: {
          libres: ['x'], derives: { E: exprE },
          claims: [[facE, devE], [exprE, facE]]
        }
      },
      {
        enonce: ['أوجد x إذا علمت أنّ E و ' + mono(a, 'x') + ' - ' + b
                 + ' متناسبان طردا مع ' + h1 + ' و ' + h2],
        indice: 'التناسب يعني E/' + h1 + ' = (' + mono(a, 'x') + ' - ' + b + ')/' + h2
                + '، أي E = ' + k + '(' + mono(a, 'x') + ' - ' + b + ')',
        etapes: [
          ['نكتب شرط التناسب',
           'E = ' + k + '(' + mono(a, 'x') + ' - ' + b + ')'],
          ['نستعمل الشكل المفكّك',
           facE + ' = ' + k + '(' + mono(a, 'x') + ' - ' + b + ')'],
          ['ننقل و نضع العامل المشترك',
           '(' + mono(a, 'x') + ' - ' + b + ')(' + mono(-c, 'x') + ' - ' + b + ' - '
           + k + ') = 0'],
          ['جداء معدوم',
           'يعني ' + mono(a, 'x') + ' - ' + b + ' = 0 أو ' + mono(-c, 'x') + ' - '
           + b + ' - ' + k + ' = 0'],
          ['الحلّ الأوّل', 'x = ' + sol1],
          ['الحلّ الثاني يحقّق العامل',
           '-' + c + ' × (' + sol4 + ') - ' + b + ' - ' + k + ' = 0'],
          ['النتيجة', 'x = ' + sol1 + ' أو x = ' + sol4]
        ],
        controle: {
          env: { x: sol1, E: exprE },
          claims: [['E', k + '(' + mono(a, 'x') + ' - ' + b + ')'],
                   ['-' + c + ' × (' + sol4 + ') - ' + b + ' - ' + k, '0']]
        }
      },
      {
        enonce: ['لتكن العبارة:', 'G = ' + exprG, 'بيّن أنّ G = ' + scindG],
        indice: 'يكفي أن تتحقّق من أنّ ' + a * g + 'x - ' + b + 'x = '
                + mono(a * g - b, 'x'),
        etapes: [
          ['نشقّ حدّ x', mono(a * g - b, 'x') + ' = ' + mono(a * g, 'x') + ' - '
           + mono(b, 'x')],
          ['نعوّض في G', 'G = ' + scindG],
          ['نتحقّق من حدّ x', mono(a * g, 'x') + ' - ' + mono(b, 'x') + ' = '
           + mono(a * g - b, 'x')],
          ['النتيجة', exprG + ' = ' + scindG]
        ],
        controle: {
          libres: ['x'], derives: { G: exprG },
          claims: [[exprG, scindG]]
        }
      },
      {
        enonce: ['أكتب G في صيغة جداء عوامل، دون الالتجاء إلى النشر'],
        indice: 'انطلق من الشكل المشقوق: أوّل حدّين يقبلان ' + mono(a, 'x')
                + ' عاملا مشتركا',
        etapes: [
          ['نفكّك الحدّين الأوّلين',
           mono(a, 'x^2') + ' + ' + mono(a * g, 'x') + ' = ' + mono(a, 'x') + '(x + '
           + g + ')'],
          ['نفكّك الحدّين الأخيرين',
           '-' + mono(b, 'x') + ' - ' + b * g + ' = -' + b + '(x + ' + g + ')'],
          ['نضع (x + ' + g + ') عاملا مشتركا',
           mono(a, 'x') + '(x + ' + g + ') - ' + b + '(x + ' + g + ') = ' + facG],
          ['النتيجة', 'G = ' + facG]
        ],
        controle: {
          libres: ['x'], derives: { G: exprG },
          claims: [[exprG, facG]]
        }
      },
      {
        enonce: ['أوجد x بحيث يكون E هو مقابل G'],
        indice: 'مقابل يعني E + G = 0، و العبارتان تتقاسمان العامل ('
                + mono(a, 'x') + ' - ' + b + ')',
        etapes: [
          ['شرط التقابل', 'E + G = 0'],
          ['نستعمل الشكلين المفكّكين', 'E + G = ' + facE + ' + ' + facG],
          ['نضع العامل المشترك',
           facE + ' + ' + facG + ' = (' + mono(a, 'x') + ' - ' + b + ')(('
           + mono(-c, 'x') + ' - ' + b + ') + (x + ' + g + '))'],
          ['نختصر القوس الثاني',
           '(' + mono(-c, 'x') + ' - ' + b + ') + (x + ' + g + ') = '
           + mono(1 - c, 'x') + ' + ' + (g - b)],
          ['جداء معدوم',
           'يعني ' + mono(a, 'x') + ' - ' + b + ' = 0 أو ' + mono(1 - c, 'x') + ' + '
           + (g - b) + ' = 0'],
          ['الحلّان', 'x = ' + sol1 + ' أو x = ' + sol5],
          ['نتحقّق من الحلّ الأوّل', 'E + G = 0']
        ],
        controle: {
          env: { x: sol1, E: exprE, G: exprG },
          claims: [['E + G', '0'],
                   ['(' + (1 - c) + ') × (' + sol5 + ') + ' + (g - b), '0']]
        }
      }
    ];
  }

  const API = { partie1, partie2, partie3 };
  if (M) module.exports = API; else racine.Revision = API;
})(typeof window !== 'undefined' ? window : globalThis);
