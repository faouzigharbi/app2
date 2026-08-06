// Exercice 19 :  G = -[-p - (q - a)] - [(b - r) + (q' - a)]  →  -b + (p + r)
// Le groupe (q - a) figure deux fois avec des signes contraires — l'un écrit
// sous forme réduite, l'autre non. Le voir, c'est éviter tout le calcul.
(function (racine) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports;
  const F = M ? require('./noyau.js') : racine.Somme;
  const S = M ? require('./formes.js') : racine.Formes;
  const Q = M ? require('./questions.js') : racine.Questions;
  const { rat, add, sub, neg, abs, txt, par, plus, ent, choix } = F;

  function f() {
    const sh = S.forme19();                        // G = -b + k
    const k = sh.cible.k;

    // 2) G - (-c) = v   ⟹   G = v - c   ⟹   b = k - (v - c)
    const c = S.fracPos([3, 6]);
    const v = S.decNonRonde();
    const Gvise = sub(neg(v.v), c);
    const bTrouve = sub(k, Gvise);

    // 3) b = -|d - (-e)|
    const d = S.decNonRonde(), e = S.fracPos([2, 4]);
    const dedans = add(d.v, e);
    const b3 = neg(abs(dedans));
    const G3 = add(neg(b3), k);

    // 4) b + |-G| + f, sachant b = w
    const w = rat(S.entNonNul(-9, 9), choix([2, 3]));
    const f4 = S.fracPos([5, 10]);
    const G4 = add(neg(w), k);
    const res4 = add(add(w, abs(G4)), f4);

    return [
      Q.montrer(sh),
      {
        enonce: ['أوجد', 'b', 'إذا كان', 'G - (' + txt(neg(c)) + ') = ' + txt(neg(v.v)),
                 'حيث', 'G = ' + Q.forme(sh)],
        indice: 'استخرج قيمة G أولا، ثمّ ارجع إلى الشكل المختصر',
        etapes: [
          ['نعزل G', 'G = ' + txt(neg(v.v)) + ' + ' + txt(neg(c))],
          ['نحسب قيمة G', 'G = ' + txt(Gvise)],
          ['نستعمل الشكل المختصر', '-b' + plus(k) + ' = ' + txt(Gvise)],
          ['نعزل b', 'b = ' + par(k) + ' - ' + par(Gvise)],
          ['النتيجة', 'b = ' + txt(bTrouve)]
        ],
        controle: { type: 'signe', defs: { G: sh.txt }, fixes: { b: bTrouve },
                    libres: [], claims: [{ nom: 'G', vaut: Gvise }] }
      },
      {
        enonce: ['احسب', 'G', 'إذا كان', 'b = -|' + d.t + ' - (' + txt(neg(e)) + ')|',
                 'حيث', 'G = ' + Q.forme(sh)],
        indice: 'احسب ما بداخل القيمة المطلقة أولا',
        etapes: [
          ['ما بداخل القيمة المطلقة', d.t + ' - (' + txt(neg(e)) + ') = ' + txt(dedans)],
          ['القيمة المطلقة', '|' + txt(dedans) + '| = ' + txt(abs(dedans))],
          ['قيمة b', 'b = ' + txt(b3)],
          ['نعوّض في الشكل المختصر', 'G = -' + par(b3) + plus(k)],
          ['النتيجة', 'G = ' + txt(G3)]
        ],
        controle: { type: 'signe', defs: { G: sh.txt }, fixes: { b: b3 },
                    libres: [], claims: [{ nom: 'G', vaut: G3 }] }
      },
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
        controle: { type: 'signe', defs: { G: sh.txt }, fixes: { b: w },
                    libres: [], claims: [{ nom: 'G', vaut: G4 }] }
      }
    ];
  }
  F.enregistrer(19, { titre: 'مجموعة تختفي، ثمّ قيم مطلقة', f, questions: 4 });
  if (M) module.exports = { f };
})(typeof window !== 'undefined' ? window : globalThis);
