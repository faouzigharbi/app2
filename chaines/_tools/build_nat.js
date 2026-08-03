// Génère les chaînes de démonstration "أولوية العمليات في الأعداد الصحيحة الطبيعية"
// Contrainte : tous les résultats — intermédiaires et finaux — sont des entiers naturels > 0.
const fs = require('fs');
const path = require('path');

const OUT = process.argv[2];
if (!OUT) { console.error('usage: node build_nat.js <outdir>'); process.exit(1); }

// N'isole en LTR que ce qui est réellement mathématique : une portion en arabe
// pur doit rester dans le flux RTL de la page.
const L = (s, atomique) => (/\d/.test(s)
  ? `<span dir="ltr"${atomique ? ' style="display:inline-block;white-space:nowrap"' : ''}>${s}</span>`
  : s);
// Plusieurs égalités dans une même étape : le « و » reste hors des spans LTR,
// et chaque égalité reste insécable pour ne jamais être coupée en fin de ligne.
const Lm = s => s.split(' و ').map(f => L(f, true)).join(' و ');

const CHAP = 'أولوية العمليات في ℕ';

const NIVEAUX = {
  easy:    'سهل',
  medium:  'متوسط',
  hard:    'صعب',
  expert:  'خبير',
  extreme: 'متقدّم'
};

// ---------------------------------------------------------------------------
// Contenu — inspiré de la fiche « الأعداد الصحيحة والعمليات عليها — 7 أساسي »
// ---------------------------------------------------------------------------
const DATA = {

  easy: [
    { nom: 'G', expr: '24 + 6 × 3',
      steps: [
        ['نحدّد الأولوية', 'الضرب قبل الجمع'],
        ['ننجز الضرب', '6 × 3 = 18'],
        ['نعوّض', '24 + 18'],
        ['النتيجة', '= 42']
      ],
      hint: 'ابدأ دائما بالضرب قبل الجمع' },

    { nom: 'T', expr: '6 + 4 × 7',
      steps: [
        ['نحدّد الأولوية', 'الضرب قبل الجمع'],
        ['ننجز الضرب', '4 × 7 = 28'],
        ['نعوّض', '6 + 28'],
        ['النتيجة', '= 34']
      ],
      hint: 'الضرب أولا حتى إن كان في آخر العبارة' },

    { nom: 'Z', expr: '120 - 7 × 9',
      steps: [
        ['نحدّد الأولوية', 'الضرب قبل الطرح'],
        ['ننجز الضرب', '7 × 9 = 63'],
        ['نعوّض', '120 - 63'],
        ['النتيجة', '= 57']
      ],
      hint: 'الضرب قبل الطرح' },

    { nom: 'D', expr: '100 : 4 + 6',
      steps: [
        ['نحدّد الأولوية', 'القسمة قبل الجمع'],
        ['ننجز القسمة', '100 : 4 = 25'],
        ['نعوّض', '25 + 6'],
        ['النتيجة', '= 31']
      ],
      hint: 'القسمة لها نفس أولوية الضرب' },

    { nom: 'V', expr: '45 - 36 : 4',
      steps: [
        ['نحدّد الأولوية', 'القسمة قبل الطرح'],
        ['ننجز القسمة', '36 : 4 = 9'],
        ['نعوّض', '45 - 9'],
        ['النتيجة', '= 36']
      ],
      hint: 'القسمة قبل الطرح' }
  ],

  medium: [
    { nom: 'E', expr: '52 × 4 - 3 × 6',
      steps: [
        ['نحدّد الأولوية', 'الضربان قبل الطرح'],
        ['ننجز الضربين', '52 × 4 = 208 و 3 × 6 = 18'],
        ['نعوّض', '208 - 18'],
        ['النتيجة', '= 190']
      ],
      hint: 'أنجز كل عمليات الضرب ثم اطرح' },

    { nom: 'F', expr: '52 + 4 × 3 - 6',
      steps: [
        ['نحدّد الأولوية', 'الضرب أولا'],
        ['ننجز الضرب', '4 × 3 = 12'],
        ['نعوّض', '52 + 12 - 6'],
        ['من اليسار إلى اليمين', '52 + 12 = 64'],
        ['النتيجة', '64 - 6 = 58']
      ],
      hint: 'الجمع والطرح لهما نفس الأولوية: من اليسار إلى اليمين' },

    { nom: 'I', expr: '24 × 6 + 3 × 4',
      steps: [
        ['نحدّد الأولوية', 'الضربان قبل الجمع'],
        ['ننجز الضربين', '24 × 6 = 144 و 3 × 4 = 12'],
        ['نعوّض', '144 + 12'],
        ['النتيجة', '= 156']
      ],
      hint: 'ضربان مستقلان ثم جمع' },

    { nom: 'M', expr: '45 × 100 - 12 × 5',
      steps: [
        ['نحدّد الأولوية', 'الضربان قبل الطرح'],
        ['ننجز الضربين', '45 × 100 = 4500 و 12 × 5 = 60'],
        ['نعوّض', '4500 - 60'],
        ['النتيجة', '= 4440']
      ],
      hint: 'الضرب في 100 يعني إضافة صفرين' },

    { nom: 'K', expr: '142 × 100 + 2 × 1000',
      steps: [
        ['نحدّد الأولوية', 'الضربان قبل الجمع'],
        ['ننجز الضربين', '142 × 100 = 14200 و 2 × 1000 = 2000'],
        ['نعوّض', '14200 + 2000'],
        ['النتيجة', '= 16200']
      ],
      hint: 'انتبه لعدد الأصفار' }
  ],

  hard: [
    { nom: 'U', expr: '(6 + 3) × 7',
      steps: [
        ['نحدّد الأولوية', 'ما بين القوسين أولا'],
        ['ننجز القوس', '(6 + 3) = 9'],
        ['نعوّض', '9 × 7'],
        ['النتيجة', '= 63']
      ],
      hint: 'القوس يغيّر الترتيب المعتاد' },

    { nom: 'E', expr: '7 × (9 - 2)',
      steps: [
        ['نحدّد الأولوية', 'ما بين القوسين أولا'],
        ['ننجز القوس', '(9 - 2) = 7'],
        ['نعوّض', '7 × 7'],
        ['النتيجة', '= 49']
      ],
      hint: 'الطرح داخل القوس يُنجز قبل الضرب' },

    { nom: 'S', expr: '(10 - 5) × (5 + 2)',
      steps: [
        ['نحدّد الأولوية', 'القوسان أولا'],
        ['ننجز القوسين', '(10 - 5) = 5 و (5 + 2) = 7'],
        ['نعوّض', '5 × 7'],
        ['النتيجة', '= 35']
      ],
      hint: 'أفرغ كل قوس ثم اضرب' },

    { nom: 'L', expr: '(7 + 2) × 3 + 5',
      steps: [
        ['نحدّد الأولوية', 'القوس ثم الضرب ثم الجمع'],
        ['ننجز القوس', '(7 + 2) = 9'],
        ['نعوّض', '9 × 3 + 5'],
        ['ننجز الضرب', '9 × 3 = 27'],
        ['النتيجة', '27 + 5 = 32']
      ],
      hint: 'قارن هذه العبارة بالعبارة الموالية' },

    { nom: 'U', expr: '7 + 2 × 3 + 5',
      steps: [
        ['نحدّد الأولوية', 'الضرب أولا (لا يوجد قوس)'],
        ['ننجز الضرب', '2 × 3 = 6'],
        ['نعوّض', '7 + 6 + 5'],
        ['النتيجة', '= 18']
      ],
      hint: 'نفس الأعداد بدون قوس تعطي نتيجة مختلفة' },

    { nom: 'Q', expr: '6 × 5 - (4 - 3)',
      steps: [
        ['نحدّد الأولوية', 'القوس أولا ثم الضرب'],
        ['ننجز القوس', '(4 - 3) = 1'],
        ['ننجز الضرب', '6 × 5 = 30'],
        ['نعوّض', '30 - 1'],
        ['النتيجة', '= 29']
      ],
      hint: 'القوس أولا حتى إن كان بسيطا' }
  ],

  expert: [
    { nom: 'M', expr: '8 × [16 - (8 + 4)]',
      steps: [
        ['نحدّد الأولوية', 'القوس الداخلي أولا'],
        ['القوس الداخلي', '(8 + 4) = 12'],
        ['القوس الخارجي', '[16 - 12] = 4'],
        ['ننجز الضرب', '8 × 4'],
        ['النتيجة', '= 32']
      ],
      hint: 'من الداخل إلى الخارج' },

    { nom: 'N', expr: '[18 - (8 - 2)] × 3',
      steps: [
        ['نحدّد الأولوية', 'القوس الداخلي أولا'],
        ['القوس الداخلي', '(8 - 2) = 6'],
        ['القوس الخارجي', '[18 - 6] = 12'],
        ['ننجز الضرب', '12 × 3'],
        ['النتيجة', '= 36']
      ],
      hint: 'أفرغ القوس الداخلي قبل الخارجي' },

    { nom: 'J', expr: '5 × [17 - (13 + 2)]',
      steps: [
        ['نحدّد الأولوية', 'القوس الداخلي أولا'],
        ['القوس الداخلي', '(13 + 2) = 15'],
        ['القوس الخارجي', '[17 - 15] = 2'],
        ['ننجز الضرب', '5 × 2'],
        ['النتيجة', '= 10']
      ],
      hint: 'النتيجة داخل القوس صغيرة، وهذا عادي' },

    { nom: 'P', expr: '(30 - 29) × [40 - (15 - 5)]',
      steps: [
        ['نحدّد الأولوية', 'الأقواس أولا'],
        ['القوس الأول', '(30 - 29) = 1'],
        ['القوس الداخلي', '(15 - 5) = 10'],
        ['القوس الخارجي', '[40 - 10] = 30'],
        ['ننجز الضرب', '1 × 30'],
        ['النتيجة', '= 30']
      ],
      hint: 'الضرب في 1 لا يغيّر العدد' },

    { nom: 'S', expr: '5 × [(3 + 4) - (8 - 6)]',
      steps: [
        ['نحدّد الأولوية', 'القوسان الداخليان أولا'],
        ['القوسان الداخليان', '(3 + 4) = 7 و (8 - 6) = 2'],
        ['القوس الخارجي', '[7 - 2] = 5'],
        ['ننجز الضرب', '5 × 5'],
        ['النتيجة', '= 25']
      ],
      hint: 'قوسان داخليان في نفس المستوى' }
  ],

  extreme: [
    { nom: 't', expr: '120 - 4 × 5 - 7 × 8 + 54 : 9',
      steps: [
        ['نحدّد الأولوية', 'الضرب والقسمة قبل الجمع والطرح'],
        ['ننجز الضرب والقسمة', '4 × 5 = 20 و 7 × 8 = 56 و 54 : 9 = 6'],
        ['نعوّض', '120 - 20 - 56 + 6'],
        ['من اليسار إلى اليمين', '120 - 20 = 100'],
        ['ثم', '100 - 56 = 44'],
        ['النتيجة', '44 + 6 = 50']
      ],
      hint: 'أنجز كل الضرب والقسمة أولا ثم امش من اليسار إلى اليمين' },

    { nom: 'y', expr: '12 - 2 - 5 + 15 × 2',
      steps: [
        ['نحدّد الأولوية', 'الضرب أولا'],
        ['ننجز الضرب', '15 × 2 = 30'],
        ['نعوّض', '12 - 2 - 5 + 30'],
        ['من اليسار إلى اليمين', '12 - 2 = 10'],
        ['ثم', '10 - 5 = 5'],
        ['النتيجة', '5 + 30 = 35']
      ],
      hint: 'الطرح المتتالي يُنجز من اليسار إلى اليمين' },

    { nom: 'B', expr: '7 + 5 × 2 + 3 × (6 - 4)',
      steps: [
        ['نحدّد الأولوية', 'القوس ثم الضرب ثم الجمع'],
        ['ننجز القوس', '(6 - 4) = 2'],
        ['ننجز الضربين', '5 × 2 = 10 و 3 × 2 = 6'],
        ['نعوّض', '7 + 10 + 6'],
        ['النتيجة', '= 23']
      ],
      hint: 'القوس أولا، ثم كل عمليات الضرب' },

    { nom: 'C', expr: '(7 + 5) × (2 + 3) × (6 - 4)',
      steps: [
        ['نحدّد الأولوية', 'الأقواس الثلاثة أولا'],
        ['ننجز الأقواس', '(7 + 5) = 12 و (2 + 3) = 5 و (6 - 4) = 2'],
        ['نعوّض', '12 × 5 × 2'],
        ['من اليسار إلى اليمين', '12 × 5 = 60'],
        ['النتيجة', '60 × 2 = 120']
      ],
      hint: 'أفرغ كل الأقواس ثم اضرب' },

    { nom: 'R', expr: '4 × (2 + 3 × 6) × 5',
      steps: [
        ['نحدّد الأولوية', 'داخل القوس أيضا الضرب قبل الجمع'],
        ['داخل القوس — الضرب', '3 × 6 = 18'],
        ['داخل القوس — الجمع', '(2 + 18) = 20'],
        ['نعوّض', '4 × 20 × 5'],
        ['من اليسار إلى اليمين', '4 × 20 = 80'],
        ['النتيجة', '80 × 5 = 400']
      ],
      hint: 'قاعدة الأولوية تُطبّق أيضا داخل القوس' },

    { nom: 'T', expr: '[4 × (2 + 3 × 6)] : 8 + 5',
      steps: [
        ['نحدّد الأولوية', 'القوس الداخلي ثم الخارجي ثم القسمة'],
        ['داخل القوس — الضرب', '3 × 6 = 18'],
        ['داخل القوس — الجمع', '(2 + 18) = 20'],
        ['القوس الخارجي', '[4 × 20] = 80'],
        ['ننجز القسمة', '80 : 8 = 10'],
        ['النتيجة', '10 + 5 = 15']
      ],
      hint: 'القسمة قبل الجمع' }
  ]
};

// ---------------------------------------------------------------------------
// Gabarit HTML (identique à celui des chaînes existantes)
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
    document.getElementById('title').textContent = data.title;
    document.getElementById('meta').textContent = 'السؤال ' + (currentQ+1) + '/' + total + ' — النتيجة: ' + score + '/' + total;
    document.getElementById('operation').innerHTML = q.operation || '';
    document.getElementById('hint').textContent = '';
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';

    const pool = document.getElementById('pool');
    const target = document.getElementById('target');
    pool.innerHTML = '';
    target.innerHTML = '';

    const shuffled = shuffle(q.steps);
    shuffled.forEach(function(step, i) {
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
        if (item.parentElement === pool) {
          target.appendChild(item);
        } else {
          pool.appendChild(item);
        }
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
    const targetItems = document.getElementById('target').querySelectorAll('.item');
    const userOrder = Array.from(targetItems).map(function(el) { return el.dataset.text; });
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
        let msg = pct >= 80 ? '🏆 ممتاز!' : pct >= 60 ? '👍 جيد!' : '📚 حاول مرة أخرى';
        fb.className = 'feedback good';
        fb.innerHTML = msg + ' — النتيجة النهائية: <b>' + score + '/' + total + '</b> (' + pct + '%)';
      }, 2500);
    }
  });

  document.getElementById('btnReset').addEventListener('click', function() {
    loadQuestion();
  });

  document.getElementById('btnHint').addEventListener('click', function() {
    const q = data.questions[currentQ];
    const hint = document.getElementById('hint');
    if (q.hint) {
      hint.textContent = '💡 ' + q.hint;
    } else {
      hint.textContent = '💡 المرحلة الأولى هي: ' + q.steps[0];
    }
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
for (const [niv, questions] of Object.entries(DATA)) {
  const id = `nat_chaine_${niv}_1`;
  const titre = `${CHAP} — سلسلة — ${NIVEAUX[niv]}`;

  const data = {
    id,
    title: titre,
    questions: questions.map(q => ({
      operation: `احسب: ${L(`${q.nom} = ${q.expr}`)}`,
      steps: q.steps.map(([label, math]) => `${label}: ${Lm(math)}`),
      hint: q.hint
    }))
  };

  fs.writeFileSync(
    path.join(OUT, `${id}.js`),
    'const exerciceData = ' + JSON.stringify(data, null, 2) + ';\nwindow.exerciceData = exerciceData;\n'
  );
  fs.writeFileSync(path.join(OUT, `${id}.html`), html(id, titre));
  console.log(`✓ ${id} — ${questions.length} questions`);
}
