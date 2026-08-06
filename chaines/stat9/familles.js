// الإحصاء — 9 أساسي.
//
// La leçon, et non un devoir : huit familles, une page chacune, cinq questions
// par page, TIRÉES À CHAQUE CHARGEMENT.
//
// Le chapitre est né d'un manque nommé depuis longtemps dans l'inventaire :
// les séances 12 et 13 du livre de révision portent des statistiques, et
// aucun chapitre ne les accueillait. Il ne manquait pas de la géométrie ni des
// radicaux — il manquait un noyau capable de compter EXACTEMENT : une moyenne
// est une fraction (33,4 est 167/5), une fréquence est une fraction, et la
// médiane d'une série continue est l'abscisse exacte d'un point du polygone.
//
// LA PIÈCE CENTRALE est la famille 7, la médiane d'une série continue, prise
// telle que le maître la dit : « l'abscisse du point d'ordonnée 50 %, ou N/2,
// ou (N+1)/2 ». Les trois écritures désignent le même point du polygone des
// fréquences cumulées croissantes ; seule l'échelle verticale change. La
// machine ne lit pas ce point au crayon : elle coupe le segment et rend la
// fraction exacte.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;
  const T = M ? require('./stat.js') : racine.Stat;
  const { ent, choix, sTxt } = F;

  const q = (enonce, indice, etapes, controle) => ({ enonce, indice, etapes, controle });
  const cinq = f => { const t = []; for (let i = 0; i < 5; i++) t.push(f()); return t; };
  const RANG = 'abcdefghij';

  // ── Petits outils d'écriture ───────────────────────────────────────────
  // Une liste « 4 ، 6 ، 12 » telle que l'élève l'écrit dans son tableau.
  const liste = t => t.join(' ، ');
  // Une classe « [20 ; 40[ » — la notation du programme.
  const classe = (g, d) => '[' + g + ' ; ' + d + '[';
  // La ligne des classes d'une série continue.
  const lignes = b => b.slice(0, -1).map((x, i) => classe(x, b[i + 1])).join('  ');
  // Une somme écrite en toutes lettres : « 4 + 6 + 12 ».
  const addition = t => t.join(' + ');
  // Le produit centre × effectif, ligne par ligne : « 10 × 20 + 30 × 84 ».
  const produits = (x, n) => x.map((v, i) => v + ' × ' + n[i]).join(' + ');
  // Un nombre du noyau, écrit en fraction réduite.
  const S = v => sTxt(v);

  // ── Tirages ────────────────────────────────────────────────────────────
  // Une série DISCRÈTE à valeurs consécutives, avec un mode STRICT — sans quoi
  // « le mode » n'existerait pas et la question n'aurait pas de réponse.
  function serieDiscrete(k, min, max) {
    for (;;) {
      const depart = ent(0, 4);
      const valeurs = Array.from({ length: k }, (_, i) => depart + i);
      const eff = Array.from({ length: k }, () => ent(min, max));
      const m = Math.max(...eff);
      if (eff.filter(e => e === m).length !== 1) continue;   // mode ambigu
      return { valeurs, effectifs: eff };
    }
  }
  // Une série CONTINUE à classes de MÊME largeur — la seule sur laquelle le
  // programme lit le mode sur l'effectif brut, et le noyau refuse les autres.
  function serieContinue(k, pas, depart, min, max) {
    const bornes = Array.from({ length: k + 1 }, (_, i) => depart + i * pas);
    const effectifs = Array.from({ length: k }, () => ent(min, max));
    return { bornes, effectifs };
  }
  // Une série continue dont la médiane se LIT sur le graphique.
  //
  // Deux conditions, et la seconde est la vraie : la médiane doit tomber
  // STRICTEMENT à l'intérieur d'une classe (sinon il n'y a rien à lire, la
  // réponse est une borne), et elle doit être un ENTIER.
  //
  // Cette seconde condition n'est pas un confort d'affichage. En 9ᵉ la médiane
  // d'une série continue se LIT sur le polygone — on trace l'horizontale à
  // N/2 et on lit l'abscisse. Une médiane qui vaudrait 237/5 ne serait pas
  // lisible, et l'élève n'aurait d'autre issue que d'interpoler, c'est-à-dire
  // de sortir du programme. On ne tire donc que des séries où la lecture
  // graphique donne la réponse exacte.
  function serieMediane(k, pas, depart, min, max) {
    for (let essai = 0; essai < 4000; essai++) {
      const d = serieContinue(k, pas, depart, min, max);
      const s = T.serie(d);
      const i = T.classeMediane(s);
      const Me = T.mediane(s);
      if (F.sEgaux(Me, s.bornes[i]) || F.sEgaux(Me, s.bornes[i + 1])) continue;
      const r = F.versRat(Me);
      if (!r || r.d !== 1) continue;          // une médiane qu'on ne lirait pas
      return d;
    }
    throw new Error('aucune série à médiane lisible en 4000 tirages');
  }

  // =========================================================================
  // 1 — LIRE UN TABLEAU : effectif total, mode, étendue
  //
  //     Les trois lectures les plus simples, et les trois que l'élève confond :
  //     le MODE est une valeur de la série, pas son effectif ; l'ÉTENDUE est
  //     une différence, pas un intervalle.
  // =========================================================================
  function lectures() {
    return cinq(() => {
      const d = serieDiscrete(ent(4, 5), 2, 18);
      const s = T.serie(Object.assign({ nom: 'lecture' }, d));
      const N = T.total(s), Mo = T.mode(s), E = T.etendue(s);
      const k = d.effectifs.indexOf(Math.max(...d.effectifs));
      return q(
        ['يمثّل الجدول التالي توزيع مجموعة حسب عدد الإخوة:',
         'القيمة: ' + liste(d.valeurs),
         'التكرار: ' + liste(d.effectifs),
         'حدّد التكرار الجملي و المنوال و المدى لهذه السلسلة'],
        'المنوال قيمة من السلسلة، لا تكرارها ; و المدى فرق، لا مجال',
        [
          ['القاعدة', 'التكرار الجملي هو مجموع التكرارات ; و المنوال هو القيمة '
                    + 'ذات التكرار الأكبر ; و المدى هو الفرق بين أكبر قيمة و أصغرها'],
          ['نجمع التكرارات', 'N = ' + addition(d.effectifs)],
          ['أي', 'N = ' + S(N)],
          ['أكبر تكرار هو', 'n' + RANG[k] + ' = ' + d.effectifs[k]],
          ['و القيمة الموافقة له هي المنوال', 'Mo = ' + S(Mo)],
          ['نطرح أصغر قيمة من أكبرها', 'E = ' + d.valeurs[d.valeurs.length - 1]
                                     + ' - ' + d.valeurs[0]],
          ['أي', 'E = ' + S(E)],
          ['النتيجة', 'التكرار الجملي ' + S(N) + '، و المنوال ' + S(Mo)
                     + '، و المدى ' + S(E)]
        ],
        { serie: d, faits: [['effectif', S(N)], ['mode', S(Mo)], ['etendue', S(E)],
                            ['effectifs'].concat(d.effectifs.map(String)),
                            ['discrete']] });
    });
  }

  // =========================================================================
  // 2 — LA MOYENNE (série discrète)
  //
  //     Σ(valeur × effectif) / N. L'erreur classique est de diviser par le
  //     NOMBRE DE VALEURS au lieu de l'effectif total — la chaîne pose donc
  //     les deux nombres côte à côte.
  // =========================================================================
  function moyennes() {
    return cinq(() => {
      const d = serieDiscrete(ent(4, 5), 2, 15);
      const s = T.serie(Object.assign({ nom: 'moyenne' }, d));
      const N = T.total(s), Mm = T.moyenne(s);
      const num = d.valeurs.reduce((a, v, i) => a + v * d.effectifs[i], 0);
      return q(
        ['يمثّل الجدول التالي توزيع تلاميذ حسب عدد الكتب المقروءة:',
         'القيمة: ' + liste(d.valeurs),
         'التكرار: ' + liste(d.effectifs),
         'أحسب معدّل عدد الكتب لكلّ تلميذ'],
        'اقسم على التكرار الجملي، لا على عدد القيم',
        [
          ['القاعدة', 'المعدّل الحسابي هو مجموع جداءات كلّ قيمة في تكرارها، '
                    + 'مقسوما على التكرار الجملي'],
          ['نحسب التكرار الجملي', 'N = ' + S(N)],
          ['نحسب مجموع الجداءات', produits(d.valeurs, d.effectifs) + ' = ' + num],
          ['نقسم على التكرار الجملي', 'M = ' + num + '/' + S(N)],
          ['و المقام هو التكرار الجملي', 'عدد القيم ليس هو المقام أبدا'],
          ['النتيجة', 'المعدّل يساوي M = ' + S(Mm)]
        ],
        { serie: d, faits: [['moyenne', S(Mm)], ['effectif', S(N)]],
          claims: [[produits(d.valeurs, d.effectifs), String(num)],
                   ['M', S(Mm)]] });
    });
  }

  // =========================================================================
  // 3 — LES TABLEAUX CUMULÉS, CROISSANT ET DÉCROISSANT
  //
  //     Le cumul croissant répond à « combien AU PLUS », le décroissant à
  //     « combien AU MOINS ». Le dernier cumul croissant vaut N — c'est le
  //     contrôle que l'élève doit faire lui-même.
  // =========================================================================
  function cumuls() {
    return cinq(() => {
      const d = serieDiscrete(ent(4, 5), 3, 20);
      const s = T.serie(Object.assign({ nom: 'cumul' }, d));
      const c = T.cumulCroissant(s), r = T.cumulDecroissant(s), N = T.total(s);
      const j = ent(1, d.valeurs.length - 2);   // un seuil STRICTEMENT intérieur
      return q(
        ['يمثّل الجدول التالي توزيع عائلات حسب عدد الهواتف المحمولة:',
         'القيمة: ' + liste(d.valeurs),
         'التكرار: ' + liste(d.effectifs),
         'كوّن جدول التكرارات المتراكمة الصاعدة و النازلة، ثمّ حدّد عدد العائلات '
         + 'التي لها ' + d.valeurs[j] + ' هواتف على الأكثر'],
        'التراكم الصاعد يجيب عن « على الأكثر »، و النازل عن « على الأقلّ »',
        [
          ['القاعدة', 'التكرار المتراكم الصاعد عند قيمة هو مجموع تكرارات القيم '
                    + 'التي لا تفوقها ; و النازل هو مجموع تكرارات القيم التي '
                    + 'لا تقلّ عنها'],
          ['نبدأ بالتكرار الأوّل', 'ca = ' + S(c[0])],
          ['نضيف الثاني', 'cb = ' + S(c[0]) + ' + ' + d.effectifs[1]],
          ['نواصل حتّى الأخير', 'c' + RANG[c.length - 1] + ' = ' + S(N)],
          ['و آخر تراكم صاعد يساوي التكرار الجملي — و هو التحقّق', 'c'
            + RANG[c.length - 1] + ' = N'],
          ['أوّل تراكم نازل هو التكرار الجملي', 'ra = ' + S(r[0])],
          ['نقرأ « على الأكثر » على التراكم الصاعد', 'c' + RANG[j] + ' = ' + S(c[j])],
          ['النتيجة', 'عدد العائلات المطلوب هو ' + S(c[j])]
        ],
        { serie: d, faits: [['cumul-croissant'].concat(c.map(S)),
                            ['cumul-decroissant'].concat(r.map(S)),
                            ['effectif', S(N)]] });
    });
  }

  // =========================================================================
  // 4 — TOUATOUR, POURCENTAGES ET ANGLES DU CAMEMBERT
  //
  //     La fréquence est une part de 1, le pourcentage une part de 100, l'angle
  //     une part de 360. Trois échelles pour UNE SEULE proportion — et c'est
  //     exactement ce que la famille 7 redira sur la médiane.
  // =========================================================================
  function frequences() {
    return cinq(() => {
      // Un effectif total qui divise 360 : les angles restent entiers, et
      // l'élève peut les tracer au rapporteur.
      const N = choix([20, 24, 30, 36, 40, 45, 60, 72, 90, 100]);
      const k = ent(3, 4);
      const eff = [];
      let reste = N;
      for (let i = 0; i < k - 1; i++) {
        const m = Math.max(1, Math.floor(reste / (k - i)) - ent(0, 2));
        eff.push(m); reste -= m;
      }
      eff.push(reste);
      if (reste < 1) return frequences()[0];
      const d = { valeurs: Array.from({ length: k }, (_, i) => i + 1), effectifs: eff };
      const s = T.serie(Object.assign({ nom: 'frequence' }, d));
      const p = T.pourcentages(s), g = T.angles(s);
      const j = ent(0, k - 1);
      return q(
        ['يمثّل الجدول التالي توزيع ' + N + ' تلميذا حسب عدد الرحلات:',
         'القيمة: ' + liste(d.valeurs),
         'التكرار: ' + liste(eff),
         'أحسب التواترات بالنسب المائوية، ثمّ قيس الزاوية الموافقة للقيمة '
         + d.valeurs[j] + ' في المخطّط الدائري'],
        'التواتر جزء من 1، النسبة جزء من 100، و الزاوية جزء من 360 — نفس النسبة ثلاث مرّات',
        [
          ['القاعدة', 'التواتر هو التكرار مقسوما على التكرار الجملي ; و النسبة '
                    + 'المائوية هي التواتر في 100 ; و قيس الزاوية هو التواتر في 360'],
          ['التكرار الجملي', 'N = ' + N],
          ['التواتر الأوّل', 'fa = ' + eff[0] + '/' + N],
          ['أي بالنسبة المائوية', 'pa = ' + S(p[0])],
          ['نتحقّق أنّ مجموع النسب يساوي 100', addition(p.map(S)) + ' = 100'],
          ['الزاوية المطلوبة', 'g' + RANG[j] + ' = 360 × ' + eff[j] + '/' + N],
          ['أي', 'g' + RANG[j] + ' = ' + S(g[j])],
          ['النتيجة', 'قيس الزاوية الموافقة هو ' + S(g[j]) + ' درجة']
        ],
        { serie: d, faits: [['pourcentages'].concat(p.map(S)),
                            ['angle', String(j + 1), S(g[j])],
                            ['effectif', String(N)]],
          claims: [[addition(p.map(S)), '100']] });
    });
  }

  // =========================================================================
  // 5 — LE MOUASSAT D'UNE SÉRIE DISCRÈTE
  //
  //     On range, on compte, on prend le rang du milieu. Si N est PAIR il y a
  //     deux rangs du milieu, et la médiane est leur demi-somme — c'est
  //     exactement ce que fait le corrigé du maître (N = 100, rangs 50 et 51).
  // =========================================================================
  function mediaDiscretes() {
    return cinq(() => {
      const d = serieDiscrete(ent(4, 6), 2, 14);
      const s = T.serie(Object.assign({ nom: 'moussat' }, d));
      const N = F.sVal(T.total(s)), Me = T.mediane(s), c = T.cumulCroissant(s);
      const pair = (N % 2 === 0);
      const rangs = pair ? [N / 2, N / 2 + 1] : [(N + 1) / 2];
      // La valeur atteinte à un rang donné — lue sur le cumul croissant.
      const valAu = k => {
        for (let i = 0; i < c.length; i++) if (F.sCmp(F.num(k), c[i]) <= 0) return d.valeurs[i];
        return d.valeurs[d.valeurs.length - 1];
      };
      return q(
        ['يمثّل الجدول التالي توزيع تلاميذ حسب عدد الإخوة:',
         'القيمة: ' + liste(d.valeurs),
         'التكرار: ' + liste(d.effectifs),
         'حدّد موسّط هذه السلسلة الإحصائية'],
        pair ? 'التكرار الجملي زوجي: هناك رتبتان في الوسط، و الموسّط معدّلهما'
             : 'التكرار الجملي فردي: هناك رتبة واحدة في الوسط',
        [
          ['القاعدة', 'نرتّب القيم تصاعديا ; إذا كان N فرديا فالموسّط هو القيمة '
                    + 'ذات الرتبة (N+1)/2، و إذا كان زوجيا فهو معدّل القيمتين '
                    + 'ذواتي الرتبتين N/2 و N/2 + 1'],
          ['نحسب التكرار الجملي', 'N = ' + N],
          ['و هو ' + (pair ? 'زوجي' : 'فردي'),
           pair ? 'N/2 = ' + (N / 2) : '(N + 1)/2 = ' + ((N + 1) / 2)],
          ['نكوّن التكرارات المتراكمة الصاعدة', 'ca = ' + S(c[0])],
          ['و نواصل إلى', 'c' + RANG[c.length - 1] + ' = ' + N],
          pair ? ['نقرأ القيمة ذات الرتبة N/2', 'الرتبة ' + (N / 2) + ' تقابل القيمة '
                                                + valAu(N / 2)]
               : ['نقرأ القيمة ذات الرتبة (N+1)/2', 'الرتبة ' + ((N + 1) / 2)
                                                    + ' تقابل القيمة ' + valAu((N + 1) / 2)],
          pair ? ['و القيمة ذات الرتبة N/2 + 1', 'الرتبة ' + (N / 2 + 1)
                                                 + ' تقابل القيمة ' + valAu(N / 2 + 1)]
               : ['و هي وحدها', 'لا حاجة إلى رتبة ثانية'],
          ['النتيجة', 'الموسّط يساوي Me = ' + S(Me)]
        ],
        { serie: d, faits: [['mediane', S(Me)], ['effectif', String(N)],
                            ['cumul-croissant'].concat(c.map(S))],
          claims: [['Me', S(Me)]] });
    });
  }

  // =========================================================================
  // 6 — LE CENTRE DE CLASSE, ET LA MOYENNE D'UNE SÉRIE CONTINUE
  //
  //     Une classe n'a pas de valeur : on la remplace par son CENTRE. C'est la
  //     seule approximation que la leçon s'autorise, et elle doit être dite —
  //     la moyenne obtenue n'est pas celle des données brutes.
  // =========================================================================
  function moyennesContinues() {
    return cinq(() => {
      const pas = choix([5, 10, 20]);
      const d = serieContinue(ent(4, 5), pas, choix([0, pas, 2 * pas]), 5, 60);
      const s = T.serie(Object.assign({ nom: 'moyenne continue' }, d));
      const x = T.centres(s), N = T.total(s), Mm = T.moyenne(s);
      const num = x.reduce((a, v, i) => F.sAdd(a, F.sMul(v, s.effectifs[i])), F.num(0));
      return q(
        ['يمثّل الجدول التالي توزيع عمّال حسب الأجر بالدينار:',
         'الفئة: ' + lignes(d.bornes),
         'التكرار: ' + liste(d.effectifs),
         'أحسب مركز كلّ فئة، ثمّ معدّل الأجور'],
        'مركز الفئة هو معدّل طرفيها — و هو ما يحلّ محلّ الفئة في الحساب',
        [
          ['القاعدة', 'مركز فئة هو معدّل طرفيها ; و معدّل سلسلة متّصلة هو مجموع '
                    + 'جداءات كلّ مركز في تكراره، مقسوما على التكرار الجملي'],
          ['المركز الأوّل', 'xa = (' + d.bornes[0] + ' + ' + d.bornes[1] + ')/2'],
          ['أي', 'xa = ' + S(x[0])],
          ['نحسب التكرار الجملي', 'N = ' + S(N)],
          ['نحسب مجموع الجداءات', produits(x.map(S), d.effectifs) + ' = ' + S(num)],
          ['نقسم', 'M = ' + S(num) + '/' + S(N)],
          ['و المقام هو التكرار الجملي', 'كلّ فئة عُوّضت بمركزها، و هذا هو التقريب الوحيد'],
          ['النتيجة', 'المعدّل يساوي M = ' + S(Mm) + ' دينارا — و هو تقريبيّ، '
                     + 'لأنّ كلّ فئة عُوّضت بمركزها']
        ],
        { serie: d, faits: [['centres'].concat(x.map(S)), ['moyenne', S(Mm)],
                            ['effectif', S(N)], ['continue'], ['largeurs-egales']],
          claims: [[produits(x.map(S), d.effectifs), S(num)], ['M', S(Mm)]] });
    });
  }

  // =========================================================================
  // 7 — LE MOUASSAT D'UNE SÉRIE CONTINUE   ← LA PIÈCE CENTRALE
  //
  //     La règle du maître, prise au mot : le moussat est l'ABSCISSE du point
  //     du polygone des fréquences cumulées croissantes dont l'ordonnée vaut
  //     la moitié — 50 % sur un axe en pourcentages, 0,5 sur un axe en
  //     proportions, N/2 sur un axe en effectifs. UN SEUL POINT, trois façons
  //     de le nommer.
  //
  //     Entre deux sommets le polygone est un SEGMENT : l'abscisse sort donc
  //     d'une interpolation affine, exacte en rationnels. Le maître la lit au
  //     crayon (« Me ≈ 31 ») ; la machine rend 220/7, et c'est ce nombre-là
  //     qu'elle compare.
  // =========================================================================
  function mediaContinues() {
    return cinq(() => {
      const pas = choix([5, 10, 20]);
      const d = serieMediane(ent(4, 5), pas, choix([0, pas]), 8, 70);
      const s = T.serie(Object.assign({ nom: 'moussat continu' }, d));
      const c = T.cumulCroissant(s), N = T.total(s), Me = T.mediane(s);
      const i = T.classeMediane(s);
      const h = F.sEch(N, F.rat(1, 2));
      const avant = (i === 0) ? F.num(0) : c[i - 1];
      return q(
        ['يمثّل الجدول التالي توزيع ' + S(N) + ' تلميذا حسب الزمن بالدقيقة:',
         'الفئة: ' + lignes(d.bornes),
         'التكرار: ' + liste(d.effectifs),
         'كوّن جدول التكرارات المتراكمة الصاعدة، ثمّ حدّد موسّط هذه السلسلة'],
        'ارسم المضلّع، ثمّ ارسم المستقيم الأفقي ذا الترتيب N/2 و اقرأ الفاصلة',
        [
          ['القاعدة', 'مضلّع التكرارات المتراكمة الصاعدة يصل النقط (طرف الفئة '
                    + 'الأعلى ؛ التراكم)، انطلاقا من (الطرف الأوّل ؛ 0) ; و '
                    + 'الموسّط هو فاصلة النقطة التي ترتيبها تساوي نصف التكرار '
                    + 'الجملي — أي 50٪ إذا كان المحور بالنسب المائوية، و 0,5 '
                    + 'إذا كان بالتواترات'],
          ['نحسب التكرار الجملي', 'N = ' + S(N)],
          ['نكوّن التراكم الصاعد', 'ca = ' + S(c[0])],
          ['و نواصل إلى الأخير', 'c' + RANG[c.length - 1] + ' = N'],
          ['نضع النقط في معلم ثمّ نصلها', 'النقط هي (طرف كلّ فئة الأعلى ؛ تراكمها)، '
                                        + 'و أوّلها (' + S(s.bornes[0]) + ' ؛ 0)'],
          ['نحسب نصف التكرار الجملي', 'N/2 = ' + S(h)],
          ['نرسم المستقيم الأفقي ذا الترتيب N/2', 'يقطع المضلّع في نقطة واحدة'],
          ['نقرأ فاصلة نقطة التقاطع', 'القراءة تقع داخل الفئة '
            + classe(S(s.bornes[i]), S(s.bornes[i + 1])) + '، بين التراكمين '
            + S(avant) + ' و ' + S(c[i])],
          ['النتيجة', 'الموسّط هو Me = ' + S(Me) + '، و هو فاصلة النقطة التي '
                     + 'ترتيبها ' + S(h) + ' على المضلّع الصاعد']
        ],
        { serie: d,
          faits: [['cumul-croissant'].concat(c.map(S)), ['effectif', S(N)],
                  ['mediane', S(Me)],
                  // La règle du maître, contrôlée pour ce qu'elle est : une
                  // lecture à mi-hauteur sur le polygone. Les trois écritures
                  // désignent le même point, et on le vérifie.
                  ['mediane-au', 'N/2', S(Me)],
                  ['classe-mediane', S(s.bornes[i]), S(s.bornes[i + 1])],
                  ['continue']],
          claims: [['Me', S(Me)]] });
    });
  }

  // =========================================================================
  // 8 — L'ISTIHMAL : une probabilité lue sur une série statistique
  //
  //     « On choisit un individu au hasard » — la probabilité est le nombre de
  //     cas favorables sur l'effectif total. Sur une série continue le seuil
  //     doit tomber sur une BORNE, sinon la réponse suppose une répartition
  //     uniforme dans la classe, et il faut le dire.
  // =========================================================================
  function probabilites() {
    return cinq(() => {
      const pas = choix([5, 10, 20]);
      const d = serieContinue(ent(4, 5), pas, choix([0, pas]), 6, 50);
      const s = T.serie(Object.assign({ nom: 'probabilité' }, d));
      const N = T.total(s), c = T.cumulCroissant(s);
      const j = ent(1, d.bornes.length - 2);        // un seuil qui EST une borne
      const seuil = d.bornes[j];
      const fav = c[j - 1], pr = T.probaSous(s, seuil);
      return q(
        ['يمثّل الجدول التالي توزيع ' + S(N) + ' فردا حسب المدّة بالدقيقة:',
         'الفئة: ' + lignes(d.bornes),
         'التكرار: ' + liste(d.effectifs),
         'نختار فردا بصفة عشوائية. ما هو احتمال أن تكون مدّته أقلّ من ' + seuil + ' ؟'],
        'العدد المطلوب هو تراكم صاعد، و الحدّ ' + seuil + ' هو طرف فئة تماما',
        [
          ['القاعدة', 'احتمال حدث هو عدد الحالات الملائمة مقسوما على عدد الحالات '
                    + 'الممكنة، و هنا عدد الحالات الممكنة هو التكرار الجملي'],
          ['التكرار الجملي', 'N = ' + S(N)],
          ['الحدّ المطلوب طرف فئة، فالعدد الملائم تراكم صاعد', 'c' + RANG[j - 1]
            + ' = ' + S(fav)],
          ['نكتب الاحتمال', 'الاحتمال يساوي ' + S(fav) + '/' + S(N)],
          ['نبسّط', S(fav) + '/' + S(N) + ' = ' + S(pr)],
          ['و بالنسبة المائوية', S(pr) + ' × 100 = ' + S(F.sMul(pr, F.num(100)))],
          ['النتيجة', 'الاحتمال المطلوب هو ' + S(pr)]
        ],
        { serie: d, faits: [['probabilite-sous', String(seuil), S(pr)],
                            ['sous-seuil', String(seuil), S(fav)],
                            ['effectif', S(N)]],
          claims: [[S(fav) + '/' + S(N), S(pr)]] });
    });
  }

  const API = { lectures, moyennes, cumuls, frequences, mediaDiscretes,
                moyennesContinues, mediaContinues, probabilites };
  if (M) module.exports = API; else racine.Familles = API;
})(typeof window !== 'undefined' ? window : globalThis);
