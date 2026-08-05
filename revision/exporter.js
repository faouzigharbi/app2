// FIGE UNE FICHE ENGENDRÉE EN BIBLIOTHÈQUE D'EXERCICES.
//
//   node exporter.js puiss9 "القوى" 9 [par-case]
//
// Les pages de chaîne engendrent leurs questions à chaque ouverture : deux
// élèves n'ont jamais la même. C'est ce qu'on veut sur écran, et c'est
// exactement ce qu'on ne veut pas sur papier — une feuille de révision doit
// pouvoir être imprimée, corrigée, redistribuée, et rester la même.
//
// On tire donc un LOT, on le dédoublonne, et on l'écrit une fois pour toutes.
// Ce que la bibliothèque gagne au passage, aucune bibliothèque écrite à la
// main ne l'a : ces corrigés sortent du générateur vérifié — chaque relation y
// a été recalculée, et le validateur n'a rien laissé passer.
//
// L'énoncé devient la question, la chaîne d'étapes devient le corrigé.
const fs = require('fs');
const path = require('path');

const dossier = process.argv[2];
const nomChapitre = process.argv[3];
const niveau = Number(process.argv[4] || 9);
const PAR_CASE = Number(process.argv[5] || 30);

if (!dossier || !nomChapitre) {
  console.error('usage: node exporter.js <dossier> "<nom arabe>" [niveau] [par-case]');
  process.exit(1);
}

const racine = path.resolve(__dirname, '..', 'chaines', dossier);
const F = require(path.join(racine, 'noyau.js'));
require(path.join(racine, 'gens.js'));

// On tire jusqu'à ce que la case cesse de se remplir : les familles pauvres
// s'épuisent vite, les riches méritent qu'on insiste. Sans ce garde-fou, une
// case de six énoncés ferait tourner la boucle mille fois pour rien.
function moissonner(n) {
  const vus = new Map();
  let sec = 0;
  for (let tour = 0; tour < 60 && sec < 8 && vus.size < PAR_CASE; tour++) {
    const avant = vus.size;
    let lot = [];
    try { lot = F.tirer(n); } catch (e) { break; }
    for (const q of lot) {
      const cle = q.enonce.join(' | ');
      if (!vus.has(cle)) vus.set(cle, q);
    }
    sec = (vus.size === avant) ? sec + 1 : 0;
  }
  return [...vus.values()].slice(0, PAR_CASE);
}

const echapper = s => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
                               .replace(/\n/g, ' ');

const sortie = [];
let total = 0;
const compte = {};

for (const n of Object.keys(F.PROBLEMES).map(Number).sort((a, b) => a - b)) {
  const def = F.PROBLEMES[n];
  // Le titre porte « famille — difficulté », mais la famille peut elle-même
  // contenir un tiret : « نفس الأسّ — أساسان ». On coupe donc au niveau, pas
  // au premier tiret venu, sinon la rubrique perd la moitié de son nom.
  const rubriqueNom = String(def.titre).split(' — مستوى')[0].trim();
  const lot = moissonner(n);
  compte[rubriqueNom] = (compte[rubriqueNom] || 0) + lot.length;
  lot.forEach((q, i) => {
    total++;
    sortie.push('  { id: ' + JSON.stringify(dossier + '-' + n + '-' + i)
      + ', chapitre: ' + JSON.stringify(dossier)
      + ', chapitreNom: ' + JSON.stringify(nomChapitre)
      + ', niveau: ' + niveau
      + ',\n    rubrique: ' + JSON.stringify(def.famille)
      + ', rubriqueNom: ' + JSON.stringify(rubriqueNom)
      + ', difficulte: ' + JSON.stringify(def.difficulte)
      + ',\n    enonce: ' + JSON.stringify(q.enonce.map(F.rendreMath).join('<br>'))
      + ',\n    correction: ' + JSON.stringify(
          q.etapes.map(e => ({ quoi: F.rendreMath(e[0]), math: F.rendreMath(e[1]) })))
      + ',\n    indice: ' + JSON.stringify(q.indice || '')
      + ', source: ' + JSON.stringify(q.source || '') + ' }');
  });
}

const fichier = path.join(__dirname, 'biblio-' + dossier + '.js');
fs.writeFileSync(fichier,
  '// ENGENDRÉ PAR exporter.js — NE PAS MODIFIER À LA MAIN.\n'
  + '//   node exporter.js ' + dossier + ' "' + nomChapitre + '" ' + niveau + '\n'
  + '// Chaque corrigé sort du générateur vérifié de la fiche « ' + dossier + ' ».\n'
  + 'window.BIBLIO = (window.BIBLIO || []).concat([\n'
  + sortie.join(',\n') + '\n]);\n');

console.log(fichier.replace(process.cwd() + '/', '') + ' — ' + total + ' exercices');
for (const r of Object.keys(compte)) {
  console.log('   ' + String(compte[r]).padStart(4) + '  ' + r);
}
