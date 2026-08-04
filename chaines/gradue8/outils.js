// Les gestes de la leçon « بعد نقطتين من مستقيم مدرج ».
//
// Tout part d'une seule formule :  AB = |x_B − x_A|.  Le reste — le
// symétrique, le milieu, les deux solutions quand seule la distance est
// connue — en découle. Chaque fonction rend une chaîne complète.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Gradue;
  const D = M ? require('./droite.js') : racine.Droite;
  const { rat, add, sub, neg, abs, signe, cmp, txt, par, plus } = F;

  const dist = (a, b) => abs(sub(b, a));
  const pt = (nom, x) => ({ nom, x, sous: txt(x) });

  // -------------------------------------------------------------------------
  // AB = |x_B − x_A| — la chaîne de base, celle que tout le reste réutilise
  // -------------------------------------------------------------------------
  function bed(nA, xa, nB, xb, figure, prefixe) {
    const d = sub(xb, xa), r = abs(d);
    return {
      enonce: (prefixe || []).concat([
        'احسب البعد', nA + nB, 'علما و أنّ',
        'x' + nA + ' = ' + txt(xa) + '  و  x' + nB + ' = ' + txt(xb)
      ]),
      figure,
      indice: 'البعد هو القيمة المطلقة للفرق بين الفاصلتين، و ليس الفرق نفسه',
      etapes: [
        ['القاعدة', 'البعد بين نقطتين هو القيمة المطلقة للفرق بين فاصلتيهما'],
        ['نكتب الفرق', nA + nB + ' = |' + txt(xb) + ' - ' + par(xa) + '|'],
        ['نحسب الفرق', txt(xb) + ' - ' + par(xa) + ' = ' + txt(d)],
        ['نأخذ القيمة المطلقة', '|' + txt(d) + '| = ' + txt(r)],
        ['النتيجة', nA + nB + ' = ' + txt(r)]
      ],
      controle: { type: 'bed', xa, xb, res: r,
                  env: { [nA + nB]: r, ['x' + nA]: xa, ['x' + nB]: xb } }
    };
  }

  // -------------------------------------------------------------------------
  // Le symétrique par rapport à O : même distance, côté opposé
  // -------------------------------------------------------------------------
  function symetrique(nB, xb, nC, figure) {
    const xc = neg(xb);
    return {
      enonce: ['ما هي فاصلة النقطة', nC, 'مناظرة', nB, 'بالنسبة إلى O، علما و أنّ',
               'x' + nB + ' = ' + txt(xb) + ' ؟'],
      figure,
      indice: 'المناظرة بالنسبة إلى O على نفس البعد من O، لكن في الجهة الأخرى',
      etapes: [
        ['القاعدة', 'إذا كانت ' + nC + ' مناظرة ' + nB + ' بالنسبة إلى O فإنّ O منتصف القطعة'],
        ['نترجم', 'O' + nB + ' = O' + nC],
        ['الفاصلتان متقابلتان', 'x' + nC + ' = -x' + nB],
        ['نعوّض', 'x' + nC + ' = -' + par(xb)],
        ['النتيجة', 'x' + nC + ' = ' + txt(xc)]
      ],
      controle: { type: 'symetrique', xb, xc,
                  env: { ['x' + nB]: xb, ['x' + nC]: xc,
                         ['O' + nB]: abs(xb), ['O' + nC]: abs(xc) } }
    };
  }

  // -------------------------------------------------------------------------
  // « AM = d et x_M est négative » — la distance seule donne DEUX points ;
  // c'est la condition de signe qui tranche. Oublier le second, c'est
  // l'erreur que l'exercice guette.
  // -------------------------------------------------------------------------
  function pointADistance(nA, xa, nM, d, veutNegatif, figure) {
    const g = sub(xa, d), dr = add(xa, d);
    // Pour que « x négative » désigne UNE seule des deux solutions, il faut
    // qu'elles encadrent zéro — c'est-à-dire d > |x_A|. Sinon les deux sont
    // du même côté : ou bien la question n'a pas de réponse, ou bien elle en
    // a deux, et dans les deux cas l'énoncé est faux.
    if (signe(g) >= 0 || signe(dr) <= 0) throw new Error('condition de signe non discriminante');
    const bon = veutNegatif ? g : dr;
    const autre = veutNegatif ? dr : g;
    return {
      enonce: ['حدّد فاصلة النقطة', nM, 'من', 'Δ', 'حيث', nA + nM + ' = ' + txt(d),
               'و', 'x' + nM, veutNegatif ? 'سالبة' : 'موجبة'],
      figure,
      indice: 'البعد وحده يعطي نقطتين: الشرط على الإشارة هو الذي يفصل',
      etapes: [
        ['القاعدة', 'البعد وحده يعطي حلّين: نقطة عن يمين ' + nA + ' و أخرى عن يسارها'],
        ['الحلّ الأول', 'x' + nA + ' + ' + txt(d) + ' = ' + txt(xa) + ' + ' + txt(d) + ' = ' + txt(dr)],
        ['الحلّ الثاني', 'x' + nA + ' - ' + txt(d) + ' = ' + txt(xa) + ' - ' + txt(d) + ' = ' + txt(g)],
        ['نستعمل شرط الإشارة', txt(bon) + (veutNegatif ? ' < 0' : ' > 0')],
        ['نستبعد الآخر', txt(autre) + (veutNegatif ? ' > 0' : ' < 0')],
        ['النتيجة', 'x' + nM + ' = ' + txt(bon)]
      ],
      controle: { type: 'distance-signe', xa, d, bon, autre, veutNegatif,
                  env: { ['x' + nA]: xa, ['x' + nM]: bon } }
    };
  }

  // -------------------------------------------------------------------------
  // « OP = 23 : que peut valoir x_P ? » — ici RIEN ne tranche : il y a deux
  // réponses, et les donner toutes les deux fait partie de la réponse.
  // -------------------------------------------------------------------------
  function deuxSolutions(nP, d, figure) {
    return {
      enonce: ['ماذا يمكن أن تكون فاصلة النقطة', nP, '، علما و أنّ', 'O' + nP + ' = ' + txt(d), '؟'],
      figure,
      indice: 'لا شيء يحدّد الجهة: فكّر في الحالتين',
      etapes: [
        ['نكتب البعد', 'O' + nP + ' = |x' + nP + ' - 0| = |x' + nP + '|'],
        ['نستعمل المعطى', '|x' + nP + '| = ' + txt(d)],
        ['القاعدة', 'إذا كان |x| = k و k > 0 فإنّ x = k أو x = -k'],
        ['الحالتان', 'x' + nP + ' = ' + txt(d) + '  أو  x' + nP + ' = ' + txt(neg(d))],
        ['النتيجة', 'للمسألة حلاّن متقابلان']
      ],
      controle: { type: 'deux-solutions', d,
                  env: { ['x' + nP]: d, ['O' + nP]: d } }
    };
  }

  // -------------------------------------------------------------------------
  // « B est le milieu de [AC] » — on ne l'affirme pas, on le démontre :
  // deux distances égales, et B entre les deux.
  // -------------------------------------------------------------------------
  function milieu(nA, xa, nB, xb, nC, xc, figure) {
    const ba = abs(sub(xa, xb)), bc = abs(sub(xc, xb));
    const entre = (cmp(xa, xb) < 0 && cmp(xb, xc) < 0) || (cmp(xc, xb) < 0 && cmp(xb, xa) < 0);
    return {
      enonce: ['بيّن أنّ', nB, 'منتصف القطعة', '[' + nA + nC + ']', 'حيث',
               'x' + nA + ' = ' + txt(xa) + ' ، x' + nB + ' = ' + txt(xb)
               + ' ، x' + nC + ' = ' + txt(xc)],
      figure,
      indice: 'منتصف يعني بعدين متساويين، مع كون النقطة بين الأخريين',
      etapes: [
        ['نحسب البعد الأول', nB + nA + ' = |' + txt(xa) + ' - ' + par(xb) + '| = ' + txt(ba)],
        ['نحسب البعد الثاني', nB + nC + ' = |' + txt(xc) + ' - ' + par(xb) + '| = ' + txt(bc)],
        ['نقارن البعدين', txt(ba) + ' = ' + txt(bc)],
        ['نتحقّق من الترتيب', txt(Math.min(xa.n / xa.d, xc.n / xc.d) === xa.n / xa.d ? xa : xc)
         + ' < ' + txt(xb) + ' < ' + txt(cmp(xa, xc) < 0 ? xc : xa)],
        ['القاعدة', 'نقطة على نفس البعد من طرفي قطعة و واقعة بينهما هي منتصفها'],
        ['النتيجة', nB + ' منتصف [' + nA + nC + ']']
      ],
      controle: { type: 'milieu', xa, xb, xc, ba, bc, entre,
                  env: { ['x' + nA]: xa, ['x' + nB]: xb, ['x' + nC]: xc,
                         [nB + nA]: ba, [nB + nC]: bc } }
    };
  }

  // -------------------------------------------------------------------------
  // Ranger des rationnels — et, juste après, ranger les DISTANCES, qui ne
  // suivent pas le même ordre : c'est tout le piège de l'exercice 4.
  // -------------------------------------------------------------------------
  // Un seul élément ne se « range » pas : on le dit en toutes lettres plutôt
  // que d'écrire un nombre isolé là où l'élève attend une comparaison.
  const groupe = (liste, mot) =>
    liste.length === 0 ? 'لا يوجد عدد ' + mot
      : liste.length === 1 ? 'العدد ' + mot + ' الوحيد هو ' + txt(liste[0].x)
      : liste.map(p => txt(p.x)).join(' < ');

  function ordonner(paires) {
    const tries = paires.slice().sort((a, b) => cmp(a.x, b.x));
    const suite = tries.map(p => txt(p.x)).join(' < ');
    return {
      enonce: ['رتّب تصاعديا الأعداد التالية:', paires.map(p => txt(p.x)).join(' ؛ ')],
      indice: 'حوّل إلى نفس المقام، أو قارن كل عدد بالصفر أولا',
      etapes: [
        ['نفصل السالبة عن الموجبة', 'كل عدد سالب أصغر من كل عدد موجب'],
        ['نرتّب السالبة', groupe(tries.filter(p => signe(p.x) < 0), 'سالب')],
        ['نرتّب الموجبة', groupe(tries.filter(p => signe(p.x) >= 0), 'موجب')],
        ['الترتيب الكامل', suite],
        ['الطرفان', txt(tries[0].x) + ' < ' + txt(tries[tries.length - 1].x)]
      ],
      controle: { type: 'ordre', tries: tries.map(p => p.x), env: {} }
    };
  }

  const API = { dist, pt, bed, symetrique, pointADistance, deuxSolutions, milieu, ordonner };
  if (M) module.exports = API;
  else racine.Outils = API;
})(typeof window !== 'undefined' ? window : globalThis);
