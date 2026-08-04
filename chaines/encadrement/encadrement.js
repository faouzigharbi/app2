// Fiches d'encadrement — النجاح في الرياضيات 7-8-9 أساسي.
//   « حصر و مجال — سلسلة تمارين مراجعة عدد 10 » : exercices 1, 2 et 3 ;
//   « Encadrement » : exercices 10, 11, 12 et 13.
//
// Une page par exercice, un volet par question de l'énoncé, DANS L'ORDRE DE
// L'ÉNONCÉ. La méthode est décrite dans ../METHODE.md.
//
// FIDÈLE À L'ORIGINAL : les ensembles, les expressions et les questions sont
// ceux de la fiche, à l'identique. Le bouton « أرقام جديدة » n'y rebat que
// l'ordre des étapes.
//
// CE QUE CETTE FICHE DEMANDE AU NOYAU. Les autres portaient sur des nombres ;
// celle-ci porte sur des ENSEMBLES et sur des ENCADREMENTS. D'où deux ajouts,
// tous deux dans noyau.js :
//
//   * une couche d'intervalles — bornes exactes, crochets ouverts ou fermés,
//     intersection, réunion, égalité. « I ∩ J = [-1/2 ; 3/2] » est donc une
//     affirmation calculée, pas une affirmation crue ;
//
//   * un tirage DANS un intervalle. Un encadrement « -7/2 ≤ A ≤ 1/10 » n'a
//     aucun sens sur un x isolé : le validateur l'éprouve sur des dizaines de
//     valeurs prises dans le domaine, bornes comprises quand elles y sont.
//
// Et les définitions elles-mêmes sont contrôlées : pour chaque ensemble, le
// validateur balaie des rationnels des deux côtés de la frontière et vérifie
// que « x vérifie la condition de la fiche » et « x est dans l'intervalle que
// j'annonce » sont vraies exactement ensemble.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);

  // =========================================================================
  // التمرين 1
  //   I = ]-2 ; 3/2] et J = [-1/2 ; 3[ ; leur intersection [-1/2 ; 3/2] est
  //   exactement le domaine sur lequel la question 2 encadre A.
  // =========================================================================
  function exercice1() {
    const defI = 'I = {x ∈ ℝ ; -2 < x ≤ 3/2}';
    const defJ = 'J = {x ∈ ℝ ; -3 < 3 - 2x ≤ 4}';
    const ens = { I: ']-2 ; 3/2]', J: '[-1/2 ; 3[' };
    const conditions = { I: '-2 < x ≤ 3/2', J: '-3 < 3 - 2x ≤ 4' };
    const exprA = '(x^2 - 2)/(x + 1)';
    const domaine = '[-1/2 ; 3/2]';
    const poseA = ['نعتبر عددا حقيقيا x بحيث:', 'x ∈ ' + domaine,
                   'و لتكن العبارة:', 'A = ' + exprA];

    return [
      {
        enonce: ['نعتبر المجموعتين:', defI, defJ,
                 'أكتب كلاًّ من المجموعتين I و J في صورة مجال و مثّلهما على المستقيم العددي'],
        indice: 'شرط I حصر جاهز؛ أمّا J فاطرح 3 من أطرافه ثمّ اقسم على -2',
        etapes: [
          ['شرط I حصر مباشر لـ x', 'I = ]-2 ; 3/2]'],
          ['نطرح 3 من أطراف شرط J', '-6 < -2x ≤ 1'],
          ['نقسم على -2 فينقلب الترتيب', '3 > x ≥ -1/2'],
          ['نرتّب الحصر تصاعديا', '-1/2 ≤ x < 3'],
          ['المجال الثاني', 'J = [-1/2 ; 3[']
        ],
        controle: { ens, conditions, dans: { x: 'J' },
                    egaux: [['I', ']-2 ; 3/2]'], ['J', '[-1/2 ; 3[']] }
      },
      {
        enonce: ['نعتبر المجموعتين:', defI, defJ, 'أوجد:', 'I ∩ J', 'I ∪ J'],
        indice: 'التقاطع يأخذ البداية الأكبر و النهاية الأصغر؛ و الاتّحاد العكس',
        etapes: [
          ['نقارن البدايتين', '-2 < -1/2'],
          ['نقارن النهايتين', '3/2 < 3'],
          ['التقاطع: البداية الأكبر و النهاية الأصغر', 'I ∩ J = [-1/2 ; 3/2]'],
          ['الحدّ -1/2 من J و الحدّ 3/2 من I', 'القوسان مغلقان عندهما'],
          ['الاتّحاد: البداية الأصغر و النهاية الأكبر', 'I ∪ J = ]-2 ; 3[']
        ],
        controle: { ens,
                    egaux: [['I ∩ J', '[-1/2 ; 3/2]'], ['I ∪ J', ']-2 ; 3[']] }
      },
      {
        enonce: poseA.concat(['بيّن أنّ x + 1 ≠ 0']),
        indice: 'أضف 1 إلى أطراف حصر x: يصير الحدّ الأدنى موجبا تماما',
        etapes: [
          ['ننطلق من حصر x', '-1/2 ≤ x ≤ 3/2'],
          ['نضيف 1 إلى الأطراف', '1/2 ≤ x + 1 ≤ 5/2'],
          ['الحدّ الأدنى موجب تماما', '1/2 > 0'],
          ['نستنتج', 'x + 1 > 0'],
          ['النتيجة', 'العدد x + 1 لا ينعدم، فالكسر A معرّف']
        ],
        controle: { dans: { x: domaine }, derives: { A: exprA },
                    vrai: ['x + 1 > 0'] }
      },
      {
        enonce: poseA.concat(['بيّن أنّ:', 'A = x - 1 - 1/(x + 1)']),
        indice: 'وحّد مقام العبارة x - 1 - 1/(x + 1): يظهر البسط x^2 - 2',
        etapes: [
          ['نوحّد المقامات', 'x - 1 - 1/(x + 1) = ((x - 1)(x + 1) - 1)/(x + 1)'],
          ['نستعمل المتطابقة', '(x - 1)(x + 1) = x^2 - 1'],
          ['نطرح 1 من البسط', 'x^2 - 1 - 1 = x^2 - 2'],
          ['النتيجة', 'A = x - 1 - 1/(x + 1)']
        ],
        controle: { dans: { x: domaine }, derives: { A: exprA },
                    claims: [['A', 'x - 1 - 1/(x + 1)']] }
      },
      {
        enonce: poseA.concat(['استنتج حصرا للعبارة A']),
        indice: 'احصر x - 1 و x + 1، ثمّ اقلب الحصر الثاني: الترتيب ينقلب مرّتين',
        etapes: [
          ['نحصر الحدّ الأوّل', '-3/2 ≤ x - 1 ≤ 1/2'],
          ['نحصر المقام', '1/2 ≤ x + 1 ≤ 5/2'],
          ['نأخذ المقلوب فينقلب الترتيب', '2/5 ≤ 1/(x + 1) ≤ 2'],
          ['نضرب في -1 فينقلب الترتيب', '-2 ≤ -1/(x + 1) ≤ -2/5'],
          ['نجمع الحصرين', '-7/2 ≤ x - 1 - 1/(x + 1) ≤ 1/10'],
          ['النتيجة', '-7/2 ≤ A ≤ 1/10']
        ],
        controle: { dans: { x: domaine }, derives: { A: exprA },
                    vrai: ['-7/2 ≤ A ≤ 1/10'] }
      }
    ];
  }

  // =========================================================================
  // التمرين 2
  //   I = [1 ; 3] vient d'une valeur absolue, J = ]-∞ ; 2[ d'une seule
  //   inégalité — et les trois encadrements de la question 3 se font tous sur
  //   I, pas sur I ∩ J.
  // =========================================================================
  function exercice2() {
    const defI = 'I = {x ∈ ℝ ; |x - 2| ≤ 1}';
    const defJ = 'J = {x ∈ ℝ ; x < 2}';
    const ens = { I: '[1 ; 3]', J: ']-∞ ; 2[' };
    const conditions = { I: '|x - 2| ≤ 1', J: 'x < 2' };
    const exprA = '-5x + 1';
    const exprB = '1 - x + 1/(2x - 1)';
    const exprC = '-1/2 (x - 10/3)^2 + 3/2';
    const pose = ['ليكن x عددا حقيقيا بحيث:', 'x ∈ I',
                  'أوجد حصرا للعبارة التالية:'];

    return [
      {
        enonce: ['نعتبر المجموعتين:', defI, defJ,
                 'بيّن أنّ I = [1 ; 3] و أكتب J في صورة مجال'],
        indice: '|x - 2| ≤ 1 يعني -1 ≤ x - 2 ≤ 1',
        etapes: [
          ['شرط المجموعة I', '|x - 2| ≤ 1'],
          ['نفكّ القيمة المطلقة', '-1 ≤ x - 2 ≤ 1'],
          ['نضيف 2 إلى الأطراف', '1 ≤ x ≤ 3'],
          ['المجال الأوّل', 'I = [1 ; 3]'],
          ['شرط J حصر من جهة واحدة', 'J = ]-∞ ; 2[']
        ],
        controle: { ens, conditions, dans: { x: 'I' },
                    egaux: [['I', '[1 ; 3]'], ['J', ']-∞ ; 2[']] }
      },
      {
        enonce: ['نعتبر المجموعتين:', defI, defJ,
                 'مثّل كلاًّ من I و J على المستقيم العددي ثمّ أوجد:',
                 'I ∩ J', 'I ∪ J'],
        indice: 'المجال J مفتوح إلى -∞، فهو يبتلع بداية I في الاتّحاد',
        etapes: [
          ['نقارن بداية I بنهاية J', '1 < 2'],
          ['نقارن النهايتين', '2 < 3'],
          ['التقاطع: من بداية I إلى نهاية J', 'I ∩ J = [1 ; 2['],
          ['العدد 2 ليس في J', 'القوس مفتوح عنده'],
          ['الاتّحاد: كل ما دون نهاية I', 'I ∪ J = ]-∞ ; 3]']
        ],
        controle: { ens,
                    egaux: [['I ∩ J', '[1 ; 2['], ['I ∪ J', ']-∞ ; 3]']] }
      },
      {
        enonce: pose.concat(['A = ' + exprA]),
        indice: 'اضرب حصر x في -5: الترتيب ينقلب',
        etapes: [
          ['ننطلق من حصر x', '1 ≤ x ≤ 3'],
          ['نضرب في -5 فينقلب الترتيب', '-15 ≤ -5x ≤ -5'],
          ['نضيف 1 إلى الأطراف', '-14 ≤ -5x + 1 ≤ -4'],
          ['النتيجة', '-14 ≤ A ≤ -4']
        ],
        controle: { ens, dans: { x: 'I' }, derives: { A: exprA },
                    vrai: ['-14 ≤ A ≤ -4'] }
      },
      {
        enonce: pose.concat(['B = ' + exprB]),
        indice: 'احصر 1 - x و 2x - 1، ثمّ اقلب الثاني',
        etapes: [
          ['نحصر الحدّ الأوّل', '-2 ≤ 1 - x ≤ 0'],
          ['نحصر المقام', '1 ≤ 2x - 1 ≤ 5'],
          ['نأخذ المقلوب فينقلب الترتيب', '1/5 ≤ 1/(2x - 1) ≤ 1'],
          ['نجمع الحصرين', '-9/5 ≤ 1 - x + 1/(2x - 1) ≤ 1'],
          ['النتيجة', '-9/5 ≤ B ≤ 1']
        ],
        controle: { ens, dans: { x: 'I' }, derives: { B: exprB },
                    vrai: ['-9/5 ≤ B ≤ 1'] }
      },
      {
        enonce: pose.concat(['C = ' + exprC]),
        indice: 'أطراف حصر x - 10/3 سالبة: التربيع يقلب الترتيب',
        etapes: [
          ['نحصر القوس', '-7/3 ≤ x - 10/3 ≤ -1/3'],
          ['نضرب في -1 فينقلب الترتيب', '1/3 ≤ 10/3 - x ≤ 7/3'],
          ['الحصر موجب الآن: نربّعه', '1/9 ≤ (10/3 - x)^2 ≤ 49/9'],
          ['المربّعان متساويان', '(10/3 - x)^2 = (x - 10/3)^2'],
          ['نضرب في -1/2 فينقلب الترتيب', '-49/18 ≤ -1/2 (x - 10/3)^2 ≤ -1/18'],
          ['نضيف 3/2 إلى الأطراف', '-11/9 ≤ -1/2 (x - 10/3)^2 + 3/2 ≤ 13/9'],
          ['النتيجة', '-11/9 ≤ C ≤ 13/9']
        ],
        controle: { ens, dans: { x: 'I' }, derives: { C: exprC },
                    vrai: ['-11/9 ≤ C ≤ 13/9'] }
      }
    ];
  }

  // =========================================================================
  // التمرين 3
  //   I = ]-2 ; 2[ sort d'une valeur absolue précédée d'un coefficient
  //   NÉGATIF : deux renversements de l'ordre, à ne pas confondre.
  //
  //   Le tirage de la première question se fait dans I ∩ J : elle traite les
  //   deux conditions à la fois, et une seule valeur doit satisfaire les deux.
  //   Que I et J soient les bons ensembles, ce n'est pas ce tirage qui le dit
  //   mais le balayage des `conditions`, qui va chercher des deux côtés de
  //   chaque frontière.
  // =========================================================================
  function exercice3() {
    const defI = 'I = {x ∈ ℝ ; 3 - 4|x| > -5}';
    const defJ = 'J = {x ∈ ℝ ; 2x + 1 ≤ 2}';
    const ens = { I: ']-2 ; 2[', J: ']-∞ ; 1/2]' };
    const conditions = { I: '3 - 4|x| > -5', J: '2x + 1 ≤ 2' };
    const exprA = '1/4 x^2 + (x + 1)/(5 - 2x)';
    const poseA = ['لتكن العبارة:', 'A = ' + exprA, 'حيث:', 'x ∈ I'];

    return [
      {
        enonce: ['نعتبر المجموعتين:', defI, defJ,
                 'أكتب كلاًّ منهما في صورة مجال و مثّلهما على المستقيم العددي'],
        indice: 'اعزل |x| في الشرط الأوّل، و انتبه: القسمة على -4 تقلب الترتيب',
        etapes: [
          ['نعزل القيمة المطلقة', '-4|x| > -8'],
          ['نقسم على -4 فينقلب الترتيب', '|x| < 2'],
          ['نفكّ القيمة المطلقة', '-2 < x < 2'],
          ['المجال الأوّل', 'I = ]-2 ; 2['],
          ['نطرح 1 من شرط J', '2x ≤ 1'],
          ['المجال الثاني', 'J = ]-∞ ; 1/2]']
        ],
        controle: { ens, conditions, dans: { x: 'I ∩ J' },
                    egaux: [['I', ']-2 ; 2['], ['J', ']-∞ ; 1/2]']] }
      },
      {
        enonce: ['نعتبر المجموعتين:', defI, defJ, 'أوجد:', 'I ∩ J', 'I ∪ J'],
        indice: 'قارن 1/2 بـ 2: نهاية J تقع داخل I',
        etapes: [
          ['نقارن النهايتين', '1/2 < 2'],
          ['التقاطع: من بداية I إلى نهاية J', 'I ∩ J = ]-2 ; 1/2]'],
          ['العدد 1/2 في المجالين معا', 'القوس مغلق عنده'],
          ['الاتّحاد: كل ما دون نهاية I', 'I ∪ J = ]-∞ ; 2['],
          ['العدد 2 ليس في I', 'القوس مفتوح عنده']
        ],
        controle: { ens,
                    egaux: [['I ∩ J', ']-2 ; 1/2]'], ['I ∪ J', ']-∞ ; 2[']] }
      },
      {
        enonce: poseA.concat(['بيّن أنّ 5 - 2x ≠ 0']),
        indice: 'اضرب حصر x في -2 ثمّ أضف 5: الحدّ الأدنى يصير 1',
        etapes: [
          ['ننطلق من حصر x', '-2 < x < 2'],
          ['نضرب في -2 فينقلب الترتيب', '-4 < -2x < 4'],
          ['نضيف 5 إلى الأطراف', '1 < 5 - 2x < 9'],
          ['الحدّ الأدنى موجب تماما', '5 - 2x > 1'],
          ['النتيجة', 'العدد 5 - 2x لا ينعدم، فالكسر A معرّف']
        ],
        controle: { ens, dans: { x: 'I' }, derives: { A: exprA },
                    vrai: ['5 - 2x > 0'] }
      },
      {
        enonce: poseA.concat(['بيّن أنّ:', 'A = 1/4 x^2 + 7/(2(5 - 2x)) - 1/2']),
        indice: 'وحّد مقام الحدّين الأخيرين: البسط يصير 2 + 2x',
        etapes: [
          ['نوحّد مقام الحدّين الأخيرين',
           '7/(2(5 - 2x)) - 1/2 = (7 - (5 - 2x))/(2(5 - 2x))'],
          ['نبسّط البسط', '7 - (5 - 2x) = 2 + 2x'],
          ['نختصر بـ 2', '(2 + 2x)/(2(5 - 2x)) = (x + 1)/(5 - 2x)'],
          ['النتيجة', 'A = 1/4 x^2 + 7/(2(5 - 2x)) - 1/2']
        ],
        controle: { ens, dans: { x: 'I' }, derives: { A: exprA },
                    claims: [['A', '1/4 x^2 + 7/(2(5 - 2x)) - 1/2']] }
      },
      {
        enonce: poseA.concat(['استنتج حصرا للعبارة A']),
        indice: 'الشكل الثاني هو المفيد: مربّع موجب، و كسر مقامه محصور',
        etapes: [
          ['نحصر المربّع', '0 ≤ x^2 < 4'],
          ['نضرب في 1/4', '0 ≤ 1/4 x^2 < 1'],
          ['نستعمل حصر المقام', '1 < 5 - 2x < 9'],
          ['نضرب في 2', '2 < 2(5 - 2x) < 18'],
          ['نأخذ المقلوب فينقلب الترتيب', '7/18 < 7/(2(5 - 2x)) < 7/2'],
          ['نجمع الحصرين ثمّ نطرح 1/2',
           '-1/9 < 1/4 x^2 + 7/(2(5 - 2x)) - 1/2 < 4'],
          ['النتيجة', '-1/9 < A < 4']
        ],
        controle: { ens, dans: { x: 'I' }, derives: { A: exprA },
                    vrai: ['-1/9 < A < 4'] }
      }
    ];
  }

  // =========================================================================
  // التمرين 10 — deux parties, neuf questions.
  //
  //   (I) x ∈ [-3 ; -2] et y ∈ [2 ; 4] : x est NÉGATIF et y positif, et c'est
  //   tout le sujet. Chaque multiplication par x renverse l'ordre, chaque
  //   multiplication par y le garde — et la valeur absolue de la question 2 se
  //   lève grâce au signe trouvé à la question 1, pas autrement.
  //
  //   (II) √17 n'est pas là par hasard : le carré d'un élément de E = [-2 ; 2[
  //   vaut au plus 4, et 4 < √17 de justesse (16 < 17). C'est ce « de justesse »
  //   que la question 3 fait démontrer.
  //
  //   RÉSERVE SUR LA FICHE. La question (II) 1 dit « أكتب كلاً من E و F و G » :
  //   elle nomme G, mais l'énoncé ne définit que E, F et H. On lit donc H — le
  //   troisième ensemble posé — et non un G qui n'existe nulle part.
  // =========================================================================
  function exercice10() {
    const defE = 'E = {x ∈ ℝ ; -2 ≤ x < 2}';
    const defF = 'F = {x ∈ ℝ ; x ≤ 2}';
    const defH = 'H = {x ∈ ℝ ; |x| < √17}';
    const ens = { E: '[-2 ; 2[', F: ']-∞ ; 2]', H: ']-√17 ; √17[',
                  'IR+': '[0 ; +∞[' };
    const conditions = { E: '-2 ≤ x < 2', F: 'x ≤ 2', H: '|x| < √17' };
    const exprA = 'x|3x - 2y| + 2|y| × |x|';
    // « xy » d'un seul tenant serait UNE lettre pour l'analyseur. Les étapes
    // écrivent donc « x y », comme on les sépare en les lisant ; l'énoncé, lui,
    // garde l'écriture de la fiche.
    const domaines = { x: '[-3 ; -2]', y: '[2 ; 4]' };
    const pose = ['x و y عددان حقيقيان حيث:', '-3 ≤ x ≤ -2', '2 ≤ y ≤ 4'];
    const posE = ['نعتبر المجموعات التالية:', defE, defF, defH];

    return [
      {
        enonce: pose.concat(['أوجد حصرا للجداء xy']),
        indice: 'لا نضرب أطراف حصر في متغيّر: اقلب إشارة x أوّلا ليصير الحصران موجبين',
        etapes: [
          ['قاعدة عامّة',
           'لا نضرب أطراف حصر في متغيّر؛ نضرب حصرين اثنين أطرافهما موجبة'],
          ['نضرب حصر x في -1 فينقلب الترتيب', '2 ≤ -x ≤ 3'],
          ['حصر y كما هو', '2 ≤ y ≤ 4'],
          ['الحصران موجبان الآن: نضربهما طرفا بطرف', '4 ≤ (-x) y ≤ 12'],
          ['نضرب في -1 فينقلب الترتيب', '-12 ≤ x y ≤ -4'],
          ['نلاحظ', 'الجداء سالب، و هذا طبيعي: x سالب و y موجب']
        ],
        controle: { dans: domaines, vrai: ['-12 ≤ x y ≤ -4'] }
      },
      {
        enonce: pose.concat(['أوجد حصرا للعبارة 3x - 2y']),
        indice: 'الضرب في 3 يحفظ الترتيب، و الضرب في -2 يقلبه',
        etapes: [
          ['ننطلق من حصر x', '-3 ≤ x ≤ -2'],
          ['نضرب في 3 فيبقى الترتيب', '-9 ≤ 3x ≤ -6'],
          ['ننطلق من حصر y', '2 ≤ y ≤ 4'],
          ['نضرب في -2 فينقلب الترتيب', '-8 ≤ -2y ≤ -4'],
          ['نجمع الحصرين', '-17 ≤ 3x - 2y ≤ -10'],
          ['نلاحظ', 'العبارة سالبة تماما، و هذا ما سيرفع القيمة المطلقة لاحقا']
        ],
        controle: { dans: domaines, vrai: ['-17 ≤ 3x - 2y ≤ -10'] }
      },
      {
        enonce: pose.concat(['أوجد حصرا للكسر (x - 2)/y']),
        indice: 'نفس القاعدة: اقلب إشارة البسط ليصير الحصران موجبين قبل الضرب',
        etapes: [
          ['نطرح 2 من حصر x', '-5 ≤ x - 2 ≤ -4'],
          ['نضرب في -1 فينقلب الترتيب', '4 ≤ -(x - 2) ≤ 5'],
          ['نقلب حصر y فينقلب الترتيب', '1/4 ≤ 1/y ≤ 1/2'],
          ['الحصران موجبان: نضربهما طرفا بطرف', '1 ≤ -(x - 2)/y ≤ 5/2'],
          ['نضرب في -1 فينقلب الترتيب', '-5/2 ≤ (x - 2)/y ≤ -1']
        ],
        controle: { dans: domaines, vrai: ['-5/2 ≤ (x - 2)/y ≤ -1'] }
      },
      {
        enonce: pose.concat(['استنتج اختصارا للعبارة:', 'A = ' + exprA]),
        indice: 'العبارة 3x - 2y سالبة حسب السؤال السابق، و x سالب و y موجب',
        etapes: [
          ['نستعمل حصر السؤال السابق', '3x - 2y ≤ -10'],
          ['نرفع القيمة المطلقة الأولى', '|3x - 2y| = 2y - 3x'],
          ['العدد y موجب', '|y| = y'],
          ['العدد x سالب', '|x| = -x'],
          ['نعوّض في A', 'A = x(2y - 3x) + 2y × (-x)'],
          ['ننشر القوس', 'x(2y - 3x) = 2x y - 3x^2'],
          ['نجمع فيتلاشى الحدّان في x y', '2x y - 3x^2 - 2x y = -3x^2'],
          ['النتيجة', 'A = -3x^2']
        ],
        controle: { dans: domaines, derives: { A: exprA },
                    claims: [['A', '-3x^2']] }
      },
      {
        enonce: posE.concat(['أكتب كلاًّ من E و F و H في صيغة مجالات ثمّ مثّلها على نفس المستقيم المدرّج']),
        indice: 'شرط H قيمة مطلقة: |x| < √17 يعني -√17 < x < √17',
        etapes: [
          ['شرط E حصر مباشر', 'E = [-2 ; 2['],
          ['شرط F حصر من جهة واحدة', 'F = ]-∞ ; 2]'],
          ['نفكّ القيمة المطلقة في شرط H', '-√17 < x < √17'],
          ['المجال الثالث', 'H = ]-√17 ; √17['],
          ['نوقّع √17 على المدرّج', '4 < √17 < 5']
        ],
        controle: { ens, conditions, dans: { x: 'H' },
                    egaux: [['E', '[-2 ; 2['], ['F', ']-∞ ; 2]'],
                            ['H', ']-√17 ; √17[']] }
      },
      {
        enonce: posE.concat(['حدّد المجموعة:', 'E ∩ Z']),
        indice: 'الأعداد الصحيحة من -2 إلى 2، مع الانتباه إلى القوس المفتوح',
        etapes: [
          ['المجال', 'E = [-2 ; 2['],
          ['الحدّ الأدنى مأخوذ', '-2 ∈ E'],
          ['الحدّ الأعلى غير مأخوذ', 'العدد 2 لا ينتمي إلى E لأنّ القوس مفتوح عنده'],
          ['آخر عدد صحيح في المجال', '1 ∈ E'],
          ['النتيجة', 'E ∩ Z = {-2 ; -1 ; 0 ; 1}']
        ],
        controle: { ens, entiers: [['E', [-2, -1, 0, 1]]] }
      },
      {
        enonce: posE.concat(['حدّد المجموعة:', 'H ∪ IR+']),
        indice: 'المجموعة IR+ هي المجال [0 ; +∞[، و هي تلتقي H في 0',
        etapes: [
          ['المجال الأوّل', 'H = ]-√17 ; √17['],
          ['المجال الثاني', 'IR+ = [0 ; +∞['],
          ['المجالان يتقاطعان', '0 < √17'],
          ['الاتّحاد يبدأ من بداية H', 'الحدّ -√17 غير مأخوذ، فالقوس يبقى مفتوحا'],
          ['النتيجة', 'H ∪ IR+ = ]-√17 ; +∞[']
        ],
        controle: { ens, egaux: [['H ∪ IR+', ']-√17 ; +∞[']] }
      },
      {
        enonce: posE.concat(['حدّد المجموعة:', 'E ∩ F']),
        indice: 'كل عدد من E أصغر من 2، إذن هو في F: التقاطع هو E نفسه',
        etapes: [
          ['المجال الأوّل', 'E = [-2 ; 2['],
          ['المجال الثاني', 'F = ]-∞ ; 2]'],
          ['البداية', 'المجال F مفتوح إلى -∞، فتبقى بداية E هي البداية'],
          ['النهاية', 'الحدّ 2 مفتوح في E و مغلق في F، فيبقى مفتوحا'],
          ['النتيجة', 'E ∩ F = [-2 ; 2[']
        ],
        controle: { ens, egaux: [['E ∩ F', '[-2 ; 2[']] }
      },
      {
        enonce: posE.concat(['بيّن أنّ مربّع كل عدد ينتمي إلى E هو عدد ينتمي إلى H']),
        indice: 'أكبر مربّع هو 4، و 4 < √17 لأنّ 16 < 17',
        etapes: [
          ['ننطلق من انتماء x إلى E', '-2 ≤ x < 2'],
          ['نحصر المربّع', '0 ≤ x^2 ≤ 4'],
          ['نقارن 4 بـ √17', '16 < 17'],
          ['نستنتج', '4 < √17'],
          ['المربّع أصغر من √17', 'x^2 < √17'],
          ['و هو أكبر من -√17 لأنّه موجب', '-√17 < x^2'],
          ['النتيجة', 'x^2 ∈ H']
        ],
        controle: { ens, dans: { x: 'E' }, vrai: ['x^2 < √17'] }
      }
    ];
  }

  // =========================================================================
  // التمرين 11 — sept questions, toutes accrochées à la même expression.
  //
  //   E = (2x + 2)² - 9 est une différence de deux carrés, et c'est la clé de
  //   toute la page : la forme factorisée (2x - 1)(2x + 5) résout l'équation
  //   de la question 2)ب, la forme développée 4x² + 8x - 5 résout la
  //   MÉTRAJIHA de la question 3)أ, et E + 9 = (2x + 2)² fait tomber le
  //   radical de la question 3)د.
  //
  //   La question 3)د a pour solutions DEUX morceaux disjoints. On ne peut pas
  //   les recoller en un majal — d'où les deux majals S1 et S2, et le contrôle
  //   `resolutions`, qui accepte une liste.
  // =========================================================================
  function exercice11() {
    const exprE = '(2x + 2)^2 - 9';
    const R = ']-∞ ; +∞[';
    const pose = ['نعتبر العبارة التالية، حيث x عدد حقيقي:', 'E = ' + exprE];

    return [
      {
        enonce: pose.concat(['أنشر و اختصر العبارة E']),
        indice: 'انشر مربّع المجموع (2x + 2)^2 ثمّ اطرح 9',
        etapes: [
          ['المتطابقة المستعملة',
           'مربّع مجموع: مربّع الأوّل، زائد ضعف الجداء، زائد مربّع الثاني'],
          ['نحسب مربّعي الحدّين', '(2x)^2 + 2^2 = 4x^2 + 4'],
          ['نحسب ضعف الجداء', '2 × 2x × 2 = 8x'],
          ['ننشر المربّع', '(2x + 2)^2 = 4x^2 + 8x + 4'],
          ['نطرح 9', 'E = 4x^2 + 8x - 5']
        ],
        controle: { dans: { x: R }, derives: { E: exprE },
                    claims: [['E', '4x^2 + 8x - 5']] }
      },
      {
        enonce: pose.concat(['بيّن أنّ:', 'E = (2x - 1)(2x + 5)']),
        indice: 'العدد 9 هو 3^2: العبارة E فرق مربّعين',
        etapes: [
          ['نتعرّف على فرق مربّعين', 'E = (2x + 2)^2 - 3^2'],
          ['نستعمل المتطابقة',
           '(2x + 2)^2 - 3^2 = ((2x + 2) - 3)((2x + 2) + 3)'],
          ['نبسّط القوس الأوّل', '(2x + 2) - 3 = 2x - 1'],
          ['نبسّط القوس الثاني', '(2x + 2) + 3 = 2x + 5'],
          ['النتيجة', 'E = (2x - 1)(2x + 5)']
        ],
        controle: { dans: { x: R }, derives: { E: exprE },
                    claims: [['E', '(2x - 1)(2x + 5)']] }
      },
      {
        enonce: pose.concat(['حلّ في IR المعادلة التالية: 4(x + 1)^2 = 9']),
        indice: 'لاحظ أنّ 4(x + 1)^2 = (2x + 2)^2: المعادلة تعني E = 0',
        etapes: [
          ['نتعرّف على العبارة', '4(x + 1)^2 = (2x + 2)^2'],
          ['المعادلة تعني إذن', 'العبارة E معدومة'],
          ['نستعمل الشكل المفكّك', '4(x + 1)^2 - 9 = (2x - 1)(2x + 5)'],
          ['جداء معدوم', 'يعني 2x - 1 = 0 أو 2x + 5 = 0'],
          ['نتحقّق من الحلّ الأوّل', '4(1/2 + 1)^2 = 9'],
          ['نتحقّق من الحلّ الثاني', '4(-5/2 + 1)^2 = 9'],
          ['مجموعة الحلول', 'كل من 1/2 و -5/2']
        ],
        controle: {
          // L'ÉQUATION n'est pas une affirmation : c'est la question. Elle est
          // donc écrite dans une ligne rédigée, et c'est `resolutions` qui en
          // répond — sur toute une grille, pas au seul point choisi. Les
          // étapes, elles, sont des identités : on les éprouve sur tout ℝ.
          dans: { x: R }, derives: { E: exprE },
          resolutions: [{ cond: '4(x + 1)^2 = 9', valeurs: ['1/2', '-5/2'] }],
          claims: [['4(x + 1)^2 - 9', '(2x - 1)(2x + 5)']]
        }
      },
      {
        enonce: pose.concat(['حلّ في IR:', 'E ≤ 4x^2 + 1']),
        indice: 'استعمل الشكل المنشور: الحدّ في x^2 يتلاشى من الطرفين',
        etapes: [
          ['نستعمل الشكل المنشور', 'E = 4x^2 + 8x - 5'],
          ['نكتب المتراجحة', '4x^2 + 8x - 5 ≤ 4x^2 + 1'],
          ['يتلاشى الحدّ في x^2', '8x - 5 ≤ 1'],
          ['ننقل الحدّ الثابت', '8x ≤ 6'],
          ['نقسم على 8 الموجب', 'x ≤ 3/4'],
          ['مجموعة الحلول', 'S = ]-∞ ; 3/4]']
        ],
        controle: {
          ens: { S: ']-∞ ; 3/4]' }, dans: { x: ']-∞ ; 3/4]' },
          derives: { E: exprE },
          resolutions: [{ cond: 'E ≤ 4x^2 + 1', majals: [']-∞ ; 3/4]'] }],
          egaux: [['S', ']-∞ ; 3/4]']]
        }
      },
      {
        enonce: pose.concat(['حلّ في IR:', '5 - 2|x - 3| ≥ 1']),
        indice: 'اعزل القيمة المطلقة: القسمة على -2 تقلب الترتيب',
        etapes: [
          ['نعزل القيمة المطلقة', '-2|x - 3| ≥ -4'],
          ['نقسم على -2 فينقلب الترتيب', '|x - 3| ≤ 2'],
          ['نفكّ القيمة المطلقة', '-2 ≤ x - 3 ≤ 2'],
          ['نضيف 3 إلى الأطراف', '1 ≤ x ≤ 5'],
          ['مجموعة الحلول', 'S = [1 ; 5]']
        ],
        controle: {
          ens: { S: '[1 ; 5]' }, dans: { x: '[1 ; 5]' }, derives: { E: exprE },
          resolutions: [{ cond: '5 - 2|x - 3| ≥ 1', majals: ['[1 ; 5]'] }],
          egaux: [['S', '[1 ; 5]']]
        }
      },
      {
        enonce: pose.concat(['حلّ في IR ما يلي: |x^2 - 4| - |x - 2| = 0']),
        indice: 'فكّك x^2 - 4، ثمّ لاحظ أنّ |x - 2| عامل مشترك',
        etapes: [
          ['نفكّك ما تحت القيمة المطلقة الأولى', 'x^2 - 4 = (x - 2)(x + 2)'],
          ['قيمة مطلقة لجداء', '|x^2 - 4| = |x - 2| |x + 2|'],
          ['نضع |x - 2| عاملا مشتركا',
           '|x^2 - 4| - |x - 2| = |x - 2|(|x + 2| - 1)'],
          ['جداء معدوم', 'يعني |x - 2| = 0 أو |x + 2| = 1'],
          ['نتحقّق من الحلّ الأوّل', '|2^2 - 4| - |2 - 2| = 0'],
          ['نتحقّق من الحلّ الثاني', '|(-1)^2 - 4| - |-1 - 2| = 0'],
          ['نتحقّق من الحلّ الثالث', '|(-3)^2 - 4| - |-3 - 2| = 0']
        ],
        controle: {
          dans: { x: R }, derives: { E: exprE },
          resolutions: [{ cond: '|x^2 - 4| - |x - 2| = 0',
                          valeurs: ['2', '-1', '-3'] }],
          claims: [['|x^2 - 4| - |x - 2|', '|x - 2|(|x + 2| - 1)']]
        }
      },
      {
        enonce: pose.concat(['حلّ في IR:', '√(E + 9) ≥ 5']),
        indice: 'لاحظ أنّ E + 9 = (2x + 2)^2، و أنّ √(t^2) = |t|',
        etapes: [
          ['نحسب ما تحت الجذر', 'E + 9 = (2x + 2)^2'],
          ['قاعدة الجذر', '√((2x + 2)^2) = |2x + 2|'],
          ['المتراجحة تصير', '|2x + 2| ≥ 5'],
          ['نفكّ القيمة المطلقة', 'يعني 2x + 2 ≥ 5 أو 2x + 2 ≤ -5'],
          ['الحالة الأولى', 'x ≥ 3/2'],
          ['نتحقّق من الحالة الثانية عند -7/2', '|2 × (-7/2) + 2| = 5'],
          ['المجال الأوّل من الحلول', 'S1 = [3/2 ; +∞['],
          ['المجال الثاني من الحلول', 'S2 = ]-∞ ; -7/2]']
        ],
        controle: {
          ens: { S1: '[3/2 ; +∞[', S2: ']-∞ ; -7/2]' },
          dans: { x: '[3/2 ; +∞[' }, derives: { E: exprE },
          resolutions: [{ cond: '√(E + 9) ≥ 5',
                          majals: [']-∞ ; -7/2]', '[3/2 ; +∞['] }],
          egaux: [['S1', '[3/2 ; +∞['], ['S2', ']-∞ ; -7/2]']]
        }
      }
    ];
  }

  // =========================================================================
  // التمرين 12 — deux équations, puis un encadrement en quatre temps.
  //
  //   La partie II marche à l'envers des autres : ce n'est pas x qui est donné
  //   mais A = -x - 3, et c'est l'encadrement de A qui donne celui de x. Une
  //   multiplication par -1 renverse l'ordre au passage.
  // =========================================================================
  function exercice12() {
    const exprB = 'x/(x - 3)';
    const domaine = ']-2 ; 1[';
    const poseII = ['ليكن x عددا حقيقيا. نعتبر العبارتين:', 'A = -x - 3',
                    'B = ' + exprB, 'بحيث:', '-4 < A < -1'];

    return [
      {
        enonce: ['حلّ في ℝ المعادلة التالية:', '√2x - 3 = x - 1'],
        indice: 'اجمع حدود x في طرف واحد ثمّ ضع x عاملا مشتركا',
        etapes: [
          ['ننقل الحدود', '√2x - x = 3 - 1'],
          ['نضع x عاملا مشتركا', 'x(√2 - 1) = 2'],
          ['نقسم على (√2 - 1)', 'x = 2/(√2 - 1)'],
          ['نُنطق المقام', '2/(√2 - 1) = 2(√2 + 1)'],
          ['ننشر', 'x = 2√2 + 2'],
          ['نتحقّق', '√2(2√2 + 2) - 3 = (2√2 + 2) - 1']
        ],
        controle: {
          env: { x: '2√2 + 2' },
          resolutions: [{ cond: '√2x - 3 = x - 1', valeurs: ['2√2 + 2'] }],
          claims: [['√2x - 3', 'x - 1']]
        }
      },
      {
        enonce: ['حلّ في ℝ المعادلة التالية: 2x^2 - 8 + (x - 2)(3x - 5) = 0'],
        indice: 'لاحظ أنّ 2x^2 - 8 = 2(x - 2)(x + 2): القوس (x - 2) مشترك',
        etapes: [
          ['نفكّك الحدّين الأوّلين', '2x^2 - 8 = 2(x - 2)(x + 2)'],
          ['نضع (x - 2) عاملا مشتركا',
           '2(x - 2)(x + 2) + (x - 2)(3x - 5) = (x - 2)(2(x + 2) + 3x - 5)'],
          ['نختصر القوس الثاني', '2(x + 2) + 3x - 5 = 5x - 1'],
          ['جداء معدوم', 'يعني x - 2 = 0 أو 5x - 1 = 0'],
          ['نتحقّق من الحلّ الأوّل', '2 × 2^2 - 8 + (2 - 2)(3 × 2 - 5) = 0'],
          ['نتحقّق من الحلّ الثاني',
           '2(1/5)^2 - 8 + (1/5 - 2)(3 × 1/5 - 5) = 0']
        ],
        controle: {
          dans: { x: ']-∞ ; +∞[' },
          resolutions: [{ cond: '2x^2 - 8 + (x - 2)(3x - 5) = 0',
                          valeurs: ['2', '1/5'] }],
          claims: [['2x^2 - 8 + (x - 2)(3x - 5)', '(x - 2)(5x - 1)']]
        }
      },
      {
        enonce: poseII.concat(['بيّن أنّ:', 'x ∈ ]-2 ; 1[']),
        indice: 'عوّض A بـ -x - 3 في الحصر، ثمّ اضرب في -1: الترتيب ينقلب',
        etapes: [
          ['نعوّض A بقيمتها', '-4 < -x - 3 < -1'],
          ['نضيف 3 إلى الأطراف', '-1 < -x < 2'],
          ['نضرب في -1 فينقلب الترتيب', '1 > x > -2'],
          ['نرتّب تصاعديا', '-2 < x < 1'],
          ['النتيجة', 'x ∈ ]-2 ; 1[']
        ],
        controle: { dans: { x: domaine }, derives: { A: '-x - 3', B: exprB },
                    vrai: ['-2 < x < 1'] }
      },
      {
        enonce: poseII.concat(['بيّن أنّ:', 'x - 3 ≠ 0']),
        indice: 'اطرح 3 من أطراف حصر x: الحدّ الأعلى يصير -2',
        etapes: [
          ['ننطلق من حصر x', '-2 < x < 1'],
          ['نطرح 3 من الأطراف', '-5 < x - 3 < -2'],
          ['الحدّ الأعلى سالب', 'x - 3 < -2'],
          ['نستنتج', 'x - 3 < 0'],
          ['النتيجة', 'العدد x - 3 سالب تماما، إذن لا ينعدم فالكسر B معرّف']
        ],
        controle: { dans: { x: domaine }, derives: { A: '-x - 3', B: exprB },
                    vrai: ['x - 3 < 0'] }
      },
      {
        enonce: poseII.concat(['بيّن أنّ:', 'B = 1 + 3/(x - 3)']),
        indice: 'أكتب البسط x في صورة (x - 3) + 3 ثمّ شقّ الكسر',
        etapes: [
          ['نكتب البسط بدلالة المقام', 'x = (x - 3) + 3'],
          ['نشقّ الكسر',
           '((x - 3) + 3)/(x - 3) = (x - 3)/(x - 3) + 3/(x - 3)'],
          ['نبسّط الحدّ الأوّل', '(x - 3)/(x - 3) = 1'],
          ['النتيجة', 'B = 1 + 3/(x - 3)']
        ],
        controle: { dans: { x: domaine }, derives: { A: '-x - 3', B: exprB },
                    claims: [['B', '1 + 3/(x - 3)']] }
      },
      {
        enonce: poseII.concat(['استنتج حصرا للعبارة B']),
        indice: 'المقام سالب: أخذ المقلوب يقلب الترتيب',
        etapes: [
          ['ننطلق من حصر المقام', '-5 < x - 3 < -2'],
          ['نأخذ المقلوب فينقلب الترتيب', '-1/2 < 1/(x - 3) < -1/5'],
          ['نضرب في 3', '-3/2 < 3/(x - 3) < -3/5'],
          ['نضيف 1 إلى الأطراف', '-1/2 < 1 + 3/(x - 3) < 2/5'],
          ['النتيجة', '-1/2 < B < 2/5']
        ],
        controle: { dans: { x: domaine }, derives: { A: '-x - 3', B: exprB },
                    vrai: ['-1/2 < B < 2/5'] }
      }
    ];
  }

  // =========================================================================
  // التمرين 13 — deux équations, puis l'encadrement de A = (2x + 5)/(x + 1).
  //
  //   La première équation est une SURPRISE : tout s'annule, il reste t = t,
  //   et l'ensemble des solutions est ℝ tout entier. C'est un cas que l'élève
  //   ne rencontre pas souvent, et qu'il confond volontiers avec « pas de
  //   solution » — d'où la chaîne, qui l'oblige à voir l'identité.
  // =========================================================================
  function exercice13() {
    const exprA = '(2x + 5)/(x + 1)';
    const domaine = '[-3 ; -2]';
    const poseII = ['نعتبر العبارة:', 'A = ' + exprA, 'بحيث:', 'x ∈ [-3 ; -2]'];

    return [
      {
        enonce: ['حلّ في ℝ المعادلة التالية:', '√2(√2t - 1) - (t - √2) = t'],
        indice: 'انشر القوسين: كل الحدود في √2 تتلاشى',
        etapes: [
          ['ننشر القوس الأوّل', '√2(√2t - 1) = 2t - √2'],
          ['نرفع القوس الثاني', '-(t - √2) = -t + √2'],
          ['نجمع الطرف الأيمن', '2t - √2 - t + √2 = t'],
          ['المعادلة تصير', 't = t'],
          ['كل عدد يحقّقها', 'المتساوية صحيحة مهما يكن العدد t'],
          ['مجموعة الحلول', 'S = ]-∞ ; +∞[']
        ],
        controle: {
          ens: { S: ']-∞ ; +∞[' }, dans: { t: ']-∞ ; +∞[' },
          resolutions: [{ variable: 't', cond: '√2(√2t - 1) - (t - √2) = t',
                          majals: [']-∞ ; +∞['] }],
          egaux: [['S', ']-∞ ; +∞[']]
        }
      },
      {
        enonce: ['حلّ في ℝ المعادلة التالية: (t + 1)^2 - 4 = 0'],
        indice: 'العدد 4 هو 2^2: المعادلة فرق مربّعين',
        etapes: [
          ['نتعرّف على فرق مربّعين', '(t + 1)^2 - 4 = (t + 1)^2 - 2^2'],
          ['نستعمل المتطابقة', '(t + 1)^2 - 2^2 = (t - 1)(t + 3)'],
          ['جداء معدوم', 'يعني t - 1 = 0 أو t + 3 = 0'],
          ['نتحقّق من الحلّ الأوّل', '(1 + 1)^2 - 4 = 0'],
          ['نتحقّق من الحلّ الثاني', '(-3 + 1)^2 - 4 = 0']
        ],
        controle: {
          dans: { t: ']-∞ ; +∞[' },
          resolutions: [{ variable: 't', cond: '(t + 1)^2 - 4 = 0',
                          valeurs: ['1', '-3'] }],
          claims: [['(t + 1)^2 - 4', '(t - 1)(t + 3)']]
        }
      },
      {
        enonce: poseII.concat(['بيّن أنّ:', 'x + 1 ≠ 0']),
        indice: 'أضف 1 إلى أطراف حصر x: الحدّ الأعلى يصير -1',
        etapes: [
          ['ننطلق من حصر x', '-3 ≤ x ≤ -2'],
          ['نضيف 1 إلى الأطراف', '-2 ≤ x + 1 ≤ -1'],
          ['الحدّ الأعلى سالب', 'x + 1 ≤ -1'],
          ['نستنتج', 'x + 1 < 0'],
          ['النتيجة', 'العدد x + 1 سالب تماما، إذن لا ينعدم']
        ],
        controle: { dans: { x: domaine }, derives: { A: exprA },
                    vrai: ['x + 1 < 0'] }
      },
      {
        enonce: poseII.concat(['أوجد حصرا للكسر 1/(x + 1)']),
        indice: 'المقام سالب: أخذ المقلوب يقلب الترتيب',
        etapes: [
          ['ننطلق من حصر المقام', '-2 ≤ x + 1 ≤ -1'],
          ['المقام سالب: المقلوب يقلب الترتيب', '-1 ≤ 1/(x + 1) ≤ -1/2'],
          ['نتحقّق من الحدّ الأدنى', '1/(-1) = -1'],
          ['نتحقّق من الحدّ الأعلى', '1/(-2) = -1/2'],
          ['النتيجة', 'الكسر 1/(x + 1) محصور بين -1 و -1/2']
        ],
        controle: { dans: { x: domaine }, derives: { A: exprA },
                    vrai: ['-1 ≤ 1/(x + 1) ≤ -1/2'] }
      },
      {
        enonce: poseII.concat(['بيّن أنّ:', 'A - 2 = 3/(x + 1)']),
        indice: 'أكتب 2 في صورة كسر مقامه x + 1 ثمّ اطرح',
        etapes: [
          ['نكتب 2 في صورة كسر', '2 = 2(x + 1)/(x + 1)'],
          ['نطرح الكسرين', 'A - 2 = (2x + 5 - 2(x + 1))/(x + 1)'],
          ['ننشر البسط', '2x + 5 - 2(x + 1) = 3'],
          ['النتيجة', 'A - 2 = 3/(x + 1)']
        ],
        controle: { dans: { x: domaine }, derives: { A: exprA },
                    claims: [['A - 2', '3/(x + 1)']] }
      },
      {
        enonce: poseII.concat(['استنتج حصرا للعبارة A']),
        indice: 'اضرب حصر المقلوب في 3، ثمّ أضف 2 حسب السؤال السابق',
        etapes: [
          ['ننطلق من حصر المقلوب', '-1 ≤ 1/(x + 1) ≤ -1/2'],
          ['نضرب في 3 الموجب', '-3 ≤ 3/(x + 1) ≤ -3/2'],
          ['نستعمل السؤال السابق', 'A - 2 = 3/(x + 1)'],
          ['نضيف 2 إلى الأطراف', '-1 ≤ A ≤ 1/2'],
          ['النتيجة', 'العبارة A محصورة بين -1 و 1/2']
        ],
        controle: { dans: { x: domaine }, derives: { A: exprA },
                    vrai: ['-1 ≤ A ≤ 1/2'] }
      }
    ];
  }

  const API = { exercice1, exercice2, exercice3, exercice10,
                exercice11, exercice12, exercice13 };
  if (M) module.exports = API; else racine.Encadrement = API;
})(typeof window !== 'undefined' ? window : globalThis);
