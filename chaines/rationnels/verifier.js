// Valide les treize séries sur un grand nombre de tirages.
//   node verifier.js [tirages]
//
// Deux régimes de contrôle :
//
//   • numérique — toute comparaison ou égalité écrite dans une étape est
//     recalculée en arithmétique rationnelle exacte ;
//   • littéral — une comparaison comme « a + 1/2 < a + 2/3 » n'a pas de valeur
//     à recalculer : elle est testée sur des CENTAINES de valeurs tirées au
//     hasard pour la variable, en respectant l'hypothèse quand il y en a une.
//     Si l'énoncé est faux pour un seul a, ça se voit.
//
// Contrôlé en plus, sur chaque instance :
//   – une part mathématique ne mélange jamais arabe et symboles ;
//   – la dernière étape annonce bien le résultat ;
//   – aucune étape dupliquée ;
//   – l'affirmation propre à la famille (tri, encadrement, relation…).
const F = require('./frac.js');
for (let n = 1; n <= 13; n++) require('./gen' + String(n).padStart(2, '0') + '.js');

const TIRAGES = Number(process.argv[2]) || 200;
const ECHANTILLONS = 120;
const COMPARAISON = /[<>≤≥=]/;

let controles = 0, instances = 0, echantillons = 0;
const echecs = [];

// Un jeu de valeurs au hasard pour les variables, respectant l'hypothèse.
function environnement(vars, contrainte) {
  for (let essai = 0; essai < 200; essai++) {
    const env = {};
    for (const v of vars) env[v] = F.ratAleatoire(25, 15);
    if (!contrainte) return env;
    const m = contrainte.split(/\s*([<>≤≥])\s*/);
    const r = F.cmp(env[m[0].trim()], env[m[2].trim()]);
    const ok = { '<': r < 0, '>': r > 0, '≤': r <= 0, '≥': r >= 0 }[m[1]];
    if (ok) return env;
  }
  return null;
}

function partiesVerifiables(math) {
  return String(math).split(';').map(x => x.trim())
    // « = -6 » est la déclaration finale, sans membre gauche : elle est
    // contrôlée par la règle « la dernière étape annonce le résultat ».
    .filter(x => x && COMPARAISON.test(x) && !F.ARABE.test(x)
                 && !x.includes('|') && !/^[<>≤≥=]/.test(x));
}

function verifierBrut(n, brut) {
  const probs = [];
  let verifiees = 0;
  const c = brut.controle;
  // Le type « relation » comporte lui aussi une identité valable pour tout x
  // et tout y : il demande donc le même échantillonnage.
  const litteral = c.type === 'litteral' || c.type === 'relation';
  const vars = c.vars || ['x', 'y'];

  // Aucune part ne doit mêler arabe et symboles : le rendu s'appuie dessus.
  for (const [, math] of brut.etapes) {
    if (F.ARABE.test(math) && /[<>≤≥=+×]/.test(math)) {
      probs.push('جزء يخلط العربية والرموز: « ' + math + ' »');
    }
  }

  const envs = litteral
    ? Array.from({ length: ECHANTILLONS }, () => environnement(vars, c.contrainte))
    : [{}];
  if (envs.some(e => e === null)) { probs.push('تعذّر توليد قيم تحقّق الفرضية'); return probs; }

  for (const env of envs) {
    if (litteral) echantillons++;
    brut.etapes.forEach(([label, math], i) => {
      for (const part of partiesVerifiables(math)) {
        try {
          const r = F.verifierComparaison(part, env);
          if (r) probs.push(`م${i + 1}: ${r}`);
          if (env === envs[0]) { verifiees++; controles++; }
        } catch (e) { probs.push(`م${i + 1}: تعذّر تحليل « ${part} » — ${e.message}`); }
      }
    });
    // Les égalités de réduction, quand la famille en déclare.
    for (const eq of (c.egalites || [])) {
      const r = F.verifierComparaison(eq, env);
      if (r) probs.push('اختصار فاسد: ' + r);
      controles++;
    }
    if (c.egalite) {
      const r = F.verifierComparaison(c.egalite, environnement(['x', 'y']));
      if (r) probs.push('عاملٌ مشترك فاسد: ' + r);
      controles++;
    }
    if (probs.length > 4) break;
  }

  if (verifiees < 1) probs.push('لا توجد مرحلة قابلة للتحقق');

  // La dernière étape doit annoncer le résultat.
  const derniere = String(brut.etapes[brut.etapes.length - 1][1]).trim();
  if (derniere !== brut.res && derniere !== '= ' + brut.res) {
    probs.push(`المرحلة الأخيرة « ${derniere} » لا تطابق النتيجة « ${brut.res} »`);
  }

  probs.push(...controlerFamille(c));
  controles++;

  const textes = brut.etapes.map(e => e.join(': '));
  if (new Set(textes).size !== textes.length) probs.push('مراحل مكرّرة');
  if (textes.length < 4) probs.push('السلسلة قصيرة جدا');
  return probs;
}

// Chaque famille revérifie son affirmation, sans passer par le générateur.
function controlerFamille(c) {
  const p = [];
  const R = s => F.analyser(s, {});
  if (c.type === 'compare') {
    const r = F.cmp(R(c.a), R(c.b));
    const attendu = c.op === '<' ? -1 : 1;
    if (r !== attendu) p.push(`الترتيب المعلن ${c.op} خاطئ`);
  } else if (c.type === 'tri') {
    const trie = c.liste.map(R).sort(F.cmp).map(F.txt);
    if (trie.join(',') !== c.tri.join(',')) p.push('الترتيب التصاعدي خاطئ');
  } else if (c.type === 'intercaler') {
    const a = R(c.a), b = R(c.b);
    let prec = a;
    for (const m of c.milieux) {
      const v = R(m);
      if (F.cmp(prec, v) >= 0) p.push(`${m} ليس أكبر قطعا من السابق`);
      prec = v;
    }
    if (F.cmp(prec, b) >= 0) p.push('آخر عدد ليس أصغر قطعا من الحدّ الأعلى');
    if (new Set(c.milieux.map(m => F.txt(R(m)))).size !== c.milieux.length) {
      p.push('أعداد مكرّرة');
    }
  } else if (c.type === 'relation') {
    // On tire x et y vérifiant la relation, puis on recalcule l'expression.
    const k = R(c.k);
    for (let i = 0; i < 40; i++) {
      const x = F.ratAleatoire(20, 9);
      const y = F.div(F.sub(k, F.mul(F.rat(c.p), x)), F.rat(c.q));
      const A = F.add(F.add(F.mul(F.rat(c.m * c.p), x), F.mul(F.rat(c.m * c.q), y)), F.rat(c.c));
      if (!F.egaux(A, R(c.total))) { p.push('قيمة العبارة لا تطابق'); break; }
    }
  } else if (c.type === 'ensemble') {
    const bas = R(c.bas), haut = R(c.haut);
    const vrais = c.E.map(R).filter(x => F.cmp(bas, x) < 0 && F.cmp(x, haut) <= 0).map(F.txt);
    if (vrais.join(',') !== c.gardes.join(',')) p.push('قائمة العناصر المقبولة خاطئة');
  }
  return p;
}

for (let n = 1; n <= 13; n++) {
  let mauvais = 0;
  const vus = new Set();
  for (let t = 0; t < TIRAGES; t++) {
    for (const brut of F.tirer(n)) {
      instances++;
      vus.add(brut.enonce.join(' '));
      const probs = verifierBrut(n, brut);
      if (probs.length) {
        mauvais++;
        if (echecs.length < 12) {
          echecs.push(`ex${n}: ${brut.enonce.join(' ')}\n    - ` + probs.slice(0, 4).join('\n    - '));
        }
      }
    }
  }
  console.log(`ex${String(n).padStart(2)} — ${F.PROBLEMES[n].titre}`
    + `  ${mauvais ? '✗ ' + mauvais + ' échec(s)' : '✓'}  (${vus.size} énoncés distincts)`);
}

if (echecs.length) console.log('\n' + echecs.join('\n'));
console.log(`\n${instances} instances tirées, ${controles} contrôles`
  + ` dont ${echantillons} évaluations littérales échantillonnées,`
  + ` ${echecs.length ? 'ÉCHECS' : '0 erreur'}.`);
process.exit(echecs.length ? 1 : 0);
