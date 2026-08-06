// Exercice 8 — deux termes de MÊME base. On met la plus petite puissance en
// facteur, et le crochet qui reste donne le diviseur.
//   2^18 - 2^15 = 2^15 × (2^3 - 1) = 2^15 × 7
(function (racine) {
  'use strict';
  const A = (typeof module !== 'undefined' && module.exports) ? require('./arith.js') : racine.Arith;
  const O = (typeof module !== 'undefined' && module.exports) ? require('./outils.js') : racine.Outils;

  // Un diviseur lisible : on préfère 7 ou 21 à 3088. Sinon le crochet entier.
  function joliDiviseur(v) {
    const t = O.diviseursUtiles(v);
    const petits = t.filter(d => d >= 3 && d <= 60);
    return petits.length ? A.choix(petits) : (t.length ? t[t.length - 1] : null);
  }

  function tirage() {
    for (;;) {
      // Variante « termes identiques » : b^n + b^n + b^n + b^n = 4 × b^n
      if (Math.random() < 0.25) {
        const b = A.choix([2, 3, 5, 7]);
        const n = A.ent(4, 400);
        const k = A.ent(3, 9);
        const D = joliDiviseur(k);
        if (!D) continue;
        return { forme: 'repete', b, n, k, crochet: k,
                 termes: Array.from({ length: k }, () => [1, n]), D };
      }
      const b = A.choix([2, 3, 5, 7]);
      const n = A.ent(10, 2000), d = A.ent(1, 4);
      const c = A.ent(1, 13);
      const plus = Math.random() < 0.5;
      // Le grand terme porte le coefficient : le crochet reste positif.
      const crochet = plus ? c * Math.pow(b, d) + 1 : c * Math.pow(b, d) - 1;
      if (crochet < 3) continue;
      const D = joliDiviseur(crochet);
      if (!D) continue;
      return { forme: 'deux', b, n, d, c, plus, crochet,
               termes: [[c, n + d], [plus ? 1 : -1, n]], D };
    }
  }

  function f() {
    const t = tirage();
    const { b, n, D, crochet } = t;

    if (t.forme === 'repete') {
      const terme = O.pui(b, n);
      const expr = Array.from({ length: t.k }, () => terme).join(' + ');
      return {
        enonce: 'بيّن أنّ العدد A = ' + expr + ' قابل للقسمة على ' + D + '.',
        indice: 'كم مرّة يتكرّر نفس الحد؟',
        etapes: [
          ['نلاحظ', 'الحدّ نفسه متكرّر ' + t.k + ' مرّات'],
          ['نكتب على شكل جداء', expr + ' = ' + t.k + ' × ' + terme],
          ['نستنتج', 'A مضاعف للعدد ' + t.k],
          [t.k === D ? 'وهو المطلوب' : 'و ' + D + ' يقسم ' + t.k,
            t.k === D ? 'A قابل للقسمة على ' + D : t.k + ' : ' + D + ' = ' + (t.k / D)],
          ['النتيجة', '= ' + D]
        ],
        res: D,
        controle: { b, termes: t.termes, D, crochet: t.k }
      };
    }

    const grand = (t.c === 1 ? '' : t.c + ' × ') + O.pui(b, n + t.d);
    const petit = O.pui(b, n);
    const expr = grand + (t.plus ? ' + ' : ' - ') + petit;
    const dansCrochet = (t.c === 1 ? '' : t.c + ' × ') + O.pui(b, t.d) + (t.plus ? ' + 1' : ' - 1');
    return {
      enonce: 'بيّن أنّ العدد A = ' + expr + ' قابل للقسمة على ' + D + '.',
      indice: 'ضع أصغر قوّة في العامل المشترك',
      etapes: [
        ['نلاحظ', 'الأساس نفسه في الحدّين: ' + b],
        ['نضع أصغر قوّة في العامل', expr + ' = ' + petit + ' × (' + dansCrochet + ')'],
        ['ننجز القوس', dansCrochet + ' = ' + crochet],
        ['نكتب على شكل جداء', 'A = ' + petit + ' × ' + crochet],
        [crochet === D ? 'وهو المطلوب' : 'و ' + D + ' يقسم ' + crochet,
          crochet === D ? 'A قابل للقسمة على ' + D : crochet + ' : ' + D + ' = ' + (crochet / D)],
        ['النتيجة', '= ' + D]
      ],
      res: D,
      controle: { b, termes: t.termes, D, crochet }
    };
  }

  A.enregistrer(8, { titre: 'نفس الأساس — العامل المشترك', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
