// Seconde fiche : exercices 11 à 14 — factorisation, nombres inverses,
// valeurs absolues, équations.
//
// Même méthode que `reels.js` (voir ../METHODE.md) : une page par exercice, un
// volet par question de l'énoncé, et l'on ne tire que ce que l'exercice
// supporte.
//
//   — 11 (factoriser) : libre. Chaque expression est un schéma —
//     « √(mn) + √(mp) », « facteur commun entre parenthèses » — dont on tire les
//     radicandes.
//   — 12 (inverses) : contraint. Tout repose sur (u + v√r)(u - v√r) = 1, donc
//     sur u² - r v² = 1 — l'équation de Pell, comme au 18. On tire dans ses
//     solutions.
//   — 13 (valeurs absolues) : libre, mais chaque tirage doit garder les SIGNES
//     de la fiche. « |5 - √3| = 5 - √3 » n'a d'intérêt que si √3 < 5 ; un
//     tirage qui inverserait le signe changerait l'exercice sans prévenir, donc
//     les générateurs vérifient chaque signe au lieu de l'espérer.
//   — 14 (A = (x-k)(x+k)) : libre. On impose seulement que la différence des
//     deux parenthèses redonne (x + k), ce qui est la forme de la fiche.
//
// RÉSERVE SUR L'EXPRESSION « e » DU 11. La fiche imprime
//     e = 3(√3-2) + √2(√3-2) + 3(√3+2)
// et ce troisième terme, avec son « +2 », ne partage aucun facteur avec les
// deux premiers : la somme vaut 6√3 + √6 - 2√2, qui n'est pas un produit.
// L'exercice demandant de factoriser, on lit le troisième terme comme un
// « q(√3 - 2) » — le schéma des deux autres — ce qui donne (√3 - 2)(3 + q + √2).
// Si la fiche voulait vraiment « +2 », l'énoncé est à corriger, pas la page.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;
  const { rat, num, S, sAdd, sSub, sNeg, sMul, sSqrt, sTxt, ent, choix } = F;

  const R = (c, r) => (c === 1 ? '√' + r : c + '√' + r);
  const carre = n => n * n;
  // Un radicande qui ne se simplifie pas : sinon « √4 » s'écrirait sous un
  // radical alors qu'il vaut 2, et l'exercice perdrait son objet.
  const LIBRES = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15];
  const PELL = [[3, 2, 2], [2, 1, 3], [7, 4, 3], [5, 2, 6], [8, 3, 7]];

  // Trois entiers distincts pris dans une liste.
  function distincts(liste, k) {
    const l = liste.slice();
    const out = [];
    while (out.length < k && l.length) out.push(l.splice(ent(0, l.length - 1), 1)[0]);
    return out;
  }

  // =========================================================================
  // EXERCICE 11 — فكّك إلى جداء عوامل. Cinq expressions, cinq volets.
  // =========================================================================
  function type11() {
    const [m, n, p] = distincts(LIBRES, 3);            // a = √(mn) + √(mp)
    const k = ent(2, 4), t = ent(2, 3);                // b = k·t√α - k√β
    const [al, be] = distincts(LIBRES, 2);             // b, c
    const [ga, de] = distincts(LIBRES, 2);             // c = (√ga + √de) - √ga(…)
    const u = choix([3, 5, 6, 7]), j = ent(1, 2);      // d, e : le facteur (√u - j)
    const kd = ent(2, 4);                              // d = (kd√u - kd·j) + (√u - j)√w
    const w = choix(LIBRES.filter(x => x !== u));
    const p1 = ent(2, 5);
    let p2 = ent(2, 5);
    const w2 = choix(LIBRES.filter(x => x !== u));

    // Les radicandes composés doivent rester lisibles, et (√u - j) doit être
    // non nul — sinon « mettre en facteur » n'aurait plus de sens.
    if (m * n > 60 || m * p > 60 || carre(j) === u || p1 === p2) return type11();
    if (p1 + p2 < 4) p2 = p1 + 2;

    const expA = '√' + m * n + ' + √' + m * p;
    const expB = R(k * t, al) + ' - ' + R(k, be);
    const expC = '(√' + ga + ' + √' + de + ') - √' + ga + '(√' + ga + ' + √' + de + ')';
    const expD = '(' + R(kd, u) + ' - ' + kd * j + ') + (√' + u + ' - ' + j + ')√' + w;
    const expE = p1 + '(√' + u + ' - ' + j + ') + √' + w2 + '(√' + u + ' - ' + j
               + ') + ' + p2 + '(√' + u + ' - ' + j + ')';

    const env = { a: expA, b: expB, c: expC, d: expD, e: expE };
    const facA = '√' + m + '(√' + n + ' + √' + p + ')';
    const facB = k + '(' + R(t, al) + ' - √' + be + ')';
    const facC = '(√' + ga + ' + √' + de + ')(1 - √' + ga + ')';
    const facD = '(√' + u + ' - ' + j + ')(' + kd + ' + √' + w + ')';
    const facE = '(√' + u + ' - ' + j + ')(' + (p1 + p2) + ' + √' + w2 + ')';

    const consigne = 'فكّك إلى جداء عوامل العبارة التالية:';
    return [
      {
        enonce: [consigne, 'a = ' + expA],
        indice: 'اكتب كل جذر على شكل جداء جذرين: العامل المشترك هو √' + m,
        etapes: [
          ['نفكّك الجذر الأوّل', '√' + m * n + ' = √' + m + ' √' + n],
          ['نفكّك الجذر الثاني', '√' + m * p + ' = √' + m + ' √' + p],
          ['نضع √' + m + ' عاملا مشتركا',
           '√' + m + ' √' + n + ' + √' + m + ' √' + p + ' = ' + facA],
          ['النتيجة', 'a = ' + facA]
        ],
        controle: { env, claims: [['a', facA]] }
      },
      {
        enonce: [consigne, 'b = ' + expB],
        indice: 'العامل المشترك هنا عدد: ' + k,
        etapes: [
          ['نبحث عن عامل مشترك عددي', k * t + ' = ' + k + ' × ' + t],
          ['نكتب الحدّين بهذا العامل',
           expB + ' = ' + k + ' × ' + R(t, al) + ' - ' + k + ' × √' + be],
          ['نضع ' + k + ' عاملا مشتركا',
           k + ' × ' + R(t, al) + ' - ' + k + ' × √' + be + ' = ' + facB],
          ['النتيجة', 'b = ' + facB]
        ],
        controle: { env, claims: [['b', facB]] }
      },
      {
        enonce: [consigne, 'c = ' + expC],
        indice: 'العامل المشترك عبارة كاملة، و معامل الحدّ الأوّل هو 1',
        etapes: [
          ['نتعرّف على العامل المشترك',
           'العبارة (√' + ga + ' + √' + de + ') موجودة في الحدّين'],
          ['نُظهر معامل الحدّ الأوّل',
           '(√' + ga + ' + √' + de + ') = 1(√' + ga + ' + √' + de + ')'],
          ['نضع العامل المشترك',
           '1(√' + ga + ' + √' + de + ') - √' + ga + '(√' + ga + ' + √' + de
           + ') = ' + facC],
          ['النتيجة', 'c = ' + facC]
        ],
        controle: { env, claims: [['c', facC]] }
      },
      {
        enonce: [consigne, 'd = ' + expD],
        indice: 'ابدأ بتفكيك القوس الأوّل: ' + kd + ' عامل مشترك فيه',
        etapes: [
          ['نفكّك القوس الأوّل',
           R(kd, u) + ' - ' + kd * j + ' = ' + kd + '(√' + u + ' - ' + j + ')'],
          ['نتعرّف على العامل المشترك',
           'العبارة (√' + u + ' - ' + j + ') صارت موجودة في الحدّين'],
          ['نضع (√' + u + ' - ' + j + ') عاملا مشتركا',
           kd + '(√' + u + ' - ' + j + ') + (√' + u + ' - ' + j + ')√' + w
           + ' = ' + facD],
          ['النتيجة', 'd = ' + facD]
        ],
        controle: { env, claims: [['d', facD]] }
      },
      {
        enonce: [consigne, 'e = ' + expE],
        indice: 'ثلاثة حدود، و نفس العامل المشترك (√' + u + ' - ' + j + ')',
        etapes: [
          ['نتعرّف على العامل المشترك',
           'العبارة (√' + u + ' - ' + j + ') موجودة في الحدود الثلاثة'],
          ['نضع العامل المشترك',
           expE + ' = (√' + u + ' - ' + j + ')(' + p1 + ' + √' + w2 + ' + ' + p2 + ')'],
          ['نجمع المعاملين العدديين', p1 + ' + ' + p2 + ' = ' + (p1 + p2)],
          ['نختصر العامل الثاني',
           '(√' + u + ' - ' + j + ')(' + p1 + ' + √' + w2 + ' + ' + p2 + ') = ' + facE],
          ['النتيجة', 'e = ' + facE]
        ],
        controle: { env, claims: [['e', facE]] }
      }
    ];
  }

  // =========================================================================
  // EXERCICE 12 — deux nombres inverses, puis quatre expressions à réduire.
  // Tout se déduit de 1/(u + v√r) = u - v√r. Le calcul de tête remplace la
  // rationalisation dès que l'élève a vu la question 1.
  // =========================================================================
  function type12() {
    const [u, v, r] = choix(PELL);
    const A = sAdd(num(u), S(rat(v), r));              // u + v√r
    const B = sSub(num(u), S(rat(v), r));              // u - v√r
    const ta = sTxt(A), tb = sTxt(B);
    const mm = ent(2, 3), nn = 2 * mm;                 // C = (mm/B) : (nn/A)

    const expA = '1/(' + ta + ') + ' + ta;
    const expB = '1/(' + ta + ') + 1/(' + tb + ')';
    const expC = mm + '/(' + tb + ') : ' + nn + '/(' + ta + ')';
    const expD = '1/(' + ta + ') : (' + tb + ')';
    const env = { A: expA, B: expB, C: expC, D: expD };

    const somme = sAdd(A, B);                          // 2u
    const valC = sMul(sMul(A, A), S(rat(mm, nn)));     // mm·A²/nn

    return [
      {
        enonce: ['بيّن أنّ العددين ' + tb + ' و ' + ta + ' مقلوبان'],
        indice: 'احسب جداءهما بالمتطابقة (x - y)(x + y) = x^2 - y^2',
        etapes: [
          ['نتعرّف على الشكل', 'العددان من الشكل x - y و x + y'],
          ['نستعمل المتطابقة',
           '(' + tb + ')(' + ta + ') = ' + u + '^2 - (' + R(v, r) + ')^2'],
          ['نحسب المربّعين',
           u + '^2 - (' + R(v, r) + ')^2 = ' + carre(u) + ' - ' + carre(v) * r],
          ['نستنتج الجداء', carre(u) + ' - ' + carre(v) * r + ' = 1'],
          ['النتيجة', 'جداؤهما يساوي 1، إذن كلّ منهما مقلوب الآخر']
        ],
        controle: { env, claims: [['(' + tb + ')(' + ta + ')', '1']] }
      },
      {
        enonce: ['اختصر العبارة التالية:', 'A = ' + expA],
        indice: 'مقلوب ' + ta + ' معلوم من السؤال 1: إنّه ' + tb,
        etapes: [
          ['نُنطق المقام', '1/(' + ta + ') = ' + tb],
          ['نعوّض في A', 'A = (' + tb + ') + ' + ta],
          ['نجمع الحدود المتشابهة', '(' + tb + ') + ' + ta + ' = ' + sTxt(somme)],
          ['النتيجة', 'A = ' + sTxt(somme)]
        ],
        controle: { env, claims: [['A', sTxt(somme)]] }
      },
      {
        enonce: ['اختصر العبارة التالية:', 'B = ' + expB],
        indice: 'كل مقام هو مقلوب الآخر: عوّض الكسرين قبل أن تجمع',
        etapes: [
          ['مقلوب العدد الأوّل', '1/(' + ta + ') = ' + tb],
          ['مقلوب العدد الثاني', '1/(' + tb + ') = ' + ta],
          ['نجمع المقلوبين', 'B = (' + tb + ') + (' + ta + ')'],
          ['النتيجة', 'B = ' + sTxt(somme)]
        ],
        controle: { env, claims: [['B', sTxt(somme)]] }
      },
      {
        enonce: ['اختصر العبارة التالية:', 'C = ' + expC],
        indice: 'انطق المقامين أوّلا، ثمّ اقسم: القسمة على عدد هي الضرب في مقلوبه',
        etapes: [
          ['نُنطق مقام البسط', mm + '/(' + tb + ') = ' + mm + '(' + ta + ')'],
          ['نُنطق مقام المقام', nn + '/(' + ta + ') = ' + nn + '(' + tb + ')'],
          ['نكتب القسمة',
           'C = ' + mm + '(' + ta + ') : ' + nn + '(' + tb + ')'],
          ['نبسّط بالعامل ' + mm,
           mm + '(' + ta + ') : ' + nn + '(' + tb + ') = (' + ta + ') : '
           + (nn / mm) + '(' + tb + ')'],
          ['نستعمل أنّ العددين مقلوبان',
           '(' + ta + ') : ' + (nn / mm) + '(' + tb + ') = (' + ta + ')(' + ta
           + ') : ' + (nn / mm)],
          ['النتيجة', 'C = ' + sTxt(valC)]
        ],
        controle: { env, claims: [['C', sTxt(valC)]] }
      },
      {
        enonce: ['اختصر العبارة التالية:', 'D = ' + expD],
        indice: 'انطق المقام أوّلا: ماذا تلاحظ بين البسط الناتج و المقام؟',
        etapes: [
          ['نُنطق مقام البسط', '1/(' + ta + ') = ' + tb],
          ['نكتب القسمة', 'D = (' + tb + ') : (' + tb + ')'],
          ['قسمة عدد غير معدوم على نفسه', '(' + tb + ') : (' + tb + ') = 1'],
          ['النتيجة', 'D = 1']
        ],
        controle: { env, claims: [['D', '1']] }
      }
    ];
  }

  // =========================================================================
  // EXERCICE 13 — valeurs absolues, puis équations.
  //
  // Lever une valeur absolue, c'est d'abord établir un SIGNE. Chaque tirage est
  // donc contrôlé : on ne garde que ceux où les signes sont ceux de la fiche.
  // =========================================================================
  function type13() {
    // Les signes que la fiche suppose sont CONSTRUITS, pas espérés : on tire le
    // majorant d'abord, puis le radicande parmi ceux qu'il domine. Un tirage
    // qui renverserait un signe ne changerait pas seulement un nombre, il
    // changerait l'exercice — « |5 - √3| » ne se lève pas comme « |√3 - 5| ».
    const sous = k => [2, 3, 5, 6, 7].filter(x => x < carre(k));

    const k1 = ent(2, 4), a1 = choix(sous(k1));                 // √a1 < k1
    const k2 = ent(4, 6);
    let j2 = ent(3, 5);
    if (j2 === k2) j2 = k2 - 1;                                 // sinon B = 0
    const a2 = choix(sous(Math.min(k2, j2)));                   // √a2 < k2 et < j2
    const k3 = ent(4, 6);
    const a3 = choix([2, 3, 5]), b3 = choix(sous(k3));          // √a3 > 1, √b3 < k3
    const k4 = ent(1, 2);
    const [m4, n4] = choix([[3, 2], [6, 5], [7, 6], [11, 10]]
      .filter(c => c[0] > carre(k4)));                          // m4 - n4 = 1, √m4 > k4
    const p4 = choix([2, 3, 5]);

    const kq = ent(2, 4), cq = ent(3, 7);                       // √((x-kq)^2) = cq
    const tq = choix([2, 3, 5, 6]);                             // √(x^2) = √tq
    // |pq x - qq| = rq : on part des DEUX solutions, seul moyen de garantir
    // qu'elles tombent juste. u1 > u2, qq = pq(u1+u2)/2, rq = pq(u1-u2)/2.
    const u1 = ent(2, 5), u2 = ent(-3, 1);
    const pq = ((u1 + u2) % 2) ? 2 : choix([2, 3]);
    const qq = pq * (u1 + u2) / 2, rq = pq * (u1 - u2) / 2;
    const sq = choix([3, 5, 6, 7]);                             // |x + 1| = |√sq - 1|
    if (qq < 1 || rq < 2) return type13();

    const expA = '|√' + a1 + ' - ' + k1 + '| + (-√' + a1 + ')';
    const expB = '|' + k2 + ' - √' + a2 + '| - |√' + a2 + ' - ' + j2 + '|';
    const expC = '|(√' + a3 + ' - 1)(√' + b3 + ' - ' + k3 + ')|';
    const expD = '|(√' + m4 + ' - ' + k4 + ')/(√' + m4 + ' - √' + n4 + ')| × |(-√'
               + m4 + ' - √' + p4 + ')/(√' + m4 + ' + √' + n4 + ')|';
    const env = { A: expA, B: expB, C: expC, D: expD };

    const valA = sSub(num(k1), sMul(num(2), sSqrt(num(a1))));   // k1 - 2√a1
    const valB = num(k2 - j2);
    const valC = sMul(sSub(sSqrt(num(a3)), num(1)), sSub(num(k3), sSqrt(num(b3))));
    const valD = sMul(sSub(sSqrt(num(m4)), num(k4)), sAdd(sSqrt(num(m4)), sSqrt(num(p4))));

    const eq = (titre, expr, sol, etapes, claims) => ({
      enonce: ['جد العدد الحقيقي x بحيث:', expr],
      indice: titre,
      etapes,
      controle: { env: { x: sol }, claims: claims }
    });

    return [
      {
        enonce: ['اختصر العبارة التالية:', 'A = ' + expA],
        indice: 'قارن √' + a1 + ' بـ ' + k1 + ' قبل رفع القيمة المطلقة',
        etapes: [
          ['نقارن العددين',
           '√' + a1 + ' = √' + a1 + ' < √' + carre(k1) + ' = ' + k1],
          ['نرفع القيمة المطلقة',
           '|√' + a1 + ' - ' + k1 + '| = ' + k1 + ' - √' + a1],
          ['نجمع', 'A = (' + k1 + ' - √' + a1 + ') - √' + a1],
          ['النتيجة', 'A = ' + sTxt(valA)]
        ],
        controle: { env, claims: [['A', sTxt(valA)]] }
      },
      {
        enonce: ['اختصر العبارة التالية:', 'B = ' + expB],
        indice: '√' + a2 + ' أصغر من ' + k2 + ' و أصغر من ' + j2 + ' في آن واحد',
        etapes: [
          ['إشارة القوس الأوّل',
           '√' + a2 + ' < √' + carre(k2) + ' = ' + k2 + '، إذن ' + k2 + ' - √' + a2 + ' > 0'],
          ['إشارة القوس الثاني',
           '√' + a2 + ' < √' + carre(j2) + ' = ' + j2 + '، إذن √' + a2 + ' - ' + j2 + ' < 0'],
          ['نرفع القيمتين المطلقتين',
           expB + ' = (' + k2 + ' - √' + a2 + ') - (' + j2 + ' - √' + a2 + ')'],
          ['يتلاشى الجذر',
           '(' + k2 + ' - √' + a2 + ') - (' + j2 + ' - √' + a2 + ') = ' + k2 + ' - ' + j2],
          ['النتيجة', 'B = ' + sTxt(valB)]
        ],
        controle: { env, claims: [['B', sTxt(valB)]] }
      },
      {
        enonce: ['اختصر العبارة التالية:', 'C = ' + expC],
        indice: 'قيمة مطلقة لجداء: حدّد إشارة كل قوس ثمّ إشارة الجداء',
        etapes: [
          ['إشارة القوس الأوّل', '√' + a3 + ' > 1، إذن √' + a3 + ' - 1 > 0'],
          ['إشارة القوس الثاني',
           '√' + b3 + ' < √' + carre(k3) + ' = ' + k3 + '، إذن √' + b3 + ' - ' + k3 + ' < 0'],
          ['إشارة الجداء', 'موجب في سالب يعطي سالبا، إذن الجداء سالب'],
          ['نرفع القيمة المطلقة',
           expC + ' = (√' + a3 + ' - 1)(' + k3 + ' - √' + b3 + ')'],
          ['ننشر', '(√' + a3 + ' - 1)(' + k3 + ' - √' + b3 + ') = ' + sTxt(valC)],
          ['النتيجة', 'C = ' + sTxt(valC)]
        ],
        controle: { env, claims: [['C', sTxt(valC)]] }
      },
      {
        enonce: ['اختصر العبارة التالية:', 'D = ' + expD],
        indice: 'جداء المقامين هو (√' + m4 + ' - √' + n4 + ')(√' + m4 + ' + √' + n4
                + '): احسبه أوّلا',
        etapes: [
          ['إشارة البسط الأوّل',
           k4 + ' = √' + carre(k4) + ' < √' + m4 + '، إذن √' + m4 + ' - ' + k4 + ' > 0'],
          ['إشارة المقامين',
           '√' + n4 + ' < √' + m4 + '، إذن المقامان موجبان'],
          ['نرفع القيمة المطلقة الأولى',
           '|(√' + m4 + ' - ' + k4 + ')/(√' + m4 + ' - √' + n4 + ')| = (√' + m4
           + ' - ' + k4 + ')/(√' + m4 + ' - √' + n4 + ')'],
          ['نرفع القيمة المطلقة الثانية',
           '|(-√' + m4 + ' - √' + p4 + ')/(√' + m4 + ' + √' + n4 + ')| = (√' + m4
           + ' + √' + p4 + ')/(√' + m4 + ' + √' + n4 + ')'],
          ['جداء المقامين',
           '(√' + m4 + ' - √' + n4 + ')(√' + m4 + ' + √' + n4 + ') = ' + m4 + ' - '
           + n4 + ' = 1'],
          ['يبقى جداء البسطين',
           'D = (√' + m4 + ' - ' + k4 + ')(√' + m4 + ' + √' + p4 + ')'],
          ['النتيجة', 'D = ' + sTxt(valD)]
        ],
        controle: { env, claims: [['D', sTxt(valD)]] }
      },
      eq('√(y^2) = |y| مهما كان y حقيقيا', '√((x - ' + kq + ')^2) = ' + cq,
         String(kq + cq),
        [
          ['نستعمل خاصية الجذر', '√((x - ' + kq + ')^2) = |x - ' + kq + '|'],
          ['نكتب المعادلة بدون جذر', '|x - ' + kq + '| = ' + cq],
          ['نفكّ القيمة المطلقة',
           'يعني x - ' + kq + ' = ' + cq + ' أو x - ' + kq + ' = -' + cq],
          ['نتحقّق من الحلّ الأوّل', '|' + (kq + cq) + ' - ' + kq + '| = ' + cq],
          ['نتحقّق من الحلّ الثاني', '|(' + (kq - cq) + ') - ' + kq + '| = ' + cq],
          ['النتيجة', 'x = ' + (kq + cq) + ' أو x = ' + (kq - cq)]
        ],
        [['√((x - ' + kq + ')^2)', String(cq)],
         ['|' + (kq + cq) + ' - ' + kq + '|', String(cq)],
         ['|(' + (kq - cq) + ') - ' + kq + '|', String(cq)]]),
      eq('√(x^2) = |x|: العدد و مقابله لهما نفس القيمة المطلقة',
         '√(x^2) = √' + tq, '√' + tq,
        [
          ['نستعمل خاصية الجذر', '√(x^2) = |x|'],
          ['نكتب المعادلة بدون جذر', '|x| = √' + tq],
          ['نفكّ القيمة المطلقة', 'يعني x = √' + tq + ' أو x = -√' + tq],
          ['نتحقّق من الحلّ الأوّل', '|√' + tq + '| = √' + tq],
          ['نتحقّق من الحلّ الثاني', '|-√' + tq + '| = √' + tq],
          ['النتيجة', 'x = √' + tq + ' أو x = -√' + tq]
        ],
        [['√(x^2)', '√' + tq], ['|-√' + tq + '|', '√' + tq]]),
      // Les deux cas ne peuvent pas s'écrire avec le même x : la seconde racine
      // ne vérifie pas « pq x = qq + rq ». Le second cas est donc mené en
      // nombres, sans l'inconnue — ce qui est d'ailleurs ce qu'on écrit au
      // tableau une fois la disjonction posée.
      eq('|X| = r يعني X = r أو X = -r', '|' + pq + 'x - ' + qq + '| = ' + rq,
         String(u1),
        [
          ['نفكّ القيمة المطلقة',
           'يعني ' + pq + 'x - ' + qq + ' = ' + rq + ' أو ' + pq + 'x - ' + qq
           + ' = -' + rq],
          ['الحالة الأولى', pq + 'x = ' + qq + ' + ' + rq],
          ['نقسم على ' + pq, 'x = ' + u1],
          ['الحالة الثانية تعطي',
           pq + ' × (' + u2 + ') - ' + qq + ' = -' + rq],
          ['نتحقّق من الحلّ الأوّل',
           '|' + pq + ' × ' + u1 + ' - ' + qq + '| = ' + rq],
          ['نتحقّق من الحلّ الثاني',
           '|' + pq + ' × (' + u2 + ') - ' + qq + '| = ' + rq],
          ['النتيجة', 'x = ' + u1 + ' أو x = ' + u2]
        ],
        [['|' + pq + 'x - ' + qq + '|', String(rq)],
         ['|' + pq + ' × (' + u2 + ') - ' + qq + '|', String(rq)]]),
      eq('ابدأ برفع القيمة المطلقة في الطرف الأيمن',
         '|x + 1| = |√' + sq + ' - 1|', '√' + sq + ' - 2',
        [
          ['إشارة الطرف الأيمن',
           '1 = √1 < √' + sq + '، إذن √' + sq + ' - 1 > 0'],
          ['نرفع قيمته المطلقة', '|√' + sq + ' - 1| = √' + sq + ' - 1'],
          ['نفكّ القيمة المطلقة اليسرى',
           'يعني x + 1 = √' + sq + ' - 1 أو x + 1 = 1 - √' + sq],
          ['نتحقّق من الحلّ الأوّل',
           '|(√' + sq + ' - 2) + 1| = √' + sq + ' - 1'],
          ['نتحقّق من الحلّ الثاني', '|-√' + sq + ' + 1| = √' + sq + ' - 1'],
          ['النتيجة', 'x = √' + sq + ' - 2 أو x = -√' + sq]
        ],
        [['|x + 1|', '|√' + sq + ' - 1|'],
         ['|-√' + sq + ' + 1|', '√' + sq + ' - 1']])
    ];
  }

  // =========================================================================
  // EXERCICE 14 — A = (x - k)(p x + q) - (x - k)(r x + s).
  // On tire p - r = 1 et q - s = k : la seconde parenthèse se réduit alors à
  // (x + k), et A = x² - k², ce qui est la forme de la fiche.
  // =========================================================================
  function type14() {
    const k = ent(2, 5);
    const r = ent(1, 3), p = r + 1;
    const s = ent(1, 4), q = s + k;
    const t = choix([2, 3, 5, 6, 7]);                  // x = k - √t

    const mono = (c, v) => (c === 1 ? v : c + v);
    const expA = '(x - ' + k + ')(' + mono(p, 'x') + ' + ' + q + ') - (x - ' + k
               + ')(' + mono(r, 'x') + ' + ' + s + ')';
    const facA = '(x - ' + k + ')(x + ' + k + ')';
    const x0 = k + ' - √' + t;

    // A(k - √t) = (-√t)(2k - √t) = t - 2k√t, négatif car √t < 2k.
    const valA = sMul(sNeg(sSqrt(num(t))), sSub(num(2 * k), sSqrt(num(t))));
    const absA = sNeg(valA);

    return [
      {
        enonce: ['نعتبر العبارة A حيث x عدد حقيقي:', 'A = ' + expA,
                 'فكّك A إلى جداء عوامل'],
        indice: 'العبارة (x - ' + k + ') موجودة في الحدّين: ضعها عاملا مشتركا',
        etapes: [
          ['نتعرّف على العامل المشترك', 'العبارة (x - ' + k + ') موجودة في الحدّين'],
          ['نضع العامل المشترك',
           'A = (x - ' + k + ')[(' + mono(p, 'x') + ' + ' + q + ') - ('
           + mono(r, 'x') + ' + ' + s + ')]'],
          ['نختصر ما بين المعقفين',
           '(' + mono(p, 'x') + ' + ' + q + ') - (' + mono(r, 'x') + ' + ' + s
           + ') = x + ' + k],
          ['النتيجة', 'A = ' + facA]
        ],
        controle: {
          libres: ['x'], derives: { A: expA },
          claims: [['A', facA], [expA, facA]]
        }
      },
      {
        enonce: ['أوجد الأعداد الحقيقية x في حالة:', 'A = 0'],
        indice: 'جداء عاملين معدوم يعني أنّ أحدهما على الأقلّ معدوم',
        etapes: [
          ['ننطلق من الشكل المفكّك', 'A = ' + facA],
          ['جداء معدوم',
           'A = 0 يعني x - ' + k + ' = 0 أو x + ' + k + ' = 0'],
          ['نتحقّق من الحلّ الأوّل',
           '(' + k + ' - ' + k + ')(' + k + ' + ' + k + ') = 0'],
          ['نتحقّق من الحلّ الثاني',
           '((-' + k + ') - ' + k + ')((-' + k + ') + ' + k + ') = 0'],
          ['النتيجة', 'x = ' + k + ' أو x = -' + k]
        ],
        controle: {
          env: { x: String(k), A: expA },
          claims: [['A', '0'], ['(' + k + ' - ' + k + ')(' + k + ' + ' + k + ')', '0'],
                   ['((-' + k + ') - ' + k + ')((-' + k + ') + ' + k + ')', '0']]
        }
      },
      {
        enonce: ['أحسب |A| في حالة:', 'x = ' + x0],
        indice: 'استعمل الشكل المفكّك، ثمّ حدّد إشارة A قبل رفع القيمة المطلقة',
        etapes: [
          ['نحسب العامل الأوّل', 'x - ' + k + ' = -√' + t],
          ['نحسب العامل الثاني', 'x + ' + k + ' = ' + (2 * k) + ' - √' + t],
          ['نحسب الجداء',
           'A = (-√' + t + ')(' + (2 * k) + ' - √' + t + ') = ' + sTxt(valA)],
          ['نحدّد إشارة A',
           '√' + t + ' < √' + carre(2 * k) + ' = ' + (2 * k) + '، إذن A < 0'],
          ['نرفع القيمة المطلقة', '|A| = -A'],
          ['النتيجة', '|A| = ' + sTxt(absA)]
        ],
        controle: {
          env: { x: x0, A: expA },
          claims: [['A', sTxt(valA)], ['|A|', sTxt(absA)]]
        }
      }
    ];
  }

  const API = { type11, type12, type13, type14 };
  if (M) module.exports = API; else racine.Fiche2 = API;
})(typeof window !== 'undefined' ? window : globalThis);
