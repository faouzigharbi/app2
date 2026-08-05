// DE LA SCÈNE À LA DÉMONSTRATION.
//
// Un item décrit une SCÈNE : des points avec leurs coordonnées, des droites
// avec leurs noms, ce que l'énoncé donne, et ce qu'il demande. Ce fichier en
// tire la chaîne — et rien d'autre : il ne choisit pas les énoncés, il ne les
// invente pas. Les énoncés sont dans items.js, relevés sur les feuilles.
//
// CE QUI EST ENGENDRÉ, C'EST LE RAISONNEMENT. Il n'est pas sur la feuille du
// maître — la feuille dit « montre que (D) // (D') » et s'arrête là — et il
// doit être recalculé pour être sûr.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Droites;
  const R = M ? require('./regles.js') : racine.Regles;

  // ── L'écriture des objets ────────────────────────────────────────────────
  const dit = {
    perp: (a, b) => a + ' ⊥ ' + b,
    para: (a, b) => a + ' // ' + b,
    med: (d, s) => d + ' هو الموسط العمودي للقطعة ' + s,
    passe: (d, p) => p + ' ∈ ' + d,
    egal: (a, b) => a + ' = ' + b,
    mil: (p, s) => p + ' هو منتصف القطعة ' + s
  };

  // Un fait s'écrit avec les NOMS de l'énoncé, jamais avec les clés.
  function ecrire(fait, noms) {
    const n = x => noms[x] || x;
    return dit[fait[0]](n(fait[1]), n(fait[2]));
  }

  // ── Monter la scène ──────────────────────────────────────────────────────
  function scene(item) {
    const s = item.monter(F);
    const noms = {};                    // clé → nom affiché
    const cle = {};                     // nom → clé
    const memes = [];                   // deux noms pour un même objet

    for (const l of s.lignes) {
      const k = R.cleDroite(s.pts[l.A], s.pts[l.B]);
      cle[l.nom] = k;
      if (noms[k] === undefined) noms[k] = l.nom;
      else if (noms[k] !== l.nom) memes.push([noms[k], l.nom]);
    }
    const segments = new Map();         // clé de segment → clé de sa droite
    const milieux = {}, bouts = {};
    for (const g of s.segments || []) {
      const k = 'seg:' + g.nom;
      segments.set(k, R.cleDroite(s.pts[g.A], s.pts[g.B]));
      noms[k] = g.nom;
      bouts[k] = [g.A, g.B];
      if (g.milieu) milieux[k] = g.milieu;
      cle[g.nom] = k;
    }

    // LES APPARTENANCES SE LISENT SUR LA FIGURE. Qu'un point soit ou non sur
    // une droite n'est pas à démontrer en 7ème : cela se voit, et cela se
    // vérifie ici exactement, sur les coordonnées.
    const passe = [];
    for (const l of s.lignes) {
      for (const p of Object.keys(s.pts)) {
        if (F.aligne(s.pts[l.A], s.pts[l.B], s.pts[p])) passe.push(['passe', cle[l.nom], p]);
      }
    }

    // DE QUELS POINTS UNE DROITE EST-ELLE FAITE ? Le moteur raisonne sur des
    // clés ; le validateur, lui, doit REFAIRE le calcul, et pour cela il lui
    // faut deux points par droite et deux par segment.
    const ptsDe = {};
    for (const l of s.lignes) if (!ptsDe[cle[l.nom]]) ptsDe[cle[l.nom]] = [l.A, l.B];
    for (const g of s.segments || []) ptsDe['seg:' + g.nom] = [g.A, g.B];

    const enCle = f => [f[0], cle[f[1]] || f[1], cle[f[2]] || f[2]];
    return {
      s, noms, cle, memes, segments, milieux, bouts, passe, ptsDe,
      hyp: (s.hyp || []).map(enCle),
      but: enCle(s.but),
      ctx: {
        segments,
        ligneDe: k => segments.get(k),
        milieuDe: k => milieux[k],
        boutsDe: k => bouts[k]
      }
    };
  }

  // ── La chaîne ────────────────────────────────────────────────────────────
  function chaine(item) {
    let S;
    try { S = scene(item); } catch (e) { return null; }
    const suite = R.chercher(S.hyp.concat(S.passe), S.but, S.ctx);
    if (!suite || !suite.length) return null;

    const etapes = [];
    // Ce que l'énoncé donne. On le redit d'un bloc : une démonstration
    // commence toujours par ce qu'on a le droit d'utiliser.
    etapes.push(['المعطيات',
                 S.hyp.map(h => ecrire(h, S.noms)).join('  و  ')]);
    // Deux noms pour un même objet : c'est une étape, et souvent la première
    // que l'élève oublie.
    for (const [a, b] of S.memes) {
      etapes.push(['نفس المستقيم',
                   a + ' و ' + b + ' هما نفس المستقيم']);
    }
    // ON ÉNONCE LA RÈGLE AVANT DE S'EN SERVIR — une fois, la première fois
    // qu'elle sert. C'est ainsi que la feuille du maître est écrite : les
    // « التوضيحات » rappellent la propriété, et l'élève l'applique ensuite.
    // La redire à chaque emploi ferait deux étapes interchangeables.
    const dites = new Set();
    const cleBut = R.cleFait(S.but);
    for (const n of suite) {
      if (!dites.has(n.regle.cle)) {
        dites.add(n.regle.cle);
        etapes.push(['القاعدة', n.regle.nom]);
      }
      // Quand l'étape EST le but, on l'écrit dans l'ordre de l'énoncé : le
      // moteur trie ses faits pour les reconnaître, l'élève lit la question.
      const conclusion = R.cleFait(n.fait) === cleBut ? S.but : n.fait;
      etapes.push(['نطبّق',
                   n.depuis.map(d => ecrire(d, S.noms)).join('  و  ')
                   + '  إذن  ' + ecrire(conclusion, S.noms)]);
    }
    etapes.push(['النتيجة', ecrire(S.but, S.noms)]);
    if (etapes.length < 4) return null;

    // La figure porte les NOMS de l'énoncé, et elle les prend là où ils sont
    // écrits : dans la liste des droites déclarées. Rien à répéter dans l'item,
    // rien qui puisse diverger du texte.
    let fig = null;
    if (S.s.fig) {
      const dess = Object.assign({ points: S.s.pts }, S.s.fig);
      dess.droites = (S.s.fig.droites || []).map(d => {
        const k = R.cleDroite(S.s.pts[d[0]], S.s.pts[d[1]]);
        return [d[0], d[1], d[2], S.noms[k] || ''];
      });
      fig = { svg: F.dessiner(dess) };
    }
    const enonce = (S.s.donnees || []).slice();
    if (fig) enonce.push(fig);
    enonce.push('برهن أنّ: ' + ecrire(S.but, S.noms));

    // LE CONTRÔLE. Tout ce que la chaîne AFFIRME — les données, chaque
    // conclusion intermédiaire, le but — est rendu en points nommés, pour que
    // le validateur le recalcule au lieu de le relire. Une règle mal écrite
    // dans le catalogue produirait ici un fait faux, et il serait vu.
    const enPoints = f => {
      const g = x => S.ptsDe[x] || x;
      return { type: f[0], a: g(f[1]), b: g(f[2]), texte: ecrire(f, S.noms) };
    };
    const affirme = S.hyp.concat(suite.map(n => n.fait)).concat([S.but]);
    return {
      enonce, etapes,
      indice: S.s.indice || 'ابدأ من المعطيات، و طبّق قاعدة واحدة في كلّ مرحلة',
      source: item.src,
      controle: { type: 'geometrie', pts: S.s.pts,
                  verifs: affirme.map(enPoints),
                  regles: suite.map(n => n.regle.cle) }
    };
  }

  const API = { chaine, scene, ecrire, dit };
  if (M) module.exports = API; else racine.Chaines = API;
})(typeof window !== 'undefined' ? window : globalThis);
