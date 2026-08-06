// Les équations de la fiche — et elles sont nombreuses : six exercices entiers
// n'en contiennent pas autre chose.
//
// Deux familles seulement, mais chacune sous des habillages variés :
//   • linéaire en x     :  a − x = c,  a − (x + b) = c,  a − (b − x) = c …
//   • linéaire en |x|   :  |x| + a = c,  a − |x| = c,  a − (b − |x|) = c …
//
// La seconde n'est pas la première déguisée : |x| = k n'a de solution que si
// k ≥ 0, et la fiche multiplie exprès les cas impossibles (|x| + 4 = −3,
// |x| + 7 = −6 …). Un élève qui applique la recette sans regarder le signe
// tombe à chaque fois.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.AddZ;
  const { rat, add, sub, neg, abs, signe, txt, par, plus, ent, choix } = F;

  const nonNul = (a, b) => { let v; do { v = ent(a, b); } while (v === 0); return v; };
  const E = n => rat(n);

  // -------------------------------------------------------------------------
  // Les habillages. Chacun sait s'écrire, se dépouiller, et donner sa réponse.
  // `depouille` mène de l'écriture initiale à « u = quelque chose », où u vaut
  // x ou |x| selon la famille.
  // -------------------------------------------------------------------------
  const HABILLAGES = [
    { // a − u = c
      txt: (u, a, b, c) => txt(a) + ' - ' + u + ' = ' + txt(c),
      etapes: (u, a, b, c) => [['نعزل المجهول', u + ' = ' + par(a) + ' - ' + par(c)]],
      val: (a, b, c) => sub(a, c)
    },
    { // a + u = c
      txt: (u, a, b, c) => txt(a) + ' + ' + u + ' = ' + txt(c),
      etapes: (u, a, b, c) => [['نعزل المجهول', u + ' = ' + par(c) + ' - ' + par(a)]],
      val: (a, b, c) => sub(c, a)
    },
    { // u − a = c
      txt: (u, a, b, c) => u + ' - ' + par(a) + ' = ' + txt(c),
      etapes: (u, a, b, c) => [['ننقل الثابت', u + ' = ' + par(c) + ' + ' + par(a)]],
      val: (a, b, c) => add(c, a)
    },
    { // a − (u + b) = c
      txt: (u, a, b, c) => txt(a) + ' - (' + u + ' + ' + par(b) + ') = ' + txt(c),
      etapes: (u, a, b, c) => [
        ['نرفع القوس المسبوق بالطرح', txt(a) + ' - ' + u + ' - ' + par(b) + ' = ' + txt(c)],
        ['نحسب الثابت', txt(a) + ' - ' + par(b) + ' = ' + txt(sub(a, b))],
        ['نكتب المعادلة', txt(sub(a, b)) + ' - ' + u + ' = ' + txt(c)],
        ['نعزل المجهول', u + ' = ' + par(sub(a, b)) + ' - ' + par(c)]
      ],
      val: (a, b, c) => sub(sub(a, b), c)
    },
    { // a − (b − u) = c
      txt: (u, a, b, c) => txt(a) + ' - (' + txt(b) + ' - ' + u + ') = ' + txt(c),
      etapes: (u, a, b, c) => [
        ['نرفع القوس المسبوق بالطرح', txt(a) + ' - ' + par(b) + ' + ' + u + ' = ' + txt(c)],
        ['نحسب الثابت', txt(a) + ' - ' + par(b) + ' = ' + txt(sub(a, b))],
        ['نكتب المعادلة', txt(sub(a, b)) + ' + ' + u + ' = ' + txt(c)],
        ['نعزل المجهول', u + ' = ' + par(c) + ' - ' + par(sub(a, b))]
      ],
      val: (a, b, c) => sub(c, sub(a, b))
    },
    { // a + (u − b) = c
      txt: (u, a, b, c) => txt(a) + ' + (' + u + ' - ' + par(b) + ') = ' + txt(c),
      etapes: (u, a, b, c) => [
        ['نرفع القوس المسبوق بالجمع', txt(a) + ' + ' + u + ' - ' + par(b) + ' = ' + txt(c)],
        ['نحسب الثابت', txt(a) + ' - ' + par(b) + ' = ' + txt(sub(a, b))],
        ['نكتب المعادلة', txt(sub(a, b)) + ' + ' + u + ' = ' + txt(c)],
        ['نعزل المجهول', u + ' = ' + par(c) + ' - ' + par(sub(a, b))]
      ],
      val: (a, b, c) => sub(c, sub(a, b))
    },
    { // a + [b − u] = c
      txt: (u, a, b, c) => txt(a) + ' + [' + txt(b) + ' - ' + u + '] = ' + txt(c),
      etapes: (u, a, b, c) => [
        ['نرفع القوس المربّع', txt(a) + ' + ' + txt(b) + ' - ' + u + ' = ' + txt(c)],
        ['نحسب الثابت', txt(a) + ' + ' + par(b) + ' = ' + txt(add(a, b))],
        ['نكتب المعادلة', txt(add(a, b)) + ' - ' + u + ' = ' + txt(c)],
        ['نعزل المجهول', u + ' = ' + par(add(a, b)) + ' - ' + par(c)]
      ],
      val: (a, b, c) => sub(add(a, b), c)
    }
  ];

  const tirerConstantes = () => ({
    a: E(nonNul(-12, 12)), b: E(nonNul(-9, 9)), c: E(ent(-9, 9))
  });

  // -------------------------------------------------------------------------
  // Équation en x : la valeur trouvée EST la solution.
  // -------------------------------------------------------------------------
  // Toutes les mises en forme finissent sur « u = <expression> » : on ajoute
  // systématiquement le calcul de cette expression, sinon les habillages les
  // plus courts donneraient des chaînes de deux maillons.
  const calcul = (etapes, u, val) => {
    const der = etapes[etapes.length - 1][1];
    const rhs = der.slice(der.indexOf('= ') + 2);
    return etapes.concat([['نحسب العضو الثاني', rhs + ' = ' + txt(val)]]);
  };

  function equationX(h) {
    let k, sol;
    do { k = tirerConstantes(); sol = h.val(k.a, k.b, k.c); } while (sol.n === 0);
    const eq = h.txt('x', k.a, k.b, k.c);
    return {
      enonce: ['جد العدد الصحيح النسبي x بحيث:', eq],
      indice: 'ابدأ برفع الأقواس، و انتبه إلى العلامة التي تسبق كل قوس',
      etapes: calcul(h.etapes('x', k.a, k.b, k.c), 'x', sol).concat([
        ['النتيجة', 'x = ' + txt(sol)],
        ['نتحقّق', h.txt(par(sol), k.a, k.b, k.c)]
      ]),
      controle: { type: 'equation', eq, sol }
    };
  }

  // -------------------------------------------------------------------------
  // Équation en |x| : la valeur trouvée est |x|, et son SIGNE décide de tout.
  // On tire volontairement le cas impossible une fois sur deux.
  // -------------------------------------------------------------------------
  function equationAbs(h, voulu) {
    let k, m;
    do { k = tirerConstantes(); m = h.val(k.a, k.b, k.c); }
    while (m.n === 0 || signe(m) !== voulu);
    const eq = h.txt('|x|', k.a, k.b, k.c);
    const possible = signe(m) > 0;
    return {
      enonce: ['جد العدد الصحيح النسبي x بحيث:', eq],
      indice: 'اعزل |x| أوّلا، ثمّ انظر إلى إشارة ما تحصّلت عليه قبل أن تستنتج',
      etapes: calcul(h.etapes('|x|', k.a, k.b, k.c), '|x|', m).concat([
        ['نقارن بالصفر', txt(m) + (possible ? ' > 0' : ' < 0')],
        ['القاعدة', possible ? 'القيمة المطلقة موجبة، إذن للمعادلة حلاّن متقابلان'
                             : 'القيمة المطلقة لعدد لا يمكن أن تكون سالبة'],
        ['النتيجة', possible ? 'x = ' + txt(m) + '  أو  x = ' + txt(neg(m))
                             : 'لا يوجد عدد صحيح نسبي x يحقّق المعادلة']
      ]),
      controle: { type: 'abs', eq, m, possible }
    };
  }

  // Une batterie : n équations d'habillages différents, moitié en |x|, et
  // parmi celles-là au moins une impossible — c'est le point de la fiche.
  function batterie(n, partAbs) {
    const out = [];
    const pris = [];
    const h = () => {
      let i;
      do { i = ent(0, HABILLAGES.length - 1); } while (pris.indexOf(i) >= 0 && pris.length < HABILLAGES.length);
      pris.push(i); return HABILLAGES[i];
    };
    const nbAbs = Math.max(2, Math.round(n * (partAbs === undefined ? 0.5 : partAbs)));
    for (let i = 0; i < n - nbAbs; i++) out.push(equationX(h()));
    for (let i = 0; i < nbAbs; i++) out.push(equationAbs(h(), i === 0 ? -1 : (i === 1 ? 1 : choix([-1, 1]))));
    return out;
  }

  const API = { HABILLAGES, equationX, equationAbs, batterie };
  if (M) module.exports = API;
  else racine.Equations = API;
})(typeof window !== 'undefined' ? window : globalThis);
