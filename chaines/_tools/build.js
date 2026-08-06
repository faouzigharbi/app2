// Génère les 20 chaînes (4 chapitres × 5 niveaux) à partir de donnees.js.
//   node _tools/build.js .
const fs = require('fs');
const path = require('path');
const M = require('./moteur');
const { chapitres } = require('./donnees');

const OUT = process.argv[2];
// Nom de la fiche d'index à écrire. Dans la bibliothèque complète, index.html
// appartient déjà au sommaire général : on écrit à côté, sans l'écraser.
const INDEX = process.argv[3] || 'nat_index.html';
if (!OUT) { console.error('usage: node build.js <dossier> [index.html]'); process.exit(1); }

const NIVEAUX = { easy: 'سهل', medium: 'متوسط', hard: 'صعب',
                  expert: 'خبير', extreme: 'متقدّم' };

// ---------------------------------------------------------------------------
// Isolation bidi : dans une page RTL, une expression nue est réordonnée par le
// navigateur. On enveloppe donc chaque portion mathématique, en laissant le
// texte arabe dans le flux de la page.
// ---------------------------------------------------------------------------
const RUN = /[0-9A-Za-z+\-*×÷/:=^().,[\]… ]+/g;
const rogne = s => s.replace(/^[\s:]+/, '').replace(/[\s:.,]+$/, '');

const span = (s, atomique) =>
  `<span dir="ltr"${atomique ? ' style="display:inline-block;white-space:nowrap"' : ''}>${s}</span>`;

function iso(str, atomique) {
  return String(str).replace(RUN, m => {
    const n = rogne(m);
    if (!n || !/\d/.test(n) || !/[+\-*×÷/=^]|\d\s*:\s*\d/.test(n)) return m;
    const i = m.indexOf(n);
    return m.slice(0, i) + span(n, atomique) + m.slice(i + n.length);
  });
}

// Une expression purement mathématique est isolée d'un bloc : la découper en
// morceaux déséquilibrerait ses parenthèses, que l'algorithme bidi reflète.
const PUR = /^[\d\s+\-*×÷/:=().[\]]+$/;
const md = (s, atomique) => (PUR.test(String(s)) ? span(String(s).trim(), atomique)
                                                : iso(s, atomique));

// ---------------------------------------------------------------------------
// Construction d'une question
// ---------------------------------------------------------------------------
const INDICES = {
  priorite: 'الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح',
  commun: 'لا تحسب الأقواس: ابحث عن الحد المشترك',
  regroupe: 'أعد التجميع قبل أن تحسب',
  serie: 'اجمع الطرف الأول مع الطرف الأخير',
  blanc: 'اعكس العملية للوصول إلى الحد الناقص',
  facteur: 'أخرج العامل المشترك'
};

function question(item) {
  let chaine, enonce;
  switch (item.type) {
    case 'priorite':
      chaine = M.chainePriorite(item.expr);
      enonce = "احسب: " + md(`${item.nom} = ${item.expr}`, true);
      break;
    case 'commun':
      chaine = M.chaineCommun(item);
      enonce = `احسب بأيسر طريقة (${item.nom}): ` + md(item.expr, true);
      break;
    case 'regroupe':
      chaine = M.chaineRegroupe(item);
      enonce = `احسب بأيسر طريقة (${item.nom}): ` + md(item.expr, true);
      break;
    case 'serie':
      chaine = M.chaineSerie(item);
      enonce = `احسب بأيسر طريقة (${item.nom}): ` + md(item.expr, true);
      break;
    case 'facteur':
      chaine = M.chaineFacteur(item);
      enonce = `احسب بأيسر طريقة (${item.nom}): ` + md(item.expr, true);
      break;
    case 'blanc':
      chaine = M.chaineBlanc(item);
      enonce = iso(item.enonce, true);   // énoncé mixte arabe + expression à trou
      break;
    default:
      throw new Error('type inconnu: ' + item.type);
  }
  return {
    operation: enonce,
    steps: chaine.etapes.map(([l, m]) => `${l}: ${md(m, true)}`),
    hint: INDICES[item.type]
  };
}

// ---------------------------------------------------------------------------
// Gabarit HTML — identique à celui des chaînes déjà en place
// ---------------------------------------------------------------------------
const html = (id, titre) => `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="style.css">
  <title>${titre}</title>
</head>
<body>

<header>
  <h1 id="title">${titre}</h1>
  <p id="meta"></p>
</header>

<main>
  <div class="card">
    <div class="row">
      <span class="badge">🔗 سلسلة برهان</span>
      <a class="badge" href="${INDEX}">↩ الفهرس</a>
    </div>
    <hr style="border:none;border-top:1px solid #e8ecf2;margin:10px 0"/>
    <div class="op" id="operation"></div>
    <div class="columns" style="margin-top:14px">
      <div>
        <div class="col-title"><b>المراحل (غير مرتبة)</b> <small>انقر أو اسحب</small></div>
        <div class="list" id="pool"></div>
      </div>
      <div>
        <div class="col-title"><b>ترتيبك</b> <small>رتّب المراحل</small></div>
        <div class="list" id="target"></div>
      </div>
    </div>
    <div class="row" style="margin-top:12px">
      <button class="btn secondary" id="btnReset">🔁 إعادة</button>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn secondary" id="btnHint">💡 مساعدة</button>
        <button class="btn" id="btnCheck">✅ تحقق</button>
      </div>
    </div>
    <div class="hint" id="hint"></div>
    <div class="feedback" id="feedback"></div>
  </div>
</main>

<script src="${id}.js"></script>

<script>
(function(){
  const data = window.exerciceData;
  let currentQ = 0;
  const total = data.questions.length;
  let score = 0;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function loadQuestion() {
    const q = data.questions[currentQ];
    document.getElementById('title').innerHTML = data.title;
    document.getElementById('meta').textContent = 'السؤال ' + (currentQ+1) + '/' + total + ' — النتيجة: ' + score + '/' + total;
    document.getElementById('operation').innerHTML = q.operation || '';
    document.getElementById('hint').textContent = '';
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';

    const pool = document.getElementById('pool');
    const target = document.getElementById('target');
    pool.innerHTML = '';
    target.innerHTML = '';

    shuffle(q.steps).forEach(function(step, i) {
      const item = document.createElement('div');
      item.className = 'item';
      item.draggable = true;
      item.innerHTML = step;
      item.dataset.text = step;

      item.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', i);
        item.classList.add('dragging');
      });
      item.addEventListener('dragend', function() {
        item.classList.remove('dragging');
      });
      item.addEventListener('click', function() {
        if (item.parentElement === pool) target.appendChild(item);
        else pool.appendChild(item);
      });
      pool.appendChild(item);
    });

    [pool, target].forEach(function(zone) {
      zone.addEventListener('dragover', function(e) { e.preventDefault(); });
      zone.addEventListener('drop', function(e) {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        if (dragging) zone.appendChild(dragging);
      });
    });
  }

  document.getElementById('btnCheck').addEventListener('click', function() {
    const q = data.questions[currentQ];
    const userOrder = Array.from(document.getElementById('target').querySelectorAll('.item'))
      .map(function(el) { return el.dataset.text; });
    const fb = document.getElementById('feedback');

    if (userOrder.length !== q.steps.length) {
      fb.className = 'feedback bad';
      fb.textContent = '⚠️ ضع جميع المراحل في منطقة الترتيب أولاً!';
      return;
    }

    let correct = true;
    for (let i = 0; i < q.steps.length; i++) {
      if (userOrder[i] !== q.steps[i]) { correct = false; break; }
    }

    if (correct) {
      score++;
      fb.className = 'feedback good';
      fb.innerHTML = '✅ ممتاز! الترتيب صحيح!';
    } else {
      fb.className = 'feedback bad';
      fb.innerHTML = '❌ ليس تماماً — الترتيب الصحيح:<br>' + q.steps.map(function(s, i) { return '<b>' + (i+1) + '.</b> ' + s; }).join('<br>');
    }

    document.getElementById('meta').textContent = 'السؤال ' + (currentQ+1) + '/' + total + ' — النتيجة: ' + score + '/' + total;

    if (currentQ < total - 1) {
      setTimeout(function() { currentQ++; loadQuestion(); }, 2500);
    } else {
      setTimeout(function() {
        const pct = Math.round(score/total*100);
        const msg = pct >= 80 ? '🏆 ممتاز!' : pct >= 60 ? '👍 جيد!' : '📚 حاول مرة أخرى';
        fb.className = 'feedback good';
        fb.innerHTML = msg + ' — النتيجة النهائية: <b>' + score + '/' + total + '</b> (' + pct + '%)';
      }, 2500);
    }
  });

  document.getElementById('btnReset').addEventListener('click', loadQuestion);

  document.getElementById('btnHint').addEventListener('click', function() {
    const q = data.questions[currentQ];
    document.getElementById('hint').innerHTML = '💡 ' + (q.hint || q.steps[0]);
  });

  window.onload = loadQuestion;
})();
</script>

</body>
</html>
`;

// ---------------------------------------------------------------------------
// Émission
// ---------------------------------------------------------------------------
const liens = [];
let total = 0;

for (const ch of chapitres) {
  for (const niv of Object.keys(NIVEAUX)) {
    const items = ch.data[niv] || [];
    if (!items.length) continue;
    const id = `${ch.id}_chaine_${niv}_1`;
    const titre = `${ch.titre} — سلسلة — ${NIVEAUX[niv]}`;
    const data = { id, title: titre, questions: items.map(question) };

    fs.writeFileSync(path.join(OUT, `${id}.js`),
      'const exerciceData = ' + JSON.stringify(data, null, 2) + ';\nwindow.exerciceData = exerciceData;\n');
    fs.writeFileSync(path.join(OUT, `${id}.html`), html(id, titre));
    liens.push({ id, titre, n: items.length, chapitre: ch.titre });
    total += items.length;
    console.log(`✓ ${id} — ${items.length} questions`);
  }
}
console.log(`\n${liens.length} fichiers, ${total} questions.`);

// Fiche d'index du chapitre
const carte = l => `  <a href="${l.id}.html" style="display:block;padding:14px;background:#fff;border:1.5px solid #e8ecf2;border-radius:10px;text-decoration:none;color:#2c3e50">🔗 ${l.titre} <small style="color:#95a5a6">(${l.n})</small></a>`;
const groupes = chapitres.map(ch => {
  const l = liens.filter(x => x.chapitre === ch.titre);
  return `<h2 style="color:var(--accent);margin:20px 0 10px">${ch.titre}</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px">
${l.map(carte).join('\n')}
</div>`;
}).join('\n');

fs.writeFileSync(path.join(OUT, INDEX), `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="style.css">
  <title>الأعداد الصحيحة الطبيعية والعمليات عليها</title>
</head>
<body>
<h3>🔗 الأعداد الصحيحة الطبيعية والعمليات عليها — 7 أساسي</h3>
<p style="text-align:center;color:#95a5a6;font-size:.9em;margin-bottom:16px">${total} عملية موزّعة على ${liens.length} سلسلة</p>
${groupes}
</body>
</html>
`);
console.log('✓ ' + INDEX);
