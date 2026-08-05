// LE SUBSTRAT DE LA 9ᵉ — THALÈS, PYTHAGORE, LE TRIANGLE.
//
// Ce que le chapitre doit vérifier : des rapports de longueurs, des carrés,
// des parallèles, des milieux. Or les énoncés du maître portent AC = 4√2,
// MP = 2√2, AF = 2√13, AB = 2(√6 − √2) : des longueurs IRRATIONNELLES.
//
// D'où l'idée première — et fausse — qu'il fallait un corps de radicaux.
// On ne manipule jamais une longueur : on manipule son CARRÉ, qui reste
// rationnel dès que les points le sont. Pythagore est déjà une somme de
// carrés ; AH × BC = AB × AC devient AH²·BC² = AB²·AC² ; et le rapport de
// Thalès AB/AC = AN/AP devient AB²·AP² = AC²·AN², les longueurs étant
// positives. Le radical ne sert qu'à ÉCRIRE la réponse, jamais à la trouver.
//
// Reste un cas que les rationnels seuls ne rendent pas : le triangle
// équilatéral, dont la hauteur vaut a√3/2 (règle nº 8 du catalogue). On donne
// donc à l'axe des ordonnées un POIDS K rationnel : le point (a, b) désigne
// le point réel (a, b√K). Les carrés de distances valent alors
// Δx² + K·Δy², rationnels ; le déterminant garde √K en facteur, donc s'annule
// au même moment ; et le produit scalaire devient Δx·Δx' + K·Δy·Δy'. Tout
// reste exact, et K = 3 met l'équilatéral dans le plan rationnel.
(function (racine) {
  'use strict';

  // ── Tirage ───────────────────────────────────────────────────────────────
  const ent = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
  const choix = t => t[Math.floor(Math.random() * t.length)];
  const melanger = t => {
    const c = t.slice();
    for (let i = c.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [c[i], c[j]] = [c[j], c[i]];
    }
    return c;
  };

  // ── Rationnels exacts, en BigInt ─────────────────────────────────────────
  const B = x => (typeof x === 'bigint' ? x : BigInt(x));
  const babs = x => (x < 0n ? -x : x);
  const bpgcd = (a, b) => { a = babs(a); b = babs(b); while (b) { const t = a % b; a = b; b = t; } return a; };

  function q(n, d) {
    n = B(n); d = (d === undefined ? 1n : B(d));
    if (d === 0n) throw new Error('dénominateur nul');
    if (d < 0n) { n = -n; d = -d; }
    const g = bpgcd(n, d) || 1n;
    return { n: n / g, d: d / g };
  }
  const Q0 = q(0), Q1 = q(1), Q2 = q(2);
  const qAdd = (a, b) => q(a.n * b.d + b.n * a.d, a.d * b.d);
  const qSub = (a, b) => q(a.n * b.d - b.n * a.d, a.d * b.d);
  const qMul = (a, b) => q(a.n * b.n, a.d * b.d);
  const qDiv = (a, b) => { if (b.n === 0n) throw new Error('division par zéro'); return q(a.n * b.d, a.d * b.n); };
  const qNeg = a => ({ n: -a.n, d: a.d });
  const qNul = a => a.n === 0n;
  const qEgaux = (a, b) => a.n === b.n && a.d === b.d;
  const qPos = a => a.n > 0n;
  const qNum = a => Number(a.n) / Number(a.d);
  const qCmp = (a, b) => { const c = a.n * b.d - b.n * a.d; return c < 0n ? -1 : (c > 0n ? 1 : 0); };

  // ── Points ───────────────────────────────────────────────────────────────
  // (x, y) désigne le point réel (x, y√K). Tant qu'on n'a pas dit K, rien de
  // métrique n'est calculable — et c'est voulu.
  const pt = (x, y) => ({ x: (typeof x === 'object' ? x : q(x)),
                          y: (typeof y === 'object' ? y : q(y)) });
  const vec = (A, C) => pt(qSub(C.x, A.x), qSub(C.y, A.y));
  // Le déterminant garde √K en facteur : il s'annule quand le rationnel
  // ci-dessous s'annule, donc le parallélisme ne dépend pas de K.
  const det = (u, v) => qSub(qMul(u.x, v.y), qMul(u.y, v.x));
  const memesPoints = (A, C) => qEgaux(A.x, C.x) && qEgaux(A.y, C.y);
  const aligne = (A, C, D) => qNul(det(vec(A, C), vec(A, D)));

  // ── Constructions affines — elles ne voient pas K ─────────────────────────
  const milieu = (A, C) => pt(qDiv(qAdd(A.x, C.x), Q2), qDiv(qAdd(A.y, C.y), Q2));
  // A + t·AC : le point de (AC) à la fraction t du chemin.
  const surDroite = (A, C, t) =>
    pt(qAdd(A.x, qMul(t, qSub(C.x, A.x))), qAdd(A.y, qMul(t, qSub(C.y, A.y))));
  // Le symétrique de P par rapport au point O.
  const symetriqueCentre = (P, O) =>
    pt(qSub(qAdd(O.x, O.x), P.x), qSub(qAdd(O.y, O.y), P.y));
  // Le point d'intersection de (AC) et (DE), ou null si elles sont parallèles.
  function intersection(A, C, D, E) {
    const u = vec(A, C), v = vec(D, E), w = vec(A, D);
    const dd = det(u, v);
    if (qNul(dd)) return null;
    return surDroite(A, C, qDiv(det(w, v), dd));
  }
  // Le translaté de P par le vecteur AC — sert à poser un parallélogramme.
  const translate = (P, A, C) =>
    pt(qAdd(P.x, qSub(C.x, A.x)), qAdd(P.y, qSub(C.y, A.y)));

  // ── LE PLAN MÉTRIQUE — tout ce qui dépend de K passe par ici ─────────────
  //
  // Une fabrique plutôt qu'une variable globale : deux scènes de poids
  // différents peuvent vivre en même temps sans se marcher dessus, et une
  // fonction métrique appelée hors d'un plan ne compile pas.
  function plan(K) {
    const k = (typeof K === 'object' ? K : q(K === undefined ? 1 : K));
    if (!qPos(k)) throw new Error('poids du plan non strictement positif');

    const pScal = (u, v) => qAdd(qMul(u.x, v.x), qMul(k, qMul(u.y, v.y)));
    // LE CARRÉ D'UNE LONGUEUR — la seule monnaie du chapitre.
    const carre = (A, C) => { const u = vec(A, C); return pScal(u, u); };
    const droiteOk = (A, C) => !memesPoints(A, C);

    const perp = (A, C, D, E) =>
      droiteOk(A, C) && droiteOk(D, E) && qNul(pScal(vec(A, C), vec(D, E)));
    const para = (A, C, D, E) =>
      droiteOk(A, C) && droiteOk(D, E) && qNul(det(vec(A, C), vec(D, E)));
    const memeLongueur = (A, C, D, E) => qEgaux(carre(A, C), carre(D, E));
    const estMilieu = (M, A, C) => qEgaux(qAdd(M.x, M.x), qAdd(A.x, C.x))
                                && qEgaux(qAdd(M.y, M.y), qAdd(A.y, C.y));
    const estMediatrice = (D, E, A, C) =>
      droiteOk(A, C) && perp(D, E, A, C) && aligne(D, E, milieu(A, C));

    // LE RAPPORT DE THALÈS, SANS JAMAIS EXTRAIRE DE RACINE.
    //   AB/CD = EF/GH  ⟺  AB·GH = CD·EF  ⟺  AB²·GH² = CD²·EF²,
    // l'élévation au carré étant réversible sur des longueurs positives.
    const memeRapport = (A, C, D, E, F, G, H, I) =>
      qEgaux(qMul(carre(A, C), carre(H, I)), qMul(carre(D, E), carre(F, G)));
    // AB/CD = p/q pour un rationnel donné : AB²·q² = CD²·p².
    const rapportVaut = (A, C, D, E, r) =>
      qEgaux(qMul(carre(A, C), qMul(r.d === undefined ? Q1 : q(r.d), q(r.d))),
             qMul(carre(D, E), qMul(q(r.n), q(r.n))));
    // Pythagore, tel quel : c'est déjà une égalité de carrés.
    const pythagore = (A, S, C) =>
      qEgaux(carre(A, C), qAdd(carre(S, A), carre(S, C)));

    // Le projeté orthogonal de P sur (AC) — c'est ici que K entre vraiment.
    function projete(P, A, C) {
      if (!droiteOk(A, C)) throw new Error('projection sur une droite dégénérée');
      const u = vec(A, C);
      return surDroite(A, C, qDiv(pScal(vec(A, P), u), pScal(u, u)));
    }
    const distanceCarre = (P, A, C) => carre(P, projete(P, A, C));
    // Le symétrique orthogonal de P par rapport à la droite (AC).
    const symetriqueDroite = (P, A, C) => symetriqueCentre(P, projete(P, A, C));

    // Le centre de gravité, l'orthocentre, le centre du cercle circonscrit —
    // calculés, jamais supposés.
    const centreGravite = (A, C, D) =>
      pt(qDiv(qAdd(qAdd(A.x, C.x), D.x), q(3)), qDiv(qAdd(qAdd(A.y, C.y), D.y), q(3)));
    function orthocentre(A, C, D) {
      // L'intersection de deux hauteurs ; la troisième y passe, et le
      // validateur le recalcule au lieu de le croire.
      const h1 = [A, projete(A, C, D)], h2 = [C, projete(C, A, D)];
      return intersection(h1[0], h1[1], h2[0], h2[1]);
    }
    function circoncentre(A, C, D) {
      const m1 = milieu(A, C), m2 = milieu(A, D);
      const p1 = pt(qSub(m1.x, qMul(k, qSub(C.y, A.y))), qAdd(m1.y, qSub(C.x, A.x)));
      const p2 = pt(qSub(m2.x, qMul(k, qSub(D.y, A.y))), qAdd(m2.y, qSub(D.x, A.x)));
      return intersection(m1, p1, m2, p2);
    }
    // Trois points sur un même cercle de centre O : trois rayons égaux.
    const cocycliques = (O, L) => L.every(P => qEgaux(carre(O, P), carre(O, L[0])));

    return { k, pScal, carre, droiteOk, perp, para, memeLongueur, estMilieu,
             estMediatrice, memeRapport, rapportVaut, pythagore, projete,
             distanceCarre, symetriqueDroite, centreGravite, orthocentre,
             circoncentre, cocycliques,
             // le flottant, pour le DESSIN seulement
             xy: P => [qNum(P.x), qNum(P.y) * Math.sqrt(qNum(k))] };
  }

  // ── ÉCRIRE UNE LONGUEUR ──────────────────────────────────────────────────
  //
  // On n'a que son carré. « AB² = 32 » doit s'écrire « AB = 4√2 », et
  // « AB² = 52/9 » doit s'écrire « AB = 2√13/3 ». C'est le seul endroit du
  // chapitre où un radical apparaît, et il n'y sert qu'à l'affichage.
  function racineEntiere(n) {
    if (n < 0n) return null;
    if (n < 2n) return n;
    let x = n, y = (x + 1n) / 2n;
    while (y < x) { x = y; y = (x + n / x) / 2n; }
    return x * x === n ? x : null;
  }
  // √m = a√b avec b sans facteur carré.
  function peler(m) {
    let a = 1n, b = m, f = 2n;
    while (f * f <= b) {
      while (b % (f * f) === 0n) { b /= f * f; a *= f; }
      f++;
    }
    return [a, b];
  }
  // √(n/d) = √(n·d)/d : on rend le dénominateur rationnel avant de peler.
  function ecrireRacine(c) {
    if (!qPos(c) && !qNul(c)) throw new Error('carré de longueur négatif');
    if (qNul(c)) return '0';
    const [a, b] = peler(c.n * c.d);
    const g = bpgcd(a, c.d) || 1n;
    const haut = a / g, bas = c.d / g;
    const rad = (b === 1n) ? '' : '√' + b;
    if (b === 1n) return bas === 1n ? String(haut) : frac(String(haut), String(bas));
    const num = (haut === 1n ? '' : String(haut)) + rad;
    return bas === 1n ? num : frac(num, String(bas));
  }
  // UNE FRACTION EST UN ÎLOT LATIN. Sans dir="ltr", « 7√10 » au numérateur
  // s'affiche « 10√7 » dans une page arabe : les chiffres sont de sens fort,
  // le radical est neutre, et le bidi range les morceaux chacun de son côté.
  // Ce n'est pas un détail de mise en page — cela change le nombre.
  const frac = (n, d) => '<span class="frac" dir="ltr"><span class="num">' + n
    + '</span><span class="den">' + d + '</span></span>';
  const FRAC = /<span class="frac" dir="ltr"><span class="num">.*?<\/span><span class="den">.*?<\/span><\/span>/g;
  // Un rationnel, écrit comme sur la feuille.
  const ecrireQ = a => (a.d === 1n ? String(a.n)
    : frac(String(a.n), String(a.d)));
  // Un rapport de longueurs : AB/CD, en fraction empilée.
  const ecrireRapport = (h, b) => frac(h, b);

  // ── LA FIGURE ────────────────────────────────────────────────────────────
  const COUL = { trait: '#2c3e50', aide: '#8fa3b8', marque: '#c0392b',
                 point: '#2c3e50' };

  // fig = { P: plan, points: {A:[…]}, segments: [['A','B']], droites: [],
  //         angles: [['B','A','C']], marques: [], etiquettes: [] }
  function dessiner(fig) {
    const P = fig.P, noms = Object.keys(fig.points);
    const XY = {};
    for (const n of noms) XY[n] = P.xy(fig.points[n]);
    const m = metre();
    for (const n of noms) m.pt(XY[n][0], XY[n][1], 1, 1);
    const b0 = m.boite();
    const ECH = Math.min(250 / Math.max(b0.x1 - b0.x0, 0.001),
                         190 / Math.max(b0.y1 - b0.y0, 0.001));
    // L'écran descend, le plan monte : on retourne l'ordonnée.
    const X = n => (XY[n][0] - b0.x0) * ECH;
    const Y = n => (b0.y1 - XY[n][1]) * ECH;

    const M = metre(), out = [];
    for (const n of noms) M.pt(X(n), Y(n), 3, 3);

    for (const s of fig.droites || []) {
      // Une droite dépasse ses deux points, comme au tableau.
      const [ax, ay] = [X(s[0]), Y(s[0])], [bx, by] = [X(s[1]), Y(s[1])];
      const L = Math.hypot(bx - ax, by - ay) || 1, e = 26 / L;
      const p1 = [ax - (bx - ax) * e, ay - (by - ay) * e];
      const p2 = [bx + (bx - ax) * e, by + (by - ay) * e];
      M.pt(p1[0], p1[1], 1, 1); M.pt(p2[0], p2[1], 1, 1);
      out.push(trait(p1, p2, COUL.aide, 1.2));
    }
    for (const s of fig.segments || []) {
      out.push(trait([X(s[0]), Y(s[0])], [X(s[1]), Y(s[1])], COUL.trait, 1.7));
    }
    // L'angle droit se marque par un carré, comme sur la feuille.
    for (const a of fig.angles || []) {
      const [u, S, v] = a;
      const d1 = unit(X(S), Y(S), X(u), Y(u)), d2 = unit(X(S), Y(S), X(v), Y(v));
      const c = 11;
      const p = [[X(S) + d1[0] * c, Y(S) + d1[1] * c],
                 [X(S) + (d1[0] + d2[0]) * c, Y(S) + (d1[1] + d2[1]) * c],
                 [X(S) + d2[0] * c, Y(S) + d2[1] * c]];
      p.forEach(z => M.pt(z[0], z[1], 1, 1));
      out.push('<polyline points="' + p.map(z => z[0].toFixed(1) + ',' + z[1].toFixed(1)).join(' ')
        + '" fill="none" stroke="' + COUL.marque + '" stroke-width="1.3"/>');
    }
    // Les marques de segments égaux : un ou deux tirets au milieu.
    for (const mk of fig.marques || []) {
      const [a, c, n] = mk;
      const mx = (X(a) + X(c)) / 2, my = (Y(a) + Y(c)) / 2;
      const d = unit(X(a), Y(a), X(c), Y(c)), p = [-d[1], d[0]];
      for (let i = 0; i < (n || 1); i++) {
        const o = (i - ((n || 1) - 1) / 2) * 4;
        const z1 = [mx + d[0] * o - p[0] * 4, my + d[1] * o - p[1] * 4];
        const z2 = [mx + d[0] * o + p[0] * 4, my + d[1] * o + p[1] * 4];
        M.pt(z1[0], z1[1], 1, 1); M.pt(z2[0], z2[1], 1, 1);
        out.push(trait(z1, z2, COUL.marque, 1.4));
      }
    }
    // Le nom d'un point s'écrit du côté opposé au centre de la figure.
    const cx = noms.reduce((s, n) => s + X(n), 0) / noms.length;
    const cy = noms.reduce((s, n) => s + Y(n), 0) / noms.length;
    for (const n of noms) {
      out.push('<circle cx="' + X(n).toFixed(1) + '" cy="' + Y(n).toFixed(1)
        + '" r="2.6" fill="' + COUL.point + '"/>');
      let ux = X(n) - cx, uy = Y(n) - cy;
      const h = Math.hypot(ux, uy) || 1;
      const lx = X(n) + ux / h * 15, ly = Y(n) + uy / h * 15;
      M.texte(lx, ly, n, 13);
      out.push('<text x="' + lx.toFixed(1) + '" y="' + (ly + 4).toFixed(1)
        + '" text-anchor="middle" font-size="13" font-family="serif"'
        + ' font-style="italic" fill="' + COUL.point + '">' + n + '</text>');
    }
    const b = M.boite();
    const L = Math.round(b.x1 - b.x0), H = Math.round(b.y1 - b.y0);
    return '<svg class="figure" direction="ltr" viewBox="0 0 ' + L + ' ' + H
      + '" width="' + L + '" height="' + H + '" xmlns="http://www.w3.org/2000/svg">'
      + '<g transform="translate(' + (-b.x0).toFixed(1) + ' ' + (-b.y0).toFixed(1)
      + ')">' + out.join('') + '</g></svg>';
  }
  const trait = (a, b, c, w) => '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1)
    + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" stroke="' + c
    + '" stroke-width="' + w + '"/>';
  const unit = (ax, ay, bx, by) => {
    const h = Math.hypot(bx - ax, by - ay) || 1;
    return [(bx - ax) / h, (by - ay) / h];
  };
  // LE MÈTRE — chaque chose posée déclare son encombrement, et le cadre suit.
  // Sans lui, une lettre écrite hors des points se fait couper ; c'est le
  // défaut qui a mordu deux fois dans le chapitre des angles.
  function metre() {
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    return {
      pt(x, y, rx, ry) {
        x0 = Math.min(x0, x - (rx || 0)); x1 = Math.max(x1, x + (rx || 0));
        y0 = Math.min(y0, y - (ry || 0)); y1 = Math.max(y1, y + (ry || 0));
      },
      texte(x, y, s, corps) {
        this.pt(x, y, String(s).length * corps * 0.36 + 2, corps * 0.8);
      },
      boite: () => ({ x0: x0 - 4, x1: x1 + 4, y0: y0 - 4, y1: y1 + 4 })
    };
  }

  // ── Écriture mêlée arabe / latin ─────────────────────────────────────────
  const ARABE = /[؀-ۿ]/;
  const echapper = s => String(s).replace(/&/g, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const CAR = "A-Za-z\\u00C0-\\u024F\\u0300-\\u036F0-9°()[\\]{}⊥∈//=,.;:+\\-−×√'\"";
  const RUN = new RegExp('[' + CAR + ']+(?:\\s+[' + CAR + ']+)*', 'g');
  // √ EST DANS LA LISTE. Un radical seul entre deux mots arabes — « نصف 3√13 »
  // — ne contient ni lettre ni signe d'égalité ; sans lui, la suite n'était
  // pas isolée et s'affichait « 13√3 ».
  const ISOLER = /[⊥/=()[\]°√]|[A-Za-zÀ-ɏ]/;
  // Comme en 7ᵉ : les lettres nomment des points, et s'écrivent comme sur la
  // figure — en italique à empattements, pas en linéale.
  function isoMixte(texte) {
    return String(texte).replace(RUN, m => {
      if (!ISOLER.test(m)) return echapper(m);
      const p = /[A-Za-zÀ-ɏ]/.test(m) ? ' pt' : '';
      return '<span dir="ltr" class="expr' + p + '">' + echapper(m) + '</span>';
    });
  }
  const bloc = s => '<span dir="ltr" class="expr'
    + (/[A-Za-zÀ-ɏ]/.test(String(s)) ? ' pt' : '') + '">' + echapper(s) + '</span>';
  // ON N'ABANDONNE PAS LA LIGNE À CAUSE D'UNE FRACTION.
  //
  // La version précédente rendait la ligne TELLE QUELLE dès qu'elle contenait
  // une fraction — donc sans isoler quoi que ce soit. « AC = 7√10 » sortait
  // juste dans l'énoncé et « 10√7 » dans la correction, pour la seule raison
  // qu'une fraction traînait plus loin sur la ligne. On découpe donc : les
  // fractions sont déjà des îlots, et tout ce qui les sépare passe par
  // l'isolation ordinaire.
  function rendreMath(s) {
    if (s && typeof s === 'object' && s.svg) return s.svg;
    const t = String(s);
    if (/<svg/.test(t)) return t;
    const iles = t.match(FRAC) || [];
    if (!iles.length) return ARABE.test(t) ? isoMixte(t) : bloc(t);
    const morceaux = t.split(FRAC);
    let out = '';
    for (let i = 0; i < morceaux.length; i++) {
      const m = morceaux[i];
      if (m) out += (ARABE.test(t) ? isoMixte(m) : bloc(m));
      if (i < iles.length) out += iles[i];
    }
    return out;
  }

  function rendre(brut) {
    return {
      operation: brut.enonce.map(rendreMath).join('<br>'),
      steps: brut.etapes.map(e => e[0] + ': ' + rendreMath(e[1])),
      hint: brut.indice
    };
  }

  // ── Registre ─────────────────────────────────────────────────────────────
  const PROBLEMES = {};
  const enregistrer = (n, def) => { PROBLEMES[n] = def; };
  const tirer = n => PROBLEMES[n].f();
  const construire = n => ({
    id: 'ex' + n,
    title: 'التمرين ' + n + ' — ' + PROBLEMES[n].titre,
    questions: tirer(n).map(rendre)
  });

  const API = {
    ent, choix, melanger,
    q, Q0, Q1, Q2, qAdd, qSub, qMul, qDiv, qNeg, qNul, qEgaux, qPos, qNum, qCmp,
    pt, vec, det, memesPoints, aligne, milieu, surDroite, symetriqueCentre,
    intersection, translate, plan,
    racineEntiere, peler, ecrireRacine, ecrireQ, ecrireRapport, frac,
    dessiner, metre,
    bloc, isoMixte, rendreMath, rendre, echapper, ARABE,
    PROBLEMES, enregistrer, tirer, construire
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Thales = API;
})(typeof window !== 'undefined' ? window : globalThis);
