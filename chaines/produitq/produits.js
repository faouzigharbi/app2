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

  const API = { produit, quotient, etagee, developper, produitBinomes,
                factoriser, lin, quad, mono, joindre, nonNul, pgcd };
  if (M) module.exports = API;
  else racine.Produits = API;
})(typeof window !== 'undefined' ? window : globalThis);
