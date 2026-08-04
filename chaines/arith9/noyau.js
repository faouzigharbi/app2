// Noyau de la leçon « الحساب — القسمة و القابلية للقسمة » (9 أساسي),
// d'après la fiche tasi3a.tn « رياضيات تاسعة أساسي » (9 exercices).
//
// Ce que ce chapitre a de particulier : les nombres n'y sont plus petits.
// « 2^2011 - 2^2008 » compte 606 chiffres, « 3^2006 » en compte 958. On ne peut
// donc plus calculer en flottants — le moindre arrondi ferait passer une
// divisibilité fausse pour vraie. Toute l'arithmétique est donc en BigInt,
// exacte, et les rationnels ont un numérateur et un dénominateur BigInt.
//
// Le validateur en profite : il n'a pas besoin de raisonner sur les
// congruences, il CALCULE le nombre en entier et regarde le reste. Une
// factorisation de puissances mal signée ne survit pas à cela.
(function (racine) {
  'use strict';

  const ent = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
  const choix = t => t[Math.floor(Math.random() * t.length)];
  const melanger = t => {
    const a = t.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // -------------------------------------------------------------------------
  // Rationnels exacts en BigInt. Ici le dénominateur vaut presque toujours 1 —
  // mais il faut le prévoir : l'exercice 9 travaille sur (6n+44)/(n+2), et
  // c'est justement le cas où il ne vaut PAS 1 qui est intéressant.
  // -------------------------------------------------------------------------
  const B = x => (typeof x === 'bigint' ? x : BigInt(x));
  const absB = x => (x < 0n ? -x : x);
  const pgcdB = (a, b) => { a = absB(a); b = absB(b); while (b) { [a, b] = [b, a % b]; } return a; };

  function rat(n, d) {
    n = B(n); d = (d === undefined) ? 1n : B(d);
    if (d === 0n) throw new Error('dénominateur nul');
    if (d < 0n) { n = -n; d = -d; }
    const g = pgcdB(n, d) || 1n;
    return { n: n / g, d: d / g };
  }

  const add = (x, y) => rat(x.n * y.d + y.n * x.d, x.d * y.d);
  const sub = (x, y) => rat(x.n * y.d - y.n * x.d, x.d * y.d);
  const mul = (x, y) => rat(x.n * y.n, x.d * y.d);
  const div = (x, y) => rat(x.n * y.d, x.d * y.n);
  const neg = x => rat(-x.n, x.d);
  const abs = x => rat(absB(x.n), x.d);
  const signe = x => (x.n < 0n ? -1 : x.n > 0n ? 1 : 0);
  const egaux = (x, y) => x.n === y.n && x.d === y.d;
  const cmp = (x, y) => {
    const v = x.n * y.d - y.n * x.d;
    return v < 0n ? -1 : v > 0n ? 1 : 0;
  };
  const estEntier = x => x.d === 1n;
  // « d divise x » : x doit d'abord ÊTRE un entier. Sans cette garde, 7/2
  // passerait pour un multiple de 7.
  const divise = (d, x) => estEntier(x) && (x.n % B(d) === 0n);
  const reste = (x, d) => {
    // reste de la division euclidienne : toujours dans [0 ; |d|[, même pour un
    // dividende négatif. C'est la définition du programme, et c'est là que
    // « 8y + 7 donne 7 comme reste » se casse.
    const m = B(d), r = x.n % m;
    return r < 0n ? r + absB(m) : r;
  };
  const quotient = (x, d) => (x.n - reste(x, d)) / B(d);

  const txt = x => (x.d === 1n ? String(x.n) : x.n + '/' + x.d);
  const par = x => (signe(x) < 0 ? '(' + txt(x) + ')' : txt(x));

  // Exponentiation rapide : « 3^2006 » compte 958 chiffres, et le calculer par
  // 2006 multiplications successives coûterait deux mille produits sur des
  // nombres qui grossissent. On monte par carrés — onze produits suffisent.
  const puissanceB = (a, e) => {
    let r = 1n, b = B(a), k = e;
    while (k > 0) { if (k & 1) r *= b; b *= b; k >>= 1; }
    return r;
  };
  // La même chose sur un rationnel. Aucune réduction n'est nécessaire : si n et
  // d sont premiers entre eux, leurs puissances le restent.
  const puis = (x, e) => ({ n: puissanceB(x.n, e), d: puissanceB(x.d, e) });

  // -------------------------------------------------------------------------
  // Analyseur : + − × / : ^ ( ) variables, juxtaposition.
  // L'exposant est un petit entier ; on le plafonne, car « 9^100000 » ne serait
  // pas une erreur de calcul mais un blocage de la page.
  // -------------------------------------------------------------------------
  const EXPOSANT_MAX = 4000;

  function jetons(s) {
    const t = String(s).replace(/[[\]]/g, m => (m === '[' ? '(' : ')'))
      .match(/\d+|[a-zA-Z]+|[+\-×*/():^]/g);
    if (!t) throw new Error('expression vide: ' + s);
    return t;
  }

  function analyser(src, env) {
    const t = jetons(src);
    let i = 0;
    const fin = () => i >= t.length;
    const voir = () => t[i];

    function expression() {
      let v = divisions();
      while (!fin() && (voir() === '+' || voir() === '-')) {
        const op = t[i++];
        v = op === '+' ? add(v, divisions()) : sub(v, divisions());
      }
      return v;
    }
    // « : » est le signe de la division ; « / » est la barre de fraction, et une
    // fraction est un seul nombre. « 1/3 : 2/3 » vaut donc 1/2.
    function divisions() {
      let v = terme();
      while (!fin() && voir() === ':') { i++; v = div(v, terme()); }
      return v;
    }
    function puissance() {
      let v = facteur();
      while (!fin() && voir() === '^') {
        i++;
        const e = Number(t[i++]);
        if (!Number.isInteger(e) || e < 0 || e > EXPOSANT_MAX) {
          throw new Error('exposant hors limites: ' + e);
        }
        v = puis(v, e);
      }
      return v;
    }
    function terme() {
      let v = puissance();
      for (;;) {
        if (fin()) break;
        const j = voir();
        if (j === '×' || j === '*' || j === '/') {
          const op = t[i++];
          v = (op === '/') ? div(v, puissance()) : mul(v, puissance());
        } else if (/^\d/.test(j) || /^[a-zA-Z]+$/.test(j) || j === '(') {
          v = mul(v, puissance());          // juxtaposition : « 2n » vaut 2 × n
        } else break;
      }
      return v;
    }
    function facteur() {
      // Le moins unaire se lie moins fort que la puissance : « -2^4 » vaut -16,
      // jamais 16.
      if (voir() === '-') { i++; return neg(puissance()); }
      if (voir() === '+') { i++; return puissance(); }
      if (voir() === '(') {
        i++;
        const v = expression();
        if (voir() !== ')') throw new Error('parenthèse non fermée: ' + src);
        i++;
        return v;
      }
      const j = t[i++];
      if (/^\d+$/.test(j)) return rat(j);
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
  const OPS = { '<': [-1], '>': [1], '≤': [-1, 0], '≥': [1, 0], '=': [0], '≠': [-1, 1] };

  function verifierRelation(texte, env) {
    const morceaux = String(texte).split(/\s*([<>≤≥=≠])\s*/);
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
  // Rendu — puissances en exposant, fractions en barre, isolation bidi
  // -------------------------------------------------------------------------
  const FRACTION = /(\d+|[a-zA-Z]\s*[+\-]\s*\d+)\s*\/\s*(\d+|[a-zA-Z]\s*[+\-]\s*\d+)/g;

  const fraction = s => String(s).replace(FRACTION,
    (_, n, d) => '<span class="frac"><span class="num">' + n
      + '</span><span class="den">' + d + '</span></span>');

  // « x < 4 » inséré tel quel : le « < » ouvre une balise aux yeux de
  // l'analyseur HTML. On échappe AVANT de poser le balisage, jamais après.
  const echapper = s => String(s).replace(/&/g, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const puissances = s => String(s).replace(/\^\(?(-?\d+)\)?/g, '<sup>$1</sup>');
  const bloc = s => '<span dir="ltr" class="expr">'
    + puissances(fraction(echapper(s))) + '</span>';

  // Une ligne qui mêle l'arabe et les mathématiques — « العدد 2^15 يقبل القسمة
  // على 7 » — doit isoler CHAQUE morceau mathématique séparément, en laissant
  // le texte arabe couler de droite à gauche.
  const ARABE = /[؀-ۿ]/;
  // Le point-virgule arabe « ؛ » fait partie du RUN : il sépare les éléments
  // d'une liste ou d'un couple — « 0 ؛ 5 », « (3 ؛ 2) » — et ces listes sont
  // des objets mathématiques, qui se lisent de gauche à droite. Le laisser
  // dehors mettait la liste au régime RTL, et « (3 ؛ 2) » s'affichait
  // « (2 ؛ 3) » : le couple était retourné, donc faux.
  const RUN = /[0-9A-Za-z+\-*×÷/:=^().,؛]+(?:\s+[0-9A-Za-z+\-*×÷/:=^().,؛]+)*/g;
  // Ce qui déclenche l'isolation : un opérateur, un point-virgule de liste, ou
  // une parenthèse qui enferme des chiffres. Une lettre seule n'est pas une
  // expression et reste dans le flot arabe.
  const ISOLER = /[+\-*×÷/=^؛]|\(\s*[0-9]/;

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
      hint: brut.indice
    };
  }

  // -------------------------------------------------------------------------
  // Registre : un « problème » = un exercice entier de la fiche, dont la
  // fonction f() rend le TABLEAU de ses sous-questions.
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

  const API = { ent, choix, melanger, B, absB, pgcdB, rat, add, sub, mul, div, neg,
                abs, signe, egaux, cmp, estEntier, divise, reste, quotient,
                txt, par, puissanceB, puis, analyser, verifierRelation, EXPOSANT_MAX,
                fraction, echapper, bloc, isoMixte, rendreMath, rendre, ARABE,
                PROBLEMES, enregistrer, tirer, construire };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Arith = API;
})(typeof window !== 'undefined' ? window : globalThis);
