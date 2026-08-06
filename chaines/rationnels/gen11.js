// 11 — Comparer sous l'hypothèse x > y.
//
// Là encore, aucune addition d'inégalités membre à membre : c'est de la 9e.
// On calcule la différence, qui devient une somme de deux nombres positifs —
// l'un vient de l'hypothèse traduite en (x − y) > 0, l'autre est numérique.
(function (racine) {
  'use strict';
  const F = (typeof module !== 'undefined' && module.exports) ? require('./frac.js') : racine.Frac;
  const suite = c => (c.n < 0 ? ' - ' + F.txt(F.neg(c)) : ' + ' + F.txt(c));

  function f() {
    let u, v;
    do {
      u = F.rat(F.ent(-15, 15), F.ent(2, 10));
      v = F.rat(F.ent(-15, 15), F.ent(2, 10));
    } while (F.cmp(u, v) <= 0);          // u > v : sans quoi on ne conclut rien

    const A = 'x' + suite(u), B = 'y' + suite(v);
    const reste = F.sub(u, v);           // strictement positif par construction
    const forme = '(x - y) + ' + F.txt(reste);

    return {
      enonce: ['ليكن x و y عددين كسريين نسبيين حيث x > y. قارن بين:', A + '  و  ' + B],
      indice: 'احسب الفرق ثمّ ادرس إشارته',
      etapes: [
        ['نحسب الفرق', '(' + A + ') - (' + B + ') = ' + forme],
        ['نترجم الفرضية ونحسب الثابت', 'x - y > 0 ; ' + F.txt(reste) + ' > 0'],
        ['القاعدة', 'مجموع عددين موجبين هو عدد موجب'],
        ['إشارة الفرق', forme + ' > 0'],
        ['النتيجة', A + ' > ' + B]
      ],
      res: A + ' > ' + B,
      controle: { type: 'litteral', vars: ['x', 'y'], contrainte: 'x > y',
                  claim: A + ' > ' + B }
    };
  }
  F.enregistrer(11, { titre: 'الفرق مع فرضية', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
