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
const PEDAGOGIE = require('./pedagogie.js');

const TIRAGES = Number(process.argv[2]) || 400;
const PUR = /^[\d\s+\-*×÷/:=().[\]]+$/;
// Un énoncé à trou (« 61 + ... = 84 ») n'est pas une expression calculable.
const TROU = /\.{2,}|…/;
const strip = s => s.replace(/<[^>]+>/g, '');

let controles = 0, questions = 0;
const echecs = [];

// -------------------------------------------------------------------------
// Mode ERREURS : on valide les pages « أين الخطأ؟ ».
//   ERREURS=1 node verifier.js [tirages]
//
// Une page d'erreurs ment DÉLIBÉRÉMENT à l'élève, et c'est là tout le danger :
// si elle se trompe de mensonge, elle lui apprend une faute là où il n'y en a
// pas. Quatre contrôles, donc, et le troisième est le moins évident :
//
//   1. chaque étape PLANTÉE est fausse — sinon on demande de condamner du vrai ;
//   2. chaque étape NON plantée est vraie — sinon la page contient une faute
//      qu'elle ignore, et l'élève qui la trouve est compté en échec ;
//   3. le nombre de fautes est bien celui du niveau demandé ;
//   4. dans la phase « corrige », la bonne réécriture est vraie et chaque
//      leurre est faux.
// -------------------------------------------------------------------------
if (process.env.ERREURS) {
  const E = require('./erreurs.js');
  const J = require('./juge.js');
  const P = require('./pont.js');
  const TOURS = Number(process.argv[2]) || 40;
  let planplantees = 0, saines = 0, options = 0;
  const griefs = [];
  const familles = {};

  for (const n of Object.keys(P.PROBLEMES).map(Number).sort((a, b) => a - b)) {
    const def = P.PROBLEMES[n];
    let mauvais = 0;
    for (let t = 0; t < TOURS; t++) {
      for (const niveau of [1, 2]) {
        const page = E.pageErreurs(n, niveau);
        // Le nombre de volets attendu se lit dans la fiche : soit exercice par
        // exercice, soit d'un seul PAR_PAGE pour les fiches d'arithmétique.
        const attendu = (def.questions !== undefined) ? def.questions
                      : (P.PAR_PAGE !== undefined ? P.PAR_PAGE : null);
        if (attendu !== null && page.length !== attendu) {
          griefs.push(`التمرين ${n}: ${page.length} أسئلة بدل ${attendu}`);
          mauvais++;
          continue;
        }
        page.forEach((q, qi) => {
          const c = q.controle;
          const envs = J.environnements(c);
          const rangs = q.fautes.map(f => f.rang);
          // Un volet peut n'avoir AUCUNE faute : le corrigé est alors juste, et
          // l'élève doit le dire. On exige seulement qu'il soit annoncé comme
          // tel, et que toutes ses étapes soient vraies — ce que la boucle
          // ci-dessous vérifie, puisqu'aucun rang n'est déclaré planté.
          if (q.fautes.length > niveau || (!q.fautes.length && !q.sain)) {
            griefs.push(`التمرين ${n} س${qi + 1}: ${q.fautes.length} أخطاء بدل ${niveau}`);
            mauvais++;
          }
          q.etapes.forEach(([, math], i) => {
            const j = J.evaluerEtape(math, envs);
            if (rangs.indexOf(i) >= 0) {
              planplantees++;
              if (j !== 'fausse') {
                griefs.push(`التمرين ${n} س${qi + 1} م${i + 1}: الخطأ المزروع ليس خطأ « ${math} »`);
                mauvais++;
              }
            } else {
              saines++;
              if (j === 'fausse') {
                griefs.push(`التمرين ${n} س${qi + 1} م${i + 1}: مرحلة فاسدة غير معلنة « ${math} »`);
                mauvais++;
              }
            }
          });
          q.fautes.forEach(f => {
            familles[f.famille] = (familles[f.famille] || 0) + 1;
            f.choix.forEach((opt, k) => {
              options++;
              const j = J.evaluerEtape(opt, envs);
              const attendu = (k === f.bonne) ? 'vraie' : 'fausse';
              if (j !== attendu) {
                griefs.push(`التمرين ${n} س${qi + 1}: خيار تصحيح ${attendu === 'vraie' ? 'صحيح و هو فاسد' : 'فاسد و هو صحيح'} « ${opt} »`);
                mauvais++;
              }
            });
          });
        });
      }
    }
    const titre = `التمرين ${n} — ${def.titre}`;
    console.log(`${titre.padEnd(52)}${mauvais ? '✗ ' + mauvais + ' خلل' : '✓ '}`);
  }

  console.log('\nالعائلات المستعملة:');
  Object.keys(familles).sort((a, b) => familles[b] - familles[a])
    .forEach(k => console.log(`   ${String(familles[k]).padStart(5)}  ${k}`));

  if (griefs.length) {
    console.log('\n' + griefs.slice(0, 30).join('\n'));
    console.log(`\n${TOURS} تمريرات، ${planplantees} خطأ مزروع، ${saines} مرحلة سليمة، ${options} خيار — فشل.`);
    process.exit(1);
  }
  console.log(`\n${TOURS} tours par exercice, ${planplantees} fautes plantées, `
              + `${saines} étapes saines et ${options} options de correction, 0 erreur.`);
  process.exit(0);
}

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

  // 3bis) la MÉTHODE : pas de développement, regroupement rond montré
  probs.push(...PEDAGOGIE.controler(q));

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
