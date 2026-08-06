// 9 — Problème de partage (les 84 bonbons et 147 sucettes de la fiche).
// Le nombre d'amis divise les deux quantités et on le veut maximal : PGCD.
// Les parts de chacun se lisent ensuite par division.
(function (racine) {
  'use strict';
  const A = (typeof module !== 'undefined' && module.exports) ? require('./arith.js') : racine.Arith;
  const O = (typeof module !== 'undefined' && module.exports) ? require('./outils.js') : racine.Outils;

  // Deux formes par objet : celle qui suit le nombre (تمييز) et le pluriel
  // défini, qui seul se dit après « نفس عدد ».
  const OBJETS = [
    { compte: 'قطعة حلوى', pluriel: 'قطع الحلوى' },
    { compte: 'علكة', pluriel: 'العلكات' },
    { compte: 'قلما', pluriel: 'الأقلام' },
    { compte: 'كرّاسا', pluriel: 'الكرّاسات' },
    { compte: 'كتابا', pluriel: 'الكتب' },
    { compte: 'وردة', pluriel: 'الورود' },
    { compte: 'بالونا', pluriel: 'البالونات' }
  ];

  function tirage() {
    for (;;) {
      const d = A.ent(6, 30);
      const x = A.ent(2, 12), y = A.ent(2, 12);
      if (x === y || A.pgcd(x, y) !== 1) continue;   // sinon le PGCD dépasse d
      const a = d * x, b = d * y;
      if (a > 600 || b > 600 || a < 40 || b < 40) continue;
      // Un PGCD premier donnerait l'étape « 19 = 19 » : sans contenu.
      if (A.combiner([a, b], 'min').texte === String(d)) continue;
      return { d, a: Math.max(a, b), b: Math.min(a, b) };
    }
  }

  function f() {
    const { d, a, b } = tirage();
    let o1 = A.choix(OBJETS), o2 = A.choix(OBJETS);
    while (o2 === o1) o2 = A.choix(OBJETS);
    return {
      enonce: 'ربح أحمد ' + a + ' ' + o1.compte + ' و ' + b + ' ' + o2.compte
        + ' في لعبة. قرّر تقسيمها على أصدقائه في مجموعات متساوية: نفس عدد '
        + o1.pluriel + ' ونفس عدد ' + o2.pluriel + ' لكلّ واحد. '
        + 'ما هو أكبر عدد ممكن من الأصدقاء، وما نصيب كلّ واحد؟',
      indice: 'عدد الأصدقاء يقسم الكميتين، ونريده الأكبر',
      etapes: [
        ['نترجم', 'عدد الأصدقاء يقسم ' + a + ' و ' + b + '، ونريده الأكبر: إنّه ق.م.أ'],
        ['نفكّك إلى عوامل أوّلية', A.decomposer(a) + ' و ' + A.decomposer(b)],
        ['ق.م.أ: العوامل المشتركة بأصغر أسّ', A.combiner([a, b], 'min').texte + ' = ' + d],
        ['نصيب كلّ واحد من ' + o1.pluriel, a + ' : ' + d + ' = ' + (a / d)],
        ['نصيب كلّ واحد من ' + o2.pluriel, b + ' : ' + d + ' = ' + (b / d)],
        ['عدد الأصدقاء', '= ' + d]
      ],
      res: d,
      controle: { type: 'partage', a, b, d, pa: a / d, pb: b / d }
    };
  }
  A.enregistrer(9, { titre: 'مسألة التوزيع — ق.م.أ', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
