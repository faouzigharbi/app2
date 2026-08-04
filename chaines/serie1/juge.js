// LE JUGE de serie1 — partagé.
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
  const NOYAU = M ? require('./noyau.js') : racine.Reel;

  const ECHANTILLONS = 16;

  // LE HASARD REMPLACÉ SOUS LE TIRAGE, plutôt qu'au-dessus.
  //
  // Chaque fiche a son « rnd » — l'une rend un rationnel, l'autre un réel de
  // ℚ[√d], une troisième un entier. Le réécrire pour chacune serait le
  // réinventer, et mal. On lui laisse donc son corps — il est extrait plus bas,
  // tel quel — et l'on remplace ce sur quoi il s'appuie : le noyau que le juge
  // lui donne tire ses entiers dans une suite fixe. La forme des valeurs reste
  // celle de la fiche ; seule leur imprévisibilité disparaît.
  //
  // Il le faut : le hasard convient au validateur — il multiplie les cas — mais
  // pas au juge. Une faute doit être fausse maintenant et fausse dans une
  // seconde, sinon l'élève pourrait contester à bon droit.
  let curseur = 0;
  const suite = (min, max) => {
    if (max === undefined) { max = min; min = 0; }
    const n = max - min + 1;
    if (n <= 0) return min;
    const i = curseur++;
    return min + (((i * 37) % 41) * 41 + i) % n;
  };
  const F = Object.assign({}, NOYAU, { ent: suite });

// Un rationnel non nul quelconque — les lettres de l'exercice 17 sont libres,
// et « ab = 1 » n'interdit que le zéro.
function rnd() {
  let n = 0;
  while (n === 0) n = F.ent(-9, 9);
  return F.S(F.rat(n, F.ent(1, 6)));
}

// Les environnements dans lesquels CHAQUE étape doit se vérifier.
//   c.env     — des expressions nommées, évaluées dans l'ordre : le B du 18
//               est défini à partir de son écriture en radicaux, pas de sa
//               valeur réduite, sinon on vérifierait la réponse par la réponse.
//   c.libres  — des lettres tirées au hasard, et c.derives ce qu'on en déduit.
function environnements(c) {
  if (c.libres) {
    return Array.from({ length: ECHANTILLONS }, () => {
      const e = {};
      c.libres.forEach(v => { e[v] = rnd(); });
      for (const nom in (c.derives || {})) e[nom] = F.analyser(c.derives[nom], e);
      return e;
    });
  }
  const e = {};
  for (const nom in (c.env || {})) e[nom] = F.analyser(c.env[nom], e);
  return [e];
}

  // 'vraie' | 'fausse' | 'ignoree'. « ignoree » couvre l'arabe et tout ce que
  // l'analyseur ne sait pas lire : on ne prétend rien sur ce qu'on ne calcule pas.
  function evaluerEtape(math, envs) {
    if (typeof math !== 'string' || F.ARABE.test(math)) return 'ignoree';
    // Aucun environnement : l'énoncé décrit un cas IMPOSSIBLE (« |x| = -3 »).
    // Il n'y a rien à juger, donc rien à planter — et surtout rien à condamner.
    if (!envs || !envs.length) return 'ignoree';
    try {
      let bon = 0, lisible = false;
      for (const env of envs) {
        // Le catch est PAR ENVIRONNEMENT, comme dans le validateur : un
        // environnement symbolique peut ne pas savoir évaluer « |x| » quand le
        // suivant le sait très bien. Abandonner au premier échec condamnerait
        // des étapes justes — et c'est arrivé.
        let r;
        try { r = F.verifierRelation(String(math).replace(/×/g, '*'), env); }
        catch (e) { continue; }
        lisible = true;
        if (r === null) { F.analyser(String(math).replace(/×/g, '*'), env); return 'ignoree'; }
        if (!r) bon++;
      }
      if (!lisible) return 'fausse';
      // Ce que le validateur de CETTE fiche exige, et rien d'autre : une étape
      // doit tenir dans TOUS les environnements — sauf disjonction.
      const attendu = (envs.disjonction ? 1 : envs.length);
      return bon >= attendu ? 'vraie' : 'fausse';
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
