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

  // ── Découpe respectant les parenthèses ──────────────────────────────────
  function couper(s, seps) {
    const out = []; let prof = 0, debut = 0;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === '(') prof++;
      else if (c === ')') prof--;
      else if (prof === 0 && seps.indexOf(c) >= 0 && i > debut) {
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

  // ── Base primitive d'un entier : 144 → (12, 2), 216 → (6, 3), 7 → (7, 1) ──
  const bpgcd = (a, b) => { while (b) { const t = a % b; a = b; b = t; } return a; };

  function primitive(v) {
    const f = F.facteurs(v);
    const bases = Object.keys(f);
    if (!bases.length) return null;                 // 1 n'a pas de base
    let g = 0;
    for (const b of bases) g = bpgcd(g, f[b]);
    let base = 1n;
    for (const b of bases) base *= BigInt(b) ** BigInt(f[b] / g);
    return { base: base, exp: g };
  }

  // La valeur entière d'un facteur écrit — « (7^4)^3 » vaut 7^12. On la garde
  // en BigInt : ces nombres passent allègrement le milliard.
  function entier(texte) {
    const v = F.analyser(texte);
    const ks = Object.keys(v);
    // Zéro n'a AUCUN terme, pas un terme nul : « 35¹⁷ × 0³³ » vaut 0, et sans
    // ce cas il passait pour illisible.
    if (!ks.length) return 0n;
    if (ks.length !== 1) return null;
    const t = v[ks[0]];
    if (Object.keys(t.e).length) return null;       // il reste un radical
    if (t.c.d !== 1n) return null;                  // ce n'est pas un entier
    return t.c.n;
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
    if (!vrais.every(x => x.pr.base === b)) return null;
    return { base: b, infos };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PRODUIT DE PUISSANCES — la même chaîne sert « 2³ × 2⁴ », « 16 × 2⁷ × 32 »
  // et « (7⁴)³ × (7²)³ » : ce qui change est ce qu'il faut d'abord reconnaître.
  // ═══════════════════════════════════════════════════════════════════════
  function produit(item) {
    const fs = facteursDe(item.e);
    const bc = baseCommune(fs);
    if (!bc) return null;
    const b = bc.base.toString();
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
    const ecritTelQuel = x => new RegExp('^' + b + '(\\^\\d+)?$').test(x.t.replace(/\s/g, ''));
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
      etapes.push(['نلاحظ', 'كلّ العوامل قوى للعدد ' + b]);
    } else if (!aEtages) {
      // Rien à reconnaître : reste le constat, qui est le geste même de la
      // règle — c'est parce que l'ASSISE est la même qu'on a le droit
      // d'additionner les exposants.
      etapes.push(['نفس الأساس', 'الأساس هو ' + b + ' في العاملين']);
    }
    aReconnaitre.forEach(x => {
      if (/\)\s*\^/.test(x.t)) return;                       // déjà traité
      etapes.push(['نكتب ' + x.t + ' بالأساس ' + b, x.t + ' = ' + puis(b, x.exp)]);
    });
    if (bc.infos.some(x => x.exp === 1) || bc.infos.some(x => x.exp === 0)) {
      etapes.push(['الأسّ الضمني', 'العدد ' + b + ' هو ' + b + '^1، و ' + b + '^0 يساوي 1']);
    }
    if (aReconnaitre.length || aEtages) {
      etapes.push(['نعيد كتابة العبارة', 'A = ' + bc.infos.map(x => puis(b, x.exp)).join(' × ')]);
    }
    etapes.push([aEtages ? 'القاعدة الثانية' : 'القاعدة', REGLE_PRODUIT]);
    const somme = bc.infos.reduce((a, x) => a + x.exp, 0);
    etapes.push(['نجمع الأسّة', bc.infos.map(x => x.exp).join(' + ') + ' = ' + somme]);
    const res = puis(b, somme);
    etapes.push(['النتيجة', 'A = ' + res]);

    return finir(item, etapes, res, 'نفس الأساس: نجمع الأسّة', true);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MÊME EXPOSANT — « 3⁴ × 25² » : il faut d'abord ramener au même exposant,
  // et pour cela lire 25² comme 5⁴. L'exposant commun est le pgcd des
  // exposants maximaux ; les bases s'en déduisent.
  // ═══════════════════════════════════════════════════════════════════════
  function memeExposant(item) {
    const fs = facteursDe(item.e);
    if (fs.length < 2) return null;
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
    infos.forEach(x => { x.base = x.pr.base ** BigInt(x.pr.exp / n); });

    const etapes = [];
    const aRamener = infos.filter(x => x.pr.exp !== n || x.pr.base !== x.base);
    aRamener.forEach(x => {
      etapes.push(['نعيد كتابة ' + x.t, x.t + ' = ' + puis(x.base.toString(), n)]);
    });
    etapes.push(['نفس الأسّ الآن', 'الأسّ هو ' + n + ' في كلّ العوامل']);
    etapes.push(['القاعدة', REGLE_MEME_EXP]);
    let prod = 1n;
    infos.forEach(x => { prod *= x.base; });
    etapes.push(['نضرب الأساسات', infos.map(x => x.base.toString()).join(' × ') + ' = ' + prod]);
    const res = puis(prod.toString(), n);
    etapes.push(['النتيجة', 'A = ' + res]);

    return finir(item, etapes, res, 'نفس الأسّ: نضرب الأساسات', true);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // FACTEUR COMMUN — « 3⁵ × 15 − 6 × 3⁵ ». On sort la puissance commune, on
  // calcule la parenthèse, et l'on découvre qu'elle est elle aussi une
  // puissance de la même base : tout retombe sur une seule.
  // ═══════════════════════════════════════════════════════════════════════
  function facteurCommun(item) {
    const ts = termesDe(item.e);
    // « 2⁶ + 2⁶ + 2⁶ + 2⁶ » en a quatre, « 3⁵ × 15 − 6 × 3⁵ » en a deux :
    // la mise en facteur ne connaît pas ce nombre-là.
    if (ts.length < 2) return null;

    const vals = ts.map(x => entier(x.t));
    if (vals.some(v => v === null || v <= 0n)) return null;
    const parts = ts.map(x => facteursDe(x.t).map(u => ({ u, v: entier(u) })));
    if (parts.some(p => p.some(x => x.v === null))) return null;

    // Le facteur commun : présent dans TOUS les termes, et l'on préfère celui
    // qui est écrit comme une puissance — c'est lui que la leçon vise.
    let commun = null;
    for (const a of parts[0]) {
      if (a.v <= 1n) continue;
      if (!parts.every(p => p.some(x => x.v === a.v))) continue;
      if (!commun || (/\^/.test(a.u) && !/\^/.test(commun.u)) || a.v > commun.v) commun = a;
    }
    if (!commun) return null;

    const reste = parts.map(p => {
      const c = p.slice();
      const i = c.findIndex(x => x.v === commun.v);
      if (i < 0) return null;
      c.splice(i, 1);
      return c.length ? c : [{ u: '1', v: 1n }];
    });
    if (reste.some(r => r === null)) return null;

    const morceaux = reste.map(r => r.reduce((a, x) => a * x.v, 1n));
    let dedans = morceaux[0];
    for (let i = 1; i < ts.length; i++) {
      dedans = ts[i].signe === '-' ? dedans - morceaux[i] : dedans + morceaux[i];
    }
    if (dedans <= 0n) return null;

    // La base du résultat n'est PAS celle du facteur commun, et c'est là toute
    // la beauté de ces items : « 11 × 5³ − 3 × 5³ » donne 5³ × 8, qui vaut 1000,
    // c'est-à-dire 10³. « 3⁴ × 13 + 3 × 3⁴ » donne 81 × 16 = 1296 = 6⁴. On lit
    // donc la base sur le PRODUIT final, pas sur l'un de ses facteurs.
    const prC = primitive(commun.v), prD = primitive(dedans);
    if (!prC || !prD) return null;
    const total = commun.v * dedans;
    const prT = primitive(total);
    if (!prT || prT.exp < 2) return null;
    const b = prT.base.toString();

    const etapes = [];
    etapes.push(['العامل المشترك',
                 'العامل المشترك هو ' + commun.u + '، و هو موجود في كلّ الحدود']);
    const dansLeQuoi = reste.map((r, i) =>
      (i ? ts[i].signe + ' ' : '') + r.map(x => x.u).join(' × ')).join(' ');
    etapes.push(['نُخرج العامل المشترك', 'A = ' + commun.u + ' × (' + dansLeQuoi + ')']);
    etapes.push(['ننجز القوس', dansLeQuoi + ' = ' + dedans]);
    etapes.push(['نعيد الكتابة', 'A = ' + commun.u + ' × ' + dedans]);
    // Deux chemins selon que la base commune est celle du facteur ou non.
    const res = puis(b, prT.exp);
    if (prC.base === prT.base && prD.base === prT.base) {
      if (dedans.toString() !== puis(b, prD.exp)) {
        etapes.push(['نلاحظ', 'العدد ' + dedans + ' هو ' + puis(b, prD.exp)]);
      }
      if (commun.u.replace(/\s/g, '') !== puis(b, prC.exp)) {
        etapes.push(['و العامل المشترك', commun.u + ' = ' + puis(b, prC.exp)]);
      }
      etapes.push(['القاعدة', REGLE_PRODUIT]);
      etapes.push(['نجمع الأسّين', prC.exp + ' + ' + prD.exp + ' = ' + prT.exp]);
    } else {
      // Le facteur commun et la parenthèse n'ont pas la même base : c'est leur
      // PRODUIT qui est une puissance, et d'une troisième base.
      etapes.push(['نحسب الجداء', commun.u + ' × ' + dedans + ' = ' + total]);
      etapes.push(['نفكّك النتيجة', total + ' = ' + puis(b, prT.exp)]);
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
    const nu = /^\s*(\d+)\s*\^\s*(\d+)\s*$/.exec(item.e);
    if (nu) {
      const [, b, n] = nu;
      const val = entier(item.e);
      if (val === null) return null;
      if (Number(n) === 0) {
        etapes.push(['القاعدة', 'كلّ عدد غير منعدم مرفوع للأسّ 0 يساوي 1']);
        etapes.push(['لماذا', 'لأنّ ' + b + '^n : ' + b + '^n = 1، و هو أيضا ' + b + '^(n-n)']);
        etapes.push(['نطبّق', 'A = ' + b + '^0']);
        etapes.push(['النتيجة', 'A = 1']);
      } else {
        etapes.push(['القاعدة', 'a^n هو جداء n عاملا كلّها a']);
        etapes.push(['ما معنى ذلك',
                     b + '^' + n + ' = ' + Array(Number(n)).fill(b).join(' × ')]);
        etapes.push(['نحسب', Array(Number(n)).fill(b).join(' × ') + ' = ' + val]);
        etapes.push(['النتيجة', 'A = ' + val]);
      }
      return finir(item, etapes, String(val), 'ارجع إلى تعريف القوّة', false);
    }

    const vu = new Set([e]);
    etapes.push(['نحدّد الأولوية', 'الأقواس أوّلا، ثمّ القوى، ثمّ الضرب و القسمة، ثمّ الجمع و الطرح']);

    for (let garde = 0; garde < 12; garde++) {
      const suivant = reduire(e);
      if (!suivant || suivant === e || vu.has(suivant)) break;
      vu.add(suivant);
      etapes.push([libelle(e, suivant), e + ' = ' + suivant]);
      e = suivant;
    }
    const val = entier(item.e);
    if (val === null) return null;
    if (String(val) !== e) etapes.push(['ننجز آخر عملية', e + ' = ' + val]);
    etapes.push(['النتيجة', 'A = ' + val]);
    if (etapes.length < 4) return null;
    return finir(item, etapes, String(val), 'القوى قبل الضرب، و الضرب قبل الجمع', false);

    // Un seul cran de réduction : la parenthèse la plus profonde, sinon toutes
    // les puissances, sinon tous les produits, sinon la somme.
    function reduire(s) {
      const par = /\(([^()]+)\)/.exec(s);
      if (par) {
        // Une parenthèse ne tombe pas d'un coup : on y applique d'abord un cran
        // de priorité, et elle ne disparaît que devenue un nombre. Sinon
        // « (8 + 5 × 3)^2 » se réglerait en une ligne, et l'élève ne verrait
        // jamais que le produit passe avant la somme.
        const dedans = par[1].trim();
        if (!/^\d+$/.test(dedans)) {
          const mieux = reduire(dedans);
          if (!mieux) return null;
          return (s.slice(0, par.index) + '(' + mieux + ')'
                  + s.slice(par.index + par[0].length)).trim();
        }
        return (s.slice(0, par.index) + dedans + s.slice(par.index + par[0].length)).trim();
      }
      if (/\d\s*\^\s*\d/.test(s)) {
        return s.replace(/(\d+)\s*\^\s*(\d+)/g, (m) => String(entier(m)));
      }
      if (/×|\*/.test(s)) {
        return couper(s, '+-').map((x, i, t) => {
          const v = entier(x.t);
          return (i ? t[i - 1].op + ' ' : '') + v;
        }).join(' ');
      }
      // Il ne reste qu'une somme : c'est le dernier cran, et il sert surtout
      // À L'INTÉRIEUR d'une parenthèse — « (4 + 12)^2 » ne se réduit pas sans lui.
      if (/[+\-]/.test(s)) {
        const v = entier(s);
        return v === null ? null : String(v);
      }
      return null;
    }
    function libelle(avant, apres) {
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
                                + ' = ' + pr.base]);
    const res = puis(pr.base.toString(), pr.exp);
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
                 bases.map(b => puis(b, f[b] / pr.exp)).join(' × ') + ' = ' + pr.base]);
    const res = puis(pr.base.toString(), pr.exp);
    etapes.push(['النتيجة', 'A = ' + res]);
    return finir(item, etapes, res, 'مرّ بالعوامل الأوّلية: الأسّة تنكشف هناك', true);
  }

  // ── Commun ──────────────────────────────────────────────────────────────
  const puis = (b, e) => (e === 1 ? String(b) : b + '^' + e);

  function finir(item, etapes, res, indice, forme) {
    return {
      enonce: [forme ? 'أكتب في صيغة قوّة لعدد صحيح طبيعي:' : 'أحسب:', 'A = ' + item.e],
      indice,
      etapes,
      res,
      source: item.src,
      controle: { type: 'valeur', expr: item.e, res,
                  forme: forme ? 'puissance' : undefined }
    };
  }

  // Chaque famille sait quel constructeur l'écrit.
  // Une famille peut avoir PLUSIEURS chemins : on prend le premier qui aboutit.
  // « 16000 × 5⁴ » ressemble à un produit, mais seule la voie des facteurs
  // premiers en vient à bout.
  const PAR_FAMILLE = {
    'produit': [produit, parLesPremiers],
    'base-commune': [produit, parLesPremiers, memeExposant],
    'puissance-de-puissance': [produit, parLesPremiers],
    'meme-exposant': [memeExposant, produit, parLesPremiers],
    'facteur-commun': [facteurCommun, parLesPremiers],
    'decomposer': [decomposer],
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

  const API = { chaine, produit, memeExposant, facteurCommun, calcul,
                decomposer, parLesPremiers, baseCommune };
  if (M) module.exports = API; else racine.Chaines = API;
})(typeof window !== 'undefined' ? window : globalThis);
