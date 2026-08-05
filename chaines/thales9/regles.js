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

  // LA CLÉ D'UN RAPPORT. « AD/AB » et « DA/BA » sont le même rapport ; sans
  // une écriture unique, la chaîne les prendrait pour deux faits distincts et
  // tournerait en rond. Le sommet partagé passe en tête — c'est ainsi que le
  // maître écrit ses proportions —, et à défaut de sommet commun on retombe
  // sur l'ordre alphabétique.
  function cleR(h, b) {
    const A = String(h).split(''), B = String(b).split('');
    if (A.length !== 2 || B.length !== 2) return null;
    if (seg(A[0], A[1]) === seg(B[0], B[1])) return null;      // rapport égal à 1
    const v = A.find(z => B.includes(z));
    if (v) {
      const x = A.find(z => z !== v), y = B.find(z => z !== v);
      if (!x || !y) return null;
      return v + x + '|' + v + y;
    }
    return seg(A[0], A[1]) + '|' + seg(B[0], B[1]);
  }

  // ── Les tables, refaites à chaque tour ───────────────────────────────────
  function tables(faits) {
    const t = {
      para: [], perp: [], milieu: [], lg2: new Map(), rect: [],
      rapport: [], aligne: [], cercle: [], prop: [],
      pgram: [], rect4: [], losange: [], gravite: [], ortho: [], sym: [],
      relation: [], angles: []
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
    // L'ORDRE DES DEUX FORMULATIONS N'EST PAS INDIFFÉRENT. Le maître les
    // écrit toutes deux dans sa مراجعة, et elles ont les mêmes prémisses ;
    // mais quand l'énoncé dit « [AB] قطر للدائرة », c'est le DIAMÈTRE qui
    // justifie l'angle droit, et l'élève doit lire ce mot-là dans sa
    // correction. On essaie donc le diamètre d'abord ; l'équidistance
    // reprend la main dès qu'aucun diamètre n'est déclaré.
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
            // LA CONFIGURATION VOYAGE AVEC LE PAS. Ce n'est pas un ornement :
            // le maître exige que la rédaction nomme le triangle, la
            // parallèle et les appartenances — sans elles, la réponse est
            // fausse et la note est zéro. La règle rend donc de quoi écrire
            // sa justification en entier, et le validateur vérifie ensuite
            // qu'elle y est.
            if (hb && !hh) {
              out.push({ but: ['lg2', hi, F.qDiv(F.qMul(hb, a), b)],
                         depuis: [p, ['lg2', hj, a], ['lg2', bj, b], ['lg2', bi, hb]],
                         conf: t, paires: { connu: [hj, bj], cible: [hi, bi], inconnu: hi },
                         calcul: [hi, bi, hj, bj, 'thales'] });
            }
            if (hh && !hb) {
              out.push({ but: ['lg2', bi, F.qDiv(F.qMul(hh, b), a)],
                         depuis: [p, ['lg2', hj, a], ['lg2', bj, b], ['lg2', hi, hh]],
                         conf: t, paires: { connu: [hj, bj], cible: [hi, bi], inconnu: bi },
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
          // LES RAPPORTS SE LISENT DEPUIS LE SOMMET, comme le maître les
          // écrit : AM/AB = AN/AC = MN/BC. L'ordre alphabétique des clés de
          // segment donnait « DI/BD = CD/AD », juste et illisible — la
          // question posait DI/DB et la réponse répondait DI/BD.
          const but = ['prop', t.S + t.M + '|' + t.S + t.B,
                              t.S + t.N + '|' + t.S + t.C,
                              t.M + t.N + '|' + t.B + t.C];
          if (f.prop.some(x => cleFait(x) === cleFait(but))) continue;
          out.push({ but, depuis: [p], conf: t });
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
                     conf: t, sens: 'reciproque',
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

    // ── B bis. L'ARITHMÉTIQUE DES LONGUEURS ALIGNÉES ──────────────────────
    //
    // « CE = CA − AE » : rien de plus banal, et le moteur ne savait pas le
    // faire. Il stocke des CARRÉS — c'est ce qui rend tout exact — et
    // (√a + √b)² vaut a + b + 2√(ab), irrationnel en général. On ne conclut
    // donc que lorsque les deux longueurs sont elles-mêmes rationnelles ; dans
    // les autres cas la règle se tait, plutôt que d'écrire un carré faux.
    //
    // L'ORDRE DES POINTS EST LU SUR LA FIGURE. « B entre A et C » n'est pas
    // démontré ici : c'est l'énoncé qui le pose, comme il pose un milieu.
    {
      cle: 'somme-longueurs',
      nom: 'إذا كانت النقطة B بين A و C فإنّ AC = AB + BC',
      chercher: (ctx, f) => {
        const out = [];
        for (const [A, Bp, C] of ctx.entre || []) {
          const ab = f.lg2.get(seg(A, Bp)), bc = f.lg2.get(seg(Bp, C)),
                ac = f.lg2.get(seg(A, C));
          const r = x => (x === undefined ? null : F.racQ(x));
          const ra = r(ab), rb = r(bc), rc = r(ac);
          if (ra && rb && !ac) {
            const t = F.qAdd(ra, rb);
            out.push({ but: ['lg2', seg(A, C), F.qMul(t, t)],
                       depuis: [['lg2', seg(A, Bp), ab], ['lg2', seg(Bp, C), bc]],
                       calcul: [seg(A, Bp), seg(Bp, C), seg(A, C), 'plus'] });
          }
          if (rc && ra && !bc) {
            const t = F.qSub(rc, ra);
            if (F.qPos(t)) out.push({ but: ['lg2', seg(Bp, C), F.qMul(t, t)],
                       depuis: [['lg2', seg(A, C), ac], ['lg2', seg(A, Bp), ab]],
                       calcul: [seg(A, C), seg(A, Bp), seg(Bp, C), 'moins'] });
          }
          if (rc && rb && !ab) {
            const t = F.qSub(rc, rb);
            if (F.qPos(t)) out.push({ but: ['lg2', seg(A, Bp), F.qMul(t, t)],
                       depuis: [['lg2', seg(A, C), ac], ['lg2', seg(Bp, C), bc]],
                       calcul: [seg(A, C), seg(Bp, C), seg(A, Bp), 'moins'] });
          }
        }
        return out;
      }
    },

    // ── B ter. UNE RELATION ENTRE PLUSIEURS RAPPORTS ──────────────────────
    //
    // Le moteur savait comparer DEUX rapports ; il ne savait ni en additionner
    // ni en multiplier trois. Or les feuilles le demandent :
    //
    //   THALES0 ex2  (MC/MB)·(ND/NC)·(PB/PA) = 1, à la manière de Ménélaüs
    //   THALES0 ex5  EF/AB + EF/CD = 1, dans le trapèze rectangle
    //
    // La règle propose la relation à partir des parallèles qui la fondent ;
    // ce sont les COORDONNÉES qui disent si elle est vraie, comme partout
    // ailleurs. L'item déclare laquelle est en jeu — c'est l'énoncé du maître,
    // pas une invention du moteur.
    {
      cle: 'relation-rapports',
      nom: 'بتطبيق نظرية طالس على كلّ متوازيين، نحصل على العلاقة بين النّسب',
      chercher: (ctx, f) => {
        const out = [];
        for (const r of ctx.relations || []) {
          const dep = (r.depuis || []).map(p => ['para', p[0], p[1]]);
          if (dep.some(d => !f.para.some(x => cleFait(x) === cleFait(d)))) continue;
          // D'OÙ SORT LA VALEUR ? Quand la relation vaut 1 — Ménélaüs, le
          // trapèze —, elle ne vient d'aucune mesure et les parallèles
          // suffisent. Mais « OD/OE = 4/9 » vient de OA et de OB, et sans
          // elles la correction annoncerait un nombre tombé du ciel. L'item
          // dit alors quelles longueurs le portent, et la règle attend de les
          // avoir avant de conclure.
          let manque = false;
          for (const k of r.longueurs || []) {
            const v = f.lg2.get(k);
            if (!v) { manque = true; break; }
            dep.push(['lg2', k, v]);
          }
          if (manque) continue;
          const but = ['relation', r.op, r.rapports.map(x => x.join('|')).join(';'),
                       r.valeur.n + '/' + r.valeur.d];
          if (f.relation.some(x => cleFait(x) === cleFait(but))) continue;
          out.push({ but, depuis: dep });
        }
        return out;
      }
    },

    // ── B bis bis. L'ALGÈBRE DES RAPPORTS ─────────────────────────────────
    //
    // THALES0 2014 ex4 ne donne que deux longueurs — AB = 5 et AD = 2 — et
    // pose huit questions. Tout le reste y est RAPPORT : « بيّن أنّ
    // AE/AC = BF/BC », « استنتج أنّ AD/AB = BF/BC », « استنتج BG = 2 »,
    // « بيّن أنّ AE = CH ». On ne peut pas y répondre en calculant des
    // longueurs : AC et BC ne sont jamais donnés, et ne le seront pas.
    //
    // Le moteur savait comparer des longueurs ; il ne savait rien faire d'un
    // rapport. Quatre règles suffisent, et ce sont celles que l'élève emploie :
    //
    //   · deux longueurs connues donnent la valeur d'un rapport ;
    //   · dans une proportion, la valeur passe d'un rapport aux deux autres ;
    //   · si X est entre A et B, AX/AB et XB/AB se complètent à 1 ;
    //   · un rapport connu et une longueur connue donnent l'autre longueur.
    //
    // Et une cinquième, pour « AE = CH » : deux rapports de même dénominateur
    // et de même valeur ont des numérateurs égaux — SANS que le dénominateur
    // soit connu. C'est exactement ce que le maître fait dire à l'élève.
    //
    // UN RAPPORT SE NOMME DEPUIS SON SOMMET, comme les proportions : AD/AB et
    // non DA/BA. Deux écritures du même rapport doivent avoir la même clé,
    // sans quoi la chaîne les prendrait pour deux faits différents.
    {
      cle: 'rapport-par-longueurs',
      nom: 'نسبة طولين معلومين تُحسب مباشرة',
      chercher: (ctx, f) => {
        const out = [];
        for (const t of ctx.thales || []) {
          for (const [h, b] of [[t.S + t.M, t.S + t.B], [t.S + t.N, t.S + t.C],
                                [t.M + t.N, t.B + t.C]]) {
            const k = cleR(h, b);
            if (!k || f.rapport.some(x => x[1] === k)) continue;
            const a = f.lg2.get(seg(h[0], h[1])), c = f.lg2.get(seg(b[0], b[1]));
            if (!a || !c) continue;
            const r = F.racQ(F.qDiv(a, c));
            if (!r || F.qNul(r)) continue;
            out.push({ but: ['rapport', k, r],
                       depuis: [['lg2', seg(h[0], h[1]), a], ['lg2', seg(b[0], b[1]), c]] });
          }
        }
        return out;
      }
    },
    {
      cle: 'rapport-transitif',
      nom: 'في تناسب، كلّ النّسب لها نفس القيمة',
      chercher: (ctx, f) => {
        const out = [];
        for (const p of f.prop) {                       // ['prop', r1, r2, r3]
          const rs = [p[1], p[2], p[3]].map(x => cleR(...x.split('|')));
          const su = f.rapport.find(x => rs.includes(x[1]));
          if (!su) continue;
          for (const k of rs) {
            if (!k || k === su[1] || f.rapport.some(x => x[1] === k)) continue;
            out.push({ but: ['rapport', k, su[2]], depuis: [p, su] });
          }
        }
        return out;
      }
    },
    {
      cle: 'rapport-complement',
      nom: 'إذا كانت X بين A و B فإنّ AX/AB + XB/AB = 1',
      chercher: (ctx, f) => {
        const out = [];
        for (const [A, X, B] of ctx.entre || []) {
          for (const [P, Q] of [[A, B], [B, A]]) {
            const su = f.rapport.find(x => x[1] === cleR(P + X, P + Q));
            if (!su) continue;
            const k = cleR(Q + X, Q + P);
            if (!k || f.rapport.some(x => x[1] === k)) continue;
            const v = F.qSub(F.Q1, su[2]);
            if (!F.qPos(v)) continue;
            out.push({ but: ['rapport', k, v], depuis: [su] });
          }
        }
        return out;
      }
    },
    {
      cle: 'longueur-par-rapport',
      nom: 'إذا عُلمت نسبة طولين و عُلم أحدهما، حُسب الآخر',
      chercher: (ctx, f) => {
        const out = [];
        for (const r of f.rapport) {
          const [H, B2] = r[1].split('|');
          const kh = seg(H[0], H[1]), kb = seg(B2[0], B2[1]);
          const a = f.lg2.get(kh), c = f.lg2.get(kb);
          if (c && !a) {
            const L = F.racQ(c);
            if (!L) continue;
            const x = F.qMul(L, r[2]);
            out.push({ but: ['lg2', kh, F.qMul(x, x)],
                       depuis: [r, ['lg2', kb, c]],
                       calcul: [r[1], kb, 'parRapport', r[2].n + '/' + r[2].d] });
          }
          if (a && !c) {
            const L = F.racQ(a);
            if (!L || F.qNul(r[2])) continue;
            const x = F.qDiv(L, r[2]);
            out.push({ but: ['lg2', kb, F.qMul(x, x)],
                       depuis: [r, ['lg2', kh, a]],
                       calcul: [r[1], kh, 'parRapport', r[2].n + '/' + r[2].d] });
          }
        }
        return out;
      }
    },
    {
      cle: 'rapports-egaux',
      nom: 'نسبتان لهما نفس المقام و نفس القيمة، فبَسطاهما متقايسان',
      chercher: (ctx, f) => {
        const out = [];
        for (const a of f.rapport) for (const b of f.rapport) {
          if (a === b) continue;
          const [ha, ba] = a[1].split('|'), [hb, bb] = b[1].split('|');
          if (seg(ba[0], ba[1]) !== seg(bb[0], bb[1])) continue;
          if (!F.qEgaux(a[2], b[2]) || F.qNul(a[2])) continue;
          if (seg(ha[0], ha[1]) === seg(hb[0], hb[1])) continue;
          const k = cleR(ha, hb);
          if (!k || f.rapport.some(x => x[1] === k)) continue;
          out.push({ but: ['rapport', k, F.Q1], depuis: [a, b] });
        }
        return out;
      }
    },

    // ── B ter bis. LA SOMME DE DEUX RAPPORTS QUI VAUT UN ──────────────────
    //
    // THALES0 2014 ex5 : on démontre d'abord EF/AB + EF/CD = 1, puis le
    // maître écrit « استنتج أنّ EF = 15/8 ». C'est une déduction, pas une
    // évidence : les deux rapports ont le MÊME numérateur, donc
    //
    //     EF × (1/AB + 1/CD) = 1     d'où     EF = 1/(1/AB + 1/CD).
    //
    // Le moteur savait établir la relation ; il ne savait pas en tirer la
    // longueur, et l'exercice s'arrêtait à sa troisième question.
    {
      cle: 'rapport-par-somme',
      nom: 'إذا كان مجموع نسبتين لهما نفس البسط يساوي 1، أمكن حساب هذا البسط',
      chercher: (ctx, f) => {
        const out = [];
        for (const r of f.relation) {                 // ['relation', op, liste, val]
          if (r[1] !== 'somme' || r[3] !== '1/1') continue;
          const parts = r[2].split(';').map(x => x.split('|'));
          const num = seg(parts[0][0], parts[0][1]);
          if (!parts.every(p => seg(p[0], p[1]) === num)) continue;
          if (f.lg2.has(num)) continue;
          let somme = F.Q0, bon = true;
          const dep = [r];
          for (const p of parts) {
            const k = seg(p[2], p[3]);
            const v = f.lg2.get(k);
            const L = v ? F.racQ(v) : null;
            if (!L || F.qNul(L)) { bon = false; break; }
            somme = F.qAdd(somme, F.qDiv(F.Q1, L));
            dep.push(['lg2', k, v]);
          }
          if (!bon || F.qNul(somme)) continue;
          const x = F.qDiv(F.Q1, somme);
          out.push({ but: ['lg2', num, F.qMul(x, x)], depuis: dep,
                     calcul: [num, 'somme-un'].concat(parts.map(p => seg(p[2], p[3]))) });
        }
        return out;
      }
    },

    // ── B quater. PARTAGER UN SEGMENT DANS UN RAPPORT DONNÉ ───────────────
    //
    // « أحسب IN و IQ » : on connaît le rapport IN/IQ par Thalès, et la somme
    // IN + IQ = NQ par la figure. Ni l'un ni l'autre ne suffit — c'est un
    // système, et c'est pour cela que le moteur butait. Deux données pour deux
    // inconnues : IN = NQ · r/(1+r), où r est le rapport.
    //
    // Le moteur ne conclut que si le rapport et la somme sont RATIONNELS ;
    // sinon il se tait, comme pour la somme de longueurs.
    {
      cle: 'partage-rapport',
      nom: 'إذا عُلم رابط بين جزأي قطعة و عُلم طولها، أمكن حساب كلّ جزء',
      chercher: (ctx, f) => {
        const out = [];
        for (const t of ctx.thales || []) {
          const p = ['para', dr(t.M, t.N), dr(t.B, t.C)];
          if (!f.para.some(x => cleFait(x) === cleFait(p))) continue;
          const mn = f.lg2.get(seg(t.M, t.N)), bc = f.lg2.get(seg(t.B, t.C));
          if (!mn || !bc) continue;
          const r = F.racQ(F.qDiv(mn, bc));            // le rapport, s'il est rationnel
          if (!r || F.qNul(r)) continue;
          // Les deux morceaux possibles : [N…C] de part et d'autre de S, et
          // [M…B] de même.
          for (const [X, Y] of [[t.N, t.C], [t.M, t.B]]) {
            if (!(ctx.entre || []).some(e => e[1] === t.S
                  && seg(e[0], e[2]) === seg(X, Y))) continue;
            const tot = f.lg2.get(seg(X, Y));
            if (!tot) continue;
            const L = F.racQ(tot);
            if (!L) continue;
            const un = F.qDiv(F.qMul(L, r), F.qAdd(F.Q1, r));   // le côté de X
            const deux = F.qSub(L, un);
            if (!f.lg2.has(seg(t.S, X))) {
              out.push({ but: ['lg2', seg(t.S, X), F.qMul(un, un)],
                         depuis: [p, ['lg2', seg(t.M, t.N), mn],
                                  ['lg2', seg(t.B, t.C), bc], ['lg2', seg(X, Y), tot]],
                         conf: t,
                         calcul: [seg(t.M, t.N), seg(t.B, t.C), seg(X, Y), 'partage'] });
            }
            if (!f.lg2.has(seg(t.S, Y))) {
              out.push({ but: ['lg2', seg(t.S, Y), F.qMul(deux, deux)],
                         depuis: [p, ['lg2', seg(t.M, t.N), mn],
                                  ['lg2', seg(t.B, t.C), bc], ['lg2', seg(X, Y), tot]],
                         conf: t,
                         calcul: [seg(t.M, t.N), seg(t.B, t.C), seg(X, Y), 'partage'] });
            }
          }
        }
        return out;
      }
    },
    // ── B quinquies. LE SOMMET HORS DU MORCEAU ────────────────────────────
    //
    // « (BC)//(DE) ; AB = 5 ; BC = 3 ; DE = 4 ; CE = 2 : أحسب AC » — Thales
    // 2008 ex6. Ni AC ni AE ne sont connus : le rapport seul ne suffit pas, et
    // la règle de Thalès reste muette. Ce qu'on sait, c'est AC/AE = 3/4 et
    // AE − AC = CE = 2 ; c'est encore un système, mais l'autre — le sommet est
    // DEHORS, et la partie connue est celle qui reste.
    //
    //     AC = CE · r/(1 − r)      AE = CE/(1 − r)
    //
    // C'est la forme que la feuille appelle « x/(x + 3) = 45/50 » : l'inconnue
    // des deux côtés de la proportion. Le menhir de son ex6 en vit, et son ex1
    // l'annonçait déjà en algèbre pure.
    {
      cle: 'partage-externe',
      nom: 'إذا عُلمت النّسبة و عُلم الجزء الباقي، أمكن حساب الطولين',
      chercher: (ctx, f) => {
        const out = [];
        for (const t of ctx.thales || []) {
          const p = ['para', dr(t.M, t.N), dr(t.B, t.C)];
          if (!f.para.some(x => cleFait(x) === cleFait(p))) continue;
          const mn = f.lg2.get(seg(t.M, t.N)), bc = f.lg2.get(seg(t.B, t.C));
          if (!mn || !bc) continue;
          const r = F.racQ(F.qDiv(mn, bc));
          if (!r || F.qNul(r)) continue;
          const reste = F.qSub(F.Q1, r);
          // r = 1 : les deux droites seraient confondues ; r > 1 : le morceau
          // connu ne serait pas celui qu'on croit. On se tait.
          if (!F.qPos(reste)) continue;
          for (const [X, Y] of [[t.M, t.B], [t.N, t.C]]) {
            // X ENTRE S ET Y, lu sur la figure : c'est ce qui distingue cette
            // règle de la précédente, où le sommet est au milieu.
            if (!(ctx.entre || []).some(e => e[1] === X
                  && seg(e[0], e[2]) === seg(t.S, Y))) continue;
            const tot = f.lg2.get(seg(X, Y));
            if (!tot) continue;
            const L = F.racQ(tot);
            if (!L) continue;
            const court = F.qDiv(F.qMul(L, r), reste);     // SX
            const long = F.qDiv(L, reste);                 // SY
            const dep = [p, ['lg2', seg(t.M, t.N), mn], ['lg2', seg(t.B, t.C), bc],
                         ['lg2', seg(X, Y), tot]];
            if (!f.lg2.has(seg(t.S, X))) {
              out.push({ but: ['lg2', seg(t.S, X), F.qMul(court, court)], depuis: dep,
                         conf: t,
                         calcul: [seg(t.M, t.N), seg(t.B, t.C), seg(X, Y), 'externe'] });
            }
            if (!f.lg2.has(seg(t.S, Y))) {
              out.push({ but: ['lg2', seg(t.S, Y), F.qMul(long, long)], depuis: dep,
                         conf: t,
                         calcul: [seg(t.M, t.N), seg(t.B, t.C), seg(X, Y), 'externe'] });
            }
          }
        }
        return out;
      }
    },

    // ── B sexies. DEUX ANGLES ALTERNES-INTERNES ÉGAUX ─────────────────────
    //
    // Thales 2008 ex7 ne donne pas le parallélisme : il donne deux angles de
    // même mesure, de part et d'autre de la sécante, et c'est à l'élève d'en
    // tirer que les droites sont parallèles avant d'appliquer Thalès. La règle
    // vient de 8ᵉ ; sans elle, l'exercice commencerait par sa réponse.
    //
    // La configuration — QUI est la sécante, et de quel côté sont les deux
    // sommets — se lit sur la figure, comme un alignement. L'ÉGALITÉ, elle,
    // est une hypothèse, et le validateur la recalcule sur les coordonnées.
    {
      cle: 'para-alternes',
      nom: 'إذا تقايست زاويتان متبادلتان داخليا فالمستقيمان متوازيان',
      chercher: (ctx, f) => {
        const out = [];
        for (const a of ctx.alternes || []) {
          const eg = ['angles', a.p + a.s1 + a.s2, a.q + a.s2 + a.s1];
          if (!f.angles.some(x => cleFait(x) === cleFait(eg))) continue;
          const p = ['para', dr(a.p, a.s1), dr(a.q, a.s2)];
          if (f.para.some(x => cleFait(x) === cleFait(p))) continue;
          out.push({ but: p, depuis: [eg] });
        }
        return out;
      }
    },
    {
      cle: 'milieu-par-egalite',
      nom: 'نقطة من قطعة متساوية البعد عن طرفيها هي منتصفها',
      // « استنتج أنّ I منتصف [EF] » : deux moitiés égales et un point ENTRE
      // les extrémités — la seconde condition n'est pas décorative, sans elle
      // le point pourrait être sur le prolongement.
      chercher: (ctx, f) => {
        const out = [];
        for (const [A, I, C] of ctx.entre || []) {
          const a = f.lg2.get(seg(A, I)), b = f.lg2.get(seg(I, C));
          if (!a || !b || !F.qEgaux(a, b)) continue;
          if (f.milieu.some(m => m[1] === I && seg(m[2], m[3]) === seg(A, C))) continue;
          out.push({ but: ['milieu', I, ...seg(A, C).split('')],
                     depuis: [['lg2', seg(A, I), a], ['lg2', seg(I, C), b]] });
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
          // La configuration et les rapports voyagent avec le pas : c'est
          // avec eux que la rédaction se fait, et sans eux la justification
          // de Thalès serait muette sur le triangle.
          connus.set(k, { fait: p.but, regle: r, depuis: p.depuis, calcul: p.calcul,
                          conf: p.conf, paires: p.paires, sens: p.sens });
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
