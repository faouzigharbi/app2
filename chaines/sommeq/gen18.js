// Exercice 18 de la fiche « الجمع و الطرح في ℚ — تمارين شاملة ».
//
// L'exercice de la fiche s'écrit :
//   1) a et b rationnels
//      a- calculer E et F sachant que a + b = -3/2, avec
//         E = -3 - [(-2/5) + (-b - 1,5)] + (1,2 + a)
//         F =  1 - [a + (-3/2)] - (1,3 + b)
//      b- calculer E lorsque a et b sont opposés
//      c- calculer F lorsque a = b
//   2) trouver x :  -10 - (x + 5/3) = 1 ;  2 + [(-1/2) - x] = 0 ;
//                   12/5 + |x| + 3/4 = 3
//
// Une seule page, SEPT maillons — c'est l'exercice entier, pas un extrait.
// Tous les nombres sont retirés à chaque chargement ; les sept questions
// partagent le même tirage, exactement comme les sous-questions d'un énoncé
// partagent leurs données.
//
// Le point de méthode, et il est le seul qui compte ici : E et F ne se
// calculent PAS en cherchant a puis b. On lève les parenthèses, on regroupe
// a et b, on voit apparaître (a + b), et on remplace. La chaîne montre ce
// geste-là ; c'est pour cela que « نجمّع المجهولين » est une étape à part.
//
// La troisième équation est le piège de la fiche : une valeur absolue ne peut
// pas être négative. Le générateur tire une fois sur deux le cas impossible —
// l'élève doit apprendre à regarder le signe avant de conclure.
(function (racine) {
  'use strict';
  const F = (typeof module !== 'undefined' && module.exports) ? require('./noyau.js') : racine.Somme;
  const { rat, add, sub, neg, signe, txt, par, plus, ent, choix, decimal } = F;

  const DEN = [2, 4, 5, 10];
  const entNonNul = (a, b) => { let v; do { v = ent(a, b); } while (v === 0); return v; };
  const fracPos = () => {                       // fraction > 0, jamais entière
    let f;
    do { f = rat(ent(1, 11), choix(DEN)); } while (f.d === 1);
    return f;
  };
  const decNonRonde = (a, b) => {               // 0,5 … 3,5 — jamais 2 tout rond
    let d;
    do { d = ent(a, b); } while (d % 10 === 0);
    return decimal(d);
  };

  function tirage() {
    for (;;) {
      const s = rat(entNonNul(-9, 9), choix(DEN));      // la donnée : a + b

      // E = c - [(-p) + (-b - q)] + (r + a)  =  (a + b) + (c + p + q + r)
      const c = entNonNul(-6, 6), p = fracPos();
      const q = decNonRonde(5, 35), r = decNonRonde(5, 35);
      const kE = add(add(add(rat(c), p), q.v), r.v);

      // F = u - [a + (-m)] - (t + b)  =  -(a + b) + (u + m - t)
      const u = entNonNul(-4, 6), m = fracPos(), t = decNonRonde(5, 35);
      const kF = sub(add(rat(u), m), t.v);

      if (kE.n === 0 || kF.n === 0) continue;           // résultat trivial
      const Ev = add(s, kE), Fv = add(neg(s), kF);
      if (Ev.n === 0 || Fv.n === 0) continue;
      if (F.egaux(kE, kF)) continue;                    // les deux constantes doivent différer

      return {
        s, c, p, q, r, kE, Ev, u, m, t, kF, Fv,
        defE: txt(rat(c)) + ' - [(' + txt(neg(p)) + ') + (-b - ' + q.t + ')] + (' + r.t + ' + a)',
        defF: txt(rat(u)) + ' - [a + (' + txt(neg(m)) + ')] - (' + t.t + ' + b)'
      };
    }
  }

  // ---------------------------------------------------------------------
  // 1-a) calculer E, sachant a + b
  // ---------------------------------------------------------------------
  function q1(T) {
    const constantes = txt(rat(T.c)) + plus(T.p) + ' + ' + T.q.t + ' + ' + T.r.t;
    return {
      enonce: ['ليكن a و b عددين كسريّين نسبيّين حيث', 'a + b = ' + txt(T.s),
               '؛ أبسط العبارة التالية ثمّ احسبها:', 'E = ' + T.defE],
      indice: 'لا تبحث عن a و لا عن b: اجمعهما معا لتظهر a + b',
      etapes: [
        ['نرفع القوس الداخلي',
         '(' + txt(neg(T.p)) + ') + (-b - ' + T.q.t + ') = ' + txt(neg(T.p)) + ' - b - ' + T.q.t],
        ['نرفع القوسين الباقيين',
         'E = ' + txt(rat(T.c)) + plus(T.p) + ' + b + ' + T.q.t + ' + ' + T.r.t + ' + a'],
        ['نجمّع المجهولين', 'E = (a + b) + (' + constantes + ')'],
        ['نحسب الثابت', constantes + ' = ' + txt(T.kE)],
        ['نعوّض بالمعطى', 'E = ' + par(T.s) + plus(T.kE)],
        ['النتيجة', 'E = ' + txt(T.Ev)]
      ],
      controle: { type: 'forme', defs: { E: T.defE, F: T.defF }, libres: ['a'],
                  lie: { nom: 'b', via: 'somme', autre: 'a', valeur: T.s },
                  claims: [{ nom: 'E', vaut: T.Ev }] }
    };
  }

  // ---------------------------------------------------------------------
  // 1-a) calculer F — ici c'est -(a + b) qui apparaît
  // ---------------------------------------------------------------------
  function q2(T) {
    const constantes = txt(rat(T.u)) + plus(T.m) + ' - ' + T.t.t;
    return {
      enonce: ['ليكن a و b عددين كسريّين نسبيّين حيث', 'a + b = ' + txt(T.s),
               '؛ أبسط العبارة التالية ثمّ احسبها:', 'F = ' + T.defF],
      indice: 'انتبه: هنا يظهر مقابل المجموع، أي -(a + b)',
      etapes: [
        ['نرفع القوس الأول',
         txt(rat(T.u)) + ' - [a + (' + txt(neg(T.m)) + ')] = ' + txt(rat(T.u)) + ' - a' + plus(T.m)],
        ['نرفع القوس الثاني', '- (' + T.t.t + ' + b) = -' + T.t.t + ' - b'],
        ['نكتب العبارة بدون أقواس',
         'F = ' + txt(rat(T.u)) + ' - a' + plus(T.m) + ' - ' + T.t.t + ' - b'],
        ['نجمّع المجهولين', 'F = -(a + b) + (' + constantes + ')'],
        ['نحسب الثابت', constantes + ' = ' + txt(T.kF)],
        ['نعوّض بالمعطى', 'F = -' + par(T.s) + plus(T.kF)],
        ['النتيجة', 'F = ' + txt(T.Fv)]
      ],
      controle: { type: 'forme', defs: { E: T.defE, F: T.defF }, libres: ['a'],
                  lie: { nom: 'b', via: 'somme', autre: 'a', valeur: T.s },
                  claims: [{ nom: 'F', vaut: T.Fv }] }
    };
  }

  // ---------------------------------------------------------------------
  // 1-b) E lorsque a et b sont opposés — la somme vaut 0
  // ---------------------------------------------------------------------
  function q3(T) {
    return {
      enonce: ['ليكن a و b عددين كسريّين نسبيّين متقابلين؛ احسب:', 'E = ' + T.defE],
      indice: 'متقابلان يعني b = -a، فما هو a + b ؟',
      etapes: [
        ['نترجم « متقابلان »', 'b = -a'],
        ['نحسب المجموع', 'a + b = a + (-a) = 0'],
        ['نستعمل الشكل المبسّط', 'E = (a + b) + ' + par(T.kE)],
        ['نعوّض', 'E = 0 + ' + par(T.kE)],
        ['النتيجة', 'E = ' + txt(T.kE)]
      ],
      controle: { type: 'forme', defs: { E: T.defE, F: T.defF }, libres: ['a'],
                  lie: { nom: 'b', via: 'oppose', autre: 'a' },
                  claims: [{ nom: 'E', vaut: T.kE }] }
    };
  }

  // ---------------------------------------------------------------------
  // 1-c) F lorsque a = b — le résultat reste en fonction de a
  // ---------------------------------------------------------------------
  function q4(T) {
    return {
      enonce: ['ليكن a و b عددين كسريّين نسبيّين حيث', 'a = b',
               '؛ احسب F بدلالة a:', 'F = ' + T.defF],
      indice: 'إذا كان a = b فإنّ a + b = 2a',
      etapes: [
        ['نترجم المعطى', 'b = a'],
        ['نحسب المجموع', 'a + b = a + a = 2a'],
        ['نستعمل الشكل المبسّط', 'F = -(a + b) + ' + par(T.kF)],
        ['نعوّض', 'F = -(2a) + ' + par(T.kF)],
        ['النتيجة بدلالة a', 'F = ' + txt(T.kF) + ' - 2a']
      ],
      controle: { type: 'forme', defs: { E: T.defE, F: T.defF }, libres: ['a'],
                  lie: { nom: 'b', via: 'egal', autre: 'a' },
                  verifierForme: { nom: 'F', cible: { ca: -2, cb: 0, k: T.kF }, u: 'a', v: null } }
    };
  }

  // ---------------------------------------------------------------------
  // 2-a)  A - (x + B) = C
  // ---------------------------------------------------------------------
  function q5() {
    let A, B, C, K, sol;
    for (;;) {
      A = rat(entNonNul(-12, 12)); B = fracPos(); C = rat(entNonNul(-4, 4));
      K = sub(A, B); sol = sub(K, C);
      if (sol.n !== 0 && sol.d !== 1) break;        // solution non nulle, fractionnaire
    }
    const eq = txt(A) + ' - (x + ' + txt(B) + ') = ' + txt(C);
    return {
      enonce: ['جد العدد الكسري النسبي x بحيث:', eq],
      indice: 'ابدأ برفع القوس المسبوق بعلامة الطرح',
      etapes: [
        ['نرفع القوس', txt(A) + ' - x - ' + txt(B) + ' = ' + txt(C)],
        ['نحسب الثابت', txt(A) + ' - ' + txt(B) + ' = ' + txt(K)],
        ['نكتب المعادلة', txt(K) + ' - x = ' + txt(C)],
        ['المجهول هو الفرق', 'x = ' + par(K) + ' - ' + par(C)],
        ['النتيجة', 'x = ' + txt(sol)]
      ],
      controle: { type: 'equation', eq, sol }
    };
  }

  // ---------------------------------------------------------------------
  // 2-b)  A + [(-p) - x] = C
  // ---------------------------------------------------------------------
  function q6() {
    let A, p, C, K, sol;
    for (;;) {
      A = rat(entNonNul(-6, 6)); p = fracPos(); C = rat(ent(-3, 3));
      K = sub(A, p); sol = sub(K, C);
      if (sol.n !== 0) break;
    }
    const eq = txt(A) + ' + [(' + txt(neg(p)) + ') - x] = ' + txt(C);
    return {
      enonce: ['جد العدد الكسري النسبي x بحيث:', eq],
      indice: 'القوس المربّع مسبوق بعلامة الجمع: نرفعه دون تغيير',
      etapes: [
        ['نرفع القوس', txt(A) + ' - ' + txt(p) + ' - x = ' + txt(C)],
        ['نحسب الثابت', txt(A) + ' - ' + txt(p) + ' = ' + txt(K)],
        ['نكتب المعادلة', txt(K) + ' - x = ' + txt(C)],
        ['المجهول هو الفرق', 'x = ' + par(K) + ' - ' + par(C)],
        ['النتيجة', 'x = ' + txt(sol)]
      ],
      controle: { type: 'equation', eq, sol }
    };
  }

  // ---------------------------------------------------------------------
  // 2-c)  p + |x| + q = C  — une valeur absolue n'est jamais négative
  // ---------------------------------------------------------------------
  function q7() {
    const voulu = Math.random() < 0.5 ? -1 : 1;   // un cas impossible une fois sur deux
    let p, q, C, m;
    for (;;) {
      // Le second membre reste positif : sinon l'impossibilité se voit sans
      // calculer, et la question ne teste plus rien.
      p = fracPos(); q = fracPos(); C = rat(ent(1, 4));
      m = sub(sub(C, p), q);
      if (m.n !== 0 && signe(m) === voulu) break;
    }
    const eq = txt(p) + ' + |x| + ' + txt(q) + ' = ' + txt(C);
    const possible = signe(m) > 0;
    return {
      enonce: ['جد العدد الكسري النسبي x بحيث:', eq],
      indice: 'اعزل |x| أولا، ثمّ انظر إلى إشارة ما تحصّلت عليه',
      etapes: [
        ['نعزل القيمة المطلقة', '|x| = ' + txt(C) + ' - ' + par(p) + ' - ' + par(q)],
        ['نحسب العضو الثاني', txt(C) + ' - ' + par(p) + ' - ' + par(q) + ' = ' + txt(m)],
        ['نقارن بالصفر', txt(m) + (possible ? ' > 0' : ' < 0')],
        ['القاعدة', possible ? 'القيمة المطلقة موجبة، إذن للمعادلة حلاّن متقابلان'
                             : 'القيمة المطلقة لعدد لا يمكن أن تكون سالبة'],
        ['النتيجة', possible ? 'x = ' + txt(m) + '  أو  x = ' + txt(neg(m))
                             : 'لا يوجد عدد كسري نسبي x يحقّق المعادلة']
      ],
      controle: { type: 'abs', eq, m, possible }
    };
  }

  function f() {
    const T = tirage();
    return [q1(T), q2(T), q3(T), q4(T), q5(), q6(), q7()];
  }

  F.enregistrer(18, { titre: 'الجمع و الطرح في ℚ — عبارات و معادلات', f, questions: 7 });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f, tirage };
})(typeof window !== 'undefined' ? window : globalThis);
