/* Devoirati — chapitre « الكسور » (9ème année).
   Ces huit générateurs remplacent les quatorze anciennes pages du dossier
   generateurs_pdf9 (voir legacy/ et docs/MIGRATION.md pour la correspondance). */
(function (DV) {
  'use strict';

  var R = DV.render;
  var F = DV.Frac;
  var reg = DV.registry;

  /* ---------- utilitaires communs au chapitre ---------- */

  function lcmAll(fracs) {
    return fracs.reduce(function (acc, f) { return DV.lcm(acc, f.d); }, 1);
  }

  /* Écriture décimale exacte d'un rationnel décimal (sans arrondi flottant). */
  function decimalString(f) {
    var d = f.d, a = 0, b = 0;
    while (d % 2 === 0) { d /= 2; a++; }
    while (d % 5 === 0) { d /= 5; b++; }
    var k = Math.max(a, b);
    var scaled = Math.abs(f.n) * Math.pow(10, k) / f.d;
    var s = String(Math.round(scaled));
    if (k === 0) return (f.n < 0 ? '−' : '') + s;
    while (s.length <= k) s = '0' + s;
    var out = s.slice(0, s.length - k) + ',' + s.slice(s.length - k);
    out = out.replace(/,?0+$/, '');
    return (f.n < 0 ? '−' : '') + out;
  }

  function factorText(n) {
    var f = DV.factorize(n);
    if (!f.length) return String(n);
    return f.map(function (pe) {
      return pe[1] === 1 ? String(pe[0]) : pe[0] + '<sup>' + pe[1] + '</sup>';
    }).join(' × ');
  }

  /* Suite « f1 op f2 op f3 » rendue en HTML. */
  function chainHTML(terms, ops) {
    var h = R.frac(terms[0]);
    for (var i = 1; i < terms.length; i++) h += R.op(ops[i - 1]) + R.frac(terms[i]);
    return R.expr(h);
  }

  /* Étapes de mise au même dénominateur puis addition/soustraction. */
  function additiveSteps(terms, ops) {
    var L = lcmAll(terms);
    var steps = [];
    var dens = terms.map(function (t) { return t.d; });

    steps.push('نوحّد المقامات: م.م.أ' + '(' + dens.join(' ; ') + ') = <strong>' + L + '</strong>');

    var conv = terms.map(function (t) { return { n: t.n * (L / t.d), d: L, k: L / t.d }; });
    var convHTML = R.frac(terms[0]) + ' = ' + R.rawFrac(conv[0].n, L);
    for (var i = 1; i < terms.length; i++) {
      convHTML += '<span class="m-sep">,</span> ' + R.frac(terms[i]) + ' = ' + R.rawFrac(conv[i].n, L);
    }
    steps.push('نحوّل كل كسر: ' + R.expr(convHTML));

    var numExpr = String(conv[0].n);
    var total = conv[0].n;
    for (var j = 1; j < conv.length; j++) {
      numExpr += ' ' + (ops[j - 1] === '+' ? '+' : '−') + ' ' + conv[j].n;
      total = ops[j - 1] === '+' ? total + conv[j].n : total - conv[j].n;
    }
    steps.push('نجمع (أو نطرح) البسوط: ' +
      R.expr(R.fracExpr(numExpr, String(L)) + R.op('=') + R.rawFrac(total, L)));

    var res = new F(total, L);
    if (res.d !== L || Math.abs(res.n) !== Math.abs(total)) {
      steps.push('نبسّط بالقسمة على ' + DV.gcd(total, L) + ' : ' + R.expr(R.rawFrac(total, L) + R.op('=') + R.frac(res)));
    } else {
      steps.push('الكسر في أبسط صورة: ' + R.expr(R.frac(res)));
    }
    return { steps: steps, result: res };
  }

  function fracAnswer(f) {
    return { kind: 'frac', frac: f };
  }

  /* ---------- 1. Simplification ---------- */

  reg.register({
    id: 'fractions-simplification',
    chapter: 'fractions',
    title: 'تبسيط الكسور',
    summary: 'اختزال كسر إلى أبسط صورة باستعمال القاسم المشترك الأكبر.',
    levels: [
      { id: 'facile', label: 'سهل' },
      { id: 'moyen', label: 'متوسط' },
      { id: 'difficile', label: 'صعب' }
    ],
    instruction: 'اكتب الكسر في أبسط صورة.',
    make: function (rng, level) {
      var ranges = {
        facile: { k: [2, 5], n: [1, 9], d: [2, 9] },
        moyen: { k: [4, 12], n: [1, 12], d: [2, 12] },
        difficile: { k: [10, 30], n: [1, 15], d: [2, 20] }
      }[level] || { k: [2, 5], n: [1, 9], d: [2, 9] };

      var base = rng.frac(ranges.n[0], ranges.n[1], ranges.d[0], ranges.d[1]);
      var k = rng.int(ranges.k[0], ranges.k[1]);
      var n = base.n * k, d = base.d * k;

      return {
        prompt: R.expr(R.rawFrac(n, d)),
        instruction: 'اكتب الكسر في أبسط صورة.',
        answer: fracAnswer(base),
        answerHTML: R.expr(R.frac(base)),
        hint: 'ابحث عن القاسم المشترك الأكبر بين ' + n + ' و ' + d + '.',
        steps: [
          'نحلّل البسط والمقام: ' + n + ' = ' + factorText(n) + '<span class="m-sep">،</span> ' + d + ' = ' + factorText(d),
          'القاسم المشترك الأكبر: ق.م.أ(' + n + ' ; ' + d + ') = <strong>' + k + '</strong>',
          'نقسم البسط والمقام على ' + k + ' : ' + n + ' ÷ ' + k + ' = ' + base.n +
            '<span class="m-sep">،</span> ' + d + ' ÷ ' + k + ' = ' + base.d,
          'النتيجة: ' + R.expr(R.rawFrac(n, d) + R.op('=') + R.frac(base))
        ]
      };
    }
  });

  /* ---------- 2. Somme et différence ---------- */

  reg.register({
    id: 'fractions-somme',
    chapter: 'fractions',
    title: 'جمع وطرح الكسور',
    summary: 'جمع وطرح كسرين أو ثلاثة مع توحيد المقامات.',
    levels: [
      { id: 'meme-denominateur', label: 'نفس المقام' },
      { id: 'moyen', label: 'مقامات مختلفة' },
      { id: 'difficile', label: 'ثلاثة كسور' }
    ],
    instruction: 'أحسب واكتب النتيجة في أبسط صورة.',
    make: function (rng, level) {
      var terms, ops;

      if (level === 'meme-denominateur') {
        var d = rng.int(3, 12);
        var n1 = rng.int(1, d * 2), n2 = rng.int(1, d * 2);
        var plus = rng.bool();
        if (!plus && n2 > n1) { var t = n1; n1 = n2; n2 = t; }
        terms = [new F(n1, d), new F(n2, d)];
        ops = [plus ? '+' : '−'];
      } else if (level === 'difficile') {
        terms = [rng.frac(1, 9, 2, 10), rng.frac(1, 9, 2, 10), rng.frac(1, 6, 2, 8)];
        ops = [rng.bool() ? '+' : '−', rng.bool() ? '+' : '−'];
        var probe = terms[0][ops[0] === '+' ? 'add' : 'sub'](terms[1]);
        probe = probe[ops[1] === '+' ? 'add' : 'sub'](terms[2]);
        if (probe.isNeg()) { ops = ['+', '+']; }
      } else {
        var a = rng.frac(1, 9, 2, 12);
        var b = rng.frac(1, 9, 2, 12);
        if (a.d === b.d) b = new F(b.n, rng.intExcept(2, 12, a.d));
        var plus2 = rng.bool();
        if (!plus2 && b.cmp(a) > 0) { var s = a; a = b; b = s; }
        terms = [a, b];
        ops = [plus2 ? '+' : '−'];
      }

      var built = additiveSteps(terms, ops);
      return {
        prompt: chainHTML(terms, ops),
        instruction: 'أحسب واكتب النتيجة في أبسط صورة.',
        answer: fracAnswer(built.result),
        answerHTML: R.expr(R.frac(built.result)),
        hint: 'ابدأ بتوحيد المقامات باستعمال المضاعف المشترك الأصغر.',
        steps: built.steps
      };
    }
  });

  /* ---------- 3. Produit ---------- */

  reg.register({
    id: 'fractions-produit',
    chapter: 'fractions',
    title: 'ضرب الكسور',
    summary: 'ضرب كسرين أو ثلاثة مع التبسيط قبل أو بعد الضرب.',
    levels: [
      { id: 'facile', label: 'كسران' },
      { id: 'moyen', label: 'كسر × عدد صحيح' },
      { id: 'difficile', label: 'ثلاثة كسور' }
    ],
    instruction: 'أحسب الجداء واكتبه في أبسط صورة.',
    make: function (rng, level) {
      var terms;
      if (level === 'moyen') {
        terms = [rng.frac(1, 9, 2, 12), new F(rng.int(2, 12), 1)];
        if (rng.bool()) terms.reverse();
      } else if (level === 'difficile') {
        terms = [rng.frac(1, 7, 2, 9), rng.frac(1, 7, 2, 9), rng.frac(1, 5, 2, 7)];
      } else {
        terms = [rng.frac(1, 9, 2, 10), rng.frac(1, 9, 2, 10)];
      }

      var rawN = terms.reduce(function (p, f) { return p * f.n; }, 1);
      var rawD = terms.reduce(function (p, f) { return p * f.d; }, 1);
      var res = new F(rawN, rawD);
      var g = DV.gcd(rawN, rawD);

      var steps = [
        'نضرب البسوط فيما بينها والمقامات فيما بينها:',
        R.expr(R.fracExpr(
          terms.map(function (f) { return f.n; }).join(' × '),
          terms.map(function (f) { return f.d; }).join(' × ')
        ) + R.op('=') + R.rawFrac(rawN, rawD))
      ];
      steps.push(g > 1
        ? 'نبسّط بالقسمة على ق.م.أ = ' + g + ' : ' + R.expr(R.rawFrac(rawN, rawD) + R.op('=') + R.frac(res))
        : 'الكسر في أبسط صورة: ' + R.expr(R.frac(res)));

      return {
        prompt: chainHTML(terms, terms.slice(1).map(function () { return '×'; })),
        instruction: 'أحسب الجداء واكتبه في أبسط صورة.',
        answer: fracAnswer(res),
        answerHTML: R.expr(R.frac(res)),
        hint: 'يمكنك التبسيط قبل الضرب لتفادي الأعداد الكبيرة.',
        steps: steps
      };
    }
  });

  /* ---------- 4. Quotient ---------- */

  reg.register({
    id: 'fractions-quotient',
    chapter: 'fractions',
    title: 'قسمة الكسور',
    summary: 'القسمة بضرب الكسر الأول في مقلوب الثاني.',
    levels: [
      { id: 'facile', label: 'سهل' },
      { id: 'moyen', label: 'متوسط' },
      { id: 'difficile', label: 'كسر طابقي' }
    ],
    instruction: 'أحسب خارج القسمة واكتبه في أبسط صورة.',
    make: function (rng, level) {
      var a, b;
      if (level === 'facile') {
        a = rng.frac(1, 6, 2, 8);
        b = rng.frac(1, 6, 2, 8);
      } else if (level === 'difficile') {
        a = rng.frac(1, 11, 2, 12);
        b = rng.frac(1, 11, 2, 12);
      } else {
        a = rng.frac(1, 9, 2, 10);
        b = rng.frac(1, 9, 2, 10);
      }
      var inv = b.inv();
      var res = a.mul(inv);
      var rawN = a.n * b.d, rawD = a.d * b.n;

      var prompt = level === 'difficile'
        ? R.expr('<span class="m-stack"><span class="m-stack-top">' + R.frac(a) +
            '</span><span class="m-stack-bot">' + R.frac(b) + '</span></span>')
        : chainHTML([a, b], ['÷']);

      return {
        prompt: prompt,
        instruction: 'أحسب خارج القسمة واكتبه في أبسط صورة.',
        answer: fracAnswer(res),
        answerHTML: R.expr(R.frac(res)),
        hint: 'القسمة على كسر تعني الضرب في مقلوبه.',
        steps: [
          'نحوّل القسمة إلى ضرب في المقلوب: ' + R.expr(R.frac(a) + R.op('÷') + R.frac(b) + R.op('=') + R.frac(a) + R.op('×') + R.frac(inv)),
          'نضرب البسوط والمقامات: ' + R.expr(R.rawFrac(rawN, rawD)),
          (DV.gcd(rawN, rawD) > 1
            ? 'نبسّط بالقسمة على ' + DV.gcd(rawN, rawD) + ' : ' + R.expr(R.frac(res))
            : 'الكسر في أبسط صورة: ' + R.expr(R.frac(res)))
        ]
      };
    }
  });

  /* ---------- 5. Priorité des opérations ---------- */

  reg.register({
    id: 'fractions-operations',
    chapter: 'fractions',
    title: 'أولوية العمليات',
    summary: 'تمارين تجمع بين الضرب والقسمة والجمع مع احترام أولوية العمليات.',
    levels: [
      { id: 'facile', label: 'ضرب ثم جمع' },
      { id: 'moyen', label: 'قسمة ثم طرح' },
      { id: 'difficile', label: 'مختلط' }
    ],
    instruction: 'أحسب مع احترام أولوية العمليات.',
    make: function (rng, level) {
      var a = rng.frac(1, 9, 2, 10);
      var b = rng.frac(1, 7, 2, 8);
      var c = rng.frac(1, 7, 2, 8);
      var mode = level === 'difficile' ? rng.pick(['mul-add', 'div-sub', 'mul-sub']) :
        (level === 'moyen' ? 'div-sub' : 'mul-add');

      var inner, innerOp, outerOp, res;
      if (mode === 'div-sub') {
        inner = b.div(c); innerOp = '÷'; outerOp = '−';
        res = a.sub(inner);
        if (res.isNeg()) { outerOp = '+'; res = a.add(inner); }
      } else if (mode === 'mul-sub') {
        inner = b.mul(c); innerOp = '×'; outerOp = '−';
        res = a.sub(inner);
        if (res.isNeg()) { outerOp = '+'; res = a.add(inner); }
      } else {
        inner = b.mul(c); innerOp = '×'; outerOp = '+';
        res = a.add(inner);
      }

      var promptHTML = R.expr(R.frac(a) + R.op(outerOp) + R.frac(b) + R.op(innerOp) + R.frac(c));
      var built = additiveSteps([a, inner], [outerOp]);

      return {
        prompt: promptHTML,
        instruction: 'أحسب مع احترام أولوية العمليات.',
        answer: fracAnswer(res),
        answerHTML: R.expr(R.frac(res)),
        hint: 'الضرب والقسمة لهما الأولوية على الجمع والطرح.',
        steps: [
          'نبدأ بالعملية ذات الأولوية (' + (innerOp === '×' ? 'الضرب' : 'القسمة') + '): ' +
            R.expr(R.frac(b) + R.op(innerOp) + R.frac(c) + R.op('=') + R.frac(inner)),
          'يصبح التمرين: ' + R.expr(R.frac(a) + R.op(outerOp) + R.frac(inner))
        ].concat(built.steps)
      };
    }
  });

  /* ---------- 6. Parenthèses / distributivité ---------- */

  reg.register({
    id: 'fractions-parentheses',
    chapter: 'fractions',
    title: 'الكسور والأقواس',
    summary: 'نشر وحساب تعابير تحتوي على أقواس.',
    levels: [
      { id: 'facile', label: 'ضرب في قوس' },
      { id: 'moyen', label: 'قسمة على قوس' },
      { id: 'difficile', label: 'قوسان' }
    ],
    instruction: 'أحسب التعبير واكتب النتيجة في أبسط صورة.',
    make: function (rng, level) {
      var a = rng.frac(1, 7, 2, 9);
      var b = rng.frac(1, 7, 2, 9);
      var c = rng.frac(1, 6, 2, 8);
      var d = rng.frac(1, 6, 2, 8);
      var sign1 = rng.bool() ? '+' : '−';
      if (sign1 === '−' && c.cmp(b) > 0) { var t = b; b = c; c = t; }
      var innerA = sign1 === '+' ? b.add(c) : b.sub(c);

      var prompt, res, steps;

      if (level === 'difficile') {
        var sign2 = '+';
        var innerB = a.add(d);
        prompt = R.expr(R.paren(R.frac(b) + R.op(sign1) + R.frac(c)) + R.op('×') +
          R.paren(R.frac(a) + R.op(sign2) + R.frac(d)));
        res = innerA.mul(innerB);
        steps = [
          'نحسب القوس الأول: ' + R.expr(R.paren(R.frac(b) + R.op(sign1) + R.frac(c)) + R.op('=') + R.frac(innerA)),
          'نحسب القوس الثاني: ' + R.expr(R.paren(R.frac(a) + R.op(sign2) + R.frac(d)) + R.op('=') + R.frac(innerB)),
          'نضرب الناتجين: ' + R.expr(R.frac(innerA) + R.op('×') + R.frac(innerB) + R.op('=') + R.frac(res))
        ];
      } else if (level === 'moyen') {
        if (innerA.n === 0) innerA = innerA.add(new F(1, 2));
        prompt = R.expr(R.frac(a) + R.op('÷') + R.paren(R.frac(b) + R.op(sign1) + R.frac(c)));
        res = a.div(innerA);
        steps = [
          'نحسب ما بين القوسين أولا: ' + R.expr(R.paren(R.frac(b) + R.op(sign1) + R.frac(c)) + R.op('=') + R.frac(innerA)),
          'ثم نقسم بالضرب في المقلوب: ' + R.expr(R.frac(a) + R.op('×') + R.frac(innerA.inv()) + R.op('=') + R.frac(res))
        ];
      } else {
        prompt = R.expr(R.frac(a) + R.op('×') + R.paren(R.frac(b) + R.op(sign1) + R.frac(c)));
        res = a.mul(innerA);
        steps = [
          'الطريقة 1 — نحسب ما بين القوسين: ' + R.expr(R.paren(R.frac(b) + R.op(sign1) + R.frac(c)) + R.op('=') + R.frac(innerA)),
          'ثم نضرب: ' + R.expr(R.frac(a) + R.op('×') + R.frac(innerA) + R.op('=') + R.frac(res)),
          'الطريقة 2 — النشر: ' + R.expr(R.frac(a) + R.op('×') + R.frac(b) + R.op(sign1) + R.frac(a) + R.op('×') + R.frac(c)) +
            ' = ' + R.expr(R.frac(a.mul(b)) + R.op(sign1) + R.frac(a.mul(c))) + ' = ' + R.expr(R.frac(res))
        ];
      }

      return {
        prompt: prompt,
        instruction: 'أحسب التعبير واكتب النتيجة في أبسط صورة.',
        answer: fracAnswer(res),
        answerHTML: R.expr(R.frac(res)),
        hint: 'ابدأ دائما بما بين القوسين.',
        steps: steps
      };
    }
  });

  /* ---------- 7. Fractions décimales ---------- */

  reg.register({
    id: 'fractions-decimales',
    chapter: 'fractions',
    title: 'الكسور العشرية',
    summary: 'التعرّف على الكسور التي تُكتب كأعداد عشرية منتهية.',
    levels: [
      { id: 'facile', label: 'مقامات مباشرة' },
      { id: 'difficile', label: 'يجب التبسيط أولا' }
    ],
    instruction: 'هل هذا الكسر عشري؟',
    make: function (rng, level) {
      var decimalDen = [2, 4, 5, 8, 10, 16, 20, 25, 40, 50, 100, 125, 200, 250];
      var otherDen = [3, 6, 7, 9, 11, 12, 14, 15, 18, 21, 22, 24, 27, 30, 33];
      var wantDecimal = rng.bool();
      var n, d;

      if (level === 'difficile') {
        /* Le dénominateur affiché ment : il faut réduire avant de conclure.
           Ex. 9/12 = 3/4 est décimal bien que 12 ne soit pas de la forme 2^a·5^b. */
        var base = wantDecimal ? rng.pick(decimalDen) : rng.pick(otherDen);
        var k = rng.int(2, 6);
        var bn = rng.int(1, base - 1);
        while (DV.gcd(bn, base) !== 1) bn = rng.int(1, base - 1);
        n = bn * k; d = base * k;
      } else {
        d = wantDecimal ? rng.pick(decimalDen) : rng.pick(otherDen);
        n = rng.int(1, Math.max(2, d - 1));
        while (DV.gcd(n, d) !== 1) n = rng.int(1, Math.max(2, d - 1));
      }

      var f = new F(n, d);
      var isDec = f.isDecimal();
      var steps = [];

      if (f.d !== d) {
        steps.push('نبسّط أولا: ' + R.expr(R.rawFrac(n, d) + R.op('=') + R.frac(f)) +
          ' (القسمة على ' + DV.gcd(n, d) + ')');
      }
      steps.push('نحلّل المقام ' + f.d + ' إلى جداء عوامل أولية: ' + f.d + ' = ' + factorText(f.d));
      steps.push(isDec
        ? 'المقام يحتوي فقط على العاملين 2 و 5 ⟵ الكسر <strong>عشري</strong>.'
        : 'المقام يحتوي على عامل أولي غير 2 و 5 ⟵ الكسر <strong>ليس عشريا</strong>.');
      if (isDec) {
        steps.push('الكتابة العشرية: ' + R.expr(R.frac(f)) + ' = <strong>' + decimalString(f) + '</strong>');
      }

      return {
        prompt: R.expr(R.rawFrac(n, d)),
        instruction: 'هل هذا الكسر عشري؟',
        answer: { kind: 'bool', value: isDec },
        answerHTML: isDec ? 'نعم — ' + decimalString(f) : 'لا',
        hint: 'بسّط الكسر ثم انظر إلى العوامل الأولية للمقام.',
        steps: steps
      };
    }
  });

  /* ---------- 8. Factorisation par le facteur commun ---------- */

  reg.register({
    id: 'fractions-factorisation',
    chapter: 'fractions',
    title: 'التحليل بالعامل المشترك',
    summary: 'إبراز العامل المشترك لتبسيط الحساب.',
    levels: [
      { id: 'facile', label: 'حدّان' },
      { id: 'difficile', label: 'ثلاثة حدود' }
    ],
    instruction: 'حلّل بإبراز العامل المشترك ثم أحسب.',
    make: function (rng, level) {
      var k = rng.frac(1, 9, 2, 10);
      var b = rng.frac(1, 7, 2, 9);
      var c = rng.frac(1, 7, 2, 9);
      var sign = rng.bool() ? '+' : '−';
      if (sign === '−' && c.cmp(b) > 0) { var t = b; b = c; c = t; }

      var terms, promptHTML, inner, res;

      if (level === 'difficile') {
        var e = rng.frac(1, 5, 2, 7);
        inner = (sign === '+' ? b.add(c) : b.sub(c)).add(e);
        promptHTML = R.expr(
          R.frac(k) + R.op('×') + R.frac(b) + R.op(sign) +
          R.frac(k) + R.op('×') + R.frac(c) + R.op('+') +
          R.frac(k) + R.op('×') + R.frac(e));
        terms = [b, c, e];
        res = k.mul(inner);
      } else {
        inner = sign === '+' ? b.add(c) : b.sub(c);
        promptHTML = R.expr(
          R.frac(k) + R.op('×') + R.frac(b) + R.op(sign) +
          R.frac(k) + R.op('×') + R.frac(c));
        terms = [b, c];
        res = k.mul(inner);
      }

      var innerHTML = R.frac(terms[0]) + R.op(sign) + R.frac(terms[1]) +
        (terms[2] ? R.op('+') + R.frac(terms[2]) : '');

      return {
        prompt: promptHTML,
        instruction: 'حلّل بإبراز العامل المشترك ثم أحسب.',
        answer: fracAnswer(res),
        answerHTML: R.expr(R.frac(res)),
        hint: 'العامل المشترك بين جميع الحدود هو ' + R.expr(R.frac(k)) + '.',
        steps: [
          'العامل المشترك هو ' + R.expr(R.frac(k)) + '، نُبرزه:',
          R.expr(R.frac(k) + R.op('×') + R.paren(innerHTML)),
          'نحسب ما بين القوسين: ' + R.expr(R.paren(innerHTML) + R.op('=') + R.frac(inner)),
          'ثم نضرب: ' + R.expr(R.frac(k) + R.op('×') + R.frac(inner) + R.op('=') + R.frac(res))
        ]
      };
    }
  });

})(window.DV = window.DV || {});
