// DE L'ÉGALITÉ TROUÉE À LA CHAÎNE.
//
// Un item pose une suite de fractions toutes égales à un même rapport, et
// perce un trou. La chaîne dit toujours la même chose — le produit en croix —
// mais elle le dit sur les deux fractions QUE L'ÉLÈVE PEUT UTILISER, c'est-à-
// dire celle qui est complète et celle qui est trouée.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Proport;

  const REGLE = 'في تناسب، جداء الطرفين يساوي جداء الوسطين';

  function chaine(it) {
    let s;
    try { s = it.monter(F); } catch (e) { return null; }
    const { fr, trou } = s;           // fr : [[n,d], …] ; trou : [i, 'n'|'d']
    const [i, ou] = trou;
    // La fraction de référence : la première entièrement connue.
    const j = fr.findIndex((x, k) => k !== i);
    if (j < 0) return null;
    const [rn, rd] = fr[j];
    const [tn, td] = fr[i];
    const inconnu = (ou === 'n') ? tn : td;

    const D = a => F.ecrire(a, 'donnee');
    const enonce = [
      'أكمل النّقاط حتّى تحصل على كسور متساوية :',
      fr.map((x, k) => (k === i)
        ? F.frac(ou === 'n' ? '…' : D(x[0]), ou === 'd' ? '…' : D(x[1]))
        : F.ecrireFrac(x[0], x[1], 'donnee')).join(' = ')
    ];

    // Le produit en croix, écrit avec les nombres de l'énoncé.
    const croix = (ou === 'n')
      ? D(rd) + ' × ' + '…' + ' = ' + D(rn) + ' × ' + D(td)
      : D(rn) + ' × ' + '…' + ' = ' + D(rd) + ' × ' + D(tn);
    const calcul = (ou === 'n')
      ? F.ecrireFrac(F.qMul(rn, td), rd, 'donnee')
      : F.ecrireFrac(F.qMul(rd, tn), rn, 'donnee');

    const etapes = [
      ['المعطيات', enonce[1]],
      ['القاعدة', REGLE],
      ['نطبّق', croix],
      ['نحسب', '… = ' + calcul + ' = ' + F.ecrire(inconnu)],
      // LA CONCLUSION DONNE LE NOMBRE, PAS LA LIGNE RECOMPOSÉE.
      // Réécrire l'égalité complète en y glissant la valeur trouvée produisait
      // une fraction DANS une fraction — « 117/5 » au numérateur d'un autre
      // quotient — parce qu'un résultat s'écrit en fraction irréductible. Le
      // trou avait un nombre pour réponse : c'est ce nombre qu'on écrit.
      ['النتيجة', '… = ' + F.ecrire(inconnu)]
    ];

    return {
      enonce, etapes,
      indice: s.indice || 'اضرب في تقاطع : بسط الأوّل في مقام الثاني',
      source: it.src,
      controle: {
        type: 'proport',
        fractions: fr.map(x => [x[0].n + '/' + x[0].d, x[1].n + '/' + x[1].d]),
        trou: [i, ou], reference: j,
        reponse: inconnu.n + '/' + inconnu.d,
        // Ce qui est AFFICHÉ, pour que le validateur puisse le relire.
        ecritReponse: F.ecrire(inconnu)
      }
    };
  }

  const API = { chaine, REGLE };
  if (M) module.exports = API; else racine.Chaines = API;
})(typeof window !== 'undefined' ? window : globalThis);
