// Valide les huit familles du chapitre « المعلم المتعامد و المتجانس » (9 أساسي).
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
require('./familles.js');
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
    // Deux passes, et l'ordre n'est pas arbitraire : un `env` peut SERVIR à
    // poser la figure — le x du carré ABCD —, ou au contraire en SORTIR —
    // le x qui n'est autre que BH. On évalue donc d'abord ce qui se laisse
    // évaluer seul, on bâtit la figure avec, puis on évalue le reste.
    const avant = {}, apres = {};
    for (const nom in (c.env || {})) {
      try { avant[nom] = F.analyser(c.env[nom], avant); }
      catch (err) { apres[nom] = c.env[nom]; }
    }
    const P = R.figure(c.points, avant);
    const e = Object.assign(R.nommer(P), avant);
    for (const nom in apres) e[nom] = F.analyser(apres[nom], e);
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
// UN CHAPITRE ENGENDRÉ SE FALSIFIE AUTREMENT QU'UNE FEUILLE FIGÉE : ce n'est
// pas un nombre du maître qu'on remet, c'est LA FIGURE qu'on déforme. On
// déplace un point, on échange deux coordonnées, on prend un milieu pour un
// symétrique — et chaque fois la famille entière doit protester, quel que soit
// le tirage sur lequel on est tombé.
// -------------------------------------------------------------------------
if (process.env.CONTRE_EXEMPLES) {
  const cas = [];
  const copie = q => JSON.parse(JSON.stringify(q));
  const pousse = (nom, q, f) => { const c = copie(q); f(c); cas.push([nom, c]); };
  const parQuestion = (n, i) => F.tirer(n)[i];
  // Décale d'une unité l'abscisse d'un point posé de la figure.
  const bouger = (c, p) => { c.controle.points[p][1] = c.controle.points[p][1] + ' + 1'; };
  // Décale la valeur attendue d'un fait numérique (dernier argument).
  const fausser = (c, k) => {
    const f = c.controle.faits[k];
    f[f.length - 1] = '(' + f[f.length - 1] + ') + 1';
  };

  // ── 1 · le milieu ──────────────────────────────────────────────────────
  pousse("le milieu declare sur un B deplace", parQuestion(1, 0), c => bouger(c, 'B'));
  pousse("l abscisse du milieu decalee", parQuestion(1, 1), c => fausser(c, 1));
  pousse("l ordonnee du milieu decalee", parQuestion(1, 2), c => fausser(c, 2));
  pousse("le milieu pris pour le symetrique", parQuestion(1, 3),
    c => { c.controle.points.M = ['sym', 'A', 'B']; });

  // ── 2 · le symetrique ──────────────────────────────────────────────────
  pousse("le symetrique pris pour le milieu — le 2 oublie", parQuestion(2, 0),
    c => { c.controle.points.E = ['milieu', 'A', 'B']; });
  pousse("la symetrie prise dans l autre sens", parQuestion(2, 1),
    c => { c.controle.points.E = ['sym', 'B', 'A']; });
  pousse("l abscisse du symetrique decalee", parQuestion(2, 2), c => fausser(c, 2));
  pousse("B declare milieu de [AE] apres deplacement", parQuestion(2, 3),
    c => bouger(c, 'B'));

  // ── 3 · la distance ────────────────────────────────────────────────────
  pousse("le carre de la distance decale", parQuestion(3, 0), c => fausser(c, 0));
  pousse("la distance annoncee sans le radical", parQuestion(3, 1),
    c => { c.controle.faits[1][3] = c.controle.faits[0][3]; });
  pousse("un point deplace, la distance ne suit pas", parQuestion(3, 2),
    c => bouger(c, 'B'));
  pousse("l autre point deplace", parQuestion(3, 3), c => bouger(c, 'A'));

  // ── 4 · la nature ──────────────────────────────────────────────────────
  pousse("un sommet deplace : ce n est plus un parallelogramme", parQuestion(4, 0),
    c => bouger(c, 'D'));
  pousse("les sommets pris dans le desordre", parQuestion(4, 1),
    c => { c.controle.faits[0] = [c.controle.faits[0][0], 'A', 'B', 'D', 'C']; });
  pousse("le cote adjacent annonce faux", parQuestion(4, 2), c => fausser(c, 2));
  pousse("le premier cote annonce faux", parQuestion(4, 3), c => fausser(c, 1));

  // ── 5 · l alignement ───────────────────────────────────────────────────
  // DÉCALER UN POINT NE MORD PAS À TOUS LES COUPS ici, et c'est la famille qui
  // a raison : selon le tirage, la question porte sur « alignés » ou sur « non
  // alignés », et un décalage d'une unité peut laisser la réponse vraie. On
  // vise donc ce qui ne dépend d'aucun tirage — la RÉPONSE elle-même, et un
  // point qu'on fait disparaître dans un autre.
  pousse("le troisieme point confondu avec le premier", parQuestion(5, 0),
    c => { c.controle.points.C = ['point', c.controle.points.A[1], c.controle.points.A[2]]; });
  pousse("la reponse retournee : aligne devient non aligne", parQuestion(5, 1),
    c => { const f = c.controle.faits[0];
           f[0] = (f[0] === 'alignes') ? 'non-alignes' : 'alignes'; });
  pousse("l alignement affirme sur trois points quelconques", parQuestion(5, 2),
    c => { c.controle.faits = [['alignes', 'A', 'B', 'C']]; c.controle.points.C[1] += ' + 1'; });

  // ── 6 · parallele ou perpendiculaire ───────────────────────────────────
  // Même leçon qu'à la famille 5 : décaler d'une unité peut laisser la réponse
  // vraie quand la droite est axiale. On APLATIT donc la figure — deux points
  // confondus —, ce qui rend tout « colinéaire » et « orthogonal » à la fois :
  // c'est exactement ce que les deux `distincts` sont là pour refuser.
  pousse("les deux points de la seconde droite confondus", parQuestion(6, 0),
    c => { c.controle.points.D = ['point', c.controle.points.C[1], c.controle.points.C[2]]; });
  pousse("les deux points de la premiere droite confondus", parQuestion(6, 1),
    c => { c.controle.points.B = ['point', c.controle.points.A[1], c.controle.points.A[2]]; });
  pousse("parallelisme et perpendicularite confondus", parQuestion(6, 2),
    c => { const f = c.controle.faits[0];
           f[0] = (f[0] === 'paralleles') ? 'perpendiculaires' : 'paralleles'; });

  // ── 7 · le quatrieme sommet ────────────────────────────────────────────
  pousse("le quatrieme sommet decale", parQuestion(7, 0), c => bouger(c, 'D'));
  pousse("l abscisse du quatrieme sommet fausse", parQuestion(7, 1), c => fausser(c, 1));
  pousse("le milieu des diagonales pris sur [AB]", parQuestion(7, 2),
    c => { c.controle.points.M = ['milieu', 'A', 'B']; });
  pousse("le parallelogramme annonce dans le mauvais ordre", parQuestion(7, 3),
    c => { c.controle.faits[0] = ['parallelogramme', 'A', 'C', 'B', 'D']; });

  // ── 8 · le cercle circonscrit ──────────────────────────────────────────
  pousse("un sommet deplace : l angle droit disparait", parQuestion(8, 0),
    c => bouger(c, 'C'));
  pousse("le centre pris au milieu d un cote de l angle droit", parQuestion(8, 1),
    c => { c.controle.points.M = ['milieu', 'A', 'B']; });
  pousse("le rayon pris egal a l hypotenuse", parQuestion(8, 2),
    c => { c.controle.faits[3][3] = c.controle.faits[2][3]; });
  pousse("l angle droit annonce au mauvais sommet", parQuestion(8, 3),
    c => { c.controle.faits[0] = ['rectangle-en', 'B', 'A', 'C']; });

  // ── les garde-fous du contrat ──────────────────────────────────────────
  pousse("figure sans aucun fait a controler", parQuestion(1, 4),
    c => { c.controle.faits = []; });
  pousse("fait au nom inconnu", parQuestion(4, 4),
    c => { c.controle.faits = [['quadrilatere-magique', 'A', 'B', 'C', 'D']]; });
  pousse("étape dupliquée", parQuestion(3, 4),
    c => { c.etapes[2] = c.etapes[1].slice(); });
  pousse("relation répétée sous un autre libellé", parQuestion(3, 4),
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
