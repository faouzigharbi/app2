// LE JUGE de factq8 — partagé.
//
// Le validateur s'en sert hors ligne ; les pages « أين الخطأ؟ » s'en servent
// DANS LE NAVIGATEUR, pour prouver qu'une faute plantée en est bien une. C'est
// la MÊME fonction des deux côtés : une page ne peut pas afficher comme fausse
// une étape que le validateur tiendrait pour vraie.
//
// ENGENDRÉ PAR _regles/extraire-juge.js à partir de verifier.js.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Fact;

  const ECHANTILLONS = 16;

  // La suite DÉTERMINISTE. Longue à dessein : certains énoncés n'ont de sens
  // que sous une contrainte (« a < b »), et le juge tire jusqu'à en trouver un
  // cas permis. Un cycle court la rendrait insatisfiable — c'est arrivé.
  let curseur = 0;
  const rnd = () => {
    const i = curseur++;
    const n = ((i * 37) % 41) - 20;
    return F.rat(n === 0 ? 7 : n, 1 + (i * 13) % 9);
  };

function environnements(c) {
  if (c.type === 'identite') {
    return Array.from({ length: ECHANTILLONS }, () => {
      const e = envAleatoire(c.vars, c.composites);
      if (c.nom) e[c.nom] = F.analyser(c.gauche, e);
      return e;
    });
  }
  if (c.type === 'valeur') return [{ x: c.x0, E: c.val }];
  if (c.type === 'equation-produit') {
    return [c.x1, c.x2].map(x => {
      const e = { x };
      if (c.nom) e[c.nom] = F.analyser(c.gauche, e);   // vaut 0 aux racines
      return e;
    });
  }
  return [{}];
}

// « xy » est un seul jeton pour l'analyseur, mais c'est le produit de x par y.
// Si on lui donnait une valeur indépendante, l'identité « xy(1 + z) = xy + xyz »
// serait fausse — et le contrôle passerait à côté de tout le sens du monôme.
const envAleatoire = (vars, composites) => {
  const e = {};
  vars.forEach(v => { e[v] = rnd(); });
  if (composites) {
    ['xy', 'xyz', 'xyt', 'xty', 'ab'].forEach(nom => {
      e[nom] = nom.split('').reduce((r, l) => F.mul(r, e[l] || F.rat(1)), F.rat(1));
    });
  }
  return e;
};

  // 'vraie' | 'fausse' | 'ignoree'. « ignoree » couvre l'arabe et tout ce que
  // l'analyseur ne sait pas lire : on ne prétend rien sur ce qu'on ne calcule pas.
  function evaluerEtape(math, envs) {
    if (typeof math !== 'string' || F.ARABE.test(math)) return 'ignoree';
    try {
      let bon = 0;
      for (const env of envs) {
        const r = F.verifierRelation(String(math).replace(/×/g, '*'), env);
        if (r === null) { F.analyser(String(math).replace(/×/g, '*'), env); return 'ignoree'; }
        if (!r) bon++;
      }
      // Dans une disjonction, une étape qui tient dans UN cas est vraie ; partout
      // ailleurs elle doit tenir dans tous.
      return bon >= (envs.disjonction ? 1 : envs.length) ? 'vraie' : 'fausse';
    } catch (e) { return 'fausse'; }
  }

  // Le curseur REPART du même point à chaque question : sans cela deux appels
  // sur la même question ne donneraient pas les mêmes environnements, et le
  // juge cesserait d'être un juge.
  function envs(c) {
    curseur = 0;
    const out = environnements(c);
    out.disjonction = !!(c.type === 'equation-produit');
    return out;
  }

  const API = { environnements: envs, evaluerEtape, ECHANTILLONS };
  if (M) module.exports = API; else racine.Juge = API;
})(typeof window !== 'undefined' ? window : globalThis);
