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

  const API = { type17, type18, type19, PELL };
  if (M) module.exports = API; else racine.Fiche = API;
})(typeof window !== 'undefined' ? window : globalThis);
