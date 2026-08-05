// Noyau de la leçon « الجمع في ℝ » (9 أساسي) — l'ordre et l'addition.
//
// Ce chapitre-ci n'est plus celui de la 7ème : on est dans ℝ tout entier, les
// nombres négatifs sont chez eux, et surtout LES PROPRIÉTÉS DE L'ORDRE sont
// enfin au programme. On a donc le droit d'écrire « a < b donc a + c < b + c »
// — ce qui était interdit les années précédentes, où il fallait passer par le
// signe de la différence.
//
// Ce droit a un revers, et c'est tout l'objet du chapitre : il ne s'étend PAS
// à la soustraction membre à membre. De « a < b » et « c < d » on ne déduit
// rien sur « a - c » et « b - d ». Plusieurs exercices sont construits autour
// de ce piège précis.
//
// L'analyseur lit les fractions, les écritures décimales à la virgule, les
// valeurs absolues « |x| », et les relations d'ordre — sans quoi le validateur
// ne pourrait pas recontrôler un encadrement.
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
      .match(/\d+[,.]\d+|\d+|[a-zA-Z]+|[+\-×*/():|^]/g);
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
      let v = divisions();
      while (!fin() && (voir() === '+' || voir() === '-')) {
        const op = t[i++];
        v = op === '+' ? add(v, divisions()) : sub(v, divisions());
      }
      return v;
    }
    // « : » est le SIGNE DE LA DIVISION ; « / » est la BARRE DE FRACTION, et
    // une fraction est un seul nombre. Dans « 1/3 : 2/3 » — écrit tel quel sur
    // la fiche, et affiché en fractions empilées — le « : » sépare deux
    // nombres : il se lie donc moins fort que « / » et que « × ». Le lire au
    // même niveau donnerait ((1/3):2)/3, ce qui n'a aucun sens ici.
    function divisions() {
      let v = terme();
      while (!fin() && voir() === ':') { i++; v = div(v, terme()); }
      return v;
    }
    // La puissance se lie plus fort que le produit : dans « -2x^2 », c'est x
    // qui est au carré, pas -2x. Elle a donc son propre niveau.
    function puissance() {
      let v = facteur();
      while (!fin() && voir() === '^') {
        i++;
        const e = Number(t[i++]);
        let r = rat(1);
        for (let n = 0; n < e; n++) r = mul(r, v);
        v = r;
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
          v = mul(v, puissance());   // juxtaposition : « 2a » vaut 2 × a
        } else break;
      }
      return v;
    }
    function facteur() {
      // Le moins unaire se lie MOINS fort que la puissance : « -x^2 » vaut
      // -(x^2), jamais (-x)^2. Le lire à l'envers change le signe du terme
      // dominant — et c'est exactement l'erreur qu'un élève commet.
      if (voir() === '-') { i++; return neg(puissance()); }
      if (voir() === '+') { i++; return puissance(); }
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

  const puissances = s => String(s).replace(/\^(\d+)/g, '<sup>$1</sup>');
  const bloc = s => '<span dir="ltr" class="expr">'
    + puissances(fraction(echapper(s))) + '</span>';

  // Aucune expression ne doit rester nue dans un paragraphe RTL : « x = -1/10 »
  // sans isolation s'affiche à l'envers. Quand une ligne mêle de l'arabe et des
  // mathématiques — « x = 1/10 أو x = -1/10 » — on isole chaque morceau
  // mathématique séparément, en laissant le texte arabe couler de droite à
  // gauche. Une lettre isolée (« … يحقّق المعادلة x ») n'est pas une expression
  // et reste telle quelle.
  const ARABE = /[؀-ۿ]/;
  // Les signes d'ordre « < > ≤ ≥ », le point-virgule arabe des listes et des
  // couples, les crochets d'intervalle et le « ∈ » font partie du fragment
  // isolé. Les laisser dehors mettrait « 2 < x < 5 » au régime RTL, et
  // l'encadrement s'afficherait à l'envers — donc faux.
  const CAR = '0-9A-Za-z+\\-*×÷/:=^().,|<>≤≥≠؛\\[\\]∈{}∞√π';
  const RUN = new RegExp('[' + CAR + ']+(?:\\s+[' + CAR + ']+)*', 'g');
  const ISOLER = /[+\-*×÷/=^|<>≤≥≠؛∈]|\(\s*[0-9]/;

  function isoMixte(texte) {
    return String(texte).replace(RUN, m => {
      const n = m.trim();
      if (!ISOLER.test(n)) return m;                 // pas d'opérateur : simple lettre
      const i = m.indexOf(n);
      return m.slice(0, i) + bloc(n) + m.slice(i + n.length);
    });
  }

  // Un morceau d'énoncé peut être une FIGURE déjà en SVG : elle passe telle
  // quelle. La faire traverser l'isolation bidi la détruirait — le balisage
  // serait pris pour des mathématiques et échappé.
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
  else racine.Reel = API;
})(typeof window !== 'undefined' ? window : globalThis);
