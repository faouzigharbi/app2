// LE JUGE de sommeq8 — partagé.
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
  const F = M ? require('./noyau.js') : racine.Somme;
  const S = M ? require('./formes.js') : racine.Formes;
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

// ---------------------------------------------------------------------------
// Les environnements admissibles : ce que l'énoncé permet, rien de plus.
// ---------------------------------------------------------------------------
function environnements(c) {
  if (c.type === 'equation') return [{ x: c.sol }];
  if (c.type === 'abs') return c.possible ? [{ x: c.m }, { x: F.neg(c.m) }] : [];
  // « قارن A و B » : A et B sont des nombres connus, mais la chaîne les
  // désigne par leur nom — il faut donc les lier dans l'environnement.
  if (c.type === 'nombres') return [{ [c.nomA]: c.vA, [c.nomB]: c.vB }];
  // Deux cas : x prend l'une puis l'autre valeur, le reste est tiré normalement.
  if (c.type === 'deux-cas') {
    return [c.x1, c.x2].map(x => construire(Object.assign({}, c,
      { fixes: Object.assign({}, c.fixes, { x }) })));
  }

  const out = [];
  const combien = (c.libres && c.libres.length) ? ECHANTILLONS : 1;
  for (let i = 0; i < combien; i++) {
    let env = null;
    // Certaines questions n'ont de sens que sous une contrainte (« a < b »).
    // On tire jusqu'à ce qu'elle soit satisfaite : l'environnement doit être
    // un cas que l'énoncé permet, sinon on vérifierait autre chose.
    for (let essai = 0; essai < 400 && !env; essai++) {
      const e = construire(c);
      if (!c.contrainte) { env = e; break; }
      const v = F.signe(F.analyser(c.contrainte.expr, e));
      if (v === c.contrainte.sens || (c.contrainte.large && v === 0)) env = e;
    }
    if (!env) throw new Error('contrainte impossible: ' + JSON.stringify(c.contrainte));
    out.push(env);
  }
  return out;
}

function construire(c) {
  {
    const env = {};
    (c.libres || []).forEach(v => { env[v] = rnd(); });
    Object.keys(c.fixes || {}).forEach(v => { env[v] = c.fixes[v]; });
    // Un énoncé peut lier plusieurs variables à la fois (« a - b = … et
    // c - a = … ») : on accepte une liste de liens, appliqués dans l'ordre.
    [].concat(c.lie || []).forEach(l => {
      const a = env[l.autre];
      env[l.nom] = l.via === 'somme' ? F.sub(l.valeur, a)
        : l.via === 'difference' ? F.sub(a, l.valeur)
        : l.via === 'plus' ? F.add(a, l.valeur)
        : l.via === 'oppose' ? F.neg(a) : a;
    });
    // Filet : une variable présente dans l'expression imprimée mais dont
    // l'énoncé ne dit rien (le « a » de l'exercice 8, le « y » du 4) doit
    // quand même recevoir une valeur — et une valeur qui change à chaque
    // tirage, sinon on ne verrait pas qu'elle s'élimine.
    variables(c).forEach(v => { if (!(v in env)) env[v] = rnd(); });
    return lier(c)(env);
  }
}

// Toutes les lettres qui apparaissent dans les expressions imprimées.
function variables(c) {
  const s = new Set();
  Object.keys(c.defs || {}).forEach(nom => {
    (String(c.defs[nom]).match(/[a-zA-Z]+/g) || []).forEach(v => s.add(v));
  });
  return Array.from(s);
}

// Un environnement construit à la main (une racine imposée, un couple choisi)
// n'a que les variables qu'on lui a données : les autres, présentes dans les
// expressions imprimées, doivent être complétées avant toute évaluation.
function completer(c, base) {
  const env = Object.assign({}, base);
  variables(c).forEach(v => { if (!(v in env)) env[v] = rnd(); });
  return lier(c)(env);
}

// Lie E, F, A, B … à leur définition imprimée : c'est ainsi que les étapes
// « E = … » deviennent vérifiables sans jamais consulter le générateur.
const lier = c => env => {
  Object.keys(c.defs || {}).forEach(nom => { env[nom] = F.analyser(c.defs[nom], env); });
  return env;
};

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
