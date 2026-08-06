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
