// LE JUGE de reel9 — partagé.
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
  const F = M ? require('./noyau.js') : racine.Reel;
  const A = M ? require('./algebre.js') : racine.Alg;
  const X = M ? require('./exercices.js') : racine.Exos;
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
  const envs = [nommer(c, {})];                         // symbolique
  const pose = sub => { envs.push(nommer(c, Object.assign({}, sub))); };
  if (c.type === 'substitution') { const s = {}; s[c.lettre] = lire(c.valeur); pose(s); }
  else if (c.type === 'equation' || c.type === 'valeurAbsolue') {
    const s = {}; s[c.lettre] = lire(c.solution); pose(s);
  } else if (c.type === 'absolue') {
    for (const sol of c.solutions) { const s = {}; s[c.lettre] = lire(sol); pose(s); }
  } else if (c.type === 'absolueIsolee') {
    if (c.possible) {
      const v = lire(c.valeur);
      for (const w of [v, A.oppose(v)]) { const s2 = {}; s2[c.lettre] = w; pose(s2); }
    }
  } else if (c.type === 'combinaison') {
    // « a + b = v » n'est pas une identité : les étapes qui l'utilisent ne
    // valent que SOUS l'hypothèse. On la matérialise en remplaçant a.
    pose({ a: A.moins(lire(c.valeur), A.fois(F.rat(c.signeB), A.un('b'))) });
  }
  return envs;
}

// Les environnements dans lesquels une étape a le droit d'être vraie.
// Le nom d'une expression — E, C, M… — n'est pas une inconnue : il DÉSIGNE
// l'expression de l'énoncé. Il faut donc le définir dans chaque environnement,
// sans quoi la moindre étape écrite « E = … » serait illisible.
function nommer(c, e) {
  if (c.noms) {
    for (const k of Object.keys(c.noms)) {
      try { e[k] = lire(c.noms[k], e); } catch (x) { /* nom indéfinissable ici */ }
    }
  }
  return e;
}

const lire = (t, env) => A.analyser(t, env);

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
        try { r = A.verifierRelation(String(math).replace(/×/g, '*'), env); }
        catch (e) { continue; }
        lisible = true;
        if (r === null) { A.analyser(String(math).replace(/×/g, '*'), env); return 'ignoree'; }
        if (!r) bon++;
      }
      if (!lisible) return 'fausse';
      // Ce que le validateur de CETTE fiche exige, et rien d'autre : une étape
      // vaut si elle tient dans au moins un environnement.
      const attendu = 1;
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
