/* Devoirati — chapitre « القوى » (9ème année).
   Remplace exe Puissance, exe Puissance2, pUISSANCE PRODUIT (2),
   produit puisssance, puissance prod 2, puissance prod 3, power-exponent-exercises. */
(function (DV) {
  'use strict';

  var R = DV.render;
  var reg = DV.registry;

  var BASES = [2, 3, 4, 5, 6, 7, 8, 9, 10];

  function intAnswer(v) { return { kind: 'int', value: v }; }

  /* Valeur numérique affichée seulement quand elle reste lisible. */
  function valueNote(base, exp) {
    if (exp < 0 || exp > 12) return null;
    var v = Math.pow(base, exp);
    if (v > 1e7) return null;
    return R.pow(base, exp) + ' = ' + v.toLocaleString('fr-FR').replace(/ |\s/g, ' ');
  }

  /* ---------- 1. Produit de puissances de même base ---------- */

  reg.register({
    id: 'puissances-produit',
    chapter: 'puissances',
    title: 'جداء قوى لنفس الأساس',
    summary: 'القاعدة aⁿ × aᵐ = aⁿ⁺ᵐ.',
    levels: [
      { id: 'facile', label: 'عاملان' },
      { id: 'moyen', label: 'ثلاثة عوامل' },
      { id: 'difficile', label: 'مع أسس سالبة' }
    ],
    instruction: 'أكتب على شكل قوة واحدة وأعط الأس.',
    make: function (rng, level) {
      var a = rng.pick(BASES);
      var exps;
      if (level === 'moyen') exps = [rng.int(1, 8), rng.int(1, 8), rng.int(1, 6)];
      else if (level === 'difficile') exps = [rng.int(-6, 9), rng.int(-6, 9)];
      else exps = [rng.int(1, 9), rng.int(1, 9)];

      var sum = exps.reduce(function (s, e) { return s + e; }, 0);
      var promptHTML = R.expr(exps.map(function (e) { return R.pow(a, e); }).join(R.op('×')) +
        R.op('=') + R.powUnknown(a));
      var note = valueNote(a, sum);

      return {
        prompt: promptHTML,
        instruction: 'أكتب على شكل قوة واحدة وأعط الأس.',
        answer: intAnswer(sum),
        answerHTML: R.expr(R.pow(a, sum)),
        hint: 'عند ضرب قوى لنفس الأساس نجمع الأسس.',
        steps: [
          'القاعدة: ' + R.expr(R.pow('a', 'n') + R.op('×') + R.pow('a', 'm') + R.op('=') + R.pow('a', 'n + m')),
          'الأساس مشترك (' + a + ')، إذن نجمع الأسس: ' + exps.join(' + ').replace(/\+ -/g, '− ') + ' = <strong>' + sum + '</strong>',
          'النتيجة: ' + R.expr(R.pow(a, sum)) + (note ? '<span class="m-sep">،</span> أي ' + note : '')
        ]
      };
    }
  });

  /* ---------- 2. Quotient de puissances ---------- */

  reg.register({
    id: 'puissances-quotient',
    chapter: 'puissances',
    title: 'خارج قوى لنفس الأساس',
    summary: 'القاعدة aⁿ ÷ aᵐ = aⁿ⁻ᵐ، بما في ذلك الحالات ذات النتيجة السالبة.',
    levels: [
      { id: 'facile', label: 'نتيجة موجبة' },
      { id: 'moyen', label: 'نتيجة قد تكون سالبة' },
      { id: 'difficile', label: 'كتابة كسرية' }
    ],
    instruction: 'أكتب على شكل قوة واحدة وأعط الأس.',
    make: function (rng, level) {
      var a = rng.pick(BASES);
      var n, m;
      if (level === 'facile') { n = rng.int(4, 12); m = rng.int(1, n - 1); }
      else { n = rng.int(1, 12); m = rng.int(1, 12); }

      var diff = n - m;
      var promptHTML = level === 'difficile'
        ? R.expr(R.fracExpr(R.pow(a, n), R.pow(a, m)) + R.op('=') + R.powUnknown(a))
        : R.expr(R.pow(a, n) + R.op('÷') + R.pow(a, m) + R.op('=') + R.powUnknown(a));

      var steps = [
        'القاعدة: ' + R.expr(R.fracExpr(R.pow('a', 'n'), R.pow('a', 'm')) + R.op('=') + R.pow('a', 'n − m')),
        'نطرح الأسّين: ' + n + ' − ' + m + ' = <strong>' + diff + '</strong>',
        'النتيجة: ' + R.expr(R.pow(a, diff))
      ];
      if (diff < 0) {
        steps.push('الأس سالب، ومعناه: ' + R.expr(R.pow(a, diff) + R.op('=') + R.fracExpr('1', R.pow(a, -diff))));
      } else if (diff === 0) {
        steps.push('كل عدد غير منعدم مرفوع للأس 0 يساوي 1: ' + R.expr(R.pow(a, 0) + R.op('=') + '1'));
      }

      return {
        prompt: promptHTML,
        instruction: 'أكتب على شكل قوة واحدة وأعط الأس.',
        answer: intAnswer(diff),
        answerHTML: R.expr(R.pow(a, diff)),
        hint: 'عند قسمة قوى لنفس الأساس نطرح الأسس.',
        steps: steps
      };
    }
  });

  /* ---------- 3. Puissance d'une puissance ---------- */

  reg.register({
    id: 'puissances-puissance',
    chapter: 'puissances',
    title: 'قوة القوة',
    summary: 'القاعدة (aⁿ)ᵐ = aⁿˣᵐ، ومزجها مع الجداء.',
    levels: [
      { id: 'facile', label: 'مباشر' },
      { id: 'moyen', label: 'قوة قوة × قوة' },
      { id: 'difficile', label: 'أسس سالبة' }
    ],
    instruction: 'أكتب على شكل قوة واحدة وأعط الأس.',
    make: function (rng, level) {
      var a = rng.pick(BASES);
      var n, m, extra = null, res, promptHTML, steps;

      if (level === 'difficile') { n = rng.int(-5, 7); m = rng.int(-3, 5); }
      else { n = rng.int(2, 7); m = rng.int(2, 5); }

      if (level === 'moyen') {
        extra = rng.int(1, 8);
        res = n * m + extra;
        promptHTML = R.expr('(' + R.pow(a, n) + ')<sup>' + m + '</sup>' + R.op('×') + R.pow(a, extra) +
          R.op('=') + R.powUnknown(a));
        steps = [
          'القاعدة: ' + R.expr('(' + R.pow('a', 'n') + ')<sup>m</sup>' + R.op('=') + R.pow('a', 'n × m')),
          'نبدأ بقوة القوة: ' + n + ' × ' + m + ' = ' + (n * m) + '، إذن ' + R.expr(R.pow(a, n * m)),
          'ثم جداء قوى لنفس الأساس: ' + (n * m) + ' + ' + extra + ' = <strong>' + res + '</strong>',
          'النتيجة: ' + R.expr(R.pow(a, res))
        ];
      } else {
        res = n * m;
        promptHTML = R.expr('(' + R.pow(a, n) + ')<sup>' + m + '</sup>' + R.op('=') + R.powUnknown(a));
        steps = [
          'القاعدة: ' + R.expr('(' + R.pow('a', 'n') + ')<sup>m</sup>' + R.op('=') + R.pow('a', 'n × m')),
          'نضرب الأسّين: ' + n + ' × ' + m + ' = <strong>' + res + '</strong>',
          'النتيجة: ' + R.expr(R.pow(a, res))
        ];
      }

      return {
        prompt: promptHTML,
        instruction: 'أكتب على شكل قوة واحدة وأعط الأس.',
        answer: intAnswer(res),
        answerHTML: R.expr(R.pow(a, res)),
        hint: 'انتبه: في قوة القوة نضرب الأسس ولا نجمعها.',
        steps: steps
      };
    }
  });

  /* ---------- 4. Expressions mixtes ---------- */

  reg.register({
    id: 'puissances-expressions',
    chapter: 'puissances',
    title: 'تبسيط تعابير القوى',
    summary: 'تعابير تجمع بين الجداء والخارج وقوة القوة، وكذلك القوى لنفس الأس.',
    levels: [
      { id: 'meme-base', label: 'نفس الأساس' },
      { id: 'meme-exposant', label: 'نفس الأس' },
      { id: 'difficile', label: 'مختلط' }
    ],
    instruction: 'بسّط التعبير ثم أعط الأس الناتج.',
    make: function (rng, level) {
      var a = rng.pick(BASES);

      /* aⁿ × bⁿ = (a×b)ⁿ : ici la réponse attendue reste l'exposant. */
      if (level === 'meme-exposant') {
        var b = rng.intExcept(2, 9, a);
        var e = rng.int(2, 6);
        var prod = a * b;
        return {
          prompt: R.expr(R.pow(a, e) + R.op('×') + R.pow(b, e) + R.op('=') + R.powUnknown(prod)),
          instruction: 'بسّط التعبير ثم أعط الأس الناتج.',
          answer: intAnswer(e),
          answerHTML: R.expr(R.pow(prod, e)),
          hint: 'القاعدة: aⁿ × bⁿ = (a × b)ⁿ.',
          steps: [
            'القاعدة: ' + R.expr(R.pow('a', 'n') + R.op('×') + R.pow('b', 'n') + R.op('=') + '(a × b)<sup>n</sup>'),
            'الأس مشترك (' + e + ') والأساسان ' + a + ' و ' + b + ' : ' + a + ' × ' + b + ' = ' + prod,
            'النتيجة: ' + R.expr(R.pow(prod, e)) + '، الأس هو <strong>' + e + '</strong>'
          ]
        };
      }

      /* (aⁿ × aᵐ) ÷ aᵏ  ou  (aⁿ)ᵐ ÷ aᵏ */
      var n = rng.int(2, 8), m = rng.int(1, 6), k = rng.int(1, 7);
      var viaPower = level === 'difficile' && rng.bool();
      var head = viaPower ? n * m : n + m;
      var res = head - k;

      var promptHTML = viaPower
        ? R.expr('(' + R.pow(a, n) + ')<sup>' + m + '</sup>' + R.op('÷') + R.pow(a, k) + R.op('=') + R.powUnknown(a))
        : R.expr(R.paren(R.pow(a, n) + R.op('×') + R.pow(a, m)) + R.op('÷') + R.pow(a, k) + R.op('=') + R.powUnknown(a));

      var steps = [
        viaPower
          ? 'قوة القوة: ' + n + ' × ' + m + ' = ' + head + '، إذن ' + R.expr(R.pow(a, head))
          : 'جداء قوى لنفس الأساس: ' + n + ' + ' + m + ' = ' + head + '، إذن ' + R.expr(R.pow(a, head)),
        'ثم الخارج: ' + head + ' − ' + k + ' = <strong>' + res + '</strong>',
        'النتيجة: ' + R.expr(R.pow(a, res))
      ];
      if (res < 0) steps.push('أس سالب: ' + R.expr(R.pow(a, res) + R.op('=') + R.fracExpr('1', R.pow(a, -res))));

      return {
        prompt: promptHTML,
        instruction: 'بسّط التعبير ثم أعط الأس الناتج.',
        answer: intAnswer(res),
        answerHTML: R.expr(R.pow(a, res)),
        hint: 'طبّق القواعد بالترتيب: الأقواس، ثم الجداء، ثم الخارج.',
        steps: steps
      };
    }
  });

})(window.DV = window.DV || {});
