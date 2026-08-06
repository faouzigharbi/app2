// LA CARTE D'IDENTITÉ DES FEUILLES — ce que chaque PDF contient, exercice par
// exercice, et ce que le moteur en sait faire.
//
// Trente-quatre documents, deux cent vingt pages. Sans cette carte, chaque
// reprise recommence par la même fouille : ouvrir les fichiers, chercher où
// l'on s'était arrêté, redécouvrir qu'un exercice demande une machinerie
// absente. Elle est donc écrite POUR LE JOUR SUIVANT, et se tient à jour à la
// main — comme classement.js, et pour la même raison : une donnée qu'un
// programme engendre, personne ne la corrige.
//
// ── Ce que dit chaque fiche ──────────────────────────────────────────────
//
//   fichier      son nom sur le disque
//   pages        combien
//   texte        'lisible'   la couche de texte s'extrait : le squelette
//                            (séances, numéros d'exercices) se lit sans ouvrir
//                'opaque'    du texte, mais des glyphes sans table Unicode —
//                            il faut lire les pages comme des images
//                'scan'      une photo : rien à extraire
//   etat         'dépouillé' | 'partiel' | 'squelette' | 'non lu'
//   chapitres    les chapitres de la bibliothèque qu'il alimente
//   contenu      la liste des exercices, avec pour chacun ce qu'on en sait
//   machine      ce qui MANQUE au moteur pour le prendre en entier
//
// Un exercice porte : son numéro, le nombre de questions du maître, les
// notions en jeu, et son sort — 'dans la bibliothèque', 'à faire',
// 'hors machinerie (raison)'.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);

  const INVENTAIRE = [

    // ═══════════════════════════════════════════════════════════════════
    // THALÈS — le gisement dépouillé en premier
    // ═══════════════════════════════════════════════════════════════════
    {
      fichier: 'Thales 2008.pdf', pages: 9, texte: 'opaque', etat: 'partiel',
      chapitres: ['thales9', 'proport9'],
      contenu: [
        { n: 1, questions: 34, notions: ['équation du premier degré', 'proportion'],
          sort: 'bibliothèque', ou: 'proport9 — 4 familles' },
        { n: 2, questions: 1, notions: ['jugement : peut-on appliquer Thalès ?'],
          sort: 'hors machinerie', pourquoi: 'question de jugement oui/non motivé — famille « erreurs » à créer' },
        { n: 3, questions: 6, notions: ['proportion'], sort: 'à faire' },
        { n: 4, questions: 6, notions: ['QCM : أشطب العبارات الخاطئة'],
          sort: 'hors machinerie', pourquoi: 'QCM — les falsifications sont déjà des énoncés faux nommés, mais la page « erreurs » n\'existe pas pour ce chapitre' },
        { n: 5, questions: 3, notions: ['Thalès', 'Chasles'], sort: 'bibliothèque' },
        { n: 6, questions: 4, notions: ['Thalès', 'partage extérieur', 'relation entre rapports'],
          sort: 'bibliothèque', ou: 'trois items : les deux figures + le menhir + OD/OE' },
        { n: 7, questions: 2, notions: ['angles alternes-internes', 'Thalès'], sort: 'bibliothèque' },
        { n: 8, questions: 2, notions: ['Thalès papillon', 'décimaux'], sort: 'bibliothèque' },
        { n: 9, questions: 4, notions: ['Thalès'], sort: 'bibliothèque' },
        { n: 10, questions: 4, notions: ['Thalès — quatre figures'], sort: 'à faire' },
        { n: 11, questions: 6, notions: ['tableau à compléter — six configurations'], sort: 'à faire' },
        { n: 12, questions: 1, notions: ['situation concrète : phares et mur'], sort: 'à faire' },
        { n: 13, questions: 1, notions: ['cônes opposés par le sommet'], sort: 'à faire' },
        { n: 14, questions: 1, notions: ['skieur : CD sur une pente'], sort: 'à faire' },
        { n: 15, questions: 1, notions: ['hauteur d\'un arbre par l\'ombre'], sort: 'à faire' },
        { n: 16, questions: 2, notions: ['profondeur d\'un puits par visée'], sort: 'à faire' },
        { n: 17, questions: 8, notions: ['lecture de rapports sur une graduation'], sort: 'à faire' },
        { n: 18, questions: 8, notions: ['placer un point à un rapport donné'],
          sort: 'hors machinerie', pourquoi: 'construction — le chapitre ne fait pas construire' }
      ],
      machine: ['une famille « erreurs » pour ex2 et ex4',
                'les situations concrètes (ex12 à ex16) entrent telles quelles : ce sont des Thalès habillés']
    },

    {
      fichier: 'THALES0 2014.pdf', pages: 2, texte: 'opaque', etat: 'partiel',
      chapitres: ['thales9'],
      contenu: [
        { n: 1, questions: 7, notions: ['projection selon une direction', 'Thalès ×3', 'partage', 'MC² = MA·MD'],
          sort: 'bibliothèque', ou: 'مسألة — sept questions' },
        { n: 2, questions: 3, notions: ['produit de trois rapports = 1 (Ménélaüs)'],
          sort: 'à faire', pourquoi: 'la machinerie existe (relation produit) — il ne manque que la pose' },
        { n: 3, questions: 8, notions: ['trapèze', 'partage', 'milieux', 'proportions composées'],
          sort: 'bibliothèque', ou: 'douze questions, 80 étapes' },
        { n: 4, questions: 8, notions: ['cascade de six parallèles', 'algèbre des rapports'],
          sort: 'bibliothèque', ou: 'huit questions ; la neuvième (J = D) attend le fait « deux points confondus »' },
        { n: 5, questions: 6, notions: ['trapèze rectangle', 'relation harmonique', 'partage extérieur'],
          sort: 'bibliothèque', ou: 'neuf questions' },
        { n: 6, questions: 4, notions: ['repère', 'coordonnées'],
          sort: 'hors machinerie', pourquoi: 'le chapitre ne manipule pas de repère : il faudrait un fait « coordonnées »' }
      ],
      machine: ['un fait « deux points confondus » (ex4 q8)',
                'un fait « coordonnées dans un repère » (ex6)']
    },

    {
      fichier: 'Série Thalès 9B 17 (2).pdf', pages: 2, texte: 'lisible', etat: 'partiel',
      chapitres: ['thales9'],
      contenu: [
        { n: 1, questions: 6, notions: ['isocèle', 'milieux', 'réciproque des milieux', 'symétrie', 'rapport'],
          sort: 'bibliothèque',
          ou: 'six questions ; la septième (MK = 3/8 BC) demande un point que le maître ne nomme pas' },
        { n: 2, questions: 6, notions: ['losange', 'Thalès papillon', 'trois milieux', 'algèbre des rapports'],
          sort: 'bibliothèque',
          ou: 'sept questions ; c\'est un LOSANGE et non un carré — NM n\'y a pas de valeur exacte, tout s\'y démontre en rapports' },
        { n: 3, questions: 6, notions: ['repère', 'cercle', 'rectangle'],
          sort: 'hors machinerie', pourquoi: 'repère' },
        { n: 4, questions: 6, notions: ['parallélogramme', 'aire', 'angle de 60°'],
          sort: 'hors machinerie', pourquoi: 'aires — le chapitre ne calcule pas d\'aire' }
      ],
      machine: ['les aires', 'le repère']
    },

    {
      fichier: 'THALES9.pdf', pages: 3, texte: 'opaque', etat: 'partiel',
      chapitres: ['thales9'],
      contenu: [
        { n: 1, questions: 2, notions: ['milieux'], sort: 'bibliothèque' },
        { n: 4, questions: 2, notions: ['réciproque de Thalès'], sort: 'bibliothèque' },
        { n: 5, questions: 2, notions: ['symétrie centrale'], sort: 'bibliothèque' },
        { n: 12, questions: 3, notions: ['Thalès — deux parallèles'], sort: 'bibliothèque' }
      ],
      machine: ['relire la feuille : ses autres exercices ne sont pas répertoriés']
    },

    {
      fichier: 'Thales 2021 modifié.pdf', pages: 8, texte: 'lisible', etat: 'partiel',
      chapitres: ['thales9'], exercices: 16,
      contenu: [
        { n: 1, questions: 3, notions: ['symétrie centrale', 'ligne des milieux', 'transport de l\'angle droit', 'rectangle'],
          sort: 'bibliothèque',
          ou: 'cinq questions ; sa q2a demande la même chose PAR DEUX CHEMINS — le moteur n\'en donne qu\'un, le plus court' },
        { n: 2, questions: 4, notions: ['cercle de diamètre [AB]', 'isocèle', 'milieux', 'rapport d\'aires'],
          sort: 'à faire', pourquoi: 'ses trois premières questions entrent ; la quatrième est un rapport d\'AIRES' },
        { n: 3, questions: 3, notions: ['parallélogramme', 'deux configurations de même sommet', 'EB² = EF × EG'],
          sort: 'bibliothèque',
          ou: 'quatre questions ; sa q3 (projection de I sur (CG) selon (QG)) attend une relecture — la feuille nomme Q et I sans les définir' },
        { n: 4, questions: 5, notions: ['trapèze rectangle', 'ligne des milieux', 'réciproque des milieux'],
          sort: 'bibliothèque',
          ou: 'cinq questions ; la feuille écrit « الموازي لـ(AD) » là où seul (AB) donne sa figure' },
        { n: 6, questions: 6, notions: ['trapèze', 'papillon', 'algèbre des rapports', 'moyenne harmonique'],
          sort: 'bibliothèque',
          ou: 'cinq questions ; son « 2/5 » est AB/(AB+CD), et OM = ON — ses deux dernières questions (milieux I, J et le point P) restent à poser' },
        { n: 5, questions: 2, notions: ['milieux'], sort: 'bibliothèque' },
        { n: 7, questions: 2, notions: ['rectangle', 'Thalès hors figure', 'symétrie centrale', 'projection selon une direction'],
          sort: 'bibliothèque',
          ou: 'six questions ; O tombe HORS du rectangle, et ses nombres ne sont pas libres — I n\'est le milieu de [BC] que si AM = (2/3)AB' },
        { n: 8, questions: 2, notions: ['Thalès', 'Chasles'], sort: 'bibliothèque' },
        { n: 9, questions: 3, notions: ['partage d\'un segment', 'rapports égaux', 'perpendiculaires'],
          sort: 'à faire' },
        { n: 10, questions: 3, notions: ['placer un point à un rapport donné', 'abscisses'],
          sort: 'hors machinerie', pourquoi: 'construction et repère' },
        { n: 11, questions: 3, notions: ['milieux emboîtés', 'symétrie'],
          sort: 'à faire', pourquoi: 'sa question 2 — (PQ)//(MN) — demande une relecture de la figure : P et Q symétriques de C donnent (PQ)//(AB), et non //(MN)' },
        { n: 12, questions: 2, notions: ['Varignon', 'transitivité du parallélisme'],
          sort: 'bibliothèque',
          ou: 'trois questions ; sa seconde — IJKL losange quand ABCD est un rectangle — attend « قطرا المستطيل متقايسان »' },
        { n: 13, questions: 2, notions: ['milieux', 'symétrie', 'réciproque des milieux'],
          sort: 'bibliothèque',
          ou: 'quatre questions ; sa seconde partie (I milieu de [MN], G = (MQ)∩(BN)) est tronquée dans la feuille — la question n\'y figure pas' },
        { n: 14, questions: 2, notions: ['centre d\'un parallélogramme', 'réciproque des milieux', 'ligne des milieux'],
          sort: 'bibliothèque', ou: 'cinq questions ; le centre O sert de milieu deux fois' },
        { n: 15, questions: 3, notions: ['trapèze', 'projection selon une direction'], sort: 'à faire' }
      ],
      machine: ['« قطرا المستطيل متقايسان » — les diagonales d\'un rectangle sont égales (ex12 q2)',
                'le rapport d\'AIRES (ex2 q4) — les aires manquent au chapitre',
                'la feuille est LUE EN ENTIER : quinze exercices recensés, quatre dans la bibliothèque, neuf prêts à y entrer, deux hors machinerie']
    },

    {
      fichier: 'TRIANGLES9_23 (1) (1).pdf', pages: 2, texte: 'lisible', etat: 'partiel',
      chapitres: ['thales9'], exercices: 7,
      contenu: [
        { n: 1, questions: 3, notions: ['losange', 'centre de gravité'], sort: 'bibliothèque' },
        { n: 5, questions: 2, notions: ['orthocentre'], sort: 'bibliothèque' },
        { n: 7, questions: 3, notions: ['parallélogramme', 'rectangle', 'Pythagore'], sort: 'bibliothèque' }
      ]
    },

    {
      fichier: 'Pythagore (3).pdf', pages: 2, texte: 'lisible', etat: 'dépouillé',
      chapitres: ['thales9'],
      contenu: [
        { n: 3, questions: 1, notions: ['Pythagore'], sort: 'bibliothèque' },
        { n: 4, questions: 2, notions: ['centre de gravité'], sort: 'bibliothèque' },
        { n: 'مسألة', questions: 2, notions: ['parallélogramme', 'symétrie'], sort: 'bibliothèque' },
        { n: 'مراجعة', questions: 0, notions: ['la page des neuf règles'],
          sort: 'bibliothèque', ou: 'c\'est le catalogue lui-même, recopié mot pour mot' }
      ]
    },

    // ═══════════════════════════════════════════════════════════════════
    // LES FEUILLES DE RÉVISION DU CONCOURS — le gros du gisement
    // ═══════════════════════════════════════════════════════════════════
    {
      fichier: 'Revision_9eme_2025_3.pdf', pages: 47, texte: 'lisible',
      // COMPTÉ, pas estimé : le plus grand numéro d'exercice atteint dans chaque
      // séance, lu sur la couche de texte. La séance 2 en donne 5, et la lecture
      // l'a confirmé exactement.
      etat: 'en cours', exercices: 72,
      titre: 'امتحان شهادة ختم التعليم الأساسي — مراجعة (جوان 2025)',
      chapitres: ['arith9', 'divisibilite8', 'diviseurs7', 'premiers7', 'thales9', 'reel9', 'radic9'],
      // Le livre est organisé en TREIZE SÉANCES. Le squelette ci-dessous sort
      // de la couche de texte, page par page — il n'a pas fallu l'ouvrir.
      structure: [
        { seance: 1, pages: '2-6', exercices: 12, sujet: 'arithmétique : divisibilité, arbre de choix, puissances et restes', vu: true },
        { seance: 2, pages: '7-9', exercices: 5, vu: true,
          sujet: 'radicaux et expressions inverses · une expression A = x²−x−12 déclinée '
               + 'huit fois · deux exercices de repère · une pyramide' },
        { seance: 3, pages: '10-13', exercices: 7, vu: true,
          sujet: 'Thalès quatre fois sur une figure · un losange dans un repère · deux exercices de radicaux négatifs · arithmétique et arbre de choix · le plus long repère du livre · un prisme' },
        { seance: 4, pages: '14-16', exercices: 6, vu: true,
          // COMPTAGE CORRIGÉ : 6 et non 2. Les en-têtes des pages 15 et 16 ne
          // survivent pas à l'extraction ; seule la lecture les a vus.
          sujet: 'une expression et un trapèze qui la refabrique · un repère où A joue trois rôles · le nombre d\'or · encadrer plutôt que calculer · un 60° qui fait un équilatéral · une pyramide' },
        { seance: 5, pages: '17-20', exercices: 8, vu: true,
          sujet: 'un nombre minuscule et son inverse énorme · un rectangle où la relation métrique donne tout · deux exercices d\'encadrement · un prisme · une aire qui refabrique une équation · un carré qui glisse' },
        { seance: 6, pages: '21-23', exercices: 5, sujet: 'géométrie — Thalès, un peu de repère' },
        { seance: 7, pages: '24-26', exercices: 4, vu: true,
          sujet: 'radicaux et ORDRE · deux cercles emboîtés jusqu\'à l\'orthocentre · intervalles et aire d\'un carré découpé · relation métrique et triangle équilatéral' },
        { seance: 8, pages: '27-29', exercices: 5, sujet: 'géométrie et ESPACE — la plus chargée en solides' },
        { seance: 9, pages: '30-32', exercices: 4, vu: true,
          sujet: 'radicaux, encadrements et une inéquation · trapèze rectangle et deux médianes · UN DOUBLON de la séance 7 · trapèze où l\'angle droit se propage' },
        { seance: 10, pages: '33-36', exercices: 2, sujet: 'géométrie — deux longs exercices seulement' },
        { seance: 11, pages: '37-39', exercices: 6, sujet: 'mixte — arithmétique, algèbre et géométrie' },
        { seance: 12, pages: '40-43', exercices: 6, sujet: 'géométrie, espace et STATISTIQUES — la plus longue' },
        { seance: 13, pages: '44-47', exercices: 6, sujet: 'géométrie, repère et statistiques — la séance de clôture' }
      ],
      contenu: [
        { n: '1.1', questions: 3, notions: ['divisibilité par 12', 'reste d\'une puissance', 'arbre de choix'], sort: 'à faire' },
        { n: '1.2', questions: 3, notions: ['nombres à 3 chiffres divisibles par 12, 15'], sort: 'à faire' },
        { n: '1.3', questions: 4, notions: ['arbre de choix', 'PGCD des chiffres', 'divisibilité par 15'], sort: 'à faire' },
        { n: '1.4', questions: 3, notions: ['code secret', 'divisibilité par 15 et 12'], sort: 'à faire' },
        { n: '1.5', questions: 2, notions: ['restes de la division par 4', 'arbre de choix'], sort: 'à faire' },
        { n: '1.6', questions: 3, notions: ['ensemble défini par des conditions sur les chiffres'], sort: 'à faire' },
        { n: '1.7', questions: 2, notions: ['arbre de choix', 'divisibilité par 12'], sort: 'à faire' },

        // ── SÉANCE 2 — lue en entier, et portée pour ses deux premiers tiers ──
        // Le chapitre d'accueil est « brevet » : une séance mêle radicaux,
        // algèbre et géométrie, et n'est le chapitre de personne.
        { n: '2.1', questions: 7,
          notions: ['division par le conjugué', 'facteur commun au numérateur',
                    'rationaliser 1/√3', 'extraire le carré parfait',
                    'deux nombres inverses', 'nombre صمّ'],
          sort: 'bibliothèque', ou: 'brevet ex21 — sept volets',
          pourquoi: 'a = 2√3−3, b = (2√3+3)/3, c = 1+√3/2 ; a·b = 1 et 2a·c = √3' },
        { n: '2.2', questions: 8,
          notions: ['valeur d\'une expression en √2−1', 'forme canonique A+49/4',
                    'différence de deux carrés', 'produit nul', 'facteur commun',
                    'inéquation du premier degré', 'relation métrique', 'aire'],
          sort: 'bibliothèque', ou: 'brevet ex22 — huit volets',
          pourquoi: 'une seule expression A = x²−x−12 porte les huit questions ; '
                  + 'le 49/4 est exactement ce qu\'il faut pour fermer le carré' },
        { n: '2.3', questions: 13,
          notions: ['repère', 'rectangle', 'symétrique', 'projection selon une direction',
                    'parallélogramme', 'losange', 'Thalès', 'droite des milieux',
                    'coordonnées dans un autre repère'],
          sort: 'bibliothèque', ou: 'brevet ex23 — treize volets',
          pourquoi: 'B y est le centre du losange, et c\'est de là que sortent G '
                  + 'puis M, N et tout le reste' },
        { n: '2.4', questions: 12,
          notions: ['repère', 'cercle de diamètre ⇒ angle droit', 'longueurs',
                    'Thalès', 'symétrique', 'droite des milieux', 'aire d\'un trapèze',
                    'centre de gravité — les 2/3', 'trapèze isocèle'],
          sort: 'bibliothèque', ou: 'brevet ex24 — douze volets',
          pourquoi: 'ce n\'est pas un exercice de coordonnées mais un exercice de '
                  + 'THALÈS posé dans un repère ; A y est le centre de gravité de EFC' },
        { n: '2.5', questions: 8,
          notions: ['pyramide', 'droite ⊥ plan', 'plans parallèles', 'Thalès dans l\'espace'],
          sort: 'hors machinerie', pourquoi: 'la géométrie de l\'espace n\'a aucun chapitre' },

        // ── SÉANCE 3 — quatre exercices sur sept portés ───────────────────
        { n: '3.1', questions: 6,
          notions: ['Thalès quatre fois', 'une seule direction de parallèles',
                    'rapport de deux segments', 'milieu', 'ligne des milieux d\'un trapèze'],
          sort: 'bibliothèque', ou: 'brevet ex31 — six volets',
          pourquoi: 'les segments portés par les parallèles grandissent régulièrement : '
                  + 'RJ = 1, AB = 3, MP = 5, CD = 15' },
        { n: '3.2', questions: 6,
          notions: ['repère', 'perpendicularité aux axes', 'intersection',
                    'symétrique', 'losange par les diagonales', 'aire d\'un losange',
                    'ensemble de points'],
          sort: 'bibliothèque', ou: 'brevet ex32 — six volets',
          pourquoi: 'les deux diagonales se coupent en K(2;0), leur milieu commun, '
                  + 'et elles sont perpendiculaires : aucune longueur de côté n\'est utile' },
        { n: '3.3', questions: 5,
          notions: ['rationaliser', 'comparer par les carrés', 'deux nombres négatifs',
                    'quotients et renversement', 'distance sur une droite graduée'],
          sort: 'bibliothèque', ou: 'brevet ex33 — cinq volets',
          pourquoi: 'a et b sont tous deux négatifs — 24 < 25 et 18 < 49 — donc '
                  + 'b < a < 0 donne b/a > 1, et non l\'inverse' },
        { n: '3.4', questions: 6,
          notions: ['identités remarquables', 'simplifier par le facteur du numérateur',
                    'signe', 'comparer des carrés', 'produit de deux négatifs',
                    '(a−b)² = ab et l\'inverse'],
          sort: 'bibliothèque', ou: 'brevet ex34 — six volets',
          pourquoi: 'la dernière question est le sommet : (a−b)² = ab donne d\'un coup '
                  + 'que 1/b − 1/a = 1/(a−b)' },
        { n: '3.5', questions: 6,
          notions: ['somme de trois impairs consécutifs', 'divisibilité par 6 et 12',
                    'arbre de choix', 'chiffres et divisibilité'],
          sort: 'à faire',
          pourquoi: 'sa partie I est de l\'arithmétique que arith9 sait faire ; sa '
                  + 'partie II demande l\'ARBRE DE CHOIX, qui n\'a aucun chapitre' },
        { n: '3.6', questions: 20,
          notions: ['repère', 'partage d\'un segment', 'médiatrice', 'triangle isocèle rectangle',
                    'aire et périmètre', 'rectangle', 'parallélogramme', 'symétrique',
                    'alignement', 'ensembles de points', 'changement de repère'],
          sort: 'bibliothèque', ou: 'brevet ex36 — vingt volets, le plus long du chapitre',
          pourquoi: 'B(3√2+1 ; 0) n\'est pas décoratif : il place D exactement en 2√2, '
                  + 'donc E sur (AJ) à la hauteur √2+1, et c\'est ce qui fait de BCE un '
                  + 'triangle À LA FOIS isocèle et rectangle. Tout est en √2, rien n\'est '
                  + 'approché, et 1/(√2+1) = √2−1 rend le changement de repère lisible' },
        { n: '3.7', questions: 10,
          notions: ['prisme droit', 'trapèze', 'droite ⊥ plan', 'Thalès dans l\'espace'],
          sort: 'hors machinerie', pourquoi: 'la géométrie de l\'espace n\'a aucun chapitre' },

        // ── SÉANCE 4 — cinq exercices sur six ─────────────────────────────
        // (le comptage automatique donnait 2 : la couche de texte des pages 15
        //  et 16 est trop abîmée pour porter les en-têtes. Il y en a SIX.)
        { n: '4.1', questions: 6,
          notions: ['forme canonique', 'différence de deux carrés', 'Thalès dans un trapèze',
                    'ligne des milieux', 'aire d\'un trapèze'],
          sort: 'bibliothèque', ou: 'brevet ex41 — six volets',
          pourquoi: 'la question 5 REFABRIQUE l\'équation : x/8 = 4/(4+x) donne '
                  + 'x²+4x−32 = 0. La figure n\'existe donc que pour x = 4' },
        { n: '4.2', questions: 8,
          notions: ['repère', 'angle de 45°', 'Thalès', 'centre de gravité',
                    'symétrique', 'milieu', 'perpendicularité par le produit scalaire'],
          sort: 'bibliothèque', ou: 'brevet ex42 — huit volets',
          pourquoi: 'H(3+√5 ; 3+√5) a ses DEUX coordonnées égales — c\'est tout ce qu\'il '
                  + 'faut pour l\'angle de 45°. Puis A est sommet, centre de gravité et milieu' },
        { n: '4.3', questions: 4,
          notions: ['rationaliser', 'nombres inverses', 'identité algébrique',
                    'racine d\'un carré et valeur absolue'],
          sort: 'bibliothèque', ou: 'brevet ex43 — quatre volets',
          pourquoi: 'a et b sont le NOMBRE D\'OR et son inverse : ab = 1, donc a/b = a², '
                  + 'et l\'identité de la question 3 se déroule sans un calcul de radical' },
        { n: '4.4', questions: 7,
          notions: ['rationaliser par le conjugué', 'encadrement', 'valeur absolue',
                    'ranger des carrés', 'nombre rationnel'],
          sort: 'bibliothèque', ou: 'brevet ex44 — sept volets',
          pourquoi: 'a et b sont les deux racines de u²−3u+1 : leur somme vaut 3 et leur '
                  + 'produit 1. L\'énoncé ne le dit pas, mais tout en découle' },
        { n: '4.5', questions: 7,
          notions: ['angle de 60°', 'triangle équilatéral', 'médiane de l\'hypoténuse',
                    'losange', 'orthocentre', 'cercle de diamètre', 'milieu de l\'hypoténuse'],
          sort: 'bibliothèque', ou: 'brevet ex45 — sept volets',
          pourquoi: 'un triangle isocèle qui porte un angle de 60° est ÉQUILATÉRAL — '
                  + 'c\'est de là que part toute la figure' },
        { n: '4.6', questions: 8,
          notions: ['pyramide régulière', 'droite ⊥ plan', 'triangle équilatéral', 'volume'],
          sort: 'hors machinerie', pourquoi: 'la géométrie de l\'espace n\'a aucun chapitre' },

        // ── SÉANCE 5 — sept exercices sur huit ────────────────────────────
        { n: '5.1', questions: 7,
          notions: ['réduire des radicaux', 'carré parfait irrationnel', 'nombres inverses',
                    'signe d\'une différence', 'ranger des inverses'],
          sort: 'bibliothèque', ou: 'brevet ex51 — sept volets',
          pourquoi: 'a = 17−12√2 est l\'INVERSE de b² : (17−12√2)(17+12√2) = 1. '
                  + 'a vaut à peine 0,03, d\'où 1/a énorme — c\'est là que le rangement se joue' },
        { n: '5.2', questions: 6,
          notions: ['rectangle', 'relation métrique', 'droite des milieux', 'Pythagore',
                    'losange par les diagonales', 'aire'],
          sort: 'bibliothèque', ou: 'brevet ex52 — six volets',
          pourquoi: 'BI² = IA × IC avec IA = 2 IC donne IC = 2 ; aucune longueur '
                  + 'n\'est donnée directement, tout sort de là' },
        { n: '5.3', questions: 8,
          notions: ['comparer par les carrés', 'produit de deux négatifs', 'factoriser',
                    'renversement par un facteur négatif', 'somme d\'inégalités'],
          sort: 'bibliothèque', ou: 'brevet ex53 — huit volets',
          pourquoi: 'CE SONT LES MÊMES DEUX NOMBRES que la séance 7 tmr 1 partie 2 '
                  + '(ils s\'y appellent s et t), mais découpés en huit questions au lieu '
                  + 'de quatre, avec une comparaison de plus. Le découpage est la leçon' },
        { n: '5.4', questions: 5,
          notions: ['somme et différence d\'encadrements', 'encadrer un carré',
                    'forme canonique', 'intersection d\'intervalles', 'entiers naturels'],
          sort: 'bibliothèque', ou: 'brevet ex54 — cinq volets',
          pourquoi: '(2x−1)² = 4(x²−x)+1 : encadrer le CARRÉ encadre x²−x sans jamais '
                  + 'multiplier deux encadrements l\'un par l\'autre, ce qui serait faux' },
        { n: '5.5', questions: 3,
          notions: ['encadrement', 'valeur absolue et signe', 'majorer une valeur absolue'],
          sort: 'bibliothèque', ou: 'brevet ex55 — trois volets',
          pourquoi: 'sur ]0;1[ les deux quantités 3x−5 et x−4 sont négatives : '
                  + 'les deux valeurs absolues se lèvent de la même façon' },
        { n: '5.6', questions: 7,
          notions: ['prisme droit', 'trapèze', 'droite ⊥ plan', 'triangle isocèle dans l\'espace'],
          sort: 'hors machinerie', pourquoi: 'la géométrie de l\'espace n\'a aucun chapitre' },
        { n: '5.7', questions: 5,
          notions: ['valeur d\'une expression', 'factoriser par un facteur commun',
                    'produit nul', 'aire d\'un trapèze', 'aire d\'un triangle équilatéral'],
          sort: 'bibliothèque', ou: 'brevet ex57 — cinq volets',
          pourquoi: 'la partie II REFABRIQUE l\'équation de la partie I : S1 = √3 S2 '
                  + 'donne 5+2x = 3x², c\'est-à-dire M = 0, donc x = 5/3' },
        { n: '5.8', questions: 7,
          notions: ['Thalès', 'aire d\'un carré', 'forme canonique', 'minimum',
                    'inéquation du second degré', 'changement de repère', 'cerf-volant'],
          sort: 'bibliothèque', ou: 'brevet ex58 — sept volets',
          pourquoi: 'x² + (4−x)² = 2(x−2)² + 8 : le minimum 8 est atteint au milieu' },

        // ── SÉANCE 7 — LUE ET PORTÉE EN ENTIER, les quatre exercices ──────
        { n: '7.1', questions: 9,
          notions: ['rationaliser sous le radical', 'réduire pour comparer',
                    'encadrement de √3', 'ordre et inverses',
                    'produit de deux facteurs négatifs', 'multiplier par un négatif retourne'],
          sort: 'bibliothèque', ou: 'brevet ex71 — neuf volets',
          pourquoi: 'm = 4√6 et n = 7√2 : la comparaison des carrés 96 et 98 '
                  + 'donne √3 < 1,75. Puis s < t par le facteur négatif (1 − √3)' },
        { n: '7.2', questions: 12,
          notions: ['cercle de diamètre ⇒ angle droit', 'Pythagore', 'relation métrique',
                    'Thalès', 'médiane de l\'hypoténuse', 'droite des milieux',
                    'centre de gravité', 'rectangle', 'orthocentre'],
          sort: 'bibliothèque', ou: 'brevet ex72 — douze volets',
          pourquoi: 'le triangle 6-8-10 fait tout tomber juste ; seule BG = 4√13/3 '
                  + 'ne se devine pas. Se termine sur l\'orthocentre de ASO' },
        { n: '7.3', questions: 12,
          notions: ['intervalles et valeur absolue', 'intersection', 'entiers d\'un intervalle',
                    'forme canonique', 'différence de deux carrés', 'facteur commun',
                    'aires d\'un carré découpé', 'équation du second degré factorisée',
                    'Thalès et alignement'],
          sort: 'bibliothèque', ou: 'brevet ex73 — douze volets',
          pourquoi: 'tout tient dans une égalité que l\'énoncé ne dit pas : F = 2E + 12, '
                  + 'et l\'aire grise vaut S = E + 23/2 = (F + 11)/2' },
        { n: '7.4', questions: 8,
          notions: ['relation métrique', 'aire d\'un triangle', 'Pythagore',
                    'médiane de l\'hypoténuse', 'triangle équilatéral', 'losange',
                    'droite des milieux'],
          sort: 'bibliothèque', ou: 'brevet ex74 — huit volets',
          pourquoi: 'BH = 3√3 par deux chemins — la relation métrique puis l\'aire — '
                  + 'et le 3 de AH n\'était pas choisi au hasard : AH = HI = AI = 3' },

        // ── SÉANCE 9 — LUE EN ENTIER ; son exercice 3 EST celui de la 7 ────
        { n: '9.1', questions: 9,
          notions: ['√(u²) = |u|', 'rationaliser par le conjugué',
                    'encadrement d\'amplitude 10⁻¹', 'produit de deux encadrements',
                    'inéquation dont le coefficient est négatif'],
          sort: 'bibliothèque', ou: 'brevet ex91 — neuf volets',
          pourquoi: 'deux pièges dans le même exercice : √2 < √3 donne √3−√2 et non '
                  + 'l\'inverse, puis a+b = −√3 est négatif et retourne l\'inéquation' },
        { n: '9.2', questions: 8,
          notions: ['trapèze rectangle', 'segment des milieux', 'Thalès',
                    'cercle de diamètre ⇒ angle droit', 'triangle isocèle',
                    'médianes et centre de gravité', 'orthocentre',
                    'médiane de l\'hypoténuse'],
          sort: 'bibliothèque', ou: 'brevet ex92 — huit volets',
          pourquoi: 'BD = BC fait de BDC un isocèle : le pied de la hauteur issue de B '
                  + 'est donc le milieu N de [DC], et [DI] et [BN] deviennent deux médianes' },
        { n: '9.3', questions: 8, notions: ['relation métrique', 'triangle équilatéral', 'losange'],
          sort: 'bibliothèque', ou: 'brevet ex74 — c\'est EXACTEMENT l\'exercice 4 de la séance 7',
          pourquoi: 'mêmes données, mêmes questions, numérotation simplement continuée '
                  + '(IV, V, VI). Le livre se répète : on ne double pas la page' },
        { n: '9.4', questions: 8,
          notions: ['trapèze rectangle', 'segment des milieux', 'Pythagore réciproque',
                    'médiane de l\'hypoténuse', 'centre de gravité', 'projection orthogonale',
                    'orthocentre', 'cercle de diamètre'],
          sort: 'bibliothèque', ou: 'brevet ex94 — huit volets',
          pourquoi: 'BI = BJ n\'est pas une donnée libre : dès que I et J sont les milieux, '
                  + 'les deux longueurs sont égales. Le « = 4 » ne fixe que AN = 4√2' }
      ],
      machine: ['l\'arbre de choix (dénombrement) n\'existe dans aucun chapitre',
                'les restes de puissances — arith9 sait le faire, à relier',
                'LE REPÈRE EST FAIT — chaines/brevet/repere.js : points construits, '
                + 'jamais recopiés, et chaque affirmation de l\'énoncé recalculée '
                + 'dessus. Le livre pose un exercice de repère par séance : il resservira',
                'LE CHAPITRE DU REPÈRE EST FAIT — chaines/repere9 : huit familles '
                + 'engendrées (milieu, symétrique, distance, nature d\'un quadrilatère, '
                + 'alignement, directions, quatrième sommet, cercle circonscrit)',
                'la géométrie de l\'espace — une pyramide par séance, semble-t-il',
                'les onze autres séances restent à ouvrir'],
      // TROIS COQUILLES RELEVÉES PAR LE CALCUL, séance 2 — détail dans
      // chaines/brevet/README.md, et trois falsifications les rejouent.
      coquilles: [
        '2.1 q1)أ : (3√3−1)(4−5√3) vaut 17√3−49 ; le facteur qui donne −34+13√3 '
        + 'est (2√3−1). Le 3 est un 2.',
        '2.2 I-3)ب : A = 4(x+7) donne un discriminant 185 ; avec 4(x+3) le facteur '
        + 'commun saute aux yeux (x = −3 ou 8).',
        '2.2 II : « CH = x−3 » répète BH (la figure dit x+2), et AH = √7 ne se '
        + 'factorise pas. AH = √6 donne x = 4, BH = 1, CH = 6, aire √6/2.',
        '2.4 q4 : « لتكن F مناظرة بالنسبة إلى O » ne dit pas de QUEL point F est '
        + 'le symétrique. C\'est E : c\'est le seul choix pour lequel N et P sont '
        + 'confondues (q4)ب) et M milieu de [BC] (q4)أ). Avec A on retombe sur '
        + 'l\'axe (OI) lui-même, avec B on obtient M(6;−6).',
        '7.3 q5)أ : « A و M و I على نفس الاستقامة » — ces trois points ne sont '
        + 'JAMAIS alignés (A et M sont tous deux sur [AB], I est sur [CD]). '
        + 'C\'est A, N, I : la relation imprimée x/(x+1/2) = 2/(x+4) est '
        + 'exactement leur condition d\'alignement, donc elle, elle est juste.',
        '7.3 q5)ب : S = 11/2 correspond à F = 0, c\'est-à-dire x = 1. Or '
        + 'l\'alignement donne x² + 2x = 1, donc x = √2 − 1 et S = 9/2. '
        + '(Contrôle : S = 23/2 donne bien x = 3, et c\'est E = 0.)',
        '9.2 q5 : « BM = 16/8 ». Or BN = 8 et M est le centre de gravité, donc '
        + 'BM en vaut les deux tiers : BM = 16/3. Le 8 du dénominateur est un 3.',
        '5.8 q3 : « جد x لكي يصبح الرباعي HCEA معيّنا ». HCEA n\'est un losange '
        + 'pour AUCUNE valeur de x : HC = CE donne x = 8/3, et à cette valeur '
        + 'AH = 8√2/3 tandis que HC = 4√5/3. Ce que x = 8/3 donne, c\'est '
        + 'AH = EA et HC = CE — un CERF-VOLANT d\'axe (CA). (À x = 2 on obtient '
        + 'l\'autre cerf-volant, d\'axe (HE).) À arbitrer par le maître.',
        '4.4 q5 : « بيّن أن DC = a » (a = (3−√5)/2). Avec AB = 1, AC = 1/2 et '
        + 'l\'angle droit en C, on obtient BC = √3/2 puis DC = (3−√3)/2 — un √3 '
        + 'et non un √5. Pour que DC vaille a il faudrait BC = √5/2, ce qui rend '
        + 'AC² = 1 − 5/4 négatif. La question 5 n\'est donc pas portée ; les '
        + 'quatre premières le sont.'
      ]
    },

    {
      fichier: 'Thales 2020.pdf', pages: 8, texte: 'lisible', etat: 'dépouillé',
      exercices: 19, chapitres: ['thales9'],
      // OUVERT ET RECONNU : sa première partie REPREND Thales 2008 — mêmes
      // figures, mêmes nombres (ex5 a/b/c, ex6, le menhir, OD/OE). Rien à y
      // reprendre : c'est déjà dans la bibliothèque. Sa valeur est ailleurs.
      contenu: [
        { n: '1-4', questions: 12, notions: ['QCM de configurations', 'RU', 'MN et AB'],
          sort: 'à faire', pourquoi: 'QCM — même famille « erreurs » que Thales 2008 ex4' },
        { n: 5, questions: 3, notions: ['Thalès'], sort: 'bibliothèque', ou: 'identique à Thales 2008 ex5' },
        { n: 6, questions: 6, notions: ['Thalès', 'partage extérieur'],
          sort: 'bibliothèque', ou: 'identique à Thales 2008 ex6, menhir et OD/OE compris' },
        // LA PARTIE NEUVE : « الجزء الثاني — القطعة الرابطة بين منتصفي ضلعين ».
        { n: 'II-1', questions: 2, notions: ['triangle médian', 'angles correspondants'],
          sort: 'bibliothèque', ou: 'la règle des angles correspondants a été posée pour elle' },
        { n: 'II-2', questions: 1, notions: ['triangle médian', 'périmètre'],
          sort: 'bibliothèque', ou: 'cinq questions : les trois côtés, puis les deux périmètres' },
        { n: 'II-3', questions: 1, notions: ['Thalès', 'Chasles', 'périmètre d\'un quadrilatère'],
          sort: 'bibliothèque', ou: 'cinq questions : AD, AB, BC, AE, puis le périmètre' }
      ],
      etatFinal: 'DÉPOUILLÉ — sa partie I est celle de Thales 2008, sa partie II est entière',
      machine: [] },

    { fichier: 'revision_Concours_2019__TarTib.pdf', pages: 6, texte: 'lisible',
      etat: 'non lu', exercices: 8, chapitres: ['reel9', 'encadrement'],
      machine: ['l\'ordre et l\'encadrement — chapitres existants'] },

    { fichier: 'revision_Concours_2019_EspaceExe1C.pdf', pages: 3, texte: 'lisible',
      etat: 'non lu', exercices: 1, chapitres: ['espace'],
      machine: ['la géométrie de l\'espace n\'a pas de chapitre'] },

    { fichier: 'revision1.pdf', pages: 4, texte: 'lisible', etat: 'non lu', exercices: 6 },
    { fichier: 'revision2012.pdf', pages: 3, texte: 'opaque', etat: 'non lu' },
    { fichier: 'revision22011.pdf', pages: 3, texte: 'opaque', etat: 'non lu' },
    { fichier: 'revision22023.pdf', pages: 2, texte: 'opaque', etat: 'non lu' },
    { fichier: 'revis_9eem_1.pdf', pages: 3, texte: 'scan', etat: 'non lu' },
    { fichier: 'RevisBeja.pdf', pages: 14, texte: 'scan', etat: 'partiel',
      chapitres: ['thales9'],
      contenu: [{ n: 3, questions: 1, notions: ['relation métrique'], sort: 'bibliothèque' }],
      machine: ['scan : chaque page doit être lue comme une image'] },

    // ═══════════════════════════════════════════════════════════════════
    // PYTHAGORE ET LE RESTE — non ouverts
    // ═══════════════════════════════════════════════════════════════════
    { fichier: 'Pythagore_part1.pdf', pages: 9, texte: 'opaque', etat: 'non lu' },
    { fichier: 'Pythagore_part2.pdf', pages: 9, texte: 'opaque', etat: 'non lu' },
    { fichier: 'Pythagore_part3 (1).pdf', pages: 30, texte: 'opaque', etat: 'non lu' },
    { fichier: 'Pythagore 2011 revision.pdf', pages: 2, texte: 'lisible', etat: 'non lu', exercices: 5 },
    { fichier: 'Exercices de pythagore (1).pdf', pages: 2, texte: 'lisible', etat: 'non lu', exercices: 6 },
    { fichier: 'Thales_part3 (1).pdf', pages: 4, texte: 'opaque', etat: 'non lu' },
    { fichier: 'Thales_part5.pdf', pages: 9, texte: 'opaque', etat: 'non lu' },
    { fichier: 'Thales Exe2021_2.pdf', pages: 1, texte: 'lisible', etat: 'non lu', exercices: 3 },
    { fichier: 'Thales Exe2022_1.pdf', pages: 1, texte: 'lisible', etat: 'non lu', exercices: 3 },
    { fichier: 'thales eva0.pdf', pages: 1, texte: 'opaque', etat: 'non lu' },
    { fichier: 'TRIANGLE 9 2021.pdf', pages: 1, texte: 'lisible', etat: 'non lu', exercices: 2 },
    { fichier: 'controle4 Mme Sondos.pdf', pages: 2, texte: 'opaque', etat: 'non lu' },
    { fichier: 'ANGLES7_1.pdf', pages: 3, texte: 'opaque', etat: 'dépouillé',
      chapitres: ['angles7'], machine: ['sept familles en sont sorties'] },
    { fichier: 'ANGLES7_pilote_2_.pdf', pages: 4, texte: 'opaque', etat: 'dépouillé',
      chapitres: ['angles7'] },
    { fichier: 'angles7_PC.pdf', pages: 10, texte: 'scan', etat: 'non lu' },
    { fichier: 'nouveau-document-2021-01-19.pdf', pages: 3, texte: 'scan', etat: 'non lu' },
    { fichier: 'Ajustement_thales_1.pdf', pages: 1, texte: 'lisible', etat: 'dépouillé',
      chapitres: ['thales9'],
      contenu: [{ n: 'النشاط الأول', questions: 9, notions: ['lire la configuration', 'écrire les trois rapports'],
                  sort: 'bibliothèque', ou: 'c\'est aussi le GABARIT de rédaction du chapitre' }] },
    { fichier: 'Applications_élémentaires_Thalès_3.pdf', pages: 1, texte: 'lisible',
      etat: 'dépouillé', chapitres: ['thales9', 'proport9'],
      contenu: [
        { n: 'التمرين الأول', questions: 15, notions: ['fractions égales'], sort: 'bibliothèque' },
        { n: 'التمرين الثاني', questions: 6, notions: ['quatrième proportionnelle', 'décimaux'], sort: 'bibliothèque' }
      ] }
  ];

  // ── Le compte, pour ne pas se raconter d'histoires ───────────────────────
  function bilan() {
    let pages = 0, ex = 0, faits = 0, aFaire = 0, hors = 0;
    for (const d of INVENTAIRE) {
      pages += d.pages || 0;
      const c = d.contenu || [];
      ex += d.exercices || c.length;
      for (const e of c) {
        if (e.sort === 'bibliothèque') faits++;
        else if (e.sort === 'à faire') aFaire++;
        else if (e.sort === 'hors machinerie') hors++;
      }
    }
    return { documents: INVENTAIRE.length, pages, exercicesRecenses: ex,
             dansLaBibliotheque: faits, aFaire, horsMachinerie: hors };
  }

  const API = { INVENTAIRE, bilan };
  if (M) module.exports = API; else racine.Inventaire = API;
})(typeof window !== 'undefined' ? window : globalThis);
