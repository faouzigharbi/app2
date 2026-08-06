// LE CLASSEMENT — quelle fiche appartient à quel chapitre.
//
// Certaines fiches ont été montées comme des séries de révision : « تمارين
// 11 → 14 », « العمليات الأربعة في IR », « سلسلة تمارين عدد 1 ». Ce sont de
// bons exercices, mais ce ne sont pas des chapitres : sept entrées de 9ᵉ
// disaient toutes « les opérations dans ℝ », et l'élève ne savait pas laquelle
// cocher. On les remet donc dans LEUR chapitre, avec une étiquette qui dit
// d'où elles viennent.
//
// CE FICHIER EST FAIT POUR ÊTRE CORRIGÉ À LA MAIN. Le maître connaît son
// programme mieux que ce classement ; s'il déplace une ligne, l'exportation
// suivante s'y conforme sans rien recalculer.
//
//   vers      la clé du chapitre d'accueil
//   revision  vrai si la fiche doit porter la mention « مراجعة »
//   nom       un nom de chapitre à corriger, quand l'ancien ne disait rien
window.CLASSEMENT = {

  // ── 9ᵉ — LES OPÉRATIONS DANS ℝ ────────────────────────────────────────
  // radic9 porte la leçon (a√b, rationaliser, valeur absolue) ; les six
  // autres sont des séries d'entraînement sur la même matière.
  reel9:     { vers: 'radic9', revision: true },
  reels:     { vers: 'radic9', revision: true },
  revision2: { vers: 'radic9', revision: true },
  serie1:    { vers: 'radic9', revision: true },
  serie2:    { vers: 'radic9', revision: true },
  serie3:    { vers: 'radic9', revision: true },

  // ── 9ᵉ — LE BREVET, UNE PARTIE À PART ─────────────────────────────────
  //
  // Le livre de révision n'est pas un chapitre de plus : une seule de ses
  // séances mêle radicaux, factorisation, équations, inéquations et relation
  // métrique — la ranger sous « radic9 » la rendrait introuvable, et fausserait
  // le chapitre d'accueil. C'est la PARTIE qu'on ouvre quand on révise pour la
  // مناظرة, pas quand on apprend une leçon. Elle garde donc son nom.
  brevet: { nom: 'البريفي — مراجعة المناظرة' },

  // repere9 porte la LEÇON du repère ; il reste chez lui, c'est un chapitre du
  // programme et non une série de révision. stat9 est dans le même cas : c'est
  // la leçon de statistiques, née des trois fiches Stat2009 / Stat2013 /
  // Stat9_Corrige, et les séances 12 et 13 du livre de révision y aboutiront.

  // ── 7ᵉ ────────────────────────────────────────────────────────────────
  // « سلاسل البرهان » ne dit pas de quoi il s'agit : carré parfait, cube,
  // multiple — c'est de l'arithmétique, et sa place est avec les diviseurs.
  premiers7: { vers: 'diviseurs7', revision: true },

  // « سلسلة تمارين عدد 1 » ne nomme rien du tout. La fiche ne bouge pas de
  // place — elle n'a pas de chapitre d'accueil —, mais elle prend un nom.
  naturels7: { nom: 'الحساب على الأعداد الطبيعية — أيسر طريقة' }
};
