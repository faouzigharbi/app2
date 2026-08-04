// LE JUGE de naturels7 — partagé.
//
// Le validateur s'en sert hors ligne ; les pages « أين الخطأ؟ » s'en servent
// DANS LE NAVIGATEUR, pour prouver qu'une faute plantée en est bien une. C'est
// la MÊME fonction des deux côtés : une page ne peut pas afficher comme fausse
// une étape que le validateur tiendrait pour vraie.
//
// Écrit à la main : cette fiche est la seule dont les étapes ne soient pas des
// égalités mais des EXPRESSIONS — « 26 × 9 + 3 », puis « 234 + 3 », puis
// « = 237 ». Chacune est la précédente réécrite plus simplement, et
// l'invariant que le validateur contrôle depuis toujours est qu'elles valent
// TOUTES le résultat final. C'est donc là-dessus que le juge tranche : une
// étape est vraie quand elle vaut le résultat, fausse quand la réécriture l'a
// changé — ce qui est exactement ce qu'une faute de règle fait ici.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const MOT = M ? require('./moteur.js') : racine.Moteur;

  // Du calcul, et rien d'autre : ni « = » (l'annonce), ni « ... » (le trou à
  // compléter), ni l'arabe de la règle énoncée.
  const CALCUL = /^[\d\s+\-*×÷/:^()]+$/;

  function environnements(c) {
    return (c && typeof c.res === 'number') ? [{ res: c.res }] : [];
  }

  function nat(expr) {
    try {
      const bad = [];
      const v = MOT.evalNat(String(expr), bad);
      if (!Number.isFinite(v) || Math.abs(v) > Number.MAX_SAFE_INTEGER
          || bad.length) return null;
      return v;
    } catch (e) { return null; }
  }

  // 'vraie' | 'fausse' | 'ignoree'.
  function evaluerEtape(math, envs) {
    if (typeof math !== 'string') return 'ignoree';
    if (!envs || !envs.length) return 'ignoree';
    // « = 237 » annonce le résultat ; c'est encore une expression, on la juge.
    const t = String(math).trim().replace(/^=\s*/, '');
    if (!t || !CALCUL.test(t) || !/\d/.test(t)) return 'ignoree';
    const v = nat(t);
    if (v === null) return 'ignoree';
    return v === envs[0].res ? 'vraie' : 'fausse';
  }

  const API = { environnements, evaluerEtape, nat, ECHANTILLONS: 1 };
  if (M) module.exports = API; else racine.Juge = API;
})(typeof window !== 'undefined' ? window : globalThis);
