/* Devoirati — noyau : rendu HTML des objets mathématiques.
   Aucune dépendance externe (pas de MathJax) : le rendu doit rester
   identique à l'écran et à l'impression, y compris hors ligne. */
(function (DV) {
  'use strict';

  function esc(s) {
    return String(s).replace(/[&<>]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c];
    });
  }

  /* Une fraction empilée. Les entiers sont écrits normalement.
     Le signe « moins » sort de la barre de fraction (convention scolaire). */
  function frac(f, opts) {
    opts = opts || {};
    if (typeof f === 'number') f = new DV.Frac(f, 1);
    if (f.isInt() && !opts.forceFrac) {
      return '<span class="m-int">' + esc(f.n) + '</span>';
    }
    var sign = f.isNeg() ? '<span class="m-sign">−</span>' : '';
    var body =
      '<span class="m-frac">' +
      '<span class="m-num">' + esc(Math.abs(f.n)) + '</span>' +
      '<span class="m-den">' + esc(f.d) + '</span>' +
      '</span>';
    return sign + body;
  }

  /* Fraction « brute » non réduite : sert à montrer une étape de calcul. */
  function rawFrac(n, d) {
    var sign = (n < 0) !== (d < 0) ? '<span class="m-sign">−</span>' : '';
    return sign +
      '<span class="m-frac">' +
      '<span class="m-num">' + esc(Math.abs(n)) + '</span>' +
      '<span class="m-den">' + esc(Math.abs(d)) + '</span>' +
      '</span>';
  }

  /* Fraction dont le numérateur et/ou le dénominateur sont des expressions
     déjà mises en forme (utile pour montrer « (3 + 8) / 12 » dans une correction). */
  function fracExpr(numHTML, denHTML) {
    return '<span class="m-frac">' +
      '<span class="m-num">' + numHTML + '</span>' +
      '<span class="m-den">' + denHTML + '</span>' +
      '</span>';
  }

  function pow(base, exp) {
    return '<span class="m-pow">' + esc(base) + '<sup>' + esc(exp) + '</sup></span>';
  }

  function powUnknown(base) {
    return '<span class="m-pow">' + esc(base) + '<sup class="m-unknown">?</sup></span>';
  }

  function paren(html) {
    return '<span class="m-paren">(</span>' + html + '<span class="m-paren">)</span>';
  }

  function op(sym) {
    return '<span class="m-op">' + esc(sym) + '</span>';
  }

  /* Une expression est toujours écrite de gauche à droite, même dans une
     page en arabe : d'où le conteneur .m-expr forcé en direction LTR. */
  function expr(html) {
    return '<span class="m-expr">' + html + '</span>';
  }

  DV.render = {
    esc: esc,
    frac: frac,
    rawFrac: rawFrac,
    fracExpr: fracExpr,
    pow: pow,
    powUnknown: powUnknown,
    paren: paren,
    op: op,
    expr: expr,
    MUL: '×',
    DIV: '÷',
    ADD: '+',
    SUB: '−',
    EQ: '='
  };
})(window.DV = window.DV || {});
