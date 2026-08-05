// LE CATALOGUE DE 9ᵉ — et le moteur qui l'enchaîne.
//
// Les vingt-deux règles soumises au maître, dont les neuf premières sont
// recopiées mot pour mot de sa page « مراجعة » (Pythagore (3).pdf). Ce fichier
// est le SEUL endroit d'où une justification peut sortir : le moteur ne rédige
// pas, il enchaîne des règles nommées. Il lui est donc impossible de produire
// une phrase hors programme — il n'en connaît pas d'autre.
//
// LE MOTEUR NE PROUVE RIEN. Il propose un chemin ; ce sont les COORDONNÉES qui
// disent si chaque affirmation est vraie, et le validateur refait chaque pas.
//
// UNE LONGUEUR EST STOCKÉE AU CARRÉ. C'est la seule forme exacte : AB = 4√2
// n'est pas rationnel, AB² = 32 l'est. Le radical n'apparaît qu'à l'écriture.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Thales;

  // Un segment se nomme par ses extrémités, dans l'ordre alphabétique : [AB]
  // et [BA] sont le même segment, et doivent avoir la même clé.
  const seg = (A, B) => (A < B ? A + B : B + A);
  // Une droite porte le nom de deux de ses points ; son IDENTITÉ géométrique,
  // elle, se calcule ailleurs (cleDroite) — deux noms peuvent désigner la
  // même droite, et le moment où ils se rejoignent est une étape.
  const dr = (A, B) => (A < B ? A + B : B + A);

  const cleFait = f => f.map(x => (x && x.n !== undefined ? x.n + '/' + x.d : x)).join('|');

  // ── Les tables, refaites à chaque tour ───────────────────────────────────
  function tables(faits) {
    const t = {
      para: [], perp: [], milieu: [], lg2: new Map(), rect: [],
      rapport: [], aligne: [], cercle: []
    };
    for (const f of faits) {
      if (f[0] === 'lg2') t.lg2.set(f[1], f[2]);
      else if (t[f[0]]) t[f[0]].push(f);
    }
    return t;
  }

  // Les alignements et les milieux sont LUS SUR LA FIGURE : l'énoncé les
  // pose, on ne les démontre pas. Le but, lui, ne l'est jamais — sans quoi la
  // question serait sa propre réponse.
  const DU_DESSIN = { aligne: true };

  const REGLES = [
    // ── A. LE TRIANGLE RECTANGLE — la مراجعة du maître, verbatim ──────────
    {
      cle: 'pythagore',
      nom: 'نظرية بيتاغور : إذا كان المثلّث قائم الزاوية فمربّع الوتر يساوي مجموع مربّعي الضّلعين الآخرين',
      chercher: (ctx, f) => {
        const out = [];
        for (const r of f.rect) {                       // ['rect', A, S, C]
          const [, A, S, C] = r;
          const a = f.lg2.get(seg(S, A)), b = f.lg2.get(seg(S, C));
          if (a && b && !f.lg2.has(seg(A, C))) {
            out.push({ but: ['lg2', seg(A, C), F.qAdd(a, b)], depuis: [r,
              ['lg2', seg(S, A), a], ['lg2', seg(S, C), b]],
              calcul: [seg(S, A), seg(S, C), seg(A, C), 'somme'] });
          }
          // Et dans l'autre sens : un côté de l'angle droit, connaissant le
          // troisième et l'hypoténuse.
          const h = f.lg2.get(seg(A, C));
          if (h && a && !f.lg2.has(seg(S, C))) {
            out.push({ but: ['lg2', seg(S, C), F.qSub(h, a)], depuis: [r,
              ['lg2', seg(A, C), h], ['lg2', seg(S, A), a]],
              calcul: [seg(A, C), seg(S, A), seg(S, C), 'diff'] });
          }
          if (h && b && !f.lg2.has(seg(S, A))) {
            out.push({ but: ['lg2', seg(S, A), F.qSub(h, b)], depuis: [r,
              ['lg2', seg(A, C), h], ['lg2', seg(S, C), b]],
              calcul: [seg(A, C), seg(S, C), seg(S, A), 'diff'] });
          }
        }
        return out;
      }
    },
    {
      cle: 'pythagore-reciproque',
      nom: 'عكس نظرية بيتاغور : إذا كان مربّع أطول ضلع يساوي مجموع مربّعي الضّلعين الآخرين فالمثلّث قائم',
      chercher: (ctx, f) => {
        const out = [];
        for (const t of ctx.triangles || []) {
          const [A, S, C] = t;
          const a = f.lg2.get(seg(S, A)), b = f.lg2.get(seg(S, C)),
                h = f.lg2.get(seg(A, C));
          if (a && b && h && F.qEgaux(h, F.qAdd(a, b))
              && !f.rect.some(r => r[2] === S && seg(r[1], r[3]) === seg(A, C))) {
            out.push({ but: ['rect', A, S, C],
                       depuis: [['lg2', seg(S, A), a], ['lg2', seg(S, C), b],
                                ['lg2', seg(A, C), h]],
                       calcul: [seg(S, A), seg(S, C), seg(A, C), 'verif'] });
          }
        }
        return out;
      }
    },
    {
      cle: 'relation-metrique',
      nom: 'العلاقة القياسية في المثلّث القائم : AH × BC = AB × AC حيث [AH] هو الارتفاع',
      chercher: (ctx, f) => {
        const out = [];
        for (const r of f.rect) {
          const [, A, S, C] = r;
          // Le pied de la hauteur issue du sommet de l'angle droit.
          const H = (ctx.pieds || {})[S + seg(A, C)];
          if (!H) continue;
          const ab = f.lg2.get(seg(S, A)), ac = f.lg2.get(seg(S, C)),
                bc = f.lg2.get(seg(A, C));
          if (ab && ac && bc && !f.lg2.has(seg(S, H))) {
            out.push({ but: ['lg2', seg(S, H), F.qDiv(F.qMul(ab, ac), bc)],
                       depuis: [r, ['lg2', seg(S, A), ab], ['lg2', seg(S, C), ac],
                                ['lg2', seg(A, C), bc]],
                       calcul: [seg(S, A), seg(S, C), seg(A, C), 'metrique'] });
          }
        }
        return out;
      }
    },
    {
      cle: 'circonscrit-milieu',
      nom: 'مركز الدائرة المحيطة بالمثلّث القائم هو منتصف وتره',
      chercher: (ctx, f) => {
        const out = [];
        for (const r of f.rect) {
          const [, A, S, C] = r;
          const I = (ctx.milieux || {})[seg(A, C)];
          if (!I) continue;
          const k = ['cercle', I, [A, S, C].sort().join('')];
          if (!f.cercle.some(x => cleFait(x) === cleFait(k))) {
            out.push({ but: k, depuis: [r, ['milieu', I, A, C]] });
          }
        }
        return out;
      }
    },
    {
      cle: 'rayons-egaux',
      nom: 'أنصاف أقطار دائرة واحدة متقايسة',
      chercher: (ctx, f) => {
        const out = [];
        for (const c of f.cercle) {                     // ['cercle', O, 'ABC']
          const [, O, tri] = c;
          const noms = tri.split('');
          const connu = noms.find(P => f.lg2.has(seg(O, P)));
          if (!connu) continue;
          const v = f.lg2.get(seg(O, connu));
          for (const P of noms) {
            if (P === connu || f.lg2.has(seg(O, P))) continue;
            out.push({ but: ['lg2', seg(O, P), v],
                       depuis: [c, ['lg2', seg(O, connu), v]],
                       calcul: [seg(O, connu), seg(O, P), 'rayon'] });
          }
        }
        return out;
      }
    },
    {
      cle: 'milieu-equidistant-rect',
      nom: 'إذا كان منتصف أحد أضلاع مثلّث متساوي البعد عن رؤوسه فالمثلّث قائم',
      chercher: (ctx, f) => {
        const out = [];
        for (const c of f.cercle) {                     // ['cercle', I, 'ASC']
          const [, I, tri] = c;
          const S = tri.split('').find(x => (ctx.milieux || {})[
            seg(...tri.split('').filter(y => y !== x))] === I);
          if (!S) continue;
          const [A, C] = tri.split('').filter(y => y !== S);
          if (!f.rect.some(r => r[2] === S)) {
            out.push({ but: ['rect', A, S, C], depuis: [c, ['milieu', I, A, C]] });
          }
        }
        return out;
      }
    },
    {
      cle: 'demi-cercle-rect',
      nom: 'كلّ مثلّث يقبل الارتسام في دائرة أحد أضلاعه قطر لها فهو مثلّث قائم',
      chercher: (ctx, f) => {
        const out = [];
        for (const d of ctx.diametres || []) {          // {O, A, C, sur:[…]}
          for (const S of d.sur) {
            if (S === d.A || S === d.C) continue;
            if (f.rect.some(r => r[2] === S && seg(r[1], r[3]) === seg(d.A, d.C))) continue;
            out.push({ but: ['rect', d.A, S, d.C],
                       depuis: [['cercle', d.O, [d.A, S, d.C].sort().join('')],
                                ['milieu', d.O, d.A, d.C]] });
          }
        }
        return out;
      }
    },

    // ── B. THALÈS ─────────────────────────────────────────────────────────
    {
      cle: 'thales',
      nom: 'نظرية طالس : الموازي لأحد أضلاع مثلّث يقسم الضّلعين الآخرين إلى أجزاء متناسبة',
      chercher: (ctx, f) => {
        const out = [];
        for (const t of ctx.thales || []) {
          // t = {S, B, C, M, N} : (MN)//(BC), M sur (SB), N sur (SC)
          const p = ['para', dr(t.M, t.N), dr(t.B, t.C)];
          if (!f.para.some(x => cleFait(x) === cleFait(p))) continue;
          const trio = [[seg(t.S, t.M), seg(t.S, t.B)],
                        [seg(t.S, t.N), seg(t.S, t.C)],
                        [seg(t.M, t.N), seg(t.B, t.C)]];
          // Trois rapports égaux : dès que trois des six longueurs sont
          // connues et que la quatrième complète une paire, elle se calcule.
          for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
            if (i === j) continue;
            const [hi, bi] = trio[i], [hj, bj] = trio[j];
            const a = f.lg2.get(hj), b = f.lg2.get(bj);
            if (!a || !b) continue;
            const hb = f.lg2.get(bi), hh = f.lg2.get(hi);
            if (hb && !hh) {
              out.push({ but: ['lg2', hi, F.qDiv(F.qMul(hb, a), b)],
                         depuis: [p, ['lg2', hj, a], ['lg2', bj, b], ['lg2', bi, hb]],
                         calcul: [hi, bi, hj, bj, 'thales'] });
            }
            if (hh && !hb) {
              out.push({ but: ['lg2', bi, F.qDiv(F.qMul(hh, b), a)],
                         depuis: [p, ['lg2', hj, a], ['lg2', bj, b], ['lg2', hi, hh]],
                         calcul: [bi, hi, bj, hj, 'thales'] });
            }
          }
        }
        return out;
      }
    },
    {
      cle: 'thales-reciproque',
      nom: 'عكس نظرية طالس : إذا كانت النّسب متساوية فالمستقيمان متوازيان',
      chercher: (ctx, f) => {
        const out = [];
        for (const t of ctx.thales || []) {
          const a = f.lg2.get(seg(t.S, t.M)), b = f.lg2.get(seg(t.S, t.B));
          const c = f.lg2.get(seg(t.S, t.N)), d = f.lg2.get(seg(t.S, t.C));
          if (!a || !b || !c || !d) continue;
          if (!F.qEgaux(F.qMul(a, d), F.qMul(c, b))) continue;
          const p = ['para', dr(t.M, t.N), dr(t.B, t.C)];
          if (f.para.some(x => cleFait(x) === cleFait(p))) continue;
          out.push({ but: p,
                     depuis: [['lg2', seg(t.S, t.M), a], ['lg2', seg(t.S, t.B), b],
                              ['lg2', seg(t.S, t.N), c], ['lg2', seg(t.S, t.C), d]],
                     calcul: [seg(t.S, t.M), seg(t.S, t.B),
                              seg(t.S, t.N), seg(t.S, t.C), 'reciproque'] });
        }
        return out;
      }
    },
    {
      cle: 'milieux',
      nom: 'مبرهنة المنتصفين : المستقيم المارّ من منتصفَي ضلعين في مثلّث يوازي الضّلع الثالث و طوله نصف طوله',
      chercher: (ctx, f) => {
        const out = [];
        for (const t of ctx.thales || []) {
          const mM = f.milieu.some(x => x[1] === t.M && seg(x[2], x[3]) === seg(t.S, t.B));
          const mN = f.milieu.some(x => x[1] === t.N && seg(x[2], x[3]) === seg(t.S, t.C));
          if (!mM || !mN) continue;
          const p = ['para', dr(t.M, t.N), dr(t.B, t.C)];
          const dep = [['milieu', t.M, ...seg(t.S, t.B).split('')],
                       ['milieu', t.N, ...seg(t.S, t.C).split('')]];
          if (!f.para.some(x => cleFait(x) === cleFait(p))) out.push({ but: p, depuis: dep });
          const bc = f.lg2.get(seg(t.B, t.C));
          if (bc && !f.lg2.has(seg(t.M, t.N))) {
            out.push({ but: ['lg2', seg(t.M, t.N), F.qDiv(bc, F.q(4))],
                       depuis: dep.concat([['lg2', seg(t.B, t.C), bc]]),
                       calcul: [seg(t.B, t.C), seg(t.M, t.N), 'moitie'] });
          }
        }
        return out;
      }
    },
    {
      cle: 'milieux-reciproque',
      nom: 'المستقيم المارّ من منتصف ضلع و الموازي لضلع ثانٍ يمرّ من منتصف الضّلع الثالث',
      chercher: (ctx, f) => {
        const out = [];
        for (const t of ctx.thales || []) {
          const mM = f.milieu.some(x => x[1] === t.M && seg(x[2], x[3]) === seg(t.S, t.B));
          if (!mM) continue;
          const p = ['para', dr(t.M, t.N), dr(t.B, t.C)];
          if (!f.para.some(x => cleFait(x) === cleFait(p))) continue;
          if (f.milieu.some(x => x[1] === t.N && seg(x[2], x[3]) === seg(t.S, t.C))) continue;
          out.push({ but: ['milieu', t.N, ...seg(t.S, t.C).split('')],
                     depuis: [['milieu', t.M, ...seg(t.S, t.B).split('')], p] });
        }
        return out;
      }
    },
    {
      cle: 'milieu-longueur',
      nom: 'منتصف قطعة يقسمها إلى نصفين متقايسين',
      chercher: (ctx, f) => {
        const out = [];
        for (const m of f.milieu) {
          const [, I, A, C] = m;
          const t = f.lg2.get(seg(A, C));
          if (t && !f.lg2.has(seg(I, A))) {
            out.push({ but: ['lg2', seg(I, A), F.qDiv(t, F.q(4))],
                       depuis: [m, ['lg2', seg(A, C), t]],
                       calcul: [seg(A, C), seg(I, A), 'moitie'] });
          }
          const d = f.lg2.get(seg(I, A));
          if (d && !f.lg2.has(seg(A, C))) {
            out.push({ but: ['lg2', seg(A, C), F.qMul(d, F.q(4))],
                       depuis: [m, ['lg2', seg(I, A), d]],
                       calcul: [seg(I, A), seg(A, C), 'double'] });
          }
        }
        return out;
      }
    }
  ];

  // ── La recherche : en largeur, donc le chemin trouvé est le plus court ───
  //
  // Le plus court est celui que le maître attend, et le seul qu'un élève
  // puisse refaire de tête.
  function chercher(hypotheses, but, ctx, tours) {
    const connus = new Map();
    for (const h of hypotheses) connus.set(cleFait(h), { fait: h, regle: null, depuis: [] });
    // Ce que la figure donne — mais jamais le but.
    for (const a of (ctx.dessin || [])) {
      if (DU_DESSIN[a[0]] && cleFait(a) !== cleFait(but)) {
        connus.set(cleFait(a), { fait: a, regle: null, depuis: [] });
      }
    }
    const cible = cleFait(but);
    // Un but « existentiel » : ['lg2', 'AF', null] — calcule AF, sans dire
    // combien. Exiger « démontre que AF = 3 » donnerait la réponse.
    const ouvert = but[but.length - 1] === null;
    const vise = f => (ouvert ? f[0] === but[0] && f[1] === but[1] : cleFait(f) === cible);
    if ([...connus.values()].some(x => vise(x.fait))) return [];

    for (let tour = 0; tour < (tours || 6); tour++) {
      const f = tables([...connus.values()].map(x => x.fait));
      let neuf = false;
      for (const r of REGLES) {
        for (const p of r.chercher(ctx, f)) {
          const k = cleFait(p.but);
          if (connus.has(k)) continue;
          if (p.depuis.some(d => !connus.has(cleFait(d)))) continue;
          connus.set(k, { fait: p.but, regle: r, depuis: p.depuis, calcul: p.calcul });
          neuf = true;
          if (vise(p.but)) return remonter(connus, k);
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
      n.depuis.forEach(d => creuser(cleFait(d)));
      ordre.push(n);
    })(cible);
    return ordre;
  }

  const API = { REGLES, chercher, tables, cleFait, seg, dr, DU_DESSIN };
  if (M) module.exports = API; else racine.Regles = API;
})(typeof window !== 'undefined' ? window : globalThis);
