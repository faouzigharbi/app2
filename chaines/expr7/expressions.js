// Les sept TYPES d'exercices sur « العبارات الحرفية » (7 أساسي),
// كتاب الحساب والجبر — تمارين 6 إلى 11, pages 56-63.
//
// Une page par type ; à l'intérieur d'un type, le générateur tire parmi
// plusieurs MODÈLES. L'élève retrouve donc la même méthode sous ses différents
// habillages — ce qu'une fiche papier, qui ne montre qu'un exemplaire de
// chaque, ne peut pas offrir.
//
// Règle de niveau, appliquée partout : on est en 7ème, donc dans les
// rationnels POSITIFS. Tout tirage qui produirait un coefficient négatif, un
// résultat intermédiaire négatif ou une solution négative est rejeté. C'est la
// raison d'être des boucles « for (;;) … continue » : on retire jusqu'à obtenir
// un énoncé que le programme de l'année autorise.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Expr;
  const G = M ? require('./figure.js') : racine.Figure;
  const { rat, add, sub, mul, div, abs, signe, egaux, cmp, txt, ent, choix } = F;

  const pgcd = (a, b) => (b ? pgcd(b, a % b) : Math.abs(a));
  const positif = x => x.n > 0;
  // « joli » : un nombre qu'un professeur écrirait au tableau. Sans ce garde-fou
  // les tirages produisent vite des 437/1080 que personne ne pose.
  const joli = (x, maxD, maxN) => x.d <= (maxD || 12) && Math.abs(x.n) <= (maxN || 60);

  // Une fraction positive non entière, de petits termes.
  function frac(maxN, maxD) {
    for (;;) {
      const d = ent(2, maxD || 9), n = ent(1, maxN || 12);
      const r = rat(n, d);
      if (r.d > 1) return r;                 // on veut une vraie fraction
    }
  }
  const petitEntier = (a, b) => rat(ent(a, b));

  // -------------------------------------------------------------------------
  // Écriture des monômes et des sommes.
  //   T(3/4, 'a')  →  « 3/4 a »        T(1, 'a')   →  « a »
  //   T(5, '')     →  « 5 »            coefficient 0 : le terme disparaît
  // -------------------------------------------------------------------------
  const T = (c, lit) => ({ c, lit: lit || '' });

  function morceau(t) {
    const a = abs(t.c);
    if (!t.lit) return txt(a);
    if (egaux(a, rat(1))) return t.lit;
    return txt(a) + ' ' + t.lit;
  }
  function ecrire(ts) {
    const l = ts.filter(t => t.c.n !== 0);
    if (!l.length) return '0';
    return l.map((t, i) => {
      const m = morceau(t);
      if (i === 0) return signe(t.c) < 0 ? '-' + m : m;
      return (signe(t.c) < 0 ? ' - ' : ' + ') + m;
    }).join('');
  }
  // « ( … ) » autour d'une somme, pour un produit : 3/2(x + 5/11 y)
  const grp = ts => '(' + ecrire(ts) + ')';

  // =========================================================================
  // TYPE 1 — L'ABRÉVIATION : additionner des termes de même nature.
  // C'est le tout premier geste de l'algèbre : « 2/3 a + 7/9 a » n'est pas une
  // addition de fractions, c'est une addition de DEUX FOIS LA MÊME CHOSE, et
  // c'est pour cela qu'on met la lettre en facteur avant de calculer.
  // =========================================================================
  function typeReduire() {
    const modele = choix(['somme', 'difference', 'troisTermes', 'deuxLettres']);
    const L = choix(['a', 'x', 'y', 'z']);
    const L2 = L === 'a' ? 'b' : 'a';

    for (let essai = 0; essai < 600; essai++) {
      const u = frac(11, 9), v = frac(11, 9);
      if (u.d === v.d) continue;              // sinon l'étape « même mقام » est vide

      if (modele === 'somme' || modele === 'difference') {
        const moins = modele === 'difference';
        if (moins && cmp(u, v) <= 0) continue;
        const s = moins ? sub(u, v) : add(u, v);
        if (!positif(s) || !joli(s, 40, 90)) continue;
        const m = u.d / pgcd(u.d, v.d) * v.d;
        const brut = ecrire([T(u, L), T(moins ? { n: -v.n, d: v.d } : v, L)]);
        const coef = txt(u) + (moins ? ' - ' : ' + ') + txt(v);
        return {
          enonce: ['اختصر العبارة التالية حيث ' + L + ' عدد كسري:', 'A = ' + brut],
          indice: 'الحدّان من نفس الطبيعة: ضع ' + L + ' عاملا مشتركا ثمّ احسب',
          etapes: [
            ['الحدود متشابهة', 'كل الحدود تحتوي على نفس الحرف ' + L + '، فيمكن جمعها'],
            ['نضع ' + L + ' عاملا مشتركا', brut + ' = (' + coef + ')' + L],
            ['نوحّد المقامات', coef + ' = ' + (u.n * (m / u.d)) + '/' + m
              + (moins ? ' - ' : ' + ') + (v.n * (m / v.d)) + '/' + m],
            ['نحسب المعامل', coef + ' = ' + txt(s)],
            ['النتيجة', 'A = ' + ecrire([T(s, L)])]
          ],
          controle: { type: 'identite', nom: 'A', gauche: brut,
                      droite: ecrire([T(s, L)]), vars: [L], modele }
        };
      }

      if (modele === 'troisTermes') {
        // C = 3/4 a + 6/7 a - a : le « - a » vaut « - 1 a », et c'est
        // exactement le 1 qu'on oublie.
        const s = sub(add(u, v), rat(1));
        if (!positif(s) || !joli(s, 40, 90)) continue;
        const m = [u.d, v.d, 1].reduce((x, y) => x / pgcd(x, y) * y);
        const brut = ecrire([T(u, L), T(v, L), T(rat(-1), L)]);
        const coef = txt(u) + ' + ' + txt(v) + ' - 1';
        return {
          enonce: ['اختصر العبارة التالية حيث ' + L + ' عدد كسري:', 'A = ' + brut],
          indice: 'انتبه: ' + L + ' وحده معناه 1 × ' + L + '، فمعامله هو 1',
          etapes: [
            ['الحدود متشابهة', 'كل الحدود تحتوي على ' + L + '، و ' + L + ' وحده معامله 1'],
            ['نضع ' + L + ' عاملا مشتركا', brut + ' = (' + coef + ')' + L],
            ['نوحّد المقامات', coef + ' = ' + (u.n * (m / u.d)) + '/' + m
              + ' + ' + (v.n * (m / v.d)) + '/' + m + ' - ' + m + '/' + m],
            ['نحسب المعامل', coef + ' = ' + txt(s)],
            ['النتيجة', 'A = ' + ecrire([T(s, L)])]
          ],
          controle: { type: 'identite', nom: 'A', gauche: brut,
                      droite: ecrire([T(s, L)]), vars: [L], modele }
        };
      }

      // deuxLettres : il faut d'abord RANGER, car les deux natures ne se
      // mélangent pas. « a » et « b » ne s'additionnent pas.
      const w = frac(11, 9), t = frac(11, 9);
      if (cmp(w, t) <= 0 || w.d === t.d) continue;
      const sa = add(u, v), sb = sub(w, t);
      if (!positif(sa) || !positif(sb) || !joli(sa, 40, 90) || !joli(sb, 40, 90)) continue;
      const brut = ecrire([T(u, L), T(w, L2), T(v, L), T({ n: -t.n, d: t.d }, L2)]);
      const range = ecrire([T(u, L), T(v, L)]) + ' + ' + grp([T(w, L2), T({ n: -t.n, d: t.d }, L2)]);
      const droite = ecrire([T(sa, L), T(sb, L2)]);
      return {
        enonce: ['اختصر العبارة التالية حيث ' + L + ' و ' + L2 + ' عددان كسريان:',
                 'A = ' + brut],
        indice: 'رتّب أوّلا: حدود ' + L + ' مع بعضها و حدود ' + L2 + ' مع بعضها',
        etapes: [
          ['حدود من طبيعتين', 'حدود ' + L + ' لا تُجمع مع حدود ' + L2],
          ['نرتّب الحدود المتشابهة', brut + ' = ' + range],
          ['نضع كل حرف عاملا مشتركا',
            range + ' = (' + txt(u) + ' + ' + txt(v) + ')' + L
            + ' + (' + txt(w) + ' - ' + txt(t) + ')' + L2],
          ['نحسب معامل ' + L, txt(u) + ' + ' + txt(v) + ' = ' + txt(sa)],
          ['نحسب معامل ' + L2, txt(w) + ' - ' + txt(t) + ' = ' + txt(sb)],
          ['النتيجة', 'A = ' + droite]
        ],
        controle: { type: 'identite', nom: 'A', gauche: brut, droite,
                    vars: [L, L2], modele }
      };
    }
    return typeReduire();
  }

  // =========================================================================
  // TYPE 2 — DÉVELOPPER puis abréger. Le piège n'est pas la distributivité,
  // c'est ce qui vient après : ranger les termes par nature avant d'additionner.
  // =========================================================================
  function typeDevelopper() {
    const modele = choix(['uneLettre', 'deuxLettres', 'soustraction', 'constante']);
    const L = choix(['x', 'a']);

    for (let essai = 0; essai < 800; essai++) {
      if (modele === 'uneLettre') {
        // D = k(L + m) + n(p + L)
        const k = frac(9, 8), m = frac(9, 6), n = frac(9, 8), p = frac(9, 6);
        const cL = add(k, n), c0 = add(mul(k, m), mul(n, p));
        if (!joli(cL, 30, 80) || !joli(c0, 30, 80)) continue;
        const brut = txt(k) + grp([T(rat(1), L), T(m, '')])
          + ' + ' + txt(n) + grp([T(p, ''), T(rat(1), L)]);
        const droite = ecrire([T(cL, L), T(c0, '')]);
        return {
          enonce: ['أنشر ثمّ اختصر، حيث ' + L + ' عدد كسري:', 'A = ' + brut],
          indice: 'انشر كل قوس، ثمّ اجمع حدود ' + L + ' من جهة و الأعداد من جهة',
          etapes: [
            ['قاعدة النشر', 'نضرب العدد الذي أمام القوس في كل حدّ من حدود القوس'],
            ['ننشر القوس الأوّل', txt(k) + grp([T(rat(1), L), T(m, '')])
              + ' = ' + ecrire([T(k, L), T(mul(k, m), '')])],
            ['ننشر القوس الثاني', txt(n) + grp([T(p, ''), T(rat(1), L)])
              + ' = ' + ecrire([T(mul(n, p), ''), T(n, L)])],
            ['نجمع حدود ' + L, txt(k) + ' ' + L + ' + ' + txt(n) + ' ' + L
              + ' = ' + ecrire([T(cL, L)])],
            ['نجمع الأعداد', txt(mul(k, m)) + ' + ' + txt(mul(n, p)) + ' = ' + txt(c0)],
            ['النتيجة', 'A = ' + droite]
          ],
          controle: { type: 'identite', nom: 'A', gauche: brut, droite, vars: [L], modele }
        };
      }

      if (modele === 'deuxLettres') {
        // E = k(m a + n b) + p(q a + r b)
        const k = frac(9, 7), p = frac(9, 7);
        const m = frac(9, 7), n = frac(9, 7), q = frac(9, 7), r = frac(9, 7);
        const ca = add(mul(k, m), mul(p, q)), cb = add(mul(k, n), mul(p, r));
        if (!joli(ca, 40, 90) || !joli(cb, 40, 90)) continue;
        const brut = txt(k) + grp([T(m, 'a'), T(n, 'b')])
          + ' + ' + txt(p) + grp([T(q, 'a'), T(r, 'b')]);
        const droite = ecrire([T(ca, 'a'), T(cb, 'b')]);
        return {
          enonce: ['أنشر ثمّ اختصر، حيث a و b عددان كسريان:', 'A = ' + brut],
          indice: 'انشر القوسين، ثمّ اجمع حدود a مع بعضها و حدود b مع بعضها',
          etapes: [
            ['قاعدة النشر', 'العدد الذي أمام القوس يُضرب في كلّ حدّ داخل القوس'],
            ['ننشر القوس الأوّل', txt(k) + grp([T(m, 'a'), T(n, 'b')])
              + ' = ' + ecrire([T(mul(k, m), 'a'), T(mul(k, n), 'b')])],
            ['ننشر القوس الثاني', txt(p) + grp([T(q, 'a'), T(r, 'b')])
              + ' = ' + ecrire([T(mul(p, q), 'a'), T(mul(p, r), 'b')])],
            ['نجمع حدود a', txt(mul(k, m)) + ' + ' + txt(mul(p, q)) + ' = ' + txt(ca)],
            ['نجمع حدود b', txt(mul(k, n)) + ' + ' + txt(mul(p, r)) + ' = ' + txt(cb)],
            ['النتيجة', 'A = ' + droite]
          ],
          controle: { type: 'identite', nom: 'A', gauche: brut, droite,
                      vars: ['a', 'b'], modele }
        };
      }

      if (modele === 'soustraction') {
        // T = k(L + m) - n(p L + q), et le résultat doit rester positif
        const k = frac(9, 6), m = frac(9, 6), n = frac(9, 6), p = frac(9, 6), q = frac(9, 6);
        const cL = sub(k, mul(n, p)), c0 = sub(mul(k, m), mul(n, q));
        if (!positif(cL) || !positif(c0)) continue;
        if (!joli(cL, 12, 40) || !joli(c0, 12, 40)) continue;
        const brut = txt(k) + grp([T(rat(1), L), T(m, '')])
          + ' - ' + txt(n) + grp([T(p, L), T(q, '')]);
        const droite = ecrire([T(cL, L), T(c0, '')]);
        return {
          enonce: ['أنشر ثمّ اختصر، حيث ' + L + ' عدد كسري:', 'A = ' + brut],
          indice: 'علامة الطرح أمام القوس تغيّر إشارة كل حدّ داخله',
          etapes: [
            ['قاعدة النشر مع الطرح', 'الطرح أمام القوس يقلب إشارة كل حدّ من حدود القوس'],
            ['ننشر القوس الأوّل', txt(k) + grp([T(rat(1), L), T(m, '')])
              + ' = ' + ecrire([T(k, L), T(mul(k, m), '')])],
            ['ننشر القوس الثاني', txt(n) + grp([T(p, L), T(q, '')])
              + ' = ' + ecrire([T(mul(n, p), L), T(mul(n, q), '')])],
            ['نطرح حدود ' + L, txt(k) + ' - ' + txt(mul(n, p)) + ' = ' + txt(cL)],
            ['نطرح الأعداد', txt(mul(k, m)) + ' - ' + txt(mul(n, q)) + ' = ' + txt(c0)],
            ['النتيجة', 'A = ' + droite]
          ],
          controle: { type: 'identite', nom: 'A', gauche: brut, droite, vars: [L], modele }
        };
      }

      // constante : S = k(L + m) - n L - c   (l'exercice 10 de la fiche)
      const k = frac(9, 6), m = petitEntier(1, 6), n = frac(9, 6), c = petitEntier(1, 6);
      const cL = sub(k, n), c0 = sub(mul(k, m), c);
      if (!positif(cL) || !positif(c0)) continue;
      if (!joli(cL, 12, 40) || !joli(c0, 12, 40)) continue;
      const brut = txt(k) + grp([T(rat(1), L), T(m, '')])
        + ' - ' + txt(n) + ' ' + L + ' - ' + txt(c);
      const droite = ecrire([T(cL, L), T(c0, '')]);
      return {
        enonce: ['أنشر ثمّ اختصر، حيث ' + L + ' عدد كسري:', 'A = ' + brut],
        indice: 'انشر القوس، ثمّ اجمع حدود ' + L + ' و اطرح الأعداد',
        etapes: [
          ['ننشر القوس', txt(k) + grp([T(rat(1), L), T(m, '')])
            + ' = ' + ecrire([T(k, L), T(mul(k, m), '')])],
          ['نعيد كتابة العبارة', brut + ' = '
            + ecrire([T(k, L), T(mul(k, m), '')]) + ' - ' + txt(n) + ' ' + L
            + ' - ' + txt(c)],
          ['نطرح حدود ' + L, txt(k) + ' - ' + txt(n) + ' = ' + txt(cL)],
          ['نطرح الأعداد', txt(mul(k, m)) + ' - ' + txt(c) + ' = ' + txt(c0)],
          ['النتيجة', 'A = ' + droite]
        ],
        controle: { type: 'identite', nom: 'A', gauche: brut, droite, vars: [L], modele }
      };
    }
    return typeDevelopper();
  }

  // =========================================================================
  // TYPE 3 — LA FACTORISATION. On part toujours de la RÉPONSE : un facteur
  // commun simple et de petites parts. Tirer les coefficients au hasard puis
  // chercher leur facteur commun donne des nombres qu'aucun professeur
  // n'écrirait — et souvent aucun facteur commun du tout.
  // =========================================================================
  function typeFactoriser() {
    const modele = choix(['numerique', 'litteral', 'carre', 'trois']);

    for (let essai = 0; essai < 800; essai++) {
      const c = frac(9, 11);                       // le facteur commun
      if (egaux(c, rat(1))) continue;

      if (modele === 'numerique') {
        // G = c x + (c·r) y : on ne voit le facteur qu'après avoir décomposé
        // le second coefficient, exactement comme la fiche le fait.
        const r = frac(9, 11);
        const c2 = mul(c, r);
        if (!joli(c2, 40, 60) || egaux(r, rat(1))) continue;
        const brut = ecrire([T(c, 'x'), T(c2, 'y')]);
        const fact = txt(c) + '(' + ecrire([T(rat(1), 'x'), T(r, 'y')]) + ')';
        return {
          enonce: ['فكّك إلى جداء عوامل، حيث x و y عددان كسريان:', 'A = ' + brut],
          indice: 'حاول كتابة المعامل الثاني على شكل ' + txt(c) + ' × عدد',
          etapes: [
            ['نبحث عن عامل مشترك', 'المعاملان مختلفان، فنحاول إظهار عامل مشترك بينهما'],
            ['نفكّك المعامل الثاني', txt(c2) + ' = ' + txt(c) + ' × ' + txt(r)],
            ['نعيد كتابة العبارة', brut + ' = ' + txt(c) + ' x + ' + txt(c)
              + ' × ' + txt(r) + ' y'],
            ['نُخرج العامل المشترك', 'A = ' + fact],
            ['نتحقّق بالنشر', fact + ' = ' + brut]
          ],
          controle: { type: 'identite', nom: 'A', gauche: brut, droite: fact,
                      vars: ['x', 'y'], modele }
        };
      }

      if (modele === 'litteral') {
        // F = (c·p) x²y + (c·q) xy² : ici le facteur commun est À LA FOIS
        // numérique ET littéral. C'est le xy qu'on oublie.
        const p = frac(7, 5), q = choix([petitEntier(2, 6), frac(7, 5)]);
        const c1 = mul(c, p), c2 = mul(c, q);
        if (!joli(c1, 40, 60) || !joli(c2, 40, 60)) continue;
        if (egaux(p, q)) continue;
        const brut = ecrire([T(c1, 'x^2 y'), T(c2, 'x y^2')]);
        const fact = txt(c) + ' xy(' + ecrire([T(p, 'x'), T(q, 'y')]) + ')';
        return {
          enonce: ['فكّك إلى جداء عوامل، حيث x و y عددان كسريان:', 'A = ' + brut],
          indice: 'العامل المشترك عددي و حرفي معا: لا تنسَ الجزء الحرفي xy',
          etapes: [
            ['العامل الحرفي في الحدّ الأوّل', 'x^2 y = xy × x'],
            ['العامل الحرفي في الحدّ الثاني', 'x y^2 = xy × y'],
            ['العامل العددي في الحدّ الأوّل', txt(c1) + ' = ' + txt(c) + ' × ' + txt(p)],
            ['العامل العددي في الحدّ الثاني', txt(c2) + ' = ' + txt(c) + ' × ' + txt(q)],
            ['نُخرج العامل المشترك', 'A = ' + fact],
            ['نتحقّق بالنشر', fact + ' = ' + brut]
          ],
          controle: { type: 'identite', nom: 'A', gauche: brut, droite: fact,
                      vars: ['x', 'y'], composites: true, modele }
        };
      }

      if (modele === 'carre') {
        // c x² + (c·r) x = c x(x + r)
        const r = choix([frac(9, 7), petitEntier(2, 7)]);
        const c2 = mul(c, r);
        if (!joli(c2, 40, 60)) continue;
        const brut = ecrire([T(c, 'x^2'), T(c2, 'x')]);
        const fact = txt(c) + ' x(' + ecrire([T(rat(1), 'x'), T(r, '')]) + ')';
        return {
          enonce: ['فكّك إلى جداء عوامل، حيث x عدد كسري:', 'A = ' + brut],
          indice: 'x موجود في الحدّين: x^2 = x × x',
          etapes: [
            ['العامل الحرفي', 'x^2 = x × x'],
            ['العامل العددي', txt(c2) + ' = ' + txt(c) + ' × ' + txt(r)],
            ['نعيد كتابة العبارة', brut + ' = ' + txt(c) + ' x × x + '
              + txt(c) + ' x × ' + txt(r)],
            ['نُخرج العامل المشترك', 'A = ' + fact],
            ['نتحقّق بالنشر', fact + ' = ' + brut]
          ],
          controle: { type: 'identite', nom: 'A', gauche: brut, droite: fact,
                      vars: ['x'], modele }
        };
      }

      // trois : c x + (c·p) y + (c·q)
      const p = frac(9, 7), q = choix([petitEntier(2, 6), frac(9, 7)]);
      const c1 = mul(c, p), c2 = mul(c, q);
      if (!joli(c1, 40, 60) || !joli(c2, 40, 60) || egaux(p, q)) continue;
      const brut = ecrire([T(c, 'x'), T(c1, 'y'), T(c2, '')]);
      const fact = txt(c) + '(' + ecrire([T(rat(1), 'x'), T(p, 'y'), T(q, '')]) + ')';
      return {
        enonce: ['فكّك إلى جداء عوامل، حيث x و y عددان كسريان:', 'A = ' + brut],
        indice: 'الحدود الثلاثة تقبل نفس العامل ' + txt(c),
        etapes: [
          ['نفكّك المعامل الثاني', txt(c1) + ' = ' + txt(c) + ' × ' + txt(p)],
          ['نفكّك الحدّ الثالث', txt(c2) + ' = ' + txt(c) + ' × ' + txt(q)],
          ['نعيد كتابة العبارة', brut + ' = ' + txt(c) + ' x + ' + txt(c)
            + ' × ' + txt(p) + ' y + ' + txt(c) + ' × ' + txt(q)],
          ['نُخرج العامل المشترك', 'A = ' + fact],
          ['نتحقّق بالنشر', fact + ' = ' + brut]
        ],
        controle: { type: 'identite', nom: 'A', gauche: brut, droite: fact,
                    vars: ['x', 'y'], modele }
      };
    }
    return typeFactoriser();
  }

  // =========================================================================
  // TYPE 4 — L'EXERCICE COMPLET (تمرين 8 et تمرين 10 de la fiche) : les quatre
  // gestes sur UNE SEULE expression — développer, factoriser, calculer une
  // valeur numérique, puis résoudre. C'est le même T qui traverse les quatre
  // questions ; c'est ce fil-là qui donne son sens à l'exercice.
  // =========================================================================
  function typeComplet() {
    const modele = choix(['deuxParentheses', 'parentheseEtTermes']);
    for (let essai = 0; essai < 3000; essai++) {
      const deux = modele === 'deuxParentheses';
      const A = frac(9, 6), B = frac(9, 6), C = frac(9, 6);
      const D = deux ? frac(9, 6) : rat(1);
      const E = deux ? frac(9, 6) : petitEntier(1, 6);
      // ce qu'on RETRANCHE réellement, tel que l'énoncé l'écrit : dans
      // « … - C(Dx + E) » c'est C·D et C·E, mais dans « … - C x - E » c'est
      // C et E. Confondre les deux revient à annoncer un résultat que
      // l'expression affichée ne donne pas.
      const soustX = deux ? mul(C, D) : C;
      const soust0 = deux ? mul(C, E) : E;
      const a = sub(A, soustX), b = sub(mul(A, B), soust0);
      if (!positif(a) || !positif(b)) continue;
      if (!joli(a, 8, 20) || !joli(b, 8, 20)) continue;
      // « factoriser » n'a de sens que si le coefficient à sortir n'est pas 1.
      if (egaux(a, rat(1))) continue;

      // le facteur commun sorti : T = a(x + b/a) — il faut que b/a se pose.
      const q = div(b, a);
      if (!joli(q, 9, 30)) continue;

      const brut = deux
        ? txt(A) + '(' + ecrire([T(rat(1), 'x'), T(B, '')]) + ')'
          + ' - ' + txt(C) + '(' + ecrire([T(D, 'x'), T(E, '')]) + ')'
        : txt(A) + '(' + ecrire([T(rat(1), 'x'), T(B, '')]) + ')'
          + ' - ' + txt(C) + ' x - ' + txt(E);
      const reduit = ecrire([T(a, 'x'), T(b, '')]);
      const fact = txt(a) + '(' + ecrire([T(rat(1), 'x'), T(q, '')]) + ')';

      // la valeur numérique, et la valeur cherchée : deux fractions positives
      const x0 = frac(7, 5);
      const val = add(mul(a, x0), b);
      if (!joli(val, 24, 90)) continue;
      const xs = choix([frac(7, 4), petitEntier(1, 5)]);
      const k = add(mul(a, xs), b);
      if (!joli(k, 12, 40) || egaux(xs, x0)) continue;

      const devA = ecrire([T(A, 'x'), T(mul(A, B), '')]);
      const devC = ecrire([T(soustX, 'x'), T(soust0, '')]);

      return [
        {
          enonce: ['أنشر ثمّ اختصر العبارة T حيث x عدد كسري:', 'T = ' + brut],
          indice: 'انشر القوس (أو القوسين)، ثمّ اجمع حدود x و الأعداد كلاّ على حدة',
          etapes: [
            ['ننشر القوس الأوّل', txt(A) + '(' + ecrire([T(rat(1), 'x'), T(B, '')]) + ')'
              + ' = ' + devA],
            [deux ? 'ننشر القوس الثاني' : 'ما يُطرح بعد القوس',
              deux ? txt(C) + '(' + ecrire([T(D, 'x'), T(E, '')]) + ') = ' + devC
                   : 'نطرح ' + txt(C) + ' x ثمّ نطرح العدد ' + txt(E)],
            ['نطرح حدود x', txt(A) + ' - ' + txt(soustX) + ' = ' + txt(a)],
            ['نطرح الأعداد', txt(mul(A, B)) + ' - ' + txt(soust0) + ' = ' + txt(b)],
            ['النتيجة', 'T = ' + reduit]
          ],
          controle: { type: 'identite', nom: 'T', gauche: brut, droite: reduit,
                      vars: ['x'], modele }
        },
        {
          enonce: ['فكّك العبارة T إلى جداء عوامل، علما أنّ:', 'T = ' + reduit],
          indice: 'ضع معامل x عاملا مشتركا: ' + txt(a),
          etapes: [
            ['العامل المشترك', 'نضع معامل x و هو ' + txt(a) + ' عاملا مشتركا'],
            ['نقسم الحدّ الثاني على العامل', txt(b) + ' : ' + txt(a) + ' = ' + txt(q)],
            ['نكتب الجداء', 'T = ' + fact],
            ['نتحقّق بالنشر', fact + ' = ' + reduit]
          ],
          controle: { type: 'identite', nom: 'T', gauche: reduit, droite: fact,
                      vars: ['x'], modele }
        },
        {
          enonce: ['احسب القيمة العددية للعبارة T إذا كان', 'x = ' + txt(x0),
                   'علما أنّ', 'T = ' + reduit],
          indice: 'عوّض x بقيمته في الشكل المختصر: الحساب أقصر',
          etapes: [
            ['نعوّض في الشكل المختصر', 'T = ' + txt(a) + ' × ' + txt(x0) + ' + ' + txt(b)],
            ['نحسب الجداء', txt(a) + ' × ' + txt(x0) + ' = ' + txt(mul(a, x0))],
            ['نجمع', txt(mul(a, x0)) + ' + ' + txt(b) + ' = ' + txt(val)],
            ['نتحقّق بالشكل المفكّك', txt(a) + '(' + txt(x0) + ' + ' + txt(q) + ') = ' + txt(val)],
            ['النتيجة', 'T = ' + txt(val)]
          ],
          controle: { type: 'valeur', gauche: brut, x0, val, modele }
        },
        {
          enonce: ['جد العدد الكسري x بحيث', 'T = ' + txt(k), 'علما أنّ', 'T = ' + fact],
          indice: 'استعمل الشكل المفكّك: اقسم أوّلا على ' + txt(a),
          etapes: [
            ['نستعمل الشكل المفكّك', txt(a) + '(x + ' + txt(q) + ') = ' + txt(k)],
            ['نقسم الطرفين على ' + txt(a), 'x + ' + txt(q) + ' = ' + txt(k)
              + ' : ' + txt(a)],
            ['نحسب الطرف الثاني', txt(k) + ' : ' + txt(a) + ' = ' + txt(div(k, a))],
            ['نطرح ' + txt(q) + ' من الطرفين', 'x = ' + txt(div(k, a)) + ' - ' + txt(q)],
            ['النتيجة', 'x = ' + txt(xs)]
          ],
          controle: { type: 'equation', gauche: brut, x0: xs, val: k, modele }
        }
      ];
    }
    return typeComplet();
  }

  // =========================================================================
  // TYPE 5 — LES ÉQUATIONS du premier degré (تمرين 9 de la fiche). Huit
  // habillages de la même idée : isoler x en faisant la MÊME opération aux
  // deux membres. La page en tire quatre, toujours différents.
  // =========================================================================
  const MODELES_EQ = ['coefFraction', 'coefEntier', 'moins', 'plus',
                      'parenthese', 'affine', 'divise', 'inverse'];

  function equation(modele) {
    for (let essai = 0; essai < 900; essai++) {
      if (modele === 'coefFraction') {
        const c = frac(9, 9), r = frac(9, 9);
        const x = div(r, c);
        if (!joli(x, 40, 90) || egaux(c, rat(1))) continue;
        const inv = div(rat(1), c);
        return {
          enonce: ['جد العدد الكسري x بحيث:', txt(c) + ' x = ' + txt(r)],
          indice: 'اضرب الطرفين في مقلوب ' + txt(c) + '، أي في ' + txt(inv),
          etapes: [
            ['نتخلّص من معامل x', 'نضرب الطرفين في مقلوب ' + txt(c)],
            ['مقلوب المعامل', 'مقلوب ' + txt(c) + ' هو ' + txt(inv)],
            ['نضرب الطرفين', txt(inv) + ' × ' + txt(c) + ' x = ' + txt(inv) + ' × ' + txt(r)],
            ['يبقى x وحده', 'x = ' + txt(inv) + ' × ' + txt(r)],
            ['النتيجة', 'x = ' + txt(x)]
          ],
          controle: { type: 'equation', gauche: txt(c) + ' x', x0: x, val: r, modele }
        };
      }
      if (modele === 'coefEntier') {
        const c = petitEntier(2, 9), r = frac(9, 9);
        const x = div(r, c);
        if (!joli(x, 40, 90)) continue;
        return {
          enonce: ['جد العدد الكسري x بحيث:', txt(c) + ' x = ' + txt(r)],
          indice: 'اقسم الطرفين على ' + txt(c),
          etapes: [
            ['نتخلّص من معامل x', 'نقسم الطرفين على ' + txt(c)],
            ['نقسم الطرفين', txt(c) + ' x : ' + txt(c) + ' = ' + txt(r) + ' : ' + txt(c)],
            ['يبقى x وحده', 'x = ' + txt(r) + ' : ' + txt(c)],
            ['نحسب', txt(r) + ' : ' + txt(c) + ' = ' + txt(r) + ' × 1/' + txt(c)],
            ['النتيجة', 'x = ' + txt(x)]
          ],
          controle: { type: 'equation', gauche: txt(c) + ' x', x0: x, val: r, modele }
        };
      }
      if (modele === 'moins') {
        const a = choix([frac(9, 7), petitEntier(1, 4)]), r = frac(9, 7);
        const x = add(r, a);
        if (!joli(x, 40, 90)) continue;
        return {
          enonce: ['جد العدد الكسري x بحيث:', 'x - ' + txt(a) + ' = ' + txt(r)],
          indice: 'أضف ' + txt(a) + ' إلى الطرفين',
          etapes: [
            ['نعزل x', 'نضيف ' + txt(a) + ' إلى الطرفين'],
            ['نضيف إلى الطرفين', 'x - ' + txt(a) + ' + ' + txt(a) + ' = '
              + txt(r) + ' + ' + txt(a)],
            ['يبقى x وحده', 'x = ' + txt(r) + ' + ' + txt(a)],
            ['نحسب المجموع', txt(r) + ' + ' + txt(a) + ' = ' + txt(x)],
            ['النتيجة', 'x = ' + txt(x)]
          ],
          controle: { type: 'equation', gauche: 'x - ' + txt(a), x0: x, val: r, modele }
        };
      }
      if (modele === 'plus') {
        const a = frac(9, 7), r = frac(11, 7);
        if (cmp(r, a) <= 0) continue;
        const x = sub(r, a);
        if (!joli(x, 40, 90)) continue;
        return {
          enonce: ['جد العدد الكسري x بحيث:', 'x + ' + txt(a) + ' = ' + txt(r)],
          indice: 'اطرح ' + txt(a) + ' من الطرفين',
          etapes: [
            ['نعزل x', 'نطرح ' + txt(a) + ' من الطرفين'],
            ['نطرح من الطرفين', 'x + ' + txt(a) + ' - ' + txt(a) + ' = '
              + txt(r) + ' - ' + txt(a)],
            ['يبقى x وحده', 'x = ' + txt(r) + ' - ' + txt(a)],
            ['نوحّد المقامات ثمّ نطرح', txt(r) + ' - ' + txt(a) + ' = ' + txt(x)],
            ['النتيجة', 'x = ' + txt(x)]
          ],
          controle: { type: 'equation', gauche: 'x + ' + txt(a), x0: x, val: r, modele }
        };
      }
      if (modele === 'parenthese') {
        // A(B x - C) = D x : on développe, on regroupe, on divise.
        const A = frac(9, 5), B = choix([petitEntier(2, 5), frac(9, 5)]);
        const C = choix([petitEntier(1, 4), frac(9, 5)]), D = frac(9, 5);
        const g = mul(A, B), cst = mul(A, C);
        const coef = sub(g, D);
        if (!positif(coef)) continue;
        const x = div(cst, coef);
        if (!joli(x, 60, 90) || !joli(coef, 24, 60)) continue;
        const gauche = txt(A) + '(' + ecrire([T(B, 'x'), T({ n: -C.n, d: C.d }, '')]) + ')';
        return {
          enonce: ['جد العدد الكسري x بحيث:', gauche + ' = ' + txt(D) + ' x'],
          indice: 'انشر أوّلا، ثمّ اجمع حدود x في طرف و الأعداد في الطرف الآخر',
          etapes: [
            ['ننشر الطرف الأوّل', gauche + ' = ' + ecrire([T(g, 'x'), T({ n: -cst.n, d: cst.d }, '')])],
            ['نكتب المعادلة بعد النشر', ecrire([T(g, 'x'), T({ n: -cst.n, d: cst.d }, '')])
              + ' = ' + txt(D) + ' x'],
            ['نجمع حدود x في طرف واحد', txt(g) + ' x - ' + txt(D) + ' x = ' + txt(cst)],
            ['نختصر معامل x', txt(g) + ' - ' + txt(D) + ' = ' + txt(coef)],
            ['نقسم على المعامل', 'x = ' + txt(cst) + ' : ' + txt(coef)],
            ['النتيجة', 'x = ' + txt(x)]
          ],
          controle: { type: 'equation', gauche, x0: x, val: null,
                      droite: txt(D) + ' x', modele }
        };
      }
      if (modele === 'affine') {
        const c = frac(9, 5), b = frac(9, 5), r = frac(11, 5);
        if (cmp(r, b) <= 0) continue;
        const x = div(sub(r, b), c);
        if (!joli(x, 60, 90)) continue;
        return {
          enonce: ['جد العدد الكسري x بحيث:', txt(c) + ' x + ' + txt(b) + ' = ' + txt(r)],
          indice: 'اطرح ' + txt(b) + ' من الطرفين، ثمّ اقسم على ' + txt(c),
          etapes: [
            ['نعزل حدّ x', 'نطرح ' + txt(b) + ' من الطرفين'],
            ['نطرح من الطرفين', txt(c) + ' x = ' + txt(r) + ' - ' + txt(b)],
            ['نحسب الطرف الثاني', txt(r) + ' - ' + txt(b) + ' = ' + txt(sub(r, b))],
            ['نقسم على المعامل', 'x = ' + txt(sub(r, b)) + ' : ' + txt(c)],
            ['النتيجة', 'x = ' + txt(x)]
          ],
          controle: { type: 'equation', gauche: txt(c) + ' x + ' + txt(b),
                      x0: x, val: r, modele }
        };
      }
      if (modele === 'divise') {
        const a = petitEntier(2, 9), r = frac(13, 9);
        const x = mul(a, r);
        if (!joli(x, 40, 90)) continue;
        return {
          enonce: ['جد العدد الكسري x بحيث:', 'x : ' + txt(a) + ' = ' + txt(r)],
          indice: 'اضرب الطرفين في ' + txt(a),
          etapes: [
            ['نعزل x', 'نضرب الطرفين في ' + txt(a)],
            ['نضرب الطرفين', '(x : ' + txt(a) + ') × ' + txt(a) + ' = '
              + txt(r) + ' × ' + txt(a)],
            ['يبقى x وحده', 'x = ' + txt(r) + ' × ' + txt(a)],
            ['نحسب الجداء', txt(r) + ' × ' + txt(a) + ' = ' + txt(x)],
            ['النتيجة', 'x = ' + txt(x)]
          ],
          controle: { type: 'equation', gauche: 'x : ' + txt(a), x0: x, val: r, modele }
        };
      }
      // inverse : 1 : x = d, avec d écrit sous forme décimale comme sur la fiche
      const dix = ent(11, 89);
      if (dix % 10 === 0) continue;
      const d = rat(dix, 10), dTxt = F.dec(dix);
      const x = div(rat(1), d);
      if (!joli(x, 90, 40)) continue;
      return {
        enonce: ['جد العدد الكسري x بحيث:', '1 : x = ' + dTxt],
        indice: 'اكتب العدد العشري ' + dTxt + ' على شكل كسر، ثمّ خذ مقلوبه',
        etapes: [
          ['نكتب العدد العشري كسرا', dTxt + ' = ' + dix + '/10'],
          ['نكتب المعادلة بالكسر', '1 : x = ' + dix + '/10'],
          ['x هو مقلوب الطرف الثاني', 'x = 10/' + dix],
          ['نختصر', '10/' + dix + ' = ' + txt(x)],
          ['النتيجة', 'x = ' + txt(x)]
        ],
        controle: { type: 'equation', gauche: '1 : x', x0: x, val: d, modele }
      };
    }
    return equation(choix(MODELES_EQ));
  }

  // Quatre équations, quatre modèles DIFFÉRENTS : sur une même page l'élève
  // doit changer de geste à chaque question, pas répéter le même quatre fois.
  function typeEquations() {
    const pris = MODELES_EQ.slice();
    for (let i = pris.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pris[i], pris[j]] = [pris[j], pris[i]];
    }
    return pris.slice(0, 4).map(equation);
  }

  // =========================================================================
  // TYPE 6 — LE PÉRIMÈTRE EN FONCTION DE x (تمرين 6 de la fiche). La figure
  // n'est pas une décoration : c'est elle qui dit quels côtés sont égaux, et
  // sans elle l'énoncé n'a pas de sens. Elle est donc redessinée à chaque
  // tirage, à partir des mêmes nombres que l'énoncé.
  // =========================================================================
  function typePerimetre() {
    const modele = choix(['pentagone', 'quadrilatere', 'triangle', 'rectangle']);
    for (let essai = 0; essai < 600; essai++) {
      const m = ent(1, 6), c = ent(2, 9);
      let cotes, nbX, cste, nom;
      if (modele === 'pentagone') {
        nbX = 4; cste = m + c; nom = 'ABCDE';
        cotes = [{ texte: 'x', marque: 1 }, { texte: 'x', marque: 1 },
                 { texte: 'x', marque: 1 }, { texte: String(c), marque: 0 },
                 { texte: 'x + ' + m, marque: 0 }];
      } else if (modele === 'quadrilatere') {
        nbX = 3; cste = m + c; nom = 'ABCD';
        cotes = [{ texte: 'x', marque: 1 }, { texte: 'x + ' + m, marque: 0 },
                 { texte: 'x', marque: 1 }, { texte: String(c), marque: 0 }];
      } else if (modele === 'triangle') {
        nbX = 2; cste = c; nom = 'ABC';
        cotes = [{ texte: 'x', marque: 1 }, { texte: 'x', marque: 1 },
                 { texte: String(c), marque: 0 }];
      } else {
        // rectangle : deux longueurs x + m et deux largeurs x
        nbX = 4; cste = 2 * m; nom = 'ABCD';
        cotes = [{ texte: 'x + ' + m, marque: 2 }, { texte: 'x', marque: 1 },
                 { texte: 'x + ' + m, marque: 2 }, { texte: 'x', marque: 1 }];
      }
      const P = ecrire([T(rat(nbX), 'x'), T(rat(cste), '')]);
      const somme = cotes.map(k => k.texte.indexOf('+') >= 0 ? '(' + k.texte + ')' : k.texte)
        .join(' + ');

      // la valeur cherchée : x doit être un nombre que l'élève sait écrire
      const xs = choix([petitEntier(2, 9), frac(9, 4)]);
      const V = add(mul(rat(nbX), xs), rat(cste));
      if (!joli(V, 12, 90)) continue;
      // et une valeur numérique de contrôle, différente de la précédente
      const x0 = choix([petitEntier(1, 8), frac(9, 4)]);
      if (egaux(x0, xs)) continue;
      const P0 = add(mul(rat(nbX), x0), rat(cste));

      const svg = G.polygone(cotes);
      const intro = 'ليكن P قيس محيط المضلّع ' + nom;

      return [
        {
          enonce: [{ brut: svg }, intro + ':', 'عبّر عن P بدلالة x'],
          indice: 'المحيط هو مجموع أطوال كلّ الأضلاع، ثمّ نجمع الحدود المتشابهة',
          etapes: [
            ['تعريف المحيط', 'المحيط هو مجموع أطوال جميع الأضلاع'],
            ['نجمع الأضلاع', 'P = ' + somme],
            ['نزيل الأقواس', 'P = ' + cotes.map(k => k.texte).join(' + ')],
            ['نجمع حدود x', 'مجموع حدود x يساوي ' + nbX + ' x'],
            ['نجمع الأعداد', 'مجموع الأعداد يساوي ' + cste],
            ['النتيجة', 'P = ' + P]
          ],
          controle: { type: 'identite', nom: 'P',
                      gauche: cotes.map(k => '(' + k.texte + ')').join(' + '),
                      droite: P, vars: ['x'], modele }
        },
        {
          enonce: ['احسب قيس محيط المضلّع إذا كان', 'x = ' + txt(x0),
                   'علما أنّ', 'P = ' + P],
          indice: 'عوّض x بقيمته في العبارة ' + P,
          etapes: [
            ['نعوّض في العبارة', 'P = ' + nbX + ' × ' + txt(x0) + ' + ' + cste],
            ['نحسب الجداء', nbX + ' × ' + txt(x0) + ' = ' + txt(mul(rat(nbX), x0))],
            ['نجمع', txt(mul(rat(nbX), x0)) + ' + ' + cste + ' = ' + txt(P0)],
            ['النتيجة', 'P = ' + txt(P0)]
          ],
          controle: { type: 'valeur', gauche: P, x0, val: P0, modele }
        },
        {
          enonce: ['جد العدد الكسري x بحيث', 'P = ' + txt(V), 'علما أنّ', 'P = ' + P],
          indice: 'اطرح ' + cste + ' من الطرفين، ثمّ اقسم على ' + nbX,
          etapes: [
            ['نكتب المعادلة', nbX + ' x + ' + cste + ' = ' + txt(V)],
            ['نطرح ' + cste + ' من الطرفين', nbX + ' x = ' + txt(V) + ' - ' + cste],
            ['نحسب الطرف الثاني', txt(V) + ' - ' + cste + ' = ' + txt(sub(V, rat(cste)))],
            ['نقسم على ' + nbX, 'x = ' + txt(sub(V, rat(cste))) + ' : ' + nbX],
            ['النتيجة', 'x = ' + txt(xs)]
          ],
          controle: { type: 'equation', gauche: P, x0: xs, val: V, modele }
        }
      ];
    }
    return typePerimetre();
  }

  // =========================================================================
  // TYPE 7 — DEUX ENTIERS NATURELS SOUS CONTRAINTE (تمرين 11 de la fiche).
  // Ici on ne connaît ni a ni b, et pourtant on calcule : le développement fait
  // apparaître la combinaison qu'on nous a donnée. C'est l'exercice qui montre
  // le mieux à quoi sert de savoir factoriser.
  // =========================================================================
  function typeNaturels() {
    const modele = choix(['ecart', 'somme']);
    for (let essai = 0; essai < 4000; essai++) {
      const b = ent(4, 20), d = ent(2, 12), a = b + d;
      const p = ent(2, 9), q = ent(2, 9);
      if (p === q) continue;
      const S = p * a + q * b, prod = a * b;

      // E = m(p1 a + q1 b) - n(a + r b), à construire pour retomber sur λ(pa+qb)
      const lam = ent(2, 5), m = ent(2, 7), n = ent(2, 7);
      const alpha = lam * p + n, beta = lam * q;
      if (alpha % m !== 0) continue;
      const p1 = alpha / m;
      const r = ent(1, 6);
      if ((beta + n * r) % m !== 0) continue;
      const q1 = (beta + n * r) / m;
      if (p1 < 2 || q1 < 2 || p1 > 12 || q1 > 12) continue;
      // vérification directe : m·p1 - n = λp  et  m·q1 - n·r = λq
      if (m * p1 - n !== lam * p || m * q1 - n * r !== lam * q) continue;
      const valE = lam * S;

      // F = k p a + k q b + k c
      const k = ent(2, 7), cc = ent(1, 9);
      const valF = k * (S + cc);

      const valG = prod + S + p * q;

      const dev = m + '(' + p1 + 'a + ' + q1 + 'b) - ' + n + '(a + ' + r + 'b)';
      const dev1 = (m * p1) + 'a + ' + (m * q1) + 'b - ' + n + 'a - ' + (n * r) + 'b';
      const dev2 = (lam * p) + 'a + ' + (lam * q) + 'b';
      const Fbrut = (k * p) + 'a + ' + (k * q) + 'b + ' + (k * cc);
      const Ffact = k + '(' + p + 'a + ' + q + 'b + ' + cc + ')';
      const Gbrut = '(a + ' + q + ')(b + ' + p + ')';
      const Gdev = 'ab + ' + p + 'a + ' + q + 'b + ' + (p * q);
      const donnees = 'a و b عددان طبيعيان يحقّقان ' + p + 'a + ' + q + 'b = ' + S
        + ' و ab = ' + prod;

      const env = { a: rat(a), b: rat(b) };

      return [
        {
          enonce: [donnees, 'أنشر و اختصر العبارة', 'E = ' + dev,
                   'ثمّ جد قيمتها العددية'],
          indice: 'بعد النشر ستظهر العبارة ' + p + 'a + ' + q + 'b التي نعرف قيمتها',
          etapes: [
            ['ننشر القوسين', dev + ' = ' + dev1],
            ['نرتّب الحدود المتشابهة', dev1 + ' = ' + (m * p1) + 'a - ' + n + 'a + '
              + (m * q1) + 'b - ' + (n * r) + 'b'],
            ['نختصر', dev1 + ' = ' + dev2],
            ['نُخرج العامل المشترك', dev2 + ' = ' + lam + '(' + p + 'a + ' + q + 'b)'],
            ['نعوّض بالمعطى', lam + '(' + p + 'a + ' + q + 'b) = ' + lam + ' × ' + S],
            ['النتيجة', 'E = ' + valE]
          ],
          controle: { type: 'identite', nom: 'E', gauche: dev, droite: dev2,
                      vars: ['a', 'b'], composites: true, env, modele }
        },
        {
          enonce: [donnees, 'فكّك إلى جداء عوامل العبارة', 'F = ' + Fbrut,
                   'ثمّ جد قيمتها العددية'],
          indice: 'العامل المشترك هو ' + k + '، و ما يبقى داخل القوس يحتوي المعطى',
          etapes: [
            ['نبحث عن عامل مشترك', 'الأعداد ' + (k * p) + ' و ' + (k * q) + ' و '
              + (k * cc) + ' كلّها مضاعفات لـ ' + k],
            ['نُخرج العامل المشترك', Fbrut + ' = ' + Ffact],
            ['نعوّض بالمعطى', p + 'a + ' + q + 'b = ' + S],
            ['نحسب داخل القوس', S + ' + ' + cc + ' = ' + (S + cc)],
            ['نضرب', k + ' × ' + (S + cc) + ' = ' + valF],
            ['النتيجة', 'F = ' + valF]
          ],
          controle: { type: 'identite', nom: 'F', gauche: Fbrut, droite: Ffact,
                      vars: ['a', 'b'], composites: true, env, modele }
        },
        {
          enonce: [donnees, 'احسب القيمة العددية للعبارة', 'G = ' + Gbrut],
          indice: 'انشر أوّلا: ستجد ab من جهة و ' + p + 'a + ' + q + 'b من جهة أخرى',
          etapes: [
            ['ننشر جداء القوسين', Gbrut + ' = ' + Gdev],
            ['نجمع المعطيات', 'ab = ' + prod + ' و ' + p + 'a + ' + q + 'b = ' + S],
            ['نعوّض', Gdev + ' = ' + prod + ' + ' + S + ' + ' + (p * q)],
            ['نحسب', prod + ' + ' + S + ' + ' + (p * q) + ' = ' + valG],
            ['النتيجة', 'G = ' + valG]
          ],
          controle: { type: 'identite', nom: 'G', gauche: Gbrut, droite: Gdev,
                      vars: ['a', 'b'], composites: true, env, modele }
        },
        {
          enonce: [donnees, 'جد العددين a و b علما أنّ الفرق بينهما يساوي ' + d],
          indice: 'اكتب a بدلالة b ثمّ عوّض في المعطى ' + p + 'a + ' + q + 'b = ' + S,
          etapes: [
            ['نترجم المعطى الجديد', 'a - b = ' + d + ' إذن a = b + ' + d],
            ['نعوّض في المساواة', p + '(b + ' + d + ') + ' + q + 'b = ' + S],
            ['ننشر', (p) + 'b + ' + (p * d) + ' + ' + q + 'b = ' + S],
            ['نجمع حدود b', (p + q) + 'b + ' + (p * d) + ' = ' + S],
            ['نعزل حدّ b', (p + q) + 'b = ' + S + ' - ' + (p * d)],
            ['نحسب b', 'b = ' + (S - p * d) + ' : ' + (p + q) + ' = ' + b],
            ['نحسب a', 'a = b + ' + d + ' = ' + a]
          ],
          controle: { type: 'systeme', p, q, S, d, a, b, env, modele }
        }
      ];
    }
    return typeNaturels();
  }

  const API = { typeReduire, typeDevelopper, typeFactoriser, typeComplet,
                typeEquations, typePerimetre, typeNaturels,
                equation, MODELES_EQ, ecrire, T, positif };
  if (M) module.exports = API;
  else racine.Litt = API;
})(typeof window !== 'undefined' ? window : globalThis);
