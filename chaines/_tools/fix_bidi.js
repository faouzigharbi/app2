// Isole chaque expression mathématique en dir="ltr" dans les fichiers de données.
// Sans cette isolation, l'algorithme bidi d'un document RTL inverse l'ordre des
// termes : « 2³×2⁴ » s'affiche « 2⁴×2³ », « = 128 » s'affiche « 128 = ».
const fs = require('fs');
const path = require('path');

const DIR = process.argv[2];
const APPLY = process.argv.includes('--apply');

// Caractères pouvant composer une expression. Les lettres latines sont incluses
// pour les variables (a, n, p) et les noms d'expressions (G, x, t).
const MATH = '[0-9A-Za-z+\\-−*×÷/:=^().,\\[\\]{}²³¹⁰⁴⁵⁶⁷⁸⁹√ ]';
const SUP = '</?sup>';
const RUN = new RegExp(`(?:${SUP}|${MATH})+`, 'g');

// Un « : » collé à du texte arabe est une ponctuation, pas une division.
const trim = s => s.replace(/^[\s:]+/, '').replace(/[\s:.,]+$/, '');

// Ne mérite l'isolation que ce qui peut réellement être réordonné.
function estExpression(s) {
  if (!/\d|<sup>/.test(s)) return false;
  if (/[+\-−*×÷/=^]/.test(s)) return true;
  if (/<\/?sup>/.test(s)) return true;
  if (/\d\s*:\s*\d/.test(s)) return true;   // division « 54 : 9 »
  return false;
}

function isole(str) {
  if (typeof str !== 'string' || str.includes('dir="ltr"')) return str;
  return str.replace(RUN, m => {
    const noyau = trim(m);
    if (!noyau || !estExpression(noyau)) return m;
    const i = m.indexOf(noyau);
    return m.slice(0, i) + `<span dir="ltr">${noyau}</span>` + m.slice(i + noyau.length);
  });
}

// `title` et `hint` transitaient par textContent : on les traite aussi, et on
// bascule les gabarits correspondants sur innerHTML (voir plus bas).
const CHAMPS = ['title', 'prompt', 'operation', 'explanation', 'hint'];
const TABLEAUX = ['steps', 'options'];

let nbFichiers = 0, nbChaines = 0;
const apercu = [];

for (const f of fs.readdirSync(DIR).filter(n => n.endsWith('.js') && !n.startsWith('nat_')).sort()) {
  const p = path.join(DIR, f);
  const src = fs.readFileSync(p, 'utf8');
  if (src.includes('dir="ltr"')) continue;

  const m = src.match(/^const (\w+) = ([\s\S]*);\s*window\.\w+ = \w+;\s*$/);
  if (!m) { console.log(`!! format inattendu : ${f}`); continue; }
  const [, nomVar, json] = m;
  const data = JSON.parse(json);

  let touche = 0;
  const traiter = (obj) => {
    for (const c of CHAMPS) {
      if (typeof obj[c] === 'string') {
        const v = isole(obj[c]);
        if (v !== obj[c]) { if (apercu.length < 12) apercu.push([obj[c], v]); obj[c] = v; touche++; }
      }
    }
    for (const c of TABLEAUX) {
      if (Array.isArray(obj[c])) obj[c] = obj[c].map(x => {
        const v = isole(x);
        if (v !== x) { if (apercu.length < 12) apercu.push([x, v]); touche++; }
        return v;
      });
    }
  };
  traiter(data);
  (data.questions || []).forEach(traiter);

  if (!touche) continue;
  nbFichiers++; nbChaines += touche;
  if (APPLY) {
    fs.writeFileSync(p, `const ${nomVar} = ${JSON.stringify(data, null, 2)};\nwindow.${nomVar} = ${nomVar};\n`);
  }
}

// Les gabarits chaîne injectaient le titre et l'aide via textContent : les balises
// s'affichaient alors en clair (« a<sup>n</sup>×a<sup>p</sup> »).
let nbGabarits = 0;
for (const f of fs.readdirSync(DIR).filter(n => /_chaine_.*\.html$/.test(n)).sort()) {
  const p = path.join(DIR, f);
  let src = fs.readFileSync(p, 'utf8');
  const avant = src;
  src = src.replace("document.getElementById('title').textContent = data.title;",
                    "document.getElementById('title').innerHTML = data.title;");
  src = src.replace("hint.textContent = '💡 ' + q.hint;",
                    "hint.innerHTML = '💡 ' + q.hint;");
  src = src.replace("hint.textContent = '💡 المرحلة الأولى هي: ' + q.steps[0];",
                    "hint.innerHTML = '💡 المرحلة الأولى هي: ' + q.steps[0];");
  // Le <title> du navigateur est du texte brut : les balises y sont illisibles.
  src = src.replace(/<title>([\s\S]*?)<\/title>/,
                    (_, t) => `<title>${t.replace(/<\/?sup>/g, '')}</title>`);
  if (src !== avant) { nbGabarits++; if (APPLY) fs.writeFileSync(p, src); }
}

console.log('--- aperçu des transformations ---');
apercu.forEach(([a, b]) => console.log(`  ${a}\n→ ${b}\n`));
console.log(`${nbChaines} chaîne(s) isolée(s) dans ${nbFichiers} fichier(s) de données.`);
console.log(`${nbGabarits} gabarit(s) chaîne basculé(s) sur innerHTML.`);
console.log(APPLY ? '>> écrit sur disque' : '>> simulation (ajouter --apply)');
