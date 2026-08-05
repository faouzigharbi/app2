// DE LA SCÈNE À LA CHAÎNE.
//
// Un item décrit une SCÈNE : des demi-droites autour d'un sommet ou un
// polygone, les relations que l'énoncé donne, les mesures qu'il fournit, et
// l'angle dont il demande la mesure. Ce fichier en tire la chaîne — et rien
// d'autre : les énoncés sont dans items.js, relevés sur les feuilles.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Angles;
  const R = M ? require('./regles.js') : racine.Regles;

  const A = F.ecrireAngle;
  const dit = {
    mes: (a, m) => A(a) + ' = ' + F.qDeg(m),
    comp: (a, b) => A(a) + ' و ' + A(b) + ' متتامّتان',
    supp: (a, b) => A(a) + ' و ' + A(b) + ' متكاملتان',
    oppose: (a, b) => A(a) + ' و ' + A(b) + ' متقابلتان بالرأس',
    egal: (a, b) => A(a) + ' و ' + A(b) + ' متقايستان',
    bis: (d, a) => '[' + d + ') هو منصّف الزاوية ' + A(a),
    adj: (a, b) => A(a) + ' و ' + A(b) + ' متجاورتان',
    tri: t => 'في المثلّث ' + t
  };
  const ecrire = f => (f[0] === 'tri' ? dit.tri(f[1]) : dit[f[0]](f[1], f[2]));

  // ── La scène ─────────────────────────────────────────────────────────────
  function scene(item) {
    const s = item.monter(F);
    // Les adjacences sont DONNÉES par la figure : trois demi-droites dans
    // l'ordre, et l'angle du milieu partage le grand en deux. On les calcule
    // une fois, le moteur s'en sert autant qu'il veut.
    const adjacences = [];
    if (s.rayons) {
      // L'ORDRE SE LIT SUR L'ÉVENTAIL, PAS SUR LES NOMBRES. Trier les rayons
      // par leur degré brut suppose que l'item les a numérotés en partant du
      // bon bout. Quand ce n'est pas le cas — A à 0°, puis y, t, x, u de 180°
      // à 290° —, le tri met A en tête et Chasles recolle « AB̂t = 180 + 20 =
      // 200° », un angle qui n'existe pas. On repart donc du rayon qui suit le
      // plus grand vide : c'est là que l'éventail commence, vraiment.
      const degs = s.rayons.map(r => ((r.deg % 360) + 360) % 360).sort((a, b) => a - b);
      let vide = 360 - (degs[degs.length - 1] - degs[0]), base = degs[0];
      for (let i = 1; i < degs.length; i++) {
        if (degs[i] - degs[i - 1] > vide) { vide = degs[i] - degs[i - 1]; base = degs[i]; }
      }
      const rang = r => ((((r.deg % 360) + 360) % 360) - base + 360) % 360;
      const tri = s.rayons.slice().sort((x, y) => rang(x) - rang(y));
      // CHASLES NE TRAVERSE PAS LE DEMI-TOUR. Le premier et le dernier rayon
      // d'un triplet doivent faire un angle saillant : au-delà, xÔz n'est plus
      // la somme mais son rentrant, et l'égalité est fausse. Deux droites
      // sécantes, elles, ouvrent bel et bien un éventail de plus de 180° — ce
      // n'est donc pas la scène qu'il faut refuser, mais le triplet.
      for (let i = 0; i < tri.length; i++) {
        for (let j = i + 1; j < tri.length; j++) {
          for (let k = j + 1; k < tri.length; k++) {
            if (rang(tri[k]) - rang(tri[i]) > 180.0001) continue;
            adjacences.push([F.cleAngle(tri[i].nom, s.sommet, tri[j].nom),
                             F.cleAngle(tri[j].nom, s.sommet, tri[k].nom),
                             F.cleAngle(tri[i].nom, s.sommet, tri[k].nom)]);
          }
        }
      }
    }
    // Un منصّف partage un angle : quelles en sont les deux moitiés ?
    const moitiesDe = (bis, tout) => {
      const d = F.decoupe(tout);
      const b = bis.replace(d.O, '');
      if (!b || b === d.a || b === d.b) return null;
      return [F.cleAngle(d.a, d.O, b), F.cleAngle(b, d.O, d.b)];
    };
    return {
      s, adjacences, moitiesDe,
      triangles: s.triangles || [],
      ctx: { adjacences, moitiesDe, triangles: s.triangles || [] }
    };
  }

  // ── La chaîne ────────────────────────────────────────────────────────────
  function chaine(item) {
    let S;
    try { S = scene(item); } catch (e) { return null; }
    const hyp = (S.s.hyp || []).slice();
    const but = ['mes', S.s.but, null];
    const suite = R.chercher(hyp, but, S.ctx);
    if (!suite || !suite.length) return null;
    const dernier = suite[suite.length - 1];
    const reponse = dernier.fait[2];

    const etapes = [];
    etapes.push(['المعطيات', hyp.map(ecrire).join('  و  ')]);
    const dites = new Set();
    for (const n of suite) {
      if (!dites.has(n.regle.cle)) {
        dites.add(n.regle.cle);
        etapes.push(['القاعدة', n.regle.nom]);
      }
      // LE CALCUL TIENT DANS LA MÊME LIGNE QUE LA DÉDUCTION. Séparé, il
      // arrivait APRÈS la conclusion — « donc KĴL = 45° », puis « 90° − 45°
      // = 45° » —, ce qui est l'ordre inverse de celui où l'on pense.
      const droite = (n.calcul && n.calcul !== F.qDeg(n.fait[2]))
        ? n.calcul + ' = ' + F.qDeg(n.fait[2]) : F.qDeg(n.fait[2]);
      etapes.push(['نطبّق',
                   n.depuis.map(ecrire).join('  و  ') + '  إذن  '
                   + F.ecrireAngle(n.fait[1]) + ' = ' + droite]);
    }
    etapes.push(['النتيجة', A(S.s.but) + ' = ' + F.qDeg(reponse)]);
    if (etapes.length < 4) return null;

    const enonce = (S.s.donnees || []).slice();
    const svg = figure(S);
    if (svg) enonce.push({ svg });
    enonce.push('أحسب قيس الزاوية ' + A(S.s.but) + '.');

    // LE CONTRÔLE. Deux régimes, et il faut les distinguer.
    //
    //   — l'ARITHMÉTIQUE est exacte : chaque mesure calculée par une règle est
    //     recalculée par le validateur, en rationnels, sans arrondi ;
    //   — la FIGURE est approchée : on remesure les angles dessinés et l'on
    //     exige qu'ils collent aux valeurs annoncées à un demi-degré près.
    //     Prétendre à l'exactitude serait mentir — cos 35° n'est pas rationnel.
    return {
      enonce, etapes,
      indice: S.s.indice || 'ابدأ من الزاوية المعلومة، و طبّق قاعدة واحدة في كلّ مرحلة',
      source: item.src,
      controle: {
        type: 'angles',
        hyp, but: S.s.but, reponse: F.qDeg(reponse),
        etapesCalcul: suite.map(n => ({
          regle: n.regle.cle, angle: n.fait[1],
          mesure: n.fait[2].n + '/' + n.fait[2].d,
          depuis: n.depuis.map(d => [d[0], d[1],
            (d[0] === 'mes' && d[2]) ? d[2].n + '/' + d[2].d : d[2]])
        })),
        ctx: { adjacences: S.adjacences, triangles: S.triangles },
        rayons: S.s.rayons || null, sommet: S.s.sommet || null,
        sommets: S.s.sommets || null
      }
    };
  }

  function figure(S) {
    const s = S.s;
    if (s.rayons) {
      return F.eventail({ sommet: s.sommet, rayons: s.rayons, arcs: s.arcs || [] });
    }
    if (s.sommets) {
      return F.polygone({ sommets: s.sommets, cotes: s.cotes || [], arcs: s.arcs || [] });
    }
    return null;
  }

  const API = { chaine, scene, ecrire, dit };
  if (M) module.exports = API; else racine.Chaines = API;
})(typeof window !== 'undefined' ? window : globalThis);
