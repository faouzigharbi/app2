// 7 — Ranger une liste. On sépare d'abord par le signe : c'est ce qui évite
// de comparer un négatif à un positif pour rien.
(function (racine) {
  'use strict';
  const F = (typeof module !== 'undefined' && module.exports) ? require('./frac.js') : racine.Frac;

  function f() {
    let liste;
    do {
      const n = F.ent(5, 6);
      liste = [];
      for (let i = 0; i < n; i++) {
        liste.push(Math.random() < 0.15 ? F.rat(F.ent(0, 1))
          : F.rat(F.ent(-20, 20), F.ent(2, 14)));
      }
    } while (new Set(liste.map(F.txt)).size !== liste.length
             || !liste.some(x => F.signe(x) < 0) || !liste.some(x => F.signe(x) > 0));

    const tri = liste.slice().sort(F.cmp);
    const neg = tri.filter(x => F.signe(x) < 0).map(F.txt);
    const pos = tri.filter(x => F.signe(x) >= 0).map(F.txt);
    return {
      enonce: ['رتّب تصاعديا الأعداد التالية:', liste.map(F.txt).join('  ;  ')],
      indice: 'افصل السوالب عن الموجبة قبل أن ترتّب',
      etapes: [
        ['القاعدة', 'كلّ عدد سالب أصغر من الصفر، وكلّ عدد موجب أكبر منه'],
        ['نفصل حسب الإشارة', neg.join(' ; ') + '  |  ' + pos.join(' ; ')],
        ['نرتّب داخل كلّ مجموعة',
          (neg.length > 1 ? neg.join(' < ') : neg[0])
          + ' ; ' + (pos.length > 1 ? pos.join(' < ') : pos[0])],
        ['الترتيب التصاعدي', tri.map(F.txt).join(' < ')]
      ],
      res: tri.map(F.txt).join(' < '),
      controle: { type: 'tri', liste: liste.map(F.txt), tri: tri.map(F.txt) }
    };
  }
  F.enregistrer(7, { titre: 'ترتيب قائمة', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
