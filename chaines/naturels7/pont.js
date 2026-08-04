// LE PONT — ce que les pages « أين الخطأ؟ » attendent d'une fiche.
//
// Cette fiche-ci est la plus ancienne du lot, et la seule dont les chaînes
// soient déjà RENDUES : ses étapes sont des chaînes HTML — « ننجز الأقواس:
// <span dir="ltr">18 × 6 + 3</span> » —, non des couples (libellé, maths).
// Le porteur, lui, a besoin du couple : il doit lire le libellé pour savoir
// où la règle s'applique, et les maths pour y planter la faute.
//
// On ne réécrit pas la fiche : on la relit. Le libellé est ce qui précède le
// premier deux-points, les maths sont ce que le span contient. Ce qui n'est
// pas du calcul — « نحدّد الأولوية: الأقواس ← الضرب ... » — traverse le pont
// tel quel, et le juge s'en abstiendra.
//
// Autre particularité : ici une étape n'est pas une égalité mais une
// EXPRESSION, la précédente réécrite plus simplement. L'invariant de la fiche
// est qu'elle vaut toujours le résultat final — c'est là-dessus que juge.js
// tranche, et c'est pourquoi le contrôle porte le résultat.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const G = M ? require('./generateurs.js') : racine.Generateurs;
  const MOT = M ? require('./moteur.js') : racine.Moteur;

  const pgcd = (a, b) => (b ? pgcd(b, a % b) : Math.abs(a));
  const sansBalises = s => String(s).replace(/<[^>]*>/g, '').trim();

  // « ننجز الأقواس: <span …>18 × 6 + 3</span> » → ['ننجز الأقواس', '18 × 6 + 3'].
  function couper(etape) {
    const s = String(etape);
    const k = s.indexOf(':');
    if (k < 0) return [sansBalises(s), ''];
    return [sansBalises(s.slice(0, k)), sansBalises(s.slice(k + 1))];
  }

  // Le résultat de la chaîne se lit dans sa dernière étape : « النتيجة: = 111 ».
  function resultat(q) {
    for (let i = q.steps.length - 1; i >= 0; i--) {
      const m = /^=\s*(\d+)$/.exec(couper(q.steps[i])[1]);
      if (m) return Number(m[1]);
    }
    return null;
  }

  const PROBLEMES = {};
  Object.keys(G.EXERCICES).forEach(n => {
    PROBLEMES[n] = { titre: G.EXERCICES[n].titre,
                     questions: G.construire(Number(n)).questions.length };
  });

  function tirer(n) {
    return G.construire(Number(n)).questions.map(q => ({
      enonce: [sansBalises(q.operation)],
      etapes: q.steps.map(couper),
      indice: q.hint || 'تذكّر ترتيب العمليات.',
      res: resultat(q),
      controle: { res: resultat(q) }
    })).filter(q => q.res !== null);
  }

  const API = {
    PROBLEMES, tirer, ent: MOT.ent, choix: MOT.choix, pgcd,
    rendreMath: MOT.md ? (s => MOT.md(s, true)) : undefined
  };

  if (M) module.exports = API; else racine.Pont = API;
})(typeof window !== 'undefined' ? window : globalThis);
