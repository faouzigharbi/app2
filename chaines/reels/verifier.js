// Valide les trois exercices de la fiche « العمليات في مجموعة الأعداد الحقيقية ».
//   node verifier.js [tirages]   |   CONTRE_EXEMPLES=1 node verifier.js
//
// Le principe est celui de la fiche des expressions littérales : on ne LIT pas
// les générateurs, on les EXÉCUTE. Chaque étape de chaque chaîne est réanalysée
// et recalculée en arithmétique exacte sur les radicaux — « √32 - √8 = 2√2 »
// n'est pas admise sur sa mine, elle est vérifiée.
//
// Deux niveaux de contrôle, et le second est le plus important :
//
//   1. CHAQUE ÉTAPE de la chaîne doit être une relation vraie. Une étape fausse
//      est un mensonge qu'on demanderait à l'élève de ranger au bon endroit.
//
//   2. CHAQUE AFFIRMATION de l'énoncé (les « claims ») doit être vraie, y
//      compris quand elle porte sur des lettres : « a² - a(b + 1/b) + 1 = 0 »
//      n'est pas testée sur un a, elle est testée sur des dizaines de tirages.
//      Une identité qui ne tiendrait que pour la valeur choisie par le
//      générateur ne serait pas une identité.
const F = require('./noyau.js');
require('./reels.js');
require('./serie2.js');
require('./gens.js');

const TIRAGES = Number(process.argv[2]) || 120;
const ECHANTILLONS = 30;
let relations = 0, controles = 0, questions = 0;
const echecs = [];

// Un rationnel non nul quelconque — les lettres de l'exercice 17 sont libres,
// et « ab = 1 » n'interdit que le zéro.
function rnd() {
  let n = 0;
  while (n === 0) n = F.ent(-9, 9);
  return F.S(F.rat(n, F.ent(1, 6)));
}

// Les environnements dans lesquels CHAQUE étape doit se vérifier.
//   c.env     — des expressions nommées, évaluées dans l'ordre : le B du 18
//               est défini à partir de son écriture en radicaux, pas de sa
//               valeur réduite, sinon on vérifierait la réponse par la réponse.
//   c.libres  — des lettres tirées au hasard, et c.derives ce qu'on en déduit.
function environnements(c) {
  if (c.libres) {
    return Array.from({ length: ECHANTILLONS }, () => {
      const e = {};
      c.libres.forEach(v => { e[v] = rnd(); });
      for (const nom in (c.derives || {})) e[nom] = F.analyser(c.derives[nom], e);
      return e;
    });
  }
  const e = {};
  for (const nom in (c.env || {})) e[nom] = F.analyser(c.env[nom], e);
  return [e];
}

// Le contrôle des AFFIRMATIONS de l'énoncé, dans tous les environnements.
function controlerClaims(c, envs) {
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
  if (!(c.claims || []).length) p.push('بلا تأكيد يُراقَب');
  return p;
}

function verifierBrut(brut) {
  const probs = [];
  const c = brut.controle;
  const envs = environnements(c);
  let verifiees = 0;

  brut.etapes.forEach(([label, math], i) => {
    if (typeof math !== 'string' || F.ARABE.test(math)) return;
    let bon = 0, souci = null;
    for (const env of envs) {
      try {
        const r = F.verifierRelation(String(math).replace(/×/g, '*'), env);
        if (r === null) { souci = `« ${math} » ليست علاقة`; break; }
        if (r) { souci = souci || r; continue; }
        bon++; relations++;
      } catch (e) { souci = `تعذّر « ${math} » (${e.message})`; break; }
    }
    if (bon < envs.length) probs.push(`م${i + 1}: ${souci || 'لا تتحقّق'}`);
    verifiees++;
  });

  // L'énoncé lui-même passe par l'analyseur : une expression mal parenthésée y
  // serait aussi grave qu'une étape fausse, et personne ne la verrait. Et quand
  // l'énoncé POSE une égalité (« C = |A| - |B| », « a = √5(√2 + √5) - … »), on
  // ne se contente pas de la lire : on la vérifie, dans tous les environnements.
  for (const e of brut.enonce) {
    if (typeof e !== 'string' || F.ARABE.test(e)) continue;
    const src = e.replace(/×/g, '*');
    for (const env of envs) {
      try {
        const r = F.verifierRelation(src, env);
        if (r === null) F.analyser(src, env);        // simple expression
        else if (r) { probs.push(`نصّ الوضعية فاسد: ${r}`); break; }
        else { relations++; }
      } catch (err) {
        probs.push(`نصّ غير قابل للتحليل « ${e} » (${err.message})`);
        break;
      }
    }
  }

  if (verifiees < 2) probs.push('عدد المراحل القابلة للتحقق قليل جدا');
  probs.push(...controlerClaims(c, envs));
  const t = brut.etapes.map(e => e.join(': '));
  if (new Set(t).size !== t.length) probs.push('مراحل مكرّرة');
  if (t.length < 4) probs.push('السلسلة قصيرة جدا');
  if (!brut.indice) probs.push('بلا مساعدة');
  return probs;
}

// -------------------------------------------------------------------------
// Mode falsification : on abîme volontairement des exercices justes. Si le
// validateur les accepte, c'est lui qui est faux — pas eux.
// -------------------------------------------------------------------------
if (process.env.CONTRE_EXEMPLES) {
  const cas = [];
  const copie = q => JSON.parse(JSON.stringify(q));
  const pousse = (nom, q, f) => { const c = copie(q); f(c); cas.push([nom, c]); };
  // Une falsification doit MORDRE : viser une forme que le tirage ne produit
  // pas toujours obligerait à retirer jusqu'à tomber dessus.
  const parQuestion = (n, i) => F.tirer(n)[i];

  pousse('facteur commun du 11 amputé', parQuestion(11, 0),
    c => { c.controle.claims[0][1] = c.controle.claims[0][1].replace(/ \+ √\d+\)$/, ')'); });
  pousse('coefficient numérique du 11 faussé', parQuestion(11, 1),
    c => { c.controle.claims[0][1] = c.controle.claims[0][1].replace(/^\d+/, m => Number(m) + 1); });
  pousse('les trois coefficients du 11 mal sommés', parQuestion(11, 4),
    c => { c.etapes[2][1] = c.etapes[2][1].replace(/= \d+$/, m => '= ' + (Number(m.slice(2)) + 1)); });
  pousse('rationalisation du 12 à l’envers', parQuestion(12, 1),
    c => { c.etapes[0][1] = c.etapes[0][1].replace('= ', '= -'); });
  pousse('division du 12 décalée', parQuestion(12, 3),
    c => { c.controle.claims[0][1] += ' + 1'; });
  pousse('quotient d’un nombre par lui-même ≠ 1', parQuestion(12, 4),
    c => { c.controle.env.D = c.controle.env.D + ' + 1'; });
  pousse('valeur absolue du 13 levée avec le mauvais signe', parQuestion(13, 0),
    c => { c.etapes[1][1] = c.etapes[1][1].replace(/= (\d+) - (√\d+)/, '= $2 - $1'); });
  pousse('signe du produit du 13 inversé', parQuestion(13, 2),
    c => { c.controle.claims[0][1] = '-(' + c.controle.claims[0][1] + ')'; });
  pousse('conjugué du 13 mal utilisé', parQuestion(13, 3),
    c => { c.controle.claims[0][1] += ' + 1'; });
  pousse('racine du 13 hors de l’équation', parQuestion(13, 6),
    c => { c.controle.env.x = c.controle.env.x + ' + 1'; });
  pousse('factorisation du 14 fausse', parQuestion(14, 0),
    c => { c.controle.claims[0][1] = c.controle.claims[0][1].replace(/\)$/, ' + 1)'); });
  pousse('|A| du 14 gardé négatif', parQuestion(14, 2),
    c => { c.controle.claims[1][1] = '-(' + c.controle.claims[1][1] + ')'; });

  pousse('identité du 17 faussée', parQuestion(17, 0),
    c => { c.claims = undefined; c.controle.claims[0][1] = '1'; });
  pousse('somme n + 1/n décalée', parQuestion(17, 1),
    c => { c.controle.claims[0][1] = c.controle.claims[0][1].replace(/^\d+/, m => Number(m) + 1); });
  pousse('racine de l’équation décalée', parQuestion(17, 2),
    c => { c.controle.claims[1][1] = '1'; });
  pousse('étape fausse dans le 17', parQuestion(17, 3),
    c => { c.etapes[2][1] = c.etapes[2][1].replace(/= 0$/, '= 1'); });

  pousse('réduction de A faussée', parQuestion(18, 0),
    c => { c.controle.claims[0][1] += ' + 1'; });
  pousse('A et B ne sont plus inverses', parQuestion(18, 1),
    c => { c.controle.env.B = c.controle.env.B + ' + 1'; });
  pousse('valeur absolue mal levée', parQuestion(18, 2),
    c => { c.etapes[2][1] = c.etapes[2][1].replace('|A| - |B|', '|A| + |B|'); });
  pousse('développement de E amputé', parQuestion(18, 3),
    c => { c.controle.env.E = c.controle.env.E.replace(/ \+ 1\)/, ')'); });
  pousse('simplification finale décalée', parQuestion(18, 4),
    c => { c.controle.claims[2][1] += ' + 1'; });

  pousse('habillage de a faussé', parQuestion(19, 0),
    c => { c.controle.env.a = c.controle.env.a.replace(/- \(√2 \+ /, '- (√2 + 1 + '); });
  pousse('a et b ne sont plus inverses', parQuestion(19, 1),
    c => { c.controle.env.b = c.controle.env.b + ' + 1'; });
  pousse('opposés faussés', parQuestion(19, 2),
    c => { c.controle.claims[0][1] = '2'; });
  pousse('un radical de c oublié', parQuestion(19, 3),
    c => { c.controle.env.c = c.controle.env.c.replace(/^2/, '3'); });
  pousse('l’entier naturel n’en est plus un', parQuestion(19, 4),
    c => { c.controle.env.d = c.controle.env.d + ' + 1'; });
  pousse('étape dupliquée', parQuestion(18, 0),
    c => { c.etapes[2] = c.etapes[1].slice(); });

  let bon = 0;
  for (const [nom, q] of cas) {
    let probs;
    try { probs = verifierBrut(q); } catch (e) { probs = ['exception: ' + e.message]; }
    console.log((probs.length ? '✗ rejeté  ' : '⚠ ACCEPTÉ ') + nom
      + (probs.length ? ' — ' + probs[0].slice(0, 90) : ''));
    if (probs.length) bon++;
  }
  console.log(`\n${bon}/${cas.length} falsifications détectées.`);
  process.exit(bon === cas.length ? 0 : 1);
}

for (const n of Object.keys(F.PROBLEMES).map(Number).sort((a, b) => a - b)) {
  let mauvais = 0; const vus = new Set();
  const attendu = F.PROBLEMES[n].questions;
  for (let t = 0; t < TIRAGES; t++) {
    const lot = F.tirer(n);
    if (lot.length !== attendu) {
      echecs.push(`التمرين ${n}: ${lot.length} سؤالا بدل ${attendu}`);
      break;
    }
    for (const [i, brut] of lot.entries()) {
      questions++;
      vus.add(brut.enonce.join(' '));
      const probs = verifierBrut(brut);
      if (probs.length) {
        mauvais++;
        if (echecs.length < 10) {
          echecs.push(`التمرين ${n} س${i + 1}: ${brut.enonce.join(' ')}`
            + '\n    - ' + probs.join('\n    - '));
        }
      }
    }
  }
  console.log(`التمرين ${n} — ${F.PROBLEMES[n].titre}`.padEnd(52)
    + `${mauvais ? '✗ ' + mauvais + ' échec(s)' : '✓'}  (${attendu} أسئلة، ${vus.size} صيغة)`);
}
if (echecs.length) console.log('\n' + echecs.join('\n'));
console.log(`\n${TIRAGES} tirages par exercice, ${questions} questions,`
  + ` ${relations} relations recalculées et ${controles} contrôles,`
  + ` ${echecs.length ? 'ÉCHECS' : '0 erreur'}.`);
process.exit(echecs.length ? 1 : 0);
