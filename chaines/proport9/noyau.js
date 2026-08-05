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
  const qSub = (a, b) => q(a.n * b.d - b.n * a.d, a.d * b.d);
  const qNeg = a => ({ n: -a.n, d: a.d });
  const qMul = (a, b) => q(a.n * b.n, a.d * b.d);
  const qDiv = (a, b) => { if (b.n === 0n) throw new Error('division par zéro'); return q(a.n * b.d, a.d * b.n); };
  const qEgaux = (a, b) => a.n === b.n && a.d === b.d;
  const qNul = a => a.n === 0n;

  // ── LES FORMES DU PREMIER DEGRÉ ──────────────────────────────────────────
  //
  // « x/(4+x) = 6/14 » : l'inconnue est des deux côtés d'une proportion. On
  // représente chaque membre par [a, b], la forme a·x + b, et le produit en
  // croix donne A·D − B·C. Ce produit est du SECOND degré en général ; on
  // exige donc que son terme en x² soit nul, sinon l'item est mal posé et
  // l'on refuse — une équation du second degré n'est pas de ce chapitre.
  const formeMul = (A, C) => [
    qMul(A[0], C[0]),                                   // x²
    qAdd(qMul(A[0], C[1]), qMul(A[1], C[0])),           // x
    qMul(A[1], C[1])                                    // 1
  ];
  const formeSub = (U, V) => U.map((u, i) => qSub(u, V[i]));
  // a·x + b, écrit comme au tableau : ni « 1x », ni « + −3 ».
  function ecrireForme(A, mode) {
    const [a, b] = A;
    if (qNul(a)) return ecrire(b, mode);
    const t = qEgaux(a, q(1)) ? 'x' : (qEgaux(a, q(-1)) ? '−x' : ecrire(a, mode) + 'x');
    if (qNul(b)) return t;
    return t + (b.n < 0n ? ' − ' : ' + ') + ecrire({ n: babs(b.n), d: b.d }, mode);
  }
  const evalForme = (A, x) => qAdd(qMul(A[0], x), A[1]);

  // ── Écrire un nombre ─────────────────────────────────────────────────────
  const frac = (n, d) => '<span class="frac" dir="ltr"><span class="num">' + n
    + '</span><span class="den">' + d + '</span></span>';
  const FRAC = /<span class="frac" dir="ltr"><span class="num">.*?<\/span><span class="den">.*?<\/span><\/span>/g;
  // Le dénominateur ne vit-il que de 2 et de 5 ? Alors l'écriture décimale
  // est finie, et c'est celle de la feuille.
  const DIX = n => { let d = n; while (d % 2n === 0n) d /= 2n; while (d % 5n === 0n) d /= 5n; return d === 1n; };
  function enDecimal(a) {
    if (a.d === 1n) return (a.n < 0n ? '−' : '') + String(babs(a.n));
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
  // LE SIGNE MOINS EST « − », PAS UN TRAIT D'UNION. String(-4n) rend « -4 » :
  // un trait d'imprimerie, plus court, plus haut, qui ne se lit pas comme un
  // signe dans une page arabe. Même défaut, même correction qu'ailleurs.
  function ecrire(a, mode) {
    if (mode === 'donnee') { const s = enDecimal(a); if (s !== null) return s; }
    const signe = a.n < 0n ? '−' : '';
    const n = babs(a.n);
    return signe + (a.d === 1n ? String(n) : frac(String(n), String(a.d)));
  }
  // Une forme entre parenthèses dès qu'elle a deux termes : « x − 3 × 8 » ne
  // veut pas dire « (x − 3) × 8 », et c'est pourtant ce qu'on écrivait.
  const entreParentheses = A =>
    (qNul(A[0]) || qNul(A[1])) ? ecrireForme(A) : '(' + ecrireForme(A) + ')';
  // Une fraction du sujet : numérateur et dénominateur écrits comme donnés.
  // LE SIGNE SORT DE LA FRACTION. « 8/(−6) » n'est pas une écriture : on
  // remonte le signe devant le quotient, et le dénominateur reste positif.
  const ecrireFrac = (n, d, mode) => {
    const neg = (d.n < 0n) !== (n.n < 0n);
    const N = { n: babs(n.n), d: n.d }, D = { n: babs(d.n), d: d.d };
    return (neg ? '−' : '') + frac(ecrire(N, mode), ecrire(D, mode));
  };
  // Une fraction dont les deux termes sont des FORMES du premier degré.
  const ecrireFrac2 = (A, B) => frac(ecrireForme(A), ecrireForme(B));

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
    source: b.source || '',
      // LA DIFFICULTÉ SE COMPTE EN NOTIONS, pas en étapes.
      //
      // Une notion, c'est une FORMULE APPLIQUÉE. Un exercice qui applique
      // Pythagore trois fois n'est pas difficile — il est long ; celui qui
      // enchaîne Pythagore, la relation métrique et le cercle circonscrit
      // l'est, parce qu'il faut savoir laquelle choisir à chaque fois.
      //
      //     1 notion → facile · 2 ou 3 → moyen · 4 et plus → difficile
      //
      // Les chapitres de géométrie nomment la règle sous « القاعدة » : c'est
      // sa VALEUR qui distingue. Les chapitres de calcul la nomment dans
      // l'étiquette même — « نفس الأساس », « نجمع الأسّة ». On prend donc l'une
      // ou l'autre, et l'on écarte ce qui n'est qu'ossature.
      difficulte: (() => {
        const CADRE = /المعطيات|النتيجة|نطبّق|نحسب|^[0-9]+\)$/;
        const notions = new Set();
        for (const e of (b.etapes || [])) {
          if (CADRE.test(e[0])) continue;
          notions.add(/القاعدة/.test(e[0]) ? String(e[1]) : String(e[0]));
        }
        const n = notions.size;
        return n <= 1 ? 'facile' : (n <= 3 ? 'moyen' : 'difficile');
      })()
  });

  const PROBLEMES = {};
  const enregistrer = (n, def) => { PROBLEMES[n] = def; };
  const tirer = n => PROBLEMES[n].f();
  const construire = n => ({
    id: 'ex' + n, title: 'التمرين ' + n + ' — ' + PROBLEMES[n].titre,
    questions: tirer(n).map(rendre)
  });

  const API = { ent, choix, melanger, q, qAdd, qSub, qMul, qDiv, qEgaux, qNul, qNeg,
                formeMul, formeSub, ecrireForme, evalForme, ecrireFrac2, entreParentheses,
                frac, ecrire, ecrireFrac, enDecimal, rendreMath, rendre,
                isoMixte, bloc, echapper, ARABE, PROBLEMES, enregistrer,
                tirer, construire };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Proport = API;
})(typeof window !== 'undefined' ? window : globalThis);
