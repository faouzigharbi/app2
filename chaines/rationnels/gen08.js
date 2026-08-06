// 8 — Intercaler des rationnels entre deux fractions : on agrandit le
// dénominateur jusqu'à ce que la place apparaisse entre les numérateurs.
(function (racine) {
  'use strict';
  const F = (typeof module !== 'undefined' && module.exports) ? require('./frac.js') : racine.Frac;

  function f() {
    const combien = F.ent(3, 5);
    const d = F.ent(4, 14);
    const n1 = F.ent(1, d - 1);
    const a = F.rat(n1, d), b = F.rat(n1 + 1, d);
    // Il faut au moins « combien » entiers libres entre les deux numérateurs.
    const k = combien + F.ent(1, 3);
    const D = d * k;
    const A = n1 * k, B = (n1 + 1) * k;
    const milieux = [];
    for (let i = 1; i <= combien; i++) milieux.push((A + i) + '/' + D);

    return {
      enonce: ['أعط ' + combien + ' أعداد كسرية نسبية محصورة قطعا بين:',
               F.txt(a) + '  و  ' + F.txt(b)],
      indice: 'كبّر المقام حتى يظهر فراغ بين البسطين',
      etapes: [
        ['نكتب العددين بمقام أكبر', F.txt(a) + ' = ' + A + '/' + D + ' ; ' + F.txt(b) + ' = ' + B + '/' + D],
        ['نلاحظ', 'بين البسطين أعداد صحيحة يمكن اختيارها'],
        ['نختار البسطات', Array.from({ length: combien }, (_, i) => A + i + 1).join(' ; ')],
        ['النتيجة', F.txt(a) + ' < ' + milieux.join(' < ') + ' < ' + F.txt(b)]
      ],
      // La conclusion est l'encadrement lui-même : c'est lui qui prouve que
      // les nombres choisis conviennent.
      res: F.txt(a) + ' < ' + milieux.join(' < ') + ' < ' + F.txt(b),
      controle: { type: 'intercaler', a: F.txt(a), b: F.txt(b), milieux }
    };
  }
  F.enregistrer(8, { titre: 'أعداد محصورة بين كسرين', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
