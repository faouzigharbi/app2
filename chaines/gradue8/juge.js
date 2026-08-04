// LE JUGE de gradue8 — partagé.
//
// Cette fiche-ci n'a pas d'environnements à construire : ses questions posent
// des points sur une droite graduée, et tout ce qu'une étape nomme, le contrôle
// le donne. Le juge tient donc en une ligne — mais c'est LA MÊME que celle du
// validateur, et c'est tout ce qui compte.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Gradue;

  function environnements(c) { return [(c && c.env) || {}]; }

  function evaluerEtape(math, envs) {
    if (typeof math !== 'string' || F.ARABE.test(math)) return 'ignoree';
    try {
      for (const env of envs) {
        const r = F.verifierRelation(String(math).replace(/×/g, '*'), env);
        if (r === null) { F.analyser(String(math).replace(/×/g, '*'), env); return 'ignoree'; }
        if (r) return 'fausse';
      }
      return 'vraie';
    } catch (e) { return 'fausse'; }
  }

  const API = { environnements, evaluerEtape };
  if (M) module.exports = API; else racine.Juge = API;
})(typeof window !== 'undefined' ? window : globalThis);
