// Émet les 4 paires exNN.js / exNN.html + index.html.
// Recopie aussi moteur.js depuis serie1 : une seule implémentation, pas deux.
//   node _build.js .
const fs = require('fs');
const path = require('path');
const A = require('./frac.js');
for (let n = 1; n <= 13; n++) require('./gen' + String(n).padStart(2, '0') + '.js');

const OUT = process.argv[2] || '.';

const page = (id, n, titre) => `<!doctype html>
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
      <span class="badge">⚖️ سلسلة مقارنة</span>
      <a class="badge" href="index.html">↩ الفهرس</a>
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
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn secondary" id="btnReset">🔁 إعادة</button>
        <button class="btn secondary" id="btnNew">🎲 أرقام جديدة</button>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn secondary" id="btnHint">💡 مساعدة</button>
        <button class="btn" id="btnCheck">✅ تحقق</button>
      </div>
    </div>
    <div class="hint" id="hint"></div>
    <div class="feedback" id="feedback"></div>
  </div>
</main>

<script src="frac.js"></script>
<script src="gen${String(n).padStart(2, '0')}.js"></script>
<script src="${id}.js"></script>

<script>
(function(){
  let data = window.exerciceData;
  let currentQ = 0;
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
    const total = data.questions.length;
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
    const total = data.questions.length;
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
        fb.innerHTML = msg + ' — النتيجة النهائية: <b>' + score + '/' + total + '</b> (' + pct + '%)'
          + '<br><small>اضغط « أرقام جديدة » لسلسلة جديدة</small>';
      }, 2500);
    }
  });

  document.getElementById('btnReset').addEventListener('click', loadQuestion);

  // Nouveau tirage : les nombres changent, la correction est recalculée.
  document.getElementById('btnNew').addEventListener('click', function() {
    data = window.Frac.construire(window.exerciceNumero);
    currentQ = 0;
    score = 0;
    loadQuestion();
  });

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

fs.copyFileSync(path.join(__dirname, 'frac.js'), path.join(OUT, 'frac.js'));

const liens = [];
for (const n of Object.keys(A.PROBLEMES)) {
  const id = 'ex' + String(n).padStart(2, '0');
  const titre = 'سلسلة ' + n + ' — ' + A.PROBLEMES[n].titre;
  fs.writeFileSync(path.join(OUT, id + '.js'),
    `// Tirage initial ; le bouton « أرقام جديدة » en refait un.\n`
    + `window.exerciceNumero = ${n};\n`
    + `window.exerciceData = Frac.construire(${n});\n`);
  fs.writeFileSync(path.join(OUT, id + '.html'), page(id, n, titre));
  liens.push({ id, titre, n: A.PAR_PAGE });
  console.log('✓ ' + id + ' — ' + titre);
}

const total = liens.reduce((s, l) => s + l.n, 0);
fs.writeFileSync(path.join(OUT, 'index.html'), `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="style.css">
  <title>مقارنة عددين كسريين نسبيين — 8 أساسي</title>
</head>
<body>
<h3>⚖️ مقارنة عددين كسريين نسبيين</h3>
<p style="text-align:center;color:#95a5a6;font-size:.9em;margin-bottom:16px">
  8 أساسي — ${liens.length} سلسلة، ${total} تمرينا في كل تحميل<br>
  الأعداد تتغيّر في كل مرة: اضغط « أرقام جديدة » أو أعد تحميل الصفحة
</p>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px">
${liens.map(l => `  <a href="${l.id}.html" style="display:block;padding:14px;background:#fff;border:1.5px solid #e8ecf2;border-radius:10px;text-decoration:none;color:#2c3e50">🔗 ${l.titre} <small style="color:#95a5a6">(${l.n})</small></a>`).join('\n')}
</div>
</body>
</html>
`);
console.log(`\n${liens.length} exercices, ${total} opérations par tirage.`);
