// LE MONTAGE DE LA FICHE — quelles familles, en quel ordre.
//
// C'est le seul fichier qui décide de ce que la fiche ENSEIGNE. Le catalogue
// d'énoncés est ailleurs, les règles ailleurs encore.
//
// Une page = une famille. Ses questions sont les items réels des feuilles ;
// seules les mesures et la pose de l'éventail changent d'un tirage à l'autre —
// une rotation ne change aucun angle, et deux élèves côte à côte n'ont pas le
// même dessin.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Angles;
  const I = M ? require('./items.js') : racine.Items;
  const C = M ? require('./chaines.js') : racine.Chaines;

  const PAR_PAGE = 4;

  const FAMILLES = [
    ['complementaires', 'زاويتان متتامّتان'],
    ['supplementaires', 'زاويتان متكاملتان'],
    ['opposees-sommet', 'زاويتان متقابلتان بالرأس'],
    ['bissectrice', 'منصّف زاوية'],
    ['bissectrices-plat', 'منصّفا زاويتين متجاورتين متكاملتين'],
    ['chasles', 'زوايا متجاورة — علاقة شال'],
    ['triangle', 'مجموع زوايا مثلّث']
  ];

  // Une famille peut compter moins d'items que la page n'en montre : on la
  // reprend alors, avec d'autres mesures et une autre pose. L'exercice est le
  // même, la question ne l'est pas — et cela vaut mieux qu'une page à moitié
  // vide.
  function puiser(famille, n) {
    const dedans = I.ITEMS.filter(x => x.f === famille);
    if (!dedans.length) return [];
    const sac = [];
    let pool = [];
    while (sac.length < n) {
      if (!pool.length) pool = F.melanger(dedans);
      sac.push(pool.pop());
    }
    return sac;
  }

  let n = 0;
  for (const [famille, titre] of FAMILLES) {
    if (!I.ITEMS.some(x => x.f === famille)) continue;
    n++;
    F.enregistrer(n, {
      titre, famille,
      questions: PAR_PAGE,
      f: () => puiser(famille, PAR_PAGE).map(C.chaine).filter(Boolean)
    });
  }
})(typeof window !== 'undefined' ? window : globalThis);
