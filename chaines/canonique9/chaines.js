// DE L'ITEM À LA CHAÎNE.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Canonique;

  const e = { pol: F.ecrirePol, q: F.ecrireQ };
  const X = a => F.ecrireBinome(a);

  function chaine(it) {
    let s;
    try { s = it.monter(F); } catch (x) { return null; }
    const { P, a, k } = s;
    const carre = '(' + X(a) + ')<sup>2</sup>';
    const etapes = [['المعطيات', 'P = ' + F.ecrirePol(P)]];

    // ── La forme canonique, toujours : c'est d'elle que tout part.
    etapes.push(['القاعدة',
      'إكمال المربّع : x<sup>2</sup> − 2ax = (x − a)<sup>2</sup> − a<sup>2</sup>']);
    etapes.push(['نطبّق', 'نصف معامل x هو ' + F.ecrireQ(a) + ' ، إذن P = '
      + carre + ' − ' + F.ecrireQ(F.qMul(a, a)) + ' ' + signe(P[0])
      + '  أي  P = ' + carre + ' − ' + F.ecrireQ(k)]);

    if (s.but === 'canonique') {
      etapes.push(['النتيجة', 'P = ' + carre + ' − ' + F.ecrireQ(k)]);
    } else if (s.but === 'facteurs') {
      const b = s.b;
      etapes.push(['القاعدة', 'الفرق بين مربّعين : a<sup>2</sup> − b<sup>2</sup> = (a − b)(a + b)']);
      etapes.push(['نطبّق', 'P = ' + carre + ' − ' + F.ecrireQ(b) + '<sup>2</sup>'
        + '  إذن  P = (' + X(a) + ' − ' + F.ecrireQ(b) + ')('
        + X(a) + ' + ' + F.ecrireQ(b) + ')']);
      etapes.push(['النتيجة', 'P = (' + X(F.qAdd(a, b)) + ')(' + X(F.qSub(a, b)) + ')']);
    } else {
      etapes.push(['القاعدة', 'إذا كان (x − a)<sup>2</sup> = k و k > 0 فإنّ x = a − √k أو x = a + √k']);
      const r = F.ecrireRacine(k);
      etapes.push(['نطبّق', carre + ' = ' + F.ecrireQ(k) + '  إذن  '
        + X(a) + ' = −' + r + '  أو  ' + X(a) + ' = ' + r]);
      etapes.push(['النتيجة', 'S = { ' + F.ecrireQ(a) + ' − ' + r + ' ; '
        + F.ecrireQ(a) + ' + ' + r + ' }']);
    }

    const enonce = (s.texte ? s.texte(e) : []).concat([s.question]);
    return {
      enonce, etapes, indice: s.indice, source: it.src,
      controle: {
        type: 'canonique', but: s.but,
        P: P.map(c => c.n + '/' + c.d),
        a: a.n + '/' + a.d, k: k.n + '/' + k.d,
        b: s.b ? s.b.n + '/' + s.b.d : null
      }
    };
  }
  // « − a² + 4 » : le terme constant se lit sur P, il n'est pas recalculé à
  // part — c'est P qui fait foi, jamais une valeur écrite à côté.
  const signe = c => (c.n < 0n ? '− ' + F.ecrireQ({ n: -c.n, d: c.d })
                               : '+ ' + F.ecrireQ(c));

  const API = { chaine };
  if (M) module.exports = API; else racine.Chaines = API;
})(typeof window !== 'undefined' ? window : globalThis);
