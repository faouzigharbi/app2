// LE JUGE de rationnels8 — partagé.
//
// Le validateur s'en sert hors ligne ; les pages « أين الخطأ؟ » s'en servent
// DANS LE NAVIGATEUR, pour prouver qu'une faute plantée en est bien une. C'est
// la MÊME fonction des deux côtés : une page ne peut pas afficher comme fausse
// une étape que le validateur tiendrait pour vraie.
//
// Écrit à la main : cette fiche compare des rationnels, et son moteur ne dit
// pas `verifierRelation` mais `verifierComparaison`. Une étape peut porter
// plusieurs comparaisons séparées par « ; » — « 12/7 > 1/2 ; -9 ≤ -2 ; 1 > 1/2 »
// — et il faut qu'elles tiennent toutes.
//
// Le tirage y est DÉTERMINISTE. Le hasard convient au validateur, qui multiplie
// les cas ; pas au juge : une faute doit être fausse maintenant et fausse dans
// une seconde, sinon l'élève pourrait contester à bon droit.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./frac.js') : racine.Frac;

  const ECHANTILLONS = 24;
  const COMPARAISON = /[<>≤≥=]/;

  // Le hasard remplacé sous le tirage : la forme des valeurs reste celle de la
  // fiche — un rationnel de numérateur et dénominateur bornés —, seule leur
  // imprévisibilité disparaît.
  let curseur = 0;
  const suite = (min, max) => {
    if (max === undefined) { max = min; min = 0; }
    const n = max - min + 1;
    if (n <= 0) return min;
    const i = curseur++;
    return min + (((i * 37) % 41) * 41 + i) % n;
  };
  const ratSuite = (maxN, maxD) =>
    F.rat(suite(-(maxN || 20), maxN || 20), suite(1, maxD || 12));

  // Un jeu de valeurs pour les variables, respectant l'hypothèse — la même
  // fonction que le validateur, au tirage près.
  function environnement(vars, contrainte) {
    for (let essai = 0; essai < 200; essai++) {
      const env = {};
      for (const v of vars) env[v] = ratSuite(25, 15);
      if (!contrainte) return env;
      const m = contrainte.split(/\s*([<>≤≥])\s*/);
      const r = F.cmp(env[m[0].trim()], env[m[2].trim()]);
      const ok = { '<': r < 0, '>': r > 0, '≤': r <= 0, '≥': r >= 0 }[m[1]];
      if (ok) return env;
    }
    return null;
  }

  // « = -6 » est la déclaration finale, sans membre gauche : elle relève de la
  // règle « la dernière étape annonce le résultat », pas du calcul.
  function partiesVerifiables(math) {
    return String(math).split(';').map(x => x.trim())
      .filter(x => x && COMPARAISON.test(x) && !F.ARABE.test(x)
                   && !x.includes('|') && !/^[<>≤≥=]/.test(x));
  }

  function environnements(c) {
    curseur = 0;
    const litteral = c && (c.type === 'litteral' || c.type === 'relation');
    if (!litteral) return [{}];
    const vars = c.vars || ['x', 'y'];
    const out = [];
    for (let i = 0; i < ECHANTILLONS; i++) {
      const e = environnement(vars, c.contrainte);
      if (e) out.push(e);
    }
    return out;
  }

  // 'vraie' | 'fausse' | 'ignoree'.
  function evaluerEtape(math, envs) {
    if (typeof math !== 'string' || F.ARABE.test(math)) return 'ignoree';
    if (!envs || !envs.length) return 'ignoree';
    const parts = partiesVerifiables(math);
    if (!parts.length) return 'ignoree';
    for (const env of envs) {
      for (const part of parts) {
        let r;
        try { r = F.verifierComparaison(part, env); }
        catch (e) { return 'ignoree'; }
        if (r) return 'fausse';
      }
    }
    return 'vraie';
  }

  const API = { environnements, evaluerEtape, ECHANTILLONS };
  if (M) module.exports = API; else racine.Juge = API;
})(typeof window !== 'undefined' ? window : globalThis);
