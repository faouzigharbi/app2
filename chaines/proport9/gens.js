(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Proport;
  const I = M ? require('./items.js') : racine.Items;
  const C = M ? require('./chaines.js') : racine.Chaines;

  const PAR_PAGE = 6;          // la feuille en aligne quinze : on en met six
  const FAMILLES = [
    ['deux-fractions', 'كسران متساويان — أكمل'],
    ['trois-fractions', 'ثلاثة كسور متساوية — أكمل'],
    ['sans-ecriture-decimale', 'جواب في شكل كسر غير قابل للاختزال']
  ];

  function puiser(famille, n) {
    const dedans = I.ITEMS.filter(x => x.f === famille);
    if (!dedans.length) return [];
    const sac = []; let pool = [];
    while (sac.length < n) { if (!pool.length) pool = F.melanger(dedans); sac.push(pool.pop()); }
    return sac;
  }

  let n = 0;
  for (const [famille, titre] of FAMILLES) {
    if (!I.ITEMS.some(x => x.f === famille)) continue;
    n++;
    F.enregistrer(n, { titre, famille, questions: PAR_PAGE,
      f: () => puiser(famille, PAR_PAGE).map(C.chaine).filter(Boolean) });
  }
})(typeof window !== 'undefined' ? window : globalThis);
