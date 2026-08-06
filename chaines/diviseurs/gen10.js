// 10 — Jardin rectangulaire entouré d'arbres (exercice 4 de la fiche).
// Toutes les distances possibles sont les diviseurs communs des deux côtés ;
// une seule tombe dans l'intervalle donné, et elle fixe le nombre d'arbres.
(function (racine) {
  'use strict';
  const A = (typeof module !== 'undefined' && module.exports) ? require('./arith.js') : racine.Arith;
  const O = (typeof module !== 'undefined' && module.exports) ? require('./outils.js') : racine.Outils;

  function tirage() {
    for (;;) {
      const d = A.choix([12, 14, 15, 18, 20, 21, 22, 26, 33, 39]);
      const x = A.ent(2, 12), y = A.ent(2, 12);
      if (x === y || A.pgcd(x, y) !== 1) continue;
      const a = d * x, b = d * y;
      if (a > 500 || b > 500 || a < 60 || b < 60) continue;
      const comm = A.diviseurs(d);
      // Une seule valeur possible dans l'intervalle, sinon la question 2 n'a
      // pas de réponse unique. On le vérifie au lieu de l'espérer.
      const bornes = A.choix([[10, 20], [8, 16], [15, 25], [20, 30]]);
      const dans = comm.filter(v => v > bornes[0] && v < bornes[1]);
      if (dans.length !== 1) continue;
      return { a: Math.max(a, b), b: Math.min(a, b), d, comm, bornes, choisi: dans[0] };
    }
  }

  function f() {
    const { a, b, d, comm, bornes, choisi } = tirage();
    const perimetre = 2 * (a + b);
    const arbres = perimetre / choisi;
    return {
      enonce: 'حديقة مستطيلة الشكل أبعادها ' + a + ' و ' + b
        + ' بالمتر. قام مالكها بوضع أشجار على طول محيطها، شجرة بكلّ ركن، '
        + 'والمسافة الفاصلة بين شجرتين متتاليتين هي نفس العدد الصحيح الطبيعي على كامل المحيط. '
        + '١) أعط القيم الممكنة لهذه المسافة. '
        + '٢) إذا علمت أنّ هذه المسافة محصورة بين ' + bornes[0] + ' و ' + bornes[1]
        + '، احسب عدد الأشجار.',
      indice: 'المسافة تقسم البعدين معا',
      etapes: [
        ['نترجم', 'المسافة تقسم ' + a + ' و ' + b + '، إذن هي قاسم مشترك لهما'],
        ['نفكّك إلى عوامل أوّلية', A.decomposer(a) + ' و ' + A.decomposer(b)],
        ['ق.م.أ', A.combiner([a, b], 'min').texte + ' = ' + d],
        ['القيم الممكنة = قواسم ' + d, O.ensemble(comm) + ' بالمتر'],
        ['المحصورة بين ' + bornes[0] + ' و ' + bornes[1], '= ' + choisi + ' متر'],
        ['نحسب المحيط', '2 × (' + a + ' + ' + b + ') = ' + perimetre],
        ['عدد الأشجار', perimetre + ' : ' + choisi + ' = ' + arbres],
        ['النتيجة', '= ' + arbres]
      ],
      res: arbres,
      controle: { type: 'jardin', a, b, d, comm, bornes, choisi, perimetre, arbres }
    };
  }
  A.enregistrer(10, { titre: 'أشجار حول حديقة — القواسم المشتركة', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
