(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Canonique;
  const I = M ? require('./items.js') : racine.Items;
  const C = M ? require('./chaines.js') : racine.Chaines;
  const PAR_PAGE = 4;
  const FAMILLES = [
    ['canonique', 'الشكل القانوني — أكمل المربّع'],
    ['factorisation', 'التفكيك — الفرق بين مربّعين'],
    ['equation', 'حلّ المعادلة P = 0']
  ];
  function puiser(f, n) {
    const d = I.ITEMS.filter(x => x.f === f);
    if (!d.length) return [];
    const sac = []; let pool = [];
    while (sac.length < n) { if (!pool.length) pool = F.melanger(d); sac.push(pool.pop()); }
    return sac;
  }
  let n = 0;
  for (const [f, titre] of FAMILLES) {
    if (!I.ITEMS.some(x => x.f === f)) continue;
    n++;
    F.enregistrer(n, { titre, famille: f, questions: PAR_PAGE,
      f: () => puiser(f, PAR_PAGE).map(C.chaine).filter(Boolean) });
  }
})(typeof window !== 'undefined' ? window : globalThis);
