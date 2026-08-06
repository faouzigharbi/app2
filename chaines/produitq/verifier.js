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
  } else if (c.type === 'equation-p') {
    // On re-résout l'équation À PARTIR DE SON TEXTE : elle est affine en P,
    // donc évaluée en P = 0 puis P = 1 elle livre sa solution.
    const k = c.eq.indexOf('=');
    const g = c.eq.slice(0, k).replace(/×/g, '*'), d = c.eq.slice(k + 1).replace(/×/g, '*');
    const f = P => F.sub(F.analyser(g, { P }), F.analyser(d, { P }));
    const b0 = f(F.rat(0)), a1 = F.sub(f(F.rat(1)), b0);
    if (a1.n === 0) p.push("l'équation n'est pas du premier degré en P");
    else {
      const vrai = F.div(F.neg(b0), a1);
      if (!F.egaux(vrai, c.sol)) p.push(`الحلّ الحقيقي ${F.txt(vrai)} ≠ ${F.txt(c.sol)}`);
    }
    if (f(c.sol).n !== 0) p.push('التعويض بالحلّ لا يحقّق المعادلة');
    controles += 2;
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
  // On cherche une question PAR SON TYPE DE CONTRÔLE, pas par son rang :
  // les pages ont été renumérotées une fois, elles peuvent l'être encore.
  const trouver = (type, filtre) => {
    for (let essai = 0; essai < 400; essai++) {
      for (const n of Object.keys(F.PROBLEMES)) {
        for (const q of F.tirer(Number(n))) {
          if (q.controle.type === type && (!filtre || filtre(q))) return q;
        }
      }
    }
    throw new Error('aucune question de type ' + type);
  };
  const pousse = (nom, q, f) => { const c = copie(q); f(c); cas.push([nom, c]); };
  // Une falsification doit MORDRE quelle que soit la forme tirée.
  const casserSigne = d => (/ \+ /.test(d) ? d.replace(/ \+ /, ' - ')
    : (/ - /.test(d) ? d.replace(/ - /, ' + ') : d + ' + 1'));

  pousse('produit faussé', trouver('produit', q => q.controle.val.n !== 0),
    c => { c.controle.val = F.add(c.controle.val, F.rat(1)); });
  pousse('signe du produit inversé', trouver('produit', q => q.controle.val.n !== 0),
    c => { c.controle.val = F.neg(c.controle.val); });
  pousse('carré oublié dans le développement',
    trouver('identite', q => /\^2/.test(q.controle.droite)),
    c => { c.controle.droite = c.controle.droite.replace(/x\^2/, 'x'); });
  pousse('signe faussé dans le développement', trouver('identite'),
    c => { c.controle.droite = casserSigne(c.controle.droite); });
  pousse('factorisation fausse', trouver('identite', q => /\)$/.test(q.controle.droite)),
    c => { c.controle.droite = c.controle.droite.replace(/\)$/, ' + 1)'); });
  pousse('quotient faussé', trouver('quotient'),
    c => { c.controle.val = F.add(c.controle.val, F.rat(1)); });
  pousse('fraction étagée faussée', trouver('etagee'),
    c => { c.controle.val = F.add(c.controle.val, F.rat(1)); });
  pousse('signe déduit à l\'envers', trouver('signe-produit'),
    c => { c.controle.attendu = -c.controle.attendu; });
  pousse('classe ℚ+/ℚ- inversée', trouver('classe'),
    c => { c.controle.attendu = -c.controle.attendu; });
  pousse('valeur absolue négative', trouver('absolu'),
    c => { c.controle.val = F.neg(c.controle.val); });
  pousse('solution d\'équation décalée', trouver('equation-p'),
    c => { c.controle.sol = F.add(c.controle.sol, F.rat(1)); });
  pousse('étape dupliquée', trouver('produit'),
    c => { c.etapes[3] = c.etapes[2].slice(); });

  let bon = 0;
  for (const [nom, q] of cas) {
    const probs = verifierBrut(q);
    console.log((probs.length ? '✗ rejeté  ' : '⚠ ACCEPTÉ ') + nom
      + (probs.length ? ' — ' + probs[0].slice(0, 80) : ''));
    if (probs.length) bon++;
  }
  console.log(`\n${bon}/${cas.length} falsifications détectées.`);
  process.exit(bon === cas.length ? 0 : 1);
}

for (const n of Object.keys(F.PROBLEMES).map(Number).sort((a, b) => a - b)) {
  let mauvais = 0; const vus = new Set(), modeles = new Set();
  for (let t = 0; t < TIRAGES; t++) {
    for (const [i, brut] of F.tirer(n).entries()) {
      questions++;
      vus.add(brut.enonce.join(' '));
      if (brut.controle.modele) modeles.add(brut.controle.modele);
      const probs = verifierBrut(brut).concat(verifierRendu(F.rendre(brut)));
      if (probs.length) {
        mauvais++;
        if (echecs.length < 8) echecs.push(`ex${n} س${i + 1}: ${brut.enonce.join(' ')}\n    - ` + probs.join('\n    - '));
      }
    }
  }
  console.log(`ex${n} — ${F.PROBLEMES[n].titre}`.padEnd(48)
    + `${mauvais ? '✗ ' + mauvais + ' échec(s)' : '✓'}  (${modeles.size} نماذج، ${vus.size} صيغة)`);
}
if (echecs.length) console.log('\n' + echecs.join('\n'));
console.log(`\n${TIRAGES} tirages par type, ${questions} questions,`
  + ` ${relations} relations recalculées et ${controles} affirmations re-démontrées,`
  + ` ${echecs.length ? 'ÉCHECS' : '0 erreur'}.`);
process.exit(echecs.length ? 1 : 0);
