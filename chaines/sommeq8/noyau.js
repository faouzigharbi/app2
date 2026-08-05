// Noyau de la fiche « الجمع و الطرح في ℚ — تمارين شاملة » (8 أساسي).
//
// Différence avec le noyau de la leçon « مقارنة » : ici les énoncés mêlent
// fractions, ÉCRITURES DÉCIMALES (1,5 — comme sur la fiche) et VALEURS
// ABSOLUES. L'analyseur doit donc savoir lire « 1,2 » et « |x| », sans quoi
// le validateur ne pourrait pas recalculer les étapes.
//
// Autre différence : une page ne tire pas trois fois le même problème, elle
// déroule LES SOUS-QUESTIONS d'un même exercice sur un tirage commun — c'est
// l'exercice de la fiche, pas trois exercices jumeaux.
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
  const cmp = (x, y) => {
    const v = x.n * y.d - y.n * x.d;
    return v < 0 ? -1 : v > 0 ? 1 : 0;
  };
  const txt = x => (x.d === 1 ? String(x.n) : x.n + '/' + x.d);

  // Un nombre entre parenthèses seulement s'il est négatif : « + (-3/2) »,
  // mais « + 3/2 ». Et le raccord d'un terme dans une somme : « - 3/2 ».
  const par = x => (x.n < 0 ? '(' + txt(x) + ')' : txt(x));
  const plus = x => (x.n < 0 ? ' - ' + txt(neg(x)) : ' + ' + txt(x));

  // Écriture décimale à la tunisienne : la virgule, pas le point.
  const dec = dixiemes => {
    const s = dixiemes < 0 ? '-' : '';
    const v = Math.abs(dixiemes);
    return s + Math.floor(v / 10) + (v % 10 ? ',' + (v % 10) : '');
  };
  const decimal = dixiemes => ({ v: rat(dixiemes, 10), t: dec(dixiemes) });

  // -------------------------------------------------------------------------
  // Analyseur : + − × / ( ) [ ] | | , variables, décimaux, juxtaposition.
  // -------------------------------------------------------------------------
  function jetons(s) {
    const t = String(s).replace(/[[\]]/g, m => (m === '[' ? '(' : ')'))
      .match(/\d+[,.]\d+|\d+|[a-zA-Z]+|[+\-×*/():|]/g);
    if (!t) throw new Error('expression vide: ' + s);
    return t;
  }

  const DECIMAL = /^(\d+)[,.](\d+)$/;

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
        } else if (/^\d/.test(j) || /^[a-zA-Z]+$/.test(j) || j === '(') {
          v = mul(v, facteur());     // juxtaposition : « 2a » vaut 2 × a
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
      if (voir() === '|') {                       // valeur absolue, non imbriquée
        i++;
        const v = expression();
        if (voir() !== '|') throw new Error('barre non fermée: ' + src);
        i++;
        return abs(v);
      }
      const j = t[i++];
      const d = DECIMAL.exec(j);
      if (d) return rat(Number(d[1] + d[2]), Math.pow(10, d[2].length));
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

  // Une chaîne « a = b = c » ou « a < b » : chaque maillon doit être vrai.
  const OPS = { '<': [-1], '>': [1], '≤': [-1, 0], '≥': [1, 0], '=': [0] };

  function verifierRelation(texte, env) {
    const morceaux = String(texte).split(/\s*([<>≤≥=])\s*/);
    if (morceaux.length < 3) return null;              // pas une relation
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
  // Rendu — fraction en barre horizontale, expression isolée en dir="ltr"
  // -------------------------------------------------------------------------
  const FRACTION = /(\d+)\s*\/\s*(\d+)/g;

  const fraction = s => String(s).replace(FRACTION,
    (_, n, d) => '<span class="frac"><span class="num">' + n
      + '</span><span class="den">' + d + '</span></span>');

  // « -3/4 < 0 » inséré tel quel dans la page : le « < » ouvre une balise aux
  // yeux de l'analyseur HTML. On échappe AVANT de poser le balisage des
  // fractions, jamais après.
  const echapper = s => String(s).replace(/&/g, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const bloc = s => '<span dir="ltr" class="expr">' + fraction(echapper(s)) + '</span>';

  // Aucune expression ne doit rester nue dans un paragraphe RTL : « x = -1/10 »
  // sans isolation s'affiche à l'envers. Quand une ligne mêle de l'arabe et des
  // mathématiques — « x = 1/10 أو x = -1/10 » — on isole chaque morceau
  // mathématique séparément, en laissant le texte arabe couler de droite à
  // gauche. Une lettre isolée (« … يحقّق المعادلة x ») n'est pas une expression
  // et reste telle quelle.
  const ARABE = /[؀-ۿ]/;
  const RUN = /[0-9A-Za-z+\-*×÷/:=^().,|]+(?:\s+[0-9A-Za-z+\-*×÷/:=^().,|]+)*/g;

  function isoMixte(texte) {
    return String(texte).replace(RUN, m => {
      const n = m.trim();
      if (!/[+\-*×÷/=^|]/.test(n)) return m;         // pas d'opérateur : simple lettre
      const i = m.indexOf(n);
      return m.slice(0, i) + bloc(n) + m.slice(i + n.length);
    });
  }

  const rendreMath = s => (ARABE.test(String(s)) ? isoMixte(s) : bloc(s));

  function rendre(brut) {
    return {
      operation: brut.enonce.map(rendreMath).join(' '),
      steps: brut.etapes.map(e => e[0] + ': ' + rendreMath(e[1])),
      hint: brut.indice,
      // LA PROVENANCE VOYAGE AVEC L'EXERCICE — voir ci-dessus.
      source: brut.source || ''
    };
  }

  // -------------------------------------------------------------------------
  // Registre : un « problème » = un exercice entier de la fiche, dont la
  // fonction f() rend le TABLEAU de ses sous-questions sur un tirage commun.
  // -------------------------------------------------------------------------
  const PROBLEMES = {};
  const enregistrer = (n, def) => { PROBLEMES[n] = def; };

  const tirer = n => PROBLEMES[n].f();

  function construire(n) {
    return {
      id: 'ex' + n,
      title: 'التمرين ' + n + ' — ' + PROBLEMES[n].titre,
      questions: tirer(n).map(rendre)
    };
  }

  const API = { ent, choix, pgcd, rat, add, sub, mul, div, neg, abs, signe,
                egaux, cmp, txt, par, plus, dec, decimal, analyser,
                verifierRelation, fraction, bloc, isoMixte, rendreMath, rendre,
                ARABE, PROBLEMES, enregistrer, tirer, construire };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Somme = API;
})(typeof window !== 'undefined' ? window : globalThis);
