// Exercice 10 — TROIS termes, bases déguisées mélangées. Même geste : unifier
// les bases, mettre la plus petite puissance en facteur, lire le crochet.
//   2^3014 + 4^1506 + 9 × 8^1005 = 2^3012 × (2^2 + 1 + 9 × 2^3) = 2^3012 × 77
(function (racine) {
  'use strict';
  const A = (typeof module !== 'undefined' && module.exports) ? require('./arith.js') : racine.Arith;
  const O = (typeof module !== 'undefined' && module.exports) ? require('./outils.js') : racine.Outils;

  function tirage() {
    for (;;) {
      const b = A.choix([2, 3, 5]);
      const socle = A.ent(30, 900);          // exposant de la plus petite puissance
      const termes = [];
      for (let i = 0; i < 3; i++) {
        const ecart = i === 0 ? 0 : A.ent(1, 3);
        const exp = socle + ecart;
        const coef = A.ent(1, 9);
        // Un terme sur deux est écrit avec une base déguisée, quand l'exposant
        // s'y prête : 4^1506 plutôt que 2^3012.
        let base = b, k = exp, deguise = null;
        const cand = O.DEGUISEES[b].filter(([, e]) => exp % e === 0);
        if (cand.length && Math.random() < 0.6) {
          const [B, e] = A.choix(cand);
          base = B; k = exp / e; deguise = [B, e];
        }
        termes.push({ coef, exp, base, k, deguise });
      }
      const m = Math.min(...termes.map(t => t.exp));
      if (termes.filter(t => t.exp === m).length === 3) continue;   // tout au même étage
      const crochet = termes.reduce((s, t) => s + t.coef * Math.pow(b, t.exp - m), 0);
      if (crochet < 5 || crochet > 5000) continue;

      const dk = A.choix(O.diviseursUtiles(crochet).filter(d => d >= 3 && d <= 200));
      if (!dk) continue;
      const j = A.choix([0, 1, 2]);
      const D = Math.pow(b, j) * dk;
      if (D < 4 || D > 400) continue;
      return { b, socle: m, termes, crochet, dk, j, D };
    }
  }

  function f() {
    const t = tirage();
    const { b, socle, termes, crochet, dk, j, D } = t;
    const ecrire = x => (x.coef === 1 ? '' : x.coef + ' × ') + O.pui(x.base, x.k);
    const expr = termes.map(ecrire).join(' + ');
    const unifies = termes.filter(x => x.deguise);
    const dansCrochet = termes.map(x => {
      const p = x.exp - socle;
      if (p === 0) return String(x.coef);
      return (x.coef === 1 ? '' : x.coef + ' × ') + O.pui(b, p);
    }).join(' + ');

    const etapes = [];
    if (unifies.length) {
      etapes.push(['نوحّد الأساس',
        unifies.map(x => O.pui(x.base, x.k) + ' = ' + O.pui(b, x.exp)).join(' و ')]);
    }
    etapes.push(['نضع أصغر قوّة في العامل',
      termes.map(x => (x.coef === 1 ? '' : x.coef + ' × ') + O.pui(b, x.exp)).join(' + ')
      + ' = ' + O.pui(b, socle) + ' × (' + dansCrochet + ')']);
    etapes.push(['ننجز القوس', dansCrochet + ' = ' + crochet]);
    etapes.push(['نكتب على شكل جداء', 'A = ' + O.pui(b, socle) + ' × ' + crochet]);
    if (j > 0) {
      etapes.push(['نفكّك القاسم', D + ' = ' + Math.pow(b, j) + ' × ' + dk]);
      etapes.push(['نلاحظ', Math.pow(b, j) + ' يقسم ' + O.pui(b, socle)
        + ' و ' + dk + ' يقسم ' + crochet]);
    } else {
      etapes.push([dk === crochet ? 'وهو المطلوب' : 'و ' + D + ' يقسم ' + crochet,
        dk === crochet ? 'A قابل للقسمة على ' + D : crochet + ' : ' + D + ' = ' + (crochet / D)]);
    }
    etapes.push(['النتيجة', '= ' + D]);

    return {
      enonce: 'بيّن أنّ العدد A = ' + expr + ' قابل للقسمة على ' + D + '.',
      indice: 'وحّد الأسس ثمّ ضع أصغر قوّة في العامل',
      etapes,
      res: D,
      controle: { b, D, crochet, termes: termes.map(x => [x.coef, x.exp]) }
    };
  }

  A.enregistrer(10, { titre: 'ثلاثة حدود — توحيد الأساس', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
