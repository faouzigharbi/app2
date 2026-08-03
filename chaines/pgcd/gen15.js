// Exercice 15 — terrain rectangulaire à entourer d'arbres équidistants, avec
// un arbre à chaque coin. L'écart divise les deux dimensions, et on le veut le
// plus grand : c'est le PGCD. Puis périmètre, nombre d'arbres, prix.
(function (racine) {
  'use strict';
  const A = (typeof module !== 'undefined' && module.exports)
    ? require('./arith.js') : racine.Arith;

  function tirage() {
    for (;;) {
      const d = A.ent(6, 25);
      const x = A.ent(2, 9), y = A.ent(2, 9);
      if (x === y || A.pgcd(x, y) !== 1) continue;   // sinon le PGCD n'est pas d
      const a = d * x, b = d * y;
      if (a < 40 || b < 40 || a > 160 || b > 160) continue;
      return { d, a: Math.max(a, b), b: Math.min(a, b) };
    }
  }

  function f() {
    const { d, a, b } = tirage();
    const perimetre = 2 * (a + b);
    const arbres = perimetre / d;
    const prixUnite = A.choix([25, 30, 35, 40, 45, 50]);
    const total = arbres * prixUnite;
    const comb = A.combiner([a, b], 'min');

    return {
      enonce: 'قطعة أرض مستطيلة أبعادها ' + a + ' متر و ' + b
        + ' متر، نريد إحاطتها بأشجار متساوية البعد مع وجود شجرة بكلّ ركن. '
        + '١) أحسب أكبر مسافة ممكنة بين شجرتين متتاليتين. '
        + '٢) أحسب ثمن الأشجار اللازمة إذا كان ثمن الشجرة الواحدة ' + prixUnite + ' دينارا.',
      indice: 'المسافة تقسم البعدين معا، ونريد أكبرها',
      etapes: [
        ['نترجم', 'المسافة تقسم ' + a + ' و ' + b + '، وهي الأكبر، إذن هي ق.م.أ'],
        ['نفكّك إلى عوامل أوّلية', A.decomposer(a) + ' و ' + A.decomposer(b)],
        ['ق.م.أ: العوامل المشتركة بأصغر أسّ', comb.texte + ' = ' + d],
        ['نحسب المحيط', '2 × (' + a + ' + ' + b + ') = ' + perimetre],
        ['عدد الأشجار', perimetre + ' : ' + d + ' = ' + arbres],
        ['الثمن', arbres + ' × ' + prixUnite + ' = ' + total],
        ['النتيجة', '= ' + total]
      ],
      res: total,
      controle: { a, b, d, perimetre, arbres, prixUnite, total, type: 'pgcd2' }
    };
  }

  A.enregistrer(15, { titre: 'أشجار حول قطعة أرض — ق.م.أ', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
