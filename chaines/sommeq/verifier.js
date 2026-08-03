// Valide l'exercice 18 sur un grand nombre de tirages.
//   node verifier.js [tirages]
//
// Un générateur ne se relit pas, il s'exécute. Sur CHAQUE tirage, et pour
// chacune des sept sous-questions :
//
//   1. toute relation écrite dans une étape (« … = … », « … > 0 ») est
//      recalculée avec l'analyseur et doit être vraie — non pas une fois,
//      mais pour DES DIZAINES de couples (a, b) tirés au hasard parmi ceux
//      que l'énoncé autorise. Une étape juste « par chance » ne passe pas ;
//   2. la valeur annoncée pour E ou pour F est recalculée à partir de la
//      DÉFINITION IMPRIMÉE dans l'énoncé, jamais à partir des variables
//      internes du générateur ;
//   3. les équations sont RÉSOLUES à nouveau, à partir de la chaîne de
//      caractères affichée : on évalue le membre de gauche moins celui de
//      droite en 0 et en 1, ce qui donne la fonction affine, donc l'unique
//      solution. Elle doit coïncider avec celle qu'annonce la chaîne ;
//   4. pour l'équation à valeur absolue, on retrouve |x| = k depuis l'énoncé
//      affiché et l'on vérifie que la conclusion suit le signe de k — deux
//      solutions opposées si k > 0, aucune si k < 0 ;
//   5. aucune étape dupliquée (sinon deux ordres seraient corrects) et
//      chaque expression mathématique isolée en dir="ltr".
const F = require('./noyau.js');
const G = require('./gen18.js');

const TIRAGES = Number(process.argv[2]) || 300;
const ECHANTILLONS = 40;          // couples (a, b) essayés par question littérale

let controles = 0, relations = 0, questions = 0;
const echecs = [];

const rnd = () => F.rat(F.ent(-20, 20), F.ent(1, 12));

// ---------------------------------------------------------------------------
// Les environnements admissibles : ce que l'énoncé permet, rien de plus.
// ---------------------------------------------------------------------------
function environnements(c) {
  const envs = [];
  const lier = (a, b) => {
    const e = { a, b };
    e.E = F.analyser(c.defs.E, e);
    e.F = F.analyser(c.defs.F, e);
    return e;
  };
  if (c.type === 'somme') {
    for (let i = 0; i < ECHANTILLONS; i++) { const a = rnd(); envs.push(lier(a, F.sub(c.s, a))); }
  } else if (c.type === 'opposes') {
    for (let i = 0; i < ECHANTILLONS; i++) { const a = rnd(); envs.push(lier(a, F.neg(a))); }
  } else if (c.type === 'egaux') {
    for (let i = 0; i < ECHANTILLONS; i++) { const a = rnd(); envs.push(lier(a, a)); }
  } else if (c.type === 'equation') {
    envs.push({ x: c.sol });
  } else if (c.type === 'abs' && c.possible) {
    envs.push({ x: c.m }, { x: F.neg(c.m) });
  }
  return envs;                     // vide = cas sans solution : rien à substituer
}

// ---------------------------------------------------------------------------
// Re-résolution d'une équation du premier degré À PARTIR DE SON TEXTE.
// f(x) = gauche - droite est affine : f(x) = α x + β, donc x = -β/α.
// ---------------------------------------------------------------------------
function resoudre(eq) {
  const k = eq.indexOf('=');
  const g = eq.slice(0, k), d = eq.slice(k + 1);
  const f = x => F.sub(F.analyser(g, { x }), F.analyser(d, { x }));
  const b0 = f(F.rat(0)), a1 = F.sub(f(F.rat(1)), b0);
  if (a1.n === 0) return null;                       // pas du premier degré
  return F.div(F.neg(b0), a1);
}

// ---------------------------------------------------------------------------
// Contrôle des affirmations, recalculées sans faire confiance au générateur
// ---------------------------------------------------------------------------
function controlerClaim(c, etapes) {
  const p = [];
  if (c.type === 'somme' || c.type === 'opposes') {
    // La valeur annoncée doit sortir de la définition imprimée, pour TOUT
    // couple admissible : c'est ce qui prouve que E ne dépend que de a + b.
    for (const env of environnements(c)) {
      const v = env[c.nom];
      if (!F.egaux(v, c.valeur)) {
        p.push(`${c.nom} = ${F.txt(v)} عند a = ${F.txt(env.a)} بدل ${F.txt(c.valeur)}`);
        break;
      }
      controles++;
    }
  } else if (c.type === 'egaux') {
    // Le résultat doit rester en fonction de a : deux valeurs de a doivent
    // donner deux valeurs de F, sinon la question n'a pas de sens.
    const e1 = { a: F.rat(1), b: F.rat(1) }, e2 = { a: F.rat(2), b: F.rat(2) };
    const f1 = F.analyser(c.defs.F, e1), f2 = F.analyser(c.defs.F, e2);
    if (F.egaux(f1, f2)) p.push('F لا يتعلّق بـ a — السؤال بلا معنى');
    controles++;
  } else if (c.type === 'equation') {
    const s = resoudre(c.eq);
    if (!s) p.push('المعادلة ليست من الدرجة الأولى');
    else if (!F.egaux(s, c.sol)) p.push(`الحلّ الحقيقي ${F.txt(s)} ≠ ${F.txt(c.sol)}`);
    const k = c.eq.indexOf('=');
    const g = F.analyser(c.eq.slice(0, k), { x: c.sol });
    const d = F.analyser(c.eq.slice(k + 1), { x: c.sol });
    if (!F.egaux(g, d)) p.push('التعويض بالحلّ لا يحقّق المعادلة');
    controles += 2;
  } else if (c.type === 'abs') {
    // |x| = k retrouvé depuis le texte : gauche(0) donne la somme des
    // constantes, la différence avec le membre droit donne k.
    const k = c.eq.indexOf('=');
    const cste = F.analyser(c.eq.slice(0, k), { x: F.rat(0) });
    const droite = F.analyser(c.eq.slice(k + 1), {});
    const m = F.sub(droite, cste);
    if (!F.egaux(m, c.m)) p.push(`|x| = ${F.txt(m)} بدل ${F.txt(c.m)}`);
    if ((F.signe(m) > 0) !== c.possible) p.push('الاستنتاج لا يوافق إشارة العضو الثاني');
    const conclusion = etapes[etapes.length - 1][1];
    if (c.possible) {
      for (const x of [m, F.neg(m)]) {
        const g = F.analyser(c.eq.slice(0, k), { x });
        if (!F.egaux(g, droite)) p.push(`${F.txt(x)} ليس حلاّ`);
      }
      if (!/x = /.test(conclusion)) p.push('الخاتمة لا تعلن الحلّين');
    } else if (!/لا يوجد/.test(conclusion)) {
      p.push('الخاتمة لا تعلن انعدام الحلّ');
    }
    controles += 2;
  } else {
    p.push('نوع غير معروف: ' + c.type);
  }
  return p;
}

// ---------------------------------------------------------------------------
function verifierBrut(brut) {
  const probs = [];
  const envs = environnements(brut.controle);
  let verifiees = 0;

  brut.etapes.forEach(([label, math], i) => {
    if (F.ARABE.test(math)) return;                  // ligne de règle, pas de calcul
    const aVariable = /[a-zA-Z]/.test(math);
    const lots = aVariable ? envs : [{}];
    if (!lots.length) return;                        // pas de valeur admissible : rien à tester
    for (const env of lots) {
      try {
        const r = F.verifierRelation(math, env);
        if (r === null) { probs.push(`م${i + 1}: « ${math} » ليست علاقة`); break; }
        if (r) { probs.push(`م${i + 1}: ${r}`); break; }
        relations++;
      } catch (e) { probs.push(`م${i + 1}: تعذّر حساب « ${math} » (${e.message})`); break; }
    }
    verifiees++;
  });

  // Quand la conclusion est « pas de solution », aucune valeur ne peut être
  // substituée à x : seules les lignes purement numériques sont contrôlables.
  const mini = envs.length ? 3 : 2;
  if (verifiees < mini) probs.push(`مراحل قابلة للتحقق: ${verifiees} فقط`);
  probs.push(...controlerClaim(brut.controle, brut.etapes));

  const textes = brut.etapes.map(e => e.join(': '));
  if (new Set(textes).size !== textes.length) probs.push('مراحل مكرّرة');
  if (textes.length < 5) probs.push('السلسلة قصيرة جدا');
  if (!brut.indice) probs.push('بلا مساعدة');
  if (!brut.enonce.some(p => F.ARABE.test(p))) probs.push('نصّ عربي مفقود في السؤال');
  return probs;
}

// Les blocs isolés contiennent eux-mêmes des <span> (les fractions) : il faut
// donc suivre l'imbrication, une expression régulière paresseuse s'arrêterait
// à la première balise fermante venue et laisserait croire à une fuite.
function retirerBlocs(html) {
  let s = String(html), d;
  while ((d = s.indexOf('<span dir="ltr"')) >= 0) {
    let i = s.indexOf('>', d) + 1, prof = 1;
    while (prof > 0 && i < s.length) {
      if (s.startsWith('<span', i)) { prof++; i = s.indexOf('>', i) + 1; }
      else if (s.startsWith('</span>', i)) { prof--; i += 7; }
      else i++;
    }
    if (prof > 0) return s + ' ⟵ بلاغة غير مغلقة';
    s = s.slice(0, d) + ' ' + s.slice(i);
  }
  return s;
}

function verifierRendu(q) {
  const probs = [];
  for (const s of [q.operation].concat(q.steps)) {
    const nu = retirerBlocs(s);
    if (/<span/.test(nu)) probs.push('بلاغة خارج العزل: ' + nu.trim());
    if (/[\d)]\s*[+\-*×÷|<>=]\s*[\d(a-zA-Z]|[a-zA-Z]\s*[+\-=]\s*[a-zA-Z\d(]/.test(nu)) {
      probs.push('عبارة غير معزولة: ' + nu.trim());
    }
  }
  return probs;
}

// ---------------------------------------------------------------------------
// Un contrôle qui n'échoue jamais ne prouve rien : CONTRE_EXEMPLES=1 fabrique
// des chaînes fausses et vérifie qu'elles sont bien refusées.
// ---------------------------------------------------------------------------
if (process.env.CONTRE_EXEMPLES) {
  const copie = q => JSON.parse(JSON.stringify(q));
  const lot = F.tirer(18);
  const cas = [];

  const c1 = copie(lot[0]);                       // constante fausse dans E
  c1.etapes[3][1] = c1.etapes[3][1].replace(/= .*$/, '= 7/3');
  cas.push(['constante de E falsifiée', c1]);

  const c2 = copie(lot[1]);                       // parenthèse développée à l'envers
  c2.etapes[1][1] = c2.etapes[1][1].replace('= -', '= +');
  cas.push(['parenthèse mal levée dans F', c2]);

  const c3 = copie(lot[4]);                       // solution décalée de 1
  c3.controle.sol = F.add(c3.controle.sol, F.rat(1));
  cas.push(['solution d\'équation décalée', c3]);

  const c4 = copie(lot[6]);                       // conclusion contraire au signe
  c4.controle.possible = !c4.controle.possible;
  cas.push(['conclusion opposée au signe de |x|', c4]);

  const c5 = copie(lot[2]);                       // deux étapes identiques
  c5.etapes[3] = c5.etapes[2].slice();
  cas.push(['étape dupliquée (deux ordres corrects)', c5]);

  let bon = 0;
  for (const [nom, q] of cas) {
    const probs = verifierBrut(q);
    console.log((probs.length ? '✗ rejeté  ' : '⚠ ACCEPTÉ ') + nom
      + (probs.length ? ' — ' + probs[0] : ''));
    if (probs.length) bon++;
  }
  console.log(`\n${bon}/${cas.length} falsifications détectées.`);
  process.exit(bon === cas.length ? 0 : 1);
}

const parQuestion = [];
for (let t = 0; t < TIRAGES; t++) {
  const lot = F.tirer(18);
  if (lot.length !== 7) { echecs.push('الصفحة لا تحتوي 7 أسئلة'); break; }
  lot.forEach((brut, i) => {
    questions++;
    parQuestion[i] = parQuestion[i] || { mauvais: 0, vus: new Set() };
    parQuestion[i].vus.add(brut.enonce.join(' '));
    const probs = verifierBrut(brut).concat(verifierRendu(F.rendre(brut)));
    if (probs.length) {
      parQuestion[i].mauvais++;
      if (echecs.length < 10) {
        echecs.push(`س${i + 1}: ${brut.enonce.join(' ')}\n    - ` + probs.join('\n    - '));
      }
    }
  });
}

const NOMS = ['حساب E بمعلومية a+b', 'حساب F بمعلومية a+b', 'E و a و b متقابلان',
              'F بدلالة a', 'معادلة بقوس مطروح', 'معادلة بقوس مضاف', 'معادلة بقيمة مطلقة'];
parQuestion.forEach((q, i) => {
  console.log(`س${i + 1} — ${NOMS[i]}`.padEnd(34)
    + `${q.mauvais ? '✗ ' + q.mauvais + ' échec(s)' : '✓'}  (${q.vus.size} énoncés distincts)`);
});

if (echecs.length) console.log('\n' + echecs.join('\n'));
console.log(`\n${TIRAGES} tirages, ${questions} questions, ${relations} relations recalculées`
  + ` et ${controles} affirmations re-démontrées, ${echecs.length ? 'ÉCHECS' : '0 erreur'}.`);
process.exit(echecs.length ? 1 : 0);
