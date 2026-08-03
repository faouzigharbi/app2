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
    const modele = choix(['deux', 'trois', 'litteral']);
    const lettres = modele === 'litteral'
      ? [choix(['xy', 'xyz', 'xyt']), choix(['xy', 'xyz', 'xyt'])]
      : ['a', 'b'];
    const n = modele === 'deux' ? 2 : 3;
    let coefs, g, m, parts;
    for (;;) {
      coefs = [];
      for (let i = 0; i < n; i++) {
        coefs.push(rat(nonNul(-9, 9) * ent(2, 6), ent(2, 12)));
      }
      g = coefs.map(c => Math.abs(c.n)).reduce(pgcd);
      m = coefs.map(c => c.d).reduce(ppcm);
      const commun = rat(g, m);
      parts = coefs.map(c => div(c, commun));
      if (g > 1 && parts.every(p => p.d === 1) && !egaux(abs(commun), rat(1))) break;
    }
    const commun = rat(g, m);
    const noms = modele === 'litteral'
      ? [choix(['xy']), choix(['xyz']), choix(['xyt'])].slice(0, n)
      : ['a', 'b', 'c'].slice(0, n);
    const brut = joindre(coefs.map((c, i) => mono(c, noms[i])));
    const dedans = joindre(parts.map((p, i) => mono(p, noms[i])));
    const fact = par(commun) + '(' + dedans + ')';
    return {
      enonce: ['فكّك إلى جداء عوامل:', 'A = ' + brut],
      indice: 'العامل المشترك هو ق.م.أ للبسوط على م.م.أ للمقامات',
      etapes: [
        ['ق.م.أ للبسوط', 'ق.م.أ(' + coefs.map(c => Math.abs(c.n)).join(' ؛ ') + ') = ' + g],
        ['م.م.أ للمقامات', 'م.م.أ(' + coefs.map(c => c.d).join(' ؛ ') + ') = ' + m],
        ['العامل المشترك', 'العامل المشترك هو ' + txt(commun)],
        ['نقسم كل حدّ عليه', coefs.map((c, i) => par(c) + ' : ' + par(commun) + ' = '
          + txt(parts[i])).join(' و ')],
        ['نكتب الجداء', 'A = ' + fact],
        ['نتحقّق بالنشر', fact + ' = ' + brut]
      ],
      controle: { type: 'identite', nom: 'A', gauche: brut, droite: fact,
                  vars: noms.slice(), modele }
    };
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
