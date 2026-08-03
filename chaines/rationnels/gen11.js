// 11 — Déduire d'une hypothèse. On ajoute membre à membre deux inégalités de
// même sens : x > y et u > v donnent x + u > y + v.
(function (racine) {
  'use strict';
  const F = (typeof module !== 'undefined' && module.exports) ? require('./frac.js') : racine.Frac;
  const signe = c => (c.n < 0 ? ' - ' + F.txt(F.neg(c)) : ' + ' + F.txt(c));

  function f() {
    let u, v;
    do {
      u = F.rat(F.ent(-15, 15), F.ent(2, 10));
      v = F.rat(F.ent(-15, 15), F.ent(2, 10));
    } while (F.cmp(u, v) <= 0);          // il faut u > v pour pouvoir conclure

    const A = 'x' + signe(u), B = 'y' + signe(v);
    return {
      enonce: ['ليكن x و y عددين كسريين نسبيين حيث x > y. قارن بين:', A + '  و  ' + B],
      indice: 'اجمع المتفاوتتين طرفا بطرف',
      etapes: [
        ['المعطى', 'x > y'],
        ['نقارن الحدّين المضافين', F.txt(u) + ' > ' + F.txt(v)],
        ['القاعدة', 'جمع متفاوتتين في نفس الاتجاه طرفا بطرف يحفظ الاتجاه'],
        ['النتيجة', A + ' > ' + B]
      ],
      res: A + ' > ' + B,
      controle: { type: 'litteral', vars: ['x', 'y'], contrainte: 'x > y',
                  claim: A + ' > ' + B }
    };
  }
  F.enregistrer(11, { titre: 'الاستنتاج من فرضية', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
