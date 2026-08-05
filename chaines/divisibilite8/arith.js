// Outils communs aux quatre problèmes de PGCD / PPCM (ق.م.أ و م.م.أ).
//
// Les quatre générateurs vivent chacun dans son fichier (gen13 … gen16) et
// s'enregistrent ici. Fonctionne dans le navigateur et sous Node.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports)
    ? require('./moteur.js') : racine.Moteur;
  const { ent, choix } = M;

  // -------------------------------------------------------------------------
  // Arithmétique
  // -------------------------------------------------------------------------
  const pgcd = (a, b) => (b ? pgcd(b, a % b) : a);
  const pgcdN = t => t.reduce(pgcd);
  const ppcm = (a, b) => a / pgcd(a, b) * b;
  const ppcmN = t => t.reduce(ppcm);

  // Décomposition en facteurs premiers : [[p, exposant], …]
  function facteurs(n) {
    const out = [];
    for (let p = 2; p * p <= n; p++) {
      let e = 0;
      while (n % p === 0) { n /= p; e++; }
      if (e) out.push([p, e]);
    }
    if (n > 1) out.push([n, 1]);
    return out;
  }

  const pui = (b, e) => (e === 1 ? String(b) : b + '^' + e);
  const ecrire = f => f.map(([p, e]) => pui(p, e)).join(' × ');
  const decomposer = n => n + ' = ' + ecrire(facteurs(n));

  const diviseurs = n => {
    const out = [];
    for (let i = 1; i <= n; i++) if (n % i === 0) out.push(i);
    return out;
  };

  // Réunion des facteurs : plus grand exposant (PPCM), plus petit (PGCD).
  function combiner(nombres, mode) {
    const table = {};
    const listes = nombres.map(facteurs);
    for (const f of listes) for (const [p, e] of f) {
      if (mode === 'max') table[p] = Math.max(table[p] || 0, e);
      else table[p] = (table[p] === undefined) ? e : Math.min(table[p], e);
    }
    if (mode === 'min') {                      // un premier absent d'un nombre sort
      for (const p of Object.keys(table)) {
        if (!listes.every(f => f.some(([q]) => String(q) === p))) delete table[p];
      }
    }
    const paires = Object.keys(table).map(Number).sort((a, b) => a - b)
      .map(p => [p, table[p]]);
    return { paires, texte: paires.length ? ecrire(paires) : '1',
             valeur: paires.reduce((r, [p, e]) => r * Math.pow(p, e), 1) };
  }

  // -------------------------------------------------------------------------
  // Rendu — puissances en <sup>, expressions isolées en dir="ltr"
  // -------------------------------------------------------------------------
  const sup = s => String(s).replace(/\^(\d+)/g, '<sup>$1</sup>');
  const bloc = s => '<span dir="ltr" style="display:inline-block;white-space:nowrap">'
    + sup(s) + '</span>';
  const RUN = /[0-9A-Za-z+\-*×÷/:=^().,]+(\s+[0-9A-Za-z+\-*×÷/:=^().,]+)*/g;

  function isoMixte(texte) {
    return String(texte).replace(RUN, m => {
      const n = m.trim();
      if (!/\d/.test(n) || !/[+\-*×÷/=^]|\d\s*:\s*\d/.test(n)) return m;
      const i = m.indexOf(n);
      return m.slice(0, i) + bloc(n) + m.slice(i + n.length);
    });
  }

  const estMath = s => /^[\d\s+\-*×÷/:=^().]+$/.test(String(s));
  const rendreMath = s => (estMath(s) ? bloc(String(s).trim()) : isoMixte(s));

  function rendre(brut) {
    return {
      operation: rendreMath(brut.enonce),
      // LA DIFFICULTÉ SE COMPTE EN NOTIONS, pas en étapes.
      //
      // Une notion, c'est une FORMULE APPLIQUÉE. Un exercice qui applique
      // Pythagore trois fois n'est pas difficile — il est long ; celui qui
      // enchaîne Pythagore, la relation métrique et le cercle circonscrit
      // l'est, parce qu'il faut savoir laquelle choisir à chaque fois.
      //
      //     1 notion → facile · 2 ou 3 → moyen · 4 et plus → difficile
      //
      // Les chapitres de géométrie nomment la règle sous « القاعدة » : c'est
      // sa VALEUR qui distingue. Les chapitres de calcul la nomment dans
      // l'étiquette même — « نفس الأساس », « نجمع الأسّة ». On prend donc l'une
      // ou l'autre, et l'on écarte ce qui n'est qu'ossature.
      difficulte: (() => {
        const CADRE = /المعطيات|النتيجة|نطبّق|نحسب|^[0-9]+\)$/;
        const notions = new Set();
        for (const e of (brut.etapes || [])) {
          if (CADRE.test(e[0])) continue;
          notions.add(/القاعدة/.test(e[0]) ? String(e[1]) : String(e[0]));
        }
        const n = notions.size;
        return n <= 1 ? 'facile' : (n <= 3 ? 'moyen' : 'difficile');
      })(),
      steps: brut.etapes.map(e => e[0] + ': ' + rendreMath(e[1])),
      hint: brut.indice
    };
  }

  // -------------------------------------------------------------------------
  // Registre : chaque genNN.js s'y déclare
  // -------------------------------------------------------------------------
  const PROBLEMES = {};
  const enregistrer = (n, def) => { PROBLEMES[n] = def; };

  const PAR_PAGE = 3;

  function tirer(n, combien) {
    const out = [];
    for (let i = 0; i < (combien || PAR_PAGE); i++) out.push(PROBLEMES[n].f());
    return out;
  }

  function construire(n) {
    return {
      id: 'ex' + n,
      title: 'التمرين ' + n + ' — ' + PROBLEMES[n].titre,
      questions: tirer(n).map(rendre)
    };
  }

  const API = { ent, choix, pgcd, pgcdN, ppcm, ppcmN, facteurs, diviseurs,
                pui, ecrire, decomposer, combiner, rendreMath, rendre, tirer, construire,
                enregistrer, PROBLEMES, PAR_PAGE };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Arith = API;
})(typeof window !== 'undefined' ? window : globalThis);
