// LA FORME CANONIQUE — « أكمل المربّع », et ce qu'on en tire.
//
// La chaîne des épreuves de concours : P = x² − 8x + 4 s'écrit (x − 4)² − 12,
// et de là sortent la factorisation, les solutions de P = 0, et le signe.
// Une seule idée, trois questions — c'est pourquoi c'est un chapitre.
//
// TOUT EST EXACT. Les coefficients sont des rationnels en BigInt ; les
// solutions sont de la forme a ± b√c, et ce radical ne s'arrondit jamais.
// Le « ≈ » n'existe pas ici non plus.
(function (racine) {
  'use strict';

  const ent = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
  const choix = t => t[Math.floor(Math.random() * t.length)];
  const melanger = t => {
    const c = t.slice();
    for (let i = c.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [c[i], c[j]] = [c[j], c[i]];
    }
    return c;
  };

  const B = x => (typeof x === 'bigint' ? x : BigInt(x));
  const babs = x => (x < 0n ? -x : x);
  const bpgcd = (a, b) => { a = babs(a); b = babs(b); while (b) { const t = a % b; a = b; b = t; } return a; };
  function q(n, d) {
    n = B(n); d = (d === undefined ? 1n : B(d));
    if (d === 0n) throw new Error('dénominateur nul');
    if (d < 0n) { n = -n; d = -d; }
    const g = bpgcd(n, d) || 1n;
    return { n: n / g, d: d / g };
  }
  const Q0 = q(0), Q1 = q(1);
  const qAdd = (a, b) => q(a.n * b.d + b.n * a.d, a.d * b.d);
  const qSub = (a, b) => q(a.n * b.d - b.n * a.d, a.d * b.d);
  const qMul = (a, b) => q(a.n * b.n, a.d * b.d);
  const qNeg = a => ({ n: -a.n, d: a.d });
  const qNul = a => a.n === 0n;
  const qEgaux = (a, b) => a.n === b.n && a.d === b.d;
  const qPos = a => a.n > 0n;

  // ── Un polynôme : le tableau de ses coefficients, du degré 0 vers le haut ─
  const polMul = (A, C) => {
    const out = new Array(A.length + C.length - 1).fill(Q0);
    for (let i = 0; i < A.length; i++) for (let j = 0; j < C.length; j++) {
      out[i + j] = qAdd(out[i + j], qMul(A[i], C[j]));
    }
    return out;
  };
  const polAdd = (A, C) => {
    const n = Math.max(A.length, C.length), out = [];
    for (let i = 0; i < n; i++) out.push(qAdd(A[i] || Q0, C[i] || Q0));
    return out;
  };
  const polEgaux = (A, C) => {
    const n = Math.max(A.length, C.length);
    for (let i = 0; i < n; i++) if (!qEgaux(A[i] || Q0, C[i] || Q0)) return false;
    return true;
  };
  // La valeur en un point — pour vérifier une racine par substitution.
  const polEn = (A, x) => A.reduce((s, c, i) => {
    let p = Q1; for (let k = 0; k < i; k++) p = qMul(p, x);
    return qAdd(s, qMul(c, p));
  }, Q0);

  // ── Écrire ───────────────────────────────────────────────────────────────
  const frac = (n, d) => '<span class="frac" dir="ltr"><span class="num">' + n
    + '</span><span class="den">' + d + '</span></span>';
  const FRAC = /<span class="frac" dir="ltr"><span class="num">.*?<\/span><span class="den">.*?<\/span><\/span>/g;
  // LE SIGNE MOINS EST « − », PAS UN TRAIT D'UNION. String(-3n) donne « -3 » :
  // c'est un trait d'union d'imprimerie, plus court, plus haut, et il ne se
  // lit pas comme un signe dans une page arabe.
  const ecrireQ = a => (a.n < 0n ? '−' : '')
    + (a.d === 1n ? String(babs(a.n)) : frac(String(babs(a.n)), String(a.d)));

  // « x − 3 » ou « x + 3 » — JAMAIS « x − -3 ». Un seul endroit écrit le
  // binôme, sans quoi chaque appelant refait le signe à sa façon et l'un
  // d'eux l'oublie.
  const ecrireBinome = (a, v) => (v || 'x') + (a.n < 0n ? ' + ' : ' − ')
    + ecrireQ({ n: babs(a.n), d: a.d });
  // √m = a√b, b sans facteur carré — le seul endroit où un radical apparaît.
  function peler(m) {
    let a = 1n, b = m, f = 2n;
    while (f * f <= b) { while (b % (f * f) === 0n) { b /= f * f; a *= f; } f++; }
    return [a, b];
  }
  function ecrireRacine(c) {
    if (!qPos(c)) throw new Error('racine d’un nombre non positif');
    const [a, b] = peler(c.n * c.d);
    const g = bpgcd(a, c.d) || 1n;
    const haut = a / g, bas = c.d / g;
    if (b === 1n) return bas === 1n ? String(haut) : frac(String(haut), String(bas));
    const num = (haut === 1n ? '' : String(haut)) + '√' + b;
    return bas === 1n ? num : frac(num, String(bas));
  }
  // « x² − 8x + 4 », écrit comme au tableau : pas de « + −4 », pas de « 1x ».
  function ecrirePol(A) {
    const bouts = [];
    for (let i = A.length - 1; i >= 0; i--) {
      const c = A[i];
      if (qNul(c)) continue;
      const neg = c.n < 0n;
      const abs = { n: babs(c.n), d: c.d };
      let t = (i === 0 || !qEgaux(abs, Q1)) ? ecrireQ(abs) : '';
      if (i >= 1) t += 'x';
      if (i >= 2) t += '<sup>' + i + '</sup>';
      bouts.push((bouts.length ? (neg ? ' − ' : ' + ') : (neg ? '−' : '')) + t);
    }
    return bouts.length ? bouts.join('') : '0';
  }

  // ── Écriture mêlée arabe / latin ─────────────────────────────────────────
  const ARABE = /[؀-ۿ]/;
  const echapper = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const CAR = "A-Za-z\\u00C0-\\u024F0-9()\\[\\]{}=<>≤≥,.;:+\\-−×÷√'\"…|²";
  const RUN = new RegExp('[' + CAR + ']+(?:\\s+[' + CAR + ']+)*', 'g');
  const ISOLER = /[=()\[\]√×≤≥…|²]|[A-Za-zÀ-ɏ]|\d/;
  function isoMixte(t) {
    return String(t).replace(RUN, m => (ISOLER.test(m)
      ? '<span dir="ltr" class="expr">' + echapper(m) + '</span>' : echapper(m)));
  }
  const bloc = s => '<span dir="ltr" class="expr">' + echapper(s) + '</span>';
  // Les fractions, les exposants et les balises déjà posées sont des îlots :
  // on isole ce qui les sépare, on ne les réécrit pas.
  const ILOT = new RegExp(FRAC.source + '|<sup>\\d+</sup>', 'g');
  function rendreMath(s) {
    const t = String(s);
    const iles = t.match(ILOT) || [];
    if (!iles.length) return ARABE.test(t) ? isoMixte(t) : bloc(t);
    const bouts = t.split(ILOT);
    let out = '';
    for (let i = 0; i < bouts.length; i++) {
      if (bouts[i]) out += (ARABE.test(t) ? isoMixte(bouts[i]) : bloc(bouts[i]));
      if (i < iles.length) out += iles[i];
    }
    return out;
  }
  const rendre = b => ({
    operation: b.enonce.map(rendreMath).join('<br>'),
    steps: b.etapes.map(e => e[0] + ': ' + rendreMath(e[1])),
    hint: b.indice,
    // LA PROVENANCE VOYAGE AVEC L'EXERCICE. La bibliothèque ne sert plus
    // seulement à imprimer : pour un document de révision du concours, il
    // faut pouvoir dire de quelle feuille et de quelle année l'exercice sort.
    source: b.source || ''
  });

  const PROBLEMES = {};
  const enregistrer = (n, def) => { PROBLEMES[n] = def; };
  const tirer = n => PROBLEMES[n].f();
  const construire = n => ({
    id: 'ex' + n, title: 'التمرين ' + n + ' — ' + PROBLEMES[n].titre,
    questions: tirer(n).map(rendre)
  });

  const API = { ent, choix, melanger, q, Q0, Q1, qAdd, qSub, qMul, qNeg, qNul,
                qEgaux, qPos, polMul, polAdd, polEgaux, polEn,
                frac, ecrireQ, ecrireBinome, ecrireRacine, ecrirePol, peler,
                rendreMath, rendre, isoMixte, bloc, echapper, ARABE,
                PROBLEMES, enregistrer, tirer, construire };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Canonique = API;
})(typeof window !== 'undefined' ? window : globalThis);
