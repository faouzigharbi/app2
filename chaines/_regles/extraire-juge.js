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

const [, , dossier, globalNoyau, liste, ...options] = process.argv;
// Deux choses varient d'un validateur à l'autre, et aucune ne se devine :
//   --relation=A   quel module porte verifierRelation (le noyau par défaut) ;
//   --un-seul      une étape vaut si elle tient dans AU MOINS un environnement.
// On les lit dans le validateur quand on peut, on les passe sinon.
const opt = {};
options.forEach(o => { const [k, v] = o.replace(/^--/, '').split('='); opt[k] = v || true; });
if (!dossier || !globalNoyau) {
  console.error('usage: node extraire-juge.js <dossier> <globalNoyau> [fn1,fn2,…]');
  process.exit(1);
}
const OUT = path.resolve(dossier);
const src = fs.readFileSync(path.join(OUT, 'verifier.js'), 'utf8');

// Les fonctions à emporter. Par défaut celles de la charpente commune ;
// une fiche qui en a d'autres les nomme.
const noms = (liste || 'rnd,environnements,construire,variables,completer,lier')
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

  // Une constante simple — « const LETTRES = ['a','b']; » — n'a pas
  // d'accolades : elle s'arrête à son point-virgule.
  const ouvre = src.indexOf('{', m.index);
  const finLigne = src.indexOf(';', m.index);
  if (ouvre < 0 || (finLigne >= 0 && finLigne < ouvre)) {
    return src.slice(debut, finLigne + 1);
  }
  let i = ouvre, prof = 0;
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

// Les modules que le validateur requiert en plus du noyau : le juge en a besoin
// des mêmes, sous les mêmes noms — « A.analyser » ne veut rien dire sans A.
const autres = [];
src.replace(/^const ([A-Z][A-Za-z]*) = require\('\.\/([^']+)'\);/gm, (m, nom, f) => {
  if (f !== 'noyau.js') {
    // Le nom global d'un module se lit dans le module lui-même : « else
    // racine.Alg = API ». On ne le devine pas, on va le chercher.
    let g = nom;
    try {
      const t = fs.readFileSync(path.join(OUT, f), 'utf8');
      const mm = /else\s+racine\.([A-Za-z]+)\s*=/.exec(t);
      if (mm) g = mm[1];
    } catch (e) { /* le module reste sous son nom local */ }
    autres.push("  const " + nom + " = M ? require('./" + f + "') : racine." + g + ";");
  }
  return m;
});

const unSeul = opt['un-seul']
  || /bon = true;[\s\S]{0,40}break;/.test(src);
const modRel = opt.relation
  || (/\b([A-Z][A-Za-z]*)\.verifierRelation\(/.exec(src) || [, 'F'])[1];

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
  const NOYAU = M ? require('./noyau.js') : racine.${globalNoyau};
${autres.join('\n')}
  const ECHANTILLONS = ${ech ? Math.min(Number(ech[1]), 16) : 16};

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

${morceaux.join('\n\n')}

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
        try { r = ${modRel}.verifierRelation(String(math).replace(/×/g, '*'), env); }
        catch (e) { continue; }
        lisible = true;
        if (r === null) { ${modRel}.analyser(String(math).replace(/×/g, '*'), env); return 'ignoree'; }
        if (!r) bon++;
      }
      if (!lisible) return 'fausse';
      // Ce que le validateur de CETTE fiche exige, et rien d'autre : ${unSeul
        ? "une étape\n      // vaut si elle tient dans au moins un environnement"
        : "une étape\n      // doit tenir dans TOUS les environnements — sauf disjonction"}.
      const attendu = ${unSeul ? '1' : '(envs.disjonction ? 1 : envs.length)'};
      return bon >= attendu ? 'vraie' : 'fausse';
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
