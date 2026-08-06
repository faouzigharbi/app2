// Les motifs de parenthèses de la fiche « جمع و طرح الأعداد الصحيحة النسبية »
// (ضفاف البحيرة, 2023). Même squelette que la fiche en ℚ — une expression à
// parenthèses imbriquées qui se réduit à α·u + β·v + γ·w + k — mais sur les
// ENTIERS, et avec deux nouveautés :
//   • une expression où TOUT s'élimine, variables comprises (exercice 1-E) ;
//   • des expressions à trois inconnues, dont l'une disparaît en chemin.
(function (racine) {
  'use strict';
  const F = (typeof module !== 'undefined' && module.exports) ? require('./noyau.js') : racine.AddZ;
  const { rat, add, sub, neg, txt, par, plus, ent, choix } = F;

  const E = n => rat(n);
  const nonNul = (a, b) => { let v; do { v = ent(a, b); } while (v === 0); return v; };

  function joindre(termes) {
    return termes.filter(Boolean).map((t, i) => {
      if (i === 0) return t;
      return t[0] === '-' ? ' - ' + t.slice(1) : ' + ' + t;
    }).join('');
  }
  const signeVar = (c, nom) => {
    if (!c || !nom) return null;
    const t = (Math.abs(c) === 1 ? '' : String(Math.abs(c))) + nom;
    return c > 0 ? t : '-' + t;
  };

  // Une forme peut porter jusqu'à trois inconnues. Quand elles s'annulent
  // toutes, il ne reste que la constante — et c'est justement le sel de
  // l'exercice 1-E : l'élève croit avoir raté quelque chose.
  function ecrireForme(cible, u, v, w) {
    const s = joindre([signeVar(cible.ca, u), signeVar(cible.cb, v),
                       signeVar(cible.cw, w), cible.k.n === 0 ? null : txt(cible.k)]);
    return s || '0';
  }
  const valeurForme = (cible, vu, vv, vw) => {
    let r = cible.k;
    if (cible.ca && vu) r = add(r, F.mul(rat(cible.ca), vu));
    if (cible.cb && vv) r = add(r, F.mul(rat(cible.cb), vv));
    if (cible.cw && vw) r = add(r, F.mul(rat(cible.cw), vw));
    return r;
  };

  const forme = (o) => Object.assign({ levees: [], cible: { ca: 0, cb: 0, cw: 0, k: E(0) } }, o);

  // ex1-A :  p - (a + q) - (-r) + b   →  b - a + (p - q + r)
  const f1A = () => { const p = nonNul(1, 9), q = nonNul(1, 9), r = nonNul(1, 9);
    return forme({ nom: 'A', u: 'b', v: 'a',
      txt: p + ' - (a + ' + q + ') - (' + txt(E(-r)) + ') + b',
      levees: [['نرفع القوسين', '- (a + ' + q + ') - (' + txt(E(-r)) + ') = -a - ' + q + ' + ' + r]],
      plat: p + ' - a - ' + q + ' + ' + r + ' + b',
      regroupe: 'b - a + (' + p + ' - ' + q + ' + ' + r + ')',
      constantes: p + ' - ' + q + ' + ' + r,
      cible: { ca: 1, cb: -1, cw: 0, k: E(p - q + r) } }); };

  // ex1-C :  -p - (q - b + a)   →  b - a + (-p - q)
  const f1C = () => { const p = nonNul(1, 9), q = nonNul(1, 9);
    return forme({ nom: 'C', u: 'b', v: 'a',
      txt: txt(E(-p)) + ' - (' + q + ' - b + a)',
      levees: [['نرفع القوس', '- (' + q + ' - b + a) = -' + q + ' + b - a']],
      plat: txt(E(-p)) + ' - ' + q + ' + b - a',
      regroupe: 'b - a + (' + txt(E(-p)) + ' - ' + q + ')',
      constantes: txt(E(-p)) + ' - ' + q,
      cible: { ca: 1, cb: -1, cw: 0, k: E(-p - q) } }); };

  // ex1-D :  (x + z) - x - [p - (-x - y - z)]   →  -x - y - p
  // Le z s'en va : il figure dans l'énoncé sans figurer dans la réponse.
  const f1D = () => { const p = nonNul(1, 9);
    return forme({ nom: 'D', u: 'x', v: 'y',
      txt: '(x + z) - x - [' + p + ' - (-x - y - z)]',
      levees: [
        ['نرفع القوس الداخلي', '- (-x - y - z) = x + y + z'],
        ['نرفع القوس المربّع', '- [' + p + ' + x + y + z] = -' + p + ' - x - y - z']],
      plat: 'x + z - x - ' + p + ' - x - y - z',
      regroupe: '(x - x - x) - y + (z - z) - ' + p,
      constantes: '0 - ' + p,
      cible: { ca: -1, cb: -1, cw: 0, k: E(-p) } }); };

  // ex1-E :  -p - (x - q) - [-r - (x - s)]   →  une CONSTANTE, tout s'annule
  const f1E = () => {
    const p = nonNul(1, 9), q = nonNul(1, 9), r = nonNul(1, 9), s = nonNul(1, 9);
    return forme({ nom: 'E', u: 'x', v: null,
      txt: txt(E(-p)) + ' - (x - ' + q + ') - [' + txt(E(-r)) + ' - (x - ' + s + ')]',
      levees: [
        ['نرفع القوس الأول', '- (x - ' + q + ') = -x + ' + q],
        ['نرفع القوس المربّع', '- [' + txt(E(-r)) + ' - x + ' + s + '] = ' + r + ' + x - ' + s]],
      plat: txt(E(-p)) + ' - x + ' + q + ' + ' + r + ' + x - ' + s,
      regroupe: '(-x + x) + (' + txt(E(-p)) + ' + ' + q + ' + ' + r + ' - ' + s + ')',
      constantes: txt(E(-p)) + ' + ' + q + ' + ' + r + ' - ' + s,
      cible: { ca: 0, cb: 0, cw: 0, k: E(-p + q + r - s) } }); };

  // ex2 :  x - [p - (q - x)] - [-r - (x - q)]   →  x + (-p + r)
  const f2 = () => { const p = nonNul(1, 9), q = nonNul(1, 9), r = nonNul(1, 9);
    return forme({ nom: 'F', u: 'x', v: null,
      txt: 'x - [' + p + ' - (' + q + ' - x)] - [' + txt(E(-r)) + ' - (x - ' + q + ')]',
      levees: [
        ['نرفع القوسين الداخليين', '(' + q + ' - x) و (x - ' + q + ') متقابلان'],
        ['نرفع القوس المربّع الأول', '- [' + p + ' - ' + q + ' + x] = -' + p + ' + ' + q + ' - x'],
        ['نرفع القوس المربّع الثاني', '- [' + txt(E(-r)) + ' - x + ' + q + '] = ' + r + ' + x - ' + q]],
      plat: 'x - ' + p + ' + ' + q + ' - x + ' + r + ' + x - ' + q,
      regroupe: '(x - x + x) + (-' + p + ' + ' + q + ' + ' + r + ' - ' + q + ')',
      constantes: '-' + p + ' + ' + q + ' + ' + r + ' - ' + q,
      cible: { ca: 1, cb: 0, cw: 0, k: E(-p + r) } }); };

  // ex4-N :  -p + (-b + q) - (-a + r) - (-s + c - t)   →  a - b - c + (…)
  // Trois inconnues, et toutes survivent : c'est le seul cas de la fiche.
  const f4N = () => {
    const p = nonNul(1, 6), q = nonNul(1, 9), r = nonNul(1, 6), s = nonNul(1, 6), t = nonNul(1, 5);
    return forme({ nom: 'N', u: 'a', v: 'b', w: 'c',
      txt: txt(E(-p)) + ' + (-b + ' + q + ') - (-a + ' + r + ') - (' + txt(E(-s)) + ' + c - ' + t + ')',
      levees: [
        ['نرفع القوس الأول', '+ (-b + ' + q + ') = -b + ' + q],
        ['نرفع القوس الثاني', '- (-a + ' + r + ') = a - ' + r],
        ['نرفع القوس الثالث', '- (' + txt(E(-s)) + ' + c - ' + t + ') = ' + s + ' - c + ' + t]],
      plat: txt(E(-p)) + ' - b + ' + q + ' + a - ' + r + ' + ' + s + ' - c + ' + t,
      regroupe: 'a - b - c + (' + txt(E(-p)) + ' + ' + q + ' - ' + r + ' + ' + s + ' + ' + t + ')',
      constantes: txt(E(-p)) + ' + ' + q + ' - ' + r + ' + ' + s + ' + ' + t,
      cible: { ca: 1, cb: -1, cw: -1, k: E(-p + q - r + s + t) } }); };

  // ex5-P :  -p + [-a - q - (-r - b)]   →  b - a + (-p - q + r)
  const f5P = () => { const p = nonNul(1, 9), q = nonNul(5, 20), r = nonNul(5, 20);
    return forme({ nom: 'P', u: 'b', v: 'a',
      txt: txt(E(-p)) + ' + [-a - ' + q + ' - (' + txt(E(-r)) + ' - b)]',
      levees: [
        ['نرفع القوس الداخلي', '- (' + txt(E(-r)) + ' - b) = ' + r + ' + b'],
        ['نرفع القوس المربّع', '+ [-a - ' + q + ' + ' + r + ' + b] = -a - ' + q + ' + ' + r + ' + b']],
      plat: txt(E(-p)) + ' - a - ' + q + ' + ' + r + ' + b',
      regroupe: 'b - a + (' + txt(E(-p)) + ' - ' + q + ' + ' + r + ')',
      constantes: txt(E(-p)) + ' - ' + q + ' + ' + r,
      cible: { ca: 1, cb: -1, cw: 0, k: E(-p - q + r) } }); };

  // ex5-Q :  (-p + a) - [q + (r - b)]   →  a + b + (-p - q - r)
  const f5Q = () => { const p = nonNul(1, 9), q = nonNul(1, 9), r = nonNul(1, 9);
    return forme({ nom: 'Q', u: 'a', v: 'b',
      txt: '(' + txt(E(-p)) + ' + a) - [' + q + ' + (' + r + ' - b)]',
      levees: [
        ['نرفع القوس الداخلي', q + ' + (' + r + ' - b) = ' + q + ' + ' + r + ' - b'],
        ['نرفع القوس المربّع', '- [' + q + ' + ' + r + ' - b] = -' + q + ' - ' + r + ' + b']],
      plat: txt(E(-p)) + ' + a - ' + q + ' - ' + r + ' + b',
      regroupe: 'a + b + (' + txt(E(-p)) + ' - ' + q + ' - ' + r + ')',
      constantes: txt(E(-p)) + ' - ' + q + ' - ' + r,
      cible: { ca: 1, cb: 1, cw: 0, k: E(-p - q - r) } }); };

  // ex6 / ex16 :  -p - (x - q) - [r - (y + s)]   →  y - x + (-p + q - r + s)
  const f6 = () => { const p = nonNul(1, 12), q = nonNul(1, 15), r = nonNul(1, 9), s = nonNul(1, 6);
    return forme({ nom: 'A', u: 'y', v: 'x',
      txt: txt(E(-p)) + ' - (x - ' + q + ') - [' + r + ' - (y + ' + s + ')]',
      levees: [
        ['نرفع القوس الأول', '- (x - ' + q + ') = -x + ' + q],
        ['نرفع القوس المربّع', '- [' + r + ' - (y + ' + s + ')] = -' + r + ' + y + ' + s]],
      plat: txt(E(-p)) + ' - x + ' + q + ' - ' + r + ' + y + ' + s,
      regroupe: 'y - x + (' + txt(E(-p)) + ' + ' + q + ' - ' + r + ' + ' + s + ')',
      constantes: txt(E(-p)) + ' + ' + q + ' - ' + r + ' + ' + s,
      cible: { ca: 1, cb: -1, cw: 0, k: E(-p + q - r + s) } }); };

  // ex7-B :  -p - [-(x - y + q) + x - r] - [s + (y - x) + t] + 1   →  x - 2y + (…)
  const f7B = () => {
    const p = nonNul(1, 6), q = nonNul(1, 5), r = nonNul(1, 8), s = nonNul(1, 6), t = nonNul(1, 8);
    const k = -p + q + r - s - t + 1;
    return forme({ nom: 'B', u: 'x', v: 'y',
      txt: txt(E(-p)) + ' - [-(x - y + ' + q + ') + x - ' + r + '] - [' + s + ' + (y - x) + ' + t + '] + 1',
      levees: [
        ['نرفع القوس الداخلي', '-(x - y + ' + q + ') = -x + y - ' + q],
        ['نرفع القوس المربّع الأول',
         '- [-x + y - ' + q + ' + x - ' + r + '] = -y + ' + q + ' + ' + r],
        ['نرفع القوس المربّع الثاني', '- [' + s + ' + y - x + ' + t + '] = -' + s + ' - y + x - ' + t]],
      plat: txt(E(-p)) + ' - y + ' + q + ' + ' + r + ' - ' + s + ' - y + x - ' + t + ' + 1',
      regroupe: 'x + (-y - y) + (' + txt(E(-p)) + ' + ' + q + ' + ' + r + ' - ' + s + ' - ' + t + ' + 1)',
      constantes: txt(E(-p)) + ' + ' + q + ' + ' + r + ' - ' + s + ' - ' + t + ' + 1',
      cible: { ca: 1, cb: -2, cw: 0, k: E(k) } }); };

  // ex9-E :  -(1 - a) + p - [-b - (1 - a)] - (-q - a)   →  a + b + (p + q)
  const f9E = () => { const p = nonNul(1, 9), q = nonNul(1, 9);
    return forme({ nom: 'E', u: 'a', v: 'b',
      txt: '-(1 - a) + ' + p + ' - [-b - (1 - a)] - (' + txt(E(-q)) + ' - a)',
      levees: [
        ['نرفع القوس الأول', '-(1 - a) = -1 + a'],
        ['نرفع القوس المربّع', '- [-b - (1 - a)] = b + 1 - a'],
        ['نرفع القوس الأخير', '- (' + txt(E(-q)) + ' - a) = ' + q + ' + a']],
      plat: '-1 + a + ' + p + ' + b + 1 - a + ' + q + ' + a',
      regroupe: '(a - a + a) + b + (-1 + ' + p + ' + 1 + ' + q + ')',
      constantes: '-1 + ' + p + ' + 1 + ' + q,
      cible: { ca: 1, cb: 1, cw: 0, k: E(p + q) } }); };

  // ex9-F :  -b - [-p - (1 - a) - b] - (b - q)   →  -a - b + (p + 1 + q)
  const f9F = () => { const p = nonNul(1, 9), q = nonNul(1, 9);
    return forme({ nom: 'F', u: 'a', v: 'b',
      txt: '-b - [' + txt(E(-p)) + ' - (1 - a) - b] - (b - ' + q + ')',
      levees: [
        ['نرفع القوس الداخلي', '- (1 - a) = -1 + a'],
        ['نرفع القوس المربّع', '- [' + txt(E(-p)) + ' - 1 + a - b] = ' + p + ' + 1 - a + b'],
        ['نرفع القوس الأخير', '- (b - ' + q + ') = -b + ' + q]],
      plat: '-b + ' + p + ' + 1 - a + b - b + ' + q,
      regroupe: '-a + (-b + b - b) + (' + p + ' + 1 + ' + q + ')',
      constantes: p + ' + 1 + ' + q,
      cible: { ca: -1, cb: -1, cw: 0, k: E(p + 1 + q) } }); };

  // ex11 :  -[-p - (q - a)] - [(b - r) + (q - a)]   →  -b + (p + r)
  const f11 = () => { const p = nonNul(1, 9), q = nonNul(1, 12), r = nonNul(1, 12);
    return forme({ nom: 'G', u: 'b', v: null,
      txt: '-[' + txt(E(-p)) + ' - (' + q + ' - a)] - [(b - ' + r + ') + (' + q + ' - a)]',
      levees: [
        ['نلاحظ المجموعة المتكرّرة', '(' + q + ' - a) موجودة مرّتين بإشارتين متعاكستين'],
        ['نرفع القوس المربّع الأول',
         '-[' + txt(E(-p)) + ' - (' + q + ' - a)] = ' + p + ' + ' + q + ' - a'],
        ['نرفع القوس المربّع الثاني',
         '- [(b - ' + r + ') + (' + q + ' - a)] = -b + ' + r + ' - ' + q + ' + a']],
      plat: p + ' + ' + q + ' - a - b + ' + r + ' - ' + q + ' + a',
      regroupe: '(-a + a) + (' + q + ' - ' + q + ') - b + (' + p + ' + ' + r + ')',
      constantes: p + ' + ' + q + ' + ' + r + ' - ' + q,
      cible: { ca: -1, cb: 0, cw: 0, k: E(p + r) } }); };

  // ex12-B :  -p - [x - (z + y)] - [(-x + y - q) + (-r - y)]   →  y + z + (…)
  const f12B = () => { const p = nonNul(1, 6), q = nonNul(1, 5), r = nonNul(1, 6);
    return forme({ nom: 'B', u: 'y', v: 'z',
      txt: txt(E(-p)) + ' - [x - (z + y)] - [(-x + y - ' + q + ') + (' + txt(E(-r)) + ' - y)]',
      levees: [
        ['نرفع القوس المربّع الأول', '- [x - (z + y)] = -x + z + y'],
        ['نرفع القوس المربّع الثاني',
         '- [(-x + y - ' + q + ') + (' + txt(E(-r)) + ' - y)] = x - y + ' + q + ' + ' + r + ' + y']],
      plat: txt(E(-p)) + ' - x + z + y + x - y + ' + q + ' + ' + r + ' + y',
      regroupe: '(-x + x) + (y - y + y) + z + (' + txt(E(-p)) + ' + ' + q + ' + ' + r + ')',
      constantes: txt(E(-p)) + ' + ' + q + ' + ' + r,
      cible: { ca: 1, cb: 1, cw: 0, k: E(-p + q + r) } }); };

  const API = { joindre, ecrireForme, valeurForme, E, nonNul,
                f1A, f1C, f1D, f1E, f2, f4N, f5P, f5Q, f6, f7B, f9E, f9F, f11, f12B };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Formes = API;
})(typeof window !== 'undefined' ? window : globalThis);
