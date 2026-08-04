// Valide les quatre problèmes de PGCD / PPCM sur un grand nombre de tirages.
//   node verifier.js [tirages]
//
// Contrôles sur CHAQUE instance :
//   1. chaque égalité écrite dans une étape est exacte — plusieurs égalités
//      séparées par « و » dans la même étape sont contrôlées une par une ;
//   2. la dernière étape annonce le résultat ;
//   3. l'affirmation est vraie : le PPCM / PGCD annoncé est le bon, calculé
//      indépendamment du générateur ;
//   4. la réponse est UNIQUE dans l'intervalle donné — sans quoi la question
//      « ما هو عدد التلاميذ » n'aurait pas de réponse ;
//   5. périmètre, nombre d'arbres, prix et liste des diviseurs concordent ;
//   6. aucune étape dupliquée, chaque expression isolée en dir="ltr".
const M = require('./moteur.js');
const A = require('./arith.js');
require('./gen13.js'); require('./gen14.js');
require('./gen15.js'); require('./gen16.js');

const TIRAGES = Number(process.argv[2]) || 300;
const PUR = /^[\d\s+\-*×÷/:=^().]+$/;
const strip = s => s.replace(/<sup>/g, '^').replace(/<[^>]+>/g, '');

let controles = 0, instances = 0;
const echecs = [];

function egalites(texte) {
  return String(texte).split(' و ').map(x => x.trim())
    .filter(x => PUR.test(x) && x.includes('=') && /\d/.test(x));
}

function verifierBrut(brut) {
  const probs = [];
  let verifiees = 0;

  brut.etapes.forEach(([label, math], i) => {
    for (const eq of egalites(math)) {
      const k = eq.indexOf('=');
      const g = eq.slice(0, k).trim(), d = eq.slice(k + 1).trim();
      const bad = [];
      try {
        if (!g) {
          if (Number(d) !== brut.res) probs.push(`م${i + 1}: تعلن ${d} بدل ${brut.res}`);
        } else if (M.evalNat(g, bad) !== M.evalNat(d, bad)) {
          probs.push(`م${i + 1}: « ${eq} » خاطئة (${M.evalNat(g, [])})`);
        }
        verifiees++; controles++;
        probs.push(...bad.map(b => `م${i + 1}: ${b}`));
      } catch (e) { probs.push(`م${i + 1}: تعذّر حساب « ${eq} »`); }
    }
  });

  const derniere = String(brut.etapes[brut.etapes.length - 1][1]).trim();
  if (!/^=\s*\d+$/.test(derniere)) probs.push('المرحلة الأخيرة لا تعلن النتيجة');
  if (verifiees < 3) probs.push(`مراحل قابلة للتحقق: ${verifiees} فقط`);

  // L'affirmation elle-même, recalculée sans passer par le générateur.
  const c = brut.controle;
  try {
    if (c.type === 'ppcm') {
      const L = A.ppcmN(c.nb);
      if (L !== c.L) probs.push(`م.م.أ الحقيقي ${L} ≠ ${c.L}`);
      if (c.N % L !== 0) probs.push(`${c.N} ليس مضاعفا لـ ${L}`);
      if (!(c.N > c.min && c.N < c.max)) probs.push(`${c.N} خارج المجال`);
      let combien = 0;
      for (let m = L; m < c.max; m += L) if (m > c.min) combien++;
      if (combien !== 1) probs.push(`${combien} حلول في المجال — الجواب ليس وحيدا`);
    } else if (c.type === 'pgcd2') {
      const d = A.pgcd(c.a, c.b);
      if (d !== c.d) probs.push(`ق.م.أ الحقيقي ${d} ≠ ${c.d}`);
      if (2 * (c.a + c.b) !== c.perimetre) probs.push('المحيط خاطئ');
      if (c.perimetre % c.d !== 0) probs.push('عدد الأشجار ليس عددا صحيحا');
      if (c.perimetre / c.d !== c.arbres) probs.push('عدد الأشجار خاطئ');
      if (c.arbres * c.prixUnite !== c.total) probs.push('الثمن خاطئ');
    } else {
      const d = A.pgcdN(c.dims);
      if (d !== c.d) probs.push(`ق.م.أ الحقيقي ${d} ≠ ${c.d}`);
      for (const x of c.dims) if (x % c.d !== 0) probs.push(`${c.d} لا يقسم ${x}`);
      const vrais = A.diviseurs(c.d);
      if (vrais.join(',') !== c.divs.join(',')) probs.push('قائمة القواسم خاطئة');
      for (const v of c.divs) {
        if (!c.dims.every(x => x % v === 0)) probs.push(`${v} ليس قاسما مشتركا`);
      }
    }
    controles++;
  } catch (e) { probs.push('تعذّر التحقق: ' + e.message); }

  const textes = brut.etapes.map(e => e.join(': '));
  if (new Set(textes).size !== textes.length) probs.push('مراحل مكرّرة');
  if (textes.length < 4) probs.push('السلسلة قصيرة جدا');
  return probs;
}

function verifierRendu(q) {
  const probs = [];
  for (const s of [q.operation].concat(q.steps)) {
    const nu = s.replace(/<span dir="ltr"[^>]*>[\s\S]*?<\/span>/g, '');
    if (/\d\s*[+\-*×÷^]\s*\d|\d\s*=\s*\d/.test(nu)) probs.push('عبارة غير معزولة: ' + nu.trim());
  }
  return probs;
}

for (const n of Object.keys(A.PROBLEMES).map(Number).sort((a, b) => a - b)) {
  let mauvais = 0;
  const vus = new Set();
  for (let t = 0; t < TIRAGES; t++) {
    for (const brut of A.tirer(n)) {
      instances++;
      vus.add(brut.enonce);
      const probs = verifierBrut(brut).concat(verifierRendu(A.rendre(brut)));
      if (probs.length) {
        mauvais++;
        if (echecs.length < 12) echecs.push(`ex${n}: ${brut.enonce}\n    - ` + probs.join('\n    - '));
      }
    }
  }
  console.log(`ex${n} — ${A.PROBLEMES[n].titre}`
    + `  ${mauvais ? '✗ ' + mauvais + ' échec(s)' : '✓'}  (${vus.size} énoncés distincts)`);
}

if (echecs.length) console.log('\n' + echecs.join('\n'));
console.log(`\n${instances} instances tirées, ${controles} contrôles,`
  + ` ${echecs.length ? 'ÉCHECS' : '0 erreur'}.`);
process.exit(echecs.length ? 1 : 0);
