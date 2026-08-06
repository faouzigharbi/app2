// L'ARBRE DE CHOIX — le dénombrement, en énumération exhaustive.
//
// C'était le dernier manque nommé de l'inventaire : « l'arbre de choix
// (dénombrement) n'existe dans aucun chapitre ». La séance 1 en vit presque
// entièrement — combien de nombres à trois chiffres vérifient telle condition,
// combien de menus dans un restaurant, combien de codes secrets.
//
// LE POINT IMPORTANT EST LA MÉTHODE DE CONTRÔLE. Une chaîne d'arbre de choix
// raisonne par le PRODUIT : « 2 choix de centaine, puis 3 de dizaine, puis 2
// d'unité, donc 2 × 3 × 2 = 12 ». Si le validateur refaisait ce produit, il ne
// vérifierait rien — il répéterait l'argument. Il fait donc autre chose : il
// PARCOURT LES MILLE NOMBRES À TROIS CHIFFRES un par un et compte ceux qui
// passent. Les deux chemins n'ont rien en commun, et c'est ce qui donne au
// contrôle sa valeur.
//
// Les contraintes sont donc des DONNÉES, jamais du code : un objet que la
// question déclare et que le noyau interprète. Une contrainte que le noyau ne
// connaît pas est refusée, pas ignorée.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);

  // Les relations NOMMÉES entre les chiffres. Chacune est écrite une fois ici,
  // et une question ne peut en employer que par son nom — jamais en glissant
  // une fonction, qui échapperait à la relecture.
  const RELATIONS = {
    // « رقم عشراته مضاعف لرقم آحاده » — la dizaine est un multiple de l'unité.
    'dizaine-multiple-unite': (c, d, u) => u !== 0 && d % u === 0,
    // « رقم مآته هو الفارق بين رقم عشراته و رقم آحاده » — la centaine est
    // l'écart entre la dizaine et l'unité, dans l'ordre qui le rend positif.
    'centaine-ecart': (c, d, u) => c === Math.abs(d - u),
    // « رقم المئات و رقم العشرات متتاليان » — centaine et dizaine consécutives.
    'centaine-dizaine-consecutives': (c, d) => Math.abs(c - d) === 1,
    // Les trois chiffres deux à deux distincts — la contrainte la plus fréquente.
    distincts: (c, d, u) => c !== d && c !== u && d !== u,
    pair: (c, d, u, n) => n % 2 === 0,
    impair: (c, d, u, n) => n % 2 === 1
  };

  const PREMIERS = [2, 3, 5, 7];
  // Les familles de chiffres que les énoncés nomment en toutes lettres.
  const FAMILLES = {
    premier: PREMIERS,
    'multiple-de-4': [0, 4, 8],
    'diviseur-de-6': [1, 2, 3, 6],
    'diviseur-de-14': [1, 2, 7],          // parmi les chiffres
    pair: [0, 2, 4, 6, 8],
    impair: [1, 3, 5, 7, 9],
    'non-nul': [1, 2, 3, 4, 5, 6, 7, 8, 9]
  };

  // Un jeu de chiffres autorisé à une position : une liste explicite, ou le nom
  // d'une famille. Tout autre chose est une erreur.
  function jeu(v, defaut) {
    if (v === undefined || v === null) return defaut;
    if (Array.isArray(v)) return v.slice();
    if (typeof v === 'string') {
      if (!FAMILLES[v]) throw new Error('famille de chiffres inconnue : ' + v);
      return FAMILLES[v].slice();
    }
    throw new Error('jeu de chiffres illisible');
  }

  // L'ÉNUMÉRATION. On ne construit pas les nombres « intelligemment » : on les
  // parcourt tous, et l'on garde ceux qui passent. C'est lent et c'est le but —
  // aucune ruse ne peut s'y glisser.
  function liste(c) {
    const chiffres = jeu(c.chiffres, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const cent = jeu(c.centaines, chiffres).filter(x => chiffres.indexOf(x) >= 0);
    const diz = jeu(c.dizaines, chiffres).filter(x => chiffres.indexOf(x) >= 0);
    const uni = jeu(c.unites, chiffres).filter(x => chiffres.indexOf(x) >= 0);
    for (const nom of (c.relations || []))
      if (!RELATIONS[nom]) throw new Error('relation inconnue : ' + nom);

    const out = [];
    for (let x = 100; x <= 999; x++) {          // les mille nombres, un par un
      const a = Math.floor(x / 100), b = Math.floor(x / 10) % 10, e = x % 10;
      if (cent.indexOf(a) < 0 || diz.indexOf(b) < 0 || uni.indexOf(e) < 0) continue;
      if (c.distincts && !RELATIONS.distincts(a, b, e, x)) continue;
      if (c.divisiblePar !== undefined && x % c.divisiblePar !== 0) continue;
      let bon = true;
      for (const nom of (c.relations || []))
        if (!RELATIONS[nom](a, b, e, x)) { bon = false; break; }
      if (bon) out.push(x);
    }
    return out;
  }

  const compte = c => liste(c).length;

  // Le PRODUIT d'un arbre de choix — pour les questions où l'on ne dénombre pas
  // des nombres mais des menus : « deux entrées, quatre plats, trois desserts ».
  const produit = t => t.reduce((a, b) => a * b, 1);

  const REGLES = {
    compte: (E, [v]) => compte(E) === Number(v),
    // La liste EXACTE, séparée par des espaces. Annoncer un compte sans la
    // liste laisserait passer deux erreurs qui se compensent.
    liste: (E, t) => {
      const attendu = t.join(' ').trim().split(/\s+/).map(Number);
      const vrai = liste(E);
      return attendu.length === vrai.length && attendu.every((x, i) => x === vrai[i]);
    },
    contient: (E, t) => {
      const vrai = liste(E);
      return t.map(Number).every(x => vrai.indexOf(x) >= 0);
    },
    'ne-contient-pas': (E, t) => {
      const vrai = liste(E);
      return t.map(Number).every(x => vrai.indexOf(x) < 0);
    },
    // « le produit de l'arbre » : on donne les branches et le total attendu.
    produit: (E, t) => {
      const v = Number(t[t.length - 1]);
      return produit(t.slice(0, -1).map(Number)) === v;
    }
  };

  function verifierFaits(faits, E) {
    const p = [];
    for (const f of (faits || [])) {
      const r = REGLES[f[0]];
      if (!r) { p.push('واقعة غير معروفة: ' + f[0]); continue; }
      let ok;
      try { ok = r(E, f.slice(1)); }
      catch (e) { p.push('تعذّر « ' + f.join(' ') + ' » (' + e.message + ')'); continue; }
      if (!ok) p.push('واقعة فاسدة: ' + f.join(' '));
    }
    return p;
  }

  const API = { liste, compte, produit, RELATIONS, FAMILLES, REGLES, verifierFaits };
  if (M) module.exports = API; else racine.Denombrer = API;
})(typeof window !== 'undefined' ? window : globalThis);
