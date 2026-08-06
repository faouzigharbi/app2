// LA FIGURE — dessinée à partir des FAITS, jamais à la main.
//
// Un exercice de géométrie n'est complet qu'avec son dessin. Les 81 pages du
// brevet n'en avaient aucun : l'élève lisait « بيّن أنّ M و C و H على استقامة
// واحدة » sans rien voir.
//
// LE PRINCIPE, et il n'est pas négociable. La figure ne se dessine pas à la
// main : elle se DÉDUIT de ce que le validateur recalcule déjà. Chaque
// exercice déclare
//
//     faits: [['longueur','A','C','2√5'], ['rectangle-en','C','A','D'],
//             ['alignes','A','B','D'],    ['milieu','D','B','E']]
//
// et tout le dessin est là-dedans : une longueur est un segment, un alignement
// une droite, un « rectangle-en » une marque d'angle droit, un milieu deux
// tirets. Une figure tirée des faits NE PEUT PAS contredire l'exercice — elle
// sort de ce qui a été vérifié un million de fois. Une figure dessinée à la
// main serait une seconde source de vérité, donc une source d'erreur.
//
// Ce module ne dessine QUE le plan (`controle.points`). L'espace viendra
// ensuite : seul le calcul des coordonnées écran changera.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;
  const R = M ? require('./repere.js') : racine.Repere;

  // ── Ce que chaque fait met sur le papier ────────────────────────────────
  //
  // `seg` : les segments à tracer. `droite` : les traits qui dépassent leurs
  // deux points, comme au tableau. `droit` : une marque d'angle droit, sommet
  // d'abord. `cercle` : centre puis point du bord. `tic` : deux longueurs
  // qu'on affirme égales, et qu'on marque d'un même tiret.
  const TRAITS = {
    longueur:            a => ({ seg: [[a[0], a[1]]] }),
    'longueur-carree':   a => ({ seg: [[a[0], a[1]]] }),
    rapport:             a => ({ seg: [[a[0], a[1]], [a[2], a[3]]] }),
    alignes:             a => ({ droite: [[a[0], a[2]]] }),
    paralleles:          a => ({ droite: [[a[0], a[1]], [a[2], a[3]]] }),
    perpendiculaires:    a => ({ droite: [[a[0], a[1]], [a[2], a[3]]] }),
    milieu:              a => ({ seg: [[a[1], a[2]]], tic: [[a[1], a[0]], [a[0], a[2]]] }),
    symetrique:          a => ({ seg: [[a[1], a[0]]], tic: [[a[1], a[2]], [a[2], a[0]]] }),
    parallelogramme:     a => ({ seg: cotes(a) }),
    losange:             a => ({ seg: cotes(a) }),
    rectangle:           a => ({ seg: cotes(a), droit: [[a[1], a[0], a[2]]] }),
    carre:               a => ({ seg: cotes(a), droit: [[a[1], a[0], a[2]]] }),
    'trapeze-isocele':   a => ({ seg: cotes(a) }),
    isocele:             a => ({ seg: [[a[0], a[1]], [a[0], a[2]], [a[1], a[2]]],
                                 tic: [[a[0], a[1]], [a[0], a[2]]] }),
    equilateral:         a => ({ seg: [[a[0], a[1]], [a[1], a[2]], [a[2], a[0]]],
                                 tic: [[a[0], a[1]], [a[1], a[2]], [a[2], a[0]]] }),
    'rectangle-en':      a => ({ seg: [[a[0], a[1]], [a[0], a[2]], [a[1], a[2]]],
                                 droit: [[a[0], a[1], a[2]]] }),
    'centre-gravite':    a => ({ seg: [[a[1], a[2]], [a[2], a[3]], [a[3], a[1]]] }),
    orthocentre:         a => ({ seg: [[a[1], a[2]], [a[2], a[3]], [a[3], a[1]]] }),
    'sur-cercle-diametre': a => ({ seg: [[a[1], a[2]]], cercleDiam: [[a[1], a[2]]] }),
    'sur-cercle':        a => ({ cercle: [[a[1], a[2]]] })
  };
  const cotes = a => [[a[0], a[1]], [a[1], a[2]], [a[2], a[3]], [a[3], a[0]]];

  // ── Le mètre : chaque chose posée déclare son encombrement ──────────────
  // Sans lui, une étiquette écrite hors des points se fait couper par le cadre.
  function metre() {
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    return {
      pt(x, y, dx, dy) {
        x0 = Math.min(x0, x - dx); x1 = Math.max(x1, x + dx);
        y0 = Math.min(y0, y - dy); y1 = Math.max(y1, y + dy);
      },
      boite: () => ({ x0, x1, y0, y1 })
    };
  }

  const NOIR = '#2c3e50', ROUGE = '#c0392b';
  const nb = v => (Math.round(v * 10) / 10);
  const trait = (a, b, c, w) => '<line x1="' + nb(a[0]) + '" y1="' + nb(a[1])
    + '" x2="' + nb(b[0]) + '" y2="' + nb(b[1]) + '" stroke="' + (c || NOIR)
    + '" stroke-width="' + (w || 1.7) + '"/>';
  const unit = (a, b) => {
    const h = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return [(b[0] - a[0]) / h, (b[1] - a[1]) / h];
  };

  // ── Le dessin ───────────────────────────────────────────────────────────
  //
  // `decl` est la déclaration de figure de l'exercice (`controle.points`), et
  // `faits` la liste que le validateur contrôle. On ne reçoit rien d'autre :
  // pas de coordonnées écrites à la main, pas de segments choisis à l'œil.
  function dessiner(decl, faits, env) {
    let P;
    try { P = R.figure(decl, env || {}); } catch (e) { return null; }
    const noms = Object.keys(P);
    // Les points de service — ceux qui n'existent que pour construire une
    // droite auxiliaire — ne se dessinent pas. Ils portent une minuscule.
    const vus = noms.filter(n => /^[A-Z]$/.test(n));
    if (vus.length < 3) return null;

    const XY = {};
    for (const n of vus) {
      const x = F.sVal(P[n].x), y = F.sVal(P[n].y);
      if (!isFinite(x) || !isFinite(y)) return null;
      XY[n] = [x, y];
    }

    // Le cadrage : on met la figure à l'échelle sans la déformer, et l'écran
    // descend là où le plan monte — d'où l'ordonnée retournée.
    const m0 = metre();
    for (const n of vus) m0.pt(XY[n][0], XY[n][1], 0, 0);
    const b0 = m0.boite();
    const ECH = Math.min(240 / Math.max(b0.x1 - b0.x0, 0.001),
                         190 / Math.max(b0.y1 - b0.y0, 0.001), 60);
    const pos = n => [(XY[n][0] - b0.x0) * ECH, (b0.y1 - XY[n][1]) * ECH];

    // Ce que les faits demandent, sans doublon : deux faits peuvent réclamer
    // le même segment, il ne se trace qu'une fois.
    const seg = new Set(), droite = new Set(), tic = [], droit = [], rond = [];
    for (const f of (faits || [])) {
      const regle = TRAITS[f[0]];
      if (!regle) continue;
      const args = f.slice(1);
      if (args.some(a => typeof a === 'string' && /^[A-Z]$/.test(a) && !XY[a])) continue;
      let d;
      try { d = regle(args); } catch (e) { continue; }
      const bon = c => c.every(n => XY[n]);
      (d.seg || []).forEach(c => { if (bon(c)) seg.add(c.slice().sort().join('')); });
      (d.droite || []).forEach(c => { if (bon(c)) droite.add(c.slice().sort().join('')); });
      (d.tic || []).forEach(c => { if (bon(c)) tic.push(c); });
      (d.droit || []).forEach(c => { if (bon(c)) droit.push(c); });
      (d.cercle || []).forEach(c => { if (bon(c)) rond.push({ c: c[0], b: c[1] }); });
      (d.cercleDiam || []).forEach(c => { if (bon(c)) rond.push({ d: c }); });
    }
    if (!seg.size && !droite.size) return null;

    const M2 = metre(), out = [];
    for (const n of vus) { const p = pos(n); M2.pt(p[0], p[1], 3, 3); }

    // Les cercles d'abord : ils passent sous les traits.
    for (const r of rond) {
      let c, ray;
      if (r.d) { const a = pos(r.d[0]), b = pos(r.d[1]);
                 c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
                 ray = Math.hypot(b[0] - a[0], b[1] - a[1]) / 2; }
      else { c = pos(r.c); const b = pos(r.b);
             ray = Math.hypot(b[0] - c[0], b[1] - c[1]); }
      if (!(ray > 1)) continue;
      out.push('<circle cx="' + nb(c[0]) + '" cy="' + nb(c[1]) + '" r="' + nb(ray)
        + '" fill="none" stroke="' + NOIR + '" stroke-width="1.2" opacity=".55"/>');
      M2.pt(c[0], c[1], ray, ray);
    }
    // Les droites dépassent leurs deux points, comme au tableau.
    for (const cle of droite) {
      const a = pos(cle[0]), b = pos(cle[1]);
      const u = unit(a, b), e = 24;
      const p1 = [a[0] - u[0] * e, a[1] - u[1] * e];
      const p2 = [b[0] + u[0] * e, b[1] + u[1] * e];
      out.push(trait(p1, p2, NOIR, 1.4));
      M2.pt(p1[0], p1[1], 1, 1); M2.pt(p2[0], p2[1], 1, 1);
    }
    for (const cle of seg) out.push(trait(pos(cle[0]), pos(cle[1])));

    // La marque d'angle droit, au sommet.
    for (const [s, x, y] of droit) {
      const S = pos(s), u = unit(S, pos(x)), v = unit(S, pos(y)), t = 11;
      out.push('<polyline points="' + nb(S[0] + u[0] * t) + ',' + nb(S[1] + u[1] * t)
        + ' ' + nb(S[0] + (u[0] + v[0]) * t) + ',' + nb(S[1] + (u[1] + v[1]) * t)
        + ' ' + nb(S[0] + v[0] * t) + ',' + nb(S[1] + v[1] * t)
        + '" fill="none" stroke="' + ROUGE + '" stroke-width="1.3"/>');
    }
    // Les tirets d'égalité, au milieu du segment, perpendiculaires à lui.
    for (const [a, b] of tic) {
      const A = pos(a), B = pos(b);
      const c = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], u = unit(A, B), t = 4;
      out.push(trait([c[0] - u[1] * t, c[1] + u[0] * t],
                     [c[0] + u[1] * t, c[1] - u[0] * t], ROUGE, 1.4));
    }

    // Les points et leurs lettres. L'étiquette part À L'OPPOSÉ du centre de la
    // figure : c'est le seul placement qui ne la fasse jamais tomber sur un
    // trait, et c'est ce que fait la main au tableau.
    let cx = 0, cy = 0;
    for (const n of vus) { const p = pos(n); cx += p[0]; cy += p[1]; }
    cx /= vus.length; cy /= vus.length;
    for (const n of vus) {
      const p = pos(n);
      const u = unit([cx, cy], p), d = 14;
      const tx = p[0] + u[0] * d, ty = p[1] + u[1] * d + 4;
      out.push('<circle cx="' + nb(p[0]) + '" cy="' + nb(p[1]) + '" r="2.6" fill="'
        + NOIR + '"/>');
      out.push('<text x="' + nb(tx) + '" y="' + nb(ty) + '" text-anchor="middle"'
        + ' font-size="13" font-family="serif" font-style="italic" fill="' + NOIR
        + '">' + n + '</text>');
      M2.pt(tx, ty, 8, 8);
    }

    const b = M2.boite();
    const L = Math.round(b.x1 - b.x0), H = Math.round(b.y1 - b.y0);
    if (!(L > 0 && H > 0)) return null;
    return '<svg class="figure" direction="ltr" viewBox="0 0 ' + L + ' ' + H
      + '" width="' + L + '" height="' + H + '" xmlns="http://www.w3.org/2000/svg">'
      + '<g transform="translate(' + nb(-b.x0) + ' ' + nb(-b.y0) + ')">'
      + out.join('') + '</g></svg>';
  }

  const API = { dessiner, TRAITS };
  if (M) module.exports = API; else racine.Figure = API;
})(typeof window !== 'undefined' ? window : globalThis);
