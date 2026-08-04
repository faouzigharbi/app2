// LE JUGE de arith9 — partagé.
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
  const F = M ? require('./noyau.js') : racine.Arith;
  const C = M ? require('./criteres.js') : racine.Crit;
  const P = M ? require('./puissances.js') : racine.Puiss;
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

// -------------------------------------------------------------------------
// Les environnements dans lesquels chaque étape doit se vérifier.
// La plupart des chaînes ne portent aucune lettre : leur environnement est
// vide, et l'étape doit tenir telle quelle. Celles qui en portent une doivent
// tenir POUR TOUTES ses valeurs — ce sont des identités.
// -------------------------------------------------------------------------
const LETTRES = ['n', 'x', 'y', 'a', 'b', 'k', 'm', 'p', 'q', 'z'];

function environnements(c) {
  if (c.type === 'valeur') {
    const e = envAleatoire();
    e[c.variable || 'n'] = F.rat(c.x0);
    return [nommer(c, e)];
  }
  return Array.from({ length: 12 }, () => nommer(c, envAleatoire(c.eviter)));
}

function envAleatoire(eviter) {
  const e = {};
  LETTRES.forEach(l => {
    let v;
    do { v = F.ent(1, 30); } while (eviter !== undefined && v === eviter);
    e[l] = F.rat(v);
  });
  return e;
}

// Une chaîne peut nommer son expression — « M = 6 + 32/(n + 2) ». Le nom n'est
// pas une variable libre : il DÉSIGNE l'expression de l'énoncé, et c'est elle
// qui lui donne sa valeur dans chaque environnement.
function nommer(c, e) {
  if (c.nom) e[c.nom] = F.analyser(c.source, e);
  return e;
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
