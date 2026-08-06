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
      etat: 'en cours', exercices: 76,
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
        { seance: 6, pages: '21-23', exercices: 6, vu: true,
          // Le livre y numérote DEUX exercices « 5 », et son en-tête « 4 » est vide.
          sujet: 'un rectangle qui glisse et un 100 qui ne bouge pas · deux inverses et quatre expressions qui s\'effondrent · le triangle 6-8-10 dans un repère · un en-tête VIDE · le nombre d\'or dessiné par un carré · un parallélépipède' },
        { seance: 7, pages: '24-26', exercices: 4, vu: true,
          sujet: 'radicaux et ORDRE · deux cercles emboîtés jusqu\'à l\'orthocentre · intervalles et aire d\'un carré découpé · relation métrique et triangle équilatéral' },
        { seance: 8, pages: '27-29', exercices: 5, vu: true,
          sujet: 'une expression puis la chaîne des trois moyennes · UN DOUBLON de la séance 5 · un équilatéral qui devient rectangle · une pyramide · deux valeurs absolues et une factorisation cachée' },
        { seance: 9, pages: '30-32', exercices: 4, vu: true,
          sujet: 'radicaux, encadrements et une inéquation · trapèze rectangle et deux médianes · UN DOUBLON de la séance 7 · trapèze où l\'angle droit se propage' },
        { seance: 10, pages: '33-36', exercices: 6, vu: true,
          // COMPTAGE CORRIGÉ : 6 et non 2, comme pour la séance 4. Et DEUX de
          // ces six sont des reprises mot pour mot d'autres séances.
          sujet: 'deux nombres microscopiques et un carré qui les somme · UN DOUBLON de la séance 3 · une expression et un triangle rectangle qui la refabrique · un équilatéral qui devient rectangle · le nombre d\'or retrouvé par Thalès · UN DOUBLON de la séance 9' },
        { seance: 11, pages: '37-39', exercices: 6, vu: true,
          // LA PREMIÈRE SÉANCE ENTIÈRE du livre : six exercices, six portés.
          // Ni doublon, ni exercice d'espace, ni statistiques.
          sujet: 'deux chiffres à trouver trois fois · sept nombres de deux mille chiffres · une expression et un triangle qui la redonne · deux expressions et leur facteur commun · un rectangle et une diagonale qui sort du cadre · un diamètre dont tout le reste découle' },
        { seance: 12, pages: '40-43', exercices: 6, vu: true,
          // COMPTAGE ET SUJET CORRIGÉS : la séance 12 ne porte AUCUNE
          // statistique, contrairement à ce que l'estimation annonçait.
          sujet: 'un QCM dont une question n\'a aucune bonne réponse · une expression et un repère qui la redonne · deux conjugués portés par un triangle · un isocèle qu\'une symétrie redresse · un équilatéral et son symétrique · une pyramide' },
        { seance: 13, pages: '44-47', exercices: 6, vu: true,
          // C'est la 13 — et elle seule — qui porte les statistiques : un seul
          // exercice, le dernier du livre.
          sujet: 'un repère et un parallélogramme · le nombre d\'or et deux cercles · un équilatéral, un losange et un cercle · une pyramide · un repère et un rectangle · LE SEUL EXERCICE DE STATISTIQUES DU LIVRE' }
      ],
      contenu: [
        { n: '1.1', questions: 3,
          notions: ['divisibilité par 12', 'mise en facteur d\'une puissance', 'arbre de choix'],
          sort: 'bibliothèque', ou: 'brevet ex11 — trois volets',
          pourquoi: '27^40 + 7×3^121 = 22 × 3^120, vérifié en BigInt ; et l\'arbre du '
                  + 'restaurant donne 2 × 4 × 3 = 24, pas 2 + 4 + 3' },
        { n: '1.2', questions: 3,
          notions: ['dénombrement sous critère de divisibilité', 'chiffres distincts',
                    'deux relations entre chiffres simultanées'],
          sort: 'bibliothèque', ou: 'brevet ex12 — trois volets',
          pourquoi: 'la troisième question n\'a qu\'UNE solution, 671 — le genre de '
                  + 'réponse qu\'on ne croit qu\'après avoir parcouru les mille nombres' },
        { n: '1.3', questions: 4, notions: ['arbre de choix', 'PGCD des chiffres', 'divisibilité par 15', 'puissances'], sort: 'à faire',
          pourquoi: 'portable désormais (denombrer.js + entiers.js) — pas encore écrit' },
        { n: '1.4', questions: 3, notions: ['code secret', 'divisibilité par 15 et 12', 'puissances'], sort: 'à faire',
          pourquoi: 'portable désormais — pas encore écrit' },
        { n: '1.5', questions: 2,
          notions: ['restes de la division euclidienne par 4', 'arbre de choix', 'chiffres premiers'],
          sort: 'bibliothèque', ou: 'brevet ex15 — deux volets',
          pourquoi: 'card A = 4 et non 5 : le reste ne peut pas atteindre le diviseur' },
        { n: '1.6', questions: 3,
          notions: ['trois familles de chiffres', 'arbre de choix', 'chiffres distincts',
                    'divisibilité par 6'],
          sort: 'bibliothèque', ou: 'brevet ex16 — trois volets',
          pourquoi: 'le produit brut donne 48, mais 2 et 3 appartiennent à DEUX familles '
                  + 'à la fois : six branches meurent, et il reste 42. C\'est là que '
                  + 'l\'arbre cesse d\'être un simple produit' },
        { n: '1.7', questions: 3,
          notions: ['chiffres consécutifs', 'arbre de choix', 'divisibilité par 6',
                    'mise en facteur d\'une puissance'],
          sort: 'bibliothèque', ou: 'brevet ex17 — trois volets' },
        { n: '1.8', questions: 16, notions: ['QCM (7 items)', 'divisibilité', 'puissances', 'arrondis', 'arbre de choix'], sort: 'à faire',
          pourquoi: 'le plus gros exercice du livre : un QCM de 7 items puis 9 questions' },
        { n: '1.9', questions: 4,
          notions: ['parité', 'multiples', 'identité en k', 'diviseurs de 15',
                    'arbre de choix'],
          sort: 'bibliothèque', ou: 'brevet ex19 — quatre volets',
          pourquoi: 'n pair donne a = 6k+1, donc a+5 = 6(k+1) sans qu\'aucune valeur '
                  + 'ne soit choisie — et les deux premières questions sont des '
                  + 'IDENTITÉS en k et m, donc testées sur trente tirages. La '
                  + 'question 2 revient à la liste des DIVISEURS de 15 : c\'est pour '
                  + 'elle que `diviseurs` a été ajouté à entiers.js, sans quoi le '
                  + '« et il n\'y en a pas d\'autres » ne serait vérifié par rien' },
        { n: '1.10', questions: 8,
          notions: ['restes', 'divisibilité', 'puissances', 'chiffres littéraux'],
          sort: 'bibliothèque', ou: 'brevet ex1010 — cinq volets sur huit',
          pourquoi: 'ses deux premières questions imprimées REPRENNENT mot pour mot '
                  + 'l\'exercice 5 de la même séance (ex15 les porte déjà). Des six '
                  + 'suivantes, CINQ sont portées — 9876543210, le quotient '
                  + '27 × 5⁴¹, 2022²−9, 8⁴³+2¹³⁰ et le 1aa7a4. '
                  + 'LA SEPTIÈME EST FAUSSE : « x2x5x4 est divisible par 6 quel que '
                  + 'soit x » — la somme de ses chiffres vaut 3x+11, congrue à 2 '
                  + 'modulo 3 POUR TOUT x, donc le nombre n\'est JAMAIS divisible '
                  + 'par 3 (121514, 222524, 323534 ne le sont pas). Vingtième '
                  + 'coquille, et elle n\'est pas rattrapable par un choix de x : il '
                  + 'faut changer un chiffre fixe — x2x5x2, x2x6x4 et x3x5x4 '
                  + 'marcheraient. Une falsification rejoue la question telle '
                  + 'qu\'imprimée. Remarque : le livre compose « 2022² 2022 − 9 », le '
                  + '2022 y est dupliqué — les DEUX lectures sont vraies, et le '
                  + 'validateur les vérifie toutes les deux, la seconde en BigInt '
                  + 'sur 6 685 chiffres' },
        { n: '1.11', questions: 8,
          notions: ['repère', 'symétrique', 'rectangle', 'parallélogramme', 'Pythagore', 'aire'],
          sort: 'bibliothèque', ou: 'brevet ex110 — huit volets',
          pourquoi: 'c\'est EXACTEMENT l\'exercice 5 de la séance 13 — mais ici il porte '
                  + 'SA FIGURE, que la séance 13 avait perdue. C\'est lui qui lève '
                  + 'l\'exclusion notée là-bas' },
        { n: '1.12', questions: 17,
          notions: ['radicaux', 'valeur absolue', 'signe', 'somme et différence',
                    'nombre d\'or caché', 'Pythagore', 'réciproque', 'cercle de diamètre'],
          sort: 'bibliothèque', ou: 'brevet ex1012 — dix-sept volets',
          pourquoi: 'x et y ne sont donnés QUE par leurs carrés et leur produit, et '
                  + 'les cinq premières questions ne les connaissent pas. '
                  + 'x²+y² = 42−18√5 = 3xy donne x/y + y/x = 3, donc z² = 3−2 = 1 et '
                  + 'z = −1 : LE NOMBRE D\'OR est là, caché — √(x/y) = (√5−1)/2 et '
                  + '√(y/x) = (√5+1)/2, de différence −1 et de produit 1, et l\'énoncé '
                  + 'ne le nomme jamais. Puis (a−b)² = ab = (3−√5)², (a+b)² = 5ab, et '
                  + 'le système somme/différence rend a = 2√5−4 et b = √5−1. '
                  + 'LA FIN CONSTRUIT b−a À LA RÈGLE : (CA) ⊥ (CD), donc le pied de '
                  + 'la perpendiculaire menée du centre du cercle de diamètre [MN] '
                  + 'est C lui-même, la corde est centrée en C et sa demi-longueur '
                  + 'vaut √(ab) = 3−√5. Tout tient au « لا تنتمي إلى [MC] » : avec N '
                  + 'du bon côté de C le cercle ne toucherait même pas (AC). '
                  + 'DEUX COQUILLES — la 21ᵉ, « a+b = 3√5+5 » au lieu de 3√5−5 (le '
                  + 'carré de 3√5−5 vaut bien 70−30√5, et a+b ≈ 1,7 quand 3√5+5 ≈ '
                  + '11,7) ; la 22ᵉ, « a−b = t\' » suivi de a = (t−t\')/2, formule '
                  + 'qui rend b et non a — elle n\'est juste qu\'avec t\' = b−a, '
                  + 'précisément ce que la question 4)ج vient de calculer. Les deux '
                  + 'sont rejouées telles qu\'imprimées par une falsification' },

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
          notions: ['tétraèdre régulier', 'droite ⊥ plan', 'plans parallèles',
                    'Thalès dans l\'espace', 'centre de gravité'],
          sort: 'bibliothèque', ou: 'brevet ex25 — huit volets',
          pourquoi: 'toutes les arêtes valent 4√3 : OA = 4, SO = 4√2. E est à la '
                  + 'MÊME hauteur que S, donc AOSE est un parallélogramme et '
                  + '(ES)//(ABC). Et M, au tiers de [IE], est aux DEUX TIERS de la '
                  + 'médiane [EI] du triangle EBC : c\'est son centre de gravité, '
                  + '(MC) est la troisième médiane, et BF = EB/2 = 2√5' },

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
          notions: ['prisme droit', 'trapèze', 'droite ⊥ plan', 'centre de gravité'],
          sort: 'à arbitrer',
          pourquoi: 'DEUX QUESTIONS NE SE REFERMENT PAS, et le recalcul le montre. '
                  + 'Les données EF=4, HG=2 et IE=3 forcent EG=9/2 ; avec EH=3√5/2 '
                  + 'le trapèze est ENTIÈREMENT déterminé (non isocèle, hauteur '
                  + '√155/4) — et alors (1) la question 3 est vide : J, projeté de I '
                  + 'sur la base, est l\'intersection des diagonales de ABCD, donc '
                  + 'J ∈ (BD), donc (DJ) = (DB) rencontre (BC) en B lui-même et '
                  + 'BL = 0 ; (2) la question 5أ est FAUSSE : « AIH rectangle en I » '
                  + 'équivaut exactement à (EG) ⊥ (HF), et le produit scalaire des '
                  + 'deux diagonales vaut −3/4, pas 0. Il manque de peu — avec '
                  + 'EH = √43/2 au lieu de 3√5/2 les diagonales seraient bien '
                  + 'perpendiculaires. Le reste tient : AG = √481/2, AJ = 3, M tel '
                  + 'que H et G sont les milieux de [ME] et [MF], I centre de gravité '
                  + 'de MEF donc N milieu de [EF], AI = √109. À faire arbitrer par le '
                  + 'maître : c\'est la donnée EH qui est en cause' },

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
        { n: '4.6', questions: 7,
          notions: ['pyramide sur un coin', 'droite ⊥ plan', 'triangle équilatéral',
                    'relation métrique', 'volume'],
          sort: 'bibliothèque', ou: 'brevet ex46 — sept volets',
          pourquoi: 'le mot « منتظم » de l\'énoncé est un lapsus : (AS) ⊥ (ABC) met le '
                  + 'sommet à l\'aplomb de A. AS = AB = 4 donne SB = SD = BD = 4√2, '
                  + 'donc SBD ÉQUILATÉRAL sans un calcul de plus. Et la dernière '
                  + 'question fabrique la vraie pyramide régulière : M, milieu de '
                  + '[SC], est à l\'aplomb du centre du carré, et son volume vaut 32/3' },

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
          notions: ['prisme droit', 'trapèze', 'droite ⊥ plan', 'Thalès',
                    'médiane et demi-hypoténuse'],
          sort: 'bibliothèque', ou: 'brevet ex56 — sept volets',
          pourquoi: 'l\'énoncé ne donne AUCUNE longueur — que des relations. Les '
                  + 'chaînes le restent : elles n\'écrivent que des égalités entre '
                  + 'longueurs (CM = CD, MD = 2×CD, NB = MH/2) et pas un seul nombre. '
                  + 'Thalès donne C milieu de [MD], BC = CD fait voir [MD] sous un '
                  + 'angle droit depuis B, et les DEUX triangles rectangles MBH et '
                  + 'MDH partagent l\'hypoténuse [MH] : leurs médianes sont égales, '
                  + 'NB = ND' },
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

        // ── SÉANCE 6 — quatre exercices portés ; un en-tête VIDE, un espace ─
        { n: '6.1', questions: 8,
          notions: ['aire d\'un rectangle', 'trois écritures d\'un même trinôme',
                    'produit nul', 'valeur absolue et intervalle', 'Pythagore',
                    'forme canonique', 'ensemble de points'],
          sort: 'bibliothèque', ou: 'brevet ex61 — huit volets',
          pourquoi: 'MK² + 2S = 100 : la diagonale et l\'aire se compensent exactement, '
                  + 'parce que x² + (10−x)² + 2x(10−x) = (x + 10 − x)²' },
        { n: '6.2', questions: 8,
          notions: ['rationaliser', 'nombres inverses', 'carré d\'un entier',
                    'quatre expressions qui se réduisent', 'valeur absolue'],
          sort: 'bibliothèque', ou: 'brevet ex62 — huit volets',
          pourquoi: 'ab = 25 − 24 = 1 : F vaut √(a²+b²−2ab) = |b−a| = 4√6, sans '
                  + 'aucune racine à extraire' },
        { n: '6.3', questions: 8,
          notions: ['repère', 'Pythagore', 'Thalès', 'relation métrique', 'rectangle',
                    'cercle de diamètre', 'symétrique', 'aire'],
          sort: 'bibliothèque', ou: 'brevet ex63 — huit volets',
          pourquoi: 'BM = 6,4 n\'est pas choisi : c\'est OB²/AB = 64/10, la valeur qui '
                  + 'fait de M le pied de la hauteur issue de O' },
        { n: '6.4', questions: 0, notions: [],
          sort: 'hors machinerie',
          pourquoi: 'L\'EN-TÊTE « التمرين رقم 4 » NE PORTE AUCUN ÉNONCÉ dans le livre : '
                  + 'il est suivi immédiatement du suivant. Rien à porter' },
        { n: '6.5', questions: 7,
          notions: ['nombre d\'or', 'nombres inverses', 'nombre rationnel',
                    'ranger des carrés', 'cercle de diamètre', 'relation métrique'],
          sort: 'bibliothèque', ou: 'brevet ex65 — sept volets « منزه »',
          pourquoi: 'la figure est la construction classique du nombre d\'or : dans le '
                  + 'carré de côté 1, CE = a et CF = b, et BC² = CF × CE dit que ab = 1' },
        { n: '6.6', questions: 7,
          notions: ['parallélépipède', 'droite ⊥ plan', 'médiane et demi-hypoténuse',
                    'droite des milieux'],
          sort: 'bibliothèque', ou: 'brevet ex66 — sept volets',
          pourquoi: 'le livre le numérote « 5 » lui aussi. La condition « ENH isocèle » '
                  + 'donne FN = NG, donc N est le MILIEU de [FG] — et alors '
                  + 'EN = NH = 4 = EH : le triangle est ÉQUILATÉRAL. Le pivot est la '
                  + 'question 4 : dans EMN la médiane [EH] vaut 4 et MN vaut 8, donc '
                  + 'l\'angle en E est droit. Et KN = 4 se lit en redescendant dans '
                  + 'la face carrée, où L milieu de [EH] donne LK = 2' },

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

        // ── SÉANCE 8 — trois exercices portés ; un doublon, un espace ──────
        { n: '8.1', questions: 8,
          notions: ['valeur numérique', 'forme canonique', 'différence de deux carrés',
                    'moyennes arithmétique, géométrique et harmonique', 'proportion'],
          sort: 'bibliothèque', ou: 'brevet ex81 — huit volets',
          pourquoi: 'le 5/4 est exactement ce qu\'il faut pour qu\'un 1 de plus ferme le '
                  + 'carré ; puis deux carrés positifs démontrent m ≥ n ≥ h et n² = mh' },
        { n: '8.2', questions: 8,
          notions: ['intervalles', 'encadrement d\'un carré', 'valeur absolue'],
          sort: 'bibliothèque',
          ou: 'brevet ex54 et ex55 — c\'est le MÊME exercice que la séance 5, '
            + 'exercices 4 et 5, fusionnés',
          pourquoi: 'mêmes intervalles, mêmes expressions, jusqu\'à la numérotation '
                  + 'cassée (4, 5, 6 puis 4, 3, 4). On ne double pas les pages' },
        { n: '8.3', questions: 9,
          notions: ['triangle équilatéral', 'symétrique', 'Pythagore réciproque',
                    'centre de gravité', 'cercle de diamètre', 'droite des milieux',
                    'orthocentre', 'points concycliques'],
          sort: 'bibliothèque', ou: 'brevet ex83 — neuf volets',
          pourquoi: 'C est le milieu de [OA], donc [BC] est une MÉDIANE de OAB — et '
                  + 'BI = 2BC/3 fait de I son centre de gravité. Tout s\'enchaîne de là' },
        { n: '8.4', questions: 8,
          notions: ['pyramide penchée', 'droite ⊥ plan', 'intersection de plans',
                    'Thalès', 'pyramide régulière', 'volume'],
          sort: 'bibliothèque', ou: 'brevet ex84 — huit volets',
          pourquoi: 'la hauteur est l\'ARÊTE [SA] elle-même : AI = 3, SA = 4, SI = 5 — '
                  + 'le triangle 3-4-5 dressé dans l\'espace. La verticale de G est '
                  + 'dans (SAI) et rencontre (SBC) sur leur droite d\'intersection, '
                  + 'qui est (SI) ; Thalès donne JG = 4/3. Et JABC, lui, EST régulier : '
                  + 'JB = 2√13/3 et son volume vaut 4√3/3' },
        { n: '8.5', questions: 6,
          notions: ['valeur absolue', 'factorisation cachée d\'un numérateur',
                    'signe', 'comparer', 'somme de trois inégalités'],
          sort: 'bibliothèque', ou: 'brevet ex85 — six volets',
          pourquoi: 'le numérateur de b ne se réduit pas, il se FACTORISE : '
                  + '3(1−√3) + √6 − 3√2 = (1−√3)(3+√6), et le dénominateur s\'en va' },

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
                  + 'les deux longueurs sont égales. Le « = 4 » ne fixe que AN = 4√2' },

        // ── SÉANCE 10 — quatre exercices neufs, et deux reprises ─────────────
        { n: '10.1', questions: 8,
          notions: ['sortir un carré d\'un radical', 'rationaliser par le conjugué',
                    'comparer par les carrés', 'signe d\'un produit',
                    'multiplier une inégalité par un positif', 'ordonner des racines',
                    'côté d\'un carré d\'aire donnée', 'inverser deux fractions'],
          sort: 'bibliothèque', ou: 'brevet ex101 — huit volets',
          pourquoi: 'a = 7−4√3 ≈ 0,072 et b = 2√3−3 ≈ 0,464 : la calculette ne les '
                  + 'sépare pas de 0. Tout se fait par les carrés — 48 < 49 donne a > 0, '
                  + '100 < 108 donne a < b. Et a+b = 4−2√3 = (√3−1)² ferme le carré' },
        { n: '10.2', questions: 6, notions: ['Thalès quatre fois sur une figure'],
          sort: 'bibliothèque', ou: 'brevet ex31 — c\'est EXACTEMENT l\'exercice 1 de la séance 3',
          pourquoi: 'mêmes données (AB = 3, AC = 5, BC = 6, BM = 1), mêmes questions, '
                  + 'et jusqu\'à la même numérotation cassée 2, 3, 4, 5. On ne double pas la page' },
        { n: '10.3', questions: 8,
          notions: ['forme canonique', 'différence de deux carrés', 'équation produit nul',
                    'relation métrique AH×BC = AB×AC', 'encadrement d\'un point mobile',
                    'Thalès entre deux hauteurs', 'Pythagore deux fois',
                    'une longueur qui redonne l\'équation'],
          sort: 'bibliothèque', ou: 'brevet ex103 — huit volets',
          pourquoi: 'E = x²+√6x−3 et le triangle le refabriquent : BK = √3 équivaut à '
                  + 'E = 0. Curiosité vérifiée par la machine : à la racine, MK = AM = x' },
        { n: '10.4', questions: 6,
          notions: ['valeur numérique en −√3', 'forme canonique', 'factorisation',
                    'hauteur d\'un équilatéral', 'symétrique et cercle de diamètre',
                    'Pythagore qui redonne l\'équation'],
          sort: 'bibliothèque', ou: 'brevet ex104 — six volets',
          pourquoi: 'C symétrique de B par rapport à D fait de D le centre du cercle '
                  + 'circonscrit à ABD : A voit [BC] sous un angle droit sans qu\'on le '
                  + 'demande. Puis Pythagore avec AC = √3(x+1) donne 9A = 0' },
        { n: '10.5', questions: 9,
          notions: ['identité remarquable sous un radical', 'rationaliser',
                    'deux nombres inverses', 'comparer à 1', 'somme et produit',
                    'nombres opposés', 'Thalès qui refabrique une équation'],
          sort: 'bibliothèque', ou: 'brevet ex105 — neuf volets',
          pourquoi: 'tout tient dans (√5−1)² = 6−2√5 ; a et b sont les racines de '
                  + 'x²−√5x+1, et Thalès donne à p la MÊME équation. C\'est la condition '
                  + 'p > 1 qui choisit b' },
        { n: '10.6', questions: 8,
          notions: ['trapèze rectangle', 'segment des milieux', 'centre de gravité',
                    'orthocentre', 'cercle de diamètre'],
          sort: 'bibliothèque', ou: 'brevet ex94 — c\'est EXACTEMENT l\'exercice 4 de la séance 9',
          pourquoi: 'mêmes données (MN = 6√2, AB = 2√2, BI = BJ = 4), mêmes six questions. '
                  + 'L\'énoncé renvoie lui-même « الشكل المرافق (الصفحة 3) »' },

        // ── SÉANCE 11 — LA PREMIÈRE ENTIÈRE : six exercices, six portés ──────
        { n: '11.1', questions: 3,
          notions: ['critère de divisibilité par 3', 'par 5', 'par 4', 'par 2',
                    'décomposer un diviseur en facteurs premiers entre eux',
                    'énumérer des couples de chiffres'],
          sort: 'bibliothèque', ou: 'brevet ex111 — trois volets',
          pourquoi: 'sept couples, puis dix, puis seize — et les trente-trois divisions '
                  + 'sont posées. Annoncer « a ∈ {2;5;8} » sans les poser, ce serait '
                  + 'demander à l\'élève de croire' },
        { n: '11.2', questions: 7,
          notions: ['unifier la base de deux puissances', 'facteur commun',
                    'divisibilité par 3, 21, 42, 15, 11'],
          sort: 'bibliothèque', ou: 'brevet ex112 — sept volets',
          pourquoi: 'un seul geste sept fois : ramener au même base, sortir la plus '
                  + 'petite puissance. Ces nombres ne tiennent PAS dans un flottant '
                  + '(243^1001 déborde) : il a fallu écrire entiers.js, en BigInt exact' },
        { n: '11.3', questions: 11,
          notions: ['valeur numérique en 4−√5', 'comparer deux expressions',
                    'forme canonique et différence de deux carrés', 'équation produit nul',
                    'Pythagore réciproque', 'Thalès', 'aire d\'un triangle rectangle',
                    'encadrement d\'une aire', 'une aire qui redonne l\'équation'],
          sort: 'bibliothèque', ou: 'brevet ex113 — onze volets',
          pourquoi: 'demander l\'aire égale à 5√5/4 redonne EXACTEMENT x²−8x+11 = 0, '
                  + 'dont la seule racine de [0;4] est 4−√5 — celle de la question I.5' },
        { n: '11.4', questions: 6,
          notions: ['développer deux carrés', 'différence de deux carrés',
                    'facteur commun', 'factoriser une différence sans développer',
                    'équation produit nul'],
          sort: 'bibliothèque', ou: 'brevet ex114 — six volets',
          pourquoi: 'le facteur (x+3) est dans A et dans B : leur différence se '
                  + 'factorise sans rien développer, et A = B se résout à vue' },
        { n: '11.5', questions: 5,
          notions: ['forme canonique', 'différence de deux carrés', 'rectangle',
                    'Thalès', 'aire d\'un triangle rectangle',
                    'une aire qui redonne l\'équation'],
          sort: 'bibliothèque', ou: 'brevet ex115 — cinq volets',
          pourquoi: 'la hauteur du rectangle n\'est pas une donnée : elle vaut '
                  + 'AE = AB − EB = x+2, et c\'est BC = AE qui la fixe. L\'aire de DCG '
                  + 'vaut (2x+3)²/2, et l\'exiger égale à 8 donne A = 0' },
        { n: '11.6', questions: 10,
          notions: ['triangle équilatéral inscrit', 'hauteur d\'un équilatéral',
                    'cercle de diamètre ⇒ angle droit', 'Pythagore', 'Thalès',
                    'symétrique', 'droite des milieux', 'centre de gravité',
                    'médiane et hauteur dans un équilatéral'],
          sort: 'bibliothèque', ou: 'brevet ex116 — dix volets',
          pourquoi: 'BC = 4 sur un cercle de rayon 4 fait de OBC un ÉQUILATÉRAL, et '
                  + 'tout en découle : H est le milieu de [OB] donc AH = 6, CH = 2√3 '
                  + 'est la hauteur, et ABE finit équilatéral de côté 8' },

        // ── SÉANCE 12 — SIX exercices portés, la pyramide comprise ──────────
        { n: '12.1', questions: 3,
          notions: ['comparer des radicaux par les carrés', 'mode d\'une série discrète',
                    'diagonale de face d\'un cube'],
          sort: 'bibliothèque', ou: 'brevet ex121 — trois volets',
          pourquoi: 'la question 2 est un QCM SANS BONNE RÉPONSE : l\'ordre vrai est '
                  + 'b < c < a, qui n\'est proposé nulle part. On pose la question '
                  + 'sans choix multiple' },
        { n: '12.2', questions: 11,
          notions: ['valeur numérique', 'forme canonique', 'différence de deux carrés',
                    'équation produit nul', 'repère', 'milieu', 'coordonnées',
                    'distance entre deux points', 'Pythagore réciproque', 'alignement'],
          sort: 'bibliothèque', ou: 'brevet ex122 — onze volets',
          pourquoi: 'BED rectangle en E donne BE² + DE² = 64, c\'est-à-dire '
                  + '8a² + 16a - 16 = 0 — exactement M = 0 de la partie I' },
        { n: '12.3', questions: 7,
          notions: ['rationaliser par le conjugué', 'valeur absolue', 'nombres inverses',
                    'Pythagore', 'relation métrique', 'triangles semblables',
                    'triangle isocèle'],
          sort: 'bibliothèque', ou: 'brevet ex123 — sept volets',
          pourquoi: 'a = √7+1 et b = √7−1 sont EXACTEMENT les deux côtés du triangle : '
                  + 'AB² + AC² = 16 sans un radical, et AH = 6/4 = 3/2' },
        { n: '12.4', questions: 7,
          notions: ['symétrique et cercle de diamètre', 'Pythagore', 'droite des milieux',
                    'relation métrique', 'centre de gravité', 'losange', 'aire'],
          sort: 'bibliothèque', ou: 'brevet ex124 — sept volets',
          pourquoi: 'C symétrique de A par rapport à O fait de O le centre du cercle '
                  + 'circonscrit : ABC devient le triangle 6-8-10, et (CI) et (BO) '
                  + 'sont deux médianes' },
        { n: '12.5', questions: 9,
          notions: ['hauteur d\'un équilatéral', 'symétrique', 'cercle de diamètre',
                    'Pythagore', 'centre de gravité', 'droite des milieux',
                    'rectangle', 'losange'],
          sort: 'bibliothèque', ou: 'brevet ex125 — neuf volets',
          pourquoi: 'A milieu de [OB] et AC = 6 = OB/2 : OBC est rectangle en C sans '
                  + 'autre calcul, et [CA] en devient une médiane' },
        { n: '12.6', questions: 7,
          notions: ['pyramide régulière', 'droite ⊥ plan', 'relation métrique',
                    'projeté orthogonal', 'Pythagore dans l\'espace'],
          sort: 'bibliothèque', ou: 'brevet ex126 — sept volets',
          pourquoi: 'LE PREMIER SOLIDE de la bibliothèque, entré le jour où espace.js '
                  + 'a donné au vérificateur des coordonnées en trois dimensions. '
                  + 'COQUILLE : l\'énoncé donne AB = 3√2 et rien ne se referme — on '
                  + 'trouverait SA = 3√2 là où le د\\ demande 6. Avec AB = 6 tout tombe '
                  + 'juste et rien d\'autre ne change : OA = 3√2, SO = OA, SA = 6, '
                  + 'OK = 3, CK = 3√3. Le 3√2 du brouillon est celui de OA, il a glissé '
                  + 'd\'une ligne' },

        // ── SÉANCE 13 — quatre exercices portés sur six ──────────────────────
        { n: '13.1', questions: 8,
          notions: ['repère', 'parallèle à un axe', 'équation de (IJ)',
                    'distance entre deux points', 'parallélogramme',
                    'projection selon une direction', 'aires comparées'],
          sort: 'bibliothèque', ou: 'brevet ex131 — huit volets',
          pourquoi: 'le xA < 0 de l\'énoncé n\'est pas décoratif : J lui-même est à '
                  + 'la distance 4 de E, et c\'est lui que la condition écarte' },
        { n: '13.2', questions: 6,
          notions: ['rationaliser', 'sortir un carré d\'un radical', 'encadrement',
                    'valeur absolue levée par l\'encadrement', 'nombres inverses',
                    'nombre rationnel'],
          sort: 'bibliothèque', ou: 'brevet ex132 — six volets, PARTIE I seulement',
          pourquoi: 'la partie II ne se referme pas : avec AB = 1, AC = 1/2, l\'angle '
                  + 'droit en C et BD = 3/2, on obtient BC = √3/2 puis DC = (3−√3)/2, '
                  + 'et non a = (3−√5)/2. Il faudrait BC = √5/2, ce qui rendrait '
                  + 'AC² = 1 − 5/4 négatif. À arbitrer par le maître' },
        { n: '13.3', questions: 7,
          notions: ['triangle équilatéral', 'médiane de l\'hypoténuse', 'alignement',
                    'losange', 'symétrique', 'orthocentre', 'cercle de diamètre',
                    'angle de 30° dans un triangle rectangle'],
          sort: 'bibliothèque', ou: 'brevet ex133 — sept volets',
          pourquoi: 'CDH est équilatéral de côté 6√3 : B en est donc à la fois le '
                  + 'centre de gravité, l\'orthocentre ET le centre du cercle circonscrit' },
        { n: '13.4', questions: 7,
          notions: ['pyramide régulière', 'relation métrique', 'droite ⊥ plan',
                    'centre de gravité', 'droite des milieux'],
          sort: 'bibliothèque', ou: 'brevet ex134 — sept volets',
          pourquoi: 'OB = 2, SB = 2√5, puis les deux relations métriques donnent '
                  + 'OH = 4√5/5 et BH = 2√5/5. Tout le reste tient sur (AC) ⊥ (SBD). '
                  + 'Et la dernière question est un CENTRE DE GRAVITÉ déguisé : [SO] '
                  + 'est une médiane de SBD, G est à ses deux tiers, donc (BG) est une '
                  + 'autre médiane et J est le milieu de [SD] — (OJ) joint alors les '
                  + 'milieux de [DB] et [DS], il est parallèle à (BH)' },
        { n: '13.5', questions: 8,
          notions: ['repère', 'rectangle', 'parallélogramme', 'Pythagore', 'aire'],
          sort: 'bibliothèque', ou: 'brevet ex110 — c\'est EXACTEMENT l\'exercice 11 de la séance 1',
          pourquoi: 'EXCLUSION LEVÉE. Le dessin manquait ici, mais la séance 1 porte le '
                  + 'MÊME exercice — mot pour mot — AVEC sa figure : C(0 ; 3√2), M(3 ; 0), '
                  + 'B(6 ; 3√2). C\'est ex110 qui le porte' },
        { n: '13.6', questions: 6,
          notions: ['série continue', 'effectifs inconnus', 'fréquence cumulée croissante',
                    'cumuls', 'étendue', 'classe modale', 'moyenne par les centres',
                    'MÉDIANE lue sur le polygone', 'probabilité'],
          sort: 'bibliothèque', ou: 'brevet ex136 — six volets',
          pourquoi: 'le « 30 % » du tableau porte sur la PREMIÈRE classe — c\'est la '
                  + 'seule lecture qui donne b = 15 puis a = 20, les deux valeurs que '
                  + 'l\'énoncé annonce. Et la médiane tombe juste : cumuls 15, 23, 43, '
                  + '50, moitié 25, lecture exacte Me = 62 sans rien interpoler' }
      ],
      machine: ['l\'arbre de choix (dénombrement) n\'existe dans aucun chapitre',
                'les restes de puissances — arith9 sait le faire, à relier',
                'LE REPÈRE EST FAIT — chaines/brevet/repere.js : points construits, '
                + 'jamais recopiés, et chaque affirmation de l\'énoncé recalculée '
                + 'dessus. Le livre pose un exercice de repère par séance : il resservira',
                'LE CHAPITRE DU REPÈRE EST FAIT — chaines/repere9 : huit familles '
                + 'engendrées (milieu, symétrique, distance, nature d\'un quadrilatère, '
                + 'alignement, directions, quatrième sommet, cercle circonscrit)',
                'LES GRANDS ENTIERS SONT FAITS — chaines/brevet/entiers.js : un '
                + 'évaluateur BigInt exact (+, −, ×, ^) pour les puissances que le '
                + 'flottant ne peut pas porter. La séance 1 est pleine d\'arithmétique '
                + 'de ce genre : il resservira',
                'la géométrie de l\'espace — une pyramide par séance, semble-t-il',
                'LES STATISTIQUES SONT FAITES — chaines/stat9 : huit familles '
                + 'engendrées (lecture de tableau, moyenne, cumuls, fréquences et '
                + 'angles, médiane discrète, centre de classe, MÉDIANE CONTINUE par '
                + 'le polygone, probabilité). Les séances 12 et 13 ont désormais un '
                + 'chapitre d\'accueil',
                'restent les séances 12 et 13'],
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
        + 'quatre premières le sont.',
        '6.2 q6)ت : « √((1−d²)/d) + m ». Sous le radical, (1−d²)/d vaut 3√5/2 − 5, '
        + 'un nombre NÉGATIF — la racine n\'existe pas. Avec c à la place de d, '
        + 'la même expression vaut exactement 4, et la racine vaut 2. C\'est un c.',
        '6.5 q1 : b = 1/5 − (6 − (1+√5)²)/4 donne 1/5 + √5/2, et non (√5+1)/2 '
        + 'comme l\'énoncé le demande. Avec 1/2 à la place de 1/5 on tombe juste. '
        + 'Le 5 est un 2.',
        '6.4 : l\'en-tête « التمرين رقم 4 » ne porte AUCUN énoncé — il est suivi '
        + 'immédiatement du suivant. Et deux exercices de la séance portent le '
        + 'numéro 5.',
        '10.1 : b = 1/(2−√3) − 3/(2+√3) + 1 vaut 4√3−3 ≈ 3,93 — et la question 3 '
        + 'du MÊME énoncé demande de montrer que b < 1. L\'énoncé se contredit '
        + 'lui-même. Avec 1/(2+√3) on retrouve exactement le 2√3−3 annoncé par la '
        + 'question 1, et les huit questions s\'enchaînent. Le − est un +.',
        '10.3 q2)ب : « CM/CA = MK/MH ». MH n\'existe pas dans la figure — c\'est '
        + 'AH. Le rapport de Thalès compare les deux hauteurs, celle du petit '
        + 'triangle CMK et celle du grand CAH.',
        '11.2 q6 : « 9^100 + 3^204 يقبل القسمة على 42 ». Ce nombre vaut '
        + '82 × 3^200, et 82 = 2 × 41 ne contient pas de 7 : 42 ne divise pas. '
        + 'Avec 3^203 on obtient 28 × 3^200 = 4 × 7 × 3^200, et 42 divise. '
        + 'Le 4 est un 3. Vérifié en BigInt exact, pas en flottant.',
        '11.3 II : « AC = 25 » avec AB = 4 et BC = 6 — ces trois longueurs ne '
        + 'font même pas un triangle. C\'est 2√5 dont le radical n\'a pas '
        + 'survécu à la mise en page : 4² + (2√5)² = 16 + 20 = 36 = 6², et le '
        + 'triangle est rectangle en A, ce que la question suivante demande.',
        '12.1 q2 : « a − 2√2 = b + 2√3 = c + 3 donc… » suivi de trois ordres — '
        + 'c<b<a, b<a<c, a<b<c. AUCUN n\'est correct : a = b + 2√3 + 2√2 et '
        + 'c = b + 2√3 − 3, et comme 2√3 > 3 on a c > b, et comme 2√2 + 3 > 0 '
        + 'on a a > c. L\'ordre vrai est b < c < a. La question est posée sans '
        + 'choix multiple.',
        '12.2 q2)أ : « استنتج أن CE = 2a+4 ». Avec C(0;3) et E(2a+2;3) on a '
        + 'CE = 2a+2. Les deux questions suivantes le confirment sans appel : '
        + 'BE² = 4a²+8a+40 et DE² = 4a²+8a+8 ne sortent que d\'une abscisse '
        + 'égale à 2a+2. Le 4 est un 2.',
        '12.3 I q1 : « بيّن أن a = √7−1 و a = √7+1 » — le même nom deux fois. '
        + 'Le premier est b : a = √7+1 et b = √7−1, et c\'est ce que la '
        + 'question 2 (a inverse de b/6) exige.',
        '11.3 II q4)أ : « S_AMN = 5√5 ». La question 2)ت vient de faire montrer '
        + 'que S ne dépasse pas 4√5 ≈ 8,94 ; or 5√5 ≈ 11,18. Avec 5√5/4 la '
        + 'condition donne exactement (4−x)² = 5, c\'est-à-dire x²−8x+11 = 0, '
        + 'et x = 4−√5 puis AN = 5/2. Le /4 est tombé.'
      ]
    },

    // ═══════════════════════════════════════════════════════════════════
    // LE LIVRE 2026 — une REFONTE, pas une réédition
    // ═══════════════════════════════════════════════════════════════════
    {
      fichier: 'Revision_9eme_2026.pdf', pages: 38, texte: 'lisible',
      etat: 'en cours', exercices: 48,
      titre: 'امتحان شهادة ختم التعليم الأساسي العام — مراجعة (جوان 2026)',
      chapitres: ['brevet'],
      // CE N'EST PAS UN SUR-ENSEMBLE du livre 2025 : huit séances au lieu de
      // treize, 38 pages au lieu de 47, une quarantaine d'exercices au lieu de
      // 76 — et ses exercices sont en grande majorité NEUFS. Les deux livres
      // coexistent donc ; les clés du 2026 commencent par 26.
      structure: [
        { seance: 1, pages: '2-5', exercices: 10, vu: true,
          sujet: 'arithmétique : arbre de choix, restes, divisibilité, puissances · deux QCM' },
        { seance: 2, pages: '5-6', exercices: 6, vu: true,
          sujet: 'une chaîne d\'encadrements qui se referme · une expression et un nombre à sept chiffres · deux triangles rectangles · le nombre d\'or au carré · deux repères' },
        { seance: 3, pages: '7-9', exercices: 5, vu: true,
          // ENTIÈREMENT faite de reprises, plus une pyramide. Rien à porter.
          sujet: 'ex1 = ex21, ex3 = ex23, ex4 = ex24 (mêmes coordonnées) — TROIS DOUBLONS · ex5 est une pyramide' },
        { seance: 4, pages: '10-14', exercices: 7, vu: true,
          sujet: 'ex1 = ex31, ex3 = ex33, ex4 = ex34, ex6 = ex36 (« نموذجية مدنين ») — QUATRE DOUBLONS · ex7 est un prisme · SEUL ex2 est neuf' },
        { seance: 5, pages: '12-14', exercices: 5, vu: true,
          sujet: 'ex1 = ex41, ex4 = ex132, ex5 (منزه) = ex65 — TROIS DOUBLONS · ex3 est le nombre d\'or · SEUL ex2 est neuf' },
        { seance: 6, pages: '15-21', exercices: 8, vu: 'partiellement',
          sujet: 'ses exercices 1 et 3 sont ceux des séances 5 et 7 du 2025 — DOUBLONS' },
        { seance: 7, pages: '22-25', exercices: 3, sujet: 'à lire — géométrie' },
        { seance: 8, pages: '25-37', exercices: 6, vu: 'ouverte',
          // CE N'EST PAS UNE SÉANCE D'EXERCICES : c'est un recueil de VRAIS
          // SUJETS D'EXAMEN (امتحان شهادة ختم التعليم الأساسي العام), scannés,
          // dourat 2020 et suivantes. Une source d'un autre genre.
          sujet: 'RECUEIL DE SUJETS D\'EXAMEN OFFICIELS scannés — dourat 2020 et suivantes' }
      ],
      contenu: [
        { n: '1.1', questions: 1,
          notions: ['carré parfait', 'multiple de 4', 'diviseur commun aux deux autres chiffres'],
          sort: 'bibliothèque', ou: 'brevet ex2611',
          pourquoi: 'première contrainte qui lie les TROIS chiffres d\'un coup : '
                  + 'l\'arbre de choix n\'y suffit plus, il faut descendre branche '
                  + 'par branche. Treize solutions' },
        { n: '1.2', questions: 4,
          notions: ['reste modulo 3 par la somme des chiffres', 'divisibilité par 6',
                    'puissance d\'un multiple', 'reconnaître un cas particulier'],
          sort: 'bibliothèque', ou: 'brevet ex2612 — quatre volets',
          pourquoi: 'la question 2)ب donne les nombres : a = 5 fait x = 475552, donc '
                  + 'x−1 = 475551 et y = 951108 — exactement ceux de l\'énoncé' },
        { n: '1.3', questions: 5, notions: ['n = 6p+5', 'multiples', 'arbre de choix à 4 chiffres'], sort: 'à faire' },
        { n: '1.4', questions: 5, notions: ['arbre de choix', 'restes croisés'], sort: 'à faire' },
        { n: '1.5', questions: 2, notions: ['QCM : divisibilité par 12 et 15', 'parité de n²+n'], sort: 'à faire' },
        { n: '1.6', questions: 3,
          notions: ['reste modulo 3', 'unifier la base d\'une puissance', 'restes qui se complètent'],
          sort: 'bibliothèque', ou: 'brevet ex2616 — trois volets',
          pourquoi: 'X ≡ 2 [3] et Y ≡ 1 [3] : les deux restes se complètent, et la '
                  + 'somme tombe juste' },
        { n: '1.7', questions: 2,
          notions: ['arbre de choix', 'nombres pairs', 'reste modulo 20'],
          sort: 'bibliothèque', ou: 'brevet ex2617 — deux volets',
          pourquoi: '8^64 + 4^95 = 5 × 2^190 porte à la fois le 4 et le 5 de 20 : '
                  + 'le reste est NUL' },
        { n: '1.8', questions: 1, notions: ['dénombrement à trois contraintes croisées'], sort: 'à faire' },
        { n: '1.9', questions: 3, notions: ['fraction entière', 'triangle et périmètre'], sort: 'à faire' },
        { n: '1.10', questions: 3, notions: ['QCM : quotient d\'une puissance', 'dénombrement à 4 chiffres', 'écriture décimale périodique'], sort: 'à faire' },

        // ── SÉANCE 2 du livre 2026 ─────────────────────────────────────────
        { n: '2.1', questions: 5,
          notions: ['comparer par les carrés', 'conjugués et produit', 'multiplier une inégalité',
                    'comparer deux fractions par produit en croix', 'inverser'],
          sort: 'bibliothèque', ou: 'brevet ex2621 — cinq volets',
          pourquoi: 'ac = 61 donne 1/a = c/61, et c\'est cette égalité qui porte la '
                  + 'dernière question ; puis 72900 < 73205 ferme la chaîne' },
        { n: '2.2', questions: 6, notions: ['E = (x−2)(x+2)', 'nombre à sept chiffres', 'restes modulo 12'], sort: 'à faire' },
        { n: '2.3', questions: 4, notions: ['radicaux', 'triangle rectangle LPK', 'centre de gravité', 'projection'], sort: 'à faire' },
        { n: '2.4', questions: 5, notions: ['le nombre d\'or au carré', 'puissances conjuguées', 'figure ABC/H/E'], sort: 'à faire' },
        { n: '2.5', questions: 6, notions: ['repère', 'parallélogramme', 'centre de gravité', 'cercle'], sort: 'à faire',
          pourquoi: 'À VÉRIFIER AVEC LE MAÎTRE : la question 2 se referme (I(1;0) est bien '
                  + 'le centre de gravité de B(1;−4), C(2;0), D(0;4)), mais AUCUN ordre des '
                  + 'quatre points A(1;2), B, C, D ne donne un parallélogramme — les trois '
                  + 'couples de milieux de diagonales diffèrent. Le A imprimé ne referme pas '
                  + 'la question 1' },
        { n: '5.1', questions: 6, notions: ['M = x²+4x−32', 'trapèze', 'Thalès', 'aire'],
          sort: 'bibliothèque', ou: 'brevet ex41 — DOUBLON du 2025, séance 4 exercice 1',
          pourquoi: 'BC = 8, AJ = 4, IB = JD = x, (IJ)//(CD) — les mêmes données' },
        { n: '5.2', questions: 7,
          notions: ['repère', 'angle de 45°', 'trapèze', 'Thalès', 'centre de gravité',
                    'milieu', 'produit scalaire nul'],
          sort: 'bibliothèque', ou: 'brevet ex2652 — sept volets',
          pourquoi: 'H, intersection de (RJ) et de la verticale (SW), tombe en '
                  + '(3+√5 ; 3+√5) — ses DEUX coordonnées sont égales, et c\'est tout ce '
                  + 'qu\'il faut pour l\'angle de 45°. Le calcul passe par (1+√5)²/2 = 3+√5, '
                  + 'l\'identité du nombre d\'or. Puis A devient le centre de gravité de MNP '
                  + 'ET le milieu de [PB]' },
        { n: '5.3', questions: 4, notions: ['le nombre d\'or', 'inverses', 'a⁴+a³−a−1'], sort: 'à faire' },
        { n: '5.4', questions: 8, notions: ['a = (3−√5)/2', 'encadrement', 'valeurs absolues'],
          sort: 'bibliothèque', ou: 'brevet ex132 — DOUBLON du 2025, séance 13 exercice 2',
          pourquoi: 'a = 4 + 2/(√5−1) − (1+√5)²/2 et b = (√27+√15)/√12 — identiques. '
                  + 'ET SA PARTIE II EST REPRODUITE TELLE QUELLE, avec la même donnée qui '
                  + 'ne se referme pas : AB = 1, AC = 1/2, angle droit en C et BD = 3/2 '
                  + 'donnent DC = (3−√3)/2, et non a = (3−√5)/2' },
        { n: '5.5', questions: 3, notions: ['le nombre d\'or', 'inverses', 'nombre rationnel'],
          sort: 'bibliothèque', ou: 'brevet ex65 — DOUBLON du 2025, séance 6 exercice 5 (منزه)',
          pourquoi: 'ET LA COQUILLE N° 10 EST REPRODUITE : le livre 2026 imprime encore '
                  + 'b = 1/5 − (6−(1+√5)²)/4, qui donne 1/5 + √5/2 et non (√5+1)/2. '
                  + 'Le 5 devrait être un 2' },

        { n: '2.6', questions: 6,
          notions: ['repère', 'distances', 'alignement et rapport', 'intersection de droites',
                    'symétrique', 'losange par les diagonales', 'aire', 'projection orthogonale'],
          sort: 'bibliothèque', ou: 'brevet ex2626 — six volets',
          pourquoi: 'E, l\'intersection de (BJ) et (AC), tombe en (1 ; 3/2) — exactement '
                  + 'au-dessus de I(1 ; 0). Son symétrique par rapport à I donne alors un '
                  + 'losange dont les diagonales se coupent en leur milieu ET '
                  + 'perpendiculairement, sans mesurer un seul côté' },

        { n: '3.3', questions: 13, notions: ['rectangle', 'symétrique', 'isocèle', 'projection', 'losange', 'Thalès'],
          sort: 'bibliothèque', ou: 'brevet ex23 — DOUBLON du 2025, séance 2 exercice 3',
          pourquoi: 'A(2 ; 0) et B(2 ; 1) — les mêmes coordonnées, relues dans le code' },
        { n: '3.4', questions: 12, notions: ['cercle de diamètre', 'triangle rectangle', 'Thalès', 'aire', 'trapèze isocèle'],
          sort: 'bibliothèque', ou: 'brevet ex24 — DOUBLON du 2025, séance 2 exercice 4',
          pourquoi: 'A(2 ; 0) et B(6 ; 6) — les mêmes coordonnées' },
        { n: '3.5', questions: 8,
          notions: ['tétraèdre régulier', 'droite ⊥ plan', 'centre de gravité'],
          sort: 'bibliothèque', ou: 'brevet ex25 — DOUBLON du 2025, séance 2 exercice 5',
          pourquoi: 'AB = 4√3, EA = 4√2, OM/AE = IM/IE = 1/3 — mot pour mot le même' },
        { n: '4.1', questions: 4, notions: ['Thalès quatre fois'],
          sort: 'bibliothèque', ou: 'brevet ex31 — DOUBLON du 2025, séance 3 exercice 1',
          pourquoi: 'AB = 3, AC = 5, BC = 6, BM = 1 — les mêmes données' },
        { n: '4.2', questions: 6,
          notions: ['repère', 'droite verticale', 'symétrique', 'losange par les diagonales',
                    'aire', 'parallèle', 'ensemble de points'],
          sort: 'bibliothèque', ou: 'brevet ex2642 — six volets',
          pourquoi: '(AC) est VERTICALE — A et C ont la même abscisse —, donc K(2 ; 0) est '
                  + 'à la fois le milieu de [AL] et celui de [OB] : AOLB est un losange sans '
                  + 'qu\'on mesure un côté, et son aire est le demi-produit des diagonales, 4√2. '
                  + 'L\'énoncé numérote 1, 2, 3, 5 — la question 4 manque' },
        { n: '4.6', questions: 20, notions: ['« نموذجية مدنين »', 'repère', 'changement de repère'],
          sort: 'bibliothèque', ou: 'brevet ex36 — DOUBLON du 2025, séance 3 exercice 6',
          pourquoi: 'BCE isocèle ET rectangle, BE = 2+√2, JE/JA = √2, HJ = 2, et le changement '
                  + 'de repère final dans (D ; B ; E) — le plus long exercice du livre 2025' },
        { n: '4.7', questions: 10, notions: ['prisme droit', 'trapèze', 'droite ⊥ plan'],
          sort: 'à arbitrer', ou: 'DOUBLON du 2025, séance 3 exercice 7',
          pourquoi: 'HG=2, EF=4, FB=10, IE=3, EH=3√5/2 — les mêmes données, donc les '
                  + 'MÊMES deux questions qui ne se referment pas. C\'est la quatrième '
                  + 'coquille du 2025 reproduite telle quelle en 2026' },

        // ── LE BALAYAGE ARITHMÉTIQUE ET RADICAUX DES HUIT SÉANCES ───────────
        // Cinq exercices de radicaux hors séance 1, et les CINQ sont déjà dans
        // la bibliothèque. Chaque identification est un RECALCUL, pas une
        // ressemblance : les nombres coïncident au chiffre près.
        { n: '3.1', questions: 7,
          notions: ['rationaliser', 'nombres inverses', '2a×c = √3', 'nombre صمّ'],
          sort: 'bibliothèque', ou: 'brevet ex21 — DOUBLON du 2025, séance 2 exercice 1',
          pourquoi: 'a = 2√3−3, b = (2√3+3)/3, c = 1+√3/2, ab = 1 et 2ac = √3 — '
                  + 'identiques. ET LA COQUILLE EST REPRODUITE : le livre 2026 imprime '
                  + 'encore (3√3−1)(4−5√3), qui vaut 17√3−49, là où la déduction exige '
                  + '(2√3−1)(4−5√3) = 13√3−34. La correction n\'a pas été reportée' },
        { n: '4.3', questions: 5,
          notions: ['deux nombres négatifs', 'comparer par les carrés', 'b/a > 1'],
          sort: 'bibliothèque', ou: 'brevet ex33 — DOUBLON du 2025, séance 3 exercice 3',
          pourquoi: 'a = 2√6−5 et b = 3√2−7, avec 24 < 25 et 18 < 49 — les mêmes '
                  + 'quatre nombres. Le 2026 ajoute une question de distance MN sur '
                  + 'un axe gradué' },
        { n: '4.4', questions: 5,
          notions: ['(a−b)² = ab', 'nombres inverses', '1/b − 1/a = 1/(a−b)'],
          sort: 'bibliothèque', ou: 'brevet ex34 — DOUBLON du 2025, séance 3 exercice 4',
          pourquoi: 'a = 4−2√5, b = 1−√5, (a−b)² = ab = 14−6√5 et 1/b − 1/a = 1/(a−b) '
                  + '= (3+√5)/4 — identiques' },
        { n: '6.1', questions: 6,
          notions: ['a = (3−2√2)²', 'a inverse de b²', 'ordonner des inverses'],
          sort: 'bibliothèque', ou: 'brevet ex51 — DOUBLON du 2025, séance 5 exercice 1',
          pourquoi: 'a = 17−12√2 et b = 3+2√2, avec a = 1/b² — identiques. Le 2026 '
                  + 'ajoute quatre questions : c = a−b, l\'ordre de 1/a, 1/b, 1/c, la '
                  + 'comparaison de 1/(a²+a) et 1/(b²+b), et (1−a⁻²)/b² + 24√2, qui '
                  + 'vaut exactement 0' },
        { n: '6.3', questions: 3,
          notions: ['comparer 7√3 et 11', 'un produit à quatre termes'],
          sort: 'bibliothèque', ou: 'brevet ex71 — DOUBLON du 2025, séance 7 exercice 1 (partie 2)',
          pourquoi: 'b = (√11−5)(1−√3) vaut 5√3+√11−5−√33 — exactement le t de ex71, '
                  + 'celui dont les QUATRE termes avaient montré la limite honnête du '
                  + 'noyau (la division par conjugué s\'arrête à deux termes)' },

        // ── LA SÉANCE 6 EST LA SÉANCE 5 DU 2025, exercice pour exercice ─────
        // Huit exercices, huit reprises. Le seul déplacement est le 6.3, qui
        // vient de la séance 7. Pas une ligne neuve.
        { n: '6.2', questions: 6,
          notions: ['rectangle', 'relation métrique', 'milieu', 'losange', 'aire'],
          sort: 'bibliothèque', ou: 'brevet ex52 — DOUBLON du 2025, séance 5 exercice 2',
          pourquoi: 'IA = 2 IC et IB = 2√2 — les mêmes données, et les SIX mêmes '
                  + 'volets jusqu\'au losange CODJ et son aire' },
        { n: '6.4', questions: 6,
          notions: ['deux intervalles', 'encadrement d\'une somme', 'carré encadrant'],
          sort: 'bibliothèque', ou: 'brevet ex54 — DOUBLON du 2025, séance 5 exercice 4',
          pourquoi: 'I = [−2 ; 3] et J = [−5/2 ; −1], puis 0 ≤ (2x−1)² ≤ 25 qui donne '
                  + '−1/4 ≤ x²−x ≤ 6 : le carré qui encadre ce qu\'on n\'encadre pas '
                  + 'directement. Le 2026 ajoute une question de représentation' },
        { n: '6.5', questions: 3,
          notions: ['encadrement', 'deux valeurs absolues'],
          sort: 'bibliothèque', ou: 'brevet ex55 — DOUBLON du 2025, séance 5 exercice 5',
          pourquoi: '−5 < 3x−5 < −2 puis A = |3x−5| − |x−4| : sur ]0 ; 1[ les deux '
                  + 'quantités sont négatives et les deux valeurs absolues se lèvent '
                  + 'de la même façon' },
        { n: '6.6', questions: 7,
          notions: ['prisme droit', 'trapèze', 'droite ⊥ plan', 'médiane et demi-hypoténuse'],
          sort: 'bibliothèque', ou: 'brevet ex56 — DOUBLON du 2025, séance 5 exercice 6',
          pourquoi: 'BC = CD, IC = AD/2, et les sept mêmes questions jusqu\'à NBD '
                  + 'isocèle. C\'est l\'exercice sans un seul nombre' },
        { n: '6.7', questions: 4,
          notions: ['M = 3x²−2x−5', 'factorisation', 'aire d\'un trapèze', 'équation'],
          sort: 'bibliothèque', ou: 'brevet ex57 — DOUBLON du 2025, séance 5 exercice 7',
          pourquoi: 'AB = 5, BC = 2, ECD équilatéral de côté 2x, et S₁ = √3 S₂ — les '
                  + 'mêmes nombres' },
        { n: '6.8', questions: 7,
          notions: ['carré qui glisse', 'somme de deux aires', 'forme canonique',
                    'repère', 'losange'],
          sort: 'bibliothèque', ou: 'brevet ex58 — DOUBLON du 2025, séance 5 exercice 8',
          pourquoi: 'AB = 8, AC = 4, MATH carré, TE = 2(4−x), Sb = 2(x−2)²+8 — '
                  + 'identiques jusqu\'au losange HCEA. Le 2026 lui donne un titre, '
                  + '« براهم و عفاس », que le 2025 n\'avait pas' },

        // ── LA SÉANCE 7 EST LA SÉANCE 12 DU 2025 ────────────────────────────
        { n: '7.QCM', questions: 3,
          notions: ['comparer par les carrés', 'mode d\'une série', 'diagonale de face'],
          sort: 'bibliothèque', ou: 'brevet ex121 — DOUBLON du 2025, séance 12 exercice 1',
          pourquoi: 'les trois mêmes questions, y compris CELLE QUI N\'A PAS DE BONNE '
                  + 'RÉPONSE : l\'ordre vrai est b < c < a, qui n\'est proposé nulle '
                  + 'part. La coquille est reconduite telle quelle' },
        { n: '7.1', questions: 11,
          notions: ['M = a²+2a−2', 'repère', 'triangle rectangle qui redonne M = 0'],
          sort: 'bibliothèque', ou: 'brevet ex122 — DOUBLON du 2025, séance 12 exercice 2',
          pourquoi: 'a = √3/2, M+3 = (a+1)², DE² = 4a²+8a+8, BE² = 4a²+8a+40, et F '
                  + 'symétrique de E par rapport à C — les mêmes' },
        { n: '7.2', questions: 7,
          notions: ['conjugués', 'triangle rectangle', 'relation métrique', 'Thalès'],
          sort: 'bibliothèque', ou: 'brevet ex123 — DOUBLON du 2025, séance 12 exercice 3',
          pourquoi: 'a = √7+1, b = √7−1, AB et AC les portent, BC = 4, AH = 3/2 — '
                  + 'les mêmes' },
        { n: '7.3', questions: 7,
          notions: ['angle 60°', 'triangle équilatéral', 'losange', 'orthocentre'],
          sort: 'bibliothèque', ou: 'brevet ex45 — DOUBLON du 2025, séance 4 exercice 5',
          pourquoi: 'ACD rectangle en C, AC = 6, angle 60°, puis ACBH losange et B '
                  + 'orthocentre de CDH — les mêmes' },

        // ── LA SÉANCE 8 EST UN RECUEIL — reprises, puis des SCANS ───────────
        { n: '8.g1', questions: 7,
          notions: ['isocèle', 'symétrique', 'centre de gravité', 'losange', 'aire'],
          sort: 'bibliothèque', ou: 'brevet ex124 — DOUBLON du 2025, séance 12 exercice 4',
          pourquoi: 'ABO isocèle de sommet O, AB = 6, OA = 5 — les mêmes' },
        { n: '8.g2', questions: 9,
          notions: ['équilatéral', 'symétrique', 'centre de gravité', 'rectangle', 'losange'],
          sort: 'bibliothèque', ou: 'brevet ex125 — DOUBLON du 2025, séance 12 exercice 5',
          pourquoi: 'AB = 6, O symétrique de B par rapport à A, GA/GC = 1/2 — les mêmes' },
        { n: '8.2', questions: 6,
          notions: ['a = 5−2√6', 'inverses', 'carré d\'un entier'],
          sort: 'bibliothèque', ou: 'brevet ex62 — DOUBLON du 2025, séance 6 exercice 2',
          pourquoi: 'a = (5√6−12)/√6 = 5−2√6 et b = √150+√(75/3)−√54 = 5+2√6 — les '
                  + 'mêmes écritures, jusqu\'à (1−a)(2+√6) = 4' },
        { n: '8.4', questions: 7,
          notions: ['nombre d\'or', 'carré', 'cercle', 'triangle rectangle'],
          sort: 'bibliothèque', ou: 'brevet ex65 — DOUBLON du 2025, séance 6 exercice 5 (منزه)',
          pourquoi: 'ABCD carré, I milieu de [CD], le cercle de centre I passant par '
                  + 'B — la construction classique du nombre d\'or' },
        { n: '8.5p', questions: 7,
          notions: ['pyramide régulière', 'droite ⊥ plan', 'projeté orthogonal'],
          sort: 'bibliothèque', ou: 'brevet ex126 — DOUBLON du 2025, séance 12 exercice 6',
          pourquoi: 'AB = 3√2 et SA = √2 × SO, puis « استنتج أن SA=6 » : la CINQUIÈME '
                  + 'coquille du 2025 reproduite telle quelle. Avec AB = 6 tout se '
                  + 'referme' },
        { n: '8.5b', questions: 7,
          notions: ['parallélépipède', 'droite ⊥ plan', 'médiane et demi-hypoténuse'],
          sort: 'bibliothèque', ou: 'brevet ex66 — DOUBLON du 2025, séance 6 exercice 5 (bis)',
          pourquoi: 'AEHD carré de côté 4, AB = 2√3, ENH isocèle — les mêmes' }
      ],
      machine: ['BALAYAGE ARITHMÉTIQUE ET RADICAUX FAIT sur les huit séances : les '
                + 'CINQ exercices de radicaux repérés hors séance 1 sont TOUS des '
                + 'reprises du livre 2025, confirmées au chiffre près par recalcul. '
                + 'La couche « radicaux » de la nouvelle édition est donc recyclée ; '
                + 'ce qui est neuf est ailleurs — l\'arithmétique de la séance 1 et '
                + 'la géométrie',
                'les pages 26 à 38 (séance 8) n\'ont AUCUNE couche de texte : elles '
                + 'sont scannées, et demandent une lecture visuelle page à page',
                'BALAYAGE GÉOMÉTRIQUE FAIT sur les huit séances. Les séances 6 et '
                + '7 n\'apportent RIEN de neuf : la 6 est la séance 5 du 2025 '
                + 'exercice pour exercice (huit sur huit), la 7 est sa séance 12 '
                + '(plus le 4.5). La séance 8 est un recueil : six reprises à couche '
                + 'de texte, puis des scans. Le livre 2026 est donc une REFONTE dont '
                + 'la géométrie est ENTIÈREMENT recyclée — ce qui est neuf tient dans '
                + 'la séance 1 (arithmétique) et quatre exercices de repère',
                'denombrer.js a gagné les nombres à QUATRE chiffres pour ce livre, '
                + 'et trois relations de plus (diviseur commun, unité divise centaine, '
                + 'dizaine sous centaine)'],
      etatFinal: 'EN COURS — séance 1 : quatre exercices portés sur dix'
    },

    // ═══════════════════════════════════════════════════════════════════
    // LES STATISTIQUES — trois fiches, et le chapitre qui manquait
    // ═══════════════════════════════════════════════════════════════════
    {
      fichier: 'Stat2013_9eme.pdf', pages: 6, texte: 'lisible', etat: 'dépouillé',
      exercices: 11, chapitres: ['stat9'],
      titre: 'الإحصاء 9 أساسي — المدرسة الإعدادية النموذجية ضفاف البحيرة',
      // La numérotation du fichier est celle d'un ASSEMBLAGE : deux « تمرين 5 »
      // et deux « تمرين 6 » différents, et les pages 5-6 reprennent une autre
      // feuille en entier. On les repère plutôt que de les lisser.
      contenu: [
        { n: '1', questions: 4, notions: ['histogramme', 'tableau à compléter', 'centre de classe', 'moyenne', 'polygone des effectifs'], sort: 'bibliothèque', ou: 'stat9 familles 1, 3, 6' },
        { n: '2', questions: 7, notions: ['diagramme en bâtons', 'pourcentages', 'mode', 'médiane', 'cumuls croissants et décroissants'], sort: 'bibliothèque', ou: 'stat9 familles 3, 4, 5' },
        { n: '6 (p.2)', questions: 4, notions: ['classes', 'pourcentages', 'moyenne'], sort: 'bibliothèque', ou: 'stat9 familles 4, 6' },
        { n: '7', questions: 4, notions: ['histogramme', 'lecture de classes', 'moyenne'], sort: 'bibliothèque', ou: 'stat9 famille 6' },
        { n: '8', questions: 4, notions: ['histogramme', 'mode', 'étendue', 'moyenne'], sort: 'bibliothèque', ou: 'stat9 familles 1, 6' },
        { n: '9', questions: 4, notions: ['histogramme à échelle d\'aires', 'effectif total', 'moyenne'], sort: 'bibliothèque', ou: 'stat9 famille 6' },
        { n: '10', questions: 6, notions: ['classes décimales (0,5 kg)', 'moyenne', 'mode', 'étendue', 'seuils'], sort: 'bibliothèque', ou: 'stat9 familles 1, 6, 8',
          pourquoi: 'c\'est cet exercice qui a fait sauter le piège du décimal : le noyau lisait « 0.5 » comme 0' },
        { n: '5 (p.4)', questions: 4, notions: ['diagramme circulaire', 'cumuls décroissants', 'mode', 'médiane'], sort: 'bibliothèque', ou: 'stat9 familles 4, 5, 7' },
        { n: '6 (p.4)', questions: 3, notions: ['série donnée en pourcentages', 'cumuls croissants', 'polygone'], sort: 'bibliothèque', ou: 'stat9 familles 3, 4' },
        { n: '1-3 (p.5-6)', questions: 24, notions: ['série discrète', 'diagramme', 'cumuls', 'médiane', 'probabilité'],
          sort: 'bibliothèque', ou: 'DOUBLON EXACT de Stat2009_9eme.pdf ex1, 2, 3',
          pourquoi: 'mot pour mot, même graphique, mêmes nombres — les pages 5 et 6 sont l\'autre feuille recollée' }
      ],
      machine: [],
      etatFinal: 'DÉPOUILLÉ — les onze exercices sont couverts par les huit familles de stat9'
    },

    {
      fichier: 'Stat2009_9eme.pdf', pages: 2, texte: 'lisible', etat: 'dépouillé',
      exercices: 4, chapitres: ['stat9'],
      titre: 'الإحصاء 9 أساسي — même en-tête, même auteur',
      contenu: [
        { n: '1', questions: 9, notions: ['série discrète', 'mode', 'étendue', 'moyenne', 'cumuls croissants', 'médiane', 'pourcentages', 'angle du camembert'],
          sort: 'bibliothèque', ou: 'DOUBLON de Stat2013 p.5 — couvert par stat9 familles 1 à 5' },
        { n: '2', questions: 9, notions: ['diagramme', 'mode', 'étendue', 'moyenne', 'cumuls', 'médiane', 'pourcentages'],
          sort: 'bibliothèque', ou: 'DOUBLON de Stat2013 p.5 — couvert par stat9 familles 1 à 5' },
        { n: '3', questions: 6, notions: ['classes', 'moyenne', 'cumuls croissants et décroissants', 'médiane', 'probabilité'],
          sort: 'bibliothèque', ou: 'DOUBLON de Stat2013 p.5-6 — couvert par stat9 familles 6, 7, 8' },
        { n: '4', questions: 7, notions: ['diagramme en bâtons', 'mode', 'étendue', 'cumuls', 'médiane', 'moyenne', 'probabilité'],
          sort: 'bibliothèque', ou: 'stat9 familles 1, 3, 5, 8',
          pourquoi: 'le SEUL exercice que Stat2013 n\'a pas — le reste du fichier y est déjà' }
      ],
      machine: [],
      etatFinal: 'DÉPOUILLÉ — trois exercices sur quatre sont des doublons de Stat2013'
    },

    {
      fichier: 'Stat9_Corrige_1.pdf', pages: 4, texte: 'lisible', etat: 'dépouillé',
      exercices: 10, chapitres: ['stat9'],
      titre: 'مراجعة لبرنامج الرياضيات — dourat 2009 à 2019, AVEC corrigés',
      // Ce fichier n'est pas une feuille d'exercices : c'est un recueil de
      // sujets d'examen CORRIGÉS. Sa valeur est ailleurs — il donne la RÈGLE
      // du maître pour la médiane, et un jeu de réponses publiées contre
      // lequel confronter le noyau. C'est ce qui a servi à le valider.
      contenu: [
        { n: '2009-4', questions: 3, notions: ['série discrète', 'mode', 'médiane par les rangs N/2 et N/2+1', 'cumuls', 'probabilité'],
          sort: 'bibliothèque', ou: 'stat9 familles 1, 3, 5, 8',
          pourquoi: 'le corrigé y écrit la règle du cas PAIR : la médiane est la demi-somme des valeurs de rangs 50 et 51' },
        { n: '2012/2015', questions: 3, notions: ['classes', 'moyenne 33,4', 'cumuls en proportions', 'médiane lue à 0,5', 'probabilité 0,92'],
          sort: 'bibliothèque', ou: 'stat9 familles 6, 7, 8',
          pourquoi: 'noyau confronté : moyenne 167/5 = 33,4 ✓, Me = 220/7 ≈ 31,43 contre « ≈ 31 » lu au crayon ✓' },
        { n: '2014-5', questions: 4, notions: ['histogramme', 'centre de classe', 'moyenne 35,12', 'cumuls en %', 'médiane lue à 50 %', 'probabilité'],
          sort: 'bibliothèque', ou: 'stat9 familles 6, 7, 8',
          pourquoi: 'noyau confronté : moyenne 878/25 = 35,12 ✓, cumuls 10-26-56-80-100 % ✓, Me = 176/5 = 35,2 contre « ≈ 35 » ✓' },
        { n: '2017-5', questions: 4, notions: ['classe modale', 'moyenne', 'cumuls', 'médiane', 'probabilité 60 %'],
          sort: 'bibliothèque', ou: 'stat9 familles 6, 7, 8',
          pourquoi: 'classe modale [40;60[ ✓, cumuls 20-104-240-348-400 ✓, Me = 920/17 ≈ 54,12 contre « ≈ 54 » ✓ — mais voir la coquille' },
        { n: '2019-5', questions: 3, notions: ['classe modale', 'moyenne 162,5', 'cumuls', 'médiane lue à N/2 = 50'],
          sort: 'bibliothèque', ou: 'stat9 familles 6, 7',
          pourquoi: 'moyenne 325/2 = 162,5 ✓, Me = 500/3 ≈ 166,67 contre « ≈ 167 » ✓' },
        { n: '2010, 2013, 2016, 2018', questions: 4, notions: ['QCM: moyenne d\'une petite série', 'probabilité', 'cumul croissant à rebours'],
          sort: 'bibliothèque', ou: 'stat9 familles 2, 3, 8' },
        { n: '2011-1', questions: 2, notions: ['diagramme circulaire', 'angles', 'probabilité'],
          sort: 'bibliothèque', ou: 'stat9 famille 4' }
      ],
      machine: [],
      // UNE COQUILLE, relevée par recalcul — la seule du corrigé.
      coquilles: [
        '2017-5 q2 : « معدّل إنتاج شجرة زيتون = 21760/400 = 54,5 ». Le numérateur '
        + '21760 est juste (20×10 + 84×30 + 136×50 + 108×70 + 52×90), le '
        + 'dénominateur 400 aussi — mais 21760/400 vaut 54,4 et non 54,5. '
        + '(Contrôle : 400 × 54,5 = 21800 ≠ 21760.) Le corrigé se contredit '
        + 'd\'une ligne à l\'autre ; c\'est 54,4.',
        '2014-5 q2 : la ligne intermédiaire écrit « (390 + 720 + 1530 + 1368 + '
        + '1260)/1000 » alors que N = 150. Le résultat suivant, 5268/150 = 35,12, '
        + 'est juste : le 1000 est un report de l\'exercice précédent.'
      ],
      etatFinal: 'DÉPOUILLÉ — et c\'est lui qui a servi de jeu de contrôle au noyau statistique'
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
      machine: ['plus aucun obstacle : espace.js recalcule les solides'] },

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
    let pages = 0, ex = 0, faits = 0, aFaire = 0, hors = 0, arbitrer = 0;
    for (const d of INVENTAIRE) {
      pages += d.pages || 0;
      const c = d.contenu || [];
      ex += d.exercices || c.length;
      for (const e of c) {
        if (e.sort === 'bibliothèque') faits++;
        else if (e.sort === 'à faire') aFaire++;
        else if (e.sort === 'hors machinerie') hors++;
        // « à arbitrer » : l'exercice est LU, recalculé, et c'est le recalcul
        // qui refuse — une donnée de l'énoncé ne se referme pas. Ce n'est ni un
        // manque de machine ni un travail restant : c'est une question posée au
        // maître, et elle doit se compter à part pour ne pas se perdre.
        else if (e.sort === 'à arbitrer') arbitrer++;
      }
    }
    return { documents: INVENTAIRE.length, pages, exercicesRecenses: ex,
             dansLaBibliotheque: faits, aFaire, horsMachinerie: hors, aArbitrer: arbitrer };
  }

  const API = { INVENTAIRE, bilan };
  if (M) module.exports = API; else racine.Inventaire = API;
})(typeof window !== 'undefined' ? window : globalThis);
