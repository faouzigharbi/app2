// Fiche « حصر و مجال » — سلسلة تمارين مراجعة عدد 10، النجاح في الرياضيات
// 7-8-9 أساسي. Exercices 1, 2 et 3.
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
          ['الأطراف سالبة فيقلب التربيع الترتيب', '1/9 ≤ (x - 10/3)^2 ≤ 49/9'],
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

  const API = { exercice1, exercice2, exercice3 };
  if (M) module.exports = API; else racine.Encadrement = API;
})(typeof window !== 'undefined' ? window : globalThis);
