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
    // Trois rapports empilés, reliés par des égalités — comme au tableau.
    prop: (a, b, c) => [a, b, c].map(x => F.ecrireRapport(...x.split('|'))).join(' = '),
    pgram: Q => 'الرّباعي ' + Q + ' متوازي أضلاع',
    rect4: Q => 'الرّباعي ' + Q + ' مستطيل',
    losange: Q => 'الرّباعي ' + Q + ' معيّن',
    gravite: (G, t) => G + ' هو مركز ثقل المثلّث ' + t,
    ortho: (H, t) => H + ' هو المركز القائم للمثلّث ' + t,
    sym: (A2, A, O) => A2 + ' هي نظيرة ' + A + ' بالتناظر المركزي الذي مركزه ' + O
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

    // Le contexte : ce que la FIGURE fournit, et qui n'est pas à démontrer.
    const milieux = {};
    for (const m of s.milieux || []) milieux[seg(m[1], m[2])] = m[0];
    const ctx = {
      thales: s.thales || [], triangles: s.triangles || [],
      quadrilateres: s.quadrilateres || [], gravites: s.gravites || [],
      orthos: s.orthos || [],
      milieux, pieds: s.pieds || {}, diametres: s.diametres || [],
      dessin: (s.alignements || []).map(a => ['aligne', ...a])
    };
    return { s, P, pts, ctx, hyp, val, de };
  }

  // ── La chaîne ────────────────────────────────────────────────────────────
  function chaine(it) {
    let S;
    try { S = scene(it); } catch (e) { return null; }
    const suite = R.chercher(S.hyp, S.s.but, S.ctx);
    if (!suite || !suite.length) return null;

    // Ce que l'énoncé a donné s'écrit comme sur la feuille, partout où cela
    // reparaît ; ce que la chaîne a calculé s'écrit en fraction, partout.
    const donnees = new Set(S.hyp.map(R.cleFait));
    const dire = f => ecrire(f, donnees.has(R.cleFait(f)) ? 'donnee' : null);
    const etapes = [['المعطيات', S.hyp.map(f => dire(f)).join('  و  ')]];
    const dites = new Set();
    for (const n of suite) {
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
    etapes.push(['النتيجة', dire(suite[suite.length - 1].fait)]);
    if (etapes.length < 4) return null;

    const g = k => F.ecrireRacine(S.val(k), 'donnee');
    const enonce = (S.s.texte ? S.s.texte(g) : []).slice();
    const svg = figure(S);
    if (svg) enonce.push({ svg });
    enonce.push(S.s.question);

    return {
      enonce, etapes,
      indice: S.s.indice || 'ابدأ من المعطيات، و طبّق قاعدة واحدة في كلّ مرحلة',
      source: it.src,
      controle: {
        type: 'thales',
        K: String(S.P.k.n) + '/' + String(S.P.k.d),
        points: Object.fromEntries(Object.keys(S.pts).map(n =>
          [n, [S.pts[n].x.n + '/' + S.pts[n].x.d, S.pts[n].y.n + '/' + S.pts[n].y.d]])),
        hyp: S.hyp.map(sec), but: sec(S.s.but),
        etapesCalcul: suite.map(n => ({
          regle: n.regle.cle, fait: sec(n.fait), depuis: n.depuis.map(sec)
        })),
        ctx: { thales: S.ctx.thales, triangles: S.ctx.triangles,
               quadrilateres: S.ctx.quadrilateres, gravites: S.ctx.gravites,
               orthos: S.ctx.orthos,
               milieux: S.ctx.milieux, pieds: S.ctx.pieds }
      }
    };
  }
  // Un fait, sérialisé : les rationnels y deviennent du texte.
  const sec = f => f.map(x => (x && x.n !== undefined ? x.n + '/' + x.d : x));

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
                        marques: f.marques || [] });
  }

  const API = { chaine, scene, ecrire, dit, sec };
  if (M) module.exports = API; else racine.Chaines = API;
})(typeof window !== 'undefined' ? window : globalThis);
