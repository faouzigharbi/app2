// Noyau de la leçon « الزوايا » — les angles, 7ème.
//
// POURQUOI CE CHAPITRE NE RESSEMBLE PAS AUX AUTRES. Dans « التعامد و التوازي »,
// tout se vérifiait sur les COORDONNÉES : « (D) // (D') » était un déterminant
// nul. Ici on ne peut pas. Un angle de 35° ne se pose pas sur des points à
// coordonnées rationnelles — cos 35° ne l'est pas —, et prétendre le contraire
// serait mentir sur ce qu'on vérifie.
//
// Alors on sépare les deux, et on le dit :
//
//   LE RAISONNEMENT EST EXACT. Les mesures sont des rationnels de degrés, et
//   toute l'arithmétique du chapitre — « متتامّتان » veut dire somme 90,
//   « متكاملتان » somme 180, un منصّف coupe en deux parts égales, Chasles
//   ajoute — se recalcule sans le moindre arrondi. C'est là qu'est la leçon.
//
//   LA FIGURE EST APPROCHÉE, et contrôlée comme telle. Elle est tracée par
//   cosinus et sinus ; le validateur remesure chaque angle dessiné et exige
//   qu'il colle à la valeur annoncée à un demi-degré près. Une figure tracée à
//   40° sous un texte qui dit 35° est refusée — mais on ne prétend pas qu'elle
//   soit exacte, parce qu'elle ne peut pas l'être.
//
// UN ANGLE SE NOMME PAR TROIS LETTRES, dont le SOMMET AU MILIEU : « xOy » est
// l'angle de sommet O entre les demi-droites [Ox) et [Oy). C'est l'écriture de
// la feuille, et c'est aussi la clé sous laquelle le moteur le range — à ceci
// près qu'il tient xOy et yOx pour le même angle, ce qu'ils sont.
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

  // ── Les mesures, en degrés et en rationnels exacts ───────────────────────
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
  const qAdd = (a, b) => q(a.n * b.d + b.n * a.d, a.d * b.d);
  const qSub = (a, b) => q(a.n * b.d - b.n * a.d, a.d * b.d);
  const qMul = (a, b) => q(a.n * b.n, a.d * b.d);
  const qDiv = (a, b) => { if (b.n === 0n) throw new Error('division par zéro'); return q(a.n * b.d, a.d * b.n); };
  const qEgaux = (a, b) => a.n === b.n && a.d === b.d;
  const qNum = a => Number(a.n) / Number(a.d);
  const qPos = a => a.n > 0n;

  // Une mesure s'écrit comme le maître l'écrit : « 35° », « 22,5° ».
  function qDeg(a) {
    if (a.d === 1n) return a.n + '°';
    let d = a.d, deux = 0, cinq = 0;
    while (d % 2n === 0n) { d /= 2n; deux++; }
    while (d % 5n === 0n) { d /= 5n; cinq++; }
    if (d !== 1n) return a.n + '/' + a.d + '°';
    const k = Math.max(deux, cinq), ech = 10n ** BigInt(k);
    const v = a.n * ech / a.d;
    const s = babs(v).toString().padStart(k + 1, '0');
    const e = s.slice(0, s.length - k), f = s.slice(s.length - k).replace(/0+$/, '');
    return (v < 0n ? '-' : '') + e + (f ? ',' + f : '') + '°';
  }
  const DROIT = q(90), PLAT = q(180);

  // ── Le nom d'un angle ────────────────────────────────────────────────────
  //
  // « xOy » et « yOx » sont le même angle : la clé range les deux côtés dans
  // l'ordre alphabétique et garde le sommet au milieu. Sans cela, la moitié
  // des égalités du chapitre passeraient à côté l'une de l'autre.
  const cleAngle = (a, O, b) => (a < b ? a + O + b : b + O + a);
  const decoupe = nom => ({ a: nom[0], O: nom[1], b: nom[2] });
  // À l'écriture, on remet l'accent circonflexe du sommet, comme sur la feuille.
  const ecrireAngle = nom => nom[0] + nom[1] + '̂' + nom[2];

  // La nature d'un angle se lit sur sa mesure, et rien d'autre.
  function nature(m) {
    const v = qNum(m);
    if (v === 0) return 'nul';
    if (v < 90) return 'aigu';
    if (v === 90) return 'droit';
    if (v < 180) return 'obtus';
    if (v === 180) return 'plat';
    return 'rentrant';
  }
  const NATURES = { nul: 'زاوية منعدمة', aigu: 'زاوية حادّة', droit: 'زاوية قائمة',
                    obtus: 'زاوية منفرجة', plat: 'زاوية منبسطة',
                    rentrant: 'زاوية منعكسة' };

  // ── LA FIGURE ────────────────────────────────────────────────────────────
  //
  // Un éventail de demi-droites autour d'un sommet, ou un triangle. Le SVG
  // échappe au bidi — son contenu ne se retourne pas dans une page arabe —, et
  // il reste net à toute taille.
  const COUL = { trait: '#2c3e50', arc: '#c0392b', texte: '#2c3e50',
                 accent: '#6c63ff' };
  const R = 180 / Math.PI;

  // fig = { sommet: 'O', rayons: [{nom:'x', deg: 0}, …], arcs: [['x','O','y']] }
  // UN MÈTRE POUR LA BOÎTE. On dessine d'abord autour du sommet placé à
  // l'origine, en déclarant à ce mètre l'encombrement de CHAQUE chose posée ;
  // le cadre se déduit ensuite. La version précédente cadrait sur les rayons
  // seuls : le « O » du sommet, écrit seize pixels plus bas, tombait dehors
  // dès qu'aucun rayon ne descendait — et l'éventail tourne à chaque tirage.
  // Ce n'est pas la marge qui était trop courte, c'est le label qui n'était
  // mesuré par rien.
  function metre() {
    let x0 = 0, x1 = 0, y0 = 0, y1 = 0;
    return {
      pt(x, y, rx, ry) {
        x0 = Math.min(x0, x - (rx || 0)); x1 = Math.max(x1, x + (rx || 0));
        y0 = Math.min(y0, y - (ry || 0)); y1 = Math.max(y1, y + (ry || 0));
      },
      // Un texte centré : demi-largeur estimée sur le nombre de caractères,
      // demi-hauteur sur le corps. Généreux à dessein — mieux vaut deux
      // pixels de blanc en trop qu'une lettre coupée.
      texte(x, y, s, corps) {
        this.pt(x, y, String(s).length * corps * 0.36 + 2, corps * 0.8);
      },
      boite: () => ({ x0: x0 - 4, x1: x1 + 4, y0: y0 - 4, y1: y1 + 4 })
    };
  }

  function eventail(fig) {
    const LG = 118;
    const m = metre();
    const out = [];               // dessiné dans le repère du sommet (0, 0)
    const P = (a, d) => [Math.cos(a) * d, -Math.sin(a) * d];

    for (const r of fig.rayons) {
      const a = r.deg / R;
      const [bx, by] = P(a, LG);
      m.pt(bx, by, 1, 1);
      out.push(['line', '<line x1="0" y1="0" x2="' + bx.toFixed(1)
        + '" y2="' + by.toFixed(1) + '" stroke="' + COUL.trait
        + '" stroke-width="1.5"/>']);
      const [ex, ey] = P(a, LG + 14);
      m.texte(ex, ey, r.nom, 13);
      out.push(['t', '<text x="' + ex.toFixed(1) + '" y="' + (ey + 4).toFixed(1)
        + '" text-anchor="middle" font-size="13" font-family="serif"'
        + ' font-style="italic" fill="' + COUL.texte + '">' + r.nom + '</text>']);
    }

    // Les arcs, du plus serré au plus large. L'écart les sépare assez pour que
    // l'étiquette de l'un ne soit pas traversée par le trait de l'autre.
    (fig.arcs || []).forEach((arc, i) => {
      const [n1, , n2] = arc;
      const d1 = fig.rayons.find(r => r.nom === n1).deg;
      const d2 = fig.rayons.find(r => r.nom === n2).deg;
      const rr = 30 + i * 20;
      // L'ARC PREND LE CHEMIN COURT, et dans le bon sens. L'axe des y descend
      // en SVG : un parcours qui monte en géométrie tourne dans l'autre sens à
      // l'écran, et le drapeau de balayage doit le dire — sinon l'arc de 60°
      // s'affiche comme un arc de 300°, et l'élève lit l'angle rentrant.
      const a1 = Math.min(d1, d2) / R, a2 = Math.max(d1, d2) / R;
      const grand = (a2 - a1) > Math.PI ? 1 : 0;
      const [ax, ay] = P(a1, rr), [bx, by] = P(a2, rr);
      m.pt(ax, ay); m.pt(bx, by);
      out.push(['arc', '<path d="M ' + ax.toFixed(1) + ' ' + ay.toFixed(1)
        + ' A ' + rr + ' ' + rr + ' 0 ' + grand + ' 0 ' + bx.toFixed(1) + ' '
        + by.toFixed(1) + '" fill="none" stroke="' + COUL.arc
        + '" stroke-width="1.3"/>']);
      if (arc[3]) {
        const [lx, ly] = P((a1 + a2) / 2, rr + 11);
        m.texte(lx, ly, arc[3], 12);
        out.push(['t', '<text x="' + lx.toFixed(1) + '" y="' + (ly + 4).toFixed(1)
          + '" text-anchor="middle" font-size="12" fill="' + COUL.arc + '">'
          + arc[3] + '</text>']);
      }
    });

    // LE SOMMET S'ÉCRIT DU CÔTÉ VIDE. Toujours en bas à gauche, la lettre se
    // posait parfois sur un rayon ; on la met à l'opposé de l'éventail.
    let ux = 0, uy = 0;
    for (const r of fig.rayons) { const a = r.deg / R; ux += Math.cos(a); uy -= Math.sin(a); }
    const h = Math.hypot(ux, uy);
    const [vx, vy] = h > 0.25 ? [-ux / h * 15, -uy / h * 15] : [-13, 15];
    m.pt(0, 0, 3, 3);
    m.texte(vx, vy, fig.sommet, 13);
    out.push(['t', '<circle cx="0" cy="0" r="2.6" fill="' + COUL.trait + '"/>']);
    out.push(['t', '<text x="' + vx.toFixed(1) + '" y="' + (vy + 4).toFixed(1)
      + '" text-anchor="middle" font-size="13" font-family="serif"'
      + ' font-style="italic" fill="' + COUL.texte + '">' + fig.sommet + '</text>']);

    const b = m.boite();
    const L = Math.round(b.x1 - b.x0), H = Math.round(b.y1 - b.y0);
    const corps = '<g transform="translate(' + (-b.x0).toFixed(1) + ' '
      + (-b.y0).toFixed(1) + ')">' + out.map(o => o[1]).join('') + '</g>';
    return enveloppe([corps], L, H);
  }

  // fig = { sommets: {A:[x,y], …}, cotes: [['A','B'], …], arcs: [['B','A','C','50°']] }
  function polygone(fig) {
    const noms = Object.keys(fig.sommets);
    const xs = noms.map(n => fig.sommets[n][0]), ys = noms.map(n => fig.sommets[n][1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs);
    const y0 = Math.min(...ys), y1 = Math.max(...ys);
    const ECH = Math.min(250 / Math.max(x1 - x0, 0.1), 170 / Math.max(y1 - y0, 0.1));
    const L = Math.round((x1 - x0) * ECH) + 60, H = Math.round((y1 - y0) * ECH) + 60;
    const X = n => 30 + (fig.sommets[n][0] - x0) * ECH;
    const Y = n => H - 30 - (fig.sommets[n][1] - y0) * ECH;
    const out = [];
    for (const c of fig.cotes || []) {
      out.push('<line x1="' + X(c[0]).toFixed(1) + '" y1="' + Y(c[0]).toFixed(1)
        + '" x2="' + X(c[1]).toFixed(1) + '" y2="' + Y(c[1]).toFixed(1)
        + '" stroke="' + COUL.trait + '" stroke-width="1.6"/>');
    }
    (fig.arcs || []).forEach(arc => {
      const [p, S, r2, txt] = arc;
      const u = ang(X(p) - X(S), Y(p) - Y(S)), v = ang(X(r2) - X(S), Y(r2) - Y(S));
      const rr = 22;
      let d = v - u;
      while (d <= -Math.PI) d += 2 * Math.PI;
      while (d > Math.PI) d -= 2 * Math.PI;
      out.push('<path d="M ' + (X(S) + Math.cos(u) * rr).toFixed(1) + ' '
        + (Y(S) + Math.sin(u) * rr).toFixed(1) + ' A ' + rr + ' ' + rr + ' 0 0 '
        + (d > 0 ? 1 : 0) + ' ' + (X(S) + Math.cos(v) * rr).toFixed(1) + ' '
        + (Y(S) + Math.sin(v) * rr).toFixed(1)
        + '" fill="none" stroke="' + COUL.arc + '" stroke-width="1.3"/>');
      if (txt) {
        const am = u + d / 2;
        out.push('<text x="' + (X(S) + Math.cos(am) * (rr + 13)).toFixed(1) + '" y="'
          + (Y(S) + Math.sin(am) * (rr + 13) + 4).toFixed(1)
          + '" text-anchor="middle" font-size="12" fill="' + COUL.arc + '">'
          + txt + '</text>');
      }
    });
    const cx = noms.reduce((s, n) => s + X(n), 0) / noms.length;
    const cy = noms.reduce((s, n) => s + Y(n), 0) / noms.length;
    for (const n of noms) {
      out.push('<circle cx="' + X(n).toFixed(1) + '" cy="' + Y(n).toFixed(1)
        + '" r="2.6" fill="' + COUL.trait + '"/>');
      let ux = X(n) - cx, uy = Y(n) - cy;
      const h = Math.hypot(ux, uy) || 1;
      out.push('<text x="' + (X(n) + ux / h * 14).toFixed(1) + '" y="'
        + (Y(n) + uy / h * 14 + 4).toFixed(1)
        + '" text-anchor="middle" font-size="13" font-family="serif"'
        + ' font-style="italic" fill="' + COUL.texte + '">' + n + '</text>');
    }
    return enveloppe(out, L, H);
  }
  const ang = (dx, dy) => Math.atan2(dy, dx);

  // Le dessin est LTR, même dans une page arabe : sans cette déclaration, un
  // nom qui finit par une apostrophe se retourne à l'intérieur du SVG.
  const enveloppe = (out, L, H) =>
    '<svg class="figure" direction="ltr" viewBox="0 0 ' + L + ' ' + H
    + '" width="' + L + '" height="' + H + '" xmlns="http://www.w3.org/2000/svg">'
    + out.join('') + '</svg>';

  // ── Écriture ─────────────────────────────────────────────────────────────
  const ARABE = /[؀-ۿ]/;
  const echapper = s => String(s).replace(/&/g, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Une ligne SANS un mot d'arabe — « BÔC = 80° », la conclusion — ne passe pas
  // par isoMixte ; il lui faut donc la même règle, sinon la conclusion s'écrit
  // en linéale alors que les trois lignes au-dessus sont en italique.
  const bloc = s => '<span dir="ltr" class="expr'
    + (/[A-Za-zÀ-ɏ]/.test(String(s)) ? ' pt' : '') + '">' + echapper(s) + '</span>';
  // Ô, Â, Ê : le sommet d'un angle porte un accent, et cet accent fait partie
  // du morceau latin. Hors de la classe, le morceau se coupait en deux et le
  // bidi rangeait les moitiés chacune de son côté : « BÔC = 26° » s'affichait
  // « C = 26°.ÔB ». On prend donc tout le latin accentué, précomposé comme
  // combiné.
  const CAR = "A-Za-z\\u00C0-\\u024F\\u0300-\\u036F0-9°()[\\]{}⊥∈/=,.;:+\\-−×√'\"";
  const RUN = new RegExp('[' + CAR + ']+(?:\\s+[' + CAR + ']+)*', 'g');
  const ISOLER = /[⊥/=()[\]°]|[A-Za-z\u00C0-\u024F]/;
  function isoMixte(texte) {
    return String(texte).replace(RUN, m => {
      if (!ISOLER.test(m)) return echapper(m);
      // LES LETTRES S'ÉCRIVENT COMME SUR LA FIGURE. Dans ce chapitre il n'y a
      // pas un seul mot latin : tout ce qui n'est pas chiffre est un nom de
      // point — A B C D E F G I J K L M O t x y z, et les sommets accentués.
      // Les laisser en linéale pendant que la figure les dessine en italique
      // à empattements, c'est demander à l'élève de reconnaître le même B sous
      // deux dessins. Les nombres, eux, restent en linéale — comme les
      // mesures portées sur les arcs.
      const pt = /[A-Za-zÀ-ɏ]/.test(m) ? ' pt' : '';
      return '<span dir="ltr" class="expr' + pt + '">' + echapper(m) + '</span>';
    });
  }
  const rendreMath = s => (s && typeof s === 'object' && s.svg) ? s.svg
    : (ARABE.test(String(s)) ? isoMixte(s) : bloc(s));

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
    q, qAdd, qSub, qMul, qDiv, qEgaux, qNum, qPos, qDeg, DROIT, PLAT,
    cleAngle, decoupe, ecrireAngle, nature, NATURES,
    eventail, polygone, R,
    bloc, isoMixte, rendreMath, rendre, echapper, ARABE,
    PROBLEMES, enregistrer, tirer, construire
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Angles = API;
})(typeof window !== 'undefined' ? window : globalThis);
