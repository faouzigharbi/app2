// « التمرين عدد 1 » — un seul exercice, onze questions, toutes accrochées à un
// même couple : a = 8 - 2√15 et b = 8 + 2√15, dont le produit vaut 4.
//
// Une page, un volet par question de l'énoncé. La méthode est décrite dans
// ../METHODE.md.
//
// FIDÈLE À L'ORIGINAL : les nombres sont ceux de la fiche, à l'identique. Le
// bouton « أرقام جديدة » n'y rebat que l'ordre des étapes.
//
// Ce que le validateur contrôle reste entier — chaque étape est réanalysée et
// recalculée en arithmétique exacte, chaque affirmation de l'énoncé vérifiée.
//
// CE QUE CET EXERCICE DEMANDE AU NOYAU. La question 4 pose d = √a - √b. Or
// √(8 - 2√15) vaut √5 - √3 : un radical imbriqué, qui ne s'écrit PAS sous la
// forme r + s√15 avec r et s rationnels. Le noyau le trouve en résolvant
// t² - p·t + q²d/4 = 0 puis en reprenant la racine de chaque t — c'est pour
// des questions comme celle-ci qu'il sait le faire.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);

  function exercice1() {
    const exprA = '2 × √((√15 - 4)^2) - √60 + 60/√60';
    const exprB = '√64 + 4√60 - √540';
    const exprE = '3√12 + √48 - √75 - √3 + √49';
    const exprC = '√(7 + 4√3)';
    const exprD = '√a - √b';
    const exprEE = 'a/b';
    const exprF = 'b/4 a^2 - a';
    const exprG = '√a(√b - 1/√a) + √b(√a - 1/√b)';
    // Les noms sont évalués dans l'ordre : c dépend de e, d de a et b, etc.
    const env = { a: exprA, b: exprB, e: exprE, c: exprC,
                  d: exprD, E: exprEE, F: exprF, G: exprG };

    return [
      {
        enonce: ['لتكن العبارة:', 'a = ' + exprA, 'بيّن أنّ a = 8 - 2√15'],
        indice: 'ابدأ بقاعدة الجذر: √(t^2) = |t|، ثمّ قارن √15 بـ 4',
        etapes: [
          ['قاعدة الجذر', '√((√15 - 4)^2) = |√15 - 4|'],
          ['نقارن', '√15 < √16 = 4'],
          ['نرفع القيمة المطلقة', '|√15 - 4| = 4 - √15'],
          ['نضرب في 2', '2(4 - √15) = 8 - 2√15'],
          ['نبسّط الجذر', '√60 = 2√15'],
          ['نُنطق الكسر', '60/√60 = √60 = 2√15'],
          ['يتلاشى الحدّان الأخيران', '-2√15 + 2√15 = 0'],
          ['النتيجة', 'a = 8 - 2√15']
        ],
        controle: { env, claims: [['a', '8 - 2√15']] }
      },
      {
        enonce: ['لتكن العبارة:', 'b = ' + exprB, 'بيّن أنّ b = 8 + 2√15'],
        indice: 'أخرج المربّعات الكاملة من تحت الجذور: 60 = 4 × 15 و 540 = 36 × 15',
        etapes: [
          ['نبسّط الجذر العددي', '√64 = 8'],
          ['نبسّط الجذر الثاني', '4√60 = 4 × 2√15 = 8√15'],
          ['نبسّط الجذر الثالث', '√540 = √(36 × 15) = 6√15'],
          ['نجمع حدود √15', '8√15 - 6√15 = 2√15'],
          ['النتيجة', 'b = 8 + 2√15']
        ],
        controle: { env, claims: [['b', '8 + 2√15']] }
      },
      {
        enonce: ['بيّن أنّ:', 'a × b = 4'],
        indice: 'استعمل المتطابقة (x - y)(x + y) = x^2 - y^2',
        etapes: [
          ['نكتب الجداء', 'a × b = (8 - 2√15)(8 + 2√15)'],
          ['نستعمل المتطابقة', '(8 - 2√15)(8 + 2√15) = 8^2 - (2√15)^2'],
          ['نحسب المربّعين', '8^2 - (2√15)^2 = 64 - 60'],
          ['النتيجة', 'a × b = 4']
        ],
        controle: { env, claims: [['a × b', '4']] }
      },
      {
        enonce: ['استنتج علامة العدد a'],
        indice: 'الجداء a × b موجب، و b موجب بداهة',
        etapes: [
          ['إشارة b', 'b = 8 + 2√15 > 0'],
          ['الجداء موجب', 'a × b = 4 > 0'],
          ['قاعدة الإشارة',
           'جداء عددين موجب، و أحدهما موجب: فالآخر موجب هو أيضا'],
          ['نتأكّد بالمقارنة', '2√15 = √60 < √64 = 8'],
          ['النتيجة', 'a > 0']
        ],
        controle: { env, claims: [['a × b', '4'], ['a', '8 - 2√15']] }
      },
      {
        enonce: ['أنشر و اختصر العبارة:', '(2 + √3)^2'],
        indice: 'استعمل المتطابقة (x + y)^2 = x^2 + 2xy + y^2',
        etapes: [
          ['نستعمل المتطابقة', '(2 + √3)^2 = 2^2 + 2 × 2 × √3 + (√3)^2'],
          ['نحسب المربّعين', '2^2 + (√3)^2 = 4 + 3 = 7'],
          ['نحسب الحدّ الأوسط', '2 × 2 × √3 = 4√3'],
          ['النتيجة', '(2 + √3)^2 = 7 + 4√3']
        ],
        controle: { claims: [['(2 + √3)^2', '7 + 4√3']] }
      },
      {
        enonce: ['نعتبر كذلك:', 'e = ' + exprE, 'c = ' + exprC,
                 'اختصر العبارة c'],
        indice: 'ابدأ باختصار e: تجد ما تحت الجذر في c، و هو مربّع كامل',
        etapes: [
          ['نبسّط جذور e', '3√12 + √48 - √75 - √3 = 6√3 + 4√3 - 5√3 - √3'],
          ['نجمع حدود √3', '6√3 + 4√3 - 5√3 - √3 = 4√3'],
          ['نبسّط الجذر العددي', '√49 = 7'],
          ['نتيجة e', 'e = 7 + 4√3'],
          ['نستعمل السؤال السابق', '7 + 4√3 = (2 + √3)^2'],
          ['نعوّض في c', 'c = √((2 + √3)^2) = |2 + √3|'],
          ['إشارة القوس', '2 + √3 > 0'],
          ['النتيجة', 'c = 2 + √3']
        ],
        controle: { env, claims: [['e', '7 + 4√3'], ['c', '2 + √3'], ['c', '√e']] }
      },
      {
        enonce: ['لتكن العبارة:', 'd = ' + exprD, 'بيّن أنّ d^2 = 12 ثمّ استنتج d'],
        indice: 'انشر المربّع: يظهر a + b و الجداء a b، و كلاهما معلوم',
        etapes: [
          ['ننشر المربّع', 'd^2 = (√a - √b)^2 = a + b - 2√(a b)'],
          ['نجمع a و b', 'a + b = (8 - 2√15) + (8 + 2√15) = 16'],
          ['نستعمل الجداء', '√(a b) = √4 = 2'],
          ['نحسب', 'd^2 = 16 - 2 × 2 = 12'],
          ['نأخذ الجذر', '√12 = 2√3'],
          ['إشارة d', 'a < b، إذن √a < √b و d < 0'],
          ['النتيجة', 'd = -2√3']
        ],
        controle: { env, claims: [['d^2', '12'], ['d', '-2√3']] }
      },
      {
        enonce: ['بيّن أنّ العدد d + 2c عدد صحيح طبيعي'],
        indice: 'عوّض d و c بقيمتيهما: حدّا √3 يتقابلان',
        etapes: [
          ['نستعمل قيمة d', 'd = -2√3'],
          ['نستعمل قيمة c', 'c = 2 + √3'],
          ['نضرب في 2', '2c = 4 + 2√3'],
          ['نجمع فيتلاشى √3', 'd + 2c = -2√3 + 4 + 2√3 = 4'],
          ['طبيعة العدد', 'العدد 4 عدد صحيح طبيعي']
        ],
        controle: { env, claims: [['d + 2c', '4']] }
      },
      {
        enonce: ['لتكن العبارة:', 'E = ' + exprEE, 'بيّن أنّ E = 31 - 8√15'],
        indice: 'من a × b = 4 نستنتج b = 4/a، فيصير E مربّعا مقسوما على 4',
        etapes: [
          ['نستعمل الجداء', 'b = 4/a'],
          ['نعوّض في E', 'E = a/(4/a) = a^2/4'],
          ['ننشر المربّع', 'a^2 = (8 - 2√15)^2 = 124 - 32√15'],
          ['نقسم على 4', '(124 - 32√15)/4 = 31 - 8√15'],
          ['النتيجة', 'E = 31 - 8√15']
        ],
        controle: { env, claims: [['E', '31 - 8√15'], ['E', 'a^2/4']] }
      },
      {
        enonce: ['اختصر العبارة:', 'F = ' + exprF],
        indice: 'من a × b = 4 نستنتج b/4 = 1/a',
        etapes: [
          ['نستعمل الجداء', 'b/4 = 1/a'],
          ['نعوّض في F', 'F = (1/a)a^2 - a'],
          ['نبسّط الجداء', '(1/a)a^2 = a'],
          ['نطرح', 'F = a - a'],
          ['النتيجة', 'F = 0']
        ],
        controle: { env, claims: [['F', '0']] }
      },
      {
        enonce: ['اختصر العبارة:', 'G = ' + exprG],
        indice: 'انشر كل قوس: √a × 1/√a = 1، و √a × √b = √(a b)',
        etapes: [
          ['ننشر القوس الأوّل', '√a(√b - 1/√a) = √(a b) - 1'],
          ['ننشر القوس الثاني', '√b(√a - 1/√b) = √(a b) - 1'],
          ['نستعمل الجداء', '√(a b) = √4 = 2'],
          ['نجمع', 'G = (2 - 1) + (2 - 1)'],
          ['النتيجة', 'G = 2']
        ],
        controle: { env, claims: [['G', '2']] }
      }
    ];
  }

  const API = { exercice1 };
  if (M) module.exports = API; else racine.Devoir = API;
})(typeof window !== 'undefined' ? window : globalThis);
