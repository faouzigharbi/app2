// LE MONTAGE DE LA FICHE — quelles familles, à quelle difficulté, en quel ordre.
//
// C'est le seul fichier qui décide de ce que la fiche ENSEIGNE. Le catalogue
// d'énoncés est ailleurs, les règles ailleurs encore : ici on dit ce que la
// page montre, et dans quel ordre.
//
// Une page = une famille. Ses questions sont les items réels de la feuille,
// pris dans cette famille — jamais inventés. Les nombres et la pose de la
// figure changent d'un tirage à l'autre : deux élèves côte à côte n'ont pas le
// même dessin, et pourtant tous deux travaillent sur l'exercice du maître.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Droites;
  const I = M ? require('./items.js') : racine.Items;
  const C = M ? require('./chaines.js') : racine.Chaines;

  const PAR_PAGE = 4;

  const FAMILLES = [
    ['perp-perp-para', 'عموديان على نفس المستقيم'],
    ['perp-para-perp', 'عمودي على أحد متوازيين'],
    ['reconnaitre-mediatrice', 'التعرّف على الموسط العمودي'],
    ['mediatrice-para', 'الموسط العمودي و التوازي'],
    ['mediatrice-equidistance', 'الموسط العمودي و تساوي البعد'],
    ['distance', 'المسقط العمودي و البعد عن مستقيم'],
    ['tangente-para', 'المماس و التوازي'],
    ['position-droite-cercle', 'الوضعية النسبية لدائرة و مستقيم'],
    ['position-deux-cercles', 'الوضعية النسبية لدائرتين'],
    ['nature-quadrilatere', 'طبيعة الرباعي'],
    ['cercle-circonscrit', 'الموسط العمودي و الدائرة المحيطة']
  ];

  // Une famille peut compter moins d'items que la page n'en montre : on la
  // reprend alors, avec d'autres nombres et une autre pose. C'est légitime —
  // l'exercice est le même, la figure ne l'est pas — et cela vaut mieux qu'une
  // page à moitié vide.
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
