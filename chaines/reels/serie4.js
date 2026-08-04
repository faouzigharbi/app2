// Exercices 10 à 13 de la fiche « العمليات في مجموعة الأعداد الحقيقية —
// تمارين شاملة » : rendre un dénominateur rationnel, puis trois exercices bâtis
// sur des couples de nombres inverses.
//
// Même méthode que les autres fichiers (voir ../METHODE.md).
//
//   10 : le seul geste est le CONJUGUÉ, et les trois réponses sont si nettes
//        (√r, -√s, 0) que l'élève voit tout de suite s'il s'est trompé. La
//        troisième ne demande même pas de conjugué : numérateur et dénominateur
//        partagent (g - √r), et le quotient vaut la fraction qu'on lui retire.
//   11 : a = √r + j et b = √r - j avec j² = r - 1, donc ab = 1.
//   12 : E = √r(√r + m) et F = √r, donc E/F = √r + m — encore un inverse.
//   13 : a = u - v√w et b = u + v√w avec u² - v²w = 1 (Pell). La question 2 est
//        un piège de patience : les deux grands numérateurs N et N+1 sont
//        choisis pour que les √w se détruisent exactement.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;
  const { rat, num, S, sAdd, sSub, sNeg, sMul, sSqrt, sTxt, ent, choix } = F;

  const R = (c, r) => (c === 1 ? '√' + r : c + '√' + r);
  const carre = n => n * n;
  const LIBRES = [2, 3, 5, 6, 7, 10, 11, 13, 15];

  // =========================================================================
  // EXERCICE 10 — « كتابات كسرية خالية مقاماتها من الجذور التربيعية ».
  // =========================================================================
  function type10() {
    // a = (p√r - r)/(p - √r) : le numérateur EST √r(p - √r), donc a = √r.
    // Le conjugué y mène aussi, et c'est le chemin que suit la chaîne.
    const r = choix(LIBRES), p = ent(2, 6);
    // b = √s/(u - v√w) : (u + v√w)/t = t√s/(u² - v²w)
    const s = choix(LIBRES);
    let u, v, w, d;
    for (let i = 0; ; i++) {
      u = ent(1, 5); v = ent(1, 3); w = choix(LIBRES);
      d = carre(u) - carre(v) * w;
      // |d| >= 2 : avec |d| = 1 le second facteur s'écrirait « (u + v√w)/1 »,
      // une barre de fraction qui ne divise rien.
      if (Math.abs(d) >= 2 && Math.abs(d) <= 3) break;
      if (i > 400) return type10();
    }
    const t = Math.abs(d);
    // c = (g√r2 - r2)/(h g - h√r2) - √r2/h : les deux morceaux sont égaux.
    const r2 = choix(LIBRES), g = ent(2, 5), h = ent(2, 9);
    if (carre(p) === r || carre(g) === r2 || carre(u) === carre(v) * w) return type10();

    const exprA = '(' + R(p, r) + ' - ' + r + ')/(' + p + ' - √' + r + ')';
    const exprB = '√' + s + '/(' + u + ' - ' + R(v, w) + ') : (' + u + ' + '
                + R(v, w) + ')/' + t;
    const exprC = '(' + R(g, r2) + ' - ' + r2 + ')/(' + h * g + ' - ' + R(h, r2)
                + ') - √' + r2 + '/' + h;
    const valA = sSqrt(num(r));
    const valB = d > 0 ? sSqrt(num(s)) : sNeg(sSqrt(num(s)));
    const conj = carre(p) - r;                        // (p - √r)(p + √r)

    const consigne = 'اكتب العبارة التالية في صيغة كتابة كسرية خال مقامها من الجذور التربيعية:';
    return [
      {
        enonce: [consigne, 'a = ' + exprA],
        indice: 'اضرب البسط و المقام في مرافق المقام: ' + p + ' + √' + r,
        etapes: [
          ['نضرب في مرافق المقام',
           '(' + p + ' - √' + r + ')(' + p + ' + √' + r + ') = ' + carre(p) + ' - '
           + r + ' = ' + conj],
          ['ننشر البسط',
           '(' + R(p, r) + ' - ' + r + ')(' + p + ' + √' + r + ') = '
           + sTxt(sMul(sSub(S(rat(p), r), num(r)), sAdd(num(p), sSqrt(num(r)))))],
          ['نبسّط الكسر',
           sTxt(sMul(sSub(S(rat(p), r), num(r)), sAdd(num(p), sSqrt(num(r)))))
           + '/' + conj + ' = √' + r],
          ['النتيجة', 'a = ' + sTxt(valA)]
        ],
        controle: { env: { a: exprA }, claims: [['a', sTxt(valA)]] }
      },
      {
        enonce: [consigne, 'b = ' + exprB],
        indice: 'القسمة على كسر هي الضرب في مقلوبه، ثمّ استعمل المرافق',
        etapes: [
          ['قسمة كسر على كسر', 'القسمة على كسر هي الضرب في مقلوبه'],
          ['نقلب الكسر الثاني',
           exprB + ' = √' + s + '/(' + u + ' - ' + R(v, w) + ') × ' + t + '/('
           + u + ' + ' + R(v, w) + ')'],
          ['نضرب المقامين',
           '(' + u + ' - ' + R(v, w) + ')(' + u + ' + ' + R(v, w) + ') = '
           + carre(u) + ' - ' + carre(v) * w + ' = ' + d],
          ['نضرب البسطين', '√' + s + ' × ' + t + ' = ' + R(t, s)],
          ['نبسّط الكسر', R(t, s) + '/(' + d + ') = ' + sTxt(valB)],
          ['النتيجة', 'b = ' + sTxt(valB)]
        ],
        controle: { env: { b: exprB }, claims: [['b', sTxt(valB)]] }
      },
      {
        enonce: [consigne, 'c = ' + exprC],
        indice: 'لا حاجة للمرافق هنا: البسط و المقام يشتركان في (' + g + ' - √'
                + r2 + ')',
        etapes: [
          ['نفكّك البسط',
           R(g, r2) + ' - ' + r2 + ' = √' + r2 + '(' + g + ' - √' + r2 + ')'],
          ['نفكّك المقام',
           h * g + ' - ' + R(h, r2) + ' = ' + h + '(' + g + ' - √' + r2 + ')'],
          ['نبسّط الكسر الأوّل',
           '(' + R(g, r2) + ' - ' + r2 + ')/(' + h * g + ' - ' + R(h, r2)
           + ') = √' + r2 + '/' + h],
          ['نطرح', '√' + r2 + '/' + h + ' - √' + r2 + '/' + h + ' = 0'],
          ['النتيجة', 'c = 0']
        ],
        controle: { env: { c: exprC }, claims: [['c', '0']] }
      }
    ];
  }

  // =========================================================================
  // EXERCICE 11 — a = √r + j, b = √r - j, avec j² = r - 1 donc a×b = 1.
  // =========================================================================
  function type11() {
    const j = ent(1, 4), r = carre(j) + 1;
    const k = ent(1, 3), c = k * r - j;
    const q = ent(1, 3), t = ent(2, 4), p = q * t + 1;
    if (c < 1 || carre(p) * r > 700 || carre(t) * r > 700) return type11();

    const a = sAdd(sSqrt(num(r)), num(j));
    const b = sSub(sSqrt(num(r)), num(j));
    const exprA = '√' + r + '(1 + ' + R(k, r) + ') - ' + c;
    const exprB = '√' + carre(p) * r + ' - ' + q + '√' + carre(t) * r + ' - ' + j;
    const exprC = '√' + r + '/a + ' + j + '/b';
    const env = { a: exprA, b: exprB, C: exprC };
    const valC = num(2 * r - 1);

    return [
      {
        enonce: ['نعتبر العبارتين:', 'a = ' + exprA, 'b = ' + exprB,
                 'بيّن أنّ a = ' + sTxt(a) + ' و b = ' + sTxt(b)],
        indice: 'انشر جداء a، و أخرج المربّعات الكاملة من جذري b',
        etapes: [
          ['ننشر جداء a', '√' + r + '(1 + ' + R(k, r) + ') = √' + r + ' + ' + k * r],
          ['نطرح الثابت', '√' + r + ' + ' + k * r + ' - ' + c + ' = ' + sTxt(a)],
          ['نتيجة a', 'a = ' + sTxt(a)],
          ['نبسّط جذر b الأوّل',
           '√' + carre(p) * r + ' = √(' + carre(p) + ' × ' + r + ') = ' + R(p, r)],
          ['نبسّط جذر b الثاني',
           q + '√' + carre(t) * r + ' = ' + q + '√(' + carre(t) + ' × ' + r
           + ') = ' + R(q * t, r)],
          ['نجمع حدّي √' + r, R(p, r) + ' - ' + R(q * t, r) + ' = √' + r],
          ['نتيجة b', 'b = ' + sTxt(b)]
        ],
        controle: { env, claims: [['a', sTxt(a)], ['b', sTxt(b)]] }
      },
      {
        enonce: ['بيّن أنّ a مقلوب b'],
        indice: 'استعمل المتطابقة (x + y)(x - y) = x^2 - y^2',
        etapes: [
          ['نكتب الجداء', 'a × b = (' + sTxt(a) + ')(' + sTxt(b) + ')'],
          ['نستعمل المتطابقة',
           '(' + sTxt(a) + ')(' + sTxt(b) + ') = (√' + r + ')^2 - ' + j + '^2'],
          ['نحسب المربّعين', '(√' + r + ')^2 - ' + j + '^2 = ' + r + ' - ' + carre(j)],
          ['نستنتج', r + ' - ' + carre(j) + ' = 1'],
          ['النتيجة', 'a × b = 1، إذن a مقلوب b']
        ],
        controle: { env, claims: [['a × b', '1'], ['a', '1/b']] }
      },
      {
        enonce: ['احسب العدد الحقيقي:', 'C = ' + exprC],
        indice: 'مقلوب a هو b، و مقلوب b هو a: القسمة تصير ضربا',
        etapes: [
          ['مقلوب a', '1/a = b'],
          ['مقلوب b', '1/b = a'],
          ['نعوّض', 'C = √' + r + ' b + ' + j + ' a'],
          ['ننشر',
           '√' + r + '(' + sTxt(b) + ') + ' + j + '(' + sTxt(a) + ') = '
           + sTxt(sMul(sSqrt(num(r)), b)) + ' + ' + sTxt(sMul(num(j), a))],
          ['نجمع', sTxt(sMul(sSqrt(num(r)), b)) + ' + ' + sTxt(sMul(num(j), a))
           + ' = ' + sTxt(valC)],
          ['النتيجة', 'C = ' + sTxt(valC)]
        ],
        controle: { env, claims: [['C', sTxt(valC)]] }
      }
    ];
  }

  // =========================================================================
  // EXERCICE 12 — E = √r(√r + m) et F = √r : le quotient E/F vaut √r + m, dont
  // l'inverse est √r - m dès que m² = r - 1.
  // =========================================================================
  function type12() {
    const m = ent(1, 4), r = carre(m) + 1;
    const fb = ent(2, 5), fc = ent(2, 4), fd = ent(2, 3);
    const fa = 1 - fb + fc * fd;
    if (fa < 2 || new Set([fa, fb, fc * fd]).size < 3) return type12();
    if ([carre(fa) * r, carre(fb) * r, carre(fd) * r].some(x => x > 700)) return type12();

    const E = sAdd(num(r), S(rat(m), r));              // r + m√r
    const Fv = sSqrt(num(r));                          // √r
    const exprE = '(√' + r + ' + 1)(√' + r + ' + ' + m + ') - (√' + r + ' + ' + m + ')';
    const exprF = '√' + carre(fa) * r + ' + √' + carre(fb) * r + ' - ' + fc + '√'
                + carre(fd) * r;
    const env = { E: exprE, F: exprF };
    const quot = sAdd(sSqrt(num(r)), num(m));          // E/F = √r + m

    return [
      {
        enonce: ['نعتبر العبارتين:', 'E = ' + exprE, 'F = ' + exprF,
                 'بيّن أنّ E = ' + sTxt(E) + ' و F = ' + sTxt(Fv)],
        indice: 'في E، العبارة (√' + r + ' + ' + m + ') عامل مشترك',
        etapes: [
          ['نضع العامل المشترك في E',
           'E = (√' + r + ' + ' + m + ')[(√' + r + ' + 1) - 1]'],
          ['نختصر ما بين المعقفين', '(√' + r + ' + 1) - 1 = √' + r],
          ['نتيجة E', 'E = √' + r + '(√' + r + ' + ' + m + ') = ' + sTxt(E)],
          ['نبسّط جذر F الأوّل',
           '√' + carre(fa) * r + ' = √(' + carre(fa) + ' × ' + r + ') = ' + R(fa, r)],
          ['نبسّط جذر F الثاني',
           '√' + carre(fb) * r + ' = √(' + carre(fb) + ' × ' + r + ') = ' + R(fb, r)],
          ['نبسّط جذر F الثالث',
           fc + '√' + carre(fd) * r + ' = ' + R(fc * fd, r)],
          ['نجمع حدود F',
           R(fa, r) + ' + ' + R(fb, r) + ' - ' + R(fc * fd, r) + ' = √' + r],
          ['نتيجة F', 'F = ' + sTxt(Fv)]
        ],
        controle: { env, claims: [['E', sTxt(E)], ['F', sTxt(Fv)]] }
      },
      {
        enonce: ['بيّن أنّ العددين E/F و (√' + r + ' - ' + m + ') مقلوبان'],
        indice: 'ابدأ بحساب النسبة E/F: البسط ينفكّ إلى √' + r + '(√' + r + ' + '
                + m + ')',
        etapes: [
          ['نكتب البسط جداء', 'E = √' + r + '(√' + r + ' + ' + m + ')'],
          ['نبسّط النسبة',
           'E/F = √' + r + '(√' + r + ' + ' + m + ')/√' + r + ' = ' + sTxt(quot)],
          ['نحسب الجداء',
           '(' + sTxt(quot) + ')(√' + r + ' - ' + m + ') = ' + r + ' - ' + carre(m)],
          ['نستنتج', r + ' - ' + carre(m) + ' = 1'],
          ['النتيجة', 'جداؤهما يساوي 1، إذن العددان مقلوبان']
        ],
        controle: {
          env,
          claims: [['E/F', sTxt(quot)],
                   ['(E/F)(√' + r + ' - ' + m + ')', '1']]
        }
      },
      {
        enonce: ['بيّن أنّ:', 'F - F/E = ' + m],
        indice: 'اكتب E جداء، ثمّ بسّط الكسر F/E قبل أن تُنطق المقام',
        etapes: [
          ['نكتب E جداء', 'E = √' + r + '(√' + r + ' + ' + m + ')'],
          ['نبسّط الكسر',
           'F/E = √' + r + '/(√' + r + '(√' + r + ' + ' + m + ')) = 1/(√' + r
           + ' + ' + m + ')'],
          ['نُنطق المقام',
           '1/(√' + r + ' + ' + m + ') = ' + sTxt(sSub(sSqrt(num(r)), num(m)))],
          ['نطرح',
           'F - F/E = √' + r + ' - (' + sTxt(sSub(sSqrt(num(r)), num(m))) + ')'],
          ['النتيجة', 'F - F/E = ' + m]
        ],
        controle: { env, claims: [['F - F/E', String(m)]] }
      }
    ];
  }

  // =========================================================================
  // EXERCICE 13 — a = u - v√w, b = u + v√w, avec u² - v²w = 1.
  // w doit être un produit s×t de deux entiers sans facteur carré, sans quoi
  // l'écriture « √s(c - v√t) » de l'énoncé n'aurait pas de sens.
  // =========================================================================
  const PELL13 = [[5, 2, 6, 2, 3], [4, 1, 15, 3, 5], [6, 1, 35, 5, 7], [15, 4, 14, 2, 7]];

  function type13() {
    const [u, v, w, s, t] = choix(PELL13);
    const c3 = ent(1, u - 1), c1 = u - c3;
    const bp = ent(1, 6), bq = ent(2, 4), be = ent(3, 9);
    const bf = bq * be - bp - v;
    const N = ent(500, 3000);
    if (bf < 1 || carre(be) * w > 1500 || carre(bf) * w > 1500) return type13();
    if (new Set([be, bf]).size < 2) return type13();

    const a = sSub(num(u), S(rat(v), w));
    const b = sAdd(num(u), S(rat(v), w));
    const exprA = c1 + ' + √' + s + '(' + c3 + ' - ' + R(v, t) + ') - ' + c3
                + '(√' + s + ' - 1)';
    const exprB = u + ' - ' + R(bp, w) + ' + ' + bq + '√' + carre(be) * w + ' - √'
                + carre(bf) * w;
    const exprC = R(v, w) + ' + ' + N + '/(' + sTxt(a) + ') + ' + (N + 1) + '/('
                + sTxt(b) + ')';
    const env = { a: exprA, b: exprB, c: exprC };
    const valC = num((2 * N + 1) * u);
    const dev = sAdd(sMul(num(N), b), sMul(num(N + 1), a));      // N·b + (N+1)·a

    return [
      {
        enonce: ['نعتبر العبارة التالية:', 'a = ' + exprA,
                 'بيّن أنّ a = ' + sTxt(a)],
        indice: 'انشر الجداءين: حدّا √' + s + ' يتقابلان',
        etapes: [
          ['ننشر الجداء الأوّل',
           '√' + s + '(' + c3 + ' - ' + R(v, t) + ') = ' + R(c3, s) + ' - ' + R(v, w)],
          ['ننشر الجداء الثاني',
           c3 + '(√' + s + ' - 1) = ' + R(c3, s) + ' - ' + c3],
          ['نطرح فيتلاشى √' + s,
           R(c3, s) + ' - ' + R(v, w) + ' - (' + R(c3, s) + ' - ' + c3 + ') = '
           + sTxt(sSub(num(c3), S(rat(v), w)))],
          ['نضيف الثابت',
           c1 + ' + ' + c3 + ' - ' + R(v, w) + ' = ' + sTxt(a)],
          ['النتيجة', 'a = ' + sTxt(a)]
        ],
        controle: { env, claims: [['a', sTxt(a)]] }
      },
      {
        enonce: ['نعتبر العبارة التالية:', 'b = ' + exprB,
                 'بيّن أنّ b = ' + sTxt(b)],
        indice: 'أخرج المربّعات الكاملة من تحت الجذرين، ثمّ اجمع حدود √' + w,
        etapes: [
          ['نبسّط الجذر الأوّل',
           bq + '√' + carre(be) * w + ' = ' + bq + '√(' + carre(be) + ' × ' + w
           + ') = ' + R(bq * be, w)],
          ['نبسّط الجذر الثاني',
           '√' + carre(bf) * w + ' = √(' + carre(bf) + ' × ' + w + ') = ' + R(bf, w)],
          ['نجمع حدود √' + w,
           '-' + R(bp, w) + ' + ' + R(bq * be, w) + ' - ' + R(bf, w) + ' = ' + R(v, w)],
          ['النتيجة', 'b = ' + sTxt(b)]
        ],
        controle: { env, claims: [['b', sTxt(b)]] }
      },
      {
        enonce: ['بيّن أنّ العددين a و b مقلوبان'],
        indice: 'استعمل المتطابقة (x - y)(x + y) = x^2 - y^2',
        etapes: [
          ['نكتب الجداء', 'a × b = (' + sTxt(a) + ')(' + sTxt(b) + ')'],
          ['نستعمل المتطابقة',
           '(' + sTxt(a) + ')(' + sTxt(b) + ') = ' + u + '^2 - (' + R(v, w) + ')^2'],
          ['نحسب المربّعين',
           u + '^2 - (' + R(v, w) + ')^2 = ' + carre(u) + ' - ' + carre(v) * w],
          ['نستنتج', carre(u) + ' - ' + carre(v) * w + ' = 1'],
          ['النتيجة', 'a × b = 1، إذن العددان مقلوبان']
        ],
        controle: { env, claims: [['a × b', '1'], ['a', '1/b']] }
      },
      {
        enonce: ['نعتبر العبارة التالية:', 'c = ' + exprC,
                 'بيّن أنّ c هو عدد صحيح طبيعي'],
        indice: 'مقلوب ' + sTxt(a) + ' هو ' + sTxt(b) + ': لا تنشر الكسور، عوّضها',
        etapes: [
          ['مقلوب المقام الأوّل', '1/(' + sTxt(a) + ') = ' + sTxt(b)],
          ['مقلوب المقام الثاني', '1/(' + sTxt(b) + ') = ' + sTxt(a)],
          ['نعوّض الكسرين',
           'c = ' + R(v, w) + ' + ' + N + '(' + sTxt(b) + ') + ' + (N + 1) + '('
           + sTxt(a) + ')'],
          ['ننشر الجداءين',
           N + '(' + sTxt(b) + ') + ' + (N + 1) + '(' + sTxt(a) + ') = ' + sTxt(dev)],
          ['يتلاشى الجذر', R(v, w) + ' + ' + sTxt(dev) + ' = ' + sTxt(valC)],
          ['النتيجة', 'c = ' + sTxt(valC)],
          ['طبيعة العدد', 'العدد ' + sTxt(valC) + ' عدد صحيح طبيعي']
        ],
        controle: { env, claims: [['c', sTxt(valC)]] }
      }
    ];
  }

  const API = { type10, type11, type12, type13, PELL13 };
  if (M) module.exports = API; else racine.Fiche4 = API;
})(typeof window !== 'undefined' ? window : globalThis);
