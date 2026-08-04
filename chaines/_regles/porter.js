// LE PORTEUR — installe les pages « أين الخطأ؟ » dans une fiche.
//
//   node _regles/porter.js <dossier> <globalNoyau> <règle,règle,…>
//
// Il écrit deux fichiers dans la fiche, et n'en modifie aucun autre :
//
//   erreurs.js         — le catalogue de CETTE fiche : la machinerie commune,
//                        et les seules règles que son chapitre enseigne ;
//   _build_erreurs.js  — le générateur de ses pages errNN.html.
//
// Le dossier garde son autonomie : les deux fichiers émis sont complets, on
// peut déposer la fiche telle quelle. Mais la SOURCE des règles reste unique —
// `_regles/catalogue.js` —, si bien qu'une règle corrigée se rejoue partout
// d'un seul passage du porteur.
//
// Ce que le porteur suppose déjà en place dans la fiche : un `juge.js` qui
// expose `environnements(controle)` et `evaluerEtape(math, envs)`. C'est la
// seule pièce qui ne se factorise pas — chaque fiche a son moteur — et c'est
// elle qu'on extrait du validateur, pour que la page et le validateur jugent
// avec la MÊME fonction.
const fs = require('fs');
const path = require('path');
const C = require('./catalogue.js');

const [, , dossier, globalNoyau, listeRegles, ...reste] = process.argv;
if (!dossier || !globalNoyau || !listeRegles) {
  console.error('usage: node porter.js <dossier> <globalNoyau> <r1,r2,…> [options]');
  process.exit(1);
}
const OUT = path.resolve(dossier);
const ids = listeRegles.split(',').map(s => s.trim()).filter(Boolean);
const opts = {};
reste.forEach(o => { const [k, v] = o.split('='); opts[k.replace(/^--/, '')] = v || true; });
// Toutes les fiches n'appellent pas leur noyau « noyau.js » : celles
// d'arithmétique l'appellent arith.js ou moteur.js. On le dit, on ne le devine pas.
const noyau = (typeof opts.noyau === 'string') ? opts.noyau : 'noyau.js';

const choisies = ids.map(id => {
  const r = C.REGLES.find(x => x.id === id);
  if (!r) { console.error('règle inconnue: ' + id); process.exit(1); }
  return r;
});

// Le corps d'une règle, recopié tel quel depuis le catalogue. On n'écrit pas
// « voici à peu près la règle » : on écrit LA règle, celle qui a été relue.
const source = r => '    {\n'
  + "      nom: " + JSON.stringify(r.nom) + ",\n"
  + "      quoi: " + JSON.stringify(r.quoi) + ",\n"
  + (r.geste ? "      geste: " + String(r.geste) + ",\n" : '')
  + '      faire: ' + String(r.faire).replace(/^faire/, 'function').replace(/\n/g, '\n  ')
  + '\n    }';

const interdit = opts.positif
  ? "  // Programme où le nombre négatif n'existe pas encore : une faute qui en\n"
    + "  // produirait serait hors sujet plutôt que fausse.\n"
    + "  const NEGATIF = /(^|[(:=×*+\\-\\/])\\s*-\\s*\\d/;\n"
    + "  const interdit = s => NEGATIF.test(s);\n"
  : "  const interdit = () => false;\n";

const fichier = `// Les pages « أين الخطأ؟ » — ${path.basename(OUT)}.
//
// ENGENDRÉ PAR _regles/porter.js — ne pas éditer à la main. Les règles vivent
// dans _regles/catalogue.js ; une correction s'y fait, puis se rejoue ici.
//
// Dans la chaîne, les étapes sont JUSTES et EN DÉSORDRE : l'élève reconstruit
// le raisonnement. Ici elles sont DANS L'ORDRE et l'une d'elles est FAUSSE :
// l'élève juge le raisonnement.
//
// LES SEPT RÈGLES DU CONTRAT :
//   1. aucune fiche sans son validateur au vert ;
//   2. aucune faute de calcul — un chiffre changé ne viole aucune règle ;
//   3. la faute sur l'étape PIVOT, jamais sur la mise en place ni le résultat ;
//   4. quand aucune règle n'est en jeu, aucune faute : le corrigé reste juste
//      et l'élève doit le dire ;
//   5. MAIN reste ouverte aux fautes vues dans les copies ;
//   6. on dit ce qu'on n'a pas pu faire ;
//   7. jamais deux fois la même faute à la suite.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./${noyau}') : racine.${globalNoyau};
  const J = M ? require('./juge.js') : racine.Juge;

${interdit}
  // ── Outils de découpe ───────────────────────────────────────────────────
${String(C.termes).replace(/^function/, '  function').replace(/\n/g, '\n  ').replace(/\n  $/, '\n')}

${String(C.relation).replace(/^function/, '  function').replace(/\n/g, '\n  ').replace(/\n  $/, '\n')}

  const recoller = ${String(C.recoller)};

${String(C.monome).replace(/^function/, '  function').replace(/\n/g, '\n  ').replace(/\n  $/, '\n')}

  const estMajal = ${String(C.estMajal)};
  const sansSigne = ${String(C.sansSigne)};

  // L'adaptateur : les fiches n'ont pas toutes le même noyau, les règles ne
  // connaissent que ces noms-là.
  const A = {
    ent: F.ent, choix: F.choix, pgcd: F.pgcd,
    txt: F.txt || F.sTxt || F.rTxt,
    add: F.add || F.sAdd, sub: F.sub || F.sSub, mul: F.mul || F.sMul,
    val: t => { try { return F.analyser(String(t).replace(/×/g, '*'), {}); }
                catch (e) { return null; } },
    // Les fiches d'arithmétique CALCULENT : leur juge expose l'évaluation en
    // entiers naturels, et les règles de puissance et de priorité s'en
    // servent. Les autres fiches n'en ont pas, et ces règles s'y abstiennent.
    nat: (typeof J.nat === 'function') ? J.nat : null
  };

  // Une faute doit rester CRÉDIBLE : ce qu'un élève écrit vraiment. On refuse
  // les écritures qu'aucune copie ne porte — une faute qui se repère à sa
  // laideur plutôt qu'à son erreur n'apprend rien.
  //
  // Le contrôle porte sur ce que la faute INTRODUIT, jamais sur ce que l'étape
  // portait déjà : une fiche qui met des fractions au même dénominateur écrit
  // « 35/15 » à chaque ligne, et refuser toute fraction non réduite y
  // interdirait toutes les fautes. C'est arrivé — et cela avait tué en silence
  // les deux règles du chapitre.
  function credible(s, vrai) {
    if (interdit(s)) return false;
    if (/(^|[^\\w])1\\s*[a-zA-Z(√]/.test(s)) return false;              // « 1x »
    if (/(^|[^\\w])([a-zA-Z])\\s+\\2([^\\w]|$)/.test(s)) return false;   // « x x »
    if (/[+\\-]\\s*[+\\-]/.test(s)) return false;                           // « --13/5 »
    const dejaLa = new Set(String(vrai || '').match(/\\d+\\/\\d+/g) || []);
    let m; const re = /(\\d+)\\/(\\d+)/g;
    while ((m = re.exec(s))) {
      if (dejaLa.has(m[0])) continue;
      if (Number(m[2]) === 1) return false;                            // « 3/1 »
      if (F.pgcd(Number(m[1]), Number(m[2])) !== 1) return false;      // « 4/2 »
    }
    const r = relation(s);
    if (r) for (let i = 1; i < r.membres.length; i++) {
      if (r.membres[i].trim() === r.membres[i - 1].trim()) return false;
    }
    return true;
  }

  // ── Les règles de CE chapitre ───────────────────────────────────────────
  const FAMILLES = [
${choisies.map(source).join(',\n')}
  ];

  // ── Les fautes déclarées à la main, qui priment sur tout ────────────────
  //
  //   '3/2': [{ rang: 4, faux: '…', famille: '…', quoi: '…' }]
  //
  // Clé « numéro d'exercice / rang du volet ». C'est ici que viennent se poser
  // les fautes vues dans les copies. Le validateur les contrôle comme les
  // autres : une faute déclarée qui se trouverait vraie est rejetée.
  const MAIN = {};

  // ── La fabrique ─────────────────────────────────────────────────────────
  //
  //   interdites — les familles du volet PRÉCÉDENT. Deux fois la même faute à
  //   la suite et l'élève cesse de juger : il applique. L'interdit est donc
  //   dur ; si la question n'offre rien d'autre, on n'y met AUCUNE faute
  //   plutôt que de répéter.
  //   vues — les familles déjà rencontrées dans la page : simple pénalité.
  function fabriquer(question, fautes, interdites, vues, cle) {
    interdites = interdites || new Set();
    vues = vues || new Set();
    const c = question.controle;
    const envs = J.environnements(c);
    const juge = m => J.evaluerEtape(m, envs);

    const mains = (MAIN[cle] || []).filter(f => juge(f.faux) === 'fausse'
                                             && juge(question.etapes[f.rang][1]) === 'vraie');

    const sain = () => ({ controle: c, enonce: question.enonce,
                          indice: question.indice,
                          etapes: question.etapes.map(e => [e[0], e[1]]),
                          fautes: [], sain: true });

    const rangs = [];
    question.etapes.forEach(function (e, i) {
      if (juge(e[1]) === 'vraie') rangs.push(i);
    });
    // Il doit rester du vrai après la faute : une chaîne dont TOUT serait faux
    // ne demanderait plus de juger. Ce qui compte est le nombre d'étapes qui
    // restent debout, pas le nombre d'étapes calculables : une chaîne peut
    // n'avoir qu'une seule ligne de calcul et trois lignes de raisonnement en
    // arabe, et l'élève y juge très bien. C'est le cas d'un exercice entier de
    // rationnels8, qu'on rendait sain à chaque tirage faute de le voir.
    //
    // Et le NIVEAU est une intention, pas une exigence : quand la chaîne
    // n'offre pas de quoi placer deux fautes, on en place une plutôt que de
    // rendre le volet sain. Un volet sain doit être un choix — « aucune règle
    // n'est en jeu ici » — jamais un aveu d'impuissance.
    fautes = Math.min(fautes, rangs.length, question.etapes.length - 2);
    if (fautes < 1) return sain();

    function candidats(i) {
      const vrai = question.etapes[i][1];
      const libelle = question.etapes[i][0];
      const out = [];
      FAMILLES.forEach(function (fam, rang) {
        if (fam.geste && !fam.geste.test(libelle)) return;
        for (let essai = 0; essai < 8; essai++) {
          let faux;
          try { faux = fam.faire(vrai, A); } catch (e) { faux = null; }
          if (!faux || faux === vrai || !credible(faux, vrai)) continue;
          if (juge(faux) !== 'fausse') continue;
          out.push({ rang: i, faux: faux, vrai: vrai, famille: fam.nom,
                     quoi: fam.quoi, interdite: interdites.has(fam.nom),
                     priorite: rang + (vues.has(fam.nom) ? 20 : 0) });
          break;
        }
      });
      return out;
    }

    // ON CHOISIT LA FAUTE, PAS L'ÉTAPE : on énumère tous les couples
    // (étape, famille) de la chaîne entière et l'on prend le meilleur, où
    // qu'il soit. Tirer d'abord une étape ferait gagner les étapes pauvres.
    let tous = mains.map(f => ({ rang: f.rang, faux: f.faux,
                                 vrai: question.etapes[f.rang][1],
                                 famille: f.famille, quoi: f.quoi, priorite: -1 }));
    rangs.forEach(function (i) { tous = tous.concat(candidats(i)); });

    // AUCUNE FAUTE DE COMPRÉHENSION POSSIBLE ? On n'en invente pas.
    if (!tous.length) return sain();

    const choisies = [];
    for (let n = 0; n < fautes; n++) {
      const libres = tous.filter(x => choisies.every(c2 => c2.rang !== x.rang));
      if (!libres.length) return choisies.length ? finir(choisies) : sain();
      const permises = libres.filter(x => !x.interdite);
      if (!permises.length && !choisies.length) return sain();
      const base = permises.length ? permises : libres;
      const neuves = base.filter(x => choisies.every(c2 => c2.famille !== x.famille));
      const pool = neuves.length ? neuves : base;
      const min = Math.min.apply(null, pool.map(x => x.priorite));
      choisies.push(F.choix(pool.filter(x => x.priorite === min)));
    }
    return finir(choisies);

    // La phase « corrige » : la bonne réécriture, et deux leurres FAUX.
    //
    // Un leurre garde le PREMIER MEMBRE de l'étape. Les trois options sont lues
    // côte à côte comme trois réécritures d'une même ligne : celle qui change
    // le membre donné ne réécrit plus rien, elle change la question. On a vu
    // « √5 × √5 = 5 » se faire proposer « √10 = 5 » — l'élève n'y choisit plus,
    // il devine.
    //
    // Le contrôle ne vaut QUE pour l'égalité à deux membres — « donné = travail ».
    // Un encadrement « -3 < x < -2 » n'a pas de donné à gauche : ses trois
    // membres forment un seul énoncé, et tous ont le droit de bouger.
    function memeDonnee(leurre, vrai) {
      const a = relation(leurre), b = relation(vrai);
      if (!a || !b) return true;
      if (b.ops.length !== 1 || b.ops[0] !== '=') return true;
      return a.membres[0].trim() === b.membres[0].trim();
    }

    function finir(choisies) {
    choisies.sort((a, b) => a.rang - b.rang);
    choisies.forEach(function (f) {
      const opts = [f.vrai];
      for (let essai = 0; essai < 60 && opts.length < 3; essai++) {
        const fam = F.choix(FAMILLES);
        let leurre;
        try { leurre = fam.faire(f.vrai, A); } catch (e) { leurre = null; }
        if (!leurre || leurre === f.vrai || leurre === f.faux) continue;
        if (!credible(leurre, f.vrai) || opts.indexOf(leurre) >= 0) continue;
        if (!memeDonnee(leurre, f.vrai)) continue;
        if (juge(leurre) !== 'fausse') continue;
        opts.push(leurre);
      }
      f.choix = melanger(opts);
      f.bonne = f.choix.indexOf(f.vrai);
    });

    return {
      // La page emporte SON contrôle : sans lui, le validateur re-tirerait la
      // question et jugerait les étapes d'une page dans l'environnement d'une
      // autre.
      controle: c,
      enonce: question.enonce,
      indice: question.indice,
      etapes: question.etapes.map(function (e, i) {
        const f = choisies.find(x => x.rang === i);
        return [e[0], f ? f.faux : e[1]];
      }),
      fautes: choisies
    };
    }
  }

  function melanger(t) {
    const a = t.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = F.ent(0, i);
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  const complete = p => !!p && p.fautes.every(f => f.choix.length >= 2);

  function pageErreurs(n, fautes) {
    const vues = new Set();
    let precedentes = new Set();
    const qs = F.tirer(n);
    return qs.map(function (q, qi) {
      let dernier = null;
      const cle = n + '/' + (qi + 1);
      for (let essai = 0; essai < 10; essai++) {
        const p = fabriquer(q, fautes, precedentes, vues, cle)
               || fabriquer(q, 1, precedentes, vues, cle);
        if (!p) continue;
        dernier = p;
        if (complete(p)) break;
      }
      if (dernier) {
        precedentes = new Set(dernier.fautes.map(f => f.famille));
        dernier.fautes.forEach(f => vues.add(f.famille));
      }
      return dernier;
    }).filter(Boolean);
  }

  const API = { FAMILLES, MAIN, termes, relation, credible, fabriquer, pageErreurs };
  if (M) module.exports = API; else racine.Erreurs = API;
})(typeof window !== 'undefined' ? window : globalThis);
`;

fs.writeFileSync(path.join(OUT, 'erreurs.js'), fichier);
console.log('erreurs.js — ' + choisies.length + ' règles : '
            + choisies.map(r => r.id).join(', '));
