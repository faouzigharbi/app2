// Exercice 11 :  E = p - (x + q) - (p - y)  →  y - x - q
//   1) montrer   2) calculer si x = y - c   3) comparer x et y si E donné
//   4) déterminer |E| si x ≥ y — sans jamais calculer E
(function (racine) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports;
  const F = M ? require('./noyau.js') : racine.Somme;
  const S = M ? require('./formes.js') : racine.Formes;
  const Q = M ? require('./questions.js') : racine.Questions;
  const { rat, add, sub, neg, txt, par, plus } = F;

  function f() {
    const sh = S.forme11();                       // u = y, v = x, k < 0
    const c = rat(S.entNonNul(-9, 9));            // x = y - c  ⟹  y - x = c
    const val = add(c, sh.cible.k);
    let cible;                                    // E = cible ⟹ y - x = cible - k
    do { cible = rat(S.entNonNul(-9, 9), F.choix([2, 4, 8])); }
    while (F.egaux(sub(cible, sh.cible.k), rat(0)));
    const dyx = sub(cible, sh.cible.k);
    const petitX = F.signe(dyx) > 0;              // y - x > 0  ⟹  x < y

    return [
      Q.montrer(sh),
      {
        enonce: ['احسب', 'E', 'إذا كان', 'x = y - ' + txt(c), 'حيث', 'E = ' + Q.forme(sh)],
        indice: 'ترجم المعطى إلى y - x، فهو ما تحتاجه',
        etapes: [
          ['نترجم المعطى', 'y - x = ' + txt(c)],
          ['ننطلق من الشكل المختصر', 'E = (y - x)' + plus(sh.cible.k)],
          ['نعوّض', 'E = ' + par(c) + plus(sh.cible.k)],
          ['النتيجة', 'E = ' + txt(val)]
        ],
        controle: { type: 'signe', defs: { E: sh.txt }, libres: ['y'],
                    lie: { nom: 'x', via: 'difference', autre: 'y', valeur: c },
                    claims: [{ nom: 'E', vaut: val }] }
      },
      {
        enonce: ['قارن', 'x و y', 'إذا علمت أنّ', 'E = ' + txt(cible), 'حيث',
                 'E = ' + Q.forme(sh)],
        indice: 'استخرج y - x من المعطى، ثمّ انظر إلى إشارته',
        etapes: [
          ['نستعمل المعطى', '(y - x)' + plus(sh.cible.k) + ' = ' + txt(cible)],
          ['نعزل الفرق', 'y - x = ' + par(cible) + ' - ' + par(sh.cible.k)],
          ['نحسب الفرق', 'y - x = ' + txt(dyx)],
          ['نحدّد إشارة الفرق', txt(dyx) + (petitX ? ' > 0' : ' < 0')],
          ['القاعدة', petitX ? 'الفرق y - x موجب، إذن x أصغر من y'
                             : 'الفرق y - x سالب، إذن x أكبر من y'],
          ['النتيجة', petitX ? 'x < y' : 'x > y']
        ],
        controle: { type: 'signe', defs: { E: sh.txt }, libres: ['y'],
                    lie: { nom: 'x', via: 'difference', autre: 'y', valeur: dyx },
                    relation: { g: 'x', d: 'y', sens: petitX ? -1 : 1 } }
      },
      Q.valeurAbsolue(sh)
    ];
  }
  F.enregistrer(11, { titre: 'عبارة في x و y، مقارنة و قيمة مطلقة', f, questions: 4 });
  if (M) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
