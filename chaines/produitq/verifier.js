// Valide les chaînes de « الجداء و القسمة في ℚ ».
//   node verifier.js [tirages]
//   CONTRE_EXEMPLES=1 node verifier.js
//
// Deux régimes de contrôle, selon la nature de l'affirmation :
//   • NUMÉRIQUE — un produit, un quotient, une fraction étagée : chaque
//     égalité écrite est recalculée en rationnels exacts, et le résultat
//     annoncé est re-dérivé du produit des facteurs ;
//   • IDENTITÉ — un développement, une factorisation : les deux membres sont
//     évalués en des DIZAINES de valeurs tirées au hasard. Deux polynômes qui
//     coïncident en trente points choisis au hasard sont le même polynôme ;
//     une erreur de signe ou un carré oublié ne survit pas au premier essai.
const F = require('./noyau.js');
const P = require('./produits.js');
require('./gens.js');

const TIRAGES = Number(process.argv[2]) || 200;
const ECHANTILLONS = 30;
let relations = 0, controles = 0, questions = 0;
const echecs = [];

const rnd = () => F.rat(F.ent(-15, 15), F.ent(1, 8));

function environnements(c) {
  if (c.type === 'identite') {
    const out = [];
    for (let i = 0; i < ECHANTILLONS; i++) {
      const e = {};
      c.vars.forEach(v => { e[v] = rnd(); });
      // Le nom de l'expression (X, F, E …) apparaît dans les étapes : on le
      // lie à SA DÉFINITION, pas au résultat annoncé — sinon on vérifierait
      // le générateur contre lui-même.
      if (c.nom) e[c.nom] = F.analyser(c.gauche, e);
      out.push(e);
    }
    return out;
  }
  return [Object.assign({}, c.env || {})];
}

function controlerClaim(c) {
  const p = [];
  if (c.type === 'produit') {
    // Le résultat, recalculé sans passer par les simplifications affichées.
    const vrai = c.facteurs.reduce((r, f) => F.mul(r, f), F.rat(1));
    if (!F.egaux(vrai, c.val)) p.push(`الجداء الحقيقي ${F.txt(vrai)} ≠ ${F.txt(c.val)}`);
    // Le signe annoncé doit suivre la parité du nombre de facteurs négatifs.
    const negs = c.facteurs.filter(f => F.signe(f) < 0).length;
    if (negs !== c.negs) p.push('عدد العوامل السالبة معلن خطأ');
    if (vrai.n !== 0 && (F.signe(vrai) < 0) !== (negs % 2 === 1)) {
      p.push('الإشارة لا توافق عدد العوامل السالبة');
    }
    // Et l'expression imprimée doit valoir ce résultat : c'est le seul lien
    // entre ce que l'élève lit et ce que le générateur a calculé.
    if (!F.egaux(F.analyser(c.expr.replace(/×/g, '*'), {}), c.val)) {
      p.push("العبارة المكتوبة لا تساوي النتيجة");
    }
    controles += 3;
  } else if (c.type === 'quotient') {
    if (c.b.n === 0) p.push('القسمة على صفر');
    else if (!F.egaux(F.div(c.a, c.b), c.val)) p.push('الخارج الحقيقي مختلف');
    if (!F.egaux(F.mul(c.val, c.b), c.a)) p.push('الخارج مضروبا في القاسم لا يعطي المقسوم');
    controles += 2;
  } else if (c.type === 'etagee') {
    const vn = F.analyser(c.txtNum, {}), vd = F.analyser(c.txtDen, {});
    if (vd.n === 0) p.push('مقام منعدم');
    else if (!F.egaux(F.div(vn, vd), c.val)) p.push('الكسر المتراكب محسوب خطأ');
    controles++;
  } else if (c.type === 'identite') {
    // Deux membres qui coïncident partout sont le même polynôme.
    for (let i = 0; i < ECHANTILLONS * 3; i++) {
      const env = {};
      c.vars.forEach(v => { env[v] = rnd(); });
      const g = F.analyser(c.gauche, env), d = F.analyser(c.droite, env);
      if (!F.egaux(g, d)) {
        p.push(`« ${c.gauche} » ≠ « ${c.droite} » عند ${c.vars[0]} = ${F.txt(env[c.vars[0]])}`
               + ` (${F.txt(g)} و ${F.txt(d)})`);
        break;
      }
      controles++;
    }
  } else if (c.type === 'signe-produit') {
    // Le signe annoncé doit se déduire des seuls signes des facteurs.
    const attendu = c.cote === 'oppose' ? -(c.s1 * c.s2) : c.s1 * c.s2;
    if (attendu !== c.attendu) p.push('الإشارة المعلنة لا توافق تركيب الإشارتين');
    controles++;
  } else if (c.type === 'classe') {
    // On refait le raisonnement en donnant à a et b des valeurs négatives
    // au hasard : le signe obtenu doit être celui qu'annonce la chaîne.
    for (let i = 0; i < ECHANTILLONS; i++) {
      const a = F.rat(-F.ent(1, 20), F.ent(1, 9)), b = F.rat(-F.ent(1, 20), F.ent(1, 9));
      const v = F.analyser(c.texte.replace(/×/g, '*'), { a, b });
      if (F.signe(v) !== c.attendu) {
        p.push(`${c.texte} vaut ${F.txt(v)} pour a = ${F.txt(a)}, b = ${F.txt(b)}`);
        break;
      }
      controles++;
    }
  } else if (c.type === 'absolu') {
    const vrai = F.abs(F.mul(c.a, c.b));
    if (!F.egaux(vrai, c.val)) p.push('القيمة المطلقة محسوبة خطأ');
    if (!F.egaux(vrai, F.mul(F.abs(c.a), F.abs(c.b)))) p.push('|ab| ≠ |a||b|');
    if (F.signe(c.val) < 0) p.push('قيمة مطلقة سالبة');
    controles += 2;
  } else {
    p.push('نوع غير معروف: ' + c.type);
  }
  return p;
}

function verifierBrut(brut) {
  const probs = [];
  const c = brut.controle;
  const envs = environnements(c);
  let verifiees = 0;
  brut.etapes.forEach(([label, math], i) => {
    if (F.ARABE.test(math)) return;
    for (const env of envs) {
      try {
        const r = F.verifierRelation(String(math).replace(/×/g, '*'), env);
        if (r === null) { probs.push(`م${i + 1}: « ${math} » ليست علاقة`); break; }
        if (r) { probs.push(`م${i + 1}: ${r}`); break; }
        relations++;
      } catch (e) { probs.push(`م${i + 1}: تعذّر « ${math} » (${e.message})`); break; }
    }
    verifiees++;
  });
  // Les questions de signe ne contiennent, par construction, AUCUNE égalité
  // à recalculer : c'est tout leur propos. On ne leur impose donc pas le
  // minimum d'étapes calculables.
  const mini = (c.type === 'signe-produit' || c.type === 'classe') ? 0 : 2;
  if (verifiees < mini) probs.push(`مراحل قابلة للتحقق: ${verifiees} فقط`);
  probs.push(...controlerClaim(c));
  const textes = brut.etapes.map(e => e.join(': '));
  if (new Set(textes).size !== textes.length) probs.push('مراحل مكرّرة');
  if (textes.length < 4) probs.push('السلسلة قصيرة جدا');
  if (!brut.indice) probs.push('بلا مساعدة');
  return probs;
}

function retirerBlocs(html) {
  let s = String(html), d;
  while ((d = s.indexOf('<span dir="ltr"')) >= 0) {
    let i = s.indexOf('>', d) + 1, prof = 1;
    while (prof > 0 && i < s.length) {
      if (s.startsWith('<span', i)) { prof++; i = s.indexOf('>', i) + 1; }
      else if (s.startsWith('</span>', i)) { prof--; i += 7; }
      else i++;
    }
    if (prof > 0) return s + ' ⟵ وسم غير مغلق';
    s = s.slice(0, d) + ' ' + s.slice(i);
  }
  return s;
}

function verifierRendu(q) {
  const probs = [];
  for (const s of [q.operation].concat(q.steps)) {
    const nu = retirerBlocs(s);
    if (/<span/.test(nu)) probs.push('وسم خارج العزل');
    if (/[\d)]\s*[+\-*×÷|<>=]\s*[\d(a-zA-Z]/.test(nu)) probs.push('عبارة غير معزولة: ' + nu.trim().slice(0, 70));
  }
  return probs;
}

if (process.env.CONTRE_EXEMPLES) {
  const copie = q => JSON.parse(JSON.stringify(q));
  const cas = [];
  const l1 = F.tirer(1);
  const a1 = copie(l1[0]); a1.controle.val = F.add(a1.controle.val, F.rat(1));
  cas.push(['produit faussé', a1]);
  const a2 = copie(l1[1]); a2.controle.val = F.neg(a2.controle.val);
  cas.push(['signe du produit inversé', a2]);
  const l5 = F.tirer(5);
  const a3 = copie(l5[0]);
  a3.controle.droite = a3.controle.droite.replace(/x\^2/, 'x');
  cas.push(['carré oublié dans le développement', a3]);
  const a4 = copie(l5[1]);
  // La falsification doit MORDRE quelle que soit la forme tirée : si aucun
  // « + » n'est là à retourner, on retourne un « - », et à défaut on décale.
  a4.controle.droite = / \+ /.test(a4.controle.droite)
    ? a4.controle.droite.replace(/ \+ /, ' - ')
    : (/ - /.test(a4.controle.droite) ? a4.controle.droite.replace(/ - /, ' + ')
                                      : a4.controle.droite + ' + 1');
  cas.push(['signe faussé dans le développement', a4]);
  const l6 = F.tirer(6);
  const a5 = copie(l6[0]);
  a5.controle.droite = a5.controle.droite.replace(/\)$/, ' + 1)');
  cas.push(['factorisation fausse', a5]);
  const l3 = F.tirer(3);
  const a6 = copie(l3[0]); a6.controle.val = F.add(a6.controle.val, F.rat(1));
  cas.push(['quotient faussé', a6]);
  const a7 = copie(l1[2]); a7.etapes[3] = a7.etapes[2].slice();
  cas.push(['étape dupliquée', a7]);
  const l8 = F.tirer(8);
  const a8 = copie(l8[0]); a8.controle.attendu = -a8.controle.attendu;
  cas.push(['signe déduit à l\'envers', a8]);
  const l9 = F.tirer(9);
  const a9 = copie(l9[0]); a9.controle.attendu = -a9.controle.attendu;
  cas.push(['classe ℚ+/ℚ- inversée', a9]);
  const l10 = F.tirer(10);
  const a10 = copie(l10[0]); a10.controle.val = F.neg(a10.controle.val);
  cas.push(['valeur absolue négative', a10]);

  let bon = 0;
  for (const [nom, q] of cas) {
    const probs = verifierBrut(q);
    console.log((probs.length ? '✗ rejeté  ' : '⚠ ACCEPTÉ ') + nom
      + (probs.length ? ' — ' + probs[0].slice(0, 90) : ''));
    if (probs.length) bon++;
  }
  console.log(`\n${bon}/${cas.length} falsifications détectées.`);
  process.exit(bon === cas.length ? 0 : 1);
}

for (const n of Object.keys(F.PROBLEMES).map(Number).sort((a, b) => a - b)) {
  let mauvais = 0; const vus = new Set();
  for (let t = 0; t < TIRAGES; t++) {
    for (const [i, brut] of F.tirer(n).entries()) {
      questions++;
      vus.add(brut.enonce.join(' '));
      const probs = verifierBrut(brut).concat(verifierRendu(F.rendre(brut)));
      if (probs.length) {
        mauvais++;
        if (echecs.length < 8) echecs.push(`ex${n} س${i + 1}: ${brut.enonce.join(' ')}\n    - ` + probs.join('\n    - '));
      }
    }
  }
  console.log(`ex${n} — ${F.PROBLEMES[n].titre}`.padEnd(48)
    + `${mauvais ? '✗ ' + mauvais + ' échec(s)' : '✓'}  (${F.PROBLEMES[n].questions} أسئلة، ${vus.size} صيغة)`);
}
if (echecs.length) console.log('\n' + echecs.join('\n'));
console.log(`\n${TIRAGES} tirages par exercice, ${questions} questions,`
  + ` ${relations} relations recalculées et ${controles} affirmations re-démontrées,`
  + ` ${echecs.length ? 'ÉCHECS' : '0 erreur'}.`);
process.exit(echecs.length ? 1 : 0);
