// 9 — Deux expressions portant le même inconnu.
//
// PAS de propriété de l'ordre — « ajouter le même nombre conserve l'ordre »
// est au programme de 9e. En 8e on compare TOUJOURS par le signe de la
// différence. Ici l'inconnu s'élimine de lui-même dans la soustraction, et
// c'est précisément ce que la chaîne doit montrer.
(function (racine) {
  'use strict';
  const F = (typeof module !== 'undefined' && module.exports) ? require('./frac.js') : racine.Frac;
  const suite = c => (c.n < 0 ? ' - ' + F.txt(F.neg(c)) : ' + ' + F.txt(c));

  function f() {
    let u, v;
    do {
      u = F.rat(F.ent(-15, 15), F.ent(2, 12));
      v = F.rat(F.ent(-15, 15), F.ent(2, 12));
    } while (F.cmp(u, v) === 0);

    const x = F.choix(['a', 'b', 'x']);
    const A = x + suite(u), B = x + suite(v);
    const diff = F.sub(u, v);
    const op = F.signe(diff) < 0 ? '<' : '>';
    // « 1/2 - (-2/3) » : la parenthèse est obligatoire quand v est négatif.
    const ecrireV = v.n < 0 ? '(' + F.txt(v) + ')' : F.txt(v);

    return {
      enonce: ['ليكن ' + x + ' عددا كسريا نسبيا. قارن بين:', A + '  و  ' + B],
      indice: 'احسب الفرق: المجهول يختفي',
      etapes: [
        ['نحسب الفرق', '(' + A + ') - (' + B + ') = ' + F.txt(u) + ' - ' + ecrireV],
        ['يختفي المجهول', F.txt(u) + ' - ' + ecrireV + ' = ' + F.txt(diff)],
        ['نحدّد إشارة الفرق', F.txt(diff) + ' ' + (F.signe(diff) < 0 ? '<' : '>') + ' 0'],
        ['القاعدة', F.signe(diff) < 0 ? 'الفرق سالب، إذن العبارة الأولى أصغر'
                                      : 'الفرق موجب، إذن العبارة الأولى أكبر'],
        ['النتيجة', A + ' ' + op + ' ' + B]
      ],
      res: A + ' ' + op + ' ' + B,
      controle: { type: 'litteral', vars: [x], claim: A + ' ' + op + ' ' + B }
    };
  }
  F.enregistrer(9, { titre: 'الفرق — نفس المجهول', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
