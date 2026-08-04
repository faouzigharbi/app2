// Valide les huit familles de « العمليات في ℝ ».
//   node verifier.js [tirages]   |   CONTRE_EXEMPLES=1 node verifier.js
//
// Chaque question est une expression FERMÉE : elle a une valeur exacte. Le
// validateur la recalcule avec le moteur, et recalcule aussi chaque étape.
// Rien n'est approché : deux réels sont égaux quand leurs coefficients sur la
// base des √d coïncident, pas quand leurs décimales se ressemblent.
const F = require('./noyau.js');
const R = require('./racines.js');
require('./exercices.js');
require('./gens.js');

const TIRAGES = Number(process.argv[2]) || 60;
let relations = 0, controles = 0, questions = 0;
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
  const TOURS = Number(process.argv[2]) || 40;
  let planplantees = 0, saines = 0, options = 0;
  const griefs = [];
  const familles = {};

  for (const n of Object.keys(F.PROBLEMES).map(Number).sort((a, b) => a - b)) {
    const def = F.PROBLEMES[n];
    let mauvais = 0;
    for (let t = 0; t < TOURS; t++) {
      for (const niveau of [1, 2]) {
        const page = E.pageErreurs(n, niveau);
        if (page.length !== def.questions) {
          griefs.push(`التمرين ${n}: ${page.length} أسئلة بدل ${def.questions}`);
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
  const c = brut.controle;
  // le nom « A » désigne l'expression de l'énoncé, pas une inconnue
  let env = {};
  try {
    env.A = R.analyser(c.expr);
    // une chaîne peut nommer d'autres nombres — « a » et « b » de l'exercice
    // des inverses. Ce sont des DÉSIGNATIONS, pas des inconnues.
    if (c.noms) for (const k of Object.keys(c.noms)) env[k] = R.analyser(c.noms[k], env);
  } catch (e) { /* nom indéfinissable : les étapes le signaleront */ }

  brut.etapes.forEach(([label, math], i) => {
    if (typeof math !== 'string' || F.ARABE.test(math)) return;
    try {
      const r = R.verifierRelation(math, env);
      if (r === null) { probs.push('م' + (i + 1) + ': « ' + math + ' » ليست علاقة'); return; }
      if (r) { probs.push('م' + (i + 1) + ': ' + r); return; }
      relations++;
    } catch (e) { probs.push('م' + (i + 1) + ': تعذّر « ' + math + ' » (' + e.message + ')'); }
  });

  if (c.type === 'valeur') {
    let v;
    try { v = R.analyser(c.expr); } catch (e) { probs.push('تعذّر تحليل العبارة: ' + e.message); }
    if (v && !R.memes(v, R.analyser(c.res))) {
      probs.push('القيمة الحقيقية ' + R.ecrire(v) + ' ≠ ' + c.res);
    }
    // le résultat doit être ÉCRIT sous forme canonique : pas de √48 qui traîne
    if (v && R.ecrire(v) !== c.res) probs.push('النتيجة ليست في الشكل المختصر');
    controles++;
  } else probs.push('نوع غير معروف: ' + c.type);

  const t = brut.etapes.map(e => e.join(': '));
  if (new Set(t).size !== t.length) probs.push('مراحل مكرّرة');
  if (t.length < 4) probs.push('السلسلة قصيرة جدا');
  if (!brut.indice) probs.push('بلا مساعدة');
  return probs;
}

if (process.env.CONTRE_EXEMPLES) {
  const copie = q => ({ ...q, etapes: q.etapes.map(e => e.slice()),
                        controle: JSON.parse(JSON.stringify(q.controle)) });
  const cas = [];
  const pousse = (nom, q, f) => { const c = copie(q); f(c); cas.push([nom, c]); };
  const par = n => F.tirer(n)[0];

  pousse('carré parfait mal sorti', par(1), c => { c.controle.res = c.controle.res.replace(/^(\d+)/, m => Number(m) + 1); });
  pousse('somme de radicaux faussée', par(2), c => { c.controle.res = c.controle.res + ' + √2'; });
  pousse('produit mal simplifié', par(3), c => { c.controle.res = '2(' + c.controle.res + ')'; });
  pousse('signe du double produit', par(4), c => {
    c.controle.expr = c.controle.expr.replace(/\+/, '-');   // l'énoncé change, pas la réponse
  });
  pousse('facteur commun faux', par(5), c => { c.controle.res = c.controle.res.replace(/√(\d+)/, (m, d) => '√' + (Number(d) + 1)); });
  pousse('dénominateur non rationalisé', par(6), c => { c.controle.res = c.controle.res + ' - 1'; });
  pousse('produit d’inverses ≠ 1', par(7), c => { c.controle.res = '2'; });
  pousse('valeur absolue de signe retourné', par(8), c => {
    const v = R.analyser(c.controle.expr);
    c.controle.res = R.ecrire(R.oppose(v));
  });
  pousse('résultat non réduit', par(1), c => { c.controle.res = c.controle.expr; });
  pousse('étape dupliquée', par(2), c => { c.etapes[2] = c.etapes[1].slice(); });

  let bon = 0;
  for (const [nom, q] of cas) {
    let probs;
    try { probs = verifierBrut(q); } catch (e) { probs = ['exception: ' + e.message]; }
    console.log((probs.length ? '✗ rejeté  ' : '⚠ ACCEPTÉ ') + nom
      + (probs.length ? ' — ' + probs[0].slice(0, 80) : ''));
    if (probs.length) bon++;
  }
  console.log('\n' + bon + '/' + cas.length + ' falsifications détectées.');
  process.exit(bon === cas.length ? 0 : 1);
}

for (const n of Object.keys(F.PROBLEMES).map(Number).sort((a, b) => a - b)) {
  let mauvais = 0; const vus = new Set(); const modeles = new Set();
  for (let t = 0; t < TIRAGES; t++) {
    for (const [i, brut] of F.tirer(n).entries()) {
      questions++;
      vus.add(brut.enonce.join(' '));
      if (brut.controle.modele) modeles.add(brut.controle.modele);
      const probs = verifierBrut(brut);
      if (probs.length) {
        mauvais++;
        if (echecs.length < 8) echecs.push('التمرين ' + n + ' س' + (i + 1) + ': '
          + brut.enonce.join(' ') + '\n    - ' + probs.join('\n    - '));
      }
    }
  }
  console.log(('التمرين ' + n + ' — ' + F.PROBLEMES[n].titre).padEnd(42)
    + (mauvais ? '✗ ' + mauvais + ' échec(s)' : '✓')
    + '  (' + modeles.size + ' نماذج، ' + vus.size + ' صيغة)');
}
if (echecs.length) console.log('\n' + echecs.join('\n'));
console.log('\n' + TIRAGES + ' tirages, ' + questions + ' questions, ' + relations
  + ' relations recalculées et ' + controles + ' contrôles, '
  + (echecs.length ? 'ÉCHECS' : '0 erreur') + '.');
process.exit(echecs.length ? 1 : 0);
