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
const G = require('./espace.js');
const E = require('./entiers.js');
const T = require('./stat.js');
const N = require('./denombrer.js');
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
// Un rationnel STRICTEMENT POSITIF — pour les lettres qui passent sous un radical.
function rndPos() {
  return F.S(F.rat(F.ent(1, 9), F.ent(1, 6)));
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
  // Une SÉRIE STATISTIQUE. Le contrat est celui de la figure : on ne recopie
  // pas les grandeurs, on les recalcule sur les seules données brutes — bornes
  // (ou valeurs) et effectifs. Les noms disponibles aux étapes en sortent tout
  // seuls : N, M, Me, E, na, ca, ra, fa, pa, ga, xa, ba…
  // UN ENSEMBLE À DÉNOMBRER. Il n'apporte aucun nom aux étapes : ce qu'il
  // porte est un COMPTE, et le compte se contrôle par énumération exhaustive,
  // jamais par le produit que la chaîne emploie.
  if (c.ensemble) {
    const e = {};
    for (const nom in (c.env || {})) e[nom] = F.analyser(c.env[nom], e);
    return [e];
  }
  if (c.serie) {
    const s = T.serie(Object.assign({ nom: 'contrôle' }, c.serie));
    const e = T.nommer(s);
    for (const nom in (c.env || {})) e[nom] = F.analyser(c.env[nom], e);
    e.__serie = s;
    return [e];
  }
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
  // UN SOLIDE. Même contrat que la figure du plan, en trois coordonnées : le
  // sommet d'une pyramide est POSÉ, le centre de sa base et le pied de ses
  // hauteurs sont CALCULÉS. Les noms disponibles aux étapes en sortent seuls —
  // xS, yS, zS, et les longueurs SA, OK, CK dans les deux ordres.
  if (c.espace) {
    const avant = {}, apres = {};
    for (const nom in (c.env || {})) {
      try { avant[nom] = F.analyser(c.env[nom], avant); }
      catch (err) { apres[nom] = c.env[nom]; }
    }
    const P = G.figure(c.espace, avant);
    const e = Object.assign(G.nommer(P), avant);
    for (const nom in apres) e[nom] = F.analyser(apres[nom], e);
    e.__espace = P;
    return [e];
  }
  if (c.libres) {
    // c.positifs — des lettres tirées STRICTEMENT POSITIVES. Sans cela une
    // identité qui porte un √a ne pourrait pas être testée : le tirage rendrait
    // un négatif une fois sur deux, et la vérification s'arrêterait sur une
    // exception au lieu de dire quelque chose.
    const pos = new Set(c.positifs || []);
    return Array.from({ length: ECHANTILLONS }, () => {
      const e = {};
      c.libres.forEach(v => { e[v] = pos.has(v) ? rndPos() : rnd(); });
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
  if (!(c.claims || []).length && !(c.faits || []).length
      && !(c.entiers || []).length && !(c.divisibles || []).length
      && !(c.diviseurs || []).length)
    p.push('بلا تأكيد يُراقَب');
  return p;
}

// Le contrôle des GRANDS ENTIERS — l'exercice 2 de la séance 11 affirme sept
// fois qu'un nombre de deux mille chiffres est divisible par 3, par 21, par 42.
// En flottants la question n'a pas de sens : `243^1001` déborde. On recalcule
// donc en BigInt, et une divisibilité qui n'est pas vraie ne le devient pas.
function controlerEntiers(c) {
  const p = [];
  for (const [gauche, droite] of (c.entiers || [])) {
    let g, d;
    try { g = E.evaluer(gauche); d = E.evaluer(droite); }
    catch (err) { p.push(`تعذّر « ${gauche} = ${droite} » (${err.message})`); continue; }
    controles++;
    if (g !== d) p.push(`« ${gauche} » ≠ « ${droite} »`);
  }
  // « les diviseurs de 15 sont 1, 3, 5, 15 » : la liste ENTIÈRE, balayée, et
  // comparée dans l'ordre. Un diviseur oublié fait échouer autant qu'un
  // diviseur inventé — c'est ce qui donne son sens au « et il n'y en a pas
  // d'autres » de la rédaction.
  for (const [expr, attendu] of (c.diviseurs || [])) {
    let liste;
    try { liste = E.diviseurs(E.evaluer(expr)).map(String); }
    catch (err) { p.push(`تعذّر قواسم « ${expr} » (${err.message})`); continue; }
    controles++;
    const veut = String(attendu).trim().split(/\s+/);
    if (liste.length !== veut.length || liste.some((x, i) => x !== veut[i]))
      p.push(`قواسم « ${expr} » هي ${liste.join(' ')} لا ${veut.join(' ')}`);
  }
  for (const [expr, diviseur] of (c.divisibles || [])) {
    let n;
    try { n = E.evaluer(expr); }
    catch (err) { p.push(`تعذّر « ${expr} » (${err.message})`); continue; }
    controles++;
    if (!E.divise(n, diviseur)) p.push(`« ${expr} » لا يقبل القسمة على ${diviseur}`);
  }
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
    // `grands` bascule TOUTE la chaîne sur l'arithmétique entière exacte : les
    // étapes y parlent de 3^5000, que le flottant ne sait pas écrire.
    if (c.grands) {
      try {
        const r = E.verifierRelation(String(math));
        if (r === null) souci = `« ${math} » ليست علاقة`;
        else if (r) souci = r;
        else { bon = envs.length; relations++; }
      } catch (e) { souci = `تعذّر « ${math} » (${e.message})`; }
    } else {
      for (const env of envs) {
        try {
          const r = F.verifierRelation(String(math).replace(/×/g, '*'), env);
          if (r === null) { souci = `« ${math} » ليست علاقة`; break; }
          if (r) { souci = souci || r; continue; }
          bon++; relations++;
        } catch (e) { souci = `تعذّر « ${math} » (${e.message})`; break; }
      }
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
    if (c.grands) {
      try {
        const r = E.verifierRelation(e);
        if (r) probs.push(`نصّ الوضعية فاسد: ${r}`); else if (r === false) relations++;
      } catch (err) { probs.push(`نصّ غير قابل للتحليل « ${e} » (${err.message})`); }
      continue;
    }
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
  probs.push(...controlerEntiers(c));
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
  // LES FAITS DU SOLIDE — « SABCD est une pyramide régulière », « (AC) est
  // perpendiculaire au plan (SBD) », « SA = 6 ». Recalculés sur les seules
  // coordonnées des sommets, exactement comme dans le plan : c'est ici que
  // l'énoncé d'un exercice d'espace se fait contredire, et il s'en fait
  // contredire — le « SA = 6 » de la séance 12 vaut 3√2.
  if (c.espace) {
    if (!(c.faits || []).length) probs.push('مجسّم بلا واقعة تُراقَب');
    probs.push(...G.verifierFaits(c.faits, envs[0].__espace, envs[0]));
    controles += (c.faits || []).length;
  }
  // LES FAITS DE L'ENSEMBLE — le compte et la liste, obtenus en parcourant les
  // mille nombres à trois chiffres un par un. La chaîne, elle, a multiplié des
  // branches : les deux chemins n'ont rien en commun.
  if (c.ensemble) {
    if (!(c.faits || []).length) probs.push('مجموعة بلا واقعة تُراقَب');
    probs.push(...N.verifierFaits(c.faits, c.ensemble));
    controles += (c.faits || []).length;
  }
  // LES FAITS DE LA SÉRIE — « la moyenne vaut 288/5 », « la médiane vaut 62 »,
  // « le tableau cumulé est 15, 23, 43, 50 » : recalculés sur les effectifs.
  if (c.serie) {
    if (!(c.faits || []).length) probs.push('سلسلة بلا واقعة تُراقَب');
    probs.push(...T.verifierFaits(c.faits, envs[0].__serie, envs[0]));
    controles += (c.faits || []).length;
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

  // ══ LA SÉANCE 3 ════════════════════════════════════════════════════════
  // ── التمرين 1 — une seule direction, vue quatre fois ───────────────────
  pousse("A deplace : AB ne vaut plus 3", parQuestion(31, 0),
    c => { c.controle.points.A = ['point', '2', '2√14/3']; });
  pousse("MN annonce 3", parQuestion(31, 0),
    c => { c.controle.faits[0][3] = '3'; });
  pousse("M pris au milieu de [BC]", parQuestion(31, 0),
    c => { c.controle.points.M = ['milieu', 'B', 'C']; });
  pousse("le rapport NA/NC inverse", parQuestion(31, 1),
    c => { c.controle.faits[2][5] = '5'; });
  pousse("NC annonce 5/6", parQuestion(31, 1),
    c => { c.controle.faits[0][3] = '5/6'; });
  pousse("AN pris egal a NC", parQuestion(31, 2),
    c => { c.controle.faits[0][3] = '25/6'; });
  pousse("le rapport DP/DA pris a 1/6", parQuestion(31, 3),
    c => { c.controle.faits[1][5] = '1/6'; });
  pousse("D construit sur la parallele a (AC)", parQuestion(31, 3),
    c => { c.controle.points.Zc = ['translate', 'C', 'A', 'C']; });
  pousse("MP annonce 5/2", parQuestion(31, 4),
    c => { c.controle.faits[1][3] = '5/2'; });
  pousse("CD annonce 6", parQuestion(31, 4),
    c => { c.controle.faits[2][3] = '6'; });
  pousse("R pris symetrique de B par rapport a M", parQuestion(31, 5),
    c => { c.controle.points.R = ['sym', 'B', 'M']; });
  pousse("RJ annonce 2", parQuestion(31, 5),
    c => { c.controle.faits[0][3] = '2'; });

  // ── التمرين 2 — le losange que les diagonales trahissent ───────────────
  pousse("A deplace : (AC) n est plus verticale", parQuestion(32, 0),
    c => { c.controle.points.A = ['point', '3', '√2']; });
  pousse("perpendicularite annoncee avec le mauvais axe", parQuestion(32, 0),
    c => { c.controle.faits[0] = ['perpendiculaires', 'O', 'Z', 'A', 'C']; });
  pousse("l ordonnee de K annoncee non nulle", parQuestion(32, 1),
    c => { c.controle.faits[1][2] = '1'; });
  pousse("K pris sur (OJ)", parQuestion(32, 1),
    c => { c.controle.points.K = ['inter', 'A', 'C', 'O', 'Z']; });
  pousse("L pris symetrique de A par rapport a O", parQuestion(32, 2),
    c => { c.controle.points.L = ['sym', 'A', 'O']; });
  pousse("AOLB declare losange dans le mauvais ordre", parQuestion(32, 2),
    c => { c.controle.faits[0] = ['losange', 'A', 'L', 'O', 'B']; });
  pousse("l aire du losange calculee sans le demi", parQuestion(32, 3),
    c => { c.controle.faits[0][5] = '8√2'; });
  pousse("la diagonale AL annoncee 2", parQuestion(32, 3),
    c => { c.controle.faits[1][3] = '2'; });
  pousse("T pris sur la parallele a (OI)", parQuestion(32, 4),
    c => { c.controle.points.Zb = ['translate', 'B', 'O', 'I']; });
  pousse("l abscisse de T annoncee 2", parQuestion(32, 4),
    c => { c.controle.faits[0][2] = '2'; });
  pousse("la longueur du segment [FT] annoncee 2", parQuestion(32, 5),
    c => { c.controle.faits[0][3] = '2'; });

  // ── التمرين 3 — deux négatifs, et des comparaisons qui se renversent ────
  pousse("a decale", parQuestion(33, 0), c => { c.controle.claims[0][1] = '2√6 + 5'; });
  pousse("√24 sorti en 4√6", parQuestion(33, 0),
    c => { c.etapes[1][1] = '√24 = 4√6'; });
  pousse("b mal developpe", parQuestion(33, 0),
    c => { c.controle.claims[1][1] = '3√2 + 7'; });
  pousse("la difference a - b faussee", parQuestion(33, 1),
    c => { c.controle.claims[0][1] = '2√6 - 3√2 - 2'; });
  pousse("les carres 24 et 18 intervertis", parQuestion(33, 1),
    c => { c.etapes[4][1] = '2√6 < 3√2'; });
  pousse("le denominateur 2 - 3a mal calcule", parQuestion(33, 2),
    c => { c.controle.claims[0][1] = '17 + 6√6'; });
  pousse("le signe du second quotient non retourne", parQuestion(33, 2),
    c => { c.controle.claims[2][1] = '5/(3b - 4)'; });
  pousse("b/a annonce plus petit que 1", parQuestion(33, 3),
    c => { c.etapes[3][1] = 'a < b'; });
  pousse("b/a mal rationalise", parQuestion(33, 3),
    c => { c.controle.claims[4][1] = '35 + 14√6 - 15√2 + 12√3'; });
  pousse("MN pris comme la somme au lieu de la difference", parQuestion(33, 4),
    c => { c.controle.env.MN = 'b^2/a^2 + b/a'; });
  pousse("la factorisation de MN fausse", parQuestion(33, 4),
    c => { c.controle.claims[0][1] = '(b/a)(b/a + 1)'; });

  // ── التمرين 4 — l'identité (a - b)² = ab ───────────────────────────────
  pousse("a decale", parQuestion(34, 0), c => { c.controle.claims[0][1] = '4 + 2√5'; });
  pousse("le produit des conjugues faux", parQuestion(34, 0),
    c => { c.etapes[2][1] = '(3 - √5)(3 + √5) = 9 + 5'; });
  pousse("le numerateur de b mal factorise", parQuestion(34, 1),
    c => { c.controle.claims[0][1] = '7 + 3√5'; });
  pousse("b decale", parQuestion(34, 1), c => { c.controle.claims[1][1] = '1 + √5'; });
  pousse("le carre de 2√5 faux", parQuestion(34, 2),
    c => { c.controle.claims[0][1] = '10'; });
  pousse("la difference a - b faussee", parQuestion(34, 3),
    c => { c.controle.claims[0][1] = '3 + √5'; });
  pousse("le carre de a faux", parQuestion(34, 3),
    c => { c.controle.claims[1][1] = '36 + 16√5'; });
  pousse("le produit ab mal developpe", parQuestion(34, 4),
    c => { c.controle.claims[0][1] = '14 + 6√5'; });
  pousse("l identite (a - b)^2 = ab faussee", parQuestion(34, 5),
    c => { c.controle.claims[0][1] = 'a + b'; });
  pousse("l inverse annonce sur a + b", parQuestion(34, 5),
    c => { c.controle.claims[1][1] = '1/(a + b)'; });
  pousse("le produit avec l inverse ne vaut plus 1", parQuestion(34, 5),
    c => { c.controle.claims[2][1] = '-1'; });

  // ── التمرين 6 — « نموذجية مدنين », vingt volets sur une seule figure ───
  //
  // Le point B(3√2 + 1 ; 0) n'est pas décoratif : il place D exactement en 2√2,
  // donc E sur (AJ) à la hauteur √2 + 1, et c'est ce qui fait de BCE un triangle
  // À LA FOIS isocèle et rectangle. Le déplacer casse la moitié de l'exercice —
  // et c'est exactement ce que la première falsification vérifie.
  pousse("B deplace : BCE cesse d etre rectangle", parQuestion(36, 5),
    c => { c.controle.points.B = ['point', '3√2 + 2', '0']; });
  pousse("AB annonce 3√2 + 1", parQuestion(36, 0),
    c => { c.controle.faits[0][3] = '3√2 + 1'; });
  pousse("BI pris egal a AI", parQuestion(36, 0),
    c => { c.controle.faits[2][3] = '3'; });
  pousse("C place au tiers en partant de B", parQuestion(36, 1),
    c => { c.controle.points.C = ['point', '3√2 + 1 - (√2 + 1)', '0']; });
  pousse("le rapport AC/AB annonce 1/2", parQuestion(36, 1),
    c => { c.controle.faits[4][5] = '1/2'; });
  pousse("BC pris egal a AC", parQuestion(36, 2),
    c => { c.controle.faits[0][3] = '√2 + 1'; });
  pousse("D pris milieu de [AB]", parQuestion(36, 3),
    c => { c.controle.points.D = ['milieu', 'A', 'B']; });
  pousse("l abscisse de D annoncee 2√2 + 1", parQuestion(36, 3),
    c => { c.controle.faits[1][2] = '2√2 + 1'; });
  pousse("DE annonce √2", parQuestion(36, 4),
    c => { c.controle.faits[0][3] = '√2'; });
  pousse("E pris sur (AI) au lieu de (AJ)", parQuestion(36, 4),
    c => { c.controle.points.E = ['inter', 'D', 'Zd', 'A', 'I']; });
  pousse("l aire du triangle BCE annoncee 3 + √2", parQuestion(36, 5),
    c => { c.controle.faits[2][5] = '3 + √2'; });
  pousse("BCE declare isocele en B", parQuestion(36, 5),
    c => { c.controle.faits[0] = ['isocele', 'B', 'C', 'E']; });
  pousse("BE annonce 2 + 2√2", parQuestion(36, 6),
    c => { c.controle.faits[0][3] = '2 + 2√2'; });
  pousse("le carre de BC faux", parQuestion(36, 6),
    c => { c.controle.faits[2][3] = '12 + 4√2'; });
  pousse("le rapport JE/JA annonce 2", parQuestion(36, 7),
    c => { c.controle.faits[2][5] = '2'; });
  pousse("le carre de JE faux", parQuestion(36, 7),
    c => { c.controle.faits[1][3] = '5'; });
  pousse("ODEF declare rectangle dans le mauvais ordre", parQuestion(36, 8),
    c => { c.controle.faits[0] = ['rectangle', 'O', 'E', 'D', 'F']; });
  pousse("l aire du rectangle ODEF annoncee 4 + √2", parQuestion(36, 8),
    c => { c.controle.faits[1][6] = '4 + √2'; });
  pousse("l ordonnee de F prise nulle", parQuestion(36, 9),
    c => { c.controle.faits[1][2] = '0'; });
  pousse("EH annonce 2√2", parQuestion(36, 10),
    c => { c.controle.faits[0][3] = '2√2'; });
  pousse("H pris sur (OI) au lieu de (IJ)", parQuestion(36, 10),
    c => { c.controle.points.H = ['inter', 'O', 'I', 'E', 'F']; });
  pousse("BEHI declare parallelogramme dans le mauvais ordre", parQuestion(36, 11),
    c => { c.controle.faits[0] = ['parallelogramme', 'B', 'H', 'E', 'I']; });
  pousse("l aire de BEHI annoncee 6 + 6√2", parQuestion(36, 11),
    c => { c.controle.faits[1][6] = '6 + 6√2'; });
  pousse("HJ annonce √2", parQuestion(36, 12),
    c => { c.controle.faits[0][3] = '√2'; });
  pousse("l abscisse de H annoncee √2", parQuestion(36, 13),
    c => { c.controle.faits[0][2] = '√2'; });
  pousse("la perpendicularite annoncee entre (LH) et (EC)", parQuestion(36, 14),
    c => { c.controle.faits[0] = ['perpendiculaires', 'L', 'H', 'E', 'C']; });
  pousse("L pris sur (OI)", parQuestion(36, 14),
    c => { c.controle.points.L = ['inter', 'E', 'C', 'O', 'I']; });
  pousse("K pris symetrique de A par rapport a H", parQuestion(36, 15),
    c => { c.controle.points.K = ['sym', 'A', 'H']; });
  pousse("l ordonnee de K annoncee positive", parQuestion(36, 15),
    c => { c.controle.faits[3][2] = '√2 + 1'; });
  pousse("M pris milieu de [BH]", parQuestion(36, 16),
    c => { c.controle.points.M = ['milieu', 'B', 'H']; });
  pousse("l alignement annonce sur M, A et H", parQuestion(36, 16),
    c => { c.controle.faits[0] = ['alignes', 'M', 'A', 'H']; });
  pousse("l ensemble N annonce sur la mauvaise abscisse", parQuestion(36, 17),
    c => { c.controle.faits[0][2] = '√2'; });
  pousse("l ensemble P annonce sur la mauvaise ordonnee", parQuestion(36, 18),
    c => { c.controle.faits[0][2] = '√2'; });
  pousse("les coordonnees de I dans (D,B,E) faussees", parQuestion(36, 19),
    c => { c.controle.faits[0][5] = '3√2 - 4'; });
  pousse("les coordonnees de C dans (D,B,E) faussees", parQuestion(36, 19),
    c => { c.controle.faits[3][5] = '1'; });
  pousse("les coordonnees de J dans (D,B,E) faussees", parQuestion(36, 19),
    c => { c.controle.faits[7][6] = '√2 + 1'; });

  // ══ LA SÉANCE 4 ════════════════════════════════════════════════════════
  // ── التمرين 1 — le trapèze qui refabrique l'équation ───────────────────
  pousse("M en √2 - 1/2 decale", parQuestion(41, 0),
    c => { c.controle.claims[0][1] = '3√2 - 127/2'; });
  pousse("le 36 remplace par 34 : le carre ne se ferme plus", parQuestion(41, 1),
    c => { c.controle.claims[0][0] = 'M + 34'; });
  pousse("factorisation de M avec les racines echangees", parQuestion(41, 2),
    c => { c.controle.claims[0][1] = '(x + 4)(x - 8)'; });
  pousse("le rapport de Thales pris a 1/3", parQuestion(41, 3),
    c => { c.controle.faits[2][5] = '1/3'; });
  pousse("un sommet deplace : (IJ) ne parallelise plus (CD)", parQuestion(41, 3),
    c => { c.controle.points.I = ['point', '9', '2√15']; });
  pousse("I declare milieu de [AB]", parQuestion(41, 4),
    c => { c.controle.faits[0] = ['milieu', 'I', 'A', 'B']; });
  pousse("l equation en x faussee", parQuestion(41, 4),
    c => { c.controle.claims[0][1] = '16'; });
  pousse("la ligne des milieux annoncee 16", parQuestion(41, 5),
    c => { c.controle.faits[0][3] = '16'; });
  pousse("l aire du trapeze faussee", parQuestion(41, 5),
    c => { c.controle.faits[3][6] = '8√15'; });

  // ── التمرين 2 — A joue trois rôles ─────────────────────────────────────
  pousse("SR annonce 2√5 - 2", parQuestion(42, 0), c => { c.controle.faits[0][3] = '2√5 - 2'; });
  pousse("OR pris positif dans le mauvais sens", parQuestion(42, 0),
    c => { c.controle.faits[1][3] = '1 - √5'; });
  pousse("l ordonnee de H differente de son abscisse", parQuestion(42, 1),
    c => { c.controle.faits[1][2] = '3 - √5'; });
  pousse("H pris sur (RI) au lieu de (RJ)", parQuestion(42, 1),
    c => { c.controle.points.H = ['inter', 'R', 'I', 'S', 'W']; });
  pousse("AB et CD echanges", parQuestion(42, 2), c => { c.controle.faits[0][3] = '6'; });
  pousse("le parallelisme annonce avec l axe des ordonnees", parQuestion(42, 3),
    c => { c.controle.faits[1] = ['paralleles', 'A', 'B', 'O', 'J']; });
  pousse("le rapport de Thales inverse", parQuestion(42, 4),
    c => { c.controle.faits[2][5] = '3/2'; });
  pousse("M pris sur (AC) au lieu de (AD)", parQuestion(42, 4),
    c => { c.controle.points.M = ['inter', 'B', 'C', 'A', 'C']; });
  pousse("N pris symetrique de M par rapport a D", parQuestion(42, 5),
    c => { c.controle.points.N = ['sym', 'M', 'D']; });
  pousse("le centre de gravite annonce en T", parQuestion(42, 5),
    c => { c.controle.faits[0] = ['centre-gravite', 'T', 'M', 'N', 'P']; });
  pousse("A declare milieu de [PM]", parQuestion(42, 6),
    c => { c.controle.faits[0] = ['milieu', 'A', 'P', 'M']; });
  pousse("AE annonce 5", parQuestion(42, 7), c => { c.controle.faits[1][3] = '5'; });
  pousse("F pris sur la parallele a (AB) par D", parQuestion(42, 7),
    c => { c.controle.points.Zd = ['translate', 'D', 'A', 'B']; });

  // ── التمرين 3 — le nombre d'or et son inverse ──────────────────────────
  pousse("a decale", parQuestion(43, 0), c => { c.controle.claims[0][1] = '(√5 - 1)/2'; });
  pousse("c mal developpe", parQuestion(43, 0), c => { c.controle.claims[2][1] = '14 + 6√5'; });
  pousse("le produit ab annonce 2", parQuestion(43, 1),
    c => { c.controle.claims[0][1] = '2'; });
  pousse("a/b pris egal a a au lieu de a^2", parQuestion(43, 2),
    c => { c.controle.claims[1][1] = 'a'; });
  pousse("l identite du developpement faussee", parQuestion(43, 2),
    c => { c.controle.claims[0][1] = 'a^4 + a^3 + a - 1'; });
  pousse("la valeur absolue levee a l envers", parQuestion(43, 3),
    c => { c.controle.claims[1][1] = 'x - 2'; });
  pousse("la racine de 14 - 6√5 faussee", parQuestion(43, 3),
    c => { c.controle.claims[0][1] = '√5 - 3'; });

  // ── التمرين 4 — encadrer plutôt que calculer ───────────────────────────
  pousse("a et b echanges", parQuestion(44, 0), c => { c.controle.claims[0][1] = '(3 + √5)/2'; });
  pousse("la somme a + b annoncee 5", parQuestion(44, 0),
    c => { c.controle.claims[2][1] = '5'; });
  pousse("le carre de 3 faux", parQuestion(44, 1), c => { c.controle.claims[1][1] = '6'; });
  pousse("l encadrement de b decale", parQuestion(44, 2),
    c => { c.controle.claims[1][1] = '(3 - √5)/2'; });
  pousse("E annonce 2√5 - 4", parQuestion(44, 3), c => { c.controle.claims[0][1] = '2√5 - 4'; });
  pousse("la premiere valeur absolue levee sans changer de signe", parQuestion(44, 3),
    c => { c.controle.claims[1][1] = '(√5 - 2)/2'; });
  pousse("le carre de a faux", parQuestion(44, 4), c => { c.controle.claims[0][1] = '(7 + 3√5)/2'; });
  pousse("le produit des carres annonce different de 1", parQuestion(44, 4),
    c => { c.controle.claims[2][1] = '2'; });
  pousse("le coefficient 7 + 3√5 faux", parQuestion(44, 5),
    c => { c.controle.claims[0][1] = '(7 - 3√5)a'; });
  pousse("le rationnel final faux", parQuestion(44, 6),
    c => { c.controle.claims[0][1] = '7'; });

  // ── التمرين 5 — le 60° qui fabrique un équilatéral ─────────────────────
  pousse("D deplace : le triangle ABC n est plus equilateral", parQuestion(45, 0),
    c => { c.controle.points.D = ['point', '0', '8√3']; });
  pousse("AD annonce 6", parQuestion(45, 0), c => { c.controle.faits[4][3] = '6'; });
  pousse("I declare milieu de [AB]", parQuestion(45, 1),
    c => { c.controle.faits[1] = ['milieu', 'I', 'A', 'B']; });
  pousse("G place a 3 de B", parQuestion(45, 1), c => { c.controle.faits[2][3] = '3'; });
  pousse("ACBH declare losange dans le mauvais ordre", parQuestion(45, 2),
    c => { c.controle.faits[0] = ['losange', 'A', 'B', 'C', 'H']; });
  pousse("H pris symetrique de C par rapport a B", parQuestion(45, 2),
    c => { c.controle.points.H = ['sym', 'C', 'B']; });
  pousse("CH annonce 6", parQuestion(45, 3), c => { c.controle.faits[0][3] = '6'; });
  pousse("B declare orthocentre du mauvais triangle", parQuestion(45, 4),
    c => { c.controle.faits[0] = ['orthocentre', 'B', 'A', 'D', 'H']; });
  pousse("K pris projete de B sur (CH)", parQuestion(45, 5),
    c => { c.controle.points.K = ['proj', 'B', 'C', 'H']; });
  pousse("CE annonce 3√3", parQuestion(45, 6), c => { c.controle.faits[0][3] = '3√3'; });
  pousse("C declare milieu de [DH]", parQuestion(45, 6),
    c => { c.controle.faits[2] = ['milieu', 'C', 'D', 'H']; });

  // ══ LA SÉANCE 5 ════════════════════════════════════════════════════════
  // ── التمرين 1 — a est l'inverse de b², et a vaut à peine 0,03 ──────────
  pousse("a decale", parQuestion(51, 0), c => { c.controle.claims[0][1] = '17 + 12√2'; });
  pousse("b decale", parQuestion(51, 0), c => { c.controle.claims[1][1] = '3 - 2√2'; });
  pousse("le carre parfait de a faux", parQuestion(51, 1),
    c => { c.controle.claims[0][1] = '(3 + 2√2)^2'; });
  pousse("a declare inverse de b et non de b^2", parQuestion(51, 2),
    c => { c.controle.claims[2][1] = '1/b'; });
  pousse("le produit a b^2 annonce 2", parQuestion(51, 2),
    c => { c.controle.claims[1][1] = '2'; });
  pousse("le signe de c inverse", parQuestion(51, 3),
    c => { c.controle.claims[1][1] = '14(√2 - 1)'; });
  pousse("c pris comme somme au lieu de difference", parQuestion(51, 3),
    c => { c.controle.claims[2][0] = 'a + b'; });
  pousse("l inverse de a faux", parQuestion(51, 4),
    c => { c.controle.claims[0][1] = '17 - 12√2'; });
  pousse("a^2 + a mal calcule", parQuestion(51, 5),
    c => { c.controle.claims[0][1] = '594 + 420√2'; });
  pousse("l entier final n est plus nul", parQuestion(51, 6),
    c => { c.controle.claims[0][1] = '1'; });
  pousse("1/a^2 pris egal a b^2", parQuestion(51, 6),
    c => { c.controle.claims[1][1] = 'b^2'; });

  // ── التمرين 2 — la relation métrique donne tout ────────────────────────
  pousse("IC annonce 4", parQuestion(52, 0), c => { c.controle.faits[0][3] = '4'; });
  pousse("I pris projete sur (BD)", parQuestion(52, 0),
    c => { c.controle.points.I = ['proj', 'B', 'B', 'D']; });
  pousse("BC annonce 2√6", parQuestion(52, 1), c => { c.controle.faits[0][3] = '2√6'; });
  pousse("l hypotenuse AC annoncee 4", parQuestion(52, 1),
    c => { c.controle.faits[1][3] = '4'; });
  pousse("C declare milieu de [BD]", parQuestion(52, 2),
    c => { c.controle.faits[0] = ['milieu', 'C', 'B', 'D']; });
  pousse("E construit sur la parallele a (AB)", parQuestion(52, 2),
    c => { c.controle.points.Zd = ['translate', 'D', 'A', 'B']; });
  pousse("BF annonce 3√6", parQuestion(52, 3), c => { c.controle.faits[0][3] = '3√6'; });
  pousse("F declare milieu de [AB]", parQuestion(52, 4),
    c => { c.controle.faits[0] = ['milieu', 'F', 'A', 'B']; });
  pousse("OF annonce 2√3", parQuestion(52, 4), c => { c.controle.faits[1][3] = '2√3'; });
  pousse("CODJ declare losange dans le mauvais ordre", parQuestion(52, 5),
    c => { c.controle.faits[0] = ['losange', 'C', 'D', 'O', 'J']; });
  pousse("l aire du losange calculee sans le demi", parQuestion(52, 5),
    c => { c.controle.faits[1][6] = '12√2'; });

  // ── التمرين 3 — les mêmes deux nombres, huit degrés ────────────────────
  pousse("les carres 147 et 121 intervertis", parQuestion(53, 0),
    c => { c.etapes[3][1] = '147 < 121'; });
  pousse("le carre de 7√3 faux", parQuestion(53, 0),
    c => { c.controle.claims[0][1] = '21'; });
  pousse("le carre de √11 faux", parQuestion(53, 1),
    c => { c.controle.claims[0][1] = '121'; });
  pousse("b mal developpe", parQuestion(53, 2),
    c => { c.controle.claims[0][1] = '√11 - 5 + √33 - 5√3'; });
  pousse("a mal factorise", parQuestion(53, 3),
    c => { c.controle.claims[0][1] = '(2√3 + 5)(1 - √3)'; });
  pousse("la comparaison 11 et 12 inversee", parQuestion(53, 4),
    c => { c.etapes[2][1] = '12 < 11'; });
  pousse("la multiplication par le negatif ne retourne pas", parQuestion(53, 5),
    c => { c.etapes[2][1] = '(√11 - 5)(1 - √3) < (2√3 - 5)(1 - √3)'; });
  pousse("a^2 mal calcule", parQuestion(53, 6), c => { c.controle.claims[0][1] = '268 + 154√3'; });
  pousse("a redecale dans le rangement", parQuestion(53, 7),
    c => { c.controle.claims[0][1] = '7√3 + 11'; });

  // ── التمرين 4 — le carré qui encadre ───────────────────────────────────
  pousse("la borne inferieure de x + y fausse", parQuestion(54, 0),
    c => { c.controle.claims[0][1] = '-9/4'; });
  pousse("le retournement oublie dans y - x", parQuestion(54, 0),
    c => { c.controle.claims[1][1] = '-1/2'; });
  pousse("le carre de -5 faux", parQuestion(54, 1), c => { c.controle.claims[0][1] = '-25'; });
  pousse("la borne 2x - 1 mal calculee", parQuestion(54, 1),
    c => { c.controle.claims[1][1] = '6'; });
  pousse("le developpement de (2x - 1)^2 faux", parQuestion(54, 2),
    c => { c.controle.claims[0][1] = '4(x^2 - x) + 2'; });
  pousse("le facteur 4 oublie", parQuestion(54, 2),
    c => { c.controle.claims[1][1] = '4x^2 - 2x + 1'; });
  pousse("le carre de √7/2 faux", parQuestion(54, 4), c => { c.controle.claims[0][1] = '7/2'; });

  // ── التمرين 5 — deux valeurs absolues ──────────────────────────────────
  pousse("la borne superieure de x fausse", parQuestion(55, 0),
    c => { c.controle.claims[1][1] = '3'; });
  pousse("la premiere valeur absolue levee sans changer de signe", parQuestion(55, 1),
    c => { c.controle.claims[0][1] = '2x - 1'; });
  pousse("la reduction de A faussee", parQuestion(55, 1),
    c => { c.controle.claims[1][1] = '1 + 2x'; });
  pousse("la valeur de A faussee", parQuestion(55, 2),
    c => { c.controle.claims[2][1] = '1'; });

  // ── التمرين 7 — l'aire qui refabrique l'équation ───────────────────────
  pousse("M en 5/3 annonce non nul", parQuestion(57, 0),
    c => { c.controle.claims[0][1] = '1'; });
  pousse("l ecriture 3(x^2 - 1) - 2(x + 1) faussee", parQuestion(57, 1),
    c => { c.controle.claims[0][1] = '3(x^2 - 1) - 2(x - 1)'; });
  pousse("la factorisation de M fausse", parQuestion(57, 2),
    c => { c.controle.claims[0][1] = '(x - 1)(3x + 5)'; });
  pousse("la racine -1 mal verifiee", parQuestion(57, 3),
    c => { c.controle.claims[0][1] = '1'; });
  pousse("l aire du trapeze calculee sans le demi", parQuestion(57, 4),
    c => { c.controle.claims[1][1] = '50/3'; });
  pousse("l aire du triangle equilateral fausse", parQuestion(57, 4),
    c => { c.controle.claims[3][1] = 'x^2 √3/2'; });
  pousse("la condition S1 = √3 S2 remplacee par S1 = S2", parQuestion(57, 4),
    c => { c.controle.claims[0][1] = 'SB'; });

  // ── التمرين 8 — le carré qui glisse ────────────────────────────────────
  pousse("TE annonce 4 - x", parQuestion(58, 0), c => { c.controle.faits[0][3] = '4/3'; });
  pousse("le carre MATH pris a droite de A", parQuestion(58, 0),
    c => { c.controle.points.M = ['point', '4/3', '0']; });
  pousse("l aire du carre annoncee 4/3", parQuestion(58, 1),
    c => { c.controle.faits[0][6] = '4/3'; });
  pousse("la condition S = S'/4 remplacee par S = S'", parQuestion(58, 1),
    c => { c.controle.claims[0][1] = 'SP'; });
  pousse("les coordonnees de T dans (A;C;M) faussees", parQuestion(58, 2),
    c => { c.controle.faits[0][5] = '1'; });
  pousse("les coordonnees de H dans (A;C;M) faussees", parQuestion(58, 2),
    c => { c.controle.faits[1][6] = '0'; });
  pousse("la forme canonique de Sb faussee", parQuestion(58, 3),
    c => { c.controle.claims[0][1] = '2(x - 2)^2 + 4'; });
  pousse("le minimum annonce 4", parQuestion(58, 4),
    c => { c.controle.claims[0][1] = '4'; });
  pousse("la borne de l intervalle faussee", parQuestion(58, 5),
    c => { c.controle.claims[0][1] = '10'; });
  pousse("HCEA declare losange : les quatre cotes egaux", parQuestion(58, 6),
    c => { c.controle.faits[2][3] = '8√2/3'; });
  pousse("le cerf-volant declare sur le mauvais axe", parQuestion(58, 6),
    c => { c.controle.faits[4] = ['perpendiculaires', 'H', 'C', 'E', 'A']; });

  // ══ LA SÉANCE 6 ════════════════════════════════════════════════════════
  // ── التمرين 1 — le rectangle qui glisse ────────────────────────────────
  pousse("l aire prise comme somme au lieu de produit", parQuestion(61, 0),
    c => { c.controle.claims[0][1] = '10x + x^2'; });
  pousse("S en 5 + √2 decale", parQuestion(61, 1), c => { c.controle.claims[0][1] = '25'; });
  pousse("la seconde ecriture de S faussee", parQuestion(61, 2),
    c => { c.controle.claims[0][1] = '9 - (x - 9)(x + 1)'; });
  pousse("une racine de S = 9 mal verifiee", parQuestion(61, 3),
    c => { c.controle.claims[0][1] = '10'; });
  pousse("la borne de l intervalle faussee", parQuestion(61, 4),
    c => { c.controle.claims[0][1] = '2'; });
  pousse("le carre parfait de MK^2 + 2S faux", parQuestion(61, 5),
    c => { c.controle.claims[0][1] = '10'; });
  pousse("la forme canonique de S faussee", parQuestion(61, 6),
    c => { c.controle.claims[0][1] = '25 + (x - 5)^2'; });
  pousse("le carre de 2√17 faux", parQuestion(61, 7), c => { c.controle.claims[0][1] = '34'; });

  // ── التمرين 2 — deux inverses ──────────────────────────────────────────
  pousse("a decale", parQuestion(62, 0), c => { c.controle.claims[0][1] = '5 + 2√6'; });
  pousse("le produit ab annonce 49", parQuestion(62, 0),
    c => { c.controle.claims[2][1] = '49'; });
  pousse("la difference des inverses faussee", parQuestion(62, 1),
    c => { c.controle.claims[0][1] = '8√6'; });
  pousse("le carre parfait annonce 9", parQuestion(62, 2),
    c => { c.controle.claims[0][1] = '9'; });
  pousse("a et b declares non inverses", parQuestion(62, 3),
    c => { c.controle.claims[0][1] = '-1'; });
  pousse("E decale", parQuestion(62, 4), c => { c.controle.claims[0][1] = '480 - 196√6'; });
  pousse("le radicande de F pris comme somme de carres", parQuestion(62, 4),
    c => { c.controle.claims[1][1] = '(b + a)^2'; });
  pousse("c decale", parQuestion(62, 5), c => { c.controle.claims[0][1] = '2 - √5'; });
  pousse("d decale", parQuestion(62, 5), c => { c.controle.claims[1][1] = '1 + √5'; });
  pousse("c declare inverse de d et non de 2d", parQuestion(62, 6),
    c => { c.controle.claims[2][1] = '1/d'; });
  // LA COQUILLE DU LIVRE : sous le radical, (1 - d²)/d est NÉGATIF.
  pousse("le d du livre a la place du c", parQuestion(62, 7),
    c => { c.controle.claims[0][0] = '(1 - d^2)/d'; });
  pousse("le carre de c faux", parQuestion(62, 7), c => { c.controle.claims[1][1] = '9 + 4√5'; });

  // ── التمرين 3 — le 6-8-10 dans un repère ───────────────────────────────
  pousse("M deplace : il n est plus le pied de la hauteur", parQuestion(63, 2),
    c => { c.controle.points.M = ['point', '3', '4']; });
  pousse("AM annonce 32/5", parQuestion(63, 0), c => { c.controle.faits[1][3] = '32/5'; });
  pousse("OM annonce 5", parQuestion(63, 1), c => { c.controle.faits[0][3] = '5'; });
  pousse("H pris projete sur (OJ)", parQuestion(63, 1),
    c => { c.controle.points.H = ['proj', 'M', 'O', 'J']; });
  pousse("le carre de OM faux", parQuestion(63, 2), c => { c.controle.faits[3][3] = '576/5'; });
  pousse("P declare milieu de [HM]", parQuestion(63, 3),
    c => { c.controle.faits[1] = ['milieu', 'P', 'H', 'M']; });
  pousse("E pris milieu de [AM]", parQuestion(63, 3),
    c => { c.controle.points.E = ['milieu', 'A', 'M']; });
  pousse("le cercle annonce de diametre [OB]", parQuestion(63, 4),
    c => { c.controle.faits[0] = ['sur-cercle-diametre', 'Q', 'O', 'B']; });
  pousse("LH annonce 96/25", parQuestion(63, 5), c => { c.controle.faits[0][3] = '96/25'; });
  pousse("l aire de OBE faussee", parQuestion(63, 5),
    c => { c.controle.faits[2][5] = '96/25'; });
  pousse("G pris symetrique par rapport a (OI)", parQuestion(63, 6),
    c => { c.controle.points.G = ['point', '-48/25', '136/25']; });
  pousse("L declare milieu de [EF]", parQuestion(63, 7),
    c => { c.controle.faits[1] = ['milieu', 'L', 'E', 'F']; });

  // ── التمرين « 5 » منزه — le nombre d'or ────────────────────────────────
  // LA COQUILLE DU LIVRE : « 1/5 » au lieu de « 1/2 » dans le premier terme de b.
  pousse("le 1/5 du livre a la place du 1/2", parQuestion(65, 0),
    c => { c.controle.env.b = '1/5 - (6 - (1 + √5)^2)/4'; });
  pousse("a decale", parQuestion(65, 0), c => { c.controle.claims[0][1] = '(√5 + 1)/2'; });
  pousse("le produit ab annonce 4", parQuestion(65, 1),
    c => { c.controle.claims[0][1] = '4'; });
  pousse("le rationnel final faux", parQuestion(65, 2),
    c => { c.controle.claims[0][1] = '5/2'; });
  pousse("les deux carres echanges", parQuestion(65, 3),
    c => { c.controle.claims[0][1] = '(3 + √5)/2'; });
  pousse("le carre agrandi : CE ne vaut plus a", parQuestion(65, 4),
    c => { c.controle.points.B = ['point', '1', '2']; });
  pousse("le rayon annonce 1", parQuestion(65, 4), c => { c.controle.faits[2][3] = '1'; });
  pousse("I n est plus le milieu : F mal place", parQuestion(65, 5),
    c => { c.controle.points.F = ['point', '-√5/2', '0']; });
  pousse("CF annonce a au lieu de b", parQuestion(65, 6),
    c => { c.controle.faits[0][3] = '√5/2 - 1/2'; });

  // ══ LA SÉANCE 7 ════════════════════════════════════════════════════════
  // ── التمرين 1 — réduire pour COMPARER : on vise le sens des inégalités ──
  pousse("le levier 6√(3/2) rendu egal a 6√6", parQuestion(71, 0),
    c => { c.controle.claims[0][1] = '6√6'; });
  pousse("m decale", parQuestion(71, 1),
    c => { c.controle.claims[0][1] = '3√6'; });
  pousse("les deux termes en √3 additionnes au lieu de s annuler", parQuestion(71, 1),
    c => { c.etapes[4][1] = '-2√3 + 2√3 = 4√3'; });
  pousse("n decale", parQuestion(71, 2),
    c => { c.controle.claims[0][1] = '6√2'; });
  pousse("les carres de m et n intervertis", parQuestion(71, 2),
    c => { c.etapes[7][1] = 'n^2 < m^2'; });
  pousse("√3 = 4√6/(4√2) mal factorise", parQuestion(71, 3),
    c => { c.controle.claims[0][1] = '4√2 √6'; });
  pousse("la division par √2 mal faite", parQuestion(71, 3),
    c => { c.controle.claims[1][1] = '7√2'; });
  pousse("le fractionnement de (1 - n^2)/n faux", parQuestion(71, 4),
    c => { c.controle.claims[0][1] = '1/n + n'; });
  pousse("les inverses ranges dans le mauvais sens", parQuestion(71, 4),
    c => { c.etapes[3][1] = '1/m < 1/n'; });
  pousse("11 declare plus grand que 7√3", parQuestion(71, 5),
    c => { c.etapes[7][1] = '7√3 < 11'; });
  pousse("t mal developpe", parQuestion(71, 5),
    c => { c.controle.claims[2][1] = '√11 - 5 - √33 - 5√3'; });
  pousse("s mal factorise", parQuestion(71, 6),
    c => { c.controle.claims[0][1] = '(2√3 + 5)(1 - √3)'; });
  pousse("la multiplication par (1 - √3) ne retourne pas l inegalite", parQuestion(71, 7),
    c => { c.etapes[5][1] = '(√11 - 5)(1 - √3) < (2√3 - 5)(1 - √3)'; });
  pousse("2√3 ecrit √11", parQuestion(71, 7),
    c => { c.controle.claims[0][1] = '√11'; });
  pousse("s et t declares egaux dans le rangement", parQuestion(71, 8),
    c => { c.etapes[3][1] = 's = t'; });

  // ── التمرين 2 — la figure : S contraint par « sur le cercle » et SB = 6 ──
  pousse("S deplace : SB ne vaut plus 6", parQuestion(72, 0),
    c => { c.controle.points.S = ['point', '6', '4']; });
  pousse("SA annonce 7", parQuestion(72, 1),
    c => { c.controle.faits[0][3] = '7'; });
  pousse("la relation metrique lue AK = SA^2/SB", parQuestion(72, 2),
    c => { c.etapes[2][1] = 'AK = SA^2/SB'; });
  pousse("SK et AK echanges", parQuestion(72, 2),
    c => { c.controle.faits[0][3] = '24/5'; });
  pousse("R pris comme projete de I sur (AB)", parQuestion(72, 3),
    c => { c.controle.points.R = ['proj', 'I', 'A', 'B']; });
  pousse("RI annonce 3", parQuestion(72, 4),
    c => { c.controle.faits[0][3] = '3'; });
  pousse("le rapport de Thales pris a 1/2", parQuestion(72, 4),
    c => { c.controle.faits[3][5] = '1/2'; });
  pousse("KJ annonce AS au lieu de AS/2", parQuestion(72, 5),
    c => { c.etapes[2][1] = 'KJ = AS'; });
  // Visée corrigée : la question 7 ne parle pas de I, la déplacer n'y touchait
  // rien. C'est le calcul de RI qui en dépend, et là elle mord.
  pousse("I pris milieu de [AB] au lieu de [AO]", parQuestion(72, 4),
    c => { c.controle.points.I = ['milieu', 'A', 'B']; });
  pousse("G declare centre de gravite apres deplacement", parQuestion(72, 7),
    c => { c.controle.faits[0] = ['centre-gravite', 'J', 'A', 'S', 'B']; });
  pousse("BG pris egal a BJ", parQuestion(72, 8),
    c => { c.controle.faits[1][3] = '2√13'; });
  pousse("E construit parallele a (AB) au lieu de (AS)", parQuestion(72, 9),
    c => { c.controle.points.Z = ['translate', 'B', 'A', 'B']; });
  pousse("OE annonce 10", parQuestion(72, 10),
    c => { c.controle.faits[1][3] = '10'; });
  pousse("F declare orthocentre du mauvais triangle", parQuestion(72, 11),
    c => { c.controle.faits[0] = ['orthocentre', 'F', 'A', 'S', 'B']; });
  pousse("H pris projete sur (AS)", parQuestion(72, 11),
    c => { c.controle.points.H = ['proj', 'F', 'A', 'S']; });

  // ── التمرين 3 — F = 2E + 12, et les deux coquilles du livre ────────────
  pousse("la borne de J decalee", parQuestion(73, 0),
    c => { c.controle.claims[0][1] = '-2/3'; });
  pousse("2√2 declare plus grand que 5", parQuestion(73, 2),
    c => { c.etapes[3][1] = '5 < 2√2'; });
  pousse("E en 1 - √3 decale", parQuestion(73, 3),
    c => { c.controle.claims[0][1] = '-9/2 + 2√3'; });
  pousse("F = 2E + 12 remplace par 2E + 15", parQuestion(73, 4),
    c => { c.controle.claims[0][0] = '2E + 15'; });
  pousse("2E + 16 n est plus un carre", parQuestion(73, 5),
    c => { c.controle.claims[0][0] = '2E + 15'; });
  pousse("factorisation de F avec les racines echangees", parQuestion(73, 5),
    c => { c.controle.claims[1][1] = '(x + 1)(x - 3)'; });
  pousse("le facteur commun (x + 3) mal sorti", parQuestion(73, 6),
    c => { c.controle.claims[1][1] = '(x + 3)(x + 1)'; });
  pousse("l aire du triangle DHC prise avec DH = x", parQuestion(73, 7),
    c => { c.controle.claims[2][0] = 'x(x + 4)/2'; });
  pousse("S calculee sans retrancher le rectangle", parQuestion(73, 8),
    c => { c.controle.derives.S = '(x + 4)^2 - (2x + 8) - (x + 2)(x + 4)/2'; });
  pousse("x = 4 au lieu de 3 pour S = 23/2", parQuestion(73, 9),
    c => { c.controle.env.x = '4'; });
  pousse("l aire grise prise sur le triangle HMC", parQuestion(73, 9),
    c => { c.controle.faits[0] = ['aire', 'H', 'M', 'C', '23/2']; });
  // LA COQUILLE DU LIVRE : « A و M و I » — ces trois points ne sont jamais alignés.
  pousse("l alignement A, M, I du livre au lieu de A, N, I", parQuestion(73, 10),
    c => { c.controle.faits[0] = ['alignes', 'A', 'M', 'I']; });
  pousse("CI pris a 5/2", parQuestion(73, 10),
    c => { c.controle.points.I = ['point', 'x + 4 - 5/2', 'x + 4']; });
  // LA SECONDE COQUILLE : S = 11/2, qui correspond à F = 0, pas à l'alignement.
  pousse("S = 11/2, la valeur du livre", parQuestion(73, 11),
    c => { c.controle.faits[0][5] = '11/2'; });
  pousse("x^2 + 2x annonce 3", parQuestion(73, 11),
    c => { c.controle.claims[0][1] = '3'; });

  // ── التمرين 4 — la relation métrique, puis l'équilatéral ───────────────
  pousse("la relation metrique lue AH^2 = BH + CH", parQuestion(74, 0),
    c => { c.etapes[2][1] = 'x + √3 = 9'; });
  pousse("CH deplace a 2√3", parQuestion(74, 0),
    c => { c.controle.points.C = ['point', '-2√3', '0']; });
  pousse("l aire prise sans diviser par 2", parQuestion(74, 1),
    c => { c.controle.claims[1][1] = '12√3'; });
  pousse("BC annonce 3√3", parQuestion(74, 1),
    c => { c.controle.faits[0][3] = '3√3'; });
  pousse("la division par 3 mal faite", parQuestion(74, 2),
    c => { c.controle.claims[1][1] = '9√3'; });
  pousse("AB annonce 2√13", parQuestion(74, 3),
    c => { c.controle.faits[0][3] = '2√13'; });
  pousse("AC pris egal a AB", parQuestion(74, 3),
    c => { c.controle.faits[1][3] = '6'; });
  pousse("HI pris egal a AB", parQuestion(74, 4),
    c => { c.etapes[2][1] = 'HI = AB'; });
  pousse("A deplace : le triangle AHI n est plus equilateral", parQuestion(74, 5),
    c => { c.controle.points.A = ['point', '0', '4']; });
  pousse("HK annonce 3/2", parQuestion(74, 5),
    c => { c.controle.faits[2][3] = '3/2'; });
  // Visée corrigée : prendre AH→ ou HA→ donne LA MÊME droite parallèle, donc le
  // même L — ce n'était pas une falsification. La vraie est de changer de
  // direction : parallèle à (BC) au lieu de (AH).
  pousse("L pris sur la parallele a (BC) au lieu de (AH)", parQuestion(74, 6),
    c => { c.controle.points.Z = ['translate', 'I', 'B', 'C']; });
  pousse("ALIH declare losange dans le mauvais ordre", parQuestion(74, 6),
    c => { c.controle.faits[0] = ['losange', 'A', 'I', 'L', 'H']; });
  pousse("E pris symetrique de L par rapport a I", parQuestion(74, 7),
    c => { c.controle.points.E = ['sym', 'L', 'I']; });
  pousse("IJ pris egal a AE", parQuestion(74, 7),
    c => { c.controle.faits[4][3] = '3'; });

  // ══ LA SÉANCE 8 ════════════════════════════════════════════════════════
  // ── التمرين 1 — l'expression, puis les trois moyennes ──────────────────
  pousse("A en 3/4 decale", parQuestion(81, 0), c => { c.controle.claims[0][1] = '1'; });
  pousse("le signe du terme median oublie", parQuestion(81, 1),
    c => { c.controle.claims[0][1] = '-3/2'; });
  pousse("le 1 remplace par 2 : le carre ne se ferme plus", parQuestion(81, 2),
    c => { c.controle.claims[0][0] = 'A + 2'; });
  pousse("factorisation de A avec les racines echangees", parQuestion(81, 3),
    c => { c.controle.claims[0][1] = '(2x + 5/2)(2x + 1/2)'; });
  pousse("le double produit oublie dans le developpement", parQuestion(81, 4),
    c => { c.controle.claims[0][1] = '1/a + 1/b'; });
  pousse("√a √b annonce √(a + b)", parQuestion(81, 4),
    c => { c.controle.claims[1][1] = '√(a + b)'; });
  pousse("la moyenne harmonique mal ecrite", parQuestion(81, 5),
    c => { c.controle.claims[0][1] = 'a b/(a + b)'; });
  pousse("le developpement de (√a - √b)^2 faux", parQuestion(81, 6),
    c => { c.controle.claims[0][1] = 'a + b - √(a b)'; });
  pousse("la proportion faussee : m h annonce differe de n^2", parQuestion(81, 7),
    c => { c.controle.claims[0][1] = 'n'; });
  pousse("m h annonce a + b", parQuestion(81, 7), c => { c.controle.claims[1][1] = 'a + b'; });

  // ── التمرين 3 — l'équilatéral qui devient rectangle ────────────────────
  pousse("O deplace : OBC n est plus equilateral", parQuestion(83, 0),
    c => { c.controle.points.O = ['point', '2', '3√3']; });
  pousse("BI annonce 4/3", parQuestion(83, 0), c => { c.controle.faits[0][3] = '4/3'; });
  pousse("A pris symetrique de C par rapport a O", parQuestion(83, 1),
    c => { c.controle.points.A = ['sym', 'C', 'O']; });
  pousse("l angle droit annonce en O", parQuestion(83, 1),
    c => { c.controle.faits[0] = ['rectangle-en', 'O', 'A', 'B']; });
  pousse("I place au milieu de [BC]", parQuestion(83, 2),
    c => { c.controle.points.I = ['milieu', 'B', 'C']; });
  pousse("le rapport des deux tiers annonce 1/3", parQuestion(83, 2),
    c => { c.controle.faits[2][5] = '1/3'; });
  pousse("AMC declare rectangle en A", parQuestion(83, 3),
    c => { c.controle.faits[0] = ['rectangle-en', 'A', 'M', 'C']; });
  pousse("M declare milieu de [AC]", parQuestion(83, 4),
    c => { c.controle.faits[0] = ['milieu', 'M', 'A', 'C']; });
  pousse("N pris milieu de [OC]", parQuestion(83, 5),
    c => { c.controle.faits[0] = ['milieu', 'N', 'O', 'C']; });
  pousse("H declare orthocentre du mauvais triangle", parQuestion(83, 6),
    c => { c.controle.faits[0] = ['orthocentre', 'H', 'O', 'B', 'C']; });
  pousse("J pris milieu de [OB]", parQuestion(83, 6),
    c => { c.controle.points.J = ['milieu', 'O', 'B']; });
  pousse("CK annonce 4", parQuestion(83, 7), c => { c.controle.faits[4][3] = '4'; });
  pousse("le rayon du cercle de centre G annonce 4", parQuestion(83, 8),
    c => { c.controle.faits[1][3] = '4'; });
  pousse("G pris milieu de [CK]", parQuestion(83, 8),
    c => { c.controle.points.G = ['milieu', 'C', 'K']; });

  // ── التمرين 5 — la factorisation cachée ────────────────────────────────
  pousse("la factorisation de 3√2 - √6 fausse", parQuestion(85, 0),
    c => { c.controle.claims[0][1] = '√2(3 + √3)'; });
  pousse("a decale", parQuestion(85, 1), c => { c.controle.claims[0][1] = '3 + 3√5'; });
  pousse("b decale", parQuestion(85, 1), c => { c.controle.claims[1][1] = '2 + 2√3'; });
  pousse("le facteur commun du numerateur faux", parQuestion(85, 1),
    c => { c.controle.claims[2][1] = '(1 + √3)(3 + √6)'; });
  pousse("le carre de 2√5 faux", parQuestion(85, 2), c => { c.controle.claims[1][1] = '10'; });
  pousse("la difference a - b faussee", parQuestion(85, 3),
    c => { c.controle.claims[0][1] = '1 - 2√3 - 3√5'; });
  pousse("la decomposition en deux negatifs fausse", parQuestion(85, 3),
    c => { c.controle.claims[1][1] = '(2√3 - 2√5) + (1 + √5)'; });
  pousse("le facteur commun de a faux", parQuestion(85, 4),
    c => { c.controle.claims[0][1] = '3(1 + √5)'; });
  pousse("3b^2 mal calcule", parQuestion(85, 5), c => { c.controle.claims[0][1] = '48 + 24√3'; });
  pousse("3a^2 mal calcule", parQuestion(85, 5), c => { c.controle.claims[1][1] = '162 + 54√5'; });

  // ══ LA SÉANCE 9 ════════════════════════════════════════════════════════
  // ── التمرين 1 — la valeur absolue sous le radical, et les sens d'inégalité ──
  pousse("la valeur absolue levee a l envers", parQuestion(91, 0),
    c => { c.controle.claims[1][1] = '√2 - √3'; });
  pousse("a decale", parQuestion(91, 0),
    c => { c.controle.claims[0][1] = '2√3 + √2'; });
  pousse("le conjugue mal choisi", parQuestion(91, 1),
    c => { c.controle.claims[0][1] = '√3 + √2'; });
  pousse("√48 sorti en 3√3", parQuestion(91, 2),
    c => { c.etapes[2][1] = '√48 = 3√3'; });
  pousse("b decale", parQuestion(91, 2),
    c => { c.controle.claims[0][1] = '√2 + 3√3'; });
  pousse("l encadrement de √3 pris a 1,6 et 1,7", parQuestion(91, 3),
    c => { c.etapes[7][1] = '9/5 < √3'; });
  pousse("le carre de 1,5 mal calcule", parQuestion(91, 3),
    c => { c.controle.claims[1][1] = '9/2'; });
  pousse("la borne inferieure de a fausse", parQuestion(91, 4),
    c => { c.controle.claims[0][1] = '2'; });
  pousse("le retournement oublie sur -√2", parQuestion(91, 4),
    c => { c.etapes[3][1] = '-7/5 < -√2'; });
  pousse("la multiplication par -3 ne retourne pas", parQuestion(91, 5),
    c => { c.etapes[1][1] = '-3√3 < -27/5'; });
  pousse("la borne superieure de b fausse", parQuestion(91, 5),
    c => { c.controle.claims[1][1] = '-18/25'; });
  pousse("les bornes du produit prises du meme cote", parQuestion(91, 6),
    c => { c.controle.claims[0][0] = '19/10 × (-4)'; });
  pousse("le produit ab mal developpe", parQuestion(91, 6),
    c => { c.controle.claims[2][1] = '5√6 + 20'; });
  pousse("a + b annonce +√3", parQuestion(91, 7),
    c => { c.controle.claims[0][1] = '√3'; });
  pousse("l oppose de a mal ecrit", parQuestion(91, 7),
    c => { c.controle.claims[1][1] = '2√3 - √2'; });
  pousse("le carre de 2√3 - √2 faux", parQuestion(91, 8),
    c => { c.controle.claims[0][1] = '14 + 4√6'; });
  pousse("la borne comparee a -3 dans le mauvais sens", parQuestion(91, 8),
    c => { c.etapes[5][1] = '√2 - 2√3 < -3'; });

  // ── التمرين 2 — le trapèze, et les deux médianes ───────────────────────
  pousse("B deplace : le triangle BDC n est plus isocele", parQuestion(92, 0),
    c => { c.controle.points.B = ['point', '5', '8']; });
  pousse("IK pris egal a la demi-somme mal faite", parQuestion(92, 0),
    c => { c.controle.faits[0][3] = '18'; });
  pousse("K annonce milieu de [AB]", parQuestion(92, 0),
    c => { c.controle.faits[1] = ['milieu', 'K', 'A', 'B']; });
  pousse("AL annonce 4", parQuestion(92, 1),
    c => { c.controle.faits[0][3] = '4'; });
  pousse("le rapport de Thales inverse", parQuestion(92, 1),
    c => { c.controle.faits[3][5] = '2'; });
  pousse("N pris ailleurs sur (DC)", parQuestion(92, 2),
    c => { c.controle.points.N = ['point', '5', '0']; });
  pousse("le rayon du cercle annonce 6", parQuestion(92, 2),
    c => { c.controle.faits[4][3] = '6'; });
  pousse("M place au milieu de [ID]", parQuestion(92, 3),
    c => { c.controle.points.M = ['milieu', 'I', 'D']; });
  pousse("le rapport MI/MD annonce 2", parQuestion(92, 3),
    c => { c.controle.faits[2][5] = '2'; });
  pousse("B, M, N declares alignes apres deplacement de M", parQuestion(92, 4),
    c => { c.controle.points.M = ['point', '5', '8/3']; });
  // LA COQUILLE DU LIVRE : BM = 16/8, alors que BN = 8 et BM en vaut les deux tiers.
  pousse("BM = 16/8, le nombre du livre", parQuestion(92, 5),
    c => { c.controle.faits[0][3] = '16/8'; });
  pousse("BM pris egal au tiers de BN", parQuestion(92, 5),
    c => { c.controle.faits[2][5] = '1/3'; });
  pousse("P pris ailleurs sur (BD)", parQuestion(92, 6),
    c => { c.controle.points.P = ['point', '3', '4']; });
  pousse("O declare orthocentre du mauvais triangle", parQuestion(92, 6),
    c => { c.controle.faits[0] = ['orthocentre', 'O', 'A', 'B', 'C']; });
  pousse("NS annonce 12", parQuestion(92, 7),
    c => { c.controle.faits[0][3] = '12'; });
  pousse("S pris sur (BD) au lieu de (BC)", parQuestion(92, 7),
    c => { c.controle.points.S = ['inter', 'O', 'D', 'B', 'D']; });

  // ── التمرين 4 — l'angle droit en B qui se propage ──────────────────────
  pousse("AN change : BI et BJ ne valent plus 4", parQuestion(94, 0),
    c => { c.controle.points.N = ['point', '0', '-3√2']; });
  pousse("IJ pris egal a la demi-difference des bases", parQuestion(94, 0),
    c => { c.controle.faits[1][3] = '2√2'; });
  pousse("le triangle BIJ declare rectangle en I", parQuestion(94, 0),
    c => { c.controle.faits[0] = ['rectangle-en', 'I', 'B', 'J']; });
  pousse("DI annonce 6", parQuestion(94, 1),
    c => { c.controle.faits[0][3] = '6'; });
  pousse("C place a JC = 4", parQuestion(94, 1),
    c => { c.controle.points.C = ['point', '6√2', '-4√2']; });
  pousse("G pris au milieu de [IJ]", parQuestion(94, 2),
    c => { c.controle.points.G = ['milieu', 'I', 'J']; });
  pousse("le rapport IG/JG annonce 1/2", parQuestion(94, 2),
    c => { c.controle.faits[2][5] = '1/2'; });
  pousse("KG pris egal a BK", parQuestion(94, 3),
    c => { c.controle.faits[0][3] = '2√5'; });
  pousse("IM annonce 4√2", parQuestion(94, 3),
    c => { c.controle.faits[2][3] = '4√2'; });
  pousse("BH calcule sans rationaliser correctement", parQuestion(94, 4),
    c => { c.controle.faits[0][3] = '8√5'; });
  pousse("H pris projete sur (BM)", parQuestion(94, 4),
    c => { c.controle.points.H = ['proj', 'B', 'B', 'M']; });
  pousse("KJ annonce 4", parQuestion(94, 5),
    c => { c.controle.faits[4][3] = '4'; });
  pousse("F pris sur la perpendiculaire a (IM) par J", parQuestion(94, 5),
    c => { c.controle.points.W = ['normale', 'J', 'I', 'M']; });
  pousse("K declare orthocentre de BMJ", parQuestion(94, 6),
    c => { c.controle.faits[0] = ['orthocentre', 'K', 'B', 'M', 'J']; });
  pousse("L declare sur le cercle apres changement de rayon", parQuestion(94, 7),
    c => { c.controle.faits[2][3] = '5'; });
  pousse("L pris sur (MK) au lieu de (MF)", parQuestion(94, 7),
    c => { c.controle.points.L = ['inter', 'B', 'K', 'M', 'K']; });

  // ══ LA SÉANCE 10 ═══════════════════════════════════════════════════════
  //
  // ── التمرين 1 — deux nombres si petits que la calculette les confond ───
  //
  // La PREMIÈRE est la plus importante de la séance : elle rejoue le
  // dénominateur (2 - √3) tel qu'il est IMPRIMÉ dans le livre. Si le
  // validateur l'accepte, alors la onzième coquille n'a jamais été trouvée —
  // c'est la correction elle-même qui serait invérifiée.
  pousse("b avec le 1/(2 - √3) imprime dans le livre", parQuestion(101, 0),
    c => { c.controle.env.b = "1/(2 - √3) - 3/(2 + √3) + 1"; });
  pousse("√24 sorti en 3√6", parQuestion(101, 0),
    c => { c.etapes[1][1] = "√24 = 3√6"; });
  pousse("a decale d une unite", parQuestion(101, 0),
    c => { c.controle.claims[0][1] = "8 - 4√3"; });
  pousse("le produit ab decale", parQuestion(101, 1),
    c => { c.controle.claims[0][1] = "26√3 - 44"; });
  pousse("48 et 49 compares a l envers", parQuestion(101, 1),
    c => { c.etapes[3][1] = "49 < 48"; });
  pousse("b - a lu 6√3 - 11", parQuestion(101, 2),
    c => { c.controle.claims[0][1] = "6√3 - 11"; });
  pousse("b - 1 confondu avec b lui-meme", parQuestion(101, 2),
    c => { c.controle.claims[1][1] = "2√3 - 3"; });
  pousse("a²b et ab² echanges", parQuestion(101, 3),
    c => { c.etapes[4][1] = "a × b^2 < a^2 × b"; });
  pousse("a²b decale d une unite", parQuestion(101, 3),
    c => { c.controle.claims[0][1] = "362√3 - 626"; });
  pousse("b/a mal rationalise", parQuestion(101, 4),
    c => { c.controle.claims[0][1] = "3 - 2√3"; });
  pousse("a/b ecrit sans le 3 du denominateur", parQuestion(101, 4),
    c => { c.controle.claims[1][1] = "2√3 - 3"; });
  pousse("a + b decale", parQuestion(101, 5),
    c => { c.controle.claims[1][1] = "4 - 3√3"; });
  pousse("le cote du carre pris egal a √3 + 1", parQuestion(101, 5),
    c => { c.controle.claims[2][0] = "(√3 + 1)^2"; });
  pousse("les deux denominateurs compares a l envers", parQuestion(101, 6),
    c => { c.etapes[8][1] = "4 - 3b < 2 - 3a"; });
  pousse("2 - 3a calcule sans le 2", parQuestion(101, 6),
    c => { c.controle.claims[0][1] = "12√3 - 21"; });
  pousse("b/a annonce 3 - 2√3 au dernier volet", parQuestion(101, 7),
    c => { c.controle.claims[0][1] = "3 - 2√3"; });

  // ── التمرين 3 — l'expression et le triangle qui la refabrique ──────────
  pousse("x pris a l autre racine sans le signe", parQuestion(103, 0),
    c => { c.controle.env.x = "(3√2 + √6)/2"; });
  pousse("x² calcule sans le double produit", parQuestion(103, 0),
    c => { c.controle.claims[1][1] = "6"; });
  pousse("9/2 remplace par 7/2 : le carre ne se ferme plus", parQuestion(103, 1),
    c => { c.controle.claims[0][1] = "(x + √6/2)^2 - 7/2"; });
  pousse("factorisation avec le second facteur mal signe", parQuestion(103, 2),
    c => { c.controle.claims[0][1] = "(x + (√6 - 3√2)/2)(x - (√6 + 3√2)/2)"; });
  pousse("le produit des racines annonce +3", parQuestion(103, 3),
    c => { c.controle.claims[1][1] = "3"; });
  pousse("B deplace : AB ne vaut plus √3", parQuestion(103, 4),
    c => { c.controle.points.B = ['point', '√2', '0']; });
  pousse("AH annonce √3", parQuestion(103, 4),
    c => { c.controle.faits[0][3] = '√3'; });
  pousse("M confondue avec C : le majorant du cadre tombe", parQuestion(103, 5),
    c => { c.controle.env.x = "√6"; });
  pousse("MK pris egal a AH", parQuestion(103, 6),
    c => { c.controle.faits[2][3] = '√2'; });
  pousse("K pris comme projete de M sur (AB)", parQuestion(103, 6),
    c => { c.controle.points.K = ['proj', 'M', 'A', 'B']; });
  pousse("BK² ecrit sans le tiers", parQuestion(103, 7),
    c => { c.controle.faits[1][3] = '2x^2 + 2√6 × x + 3'; });
  pousse("BK annonce √6", parQuestion(103, 7),
    c => { c.controle.faits[2][3] = '√6'; });

  // ── التمرين 4 — l'équilatéral qui devient rectangle ────────────────────
  pousse("le carre de -√3 pris negatif", parQuestion(104, 0),
    c => { c.controle.claims[1][1] = "-3"; });
  pousse("A decale d une unite", parQuestion(104, 0),
    c => { c.controle.claims[0][1] = "3 + (10/3)√3"; });
  pousse("25/9 laisse en 16/9 dans la completion", parQuestion(104, 1),
    c => { c.controle.claims[0][1] = "(x - 5/3)^2 - 25/9"; });
  pousse("un facteur decale", parQuestion(104, 2),
    c => { c.controle.claims[0][1] = "(x - 3)(x - 1/2)"; });
  // AH pris égal au côté : le triangle cesse d'être équilatéral, et c'est
  // TOUTE la question 3 qui s'écroule — AB = 2x - 2 n'a plus de raison d'être.
  pousse("AH pris egal au cote : ABD n est plus equilateral", parQuestion(104, 3),
    c => { c.controle.env.h = "2x - 2"; });
  pousse("AB annonce 2x - 1", parQuestion(104, 3),
    c => { c.controle.faits[0][3] = '2x - 1'; });
  pousse("C pris au milieu de [BD] au lieu du symetrique de B", parQuestion(104, 4),
    c => { c.controle.points.C = ['milieu', 'B', 'D']; });
  pousse("BC annonce 4", parQuestion(104, 4),
    c => { c.controle.faits[5][3] = '4'; });
  pousse("AC lu √3(x - 1)", parQuestion(104, 5),
    c => { c.controle.faits[0][3] = '√3(x - 1)'; });
  pousse("la racine 1/3 acceptee malgre x > 1", parQuestion(104, 5),
    c => { c.etapes[7][1] = "1 < 1/3"; });

  // ── التمرين 5 — le nombre d'or, et Thalès qui le retrouve ──────────────
  pousse("(√5 - 1)² developpe sans le double produit", parQuestion(105, 0),
    c => { c.controle.claims[0][1] = "6"; });
  pousse("b lu (√5 - 1)/2", parQuestion(105, 1),
    c => { c.controle.claims[0][1] = "(√5 - 1)/2"; });
  pousse("le carre sous le radical pris a l envers", parQuestion(105, 1),
    c => { c.controle.claims[1][1] = "((√5 + 1)/2)^2"; });
  pousse("((√10 - √2)/2)² pris egal a 3 + √5", parQuestion(105, 2),
    c => { c.controle.claims[1][1] = "3 + √5"; });
  pousse("le conjugue mal choisi", parQuestion(105, 2),
    c => { c.controle.claims[2][1] = "(√5 - 1)/4"; });
  pousse("ab annonce 2", parQuestion(105, 3),
    c => { c.controle.claims[0][1] = "2"; });
  pousse("a et b declares opposes au lieu d inverses", parQuestion(105, 3),
    c => { c.controle.claims[1][1] = "-b"; });
  pousse("a declare plus grand que 1", parQuestion(105, 4),
    c => { c.etapes[4][1] = "1 < a"; });
  pousse("a² annonce (3 + √5)/2", parQuestion(105, 5),
    c => { c.controle.claims[0][1] = "(3 + √5)/2"; });
  pousse("b - a² annonce √5 + 1", parQuestion(105, 5),
    c => { c.controle.claims[1][1] = "√5 + 1"; });
  pousse("a + b lu 2√5", parQuestion(105, 6),
    c => { c.controle.claims[0][1] = "2√5"; });
  pousse("a² et 1 - √5a declares egaux au lieu d opposes", parQuestion(105, 7),
    c => { c.controle.claims[2][1] = "1 - √5 × a"; });
  // p pris égal à a : la figure NE PROTESTE PAS — a est l'autre racine de
  // p² - √5 p + 1 = 0, donc Thalès tient encore. C'est la condition p > 1 qui
  // tranche, et c'est elle que la falsification doit faire tomber.
  pousse("p pris egal a a, l autre racine", parQuestion(105, 8),
    c => { c.controle.env.p = "(√5 - 1)/2"; });
  pousse("J place a AJ = 2 : le parallelisme tombe", parQuestion(105, 8),
    c => { c.controle.points.J = ['point', '0', '2']; });
  pousse("AI annonce p - √5", parQuestion(105, 8),
    c => { c.controle.faits[6][3] = 'p - √5'; });

  // ══ LA SÉANCE 11 ═══════════════════════════════════════════════════════
  //
  // ── التمرين 1 — les couples de chiffres ────────────────────────────────
  pousse("3240 remplace par 3260, qui n est plus multiple de 15", parQuestion(111, 0),
    c => { c.controle.claims[2][0] = "3260/15"; });
  pousse("la somme des chiffres decalee", parQuestion(111, 0),
    c => { c.controle.claims[0][1] = "8 + a"; });
  pousse("un a de trop dans le cas b = 5 : 3245 n est pas multiple de 15",
    parQuestion(111, 0), c => { c.controle.claims[5][0] = "3245/15"; });
  pousse("36084 lu 36088", parQuestion(111, 1),
    c => { c.controle.claims[4][0] = "36088/12"; });
  pousse("la somme du 36a8b decalee", parQuestion(111, 1),
    c => { c.controle.claims[0][1] = "18 + a + b"; });
  pousse("82 pris pour un multiple de 4 : 36182 accepte", parQuestion(111, 1),
    c => { c.controle.claims[1][0] = "36182/12"; });
  pousse("3150 lu 3152", parQuestion(111, 2),
    c => { c.controle.claims[1][0] = "3152/6"; });
  pousse("un impair accepte : 3153 declare multiple de 6", parQuestion(111, 2),
    c => { c.controle.claims[2][0] = "3153/6"; });
  pousse("la somme du 3a5b decalee", parQuestion(111, 2),
    c => { c.controle.claims[0][1] = "9 + a + b"; });

  // ── التمرين 2 — les grands entiers ─────────────────────────────────────
  //
  // LA PLUS IMPORTANTE DE LA SÉANCE : elle rejoue le 3^204 IMPRIMÉ. Le
  // nombre vaut alors 82 × 3^200, et 82 = 2 × 41 ne contient pas de 7 — 42
  // ne divise pas. Si le validateur l'acceptait, c'est qu'il déborderait en
  // silence au lieu de calculer, et la treizième coquille serait invisible.
  pousse("le 3^204 imprime dans le livre, declare divisible par 42", parQuestion(112, 5),
    c => { c.controle.divisibles[0][0] = "9^100 + 3^204"; });
  pousse("le facteur annonce 82 au lieu de 28", parQuestion(112, 5),
    c => { c.controle.entiers[1][1] = "82 × 3^200"; });
  pousse("1 + 27 lu 26", parQuestion(112, 5),
    c => { c.etapes[3][1] = "1 + 27 = 26"; });
  pousse("25^50 lu 5^50", parQuestion(112, 0),
    c => { c.controle.entiers[0][1] = "5^50"; });
  pousse("le facteur commun mal sorti : 125 - 2 devient 121", parQuestion(112, 0),
    c => { c.controle.entiers[1][1] = "121 × 5^100"; });
  pousse("le nombre declare divisible par 7", parQuestion(112, 0),
    c => { c.controle.divisibles[0][1] = 7; });
  pousse("243 lu 3^4", parQuestion(112, 1),
    c => { c.etapes[1][1] = "243 = 3^4"; });
  pousse("l exposant de 243^1001 decale", parQuestion(112, 1),
    c => { c.controle.entiers[1][1] = "3^5006"; });
  pousse("le nombre declare divisible par 4", parQuestion(112, 1),
    c => { c.controle.divisibles[0][1] = 4; });
  pousse("8^666 lu 2^1332", parQuestion(112, 2),
    c => { c.controle.entiers[0][1] = "2^1332"; });
  pousse("1 + 20 lu 20", parQuestion(112, 2),
    c => { c.etapes[4][1] = "1 + 20 = 20"; });
  // 8 divise évidemment 21 × 2^1998 — viser 8 ne disait rien. Le facteur qui
  // MANQUE est le 5.
  pousse("le nombre declare divisible par 5", parQuestion(112, 2),
    c => { c.controle.divisibles[1][1] = 5; });
  // 45 divise bien 10 × 3^2013 (le 9 vient de 3^2013, le 5 de 10) : viser 45
  // ne mordait pas. Le 10 ne porte qu'UN seul facteur 2, donc pas 4.
  pousse("3^2013 + 3^2015 declare divisible par 4", parQuestion(112, 3),
    c => { c.controle.divisibles[0][1] = 4; });
  pousse("le facteur 10 lu 4", parQuestion(112, 3),
    c => { c.controle.entiers[0][1] = "4 × 3^2013"; });
  pousse("9^1020 lu 3^1020", parQuestion(112, 4),
    c => { c.controle.entiers[0][1] = "3^1020"; });
  pousse("125 + 7 lu 130", parQuestion(112, 6),
    c => { c.etapes[4][1] = "125 + 7 = 130"; });
  pousse("le nombre declare divisible par 13", parQuestion(112, 6),
    c => { c.controle.divisibles[0][1] = 13; });

  // ── التمرين 3 — l'expression et le triangle 4, 2√5, 6 ──────────────────
  pousse("a decale d une unite en 4 - √5", parQuestion(113, 0),
    c => { c.controle.claims[0][1] = "1"; });
  pousse("le double produit du carre oublie", parQuestion(113, 0),
    c => { c.controle.claims[1][1] = "21"; });
  pousse("la difference a - (x² + 3) lue 8x - 8", parQuestion(113, 1),
    c => { c.controle.claims[0][1] = "8x - 8"; });
  pousse("la valeur 5/2 - √2 remplacee par 5/2 - √8, qui est plus petite que 1",
    parQuestion(113, 2), c => { c.controle.env.x = "5/2 - √8"; });
  pousse("factorisation avec les racines echangees", parQuestion(113, 3),
    c => { c.controle.claims[0][1] = "(x - 4 - √5)(x + 4 - √5)"; });
  pousse("la racine 4 + √5 decalee", parQuestion(113, 4),
    c => { c.controle.env.x = "4 + √6"; });
  pousse("AC ramene au 25 imprime : le triangle n existe plus", parQuestion(113, 5),
    c => { c.controle.points.C = ['point', '0', '25']; });
  pousse("le triangle declare rectangle en B", parQuestion(113, 5),
    c => { c.controle.faits[0] = ['rectangle-en', 'B', 'A', 'C']; });
  pousse("AN calcule sans le demi", parQuestion(113, 6),
    c => { c.controle.faits[2][3] = '√5(4 - x)'; });
  pousse("M place a AM = x au lieu de BM = x", parQuestion(113, 6),
    c => { c.controle.points.M = ['point', 'x', '0']; });
  pousse("l aire calculee sans le demi : √5/2 au lieu de √5/4", parQuestion(113, 7),
    c => { c.controle.faits[0][4] = '(√5/2)(4 - x)^2'; });
  pousse("N pris sur la parallele a (AB) au lieu de (BC)", parQuestion(113, 7),
    c => { c.controle.points.Z = ['translate', 'M', 'A', 'B']; });
  pousse("la borne superieure annoncee 5√5", parQuestion(113, 8),
    c => { c.controle.claims[1][1] = "5√5"; });
  pousse("le 5√5 imprime au lieu de 5√5/4", parQuestion(113, 10),
    c => { c.controle.faits[0][4] = '5√5'; });

  // ── التمرين 4 — deux expressions et leur facteur commun ────────────────
  pousse("A developpe en 3x² + 8x + 3", parQuestion(114, 0),
    c => { c.controle.claims[0][1] = "3x^2 + 8x + 3"; });
  pousse("A en 2 - √3 decale", parQuestion(114, 1),
    c => { c.controle.claims[0][1] = "34 - 21√3"; });
  pousse("B factorise avec le mauvais second facteur", parQuestion(114, 2),
    c => { c.controle.claims[1][1] = "(2x + 1)(x - 3)"; });
  pousse("A factorise avec 3x + 1", parQuestion(114, 3),
    c => { c.controle.claims[0][1] = "(x + 3)(3x + 1)"; });
  pousse("A - B lu (x + 3)(x + 2)", parQuestion(114, 4),
    c => { c.controle.claims[0][1] = "(x + 3)(x + 2)"; });
  pousse("la racine -3 decalee", parQuestion(114, 5),
    c => { c.controle.env.x = "-2"; });

  // ── التمرين 5 — le rectangle et la diagonale ───────────────────────────
  pousse("A en (√3 - 1)/2 decale", parQuestion(115, 0),
    c => { c.controle.claims[0][1] = "4√3 - 8"; });
  pousse("le -7 lu +9 : la forme canonique ne se ferme plus", parQuestion(115, 1),
    c => { c.controle.claims[0][1] = "(2x + 3)^2 - 9"; });
  pousse("un facteur decale", parQuestion(115, 2),
    c => { c.controle.claims[0][1] = "(2x + 7)(2x + 1)"; });
  // La hauteur du rectangle N'EST PAS une donnée : elle vaut AE = AB - EB.
  // La poser autrement, c'est casser la donnée BC = AE de l'énoncé.
  pousse("la hauteur prise egale a x + 1 : BC n est plus AE", parQuestion(115, 3),
    c => { c.controle.env.h = "x + 1"; });
  pousse("BG annonce x + 2", parQuestion(115, 3),
    c => { c.controle.faits[0][3] = 'x + 2'; });
  // Déplacer la perpendiculaire de B vers C ne changeait RIEN : B et C ont la
  // même abscisse, donc c'est la même droite. On vise ce qui porte vraiment —
  // la position de E, lue AE = x + 1 au lieu de EB = x + 1.
  pousse("E place a AE = x + 1 au lieu de EB = x + 1", parQuestion(115, 3),
    c => { c.controle.points.E = ['point', 'x + 1', 'h']; });
  pousse("l aire de DCG calculee sans le demi", parQuestion(115, 4),
    c => { c.controle.faits[1][4] = '(2x + 3)^2'; });
  pousse("la racine -7/2 acceptee malgre x > 0", parQuestion(115, 4),
    c => { c.controle.env.x = "-7/2"; });

  // ── التمرين 6 — le diamètre et tout ce qui en découle ──────────────────
  pousse("C place a BC = 5 : OBC n est plus equilateral", parQuestion(116, 0),
    c => { c.controle.points.C = ['point', '15/8', '√231/8']; });
  pousse("le rayon annonce 8", parQuestion(116, 0),
    c => { c.controle.faits[1][3] = '8'; });
  pousse("AH annonce 2 : H confondu avec le milieu de [AO]", parQuestion(116, 1),
    c => { c.controle.faits[0][3] = '2'; });
  pousse("H pris projete de C sur (OC) : la hauteur disparait", parQuestion(116, 1),
    c => { c.controle.points.H = ['proj', 'C', 'O', 'C']; });
  pousse("le triangle declare rectangle en A", parQuestion(116, 2),
    c => { c.controle.faits[0] = ['rectangle-en', 'A', 'C', 'B']; });
  pousse("AC² annonce 64 : le BC² oublie", parQuestion(116, 3),
    c => { c.controle.faits[1][3] = '64'; });
  pousse("D pris sur la perpendiculaire menee par A", parQuestion(116, 4),
    c => { c.controle.points.W = ['normale', 'A', 'A', 'B']; });
  pousse("BD calcule avec le rapport inverse", parQuestion(116, 5),
    c => { c.controle.faits[0][3] = '8√3/4'; });
  pousse("E pris symetrique de C par rapport a B", parQuestion(116, 6),
    c => { c.controle.points.E = ['sym', 'C', 'B']; });
  pousse("le triangle OEB declare rectangle en B", parQuestion(116, 6),
    c => { c.controle.faits[0] = ['rectangle-en', 'B', 'O', 'E']; });
  pousse("G declare centre de gravite de OBE", parQuestion(116, 7),
    c => { c.controle.faits[0] = ['centre-gravite', 'G', 'O', 'B', 'E']; });
  pousse("le rapport GA/GC annonce 1/2", parQuestion(116, 7),
    c => { c.controle.faits[3][5] = '1/2'; });
  pousse("AE annonce 4√3, la longueur de AC", parQuestion(116, 8),
    c => { c.controle.faits[1][3] = '4√3'; });
  pousse("F pris sur (OG) au lieu de (BG)", parQuestion(116, 9),
    c => { c.controle.points.F = ['inter', 'O', 'G', 'A', 'E']; });
  pousse("OF annonce 8", parQuestion(116, 9),
    c => { c.controle.faits[2][3] = '8'; });

  // ══ LE LIVRE 2026 ══════════════════════════════════════════════════════
  pousse("R place a (1 + √5 ; 0) : OR change", parQuestion(2652, 0),
    c => { c.controle.points.R = ['point', '1 + √5', '0']; });
  pousse("H pris sur (RI) au lieu de (RJ)", parQuestion(2652, 1),
    c => { c.controle.points.H = ['inter', 'R', 'I', 'S', 'W']; });
  pousse("l identite (1+√5)²/2 lue 3 - √5", parQuestion(2652, 1),
    c => { c.controle.claims[0][1] = '3 - √5'; });
  pousse("CD annonce 4, comme AB", parQuestion(2652, 2),
    c => { c.controle.faits[1][3] = '4'; });
  pousse("le rapport AM/DM annonce 3/2", parQuestion(2652, 3),
    c => { c.controle.faits[2][5] = '3/2'; });
  pousse("N pris symetrique de M par rapport a A", parQuestion(2652, 4),
    c => { c.controle.points.N = ['sym', 'M', 'A']; });
  pousse("A declare centre de gravite de MNB", parQuestion(2652, 4),
    c => { c.controle.faits[0] = ['centre-gravite', 'A', 'M', 'N', 'B']; });
  pousse("A declare milieu de [PC]", parQuestion(2652, 5),
    c => { c.controle.faits[0] = ['milieu', 'A', 'P', 'C']; });
  pousse("E confondu avec P", parQuestion(2652, 6),
    c => { c.controle.points.E = ['point', '-2', '1']; });
  pousse("F pris sur la perpendiculaire menee par A", parQuestion(2652, 6),
    c => { c.controle.points.Z = ['normale', 'A', 'A', 'B']; });

  pousse("C place a (3 ; -2) : (AC) n est plus verticale", parQuestion(2642, 0),
    c => { c.controle.points.C = ['point', '3', '-2']; });
  pousse("K place sur (OJ) au lieu de (OI)", parQuestion(2642, 1),
    c => { c.controle.points.K = ['inter', 'A', 'C', 'O', 'J']; });
  pousse("L pris symetrique de A par rapport a O", parQuestion(2642, 2),
    c => { c.controle.points.L = ['sym', 'A', 'O']; });
  pousse("AOLB declare carre", parQuestion(2642, 2),
    c => { c.controle.faits[0] = ['carre', 'A', 'O', 'L', 'B']; });
  pousse("l aire du losange comptee sans le demi", parQuestion(2642, 3),
    c => { c.controle.claims[0][1] = '8√2'; });
  pousse("T pris sur la parallele a (OI)", parQuestion(2642, 4),
    c => { c.controle.points.W = ['translate', 'B', 'O', 'I']; });
  pousse("l abscisse de T lue 2", parQuestion(2642, 4),
    c => { c.controle.faits[0][2] = '2'; });
  pousse("la longueur du segment annoncee 2", parQuestion(2642, 5),
    c => { c.controle.faits[5][3] = '2'; });

  pousse("A place a (-2 ; 4) : AC n est plus 3√5", parQuestion(2626, 0),
    c => { c.controle.points.A = ['point', '-2', '4']; });
  pousse("AM confondu avec AB", parQuestion(2626, 0),
    c => { c.controle.faits[1][3] = '3'; });
  pousse("le rapport AJ/AI annonce 3/2", parQuestion(2626, 1),
    c => { c.controle.faits[1][5] = '3/2'; });
  pousse("E pris sur (BI) au lieu de (BJ)", parQuestion(2626, 2),
    c => { c.controle.points.E = ['inter', 'B', 'I', 'A', 'C']; });
  pousse("l ordonnee de E lue 2/3", parQuestion(2626, 2),
    c => { c.controle.faits[1][2] = '2/3'; });
  pousse("F pris symetrique de E par rapport a O", parQuestion(2626, 3),
    c => { c.controle.points.F = ['sym', 'E', 'O']; });
  pousse("BECF declare carre", parQuestion(2626, 4),
    c => { c.controle.faits[0] = ['carre', 'B', 'E', 'C', 'F']; });
  pousse("l aire du losange comptee sans le demi", parQuestion(2626, 4),
    c => { c.controle.faits[5][4] = '9'; });
  pousse("BH calcule sur [BC] au lieu de [CF]", parQuestion(2626, 5),
    c => { c.controle.faits[0][3] = '3/2'; });
  pousse("H pris projete de B sur (CE)", parQuestion(2626, 5),
    c => { c.controle.points.H = ['proj', 'B', 'C', 'E']; });

  pousse("a et b compares a l envers", parQuestion(2621, 0),
    c => { c.controle.claims[0][1] = "4√5 - 9"; });
  pousse("(4√5)² lu 20", parQuestion(2621, 0),
    c => { c.controle.claims[1][1] = "20"; });
  pousse("le produit ac annonce 101", parQuestion(2621, 1),
    c => { c.controle.claims[0][1] = "101"; });
  pousse("bc calcule sans le double produit", parQuestion(2621, 2),
    c => { c.controle.claims[0][1] = "54√5"; });
  pousse("270² et (121√5)² compares a l envers", parQuestion(2621, 3),
    c => { c.controle.claims[2][1] = "72205"; });
  pousse("1/a lu b/61", parQuestion(2621, 4),
    c => { c.controle.claims[0][1] = "b/61"; });
  pousse("le diviseur commun ramene a un simple diviseur", parQuestion(2611, 0),
    c => { c.controle.ensemble.relations = ['unite-divise-centaine']; });
  pousse("le compte annonce le produit brut 12", parQuestion(2611, 0),
    c => { c.controle.faits.find(f => f[0] === 'compte')[1] = '12'; });
  pousse("440 declare dans l ensemble : les chiffres se repetent",
    parQuestion(2611, 0), c => { delete c.controle.ensemble.distincts; });
  pousse("le reste de x sur 3 annonce 2", parQuestion(2612, 0),
    c => { c.controle.claims[1][1] = '2'; });
  // y = 951108 EST divisible par 4 : viser 4 ne disait rien. Le facteur qui
  // manque est le 5 — le nombre se termine par 8.
  pousse("y declare divisible par 5", parQuestion(2612, 1),
    c => { c.controle.divisibles[0][1] = 5; });
  pousse("3^9 lu 6561", parQuestion(2612, 2),
    c => { c.controle.entiers[1][1] = '6561'; });
  // Le nombre EST divisible par 3^10 : 951108 porte exactement un facteur 3,
  // donc sa puissance dixième en porte dix, et 475551^9 bien davantage. C'est
  // à 3^11 que la chaîne s'arrête — et c'est là qu'il faut viser.
  pousse("le nombre declare divisible par 3^11", parQuestion(2612, 3),
    c => { c.controle.divisibles[0][1] = 177147; });
  pousse("x - 1 lu 475552", parQuestion(2612, 3),
    c => { c.controle.entiers[0][1] = '475552'; });
  pousse("le reste de X sur 3 annonce 1", parQuestion(2616, 0),
    c => { c.controle.claims[1][1] = '1'; });
  pousse("81 lu 3^5", parQuestion(2616, 1),
    c => { c.controle.entiers[0][1] = '3^1000'; });
  pousse("Y - 1 declare divisible par 5", parQuestion(2616, 1),
    c => { c.controle.divisibles[0][1] = 5; });
  pousse("X pris a 575554 : le compte de chiffres est faux", parQuestion(2616, 2),
    c => { c.controle.divisibles[1][0] = '81^200 + 3^799 + 1 + 575554'; });
  pousse("les nombres impairs acceptes dans l arbre", parQuestion(2617, 0),
    c => { c.controle.ensemble.unites = [0, 2, 3, 5]; });
  pousse("le compte des pairs annonce 12", parQuestion(2617, 0),
    c => { c.controle.faits.find(f => f[0] === 'compte')[1] = '12'; });
  pousse("8^64 lu 2^64", parQuestion(2617, 1),
    c => { c.controle.entiers[0][1] = '2^64'; });
  pousse("le reste sur 20 declare non nul", parQuestion(2617, 1),
    c => { c.controle.entiers[3][1] = '20 × 2^188 + 1'; });

  // ══ LA SÉANCE 1 — l'arbre de choix ═════════════════════════════════════
  //
  // LA PLUS IMPORTANTE de la séance rejoue le PRODUIT BRUT 48 là où le compte
  // vrai est 42. C'est exactement le piège de l'exercice 6 : trois familles de
  // chiffres qui se recoupent, donc un arbre dont six branches meurent. Si le
  // validateur acceptait 48, c'est qu'il referait le produit de la chaîne au
  // lieu de parcourir les mille nombres — et il ne vérifierait rien.
  pousse("le produit brut 48 pris pour le compte", parQuestion(16, 1),
    c => { c.controle.faits.find(f => f[0] === 'compte')[1] = '48'; });
  pousse("le compte de E annonce 40", parQuestion(16, 0),
    c => { c.controle.faits.find(f => f[0] === 'compte')[1] = '40'; });
  pousse("un nombre a chiffres repetes declare dans E", parQuestion(16, 0),
    c => { c.controle.faits.find(f => f[0] === 'contient').push('224'); });
  pousse("le produit des branches annonce 3 × 4 × 3", parQuestion(16, 0),
    c => { const f = c.controle.faits.find(x => x[0] === 'produit'); f[2] = '3'; });
  pousse("les multiples de 6 de E comptes 15", parQuestion(16, 2),
    c => { c.controle.faits.find(f => f[0] === 'compte')[1] = '15'; });
  pousse("la liste des multiples de 6 amputee d un terme", parQuestion(16, 2),
    c => { c.controle.faits.find(f => f[0] === 'liste')[1] =
             '210 234 264 318 324 360 510 528 534 564 714 720 738'; });

  pousse("l arbre du restaurant additionne au lieu de multiplier", parQuestion(11, 2),
    c => { c.controle.faits.find(f => f[0] === 'produit')[3] = '9'; });
  pousse("35232 declare non multiple de 12", parQuestion(11, 0),
    c => { c.controle.claims[1][1] = '2937'; });
  pousse("27^40 lu 3^40", parQuestion(11, 1),
    c => { c.controle.entiers[0][1] = '3^40'; });
  pousse("le nombre declare divisible par 4", parQuestion(11, 1),
    c => { c.controle.divisibles[0][1] = 4; });

  pousse("le comptage /12 annonce 9", parQuestion(12, 0),
    c => { c.controle.faits.find(f => f[0] === 'compte')[1] = '9'; });
  pousse("024 accepte comme nombre a trois chiffres", parQuestion(12, 0),
    c => { c.controle.faits.find(f => f[0] === 'ne-contient-pas')[1] = '204'; });
  pousse("le comptage /15 annonce 12", parQuestion(12, 1),
    c => { c.controle.faits.find(f => f[0] === 'compte')[1] = '12'; });
  pousse("le double critere reduit a un seul", parQuestion(12, 2),
    c => { c.controle.ensemble.relations = ['dizaine-multiple-unite']; });

  pousse("le compte des codes annonce 24", parQuestion(15, 1),
    c => { c.controle.faits.find(f => f[0] === 'compte')[1] = '24'; });
  pousse("les chiffres autorises a se repeter", parQuestion(15, 1),
    c => { delete c.controle.ensemble.distincts; });
  pousse("la centaine autorisee a valoir 1", parQuestion(15, 1),
    c => { c.controle.ensemble.centaines = [1, 2, 3]; });

  pousse("les chiffres consecutifs comptes 16", parQuestion(17, 0),
    c => { c.controle.faits.find(f => f[0] === 'compte')[1] = '16'; });
  pousse("132 declare a chiffres consecutifs", parQuestion(17, 0),
    c => { c.controle.faits.find(f => f[0] === 'ne-contient-pas')[1] = '124'; });
  pousse("32^8 lu 2^13", parQuestion(17, 2),
    c => { c.controle.entiers[0][1] = '2^13'; });
  pousse("le nombre declare divisible par 5", parQuestion(17, 2),
    c => { c.controle.divisibles[0][1] = 5; });

  // ── التمرين 11 — le repère, et la figure que la séance 13 avait perdue ──
  pousse("C place a 3√3 : le rectangle change de hauteur", parQuestion(110, 0),
    c => { c.controle.points.C = ['point', '0', '3√3']; });
  pousse("D pris symetrique de M par rapport a O", parQuestion(110, 1),
    c => { c.controle.points.D = ['sym', 'M', 'O']; });
  pousse("OCBD declare carre", parQuestion(110, 2),
    c => { c.controle.faits[0] = ['carre', 'O', 'C', 'B', 'D']; });
  pousse("CD calcule sans le carre de OD", parQuestion(110, 3),
    c => { c.controle.faits[0][3] = '3√2'; });
  pousse("H pris sur (CB) au lieu de (CM)", parQuestion(110, 4),
    c => { c.controle.points.H = ['inter', 'B', 'D', 'C', 'B']; });
  // K est le SECOND point de (OH) à la distance DH de D — l'autre étant H.
  // Le prendre en H, c'est justement l'erreur que l'énoncé écarte.
  pousse("K confondu avec H", parQuestion(110, 5),
    c => { c.controle.points.K = ['point', '6', '-3√2']; });
  pousse("BK annonce 4√2", parQuestion(110, 5),
    c => { c.controle.faits[1][3] = '4√2'; });
  pousse("DP annonce √2", parQuestion(110, 6),
    c => { c.controle.faits[0][3] = '√2'; });
  pousse("l aire du parallelogramme comptee une seule fois", parQuestion(110, 7),
    c => { c.controle.faits.find(f => f[0] === 'aire')[4] = '12√2'; });

  // ── le garde-fou du contrat « ensemble » ───────────────────────────────
  pousse("ensemble sans aucune fait a controler", parQuestion(16, 0),
    c => { c.controle.faits = []; });
  pousse("relation de denombrement inconnue", parQuestion(17, 0),
    c => { c.controle.ensemble.relations = ['chiffres-magiques']; });

  // ══ LA SÉANCE 12 ═══════════════════════════════════════════════════════
  //
  // ── التمرين 1 — le QCM, et la question sans bonne réponse ──────────────
  //
  // LA PREMIÈRE rejoue l'ordre « c < b < a » — la première des trois options
  // imprimées. Elle exige 2√3 < 3, c'est-à-dire 12 < 9. Si le validateur
  // l'acceptait, la seizième coquille n'aurait jamais été trouvée.
  pousse("l ordre c < b < a, la premiere option du livre", parQuestion(121, 0),
    c => { c.controle.claims[1][1] = "3 - 2√3"; });
  pousse("2√3 et 3 compares a l envers", parQuestion(121, 0),
    c => { c.etapes[5][1] = "2√3 < 3"; });
  pousse("a - c calcule sans le 3", parQuestion(121, 0),
    c => { c.controle.claims[0][1] = "2√2"; });
  pousse("le 4 declare moyenne de la serie", parQuestion(121, 1),
    c => { c.controle.faits.find(f => f[0] === 'moyenne')[1] = "4"; });
  pousse("le 4 declare etendue de la serie", parQuestion(121, 1),
    c => { c.controle.faits.find(f => f[0] === 'etendue')[1] = "4"; });
  pousse("un effectif change : le mode se deplace", parQuestion(121, 1),
    c => { c.controle.serie.effectifs[0] = 5; });
  pousse("la diagonale de face prise egale au cote", parQuestion(121, 2),
    c => { c.controle.claims[0][1] = "1"; });
  pousse("le triangle declare rectangle : d² + d² = d²", parQuestion(121, 2),
    c => { c.etapes[7][1] = "4 - d^2 = 0"; });

  // ── التمرين 2 — l'expression et le repère ──────────────────────────────
  //
  // LA DEUXIÈME COQUILLE DE LA SÉANCE : CE = 2a+4 tel qu'imprimé. La figure
  // le contredit — E est en 2a+2, et c'est ce que BE² et DE² confirment.
  pousse("CE = 2a + 4, le nombre imprime dans le livre", parQuestion(122, 6),
    c => { c.controle.faits.find(f => f[0] === 'longueur' && f[1] === 'C')[3] = '2a + 4'; });
  pousse("M en √3/2 decale", parQuestion(122, 0),
    c => { c.controle.claims[0][1] = "√3 - 1/4"; });
  pousse("M + 3 lu (a + 1)^2 + 1", parQuestion(122, 1),
    c => { c.controle.claims[0][1] = "(a + 1)^2 + 1"; });
  pousse("factorisation avec √2 au lieu de √3", parQuestion(122, 2),
    c => { c.controle.claims[0][1] = "(a + 1 - √2)(a + 1 + √2)"; });
  pousse("la racine decalee", parQuestion(122, 3),
    c => { c.controle.env.a = "-1 + √2"; });
  pousse("B place en (0 ; -5)", parQuestion(122, 4),
    c => { c.controle.points.B = ['point', '0', '-5']; });
  pousse("OM annonce a", parQuestion(122, 5),
    c => { c.controle.faits[1][3] = 'a'; });
  pousse("E pris sur la parallele menee par D", parQuestion(122, 6),
    c => { c.controle.points.W = ['translate', 'D', 'O', 'I']; });
  pousse("l abscisse de E lue a + 1", parQuestion(122, 7),
    c => { c.controle.faits[0][2] = 'a + 1'; });
  pousse("BE² ecrit avec 4 au lieu de 40", parQuestion(122, 8),
    c => { c.controle.faits[0][3] = '4a^2 + 8a + 4'; });
  pousse("le triangle BED declare rectangle en B", parQuestion(122, 9),
    c => { c.controle.faits[0] = ['rectangle-en', 'B', 'E', 'D']; });
  pousse("F pris symetrique de E par rapport a D", parQuestion(122, 10),
    c => { c.controle.points.F = ['sym', 'E', 'D']; });

  // ── التمرين 3 — les deux conjugués et le triangle ──────────────────────
  pousse("a et b confondus, comme dans l enonce imprime", parQuestion(123, 0),
    c => { c.controle.claims[0][1] = "√7 - 1"; });
  pousse("la valeur absolue laissee negative", parQuestion(123, 0),
    c => { c.controle.env.b = c.controle.env.b.replace("|-√7 - 1|", "(-√7 - 1)"); });
  pousse("le produit ab annonce 8", parQuestion(123, 1),
    c => { c.controle.claims[0][1] = "8"; });
  pousse("AB² developpe sans le double produit", parQuestion(123, 2),
    c => { c.controle.faits[0][3] = '8'; });
  pousse("C place a AC = √7 + 1", parQuestion(123, 2),
    c => { c.controle.points.C = ['point', '0', '√7 + 1']; });
  pousse("BC annonce 5", parQuestion(123, 3),
    c => { c.controle.faits[0][3] = '5'; });
  pousse("AH calcule sans diviser par le hypotenuse", parQuestion(123, 4),
    c => { c.controle.faits[0][3] = '6'; });
  pousse("IJ ecrit sans le quart", parQuestion(123, 5),
    c => { c.controle.faits[0][3] = '(√7 - 1)x'; });
  pousse("J pris projete de I sur (AC)", parQuestion(123, 5),
    c => { c.controle.points.J = ['proj', 'I', 'A', 'C']; });
  pousse("x decale d une unite", parQuestion(123, 6),
    c => { c.controle.env.x = "4√7 - 7"; });

  // ── التمرين 4 — l'isocèle redressé ─────────────────────────────────────
  pousse("O place a OA = 4 : le triangle n est plus isocele", parQuestion(124, 0),
    c => { c.controle.points.O = ['point', '3', '√7']; });
  pousse("le triangle ABC declare rectangle en A", parQuestion(124, 0),
    c => { c.controle.faits[0] = ['rectangle-en', 'A', 'B', 'C']; });
  pousse("OI pris egal a BC", parQuestion(124, 1),
    c => { c.controle.faits[1][3] = '8'; });
  pousse("BK calcule avec le mauvais cote", parQuestion(124, 2),
    c => { c.controle.faits[0][3] = '24/6'; });
  pousse("K pris projete de B sur (AB)", parQuestion(124, 2),
    c => { c.controle.points.K = ['proj', 'B', 'A', 'B']; });
  pousse("le rapport IJ/IB annonce 2/3", parQuestion(124, 3),
    c => { c.controle.faits[0][5] = '2/3'; });
  pousse("G declare centre de gravite de ABO", parQuestion(124, 3),
    c => { c.controle.faits[3] = ['centre-gravite', 'G', 'A', 'B', 'O']; });
  pousse("AOBN declare carre", parQuestion(124, 4),
    c => { c.controle.faits[0] = ['carre', 'A', 'O', 'B', 'N']; });
  pousse("J declare centre de gravite de AON", parQuestion(124, 5),
    c => { c.controle.faits[0] = ['centre-gravite', 'J', 'A', 'O', 'N']; });
  pousse("l aire de ONP prise egale a celle de BON", parQuestion(124, 6),
    c => { c.controle.faits[0][4] = '12'; });

  // ── التمرين 5 — l'équilatéral et son symétrique ────────────────────────
  pousse("AI calcule comme la moitie du cote", parQuestion(125, 0),
    c => { c.controle.faits[0][3] = '3'; });
  pousse("A deplace : le triangle n est plus equilateral", parQuestion(125, 0),
    c => { c.controle.points.A = ['point', '3', '4']; });
  pousse("le triangle OBC declare rectangle en B", parQuestion(125, 1),
    c => { c.controle.faits[0] = ['rectangle-en', 'B', 'O', 'C']; });
  pousse("O pris symetrique de A par rapport a B", parQuestion(125, 1),
    c => { c.controle.points.O = ['sym', 'A', 'B']; });
  pousse("OC annonce 6√2", parQuestion(125, 2),
    c => { c.controle.faits[0][3] = '6√2'; });
  pousse("le rapport GA/GC pris a l envers", parQuestion(125, 3),
    c => { c.controle.faits[2][5] = '2'; });
  pousse("G declare centre de gravite de ABC", parQuestion(125, 4),
    c => { c.controle.faits[0] = ['centre-gravite', 'G', 'A', 'B', 'C']; });
  pousse("IG pris egal au tiers de OI mal simplifie", parQuestion(125, 5),
    c => { c.controle.faits[0][3] = '√13/3'; });
  pousse("M pris milieu de [OB] au lieu de [OC]", parQuestion(125, 6),
    c => { c.controle.points.M = ['milieu', 'O', 'B']; });
  pousse("AMCI declare carre", parQuestion(125, 7),
    c => { c.controle.faits[0] = ['carre', 'A', 'M', 'C', 'I']; });
  pousse("D pris sur la parallele a (AC)", parQuestion(125, 8),
    c => { c.controle.points.Z = ['translate', 'C', 'A', 'C']; });

  // ── التمرين 6 — LA PYRAMIDE, le premier solide contredit ───────────────
  //
  // Ce sont les falsifications qui disent si espace.js sert à quelque chose :
  // un module de contrôle qui ne saurait pas refuser une pyramide fausse ne
  // vaudrait pas mieux que la recopie de l'énoncé qu'il remplace. On vise donc
  // CE QUI PORTE l'exercice — le côté de la base, la hauteur, la nature du
  // projeté, la perpendicularité au plan — et non des détails d'écriture.
  pousse("le cote 3√2 du livre, avec lequel SA ne vaut plus 6", parQuestion(126, 0),
    c => { c.controle.espace.A = ['point', '3', '0', '0'];
           c.controle.espace.B = ['point', '0', '3', '0'];
           c.controle.espace.C = ['point', '-3', '0', '0'];
           c.controle.espace.D = ['point', '0', '-3', '0']; });
  pousse("OA pris egal au cote au lieu de la moitie du diagonale", parQuestion(126, 0),
    c => { c.etapes[3][1] = "OA = AC"; });
  pousse("la base rendue rectangle : ce n est plus un hexaedre regulier",
    parQuestion(126, 0), c => { c.controle.espace.D = ['point', '0', '-4√2', '0']; });
  pousse("le sommet decale hors de l axe : la pyramide n est plus reguliere",
    parQuestion(126, 1), c => { c.controle.espace.S = ['point', '1', '0', '3√2']; });
  pousse("S ramene dans le plan de la base", parQuestion(126, 1),
    c => { c.controle.espace.S = ['point', '0', '0', '0']; });
  pousse("la hauteur allongee : l hypothese SA = √2 × SO tombe", parQuestion(126, 2),
    c => { c.controle.espace.S = ['point', '0', '0', '6']; });
  pousse("le carre de l hypothese oublie", parQuestion(126, 2),
    c => { c.etapes[2][1] = "SA^2 = 2 × SO"; });
  pousse("SA = 6√2, le double du bon", parQuestion(126, 3),
    c => { c.etapes[4][1] = "SA = √2 × 3√2 × 2"; });
  pousse("√2 × 3√2 simplifie en 3√2", parQuestion(126, 3),
    c => { c.etapes[5][1] = "√2 × 3√2 = 3√2"; });
  pousse("K projete sur (SA) au lieu de (SB)", parQuestion(126, 4),
    c => { c.controle.espace.K = ['proj', 'O', 'S', 'A']; });
  pousse("K pris milieu de [SO]", parQuestion(126, 4),
    c => { c.controle.espace.K = ['milieu', 'S', 'O']; });
  pousse("la relation metrique ecrite avec le mauvais denominateur",
    parQuestion(126, 4), c => { c.etapes[4][1] = "OK = SO × OB/OA"; });
  pousse("(AC) declaree perpendiculaire au plan de la base", parQuestion(126, 5),
    c => { c.controle.faits[0] = ['perpendiculaire-plan', 'A', 'C', 'A', 'B', 'D']; });
  // CELLE-CI A REFUSÉ DE MORDRE, et c'est elle qui a le plus appris. En
  // allongeant [OB] — B(0 ; 4√2 ; 0) — la base cesse d'être un carré et la
  // pyramide cesse d'être régulière ; le contrôle, lui, PASSE. La raison est
  // que la question 3أ ne se sert ni du carré ni de la régularité : elle se
  // sert de deux faits seulement, (AC) ⊥ (BD) et (AC) ⊥ (SO). Un cerf-volant
  // les garde tous les deux. La bonne falsification n'est donc pas d'abîmer
  // le carré, c'est de sortir B de l'axe — alors (AC) et (BD) cessent d'être
  // perpendiculaires, et la conclusion tombe.
  pousse("B sorti de l axe : les diagonales ne sont plus perpendiculaires",
    parQuestion(126, 5), c => { c.controle.espace.B = ['point', '√2', '3√2', '0']; });
  pousse("le plan (SBD) remplace par (SAB), qui contient (AC) au lieu de lui "
       + "etre perpendiculaire", parQuestion(126, 5),
    c => { c.controle.faits[0] = ['perpendiculaire-plan', 'A', 'C', 'S', 'A', 'B']; });
  pousse("CK calcule en oubliant OK", parQuestion(126, 6),
    c => { c.etapes[6][1] = "CK^2 = 18"; });
  pousse("OK repris a 3√2 comme OC", parQuestion(126, 6),
    c => { c.etapes[5][1] = "OK^2 = 18"; });
  pousse("√27 sorti en 9√3", parQuestion(126, 6),
    c => { c.etapes[7][1] = "√27 = 9√3"; });

  // ══ LA SÉANCE 13 — l'exercice de STATISTIQUES ══════════════════════════
  //
  // Sur une série, la falsification qui compte est de CHANGER UN EFFECTIF. Si
  // la série peut bouger sans que rien ne proteste, rien n'était recalculé.
  pousse("un effectif change : toute la serie bouge", parQuestion(136, 3),
    c => { c.controle.serie.effectifs[2] = 25; });
  pousse("le 30% lu sur la deuxieme classe : b = 7 au lieu de 15",
    parQuestion(136, 1), c => { c.controle.serie.effectifs[0] = 7; });
  pousse("la serie declaree discrete", parQuestion(136, 0),
    c => { c.controle.faits[0] = ['discrete']; });
  pousse("les voitures sous 60 km/h comptees 15", parQuestion(136, 2),
    c => { c.controle.faits[0][2] = '15'; });
  pousse("la moyenne calculee sur les bornes basses", parQuestion(136, 3),
    c => { c.controle.faits.find(f => f[0] === 'moyenne')[1] = '47.6'; });
  pousse("la classe modale prise a la premiere", parQuestion(136, 3),
    c => { const f = c.controle.faits.find(x => x[0] === 'classe-modale');
           f[1] = '20'; f[2] = '40'; });
  // La médiane, visée là où elle porte : au centre de la classe médiane, ce
  // qui est l'erreur exacte que la lecture sur le polygone interdit.
  pousse("mediane lue au centre de la classe mediane (70 au lieu de 62)",
    parQuestion(136, 4), c => {
      c.controle.faits.find(f => f[0] === 'mediane')[1] = '70'; });
  pousse("mediane lue a l ordonnee N au lieu de N/2", parQuestion(136, 4),
    c => { c.controle.faits.find(f => f[0] === 'mediane-au')[1] = 'N'; });
  pousse("la probabilite ecrite comme un effectif", parQuestion(136, 5),
    c => { c.controle.faits.find(f => f[0] === 'probabilite')[2] = '27'; });

  // ── التمرين 1 — le repère et le parallélogramme ────────────────────────
  pousse("E place sur (OI) au lieu de (OJ)", parQuestion(131, 0),
    c => { c.controle.points.E = ['inter', 'B', 'W', 'O', 'I']; });
  pousse("BE annonce 5, le ordonnee de B", parQuestion(131, 1),
    c => { c.controle.faits[0][3] = '5'; });
  pousse("A pris sur (DB) au lieu de (BE) : on retombe sur J", parQuestion(131, 2),
    c => { c.controle.points.A = ['inter', 'D', 'B', 'I', 'J']; });
  pousse("l abscisse de A lue +4", parQuestion(131, 3),
    c => { c.controle.faits[0][2] = '4'; });
  pousse("AJ calcule sans le radical", parQuestion(131, 4),
    c => { c.controle.faits[0][3] = '32'; });
  // J + (B - A) est ALGÉBRIQUEMENT le même point que B + (J - A) : viser
  // « AJBF » par là ne changeait rien. On construit le sommet de l'autre
  // parallélogramme, ABFJ, qui lui est bien ailleurs.
  pousse("F construit pour ABFJ au lieu de AJFB", parQuestion(131, 5),
    c => { c.controle.points.F = ['translate', 'A', 'J', 'B']; });
  pousse("H projete selon (OI) au lieu de (OJ)", parQuestion(131, 6),
    c => { c.controle.points.V = ['translate', 'B', 'O', 'I']; });
  pousse("les deux aires annoncees differentes", parQuestion(131, 7),
    c => { c.controle.faits[1][4] = '4'; });

  // ── التمرين 2 — le nombre d'or et les deux valeurs absolues ────────────
  pousse("a et b echanges", parQuestion(132, 0),
    c => { c.controle.claims[0][1] = "(3 + √5)/2"; });
  pousse("le carre (1+√5)² developpe sans le double produit", parQuestion(132, 0),
    c => { c.controle.claims[2][1] = "6"; });
  pousse("√12 lu 3√3", parQuestion(132, 0),
    c => { c.controle.claims[3][1] = "3√3"; });
  pousse("5 declare plus grand que 9", parQuestion(132, 1),
    c => { c.etapes[5][1] = "9 < 5"; });
  pousse("le cadre de a decale", parQuestion(132, 2),
    c => { c.etapes[3][1] = "a ≤ 1/4"; });
  pousse("la premiere valeur absolue laissee negative", parQuestion(132, 3),
    c => { c.controle.claims[0][1] = "3 - √5"; });
  pousse("a² annonce (7 + 3√5)/2", parQuestion(132, 4),
    c => { c.controle.claims[0][1] = "(7 + 3√5)/2"; });
  pousse("2b = (7 - 3√5)a", parQuestion(132, 5),
    c => { c.controle.claims[0][1] = "(7 - 3√5)a"; });
  pousse("b² - 3√5/2 annonce 5/2", parQuestion(132, 5),
    c => { c.controle.claims[1][1] = "5/2"; });

  // ── التمرين 3 — l'équilatéral caché ────────────────────────────────────
  pousse("D place a 60° mal lu : l angle devient 45°", parQuestion(133, 0),
    c => { c.controle.points.D = ['point', '6', '6']; });
  pousse("AD annonce 6, comme le cote", parQuestion(133, 0),
    c => { c.controle.faits[1][3] = '6'; });
  pousse("G place a BG = 3 au lieu de 2", parQuestion(133, 1),
    c => { c.controle.points.G = ['point', '9/2', '3√3/2']; });
  pousse("I pris projete de B sur (AD)", parQuestion(133, 1),
    c => { c.controle.points.I = ['proj', 'B', 'A', 'D']; });
  pousse("H pris symetrique de C par rapport a A", parQuestion(133, 2),
    c => { c.controle.points.H = ['sym', 'C', 'A']; });
  pousse("ACBH declare carre", parQuestion(133, 2),
    c => { c.controle.faits[0] = ['carre', 'A', 'C', 'B', 'H']; });
  pousse("CH annonce 6, le cote du losange", parQuestion(133, 3),
    c => { c.controle.faits[0][3] = '6'; });
  pousse("B declare orthocentre de ACD", parQuestion(133, 4),
    c => { c.controle.faits[0] = ['orthocentre', 'B', 'A', 'C', 'D']; });
  // B et C sont tous deux sur (BC), qui est PERPENDICULAIRE à (DH) : ils se
  // projettent au même endroit. Viser C ne mordait donc pas — et c'était la
  // preuve, pas l'échec, que B, C et K sont alignés. On vise le milieu de
  // [DC], qui n'a aucune raison d'être sur (DH).
  pousse("K pris au milieu de [DC]", parQuestion(133, 5),
    c => { c.controle.points.K = ['milieu', 'D', 'C']; });
  pousse("CE annonce 12√3, la longueur de [HE]", parQuestion(133, 6),
    c => { c.controle.faits[0][3] = '12√3'; });
  pousse("E pris sur la perpendiculaire menee par H", parQuestion(133, 6),
    c => { c.controle.points.W = ['normale', 'H', 'H', 'D']; });

  // ── الحصّة 1، التمرين 9 — une lettre paire, et les diviseurs de 15 ─────
  pousse("le 6 sorti sans le second terme", parQuestion(19, 0),
    c => { c.controle.claims[0][1] = "6k"; });
  pousse("n suppose impair : a n est plus 6k + 1", parQuestion(19, 0),
    c => { c.controle.derives.a = "6k + 2"; });
  pousse("le facteur 2 de b oublie : 6 au lieu de 12", parQuestion(19, 1),
    c => { c.controle.claims[0][1] = "6m(k + 1)"; });
  pousse("b pris impair", parQuestion(19, 1),
    c => { c.controle.derives.b = "2m + 1"; });
  pousse("un diviseur de 15 oublie", parQuestion(19, 2),
    c => { c.controle.diviseurs[0][1] = "1 3 5"; });
  pousse("un diviseur de 15 invente", parQuestion(19, 2),
    c => { c.controle.diviseurs[0][1] = "1 3 5 9 15"; });
  pousse("t = 8 mal calcule", parQuestion(19, 2),
    c => { c.controle.claims[2][1] = "5"; });
  pousse("un quatrieme chiffre glisse dans l ensemble", parQuestion(19, 3),
    c => { c.controle.ensemble.chiffres = [2, 4, 6, 8]; });
  pousse("les chiffres autorises a se repeter", parQuestion(19, 3),
    c => { c.controle.ensemble.distincts = false; });
  pousse("la liste amputee d un nombre", parQuestion(19, 3),
    c => { c.controle.faits[1][1] = "468 486 648 684 846"; });
  pousse("l arbre compte 3 branches a chaque etage", parQuestion(19, 3),
    c => { c.etapes[5][1] = "3 × 3 × 3 = 6"; });

  // ── الحصّة 1، التمرين 10 — six divisibilités ───────────────────────────
  pousse("le quotient par 15 decale", parQuestion(1010, 0),
    c => { c.controle.entiers[0][1] = "15 × 658436215"; });
  pousse("9876543210 declare divisible par 7", parQuestion(1010, 0),
    c => { c.controle.divisibles[0] = ['9876543210', 7]; });
  pousse("25^21 lu comme 5^41", parQuestion(1010, 1),
    c => { c.etapes[1][1] = "25^21 = 5^41"; });
  pousse("324 mal decompose", parQuestion(1010, 1),
    c => { c.etapes[4][1] = "324 = 12 × 26"; });
  pousse("la difference de carres mal fermee", parQuestion(1010, 2),
    c => { c.etapes[2][1] = "2022^2 - 9 = 2019 × 2024"; });
  pousse("2022^2 - 9 declare divisible par 7", parQuestion(1010, 2),
    c => { c.controle.divisibles[0] = ['2022^2 - 9', 7]; });
  pousse("8^43 lu comme 2^130", parQuestion(1010, 3),
    c => { c.etapes[1][1] = "8^43 = 2^130"; });
  pousse("le facteur 3 pris pour un 5", parQuestion(1010, 3),
    c => { c.etapes[2][1] = "2^129 + 2^130 = 5 × 2^129"; });
  pousse("a pris impair : a4 n est plus multiple de 4", parQuestion(1010, 4),
    c => { c.controle.divisibles[0] = ['111714', 12]; });
  // LA FALSIFICATION QUI PORTE LA COQUILLE. Ce n'est pas une erreur inventée :
  // c'est la question 7 du livre, telle qu'imprimée. « x2x5x4 est divisible par
  // 6 quel que soit x » — la somme de ses chiffres vaut 3x + 11, congrue à 2
  // modulo 3 pour TOUT x, donc le nombre n'est jamais divisible par 3. Trois
  // valeurs de x suffisent à le montrer, et le contrôle doit les refuser
  // toutes les trois.
  pousse("la question 7 du livre, telle qu imprimee : x2x5x4 divisible par 6",
    parQuestion(1010, 4),
    c => { c.controle.divisibles = [['121514', 6], ['222524', 6], ['323534', 6]]; });

  // ══ LES SOLIDES — six exercices que la machine ne savait pas tenir ═════
  //
  // Chacun de ces exercices a été écarté pendant des mois, non pas parce qu'il
  // était difficile mais parce qu'aucune pièce ne savait le CONTREDIRE. Les
  // falsifications ci-dessous sont donc la vraie preuve du travail : elles
  // déplacent un sommet, changent une hauteur, prennent un projeté sur la
  // mauvaise arête — et le contrôle doit refuser.

  // ── الحصّة 2، التمرين 5 — le tétraèdre régulier ────────────────────────
  pousse("le sommet abaisse : les aretes ne sont plus toutes egales",
    parQuestion(25, 1), c => { c.controle.espace.S = ['point', '0', '0', '4']; });
  pousse("OA pris egal a la mediane entiere au lieu de ses deux tiers",
    parQuestion(25, 0), c => { c.etapes[5][1] = "OA = 6"; });
  pousse("la base retrecie : le cote n est plus 4√3", parQuestion(25, 0),
    c => { c.controle.espace.A = ['point', '3', '0', '0']; });
  pousse("E place a la hauteur du cote au lieu de 4√2", parQuestion(25, 3),
    c => { c.controle.espace.E = ['point', '4', '0', '4√3']; });
  pousse("E ramene sur l axe, ou il se confond avec S", parQuestion(25, 5),
    c => { c.controle.espace.E = ['point', '0', '0', '4√2']; });
  pousse("M pris milieu de [EI] au lieu du tiers", parQuestion(25, 6),
    c => { c.controle.espace.M = ['milieu', 'E', 'I']; });
  pousse("F pris milieu de [EC] : ce n est plus la troisieme mediane",
    parQuestion(25, 7), c => { c.controle.espace.F = ['milieu', 'E', 'C']; });
  pousse("BF pris egal a EB tout entier", parQuestion(25, 7),
    c => { c.etapes[6][1] = "BF = 4√5"; });

  // ── الحصّة 4، التمرين 6 — la pyramide posée sur un coin ────────────────
  pousse("l arete AS raccourcie a 3", parQuestion(46, 0),
    c => { c.controle.espace.S = ['point', '0', '0', '3']; });
  pousse("O pris milieu de [AB] au lieu de [AC]", parQuestion(46, 2),
    c => { c.controle.espace.O = ['milieu', 'A', 'B']; });
  pousse("K projete sur (OC) au lieu de (OS)", parQuestion(46, 3),
    c => { c.controle.espace.K = ['proj', 'A', 'O', 'C']; });
  pousse("la relation metrique ecrite avec le mauvais denominateur",
    parQuestion(46, 3), c => { c.etapes[4][1] = "OK = AO^2/AS"; });
  pousse("M pris milieu de [SB] : il n est plus a l aplomb du centre",
    parQuestion(46, 5), c => { c.controle.espace.M = ['milieu', 'S', 'B']; });
  pousse("le volume calcule sans le tiers", parQuestion(46, 6),
    c => { c.controle.faits[0][6] = '32'; });

  // ── الحصّة 5، التمرين 6 — le prisme SANS AUCUN NOMBRE ──────────────────
  // Ici les étapes ne portent que des égalités entre longueurs : il n'y a rien
  // à fausser dans une constante, tout se joue sur la FIGURE.
  pousse("I place ailleurs sur [BC] : IC ne vaut plus AD/2", parQuestion(56, 3),
    c => { c.controle.espace.I = ['point', '1', '4', '0']; });
  pousse("le trapeze deforme : BC ne vaut plus CD", parQuestion(56, 4),
    c => { c.controle.espace.C = ['point', '2', '4', '0']; });
  pousse("le rapport de Thales pris a 1/3", parQuestion(56, 3),
    c => { c.etapes[4][1] = "MD = 3 × MC"; });
  pousse("N pris milieu de [MB] au lieu de [MH]", parQuestion(56, 6),
    c => { c.controle.espace.N = ['milieu', 'M', 'B']; });

  // ── الحصّة 6، التمرين 5 (le parallélépipède) ───────────────────────────
  pousse("N deplace sur [FG] : ENH n est plus isocele", parQuestion(66, 1),
    c => { c.controle.espace.N = ['point', '2√3', '3', '0']; });
  pousse("AB pris egal a 4 : la face n est plus celle du livre",
    parQuestion(66, 0), c => { c.controle.espace.F = ['point', '4', '0', '0']; });
  pousse("MN pris egal a NH : la mediane ne vaut plus la moitie",
    parQuestion(66, 2), c => { c.etapes[4][1] = "MN = NH"; });
  pousse("√32 sorti en 4√3", parQuestion(66, 4),
    c => { c.etapes[5][1] = "√32 = 4√3"; });
  pousse("L pris milieu de [EF] au lieu de [EH]", parQuestion(66, 6),
    c => { c.controle.espace.L = ['milieu', 'E', 'F']; });

  // ── الحصّة 8، التمرين 4 — la pyramide penchée ──────────────────────────
  pousse("la hauteur SA ramenee a 3", parQuestion(84, 1),
    c => { c.controle.espace.S = ['point', '0', '0', '3']; });
  pousse("G pris milieu de [AI] au lieu du centre de gravite",
    parQuestion(84, 4), c => { c.controle.espace.G = ['milieu', 'A', 'I']; });
  pousse("Pythagore additionne au lieu de soustraire", parQuestion(84, 0),
    c => { c.etapes[3][1] = "AI^2 = 12 + 3"; });
  pousse("JG pris aux deux tiers de la hauteur", parQuestion(84, 4),
    c => { c.etapes[5][1] = "JG = 8/3"; });
  pousse("le volume calcule sans le tiers", parQuestion(84, 7),
    c => { c.controle.faits[0][5] = '4√3'; });

  // ── الحصّة 13، التمرين 4 — la pyramide régulière et son centre de gravité
  pousse("la hauteur portee a 5", parQuestion(134, 1),
    c => { c.controle.espace.S = ['point', '0', '0', '5']; });
  pousse("H projete sur (SD) au lieu de (SB)", parQuestion(134, 2),
    c => { c.controle.espace.H = ['proj', 'O', 'S', 'D']; });
  pousse("la relation metrique du projete ecrite sur SO", parQuestion(134, 2),
    c => { c.etapes[6][1] = "BH = OB^2/SO"; });
  pousse("OH oublie a moitie dans le calcul de CH", parQuestion(134, 4),
    c => { c.etapes[5][1] = "CH^2 = 4 + 4/5"; });
  pousse("G pris au tiers depuis S : ce n est plus le centre de gravite",
    parQuestion(134, 6), c => { c.controle.espace.G = ['sur', 'O', 'S', '2/3']; });

  // ── le garde-fou du contrat « solide » ─────────────────────────────────
  pousse("solide sans aucune fait a controler", parQuestion(126, 0),
    c => { c.controle.faits = []; c.controle.claims = []; });

  // ── le garde-fou du contrat « série » ──────────────────────────────────
  pousse("serie sans aucune fait a controler", parQuestion(136, 0),
    c => { c.controle.faits = []; });

  // ── les garde-fous du contrat « grands entiers » ───────────────────────
  pousse("exercice en grands entiers sans aucun controle", parQuestion(112, 0),
    c => { c.controle.entiers = []; c.controle.divisibles = []; });
  pousse("expression entiere non analysable", parQuestion(112, 0),
    c => { c.controle.entiers[0][0] = "25^50 +"; });

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
