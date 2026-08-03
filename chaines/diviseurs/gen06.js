// 6 — Racine carrée d'un PRODUIT, comme √(5 × a × c) de la fiche. Chaque
// facteur pris seul n'est pas un carré ; c'est leur produit qui l'est.
(function (racine) {
  'use strict';
  const A = (typeof module !== 'undefined' && module.exports) ? require('./arith.js') : racine.Arith;
  const O = (typeof module !== 'undefined' && module.exports) ? require('./outils.js') : racine.Outils;

  function tirage() {
    for (;;) {
      const base = O.tirerFacteurs(2, 1, 3, 500, [2, 3, 5, 7]);
      const R = O.valeur(base);
      if (R < 40 || R > 500) continue;
      const S = R * R;
      const k = A.choix(A.facteurs(S).map(([p]) => p));   // un premier de S
      const T = S / k;
      const cand = A.diviseurs(T).filter(c => c >= 15 && c <= 300 && T / c >= 40 && T / c <= 3000);
      if (!cand.length) continue;
      const c = A.choix(cand), a = T / c;
      // R égal à a ou à c donnerait un énoncé déroutant.
      if (a === c || a === k || c === k || R === a || R === c) continue;
      return { k, a, c, R, S };
    }
  }

  function f() {
    const { k, a, c, R, S } = tirage();
    const facS = A.facteurs(S);
    const base = O.racineK(facS, 2);
    return {
      enonce: 'نعتبر a = ' + a + ' و c = ' + c + '. احسب ' + '√' + '(' + k + ' × a × c) بالتفكيك إلى جداء عوامل أوّلية.',
      indice: 'فكّك كلّ عدد ثمّ اجمع الأسس',
      etapes: [
        ['نفكّك كلّ عدد', A.decomposer(a) + ' و ' + A.decomposer(c)],
        ['نحسب الجداء', k + ' × ' + a + ' × ' + c + ' = ' + A.ecrire(facS)],
        ['نلاحظ', 'كلّ الأسس زوجية'],
        ['نكتب على شكل مربّع', A.ecrire(facS) + ' = (' + A.ecrire(base) + ')^2'],
        ['نحسب الأساس', A.ecrire(base) + ' = ' + R],
        ['الجذر التربيعي', '= ' + R]
      ],
      res: R,
      controle: { type: 'racine-produit', k, a, c, R, S }
    };
  }
  A.enregistrer(6, { titre: 'الجذر التربيعي لجداء', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
