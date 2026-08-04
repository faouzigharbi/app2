// LE JUGE DES FICHES D'ARITHMÉTIQUE — écrit une fois, déposé dans chacune.
//
//   node _regles/juge-nat.js <dossier> <globalMoteur> [--moteur=moteur.js]
//
// Cinq fiches — diviseurs7, pgcd7, premiers7, naturels7, divisibilite8 —
// partagent le même moteur : `evalNat`, qui évalue une expression d'entiers
// naturels. Leurs étapes ne sont pas des relations sur des inconnues mais des
// ÉGALITÉS NUMÉRIQUES FERMÉES, parfois plusieurs dans la même ligne, séparées
// par « و ». Il n'y a donc pas d'environnement à tirer, et rien à rendre
// déterministe : il n'y avait pas de hasard.
//
// Trois abstentions, et elles comptent :
//
//   — « = 8 » sans membre gauche annonce le résultat de la chaîne, il ne se
//     calcule pas tout seul ;
//   — une puissance astronomique — 3^65 déjà, 3^1357 à plus forte raison —
//     sort de l'entier exact du nombre flottant. Passé 2^53, deux écritures
//     d'un même nombre s'arrondissent différemment, et le juge déclarerait
//     fausse une identité vraie. Il l'a fait : « 3 × 3^65 + ... = 3^65 × (...) »
//     comptée fausse dans une chaîne juste. Il s'abstient désormais ;
//   — tout ce qui n'est pas une égalité purement numérique : l'arabe, les
//     ensembles « { 1 ; 2 ; 4 } », les phrases.
//
// Ce qu'il déclare FAUX : une égalité dont les deux membres diffèrent, et une
// division non exacte ou un résultat intermédiaire négatif — ce que le
// validateur de chaque fiche compte déjà comme un grief.
const fs = require('fs');
const path = require('path');

const [, , dossier, globalMoteur, ...options] = process.argv;
if (!dossier || !globalMoteur) {
  console.error('usage: node juge-nat.js <dossier> <globalMoteur> [--moteur=moteur.js]');
  process.exit(1);
}
const opt = {};
options.forEach(o => { const [k, v] = o.replace(/^--/, '').split('='); opt[k] = v || true; });
const moteur = opt.moteur || 'moteur.js';
const OUT = path.resolve(dossier);

const juge = `// LE JUGE de ${path.basename(OUT)} — partagé.
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
  const MOT = M ? require('./${moteur}') : racine.${globalMoteur};

  // Une égalité PUREMENT numérique : c'est la seule chose que ce moteur sache
  // juger. Le reste — l'arabe, les listes de diviseurs — est laissé de côté.
  const PUR = /^[\\d\\s+\\-*×÷/:=^().]+$/;
  const egalites = t => String(t).split(' و ').map(x => x.trim())
    .filter(x => PUR.test(x) && x.includes('=') && /\\d/.test(x));

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
`;

fs.writeFileSync(path.join(OUT, 'juge.js'), juge);
console.log('juge.js — moteur ' + moteur + ' (global ' + globalMoteur + ')');
