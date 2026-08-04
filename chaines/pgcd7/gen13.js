// Exercice 13 — effectif d'un collège, réparti en classes de a, b ou c élèves.
// L'effectif est un multiple commun : c'est le PPCM qui commande.
// L'intervalle est choisi pour que la solution soit UNIQUE — sinon la question
// « ما هو عدد التلاميذ » n'aurait pas de réponse.
(function (racine) {
  'use strict';
  const A = (typeof module !== 'undefined' && module.exports)
    ? require('./arith.js') : racine.Arith;
  const TAILLES = [12, 15, 16, 18, 20, 24, 25, 30, 36];

  function tirage() {
    for (;;) {
      const t = TAILLES.slice();
      const nb = [];
      for (let i = 0; i < 3; i++) nb.push(t.splice(Math.floor(Math.random() * t.length), 1)[0]);
      nb.sort((x, y) => x - y);
      const L = A.ppcmN(nb);
      // L > largeur de la fenêtre : au plus un multiple dedans.
      if (L <= 100 || L > 900) continue;
      const k = A.ent(2, Math.floor(2000 / L));
      const N = k * L;
      if (N < 600 || N % 100 === 0) continue;          // borne atteinte : ambigu
      const min = 100 * (Math.ceil(N / 100) - 1), max = min + 100;
      // On vérifie l'unicité au lieu de la supposer.
      let combien = 0;
      for (let m = L; m <= max; m += L) if (m > min && m < max) combien++;
      if (combien !== 1) continue;
      return { nb, L, k, N, min, max };
    }
  }

  function f() {
    const { nb, L, k, N, min, max } = tirage();
    const comb = A.combiner(nb, 'max');
    return {
      enonce: 'عدد تلاميذ مدرسة إعدادية محصور بين ' + min + ' و ' + max
        + ' ويمكن توزيعهم على أقسام ذات ' + nb[0] + ' أو ' + nb[1] + ' أو ' + nb[2]
        + ' تلميذا. ما هو عدد التلاميذ بهذه المدرسة؟',
      indice: 'العدد مضاعف مشترك للأعداد الثلاثة',
      etapes: [
        ['نترجم', 'العدد مضاعف لـ ' + nb[0] + ' و ' + nb[1] + ' و ' + nb[2] + '، إذن مضاعف مشترك'],
        ['نفكّك إلى عوامل أوّلية', nb.map(A.decomposer).join(' و ')],
        ['م.م.أ: كل عامل بأكبر أسّ', comb.texte + ' = ' + L],
        ['نبحث عن مضاعف لـ ' + L + ' بين ' + min + ' و ' + max, k + ' × ' + L + ' = ' + N],
        ['النتيجة', '= ' + N]
      ],
      res: N,
      controle: { nb, L, N, min, max, type: 'ppcm' }
    };
  }

  A.enregistrer(13, { titre: 'عدد التلاميذ — م.م.أ', f });
  if (typeof module !== 'undefined' && module.exports) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
