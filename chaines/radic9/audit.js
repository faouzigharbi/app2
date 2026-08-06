// AUDIT PÉDAGOGIQUE — au-delà de « est-ce vrai ? », « est-ce enseignable ? »
//   node audit.js [tirages]
//
// Le validateur dit si les mathématiques sont justes. Cet audit-ci dit si un
// professeur écrirait cela au tableau : pas de « + -3 », pas de « 1x », pas de
// parenthèse inutile, pas d'indice qui donne la réponse, une expression de
// départ qui a vraiment quelque chose à réduire, une forme réduite qui reste
// dans ℝ (donc qui garde un irrationnel), et une chaîne d'une longueur qu'on
// peut manipuler à l'écran.
const F = require('./noyau.js');
const R = require('./racines.js');
require('./exercices.js');
require('./gens.js');

const TIRAGES = Number(process.argv[2]) || 120;
const REGLES = [
  ['« + - » ou « - - » collés', t => /[+\-]\s*[+\-]\s*\d/.test(t)],
  ['coefficient 1 écrit', t => /(^|[\s(\[+\-])1\s*√/.test(t)],
  ['coefficient 0 ou terme nul', t => /(^|[\s(\[+\-])0\s*[a-zA-Zπ√]/.test(t) || /[+\-]\s*0(?![.,\d])/.test(t)],
  ['parenthèse vide', t => /\(\s*\)|\[\s*\]/.test(t)],
  ['parenthèses déséquilibrées', t => {
    let n = 0, m = 0;
    for (const c of t) { if (c === '(') n++; if (c === ')') n--; if (c === '[') m++; if (c === ']') m--; }
    return n !== 0 || m !== 0;
  }],
  ['barres de valeur absolue impaires', t => (t.match(/\|/g) || []).length % 2 !== 0],
  ['parenthèse enfermant du texte arabe', t => /\([^)]*[ء-ي][^)]*\)/.test(t)],
  ['fraction à dénominateur 1', t => /\/1(\D|$)/.test(t)],
  ['ligne trop longue pour un volet', t => t.length > 96]
];

let n = 0; const fautes = new Map();
const note = (regle, ou) => {
  if (!fautes.has(regle)) fautes.set(regle, []);
  const l = fautes.get(regle);
  if (l.length < 3) l.push(ou);
};

for (let t = 0; t < TIRAGES; t++) {
  for (const p of Object.keys(F.PROBLEMES).map(Number)) {
    for (const q of F.tirer(p)) {
      const lignes = q.enonce.filter(e => typeof e === 'string')
        .concat([q.indice]).concat(q.etapes.map(e => e[1]));
      for (const l of lignes) {
        n++;
        for (const [nom, test] of REGLES) if (test(l)) note(nom, 'ex' + p + ' — ' + l.slice(0, 80));
      }
      const c = q.controle;
      // la réponse doit être en forme canonique : plus aucun carré parfait
      // ne doit dormir sous un radical, sinon on n'a pas fini le travail
      if (c.type === 'valeur') {
        const carreDormant = /√(\d+)/g;
        let m;
        while ((m = carreDormant.exec(c.res))) {
          const e = R.extraire(Number(m[1]));
          if (e.dehors !== 1) note('carré parfait resté sous le radical', 'ex' + p + ' — ' + c.res);
        }
        if (/√1(\D|$)/.test(c.res)) note('√1 écrit au lieu de 1', 'ex' + p + ' — ' + c.res);
      }
      const fin = q.etapes[q.etapes.length - 1][1];
      const cle = String(fin).split('=').pop().trim();
      if (cle.length > 3 && q.indice.indexOf(cle) >= 0) {
        note('l’indice donne la réponse', 'ex' + p + ' — ' + q.indice.slice(0, 70));
      }
      if (q.etapes.length < 4) note('chaîne trop courte', 'ex' + p);
      if (q.etapes.length > 10) note('chaîne trop longue pour être glissée', 'ex' + p);
      const rappelle = q.enonce.some(e => typeof e === 'string' && /[=√]/.test(e));
      if (!rappelle) note('énoncé sans rappel de l’expression', 'ex' + p + ' — ' + q.enonce.join(' '));
    }
  }
}

console.log(n + ' lignes auditées sur ' + TIRAGES + ' tirages par exercice.\n');
if (!fautes.size) console.log('✓ aucune anomalie pédagogique.');
for (const [regle, ou] of fautes) {
  console.log('✗ ' + regle);
  ou.forEach(o => console.log('    ' + o));
}
process.exit(fautes.size ? 1 : 0);
