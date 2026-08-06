// Valide le chapitre « الإحصاء — 9 أساسي ».
//   node verifier.js [tirages]   |   CONTRE_EXEMPLES=1 node verifier.js
//
// Le principe est celui des autres chapitres : on n'inspecte pas le
// générateur, on l'EXÉCUTE, et l'on recalcule tout ce qu'il affirme.
//
// Ici « recalculer » veut dire une chose précise : la SÉRIE est reconstruite à
// partir de ses données brutes — valeurs (ou bornes) et effectifs —, et chaque
// grandeur est recomputée dessus. Une moyenne, un cumul, une médiane annoncés
// dans une étape sont confrontés à la série, jamais crus sur parole.
//
// Et rien n'est approché. La moyenne est une fraction, la médiane est
// l'abscisse EXACTE d'un point du polygone. Le maître lit « Me ≈ 31 » sur son
// graphique ; la machine répond 220/7, et c'est ce nombre-là qu'elle compare.
const F = require('./noyau.js');
const T = require('./stat.js');
require('./familles.js');
require('./gens.js');

const TIRAGES = Number(process.argv[2]) || 60;
let relations = 0, controles = 0, questions = 0;
const echecs = [];

// L'environnement d'une question : toutes les grandeurs de la série, sous les
// noms que les étapes ont le droit d'employer (N, M, Me, na, ca, …).
function environnement(c) {
  if (!c.serie) throw new Error('contrôle sans série');
  const s = T.serie(Object.assign({ nom: 'contrôle' }, c.serie));
  const e = T.nommer(s);
  for (const nom in (c.env || {})) e[nom] = F.analyser(c.env[nom], e);
  return [s, e];
}

function controlerClaims(c, env) {
  const p = [];
  for (const [gauche, droite] of (c.claims || [])) {
    let g, d;
    try {
      g = F.analyser(String(gauche).replace(/×/g, '*'), env);
      d = F.analyser(String(droite).replace(/×/g, '*'), env);
    } catch (err) { p.push(`تعذّر « ${gauche} = ${droite} » (${err.message})`); continue; }
    controles++;
    if (!F.sEgaux(g, d)) p.push(`« ${gauche} » ≠ « ${droite} » (${F.sTxt(g)} و ${F.sTxt(d)})`);
  }
  return p;
}

function verifierBrut(brut) {
  const probs = [];
  const c = brut.controle;
  let s, env;
  try { [s, env] = environnement(c); }
  catch (e) { return ['تعذّر بناء السلسلة: ' + e.message]; }

  let verifiees = 0;
  brut.etapes.forEach(([label, math], i) => {
    if (typeof math !== 'string' || F.ARABE.test(math)) return;
    try {
      const r = F.verifierRelation(String(math).replace(/×/g, '*'), env);
      if (r === null) probs.push(`م${i + 1}: « ${math} » ليست علاقة`);
      else if (r) probs.push(`م${i + 1}: ${r}`);
      else relations++;
    } catch (e) { probs.push(`م${i + 1}: تعذّر « ${math} » (${e.message})`); }
    verifiees++;
  });

  // L'énoncé lui-même passe par l'analyseur — une ligne de tableau mal écrite
  // y serait aussi grave qu'une étape fausse, et personne ne la verrait.
  for (const e of brut.enonce) {
    if (typeof e !== 'string' || F.ARABE.test(e)) continue;
    try {
      const r = F.verifierRelation(e.replace(/×/g, '*'), env);
      if (r === null) F.analyser(e.replace(/×/g, '*'), env);
      else if (r) probs.push(`نصّ الوضعية فاسد: ${r}`);
      else relations++;
    } catch (err) { probs.push(`نصّ غير قابل للتحليل « ${e} » (${err.message})`); }
  }

  if (verifiees < 2) probs.push('عدد المراحل القابلة للتحقق قليل جدا');
  probs.push(...controlerClaims(c, env));

  // LES FAITS DE LA SÉRIE — « la moyenne vaut 167/5 », « la médiane vaut
  // 220/7 », « le tableau cumulé est 20, 104, 240 » : tous recalculés sur les
  // seules données brutes. C'est ici qu'un énoncé faux se fait contredire.
  if (!(c.faits || []).length) probs.push('سلسلة بلا واقعة تُراقَب');
  probs.push(...T.verifierFaits(c.faits, s, env));
  controles += (c.faits || []).length;

  const t = brut.etapes.map(e => e.join(': '));
  if (new Set(t).size !== t.length) probs.push('مراحل مكرّرة');
  const rel = brut.etapes.map(e => e[1])
    .filter(x => typeof x === 'string' && !F.ARABE.test(x))
    .map(x => x.replace(/\s+/g, ''));
  if (new Set(rel).size !== rel.length) probs.push('علاقة مكرّرة في مرحلتين');
  if (t.length < 4) probs.push('السلسلة قصيرة جدا');
  if (!brut.indice) probs.push('بلا مساعدة');
  return probs;
}

// -------------------------------------------------------------------------
// Mode falsification : on abîme volontairement des questions justes.
//
// Sur une série, la falsification qui compte n'est pas de retoucher une étape :
// c'est de CHANGER UN EFFECTIF. Si la série peut bouger sans que rien ne
// proteste, alors rien n'était recalculé — tout était recopié.
// -------------------------------------------------------------------------
if (process.env.CONTRE_EXEMPLES) {
  const cas = [];
  const copie = q => JSON.parse(JSON.stringify(q));
  const pousse = (nom, q, f) => { const c = copie(q); f(c); cas.push([nom, c]); };
  const parQuestion = (n, i) => F.tirer(n)[i];

  // ── Déplacer la série sous les pieds de la réponse ──────────────────────
  for (const [n, titre] of [[1, 'lecture'], [2, 'moyenne'], [3, 'cumul'],
                            [5, 'moussat discret'], [6, 'moyenne continue'],
                            [7, 'moussat continu'], [8, 'probabilite']]) {
    pousse('un effectif change — ' + titre, parQuestion(n, 0),
      c => { c.controle.serie.effectifs[0] += 7; });
  }
  // La dernière borne change le dernier CENTRE de classe, donc la moyenne.
  pousse('la derniere borne decalee — moyenne continue', parQuestion(6, 0),
    c => { c.controle.serie.bornes[c.controle.serie.bornes.length - 1] += 5; });
  // Mais elle ne change PAS la médiane quand celle-ci tombe avant : les cumuls
  // sont intacts et les segments traversés aussi. Viser la dernière borne ici
  // ne mordait pas, et c'était la visée qui avait tort. Ce qui porte la
  // médiane, c'est la borne de SA classe.
  pousse('la borne basse de la classe mediane decalee', parQuestion(7, 0),
    c => {
      const s = T.serie(c.controle.serie);
      c.controle.serie.bornes[T.classeMediane(s)] += 1;
    });

  // ── LA MÉDIANE — la pièce centrale, visée là où elle porte ──────────────
  //
  // 1. La lire au MILIEU DE LA CLASSE médiane au lieu de couper le polygone :
  //    c'est l'erreur que la règle du maître interdit, et c'est exactement
  //    celle qu'un élève commet.
  pousse('mediane lue au centre de la classe mediane au lieu du polygone',
    parQuestion(7, 0), c => {
      const s = T.serie(c.controle.serie);
      const i = T.classeMediane(s);
      const centre = F.sTxt(F.sEch(F.sAdd(s.bornes[i], s.bornes[i + 1]), F.rat(1, 2)));
      c.controle.faits.find(f => f[0] === 'mediane')[1] = centre;
    });
  // 2. La lire à l'ordonnée N au lieu de N/2 — le haut du polygone.
  pousse('mediane lue a l ordonnee N au lieu de N/2', parQuestion(7, 0),
    c => { c.controle.faits.find(f => f[0] === 'mediane-au')[1] = 'N'; });
  // 3. La classe médiane annoncée un cran trop loin.
  pousse('classe mediane decalee d un cran', parQuestion(7, 0),
    c => {
      const f = c.controle.faits.find(x => x[0] === 'classe-mediane');
      const s = T.serie(c.controle.serie);
      const i = T.classeMediane(s);
      const j = Math.min(i + 1, s.effectifs.length - 1);
      if (j === i) { f[1] = F.sTxt(s.bornes[0]); f[2] = F.sTxt(s.bornes[1]); }
      else { f[1] = F.sTxt(s.bornes[j]); f[2] = F.sTxt(s.bornes[j + 1]); }
    });
  // 4. Sur une série DISCRÈTE paire, prendre le rang N/2 seul au lieu de la
  //    demi-somme des deux rangs du milieu.
  pousse('mediane discrete prise au seul rang N/2', parQuestion(5, 0),
    c => {
      const s = T.serie(c.controle.serie);
      const N = F.sVal(T.total(s)), cc = T.cumulCroissant(s);
      const valAu = k => {
        for (let i = 0; i < cc.length; i++) if (F.sCmp(F.num(k), cc[i]) <= 0) return s.valeurs[i];
        return s.valeurs[s.valeurs.length - 1];
      };
      const seul = valAu(Math.floor(N / 2));
      c.controle.faits.find(f => f[0] === 'mediane')[1] = F.sTxt(F.sAdd(seul, F.num(1)));
    });

  // ── Les autres grandeurs ───────────────────────────────────────────────
  pousse('moyenne divisee par le nombre de valeurs au lieu de N', parQuestion(2, 0),
    c => {
      const s = T.serie(c.controle.serie);
      const num = F.sMul(T.moyenne(s), T.total(s));
      c.controle.faits.find(f => f[0] === 'moyenne')[1] =
        F.sTxt(F.sDiv(num, F.num(s.effectifs.length)));
    });
  pousse('mode confondu avec son effectif', parQuestion(1, 0),
    c => {
      const s = T.serie(c.controle.serie);
      c.controle.faits.find(f => f[0] === 'mode')[1] = F.sTxt(s.effectifs[T.indiceMode(s)]);
    });
  // Viser « l'étendue lue comme la plus grande valeur » ne mordait qu'une fois
  // sur cinq, et pour une raison qui vaut d'être écrite : quand la série
  // commence à 0, l'étendue EST la plus grande valeur. Ce n'était donc pas une
  // falsification, c'était parfois la vérité. On vise la confusion qui, elle,
  // est toujours fausse : l'étendue prise pour le NOMBRE de valeurs.
  pousse('etendue confondue avec le nombre de valeurs', parQuestion(1, 0),
    c => {
      c.controle.faits.find(f => f[0] === 'etendue')[1] =
        String(c.controle.serie.valeurs.length);
    });
  pousse('cumul croissant non cumule (les effectifs recopies)', parQuestion(3, 0),
    c => {
      const s = T.serie(c.controle.serie);
      const f = c.controle.faits.find(x => x[0] === 'cumul-croissant');
      f.length = 1; s.effectifs.forEach(e => f.push(F.sTxt(e)));
    });
  pousse('cumul decroissant pris egal au croissant', parQuestion(3, 0),
    c => {
      const s = T.serie(c.controle.serie);
      const f = c.controle.faits.find(x => x[0] === 'cumul-decroissant');
      f.length = 1; T.cumulCroissant(s).forEach(e => f.push(F.sTxt(e)));
    });
  pousse('angle calcule sur 180 au lieu de 360', parQuestion(4, 0),
    c => {
      const f = c.controle.faits.find(x => x[0] === 'angle');
      f[2] = F.sTxt(F.sEch(F.analyser(String(f[2]), {}), F.rat(1, 2)));
    });
  pousse('pourcentages laisses en frequences', parQuestion(4, 0),
    c => {
      const s = T.serie(c.controle.serie);
      const f = c.controle.faits.find(x => x[0] === 'pourcentages');
      f.length = 1; T.frequences(s).forEach(v => f.push(F.sTxt(v)));
    });
  pousse('centres de classe pris egaux aux bornes inferieures', parQuestion(6, 0),
    c => {
      const s = T.serie(c.controle.serie);
      const f = c.controle.faits.find(x => x[0] === 'centres');
      f.length = 1; s.effectifs.forEach((_, i) => f.push(F.sTxt(s.bornes[i])));
    });
  pousse('probabilite ecrite comme un effectif', parQuestion(8, 0),
    c => {
      const f = c.controle.faits.find(x => x[0] === 'probabilite-sous');
      const g = c.controle.faits.find(x => x[0] === 'sous-seuil');
      f[2] = g[2];
    });

  // ── Les garde-fous du contrat ──────────────────────────────────────────
  pousse('serie sans aucune fait a controler', parQuestion(1, 0),
    c => { c.controle.faits = []; });
  pousse('fait au nom inconnu', parQuestion(1, 0),
    c => { c.controle.faits = [['statistique-magique', '3']]; });
  pousse('serie continue a classes inegales : le mode devient illegitime',
    parQuestion(6, 0), c => {
      c.controle.serie.bornes[1] += 1;
      c.controle.faits.push(['largeurs-egales']);
    });
  pousse('serie discrete donnee en desordre', parQuestion(1, 0),
    c => { const v = c.controle.serie.valeurs; const t = v[0]; v[0] = v[1]; v[1] = t; });

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
  let mauvais = 0;
  const attendu = F.PROBLEMES[n].questions;
  for (let t = 0; t < TIRAGES; t++) {
    const lot = F.tirer(n);
    if (lot.length !== attendu) {
      echecs.push(`العائلة ${n}: ${lot.length} سؤالا بدل ${attendu}`);
      break;
    }
    for (const [i, brut] of lot.entries()) {
      questions++;
      const probs = verifierBrut(brut);
      if (probs.length) {
        mauvais++;
        if (echecs.length < 10) {
          echecs.push(`العائلة ${n} س${i + 1}: ${brut.enonce.join(' | ')}`
            + '\n    - ' + probs.join('\n    - '));
        }
      }
    }
  }
  const titre = `العائلة ${n} — ${F.PROBLEMES[n].titre}`;
  console.log(titre.padEnd(58) + (mauvais ? `✗ ${mauvais} échec(s)` : '✓')
    + `  (${attendu} أسئلة)`);
}

console.log('');
for (const e of echecs) console.log(e);
console.log(`\n${TIRAGES} tirages par famille, ${questions} questions, `
  + `${relations} relations recalculées et ${controles} contrôles, `
  + (echecs.length ? 'ÉCHECS.' : '0 erreur.'));
process.exit(echecs.length ? 1 : 0);
