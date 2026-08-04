// LE JUGE de produitq8 — partagé.
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
  const F = M ? require('./noyau.js') : racine.Produit;

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
    const out = [];
    for (let i = 0; i < ECHANTILLONS; i++) {
      const e = {};
      c.vars.forEach(v => { e[v] = rnd(); });
      // Le nom de l'expression (X, F, E …) apparaît dans les étapes : on le
      // lie à SA DÉFINITION, pas au résultat annoncé — sinon on vérifierait
      // le générateur contre lui-même.
      if (c.nom) e[c.nom] = F.analyser(c.gauche, e);
      out.push(e);
    }
    return out;
  }
  return [Object.assign({}, c.env || {})];
}

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
    out.disjonction = false;
    return out;
  }

  const API = { environnements: envs, evaluerEtape, ECHANTILLONS };
  if (M) module.exports = API; else racine.Juge = API;
})(typeof window !== 'undefined' ? window : globalThis);
