// Les exercices de la fiche qui reposent sur LA MISE EN FACTEUR D'UNE
// PUISSANCE — exercices 2, 7, 8 et 9.
//
// Le geste est toujours le même, et il tient en une phrase : on met la PLUS
// PETITE puissance en facteur, ce qui laisse dans la parenthèse un petit nombre
// qu'on sait calculer. Un nombre de six cents chiffres devient alors un produit
// dont on lit les diviseurs.
//
// Tout le travail du générateur consiste à partir de la RÉPONSE : on choisit
// d'abord le petit nombre de la parenthèse et le diviseur qu'on veut faire
// apparaître, puis on habille. Tirer les exposants au hasard et chercher ensuite
// un diviseur donnerait le plus souvent un diviseur sans intérêt.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Arith;
  const { rat, txt, ent, choix, melanger, puissanceB, absB, pgcdB } = F;

  // -------------------------------------------------------------------------
  // Écriture d'une puissance. « 3^2007 » peut aussi s'écrire « 27^669 », et la
  // fiche joue sans cesse de ce déguisement : c'est lui qui rend l'exercice
  // difficile, puisqu'il faut d'abord unifier les bases.
  // -------------------------------------------------------------------------
  const pw = (a, e) => (e === 0 ? '1' : e === 1 ? String(a) : a + '^' + e);

  // Choisit un déguisement (a^s)^(e/s) quand c'est possible et lisible.
  function deguiser(a, e, forcer) {
    const possibles = [];
    for (let s = 2; s <= 4; s++) {
      if (e % s === 0 && puissanceB(a, s) <= 200n) possibles.push(s);
    }
    if (!possibles.length || (!forcer && Math.random() < 0.45)) return { s: 1, txt: pw(a, e) };
    const s = choix(possibles);
    return { s, txt: pw(Number(puissanceB(a, s)), e / s) };
  }

  // PGCD sur des petits entiers JavaScript. Attention : le pgcdB du noyau
  // travaille en BigInt et renvoie un BigInt — le comparer à 1n après lui avoir
  // passé des Number donne toujours faux, et la boucle de tirage ne sort jamais.
  const pgcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; };

  const diviseurs = n => {
    const d = [];
    for (let k = 1; k <= n; k++) if (n % k === 0) d.push(k);
    return d;
  };
  // Les diviseurs de |V| qui ne partagent aucun facteur avec la base : ce sont
  // eux qui apportent quelque chose de neuf au diviseur qu'on annonce.
  const etrangers = (v, a) => diviseurs(Math.abs(v)).filter(u => u > 1 && pgcd(u, a) === 1);

  // L'écart d'exposants, borné pour que la parenthèse reste un nombre qu'on
  // pose de tête. Sur la fiche elle vaut 50, 6, 7, 5, 4 — jamais 4366.
  const ecartMax = a => Math.max(1, Math.floor(Math.log(50) / Math.log(a)));
  const PETIT = 130;      // |contenu de la parenthèse|
  const GROS = 300;       // le diviseur annoncé

  // « d × cofacteur » : l'écriture qui rend la divisibilité visible. On ne met
  // de parenthèses que si le cofacteur en a besoin — « 100 × (5^86) » se lit
  // moins bien que « 100 × 5^86 ».
  const enrobe = c => (/[×+]/.test(c) || c[0] === '-') ? '(' + c + ')' : c;
  function cofacteur(coef, a, e) {
    const p = e === 0 ? null : pw(a, e);
    if (coef === 1 && p) return p;
    if (coef === -1 && p) return '-' + p;
    if (!p) return String(coef);
    return (coef < 0 ? '(' + coef + ')' : String(coef)) + ' × ' + p;
  }

  // =========================================================================
  // EXERCICE 2 — بيّن أنّ العدد يقبل القسمة على d
  // Une somme ou une différence de deux puissances de la MÊME base.
  // =========================================================================
  const MODELES_2 = ['somme', 'difference', 'deguise', 'repetition'];

  function question2(modele) {
    for (let essai = 0; essai < 400; essai++) {
      const a = choix([2, 3, 5, 7]);
      const p = ent(12, 130);

      let brut, V, e, ecart = 0, revele = null;
      if (modele === 'repetition') {
        // 3^4 + 3^4 + 3^4 + 3^4 = 4 × 3^4 : le facteur commun est le terme
        // lui-même, et c'est le NOMBRE DE TERMES qui sort.
        const r = ent(3, 6);
        brut = Array(r).fill(pw(a, ent(2, 6))).join(' + ');
        V = r;
        e = Number(brut.split(' + ')[0].split('^')[1] || 1);
      } else {
        ecart = ent(1, ecartMax(a));
        e = p;
        const q = p + ecart;
        const puissEcart = Number(puissanceB(a, ecart));
        if (modele === 'somme') {
          brut = pw(a, p) + ' + ' + pw(a, q); V = 1 + puissEcart;
        } else if (modele === 'difference') {
          brut = pw(a, q) + ' - ' + pw(a, p); V = puissEcart - 1;
        } else {
          // un des deux termes est déguisé sous une autre base : 25^60 = 5^120
          const g = deguiser(a, q, true);
          if (g.s === 1) continue;
          brut = pw(a, p) + ' + ' + g.txt;
          revele = g.txt + ' = ' + pw(a, q);
          V = 1 + puissEcart;
        }
      }
      if (!Number.isFinite(V) || V === 0 || Math.abs(V) > PETIT) continue;

      const us = etrangers(V, a);
      if (!us.length) continue;
      const u = choix(us);
      const j = choix([0, 1, 2].filter(k => k <= e));
      const d = u * Number(puissanceB(a, j));
      if (d < 4 || d > GROS) continue;
      // Si le diviseur EST le contenu de la parenthèse, la dernière étape
      // s'écrit « 7 × 2^15 = 7 × (2^15) » et n'apprend rien. On veut que le
      // diviseur combine un morceau de la parenthèse ET une puissance.
      if (j === 0 && u === Math.abs(V)) continue;

      return finir2({ modele, a, e, ecart, V, u, j, d,
                      cof: cofacteur(V / u, a, e - j), brut, revele });
    }
    return question2(choix(MODELES_2));
  }

  function finir2(o) {
    const { modele, a, e, ecart, V, d, cof, brut, revele } = o;
    const etapes = [['القاعدة', 'نضع أصغر قوّة عاملا مشتركا، فيبقى داخل القوس عدد صغير']];
    if (revele) etapes.push(['نوحّد الأساس', revele]);

    if (modele === 'repetition') {
      etapes.push(['الحدود متساوية', 'الحدود ' + V + ' متساوية، و جمع '
        + V + ' حدود متساوية هو ضربها في ' + V]);
    } else {
      const grand = pw(a, e + ecart);
      const dedans = modele === 'difference'
        ? pw(a, ecart) + ' - 1' : '1 + ' + pw(a, ecart);
      const depart = revele ? pw(a, e) + ' + ' + grand
        : (modele === 'difference' ? grand + ' - ' + pw(a, e) : brut);
      etapes.push(['نُظهر العامل المشترك', grand + ' = ' + pw(a, e) + ' × ' + pw(a, ecart)]);
      etapes.push(['نُخرج العامل المشترك', depart + ' = ' + pw(a, e) + '(' + dedans + ')']);
      etapes.push(['نحسب داخل القوس', dedans + ' = ' + V]);
    }
    const produit = V + ' × ' + pw(a, e);
    etapes.push(['نكتب الجداء', brut + ' = ' + produit]);
    etapes.push(['نُظهر القاسم ' + d, produit + ' = ' + d + ' × ' + enrobe(cof)]);
    etapes.push(['النتيجة', 'العدد يساوي ' + d + ' × ' + cof
      + ' و منه يقبل القسمة على ' + d]);

    return {
      enonce: ['بيّن أنّ العدد', brut, 'يقبل القسمة على ' + d],
      indice: 'ضع ' + pw(a, e) + ' عاملا مشتركا: ما يبقى داخل القوس عدد صغير',
      etapes,
      controle: { type: 'divisible', expr: brut, d, modele,
                  identites: [[brut, produit], [produit, d + ' × ' + enrobe(cof)]] }
    };
  }

  function exercice2() {
    return melanger(MODELES_2).slice(0, 4).map(question2);
  }

  // =========================================================================
  // EXERCICE 7 — même geste, mais les DEUX termes sont déguisés et portent un
  // coefficient. Il faut donc unifier les bases avant de pouvoir factoriser.
  // =========================================================================
  function question7() {
    for (let essai = 0; essai < 600; essai++) {
      const a = choix([2, 3, 5]);
      const k = choix([1, 1, ent(2, 9)]), m = choix([1, 1, ent(2, 9)]);
      const e1 = ent(20, 260), e2 = e1 + ent(1, ecartMax(a));
      const g1 = deguiser(a, e1), g2 = deguiser(a, e2);
      if (g1.s === 1 && g2.s === 1 && k === 1 && m === 1) continue;  // trop nu

      // Le petit nombre de la parenthèse : k - m·a^(e2-e1)
      const V = k - m * Number(puissanceB(a, e2 - e1));
      if (V === 0 || Math.abs(V) > PETIT) continue;
      const us = etrangers(V, a);
      if (!us.length) continue;
      const u = choix(us);
      const j = choix([0, 1, 2].filter(x => x <= e1));
      const d = u * Number(puissanceB(a, j));
      if (d < 4 || d > GROS || (j === 0 && u === Math.abs(V))) continue;

      const t1 = (k === 1 ? '' : k + ' × ') + g1.txt;
      const t2 = (m === 1 ? '' : m + ' × ') + g2.txt;
      const brut = t1 + ' - ' + t2;
      const unifie = (k === 1 ? '' : k + ' × ') + pw(a, e1) + ' - '
        + (m === 1 ? '' : m + ' × ') + pw(a, e2);
      const dedans = (k === 1 ? '1' : String(k)) + ' - '
        + (m === 1 ? '' : m + ' × ') + pw(a, e2 - e1);
      const produit = V + ' × ' + pw(a, e1);
      const cof = cofacteur(V / u, a, e1 - j);

      const etapes = [];
      etapes.push(['القاعدة', 'لا يمكن جمع قوّتين إلاّ إذا كان لهما نفس الأساس']);
      if (g1.s > 1) etapes.push(['نوحّد الأساس في الحدّ الأوّل', g1.txt + ' = ' + pw(a, e1)]);
      if (g2.s > 1) etapes.push(['نوحّد الأساس في الحدّ الثاني', g2.txt + ' = ' + pw(a, e2)]);
      etapes.push(['نعيد كتابة العدد', brut + ' = ' + unifie]);
      etapes.push(['نُخرج أصغر قوّة', unifie + ' = ' + pw(a, e1) + '(' + dedans + ')']);
      etapes.push(['نحسب داخل القوس', dedans + ' = ' + V]);
      etapes.push(['نكتب الجداء', brut + ' = ' + produit]);
      etapes.push(['نُظهر القاسم ' + d, produit + ' = ' + d + ' × ' + enrobe(cof)]);
      etapes.push(['النتيجة', 'العدد يساوي ' + d + ' × ' + cof
        + ' و منه يقبل القسمة على ' + d]);

      return {
        enonce: ['بيّن أنّ العدد', brut, 'يقبل القسمة على ' + d],
        indice: 'وحّد الأساس أوّلا، ثمّ ضع ' + pw(a, e1) + ' عاملا مشتركا',
        etapes,
        controle: { type: 'divisible', expr: brut, d, modele: 'a' + a,
                    identites: [[brut, unifie], [unifie, produit],
                                [produit, d + ' × ' + enrobe(cof)]] }
      };
    }
    return question7();
  }

  const exercice7 = () => Array.from({ length: 4 }, question7);

  // =========================================================================
  // EXERCICE 8 — TOUTES les valeurs de n. Ici la mise en facteur ne suffit
  // plus : elle laisse « a^Q(a^k + n) », et il faut ensuite traduire la
  // divisibilité en une condition sur n seul.
  // =========================================================================
  function exercice8() {
    for (let essai = 0; essai < 600; essai++) {
      const a = choix([2, 3, 5]);
      const Q = ent(400, 2000), k = ent(1, 3), P = Q + k;
      const g1 = deguiser(a, P), g2 = deguiser(a, Q);
      const r = choix([5, 7, 11, 13, 4, 6].filter(x => pgcd(x, a) === 1));
      if (!r) continue;
      const j = ent(1, 2);
      if (j > Q) continue;
      const d = r * Number(puissanceB(a, j));
      const N = choix([30, 50, 60]);

      const ak = Number(puissanceB(a, k));
      const solutions = [];
      for (let n = 0; n < N; n++) if ((ak + n) % r === 0) solutions.push(n);
      if (solutions.length < 3 || solutions.length > 12) continue;

      const E = g1.txt + ' + n × ' + g2.txt;
      const unifie = pw(a, P) + ' + n × ' + pw(a, Q);
      const factorise = pw(a, Q) + '(' + pw(a, k) + ' + n)';

      const etapes = [];
      etapes.push(['القاعدة', 'نوحّد الأساس ثمّ نضع أصغر قوّة عاملا مشتركا']);
      if (g1.s > 1) etapes.push(['نوحّد الأساس في الحدّ الأوّل', g1.txt + ' = ' + pw(a, P)]);
      if (g2.s > 1) etapes.push(['نوحّد الأساس في الحدّ الثاني', g2.txt + ' = ' + pw(a, Q)]);
      etapes.push(['نُخرج العامل المشترك', unifie + ' = ' + factorise]);
      etapes.push(['نفكّك القاسم', d + ' = ' + puissanceB(a, j) + ' × ' + r]);
      etapes.push(['العامل ' + puissanceB(a, j) + ' موجود دائما',
        pw(a, Q) + ' = ' + pw(a, j) + ' × ' + pw(a, Q - j)]);
      etapes.push(['يبقى الشرط على ' + r,
        'بما أنّ ' + r + ' و ' + a + ' أوليان فيما بينهما، يجب أن يقبل '
        + pw(a, k) + ' + n القسمة على ' + r]);
      etapes.push(['نحسب الحدّ الثابت', pw(a, k) + ' = ' + ak]);
      etapes.push(['نبحث عن n', 'نبحث عن n أصغر من ' + N + ' بحيث يقبل '
        + ak + ' + n القسمة على ' + r]);
      etapes.push(['النتيجة', 'القيم الممكنة لـ n هي: ' + solutions.join(' ؛ ')]);

      return [{
        enonce: ['ليكن n عددا صحيحا طبيعيا أصغر من ' + N + ' و لتكن', 'E = ' + E,
                 'أوجد كلّ القيم الممكنة لـ n لتقبل E القسمة على ' + d],
        indice: 'فكّك E، ثمّ لاحظ أنّ الجزء ' + pw(a, j) + ' موجود دائما: الشرط يقع على '
          + r + ' وحده',
        etapes,
        controle: { type: 'ensemble', variable: 'n', domaine: N, expr: E, d,
                    trouves: solutions, modele: 'a' + a + 'r' + r,
                    identites: [[unifie, factorise]], vars: ['n'] }
      }];
    }
    return exercice8();
  }

  // =========================================================================
  // EXERCICE 9 — M = (an + b)/(n + c). On ne cherche pas n en tâtonnant : on
  // réécrit M sous la forme « entier + reste/(n + c) », et la question devient
  // « quels diviseurs a ce reste ». C'est l'exercice qui explique pourquoi la
  // division euclidienne sert à autre chose qu'à diviser.
  // =========================================================================
  function exercice9() {
    for (let essai = 0; essai < 400; essai++) {
      const a = ent(2, 9), c = ent(1, 9);
      const k = choix([12, 16, 18, 20, 24, 28, 32, 36, 40, 45, 48]);
      const b = a * c + k;
      if (b > 99) continue;

      const dv = diviseurs(k);
      const ns = [];
      dv.forEach(x => { ns.push(x - c); ns.push(-x - c); });
      ns.sort((p, q) => p - q);

      const num = a + 'n + ' + b;
      const den = 'n + ' + c;
      const M = '(' + num + ')/(' + den + ')';
      const forme = a + ' + ' + k + '/(' + den + ')';
      const n0 = choix(ns.filter(x => x !== 0 && Math.abs(x) < 40)) || ns[0];
      const val = a + k / (n0 + c);

      return [
        {
          enonce: ['لتكن العبارة', 'M = ' + M, 'حيث n عدد صحيح نسبي مخالف لـ -' + c,
                   'بيّن أنّ', 'M = ' + forme],
          indice: 'اكتب البسط بدلالة ' + den + ': ' + num + ' = ' + a + '(' + den + ') + ' + k,
          etapes: [
            ['القاعدة', 'نكتب البسط بدلالة المقام لنُظهر جزءا صحيحا و باقيا'],
            ['ننشر للتحقّق', a + '(' + den + ') = ' + a + 'n + ' + (a * c)],
            ['نكتب البسط بدلالة المقام', num + ' = ' + a + '(' + den + ') + ' + k],
            ['نعوّض في M', M + ' = (' + a + '(' + den + ') + ' + k + ')/(' + den + ')'],
            ['نفصل الكسرين', '(' + a + '(' + den + ') + ' + k + ')/(' + den + ') = '
              + a + '(' + den + ')/(' + den + ') + ' + k + '/(' + den + ')'],
            ['نختصر الكسر الأوّل', a + '(' + den + ')/(' + den + ') = ' + a],
            ['النتيجة', 'M = ' + forme]
          ],
          controle: { type: 'identite', gauche: M, droite: forme, vars: ['n'],
                      eviter: -c, nom: 'M', source: M, modele: 'transformer' }
        },
        {
          enonce: ['لتكن العبارة', 'M = ' + forme, 'حيث n عدد صحيح نسبي مخالف لـ -' + c,
                   'أوجد كلّ القيم الممكنة للعدد النسبي n حتّى يكون M عددا صحيحا نسبيا'],
          indice: 'M صحيح يعني أنّ ' + k + '/(' + den + ') صحيح، أي أنّ ' + den
            + ' قاسم للعدد ' + k,
          etapes: [
            ['نستعمل الشكل المختصر', 'M = ' + forme],
            ['الشرط', a + ' عدد صحيح، إذن M صحيح يعني أنّ ' + k + '/(' + den
              + ') عدد صحيح'],
            ['نترجم', den + ' يجب أن يكون قاسما للعدد ' + k],
            ['قواسم ' + k, 'قواسم ' + k + ' الموجبة هي: ' + dv.join(' ؛ ')
              + '، و لكلّ منها مقابله السالب'],
            ['نحسب n في كل حالة', 'نطرح ' + c + ' من كلّ قاسم للحصول على قيمة n'],
            ['النتيجة', 'القيم الممكنة لـ n هي: ' + ns.join(' ؛ ')]
          ],
          controle: { type: 'diviseursDe', k, c, trouves: ns, eviter: -c,
                      nom: 'M', source: forme, modele: 'valeurs' }
        },
        {
          enonce: ['احسب القيمة العددية لـ M إذا كان', 'n = ' + n0, 'علما أنّ',
                   'M = ' + M],
          indice: 'عوّض n بقيمته في الشكل ' + forme + ': الحساب أقصر',
          etapes: [
            ['نستعمل الشكل المختصر', 'M = ' + a + ' + ' + k + '/(' + n0 + ' + ' + c + ')'],
            ['نحسب المقام', n0 + ' + ' + c + ' = ' + (n0 + c)],
            ['نحسب الكسر', k + ' : ' + (n0 + c) + ' = ' + (k / (n0 + c))],
            ['نجمع', a + ' + ' + (k / (n0 + c)) + ' = ' + val],
            ['نتحقّق بالشكل الأوّل', '(' + a + ' × ' + n0 + ' + ' + b + ')/('
              + n0 + ' + ' + c + ') = ' + val],
            ['النتيجة', 'M = ' + val]
          ],
          controle: { type: 'valeur', expr: M, variable: 'n', x0: n0, val,
                      nom: 'M', source: M, modele: 'numerique' }
        }
      ];
    }
    return exercice9();
  }

  const API = { exercice2, exercice7, exercice8, exercice9,
                question2, question7, MODELES_2, pw, deguiser, diviseurs };
  if (M) module.exports = API;
  else racine.Puiss = API;
})(typeof window !== 'undefined' ? window : globalThis);
