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
