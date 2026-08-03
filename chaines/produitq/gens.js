// Une page par TYPE ; à l'intérieur, le générateur tire parmi les modèles.
//
// La fiche papier aligne dix lignes du même type, toutes figées. Ici l'élève
// retombe sur la MÊME MÉTHODE sous ses différents habillages, autant de fois
// qu'il recharge — c'est le seul avantage réel d'une page génératrice sur une
// feuille, et il ne vaut que si les modèles d'un type sont vraiment tous
// tirés. Le validateur les compte.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Produit;
  const P = M ? require('./produits.js') : racine.Produits;
  const { rat, add, sub, mul, div, neg, abs, signe, egaux, txt, par, ent, choix } = F;

  const nonNul = P.nonNul;
  const DEN = [2, 3, 4, 5, 6, 8, 10, 12];
  const frac = () => {
    let f;
    do { f = rat(nonNul(-15, 15), choix(DEN)); } while (f.d === 1);
    return f;
  };
  // Deux fractions faites pour qu'il y ait quelque chose à barrer.
  const simplifiable = () => {
    for (;;) {
      const g1 = ent(2, 6), g2 = ent(2, 6);
      const a = rat(g1 * nonNul(1, 4) * choix([1, -1]), g2 * ent(1, 4));
      const b = rat(g2 * nonNul(1, 4) * choix([1, -1]), g1 * ent(1, 4));
      if (a.d !== 1 && b.d !== 1 && P.pgcd(Math.abs(a.n), b.d) * P.pgcd(Math.abs(b.n), a.d) > 1) {
        return [a, b];
      }
    }
  };
  // Marque le modèle sur la question : c'est ce qui permet de vérifier
  // qu'aucun n'est resté au fond du sac.
  const tag = (q, modele) => { q.controle.modele = modele; return q; };
  const page = (n, titre, modeles, k) => F.enregistrer(n, {
    titre, questions: k,
    f: () => Array.from({ length: k }, () => {
      const m = choix(Object.keys(modeles));
      return tag(modeles[m](), m);
    })
  });

  // === TYPE 1 — le produit, en simplifiant AVANT de multiplier ============
  page(1, 'الجداء في ℚ — نبسّط قبل أن نضرب', {
    deux:    () => P.produit(simplifiable()),
    trois:   () => { const [a, b] = simplifiable(); return P.produit([a, b, frac()]); },
    entier:  () => { const [a, b] = simplifiable(); return P.produit([rat(nonNul(-9, 9)), a]); },
    absolu:  () => { const [a, b] = simplifiable(); return P.absoluProduit(a, b); }
  }, 4);

  // === TYPE 2 — les éléments remarquables : reconnaître, pas calculer =====
  page(2, 'عناصر مميّزة — نتعرّف بدل أن نحسب', {
    zero:    () => P.remarquable(frac(), 'zero'),
    un:      () => P.remarquable(frac(), 'un'),
    moinsUn: () => P.remarquable(frac(), 'moinsUn'),
    inverse: () => P.remarquable(frac(), 'inverse')
  }, 4);

  // === TYPE 3 — l'ESSENTIEL : le signe se lit, il ne se calcule pas ======
  const grand = () => String(ent(10000000, 999999999)) + String(ent(100, 999));
  const sg = () => (Math.random() < 0.5 ? '-' : '');
  page(3, 'الإشارة دون إجراء أيّ حساب', {
    oppose:  () => P.signeSansCalculer(sg() + grand(), sg() + grand(), 'oppose'),
    facteur: () => P.signeSansCalculer(sg() + grand(), sg() + grand(), 'facteur'),
    quotient: () => P.classeSigne('a / b', [
      { quoi: 'البسط', txt: 'a', signe: -1 },
      { quoi: 'المقام', txt: 'b', signe: -1 }], 'a/b'),
    absolu:  () => P.classeSigne('|a| / b', [
      { quoi: 'البسط', txt: '|a|', signe: 1 },
      { quoi: 'المقام', txt: 'b', signe: -1 }], 'abs/b'),
    compose: () => {
      const n1 = ent(2, 9), n2 = ent(2, 9);
      return P.classeSigne('(-' + n1 + ' / a) × (b / ' + n2 + ')', [
        { quoi: 'الكسر الأول', txt: '-' + n1 + ' / a', signe: 1 },
        { quoi: 'الكسر الثاني', txt: 'b / ' + n2, signe: -1 }], 'produit');
    }
  }, 4);

  // === TYPE 4 — diviser, c'est multiplier par l'inverse ==================
  page(4, 'القسمة و الكسور المتراكبة', {
    division: () => { const [a, b] = simplifiable(); return P.quotient(a, b); },
    etagee:   () => P.etagee(null, null,
                     txt(rat(nonNul(1, 9), ent(2, 9))), txt(rat(nonNul(1, 9), ent(2, 9)))),
    sommes:   () => {
      const n1 = ent(1, 6), n2 = ent(2, 9), n3 = ent(1, 6), n4 = ent(2, 9);
      return P.etagee(null, null, n1 + ' - ' + n2 + '/' + (n2 + 1),
                                  n3 + ' + ' + n4 + '/' + (n4 + 3));
    }
  }, 4);

  // === TYPE 5 — développer, puis réduire =================================
  const v = () => choix(['x', 'y', 'a']);
  page(5, 'أنشر ثمّ اختصر', {
    scalaire: () => {
      const lettre = v();
      for (;;) {
        const blocs = [
          { k: frac(), a: rat(nonNul(1, 9)), b: frac() },
          { k: frac(), a: rat(nonNul(1, 9)), b: frac() }
        ];
        const A = blocs.reduce((r, m) => add(r, mul(m.k, m.a)), rat(0));
        const B = blocs.reduce((r, m) => add(r, mul(m.k, m.b)), rat(0));
        if (A.n !== 0 || B.n !== 0) return P.developper(choix(['X', 'Y', 'Z']), lettre, blocs);
      }
    },
    binomes: () => P.produitBinomes(choix(['F', 'C', 'T']), 'x',
      rat(nonNul(1, 4)), rat(nonNul(-6, 6)), rat(nonNul(-4, 4)), rat(nonNul(-6, 6)), null),
    binomesReste: () => P.produitBinomes(choix(['F', 'C', 'T']), 'x',
      rat(nonNul(1, 4)), rat(nonNul(-6, 6)), rat(nonNul(-4, 4)), rat(nonNul(-6, 6)),
      { k: rat(ent(2, 5)), a: rat(nonNul(-4, 4)), b: rat(nonNul(-5, 5)) })
  }, 4);

  // === TYPE 6 — la mise en évidence, en regard du chapitre « التفكيك » ===
  page(6, 'التفكيك بعامل مشترك — تمهيد', {
    fraction: () => {
      let k, a, b;
      do { k = frac(); a = rat(nonNul(1, 6)); b = rat(nonNul(-9, 9)); }
      while (egaux(abs(k), rat(1)));
      return P.factoriser(choix(['E', 'G', 'H']), choix(['x', 'y']), k, a, b);
    },
    entier: () => {
      let k, a, b;
      do { k = rat(nonNul(-9, 9)); a = rat(nonNul(1, 6)); b = rat(nonNul(-9, 9)); }
      while (egaux(abs(k), rat(1)));
      return P.factoriser(choix(['E', 'G', 'H']), choix(['x', 'y']), k, a, b);
    }
  }, 4);
})(typeof window !== 'undefined' ? window : globalThis);
