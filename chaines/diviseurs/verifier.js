// Valide les dix chaînes de la leçon « قواسم عدد صحيح طبيعي ».
//   node verifier.js [tirages]
//
// Sur CHAQUE instance tirée :
//   1. chaque égalité écrite dans une étape est exacte — plusieurs égalités
//      séparées par « و » dans la même étape sont contrôlées une par une ;
//   2. la dernière étape annonce le résultat ;
//   3. au moins trois étapes sont réellement calculables ;
//   4. l'affirmation est recalculée INDÉPENDAMMENT du générateur : nombre de
//      diviseurs, listes de diviseurs, PGCD, PPCM, racines, quotients ;
//   5. aucune étape dupliquée, chaque expression isolée en dir="ltr".
const M = require('./moteur.js');
const A = require('./arith.js');
const O = require('./outils.js');
for (let n = 1; n <= 10; n++) require('./gen' + String(n).padStart(2, '0') + '.js');

const TIRAGES = Number(process.argv[2]) || 300;
const PUR = /^[\d\s+\-*×÷/:=^().]+$/;

let controles = 0, instances = 0;
const echecs = [];

const egalites = t => String(t).split(' و ').map(x => x.trim())
  .filter(x => PUR.test(x) && x.includes('=') && /\d/.test(x));

// Recalcule tout, sans faire confiance au générateur.
function controlerClaim(c) {
  const p = [];
  const memeListe = (x, y) => x.join(',') === y.join(',');
  switch (c.type) {
    case 'nbdiv':
      if (A.diviseurs(c.N).length !== c.n) p.push(`عدد القواسم الحقيقي ${A.diviseurs(c.N).length} ≠ ${c.n}`);
      if (O.nbDiv(A.facteurs(c.N)) !== c.n) p.push('قاعدة الأسس لا تعطي نفس العدد');
      break;
    case 'pgcd-listes': {
      const d = A.pgcd(c.a, c.b);
      if (d !== c.d) p.push(`ق.م.أ الحقيقي ${d} ≠ ${c.d}`);
      const vrais = A.diviseurs(c.a).filter(x => c.b % x === 0);
      if (!memeListe(vrais, c.comm)) p.push('قائمة القواسم المشتركة خاطئة');
      if (c.comm[c.comm.length - 1] !== d) p.push('أكبر قاسم مشترك لا يطابق ق.م.أ');
      break;
    }
    case 'multiple':
      if (c.A % c.B !== 0) p.push(`${c.A} ليس مضاعفا لـ ${c.B}`);
      if (c.A / c.B !== c.k) p.push(`خارج القسمة ${c.A / c.B} ≠ ${c.k}`);
      break;
    case 'cube':
      if (Math.pow(c.r, 3) !== c.N) p.push(`${c.r}^3 ≠ ${c.N}`);
      if (!O.divisiblePar(A.facteurs(c.N), 3)) p.push('الأسس ليست كلّها مضاعفات لـ 3');
      break;
    case 'racine':
      if (c.r * c.r !== c.N) p.push(`${c.r}^2 ≠ ${c.N}`);
      if (!O.divisiblePar(A.facteurs(c.N), 2)) p.push('الأسس ليست كلّها زوجية');
      break;
    case 'racine-produit':
      if (c.k * c.a * c.c !== c.S) p.push('الجداء لا يطابق');
      if (c.R * c.R !== c.S) p.push(`${c.R}^2 ≠ ${c.S}`);
      if (!O.divisiblePar(A.facteurs(c.S), 2)) p.push('الأسس ليست كلّها زوجية');
      break;
    case 'pgcd':
      if (A.pgcd(c.a, c.b) !== c.d) p.push(`ق.م.أ الحقيقي ${A.pgcd(c.a, c.b)} ≠ ${c.d}`);
      break;
    case 'ppcm':
      if (A.ppcm(c.a, c.b) !== c.L) p.push(`م.م.أ الحقيقي ${A.ppcm(c.a, c.b)} ≠ ${c.L}`);
      if (c.L % c.a || c.L % c.b) p.push('م.م.أ ليس مضاعفا للعددين');
      break;
    case 'partage':
      if (A.pgcd(c.a, c.b) !== c.d) p.push('عدد الأصدقاء ليس ق.م.أ');
      if (c.a / c.d !== c.pa || c.b / c.d !== c.pb) p.push('النصيب خاطئ');
      if (!Number.isInteger(c.pa) || !Number.isInteger(c.pb)) p.push('نصيب غير صحيح');
      break;
    case 'jardin': {
      const d = A.pgcd(c.a, c.b);
      if (d !== c.d) p.push(`ق.م.أ الحقيقي ${d} ≠ ${c.d}`);
      if (!memeListe(A.diviseurs(d), c.comm)) p.push('قائمة القيم الممكنة خاطئة');
      for (const v of c.comm) if (c.a % v || c.b % v) p.push(`${v} ليس قاسما مشتركا`);
      const dans = c.comm.filter(v => v > c.bornes[0] && v < c.bornes[1]);
      if (dans.length !== 1) p.push(`${dans.length} قيم في المجال — الجواب ليس وحيدا`);
      if (dans[0] !== c.choisi) p.push('القيمة المختارة ليست في المجال');
      if (2 * (c.a + c.b) !== c.perimetre) p.push('المحيط خاطئ');
      if (c.perimetre % c.choisi) p.push('عدد الأشجار ليس عددا صحيحا');
      if (c.perimetre / c.choisi !== c.arbres) p.push('عدد الأشجار خاطئ');
      break;
    }
    default: p.push('نوع غير معروف: ' + c.type);
  }
  return p;
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

  probs.push(...controlerClaim(brut.controle));
  controles++;

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
  console.log(`ex${String(n).padStart(2)} — ${A.PROBLEMES[n].titre}`
    + `  ${mauvais ? '✗ ' + mauvais + ' échec(s)' : '✓'}  (${vus.size} énoncés distincts)`);
}

if (echecs.length) console.log('\n' + echecs.join('\n'));
console.log(`\n${instances} instances tirées, ${controles} contrôles,`
  + ` ${echecs.length ? 'ÉCHECS' : '0 erreur'}.`);
process.exit(echecs.length ? 1 : 0);
