// LE CATALOGUE DES RÈGLES SUR LES ANGLES, et le moteur qui les enchaîne.
//
// Le chapitre des droites raisonnait sur des RELATIONS — perpendiculaire,
// parallèle — et le moteur cherchait un chemin entre elles. Ici les faits
// portent une VALEUR : « xÔy = 35° ». Cela change deux choses.
//
// La première : une règle ne conclut plus seulement « tel fait est vrai », elle
// CALCULE. « متتامّتان » plus une mesure donne l'autre, et il faut la soustraire.
//
// La seconde, plus subtile : LE BUT N'EST PLUS CONNU D'AVANCE. On ne cherche
// pas « xÔy = 55° », on cherche « la mesure de xÔy, quelle qu'elle soit » —
// sinon il faudrait connaître la réponse pour la démontrer. Le moteur s'arrête
// donc sur le premier fait qui donne une mesure à l'angle demandé.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Angles;

  // CERTAINS FAITS SE LISENT SUR LA FIGURE et ne se démontrent pas : que deux
  // angles soient adjacents, que trois angles soient ceux d'un même triangle.
  // Ils sont vrais par construction ; les exiger parmi les hypothèses de
  // l'énoncé bloquerait toute règle qui s'en sert.
  const DU_DESSIN = { adj: true, tri: true };

  // Un fait : ['mes', cléAngle, mesure] — ou une relation entre deux angles,
  // qui vient de l'énoncé et ne se calcule pas.
  const cleFait = f => (f[0] === 'mes' ? 'mes|' + f[1]
                      : f[0] + '|' + [f[1], f[2]].sort().join('|'));

  // ── Le catalogue ─────────────────────────────────────────────────────────
  const REGLES = [
    {
      cle: 'complementaires',
      nom: 'زاويتان متتامّتان مجموع قيسيهما 90°',
      chercher: (ctx, f) => sortir(f, 'comp', (a, b, m) =>
        ({ mesure: F.qSub(F.DROIT, m), calcul: '90° - ' + F.qDeg(m) })),
    },
    {
      cle: 'supplementaires',
      nom: 'زاويتان متكاملتان مجموع قيسيهما 180°',
      chercher: (ctx, f) => sortir(f, 'supp', (a, b, m) =>
        ({ mesure: F.qSub(F.PLAT, m), calcul: '180° - ' + F.qDeg(m) })),
    },
    {
      cle: 'opposees-sommet',
      nom: 'زاويتان متقابلتان بالرأس لهما نفس القيس',
      chercher: (ctx, f) => sortir(f, 'oppose', (a, b, m) =>
        ({ mesure: m, calcul: F.qDeg(m) })),
    },
    {
      cle: 'egales',
      nom: 'زاويتان متقايستان لهما نفس القيس',
      chercher: (ctx, f) => sortir(f, 'egal', (a, b, m) =>
        ({ mesure: m, calcul: F.qDeg(m) })),
    },
    {
      // [Oz) منصّف de xÔy : il partage en deux angles égaux, chacun la moitié.
      cle: 'bissectrice',
      nom: 'منصّف زاوية يقسمها إلى زاويتين متقايستين، قيس كلّ منهما نصف قيسها',
      chercher: (ctx, f) => {
        const out = [];
        for (const [bis, entiers] of f.bis) for (const tout of entiers) {
          const m = f.mes.get(tout);
          const moities = ctx.moitiesDe(bis, tout);
          if (!moities) continue;
          if (m) {
            for (const demi of moities) {
              if (f.mes.has(demi)) continue;
              out.push({ but: ['mes', demi, F.qDiv(m, F.q(2))],
                         depuis: [['bis', bis, tout], ['mes', tout, m]],
                         calcul: F.qDeg(m) + ' : 2' });
            }
          }
          // et dans l'autre sens : une moitié connue donne le tout
          for (const demi of moities) {
            const md = f.mes.get(demi);
            if (md && !f.mes.has(tout)) {
              out.push({ but: ['mes', tout, F.qMul(md, F.q(2))],
                         depuis: [['bis', bis, tout], ['mes', demi, md]],
                         calcul: F.qDeg(md) + ' × 2' });
            }
          }
        }
        return out;
      }
    },
    {
      // Chasles : deux angles adjacents font l'angle total.
      cle: 'chasles',
      nom: 'إذا كانت زاويتان متجاورتين فإنّ قيس الزاوية الكبرى يساوي مجموع قيسيهما',
      chercher: (ctx, f) => {
        const out = [];
        for (const [a, b, tout] of ctx.adjacences) {
          const ma = f.mes.get(a), mb = f.mes.get(b), mt = f.mes.get(tout);
          if (ma && mb && !mt) {
            out.push({ but: ['mes', tout, F.qAdd(ma, mb)],
                       depuis: [['adj', a, b], ['mes', a, ma], ['mes', b, mb]],
                       calcul: F.qDeg(ma) + ' + ' + F.qDeg(mb) });
          }
          if (mt && ma && !mb) {
            out.push({ but: ['mes', b, F.qSub(mt, ma)],
                       depuis: [['adj', a, b], ['mes', tout, mt], ['mes', a, ma]],
                       calcul: F.qDeg(mt) + ' - ' + F.qDeg(ma) });
          }
          if (mt && mb && !ma) {
            out.push({ but: ['mes', a, F.qSub(mt, mb)],
                       depuis: [['adj', a, b], ['mes', tout, mt], ['mes', b, mb]],
                       calcul: F.qDeg(mt) + ' - ' + F.qDeg(mb) });
          }
        }
        return out;
      }
    },
    {
      cle: 'somme-triangle',
      nom: 'مجموع قيسات زوايا مثلّث يساوي 180°',
      chercher: (ctx, f) => {
        const out = [];
        for (const t of ctx.triangles) {
          const ms = t.map(x => f.mes.get(x));
          const manque = ms.findIndex(x => !x);
          if (manque < 0 || ms.filter(Boolean).length !== 2) continue;
          const connus = t.filter((x, i) => i !== manque);
          const somme = F.qAdd(f.mes.get(connus[0]), f.mes.get(connus[1]));
          // On NOMME le triangle : « في المثلّث BOC » se lit, « المثلّث et la
          // somme de ses angles » ne dit pas de quel triangle il s'agit.
          const sommets = t.map(x => x[1]).join('');
          out.push({ but: ['mes', t[manque], F.qSub(F.PLAT, somme)],
                     depuis: [['tri', sommets, '']].concat(
                       connus.map(x => ['mes', x, f.mes.get(x)])),
                     calcul: '180° - (' + F.qDeg(f.mes.get(connus[0])) + ' + '
                             + F.qDeg(f.mes.get(connus[1])) + ')' });
        }
        return out;
      }
    }
  ];

  // Le geste commun aux règles qui lient DEUX angles : l'une des mesures est
  // connue, l'autre s'en déduit.
  function sortir(f, type, calculer) {
    const out = [];
    for (const [a, autres] of f[type]) for (const b of autres) {
      const m = f.mes.get(a);
      if (!m || f.mes.has(b)) continue;
      const r = calculer(a, b, m);
      if (!F.qPos(r.mesure)) continue;        // une mesure négative n'existe pas
      out.push({ but: ['mes', b, r.mesure],
                 depuis: [[type, a, b], ['mes', a, m]],
                 calcul: r.calcul });
    }
    return out;
  }

  // ── Les tables ───────────────────────────────────────────────────────────
  const SYM = { comp: true, supp: true, oppose: true, egal: true };
  function tables(liste) {
    const t = { comp: new Map(), supp: new Map(), oppose: new Map(),
                egal: new Map(), bis: new Map(), mes: new Map() };
    const pose = (m, a, b) => {
      if (!m.has(a)) m.set(a, []);
      if (m.get(a).indexOf(b) < 0) m.get(a).push(b);
    };
    for (const [type, a, b] of liste) {
      if (type === 'mes') { if (!t.mes.has(a)) t.mes.set(a, b); continue; }
      if (!t[type]) continue;
      pose(t[type], a, b);
      if (SYM[type]) pose(t[type], b, a);
    }
    return t;
  }

  // ── LA RECHERCHE ─────────────────────────────────────────────────────────
  //
  // En largeur : le chemin trouvé est le plus court. Le but peut être une
  // mesure SANS VALEUR — « la mesure de yÔz » —, et c'est le cas ordinaire :
  // demander « démontre que yÔz = 55° » supposerait qu'on connaisse déjà 55.
  function chercher(hypotheses, but, ctx, tours) {
    const connus = new Map();
    for (const h of hypotheses) connus.set(cleFait(h), { fait: h, regle: null, depuis: [] });
    const atteint = () => (but[0] === 'mes' && but[2] == null)
      ? connus.get('mes|' + but[1]) : connus.get(cleFait(but));
    if (atteint()) return [];

    for (let tour = 0; tour < (tours || 6); tour++) {
      const f = tables([...connus.values()].map(x => x.fait));
      let neuf = false;
      for (const r of REGLES) {
        for (const p of r.chercher(ctx, f)) {
          const k = cleFait(p.but);
          if (connus.has(k)) continue;
          if (p.depuis.some(d => !DU_DESSIN[d[0]] && !connus.has(cleFait(d)))) continue;
          connus.set(k, { fait: p.but, regle: r, depuis: p.depuis, calcul: p.calcul });
          neuf = true;
          const a = atteint();
          if (a) return remonter(connus, cleFait(a.fait));
        }
      }
      if (!neuf) break;
    }
    return null;
  }

  function remonter(connus, cible) {
    const ordre = [], vus = new Set();
    (function creuser(k) {
      if (vus.has(k)) return;
      vus.add(k);
      const n = connus.get(k);
      if (!n || !n.regle) return;
      n.depuis.forEach(d => { if (!DU_DESSIN[d[0]]) creuser(cleFait(d)); });
      ordre.push(n);
    })(cible);
    return ordre;
  }

  const API = { REGLES, chercher, tables, cleFait };
  if (M) module.exports = API; else racine.Regles = API;
})(typeof window !== 'undefined' ? window : globalThis);
