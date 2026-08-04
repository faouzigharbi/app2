// Valide les chaînes de « القوى ».
//   node verifier.js [tirages]   |   CONTRE_EXEMPLES=1 node verifier.js
//
// Chaque question est une expression FERMÉE : elle a une valeur exacte, sur
// des entiers de taille quelconque. Le validateur la recalcule avec le noyau,
// et recalcule aussi chaque étape. Rien n'est approché : deux nombres sont
// égaux quand leurs termes coïncident, pas quand leurs décimales se ressemblent.
//
// Il contrôle en outre LA FORME de la réponse. « Écris sous forme de puissance »
// n'est pas satisfait par un nombre juste mais développé : « 3⁷ » est demandé,
// « 2187 » ne l'est pas. Une fiche qui accepterait les deux n'enseignerait rien.
const F = require('./noyau.js');
require('./items.js');
require('./chaines.js');
require('./gens.js');

const TIRAGES = Number(process.argv[2]) || 40;
let relations = 0, controles = 0, questions = 0;
const echecs = [];

// Une forme « puissance » : un seul facteur, base et exposant, rien d'autre.
// La base peut être un rationnel, et alors elle est parenthésée — « (3/5)^6 »,
// « (-7/5)^11 » — car « 3/5^6 » ne veut pas dire la même chose.
const EST_PUISSANCE = /^\s*(?:\d+|\(-?\d+(?:\/\d+)?\))\s*\^\s*-?\d+\s*$/;

function verifierBrut(brut) {
  const probs = [];
  const c = brut.controle;
  // « A » désigne l'expression de l'énoncé. Sans ce lien, toute étape écrite
  // « A = 3^8 × 3^3 » était SAUTÉE — prise pour l'énoncé d'une règle à cause de
  // sa lettre —, et les réécritures intermédiaires n'étaient jamais vérifiées.
  const env = {};
  try { env.A = F.analyser(c.expr); } catch (e) { /* les étapes le diront */ }

  brut.etapes.forEach(([label, math], i) => {
    if (typeof math !== 'string' || F.ARABE.test(math)) return;
    // « a^n × a^p = a^(n+p) » est l'énoncé de la RÈGLE, avec des lettres
    // libres : il n'y a rien à y recalculer. On le reconnaît à ses MINUSCULES ;
    // « A », lui, est un nom défini, et son étape se vérifie.
    if (/[a-z]/.test(math)) return;
    try {
      const r = F.verifierRelation(math, env);
      if (r === null) { probs.push('م' + (i + 1) + ': « ' + math + ' » ليست علاقة'); return; }
      if (r) { probs.push('م' + (i + 1) + ': ' + r); return; }
      relations++;
    } catch (e) { probs.push('م' + (i + 1) + ': تعذّر « ' + math + ' » (' + e.message + ')'); }
  });

  if (c.type === 'valeur') {
    let v = null, w = null;
    try { v = F.analyser(c.expr); } catch (e) { probs.push('تعذّر تحليل العبارة: ' + e.message); }
    try { w = F.analyser(c.res); } catch (e) { probs.push('تعذّر تحليل النتيجة: ' + e.message); }
    if (v && w && !F.memes(v, w)) {
      probs.push('القيمة الحقيقية ' + F.ecrire(v) + ' ≠ ' + c.res);
    }
    // La 9ème écrit des puissances de RÉELS : « (√3)^-4 », « π^8 », « (2/√5)^3 ».
    // Leur forme se reconnaît à la parenthèse et à l'exposant, pas au chiffre.
    const EST_PUISSANCE_REELLE = /^\s*(?:[a-zA-Zπ]|√\d+|\d+|\([^()]+\))\s*\^\s*-?\d+\s*$/;
    if (c.forme === 'reelle' && !EST_PUISSANCE_REELLE.test(c.res)) {
      probs.push('النتيجة ليست في صيغة قوّة لعدد حقيقي: ' + c.res);
    }
    if (c.forme === 'reelle' && /\^\s*1\s*$/.test(c.res)) {
      probs.push('أسّ يساوي 1: ' + c.res);
    }
    if (c.forme === 'puissance' && !EST_PUISSANCE.test(c.res)) {
      probs.push('النتيجة ليست في صيغة قوّة: ' + c.res);
    }
    // Une « forme puissance » dont l'exposant vaut 1 n'apprend rien : elle se
    // lit comme un nombre ordinaire et le geste disparaît.
    if (c.forme === 'puissance' && /\^\s*1\s*$/.test(c.res)) {
      probs.push('أسّ يساوي 1: ' + c.res);
    }
    controles++;
  } else probs.push('نوع غير معروف: ' + c.type);

  const t = brut.etapes.map(e => e.join(': '));
  if (new Set(t).size !== t.length) probs.push('مراحل مكرّرة');
  // Deux étapes qui portent LA MÊME relation sous deux libellés différents
  // seraient interchangeables : la chaîne cesserait d'avoir un ordre.
  const maths = brut.etapes.map(e => String(e[1]).trim())
    .filter(m => !F.ARABE.test(m) && /[<>=]/.test(m));
  if (new Set(maths).size !== maths.length) probs.push('علاقة مكرّرة في مرحلتين');
  if (t.length < 4) probs.push('السلسلة قصيرة جدا');
  if (!brut.indice) probs.push('بلا مساعدة');
  return probs;
}

if (process.env.CONTRE_EXEMPLES) {
  const copie = q => ({ ...q, etapes: q.etapes.map(e => e.slice()),
                        controle: JSON.parse(JSON.stringify(q.controle)) });
  const cas = [];
  const pousse = (nom, n, f) => { const c = copie(F.tirer(n)[0]); f(c); cas.push([nom, c]); };
  const NUMS = Object.keys(F.PROBLEMES).map(Number);

  pousse('exposants additionnés de travers', NUMS[0], c => {
    c.controle.res = c.controle.res.replace(/\^(\d+)/, (m, e) => '^' + (Number(e) + 1));
  });
  pousse('résultat développé au lieu d’une puissance', NUMS[0], c => {
    c.controle.res = String(F.valeur(F.analyser(c.controle.expr)));
  });
  pousse('étape dupliquée', NUMS[0], c => { c.etapes[2] = c.etapes[1].slice(); });
  pousse('chaîne tronquée', NUMS[0], c => { c.etapes = c.etapes.slice(0, 3); });
  pousse('aide absente', NUMS[0], c => { c.indice = ''; });
  pousse('une étape rendue fausse', NUMS[1] || NUMS[0], c => {
    for (let i = 0; i < c.etapes.length; i++) {
      const m = String(c.etapes[i][1]);
      if (!F.ARABE.test(m) && /=/.test(m) && !/[a-z]/.test(m)) {
        // Ajouter 1 au premier nombre après « = ». Quand il n'y a pas de
        // nombre nu — « A = (√3)^-2 » —, on ajoute 1 au membre entier : la
        // falsification doit mordre sur TOUTE forme d'étape, sinon elle
        // mesure la chance et non le validateur.
        const mute = m.replace(/=\s*(\d+)/, (x, d) => '= ' + (Number(d) + 1));
        c.etapes[i][1] = (mute !== m) ? mute : m.replace(/=\s*(.+)$/, '= 1 + ($1)');
        break;
      }
    }
  });

  let bon = 0;
  for (const [nom, q] of cas) {
    let probs;
    try { probs = verifierBrut(q); } catch (e) { probs = ['exception: ' + e.message]; }
    console.log((probs.length ? '✗ rejeté  ' : '⚠ ACCEPTÉ ') + nom
      + (probs.length ? ' — ' + probs[0].slice(0, 70) : ''));
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
        if (echecs.length < 8) echecs.push('التمرين ' + n + ' س' + (i + 1) + ': '
          + brut.enonce.join(' ') + '\n    - ' + probs.join('\n    - '));
      }
    }
  }
  console.log(('ex' + String(n).padStart(2) + ' — ' + F.PROBLEMES[n].titre).padEnd(46)
    + (mauvais ? '✗ ' + mauvais + ' échec(s)' : '✓')
    + '  (' + vus.size + ' صيغة)');
}
if (echecs.length) console.log('\n' + echecs.join('\n'));
console.log('\n' + TIRAGES + ' tirages, ' + questions + ' questions, ' + relations
  + ' relations recalculées et ' + controles + ' contrôles, '
  + (echecs.length ? 'ÉCHECS' : '0 erreur') + '.');
process.exit(echecs.length ? 1 : 0);
