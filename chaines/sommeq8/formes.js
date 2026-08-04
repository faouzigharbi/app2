// Les « formes » de la fiche : une expression à parenthèses imbriquées qui se
// réduit à  α·u + β·v + k  (α, β ∈ {0, ±1}).
//
// C'est le squelette commun aux exercices 4, 5, 6, 7, 8, 10, 14, 15, 16 et 18.
// Chaque exercice garde SON motif de parenthèses — c'est lui qui fait la
// difficulté, et le recopier serait le trahir que de l'uniformiser. Ce que ce
// fichier partage, c'est la façon de décrire une forme :
//
//   nom, u, v      les noms affichés (« E », « a », « b »)
//   txt            l'expression telle qu'elle est imprimée
//   levees         les étapes de levée des parenthèses, du plus interne au plus externe
//   plat           l'expression une fois toutes les parenthèses tombées
//   regroupe       les termes semblables mis côte à côte
//   constantes     la somme des seules constantes
//   cible          { ca, cb, k } — la forme réduite
//
// Les constantes sont retirées à chaque appel ; seul le motif reste fixe.
(function (racine) {
  'use strict';
  const F = (typeof module !== 'undefined' && module.exports) ? require('./noyau.js') : racine.Somme;
  const { rat, add, sub, neg, txt, par, plus, ent, choix, decimal } = F;

  const DEN = [2, 3, 4, 5, 8, 9, 10];
  const fracPos = (dens) => {
    let f;
    do { f = rat(ent(1, 17), choix(dens || DEN)); } while (f.d === 1);
    return f;
  };
  const entNonNul = (a, b) => { let v; do { v = ent(a, b); } while (v === 0); return v; };
  const decNonRonde = () => { let d; do { d = ent(5, 35); } while (d % 10 === 0); return decimal(d); };

  // Écrit une suite de termes : le premier tel quel, les suivants avec leur
  // signe reporté sur l'opérateur. « a », « -b », « 13/8 » → « a - b + 13/8 ».
  function joindre(termes) {
    return termes.filter(Boolean).map((t, i) => {
      if (i === 0) return t;
      return t[0] === '-' ? ' - ' + t.slice(1) : ' + ' + t;
    }).join('');
  }

  const signeVar = (c, nom) => {
    if (c === 0) return null;
    const t = (Math.abs(c) === 1 ? '' : String(Math.abs(c))) + nom;
    return c > 0 ? t : '-' + t;
  };

  // La forme réduite, telle qu'elle s'écrit : variables d'abord, constante ensuite.
  function ecrireForme(cible, u, v) {
    return joindre([signeVar(cible.ca, u), signeVar(cible.cb, v),
                    cible.k.n === 0 ? null : txt(cible.k)]);
  }

  // Valeur de la forme réduite pour un couple donné.
  const valeurForme = (cible, vu, vv) =>
    add(add(vu ? F.mul(rat(cible.ca), vu) : rat(0),
            vv ? F.mul(rat(cible.cb), vv) : rat(0)), cible.k);

  // =========================================================================
  // Exercice 4 :  A = x - p - (x - y - q) + (x - y) - r      →  x + (-p + q - r)
  // =========================================================================
  function forme04() {
    const p = fracPos(), q = fracPos(), r = fracPos();
    const k = sub(add(neg(p), q), r);
    const txtE = 'x - ' + txt(p) + ' - (x - y - ' + txt(q) + ') + (x - y) - ' + txt(r);
    return {
      nom: 'A', u: 'x', v: 'y', txt: txtE,
      levees: [
        ['نرفع القوس المسبوق بعلامة الطرح',
         '- (x - y - ' + txt(q) + ') = -x + y + ' + txt(q)],
        ['نرفع القوس المسبوق بعلامة الجمع', '+ (x - y) = + x - y']
      ],
      plat: 'x - ' + txt(p) + ' - x + y + ' + txt(q) + ' + x - y - ' + txt(r),
      regroupe: '(x - x + x) + (y - y) + (-' + txt(p) + ' + ' + txt(q) + ' - ' + txt(r) + ')',
      constantes: '-' + txt(p) + ' + ' + txt(q) + ' - ' + txt(r),
      cible: { ca: 1, cb: 0, k }
    };
  }

  // =========================================================================
  // Exercice 5 :  E = -p - q + a              →  a + (-p - q)
  //               F = c - (a + d - b) + (-e + a)   →  b + (c - d - e)
  // =========================================================================
  function forme05E() {
    const p = ent(1, 6), q = fracPos();
    const k = sub(rat(-p), q);
    return {
      nom: 'E', u: 'a', v: null, txt: '-' + p + ' - ' + txt(q) + ' + a',
      levees: [],
      plat: '-' + p + ' - ' + txt(q) + ' + a',
      regroupe: 'a + (-' + p + ' - ' + txt(q) + ')',
      constantes: '-' + p + ' - ' + txt(q),
      cible: { ca: 1, cb: 0, k }
    };
  }

  function forme05F() {
    const c = ent(2, 9), d = ent(2, 6), e = ent(2, 8);
    const k = sub(sub(rat(c), rat(d)), rat(e));
    return {
      nom: 'F', u: 'b', v: null,
      txt: c + ' - (a + ' + d + ' - b) + (-' + e + ' + a)',
      levees: [
        ['نرفع القوس المسبوق بعلامة الطرح', '- (a + ' + d + ' - b) = -a - ' + d + ' + b'],
        ['نرفع القوس المسبوق بعلامة الجمع', '+ (-' + e + ' + a) = -' + e + ' + a']
      ],
      plat: c + ' - a - ' + d + ' + b - ' + e + ' + a',
      regroupe: '(-a + a) + b + (' + c + ' - ' + d + ' - ' + e + ')',
      constantes: c + ' - ' + d + ' - ' + e,
      cible: { ca: 1, cb: 0, k }
    };
  }

  // =========================================================================
  // Exercice 6 :  E = p - [-a + q - r] + (-b + q)   →  a - b + (p + r)
  // =========================================================================
  function forme06() {
    const p = fracPos([8, 4, 2]), q = fracPos([9, 3, 6]), r = fracPos([4, 8, 2]);
    const k = add(p, r);
    return {
      nom: 'E', u: 'a', v: 'b',
      txt: txt(p) + ' - [-a + ' + txt(q) + ' - ' + txt(r) + '] + (-b + ' + txt(q) + ')',
      levees: [
        ['نرفع القوس المربّع المسبوق بعلامة الطرح',
         '- [-a + ' + txt(q) + ' - ' + txt(r) + '] = a - ' + txt(q) + ' + ' + txt(r)],
        ['نرفع القوس المسبوق بعلامة الجمع',
         '+ (-b + ' + txt(q) + ') = -b + ' + txt(q)]
      ],
      plat: txt(p) + ' + a - ' + txt(q) + ' + ' + txt(r) + ' - b + ' + txt(q),
      regroupe: 'a - b + (' + txt(p) + ' - ' + txt(q) + ' + ' + txt(r) + ' + ' + txt(q) + ')',
      constantes: txt(p) + ' - ' + txt(q) + ' + ' + txt(r) + ' + ' + txt(q),
      cible: { ca: 1, cb: -1, k }
    };
  }

  // =========================================================================
  // Exercice 7 :  F = a - p - [a - (q - b)] - (-a + q)   →  a - b - p
  // =========================================================================
  function forme07() {
    const p = fracPos(), q = ent(1, 5);
    return {
      nom: 'F', u: 'a', v: 'b',
      txt: 'a - ' + txt(p) + ' - [a - (' + q + ' - b)] - (-a + ' + q + ')',
      levees: [
        ['نرفع القوس الداخلي', 'a - (' + q + ' - b) = a - ' + q + ' + b'],
        ['نرفع القوس المربّع', '- [a - ' + q + ' + b] = -a + ' + q + ' - b'],
        ['نرفع القوس الأخير', '- (-a + ' + q + ') = a - ' + q]
      ],
      plat: 'a - ' + txt(p) + ' - a + ' + q + ' - b + a - ' + q,
      regroupe: '(a - a + a) - b + (-' + txt(p) + ' + ' + q + ' - ' + q + ')',
      constantes: '-' + txt(p) + ' + ' + q + ' - ' + q,
      cible: { ca: 1, cb: -1, k: neg(p) }
    };
  }

  // =========================================================================
  // Exercice 8 :  A = (-x - a + p) - (-y + q - a)          →  y - x + (p - q)
  //               B = -(-x - r) - [(x + r) - (s - y)] - (s - x - t)  →  x - y + t
  // =========================================================================
  function forme08A() {
    const p = fracPos([5, 4, 10]), q = fracPos([5, 4, 10]);
    return {
      nom: 'A', u: 'y', v: 'x',
      txt: '(-x - a + ' + txt(p) + ') - (-y + ' + txt(q) + ' - a)',
      levees: [
        ['نرفع القوس المسبوق بعلامة الطرح',
         '- (-y + ' + txt(q) + ' - a) = y - ' + txt(q) + ' + a']
      ],
      plat: '-x - a + ' + txt(p) + ' + y - ' + txt(q) + ' + a',
      regroupe: 'y - x + (-a + a) + (' + txt(p) + ' - ' + txt(q) + ')',
      constantes: txt(p) + ' - ' + txt(q),
      cible: { ca: 1, cb: -1, k: sub(p, q) }
    };
  }

  function forme08B() {
    const r = fracPos([7, 3, 6]), s = fracPos([3, 6, 7]), t = fracPos([10, 5, 4]);
    return {
      nom: 'B', u: 'x', v: 'y',
      txt: '-(-x - ' + txt(r) + ') - [(x + ' + txt(r) + ') - (' + txt(s) + ' - y)] - ('
           + txt(s) + ' - x - ' + txt(t) + ')',
      levees: [
        ['نرفع القوس الأول', '-(-x - ' + txt(r) + ') = x + ' + txt(r)],
        ['نرفع القوس المربّع',
         '- [(x + ' + txt(r) + ') - (' + txt(s) + ' - y)] = -x - ' + txt(r) + ' + ' + txt(s) + ' - y'],
        ['نرفع القوس الأخير',
         '- (' + txt(s) + ' - x - ' + txt(t) + ') = -' + txt(s) + ' + x + ' + txt(t)]
      ],
      plat: 'x + ' + txt(r) + ' - x - ' + txt(r) + ' + ' + txt(s) + ' - y - ' + txt(s)
            + ' + x + ' + txt(t),
      regroupe: '(x - x + x) - y + (' + txt(r) + ' - ' + txt(r) + ' + ' + txt(s) + ' - '
                + txt(s) + ' + ' + txt(t) + ')',
      constantes: txt(r) + ' - ' + txt(r) + ' + ' + txt(s) + ' - ' + txt(s) + ' + ' + txt(t),
      cible: { ca: 1, cb: -1, k: t }
    };
  }

  // =========================================================================
  // Exercice 10 :  E = -[-p - (a - q)] - (p + b) + r    →  a - b + (-q + r)
  // =========================================================================
  function forme10() {
    const p = fracPos([3, 6]), q = fracPos([2, 4]), r = fracPos([4, 8]);
    return {
      nom: 'E', u: 'a', v: 'b',
      txt: '-[-' + txt(p) + ' - (a - ' + txt(q) + ')] - (' + txt(p) + ' + b) + ' + txt(r),
      levees: [
        ['نرفع القوس الداخلي', '- (a - ' + txt(q) + ') = -a + ' + txt(q)],
        ['نرفع القوس المربّع',
         '-[-' + txt(p) + ' - a + ' + txt(q) + '] = ' + txt(p) + ' + a - ' + txt(q)],
        ['نرفع القوس الأخير', '- (' + txt(p) + ' + b) = -' + txt(p) + ' - b']
      ],
      plat: txt(p) + ' + a - ' + txt(q) + ' - ' + txt(p) + ' - b + ' + txt(r),
      regroupe: 'a - b + (' + txt(p) + ' - ' + txt(q) + ' - ' + txt(p) + ' + ' + txt(r) + ')',
      constantes: txt(p) + ' - ' + txt(q) + ' - ' + txt(p) + ' + ' + txt(r),
      cible: { ca: 1, cb: -1, k: add(neg(q), r) }
    };
  }

  // =========================================================================
  // Exercice 14 :  A = -p - (q + x) - [r - (x + q)] + (x - s)   →  x + (-p - r - s)
  // =========================================================================
  function forme14() {
    const p = fracPos([2, 4]), q = fracPos([2, 4]), r = fracPos([4, 8]), s = fracPos([2, 4]);
    const k = sub(sub(neg(p), r), s);
    return {
      nom: 'A', u: 'x', v: null,
      txt: '-' + txt(p) + ' - (' + txt(q) + ' + x) - [' + txt(r) + ' - (x + ' + txt(q)
           + ')] + (x - ' + txt(s) + ')',
      levees: [
        ['نرفع القوس الأول', '- (' + txt(q) + ' + x) = -' + txt(q) + ' - x'],
        ['نرفع القوس المربّع',
         '- [' + txt(r) + ' - (x + ' + txt(q) + ')] = -' + txt(r) + ' + x + ' + txt(q)],
        ['نرفع القوس الأخير', '+ (x - ' + txt(s) + ') = x - ' + txt(s)]
      ],
      plat: '-' + txt(p) + ' - ' + txt(q) + ' - x - ' + txt(r) + ' + x + ' + txt(q)
            + ' + x - ' + txt(s),
      regroupe: '(-x + x + x) + (-' + txt(p) + ' - ' + txt(q) + ' - ' + txt(r) + ' + '
                + txt(q) + ' - ' + txt(s) + ')',
      constantes: '-' + txt(p) + ' - ' + txt(q) + ' - ' + txt(r) + ' + ' + txt(q) + ' - ' + txt(s),
      cible: { ca: 1, cb: 0, k }
    };
  }

  // =========================================================================
  // Exercice 15 :  E = (-c + a) - [p + (q - b)]              →  a + b + (-c - p - q)
  //                F = -m + [a - n - (-d - b)]               →  a + b + (-m - n + d)
  // =========================================================================
  function forme15E() {
    const c = ent(2, 6), p = fracPos([3, 6]), q = fracPos([5, 10]);
    return {
      nom: 'E', u: 'a', v: 'b',
      txt: '(-' + c + ' + a) - [' + txt(p) + ' + (' + txt(q) + ' - b)]',
      levees: [
        ['نرفع القوس الداخلي', '' + txt(p) + ' + (' + txt(q) + ' - b) = ' + txt(p) + ' + ' + txt(q) + ' - b'],
        ['نرفع القوس المربّع',
         '- [' + txt(p) + ' + ' + txt(q) + ' - b] = -' + txt(p) + ' - ' + txt(q) + ' + b']
      ],
      plat: '-' + c + ' + a - ' + txt(p) + ' - ' + txt(q) + ' + b',
      regroupe: 'a + b + (-' + c + ' - ' + txt(p) + ' - ' + txt(q) + ')',
      constantes: '-' + c + ' - ' + txt(p) + ' - ' + txt(q),
      cible: { ca: 1, cb: 1, k: sub(sub(rat(-c), p), q) }
    };
  }

  function forme15F() {
    const m = fracPos([3, 6]), n = fracPos([2, 4]), d = decNonRonde();
    return {
      nom: 'F', u: 'a', v: 'b',
      txt: '-' + txt(m) + ' + [a - ' + txt(n) + ' - (-' + d.t + ' - b)]',
      levees: [
        ['نرفع القوس الداخلي', '- (-' + d.t + ' - b) = ' + d.t + ' + b'],
        ['نرفع القوس المربّع',
         '+ [a - ' + txt(n) + ' + ' + d.t + ' + b] = a - ' + txt(n) + ' + ' + d.t + ' + b']
      ],
      plat: '-' + txt(m) + ' + a - ' + txt(n) + ' + ' + d.t + ' + b',
      regroupe: 'a + b + (-' + txt(m) + ' - ' + txt(n) + ' + ' + d.t + ')',
      constantes: '-' + txt(m) + ' - ' + txt(n) + ' + ' + d.t,
      cible: { ca: 1, cb: 1, k: add(sub(neg(m), n), d.v) }
    };
  }

  // =========================================================================
  // Exercice 16 :  A = -p - (x - q) - [r - (y + s)]     →  y - x + (-p + q - r + s)
  // =========================================================================
  function forme16() {
    const p = ent(2, 12), q = ent(3, 15), r = ent(2, 9), s = ent(1, 6);
    const k = rat(-p + q - r + s);
    return {
      nom: 'A', u: 'y', v: 'x',
      txt: '-' + p + ' - (x - ' + q + ') - [' + r + ' - (y + ' + s + ')]',
      levees: [
        ['نرفع القوس الأول', '- (x - ' + q + ') = -x + ' + q],
        ['نرفع القوس المربّع', '- [' + r + ' - (y + ' + s + ')] = -' + r + ' + y + ' + s]
      ],
      plat: '-' + p + ' - x + ' + q + ' - ' + r + ' + y + ' + s,
      regroupe: 'y - x + (-' + p + ' + ' + q + ' - ' + r + ' + ' + s + ')',
      constantes: '-' + p + ' + ' + q + ' - ' + r + ' + ' + s,
      cible: { ca: 1, cb: -1, k }
    };
  }


  // =========================================================================
  // Exercice 2 :  trois expressions à simplifier, rien d'autre
  //   A = p - (x - p)                     →  -x + 2p
  //   B = (x - p) - (x - y + q)           →   y - p - q
  //   C = p - (x - p) - [y - (x + q)]     →  -y + (2p + q)
  // =========================================================================
  function forme02A() {
    const p = fracPos([3, 5, 2, 4]);
    return {
      nom: 'A', u: 'x', v: null,
      txt: txt(p) + ' - (x - ' + txt(p) + ')',
      levees: [['نرفع القوس', '- (x - ' + txt(p) + ') = -x + ' + txt(p)]],
      plat: txt(p) + ' - x + ' + txt(p),
      regroupe: '-x + (' + txt(p) + ' + ' + txt(p) + ')',
      constantes: txt(p) + ' + ' + txt(p),
      cible: { ca: -1, cb: 0, k: add(p, p) }
    };
  }

  function forme02B() {
    const p = fracPos([2, 4]), q = fracPos([4, 3]);
    return {
      nom: 'B', u: 'y', v: null,
      txt: '(x - ' + txt(p) + ') - (x - y + ' + txt(q) + ')',
      levees: [['نرفع القوس المسبوق بعلامة الطرح',
                '- (x - y + ' + txt(q) + ') = -x + y - ' + txt(q)]],
      plat: 'x - ' + txt(p) + ' - x + y - ' + txt(q),
      regroupe: '(x - x) + y + (-' + txt(p) + ' - ' + txt(q) + ')',
      constantes: '-' + txt(p) + ' - ' + txt(q),
      cible: { ca: 1, cb: 0, k: sub(neg(p), q) }
    };
  }

  function forme02C() {
    const d = choix([7, 9, 11]);
    const p = rat(ent(1, d - 1), d), q = rat(ent(1, d - 1), d);
    return {
      nom: 'C', u: 'y', v: null,
      txt: txt(p) + ' - (x - ' + txt(p) + ') - [y - (x + ' + txt(q) + ')]',
      levees: [
        ['نرفع القوس الأول', '- (x - ' + txt(p) + ') = -x + ' + txt(p)],
        ['نرفع القوس المربّع', '- [y - (x + ' + txt(q) + ')] = -y + x + ' + txt(q)]
      ],
      plat: txt(p) + ' - x + ' + txt(p) + ' - y + x + ' + txt(q),
      regroupe: '(-x + x) - y + (' + txt(p) + ' + ' + txt(p) + ' + ' + txt(q) + ')',
      constantes: txt(p) + ' + ' + txt(p) + ' + ' + txt(q),
      cible: { ca: -1, cb: 0, k: add(add(p, p), q) }
    };
  }

  // =========================================================================
  // Exercice 9 :  A = (-a - b + c + p) - (-c + b - a + q)   →  2c - 2b + (p - q)
  // Les coefficients valent 2 : c'est le piège, « - b - b » ne fait pas « - b ».
  // =========================================================================
  function forme09() {
    const p = fracPos([4, 8]), q = fracPos([3, 6]);
    return {
      nom: 'A', u: 'c', v: 'b',
      txt: '(-a - b + c + ' + txt(p) + ') - (-c + b - a + ' + txt(q) + ')',
      levees: [['نرفع القوس المسبوق بعلامة الطرح',
                '- (-c + b - a + ' + txt(q) + ') = c - b + a - ' + txt(q)]],
      plat: '-a - b + c + ' + txt(p) + ' + c - b + a - ' + txt(q),
      regroupe: '(-a + a) + (c + c) + (-b - b) + (' + txt(p) + ' - ' + txt(q) + ')',
      constantes: txt(p) + ' - ' + txt(q),
      cible: { ca: 2, cb: -2, k: sub(p, q) }
    };
  }

  // =========================================================================
  // Exercice 11 :  E = p - (x + q) - (p - y)     →  y - x - q
  // =========================================================================
  function forme11() {
    const p = fracPos([2, 3]), q = fracPos([4, 8]);
    return {
      nom: 'E', u: 'y', v: 'x',
      txt: txt(p) + ' - (x + ' + txt(q) + ') - (' + txt(p) + ' - y)',
      levees: [
        ['نرفع القوس الأول', '- (x + ' + txt(q) + ') = -x - ' + txt(q)],
        ['نرفع القوس الثاني', '- (' + txt(p) + ' - y) = -' + txt(p) + ' + y']
      ],
      plat: txt(p) + ' - x - ' + txt(q) + ' - ' + txt(p) + ' + y',
      regroupe: 'y - x + (' + txt(p) + ' - ' + txt(q) + ' - ' + txt(p) + ')',
      constantes: txt(p) + ' - ' + txt(q) + ' - ' + txt(p),
      cible: { ca: 1, cb: -1, k: neg(q) }
    };
  }

  // =========================================================================
  // Exercice 12 :  A = -y + p - (y - q) - (x - r) - (-y) - s + y  →  -x + (p+q+r-s)
  //               B = -(y - x) + [c - (p + x - d) + q] - x - [e + (-x - r) - s]
  //                                                              →  -y + (c-p+d+q-e+r+s)
  // =========================================================================
  function forme12A() {
    const p = fracPos([2, 4]), q = fracPos([4, 8]), r = ent(1, 4), s = fracPos([8, 4]);
    return {
      nom: 'A', u: 'x', v: null,
      txt: '-y + ' + txt(p) + ' - (y - ' + txt(q) + ') - (x - ' + r + ') - (-y) - '
           + txt(s) + ' + y',
      levees: [
        ['نرفع الأقواس الثلاثة',
         '- (y - ' + txt(q) + ') - (x - ' + r + ') - (-y) = -y + ' + txt(q) + ' - x + ' + r + ' + y']
      ],
      plat: '-y + ' + txt(p) + ' - y + ' + txt(q) + ' - x + ' + r + ' + y - ' + txt(s) + ' + y',
      regroupe: '(-y - y + y + y) - x + (' + txt(p) + ' + ' + txt(q) + ' + ' + r
                + ' - ' + txt(s) + ')',
      constantes: txt(p) + ' + ' + txt(q) + ' + ' + r + ' - ' + txt(s),
      cible: { ca: -1, cb: 0, k: sub(add(add(p, q), rat(r)), s) }
    };
  }

  function forme12B() {
    const c = ent(1, 4), p = fracPos([5, 10]), d = ent(2, 5), q = fracPos([2, 4]);
    const e = ent(6, 12), r = fracPos([2, 4]), s = fracPos([5, 10]);
    const k = add(add(add(sub(add(sub(rat(c), p), rat(d)), rat(e)), q), r), s);
    return {
      nom: 'B', u: 'y', v: null,
      txt: '-(y - x) + [' + c + ' - (' + txt(p) + ' + x - ' + d + ') + ' + txt(q)
           + '] - x - [' + e + ' + (-x - ' + txt(r) + ') - ' + txt(s) + ']',
      levees: [
        ['نرفع القوس الأول', '-(y - x) = -y + x'],
        ['نرفع القوس المربّع الأول',
         '[' + c + ' - (' + txt(p) + ' + x - ' + d + ') + ' + txt(q) + '] = '
         + c + ' - ' + txt(p) + ' - x + ' + d + ' + ' + txt(q)],
        ['نرفع القوس المربّع الثاني',
         '- [' + e + ' + (-x - ' + txt(r) + ') - ' + txt(s) + '] = -' + e + ' + x + '
         + txt(r) + ' + ' + txt(s)]
      ],
      plat: '-y + x + ' + c + ' - ' + txt(p) + ' - x + ' + d + ' + ' + txt(q) + ' - x - '
            + e + ' + x + ' + txt(r) + ' + ' + txt(s),
      regroupe: '(x - x - x + x) - y + (' + c + ' - ' + txt(p) + ' + ' + d + ' + ' + txt(q)
                + ' - ' + e + ' + ' + txt(r) + ' + ' + txt(s) + ')',
      constantes: c + ' - ' + txt(p) + ' + ' + d + ' + ' + txt(q) + ' - ' + e + ' + '
                  + txt(r) + ' + ' + txt(s),
      cible: { ca: -1, cb: 0, k }
    };
  }

  // =========================================================================
  // Exercice 19 :  G = -[-p - (q - a)] - [(b - r) + (q' - a)]   →  -b + (p + r)
  // où q et q' sont le MÊME nombre écrit différemment (16/12 et 4/3) : le
  // groupe (q - a) apparaît deux fois avec des signes contraires et disparaît.
  // =========================================================================
  function forme19() {
    const p = fracPos([2, 4]), r = fracPos([5, 10]);
    const num = choix([3, 4, 5, 6]), mult = choix([2, 3, 4]);
    const q = rat(num * mult * 4, mult * 3);        // ex. 16/12, qui vaut 4/3
    const qBrut = (num * mult * 4) + '/' + (mult * 3);
    return {
      nom: 'G', u: 'b', v: null,
      txt: '-[-' + txt(p) + ' - (' + qBrut + ' - a)] - [(b - ' + txt(r) + ') + ('
           + txt(q) + ' - a)]',
      levees: [
        ['نبسّط الكسر', qBrut + ' = ' + txt(q)],
        ['نرفع القوس المربّع الأول',
         '-[-' + txt(p) + ' - (' + txt(q) + ' - a)] = ' + txt(p) + ' + ' + txt(q) + ' - a'],
        ['نرفع القوس المربّع الثاني',
         '- [(b - ' + txt(r) + ') + (' + txt(q) + ' - a)] = -b + ' + txt(r) + ' - '
         + txt(q) + ' + a']
      ],
      plat: txt(p) + ' + ' + txt(q) + ' - a - b + ' + txt(r) + ' - ' + txt(q) + ' + a',
      regroupe: '(-a + a) + (' + txt(q) + ' - ' + txt(q) + ') - b + (' + txt(p) + ' + '
                + txt(r) + ')',
      constantes: txt(p) + ' + ' + txt(q) + ' + ' + txt(r) + ' - ' + txt(q),
      cible: { ca: -1, cb: 0, k: add(p, r) }
    };
  }

  const API = { joindre, ecrireForme, valeurForme, fracPos, entNonNul, decNonRonde,
                forme04, forme05E, forme05F, forme06, forme07, forme08A, forme08B,
                forme10, forme14, forme15E, forme15F, forme16,
                forme02A, forme02B, forme02C, forme09, forme11,
                forme12A, forme12B, forme19 };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Formes = API;
})(typeof window !== 'undefined' ? window : globalThis);
