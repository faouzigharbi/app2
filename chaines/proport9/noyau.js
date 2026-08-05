// LA PROPORTIONNALITÉ — « أكمل النقاط حتى تحصل على كسرين متساويين ».
//
// L'exercice qui précède Thalès et le rend possible : compléter une égalité de
// deux — ou trois — fractions. Aucune géométrie ; c'est pourquoi il a sa fiche
// et non une place dans celle de Thalès.
//
// TOUT EST EXACT, comme partout ici. Les données de la feuille sont des
// décimaux (7,5 ; 10,5 ; 32,76), ce sont des rationnels ; la réponse est un
// rationnel, et elle s'écrit en fraction irréductible dès qu'elle n'a pas
// d'écriture décimale finie. Le « ≈ » n'existe pas.
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
  const qAdd = (a, b) => q(a.n * b.d + b.n * a.d, a.d * b.d);
  const qMul = (a, b) => q(a.n * b.n, a.d * b.d);
  const qDiv = (a, b) => { if (b.n === 0n) throw new Error('division par zéro'); return q(a.n * b.d, a.d * b.n); };
  const qEgaux = (a, b) => a.n === b.n && a.d === b.d;
  const qNul = a => a.n === 0n;

  // ── Écrire un nombre ─────────────────────────────────────────────────────
  const frac = (n, d) => '<span class="frac" dir="ltr"><span class="num">' + n
    + '</span><span class="den">' + d + '</span></span>';
  const FRAC = /<span class="frac" dir="ltr"><span class="num">.*?<\/span><span class="den">.*?<\/span><\/span>/g;
  // Le dénominateur ne vit-il que de 2 et de 5 ? Alors l'écriture décimale
  // est finie, et c'est celle de la feuille.
  const DIX = n => { let d = n; while (d % 2n === 0n) d /= 2n; while (d % 5n === 0n) d /= 5n; return d === 1n; };
  function enDecimal(a) {
    if (a.d === 1n) return String(a.n);
    if (!DIX(a.d)) return null;
    let n = a.n, d = a.d, dec = 0;
    while (d % 2n === 0n) { d /= 2n; n *= 5n; dec++; }
    while (d % 5n === 0n) { d /= 5n; n *= 2n; dec++; }
    let s = String(babs(n)).padStart(dec + 1, '0');
    s = s.slice(0, s.length - dec) + ',' + s.slice(s.length - dec);
    s = s.replace(/,?0+$/, '');
    return (n < 0n ? '−' : '') + s;
  }
  // LE RÔLE DÉCIDE. Une DONNÉE se lit comme sur la feuille — 7,5 et non 15/2.
  // Un RÉSULTAT s'écrit en fraction irréductible, sauf s'il est entier.
  function ecrire(a, mode) {
    if (mode === 'donnee') { const s = enDecimal(a); if (s !== null) return s; }
    return a.d === 1n ? String(a.n) : frac(String(a.n), String(a.d));
  }
  // Une fraction du sujet : numérateur et dénominateur écrits comme donnés.
  const ecrireFrac = (n, d, mode) => frac(ecrire(n, mode), ecrire(d, mode));

  // ── Écriture mêlée ───────────────────────────────────────────────────────
  const ARABE = /[؀-ۿ]/;
  const echapper = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const CAR = "A-Za-z\\u00C0-\\u024F\\u0300-\\u036F0-9°()[\\]{}=,.;:+\\-−×÷√'\"…";
  const RUN = new RegExp('[' + CAR + ']+(?:\\s+[' + CAR + ']+)*', 'g');
  const ISOLER = /[/=()[\]°√×…]|[A-Za-zÀ-ɏ]|\d/;
  function isoMixte(t) {
    return String(t).replace(RUN, m => {
      if (!ISOLER.test(m)) return echapper(m);
      return '<span dir="ltr" class="expr">' + echapper(m) + '</span>';
    });
  }
  const bloc = s => '<span dir="ltr" class="expr">' + echapper(s) + '</span>';
  // On n'abandonne pas la ligne à cause d'une fraction : les fractions sont
  // déjà des îlots, et tout ce qui les sépare passe par l'isolation.
  function rendreMath(s) {
    const t = String(s);
    const iles = t.match(FRAC) || [];
    if (!iles.length) return ARABE.test(t) ? isoMixte(t) : bloc(t);
    const bouts = t.split(FRAC);
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

  const API = { ent, choix, melanger, q, qAdd, qMul, qDiv, qEgaux, qNul,
                frac, ecrire, ecrireFrac, enDecimal, rendreMath, rendre,
                isoMixte, bloc, echapper, ARABE, PROBLEMES, enregistrer,
                tirer, construire };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Proport = API;
})(typeof window !== 'undefined' ? window : globalThis);
