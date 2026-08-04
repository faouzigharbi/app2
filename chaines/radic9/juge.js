// LE JUGE de radic9 — partagé.
//
// Le validateur s'en sert hors ligne ; les pages « أين الخطأ؟ » s'en servent
// DANS LE NAVIGATEUR, pour prouver qu'une faute plantée en est bien une. C'est
// la MÊME fonction des deux côtés : une page ne peut pas afficher comme fausse
// une étape que le validateur tiendrait pour vraie.
//
// Écrit à la main, et non engendré par _regles/extraire-juge.js : cette fiche
// n'a pas d'environnement TIRÉ. Chaque question est une expression FERMÉE — un
// nombre, pas une fonction d'une inconnue — et son environnement se calcule :
// « A » désigne la valeur de l'énoncé, « a » et « b » les nombres que la
// question nomme. Il n'y a donc rien à rendre déterministe ici : il n'y avait
// pas de hasard.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Radic;
  const R = M ? require('./racines.js') : racine.Rad;

  // Un seul environnement, celui du validateur, construit de la même façon.
  // Si l'énoncé ne s'analyse pas, on ne rend AUCUN environnement : le juge
  // s'abstiendra plutôt que de trancher sur ce qu'il n'a pas su lire.
  function environnements(c) {
    const env = {};
    try {
      env.A = R.analyser(c.expr);
      // les autres noms sont des DÉSIGNATIONS — « a » et « b » des inverses —
      // et se lisent dans l'environnement déjà commencé.
      if (c.noms) for (const k of Object.keys(c.noms)) env[k] = R.analyser(c.noms[k], env);
    } catch (e) { return []; }
    return [env];
  }

  // 'vraie' | 'fausse' | 'ignoree'. « ignoree » couvre l'arabe et tout ce que
  // l'analyseur ne sait pas lire : on ne prétend rien sur ce qu'on ne calcule pas.
  function evaluerEtape(math, envs) {
    if (typeof math !== 'string' || F.ARABE.test(math)) return 'ignoree';
    if (!envs || !envs.length) return 'ignoree';
    let bon = 0, lisible = false;
    for (const env of envs) {
      let r;
      // R.verifierRelation rend '' quand la relation TIENT, un grief quand
      // elle est fausse, et null quand ce n'est pas une relation.
      try { r = R.verifierRelation(math, env); } catch (e) { continue; }
      lisible = true;
      if (r === null) return 'ignoree';
      if (!r) bon++;
    }
    if (!lisible) return 'fausse';
    return bon >= envs.length ? 'vraie' : 'fausse';
  }

  const API = { environnements, evaluerEtape, ECHANTILLONS: 1 };
  if (M) module.exports = API; else racine.Juge = API;
})(typeof window !== 'undefined' ? window : globalThis);
