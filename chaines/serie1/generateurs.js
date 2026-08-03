// Les 11 exercices de « سلسلة تمارين عدد 1 » (7 أساسي, الأستاذ صابر بنجدو),
// transformés en chaînes de démonstration générées : les nombres changent à
// chaque rafraîchissement, la chaîne de correction est recalculée avec eux.
//
// Chaque générateur borne ses tirages pour qu'AUCUN résultat, intermédiaire ou
// final, ne soit négatif ou décimal. verifier.js le contrôle sur des milliers
// de tirages — c'est là que les bornes du fichier d'origine se révélaient
// insuffisantes (voir README.md).
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports)
    ? require('./moteur.js') : racine.Moteur;
  const { ent, choix, question, chainePriorite, chaineCommun,
          chaineRegroupe, chaineFacteur, chaineBlanc } = M;

  const NOMS = ['A', 'B', 'C', 'D', 'E', 'F'];
  const CALC = 'احسب:';
  const AISE = n => 'احسب بأيسر طريقة (' + n + '):';

  const R_DIFF    = '(أ − ج) − (ب − ج) = أ − ب';
  const R_SOMME   = '(أ + ج) − (ب + ج) = أ − ب';
  const R_INVERSE = '(أ − ج) + (ب + ج) = أ + ب';

  // Écarts « ronds », ceux que la fiche d'origine utilise.
  const ECARTS = [50, 100, 111, 200, 500, 1000];

  const prio = (nom, expr) =>
    question('priorite', CALC, nom + ' = ' + expr, chainePriorite(expr));

  // ==========================================================================
  // Exercice 1 — QCM de la fiche, converti en chaînes
  // ==========================================================================
  function ex1() {
    const q = [];

    // 1.1  (a − b) × c + d
    const a = ent(20, 34), b = ent(5, 14), c = ent(5, 9), d = ent(2, 11);
    q.push(prio('N', '(' + a + ' - ' + b + ') × ' + c + ' + ' + d));

    // 1.2  Problème du train
    const total = ent(70, 89), monte = ent(15, 24), descend = ent(10, 19);
    q.push(question('blanc',
      'بالقطار ' + total + ' راكبا. في المحطة صعد ' + monte + ' راكبا ونزل '
        + descend + ' راكبا. كم راكبا به بعد المحطة؟',
      null,
      chaineBlanc({
        enonce: '(' + total + ' + ' + monte + ') - ' + descend,
        etapes: [total + ' + ' + monte + ' = ' + (total + monte),
                 (total + monte) + ' - ' + descend],
        res: total + monte - descend
      })));

    // 1.3  (x + b) − c = cible,  avec b > c pour rester dans ℕ
    const x = ent(50, 150), xb = ent(30, 60), xc = ent(10, 29);
    const cible = x + xb - xc;
    q.push(question('blanc',
      'أوجد x حيث (x + ' + xb + ') - ' + xc + ' = ' + cible,
      null,
      chaineBlanc({
        enonce: 'x + (' + xb + ' - ' + xc + ') = ' + cible,
        etapes: [xb + ' - ' + xc + ' = ' + (xb - xc),
                 cible + ' - ' + (xb - xc)],
        res: x
      })));

    // 1.4  (a − c) − (d − c) = cible : le terme commun disparaît
    const ac = ent(400, 500), ad = ent(500, 600), acible = ent(200, 400);
    q.push(question('blanc',
      'أوجد a حيث (a - ' + ac + ') - (' + ad + ' - ' + ac + ') = ' + acible,
      null,
      chaineBlanc({
        enonce: 'الحد المشترك ' + ac + ' يُحذف: a - ' + ad + ' = ' + acible,
        etapes: [acible + ' + ' + ad],
        res: ad + acible
      })));

    return q;
  }

  // ==========================================================================
  // Exercice 2 — أحسب العبارات التالية (priorité des opérations)
  // ==========================================================================
  function ex2() {
    // b - c doit tomber rond : c'est l'occasion d'enseigner le regroupement
    // 299 + 277 - 77 = 299 + (277 - 77) = 299 + 200, et non 576 - 77.
    const ac = ent(50, 199), ak = choix([100, 200, 300]);
    const A = ent(100, 499) + ' + ' + (ac + ak) + ' - ' + ac;

    const b1 = ent(1000, 1499);
    const B = b1 + ' - (' + ent(400, 699) + ' + ' + ent(100, 299) + ')';

    // c2 > c3 : la parenthèse reste positive
    const c3 = ent(300, 499), c2 = ent(c3 + 1, 699);
    const C = ent(2000, 2999) + ' - (' + c2 + ' - ' + c3 + ')';

    // d2 + d3 rond : a - b - c = a - (b + c), sans jamais développer.
    const ds = choix([1000, 1500, 2000]);
    const d2 = ent(400, ds - 200), d3 = ds - d2;
    const D = ent(ds + 800, ds + 2500) + ' - ' + d2 + ' - ' + d3;

    const e4 = ent(20, 69), e3 = ent(e4 + 1, 299);
    const E = ent(100, 199) + ' + ' + ent(400, 599) + ' - (' + e3 + ' - ' + e4 + ')';

    // f2 > f3 + f4 : le crochet reste positif — la borne manquait dans la
    // version d'origine, où [200 − (69 + 149)] pouvait être négatif.
    const f3 = ent(20, 49), f4 = ent(100, 129);
    const f2 = ent(f3 + f4 + 20, 299);
    const F = ent(200, 299) + ' + [' + f2 + ' - (' + f3 + ' + ' + f4 + ')]';

    return [A, B, C, D, E, F].map((e, i) => prio(NOMS[i], e));
  }

  // ==========================================================================
  // Exercice 3 — أكمل بالعدد المناسب
  // ==========================================================================
  function ex3() {
    const q = [];
    const blanc = (enonce, etapes, res) =>
      question('blanc', 'أكمل: ' + enonce, null, chaineBlanc({ enonce, etapes, res }));

    // 1)  a + … = s
    const a1 = ent(40, 89), r1 = ent(5, 24);
    q.push(blanc(a1 + ' + ... = ' + (a1 + r1), [(a1 + r1) + ' - ' + a1], r1));

    // 2)  … − v = r
    const v2 = ent(100, 199), r2 = ent(50, 99);
    q.push(blanc('... - ' + v2 + ' = ' + r2, [r2 + ' + ' + v2], v2 + r2));

    // 3)  s − … = f
    const f3 = ent(200, 399), s3 = ent(f3 + 100, 799);
    q.push(blanc(s3 + ' - ... = ' + f3, [s3 + ' - ' + f3], s3 - f3));

    // 4)  v1 + … + v3 = t
    const v1 = ent(100, 149), v3 = ent(50, 99), r4 = ent(150, 449);
    q.push(blanc(v1 + ' + ... + ' + v3 + ' = ' + (v1 + r4 + v3),
      [v1 + ' + ' + v3 + ' = ' + (v1 + v3), (v1 + r4 + v3) + ' - ' + (v1 + v3)], r4));

    // 5)  p1 − … + p3 = t
    const p1 = ent(200, 249), p3 = ent(50, 79), r5 = ent(50, 150);
    q.push(blanc(p1 + ' - ... + ' + p3 + ' = ' + (p1 + p3 - r5),
      [p1 + ' + ' + p3 + ' = ' + (p1 + p3), (p1 + p3) + ' - ' + (p1 + p3 - r5)], r5));

    // 6)  q1 − (… + q3) = t — bornes resserrées pour que t reste positif
    const q1 = ent(100, 140), q3 = ent(10, 19), r6 = ent(5, 30);
    q.push(blanc(q1 + ' - (... + ' + q3 + ') = ' + (q1 - q3 - r6),
      [q1 + ' - ' + (q1 - q3 - r6) + ' = ' + (q3 + r6), (q3 + r6) + ' - ' + q3], r6));

    return q;
  }

  // ==========================================================================
  // Exercices 4, 5, 6 — terme commun aux deux parenthèses
  // ==========================================================================
  function commun(forme) {
    return NOMS.map(nom => {
      let expr, commun, reduit, regle;
      if (forme === 'diff') {                       // (a − c) − (b − c) = a − b
        const c = ent(100, 199), b = ent(c + 20, c + 200), a = b + choix(ECARTS);
        expr = '(' + a + ' - ' + c + ') - (' + b + ' - ' + c + ')';
        commun = String(c); reduit = a + ' - ' + b; regle = R_DIFF;
      } else if (forme === 'somme') {               // (a + c) − (b + c) = a − b
        const c = ent(100, 999), b = ent(50, 500), a = b + choix(ECARTS);
        expr = '(' + a + ' + ' + c + ') - (' + b + ' + ' + c + ')';
        commun = String(c); reduit = a + ' - ' + b; regle = R_SOMME;
      } else {                                      // (a − c) + (b + c) = a + b
        const rond = choix([1000, 2000, 3000]);
        const a = ent(300, rond - 300), b = rond - a, c = ent(20, 99);
        expr = '(' + a + ' - ' + c + ') + (' + b + ' + ' + c + ')';
        commun = String(c); reduit = a + ' + ' + b; regle = R_INVERSE;
      }
      return question('commun', AISE(nom), expr,
        chaineCommun({ commun, reduit, regle }));
    });
  }

  // ==========================================================================
  // Exercice 7 — (a + b) − c, avec b − c rond
  // ==========================================================================
  function ex7() {
    return NOMS.map(nom => {
      const k = choix([50, 100, 200]);
      const c = ent(20, 99), b = c + k, a = ent(100, 999);
      const expr = '(' + a + ' + ' + b + ') - ' + c;
      return question('regroupe', AISE(nom), expr, chaineRegroupe({
        regroupe: a + ' + (' + b + ' - ' + c + ')',
        remarque: 'نطرح ' + c + ' من ' + b + ' مباشرة'
      }));
    });
  }

  // ==========================================================================
  // Exercice 8 — a − (b + c) = (a − b) − c, avec a − b rond
  // ==========================================================================
  function ex8() {
    return NOMS.map(nom => {
      const rond = choix([100, 300, 400, 1000]);
      const b = ent(50, 500), a = b + rond, c = ent(1, rond - 1);
      const expr = a + ' - (' + b + ' + ' + c + ')';
      return question('regroupe', AISE(nom), expr, chaineRegroupe({
        regroupe: '(' + a + ' - ' + b + ') - ' + c,
        remarque: 'طرح مجموع = طرح متتال'
      }));
    });
  }

  // ==========================================================================
  // Exercice 9 — regroupement des facteurs
  // ==========================================================================
  const PAIRES = [[2, 50], [4, 25], [5, 20], [20, 5], [25, 4], [50, 2], [8, 125], [125, 8]];

  function ex9() {
    return NOMS.map(nom => {
      const [p, q] = choix(PAIRES);
      const m = ent(11, 99);
      const expr = p + ' × ' + m + ' × ' + q;
      return question('regroupe', AISE(nom), expr, chaineRegroupe({
        regroupe: '(' + p + ' × ' + q + ') × ' + m,
        remarque: 'نبحث عن عوامل جداؤها مستدير',
        etiquette: 'نعيد ترتيب العوامل'
      }));
    });
  }

  // ==========================================================================
  // Exercices 10 et 11 — facteur commun
  // ==========================================================================
  function facteur(signe) {
    return NOMS.map(nom => {
      const a = ent(11, 99);
      let b, c, expr;
      if (signe === '+') { b = ent(11, 89); c = 100 - b; }
      else { c = ent(11, 99); b = c + choix([10, 100, 200]); }
      // La fiche écrit parfois le second produit dans l'autre sens.
      const second = Math.random() < 0.5 ? a + ' × ' + c : c + ' × ' + a;
      expr = a + ' × ' + b + ' ' + signe + ' ' + second;
      return question('facteur', AISE(nom), expr, chaineFacteur({
        facteur: String(a),
        factorise: a + ' × (' + b + ' ' + signe + ' ' + c + ')'
      }));
    });
  }

  // ==========================================================================
  const EXERCICES = {
    1:  { titre: 'اختيار من متعدد', f: ex1 },
    2:  { titre: 'أحسب العبارات التالية', f: ex2 },
    3:  { titre: 'أكمل بالعدد المناسب', f: ex3 },
    4:  { titre: 'أيسر طريقة: (أ − ج) − (ب − ج)', f: () => commun('diff') },
    5:  { titre: 'أيسر طريقة: (أ + ج) − (ب + ج)', f: () => commun('somme') },
    6:  { titre: 'أيسر طريقة: (أ − ج) + (ب + ج)', f: () => commun('inverse') },
    7:  { titre: 'أيسر طريقة: (أ + ب) − ج', f: ex7 },
    8:  { titre: 'أيسر طريقة: أ − (ب + ج)', f: ex8 },
    9:  { titre: 'أيسر طريقة: تجميع العوامل', f: ex9 },
    10: { titre: 'أيسر طريقة: العامل المشترك (+)', f: () => facteur('+') },
    11: { titre: 'أيسر طريقة: العامل المشترك (−)', f: () => facteur('-') }
  };

  function construire(n) {
    const e = EXERCICES[n];
    return {
      id: 'serie1_ex' + String(n).padStart(2, '0'),
      title: 'تمرين ' + n + ' — ' + e.titre,
      questions: e.f()
    };
  }

  const API = { EXERCICES, construire };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Generateurs = API;
})(typeof window !== 'undefined' ? window : globalThis);
