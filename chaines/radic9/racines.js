// L'arithmétique EXACTE des racines carrées — le moteur de la leçon
// « العمليات في ℝ — حساب عبارات بها جذور تربيعية » (9 أساسي).
//
// Un réel de ce chapitre s'écrit comme une somme finie  Σ qᵢ √dᵢ  où les qᵢ
// sont rationnels et les dᵢ des entiers SANS FACTEUR CARRÉ. C'est la forme
// canonique : √48 n'existe pas, il vaut 4√3 ; et deux nombres sont égaux si et
// seulement si leurs coefficients coïncident, un à un. Aucun flottant
// n'intervient dans une égalité — les décimales ne servent qu'à décider un
// signe sous une valeur absolue.
//
// L'ensemble est CLOS : la somme, le produit et le quotient de deux tels
// nombres en sont encore un. Le produit parce que √a·√b = √(ab), qu'on
// renormalise ; le quotient parce qu'on rationalise par conjugaisons
// successives — c'est exactement le geste que la fiche demande à l'élève, et
// le moteur le fait avec les mêmes règles.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Radic;
  const { rat, add, sub, mul, div, neg, abs, signe, egaux, txt: txtRat } = F;

  // -------------------------------------------------------------------------
  // Le radicande sans facteur carré : 48 = 16 × 3 donne (4 ; 3).
  // -------------------------------------------------------------------------
  function extraire(d) {
    let dehors = 1, dedans = d;
    for (let k = 2; k * k <= dedans; k++) {
      while (dedans % (k * k) === 0) { dedans /= k * k; dehors *= k; }
    }
    return { dehors, dedans };
  }

  const zero = () => ({});
  // q√d, ramené à la forme canonique
  function terme(q, d) {
    if (q.n === 0 || d === 0) return {};
    if (d < 0) throw new Error('racine d’un négatif: ' + d);
    const { dehors, dedans } = extraire(d);
    const e = {};
    e[dedans] = mul(q, rat(dehors));
    return e;
  }
  const cst = q => terme(q, 1);
  const rac = d => terme(rat(1), d);

  const cles = x => Object.keys(x).map(Number).sort((a, b) => a - b);
  function poser(e, d, q) {
    const v = add(e[d] || rat(0), q);
    if (v.n === 0) delete e[d]; else e[d] = v;
    return e;
  }
  function plus(x, y) {
    const e = {};
    for (const d of cles(x)) poser(e, d, x[d]);
    for (const d of cles(y)) poser(e, d, y[d]);
    return e;
  }
  const oppose = x => { const e = {}; for (const d of cles(x)) e[d] = neg(x[d]); return e; };
  const moins = (x, y) => plus(x, oppose(y));

  // √a · √b = √(ab), puis on renormalise. C'est ici que 3√12 devient 6√3.
  function fois(x, y) {
    let e = {};
    for (const a of cles(x)) {
      for (const b of cles(y)) {
        const t = terme(mul(x[a], y[b]), a * b);
        e = plus(e, t);
      }
    }
    return e;
  }
  const nul = x => cles(x).length === 0;
  const estRationnel = x => cles(x).every(d => d === 1);
  const partieRat = x => x[1] || rat(0);
  const memes = (x, y) => nul(moins(x, y));

  // L'inverse : on rationalise. Tant que le dénominateur porte un radical, on
  // multiplie haut et bas par le CONJUGUÉ par rapport à l'un d'eux — les
  // termes qui le portent changent de signe, et leur carré disparaît. En
  // quelques tours il ne reste qu'un rationnel.
  function inverse(x) {
    if (nul(x)) throw new Error('inverse de 0');
    let num = cst(rat(1)), den = x;
    for (let tour = 0; tour < 8 && !estRationnel(den); tour++) {
      const d = cles(den).find(k => k !== 1);
      const conj = {};
      for (const k of cles(den)) conj[k] = (k === d) ? neg(den[k]) : den[k];
      num = fois(num, conj);
      den = fois(den, conj);
    }
    if (!estRationnel(den)) throw new Error('dénominateur non rationalisable');
    const q = partieRat(den);
    if (q.n === 0) throw new Error('dénominateur nul après rationalisation');
    return fois(num, cst(div(rat(1), q)));
  }
  const divise = (x, y) => fois(x, inverse(y));

  // √(q) pour un rationnel q ≥ 0 : √(n/m) = √(nm)/m.
  function racineDe(q) {
    if (q.n < 0) throw new Error('racine d’un rationnel négatif');
    return fois(terme(rat(1), q.n * q.d), cst(rat(1, q.d)));
  }

  // √(6 - 4√2) vaut 2 - √2 : la racine d'un nombre de la forme p + q√d est
  // encore de cette forme quand p² - q²d est un carré. On résout exactement
  //   (a + b√d)² = a² + b²d + 2ab√d = p + q√d
  // au lieu d'approcher — approcher ferait perdre l'égalité exacte.
  function carreParfait(q) {
    if (q.n < 0) return null;
    const r = n => { const s = Math.round(Math.sqrt(n)); return s * s === n ? s : null; };
    const a = r(q.n), b = r(q.d);
    return (a !== null && b !== null) ? rat(a, b) : null;
  }
  function racineElement(x) {
    if (nul(x)) return zero();
    if (valeur(x) < 0) throw new Error('racine d’un nombre négatif');
    if (estRationnel(x)) {
      const q = partieRat(x);
      return fois(terme(rat(1), q.n * q.d), cst(rat(1, q.d)));
    }
    const ds = cles(x).filter(d => d !== 1);
    if (ds.length !== 1) throw new Error('racine non extractible: ' + ecrire(x));
    const d = ds[0], p = partieRat(x), q = x[d];
    const disc = carreParfait(sub(mul(p, p), mul(mul(q, q), rat(d))));
    if (!disc) throw new Error('racine non extractible: ' + ecrire(x));
    for (const s of [add(p, disc), sub(p, disc)]) {
      const a2 = div(s, rat(2));
      const a = carreParfait(a2);
      if (!a || a.n === 0) continue;
      const b = div(q, mul(rat(2), a));
      const cand = plus(cst(a), terme(b, d));
      if (memes(fois(cand, cand), x) && valeur(cand) >= 0) return cand;
      const opp = oppose(cand);
      if (memes(fois(opp, opp), x) && valeur(opp) >= 0) return opp;
    }
    throw new Error('racine non extractible: ' + ecrire(x));
  }

  const valeur = x => cles(x).reduce((s, d) => s + (x[d].n / x[d].d) * Math.sqrt(d), 0);
  const positif = x => valeur(x) > 0;
  const cmp = (x, y) => {
    const v = valeur(moins(x, y));
    return Math.abs(v) < 1e-9 ? 0 : (v < 0 ? -1 : 1);
  };
  const valeurAbsolue = x => (valeur(x) < 0 ? oppose(x) : x);

  // -------------------------------------------------------------------------
  // Écriture canonique : « 3 + 2√2 », « -5/3 √7 », « √5 » (jamais « 1√5 »).
  // -------------------------------------------------------------------------
  function morceau(q, d) {
    const a = abs(q);
    if (d === 1) return txtRat(a);
    const r = '√' + d;
    if (egaux(a, rat(1))) return r;
    return txtRat(a) + (a.d > 1 ? ' ' : '') + r;
  }
  function ecrire(x) {
    const ds = cles(x);
    if (!ds.length) return '0';
    // le rationnel d'abord, comme sur la fiche : « 3 + 2√2 »
    ds.sort((a, b) => (a === 1 ? -1 : b === 1 ? 1 : a - b));
    return ds.map((d, i) => {
      const m = morceau(x[d], d);
      if (i === 0) return (signe(x[d]) < 0 ? '-' : '') + m;
      return (signe(x[d]) < 0 ? ' - ' : ' + ') + m;
    }).join('');
  }
  const par = x => {
    const t = ecrire(x);
    return (cles(x).length > 1 || t[0] === '-') ? '(' + t + ')' : t;
  };

  // -------------------------------------------------------------------------
  // Analyseur : + - × / ( ) √ | | ^2, fractions et entiers.
  // -------------------------------------------------------------------------
  const JETON = /\d+|[a-zA-Z]|[+\-×*/():|√^]/g;

  function analyser(src, env) {
    const t = String(src).replace(/\[/g, '(').replace(/\]/g, ')').match(JETON);
    if (!t) throw new Error('expression vide: ' + src);
    let i = 0;
    const fin = () => i >= t.length;
    const voir = () => t[i];

    function expression() {
      let v = terme2();
      while (!fin() && (voir() === '+' || voir() === '-')) {
        const op = t[i++];
        v = op === '+' ? plus(v, terme2()) : moins(v, terme2());
      }
      return v;
    }
    function terme2() {
      let v = puissance();
      for (;;) {
        if (fin()) break;
        const j = voir();
        if (j === '×' || j === '*') { i++; v = fois(v, puissance()); }
        else if (j === '/' || j === ':') { i++; v = divise(v, puissance()); }
        else if (j === '√' || j === '(' || /^[a-zA-Z]$/.test(j)) v = fois(v, puissance());
        else break;
      }
      return v;
    }
    function puissance() {
      let v = facteur();
      while (!fin() && voir() === '^') {
        i++;
        const e = Number(t[i++]);
        let r = cst(rat(1));
        for (let k = 0; k < e; k++) r = fois(r, v);
        v = r;
      }
      return v;
    }
    function facteur() {
      if (voir() === '-') { i++; return oppose(puissance()); }
      if (voir() === '+') { i++; return puissance(); }
      if (voir() === '(') {
        i++; const v = expression();
        if (voir() !== ')') throw new Error('parenthèse non fermée: ' + src);
        i++; return v;
      }
      if (voir() === '|') {
        i++; const v = expression();
        if (voir() !== '|') throw new Error('barre non fermée: ' + src);
        i++;
        if (Math.abs(valeur(v)) < 1e-9) throw new Error('valeur absolue au bord de zéro');
        return valeurAbsolue(v);
      }
      if (voir() === '√') {
        i++;
        // √ suivi d'un entier, d'une fraction, ou d'une parenthèse
        if (voir() === '(') { i++; const v = expression();
          if (voir() !== ')') throw new Error('parenthèse non fermée sous la racine');
          i++;
          return racineElement(v);
        }
        // Pas de raccourci « √n/m » : dans « √72/√6 » la barre est une
        // DIVISION entre deux racines, pas un dénominateur sous la racine.
        // Une fraction sous le radical s'écrit toujours √(n/m).
        return rac(Number(t[i++]));
      }
      const j = t[i++];
      if (/^\d+$/.test(j)) {
        let q = rat(Number(j));
        if (!fin() && voir() === '/' && /^\d+$/.test(t[i + 1] || '')) { i++; q = div(q, rat(Number(t[i++]))); }
        return cst(q);
      }
      if (/^[a-zA-Z]$/.test(j)) {
        if (!env || env[j] === undefined) throw new Error('lettre inconnue: ' + j);
        return env[j];
      }
      throw new Error('jeton inattendu « ' + j + ' » dans ' + src);
    }

    const v = expression();
    if (!fin()) throw new Error('reste non analysé dans ' + src);
    return v;
  }

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

  const API = { extraire, zero, terme, cst, rac, plus, moins, oppose, fois,
                inverse, divise, racineDe, nul, estRationnel, partieRat, memes,
                valeur, positif, cmp, valeurAbsolue, ecrire, par, cles,
                analyser, verifierRelation, racineElement, carreParfait };
  if (M) module.exports = API;
  else racine.Rad = API;
})(typeof window !== 'undefined' ? window : globalThis);
