// Exercices 14 à 17 de la fiche « الضرب و القسمة في مجموعة الأعداد الحقيقية »
// (riadhyet.com, جوهر سويسي, 2018-2019, page 4).
//
// Même méthode que `produit.js` (voir ../METHODE.md).
//
//   14 : E et F partagent le facteur (√r x - 1), et F ne le montre qu'une fois
//        √r mis en facteur. Tout le reste — E - F, puis E = F — en découle.
//   15 : π s'y invite, et s'en va. Il n'est là que pour être éliminé : les deux
//        expressions le contiennent, aucune des deux réponses ne le contient.
//        La chaîne le dit à l'élève au lieu de le lui laisser deviner.
//   16 : a contient x, et x disparaît. Même leçon que le 15, sur une lettre.
//   17 : développer, réduire, puis mettre en facteur — sans piège, mais H
//        demande de voir que x² + √s x vaut x(x + √s).
//
// LE π DU 15. Il n'appartient pas à ℚ[√d] et n'y appartiendra jamais ; le noyau
// le traite comme une lettre libre. Ce n'est pas un pis-aller : l'exercice ne
// demande rien de sa valeur, seulement que ce soit un réel, et le validateur
// vérifie chaque étape sur des dizaines de valeurs — si une seule dépendait de
// π, elle serait rejetée.
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
  // Deux entiers distincts pris dans une liste.
  const deux = liste => {
    const l = liste.slice();
    const a = l.splice(ent(0, l.length - 1), 1)[0];
    return [a, l[ent(0, l.length - 1)]];
  };

  // =========================================================================
  // EXERCICE 14 — E = √s(√r x - 1) et F = r x - √r = √r(√r x - 1).
  // =========================================================================
  function type14() {
    const [r, s] = deux(LIBRES);
    const exprE = '√' + s + '(√' + r + 'x - 1)';
    const exprF = mono(r, 'x') + ' - √' + r;
    const facF = '√' + r + '(√' + r + 'x - 1)';
    const facEF = '(√' + r + 'x - 1)(√' + s + ' - √' + r + ')';
    const x0 = '√' + r + '/' + r;                      // 1/√r, écrit sans radical au dénominateur
    const libre = { libres: ['x'], derives: { E: exprE, F: exprF } };

    return [
      {
        enonce: ['نعتبر العبارتين، حيث x عدد حقيقي:', 'E = ' + exprE, 'F = ' + exprF,
                 'احسب E في حالة x = ' + x0],
        indice: 'احسب أوّلا الجداء √' + r + 'x: ماذا يصير القوس؟',
        etapes: [
          ['نُنطق قيمة x', x0 + ' = 1/√' + r],
          ['نحسب الجداء داخل القوس', '√' + r + ' × ' + x0 + ' = 1'],
          ['يتلاشى القوس', '√' + r + 'x - 1 = 0'],
          ['نضرب في √' + s, 'E = √' + s + ' × 0'],
          ['النتيجة', 'E = 0']
        ],
        controle: { env: { x: x0, E: exprE, F: exprF }, claims: [['E', '0']] }
      },
      {
        enonce: ['فكّك العبارة F إلى جداء عوامل:', 'F = ' + exprF],
        indice: 'لاحظ أنّ ' + r + ' = √' + r + ' × √' + r,
        etapes: [
          ['نكتب المعامل جداء جذرين', r + ' = √' + r + ' × √' + r],
          ['نعيد كتابة F', 'F = √' + r + ' × √' + r + 'x - √' + r],
          ['نضع √' + r + ' عاملا مشتركا', 'F = ' + facF],
          ['النتيجة', exprF + ' = ' + facF]
        ],
        controle: Object.assign({ claims: [[exprF, facF]] }, libre)
      },
      {
        enonce: ['بيّن أنّ:', 'E - F = ' + facEF],
        indice: 'الشكلان المفكّكان يتقاسمان القوس (√' + r + 'x - 1)',
        etapes: [
          ['نستعمل الشكل المفكّك لـ F', 'F = ' + facF],
          ['نطرح', 'E - F = √' + s + '(√' + r + 'x - 1) - √' + r + '(√' + r + 'x - 1)'],
          ['نضع القوس عاملا مشتركا',
           '√' + s + '(√' + r + 'x - 1) - √' + r + '(√' + r + 'x - 1) = ' + facEF],
          ['النتيجة', 'E - F = ' + facEF]
        ],
        controle: Object.assign({ claims: [['E - F', facEF]] }, libre)
      },
      {
        enonce: ['أوجد العدد الحقيقي x بحيث:', 'E = F'],
        indice: 'E = F يعني E - F = 0، و قد فكّكنا E - F في السؤال السابق',
        etapes: [
          ['نكتب الشرط', 'E - F = 0'],
          ['نستعمل الشكل المفكّك', facEF + ' = 0'],
          ['العامل الثاني غير معدوم',
           'العددان √' + s + ' و √' + r + ' مختلفان، إذن √' + s + ' - √' + r
           + ' ليس معدوما'],
          ['يبقى العامل الأوّل', '√' + r + 'x - 1 = 0'],
          ['نحلّ', 'x = ' + x0],
          ['نتحقّق', 'E = F']
        ],
        controle: {
          env: { x: x0, E: exprE, F: exprF },
          claims: [['E - F', '0'], ['E', 'F']]
        }
      }
    ];
  }

  // =========================================================================
  // EXERCICE 15 — π n'est là que pour s'en aller.
  //
  //   a = √5 - (π + f1 - √v) - [(√v - π) + f2]   avec f1 + f2 = 2  →  a = √5 - 2
  //   b = √w × (1/√w - π) + π × (√w + 1/π) - √5                    →  b = 2 - √5
  //
  // Les deux nombres sont donc opposés, et c = √5 + 2 est l'inverse de a. Ces
  // valeurs-là ne peuvent pas bouger : « a et c مقلوبان » impose (√u - 2)(√u + 2) = 1,
  // c'est-à-dire u = 5, et « a et b متقابلان » impose f1 + f2 = 2. Seul
  // l'habillage varie — le partage de la constante, et les deux radicaux qui
  // accompagnent π.
  // =========================================================================
  function type15() {
    const d = choix([3, 4, 5, 6]), n1 = ent(d + 1, 2 * d - 1);   // f1 = n1/d, 1 < f1 < 2
    const f1 = frac(n1, d), f2 = frac(2 * d - n1, d);
    const [v, w] = deux(LIBRES.filter(x => x !== 5));

    const exprA = '√5 - (π + ' + f1 + ' - √' + v + ') - ((√' + v + ' - π) + ' + f2 + ')';
    const exprB = '√' + w + ' × (1/√' + w + ' - π) + π × (√' + w + ' + 1/π) - √5';
    const exprC = '√5 + 2';
    const libre = {
      libres: ['π'],
      derives: { a: exprA, b: exprB, c: exprC }
    };

    return [
      {
        enonce: ['نعتبر العبارتين التاليتين:', 'a = ' + exprA, 'b = ' + exprB,
                 'بيّن أنّ a = √5 - 2 و b = 2 - √5'],
        indice: 'ارفع الأقواس بانتباه للإشارة: π يتلاشى في العبارتين',
        etapes: [
          ['نرفع الأقواس في a',
           exprA + ' = √5 - π - ' + f1 + ' + √' + v + ' - √' + v + ' + π - ' + f2],
          ['يتلاشى π و √' + v + ' في a',
           'الحدّان في π يتقابلان، و كذلك الحدّان في √' + v],
          ['نجمع الأعداد', '-' + f1 + ' - ' + f2 + ' = -2'],
          ['نتيجة a', 'a = √5 - 2'],
          ['ننشر الجداء الأوّل في b', '√' + w + ' × (1/√' + w + ' - π) = 1 - π√' + w],
          ['ننشر الجداء الثاني في b', 'π × (√' + w + ' + 1/π) = π√' + w + ' + 1'],
          ['يتلاشى π√' + w, 'الحدّان في π√' + w + ' يتقابلان عند الجمع'],
          ['نتيجة b', 'b = 1 + 1 - √5 = 2 - √5']
        ],
        controle: Object.assign({ claims: [['a', '√5 - 2'], ['b', '2 - √5']] }, libre)
      },
      {
        enonce: ['استنتج أنّ a و b متقابلان'],
        indice: 'عددان متقابلان يعني أنّ مجموعهما معدوم',
        etapes: [
          ['نستعمل نتيجة السؤال السابق', 'a = √5 - 2'],
          ['و كذلك', 'b = 2 - √5'],
          ['نجمع العددين', 'a + b = (√5 - 2) + (2 - √5)'],
          ['نختصر', '(√5 - 2) + (2 - √5) = 0'],
          ['النتيجة', 'مجموع العددين معدوم، إذن a و b متقابلان']
        ],
        controle: Object.assign({ claims: [['a + b', '0'], ['a', '-b']] }, libre)
      },
      {
        enonce: ['ليكن العدد الحقيقي:', 'c = ' + exprC, 'بيّن أنّ a و c مقلوبان'],
        indice: 'احسب الجداء a × c بالمتطابقة (x - y)(x + y) = x^2 - y^2',
        etapes: [
          ['نكتب الجداء', 'a × c = (√5 - 2)(√5 + 2)'],
          ['نستعمل المتطابقة', '(√5 - 2)(√5 + 2) = (√5)^2 - 2^2'],
          ['نحسب المربّعين', '(√5)^2 - 2^2 = 5 - 4'],
          ['نستنتج', '5 - 4 = 1'],
          ['النتيجة', 'a × c = 1، إذن a و c مقلوبان']
        ],
        controle: Object.assign({ claims: [['a × c', '1'], ['a', '1/c']] }, libre)
      }
    ];
  }

  // =========================================================================
  // EXERCICE 16 — a contient x, et x s'en va. Puis a × b = 1.
  //   a = -(x - u + √p) - [-(m√w + x) - (√p - √w)]  =  u + (m-1)√w
  //   b = (m√w - 1)(m√w + 1) - √w(v + √w) - c2      =  u - v√w,  v = m - 1
  // avec u² - v²w = 1 (Pell), et c2 = m²w - w - 1 - u.
  // =========================================================================
  const PELL16 = [[3, 2, 2], [2, 1, 3], [7, 4, 3], [5, 2, 6], [8, 3, 7]];

  function type16() {
    const [u, v, w] = choix(PELL16);
    const m = v + 1, c2 = carre(m) * w - w - 1 - u;
    const p = choix(LIBRES.filter(x => x !== w));
    if (c2 < 1) return type16();

    const a = sAdd(num(u), S(rat(v), w));
    const b = sSub(num(u), S(rat(v), w));
    const ta = sTxt(a), tb = sTxt(b);
    const exprA = '-(x - ' + u + ' + √' + p + ') - (-(' + R(m, w) + ' + x) - (√' + p
                + ' - √' + w + '))';
    const exprB = '(' + R(m, w) + ' - 1)(' + R(m, w) + ' + 1) - √' + w + '(' + v
                + ' + √' + w + ') - ' + c2;
    const exprC = '1/(' + tb + ') - ' + R(v, w);

    return [
      {
        enonce: ['لتكن العبارة، حيث x عدد حقيقي:', 'a = ' + exprA,
                 'بيّن أنّ a = ' + ta],
        indice: 'ارفع الأقواس بانتباه للإشارة: x و √' + p + ' يتلاشيان',
        etapes: [
          ['نرفع القوس الأوّل',
           '-(x - ' + u + ' + √' + p + ') = -x + ' + u + ' - √' + p],
          ['نرفع المعقفين',
           '-(-(' + R(m, w) + ' + x) - (√' + p + ' - √' + w + ')) = ' + R(m, w)
           + ' + x + √' + p + ' - √' + w],
          ['يتلاشى x و √' + p, 'الحدّان في x يتقابلان، و كذلك الحدّان في √' + p],
          ['نجمع حدود √' + w, R(m, w) + ' - √' + w + ' = ' + R(v, w)],
          ['النتيجة', 'a = ' + ta]
        ],
        controle: {
          libres: ['x'], derives: { a: exprA },
          claims: [['a', ta]]
        }
      },
      {
        enonce: ['لتكن العبارة:', 'b = ' + exprB, 'بيّن أنّ b = ' + tb],
        indice: 'الجداء الأوّل من الشكل (x - 1)(x + 1) = x^2 - 1',
        etapes: [
          ['نستعمل المتطابقة',
           '(' + R(m, w) + ' - 1)(' + R(m, w) + ' + 1) = (' + R(m, w) + ')^2 - 1 = '
           + (carre(m) * w - 1)],
          ['ننشر الجداء الثاني',
           '√' + w + '(' + v + ' + √' + w + ') = ' + R(v, w) + ' + ' + w],
          ['نطرح',
           'b = ' + (carre(m) * w - 1) + ' - (' + R(v, w) + ' + ' + w + ') - ' + c2],
          ['نجمع الأعداد',
           (carre(m) * w - 1) + ' - ' + w + ' - ' + c2 + ' = ' + u],
          ['النتيجة', 'b = ' + tb]
        ],
        controle: { env: { b: exprB }, claims: [['b', tb]] }
      },
      {
        enonce: ['احسب الجداء a × b. ماذا تستنتج ؟'],
        indice: 'استعمل المتطابقة (x + y)(x - y) = x^2 - y^2',
        etapes: [
          ['نكتب الجداء', 'a × b = (' + ta + ')(' + tb + ')'],
          ['نستعمل المتطابقة',
           '(' + ta + ')(' + tb + ') = ' + u + '^2 - (' + R(v, w) + ')^2'],
          ['نحسب المربّعين',
           u + '^2 - (' + R(v, w) + ')^2 = ' + carre(u) + ' - ' + carre(v) * w],
          ['نستنتج', carre(u) + ' - ' + carre(v) * w + ' = 1'],
          ['النتيجة', 'a × b = 1، إذن a و b مقلوبان']
        ],
        controle: { env: { a: ta, b: tb }, claims: [['a × b', '1'], ['a', '1/b']] }
      },
      {
        enonce: ['احسب إذن:', 'c = ' + exprC],
        indice: 'مقلوب ' + tb + ' معلوم من السؤال السابق: إنّه a',
        etapes: [
          ['نستعمل السؤال السابق', '1/(' + tb + ') = ' + ta],
          ['نعوّض', 'c = (' + ta + ') - ' + R(v, w)],
          ['يتلاشى الجذر', '(' + ta + ') - ' + R(v, w) + ' = ' + u],
          ['النتيجة', 'c = ' + u]
        ],
        controle: { env: { c: exprC }, claims: [['c', String(u)]] }
      }
    ];
  }

  // =========================================================================
  // EXERCICE 17 — développer et réduire, puis mettre en facteur.
  // =========================================================================
  function type17() {
    const d1 = choix([2, 3, 4]), n1 = ent(d1 + 1, 3 * d1);       // n1/d1 > 1
    const d2 = choix([4, 6, 8]), n2 = ent(1, d2 - 1);
    const d3 = choix([2, 3, 4]), n3 = ent(1, d3 - 1);
    const r = choix(LIBRES);
    const g = choix([2, 3, 4]), ca = ent(2, 4), cb = ent(1, 3);
    const s = choix(LIBRES);
    const k = ent(1, 4), j = ent(1, 3);
    if (ca === cb) return type17();

    // E = n1/d1 (n2/d2 x - 1) + x - n3/d3
    const cxE = sAdd(sMul(S(rat(n1, d1)), S(rat(n2, d2))), num(1));
    const c0E = sSub(sNeg(S(rat(n1, d1))), S(rat(n3, d3)));
    const exprE = frac(n1, d1) + ' (' + frac(n2, d2) + ' x - 1) + x - ' + frac(n3, d3);
    const devE = sTxt(cxE) + ' x' + plus(c0E);
    // F = (x - √r)(2x + √r) + √r(x + √r x) = 2x² + r x - r
    const exprF = '(x - √' + r + ')(2x + √' + r + ') + √' + r + '(x + √' + r + 'x)';
    const devF = '2x^2 + ' + mono(r, 'x') + ' - ' + r;
    // G = g·ca x² y + g·cb x y²
    const exprG = mono(g * ca, 'x^2 y') + ' + ' + mono(g * cb, 'x y^2');
    const facG = mono(g, 'x y') + '(' + mono(ca, 'x') + ' + ' + mono(cb, 'y') + ')';
    // H = (x - k)(x + √s) + (x + j)(x² + √s x)
    const exprH = '(x - ' + k + ')(x + √' + s + ') + (x + ' + j + ')(x^2 + √' + s + 'x)';
    const facH = '(x + √' + s + ')(x^2 + ' + mono(j + 1, 'x') + ' - ' + k + ')';

    return [
      {
        enonce: ['انشر ثمّ اختصر العبارة، حيث x عدد حقيقي:', 'E = ' + exprE],
        indice: 'ابدأ بنشر القوس: ' + frac(n1, d1) + ' × ' + frac(n2, d2) + ' = '
                + sTxt(sMul(S(rat(n1, d1)), S(rat(n2, d2)))),
        etapes: [
          ['ننشر القوس',
           frac(n1, d1) + ' (' + frac(n2, d2) + ' x - 1) = '
           + sTxt(sMul(S(rat(n1, d1)), S(rat(n2, d2)))) + ' x - ' + frac(n1, d1)],
          ['نجمع حدود x',
           sTxt(sMul(S(rat(n1, d1)), S(rat(n2, d2)))) + ' x + x = ' + sTxt(cxE) + ' x'],
          ['نجمع الأعداد',
           '-' + frac(n1, d1) + ' - ' + frac(n3, d3) + ' = ' + sTxt(c0E)],
          ['النتيجة', 'E = ' + devE]
        ],
        controle: {
          libres: ['x'], derives: { E: exprE },
          claims: [[exprE, devE]]
        }
      },
      {
        enonce: ['انشر ثمّ اختصر العبارة، حيث x عدد حقيقي:', 'F = ' + exprF],
        indice: 'انشر الجداءين: حدود √' + r + 'x تتلاشى كلّها',
        etapes: [
          ['ننشر الجداء الأوّل',
           '(x - √' + r + ')(2x + √' + r + ') = 2x^2 - √' + r + 'x - ' + r],
          ['ننشر الجداء الثاني',
           '√' + r + '(x + √' + r + 'x) = √' + r + 'x + ' + mono(r, 'x')],
          ['يتلاشى √' + r + 'x', 'الحدّان في √' + r + 'x يتقابلان عند الجمع'],
          ['النتيجة', 'F = ' + devF]
        ],
        controle: {
          libres: ['x'], derives: { F: exprF },
          claims: [[exprF, devF]]
        }
      },
      {
        enonce: ['أكتب في صيغة جداء عوامل، حيث x و y عددان حقيقيان:', 'G = ' + exprG],
        indice: 'العامل المشترك عددي و حرفي في آن واحد: ' + mono(g, 'x y'),
        etapes: [
          ['العامل المشترك العددي', g * ca + ' = ' + g + ' × ' + ca],
          ['العامل المشترك الحرفي', 'الحدّان يحتويان على x و على y'],
          ['نضع ' + mono(g, 'x y') + ' عاملا مشتركا',
           exprG + ' = ' + mono(g, 'x y') + ' × ' + mono(ca, 'x') + ' + '
           + mono(g, 'x y') + ' × ' + mono(cb, 'y')],
          ['النتيجة', 'G = ' + facG]
        ],
        controle: {
          libres: ['x', 'y'], derives: { G: exprG },
          claims: [[exprG, facG]]
        }
      },
      {
        enonce: ['أكتب في صيغة جداء عوامل، حيث x عدد حقيقي:', 'H = ' + exprH],
        indice: 'فكّك x^2 + √' + s + 'x: يظهر القوس (x + √' + s + ')',
        etapes: [
          ['نفكّك القوس الثاني',
           'x^2 + √' + s + 'x = x(x + √' + s + ')'],
          ['نعيد كتابة H',
           'H = (x - ' + k + ')(x + √' + s + ') + (x + ' + j + ')x(x + √' + s + ')'],
          ['نضع (x + √' + s + ') عاملا مشتركا',
           'H = (x + √' + s + ')[(x - ' + k + ') + x(x + ' + j + ')]'],
          ['نختصر ما بين المعقفين',
           '(x - ' + k + ') + x(x + ' + j + ') = x^2 + ' + mono(j + 1, 'x') + ' - ' + k],
          ['النتيجة', 'H = ' + facH]
        ],
        controle: {
          libres: ['x'], derives: { H: exprH },
          claims: [[exprH, facH]]
        }
      }
    ];
  }

  const API = { type14, type15, type16, type17, PELL16 };
  if (M) module.exports = API; else racine.Produit2 = API;
})(typeof window !== 'undefined' ? window : globalThis);
