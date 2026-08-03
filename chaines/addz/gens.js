// Les exercices de la fiche « جمع و طرح الأعداد الصحيحة النسبية » (2023).
//
// Même chapitre que la fiche en ℚ, mais sur les ENTIERS — et surtout beaucoup
// plus d'équations : six exercices n'en contiennent pas autre chose, dont une
// bonne moitié à valeur absolue, avec des cas impossibles semés exprès.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.AddZ;
  const S = M ? require('./formes.js') : racine.Formes;
  const Q = M ? require('./questions.js') : racine.Questions;
  const EQ = M ? require('./equations.js') : racine.Equations;
  const { rat, add, sub, neg, abs, signe, txt, par, plus, ent, choix } = F;
  const E = n => rat(n);
  const nonNul = S.nonNul;
  const renommer = (sh, nom) => Object.assign({}, sh, { nom });

  // --- 1 : cinq expressions à réduire, dont une où TOUT s'annule -----------
  F.enregistrer(1, { titre: 'اختصار خمس عبارات', questions: 5, f: () => [
    Q.montrer(S.f1A()), Q.montrer(renommer(S.f1A(), 'B')), Q.montrer(S.f1C()),
    Q.montrer(S.f1D()), Q.montrer(S.f1E())
  ] });

  // --- 2 : F se réduit, on l'évalue, puis on remonte à x -------------------
  F.enregistrer(2, { titre: 'عبارة في x: اختصار، حساب، بحث', questions: 3, f() {
    const sh = S.f2();
    const vx = E(nonNul(-12, 12));
    let cible; do { cible = E(nonNul(-12, 12)); } while (F.egaux(sub(cible, sh.cible.k), vx));
    return [Q.montrer(sh), Q.parValeurs(sh, vx, null), Q.trouverCombinaison(sh, cible)];
  } });

  // --- 3, 8, 13, 14, 15 : les batteries d'équations ------------------------
  const batterie = (n, part) => ({ f: () => EQ.batterie(n, part), questions: n });
  F.enregistrer(3, Object.assign({ titre: 'ستّ معادلات، منها بقيمة مطلقة' }, batterie(6)));
  F.enregistrer(8, Object.assign({ titre: 'أربع معادلات' }, batterie(4)));
  F.enregistrer(13, Object.assign({ titre: 'ثلاث معادلات بأقواس' }, batterie(3, 0.34)));
  F.enregistrer(14, Object.assign({ titre: 'ثماني معادلات بقيمة مطلقة' }, batterie(8, 1)));
  F.enregistrer(15, Object.assign({ titre: 'ستّ معادلات بسيطة' }, batterie(6, 0.34)));

  // --- 4 : N à trois inconnues -------------------------------------------
  F.enregistrer(4, { titre: 'عبارة بثلاثة مجاهيل', questions: 3, f() {
    const sh = S.f4N();
    const va = E(nonNul(-9, 9)), vb = E(nonNul(-9, 9)), vc = E(nonNul(-9, 9));
    const val = S.valeurForme(sh.cible, va, vb, vc);
    return [
      Q.montrer(sh),
      {
        enonce: ['احسب', 'N', 'في حالة', 'a = ' + txt(va) + ' و b = ' + txt(vb)
                 + ' و c = ' + txt(vc), 'حيث', 'N = ' + Q.forme(sh)],
        indice: 'التعويض في الشكل المختصر أقصر بكثير من التعويض في العبارة الأصلية',
        etapes: [
          ['نستعمل الشكل المختصر', 'N = ' + Q.forme(sh)],
          ['نعوّض', 'N = ' + par(va) + ' - ' + par(vb) + ' - ' + par(vc) + plus(sh.cible.k)],
          ['نحسب', par(va) + ' - ' + par(vb) + ' - ' + par(vc) + plus(sh.cible.k) + ' = ' + txt(val)],
          ['النتيجة', 'N = ' + txt(val)]
        ],
        controle: { type: 'forme', defs: { N: sh.txt }, libres: [],
                    fixes: { a: va, b: vb, c: vc }, claims: [{ nom: 'N', vaut: val }] }
      },
      EQ.batterie(1, 0)[0]
    ];
  } });

  // --- 5 : P et Q, puis deux comparaisons ---------------------------------
  F.enregistrer(5, { titre: 'عبارتان، ثمّ مقارنتان', questions: 5, f() {
    for (;;) {
      const P = S.f5P(), Qq = S.f5Q();
      const d = E(nonNul(-9, 9));                    // a - b = d  ⟹  P = -d + kP
      const vP = add(neg(d), P.cible.k);
      const seuil = E(nonNul(-15, 15));
      // Le seuil ne doit égaler ni P ni Q : « comparer » deux nombres égaux
      // n'a pas de conclusion en « < » ou « > ».
      if (F.egaux(vP, seuil) || F.egaux(Qq.cible.k, seuil)) continue;
      const va = E(nonNul(-9, 9)), vb = E(nonNul(-9, 9));
      return [
        Q.montrer(P, [Qq]), Q.montrer(Qq, [P]),
        Q.comparerParDifferenceCalculee({
          vars: 'a و b', combi: 'b - a', valeur: neg(d), cste: sub(P.cible.k, seuil),
          g: 'P', d: txt(seuil), libres: ['a'], defs: { P: P.txt, Q: Qq.txt },
          lie: { nom: 'b', via: 'difference', autre: 'a', valeur: d }
        }),
        {
          enonce: ['قارن', 'Q و ' + txt(seuil), 'إذا كان', 'a و b متقابلان', 'حيث',
                   'Q = ' + Q.forme(Qq)],
          indice: 'متقابلان يعني a + b = 0',
          etapes: [
            ['نترجم « متقابلان »', 'a + b = 0'],
            ['نستعمل الشكل المختصر', 'Q = (a + b)' + plus(Qq.cible.k)],
            ['نعوّض', 'Q = 0' + plus(Qq.cible.k)],
            ['نحسب الفرق', 'Q - ' + par(seuil) + ' = ' + txt(sub(Qq.cible.k, seuil))],
            ['نحدّد إشارة الفرق', txt(sub(Qq.cible.k, seuil))
             + (signe(sub(Qq.cible.k, seuil)) < 0 ? ' < 0' : ' > 0')],
            ['النتيجة', 'Q' + (signe(sub(Qq.cible.k, seuil)) < 0 ? ' < ' : ' > ') + txt(seuil)]
          ],
          controle: { type: 'signe', defs: { Q: Qq.txt }, libres: ['a'],
                      lie: { nom: 'b', via: 'oppose', autre: 'a' },
                      relation: { g: 'Q', d: txt(seuil),
                                  sens: signe(sub(Qq.cible.k, seuil)) < 0 ? -1 : 1 } }
        },
        Q.parValeurs(P, vb, va, [Qq])
      ];
    }
  } });

  // --- 6 et 16 : A = y - x + k -------------------------------------------
  const exA = () => {
    const sh = S.f6();
    const cible = E(nonNul(-15, 15));
    const vy = E(nonNul(-9, 9)), vx = E(nonNul(-9, 9));
    const s = E(nonNul(-14, 14));
    return [Q.montrer(sh), Q.trouverCombinaison(sh, cible),
            Q.parValeurs(sh, vy, vx), Q.parRelation(sh, s, null, 'x - y')];
  };
  F.enregistrer(6, { titre: 'عبارة في x و y', questions: 4, f: exA });
  F.enregistrer(16, { titre: 'عبارة في x و y — تمرين مواز', questions: 4, f: exA });

  // --- 7 : B à coefficient 2, puis quatre équations ------------------------
  F.enregistrer(7, { titre: 'معامل مضاعف، ثمّ أربع معادلات', questions: 5, f() {
    return [Q.montrer(S.f7B())].concat(EQ.batterie(4, 0.5));
  } });

  // --- 9 : E et F, la somme donnée, puis trois équations -------------------
  F.enregistrer(9, { titre: 'عبارتان بمعلومية a + b، ثمّ معادلات', questions: 6, f() {
    const e = S.f9E(), g = S.f9F();
    const s = E(nonNul(-14, 14));
    const va = E(nonNul(-9, 9)), vb = E(nonNul(-9, 9));
    return [Q.montrer(e, [g]), Q.montrer(g, [e]),
            Q.parRelation(e, s, [g]), Q.parValeurs(e, va, vb, [g])]
           .concat(EQ.batterie(2, 0.5));
  } });

  // --- 11 : un groupe écrit deux fois s'élimine ---------------------------
  F.enregistrer(11, { titre: 'مجموعة تختفي، ثمّ قيم مطلقة', questions: 3, f() {
    const sh = S.f11(), k = sh.cible.k;
    let cible; do { cible = E(nonNul(-15, 15)); } while (F.egaux(sub(k, cible), E(0)));
    const w = E(nonNul(-9, 9));
    const G4 = add(neg(w), k), f4 = E(ent(1, 9));
    const res4 = add(add(w, abs(G4)), f4);
    return [
      Q.montrer(sh),
      Q.trouverCombinaison(sh, cible),
      {
        enonce: ['احسب', 'b + |-G| + ' + txt(f4), 'إذا كان', 'b = ' + txt(w),
                 'حيث', 'G = ' + Q.forme(sh)],
        indice: '|-G| و |G| لهما نفس القيمة',
        etapes: [
          ['نحسب G', 'G = -' + par(w) + plus(k) + ' = ' + txt(G4)],
          ['القاعدة', '|-G| = |G| لأنّ العددين المتقابلين لهما نفس القيمة المطلقة'],
          ['نحسب القيمة المطلقة', '|-G| = ' + txt(abs(G4))],
          ['نعوّض', 'b + |-G| + ' + txt(f4) + ' = ' + par(w) + ' + ' + txt(abs(G4))
           + ' + ' + txt(f4)],
          ['النتيجة', par(w) + ' + ' + txt(abs(G4)) + ' + ' + txt(f4) + ' = ' + txt(res4)]
        ],
        controle: { type: 'signe', defs: { G: sh.txt }, fixes: { b: w }, libres: [],
                    claims: [{ nom: 'G', vaut: G4 }] }
      }
    ];
  } });

  // --- 12 : valeurs absolues empilées, puis B à trois inconnues -----------
  F.enregistrer(12, { titre: 'قيم مطلقة، ثمّ عبارة بثلاثة مجاهيل', questions: 3, f() {
    let p, q, r, t, v, t1, t2, t3, A;
    for (;;) {
      p = ent(1, 9); q = nonNul(1, 9); r = nonNul(1, 9); t = ent(1, 9);
      v = E(nonNul(-9, 9));
      t1 = abs(add(v, E(q))); t2 = abs(sub(v, E(r))); t3 = abs(v);
      A = add(add(sub(sub(E(-p), t1), neg(t2)), t3), E(t));
      if (t1.n && t2.n && t3.n && A.n) break;
    }
    const exprA = txt(E(-p)) + ' - |a + ' + q + '| + |a - ' + r + '| + |a| - (' + txt(E(-t)) + ')';
    const B = S.f12B();
    const vy = E(nonNul(-9, 9)), vz = E(nonNul(-9, 9));
    return [
      {
        enonce: ['احسب', 'A', 'إذا كان', 'a = ' + txt(v), 'حيث', 'A = ' + exprA],
        indice: 'عوّض أوّلا، ثمّ احسب كل قيمة مطلقة على حدة',
        etapes: [
          ['نعوّض', 'A = ' + txt(E(-p)) + ' - |' + txt(v) + ' + ' + q + '| + |' + txt(v)
           + ' - ' + r + '| + |' + txt(v) + '| + ' + t],
          ['القيمة المطلقة الأولى', '|' + txt(v) + ' + ' + q + '| = ' + txt(t1)],
          ['القيمة المطلقة الثانية', '|' + txt(v) + ' - ' + r + '| = ' + txt(t2)],
          ['القيمة المطلقة الثالثة', '|' + txt(v) + '| = ' + txt(t3)],
          ['نجمع', 'A = ' + txt(E(-p)) + ' - ' + txt(t1) + ' + ' + txt(t2) + ' + '
           + txt(t3) + ' + ' + t],
          ['النتيجة', 'A = ' + txt(A)]
        ],
        controle: { type: 'signe', defs: { A: exprA }, fixes: { a: v }, libres: [],
                    claims: [{ nom: 'A', vaut: A }] }
      },
      Q.montrer(B),
      Q.parValeurs(B, vy, vz)
    ];
  } });

  // --- 17 : quatre comparaisons, toutes par le signe de la différence -----
  F.enregistrer(17, { titre: 'أربع مقارنات بإشارة الفرق', questions: 4, f() {
    const p2 = E(ent(1, 9)), q2 = E(ent(1, 9));
    const p3 = E(ent(1, 12)), q3 = E(ent(1, 9));
    const m4 = ent(2, 12), n4 = ent(1, 9);
    let s, c5, d5, e5;
    do {
      s = E(nonNul(-60, 60));
      c5 = ent(2, 20); d5 = ent(1, 9); e5 = ent(2, 25);
    } while (add(s, E(c5 - d5 + e5 - 1)).n === 0);
    const cste = E(c5 - d5 + e5 - 1), D = add(s, cste), petit = signe(D) < 0;
    return [
      Q.comparerParSigne({ vars: 'a و b', hypothese: 'a < b', libres: ['a', 'b'],
        g: 'a - ' + txt(p2), d: 'b + ' + txt(q2),
        combi: 'a - b', cste: sub(neg(p2), q2), sens: -1 }),
      Q.comparerParSigne({ vars: 'a و b', hypothese: 'a < b', libres: ['a', 'b'],
        g: txt(p3) + ' - a', d: txt(neg(q3)) + ' - b',
        combi: 'b - a', cste: add(p3, q3), sens: 1 }),
      {
        enonce: ['ليكن a و b عددين صحيحين نسبيين؛ قارن', 'X و Y', 'حيث',
                 'X = (' + m4 + ' + a) - b  و  Y = (a - ' + n4 + ') - b'],
        indice: 'الفرق لا يحتوي أيّ مجهول: احسبه',
        etapes: [
          ['نحسب الفرق', 'X - Y = (' + m4 + ' + a - b) - (a - ' + n4 + ' - b)'],
          ['تختفي المجاهيل', 'X - Y = ' + m4 + ' + ' + n4],
          ['نحسب', 'X - Y = ' + (m4 + n4)],
          ['نحدّد إشارة الفرق', (m4 + n4) + ' > 0'],
          ['النتيجة', 'X > Y']
        ],
        controle: { type: 'signe', libres: ['a', 'b'],
                    defs: { X: '(' + m4 + ' + a) - b', Y: '(a - ' + n4 + ') - b' },
                    relation: { g: 'X', d: 'Y', sens: 1 } }
      },
      {
        enonce: ['ليكن m و n عددين صحيحين نسبيين حيث', 'm - n = ' + txt(s),
                 '؛ قارن', 'Z و T', 'حيث',
                 'Z = ' + c5 + ' - (' + d5 + ' - m)  و  T = -' + e5 + ' + (n + 1)'],
        indice: 'انشر ثمّ أظهر m - n',
        etapes: [
          ['نبسّط Z', 'Z = ' + c5 + ' - ' + d5 + ' + m'],
          ['نبسّط T', 'T = -' + e5 + ' + n + 1'],
          ['نحسب الفرق', 'Z - T = (m - n) + (' + c5 + ' - ' + d5 + ' + ' + e5 + ' - 1)'],
          ['نعوّض بالمعطى', 'Z - T = ' + par(s) + ' + ' + par(cste)],
          ['نحسب', 'Z - T = ' + txt(D)],
          ['نحدّد إشارة الفرق', txt(D) + (petit ? ' < 0' : ' > 0')],
          ['النتيجة', 'Z' + (petit ? ' < ' : ' > ') + 'T']
        ],
        controle: { type: 'signe', libres: ['m'],
                    lie: { nom: 'n', via: 'difference', autre: 'm', valeur: s },
                    defs: { Z: c5 + ' - (' + d5 + ' - m)', T: '-' + e5 + ' + (n + 1)' },
                    relation: { g: 'Z', d: 'T', sens: petit ? -1 : 1 } }
      }
    ];
  } });
})(typeof window !== 'undefined' ? window : globalThis);
