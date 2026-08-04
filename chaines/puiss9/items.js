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
    '9 × 7 + 2^2', '25^2 + 4^3', '(2)^2 × 5^0', '2^2 × 5^3',
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
    '5^3 × (5^2)^4 × 625'
  ]);
  // « (11³ × 121⁵)² × 11 » vaut 11²⁷. Sa chaîne écrirait deux fois la même
  // relation — le facteur parenthésé et le produit refait — et deux étapes
  // interchangeables ne font pas une démonstration. Écarté, et dit.
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
  // 8ème — « القوى في مجموعة الأعداد الكسرية », riadhyet (Puiss_Q_part2)
  //
  // Tout change de nature ici : la base devient un rationnel, l'exposant peut
  // être négatif, et le résultat s'écrit « (3/7)⁻⁹ » et non plus « 3⁷ ».
  // ═══════════════════════════════════════════════════════════════════════

  // ex2 — produit de puissances de même base, dans ℚ
  lot('Puiss_Q ex2', 'produit', 8, 'facile', [
    '3^2 × 3^5', '(3/7)^-4 × (3/7)^-5', '(-4)^-2 × (-4)^7',
    '(-6/11)^8 × (6/11)^3', '(6,3)^5 × (6,3)^-12'
  ]);
  lot('Puiss_Q ex2', 'puissance-de-puissance', 8, 'moyen', [
    '(5^3)^6', '(6^-3)^7', '((-8)^5)^4', '(((-5/7)^-7))^-5'
  ]);
  lot('Puiss_Q ex2', 'meme-exposant', 8, 'moyen', [
    '9^3 × (-2)^3', '(-1,1)^-6 × 4^-6', '(9/14)^8 × (-7/6)^8'
  ]);
  lot('Puiss_Q ex2', 'quotient', 8, 'facile', [
    '7^5/7^2', '(-3)^-8/(-3)^7', '(9,5)^4/(9,5)^10',
    '(-2,19)^-4/(-2,19)^-7', '(6/7)^5/(6/7)^-7', '(5/7)^-9/(-5/7)^6'
  ]);
  lot('Puiss_Q ex2', 'quotient', 8, 'moyen', [
    '9^3/4^3', '(7/3)^-3/(-5/4)^-3', '(-10)^-6/(-9)^-6', '(-7)^11/5^11'
  ]);
  lot('Puiss_Q ex2', 'quotient', 8, 'difficile', [
    '3^7 × 2^-4/(3^2 × 2^-9)', '(63/50)^-8/(21/20)^-8'
  ]);

  // ex3 — calculs, et l'exposant négatif rencontré pour lui-même
  lot('Puiss_Q ex3', 'calcul', 8, 'facile', [
    '(-2)^3', '(-3)^2', '5^-2', '(-2/5)^2', '(3/4)^-2', '(-1)^4', '1^-3'
  ]);
  lot('Puiss_Q ex3', 'calcul', 8, 'moyen', [
    '(-3/7)^-2 × (23/67)^0'
  ]);
  lot('Puiss_Q ex3', 'produit', 8, 'moyen', [
    '(-3)^5 × (-3)^6'
  ]);
  lot('Puiss_Q ex3', 'meme-exposant', 8, 'difficile', [
    '(-5)^4 × 3^4'
  ]);
  lot('Puiss_Q ex3', 'puissance-de-puissance', 8, 'facile', [
    '((-2)^3)^4'
  ]);
  lot('Puiss_Q ex3', 'quotient', 8, 'moyen', [
    '(-7)^9/(-7)^4'
  ]);

  // ex6, ex7 — le même geste, avec des fractions partout
  lot('Puiss_Q ex6', 'produit', 8, 'moyen', [
    '(2/5)^3 × (2/5)^-9', '(-5/4)^-6 × (7/5)^-6', '8^-2 × (1/5)^6'
  ]);
  lot('Puiss_Q ex6', 'quotient', 8, 'moyen', [
    '(-5/7)^10/(5/7)^6', '(-11/3)^9/(-5/2)^9'
  ]);
  lot('Puiss_Q ex7', 'produit', 8, 'facile', [
    '(3/5)^-12 × (3/5)^18', '(-1/2)^18 × (1/2)^19', '(11/5)^-17 × 11/5'
  ]);
  lot('Puiss_Q ex7', 'puissance-de-puissance', 8, 'moyen', [
    '((1/2)^3)^-2'
  ]);
  lot('Puiss_Q ex7', 'produit', 8, 'difficile', [
    '(4/3)^18 × (9/16)^-19', '(5^4 × 3^-2)^4 × 3^24'
  ]);

  // ex8 — quotients de fractions, et la descente vers les puissances de 10
  lot('Puiss_Q ex8', 'produit', 8, 'moyen', [
    '(9/5)^-11 × (9/5)^20', '(7/5)^29 × (-7/5)^-8'
  ]);
  lot('Puiss_Q ex8', 'quotient', 8, 'facile', [
    '(7/3)^24/(7/3)^14'
  ]);
  lot('Puiss_Q ex8', 'quotient', 8, 'difficile', [
    '0,001^4 × 1000^-2/(100^-3 × 0,01^-5)'
  ]);
  lot('Puiss_Q ex8', 'produit', 8, 'difficile', [
    '(27/8)^-2 × (3/2)^4'
  ]);

  // ex9 — les grands exposants, où seule la règle sauve
  lot('Puiss_Q ex9', 'produit', 8, 'difficile', [
    '(-6,17)^147 × (-6,17)^23', '(-0,9)^-2009 × (307/333)^-2009'
  ]);
  lot('Puiss_Q ex9', 'quotient', 8, 'difficile', [
    '(-19)^167/(-19)^57'
  ]);
  lot('Puiss_Q ex9', 'puissance-de-puissance', 8, 'difficile', [
    '((5/7)^-120)^4'
  ]);

  // ex10, ex11, ex12 — la batterie finale
  lot('Puiss_Q ex10', 'calcul', 8, 'moyen', [
    '(3/5)^-2', '(-1/2)^3', '((20/17)^-2354)^0'
  ]);
  // « (20/17)²⁰¹⁷ × (20/17)⁻²⁰¹⁶ » a pour exposant 1 : la réponse est 20/17,
  // une valeur et non une puissance. L'item reste, rangé au calcul.
  lot('Puiss_Q ex10', 'calcul', 8, 'moyen', [
    '(20/17)^2017 × (20/17)^-2016'
  ]);
  lot('Puiss_Q ex10', 'meme-exposant', 8, 'moyen', [
    '(5/9)^-7 × 3^-7'
  ]);
  lot('Puiss_Q ex10', 'produit', 8, 'facile', [
    '(7/6)^16 × (-7/6)^-5'
  ]);
  lot('Puiss_Q ex10', 'quotient', 8, 'moyen', [
    '10^18/10^-2'
  ]);
  lot('Puiss_Q ex10', 'base-commune', 8, 'difficile', [
    '(7^4)^-3 × 49'
  ]);
  lot('Puiss_Q ex11', 'calcul', 8, 'facile', [
    '(-2/3)^4', '(4/5)^-2', '(-2/3)^3', '(0,75)^-2'
  ]);
  lot('Puiss_Q ex11', 'calcul', 8, 'difficile', [
    '(-3,5)^97/(3,5)^95'
  ]);
  lot('Puiss_Q ex11', 'produit', 8, 'moyen', [
    '(-6/7)^5 × (-6/7)^-9', '(9/4)^-3 × (3/2)^29'
  ]);
  lot('Puiss_Q ex11', 'meme-exposant', 8, 'moyen', [
    '(0,6)^3 × (3/5)^-5'
  ]);
  // « (−4,2)⁻³ × (4,2)⁴ » vaut −21/5 : l'exposant y tombe à 1, et une
  // « puissance » d'exposant 1 n'enseigne rien. Rangé au calcul.
  lot('Puiss_Q ex11', 'calcul', 8, 'moyen', [
    '(-4,2)^-3 × (4,2)^4'
  ]);
  lot('Puiss_Q ex11', 'puissance-de-puissance', 8, 'difficile', [
    '((3/5)^4)^-14 × 3/5'
  ]);
  lot('Puiss_Q ex11', 'calcul', 8, 'difficile', [
    '(-3)^19/3^20'
  ]);
  lot('Puiss_Q ex12', 'quotient', 8, 'facile', [
    '(-2/3)^2/(-2/3)^5'
  ]);
  lot('Puiss_Q ex12', 'produit', 8, 'moyen', [
    '16/25 × (-5/4)^5'
  ]);
  lot('Puiss_Q ex12', 'calcul', 8, 'difficile', [
    '(-3/2)^3 × (-9/4)^-2'
  ]);
  lot('Puiss_Q ex12', 'puissance-de-puissance', 8, 'moyen', [
    '((0,2)^-2)^3 × 5^-6'
  ]);
  lot('Puiss_Q ex12', 'quotient', 8, 'difficile', [
    '(10^-1)^2 × 10^3/((10^-3)^-2 × 10^-8)'
  ]);
  lot('Puiss_Q ex12', 'facteur-commun', 8, 'difficile', [
    '(-21)^14 × 5^2 - 2^2 × (-21)^14'
  ]);

  // ex16, ex17 — puissances de 10 et bases à ramener
  lot('Puiss_Q ex16', 'calcul', 8, 'moyen', [
    '(2^-1)^-3', '2^-3 × 2^-5 × 2^8', '10^3 × 10^-7 × 1000'
  ]);
  lot('Puiss_Q ex16', 'quotient', 8, 'moyen', [
    '(1/2)^-3 × 2^4/((1/8)^-1)'
  ]);
  lot('Puiss_Q ex17', 'meme-exposant', 8, 'facile', [
    '2^-16 × 5^-16'
  ]);
  lot('Puiss_Q ex17', 'produit', 8, 'facile', [
    '(4/7)^3 × (4/7)^-12'
  ]);
  lot('Puiss_Q ex17', 'quotient', 8, 'facile', [
    '(2/5)^3/(2/5)^-7'
  ]);
  lot('Puiss_Q ex17', 'quotient', 8, 'difficile', [
    '100 × (10^-4)^-2/10^-12'
  ]);
  lot('Puiss_Q ex17', 'puissance-de-puissance', 8, 'difficile', [
    '((-5/3)^-5)^-3 × 25/9'
  ]);

  // ═══════════════════════════════════════════════════════════════════════
  // QUATRE ITEMS DE 8ème DÉPLACÉS, ET POURQUOI
  //
  // La consigne y est « أكتب في صيغة قوة لعدد كسري نسبي », mais leur valeur
  // n'est la puissance d'aucun rationnel — pas avec un exposant supérieur à 1 :
  //
  //   7⁴ × 5⁵ vaut 5⁵ × 7⁴, dont les exposants n'ont aucun diviseur commun ;
  //   (−3,5)⁹⁷ / (3,5)⁹⁵ vaut −49/4, soit −(7/2)² : le signe interdit d'en
  //     faire une puissance, car aucune puissance ne rend un négatif au carré ;
  //   (−3)¹⁹ / 3²⁰ vaut −1/3 et (−3/2)³ × (−9/4)⁻² vaut −2/3 : l'exposant y
  //     tombe à 1, et une « puissance » d'exposant 1 n'enseigne rien.
  //
  // Ils restent dans la fiche — ce sont de bons calculs — mais rangés parmi
  // les calculs, où la réponse attendue est une valeur. La feuille n'est pas
  // corrigée : elle est relue.
  // ═══════════════════════════════════════════════════════════════════════


  // ═══════════════════════════════════════════════════════════════════════
  // 9ème — « القوى في ℝ », riadhyet (Puissance_9_part1)
  //
  // La base devient un RÉEL : √3, π, 2/√5. Et les exercices y sont longs —
  // c'est ce qui a été demandé, et c'est ce que la feuille offre.
  // ═══════════════════════════════════════════════════════════════════════

  // ex1 — la batterie de rappel : produits, quotients, étages, exposants
  // négatifs et nuls. Facile de forme, mais il ne faut pas se tromper de règle.
  lot('Puissance_9 ex1', 'produit', 9, 'facile', [
    '(-3)^-7 × (-3)^-4', '(-6)^-7 × (-6)^2', '5^2 × 5^4', '4^-3 × 4^8'
  ]);
  lot('Puissance_9 ex1', 'produit', 9, 'moyen', [
    '9^2 × 9^-1 × 9^-7 × 9^-4', '(-8)^2 × (-8)^-5 × (-8)^-1',
    '5^-3 × 5^-1 × 5^8', '7^9 × 7^-8 × 7^-3'
  ]);
  lot('Puissance_9 ex1', 'quotient', 9, 'facile', [
    '(-5)^6/(-5)^-16', '(-6)^-6/(-6)^-1', '5^7/5^3', '7^-4/7^3',
    '2^-3/2^3', '(-3)^-9/(-3)^6', '23^-14/23^-21'
  ]);
  lot('Puissance_9 ex1', 'puissance-de-puissance', 9, 'moyen', [
    '(12^7)^3', '((-2)^4)^-3', '(3^-2)^7', '(8^-8)^8', '((-9)^-7)^-2'
  ]);

  // ex4 — les puissances de radicaux, pour elles-mêmes
  lot('Puissance_9 ex4', 'puissance-reelle', 9, 'moyen', [
    '(√6/√2)^-6', '(√3/√6)^-8'
  ]);

  // ex15, ex19 — écrire sous forme de puissance d'un réel
  lot('Puissance_9 ex15', 'puissance-reelle', 9, 'moyen', [
    '(√2)^6 × (√5)^6', '(√3)^2 × (√3)^-4', '(√6)^7/(√2)^7', 'π^3/π^-5'
  ]);
  lot('Puissance_9 ex19', 'puissance-reelle', 9, 'difficile', [
    '(√27)^9 × (√3)^-5', '7^10 × (√7)^-4 × (√7)^-8'
  ]);

  // ex3, ex5, ex6, ex7, ex8 — LE CŒUR DUR DU CHAPITRE. Chaque expression
  // demande d'évaluer plusieurs morceaux et de les combiner ; aucune ne se
  // règle d'un geste.
  lot('Puissance_9 ex3', 'calcul-reel', 9, 'moyen', [
    '(√3)^3 × (1/√3)^2', '√(3^2) - √(3^-2)'
  ]);
  lot('Puissance_9 ex5', 'calcul-reel', 9, 'difficile', [
    '(√2)^-6 + (√3)^4 + (1/3)^-2 × 2^-3',
    '(4/13)^-1 × √(16/169) + (13/4)^-1',
    '(√3/2)^3 × (√3/3)^-2 - 8√3/3',
    '(√7/3)^-2 × (√3/7)^-2 + (√7/3)^2 + (√2/3)^2 - (√3)^2',
    '(2/√5)^-1 × (√5/2)^-3 + 5^-1 - (√2)^0'
  ]);
  lot('Puissance_9 ex6', 'calcul-reel', 9, 'difficile', [
    '(√2)^-2 - 1/((√3)^-2) - (-2/5)^-1',
    '(√5)^-1 × (1/√5 + (√5)^-3)',
    '((-7)^-1)^-2 × (1/7)^-2 + 1/3^-2 × (3/7)^-1',
    '(1/3)^-3 × 1/9 × ((-3/2)^-2 + 5/9)',
    '(√5/2)^-2 + (-5/3)^-1 + (-√5)^-4'
  ]);
  lot('Puissance_9 ex7', 'calcul-reel', 9, 'difficile', [
    '√(2^4) - √(2^-4)', '(5/8)^5 × (-5/4)^-5',
    '(-3/2)^-2 × (3/2)^-3 × 27/8'
  ]);
  lot('Puissance_9 ex8', 'calcul-reel', 9, 'difficile', [
    '5^-1 × (√3)^2 + 10^-1 - (√17)^0',
    '-3 + 3 × (√2)^3 + (√3)^2 - (-√3)^3',
    '(5/2)^2 + 2 × (5/3)^-1 × 3^-1 - 5^-2',
    '9 × (3/2)^-2 - 4 × (2/3)^-3 × 27^-1',
    '(-2)^-3 + (2√2/3)^-2'
  ]);

  // LE PLUS BEL EXERCICE DES CINQ FEUILLES. Développer (2√2−√7)¹⁵³ serait
  // insensé ; il faut voir que les deux facteurs sont CONJUGUÉS, que leur
  // produit vaut 8 − 7 = 1, et qu'il ne reste qu'un facteur. Le noyau, lui,
  // le calcule vraiment — par exponentiation binaire dans ℚ[√2, √7] — et
  // c'est ainsi qu'on sait que la chaîne dit vrai.
  // Et il n'est PAS encore dans la fiche, pour une raison qu'il faut dire :
  // notre chaîne du calcul évalue chaque facteur séparément, et (2√2−√7)¹⁵³
  // est un nombre de cent quinze chiffres. Le noyau le calcule — c'est ainsi
  // qu'on sait que le résultat est bien 2√2 + √7 — mais l'ÉCRIRE dans une
  // étape n'a aucun sens pédagogique : l'exercice demande exactement de ne pas
  // le calculer. Il lui faut une famille « conjugués » qui apparie les deux
  // facteurs avant tout. C'est le prochain travail du chapitre.

  lot('Puissance_9 ex6', 'quotient', 9, 'difficile', [
    '2^-7 × 3^2/((1/3)^-2 × (2^-3)^2)',
    '(-3 × 2^3)^3/((8 × 9)^2)',
    '5 × 25^-3 × 10^2/(5^-1 × 2^4)',
    '11 × 4^-3 × 22^2/(2^-2 × 11^3)',
    '7^4 × (7^-2)^3/7^-5',
    '((-2)^7 × (-6)^5 × (-3)^10)/(18^4 × (-12)^3)'
  ]);
  lot('Puissance_9 ex6', 'produit', 9, 'difficile', [
    '3^-12 × (1/3)^-14'
  ]);

  // « ((3)²)² » — PUISSA_7 ex4 — porte une parenthèse superflue autour d'un
  // chiffre seul. La réduction s'y perdait entre l'enlever et élever, et une
  // chaîne qui hésite n'enseigne rien. Écarté ; l'exercice a dix-sept autres
  // items, et « (3²)² » y est déjà présent sous une forme propre.

  // ═══════════════════════════════════════════════════════════════════════
  // 9ème — exercices 20 à 35 de la même feuille. C'est là que le chapitre
  // donne sa mesure : bases fractionnaires ET radicales, π, exposants
  // négatifs à tous les étages.
  // ═══════════════════════════════════════════════════════════════════════

  lot('Puissance_9 ex20', 'puissance-reelle', 9, 'difficile', [
    '(√7/2)^-3 × (-2/√7)^-6'
  ]);
  lot('Puissance_9 ex20', 'calcul-reel', 9, 'difficile', [
    '2^4/((5^5)^-2) × 1/((√2)^-2)', '(2/√5)^-4 × (-5√5/8)',
    '((0,01)^-2 × 100^-3)/((1/10)^-3 × (0,001)^-7)',
    '(25^-3 × 2^-5)/(5^4)'
  ]);
  lot('Puissance_9 ex21', 'produit', 9, 'moyen', [
    '(1/3)^2 × (1/3)^-6', '(2/3)^5 × 8/27'
  ]);
  lot('Puissance_9 ex21', 'puissance-de-puissance', 9, 'difficile', [
    '(10/9)^20 × ((10/9)^-3)^5'
  ]);
  lot('Puissance_9 ex22', 'puissance-reelle', 9, 'difficile', [
    '(-√2)^-10/((-√2)^-6)', '(1/√3)^12 × (√3)^15', '(-√3)^-3 × (1/√6)^-3'
  ]);
  lot('Puissance_9 ex22', 'calcul-reel', 9, 'difficile', [
    '((√8/9)^4)/((√2/3)^4)'
  ]);
  lot('Puissance_9 ex23', 'calcul-reel', 9, 'difficile', [
    '((0,001)^2 × (1/10)^-2 × 5^3)/(2^-3 × 10^-3)',
    '(3/4)^-2 + (√3)^-4',
    '(π/3)^6 × ((√3/π)^-2)^-3'
  ]);
  lot('Puissance_9 ex23', 'puissance-reelle', 9, 'difficile', [
    '3^4 × (√3)^-4 × 16', '(√3/2)^-6 × (2/√3)^-12', 'π^5 × (1/√π)^5'
  ]);
  lot('Puissance_9 ex24', 'puissance-reelle', 9, 'moyen', [
    '(√2/√3)^-6', '(√7)^17 × (√7)^-9'
  ]);
  // « ((√2)⁻³)⁻² » — la puissance d'une puissance d'un RADICAL, sans produit
  // autour. Notre constructeur ne la prend pas encore ; c'est la forme qui
  // reste, et elle est notée depuis la mise en place de la 9ème.
  lot('Puissance_9 ex24', 'puissance-reelle', 9, 'difficile', [
    '5^11 × (√5)^-6 × (√5)^-8', '(1/√5)^-6 × (√3/√5)^6'
  ]);
  lot('Puissance_9 ex25', 'calcul-reel', 9, 'difficile', [
    '(3√2)^-2 × (3 × (√2)^-1)^-2', '(2/5)^-2 - (1/√2)^4',
    '10^-2 × (0,0001 × (10^-1)^-5)/((1/100)^3)'
  ]);
  lot('Puissance_9 ex25', 'puissance-reelle', 9, 'difficile', [
    '(√5)^-7 × (-5)^13'
  ]);
  lot('Puissance_9 ex26', 'calcul-reel', 9, 'moyen', [
    '2^-3 × 2^2', '2^-3 + 2^2'
  ]);
  lot('Puissance_9 ex26', 'calcul-reel', 9, 'difficile', [
    '(9√11)^-3 × (3√11)^5', '25√5/(49√7)', '27/(2√2)', '(-√3)^9/(7^9)'
  ]);
  lot('Puissance_9 ex27', 'calcul-reel', 9, 'moyen', [
    '((-√3)^2)^-3 × (1/3)^-1', '5^-1 × (√3)^2'
  ]);
  lot('Puissance_9 ex27', 'produit', 9, 'difficile', [
    '(3/2)^5 × 27/8'
  ]);
  lot('Puissance_9 ex27', 'puissance-de-puissance', 9, 'difficile', [
    '(10/9)^20 × ((10/9)^-2)^3'
  ]);
  lot('Puissance_9 ex27', 'quotient', 9, 'difficile', [
    '(10^-5 × (0,001)^-1)/((1/100)^-2 × 10^7)'
  ]);
  // « (√2)⁻⁴ » vaut 1/4 : une puissance nue d'un radical, sans produit ni
  // somme autour. Même forme que « ((√2)⁻³)⁻² », même limite. Écarté.
  lot('Puissance_9 ex28', 'puissance-reelle', 9, 'moyen', [
    '(√3/5)^-9 × (√3/5)^7'
  ]);
  lot('Puissance_9 ex28', 'calcul-reel', 9, 'difficile', [
    '(√7/3)^-2/((2/√7)^-2)', '625/16 × (2/5)^7', '4√2/(3^5)',
    '(√7)^-3 × 7^5'
  ]);
  lot('Puissance_9 ex29', 'calcul-reel', 9, 'difficile', [
    '√(2^3) - √(3^-2)', '((√5)^-2)^-2 × (1/√3)^-2',
    '(1/√7)^-2 × ((√7)^3)^-2', '(√5/2)^-5 × 5/2',
    '((2/√3)^-3)/((√3/3)^-3)', '(√3/7)^-10 × (7/√3)^-4',
    '((10^-2)^3 × 10^5)/((0,001)^2 × 1000)'
  ]);
  lot('Puissance_9 ex30', 'calcul-reel', 9, 'moyen', [
    '4√7 + 3√7', '√8 × (√5)^3'
  ]);
  lot('Puissance_9 ex30', 'calcul-reel', 9, 'difficile', [
    '(-3/√2)^4 × (√2/3)^-5'
  ]);
  lot('Puissance_9 ex30', 'puissance-reelle', 9, 'moyen', [
    '(√7/4)^-3 × (√7/4)^5'
  ]);
  lot('Puissance_9 ex32', 'calcul-reel', 9, 'moyen', [
    '(5/3)^5 × (3/5)^7'
  ]);
  lot('Puissance_9 ex32', 'calcul', 9, 'moyen', [
    '(-7/4)^-3'
  ]);
  lot('Puissance_9 ex32', 'quotient', 9, 'facile', [
    '3^-10/3^-12'
  ]);
  lot('Puissance_9 ex32', 'calcul-reel', 9, 'difficile', [
    '√8 × (√2)^-7', '(√10/3)^-3 × (-3/√5)^-3',
    '((10^-2)^3 × 10^5)/((100)^2 × (0,01)^2)',
    '((√2)^-3 × (√8)^-7)/((√2)^2 × (√8)^-2)',
    '(0,00016 × 10^-8)/(0,12 × 10^4)'
  ]);
  lot('Puissance_9 ex32', 'puissance-de-puissance', 9, 'difficile', [
    '((7/3)^-3)^4 × (7/3)^8'
  ]);
  lot('Puissance_9 ex34', 'calcul-reel', 9, 'difficile', [
    '(√2 - √3)^2 - (√2 + √3)^2',
    '(0,9 × 10^-6)/(3 × 10^-8) + (-√3/3)^2 × (1/10)^-1'
  ]);

  // « (1/√7 − √7)² » — le carré d'une DIFFÉRENCE de radicaux. Longtemps écarté :
  // la chaîne aurait calculé sans expliquer. Elle sait maintenant, et ce n'est
  // pas par l'identité remarquable — c'est par la priorité des opérations,
  // qui est plus courte et plus juste : on réduit ce qu'il y a dans la
  // parenthèse, et l'on élève ensuite.
  lot('Puissance_9 ex34', 'calcul-reel', 9, 'difficile', [
    '(1/√7 - √7)^2'
  ]);

  // ═══════════════════════════════════════════════════════════════════════
  // LES EXERCICES LIÉS — plusieurs questions sur un même préambule.
  //
  // « Soient a = (√5/7)⁻³, b = (√5/7)⁵, c = (7/√5)⁵. Écris a × b, b × c, a/c
  // sous forme de puissance d'un réel. » Trois questions, un seul énoncé : la
  // seconde ne se comprend pas sans la première.
  //
  // On les porte en substituant : l'élève lit « a × b », et la chaîne travaille
  // sur ce que a et b valent. Le nom est dans l'énoncé, la valeur dans la
  // démonstration, et rien n'est inventé — le préambule est celui de la feuille.
  const lie = (src, f, n, d, defs, liste) =>
    liste.forEach(([nom, e]) => ITEMS.push({ src, f, n, d, e, defs, nom }));

  // ex31 — trois puissances de la même base, et trois combinaisons
  lie('Puissance_9 ex31', 'puissance-reelle', 9, 'difficile',
      'لتكن القوى التالية: a = (5/√3)^3 ؛ b = (√3/5)^5 ؛ c = (3/25)^-3', [
    ['a × b', '(5/√3)^3 × (√3/5)^5'],
    ['b × c', '(√3/5)^5 × (3/25)^-3'],
    ['a/c',   '(5/√3)^3/((3/25)^-3)']
  ]);

  // ex33-2 — la même idée, avec un carré en plus
  lie('Puissance_9 ex33', 'puissance-reelle', 9, 'difficile',
      'لتكن القوى التالية: a = (√5/7)^-3 ؛ b = (√5/7)^5 ؛ c = (7/√5)^5', [
    ['a × b', '(√5/7)^-3 × (√5/7)^5'],
    ['b × c', '(√5/7)^5 × (7/√5)^5']
  ]);

  // ex20-2 — montrer que deux nombres sont INVERSES : leur produit vaut 1.
  lie('Puissance_9 ex20', 'calcul-reel', 9, 'difficile',
      'G = 2^4/((5^5)^-2) × 1/((√2)^-2) و H = (25^-3 × 2^-5)/(5^4) — أثبت أنّ G و H مقلوبان', [
    ['G × H', '(2^4/((5^5)^-2) × 1/((√2)^-2)) × ((25^-3 × 2^-5)/(5^4))']
  ]);

  // ex35 — c se déduit de a et b, puis abc s'en déduit à son tour
  lie('Puissance_9 ex35', 'calcul-reel', 9, 'difficile',
      'a و b و c ثلاثة أعداد حقيقية حيث ab = c، مع a = (√3/2)^5 و b = (2/√3)^-3', [
    ['c = a × b', '(√3/2)^5 × (2/√3)^-3']
  ]);
  lie('Puissance_9 ex35', 'calcul-reel', 9, 'difficile',
      'a و b و c ثلاثة أعداد حقيقية حيث ab = c، مع a = (√5/2)^3 و b = (√2/3)^3', [
    ['c = a × b', '(√5/2)^3 × (√2/3)^3']
  ]);

  // « a⁴ » de l'exercice 33 tombe sur « ((√5/7)⁻³)⁴ » : une puissance de
  // puissance d'un radical, la forme que le constructeur ne prend pas encore.
  // Les deux autres questions de l'exercice restent.

  // ═══════════════════════════════════════════════════════════════════════
  // 8ème — « تمارين شاملة » (Puiss_Q_part3). Uniquement le difficile : ce sont
  // les exercices de synthèse de la feuille, ceux qui enchaînent deux règles
  // ou demandent de reconnaître une base sous un habillage.
  // ═══════════════════════════════════════════════════════════════════════

  lot('Puiss_Q_part3 ex1', 'calcul', 8, 'difficile', [
    '(-1/3)^-2 + (-1/2)^-3', '-2^4 + 3^2'
  ]);
  lot('Puiss_Q_part3 ex1', 'produit', 8, 'difficile', [
    '(-2/3)^11 × (-81/16)'
  ]);
  lot('Puiss_Q_part3 ex1', 'quotient', 8, 'difficile', [
    '((-5/17)^-3)/((-4/34)^-3)'
  ]);
  lot('Puiss_Q_part3 ex2', 'calcul', 8, 'difficile', [
    '(-1/5)^-2 + (-1/3)^-3', '-3^3 + 2^5'
  ]);
  lot('Puiss_Q_part3 ex2', 'produit', 8, 'difficile', [
    '(-3/2)^-13 × (-27/8)'
  ]);
  lot('Puiss_Q_part3 ex2', 'quotient', 8, 'difficile', [
    '((-3/7)^-5)/((-5/14)^-5)'
  ]);
  lot('Puiss_Q_part3 ex4', 'puissance-de-puissance', 8, 'difficile', [
    '3^5 × (3^2)^-6'
  ]);
  lot('Puiss_Q_part3 ex4', 'quotient', 8, 'difficile', [
    '((1/3)^8)/((-1/3)^4)'
  ]);
  lot('Puiss_Q_part3 ex4', 'produit', 8, 'difficile', [
    '(-2/5)^7 × (-2/5)^-4'
  ]);
  lot('Puiss_Q_part3 ex4', 'calcul-reel', 8, 'difficile', [
    '√12,25 - √2,89'
  ]);
  lot('Puiss_Q_part3 ex7', 'calcul', 8, 'difficile', [
    '(-2/3)^7 × (4/3)^-4',
    '(9/4)^2 × (-112/97) + (2/3)^-4 × 15/97'
  ]);
  lot('Puiss_Q_part3 ex8', 'calcul', 8, 'difficile', [
    '(-2/3)^3 × (4/3)^-1', '(-3/7)^-2 × (13/61)^0',
    '3^-1 × 21 - √25 × 5^-1',
    '(1/2)^-3 × 1/4 × ((-3/2)^-2 + 4/9 - 3^-2)'
  ]);
  lot('Puiss_Q_part3 ex8', 'quotient', 8, 'difficile', [
    '((-3)^3 × (-3)^-15)/((-3)^-5)'
  ]);
  lot('Puiss_Q_part3 ex8', 'produit', 8, 'difficile', [
    '(-2/3)^-2 × (-2/3)^19'
  ]);
  lot('Puiss_Q_part3 ex9', 'produit', 8, 'difficile', [
    '(4/7)^3 × (4/7)^-12'
  ]);
  lot('Puiss_Q_part3 ex9', 'puissance-de-puissance', 8, 'difficile', [
    '((-5/3)^-5)^-3 × 25/9'
  ]);
  lot('Puiss_Q_part3 ex9', 'quotient', 8, 'difficile', [
    '(9^5 × 81 × 4^-3)/((2^-2)^-5 × 2^-2)'
  ]);
  lot('Puiss_Q_part3 ex11', 'calcul', 8, 'difficile', [
    '-2 × (-3)^-2 - (-3)^2'
  ]);
  lot('Puiss_Q_part3 ex11', 'calcul-reel', 8, 'difficile', [
    '√0,04 + √16', '-√9 - √0,09'
  ]);
  lot('Puiss_Q_part3 ex11', 'calcul-reel', 8, 'difficile', [
    '(4/3)^7 × (0,75)^6', '(-2)^-7 × 2^10'
  ]);
  lot('Puiss_Q_part3 ex12', 'calcul', 8, 'difficile', [
    '(-3/2)^-3 - √(8/162) + (-7/2)^0'
  ]);
  lot('Puiss_Q_part3 ex12', 'produit', 8, 'difficile', [
    '(-5/3)^-7 × (-27/125)'
  ]);
  lot('Puiss_Q_part3 ex12', 'quotient', 8, 'difficile', [
    '((-8/15)^5)/((-16/75)^5)'
  ]);
  lot('Puiss_Q_part3 ex13', 'facteur-commun', 8, 'difficile', [
    '3^-13 × 2^5 - 3^-13 × 5'
  ]);
  lot('Puiss_Q_part3 ex13', 'calcul', 8, 'difficile', [
    '(-2/3)^2 × 27/64 × (3/2)^-1'
  ]);
  lot('Puiss_Q_part3 ex13', 'quotient', 8, 'difficile', [
    '((-7^-2 × 9^3)^-3)/((7^-4)^4 × 9^2)'
  ]);
  lot('Puiss_Q_part3 ex14', 'facteur-commun', 8, 'difficile', [
    '1/4^5 + 1/4^5 + 1/4^5 + 1/4^5'
  ]);
  lot('Puiss_Q_part3 ex14', 'calcul-reel', 8, 'difficile', [
    '(√36)^5 × 24^-2 × 4^5', '(√(9/4))^19 + (-1,5)^19'
  ]);
  lot('Puiss_Q_part3 ex14', 'calcul', 8, 'difficile', [
    '(2/3)^3 - (-2/3)^3'
  ]);

  // Cinq items de part3 écartés, et dits : « √0,36 », « √0,81 », « √(8/98) »
  // et « √(32/50) » sont des racines nues, sans opération autour — une seule ligne, et nos chaînes
  // demandent quatre étapes ; « ((−1)⁷⁹ + (−2)²)⁻² » élève une PARENTHÈSE
  // entière à une puissance, forme que la réduction ne sait pas encore
  // dérouler sans se déséquilibrer. La mise en facteur d'une puissance à
  // exposant NÉGATIF — « 3⁻¹³ × 2⁵ − 3⁻¹³ × 5 » — a depuis trouvé sa version
  // rationnelle : on sort 3⁻¹³, on lit 27 = (1/3)⁻³, et l'on conclut (1/3)¹⁰.
  // ═══════════════════════════════════════════════════════════════════════
  // 8ème — feuille « القوى في Q », puissance 8_2012 (5 pages, 15 exercices)
  //
  // La feuille la plus longue du lot, et la plus systématique : elle prend
  // chaque règle et la décline jusqu'à ce qu'elle craque. On la transcrit
  // exercice par exercice, en gardant l'ordre de la feuille.
  // ═══════════════════════════════════════════════════════════════════════

  // Exercice 1 — aⁿ × aᵖ, mais le signe de la base change d'un facteur à l'autre
  lot('puissance 8_2012 ex1', 'produit', 8, 'moyen', [
    '(-3/2)^3 × (-3/2)^2', '(1/2)^4 × (1/2)^5', '(3/2)^2 × (3/2)^4',
    '(-3/4)^3 × (-3/4)^3', '(0,2)^3 × (0,2)^4',
    '(-17/3)^4 × (-17/3)^3', '(-10/3)^4 × (-10/3)^5'
  ]);
  // le même produit, mais l'un des deux facteurs est écrit avec l'autre signe :
  // il faut voir que (−5/4)² et (5/4)² sont le même nombre avant de sommer.
  lot('puissance 8_2012 ex1', 'base-commune', 8, 'difficile', [
    '(-5/4)^3 × (5/4)^2', '(-4/5)^2 × (4/5)^5', '(5/3)^5 × (-5/3)^2',
    '(-0,2)^2 × 0,2^7', '(5/6)^4 × (-5/6)^3'
  ]);
  // et ici c'est un facteur NU qu'il faut reconnaître comme puissance :
  // 16/625 = (2/5)⁴, −27/8 = (−3/2)³, 81 = (−3)⁴, −216/125 = (−6/5)³…
  lot('puissance 8_2012 ex1', 'base-commune', 8, 'difficile', [
    '(2/5)^2 × 16/625', '(-27/8) × (-3/2)^5', '81 × (-3)^4',
    '(-216/125) × (-6/5)^5', '(64/121) × (-8/11)^2',
    '(0,75)^3 × (3/4)^7 × 9/16', '16/9 × (3/4)^5'
  ]);
  // 25/49 × (−7/5)³ est bien du même geste — 25/49 = (7/5)⁻² —, mais les
  // exposants se compensent presque : il reste (−7/5)¹, c'est-à-dire un nombre,
  // et non une puissance. La consigne « écris sous forme de puissance » n'y a
  // plus d'objet ; l'énoncé reste, rangé au calcul, où il dit vrai.
  lot('puissance 8_2012 ex1', 'calcul', 8, 'difficile', [
    '25/49 × (-7/5)^3'
  ]);

  // Exercice 2 — aⁿ/bⁿ = (a/b)ⁿ, le quotient des bases n'est pas donné
  lot('puissance 8_2012 ex2', 'meme-exposant', 8, 'difficile', [
    '((3/4)^3)/((15/8)^3)', '((-5)^2)/((10/3)^2)',
    '((3/2)^2)/((0,5)^2)', '((-3/2)^5)/((-5/6)^5)'
  ]);

  // Exercice 3 — (aⁿ)ᵖ, puis un second facteur de même base à absorber
  lot('puissance 8_2012 ex3', 'puissance-de-puissance', 8, 'moyen', [
    '((2/5)^2)^5', '((-3/4)^2)^3', '((-7/2)^3)^7'
  ]);
  lot('puissance 8_2012 ex3', 'puissance-de-puissance', 8, 'difficile', [
    '(0,7)^4 × ((7/10)^2)^3', '((-2,25)^3)^5 × 2,25^4',
    '((-3/4)^2)^4 × ((3/4)^3)^7', '(-8/125) × ((2/5)^3)^4'
  ]);

  // Exercice 4 — aⁿ × bⁿ = (a×b)ⁿ
  lot('puissance 8_2012 ex4', 'meme-exposant', 8, 'moyen', [
    '(2/5)^4 × (3/7)^4', '(-2/5)^3 × (1/2)^3', '2^3 × (7/4)^3',
    '1/8 × (-3/5)^3'
  ]);

  // Exercice 5 — un étage de fractions par-dessus les puissances
  lot('puissance 8_2012 ex5', 'quotient', 8, 'difficile', [
    '(1/1000 × (0,001)^-5)/(100^2 × 1/((0,01)^-2))'
  ]);
  lot('puissance 8_2012 ex5', 'meme-exposant', 8, 'difficile', [
    '25^-3 × (1/2)^6'
  ]);

  // Exercice 6 — 49 et 14 cachent le 7, 0,01 et 1/10 cachent le 10
  lot('puissance 8_2012 ex6', 'quotient', 8, 'difficile', [
    '(7 × 49^-3 × 14^-2)/(7^-2 × 2^3)',
    '((0,01)^2 × (1/10)^-3 × 2^2)/(5^-2 × 10^5)'
  ]);
  lot('puissance 8_2012 ex6', 'calcul', 8, 'difficile', [
    '(1/3)^-3 × 1/9 × ((-3/2)^-2 + 5/9)'
  ]);
  lot('puissance 8_2012 ex6', 'calcul-reel', 8, 'difficile', [
    '((-√2)^-3)^2 × (1/2)^-2'
  ]);

  // Exercice 7 (repris tel quel à l'exercice 11 de la même feuille)
  lot('puissance 8_2012 ex7', 'base-commune', 8, 'difficile', [
    '(-7/5)^6 × (5/7)^-3'
  ]);
  lot('puissance 8_2012 ex7', 'quotient', 8, 'difficile', [
    '((0,0001)^3 × (1/1000)^4)/(100^4 × (1/10000)^5)'
  ]);
  lot('puissance 8_2012 ex7', 'facteur-commun', 8, 'difficile', [
    '5^-14 × 15 + 5^-14 × 10'
  ]);
  lot('puissance 8_2012 ex7', 'calcul-reel', 8, 'difficile', [
    '√(49/25) + √(98/8) - √0,09'
  ]);
  lot('puissance 8_2012 ex7', 'calcul', 8, 'difficile', [
    '(3/4)^-2 - (11/7)^0 + (2/3)^2',
    '(1/2)^-4 × 1/8 × (11/5)^-1 × ((-2/3)^-2 + 3/4 - 2^-2)'
  ]);

  // Exercice 8 — sommes de puissances, exposants négatifs et exposant nul
  lot('puissance 8_2012 ex8', 'calcul', 8, 'moyen', [
    '(1/2)^-2 + (-3)^-2 + (-2/3)^3', '(2/3)^3 + (-3/4)^-2',
    '(4/5)^-4 + 2^-2 + (-11/7)^0'
  ]);
  lot('puissance 8_2012 ex8', 'meme-exposant', 8, 'difficile', [
    '(3/5)^-2 × (3/2)^2'
  ]);
  lot('puissance 8_2012 ex8', 'quotient', 8, 'difficile', [
    '((6/11)^3)/((-12/22)^3)'
  ]);
  lot('puissance 8_2012 ex8', 'quotient', 8, 'difficile', [
    '((5/7)^7 × (4/3)^12)/((-4/3)^13 × (-5/7)^6)',
    '((-49/45) × (-6/7)^6)/((3/7)^3 × (-14/15))'
  ]);

  // Exercice 9 — la puissance de 10 dans tous ses états
  lot('puissance 8_2012 ex9', 'quotient', 8, 'difficile', [
    '((10^2)^3 × 10^-5)/((10^-1)^2 × (10^-2)^-3)',
    '((0,01)^2 × 100^4)/((10^-2)^2 × (0,001)^2)'
  ]);
  lot('puissance 8_2012 ex9', 'base-commune', 8, 'difficile', [
    '(-5/4)^3 × (-4/5)^-7'
  ]);
  lot('puissance 8_2012 ex9', 'puissance-de-puissance', 8, 'difficile', [
    '((-2/7)^-3)^-2 × 4/49'
  ]);
  lot('puissance 8_2012 ex9', 'facteur-commun', 8, 'difficile', [
    '(-3)^-19 × 5 + (-3)^-19 × 4'
  ]);

  // Exercice 12 — les énoncés du QCM valent comme calculs
  lot('puissance 8_2012 ex12', 'meme-exposant', 8, 'difficile', [
    '((-20)^11 × (-3)^11)/((-10)^11)'
  ]);
  lot('puissance 8_2012 ex12', 'facteur-commun', 8, 'moyen', [
    '2^-4 + 2^-4'
  ]);

  // Exercice 14 — l'étage réel : racines carrées mêlées aux puissances
  lot('puissance 8_2012 ex14', 'calcul', 8, 'difficile', [
    '2 + (1 - 5/2)/(1 + 5/2)'
  ]);
  lot('puissance 8_2012 ex14', 'calcul-reel', 8, 'difficile', [
    '√(625/169) + √(13 + 6^2)',
    '(√(4/9) - 3 × √25/6)/(3/2 × √(50/72) - 9/4)',
    '(-2)^3 × √(16^-2) × 3 × ((1/3)^-2 × (5/3)^2 + √(9^2))',
    '(1/2)^-4 × 1/8 × (-5/2)^2 × ((-3/5)^-1 × √(25^-2) + (-5/7)^0)',
    '√(25^-3) × 5 × 9'
  ]);
  lot('puissance 8_2012 ex14', 'quotient', 8, 'difficile', [
    '((-2/5)^10 × (5/7)^2)/((7/5)^2 × (2/5)^7)'
  ]);
  lot('puissance 8_2012 ex14', 'puissance-de-puissance', 8, 'difficile', [
    '((2/3)^-4)^5 × 16/81'
  ]);

  // Exercice 15 — la dernière colonne de la feuille
  lot('puissance 8_2012 ex15', 'calcul', 8, 'moyen', [
    '-5/2 + 1/2 × 4/5', '1 + (-3/2 + 7/2)/(-3/2)'
  ]);
  lot('puissance 8_2012 ex15', 'quotient', 8, 'difficile', [
    '((-2/3)^2)/((-2/3)^5)',
    '((10^-1)^2 × 10^3)/((10^-3)^-2 × 10^-8)'
  ]);
  lot('puissance 8_2012 ex15', 'base-commune', 8, 'difficile', [
    '16/25 × (-5/4)^5'
  ]);
  lot('puissance 8_2012 ex15', 'facteur-commun', 8, 'difficile', [
    '(-21)^14 × 5^2 - 2^2 × (-21)^14'
  ]);

  // ÉCARTÉ DE CETTE FEUILLE, ET POURQUOI
  //
  //   ex1 G) « (3/7)³ × (−3/7)¹³ » vaut −(3/7)¹⁶. Un nombre négatif n'est
  //   qu'une puissance IMPAIRE, et 16 n'a pas de diviseur impair autre que 1 :
  //   aucune base rationnelle ne rend ce nombre-là. La consigne « écris sous
  //   forme de puissance » n'a pas de réponse ici. Signalé, non corrigé.
  //
  //   ex4 « (−2)⁵ × (−0,5)⁵ » et ex15 « ((0,2)⁻²)³ × 5⁻⁶ » valent 1. Le geste
  //   est juste — même exposant, bases inverses —, mais 1 n'a pas de base :
  //   la chaîne s'arrêterait sur « A = 1 », qui ne démontre rien.
  //
  //   ex5-2, ex9-2 et ex15-4 demandent une ÉCRITURE SCIENTIFIQUE — « donne le
  //   résultat sous la forme a × 10ⁿ ». C'est une autre leçon, avec sa propre
  //   forme à contrôler ; elle aura son chapitre.
  //
  //   ex1 h), ex6-3 et ex13-3 sont LITTÉRAUX : « a⁶ × a³ × a² »,
  //   « (a⁻¹b)³ab⁻² : a³b(a⁻²b⁻¹)² ». Le noyau calcule des nombres, pas des
  //   lettres ; il n'y a rien à vérifier, donc rien à publier.
  //
  //   ex5 D) « ((−3/5)⁻⁵ × (15/7)⁴) : ((4/5)⁸ × (4/25)⁻⁵) » vaut
  //   −5⁹ : (3 × 7⁴ × 1600) — ni puissance, ni fraction présentable. La
  //   feuille est sans doute mal recopiée à cet endroit ; on ne devine pas.
  //
  //   ex10 et ex12 sont des QCM. Leurs ÉNONCÉS valent comme calculs et sont
  //   repris à ce titre ; le choix multiple, lui, n'est pas une chaîne.

  // Page 4, question 4 — « avec les étapes rédigées sur la copie »
  lot('puissance 8_2012 p4', 'calcul', 8, 'difficile', [
    '(-3/5)^2 × (-1/2)^3', '(-2/3)^2 × 2 - 4/7 × (-2/3)^3',
    '(-1)^17 × (5,2)^0 × 34/5^2', '(5/2 - 3/5 + 1)/(5/2 × 3/5 - 1)'
  ]);

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

  // ═══════════════════════════════════════════════════════════════════════
  // 9ème — feuille « القوى في مجموعة الأعداد الحقيقية » — تمارين شاملة
  // (Puissance_9_part2, RIADHYET 2018-19, جوهر سويسي)
  //
  // C'est LE sommet du chapitre. Chaque exercice suit le même dessin : on
  // établit d'abord la valeur exacte de deux nombres, on montre qu'ils sont
  // inverses l'un de l'autre, puis on en déduit une puissance que personne ne
  // saurait développer — (2 − √3)¹⁰¹ compte cent-quinze chiffres.
  //
  // On transcrit les trois temps, dans l'ordre : établir, constater, conclure.
  // ═══════════════════════════════════════════════════════════════════════

  // Temps 1 — ÉTABLIR la valeur exacte. Ce sont les questions « بيّن أنّ ».
  lot('Puissance_9_part2 ex1', 'calcul-reel', 9, 'difficile', [
    '√2(1 - 3√2) + 2√3(√3 + 1/2) - √2'
  ]);
  lot('Puissance_9_part2 ex2', 'calcul-reel', 9, 'difficile', [
    '(√2 - 1)(√2 + 3) + 2(3/2 √2 + 4)', '3√18 - √32 - √49'
  ]);
  lot('Puissance_9_part2 ex3', 'calcul-reel', 9, 'difficile', [
    '(-√2)^5 + (√3)^7/(3√3) + √2(2 - 3√2)',
    '-√12 × √6 + 2√50 + (0,0006 × 10^-3)/10^-7'
  ]);
  lot('Puissance_9_part2 ex4', 'calcul-reel', 9, 'difficile', [
    '(√3 + √2)(√2 - 3√3) + 3√16', '√25 - 2√24 + √150 + √6'
  ]);
  // « احسب a = (3/√2)⁻² » : la feuille demande la valeur, et c'est 2/9. Mais
  // une valeur seule ne fait pas une chaîne — il n'y a rien entre l'énoncé et
  // la réponse. On garde donc le geste qui, lui, s'enseigne : rendre la base
  // rationnelle et laisser la puissance en place.
  lot('Puissance_9_part2 ex5', 'puissance-reelle', 9, 'moyen', [
    '(3/√2)^-2'
  ]);
  lot('Puissance_9_part2 ex5', 'meme-exposant', 9, 'moyen', [
    '(5/4)^-4 × (4/15)^-4'
  ]);

  // Temps 2 — CONSTATER que les deux nombres sont inverses. Une seule
  // identité fait tout le travail, et c'est elle qu'il faut voir.
  lie('Puissance_9_part2 ex1', 'conjugues', 9, 'moyen',
      'نعتبر A = √3 و B = -√2', [
    ['(A - B)(A + B)', '(√3 + √2) × (√3 - √2)']
  ]);
  lie('Puissance_9_part2 ex2', 'conjugues', 9, 'moyen',
      'نعتبر E = 5√2 + 7 و F = 5√2 - 7 — بيّن أنّ 1/E = F', [
    ['E × F', '(5√2 + 7) × (5√2 - 7)']
  ]);
  lie('Puissance_9_part2 ex3', 'conjugues', 9, 'moyen',
      'نعتبر a = 3 - 2√2 و b = 6 + 4√2 — بيّن أنّ b/2 مقلوب a', [
    ['a × b/2', '(3 - 2√2) × (3 + 2√2)']
  ]);
  lie('Puissance_9_part2 ex4', 'conjugues', 9, 'moyen',
      'نعتبر a = 5 - 2√6 و b = 5 + 2√6 — بيّن أنّ b مقلوب a', [
    ['a × b', '(5 - 2√6) × (5 + 2√6)']
  ]);
  lie('Puissance_9_part2 ex6', 'conjugues', 9, 'moyen',
      'نعتبر العددين 2 - √3 و 2 + √3', [
    ['(2 - √3)(2 + √3)', '(2 - √3) × (2 + √3)']
  ]);

  // Temps 3 — CONCLURE. Développer serait une faute de méthode autant qu'une
  // faute de patience : les exposants s'annulent deux à deux, il ne reste rien.
  lie('Puissance_9_part2 ex1', 'conjugues', 9, 'difficile',
      'نعتبر A = √3 و B = -√2، و قد رأينا أنّ (A - B)(A + B) = 1', [
    ['(A - B)^14 (A + B)^15', '(√3 + √2)^14 × (√3 - √2)^15']
  ]);
  lie('Puissance_9_part2 ex2', 'conjugues', 9, 'difficile',
      'نعتبر E = 5√2 + 7 و F = 5√2 - 7، و قد رأينا أنّ E × F = 1', [
    ['E^2016 F^2015 - E^2015 F^2016',
     '(5√2 + 7)^2016 × (5√2 - 7)^2015 - (5√2 + 7)^2015 × (5√2 - 7)^2016']
  ]);
  lie('Puissance_9_part2 ex3', 'conjugues', 9, 'difficile',
      'نعتبر a = 3 - 2√2 و b = 6 + 4√2، و قد رأينا أنّ a × b = 2', [
    ['G = a^3 b^4', '(3 - 2√2)^3 × (6 + 4√2)^4']
  ]);
  lie('Puissance_9_part2 ex4', 'conjugues', 9, 'difficile',
      'نعتبر a = 5 - 2√6 و b = 5 + 2√6، و قد رأينا أنّ a × b = 1', [
    ['b^7 (a^2 b)^3/(a^-3 b)',
     '(5 + 2√6)^7 × ((5 - 2√6)^2 × (5 + 2√6))^3/((5 - 2√6)^-3 × (5 + 2√6))']
  ]);
  lie('Puissance_9_part2 ex5', 'conjugues', 9, 'difficile',
      'نعتبر A = 3 - 2√2 و B = 3 + 2√2، و قد رأينا أنّ A مقلوب B', [
    ['A^2013 × B^2014', '(3 - 2√2)^2013 × (3 + 2√2)^2014']
  ]);
  lie('Puissance_9_part2 ex6', 'conjugues', 9, 'difficile',
      'نعتبر العددين 2 - √3 و 2 + √3، و قد رأينا أنّ جداءهما يساوي 1', [
    ['(2 - √3)^103/(2 - √3)^2 × ((2 + √3)^25)^4',
     '(2 - √3)^103/(2 - √3)^2 × ((2 + √3)^25)^4']
  ]);

  // Les déductions de l'exercice 3 : le même a et le même b, mais l'inverse
  // s'y invite, et la feuille demande de ne pas développer non plus.
  lie('Puissance_9_part2 ex3', 'calcul-reel', 9, 'difficile',
      'نعتبر a = 3 - 2√2 و b = 6 + 4√2', [
    ['E = 1/a - 1/b', '1/(3 - 2√2) - 1/(6 + 4√2)'],
    ['F = 1/(-6 - 2/a) - 1/(4/b - 6)',
     '1/(-6 - 2/(3 - 2√2)) - 1/(4/(6 + 4√2) - 6)'],
    ['a^3(8b^-3 + a^-3) - a^6',
     '(3 - 2√2)^3 × (8(6 + 4√2)^-3 + (3 - 2√2)^-3) - (3 - 2√2)^6']
  ]);

  // ÉCARTÉ DE CETTE FEUILLE, ET POURQUOI
  //
  //   ex1 B) « √((√3−1)²) + √((√2−5)²) − (4+√3) » repose sur √(x²) = |x|, et
  //   le signe de √2 − 5 y décide de tout. C'est la leçon de la valeur
  //   absolue, pas celle des puissances ; le noyau refuse d'ailleurs la
  //   racine d'une somme, et il a raison de la refuser ici.
  //
  //   ex5-2 « (10⁻⁵ × 3000) : (0,00003 × 10⁶) » demande une ÉCRITURE
  //   SCIENTIFIQUE, ex5-4 et ex6-1 sont LITTÉRAUX — « (x⁵+x⁷):(x⁸+x¹⁰) = x⁻³ »,
  //   « Y = ((a⁻³)²(ab⁻¹)²) : (a⁻²b⁻¹)² ». Ni l'une ni les autres ne se
  //   vérifient sur des nombres, et l'on ne publie que ce qui se vérifie.

  // ════════════════════════════════════════════════════════════════════════
  // 9ème — feuille « القوى في IR – 9 أساسي » (Puissance9-2011, فوزي الغربي)
  //
  // Trois exercices, et une obsession : la puissance de 10 sous toutes ses
  // déguisements. 0,001 est 10⁻³, 1/10000 est 10⁻⁴, 100 est 10², et il faut
  // les voir tous avant de pouvoir compter. Les derniers items quittent le 10
  // pour des bases mêlées — 35, 75, 21, 25 —, et là c'est la décomposition en
  // facteurs premiers qui tranche.
  // ═══════════════════════════════════════════════════════════════════════

  // Exercice 1 — les énoncés du QCM, et les calculs de la seconde moitié
  lot('Puissance9-2011 ex1', 'puissance-reelle', 9, 'difficile', [
    '(-2√3)^-4', '(-√75/√3)^-2', '(√18 + √2)^-2'
  ]);
  lot('Puissance9-2011 ex1', 'calcul-reel', 9, 'difficile', [
    '(-2)^-3 + (2√2/3)^-2',
    '((-7)^-1)^-2 × (1/7)^-2 + 1/3^-2 × (3/7)^-1',
    '5^-1 × (√3)^-2 + 10^-1 - (√17)^0'
  ]);
  lot('Puissance9-2011 ex1', 'quotient', 9, 'moyen', [
    '3^7/(3^4 × 3)'
  ]);
  lot('Puissance9-2011 ex1', 'calcul', 9, 'moyen', [
    '(6^2 × 6^3 × 6)/(6^3 × 6^2)'
  ]);
  lot('Puissance9-2011 ex1', 'quotient', 9, 'difficile', [
    '(2 × 10^-3)/8',
    '(4 × (10^-2)^3 × 10^2)/(12 × 10^-3)',
    '(4 × 10^-5 × 10^8)/(12 × 10^-3)',
    '(12 × 10^-4 × 5 × 10^6)/(15 × 10^3 × 2 × 10^2)'
  ]);

  // Exercice 2 — « اختصر » : douze quotients de puissances de 10
  lot('Puissance9-2011 ex2', 'quotient', 9, 'difficile', [
    '(5 × 10^3 × 7 × 10^-9)/(2 × 10^-2 × 10^-12)',
    '(9 × 10^-7 × 2 × 10^15)/(0,6 × 10^-5 × 10^19)',
    '(400 × 10^-3 × 0,6 × 10^-11)/(0,002 × (10^2)^3)',
    '(10^-8 × 0,7 × 10^-2)/(21 × 10^3)',
    '(7 × 10^4)/(2 × (10^3)^2)',
    '(10^-2 × 2^3 × 5^2 × 10)/(10^2 × 10^-4)',
    '(2^5 × 5^3 × 7 × 11^2)/(8 × 25 × 121)',
    '(10^5 × 2^5 × 5^2 × 10)/(2^3 × 10^-4)',
    '(5 × 10^5 × (2 × 10^-1)^3)/(24 × 10^2)',
    '(25 × 10^2 × 121)/(11 × 150 × 3)'
  ]);

  // Exercice 3 — « اختصر » encore, mais les bases se cachent mieux
  lot('Puissance9-2011 ex3', 'produit', 9, 'moyen', [
    '2^3 × 2^-4 × (2^3)^-5'
  ]);
  lot('Puissance9-2011 ex3', 'puissance-de-puissance', 9, 'moyen', [
    '(2^3)^-2 × 2^5'
  ]);
  lot('Puissance9-2011 ex3', 'quotient', 9, 'moyen', [
    '(5^4 × 5^-3)/5^6', '(7^4 × (7^-2)^3)/7^-5'
  ]);
  lot('Puissance9-2011 ex3', 'quotient', 9, 'difficile', [
    '((7^3 × 5^-2)^3)/((5^3 × 7^-5)^-2)',
    '(7 × 10^12 × 4 × 10^5/2) × 10^-4',
    '(3 × 10^5 × 2 × 10^-2)/(8 × 10^4)',
    '(3 × 10^2 × 1,2 × 10^-5)/(15 × 10^2)',
    '((1/10)^-3 × 10^5)/((1/10000)^41 × 100^-5)',
    '((0,001)^-4 × 10^-6)/(10^7 × 1000^-3)',
    '((0,001)^-2 × (1/10000)^4)/(10^-2 × (1/100)^-3)',
    '((-3 × 2^3)^3)/((8 × 9)^2)',
    '((-3/4 × 8/21)^2)/((2/7)^2 × (-81/16))',
    '((-2)^-7 × (-6)^5 × (-3)^10)/(18^4 × (-12)^3)',
    '((0,04)^-3 × (0,64)^2)/((0,12)^-3 × (0,48)^2)',
    '((35)^-7 × (75)^-4)/((21)^-5 × (25)^-7)'
  ]);

  // ÉCARTÉ DE CETTE FEUILLE, ET POURQUOI
  //
  //   Le QCM ex1 propose « (−√3) × (√3)⁵ » avec pour réponses (−3)⁵, (−3)¹⁰ et
  //   (−√3)¹⁰. Aucune ne convient : l'expression vaut −27. Le premier facteur
  //   porte sans doute un exposant 5 que la photocopie a mangé. On ne devine
  //   pas un énoncé ; l'item est laissé de côté.
  //
  //   ex1-3 E et ex3 K, L, M, N, J sont LITTÉRAUX (a et b), et « اكتب G على
  //   شكل aⁿ » ne dit pas ce qu'est G. Rien à vérifier, donc rien à publier.
  //
  //   « (7⁵ × (7⁻¹)⁻²) : (7⁴ × 7³) » vaut 7⁰ = 1, et « (3×10⁻²):(1,5×10⁻⁴)
  //   − 2×10² » vaut 0. Justes tous les deux, mais 1 et 0 n'ont pas de base :
  //   il n'y a pas de forme à écrire, ni de chaîne à dérouler.

  // ════════════════════════════════════════════════════════════════════════
  // 9ème — feuille « القوى » 2011 (Puissance2011, فوزي الغربي)
  //
  // La sœur de la précédente : mêmes exercices 1, 6 et 7, mêmes A, B, C et
  // G, H, I — on ne les transcrit pas deux fois. Ce qu'elle apporte en propre,
  // ce sont ses exercices 2 à 5, où les radicaux et les puissances négatives
  // s'entremêlent ligne après ligne, et où figure le conjugué le plus haut du
  // lot : (2√2 − √7)¹⁵³ × (2√2 + √7)¹⁵⁴.
  // ═══════════════════════════════════════════════════════════════════════

  lot('Puissance2011 ex2', 'calcul', 9, 'difficile', [
    '(-3/2)^-2 × (3/2)^-3 × 27/8'
  ]);
  lot('Puissance2011 ex2', 'calcul-reel', 9, 'difficile', [
    '((-√2)^3)^2 × (1/2)^-2',
    '(-√2)^5 + (1/2)^2 × 3(√3)^3 - 1/4(√2 + 4(√3)^2)'
  ]);
  lot('Puissance2011 ex2', 'quotient', 9, 'difficile', [
    '(2^-7 × 3^2)/((1/3)^-2 × (2^-3)^2)'
  ]);
  lot('Puissance2011 ex2', 'meme-exposant', 9, 'difficile', [
    '(5/8)^5 × (-5/4)^-5'
  ]);

  // Exercice 3 — le sommet : 153 et 154, et pas un chiffre à écrire
  lot('Puissance2011 ex3', 'conjugues', 9, 'difficile', [
    '(2√2 - √7)^153 × (2√2 + √7)^154'
  ]);
  lot('Puissance2011 ex3', 'calcul-reel', 9, 'difficile', [
    '2^-4 × (2√2)^3', '(√3)^-1 × √21 - (√7)^-2/(√7)^-5'
  ]);

  // Exercice 4
  lot('Puissance2011 ex4', 'calcul', 9, 'difficile', [
    '9 × (3/2)^-2 - 4(2/3)^-3 × 27^-1'
  ]);
  lot('Puissance2011 ex4', 'quotient', 9, 'difficile', [
    '(5 × 25^-3 × 15^2)/(5^-2 × 3^3)'
  ]);
  lot('Puissance2011 ex4', 'calcul-reel', 9, 'difficile', [
    '√(2^4) - √(2^-4)',
    '5 × (2^3/5)^-1 + ((-√2)^-2)^3',
    '(2/√3)^-2 × 3^-1',
    '((-√5)^-2)^3 × ((1/(2√5))^-2 - (3√5)^2)'
  ]);

  // Exercice 5
  lot('Puissance2011 ex5', 'calcul-reel', 9, 'difficile', [
    '(√5)^-1 × (1/√5 + (√5)^-3)',
    '(2(√3)^-1 - √3/2)^2'
  ]);
  lot('Puissance2011 ex5', 'calcul', 9, 'difficile', [
    '(5/2)^-2 + 2 × (5/3)^-1 × 3^-1 - 5^-2'
  ]);

  // Les exercices 1, 6 et 7 de cette feuille sont ceux de Puissance9-2011 et
  // de puissance 8_2012, au mot près ; A, B, C et G, H, I y reparaissent aussi.
  // Un énoncé transcrit une fois suffit : le tirage, lui, ne se répète pas.

  // ═══════════════════════════════════════════════════════════════════════
  // 9ème — « سلسلة تمارين عدد 3 », جانفي 2015, الأستاذ عماد الدريدي
  //
  // Cinq devoirs de contrôle rassemblés, de 2011 à 2013. Chacun bâtit une
  // expression littérale, la réduit, puis la fait vivre sur des nombres —
  // c'est le mouvement du programme de 9ème. On garde la seconde moitié, celle
  // qui porte sur des nombres : la première ne se vérifie pas.
  // ═══════════════════════════════════════════════════════════════════════

  lot('dridi ex1', 'calcul', 9, 'difficile', [
    '3 × (-3/2)^-1 + 9 × (-2/3)^2 - 1/2 × (-3)^-1'
  ]);
  lot('dridi ex1', 'calcul-reel', 9, 'difficile', [
    '(5/√2 - (3/2)^2)^-1'
  ]);
  lot('dridi ex1', 'puissance-reelle', 9, 'difficile', [
    '25^-3 × (1/5)^-4', '(2/√5)^-7 × 5/4'
  ]);
  lot('dridi ex1', 'quotient', 9, 'difficile', [
    '(0,5^-3 × 2^-9)/((1/2)^-4)'
  ]);

  // Exercice 1, question I-2 — E = a⁻²b⁻² avec a = 1+√3 et b = 1−√3 : deux
  // conjugués, et le produit tombe avant qu'on ait rien développé.
  lie('dridi ex1', 'conjugues', 9, 'difficile',
      'نعتبر E = a^-2 b^-2 حيث a = 1 + √3 و b = 1 - √3', [
    ['E', '(1 + √3)^-2 × (1 - √3)^-2']
  ]);

  lot('dridi ex2', 'calcul-reel', 9, 'difficile', [
    '5^-1 × (√2)^2 - (√3)^2',
    '(2√2 - 1)/(2√2 + 1) + (2√2 + 1)/(2√2 - 1)'
  ]);
  lot('dridi ex2', 'conjugues', 9, 'difficile', [
    '1/((√5 - 2)^-2012) × (√5 + 2)^2012'
  ]);
  lot('dridi ex2', 'puissance-reelle', 9, 'difficile', [
    '(-5√5 × (√5)^4)/25^3', '((√2/3)^-7 × (2/9)^2)/((3/√2)^-9)'
  ]);
  lot('dridi ex2', 'quotient', 9, 'difficile', [
    '((0,00001)^3 × 3/100)/(0,0003 × 1/10^10)'
  ]);

  lot('dridi ex3', 'calcul-reel', 9, 'difficile', [
    '3 × (3/2)^-4 - (√2/√3)^6'
  ]);
  // E × F, où F = (a/b)² a été établi à la question précédente
  lie('dridi ex3', 'calcul-reel', 9, 'difficile',
      'نعتبر E = 3 × (3/2)^-4 - (√2/√3)^6 و F = (a/b)^2، حيث a = √3 و b = √2', [
    ['E × F', '(3 × (3/2)^-4 - (√2/√3)^6) × (√3/√2)^2']
  ]);

  // Exercice 4 — a = 4x², et l'on demande sa valeur pour x = 2⁻² + 2⁻³
  lie('dridi ex4', 'calcul-reel', 9, 'difficile',
      'نعتبر a = ((-2)^3/(x(√2)^8))^-2 حيث x = 2^-2 + 2^-3', [
    ['a', '((-2)^3/((2^-2 + 2^-3) × (√2)^8))^-2']
  ]);
  lot('dridi ex4', 'calcul-reel', 9, 'difficile', [
    '(10^-3/√5)^-2 × 5/(0,01^-3)',
    '-3(√5)^0 + √(3^3) × 5^-1 × √3'
  ]);
  lot('dridi ex4', 'puissance-reelle', 9, 'difficile', [
    '7(√3)^-2 + (√3/7)^-2 + (√3/5)^-2',
    '((√2)^3/2) × √(12^4) × (√(9/2))^-2'
  ]);

  // Exercice 5 — A = 3⁻¹a⁶b⁻⁴, puis sa valeur pour a = √7 et a/b = 3
  lie('dridi ex5', 'calcul-reel', 9, 'difficile',
      'نعتبر A = 3^-1 a^6 b^-4 حيث a = √7 و a/b = 3', [
    ['A', '3^-1 × (√7)^6 × (√7/3)^-4']
  ]);
  lot('dridi ex5', 'puissance-reelle', 9, 'difficile', [
    '(-√3)^5 × 3^7', '36 × 15^-2', '√((8^10 + 4^10)/(2^10 + 1))'
  ]);
  lot('dridi ex5', 'calcul-reel', 9, 'difficile', [
    '(√5)^2 - (-√5)^4 × (-1)^7', '√0,00005 × √0,02'
  ]);

  // ÉCARTÉ DE CETTE FEUILLE, ET POURQUOI
  //
  //   Les premières questions de chaque exercice sont LITTÉRALES : « montre que
  //   E = a⁻²b⁻² », « montre que F = (a/b)² », « montre que A = 3⁻¹a⁶b⁻⁴ ». Le
  //   noyau calcule des nombres, pas des lettres — il ne saurait pas vérifier
  //   ces lignes-là, et une page qu'on ne vérifie pas ne se publie pas. Les
  //   secondes questions, elles, portent sur des nombres, et ce sont elles
  //   qu'on transcrit : le résultat littéral y est donné en préambule, comme
  //   sur la feuille.
  //
  //   ex1 J = (10⁻⁴ × (0,01)²) : ((1/100) × (0,001)²) vaut 1, et
  //   ex5 d = (7⁻³ × (2×3)² × 15⁻² × 5⁻⁴) : ((2×5⁶)⁻¹ × (7⁻¹×2)³) vaut 1 aussi.
  //   Justes tous les deux, mais 1 n'a pas de base : rien à écrire, rien à
  //   dérouler.

  // ═══════════════════════════════════════════════════════════════════════
  // 9ème — « خاصيات القوى في مجموعة الأعداد الحقيقية », exercices 36 à 42
  // (Puissance_9_part1, pages 11 à 13 — la fin de la feuille)
  //
  // Les dernières pages sont les plus hautes : la consigne « أكتب في صيغة قوّة
  // لعدد حقيقي » y revient à chaque ligne, et la base à trouver n'est plus
  // écrite nulle part. Elle se lit sur la VALEUR, une fois le calcul fait.
  // ═══════════════════════════════════════════════════════════════════════

  lot('Puissance_9 ex38', 'calcul-reel', 9, 'moyen', [
    '(1/√3)^-2', '(3/2)^-2 - (√3)^-4'
  ]);
  lot('Puissance_9 ex38', 'puissance-reelle', 9, 'difficile', [
    '5^-2 × (√5)^7', '(√10/3)^-3 × (3/√5)^-3', '√27 × (√3)^-7'
  ]);
  lot('Puissance_9 ex38', 'quotient', 9, 'difficile', [
    '(10^-5 × (0,001)^-1)/((1/100)^-2 × 10^7)'
  ]);

  lot('Puissance_9 ex39', 'puissance-reelle', 9, 'difficile', [
    '(2/5)^3 × (-√3/2)^3',
    '((-√2)^-3)^-5 × ((-√2)^3)^4',
    '3/4 × (√3/2)^5',
    '9π^2/16'
  ]);
  lot('Puissance_9 ex39', 'facteur-commun', 9, 'moyen', [
    '3^-5 + 3^-5 + 3^-5'
  ]);

  lot('Puissance_9 ex40', 'calcul-reel', 9, 'difficile', [
    '(4/√3)^-2', '((√5)^-2)/((√5)^-4)', '(4 + 3√2)^2'
  ]);
  lot('Puissance_9 ex40', 'puissance-reelle', 9, 'difficile', [
    '(√6)^11 × (√6)^-48', '5^10 × (√5)^-30',
    '((√11)^40 × (√5)^19)/((√5)^-21)'
  ]);
  // X = a⁻³b⁻³ pour a = √3+1 et b = √3−1 : deux conjugués, et le produit
  // tombe avant qu'on ait développé quoi que ce soit.
  lie('Puissance_9 ex40', 'conjugues', 9, 'difficile',
      'نعتبر X = a^-3 b^-3 حيث a = √3 + 1 و b = √3 - 1', [
    ['X', '(√3 + 1)^-3 × (√3 - 1)^-3']
  ]);

  // E = a⁻¹b² pour a = √20 et b = √5 — la réduction littérale est donnée
  lie('Puissance_9 ex41', 'calcul-reel', 9, 'difficile',
      'نعتبر E = a^-1 b^2 حيث a = √20 و b = √5', [
    ['E', '(2√5)^-1 × (√5)^2']
  ]);

  lot('Puissance_9 ex42', 'calcul-reel', 9, 'difficile', [
    '5^-2/((√5/2)^-2)', '25 × (5/4)^-2 + 6√3 × (√3/2)^-3'
  ]);
  lot('Puissance_9 ex42', 'quotient', 9, 'difficile', [
    '((1/100)^-3 × 1000^2)/(10 × (0,0001)^-2)'
  ]);

  // ex36, ex37, ex38-4, ex39-3 et ex42-2 sont LITTÉRAUX : « اختصر E = a²(b⁻²)³ :
  // (a⁻⁶b²)⁻¹ ». Les questions numériques qui les suivent — « احسب A pour
  // x = −1 et y = −2 » — se réduisent à un produit de deux nombres une fois la
  // simplification donnée : une ligne, pas une chaîne. On garde celles dont le
  // calcul, lui, a de la matière.

  const par = (f, n, d) => ITEMS.filter(x => x.f === f && x.d === d && x.n <= n);
  const familles = () => [...new Set(ITEMS.map(x => x.f))];

  const API = { ITEMS, par, familles };
  if (M) module.exports = API; else racine.Items = API;
})(typeof window !== 'undefined' ? window : globalThis);
