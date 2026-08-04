// Valide la fiche « حصر و مجال » — سلسلة تمارين مراجعة عدد 10.
//   node verifier.js [tirages]   |   CONTRE_EXEMPLES=1 node verifier.js
//
// Le principe est celui des autres dossiers : on ne LIT pas les générateurs, on
// les EXÉCUTE, et chaque étape est réanalysée puis recalculée en arithmétique
// exacte. Mais cette fiche pose deux objets que les autres n'avaient pas, et
// chacun demande son contrôle propre :
//
//   1. UN ENSEMBLE. « I ∩ J = [-1/2 ; 3/2] » n'est pas une égalité de nombres.
//      Les bornes sont comparées une à une, crochets compris — un « ] » pour
//      un « [ » est une faute, et c'est LA faute de cette leçon.
//
//   2. UN ENCADREMENT. « -7/2 ≤ A ≤ 1/10 » ne veut rien dire sur un x isolé :
//      on tire des dizaines de x DANS le domaine, bornes atteintes comprises,
//      et l'encadrement doit tenir sur tous.
//
// Et la définition de chaque ensemble est éprouvée à part : on balaie des
// rationnels des deux côtés de chaque frontière et l'on exige que « x vérifie
// la condition de la fiche » et « x est dans le majal annoncé » soient vraies
// exactement ensemble. C'est ce contrôle-là qui répond à la question de
// l'énoncé — « أكتب المجموعة في صورة مجال » — et non le tirage.
const F = require('./noyau.js');
require('./encadrement.js');
require('./gens.js');

const TIRAGES = Number(process.argv[2]) || 120;
const POINTS = 24;                       // x tirés dans le domaine, par question
let relations = 0, controles = 0, questions = 0;
const echecs = [];

// Un texte qui décrit un ensemble en compréhension : « {x ∈ ℝ ; x < 2} ». Ce
// n'est ni une expression ni une relation d'intervalles — c'est la DÉFINITION,
// et elle est contrôlée par `conditions`, pas par l'analyseur.
const enCompréhension = s => /[{}]/.test(String(s));
const enIntervalles = s => /[∩∪]/.test(String(s)) || /[[\]][^;]*;/.test(String(s));
// ℤ n'est pas un intervalle — c'est justement ce que la question fait
// découvrir : « E ∩ Z » est une liste finie, pas un majal. Ces textes-là sont
// contrôlés par `entiers`, qui énumère les entiers du majal.
const surLesEntiers = s => /(^|[^A-Za-z])Z([^A-Za-z]|$)|ℤ/.test(String(s));

function nomsDe(c) {
  const n = {};
  for (const k in (c.ens || {})) n[k] = F.intervalle(c.ens[k]);
  return n;
}

// Les environnements dans lesquels chaque étape doit se vérifier.
//   c.dans    — x pris DANS un ensemble (« I », « I ∩ J », ou un majal écrit) ;
//   c.env     — des expressions nommées, évaluées dans l'ordre ;
//   c.derives — ce qu'on déduit du x tiré.
function environnements(c) {
  const noms = nomsDe(c);
  if (c.dans) {
    // Deux lettres libres, deux domaines : on croise. Un encadrement de x y
    // n'atteint ses bornes qu'aux COINS du rectangle — les éprouver séparément
    // laisserait passer un produit mal borné. `pointsDe` met les bornes
    // atteintes en tête, les coins sont donc dans le lot.
    const lettres = Object.keys(c.dans);
    const par = lettres.length > 1 ? 6 : POINTS;
    const listes = lettres.map(n => F.pointsDe(F.ensemble(c.dans[n], noms), par));
    let envs = [{}];
    listes.forEach((liste, k) => {
      const suivant = [];
      for (const e of envs) for (const v of liste) suivant.push({ ...e, [lettres[k]]: v });
      envs = suivant;
    });
    for (const e of envs) {
      for (const d in (c.derives || {})) {
        e[d] = F.analyser(String(c.derives[d]).replace(/×/g, '*'), e);
      }
    }
    return envs;
  }
  const e = {};
  for (const nom in (c.env || {})) e[nom] = F.analyser(c.env[nom], e);
  return [e];
}

// Le contrôle des DÉFINITIONS : « I = {x ∈ ℝ ; -2 < x ≤ 3/2} » annonce le majal
// ]-2 ; 3/2]. On balaie donc des rationnels des deux côtés de chaque frontière
// et l'on exige l'équivalence, dans les deux sens. Un crochet retourné se voit
// exactement sur la borne — d'où les dénominateurs qui la retombent juste.
function controlerConditions(c, noms) {
  const p = [];
  for (const nom in (c.conditions || {})) {
    const I = noms[nom];
    if (!I) { p.push(`المجال ${nom} غير معرّف`); continue; }
    const cond = c.conditions[nom];
    for (let num = -40; num <= 40; num++) {
      for (const den of [1, 2, 3, 4, 6]) {
        const x = F.S(F.rat(num, den));
        let tient;
        try {
          tient = F.verifierRelation(cond, { x }) === '';
        } catch (err) {
          p.push(`تعذّر شرط ${nom} « ${cond} » (${err.message})`);
          return p;
        }
        controles++;
        if (tient !== F.dansI(x, I)) {
          p.push(`${nom}: العدد ${F.sTxt(x)} ${tient ? 'يحقّق الشرط و ليس في' : 'لا يحقّق الشرط و هو في'} ${F.iTxt(I)}`);
          return p;
        }
      }
    }
  }
  return p;
}

// Le contrôle d'une RÉSOLUTION. « حل في ℝ » appelle un ensemble de solutions,
// et l'annoncer ne suffit pas : on balaie une grille de rationnels et l'on
// exige que « la valeur vérifie l'équation » et « la valeur est dans
// l'ensemble annoncé » soient vraies exactement ensemble.
//
// L'ensemble annoncé se donne en deux morceaux, parce que les réponses de cette
// fiche en prennent deux formes : des MAJALS (« x ≤ 3/4 », et jusqu'à deux
// morceaux disjoints pour « |2x + 2| ≥ 5 ») et des VALEURS isolées (les racines
// d'une équation). Les valeurs annoncées sont en outre testées une à une —
// c'est le seul moyen d'attraper une racine irrationnelle, qu'aucune grille de
// rationnels ne rencontrerait.
function controlerResolutions(c) {
  const p = [];
  for (const r of (c.resolutions || [])) {
    const v = r.variable || 'x';
    const majals = (r.majals || []).map(m => F.intervalle(m));
    const valeurs = (r.valeurs || []).map(t => F.analyser(t, {}));
    const dedans = x => majals.some(I => F.dansI(x, I))
                     || valeurs.some(t => F.sEgaux(x, t));
    const essaie = x => {
      const env = { [v]: x };
      for (const d in (c.derives || {})) {
        env[d] = F.analyser(String(c.derives[d]).replace(/×/g, '*'), env);
      }
      return F.verifierRelation(String(r.cond).replace(/×/g, '*'), env) === '';
    };
    const grille = [];
    for (let num = -40; num <= 40; num++) {
      for (const den of [1, 2, 4, 5]) grille.push(F.S(F.rat(num, den)));
    }
    grille.push(...valeurs);
    for (const x of grille) {
      let tient;
      try { tient = essaie(x); }
      catch (err) { p.push(`تعذّر « ${r.cond} » (${err.message})`); break; }
      controles++;
      if (tient !== dedans(x)) {
        p.push(`« ${r.cond} »: العدد ${F.sTxt(x)} ${tient ? 'حلّ و ليس في مجموعة الحلول' : 'ليس حلاّ و هو في مجموعة الحلول'}`);
        break;
      }
    }
  }
  return p;
}

// Le contrôle des AFFIRMATIONS, dans tous les environnements.
function controlerClaims(c, envs, noms) {
  const p = [];
  for (const [gauche, droite] of (c.claims || [])) {
    for (const env of envs) {
      let g, d;
      try {
        g = F.analyser(String(gauche).replace(/×/g, '*'), env);
        d = F.analyser(String(droite).replace(/×/g, '*'), env);
      } catch (err) {
        p.push(`تعذّر « ${gauche} = ${droite} » (${err.message})`);
        break;
      }
      controles++;
      if (!F.sEgaux(g, d)) {
        p.push(`« ${gauche} » ≠ « ${droite} » (${F.sTxt(g)} و ${F.sTxt(d)})`);
        break;
      }
    }
  }
  // Les encadrements et les signes : une relation qui doit tenir PARTOUT.
  for (const r of (c.vrai || [])) {
    for (const env of envs) {
      let souci;
      try { souci = F.verifierRelation(r, env); }
      catch (err) { p.push(`تعذّر « ${r} » (${err.message})`); break; }
      controles++;
      if (souci === null) { p.push(`« ${r} » ليست علاقة`); break; }
      if (souci) {
        p.push(`« ${r} » لا تتحقّق عند x = ${F.sTxt(env.x)}`);
        break;
      }
    }
  }
  // Les égalités d'ensembles.
  for (const [gauche, droite] of (c.egaux || [])) {
    let souci;
    try { souci = F.verifierEnsemble(gauche + ' = ' + droite, noms); }
    catch (err) { p.push(`تعذّر « ${gauche} = ${droite} » (${err.message})`); continue; }
    controles++;
    if (souci === null) p.push(`« ${gauche} = ${droite} » ليست علاقة مجالات`);
    else if (souci) p.push(souci);
  }
  // Les entiers d'un majal : « E ∩ Z = {-2 ; -1 ; 0 ; 1} » n'est pas un
  // intervalle, et c'est justement la question. On énumère donc les entiers du
  // majal et l'on compare à la liste annoncée — les deux bornes comprises,
  // puisque tout le piège est là.
  for (const e of (c.entiers || [])) {
    const majals = e.majals ? e.majals.map(m => F.intervalle(m)) : [noms[e.dans]];
    if (majals.some(I => !I)) { p.push(`المجال ${e.dans} غير معرّف`); continue; }
    // Quand la réponse est infinie — « tous les entiers strictement négatifs »
    // — on annonce une FENÊTRE et la liste des entiers qu'elle contient. La
    // fenêtre fait partie de l'affirmation ; elle n'est pas une commodité.
    const [a, b] = e.fenetre || [-60, 60];
    const trouves = [];
    for (let k = a; k <= b; k++) {
      if (majals.some(I => F.dansI(F.S(F.rat(k)), I))) trouves.push(k);
    }
    controles++;
    if (trouves.join(',') !== e.liste.join(',')) {
      p.push(`أعداد صحيحة: {${trouves.join(' ; ')}} و ليس {${e.liste.join(' ; ')}}`);
    }
  }
  if (!(c.claims || []).length && !(c.vrai || []).length && !(c.entiers || []).length
      && !(c.egaux || []).length && !(c.resolutions || []).length
      && !(c.conditions || {}).I) {
    p.push('بلا تأكيد يُراقَب');
  }
  return p;
}

// Une étape ou une ligne d'énoncé : relation d'ensembles, ou relation de
// nombres dans chaque environnement. Rend le grief, ou '' si tout tient, ou
// null si le texte n'est pas contrôlable ici.
function controlerTexte(math, envs, noms) {
  if (typeof math !== 'string' || F.ARABE.test(math)) return null;
  if (enCompréhension(math)) return null;              // vu par `conditions`
  if (surLesEntiers(math)) return null;                // vu par `entiers`
  // « x ∈ I » : une APPARTENANCE. L'énoncé la pose, et le tirage doit s'y
  // plier — c'est ce qui garantit que les x sur lesquels les encadrements sont
  // éprouvés sont bien ceux dont l'exercice parle.
  if (/∈/.test(math)) {
    const [g, d] = String(math).split('∈');
    const I = F.ensemble(d, noms);
    for (const env of envs) {
      const v = F.analyser(g.replace(/×/g, '*'), env);
      controles++;
      if (!F.dansI(v, I)) return `« ${F.sTxt(v)} ∈ ${F.iTxt(I)} » فاسدة`;
    }
    return '';
  }
  if (enIntervalles(math)) {
    const r = F.verifierEnsemble(math, noms);
    if (r !== null) { relations++; return r; }
    F.ensemble(math, noms);                            // au moins, elle se lit
    relations++;
    return '';
  }
  for (const env of envs) {
    const r = F.verifierRelation(String(math).replace(/×/g, '*'), env);
    if (r === null) { F.analyser(String(math).replace(/×/g, '*'), env); return ''; }
    if (r) return r + (env.x ? ` (عند x = ${F.sTxt(env.x)})` : '');
    relations++;
  }
  return '';
}

function verifierBrut(brut) {
  const probs = [];
  const c = brut.controle;
  const noms = nomsDe(c);
  const envs = environnements(c);
  let verifiees = 0;

  brut.etapes.forEach(([label, math], i) => {
    let r;
    try { r = controlerTexte(math, envs, noms); }
    catch (e) { probs.push(`م${i + 1}: تعذّر « ${math} » (${e.message})`); return; }
    if (r === null) return;
    verifiees++;
    if (r) probs.push(`م${i + 1}: ${r}`);
  });

  for (const e of brut.enonce) {
    try {
      const r = controlerTexte(e, envs, noms);
      if (r) probs.push(`نصّ الوضعية فاسد: ${r}`);
    } catch (err) {
      probs.push(`نصّ غير قابل للتحليل « ${e} » (${err.message})`);
    }
  }

  if (verifiees < 2) probs.push('عدد المراحل القابلة للتحقق قليل جدا');
  probs.push(...controlerConditions(c, noms));
  probs.push(...controlerResolutions(c));
  probs.push(...controlerClaims(c, envs, noms));
  const t = brut.etapes.map(e => e.join(': '));
  if (new Set(t).size !== t.length) probs.push('مراحل مكرّرة');
  // Deux étapes peuvent porter des libellés différents et LA MÊME relation :
  // l'élève n'a alors aucun moyen de les départager, et l'ordre attendu
  // devient arbitraire. On compare donc aussi les mathématiques seules.
  const rel = brut.etapes.map(e => e[1])
    .filter(s => typeof s === 'string' && !F.ARABE.test(s))
    .map(s => s.replace(/\s+/g, ''));
  if (new Set(rel).size !== rel.length) probs.push('علاقة مكرّرة في مرحلتين');
  if (t.length < 4) probs.push('السلسلة قصيرة جدا');
  if (!brut.indice) probs.push('بلا مساعدة');
  return probs;
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
          const c = F.tirer(n)[qi].controle;
          const envs = F.environnements(c, F.ECHANTILLON);
          const noms = F.nomsDe(c);
          const rangs = q.fautes.map(f => f.rang);
          if (!q.fautes.length || q.fautes.length > niveau) {
            griefs.push(`التمرين ${n} س${qi + 1}: ${q.fautes.length} أخطاء بدل ${niveau}`);
            mauvais++;
          }
          q.etapes.forEach(([, math], i) => {
            const j = F.evaluerEtape(math, envs, noms);
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
              const j = F.evaluerEtape(opt, envs, noms);
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

// -------------------------------------------------------------------------
// Mode falsification : on abîme volontairement des exercices justes. Si le
// validateur les accepte, c'est lui qui est faux — pas eux.
// -------------------------------------------------------------------------
if (process.env.CONTRE_EXEMPLES) {
  const cas = [];
  const copie = q => JSON.parse(JSON.stringify(q));
  const pousse = (nom, q, f) => { const c = copie(q); f(c); cas.push([nom, c]); };
  const parQuestion = (n, i) => F.tirer(n)[i];

  // Le crochet retourné : la faute propre à cette leçon, et celle qu'aucun
  // contrôle numérique ne verrait.
  pousse("crochet du 1 retourné", parQuestion(1, 0),
    c => { c.controle.ens.J = c.controle.ens.J.replace("[-1/2", "]-1/2"); });
  pousse("borne du 1 décalée", parQuestion(1, 0),
    c => { c.controle.ens.I = c.controle.ens.I.replace("3/2]", "5/2]"); });
  pousse("intersection du 1 fausse", parQuestion(1, 1),
    c => { c.controle.egaux[0][1] = "[-1/2 ; 3["; });
  pousse("réunion du 1 fausse", parQuestion(1, 1),
    c => { c.controle.egaux[1][1] = "]-2 ; 3]"; });
  pousse("signe de x + 1 inversé", parQuestion(1, 2),
    c => { c.controle.vrai[0] = "x + 1 < 0"; });
  pousse("forme réduite de A fausse", parQuestion(1, 3),
    c => { c.controle.claims[0][1] = "x - 1 + 1/(x + 1)"; });
  pousse("encadrement de A resserré", parQuestion(1, 4),
    c => { c.controle.vrai[0] = "-7/2 ≤ A ≤ 0"; });

  pousse("valeur absolue du 2 mal levée", parQuestion(2, 0),
    c => { c.controle.conditions.I = "|x - 2| ≤ 2"; });
  pousse("intersection du 2 fermée à tort", parQuestion(2, 1),
    c => { c.controle.egaux[0][1] = "[1 ; 2]"; });
  pousse("réunion du 2 bornée à gauche", parQuestion(2, 1),
    c => { c.controle.egaux[1][1] = "[1 ; 3]"; });
  pousse("ordre non renversé dans A", parQuestion(2, 2),
    c => { c.controle.vrai[0] = "-4 ≤ A ≤ -14"; });
  pousse("inverse du 2 non renversé", parQuestion(2, 3),
    c => { c.etapes[2][1] = "1 ≤ 1/(2x - 1) ≤ 1/5"; });
  pousse("carré du 2 mal encadré", parQuestion(2, 4),
    c => { c.etapes[2][1] = "1/9 ≤ (10/3 - x)^2 ≤ 4/9"; });

  pousse("division par -4 sans renversement", parQuestion(3, 0),
    c => { c.etapes[1][1] = "|x| > 2"; });
  pousse("majal J du 3 fermé à droite", parQuestion(3, 0),
    c => { c.controle.ens.J = "]-∞ ; 1/2["; });
  pousse("intersection du 3 fausse", parQuestion(3, 1),
    c => { c.controle.egaux[0][1] = "]-2 ; 2["; });
  pousse("signe de 5 - 2x inversé", parQuestion(3, 2),
    c => { c.controle.vrai[0] = "5 - 2x < 0"; });
  pousse("mise au même dénominateur fausse", parQuestion(3, 3),
    c => { c.controle.claims[0][1] = "1/4 x^2 + 7/(2(5 - 2x)) + 1/2"; });
  pousse("encadrement du 3 trop étroit", parQuestion(3, 4),
    c => { c.controle.vrai[0] = "-1/9 < A < 1"; });
  // La règle : on ne multiplie jamais les termes d'un encadrement par une
  // variable. On rend les deux encadrements positifs, on les multiplie entre
  // eux, puis on revient. Une multiplication par y ferait ici passer une borne.
  pousse("produit des encadrements faussé", parQuestion(10, 0),
    c => { c.etapes[3][1] = "4 ≤ (-x) y ≤ 9"; });
  pousse("encadrement de xy resserré", parQuestion(10, 0),
    c => { c.controle.vrai[0] = "-12 ≤ x y ≤ -6"; });
  pousse("ordre gardé au lieu d'être renversé", parQuestion(10, 1),
    c => { c.etapes[3][1] = "-4 ≤ -2y ≤ -8"; });
  pousse("inverse du quotient non renversé", parQuestion(10, 2),
    c => { c.etapes[1][1] = "1/2 ≤ 1/y ≤ 1/4"; });
  pousse("valeur absolue de 3x - 2y gardée", parQuestion(10, 3),
    c => { c.etapes[1][1] = "|3x - 2y| = 3x - 2y"; });
  pousse("signe de A perdu", parQuestion(10, 3),
    c => { c.controle.claims[0][1] = "3x^2"; });
  pousse("majal H fermé à tort", parQuestion(10, 4),
    c => { c.controle.ens.H = "[-√17 ; √17]"; });
  pousse("borne ouverte comptée parmi les entiers", parQuestion(10, 5),
    c => { c.controle.entiers[0].liste = [-2, -1, 0, 1, 2]; });
  pousse("réunion avec IR+ bornée à droite", parQuestion(10, 6),
    c => { c.controle.egaux[0][1] = "]-√17 ; √17["; });
  pousse("intersection E ∩ F fermée à droite", parQuestion(10, 7),
    c => { c.controle.egaux[0][1] = "[-2 ; 2]"; });
  pousse("carré mal encadré au bord", parQuestion(10, 8),
    c => { c.etapes[1][1] = "0 ≤ x^2 ≤ 3"; });

  pousse("développement de E faussé", parQuestion(11, 0),
    c => { c.controle.claims[0][1] = "4x^2 + 8x + 5"; });
  pousse("factorisation de E faussée", parQuestion(11, 1),
    c => { c.controle.claims[0][1] = "(2x - 1)(2x + 3)"; });
  pousse("racine de l'équation du 11 oubliée", parQuestion(11, 2),
    c => { c.controle.resolutions[0].valeurs = ["1/2"]; });
  pousse("borne de la métrajiha décalée", parQuestion(11, 3),
    c => { c.controle.resolutions[0].majals = ["]-∞ ; 1]"]; });
  pousse("ordre non renversé par la division", parQuestion(11, 4),
    c => { c.etapes[1][1] = "|x - 3| ≥ 2"; });
  pousse("racine de trop dans l'équation aux valeurs absolues", parQuestion(11, 5),
    c => { c.controle.resolutions[0].valeurs = ["2", "-1", "-3", "3"]; });
  pousse("un seul morceau de solutions retenu", parQuestion(11, 6),
    c => { c.controle.resolutions[0].majals = ["[3/2 ; +∞["]; });

  pousse("racine irrationnelle du 12 décalée", parQuestion(12, 0),
    c => { c.controle.resolutions[0].valeurs = ["2√2 + 1"]; });
  pousse("facteur commun du 12 amputé", parQuestion(12, 1),
    c => { c.etapes[0][1] = "2x^2 - 8 = 2(x - 2)(x + 1)"; });
  pousse("multiplication par -1 sans renversement", parQuestion(12, 2),
    c => { c.etapes[2][1] = "1 < x < -2"; });
  pousse("signe de x - 3 inversé", parQuestion(12, 3),
    c => { c.controle.vrai[0] = "x - 3 > 0"; });
  pousse("partage du quotient B faux", parQuestion(12, 4),
    c => { c.controle.claims[0][1] = "1 - 3/(x - 3)"; });
  pousse("encadrement de B resserré", parQuestion(12, 5),
    c => { c.controle.vrai[0] = "-1/2 < B < 0"; });

  pousse("solutions de l'identité réduites à un point", parQuestion(13, 0),
    c => { c.controle.resolutions[0].majals = ["[0 ; 0]"]; });
  pousse("racine du 13 décalée", parQuestion(13, 1),
    c => { c.controle.resolutions[0].valeurs = ["1", "3"]; });
  pousse("signe de x + 1 inversé au 13", parQuestion(13, 2),
    c => { c.controle.vrai[0] = "x + 1 > 0"; });
  pousse("inverse du 13 non renversé", parQuestion(13, 3),
    c => { c.etapes[1][1] = "-1/2 ≤ 1/(x + 1) ≤ -1"; });
  pousse("réduction de A - 2 fausse", parQuestion(13, 4),
    c => { c.controle.claims[0][1] = "3/(x - 1)"; });
  pousse("encadrement de A décalé", parQuestion(13, 5),
    c => { c.controle.vrai[0] = "-1 ≤ A ≤ 0"; });

  pousse("valeur de A en √2 + 1 décalée", parQuestion(15, 0),
    c => { c.controle.claims[0][1] = "5/2 - √2"; });
  pousse("comparaison de A et 4 inversée", parQuestion(15, 1),
    c => { c.controle.vrai[0] = "A > 4"; });
  pousse("forme canonique fausse", parQuestion(15, 2),
    c => { c.controle.claims[0][1] = "(x - 1/2)^2 + 1/2"; });
  pousse("racine de A = 5/2 oubliée", parQuestion(15, 3),
    c => { c.controle.resolutions[0].valeurs = ["2"]; });
  pousse("borne atteinte prise pour ouverte", parQuestion(15, 4),
    c => { c.controle.vrai[0] = "1/4 < A < 1/2"; });
  pousse("encadrement de B décalé", parQuestion(15, 5),
    c => { c.controle.vrai[0] = "-3 < B < -2"; });
  pousse("produit des encadrements du 15 faussé", parQuestion(15, 6),
    c => { c.etapes[3][1] = "1/4 < A × (-B) < 1"; });

  pousse("majal J du 16 mal fermé", parQuestion(16, 0),
    c => { c.controle.ens.J = "[-5/3 ; -1/3]"; });
  pousse("intersection du 16 fausse", parQuestion(16, 1),
    c => { c.controle.egaux[0][1] = "]-5/3 ; -1/3["; });
  pousse("0 compté parmi les entiers de I", parQuestion(16, 2),
    c => { c.controle.entiers[0].liste = [-6, -5, -4, -3, -2, -1, 0]; });
  pousse("encadrement de 2√2 mal renversé", parQuestion(16, 3),
    c => { c.etapes[2][1] = "-2√2/3 < -1"; });

  pousse("domaine du 17 décalé", parQuestion(17, 0),
    c => { c.controle.vrai[0] = "|3x - 1| ≤ 1/3"; });
  pousse("encadrement de E décalé", parQuestion(17, 1),
    c => { c.controle.vrai[0] = "1/3 ≤ E ≤ 1 - √2"; });
  pousse("signe de 2x^2 - x√2 inversé", parQuestion(17, 2),
    c => { c.controle.vrai[0] = "2x^2 - x√2 > 0"; });
  pousse("racine de trop dans l'équation du 17", parQuestion(17, 3),
    c => { c.controle.resolutions[0].valeurs = ["√2/2", "1", "-1", "2"]; });
  pousse("forme F = E^2 + 5 faussée", parQuestion(17, 4),
    c => { c.controle.claims[0][1] = "E^2 + 7"; });
  pousse("valeur de F en √3 décalée", parQuestion(17, 5),
    c => { c.controle.claims[0][1] = "19 + 4√6"; });
  pousse("radical imbriqué mal extrait", parQuestion(17, 6),
    c => { c.controle.claims[0][1] = "2√3 + √2"; });
  pousse("racine de F = 9 décalée", parQuestion(17, 7),
    c => { c.controle.resolutions[0].valeurs = ["(2 + √2)/2", "(√2 - 1)/2"]; });
  pousse("factorisation de F - 9 faussée", parQuestion(17, 7),
    c => { c.controle.claims[1][1] = "(E - 2)(E + 4)"; });
  pousse("un morceau des solutions du 17 oublié", parQuestion(17, 8),
    c => { c.controle.resolutions[0].majals = ["]√2 ; +∞["]; });
  pousse("entiers du 17 mal comptés", parQuestion(17, 8),
    c => { c.controle.entiers[0].liste = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]; });

  pousse("division par -2 sans renversement", parQuestion(18, 0),
    c => { c.etapes[1][1] = "-1/2 ≤ x ≤ -3/2"; });
  pousse("somme des encadrements décalée", parQuestion(18, 1),
    c => { c.controle.vrai[0] = "7/2 ≤ y - x ≤ 11/2"; });
  pousse("quotient x/y mal renversé", parQuestion(18, 2),
    c => { c.controle.vrai[0] = "-1/10 ≤ x/y ≤ -1/2"; });
  pousse("signe de 2y - 11 inversé", parQuestion(18, 3),
    c => { c.controle.vrai[0] = "2y - 11 ≥ -1"; });
  pousse("carré du 18 mal encadré", parQuestion(18, 4),
    c => { c.controle.vrai[0] = "1 ≤ 4y^2 - 44y + 121 ≤ 16"; });
  pousse("valeur absolue de E mal levée", parQuestion(18, 5),
    c => { c.etapes[4][1] = "|2y - 11|/(2y - 11) = 1"; });

  pousse("division par -3 sans renversement", parQuestion(19, 0),
    c => { c.etapes[1][1] = "-2 ≥ x ≥ 2"; });
  pousse("encadrement de 4 - x décalé", parQuestion(19, 1),
    c => { c.controle.vrai[0] = "2 ≤ 4 - x ≤ 5"; });
  pousse("encadrement de 2x - 5 décalé", parQuestion(19, 2),
    c => { c.controle.vrai[0] = "-9 ≤ 2x - 5 ≤ -2"; });
  pousse("facteur commun de E du 19 faux", parQuestion(19, 3),
    c => { c.controle.claims[0][1] = "(4 - x)(2x - 4)"; });
  pousse("produit des encadrements du 19 faussé", parQuestion(19, 4),
    c => { c.controle.vrai[0] = "-54 ≤ E ≤ -3"; });

  pousse("valeur de A en 2 décalée", parQuestion(20, 0),
    c => { c.controle.claims[0][1] = "1"; });
  pousse("début de carré faux", parQuestion(20, 1),
    c => { c.controle.claims[0][1] = "(x - 4)^2 - 8"; });
  pousse("factorisation de A du 20 fausse", parQuestion(20, 2),
    c => { c.controle.claims[0][1] = "(x - 2)(x - 4)"; });
  pousse("racine de A = 0 oubliée", parQuestion(20, 3),
    c => { c.controle.resolutions[0].valeurs = ["2"]; });
  pousse("borne du domaine géométrique décalée", parQuestion(20, 4),
    c => { c.controle.vrai[0] = "0 < x < 2"; });
  pousse("longueur AM fausse", parQuestion(20, 5),
    c => { c.controle.claims[0][1] = "6 - x"; });
  pousse("différence des aires faussée", parQuestion(20, 6),
    c => { c.controle.claims[0][1] = "3(x^2 - 8x + 6)"; });
  pousse("aire du triangle doublée", parQuestion(20, 6),
    c => { c.controle.derives.S1 = "2x × x"; });
  pousse("solution géométrique hors domaine gardée", parQuestion(20, 7),
    c => { c.controle.resolutions[0].valeurs = ["2"]; });
  pousse("intersection avec le domaine oubliée", parQuestion(20, 8),
    c => { c.controle.egaux[0][1] = "[3/2 ; +∞["; });

  pousse("étape dupliquée", parQuestion(1, 4),
    c => { c.etapes[2] = c.etapes[1].slice(); });
  pousse("relation répétée sous un autre libellé", parQuestion(1, 4),
    c => { c.etapes[2] = ['نعيد', c.etapes[1][1]]; });

  let bon = 0;
  for (const [nom, q] of cas) {
    let probs;
    try { probs = verifierBrut(q); }
    catch (e) { probs = ['استثناء: ' + e.message]; }
    if (probs.length) { bon++; console.log(`✗ rejeté  ${nom} — ${probs[0]}`); }
    else console.log(`⚠ ACCEPTÉ  ${nom} — le validateur est trop faible`);
  }
  console.log(`\n${bon}/${cas.length} falsifications détectées.`);
  process.exit(bon === cas.length ? 0 : 1);
}

// -------------------------------------------------------------------------
for (const n of Object.keys(F.PROBLEMES).map(Number).sort((a, b) => a - b)) {
  const def = F.PROBLEMES[n];
  const vus = new Set();
  let echecsIci = 0;
  for (let t = 0; t < TIRAGES; t++) {
    const qs = F.tirer(n);
    if (qs.length !== def.questions) {
      echecs.push(`التمرين ${n}: ${qs.length} أسئلة بدل ${def.questions}`);
      echecsIci++;
    }
    qs.forEach(q => {
      questions++;
      vus.add(q.enonce.join(' '));
      let probs;
      try { probs = verifierBrut(q); }
      catch (e) { probs = ['استثناء: ' + e.message]; }
      if (probs.length) {
        echecsIci++;
        if (echecs.length < 40) {
          echecs.push(`التمرين ${n} س${qs.indexOf(q) + 1}: ${q.enonce.join(' ')}\n    - `
                      + probs.join('\n    - '));
        }
      }
    });
  }
  const titre = `التمرين ${n} — ${def.titre}`;
  const etat = echecsIci ? `✗ ${echecsIci} échec(s)` : '✓ ';
  console.log(`${titre.padEnd(52)}${etat}  (${def.questions} أسئلة، ${vus.size} صيغة)`);
}

if (echecs.length) {
  console.log('\n' + echecs.join('\n'));
  console.log(`\n${TIRAGES} tirages par exercice, ${questions} questions, `
              + `${relations} relations recalculées et ${controles} contrôles, ÉCHECS.`);
  process.exit(1);
}
console.log(`\n${TIRAGES} tirages par exercice, ${questions} questions, `
            + `${relations} relations recalculées et ${controles} contrôles, 0 erreur.`);
