// Valide les parties de la fiche « العمليات الأربعة في IR ».
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
require('./revision.js');
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
  // Deux étapes peuvent porter des libellés différents et LA MÊME relation :
  // « نحلّ : x = 3 » puis « النتيجة : x = 3 ». La comparaison ci-dessus, qui
  // porte sur « libellé: math », ne les voit pas ; l'élève, lui, ne peut pas
  // les départager, et l'ordre attendu devient arbitraire. On compare donc
  // aussi les mathématiques seules.
  const rel = brut.etapes.map(e => e[1])
    .filter(s => typeof s === 'string' && !F.ARABE.test(s))
    .map(s => s.replace(/\s+/g, ''));
  if (new Set(rel).size !== rel.length) probs.push('علاقة مكرّرة في مرحلتين');
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

  pousse("E du 1 decale", parQuestion(1, 2),
    c => { c.controle.claims[0][1] += " + 1"; });
  pousse("facteur commun de D oublie", parQuestion(1, 1),
    c => { c.controle.env.D = c.controle.env.D.replace(")/(", " + 1)/("); });
  pousse("C du 1 decale", parQuestion(1, 0),
    c => { c.controle.claims[0][1] += " + 1"; });
  pousse("E et D ne sont plus inverses", parQuestion(1, 3),
    c => { c.controle.env.E = c.controle.env.E + " + 1"; });
  pousse("deduction du 1 faussee", parQuestion(1, 4),
    c => { c.controle.claims[0][1] += " + 1"; });
  pousse("racine de l equation du 1 decalee", parQuestion(1, 5),
    c => { c.controle.env.x = c.controle.env.x + " + 1"; });
  pousse("L du 1 decale", parQuestion(1, 7),
    c => { c.controle.claims[0][1] += " + 1"; });
  pousse("reduction de K faussee", parQuestion(1, 6),
    c => { c.controle.claims[0][1] += " + 1"; });
  pousse("factorisation de T fausse", parQuestion(1, 9),
    c => { c.controle.claims[0][1] = c.controle.claims[0][1].replace(/\)$/, " + 1)"); });
  pousse("x du 1 hors de la condition", parQuestion(1, 10),
    c => { c.controle.env.x = c.controle.env.x + " + 1"; });

  pousse("simplification de z faussee", parQuestion(2, 0),
    c => { c.controle.claims[0][1] += " + 1"; });
  pousse("z et y ne sont plus inverses", parQuestion(2, 1),
    c => { c.controle.env.y = c.controle.env.y + " + 1"; });
  pousse("valeur absolue de pi mal levee", parQuestion(2, 3),
    c => { c.etapes[2][1] = c.etapes[2][1].replace("= 4 - π", "= π - 4"); });
  pousse("signe du produit t y inverse", parQuestion(2, 4),
    c => { c.controle.claims[0][1] = "-(" + c.controle.claims[0][1] + ")"; });

  pousse("developpement de E du 3 ampute", parQuestion(3, 0),
    c => { c.controle.claims[0][1] = c.controle.claims[0][1].replace(/ \+ \d+$/, ""); });
  pousse("valeur de E du 3 decalee", parQuestion(3, 1),
    c => { c.controle.env.x = c.controle.env.x + " + 1"; });
  pousse("factorisation de E du 3 fausse", parQuestion(3, 2),
    c => { c.controle.claims[0][0] = c.controle.claims[0][0].replace(/\)$/, " + 1)"); });
  pousse("factorisation de G fausse", parQuestion(3, 5),
    c => { c.controle.claims[0][1] = c.controle.claims[0][1].replace(/\)$/, " + 1)"); });
  pousse("x du 3 hors de la condition", parQuestion(3, 6),
    c => { c.controle.env.x = c.controle.env.x + " + 1"; });

  pousse("d du 4 decale", parQuestion(4, 3),
    c => { c.controle.claims[0][1] += " + 1"; });
  pousse("b du 4 non simplifie", parQuestion(4, 1),
    c => { c.controle.env.b = c.controle.env.b.replace("2√5", "3√5"); });
  pousse("valeur absolue du 4 mal levee", parQuestion(4, 4),
    c => { c.controle.claims[0][1] = "-(" + c.controle.claims[0][1] + ")"; });
  pousse("racine dans Q[√5] faussee", parQuestion(4, 5),
    c => { c.controle.claims[0][1] = "4"; });
  pousse("signe mal lu dans p", parQuestion(4, 6),
    c => { c.etapes[1][1] = c.etapes[1][1].replace("= 5 - √3", "= √3 - 5"); });
  pousse("z du 4 decale", parQuestion(4, 9),
    c => { c.controle.claims[0][1] += " + 1"; });
  pousse("conjugue du 4 mal applique", parQuestion(4, 8),
    c => { c.controle.env.y = c.controle.env.y.replace("4 - √15", "4 + √15"); });
  pousse("signe de b oublie dans X", parQuestion(4, 11),
    c => { c.controle.claims[0][1] = c.controle.claims[0][1].replace("- 10b", "+ 10b"); });

  pousse("facteur commun de A du 5 fausse", parQuestion(5, 0),
    c => { c.controle.claims[0][1] = c.controle.claims[0][1].replace(/\)$/, " + 1)"); });
  pousse("racine sortie a l envers dans B", parQuestion(5, 1),
    c => { c.controle.claims[0][1] = c.controle.claims[0][1].replace("- √2 + 1", "+ √2 + 1"); });
  pousse("signe du reste de C oublie", parQuestion(5, 2),
    c => { c.controle.derives.C = c.controle.derives.C.replace("- √5x + 1", "+ √5x + 1"); });

  pousse("racine du 6 decalee", parQuestion(6, 0),
    c => { c.controle.env.x = c.controle.env.x + " + 1"; });
  pousse("valeur absolue du 6 mal isolee", parQuestion(6, 1),
    c => { c.controle.env.x = c.controle.env.x + " + 1"; });
  pousse("racine carree du 6 mal levee", parQuestion(6, 3),
    c => { c.controle.claims[1][1] = "1/2"; });

  pousse("factorisation de A du 7 fausse", parQuestion(7, 0),
    c => { c.controle.claims[0][1] = c.controle.claims[0][1].replace("2x - 1", "2x + 1"); });
  pousse("valeur absolue de A gardee negative", parQuestion(7, 1),
    c => { c.controle.claims[1][1] = "-(" + c.controle.claims[1][1] + ")"; });
  pousse("racine de A = 0 decalee", parQuestion(7, 2),
    c => { c.controle.env.x = c.controle.env.x + " + 1"; });
  pousse("opposes du 7 fausses", parQuestion(7, 5),
    c => { c.controle.env.x = c.controle.env.x + " + 1"; });
  pousse("F du 7 decale", parQuestion(7, 6),
    c => { c.controle.claims[2][1] = "21"; });
  pousse("racine carree du carre mal levee", parQuestion(7, 7),
    c => { c.controle.env.x = c.controle.env.x + " + 1"; });
  pousse("exposant du 7 lu sous le radical", parQuestion(7, 8),
    c => { c.controle.claims[0][0] = "√((x + 1)^2) + 1"; c.controle.env.x = "-9"; });

  pousse("étape dupliquée", parQuestion(4, 0),
    c => { c.etapes[2] = c.etapes[1].slice(); });
  // Même relation sous deux libellés : indépartageable pour l'élève.
  pousse("relation répétée sous un autre libellé", parQuestion(4, 0),
    c => { c.etapes[2] = ['نعيد', c.etapes[1][1]]; });

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
