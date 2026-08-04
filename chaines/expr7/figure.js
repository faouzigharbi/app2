// La figure du polygone, en SVG.
//
// L'exercice 6 de la fiche ne se comprend pas sans son dessin : c'est la figure
// qui dit quels côtés sont égaux. Un SVG convient mieux qu'une image — il reste
// net à toute taille, il pèse quelques lignes, et surtout son contenu ne se
// retourne pas dans une page RTL, contrairement à du texte arabe.
//
// La figure est SCHÉMATIQUE, comme celle du livre : les longueurs dessinées ne
// respectent pas l'échelle (on ne connaît pas x). Ce qui doit être exact, c'est
// le codage — deux côtés portent la même marque si et seulement si l'énoncé les
// dit égaux.
(function (racine) {
  'use strict';

  const L = 300, H = 210;          // boîte du dessin
  const CX = 150, CY = 102;

  // Sommets répartis sur un cercle, avec un rayon légèrement variable : la
  // figure ressemble à un polygone quelconque et non à un polygone régulier,
  // ce qui évite de suggérer des égalités qui n'existent pas.
  function sommets(n, rayons) {
    const depart = -Math.PI / 2 - Math.PI / n;
    return Array.from({ length: n }, (_, i) => {
      const a = depart + 2 * Math.PI * i / n;
      const r = rayons[i % rayons.length];
      return [CX + r * Math.cos(a) * 1.15, CY + r * Math.sin(a) * 0.92];
    });
  }

  const NOMS = 'ABCDEF'.split('');

  // marques : une, deux ou trois barres au milieu du côté, perpendiculaires
  function barres(p, q, k) {
    const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
    const dx = q[0] - p[0], dy = q[1] - p[1];
    const n = Math.hypot(dx, dy) || 1;
    const ux = dx / n, uy = dy / n;          // le long du côté
    const vx = -uy, vy = ux;                 // perpendiculaire
    const out = [];
    for (let j = 0; j < k; j++) {
      const d = (j - (k - 1) / 2) * 5;
      const cx = mx + ux * d, cy = my + uy * d;
      out.push(`<line x1="${(cx - vx * 5).toFixed(1)}" y1="${(cy - vy * 5).toFixed(1)}"`
        + ` x2="${(cx + vx * 5).toFixed(1)}" y2="${(cy + vy * 5).toFixed(1)}"`
        + ` stroke="#5b4bd6" stroke-width="1.6"/>`);
    }
    return out.join('');
  }

  // cotes : [{ texte:'x', marque:1 }, …] — un par côté, dans l'ordre AB, BC, …
  function polygone(cotes) {
    const n = cotes.length;
    const rayons = n === 3 ? [86, 78, 92] : n === 4 ? [84, 92, 80, 88] : [82, 90, 78, 92, 84];
    const S = sommets(n, rayons);
    const bouts = [];

    bouts.push(`<polygon points="${S.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}"`
      + ` fill="#f7f8fc" stroke="#2c3e50" stroke-width="1.7" stroke-linejoin="round"/>`);

    S.forEach((p, i) => {
      // le nom du sommet, poussé vers l'extérieur pour ne pas mordre le trait
      const dx = p[0] - CX, dy = p[1] - CY;
      const d = Math.hypot(dx, dy) || 1;
      bouts.push(`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2.6" fill="#2c3e50"/>`);
      bouts.push(`<text x="${(p[0] + dx / d * 15).toFixed(1)}" y="${(p[1] + dy / d * 15 + 4).toFixed(1)}"`
        + ` font-size="14" font-weight="700" text-anchor="middle" fill="#2c3e50"`
        + ` direction="ltr">${NOMS[i]}</text>`);
    });

    cotes.forEach((c, i) => {
      const p = S[i], q = S[(i + 1) % n];
      const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
      const dx = mx - CX, dy = my - CY;
      const d = Math.hypot(dx, dy) || 1;
      if (c.marque) bouts.push(barres(p, q, c.marque));
      bouts.push(`<text x="${(mx + dx / d * 22).toFixed(1)}" y="${(my + dy / d * 22 + 4).toFixed(1)}"`
        + ` font-size="13.5" text-anchor="middle" fill="#5b4bd6"`
        + ` direction="ltr">${c.texte}</text>`);
    });

    return `<svg class="figure" viewBox="0 0 ${L} ${H}" width="${L}" height="${H}"`
      + ` xmlns="http://www.w3.org/2000/svg" direction="ltr" role="img">${bouts.join('')}</svg>`;
  }

  const API = { polygone, NOMS };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Figure = API;
})(typeof window !== 'undefined' ? window : globalThis);
