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
        { n: 1, questions: 3, notions: ['symétrie centrale', 'triangle rectangle', 'rectangle'],
          sort: 'à faire', pourquoi: 'sa q2a demande la même chose PAR DEUX CHEMINS — le moteur n\'en donne qu\'un, le plus court' },
        { n: 2, questions: 4, notions: ['cercle de diamètre [AB]', 'isocèle', 'milieux', 'rapport d\'aires'],
          sort: 'à faire', pourquoi: 'ses trois premières questions entrent ; la quatrième est un rapport d\'AIRES' },
        { n: 3, questions: 3, notions: ['parallélogramme', 'Thalès', 'EB² = EF × EG', 'projection selon une direction'],
          sort: 'à faire', pourquoi: 'la relation EB² = EF×EG s\'écrit comme un produit de rapports — la machinerie existe' },
        { n: 4, questions: 5, notions: ['trapèze rectangle', 'ligne des milieux', 'réciproque des milieux'],
          sort: 'bibliothèque',
          ou: 'cinq questions ; la feuille écrit « الموازي لـ(AD) » là où seul (AB) donne sa figure' },
        { n: 6, questions: 6, notions: ['trapèze', 'papillon', 'partage', 'milieux'], sort: 'à faire' },
        { n: 5, questions: 2, notions: ['milieux'], sort: 'bibliothèque' },
        { n: 7, questions: 2, notions: ['symétrie'], sort: 'à faire' },
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
        { n: 13, questions: 2, notions: ['milieux', 'symétrie'], sort: 'à faire' },
        { n: 14, questions: 2, notions: ['parallélogramme', 'Thalès', 'milieu'], sort: 'à faire' },
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
      etat: 'squelette', exercices: 65,
      titre: 'امتحان شهادة ختم التعليم الأساسي — مراجعة (جوان 2025)',
      chapitres: ['arith9', 'divisibilite8', 'diviseurs7', 'premiers7', 'thales9', 'reel9', 'radic9'],
      // Le livre est organisé en TREIZE SÉANCES. Le squelette ci-dessous sort
      // de la couche de texte, page par page — il n'a pas fallu l'ouvrir.
      structure: [
        { seance: 1, pages: '2-6', exercices: 12, sujet: 'arithmétique : divisibilité, arbre de choix, puissances et restes', vu: true },
        { seance: 2, pages: '7-9', exercices: 5, sujet: 'non lu' },
        { seance: 3, pages: '10-13', exercices: 7, sujet: 'non lu' },
        { seance: 4, pages: '14-16', exercices: 2, sujet: 'non lu' },
        { seance: 5, pages: '17-20', exercices: 8, sujet: 'non lu' },
        { seance: 6, pages: '21-23', exercices: 5, sujet: 'non lu' },
        { seance: 7, pages: '24-26', exercices: 4, sujet: 'non lu' },
        { seance: 8, pages: '27-29', exercices: 5, sujet: 'non lu' },
        { seance: 9, pages: '30-32', exercices: 4, sujet: 'non lu' },
        { seance: 10, pages: '33-36', exercices: 2, sujet: 'non lu' },
        { seance: 11, pages: '37-39', exercices: 6, sujet: 'non lu' },
        { seance: 12, pages: '40-43', exercices: 6, sujet: 'non lu' },
        { seance: 13, pages: '44-47', exercices: 6, sujet: 'non lu' }
      ],
      contenu: [
        { n: '1.1', questions: 3, notions: ['divisibilité par 12', 'reste d\'une puissance', 'arbre de choix'], sort: 'à faire' },
        { n: '1.2', questions: 3, notions: ['nombres à 3 chiffres divisibles par 12, 15'], sort: 'à faire' },
        { n: '1.3', questions: 4, notions: ['arbre de choix', 'PGCD des chiffres', 'divisibilité par 15'], sort: 'à faire' },
        { n: '1.4', questions: 3, notions: ['code secret', 'divisibilité par 15 et 12'], sort: 'à faire' },
        { n: '1.5', questions: 2, notions: ['restes de la division par 4', 'arbre de choix'], sort: 'à faire' },
        { n: '1.6', questions: 3, notions: ['ensemble défini par des conditions sur les chiffres'], sort: 'à faire' },
        { n: '1.7', questions: 2, notions: ['arbre de choix', 'divisibilité par 12'], sort: 'à faire' }
      ],
      machine: ['l\'arbre de choix (dénombrement) n\'existe dans aucun chapitre',
                'les restes de puissances — arith9 sait le faire, à relier',
                'les onze autres séances restent à ouvrir']
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
