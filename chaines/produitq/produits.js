// Les gestes de la leçon « الجداء و القسمة في ℚ ».
//
// Le point de méthode, et c'est le seul qui compte : ON SIMPLIFIE AVANT DE
// MULTIPLIER. « 4/9 × 3/8 » ne se calcule pas en 12/72 puis en réduisant :
// on barre le 4 avec le 8, le 3 avec le 9, et il reste 1/6. Le produit des
// grands nombres n'apparaît jamais.
//
// Deuxième point : le signe se détermine À PART, en comptant les facteurs
// négatifs, avant tout calcul de valeur.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Produit;
  const { rat, add, sub, mul, div, neg, abs, signe, egaux, txt, par, plus, ent, choix } = F;

  const nonNul = (a, b) => { let v; do { v = ent(a, b); } while (v === 0); return v; };
  const pgcd = (a, b) => (b ? pgcd(b, a % b) : Math.abs(a));
  // « -9/4 » s'écrit tel quel ; « 8/-11 » aussi, la fiche en met partout.
  const ecrire = (n, d) => (d < 0 ? n + '/' + d : (n < 0 ? n + '/' + d : n + '/' + d));

  // ---------------------------------------------------------------------
  // Un produit de fractions : signe d'abord, simplifications ensuite.
  // ---------------------------------------------------------------------
  function produit(facteurs) {
    const val = facteurs.reduce((r, f) => mul(r, f), rat(1));
    const negs = facteurs.filter(f => signe(f) < 0).length;
    const nums = facteurs.map(f => Math.abs(f.n)), dens = facteurs.map(f => f.d);
    // Les simplifications croisées, telles qu'on les fait à la main.
    const restesN = nums.slice(), restesD = dens.slice();
    const barres = [];
    for (let i = 0; i < restesN.length; i++) {
      for (let j = 0; j < restesD.length; j++) {
        const g = pgcd(restesN[i], restesD[j]);
        if (g > 1) { restesN[i] /= g; restesD[j] /= g; barres.push(g); }
      }
    }
    const pn = restesN.reduce((a, b) => a * b, 1);
    const pd = restesD.reduce((a, b) => a * b, 1);
    const ecritures = facteurs.map(f => (f.n < 0 ? '(' + txt(f) + ')' : txt(f)));
    const etapes = [
      ['نحدّد الإشارة', negs === 0 ? 'لا يوجد عامل سالب، إذن الجداء موجب'
        : negs % 2 === 0 ? negs + ' عوامل سالبة، عددها زوجي، إذن الجداء موجب'
                         : negs + (negs === 1 ? ' عامل سالب' : ' عوامل سالبة')
                          + '، عددها فردي، إذن الجداء سالب'],
      ['نكتب جداء القيم المطلقة',
       nums.map((n, i) => n + '/' + dens[i]).join(' × ') + ' = (' + nums.join(' × ')
       + ') / (' + dens.join(' × ') + ')']
    ];
    if (barres.length) {
      etapes.push(['نبسّط قبل الضرب',
        '(' + nums.join(' × ') + ') / (' + dens.join(' × ') + ') = ('
        + restesN.join(' × ') + ') / (' + restesD.join(' × ') + ')']);
    } else {
      etapes.push(['لا شيء يُبسّط', 'البسوط و المقامات أوّلية فيما بينها']);
    }
    etapes.push(['نضرب ما تبقّى', '(' + restesN.join(' × ') + ') / ('
      + restesD.join(' × ') + ') = ' + pn + '/' + pd]);
    etapes.push(['النتيجة', 'P = ' + txt(val)]);
    return {
      enonce: ['احسب بأبسط طريقة:', 'P = ' + ecritures.join(' × ')],
      indice: 'ابدأ بالإشارة، ثمّ بسّط قبل أن تضرب: الأعداد الكبيرة لا تظهر أبدا',
      etapes,
      controle: { type: 'produit', facteurs, val, negs,
                  env: { P: val }, expr: ecritures.join(' × ') }
    };
  }

  // ---------------------------------------------------------------------
  // Diviser, c'est multiplier par l'inverse.
  // ---------------------------------------------------------------------
  function quotient(a, b) {
    const inv = rat(b.d * Math.sign(b.n), Math.abs(b.n));
    const val = div(a, b);
    return {
      enonce: ['احسب:', 'Q = ' + par(a) + ' ÷ ' + par(b)],
      indice: 'القسمة على عدد هي الضرب في مقلوبه',
      etapes: [
        ['القاعدة', 'القسمة على عدد غير منعدم هي الضرب في مقلوبه'],
        ['نكتب المقلوب', 'مقلوب ' + txt(b) + ' هو ' + txt(inv)],
        ['نحوّل إلى جداء', 'Q = ' + par(a) + ' × ' + par(inv)],
        ['نبسّط ثمّ نضرب', par(a) + ' × ' + par(inv) + ' = ' + txt(val)],
        ['النتيجة', 'Q = ' + txt(val)]
      ],
      controle: { type: 'quotient', a, b, val, env: { Q: val } }
    };
  }

  // ---------------------------------------------------------------------
  // Une fraction étagée : une division déguisée.
  // ---------------------------------------------------------------------
  function etagee(num, den, txtNum, txtDen) {
    const vn = F.analyser(txtNum, {}), vd = F.analyser(txtDen, {});
    const val = div(vn, vd);
    return {
      enonce: ['احسب:', 'E = [' + txtNum + '] : [' + txtDen + ']'],
      indice: 'احسب البسط و المقام كلاّ على حدة، ثمّ اقسم',
      etapes: [
        ['نحسب البسط', txtNum + ' = ' + txt(vn)],
        ['نحسب المقام', txtDen + ' = ' + txt(vd)],
        ['القاعدة', 'الكسر المتراكب هو قسمة البسط على المقام'],
        ['نحوّل إلى جداء', 'E = ' + par(vn) + ' × ' + par(rat(vd.d * Math.sign(vd.n), Math.abs(vd.n)))],
        ['النتيجة', 'E = ' + txt(val)]
      ],
      controle: { type: 'etagee', txtNum, txtDen, val, env: { E: val } }
    };
  }

  // ---------------------------------------------------------------------
  // Un peu d'écriture polynomiale : de quoi poser « -2x^2 + 10x » sans que
  // les signes se télescopent.
  // ---------------------------------------------------------------------
  const mono = (c, v, deg) => {
    if (c.n === 0) return null;
    const t = (egaux(abs(c), rat(1)) && deg > 0) ? '' : txt(abs(c));
    const p = deg === 0 ? '' : (deg === 1 ? v : v + '^' + deg);
    return (signe(c) < 0 ? '-' : '') + t + p;
  };
  const joindre = ts => {
    const l = ts.filter(Boolean);
    if (!l.length) return '0';
    return l.map((t, i) => i === 0 ? t : (t[0] === '-' ? ' - ' + t.slice(1) : ' + ' + t)).join('');
  };
  const lin = (a, b, v) => joindre([mono(a, v, 1), mono(b, v, 0)]);
  const quad = (a, b, c, v) => joindre([mono(a, v, 2), mono(b, v, 1), mono(c, v, 0)]);

  // ---------------------------------------------------------------------
  // Développer k(a·x + b) — chaque terme du crochet est multiplié.
  // ---------------------------------------------------------------------
  function developper(nom, v, blocs) {
    // blocs : [{k, a, b}] pour k(a·v + b)
    const brut = blocs.map(m => par(m.k) + '(' + lin(m.a, m.b, v) + ')').join(' + ');
    const distribue = blocs.map(m => lin(mul(m.k, m.a), mul(m.k, m.b), v))
      .map((t, i) => (i === 0 ? t : (t[0] === '-' ? ' - ' + t.slice(1) : ' + ' + t))).join('');
    const A = blocs.reduce((r, m) => add(r, mul(m.k, m.a)), rat(0));
    const B = blocs.reduce((r, m) => add(r, mul(m.k, m.b)), rat(0));
    const red = lin(A, B, v);
    return {
      enonce: ['أنشر ثمّ اختصر:', nom + ' = ' + brut],
      indice: 'اضرب كل حدّ داخل القوس في العامل الذي أمامه، ثمّ اجمع الحدود المتشابهة',
      etapes: [
        ['القاعدة', 'نضرب العامل الذي أمام القوس في كل حدّ بداخله'],
        ['ننشر', nom + ' = ' + distribue],
        ['نجمّع حدود ' + v, 'حدود ' + v + ' تعطي ' + (mono(A, v, 1) || '0')],
        ['نجمّع الثوابت', 'الثوابت تعطي ' + txt(B)],
        ['النتيجة', nom + ' = ' + red]
      ],
      controle: { type: 'identite', nom, gauche: brut, droite: red, vars: [v] }
    };
  }

  // ---------------------------------------------------------------------
  // Le produit de deux parenthèses : quatre produits, puis on réduit.
  // C'est ici qu'apparaît le carré — et c'est ici qu'on l'oublie.
  // ---------------------------------------------------------------------
  function produitBinomes(nom, v, p, q, r, t, reste) {
    // (p·v + q)(r·v + t)  [ - reste, optionnel : {k, a, b} pour k(a·v + b) ]
    const brut = '(' + lin(p, q, v) + ')(' + lin(r, t, v) + ')'
      + (reste ? ' - ' + par(reste.k) + '(' + lin(reste.a, reste.b, v) + ')' : '');
    const quatre = joindre([mono(mul(p, r), v, 2), mono(mul(p, t), v, 1),
                            mono(mul(q, r), v, 1), mono(mul(q, t), v, 0)]);
    let A = mul(p, r), B = add(mul(p, t), mul(q, r)), C = mul(q, t);
    const etapes = [
      ['القاعدة', 'جداء قوسين يعطي أربعة جداءات، لا ثلاثة'],
      ['ننشر القوسين', '(' + lin(p, q, v) + ')(' + lin(r, t, v) + ') = ' + quatre]
    ];
    if (reste) {
      const d2 = lin(mul(neg(reste.k), reste.a), mul(neg(reste.k), reste.b), v);
      etapes.push(['ننشر الحدّ الأخير', '- ' + par(reste.k) + '(' + lin(reste.a, reste.b, v) + ') = ' + d2]);
      B = add(B, mul(neg(reste.k), reste.a));
      C = add(C, mul(neg(reste.k), reste.b));
    }
    const red = quad(A, B, C, v);
    etapes.push(['نجمّع حدود الدرجة الأولى', 'حدود ' + v + ' تعطي ' + (mono(B, v, 1) || '0')]);
    etapes.push(['النتيجة', nom + ' = ' + red]);
    etapes.push(['نتحقّق بالنشر',
      '(' + lin(p, q, v) + ')(' + lin(r, t, v) + ')' + (reste ? ' - ' + par(reste.k)
      + '(' + lin(reste.a, reste.b, v) + ')' : '') + ' = ' + red]);
    return {
      enonce: ['أنشر ثمّ اختصر:', nom + ' = ' + brut],
      indice: 'أربعة جداءات، لا ثلاثة: لا تنسَ حدّ الدرجة الثانية',
      etapes,
      controle: { type: 'identite', nom, gauche: brut, droite: red, vars: [v] }
    };
  }

  // ---------------------------------------------------------------------
  // Factoriser : reconnaître le facteur commun et le mettre devant.
  // ---------------------------------------------------------------------
  function factoriser(nom, v, k, a, b) {
    // k·a·v + k·b   →   k(a·v + b)
    const brut = lin(mul(k, a), mul(k, b), v);
    const fact = par(k) + '(' + lin(a, b, v) + ')';
    return {
      enonce: ['فكّك إلى جداء عوامل:', nom + ' = ' + brut],
      indice: 'ابحث عن العامل المشترك بين الحدّين',
      etapes: [
        ['نكتب كل حدّ بالعامل المشترك',
         brut + ' = ' + par(k) + ' × ' + par(a) + v + ' + ' + par(k) + ' × ' + par(b)],
        ['العامل المشترك', 'العامل المشترك هو ' + txt(k)],
        ['نضعه أمام القوس', nom + ' = ' + fact],
        ['نتحقّق بالنشر', fact + ' = ' + brut]
      ],
      controle: { type: 'identite', nom, gauche: brut, droite: fact, vars: [v] }
    };
  }


  // ---------------------------------------------------------------------
  // Les éléments remarquables : 0 absorbe, 1 ne change rien, -1 donne
  // l'opposé, et deux inverses donnent 1. Les reconnaître, c'est ne pas
  // calculer du tout.
  // ---------------------------------------------------------------------
  // Les ÉQUATIONS où l'élément remarquable est ce qui permet de conclure.
  // « P = 3/4 × 0 » n'est pas une question : la réponse est écrite dans
  // l'énoncé. « P + 3/4 = 0 » en est une, et elle porte exactement la même
  // notion — l'opposé, l'inverse, l'élément neutre, l'élément absorbant.
  function equationRemarquable(a, cas) {
    const inv = rat(a.d * Math.sign(a.n), Math.abs(a.n));
    const CAS = {
      // « P + -7/12 » collerait deux signes : le signe se replie sur
      // l'opérateur, comme on l'écrit au tableau.
      oppose:  { eq: 'P' + plus(a) + ' = 0', sol: neg(a),
                 vu: 'مجموع العددين منعدم',
                 regle: 'العددان اللذان مجموعهما منعدم متقابلان',
                 quoi: 'نكتب المقابل',
                 verif: txt(neg(a)) + plus(a) + ' = 0' },
      inverse: { eq: 'P × ' + par(a) + ' = 1', sol: inv,
                 vu: 'جداء العددين يساوي 1',
                 regle: 'العددان اللذان جداؤهما 1 مقلوبان',
                 quoi: 'نكتب المقلوب',
                 verif: par(inv) + ' × ' + par(a) + ' = 1' },
      absorbe: { eq: 'P × ' + par(a) + ' = 0', sol: rat(0),
                 vu: 'الجداء منعدم و العامل الثاني غير منعدم',
                 regle: 'إذا كان جداء منعدما و أحد عامليه غير منعدم فإنّ الآخر منعدم',
                 quoi: 'نستنتج',
                 verif: '0 × ' + par(a) + ' = 0' },
      neutre:  { eq: 'P × 1 = ' + txt(a), sol: a,
                 vu: 'أحد العاملين يساوي 1',
                 regle: 'الضرب في 1 لا يغيّر العدد',
                 quoi: 'نستنتج',
                 verif: par(a) + ' × 1 = ' + txt(a) }
    };
    const c = CAS[cas];
    return {
      enonce: ['جد العدد الكسري النسبي P بحيث:', c.eq],
      indice: 'لا تحسب: تعرّف على الحالة المميّزة',
      etapes: [
        ['نلاحظ', c.vu],
        ['القاعدة', c.regle],
        [c.quoi, 'P = ' + txt(c.sol)],
        ['نتحقّق', c.verif]
      ],
      controle: { type: 'equation-p', eq: c.eq, sol: c.sol, env: { P: c.sol } }
    };
  }

  function remarquable(a, cas) {
    const REGLES = {
      un:      { b: rat(1),  val: a,
                 regle: 'كل عدد مضروب في 1 لا يتغيّر',
                 vu: 'أحد العاملين يساوي 1' },
      moinsUn: { b: rat(-1), val: neg(a),
                 regle: 'الضرب في -1 يعطي المقابل',
                 vu: 'أحد العاملين يساوي -1' },
      inverse: { b: rat(a.d * Math.sign(a.n), Math.abs(a.n)), val: rat(1),
                 regle: 'جداء عدد في مقلوبه يساوي 1',
                 vu: 'العاملان مقلوبان' }
    };
    const r = REGLES[cas];
    return {
      enonce: ['احسب دون إجراء عملية الضرب:', 'P = ' + par(a) + ' × ' + par(r.b)],
      indice: 'انظر إلى العاملين قبل أن تحسب: أحدهما مميّز',
      etapes: [
        ['نلاحظ', r.vu],
        ['القاعدة', r.regle],
        ['نطبّق', 'P = ' + txt(r.val)],
        ['نتحقّق', par(a) + ' × ' + par(r.b) + ' = ' + txt(r.val)]
      ],
      controle: { type: 'produit', facteurs: [a, r.b], val: r.val,
                  negs: [a, r.b].filter(x => signe(x) < 0).length,
                  env: { P: r.val }, expr: par(a) + ' × ' + par(r.b) }
    };
  }

  // ---------------------------------------------------------------------
  // L'ESSENTIEL de la leçon : le signe se lit, il ne se calcule pas.
  // « 915486254 × (-5169428735) = -n » : personne ne fera ce produit. On
  // compte les facteurs négatifs, et n est connu de signe.
  // ---------------------------------------------------------------------
  function signeSansCalculer(g1, g2, cote) {
    // g1 × g2 = -n  (cote = 'oppose')  ou  g1 × n = g2  (cote = 'facteur')
    const s1 = g1 < 0 ? -1 : 1, s2 = g2 < 0 ? -1 : 1;
    const sProduit = s1 * s2;
    if (cote === 'oppose') {
      // g1 × g2 = -n  ⟹  n = -(g1 × g2)
      const sn = -sProduit;
      return {
        enonce: ['حدّد علامة العدد الكسري النسبي n، علما و أنّ:',
                 g1 + ' × (' + g2 + ') = -n'],
        indice: 'لا تحسب شيئا: عُدّ العوامل السالبة',
        etapes: [
          ['لا داعي للحساب', 'إشارة الجداء تُقرأ من إشارتي العاملين'],
          ['إشارة العامل الأول', g1 + (s1 < 0 ? ' < 0' : ' > 0')],
          ['إشارة العامل الثاني', g2 + (s2 < 0 ? ' < 0' : ' > 0')],
          ['إشارة الجداء', sProduit < 0
            ? 'عامل سالب واحد: الجداء سالب' : 'العوامل من نفس الإشارة: الجداء موجب'],
          ['نستنتج إشارة -n', '-n' + (sProduit < 0 ? ' < 0' : ' > 0')],
          ['النتيجة', 'n' + (sn < 0 ? ' < 0' : ' > 0')]
        ],
        controle: { type: 'signe-produit', s1, s2, attendu: sn, cote,
                    env: { n: rat(sn * 7, 3) } }
      };
    }
    // g1 × n = g2  ⟹  n a le signe de g2 / g1
    const sn = s1 * s2;
    return {
      enonce: ['حدّد علامة العدد الكسري النسبي n، علما و أنّ:',
               g1 + ' × n = ' + g2],
      indice: 'لا تحسب شيئا: أيّ إشارة يجب أن تحمل n ليكون الجداء بهذه الإشارة ؟',
      etapes: [
        ['لا داعي للحساب', 'إشارة الجداء تُقرأ من إشارتي العاملين'],
        ['إشارة العامل المعلوم', g1 + (s1 < 0 ? ' < 0' : ' > 0')],
        ['إشارة الجداء', g2 + (s2 < 0 ? ' < 0' : ' > 0')],
        ['القاعدة', sn < 0 ? 'ليكون الجداء بهذه الإشارة، يجب أن يخالف n العامل المعلوم'
                           : 'ليكون الجداء بهذه الإشارة، يجب أن يوافق n العامل المعلوم'],
        ['النتيجة', 'n' + (sn < 0 ? ' < 0' : ' > 0')]
      ],
      controle: { type: 'signe-produit', s1, s2, attendu: sn, cote,
                  env: { n: rat(sn * 7, 3) } }
    };
  }

  // ---------------------------------------------------------------------
  // « ℚ₊ ou ℚ₋ ? » — a et b sont négatifs, et l'expression est littérale :
  // il n'y a rien à calculer, il n'y a que des signes à composer.
  // ---------------------------------------------------------------------
  function classeSigne(texte, signes, description) {
    // signes : liste de {quoi, signe} — la lecture, terme à terme
    const s = signes.reduce((r, x) => r * x.signe, 1);
    return {
      enonce: ['أكمل بـ « ℚ+ » أو « ℚ- »، حيث a و b عددان صحيحان نسبيان سالبان:',
               texte + ' ∈ ...'],
      indice: 'اقرأ إشارة كل جزء، ثمّ اضربها',
      etapes: signes.map(x => ['إشارة ' + x.quoi, x.txt + (x.signe < 0 ? ' < 0' : ' > 0')])
        .concat([
          ['نضرب الإشارات', s < 0 ? 'عدد فردي من العوامل السالبة' : 'عدد زوجي من العوامل السالبة'],
          ['النتيجة', 'العبارة تنتمي إلى ' + (s < 0 ? 'ℚ-' : 'ℚ+')]
        ]),
      controle: { type: 'classe', texte, attendu: s, description,
                  env: { a: rat(-5, 2), b: rat(-3) } }
    };
  }

  // ---------------------------------------------------------------------
  // |a × b| = |a| × |b| — la valeur absolue traverse le produit.
  // ---------------------------------------------------------------------
  function absoluProduit(a, b) {
    const p = mul(a, b), val = abs(p);
    return {
      enonce: ['احسب:', 'V = |' + txt(a) + ' × ' + txt(b) + '|'],
      indice: 'القيمة المطلقة تعبر الجداء',
      etapes: [
        ['القاعدة', 'القيمة المطلقة لجداء هي جداء القيمتين المطلقتين'],
        ['نطبّق القاعدة', '|' + txt(a) + ' × ' + txt(b) + '| = |' + txt(a) + '| × |' + txt(b) + '|'],
        ['نحسب القيمتين', '|' + txt(a) + '| = ' + txt(abs(a)) + ' و |' + txt(b) + '| = ' + txt(abs(b))],
        ['نضرب', txt(abs(a)) + ' × ' + txt(abs(b)) + ' = ' + txt(val)],
        ['النتيجة', 'V = ' + txt(val)]
      ],
      controle: { type: 'absolu', a, b, val, env: { V: val } }
    };
  }

  const API = { produit, quotient, etagee, developper, produitBinomes,
                remarquable, equationRemarquable, signeSansCalculer, classeSigne, absoluProduit,
                factoriser, lin, quad, mono, joindre, nonNul, pgcd };
  if (M) module.exports = API;
  else racine.Produits = API;
})(typeof window !== 'undefined' ? window : globalThis);
