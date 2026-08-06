// 4 — Comparer par le signe de la différence. C'est la méthode centrale du
// chapitre : elle marche toujours, sans condition sur les signes.
(function (racine) {
  'use strict';
  const F = (typeof module !== 'undefined' && module.exports) ? require('./frac.js') : racine.Frac;

  function f() {
    let a, b;
    do {
      a = F.rat(F.ent(-20, 20), F.ent(2, 18));
      b = F.rat(F.ent(-20, 20), F.ent(2, 18));
    } while (F.cmp(a, b) === 0 || a.d === 1 || b.d === 1);

    const diff = F.sub(a, b);
    const op = F.signe(diff) > 0 ? '>' : '<';
    const opDiff = F.signe(diff) > 0 ? '>' : '<';
    // « a − (−3/8) » : la parenthèse est indispensable quand b est négatif.
    const ecrireB = b.n < 0 ? '(' + F.txt(b) + ')' : F.txt(b);
    return {
      enonce: ['قارن باستعمال الفرق:', F.txt(a) + '  ;  ' + F.txt(b)],
      indice: 'إشارة الفرق تعطي الترتيب',
      etapes: [
        ['نحسب الفرق', F.txt(a) + ' - ' + ecrireB + ' = ' + F.txt(diff)],
        ['نحدّد إشارة الفرق', F.txt(diff) + ' ' + opDiff + ' 0'],
        ['القاعدة', opDiff === '>' ? 'إذا كان الفرق موجبا فالعدد الأوّل أكبر'
                                   : 'إذا كان الفرق سالبا فالعدد الأوّل أصغر'],
        ['النتيجة', F.txt(a) + ' ' + op + ' ' + F.txt(b)]
      ],
      res: F.txt(a) + ' ' + op + ' ' + F.txt(b),
      controle: { type: 'compare', a: F.txt(a), b: F.txt(b), op }
    };
  }
  F.enregistrer(4, { titre: 'المقارنة بالفرق', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
