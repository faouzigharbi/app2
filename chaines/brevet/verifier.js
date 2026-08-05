// Valide les exercices du livre de révision (البريفي).
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
const R = require('./repere.js');
require('./seances.js');
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
//   c.points  — une FIGURE, construite point par point : chaque point posé ou
//               calculé, jamais recopié. Les noms disponibles aux étapes en
//               sortent tout seuls — xA, yA pour les coordonnées, AB pour les
//               longueurs, dans les deux ordres. Une étape qui écrirait
//               « GN = 2√5 » est donc recalculée sur la figure, pas crue.
function environnements(c) {
  if (c.points) {
    const P = R.figure(c.points, {});
    const e = R.nommer(P);
    for (const nom in (c.env || {})) e[nom] = F.analyser(c.env[nom], e);
    e.__points = P;
    return [e];
  }
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
  if (!(c.claims || []).length && !(c.faits || []).length) p.push('بلا تأكيد يُراقَب');
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
  // LES FAITS DE LA FIGURE — « OABJ est un rectangle », « E est le milieu de
  // [GM] », « N et P sont confondues » : recalculés sur les seules coordonnées.
  // C'est ici que l'énoncé d'un exercice de repère se fait contredire.
  if (c.points) {
    const P = envs[0].__points;
    if (!(c.faits || []).length) probs.push('شكل بلا واقعة تُراقَب');
    const p = R.verifierFaits(c.faits, P, envs[0]);
    controles += (c.faits || []).length;
    probs.push(...p);
  }
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
//
// Une falsification qui refuse de mordre est le signal, pas le succès : on vise
// donc CE QUI PORTE l'exercice — le facteur qui simplifie, le 49/4 qui fait le
// carré, le 6 de la relation métrique — et non des détails d'écriture.
// -------------------------------------------------------------------------
if (process.env.CONTRE_EXEMPLES) {
  const cas = [];
  const copie = q => JSON.parse(JSON.stringify(q));
  const pousse = (nom, q, f) => { const c = copie(q); f(c); cas.push([nom, c]); };
  const parQuestion = (n, i) => F.tirer(n)[i];

  // ── التمرين 1 ──────────────────────────────────────────────────────────
  pousse("le levier (2√3 - 1) redevient le (3√3 - 1) du livre", parQuestion(21, 0),
    c => { c.controle.claims[0][0] = "(3√3 - 1)(4 - 5√3)"; });
  pousse("a decale d une unite", parQuestion(21, 1),
    c => { c.controle.claims[0][1] = "2√3 - 2"; });
  pousse("le 2 final de a oublie", parQuestion(21, 1),
    c => { c.controle.env.a = c.controle.env.a.replace(" - 2", ""); });
  pousse("le denominateur de b mal rationalise", parQuestion(21, 2),
    c => { c.controle.claims[0][1] = "(2√3 + 3)/2"; });
  pousse("1/√3 lu comme √3", parQuestion(21, 2),
    c => { c.controle.env.b = c.controle.env.b.replace("3 + 1/√3", "3 + √3"); });
  pousse("√108 sorti en 5√3", parQuestion(21, 3),
    c => { c.etapes[1][1] = "√108 = √36 × √3 = 5√3"; });
  pousse("c decale", parQuestion(21, 3),
    c => { c.controle.claims[0][1] = "1 + √3/3"; });
  pousse("a et b ne sont plus inverses", parQuestion(21, 4),
    c => { c.controle.env.b = c.controle.env.b + " + 1"; });
  pousse("le 3 du denominateur de b oublie dans le produit", parQuestion(21, 4),
    c => { c.etapes[1][1] = "a × b = (2√3 - 3)(2√3 + 3)"; });
  pousse("2a × c decale", parQuestion(21, 5),
    c => { c.controle.claims[0][1] = "2√3"; });
  pousse("le 2 de 2a oublie", parQuestion(21, 5),
    c => { c.controle.claims[0][0] = "a × c"; });
  pousse("la deduction finale faussee", parQuestion(21, 6),
    c => { c.controle.claims[0][1] = "√3 + 3/2"; });
  pousse("c/b lu comme c × b", parQuestion(21, 6),
    c => { c.etapes[2][1] = "c/b = c × b"; });

  // ── التمرين 2 ──────────────────────────────────────────────────────────
  pousse("A en √2 - 1 decale", parQuestion(22, 0),
    c => { c.controle.claims[0][1] = "-8 + 3√2"; });
  pousse("le double produit du carre oublie", parQuestion(22, 0),
    c => { c.etapes[2][1] = "(√2 - 1)^2 = 2 + 1 = 3"; });
  pousse("49/4 remplace par 47/4 : le carre ne se ferme plus", parQuestion(22, 1),
    c => { c.controle.claims[0][0] = "A + 47/4"; });
  pousse("le carre ecrit avec le mauvais signe", parQuestion(22, 1),
    c => { c.controle.claims[0][1] = "(x + 1/2)^2"; });
  pousse("factorisation de A avec les racines echangees", parQuestion(22, 2),
    c => { c.controle.claims[0][1] = "(x + 4)(x - 3)"; });
  pousse("un facteur decale d une unite", parQuestion(22, 2),
    c => { c.controle.claims[0][1] = "(x - 4)(x + 4)"; });
  pousse("racine de la premiere equation decalee", parQuestion(22, 3),
    c => { c.controle.env.x = "5"; });
  pousse("la seconde racine mal verifiee", parQuestion(22, 3),
    c => { c.controle.claims[1][0] = "(-4)((-4) + 5)"; });
  pousse("le second membre 4(x + 3) redevient le 4(x + 7) du livre", parQuestion(22, 4),
    c => { c.controle.claims[0][1] = "4(x + 7)"; });
  pousse("facteur commun mal sorti", parQuestion(22, 4),
    c => { c.etapes[3][1] = "(x - 4)(x + 3) - 4(x + 3) = (x + 3)(x - 4)"; });
  pousse("borne de l inequation decalee", parQuestion(22, 5),
    c => { c.controle.claims[0][1] = "25/2 - x"; });
  pousse("egalite au bord fausse", parQuestion(22, 5),
    c => { c.controle.claims[1][0] = "24^2 - 24 - 12"; });
  pousse("AH = √7, le nombre du livre", parQuestion(22, 6),
    c => { c.controle.env.AH = "√7"; });
  pousse("AH = 5, le nombre de la figure", parQuestion(22, 6),
    c => { c.controle.env.AH = "5"; });
  pousse("CH repete en x - 3 comme dans le livre", parQuestion(22, 6),
    c => { c.controle.env.CH = "x - 3"; });
  pousse("relation metrique lue comme une somme", parQuestion(22, 6),
    c => { c.controle.claims[0][1] = "AH^2 + 1"; });
  pousse("aire calculee sans le demi", parQuestion(22, 7),
    c => { c.controle.claims[0][1] = "√6"; });
  pousse("base prise egale a CH", parQuestion(22, 7),
    c => { c.controle.claims[1][1] = "6"; });

  // ── التمرين 3 — LA FIGURE ──────────────────────────────────────────────
  //
  // Ici on n'abîme pas une étape : on DÉPLACE UN POINT. C'est la seule
  // falsification qui compte pour un exercice de repère — si la figure peut
  // bouger sans que rien ne proteste, alors rien n'était vérifié.
  pousse("B decale : OABJ n est plus un rectangle", parQuestion(23, 0),
    c => { c.controle.points.B = ['point', '3', '1']; });
  pousse("E pris comme symetrique de B par rapport a A", parQuestion(23, 1),
    c => { c.controle.points.E = ['sym', 'B', 'A']; });
  pousse("EA annonce 3", parQuestion(23, 1),
    c => { c.controle.faits[3][3] = '3'; });
  pousse("le triangle JEA declare isocele en A", parQuestion(23, 2),
    c => { c.controle.faits[0] = ['isocele', 'A', 'J', 'E']; });
  pousse("F pris sur la direction (AI) au lieu de (AJ)", parQuestion(23, 4),
    c => { c.controle.points.D = ['translate', 'O', 'A', 'I']; });
  pousse("G construit dans le mauvais sens", parQuestion(23, 5),
    c => { c.controle.points.G = ['translate', 'E', 'A', 'J']; });
  pousse("B annonce milieu de [JG] alors que G a bouge", parQuestion(23, 6),
    c => { c.controle.points.G = ['point', '4', '2']; });
  pousse("K place a 2 de M au lieu de 1", parQuestion(23, 7),
    c => { c.controle.points.K = ['point', '0', '1']; });
  pousse("PK annonce √5 au lieu de √5/2", parQuestion(23, 8),
    c => { c.controle.faits[2][3] = '√5'; });
  pousse("E annonce milieu de [GN] au lieu de [GM]", parQuestion(23, 9),
    c => { c.controle.faits[0] = ['milieu', 'E', 'G', 'N']; });
  pousse("GN annonce 2√6", parQuestion(23, 11),
    c => { c.controle.faits[0][3] = '2√6'; });
  pousse("les coordonnees de M dans (B;E;G) inversees", parQuestion(23, 12),
    c => { c.controle.faits[0] = ['coordonnees-dans', 'M', 'B', 'E', 'G', '-1', '2']; });

  // ── التمرين 4 — LA FIGURE ──────────────────────────────────────────────
  pousse("C confondu avec A : le second point du cercle n en est plus un", parQuestion(24, 0),
    c => { c.controle.points.C = ['point', '2', '0']; });
  pousse("C hors du cercle de diametre [AB]", parQuestion(24, 0),
    c => { c.controle.points.C = ['point', '7', '0']; });
  pousse("AB annonce 2√14", parQuestion(24, 2),
    c => { c.controle.faits[2][3] = '2√14'; });
  pousse("CP annonce AB au lieu de AB/2", parQuestion(24, 3),
    c => { c.controle.faits[0][3] = '2√13'; });
  pousse("le rapport BC/OE annonce 3", parQuestion(24, 4),
    c => { c.controle.faits[3][5] = '3'; });
  pousse("F pris symetrique de E par rapport a J", parQuestion(24, 6),
    c => { c.controle.points.F = ['sym', 'E', 'J']; });
  pousse("N et P declarees confondues apres deplacement de B", parQuestion(24, 7),
    c => { c.controle.points.B = ['point', '6', '7']; });
  pousse("aire du trapeze ACMN annoncee 10", parQuestion(24, 8),
    c => { c.controle.faits[1][5] = '10'; });
  pousse("le rapport CA/CO du centre de gravite annonce 1/2", parQuestion(24, 9),
    c => { c.controle.faits[5][5] = '1/2'; });
  pousse("AF/AL annonce 1/3", parQuestion(24, 10),
    c => { c.controle.faits[0][5] = '1/3'; });
  pousse("EFBL declare trapeze isocele dans le mauvais ordre", parQuestion(24, 11),
    c => { c.controle.faits[0] = ['trapeze-isocele', 'E', 'B', 'F', 'L']; });

  // ── les garde-fous du contrat « figure » ───────────────────────────────
  pousse("figure sans aucune fait a controler", parQuestion(23, 0),
    c => { c.controle.faits = []; });
  pousse("fait au nom inconnu", parQuestion(23, 0),
    c => { c.controle.faits = [['quadrilatere-magique', 'O', 'A', 'B', 'J']]; });

  // ── les deux garde-fous de forme ───────────────────────────────────────
  pousse("étape dupliquée", parQuestion(21, 0),
    c => { c.etapes[2] = c.etapes[1].slice(); });
  pousse("relation répétée sous un autre libellé", parQuestion(21, 0),
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
