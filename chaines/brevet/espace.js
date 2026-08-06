// L'ESPACE — géométrie analytique EXACTE en dimension 3, sur ℚ[√d].
//
// Pendant tout le dépouillement des deux livres de révision, une dizaine
// d'exercices ont été écartés sous le même motif : « la géométrie de l'espace
// n'a aucun chapitre ». Le motif était honnête mais il ne portait pas sur les
// mathématiques : il portait sur la MACHINE. `repere.js` ne connaît que des
// couples (x ; y) ; un sommet de pyramide n'y entre pas. Et la règle du projet
// est de ne jamais porter ce qu'on ne sait pas RECALCULER — un énoncé qu'on
// recopierait sans le contredire n'a rien à faire dans la bibliothèque.
//
// Ce module supprime le motif. Un point est un triplet de nombres de ℚ[√d], et
// tout le reste suit : le produit scalaire donne l'orthogonalité, le produit
// vectoriel donne l'alignement et la direction normale d'un plan, le
// déterminant des trois vecteurs donne la coplanarité — donc « (AC) ⊥ (SBD) »
// se recalcule, « SABCD est un hexaèdre régulier » se recalcule, et « SA = 6 »
// se fait contredire quand c'est faux.
//
// Comme dans le plan, les longueurs se calculent en CARRÉS et ne passent sous
// le radical qu'au dernier moment : CK² = 27/2 est exact, CK = 3√6/2 en est
// l'écriture, et aucune décimale n'intervient nulle part.
//
// Ce module NE RÉDIGE PAS la démonstration. L'élève de neuvième ne pose pas de
// coordonnées dans l'espace — il travaille avec « la droite perpendiculaire au
// plan est perpendiculaire à toute droite du plan » et avec Pythagore dans un
// triangle qu'il a su placer. La rédaction reste écrite à la main, dans cette
// langue-là ; les coordonnées ne servent qu'ici, à la contredire.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;

  const { sAdd, sSub, sMul, sDiv, sEch, sSqrt, sEgaux, sTxt, rat, ZERO } = F;
  const deux = F.num(2);

  // ── Points et vecteurs ──────────────────────────────────────────────────
  const pt = (x, y, z) => ({ x, y, z });
  const lire = (t, env) => pt(F.analyser(String(t[0]), env),
                              F.analyser(String(t[1]), env),
                              F.analyser(String(t[2]), env));
  const vect = (A, B) => pt(sSub(B.x, A.x), sSub(B.y, A.y), sSub(B.z, A.z));
  const somme = (A, u) => pt(sAdd(A.x, u.x), sAdd(A.y, u.y), sAdd(A.z, u.z));
  const mise = (u, k) => pt(sMul(u.x, k), sMul(u.y, k), sMul(u.z, k));
  const memePoint = (A, B) => sEgaux(A.x, B.x) && sEgaux(A.y, B.y) && sEgaux(A.z, B.z);
  const ecrire = A => '(' + sTxt(A.x) + ' ; ' + sTxt(A.y) + ' ; ' + sTxt(A.z) + ')';

  // Le produit scalaire — nul exactement quand les vecteurs sont orthogonaux.
  // Le repère de contrôle est orthonormé, sans quoi la formule serait fausse ;
  // c'est nous qui posons les coordonnées, donc il l'est.
  const scal = (u, v) => sAdd(sAdd(sMul(u.x, v.x), sMul(u.y, v.y)), sMul(u.z, v.z));
  // Le produit vectoriel — nul exactement quand les vecteurs sont colinéaires.
  // Il remplace le déterminant du plan, qui n'a plus de sens ici, et il donne
  // en prime la direction normale d'un plan.
  const croix = (u, v) => pt(sSub(sMul(u.y, v.z), sMul(u.z, v.y)),
                             sSub(sMul(u.z, v.x), sMul(u.x, v.z)),
                             sSub(sMul(u.x, v.y), sMul(u.y, v.x)));
  // Le déterminant des trois vecteurs — nul exactement quand ils sont
  // coplanaires. C'est LE test de « ces quatre points sont dans un même plan ».
  const det3 = (u, v, w) => scal(u, croix(v, w));

  const nul = u => sEgaux(u.x, ZERO) && sEgaux(u.y, ZERO) && sEgaux(u.z, ZERO);
  const colin = (u, v) => nul(croix(u, v));
  const ortho = (u, v) => sEgaux(scal(u, v), ZERO);

  // ── Longueurs — le carré d'abord, le radical ensuite ────────────────────
  const dist2 = (A, B) => { const u = vect(A, B); return scal(u, u); };
  // Rend null plutôt qu'une approximation quand la racine ne tombe pas dans
  // ℚ[√d] : une règle qui ne sait pas se tait, elle n'invente pas.
  function dist(A, B) {
    try { return sSqrt(dist2(A, B)); } catch (e) { return null; }
  }

  // ── Les points construits ───────────────────────────────────────────────
  const milieu = (A, B) => pt(sEch(sAdd(A.x, B.x), rat(1, 2)),
                              sEch(sAdd(A.y, B.y), rat(1, 2)),
                              sEch(sAdd(A.z, B.z), rat(1, 2)));
  const sym = (A, B) => pt(sSub(sMul(deux, B.x), A.x),
                           sSub(sMul(deux, B.y), A.y),
                           sSub(sMul(deux, B.z), A.z));
  // L'isobarycentre de n points — le centre d'un carré, le centre de gravité
  // d'un triangle, le centre d'un cube. Il se calcule, il ne se pose pas.
  function centre(pts) {
    let s = pt(ZERO, ZERO, ZERO);
    for (const P of pts) s = somme(s, vect(pt(ZERO, ZERO, ZERO), P));
    return mise(s, rat(1, pts.length));
  }

  // Le projeté ORTHOGONAL de M sur la droite (AB) — le pied de la hauteur.
  function projDroite(M0, A, B) {
    const u = vect(A, B);
    if (nul(u)) return null;
    return somme(A, mise(u, sDiv(scal(vect(A, M0), u), scal(u, u))));
  }
  // Le projeté ORTHOGONAL de M sur le PLAN (ABC) — le pied de la hauteur d'une
  // pyramide, le centre de la base. Trois points alignés ne définissent pas de
  // plan : on refuse au lieu d'inventer.
  function projPlan(M0, A, B, C) {
    const n = croix(vect(A, B), vect(A, C));
    if (nul(n)) return null;
    return somme(M0, mise(n, F.sNeg(sDiv(scal(vect(A, M0), n), scal(n, n)))));
  }
  // L'intersection de (AB) et (CD) quand elle existe : dans l'espace deux
  // droites sont le plus souvent NON COPLANAIRES, et alors il n'y a rien à
  // rendre. C'est le cas normal, pas une erreur — mais ce n'est pas un point.
  function inter(A, B, C, D) {
    const u = vect(A, B), v = vect(C, D), w = vect(A, C);
    if (!sEgaux(det3(w, u, v), ZERO)) return null;   // non coplanaires
    const n = croix(u, v);
    if (nul(n)) return null;                          // parallèles
    const t = sDiv(scal(croix(w, v), n), scal(n, n));
    return somme(A, mise(u, t));
  }

  // ── Les prédicats de la figure ──────────────────────────────────────────
  const alignes = (A, B, C) => colin(vect(A, B), vect(A, C));
  const coplanaires = (A, B, C, D) => sEgaux(det3(vect(A, B), vect(A, C), vect(A, D)), ZERO);
  const paral = (A, B, C, D) => colin(vect(A, B), vect(C, D));
  const perp = (A, B, C, D) => ortho(vect(A, B), vect(C, D));
  const estMilieu = (M0, A, B) => memePoint(M0, milieu(A, B));
  const estSym = (E, A, B) => memePoint(E, sym(A, B));

  // La droite (AB) est perpendiculaire au PLAN (CDE) : elle est orthogonale à
  // DEUX droites sécantes du plan, donc à toutes. C'est le théorème que
  // l'élève applique, et c'est exactement ce qu'on recalcule — avec la
  // condition que le plan en soit un, c'est-à-dire que C, D, E ne soient pas
  // alignés.
  const perpPlan = (A, B, C, D, E) =>
    !nul(vect(A, B)) && !alignes(C, D, E)
    && ortho(vect(A, B), vect(C, D)) && ortho(vect(A, B), vect(C, E));
  // La droite (AB) est PARALLÈLE au plan (CDE) : orthogonale à sa normale, et
  // A hors du plan — sinon elle y est contenue, ce qui n'est pas la même chose.
  const paralPlan = (A, B, C, D, E) =>
    !alignes(C, D, E) && ortho(vect(A, B), croix(vect(C, D), vect(C, E)))
    && !coplanaires(C, D, E, A);

  // Les quadrilatères. Dans l'espace, ABCD parallélogramme (AB→ = DC→) est
  // automatiquement plan — c'est le vecteur qui l'impose, pas une hypothèse.
  const pgram = (A, B, C, D) => {
    const u = vect(A, B), v = vect(D, C);
    return !nul(u) && sEgaux(u.x, v.x) && sEgaux(u.y, v.y) && sEgaux(u.z, v.z);
  };
  const losange = (A, B, C, D) => pgram(A, B, C, D) && sEgaux(dist2(A, B), dist2(B, C));
  const rectangle = (A, B, C, D) => pgram(A, B, C, D) && perp(A, B, B, C);
  const carre = (A, B, C, D) => losange(A, B, C, D) && rectangle(A, B, C, D);
  const isocele = (S, X, Y) => sEgaux(dist2(S, X), dist2(S, Y)) && !memePoint(X, Y);
  const rectEn = (S, X, Y) => perp(S, X, S, Y) && !memePoint(S, X) && !memePoint(S, Y);
  const equilateral = (A, B, C) => sEgaux(dist2(A, B), dist2(B, C))
                                && sEgaux(dist2(B, C), dist2(C, A))
                                && !memePoint(A, B);

  // Le volume d'un tétraèdre — le sixième de la valeur absolue du déterminant.
  // Il est EXACT, sans passer par une hauteur ni par une aire, ce qui est
  // précieux : la hauteur d'une pyramide oblique ne tombe pas toujours dans
  // ℚ[√d], le déterminant, lui, y tombe toujours.
  const volTetra = (A, B, C, D) =>
    F.sAbs(sEch(det3(vect(A, B), vect(A, C), vect(A, D)), rat(1, 6)));
  // Le volume d'une pyramide de base polygonale, par découpage en tétraèdres
  // depuis le premier sommet de la base. La base doit être PLANE et convexe —
  // la planéité est vérifiée, c'est la moindre des choses.
  function volume(sommet, base) {
    for (let i = 3; i <= base.length; i++)
      if (!coplanaires(base[0], base[1], base[2], base[i - 1])) return null;
    let v = ZERO;
    for (let i = 1; i + 1 < base.length; i++)
      v = sAdd(v, volTetra(sommet, base[0], base[i], base[i + 1]));
    return v;
  }
  // L'aire d'un triangle — la moitié de la norme du produit vectoriel. Rend
  // null quand la racine n'est pas exacte, comme la distance.
  function aireTri(A, B, C) {
    const n = croix(vect(A, B), vect(A, C));
    try { return sEch(sSqrt(scal(n, n)), rat(1, 2)); } catch (e) { return null; }
  }
  // L'aire d'un polygone PLAN de l'espace, par découpage en triangles. On
  // somme les CARRÉS ? non : les aires ne s'ajoutent qu'une fois extraites, et
  // chaque morceau doit donc être exact. Sinon on se tait.
  function aire(sommets) {
    for (let i = 3; i < sommets.length; i++)
      if (!coplanaires(sommets[0], sommets[1], sommets[2], sommets[i])) return null;
    let s = ZERO;
    for (let i = 1; i + 1 < sommets.length; i++) {
      const a = aireTri(sommets[0], sommets[i], sommets[i + 1]);
      if (a === null) return null;
      s = sAdd(s, a);
    }
    return s;
  }

  // ── Le contrôle d'un fait ───────────────────────────────────────────────
  //
  // Même contrat que dans le plan : la liste est FERMÉE. Un mot qu'on ne sait
  // pas contrôler fait échouer la vérification, il ne passe pas en silence.
  const REGLES = {
    milieu:      (P, [m, a, b]) => estMilieu(P[m], P[a], P[b]),
    symetrique:  (P, [e, a, b]) => estSym(P[e], P[a], P[b]),
    confondus:   (P, [a, b]) => memePoint(P[a], P[b]),
    distincts:   (P, [a, b]) => !memePoint(P[a], P[b]),
    alignes:     (P, [a, b, c]) => alignes(P[a], P[b], P[c]),
    'non-alignes': (P, [a, b, c]) => !alignes(P[a], P[b], P[c]),
    coplanaires: (P, args) => args.slice(3).every((_, i) =>
                    coplanaires(P[args[0]], P[args[1]], P[args[2]], P[args[3 + i]])),
    'non-coplanaires': (P, [a, b, c, d]) => !coplanaires(P[a], P[b], P[c], P[d]),
    paralleles:  (P, [a, b, c, d]) => paral(P[a], P[b], P[c], P[d]),
    perpendiculaires: (P, [a, b, c, d]) => perp(P[a], P[b], P[c], P[d]),
    // « (AC) ⊥ (SBD) » — une droite et un PLAN, le fait central de tous ces
    // exercices, et celui qu'aucun chapitre ne savait recalculer jusqu'ici.
    'perpendiculaire-plan': (P, [a, b, c, d, e]) => perpPlan(P[a], P[b], P[c], P[d], P[e]),
    'parallele-plan': (P, [a, b, c, d, e]) => paralPlan(P[a], P[b], P[c], P[d], P[e]),
    'dans-plan': (P, [m, c, d, e]) => !alignes(P[c], P[d], P[e])
                                    && coplanaires(P[c], P[d], P[e], P[m]),
    'hors-plan': (P, [m, c, d, e]) => !alignes(P[c], P[d], P[e])
                                    && !coplanaires(P[c], P[d], P[e], P[m]),
    parallelogramme: (P, [a, b, c, d]) => pgram(P[a], P[b], P[c], P[d]),
    losange:     (P, [a, b, c, d]) => losange(P[a], P[b], P[c], P[d]),
    rectangle:   (P, [a, b, c, d]) => rectangle(P[a], P[b], P[c], P[d]),
    carre:       (P, [a, b, c, d]) => carre(P[a], P[b], P[c], P[d]),
    isocele:     (P, [s, x, y]) => isocele(P[s], P[x], P[y]),
    'rectangle-en': (P, [s, x, y]) => rectEn(P[s], P[x], P[y]),
    equilateral: (P, [a, b, c]) => equilateral(P[a], P[b], P[c]),
    // Une pyramide RÉGULIÈRE : base un polygone régulier — ici on demande que
    // tous les sommets de la base soient à la même distance du centre et que
    // le sommet se projette EXACTEMENT sur ce centre. C'est la définition,
    // recalculée, et non le dessin en perspective qui la suggère.
    'pyramide-reguliere': (P, args) => {
      const s = P[args[0]], o = P[args[1]], base = args.slice(2).map(n => P[n]);
      if (base.length < 3) return false;
      if (!memePoint(o, centre(base))) return false;
      for (let i = 1; i < base.length; i++)
        if (!sEgaux(dist2(o, base[0]), dist2(o, base[i]))) return false;
      const h = projPlan(s, base[0], base[1], base[2]);
      return h !== null && memePoint(h, o);
    },
    // Le projeté orthogonal, nommé par l'énoncé : « K est le projeté
    // orthogonal de O sur [SB] ».
    'projete-droite': (P, [k, m, a, b]) => {
      const q = projDroite(P[m], P[a], P[b]);
      return q !== null && memePoint(P[k], q);
    },
    'projete-plan': (P, [k, m, a, b, c]) => {
      const q = projPlan(P[m], P[a], P[b], P[c]);
      return q !== null && memePoint(P[k], q);
    },
    'centre-gravite': (P, [g, a, b, c]) => memePoint(P[g], centre([P[a], P[b], P[c]])),
    centre:      (P, args) => memePoint(P[args[0]], centre(args.slice(1).map(n => P[n]))),
    // Les valeurs : écrites en toutes lettres et analysées, jamais comparées
    // à un flottant.
    longueur:    (P, [a, b, v], env) => {
      const d = dist(P[a], P[b]);
      return d !== null && sEgaux(d, F.analyser(String(v), env));
    },
    'longueur-carree': (P, [a, b, v], env) =>
      sEgaux(dist2(P[a], P[b]), F.analyser(String(v), env)),
    rapport:     (P, [a, b, c, d, v], env) => {
      const g = dist(P[a], P[b]), h = dist(P[c], P[d]);
      return g !== null && h !== null && sEgaux(sDiv(g, h), F.analyser(String(v), env));
    },
    volume:      (P, args, env) => {
      const v = args[args.length - 1];
      const q = volume(P[args[0]], args.slice(1, -1).map(n => P[n]));
      return q !== null && sEgaux(q, F.analyser(String(v), env));
    },
    aire:        (P, args, env) => {
      const v = args[args.length - 1];
      const q = aire(args.slice(0, -1).map(n => P[n]));
      return q !== null && sEgaux(q, F.analyser(String(v), env));
    },
    abscisse:    (P, [a, v], env) => sEgaux(P[a].x, F.analyser(String(v), env)),
    ordonnee:    (P, [a, v], env) => sEgaux(P[a].y, F.analyser(String(v), env)),
    cote:        (P, [a, v], env) => sEgaux(P[a].z, F.analyser(String(v), env))
  };

  // Construit les points d'un SOLIDE, dans l'ordre déclaré. Comme dans le plan,
  // aucune coordonnée calculée à la main n'est recopiée : le point construit
  // est CALCULÉ, et c'est ce qui permet à l'énoncé de se tromper et d'être pris.
  function figure(decl, env) {
    const P = {};
    for (const nom of Object.keys(decl)) {
      const d = decl[nom];
      switch (d[0]) {
        case 'point':   P[nom] = lire([d[1], d[2], d[3]], env); break;
        case 'milieu':  P[nom] = milieu(P[d[1]], P[d[2]]); break;
        case 'sym':     P[nom] = sym(P[d[1]], P[d[2]]); break;
        case 'centre':  P[nom] = centre(d.slice(1).map(n => P[n])); break;
        // Le translaté : ABCD parallélogramme donne D = A + BC→.
        case 'translate': P[nom] = somme(P[d[1]], vect(P[d[2]], P[d[3]])); break;
        case 'proj': {
          const X = projDroite(P[d[1]], P[d[2]], P[d[3]]);
          if (!X) throw new Error('droite dégénérée : ' + nom);
          P[nom] = X; break;
        }
        case 'projplan': {
          const X = projPlan(P[d[1]], P[d[2]], P[d[3]], P[d[4]]);
          if (!X) throw new Error('plan dégénéré : ' + nom);
          P[nom] = X; break;
        }
        case 'inter': {
          const X = inter(P[d[1]], P[d[2]], P[d[3]], P[d[4]]);
          if (!X) throw new Error('droites non sécantes : ' + nom);
          P[nom] = X; break;
        }
        // Le point de [AB] tel que AM = k·AB — la section d'une arête, le
        // point qui coupe une hauteur au tiers.
        case 'sur': P[nom] = somme(P[d[1]], mise(vect(P[d[1]], P[d[2]]),
                                                 F.analyser(String(d[3]), env))); break;
        default: throw new Error('construction inconnue « ' + d[0] + ' » pour ' + nom);
      }
    }
    return P;
  }

  // Les noms que les étapes ont le droit d'employer : les coordonnées xA, yA,
  // zA — dont l'élève ne se sert jamais, mais dont la falsification se sert —
  // et les longueurs AB, dans les deux ordres.
  function nommer(P) {
    const env = {};
    for (const a of Object.keys(P)) {
      env['x' + a] = P[a].x;
      env['y' + a] = P[a].y;
      env['z' + a] = P[a].z;
      for (const b of Object.keys(P)) {
        if (a === b) continue;
        const d = dist(P[a], P[b]);
        if (d !== null) env[a + b] = d;
      }
    }
    return env;
  }

  function verifierFaits(faits, P, env) {
    const p = [];
    for (const f of (faits || [])) {
      const r = REGLES[f[0]];
      if (!r) { p.push('واقعة غير معروفة: ' + f[0]); continue; }
      const args = f.slice(1);
      if (args.some(a => typeof a === 'string' && /^[A-Z]$/.test(a) && !P[a])) {
        p.push('نقطة غير معرّفة في: ' + f.join(' ')); continue;
      }
      let ok;
      try { ok = r(P, args, env); }
      catch (e) { p.push('تعذّر « ' + f.join(' ') + ' » (' + e.message + ')'); continue; }
      if (!ok) p.push('واقعة فاسدة: ' + f.join(' '));
    }
    return p;
  }

  const API = { pt, lire, vect, somme, mise, memePoint, ecrire, scal, croix, det3,
                colin, ortho, dist2, dist, milieu, sym, centre, projDroite, projPlan,
                inter, alignes, coplanaires, paral, perp, estMilieu, estSym,
                perpPlan, paralPlan, pgram, losange, rectangle, carre, isocele,
                rectEn, equilateral, volTetra, volume, aireTri, aire,
                REGLES, figure, nommer, verifierFaits };
  if (M) module.exports = API; else racine.Espace = API;
})(typeof window !== 'undefined' ? window : globalThis);
