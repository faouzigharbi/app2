// Exercices 26 à 29 de la fiche « العمليات في مجموعة الأعداد الحقيقية —
// تمارين شاملة » : facteur commun caché par un changement de signe, expressions
// à réduire, valeurs absolues et équations.
//
// Même méthode que les autres fichiers (voir ../METHODE.md) : une page par
// exercice, un volet par question de l'énoncé, et l'on ne tire que ce que
// l'exercice supporte. Ici les quatre sont LIBRES — aucun ne repose sur une
// identité numérique fragile, seulement sur des schémas algébriques :
//
//   26 : √r - k = -(k - √r). C'est tout l'exercice — le facteur commun n'est
//        visible qu'après ce changement de signe.
//   27 : x(px - 1) - k(px - 1) = (px - 1)(x - k), puis mise en facteur.
//   28 : lever des parenthèses, développer, mettre en facteur.
//   29 : |X| = c, et l'emboîtement ||x| - k| = c.
//
// RÉSERVE SUR LA QUESTION 4 DU 26. La fiche imprime « أوجد x في حالة C و D
// متقابلان » — mais C et D ne sont définis NULLE PART dans l'exercice. C'est
// la question 3 recopiée avec d'autres lettres. On ne l'a pas portée : il n'y
// a rien à démontrer sur deux objets qui n'existent pas. À noter que la lire
// « a et b مقلوبان » ne la sauverait pas — a×b = (2√7 - 7)(4x-3)² est toujours
// négatif ou nul, donc jamais égal à 1.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;
  const { rat, num, S, sAdd, sSub, sNeg, sMul, sSqrt, sTxt, ent, choix } = F;

  const R = (c, r) => (c === 1 ? '√' + r : c + '√' + r);
  const carre = n => n * n;
  const LIBRES = [2, 3, 5, 6, 7, 10, 11, 13];
  // Une fraction : son écriture et sa valeur, toujours d'un seul tenant.
  const fr = (n, d) => ({ t: d === 1 ? String(n) : n + '/' + d, v: S(rat(n, d)) });
  const petite = () => { const d = choix([2, 3, 4, 5]); return fr(ent(1, d - 1), d); };
  // Un monôme : « x » et non « 1x », « -x » et non « -1x ».
  const mono = (c, v) => (c === 1 ? v : c === -1 ? '-' + v : c + v);

  // =========================================================================
  // EXERCICE 26 — le facteur commun caché par un signe.
  //   a = (k - √r)(px - 1) - (√r - k)(x - q)   et   b = m x√r - √(n²r)
  // Avec m = p + 1 et n = q + 1, les deux se factorisent par le MÊME (mx - n),
  // et c'est ce qui fait que a + b se réduit à k(mx - n).
  // =========================================================================
  function type26() {
    const k = ent(2, 4), p = ent(2, 4), q = ent(1, 3);
    const r = choix(LIBRES.filter(x => x !== carre(k)));
    const m = p + 1, n = q + 1;
    if (carre(n) * r > 400) return type26();

    const exprA = '(' + k + ' - √' + r + ')(' + mono(p, 'x') + ' - 1) - (√' + r
                + ' - ' + k + ')(x - ' + q + ')';
    const exprB = mono(m, 'x') + '√' + r + ' - √' + carre(n) * r;
    const facA = '(' + k + ' - √' + r + ')(' + mono(m, 'x') + ' - ' + n + ')';
    const facB = '√' + r + '(' + mono(m, 'x') + ' - ' + n + ')';
    const somme = k + '(' + mono(m, 'x') + ' - ' + n + ')';
    const sol = n + '/' + m;
    const libre = { libres: ['x'], derives: { a: exprA, b: exprB } };

    return [
      {
        enonce: ['نعتبر العبارة، حيث x عدد حقيقي:', 'a = ' + exprA,
                 'اكتب a في صيغة جداء'],
        indice: 'لاحظ أنّ √' + r + ' - ' + k + ' هو مقابل ' + k + ' - √' + r,
        etapes: [
          ['نلاحظ العلاقة بين القوسين',
           '√' + r + ' - ' + k + ' = -(' + k + ' - √' + r + ')'],
          ['نغيّر إشارة الحدّ الثاني',
           '-(√' + r + ' - ' + k + ')(x - ' + q + ') = (' + k + ' - √' + r
           + ')(x - ' + q + ')'],
          ['نضع (' + k + ' - √' + r + ') عاملا مشتركا',
           'a = (' + k + ' - √' + r + ')[(' + mono(p, 'x') + ' - 1) + (x - ' + q + ')]'],
          ['نجمع ما بين المعقفين',
           '(' + mono(p, 'x') + ' - 1) + (x - ' + q + ') = ' + mono(m, 'x') + ' - ' + n],
          ['النتيجة', 'a = ' + facA]
        ],
        controle: Object.assign({ claims: [[exprA, facA]] }, libre)
      },
      {
        enonce: ['نعتبر العبارة، حيث x عدد حقيقي:', 'b = ' + exprB,
                 'اكتب b في صيغة جداء'],
        indice: 'ابدأ بإخراج المربّع الكامل من تحت الجذر',
        etapes: [
          ['نتعرّف على العامل المشترك', 'الحدّان يحتويان على الجذر √' + r],
          ['نبسّط الجذر',
           '√' + carre(n) * r + ' = √(' + carre(n) + ' × ' + r + ') = ' + R(n, r)],
          ['نضع √' + r + ' عاملا مشتركا',
           mono(m, 'x') + '√' + r + ' - ' + R(n, r) + ' = ' + facB],
          ['النتيجة', 'b = ' + facB]
        ],
        controle: Object.assign({ claims: [[exprB, facB]] }, libre)
      },
      {
        enonce: ['بيّن أنّ:', 'a + b = ' + somme],
        indice: 'استعمل الشكلين المفكّكين: العامل (' + mono(m, 'x') + ' - ' + n
                + ') مشترك بينهما',
        etapes: [
          ['نستعمل الشكلين المفكّكين', 'a + b = ' + facA + ' + ' + facB],
          ['نضع (' + mono(m, 'x') + ' - ' + n + ') عاملا مشتركا',
           facA + ' + ' + facB + ' = (' + mono(m, 'x') + ' - ' + n + ')((' + k
           + ' - √' + r + ') + √' + r + ')'],
          ['يتلاشى الجذر', '(' + k + ' - √' + r + ') + √' + r + ' = ' + k],
          ['النتيجة', 'a + b = ' + somme]
        ],
        controle: Object.assign({ claims: [['a + b', somme]] }, libre)
      },
      {
        enonce: ['أوجد x في حالة a و b متقابلان'],
        indice: 'متقابلان يعني a + b = 0، و قد حسبنا a + b في السؤال السابق',
        etapes: [
          ['شرط التقابل', 'العددان متقابلان يعني أنّ مجموعهما معدوم'],
          ['نستعمل نتيجة السؤال 3', somme + ' = 0'],
          ['جداء معدوم', 'العدد ' + k + ' غير معدوم، إذن ' + mono(m, 'x') + ' - '
           + n + ' = 0'],
          ['نحلّ', 'x = ' + sol],
          ['نتحقّق', 'a + b = 0']
        ],
        controle: {
          env: { x: sol, a: exprA, b: exprB },
          claims: [['a + b', '0'], ['a', '-b']]
        }
      }
    ];
  }

  // =========================================================================
  // EXERCICE 27 — A = (x - k)(x + j) + x(px - 1) - k(px - 1).
  // Les deux derniers termes cachent (px - 1)(x - k) ; une fois vu, (x - k) est
  // en facteur partout.
  // =========================================================================
  function type27() {
    const k = ent(2, 5), j = ent(2, 5), p = ent(3, 5);
    const c1 = p + 1, c0 = j - 1;
    const exprA = '(x - ' + k + ')(x + ' + j + ') + x(' + mono(p, 'x') + ' - 1) - '
                + k + '(' + mono(p, 'x') + ' - 1)';
    const facA = '(x - ' + k + ')(' + mono(c1, 'x') + ' + ' + c0 + ')';
    const a0 = -k * c0;                                  // A en x = 0
    const sol2 = '-' + c0 + '/' + c1;                    // seconde racine

    return [
      {
        enonce: ['نعتبر العبارة التالية، حيث x عدد حقيقي:', 'A = ' + exprA,
                 'بيّن أنّ A = ' + facA],
        indice: 'الحدّان الأخيران يشتركان في (' + mono(p, 'x') + ' - 1)',
        etapes: [
          ['نفكّك الحدّين الأخيرين',
           'x(' + mono(p, 'x') + ' - 1) - ' + k + '(' + mono(p, 'x') + ' - 1) = ('
           + mono(p, 'x') + ' - 1)(x - ' + k + ')'],
          ['نعيد كتابة A',
           'A = (x - ' + k + ')(x + ' + j + ') + (' + mono(p, 'x') + ' - 1)(x - '
           + k + ')'],
          ['نضع (x - ' + k + ') عاملا مشتركا',
           'A = (x - ' + k + ')[(x + ' + j + ') + (' + mono(p, 'x') + ' - 1)]'],
          ['نختصر ما بين المعقفين',
           '(x + ' + j + ') + (' + mono(p, 'x') + ' - 1) = ' + mono(c1, 'x')
           + ' + ' + c0],
          ['النتيجة', 'A = ' + facA]
        ],
        controle: {
          libres: ['x'], derives: { A: exprA },
          claims: [[exprA, facA]]
        }
      },
      {
        enonce: ['احسب A في حالة:', 'x = 0'],
        indice: 'استعمل الشكل المفكّك: الحساب أقصر بكثير',
        etapes: [
          ['ننطلق من الشكل المفكّك', 'A = ' + facA],
          ['نعوّض x بـ 0',
           '(0 - ' + k + ')(' + c1 + ' × 0 + ' + c0 + ') = (-' + k + ')(' + c0 + ')'],
          ['نحسب الجداء', '(-' + k + ')(' + c0 + ') = ' + a0],
          ['النتيجة', 'A = ' + a0]
        ],
        controle: { env: { x: '0', A: exprA }, claims: [['A', String(a0)]] }
      },
      {
        enonce: ['جد x في حالة:', 'A = 0'],
        indice: 'جداء عاملين معدوم يعني أنّ أحدهما على الأقلّ معدوم',
        etapes: [
          ['ننطلق من الشكل المفكّك', 'A = ' + facA],
          ['جداء معدوم',
           'A = 0 يعني x - ' + k + ' = 0 أو ' + mono(c1, 'x') + ' + ' + c0 + ' = 0'],
          ['نحلّ الحالة الأولى', 'x = ' + k],
          ['نحلّ الحالة الثانية', c1 + ' × (' + sol2 + ') + ' + c0 + ' = 0'],
          ['نتحقّق من الحلّ الثاني',
           '((' + sol2 + ') - ' + k + ')(' + c1 + ' × (' + sol2 + ') + ' + c0 + ') = 0'],
          ['النتيجة', 'x = ' + k + ' أو x = ' + sol2]
        ],
        controle: {
          env: { x: String(k), A: exprA },
          claims: [['A', '0'],
                   ['((' + sol2 + ') - ' + k + ')(' + c1 + ' × (' + sol2 + ') + '
                    + c0 + ')', '0']]
        }
      }
    ];
  }

  // =========================================================================
  // EXERCICE 28 — lever, développer, factoriser. Trois gestes, quatre volets.
  // =========================================================================
  function type28() {
    const [r, s] = (() => {
      const l = LIBRES.slice();
      const a = l.splice(ent(0, l.length - 1), 1)[0];
      return [a, l[ent(0, l.length - 1)]];
    })();
    const f1 = petite(), f2 = petite(), f3 = petite(), f4 = petite(), f5 = petite();
    const c1 = ent(1, 4), c2 = ent(2, 5), mB = ent(2, 3);
    const nC = ent(3, 5), mC = ent(2, 3);

    // A = [(√r - f1) - (√s + c1)] - [(c2 + √s) - (f2 - √r)] : les √r se
    // détruisent, les √s s'ajoutent, et il ne reste que -2√s et des rationnels.
    const exprA = '[(√' + r + ' - ' + f1.t + ') - (√' + s + ' + ' + c1 + ')] - [('
                + c2 + ' + √' + s + ') - (' + f2.t + ' - √' + r + ')]';
    const cstA = sSub(sSub(sSub(f2.v, f1.v), num(c1)), num(c2));
    const valA = sAdd(cstA, sMul(num(-2), sSqrt(num(s))));

    // B = (√s - f3)(f4 + mB√s)
    const exprB = '(√' + s + ' - ' + f3.t + ')(' + f4.t + ' + ' + R(mB, s) + ')';
    const valB = sMul(sSub(sSqrt(num(s)), f3.v), sAdd(f4.v, S(rat(mB), s)));
    const p1 = sMul(sSqrt(num(s)), sAdd(f4.v, S(rat(mB), s)));   // √s(f4 + mB√s)
    const p2 = sMul(f3.v, sAdd(f4.v, S(rat(mB), s)));            // f3(f4 + mB√s)
    // B = (mB·s - f3·f4) + (f4 - mB·f3)√s : le coefficient de √s est un
    // RATIONNEL, pas un radical — c'est lui qu'on fait apparaître à l'étape 4.
    const coefB = sSub(f4.v, sMul(f3.v, num(mB)));
    const cstB = sSub(sMul(num(mB), num(s)), sMul(f3.v, f4.v));
    const tf3mB = sTxt(sMul(f3.v, num(mB)));

    // C = (mC·a - 1)(nC·a - nC) - (a + f5)(mC·a - 1)
    const exprC = '(' + mono(mC, 'a') + ' - 1)(' + mono(nC, 'a') + ' - ' + nC
                + ') - (a + ' + f5.t + ')(' + mono(mC, 'a') + ' - 1)';
    const tRest = sTxt(sAdd(num(nC), f5.v));
    const facC = '(' + mono(mC, 'a') + ' - 1)(' + mono(nC - 1, 'a') + ' - ' + tRest + ')';
    const valC = sMul(sSub(sMul(num(mC), sSqrt(num(s))), num(1)),
                      sSub(sMul(num(nC - 1), sSqrt(num(s))), sAdd(num(nC), f5.v)));

    return [
      {
        enonce: ['اختصر العبارة:', 'A = ' + exprA],
        indice: 'ارفع كل قوس بانتباه للإشارة: حدّا √' + r + ' يتقابلان',
        etapes: [
          ['نرفع الكتلة الأولى',
           '(√' + r + ' - ' + f1.t + ') - (√' + s + ' + ' + c1 + ') = √' + r + ' - '
           + f1.t + ' - √' + s + ' - ' + c1],
          ['نرفع الكتلة الثانية',
           '(' + c2 + ' + √' + s + ') - (' + f2.t + ' - √' + r + ') = ' + c2 + ' + √'
           + s + ' - ' + f2.t + ' + √' + r],
          ['يتلاشى √' + r, 'الحدّان في √' + r + ' يتقابلان عند الطرح'],
          ['نجمع حدود √' + s, '-√' + s + ' - √' + s + ' = -2√' + s],
          ['نجمع الأعداد',
           '-' + f1.t + ' - ' + c1 + ' - ' + c2 + ' + ' + f2.t + ' = ' + sTxt(cstA)],
          ['النتيجة', 'A = ' + sTxt(valA)]
        ],
        controle: { env: { A: exprA }, claims: [['A', sTxt(valA)]] }
      },
      {
        enonce: ['انشر ثمّ اختصر العبارة التالية:', 'B = ' + exprB],
        indice: 'انشر حدّا بحدّ، و تذكّر أنّ √' + s + ' × √' + s + ' = ' + s,
        etapes: [
          ['ننشر بالحدّ الأوّل',
           '√' + s + '(' + f4.t + ' + ' + R(mB, s) + ') = ' + sTxt(p1)],
          ['ننشر بالحدّ الثاني',
           f3.t + '(' + f4.t + ' + ' + R(mB, s) + ') = ' + sTxt(p2)],
          ['نطرح', 'B = ' + sTxt(p1) + ' - (' + sTxt(p2) + ')'],
          ['نجمع حدود √' + s,
           f4.t + '√' + s + ' - ' + tf3mB + '√' + s + ' = ' + sTxt(coefB) + '√' + s],
          ['نجمع الأعداد',
           mB + ' × ' + s + ' - ' + f3.t + ' × ' + f4.t + ' = ' + sTxt(cstB)],
          ['النتيجة', 'B = ' + sTxt(valB)]
        ],
        controle: { env: { B: exprB }, claims: [['B', sTxt(valB)]] }
      },
      {
        enonce: ['فكّك إلى جداء عوامل العبارة، حيث a عدد حقيقي:', 'C = ' + exprC],
        indice: 'العبارة (' + mono(mC, 'a') + ' - 1) موجودة في الحدّين',
        etapes: [
          ['نتعرّف على العامل المشترك',
           'العبارة (' + mono(mC, 'a') + ' - 1) موجودة في الحدّين'],
          ['نضع العامل المشترك',
           'C = (' + mono(mC, 'a') + ' - 1)[(' + mono(nC, 'a') + ' - ' + nC
           + ') - (a + ' + f5.t + ')]'],
          ['نختصر ما بين المعقفين',
           '(' + mono(nC, 'a') + ' - ' + nC + ') - (a + ' + f5.t + ') = '
           + mono(nC - 1, 'a') + ' - ' + tRest],
          ['النتيجة', 'C = ' + facC]
        ],
        controle: {
          libres: ['a'], derives: { C: exprC },
          claims: [[exprC, facC]]
        }
      },
      {
        enonce: ['احسب العبارة C إذا كان:', 'a = √' + s],
        indice: 'استعمل الشكل المفكّك، ثمّ انشر الجداء',
        etapes: [
          ['ننطلق من الشكل المفكّك', 'C = ' + facC],
          ['نحسب العامل الأوّل',
           mono(mC, 'a') + ' - 1 = ' + sTxt(sSub(sMul(num(mC), sSqrt(num(s))), num(1)))],
          ['نحسب العامل الثاني',
           mono(nC - 1, 'a') + ' - ' + tRest + ' = '
           + sTxt(sSub(sMul(num(nC - 1), sSqrt(num(s))), sAdd(num(nC), f5.v)))],
          ['ننشر الجداء', 'C = ' + sTxt(valC)],
          ['النتيجة', 'C = ' + sTxt(valC) + ' عند a = √' + s]
        ],
        controle: {
          env: { a: '√' + s, C: exprC },
          claims: [['C', sTxt(valC)]]
        }
      }
    ];
  }

  // =========================================================================
  // EXERCICE 29 — équations, puis une expression du premier degré.
  //
  // π n'est pas dans ℚ[√d] et n'y sera jamais. Mais « |x - π| = 3 » ne demande
  // rien de sa valeur : il demande seulement que ce soit un réel. On le traite
  // donc comme une lettre libre, et le validateur teste chaque étape sur des
  // dizaines de valeurs — une étape qui dépendrait de π serait rejetée.
  // =========================================================================
  function type29() {
    const p1 = ent(2, 4), q1 = ent(1, 4), f = petite();
    const cPi = ent(2, 6);
    const kAbs = ent(6, 12), cAbs = ent(2, 5);
    const p2 = choix([4, 6, 8]), q2 = p2 / 2, x2 = ent(2, 4), rD = ent(2, 4);
    if (kAbs <= cAbs) return type29();

    const sol1 = sSub(sAdd(num(q1), f.v), num(0));      // q1 + f
    const x1 = F.sDiv(sol1, num(p1));                   // (q1 + f)/p1
    const t1 = sTxt(x1);
    const exprE1 = mono(p1, 'x') + ' - ' + q1 + ' = ' + f.t;
    const exprE2 = '|x - π| = ' + cPi;
    const exprE3 = '||x| - ' + kAbs + '| = ' + cAbs;

    const exprA = mono(p2, 'x') + ' + ' + q2;
    const facB = '(' + mono(p2, 'x') + ' - ' + q2 + ')(' + mono(p2, 'x') + ' + '
               + q2 + ')';
    const exprB = mono(carre(p2), 'x^2') + ' - ' + carre(q2);
    const exprD = '(' + mono(rD, 'x') + ' - 1)(' + exprA + ') + (' + exprA + ')^2';
    const facD = '(' + exprA + ')(' + mono(rD + p2, 'x') + ' + ' + (q2 - 1) + ')';

    return [
      {
        enonce: ['أوجد العدد الحقيقي x بحيث:', exprE1],
        indice: 'انقل العدد ' + q1 + ' إلى الطرف الآخر ثمّ اقسم على ' + p1,
        etapes: [
          ['ننقل الحدّ الثابت', mono(p1, 'x') + ' = ' + f.t + ' + ' + q1],
          ['نجمع الطرف الأيمن', f.t + ' + ' + q1 + ' = ' + sTxt(sol1)],
          ['نقسم على ' + p1, 'x = ' + sTxt(sol1) + ' : ' + p1],
          ['النتيجة', 'x = ' + t1],
          ['نتحقّق', mono(p1, 'x') + ' - ' + q1 + ' = ' + f.t]
        ],
        controle: { env: { x: t1 }, claims: [[mono(p1, 'x') + ' - ' + q1, f.t]] }
      },
      {
        enonce: ['أوجد العدد الحقيقي x بحيث:', exprE2],
        indice: '|X| = ' + cPi + ' يعني X = ' + cPi + ' أو X = -' + cPi,
        etapes: [
          ['نفكّ القيمة المطلقة',
           'يعني x - π = ' + cPi + ' أو x - π = -' + cPi],
          ['الحالة الأولى', 'x = π + ' + cPi],
          ['الحالة الثانية تعطي', '(π - ' + cPi + ') - π = -' + cPi],
          ['نتحقّق من الحلّ الأوّل', '|(π + ' + cPi + ') - π| = ' + cPi],
          ['نتحقّق من الحلّ الثاني', '|(π - ' + cPi + ') - π| = ' + cPi],
          ['النتيجة', 'x = π + ' + cPi + ' أو x = π - ' + cPi]
        ],
        controle: {
          libres: ['π'], derives: { x: 'π + ' + cPi },
          claims: [['|x - π|', String(cPi)],
                   ['|(π - ' + cPi + ') - π|', String(cPi)]]
        }
      },
      {
        enonce: ['أوجد العدد الحقيقي x بحيث:', exprE3],
        indice: 'ابدأ بفكّ القيمة المطلقة الخارجية: |x| هو المجهول الأوّل',
        etapes: [
          ['نفكّ القيمة المطلقة الخارجية',
           'يعني |x| - ' + kAbs + ' = ' + cAbs + ' أو |x| - ' + kAbs + ' = -' + cAbs],
          ['الحالة الأولى', '|x| = ' + kAbs + ' + ' + cAbs + ' = ' + (kAbs + cAbs)],
          // La seconde branche ne peut pas s'écrire avec le x de la première :
          // il n'en vérifie qu'une. On la mène donc en nombres.
          ['الحالة الثانية', kAbs + ' - ' + cAbs + ' = ' + (kAbs - cAbs)],
          ['كل قيمة مطلقة تعطي حلّين',
           'العدد و مقابله لهما نفس القيمة المطلقة'],
          ['نتحقّق من الحالة الأولى', '||' + (kAbs + cAbs) + '| - ' + kAbs + '| = ' + cAbs],
          ['نتحقّق من مقابله', '||-' + (kAbs + cAbs) + '| - ' + kAbs + '| = ' + cAbs],
          ['نتحقّق من الحالة الثانية', '||' + (kAbs - cAbs) + '| - ' + kAbs + '| = ' + cAbs],
          ['النتيجة',
           'x = ' + (kAbs + cAbs) + ' أو x = -' + (kAbs + cAbs) + ' أو x = '
           + (kAbs - cAbs) + ' أو x = -' + (kAbs - cAbs)]
        ],
        controle: {
          env: { x: String(kAbs + cAbs) },
          claims: [['||x| - ' + kAbs + '|', String(cAbs)],
                   ['||-' + (kAbs + cAbs) + '| - ' + kAbs + '|', String(cAbs)],
                   ['||' + (kAbs - cAbs) + '| - ' + kAbs + '|', String(cAbs)],
                   ['||-' + (kAbs - cAbs) + '| - ' + kAbs + '|', String(cAbs)]]
        }
      },
      {
        enonce: ['نعتبر العبارة، حيث x عدد حقيقي:', 'A = ' + exprA,
                 'احسب القيمة العددية للعبارة A في كل من الحالتين x = 0 و x = ' + x2],
        indice: 'عوّض x بقيمته في العبارة، ثمّ احسب',
        etapes: [
          ['نعوّض x بـ 0', p2 + ' × 0 + ' + q2 + ' = ' + q2],
          ['قيمة A الأولى', 'A = ' + q2 + ' عند x = 0'],
          ['نعوّض x بـ ' + x2,
           p2 + ' × ' + x2 + ' + ' + q2 + ' = ' + (p2 * x2 + q2)],
          ['قيمة A الثانية', 'A = ' + (p2 * x2 + q2) + ' عند x = ' + x2]
        ],
        controle: {
          env: { x: '0', A: exprA },
          claims: [['A', String(q2)],
                   [p2 + ' × ' + x2 + ' + ' + q2, String(p2 * x2 + q2)]]
        }
      },
      {
        enonce: ['أوجد x بحيث:', exprA + ' = 0'],
        indice: 'انقل ' + q2 + ' إلى الطرف الآخر ثمّ اقسم على ' + p2,
        etapes: [
          ['ننقل الحدّ الثابت', mono(p2, 'x') + ' = -' + q2],
          ['نقسم على ' + p2, 'x = -' + q2 + '/' + p2],
          ['نختصر الكسر', '-' + q2 + '/' + p2 + ' = -1/2'],
          ['النتيجة', 'x = -1/2'],
          ['نتحقّق', mono(p2, 'x') + ' + ' + q2 + ' = 0']
        ],
        controle: { env: { x: '-1/2' }, claims: [[exprA, '0']] }
      },
      {
        enonce: ['لتكن العبارة:', 'B = ' + exprB, 'بيّن أنّ B = ' + facB],
        indice: 'العبارة من الشكل x^2 - y^2، مع x = ' + mono(p2, 'x') + ' و y = ' + q2,
        etapes: [
          ['نكتب الحدّ الأوّل مربّعا',
           mono(carre(p2), 'x^2') + ' = (' + mono(p2, 'x') + ')^2'],
          ['نكتب الحدّ الثاني مربّعا', carre(q2) + ' = ' + q2 + '^2'],
          ['نستعمل المتطابقة',
           '(' + mono(p2, 'x') + ')^2 - ' + q2 + '^2 = ' + facB],
          ['النتيجة', 'B = ' + facB]
        ],
        controle: {
          libres: ['x'], derives: { B: exprB },
          claims: [[exprB, facB]]
        }
      },
      {
        enonce: ['فكّك إلى جداء عوامل العبارة التالية:', exprD],
        indice: 'العبارة (' + exprA + ') موجودة في الحدّين',
        etapes: [
          ['نتعرّف على العامل المشترك',
           'العبارة (' + exprA + ') موجودة في الحدّين'],
          ['نكتب المربّع جداء',
           '(' + exprA + ')^2 = (' + exprA + ')(' + exprA + ')'],
          ['نضع العامل المشترك',
           exprD + ' = (' + exprA + ')[(' + mono(rD, 'x') + ' - 1) + (' + exprA + ')]'],
          ['نختصر ما بين المعقفين',
           '(' + mono(rD, 'x') + ' - 1) + (' + exprA + ') = ' + mono(rD + p2, 'x')
           + ' + ' + (q2 - 1)],
          ['النتيجة', exprD + ' = ' + facD]
        ],
        controle: {
          libres: ['x'],
          claims: [[exprD, facD]]
        }
      }
    ];
  }

  const API = { type26, type27, type28, type29 };
  if (M) module.exports = API; else racine.Fiche3 = API;
})(typeof window !== 'undefined' ? window : globalThis);
