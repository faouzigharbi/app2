// LES ÉNONCÉS — « التمرين الأول » de « Applications élémentaires de la
// propriété de Thalès », quinze items de a à o.
//
// Trois formes s'y lisent : le trou au numérateur, le trou au dénominateur, et
// la chaîne de TROIS fractions (items m, n, o). Les nombres de la feuille sont
// des dixièmes et des centièmes — 7,5 ; 10,5 ; 32,76 —, donc des rationnels
// exacts, et la réponse ne s'arrondit jamais.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Proport;

  const ITEMS = [];
  const item = (src, f, d, monter) => ITEMS.push({ src, f, n: 9, d, monter });

  // Un rapport de base, et des multiplicateurs qui gardent des écritures
  // décimales courtes : c'est ainsi que la feuille est faite.
  const dixieme = k => F.q(k, 10);

  // Une suite de fractions toutes égales au rapport p/q.
  // LE RAPPORT NE VAUT PAS 1. Tiré au hasard, p et q pouvaient sortir égaux —
  // « 18/18 = …/6 », un exercice qui ne demande rien. On les sépare.
  function rapport() {
    const p = F.q(F.ent(2, 9));
    let n = F.ent(2, 9);
    while (n === Number(p.n)) n = F.ent(2, 9);
    return [p, F.q(n)];
  }

  function suite(p, q2, combien) {
    const out = [];
    const facteurs = F.melanger([2, 3, 4, 5, 6, 8, 12, 15, 25]).slice(0, combien);
    for (const k of facteurs) out.push([F.qMul(p, F.q(k)), F.qMul(q2, F.q(k))]);
    return out;
  }

  // ── a, b, d, e, f, h, i, j, k, l — deux fractions, un trou ──────────────
  for (const ou of ['n', 'd']) {
    item('Applications_Thales التمرين الأول', 'deux-fractions',
         ou === 'n' ? 'facile' : 'moyen', () => {
      // Des entiers simples d'un côté, des dixièmes de l'autre : 4/5 = …/7,5
      const [p, q2] = rapport();
      const fr = suite(p, q2, 2);
      // Un dixième au moins, pour retrouver l'allure de la feuille.
      if (F.ent(0, 1)) { const k = dixieme(F.ent(11, 49));
        fr[1] = [F.qMul(p, k), F.qMul(q2, k)]; }
      return { fr, trou: [1, ou] };
    });
  }

  // ── c, g — le trou est dans la fraction de GAUCHE ───────────────────────
  for (const ou of ['n', 'd']) {
    item('Applications_Thales التمرين الأول — c, g', 'deux-fractions',
         'moyen', () => {
      const [p, q2] = rapport();
      const fr = suite(p, q2, 2);
      const k = dixieme(F.ent(11, 49));
      fr[1] = [F.qMul(p, k), F.qMul(q2, k)];
      return { fr, trou: [0, ou],
               indice: 'الكسر المعلوم هو الثاني : ابدأ منه' };
    });
  }

  // ── m, n, o — trois fractions en chaîne ─────────────────────────────────
  for (const ou of ['n', 'd']) {
    item('Applications_Thales التمرين الأول — m, n, o', 'trois-fractions',
         'difficile', () => {
      const [p, q2] = rapport();
      const fr = suite(p, q2, 3);
      const k = dixieme(F.ent(11, 39));
      fr[2] = [F.qMul(p, k), F.qMul(q2, k)];
      return { fr, trou: [F.choix([1, 2]), ou],
               indice: 'ثلاثة كسور متساوية : يكفي كسر واحد معلوم' };
    });
  }

  // ── l. « 4,7/6,3 = …/32,76 » — la réponse n'a PAS d'écriture décimale ────
  //
  // Tous les items ci-dessus tirent des dixièmes, donc leurs réponses sont des
  // dixièmes : la consigne « laisse une fraction irréductible » ne s'y voit
  // jamais à l'œuvre, et la falsification « réponse arrondie » ne trouvait
  // rien à abîmer. L'item l. de la feuille, lui, donne un quotient qui ne
  // tombe pas — c'est celui-là qui met la règle à l'épreuve.
  for (const ou of ['n', 'd']) {
    item('Applications_Thales التمرين الأول — l', 'sans-ecriture-decimale',
         'difficile', () => {
      const [p, q2] = rapport();
      // Un multiplicateur en septièmes ou en tiers : le dénominateur garde un
      // facteur qui interdit toute écriture décimale finie.
      const k = F.q(F.ent(2, 9), F.choix([3, 7, 9, 11]));
      const fr = [[p, q2], [F.qMul(p, k), F.qMul(q2, k)]];
      return { fr, trou: [1, ou],
               indice: 'الجواب لا يُكتب بفاصلة : أتركه كسرا غير قابل للاختزال' };
    });
  }

  const API = { ITEMS };
  if (M) module.exports = API; else racine.Items = API;
})(typeof window !== 'undefined' ? window : globalThis);
