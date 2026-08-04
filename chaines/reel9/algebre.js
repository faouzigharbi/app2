// L'algèbre de la leçon « الجمع في ℝ » (9 أساسي).
//
// Ce que le chapitre demande vraiment : additionner des réels dont certains
// sont IRRATIONNELS. Or on ne calcule jamais √2 — on le TRANSPORTE. Dans
// « x - [1 - (x - 1/2)] - [-1/2 + (x - 5/2) - (-1 + √2)] », √2 se comporte
// exactement comme une lettre de plus : il s'ajoute à lui-même, il se
// simplifie avec son opposé, et il reste tel quel dans le résultat.
//
// D'où la représentation : un réel est une COMBINAISON LINÉAIRE à coefficients
// rationnels sur la base { 1, x, y, a, b, √2, √3, √5, π }. L'addition est
// alors exacte, et deux expressions sont égales si et seulement si tous leurs
// coefficients coïncident — pas « à peu près », exactement. Aucun flottant
// n'intervient dans une égalité.
//
// Les flottants ne servent qu'à UNE chose : décider le signe de ce qu'il y a
// sous une valeur absolue. Et là le générateur refuse tout tirage où ce signe
// serait trop proche de zéro pour être sûr.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;
  const { rat, add, sub, mul, div, neg, abs, signe, egaux, txt, cmp } = F;

  // La base, dans l'ordre où on l'écrit : les lettres, la constante, puis les
  // irrationnels — c'est l'ordre de la fiche (« E = x + 1/2 + √2 »).
  const LETTRES = ['x', 'y', 'a', 'b'];
  const IRR = ['√2', '√3', '√5', 'π'];
  const BASE = LETTRES.concat(['1'], IRR);
  const VALEUR = { '√2': Math.SQRT2, '√3': Math.sqrt(3), '√5': Math.sqrt(5), 'π': Math.PI };

  const zero = () => ({});
  const un = k => { const e = {}; e[k] = rat(1); return e; };
  const cst = r => { const e = {}; if (r.n !== 0) e['1'] = r; return e; };

  function combiner(u, v, s) {
    const e = {};
    for (const k of BASE) {
      const c = add(u[k] || rat(0), mul(rat(s), v[k] || rat(0)));
      if (c.n !== 0) e[k] = c;
    }
    return e;
  }
  const plus = (u, v) => combiner(u, v, 1);
  const moins = (u, v) => combiner(u, v, -1);
  const oppose = u => moins(zero(), u);
  const fois = (r, u) => {
    const e = {};
    for (const k of BASE) { const c = mul(r, u[k] || rat(0)); if (c.n !== 0) e[k] = c; }
    return e;
  };
  const memes = (u, v) => BASE.every(k => egaux(u[k] || rat(0), v[k] || rat(0)));
  const nul = u => BASE.every(k => !u[k] || u[k].n === 0);
  const estRationnel = u => BASE.every(k => k === '1' || !u[k] || u[k].n === 0);
  const partieRat = u => u['1'] || rat(0);

  // Valeur numérique — uniquement pour décider un signe, jamais une égalité.
  function valeur(u, env) {
    let s = 0;
    for (const k of BASE) {
      const c = u[k]; if (!c) continue;
      const q = c.n / c.d;
      if (k === '1') s += q;
      else if (VALEUR[k] !== undefined) s += q * VALEUR[k];
      else if (env && env[k] !== undefined) s += q * valeur(env[k], env);
      else return NaN;                       // lettre libre : signe indécidable
    }
    return s;
  }

  // -------------------------------------------------------------------------
  // Écriture
  // -------------------------------------------------------------------------
  function terme(k, c, premier) {
    const a = abs(c);
    // « 3/2x » se lit mal et invite à confondre le x avec le dénominateur :
    // un coefficient fractionnaire prend une espace, un entier n'en prend pas.
    const corps = k === '1' ? txt(a)
      : (egaux(a, rat(1)) ? k : txt(a) + (a.d > 1 ? ' ' : '') + k);
    if (premier) return (signe(c) < 0 ? '-' : '') + corps;
    return (signe(c) < 0 ? ' - ' : ' + ') + corps;
  }
  function ecrire(u) {
    const parts = [];
    for (const k of BASE) {
      const c = u[k];
      if (!c || c.n === 0) continue;
      parts.push(terme(k, c, parts.length === 0));
    }
    return parts.length ? parts.join('') : '0';
  }
  // Entre parenthèses, mais seulement si c'est utile : « (x + 1) » oui,
  // « (√2) » non — une parenthèse inutile fait croire à un calcul à faire.
  const par = u => {
    const t = ecrire(u);
    return /[+\-]/.test(t.slice(1)) || t[0] === '-' ? '(' + t + ')' : t;
  };

  // -------------------------------------------------------------------------
  // Analyseur : + - ( ) [ ] | | , rationnels, décimaux, lettres, irrationnels.
  // Aucun produit : dans ce chapitre on n'additionne, et c'est tout.
  // -------------------------------------------------------------------------
  const JETON = /√\d+|\d+[,.]\d+|\d+|[a-zA-Z]|π|[+\-()[\]|/]/g;

  function analyser(src, env) {
    const t = String(src).match(JETON);
    if (!t) throw new Error('expression vide: ' + src);
    let i = 0;
    const fin = () => i >= t.length;
    const voir = () => t[i];

    function expression() {
      let v = facteur();
      while (!fin() && (voir() === '+' || voir() === '-')) {
        const op = t[i++];
        v = op === '+' ? plus(v, facteur()) : moins(v, facteur());
      }
      return v;
    }
    function facteur() {
      if (voir() === '-') { i++; return oppose(facteur()); }
      if (voir() === '+') { i++; return facteur(); }
      if (voir() === '(' || voir() === '[') {
        const ouvrant = t[i++];
        const v = expression();
        const attendu = ouvrant === '(' ? ')' : ']';
        if (voir() !== attendu) throw new Error('parenthèse non fermée: ' + src);
        i++;
        return v;
      }
      if (voir() === '|') {
        i++;
        const v = expression();
        if (voir() !== '|') throw new Error('barre non fermée: ' + src);
        i++;
        const x = valeur(v, env);
        if (!isFinite(x)) throw new Error('valeur absolue indécidable dans ' + src);
        if (Math.abs(x) < 1e-9) throw new Error('valeur absolue au bord de zéro');
        return x < 0 ? oppose(v) : v;
      }
      const j = t[i++];
      // un rationnel écrit « 3/4 » : la barre de fraction lie plus fort que tout
      if (/^\d+$/.test(j) || /^\d+[,.]\d+$/.test(j)) {
        let r = nombre(j);
        if (!fin() && voir() === '/') { i++; r = div(r, nombre(t[i++])); }
        // juxtaposition : « 2x » et « 2√5 » sont des produits. C'est ainsi
        // qu'on écrit un coefficient, et l'analyseur doit savoir le relire —
        // sinon il ne pourrait pas contrôler ce que le générateur affiche.
        if (!fin()) {
          const suite = voir();
          if (suite === 'π' || /^√\d+$/.test(suite) || /^[a-zA-Z]$/.test(suite)) {
            i++;
            const base = (env && env[suite] !== undefined) ? env[suite] : un(suite);
            if (BASE.indexOf(suite) < 0 && !(env && env[suite] !== undefined)) {
              throw new Error('symbole non prévu: ' + suite);
            }
            return fois(r, base);
          }
        }
        return cst(r);
      }
      if (j === 'π' || /^√\d+$/.test(j)) {
        if (BASE.indexOf(j) < 0) throw new Error('irrationnel non prévu: ' + j);
        return un(j);
      }
      if (/^[a-zA-Z]$/.test(j)) {
        if (env && env[j] !== undefined) return env[j];
        if (LETTRES.indexOf(j) >= 0) return un(j);
        throw new Error('lettre inconnue: ' + j);
      }
      throw new Error('jeton inattendu « ' + j + ' » dans ' + src);
    }
    function nombre(j) {
      const d = /^(\d+)[,.](\d+)$/.exec(j);
      if (d) return rat(Number(d[1] + d[2]), Math.pow(10, d[2].length));
      return rat(Number(j));
    }

    const v = expression();
    if (!fin()) throw new Error('reste non analysé dans ' + src);
    return v;
  }

  // Une chaîne « A = B = C » : chaque maillon est une égalité EXACTE de
  // combinaisons linéaires. Deux réels ne sont pas « égaux à 10^-9 près » :
  // ils le sont ou ils ne le sont pas.
  function verifierRelation(texte, env) {
    const morceaux = String(texte).split(/\s*(=)\s*/);
    if (morceaux.length < 3) return null;
    for (let k = 1; k < morceaux.length; k += 2) {
      const g = analyser(morceaux[k - 1], env), d = analyser(morceaux[k + 1], env);
      if (!memes(g, d)) {
        return '« ' + morceaux[k - 1].trim() + ' = ' + morceaux[k + 1].trim() + ' » فاسدة';
      }
    }
    return '';
  }

  const API = { LETTRES, IRR, BASE, VALEUR, zero, un, cst, plus, moins, oppose,
                fois, memes, nul, estRationnel, partieRat, valeur, ecrire, par,
                analyser, verifierRelation, rat };
  if (M) module.exports = API;
  else racine.Alg = API;
})(typeof window !== 'undefined' ? window : globalThis);
