// LE MONTAGE DE LA FICHE — quelles familles, en quel ordre.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Thales;
  const I = M ? require('./items.js') : racine.Items;
  const C = M ? require('./chaines.js') : racine.Chaines;

  const PAR_PAGE = 4;

  const FAMILLES = [
    ['pythagore', 'نظرية بيتاغور'],
    ['pythagore-reciproque', 'عكس نظرية بيتاغور'],
    ['relation-metrique', 'العلاقة القياسية في المثلّث القائم'],
    ['cercle-rectangle', 'المثلّث القائم و الدائرة المحيطة به'],
    ['thales-configuration', 'نظرية طالس — قراءة الشّكل'],
    ['thales-longueur', 'نظرية طالس — حساب طول'],
    ['thales-decimaux', 'نظرية طالس — نتيجة في شكل كسر'],
    ['thales-parallele', 'عكس طالس — إثبات التوازي'],
    ['milieux', 'مبرهنة المنتصفين'],
    ['trapeze', 'شبه المنحرف و قطراه'],
    ['projection-parallele', 'المسقط وفقا لمنحى'],
    ['quadrilatere', 'طبيعة رباعي'],
    ['centre-gravite', 'مركز ثقل مثلّث'],
    ['orthocentre', 'المركز القائم لمثلّث'],
    ['symetrie', 'التناظر المركزي']
  ];

  function puiser(famille, n) {
    const dedans = I.ITEMS.filter(x => x.f === famille);
    if (!dedans.length) return [];
    const sac = [];
    let pool = [];
    while (sac.length < n) {
      if (!pool.length) pool = F.melanger(dedans);
      sac.push(pool.pop());
    }
    return sac;
  }

  let n = 0;
  for (const [famille, titre] of FAMILLES) {
    if (!I.ITEMS.some(x => x.f === famille)) continue;
    n++;
    F.enregistrer(n, {
      titre, famille,
      questions: PAR_PAGE,
      f: () => puiser(famille, PAR_PAGE).map(C.chaine).filter(Boolean)
    });
  }
})(typeof window !== 'undefined' ? window : globalThis);
