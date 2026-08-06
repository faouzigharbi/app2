// Les huit familles d'exercices des séries « العمليات في ℝ » (9 أساسي),
// d'après les fiches de Jawher Souissi (riadhyet.com, 2018-19).
//
// Tout le chapitre tient dans un seul principe : ON NE CALCULE PAS UNE RACINE,
// on la met sous sa forme canonique a√b et on la traite comme un objet. √48
// n'est pas « environ 6,93 » : c'est 4√3, et c'est cette écriture-là qui permet
// d'additionner, de simplifier, de reconnaître un inverse.
//
// Chaque question est une expression FERMÉE : elle a une valeur exacte, et le
// validateur la recalcule avec le moteur. Il n'y a donc rien à croire sur
// parole — ni le résultat, ni aucune étape intermédiaire.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Radic;
  const R = M ? require('./racines.js') : racine.Rad;
  const { rat, txt, ent, choix } = F;

  const melanger = t => {
    const u = t.slice();
    for (let i = u.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [u[i], u[j]] = [u[j], u[i]];
    }
    return u;
  };
  // Les radicandes que le programme manipule : petits, sans facteur carré.
  const LIBRES = [2, 3, 5, 6, 7, 10, 11, 13, 15];
  const ecr = x => R.ecrire(x);
  const val = t => R.analyser(t);
  // une question = énoncé + chaîne + contrôle « cette expression vaut cela »
  const q = (enonce, indice, etapes, expr, modele, noms) => ({
    enonce, indice, etapes,
    controle: { type: 'valeur', expr, res: ecr(val(expr)), modele, noms }
  });

  // =========================================================================
  // 1 — ÉCRIRE SOUS LA FORME a√b : sortir le carré parfait du radical.
  // =========================================================================
  function qExtraire() {
    const d = choix(LIBRES), a = ent(2, 9);
    const n = a * a * d;
    const carre = a * a;
    return q(
      ['أكتب العدد ' + '√' + n + ' في صيغة ' + 'a√' + d + ' حيث a عدد صحيح طبيعي'],
      'ابحث عن أكبر مربّع كامل يقسم ' + n,
      [
        ['القاعدة', 'إذا كان a و b موجبين فإنّ √(a × b) = √a × √b'],
        ['نفكّك العدد', n + ' = ' + carre + ' × ' + d],
        ['نفصل الجذرين', '√' + n + ' = √' + carre + ' × √' + d],
        ['نحسب الجذر الكامل', '√' + carre + ' = ' + a],
        ['النتيجة', '√' + n + ' = ' + a + '√' + d]
      ], '√' + n, 'extraire');
  }

  // =========================================================================
  // 2 — SOMME ET DIFFÉRENCE : on ne peut additionner que des radicaux
  // SEMBLABLES. Il faut donc d'abord tout ramener à la forme canonique.
  // =========================================================================
  function qSomme() {
    for (let essai = 0; essai < 300; essai++) {
      const d = choix(LIBRES);
      const ks = [ent(1, 5), ent(1, 5), ent(1, 5)];
      const as = [ent(1, 6), ent(2, 7), ent(2, 7)];
      const sg = [1, choix([1, -1]), choix([1, -1])];
      const ns = as.map(a => a * a * d);
      if (new Set(ns).size < 3) continue;
      const total = sg.reduce((s, g, i) => s + g * ks[i] * as[i], 0);
      if (total === 0) continue;
      const morceau = i => (ks[i] === 1 ? '' : String(ks[i])) + '√' + ns[i];
      const expr = morceau(0) + sg.slice(1).map((g, i) =>
        (g < 0 ? ' - ' : ' + ') + morceau(i + 1)).join('');
      // « 1√15 » ne s'écrit pas : un coefficient 1 est muet.
      const cf = k => (k === 1 ? '' : String(k));
      const formes = ns.map((n, i) => '√' + n + ' = ' + cf(as[i]) + '√' + d);
      return q(
        ['اختصر العبارة التالية:', 'A = ' + expr],
        'أرجع كلّ جذر إلى الشكل a√' + d + ': عندئذ تصبح الحدود متشابهة',
        [
          ['القاعدة', 'لا نجمع إلاّ الجذور المتشابهة، أي التي لها نفس ما تحت الجذر'],
          ['نُرجع الجذر الأوّل', formes[0]],
          ['نُرجع الجذر الثاني', formes[1]],
          ['نُرجع الجذر الثالث', formes[2]],
          ['نعيد كتابة العبارة', 'A = ' + ks.map((k, i) =>
            (i === 0 ? '' : (sg[i] < 0 ? ' - ' : ' + ')) + cf(k * as[i]) + '√' + d).join('')],
          ['نجمع المعاملات', ks.map((k, i) => (i === 0 ? '' : (sg[i] < 0 ? ' - ' : ' + '))
            + (k * as[i])).join('') + ' = ' + total],
          ['النتيجة', 'A = ' + ecr(val(expr))]
        ], expr, 'somme');
    }
    return qSomme();
  }

  // =========================================================================
  // 3 — PRODUIT ET QUOTIENT : √a × √b = √(ab), et surtout le quotient qui
  // simplifie tout seul quand on le met sous un seul radical.
  // =========================================================================
  function qProduitQuotient() {
    const modele = choix(['produit', 'quotient', 'fraction']);
    if (modele === 'produit') {
      const a = choix([2, 3, 5, 6, 7]), b = choix([2, 3, 5, 6, 7, 10, 14, 15]);
      const k = ent(1, 4), m = ent(1, 4);
      const expr = (k === 1 ? '' : k) + '√' + a + ' × ' + (m === 1 ? '' : m) + '√' + b;
      return q(
        ['احسب و اكتب النتيجة في أبسط شكل:', 'A = ' + expr],
        'اضرب الأعداد مع بعضها و ما تحت الجذرين مع بعضه',
        [
          ['القاعدة', '√a × √b = √(a × b) من أجل a و b موجبين'],
          ['نضرب المعاملين', k + ' × ' + m + ' = ' + (k * m)],
          ['نضرب ما تحت الجذرين', '√' + a + ' × √' + b + ' = √' + (a * b)],
          ['نعيد الكتابة', 'A = ' + (k * m === 1 ? '' : k * m) + '√' + (a * b)],
          ['نُبسّط الجذر', '√' + (a * b) + ' = ' + ecr(R.rac(a * b))],
          ['النتيجة', 'A = ' + ecr(val(expr))]
        ], expr, modele);
    }
    if (modele === 'quotient') {
      const d = choix(LIBRES), a = ent(2, 6), b = ent(2, 6);
      const k = ent(2, 9), m = ent(2, 9);
      const expr = k + '√' + (a * a * d) + '/(' + m + '√' + (b * b * d) + ')';
      return q(
        ['احسب و اكتب النتيجة في أبسط شكل:', 'A = ' + expr],
        'أرجع كلّ جذر إلى الشكل a√' + d + ': الجذر يختفي من نفسه',
        [
          ['نُبسّط جذر البسط', '√' + (a * a * d) + ' = ' + a + '√' + d],
          ['نُبسّط جذر المقام', '√' + (b * b * d) + ' = ' + b + '√' + d],
          ['نعيد كتابة الكسر', 'A = ' + (k * a) + '√' + d + '/(' + (m * b) + '√' + d + ')'],
          ['نختصر بـ √' + d, 'الجذر نفسه في البسط و المقام، فنختصر به'],
          ['النتيجة', 'A = ' + ecr(val(expr))]
        ], expr, modele);
    }
    const n = ent(2, 9), m = ent(2, 9);
    const expr = '√' + n + ' × √(' + (n * m * m) + '/' + n + ')';
    return q(
      ['احسب و اكتب النتيجة في أبسط شكل:', 'A = ' + expr],
      'اجمع الجذرين تحت جذر واحد قبل أن تحسب',
      [
        ['القاعدة', '√a × √b = √(a × b)، فنجمع ما تحت الجذرين'],
        ['نجمع تحت جذر واحد', 'A = √(' + n + ' × ' + (n * m * m) + '/' + n + ')'],
        ['نختصر داخل الجذر', n + ' × ' + (n * m * m) + '/' + n + ' = ' + (n * m * m)],
        ['نُبسّط الجذر', '√' + (n * m * m) + ' = ' + ecr(R.rac(n * m * m))],
        ['النتيجة', 'A = ' + ecr(val(expr))]
      ], expr, modele);
  }

  // =========================================================================
  // 4 — DÉVELOPPER : le produit de deux binômes à radicaux, et le carré.
  // C'est ici que √d × √d = d fait disparaître le radical.
  // =========================================================================
  function qDevelopper() {
    const modele = choix(['binomes', 'carre', 'conjugues']);
    const d = choix(LIBRES);
    if (modele === 'carre') {
      const a = ent(1, 5), s = choix(['+', '-']);
      const expr = '(√' + d + ' ' + s + ' ' + a + ')^2';
      return q(
        ['أنشر و اختصر:', 'A = ' + expr],
        'استعمل المتطابقة الشهيرة: (a ' + s + ' b)^2',
        [
          ['المتطابقة الشهيرة', s === '+' ? 'نستعمل المتطابقة (a + b)^2 = a^2 + 2ab + b^2'
            : 'نستعمل المتطابقة (a - b)^2 = a^2 - 2ab + b^2'],
          ['المربّع الأوّل', '(√' + d + ')^2 = ' + d],
          ['الحدّ الأوسط', '2 × √' + d + ' × ' + a + ' = ' + (2 * a) + '√' + d],
          ['المربّع الثاني', a + '^2 = ' + (a * a)],
          ['نجمع', 'A = ' + d + ' ' + s + ' ' + (2 * a) + '√' + d + ' + ' + (a * a)],
          ['النتيجة', 'A = ' + ecr(val(expr))]
        ], expr, modele);
    }
    if (modele === 'conjugues') {
      const a = ent(1, 6), b = ent(1, 4);
      const expr = '(' + a + ' + ' + (b === 1 ? '' : b) + '√' + d + ')('
        + a + ' - ' + (b === 1 ? '' : b) + '√' + d + ')';
      return q(
        ['أنشر و اختصر:', 'A = ' + expr],
        'العددان متلازمان: استعمل (a - b)(a + b) = a^2 - b^2',
        [
          ['المتطابقة الشهيرة', 'نستعمل المتطابقة (a - b)(a + b) = a^2 - b^2'],
          ['المربّع الأوّل', a + '^2 = ' + (a * a)],
          ['المربّع الثاني', '(' + (b === 1 ? '' : b) + '√' + d + ')^2 = ' + (b * b * d)],
          ['نطرح', 'A = ' + (a * a) + ' - ' + (b * b * d)],
          ['النتيجة', 'A = ' + ecr(val(expr)) + ' و هو عدد ناطق: الجذر اختفى']
        ], expr, modele);
    }
    const a = ent(1, 5), b = ent(1, 3), c = ent(1, 5), e = ent(1, 3);
    const expr = '(' + (b === 1 ? '' : b) + '√' + d + ' + ' + a + ')('
      + (e === 1 ? '' : e) + '√' + d + ' + ' + c + ')';
    return q(
      ['أنشر و اختصر:', 'A = ' + expr],
      'جداء قوسين يعطي أربعة جداءات، و √' + d + ' × √' + d + ' = ' + d,
      [
        ['القاعدة', 'جداء قوسين: نضرب كلّ حدّ من الأوّل في كلّ حدّ من الثاني'],
        ['الجداء الأوّل', (b === 1 ? '' : b) + '√' + d + ' × ' + (e === 1 ? '' : e)
          + '√' + d + ' = ' + (b * e * d)],
        ['الجداءان الأوسطان', (b * c === 1 ? '' : b * c) + '√' + d + ' + '
          + (a * e === 1 ? '' : a * e) + '√' + d + ' = '
          + (b * c + a * e === 1 ? '' : b * c + a * e) + '√' + d],
        ['الجداء الأخير', a + ' × ' + c + ' = ' + (a * c)],
        ['نجمع', 'A = ' + (b * e * d) + ' + ' + (a * c) + ' + ' + (b * c + a * e) + '√' + d],
        ['النتيجة', 'A = ' + ecr(val(expr))]
      ], expr, modele);
  }

  // =========================================================================
  // 5 — FACTORISER avec un radical commun : 2√7 - 3√21 = √7(2 - 3√3).
  // =========================================================================
  function qFactoriser() {
    for (let essai = 0; essai < 200; essai++) {
      const p = choix([2, 3, 5, 7, 11]), r = choix(LIBRES.filter(x => x !== p));
      const a = ent(2, 6), b = ent(2, 6);
      const expr = a + '√' + p + ' - ' + b + '√' + (p * r);
      const fact = '√' + p + '(' + a + ' - ' + b + '√' + r + ')';
      if (!R.memes(val(expr), val(fact))) continue;
      return q(
        ['فكّك إلى جداء عوامل:', 'A = ' + expr],
        'ابحث عن جذر مشترك: ' + (p * r) + ' = ' + p + ' × ' + r,
        [
          ['نفكّك ما تحت الجذر الثاني', p * r + ' = ' + p + ' × ' + r],
          ['نفصل الجذرين', '√' + (p * r) + ' = √' + p + ' × √' + r],
          ['نعيد كتابة العبارة', 'A = ' + a + '√' + p + ' - ' + b + '√' + p + ' × √' + r],
          ['نُخرج العامل المشترك', 'A = ' + fact],
          ['نتحقّق بالنشر', fact + ' = ' + expr]
        ], expr, 'facteurCommun');
    }
    return qFactoriser();
  }

  // =========================================================================
  // 6 — RENDRE LE DÉNOMINATEUR RATIONNEL. Un radical au dénominateur n'est pas
  // faux, il est simplement inutilisable : on ne sait pas le comparer.
  // =========================================================================
  function qRationaliser() {
    const modele = choix(['simple', 'binome']);
    const d = choix(LIBRES);
    if (modele === 'simple') {
      const k = ent(2, 12), m = ent(1, 5);
      const expr = k + '/(' + (m === 1 ? '' : m) + '√' + d + ')';
      return q(
        ['اجعل المقام ناطقا:', 'A = ' + expr],
        'اضرب البسط و المقام في √' + d,
        [
          ['القاعدة', 'نضرب البسط و المقام في نفس العدد: قيمة الكسر لا تتغيّر'],
          ['نضرب في √' + d, 'A = ' + k + '√' + d + '/(' + (m === 1 ? '' : m)
            + '√' + d + ' × √' + d + ')'],
          ['الجذر يختفي من المقام', '√' + d + ' × √' + d + ' = ' + d],
          ['نعيد الكتابة', 'A = ' + k + '√' + d + '/' + (m * d)],
          ['النتيجة', 'A = ' + ecr(val(expr))]
        ], expr, modele);
    }
    const a = ent(1, 6), b = ent(1, 3), k = ent(1, 9);
    if (a * a === b * b * d) return qRationaliser();
    const conj = a + ' - ' + (b === 1 ? '' : b) + '√' + d;
    const expr = k + '/(' + a + ' + ' + (b === 1 ? '' : b) + '√' + d + ')';
    return q(
      ['اجعل المقام ناطقا:', 'A = ' + expr],
      'اضرب البسط و المقام في مرافق المقام: الجذر يختفي بفضل المتطابقة',
      [
        ['القاعدة', 'نستعمل المرافق: (a + b)(a - b) = a^2 - b^2، و المربّع يُزيل الجذر'],
        ['المرافق', 'مرافق المقام هو ' + conj],
        ['نضرب في المرافق', 'A = ' + k + '(' + conj + ')/((' + a + ' + '
          + (b === 1 ? '' : b) + '√' + d + ')(' + conj + '))'],
        ['نحسب المقام', '(' + a + ')^2 - (' + (b === 1 ? '' : b) + '√' + d + ')^2 = '
          + (a * a) + ' - ' + (b * b * d) + ' = ' + (a * a - b * b * d)],
        ['نعيد الكتابة', 'A = ' + k + '(' + conj + ')'
          + (a * a - b * b * d === 1 ? '' : '/' + (a * a - b * b * d))],
        ['النتيجة', 'A = ' + ecr(val(expr))]
      ], expr, modele);
  }

  // =========================================================================
  // 7 — DEUX NOMBRES INVERSES : leur produit vaut 1. C'est le conjugué qui
  // fait le travail, et l'exercice ne demande aucun calcul approché.
  // =========================================================================
  function qInverses() {
    for (let essai = 0; essai < 200; essai++) {
      const d = choix([2, 3, 5, 6, 7]);
      const a = ent(1, 6), b = 1;
      const den = a * a - b * b * d;
      if (den === 0 || Math.abs(den) > 6) continue;
      const A = a + ' + √' + d;
      const B = den === 1 ? '(' + a + ' - √' + d + ')'
        : '(' + a + ' - √' + d + ')/' + den;
      const produit = '(' + A + ') × ' + B;
      if (!R.memes(val(produit), R.cst(rat(1)))) continue;
      return q(
        ['بيّن أنّ العددين', 'a = ' + A, 'و', 'b = ' + B, 'مقلوبان'],
        'عددان مقلوبان جداؤهما يساوي 1: احسب a × b',
        [
          ['ما معنى مقلوبان', 'عددان مقلوبان إذا كان جداؤهما يساوي 1'],
          ['نكتب الجداء', 'a × b = ' + produit],
          ['نستعمل المرافق', '(' + a + ' + √' + d + ')(' + a + ' - √' + d + ') = '
            + (a * a) + ' - ' + d],
          ['نحسب', (a * a) + ' - ' + d + ' = ' + den],
          [den === 1 ? 'الجداء يساوي 1' : 'نقسم على ' + den,
            den === 1 ? 'الجداء يساوي 1 مباشرة' : den + '/' + den + ' = 1'],
          ['النتيجة', 'a × b = 1 إذن العددان مقلوبان']
        ], produit, 'inverses', { a: A, b: B });
    }
    return qInverses();
  }

  // =========================================================================
  // 8 — √(A²) = |A|, et non A. C'est LA faute du chapitre : le radical rend
  // toujours un nombre positif, quel que soit le signe de ce qu'on a élevé.
  // =========================================================================
  function qCarreAbsolu() {
    for (let essai = 0; essai < 200; essai++) {
      const d = choix([2, 3, 5, 6, 7]), a = ent(1, 4);
      const dedans = choix([a + ' - √' + d, '√' + d + ' - ' + a]);
      const expr = '√((' + dedans + ')^2)';
      const v = R.valeur(val(dedans));
      if (Math.abs(v) < 0.25) continue;
      const negatif = v < 0;
      return q(
        ['اختصر العبارة:', 'A = ' + expr],
        'انتبه: √(x^2) = |x| و ليس x. قارن العددين أوّلا لتحدّد الإشارة',
        [
          ['القاعدة', 'من أجل كلّ عدد حقيقي x، √(x^2) = |x|، لأنّ الجذر موجب دائما'],
          ['نطبّق القاعدة', 'A = |' + dedans + '|'],
          ['نقارن بالعددين', '√' + d + ' يقارب ' + Math.sqrt(d).toFixed(2)
            + ' و العدد الآخر هو ' + a],
          ['نستنتج الإشارة', dedans + ' عدد ' + (negatif ? 'سالب' : 'موجب')],
          ['نزيل القيمة المطلقة', negatif
            ? 'القيمة المطلقة لعدد سالب هي مقابله' : 'القيمة المطلقة لعدد موجب هي هو نفسه'],
          ['النتيجة', 'A = ' + ecr(val(expr))]
        ], expr, negatif ? 'negatif' : 'positif');
    }
    return qCarreAbsolu();
  }

  const lot = (f, k) => () => Array.from({ length: k }, f);
  const API = {
    exercice1: lot(qExtraire, 4), exercice2: lot(qSomme, 3),
    exercice3: lot(qProduitQuotient, 4), exercice4: lot(qDevelopper, 4),
    exercice5: lot(qFactoriser, 3), exercice6: lot(qRationaliser, 4),
    exercice7: lot(qInverses, 3), exercice8: lot(qCarreAbsolu, 4),
    qExtraire, qSomme, qProduitQuotient, qDevelopper, qFactoriser,
    qRationaliser, qInverses, qCarreAbsolu
  };
  if (M) module.exports = API;
  else racine.Exos = API;
})(typeof window !== 'undefined' ? window : globalThis);
