// Les cinq TYPES de factorisation de la fiche « التفكيك في مجموعة الأعداد
// الكسرية النسبية » (ضفاف البحيرة, 2021).
//
// Une page par type ; à l'intérieur d'un type, le générateur tire parmi
// plusieurs MODÈLES, comme la fiche le fait sur une même ligne. L'élève
// rencontre ainsi la même méthode sous ses différents habillages, ce qui
// est justement ce qu'un exercice papier ne peut pas offrir.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Fact;
  const { rat, add, sub, mul, div, neg, abs, signe, egaux, txt, par, ent, choix } = F;

  const nonNul = (a, b) => { let v; do { v = ent(a, b); } while (v === 0); return v; };
  const pgcd = (a, b) => (b ? pgcd(b, a % b) : Math.abs(a));
  const ppcm = (a, b) => a / pgcd(a, b) * b;

  // -------------------------------------------------------------------------
  // Écriture : monômes, binômes, et le produit de deux binômes.
  // -------------------------------------------------------------------------
  const mono = (c, lit) => {
    if (c.n === 0) return null;
    const t = (egaux(abs(c), rat(1)) && lit) ? '' : txt(abs(c));
    return (signe(c) < 0 ? '-' : '') + t + (lit || '');
  };
  const joindre = ts => {
    const l = ts.filter(Boolean);
    if (!l.length) return '0';
    return l.map((t, i) => i === 0 ? t
      : (t[0] === '-' ? ' - ' + t.slice(1) : ' + ' + t)).join('');
  };
  // Un binôme a·x + b, et sa lecture
  const bin = (u, v) => joindre([mono(u.a, v), mono(u.b, null)]);
  const somme = (u, w) => ({ a: add(u.a, w.a), b: add(u.b, w.b) });
  const oppose = u => ({ a: neg(u.a), b: neg(u.b) });
  const echelle = (k, u) => ({ a: mul(k, u.a), b: mul(k, u.b) });
  const nul = u => u.a.n === 0 && u.b.n === 0;
  // Le produit de deux binômes, écrit en toutes lettres
  const quad = (u, w, v) => joindre([
    mono(mul(u.a, w.a), v + '^2'),
    mono(add(mul(u.a, w.b), mul(u.b, w.a)), v),
    mono(mul(u.b, w.b), null)]);
  const par2 = u => '(' + bin(u, 'x') + ')';

  // =========================================================================
  // TYPE 1 — le facteur commun est un NOMBRE. Il ne se devine pas : c'est le
  // PGCD des numérateurs sur le PPCM des dénominateurs.
  // =========================================================================
  function typeNumerique() {
    const modele = choix(['deux', 'constante', 'troisAvecConstante', 'litteral']);
    // On part de la RÉPONSE : un facteur commun simple et de petites parts.
    // C'est ainsi que la fiche est faite — « 16/15 a + 8/5 b » vient de
    // « 8/15 (2a + 3b) », et non l'inverse. Tirer les coefficients au hasard
    // donnerait des nombres qu'aucun professeur n'écrirait.
    const petitsPremiersEntreEux = n => {
      for (;;) {
        const k = Array.from({ length: n }, () => nonNul(-9, 9));
        if (k.map(Math.abs).reduce(pgcd) === 1) return k;
      }
    };
    for (let essai = 0; essai < 500; essai++) {
      const c = rat(ent(2, 12), ent(2, 15));
      if (c.d === 1 || egaux(abs(c), rat(1))) continue;
      const n = modele === 'deux' || modele === 'constante' ? 2 : 3;
      const parts = petitsPremiersEntreEux(n);
      const coefs = parts.map(k => mul(c, rat(k)));

      // Le facteur commun ANNONCÉ doit être celui que la méthode donne :
      // PGCD des numérateurs sur PPCM des dénominateurs. On le recalcule
      // depuis les coefficients affichés, et on rejette le tirage s'il ne
      // retombe pas sur celui qu'on avait en tête.
      const g = coefs.map(x => Math.abs(x.n)).reduce(pgcd);
      const m = coefs.map(x => x.d).reduce(ppcm);
      const commun = rat(g, m);
      if (!egaux(commun, abs(c))) continue;
      // Si tous les dénominateurs sont égaux, le PPCM est une étape vide.
      // La fiche n'écrit jamais cela : 15 et 5, 7 et 35, 49, 35 et 70…
      if (new Set(coefs.map(x => x.d)).size < 2) continue;

      // Les parties littérales : rien, une lettre, ou un monôme partagé.
      let lit, litCommun = '', restes;
      if (modele === 'deux') {
        lit = ['a', 'b']; restes = lit.slice();
      } else if (modele === 'constante') {
        lit = ['', choix(['xy', 'ab'])]; restes = lit.slice();
      } else if (modele === 'troisAvecConstante') {
        lit = ['x', 'y', '']; restes = lit.slice();
      } else {
        // I = 12/49 xy - 24/35 xyz + 36/70 xyt : le facteur commun porte
        // AUSSI une partie littérale, et c'est elle qu'on oublie.
        litCommun = 'xy';
        const sup = ['', 'z', 't'];
        lit = sup.map(e => litCommun + e);
        restes = sup.map(e => e || '1');
      }
      const signes = parts.map((k, i) => mul(rat(Math.sign(k)), abs(coefs[i])));
      const brut = joindre(coefs.map((x, i) => mono(x, lit[i] || null)));
      const dedans = joindre(parts.map((k, i) => {
        const r = restes[i];
        return mono(rat(k), r === '1' ? null : r);
      }));
      const fact = par(commun) + (litCommun ? ' ' + litCommun : '')
        + '(' + dedans + ')';
      // Pas de parenthèse qui enjambe du texte arabe : elle se retournerait.
      // « م.م.أ(15 ؛ 5) = 15 » s'affiche « م.م.أ(15 ؛ 5) = 15) ».
      const etapes = [
        ['ق.م.أ للبسوط', 'البسوط هي ' + coefs.map(x => Math.abs(x.n)).join(' ؛ ')
         + ' و ق.م.أ لها يساوي ' + g],
        ['م.م.أ للمقامات', 'المقامات هي ' + coefs.map(x => x.d).join(' ؛ ')
         + ' و م.م.أ لها يساوي ' + m],
        ['العامل المشترك العددي', 'العامل العددي هو ' + txt(commun)]
      ];
      if (litCommun) {
        etapes.push(['العامل المشترك الحرفي',
          'كل الحدود تحتوي ' + litCommun + '، فهو أيضا عامل مشترك']);
      }
      etapes.push(['نقسم كل حدّ على العامل',
        coefs.map((x, i) => par(x) + ' : ' + par(commun) + ' = ' + parts[i]).join(' و ')]);
      etapes.push(['نكتب الجداء', 'A = ' + fact]);
      etapes.push(['نتحقّق بالنشر', fact + ' = ' + brut]);

      return {
        enonce: ['فكّك إلى جداء عوامل:', 'A = ' + brut],
        indice: litCommun
          ? 'العامل المشترك عددي و حرفي معا: لا تنسَ الجزء الحرفي'
          : 'العامل المشترك هو ق.م.أ للبسوط على م.م.أ للمقامات',
        etapes,
        controle: { type: 'identite', nom: 'A', gauche: brut, droite: fact,
                    vars: ['x', 'y', 'z', 't', 'a', 'b'], composites: true, modele }
      };
    }
    return typeNumerique();
  }

  // =========================================================================
  // TYPE 2 — le facteur commun est un BINÔME, et il se voit.
  // =========================================================================
  function typeBinomeVisible() {
    const modele = choix(['somme', 'moinsUn', 'carre', 'trois']);
    const b = () => ({ a: rat(nonNul(-9, 9), ent(1, 6)), b: rat(nonNul(-9, 9), ent(1, 6)) });
    for (;;) {
      const U = b(), V = b(), W = b();
      let brut, dedans;
      if (modele === 'somme') {
        brut = par2(U) + par2(V) + ' + ' + par2(U) + par2(W);
        dedans = somme(V, W);
      } else if (modele === 'moinsUn') {
        brut = par2(U) + par2(V) + ' - ' + par2(U);
        dedans = somme(V, { a: rat(0), b: rat(-1) });
      } else if (modele === 'carre') {
        brut = par2(U) + par2(V) + ' + ' + par2(U) + '^2';
        dedans = somme(V, U);
      } else {
        brut = par2(U) + par2(V) + ' - ' + par2(U) + par2(W) + ' + ' + par2(U);
        dedans = somme(somme(V, oppose(W)), { a: rat(0), b: rat(1) });
      }
      if (nul(dedans) || nul(U)) continue;
      const fact = par2(U) + '(' + bin(dedans, 'x') + ')';
      const vu = modele === 'carre'
        ? 'القوس ' + par2(U) + ' موجود مرّة وحده و مرّة مربّعا'
        : 'القوس ' + par2(U) + ' موجود في كل الحدود';
      return {
        enonce: ['فكّك إلى جداء عوامل:', 'A = ' + brut],
        indice: 'ابحث عن القوس الذي يتكرّر، ثمّ ضعه أمام قوس جديد',
        etapes: [
          ['نلاحظ العامل المشترك', vu],
          ['القاعدة', 'kU + kV = k(U + V) حيث k قوس هنا'],
          ['نجمع ما تبقّى داخل قوس', 'ما تبقّى: ' + bin(dedans, 'x')],
          ['نكتب الجداء', 'A = ' + fact],
          ['نتحقّق بالنشر', fact + ' = ' + brut]
        ],
        controle: { type: 'identite', nom: 'A', gauche: brut, droite: fact,
                    vars: ['x'], modele }
      };
    }
  }

  // =========================================================================
  // TYPE 3 — le facteur commun est CACHÉ : il faut d'abord le faire paraître,
  // en retournant un opposé, en sortant un coefficient, ou en reconnaissant
  // une queue d'expression.
  // =========================================================================
  function typeBinomeCache() {
    const modele = choix(['oppose', 'coefficient', 'queue']);
    const b = () => ({ a: rat(nonNul(-9, 9), ent(1, 6)), b: rat(nonNul(-9, 9), ent(1, 6)) });
    for (;;) {
      const U = b(), V = b();
      const k = rat(nonNul(-6, 6), ent(1, 4));
      if (nul(U)) continue;
      let brut, dedans, revele, vu;
      if (modele === 'oppose') {
        // V·U − k·(−U)  écrit avec (−U) développé : on retourne le signe.
        const mU = oppose(U);
        brut = par2(V) + par2(U) + ' - ' + par(k) + par2(mU);
        revele = par2(mU) + ' = -' + par2(U);
        dedans = somme(V, echelle(k, { a: rat(1), b: rat(0) }).a.n === 0 ? V : V);
        dedans = somme(V, { a: k.n === 0 ? rat(0) : rat(0), b: k });
        vu = 'القوسان متقابلان: ' + par2(mU) + ' هو مقابل ' + par2(U);
      } else if (modele === 'coefficient') {
        // V·U − (λ·U)·W : on sort λ pour faire réapparaître U.
        const lam = rat(nonNul(2, 5));
        const lU = echelle(lam, U);
        const W = b();
        brut = par2(V) + par2(U) + ' - ' + par2(lU) + par2(W);
        revele = par2(lU) + ' = ' + txt(lam) + par2(U);
        dedans = somme(V, oppose(echelle(lam, W)));
        vu = 'نُخرج ' + txt(lam) + ' من القوس الثاني ليظهر ' + par2(U);
      } else {
        // k·x·U + (queue), où la queue vaut λ·U : il faut la reconnaître.
        const lam = rat(nonNul(-5, 5), ent(1, 3));
        const q = echelle(lam, U);
        brut = par(k) + 'x' + par2(U) + ' + ' + bin(q, 'x');
        revele = bin(q, 'x') + ' = ' + txt(lam) + par2(U);
        dedans = { a: k, b: lam };
        vu = 'ما بعد الجداء هو ' + txt(lam) + ' مضروبا في ' + par2(U);
      }
      if (nul(dedans)) continue;
      const fact = par2(U) + '(' + bin(dedans, 'x') + ')';
      // On ne publie que si l'identité tient vraiment.
      const t = { x: rat(7, 3) };
      if (!egaux(F.analyser(brut.replace(/\)\(/g, ')*('), t),
                 F.analyser(fact.replace(/\)\(/g, ')*('), t))) continue;
      return {
        enonce: ['فكّك إلى جداء عوامل:', 'A = ' + brut],
        indice: 'العامل المشترك ليس ظاهرا: أظهره أوّلا',
        etapes: [
          ['العامل المشترك غير ظاهر', vu],
          ['نُظهره', revele],
          ['نعيد كتابة العبارة', 'A = ' + par2(U) + ' × [' + bin(dedans, 'x') + ']'],
          ['نكتب الجداء', 'A = ' + fact],
          ['نتحقّق بالنشر', fact + ' = ' + brut]
        ],
        controle: { type: 'identite', nom: 'A', gauche: brut, droite: fact,
                    vars: ['x'], modele }
      };
    }
  }

  // =========================================================================
  // TYPE 4 — l'ÉQUATION PRODUIT. On ne développe surtout pas : on factorise,
  // et un produit est nul si et seulement si l'un de ses facteurs l'est.
  // =========================================================================
  function typeEquationProduit() {
    const modele = choix(['somme', 'moinsUn', 'queue']);
    const b = () => ({ a: rat(nonNul(-9, 9), ent(1, 5)), b: rat(nonNul(-9, 9), ent(1, 5)) });
    for (;;) {
      const U = b(), V = b();
      let brut, dedans;
      if (modele === 'somme') {
        const W = b();
        brut = par2(U) + par2(V) + ' + ' + par2(U) + par2(W);
        dedans = somme(V, W);
      } else if (modele === 'moinsUn') {
        brut = par2(U) + par2(V) + ' - ' + par2(U);
        dedans = somme(V, { a: rat(0), b: rat(-1) });
      } else {
        const lam = rat(nonNul(-5, 5), ent(1, 3));
        const q = echelle(lam, U);
        brut = par2(U) + par2(V) + ' + ' + bin(q, 'x');
        dedans = somme(V, { a: rat(0), b: lam });
      }
      if (U.a.n === 0 || dedans.a.n === 0) continue;
      const x1 = div(neg(U.b), U.a), x2 = div(neg(dedans.b), dedans.a);
      if (egaux(x1, x2)) continue;
      const fact = par2(U) + '(' + bin(dedans, 'x') + ')';
      return {
        enonce: ['جد العدد الكسري النسبي x بحيث:', brut + ' = 0'],
        indice: 'لا تنشر: فكّك أوّلا، فالمعادلة تصبح جداء منعدما',
        etapes: [
          ['نفكّك بدل أن ننشر', brut + ' = ' + fact],
          ['القاعدة', 'جداء منعدم يعني أنّ أحد عامليه منعدم على الأقلّ'],
          ['نكتب الحالتين', bin(U, 'x') + ' = 0  أو  ' + bin(dedans, 'x') + ' = 0'],
          ['الحلّ الأول', 'x = ' + txt(x1)],
          ['الحلّ الثاني', 'x = ' + txt(x2)],
          ['النتيجة', 'للمعادلة حلاّن: ' + txt(x1) + ' و ' + txt(x2)]
        ],
        controle: { type: 'equation-produit', gauche: brut, fact, x1, x2, modele }
      };
    }
  }

  // =========================================================================
  // TYPE 5 — l'exercice complet : développer, calculer, factoriser, résoudre.
  // Les quatre gestes sur UNE MÊME expression, comme dans la fiche.
  // =========================================================================
  function typeComplet() {
    const modele = choix(['carre', 'produitSimple']);
    const b = () => ({ a: rat(nonNul(-9, 9), ent(1, 5)), b: rat(nonNul(-9, 9), ent(1, 5)) });
    for (;;) {
      const U = b(), V = b();
      const dedans = modele === 'carre' ? somme(V, oppose(U)) : somme(V, { a: rat(0), b: rat(-1) });
      const brut = modele === 'carre'
        ? par2(U) + par2(V) + ' - ' + par2(U) + '^2'
        : par2(U) + par2(V) + ' - ' + par2(U);
      if (nul(dedans) || U.a.n === 0 || dedans.a.n === 0) continue;
      const dev = modele === 'carre'
        ? quad(U, somme(V, oppose(U)), 'x') : quad(U, dedans, 'x');
      const x0 = rat(nonNul(-6, 6), ent(1, 3));
      const val = F.analyser(brut.replace(/\)\(/g, ')*('), { x: x0 });
      const fact = par2(U) + '(' + bin(dedans, 'x') + ')';
      const x1 = div(neg(U.b), U.a), x2 = div(neg(dedans.b), dedans.a);
      if (egaux(x1, x2)) continue;
      return [
        {
          enonce: ['أنشر ثمّ اختصر:', 'E = ' + brut],
          indice: 'انشر كل جداء، ثمّ اجمع الحدود المتشابهة',
          etapes: [
            ['القاعدة', 'جداء قوسين يعطي أربعة جداءات'],
            ['ننشر', brut + ' = ' + par2(U) + ' × [' + bin(dedans, 'x') + ']'],
            ['نضرب القوسين', par2(U) + par2(dedans) + ' = ' + dev],
            ['النتيجة', 'E = ' + dev]
          ],
          controle: { type: 'identite', nom: 'E', gauche: brut, droite: dev, vars: ['x'], modele }
        },
        {
          enonce: ['احسب', 'E', 'إذا كان', 'x = ' + txt(x0), 'حيث', 'E = ' + dev],
          indice: 'عوّض في الشكل المنشور، أو في الشكل المفكّك: النتيجة واحدة',
          etapes: [
            ['نعوّض في الشكل المنشور', 'E = ' + dev.replace(/x/g, '(' + txt(x0) + ')')],
            ['نحسب', 'E = ' + txt(val)],
            ['نتحقّق بالشكل المفكّك', fact.replace(/x/g, '(' + txt(x0) + ')') + ' = ' + txt(val)],
            ['النتيجة', 'E = ' + txt(val)]
          ],
          controle: { type: 'valeur', gauche: brut, x0, val }
        },
        {
          enonce: ['فكّك إلى جداء عوامل:', 'E = ' + brut],
          indice: 'القوس ' + par2(U) + ' موجود في الحدّين',
          etapes: [
            ['نلاحظ العامل المشترك', 'القوس ' + par2(U) + ' موجود في الحدّين'],
            ['نجمع ما تبقّى', 'ما تبقّى: ' + bin(dedans, 'x')],
            ['نكتب الجداء', 'E = ' + fact],
            ['نتحقّق بالنشر', fact + ' = ' + brut]
          ],
          controle: { type: 'identite', nom: 'E', gauche: brut, droite: fact, vars: ['x'], modele }
        },
        {
          enonce: ['جد العدد الكسري النسبي x بحيث:', 'E = 0', 'حيث', 'E = ' + fact],
          indice: 'استعمل الشكل المفكّك: جداء منعدم',
          etapes: [
            ['نستعمل الشكل المفكّك', 'E = ' + fact],
            ['القاعدة', 'جداء منعدم يعني أنّ أحد عامليه منعدم على الأقلّ'],
            ['نكتب الحالتين', bin(U, 'x') + ' = 0  أو  ' + bin(dedans, 'x') + ' = 0'],
            ['الحلّ الأول', 'x = ' + txt(x1)],
            ['الحلّ الثاني', 'x = ' + txt(x2)],
            ['النتيجة', 'للمعادلة حلاّن: ' + txt(x1) + ' و ' + txt(x2)]
          ],
          controle: { type: 'equation-produit', gauche: brut, fact, x1, x2, modele, nom: 'E' }
        }
      ];
    }
  }

  const API = { typeNumerique, typeBinomeVisible, typeBinomeCache,
                typeEquationProduit, typeComplet, bin, par2, joindre, mono };
  if (M) module.exports = API;
  else racine.Facto = API;
})(typeof window !== 'undefined' ? window : globalThis);
