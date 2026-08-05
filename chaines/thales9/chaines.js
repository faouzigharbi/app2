// DE LA SCÈNE À LA CHAÎNE.
//
// Un item décrit une SCÈNE : des points exacts, ce que l'énoncé donne, ce
// qu'il demande. Ce fichier en tire la démonstration — et rien d'autre : les
// énoncés sont dans items.js, relevés sur les feuilles.
//
// LE DESSIN EST SCHÉMATIQUE, LES COORDONNÉES NE LE SONT PAS. Le maître ne
// demande pas de construire à l'échelle, sauf quand l'exercice le dit ; la
// figure n'est là que pour poser les noms. Les coordonnées, elles, servent à
// VÉRIFIER — c'est leur seul rôle, et il est entier.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Thales;
  const R = M ? require('./regles.js') : racine.Regles;

  const seg = R.seg, dr = R.dr;

  // ── Écrire un fait en arabe ──────────────────────────────────────────────
  const L = s => '[' + s[0] + s[1] + ']';
  const chapeau = t => t[0] + t[1] + '̂' + t[2];
  // Le mode d'écriture voyage avec le fait : « donnee » pour ce que l'énoncé
  // fournit, rien pour ce que la chaîne a trouvé.
  const dit = {
    lg2: (s, v, m) => s + ' = ' + F.ecrireRacine(v, m),
    para: (a, b) => '(' + a + ') // (' + b + ')',
    perp: (a, b) => '(' + a + ') ⊥ (' + b + ')',
    milieu: (I, A, B) => I + ' منتصف ' + L(A + B),
    rect: (A, S, C) => 'المثلّث ' + A + S + C + ' قائم الزاوية في ' + S,
    cercle: (O, t) => 'النّقط ' + t.split('').join(' و ') + ' تنتمي إلى دائرة مركزها ' + O,
    aligne: (A, B, C) => A + ' و ' + B + ' و ' + C + ' على استقامة واحدة',
    // Le sommet porte le chapeau, comme au tableau : ETO s'écrit ET̂O.
    angles: (a, b) => 'الزاويتان ' + chapeau(a) + ' و ' + chapeau(b) + ' متقايستان',
    // Trois rapports empilés, reliés par des égalités — comme au tableau.
    prop: (a, b, c) => [a, b, c].map(x => F.ecrireRapport(...x.split('|'))).join(' = '),
    pgram: Q => 'الرّباعي ' + Q + ' متوازي أضلاع',
    rect4: Q => 'الرّباعي ' + Q + ' مستطيل',
    losange: Q => 'الرّباعي ' + Q + ' معيّن',
    gravite: (G, t) => G + ' هو مركز ثقل المثلّث ' + t,
    ortho: (H, t) => H + ' هو المركز القائم للمثلّث ' + t,
    sym: (A2, A, O) => A2 + ' هي نظيرة ' + A + ' بالتناظر المركزي الذي مركزه ' + O,
    // « AB/CD × EF/GH = 1 » ou « AB/CD + EF/GH = 1 », en fractions empilées.
    relation: (op, liste, val) => liste.split(';')
      .map(x => { const p = x.split('|');
                  return F.ecrireRapport(p[0] + p[1], p[2] + p[3]); })
      .join(op === 'produit' ? ' × ' : ' + ')
      // LA VALEUR EST UN NOMBRE, ET S'ÉCRIT COMME TEL. « 4/9 » posé à plat au
      // bout d'une ligne de fractions empilées se lisait comme un reste de
      // code ; c'est un quotient, il s'empile comme les autres.
      + ' = ' + (String(val).endsWith('/1') ? String(val).slice(0, -2)
                 : F.ecrireRapport(...String(val).split('/')))
  };
  const ecrire = (f, m) => dit[f[0]](f[1], f[2], f[0] === 'lg2' ? m : f[3]);
  // (prop) prend ses trois rapports en f[1], f[2], f[3] — cf. dit.prop

  // ── La scène ─────────────────────────────────────────────────────────────
  function scene(it) {
    const s = it.monter(F);
    const P = F.plan(s.K === undefined ? 1 : s.K);
    const pts = s.points;
    const de = n => { const p = pts[n]; if (!p) throw new Error('point inconnu : ' + n); return p; };

    // LA VALEUR D'UNE LONGUEUR SE LIT SUR LES COORDONNÉES. L'item déclare
    // QUELLES longueurs l'énoncé donne ; il n'en écrit pas la valeur. Rien ne
    // peut donc dériver entre le texte et la figure.
    const val = k => P.carre(de(k[0]), de(k[1]));
    const hyp = [];
    for (const k of s.donne || []) hyp.push(['lg2', k, val(k)]);
    for (const m of s.milieux || []) hyp.push(['milieu', m[0], ...seg(m[1], m[2]).split('')]);
    for (const p of s.para || []) hyp.push(['para', p[0], p[1]]);
    for (const r of s.rects || []) hyp.push(['rect', r[0], r[1], r[2]]);
    for (const y of s.symetries || []) hyp.push(['sym', y[0], y[1], y[2]]);
    for (const g of s.pgrams || []) hyp.push(['pgram', g]);
    for (const q of s.perps || []) hyp.push(['perp', q[0], q[1]]);
    // UN CERCLE DONNÉ PAR L'ÉNONCÉ. « (C) دائرة قطرها [AB] و M نقطة منها » :
    // l'appartenance au cercle est une donnée, et c'est d'elle que sort
    // l'angle droit — non de Pythagore.
    for (const c of s.cercles || []) {
      hyp.push(['cercle', c[0], c[1].split('').sort().join('')]);
    }
    // L'ÉGALITÉ DES ANGLES ET LA CONFIGURATION SORTENT DE LA MÊME DÉCLARATION.
    // L'item dit une fois « ces deux angles-là sont alternes-internes et de
    // même mesure » ; l'hypothèse et le contexte en découlent tous deux, et
    // ne peuvent donc pas se contredire.
    for (const a of s.alternes || []) {
      hyp.push(['angles', a.p + a.s1 + a.s2, a.q + a.s2 + a.s1]);
    }

    // Le contexte : ce que la FIGURE fournit, et qui n'est pas à démontrer.
    const milieux = {};
    for (const m of s.milieux || []) milieux[seg(m[1], m[2])] = m[0];
    const ctx = {
      thales: s.thales || [], triangles: s.triangles || [],
      quadrilateres: s.quadrilateres || [], gravites: s.gravites || [],
      orthos: s.orthos || [], entre: s.entre || [], relations: s.relations || [],
      alternes: s.alternes || [],
      milieux, pieds: s.pieds || {}, diametres: s.diametres || [],
      dessin: (s.alignements || []).map(a => ['aligne', ...a])
    };
    return { s, P, pts, ctx, hyp, val, de };
  }

  // ── La chaîne ────────────────────────────────────────────────────────────
  function chaine(it) {
    let S;
    try { S = scene(it); } catch (e) { return null; }
    // UN EXERCICE, PLUSIEURS QUESTIONS QUI S'ENCHAÎNENT.
    //
    // Les feuilles du maître ne posent pas une question : THALES0 ex3 en pose
    // huit, et chacune se sert de la précédente — « أحسب IN », puis « بيّن
    // أنّ MI/MP = 3/8 », puis « استنتج أنّ I منتصف [EF] ». En n'en prenant
    // qu'une, on ne raccourcissait pas l'exercice : on le TRONQUAIT, et c'est
    // pour cela que tout le chapitre sortait facile.
    //
    // Chaque question part donc des hypothèses ET de tout ce que les questions
    // précédentes ont établi — exactement comme l'élève, qui ne redémontre pas
    // ce qu'il vient de démontrer.
    const buts = S.s.buts || [{ but: S.s.but, question: S.s.question }];
    const acquis = S.hyp.slice();
    const blocs = [];
    for (const b of buts) {
      const bout = R.chercher(acquis, b.but, S.ctx);
      if (!bout || !bout.length) return null;
      blocs.push({ suite: bout, question: b.question });
      for (const n of bout) acquis.push(n.fait);
    }
    const suite = [].concat(...blocs.map(b => b.suite));
    if (!suite.length) return null;

    // Ce que l'énoncé a donné s'écrit comme sur la feuille, partout où cela
    // reparaît ; ce que la chaîne a calculé s'écrit en fraction, partout.
    const donnees = new Set(S.hyp.map(R.cleFait));
    const dire = f => ecrire(f, donnees.has(R.cleFait(f)) ? 'donnee' : null);
    const etapes = [['المعطيات', S.hyp.map(f => dire(f)).join('  و  ')]];
    const dites = new Set();
    blocs.forEach((bloc, i) => {
      // La correction est numérotée comme l'énoncé : l'élève doit pouvoir
      // ramener chaque réponse à sa question.
      if (blocs.length > 1) etapes.push([(i + 1) + ')', bloc.question]);
      for (const n of bloc.suite) {
        // ── LA RÉDACTION DE THALÈS EST UN GABARIT, PAS UNE PHRASE ──────────
        //
        // « النشاط الأول » et « النشاط الثالث » l'imposent case par case :
        //
        //     في المثلّث ABC لنا
        //     (MN) // (BC)
        //     M ∈ (AB)  و  N ∈ (AC)
        //     حسب نظرية طالس لنا
        //     AM/AB = AN/AC = MN/BC
        //
        // Le maître est formel : une application de Thalès qui ne nomme pas
        // le triangle, ou qui ne dit pas quelles droites sont parallèles, est
        // FAUSSE — et la copie vaut zéro. Ce n'est donc pas une mise en forme,
        // c'est le raisonnement lui-même, et le validateur le contrôle.
        if (n.conf) { pousserThales(etapes, n, S, donnees, dire, dites); continue; }
        if (!dites.has(n.regle.cle)) {
          dites.add(n.regle.cle);
          etapes.push(['القاعدة', n.regle.nom]);
        }
        // Le calcul tient dans la même ligne que la déduction : séparé, il
        // arriverait APRÈS la conclusion, ce qui est l'ordre inverse de celui
        // où l'on pense.
        etapes.push(['نطبّق', n.depuis.map(f => dire(f)).join('  و  ') + '  إذن  '
                     + dire(n.fait) + calculDe(n, S, donnees)]);
      }
      etapes.push(['النتيجة', dire(bloc.suite[bloc.suite.length - 1].fait)]);
    });
    if (etapes.length < 4) return null;

    const g = k => F.ecrireRacine(S.val(k), 'donnee');
    const enonce = (S.s.texte ? S.s.texte(g) : []).slice();
    const svg = figure(S);
    if (svg) enonce.push({ svg });
    if (buts.length > 1) buts.forEach((b, i) => enonce.push((i + 1) + ') ' + b.question));
    else enonce.push(S.s.question);

    return {
      enonce, etapes,
      indice: S.s.indice || 'ابدأ من المعطيات، و طبّق قاعدة واحدة في كلّ مرحلة',
      source: it.src,
      controle: {
        type: 'thales',
        K: String(S.P.k.n) + '/' + String(S.P.k.d),
        points: Object.fromEntries(Object.keys(S.pts).map(n =>
          [n, [S.pts[n].x.n + '/' + S.pts[n].x.d, S.pts[n].y.n + '/' + S.pts[n].y.d]])),
        hyp: S.hyp.map(sec), but: sec(buts[buts.length - 1].but),
        // CE QUE LA RÉDACTION DOIT CONTENIR, pour chaque application de
        // Thalès : le triangle, la parallèle, les deux appartenances. Le
        // validateur relit le texte et refuse ce qui en manque.
        redactions: suite.filter(n => n.conf).map(n => ({
          tri: n.conf.S + n.conf.B + n.conf.C,
          para: '(' + n.conf.M + n.conf.N + ') // (' + n.conf.B + n.conf.C + ')',
          sur: [n.conf.M + ' ∈ (' + n.conf.S + n.conf.B + ')',
                n.conf.N + ' ∈ (' + n.conf.S + n.conf.C + ')']
        })),
        etapesCalcul: suite.map(n => ({
          regle: n.regle.cle, fait: sec(n.fait), depuis: n.depuis.map(sec)
        })),
        ctx: { thales: S.ctx.thales, triangles: S.ctx.triangles, alternes: S.ctx.alternes,
               quadrilateres: S.ctx.quadrilateres, gravites: S.ctx.gravites,
               orthos: S.ctx.orthos, entre: S.ctx.entre,
               relations: S.ctx.relations,
               milieux: S.ctx.milieux, pieds: S.ctx.pieds,
               // LE DIAMÈTRE VOYAGE AVEC LE CONTRÔLE. Sans lui, le validateur
               // rejouait « كلّ مثلّث يقبل الارتسام في دائرة أحد أضلاعه قطر
               // لها » sur une scène sans cercle, et la règle ne donnait
               // évidemment rien : 32 refus, tous justes.
               diametres: S.ctx.diametres }
      }
    };
  }
  // Un fait, sérialisé : les rationnels y deviennent du texte.
  const sec = f => f.map(x => (x && x.n !== undefined ? x.n + '/' + x.d : x));

  // ── LE GABARIT DE THALÈS ─────────────────────────────────────────────────
  // Les trois rapports, lus depuis le sommet, comme sur la feuille.
  const rapportsDe = t => [[t.S + t.M, t.S + t.B],
                           [t.S + t.N, t.S + t.C],
                           [t.M + t.N, t.B + t.C]];
  const troisRapports = t => rapportsDe(t).map(r => F.ecrireRapport(r[0], r[1])).join(' = ');
  const cadreDe = t => '(' + t.M + t.N + ') // (' + t.B + t.C + ')  و  '
    + t.M + ' ∈ (' + t.S + t.B + ')  و  ' + t.N + ' ∈ (' + t.S + t.C + ')';
  const appartenances = t => t.M + ' ∈ (' + t.S + t.B + ')  و  '
    + t.N + ' ∈ (' + t.S + t.C + ')';

  function pousserThales(etapes, n, S, donnees, dire, dites) {
    const t = n.conf;
    const tri = t.S + t.B + t.C;
    const ecrit = k => {
      const v = S.val(k);
      return F.ecrireRacine(v, donnees.has(R.cleFait(['lg2', k, v])) ? 'donnee' : null);
    };
    // L'ORDRE DE LA FEUILLE : la configuration d'abord, le théorème ensuite.
    if (n.sens === 'reciproque') {
      const [r1, r2] = rapportsDe(t);
      etapes.push(['في المثلّث ' + tri + ' لنا', appartenances(t)]);
      etapes.push(['و لدينا', F.ecrireRapport(r1[0], r1[1]) + ' = ' + F.ecrireRapport(r2[0], r2[1])
        + '  ، أي  ' + F.ecrireRapport(ecrit(r1[0]), ecrit(r1[1])) + ' = '
        + F.ecrireRapport(ecrit(r2[0]), ecrit(r2[1]))]);
      etapes.push(['حسب عكس نظرية طالس لنا', dire(n.fait)]);
      return;
    }
    etapes.push(['في المثلّث ' + tri + ' لنا', cadreDe(t)]);
    // « النشاط الأول » ne demande rien d'autre que les trois rapports : ils
    // sont alors la conclusion, et non le point de départ d'un calcul.
    if (n.fait[0] === 'prop') {
      etapes.push(['حسب نظرية طالس لنا', dire(n.fait)]);
      return;
    }
    etapes.push(['حسب نظرية طالس لنا', troisRapports(t)]);
    // La substitution, puis la réponse : « 5/6 = AN/7,2 » puis « AN = 6 ».
    const p = n.paires;
    if (p) {
      const nom = k => (k === p.inconnu ? k : ecrit(k));
      etapes.push(['نعوّض',
        F.ecrireRapport(nom(p.connu[0]), nom(p.connu[1])) + ' = '
        + F.ecrireRapport(nom(p.cible[0]), nom(p.cible[1]))]);
    } else if (n.calcul) {
      // LE PARTAGE A UN NOM, ET IL DOIT ÊTRE DIT. Les règles du partage —
      // « on connaît le rapport et la somme », « on connaît le rapport et le
      // reste » — s'appuient sur Thalès mais ne s'y réduisent pas. Le gabarit
      // les avait rendues muettes : la correction montrait le théorème, puis
      // un résultat, sans la règle qui les relie. Le classement s'en est
      // aperçu avant moi — le trapèze était retombé « facile ».
      if (n.regle && !/^thales/.test(n.regle.cle) && dites && !dites.has(n.regle.cle)) {
        dites.add(n.regle.cle);
        etapes.push(['القاعدة', n.regle.nom]);
      }
      etapes.push(['نطبّق', n.depuis.map(f => dire(f)).join('  و  ')]);
    }
    etapes.push(['إذن', dire(n.fait) + (p ? '' : calculDe(n, S, donnees))]);
  }

  // Le détail du calcul, quand la règle en a fait un.
  function calculDe(n, S, donnees) {
    const c = n.calcul;
    if (!c) return '';
    const e = k => {
      const v = S.val(k);
      return F.ecrireRacine(v, (donnees && donnees.has(R.cleFait(['lg2', k, v])))
        ? 'donnee' : null);
    };
    try {
      // « EF × (1/AB + 1/CD) = 1 » : le calcul du maître, écrit tel quel.
      if (c[1] === 'somme-un') {
        return '  ، لأنّ ' + n.fait[1] + ' × ( '
          + c.slice(2).map(k => F.ecrireRapport('1', k)).join(' + ') + ' ) = 1';
      }
      if (c[3] === 'somme') return '  ، لأنّ ' + n.fait[1] + '² = ' + e(c[0]) + '² + ' + e(c[1]) + '²';
      if (c[3] === 'diff') return '  ، لأنّ ' + n.fait[1] + '² = ' + e(c[0]) + '² − ' + e(c[1]) + '²';
      if (c[3] === 'verif') return '  ، لأنّ ' + e(c[2]) + '² = ' + e(c[0]) + '² + ' + e(c[1]) + '²';
      if (c[2] === 'moitie') return '  ، أي نصف ' + e(c[0]);
      if (c[2] === 'rayon') return '  ، لأنّهما نصفا قطر لنفس الدائرة';
      if (c[2] === 'double') return '  ، أي ضعف ' + e(c[0]);
      if (c[2] === 'oppose') return '  ، لأنّهما ضلعان متقابلان';
      if (c[2] === 'symetrie') return '  ، لأنّ التناظر يحفظ المسافات';
      if (c[2] === 'deux-tiers') return '  ، أي ثلثا ' + e(c[0]);
      if (c[4] === 'thales') return '  ، لأنّ ' + F.ecrireRapport(c[0], c[1])
        + ' = ' + F.ecrireRapport(c[2], c[3]);
      if (c[4] === 'reciproque') return '  ، لأنّ ' + F.ecrireRapport(c[0], c[1])
        + ' = ' + F.ecrireRapport(c[2], c[3]);
      // À GAUCHE LE NOM, À DROITE LES NOMBRES. Écrire « 16/3 = 8 − 8/3 »
      // donne le résultat avant le calcul : c'est l'ordre inverse de celui où
      // l'on pense, et l'élève n'a plus rien à faire.
      if (c[3] === 'partage') return '  ، لأنّ النّسبة ' + F.ecrireRapport(e(c[0]), e(c[1]))
        + ' و المجموع ' + e(c[2]);
      if (c[3] === 'externe') return '  ، لأنّ النّسبة ' + F.ecrireRapport(e(c[0]), e(c[1]))
        + ' و الفرق ' + e(c[2]);
      if (c[3] === 'plus') return '  ، لأنّ ' + n.fait[1] + ' = ' + e(c[0]) + ' + ' + e(c[1]);
      if (c[3] === 'moins') return '  ، لأنّ ' + n.fait[1] + ' = ' + e(c[0]) + ' − ' + e(c[1]);
      if (c[3] === 'metrique') return '  ، لأنّ ' + n.fait[1] + ' × ' + e(c[2])
        + ' = ' + e(c[0]) + ' × ' + e(c[1]);
    } catch (x) { return ''; }
    return '';
  }

  function figure(S) {
    const f = S.s.figure;
    if (!f) return null;
    return F.dessiner({ P: S.P, points: S.pts, segments: f.segments || [],
                        droites: f.droites || [], angles: f.angles || [],
                        marques: f.marques || [], arcs: f.arcs || [] });
  }

  const API = { chaine, scene, ecrire, dit, sec };
  if (M) module.exports = API; else racine.Chaines = API;
})(typeof window !== 'undefined' ? window : globalThis);
