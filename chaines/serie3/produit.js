// Exercices 11 à 13 de la fiche « الضرب و القسمة في مجموعة الأعداد الحقيقية »
// (riadhyet.com, جوهر سويسي, 2018-2019, page 3).
//
// Même méthode que les autres dossiers (voir ../METHODE.md) : une page par
// exercice, un volet par question de l'énoncé, et l'on ne tire que ce que
// l'exercice supporte.
//
//   11 : A et B partagent le facteur (x - j). C'est ce qui fait tout : B - A se
//        factorise sans qu'on ait à développer quoi que ce soit.
//   12 : a = u + v√w et b = u - v√w avec u² - v²w = 1 (Pell), donc 1/a = b. Les
//        quatre sous-questions du 3 ne sont alors que quatre lectures d'un même
//        produit b(x - K).
//   13 : même ressort, sous la forme a = p√s + √t, b = p√s - √t avec p²s - t = 1.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;
  const { rat, num, S, sAdd, sSub, sNeg, sMul, sSqrt, sTxt, ent, choix } = F;

  const R = (c, r) => (c === 1 ? '√' + r : c + '√' + r);
  const carre = n => n * n;
  const LIBRES = [2, 3, 5, 6, 7, 10, 11, 13];
  // Un monôme : « x » et non « 1x ».
  const mono = (c, v) => (c === 1 ? v : c === -1 ? '-' + v : c + v);
  // Une fraction réduite, écrite comme la fiche l'écrirait.
  const frac = (n, d) => {
    const g = F.pgcd(Math.abs(n), d) || 1;
    return (d / g === 1) ? String(n / g) : (n / g) + '/' + (d / g);
  };

  // =========================================================================
  // EXERCICE 11 — A = P(x - j) et B = (x - j)(x - √r) : le facteur commun est
  // là dès le départ, mais l'énoncé ne le montre qu'à la question 3.
  // =========================================================================
  function type11() {
    const n = ent(2, 5), k = ent(1, n - 1), m = ent(1, 4);
    const P = m + 1, j = ent(1, 3);
    const r = choix(LIBRES);
    // A = 1/n (n x - k) + m x - c  avec  c = P·j - k/n, donc c = (n·P·j - k)/n.
    const cn = n * P * j - k;
    if (cn < 1) return type11();
    const c = frac(cn, n);

    const exprA = '1/' + n + ' (' + mono(n, 'x') + ' - ' + k + ') + ' + mono(m, 'x')
                + ' - ' + c;
    const facA = P + '(x - ' + j + ')';
    const devA = mono(P, 'x') + ' - ' + P * j;
    const exprB = 'x^2 - (' + j + ' + √' + r + ')x + ' + R(j, r);
    const facB = '(x - ' + j + ')(x - √' + r + ')';
    const facBA = '(x - ' + j + ')(x - √' + r + ' - ' + P + ')';
    const libre = { libres: ['x'], derives: { A: exprA, B: exprB } };

    return [
      {
        enonce: ['نعتبر العبارة، حيث x عدد حقيقي:', 'A = ' + exprA,
                 'بيّن أنّ A = ' + devA],
        indice: 'انشر القوس الأوّل: 1/' + n + ' × ' + mono(n, 'x') + ' = x',
        etapes: [
          ['ننشر القوس',
           '1/' + n + ' (' + mono(n, 'x') + ' - ' + k + ') = x - ' + frac(k, n)],
          ['نجمع حدود x', 'x + ' + mono(m, 'x') + ' = ' + mono(P, 'x')],
          ['نجمع الأعداد', '-' + frac(k, n) + ' - ' + c + ' = -' + P * j],
          ['النتيجة', 'A = ' + devA]
        ],
        controle: Object.assign({ claims: [[exprA, devA]] }, libre)
      },
      {
        enonce: ['نعتبر العبارة، حيث x عدد حقيقي:', 'B = ' + exprB,
                 'بيّن أنّ B = ' + facB],
        indice: 'انشر الجداء ' + facB + ' و قارنه بـ B',
        etapes: [
          ['ننشر الجداء',
           '(x - ' + j + ')(x - √' + r + ') = x^2 - √' + r + ' x - ' + mono(j, 'x')
           + ' + ' + R(j, r)],
          ['نجمع حدود x',
           '-√' + r + ' x - ' + mono(j, 'x') + ' = -(' + j + ' + √' + r + ')x'],
          ['نقارن بالعبارة B',
           'x^2 - (' + j + ' + √' + r + ')x + ' + R(j, r) + ' = B'],
          ['النتيجة', 'B = ' + facB]
        ],
        controle: Object.assign({ claims: [[exprB, facB]] }, libre)
      },
      {
        enonce: ['بيّن أنّ:', 'B - A = ' + facBA],
        indice: 'استعمل الشكلين المفكّكين: (x - ' + j + ') عامل مشترك بين A و B',
        etapes: [
          ['نستعمل الشكل المفكّك لـ A', 'A = ' + facA],
          ['نستعمل الشكل المفكّك لـ B', 'B = ' + facB],
          ['نطرح', 'B - A = ' + facB + ' - ' + facA],
          ['نضع (x - ' + j + ') عاملا مشتركا',
           facB + ' - ' + facA + ' = (x - ' + j + ')((x - √' + r + ') - ' + P + ')'],
          ['النتيجة', 'B - A = ' + facBA]
        ],
        controle: Object.assign({ claims: [['B - A', facBA]] }, libre)
      }
    ];
  }

  // =========================================================================
  // EXERCICE 12 — a = u + v√w, b = u - v√w, u² - v²w = 1.
  // Six volets, mais un seul produit : E = b(x - K).
  // =========================================================================
  const PELL = [[3, 2, 2], [2, 1, 3], [7, 4, 3], [5, 2, 6], [8, 3, 7], [4, 1, 15]];

  function type12() {
    const [u, v, w] = choix(PELL);
    const a = sAdd(num(u), S(rat(v), w));
    const b = sSub(num(u), S(rat(v), w));
    const ta = sTxt(a), tb = sTxt(b);
    // E = 1/a (p x - q) - b(r x + s), avec p - r = 1 : E = b(x - K), K = q + s.
    const rr = ent(1, 3), p = rr + 1, q = ent(1, 4), s = ent(1, 4);
    const K = q + s;
    const S2 = sSub(b, a);                               // 1/a - 1/b = b - a

    const exprS = '1/(' + ta + ') - 1/(' + tb + ')';
    const exprE = '1/(' + ta + ') (' + mono(p, 'x') + ' - ' + q + ') - (' + tb
                + ')(' + mono(rr, 'x') + ' + ' + s + ')';
    const facE = '(' + tb + ')(x - ' + K + ')';
    const x0 = '√' + w + ' + ' + K;
    const valE0 = sMul(b, sSqrt(num(w)));                // E en x = √w + K

    return [
      {
        enonce: ['ليكن العددان a و b حيث:', 'a = ' + ta, 'b = ' + tb,
                 'بيّن أنّ a مقلوب b'],
        indice: 'احسب الجداء a × b بالمتطابقة (x + y)(x - y) = x^2 - y^2',
        etapes: [
          ['نكتب الجداء', 'a × b = (' + ta + ')(' + tb + ')'],
          ['نستعمل المتطابقة',
           '(' + ta + ')(' + tb + ') = ' + u + '^2 - (' + R(v, w) + ')^2'],
          ['نحسب المربّعين',
           u + '^2 - (' + R(v, w) + ')^2 = ' + carre(u) + ' - ' + carre(v) * w],
          ['نستنتج', carre(u) + ' - ' + carre(v) * w + ' = 1'],
          ['النتيجة', 'a × b = 1، إذن a مقلوب b']
        ],
        controle: {
          env: { a: ta, b: tb },
          claims: [['a × b', '1'], ['a', '1/b']]
        }
      },
      {
        enonce: ['احسب العبارة:', 'S = ' + exprS],
        indice: 'مقلوب ' + ta + ' هو ' + tb + ': لا حاجة لتوحيد المقامين',
        etapes: [
          ['مقلوب العدد الأوّل', '1/(' + ta + ') = ' + tb],
          ['مقلوب العدد الثاني', '1/(' + tb + ') = ' + ta],
          ['نطرح', 'S = (' + tb + ') - (' + ta + ')'],
          ['نختصر', '(' + tb + ') - (' + ta + ') = ' + sTxt(S2)],
          ['النتيجة', 'S = ' + sTxt(S2)]
        ],
        controle: { env: { S: exprS }, claims: [['S', sTxt(S2)]] }
      },
      {
        enonce: ['نعتبر العبارة، حيث x عدد حقيقي:', 'E = ' + exprE,
                 'فكّك E إلى جداء عوامل'],
        indice: 'ابدأ بإنطاق المقام: 1/(' + ta + ') = ' + tb,
        etapes: [
          ['نُنطق المقام', '1/(' + ta + ') = ' + tb],
          ['نعيد كتابة E',
           'E = (' + tb + ')(' + mono(p, 'x') + ' - ' + q + ') - (' + tb + ')('
           + mono(rr, 'x') + ' + ' + s + ')'],
          ['نضع (' + tb + ') عاملا مشتركا',
           'E = (' + tb + ')[(' + mono(p, 'x') + ' - ' + q + ') - (' + mono(rr, 'x')
           + ' + ' + s + ')]'],
          ['نختصر ما بين المعقفين',
           '(' + mono(p, 'x') + ' - ' + q + ') - (' + mono(rr, 'x') + ' + ' + s
           + ') = x - ' + K],
          ['النتيجة', 'E = ' + facE]
        ],
        controle: {
          libres: ['x'], derives: { E: exprE },
          claims: [[exprE, facE]]
        }
      },
      {
        enonce: ['احسب E في حالة:', 'x = ' + x0],
        indice: 'استعمل الشكل المفكّك: x - ' + K + ' يصير √' + w,
        etapes: [
          ['ننطلق من الشكل المفكّك', 'E = ' + facE],
          ['نحسب العامل الثاني', 'x - ' + K + ' = √' + w],
          ['نضرب', 'E = (' + tb + ')√' + w],
          ['ننشر', '(' + tb + ')√' + w + ' = ' + sTxt(valE0)],
          ['النتيجة', 'E = ' + sTxt(valE0)]
        ],
        controle: {
          env: { x: x0, E: exprE },
          claims: [['E', sTxt(valE0)]]
        }
      },
      {
        enonce: ['أوجد العدد الحقيقي x حيث:', 'E = 0'],
        indice: 'جداء معدوم، و العدد ' + tb + ' ليس معدوما',
        etapes: [
          ['ننطلق من الشكل المفكّك', 'E = ' + facE],
          ['العامل الأوّل غير معدوم',
           'العدد ' + tb + ' ليس معدوما، لأنّ جداءه بـ ' + ta + ' يساوي 1'],
          ['يبقى العامل الثاني', 'x - ' + K + ' = 0'],
          ['نحلّ', 'x = ' + K],
          ['نتحقّق', 'E = 0']
        ],
        controle: { env: { x: String(K), E: exprE }, claims: [['E', '0']] }
      },
      {
        enonce: ['أوجد العدد الحقيقي x حيث:', 'E = ' + tb],
        indice: 'قارن ' + facE + ' بـ ' + tb + ': ماذا يجب أن يساوي القوس؟',
        etapes: [
          ['ننطلق من الشكل المفكّك', 'E = ' + facE],
          ['نقسم على ' + tb + ' غير المعدوم', 'x - ' + K + ' = 1'],
          ['نحلّ', 'x = ' + (K + 1)],
          ['نتحقّق', 'E = ' + tb]
        ],
        controle: { env: { x: String(K + 1), E: exprE }, claims: [['E', tb]] }
      }
    ];
  }

  // =========================================================================
  // EXERCICE 13 — a = p√s + √t, b = p√s - √t, avec p²s - t = 1.
  // =========================================================================
  const RACINES = [[1, 3, 2], [2, 3, 11], [2, 2, 7], [2, 5, 19], [3, 2, 17],
                   [3, 3, 26], [2, 6, 23]];

  function type13() {
    const [p, s, t] = choix(RACINES);
    const a = sAdd(S(rat(p), s), sSqrt(num(t)));
    const b = sSub(S(rat(p), s), sSqrt(num(t)));
    const ta = sTxt(a), tb = sTxt(b);
    const m = ent(2, 4);                                 // c = -m/a
    const valC = sMul(num(-m), b);

    // A = -m2(n√u - 1) - √u(√u + q)
    const m2 = ent(2, 4), n2 = ent(2, 4), q2 = ent(2, 5);
    const u2 = choix(LIBRES);
    const valA = sSub(sMul(num(-m2), sSub(S(rat(n2), u2), num(1))),
                      sMul(sSqrt(num(u2)), sAdd(sSqrt(num(u2)), num(q2))));
    // B = (x - j)(c1 x - c2) - (x - j)(c3 x + c4)
    const j = ent(1, 3), c3 = ent(1, 3), c1 = c3 + ent(1, 2);
    const c2 = ent(1, 4), c4 = ent(1, 5);
    const dc = c1 - c3, dk = c2 + c4;
    if (dk % dc) return type13();                        // pour une racine simple

    const exprC = '-' + m + '(1/(' + ta + '))';
    const exprA = '-' + m2 + '(' + R(n2, u2) + ' - 1) - √' + u2 + '(√' + u2 + ' + '
                + q2 + ')';
    const exprB = '(x - ' + j + ')(' + mono(c1, 'x') + ' - ' + c2 + ') - (x - ' + j
                + ')(' + mono(c3, 'x') + ' + ' + c4 + ')';
    const facB = '(x - ' + j + ')(' + mono(dc, 'x') + ' - ' + dk + ')';
    const sol2 = frac(dk, dc);

    return [
      {
        enonce: ['ليكن العددان a و b حيث:', 'a = ' + ta, 'b = ' + tb,
                 'بيّن أنّ a مقلوب b'],
        indice: 'استعمل المتطابقة (x + y)(x - y) = x^2 - y^2',
        etapes: [
          ['نكتب الجداء', 'a × b = (' + ta + ')(' + tb + ')'],
          ['نستعمل المتطابقة',
           '(' + ta + ')(' + tb + ') = (' + R(p, s) + ')^2 - (√' + t + ')^2'],
          ['نحسب المربّعين',
           '(' + R(p, s) + ')^2 - (√' + t + ')^2 = ' + carre(p) * s + ' - ' + t],
          ['نستنتج', carre(p) * s + ' - ' + t + ' = 1'],
          ['النتيجة', 'a × b = 1، إذن a مقلوب b']
        ],
        controle: { env: { a: ta, b: tb }, claims: [['a × b', '1'], ['a', '1/b']] }
      },
      {
        enonce: ['احسب العبارة:', 'c = ' + exprC],
        indice: 'مقلوب a معلوم من السؤال السابق: إنّه b',
        etapes: [
          ['مقلوب a', '1/(' + ta + ') = ' + tb],
          ['نعوّض', 'c = -' + m + '(' + tb + ')'],
          ['ننشر', '-' + m + '(' + tb + ') = ' + sTxt(valC)],
          ['النتيجة', 'c = ' + sTxt(valC)]
        ],
        controle: { env: { c: exprC }, claims: [['c', sTxt(valC)]] }
      },
      {
        enonce: ['انشر و اختصر العبارة:', 'A = ' + exprA],
        indice: 'انتبه لإشارة -' + m2 + ' أمام القوس، و إلى أنّ √' + u2 + ' × √'
                + u2 + ' = ' + u2,
        etapes: [
          ['ننشر القوس الأوّل',
           '-' + m2 + '(' + R(n2, u2) + ' - 1) = ' + sTxt(sMul(num(-m2), sSub(S(rat(n2), u2), num(1))))],
          ['ننشر القوس الثاني',
           '√' + u2 + '(√' + u2 + ' + ' + q2 + ') = ' + sTxt(sMul(sSqrt(num(u2)), sAdd(sSqrt(num(u2)), num(q2))))],
          ['نطرح',
           'A = ' + sTxt(sMul(num(-m2), sSub(S(rat(n2), u2), num(1)))) + ' - ('
           + sTxt(sMul(sSqrt(num(u2)), sAdd(sSqrt(num(u2)), num(q2)))) + ')'],
          ['النتيجة', 'A = ' + sTxt(valA)]
        ],
        controle: { env: { A: exprA }, claims: [['A', sTxt(valA)]] }
      },
      {
        enonce: ['فكّك إلى جداء عوامل العبارة، حيث x عدد حقيقي:', 'B = ' + exprB],
        indice: 'العبارة (x - ' + j + ') موجودة في الحدّين',
        etapes: [
          ['نتعرّف على العامل المشترك', 'العبارة (x - ' + j + ') موجودة في الحدّين'],
          ['نضع العامل المشترك',
           'B = (x - ' + j + ')[(' + mono(c1, 'x') + ' - ' + c2 + ') - ('
           + mono(c3, 'x') + ' + ' + c4 + ')]'],
          ['نختصر ما بين المعقفين',
           '(' + mono(c1, 'x') + ' - ' + c2 + ') - (' + mono(c3, 'x') + ' + ' + c4
           + ') = ' + mono(dc, 'x') + ' - ' + dk],
          ['النتيجة', 'B = ' + facB]
        ],
        controle: {
          libres: ['x'], derives: { B: exprB },
          claims: [[exprB, facB]]
        }
      },
      {
        enonce: ['أوجد x في حالة:', 'B = 0'],
        indice: 'جداء عاملين معدوم يعني أنّ أحدهما على الأقلّ معدوم',
        etapes: [
          ['ننطلق من الشكل المفكّك', 'B = ' + facB],
          ['جداء معدوم',
           'B = 0 يعني x - ' + j + ' = 0 أو ' + mono(dc, 'x') + ' - ' + dk + ' = 0'],
          ['نحلّ الحالة الأولى', 'x = ' + j],
          ['نحلّ الحالة الثانية', dc + ' × ' + sol2 + ' - ' + dk + ' = 0'],
          ['نتحقّق من الحلّ الثاني',
           '(' + sol2 + ' - ' + j + ')(' + dc + ' × ' + sol2 + ' - ' + dk + ') = 0'],
          ['النتيجة', 'x = ' + j + ' أو x = ' + sol2]
        ],
        controle: {
          env: { x: String(j), B: exprB },
          claims: [['B', '0'],
                   ['(' + sol2 + ' - ' + j + ')(' + dc + ' × ' + sol2 + ' - ' + dk + ')', '0']]
        }
      }
    ];
  }

  const API = { type11, type12, type13, PELL, RACINES };
  if (M) module.exports = API; else racine.Produit = API;
})(typeof window !== 'undefined' ? window : globalThis);
