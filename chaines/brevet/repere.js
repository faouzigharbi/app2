// LE REPÈRE — géométrie analytique EXACTE, sur ℚ[√d].
//
// C'était le manque le plus rentable du livre de révision : deux exercices sur
// cinq de la seule séance 2 sont dans un repère, et leur géométrie — cercle de
// diamètre, milieux, Thalès, parallélogramme — était déjà connue ailleurs.
// Il ne manquait qu'un fait : les coordonnées.
//
// Un point est un couple de nombres de ℚ[√d] — la même arithmétique que les
// radicaux, donc AUCUNE approximation : « GN = 2√5 » se démontre, il ne se
// constate pas à 10⁻⁹ près. Les longueurs se calculent en CARRÉS et ne passent
// sous le radical qu'au dernier moment, exactement comme dans thales9 :
// GN² = 20 est un entier, GN = 2√5 en est l'écriture.
//
// CE MODULE NE SERT PAS À RÉDIGER LA DÉMONSTRATION — celle-ci reste écrite à la
// main, dans la langue du maître, et suit la route qu'il veut faire prendre
// (Thalès, la droite des milieux, le centre de gravité). Il sert à la
// CONTREDIRE : chaque affirmation de l'énoncé — « OABJ est un rectangle »,
// « E est le milieu de [GM] », « N et P sont confondues » — est recalculée à
// partir des seules coordonnées. Une figure fausse ne passe pas.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;

  const { sAdd, sSub, sMul, sDiv, sEch, sSqrt, sEgaux, sTxt, rat, ZERO } = F;
  const deux = F.num(2);

  // ── Points et vecteurs ──────────────────────────────────────────────────
  const pt = (x, y) => ({ x, y });
  const lire = (couple, env) => pt(F.analyser(String(couple[0]), env),
                                   F.analyser(String(couple[1]), env));
  const vect = (A, B) => pt(sSub(B.x, A.x), sSub(B.y, A.y));
  const somme = (A, u) => pt(sAdd(A.x, u.x), sAdd(A.y, u.y));
  const mise = (u, k) => pt(sMul(u.x, k), sMul(u.y, k));
  const memePoint = (A, B) => sEgaux(A.x, B.x) && sEgaux(A.y, B.y);
  const ecrire = A => '(' + sTxt(A.x) + ' ; ' + sTxt(A.y) + ')';

  // Le déterminant de deux vecteurs : nul exactement quand ils sont colinéaires.
  // C'est LE test du parallélisme et de l'alignement, et il est exact.
  const det = (u, v) => sSub(sMul(u.x, v.y), sMul(u.y, v.x));
  // Le produit scalaire : nul exactement quand les vecteurs sont orthogonaux.
  // Le repère est orthonormé — OI = OJ = 1 —, sans quoi cette formule serait fausse.
  const scal = (u, v) => sAdd(sMul(u.x, v.x), sMul(u.y, v.y));

  const nul = u => sEgaux(u.x, ZERO) && sEgaux(u.y, ZERO);
  const colin = (u, v) => sEgaux(det(u, v), ZERO);
  const ortho = (u, v) => sEgaux(scal(u, v), ZERO);

  // ── Longueurs — le carré d'abord, le radical ensuite ────────────────────
  const dist2 = (A, B) => { const u = vect(A, B); return sAdd(sMul(u.x, u.x), sMul(u.y, u.y)); };
  // Rend null plutôt qu'une approximation quand la racine ne tombe pas dans
  // ℚ[√d] : une règle qui ne sait pas se tait, elle n'invente pas.
  function dist(A, B) {
    try { return sSqrt(dist2(A, B)); } catch (e) { return null; }
  }

  // ── Les points construits ───────────────────────────────────────────────
  const milieu = (A, B) => pt(sEch(sAdd(A.x, B.x), rat(1, 2)), sEch(sAdd(A.y, B.y), rat(1, 2)));
  // Le symétrique de A par rapport à B : B est le milieu de [AA'], donc A' = 2B - A.
  const sym = (A, B) => pt(sSub(sMul(deux, B.x), A.x), sSub(sMul(deux, B.y), A.y));

  // L'intersection de (AB) et (CD), exacte. On écrit A + t·u = C + s·v et l'on
  // résout par les déterminants ; deux droites parallèles n'ont pas de point
  // d'intersection, et l'on refuse au lieu d'en fabriquer un.
  function inter(A, B, C, D) {
    const u = vect(A, B), v = vect(C, D), d = det(u, v);
    if (sEgaux(d, ZERO)) return null;
    const t = sDiv(det(vect(A, C), v), d);
    return somme(A, mise(u, t));
  }

  // ── Les prédicats de la figure ──────────────────────────────────────────
  const alignes = (A, B, C) => colin(vect(A, B), vect(A, C));
  const paral = (A, B, C, D) => colin(vect(A, B), vect(C, D));
  const perp = (A, B, C, D) => ortho(vect(A, B), vect(C, D));
  const estMilieu = (M0, A, B) => memePoint(M0, milieu(A, B));
  const estSym = (E, A, B) => memePoint(E, sym(A, B));
  // ABCD parallélogramme : AB→ = DC→. L'ordre des sommets compte, et c'est
  // volontaire — « ABDC » n'est pas la même figure, et un énoncé qui se
  // trompe de sommet doit être rejeté, pas rattrapé.
  const pgram = (A, B, C, D) => {
    const u = vect(A, B), v = vect(D, C);
    return !nul(u) && sEgaux(u.x, v.x) && sEgaux(u.y, v.y);
  };
  const losange = (A, B, C, D) =>
    pgram(A, B, C, D) && sEgaux(dist2(A, B), dist2(B, C));
  const rectangle = (A, B, C, D) => pgram(A, B, C, D) && perp(A, B, B, C);
  const carre = (A, B, C, D) => losange(A, B, C, D) && rectangle(A, B, C, D);
  // Isocèle « de sommet S » : les deux côtés issus de S sont égaux.
  const isocele = (S, X, Y) => sEgaux(dist2(S, X), dist2(S, Y)) && !memePoint(X, Y);
  const rectEn = (S, X, Y) => perp(S, X, S, Y);
  // Trapèze isocèle : (AB)//(CD), les deux autres côtés égaux, et les bases
  // DIFFÉRENTES — sinon c'est un parallélogramme, et le mot serait usurpé.
  const trapezeIso = (A, B, C, D) =>
    paral(A, B, C, D) && sEgaux(dist2(B, C), dist2(A, D))
    && !sEgaux(dist2(A, B), dist2(C, D));
  // Le cercle de diamètre [AB] : P en est le centre, et un point du cercle
  // voit [AB] sous un angle droit. Les deux formulations sont ici la même.
  const surCercleDiam = (C, A, B) => sEgaux(dist2(milieu(A, B), C),
                                            sEch(dist2(A, B), rat(1, 4)));

  // L'aire d'un polygone, par les lacets. Exacte, et le signe dit seulement
  // le sens de parcours — on le retire.
  function aire(sommets) {
    let s = ZERO;
    for (let i = 0; i < sommets.length; i++) {
      const P0 = sommets[i], P1 = sommets[(i + 1) % sommets.length];
      s = sAdd(s, sSub(sMul(P0.x, P1.y), sMul(P1.x, P0.y)));
    }
    return F.sAbs(sEch(s, rat(1, 2)));
  }

  // ── Le contrôle d'un fait ───────────────────────────────────────────────
  //
  // Un « fait » est une affirmation de l'énoncé, écrite comme le maître la dit,
  // et RECALCULÉE ici sur les seules coordonnées. La liste est délibérément
  // fermée : un mot qu'on ne sait pas contrôler doit faire échouer la
  // vérification, jamais passer en silence.
  const REGLES = {
    milieu:      (P, [m, a, b]) => estMilieu(P[m], P[a], P[b]),
    symetrique:  (P, [e, a, b]) => estSym(P[e], P[a], P[b]),
    confondus:   (P, [a, b]) => memePoint(P[a], P[b]),
    distincts:   (P, [a, b]) => !memePoint(P[a], P[b]),
    alignes:     (P, [a, b, c]) => alignes(P[a], P[b], P[c]),
    paralleles:  (P, [a, b, c, d]) => paral(P[a], P[b], P[c], P[d]),
    perpendiculaires: (P, [a, b, c, d]) => perp(P[a], P[b], P[c], P[d]),
    parallelogramme:  (P, [a, b, c, d]) => pgram(P[a], P[b], P[c], P[d]),
    losange:     (P, [a, b, c, d]) => losange(P[a], P[b], P[c], P[d]),
    rectangle:   (P, [a, b, c, d]) => rectangle(P[a], P[b], P[c], P[d]),
    carre:       (P, [a, b, c, d]) => carre(P[a], P[b], P[c], P[d]),
    'trapeze-isocele': (P, [a, b, c, d]) => trapezeIso(P[a], P[b], P[c], P[d]),
    isocele:     (P, [s, x, y]) => isocele(P[s], P[x], P[y]),
    'rectangle-en': (P, [s, x, y]) => rectEn(P[s], P[x], P[y]),
    'sur-cercle-diametre': (P, [c, a, b]) => surCercleDiam(P[c], P[a], P[b]),
    // « M est sur le cercle de centre O passant par A » — le cercle nommé.
    'sur-cercle': (P, [m, o, a]) => sEgaux(dist2(P[o], P[m]), dist2(P[o], P[a])),
    equilateral: (P, [a, b, c]) => sEgaux(dist2(P[a], P[b]), dist2(P[b], P[c]))
                                && sEgaux(dist2(P[b], P[c]), dist2(P[c], P[a]))
                                && !memePoint(P[a], P[b]),
    // Le centre de gravité : à l'intersection des médianes, donc à la moyenne
    // des trois sommets. On le recalcule, on ne le suppose pas.
    'centre-gravite': (P, [g, a, b, c]) => memePoint(P[g],
      pt(sEch(sAdd(sAdd(P[a].x, P[b].x), P[c].x), rat(1, 3)),
         sEch(sAdd(sAdd(P[a].y, P[b].y), P[c].y), rat(1, 3)))),
    // L'orthocentre : chaque hauteur y passe. Deux suffisent à le définir, la
    // troisième est le théorème — on vérifie donc les trois.
    orthocentre: (P, [h, a, b, c]) => perp(P[a], P[h], P[b], P[c])
                                   && perp(P[b], P[h], P[a], P[c])
                                   && perp(P[c], P[h], P[a], P[b]),
    // Une longueur, un rapport, une aire, une coordonnée : la valeur attendue
    // est écrite en toutes lettres et analysée, pas comparée à un flottant.
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
    aire:        (P, args, env) => {
      const v = args[args.length - 1];
      const som = args.slice(0, -1).map(n => P[n]);
      return sEgaux(aire(som), F.analyser(String(v), env));
    },
    abscisse:    (P, [a, v], env) => sEgaux(P[a].x, F.analyser(String(v), env)),
    ordonnee:    (P, [a, v], env) => sEgaux(P[a].y, F.analyser(String(v), env)),
    'signe-ordonnee': (P, [a, s]) => F.sSigne(P[a].y) === Number(s),
    // Les coordonnées dans UN AUTRE repère (B ; E ; G) : on résout
    // BM→ = x·BE→ + y·BG→ par les déterminants, et l'on compare.
    'coordonnees-dans': (P, [m, o, i, j, cx, cy], env) => {
      const u = vect(P[o], P[i]), v = vect(P[o], P[j]), w = vect(P[o], P[m]);
      const d = det(u, v);
      if (sEgaux(d, ZERO)) return false;
      return sEgaux(sDiv(det(w, v), d), F.analyser(String(cx), env))
          && sEgaux(sDiv(det(u, w), d), F.analyser(String(cy), env));
    }
  };

  // Construit les points d'une figure, DANS L'ORDRE DÉCLARÉ. Chaque entrée est
  // soit un point posé — ['point', '2', '0'] —, soit une CONSTRUCTION à partir
  // des points déjà posés : ['milieu', 'A', 'B'], ['inter', 'G', 'E', 'O', 'J'].
  // Aucune coordonnée calculée à la main n'est recopiée : le point construit
  // est CALCULÉ, et c'est ce qui permet à l'énoncé de se tromper et d'être pris.
  function figure(decl, env) {
    const P = {};
    for (const nom of Object.keys(decl)) {
      const d = decl[nom];
      switch (d[0]) {
        case 'point':   P[nom] = lire([d[1], d[2]], env); break;
        case 'milieu':  P[nom] = milieu(P[d[1]], P[d[2]]); break;
        case 'sym':     P[nom] = sym(P[d[1]], P[d[2]]); break;
        case 'inter': {
          const X = inter(P[d[1]], P[d[2]], P[d[3]], P[d[4]]);
          if (!X) throw new Error('droites parallèles : ' + nom);
          P[nom] = X; break;
        }
        // Le translaté : ABCD parallélogramme donne D = A + BC→.
        case 'translate': P[nom] = somme(P[d[1]], vect(P[d[2]], P[d[3]])); break;
        // Le projeté ORTHOGONAL de M sur (AB) — le pied de la hauteur, le pied
        // de la perpendiculaire. Il se calcule par le produit scalaire, et le
        // repère est orthonormé, donc la formule est exacte.
        case 'proj': {
          const A0 = P[d[2]], u = vect(A0, P[d[3]]);
          const k = sDiv(scal(vect(A0, P[d[1]]), u), scal(u, u));
          P[nom] = somme(A0, mise(u, k)); break;
        }
        default: throw new Error('construction inconnue « ' + d[0] +' » pour ' + nom);
      }
    }
    return P;
  }

  // Les noms que les étapes ont le droit d'employer : les coordonnées xA, yA,
  // et les longueurs AB — dans les deux ordres, parce que l'énoncé écrit EA
  // là où le calcul écrirait AE, et que les deux désignent le même segment.
  function nommer(P) {
    const env = {};
    for (const a of Object.keys(P)) {
      env['x' + a] = P[a].x;
      env['y' + a] = P[a].y;
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

  const API = { pt, lire, vect, somme, mise, memePoint, ecrire, det, scal, colin, ortho,
                dist2, dist, milieu, sym, inter, alignes, paral, perp, estMilieu, estSym,
                pgram, losange, rectangle, carre, isocele, rectEn, trapezeIso,
                surCercleDiam, aire, REGLES, figure, nommer, verifierFaits };
  if (M) module.exports = API; else racine.Repere = API;
})(typeof window !== 'undefined' ? window : globalThis);
