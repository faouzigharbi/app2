// Valide les quatre chaînes de preuve sur un grand nombre de tirages.
//   node verifier.js [tirages]
//
// Contrôles, sur CHAQUE instance tirée :
//   1. chaque étape qui est une égalité de deux expressions calculables est
//      exacte — puissances comprises ;
//   2. la dernière étape annonce bien le résultat de la démonstration ;
//   3. au moins deux étapes sont réellement vérifiables : une chaîne
//      entièrement en prose passerait sinon sans contrôle ;
//   4. l'affirmation prouvée est vraie — le carré est bien un carré, le cube
//      un cube, le multiple un multiple, le produit un carré parfait ;
//   5. aucune étape dupliquée, et chaque expression est isolée en dir="ltr".
const M = require('./moteur.js');
const G = require('./generateurs.js');

const TIRAGES = Number(process.argv[2]) || 400;
const PUR = /^[\d\s+\-*×÷/=^().]+$/;
const strip = s => s.replace(/<sup>/g, '^').replace(/<[^>]+>/g, '');

let controles = 0, instances = 0;
const echecs = [];

function verifierBrut(n, brut) {
  const probs = [];
  let verifiees = 0;

  // 1-2) les étapes
  brut.etapes.forEach(([label, math], i) => {
    const t = String(math).trim();
    if (!PUR.test(t) || !/\d/.test(t)) return;
    const bad = [];
    try {
      if (t.includes('=')) {
        const k = t.indexOf('=');
        const g = t.slice(0, k).trim(), d = t.slice(k + 1).trim();
        if (!g) {
          if (Number(d) !== brut.res) probs.push(`م${i + 1}: تعلن ${d} بدل ${brut.res}`);
        } else if (M.evalNat(g, bad) !== M.evalNat(d, bad)) {
          probs.push(`م${i + 1}: « ${t} » خاطئة (${M.evalNat(g, [])} ≠ ${M.evalNat(d, [])})`);
        }
        verifiees++; controles++;
      }
      probs.push(...bad.map(b => `م${i + 1}: ${b}`));
    } catch (e) { probs.push(`م${i + 1}: تعذّر حساب « ${t} »`); }
  });

  const derniere = String(brut.etapes[brut.etapes.length - 1][1]).trim();
  if (!/^=\s*\d+$/.test(derniere)) probs.push('المرحلة الأخيرة لا تعلن النتيجة');

  // 3) une chaîne doit être calculable, pas seulement rédigée
  if (verifiees < 2) probs.push(`مراحل قابلة للتحقق: ${verifiees} فقط`);

  // 4) l'énoncé prouvé est-il vrai ?
  const dit = strip(brut.enonce[1]);
  try {
    if (n === 1) {
      const N = Number(dit);
      if (brut.res * brut.res !== N) probs.push(`${brut.res}^2 ≠ ${N}`);
    } else if (n === 2) {
      const N = Number(dit);
      if (Math.pow(brut.res, 3) !== N) probs.push(`${brut.res}^3 ≠ ${N}`);
    } else if (n === 3) {
      const m = dit.match(/A\s*=\s*([^و]+)و\s*B\s*=\s*(\d+)/);
      const A = M.evalNat(m[1].trim()), B = Number(m[2]);
      if (A % B !== 0) probs.push(`${A} ليس مضاعفا لـ ${B}`);
      if (A / B !== brut.res) probs.push(`خارج القسمة ${A / B} ≠ ${brut.res}`);
    } else {
      const c = brut.controle;
      if (c.a * c.b !== c.produit) probs.push('جداء غير متطابق');
      if (c.racine * c.racine !== c.produit) probs.push(`${c.racine}^2 ≠ ${c.produit}`);
      if (!Number.isInteger(Math.sqrt(c.produit))) probs.push('الجداء ليس مربعا كاملا');
    }
    controles++;
  } catch (e) { probs.push('تعذّر التحقق من الادعاء: ' + e.message); }

  // 5) ordre unique
  const textes = brut.etapes.map(e => e.join(': '));
  if (new Set(textes).size !== textes.length) probs.push('مراحل مكرّرة');
  if (textes.length < 4) probs.push('السلسلة قصيرة جدا');
  return probs;
}

// L'affichage doit isoler chaque expression, sinon elle s'inverse en RTL.
function verifierRendu(q) {
  const probs = [];
  for (const s of [q.operation].concat(q.steps)) {
    const nu = s.replace(/<span dir="ltr"[^>]*>[\s\S]*?<\/span>/g, '');
    if (/\d\s*[+\-*×÷^]\s*\d|\d\s*=/.test(nu)) probs.push('عبارة غير معزولة: ' + nu.trim());
  }
  return probs;
}

for (const n of Object.keys(G.PREUVES).map(Number)) {
  let mauvais = 0;
  const vus = new Set();
  for (let t = 0; t < TIRAGES; t++) {
    for (const brut of G.tirer(n)) {
      instances++;
      vus.add(strip(brut.enonce[1]));
      const probs = verifierBrut(n, brut).concat(verifierRendu(G.rendre(brut)));
      if (probs.length) {
        mauvais++;
        if (echecs.length < 12) {
          echecs.push(`preuve ${n}: ${strip(brut.enonce[1])}\n    - ` + probs.join('\n    - '));
        }
      }
    }
  }
  console.log(`preuve ${n} — ${G.PREUVES[n].titre}`
    + `  ${mauvais ? '✗ ' + mauvais + ' échec(s)' : '✓'}  (${vus.size} énoncés distincts)`);
}

if (echecs.length) console.log('\n' + echecs.join('\n'));
console.log(`\n${instances} instances tirées, ${controles} contrôles,`
  + ` ${echecs.length ? 'ÉCHECS' : '0 erreur'}.`);
process.exit(echecs.length ? 1 : 0);
