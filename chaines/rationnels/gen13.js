// 13 — Sélectionner dans un ensemble les éléments qui vérifient un
// encadrement. Le rejet de chaque élément écarté est écrit, et vérifiable.
(function (racine) {
  'use strict';
  const F = (typeof module !== 'undefined' && module.exports) ? require('./frac.js') : racine.Frac;

  function f() {
    let E, bas, haut, gardes, rejets;
    // Boucle explicite : un « continue » dans un do/while sauterait à la
    // condition avant que gardes soit calculé.
    for (;;) {
      E = [];
      const n = F.ent(5, 6);
      for (let i = 0; i < n; i++) {
        E.push(Math.random() < 0.2 ? F.rat(F.ent(0, 1))
          : F.rat(F.ent(-18, 18), F.ent(2, 9)));
      }
      if (new Set(E.map(F.txt)).size !== E.length) continue;
      bas = F.rat(F.ent(-10, 2), F.ent(2, 8));
      haut = F.rat(F.ent(1, 12), F.ent(2, 8));
      if (F.cmp(bas, haut) >= 0) continue;
      // Aucun élément sur une borne : « > » et « ≤ » resteraient ambigus à lire.
      if (E.some(x => F.egaux(x, bas))) continue;
      gardes = E.filter(x => F.cmp(bas, x) < 0 && F.cmp(x, haut) <= 0);
      rejets = E.filter(x => !(F.cmp(bas, x) < 0 && F.cmp(x, haut) <= 0));
      if (gardes.length >= 2 && rejets.length >= 2) break;
    }

    const raison = rejets.map(x => F.cmp(x, bas) <= 0
      ? F.txt(x) + ' ≤ ' + F.txt(bas)
      : F.txt(x) + ' > ' + F.txt(haut));

    return {
      enonce: ['نعتبر المجموعة E المكوّنة من:', E.map(F.txt).join('  ;  '),
               '. حدّد عناصر E المحصورة بين', F.txt(bas) + ' (قطعا) و ' + F.txt(haut)],
      indice: 'افحص كلّ عنصر على حدة',
      etapes: [
        ['نترجم الشرط', 'العدد أكبر قطعا من الحدّ الأدنى وأصغر من الحدّ الأعلى أو يساويه'],
        ['الحدّان', F.txt(bas) + ' ; ' + F.txt(haut)],
        ['العناصر المرفوضة', raison.join(' ; ')],
        ['العناصر المقبولة', gardes.map(F.txt).join(' ; ')]
      ],
      res: gardes.map(F.txt).join(' ; '),
      controle: { type: 'ensemble', E: E.map(F.txt), bas: F.txt(bas), haut: F.txt(haut),
                  gardes: gardes.map(F.txt) }
    };
  }
  F.enregistrer(13, { titre: 'انتقاء عناصر مجموعة', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
