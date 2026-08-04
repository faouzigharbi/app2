// LE PONT — ce que les pages « أين الخطأ؟ » attendent d'une fiche.
//
// Cette fiche-ci nomme ses familles `PREUVES` et non `PROBLEMES`, et ses
// questions n'ont pas de `controle` : leur énoncé est une expression fermée,
// la valeur cherchée est dans `res`. Rien de tout cela n'est un défaut — c'est
// une fiche antérieure au porteur —, mais le porteur, lui, ne connaît qu'un
// seul vocabulaire.
//
// On ne réécrit donc pas la fiche : on ajoute ce pont, qui traduit. Il
// n'invente rien qui n'existe déjà, il renomme et complète : un `controle` qui
// porte le résultat, et l'indice que la fiche ne donnait pas.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const G = M ? require('./generateurs.js') : racine.Preuves;
  const MOT = M ? require('./moteur.js') : racine.Moteur;

  const pgcd = (a, b) => (b ? pgcd(b, a % b) : Math.abs(a));

  const API = {
    PROBLEMES: G.PREUVES,
    PAR_PAGE: G.PAR_PAGE,
    tirer: (n, combien) => G.tirer(n, combien).map(q => ({
      enonce: q.enonce,
      etapes: q.etapes,
      res: q.res,
      indice: q.indice || 'ابدأ بالتفكيك إلى جداء عوامل أوّلية.',
      controle: q.controle || { res: q.res }
    })),
    ent: MOT.ent, choix: MOT.choix, pgcd,
    rendreMath: MOT.md ? (s => MOT.md(s, true)) : undefined
  };

  if (M) module.exports = API; else racine.Pont = API;
})(typeof window !== 'undefined' ? window : globalThis);
