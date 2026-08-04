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
        controle: { ens, entiers: [{ dans: 'E', liste: [-2, -1, 0, 1] }] }
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

  // =========================================================================
  // التمرين 15 — sept volets sur A = x² - x + 1/2.
  //
  //   La forme canonique A = (x - 1/2)² + 1/4 est le pivot : elle résout
  //   l'équation de 2)ب et donne l'encadrement de 2)ج, que la forme
  //   développée ne donnerait pas.
  //
  //   Noter que les racines de A = 5/2 — 2 et -1 — sont HORS de ]0 ; 1[. Ce
  //   n'est pas une incohérence de la fiche : la question dit « حل في ℝ ».
  //   Une étape le dit, sans quoi l'élève croirait 2)ب et 2)ج contradictoires.
  // =========================================================================
  function exercice15() {
    const exprA = 'x^2 - x + 1/2';
    const exprB = '2x^2 - 3';
    const domaine = ']0 ; 1[';
    const pose = ['ليكن x عددا حقيقيا و العبارة:', 'A = ' + exprA];
    const poseII = pose.concat(['إذا علمت أنّ:', 'x ∈ ]0 ; 1[']);

    return [
      {
        enonce: pose.concat(['بيّن أنّ A = 5/2 + √2 في حالة:', 'x = √2 + 1']),
        indice: 'انشر (√2 + 1)^2 = 3 + 2√2 ثمّ اطرح x',
        etapes: [
          ['ننشر المربّع', '(√2 + 1)^2 = 3 + 2√2'],
          ['نطرح x', '3 + 2√2 - (√2 + 1) = 2 + √2'],
          ['نضيف 1/2', '2 + √2 + 1/2 = 5/2 + √2'],
          ['النتيجة', 'A = 5/2 + √2']
        ],
        controle: { env: { x: '√2 + 1', A: exprA },
                    claims: [['A', '5/2 + √2']] }
      },
      {
        enonce: pose.concat(['في حالة x = √2 + 1، قارن A و 4']),
        indice: 'قارن √2 بـ 3/2: يكفي مقارنة 2 و 9/4',
        etapes: [
          ['نقارن المربّعين', '2 < 9/4'],
          ['نأخذ الجذرين', '√2 < 3/2'],
          ['نضيف 5/2 إلى الطرفين', '5/2 + √2 < 4'],
          ['النتيجة', 'A < 4']
        ],
        controle: { env: { x: '√2 + 1', A: exprA }, vrai: ['A < 4'] }
      },
      {
        enonce: poseII.concat(['بيّن أنّ:', 'A = (x - 1/2)^2 + 1/4']),
        indice: 'انشر (x - 1/2)^2 = x^2 - x + 1/4 ثمّ أضف 1/4',
        etapes: [
          ['ننشر المربّع', '(x - 1/2)^2 = x^2 - x + 1/4'],
          ['نضيف 1/4', 'x^2 - x + 1/4 + 1/4 = x^2 - x + 1/2'],
          ['نتعرّف على A', 'x^2 - x + 1/2 = A'],
          ['النتيجة', 'A = (x - 1/2)^2 + 1/4']
        ],
        controle: { dans: { x: domaine }, derives: { A: exprA },
                    claims: [['A', '(x - 1/2)^2 + 1/4']] }
      },
      {
        enonce: poseII.concat(['حلّ في ℝ المعادلة: A = 5/2']),
        indice: 'استعمل الشكل النموذجي: (x - 1/2)^2 = 9/4',
        etapes: [
          ['نستعمل الشكل النموذجي', 'A - 1/4 = (x - 1/2)^2'],
          ['المعادلة تعطي', 'يعني (x - 1/2)^2 = 5/2 - 1/4 = 9/4'],
          ['نفكّ المربّع', 'يعني x - 1/2 = 3/2 أو x - 1/2 = -3/2'],
          ['نتحقّق من الحلّ الأوّل', '2^2 - 2 + 1/2 = 5/2'],
          ['نتحقّق من الحلّ الثاني', '(-1)^2 - (-1) + 1/2 = 5/2'],
          ['ملاحظة', 'الحلاّن 2 و -1 خارج المجال ]0 ; 1[، و المعادلة مطروحة في ℝ']
        ],
        controle: {
          // Le tirage reste dans ]0 ; 1[, que l'énoncé pose ; les étapes y sont
          // des identités. L'ensemble des SOLUTIONS, lui, est cherché dans ℝ
          // par `resolutions` — et ses deux racines tombent hors de ]0 ; 1[,
          // ce que la dernière étape dit à l'élève.
          dans: { x: domaine }, derives: { A: exprA },
          resolutions: [{ cond: 'A = 5/2', valeurs: ['2', '-1'] }],
          claims: [['A - 1/4', '(x - 1/2)^2']]
        }
      },
      {
        enonce: poseII.concat(['استنتج حصرا للعبارة A']),
        indice: 'احصر x - 1/2: أطرافه متقابلة، فمربّعه بين 0 و 1/4',
        etapes: [
          ['ننطلق من حصر x', '0 < x < 1'],
          ['نطرح 1/2 من الأطراف', '-1/2 < x - 1/2 < 1/2'],
          ['المربّع موجب و أصغر من 1/4', '0 ≤ (x - 1/2)^2 < 1/4'],
          ['نضيف 1/4 إلى الأطراف', '1/4 ≤ (x - 1/2)^2 + 1/4 < 1/2'],
          ['النتيجة', '1/4 ≤ A < 1/2']
        ],
        controle: { dans: { x: domaine }, derives: { A: exprA },
                    vrai: ['1/4 ≤ A < 1/2'] }
      },
      {
        enonce: poseII.concat(['لتكن العبارة:', 'B = ' + exprB,
                               'أوجد حصرا للعبارة B']),
        indice: 'أطراف حصر x موجبة، فالتربيع يحفظ الترتيب',
        etapes: [
          ['ننطلق من حصر x', '0 < x < 1'],
          ['الأطراف موجبة: نربّع', '0 < x^2 < 1'],
          ['نضرب في 2 الموجب', '0 < 2x^2 < 2'],
          ['نطرح 3 من الأطراف', '-3 < 2x^2 - 3 < -1'],
          ['النتيجة', '-3 < B < -1']
        ],
        controle: { dans: { x: domaine }, derives: { A: exprA, B: exprB },
                    vrai: ['-3 < B < -1'] }
      },
      {
        enonce: poseII.concat(['لتكن العبارة:', 'B = ' + exprB,
                               'استنتج أنّ:', '-3/2 < A × B < -1/4']),
        indice: 'لا نضرب حصرين إلاّ إذا كانت أطرافهما موجبة: اقلب إشارة B أوّلا',
        etapes: [
          ['حصر A', '1/4 ≤ A < 1/2'],
          ['حصر B', '-3 < B < -1'],
          ['نضرب حصر B في -1 فينقلب الترتيب', '1 < -B < 3'],
          ['الحصران موجبان: نضربهما طرفا بطرف', '1/4 < A × (-B) < 3/2'],
          ['نضرب في -1 فينقلب الترتيب', '-3/2 < A × B < -1/4']
        ],
        controle: { dans: { x: domaine }, derives: { A: exprA, B: exprB },
                    vrai: ['-3/2 < A × B < -1/4'] }
      }
    ];
  }

  // =========================================================================
  // التمرين 16 — quatre volets.
  //
  //   I ∩ ℤ est INFINI : tous les entiers strictement négatifs. Le validateur
  //   ne peut pas en dresser la liste, il en contrôle donc une FENÊTRE — et
  //   la fenêtre fait partie de ce qui est affirmé.
  //
  //   La question 3 est la plus fine : montrer que -2√2/3 est dans I ∩ J
  //   demande d'encadrer 2√2 des DEUX côtés, entre 3/2 et 3.
  // =========================================================================
  function exercice16() {
    const defI = 'I = {x ∈ IR ; x ≤ -1/2}';
    const defJ = 'J = {x ∈ IR ; |x + 1| < 2/3}';
    const ens = { I: ']-∞ ; -1/2]', J: ']-5/3 ; -1/3[' };
    const conditions = { I: 'x ≤ -1/2', J: '|x + 1| < 2/3' };
    const pose = ['نعتبر المجموعتين I و J التاليتين:', defI, defJ];

    return [
      {
        enonce: pose.concat(['أكتب I و J في صيغة مجالات']),
        indice: 'شرط J قيمة مطلقة: |x + 1| < 2/3 يعني -2/3 < x + 1 < 2/3',
        etapes: [
          ['شرط I حصر من جهة واحدة', 'I = ]-∞ ; -1/2]'],
          ['نفكّ القيمة المطلقة في شرط J', '-2/3 < x + 1 < 2/3'],
          ['نطرح 1 من الأطراف', '-5/3 < x < -1/3'],
          ['المجال الثاني', 'J = ]-5/3 ; -1/3[']
        ],
        controle: { ens, conditions, dans: { x: 'J' },
                    egaux: [['I', ']-∞ ; -1/2]'], ['J', ']-5/3 ; -1/3[']] }
      },
      {
        enonce: pose.concat(['حدّد المجموعة:', 'I ∩ J']),
        indice: 'المجال I مفتوح إلى -∞، فبداية التقاطع هي بداية J',
        etapes: [
          ['المجال الأوّل', 'I = ]-∞ ; -1/2]'],
          ['المجال الثاني', 'J = ]-5/3 ; -1/3['],
          ['نقارن النهايتين', '-1/2 < -1/3'],
          ['التقاطع: بداية J و نهاية I', 'I ∩ J = ]-5/3 ; -1/2]'],
          ['الحدّ -1/2 في I و هو في J', 'القوس مغلق عنده']
        ],
        controle: { ens, egaux: [['I ∩ J', ']-5/3 ; -1/2]']] }
      },
      {
        enonce: pose.concat(['حدّد المجموعة:', 'I ∩ Z']),
        indice: 'أكبر عدد صحيح لا يتجاوز -1/2 هو -1',
        etapes: [
          ['المجال', 'I = ]-∞ ; -1/2]'],
          ['أكبر عدد صحيح في المجال', '-1 ∈ I'],
          ['العدد 0 ليس في المجال', 'لأنّ 0 أكبر من -1/2'],
          ['و كل عدد صحيح سالب فيه', '-2 ∈ I'],
          ['النتيجة', 'I ∩ Z هي مجموعة الأعداد الصحيحة السالبة تماما']
        ],
        controle: { ens,
                    entiers: [{ dans: 'I', fenetre: [-6, 6],
                                liste: [-6, -5, -4, -3, -2, -1] }] }
      },
      {
        enonce: pose.concat(['بيّن أنّ:', '-2√2/3 ∈ I ∩ J']),
        indice: 'احصر 2√2 بين 3/2 و 3، ثمّ اقسم على -3: الترتيب ينقلب',
        etapes: [
          ['نقارن المربّعين', '8 < 9'],
          ['نأخذ الجذرين', '2√2 < 3'],
          ['نقسم على -3 فينقلب الترتيب', '-2√2/3 > -1'],
          ['و العدد -1 داخل المجال', '-5/3 < -1'],
          ['نقارن من الجهة الأخرى', '9/4 < 8'],
          ['نأخذ الجذرين', '3/2 < 2√2'],
          ['نقسم على -3 فينقلب الترتيب', '-2√2/3 < -1/2'],
          ['النتيجة', '-2√2/3 ∈ I ∩ J']
        ],
        controle: { ens, egaux: [['I ∩ J', ']-5/3 ; -1/2]']] }
      }
    ];
  }

  // =========================================================================
  // التمرين 17 — neuf volets, et un fil unique : E = 2x - √2.
  //
  //   Tout y passe par E. Le signe de 2x² - x√2 vient de celui de E ; F vaut
  //   E² + 5, ce qui transforme l'équation F = 9 en |E| = 2 et la métrajiha
  //   √(F - 5) > √2 en |E| > √2 ; et la valeur de E en x = √3 donne
  //   √(14 - 4√6) = 2√3 - √2 — un radical imbriqué que le noyau sait extraire.
  //
  //   La dernière question se résout dans ℤ : l'ensemble des solutions réelles
  //   est fait de deux morceaux, et les entiers qu'ils contiennent sont tous
  //   les entiers SAUF 0 et 1.
  // =========================================================================
  function exercice17() {
    const exprE = '2x - √2';
    const exprF = '4x^2 - 4√2x + 7';
    const R = ']-∞ ; +∞[';
    const domaine = '[1/6 ; 1/2]';
    const pose = ['نعتبر العبارة، حيث x عدد حقيقي:', 'E = ' + exprE,
                  'إذا علمت أنّ:', '|3x - 1| ≤ 1/2'];
    const poseF = ['نعتبر العبارتين، حيث x عدد حقيقي:', 'E = ' + exprE,
                   'F = ' + exprF];

    return [
      {
        enonce: pose.concat(['بيّن أنّ:', 'x ∈ [1/6 ; 1/2]']),
        indice: 'فكّ القيمة المطلقة ثمّ أضف 1 و اقسم على 3',
        etapes: [
          ['نفكّ القيمة المطلقة', '-1/2 ≤ 3x - 1 ≤ 1/2'],
          ['نضيف 1 إلى الأطراف', '1/2 ≤ 3x ≤ 3/2'],
          ['نقسم على 3 الموجب', '1/6 ≤ x ≤ 1/2'],
          ['النتيجة', 'x ∈ [1/6 ; 1/2]']
        ],
        controle: { dans: { x: domaine }, derives: { E: exprE },
                    vrai: ['|3x - 1| ≤ 1/2'] }
      },
      {
        enonce: pose.concat(['استنتج حصرا للعبارة E']),
        indice: 'اضرب حصر x في 2 ثمّ اطرح √2',
        etapes: [
          ['ننطلق من حصر x', '1/6 ≤ x ≤ 1/2'],
          ['نضرب في 2 الموجب', '1/3 ≤ 2x ≤ 1'],
          ['نطرح √2 من الأطراف', '1/3 - √2 ≤ E ≤ 1 - √2'],
          ['نقارن 1 بـ √2', '1 < √2'],
          ['النتيجة', 'E ≤ 1 - √2 < 0']
        ],
        controle: { dans: { x: domaine }, derives: { E: exprE },
                    vrai: ['1/3 - √2 ≤ E ≤ 1 - √2'] }
      },
      {
        enonce: pose.concat(['استنتج علامة العبارة:', '2x^2 - x√2']),
        indice: 'ضع x عاملا مشتركا: يظهر العامل E الذي عرفت إشارته',
        etapes: [
          ['نضع x عاملا مشتركا', '2x^2 - x√2 = x(2x - √2)'],
          ['العامل الأوّل موجب', 'x ≥ 1/6'],
          ['العامل الثاني سالب', '2x - √2 ≤ 1 - √2'],
          ['جداء موجب في سالب', '2x^2 - x√2 < 0'],
          ['النتيجة', 'العبارة 2x^2 - x√2 سالبة تماما']
        ],
        controle: { dans: { x: domaine }, derives: { E: exprE },
                    vrai: ['2x^2 - x√2 < 0'] }
      },
      {
        enonce: ['نعتبر العبارة، حيث x عدد حقيقي:', 'E = ' + exprE,
                 'حلّ في ℝ المعادلة: |2x^2 - x√2| = |√2 - 2x|'],
        indice: 'العاملان |2x - √2| مشتركان بين الطرفين',
        etapes: [
          ['نضع x عاملا مشتركا', '2x^2 - x√2 = x(2x - √2)'],
          ['قيمة مطلقة لجداء', '|2x^2 - x√2| = |x| |2x - √2|'],
          ['الطرف الأيسر', '|√2 - 2x| = |2x - √2|'],
          ['نضع |2x - √2| عاملا مشتركا',
           '|2x^2 - x√2| - |√2 - 2x| = |2x - √2|(|x| - 1)'],
          ['جداء معدوم', 'يعني 2x - √2 = 0 أو |x| = 1'],
          ['نتحقّق من الحلّ الأوّل',
           '|2(√2/2)^2 - (√2/2)√2| = |√2 - 2(√2/2)|'],
          ['نتحقّق من الحلّ الثاني', '|2 × 1^2 - 1 × √2| = |√2 - 2 × 1|'],
          ['نتحقّق من الحلّ الثالث', '|2(-1)^2 - (-1)√2| = |√2 - 2(-1)|']
        ],
        controle: {
          dans: { x: R }, derives: { E: exprE },
          resolutions: [{ cond: '|2x^2 - x√2| = |√2 - 2x|',
                          valeurs: ['√2/2', '1', '-1'] }],
          claims: [['|2x^2 - x√2| - |√2 - 2x|', '|2x - √2|(|x| - 1)']]
        }
      },
      {
        enonce: poseF.concat(['بيّن أنّ:', 'F = E^2 + 5']),
        indice: 'انشر (2x - √2)^2: تجد 4x^2 - 4√2x + 2',
        etapes: [
          ['نتعرّف على المربّع', 'F = (2x - √2)^2 + 5'],
          ['ننشر المربّع', '(2x - √2)^2 = 4x^2 - 4√2x + 2'],
          ['نضيف 5', '4x^2 - 4√2x + 2 + 5 = 4x^2 - 4√2x + 7'],
          ['نستعمل تعريف E', 'E = 2x - √2'],
          ['النتيجة', 'F = E^2 + 5']
        ],
        controle: { dans: { x: R }, derives: { E: exprE, F: exprF },
                    claims: [['F', 'E^2 + 5']] }
      },
      {
        enonce: poseF.concat(['أحسب F إذا علمت أنّ:', 'x = √3']),
        indice: 'أحسب E أوّلا، ثمّ ربّعه: يظهر الجداء 2 × 2√3 × √2 = 4√6',
        etapes: [
          ['نحسب E', 'E = 2√3 - √2'],
          ['نربّع', 'E^2 = 12 - 4√6 + 2'],
          ['نختصر', 'E^2 = 14 - 4√6'],
          ['نضيف 5', 'F = 14 - 4√6 + 5'],
          ['النتيجة', 'F = 19 - 4√6']
        ],
        controle: { env: { x: '√3', E: exprE, F: exprF },
                    claims: [['F', '19 - 4√6'], ['E^2', '14 - 4√6']] }
      },
      {
        enonce: poseF.concat(['استنتج حسابا للعدد:', '√(14 - 4√6)']),
        indice: 'العدد 14 - 4√6 هو E^2 عند x = √3، و √(t^2) = |t|',
        etapes: [
          ['نستعمل السؤال السابق', 'E^2 = 14 - 4√6'],
          ['قاعدة الجذر', '√(E^2) = |E|'],
          ['نقارن العددين', '√2 < 2√3'],
          ['نرفع القيمة المطلقة', '|2√3 - √2| = 2√3 - √2'],
          ['النتيجة', '√(14 - 4√6) = 2√3 - √2']
        ],
        controle: { env: { x: '√3', E: exprE, F: exprF },
                    claims: [['√(14 - 4√6)', '2√3 - √2']] }
      },
      {
        enonce: poseF.concat(['حلّ في ℝ المعادلة: F = 9']),
        indice: 'استعمل F = E^2 + 5: المعادلة تصير E^2 = 4',
        etapes: [
          ['نستعمل الشكل المختصر', 'F = E^2 + 5'],
          ['نعزل المربّع', 'F - 5 = E^2'],
          ['المعادلة تعطي', 'يعني E^2 = 4، أي E = 2 أو E = -2'],
          ['نتحقّق من الحلّ الأوّل',
           '4((2 + √2)/2)^2 - 4√2((2 + √2)/2) + 7 = 9'],
          ['نتحقّق من الحلّ الثاني',
           '4((√2 - 2)/2)^2 - 4√2((√2 - 2)/2) + 7 = 9']
        ],
        controle: {
          dans: { x: R }, derives: { E: exprE, F: exprF },
          resolutions: [{ cond: 'F = 9',
                          valeurs: ['(2 + √2)/2', '(√2 - 2)/2'] }],
          // La grille de `resolutions` est faite de rationnels : elle ne
          // rencontrerait jamais une racine irrationnelle OUBLIÉE. C'est
          // l'identité ci-dessous qui interdit d'en oublier une — un produit
          // de deux facteurs du premier degré n'a pas d'autre racine que les
          // deux qu'on annonce.
          claims: [['F', 'E^2 + 5'], ['F - 9', '(E - 2)(E + 2)']]
        }
      },
      {
        enonce: poseF.concat(['حلّ في Z المتراجحة:', '√(F - 5) > √2']),
        indice: 'F - 5 = E^2، و √(E^2) = |E|: المتراجحة تصير |2x - √2| > √2',
        etapes: [
          ['نعزل المربّع', 'F - 5 = E^2'],
          ['قاعدة الجذر', '√(E^2) = |E|'],
          ['المتراجحة تصير', '|2x - √2| > √2'],
          ['نفكّ القيمة المطلقة', 'يعني 2x - √2 > √2 أو 2x - √2 < -√2'],
          ['الحالة الأولى', 'x > √2'],
          ['نتحقّق من الحالة الثانية عند -1',
           '√(4(-1)^2 - 4√2(-1) + 7 - 5) > √2'],
          ['الأعداد الصحيحة',
           'الحلول في Z هي كل عدد صحيح سالب تماما، و كل عدد صحيح أكبر من 1']
        ],
        controle: {
          dans: { x: ']√2 ; +∞[' }, derives: { E: exprE, F: exprF },
          resolutions: [{ cond: '√(F - 5) > √2',
                          majals: [']-∞ ; 0[', ']√2 ; +∞['] }],
          entiers: [{ majals: [']-∞ ; 0[', ']√2 ; +∞['], fenetre: [-6, 6],
                      liste: [-6, -5, -4, -3, -2, -1, 2, 3, 4, 5, 6] }]
        }
      }
    ];
  }

  // =========================================================================
  // التمرين 18 — deux lettres, six volets.
  //
  //   x ∈ [-3/2 ; -1/2] est NÉGATIF, y ∈ [3 ; 5] positif : les deux
  //   encadrements demandés (y - x et x/y) passent donc par le renversement,
  //   jamais par une multiplication par la lettre.
  //
  //   Et tout l'exercice prépare la question 3 : 4y² - 44y + 121 = (2y - 11)²,
  //   dont la racine est |2y - 11| = 11 - 2y puisque 2y - 11 ≤ -1. Les trois
  //   morceaux de E se simplifient chacun par un signe déjà établi, et il
  //   reste E = y - 1.
  // =========================================================================
  function exercice18() {
    const exprE = '√(4y^2 - 44y + 121)/(2y - 11) + √((y - x)^2) - y|x/y|';
    const domaines = { x: '[-3/2 ; -1/2]', y: '[3 ; 5]' };
    const pose = ['نعتبر العددين الحقيقيين x و y حيث:', '2 ≤ -2x + 1 ≤ 4',
                  '3 ≤ y ≤ 5'];

    return [
      {
        enonce: pose.concat(['بيّن أنّ x ∈ [-3/2 ; -1/2] محدّدا مدى حصر العدد x']),
        indice: 'اطرح 1 من الأطراف ثمّ اقسم على -2: الترتيب ينقلب',
        etapes: [
          ['نطرح 1 من الأطراف', '1 ≤ -2x ≤ 3'],
          ['نقسم على -2 فينقلب الترتيب', '-1/2 ≥ x ≥ -3/2'],
          ['نرتّب تصاعديا', '-3/2 ≤ x ≤ -1/2'],
          ['مدى الحصر هو الفرق بين الطرفين', '-1/2 - (-3/2) = 1'],
          ['النتيجة', 'x ∈ [-3/2 ; -1/2]']
        ],
        controle: { dans: domaines, vrai: ['2 ≤ -2x + 1 ≤ 4'] }
      },
      {
        enonce: pose.concat(['أوجد حصرا للعبارة:', 'y - x']),
        indice: 'اقلب إشارة حصر x ثمّ اجمع الحصرين',
        etapes: [
          ['حصر x', '-3/2 ≤ x ≤ -1/2'],
          ['نضرب في -1 فينقلب الترتيب', '1/2 ≤ -x ≤ 3/2'],
          ['حصر y', '3 ≤ y ≤ 5'],
          ['نجمع الحصرين', '7/2 ≤ y - x ≤ 13/2']
        ],
        controle: { dans: domaines, vrai: ['7/2 ≤ y - x ≤ 13/2'] }
      },
      {
        enonce: pose.concat(['أوجد حصرا للكسر:', 'x/y']),
        indice: 'لا نضرب حصرا في متغيّر: اقلب إشارة x ليصير الحصران موجبين',
        etapes: [
          ['حصر x', '-3/2 ≤ x ≤ -1/2'],
          ['نضرب في -1 فينقلب الترتيب', '1/2 ≤ -x ≤ 3/2'],
          ['نقلب حصر y فينقلب الترتيب', '1/5 ≤ 1/y ≤ 1/3'],
          ['الحصران موجبان: نضربهما طرفا بطرف', '1/10 ≤ (-x)/y ≤ 1/2'],
          ['نضرب في -1 فينقلب الترتيب', '-1/2 ≤ x/y ≤ -1/10']
        ],
        controle: { dans: domaines, vrai: ['-1/2 ≤ x/y ≤ -1/10'] }
      },
      {
        enonce: pose.concat(['بيّن أنّ:', '2y - 11 ≠ 0']),
        indice: 'اضرب حصر y في 2 ثمّ اطرح 11: الطرف الأعلى يصير -1',
        etapes: [
          ['ننطلق من حصر y', '3 ≤ y ≤ 5'],
          ['نضرب في 2 الموجب', '6 ≤ 2y ≤ 10'],
          ['نطرح 11 من الأطراف', '-5 ≤ 2y - 11 ≤ -1'],
          ['الطرف الأعلى سالب', '2y - 11 ≤ -1'],
          ['النتيجة', 'العدد 2y - 11 سالب تماما، إذن لا ينعدم']
        ],
        controle: { dans: domaines, vrai: ['2y - 11 ≤ -1'] }
      },
      {
        enonce: pose.concat(['استنتج أنّ:', '(4y^2 - 44y + 121) ∈ [1 ; 25]']),
        indice: 'لاحظ أنّ 4y^2 - 44y + 121 = (2y - 11)^2',
        etapes: [
          ['نتعرّف على المربّع', '4y^2 - 44y + 121 = (2y - 11)^2'],
          ['حصر القوس', '-5 ≤ 2y - 11 ≤ -1'],
          ['نضرب في -1 فينقلب الترتيب', '1 ≤ 11 - 2y ≤ 5'],
          ['الحصر موجب: نربّعه', '1 ≤ (11 - 2y)^2 ≤ 25'],
          ['المربّعان متساويان', '(11 - 2y)^2 = (2y - 11)^2'],
          ['النتيجة', '1 ≤ 4y^2 - 44y + 121 ≤ 25']
        ],
        controle: { dans: domaines, vrai: ['1 ≤ 4y^2 - 44y + 121 ≤ 25'] }
      },
      {
        enonce: pose.concat(['اختصر العبارة:', 'E = ' + exprE]),
        indice: 'كل جذر يعطي قيمة مطلقة، و كل قيمة مطلقة ترفع بإشارة سبق أن حدّدتها',
        etapes: [
          ['نتعرّف على المربّع', '4y^2 - 44y + 121 = (2y - 11)^2'],
          ['قاعدة الجذر', '√((2y - 11)^2) = |2y - 11|'],
          ['المقام سالب', '2y - 11 ≤ -1'],
          ['نرفع القيمة المطلقة', '|2y - 11| = 11 - 2y'],
          ['الكسر الأوّل', '|2y - 11|/(2y - 11) = -1'],
          ['الجذر الثاني موجب', '√((y - x)^2) = y - x'],
          ['القيمة المطلقة الأخيرة', 'y|x/y| = -x'],
          ['نجمع', 'E = -1 + (y - x) - (-x)'],
          ['النتيجة', 'E = y - 1']
        ],
        controle: { dans: domaines, derives: { E: exprE },
                    claims: [['E', 'y - 1']] }
      }
    ];
  }

  // =========================================================================
  // التمرين 19 — cinq volets.
  //
  //   E = 16 - x² + (x - 9)(4 - x) cache (4 - x) en facteur commun : le
  //   premier morceau est 4² - x². Une fois factorisé, E est un produit dont
  //   un facteur est positif et l'autre négatif — d'où le renversement.
  // =========================================================================
  function exercice19() {
    const exprE = '16 - x^2 + (x - 9)(4 - x)';
    const domaine = '[-2 ; 2]';
    const pose = ['ليكن العدد الحقيقي x بحيث:', '-4 ≤ -3x + 2 ≤ 8'];
    const poseE = pose.concat(['لتكن العبارة:', 'E = ' + exprE]);

    return [
      {
        enonce: pose.concat(['بيّن أنّ:', 'x ∈ [-2 ; 2]']),
        indice: 'اطرح 2 من الأطراف ثمّ اقسم على -3: الترتيب ينقلب',
        etapes: [
          ['نطرح 2 من الأطراف', '-6 ≤ -3x ≤ 6'],
          ['نقسم على -3 فينقلب الترتيب', '2 ≥ x ≥ -2'],
          ['نرتّب تصاعديا', '-2 ≤ x ≤ 2'],
          ['النتيجة', 'x ∈ [-2 ; 2]']
        ],
        controle: { dans: { x: domaine }, vrai: ['-4 ≤ -3x + 2 ≤ 8'] }
      },
      {
        enonce: pose.concat(['أوجد حصرا للعبارة:', '4 - x']),
        indice: 'اقلب إشارة حصر x ثمّ أضف 4',
        etapes: [
          ['ننطلق من حصر x', '-2 ≤ x ≤ 2'],
          ['نضرب في -1 فينقلب الترتيب', '-2 ≤ -x ≤ 2'],
          ['نضيف 4 إلى الأطراف', '2 ≤ 4 - x ≤ 6'],
          ['النتيجة', 'العبارة 4 - x موجبة تماما']
        ],
        controle: { dans: { x: domaine }, vrai: ['2 ≤ 4 - x ≤ 6'] }
      },
      {
        enonce: pose.concat(['أوجد حصرا للعبارة:', '2x - 5']),
        indice: 'اضرب حصر x في 2 ثمّ اطرح 5',
        etapes: [
          ['ننطلق من حصر x', '-2 ≤ x ≤ 2'],
          ['نضرب في 2 الموجب', '-4 ≤ 2x ≤ 4'],
          ['نطرح 5 من الأطراف', '-9 ≤ 2x - 5 ≤ -1'],
          ['النتيجة', 'العبارة 2x - 5 سالبة تماما']
        ],
        controle: { dans: { x: domaine }, vrai: ['-9 ≤ 2x - 5 ≤ -1'] }
      },
      {
        enonce: poseE.concat(['فكّك إلى جداء عوامل العبارة E']),
        indice: 'العدد 16 - x^2 فرق مربّعين: 4^2 - x^2',
        etapes: [
          ['نتعرّف على فرق مربّعين', '16 - x^2 = (4 - x)(4 + x)'],
          ['نعيد كتابة E', 'E = (4 - x)(4 + x) + (x - 9)(4 - x)'],
          ['نضع (4 - x) عاملا مشتركا', 'E = (4 - x)((4 + x) + (x - 9))'],
          ['نختصر القوس الثاني', '(4 + x) + (x - 9) = 2x - 5'],
          ['النتيجة', 'E = (4 - x)(2x - 5)']
        ],
        controle: { dans: { x: domaine }, derives: { E: exprE },
                    claims: [['E', '(4 - x)(2x - 5)']] }
      },
      {
        enonce: poseE.concat(['استنتج حصرا للعبارة E']),
        indice: 'العامل الأوّل موجب و الثاني سالب: اقلب الثاني قبل الضرب',
        etapes: [
          ['نستعمل الشكل المفكّك', 'E = (4 - x)(2x - 5)'],
          ['حصر العامل الأوّل', '2 ≤ 4 - x ≤ 6'],
          ['حصر العامل الثاني', '-9 ≤ 2x - 5 ≤ -1'],
          ['نضرب الثاني في -1 فينقلب الترتيب', '1 ≤ 5 - 2x ≤ 9'],
          ['الحصران موجبان: نضربهما طرفا بطرف', '2 ≤ (4 - x)(5 - 2x) ≤ 54'],
          ['نضرب في -1 فينقلب الترتيب', '-54 ≤ E ≤ -2']
        ],
        controle: { dans: { x: domaine }, derives: { E: exprE },
                    vrai: ['-54 ≤ E ≤ -2'] }
      }
    ];
  }

  // =========================================================================
  // التمرين 20 — neuf volets, deux parties, et un pont entre elles.
  //
  //   La partie I factorise A = x² - 8x + 12 en (x - 2)(x - 6) ; la partie II
  //   fait apparaître cette MÊME expression comme différence de deux aires,
  //   S₂ - S₁ = 3(x² - 8x + 12). L'algèbre de la première partie résout donc
  //   la géométrie de la seconde — c'est là tout le propos.
  //
  //   La figure de la fiche ne dit rien de plus que son texte : AMEF carré,
  //   MBC rectangle en B, M intérieur à [AB], AB = 6, BM = 2 BC et BC = x.
  //   D'où AM = 6 - 2x, S₁ = x² et S₂ = (6 - 2x)².
  // =========================================================================
  function exercice20() {
    const exprA = 'x^2 - 8x + 12';
    const R = ']-∞ ; +∞[';
    const domaine = ']0 ; 3[';
    const geo = { AB: '6', BC: 'x', BM: '2x', AM: '6 - 2x',
                  S1: '1/2 × 2x × x', S2: '(6 - 2x)^2' };
    const poseI = ['لتكن العبارة، حيث x عدد حقيقي:', 'A = ' + exprA];
    const poseII = ['x عدد حقيقي موجب قطعا. في الشكل التالي:',
                    'AMEF مربّع، و MBC مثلث قائم في B،',
                    'و M نقطة من القطعة AB مخالفة للنقطتين A و B، مع:',
                    'AB = 6', 'BM = 2 BC', 'BC = x'];

    return [
      {
        enonce: poseI.concat(['أحسب القيمة العددية للعبارة A إذا كان:', 'x = 2']),
        indice: 'عوّض x بـ 2 في العبارة',
        etapes: [
          ['نعوّض x بـ 2', 'A = 2^2 - 8 × 2 + 12'],
          ['نحسب المربّع', '2^2 = 4'],
          ['نحسب الجداء', '8 × 2 = 16'],
          ['نجمع', '4 - 16 + 12 = 0'],
          ['النتيجة', 'A = 0']
        ],
        controle: { env: { x: '2', A: exprA }, claims: [['A', '0']] }
      },
      {
        enonce: poseI.concat(['بيّن أنّ:', 'x^2 - 8x = (x - 4)^2 - 16']),
        indice: 'العبارة x^2 - 8x هي بداية مربّع: 8x = 2 × 4 × x',
        etapes: [
          ['نتعرّف على بداية مربّع', '8x = 2 × 4 × x'],
          ['ننشر المربّع', '(x - 4)^2 = x^2 - 8x + 16'],
          ['نطرح 16 من الطرفين', '(x - 4)^2 - 16 = x^2 - 8x'],
          ['النتيجة', 'x^2 - 8x = (x - 4)^2 - 16']
        ],
        controle: { dans: { x: R }, derives: { A: exprA },
                    claims: [['x^2 - 8x', '(x - 4)^2 - 16']] }
      },
      {
        enonce: poseI.concat(['استنتج بالتفكيك أنّ:', 'A = (x - 2)(x - 6)']),
        indice: 'أضف 12 إلى الشكل السابق: تجد فرق مربّعين',
        etapes: [
          ['نستعمل السؤال السابق', 'A = (x - 4)^2 - 16 + 12'],
          ['نختصر', '(x - 4)^2 - 16 + 12 = (x - 4)^2 - 4'],
          ['نتعرّف على فرق مربّعين', '(x - 4)^2 - 4 = (x - 4)^2 - 2^2'],
          ['نستعمل المتطابقة',
           '(x - 4)^2 - 2^2 = ((x - 4) - 2)((x - 4) + 2)'],
          ['النتيجة', 'A = (x - 2)(x - 6)']
        ],
        controle: { dans: { x: R }, derives: { A: exprA },
                    claims: [['A', '(x - 2)(x - 6)']] }
      },
      {
        enonce: poseI.concat(['حلّ في IR المعادلة: x^2 - 8x + 12 = 0']),
        indice: 'استعمل الشكل المفكّك: جداء معدوم',
        etapes: [
          ['نستعمل الشكل المفكّك', 'A = (x - 2)(x - 6)'],
          ['جداء معدوم', 'يعني x - 2 = 0 أو x - 6 = 0'],
          ['نتحقّق من الحلّ الأوّل', '2^2 - 8 × 2 + 12 = 0'],
          ['نتحقّق من الحلّ الثاني', '6^2 - 8 × 6 + 12 = 0'],
          ['مجموعة الحلول', 'كل من 2 و 6']
        ],
        controle: {
          dans: { x: R }, derives: { A: exprA },
          resolutions: [{ cond: 'x^2 - 8x + 12 = 0', valeurs: ['2', '6'] }],
          claims: [['A', '(x - 2)(x - 6)']]
        }
      },
      {
        enonce: poseII.concat(['بيّن أنّ:', 'x ∈ ]0 ; 3[']),
        indice: 'النقطة M داخل القطعة AB، إذن البعد BM أصغر من AB',
        etapes: [
          ['البعد BM', 'BM = 2x'],
          ['M نقطة داخلية من القطعة', '0 < BM'],
          ['و هي مخالفة للنقطة A', 'BM < AB'],
          ['نعوّض', '0 < 2x < 6'],
          ['نقسم على 2 الموجب', '0 < x < 3'],
          ['النتيجة', 'x ∈ ]0 ; 3[']
        ],
        controle: { dans: { x: domaine }, derives: geo, vrai: ['0 < x < 3'] }
      },
      {
        enonce: poseII.concat(['أكتب البعد AM بدلالة x']),
        indice: 'النقطة M بين A و B، إذن AM = AB - BM',
        etapes: [
          ['البعد BM', 'BM = 2x'],
          ['M بين A و B', 'AM = AB - BM'],
          ['نعوّض', 'AM = 6 - 2x'],
          ['البعد موجب', 'AM > 0']
        ],
        controle: { dans: { x: domaine }, derives: geo,
                    claims: [['AM', '6 - 2x']] }
      },
      {
        enonce: poseII.concat(['لتكن S1 مساحة المثلث MBC و S2 مساحة المربّع AMEF',
                               'بيّن أنّ:', 'S2 - S1 = 3(x^2 - 8x + 12)']),
        indice: 'مساحة مثلث قائم هي نصف جداء ضلعي القائمة',
        etapes: [
          ['مساحة المثلث القائم', 'S1 = 1/2 × BM × BC'],
          ['نعوّض و نختصر', 'S1 = 1/2 × 2x × x = x^2'],
          ['مساحة المربّع', 'S2 = (6 - 2x)^2'],
          ['ننشر المربّع', '(6 - 2x)^2 = 36 - 24x + 4x^2'],
          ['نطرح', 'S2 - S1 = 36 - 24x + 4x^2 - x^2'],
          ['نضع 3 عاملا مشتركا', '36 - 24x + 3x^2 = 3(x^2 - 8x + 12)'],
          ['النتيجة', 'S2 - S1 = 3(x^2 - 8x + 12)']
        ],
        controle: { dans: { x: domaine }, derives: geo,
                    claims: [['S2 - S1', '3(x^2 - 8x + 12)']] }
      },
      {
        enonce: poseII.concat(['أوجد العدد x لتكون مساحة المثلث MBC مساوية لمساحة المربّع AMEF']),
        indice: 'التساوي يعني انعدام الفرق، و الفرق مفكّك بالجزء الأوّل',
        etapes: [
          ['نستعمل السؤال السابق', 'S2 - S1 = 3(x^2 - 8x + 12)'],
          ['نستعمل تفكيك الجزء الأوّل', 'S2 - S1 = 3(x - 2)(x - 6)'],
          ['التساوي يعني انعدام الفرق', 'يعني x - 2 = 0 أو x - 6 = 0'],
          ['العدد 6 خارج مجال الوجود', 'المجال ]0 ; 3[ لا يحتوي العدد 6'],
          ['نتحقّق عند 2', '3(2^2 - 8 × 2 + 12) = 0'],
          ['النتيجة', 'العدد المطلوب هو 2']
        ],
        controle: {
          dans: { x: domaine }, derives: geo,
          resolutions: [{ cond: 'S2 - S1 = 0', valeurs: ['2', '6'] }],
          claims: [['S2 - S1', '3(x - 2)(x - 6)']]
        }
      },
      {
        enonce: poseII.concat(['أوجد مجموعة الأعداد الحقيقية x التي تحقّق:',
                               'S1 ≥ 1/4 S2']),
        indice: 'اضرب الطرفين في 4: الطرفان موجبان فيمكن أخذ الجذرين',
        etapes: [
          ['نضرب الطرفين في 4', '4S1 ≥ S2'],
          ['نعوّض', '4x^2 ≥ (6 - 2x)^2'],
          ['الطرفان موجبان و 2x موجب', '2x ≥ 6 - 2x'],
          ['ننقل الحدود', '4x ≥ 6'],
          ['نقسم على 4 الموجب', 'x ≥ 3/2'],
          ['نقاطع مع مجال الوجود', 'T ∩ D = [3/2 ; 3[']
        ],
        controle: {
          ens: { T: '[3/2 ; +∞[', D: ']0 ; 3[' },
          dans: { x: '[3/2 ; 3[' }, derives: geo,
          resolutions: [{ cond: 'S1 ≥ 1/4 S2', majals: ['[3/2 ; +∞['] }],
          egaux: [['T ∩ D', '[3/2 ; 3[']]
        }
      }
    ];
  }

  const API = { exercice1, exercice2, exercice3, exercice10,
                exercice11, exercice12, exercice13,
                exercice15, exercice16, exercice17,
                exercice18, exercice19, exercice20 };
  if (M) module.exports = API; else racine.Encadrement = API;
})(typeof window !== 'undefined' ? window : globalThis);
