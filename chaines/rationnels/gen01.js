// 1 — Comparer en réduisant au même dénominateur.
(function (racine) {
  'use strict';
  const F = (typeof module !== 'undefined' && module.exports) ? require('./frac.js') : racine.Frac;

  function f() {
    let a, b, d1, d2, L;
    do {
      d1 = F.ent(2, 12); d2 = F.ent(2, 12);
      if (d1 === d2) continue;
      L = d1 * d2 / F.pgcd(d1, d2);
      const s = F.choix([1, -1]);          // même signe : c'est ce qui rend
      a = F.rat(s * F.ent(1, 20), d1);     // la mise au même dénominateur utile
      b = F.rat(s * F.ent(1, 20), d2);
          // Un entier déguisé en fraction ôte tout intérêt à la mise au même
      // dénominateur : on l'écarte.
    } while (!L || L > 60 || F.cmp(a, b) === 0 || a.d === 1 || b.d === 1
             || F.egaux(F.abs(a), F.abs(b)));

    const na = a.n * (L / a.d), nb = b.n * (L / b.d);
    const op = F.cmp(a, b) < 0 ? '<' : '>';
    return {
      enonce: ['قارن العددين:', F.txt(a) + '  ;  ' + F.txt(b)],
      indice: 'وحّد المقامين ثمّ قارن البسطين',
      etapes: [
        ['المقام المشترك', String(L)],
        ['نكتب بنفس المقام', F.txt(a) + ' = ' + na + '/' + L + ' ; ' + F.txt(b) + ' = ' + nb + '/' + L],
        ['نقارن البسطين', na + ' ' + op + ' ' + nb],
        ['النتيجة', F.txt(a) + ' ' + op + ' ' + F.txt(b)]
      ],
      res: F.txt(a) + ' ' + op + ' ' + F.txt(b),
      controle: { type: 'compare', a: F.txt(a), b: F.txt(b), op }
    };
  }
  F.enregistrer(1, { titre: 'نفس المقام', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
