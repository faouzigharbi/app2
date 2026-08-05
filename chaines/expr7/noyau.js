// Noyau de la leçon « العبارات الحرفية » (7 أساسي) — كتاب الحساب والجبر, p. 56-63.
//
// Contrainte propre au niveau : en 7ème on ne travaille QUE dans les nombres
// rationnels POSITIFS (« عدد كسري », sans « نسبي »). Aucun coefficient, aucun
// résultat intermédiaire, aucune solution ne doit être négatif — un « 12/5 a -
// 3/4 a » est permis parce qu'il redonne 33/20 a, mais l'inverse ne l'est pas.
// Les générateurs rejettent donc tout tirage qui produirait un négatif.
//
// L'analyseur doit lire les fractions, la juxtaposition (« 2a », « 3/8(x+1) »),
// les écritures décimales à la virgule (« 3,2 ») et les carrés (« x^2 »), sans
// quoi le validateur ne pourrait pas recalculer les étapes.
//
// Une page ne tire pas trois fois le même problème : elle déroule LES
// SOUS-QUESTIONS d'un même type sur un tirage commun, et le générateur choisit
// à chaque fois un MODÈLE différent à l'intérieur du type.
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
  const RUN = /[0-9A-Za-z+\-*×÷/:=^().,|]+(?:\s+[0-9A-Za-z+\-*×÷/:=^().,|]+)*/g;

  function isoMixte(texte) {
    return String(texte).replace(RUN, m => {
      const n = m.trim();
      if (!/[+\-*×÷/=^|]/.test(n)) return m;         // pas d'opérateur : simple lettre
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
      title: 'النوع ' + n + ' — ' + PROBLEMES[n].titre,
      questions: tirer(n).map(rendre)
    };
  }

  // -------------------------------------------------------------------------
  // ÉVALUER UNE ÉTAPE — le juge, partagé entre le validateur et les pages
  // « أين الخطأ؟ ». C'est la MÊME fonction des deux côtés : une page ne peut
  // pas afficher comme fausse une étape que le validateur tiendrait pour vraie.
  //
  // L'échantillon est DÉTERMINISTE — valeurs prises dans un cycle fixe, jamais
  // au hasard. Sans cela une faute serait fausse pour l'un et vraie pour
  // l'autre, et l'élève pourrait contester à bon droit.
  // -------------------------------------------------------------------------
  const ECHANTILLON = 16;
  const NUMS = [1, 2, 3, 5, 7, 4, 9, 11, 6, 13, 8, 15, 10, 12, 14, 3];
  const DENS = [1, 2, 1, 3, 1, 5, 2, 1, 7, 3, 1, 4, 1, 6, 2, 1];

  function envDeterministe(vars, composites, k) {
    const e = {};
    (vars || []).forEach((v, j) => {
      const i = (k * 5 + j * 7) % NUMS.length;
      e[v] = rat(NUMS[i], DENS[(i + j) % DENS.length]);
    });
    if (composites) {
      ['xy', 'ab'].forEach(nom => {
        e[nom] = nom.split('').reduce((r, l) => mul(r, e[l] || rat(1)), rat(1));
      });
    }
    return e;
  }

  function environnements(c) {
    if (c.env) {
      const e = Object.assign({}, c.env);
      if (c.composites) {
        ['xy', 'ab'].forEach(nom => {
          e[nom] = nom.split('').reduce((r, l) => mul(r, e[l] || rat(1)), rat(1));
        });
      }
      if (c.nom) e[c.nom] = analyser(c.gauche, e);
      return [e];
    }
    if (c.type === 'identite') {
      const out = [];
      for (let k = 0; k < ECHANTILLON; k++) {
        const e = envDeterministe(c.vars, c.composites, k);
        if (c.nom) e[c.nom] = analyser(c.gauche, e);
        out.push(e);
      }
      return out;
    }
    if (c.type === 'valeur') return [{ x: c.x0, T: c.val, P: c.val }];
    if (c.type === 'equation') return [{ x: c.x0 }];
    if (c.type === 'systeme') return [{ a: rat(c.a), b: rat(c.b) }];
    return [{}];
  }

  // 'vraie' | 'fausse' | 'ignoree'
  function evaluerEtape(math, envs) {
    if (typeof math !== 'string' || ARABE.test(math)) return 'ignoree';
    try {
      for (const env of envs) {
        const r = verifierRelation(String(math).replace(/×/g, '*'), env);
        if (r === null) { analyser(String(math).replace(/×/g, '*'), env); return 'ignoree'; }
        if (r) return 'fausse';
      }
      return 'vraie';
    } catch (e) { return 'fausse'; }
  }

  const API = { ent, choix, pgcd, rat, add, sub, mul, div, neg, abs, signe,
                egaux, cmp, txt, par, plus, dec, decimal, analyser,
                verifierRelation, fraction, bloc, isoMixte, rendreMath, rendre,
                ARABE, PROBLEMES, enregistrer, tirer, construire,
                ECHANTILLON, environnements, evaluerEtape };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Expr = API;
})(typeof window !== 'undefined' ? window : globalThis);
