// FIGE LES FICHES ENGENDRÉES EN BIBLIOTHÈQUES D'EXERCICES.
//
//   node exporter.js --tout                    toutes les fiches exportables
//   node exporter.js puiss9                    une seule
//   node exporter.js puiss9 "القوى" 9 30       en forçant nom, niveau, quantité
//
// Les pages de chaîne engendrent leurs questions à chaque ouverture : deux
// élèves n'ont jamais la même. C'est ce qu'on veut sur écran, et c'est
// exactement ce qu'on ne veut pas sur papier — une feuille de révision doit
// pouvoir être imprimée, corrigée, redistribuée, et rester la même.
//
// On tire donc un LOT, on le dédoublonne, et on l'écrit une fois pour toutes.
// Ce que la bibliothèque gagne au passage, aucune bibliothèque écrite à la
// main ne l'a : ces corrigés sortent des générateurs vérifiés — chaque
// relation y a été recalculée, et les validateurs n'ont rien laissé passer.
//
// L'énoncé devient la question, la chaîne d'étapes devient le corrigé.
//
// LES VINGT-ET-UNE FICHES NE SE RESSEMBLENT PAS. Elles ont été écrites sur
// deux ans, et leur charpente a bougé : le registre s'appelle PROBLEMES ici,
// PREUVES là, EXERCICES ailleurs ; il vit dans noyau.js, ou dans arith.js ;
// il est VIDE au chargement et se remplit ensuite. On ne les réécrit pas —
// on les relit, et l'on prend ce qui répond.
const fs = require('fs');
const path = require('path');

const CHAINES = path.resolve(__dirname, '..', 'chaines');
const ICI = __dirname;
const PAR_CASE_DEFAUT = 20;

// ── Charger une fiche ────────────────────────────────────────────────────
//
// L'ordre de chargement est celui que la fiche s'impose à elle-même, et il est
// écrit dans son validateur : on le lui emprunte plutôt que de le deviner. On
// s'arrête avant erreurs.js et juge.js — ils servent aux pages « أين الخطأ؟ »,
// pas aux chaînes.
function modulesDe(dossier) {
  const v = path.join(CHAINES, dossier, 'verifier.js');
  if (!fs.existsSync(v)) return null;
  const mods = [];
  for (const m of fs.readFileSync(v, 'utf8').match(/require\('\.\/[\w.-]+'\)/g) || []) {
    const f = m.slice(11, -2);
    if (f === 'erreurs.js' || f === 'juge.js' || f === 'pont.js') break;
    mods.push(f);
  }
  // Certaines fiches chargent leurs générateurs dans une boucle —
  // « require('./gen' + n + '.js') » — que la lecture du texte ne voit pas.
  for (const g of fs.readdirSync(path.join(CHAINES, dossier))
                    .filter(x => /^gen\d+\.js$/.test(x)).sort()) {
    if (mods.indexOf(g) < 0) mods.push(g);
  }
  return mods;
}

function charger(dossier) {
  const mods = modulesDe(dossier);
  if (!mods) return null;
  const charges = [];
  for (const m of mods) {
    try { charges.push(require(path.join(CHAINES, dossier, m))); }
    catch (e) { return { erreur: m + ' : ' + e.message }; }
  }
  // Le registre est vide à l'instant du chargement — ce sont les générateurs,
  // chargés après, qui le remplissent. On ne peut donc le reconnaître qu'APRÈS
  // coup, et l'on garde celui qui s'est rempli.
  for (const nom of ['PROBLEMES', 'PREUVES', 'EXERCICES']) {
    const M = charges.find(r => r && r[nom] && Object.keys(r[nom]).length);
    if (M) {
      const bati = charges.find(r => r && typeof r.construire === 'function');
      if (!bati) return { erreur: 'aucun construire()' };
      return { registre: M[nom], construire: bati.construire.bind(bati) };
    }
  }
  return { erreur: 'aucun registre' };
}

// ── Une question rendue ──────────────────────────────────────────────────
//
// Toutes les fiches savent RENDRE une page : construire(n) donne des questions
// { operation, steps, hint } déjà mises en HTML — c'est ce que la page affiche.
// On part de là : c'est le seul point sur lequel elles s'accordent toutes.
//
// Une étape est « libellé: mathématique ». Le libellé est ce qui précède le
// PREMIER deux-points ; ce qui suit peut en contenir d'autres — « 6 : 3 = 2 »
// est une division, pas une seconde étiquette.
// Les fiches les plus anciennes portent leur mise en forme EN LIGNE, sur
// chaque expression — « style="display:inline-block;white-space:nowrap" », une
// cinquantaine de caractères répétés des dizaines de milliers de fois. La
// classe .expr dit la même chose, et la feuille de style de la page la
// définit déjà. On normalise : même rendu, un mégaoctet et demi de moins.
const normaliser = s => String(s)
  .replace(/\s*style="display:inline-block;\s*white-space:nowrap"/g, ' class="expr"')
  .replace(/dir="ltr" class="expr" class="expr"/g, 'dir="ltr" class="expr"');

function couper(etape) {
  const s = String(etape);
  const k = s.indexOf(':');
  if (k < 0) return { quoi: '', math: normaliser(s).trim() };
  return { quoi: s.slice(0, k).trim(), math: normaliser(s.slice(k + 1)).trim() };
}

// ── Moissonner ───────────────────────────────────────────────────────────
//
// On tire jusqu'à ce que la page cesse de se renouveler : les familles pauvres
// s'épuisent vite, les riches méritent qu'on insiste. Sans ce garde-fou, une
// case de six énoncés ferait tourner la boucle mille fois pour rien.
function moissonner(construire, n, parCase) {
  const vus = new Map();
  let sec = 0;
  for (let tour = 0; tour < 60 && sec < 8 && vus.size < parCase; tour++) {
    const avant = vus.size;
    let page;
    try { page = construire(n); } catch (e) { break; }
    for (const q of (page && page.questions) || []) {
      if (!q || !q.operation || !q.steps || !q.steps.length) continue;
      if (!vus.has(q.operation)) vus.set(q.operation, q);
    }
    sec = (vus.size === avant) ? sec + 1 : 0;
  }
  return [...vus.values()].slice(0, parCase);
}

// ── Le niveau et le nom, lus sur la fiche ────────────────────────────────
// Une fiche dont les pages ne sont pas encore bâties n'a pas de <title> à
// lire. On la nomme ici, en attendant qu'elle le fasse elle-même.
const NOMS = { puiss9: 'القوى', droites7: 'التعامد و التوازي',
               angles7: 'الزوايا',
               thales9: 'طالس و بيتاغور',
               proport9: 'التناسب — أكمل الكسور',
               canonique9: 'الشكل القانوني و المعادلات' };

function titreDe(dossier) {
  if (NOMS[dossier]) return NOMS[dossier];
  const i = path.join(CHAINES, dossier, 'index.html');
  if (fs.existsSync(i)) {
    const m = /<title>([^<]*)<\/title>/.exec(fs.readFileSync(i, 'utf8'));
    if (m) return m[1].split('—')[0].trim() || m[1].trim();
  }
  return dossier;
}
function niveauDe(dossier) {
  const m = /([789])$/.exec(dossier);
  if (m) return Number(m[1]);
  const t = titreDe(dossier) + ' ' + (fs.existsSync(path.join(CHAINES, dossier, 'index.html'))
    ? fs.readFileSync(path.join(CHAINES, dossier, 'index.html'), 'utf8').slice(0, 2000) : '');
  const n = /([789])\s*أساسي/.exec(t);
  return n ? Number(n[1]) : 9;
}

// ── Écrire une bibliothèque ──────────────────────────────────────────────
function exporter(dossier, nom, niveau, parCase) {
  const f = charger(dossier);
  if (!f) return { dossier, erreur: 'pas de verifier.js' };
  if (f.erreur) return { dossier, erreur: f.erreur };

  const lignes = [];
  let total = 0;
  for (const n of Object.keys(f.registre).map(Number).sort((a, b) => a - b)) {
    const def = f.registre[n];
    // « famille — مستوى صعب » : on coupe au niveau, pas au premier tiret venu,
    // sinon « نفس الأسّ — أساسان » perd la moitié de son nom.
    const rubriqueNom = String(def.titre || ('التمرين ' + n)).split(' — مستوى')[0].trim();
    for (const [i, q] of moissonner(f.construire, n, parCase).entries()) {
      total++;
      lignes.push('  { id: ' + JSON.stringify(dossier + '-' + n + '-' + i)
        + ', chapitre: ' + JSON.stringify(dossier)
        + ', chapitreNom: ' + JSON.stringify(nom)
        + ', niveau: ' + niveau
        + ',\n    rubrique: ' + JSON.stringify(def.famille || ('ex' + n))
        + ', rubriqueNom: ' + JSON.stringify(rubriqueNom)
        // La difficulté n'est déclarée que par les fiches qui la connaissent.
        // Ailleurs elle est VIDE, et une case vide se tire à tous les niveaux :
        // mieux vaut ne rien dire que d'inventer un niveau.
        + ', difficulte: ' + JSON.stringify(def.difficulte || '')
        + ',\n    enonce: ' + JSON.stringify(normaliser(q.operation))
        + ',\n    correction: ' + JSON.stringify(q.steps.map(couper))
        + ',\n    indice: ' + JSON.stringify(q.hint || '') + ' }');
    }
  }
  if (!total) return { dossier, erreur: 'aucune question' };

  const fichier = path.join(ICI, 'biblio-' + dossier + '.js');
  fs.writeFileSync(fichier,
    '// ENGENDRÉ PAR exporter.js — NE PAS MODIFIER À LA MAIN.\n'
    + '//   node exporter.js ' + dossier + ' ' + JSON.stringify(nom) + ' ' + niveau + '\n'
    + '// Corrigés issus du générateur vérifié de la fiche « ' + dossier + ' ».\n'
    + 'window.BIBLIO = (window.BIBLIO || []).concat([\n'
    + lignes.join(',\n') + '\n]);\n');
  return { dossier, nom, niveau, total, octets: fs.statSync(fichier).size };
}

// ── La liste des <script> dans index.html, tenue à jour toute seule ──────
function recoudre() {
  const p = path.join(ICI, 'index.html');
  // biblio-perso.js n'est pas engendré : il est écrit à la main, et il passe
  // en DERNIER pour que ce que le maître ajoute prime à l'affichage.
  const tous = fs.readdirSync(ICI).filter(x => /^biblio-.*\.js$/.test(x)).sort();
  const fichiers = tous.filter(x => x !== 'biblio-perso.js')
    .concat(tous.includes('biblio-perso.js') ? ['biblio-perso.js'] : []);
  // ── L'INVENTAIRE SÉPARÉ DES EXERCICES ────────────────────────────────
  //
  // Vingt-sept bibliothèques font 8,7 Mo, et le navigateur les analysait TOUTES
  // à l'ouverture : vingt secondes d'écran blanc pour un élève qui va cocher
  // deux rubriques. On n'écrit donc plus qu'un manifeste — chapitres,
  // rubriques, effectifs par difficulté —, quelques dizaines de kilo-octets ;
  // les exercices eux-mêmes ne sont chargés qu'au moment du tirage, et
  // seulement ceux des chapitres choisis.
  // Le classement, s'il existe : il dit quelle fiche rejoint quel chapitre.
  let CL = {};
  try {
    const bacCL = {};
    new Function('window', fs.readFileSync(path.join(ICI, 'classement.js'), 'utf8'))
      .call(bacCL, bacCL);
    CL = bacCL.CLASSEMENT || {};
  } catch (e) { /* pas de classement : chaque fiche reste où elle est */ }

  const parCle = {};
  const inventaire = [];
  for (const f of fichiers) {
    const bac = {};
    const faux = { window: bac };
    faux.window.BIBLIO = [];
    try {
      new Function('window', fs.readFileSync(path.join(ICI, f), 'utf8')).call(bac, bac);
    } catch (e) { console.log('⚠  ' + f + ' illisible : ' + e.message); continue; }
    const ex = bac.BIBLIO || [];
    for (const x of ex) {
      const cl = CL[x.chapitre] || {};
      const cle = cl.vers || x.chapitre;
      let c = parCle[cle];
      if (!c) {
        c = parCle[cle] = { cle, nom: cl.nom || x.chapitreNom, niveau: x.niveau,
                            fichiers: [], rubriques: {} };
        inventaire.push(c);
      }
      // Une fiche accueillie garde le nom du chapitre d'accueil, jamais le
      // sien — sans quoi le regroupement ne servirait à rien.
      if (!cl.vers && !cl.nom) c.nom = x.chapitreNom;
      if (cl.nom && !cl.vers) c.nom = cl.nom;
      if (c.fichiers.indexOf(f) < 0) c.fichiers.push(f);
      // L'ÉTIQUETTE. Une rubrique venue d'une série de révision le dit, et
      // porte le nom de sa fiche d'origine : l'élève doit pouvoir revenir à
      // la feuille dont l'exercice sort.
      const rk = x.chapitre + '|' + x.rubrique;
      const r = c.rubriques[rk] || (c.rubriques[rk] = {
        cle: x.rubrique, source: x.chapitre, nom: x.rubriqueNom,
        revision: !!cl.revision, origine: cl.revision ? x.chapitreNom : '',
        n: 0, diff: {} });
      r.n++;
      const d = x.difficulte || '';
      r.diff[d] = (r.diff[d] || 0) + 1;
    }
  }
  for (const c of inventaire) c.rubriques = Object.values(c.rubriques);
  inventaire.sort((a, b) => (a.niveau - b.niveau) || a.cle.localeCompare(b.cle));
  fs.writeFileSync(path.join(ICI, 'index-biblio.js'),
    '// ENGENDRÉ PAR exporter.js — l’inventaire seul, sans les exercices.\n'
    + '// Il sert à bâtir le sélecteur ; les bibliothèques ne sont chargées\n'
    + '// qu’au tirage, et seulement celles dont on a besoin.\n'
    + 'window.INVENTAIRE = ' + JSON.stringify(inventaire) + ';\n');
  const ko = Math.round(fs.statSync(path.join(ICI, 'index-biblio.js')).size / 1024);
  console.log('index-biblio.js — ' + inventaire.length + ' chapitres, ' + ko + ' Ko.');
  const bloc = '<script src="index-biblio.js"></script>';
  const html = fs.readFileSync(p, 'utf8');
  const REPERES = /<!-- BIBLIOS -->[\s\S]*?<!-- \/BIBLIOS -->/;
  // On vérifie que les repères EXISTENT — et non que le texte a changé.
  // Recoudre un bloc déjà juste ne le change pas, et ce n'est pas une panne.
  if (!REPERES.test(html)) {
    console.log('⚠  les repères <!-- BIBLIOS --> sont absents d’index.html :');
    console.log(bloc);
    return;
  }
  fs.writeFileSync(p, html.replace(REPERES,
    '<!-- BIBLIOS -->\n' + bloc + '\n<!-- /BIBLIOS -->'));
  console.log('index.html recousu — ' + fichiers.length + ' bibliothèques.');
}

// ── Entrée ───────────────────────────────────────────────────────────────
const arg = process.argv[2];
if (!arg) {
  console.error('usage: node exporter.js --tout | <dossier> ["<nom>"] [niveau] [par-case]');
  process.exit(1);
}

const faits = [], rates = [];
if (arg === '--tout') {
  const parCase = Number(process.argv[3] || PAR_CASE_DEFAUT);
  for (const d of fs.readdirSync(CHAINES).sort()) {
    if (d[0] === '_' || !fs.statSync(path.join(CHAINES, d)).isDirectory()) continue;
    const r = exporter(d, titreDe(d), niveauDe(d), parCase);
    (r.erreur ? rates : faits).push(r);
  }
} else {
  const r = exporter(arg, process.argv[3] || titreDe(arg),
                     Number(process.argv[4] || niveauDe(arg)),
                     Number(process.argv[5] || PAR_CASE_DEFAUT));
  (r.erreur ? rates : faits).push(r);
}

let n = 0, o = 0;
for (const r of faits) {
  n += r.total; o += r.octets;
  console.log('  ' + String(r.total).padStart(5) + '  ' + String(r.niveau) + 'ème  '
    + r.dossier.padEnd(15) + r.nom);
}
console.log('\n' + faits.length + ' bibliothèques, ' + n + ' exercices, '
  + Math.round(o / 1024) + ' Ko.');
for (const r of rates) console.log('  ✗ ' + r.dossier.padEnd(15) + r.erreur);
if (faits.length) recoudre();
