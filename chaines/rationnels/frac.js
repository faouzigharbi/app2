// Noyau de la leçon « مقارنة عددين كسريين نسبيين » (8 أساسي).
//
// Ce chapitre porte sur les rationnels RELATIFS : les nombres négatifs y sont
// la matière même, pas un accident. C'est le piège que la fiche travaille —
// 13/5 > 13/8 mais −13/5 < −13/8.
//
// Trois briques : l'arithmétique exacte sur les fractions, un analyseur
// d'expressions (avec variables, pour les exercices littéraux), et le rendu
// des fractions en barre horizontale.
(function (racine) {
  'use strict';

  const ent = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
  const choix = t => t[Math.floor(Math.random() * t.length)];

  // -------------------------------------------------------------------------
  // Rationnels exacts, toujours réduits, dénominateur positif
  // -------------------------------------------------------------------------
  const pgcd = (a, b) => (b ? pgcd(b, a % b) : Math.abs(a));

  function rat(n, d) {
    d = (d === undefined) ? 1 : d;
    if (d === 0) throw new Error('dénominateur nul');
    if (d < 0) { n = -n; d = -d; }
    const g = pgcd(Math.abs(n), d) || 1;
    return { n: n / g, d: d / g };
  }

  const add = (x, y) => rat(x.n * y.d + y.n * x.d, x.d * y.d);
  const sub = (x, y) => rat(x.n * y.d - y.n * x.d, x.d * y.d);
  const mul = (x, y) => rat(x.n * y.n, x.d * y.d);
  const div = (x, y) => rat(x.n * y.d, x.d * y.n);
  const neg = x => rat(-x.n, x.d);
  const abs = x => rat(Math.abs(x.n), x.d);
  const signe = x => (x.n < 0 ? -1 : x.n > 0 ? 1 : 0);
  const egaux = (x, y) => x.n === y.n && x.d === y.d;
  // Comparaison exacte : les dénominateurs sont positifs, le produit croisé suffit.
  const cmp = (x, y) => {
    const v = x.n * y.d - y.n * x.d;
    return v < 0 ? -1 : v > 0 ? 1 : 0;
  };
  const txt = x => (x.d === 1 ? String(x.n) : x.n + '/' + x.d);

  // -------------------------------------------------------------------------
  // Analyseur : + − × / ( ) [ ] et variables. Sert au validateur pour
  // recalculer chaque étape, y compris les expressions littérales.
  // -------------------------------------------------------------------------
  function jetons(s) {
    const t = String(s).replace(/[[\]]/g, m => (m === '[' ? '(' : ')'))
      .match(/\d+|[a-zA-Z]+|[+\-×*/():]/g);
    if (!t) throw new Error('expression vide: ' + s);
    return t;
  }

  function analyser(src, env) {
    const t = jetons(src);
    let i = 0;
    const fin = () => i >= t.length;
    const voir = () => t[i];

    function expression() {
      let v = terme();
      while (!fin() && (voir() === '+' || voir() === '-')) {
        const op = t[i++];
        v = op === '+' ? add(v, terme()) : sub(v, terme());
      }
      return v;
    }
    function terme() {
      let v = facteur();
      for (;;) {
        if (fin()) break;
        const j = voir();
        if (j === '×' || j === '*' || j === '/' || j === ':') {
          const op = t[i++];
          v = (op === '/' || op === ':') ? div(v, facteur()) : mul(v, facteur());
        } else if (/^\d+$/.test(j) || /^[a-zA-Z]+$/.test(j) || j === '(') {
          v = mul(v, facteur());     // juxtaposition : « 6x » vaut 6 × x
        } else break;
      }
      return v;
    }
    function facteur() {
      if (voir() === '-') { i++; return neg(facteur()); }
      if (voir() === '+') { i++; return facteur(); }
      if (voir() === '(') {
        i++;
        const v = expression();
        if (voir() !== ')') throw new Error('parenthèse non fermée: ' + src);
        i++;
        return v;
      }
      const j = t[i++];
      if (/^\d+$/.test(j)) return rat(Number(j));
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

  // -------------------------------------------------------------------------
  // Une chaîne de comparaisons « a < b < c » : chaque maillon doit être vrai.
  // -------------------------------------------------------------------------
  const OPS = { '<': [-1], '>': [1], '≤': [-1, 0], '≥': [1, 0], '=': [0] };

  function verifierComparaison(texte, env) {
    const morceaux = String(texte).split(/\s*([<>≤≥=])\s*/);
    if (morceaux.length < 3) return null;              // pas une comparaison
    for (let k = 1; k < morceaux.length; k += 2) {
      const op = morceaux[k];
      const g = analyser(morceaux[k - 1], env), d = analyser(morceaux[k + 1], env);
      if (OPS[op].indexOf(cmp(g, d)) < 0) {
        return `« ${morceaux[k - 1].trim()} ${op} ${morceaux[k + 1].trim()} » فاسدة`;
      }
    }
    return '';
  }

  // -------------------------------------------------------------------------
  // Rendu : fraction en barre horizontale, expression isolée en dir="ltr".
  // Sans l'isolation, « -13/5 < -13/8 » s'affiche à l'envers dans une page RTL.
  // -------------------------------------------------------------------------
  const FRACTION = /(\d+)\s*\/\s*(\d+)/g;

  const fraction = s => String(s).replace(FRACTION,
    (_, n, d) => '<span class="frac"><span class="num">' + n
      + '</span><span class="den">' + d + '</span></span>');

  const bloc = s => '<span dir="ltr" class="expr">' + fraction(s) + '</span>';

  // Une part est soit purement mathématique, soit purement arabe : jamais les
  // deux. Le validateur le contrôle, ce qui garde le rendu simple et sûr.
  const ARABE = /[؀-ۿ]/;
  const rendreMath = s => (ARABE.test(String(s)) ? String(s) : bloc(s));

  function rendre(brut) {
    return {
      operation: brut.enonce.map(p => (ARABE.test(p) ? p : bloc(p))).join(' '),
      steps: brut.etapes.map(e => e[0] + ': ' + rendreMath(e[1])),
      hint: brut.indice
    };
  }

  // -------------------------------------------------------------------------
  // Registre
  // -------------------------------------------------------------------------
  const PROBLEMES = {};
  const enregistrer = (n, def) => { PROBLEMES[n] = def; };
  const PAR_PAGE = 3;

  function tirer(n, combien) {
    const out = [];
    for (let i = 0; i < (combien || PAR_PAGE); i++) out.push(PROBLEMES[n].f());
    return out;
  }

  function construire(n) {
    return {
      id: 'ex' + String(n).padStart(2, '0'),
      title: 'سلسلة ' + n + ' — ' + PROBLEMES[n].titre,
      questions: tirer(n).map(rendre)
    };
  }

  // Un rationnel au hasard, pour les tirages et pour l'échantillonnage du
  // validateur sur les exercices littéraux.
  const ratAleatoire = (maxN, maxD) =>
    rat(ent(-(maxN || 20), maxN || 20), ent(1, maxD || 12));

  const API = { ent, choix, pgcd, rat, add, sub, mul, div, neg, abs, signe,
                egaux, cmp, txt, analyser, verifierComparaison, fraction, bloc,
                rendreMath, rendre, ratAleatoire, ARABE,
                PROBLEMES, enregistrer, tirer, construire, PAR_PAGE };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Frac = API;
})(typeof window !== 'undefined' ? window : globalThis);
