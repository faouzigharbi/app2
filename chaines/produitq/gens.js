// Les exercices de la leçon « الجداء و القسمة في ℚ », tirés des cinq devoirs
// de la المدرسة الإعدادية النموذجية ضفاف البحيرة.
//
// La partie algébrique de ces devoirs tourne toute entière autour de quatre
// gestes : multiplier en simplifiant d'abord, diviser en multipliant par
// l'inverse, développer, factoriser.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Produit;
  const P = M ? require('./produits.js') : racine.Produits;
  const { rat, add, sub, mul, div, neg, abs, signe, egaux, txt, par, ent, choix } = F;

  const nonNul = P.nonNul;
  // Une fraction « d'école » : jamais entière, numérateur et dénominateur
  // choisis pour qu'il y ait justement quelque chose à simplifier.
  // Des dénominateurs d'école : la fiche n'écrit jamais 5/17.
  const DEN = [2, 3, 4, 5, 6, 8, 10, 12];
  const frac = () => {
    let f;
    do { f = rat(nonNul(-15, 15), choix(DEN)); } while (f.d === 1);
    return f;
  };
  const simplifiable = () => {
    for (;;) {
      const g1 = ent(2, 6), g2 = ent(2, 6);
      const a = rat(g1 * nonNul(1, 4) * choix([1, -1]), g2 * ent(1, 4));
      const b = rat(g2 * nonNul(1, 4) * choix([1, -1]), g1 * ent(1, 4));
      if (a.d !== 1 && b.d !== 1 && P.pgcd(Math.abs(a.n), b.d) * P.pgcd(Math.abs(b.n), a.d) > 1) {
        return [a, b];
      }
    }
  };

  // --- 1 : quatre produits de deux fractions ------------------------------
  F.enregistrer(1, { titre: 'جداء كسرين — نبسّط قبل أن نضرب', questions: 4, f() {
    return [0, 1, 2, 3].map(() => P.produit(simplifiable()));
  } });

  // --- 2 : trois produits de trois fractions ------------------------------
  F.enregistrer(2, { titre: 'جداء ثلاثة كسور', questions: 3, f() {
    return [0, 1, 2].map(() => {
      const [a, b] = simplifiable();
      return P.produit([a, b, frac()]);
    });
  } });

  // --- 3 : division et fractions étagées ----------------------------------
  F.enregistrer(3, { titre: 'القسمة و الكسور المتراكبة', questions: 4, f() {
    const [a, b] = simplifiable();
    const [c, d] = simplifiable();
    const e1 = rat(nonNul(1, 9), ent(2, 9)), e2 = rat(nonNul(1, 9), ent(2, 9));
    const n1 = ent(1, 6), n2 = ent(2, 9), n3 = ent(1, 6), n4 = ent(2, 9);
    return [
      P.quotient(a, b), P.quotient(c, d),
      P.etagee(null, null, txt(e1), txt(e2)),
      P.etagee(null, null, n1 + ' - ' + n2 + '/' + (n2 + 1), n3 + ' + ' + n4 + '/' + (n4 + 3))
    ];
  } });

  // --- 4 : développer k(ax + b) -------------------------------------------
  F.enregistrer(4, { titre: 'أنشر ثمّ اختصر — جداء عدد في قوس', questions: 3, f() {
    const v = choix(['x', 'y', 'a']);
    const un = () => {
      for (;;) {
        const blocs = [
          { k: frac(), a: rat(nonNul(1, 9)), b: frac() },
          { k: frac(), a: rat(nonNul(1, 9)), b: frac() }
        ];
        const A = blocs.reduce((r, m) => add(r, mul(m.k, m.a)), rat(0));
        const B = blocs.reduce((r, m) => add(r, mul(m.k, m.b)), rat(0));
        if (A.n !== 0 || B.n !== 0) return P.developper(choix(['X', 'Y', 'Z']), v, blocs);
      }
    };
    return [un(), un(), un()];
  } });

  // --- 5 : produit de deux parenthèses ------------------------------------
  F.enregistrer(5, { titre: 'جداء قوسين — لا تنسَ المربّع', questions: 3, f() {
    const v = 'x';
    const un = () => {
      const p = rat(nonNul(1, 4)), q = rat(nonNul(-6, 6));
      const r = rat(nonNul(-4, 4)), t = rat(nonNul(-6, 6));
      const reste = Math.random() < 0.6
        ? { k: rat(ent(2, 5)), a: rat(nonNul(-4, 4)), b: rat(nonNul(-5, 5)) } : null;
      return P.produitBinomes(choix(['F', 'C', 'T']), v, p, q, r, t, reste);
    };
    return [un(), un(), un()];
  } });

  // --- 6 : factoriser ------------------------------------------------------
  F.enregistrer(6, { titre: 'فكّك إلى جداء عوامل', questions: 4, f() {
    const un = () => {
      let k, a, b;
      do { k = frac(); a = rat(nonNul(1, 6)); b = rat(nonNul(-9, 9)); }
      while (egaux(abs(k), rat(1)));
      return P.factoriser(choix(['E', 'G', 'H', 'J']), choix(['x', 'y']), k, a, b);
    };
    return [un(), un(), un(), un()];
  } });
})(typeof window !== 'undefined' ? window : globalThis);
