// LE NOYAU STATISTIQUE — séries discrètes et séries continues, en exact.
//
// Rien ici n'est approché. Une moyenne est une FRACTION (33,4 est 167/5), une
// fréquence est une fraction, et la médiane d'une série continue est
// l'ABSCISSE EXACTE d'un point du polygone — pas une lecture au crayon sur un
// dessin. Le maître lit « Me ≈ 31 » sur son graphique ; la machine, elle,
// répond 220/7, et c'est ce nombre-là qu'elle compare.
//
// ─────────────────────────────────────────────────────────────────────────
// LA MÉDIANE (الموسّط) — la règle du maître, écrite telle qu'elle est dite :
//
//   « La médiane d'une série continue se calcule par l'abscisse du point
//     d'ordonnée 50 % — ou N/2, ou (N+1)/2. »
//
// Les trois écritures désignent LE MÊME POINT du polygone des fréquences
// cumulées croissantes ; seule l'échelle verticale change :
//
//     axe en pourcentages       → on lit à 50 %
//     axe en proportions        → on lit à 0,5
//     axe en effectifs cumulés  → on lit à N/2
//
// Le polygone joint les points (borne supérieure de la classe ; cumul), en
// partant de (première borne ; 0). Entre deux sommets il est un SEGMENT, donc
// l'abscisse cherchée sort d'une interpolation affine — exacte en rationnels :
//
//     Me = bᵢ₋₁ + (h − Cᵢ₋₁) × (bᵢ − bᵢ₋₁) / (Cᵢ − Cᵢ₋₁)
//
// La variante (N+1)/2 est fournie aussi (`medianeAu`), parce que le maître la
// nomme : sur une série continue elle déplace la lecture d'un demi-effectif,
// donc d'autant moins que N est grand. Le README compare les deux sur les
// séries des fiches.
//
// Sur une série DISCRÈTE, il n'y a pas de polygone à couper : on range les
// valeurs et on prend celle de rang (N+1)/2 si N est impair, la demi-somme des
// rangs N/2 et N/2+1 s'il est pair. C'est ce que fait le corrigé du maître
// (dorure 2009 : N = 100, rangs 50 et 51, tous deux à la valeur 3, Me = 3).
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;

  const N0 = F.num(0);
  const lire = v => (typeof v === 'string' ? F.analyser(v, {}) : v);
  const somme = t => t.reduce((a, b) => F.sAdd(a, b), N0);

  // ── Une série ──────────────────────────────────────────────────────────
  //   { valeurs: ['0','1','2'], effectifs: [4,6,12] }              discrète
  //   { bornes: ['0','20','40'], effectifs: [220,490] }            continue
  // Les bornes et les valeurs passent par l'analyseur : « 0.5 » y est 1/2, et
  // « 1500/1000 » aussi. Les effectifs sont des entiers.
  function serie(d) {
    const s = { continue: !!d.bornes, nom: d.nom || '' };
    s.effectifs = d.effectifs.map(e => lire(String(e)));
    if (d.bornes) {
      s.bornes = d.bornes.map(b => lire(String(b)));
      if (s.bornes.length !== s.effectifs.length + 1)
        throw new Error('bornes et effectifs incompatibles dans « ' + s.nom + ' »');
    } else {
      s.valeurs = d.valeurs.map(v => lire(String(v)));
      if (s.valeurs.length !== s.effectifs.length)
        throw new Error('valeurs et effectifs incompatibles dans « ' + s.nom + ' »');
    }
    return s;
  }

  const total = s => somme(s.effectifs);

  // Le centre d'une classe — c'est LUI qui remplace la classe dans la moyenne,
  // et c'est la seule approximation que la leçon s'autorise. Elle est nommée.
  function centres(s) {
    if (!s.continue) return s.valeurs;
    return s.effectifs.map((_, i) =>
      F.sEch(F.sAdd(s.bornes[i], s.bornes[i + 1]), F.rat(1, 2)));
  }

  const largeurs = s => s.effectifs.map((_, i) =>
    F.sSub(s.bornes[i + 1], s.bornes[i]));

  const memeLargeur = s => !s.continue
    || largeurs(s).every(l => F.sEgaux(l, largeurs(s)[0]));

  function moyenne(s) {
    const c = centres(s);
    const p = c.map((v, i) => F.sMul(v, s.effectifs[i]));
    return F.sDiv(somme(p), total(s));
  }

  // Les cumuls CROISSANTS : C₁ = n₁, C₂ = n₁ + n₂, … Cₖ = N.
  function cumulCroissant(s) {
    const out = []; let a = N0;
    for (const e of s.effectifs) { a = F.sAdd(a, e); out.push(a); }
    return out;
  }
  // Les cumuls DÉCROISSANTS : ce qui reste à partir de chaque classe.
  function cumulDecroissant(s) {
    const N = total(s), c = cumulCroissant(s);
    return s.effectifs.map((e, i) => (i === 0 ? N : F.sSub(N, c[i - 1])));
  }

  const frequences = s => s.effectifs.map(e => F.sDiv(e, total(s)));
  const pourcentages = s => frequences(s).map(f => F.sMul(f, F.num(100)));
  // Les angles du diagramme circulaire — 360° partagés au prorata.
  const angles = s => frequences(s).map(f => F.sMul(f, F.num(360)));

  // ── LA MÉDIANE ─────────────────────────────────────────────────────────
  //
  // `medianeAu(s, h)` — l'abscisse du point du polygone des cumuls croissants
  // dont l'ORDONNÉE vaut h. C'est la règle du maître, prise au mot : on ne
  // cherche pas « la classe médiane puis une formule », on coupe le polygone.
  function medianeAu(s, h) {
    if (!s.continue) throw new Error('medianeAu ne vaut que pour une série continue');
    const c = cumulCroissant(s);
    if (F.sCmp(h, N0) < 0 || F.sCmp(h, total(s)) > 0)
      throw new Error('ordonnée hors du polygone');
    for (let i = 0; i < c.length; i++) {
      const avant = (i === 0) ? N0 : c[i - 1];
      if (F.sCmp(h, c[i]) <= 0) {
        const saut = F.sSub(c[i], avant);
        // Un palier horizontal : une classe d'effectif nul ne peut pas porter
        // la médiane, et l'on refuse plutôt que de diviser par zéro.
        if (F.sEgaux(saut, N0)) return s.bornes[i];
        const t = F.sDiv(F.sSub(h, avant), saut);
        return F.sAdd(s.bornes[i], F.sMul(t, F.sSub(s.bornes[i + 1], s.bornes[i])));
      }
    }
    return s.bornes[s.bornes.length - 1];
  }

  // La médiane telle que le corrigé la lit : à la MOITIÉ de l'effectif — ce
  // qui est le même point que 50 % sur un axe en pourcentages et que 0,5 sur
  // un axe en proportions.
  const mediane = s => s.continue
    ? medianeAu(s, F.sEch(total(s), F.rat(1, 2)))
    : medianeDiscrete(s);

  // La variante nommée par le maître : l'ordonnée (N+1)/2.
  const medianeN1 = s => medianeAu(s, F.sEch(F.sAdd(total(s), F.num(1)), F.rat(1, 2)));

  // La classe qui contient la médiane — celle que le polygone traverse.
  function classeMediane(s) {
    const h = F.sEch(total(s), F.rat(1, 2)), c = cumulCroissant(s);
    for (let i = 0; i < c.length; i++) if (F.sCmp(h, c[i]) <= 0) return i;
    return c.length - 1;
  }

  // Série discrète : on range et on prend le rang du milieu. Les valeurs sont
  // supposées données dans l'ordre croissant — le contrôle le vérifie.
  function medianeDiscrete(s) {
    verifierOrdre(s);
    const N = total(s), c = cumulCroissant(s);
    const rang = k => {                       // la valeur de rang k (1-indexé)
      for (let i = 0; i < c.length; i++) if (F.sCmp(F.num(k), c[i]) <= 0) return s.valeurs[i];
      return s.valeurs[s.valeurs.length - 1];
    };
    const n = F.sVal(N);
    if (n % 2) return rang((n + 1) / 2);
    return F.sEch(F.sAdd(rang(n / 2), rang(n / 2 + 1)), F.rat(1, 2));
  }

  function verifierOrdre(s) {
    const t = s.continue ? s.bornes : s.valeurs;
    for (let i = 1; i < t.length; i++)
      if (F.sCmp(t[i], t[i - 1]) <= 0)
        throw new Error('série non rangée en ordre croissant : « ' + s.nom + ' »');
  }

  // Le MODE (المنوال). Sur une série continue c'est une CLASSE, et la leçon la
  // lit sur le plus grand effectif — ce qui n'est légitime que si les classes
  // ont la même largeur. Sinon on refuse : comparer des effectifs de classes
  // inégales, c'est comparer des aires à des hauteurs.
  function indiceMode(s) {
    if (s.continue && !memeLargeur(s))
      throw new Error('classes de largeurs inégales : le mode se lit sur la '
                    + 'densité, pas sur l\'effectif brut (« ' + s.nom + ' »)');
    let k = 0;
    for (let i = 1; i < s.effectifs.length; i++)
      if (F.sCmp(s.effectifs[i], s.effectifs[k]) > 0) k = i;
    return k;
  }
  const mode = s => (s.continue ? null : s.valeurs[indiceMode(s)]);
  const classeModale = s => {
    const k = indiceMode(s);
    return s.continue ? [s.bornes[k], s.bornes[k + 1]] : null;
  };

  // L'ÉTENDUE (المدى) : du plus petit au plus grand.
  const etendue = s => s.continue
    ? F.sSub(s.bornes[s.bornes.length - 1], s.bornes[0])
    : F.sSub(s.valeurs[s.valeurs.length - 1], s.valeurs[0]);

  // Combien d'individus AU-DESSOUS d'un seuil ? Sur une série continue, la
  // réponse n'est exacte que si le seuil tombe sur une borne ; ailleurs on
  // répartit uniformément dans la classe — la même hypothèse que le polygone,
  // et il faut le dire.
  function effectifSous(s, seuil) {
    const v = lire(String(seuil));
    if (!s.continue) {
      let a = N0;
      s.valeurs.forEach((x, i) => { if (F.sCmp(x, v) < 0) a = F.sAdd(a, s.effectifs[i]); });
      return a;
    }
    const c = cumulCroissant(s);
    if (F.sCmp(v, s.bornes[0]) <= 0) return N0;
    for (let i = 0; i < s.effectifs.length; i++) {
      if (F.sCmp(v, s.bornes[i + 1]) >= 0) continue;
      const avant = (i === 0) ? N0 : c[i - 1];
      const t = F.sDiv(F.sSub(v, s.bornes[i]), F.sSub(s.bornes[i + 1], s.bornes[i]));
      return F.sAdd(avant, F.sMul(t, s.effectifs[i]));
    }
    return total(s);
  }
  const effectifAuDessus = (s, seuil) => F.sSub(total(s), effectifSous(s, seuil));
  // La probabilité de tomber sous un seuil, en choisissant au hasard.
  const probaSous = (s, seuil) => F.sDiv(effectifSous(s, seuil), total(s));

  // L'environnement qu'une chaîne reçoit : chaque grandeur y porte un nom, et
  // toutes sont RECALCULÉES sur la série. Une étape qui écrirait « M = 33.4 »
  // est donc confrontée à la série, pas crue sur parole.
  //
  //   N          l'effectif total          M     la moyenne
  //   Me         la médiane                MeN   la variante (N+1)/2
  //   E          l'étendue                 Mo    le mode (série discrète)
  //   na nb nc…  les effectifs             ca cb cc…  les cumuls croissants
  //   ra rb rc…  les cumuls décroissants   fa fb fc…  les fréquences
  //   pa pb pc…  les pourcentages          ga gb gc…  les angles du camembert
  //   xa xb xc…  les centres de classe     ba bb bc…  les bornes
  //   va vb vc…  les valeurs (série discrète)
  //
  // LES INDICES SONT DES LETTRES, et ce n'est pas un caprice : l'analyseur
  // découpe « n1 » en « n » puis « 1 », que la juxtaposition multiplie. Un nom
  // à chiffre serait donc lu comme un produit, en silence.
  const RANG = 'abcdefghijklmnopqrstuvwxyz';
  function nommer(s) {
    const e = {};
    e.N = total(s);
    e.M = moyenne(s);
    e.E = etendue(s);
    const c = cumulCroissant(s), r = cumulDecroissant(s);
    const f = frequences(s), p = pourcentages(s), g = angles(s), x = centres(s);
    if (s.effectifs.length > RANG.length)
      throw new Error('série trop longue pour être nommée : ' + s.nom);
    s.effectifs.forEach((v, i) => {
      const k = RANG[i];
      e['n' + k] = v; e['c' + k] = c[i]; e['r' + k] = r[i];
      e['f' + k] = f[i]; e['p' + k] = p[i]; e['g' + k] = g[i]; e['x' + k] = x[i];
    });
    if (s.continue) {
      s.bornes.forEach((b, i) => { e['b' + RANG[i]] = b; });
      e.Me = mediane(s); e.MeN = medianeN1(s);
    } else {
      e.Me = mediane(s);
      try { e.Mo = mode(s); } catch (err) { /* mode ambigu : on ne le nomme pas */ }
      s.valeurs.forEach((v, i) => { e['v' + RANG[i]] = v; });
    }
    return e;
  }

  // Les FAITS qu'un énoncé peut affirmer, et que l'on recalcule. Le contrat est
  // celui de `repere.js` : une valeur attendue est écrite en toutes lettres et
  // analysée, jamais comparée à un flottant.
  const REGLES = {
    effectif:     (s, [v], env) => F.sEgaux(total(s), F.analyser(String(v), env)),
    moyenne:      (s, [v], env) => F.sEgaux(moyenne(s), F.analyser(String(v), env)),
    mediane:      (s, [v], env) => F.sEgaux(mediane(s), F.analyser(String(v), env)),
    'mediane-n1': (s, [v], env) => F.sEgaux(medianeN1(s), F.analyser(String(v), env)),
    // « la médiane se lit à l'ordonnée h » — la règle du maître, contrôlée
    // pour ce qu'elle est : une lecture sur le polygone.
    'mediane-au': (s, [h, v], env) => F.sEgaux(medianeAu(s, F.analyser(String(h), env)),
                                               F.analyser(String(v), env)),
    etendue:      (s, [v], env) => F.sEgaux(etendue(s), F.analyser(String(v), env)),
    mode:         (s, [v], env) => !s.continue
                                && F.sEgaux(mode(s), F.analyser(String(v), env)),
    'classe-modale': (s, [g, d]) => {
      const c = classeModale(s);
      return !!c && F.sEgaux(c[0], lire(String(g))) && F.sEgaux(c[1], lire(String(d)));
    },
    'classe-mediane': (s, [g, d]) => {
      const k = classeMediane(s);
      return s.continue && F.sEgaux(s.bornes[k], lire(String(g)))
                        && F.sEgaux(s.bornes[k + 1], lire(String(d)));
    },
    effectifs:    (s, t) => t.length === s.effectifs.length
                         && t.every((v, i) => F.sEgaux(s.effectifs[i], lire(String(v)))),
    'cumul-croissant': (s, t) => {
      const c = cumulCroissant(s);
      return t.length === c.length && t.every((v, i) => F.sEgaux(c[i], lire(String(v))));
    },
    'cumul-decroissant': (s, t) => {
      const d = cumulDecroissant(s);
      return t.length === d.length && t.every((v, i) => F.sEgaux(d[i], lire(String(v))));
    },
    pourcentages: (s, t) => {
      const p = pourcentages(s);
      return t.length === p.length && t.every((v, i) => F.sEgaux(p[i], lire(String(v))));
    },
    centres:      (s, t) => {
      const c = centres(s);
      return t.length === c.length && t.every((v, i) => F.sEgaux(c[i], lire(String(v))));
    },
    angle:        (s, [i, v], env) => F.sEgaux(angles(s)[Number(i) - 1],
                                               F.analyser(String(v), env)),
    'sous-seuil': (s, [seuil, v], env) =>
      F.sEgaux(effectifSous(s, seuil), F.analyser(String(v), env)),
    'au-dessus':  (s, [seuil, v], env) =>
      F.sEgaux(effectifAuDessus(s, seuil), F.analyser(String(v), env)),
    'probabilite-sous': (s, [seuil, v], env) =>
      F.sEgaux(probaSous(s, seuil), F.analyser(String(v), env)),
    // Une probabilité écrite directement : k cas favorables sur N.
    probabilite:  (s, [k, v], env) =>
      F.sEgaux(F.sDiv(F.analyser(String(k), env), total(s)), F.analyser(String(v), env)),
    'largeurs-egales': s => memeLargeur(s),
    continue:     s => s.continue,
    discrete:     s => !s.continue
  };

  function verifierFaits(faits, s, env) {
    const p = [];
    for (const f of (faits || [])) {
      const r = REGLES[f[0]];
      if (!r) { p.push('واقعة غير معروفة: ' + f[0]); continue; }
      let ok;
      try { ok = r(s, f.slice(1), env); }
      catch (e) { p.push('تعذّر « ' + f.join(' ') + ' » (' + e.message + ')'); continue; }
      if (!ok) p.push('واقعة فاسدة: ' + f.join(' '));
    }
    return p;
  }

  const API = { serie, total, centres, largeurs, memeLargeur, moyenne,
                cumulCroissant, cumulDecroissant, frequences, pourcentages, angles,
                medianeAu, mediane, medianeN1, medianeDiscrete, classeMediane,
                mode, classeModale, indiceMode, etendue,
                effectifSous, effectifAuDessus, probaSous,
                nommer, REGLES, verifierFaits };
  if (M) module.exports = API; else racine.Stat = API;
})(typeof window !== 'undefined' ? window : globalThis);
