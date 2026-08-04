// Les trois exercices de la fiche « العمليات في مجموعة الأعداد الحقيقية —
// تمارين شاملة » (17, 18, 19), portés en chaînes de démonstration.
//
// Une page par EXERCICE, et dans la page autant de volets que l'énoncé a de
// questions — le 17 en a 4 (1, 2a, 2b, 3), le 18 en a 5, le 19 en a 5. Chaque
// volet porte SA chaîne : l'élève remet les étapes dans l'ordre.
//
// Les nombres se retirent à chaque chargement, mais jamais au hasard : la
// STRUCTURE de la fiche est conservée, seuls ses paramètres bougent, et ils ne
// bougent que là où l'exercice le supporte.
//
//   — Exercice 17 : entièrement paramétrable. « 26/5 » n'est que « 5 + 1/5 »,
//     et n'importe quel entier ferait l'affaire.
//
//   — Exercice 18 : tout repose sur A × B = 1 avec A = u + v√r et B = u - v√r,
//     c'est-à-dire sur u² - r v² = 1 — l'équation de Pell. On ne tire donc pas
//     (u, v, r) au hasard : on choisit dans une liste de solutions, sans quoi
//     l'énoncé « A مقلوب B » serait faux. Le reste de l'exercice (l'écriture de
//     A en radicaux, celle de B, de E, de F, la constante de D) se recalcule à
//     partir de (u, v, r) par des identités démontrées en commentaire.
//
//   — Exercice 19 : a et b y sont CONTRAINTS. « a - b et -2ab sont opposés »
//     impose a - b = 2, et « ab = 1 » impose alors a = 1 + √2, b = √2 - 1 ; la
//     question 4b, elle, impose √8. Ces nombres-là ne peuvent pas bouger. Ce
//     qui bouge, c'est l'HABILLAGE : les quatre écritures en radicaux que
//     l'élève doit réduire pour retomber sur eux.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;
  const { rat, num, S, sAdd, sSub, sNeg, sMul, sDiv, sSqrt, sTxt, ent, choix } = F;

  // « 2√2 », mais « √2 » quand le coefficient vaut 1 : personne n'écrit 1√2.
  const R = (c, r) => (c === 1 ? '√' + r : c + '√' + r);
  const carre = n => n * n;

  // =========================================================================
  // EXERCICE 17 — a × b = 1 : de l'identité à l'équation.
  //
  // Le fil : si ab = 1 alors a² - a(b + 1/b) + 1 = 0. Autrement dit, dès qu'un
  // coefficient s'écrit « un nombre PLUS son inverse », l'équation x² - kx + 1 = 0
  // se résout de tête — ses deux racines sont ce nombre et son inverse. Les
  // questions 2 et 3 ne sont que cette lecture, sur 26/5 puis sur 5/2.
  // =========================================================================
  function type17() {
    const n = ent(3, 9);
    let m = ent(2, 9);
    while (m === n) m = ent(2, 9);

    const cle = k => carre(k) + 1;                 // k + 1/k = (k²+1)/k
    const s1 = cle(n) + '/' + n, s2 = cle(m) + '/' + m;

    return [
      {
        enonce: ['ليكن a و b عددين حقيقيين بحيث a × b = 1.',
                 'بيّن أنّ a^2 - a(b + 1/b) + 1 = 0'],
        indice: 'من a × b = 1 نستنتج b = 1/a و 1/b = a، ثمّ عوّض في العبارة',
        etapes: [
          ['شرط الوجود', 'بما أنّ a × b = 1 فإنّ a ≠ 0 و b ≠ 0، و لكلّ منهما مقلوب'],
          ['نكتب b بدلالة a', 'b = 1/a'],
          ['نكتب مقلوب b', '1/b = a'],
          ['نعوّض في المجموع', 'b + 1/b = 1/a + a'],
          ['ننشر الجداء', 'a(b + 1/b) = a(1/a + a) = 1 + a^2'],
          ['نعوّض في العبارة', 'a^2 - a(b + 1/b) + 1 = a^2 - (1 + a^2) + 1'],
          ['نختصر', 'a^2 - (1 + a^2) + 1 = 0']
        ],
        controle: {
          libres: ['b'], derives: { a: '1/b' },
          claims: [['a^2 - a(b + 1/b) + 1', '0'], ['a × b', '1']]
        }
      },
      {
        enonce: ['احسب المجموع التالي:', n + ' + 1/' + n],
        indice: 'العددان ' + n + ' و 1/' + n + ' مقلوبان: وحّد المقامين ثمّ اجمع',
        etapes: [
          ['العددان مقلوبان', n + ' × 1/' + n + ' = 1'],
          ['نوحّد المقامين', n + ' = ' + carre(n) + '/' + n],
          ['نجمع البسطين', n + ' + 1/' + n + ' = ' + carre(n) + '/' + n + ' + 1/' + n],
          ['النتيجة', n + ' + 1/' + n + ' = ' + s1]
        ],
        controle: { claims: [[n + ' + 1/' + n, s1]] }
      },
      {
        enonce: ['أوجد العدد الحقيقي x بحيث:', 'x^2 - ' + s1 + ' x + 1 = 0'],
        indice: 'المعامل ' + s1 + ' هو ' + n + ' + 1/' + n + ': ابحث عن العدد و مقلوبه',
        etapes: [
          ['نتذكّر نتيجة السؤال 1',
           'كل عدد a يحقّق a × b = 1 هو حلّ للمعادلة x^2 - (b + 1/b)x + 1 = 0'],
          ['نكتب المعامل مجموعَ عدد و مقلوبه', s1 + ' = ' + n + ' + 1/' + n],
          ['نتحقّق من الحلّ الأوّل', n + '^2 - ' + s1 + ' × ' + n + ' + 1 = 0'],
          ['نتحقّق من الحلّ الثاني', '(1/' + n + ')^2 - ' + s1 + ' × 1/' + n + ' + 1 = 0'],
          ['جداء الحلّين', n + ' × 1/' + n + ' = 1'],
          ['النتيجة', 'المعادلة تقبل الحلّين ' + n + ' و 1/' + n + '، و هما مقلوبان']
        ],
        // x vaut l'une des deux racines annoncées : l'énoncé lui-même devient
        // alors une relation, et le validateur certifie qu'elle en est bien une.
        controle: {
          env: { x: '1/' + n },
          claims: [[s1, n + ' + 1/' + n],
                   ['x^2 - ' + s1 + ' x + 1', '0'],
                   [n + '^2 - ' + s1 + ' × ' + n + ' + 1', '0'],
                   ['(1/' + n + ')^2 - ' + s1 + ' × 1/' + n + ' + 1', '0']]
        }
      },
      {
        enonce: ['أوجد العدد الحقيقي x بحيث:', 'x^2 - ' + s2 + ' x + 1 = 0'],
        indice: 'ابحث عن عدد مجموعه مع مقلوبه يساوي ' + s2,
        etapes: [
          ['نبحث عن عدد مجموعه مع مقلوبه يساوي المعامل', s2 + ' = ' + m + ' + 1/' + m],
          ['نتأكّد بتوحيد المقامين',
           m + ' + 1/' + m + ' = ' + carre(m) + '/' + m + ' + 1/' + m],
          ['نتحقّق من الحلّ الأوّل', m + '^2 - ' + s2 + ' × ' + m + ' + 1 = 0'],
          ['نتحقّق من الحلّ الثاني', '(1/' + m + ')^2 - ' + s2 + ' × 1/' + m + ' + 1 = 0'],
          ['النتيجة', 'الحلاّن هما ' + m + ' و 1/' + m + '، و هما مقلوبان']
        ],
        controle: {
          env: { x: String(m) },
          claims: [[s2, m + ' + 1/' + m],
                   ['x^2 - ' + s2 + ' x + 1', '0'],
                   [m + '^2 - ' + s2 + ' × ' + m + ' + 1', '0'],
                   ['(1/' + m + ')^2 - ' + s2 + ' × 1/' + m + ' + 1', '0']]
        }
      }
    ];
  }

  // =========================================================================
  // EXERCICE 18 — A = u + v√r et B = u - v√r, avec u² - r v² = 1.
  //
  // Solutions de Pell retenues : petites, et de radicande varié. La première
  // (3, 2, 2) est celle de la fiche — A = 3 + 2√2, B = 3 - 2√2.
  // =========================================================================
  const PELL = [[3, 2, 2], [2, 1, 3], [7, 4, 3], [5, 2, 6], [4, 1, 15], [8, 3, 7]];

  function type18() {
    const [u, v, r] = choix(PELL);
    const A = sAdd(num(u), S(rat(v), r));            // u + v√r
    const B = sSub(num(u), S(rat(v), r));            // u - v√r
    const racr = sSqrt(num(r));

    for (let essai = 0; essai < 400; essai++) {
      // A = √(k1²r) - √(k2²r) + (1/mm)√((mm·u)²) : les deux radicaux donnent
      // (k1 - k2)√r = v√r, le troisième terme donne u.
      const k2 = ent(2, 3), k1 = k2 + v, mm = ent(2, 4);
      // B = √(u²) + √(w1²r) - √(w2²r) : (w1 - w2)√r = -v√r.
      const w1 = ent(2, 4), w2 = w1 + v;
      // F = u + √(fa²r) - √(fb²r) - √(fc²r) : (fa - fb - fc)√r = -v√r.
      const fb = ent(2, 6), fc = ent(2, 6), fa = fb + fc - v;
      // Numérateurs de la question 3b.
      const p = ent(2, 6);
      let q = ent(2, 6);
      if (p === q) continue;

      if (fb === fc || fa === fb || fa === fc || fa < 2) continue;
      const rads = [carre(k1) * r, carre(k2) * r, carre(mm * u),
                    carre(u), carre(w1) * r, carre(w2) * r,
                    carre(fa) * r, carre(fb) * r, carre(fc) * r];
      if (rads.some(x => x > 400)) continue;         // un radicande qu'on peut lire
      if (new Set([carre(fa) * r, carre(fb) * r, carre(fc) * r]).size < 3) continue;

      // E = -nn + √r(v√r + 1) - (√r - v)(1 + √r).
      //   √r(v√r + 1)      = v·r + √r
      //   (√r - v)(1 + √r) = (r - v) + (1 - v)√r
      //   d'où E = (v·r - r + v - nn) + v√r, et il suffit de poser
      //   nn = v + v·r - r - u pour que E = u + v√r = A.
      const nn = v + v * r - r - u;
      const teteE = nn > 0 ? '-' + nn + ' + ' : nn < 0 ? (-nn) + ' + ' : '';

      const exprA = '√' + carre(k1) * r + ' - √' + carre(k2) * r
                  + ' + 1/' + mm + ' √' + carre(mm * u);
      const exprB = '√' + carre(u) + ' + √' + carre(w1) * r + ' - √' + carre(w2) * r;
      const exprE = teteE + '√' + r + '(' + R(v, r) + ' + 1) - (√' + r + ' - ' + v
                  + ')(1 + √' + r + ')';
      const exprF = u + ' + √' + carre(fa) * r + ' - √' + carre(fb) * r
                  + ' - √' + carre(fc) * r;

      const env = { A: exprA, B: exprB, E: exprE, F: exprF };

      const C = sSub(A, B);                          // |A| - |B| = 2v√r
      const cd = v * r - 1;                          // la constante de D
      const D = sSub(sSub(sMul(racr, A), sMul(A, B)), num(cd));   // = u√r
      const rA = sMul(racr, A);
      const prodE = sMul(sSub(racr, num(v)), sAdd(num(1), racr));
      const res3b = sSub(sMul(num(p), A), sMul(num(q), B));

      return [
        {
          enonce: ['لتكن العبارة التالية:', 'A = ' + exprA,
                   'بيّن أنّ A = ' + sTxt(A)],
          indice: 'أخرج المربّعات الكاملة من تحت الجذور، ثمّ اجمع الحدود المتشابهة',
          etapes: [
            ['نبسّط الجذر الأوّل',
             '√' + carre(k1) * r + ' = √(' + carre(k1) + ' × ' + r + ') = ' + R(k1, r)],
            ['نبسّط الجذر الثاني',
             '√' + carre(k2) * r + ' = √(' + carre(k2) + ' × ' + r + ') = ' + R(k2, r)],
            ['نبسّط الحدّ الثالث',
             '1/' + mm + ' √' + carre(mm * u) + ' = 1/' + mm + ' × ' + mm * u + ' = ' + u],
            ['نجمع الحدّين المتشابهين', R(k1, r) + ' - ' + R(k2, r) + ' = ' + R(v, r)],
            ['النتيجة', 'A = ' + sTxt(A)]
          ],
          controle: { env, claims: [['A', sTxt(A)]] }
        },
        {
          enonce: ['نعتبر العدد:', 'B = ' + exprB, 'بيّن أنّ A مقلوب B'],
          indice: 'بسّط B، ثمّ احسب الجداء A × B بالمتطابقة (x + y)(x - y) = x^2 - y^2',
          etapes: [
            ['نبسّط جذور B', '√' + carre(u) + ' = ' + u],
            ['نبسّط الجذرين الآخرين',
             '√' + carre(w1) * r + ' - √' + carre(w2) * r + ' = ' + R(w1, r)
             + ' - ' + R(w2, r) + ' = ' + sTxt(S(rat(-v), r))],
            ['نستنتج B', 'B = ' + sTxt(B)],
            ['نستعمل المتطابقة',
             'A × B = (' + sTxt(A) + ')(' + sTxt(B) + ') = ' + u + '^2 - (' + R(v, r) + ')^2'],
            ['نحسب', u + '^2 - (' + R(v, r) + ')^2 = ' + carre(u) + ' - ' + carre(v) * r + ' = 1'],
            ['النتيجة', 'A × B = 1، إذن A = 1/B: العددان مقلوبان']
          ],
          controle: { env, claims: [['B', sTxt(B)], ['A × B', '1'], ['A', '1/B']] }
        },
        {
          enonce: ['احسب العددين:', 'C = |A| - |B|', 'D = √' + r + ' A - A B - ' + cd],
          indice: 'ابدأ بإشارة A و إشارة B، ثمّ استعمل A × B = 1 في حساب D',
          etapes: [
            ['نقارن ' + R(v, r) + ' بـ ' + u,
             R(v, r) + ' = √' + carre(v) * r + ' < √' + carre(u) + ' = ' + u],
            ['إشارة العددين', 'A > 0 و B > 0، إذن |A| = A و |B| = B'],
            ['نحسب C', '|A| - |B| = (' + sTxt(A) + ') - (' + sTxt(B) + ') = ' + sTxt(C)],
            ['نعوّض الجداء في D', '√' + r + ' A - A B - ' + cd + ' = √' + r + ' A - 1 - ' + cd],
            ['ننشر الجداء الباقي', '√' + r + '(' + sTxt(A) + ') = ' + sTxt(rA)],
            ['النتيجة', '√' + r + ' A - A B - ' + cd + ' = ' + sTxt(D)]
          ],
          // C et D sont définis par l'énoncé : on les nomme dans l'environnement
          // pour que « C = 4√2 » soit vérifié comme une égalité, et non recopié.
          controle: {
            env: Object.assign({}, env, { C: '|A| - |B|', D: '√' + r + ' A - A B - ' + cd }),
            claims: [['C', sTxt(C)], ['D', sTxt(D)],
                     ['|A| - |B|', sTxt(C)],
                     ['√' + r + ' A - A B - ' + cd, sTxt(D)]]
          }
        },
        {
          enonce: ['نعتبر العبارتين:', 'E = ' + exprE, 'F = ' + exprF,
                   'بيّن أنّ E = A و F = B'],
          indice: 'انشر كل جداء في E، و أخرج المربّعات الكاملة من جذور F',
          etapes: [
            ['ننشر الجداء الأوّل في E',
             '√' + r + '(' + R(v, r) + ' + 1) = ' + v * r + ' + √' + r],
            ['ننشر الجداء الثاني في E',
             '(√' + r + ' - ' + v + ')(1 + √' + r + ') = ' + sTxt(prodE)],
            ['نجمع فنجد A', 'E = ' + sTxt(A) + ' = A'],
            ['نبسّط جذور F',
             '√' + carre(fa) * r + ' - √' + carre(fb) * r + ' - √' + carre(fc) * r
             + ' = ' + R(fa, r) + ' - ' + R(fb, r) + ' - ' + R(fc, r)],
            ['نجمع الحدود المتشابهة',
             R(fa, r) + ' - ' + R(fb, r) + ' - ' + R(fc, r) + ' = ' + sTxt(S(rat(-v), r))],
            ['نجمع فنجد B', 'F = ' + sTxt(B) + ' = B']
          ],
          controle: { env, claims: [['E', 'A'], ['F', 'B']] }
        },
        {
          enonce: ['استنتج اختصارا للعدد:', p + '/F - ' + q + '/E'],
          indice: 'بما أنّ E = A و F = B و A × B = 1، فإنّ مقلوب F هو A و مقلوب E هو B',
          etapes: [
            ['مقلوب F', '1/F = A'],
            ['مقلوب E', '1/E = B'],
            ['نعوّض', p + '/F - ' + q + '/E = ' + p + ' A - ' + q + ' B'],
            ['ننشر',
             p + ' A - ' + q + ' B = ' + p + '(' + sTxt(A) + ') - ' + q + '(' + sTxt(B) + ')'],
            ['النتيجة', p + '/F - ' + q + '/E = ' + sTxt(res3b)]
          ],
          controle: {
            env,
            claims: [['1/F', 'A'], ['1/E', 'B'],
                     [p + '/F - ' + q + '/E', sTxt(res3b)]]
          }
        }
      ];
    }
    return type18();
  }

  // =========================================================================
  // EXERCICE 19 — a = 1 + √2 et b = √2 - 1, sous quatre habillages.
  //
  //   a = √s(√2 + √s) - √2(√s - 2) - (√2 + (s-1))   →  1 + √2  quel que soit s
  //   b = √(p²·2) - √(q²·2) - (1 + √2)               →  √2 - 1  si p - q = 2
  //   c = 2√(g²·2) - (√(h²·2) + w√(e²·2) - 1)        →  √2 + 1  si 2g - h - we = 1
  //   d = √2(1 + nn√2) - √((2nn+1)²)                 →  √2 - 1  par construction
  // =========================================================================
  function type19() {
    const A = sAdd(num(1), sSqrt(num(2)));           // 1 + √2
    const B = sSub(sSqrt(num(2)), num(1));           // √2 - 1

    for (let essai = 0; essai < 400; essai++) {
      const s = choix([3, 5, 6, 7, 10, 11]);
      const qq = ent(2, 4), pp = qq + 2;
      const g = ent(3, 5), w = ent(2, 3), e = ent(1, 2);
      const h = 2 * g - w * e - 1;
      const nn = ent(2, 4), z = 2 * nn + 1;
      if (h < 2 || h > 9 || h === w * e) continue;
      if (carre(h) * 2 === carre(e) * 2) continue;

      const exprA = '√' + s + '(√2 + √' + s + ') - √2(√' + s + ' - 2) - (√2 + ' + (s - 1) + ')';
      const exprB = '√' + carre(pp) * 2 + ' - √' + carre(qq) * 2 + ' - (1 + √2)';
      const exprC = '2√' + carre(g) * 2 + ' - (√' + carre(h) * 2 + ' + '
                  + R(w, carre(e) * 2) + ' - 1)';
      const exprD = '√2(1 + ' + nn + '√2) - √' + carre(z);

      const env = { a: exprA, b: exprB, c: exprC, d: exprD };
      const dansC = h + w * e;                        // ce que vaut la parenthèse, en √2

      return [
        {
          enonce: ['نعتبر العبارتين:', 'a = ' + exprA, 'b = ' + exprB,
                   'بيّن أنّ a = ' + sTxt(A) + ' و b = ' + sTxt(B)],
          indice: 'انشر الجداءين في a: الحدّان في √' + 2 * s + ' يتلاشيان',
          etapes: [
            ['ننشر الجداء الأوّل', '√' + s + '(√2 + √' + s + ') = √' + 2 * s + ' + ' + s],
            ['ننشر الجداء الثاني', '√2(√' + s + ' - 2) = √' + 2 * s + ' - 2√2'],
            ['نطرح فيتلاشى √' + 2 * s,
             '√' + 2 * s + ' + ' + s + ' - (√' + 2 * s + ' - 2√2) = ' + s + ' + 2√2'],
            ['نطرح الحدّ الأخير',
             s + ' + 2√2 - (√2 + ' + (s - 1) + ') = ' + sTxt(A)],
            ['نبسّط جذري b',
             '√' + carre(pp) * 2 + ' - √' + carre(qq) * 2 + ' = ' + R(pp, 2)
             + ' - ' + R(qq, 2) + ' = 2√2'],
            ['نطرح القوس', 'b = 2√2 - (1 + √2) = ' + sTxt(B)]
          ],
          controle: { env, claims: [['a', sTxt(A)], ['b', sTxt(B)]] }
        },
        {
          enonce: ['بيّن أنّ a و b مقلوبان'],
          indice: 'احسب الجداء a × b بالمتطابقة (x + y)(x - y) = x^2 - y^2',
          etapes: [
            ['نكتب الجداء', 'a × b = (√2 + 1)(√2 - 1)'],
            ['نستعمل المتطابقة', '(√2 + 1)(√2 - 1) = (√2)^2 - 1^2'],
            ['نحسب', '(√2)^2 - 1^2 = 2 - 1 = 1'],
            ['النتيجة', 'a × b = 1، إذن a = 1/b: العددان مقلوبان']
          ],
          controle: { env, claims: [['a × b', '1'], ['a', '1/b']] }
        },
        {
          enonce: ['بيّن أنّ العددين -2ab و (a - b) متقابلان'],
          indice: 'استعمل a × b = 1 في الأوّل، و احسب الفرق a - b في الثاني',
          etapes: [
            ['نستعمل الجداء a × b = 1', '-2 a b = -2'],
            ['نحسب الفرق', 'a - b = (√2 + 1) - (√2 - 1) = 2'],
            ['نجمع العددين', '-2 a b + (a - b) = -2 + 2 = 0'],
            ['النتيجة', 'مجموع العددين معدوم، إذن -2ab و a - b متقابلان']
          ],
          controle: { env, claims: [['-2 a b', '-2'], ['a - b', '2'], ['-2 a b + (a - b)', '0']] }
        },
        {
          enonce: ['نعتبر العبارتين:', 'c = ' + exprC, 'd = ' + exprD,
                   'بيّن أنّ c = a و d = b'],
          indice: 'أخرج المربّعات الكاملة، ثمّ انتبه إلى إشارة القوس في c',
          etapes: [
            ['نبسّط جذر c الأوّل', '2√' + carre(g) * 2 + ' = ' + R(2 * g, 2)],
            ['نبسّط ما داخل القوس',
             '√' + carre(h) * 2 + ' + ' + R(w, carre(e) * 2) + ' - 1 = ' + R(h, 2)
             + ' + ' + R(w * e, 2) + ' - 1 = ' + R(dansC, 2) + ' - 1'],
            ['نطرح القوس', R(2 * g, 2) + ' - (' + R(dansC, 2) + ' - 1) = ' + sTxt(A)],
            ['نستنتج c', 'c = ' + sTxt(A) + ' = a'],
            ['ننشر جداء d', '√2(1 + ' + nn + '√2) = √2 + ' + 2 * nn],
            ['نبسّط جذر d', '√' + carre(z) + ' = ' + z],
            ['نستنتج d', 'd = √2 + ' + 2 * nn + ' - ' + z + ' = ' + sTxt(B) + ' = b']
          ],
          controle: { env, claims: [['c', 'a'], ['d', 'b']] }
        },
        {
          enonce: ['بيّن أنّ العدد التالي عدد صحيح طبيعي:', '√(1/c + 1/d - √8)'],
          indice: 'c و d مقلوبان: مقلوب c هو d، و مقلوب d هو c',
          etapes: [
            ['مقلوب c', '1/c = b = ' + sTxt(B)],
            ['مقلوب d', '1/d = a = ' + sTxt(A)],
            ['نجمع المقلوبين', '1/c + 1/d = (' + sTxt(B) + ') + (' + sTxt(A) + ') = 2√2'],
            ['نبسّط √8', '√8 = √(4 × 2) = 2√2'],
            ['نطرح', '1/c + 1/d - √8 = 2√2 - 2√2 = 0'],
            ['نأخذ الجذر', '√(1/c + 1/d - √8) = 0'],
            ['النتيجة', 'العدد يساوي 0، و 0 عدد صحيح طبيعي']
          ],
          controle: {
            env,
            claims: [['1/c', 'b'], ['1/d', 'a'],
                     ['1/c + 1/d - √8', '0'], ['√(1/c + 1/d - √8)', '0']]
          }
        }
      ];
    }
    return type19();
  }

  // =========================================================================
  // EXERCICE 20 — le plus long de la fiche : 14 questions sur un seul couple.
  //
  // A = u - v√r et B = u + v√r, encore une fois avec u² - r v² = 1. Une fois
  // A × B = 1 acquis à la question 3, les onze questions qui suivent ne sont
  // plus des calculs mais des LECTURES : 1/A c'est B, 1/B c'est A, et tout
  // tombe. C'est ce que l'exercice veut faire sentir, et c'est pourquoi ses
  // réponses sont si rondes — M = 1, N = -1, D/E + E/D entier.
  //
  // Trois de ces réponses ne dépendent même pas du tirage : M vaut 1, N vaut
  // -1, et E(D-1) - 1 vaut -E, quel que soit le couple de Pell choisi.
  // =========================================================================
  // Les couples pour lesquels l'écriture « A = (1 + √r)(k√r - j) - √(m²r) »
  // admet des entiers j ≥ 1 et m ≥ 2 : il faut j = kr - u et m = k - j + v.
  //
  // m ≥ 2 et non m ≥ 1, parce que la question demande d'extraire un carré
  // parfait de sous le radical — et que m = 1 n'en laisse aucun à extraire :
  // « √3 = √(1 × 3) = √3 » n'est pas un geste, et l'étape qui précède dirait
  // déjà la réponse. Le couple (2, 1, 3) ne donne que m = 1 : il sort.
  const PELL20 = [[3, 2, 2], [7, 4, 3], [5, 2, 6]];

  function type20() {
    const [u, v, r] = choix(PELL20);
    const A = sSub(num(u), S(rat(v), r));
    const B = sAdd(num(u), S(rat(v), r));
    const ta = sTxt(A), tb = sTxt(B);
    const racr = sSqrt(num(r));

    for (let essai = 0; essai < 500; essai++) {
      // --- A = (1 + √r)(k√r - j) - √(m²r) --------------------------------
      const k = ent(1, 5), j = k * r - u, mA = k - j + v;
      if (j < 1 || mA < 2) continue;

      // --- B = p/(√r - jb) - (√r + q)/(√r + jb) ---------------------------
      //   p·jb + q·jb - r = u·d   et   p - q + jb = v·d,  avec d = r - jb².
      const jb = ent(1, 3), d = r - carre(jb);
      if (d < 1) continue;
      const somme = (u * d + r) / jb, diff = v * d - jb;
      if (somme % 1 || (somme + diff) % 2) continue;
      const p = (somme + diff) / 2, q = p - diff;
      if (p < 1 || q < 1) continue;

      // --- D = √(a²r) - √(b²r) + √(u²) - √(c²r),  a - b - c = -v ----------
      const db = ent(2, 6), dc = ent(2, 6), da = db + dc - v;
      if (da < 2 || new Set([da, db, dc]).size < 3) continue;
      if ([da, db, dc].some(x => carre(x) * r > 400)) continue;

      // --- E = √r(k3√r + v) - (√s - w)(√s + w),  s = k3·r + w² - u --------
      const k3 = ent(1, 4), w = ent(2, 3), s = k3 * r + carre(w) - u;
      if (s < 2 || s <= carre(w) || carre(F.carre(s).k) === s) continue;
      if (F.carre(s).s === 1) continue;                 // √s doit rester un vrai radical

      // --- les constantes des questions 7, 8 et 12 ------------------------
      const K = ent(5, 20);                             // (1/A - 1/B) × K√r
      let wr = 2;
      while (carre(wr) <= 2 * u) wr++;                  // √(1/A + 1/B + c) = wr
      const cc = carre(wr) - 2 * u;
      const nG = ent(1, 2 * v + 1);                     // G = |1 - E| - |D + nG√r|

      const exprA = '(1 + √' + r + ')(' + R(k, r) + ' - ' + j + ') - √' + carre(mA) * r;
      const exprB = p + '/(√' + r + ' - ' + jb + ') - (√' + r + ' + ' + q + ')/(√'
                  + r + ' + ' + jb + ')';
      const exprD = '√' + carre(da) * r + ' - √' + carre(db) * r + ' + √' + carre(u)
                  + ' - √' + carre(dc) * r;
      const exprE = '√' + r + '(' + R(k3, r) + ' + ' + v + ') - (√' + s + ' - ' + w
                  + ')(√' + s + ' + ' + w + ')';
      const exprM = '|A(B + 1)| - |A|';
      const exprN = 'A[A - (1/B + B)]';
      const exprG = '|1 - E| - |D + ' + R(nG, r) + '|';
      const exprS = '(1/A - 1/B) × ' + R(K, r);
      const exprT = '√(1/A + 1/B + ' + cc + ')';
      const env = { A: exprA, B: exprB, M: exprM, N: exprN,
                    D: exprD, E: exprE, G: exprG };

      const dev1 = sMul(sAdd(num(1), racr), sSub(S(rat(k), r), num(j)));
      const G = sSub(sMul(num(2 * v - nG), racr), num(1));
      const somme2 = num(4 * carre(u) - 2);             // D/E + E/D
      const prodB1 = sMul(sSub(sSqrt(num(s)), num(w)), sAdd(sSqrt(num(s)), num(w)));

      return [
        {
          enonce: ['نعتبر العبارة:', 'A = ' + exprA, 'بيّن أنّ A = ' + ta],
          indice: 'انشر الجداء أوّلا، ثمّ أخرج المربّع الكامل من تحت الجذر',
          etapes: [
            ['ننشر الجداء',
             '(1 + √' + r + ')(' + R(k, r) + ' - ' + j + ') = ' + sTxt(dev1)],
            // On substitue AVANT de réduire le radical : sans quoi cette étape
            // dirait déjà « A = <ta> » et ferait double emploi avec la dernière
            // chaque fois que le développement tombe sur un rationnel.
            ['نعوّض في A', 'A = ' + sTxt(dev1) + ' - √' + carre(mA) * r],
            ['نبسّط الجذر',
             '√' + carre(mA) * r + ' = √(' + carre(mA) + ' × ' + r + ') = ' + R(mA, r)],
            ['النتيجة', 'A = ' + ta]
          ],
          controle: { env, claims: [['A', ta]] }
        },
        {
          enonce: ['نعتبر العبارة:', 'B = ' + exprB, 'بيّن أنّ B = ' + tb],
          indice: 'أنطق كل مقام بضربه في مرافقه: (√' + r + ' - ' + jb + ')(√' + r
                  + ' + ' + jb + ') = ' + d,
          etapes: [
            ['مرافق المقام الأوّل',
             '(√' + r + ' - ' + jb + ')(√' + r + ' + ' + jb + ') = ' + r + ' - '
             + carre(jb) + ' = ' + d],
            ['نُنطق الكسر الأوّل',
             p + '/(√' + r + ' - ' + jb + ') = ' + p + '(√' + r + ' + ' + jb + ')/' + d],
            ['نُنطق الكسر الثاني',
             '(√' + r + ' + ' + q + ')/(√' + r + ' + ' + jb + ') = (√' + r + ' + '
             + q + ')(√' + r + ' - ' + jb + ')/' + d],
            ['نطرح الكسرين', 'B = ' + p + '(√' + r + ' + ' + jb + ')/' + d
             + ' - (√' + r + ' + ' + q + ')(√' + r + ' - ' + jb + ')/' + d],
            ['النتيجة', 'B = ' + tb]
          ],
          controle: { env, claims: [['B', tb]] }
        },
        {
          enonce: ['احسب الجداء:', 'A × B'],
          indice: 'استعمل المتطابقة (x - y)(x + y) = x^2 - y^2',
          etapes: [
            ['نعوّض بالشكلين المختصرين', 'A × B = (' + ta + ')(' + tb + ')'],
            ['نستعمل المتطابقة',
             '(' + ta + ')(' + tb + ') = ' + u + '^2 - (' + R(v, r) + ')^2'],
            ['نحسب المربّعين',
             u + '^2 - (' + R(v, r) + ')^2 = ' + carre(u) + ' - ' + carre(v) * r],
            ['النتيجة', 'A × B = 1']
          ],
          controle: { env, claims: [['A × B', '1']] }
        },
        {
          enonce: ['ماذا تستنتج بالنسبة إلى A و B ؟'],
          indice: 'عددان جداؤهما يساوي 1 هما مقلوبان',
          etapes: [
            ['ننطلق من الجداء', 'A × B = 1'],
            ['العددان غير معدومين',
             'لو كان أحدهما معدوما لكان الجداء معدوما، لا يساوي 1'],
            ['نقسم على B', '1/B = A'],
            ['نقسم على A', '1/A = B'],
            ['النتيجة', 'كل من A و B مقلوب الآخر']
          ],
          controle: { env, claims: [['1/B', 'A'], ['1/A', 'B']] }
        },
        {
          enonce: ['استنتج أنّ العدد A هو عدد موجب'],
          indice: 'B موجب بداهة، و A مقلوبه',
          etapes: [
            ['إشارة B', 'B = ' + tb + ' > 0'],
            ['A مقلوب B', 'A = 1/B'],
            ['قاعدة المقلوب', 'مقلوب عدد موجب هو عدد موجب'],
            ['نتأكّد بالمقارنة',
             R(v, r) + ' = √' + carre(v) * r + ' < √' + carre(u) + ' = ' + u],
            ['النتيجة', 'A > 0']
          ],
          controle: { env, claims: [['A', ta]] }
        },
        {
          enonce: ['احسب:', 'M = ' + exprM],
          indice: 'انشر A(B + 1) و استعمل A × B = 1 قبل رفع القيم المطلقة',
          etapes: [
            ['ننشر الجداء', 'A(B + 1) = A B + A'],
            ['نعوّض الجداء', 'A B + A = 1 + A'],
            ['إشارة العبارة', '1 + A > 0'],
            ['نرفع القيمة المطلقة الأولى', '|A(B + 1)| = 1 + A'],
            ['نرفع القيمة المطلقة الثانية', '|A| = A'],
            ['نطرح', 'M = (1 + A) - A'],
            ['النتيجة', 'M = 1']
          ],
          controle: { env, claims: [['M', '1']] }
        },
        {
          enonce: ['احسب:', 'N = ' + exprN],
          indice: 'مقلوب B هو A: ابدأ بحساب ما داخل القوس',
          etapes: [
            ['نستعمل أنّ A مقلوب B', '1/B = A'],
            ['نحسب ما داخل القوس', '1/B + B = A + B = ' + 2 * u],
            ['نطرح من A', 'A - ' + 2 * u + ' = ' + sTxt(sNeg(B))],
            ['نضرب في A', 'N = A(' + sTxt(sNeg(B)) + ')'],
            ['نستعمل A × B = 1', 'A(' + sTxt(sNeg(B)) + ') = -1'],
            ['النتيجة', 'N = -1']
          ],
          controle: { env, claims: [['N', '-1']] }
        },
        {
          enonce: ['أثبت أنّ العدد التالي عدد صحيح طبيعي:', exprS],
          indice: 'عوّض كل مقلوب بما يساويه، ثمّ لاحظ أنّ √' + r + ' × √' + r
                  + ' = ' + r,
          etapes: [
            ['مقلوب A', '1/A = B'],
            ['مقلوب B', '1/B = A'],
            ['نطرح المقلوبين', '1/A - 1/B = B - A = ' + R(2 * v, r)],
            ['نضرب',
             R(2 * v, r) + ' × ' + R(K, r) + ' = ' + 2 * v * K + ' × ' + r],
            ['النتيجة', exprS + ' = ' + 2 * v * K * r],
            ['طبيعة العدد', 'العدد ' + 2 * v * K * r + ' عدد صحيح طبيعي']
          ],
          controle: { env, claims: [[exprS, String(2 * v * K * r)]] }
        },
        {
          enonce: ['أثبت أنّ العدد التالي عدد صحيح طبيعي:', exprT],
          indice: 'مجموع المقلوبين هو A + B: احسبه قبل أن تأخذ الجذر',
          etapes: [
            ['نجمع المقلوبين', '1/A + 1/B = B + A'],
            ['نحسب المجموع', 'B + A = ' + 2 * u],
            ['نضيف ' + cc, 2 * u + ' + ' + cc + ' = ' + carre(wr)],
            ['نأخذ الجذر', '√' + carre(wr) + ' = ' + wr],
            ['النتيجة', exprT + ' = ' + wr],
            ['طبيعة العدد', 'العدد ' + wr + ' عدد صحيح طبيعي']
          ],
          controle: { env, claims: [[exprT, String(wr)]] }
        },
        {
          enonce: ['نعتبر العبارة:', 'D = ' + exprD, 'بيّن أنّ D = A'],
          indice: 'أخرج المربّعات الكاملة من تحت الجذور، ثمّ اجمع حدود √' + r,
          etapes: [
            ['نبسّط الجذور في √' + r,
             '√' + carre(da) * r + ' - √' + carre(db) * r + ' - √' + carre(dc) * r
             + ' = ' + R(da, r) + ' - ' + R(db, r) + ' - ' + R(dc, r)],
            ['نجمع الحدود المتشابهة',
             R(da, r) + ' - ' + R(db, r) + ' - ' + R(dc, r) + ' = '
             + sTxt(S(rat(-v), r))],
            ['نبسّط الجذر العددي', '√' + carre(u) + ' = ' + u],
            ['النتيجة', 'D = ' + ta + ' = A']
          ],
          controle: { env, claims: [['D', 'A']] }
        },
        {
          enonce: ['نعتبر العبارة:', 'E = ' + exprE, 'بيّن أنّ E = B'],
          indice: 'الجداء الثاني من الشكل (x - y)(x + y)',
          etapes: [
            ['ننشر الجداء الأوّل',
             '√' + r + '(' + R(k3, r) + ' + ' + v + ') = ' + k3 * r + ' + ' + R(v, r)],
            ['نستعمل المتطابقة',
             '(√' + s + ' - ' + w + ')(√' + s + ' + ' + w + ') = ' + s + ' - '
             + carre(w) + ' = ' + sTxt(prodB1)],
            ['نطرح',
             k3 * r + ' + ' + R(v, r) + ' - ' + sTxt(prodB1) + ' = ' + tb],
            ['النتيجة', 'E = ' + tb + ' = B']
          ],
          controle: { env, claims: [['E', 'B']] }
        },
        {
          enonce: ['بيّن أنّ العددين E و E(D - 1) - 1 متقابلان'],
          indice: 'عوّض D بـ A و E بـ B، ثمّ استعمل A × B = 1',
          etapes: [
            ['نستعمل D = A و E = B', 'E(D - 1) = B(A - 1)'],
            ['ننشر', 'B(A - 1) = A B - B'],
            ['نعوّض الجداء', 'A B - B = 1 - B'],
            ['نطرح 1', 'E(D - 1) - 1 = ' + sTxt(sNeg(B))],
            ['نجمع العددين', 'E + (E(D - 1) - 1) = 0'],
            ['النتيجة', 'مجموع العددين معدوم، إذن هما متقابلان']
          ],
          controle: { env, claims: [['E(D - 1) - 1', '-E'], ['E + (E(D - 1) - 1)', '0']] }
        },
        {
          enonce: ['اختصر العبارة:', 'G = ' + exprG],
          indice: 'حدّد إشارة كل عبارة داخل القيمتين المطلقتين قبل رفعهما',
          etapes: [
            ['إشارة العبارة الأولى', '1 - E < 0'],
            ['نرفع القيمة المطلقة الأولى', '|1 - E| = E - 1'],
            ['إشارة العبارة الثانية', 'D + ' + R(nG, r) + ' > 0'],
            ['نرفع القيمة المطلقة الثانية',
             '|D + ' + R(nG, r) + '| = D + ' + R(nG, r)],
            ['نطرح', 'G = (E - 1) - (D + ' + R(nG, r) + ')'],
            ['النتيجة', 'G = ' + sTxt(G)]
          ],
          controle: { env, claims: [['G', sTxt(G)]] }
        },
        {
          enonce: ['أثبت أنّ العدد التالي عدد صحيح طبيعي:', 'D/E + E/D'],
          indice: 'D = A و E = B، و مقلوب B هو A: كل كسر يصير مربّعا',
          etapes: [
            ['نعوّض D و E', 'D/E = A/B'],
            ['مقلوب B هو A', 'A/B = A × A = A^2'],
            ['بالمثل للكسر الثاني', 'E/D = B × B = B^2'],
            ['نجمع المربّعين', 'A^2 + B^2 = ' + sTxt(somme2)],
            ['النتيجة', 'D/E + E/D = ' + sTxt(somme2)],
            ['طبيعة العدد', 'العدد ' + sTxt(somme2) + ' عدد صحيح طبيعي']
          ],
          controle: { env, claims: [['D/E + E/D', sTxt(somme2)]] }
        }
      ];
    }
    return type20();
  }

  // =========================================================================
  // EXERCICE 41 — a = (√r - 1)², et tout le reste en découle.
  //
  // L'exercice ne le dit qu'à la question 3, mais c'est sa clef : a est un
  // carré. De là, b = 1/a s'écrit avec (r-1)² au dénominateur, et le quotient
  // final se simplifie par (√r - 1) au lieu de se rationaliser.
  //
  // Le tirage est donc entièrement commandé par r :
  //     a = 2√r(√r - 1) - (r-1) = (r+1) - 2√r = (√r - 1)²
  //     b = 1/(r-1)² × ((r+1) + 2√r)          car (r+1)² - 4r = (r-1)²
  //     c = √(p²r) - √(q²r) = (p-q)√r,  et p - q = r - 1
  //     (c - a)/(√r - 1) = r + 1
  // Rien n'y est libre sauf r et l'habillage de c : imposer p - q = r - 1 est
  // ce qui fait tomber le quotient sur un entier, et l'exercice n'a pas d'autre
  // objet que ce moment-là.
  // =========================================================================
  function type41() {
    const r = choix([5, 3, 6, 7]);                     // 5 est celui de la fiche
    const u = r + 1, k = r - 1, N = carre(r - 1);
    const a = sSub(num(u), S(rat(2), r));              // (√r - 1)²
    const ta = sTxt(a);
    const qs = [];
    for (let q = 1; q <= 9; q++) if (carre(q + r - 1) * r <= 400) qs.push(q);
    const q = choix(qs), p = q + r - 1;
    const c = S(rat(r - 1), r);                        // (p - q)√r

    const exprA = '2√' + r + '(√' + r + ' - 1) - ' + k;
    const exprB = '1/' + N + ' (' + u + ' + 2√' + r + ')';
    const exprC = '√' + carre(p) * r + ' - √' + carre(q) * r;
    const exprQ = '(c - a)/(√' + r + ' - 1)';
    const env = { a: exprA, b: exprB, c: exprC };
    const diff = sSub(c, a);                           // (r+1)√r - (r+1)

    return [
      {
        enonce: ['نعتبر العدد الحقيقي:', 'a = ' + exprA, 'بيّن أنّ a = ' + ta],
        indice: 'انشر الجداء أوّلا، و تذكّر أنّ √' + r + ' × √' + r + ' = ' + r,
        etapes: [
          ['نستعمل خاصية الجذر', '√' + r + ' × √' + r + ' = ' + r],
          ['ننشر الجداء',
           '2√' + r + '(√' + r + ' - 1) = ' + 2 * r + ' - 2√' + r],
          ['نطرح الثابت', 2 * r + ' - 2√' + r + ' - ' + k + ' = ' + ta],
          ['النتيجة', 'a = ' + ta]
        ],
        controle: { env, claims: [['a', ta]] }
      },
      {
        enonce: ['ليكن العدد الحقيقي:', 'b = ' + exprB, 'احسب الجداء a × b'],
        indice: 'الجداء (' + u + ' - 2√' + r + ')(' + u + ' + 2√' + r
                + ') من الشكل (x - y)(x + y)',
        etapes: [
          ['نكتب الجداء', 'a × b = (' + ta + ') × 1/' + N + ' (' + u + ' + 2√' + r + ')'],
          ['نستعمل المتطابقة',
           '(' + ta + ')(' + u + ' + 2√' + r + ') = ' + u + '^2 - (2√' + r + ')^2'],
          ['نحسب المربّعين',
           u + '^2 - (2√' + r + ')^2 = ' + carre(u) + ' - ' + 4 * r + ' = ' + N],
          ['نقسم على ' + N, 'a × b = ' + N + '/' + N],
          ['النتيجة', 'a × b = 1']
        ],
        controle: { env, claims: [['a × b', '1']] }
      },
      {
        enonce: ['استنتج أنّ العددين a و b مقلوبان'],
        indice: 'عددان جداؤهما يساوي 1 هما مقلوبان',
        etapes: [
          ['ننطلق من الجداء', 'a × b = 1'],
          ['العددان غير معدومين',
           'لو كان أحدهما معدوما لكان الجداء معدوما، لا يساوي 1'],
          ['نقسم على b', '1/b = a'],
          ['نقسم على a', '1/a = b'],
          ['النتيجة', 'كل من a و b مقلوب الآخر']
        ],
        controle: { env, claims: [['1/b', 'a'], ['1/a', 'b']] }
      },
      {
        enonce: ['بيّن أنّ العددين b و b(a - 1) - 1 متقابلان'],
        indice: 'انشر b(a - 1) ثمّ استعمل a × b = 1',
        etapes: [
          ['ننشر الجداء', 'b(a - 1) = a b - b'],
          ['نعوّض الجداء', 'a b - b = 1 - b'],
          ['نطرح 1', 'b(a - 1) - 1 = -b'],
          ['نجمع العددين', 'b + (b(a - 1) - 1) = 0'],
          ['النتيجة', 'مجموع العددين معدوم، إذن هما متقابلان']
        ],
        controle: { env, claims: [['b(a - 1) - 1', '-b'], ['b + (b(a - 1) - 1)', '0']] }
      },
      {
        enonce: ['بيّن أنّ:', 'a = (√' + r + ' - 1)^2'],
        indice: 'انشر المربّع بالمتطابقة (x - y)^2 = x^2 - 2xy + y^2',
        etapes: [
          ['نستعمل المتطابقة',
           '(√' + r + ' - 1)^2 = (√' + r + ')^2 - 2√' + r + ' + 1'],
          ['نحسب المربّع', '(√' + r + ')^2 = ' + r],
          ['نجمع الثابتين', r + ' - 2√' + r + ' + 1 = ' + ta],
          ['النتيجة', 'a = (√' + r + ' - 1)^2']
        ],
        controle: { env, claims: [['a', '(√' + r + ' - 1)^2']] }
      },
      {
        enonce: ['ليكن العدد الحقيقي:', 'c = ' + exprC, 'بيّن أنّ c = ' + sTxt(c)],
        indice: 'أخرج المربّع الكامل من تحت كل جذر',
        etapes: [
          ['نبسّط الجذر الأوّل',
           '√' + carre(p) * r + ' = √(' + carre(p) + ' × ' + r + ') = ' + R(p, r)],
          ['نبسّط الجذر الثاني',
           '√' + carre(q) * r + ' = √(' + carre(q) + ' × ' + r + ') = ' + R(q, r)],
          ['نطرح', R(p, r) + ' - ' + R(q, r) + ' = ' + sTxt(c)],
          ['النتيجة', 'c = ' + sTxt(c)]
        ],
        controle: { env, claims: [['c', sTxt(c)]] }
      },
      {
        enonce: ['بيّن أنّ العدد التالي عدد صحيح طبيعي:', exprQ],
        indice: 'احسب c - a، ثمّ ضع ' + u + ' عاملا مشتركا: يظهر (√' + r
                + ' - 1) في البسط',
        etapes: [
          ['نحسب الفرق', 'c - a = ' + sTxt(c) + ' - (' + ta + ')'],
          ['نختصر', sTxt(c) + ' - (' + ta + ') = ' + sTxt(diff)],
          ['نضع ' + u + ' عاملا مشتركا',
           sTxt(diff) + ' = ' + u + '(√' + r + ' - 1)'],
          ['نبسّط الكسر', exprQ + ' = ' + u + '(√' + r + ' - 1)/(√' + r + ' - 1)'],
          ['النتيجة', exprQ + ' = ' + u],
          ['طبيعة العدد', 'العدد ' + u + ' عدد صحيح طبيعي']
        ],
        controle: { env, claims: [[exprQ, String(u)], ['c - a', sTxt(diff)]] }
      }
    ];
  }

  const API = { type17, type18, type19, type20, type41, PELL, PELL20 };
  if (M) module.exports = API; else racine.Fiche = API;
})(typeof window !== 'undefined' ? window : globalThis);
