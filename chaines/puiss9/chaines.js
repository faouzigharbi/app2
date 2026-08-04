// DU TEXTE DE LA FEUILLE À LA CHAÎNE DE DÉMONSTRATION.
//
// Les énoncés viennent des PDF et ne sont pas négociables. Le raisonnement,
// lui, n'y est pas écrit : il faut le RECONSTRUIRE, et le reconstruire juste.
// C'est ce que fait ce fichier, et c'est là que tient la difficulté du
// chapitre : on ne fabrique plus une question autour d'une réponse choisie
// d'avance, on lit une question donnée et l'on retrouve son chemin.
//
// LA PIÈCE CENTRALE : trouver la base commune d'un produit.
//
// « 12⁵ × 144 × 12 » est une puissance de 12, « 216 × 6¹⁵ » une puissance de 6,
// « 4⁶ × 8² × 64³ » une puissance de 2. Aucune de ces bases n'est lisible sur
// la seule écriture. On les trouve par la décomposition en facteurs premiers :
// un facteur vaut 2^a · 3^b · … , et le vecteur (a, b, …) divisé par le pgcd de
// ses composantes donne la base PRIMITIVE de ce facteur. Deux facteurs sont
// puissances d'une même base exactement quand leurs vecteurs primitifs
// coïncident — et cette base est alors la meilleure possible, celle que le
// corrigé du maître écrit.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Puiss;

  const REGLE_PRODUIT = 'a^n × a^p = a^(n+p)';
  const REGLE_PUIS = '(a^n)^p = a^(n×p)';
  const REGLE_MEME_EXP = 'a^n × b^n = (a × b)^n';
  const REGLE_QUOTIENT = 'a^n : a^p = a^(n-p)';
  const REGLE_NEGATIF = 'a^(-n) = 1 : a^n';

  // ── Découpe respectant les parenthèses ──────────────────────────────────
  function couper(s, seps) {
    const out = []; let prof = 0, debut = 0;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === '(') prof++;
      else if (c === ')') prof--;
      else if (prof === 0 && seps.indexOf(c) >= 0 && i > debut
               && !/[\^×*/:+(-]\s*$/.test(s.slice(debut, i))) {
        // Un « - » qui suit « ^ » est le SIGNE d'un exposant, pas une
        // soustraction : « (√2)^-6 + (√3)^4 » n'a que deux termes, et les
        // découper sur ce moins-là donnait de la bouillie.
        out.push({ t: s.slice(debut, i).trim(), op: c });
        debut = i + 1;
      }
    }
    out.push({ t: s.slice(debut).trim(), op: null });
    return out.filter(x => x.t.length);
  }
  const facteursDe = s => couper(s, '×*').map(x => x.t);
  const termesDe = s => {
    const parts = couper(s, '+-');
    // le signe porté par un terme est celui du séparateur qui le précède
    return parts.map((x, i) => ({ t: x.t, signe: i === 0 ? '+' : parts[i - 1].op }));
  };

  // ── LA COUCHE RATIONNELLE ────────────────────────────────────────────────
  //
  // En 7ème tout était entier. Dès la 8ème, la base est un rationnel — « (3/7)⁻⁹ »
  // — et l'exposant peut être négatif. Le raisonnement ne change pas ; seule
  // l'arithmétique s'élargit, et un entier n'est plus qu'un rationnel de
  // dénominateur 1.
  const bpgcd = (a, b) => { while (b) { const t = a % b; a = b; b = t; } return a; };
  const bigpgcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b;
                              while (b) { const t = a % b; a = b; b = t; } return a; };
  const Q = (n, d) => { d = d === undefined ? 1n : d;
                        if (d < 0n) { n = -n; d = -d; }
                        const g = bigpgcd(n, d) || 1n;
                        return { n: n / g, d: d / g }; };
  const qEgaux = (a, b) => a.n === b.n && a.d === b.d;
  const qFois = (a, b) => Q(a.n * b.n, a.d * b.d);
  const qTxt = q => (q.d === 1n ? String(q.n) : q.n + '/' + q.d);
  const qEntier = q => q.d === 1n;

  // LA BASE PRIMITIVE D'UN RATIONNEL. 4/25 vaut (2/5)², 8/27 vaut (2/3)³, et
  // −8/27 vaut (−2/3)³. On lit l'exposant sur le pgcd des exposants premiers,
  // ceux du dénominateur comptés négativement.
  //
  // Le signe impose sa loi : un nombre NÉGATIF n'est qu'une puissance IMPAIRE.
  // −4/25 vaut (2/5)² en valeur absolue, mais aucune puissance ne rend −4/25 ;
  // on rabat donc l'exposant sur son plus grand diviseur impair.
  function primitive(q) {
    if (typeof q === 'bigint') q = Q(q, 1n);
    if (!q || q.n === 0n) return null;
    const neg = q.n < 0n;
    const fh = F.facteurs(neg ? -q.n : q.n), fb = F.facteurs(q.d);
    const exps = {};
    for (const p of Object.keys(fh)) exps[p] = (exps[p] || 0) + fh[p];
    for (const p of Object.keys(fb)) exps[p] = (exps[p] || 0) - fb[p];
    const bases = Object.keys(exps).filter(p => exps[p] !== 0);
    if (!bases.length) return null;                  // 1 ou −1 n'ont pas de base
    let g = 0;
    for (const p of bases) g = bpgcd(g, Math.abs(exps[p]));
    if (neg) while (g % 2 === 0) g /= 2;
    let bn = 1n, bd = 1n;
    for (const p of bases) {
      const e = exps[p] / g;
      if (e > 0) bn *= BigInt(p) ** BigInt(e); else bd *= BigInt(p) ** BigInt(-e);
    }
    if (neg) bn = -bn;
    return { base: Q(bn, bd), exp: g, exps: exps, bases: bases };
  }

  // La valeur d'un facteur écrit — « (7^4)^3 » vaut 7^12, « (3/7)^-2 » vaut
  // 49/9. On la garde en BigInt : ces nombres passent allègrement le milliard.
  function ratDe(texte) {
    const v = F.analyser(texte);
    const ks = Object.keys(v);
    // Zéro n'a AUCUN terme, pas un terme nul : « 35¹⁷ × 0³³ » vaut 0, et sans
    // ce cas il passait pour illisible.
    if (!ks.length) return Q(0n, 1n);
    if (ks.length !== 1) return null;
    const t = v[ks[0]];
    if (Object.keys(t.e).length) return null;        // il reste un radical
    return Q(t.c.n, t.c.d);
  }

  // Là où la 7ème raisonnait, l'entier reste exigé : « 16 × 2⁷ × 32 » n'a pas
  // de dénominateur, et une chaîne qui en inventerait un serait fausse de ton.
  function entier(texte) {
    const q = ratDe(texte);
    return (q && qEntier(q)) ? q.n : null;
  }

  // La base commune à tous les facteurs, et l'exposant de chacun.
  function baseCommune(facteurs) {
    const infos = [];
    for (const t of facteurs) {
      const v = entier(t);
      if (v === null || v <= 0n) return null;
      if (v === 1n) { infos.push({ t, v, exp: 0 }); continue; }  // 7^0, 8^0…
      const pr = primitive(v);
      if (!pr) return null;
      infos.push({ t, v, pr, exp: pr.exp });
    }
    const vrais = infos.filter(x => x.pr);
    if (!vrais.length) return null;
    const b = vrais[0].pr.base;
    if (!vrais.every(x => qEgaux(x.pr.base, b))) return null;
    return { base: b, infos };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PRODUIT DE PUISSANCES — la même chaîne sert « 2³ × 2⁴ », « 16 × 2⁷ × 32 »
  // et « (7⁴)³ × (7²)³ » : ce qui change est ce qu'il faut d'abord reconnaître.
  // ═══════════════════════════════════════════════════════════════════════
  function produit(item) {
    const fs = facteursDe(item.e);
    const q = produitEcrit(item, fs);
    if (q) return q;
    const bc = baseCommune(fs);
    if (!bc) return null;
    const b = bc.base;
    const etapes = [];

    // UN SEUL facteur, à deux étages : « (6³)⁵ ». Il n'y a pas de produit à
    // faire, donc pas d'exposants à additionner — la chaîne du produit y
    // écrirait « 15 = 15 », qui ne démontre rien. Elle a la sienne.
    const seul = /^\s*\(\s*(\d+)\s*\^\s*(\d+)\s*\)\s*\^\s*(\d+)\s*$/.exec(item.e);
    if (fs.length === 1 && seul) {
      const [, ab, an, ap] = seul;
      etapes.push(['القاعدة', REGLE_PUIS]);
      etapes.push(['ما معنى ذلك', ab + '^' + an + ' مضروب في نفسه ' + ap + ' مرّات']);
      etapes.push(['نضرب الأسّين', an + ' × ' + ap + ' = ' + (Number(an) * Number(ap))]);
      const r = puis(b, bc.infos[0].exp);
      etapes.push(['النتيجة', 'A = ' + r]);
      return finir(item, etapes, r, 'قوّة القوّة: نضرب الأسّين', true);
    }

    // Un facteur est-il écrit tel quel comme puissance de la base ?
    const bT = qTxt(b);
    const ecritTelQuel = x => new RegExp('^' + bT.replace(/[/]/g, '\\/') + '(\\^\\d+)?$')
                                  .test(x.t.replace(/\s/g, ''));
    const aReconnaitre = bc.infos.filter(x => !ecritTelQuel(x));
    const aEtages = fs.some(t => /\)\s*\^/.test(t));

    if (aEtages) {
      etapes.push(['القاعدة الأولى', REGLE_PUIS]);
      bc.infos.forEach(x => {
        if (/\)\s*\^/.test(x.t)) {
          etapes.push(['نبسّط ' + x.t, x.t + ' = ' + puis(b, x.exp)]);
        }
      });
    }
    if (aReconnaitre.length && !aEtages) {
      etapes.push(['نلاحظ', 'كلّ العوامل قوى للعدد ' + bT]);
    } else if (!aEtages) {
      // Rien à reconnaître : reste le constat, qui est le geste même de la
      // règle — c'est parce que l'ASSISE est la même qu'on a le droit
      // d'additionner les exposants.
      etapes.push(['نفس الأساس', 'الأساس هو ' + bT + ' في العاملين']);
    }
    aReconnaitre.forEach(x => {
      if (/\)\s*\^/.test(x.t)) return;                       // déjà traité
      etapes.push(['نكتب ' + x.t + ' بالأساس ' + bT, x.t + ' = ' + puis(b, x.exp)]);
    });
    if (bc.infos.some(x => x.exp === 1) || bc.infos.some(x => x.exp === 0)) {
      etapes.push(['الأسّ الضمني', 'العدد ' + bT + ' هو ' + bT + '^1، و ' + bT + '^0 يساوي 1']);
    }
    // Avec un seul facteur, « on réécrit l'expression » dirait exactement ce
    // que dira la conclusion : deux étapes pour une seule relation.
    if ((aReconnaitre.length || aEtages) && bc.infos.length > 1) {
      etapes.push(['نعيد كتابة العبارة', 'A = ' + bc.infos.map(x => puis(b, x.exp)).join(' × ')]);
    }
    const somme = bc.infos.reduce((a, x) => a + x.exp, 0);
    // Un seul facteur : il n'y a rien à additionner, et écrire « 12 = 12 » ne
    // démontrerait rien — ce serait même une étape interchangeable avec la
    // conclusion, donc une chaîne sans ordre.
    if (bc.infos.length > 1) {
      etapes.push([aEtages ? 'القاعدة الثانية' : 'القاعدة', REGLE_PRODUIT]);
      etapes.push(['نجمع الأسّة', bc.infos.map(x => x.exp).join(' + ') + ' = ' + somme]);
    }
    const res = puis(b, somme);
    etapes.push(['النتيجة', 'A = ' + res]);

    return finir(item, etapes, res, 'نفس الأساس: نجمع الأسّة', true);
  }

  // Le chemin de la 8ème : on lit les bases ÉCRITES. Deux d'entre elles peuvent
  // ne différer que par le signe — « (−6/11)⁸ × (6/11)³ » —, et c'est alors une
  // étape à part entière : un exposant PAIR efface le signe, un impair le garde.
  // RAMENER UN FACTEUR À UNE BASE DONNÉE. « (9/16)⁻¹⁹ » se ramène à la base 4/3
  // parce que 9/16 = (4/3)⁻², et « (27/8)⁻² » à la base 3/2 parce que
  // 27/8 = (3/2)³. Trois libertés, et elles couvrent tout ce que les feuilles
  // demandent : la base peut être une PUISSANCE de la référence, son INVERSE,
  // ou son OPPOSÉE — cette dernière seulement si l'exposant est pair, sans quoi
  // le signe survivrait et devrait être porté par le résultat.
  function ramener(x, ref) {
    const pr = primitive(x.base), pf = primitive(ref);
    if (!pr || !pf) return null;
    const inv = Q(pf.base.d, pf.base.n);
    const cand = [
      [pf.base, 1], [inv, -1],
      [Q(-pf.base.n, pf.base.d), 1], [Q(-inv.n, inv.d), -1]
    ];
    for (const [bb, sens] of cand) {
      const pb = primitive(bb);
      if (!pb || !qEgaux(pr.base, pb.base)) continue;
      if (pr.exp % pb.exp !== 0) continue;
      const k = (pr.exp / pb.exp) * sens;
      // signe : la base ramenée peut être l'opposée de la référence
      const e2 = k * x.exp;
      // On ne raisonne pas sur la parité : on VÉRIFIE. Le signe, l'inverse et
      // la puissance se combinent de trop de façons pour être devinés.
      const v = ratDe('(' + qTxt(ref) + ')^' + e2);
      const attendu = ratDe('(' + qTxt(x.base) + ')^' + x.exp);
      if (!v || !attendu || !qEgaux(v, attendu)) continue;
      return { exp: e2, change: e2 !== x.exp || !qEgaux(x.base, ref) };
    }
    return null;
  }

  function produitEcrit(item, fs) {
    const es = fs.map(ecrite);
    if (es.some(x => !x)) return null;

    // UN SEUL facteur, mais à étages : « (6⁻³)⁷ », « ((5/7)⁻¹²⁰)⁴ ». Pas de
    // produit à faire — la règle est celle de la puissance d'une puissance,
    // et l'on montre les exposants se multiplier.
    if (fs.length === 1) {
      const x = es[0];
      if (!x.etages || x.exp === 0) return null;
      const m = /^([\s\S]*?)\^\s*\(?\s*(-?\d+)\s*\)?$/.exec(item.e.trim());
      if (!m) return null;
      const dedans = ecrite(m[1]);
      if (!dedans) return null;
      const etapes = [];
      etapes.push(['القاعدة', REGLE_PUIS]);
      etapes.push(['الأساس', 'الأساس هو ' + qTxt(x.base)]);
      etapes.push(['نضرب الأسّين',
                   '(' + dedans.exp + ') × (' + m[2] + ') = ' + x.exp]);
      if (x.exp < 0) etapes.push(['أسّ سالب', REGLE_NEGATIF]);
      etapes.push(['النتيجة', 'A = ' + puis(x.base, x.exp)]);
      return finir(item, etapes, puis(x.base, x.exp),
                   'قوّة القوّة: نضرب الأسّين', true);
    }
    if (fs.length < 2) return null;

    // La référence : la base la plus simple qui ramène toutes les autres.
    let ref = null, ramene = null;
    for (const c of es) {
      const essai = es.map(x => ramener(x, c.base));
      if (essai.every(Boolean)) { ref = c.base; ramene = essai; break; }
    }
    if (!ref) return null;

    const somme = ramene.reduce((a, x) => a + x.exp, 0);
    if (somme === 0) return null;
    const etapes = [];
    es.forEach((x, i) => {
      if (!ramene[i].change) return;
      etapes.push(['نرجع ' + x.baseTxt + ' إلى الأساس ' + qTxt(ref),
                   puis(x.base, x.exp) + ' = ' + puis(ref, ramene[i].exp)]);
    });
    etapes.push(['القاعدة', REGLE_PRODUIT]);
    etapes.push(['نفس الأساس', 'الأساس هو ' + qTxt(ref) + ' في كلّ العوامل']);
    etapes.push(['نجمع الأسّة',
                 ramene.map(x => (x.exp < 0 ? '(' + x.exp + ')' : x.exp)).join(' + ')
                 + ' = ' + somme]);
    if (somme < 0) etapes.push(['أسّ سالب', REGLE_NEGATIF]);
    etapes.push(['النتيجة', 'A = ' + puis(ref, somme)]);
    return finir(item, etapes, puis(ref, somme), 'نفس الأساس: نجمع الأسّة', true);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MÊME EXPOSANT — « 3⁴ × 25² » : il faut d'abord ramener au même exposant,
  // et pour cela lire 25² comme 5⁴. L'exposant commun est le pgcd des
  // exposants maximaux ; les bases s'en déduisent.
  // ═══════════════════════════════════════════════════════════════════════
  function memeExposant(item) {
    const fs = facteursDe(item.e);
    if (fs.length < 2) return null;
    const q = memeExposantEcrit(item, fs);
    if (q) return q;
    const infos = [];
    for (const t of fs) {
      const v = entier(t);
      if (v === null || v <= 1n) return null;
      const pr = primitive(v);
      if (!pr) return null;
      infos.push({ t, v, pr });
    }
    let n = 0;
    for (const x of infos) n = bpgcd(n, x.pr.exp);
    if (n < 2) return null;
    // la base de chaque facteur pour cet exposant commun
    infos.forEach(x => { x.base = Q(x.pr.base.n ** BigInt(x.pr.exp / n),
                                    x.pr.base.d ** BigInt(x.pr.exp / n)); });

    const etapes = [];
    const aRamener = infos.filter(x => x.pr.exp !== n || !qEgaux(x.pr.base, x.base));
    aRamener.forEach(x => {
      etapes.push(['نعيد كتابة ' + x.t, x.t + ' = ' + puis(x.base, n)]);
    });
    etapes.push(['نفس الأسّ الآن', 'الأسّ هو ' + n + ' في كلّ العوامل']);
    etapes.push(['القاعدة', REGLE_MEME_EXP]);
    let prod = Q(1n, 1n);
    infos.forEach(x => { prod = qFois(prod, x.base); });
    etapes.push(['نضرب الأساسات',
                 infos.map(x => qTxt(x.base)).join(' × ') + ' = ' + qTxt(prod)]);
    const res = puis(prod, n);
    etapes.push(['النتيجة', 'A = ' + res]);

    return finir(item, etapes, res, 'نفس الأسّ: نضرب الأساسات', true);
  }

  // Le chemin de la 8ème : mêmes exposants ÉCRITS, bases quelconques dans ℚ.
  function memeExposantEcrit(item, fs) {
    const es = fs.map(ecrite);
    if (es.some(x => !x)) return null;
    const n = es[0].exp;
    if (!es.every(x => x.exp === n) || n === 0) return null;
    let prod = Q(1n, 1n);
    es.forEach(x => { prod = qFois(prod, x.base); });
    const etapes = [];
    etapes.push(['نفس الأسّ', 'الأسّ هو ' + n + ' في كلّ العوامل']);
    etapes.push(['القاعدة', REGLE_MEME_EXP]);
    etapes.push(['نضرب الأساسات',
                 es.map(x => qTxt(x.base)).join(' × ') + ' = ' + qTxt(prod)]);
    if (n < 0) etapes.push(['أسّ سالب', REGLE_NEGATIF]);
    etapes.push(['النتيجة', 'A = ' + puis(prod, n)]);
    return finir(item, etapes, puis(prod, n), 'نفس الأسّ: نضرب الأساسات', true);
  }

  // b^e, en rationnel : le seul endroit où l'exposant a le droit d'être
  // négatif sans qu'on retourne la fraction à la main.
  const qPuis = (b, e) => {
    const E = BigInt(Math.abs(e));
    const neg = b.n < 0n, m = neg ? -b.n : b.n;
    const s = (neg && Math.abs(e) % 2 === 1) ? -1n : 1n;
    return e >= 0 ? Q(s * m ** E, b.d ** E) : Q(s * b.d ** E, m ** E);
  };

  // L'EXPOSANT D'UN NOMBRE DANS UNE BASE DONNÉE. 25 s'écrit (1/5)⁻², et c'est
  // exactement ce dont la mise en facteur a besoin : le facteur commun et la
  // parenthèse ne sont pas toujours du même côté de la barre de fraction, mais
  // ils sont bel et bien des puissances de la même base. On cherche l'exposant
  // et on VÉRIFIE — aucun raisonnement sur les signes ne vaut ce contrôle-là.
  function expoDe(q, base) {
    if (!q || q.n === 0n || !base || base.n === 0n) return null;
    if (base.n === base.d || base.n === -base.d) return null;   // 1 et −1 : sans exposant
    for (let e = -80; e <= 80; e++) if (qEgaux(qPuis(base, e), q)) return e;
    return null;
  }
  // « 14 + (−2) = 12 » : le signe se lit, il ne se devine pas.
  const signeLu = e => (e < 0 ? '(' + e + ')' : String(e));

  // ═══════════════════════════════════════════════════════════════════════
  // FACTEUR COMMUN — « 3⁵ × 15 − 6 × 3⁵ ». On sort la puissance commune, on
  // calcule la parenthèse, et l'on découvre qu'elle est elle aussi une
  // puissance de la même base : tout retombe sur une seule.
  //
  // Le facteur commun n'est PAS tenu d'être entier : « 5⁻¹⁴ × 15 + 5⁻¹⁴ × 10 »
  // est le même geste, à ceci près que la puissance sortie est à exposant
  // négatif. C'est précisément l'item de 8ème, celui où la règle cesse d'être
  // une affaire de grands nombres pour devenir une affaire de règle.
  // ═══════════════════════════════════════════════════════════════════════
  function facteurCommun(item) {
    const ts = termesDe(item.e);
    // « 2⁶ + 2⁶ + 2⁶ + 2⁶ » en a quatre, « 3⁵ × 15 − 6 × 3⁵ » en a deux :
    // la mise en facteur ne connaît pas ce nombre-là.
    if (ts.length < 2) return null;

    const vals = ts.map(x => ratDe(x.t));
    if (vals.some(v => v === null || v.n === 0n)) return null;
    const parts = ts.map(x => facteursDe(x.t).map(u => ({ u, v: ratDe(u) })));
    if (parts.some(p => p.some(x => x.v === null || x.v.n === 0n))) return null;

    // Le facteur commun : présent dans TOUS les termes, et l'on préfère celui
    // qui est écrit comme une puissance — c'est lui que la leçon vise.
    let commun = null, prCommun = null;
    for (const a of parts[0]) {
      const pr = primitive(a.v);
      if (!pr) continue;                                  // 1 et −1 ne factorisent rien
      if (!parts.every(p => p.some(x => qEgaux(x.v, a.v)))) continue;
      if (!commun || (/\^/.test(a.u) && !/\^/.test(commun.u)) || pr.exp > prCommun.exp) {
        commun = a; prCommun = pr;
      }
    }
    if (!commun) return null;

    const reste = parts.map(p => {
      const c = p.slice();
      const i = c.findIndex(x => qEgaux(x.v, commun.v));
      if (i < 0) return null;
      c.splice(i, 1);
      return c.length ? c : [{ u: '1', v: Q(1n, 1n) }];
    });
    if (reste.some(r => r === null)) return null;

    const morceaux = reste.map(r => r.reduce((a, x) => qFois(a, x.v), Q(1n, 1n)));
    let dedans = morceaux[0];
    for (let i = 1; i < ts.length; i++) {
      const m = morceaux[i], s = ts[i].signe === '-' ? -1n : 1n;
      dedans = Q(dedans.n * m.d + s * m.n * dedans.d, dedans.d * m.d);
    }
    if (dedans.n === 0n) return null;

    // La base du résultat n'est PAS celle du facteur commun, et c'est là toute
    // la beauté de ces items : « 11 × 5³ − 3 × 5³ » donne 5³ × 8, qui vaut 1000,
    // c'est-à-dire 10³. « 3⁴ × 13 + 3 × 3⁴ » donne 81 × 16 = 1296 = 6⁴. On lit
    // donc la base sur le PRODUIT final, pas sur l'un de ses facteurs.
    const total = qFois(commun.v, dedans);
    const prT = primitive(total);
    if (!prT || prT.exp < 2) return null;
    const b = prT.base;

    const etapes = [];
    etapes.push(['العامل المشترك',
                 'العامل المشترك هو ' + commun.u + '، و هو موجود في كلّ الحدود']);
    const dansLeQuoi = reste.map((r, i) =>
      (i ? ts[i].signe + ' ' : '') + r.map(x => x.u).join(' × ')).join(' ');
    etapes.push(['نُخرج العامل المشترك', 'A = ' + commun.u + ' × (' + dansLeQuoi + ')']);
    etapes.push(['ننجز القوس', dansLeQuoi + ' = ' + qTxt(dedans)]);
    etapes.push(['نعيد الكتابة', 'A = ' + commun.u + ' × ' + qTxt(dedans)]);
    // Deux chemins selon que le facteur commun et la parenthèse s'écrivent, ou
    // non, comme des puissances de la base du résultat.
    const res = puis(b, prT.exp);
    const eC = expoDe(commun.v, b), eD = expoDe(dedans, b);
    if (eC !== null && eD !== null && eC + eD === prT.exp) {
      if (qTxt(dedans) !== puis(b, eD)) {
        etapes.push(['نلاحظ', 'العدد ' + qTxt(dedans) + ' هو ' + puis(b, eD)]);
      }
      if (commun.u.replace(/\s/g, '') !== puis(b, eC)) {
        etapes.push(['و العامل المشترك', commun.u + ' = ' + puis(b, eC)]);
      }
      etapes.push(['القاعدة', REGLE_PRODUIT]);
      etapes.push(['نجمع الأسّين',
                   signeLu(eC) + ' + ' + signeLu(eD) + ' = ' + prT.exp]);
    } else {
      // Le facteur commun et la parenthèse n'ont pas la même base : c'est leur
      // PRODUIT qui est une puissance, et d'une troisième base.
      etapes.push(['نحسب الجداء',
                   commun.u + ' × ' + qTxt(dedans) + ' = ' + qTxt(total)]);
      etapes.push(['نفكّك النتيجة', qTxt(total) + ' = ' + puis(b, prT.exp)]);
    }
    etapes.push(['النتيجة', 'A = ' + res]);

    return finir(item, etapes, res, 'أخرج القوّة المشتركة، ثمّ انظر إلى ما بقي في القوس', true);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CALCUL — on réduit l'expression par ordre de priorité, un cran par étape.
  // Ici on ne demande pas une forme mais une VALEUR.
  // ═══════════════════════════════════════════════════════════════════════
  function calcul(item) {
    const etapes = [];
    let e = item.e;

    // UNE SEULE puissance, sans rien autour : « 3³ », « 10⁰ ». Il n'y a pas de
    // priorité à trancher — il y a la DÉFINITION à rappeler, et c'est elle que
    // l'exercice vise.
    // TOUT ce qui est élevé à la puissance 0 vaut 1, si énorme que soit la
    // base. « ((20/17)^-2354)^0 » n'a pas à être calculé — et ne PEUT pas
    // l'être : ce serait un nombre de milliers de chiffres. C'est exactement
    // ce que l'exercice veut faire comprendre.
    // La base doit être TOUTE l'expression : « 2² + 5 × 3 − 6⁰ » finit aussi
    // par « ^0 » sans être une puissance nulle, et la confondre effaçait le
    // calcul entier.
    // Une base PARENTHÉSÉE seulement : « 10⁰ » a sa propre chaîne, celle de la
    // définition, et n'a pas besoin de l'argument « inutile de calculer ».
    const zero = /^([([][\s\S]+[)\]])\s*\^\s*\(?\s*0\s*\)?\s*$/.exec(item.e.trim());
    // et la parenthèse doit VRAIMENT envelopper le tout : « (-3/7)^-2 × (23/67)^0 »
    // commence et finit par une parenthèse sans être parenthésé.
    const enveloppe = t => {
      if (/^\d+$/.test(t)) return true;
      let prof = 0;
      for (let i = 0; i < t.length; i++) {
        const c = t[i];
        if (c === '(' || c === '[') prof++;
        else if (c === ')' || c === ']') { prof--; if (!prof && i < t.length - 1) return false; }
      }
      return prof === 0;
    };
    if (zero && enveloppe(zero[1].trim())) {
      etapes.push(['القاعدة', 'كلّ عدد غير منعدم مرفوع للأسّ 0 يساوي 1']);
      etapes.push(['لا حاجة للحساب',
                   'مهما كان ' + zero[1].trim() + '، الأسّ 0 يحسم']);
      // « نطبّق » disait déjà ce que dit « النتيجة » : deux étapes pour une
      // relation. On montre plutôt le geste — l'exposant tombe sur la base
      // entière — puis on conclut.
      etapes.push(['نطبّق على العبارة كلّها',
                   'الأسّ 0 يقع على ' + zero[1].trim() + ' بأكمله']);
      etapes.push(['النتيجة', 'A = 1']);
      return finir(item, etapes, '1', 'الأسّ 0 يحسم قبل كلّ حساب', false);
    }

    // « (3/4)^-2 » seul : la définition suffit. Mais « (-3/2)^3 × (-9/4)^-2 »
    // est un produit — il passe par la réduction ordinaire.
    const nu = /^\s*[([]?\s*(-?\d+(?:[,.]\d+)?(?:\s*\/\s*-?\d+)?)\s*[)\]]?\s*\^\s*\(?\s*(-?\d+)\s*\)?\s*$/.exec(item.e);
    if (nu) {
      const [, b, n] = nu;
      const val = ratDe(item.e);
      if (val === null) return null;
      if (Number(n) === 0) {
        etapes.push(['القاعدة', 'كلّ عدد غير منعدم مرفوع للأسّ 0 يساوي 1']);
        etapes.push(['لماذا', 'لأنّ ' + b + '^n : ' + b + '^n = 1، و هو أيضا ' + b + '^(n-n)']);
        etapes.push(['نطبّق', 'A = ' + b + '^0']);
        etapes.push(['النتيجة', 'A = 1']);
      } else if (Number(n) < 0) {
        // L'exposant négatif : c'est l'INVERSE, pas l'opposé. La faute est là,
        // et l'exercice ne sert qu'à elle.
        const k = -Number(n);
        etapes.push(['القاعدة', REGLE_NEGATIF]);
        etapes.push(['ما معنى ذلك', 'الأسّ السالب يعطي المقلوب، لا المقابل']);
        const p = ratDe('(' + b + ')^' + k);
        etapes.push(['نحسب القوّة الموجبة', '(' + b + ')^' + k + ' = ' + qTxt(p)]);
        // Les parenthèses ne sont pas décoratives : « 1 : 9/16 » se lit
        // (1 : 9) / 16, ce qui est faux. Le quotient doit être enveloppé.
        etapes.push(['نأخذ المقلوب',
                     '1 : (' + qTxt(p) + ') = ' + qTxt(val)]);
        etapes.push(['النتيجة', 'A = ' + qTxt(val)]);
      } else {
        const m = Number(n);
        etapes.push(['القاعدة', 'a^n هو جداء n عاملا كلّها a']);
        etapes.push(['ما معنى ذلك',
                     '(' + b + ')^' + n + ' = ' + Array(m).fill('(' + b + ')').join(' × ')]);
        etapes.push(['نحسب', Array(m).fill('(' + b + ')').join(' × ') + ' = ' + qTxt(val)]);
        etapes.push(['النتيجة', 'A = ' + qTxt(val)]);
      }
      return finir(item, etapes, qTxt(val), 'ارجع إلى تعريف القوّة', false);
    }

    const vu = new Set([e]);
    etapes.push(['نحدّد الأولوية', 'الأقواس أوّلا، ثمّ القوى، ثمّ الضرب و القسمة، ثمّ الجمع و الطرح']);

    // Une réduction doit rester une EXPRESSION : si une étape sort déséquilibrée
    // — « (81 » —, la chaîne est fausse même quand la valeur finale est juste.
    // On abandonne alors, et une autre voie prendra la question.
    const equilibre = t => {
      let prof = 0;
      for (const c of String(t)) {
        if (c === '(' || c === '[') prof++;
        else if (c === ')' || c === ']') { prof--; if (prof < 0) return false; }
      }
      return prof === 0;
    };
    for (let garde = 0; garde < 12; garde++) {
      const suivant = reduire(e);
      if (suivant && !equilibre(suivant)) return null;
      if (!suivant || suivant === e || vu.has(suivant)) break;
      vu.add(suivant);
      etapes.push([libelle(e, suivant), e + ' = ' + suivant]);
      e = suivant;
    }
    const val = ratDe(item.e);
    if (val === null) return null;
    if (qTxt(val) !== e) etapes.push(['ننجز آخر عملية', e + ' = ' + qTxt(val)]);
    etapes.push(['النتيجة', 'A = ' + qTxt(val)]);
    if (etapes.length < 4) return null;
    return finir(item, etapes, qTxt(val), 'القوى قبل الضرب، و الضرب قبل الجمع', false);

    // Un seul cran de réduction : la parenthèse la plus profonde, sinon toutes
    // les puissances, sinon tous les produits, sinon la somme.
    function reduire(s) {
      // Une parenthèse SUIVIE D'UN EXPOSANT est un bloc : « (−9/4)⁻² ». La
      // dépouiller de ses parenthèses avant d'élever changerait le sens —
      // « −9/4^−2 » n'est pas « (−9/4)^−2 ». On abat donc la puissance d'abord.
      const bloc = /\(([^()]+)\)\s*\^\s*\(?(-?\d+)\)?/.exec(s);
      // Un entier positif entre parenthèses n'a pas besoin d'elles : « (3)^2 »
      // se lit « 3^2 », et le montrer est déjà une étape.
      if (bloc && /^\d+$/.test(bloc[1].trim())) {
        return (s.slice(0, bloc.index) + bloc[1].trim() + '^' + bloc[2]
                + s.slice(bloc.index + bloc[0].length)).trim();
      }
      if (bloc && /^-?\d+(\/\d+)?$/.test(bloc[1].trim())) {
        const v = ratDe(bloc[0]);
        if (v === null) return null;
        const t = qTxt(v);
        return (s.slice(0, bloc.index) + (v.n < 0n ? '(' + t + ')' : t)
                + s.slice(bloc.index + bloc[0].length)).trim();
      }
      // On passe les parenthèses en revue dans l'ordre où elles s'écrivent, et
      // l'on s'arrête à la PREMIÈRE qui a quelque chose à donner. Une
      // parenthèse déjà réduite à un nombre et qu'on ne peut pas dépouiller
      // sans changer le sens ne bloque plus la ligne : on passe à la suivante.
      for (const par of s.match(/\([^()]+\)/g)
                       ? [...s.matchAll(/\(([^()]+)\)/g)] : []) {
        // Une parenthèse ne tombe pas d'un coup : on y applique d'abord un cran
        // de priorité, et elle ne disparaît que devenue un nombre. Sinon
        // « (8 + 5 × 3)^2 » se réglerait en une ligne, et l'élève ne verrait
        // jamais que le produit passe avant la somme.
        const dedans = par[1].trim();
        if (!/^-?\d+(\/\d+)?$/.test(dedans)) {
          const mieux = reduire(dedans);
          if (!mieux) return null;
          return (s.slice(0, par.index) + '(' + mieux + ')'
                  + s.slice(par.index + par[0].length)).trim();
        }
        // Une parenthèse précédée d'un RADICAL ne se dépouille pas :
        // « √(8/98) » n'est pas « √8/98 ». On la calcule d'un bloc.
        if (/√\s*$/.test(s.slice(0, par.index))) {
          const v2 = ratDe('√(' + dedans + ')');
          if (v2 === null) return null;
          return (s.slice(0, par.index - 1) + qTxt(v2)
                  + s.slice(par.index + par[0].length)).trim();
        }
        // UNE PARENTHÈSE NE TOMBE QUE SI ELLE NE PORTE RIEN. « 2 : (−3/2) »
        // n'est pas « 2 : −3/2 » — la barre de fraction du contenu se mettrait
        // à diviser à son tour, et le calcul change de valeur ; « (29/10) : 5 »
        // ne se dépouille pas davantage, pour la même raison lue de l'autre
        // côté. Et « + (−3) » n'est pas « + −3 » : deux signes de suite ne
        // s'écrivent pas. Quand elle ne peut pas tomber, on la laisse, et le
        // cran suivant la traitera comme le nombre qu'elle est devenue.
        const opAvant = s.slice(0, par.index).replace(/\s+$/, '').slice(-1);
        const opApres = s.slice(par.index + par[0].length).replace(/^\s+/, '')[0] || '';
        const negatif = dedans[0] === '-';
        const compose = dedans.indexOf('/') >= 0;
        const tombe = !(negatif && /[+\-×*/:]/.test(opAvant))
                   && !(compose && /[/:]/.test(opAvant))
                   && !(compose && /[/:]/.test(opApres));
        if (tombe) {
          return (s.slice(0, par.index) + dedans
                  + s.slice(par.index + par[0].length)).trim();
        }
      }
      if (/\^/.test(s)) {
        // les puissances parenthésées d'abord — « (-9/4)^-2 » est un bloc
        let out = s.replace(/\(([^()]+)\)\s*\^\s*\(?(-?\d+)\)?/g, (m) => {
          const v = ratDe(m); return v === null ? m : '(' + qTxt(v) + ')';
        });
        if (out !== s) return out.replace(/\((-?\d+(?:\/\d+)?)\)/g, '$1').trim();
        return s.replace(/(\d+)\s*\^\s*\(?(-?\d+)\)?/g, (m) => {
          const v = ratDe(m); return v === null ? m : qTxt(v);
        });
      }
      // Un produit de puissances déjà réduites : on le calcule d'un coup, mais
      // seulement une fois les puissances tombées — sinon on sauterait l'étape
      // qui compte.
      if (/×|\*/.test(s)) {
        return couper(s, '+-').map((x, i, t) => {
          const v = ratDe(x.t);
          return (i ? t[i - 1].op + ' ' : '') + (v === null ? x.t : qTxt(v));
        }).join(' ');
      }
      // Il ne reste qu'une somme : c'est le dernier cran, et il sert surtout
      // À L'INTÉRIEUR d'une parenthèse — « (4 + 12)^2 » ne se réduit pas sans lui.
      if (/[+\-]/.test(s)) {
        const v = ratDe(s);
        return v === null ? null : qTxt(v);
      }
      return null;
    }
    function libelle(avant, apres) {
      // Quand la ligne suivante est un NOMBRE, on n'a pas « retiré les
      // parenthèses » : on a fini le calcul. Le dire autrement serait mentir
      // sur le geste, même si l'égalité, elle, reste vraie.
      if (/^-?\d+(\/\d+)?$/.test(apres) && !/^-?\d+(\/\d+)?$/.test(avant)) {
        return 'ننجز آخر عملية';
      }
      if (/\(/.test(avant) && !/\(/.test(apres)) return 'نزيل الأقواس';
      if (/\(/.test(avant) && /\(/.test(apres)) return 'ننجز داخل القوس';
      if (/\^/.test(avant) && !/\^/.test(apres)) return 'ننجز القوى';
      if (/×|\*/.test(avant) && !/×|\*/.test(apres)) return 'ننجز الضرب';
      if (/[+\-]/.test(avant)) return 'ننجز الجمع و الطرح';
      return 'نبسّط';
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // DÉCOMPOSER — « écris 64 sous forme de puissance d'exposant différent de 1 ».
  //
  // La réponse n'est pas unique : 64 vaut 2⁶, 4³ et 8². On donne la PLUS
  // décomposée, celle dont la base est première — et l'on montre les autres,
  // parce qu'un élève qui répond 8² n'a pas tort.
  // ═══════════════════════════════════════════════════════════════════════
  function decomposer(item) {
    const v = entier(item.e);
    if (v === null || v <= 1n) return null;
    const f = F.facteurs(v);
    const bases = Object.keys(f);
    const pr = primitive(v);
    if (!pr || pr.exp < 2) return null;
    const etapes = [];
    etapes.push(['نفكّك إلى عوامل أوّلية',
                 v + ' = ' + bases.map(b => puis(b, f[b])).join(' × ')]);
    if (bases.length === 1) {
      const b = bases[0];
      etapes.push(['نعدّ العوامل', 'العدد ' + b + ' مضروب في نفسه ' + f[b] + ' مرّات']);
      const autres = [];
      for (let d = 2; d <= f[b] / 2; d++) {
        if (f[b] % d === 0) autres.push(puis(String(BigInt(b) ** BigInt(d)), f[b] / d));
      }
      if (autres.length) etapes.push(['كتابات أخرى ممكنة', 'و كذلك ' + autres.join(' و ')]);
      else etapes.push(['الأساس أوّلي', 'العدد ' + b + ' أوّلي: لا كتابة أخرى']);
      etapes.push(['النتيجة', 'A = ' + puis(b, f[b])]);
      return finir(item, etapes, puis(b, f[b]),
                   'فكّك العدد إلى عوامل أوّلية، ثمّ اقرأ الأسّ', true);
    }
    etapes.push(['أسّة كلّها مضاعفات لـ ' + pr.exp,
                 bases.map(b => f[b]).join(' و ') + ' مضاعفات للعدد ' + pr.exp]);
    etapes.push(['نجمّع', v + ' = (' + bases.map(b => puis(b, f[b] / pr.exp)).join(' × ')
                             + ')^' + pr.exp]);
    etapes.push(['نحسب الأساس', bases.map(b => puis(b, f[b] / pr.exp)).join(' × ')
                                + ' = ' + qTxt(pr.base)]);
    const res = puis(pr.base, pr.exp);
    etapes.push(['النتيجة', 'A = ' + res]);
    return finir(item, etapes, res, 'فكّك العدد إلى عوامل أوّلية، ثمّ اقرأ الأسّ', true);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // LE RECOURS GÉNÉRAL — aucune famille ne reconnaît la forme, et pourtant la
  // VALEUR est une puissance. « 16000 × 5⁴ » vaut 2⁷ × 5⁷, donc 10⁷ : ni base
  // commune, ni même exposant écrit. Les facteurs premiers, eux, le disent.
  // ═══════════════════════════════════════════════════════════════════════
  function parLesPremiers(item) {
    const v = entier(item.e);
    if (v === null || v <= 1n) return null;
    const pr = primitive(v);
    if (!pr || pr.exp < 2) return null;
    const f = F.facteurs(v);
    const bases = Object.keys(f);
    const fs = facteursDe(item.e);
    if (fs.length < 2) return null;
    const etapes = [];
    etapes.push(['نفكّك كلّ عامل إلى عوامل أوّلية',
      fs.map(t => {
        const x = entier(t);
        const g = F.facteurs(x);
        return t + ' = ' + Object.keys(g).map(b => puis(b, g[b])).join(' × ');
      }).join(' ؛ ')]);
    etapes.push(['نجمع أسّة كلّ أساس',
                 'A = ' + bases.map(b => puis(b, f[b])).join(' × ')]);
    etapes.push(['أسّة كلّها مضاعفات لـ ' + pr.exp,
                 bases.map(b => f[b]).join(' و ') + ' مضاعفات للعدد ' + pr.exp]);
    etapes.push(['نكتب في صيغة قوّة',
                 'A = (' + bases.map(b => puis(b, f[b] / pr.exp)).join(' × ') + ')^' + pr.exp]);
    etapes.push(['نحسب الأساس',
                 bases.map(b => puis(b, f[b] / pr.exp)).join(' × ') + ' = ' + qTxt(pr.base)]);
    const res = puis(pr.base, pr.exp);
    etapes.push(['النتيجة', 'A = ' + res]);
    return finir(item, etapes, res, 'مرّ بالعوامل الأوّلية: الأسّة تنكشف هناك', true);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // QUOTIENT DE MÊME BASE — « 7⁵ / 7² », « (−3)⁻⁸ / (−3)⁷ », « (6/7)⁵ / (6/7)⁻⁷ ».
  //
  // La règle soustrait les exposants, et c'est là que l'exposant négatif entre
  // dans le chapitre : « (−3)⁻⁸ / (−3)⁷ » donne (−3)⁻¹⁵. L'élève qui croit
  // qu'on divise les exposants, ou qu'un exposant négatif rend le nombre
  // négatif, se trompe ici et pas ailleurs.
  // ═══════════════════════════════════════════════════════════════════════
  // Ce que l'énoncé ÉCRIT : « (−3)^-8 » donne la base −3 et l'exposant −8.
  // Il faut le lire au lieu de le recalculer, car la valeur perd le signe et
  // le sens de l'exposant : (−3)⁻⁸ est positif, et (6/7)⁻⁷ se lit (7/6)⁷ si
  // l'on ne regarde que le nombre. La règle du chapitre porte sur l'écriture.
  function ecrite(t) {
    let s = String(t).trim();
    const m = /^([\s\S]*?)\^\s*\(?\s*(-?\d+)\s*\)?$/.exec(s);
    let baseTxt = (m ? m[1] : s).trim();
    const exp = m ? Number(m[2]) : 1;
    let garde = 0;
    while (garde++ < 6 && /^[([][\s\S]*[)\]]$/.test(baseTxt)) {
      // n'éplucher que si la parenthèse enveloppe VRAIMENT tout : « (a)(b) »
      // commence et finit par une parenthèse sans être parenthésé.
      let prof = 0, tout = true;
      for (let i = 0; i < baseTxt.length; i++) {
        const c = baseTxt[i];
        if (c === '(' || c === '[') prof++;
        else if (c === ')' || c === ']') { prof--; if (!prof && i < baseTxt.length - 1) tout = false; }
      }
      if (!tout) break;
      baseTxt = baseTxt.slice(1, -1).trim();
    }
    // La base peut être ELLE-MÊME une puissance : « ((5/7)⁻¹²⁰)⁴ ». On descend,
    // et les exposants se multiplient — c'est la règle (aⁿ)ᵖ, lue à la source.
    if (/\^/.test(baseTxt)) {
      const dessous = ecrite(baseTxt);
      if (!dessous) return null;
      return { baseTxt: dessous.baseTxt, base: dessous.base,
               exp: dessous.exp * exp, etages: (dessous.etages || 0) + 1 };
    }
    if (/[()[\]×*+]/.test(baseTxt)) return null;     // base composée : on renonce
    const b = ratDe(baseTxt);
    if (!b || b.n === 0n) return null;
    return { baseTxt, base: b, exp };
  }

  function quotient(item) {
    const parts = couper(item.e, '/:').map(x => x.t);
    if (parts.length !== 2) return null;
    const [hautT, basT] = parts;
    const vh = ratDe(hautT), vb = ratDe(basT);
    if (!vh || !vb || vh.n === 0n || vb.n === 0n) return null;
    const ph = primitive(vh), pb = primitive(vb);
    if (!ph || !pb) return null;

    // D'abord ce qui est écrit : c'est là que la règle a un sens.
    const eh0 = ecrite(hautT), eb0 = ecrite(basT);
    if (eh0 && eb0 && qEgaux(eh0.base, eb0.base)) {
      const diff = eh0.exp - eb0.exp;
      if (diff === 0) return null;
      const etapes = [];
      etapes.push(['القاعدة', REGLE_QUOTIENT]);
      etapes.push(['نفس الأساس',
                   'الأساس هو ' + qTxt(eh0.base) + ' في البسط و المقام']);
      etapes.push(['نطرح الأسّين',
                   eh0.exp + ' - (' + eb0.exp + ') = ' + diff]);
      if (diff < 0) etapes.push(['أسّ سالب', REGLE_NEGATIF]);
      etapes.push(['النتيجة', 'A = ' + puis(eh0.base, diff)]);
      return finir(item, etapes, puis(eh0.base, diff),
                   'نفس الأساس: نطرح الأسّين', true);
    }

    // Une base commune aux deux étages, écrite ou à découvrir.
    let b = null, eh = 0, eb = 0;
    if (qEgaux(ph.base, pb.base)) { b = ph.base; eh = ph.exp; eb = pb.exp; }
    else {
      // « 9³ / 4³ » : bases différentes, MÊME exposant — c'est l'autre règle.
      const n = bpgcd(ph.exp, pb.exp);
      if (n < 2) return null;
      const bh = Q(ph.base.n ** BigInt(ph.exp / n), ph.base.d ** BigInt(ph.exp / n));
      const bb = Q(pb.base.n ** BigInt(pb.exp / n), pb.base.d ** BigInt(pb.exp / n));
      const etapes = [];
      etapes.push(['نفس الأسّ', 'الأسّ هو ' + n + ' في البسط و المقام']);
      etapes.push(['القاعدة', 'a^n : b^n = (a : b)^n']);
      const q = Q(bh.n * bb.d, bh.d * bb.n);
      const env2 = t => (/[/:]/.test(t) ? '(' + t + ')' : t);
      etapes.push(['نقسم الأساسين',
                   env2(qTxt(bh)) + ' : ' + env2(qTxt(bb)) + ' = ' + env2(qTxt(q))]);
      etapes.push(['النتيجة', 'A = ' + puis(q, n)]);
      return finir(item, etapes, puis(q, n), 'نفس الأسّ: نقسم الأساسين', true);
    }

    // Les exposants tels qu'ils sont ÉCRITS, quand ils le sont : la règle porte
    // sur eux, et l'élève doit les voir se soustraire.
    const bT = qTxt(b);
    const nh = eh, nb = eb;
    const diff = nh - nb;
    if (diff === 0) return null;

    const etapes = [];
    etapes.push(['القاعدة', REGLE_QUOTIENT]);
    etapes.push(['نفس الأساس', 'الأساس هو ' + bT + ' في البسط و المقام']);
    etapes.push(['نطرح الأسّين', nh + ' - (' + nb + ') = ' + diff]);
    if (diff < 0) {
      etapes.push(['أسّ سالب', REGLE_NEGATIF]);
    }
    etapes.push(['النتيجة', 'A = ' + puis(b, diff)]);
    return finir(item, etapes, puis(b, diff), 'نفس الأساس: نطرح الأسّين', true);
  }

  // Le recours des rationnels : on ne reconnaît aucune forme, mais la VALEUR
  // est une puissance. « 3⁷ × 2⁻⁴ / (3² × 2⁻⁹) » vaut 3⁵ × 2⁵, donc 6⁵.
  function parLesPremiersQ(item) {
    const q = ratDe(item.e);
    if (!q || q.n === 0n) return null;
    const pr = primitive(q);
    if (!pr || pr.exp < 2) return null;
    const etapes = [];
    etapes.push(['نحسب العبارة', 'A = ' + qTxt(q)]);
    // Le SIGNE ne se lit pas dans les facteurs premiers : « −1/2187 » n'est
    // pas « 3⁻⁷ ». Il doit être porté par la ligne, sinon elle est fausse.
    const signe = q.n < 0n ? '-' : '';
    etapes.push(['نفكّك إلى عوامل أوّلية',
                 qTxt(q) + ' = ' + signe
                 + pr.bases.map(b => puis(BigInt(b), pr.exps[b])).join(' × ')]);
    etapes.push(['أسّة كلّها مضاعفات لـ ' + pr.exp,
                 pr.bases.map(b => pr.exps[b]).join(' و ') + ' مضاعفات للعدد ' + pr.exp]);
    etapes.push(['نجمّع الأسّة', 'كلّ أسّ يُقسم على ' + pr.exp
                                 + '، و ما يبقى يكوّن الأساس']);
    etapes.push(['الأساس', qTxt(pr.base) + ' هو الأساس، و الأسّ ' + pr.exp]);
    etapes.push(['النتيجة', 'A = ' + puis(pr.base, pr.exp)]);
    return finir(item, etapes, puis(pr.base, pr.exp),
                 'مرّ بالعوامل الأوّلية: الأسّة تنكشف هناك', true);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // LES RÉELS — 9ème. La base n'est plus un rationnel : c'est √3, π, 2/√5.
  //
  // On ne cherche plus à la calculer, on la LIT. « (√3)² × (√3)⁻⁴ » a pour
  // base le texte « √3 », et la règle joue sur les exposants exactement comme
  // en 7ème. Ce qui change est seulement ce qu'on sait écrire.
  // ═══════════════════════════════════════════════════════════════════════
  function valDe(t) {
    try { const v = F.analyser(String(t)); return v; } catch (e) { return null; }
  }

  // Lecture d'une puissance dont la base peut être n'importe quel réel écrit.
  function ecriteR(t) {
    let s = String(t).trim();
    const m = /^([\s\S]*?)\^\s*\(?\s*(-?\d+)\s*\)?$/.exec(s);
    let baseTxt = (m ? m[1] : s).trim();
    const exp = m ? Number(m[2]) : 1;
    let garde = 0;
    while (garde++ < 6 && /^[([][\s\S]*[)\]]$/.test(baseTxt)) {
      let prof = 0, tout = true;
      for (let i = 0; i < baseTxt.length; i++) {
        const c = baseTxt[i];
        if (c === '(' || c === '[') prof++;
        else if (c === ')' || c === ']') { prof--; if (!prof && i < baseTxt.length - 1) tout = false; }
      }
      if (!tout) break;
      baseTxt = baseTxt.slice(1, -1).trim();
    }
    if (/\^/.test(baseTxt)) {
      const dessous = ecriteR(baseTxt);
      if (!dessous) return null;
      return { baseTxt: dessous.baseTxt, val: dessous.val,
               exp: dessous.exp * exp, etages: (dessous.etages || 0) + 1 };
    }
    if (/[()[\]×*+]/.test(baseTxt)) return null;
    const v = valDe(baseTxt);
    if (!v || Object.keys(v).length === 0) return null;
    return { baseTxt, val: v, exp };
  }

  // L'écriture d'une puissance d'un réel : « (√3)^-4 », « π^8 ».
  const puisR = (txt, e) => {
    const nu = /^[a-zA-Zπ]$|^\d+$/.test(txt);
    const t = nu ? txt : '(' + txt + ')';
    return e === 1 ? t : t + '^' + e;
  };

  function produitReel(item) {
    const fs = facteursDe(item.e);
    if (fs.length < 2) {
      // « ((√3)^-1)^-4 » : un seul facteur, mais à étages.
      const x = ecriteR(item.e);
      if (!x || x.exp === 0) return null;
      if (!x.etages) {
        // « (√6/√2)⁻⁶ » : rien à étager, mais la base se simplifie, et c'est
        // ce geste-là que l'exercice demande.
        const simple = F.ecrire(x.val);
        if (simple === x.baseTxt) return null;
        const et = [];
        et.push(['نبسّط الأساس', x.baseTxt + ' = ' + simple]);
        et.push(['الأساس تغيّر شكله لا قيمته',
                 'القوّة تبقى، و الأسّ هو ' + x.exp]);
        if (x.exp < 0) et.push(['أسّ سالب', REGLE_NEGATIF]);
        else et.push(['القاعدة', 'نكتب القوّة بالأساس المبسّط']);
        // « نعيد الكتابة » disait déjà ce que dit « النتيجة » : une relation
        // portée deux fois, donc deux étapes interchangeables.
        et.push(['النتيجة', 'A = ' + puisR(simple, x.exp)]);
        return finir(item, et, puisR(simple, x.exp), 'ابدأ بتبسيط الأساس', 'reelle');
      }
      const m = /^([\s\S]*?)\^\s*\(?\s*(-?\d+)\s*\)?$/.exec(item.e.trim());
      const dedans = m && ecriteR(m[1]);
      if (!dedans) return null;
      const etapes = [];
      etapes.push(['القاعدة', REGLE_PUIS]);
      etapes.push(['الأساس', 'الأساس هو ' + x.baseTxt]);
      etapes.push(['نضرب الأسّين',
                   '(' + dedans.exp + ') × (' + m[2] + ') = ' + x.exp]);
      etapes.push(['النتيجة', 'A = ' + puisR(x.baseTxt, x.exp)]);
      return finir(item, etapes, puisR(x.baseTxt, x.exp),
                   'قوّة القوّة: نضرب الأسّين', 'reelle');
    }
    const es = fs.map(ecriteR);
    if (es.some(x => !x)) return null;
    const ref = es[0];
    if (!es.every(x => F.memes(x.val, ref.val))) {
      // « (√2)⁶ × (√5)⁶ » : même exposant, bases différentes.
      const n = ref.exp;
      if (!es.every(x => x.exp === n) || n === 0 || n === 1) return null;
      let prod = es[0].val;
      for (let i = 1; i < es.length; i++) prod = F.fois(prod, es[i].val);
      const txt = F.ecrire(prod);
      const et = [];
      et.push(['نفس الأسّ', 'الأسّ هو ' + n + ' في كلّ العوامل']);
      et.push(['القاعدة', REGLE_MEME_EXP]);
      et.push(['نضرب الأساسات',
               es.map(x => x.baseTxt).join(' × ') + ' = ' + txt]);
      et.push(['النتيجة', 'A = ' + puisR(txt, n)]);
      return finir(item, et, puisR(txt, n), 'نفس الأسّ: نضرب الأساسات', 'reelle');
    }
    const somme = es.reduce((a, x) => a + x.exp, 0);
    if (somme === 0 || somme === 1) return null;
    const etapes = [];
    etapes.push(['القاعدة', REGLE_PRODUIT]);
    etapes.push(['نفس الأساس', 'الأساس هو ' + ref.baseTxt + ' في كلّ العوامل']);
    etapes.push(['نجمع الأسّة',
                 es.map(x => (x.exp < 0 ? '(' + x.exp + ')' : x.exp)).join(' + ')
                 + ' = ' + somme]);
    if (somme < 0) etapes.push(['أسّ سالب', REGLE_NEGATIF]);
    etapes.push(['النتيجة', 'A = ' + puisR(ref.baseTxt, somme)]);
    return finir(item, etapes, puisR(ref.baseTxt, somme),
                 'نفس الأساس: نجمع الأسّة', 'reelle');
  }

  function quotientReel(item) {
    const parts = couper(item.e, '/:').map(x => x.t);
    if (parts.length !== 2) return null;
    const h = ecriteR(parts[0]), b = ecriteR(parts[1]);
    if (!h || !b) return null;
    if (F.memes(h.val, b.val)) {
      const diff = h.exp - b.exp;
      if (diff === 0 || diff === 1) return null;
      const etapes = [];
      etapes.push(['القاعدة', REGLE_QUOTIENT]);
      etapes.push(['نفس الأساس', 'الأساس هو ' + h.baseTxt + ' في البسط و المقام']);
      etapes.push(['نطرح الأسّين', h.exp + ' - (' + b.exp + ') = ' + diff]);
      if (diff < 0) etapes.push(['أسّ سالب', REGLE_NEGATIF]);
      etapes.push(['النتيجة', 'A = ' + puisR(h.baseTxt, diff)]);
      return finir(item, etapes, puisR(h.baseTxt, diff),
                   'نفس الأساس: نطرح الأسّين', 'reelle');
    }
    // Mêmes exposants, bases différentes : « (√6)⁷ / (√2)⁷ = (√3)⁷ ».
    if (h.exp !== b.exp || h.exp === 0) return null;
    const q = F.divise(h.val, b.val);
    const txt = F.ecrire(q);
    const etapes = [];
    etapes.push(['نفس الأسّ', 'الأسّ هو ' + h.exp + ' في البسط و المقام']);
    etapes.push(['القاعدة', 'a^n : b^n = (a : b)^n']);
    // « 343/125 : 25/49 » se lit ((343/125)/25)/49 : il faut envelopper.
    const env2 = t => (/[/:]/.test(t) ? '(' + t + ')' : t);
    etapes.push(['نقسم الأساسين',
                 env2(h.baseTxt) + ' : ' + env2(b.baseTxt) + ' = ' + env2(txt)]);
    etapes.push(['النتيجة', 'A = ' + puisR(txt, h.exp)]);
    return finir(item, etapes, puisR(txt, h.exp), 'نفس الأسّ: نقسم الأساسين', 'reelle');
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CONJUGUÉS — le sommet du chapitre de 9ème, et le seul endroit où l'on
  // calcule (√3 + √2)¹⁴ × (√3 − √2)¹⁵ sans écrire un seul grand nombre.
  //
  // Développer serait une faute de méthode autant qu'une faute de patience :
  // (2 − √3)¹⁰¹ compte cent-quinze chiffres, et la feuille demande une ligne.
  // Ce qui la donne, c'est que (a − b)(a + b) = a² − b² vaut 1 : les deux
  // puissances s'annulent DEUX À DEUX, et il ne reste que le surplus.
  //
  // On ne fait donc pas confiance à la forme — on VÉRIFIE que le produit des
  // deux bases est rationnel, et l'on ne parle de conjugués qu'après.
  // ═══════════════════════════════════════════════════════════════════════

  // Ôte les parenthèses qui ENVELOPPENT tout — et elles seules :
  // « ((2+√3)^25) » se dépouille, « (a)(b) » ne se dépouille pas.
  function peler(t) {
    let s = String(t).trim(), garde = 0;
    while (garde++ < 8 && /^[([][\s\S]*[)\]]$/.test(s)) {
      let prof = 0, tout = true;
      for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (c === '(' || c === '[') prof++;
        else if (c === ')' || c === ']') { prof--; if (!prof && i < s.length - 1) tout = false; }
      }
      if (!tout) break;
      s = s.slice(1, -1).trim();
    }
    return s;
  }

  // APLATIT un produit-quotient de puissances en couples (base écrite, exposant).
  // Trois choses s'y font, qui manquaient à ecriteR :
  //   — la base a le droit d'être une SOMME : « √3 + √2 » est le sujet même ;
  //   — le dénominateur compte à l'envers : « X¹⁰³ : X² » donne 103 et −2 ;
  //   — la puissance d'un PRODUIT se distribue : « (a² × b)³ » donne a⁶ et b³.
  // On ne distribue que si le produit est écrit avec des parenthèses : sans
  // elles, « 3/2 √2 + 4 » se ferait couper en deux, et ce serait un massacre.
  function aplatirC(e, mult, out, prof) {
    if ((prof || 0) > 8) return false;
    for (const f of couper(e, '×*')) {
      const morceaux = couper(f.t, '/:');
      if (!morceaux.length) return false;
      for (let i = 0; i < morceaux.length; i++) {
        const sens = mult * (i ? -1 : 1);
        const t = morceaux[i].t.trim();
        const m = /^([\s\S]*?)\^\s*\(?\s*(-?\d+)\s*\)?$/.exec(t);
        const base = peler((m ? m[1] : t).trim());
        const exp = m ? Number(m[2]) : 1;
        const compose = /[()]/.test(base)
                     && (couper(base, '×*').length > 1 || couper(base, '/:').length > 1);
        if (compose || /\^/.test(base)) {
          if (!aplatirC(base, sens * exp, out, (prof || 0) + 1)) return false;
          continue;
        }
        if (/[()[\]]/.test(base)) return false;     // une base reste une base
        const v = valDe(base);
        if (!v || !Object.keys(v).length) return false;
        out.push({ baseTxt: base, val: v, exp: sens * exp });
      }
    }
    return true;
  }

  // Rassemble les couples par base écrite : un même conjugué peut paraître
  // deux fois — au numérateur et au dénominateur —, et l'on dira qu'on l'a
  // rassemblé plutôt que de le faire en douce.
  function grouper(lus) {
    const bases = [];
    for (const x of lus) {
      const d = bases.find(b => b.baseTxt === x.baseTxt);
      if (d) { d.exp += x.exp; d.parts.push(x.exp); }
      else bases.push({ baseTxt: x.baseTxt, val: x.val, exp: x.exp, parts: [x.exp] });
    }
    return bases;
  }

  function conjugues(item) {
    if (termesDe(item.e).length > 1) return null;    // une somme : autre chaîne
    const lus = [];
    if (!aplatirC(item.e, 1, lus, 0) || lus.length < 2) return null;
    const bases = grouper(lus);
    if (bases.length !== 2) return null;
    const [u, w] = bases;
    if (u.exp < 1 || w.exp < 1) return null;
    if (F.memes(u.val, w.val)) return null;              // même base : autre chaîne

    // LE CONTRÔLE. Le produit des deux bases doit être un RATIONNEL — c'est
    // cela, être conjugués, et rien d'autre. Deux radicaux qui se ressemblent
    // ne le sont pas forcément.
    const prod = F.fois(u.val, w.val);
    const cle = Object.keys(prod);
    if (cle.length !== 1 || Object.keys(prod[cle[0]].e).length) return null;
    const q = F.ecrire(prod);
    if (q === '0') return null;

    // LE PRODUIT NU — « احسب (A−B)(A+B) ، ماذا تستنتج ؟ ». C'est la question
    // dont tout le reste découle, et elle ne se démontre pas en séparant des
    // exposants : elle se démontre par l'identité, appliquée aux deux morceaux
    // de la base. On repère celui qui est écrit avec un moins — a − b —, et
    // l'on VÉRIFIE que l'autre vaut bien a + b avant de dire quoi que ce soit.
    if (u.exp === 1 && w.exp === 1) {
      const cand = [[w, u], [u, w]];
      for (const [moins, plus] of cand) {
        const ms = termesDe(moins.baseTxt);
        if (ms.length !== 2 || ms[1].signe !== '-') continue;
        const a = ms[0].t, b = ms[1].t;
        const va = valDe(a), vb = valDe(b);
        if (!va || !vb) continue;
        if (!F.memes(plus.val, F.plus(va, vb))) continue;
        const ca = F.analyser('(' + a + ')^2'), cb = F.analyser('(' + b + ')^2');
        const et = [];
        et.push(['المتطابقة', '(a - b)(a + b) = a^2 - b^2']);
        et.push(['نحدّد a و b', 'a = ' + a + '، و b = ' + b]);
        et.push(['نطبّق المتطابقة',
                 '(' + moins.baseTxt + ') × (' + plus.baseTxt + ') = ('
                 + a + ')^2 - (' + b + ')^2']);
        et.push(['نحسب المربّعين',
                 '(' + a + ')^2 = ' + F.ecrire(ca) + '، و (' + b + ')^2 = '
                 + F.ecrire(cb)]);
        et.push(['النتيجة', 'A = ' + q]);
        return finir(item, et, q, 'لا تنشر: استعمل (a−b)(a+b) = a²−b²', false);
      }
      return null;
    }

    const m = Math.min(u.exp, w.exp);
    const reste = u.exp > w.exp ? u : w;
    const diff = Math.abs(u.exp - w.exp);
    if (m < 1) return null;

    const etapes = [];
    bases.forEach(b => {
      if (b.parts.length > 1) {
        etapes.push(['نجمع أسّ ' + b.baseTxt,
                     b.parts.map(e => (e < 0 ? '(' + e + ')' : e)).join(' + ')
                     + ' = ' + b.exp]);
      }
    });
    etapes.push(['العددان مترافقان', '(a - b)(a + b) = a^2 - b^2']);
    etapes.push(['نحسب جداء الأساسين',
                 '(' + u.baseTxt + ') × (' + w.baseTxt + ') = ' + q]);
    etapes.push(['نفصل ما يتقابل',
                 puisR(u.baseTxt, u.exp) + ' × ' + puisR(w.baseTxt, w.exp)
                 + ' = ((' + u.baseTxt + ') × (' + w.baseTxt + '))^' + m
                 + (diff ? ' × ' + puisR(reste.baseTxt, diff) : '')]);
    etapes.push(['نعوّض بالجداء',
                 '((' + u.baseTxt + ') × (' + w.baseTxt + '))^' + m
                 + ' = ' + puisR(q, m)]);
    // Quand le produit vaut 1, la puissance entière disparaît : c'est le tour
    // de force de l'exercice, et il mérite sa ligne.
    const valQ = F.analyser(q);
    const un = F.ecrire(valQ) === '1';
    if (un) etapes.push(['قوّة العدد 1', puisR(q, m) + ' = 1']);

    const v = valDe(item.e);
    if (!v) return null;
    const res = F.ecrire(v);
    const avant = (un ? '' : puisR(q, m) + (diff ? ' × ' : ''))
                + (diff ? puisR(reste.baseTxt, diff) : (un ? '1' : ''));
    // « A = (√3 − √2) » puis « A = √3 − √2 » : deux étapes pour une seule
    // relation. Les parenthèses ne comptent pas comme un geste.
    const nu = avant.replace(/^\(([\s\S]*)\)$/, '$1').trim();
    if (avant && nu !== res) etapes.push(['ما بقي', 'A = ' + avant]);
    etapes.push(['النتيجة', 'A = ' + res]);
    if (etapes.length < 5) return null;
    return finir(item, etapes, res,
                 'لا تنشر: احسب جداء الأساسين أوّلا', false);
  }

  // « E²⁰¹⁶F²⁰¹⁵ − E²⁰¹⁵F²⁰¹⁶ » : les mêmes conjugués, mais dans une DIFFÉRENCE.
  // On ne peut plus apparier facteur à facteur ; on sort (EF)²⁰¹⁵ des deux
  // termes, et il ne reste que E − F. C'est la mise en facteur de la 8ème,
  // rejouée avec des nombres qu'on ne saurait pas écrire.
  function conjuguesSomme(item) {
    const ts = termesDe(item.e);
    if (ts.length < 2) return null;
    let U = null, W = null;
    const lignes = [];
    for (const t of ts) {
      const lus = [];
      if (!aplatirC(t.t, 1, lus, 0)) return null;
      const map = grouper(lus);
      if (map.length !== 2) return null;
      if (!U) { U = map[0]; W = map[1]; }
      const eu = map.find(b => b.baseTxt === U.baseTxt);
      const ew = map.find(b => b.baseTxt === W.baseTxt);
      if (!eu || !ew || eu.exp < 0 || ew.exp < 0) return null;
      lignes.push({ signe: t.signe, nu: eu.exp, nw: ew.exp });
    }
    if (F.memes(U.val, W.val)) return null;

    const prod = F.fois(U.val, W.val);
    const cle = Object.keys(prod);
    if (cle.length !== 1 || Object.keys(prod[cle[0]].e).length) return null;
    const q = F.ecrire(prod);
    if (q === '0') return null;

    let m = Infinity;
    for (const l of lignes) m = Math.min(m, l.nu, l.nw);
    if (m < 1) return null;

    // Ce qui reste dans la parenthèse, terme à terme.
    const morceau = l => {
      const a = l.nu - m, b = l.nw - m;
      const p = [];
      if (a) p.push(puisR(U.baseTxt, a));
      if (b) p.push(puisR(W.baseTxt, b));
      return p.length ? p.join(' × ') : '1';
    };
    const dedans = lignes.map((l, i) => (i ? l.signe + ' ' : '') + morceau(l)).join(' ');
    const vDedans = valDe(dedans);
    if (!vDedans) return null;
    const txtDedans = F.ecrire(vDedans);

    const commun = '((' + U.baseTxt + ') × (' + W.baseTxt + '))^' + m;
    const etapes = [];
    etapes.push(['العددان مترافقان', '(a - b)(a + b) = a^2 - b^2']);
    etapes.push(['نحسب جداء الأساسين',
                 '(' + U.baseTxt + ') × (' + W.baseTxt + ') = ' + q]);
    etapes.push(['العامل المشترك',
                 'كلّ حدّ يحتوي ' + commun + '، لأنّ أصغر أسّ هو ' + m]);
    etapes.push(['نُخرج العامل المشترك', 'A = ' + commun + ' × (' + dedans + ')']);
    etapes.push(['نعوّض بالجداء', commun + ' = ' + puisR(q, m)]);
    const valQ = F.analyser(q);
    const un = F.ecrire(valQ) === '1';
    if (un) etapes.push(['قوّة العدد 1', puisR(q, m) + ' = 1']);
    etapes.push(['ننجز القوس', dedans + ' = ' + txtDedans]);

    const v = valDe(item.e);
    if (!v) return null;
    const res = F.ecrire(v);
    if (!un) {
      etapes.push(['ما بقي', 'A = ' + puisR(q, m) + ' × (' + txtDedans + ')']);
    }
    etapes.push(['النتيجة', 'A = ' + res]);
    return finir(item, etapes, res,
                 'أخرج جداء المترافقين، و لا تنشر شيئا', false);
  }

  // Le grand calcul de 9ème : on évalue chaque morceau, puis on combine. Le
  // noyau sait tout faire — radicaux, π, conjugués — et rien n'est approché.
  function calculReel(item) {
    const v = valDe(item.e);
    if (!v) return null;
    // Une SOMME se traite terme à terme ; un PRODUIT, facteur par facteur.
    // C'est le même geste — isoler ce qu'on sait calculer — et les feuilles de
    // 9ème mêlent les deux sans prévenir.
    let ts = termesDe(item.e);
    const somme = ts.length > 1;
    if (!somme) {
      ts = facteursDe(item.e).map(t => ({ t, signe: '×' }));
      if (ts.length < 2) {
        // Un QUOTIENT dont les deux étages sont eux-mêmes des produits :
        // « (−3 × 2³)³ / (8 × 9)² ». On calcule le haut, puis le bas.
        const parts = couper(item.e, '/:').map(x => x.t);
        if (parts.length !== 2) return null;
        const vh = valDe(parts[0]), vb = valDe(parts[1]);
        if (!vh || !vb || !Object.keys(vb).length) return null;
        const et = [];
        et.push(['نحدّد الأولوية', 'نحسب البسط، ثمّ المقام، ثمّ نقسم']);
        et.push(['البسط', parts[0] + ' = ' + F.ecrire(vh)]);
        et.push(['المقام', parts[1] + ' = ' + F.ecrire(vb)]);
        et.push(['نقسم', '(' + F.ecrire(vh) + ') : (' + F.ecrire(vb) + ') = ('
                         + F.ecrire(v) + ')']);
        et.push(['النتيجة', 'A = ' + F.ecrire(v)]);
        return finir(item, et, F.ecrire(v), 'احسب البسط و المقام، ثمّ اقسم', false);
      }
    }
    const etapes = [];
    etapes.push(['نحدّد الأولوية', somme
                 ? 'كلّ حدّ على حدة، ثمّ نجمع — و القوى قبل الضرب'
                 : 'كلّ عامل على حدة، ثمّ نضرب — و القوى قبل الضرب']);
    const vals = [];
    for (const t of ts) {
      const x = valDe(t.t);
      if (!x) return null;
      vals.push(x);
      // « 1/4⁵ + 1/4⁵ + 1/4⁵ + 1/4⁵ » : quatre termes identiques. On ne calcule
      // qu'une fois — répéter la même ligne quatre fois n'est pas une chaîne.
      const ligneT = t.t + ' = ' + F.ecrire(x);
      if (etapes.some(e => e[1] === ligneT)) continue;
      etapes.push([(somme ? 'نحسب الحدّ « ' : 'نحسب العامل « ') + t.t + ' »', ligneT]);
    }
    // « − (5 + 2√6) » ne s'écrit pas « − 5 + 2√6 » : un terme composé doit
    // garder ses parenthèses quand un signe le précède. Et dans un PRODUIT,
    // c'est vrai de TOUS les facteurs, le premier compris : « (3 − 2√2)(6 + 4√2) »
    // ne devient pas « 3 − 2√2 × (6 + 4√2) », qui ne vaut plus la même chose.
    const env3 = x => (/[+\-]\s/.test(x) ? '(' + x + ')' : x);
    const ligne = ts.map((t, i) => {
      const x = F.ecrire(vals[i]);
      if (!i) return somme ? x : env3(x);
      return t.signe + ' ' + env3(x);
    }).join(' ');
    // Quand la ligne réécrite dit DÉJÀ le résultat — « 2√2 − 1/3 » une fois
    // chaque terme calculé —, on ne la porte pas deux fois. La chaîne s'arrête
    // sur la conclusion, et elle reste une chaîne : chaque terme y a été
    // calculé pour lui-même, ce qui est le geste demandé.
    const doublon = (ligne === F.ecrire(v));
    if (!doublon) etapes.push(['نعيد كتابة العبارة', 'A = ' + ligne]);
    etapes.push(['النتيجة', 'A = ' + F.ecrire(v)]);
    if (etapes.length < (doublon && ts.length > 1 ? 4 : 5)) return null;
    return finir(item, etapes, F.ecrire(v),
                 'احسب كلّ حدّ وحده، ثمّ اجمع', false);
  }

  // ── Commun ──────────────────────────────────────────────────────────────
  // L'écriture d'une puissance : « 3^7 », « (3/7)^-9 », « (-2/3)^3 ». Les
  // parenthèses ne sont pas décoratives — « -2/3^3 » ne veut pas dire la même
  // chose, et « 3/7^-9 » non plus.
  function puis(b, e) {
    const q = (typeof b === 'object' && b !== null && 'n' in b)
            ? b : Q(BigInt(b), 1n);
    const s = qTxt(q);
    const nu = qEntier(q) && q.n >= 0n;
    const t = nu ? s : '(' + s + ')';
    return e === 1 ? t : t + '^' + e;
  }

  function finir(item, etapes, res, indice, forme) {
    // UN EXERCICE LIÉ porte son préambule : les nombres y sont NOMMÉS, et la
    // question se pose sur les noms — « a × b » — alors que la chaîne travaille
    // sur ce qu'ils valent. L'élève voit donc l'énoncé du maître, et la
    // démonstration porte sur l'expression réelle.
    const tete = item.defs
      ? [item.defs, (forme ? 'أكتب في صيغة قوّة لعدد حقيقي: ' : 'أحسب: ')
                    + item.nom + ' = ' + item.e]
      : [forme ? 'أكتب في صيغة قوّة لعدد صحيح طبيعي:' : 'أحسب:', 'A = ' + item.e];
    return {
      enonce: tete,
      indice,
      etapes,
      res,
      source: item.src,
      lie: item.defs || null,
      controle: { type: 'valeur', expr: item.e, res,
                  forme: forme === 'reelle' ? 'reelle'
                       : forme ? 'puissance' : undefined }
    };
  }

  // Chaque famille sait quel constructeur l'écrit.
  // Une famille peut avoir PLUSIEURS chemins : on prend le premier qui aboutit.
  // « 16000 × 5⁴ » ressemble à un produit, mais seule la voie des facteurs
  // premiers en vient à bout.
  const PAR_FAMILLE = {
    'produit': [produit, memeExposant, parLesPremiersQ, parLesPremiers],
    'base-commune': [produit, parLesPremiers, parLesPremiersQ, memeExposant],
    'puissance-de-puissance': [produit, memeExposant, parLesPremiersQ, parLesPremiers],
    'meme-exposant': [memeExposant, produit, parLesPremiersQ, parLesPremiers],
    'facteur-commun': [facteurCommun, parLesPremiers],
    'decomposer': [decomposer],
    'puissance-reelle': [produitReel, quotientReel, calculReel],
    'conjugues': [conjugues, conjuguesSomme, calculReel],
    'calcul-reel': [calculReel],
    'quotient': [quotient, parLesPremiersQ, parLesPremiers, quotientReel, calculReel],
    'calcul': [calcul]
  };

  // Rend la chaîne d'un item, ou null si l'énoncé sort de ce que la famille
  // sait démontrer — auquel cas le validateur le dira, et on ira le relire.
  function chaine(item) {
    const voies = PAR_FAMILLE[item.f];
    if (!voies) return null;
    for (const f of voies) {
      let q = null;
      try { q = f(item); } catch (e) { q = null; }
      if (q && q.etapes.length >= 4) return q;
    }
    return null;
  }

  const API = { chaine, produit, memeExposant, facteurCommun, calcul, quotient,
                produitReel, quotientReel, calculReel, conjugues, conjuguesSomme,
                parLesPremiersQ,
                decomposer, parLesPremiers, baseCommune };
  if (M) module.exports = API; else racine.Chaines = API;
})(typeof window !== 'undefined' ? window : globalThis);
