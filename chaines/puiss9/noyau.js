// Noyau de la leçon « القوى » — les puissances, des trois niveaux à la fois.
//
// POURQUOI UN NOYAU NEUF. Ce chapitre casse deux hypothèses que tous les autres
// tenaient pour acquises.
//
// La première : que les nombres tiennent dans un flottant. Ici « (11¹²)⁵ » vaut
// 11⁶⁰, soixante-trois chiffres, et « 123⁴ × 123 × 123⁵ » vaut 123¹⁰. Aucun
// `Number` ne les représente. Tout est donc en BigInt, exactement.
//
// La seconde : que les exposants soient entiers. « (√3)⁵ » est 3^(5/2), et
// « ((√2)⁵)⁵ = 2²⁵ » ne se vérifie qu'en additionnant des exposants
// FRACTIONNAIRES. On tient donc l'exposant lui-même comme un rationnel.
//
// LA REPRÉSENTATION. Un nombre est une somme de termes, et chaque terme est
//
//     coefficient rationnel  ×  ∏ base^exposant
//
// où la base est un nombre premier — d'exposant alors dans [0, 1), car sa part
// entière se replie dans le coefficient — ou bien π, qui ne se replie jamais.
// Ainsi :
//
//     √2        →  1 × 2^(1/2)
//     2^(5/2)   →  4 × 2^(1/2)          (la part entière est repliée)
//     (√3/2)⁻⁴  →  16/9                 (plus aucun radical : c'est un rationnel)
//     3 + 2√2   →  deux termes
//
// Deux nombres sont égaux quand leurs termes le sont, terme à terme. Rien n'est
// approché : « (2√2 − √7)¹⁵³ × (2√2 + √7)¹⁵⁴ » se calcule vraiment, par
// exponentiation binaire dans ℚ[√2, √7], et l'on retrouve 2√2 + √7.
(function (racine) {
  'use strict';

  // -------------------------------------------------------------------------
  // Tirage
  // -------------------------------------------------------------------------
  const ent = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
  const choix = t => t[Math.floor(Math.random() * t.length)];
  const pgcd = (a, b) => (b ? pgcd(b, a % b) : Math.abs(a));

  // -------------------------------------------------------------------------
  // Rationnels exacts sur BigInt — toujours réduits, dénominateur positif
  // -------------------------------------------------------------------------
  const B = x => (typeof x === 'bigint' ? x : BigInt(x));
  const babs = x => (x < 0n ? -x : x);
  const bpgcd = (a, b) => { a = babs(a); b = babs(b); while (b) { const t = a % b; a = b; b = t; } return a; };

  function rat(n, d) {
    n = B(n); d = (d === undefined ? 1n : B(d));
    if (d === 0n) throw new Error('dénominateur nul');
    if (d < 0n) { n = -n; d = -d; }
    const g = bpgcd(n, d) || 1n;
    return { n: n / g, d: d / g };
  }
  const rZero = rat(0), rUn = rat(1);
  const rAdd = (x, y) => rat(x.n * y.d + y.n * x.d, x.d * y.d);
  const rMul = (x, y) => rat(x.n * y.n, x.d * y.d);
  const rNeg = x => ({ n: -x.n, d: x.d });
  const rInv = x => { if (x.n === 0n) throw new Error('division par zéro'); return rat(x.d, x.n); };
  const rNul = x => x.n === 0n;
  const rEgaux = (x, y) => x.n === y.n && x.d === y.d;
  const rTxt = x => (x.d === 1n ? String(x.n) : x.n + '/' + x.d);
  const rNum = x => Number(x.n) / Number(x.d);

  // Puissance entière d'un rationnel — exponentiation binaire, sinon 11⁶⁰
  // demanderait soixante multiplications au lieu de six.
  function rPuis(x, e) {
    if (e < 0) return rPuis(rInv(x), -e);
    let r = rUn, b = x;
    while (e > 0) { if (e & 1) r = rMul(r, b); b = rMul(b, b); e >>= 1; }
    return r;
  }

  // -------------------------------------------------------------------------
  // Exposants — rationnels eux aussi, mais petits : des entiers suffisent
  // -------------------------------------------------------------------------
  const ex = (n, d) => { d = d || 1; if (d < 0) { n = -n; d = -d; } const g = pgcd(Math.abs(n), d) || 1; return [n / g, d / g]; };
  const exAdd = (a, b) => ex(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const exMul = (a, k) => ex(a[0] * k[0], a[1] * k[1]);
  const exNul = a => a[0] === 0;
  // Partie entière VERS LE BAS, pour que la part fractionnaire reste dans
  // [0, 1) même quand l'exposant est négatif : -3/2 donne -2 et 1/2.
  const exPlancher = a => Math.floor(a[0] / a[1]);

  // -------------------------------------------------------------------------
  // Décomposition d'un entier en facteurs premiers — c'est elle qui permet de
  // replier 8^(1/3) en 2, et de reconnaître que 121 est 11².
  // -------------------------------------------------------------------------
  function facteurs(n) {
    n = babs(B(n));
    const f = {};
    for (let p = 2n; p * p <= n; p++) {
      while (n % p === 0n) { f[p] = (f[p] || 0) + 1; n /= p; }
    }
    if (n > 1n) f[n] = (f[n] || 0) + 1;
    return f;
  }

  // -------------------------------------------------------------------------
  // LES NOMBRES. Un objet dont les clés sont les signatures — « » pour un
  // rationnel pur, « 2^1/2 » pour √2, « 2^1/2·π^3 » pour √2·π³ — et les
  // valeurs, des coefficients rationnels.
  // -------------------------------------------------------------------------
  const cle = e => Object.keys(e).sort()
    .filter(b => !exNul(e[b]))
    .map(b => b + '^' + e[b][0] + '/' + e[b][1]).join('·');

  const zero = () => ({});
  const estZero = v => Object.keys(v).length === 0;

  // Pose un terme dans un nombre, en fusionnant s'il s'y trouve déjà.
  function poser(v, e, c) {
    if (rNul(c)) return v;
    const k = cle(e);
    if (!v[k]) v[k] = { e: e, c: c };
    else {
      const s = rAdd(v[k].c, c);
      if (rNul(s)) delete v[k]; else v[k].c = s;
    }
    return v;
  }

  const cst = q => poser({}, {}, q);
  const unC = cst(rUn);

  // Une base élevée à un exposant rationnel. Toute la subtilité est ici : on
  // replie dans le coefficient tout ce qui est repliable, et l'on ne garde en
  // signature que l'irréductible.
  function baseP(p, e) {
    if (exNul(e)) return cst(rUn);
    if (p === 'π') return poser({}, { 'π': e }, rUn);
    const n = B(p);
    if (n === 0n) return e[0] > 0 ? zero() : (() => { throw new Error('0 à un exposant négatif'); })();
    let coef = rUn, sig = {};
    const neg = n < 0n;
    // Un négatif à un exposant entier garde ou perd son signe ; à un exposant
    // fractionnaire il n'a pas de sens dans ℝ.
    if (neg) {
      if (e[1] !== 1) throw new Error('racine d’un nombre négatif');
      if (Math.abs(e[0]) % 2 === 1) coef = rNeg(coef);
    }
    const f = facteurs(n);
    for (const b of Object.keys(f)) {
      const t = exMul(e, ex(f[b]));            // exposant de ce premier
      const w = exPlancher(t);                 // part entière → coefficient
      const r = exAdd(t, ex(-w));              // part fractionnaire → signature
      if (w) coef = rMul(coef, rPuis(rat(B(b)), w));
      if (!exNul(r)) sig[b] = r;
    }
    return poser({}, sig, coef);
  }

  const oppose = v => { const o = {}; for (const k of Object.keys(v)) o[k] = { e: v[k].e, c: rNeg(v[k].c) }; return o; };

  function plus(a, b) {
    const o = {};
    for (const k of Object.keys(a)) o[k] = { e: a[k].e, c: a[k].c };
    for (const k of Object.keys(b)) poser(o, b[k].e, b[k].c);
    return o;
  }
  const moins = (a, b) => plus(a, oppose(b));

  // Le produit de deux termes : les coefficients se multiplient, les exposants
  // s'ajoutent — et ce qui redevient entier retourne au coefficient. C'est là
  // que « √2 × √2 » redevient 2.
  function foisTerme(x, y) {
    let coef = rMul(x.c, y.c);
    const e = {};
    for (const b of Object.keys(x.e)) e[b] = x.e[b];
    for (const b of Object.keys(y.e)) e[b] = e[b] ? exAdd(e[b], y.e[b]) : y.e[b];
    const sig = {};
    for (const b of Object.keys(e)) {
      if (b === 'π') { if (!exNul(e[b])) sig[b] = e[b]; continue; }
      const w = exPlancher(e[b]);
      const r = exAdd(e[b], ex(-w));
      if (w) coef = rMul(coef, rPuis(rat(B(b)), w));
      if (!exNul(r)) sig[b] = r;
    }
    return { e: sig, c: coef };
  }

  function fois(a, b) {
    const o = {};
    for (const ka of Object.keys(a)) for (const kb of Object.keys(b)) {
      const t = foisTerme(a[ka], b[kb]);
      poser(o, t.e, t.c);
    }
    return o;
  }

  // L'inverse. Un terme unique s'inverse de front. Deux termes s'inversent par
  // le CONJUGUÉ — « 1/(3 + √2) » —, ce qui est exactement le geste du
  // programme. Au-delà, on refuse plutôt que d'approcher.
  function inverse(v) {
    const ks = Object.keys(v);
    if (!ks.length) throw new Error('division par zéro');
    if (ks.length === 1) {
      const t = v[ks[0]];
      let coef = rInv(t.c), sig = {};
      for (const b of Object.keys(t.e)) {
        const t2 = ex(-t.e[b][0], t.e[b][1]);
        if (b === 'π') { sig[b] = t2; continue; }
        const w = exPlancher(t2);
        const r = exAdd(t2, ex(-w));
        if (w) coef = rMul(coef, rPuis(rat(B(b)), w));
        if (!exNul(r)) sig[b] = r;
      }
      return poser({}, sig, coef);
    }
    if (ks.length === 2) {
      const conj = poser({ [ks[0]]: v[ks[0]] }, v[ks[1]].e, rNeg(v[ks[1]].c));
      const den = fois(v, conj);
      if (Object.keys(den).length === 1) return fois(conj, inverse(den));
    }
    throw new Error('inverse hors de portée: ' + ecrire(v));
  }
  const divise = (a, b) => fois(a, inverse(b));

  // Puissance entière d'un nombre quelconque, par exponentiation binaire.
  // C'est elle qui rend « (2√2 − √7)¹⁵³ » calculable : cent cinquante-trois
  // devient huit multiplications, et ℚ[√2, √7] est stable par produit.
  function puis(v, e) {
    if (e < 0) return puis(inverse(v), -e);
    let r = unC, b = v;
    while (e > 0) { if (e & 1) r = fois(r, b); b = fois(b, b); e >>= 1; }
    return r;
  }

  // -------------------------------------------------------------------------
  // Comparaison
  // -------------------------------------------------------------------------
  const memes = (a, b) => estZero(moins(a, b));

  function valeur(v) {
    let s = 0;
    for (const k of Object.keys(v)) {
      let x = rNum(v[k].c);
      for (const b of Object.keys(v[k].e)) {
        const e = v[k].e[b][0] / v[k].e[b][1];
        x *= Math.pow(b === 'π' ? Math.PI : Number(b), e);
      }
      s += x;
    }
    return s;
  }
  const cmp = (a, b) => {
    if (memes(a, b)) return 0;
    const d = valeur(moins(a, b));
    return d < 0 ? -1 : 1;
  };
  const signe = v => (estZero(v) ? 0 : (valeur(v) < 0 ? -1 : 1));

  // -------------------------------------------------------------------------
  // Écriture canonique
  // -------------------------------------------------------------------------
  function ecrireTerme(t) {
    const bs = Object.keys(t.e);
    if (!bs.length) return rTxt(t.c);
    // DEUX RACINES CARRÉES N'EN FONT QU'UNE. Le noyau décompose sur des bases
    // PREMIÈRES — c'est ce qui rend le calcul exact —, si bien que √6 y vit
    // sous la forme √2 × √3. Juste, mais illisible : la feuille écrit √6, et
    // c'est la feuille que l'élève a sous les yeux. On recompose donc à
    // l'écriture, et là seulement. π n'entre jamais sous une racine : son
    // exposant est entier par construction, il ne peut pas être de la partie.
    const carrees = bs.filter(b => b !== 'π' && t.e[b][0] === 1 && t.e[b][1] === 2);
    let radicande = 1n;
    for (const b of carrees) radicande *= BigInt(b);
    let posee = false;
    const parts = bs.map(b => {
      const e = t.e[b];
      const nom = b === 'π' ? 'π' : b;
      if (e[1] === 2 && e[0] === 1) {
        if (b === 'π') return '√π';                  // √π ne se mêle à rien
        if (posee) return null;                      // déjà entrée sous la racine
        posee = true;
        return '√' + radicande;
      }
      if (e[1] === 1) return e[0] === 1 ? nom : nom + '^' + e[0];
      return nom + '^(' + e[0] + '/' + e[1] + ')';
    }).filter(x => x !== null);
    const c = t.c;
    const tete = rEgaux(c, rUn) ? '' : (rEgaux(c, rat(-1)) ? '-' : rTxt(c) + ' ');
    return tete + parts.join(' × ');
  }

  function ecrire(v) {
    const ks = Object.keys(v).sort();
    if (!ks.length) return '0';
    // ON N'OUVRE PAS SUR UN MOINS quand un terme positif attend derrière. La
    // valeur est la même, mais « √3 - √2 » est ce que la feuille écrit, et
    // « -√2 + √3 » ce qu'un élève relit trois fois avant d'y croire.
    if (v[ks[0]].c.n < 0n) {
      const i = ks.findIndex(k => v[k].c.n > 0n);
      if (i > 0) ks.unshift(ks.splice(i, 1)[0]);
    }
    let out = '';
    ks.forEach((k, i) => {
      const s = ecrireTerme(v[k]);
      if (i === 0) out = s;
      else out += (s[0] === '-' ? ' - ' + s.slice(1) : ' + ' + s);
    });
    return out;
  }

  // -------------------------------------------------------------------------
  // Analyseur — nombres décimaux à la virgule ou au point, fractions, √, π,
  // exposants entre parenthèses ou non, produit implicite.
  // -------------------------------------------------------------------------
  const JETON = /\d+[.,]\d+|\d+|√|π|\^|[()]|[+\-*×÷/:]|[a-zA-Z]+/g;

  function analyser(src, env) {
    const t = String(src).replace(/\[/g, '(').replace(/\]/g, ')').match(JETON);
    if (!t) throw new Error('expression vide: ' + src);
    let i = 0;
    const fin = () => i >= t.length;
    const voir = () => t[i];

    function expression() {
      let v = terme();
      while (!fin() && (voir() === '+' || voir() === '-')) {
        const op = t[i++];
        v = op === '+' ? plus(v, terme()) : moins(v, terme());
      }
      return v;
    }
    function terme() {
      let v = puissance();
      for (;;) {
        if (fin()) break;
        const j = voir();
        if (j === '×' || j === '*') { i++; v = fois(v, puissance()); }
        else if (j === '/' || j === ':' || j === '÷') { i++; v = divise(v, puissance()); }
        else if (j === '√' || j === 'π' || j === '(' || /^\d/.test(j)) v = fois(v, puissance());
        else break;
      }
      return v;
    }
    function puissance() {
      let v = facteur();
      while (!fin() && voir() === '^') {
        i++;
        v = puis(v, exposant());
      }
      return v;
    }
    // L'exposant est un ENTIER, éventuellement négatif et entre parenthèses.
    function exposant() {
      let neg = false;
      if (voir() === '(') {
        i++;
        if (voir() === '-') { neg = true; i++; }
        const n = Number(t[i++]);
        if (voir() !== ')') throw new Error('exposant non fermé dans ' + src);
        i++;
        return neg ? -n : n;
      }
      if (voir() === '-') { neg = true; i++; }
      const n = Number(t[i++]);
      if (!Number.isInteger(n)) throw new Error('exposant non entier dans ' + src);
      return neg ? -n : n;
    }
    function facteur() {
      if (voir() === '-') { i++; return oppose(puissance()); }
      if (voir() === '+') { i++; return puissance(); }
      if (voir() === '(') {
        i++; const v = expression();
        if (voir() !== ')') throw new Error('parenthèse non fermée: ' + src);
        i++; return v;
      }
      if (voir() === '√') {
        i++;
        const dedans = facteur();
        const ks = Object.keys(dedans);
        if (ks.length !== 1) throw new Error('racine d’une somme: ' + src);
        return puisRat(dedans, ex(1, 2));
      }
      if (voir() === 'π') { i++; return baseP('π', ex(1)); }
      const j = t[i++];
      if (/^\d+[.,]\d+$/.test(j)) {
        const [a, b] = j.replace(',', '.').split('.');
        return cst(rat(B(a + b), B('1' + '0'.repeat(b.length))));
      }
      if (/^\d+$/.test(j)) return cst(rat(B(j)));
      if (/^[a-zA-Z]+$/.test(j)) {
        if (!env || !(j in env)) throw new Error('variable inconnue: ' + j);
        return env[j];
      }
      throw new Error('jeton inattendu « ' + j + ' » dans ' + src);
    }

    const v = expression();
    if (!fin()) throw new Error('reste non analysé dans ' + src);
    return v;
  }

  // Élever un TERME unique à un exposant rationnel — c'est ainsi que √ opère.
  function puisRat(v, e) {
    const ks = Object.keys(v);
    if (ks.length !== 1) throw new Error('exposant fractionnaire sur une somme');
    const t = v[ks[0]];
    if (t.c.n < 0n) throw new Error('racine d’un nombre négatif');
    let out = cst(rUn);
    // le coefficient rationnel se décompose en premiers, numérateur et
    // dénominateur, pour que √(16/9) rende bien 4/3.
    const haut = facteurs(t.c.n), bas = facteurs(t.c.d);
    for (const b of Object.keys(haut)) out = fois(out, baseP(b, exMul(e, ex(haut[b]))));
    for (const b of Object.keys(bas)) out = fois(out, baseP(b, exMul(e, ex(-bas[b]))));
    for (const b of Object.keys(t.e)) out = fois(out, baseP(b, exMul(e, t.e[b])));
    return out;
  }

  // -------------------------------------------------------------------------
  // Relations
  // -------------------------------------------------------------------------
  const OPS = { '<': [-1], '>': [1], '≤': [-1, 0], '≥': [1, 0], '=': [0], '≠': [-1, 1] };

  function verifierRelation(texte, env) {
    const m = String(texte).split(/\s*([<>≤≥=≠])\s*/);
    if (m.length < 3) return null;
    for (let k = 1; k < m.length; k += 2) {
      const g = analyser(m[k - 1], env), d = analyser(m[k + 1], env);
      if (OPS[m[k]].indexOf(cmp(g, d)) < 0) {
        return '« ' + m[k - 1].trim() + ' ' + m[k] + ' ' + m[k + 1].trim() + ' » فاسدة';
      }
    }
    return '';
  }

  // -------------------------------------------------------------------------
  // Rendu — l'arabe coule à droite, les mathématiques à gauche
  // -------------------------------------------------------------------------
  const FRACTION = /(\d+)\s*\/\s*(\d+)/g;
  const fraction = s => String(s).replace(FRACTION,
    (_, n, d) => '<span class="frac"><span class="num">' + n
      + '</span><span class="den">' + d + '</span></span>');
  const echapper = s => String(s).replace(/&/g, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Un exposant peut être négatif ou parenthésé : « 5^-3 », « 5^(-3) ».
  //
  // LES DEUX PARENTHÈSES VONT ENSEMBLE, ou aucune. Écrite « \(?…\)? », la
  // règle acceptait une parenthèse fermante sans ouvrante — et mangeait alors
  // celle de la BASE : « (2^4)^11 » s'affichait « (2⁴¹¹ », sans fermeture et
  // avec deux exposants collés. L'élève lisait une expression qui n'existe pas.
  const exposants = s => String(s).replace(/\^\((-?\d+)\)|\^(-?\d+)/g,
    (m, entre, nu) => '<sup>' + (entre === undefined ? nu : entre) + '</sup>');
  const bloc = s => '<span dir="ltr" class="expr">'
    + exposants(fraction(echapper(s))) + '</span>';

  const ARABE = /[؀-ۿ]/;
  const CAR = '0-9A-Za-z+\\-*×÷/:=^().,|<>≤≥≠؛\\[\\]∈{}∞√π';
  const RUN = new RegExp('[' + CAR + ']+(?:\\s+[' + CAR + ']+)*', 'g');
  const ISOLER = /[+\-*×÷/=^|<>≤≥≠؛∈√π]|\(\s*[0-9]/;

  function isoMixte(texte) {
    return String(texte).replace(RUN, m => {
      const n = m.trim();
      if (!ISOLER.test(n)) return m;
      const i = m.indexOf(n);
      return m.slice(0, i) + bloc(n) + m.slice(i + n.length);
    });
  }

  const rendreMath = s => (s && typeof s === 'object' && s.brut) ? s.brut
    : (ARABE.test(String(s)) ? isoMixte(s) : bloc(s));

  function rendre(brut) {
    return {
      operation: brut.enonce.map(rendreMath).join(' '),
      steps: brut.etapes.map(e => e[0] + ': ' + rendreMath(e[1])),
      hint: brut.indice,
      // LA PROVENANCE VOYAGE AVEC L'EXERCICE — voir ci-dessus.
      source: brut.source || '',
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
        for (const e of (brut.etapes || [])) {
          if (CADRE.test(e[0])) continue;
          notions.add(/القاعدة/.test(e[0]) ? String(e[1]) : String(e[0]));
        }
        const n = notions.size;
        return n <= 1 ? 'facile' : (n <= 3 ? 'moyen' : 'difficile');
      })()
    };
  }

  // -------------------------------------------------------------------------
  // Registre
  // -------------------------------------------------------------------------
  const PROBLEMES = {};
  const enregistrer = (n, def) => { PROBLEMES[n] = def; };
  const tirer = n => PROBLEMES[n].f();
  const construire = n => ({
    id: 'ex' + n,
    title: 'التمرين ' + n + ' — ' + PROBLEMES[n].titre,
    questions: tirer(n).map(rendre)
  });

  const API = {
    ent, choix, pgcd, rat, rAdd, rMul, rNeg, rInv, rTxt, rEgaux, rNul, rPuis,
    ex, zero, cst, baseP, plus, moins, oppose, fois, inverse, divise, puis,
    puisRat, memes, cmp, signe, valeur, ecrire, facteurs, analyser,
    verifierRelation, fraction, bloc, isoMixte, rendreMath, rendre, ARABE,
    PROBLEMES, enregistrer, tirer, construire
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Puiss = API;
})(typeof window !== 'undefined' ? window : globalThis);
