// Valide les trois séries de divisibilité sur un grand nombre de tirages.
//   node verifier.js [tirages]
//
// La page ne calcule jamais 3^2013 — elle met en facteur. Le validateur, lui,
// le calcule pour de bon, en BigInt : c'est le seul moyen de savoir si le
// nombre est réellement divisible par ce que l'énoncé annonce.
//
// Contrôles, sur CHAQUE instance :
//   1. chaque égalité écrite dans une étape est exacte ;
//   2. la dernière étape annonce le diviseur ;
//   3. le crochet annoncé vaut bien la somme des termes ramenés au socle ;
//   4. **le nombre entier, calculé en BigInt, est divisible par D** — et il
//      est strictement positif ;
//   5. aucune étape dupliquée, chaque expression isolée en dir="ltr".
const A = require('./arith.js');
const O = require('./outils.js');
['./gen08.js', './gen09.js', './gen10.js'].forEach(f => require(f));

const TIRAGES = Number(process.argv[2]) || 200;
const PUR = /^[\d\s+\-*×÷/:=^().]+$/;

let controles = 0, instances = 0, bigCalculs = 0;
const echecs = [];

// Number déborde bien avant 5^1805 : toutes les égalités de cette leçon sont
// donc évaluées en BigInt, sans exception.
function evalBig(expr) {
  let e = String(expr).replace(/×/g, '*').replace(/:/g, '/').replace(/\s+/g, '');
  let garde = 0;
  while (/\(/.test(e)) {
    if (++garde > 40) throw new Error('boucle: ' + expr);
    e = e.replace(/\(([^()]*)\)/, (_, i) => platBig(i).toString());
  }
  return platBig(e);
}

function platBig(e) {
  const t = e.match(/\d+|[+\-*/^]/g);
  if (!t) throw new Error('vide: ' + e);
  let k;
  while ((k = t.lastIndexOf('^')) > 0) {
    t.splice(k - 1, 3, (BigInt(t[k - 1]) ** BigInt(t[k + 1])).toString());
  }
  const p = [t[0]];
  for (let i = 1; i < t.length; i += 2) {
    if (t[i] === '*') p.push((BigInt(p.pop()) * BigInt(t[i + 1])).toString());
    else if (t[i] === '/') {
      const a = BigInt(p.pop()), b = BigInt(t[i + 1]);
      if (a % b !== 0n) throw new Error('قسمة غير تامّة: ' + a + ' : ' + b);
      p.push((a / b).toString());
    } else p.push(t[i], t[i + 1]);
  }
  let acc = BigInt(p[0]);
  for (let i = 1; i < p.length; i += 2) {
    acc = p[i] === '+' ? acc + BigInt(p[i + 1]) : acc - BigInt(p[i + 1]);
  }
  return acc;
}

const egalites = t => String(t).split(' و ').map(x => x.trim())
  .filter(x => PUR.test(x) && x.includes('=') && /\d/.test(x));

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
  const TOURS = Number(process.argv[2]) || 40;
  let planplantees = 0, saines = 0, options = 0;
  const griefs = [];
  const familles = {};

  for (const n of Object.keys(A.PROBLEMES).map(Number).sort((a, b) => a - b)) {
    const def = A.PROBLEMES[n];
    let mauvais = 0;
    for (let t = 0; t < TOURS; t++) {
      for (const niveau of [1, 2]) {
        const page = E.pageErreurs(n, niveau);
        // Le nombre de volets attendu se lit dans la fiche : soit exercice par
        // exercice, soit d'un seul PAR_PAGE pour les fiches d'arithmétique.
        const attendu = (def.questions !== undefined) ? def.questions
                      : (A.PAR_PAGE !== undefined ? A.PAR_PAGE : null);
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

function verifierBrut(brut) {
  const probs = [];
  let verifiees = 0;

  brut.etapes.forEach(([label, math], i) => {
    for (const eq of egalites(math)) {
      const k = eq.indexOf('=');
      const g = eq.slice(0, k).trim(), d = eq.slice(k + 1).trim();
      try {
        if (!g) {
          if (Number(d) !== brut.res) probs.push(`م${i + 1}: تعلن ${d} بدل ${brut.res}`);
        } else if (evalBig(g) !== evalBig(d)) {
          probs.push(`م${i + 1}: « ${eq} » خاطئة`);
        }
        verifiees++; controles++;
      } catch (e) { probs.push(`م${i + 1}: تعذّر حساب « ${eq} »`); }
    }
  });

  const derniere = String(brut.etapes[brut.etapes.length - 1][1]).trim();
  if (!/^=\s*\d+$/.test(derniere)) probs.push('المرحلة الأخيرة لا تعلن القاسم');
  if (verifiees < 2) probs.push(`مراحل قابلة للتحقق: ${verifiees} فقط`);

  // Le cœur : la divisibilité, calculée exactement.
  const c = brut.controle;
  try {
    const val = O.valeurExacte(c.b, c.termes);
    bigCalculs++;
    if (val <= 0n) probs.push('العدد ليس موجبا');
    if (val % BigInt(c.D) !== 0n) probs.push(`${c.D} لا يقسم العدد فعلا`);
    if (BigInt(brut.res) !== BigInt(c.D)) probs.push('النتيجة لا تطابق القاسم المعلن');

    // Le crochet annoncé doit valoir la somme ramenée au socle.
    const socle = Math.min(...c.termes.map(([, e]) => e));
    const attendu = c.termes.reduce((s, [coef, e]) => s + coef * Math.pow(c.b, e - socle), 0);
    if (attendu !== c.crochet) probs.push(`القوس المعلن ${c.crochet} بدل ${attendu}`);
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
console.log(`\n${instances} instances tirées, ${controles} contrôles`
  + ` dont ${bigCalculs} divisibilités calculées en BigInt,`
  + ` ${echecs.length ? 'ÉCHECS' : '0 erreur'}.`);
process.exit(echecs.length ? 1 : 0);
