// Les sous-questions que la fiche pose, encore et encore, sur une forme.
//
// Chaque fonction rend une chaîne complète (énoncé, étapes, contrôle). Les
// exercices s'assemblent ensuite en piochant ici : c'est ce qui permet de
// porter dix exercices sans réécrire dix fois la même démonstration.
//
// RÈGLE DE MÉTHODE, non négociable : dès qu'une comparaison porte sur des
// expressions contenant un inconnu, elle se règle par LE SIGNE DE LA
// DIFFÉRENCE. Les propriétés de l'ordre sont au programme de 9e année ; on ne
// les emploie nulle part ici.
(function (racine) {
  'use strict';
  const F = (typeof module !== 'undefined' && module.exports) ? require('./noyau.js') : racine.Somme;
  const S = (typeof module !== 'undefined' && module.exports) ? require('./formes.js') : racine.Formes;
  const { rat, add, sub, neg, signe, txt, par, plus } = F;

  const forme = sh => S.ecrireForme(sh.cible, sh.u, sh.v);
  // La seconde variable ne compte que si elle survit à la réduction : dans
  // « A = x + 1/2 » le y de l'expression de départ s'est éliminé.
  const deux = sh => !!(sh.v && sh.cible.cb !== 0);
  const defs = (...shs) => { const d = {}; shs.forEach(s => { d[s.nom] = s.txt; }); return d; };
  const libres = (...shs) => {
    const v = new Set();
    shs.forEach(s => { if (s.u) v.add(s.u); if (s.v) v.add(s.v); });
    shs.forEach(s => (s.txt.match(/[a-z]/g) || []).forEach(c => v.add(c)));
    return Array.from(v);
  };

  // -------------------------------------------------------------------------
  // « بيّن أنّ E = … » — la levée des parenthèses, puis le regroupement
  // -------------------------------------------------------------------------
  function montrer(sh, autres) {
    const f = forme(sh);
    return {
      enonce: ['بيّن أنّ:', sh.nom + ' = ' + f, 'حيث', sh.nom + ' = ' + sh.txt],
      indice: 'ارفع الأقواس واحدا واحدا، من الداخل نحو الخارج، ثمّ اجمع الحدود المتشابهة',
      etapes: sh.levees.concat([
        ['نكتب العبارة بدون أقواس', sh.nom + ' = ' + sh.plat],
        ['نجمّع الحدود المتشابهة', sh.nom + ' = ' + sh.regroupe],
        ['نحسب الثابت', sh.constantes + ' = ' + txt(sh.cible.k)],
        ['الشكل المختصر', sh.nom + ' = ' + f]
      ]),
      controle: { type: 'forme', defs: defs.apply(null, [sh].concat(autres || [])),
                  libres: libres(sh), verifierForme: { nom: sh.nom, cible: sh.cible,
                  u: sh.u, v: sh.v } }
    };
  }

  // -------------------------------------------------------------------------
  // « احسب E إذا علمت أنّ u + v = s » (ou u − v = s) — il faut FAIRE APPARAÎTRE
  // la combinaison donnée, pas chercher u et v séparément.
  // -------------------------------------------------------------------------
  // `donne` (optionnel) : la combinaison telle que l'énoncé la fournit, quand
  // elle est l'opposée de celle dont la forme a besoin — l'exercice 8 donne
  // x − y alors que A porte y − x. Le retournement devient alors une étape.
  function parRelation(sh, s, autres, donne) {
    const somme = sh.cible.ca === sh.cible.cb;
    const combi = sh.u + (somme ? ' + ' : ' - ') + sh.v;
    const retourne = !!donne && donne !== combi;
    const sUtile = retourne ? neg(s) : s;
    const val = add(sUtile, sh.cible.k);
    const etapes = [['ننطلق من الشكل المختصر', sh.nom + ' = ' + forme(sh)]];
    if (retourne) etapes.push(['نقلب الفرق المعطى', combi + ' = ' + txt(sUtile)]);
    etapes.push(
      ['نُظهر المعطى', sh.nom + ' = (' + combi + ')' + plus(sh.cible.k)],
      ['نعوّض', sh.nom + ' = ' + par(sUtile) + plus(sh.cible.k)],
      ['النتيجة', sh.nom + ' = ' + txt(val)]
    );
    return {
      enonce: ['احسب', sh.nom, 'علما و أنّ', (donne || combi) + ' = ' + txt(s),
               'و', sh.nom + ' = ' + forme(sh)],
      indice: 'لا تبحث عن ' + sh.u + ' و لا عن ' + sh.v + ' : أظهر ' + combi,
      etapes,
      controle: { type: 'forme', defs: defs.apply(null, [sh].concat(autres || [])),
                  libres: [sh.u], lie: { nom: sh.v, via: somme ? 'somme' : 'difference',
                  autre: sh.u, valeur: sUtile }, claims: [{ nom: sh.nom, vaut: val }] }
    };
  }

  // « قارن A و B » quand les deux valent des nombres connus : on compare
  // toujours par le signe de la différence, jamais « à vue ».
  function comparerNombres(nomA, vA, nomB, vB) {
    const d = sub(vA, vB);
    const petit = signe(d) < 0;
    return {
      enonce: ['قارن', nomA + ' و ' + nomB, 'علما و أنّ', nomA + ' = ' + txt(vA)
               + ' و ' + nomB + ' = ' + txt(vB)],
      indice: 'المقارنة تمرّ بإشارة الفرق',
      etapes: [
        ['نحسب الفرق', nomA + ' - ' + nomB + ' = ' + par(vA) + ' - ' + par(vB)],
        ['نحسب', nomA + ' - ' + nomB + ' = ' + txt(d)],
        ['نحدّد إشارة الفرق', txt(d) + (petit ? ' < 0' : ' > 0')],
        ['القاعدة', petit ? 'الفرق سالب، إذن ' + nomA + ' أصغر من ' + nomB
                          : 'الفرق موجب، إذن ' + nomA + ' أكبر من ' + nomB],
        ['النتيجة', nomA + (petit ? ' < ' : ' > ') + nomB]
      ],
      controle: { type: 'nombres', vA, vB, d, petit, nomA, nomB }
    };
  }

  // « احسب A إذا كان |x − q| = r » — la valeur absolue ouvre DEUX cas, et
  // l'exercice n'est fini que lorsque les deux sont traités.
  function parValeurAbsolue(sh, q, r) {
    const x1 = add(q, r), x2 = sub(q, r);
    const v1 = S.valeurForme(sh.cible, x1, null), v2 = S.valeurForme(sh.cible, x2, null);
    return {
      enonce: ['احسب', sh.nom, 'إذا كان', '|x - ' + txt(q) + '| = ' + txt(r),
               'حيث', sh.nom + ' = ' + forme(sh)],
      indice: 'القيمة المطلقة تفتح حالتين: لا تنسَ الثانية',
      etapes: [
        ['القاعدة', 'إذا كان |x - ' + txt(q) + '| = ' + txt(r) + ' فإنّ x - ' + txt(q)
         + ' = ' + txt(r) + '  أو  x - ' + txt(q) + ' = ' + txt(neg(r))],
        ['الحالة الأولى', txt(q) + ' + ' + txt(r) + ' = ' + txt(x1)],
        ['الحالة الثانية', txt(q) + ' - ' + txt(r) + ' = ' + txt(x2)],
        ['نعوّض في الحالة الأولى', txt(x1) + plus(sh.cible.k) + ' = ' + txt(v1)],
        ['نعوّض في الحالة الثانية', txt(x2) + plus(sh.cible.k) + ' = ' + txt(v2)],
        ['النتيجة', sh.nom + ' = ' + txt(v1) + '  أو  ' + sh.nom + ' = ' + txt(v2)]
      ],
      controle: { type: 'deux-cas', defs: defs(sh), sh, x1, x2, v1, v2 }
    };
  }

  // -------------------------------------------------------------------------
  // « احسب E في حالة u = … و v = … » — la substitution pure
  // -------------------------------------------------------------------------
  // La seconde variable peut exister dans l'expression de départ sans survivre
  // à la réduction (exercice 4 : y disparaît). On ne la donne alors pas.
  function parValeurs(sh, vu, vv, autres) {
    const avecV = !!(sh.v && vv && sh.cible.cb !== 0);
    const val = S.valeurForme(sh.cible, vu, avecV ? vv : null);
    const donnees = avecV ? sh.u + ' = ' + txt(vu) + ' و ' + sh.v + ' = ' + txt(vv)
                          : sh.u + ' = ' + txt(vu);
    const subst = S.joindre([
      sh.cible.ca === 0 ? null : (sh.cible.ca > 0 ? par(vu) : '-' + par(vu)),
      !avecV ? null : (sh.cible.cb > 0 ? par(vv) : '-' + par(vv)),
      sh.cible.k.n === 0 ? null : txt(sh.cible.k)
    ]);
    return {
      enonce: ['احسب', sh.nom, 'في حالة', donnees, 'حيث', sh.nom + ' = ' + sh.txt],
      indice: 'ابدأ بالشكل المختصر: التعويض فيه أقصر بكثير',
      etapes: [
        ['نستعمل الشكل المختصر', sh.nom + ' = ' + forme(sh)],
        ['نكتب المعطى', donnees],
        ['نعوّض', sh.nom + ' = ' + subst],
        ['النتيجة', sh.nom + ' = ' + txt(val)]
      ],
      controle: { type: 'forme', defs: defs.apply(null, [sh].concat(autres || [])),
                  fixes: avecV ? { [sh.u]: vu, [sh.v]: vv } : { [sh.u]: vu },
                  libres: libres(sh).filter(x => x !== sh.u && (!avecV || x !== sh.v)),
                  claims: [{ nom: sh.nom, vaut: val }] }
    };
  }

  // -------------------------------------------------------------------------
  // « أوجد u + v إذا علمت أنّ E = … » — le chemin inverse
  // -------------------------------------------------------------------------
  function trouverCombinaison(sh, val, autres) {
    const somme = sh.cible.ca === sh.cible.cb;
    // Une forme sans seconde variable — « A = x + k » — demande simplement x.
    const combi = deux(sh) ? sh.u + (somme ? ' + ' : ' - ') + sh.v : sh.u;
    const res = sub(val, sh.cible.k);            // ca = 1 dans tous les usages
    return {
      enonce: ['أوجد', combi, 'علما و أنّ', sh.nom + ' = ' + txt(val), 'و', sh.nom + ' = ' + forme(sh)],
      indice: 'اكتب الشكل المختصر يساوي القيمة المعطاة، ثمّ اعزل ' + combi,
      etapes: [
        ['ننطلق من الشكل المختصر', sh.nom + ' = ' + forme(sh)],
        ['نستعمل المعطى', '(' + combi + ')' + plus(sh.cible.k) + ' = ' + txt(val)],
        ['نعزل المطلوب', combi + ' = ' + par(val) + ' - ' + par(sh.cible.k)],
        ['النتيجة', combi + ' = ' + txt(res)]
      ],
      controle: { type: 'combinaison', defs: defs.apply(null, [sh].concat(autres || [])),
                  sh, val, res, combi, somme,
                  libres: deux(sh) ? [sh.u] : [],
                  fixes: deux(sh) ? null : { [sh.u]: res },
                  lie: deux(sh) ? { nom: sh.v, via: somme ? 'somme' : 'difference',
                                    autre: sh.u, valeur: res } : null }
    };
  }

  // -------------------------------------------------------------------------
  // « قارن u و v إذا كان E = 0 » — PAR LE SIGNE DE LA DIFFÉRENCE, jamais par
  // les propriétés de l'ordre (programme de 9e).
  // -------------------------------------------------------------------------
  function comparerVariables(sh, autres) {
    const d = neg(sh.cible.k);                   // u - v = -k
    const petit = signe(d) < 0;
    return {
      enonce: ['قارن', sh.u + ' و ' + sh.v, 'إذا كان', sh.nom + ' = 0', 'حيث',
               sh.nom + ' = ' + forme(sh)],
      indice: 'المقارنة بين مجهولين تمرّ دائما بإشارة الفرق',
      etapes: [
        ['ننطلق من الشكل المختصر', sh.nom + ' = ' + forme(sh)],
        ['نستعمل المعطى', sh.u + ' - ' + sh.v + plus(sh.cible.k) + ' = 0'],
        ['نحسب الفرق', sh.u + ' - ' + sh.v + ' = ' + txt(d)],
        ['نحدّد إشارة الفرق', txt(d) + (petit ? ' < 0' : ' > 0')],
        ['القاعدة', petit ? 'الفرق سالب، إذن ' + sh.u + ' أصغر من ' + sh.v
                          : 'الفرق موجب، إذن ' + sh.u + ' أكبر من ' + sh.v],
        ['النتيجة', sh.u + (petit ? ' < ' : ' > ') + sh.v]
      ],
      controle: { type: 'comparaison-var', sh, d, petit,
                  defs: defs.apply(null, [sh].concat(autres || [])),
                  libres: [sh.u],
                  lie: { nom: sh.v, via: 'difference', autre: sh.u, valeur: d } }
    };
  }

  // -------------------------------------------------------------------------
  // « قارن E و F » quand les deux formes ont les mêmes coefficients : la
  // différence est une constante, les inconnues disparaissent.
  // -------------------------------------------------------------------------
  function comparerFormes(shE, shF) {
    const d = sub(shE.cible.k, shF.cible.k);
    const petit = signe(d) < 0;
    return {
      enonce: ['قارن', shE.nom + ' و ' + shF.nom, 'حيث', shE.nom + ' = ' + forme(shE),
               'و', shF.nom + ' = ' + forme(shF)],
      indice: 'احسب الفرق: الحدود التي تحمل المجهولين متطابقة، إذن تختفي',
      etapes: [
        ['نحسب الفرق', shE.nom + ' - ' + shF.nom + ' = (' + forme(shE) + ') - (' + forme(shF) + ')'],
        ['تختفي الحدود المتشابهة', shE.nom + ' - ' + shF.nom + ' = ' + txt(shE.cible.k)
         + ' - ' + par(shF.cible.k)],
        ['نحسب الفرق العددي', shE.nom + ' - ' + shF.nom + ' = ' + txt(d)],
        ['نحدّد إشارة الفرق', txt(d) + (petit ? ' < 0' : ' > 0')],
        ['القاعدة', petit ? 'الفرق سالب، إذن ' + shE.nom + ' أصغر من ' + shF.nom
                          : 'الفرق موجب، إذن ' + shE.nom + ' أكبر من ' + shF.nom],
        ['النتيجة', shE.nom + (petit ? ' < ' : ' > ') + shF.nom]
      ],
      controle: { type: 'comparaison-formes', shE, shF, d, petit, defs: defs(shE, shF),
                  libres: libres(shE, shF) }
    };
  }

  // -------------------------------------------------------------------------
  // Équations du premier degré : A − (x + B) = C, A + [(−p) − x] = C,
  // A − (−B − z) = C … toutes se ramènent à « constante − x = C ».
  // -------------------------------------------------------------------------
  function equation(eq, gauchePlat, K, C, sol, indice) {
    return {
      enonce: ['جد العدد الكسري النسبي x بحيث:', eq],
      indice: indice || 'ابدأ برفع القوس، و انتبه إلى العلامة التي تسبقه',
      etapes: [
        ['نرفع القوس', gauchePlat + ' = ' + txt(C)],
        ['نحسب الثابت', gauchePlat.replace(/\s*[+-]\s*x/, '') + ' = ' + txt(K)],
        ['نكتب المعادلة', txt(K) + ' - x = ' + txt(C)],
        ['المجهول هو الفرق', 'x = ' + par(K) + ' - ' + par(C)],
        ['النتيجة', 'x = ' + txt(sol)]
      ],
      controle: { type: 'equation', eq, sol }
    };
  }

  // -------------------------------------------------------------------------
  // Équation à valeur absolue : la conclusion suit le SIGNE du second membre.
  // -------------------------------------------------------------------------
  function equationAbsolue(eq, isole, m, indice) {
    const possible = signe(m) > 0;
    return {
      enonce: ['جد العدد الكسري النسبي x بحيث:', eq],
      indice: indice || 'اعزل |x| أولا، ثمّ انظر إلى إشارة ما تحصّلت عليه',
      etapes: [
        ['نعزل القيمة المطلقة', '|x| = ' + isole],
        ['نحسب العضو الثاني', isole + ' = ' + txt(m)],
        ['نقارن بالصفر', txt(m) + (possible ? ' > 0' : ' < 0')],
        ['القاعدة', possible ? 'القيمة المطلقة موجبة، إذن للمعادلة حلاّن متقابلان'
                             : 'القيمة المطلقة لعدد لا يمكن أن تكون سالبة'],
        ['النتيجة', possible ? 'x = ' + txt(m) + '  أو  x = ' + txt(neg(m))
                             : 'لا يوجد عدد كسري نسبي x يحقّق المعادلة']
      ],
      controle: { type: 'abs', eq, m, possible }
    };
  }


  // -------------------------------------------------------------------------
  // « قارن x + c₁ و x + c₂ » — le même inconnu des deux côtés : il s'élimine
  // dans la différence. C'est le cas le plus pur du signe de la différence.
  // -------------------------------------------------------------------------
  function comparerMemeInconnue(u, c1, c2) {
    const g = u + plus(c1), d = u + plus(c2);
    const dif = sub(c1, c2);
    const petit = signe(dif) < 0;
    return {
      enonce: ['ليكن', u, 'عددا كسريا نسبيا؛ قارن بين', g + '  و  ' + d],
      indice: 'احسب الفرق: المجهول يختفي من تلقاء نفسه',
      etapes: [
        ['نحسب الفرق', '(' + g + ') - (' + d + ') = ' + par(c1) + ' - ' + par(c2)],
        ['يختفي المجهول', par(c1) + ' - ' + par(c2) + ' = ' + txt(dif)],
        ['نحدّد إشارة الفرق', txt(dif) + (petit ? ' < 0' : ' > 0')],
        ['القاعدة', petit ? 'الفرق سالب، إذن العبارة الأولى أصغر'
                          : 'الفرق موجب، إذن العبارة الأولى أكبر'],
        ['النتيجة', g + (petit ? ' < ' : ' > ') + d]
      ],
      controle: { type: 'signe', libres: [u], defs: {},
                  relation: { g, d, sens: petit ? -1 : 1 } }
    };
  }

  // -------------------------------------------------------------------------
  // « a < b ; comparer … et … » — la différence vaut (combinaison) + constante,
  // les deux de MÊME SIGNE. La somme de deux nombres de même signe a ce signe :
  // c'est tout ce qu'on s'autorise, et c'est suffisant.
  // -------------------------------------------------------------------------
  function comparerParSigne(o) {
    const petit = o.sens < 0;
    const diff = '(' + o.combi + ')' + plus(o.cste);
    return {
      enonce: ['ليكن', o.vars, 'أعدادا كسرية نسبية حيث', o.hypothese,
               '؛ قارن بين', o.g + '  و  ' + o.d],
      indice: 'احسب الفرق، ثمّ استعمل الفرضية لتحديد إشارته',
      etapes: [
        ['نحسب الفرق', '(' + o.g + ') - (' + o.d + ') = ' + diff],
        ['نترجم الفرضية', o.combi + (petit ? ' < 0' : ' > 0')],
        ['إشارة الثابت', txt(o.cste) + (petit ? ' < 0' : ' > 0')],
        ['القاعدة', petit ? 'مجموع عددين سالبين هو عدد سالب'
                          : 'مجموع عددين موجبين هو عدد موجب'],
        ['إشارة الفرق', diff + (petit ? ' < 0' : ' > 0')],
        ['النتيجة', o.g + (petit ? ' < ' : ' > ') + o.d]
      ],
      controle: { type: 'signe', libres: o.libres, defs: {},
                  contrainte: { expr: o.combi, sens: o.sens },
                  relation: { g: o.g, d: o.d, sens: o.sens } }
    };
  }

  // -------------------------------------------------------------------------
  // Même chose, mais la combinaison est CONNUE : la différence se calcule
  // vraiment, et son signe se lit sur le nombre obtenu.
  // -------------------------------------------------------------------------
  function comparerParDifferenceCalculee(o) {
    const D = add(o.valeur, o.cste);
    const petit = signe(D) < 0;
    const diff = '(' + o.combi + ')' + plus(o.cste);
    return {
      enonce: ['ليكن', o.vars, 'أعدادا كسرية نسبية حيث', o.combi + ' = ' + txt(o.valeur),
               '؛ قارن بين', o.g + '  و  ' + o.d],
      indice: 'الفرق يُحسب تماما هنا: عوّض بالمعطى',
      etapes: [
        ['نحسب الفرق', '(' + o.g + ') - (' + o.d + ') = ' + diff],
        ['نعوّض بالمعطى', diff + ' = ' + par(o.valeur) + plus(o.cste)],
        ['نحسب', par(o.valeur) + plus(o.cste) + ' = ' + txt(D)],
        ['نحدّد إشارة الفرق', txt(D) + (petit ? ' < 0' : ' > 0')],
        ['القاعدة', petit ? 'الفرق سالب، إذن العبارة الأولى أصغر'
                          : 'الفرق موجب، إذن العبارة الأولى أكبر'],
        ['النتيجة', o.g + (petit ? ' < ' : ' > ') + o.d]
      ],
      controle: { type: 'signe', libres: o.libres, defs: {}, lie: o.lie,
                  relation: { g: o.g, d: o.d, sens: petit ? -1 : 1 } }
    };
  }

  // -------------------------------------------------------------------------
  // « حدّد |E| إذا كان x ≥ y » — on ne calcule pas E, on établit son SIGNE,
  // et la valeur absolue en découle.
  // -------------------------------------------------------------------------
  function valeurAbsolue(sh, autres) {
    // sh.cible : ca = 1 sur u, cb = -1 sur v, k < 0. L'hypothèse v ≥ u rend
    // u - v négatif ou nul, donc E strictement négatif.
    const oppose = S.ecrireForme({ ca: -sh.cible.ca, cb: -sh.cible.cb, k: neg(sh.cible.k) },
                                 sh.u, sh.v);
    return {
      enonce: ['حدّد', '|' + sh.nom + '|', 'إذا كان', sh.v + ' ≥ ' + sh.u, 'حيث',
               sh.nom + ' = ' + forme(sh)],
      indice: 'لا تحسب ' + sh.nom + ' : يكفي أن تعرف إشارته',
      etapes: [
        ['نترجم الفرضية', sh.u + ' - ' + sh.v + ' ≤ 0'],
        ['إشارة الثابت', txt(sh.cible.k) + ' < 0'],
        ['القاعدة', 'مجموع عدد سالب أو منعدم و عدد سالب هو عدد سالب'],
        ['إشارة العبارة', sh.nom + ' < 0'],
        ['قاعدة القيمة المطلقة', 'إذا كان ' + sh.nom + ' < 0 فإنّ |' + sh.nom + '| = -' + sh.nom],
        ['النتيجة', '|' + sh.nom + '| = ' + oppose]
      ],
      controle: { type: 'signe', defs: defs.apply(null, [sh].concat(autres || [])),
                  libres: [sh.u, sh.v],
                  contrainte: { expr: sh.u + ' - ' + sh.v, sens: -1, large: true },
                  relation: { g: sh.nom, d: '0', sens: -1 } }
    };
  }

  // -------------------------------------------------------------------------
  // « احسب بأيسر طريقة » — on ne calcule pas de gauche à droite : on repère
  // les deux termes opposés, on les supprime, et il ne reste presque rien.
  // -------------------------------------------------------------------------
  function calculAstucieux(nom, expr, plat, opposes, reste, val) {
    return {
      enonce: ['احسب بأيسر طريقة:', nom + ' = ' + expr],
      indice: 'ابحث عن حدّين متقابلين قبل أن تحسب أيّ شيء',
      etapes: [
        ['نرفع الأقواس', nom + ' = ' + plat],
        ['نلاحظ حدّين متقابلين', opposes[0] + ' و ' + opposes[1] + ' متقابلان'],
        ['نحذفهما', nom + ' = ' + reste],
        ['نحسب ما تبقّى', reste + ' = ' + txt(val)],
        ['النتيجة', nom + ' = ' + txt(val)]
      ],
      controle: { type: 'signe', defs: { [nom]: expr }, libres: [],
                  claims: [{ nom, vaut: val }] }
    };
  }

  const API = { forme, montrer, parRelation, parValeurs, trouverCombinaison,
                comparerVariables, comparerFormes, comparerNombres,
                parValeurAbsolue, equation, equationAbsolue,
                comparerMemeInconnue, comparerParSigne,
                comparerParDifferenceCalculee, valeurAbsolue, calculAstucieux };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Questions = API;
})(typeof window !== 'undefined' ? window : globalThis);
