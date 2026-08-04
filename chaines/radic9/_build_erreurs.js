// Émet une page « erreurs » par exercice — errNN.html — plus son index.
//   node _build_erreurs.js [dossier]
//
// Le miroir des pages de chaîne : mêmes questions, mêmes étapes, mais dans
// l'ordre et l'une d'elles fausse. L'élève clique l'étape qu'il condamne, puis
// choisit la bonne réécriture. Rien à taper, comme toujours.
//
// Les pages sont ENGENDRÉES, jamais éditées à la main — une modification se
// fait ici, suivie de `node _build_erreurs.js .`.
const fs = require('fs');
const path = require('path');
const F = require('./noyau.js');

require('./racines.js');
require('./exercices.js');
require('./gens.js');
const EXOS = Object.keys(F.PROBLEMES).map(Number).sort((a, b) => a - b);
const OUT = path.resolve(process.argv[2] || '.');

const page = (n, titre) => `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titre} — أين الخطأ؟</title>
<link rel="stylesheet" href="style.css">
<style>
  .etape { display:flex; gap:10px; align-items:flex-start; padding:10px 12px;
           border:1.5px solid #e8ecf2; border-radius:10px; margin:6px 0;
           background:#fff; cursor:pointer; transition:.12s }
  .etape:hover { border-color:#b9c6d6 }
  .etape.choisie { border-color:#e67e22; background:#fff8f0 }
  .etape.juste   { border-color:#27ae60; background:#f2fbf5 }
  .etape.ratee   { border-color:#c0392b; background:#fdf2f0 }
  .etape .rang { flex:0 0 26px; height:26px; border-radius:50%; background:#eef2f7;
                 color:#5b6b7f; font-weight:700; display:flex; align-items:center;
                 justify-content:center; font-size:.85em }
  .etape.choisie .rang { background:#e67e22; color:#fff }
  .etape.juste   .rang { background:#27ae60; color:#fff }
  .etape.ratee   .rang { background:#c0392b; color:#fff }
  .famille { margin:8px 0 0; padding:10px 12px; border-radius:10px;
             background:#fff8f0; border:1.5px solid #f0d5b8 }
  .famille b { color:#b9601a }
  .corrige { display:flex; flex-direction:column; gap:6px; margin-top:8px }
  .corrige button { text-align:right; background:#fff; border:1.5px solid #e8ecf2;
                    border-radius:9px; padding:8px 10px; cursor:pointer; font:inherit }
  .corrige button:hover { border-color:#b9c6d6 }
  .corrige button.bonne { border-color:#27ae60; background:#f2fbf5 }
  .corrige button.mauvaise { border-color:#c0392b; background:#fdf2f0 }
  .niveaux { display:flex; gap:6px }
  .niveaux button.actif { background:#2c3e50; color:#fff; border-color:#2c3e50 }
  @media print {
    .nav-bar, #barre, .btn, .corrige { display:none !important }
    .etape { break-inside:avoid }
  }
</style>
</head>
<body>
<header>
  <h1 id="title">${titre} — أين الخطأ؟</h1>
  <p id="meta"></p>
</header>

<main>
  <div id="barre" class="row">
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <span class="badge">العمليات في ℝ</span>
      <a class="badge" href="err-index.html">↩ الفهرس</a>
      <a class="badge" href="ex${String(n).padStart(2, '0')}.html">⛓ سلسلة البرهان</a>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <span class="niveaux">
        <button class="btn secondary actif" id="btnMoyen">مستوى متوسّط</button>
        <button class="btn secondary" id="btnAvance">مستوى متقدّم</button>
      </span>
      <button class="btn secondary" id="btnPrint">🖨 ورقة للطباعة</button>
      <button class="btn" id="btnNew">🎲 تمارين جديدة</button>
    </div>
  </div>
  <div id="questions"></div>
  <div id="feuille"></div>
</main>

<script src="noyau.js"></script>
<script src="racines.js"></script>
<script src="exercices.js"></script>
<script src="gens.js"></script>
<script src="juge.js"></script>
<script src="erreurs.js"></script>

<script>
(function(){
  const NUM = ${n};
  let fautes = 1, data = [];

  const zone = document.getElementById('questions');
  const R = window.Radic, E = window.Erreurs;
  // Toutes les fiches n'ont pas le même rendu ni la même forme d'énoncé :
  // certaines rendent une liste de lignes, d'autres une seule chaîne ; certaines
  // savent isoler les maths en dir="ltr", d'autres livrent déjà du HTML. On
  // s'adapte à ce que la fiche donne au lieu de l'exiger.
  const rm = s => (s === undefined || s === null) ? ''
                : (typeof R.rendreMath === 'function' ? R.rendreMath(s) : String(s));
  const lignes = e => (Array.isArray(e) ? e : [e]).map(rm).join('<br>');

  function tirer() {
    data = E.pageErreurs(NUM, fautes);
    rendre();
  }

  function rendre() {
    zone.innerHTML = '';
    data.forEach((q, qi) => {
      const d = document.createElement('details');
      d.open = qi === 0;
      const s = document.createElement('summary');
      s.innerHTML = '<b>السؤال ' + (qi + 1) + '</b>';
      d.appendChild(s);

      const en = document.createElement('div');
      en.className = 'op';
      en.innerHTML = lignes(q.enonce);
      d.appendChild(en);

      const consigne = document.createElement('p');
      consigne.className = 'col-title';
      // On n'annonce JAMAIS combien de fautes il y a — et il peut n'y en avoir
      // aucune. Tant que la page promet une faute, l'élève la cherche ; il ne
      // JUGE que s'il peut répondre « ce corrigé est bon ».
      consigne.textContent =
        'إليك حلّ تلميذ. انقر على كل مرحلة تراها خاطئة، ثمّ تحقّق.';
      d.appendChild(consigne);

      const liste = document.createElement('div');
      const choisies = new Set();
      q.etapes.forEach((e, i) => {
        const el = document.createElement('div');
        el.className = 'etape';
        el.innerHTML = '<span class="rang">' + (i + 1) + '</span><span>'
          + rm(e[0]) + ': ' + rm(e[1]) + '</span>';
        el.onclick = () => {
          if (el.dataset.fige) return;
          if (choisies.has(i)) { choisies.delete(i); el.classList.remove('choisie'); }
          else { choisies.add(i); el.classList.add('choisie'); }
        };
        liste.appendChild(el);
      });
      d.appendChild(liste);

      const boutons = document.createElement('div');
      boutons.className = 'row';
      boutons.style.marginTop = '10px';
      const bV = document.createElement('button'); bV.className = 'btn'; bV.textContent = 'تحقق';
      const bS = document.createElement('button'); bS.className = 'btn secondary';
      bS.textContent = 'لا خطأ في هذا الحلّ';
      const bH = document.createElement('button'); bH.className = 'btn secondary'; bH.textContent = 'مساعدة';
      const bR = document.createElement('button'); bR.className = 'btn secondary'; bR.textContent = 'إعادة';
      boutons.appendChild(bV); boutons.appendChild(bS);
      boutons.appendChild(bH); boutons.appendChild(bR);
      d.appendChild(boutons);

      const fb = document.createElement('div'); fb.className = 'feedback';
      const hint = document.createElement('div'); hint.className = 'hint'; hint.style.display = 'none';
      hint.innerHTML = rm(q.indice) || 'تذكّر قاعدة الدرس.';
      d.appendChild(hb(hint)); d.appendChild(fb);

      bH.onclick = () => { hint.style.display = hint.style.display === 'none' ? 'block' : 'none'; };
      bR.onclick = () => { rendre(); };
      bS.onclick = () => { choisies.clear();
        [...liste.children].forEach(el => el.classList.remove('choisie'));
        bV.onclick(); };

      bV.onclick = () => {
        const vrais = q.fautes.map(f => f.rang);
        const trouves = vrais.filter(r => choisies.has(r));
        const aTort = [...choisies].filter(r => vrais.indexOf(r) < 0);
        [...liste.children].forEach((el, i) => {
          el.dataset.fige = '1';
          el.classList.remove('choisie');
          if (vrais.indexOf(i) >= 0) el.classList.add(choisies.has(i) ? 'juste' : 'ratee');
          else if (choisies.has(i)) el.classList.add('ratee');
        });
        let txt;
        if (!vrais.length) {
          txt = aTort.length
            ? 'هذا الحلّ صحيح تماما، و قد اتّهمت ' + aTort.length + ' مرحلة سليمة'
            : 'أحسنت: هذا الحلّ صحيح تماما، و لا خطأ فيه';
        } else {
          txt = 'وجدت ' + trouves.length + ' من ' + vrais.length;
          if (aTort.length) txt += '، و اتّهمت ' + aTort.length + ' مرحلة صحيحة';
        }
        fb.textContent = txt + '.';

        q.fautes.forEach(f => {
          const bloc = document.createElement('div');
          bloc.className = 'famille';
          bloc.innerHTML = 'المرحلة ' + (f.rang + 1) + ' — <b>' + f.famille + '</b><br>'
                         + '<small>' + rm(f.quoi) + '</small>';
          if (f.choix.length > 1) {
            const c = document.createElement('div');
            c.className = 'corrige';
            const t = document.createElement('div');
            t.className = 'col-title';
            t.textContent = 'ما كان يجب أن يُكتب؟';
            c.appendChild(t);
            f.choix.forEach((opt, k) => {
              const b = document.createElement('button');
              b.innerHTML = rm(opt);
              b.onclick = () => {
                b.classList.add(k === f.bonne ? 'bonne' : 'mauvaise');
                if (k !== f.bonne) {
                  c.children[f.bonne + 1].classList.add('bonne');
                }
              };
              c.appendChild(b);
            });
            bloc.appendChild(c);
          } else {
            bloc.innerHTML += '<br>الصواب: ' + rm(f.vrai);
          }
          fb.appendChild(bloc);
        });
      };

      zone.appendChild(d);
    });
    document.getElementById('meta').textContent =
      data.length + ' أسئلة — ' + (fautes > 1 ? 'خطآن في كل سؤال' : 'خطأ واحد في كل سؤال');
  }

  function hb(h) { const w = document.createElement('div'); w.appendChild(h); return w; }

  document.getElementById('btnNew').onclick = tirer;
  document.getElementById('btnMoyen').onclick = function () {
    fautes = 1; this.classList.add('actif');
    document.getElementById('btnAvance').classList.remove('actif'); tirer();
  };
  document.getElementById('btnAvance').onclick = function () {
    fautes = 2; this.classList.add('actif');
    document.getElementById('btnMoyen').classList.remove('actif'); tirer();
  };

  // La feuille imprimable, en deux parties : l'élève reçoit le devoir sans
  // rien de marqué, le parent reçoit le même avec les fautes cerclées et
  // NOMMÉES — il peut donc corriger sans savoir refaire l'exercice.
  document.getElementById('btnPrint').onclick = () => {
    const f = document.getElementById('feuille');
    const bloc = (parent) => data.map((q, qi) =>
      '<div style="break-inside:avoid;margin:0 0 6mm">'
      + '<div class="col-title">السؤال ' + (qi + 1) + '</div>'
      + '<div class="op">' + lignes(q.enonce) + '</div>'
      + q.etapes.map((e, i) => {
          const bad = q.fautes.find(x => x.rang === i);
          return '<div class="etape"' + (parent && bad ? ' style="border-color:#c0392b"' : '')
            + '><span class="rang">' + (i + 1) + '</span><span>'
            + rm(e[0]) + ': ' + rm(e[1])
            + (parent && bad ? ' <b style="color:#c0392b">← ' + bad.famille + '</b>'
                               + '<br><small>الصواب: ' + rm(bad.vrai) + '</small>' : '')
            + '</span></div>';
        }).join('')
      + '</div>').join('');
    f.innerHTML = '<h3 class="feuille-titre">ورقة التلميذ — أين الخطأ؟</h3>' + bloc(false)
      + '<div style="page-break-before:always"></div>'
      + '<h3 class="feuille-titre">ورقة الوليّ — التصحيح</h3>' + bloc(true);
    window.print();
  };

  tirer();
})();
</script>
</body>
</html>
`;

const index = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>أين الخطأ؟ — العمليات في ℝ</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<header><h1>أين الخطأ؟ — العمليات في ℝ</h1>
<p>في كل صفحة، حلّ تلميذ فيه خطأ (أو خطآن في المستوى المتقدّم). ابحث عنه، ثمّ صحّحه.</p></header>
<main>
<div class="row" style="margin-bottom:12px">
  <a class="badge" href="index.html">⛓ سلاسل البرهان</a>
</div>
<div style="display:grid;gap:10px">
${EXOS.map(n => `  <a href="err${String(n).padStart(2, '0')}.html" style="display:block;padding:14px;background:#fff;border:1.5px solid #e8ecf2;border-radius:10px;text-decoration:none;color:#2c3e50">🔎 التمرين ${n} — ${F.PROBLEMES[n].titre} <small style="color:#95a5a6">(${F.PROBLEMES[n].questions || F.PAR_PAGE || ''} أسئلة)</small></a>`).join('\n')}
</div>
</main>
</body>
</html>
`;

for (const n of EXOS) {
  const titre = 'التمرين ' + n + ' — ' + F.PROBLEMES[n].titre;
  fs.writeFileSync(path.join(OUT, `err${String(n).padStart(2, "0")}.html`), page(n, titre));
  console.log(`err${String(n).padStart(2, "0")}.html — ${titre}`);
}
fs.writeFileSync(path.join(OUT, 'err-index.html'), index);
console.log(`err-index.html — ${EXOS.length} صفحات`);
