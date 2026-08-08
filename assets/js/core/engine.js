/* Devoirati — noyau : moteur d'entraînement interactif.
   Une seule implémentation pour tous les générateurs : la saisie, la
   vérification, l'indice, la correction et le score étaient auparavant
   réécrits (et rebugués) dans chacun des 21 fichiers. */
(function (DV) {
  'use strict';

  var F = DV.Frac;

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }

  function Engine(container, gen, level) {
    this.root = container;
    this.gen = gen;
    this.level = level;
    this.score = { good: 0, total: 0 };
    this.rng = new DV.Rng(DV.newSeed());
    this.build();
    this.next();
  }

  Engine.prototype.build = function () {
    var self = this;
    this.root.innerHTML = '';

    this.promptBox = el('div', 'ex-prompt');
    this.instrBox = el('p', 'ex-instruction');
    this.inputBox = el('div', 'ex-input');
    this.feedback = el('div', 'ex-feedback');
    this.solution = el('div', 'ex-solution');

    var actions = el('div', 'ex-actions');
    this.btnCheck = el('button', 'btn btn-primary', 'تحقّق');
    this.btnHint = el('button', 'btn btn-ghost', 'إرشاد');
    this.btnSolution = el('button', 'btn btn-ghost', 'الحل المفصّل');
    this.btnNext = el('button', 'btn btn-secondary', 'تمرين جديد');
    actions.append(this.btnCheck, this.btnHint, this.btnSolution, this.btnNext);

    this.scoreBox = el('div', 'ex-score');

    this.root.append(this.instrBox, this.promptBox, this.inputBox,
      this.feedback, actions, this.solution, this.scoreBox);

    this.btnCheck.addEventListener('click', function () { self.check(); });
    this.btnNext.addEventListener('click', function () { self.next(); });
    this.btnHint.addEventListener('click', function () { self.showHint(); });
    this.btnSolution.addEventListener('click', function () { self.showSolution(true); });

    this.root.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      if (self.answered) self.next(); else self.check();
    });
  };

  Engine.prototype.next = function () {
    this.ex = DV.registry.makeSafe(this.gen, this.rng, this.level);
    this.answered = false;
    this.promptBox.innerHTML = this.ex.prompt;
    this.instrBox.textContent = this.ex.instruction || this.gen.instruction || '';
    this.feedback.className = 'ex-feedback';
    this.feedback.innerHTML = '';
    this.solution.style.display = 'none';
    this.solution.innerHTML = '';
    this.buildInput();
    this.renderScore();
  };

  Engine.prototype.buildInput = function () {
    var self = this;
    var kind = this.ex.answer.kind;
    this.inputBox.innerHTML = '';

    if (kind === 'bool') {
      var yes = el('button', 'btn btn-choice', 'نعم');
      var no = el('button', 'btn btn-choice', 'لا');
      yes.addEventListener('click', function () { self.check(true); });
      no.addEventListener('click', function () { self.check(false); });
      this.inputBox.append(yes, no);
      this.btnCheck.style.display = 'none';
      return;
    }

    this.btnCheck.style.display = '';

    if (kind === 'frac') {
      var wrap = el('div', 'ex-frac-input');
      this.numInput = el('input');
      this.denInput = el('input');
      [this.numInput, this.denInput].forEach(function (i) {
        i.type = 'text';
        i.inputMode = 'numeric';
        i.autocomplete = 'off';
      });
      this.numInput.setAttribute('aria-label', 'البسط');
      this.denInput.setAttribute('aria-label', 'المقام');
      var bar = el('span', 'ex-frac-bar');
      wrap.append(this.numInput, bar, this.denInput);
      this.inputBox.append(el('span', 'ex-label', 'الإجابة:'), wrap);
      this.numInput.focus();
      return;
    }

    this.valInput = el('input');
    this.valInput.type = 'text';
    this.valInput.inputMode = 'numeric';
    this.valInput.autocomplete = 'off';
    this.valInput.className = 'ex-int-input';
    this.valInput.setAttribute('aria-label', 'الإجابة');
    this.inputBox.append(el('span', 'ex-label', 'الإجابة:'), this.valInput);
    this.valInput.focus();
  };

  function parseInt10(s) {
    s = String(s).trim().replace(/[−–—]/g, '-').replace(/\s/g, '');
    if (!/^-?\d+$/.test(s)) return null;
    return parseInt(s, 10);
  }

  Engine.prototype.say = function (ok, msg) {
    this.feedback.className = 'ex-feedback ' + (ok === null ? 'is-warn' : ok ? 'is-ok' : 'is-ko');
    this.feedback.innerHTML = msg;
  };

  Engine.prototype.check = function (boolValue) {
    var a = this.ex.answer;
    var ok;

    if (a.kind === 'bool') {
      ok = boolValue === a.value;
    } else if (a.kind === 'int') {
      var v = parseInt10(this.valInput.value);
      if (v === null) return this.say(null, 'أدخل عددا صحيحا.');
      ok = v === a.value;
    } else {
      var n = parseInt10(this.numInput.value);
      var d = parseInt10(this.denInput.value);
      if (n === null || d === null) return this.say(null, 'أدخل عددين صحيحين في البسط والمقام.');
      if (d === 0) return this.say(null, 'المقام لا يمكن أن يكون منعدما.');
      /* Une réponse équivalente mais non réduite mérite un retour distinct :
         l'élève a compris le calcul, il lui manque l'étape de simplification. */
      if (n * a.frac.d === a.frac.n * d) {
        var given = new F(n, d);
        if (!(given.n === n && given.d === d)) {
          this.answered = true;
          this.score.total++;
          this.renderScore();
          this.showSolution(false);
          return this.say(null, 'النتيجة صحيحة لكنها غير مبسّطة — الصورة المبسّطة هي ' + this.ex.answerHTML);
        }
        ok = true;
      } else {
        ok = false;
      }
    }

    if (!this.answered) {
      this.score.total++;
      if (ok) this.score.good++;
    }
    this.answered = true;
    this.renderScore();

    if (ok) {
      this.say(true, 'إجابة صحيحة. أحسنت!');
    } else {
      this.say(false, 'إجابة خاطئة — الإجابة الصحيحة هي ' + this.ex.answerHTML);
      this.showSolution(false);
    }
  };

  Engine.prototype.showHint = function () {
    if (!this.ex.hint) return this.say(null, 'لا يوجد إرشاد لهذا التمرين.');
    this.say(null, this.ex.hint);
  };

  Engine.prototype.showSolution = function (countAsSeen) {
    if (countAsSeen && !this.answered) {
      this.answered = true;
      this.score.total++;
      this.renderScore();
    }
    var html = '<h3>الحل المفصّل</h3><ol class="steps">' +
      this.ex.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') +
      '</ol><p class="final">الإجابة: ' + this.ex.answerHTML + '</p>';
    this.solution.innerHTML = html;
    this.solution.style.display = 'block';
  };

  Engine.prototype.renderScore = function () {
    var pct = this.score.total ? Math.round(100 * this.score.good / this.score.total) : 0;
    this.scoreBox.innerHTML = 'النتيجة: <strong>' + this.score.good + '</strong> من <strong>' +
      this.score.total + '</strong>' + (this.score.total ? ' (' + pct + '%)' : '');
  };

  DV.engine = {
    mount: function (container, gen, level) { return new Engine(container, gen, level); }
  };
})(window.DV = window.DV || {});
