// Cherche toute expression restée hors d'un <span dir="ltr">.
const fs = require('fs'), path = require('path');
const DIR = '/home/user/app2/chaines';
let restants = 0, champs = 0;
for (const f of fs.readdirSync(DIR).filter(n => n.endsWith('.js') && n !== 'index.js').sort()) {
  if (f.startsWith('_')) continue;
  const src = fs.readFileSync(path.join(DIR, f), 'utf8');
  const m = src.match(/^const \w+ = ([\s\S]*);\s*window\./);
  if (!m) continue;
  const data = JSON.parse(m[1]);
  const strs = [];
  const rec = o => { for (const v of Object.values(o)) {
    if (typeof v === 'string') strs.push(v);
    else if (Array.isArray(v)) v.forEach(x => typeof x === 'string' ? strs.push(x) : (x && rec(x)));
    else if (v && typeof v === 'object') rec(v);
  }};
  rec(data);
  for (const s of strs) {
    champs++;
    const nu = s.replace(/<span dir="ltr"[^>]*>[\s\S]*?<\/span>/g, '');
    if (/\d\s*[+\-−*×÷^]\s*\d|<sup>|\d\s*=|=\s*\d/.test(nu)) {
      restants++; console.log(`  ${f}: ${s}`);
    }
  }
}
console.log(`\n${champs} champs texte contrôlés — ${restants} expression(s) encore non isolée(s).`);
