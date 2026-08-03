// 9 — Ajouter le même nombre aux deux membres conserve l'ordre. Aucun calcul
// sur la variable : seuls les deux nombres ajoutés se comparent.
(function (racine) {
  'use strict';
  const F = (typeof module !== 'undefined' && module.exports) ? require('./frac.js') : racine.Frac;
  const signe = c => (c.n < 0 ? ' - ' + F.txt(F.neg(c)) : ' + ' + F.txt(c));

  function f() {
    let u, v;
    do {
      u = F.rat(F.ent(-15, 15), F.ent(2, 12));
      v = F.rat(F.ent(-15, 15), F.ent(2, 12));
    } while (F.cmp(u, v) === 0);
    const x = F.choix(['a', 'b', 'x']);
    const A = x + signe(u), B = x + signe(v);
    const op = F.cmp(u, v) < 0 ? '<' : '>';
    return {
      enonce: ['ليكن ' + x + ' عددا كسريا نسبيا. قارن بين:', A + '  و  ' + B],
      indice: 'قارن العددين المضافين فقط',
      etapes: [
        ['نلاحظ', 'الحدّ نفسه في العبارتين'],
        ['نقارن العددين المضافين', F.txt(u) + ' ' + op + ' ' + F.txt(v)],
        ['القاعدة', 'إضافة نفس العدد إلى طرفَي متفاوتة تحفظ الترتيب'],
        ['النتيجة', A + ' ' + op + ' ' + B]
      ],
      res: A + ' ' + op + ' ' + B,
      controle: { type: 'litteral', vars: [x], claim: A + ' ' + op + ' ' + B }
    };
  }
  F.enregistrer(9, { titre: 'إضافة نفس العدد', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
