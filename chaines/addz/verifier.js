// Valide toutes les chaînes de la fiche sur un grand nombre de tirages.
//   node verifier.js [tirages]
//   CONTRE_EXEMPLES=1 node verifier.js
//
// Un générateur ne se relit pas, il s'exécute. Sur CHAQUE question tirée :
//
//   1. toute relation écrite dans une étape (« … = … », « … > 0 ») est
//      recalculée par l'analyseur, non pas une fois mais pour DES DIZAINES
//      d'environnements tirés au hasard parmi ceux que l'énoncé autorise.
//      Une étape juste par chance ne passe pas ;
//   2. la forme réduite annoncée — « E = a − b + 13/8 » — est confrontée à la
//      DÉFINITION IMPRIMÉE dans l'énoncé, pour tout couple (a, b). C'est la
//      seule preuve que la levée des parenthèses est correcte ;
//   3. les équations sont RÉSOLUES à nouveau à partir du texte affiché : on
//      évalue « gauche − droite » en 0 et en 1, ce qui donne la fonction
//      affine, donc l'unique solution ;
//   4. pour |x| = k, la conclusion doit suivre le signe de k — deux solutions
//      opposées si k > 0, aucune si k < 0 ;
//   5. toute comparaison doit passer par le SIGNE DE LA DIFFÉRENCE. Les
//      propriétés de l'ordre sont du programme de 9e : une chaîne qui les
//      invoque est refusée ;
//   6. aucune étape dupliquée (deux ordres seraient corrects) et chaque
//      expression isolée en dir="ltr".
const F = require('./noyau.js');
const S = require('./formes.js');
require('./questions.js');
require('./equations.js');
require('./gens.js');
const EXOS = Object.keys(F.PROBLEMES).map(Number).sort((a, b) => a - b);

const TIRAGES = Number(process.argv[2]) || 200;
const ECHANTILLONS = 30;

let relations = 0, controles = 0, questions = 0;
const echecs = [];

// Cette fiche vit dans ℤ : les valeurs d'essai sont des entiers.
const rnd = () => F.rat(F.ent(-25, 25));

// Les formulations du programme de 9e, interdites en 8e.
const INTERDIT = [
  [/تحفظ الترتيب/, 'خاصية « الإضافة تحفظ الترتيب » من برنامج 9 أساسي'],
  [/طرفا بطرف/, 'جمع متفاوتتين طرفا بطرف من برنامج 9 أساسي'],
  [/نفس الاتجاه/, 'جمع متفاوتتين في نفس الاتجاه من برنامج 9 أساسي']
];

// ---------------------------------------------------------------------------
// Les environnements admissibles : ce que l'énoncé permet, rien de plus.
// ---------------------------------------------------------------------------
function environnements(c) {
  if (c.type === 'equation') return [{ x: c.sol }];
  if (c.type === 'abs') return c.possible ? [{ x: c.m }, { x: F.neg(c.m) }] : [];
  // « قارن A و B » : A et B sont des nombres connus, mais la chaîne les
  // désigne par leur nom — il faut donc les lier dans l'environnement.
  if (c.type === 'nombres') return [{ [c.nomA]: c.vA, [c.nomB]: c.vB }];
  // Deux cas : x prend l'une puis l'autre valeur, le reste est tiré normalement.
  if (c.type === 'deux-cas') {
    return [c.x1, c.x2].map(x => construire(Object.assign({}, c,
      { fixes: Object.assign({}, c.fixes, { x }) })));
  }

  const out = [];
  const combien = (c.libres && c.libres.length) ? ECHANTILLONS : 1;
  for (let i = 0; i < combien; i++) {
    let env = null;
    // Certaines questions n'ont de sens que sous une contrainte (« a < b »).
    // On tire jusqu'à ce qu'elle soit satisfaite : l'environnement doit être
    // un cas que l'énoncé permet, sinon on vérifierait autre chose.
    for (let essai = 0; essai < 400 && !env; essai++) {
      const e = construire(c);
      if (!c.contrainte) { env = e; break; }
      const v = F.signe(F.analyser(c.contrainte.expr, e));
      if (v === c.contrainte.sens || (c.contrainte.large && v === 0)) env = e;
    }
    if (!env) throw new Error('contrainte impossible: ' + JSON.stringify(c.contrainte));
    out.push(env);
  }
  return out;
}

function construire(c) {
  {
    const env = {};
    (c.libres || []).forEach(v => { env[v] = rnd(); });
    Object.keys(c.fixes || {}).forEach(v => { env[v] = c.fixes[v]; });
    // Un énoncé peut lier plusieurs variables à la fois (« a - b = … et
    // c - a = … ») : on accepte une liste de liens, appliqués dans l'ordre.
    [].concat(c.lie || []).forEach(l => {
      const a = env[l.autre];
      env[l.nom] = l.via === 'somme' ? F.sub(l.valeur, a)
        : l.via === 'difference' ? F.sub(a, l.valeur)
        : l.via === 'plus' ? F.add(a, l.valeur)
        : l.via === 'oppose' ? F.neg(a) : a;
    });
    // Filet : une variable présente dans l'expression imprimée mais dont
    // l'énoncé ne dit rien (le « a » de l'exercice 8, le « y » du 4) doit
    // quand même recevoir une valeur — et une valeur qui change à chaque
    // tirage, sinon on ne verrait pas qu'elle s'élimine.
    variables(c).forEach(v => { if (!(v in env)) env[v] = rnd(); });
    return lier(c)(env);
  }
}

// Toutes les lettres qui apparaissent dans les expressions imprimées.
function variables(c) {
  const s = new Set();
  Object.keys(c.defs || {}).forEach(nom => {
    (String(c.defs[nom]).match(/[a-zA-Z]+/g) || []).forEach(v => s.add(v));
  });
  return Array.from(s);
}

// Lie E, F, A, B … à leur définition imprimée : c'est ainsi que les étapes
// « E = … » deviennent vérifiables sans jamais consulter le générateur.
const lier = c => env => {
  Object.keys(c.defs || {}).forEach(nom => { env[nom] = F.analyser(c.defs[nom], env); });
  return env;
};

// Un environnement construit à la main (une racine imposée, un couple choisi)
// n'a que les variables qu'on lui a données : les autres, présentes dans les
// expressions imprimées, doivent être complétées avant toute évaluation.
function completer(c, base) {
  const env = Object.assign({}, base);
  variables(c).forEach(v => { if (!(v in env)) env[v] = rnd(); });
  return lier(c)(env);
}

// ---------------------------------------------------------------------------
// Re-résolution d'une équation du premier degré À PARTIR DE SON TEXTE.
// ---------------------------------------------------------------------------
function resoudre(eq) {
  const k = eq.indexOf('=');
  const g = eq.slice(0, k), d = eq.slice(k + 1);
  const f = x => F.sub(F.analyser(g, { x }), F.analyser(d, { x }));
  const b0 = f(F.rat(0)), a1 = F.sub(f(F.rat(1)), b0);
  if (a1.n === 0) return null;
  return F.div(F.neg(b0), a1);
}

// ---------------------------------------------------------------------------
// Les affirmations, re-démontrées sans faire confiance au générateur
// ---------------------------------------------------------------------------
function controlerClaim(c, etapes, envs) {
  const p = [];

  // La forme réduite annoncée doit valoir la définition imprimée, partout.
  if (c.verifierForme) {
    const { nom, cible, u, v, w } = c.verifierForme;
    for (const env of envs) {
      const attendu = S.valeurForme(cible, env[u], v ? env[v] : null, w ? env[w] : null);
      if (!F.egaux(env[nom], attendu)) {
        p.push(`${nom} = ${F.txt(env[nom])} بدل ${F.txt(attendu)} عند ${u} = ${F.txt(env[u])}`);
        break;
      }
      controles++;
    }
  }

  if (c.relation) {
    for (const env of envs) {
      const g = F.analyser(c.relation.g, env), d = F.analyser(c.relation.d, env);
      if (F.cmp(g, d) !== c.relation.sens) {
        p.push(`« ${c.relation.g} ${c.relation.sens < 0 ? '<' : '>'} ${c.relation.d} »`
               + ` فاسدة: ${F.txt(g)} و ${F.txt(d)}`);
        break;
      }
      controles++;
    }
  }

  for (const cl of c.claims || []) {
    for (const env of envs) {
      if (!F.egaux(env[cl.nom], cl.vaut)) {
        p.push(`${cl.nom} = ${F.txt(env[cl.nom])} بدل ${F.txt(cl.vaut)}`);
        break;
      }
      controles++;
    }
  }

  if (c.type === 'combinaison') {
    // On refait le chemin inverse : la combinaison annoncée, réinjectée dans
    // la forme, doit bien redonner la valeur imposée.
    const attendu = F.add(c.res, c.sh.cible.k);
    if (!F.egaux(attendu, c.val)) p.push(`العودة تعطي ${F.txt(attendu)} بدل ${F.txt(c.val)}`);
    controles++;
  } else if (c.type === 'comparaison-var') {
    // E = 0 impose u - v = -k : on le vérifie sur des couples construits exprès.
    for (let i = 0; i < ECHANTILLONS; i++) {
      const u = rnd(), v = F.sub(u, c.d);
      const env = completer(c, { [c.sh.u]: u, [c.sh.v]: v });
      if (env[c.sh.nom].n !== 0) { p.push('الشرط E = 0 لا يوافق الفرق المعلن'); break; }
      if ((F.cmp(u, v) < 0) !== c.petit) { p.push('الاستنتاج مخالف لإشارة الفرق'); break; }
      controles++;
    }
  } else if (c.type === 'comparaison-formes') {
    for (let i = 0; i < ECHANTILLONS; i++) {
      const env = completer(c, { a: rnd(), b: rnd() });
      const d = F.sub(env[c.shE.nom], env[c.shF.nom]);
      if (!F.egaux(d, c.d)) { p.push(`الفرق الحقيقي ${F.txt(d)} ≠ ${F.txt(c.d)}`); break; }
      if ((F.signe(d) < 0) !== c.petit) { p.push('الاستنتاج مخالف لإشارة الفرق'); break; }
      controles++;
    }
  } else if (c.type === 'nombres') {
    const d = F.sub(c.vA, c.vB);
    if (!F.egaux(d, c.d)) p.push('الفرق المعلن خاطئ');
    if ((F.signe(d) < 0) !== c.petit) p.push('الاستنتاج مخالف لإشارة الفرق');
    controles++;
  } else if (c.type === 'deux-cas') {
    // Les deux racines doivent bien vérifier |x - q| = r, et donner v1 et v2.
    for (const [x, v] of [[c.x1, c.v1], [c.x2, c.v2]]) {
      const env = completer(c, { x });
      if (!F.egaux(env[c.sh.nom], v)) p.push(`الحالة x = ${F.txt(x)} تعطي ${F.txt(env[c.sh.nom])} بدل ${F.txt(v)}`);
      controles++;
    }
    if (F.egaux(c.x1, c.x2)) p.push('الحالتان متطابقتان');
  } else if (c.type === 'equation') {
    const s = resoudre(c.eq);
    if (!s) p.push('المعادلة ليست من الدرجة الأولى');
    else if (!F.egaux(s, c.sol)) p.push(`الحلّ الحقيقي ${F.txt(s)} ≠ ${F.txt(c.sol)}`);
    const k = c.eq.indexOf('=');
    if (!F.egaux(F.analyser(c.eq.slice(0, k), { x: c.sol }), F.analyser(c.eq.slice(k + 1), { x: c.sol }))) {
      p.push('التعويض بالحلّ لا يحقّق المعادلة');
    }
    controles += 2;
  } else if (c.type === 'abs') {
    // « 7 - |x| = -1 » : le coefficient de |x| vaut -1, pas +1. On retrouve
    // donc |x| comme on résout une équation du premier degré — en évaluant
    // le membre de gauche en |x| = 0 puis en |x| = 1 (soit x = 0 puis x = 1).
    const k = c.eq.indexOf('=');
    const g = c.eq.slice(0, k), dte = c.eq.slice(k + 1);
    const droite = F.analyser(dte, {});
    const beta = F.sub(F.analyser(g, { x: F.rat(0) }), droite);
    const alpha = F.sub(F.sub(F.analyser(g, { x: F.rat(1) }), droite), beta);
    if (alpha.n === 0) { p.push('المعادلة لا تحتوي |x|'); return p; }
    const m = F.div(F.neg(beta), alpha);
    if (!F.egaux(m, c.m)) p.push(`|x| = ${F.txt(m)} بدل ${F.txt(c.m)}`);
    if ((F.signe(m) > 0) !== c.possible) p.push('الاستنتاج لا يوافق إشارة العضو الثاني');
    const conclusion = etapes[etapes.length - 1][1];
    if (c.possible) {
      for (const x of [m, F.neg(m)]) {
        if (!F.egaux(F.analyser(g, { x }), droite)) p.push(`${F.txt(x)} ليس حلاّ`);
      }
      if (!/x = /.test(conclusion)) p.push('الخاتمة لا تعلن الحلّين');
    } else if (!/لا يوجد/.test(conclusion)) {
      p.push('الخاتمة لا تعلن انعدام الحلّ');
    }
    controles += 2;
  }
  return p;
}

// ---------------------------------------------------------------------------
function verifierBrut(brut) {
  const probs = [];
  const c = brut.controle;
  const envs = environnements(c);
  let verifiees = 0;

  brut.etapes.forEach(([label, math], i) => {
    for (const [motif, raison] of INTERDIT) {
      if (motif.test(label) || motif.test(math)) probs.push(`م${i + 1}: ${raison}`);
    }
    if (F.ARABE.test(math)) return;               // ligne de règle, pas de calcul
    const lots = /[a-zA-Z]/.test(math) ? envs : [{}];
    if (!lots.length) return;                     // aucune valeur admissible
    for (const env of lots) {
      try {
        const r = F.verifierRelation(math, env);
        if (r === null) { probs.push(`م${i + 1}: « ${math} » ليست علاقة`); break; }
        if (r) { probs.push(`م${i + 1}: ${r}`); break; }
        relations++;
      } catch (e) { probs.push(`م${i + 1}: تعذّر « ${math} » (${e.message})`); break; }
    }
    verifiees++;
  });

  if (verifiees < (envs.length ? 3 : 2)) probs.push(`مراحل قابلة للتحقق: ${verifiees} فقط`);
  probs.push(...controlerClaim(c, brut.etapes, envs));

  const textes = brut.etapes.map(e => e.join(': '));
  if (new Set(textes).size !== textes.length) probs.push('مراحل مكرّرة');
  if (textes.length < 4) probs.push('السلسلة قصيرة جدا');
  if (!brut.indice) probs.push('بلا مساعدة');
  if (!brut.enonce.some(x => F.ARABE.test(x))) probs.push('نصّ عربي مفقود في السؤال');
  return probs;
}

// Les blocs isolés contiennent eux-mêmes des <span> (les fractions) : il faut
// suivre l'imbrication, une expression paresseuse s'arrêterait trop tôt.
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
    if (/<span/.test(nu)) probs.push('وسم خارج العزل: ' + nu.trim());
    if (/[\d)]\s*[+\-*×÷|<>=]\s*[\d(a-zA-Z]|[a-zA-Z]\s*[+\-=]\s*[a-zA-Z\d(]/.test(nu)) {
      probs.push('عبارة غير معزولة: ' + nu.trim());
    }
  }
  return probs;
}

// ---------------------------------------------------------------------------
// Un contrôle qui n'échoue jamais ne prouve rien.
// ---------------------------------------------------------------------------
if (process.env.CONTRE_EXEMPLES) {
  const copie = q => JSON.parse(JSON.stringify(q));
  const cas = [];
  const prem = n => F.tirer(n);
  const l1 = prem(1);
  const a1 = copie(l1[0]); a1.etapes[a1.etapes.length - 1][1] += ' + 1';
  cas.push(['forme réduite falsifiée', a1]);
  const a2 = copie(l1[0]); a2.etapes[0][1] = a2.etapes[0][1].replace('- ', '+ ');
  cas.push(['parenthèse mal levée', a2]);
  const a3 = copie(l1[1]); a3.etapes[1] = a3.etapes[0].slice();
  cas.push(['étape dupliquée', a3]);
  const l3 = prem(3);
  const eq = l3.find(q => q.controle.type === 'equation');
  const a4 = copie(eq); a4.controle.sol = F.add(a4.controle.sol, F.rat(1));
  cas.push(["solution d'équation décalée", a4]);
  const ab = l3.find(q => q.controle.type === 'abs');
  const a5 = copie(ab); a5.controle.possible = !a5.controle.possible;
  cas.push(['conclusion opposée au signe de |x|', a5]);
  const l17 = prem(17);
  const cp = l17.find(q => q.controle.relation);
  const a6 = copie(cp); a6.controle.relation.sens = -a6.controle.relation.sens;
  cas.push(['comparaison inversée', a6]);
  const a7 = copie(cp);
  a7.etapes[3] = ['القاعدة', 'نضيف نفس العدد إلى الطرفين لأنّ الإضافة تحفظ الترتيب'];
  cas.push(["propriété de l'ordre (programme de 9e)", a7]);

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

// ---------------------------------------------------------------------------
for (const n of EXOS) {
  let mauvais = 0, vus = new Set(), nb = 0;
  for (let t = 0; t < TIRAGES; t++) {
    const lot = F.tirer(n);
    if (lot.length !== F.PROBLEMES[n].questions) {
      echecs.push(`ex${n}: ${lot.length} أسئلة بدل ${F.PROBLEMES[n].questions}`);
      break;
    }
    nb = lot.length;
    lot.forEach((brut, i) => {
      questions++;
      vus.add(brut.enonce.join(' '));
      const probs = verifierBrut(brut).concat(verifierRendu(F.rendre(brut)));
      if (probs.length) {
        mauvais++;
        if (echecs.length < 10) {
          echecs.push(`ex${n} س${i + 1}: ${brut.enonce.join(' ')}\n    - ` + probs.join('\n    - '));
        }
      }
    });
  }
  console.log(`ex${String(n).padStart(2)} — ${F.PROBLEMES[n].titre}`.padEnd(52)
    + `${mauvais ? '✗ ' + mauvais + ' échec(s)' : '✓'}  (${nb} أسئلة، ${vus.size} صيغة)`);
}

if (echecs.length) console.log('\n' + echecs.join('\n'));
console.log(`\n${TIRAGES} tirages par exercice, ${questions} questions,`
  + ` ${relations} relations recalculées et ${controles} affirmations re-démontrées,`
  + ` ${echecs.length ? 'ÉCHECS' : '0 erreur'}.`);
process.exit(echecs.length ? 1 : 0);
