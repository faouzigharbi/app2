// Noyau de la leçon « التعامد و التوازي » — 7ème.
//
// POURQUOI DES COORDONNÉES. Une démonstration de géométrie ne se vérifie pas
// en la relisant : on croit toujours ce qu'on a écrit. Mais dès qu'un point a
// des COORDONNÉES, chaque affirmation devient un calcul, et un calcul, ça se
// recommence.
//
//     (EF) // (BC)        →  le déterminant des deux vecteurs est nul
//     (AH) ⊥ (BC)         →  leur produit scalaire est nul
//     MA = MB             →  les deux carrés de distance sont égaux
//     I milieu de [AB]    →  2·I = A + B
//     d(A, (BC)) = 3      →  la longueur du segment vers le projeté vaut 3
//
// C'est exactement la discipline du chapitre des puissances, transportée : rien
// n'est affirmé qui ne soit recalculé.
//
// TOUT EST RATIONNEL, ET EXACT. Le projeté orthogonal et l'intersection de deux
// droites font apparaître des divisions ; en flottants, « le produit scalaire
// est nul » deviendrait « il est petit », et un angle droit passerait pour
// droit alors qu'il ne l'est pas. On travaille donc en fractions de BigInt, où
// nul veut dire nul.
//
// LA FIGURE NAÎT DES MÊMES POINTS. Elle n'est pas dessinée à côté de l'énoncé :
// elle en sort. Si le générateur change une longueur, le dessin suit, et il ne
// peut pas mentir sur ce que l'énoncé affirme.
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

  // ── Rationnels exacts ────────────────────────────────────────────────────
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
  const Q0 = q(0), Q1 = q(1);
  const qAdd = (a, b) => q(a.n * b.d + b.n * a.d, a.d * b.d);
  const qSub = (a, b) => q(a.n * b.d - b.n * a.d, a.d * b.d);
  const qMul = (a, b) => q(a.n * b.n, a.d * b.d);
  const qDiv = (a, b) => { if (b.n === 0n) throw new Error('division par zéro'); return q(a.n * b.d, a.d * b.n); };
  const qNeg = a => ({ n: -a.n, d: a.d });
  const qNul = a => a.n === 0n;
  const qEgaux = (a, b) => a.n === b.n && a.d === b.d;
  const qNum = a => Number(a.n) / Number(a.d);
  // Le texte d'un rationnel : « 3 », « 5/2 », et « 2,5 » quand le maître
  // l'écrirait ainsi — les longueurs de la feuille sont en décimales.
  const qTxt = a => (a.d === 1n ? String(a.n) : a.n + '/' + a.d);
  const qDec = a => {
    if (a.d === 1n) return String(a.n);
    // décimal exact quand le dénominateur ne porte que des 2 et des 5
    let d = a.d, deux = 0, cinq = 0;
    while (d % 2n === 0n) { d /= 2n; deux++; }
    while (d % 5n === 0n) { d /= 5n; cinq++; }
    if (d !== 1n) return qTxt(a);
    const k = Math.max(deux, cinq);
    const ech = 10n ** BigInt(k);
    const v = a.n * ech / a.d;
    const s = babs(v).toString().padStart(k + 1, '0');
    const ent = s.slice(0, s.length - k), frac = s.slice(s.length - k).replace(/0+$/, '');
    return (v < 0n ? '-' : '') + ent + (frac ? ',' + frac : '');
  };

  // ── Points, vecteurs ─────────────────────────────────────────────────────
  const pt = (x, y) => ({ x: (typeof x === 'object' ? x : q(x)),
                          y: (typeof y === 'object' ? y : q(y)) });
  const vec = (A, C) => pt(qSub(C.x, A.x), qSub(C.y, A.y));
  const pScal = (u, v) => qAdd(qMul(u.x, v.x), qMul(u.y, v.y));
  const det = (u, v) => qSub(qMul(u.x, v.y), qMul(u.y, v.x));
  const carre = (A, C) => { const u = vec(A, C); return pScal(u, u); };
  const memesPoints = (A, C) => qEgaux(A.x, C.x) && qEgaux(A.y, C.y);

  // ── Les prédicats — c'est ici que se vérifie une démonstration ───────────
  //
  // Deux droites sont données par deux points chacune. On refuse une droite
  // dégénérée : « (AA) » n'est pas une droite, et laisser passer sa direction
  // nulle rendrait TOUT perpendiculaire et TOUT parallèle.
  const droiteOk = (A, C) => !memesPoints(A, C);
  function perp(A, C, D, E) {
    if (!droiteOk(A, C) || !droiteOk(D, E)) return false;
    return qNul(pScal(vec(A, C), vec(D, E)));
  }
  function para(A, C, D, E) {
    if (!droiteOk(A, C) || !droiteOk(D, E)) return false;
    return qNul(det(vec(A, C), vec(D, E)));
  }
  const aligne = (A, C, D) => qNul(det(vec(A, C), vec(A, D)));
  const memeLongueur = (A, C, D, E) => qEgaux(carre(A, C), carre(D, E));
  const estMilieu = (M, A, C) => qEgaux(qAdd(M.x, M.x), qAdd(A.x, C.x))
                              && qEgaux(qAdd(M.y, M.y), qAdd(A.y, C.y));
  // (DE) est la médiatrice de [AC] : perpendiculaire à (AC), et passant par
  // son milieu. Les deux conditions, pas l'une des deux.
  const estMediatrice = (D, E, A, C) =>
    droiteOk(A, C) && perp(D, E, A, C) && aligne(D, E, milieu(A, C));

  // ── Constructions ────────────────────────────────────────────────────────
  const milieu = (A, C) => pt(qDiv(qAdd(A.x, C.x), q(2)), qDiv(qAdd(A.y, C.y), q(2)));
  // A + t·(AC) — le point de (AC) à la fraction t du chemin.
  const surDroite = (A, C, t) =>
    pt(qAdd(A.x, qMul(t, qSub(C.x, A.x))), qAdd(A.y, qMul(t, qSub(C.y, A.y))));
  // P + t·(le vecteur AC tourné d'un quart de tour) : (P, résultat) ⊥ (AC).
  const perpDepuis = (P, A, C, t) => {
    const u = vec(A, C);
    return pt(qSub(P.x, qMul(t, u.y)), qAdd(P.y, qMul(t, u.x)));
  };
  // Le PROJETÉ ORTHOGONAL de P sur (AC) — le pied de la perpendiculaire.
  function projete(P, A, C) {
    if (!droiteOk(A, C)) throw new Error('projeté sur une droite dégénérée');
    const u = vec(A, C);
    const t = qDiv(pScal(vec(A, P), u), pScal(u, u));
    return surDroite(A, C, t);
  }
  function intersection(A, C, D, E) {
    const u = vec(A, C), v = vec(D, E);
    const dd = det(u, v);
    if (qNul(dd)) return null;                    // parallèles : pas de point
    const w = vec(A, D);
    return surDroite(A, C, qDiv(det(w, v), dd));
  }
  const symetrique = (P, A, C) => {
    const H = projete(P, A, C);
    return pt(qSub(qAdd(H.x, H.x), P.x), qSub(qAdd(H.y, H.y), P.y));
  };

  // ── Longueurs ────────────────────────────────────────────────────────────
  //
  // Une longueur est une RACINE, et elle n'est pas toujours rationnelle. On ne
  // la rend qu'exacte : entière quand elle l'est, sinon on refuse de l'écrire
  // — un énoncé de 7ème ne demande jamais « calcule √13 ».
  function longueur(A, C) {
    const c = carre(A, C);
    if (c.d !== 1n) {
      // 25/4 est le carré de 5/2 : on tente aussi les fractions.
      const rn = racineExacte(c.n), rd = racineExacte(c.d);
      return (rn !== null && rd !== null) ? q(rn, rd) : null;
    }
    const r = racineExacte(c.n);
    return r === null ? null : q(r);
  }
  function racineExacte(n) {
    if (n < 0n) return null;
    if (n < 2n) return n;
    let x = n, y = (x + 1n) / 2n;
    while (y < x) { x = y; y = (x + n / x) / 2n; }
    return x * x === n ? x : null;
  }
  // La distance d'un point à une droite : la longueur jusqu'à son projeté.
  const distance = (P, A, C) => longueur(P, projete(P, A, C));

  // ── LA FIGURE, tirée des mêmes points ────────────────────────────────────
  //
  // Un SVG plutôt qu'une image : net à toute taille, léger, et surtout il
  // ÉCHAPPE AU BIDI — son contenu ne se retourne pas dans une page arabe,
  // contrairement à du texte.
  const COUL = { trait: '#2c3e50', aide: '#8fa3b8', marque: '#c0392b',
                 point: '#2c3e50', accent: '#6c63ff' };

  function dessiner(fig) {
    const noms = Object.keys(fig.points);
    if (!noms.length) return '';
    const xs = noms.map(n => qNum(fig.points[n].x));
    const ys = noms.map(n => qNum(fig.points[n].y));
    // Les droites débordent des points : on élargit la boîte pour les voir.
    const marge = 1.1;
    let x0 = Math.min(...xs) - marge, x1 = Math.max(...xs) + marge;
    let y0 = Math.min(...ys) - marge, y1 = Math.max(...ys) + marge;
    if (x1 - x0 < 2) { x0 -= 1; x1 += 1; }
    if (y1 - y0 < 2) { y0 -= 1; y1 += 1; }
    const ECH = Math.min(300 / (x1 - x0), 210 / (y1 - y0), 46);
    const L = Math.round((x1 - x0) * ECH) + 34, H = Math.round((y1 - y0) * ECH) + 34;
    // y descend en SVG et monte en géométrie : on retourne, sinon la figure
    // est le reflet de l'énoncé.
    const X = p => 17 + (qNum(p.x) - x0) * ECH;
    const Y = p => H - 17 - (qNum(p.y) - y0) * ECH;

    const out = [];
    const P = fig.points;
    // Une droite se trace d'un bord à l'autre de la boîte : c'est une droite,
    // pas un segment, et l'élève doit la voir se prolonger.
    const bords = (A, C) => {
      const ax = X(A), ay = Y(A), cx = X(C), cy = Y(C);
      const dx = cx - ax, dy = cy - ay;
      const ts = [];
      if (dx) { ts.push((6 - ax) / dx, (L - 6 - ax) / dx); }
      if (dy) { ts.push((6 - ay) / dy, (H - 6 - ay) / dy); }
      const dedans = ts.filter(t => {
        const x = ax + t * dx, y = ay + t * dy;
        return x >= 5 && x <= L - 5 && y >= 5 && y <= H - 5;
      });
      if (dedans.length < 2) return null;
      const t0 = Math.min(...dedans), t1 = Math.max(...dedans);
      return [ax + t0 * dx, ay + t0 * dy, ax + t1 * dx, ay + t1 * dy];
    };

    // UNE DROITE SANS SON NOM NE SERT À RIEN. L'énoncé parle de (Δ), de (D'),
    // et l'élève doit pouvoir les retrouver sur le dessin — sinon la figure
    // est une décoration, et il démontre à l'aveugle. Le nom se pose au bout
    // du trait, du côté où il n'y a rien.
    const etiquettes = [];
    for (const d of fig.droites || []) {
      const b = bords(P[d[0]], P[d[1]]);
      if (!b) continue;
      out.push('<line x1="' + b[0].toFixed(1) + '" y1="' + b[1].toFixed(1)
        + '" x2="' + b[2].toFixed(1) + '" y2="' + b[3].toFixed(1)
        + '" stroke="' + (d[2] === 'aide' ? COUL.aide : COUL.trait)
        + '" stroke-width="' + (d[2] === 'aide' ? 1 : 1.5) + '"'
        + (d[2] === 'aide' ? ' stroke-dasharray="5 4"' : '') + '/>');
      if (!d[3]) continue;
      // QUATRE PLACES POSSIBLES : les deux bouts du trait, et de chaque côté.
      // On les écarte PERPENDICULAIREMENT — un nom posé dans l'axe du trait se
      // fait barrer par lui — et l'on garde celle qui tombe le plus loin des
      // points et des autres noms déjà posés.
      const cand = [];
      for (const c of [[b[0], b[1], b[2], b[3]], [b[2], b[3], b[0], b[1]]]) {
        const ux = c[0] - c[2], uy = c[1] - c[3];
        const h = Math.hypot(ux, uy) || 1;
        const bx = c[0] - ux / h * 16, by = c[1] - uy / h * 16;
        for (const sgn of [1, -1]) {
          cand.push({ x: bx + sgn * (-uy / h) * 11, y: by + sgn * (ux / h) * 11 });
        }
      }
      // Hors de la boîte, un nom ne se lit pas non plus : on le pénalise.
      const loin = c => {
        const dedans = c.x > 10 && c.x < L - 10 && c.y > 10 && c.y < H - 10;
        return (dedans ? 0 : -1000) + Math.min(...noms.map(n =>
          Math.hypot(c.x - X(P[n]), c.y - Y(P[n]))),
          ...etiquettes.map(e => Math.hypot(c.x - e.x, c.y - e.y)));
      };
      const e = cand.reduce((a, b2) => (loin(b2) > loin(a) ? b2 : a));
      etiquettes.push(e);
      out.push('<text x="' + e.x.toFixed(1) + '" y="' + (e.y + 4).toFixed(1)
        + '" text-anchor="middle" font-size="12" font-family="serif"'
        + ' fill="' + COUL.accent + '">' + d[3] + '</text>');
    }
    for (const s of fig.segments || []) {
      out.push('<line x1="' + X(P[s[0]]).toFixed(1) + '" y1="' + Y(P[s[0]]).toFixed(1)
        + '" x2="' + X(P[s[1]]).toFixed(1) + '" y2="' + Y(P[s[1]]).toFixed(1)
        + '" stroke="' + COUL.trait + '" stroke-width="1.8"/>');
    }
    for (const c of fig.cercles || []) {
      const r = qNum(longueur(P[c[0]], P[c[1]]) || q(0)) * ECH;
      if (!r) continue;
      out.push('<circle cx="' + X(P[c[0]]).toFixed(1) + '" cy="' + Y(P[c[0]]).toFixed(1)
        + '" r="' + r.toFixed(1) + '" fill="none" stroke="' + COUL.trait
        + '" stroke-width="1.4"/>');
    }
    // L'ANGLE DROIT SE MARQUE. Sans le petit carré, l'élève doit croire le
    // texte sur parole ; avec lui, la figure dit la même chose que l'énoncé.
    for (const a of fig.angles || []) {
      const S = P[a[1]], u = unitaire(P[a[0]], S), v = unitaire(P[a[2]], S);
      const k = 11;
      const sx = X(S), sy = Y(S);
      out.push('<path d="M ' + (sx + u[0] * k).toFixed(1) + ' ' + (sy + u[1] * k).toFixed(1)
        + ' L ' + (sx + (u[0] + v[0]) * k).toFixed(1) + ' ' + (sy + (u[1] + v[1]) * k).toFixed(1)
        + ' L ' + (sx + v[0] * k).toFixed(1) + ' ' + (sy + v[1] * k).toFixed(1)
        + '" fill="none" stroke="' + COUL.marque + '" stroke-width="1.3"/>');
    }
    // Les marques d'égalité : deux segments qui portent le même nombre de
    // traits sont égaux, et ils ne le portent que si l'énoncé le dit.
    for (const m of fig.marques || []) {
      const A = P[m[0]], C = P[m[1]], n = m[2] || 1;
      const mx = (X(A) + X(C)) / 2, my = (Y(A) + Y(C)) / 2;
      const dx = X(C) - X(A), dy = Y(C) - Y(A);
      const len = Math.hypot(dx, dy) || 1;
      const px = -dy / len * 5, py = dx / len * 5;
      for (let i = 0; i < n; i++) {
        const dec = (i - (n - 1) / 2) * 4;
        const cx = mx + dx / len * dec, cy = my + dy / len * dec;
        out.push('<line x1="' + (cx - px).toFixed(1) + '" y1="' + (cy - py).toFixed(1)
          + '" x2="' + (cx + px).toFixed(1) + '" y2="' + (cy + py).toFixed(1)
          + '" stroke="' + COUL.marque + '" stroke-width="1.3"/>');
      }
    }
    // Les points en dernier, pour qu'aucun trait ne leur passe dessus.
    for (const n of noms) {
      if ((fig.caches || []).indexOf(n) >= 0) continue;
      const p = P[n];
      out.push('<circle cx="' + X(p).toFixed(1) + '" cy="' + Y(p).toFixed(1)
        + '" r="2.6" fill="' + COUL.point + '"/>');
      // L'étiquette s'écarte du centre de la figure : posée au hasard, elle
      // finit sur un trait une fois sur trois.
      const cx = noms.reduce((s, k) => s + X(P[k]), 0) / noms.length;
      const cy = noms.reduce((s, k) => s + Y(P[k]), 0) / noms.length;
      let ux = X(p) - cx, uy = Y(p) - cy;
      const h = Math.hypot(ux, uy) || 1;
      ux = ux / h * 13; uy = uy / h * 13;
      out.push('<text x="' + (X(p) + ux).toFixed(1) + '" y="' + (Y(p) + uy + 4).toFixed(1)
        + '" text-anchor="middle" font-size="13" font-family="serif"'
        + ' font-style="italic" fill="' + COUL.point + '">' + n + '</text>');
    }
    // LE DESSIN EST LTR, MÊME DANS UNE PAGE ARABE. Sans cette déclaration,
    // l'algorithme bidi retourne les noms qui finissent par une apostrophe :
    // « (D') » s'affiche « ('D) », et l'élève cherche une droite qui n'existe
    // pas. C'est le même piège que pour le texte, à l'intérieur du SVG.
    return '<svg class="figure" direction="ltr" viewBox="0 0 ' + L + ' ' + H
      + '" width="' + L
      + '" height="' + H + '" xmlns="http://www.w3.org/2000/svg">'
      + out.join('') + '</svg>';
  }
  function unitaire(A, S) {
    // direction de S vers A, en coordonnées d'écran
    const dx = qNum(A.x) - qNum(S.x), dy = -(qNum(A.y) - qNum(S.y));
    const h = Math.hypot(dx, dy) || 1;
    return [dx / h, dy / h];
  }

  // ── Écriture ─────────────────────────────────────────────────────────────
  const ARABE = /[؀-ۿ]/;
  const echapper = s => String(s).replace(/&/g, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Le mathématique reste en LTR au milieu de l'arabe, sinon « (AB) ⊥ (CD) »
  // se retourne et ne veut plus rien dire.
  const bloc = s => '<span dir="ltr" class="expr">' + echapper(s) + '</span>';
  // Une phrase arabe qui contient des noms de points : on isole les morceaux
  // latins pour qu'ils gardent leur sens de lecture.
  // ∈ EST UN SYMBOLE MIROIR : hors d'un morceau isolé, l'algorithme bidi le
  // retourne, et « M ∈ (Δ) » s'affiche « (Δ) ∋ M ». Il doit donc appartenir au
  // morceau, comme ⊥ et //, et non flotter entre deux.
  const CAR = "A-Za-z0-9Δ∆()[\\]{}⊥∈∉/=,.;:+\\-−×√°'\"";
  const RUN = new RegExp('[' + CAR + ']+(?:\\s+[' + CAR + ']+)*', 'g');
  // UNE LETTRE SEULE EST UN NOM DE POINT, et elle doit être isolée comme les
  // autres. « و I منتصفها » sans isolation se lit « و ا منتصفها » : le I se
  // range du mauvais côté et prend l'allure d'un alef. Deux lettres suffisaient
  // pour les expressions ; un point n'en a qu'une.
  const ISOLER = /[⊥/=()[\]∈]|[A-Za-z]/;
  // UN NOM DE POINT SEUL S'ÉCRIT COMME SUR LA FIGURE. Un « I » sans empattement
  // posé au milieu de l'arabe ressemble à s'y méprendre à un alef, et l'élève
  // lit « و ا منتصفها » là où le texte dit « و I منتصفها ». En italique à
  // empattements — la lettre même que porte le dessin — le doute disparaît.
  function isoMixte(texte) {
    return String(texte).replace(RUN, m => {
      if (!ISOLER.test(m)) return echapper(m);
      const seul = /^[A-Za-z]$/.test(m) ? ' pt' : '';
      return '<span dir="ltr" class="expr' + seul + '">' + echapper(m) + '</span>';
    });
  }
  const rendreMath = s => (s && typeof s === 'object' && s.svg) ? s.svg
    : (ARABE.test(String(s)) ? isoMixte(s) : bloc(s));

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
        const CADRE = /المعطيات|النتيجة|نطبّق|نحسب|الاختيار|نفس المستقيم|^[0-9]+\)$/;
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

  // ── Registre ─────────────────────────────────────────────────────────────
  const PROBLEMES = {};
  const enregistrer = (n, def) => { PROBLEMES[n] = def; };
  const tirer = n => PROBLEMES[n].f();
  const construire = n => ({
    id: 'ex' + n,
    title: 'التمرين ' + n + ' — ' + PROBLEMES[n].titre,
    questions: contextualiser(tirer(n)).map(rendre)
  });

  const API = {
    ent, choix, melanger,
    q, Q0, Q1, qAdd, qSub, qMul, qDiv, qNeg, qNul, qEgaux, qNum, qTxt, qDec,
    pt, vec, pScal, det, carre, memesPoints,
    perp, para, aligne, memeLongueur, estMilieu, estMediatrice, droiteOk,
    milieu, surDroite, perpDepuis, projete, intersection, symetrique,
    longueur, distance, racineExacte,
    dessiner, bloc, isoMixte, rendreMath, rendre, echapper, ARABE,
    PROBLEMES, enregistrer, tirer, construire
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Droites = API;
})(typeof window !== 'undefined' ? window : globalThis);
