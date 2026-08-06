// 12 — Calculer une expression à partir d'une relation donnée, sans jamais
// trouver x ni y : on fait apparaître la relation en facteur.
(function (racine) {
  'use strict';
  const F = (typeof module !== 'undefined' && module.exports) ? require('./frac.js') : racine.Frac;
  const terme = (c, v) => (c === 1 ? v : c === -1 ? '-' + v : c + v);
  const suite = (c, v) => (c < 0 ? ' - ' + terme(-c, v) : ' + ' + terme(c, v));
  const cst = c => (c < 0 ? ' - ' + (-c) : ' + ' + c);

  function f() {
    const p = F.ent(1, 4), q = F.ent(1, 4), m = F.ent(2, 5);
    const c = F.ent(-12, 12);
    if (c === 0) return f();
    let k;
    do { k = F.rat(F.ent(-20, 20), F.ent(2, 9)); } while (k.n === 0);  // sinon l'exercice est vide
    const relation = terme(p, 'x') + suite(q, 'y') + ' = ' + F.txt(k);
    const expr = terme(m * p, 'x') + suite(m * q, 'y') + cst(c);
    const partie = terme(m * p, 'x') + suite(m * q, 'y');
    const dedans = terme(p, 'x') + suite(q, 'y');
    const produit = F.mul(F.rat(m), k);
    const total = F.add(produit, F.rat(c));

    return {
      enonce: ['ليكن x و y عددين كسريين نسبيين حيث ' , relation,
               '. احسب العبارة:', 'A = ' + expr],
      indice: 'أظهر المعطى داخل العبارة',
      etapes: [
        ['نُظهر العامل المشترك', partie + ' = ' + m + ' × (' + dedans + ')'],
        ['نعوّض بالمعطى', m + ' × (' + F.txt(k) + ') = ' + F.txt(produit)],
        ['نضيف الحدّ الثابت', F.txt(produit) + cst(c) + ' = ' + F.txt(total)],
        ['النتيجة', '= ' + F.txt(total)]
      ],
      res: F.txt(total),
      controle: { type: 'relation', p, q, m, c, k: F.txt(k), total: F.txt(total),
                  egalite: partie + ' = ' + m + ' × (' + dedans + ')' }
    };
  }
  F.enregistrer(12, { titre: 'حساب عبارة انطلاقا من علاقة', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
