/* Devoirati — noyau : construction de la fiche imprimable (PDF).
   C'est la fonctionnalité que le dossier « generateurs_pdf » promettait
   sans jamais l'implémenter : aucun des anciens fichiers ne produisait
   de document imprimable.

   Le rendu passe par la feuille de style d'impression du navigateur
   (Ctrl+P → « Enregistrer au format PDF ») plutôt que par une bibliothèque
   type jsPDF : c'est le seul moyen fiable d'obtenir un texte arabe
   correctement ligaturé et de droite à gauche, et la fiche reste
   sélectionnable et accessible. */
(function (DV) {
  'use strict';

  function esc(s) { return DV.render.esc(s); }

  /* Zone de réponse laissée vide sur la fiche élève. */
  function answerSlot(kind) {
    if (kind === 'bool') {
      return '<span class="slot-bool"><span>نعم</span><span class="slot-sep">/</span><span>لا</span></span>';
    }
    if (kind === 'frac') {
      return '<span class="slot-frac"><span class="slot-cell"></span><span class="slot-bar"></span><span class="slot-cell"></span></span>';
    }
    return '<span class="slot-line"></span>';
  }

  /* Construit la liste d'exercices d'une section, en conservant une
     numérotation continue à travers toute la fiche. */
  function buildSection(section, startIndex, seed) {
    var gen = DV.registry.get(section.generatorId);
    if (!gen) throw new Error('fiche : générateur inconnu « ' + section.generatorId + ' »');

    /* La graine dépend du générateur et du niveau : deux sections
       différentes d'une même fiche ne produisent donc pas les mêmes tirages. */
    var rng = new DV.Rng(seed + '|' + gen.id + '|' + section.level);
    var items = [];
    for (var i = 0; i < section.count; i++) {
      items.push(DV.registry.makeSafe(gen, rng, section.level));
    }

    var levelLabel = (gen.levels.filter(function (l) { return l.id === section.level; })[0] || {}).label || '';
    var instruction = items[0].instruction || gen.instruction || '';

    return { gen: gen, items: items, levelLabel: levelLabel, instruction: instruction, start: startIndex };
  }

  function sectionHTML(sec, columns) {
    var html = '<section class="sheet-block">';
    html += '<h2 class="block-title">' + esc(sec.gen.title) +
      (sec.levelLabel ? ' <span class="block-level">— ' + esc(sec.levelLabel) + '</span>' : '') + '</h2>';
    if (sec.instruction) html += '<p class="block-instruction">' + esc(sec.instruction) + '</p>';
    html += '<ol class="ex-list cols-' + columns + '" start="' + (sec.start + 1) + '">';
    sec.items.forEach(function (ex) {
      html += '<li class="ex-item">' +
        '<div class="ex-q">' + ex.prompt + '</div>' +
        '<div class="ex-a">' + answerSlot(ex.answer.kind) + '</div>' +
        '</li>';
    });
    html += '</ol></section>';
    return html;
  }

  function correctionHTML(sections, mode) {
    var html = '<section class="sheet-block correction-block">';
    html += '<h2 class="block-title">الإصلاح</h2>';

    sections.forEach(function (sec) {
      html += '<h3 class="corr-sub">' + esc(sec.gen.title) + '</h3>';

      if (mode === 'courte') {
        html += '<ol class="corr-short" start="' + (sec.start + 1) + '">';
        sec.items.forEach(function (ex) {
          html += '<li><span class="corr-ans">' + ex.answerHTML + '</span></li>';
        });
        html += '</ol>';
      } else {
        html += '<ol class="corr-long" start="' + (sec.start + 1) + '">';
        sec.items.forEach(function (ex) {
          html += '<li>' +
            '<div class="corr-q">' + ex.prompt + '</div>' +
            '<ol class="steps">' +
            ex.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') +
            '</ol>' +
            '<p class="corr-final">الإجابة: ' + ex.answerHTML + '</p>' +
            '</li>';
        });
        html += '</ol>';
      }
    });

    html += '</section>';
    return html;
  }

  function headerHTML(o, seed) {
    return '<header class="sheet-head">' +
      '<div class="head-top">' +
      '<div class="head-school">' + esc(o.school || '') + '</div>' +
      '<div class="head-brand">Devoirati</div>' +
      '</div>' +
      '<h1 class="sheet-title">' + esc(o.title || 'سلسلة تمارين') + '</h1>' +
      '<div class="head-meta">' +
      '<span class="head-field">الاسم واللقب: <span class="dots"></span></span>' +
      '<span class="head-field">القسم: <span class="dots short">' + esc(o.className || '') + '</span></span>' +
      '<span class="head-field">التاريخ: <span class="dots short"></span></span>' +
      (o.duration ? '<span class="head-field">المدة: ' + esc(o.duration) + '</span>' : '') +
      '</div>' +
      '<div class="head-code">رمز الورقة: <strong>' + esc(seed) + '</strong></div>' +
      '</header>';
  }

  function footerHTML(seed, label) {
    return '<footer class="sheet-foot">' +
      '<span>' + esc(label) + '</span>' +
      '<span>devoirati — رمز الورقة ' + esc(seed) + '</span>' +
      '</footer>';
  }

  /* spec = {
       title, school, className, duration,
       seed, columns (1|2),
       correction : 'aucune' | 'courte' | 'detaillee',
       sections : [{generatorId, level, count}]
     } */
  function build(spec) {
    var seed = spec.seed || DV.newSeed();
    var columns = spec.columns === 2 ? 2 : 1;
    var index = 0;
    var sections = spec.sections
      .filter(function (s) { return s.count > 0; })
      .map(function (s) {
        var sec = buildSection(s, index, seed);
        index += sec.items.length;
        return sec;
      });

    if (!sections.length) throw new Error('fiche : aucune section sélectionnée');

    var html = '<article class="sheet">' + headerHTML(spec, seed);
    sections.forEach(function (sec) { html += sectionHTML(sec, columns); });
    html += footerHTML(seed, 'ورقة التمارين') + '</article>';

    if (spec.correction && spec.correction !== 'aucune') {
      html += '<article class="sheet sheet-correction">' +
        '<header class="sheet-head"><div class="head-top">' +
        '<div class="head-school">' + esc(spec.school || '') + '</div>' +
        '<div class="head-brand">Devoirati</div></div>' +
        '<h1 class="sheet-title">' + esc(spec.title || 'سلسلة تمارين') + ' — الإصلاح</h1>' +
        '<div class="head-code">رمز الورقة: <strong>' + esc(seed) + '</strong></div>' +
        '</header>' +
        correctionHTML(sections, spec.correction) +
        footerHTML(seed, 'الإصلاح') +
        '</article>';
    }

    return { html: html, seed: seed, count: index };
  }

  DV.worksheet = { build: build };
})(window.DV = window.DV || {});
