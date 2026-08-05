// LE CATALOGUE DES RÈGLES DE 7ème, et le moteur qui les enchaîne.
//
// Une démonstration de géométrie n'est pas un calcul : c'est un CHEMIN entre
// ce qu'on sait et ce qu'on veut. On ne l'écrit donc pas à la main, exercice
// par exercice — on donne les règles du programme, les hypothèses de l'énoncé,
// le but, et l'on cherche le chemin. Ce qu'on publie est le PLUS COURT : c'est
// celui que le maître attend, et c'est aussi celui qu'un élève peut refaire.
//
// LE MOTEUR NE PROUVE RIEN. Il propose un enchaînement ; ce sont les
// COORDONNÉES qui disent si chaque affirmation est vraie. Une règle mal écrite
// ici produirait une étape fausse, et le validateur la refuserait — c'est la
// discipline du chapitre des puissances, transportée telle quelle.
//
// UNE DROITE A DEUX IDENTITÉS. Son NOM, celui de l'énoncé — « (Δ) », « (AB) »,
// « (D') » —, et sa réalité géométrique, qui se calcule. Deux noms peuvent
// désigner le même objet : quand A et B sont sur (Δ), la droite (AB) EST (Δ).
// On raisonne sur la réalité, on parle avec les noms, et le moment où deux
// noms se rejoignent est lui-même une étape de la démonstration.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Droites;

  // ── L'identité géométrique d'une droite ─────────────────────────────────
  //
  // ax + by = c, normalisé pour que deux écritures de la même droite donnent
  // la même clé. Exact, puisque tout est rationnel : deux droites confondues
  // le sont vraiment, et deux droites presque confondues ne le sont pas.
  function cleDroite(A, B) {
    const a = F.qSub(B.y, A.y), b = F.qSub(A.x, B.x);
    const c = F.qAdd(F.qMul(a, A.x), F.qMul(b, A.y));
    const pivot = F.qNul(a) ? b : a;
    const d = x => F.qTxt(F.qDiv(x, pivot));
    return d(a) + ';' + d(b) + ';' + d(c);
  }

  // ── Le catalogue ─────────────────────────────────────────────────────────
  //
  // Les cinq règles que la 7ème a le droit d'invoquer, et pas une de plus. Un
  // élève qui n'a pas encore vu les angles alternes-internes ne doit pas lire
  // une démonstration qui s'en sert.
  const REGLES = [
    {
      cle: 'perp-perp-para',
      nom: 'مستقيمان عموديان على نفس المستقيم متوازيان',
      chercher: (ctx, f) => {
        const out = [];
        for (const [x, l1] of f.perp) for (const c of l1) {
          for (const y of f.perp.get(c) || []) {
            if (y <= x) continue;
            out.push({ but: ['para', x, y],
                       depuis: [['perp', x, c], ['perp', y, c]] });
          }
        }
        return out;
      }
    },
    {
      cle: 'perp-para-perp',
      nom: 'إذا كان مستقيم عموديا على أحد مستقيمين متوازيين فهو عمودي على الآخر',
      chercher: (ctx, f) => {
        const out = [];
        for (const [a, par] of f.para) for (const b of par) {
          for (const c of f.perp.get(a) || []) {
            if (c === b) continue;
            out.push({ but: ['perp', c, b],
                       depuis: [['para', a, b], ['perp', c, a]] });
          }
        }
        return out;
      }
    },
    {
      cle: 'para-para-para',
      nom: 'مستقيمان متوازيان لنفس المستقيم متوازيان',
      chercher: (ctx, f) => {
        const out = [];
        for (const [x, l1] of f.para) for (const c of l1) {
          for (const y of f.para.get(c) || []) {
            if (y <= x) continue;
            out.push({ but: ['para', x, y],
                       depuis: [['para', x, c], ['para', y, c]] });
          }
        }
        return out;
      }
    },
    {
      cle: 'med-perp',
      nom: 'الموسط العمودي لقطعة مستقيم عمودي على حاملها',
      chercher: (ctx, f) => {
        const out = [];
        for (const [d, segs] of f.med) for (const s of segs) {
          const l = ctx.ligneDe(s);
          if (l && l !== d) out.push({ but: ['perp', d, l], depuis: [['med', d, s]] });
        }
        return out;
      }
    },
    {
      cle: 'perp-milieu-med',
      nom: 'المستقيم العمودي على قطعة و المارّ من منتصفها هو موسطها العمودي',
      // LES DEUX PRÉMISSES SE DISENT. « M ∈ (Δ) » ne suffit pas : c'est parce
      // que M est le MILIEU que (Δ) est la médiatrice, et une démonstration
      // qui laisse cela sous-entendu n'en est pas une.
      chercher: (ctx, f) => {
        const out = [];
        for (const [s, l] of ctx.segments) {
          const m = ctx.milieuDe(s);
          if (!m || !(f.mil.get(m) || []).includes(s)) continue;
          for (const d of f.perp.get(l) || []) {
            if (!(f.passe.get(d) || []).includes(m)) continue;
            out.push({ but: ['med', d, s],
                       depuis: [['perp', d, l], ['mil', m, s], ['passe', d, m]] });
          }
        }
        return out;
      }
    },
    {
      cle: 'tangente-perp',
      nom: 'المماس لدائرة في نقطة عمودي على الشعاع في تلك النقطة',
      // (Δ) tangente en A à un cercle de centre O  ⟹  (Δ) ⊥ (OA)
      chercher: (ctx, f) => {
        const out = [];
        for (const [d, points] of f.tang) for (const t of points) {
          const r = ctx.rayonDe(t);
          if (r && r !== d) out.push({ but: ['perp', d, r], depuis: [['tang', d, t]] });
        }
        return out;
      }
    },
    {
      cle: 'med-equidistance',
      nom: 'كلّ نقطة من الموسط العمودي لقطعة متساوية البعد عن طرفيها',
      chercher: (ctx, f) => {
        const out = [];
        for (const [d, segs] of f.med) for (const s of segs) {
          for (const p of f.passe.get(d) || []) {
            const [a, b] = ctx.boutsDe(s);
            if (p === a || p === b) continue;
            out.push({ but: ['egal', p + a, p + b],
                       depuis: [['med', d, s], ['passe', d, p]] });
          }
        }
        return out;
      }
    }
  ];

  // ── Les faits ────────────────────────────────────────────────────────────
  //
  // Un fait est un triplet [type, gauche, droite]. « perp » et « para » lient
  // deux droites, « med » une droite et un segment, « passe » une droite et un
  // point, « egal » deux longueurs. Les tables d'adjacence évitent au moteur
  // de reparcourir la liste à chaque question.
  const SYM = { perp: true, para: true, egal: true };
  function tables(liste) {
    const t = { perp: new Map(), para: new Map(), med: new Map(),
                passe: new Map(), egal: new Map(), mil: new Map(),
                tang: new Map() };
    const pose = (m, a, b) => {
      if (!m.has(a)) m.set(a, []);
      if (m.get(a).indexOf(b) < 0) m.get(a).push(b);
    };
    for (const [type, a, b] of liste) {
      if (!t[type]) continue;
      pose(t[type], a, b);
      if (SYM[type]) pose(t[type], b, a);
    }
    return t;
  }
  const cleFait = f => (SYM[f[0]] ? f[0] + '|' + [f[1], f[2]].sort().join('|')
                                  : f.join('|'));

  // ── LA RECHERCHE — en largeur, donc le chemin trouvé est le plus court ───
  //
  // On sature les règles tour par tour. Dès que le but paraît, on remonte les
  // prémisses jusqu'aux hypothèses, et l'on rend les règles employées DANS
  // L'ORDRE où elles s'appliquent : c'est la démonstration.
  function chercher(hypotheses, but, ctx, tours) {
    const connus = new Map();
    for (const h of hypotheses) connus.set(cleFait(h), { fait: h, regle: null, depuis: [] });
    const cible = cleFait(but);
    if (connus.has(cible)) return [];              // déjà donné : rien à démontrer

    for (let tour = 0; tour < (tours || 5); tour++) {
      const f = tables([...connus.values()].map(x => x.fait));
      let neuf = false;
      for (const r of REGLES) {
        for (const p of r.chercher(ctx, f)) {
          const k = cleFait(p.but);
          if (connus.has(k)) continue;
          if (p.depuis.some(d => !connus.has(cleFait(d)))) continue;
          connus.set(k, { fait: p.but, regle: r, depuis: p.depuis });
          neuf = true;
          if (k === cible) return remonter(connus, cible);
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
      if (!n || !n.regle) return;                  // une hypothèse : rien dessous
      n.depuis.forEach(d => creuser(cleFait(d)));
      ordre.push(n);
    })(cible);
    return ordre;
  }

  const API = { cleDroite, REGLES, chercher, tables, cleFait };
  if (M) module.exports = API; else racine.Regles = API;
})(typeof window !== 'undefined' ? window : globalThis);
