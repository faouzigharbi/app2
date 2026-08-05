// Valide toutes les démonstrations de la fiche sur un grand nombre de tirages.
//   node verifier.js [tirages]
//   CONTRE_EXEMPLES=1 node verifier.js
//
// UNE DÉMONSTRATION NE SE RELIT PAS, ELLE SE REFAIT. On croit toujours ce
// qu'on a écrit ; on ne croit pas ce qu'un calcul contredit. Sur CHAQUE
// question tirée :
//
//   1. toute affirmation de la chaîne — les données, chaque conclusion
//      intermédiaire, le but — est RECALCULÉE sur les coordonnées. « (D)//(D') »
//      devient un déterminant, « (AH)⊥(BC) » un produit scalaire, « MA=MB »
//      deux carrés de distance. Rien n'est approché : tout est rationnel ;
//   2. les données doivent être vraies AVANT la démonstration. Un énoncé dont
//      les hypothèses se contredisent démontrerait n'importe quoi ;
//   3. aucune droite dégénérée : « (AA) » n'est pas une droite, et sa
//      direction nulle rendrait tout perpendiculaire et tout parallèle ;
//   4. aucune étape dupliquée — deux ordres seraient corrects, la chaîne
//      cesserait d'en avoir un — et aucune relation portée deux fois ;
//   5. la figure existe, elle est équilibrée, et ses points sont ceux de
//      l'énoncé : une figure qui ne vient pas des mêmes coordonnées peut
//      mentir sur ce que le texte affirme.
const F = require('./noyau.js');
require('./regles.js');
const C = require('./chaines.js');
const I = require('./items.js');
require('./gens.js');

const TIRAGES = Number(process.argv[2]) || 60;
let questions = 0, relations = 0, controles = 0;
const echecs = [];

// « 5/2 » ou « 4 » : le contrôle porte la valeur en texte pour survivre à la
// copie, et la relit en rationnel exact pour la comparer.
const lireQ = t => {
  const [n, d] = String(t).split('/');
  return F.q(BigInt(n), BigInt(d === undefined ? 1 : d));
};

// ── Refaire une affirmation ──────────────────────────────────────────────
function verifierFait(v, pts) {
  const p = n => {
    if (!pts[n]) throw new Error('point inconnu: ' + n);
    return pts[n];
  };
  const deux = x => (Array.isArray(x) ? [p(x[0]), p(x[1])] : null);
  switch (v.type) {
    case 'perp': {
      const a = deux(v.a), b = deux(v.b);
      return a && b && F.perp(a[0], a[1], b[0], b[1]);
    }
    case 'para': {
      const a = deux(v.a), b = deux(v.b);
      return a && b && F.para(a[0], a[1], b[0], b[1]);
    }
    case 'med': {
      const a = deux(v.a), b = deux(v.b);
      return a && b && F.estMediatrice(a[0], a[1], b[0], b[1]);
    }
    case 'mil': {
      const b = deux(v.b);
      return b && F.estMilieu(p(v.a), b[0], b[1]);
    }
    case 'passe': {
      const a = deux(v.a);
      return a && F.aligne(a[0], a[1], p(v.b));
    }
    case 'egal': {
      // « SB = SC » : deux longueurs écrites par leurs deux lettres
      const [x1, x2] = String(v.a).split(''), [y1, y2] = String(v.b).split('');
      return F.memeLongueur(p(x1), p(x2), p(y1), p(y2));
    }
    case 'tang': {
      // « (Δ) مماس للدائرة (C) في A » : le contact est SUR le cercle, et la
      // droite y est perpendiculaire au rayon. Les deux, sinon ce n'est pas
      // une tangente — une sécante passe aussi par un point du cercle.
      const a = deux(v.a);
      const [contact, cercle] = String(v.b).split('@');
      const c = (v.cercles || []).find(x => x.nom === cercle);
      if (!a || !c) return null;
      return F.perp(a[0], a[1], p(c.centre), p(contact))
          && F.memeLongueur(p(c.centre), p(contact), p(c.centre), p(c.bord))
          && F.aligne(a[0], a[1], p(contact));
    }
    case 'dist': {
      const b = deux(v.b);
      const d = b && F.distance(p(v.a), b[0], b[1]);
      return d !== null && d !== undefined && F.qEgaux(d, lireQ(v.valeur));
    }
    case 'lg': {
      const a = deux(v.a);
      const l = a && F.longueur(a[0], a[1]);
      return l !== null && l !== undefined && F.qEgaux(l, lireQ(v.valeur));
    }
    // LES VERDICTS SE RECALCULENT AUSSI. « المستقيم مماس للدائرة » n'est pas
    // une opinion : c'est d(O, (D)) = r, et rien d'autre.
    case 'pos-dc': {
      const a = deux(v.a), b = deux(v.b);
      if (!a || !b) return null;
      const d = F.distance(a[0], b[0], b[1]), r = F.longueur(a[0], a[1]);
      if (d === null || r === null) return null;
      const vu = F.qEgaux(d, r) ? 'tangent'
               : (F.qNum(d) < F.qNum(r) ? 'coupe' : 'dehors');
      return vu === v.valeur;
    }
    case 'pos-cc': {
      const a = deux(v.a), b = deux(v.b);
      if (!a || !b) return null;
      const dd = F.longueur(a[0], b[0]);
      const r1 = F.longueur(a[0], a[1]), r2 = F.longueur(b[0], b[1]);
      if (dd === null || r1 === null || r2 === null) return null;
      const somme = F.qAdd(r1, r2);
      const diff = F.qNum(r1) >= F.qNum(r2) ? F.qSub(r1, r2) : F.qSub(r2, r1);
      let vu;
      if (F.qEgaux(dd, somme)) vu = 'tangentExt';
      else if (F.qEgaux(dd, diff)) vu = 'tangentInt';
      else if (F.qNum(dd) > F.qNum(somme)) vu = 'exterieur';
      else if (F.qNum(dd) < F.qNum(diff)) vu = 'interieur';
      else vu = 'secants';
      return vu === v.valeur;
    }
    // LA NATURE D'UN QUADRILATÈRE SE RECALCULE, sommet par sommet et dans
    // l'ordre. « ABCD est un parallélogramme » veut dire AB⃗ = DC⃗ , et rien
    // d'autre ; un rectangle y ajoute un angle droit, un losange deux côtés
    // consécutifs égaux, un carré les deux.
    case 'nature': {
      const [A1, B1, C1, D1] = (v.a || []).map(p);
      if (!A1 || !B1 || !C1 || !D1) return null;
      const u = F.vec(A1, B1), w = F.vec(D1, C1);
      const parall = F.qEgaux(u.x, w.x) && F.qEgaux(u.y, w.y);
      const droit = F.perp(A1, B1, A1, D1);
      const cotes = F.memeLongueur(A1, B1, A1, D1);
      return { parallelogramme: parall,
               rectangle: parall && droit,
               losange: parall && cotes,
               carre: parall && droit && cotes }[v.b] === true;
    }
    default: return null;                       // type inconnu : on le dira
  }
}

function verifierBrut(brut) {
  const probs = [];
  const c = brut.controle;
  if (!c || c.type !== 'geometrie') { probs.push('نوع غير معروف'); return probs; }

  for (const v of c.verifs) {
    let ok;
    try { ok = verifierFait(Object.assign({ cercles: c.cercles || [] }, v), c.pts); }
    catch (e) { probs.push('exception: ' + e.message); continue; }
    if (ok === null) { probs.push('نوع غير معروف: ' + v.type); continue; }
    relations++;
    if (!ok) probs.push('علاقة فاسدة: ' + v.texte);
  }
  controles++;

  // Une droite dégénérée passe tous les tests et n'en est pas une.
  for (const v of c.verifs) {
    if (['pos-dc', 'pos-cc', 'lg', 'nature'].indexOf(v.type) >= 0) continue;
    for (const cote of [v.a, v.b]) {
      if (!Array.isArray(cote)) continue;
      if (F.memesPoints(c.pts[cote[0]], c.pts[cote[1]])) {
        probs.push('مستقيم منحلّ: (' + cote.join('') + ')');
      }
    }
  }

  const t = brut.etapes.map(e => e.join(': '));
  if (new Set(t).size !== t.length) probs.push('مراحل مكرّرة');
  // LE CHOIX DE L'ITINÉRAIRE SE VÉRIFIE. « Pas les deux perpendiculaires,
  // parce qu'on n'en connaît qu'une » : s'il y en a deux, la phrase est
  // fausse et elle enseigne le faux.
  {
    const MANQUE = {
      'perp-perp-para': h => h.filter(x => x[0] === 'perp').length < 2,
      'para-para-para': h => h.filter(x => x[0] === 'para').length < 2,
      'med-perp': h => !h.some(x => x[0] === 'med'),
      'tangente-perp': h => !h.some(x => x[0] === 'tang'),
      'milieu-equidistance': h => !h.some(x => x[0] === 'mil'),
      'equidistant-mediatrice': h => !h.some(x => x[0] === 'egal')
    };
    const it = c.itineraire;
    if (it && it.ecartee && MANQUE[it.ecartee]
        && !MANQUE[it.ecartee](c.hypBrutes || [])) {
      probs.push('سبب الاستبعاد غير صحيح : ' + it.ecartee);
    }
  }
  const maths = brut.etapes.map(e => String(e[1]).trim())
    .filter(m => /[⊥/=∈]/.test(m) && !/إذن/.test(m));
  if (new Set(maths).size !== maths.length) probs.push('علاقة مكرّرة في مرحلتين');
  if (t.length < 4) probs.push('السلسلة قصيرة جدا');
  if (!brut.indice) probs.push('بلا مساعدة');

  // LA FIGURE. Elle doit exister, être équilibrée, et ne montrer que des
  // points de l'énoncé — sinon elle raconte autre chose que le texte.
  const svg = (brut.enonce || []).find(x => x && typeof x === 'object' && x.svg);
  if (!svg) probs.push('بلا رسم');
  else {
    const s = svg.svg;
    if ((s.match(/</g) || []).length !== (s.match(/>/g) || []).length) {
      probs.push('رسم غير متوازن');
    }
    for (const m of s.match(/>([A-Za-z])<\/text>/g) || []) {
      const n = m[1];
      if (!c.pts[n]) probs.push('نقطة في الرسم ليست في المعطيات: ' + n);
    }
  }
  return probs;
}

// ── Contre-exemples : le validateur doit MORDRE ──────────────────────────
if (process.env.CONTRE_EXEMPLES) {
  // Les coordonnées sont des BigInt : JSON les refuse. On copie donc à la
  // main, et l'on compare sur une empreinte qui sait les écrire — sans quoi
  // « la mutation a-t-elle mordu ? » resterait sans réponse.
  const copie = x => {
    if (typeof x === 'bigint') return x;
    if (Array.isArray(x)) return x.map(copie);
    if (x && typeof x === 'object') {
      const o = {};
      for (const k of Object.keys(x)) o[k] = copie(x[k]);
      return o;
    }
    return x;
  };
  const empreinte = x => JSON.stringify(x, (k, v) => (typeof v === 'bigint' ? v + 'n' : v));
  const cas = [];
  const NUMS = Object.keys(F.PROBLEMES).map(Number);
  // Une falsification qui ne falsifie rien n'est pas un test : on retire
  // jusqu'à ce que la mutation change vraiment quelque chose.
  // Deux façons pour une falsification de ne rien prouver, et toutes deux
  // doivent se voir : la mutation peut ne RIEN CHANGER — chercher un verdict
  // dans une chaîne qui n'en a pas —, ou changer quelque chose qui reste VRAI
  // — promouvoir en carré un rectangle qui se trouve en être un. On retire
  // dans les deux cas, et si l'on n'y arrive jamais, on le dit : un
  // contre-exemple qui n'en est pas un mesure la chance, pas le validateur.
  const pousse = (nom, f) => {
    for (let essai = 0; essai < 80; essai++) {
      const n = NUMS[essai % NUMS.length];
      const avant = copie(F.tirer(n)[0]);
      const c = copie(avant);
      f(c);
      if (empreinte(c) === empreinte(avant)) continue;
      let probs;
      try { probs = verifierBrut(c); } catch (e) { probs = ['exception']; }
      if (probs.length) return cas.push([nom, c]);
    }
    cas.push([nom + ' — AUCUNE FALSIFICATION POSSIBLE', null]);
  };

  // Une raison d'écarter qui n'est pas vraie enseigne le faux.
  pousse('une raison d’écarter qui est fausse', c => {
    const it = c.controle.itineraire;
    if (!it) throw new Error('pas d’itinéraire');
    if ((c.controle.hypBrutes || []).filter(x => x[0] === 'perp').length < 2) {
      throw new Error('rien à contredire');
    }
    it.ecartee = 'perp-perp-para';
  });
  pousse('un point déplacé', c => {
    const n = Object.keys(c.controle.pts)[0];
    const p = c.controle.pts[n];
    c.controle.pts[n] = F.pt(F.qAdd(p.x, F.q(1)), p.y);
  });
  pousse('perpendiculaire changée en parallèle', c => {
    const v = c.controle.verifs.find(x => x.type === 'perp');
    if (v) v.type = 'para';
  });
  pousse('une droite réduite à un point', c => {
    const v = c.controle.verifs.find(x => Array.isArray(x.a));
    if (v) v.a = [v.a[0], v.a[0]];
  });
  pousse('un verdict retourné', c => {
    const v = c.controle.verifs.find(x => x.type === 'pos-dc' || x.type === 'pos-cc');
    if (v) v.valeur = (v.valeur === 'tangent') ? 'coupe' : 'tangent';
  });
  pousse('une distance changée', c => {
    const v = c.controle.verifs.find(x => x.type === 'dist' || x.type === 'lg');
    if (v) v.valeur = String(Number(String(v.valeur).split('/')[0]) + 1);
  });
  // Le RAYON passe par le point de contact, et il n'est pas tangent. C'est la
  // confusion même que la règle doit écarter : un point commun ne suffit pas.
  pousse('le rayon donné pour tangente', c => {
    const v = c.controle.verifs.find(x => x.type === 'tang');
    if (!v) return;
    const [contact, nom] = String(v.b).split('@');
    const cc = (c.controle.cercles || []).find(x => x.nom === nom);
    if (cc) v.a = [cc.centre, contact];
  });
  pousse('un quadrilatère promu', c => {
    const v = c.controle.verifs.find(x => x.type === 'nature');
    if (v) v.b = (v.b === 'carre') ? 'rectangle' : 'carre';
  });
  pousse('étape dupliquée', c => { c.etapes[2] = c.etapes[1].slice(); });
  pousse('chaîne tronquée', c => { c.etapes = c.etapes.slice(0, 3); });
  pousse('aide absente', c => { c.indice = ''; });
  pousse('figure retirée', c => {
    c.enonce = c.enonce.filter(x => !(x && typeof x === 'object' && x.svg));
  });

  let bon = 0;
  for (const [nom, q] of cas) {
    let probs;
    try { probs = q ? verifierBrut(q) : ['aucune mutation']; }
    catch (e) { probs = ['exception: ' + e.message]; }
    console.log((probs.length ? '✗ rejeté  ' : '⚠ ACCEPTÉ ') + nom
      + (probs.length ? ' — ' + String(probs[0]).slice(0, 70) : ''));
    if (probs.length) bon++;
  }
  console.log('\n' + bon + '/' + cas.length + ' falsifications détectées.');
  process.exit(bon === cas.length ? 0 : 1);
}

// ── La passe normale ─────────────────────────────────────────────────────
for (const n of Object.keys(F.PROBLEMES).map(Number).sort((a, b) => a - b)) {
  const def = F.PROBLEMES[n];
  let mauvais = 0, formes = new Set();
  for (let t = 0; t < TIRAGES; t++) {
    for (const q of F.tirer(n)) {
      questions++;
      formes.add(q.enonce.map(x => (x && x.svg) ? 'fig' : x).join('|'));
      const probs = verifierBrut(q);
      if (probs.length) {
        mauvais++;
        if (echecs.length < 12) {
          echecs.push('التمرين ' + n + ': ' + q.source + '\n    - ' + probs.join('\n    - '));
        }
      }
    }
  }
  console.log(('ex' + n + ' — ' + def.titre).padEnd(52)
    + (mauvais ? '✗ ' + mauvais + ' échec(s)' : '✓') + '  (' + formes.size + ' صيغة)');
}

console.log();
echecs.forEach(e => console.log(e));
console.log('\n' + TIRAGES + ' tirages, ' + questions + ' questions, '
  + relations + ' relations recalculées et ' + controles + ' contrôles, '
  + (echecs.length ? 'ÉCHECS.' : '0 erreur.'));
process.exit(echecs.length ? 1 : 0);
