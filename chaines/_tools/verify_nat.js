// Validateur : vérifie que chaque chaîne est mathématiquement exacte
// et que TOUT reste dans les entiers naturels (aucun négatif, aucune décimale).
const fs = require('fs');
const path = require('path');

const DIR = process.argv[2];
const strip = s => s.replace(/<[^>]+>/g, '');
const toJs = s => s.replace(/×/g, '*').replace(/:/g, '/').replace(/[[\]]/g, m => (m === '[' ? '(' : ')')).replace(/−/g, '-');
const NUMOP = /^[\d\s+\-*/().]+$/;

let erreurs = 0, ok = 0;

// Évalue en refusant toute valeur intermédiaire non entière ou négative.
function evalNat(js) {
  const bad = [];
  // parenthèses les plus internes d'abord
  let e = js.trim();
  let guard = 0;
  while (/\(/.test(e)) {
    if (++guard > 50) throw new Error('boucle');
    e = e.replace(/\(([^()]*)\)/, (_, inner) => {
      const v = evalFlat(inner, bad);
      return String(v);
    });
  }
  const v = evalFlat(e, bad);
  return { valeur: v, anomalies: bad };
}

// Évalue une expression sans parenthèses, en contrôlant chaque étape.
function evalFlat(e, bad) {
  const toks = e.match(/\d+|[+\-*/]/g);
  if (!toks) throw new Error('vide: ' + e);
  // passe 1 : * et /
  const p1 = [toks[0]];
  for (let i = 1; i < toks.length; i += 2) {
    const op = toks[i], b = Number(toks[i + 1]);
    if (op === '*' || op === '/') {
      const a = Number(p1.pop());
      const r = op === '*' ? a * b : a / b;
      if (op === '/' && !Number.isInteger(r)) bad.push(`قسمة غير تامّة: ${a} : ${b}`);
      p1.push(String(r));
    } else {
      p1.push(op, String(b));
    }
  }
  // passe 2 : + et - de gauche à droite
  let acc = Number(p1[0]);
  for (let i = 1; i < p1.length; i += 2) {
    const op = p1[i], b = Number(p1[i + 1]);
    acc = op === '+' ? acc + b : acc - b;
    if (acc < 0) bad.push(`نتيجة وسطى سالبة: ${acc}`);
  }
  return acc;
}

for (const f of fs.readdirSync(DIR).filter(n => /^nat_chaine_.*\.js$/.test(n)).sort()) {
  const src = fs.readFileSync(path.join(DIR, f), 'utf8');
  const window = {};
  new Function('window', src)(window);
  const data = window.exerciceData;

  console.log(`\n=== ${f} — ${data.questions.length} questions`);

  data.questions.forEach((q, qi) => {
    const tag = `  Q${qi + 1}`;
    const probs = [];

    // 1) l'expression de l'énoncé
    const texte = strip(q.operation);
    const expr = texte.slice(texte.indexOf('=') + 1).trim();
    let res;
    try {
      const r = evalNat(toJs(expr));
      res = r.valeur;
      probs.push(...r.anomalies);
    } catch (e) { probs.push('تعذّر حساب العبارة: ' + e.message); }

    if (res !== undefined) {
      if (!Number.isInteger(res)) probs.push(`النتيجة ليست عددا صحيحا: ${res}`);
      if (res <= 0) probs.push(`النتيجة ليست موجبة: ${res}`);
    }

    // 2) la valeur annoncée par la dernière étape
    const last = strip(q.steps[q.steps.length - 1]);
    const annonce = Number((last.match(/=\s*(-?\d+)\s*$/) || [])[1]);
    if (!Number.isFinite(annonce)) probs.push('المرحلة الأخيرة لا تنتهي بنتيجة');
    else if (annonce !== res) probs.push(`المرحلة الأخيرة تعلن ${annonce} والحساب يعطي ${res}`);

    // 3) chaque égalité écrite dans les étapes
    q.steps.forEach((s, si) => {
      const t = strip(s);
      const corps = t.slice(t.indexOf(':') + 1);
      corps.split(' و ').forEach(frag => {
        const i = frag.indexOf('=');
        if (i < 0) return;
        const g = frag.slice(0, i).trim(), d = frag.slice(i + 1).trim();
        if (!g || !NUMOP.test(toJs(g)) || !/^-?\d+$/.test(d)) return;
        try {
          const r = evalNat(toJs(g));
          probs.push(...r.anomalies.map(a => `م${si + 1}: ${a}`));
          if (r.valeur !== Number(d)) probs.push(`م${si + 1}: ${g} = ${d} خاطئ (${r.valeur})`);
          if (r.valeur < 0) probs.push(`م${si + 1}: قيمة سالبة ${r.valeur}`);
        } catch (e) { probs.push(`م${si + 1}: تعذّر التحقق من « ${g} »`); }
      });
    });

    // 4) aucun résultat négatif écrit dans le texte
    const brut = strip(q.operation + ' ' + q.steps.join(' '));
    if (/=\s*-\d/.test(brut)) probs.push('توجد نتيجة سالبة مكتوبة');

    // 5) ordre unique (pas deux étapes identiques)
    if (new Set(q.steps).size !== q.steps.length) probs.push('مراحل مكرّرة: الترتيب غير وحيد');

    if (probs.length) { erreurs++; console.log(`${tag} ✗ ${expr}\n      - ` + probs.join('\n      - ')); }
    else { ok++; console.log(`${tag} ✓ ${expr} = ${res}`); }
  });
}

console.log(`\n${ok} question(s) valides, ${erreurs} en erreur.`);
process.exit(erreurs ? 1 : 0);
