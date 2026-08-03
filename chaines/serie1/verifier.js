// Valide les générateurs sur un grand nombre de tirages.
//   node verifier.js [tirages]
//
// Un générateur ne se relit pas : il faut l'exécuter. Chaque tirage est
// contrôlé sur les mêmes invariants que le contenu statique :
//   1. l'énoncé, calculé directement, vaut le résultat annoncé par la chaîne ;
//   2. chaque étape qui est une expression vaut le résultat final, chaque
//      étape qui est une égalité est exacte ;
//   3. aucun résultat négatif, aucune division inexacte, aucune décimale ;
//   4. aucune étape dupliquée — l'ordre attendu doit rester unique ;
//   5. chaque expression est isolée en dir="ltr".
const M = require('./moteur.js');
const { EXERCICES, construire } = require('./generateurs.js');

const TIRAGES = Number(process.argv[2]) || 400;
const PUR = /^[\d\s+\-*×÷/:=().[\]]+$/;
// Un énoncé à trou (« 61 + ... = 84 ») n'est pas une expression calculable.
const TROU = /\.{2,}|…/;
const strip = s => s.replace(/<[^>]+>/g, '');

let controles = 0, questions = 0;
const echecs = [];

function verifier(numero, q) {
  const probs = [];
  const steps = q.steps.map(strip);

  // Résultat annoncé par la dernière étape
  const dernier = steps[steps.length - 1];
  const m = dernier.match(/=\s*(-?\d+)\s*$/);
  if (!m) { probs.push('المرحلة الأخيرة لا تنتهي بنتيجة'); return probs; }
  const res = Number(m[1]);
  if (!Number.isInteger(res)) probs.push('النتيجة ليست عددا صحيحا: ' + res);
  if (res <= 0) probs.push('النتيجة ليست موجبة: ' + res);

  // 1) l'énoncé
  let enonce = strip(q.operation);
  const k = enonce.indexOf(':');
  if (k >= 0) enonce = enonce.slice(k + 1);
  enonce = enonce.trim().replace(/^[A-Za-z]\s*=\s*/, '');
  if (PUR.test(enonce) && /\d/.test(enonce) && !TROU.test(enonce)) {
    const bad = [];
    try {
      const direct = M.evalNat(enonce, bad);
      if (direct !== res) probs.push(`الحساب المباشر ${direct} ≠ ${res} — ${enonce}`);
      probs.push(...bad.map(b => 'العبارة: ' + b));
    } catch (e) { probs.push('تعذّر حساب العبارة: ' + enonce); }
    controles++;
  }

  // 2-3) les étapes
  steps.forEach((s, i) => {
    const j = s.indexOf(':');
    const t = (j >= 0 ? s.slice(j + 1) : s).trim();
    if (!PUR.test(t) || !/\d/.test(t) || TROU.test(t)) return;
    const bad = [];
    try {
      if (t.includes('=')) {
        const e = t.indexOf('=');
        const g = t.slice(0, e).trim(), d = t.slice(e + 1).trim();
        if (!g) {
          if (Number(d) !== res) probs.push(`م${i + 1}: تعلن ${d} بدل ${res}`);
        } else if (M.evalNat(g, bad) !== M.evalNat(d, bad)) {
          probs.push(`م${i + 1}: ${t} خاطئة`);
        }
      } else if (M.evalNat(t, bad) !== res) {
        probs.push(`م${i + 1}: « ${t} » ≠ ${res}`);
      }
      probs.push(...bad.map(b => `م${i + 1}: ${b}`));
    } catch (e) { probs.push(`م${i + 1}: تعذّر حساب « ${t} »`); }
    controles++;
  });

  // 4) unicité de l'ordre
  if (new Set(q.steps).size !== q.steps.length) probs.push('مراحل مكرّرة');
  if (q.steps.length < 3) probs.push('السلسلة قصيرة جدا');

  // 5) isolation bidi
  for (const s of [q.operation].concat(q.steps)) {
    const nu = s.replace(/<span dir="ltr"[^>]*>[\s\S]*?<\/span>/g, '');
    if (/\d\s*[+\-*×÷]\s*\d|\d\s*=/.test(nu)) probs.push('عبارة غير معزولة: ' + s);
  }
  return probs;
}

for (const numero of Object.keys(EXERCICES).map(Number)) {
  let mauvais = 0;
  const vus = new Set();
  for (let t = 0; t < TIRAGES; t++) {
    const data = construire(numero);
    for (const q of data.questions) {
      questions++;
      vus.add(strip(q.operation));
      const probs = verifier(numero, q);
      if (probs.length) {
        mauvais++;
        if (echecs.length < 15) echecs.push(`ex${numero}: ${strip(q.operation)}\n    - ` + probs.join('\n    - '));
      }
    }
  }
  const variete = Math.round(vus.size / (TIRAGES * EXERCICES[numero].f().length) * 100);
  console.log(`ex${String(numero).padStart(2)} — ${EXERCICES[numero].titre}`
    + `  ${mauvais ? '✗ ' + mauvais + ' échec(s)' : '✓'}  (variété ${variete}%)`);
}

if (echecs.length) { console.log('\n' + echecs.join('\n')); }
console.log(`\n${questions} questions tirées, ${controles} contrôles arithmétiques,`
  + ` ${echecs.length ? 'ÉCHECS' : '0 erreur'}.`);
process.exit(echecs.length ? 1 : 0);
