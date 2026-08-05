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
      rapport: [], aligne: [], cercle: [], prop: [],
      pgram: [], rect4: [], losange: [], gravite: [], ortho: [], sym: []
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
      cle: 'thales-rapports',
      nom: 'نظرية طالس : الموازي لأحد أضلاع مثلّث يقسم الضّلعين الآخرين إلى أجزاء متناسبة',
      // La feuille « النشاط الأول » ne donne AUCUN nombre : elle demande de
      // lire la configuration et d'écrire les trois rapports. La conclusion
      // n'est donc pas une longueur, c'est la proportion elle-même.
      chercher: (ctx, f) => {
        const out = [];
        for (const t of ctx.thales || []) {
          const p = ['para', dr(t.M, t.N), dr(t.B, t.C)];
          if (!f.para.some(x => cleFait(x) === cleFait(p))) continue;
          const but = ['prop', seg(t.S, t.M) + '|' + seg(t.S, t.B),
                              seg(t.S, t.N) + '|' + seg(t.S, t.C),
                              seg(t.M, t.N) + '|' + seg(t.B, t.C)];
          if (f.prop.some(x => cleFait(x) === cleFait(but))) continue;
          out.push({ but, depuis: [p] });
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
    },

    // ── C. LES QUADRILATÈRES ──────────────────────────────────────────────
    //
    // UN QUADRILATÈRE SE NOMME DANS L'ORDRE. « ABCD » n'est pas « ABDC » : le
    // premier est un parallélogramme quand [AC] et [BD] se coupent en leur
    // milieu, le second quand ce sont [AD] et [BC]. Les sommets se lisent en
    // tournant, et l'on ne peut pas les permuter sans changer la figure.
    {
      cle: 'pgram-diagonales',
      nom: 'الرّباعي الذي قطراه لهما نفس المنتصف هو متوازي أضلاع',
      chercher: (ctx, f) => {
        const out = [];
        for (const Q of ctx.quadrilateres || []) {
          const [A, B, C, D] = Q.split('');
          const m1 = f.milieu.find(x => seg(x[2], x[3]) === seg(A, C));
          const m2 = f.milieu.find(x => seg(x[2], x[3]) === seg(B, D));
          if (!m1 || !m2 || m1[1] !== m2[1]) continue;
          if (f.pgram.some(x => x[1] === Q)) continue;
          out.push({ but: ['pgram', Q], depuis: [m1, m2] });
        }
        return out;
      }
    },
    {
      cle: 'pgram-cotes',
      nom: 'الرّباعي الذي فيه ضلعان متقابلان متوازيان و متقايسان هو متوازي أضلاع',
      chercher: (ctx, f) => {
        const out = [];
        for (const Q of ctx.quadrilateres || []) {
          const [A, B, C, D] = Q.split('');
          const p = ['para', dr(A, B), dr(C, D)];
          const ab = f.lg2.get(seg(A, B)), cd = f.lg2.get(seg(C, D));
          if (!f.para.some(x => cleFait(x) === cleFait(p))) continue;
          if (!ab || !cd || !F.qEgaux(ab, cd)) continue;
          if (f.pgram.some(x => x[1] === Q)) continue;
          out.push({ but: ['pgram', Q],
                     depuis: [p, ['lg2', seg(A, B), ab], ['lg2', seg(C, D), cd]] });
        }
        return out;
      }
    },
    {
      cle: 'pgram-donne-cotes',
      nom: 'في متوازي الأضلاع كلّ ضلعين متقابلين متوازيان و متقايسان',
      chercher: (ctx, f) => {
        const out = [];
        for (const g of f.pgram) {
          const [A, B, C, D] = g[1].split('');
          for (const [x, y, u, v] of [[A, B, D, C], [A, D, B, C]]) {
            const su = f.lg2.get(seg(u, v));
            if (su && !f.lg2.has(seg(x, y))) {
              out.push({ but: ['lg2', seg(x, y), su],
                         depuis: [g, ['lg2', seg(u, v), su]],
                         calcul: [seg(u, v), seg(x, y), 'oppose'] });
            }
            const p = ['para', dr(x, y), dr(u, v)];
            if (!f.para.some(z => cleFait(z) === cleFait(p))) {
              out.push({ but: p, depuis: [g] });
            }
          }
        }
        return out;
      }
    },
    {
      cle: 'rectangle',
      nom: 'متوازي أضلاع له زاوية قائمة هو مستطيل',
      chercher: (ctx, f) => {
        const out = [];
        for (const g of f.pgram) {
          const [A, B, C, D] = g[1].split('');
          const r = f.rect.find(x => x[2] === B && seg(x[1], x[3]) === seg(A, C));
          if (!r || f.rect4.some(x => x[1] === g[1])) continue;
          out.push({ but: ['rect4', g[1]], depuis: [g, r] });
        }
        return out;
      }
    },
    {
      cle: 'losange',
      nom: 'متوازي أضلاع له ضلعان متتاليان متقايسان هو معيّن',
      chercher: (ctx, f) => {
        const out = [];
        for (const g of f.pgram) {
          const [A, B, C] = g[1].split('');
          const ab = f.lg2.get(seg(A, B)), bc = f.lg2.get(seg(B, C));
          if (!ab || !bc || !F.qEgaux(ab, bc)) continue;
          if (f.losange.some(x => x[1] === g[1])) continue;
          out.push({ but: ['losange', g[1]],
                     depuis: [g, ['lg2', seg(A, B), ab], ['lg2', seg(B, C), bc]] });
        }
        return out;
      }
    },

    // ── D. LES POINTS REMARQUABLES DU TRIANGLE ────────────────────────────
    {
      cle: 'centre-gravite',
      nom: 'متوسّطات مثلّث تتقاطع في نقطة واحدة هي مركز ثقله',
      chercher: (ctx, f) => {
        const out = [];
        for (const g of ctx.gravites || []) {          // {G, tri, I, J}
          const m1 = f.milieu.find(x => x[1] === g.I);
          const m2 = f.milieu.find(x => x[1] === g.J);
          if (!m1 || !m2) continue;
          if (f.gravite.some(x => x[1] === g.G && x[2] === g.tri)) continue;
          out.push({ but: ['gravite', g.G, g.tri], depuis: [m1, m2] });
        }
        return out;
      }
    },
    {
      cle: 'gravite-deux-tiers',
      nom: 'مركز الثقل يقع على بعد ثلثَي المتوسّط من الرّأس',
      chercher: (ctx, f) => {
        const out = [];
        for (const v of f.gravite) {
          const g = (ctx.gravites || []).find(x => x.G === v[1] && x.tri === v[2]);
          if (!g) continue;
          const S = g.tri.split('').find(x => !seg(...g.tri.split('').filter(y => y !== x)).includes(x)
            && g.I === (ctx.milieux || {})[seg(...g.tri.split('').filter(y => y !== x))]);
          if (!S) continue;
          const ai = f.lg2.get(seg(S, g.I));
          if (ai && !f.lg2.has(seg(S, v[1]))) {
            out.push({ but: ['lg2', seg(S, v[1]), F.qMul(ai, F.q(4, 9))],
                       depuis: [v, ['lg2', seg(S, g.I), ai]],
                       calcul: [seg(S, g.I), seg(S, v[1]), 'deux-tiers'] });
          }
        }
        return out;
      }
    },
    {
      cle: 'orthocentre',
      nom: 'ارتفاعات مثلّث تتقاطع في نقطة واحدة هي مركزه القائم',
      chercher: (ctx, f) => {
        const out = [];
        for (const o of ctx.orthos || []) {            // {H, tri, h1:[X,Y], h2:[…]}
          const p1 = ['perp', dr(...o.h1), dr(...o.c1)];
          const p2 = ['perp', dr(...o.h2), dr(...o.c2)];
          if (!f.perp.some(x => cleFait(x) === cleFait(p1))) continue;
          if (!f.perp.some(x => cleFait(x) === cleFait(p2))) continue;
          if (f.ortho.some(x => x[1] === o.H && x[2] === o.tri)) continue;
          out.push({ but: ['ortho', o.H, o.tri], depuis: [p1, p2] });
        }
        return out;
      }
    },
    {
      cle: 'orthocentre-troisieme',
      nom: 'الارتفاع الثالث يمرّ بدوره من المركز القائم',
      chercher: (ctx, f) => {
        const out = [];
        for (const v of f.ortho) {
          const o = (ctx.orthos || []).find(x => x.H === v[1] && x.tri === v[2]);
          if (!o || !o.h3) continue;
          const p = ['perp', dr(...o.h3), dr(...o.c3)];
          if (f.perp.some(x => cleFait(x) === cleFait(p))) continue;
          out.push({ but: p, depuis: [v] });
        }
        return out;
      }
    },

    // ── E. LE TRANSPORT PAR SYMÉTRIE CENTRALE ─────────────────────────────
    {
      cle: 'symetrie-longueur',
      nom: 'التناظر المركزي يحفظ المسافات',
      chercher: (ctx, f) => {
        const out = [];
        const par = {};
        for (const s of f.sym) par[s[2]] = { image: s[1], centre: s[3] };
        for (const a of Object.keys(par)) for (const b of Object.keys(par)) {
          if (a >= b || par[a].centre !== par[b].centre) continue;
          const v = f.lg2.get(seg(a, b));
          const cible = seg(par[a].image, par[b].image);
          if (!v || f.lg2.has(cible)) continue;
          out.push({ but: ['lg2', cible, v],
                     depuis: [['sym', par[a].image, a, par[a].centre],
                              ['sym', par[b].image, b, par[b].centre],
                              ['lg2', seg(a, b), v]],
                     calcul: [seg(a, b), cible, 'symetrie'] });
        }
        return out;
      }
    },
    {
      cle: 'symetrie-parallele',
      nom: 'صورة مستقيم بتناظر مركزي هي مستقيم يوازيه',
      chercher: (ctx, f) => {
        const out = [];
        const par = {};
        for (const s of f.sym) par[s[2]] = { image: s[1], centre: s[3] };
        for (const a of Object.keys(par)) for (const b of Object.keys(par)) {
          if (a >= b || par[a].centre !== par[b].centre) continue;
          const p = ['para', dr(a, b), dr(par[a].image, par[b].image)];
          if (f.para.some(x => cleFait(x) === cleFait(p))) continue;
          out.push({ but: p, depuis: [['sym', par[a].image, a, par[a].centre],
                                      ['sym', par[b].image, b, par[b].centre]] });
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
