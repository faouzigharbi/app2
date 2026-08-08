/* Devoirati — test de non-régression du noyau et des générateurs.
   Usage : node tools/selftest.js
   Vérifie l'arithmétique exacte, puis martèle chaque générateur sur chaque
   niveau avec de nombreuses graines : aucun tirage ne doit lever d'exception
   ni produire un exercice incomplet ou une réponse non réduite. */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const FILES = [
  'assets/js/core/frac.js',
  'assets/js/core/rng.js',
  'assets/js/core/render.js',
  'assets/js/core/registry.js',
  'assets/js/core/worksheet.js',
  'assets/js/generators/fractions.js',
  'assets/js/generators/puissances.js'
];

const sandbox = { window: {}, console };
vm.createContext(sandbox);
for (const f of FILES) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sandbox, { filename: f });
}
const DV = sandbox.window.DV;

let failures = 0;
let checks = 0;

function check(label, cond, detail) {
  checks++;
  if (!cond) {
    failures++;
    console.error('✗ ' + label + (detail ? ' — ' + detail : ''));
  }
}

/* ---------- 1. arithmétique exacte ---------- */

const F = DV.Frac;
check('normalisation du signe', new F(1, -2).n === -1 && new F(1, -2).d === 2);
check('réduction automatique', new F(6, 8).toString() === '3/4');
check('addition', new F(1, 2).add(new F(1, 3)).toString() === '5/6');
check('soustraction négative', new F(1, 3).sub(new F(1, 2)).toString() === '-1/6');
check('produit réduit', new F(2, 3).mul(new F(3, 4)).toString() === '1/2');
check('quotient', new F(3, 4).div(new F(2, 5)).toString() === '15/8');
check('puissance négative', new F(2, 3).pow(-2).toString() === '9/4');
check('entier', new F(4, 2).isInt());
check('décimal 3/4', new F(3, 4).isDecimal());
check('non décimal 1/3', !new F(1, 3).isDecimal());
check('décimal après réduction 9/12', new F(9, 12).isDecimal());
check('division par zéro refusée', (() => {
  try { new F(1, 2).div(new F(0, 5)); return false; } catch (e) { return true; }
})());
check('dénominateur nul refusé', (() => {
  try { new F(1, 0); return false; } catch (e) { return true; }
})());
check('pgcd', DV.gcd(84, 36) === 12);
check('ppcm', DV.lcm(4, 6) === 12);
check('factorisation 84', JSON.stringify(DV.factorize(84)) === JSON.stringify([[2, 2], [3, 1], [7, 1]]));

/* ---------- 2. déterminisme du générateur aléatoire ---------- */

const r1 = new DV.Rng('ABC123');
const r2 = new DV.Rng('ABC123');
const s1 = [], s2 = [];
for (let i = 0; i < 50; i++) { s1.push(r1.int(1, 1000)); s2.push(r2.int(1, 1000)); }
check('même graine → même suite', JSON.stringify(s1) === JSON.stringify(s2));
check('graines différentes → suites différentes',
  JSON.stringify(s1) !== JSON.stringify(Array.from({ length: 50 }, () => new DV.Rng('ZZZ999').int(1, 1000))));

const rb = new DV.Rng('bornes');
let bornesOk = true;
for (let i = 0; i < 500; i++) {
  const v = rb.int(10, 3);            // bornes volontairement inversées
  if (v < 3 || v > 10) bornesOk = false;
}
check('int() tolère des bornes inversées', bornesOk);

/* ---------- 3. tous les générateurs, tous les niveaux ---------- */

const SEEDS = 300;
const stats = [];

for (const gen of DV.registry.all()) {
  for (const level of gen.levels) {
    let ok = 0;
    const rng = new DV.Rng('selftest|' + gen.id + '|' + level.id);
    for (let i = 0; i < SEEDS; i++) {
      let ex;
      try {
        ex = DV.registry.makeSafe(gen, rng, level.id);
      } catch (e) {
        check(gen.id + '/' + level.id + ' génère sans erreur', false, e.message);
        break;
      }

      const tag = gen.id + '/' + level.id + ' #' + i;
      if (!ex.prompt || !ex.prompt.trim()) { check(tag + ' énoncé non vide', false); break; }
      if (!ex.answerHTML) { check(tag + ' réponse affichable', false); break; }
      if (!Array.isArray(ex.steps) || !ex.steps.length) { check(tag + ' correction non vide', false); break; }
      if (ex.steps.some(s => !s || !String(s).trim())) { check(tag + ' aucune étape vide', false); break; }

      const a = ex.answer;
      if (!a || !['frac', 'int', 'bool'].includes(a.kind)) { check(tag + ' type de réponse valide', false); break; }
      if (a.kind === 'frac') {
        if (!(a.frac instanceof F)) { check(tag + ' réponse fraction typée', false); break; }
        if (DV.gcd(a.frac.n, a.frac.d) !== 1 || a.frac.d <= 0) {
          check(tag + ' réponse réduite', false, a.frac.toString()); break;
        }
      }
      if (a.kind === 'int' && !Number.isInteger(a.value)) { check(tag + ' réponse entière', false); break; }
      if (a.kind === 'bool' && typeof a.value !== 'boolean') { check(tag + ' réponse booléenne', false); break; }

      /* Le HTML produit doit être équilibré sur les balises que nous générons. */
      const opens = (ex.prompt.match(/<span/g) || []).length;
      const closes = (ex.prompt.match(/<\/span>/g) || []).length;
      if (opens !== closes) { check(tag + ' balises span équilibrées', false, opens + '/' + closes); break; }

      ok++;
    }
    stats.push([gen.id, level.id, ok]);
    check(gen.id + '/' + level.id + ' : ' + SEEDS + ' tirages valides', ok === SEEDS, ok + '/' + SEEDS);
  }
}

/* ---------- 4. propriétés mathématiques vérifiables ---------- */

/* Les fractions décimales : la réponse doit coïncider avec un calcul indépendant. */
const decGen = DV.registry.get('fractions-decimales');
let decOk = true;
for (const level of decGen.levels) {
  const rng = new DV.Rng('dec|' + level.id);
  for (let i = 0; i < 200; i++) {
    const ex = DV.registry.makeSafe(decGen, rng, level.id);
    const m = ex.prompt.match(/m-num">(\d+)<.*?m-den">(\d+)</s);
    if (!m) { decOk = false; break; }
    let d = parseInt(m[2], 10) / DV.gcd(parseInt(m[1], 10), parseInt(m[2], 10));
    while (d % 2 === 0) d /= 2;
    while (d % 5 === 0) d /= 5;
    if ((d === 1) !== ex.answer.value) { decOk = false; break; }
  }
}
check('fractions décimales : verdict conforme au calcul indépendant', decOk);

/* Les puissances : l'exposant annoncé doit être celui affiché dans la réponse. */
let powOk = true;
for (const gen of DV.registry.all().filter(g => g.chapter === 'puissances')) {
  for (const level of gen.levels) {
    const rng = new DV.Rng('pow|' + gen.id + '|' + level.id);
    for (let i = 0; i < 200; i++) {
      const ex = DV.registry.makeSafe(gen, rng, level.id);
      const m = ex.answerHTML.match(/<sup[^>]*>(-?\d+)<\/sup>/);
      if (!m || parseInt(m[1], 10) !== ex.answer.value) { powOk = false; break; }
    }
  }
}
check('puissances : exposant attendu = exposant affiché', powOk);

/* ---------- 5. fiche imprimable ---------- */

const sheet = DV.worksheet.build({
  title: 'Test',
  seed: 'TEST01',
  columns: 2,
  correction: 'detaillee',
  sections: [
    { generatorId: 'fractions-somme', level: 'moyen', count: 6 },
    { generatorId: 'puissances-produit', level: 'facile', count: 4 }
  ]
});
check('fiche : 10 exercices numérotés', sheet.count === 10, String(sheet.count));
check('fiche : page élève + page corrigé', (sheet.html.match(/<article class="sheet/g) || []).length === 2);
check('fiche : numérotation continue', sheet.html.includes('start="7"'));

const again = DV.worksheet.build({
  title: 'Test', seed: 'TEST01', columns: 2, correction: 'detaillee',
  sections: [
    { generatorId: 'fractions-somme', level: 'moyen', count: 6 },
    { generatorId: 'puissances-produit', level: 'facile', count: 4 }
  ]
});
check('fiche : même code → fiche identique', again.html === sheet.html);

const other = DV.worksheet.build({
  title: 'Test', seed: 'TEST02', columns: 2, correction: 'detaillee',
  sections: [{ generatorId: 'fractions-somme', level: 'moyen', count: 6 }]
});
check('fiche : code différent → fiche différente', !other.html.includes(sheet.html.slice(2000, 2200)));

check('fiche : générateur inconnu rejeté', (() => {
  try { DV.worksheet.build({ seed: 'X', sections: [{ generatorId: 'nope', level: 'a', count: 2 }] }); return false; }
  catch (e) { return true; }
})());

/* ---------- rapport ---------- */

console.log('');
stats.forEach(([g, l, n]) => console.log('  ' + (n === SEEDS ? '✓' : '✗') + ' ' + g + ' / ' + l + ' : ' + n + '/' + SEEDS));
console.log('');
console.log(checks + ' vérifications, ' + failures + ' échec(s).');
process.exit(failures ? 1 : 0);
