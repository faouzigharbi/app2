// LE JUGE de pgcd7 — partagé.
//
// Le validateur s'en sert hors ligne ; les pages « أين الخطأ؟ » s'en servent
// DANS LE NAVIGATEUR, pour prouver qu'une faute plantée en est bien une. C'est
// la MÊME fonction des deux côtés : une page ne peut pas afficher comme fausse
// une étape que le validateur tiendrait pour vraie.
//
// ENGENDRÉ PAR _regles/juge-nat.js.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const MOT = M ? require('./moteur.js') : racine.Moteur;

  // Une égalité PUREMENT numérique : c'est la seule chose que ce moteur sache
  // juger. Le reste — l'arabe, les listes de diviseurs — est laissé de côté.
  const PUR = /^[\d\s+\-*×÷/:=^().]+$/;
  const egalites = t => String(t).split(' و ').map(x => x.trim())
    .filter(x => PUR.test(x) && x.includes('=') && /\d/.test(x));

  // Rien à tirer : les questions sont closes, leurs étapes se calculent.
  function environnements() { return [{}]; }

  // Évalue une expression d'entiers naturels ; null si elle n'est pas
  // calculable. C'est ce que les règles de puissance et de priorité utilisent.
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
    const eqs = egalites(math);
    if (!eqs.length) return 'ignoree';
    let vues = 0;
    for (const eq of eqs) {
      const k = eq.indexOf('=');
      const g = eq.slice(0, k).trim(), d = eq.slice(k + 1).trim();
      // « = 8 » : l'annonce du résultat, qui ne se calcule pas seule.
      if (!g || !d) return 'ignoree';
      const bad = [];
      let vg, vd;
      try { vg = MOT.evalNat(g, bad); vd = MOT.evalNat(d, bad); }
      catch (e) { return 'ignoree'; }
      // Passé l'entier exact, on ne prétend plus rien : deux écritures du même
      // nombre peuvent s'y arrondir différemment.
      if (!Number.isFinite(vg) || !Number.isFinite(vd)) return 'ignoree';
      if (Math.abs(vg) > Number.MAX_SAFE_INTEGER
          || Math.abs(vd) > Number.MAX_SAFE_INTEGER) return 'ignoree';
      if (bad.length) return 'fausse';
      if (vg !== vd) return 'fausse';
      vues++;
    }
    return vues ? 'vraie' : 'ignoree';
  }

  const API = { environnements, evaluerEtape, nat, ECHANTILLONS: 1 };
  if (M) module.exports = API; else racine.Juge = API;
})(typeof window !== 'undefined' ? window : globalThis);
