// Valide les treize séries sur un grand nombre de tirages.
//   node verifier.js [tirages]
//
// Deux régimes de contrôle :
//
//   • numérique — toute comparaison ou égalité écrite dans une étape est
//     recalculée en arithmétique rationnelle exacte ;
//   • littéral — une comparaison comme « a + 1/2 < a + 2/3 » n'a pas de valeur
//     à recalculer : elle est testée sur des CENTAINES de valeurs tirées au
//     hasard pour la variable, en respectant l'hypothèse quand il y en a une.
//     Si l'énoncé est faux pour un seul a, ça se voit.
//
// Contrôlé en plus, sur chaque instance :
//   – une part mathématique ne mélange jamais arabe et symboles ;
//   – la dernière étape annonce bien le résultat ;
//   – aucune étape dupliquée ;
//   – l'affirmation propre à la famille (tri, encadrement, relation…).
const F = require('./frac.js');
for (let n = 1; n <= 13; n++) require('./gen' + String(n).padStart(2, '0') + '.js');

const TIRAGES = Number(process.argv[2]) || 200;
const ECHANTILLONS = 120;
const COMPARAISON = /[<>≤≥=]/;

let controles = 0, instances = 0, echantillons = 0;
const echecs = [];

// Un jeu de valeurs au hasard pour les variables, respectant l'hypothèse.
function environnement(vars, contrainte) {
  for (let essai = 0; essai < 200; essai++) {
    const env = {};
    for (const v of vars) env[v] = F.ratAleatoire(25, 15);
    if (!contrainte) return env;
    const m = contrainte.split(/\s*([<>≤≥])\s*/);
    const r = F.cmp(env[m[0].trim()], env[m[2].trim()]);
    const ok = { '<': r < 0, '>': r > 0, '≤': r <= 0, '≥': r >= 0 }[m[1]];
    if (ok) return env;
  }
  return null;
}

function partiesVerifiables(math) {
  return String(math).split(';').map(x => x.trim())
    // « = -6 » est la déclaration finale, sans membre gauche : elle est
    // contrôlée par la règle « la dernière étape annonce le résultat ».
    .filter(x => x && COMPARAISON.test(x) && !F.ARABE.test(x)
                 && !x.includes('|') && !/^[<>≤≥=]/.test(x));
}

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
        // Le nombre de volets attendu se lit dans la fiche : soit exercice par
        // exercice, soit d'un seul PAR_PAGE pour les fiches d'arithmétique.
        const attendu = (def.questions !== undefined) ? def.questions
                      : (F.PAR_PAGE !== undefined ? F.PAR_PAGE : null);
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

function verifierBrut(n, brut) {
  const probs = [];
  let verifiees = 0;
  const c = brut.controle;
  // Le type « relation » comporte lui aussi une identité valable pour tout x
  // et tout y : il demande donc le même échantillonnage.
  const litteral = c.type === 'litteral' || c.type === 'relation';
  const vars = c.vars || ['x', 'y'];

  // Aucune part ne doit mêler arabe et symboles : le rendu s'appuie dessus.
  for (const [, math] of brut.etapes) {
    if (F.ARABE.test(math) && /[<>≤≥=+×]/.test(math)) {
      probs.push('جزء يخلط العربية والرموز: « ' + math + ' »');
    }
  }

  const envs = litteral
    ? Array.from({ length: ECHANTILLONS }, () => environnement(vars, c.contrainte))
    : [{}];
  if (envs.some(e => e === null)) { probs.push('تعذّر توليد قيم تحقّق الفرضية'); return probs; }

  for (const env of envs) {
    if (litteral) echantillons++;
    brut.etapes.forEach(([label, math], i) => {
      for (const part of partiesVerifiables(math)) {
        try {
          const r = F.verifierComparaison(part, env);
          if (r) probs.push(`م${i + 1}: ${r}`);
          if (env === envs[0]) { verifiees++; controles++; }
        } catch (e) { probs.push(`م${i + 1}: تعذّر تحليل « ${part} » — ${e.message}`); }
      }
    });
    // Les égalités de réduction, quand la famille en déclare.
    for (const eq of (c.egalites || [])) {
      const r = F.verifierComparaison(eq, env);
      if (r) probs.push('اختصار فاسد: ' + r);
      controles++;
    }
    if (c.egalite) {
      const r = F.verifierComparaison(c.egalite, environnement(['x', 'y']));
      if (r) probs.push('عاملٌ مشترك فاسد: ' + r);
      controles++;
    }
    if (probs.length > 4) break;
  }

  if (verifiees < 1) probs.push('لا توجد مرحلة قابلة للتحقق');

  // La dernière étape doit annoncer le résultat.
  const derniere = String(brut.etapes[brut.etapes.length - 1][1]).trim();
  if (derniere !== brut.res && derniere !== '= ' + brut.res) {
    probs.push(`المرحلة الأخيرة « ${derniere} » لا تطابق النتيجة « ${brut.res} »`);
  }

  probs.push(...controlerFamille(c));
  probs.push(...controlerMethode(brut, c));
  controles += 2;

  const textes = brut.etapes.map(e => e.join(': '));
  if (new Set(textes).size !== textes.length) probs.push('مراحل مكرّرة');
  if (textes.length < 4) probs.push('السلسلة قصيرة جدا');
  return probs;
}

// ---------------------------------------------------------------------------
// Contrôle de MÉTHODE, pas seulement de vérité.
//
// Dès qu'une expression contient un inconnu, la comparaison se fait par le
// SIGNE DE LA DIFFÉRENCE, et par rien d'autre. Les propriétés de l'ordre —
// « ajouter le même nombre conserve l'ordre », « on additionne deux
// inégalités membre à membre » — relèvent du programme de 9e année et n'ont
// pas leur place ici. Cette règle est donc vérifiée, pas seulement respectée.
// ---------------------------------------------------------------------------
const INTERDIT = [
  [/تحفظ الترتيب/, 'خاصية « الإضافة تحفظ الترتيب » من برنامج 9 أساسي'],
  [/طرفا بطرف/, 'جمع متفاوتتين طرفا بطرف من برنامج 9 أساسي'],
  [/نفس الاتجاه/, 'جمع متفاوتتين في نفس الاتجاه من برنامج 9 أساسي']
];

function controlerMethode(brut, c) {
  const p = [];
  const textes = brut.etapes.map(e => e.join(': '));
  for (const t of textes) {
    for (const [re, msg] of INTERDIT) if (re.test(t)) p.push(msg + ': « ' + t + ' »');
  }
  if (c.type === 'litteral') {
    if (!textes.some(t => /الفرق/.test(t))) p.push('لا توجد مرحلة تحسب الفرق');
    if (!brut.etapes.some(([, m]) => /[<>]\s*0$/.test(String(m).trim()))) {
      p.push('لا توجد مرحلة تحدّد إشارة الفرق');
    }
  }
  return p;
}

// Chaque famille revérifie son affirmation, sans passer par le générateur.
function controlerFamille(c) {
  const p = [];
  const R = s => F.analyser(s, {});
  if (c.type === 'compare') {
    const r = F.cmp(R(c.a), R(c.b));
    const attendu = c.op === '<' ? -1 : 1;
    if (r !== attendu) p.push(`الترتيب المعلن ${c.op} خاطئ`);
  } else if (c.type === 'tri') {
    const trie = c.liste.map(R).sort(F.cmp).map(F.txt);
    if (trie.join(',') !== c.tri.join(',')) p.push('الترتيب التصاعدي خاطئ');
  } else if (c.type === 'intercaler') {
    const a = R(c.a), b = R(c.b);
    let prec = a;
    for (const m of c.milieux) {
      const v = R(m);
      if (F.cmp(prec, v) >= 0) p.push(`${m} ليس أكبر قطعا من السابق`);
      prec = v;
    }
    if (F.cmp(prec, b) >= 0) p.push('آخر عدد ليس أصغر قطعا من الحدّ الأعلى');
    if (new Set(c.milieux.map(m => F.txt(R(m)))).size !== c.milieux.length) {
      p.push('أعداد مكرّرة');
    }
  } else if (c.type === 'relation') {
    // On tire x et y vérifiant la relation, puis on recalcule l'expression.
    const k = R(c.k);
    for (let i = 0; i < 40; i++) {
      const x = F.ratAleatoire(20, 9);
      const y = F.div(F.sub(k, F.mul(F.rat(c.p), x)), F.rat(c.q));
      const A = F.add(F.add(F.mul(F.rat(c.m * c.p), x), F.mul(F.rat(c.m * c.q), y)), F.rat(c.c));
      if (!F.egaux(A, R(c.total))) { p.push('قيمة العبارة لا تطابق'); break; }
    }
  } else if (c.type === 'ensemble') {
    const bas = R(c.bas), haut = R(c.haut);
    const vrais = c.E.map(R).filter(x => F.cmp(bas, x) < 0 && F.cmp(x, haut) <= 0).map(F.txt);
    if (vrais.join(',') !== c.gardes.join(',')) p.push('قائمة العناصر المقبولة خاطئة');
  }
  return p;
}

if (process.env.CONTRE_EXEMPLES) {
  // On prouve que le garde-fou attrape bien ce qu'il doit attraper.
  const cas = [
    { nom: 'propriété de l\'ordre (9e)', brut: { etapes: [
      ['نقارن العددين المضافين', '1/2 < 2/3'],
      ['القاعدة', 'إضافة نفس العدد إلى طرفَي متفاوتة تحفظ الترتيب'],
      ['النتيجة', 'a + 1/2 < a + 2/3']] }, c: { type: 'litteral' } },
    { nom: 'addition membre à membre (9e)', brut: { etapes: [
      ['المعطى', 'x > y'],
      ['القاعدة', 'جمع متفاوتتين في نفس الاتجاه طرفا بطرف يحفظ الاتجاه'],
      ['النتيجة', 'x + 1 > y']] }, c: { type: 'litteral' } },
    { nom: 'signe de la différence (8e, correct)', brut: { etapes: [
      ['نحسب الفرق', '(a + 1/2) - (a + 2/3) = -1/6'],
      ['نحدّد إشارة الفرق', '-1/6 < 0'],
      ['النتيجة', 'a + 1/2 < a + 2/3']] }, c: { type: 'litteral' } }
  ];
  for (const k of cas) {
    const r = controlerMethode(k.brut, k.c);
    console.log((r.length ? '✗ rejeté  ' : '✓ accepté ') + k.nom + (r.length ? ' — ' + r[0] : ''));
  }
  process.exit(0);
}

for (let n = 1; n <= 13; n++) {
  let mauvais = 0;
  const vus = new Set();
  for (let t = 0; t < TIRAGES; t++) {
    for (const brut of F.tirer(n)) {
      instances++;
      vus.add(brut.enonce.join(' '));
      const probs = verifierBrut(n, brut);
      if (probs.length) {
        mauvais++;
        if (echecs.length < 12) {
          echecs.push(`ex${n}: ${brut.enonce.join(' ')}\n    - ` + probs.slice(0, 4).join('\n    - '));
        }
      }
    }
  }
  console.log(`ex${String(n).padStart(2)} — ${F.PROBLEMES[n].titre}`
    + `  ${mauvais ? '✗ ' + mauvais + ' échec(s)' : '✓'}  (${vus.size} énoncés distincts)`);
}

if (echecs.length) console.log('\n' + echecs.join('\n'));
console.log(`\n${instances} instances tirées, ${controles} contrôles`
  + ` dont ${echantillons} évaluations littérales échantillonnées,`
  + ` ${echecs.length ? 'ÉCHECS' : '0 erreur'}.`);
process.exit(echecs.length ? 1 : 0);
