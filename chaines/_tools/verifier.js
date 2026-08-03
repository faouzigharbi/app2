// Valide le contenu des 4 chapitres.
//   node _tools/verifier.js .
//
// Contrôles, pour chaque question :
//   1. l'expression de l'énoncé, calculée directement, donne bien le résultat
//      annoncé par la chaîne — l'astuce et le calcul brut doivent concorder ;
//   2. chaque étape de la chaîne qui est une expression vaut le résultat final,
//      et chaque étape qui est une égalité est exacte ;
//   3. aucun résultat négatif, aucune division inexacte à l'intérieur d'une chaîne ;
//   4. aucune étape dupliquée — l'ordre attendu doit être unique ;
//   5. les fichiers générés contiennent bien le même nombre de questions.
const fs = require('fs');
const path = require('path');
const M = require('./moteur');
const { chapitres } = require('./donnees');
const PEDAGOGIE = require('../serie1/pedagogie.js');

const DIR = process.argv[2] || '.';
const PUR = /^[\d\s+\-*×÷/:=().[\]]+$/;

let erreurs = 0, ok = 0;
const signes = [];

function chaineDe(item) {
  switch (item.type) {
    case 'priorite':  return M.chainePriorite(item.expr);
    case 'commun':    return M.chaineCommun(item);
    case 'regroupe':  return M.chaineRegroupe(item);
    case 'serie':     return M.chaineSerie(item);
    case 'facteur':   return M.chaineFacteur(item);
    case 'blanc':     return M.chaineBlanc(item);
  }
  throw new Error('type inconnu: ' + item.type);
}

for (const ch of chapitres) {
  for (const [niv, items] of Object.entries(ch.data)) {
    for (const item of items) {
      const nom = `${ch.id}/${niv}/${item.nom}`;
      const probs = [];
      let chaine;
      try { chaine = chaineDe(item); }
      catch (e) { console.log(`✗ ${nom} — ${e.message}`); erreurs++; continue; }

      const res = chaine.res;
      if (!Number.isInteger(res)) probs.push(`النتيجة ليست عددا صحيحا: ${res}`);
      if (res <= 0) probs.push(`النتيجة ليست موجبة: ${res}`);

      // 1) l'astuce doit donner le même résultat que le calcul direct
      if (item.expr && !/\.\.\./.test(item.expr)) {
        const bad = [];
        try {
          const direct = M.evalNat(item.expr, bad);
          if (direct !== res) probs.push(`الحساب المباشر يعطي ${direct} والسلسلة تعطي ${res}`);
          // Parenthèse négative si on calcule littéralement : l'astuce l'évite.
          if (bad.some(b => /سالبة/.test(b))) signes.push(`${nom}: ${item.expr}`);
          probs.push(...bad.filter(b => /تامّة/.test(b)));
        } catch (e) { probs.push('تعذّر حساب العبارة: ' + e.message); }
      }

      // 2-3) cohérence interne de la chaîne
      chaine.etapes.forEach(([label, math], i) => {
        const t = String(math).trim();
        if (!PUR.test(t) || !/\d/.test(t)) return;         // étape en toutes lettres
        const bad = [];
        if (t.includes('=')) {
          const k = t.indexOf('=');
          const gauche = t.slice(0, k).trim(), droite = t.slice(k + 1).trim();
          if (!gauche) {                                    // « = 42 » : la conclusion
            if (Number(droite) !== res) probs.push(`م${i + 1}: تعلن ${droite} بدل ${res}`);
            return;
          }
          try {
            const v = M.evalNat(gauche, bad);
            if (v !== M.evalNat(droite, bad)) probs.push(`م${i + 1}: ${t} خاطئة (${v})`);
          } catch (e) { probs.push(`م${i + 1}: تعذّر التحقق من « ${t} »`); }
        } else {
          try {
            const v = M.evalNat(t, bad);
            if (v !== res) probs.push(`م${i + 1}: « ${t} » = ${v} ولا يساوي ${res}`);
          } catch (e) { probs.push(`م${i + 1}: تعذّر حساب « ${t} »`); }
        }
        probs.push(...bad.map(b => `م${i + 1}: ${b}`));
      });

      // 4) unicité de l'ordre
      const textes = chaine.etapes.map(e => e.join(': '));
      if (new Set(textes).size !== textes.length) probs.push('مراحل مكرّرة: الترتيب غير وحيد');
      if (textes.length < 3) probs.push('السلسلة قصيرة جدا');

      if (probs.length) { erreurs++; console.log(`✗ ${nom} — ${item.expr || item.enonce}\n    - ` + probs.join('\n    - ')); }
      else ok++;
    }
  }
}

// 5) les fichiers générés
let fichiers = 0, questions = 0;
for (const ch of chapitres) {
  for (const niv of Object.keys(ch.data)) {
    const p = path.join(DIR, `${ch.id}_chaine_${niv}_1.js`);
    if (!fs.existsSync(p)) { console.log(`✗ fichier manquant : ${p}`); erreurs++; continue; }
    const w = {};
    new Function('window', fs.readFileSync(p, 'utf8'))(w);
    const n = w.exerciceData.questions.length;
    if (n !== ch.data[niv].length) {
      console.log(`✗ ${ch.id}_${niv} : ${n} questions au lieu de ${ch.data[niv].length}`); erreurs++;
    }
    // chaque expression doit être isolée en dir="ltr", et la méthode tenir
    for (const q of w.exerciceData.questions) {
      for (const m of PEDAGOGIE.controler(q)) {
        console.log(`✗ ${ch.id}_${niv} : ${m}`); erreurs++;
      }
      for (const s of [q.operation, ...q.steps]) {
        const nu = s.replace(/<span dir="ltr"[^>]*>[\s\S]*?<\/span>/g, '');
        if (/\d\s*[+\-*×÷]\s*\d|\d\s*=/.test(nu)) {
          console.log(`✗ ${ch.id}_${niv} : expression non isolée — ${s}`); erreurs++;
        }
      }
    }
    fichiers++; questions += n;
  }
}

if (signes.length) {
  console.log(`\nℹ ${signes.length} opération(s) dont une parenthèse serait négative si on la calculait`);
  console.log('  littéralement. La chaîne applique la règle et ne la calcule jamais :');
  signes.forEach(s => console.log('   • ' + s));
}

console.log(`\n${ok} question(s) valides, ${erreurs} en erreur.`);
console.log(`${fichiers} fichiers générés, ${questions} questions.`);
process.exit(erreurs ? 1 : 0);
