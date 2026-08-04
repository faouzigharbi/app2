// Le second temps du porteur : la PAGE et le MODE DE VALIDATION.
//
//   node _regles/porter-pages.js <dossier> <global> <badge> <modules…>
//
//   modules — les scripts que la page doit charger, dans l'ordre, en plus de
//             noyau.js, gens.js, juge.js et erreurs.js.
//
// Il écrit `_build_erreurs.js` et ajoute au validateur son mode ERREURS, celui
// qui contrôle les quatre choses : la faute plantée est fausse, toute autre
// étape est vraie, le compte est celui du niveau, et la bonne réécriture est
// vraie quand chaque leurre est faux.
const fs = require('fs');
const path = require('path');

const [, , dossier, global, badge, ...modules] = process.argv;
const OUT = path.resolve(dossier);
const R = path.join(__dirname, 'gabarit-pages.js');

let page = fs.readFileSync(R, 'utf8');
// Certaines fiches n'ont pas de `gens.js` : leurs pages sont déclarées dans des
// genNN.js, un par exercice. Le porteur reprend ce que la fiche a réellement.
const aGens = fs.existsSync(path.join(OUT, 'gens.js'));
const gens = aGens ? ['gens.js']
                   : fs.readdirSync(OUT).filter(f => /^gen\d+\.js$/.test(f)).sort();
page = page.replace('//GENS//', gens.map(m => "require('./" + m + "');").join('\n'));
page = page.replace('//GENSHTML//', gens.map(m => '<script src="' + m + '"></script>').join('\n'));
page = page.replace('//MODULES//', modules.map(m => "require('./" + m + "');").join('\n'));
page = page.replace('//SCRIPTS//', modules.map(m => '<script src="' + m + '"></script>').join('\n'));
page = page.replace(/\/\/BADGE\/\//g, badge);
page = page.replace('//GLOBAL//', global);
fs.writeFileSync(path.join(OUT, '_build_erreurs.js'), page);

const vp = path.join(OUT, 'verifier.js');
let v = fs.readFileSync(vp, 'utf8');
if (v.indexOf('process.env.ERREURS') < 0) {
  let bloc = fs.readFileSync(path.join(__dirname, 'gabarit-verif.js'), 'utf8');
  bloc = bloc.replace("const E = require('./erreurs.js');",
                      "const E = require('./erreurs.js');\n  const J = require('./juge.js');");
  bloc = bloc.replace(/F\.environnements\(c\)/g, 'J.environnements(c)');
  bloc = bloc.replace(/F\.evaluerEtape\(/g, 'J.evaluerEtape(');
  // On insère avant la première fonction de vérification, donc avant que le
  // validateur ne se mette à tirer : le mode ERREURS sort par process.exit.
  const anchor = v.match(/\nfunction verifier[A-Za-z]*\(/);
  if (!anchor) { console.error('point d’insertion introuvable dans ' + vp); process.exit(1); }
  v = v.slice(0, anchor.index + 1) + bloc + v.slice(anchor.index + 1);
  fs.writeFileSync(vp, v);
  console.log('verifier.js — mode ERREURS ajouté');
} else console.log('verifier.js — mode ERREURS déjà présent');
console.log('_build_erreurs.js — page écrite');
