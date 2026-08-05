// LES ÉNONCÉS — relevés sur les épreuves de concours.
//
// RevisBeja, exercice 3 : « نشّر العبارة P = x² − 8x + 4 », puis « بيّن أنّ
// P = (x − 4)² − 12 », puis « حلّ في ℝ المعادلة P = 0 ». Une seule idée —
// compléter le carré — et trois questions qui en découlent.
//
// LES COEFFICIENTS SONT TIRÉS, LA QUESTION EST CELLE DU MAÎTRE.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Canonique;

  const ITEMS = [];
  const item = (src, f, d, monter) => ITEMS.push({ src, f, n: 9, d, monter });
  const Q = F.q;

  // x² − 2a x + (a² − k) = (x − a)² − k. On tire a et k, jamais les
  // coefficients : ainsi la forme canonique existe toujours, et elle est
  // celle qu'on attend.
  const pose = () => {
    const a = F.ent(2, 9) * F.choix([1, -1]);
    // k > 0 pour que P = 0 ait deux solutions ; on mélange les carrés parfaits
    // (solutions entières) et le reste (solutions à radical).
    const k = F.choix([1, 4, 9, 16, 25, 2, 3, 5, 6, 7, 8, 10, 11, 12, 18, 20]);
    return { a: Q(a), k: Q(k) };
  };
  // P = (x − a)² − k, développé.
  const developpe = (a, k) => F.polAdd(
    F.polMul([F.qNeg(a), F.Q1], [F.qNeg(a), F.Q1]), [F.qNeg(k)]);

  // ── 1. LA FORME CANONIQUE ──────────────────────────────────────────────
  item('RevisBeja ex3 — الشكل القانوني', 'canonique', 'moyen', () => {
    const { a, k } = pose();
    return {
      P: developpe(a, k), a, k,
      but: 'canonique',
      texte: e => ['نعتبر العبارة P = ' + e.pol(developpe(a, k)) + '.'],
      question: 'بيّن أنّ P = (' + F.ecrireBinome(a) + ')<sup>2</sup> − '
                + F.ecrireQ(k) + '.',
      indice: 'أكمل المربّع : نصف معامل x، ثمّ اطرح مربّعه'
    };
  });

  // ── 2. LA FACTORISATION, quand k est un carré parfait ──────────────────
  item('RevisBeja ex3 — التفكيك', 'factorisation', 'moyen', () => {
    const a = Q(F.ent(2, 9) * F.choix([1, -1]));
    const b = Q(F.ent(1, 7));                   // k = b², un carré parfait
    const k = F.qMul(b, b);
    return {
      P: developpe(a, k), a, k, b,
      but: 'facteurs',
      texte: e => ['نعتبر العبارة P = ' + e.pol(developpe(a, k)) + '.'],
      question: 'فكّك العبارة P إلى جداء عاملين من الدرجة الأولى.',
      indice: 'P = (' + F.ecrireBinome(a) + ')² − ' + F.ecrireQ(k)
              + ' ، و a² − b² = (a − b)(a + b)'
    };
  });

  // ── 3. L'ÉQUATION P = 0 ────────────────────────────────────────────────
  item('RevisBeja ex3 — المعادلة', 'equation', 'difficile', () => {
    const { a, k } = pose();
    return {
      P: developpe(a, k), a, k,
      but: 'racines',
      texte: e => ['نعتبر العبارة P = ' + e.pol(developpe(a, k)) + '،',
                   'و نعلم أنّ P = (' + F.ecrireBinome(a) + ')<sup>2</sup> − '
                   + F.ecrireQ(k) + '.'],
      question: 'حلّ في ℝ المعادلة P = 0. (أترك الجذور في شكلها الجذري)',
      indice: '(' + F.ecrireBinome(a) + ')² = ' + F.ecrireQ(k)
              + ' ، فللمعادلة حلاّن'
    };
  });

  const API = { ITEMS, developpe };
  if (M) module.exports = API; else racine.Items = API;
})(typeof window !== 'undefined' ? window : globalThis);
