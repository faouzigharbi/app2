// Les huit exercices de la fiche « بعد نقطتين من مستقيم مدرج ».
//
// Chaque page est un exercice entier ; les sous-questions partagent le même
// tirage, et la figure — quand la fiche en a une — est redessinée avec les
// nombres tirés. Une figure fausse serait pire que pas de figure.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Gradue;
  const D = M ? require('./droite.js') : racine.Droite;
  const O = M ? require('./outils.js') : racine.Outils;
  const { rat, add, sub, neg, abs, signe, cmp, txt, par, ent, choix } = F;

  const nonNul = (a, b) => { let v; do { v = ent(a, b); } while (v === 0); return v; };
  // Abscisse « d'école » : fraction simple, jamais entière, dans [-4, 4].
  const absc = (dens) => {
    let r;
    do { r = rat(nonNul(-19, 19), choix(dens || [2, 3, 4, 5, 6, 8, 12])); }
    while (r.d === 1 || Math.abs(r.n / r.d) > 4.2);
    return r;
  };
  // Deux points trop proches se chevauchent sur le dessin : les étiquettes se
  // superposent et la figure devient illisible. On impose donc un écart
  // minimal — c'est une contrainte de lisibilité, pas de mathématiques, mais
  // une figure qu'on ne peut pas lire ne sert à rien.
  const ECART = 0.7;
  // Les repères O et I sont dessinés eux aussi : un point qui les frôle rend
  // les deux étiquettes illisibles. Ils entrent donc dans la contrainte.
  const ecartes = xs => {
    const v = xs.map(x => x.n / x.d);
    return v.every((x, i) => v.every((y, j) => i === j || Math.abs(x - y) >= ECART))
        && v.every(x => Math.abs(x) >= ECART && Math.abs(x - 1) >= ECART);
  };

  const distincts = (n, dens) => {
    for (let essai = 0; essai < 4000; essai++) {
      const out = [];
      while (out.length < n) {
        const r = absc(dens);
        if (!out.some(x => F.egaux(x, r))) out.push(r);
      }
      if (ecartes(out)) return out;
    }
    throw new Error('tirage impossible');
  };
  const fig = pts => D.dessiner(pts.map(p => ({ nom: p[0], x: p[1], sous: txt(p[1]) })));
  // La figure et la liste des points qu'elle est censée montrer voyagent
  // ensemble : c'est ce qui permet au validateur de relire le dessin et de
  // vérifier que chaque point est bien là où l'énoncé le place.
  const avec = (pts, questions) => {
    const svg = fig(pts);
    const liste = pts.map(p => ({ nom: p[0], x: p[1] }));
    questions.forEach(q => { q.figure = svg; q.pointsFigure = liste; });
    return questions;
  };

  // --- 1 : trois abscisses données, deux distances -------------------------
  F.enregistrer(1, { titre: 'بعدان انطلاقا من الفواصل', questions: 2, f() {
    const [a, b, c] = distincts(3);
    const tete = ['ليكن Δ مستقيما مدرجا بالمعيّن (O;I) و النقاط',
                  'A(' + txt(a) + ') ، B(' + txt(b) + ') ، C(' + txt(c) + ')'];
    return [O.bed('A', a, 'B', b, null, tete), O.bed('A', a, 'C', c, null, tete)];
  } });

  // --- 2 : les points sont placés, on lit puis on calcule ------------------
  F.enregistrer(2, { titre: 'ثلاثة أبعاد على رسم', questions: 3, f() {
    const [a, b, c] = distincts(3, [2, 3, 4]);
    const tete = ['لاحظ الرسم التالي، ثمّ'];
    return avec([['A', a], ['B', b], ['C', c]],
      [O.bed('A', a, 'B', b, null, tete), O.bed('A', a, 'C', c, null, tete),
       O.bed('B', b, 'C', c, null, tete)]);
  } });

  // --- 3 : distances lues, puis un point à distance donnée, puis milieu ---
  F.enregistrer(3, { titre: 'قراءة الفواصل، ثمّ منتصف', questions: 4, f() {
    for (;;) {
      const a = absc([2, 4]), d = rat(nonNul(1, 9), choix([2, 4]));
      const xm = add(a, d), xn = sub(a, d);          // A est le milieu de [MN]
      if (Math.abs(xm.n / xm.d) > 5 || Math.abs(xn.n / xn.d) > 5) continue;
      if (!ecartes([a, xm, xn])) continue;
      const tete = ['على الرسم التالي، A و M و N من Δ'];
      return avec([['A', a], ['M', xm], ['N', xn]], [
        O.bed('A', a, 'M', xm, null, tete),
        O.bed('A', a, 'N', xn, null, tete),
        O.bed('M', xm, 'N', xn, null, tete),
        O.milieu('M', xm, 'A', a, 'N', xn, null)
      ]);
    }
  } });

  // --- 4 : ranger des abscisses, ranger des distances, deux solutions ------
  F.enregistrer(4, { titre: 'ترتيب، ثمّ فاصلة غير وحيدة', questions: 3, f() {
    // Les VALEURS ABSOLUES doivent différer deux à deux : deux points
    // symétriques sont à la même distance de O, et « ranger » n'aurait alors
    // pas de réponse unique.
    let xs;
    do { xs = distincts(5, [2, 3, 4, 5]); }
    while (new Set(xs.map(x => F.txt(F.abs(x)))).size !== xs.length);
    const noms = ['A', 'B', 'C', 'D', 'E'];
    const paires = xs.map((x, i) => ({ nom: noms[i], x }));
    const pts = paires.map(p => [p.nom, p.x]);
    const distancesO = paires.map(p => ({ nom: 'O' + p.nom, x: abs(p.x) }));
    const dP = rat(ent(3, 25));
    const q1 = O.ordonner(paires);
    avec(pts, [q1]);
    return [
      q1,
      Object.assign(O.ordonner(distancesO), {
        enonce: ['رتّب تصاعديا الأبعاد التالية:',
                 distancesO.map(p => p.nom).join(' ؛ '),
                 'حيث', paires.map(p => 'x' + p.nom + ' = ' + txt(p.x)).join(' ، ')],
        indice: 'البعد هو القيمة المطلقة: الترتيب ليس هو نفسه ترتيب الفواصل'
      }),
      O.deuxSolutions('P', dP, null)
    ];
  } });

  // --- 5 : un point de chaque côté, le symétrique, trois distances --------
  F.enregistrer(5, { titre: 'مناظرة بالنسبة إلى O، ثمّ أبعاد', questions: 4, f() {
    for (;;) {
      const a = absc([2, 5]), d = rat(nonNul(1, 17), choix([5, 10, 2]));
      const xm = sub(a, abs(d));
      const xn = absc([2, 5]);
      const xp = neg(xm);
      if (F.egaux(xm, xn) || F.egaux(xp, xn) || F.egaux(xm, xp)) continue;
      if (Math.abs(xm.n / xm.d) > 5) continue;
      if (!ecartes([a, xm, xn])) continue;
      const tete = ['على الرسم التالي، A و M و N من Δ'];
      return avec([['A', a], ['M', xm], ['N', xn]], [
        O.bed('A', a, 'M', xm, null, tete),
        O.symetrique('M', xm, 'P', null),
        O.bed('M', xm, 'P', xp, null, tete),
        O.bed('N', xn, 'P', xp, null, tete)
      ]);
    }
  } });

  // --- 6 : symétrique, distance à I, deux points sous condition de signe --
  F.enregistrer(6, { titre: 'مناظرة، بعد عن I، و شرط الإشارة', questions: 4, f() {
    for (;;) {
      const a = absc([12, 6, 4]), b = absc([18, 9, 6]);
      const xc = neg(b);
      if (F.egaux(a, b) || F.egaux(a, xc)) continue;
      // La distance doit dépasser |x| : c'est ce qui met les deux solutions
      // de part et d'autre de O, et rend le choix de signe décisif.
      const dM = rat(Math.ceil(Math.abs(a.n / a.d)) + ent(1, 4));
      const dN = rat(Math.ceil(Math.abs(xc.n / xc.d)) + ent(1, 4));
      const tete = ['ليكن Δ مستقيما مدرجا بالمعيّن (O;I)، و',
                    'xA = ' + txt(a) + '  و  xB = ' + txt(b)];
      return [
        O.symetrique('B', b, 'C', null),
        O.bed('A', a, 'B', b, null, tete),
        O.pointADistance('A', a, 'M', dM, true, null),
        O.pointADistance('C', xc, 'N', dN, false, null)
      ];
    }
  } });

  // --- 7 : distances à l'origine, une distance entre deux points ----------
  F.enregistrer(7, { titre: 'أبعاد عن المبدأ، ثمّ بعد بينهما', questions: 3, f() {
    const [a, b] = distincts(2, [4, 5, 3]);
    const tete = ['على الرسم التالي، A و B من Δ'];
    return avec([['A', a], ['B', b]], [
      O.bed('O', rat(0), 'A', a, null, tete),
      O.bed('O', rat(0), 'B', b, null, tete),
      O.bed('B', b, 'A', a, null, tete)
    ]);
  } });

  // --- 8 : lire une abscisse, en placer deux, démontrer le milieu ---------
  F.enregistrer(8, { titre: 'إثبات أنّ نقطة منتصف قطعة', questions: 3, f() {
    for (;;) {
      const b = absc([6, 3, 2]), e = rat(nonNul(1, 11), choix([6, 3, 2]));
      const a = sub(b, abs(e)), c = add(b, abs(e));
      if (Math.abs(a.n / a.d) > 5 || Math.abs(c.n / c.d) > 5) continue;
      if (!ecartes([a, b, c])) continue;
      const tete = ['على الرسم التالي، A و B و C من Δ'];
      return avec([['A', a], ['B', b], ['C', c]], [
        O.bed('B', b, 'A', a, null, tete),
        O.bed('B', b, 'C', c, null, tete),
        O.milieu('A', a, 'B', b, 'C', c, null)
      ]);
    }
  } });
})(typeof window !== 'undefined' ? window : globalThis);
