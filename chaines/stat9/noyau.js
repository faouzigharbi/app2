// Noyau de la fiche « العمليات في مجموعة الأعداد الحقيقية » — تمارين شاملة 17 → 19.
//
// Ces exercices ne vivent plus dans les rationnels : ils vivent dans ℝ, et tout
// leur intérêt tient à des égalités du genre « √32 - √8 = 2√2 » ou
// « (3 + 2√2)(3 - 2√2) = 1 ». Un noyau qui ne saurait manipuler que des
// fractions ne pourrait RIEN vérifier ici — il ne verrait que des décimaux
// approchés, et un exercice faux passerait.
//
// On travaille donc en arithmétique EXACTE sur les nombres de la forme
//
//        c₀ + c₁√d₁ + c₂√d₂ + …        (cᵢ rationnels, dᵢ entiers sans facteur carré)
//
// représentés par la table { d : coefficient rationnel }, avec d = 1 pour la
// partie rationnelle. C'est exactement ce qu'il faut : √5 × √2 = √10 y est une
// multiplication, pas une approximation, et « A × B = 1 » se démontre au lieu
// de se constater à 10⁻⁹ près.
//
// La division par une somme de deux termes se fait par le CONJUGUÉ — le geste
// même de la leçon (« إنطاق المقام »). Au-delà de deux termes on refuse : la
// fiche n'en demande pas, et une division rationalisée à l'aveugle serait une
// occasion de se tromper sans le voir.
(function (racine) {
  'use strict';

  const ent = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
  const choix = t => t[Math.floor(Math.random() * t.length)];
  const pgcd = (a, b) => (b ? pgcd(b, a % b) : Math.abs(a));

  // -------------------------------------------------------------------------
  // Rationnels exacts, toujours réduits, dénominateur positif
  // -------------------------------------------------------------------------
  function rat(n, d) {
    d = (d === undefined) ? 1 : d;
    if (d === 0) throw new Error('dénominateur nul');
    if (d < 0) { n = -n; d = -d; }
    const g = pgcd(Math.abs(n), d) || 1;
    return { n: n / g, d: d / g };
  }
  const rAdd = (x, y) => rat(x.n * y.d + y.n * x.d, x.d * y.d);
  const rMul = (x, y) => rat(x.n * y.n, x.d * y.d);
  const rNeg = x => rat(-x.n, x.d);
  const rTxt = x => (x.d === 1 ? String(x.n) : x.n + '/' + x.d);

  // -------------------------------------------------------------------------
  // Écriture d'un entier sous la forme k²·s, s sans facteur carré.
  // C'est LE geste de la leçon : √32 = √(4²×2) = 4√2. Sans lui, « √32 - √8 »
  // resterait deux symboles étrangers l'un à l'autre.
  // -------------------------------------------------------------------------
  function carre(m) {
    if (m < 0) throw new Error('radicande négatif: ' + m);
    let k = 1;
    for (let p = 2; p * p <= m; p++) {
      while (m % (p * p) === 0) { m /= p * p; k *= p; }
    }
    return { k, s: m };
  }

  // -------------------------------------------------------------------------
  // Réels de la forme Σ cᵢ√dᵢ — la table { d : rationnel }, sans coefficient nul.
  // -------------------------------------------------------------------------
  function net(o) {
    for (const d in o) if (o[d].n === 0) delete o[d];
    return o;
  }
  // S(c, d) = c√d, ramené à sa forme réduite (S(3, 8) vaut 6√2, pas 3√8).
  function S(c, d) {
    d = (d === undefined) ? 1 : d;
    if (c.n === 0) return {};
    const { k, s } = carre(d);
    const o = {};
    o[s] = rMul(c, rat(k));
    return o;
  }
  const num = n => S(rat(n));
  const ZERO = {}, UN = num(1);

  function sAdd(x, y) {
    const o = {};
    for (const d in x) o[d] = x[d];
    for (const d in y) o[d] = o[d] ? rAdd(o[d], y[d]) : y[d];
    return net(o);
  }
  function sNeg(x) {
    const o = {};
    for (const d in x) o[d] = rNeg(x[d]);
    return o;
  }
  const sSub = (x, y) => sAdd(x, sNeg(y));

  // √d₁ × √d₂ = √(d₁d₂), puis on ressort le carré parfait : √2 × √10 = √20 = 2√5.
  function sMul(x, y) {
    const o = {};
    for (const d1 in x) for (const d2 in y) {
      const { k, s } = carre(Number(d1) * Number(d2));
      const c = rMul(rMul(x[d1], y[d2]), rat(k));
      o[s] = o[s] ? rAdd(o[s], c) : c;
    }
    return net(o);
  }
  const sEch = (x, r) => sMul(x, S(r));            // multiplication par un rationnel

  const estRat = x => Object.keys(x).every(d => d === '1');
  const versRat = x => (Object.keys(x).length ? x['1'] : rat(0));

  // La division : par un rationnel c'est une mise à l'échelle ; par un seul
  // radical c'est √d/(c·d) ; par une somme de deux termes c'est le CONJUGUÉ.
  function sDiv(x, y) {
    const ks = Object.keys(y);
    if (!ks.length) throw new Error('division par zéro');
    if (ks.length === 1) {
      const d = Number(ks[0]), c = y[ks[0]];
      if (d === 1) return sEch(x, rat(c.d, c.n));
      return sEch(sMul(x, S(rat(1), d)), rat(c.d, c.n * d));
    }
    if (ks.length === 2) {
      const conj = {};
      conj[ks[0]] = y[ks[0]];
      conj[ks[1]] = rNeg(y[ks[1]]);
      const den = sMul(y, conj);
      if (!estRat(den)) throw new Error('conjugué inopérant');
      return sDiv(sMul(x, conj), den);
    }
    throw new Error('division par une somme de plus de deux radicaux');
  }

  const rSub = (x, y) => rAdd(x, rNeg(y));
  const rDiv = (x, y) => rat(x.n * y.d, x.d * y.n);
  // La racine carrée d'un rationnel, quand elle est rationnelle — sinon null.
  function rSqrt(q) {
    if (q.n < 0) return null;
    const a = Math.round(Math.sqrt(q.n)), b = Math.round(Math.sqrt(q.d));
    return (a * a === q.n && b * b === q.d) ? rat(a, b) : null;
  }

  // √ d'un nombre. Sur un rationnel positif : √(n/d) = √(n·d)/d, et l'on ne
  // laisse jamais un radical au dénominateur.
  //
  // Mais un radicande PEUT être irrationnel et rester un carré parfait, à
  // condition de l'être dans ℚ[√d] : √((7 + 3√5)/2) vaut (3 + √5)/2. Les fiches
  // en usent — « √((3 + √5)/(3 - √5)) » n'a pas d'autre sens — donc on le
  // cherche au lieu de refuser. On pose (r + s√d)² = p + q√d, ce qui donne
  // r² = (p ± √(p² - q²d))/2 et s = q/2r ; il suffit que les deux racines
  // intermédiaires soient rationnelles, et l'égalité est ensuite RE-VÉRIFIÉE
  // exactement avant d'être rendue.
  function sSqrt(x) {
    const ks = Object.keys(x);
    if (!ks.length) return ZERO;                             // √0 = 0
    if (estRat(x)) {
      const q = versRat(x);
      if (q.n < 0) throw new Error('racine d’un nombre négatif');
      const { k, s } = carre(q.n * q.d);
      return S(rat(k, q.d), s);
    }
    if (ks.length === 2 && x['1']) {
      // p + q√d est un carré dès que (√t₁ + σ√t₂)² le redonne, avec
      // t₁ et t₂ les racines de t² - p·t + q²d/4 — donc (p ± √(p² - q²d))/2 —
      // et σ le signe de q. Les deux t doivent être RATIONNELS ; leurs racines,
      // elles, ne le sont pas forcément : √(8 - 2√15) vaut √5 - √3, qui ne
      // s'écrit pas r + s√15. C'est pourquoi on les repasse à sSqrt au lieu
      // d'exiger qu'elles tombent juste.
      const d = Number(ks.find(k => k !== '1'));
      const p = x['1'], q = x[d];
      const rD = rSqrt(rSub(rMul(p, p), rMul(rMul(q, q), rat(d))));
      if (rD && p.n > 0) {
        const t1 = rMul(rAdd(p, rD), rat(1, 2));
        const t2 = rMul(rSub(p, rD), rat(1, 2));
        if (t1.n >= 0 && t2.n >= 0) {
          const s1 = sSqrt(S(t1)), s2 = sSqrt(S(t2));
          const cand = q.n >= 0 ? sAdd(s1, s2) : sSub(s1, s2);
          if (sEgaux(sMul(cand, cand), x)) return cand;
        }
      }
    }
    throw new Error('racine d’une expression irrationnelle');
  }

  function sPuis(x, e) {
    let r = UN;
    for (let i = 0; i < e; i++) r = sMul(r, x);
    return r;
  }

  const sVal = x => Object.keys(x).reduce(
    (v, d) => v + x[d].n / x[d].d * Math.sqrt(Number(d)), 0);

  // Le signe : exact quand le nombre est rationnel, sinon lu sur la valeur
  // approchée. Les nombres de la fiche sont des entiers algébriques de très
  // petite taille — aucun n'approche 0 à moins de 10⁻³.
  function sSigne(x) {
    if (!Object.keys(x).length) return 0;
    if (estRat(x)) { const q = versRat(x); return q.n < 0 ? -1 : q.n > 0 ? 1 : 0; }
    const v = sVal(x);
    if (Math.abs(v) < 1e-9) throw new Error('signe indécidable');
    return v < 0 ? -1 : 1;
  }
  const sAbs = x => (sSigne(x) < 0 ? sNeg(x) : x);

  function sEgaux(x, y) {
    const a = Object.keys(x), b = Object.keys(y);
    if (a.length !== b.length) return false;
    return a.every(d => y[d] && x[d].n === y[d].n && x[d].d === y[d].d);
  }
  const sCmp = (x, y) => sSigne(sSub(x, y));

  // Écriture : « 3 + 2√2 », « √2 - 1 », « 4√2 », « 0 ».
  // Les termes POSITIFS passent devant : on écrit « √2 - 1 », pas « -1 + √2 ».
  // Ce n'est pas de la cosmétique — c'est la forme sous laquelle l'élève lit la
  // réponse dans son livre, et une chaîne de démonstration qui conclurait
  // autrement qu'il ne l'attend le ferait douter d'un résultat juste.
  function sTxt(x) {
    const tri = Object.keys(x).map(Number).sort((a, b) => a - b);
    if (!tri.length) return '0';
    const pos = tri.filter(d => x[d].n > 0), neg = tri.filter(d => x[d].n < 0);
    const ks = pos.length ? pos.concat(neg) : neg;
    return ks.map((d, i) => {
      const c = x[d], neg = c.n < 0, a = rat(Math.abs(c.n), c.d);
      const t = (d === 1) ? rTxt(a)
        : (a.n === 1 && a.d === 1 ? '' : rTxt(a)) + '√' + d;
      return (i === 0 ? (neg ? '-' : '') : (neg ? ' - ' : ' + ')) + t;
    }).join('');
  }
  // Un terme à raccorder dans une somme déjà commencée : « + 3 » ou « - 3 ».
  const plus = x => (sSigne(x) < 0 ? ' - ' + sTxt(sNeg(x)) : ' + ' + sTxt(x));
  // Un nombre glissé entre parenthèses seulement s'il en a besoin.
  const par = x => (Object.keys(x).length > 1 || sSigne(x) < 0 ? '(' + sTxt(x) + ')' : sTxt(x));

  // -------------------------------------------------------------------------
  // Analyseur : + − × / ( ) [ ] | | √ ^ , variables, juxtaposition.
  //
  // π est un NOM comme un autre pour l'analyseur — il n'appartient pas à
  // ℚ[√d] et n'y appartiendra jamais. Les énoncés qui l'emploient (« |x - π| = 3 »)
  // ne demandent d'ailleurs rien de sa valeur : ils demandent seulement que ce
  // soit un réel. On le lie donc comme une lettre libre, et une étape qui
  // dépendrait de sa valeur serait aussitôt rejetée par le validateur.
  // -------------------------------------------------------------------------
  const NOM = /^([a-zA-Z]+|π)$/;

  function jetons(s) {
    const t = String(s).replace(/[[\]]/g, m => (m === '[' ? '(' : ')'))
      // Un DÉCIMAL est un seul jeton. Sans cela « 33.4 » se lit « 33 » puis
      // « 4 », que la juxtaposition multiplie : 132. Et « 0.5 » vaut 0. Une
      // erreur muette, du genre exact que cette machine existe pour empêcher.
      .match(/\d+(?:[.,]\d+)?|[a-zA-Z]+|π|[+\-×*/():|^√]/g);
    if (!t) throw new Error('expression vide: ' + s);
    return t;
  }

  function analyser(src, env) {
    const t = jetons(src);
    let i = 0;
    // Profondeur des barres ouvertes. « 2|√3 - 5| » est un PRODUIT — la barre y
    // ouvre une valeur absolue — tandis que dans « |t y| » la barre qui suit y
    // la FERME. Les deux se distinguent par ce compteur, et par lui seul :
    // hors de toute barre « | » ouvre, à l'intérieur il ferme.
    let barres = 0;
    const fin = () => i >= t.length;
    const voir = () => t[i];

    function expression() {
      let v = divisions();
      while (!fin() && (voir() === '+' || voir() === '-')) {
        const op = t[i++];
        v = op === '+' ? sAdd(v, divisions()) : sSub(v, divisions());
      }
      return v;
    }
    // « : » est le SIGNE DE LA DIVISION, « / » est la BARRE DE FRACTION. Une
    // fraction est un seul nombre, donc « / » se lie plus fort que « : ».
    function divisions() {
      let v = terme();
      while (!fin() && voir() === ':') { i++; v = sDiv(v, terme()); }
      return v;
    }
    // La puissance se lie plus fort que le produit : dans « -2x^2 » c'est x qui
    // est au carré. Elle a donc son propre niveau.
    function puissance() {
      let v = facteur();
      while (!fin() && voir() === '^') { i++; v = sPuis(v, Number(t[i++])); }
      return v;
    }
    function terme() {
      let v = puissance();
      for (;;) {
        if (fin()) break;
        const j = voir();
        if (j === '×' || j === '*' || j === '/') {
          const op = t[i++];
          v = (op === '/') ? sDiv(v, puissance()) : sMul(v, puissance());
        } else if (/^\d/.test(j) || NOM.test(j) || j === '(' || j === '√'
                   || (j === '|' && barres === 0)) {
          v = sMul(v, puissance());        // juxtaposition : « 2√2 » vaut 2 × √2
        } else break;
      }
      return v;
    }
    function facteur() {
      // Le moins unaire se lie MOINS fort que la puissance : « -x^2 » vaut
      // -(x^2), jamais (-x)^2.
      if (voir() === '-') { i++; return sNeg(puissance()); }
      if (voir() === '+') { i++; return puissance(); }
      // Le radical ne porte QUE sur ce qui le suit immédiatement : dans
      // « √2(2√2 + 1) », la parenthèse est un facteur, pas le radicande.
      // Lire l'inverse changerait complètement l'exercice.
      if (voir() === '√') { i++; return sSqrt(facteur()); }
      if (voir() === '(') {
        i++;
        const v = expression();
        if (voir() !== ')') throw new Error('parenthèse non fermée: ' + src);
        i++;
        return v;
      }
      if (voir() === '|') {                              // valeur absolue, imbrication comprise
        i++; barres++;
        const v = expression();
        if (voir() !== '|') throw new Error('barre non fermée: ' + src);
        i++; barres--;
        return sAbs(v);
      }
      const j = t[i++];
      if (/^\d+$/.test(j)) return num(Number(j));
      // Le décimal devient une FRACTION exacte, jamais un flottant : « 0.25 »
      // est 25/100 réduit, pas 0.25 arrondi.
      if (/^\d+[.,]\d+$/.test(j)) {
        const [e, f] = j.replace(',', '.').split('.');
        return S(rat(Number(e + f), Math.pow(10, f.length)));
      }
      if (NOM.test(j)) {
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
    if (morceaux.length < 3) return null;                // pas une relation
    for (let k = 1; k < morceaux.length; k += 2) {
      const op = morceaux[k];
      const g = analyser(morceaux[k - 1], env), d = analyser(morceaux[k + 1], env);
      if (OPS[op].indexOf(sCmp(g, d)) < 0) {
        return `« ${morceaux[k - 1].trim()} ${op} ${morceaux[k + 1].trim()} » فاسدة`;
      }
    }
    return '';
  }

  // -------------------------------------------------------------------------
  // Rendu — radical avec sa barre, fraction empilée, expression isolée en LTR
  // -------------------------------------------------------------------------
  const echapper = s => String(s).replace(/&/g, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Le radicande d'un « √ » : un nombre, ou tout ce que ferme la parenthèse
  // ouvrante qui suit. Un balayage, pas une expression régulière — les
  // parenthèses s'imbriquent, et une regex ne sait pas les compter.
  function radicaux(s) {
    let out = '', i = 0;
    while (i < s.length) {
      if (s[i] !== '√') { out += s[i++]; continue; }
      i++;
      let dedans;
      if (s[i] === '(') {
        let p = 0, j = i;
        for (; j < s.length; j++) {
          if (s[j] === '(') p++;
          else if (s[j] === ')' && --p === 0) break;
        }
        dedans = s.slice(i + 1, j);
        i = j + 1;
      } else {
        let j = i;
        while (j < s.length && /[\d]/.test(s[j])) j++;
        if (j === i) j = i + 1;                     // « √a » : une lettre
        dedans = s.slice(i, j);
        i = j;
      }
      out += '<span class="rad"><span class="rcd">' + radicaux(dedans) + '</span></span>';
    }
    return out;
  }

  // La barre de fraction. Une expression régulière ne suffit pas : le
  // dénominateur peut être une parenthèse — « 1/(3 + 2√2) » — et compter des
  // parenthèses n'est pas dans ses moyens. On balaye donc, et de part et
  // d'autre du « / » on prend soit un groupe parenthésé équilibré, soit la
  // suite de caractères qui touche la barre.
  //
  // Ce passage a lieu AVANT celui des radicaux, sur le texte encore nu : après,
  // le balisage inséré (« </span> ») offrirait de fausses prises au balayage.
  function operande(s, i, sens) {
    if (sens < 0) {                                    // à gauche de la barre
      let j = i;
      while (j > 0 && s[j - 1] === ' ') j--;
      if (s[j - 1] === ')') {
        let p = 0, k = j - 1;
        for (; k >= 0; k--) {
          if (s[k] === ')') p++;
          else if (s[k] === '(' && --p === 0) break;
        }
        return k < 0 ? null : { deb: k, fin: j, txt: s.slice(k + 1, j - 1) };
      }
      let k = j;
      while (k > 0 && /[\w√π]/.test(s[k - 1])) k--;
      return k === j ? null : { deb: k, fin: j, txt: s.slice(k, j) };
    }
    let j = i;
    while (j < s.length && s[j] === ' ') j++;
    if (s[j] === '(') {
      let p = 0, k = j;
      for (; k < s.length; k++) {
        if (s[k] === '(') p++;
        else if (s[k] === ')' && --p === 0) break;
      }
      return k >= s.length ? null : { deb: j, fin: k + 1, txt: s.slice(j + 1, k) };
    }
    let k = j;
    while (k < s.length && /[\w√π]/.test(s[k])) k++;
    return k === j ? null : { deb: j, fin: k, txt: s.slice(j, k) };
  }

  function fraction(s) {
    s = String(s);
    for (let i = 0; i < s.length; i++) {
      if (s[i] !== '/') continue;
      const g = operande(s, i, -1), d = operande(s, i + 1, 1);
      if (!g || !d) continue;
      const html = '<span class="frac"><span class="num">' + g.txt
        + '</span><span class="den">' + d.txt + '</span></span>';
      s = s.slice(0, g.deb) + html + s.slice(d.fin);
      i = g.deb + html.length - 1;
    }
    return s;
  }

  const puissances = s => String(s).replace(/\^(\d+)/g, '<sup>$1</sup>');
  const bloc = s => '<span dir="ltr" class="expr">'
    + puissances(radicaux(fraction(echapper(s)))) + '</span>';

  // Aucune expression ne doit rester nue dans un paragraphe RTL : « A = 3 + 2√2 »
  // sans isolation s'affiche à l'envers. Quand une ligne mêle l'arabe et les
  // mathématiques, on isole chaque morceau mathématique séparément et on laisse
  // le texte arabe couler de droite à gauche. Une lettre seule (« … العدد A »)
  // n'est pas une expression et reste telle quelle.
  const ARABE = /[؀-ۿ]/;
  const RUN = /[0-9A-Za-zπ+\-*×÷/:=^().,|√]+(?:\s+[0-9A-Za-zπ+\-*×÷/:=^().,|√]+)*/g;

  function isoMixte(texte) {
    return String(texte).replace(RUN, m => {
      const n = m.trim();
      if (!/[+\-*×÷/=^|√]/.test(n)) return m;          // pas d'opérateur : simple lettre
      const i = m.indexOf(n);
      return m.slice(0, i) + bloc(n) + m.slice(i + n.length);
    });
  }

  const rendreMath = s => (s && typeof s === 'object' && s.brut) ? s.brut
    : (ARABE.test(String(s)) ? isoMixte(s) : bloc(s));

  // Le LIBELLÉ d'une étape et l'INDICE sont de l'arabe, mais ils citent souvent
  // des mathématiques (« نقارن 2√2 بـ 3 »). Sans isolation, « √10 » ressort en
  // « 10√ » : l'algorithme bidi renvoie le signe de l'autre côté du nombre. Ils
  // passent donc par le même traitement que les étapes elles-mêmes.
  //
  // Les morceaux de l'énoncé vont à la ligne : un énoncé de la fiche pose
  // souvent deux ou trois expressions avant sa question, et les enchaîner sur
  // une seule ligne les rend illisibles — à l'écran comme sur la feuille.
  // L'ÉNONCÉ COMPLET — chaque volet doit porter tout ce qui le précède.
  //
  // Sur la feuille du maître, un exercice est UN SEUL énoncé suivi de ses
  // questions : les données sont posées une fois, en tête, et la dernière
  // question les suppose encore là. Chaque volet, lui, est une page autonome.
  // Tant que chaque page n'affichait que SA ligne, l'élève lisait « استنتج أنّ
  // BEHI متوازي أضلاع » sans savoir ni ce que sont B, E, H et I, ni où ils
  // sont. Ce n'était pas un exercice, c'était un débris.
  //
  // La règle d'écriture était pourtant déjà la bonne : dans chaque volet, la
  // DERNIÈRE ligne de `enonce` est la question, et toutes celles d'avant
  // POSENT quelque chose — les données, une figure qui arrive, une lettre
  // qu'on introduit en cours de route. Il suffisait de les garder.
  //
  // `enonce` reste intact pour le validateur : chaque ligne n'est vérifiée
  // qu'une fois, dans le volet qui l'introduit.
  function contextualiser(volets) {
    const pose = [];
    return volets.map(v => {
      const lignes = (v.enonce || []).slice();
      const question = lignes.pop();
      for (const l of lignes) if (pose.indexOf(l) < 0) pose.push(l);
      return Object.assign({}, v, { enonceComplet: pose.concat([question]) });
    });
  }

  function rendre(brut) {
    return {
      operation: (brut.enonceComplet || brut.enonce).map(rendreMath).join('<br>'),
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
      })(),
      steps: brut.etapes.map(e => rendreMath(e[0]) + ': ' + rendreMath(e[1])),
      hint: rendreMath(brut.indice)
    };
  }

  // -------------------------------------------------------------------------
  // Registre : un « problème » = un exercice entier de la fiche, dont la
  // fonction f() rend le TABLEAU de ses sous-questions sur un tirage commun.
  // Le tirage est commun parce que l'exercice l'est : dans le 18, le B de la
  // question 3 est le B de la question 2.
  // -------------------------------------------------------------------------
  const PROBLEMES = {};
  const enregistrer = (n, def) => { PROBLEMES[n] = def; };
  const tirer = n => PROBLEMES[n].f();

  // L'en-tête par défaut est « التمرين N — », mais une fiche découpée en parties
  // plutôt qu'en exercices numérotés fournit le sien via `entete`.
  const entete = n => (PROBLEMES[n].entete !== undefined
    ? PROBLEMES[n].entete : 'التمرين ' + n + ' — ');

  function construire(n) {
    return {
      id: 'ex' + n,
      title: entete(n) + PROBLEMES[n].titre,
      questions: contextualiser(tirer(n)).map(rendre)
    };
  }

  const API = { ent, choix, pgcd, rat, rAdd, rSub, rMul, rDiv, rNeg, rTxt, rSqrt, carre,
                S, num, ZERO, UN, sAdd, sSub, sNeg, sMul, sDiv, sEch, sSqrt,
                sPuis, sVal, sSigne, sAbs, sEgaux, sCmp, sTxt, estRat, versRat,
                plus, par, analyser, verifierRelation,
                echapper, radicaux, fraction, bloc, isoMixte, rendreMath, rendre,
                ARABE, PROBLEMES, enregistrer, tirer, entete, construire };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Reel = API;
})(typeof window !== 'undefined' ? window : globalThis);
