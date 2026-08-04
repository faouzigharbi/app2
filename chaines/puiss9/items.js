// LE CATALOGUE DES ÉNONCÉS — transcrits des feuilles, et d'elles seules.
//
// Règle absolue de ce chapitre : les questions viennent des PDF du maître, pas
// d'un tirage. Ce qui est engendré, c'est le RAISONNEMENT — la chaîne d'étapes
// qui mène de l'énoncé au résultat —, parce qu'il n'est pas dans les feuilles
// et qu'il doit être recalculé pour être sûr.
//
// Chaque item porte sa PROVENANCE. Si une question paraît étrange, on doit
// pouvoir remonter à la ligne de la feuille qui l'a dictée, et décider là-bas.
//
//   src     la feuille et l'exercice d'où l'item vient
//   f       la famille — la règle du programme qu'il met en jeu
//   n       le niveau scolaire minimal où il a sa place (7, 8 ou 9)
//   d       la difficulté : 'facile', 'moyen', 'difficile'
//   e       l'énoncé, tel qu'il est écrit sur la feuille
//
// LA DIFFICULTÉ EST LUE SUR L'ITEM, pas décrétée : « 2³ × 2⁴ » est facile parce
// que les deux bases sont écrites ; « 16 × 2⁷ × 32 » est moyen parce qu'il faut
// d'abord voir que 16 et 32 sont des puissances de 2 ; « (2⁴)¹¹ + 3 × (2²²)² »
// est difficile parce qu'il faut deux règles et une mise en facteur.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);

  const ITEMS = [];
  const lot = (src, f, n, d, liste) =>
    liste.forEach(e => ITEMS.push({ src, f, n, d, e }));

  // ═══════════════════════════════════════════════════════════════════════
  // 7ème — feuille « قوة العدد صحيح طبيعي », PUISSA_7
  // ═══════════════════════════════════════════════════════════════════════

  // Exercice 5 — aⁿ × aᵖ = aⁿ⁺ᵖ, bases écrites
  lot('PUISSA_7 ex5', 'produit', 7, 'facile', [
    '2^3 × 2^4', '3^4 × 3^2', '5^3 × 5^2', '7^2 × 7^2', '7^6 × 7^4', '2^6 × 2^5'
  ]);
  // les mêmes, mais l'exposant 1 ou 0 y est sous-entendu
  lot('PUISSA_7 ex5', 'produit', 7, 'moyen', [
    '5^4 × 5', '3 × 3^6', '7 × 7^2 × 7^5',
    '123^4 × 123 × 123^5', '17^0 × 17^8 × 17^6 × 17'
  ]);

  // Exercice 6 — la base doit être DÉCOUVERTE
  lot('PUISSA_7 ex6', 'base-commune', 7, 'moyen', [
    '2^4 × 8', '27 × 3^5 × 3^8', '121 × 11^2 × 11^4', '125 × 5^6',
    '8 × 2^5', '3^5 × 81', '3^2 × 27 × 3^4'
  ]);
  // « 121³ × (11⁴)⁵ » et « 25⁶ × (5¹¹)² » figurent dans l'exercice 12 de la
  // feuille, parmi les mises en facteur — mais ce sont des PRODUITS, sans
  // somme à factoriser. Ils rejoignent la famille qui leur convient.
  lot('PUISSA_7 ex12', 'base-commune', 7, 'difficile', [
    '121^3 × (11^4)^5', '25^6 × (5^11)^2'
  ]);

  lot('PUISSA_7 ex6', 'base-commune', 7, 'difficile', [
    '16 × 2^7 × 32', '49 × 7 × 7^0', '12^5 × 144 × 12', '8 × 16 × 32',
    '81 × 27 × 3^2', '25 × 5^6 × 125', '4 × 2^15 × 16', '216 × 6^15'
  ]);

  // Exercice 7 — (aⁿ)ᵖ = aⁿˣᵖ
  lot('PUISSA_7 ex7', 'puissance-de-puissance', 7, 'facile', [
    '(2^3)^5', '(3^2)^5', '(5^7)^3', '(6^5)^4', '(10^6)^5', '(2^4)^4',
    '(3^2)^6', '(5^5)^5', '(3^7)^5', '(6^3)^5', '(5^10)^2', '(11^12)^5',
    '(5^11)^3', '(7^4)^11', '(8^6)^9', '(1956^3)^2', '(22^5)^6', '(8^6)^5'
  ]);
  // ceux dont l'exposant nul ou la base nulle décide de tout
  // Ceux-là valent 1 : leur leçon est l'exposant nul, et l'on y demande donc
  // une valeur, non une forme de puissance.
  lot('PUISSA_7 ex7', 'calcul', 7, 'moyen', [
    '(362^4)^0', '(8^0)^1987', '(10^0)^4'
  ]);

  // Exercice 8 — (aⁿ)ᵖ suivi d'un produit : deux règles
  lot('PUISSA_7 ex8', 'puissance-de-puissance', 7, 'difficile', [
    '(7^4)^3 × (7^2)^3', '(3^15)^1 × 3^6', '13 × (13^11)^4 × 13^5',
    '10^2 × (10^3)^5 × 10', '2^6 × (2^2)^3',
    '(843^5)^2 × 843 × (843^0)^1995'
  ]);

  // Exercice 9 — deux règles ET une base à reconnaître
  lot('PUISSA_7 ex9', 'base-commune', 7, 'difficile', [
    '(7^14)^2 × 49^3', '(2^5)^4 × 16^6', '81 × (3^11)^4 × 9^5',
    '100 × (10^3)^5 × 10000^2', '2^4 × 32 × 4^5', '(8^5)^2 × 4 × (2^3)^5',
    '25^6 × (5^3)^4 × 125^2 × (5^2)^4', '125^3 × 25^2 × 5^21',
    '32^3 × 8^4 × 16^2', '3^9 × 27^5 × 81^2 × 9^4', '4^6 × 8^2 × 64^3'
  ]);

  // Exercice 10 — aⁿ × bⁿ = (a × b)ⁿ, exposants déjà égaux
  lot('PUISSA_7 ex10', 'meme-exposant', 7, 'facile', [
    '3^4 × 7^4', '2^4 × 5^4', '3^5 × 5^5', '5^6 × 2^6', '8^5 × 3^5',
    '7^3 × 3^3', '5^3 × 7^3 × 3^3', '3^3 × 8^3 × 5^3',
    '2^9 × 7^9 × 3^9 × 5^9', '4^6 × 7^6 × 5^6'
  ]);

  // Exercice 11 — aⁿ × bⁿ, mais l'un des exposants doit d'abord être ramené
  lot('PUISSA_7 ex11', 'meme-exposant', 7, 'difficile', [
    '3^4 × 25^2', '2^4 × 25^2', '25^3 × 2^6', '2^6 × 49^3', '8^2 × 7^3',
    '7^6 × 9^3', '25^3 × 7^6 × 9^3', '5^3 × 8^2 × 27', '4^5 × 3^2 × 25',
    '8 × 7^3 × 5^6'
  ]);

  // Exercice 12 — la mise en facteur d'une puissance
  lot('PUISSA_7 ex12', 'facteur-commun', 7, 'facile', [
    '3^5 × 15 - 6 × 3^5', '2^7 × 13 + 3 × 2^7', '5^6 × 13 + 12 × 5^6',
    '7^3 × 2^3 + 7^3 × 41', '2^13 × 45 - 29 × 2^13', '3^4 × 13 + 3 × 3^4',
    '11 × 5^3 - 3 × 5^3', '2^7 × 9 + 7 × 2^7'
  ]);
  lot('PUISSA_7 ex12', 'facteur-commun', 7, 'moyen', [
    '2^5 × 15 + 2^5', '35 × 7^2 + 49', '9 × 5^3 + 18 × 125',
    '9^16 × 7 - 4 × 9^16'
  ]);
  // « 2²⁷ × 7 + 2²⁸ » vaut 2²⁷ × 9, soit 2²⁷ × 3² : ce n'est la puissance
  // d'aucun entier — les exposants 27 et 2 n'ont pas de diviseur commun. La
  // mise en facteur y est belle, la conclusion demandée impossible. Écarté,
  // et signalé plutôt que corrigé d'office.
  lot('PUISSA_7 ex12', 'facteur-commun', 7, 'difficile', [
    '3^6 × 14 - 5 × 9^3', '(2^4)^11 + 3 × (2^22)^2',
    '(9^3)^15 + 8 × (3^9)^10', '(4^3)^5 × 5 - 3 × 8^10'
  ]);

  // Exercice 2, 3, 4 — le calcul d'une expression : priorités, exposant nul,
  // facteur nul. Ce sont les seuls où l'on demande une VALEUR, non une forme.
  lot('PUISSA_7 ex2', 'calcul', 7, 'facile', [
    '2^2 + 5 × 3^1 - 6^0', '5^3 - (3^2 - 2^3) × 4^2 + 45^0',
    '5326^0 + 2^4 + (4 + 12)^2', '2 + (3^2)^2 - (4 - 3)^3 + 35^17 × 0^33'
  ]);
  lot('PUISSA_7 ex3', 'calcul', 7, 'moyen', [
    '3^4 - 2 × 3^2 + 11^0', '2^3 + 2^4 + 2^2', '5^2 - 3 × 2^3',
    '2 × (3^2 - 2^3) + 5^2 × (4^2 - 2^2 × 3)',
    '3^4 + 11^0 × (12^2 - 11^2)', '(2 + 3^2) × (3^3 - 5^2)^2'
  ]);
  lot('PUISSA_7 ex4', 'calcul', 7, 'difficile', [
    '(3 + 7)^2', '6 × 2^2 + 3 × 5^3', '(8 + 5) × 3^2', '(8 + 5 × 3)^2',
    '8 + 5 × 3^2', '3 × (4 × 5^2)^3', '4 + 5^2 × 6', '9 × (7 + 2^2)',
    '9 × 7 + 2^2', '25^2 + 4^3', '(2)^2 × 5^0', '((3)^2)^2', '2^2 × 5^3',
    '3 × (11 + 4^2)', '9 × 7 + 2^3', '(2 + 5 × 3)^2',
    '2^3 × (4^3 - 2^2 × 5) + (11^2 - 10 × 11)^2 + (5^2)^2'
  ]);


  // ═══════════════════════════════════════════════════════════════════════
  // 7ème — feuille « قوة عدد صحيح طبيعي » (تمارين, p. 13) et
  //         « سلسلة تمارين القوى — 7 أساسي » (p. 10)
  // ═══════════════════════════════════════════════════════════════════════

  // p.13 ex2 — écrire un nombre sous forme de puissance d'exposant ≠ 1
  lot('قوة عدد صحيح طبيعي p13 ex2', 'decomposer', 7, 'facile', [
    '49', '25', '125', '32', '8', '16', '81', '27', '121', '4'
  ]);
  lot('قوة عدد صحيح طبيعي p13 ex2', 'decomposer', 7, 'moyen', [
    '64', '36', '100', '144'
  ]);
  // p.13 ex4 — les mêmes, mais il faut passer par plusieurs facteurs premiers
  lot('قوة عدد صحيح طبيعي p13 ex4', 'decomposer', 7, 'difficile', [
    '160000', '2500', '4900', '8000', '6400'
  ]);

  // p.13 ex3 — produits et puissances de puissances
  lot('قوة عدد صحيح طبيعي p13 ex3', 'produit', 7, 'facile', [
    '2^3 × 2^10'
  ]);
  lot('قوة عدد صحيح طبيعي p13 ex3', 'puissance-de-puissance', 7, 'facile', [
    '(7^3)^2'
  ]);
  lot('قوة عدد صحيح طبيعي p13 ex3', 'puissance-de-puissance', 7, 'difficile', [
    '(2^3)^4 × (2^5)^6'
  ]);
  lot('قوة عدد صحيح طبيعي p13 ex3', 'meme-exposant', 7, 'facile', [
    '2^5 × 7^5'
  ]);
  lot('قوة عدد صحيح طبيعي p13 ex3', 'meme-exposant', 7, 'difficile', [
    '(3^4)^5 × (2^10)^2', '(3^5)^6 × (2^15)^2'
  ]);

  // p.13 ex5 — LA SOMME DE PUISSANCES ÉGALES. « 2⁷ + 2⁷ » n'est pas 4⁷ : c'est
  // 2 × 2⁷, donc 2⁸. C'est la faute la plus tenace du chapitre, et l'exercice
  // est bâti pour elle.
  lot('قوة عدد صحيح طبيعي p13 ex5', 'facteur-commun', 7, 'moyen', [
    '2^7 + 2^7', '2^14 + 2^14', '3^5 + 3^5 + 3^5'
  ]);
  lot('قوة عدد صحيح طبيعي p13 ex5', 'facteur-commun', 7, 'difficile', [
    '2^6 + 2^6 + 2^6 + 2^6', '5^4 + 5^4 + 5^4 + 5^4 + 5^4',
    '4^6 + 4^6 + 4^6 + 4^6'
  ]);

  // p.13 ex1 — calculs, dont l'exposant 0 posé sur une expression énorme
  lot('قوة عدد صحيح طبيعي p13 ex1', 'calcul', 7, 'facile', [
    '10^0', '3^3', '7^4', '2^2 + 3^2', '2^4'
  ]);
  lot('قوة عدد صحيح طبيعي p13 ex1', 'calcul', 7, 'moyen', [
    '(7^59 - 2^3)^0'
  ]);

  // p.10 ex1 — la batterie de calculs, celle qui prend le plus de temps
  lot('سلسلة القوى p10 ex1', 'calcul', 7, 'moyen', [
    '5^4 × 2^3', '5^3 × 2^5', '5^3 + 2^4 + 1', '5^4 × (11 - 3^2)',
    '8^2 + 9^2 + 1^11', '11 × 3^2 - 4^3 + 2^5'
  ]);
  lot('سلسلة القوى p10 ex1', 'calcul', 7, 'difficile', [
    '7^3 - 2^3 × (2^3 × 3^2 - 7^2)', '(15^2 + 4^11)^0 + 4^3 + 5^3',
    '125 - 5^2 × (2^3 + 3^2 - 4^2)', '13^2 - 5^3 × (3^2 - 2^3)',
    '(3^2 + 1) × 5^4 - 5^3 × 3', '(8^2 + 6^2)^3 × (7^2 + 1)'
  ]);

  // p.10 ex2 — écrire sous forme de puissance d'exposant ≠ 1
  lot('سلسلة القوى p10 ex2', 'base-commune', 7, 'difficile', [
    '5^3 × (5^2)^4 × 625', '(11^3 × 121^5)^2 × 11'
  ]);
  lot('سلسلة القوى p10 ex2', 'facteur-commun', 7, 'moyen', [
    '3^4 + 3^4 + 3^4', '3 × 5^5 + 2 × 5^5', '16^11 + 16^11',
    '27^11 + 27^11 + 27^11'
  ]);
  // « 11 × 5⁵ + 21 × 5⁵ » donne 32 × 5⁵, soit 2⁵ × 5⁵ = 10⁵ : la base du
  // résultat n'est ni 5 ni 32, elle est 10. Le plus bel item de la feuille.
  lot('سلسلة القوى p10 ex2', 'facteur-commun', 7, 'difficile', [
    '11 × 5^5 + 21 × 5^5'
  ]);
  lot('سلسلة القوى p10 ex2', 'meme-exposant', 7, 'difficile', [
    '(5 × 3^3)^2 × (5^3 × 3)^2'
  ]);
  lot('سلسلة القوى p10 ex2', 'produit', 7, 'difficile', [
    '16000 × 5^4'
  ]);

  // p.10 ex3 — « simplifier », sans exiger une puissance unique
  lot('سلسلة القوى p10 ex3', 'calcul', 7, 'difficile', [
    '(3 × 5^3)^2 × 3^11', '(5^3 × 2)^11 × 8000'
  ]);

  // ═══════════════════════════════════════════════════════════════════════
  // ENCORE ÉCARTÉ, ET DIT
  //
  //   « سلسلة القوى p10 ex2 c) 2⁴ (2³ × 5³)⁴ × 625 » vaut 2¹⁶ × 5¹⁶ = 10¹⁶,
  //   et il est gardé — mais son écriture « 2⁴(…) » sans signe × a été
  //   normalisée en « 2^4 × (…) » : c'est la même chose, écrite comme le reste
  //   de la fiche.
  //
  //   « سلسلة القوى p10 ex3 a) (3⁵ × 2³)⁴ × 3 × 5³ » ne retombe sur aucune
  //   puissance unique : trois bases, des exposants sans diviseur commun. La
  //   consigne y est « بسّط », simplifier — ce que nos chaînes ne savent pas
  //   encore rendre autrement qu'en calculant. Écarté pour l'instant.
  //
  //   « سلسلة القوى p10 ex4 » — des égalités à trous (« 5¹¹ × 2 = 10¹⁴ × 5… »).
  //   Ce sont d'excellents exercices, mais d'un AUTRE genre que la chaîne de
  //   démonstration : ils demandent de compléter, non de dérouler. Ils feront
  //   une famille à part, le jour où on la fera.
  // ═══════════════════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════════════════
  // CE QUI A ÉTÉ ÉCARTÉ, ET POURQUOI — la feuille prime, mais elle se relit.
  //
  //   PUISSA_7 ex10 e) « 2⁴ × 4⁵ » — rangé sous « a^n × b^n », mais les
  //   exposants n'y sont pas égaux : la règle du même exposant ne s'y applique
  //   pas. C'est en revanche un bel item de base commune (4 = 2²), et il est
  //   repris à ce titre dans l'exercice 9. Signalé, non corrigé d'office.
  //
  //   PUISSA_7 ex8 « 0⁶ × (10³)⁴ × 10²⁵ × (10¹)¹² » — le facteur 0⁶ annule
  //   tout : le résultat est 0, qui n'est la puissance d'aucun entier. L'item
  //   est juste, mais il ne répond pas à la consigne « écris sous forme de
  //   puissance ». Écarté de cette famille.
  //
  //   PUISSA_7 ex9 g) « 25⁶ × (5³)⁴ × 125² × (5²)⁴ » a été gardé : quatre
  //   facteurs, trois bases à reconnaître, c'est le sommet de la feuille.
  // ═══════════════════════════════════════════════════════════════════════

  const par = (f, n, d) => ITEMS.filter(x => x.f === f && x.d === d && x.n <= n);
  const familles = () => [...new Set(ITEMS.map(x => x.f))];

  const API = { ITEMS, par, familles };
  if (M) module.exports = API; else racine.Items = API;
})(typeof window !== 'undefined' ? window : globalThis);
