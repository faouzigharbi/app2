// Feuille imprimable — module autonome, ajouté à une page déjà construite.
//
// Il n'y a pas de gabarit commun à ces pages : elles ont été livrées bâties.
// Ce module se greffe donc tout seul — il pose son style, son bouton flottant
// et son conteneur, puis reconnaît la forme des données de la page.
//
// Quatre formes existent dans la bibliothèque :
//   • chaîne     : questions[].operation + steps  → ordonner des étapes
//   • erreur     : questions[].prompt + steps + options + correct
//   • QCM        : questions[].prompt + options + correct + explanation
//   • générée    : window.exerciceData rempli par un générateur
//
// Dans tous les cas la feuille a deux parties : celle de l'élève, sans les
// réponses, et celle du parent, avec. Le parent doit pouvoir corriger sans
// savoir refaire l'exercice — c'est le seul but.
(function () {
  'use strict';

  const CSS = `
    #feuille { display:none }
    .feuille-titre { text-align:center; margin:0 0 4mm; font-size:1.15em }
    .feuille-sous { text-align:center; color:#666; font-size:.85em; margin:0 0 6mm }
    .fq { margin:0 0 7mm; page-break-inside:avoid }
    .fq h4 { margin:0 0 2mm; font-size:1em }
    .fq .enonce { border:1px solid #999; border-radius:4px; padding:2mm 3mm; margin-bottom:2mm }
    .fq ol, .fq ul { margin:0; padding-inline-start:8mm }
    .fq li { margin:1.2mm 0; line-height:1.9 }
    .fq .case { display:inline-block; width:9mm; height:6mm; border:1px solid #999;
                border-radius:3px; margin-inline-end:3mm; vertical-align:middle }
    .fq .rond { display:inline-block; width:5mm; height:5mm; border:1px solid #999;
                border-radius:50%; margin-inline-end:3mm; vertical-align:middle }
    .fq .rep { color:#1a6b3a; font-weight:700 }
    .coupure { page-break-before:always }
    #btnImpression { position:fixed; inset-inline-start:12px; top:12px; z-index:9999;
      background:#5b4bd6; color:#fff; border:0; border-radius:10px; padding:9px 14px;
      font: inherit; font-weight:700; cursor:pointer; box-shadow:0 2px 8px #0002 }
    @media print {
      body > *:not(#feuille) { display:none !important }
      #feuille { display:block }
      body { background:#fff; margin:0; padding:0 }
      @page { margin:12mm }
    }`;

  const melanger = t => {
    const a = t.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // Les données de la page, quelle que soit la façon dont elle les nomme.
  function donnees() {
    const w = window;
    const d = w.exerciceData || (typeof exerciceData !== 'undefined' ? exerciceData : null)
           || w.quizData || (typeof quizData !== 'undefined' ? quizData : null);
    if (!d || !Array.isArray(d.questions) || !d.questions.length) return null;
    return d;
  }

  const echapper = s => String(s == null ? '' : s);

  function bloc(q, i, corrige) {
    const titre = '<h4>السؤال ' + (i + 1) + '</h4>';
    const enonce = '<div class="enonce">'
      + echapper(q.operation || q.prompt || '') + '</div>';

    // Chaîne : des étapes à remettre en ordre.
    if (Array.isArray(q.steps) && q.steps.length && !Array.isArray(q.options)) {
      const l = corrige ? q.steps : melanger(q.steps);
      return '<div class="fq">' + titre + enonce
        + (corrige
            ? '<ol>' + l.map(s => '<li>' + echapper(s) + '</li>').join('') + '</ol>'
            : '<ul style="list-style:none;padding-inline-start:0">'
              + l.map(s => '<li><span class="case"></span>' + echapper(s) + '</li>').join('')
              + '</ul>')
        + '</div>';
    }

    // Erreur ou QCM : des lignes à lire, puis des propositions à cocher.
    const lignes = (Array.isArray(q.steps) && q.steps.length)
      ? '<ol>' + q.steps.map(s => '<li>' + echapper(s) + '</li>').join('') + '</ol>' : '';
    const opts = Array.isArray(q.options) ? q.options : [];
    const choix = corrige
      ? '<ul style="list-style:none;padding-inline-start:0">'
        + opts.map((o, k) => '<li>' + (k === q.correct ? '<b class="rep">✔ </b>' : '<span class="rond"></span>')
            + (k === q.correct ? '<span class="rep">' + echapper(o) + '</span>' : echapper(o))
            + '</li>').join('') + '</ul>'
        + (q.explanation ? '<p style="margin:2mm 0 0">' + echapper(q.explanation) + '</p>' : '')
      : '<ul style="list-style:none;padding-inline-start:0">'
        + opts.map(o => '<li><span class="rond"></span>' + echapper(o) + '</li>').join('') + '</ul>';
    return '<div class="fq">' + titre + enonce + lignes + choix + '</div>';
  }

  // Cinquième forme : une page qui ne porte pas de tableau de questions mais
  // dépose sa question et sa solution dans le DOM (#question-area,
  // #solution-area). La feuille se lit alors directement sur la page.
  function construireDOM() {
    const q = document.getElementById('question-area');
    const sol = document.getElementById('solution-area');
    if (!q) return false;
    const f = document.getElementById('feuille');
    const titre = (document.querySelector('h1, h2, #ex-type') || {}).textContent
      || document.title || '';
    f.innerHTML =
      '<h3 class="feuille-titre">' + echapper(titre.trim()) + '</h3>'
      + '<p class="feuille-sous">ورقة التلميذ</p>'
      + '<div class="fq"><div class="enonce">' + q.innerHTML + '</div>'
      + '<div style="height:60mm;border:1px dashed #bbb;border-radius:4px"></div></div>'
      + '<div class="coupure"></div>'
      + '<h3 class="feuille-titre">' + echapper(titre.trim()) + '</h3>'
      + '<p class="feuille-sous">ورقة الوليّ — الحلّ</p>'
      + '<div class="fq"><div class="enonce">' + q.innerHTML + '</div>'
      + (sol ? sol.innerHTML : '<p>الحلّ غير متوفّر على هذه الصفحة</p>') + '</div>';
    return true;
  }

  function construire() {
    const d = donnees();
    if (!d) return construireDOM();
    const f = document.getElementById('feuille');
    f.innerHTML =
      '<h3 class="feuille-titre">' + echapper(d.title) + '</h3>'
      + '<p class="feuille-sous">ورقة التلميذ</p>'
      + d.questions.map((q, i) => bloc(q, i, false)).join('')
      + '<div class="coupure"></div>'
      + '<h3 class="feuille-titre">' + echapper(d.title) + '</h3>'
      + '<p class="feuille-sous">ورقة الوليّ — الإجابات، للمراجعة مع التلميذ</p>'
      + d.questions.map((q, i) => bloc(q, i, true)).join('');
    return true;
  }

  function poser() {
    if (document.getElementById('feuille')) return;
    // Page d'index : ni données ni zone de question, il n'y a rien à imprimer.
    if (!donnees() && !document.getElementById('question-area')) return;
    const st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);
    const f = document.createElement('div');
    f.id = 'feuille';
    document.body.appendChild(f);
    const b = document.createElement('button');
    b.id = 'btnImpression';
    b.textContent = '🖨 ورقة للطباعة';
    b.addEventListener('click', function () { construire(); window.print(); });
    document.body.appendChild(b);
    construire();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', poser);
  } else poser();
  window.addEventListener('load', poser);
})();
