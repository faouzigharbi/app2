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
  const It = M ? require('../_regles/itineraire.js') : racine.Itineraire;

  const dit = {
    perp: (a, b) => a + ' ⊥ ' + b,
    para: (a, b) => a + ' // ' + b,
    med: (d, s) => d + ' هو الموسط العمودي للقطعة ' + s,
    passe: (d, p) => p + ' ∈ ' + d,
    egal: (a, b) => a + ' = ' + b,
    mil: (p, s) => p + ' هو منتصف القطعة ' + s,
    // « (Δ) مماس للدائرة (C) في A » — le point de contact fait partie de
    // l'énoncé : une tangente sans son point n'apprend rien.
    tang: (d, t) => d + ' مماس للدائرة ' + t.split('@')[1] + ' في ' + t.split('@')[0],
    nature: (q, v) => 'الرباعي ' + q + ' هو ' + NATURES[v]
  };
  const NATURES = {
    parallelogramme: 'متوازي أضلاع',
    rectangle: 'مستطيل',
    losange: 'معيّن',
    carre: 'مربّع'
  };

  // Un fait s'écrit avec les NOMS de l'énoncé, jamais avec les clés.
  function ecrire(fait, noms) {
    const n = x => noms[x] || x;
    return dit[fait[0]](n(fait[1]), n(fait[2]));
  }

  // ── LE CHOIX DE L'ITINÉRAIRE ─────────────────────────────────────────────
  //
  // Le chapitre des droites est celui où l'élève de 7ᵉ se trompe le plus de
  // porte : il connaît trois règles sur le perpendiculaire et le parallèle,
  // et elles se ressemblent. Dire laquelle et POURQUOI vaut mieux que la
  // démonstration elle-même.
  const COURT = {
    'perp-perp-para': 'عموديان على نفس المستقيم',
    'perp-para-perp': 'عمودي على أحد متوازيين',
    'para-para-para': 'متوازيان لنفس المستقيم',
    'med-perp': 'الموسط العمودي عمودي على القطعة',
    'perp-milieu-med': 'العمودي المارّ من المنتصف',
    'tangente-perp': 'المماس عمودي على الشعاع',
    'milieu-equidistance': 'المنتصف متساوي البعد',
    'egalite-transitive': 'تعدّي التساوي',
    'equidistant-mediatrice': 'النقطة المتساوية البعد',
    'deux-points-mediatrice': 'نقطتان متساويتا البعد',
    'para-para-parallelogramme': 'متوازي الأضلاع',
    'parallelogramme-angle-rectangle': 'المستطيل',
    'med-equidistance': 'نقطة من الموسط العمودي'
  };
  const court = r => COURT[r.cle] || r.nom.split(' : ')[0];
  const NOMBUT = {
    perp: (b, n) => 'إثبات ' + (n[b[1]] || b[1]) + ' ⊥ ' + (n[b[2]] || b[2]),
    para: (b, n) => 'إثبات ' + (n[b[1]] || b[1]) + ' // ' + (n[b[2]] || b[2]),
    med: (b, n) => 'إثبات أنّ ' + (n[b[1]] || b[1]) + ' هو الموسط العمودي',
    egal: (b, n) => 'إثبات تساوي الطولين',
    mil: (b, n) => 'إثبات أنّ ' + (n[b[1]] || b[1]) + ' هو المنتصف',
    passe: (b, n) => 'إثبات الانتماء',
    nature: (b, n) => 'تعيين طبيعة الرباعي ' + b[1],
    tang: (b, n) => 'إثبات المماسة'
  };
  // Ce qui manque à une règle pour s'appliquer, lu sur les faits acquis.
  const MANQUE = {
    'perp-perp-para': h => h.filter(x => x[0] === 'perp').length >= 2 ? null
      : 'لأنّها تحتاج مستقيمين عموديين على نفس المستقيم، و لا نملك إلّا تعامدا واحدا على الأكثر',
    'para-para-para': h => h.filter(x => x[0] === 'para').length >= 2 ? null
      : 'لأنّها تحتاج توازيين، و التوازي غير معطى مرّتين',
    'med-perp': h => h.some(x => x[0] === 'med') ? null
      : 'لأنّها تحتاج موسطا عموديا، و لا موسط في المعطيات',
    'tangente-perp': h => h.some(x => x[0] === 'tang') ? null
      : 'لأنّها تحتاج مماسّا لدائرة، و لا دائرة هنا',
    'milieu-equidistance': h => h.some(x => x[0] === 'mil') ? null
      : 'لأنّها تحتاج منتصف قطعة، و لا منتصف في المعطيات',
    'equidistant-mediatrice': h => h.some(x => x[0] === 'egal') ? null
      : 'لأنّها تحتاج تساوي طولين، و لا تساوي في المعطيات'
  };
  const CANDIDATES = ['perp-perp-para', 'para-para-para', 'med-perp',
                      'tangente-perp', 'milieu-equidistance',
                      'equidistant-mediatrice'];

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

    // UN QUADRILATÈRE EST QUATRE CÔTÉS PRIS DANS L'ORDRE. On les nomme une
    // fois pour toutes : les règles qui décident de sa nature ne parlent que
    // de ces quatre-là, et l'ordre des sommets n'est pas décoratif.
    const quads = new Map();

    const cercles = s.cercles || [];
    // Le rayon d'un cercle est une droite comme une autre : elle porte un nom,
    // et c'est par elle que la tangente devient une perpendiculaire.
    for (const c of cercles) {
      for (const p of Object.keys(s.pts)) {
        if (F.memesPoints(s.pts[p], s.pts[c.centre])) continue;
        const k = R.cleDroite(s.pts[c.centre], s.pts[p]);
        if (noms[k] === undefined) noms[k] = '(' + c.centre + p + ')';
      }
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

    for (const g of s.quads || []) {
      const [A1, B1, C1, D1] = g.sommets;
      quads.set(g.nom, {
        AB: R.cleDroite(s.pts[A1], s.pts[B1]), BC: R.cleDroite(s.pts[B1], s.pts[C1]),
        CD: R.cleDroite(s.pts[C1], s.pts[D1]), DA: R.cleDroite(s.pts[D1], s.pts[A1]),
        sommets: g.sommets
      });
      noms[g.nom] = g.nom;
    }

    const enCle = f => [f[0], cle[f[1]] || f[1], cle[f[2]] || f[2]];
    return {
      s, noms, cle, memes, segments, milieux, bouts, passe, ptsDe,
      hyp: (s.hyp || []).map(enCle),
      but: enCle(s.but),
      cercles,
      ctx: {
        segments, quads,
        ligneDe: k => segments.get(k),
        milieuDe: k => milieux[k],
        boutsDe: k => bouts[k],
        // « A@(C) » : le rayon qui va du centre de (C) au point de contact A.
        rayonDe: t => {
          const [pt, nom] = String(t).split('@');
          const c = cercles.find(x => x.nom === nom);
          return (c && pt) ? R.cleDroite(s.pts[c.centre], s.pts[pt]) : null;
        }
      }
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // LES CHAÎNES QUI CALCULENT.
  //
  // « Quelle est la distance de A à (BC) ? », « le cercle et la droite se
  // coupent-ils ? » ne se démontrent pas par enchaînement de règles : on
  // calcule, puis on compare. Le moteur ne sert à rien ici, et vouloir l'y
  // forcer produirait une démonstration tordue. Chacune a donc sa chaîne — mais
  // la même exigence : ce qui est écrit est recalculé.
  // ═══════════════════════════════════════════════════════════════════════

  const REGLE_DISTANCE =
    'بعد نقطة عن مستقيم هو طول القطعة التي تصلها بمسقطها العمودي عليه';

  function chaineDistance(item) {
    const s = item.monter(F);
    const P = s.pts, q = s.question;
    const A = P[q.point], B = P[q.droite[0]], C = P[q.droite[1]];
    if (!A || !B || !C || !F.droiteOk(B, C)) return null;
    const nomD = q.nomDroite;
    const etapes = [];
    const verifs = [];

    if (F.aligne(B, C, A)) {
      // Le cas que les élèves manquent : le point EST sur la droite.
      etapes.push(['النقطة على المستقيم', q.point + ' ∈ ' + nomD]);
      etapes.push(['المسقط العمودي',
                   'مسقط ' + q.point + ' على ' + nomD + ' هو ' + q.point + ' نفسها']);
      etapes.push(['القاعدة',
                   'إذا كانت النقطة تنتمي إلى المستقيم فإنّ بعدها عنه يساوي 0']);
      etapes.push(['النتيجة', 'd(' + q.point + ' ، ' + nomD + ') = 0']);
      verifs.push({ type: 'passe', a: q.droite, b: q.point,
                    texte: q.point + ' ∈ ' + nomD });
      verifs.push({ type: 'dist', a: q.point, b: q.droite, valeur: '0',
                    texte: 'd(' + q.point + ' ، ' + nomD + ') = 0' });
    } else {
      const H = F.projete(A, B, C);
      const d = F.longueur(A, H);
      if (d === null) return null;      // longueur irrationnelle : pas de 7ème
      const nomH = q.projete || 'H';
      // Le projeté porte-t-il déjà un nom dans la scène ? On ne le baptise pas
      // deux fois : deux noms pour un point, et la figure ment.
      let cle = Object.keys(P).find(k => F.memesPoints(P[k], H));
      if (!cle) { P[nomH] = H; cle = nomH; }
      etapes.push(['المسقط العمودي',
                   cle + ' هو المسقط العمودي لـ ' + q.point + ' على ' + nomD]);
      etapes.push(['القاعدة', REGLE_DISTANCE]);
      etapes.push(['نقرأ الطول', q.point + cle + ' = ' + F.qDec(d)]);
      etapes.push(['النتيجة',
                   'd(' + q.point + ' ، ' + nomD + ') = ' + F.qDec(d) + ' صم']);
      verifs.push({ type: 'perp', a: [q.point, cle], b: q.droite,
                    texte: '(' + q.point + cle + ') ⊥ ' + nomD });
      verifs.push({ type: 'passe', a: q.droite, b: cle,
                    texte: cle + ' ∈ ' + nomD });
      verifs.push({ type: 'dist', a: q.point, b: q.droite, valeur: F.qTxt(d),
                    texte: 'd(' + q.point + ' ، ' + nomD + ') = ' + F.qDec(d) });
      if (s.fig && !s.fig.segments) s.fig.segments = [];
      if (s.fig) {
        s.fig.segments = (s.fig.segments || []).concat([[q.point, cle]]);
        s.fig.angles = (s.fig.angles || []).concat([[q.point, cle, q.droite[0]]]);
      }
    }
    return finir(item, s, etapes, verifs,
                 'أنزل العمود من النقطة على المستقيم، ثمّ اقرأ الطول',
                 'أحسب بعد ' + q.point + ' عن ' + nomD + '.');
  }

  // La position d'une droite par rapport à un cercle : on compare le BEDD du
  // centre à la droite avec le rayon. Trois cas, et pas un de plus.
  const VERDICTS_DC = {
    coupe: 'المستقيم يقطع الدائرة في نقطتين',
    tangent: 'المستقيم مماس للدائرة',
    dehors: 'المستقيم لا يقطع الدائرة'
  };
  function chainePositionDroite(item) {
    const s = item.monter(F);
    const P = s.pts, q = s.question;
    const O = P[q.centre], Bo = P[q.bord];
    const B = P[q.droite[0]], C = P[q.droite[1]];
    if (!O || !Bo || !F.droiteOk(B, C)) return null;
    const d = F.distance(O, B, C), r = F.longueur(O, Bo);
    if (d === null || r === null) return null;
    const cmp = F.qEgaux(d, r) ? 'tangent'
              : (F.qNum(d) < F.qNum(r) ? 'coupe' : 'dehors');
    const signe = cmp === 'tangent' ? '=' : (cmp === 'coupe' ? '<' : '>');
    const regle = { tangent: 'إذا كان البعد يساوي الشعاع فالمستقيم مماس للدائرة',
                    coupe: 'إذا كان البعد أصغر من الشعاع فالمستقيم يقطع الدائرة في نقطتين',
                    dehors: 'إذا كان البعد أكبر من الشعاع فالمستقيم لا يقطع الدائرة' }[cmp];
    const etapes = [
      ['نحسب البعد', 'd(' + q.centre + ' ، ' + q.nomDroite + ') = ' + F.qDec(d)],
      ['الشعاع', 'r = ' + F.qDec(r)],
      ['نقارن', F.qDec(d) + ' ' + signe + ' ' + F.qDec(r)],
      ['القاعدة', regle],
      ['النتيجة', q.nomDroite + ' و ' + q.nomCercle + ': ' + VERDICTS_DC[cmp]]
    ];
    const verifs = [
      { type: 'dist', a: q.centre, b: q.droite, valeur: F.qTxt(d),
        texte: 'd(' + q.centre + ' ، ' + q.nomDroite + ') = ' + F.qDec(d) },
      { type: 'lg', a: [q.centre, q.bord], valeur: F.qTxt(r),
        texte: 'r = ' + F.qDec(r) },
      { type: 'pos-dc', a: [q.centre, q.bord], b: q.droite, valeur: cmp,
        texte: VERDICTS_DC[cmp] }
    ];
    return finir(item, s, etapes, verifs,
                 'قارن بعد المركز عن المستقيم بالشعاع',
                 'ما هي الوضعية النسبية لـ ' + q.nomDroite + ' و ' + q.nomCercle + '؟');
  }

  // Deux cercles : on compare la distance des centres à la somme et à la
  // différence des rayons. Cinq cas, et la feuille les demande tous.
  const VERDICTS_CC = {
    exterieur: 'الدائرتان خارج إحداهما عن الأخرى',
    tangentExt: 'الدائرتان متماستان خارجيا',
    secants: 'الدائرتان متقاطعتان في نقطتين',
    tangentInt: 'الدائرتان متماستان داخليا',
    interieur: 'إحدى الدائرتين داخل الأخرى'
  };
  function chainePositionCercles(item) {
    const s = item.monter(F);
    const P = s.pts, q = s.question;
    const dd = F.longueur(P[q.centre1], P[q.centre2]);
    const r1 = F.longueur(P[q.centre1], P[q.bord1]);
    const r2 = F.longueur(P[q.centre2], P[q.bord2]);
    if (dd === null || r1 === null || r2 === null) return null;
    const somme = F.qAdd(r1, r2);
    const diff = F.qNum(r1) >= F.qNum(r2) ? F.qSub(r1, r2) : F.qSub(r2, r1);
    let cmp;
    if (F.qEgaux(dd, somme)) cmp = 'tangentExt';
    else if (F.qEgaux(dd, diff)) cmp = 'tangentInt';
    else if (F.qNum(dd) > F.qNum(somme)) cmp = 'exterieur';
    else if (F.qNum(dd) < F.qNum(diff)) cmp = 'interieur';
    else cmp = 'secants';
    const regle = {
      tangentExt: 'إذا كان البعد بين المركزين يساوي مجموع الشعاعين فالدائرتان متماستان خارجيا',
      tangentInt: 'إذا كان البعد بين المركزين يساوي الفرق بين الشعاعين فالدائرتان متماستان داخليا',
      exterieur: 'إذا كان البعد بين المركزين أكبر من مجموع الشعاعين فكلّ دائرة خارج الأخرى',
      interieur: 'إذا كان البعد بين المركزين أصغر من الفرق بين الشعاعين فإحداهما داخل الأخرى',
      secants: 'إذا كان البعد بين المركزين محصورا بين الفرق و المجموع فالدائرتان متقاطعتان'
    }[cmp];
    const nn = q.centre1 + q.centre2;
    const etapes = [
      ['البعد بين المركزين', nn + ' = ' + F.qDec(dd)],
      ['الشعاعان', 'r = ' + F.qDec(r1) + '  و  r\' = ' + F.qDec(r2)],
      ['المجموع و الفرق',
       'r + r\' = ' + F.qDec(somme) + '  و  |r - r\'| = ' + F.qDec(diff)],
      ['القاعدة', regle],
      ['النتيجة', VERDICTS_CC[cmp]]
    ];
    const verifs = [
      { type: 'lg', a: [q.centre1, q.centre2], valeur: F.qTxt(dd),
        texte: nn + ' = ' + F.qDec(dd) },
      { type: 'lg', a: [q.centre1, q.bord1], valeur: F.qTxt(r1),
        texte: 'r = ' + F.qDec(r1) },
      { type: 'lg', a: [q.centre2, q.bord2], valeur: F.qTxt(r2),
        texte: "r' = " + F.qDec(r2) },
      { type: 'pos-cc', a: [q.centre1, q.bord1], b: [q.centre2, q.bord2],
        valeur: cmp, texte: VERDICTS_CC[cmp] }
    ];
    return finir(item, s, etapes, verifs,
                 'قارن البعد بين المركزين بمجموع الشعاعين و بفرقهما',
                 'ما هي الوضعية النسبية للدائرتين؟');
  }

  // Le pied commun aux chaînes qui calculent : la figure, l'énoncé, le contrôle.
  function finir(item, s, etapes, verifs, indice, question) {
    if (etapes.length < 4) return null;
    verifs = verifs.concat((s.longueurs || []).map(([a1, b1, v]) => ({
      type: 'lg', a: [a1, b1], valeur: String(v), texte: a1 + b1 + ' = ' + v
    })), (s.alignements || []).map(([a1, b1, p1]) => ({
      type: 'passe', a: [a1, b1], b: p1, texte: p1 + ' ∈ (' + a1 + b1 + ')'
    })));
    const enonce = (s.donnees || []).slice();
    if (s.fig) {
      const dess = Object.assign({ points: s.pts }, s.fig);
      dess.droites = (s.fig.droites || []).map(d => {
        const k = R.cleDroite(s.pts[d[0]], s.pts[d[1]]);
        const l = (s.lignes || []).find(x =>
          R.cleDroite(s.pts[x.A], s.pts[x.B]) === k);
        return [d[0], d[1], d[2], l ? l.nom : ''];
      });
      enonce.push({ svg: F.dessiner(dess) });
    }
    enonce.push(question);
    return { enonce, etapes, indice, source: item.src,
             controle: { type: 'geometrie', pts: s.pts, cercles: s.cercles || [],
                         verifs, regles: [] } };
  }

  // ── La chaîne ────────────────────────────────────────────────────────────
  const CALCULS = {
    'distance': chaineDistance,
    'position-droite-cercle': chainePositionDroite,
    'position-deux-cercles': chainePositionCercles
  };

  function chaine(item) {
    if (CALCULS[item.f]) {
      try { return CALCULS[item.f](item); } catch (e) { return null; }
    }
    return chaineRegles(item);
  }

  function chaineRegles(item) {
    let S;
    try { S = scene(item); } catch (e) { return null; }
    // CE QU'IL FAUT DÉMONTRER NE SE LIT PAS SUR LA FIGURE. Les appartenances
    // sont relevées sur les coordonnées — c'est légitime, cela se voit — mais
    // si le but EST une appartenance, la relever reviendrait à le poser comme
    // acquis, et la démonstration disparaîtrait au lieu de s'écrire.
    const cleBut0 = R.cleFait(S.but);
    const lues = S.passe.filter(f => R.cleFait(f) !== cleBut0);
    const suite = R.chercher(S.hyp.concat(lues), S.but, S.ctx);
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
    // POURQUOI CETTE RÈGLE, ET NON UNE AUTRE.
    const faireIt = It ? It.creer({
      R, ecrire: f => ecrire(f, S.noms), court, sec: f => f,
      nommerBut: b => (NOMBUT[b[0]] ? NOMBUT[b[0]](b, S.noms) : 'المطلوب'),
      MANQUE, CANDIDATES
    }) : null;
    const choix = faireIt
      ? faireIt(suite, S.but, S.hyp.concat(lues), S.ctx, 0) : null;
    if (choix) etapes.push(['الاختيار', choix.texte]);
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
      if (f[0] === 'nature') {
        const q = S.ctx.quads.get(f[1]);
        return { type: 'nature', a: q ? q.sommets : [], b: f[2],
                 texte: ecrire(f, S.noms) };
      }
      return { type: f[0], a: g(f[1]), b: g(f[2]), texte: ecrire(f, S.noms) };
    };
    const affirme = S.hyp.concat(suite.map(n => n.fait)).concat([S.but]);
    // LES LONGUEURS ANNONCÉES DANS LE TEXTE SONT DES AFFIRMATIONS. « AB = 6 »
    // est aussi vérifiable que « (D) // (D') », et l'oublier a déjà coûté :
    // une figure où AB valait le double du texte est passée inaperçue, parce
    // que rien ne reliait l'énoncé au dessin.
    const lgs = (S.s.longueurs || []).map(([a1, b1, v]) => ({
      type: 'lg', a: [a1, b1], valeur: String(v), texte: a1 + b1 + ' = ' + v
    })).concat(
    // « I est le point d'intersection avec (UT) » est une affirmation de plus,
    // et elle se vérifie. Posé ailleurs, le point laissait la démonstration
    // vraie sur une figure fausse — et personne ne s'en apercevait.
      (S.s.alignements || []).map(([a1, b1, p1]) => ({
        type: 'passe', a: [a1, b1], b: p1,
        texte: p1 + ' ∈ (' + a1 + b1 + ')'
      })));
    return {
      enonce, etapes,
      indice: S.s.indice || 'ابدأ من المعطيات، و طبّق قاعدة واحدة في كلّ مرحلة',
      source: item.src,
      controle: { type: 'geometrie', pts: S.s.pts,
                  cercles: S.s.cercles || [],
                  verifs: affirme.map(enPoints).concat(lgs),
                  // La raison d'écarter est une affirmation : le validateur
                  // la refait sur les faits réellement acquis.
                  itineraire: choix ? choix.controle : null,
                  hypBrutes: S.hyp.concat(lues).map(f => f.slice()),
                  regles: suite.map(n => n.regle.cle) }
    };
  }

  const API = { chaine, chaineRegles, scene, ecrire, dit, VERDICTS_DC, VERDICTS_CC };
  if (M) module.exports = API; else racine.Chaines = API;
})(typeof window !== 'undefined' ? window : globalThis);
