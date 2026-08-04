// EXTRAIRE LE JUGE d'une fiche — la seule pièce qui ne se factorise pas.
//
//   node _regles/extraire-juge.js <dossier> <globalNoyau> [fn1,fn2,…]
//
// Le juge est la fonction qui décide qu'une étape est vraie ou fausse. Elle vit
// dans le validateur de chaque fiche, et chaque fiche a la sienne — ce sont des
// chapitres différents, des environnements différents. On l'en SORT, dans un
// `juge.js` que le validateur ET les pages « أين الخطأ؟ » requièrent tous deux.
//
// C'est structurel, pas cosmétique : tant que la page se donnait son propre
// juge, elle pouvait déclarer fausse une étape que le validateur tenait pour
// vraie, et l'élève aurait eu raison de contester.
//
// Le tirage y devient DÉTERMINISTE. Le hasard convient au validateur — il
// multiplie les cas — mais pas au juge : une faute doit être fausse maintenant
// et fausse dans une seconde. La suite choisie est longue (41 × 9 couples),
// parce que certains énoncés n'ont de sens que sous contrainte et que le juge
// tire jusqu'à en trouver un cas permis.
const fs = require('fs');
const path = require('path');

const [, , dossier, globalNoyau, liste] = process.argv;
if (!dossier || !globalNoyau) {
  console.error('usage: node extraire-juge.js <dossier> <globalNoyau> [fn1,fn2,…]');
  process.exit(1);
}
const OUT = path.resolve(dossier);
const src = fs.readFileSync(path.join(OUT, 'verifier.js'), 'utf8');

// Les fonctions à emporter. Par défaut celles de la charpente commune ;
// une fiche qui en a d'autres les nomme.
const noms = (liste || 'environnements,construire,variables,completer,lier')
  .split(',').map(s => s.trim()).filter(Boolean);

// Découpe une déclaration de premier niveau en comptant ses accolades — une
// expression régulière ne saurait pas où la fonction s'arrête.
function decouper(nom) {
  const re = new RegExp('^(?:function ' + nom + '\\s*\\(|const ' + nom + '\\s*=)', 'm');
  const m = re.exec(src);
  if (!m) return null;
  // On remonte au commentaire qui précède : il explique la fonction, et il
  // doit voyager avec elle.
  let debut = m.index;
  const avant = src.slice(0, debut).split('\n');
  let k = avant.length - 1;
  while (k > 0 && /^\s*\/\//.test(avant[k - 1])) k--;
  debut = avant.slice(0, k).join('\n').length + (k ? 1 : 0);

  let i = src.indexOf('{', m.index), prof = 0;
  for (; i < src.length; i++) {
    if (src[i] === '{') prof++;
    else if (src[i] === '}') { prof--; if (!prof) break; }
  }
  while (i < src.length && src[i] !== '\n') i++;
  return src.slice(debut, i);
}

const morceaux = [];
const manquants = [];
noms.forEach(n => {
  const t = decouper(n);
  if (t) morceaux.push(t); else manquants.push(n);
});
if (!morceaux.length) { console.error('rien à extraire dans ' + OUT); process.exit(1); }

const ech = /const ECHANTILLONS\s*=\s*(\d+)/.exec(src);

// Certaines fiches ont une règle propre : dans une équation-produit, la chaîne
// décrit une DISJONCTION — « x = x1 ou x = x2 » — et chaque racine ne vaut que
// dans son cas. Le validateur le sait ; le juge extrait doit l'emporter avec
// lui, sinon il déclarerait fausses les étapes que le validateur tient pour
// vraies, et la page condamnerait du juste.
const dis = /const disjonction\s*=\s*([^;]+);/.exec(src);

const juge = `// LE JUGE de ${path.basename(OUT)} — partagé.
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
  const F = M ? require('./noyau.js') : racine.${globalNoyau};

  const ECHANTILLONS = ${ech ? Math.min(Number(ech[1]), 16) : 16};

  // La suite DÉTERMINISTE. Longue à dessein : certains énoncés n'ont de sens
  // que sous une contrainte (« a < b »), et le juge tire jusqu'à en trouver un
  // cas permis. Un cycle court la rendrait insatisfiable — c'est arrivé.
  let curseur = 0;
  const rnd = () => {
    const i = curseur++;
    const n = ((i * 37) % 41) - 20;
    return F.rat(n === 0 ? 7 : n, 1 + (i * 13) % 9);
  };

${morceaux.join('\n\n')}

  // 'vraie' | 'fausse' | 'ignoree'. « ignoree » couvre l'arabe et tout ce que
  // l'analyseur ne sait pas lire : on ne prétend rien sur ce qu'on ne calcule pas.
  function evaluerEtape(math, envs) {
    if (typeof math !== 'string' || F.ARABE.test(math)) return 'ignoree';
    try {
      let bon = 0;
      for (const env of envs) {
        const r = F.verifierRelation(String(math).replace(/×/g, '*'), env);
        if (r === null) { F.analyser(String(math).replace(/×/g, '*'), env); return 'ignoree'; }
        if (!r) bon++;
      }
      // Dans une disjonction, une étape qui tient dans UN cas est vraie ; partout
      // ailleurs elle doit tenir dans tous.
      return bon >= (envs.disjonction ? 1 : envs.length) ? 'vraie' : 'fausse';
    } catch (e) { return 'fausse'; }
  }

  // Le curseur REPART du même point à chaque question : sans cela deux appels
  // sur la même question ne donneraient pas les mêmes environnements, et le
  // juge cesserait d'être un juge.
  function envs(c) {
    curseur = 0;
    const out = environnements(c);
    out.disjonction = ${dis ? '!!(' + dis[1].trim() + ')' : 'false'};
    return out;
  }

  const API = { environnements: envs, evaluerEtape, ECHANTILLONS };
  if (M) module.exports = API; else racine.Juge = API;
})(typeof window !== 'undefined' ? window : globalThis);
`;

fs.writeFileSync(path.join(OUT, 'juge.js'), juge);
console.log('juge.js — ' + morceaux.length + ' fonction(s) emportée(s)'
            + (manquants.length ? ' ; absentes : ' + manquants.join(', ') : ''));
