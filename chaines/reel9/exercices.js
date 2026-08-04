// Les huit exercices de la fiche « الجمع في ℝ — تمارين مختارة 2023 ».
//
// Tous reposent sur le même geste, décliné : une expression écrite avec des
// parenthèses ET des crochets imbriqués, contenant des lettres réelles et des
// irrationnels (√2, √3, √5, π), qu'il faut d'abord RÉDUIRE. Une fois réduite,
// on s'en sert : on calcule, on cherche une lettre sachant que deux réels sont
// opposés ou égaux, on résout une équation avec valeur absolue.
//
// Le générateur ne part jamais de l'expression compliquée : il part de la
// FORME RÉDUITE qu'il veut obtenir, puis il l'habille. L'arbre est construit
// au hasard, une feuille est laissée libre, et c'est elle qu'on ajuste pour
// retomber sur la cible. On revérifie ensuite en relisant l'expression écrite
// — si l'habillage ne redonne pas la cible, le tirage est jeté.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;
  const A = M ? require('./algebre.js') : racine.Alg;
  const { rat, add, sub, mul, div, neg, abs, signe, egaux, txt, ent, choix } = F;

  const melanger = t => {
    const u = t.slice();
    for (let i = u.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [u[i], u[j]] = [u[j], u[i]];
    }
    return u;
  };
  const petitRat = () => {
    const d = choix([1, 2, 2, 3, 3, 4, 5, 6]);
    let n; do { n = ent(-9, 9); } while (n === 0);
    return rat(n, d);
  };

  // =========================================================================
  // L'ARBRE : une somme de morceaux, dont certains sont des groupes.
  //   somme  = [{ s: ±1, noeud }]
  //   noeud  = { f: élément }              une feuille : un seul terme
  //          | { g: '(' | '[', s: somme }  un groupe
  // =========================================================================
  const feuille = el => ({ f: el });
  const groupe = (g, s) => ({ g, s });

  // Le raccord d'un morceau dans une somme. Un morceau qui commence par « - »
  // ne se colle pas derrière un « + » : « + -1/3 » ne s'écrit pas, on écrit
  // « - 1/3 ». Les deux signes se composent.
  function raccord(s, t, premier) {
    let neg = s < 0;
    if (t[0] === '-' && !/^-.*[+\-]/.test(t.slice(1))) { neg = !neg; t = t.slice(1); }
    if (premier) return (neg ? '-' : '') + t;
    return (neg ? ' - ' : ' + ') + t;
  }
  function texteSomme(somme) {
    return somme.map((p, i) => raccord(p.s, texteNoeud(p.noeud), i === 0)).join('');
  }
  function texteNoeud(n) {
    if (n.f) return A.ecrire(n.f);
    const [o, c] = n.g === '[' ? ['[', ']'] : ['(', ')'];
    return o + texteSomme(n.s) + c;
  }

  // Les feuilles, à plat, avec le signe qu'elles auront une fois les
  // parenthèses enlevées. C'est exactement l'étape que l'élève doit écrire.
  function aplatir(somme, s) {
    s = s === undefined ? 1 : s;
    const out = [];
    for (const p of somme) {
      const sg = s * p.s;
      if (p.noeud.f) out.push({ s: sg, el: p.noeud.f });
      else out.push(...aplatir(p.noeud.s, sg));
    }
    return out;
  }
  const valeurSomme = somme => aplatir(somme).reduce(
    (acc, t) => A.plus(acc, A.fois(rat(t.s), t.el)), A.zero());

  // Une feuille peut porter PLUSIEURS termes (celle qu'on a ajustée pour
  // atteindre la cible en porte souvent trois). Or l'étape « on enlève les
  // parenthèses » doit montrer des termes ATOMIQUES, sinon l'étape suivante,
  // qui les range par nature, compterait deux fois le même morceau.
  function atomiser(plat) {
    const out = [];
    for (const t of plat) {
      for (const k of A.BASE) {
        const c = t.el[k];
        if (!c || c.n === 0) continue;
        out.push({ k, el: A.fois(rat(t.s), A.fois(c, A.un(k))) });
      }
    }
    return out;
  }
  function textePlat(atomes) {
    return atomes.map((t, i) => raccord(1, A.ecrire(t.el), i === 0)).join('');
  }

  // Un terme simple : un rationnel, une lettre, ou un irrationnel.
  function termeSimple(lettres, irrs) {
    const quoi = choix(['rat', 'rat', 'lettre', 'irr']);
    if (quoi === 'lettre' && lettres.length) {
      const l = choix(lettres);
      return A.fois(rat(choix([1, 1, -1])), A.un(l));
    }
    if (quoi === 'irr' && irrs.length) {
      const k = choix(irrs);
      return A.fois(rat(choix([1, -1])), A.un(k));
    }
    return A.cst(petitRat());
  }

  // Un arbre au hasard, dont on repère une feuille LIBRE (la dernière posée).
  function arbreAleatoire(lettres, irrs) {
    const libre = { el: A.cst(rat(1)) };
    const noeudLibre = { f: null };            // rempli plus tard
    const sousSomme = (n, avecGroupe) => {
      const s = [];
      for (let i = 0; i < n; i++) {
        const dedans = avecGroupe && Math.random() < 0.45;
        s.push({
          s: i === 0 ? 1 : choix([1, -1]),
          noeud: dedans ? groupe(choix(['(', '[']), sousSomme(ent(2, 3), false))
            : feuille(termeSimple(lettres, irrs))
        });
      }
      return s;
    };
    // Au moins une CROCHET contenant une parenthèse : c'est la difficulté du
    // chapitre (« x - [1 - (x - 1/2)] »), et une expression plate ne l'a pas.
    const racineS = sousSomme(ent(2, 3), true);
    racineS.splice(1, 0, {
      s: choix([1, -1]),
      noeud: groupe('[', [
        { s: 1, noeud: feuille(termeSimple(lettres, irrs)) },
        { s: choix([1, -1]),
          noeud: groupe('(', sousSomme(ent(2, 3), false)) }
      ])
    });
    // on accroche la feuille libre à la fin, au premier niveau
    racineS.push({ s: choix([1, -1]), noeud: noeudLibre });
    return { somme: racineS, noeudLibre, libre };
  }

  // Un groupe qui vaut zéro — « (5/2 - 5/2) » — n'apprend rien et fait douter
  // l'élève d'avoir mal lu. On refuse l'expression qui en contient un.
  function groupeNul(somme) {
    for (const p of somme) {
      if (p.noeud.f) continue;
      if (A.nul(valeurSomme(p.noeud.s))) return true;
      if (groupeNul(p.noeud.s)) return true;
    }
    return false;
  }

  // Habille `cible` : construit une expression compliquée qui s'y réduit.
  function habiller(cible, lettres, irrs) {
    for (let essai = 0; essai < 300; essai++) {
      const { somme, noeudLibre } = arbreAleatoire(lettres, irrs);
      noeudLibre.f = A.zero();
      const sansLibre = valeurSomme(somme);
      // de combien la feuille libre pèse-t-elle ? on la pousse de 1 et on voit
      noeudLibre.f = A.cst(rat(1));
      const avecUn = valeurSomme(somme);
      const poids = A.moins(avecUn, sansLibre);            // vaut +1 ou -1
      const sg = A.partieRat(poids).n > 0 ? 1 : -1;
      const manque = A.moins(cible, sansLibre);
      noeudLibre.f = A.fois(rat(sg), manque);
      if (A.nul(noeudLibre.f)) continue;                   // feuille vide : laid
      if (groupeNul(somme)) continue;
      const t = texteSomme(somme);
      // on RELIT ce qu'on vient d'écrire : c'est le texte qui fait foi
      let relu;
      try { relu = A.analyser(t); } catch (e) { continue; }
      if (!A.memes(relu, cible)) continue;
      if (t.length > 78) continue;
      return { texte: t, somme };
    }
    return null;
  }

  // =========================================================================
  // Les questions, réutilisées par les huit exercices.
  // =========================================================================

  // 1) « montrer que E = forme réduite »
  function qReduire(nom, expr, cible) {
    const plat = atomiser(aplatir(expr.somme));
    const grouper = () => {
      const morceaux = [];
      for (const k of A.BASE) {
        const t = plat.filter(p => p.k === k);
        if (!t.length) continue;
        morceaux.push(t.length > 1 ? '(' + textePlat(t) + ')' : textePlat(t));
      }
      return morceaux.map((m, i) => raccord(1, m, i === 0)).join('');
    };
    return {
      enonce: ['بيّن أنّ', nom + ' = ' + A.ecrire(cible), 'حيث', nom + ' = ' + expr.texte],
      indice: 'علامة الطرح أمام قوس أو معقوفة تغيّر إشارة كلّ حدّ بداخله',
      etapes: [
        ['القاعدة', 'علامة الطرح أمام قوس تغيّر إشارة كلّ حدّ داخله، و علامة الجمع تُبقيها'],
        ['نزيل الأقواس و المعقوفات', nom + ' = ' + textePlat(plat)],
        ['نرتّب الحدود المتشابهة', nom + ' = ' + grouper()],
        ['نجمع كلّ صنف', 'نجمع الحدود من نفس الطبيعة، و العدد الأصمّ يُعامل كحرف'],
        ['النتيجة', nom + ' = ' + A.ecrire(cible)]
      ],
      controle: { type: 'reduction', nom, brut: expr.texte, reduit: A.ecrire(cible),
                  noms: { [nom]: expr.texte } }
    };
  }

  // 2) « calculer E sachant que <lettre> = valeur » (ou qu'une combinaison vaut)
  function qCalculer(nom, cible, lettre, valeur) {
    const substitue = {}; substitue[lettre] = valeur;
    const res = A.analyser(A.ecrire(cible), substitue);
    return {
      enonce: ['احسب ' + nom, 'إذا كان', lettre + ' = ' + A.ecrire(valeur),
               'علما أنّ', nom + ' = ' + A.ecrire(cible)],
      indice: 'عوّض ' + lettre + ' بقيمته في الشكل المختصر، ثمّ اجمع الحدود المتشابهة',
      etapes: [
        ['نستعمل الشكل المختصر', nom + ' = ' + A.ecrire(cible)],
        ['نعوّض', nom + ' = ' + A.ecrire(cible).replace(
          new RegExp('(?<![a-zA-Z])' + lettre + '(?![a-zA-Z])'), A.par(valeur))],
        ['نزيل القوس', nom + ' = ' + textePlat(
          [{ s: 1, el: A.moins(cible, A.fois(cible[lettre] || rat(0), A.un(lettre))) },
           { s: 1, el: A.fois(cible[lettre] || rat(0), valeur) }])],
        ['نجمع الحدود المتشابهة', 'نجمع الأعداد الناطقة مع بعضها و الأعداد الصمّاء مع بعضها'],
        ['النتيجة', nom + ' = ' + A.ecrire(res)]
      ],
      controle: { type: 'substitution', expr: A.ecrire(cible), lettre,
                  valeur: A.ecrire(valeur), res: A.ecrire(res),
                  noms: { [nom]: A.ecrire(cible) } }
    };
  }

  // Résoudre « c·lettre + reste = but » — tout est linéaire, jamais de produit.
  function resoudre(cible, lettre, but) {
    const c = cible[lettre];
    if (!c || c.n === 0) return null;
    const reste = A.moins(cible, A.fois(c, A.un(lettre)));
    const v = A.fois(div(rat(1), c), A.moins(but, reste));
    if (v[lettre]) return null;                    // la lettre reviendrait sur elle-même
    return v;
  }

  // 3) « E et T sont opposés » / « E et T sont égaux »
  function qRelation(nom, cible, lettre, autre, oppose) {
    const but = oppose ? A.oppose(autre) : autre;
    const v = resoudre(cible, lettre, but);
    if (!v) return null;
    // « أوجد b » doit donner un NOMBRE, pas « b en fonction de a » : on exige
    // que l'autre lettre se soit simplifiée. C'est ce que fait la fiche.
    for (const l of A.LETTRES) if (l !== lettre && v[l] && v[l].n !== 0) return null;
    const c = cible[lettre];
    const reste = A.moins(cible, A.fois(c, A.un(lettre)));
    return {
      enonce: ['أوجد العدد الحقيقي ' + lettre, 'إذا علمت أنّ ' + nom + ' و '
               + A.ecrire(autre) + (oppose ? ' متقابلان' : ' متساويان'),
               'علما أنّ', nom + ' = ' + A.ecrire(cible)],
      indice: oppose
        ? 'عددان متقابلان مجموعهما منعدم، أي أنّ ' + nom + ' يساوي مقابل العدد الآخر'
        : 'متساويان يعني ' + nom + ' = ' + A.ecrire(autre),
      etapes: [
        ['نترجم المعطى', oppose
          ? 'عددان متقابلان مجموعهما منعدم: ' + nom + ' = -(' + A.ecrire(autre) + ')'
          : 'متساويان معناه ' + nom + ' = ' + A.ecrire(autre)],
        ['نكتب المعادلة', A.ecrire(cible) + ' = ' + A.ecrire(but)],
        ['نعزل ' + lettre, A.ecrire(A.fois(c, A.un(lettre))) + ' = ' + A.ecrire(but)
          + ' - (' + A.ecrire(reste) + ')'],
        ['نحسب الطرف الثاني', A.ecrire(but) + ' - (' + A.ecrire(reste) + ') = '
          + A.ecrire(A.moins(but, reste))],
        ['النتيجة', lettre + ' = ' + A.ecrire(v)]
      ],
      controle: { type: 'equation', expr: A.ecrire(cible), lettre,
                  solution: A.ecrire(v), but: A.ecrire(but),
                  noms: { [nom]: A.ecrire(cible) } }
    };
  }

  // 4) « |E + k| = r » — deux cas, ou aucun si r est négatif
  function qAbsolue(nom, cible, lettre, k, r) {
    const dedans = A.plus(cible, A.cst(k));
    const possible = r.n >= 0;
    const s1 = possible ? resoudre(dedans, lettre, A.cst(r)) : null;
    const s2 = possible ? resoudre(dedans, lettre, A.cst(neg(r))) : null;
    if (possible && (!s1 || !s2)) return null;
    const dedansTxt = A.ecrire(dedans);
    const etapes = [
      ['القاعدة', 'من أجل r موجب، |X| = r يعني X = r أو X = -r ؛ و إذا كان r سالبا فلا حلّ'],
      ['نكتب ما بداخل القيمة المطلقة', nom + (k.n < 0 ? ' - ' + txt(neg(k)) : ' + ' + txt(k)) + ' = ' + dedansTxt]
    ];
    if (!possible) {
      etapes.push(['نقارن الطرف الثاني بالصفر', txt(r) + ' أصغر من الصفر']);
      etapes.push(['القيمة المطلقة موجبة دائما', 'القيمة المطلقة لعدد حقيقي لا تكون سالبة أبدا']);
      etapes.push(['النتيجة', 'لا يوجد أيّ حلّ']);
    } else {
      etapes.push(['الحالة الأولى', dedansTxt + ' = ' + txt(r)]);
      etapes.push(['الحلّ الأوّل', lettre + ' = ' + A.ecrire(s1)]);
      etapes.push(['الحالة الثانية', dedansTxt + ' = ' + txt(neg(r))]);
      etapes.push(['الحلّ الثاني', lettre + ' = ' + A.ecrire(s2)]);
      etapes.push(['النتيجة', 'للمعادلة حلاّن اثنان']);
    }
    return {
      enonce: ['أوجد ' + lettre, 'إذا علمت أنّ', '|' + nom + (k.n < 0 ? ' - ' + txt(neg(k)) : ' + ' + txt(k)) + '| = ' + txt(r),
               'علما أنّ', nom + ' = ' + A.ecrire(cible)],
      indice: 'ابدأ بحساب ما بداخل القيمة المطلقة، ثمّ قارن الطرف الثاني بالصفر',
      etapes,
      controle: { type: 'absolue', dedans: dedansTxt, lettre, r: txt(r),
                  solutions: possible ? [A.ecrire(s1), A.ecrire(s2)] : [],
                  noms: { [nom]: A.ecrire(cible) } }
    };
  }

  // 5) « trouver |lettre| sachant que E - k = irrationnel »
  function qValeurAbsolue(nom, cible, lettre, k, but) {
    const v = resoudre(A.moins(cible, A.cst(k)), lettre, but);
    if (!v) return null;
    const num = A.valeur(v);
    if (!isFinite(num) || Math.abs(num) < 0.35) return null;  // signe lisible
    const av = num < 0 ? A.oppose(v) : v;
    return {
      enonce: ['أوجد |' + lettre + '|', 'إذا علمت أنّ',
               nom + (k.n < 0 ? ' + ' + txt(neg(k)) : ' - ' + txt(k)) + ' = ' + A.ecrire(but),
               'علما أنّ', nom + ' = ' + A.ecrire(cible)],
      indice: 'احسب ' + lettre + ' أوّلا، ثمّ حدّد إشارته قبل كتابة قيمته المطلقة',
      etapes: [
        ['نكتب المعادلة', A.ecrire(A.moins(cible, A.cst(k))) + ' = ' + A.ecrire(but)],
        ['نعزل ' + lettre, lettre + ' = ' + A.ecrire(v)],
        ['نحدّد الإشارة', 'العدد ' + A.ecrire(v) + ' هو عدد '
          + (num < 0 ? 'سالب' : 'موجب') + ' تقريبا يساوي ' + num.toFixed(2)],
        ['القاعدة', 'القيمة المطلقة لعدد موجب هي هو نفسه، و لعدد سالب هي مقابله'],
        ['النتيجة', '|' + lettre + '| = ' + A.ecrire(av)]
      ],
      controle: { type: 'valeurAbsolue', expr: A.ecrire(cible), lettre, k: txt(k),
                  but: A.ecrire(but), solution: A.ecrire(v), absolue: A.ecrire(av),
                  noms: { [nom]: A.ecrire(cible) } }
    };
  }

  // 6) une équation dans ℝ, écrite avec crochets et irrationnels
  function qEquation(lettre) {
    for (let essai = 0; essai < 200; essai++) {
      const irr = choix(A.IRR);
      const cible = A.plus(A.fois(rat(choix([1, -1])), A.un(lettre)),
        A.plus(A.cst(petitRat()), A.fois(rat(choix([1, -1])), A.un(irr))));
      const expr = habiller(cible, [lettre], [irr]);
      if (!expr) continue;
      const but = A.plus(A.cst(petitRat()), A.fois(rat(choix([0, 1, -1])), A.un(irr)));
      const v = resoudre(cible, lettre, but);
      if (!v || A.nul(v)) continue;
      const c = cible[lettre];
      const reste = A.moins(cible, A.fois(c, A.un(lettre)));
      return {
        enonce: ['جد العدد الحقيقي ' + lettre + ' بحيث:', expr.texte + ' = ' + A.ecrire(but)],
        indice: 'اختصر الطرف الأوّل أوّلا: الأقواس تختفي و يبقى ' + lettre + ' مع أعداد',
        etapes: [
          ['نختصر الطرف الأوّل', expr.texte + ' = ' + A.ecrire(cible)],
          ['نكتب المعادلة المختصرة', A.ecrire(cible) + ' = ' + A.ecrire(but)],
          ['نعزل ' + lettre, A.ecrire(A.fois(c, A.un(lettre))) + ' = ' + A.ecrire(but)
            + ' - (' + A.ecrire(reste) + ')'],
          ['نحسب الطرف الثاني', A.ecrire(but) + ' - (' + A.ecrire(reste) + ') = '
            + A.ecrire(A.moins(but, reste))],
          ['النتيجة', lettre + ' = ' + A.ecrire(v)]
        ],
        controle: { type: 'equation', expr: A.ecrire(cible), lettre,
                    solution: A.ecrire(v), but: A.ecrire(but),
                    identites: [[expr.texte, A.ecrire(cible)]] }
      };
    }
    return null;
  }

  // 7) « 3/2 - |b| = r » : le cas impossible de la fiche, et son jumeau possible
  function qAbsolueIsolee(lettre) {
    const a = petitRat();
    const impossible = Math.random() < 0.5;
    const m = impossible ? add(a, rat(ent(1, 5), choix([1, 2])))
      : sub(a, rat(ent(1, 6), choix([1, 2])));
    const cible = sub(a, m);                        // vaut |lettre|
    if (cible.n === 0 || m.n === 0) return null;    // « - 0 » ne s'écrit pas
    const eq = txt(a) + (m.n < 0 ? ' + ' + txt(neg(m)) : ' - ' + txt(m));
    const etapes = [
      ['نعزل القيمة المطلقة', eq + ' = ' + txt(cible)],
      // Dans le cas impossible, « |b| = -5/2 » n'est pas une identité à
      // vérifier : c'est la contradiction qu'on exhibe. On l'énonce donc en
      // toutes lettres, et c'est le contrôle qui juge de sa fausseté.
      [cible.n < 0 ? 'نصل إلى المعادلة' : 'نكتب المعادلة',
        cible.n < 0 ? 'نصل إلى |' + lettre + '| = ' + txt(cible)
          : '|' + lettre + '| = ' + txt(cible)]
    ];
    if (cible.n < 0) {
      etapes.push(['نقارن بالصفر', txt(cible) + ' أصغر من الصفر']);
      etapes.push(['القاعدة', 'القيمة المطلقة لعدد حقيقي لا تكون سالبة أبدا']);
      etapes.push(['النتيجة', 'لا يوجد أيّ حلّ']);
    } else {
      etapes.push(['القاعدة', 'من أجل r موجب، |X| = r يعني X = r أو X = -r']);
      etapes.push(['الحلّ الأوّل', lettre + ' = ' + txt(cible)]);
      etapes.push(['الحلّ الثاني', lettre + ' = ' + txt(neg(cible))]);
      etapes.push(['النتيجة', 'للمعادلة حلاّن متقابلان']);
    }
    return {
      enonce: ['أوجد ' + lettre + ' إن أمكن ذلك، إذا علمت أنّ',
               txt(a) + ' - |' + lettre + '| = ' + txt(m)],
      indice: 'اعزل |' + lettre + '| أوّلا، ثمّ قارن ما تحصّلت عليه بالصفر',
      etapes,
      controle: { type: 'absolueIsolee', a: txt(a), m: txt(m), lettre,
                  valeur: txt(cible), possible: cible.n >= 0 }
    };
  }

  // =========================================================================
  // Les huit pages
  // =========================================================================
  const IRR2 = ['√2', '√3', '√5'];

  // Fabrique une cible « lettre + rationnel + irrationnel » et son habillage.
  function poser(nom, lettres, irrs, coefs) {
    for (let essai = 0; essai < 200; essai++) {
      let cible = A.cst(petitRat());
      for (const l of lettres) cible = A.plus(cible, A.fois(rat(choix(coefs || [1, -1])), A.un(l)));
      for (const k of irrs) cible = A.plus(cible, A.fois(rat(choix([1, -1])), A.un(k)));
      const expr = habiller(cible, lettres, irrs);
      if (expr) return { cible, expr, nom };
    }
    return null;
  }

  const ok = t => t.filter(Boolean);

  // EX1 — une lettre, un irrationnel : le modèle de base, six questions.
  function exercice1() {
    for (let essai = 0; essai < 120; essai++) {
      const irr = choix(IRR2);
      const p = poser('E', ['x'], [irr], [1, -1]);
      if (!p) continue;
      const autre = A.plus(A.cst(petitRat()), A.fois(rat(choix([1, -1])), A.un(irr)));
      const qs = ok([
        qReduire('E', p.expr, p.cible),
        qCalculer('E', p.cible, 'x', A.plus(A.cst(petitRat()), A.fois(rat(-1), A.un(irr)))),
        qRelation('E', p.cible, 'x', autre, true),
        qRelation('E', p.cible, 'x', A.plus(A.cst(petitRat()), A.un(choix(IRR2))), false),
        qAbsolue('E', p.cible, 'x', petitRat(), rat(ent(1, 9), choix([1, 2]))),
        qValeurAbsolue('E', p.cible, 'x', petitRat(), A.un(choix(IRR2)))
      ]);
      if (qs.length === 6) return qs;
    }
    return exercice1();
  }

  // EX2 — deux expressions C et D, deux lettres : on les réduit toutes deux.
  function exercice2() {
    for (let essai = 0; essai < 120; essai++) {
      const i1 = '√2', i2 = '√3';
      const pc = poser('C', ['x'], [i1], [-1, 1]);
      const pd = poser('D', ['y'], [i2], [1, -1]);
      if (!pc || !pd) continue;
      const qs = ok([
        qReduire('C', pc.expr, pc.cible),
        qReduire('D', pd.expr, pd.cible),
        qRelation('C', pc.cible, 'x', A.plus(A.cst(petitRat()), A.un(i1)), true),
        qRelation('D', pd.cible, 'y', A.plus(A.cst(petitRat()), A.fois(rat(-1), A.un('π'))), false),
        qAbsolue('D', pd.cible, 'y', petitRat(), rat(ent(1, 8), choix([1, 2]))),
        qValeurAbsolue('C', pc.cible, 'x', petitRat(), A.un(i2))
      ]);
      if (qs.length === 6) return qs;
    }
    return exercice2();
  }

  // EX3 — deux lettres dans la MÊME expression, avec π : « E = a - b - π ».
  function exercice3() {
    for (let essai = 0; essai < 120; essai++) {
      const p = poser('E', ['a', 'b'], ['π'], [1, -1]);
      if (!p) continue;
      if (!p.cible.a || !p.cible.b) continue;
      const qs = ok([
        qReduire('E', p.expr, p.cible),
        qCalculer('E', p.cible, 'a', A.plus(A.cst(petitRat()), A.un('b'))),
        qRelation('E', p.cible, 'b', A.plus(A.cst(rat(22, 7)), A.fois(rat(-1), A.un('a'))), true),
        qRelation('E', p.cible, 'a', A.plus(A.cst(petitRat()),
          A.oppose(A.plus(A.un('π'), A.un('b')))), false)
      ]);
      if (qs.length === 4) return qs;
    }
    return exercice3();
  }

  // EX4 — une valeur absolue EN TÊTE de l'expression : |√2 - 3/2| - [...]
  function exercice4() {
    for (let essai = 0; essai < 150; essai++) {
      const irr = choix(IRR2);
      const p = poser('E', ['x', 'y'], [irr], [-1]);
      if (!p) continue;
      // on préfixe l'expression d'une valeur absolue numérique, qu'il faut
      // d'abord dépouiller de son signe avant de la joindre au reste
      const c = abs(petitRat());        // positif : le signe se discute
      const tete = A.moins(A.un(irr), A.cst(c));
      const v = A.valeur(tete);
      if (!isFinite(v) || Math.abs(v) < 0.35) continue;   // signe lisible
      const teteVal = v < 0 ? A.oppose(tete) : tete;
      const cible2 = A.plus(p.cible, teteVal);
      // si l'irrationnel de la tête annule celui du corps, la forme réduite
      // devient rationnelle : l'exercice ne parle plus de ℝ. On rejette.
      if (!A.IRR.some(k => cible2[k] && cible2[k].n !== 0)) continue;
      const texte = '|' + A.ecrire(tete) + '|' + raccord(1, p.expr.texte, false);
      let relu; try { relu = A.analyser(texte); } catch (e) { continue; }
      if (!A.memes(relu, cible2)) continue;
      const plat = atomiser(aplatir(p.expr.somme));
      const q1 = {
        enonce: ['بيّن أنّ', 'E = ' + A.ecrire(cible2), 'حيث', 'E = ' + texte],
        indice: 'ابدأ بالقيمة المطلقة: حدّد إشارة ' + A.ecrire(tete) + ' قبل إزالتها',
        etapes: [
          ['نحدّد إشارة ما بداخل القيمة المطلقة', A.ecrire(tete) + ' عدد '
            + (v < 0 ? 'سالب' : 'موجب') + ' تقريبا يساوي ' + v.toFixed(2)],
          ['نزيل القيمة المطلقة', '|' + A.ecrire(tete) + '| = ' + A.ecrire(teteVal)],
          ['نزيل الأقواس و المعقوفات', 'E = ' + A.ecrire(teteVal)
            + raccord(1, textePlat(plat), false)],
          ['نجمع الحدود المتشابهة', 'نجمع الأعداد الناطقة معا و الأعداد الصمّاء معا'],
          ['النتيجة', 'E = ' + A.ecrire(cible2)]
        ],
        controle: { type: 'reduction', nom: 'E', brut: texte, reduit: A.ecrire(cible2),
                    noms: { E: texte } }
      };
      // « trouver y sachant que E = 0 » n'a de réponse chiffrée que si x est
      // fixé d'abord — sinon on exprimerait y en fonction de x, ce que la
      // fiche ne demande pas. On donne donc x, comme elle : x = |1 - √2|.
      const xTete = A.moins(A.un(irr), A.cst(rat(1)));
      const xVal = A.valeur(xTete) < 0 ? A.oppose(xTete) : xTete;
      const cible3 = A.analyser(A.ecrire(cible2), { x: xVal });
      const qy = qRelation('E', cible3, 'y', A.cst(rat(0)), false);
      const qs = ok([
        q1,
        qCalculer('E', cible2, 'y', A.fois(rat(-1), A.un('x'))),
        qy && Object.assign(qy, {
          enonce: ['أوجد y', 'إذا كان E = 0 و x = |1 - ' + irr + '|',
                   'علما أنّ', 'E = ' + A.ecrire(cible2)],
          etapes: [['نحسب x', '|1 - ' + irr + '| = ' + A.ecrire(xVal)],
                   ['نعوّض x في E', 'E = ' + A.ecrire(cible3)]].concat(qy.etapes.slice(1))
        }),
        // La dernière question porte sur cible3, où x est déjà remplacé : sur
        // cible2 il reste DEUX lettres, et « trouver x » n'aurait pas de
        // réponse chiffrée — le signe même serait indécidable.
        qAbsolue('E', cible3, 'y', petitRat(), rat(ent(1, 8), choix([1, 2])))
      ]);
      if (qs.length === 4) return qs;
    }
    return exercice4();
  }

  // EX5 — deux expressions E et F sur les mêmes lettres, et des relations
  // qui les mêlent : « E + b + F = 5 ».
  function exercice5() {
    for (let essai = 0; essai < 150; essai++) {
      const pe = poser('E', ['a', 'b'], ['π'], [1, -1]);
      const pf = poser('F', ['a', 'b'], ['π'], [1, -1]);
      if (!pe || !pf) continue;
      if (!pe.cible.a || !pf.cible.b) continue;
      const somme = A.plus(A.plus(pe.cible, pf.cible), A.un('b'));
      const sol = resoudre(somme, 'a', A.cst(rat(ent(-6, 6))));
      if (!sol || sol.a) continue;
      const but = A.plus(A.plus(pe.cible, pf.cible), A.un('b'));
      const qs = ok([
        qReduire('E', pe.expr, pe.cible),
        qReduire('F', pf.expr, pf.cible),
        qCalculer('E', pe.cible, 'a', A.moins(A.cst(rat(2)), A.un('b'))),
        {
          enonce: ['أوجد a', 'إذا علمت أنّ', 'E + b + F = ' + A.ecrire(A.cst(rat(0))),
                   'علما أنّ', 'E = ' + A.ecrire(pe.cible), 'و', 'F = ' + A.ecrire(pf.cible)],
          indice: 'اجمع الشكلين المختصرين أوّلا، ثمّ اعزل a',
          etapes: [
            ['نجمع الشكلين المختصرين', 'E + b + F = ' + A.ecrire(but)],
            ['نكتب المعادلة', A.ecrire(but) + ' = 0'],
            ['نعزل a', A.ecrire(A.fois(but.a, A.un('a'))) + ' = 0 - ('
              + A.ecrire(A.moins(but, A.fois(but.a, A.un('a')))) + ')'],
            ['نحسب الطرف الثاني', '0 - (' + A.ecrire(A.moins(but, A.fois(but.a, A.un('a'))))
              + ') = ' + A.ecrire(A.oppose(A.moins(but, A.fois(but.a, A.un('a')))))],
            ['النتيجة', 'a = ' + A.ecrire(resoudre(but, 'a', A.cst(rat(0))))]
          ],
          controle: { type: 'equation', expr: A.ecrire(but), lettre: 'a',
                      solution: A.ecrire(resoudre(but, 'a', A.cst(rat(0)))),
                      but: '0',
                      noms: { E: A.ecrire(pe.cible), F: A.ecrire(pf.cible) } }
        }
      ]);
      if (qs.length === 4) return qs;
    }
    return exercice5();
  }

  // EX6 — la page des ÉQUATIONS : quatre équations dans ℝ, quatre lettres.
  function exercice6() {
    const qs = ok(['x', 'y', 'a', 'b'].map(qEquation));
    return qs.length === 4 ? qs : exercice6();
  }

  // EX7 — M et N, opposés puis égaux : on cherche a + b puis a - b.
  function exercice7() {
    for (let essai = 0; essai < 150; essai++) {
      // Pour que « a + b » ET « a - b » aient tous deux une réponse, il faut
      // que M porte (p ; q) sur (a ; b) et N porte (q ; p) — coefficients
      // CROISÉS. Avec des coefficients tous égaux à ±1 c'est impossible :
      // l'une des deux questions perd toujours son inconnue.
      const p = choix([1, 2, 3]);
      const q = choix([1, 2, 3].filter(z => z !== p));
      const cibleM = A.plus(A.plus(A.fois(rat(p), A.un('a')), A.fois(rat(q), A.un('b'))),
        A.plus(A.cst(petitRat()), A.fois(rat(choix([1, -1])), A.un('√2'))));
      const cibleN = A.plus(A.plus(A.fois(rat(q), A.un('a')), A.fois(rat(p), A.un('b'))),
        A.plus(A.cst(petitRat()), A.fois(rat(choix([1, -1])), A.un('π'))));
      const em = habiller(cibleM, ['a', 'b'], ['√2']);
      const en = habiller(cibleN, ['a', 'b'], ['π']);
      if (!em || !en) continue;
      const pm = { cible: cibleM, expr: em }, pn = { cible: cibleN, expr: en };
      const s = A.plus(pm.cible, pn.cible);          // nul quand ils sont opposés
      const d = A.moins(pm.cible, pn.cible);         // nul quand ils sont égaux
      // pour que « a + b » puis « a - b » aient un sens, il faut les bons
      // coefficients : a et b doivent y apparaître avec le même poids
      if (!s.a || !s.b || !egaux(s.a, s.b)) continue;
      if (!d.a || !d.b || !egaux(d.a, neg(d.b))) continue;
      const sReste = A.moins(s, A.plus(A.fois(s.a, A.un('a')), A.fois(s.b, A.un('b'))));
      const dReste = A.moins(d, A.plus(A.fois(d.a, A.un('a')), A.fois(d.b, A.un('b'))));
      const vs = A.fois(div(rat(1), s.a), A.oppose(sReste));
      const vd = A.fois(div(rat(1), d.a), A.oppose(dReste));
      const qs = ok([
        qReduire('M', pm.expr, pm.cible),
        qReduire('N', pn.expr, pn.cible),
        {
          enonce: ['أوجد a + b', 'إذا علمت أنّ M و N متقابلان', 'علما أنّ',
                   'M = ' + A.ecrire(pm.cible), 'و', 'N = ' + A.ecrire(pn.cible)],
          indice: 'متقابلان يعني M + N = 0: اجمع الشكلين المختصرين',
          etapes: [
            ['نترجم المعطى', 'عددان متقابلان مجموعهما منعدم: M + N = 0'],
            ['نجمع الشكلين المختصرين', 'M + N = ' + A.ecrire(s)],
            ['نكتب المعادلة', A.ecrire(s) + ' = 0'],
            ['نعزل حدود الحرفين', A.ecrire(A.plus(A.fois(s.a, A.un('a')), A.fois(s.b, A.un('b'))))
              + ' = ' + A.ecrire(A.oppose(sReste))],
            ['نقسم على المعامل', 'a + b = ' + A.ecrire(vs)],
            ['النتيجة', 'a + b = ' + A.ecrire(vs)]
          ],
          controle: { type: 'combinaison', expr: A.ecrire(s), ca: txt(s.a), cb: txt(s.b),
                      valeur: A.ecrire(vs), signeB: 1,
                      noms: { M: A.ecrire(pm.cible), N: A.ecrire(pn.cible) } }
        },
        {
          enonce: ['أوجد a - b', 'إذا علمت أنّ M و N متساويان', 'علما أنّ',
                   'M = ' + A.ecrire(pm.cible), 'و', 'N = ' + A.ecrire(pn.cible)],
          indice: 'متساويان يعني M - N = 0: اطرح الشكلين المختصرين',
          etapes: [
            ['نترجم المعطى', 'متساويان يعني أنّ فرقهما منعدم: M - N = 0'],
            ['نطرح الشكلين المختصرين', 'M - N = ' + A.ecrire(d)],
            ['نكتب المعادلة', A.ecrire(d) + ' = 0'],
            ['نعزل حدود الحرفين', A.ecrire(A.plus(A.fois(d.a, A.un('a')), A.fois(d.b, A.un('b'))))
              + ' = ' + A.ecrire(A.oppose(dReste))],
            ['نقسم على المعامل', 'a - b = ' + A.ecrire(vd)],
            ['النتيجة', 'a - b = ' + A.ecrire(vd)]
          ],
          controle: { type: 'combinaison', expr: A.ecrire(d), ca: txt(d.a), cb: txt(d.b),
                      valeur: A.ecrire(vd), signeB: -1,
                      noms: { M: A.ecrire(pm.cible), N: A.ecrire(pn.cible) } }
        }
      ]);
      if (qs.length === 4) return qs;
    }
    return exercice7();
  }

  // EX8 — la valeur absolue sous toutes ses formes, y compris IMPOSSIBLE.
  function exercice8() {
    for (let essai = 0; essai < 150; essai++) {
      const irr = choix(IRR2);
      const p = poser('M', ['a'], [irr], [1, -1]);
      if (!p) continue;
      const qs = ok([
        qReduire('M', p.expr, p.cible),
        qAbsolue('M', p.cible, 'a', petitRat(), rat(ent(1, 9), choix([1, 2]))),
        qAbsolueIsolee(choix(['b', 'y'])),
        qValeurAbsolue('M', p.cible, 'a', petitRat(), A.un(choix(IRR2)))
      ]);
      if (qs.length === 4) return qs;
    }
    return exercice8();
  }

  const API = { exercice1, exercice2, exercice3, exercice4, exercice5,
                exercice6, exercice7, exercice8,
                habiller, aplatir, textePlat, texteSomme, poser,
                qReduire, qCalculer, qRelation, qAbsolue, qValeurAbsolue,
                qEquation, qAbsolueIsolee, resoudre };
  if (M) module.exports = API;
  else racine.Exos = API;
})(typeof window !== 'undefined' ? window : globalThis);
