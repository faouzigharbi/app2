// Exercice 9 — les deux termes n'ont PAS la même base à l'écrit : 9^1020 doit
// d'abord s'écrire 3^2040. Une fois les bases unifiées, on met en facteur.
// Le diviseur demandé peut prendre une part dans la puissance et une part
// dans le crochet : 3^2013 × 10 est divisible par 15 = 3 × 5.
(function (racine) {
  'use strict';
  const A = (typeof module !== 'undefined' && module.exports) ? require('./arith.js') : racine.Arith;
  const O = (typeof module !== 'undefined' && module.exports) ? require('./outils.js') : racine.Outils;

  function tirage() {
    for (;;) {
      const b = A.choix([2, 3, 5, 7]);
      const [B, e] = A.choix(O.DEGUISEES[b]);          // 9 = 3^2, 125 = 5^3 …
      const k = A.ent(20, 600);
      const expDeguise = e * k;                         // 9^1020 -> 3^2040
      const ecart = A.ent(1, 4);
      const petit = expDeguise - ecart;                 // l'autre terme, plus bas
      if (petit < 10) continue;
      const c = A.ent(1, 12);
      if (c === b) continue;   // « 3 × 3^658 » s'écrirait plutôt 3^659
      const plus = Math.random() < 0.65;
      // Le terme déguisé est le plus grand : le crochet reste positif.
      const crochet = plus ? c + Math.pow(b, ecart) : Math.pow(b, ecart) - c;
      if (crochet < 3) continue;

      const dk = A.choix(O.diviseursUtiles(crochet).filter(d => d <= 200));
      if (!dk) continue;
      // Deux formes : le diviseur vient du seul crochet, ou il emprunte
      // aussi un facteur à la puissance.
      const avecBase = Math.random() < 0.5;
      const D = avecBase ? b * dk : dk;
      if (D < 3 || D > 300) continue;
      return { b, B, e, k, expDeguise, petit, ecart, c, plus, crochet, dk, avecBase, D };
    }
  }

  function f() {
    const t = tirage();
    const { b, B, e, k, expDeguise, petit, ecart, c, plus, crochet, dk, avecBase, D } = t;
    const gros = O.pui(B, k);
    const bas = (c === 1 ? '' : c + ' × ') + O.pui(b, petit);
    const expr = plus ? bas + ' + ' + gros : gros + ' - ' + bas;
    const dansCrochet = plus
      ? (c === 1 ? '1' : String(c)) + ' + ' + O.pui(b, ecart)
      : O.pui(b, ecart) + ' - ' + (c === 1 ? '1' : String(c));

    const etapes = [
      ['نوحّد الأساس', O.pui(B, k) + ' = ' + O.pui(b, expDeguise)],
      ['نضع أصغر قوّة في العامل',
        (plus ? bas + ' + ' + O.pui(b, expDeguise) : O.pui(b, expDeguise) + ' - ' + bas)
        + ' = ' + O.pui(b, petit) + ' × (' + dansCrochet + ')'],
      ['ننجز القوس', dansCrochet + ' = ' + crochet],
      ['نكتب على شكل جداء', 'A = ' + O.pui(b, petit) + ' × ' + crochet]
    ];
    if (avecBase) {
      etapes.push(['نفكّك القاسم', D + ' = ' + b + ' × ' + dk]);
      etapes.push(['نلاحظ', b + ' يقسم ' + O.pui(b, petit) + ' و ' + dk + ' يقسم ' + crochet]);
    } else {
      etapes.push([dk === crochet ? 'وهو المطلوب' : 'و ' + D + ' يقسم ' + crochet,
        dk === crochet ? 'A قابل للقسمة على ' + D : crochet + ' : ' + D + ' = ' + (crochet / D)]);
    }
    etapes.push(['النتيجة', '= ' + D]);

    return {
      enonce: 'بيّن أنّ العدد A = ' + expr + ' قابل للقسمة على ' + D + '.',
      indice: 'ابدأ بكتابة الحدّين بنفس الأساس',
      etapes,
      res: D,
      controle: { b, D, crochet,
        termes: plus ? [[c, petit], [1, expDeguise]] : [[1, expDeguise], [-c, petit]] }
    };
  }

  A.enregistrer(9, { titre: 'توحيد الأساس ثمّ العامل المشترك', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
