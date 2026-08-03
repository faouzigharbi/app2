// Le dessin d'une droite graduée, en SVG.
//
// La fiche est pleine de figures : sans elles, la moitié des exercices n'a
// plus de sens. Un SVG est bien meilleur qu'une image ici — il est net à
// toute taille, il pèse trois lignes, et surtout il ÉCHAPPE AU BIDI : son
// contenu ne se retourne pas dans une page RTL, contrairement à du texte.
//
// La figure est construite à partir des mêmes nombres que l'énoncé : quand
// le générateur retire les abscisses, le dessin suit.
(function (racine) {
  'use strict';
  const F = (typeof module !== 'undefined' && module.exports) ? require('./noyau.js') : racine.Gradue;

  const ECH = 54;          // pixels par unité
  const MARGE = 26;
  const AXE = 54;          // hauteur de l'axe dans le dessin

  const ech = (v, min) => MARGE + (v - min) * ECH;

  // points : [{ x: rationnel, nom: 'A', sous: '−5/3' }]
  // Les repères O et I sont ajoutés d'office : ce sont eux qui définissent
  // la graduation, les omettre rendrait la figure muette.
  function dessiner(points, opts) {
    opts = opts || {};
    const val = p => p.x.n / p.x.d;
    const tous = points.map(val);
    const min = Math.floor(Math.min(-1, ...tous)) - 1;
    const max = Math.ceil(Math.max(2, ...tous)) + 1;
    const L = MARGE * 2 + (max - min) * ECH;
    const H = opts.hauteur || 96;
    const y = AXE;
    const bouts = [];

    bouts.push(`<line x1="6" y1="${y}" x2="${L - 6}" y2="${y}" stroke="#2c3e50" stroke-width="1.6"/>`);
    bouts.push(`<polygon points="${L - 6},${y} ${L - 15},${y - 4} ${L - 15},${y + 4}" fill="#2c3e50"/>`);

    // graduations entières, plus des sous-graduations discrètes
    for (let k = min; k <= max; k++) {
      const X = ech(k, min);
      bouts.push(`<line x1="${X}" y1="${y - 6}" x2="${X}" y2="${y + 6}" stroke="#2c3e50" stroke-width="1.2"/>`);
      for (let j = 1; j < 4; j++) {
        const x2 = X + j * ECH / 4;
        if (x2 < L - 8) bouts.push(`<line x1="${x2}" y1="${y - 3}" x2="${x2}" y2="${y + 3}" stroke="#b9c2d0" stroke-width="0.9"/>`);
      }
    }

    // repères O et I
    [[0, 'O'], [1, 'I']].forEach(([v, nom]) => {
      const X = ech(v, min);
      bouts.push(`<circle cx="${X}" cy="${y}" r="3.1" fill="#2c3e50"/>`);
      bouts.push(`<text x="${X}" y="${y - 12}" font-size="14" text-anchor="middle" fill="#2c3e50" direction="ltr">${nom}</text>`);
      bouts.push(`<text x="${X}" y="${y + 22}" font-size="12" text-anchor="middle" fill="#7a8394" direction="ltr">${v}</text>`);
    });

    points.forEach(p => {
      const X = ech(val(p), min);
      bouts.push(`<circle cx="${X}" cy="${y}" r="3.6" fill="#5b4bd6"/>`);
      bouts.push(`<text x="${X}" y="${y - 12}" font-size="14" font-weight="700" text-anchor="middle" fill="#5b4bd6" direction="ltr">${p.nom}</text>`);
      if (p.sous) {
        bouts.push(`<text x="${X}" y="${y + 24}" font-size="11.5" text-anchor="middle" fill="#5b4bd6" direction="ltr">${p.sous}</text>`);
      }
    });

    bouts.push(`<text x="${L - 20}" y="${y - 12}" font-size="14" text-anchor="middle" fill="#2c3e50" direction="ltr">Δ</text>`);

    return `<span class="figure"><svg viewBox="0 0 ${L} ${H}" width="${L}" height="${H}"`
      + ` xmlns="http://www.w3.org/2000/svg" role="img" direction="ltr">${bouts.join('')}</svg></span>`;
  }

  // Une fraction s'affiche mal en SVG : on écrit « -5/3 » sur une ligne.
  const etiquette = r => F.txt(r);

  const API = { dessiner, etiquette };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Droite = API;
})(typeof window !== 'undefined' ? window : globalThis);
