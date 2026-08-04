// Valide les huit exercices de la leçon « الجمع في ℝ ».
//   node verifier.js [tirages]   |   CONTRE_EXEMPLES=1 node verifier.js
//
// L'égalité de deux réels est ici EXACTE : on compare les coefficients de la
// combinaison linéaire sur { 1, x, y, a, b, √2, √3, √5, π }. Rien n'est
// approché, donc rien ne passe « à peu près ».
//
// Une étape peut être de deux natures : une identité, vraie quelle que soit la
// lettre (« E = x + 1/2 + √2 »), ou une égalité qui n'est vraie qu'à la
// SOLUTION (« x - 13/6 + √3 = 3/2 »). On accepte donc une étape qui tient soit
// symboliquement, soit dans l'un des environnements-solutions. Une étape
// fausse, elle, ne tient dans aucun des deux — et c'est le contrôle de la
// conclusion qui fait le reste du travail.
const F = require('./noyau.js');
const A = require('./algebre.js');
const X = require('./exercices.js');
require('./gens.js');

const TIRAGES = Number(process.argv[2]) || 60;
let relations = 0, controles = 0, questions = 0;
const echecs = [];

const lire = (t, env) => A.analyser(t, env);
const memes = (a, b) => A.memes(a, b);

// Les environnements dans lesquels une étape a le droit d'être vraie.
// Le nom d'une expression — E, C, M… — n'est pas une inconnue : il DÉSIGNE
// l'expression de l'énoncé. Il faut donc le définir dans chaque environnement,
// sans quoi la moindre étape écrite « E = … » serait illisible.
function nommer(c, e) {
  if (c.noms) {
    for (const k of Object.keys(c.noms)) {
      try { e[k] = lire(c.noms[k], e); } catch (x) { /* nom indéfinissable ici */ }
    }
  }
  return e;
}

function environnements(c) {
  const envs = [nommer(c, {})];                         // symbolique
  const pose = sub => { envs.push(nommer(c, Object.assign({}, sub))); };
  if (c.type === 'substitution') { const s = {}; s[c.lettre] = lire(c.valeur); pose(s); }
  else if (c.type === 'equation' || c.type === 'valeurAbsolue') {
    const s = {}; s[c.lettre] = lire(c.solution); pose(s);
  } else if (c.type === 'absolue') {
    for (const sol of c.solutions) { const s = {}; s[c.lettre] = lire(sol); pose(s); }
  } else if (c.type === 'absolueIsolee') {
    if (c.possible) {
      const v = lire(c.valeur);
      for (const w of [v, A.oppose(v)]) { const s2 = {}; s2[c.lettre] = w; pose(s2); }
    }
  } else if (c.type === 'combinaison') {
    // « a + b = v » n'est pas une identité : les étapes qui l'utilisent ne
    // valent que SOUS l'hypothèse. On la matérialise en remplaçant a.
    pose({ a: A.moins(lire(c.valeur), A.fois(F.rat(c.signeB), A.un('b'))) });
  }
  return envs;
}

function controlerClaim(c) {
  const p = [];
  (c.identites || []).forEach(([g, d]) => {
    if (!memes(lire(g), lire(d))) p.push('« ' + g + ' » ≠ « ' + d + ' »');
    controles++;
  });

  if (c.type === 'reduction') {
    // le cœur du chapitre : l'expression habillée doit VRAIMENT valoir la forme
    if (!memes(lire(c.brut), lire(c.reduit))) {
      p.push('الاختصار خاطئ: ' + c.brut + ' ≠ ' + c.reduit);
    }
    // et la forme réduite doit être plus courte, sinon on n'a rien réduit
    if (c.reduit.length >= c.brut.length) p.push('الشكل « المختصر » ليس أقصر');
    if (!/[()\[\]]/.test(c.brut)) p.push('العبارة بلا أقواس: لا شيء لإزالته');
    controles++;

  } else if (c.type === 'substitution') {
    const e = {}; e[c.lettre] = lire(c.valeur);
    if (!memes(lire(c.expr, e), lire(c.res))) p.push('التعويض يعطي قيمة أخرى');
    controles++;

  } else if (c.type === 'equation') {
    const e = {}; e[c.lettre] = lire(c.solution);
    if (!memes(lire(c.expr, e), lire(c.but, e))) p.push('الحلّ لا يحقّق المعادلة');
    if (lire(c.solution)[c.lettre]) p.push('الحلّ يحتوي على المجهول نفسه');
    controles++;

  } else if (c.type === 'absolue') {
    const r = lire(c.r);
    if (!c.solutions.length) {
      if (A.partieRat(r).n >= 0) p.push('أُعلن أنّه لا حلّ و الطرف الثاني موجب');
    } else {
      if (c.solutions.length !== 2) p.push('عدد الحلول ليس 2');
      const vus = new Set();
      for (const sol of c.solutions) {
        const e = {}; e[c.lettre] = lire(sol);
        const v = lire(c.dedans, e);
        const num = A.valeur(v);
        const av = num < 0 ? A.oppose(v) : v;
        if (!memes(av, r)) p.push('الحلّ ' + sol + ' لا يحقّق المعادلة بالقيمة المطلقة');
        vus.add(sol);
        controles++;
      }
      if (vus.size !== c.solutions.length) p.push('الحلاّن متطابقان');
    }

  } else if (c.type === 'valeurAbsolue') {
    const e = {}; e[c.lettre] = lire(c.solution);
    const g = A.moins(lire(c.expr, e), A.cst(F.rat(Number(c.k.split('/')[0]),
      Number(c.k.split('/')[1] || 1))));
    if (!memes(g, lire(c.but, e))) p.push('المعادلة غير محقّقة عند الحلّ');
    const num = A.valeur(lire(c.solution));
    const attendu = num < 0 ? A.oppose(lire(c.solution)) : lire(c.solution);
    if (!memes(attendu, lire(c.absolue))) p.push('القيمة المطلقة خاطئة الإشارة');
    controles += 2;

  } else if (c.type === 'absolueIsolee') {
    const a = lire(c.a), m = lire(c.m), v = lire(c.valeur);
    if (!memes(A.moins(a, m), v)) p.push('عزل القيمة المطلقة خاطئ');
    if ((A.partieRat(v).n >= 0) !== c.possible) p.push('الحكم على وجود الحلّ خاطئ');
    controles += 2;

  } else if (c.type === 'absolueIsolee') {
    if (c.possible) {
      const v = lire(c.valeur);
      for (const w of [v, A.oppose(v)]) { const s2 = {}; s2[c.lettre] = w; pose(s2); }
    }
  } else if (c.type === 'combinaison') {
    // « a + b = v » : en remplaçant a par v - b (ou v + b), l'expression
    // doit devenir identiquement nulle.
    const e = {};
    e.a = A.moins(lire(c.valeur), A.fois(F.rat(c.signeB), A.un('b')));
    if (!A.nul(lire(c.expr, e))) p.push('العلاقة المعلنة لا تُلغي العبارة');
    controles++;

  } else p.push('نوع غير معروف: ' + c.type);
  return p;
}

function verifierBrut(brut) {
  const probs = [];
  const c = brut.controle;
  const envs = environnements(c);

  brut.etapes.forEach(([label, math], i) => {
    if (typeof math !== 'string' || F.ARABE.test(math)) return;
    let bon = false, souci = null;
    for (const env of envs) {
      try {
        const r = A.verifierRelation(math, env);
        if (r === null) { souci = '« ' + math + ' » ليست علاقة'; continue; }
        if (r) { souci = souci || r; continue; }
        bon = true; relations++; break;
      } catch (e) { souci = souci || ('تعذّر « ' + math + ' » (' + e.message + ')'); }
    }
    if (!bon) probs.push('م' + (i + 1) + ': ' + (souci || 'لا تتحقّق'));
  });

  probs.push(...controlerClaim(c));
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
  const par = (n, i) => F.tirer(n)[i || 0];
  const trouver = pred => {
    for (let i = 0; i < 400; i++) {
      for (const n of Object.keys(F.PROBLEMES)) {
        for (const q of F.tirer(Number(n))) if (pred(q)) return q;
      }
    }
    throw new Error('modèle introuvable');
  };

  pousse('réduction faussée d’un terme', par(1),
    c => { c.controle.reduit = c.controle.reduit + ' + 1'; });
  pousse('signe du crochet oublié', par(1), c => {
    c.controle.reduit = c.controle.reduit.replace(/√(\d)/, '- √$1');
  });
  pousse('substitution mal calculée', par(1, 1),
    c => { c.controle.res = c.controle.res + ' - 1/2'; });
  pousse('solution décalée', par(1, 2),
    c => { c.controle.solution = c.controle.solution + ' + 1'; });
  pousse('un seul cas pour la valeur absolue',
    trouver(q => q.controle.type === 'absolue' && q.controle.solutions.length === 2),
    c => { c.controle.solutions = [c.controle.solutions[0]]; });
  pousse('valeur absolue de signe retourné',
    trouver(q => q.controle.type === 'valeurAbsolue'),
    c => { c.controle.absolue = '-(' + c.controle.absolue + ')'; });
  pousse('cas impossible déclaré possible',
    trouver(q => q.controle.type === 'absolueIsolee'),
    c => { c.controle.possible = !c.controle.possible; });
  pousse('combinaison a+b fausse',
    trouver(q => q.controle.type === 'combinaison'),
    c => { c.controle.valeur = c.controle.valeur + ' + 1'; });
  pousse('équation : membre modifié',
    trouver(q => q.controle.type === 'equation' && q.controle.identites),
    c => { c.controle.identites[0][1] = c.controle.identites[0][1] + ' + 2'; });
  pousse('étape dupliquée', par(1), c => { c.etapes[2] = c.etapes[1].slice(); });

  let bon = 0;
  for (const [nom, q] of cas) {
    let probs;
    try { probs = verifierBrut(q); } catch (e) { probs = ['exception: ' + e.message]; }
    console.log((probs.length ? '✗ rejeté  ' : '⚠ ACCEPTÉ ') + nom
      + (probs.length ? ' — ' + probs[0].slice(0, 90) : ''));
    if (probs.length) bon++;
  }
  console.log('\n' + bon + '/' + cas.length + ' falsifications détectées.');
  process.exit(bon === cas.length ? 0 : 1);
}

for (const n of Object.keys(F.PROBLEMES).map(Number).sort((a, b) => a - b)) {
  let mauvais = 0; const vus = new Set();
  for (let t = 0; t < TIRAGES; t++) {
    for (const [i, brut] of F.tirer(n).entries()) {
      questions++;
      vus.add(brut.enonce.join(' '));
      const probs = verifierBrut(brut);
      if (probs.length) {
        mauvais++;
        if (echecs.length < 8) {
          echecs.push('التمرين ' + n + ' س' + (i + 1) + ': ' + brut.enonce.join(' ')
            + '\n    - ' + probs.join('\n    - '));
        }
      }
    }
  }
  console.log(('التمرين ' + n + ' — ' + F.PROBLEMES[n].titre).padEnd(44)
    + (mauvais ? '✗ ' + mauvais + ' échec(s)' : '✓') + '  (' + vus.size + ' صيغة)');
}
if (echecs.length) console.log('\n' + echecs.join('\n'));
console.log('\n' + TIRAGES + ' tirages par exercice, ' + questions + ' questions, '
  + relations + ' relations recalculées et ' + controles + ' contrôles, '
  + (echecs.length ? 'ÉCHECS' : '0 erreur') + '.');
process.exit(echecs.length ? 1 : 0);
