// LE VALIDATEUR — il REFAIT, il ne relit pas.
//
// Chaque affirmation d'une démonstration est recalculée sur les COORDONNÉES
// exactes de la scène : une longueur par son carré, un parallélisme par un
// déterminant nul, un angle droit par un produit scalaire nul, un milieu par
// deux demi-sommes. Rien n'est cru sur parole, pas même les hypothèses — un
// énoncé qui annoncerait AB = 5 sur une figure où AB vaut 6 serait refusé ici.
//
//   node verifier.js [tirages]
//   CONTRE_EXEMPLES=1 node verifier.js
const F = require('./noyau.js');
const R = require('./regles.js');
const I = require('./items.js');
const C = require('./chaines.js');
require('./gens.js');

const N = parseInt(process.argv[2], 10) || 30;
let relations = 0, controles = 0, faits = 0;

const lireQ = t => { const [n, d] = String(t).split('/'); return F.q(BigInt(n), BigInt(d)); };
const seg = R.seg;
// Un fait sérialisé, rendu au moteur : seule une valeur de longueur redevient
// un rationnel — les autres champs sont des noms de points.
const desec = f => f.map((x, i) =>
  ((f[0] === 'lg2' || f[0] === 'rapport') && i === 2 && x !== null) ? lireQ(x) : x);

// RELIRE UNE LONGUEUR ÉCRITE, et rendre son CARRÉ. Trois formes possibles —
// « 7,5 », « 1892/395 » empilé, « 4√2 » — et l'on refuse tout ce qui n'entre
// dans aucune : mieux vaut un refus qu'une lecture indulgente.
function relire(ecrit) {
  const F2 = /<span class="frac" dir="ltr"><span class="num">(.*?)<\/span><span class="den">(.*?)<\/span><\/span>/
    .exec(ecrit);
  const morceau = t => {
    const r = /^(\d*)√(\d+)$/.exec(t);                    // a√b  → a²b
    if (r) { const a = BigInt(r[1] || '1'); return F.q(a * a * BigInt(r[2])); }
    const d = /^(\d+),(\d+)$/.exec(t);                    // 7,5  → (75/10)²
    if (d) { const q = F.q(BigInt(d[1] + d[2]), 10n ** BigInt(d[2].length));
             return F.qMul(q, q); }
    if (/^\d+$/.test(t)) return F.q(BigInt(t) * BigInt(t));
    return null;
  };
  if (F2) {
    const h = morceau(F2[1]), b = morceau(F2[2]);
    return (h && b) ? F.qDiv(h, b) : null;
  }
  return morceau(ecrit);
}

// La scène, reconstruite depuis le contrôle seul : le validateur ne touche
// jamais aux objets vivants de la chaîne, il repart du texte sérialisé.
function rebatir(c) {
  const P = F.plan(lireQ(c.K));
  const pts = {};
  for (const n of Object.keys(c.points)) {
    pts[n] = F.pt(lireQ(c.points[n][0]), lireQ(c.points[n][1]));
  }
  return { P, pts };
}

// ── Un fait, recalculé ───────────────────────────────────────────────────
function verifierFait(f, S) {
  const { P, pts } = S;
  const p = n => { const x = pts[n]; if (!x) throw new Error('point absent : ' + n); return x; };
  faits++;
  switch (f[0]) {
    case 'lg2': {
      const vrai = P.carre(p(f[1][0]), p(f[1][1]));
      const dit = lireQ(f[2]);
      return F.qEgaux(vrai, dit) ? null
        : f[1] + ' vaut ' + F.ecrireRacine(vrai).replace(/<[^>]+>/g, '')
          + ' et non ' + F.ecrireRacine(dit).replace(/<[^>]+>/g, '');
    }
    case 'para':
      return P.para(p(f[1][0]), p(f[1][1]), p(f[2][0]), p(f[2][1])) ? null
        : '(' + f[1] + ') n’est pas parallèle à (' + f[2] + ')';
    case 'perp':
      return P.perp(p(f[1][0]), p(f[1][1]), p(f[2][0]), p(f[2][1])) ? null
        : '(' + f[1] + ') n’est pas perpendiculaire à (' + f[2] + ')';
    case 'milieu':
      return P.estMilieu(p(f[1]), p(f[2]), p(f[3])) ? null
        : f[1] + ' n’est pas le milieu de [' + f[2] + f[3] + ']';
    case 'rect':
      return P.perp(p(f[2]), p(f[1]), p(f[2]), p(f[3])) ? null
        : 'le triangle ' + f[1] + f[2] + f[3] + ' n’est pas rectangle en ' + f[2];
    case 'cercle': {
      const L = f[2].split('').map(p);
      return P.cocycliques(p(f[1]), L) ? null
        : 'les points ' + f[2] + ' ne sont pas à égale distance de ' + f[1];
    }
    case 'prop': {
      // Les trois rapports annoncés doivent être VRAIMENT égaux, mesurés sur
      // les coordonnées : AB/CD = EF/GH s'y lit AB²·GH² = CD²·EF².
      const paires = [f[1], f[2], f[3]].map(x => x.split('|'));
      for (let i = 1; i < paires.length; i++) {
        const [a, b] = paires[0], [c, d] = paires[i];
        if (!P.memeRapport(p(a[0]), p(a[1]), p(b[0]), p(b[1]),
                           p(c[0]), p(c[1]), p(d[0]), p(d[1]))) {
          return 'le rapport ' + c + '/' + d + ' ne vaut pas ' + a + '/' + b;
        }
      }
      return null;
    }
    // UN QUADRILATÈRE SE VÉRIFIE DANS SON ORDRE. ABCD parallélogramme, c'est
    // [AC] et [BD] de même milieu — jamais [AB] et [CD]. Prendre les sommets
    // dans le désordre en ferait un autre quadrilatère, souvent croisé.
    case 'pgram': {
      const [A, B, C, D] = f[1].split('');
      return F.memesPoints(F.milieu(p(A), p(C)), F.milieu(p(B), p(D))) ? null
        : f[1] + ' n’est pas un parallélogramme';
    }
    case 'rect4': {
      const [A, B, C, D] = f[1].split('');
      if (!F.memesPoints(F.milieu(p(A), p(C)), F.milieu(p(B), p(D))))
        return f[1] + ' n’est pas un parallélogramme, donc pas un rectangle';
      return P.perp(p(B), p(A), p(B), p(C)) ? null
        : f[1] + ' n’a pas d’angle droit en ' + B;
    }
    case 'losange': {
      const [A, B, C, D] = f[1].split('');
      if (!F.memesPoints(F.milieu(p(A), p(C)), F.milieu(p(B), p(D))))
        return f[1] + ' n’est pas un parallélogramme, donc pas un losange';
      return F.qEgaux(P.carre(p(A), p(B)), P.carre(p(B), p(C))) ? null
        : f[1] + ' n’a pas deux côtés consécutifs égaux';
    }
    case 'gravite': {
      const [A, B, C] = f[2].split('');
      return F.memesPoints(p(f[1]), P.centreGravite(p(A), p(B), p(C))) ? null
        : f[1] + ' n’est pas le centre de gravité de ' + f[2];
    }
    case 'ortho': {
      const [A, B, C] = f[2].split('');
      const h = P.orthocentre(p(A), p(B), p(C));
      return (h && F.memesPoints(p(f[1]), h)) ? null
        : f[1] + ' n’est pas l’orthocentre de ' + f[2];
    }
    case 'sym':
      return P.estMilieu ? (F.memesPoints(F.milieu(p(f[1]), p(f[2])), p(f[3])) ? null
        : f[1] + ' n’est pas le symétrique de ' + f[2] + ' par rapport à ' + f[3]) : null;
    // UNE RELATION ENTRE RAPPORTS, RECALCULÉE. Chaque rapport se lit sur les
    // coordonnées : (AB/CD)² = AB²/CD², et l'on n'accepte que si la racine en
    // est rationnelle — sinon la somme ou le produit annoncés n'auraient pas
    // de sens exact, et l'on refuse plutôt que d'approcher.
    case 'relation': {
      const parts = f[2].split(';').map(x => x.split('|'));
      let acc = (f[1] === 'produit') ? F.Q1 : F.Q0;
      for (const [A, B2, C, D] of parts) {
        const r = F.racQ(F.qDiv(P.carre(p(A), p(B2)), P.carre(p(C), p(D))));
        if (r === null) return 'le rapport ' + A + B2 + '/' + C + D + ' n’est pas rationnel';
        acc = (f[1] === 'produit') ? F.qMul(acc, r) : F.qAdd(acc, r);
      }
      const v = lireQ(f[3]);
      return F.qEgaux(acc, v) ? null
        : 'la relation vaut ' + acc.n + '/' + acc.d + ' et non ' + f[3];
    }
    // DEUX ANGLES ANNONCÉS ÉGAUX LE SONT-ILS ? Le cosinus de chacun se lit
    // sur les coordonnées, et l'on compare sans jamais approcher.
    case 'angles': {
      const [A, S1, B2] = f[1].split(''), [C, T, D] = f[2].split('');
      return P.memeAngle(p(A), p(S1), p(B2), p(C), p(T), p(D)) ? null
        : 'les angles ' + f[1] + ' et ' + f[2] + ' ne sont pas de même mesure';
    }
    // UN RAPPORT ANNONCÉ SE RECALCULE. « AD/AB = 2/5 » se lit sur les
    // coordonnées : AD²/AB² doit valoir (2/5)², et sa racine être ce rapport.
    case 'rapport': {
      const [H, B2] = f[1].split('|');
      const vrai = F.racQ(F.qDiv(P.carre(p(H[0]), p(H[1])), P.carre(p(B2[0]), p(B2[1]))));
      if (vrai === null) return 'le rapport ' + f[1] + ' n’est pas rationnel';
      const dit2 = lireQ(f[2]);
      return F.qEgaux(vrai, dit2) ? null
        : 'le rapport ' + f[1] + ' vaut ' + vrai.n + '/' + vrai.d
          + ' et non ' + f[2];
    }
    // UN PÉRIMÈTRE SE REFAIT COMME UNE LONGUEUR : on additionne les côtés
    // lus sur les coordonnées, et l'on compare au carré annoncé.
    case 'perimetre': {
      const s2 = f[1].split('');
      let somme = F.q(0);
      for (let i = 0; i < s2.length; i++) {
        const L = F.racQ(P.carre(p(s2[i]), p(s2[(i + 1) % s2.length])));
        if (L === null) return 'un côté de ' + f[1] + ' n’a pas de longueur rationnelle';
        somme = F.qAdd(somme, L);
      }
      const vrai = F.qMul(somme, somme);
      return F.qEgaux(vrai, lireQ(f[2])) ? null
        : 'le périmètre de ' + f[1] + ' vaut ' + F.ecrireRacine(vrai).replace(/<[^>]+>/g, '')
          + ' et non ' + F.ecrireRacine(lireQ(f[2])).replace(/<[^>]+>/g, '');
    }
    case 'aligne':
      return F.aligne(p(f[1]), p(f[2]), p(f[3])) ? null
        : f[1] + ', ' + f[2] + ', ' + f[3] + ' ne sont pas alignés';
    default: return 'fait de type inconnu : ' + f[0];
  }
}

function verifierBrut(brut) {
  const probs = [];
  const c = brut.controle;
  if (!c || c.type !== 'thales') { probs.push('نوع غير معروف'); return probs; }
  let S;
  try { S = rebatir(c); } catch (e) { probs.push('scène illisible: ' + e.message); return probs; }

  // 1. LES HYPOTHÈSES ELLES-MÊMES. Un énoncé peut mentir aussi.
  for (const h of c.hyp) {
    let m; try { m = verifierFait(h, S); } catch (e) { m = 'exception: ' + e.message; }
    if (m) probs.push('المعطى لا يوافق الرّسم : ' + m);
  }

  // 2. CHAQUE PAS. Sa conclusion doit être vraie, et ses prémisses doivent
  //    déjà être acquises — sinon la démonstration tourne en rond.
  const acquis = new Set(c.hyp.map(R.cleFait));
  for (const pas of c.etapesCalcul) {
    relations++;
    const regle = R.REGLES.find(r => r.cle === pas.regle);
    if (!regle) probs.push('قاعدة خارج الكتالوغ : ' + pas.regle);
    // 2 bis. LA RÈGLE CITÉE DOIT VRAIMENT DONNER CETTE CONCLUSION.
    //
    // Contrôler que la règle existe et que la conclusion est vraie ne suffit
    // pas : on peut invoquer Pythagore pour justifier un pas de Thalès, et
    // tout reste vrai. Le nom du théorème serait alors décoratif. On rejoue
    // donc la règle sur les SEULES prémisses citées, et l'on exige qu'elle
    // produise d'elle-même la conclusion annoncée.
    else {
      let sort = [];
      try { sort = regle.chercher(c.ctx || {}, R.tables(pas.depuis.map(desec))); }
      catch (e) { sort = []; }
      const vise = R.cleFait(desec(pas.fait));
      if (!sort.some(x => R.cleFait(x.but) === vise)) {
        probs.push('القاعدة لا تعطي هذا الاستنتاج : ' + pas.regle
          + ' ← ' + pas.fait.join(' '));
      }
    }
    for (const d of pas.depuis) {
      if (!acquis.has(R.cleFait(d))) {
        probs.push('مقدّمة غير مكتسبة : ' + d.join(' '));
      }
      let m; try { m = verifierFait(d, S); } catch (e) { m = 'exception: ' + e.message; }
      if (m) probs.push('مقدّمة فاسدة : ' + m);
    }
    let m; try { m = verifierFait(pas.fait, S); } catch (e) { m = 'exception: ' + e.message; }
    if (m) probs.push('استنتاج فاسد في ' + pas.regle + ' : ' + m);
    acquis.add(R.cleFait(pas.fait));
  }
  controles++;

  // 3. LA CONCLUSION EST BIEN CELLE QU'ON DEMANDAIT.
  const but = c.but, ouvert = but[but.length - 1] === null;
  const dernier = c.etapesCalcul.length
    ? c.etapesCalcul[c.etapesCalcul.length - 1].fait : null;
  if (!dernier) probs.push('بلا استنتاج');
  else if (ouvert) {
    if (dernier[0] !== but[0] || dernier[1] !== but[1]) {
      probs.push('النتيجة لا تخصّ المطلوب : ' + dernier[1] + ' بدل ' + but[1]);
    }
  } else if (R.cleFait(dernier) !== R.cleFait(but)) {
    probs.push('النتيجة لا توافق المطلوب');
  }

  // 4. LE BUT N'ÉTAIT PAS DÉJÀ DONNÉ. Une question dont la réponse est dans
  //    l'énoncé n'est pas une question.
  if (c.hyp.some(h => h[0] === but[0] && h[1] === but[1])) {
    probs.push('المطلوب معطى في النصّ');
  }

  // 5. AUCUN RADICAL À L'AIR LIBRE.
  //
  // Le contrôle vérifiait les mathématiques, pas le rendu — et « 3√13 » s'est
  // affiché « 13√3 » pendant toute une passe sans qu'il bronche. Un chiffre
  // est de sens fort, « √ » est neutre : hors d'un îlot dir="ltr", l'arabe
  // range les morceaux chacun de son côté, et le nombre change. On retire
  // donc tous les îlots du rendu, et l'on exige qu'il ne reste plus un seul
  // radical dans ce qui subsiste.
  for (const bout of [...brut.enonce, ...brut.etapes.map(e => e[1])]) {
    if (bout && typeof bout === 'object') continue;
    const rendu = F.rendreMath(bout);
    const nu = String(rendu)
      .replace(/<span class="frac" dir="ltr">[\s\S]*?<\/span><\/span>/g, '')
      .replace(/<span dir="ltr"[^>]*>[\s\S]*?<\/span>/g, '');
    if (nu.includes('√')) probs.push('جذر خارج جزيرة لاتينية : ' + String(bout).slice(0, 40));
  }

  // 5 bis. AUCUNE VALEUR APPROCHÉE — on relit ce qui est écrit.
  //
  // Les feuilles concluent parfois « إذن AN ≈ ..... » ; ici, jamais. Le
  // contrôle ne se contente pas de le promettre : il REPARSE chaque longueur
  // affichée — décimale, fraction ou radical — et exige qu'elle vaille très
  // exactement la valeur portée par les coordonnées. Un arrondi, une
  // troncature, un chiffre perdu ne passent pas le retour.
  for (const h of [...c.hyp, ...c.etapesCalcul.map(x => x.fait)]) {
    if (h[0] !== 'lg2' || h[2] === null) continue;
    const exact = lireQ(h[2]);
    for (const mode of ['donnee', null]) {
      const ecrit = F.ecrireRacine(exact, mode);
      let relu;
      try { relu = relire(ecrit); } catch (e) { relu = null; }
      if (relu === null) { probs.push('كتابة غير قابلة للقراءة : ' + h[1]); continue; }
      if (!F.qEgaux(relu, exact)) {
        probs.push('قيمة تقريبية : ' + h[1] + ' مكتوبة ' + ecrit.replace(/<[^>]+>/g, ' ')
          + ' بينما القيمة ' + exact.n + '/' + exact.d);
      }
    }
  }

  // 5 ter. LA RÉDACTION DE THALÈS, MOT POUR MOT.
  //
  // « ne pas préciser le triangle ou le parallélisme donne une réponse fausse
  // automatiquement, et la note est systématiquement 0. » Ce n'est donc pas
  // une question de présentation : une application de Thalès qui ne nomme pas
  // sa configuration n'est pas une démonstration. On relit le texte produit et
  // l'on exige d'y trouver, pour chaque application, le triangle, la parallèle
  // et les deux appartenances.
  {
    const tout = brut.etapes.map(e => e[0] + ' ' + e[1]).join('\n');
    for (const r of c.redactions || []) {
      if (!tout.includes('في المثلّث ' + r.tri)) {
        probs.push('تحرير ناقص : المثلّث ' + r.tri + ' غير مذكور');
      }
      if (r.para && !tout.includes(r.para) && !tout.includes(r.para.replace(' // ', ' // '))) {
        probs.push('تحرير ناقص : التوازي ' + r.para + ' غير مذكور');
      }
      for (const s of r.sur || []) {
        if (!tout.includes(s)) probs.push('تحرير ناقص : الانتماء ' + s + ' غير مذكور');
      }
    }
  }

  // 5 quater. LE CHOIX DE L'ITINÉRAIRE EST UNE AFFIRMATION, DONC IL SE VÉRIFIE.
  //
  // « Pourquoi pas Pythagore ? parce qu'aucun angle droit n'est connu » : si
  // un angle droit EST connu à cet instant, la phrase est fausse et elle
  // enseigne le faux. On refait donc le décompte sur les faits réellement
  // acquis avant la question — et l'on vérifie qu'une règle dite « inutile »
  // ne sert nulle part dans la chaîne.
  {
    const MANQUE = {
      pythagore: F2 => !F2.some(x => x[0] === 'rect'),
      'pythagore-reciproque': (F2, ctx) => !(ctx.triangles || []).length,
      'relation-metrique': (F2, ctx) => !Object.keys(ctx.pieds || {}).length,
      thales: F2 => !F2.some(x => x[0] === 'para'),
      'thales-reciproque': (F2, ctx) => !(ctx.thales || []).length,
      milieux: F2 => F2.filter(x => x[0] === 'milieu').length < 2,
      'circonscrit-milieu': F2 => !F2.some(x => x[0] === 'rect'),
      'rayons-egaux': F2 => !F2.some(x => x[0] === 'cercle'),
      'centre-gravite': (F2, ctx) => !(ctx.gravites || []).length,
      'para-alternes': F2 => !F2.some(x => x[0] === 'angles')
    };
    const dansLaChaine = new Set(c.etapesCalcul.map(x => R.cleFait(x.fait)));
    for (const it of c.itineraires || []) {
      const avant = c.hyp.concat(
        c.etapesCalcul.slice(0, it.avant || 0).map(x => x.fait));
      if (it.ecartee) {
        const test = MANQUE[it.ecartee];
        if (test && !test(avant, c.ctx || {})) {
          probs.push('سبب الاستبعاد غير صحيح : ' + it.ecartee);
        }
      }
      if (it.rivale) {
        if (dansLaChaine.has(R.cleFait(it.rivale.fait))) {
          probs.push('قاعدة وُصفت بغير المفيدة و هي مستعملة : ' + it.rivale.regle);
        }
        let m; try { m = verifierFait(it.rivale.fait, S); } catch (e) { m = 'exception'; }
        if (m) probs.push('نتيجة القاعدة البديلة غير صحيحة : ' + m);
      }
    }
  }

  // 6. La forme de la fiche.
  // LE GABARIT SE RÉPÈTE, ET C'EST VOULU. Le maître réécrit la configuration
  // à CHAQUE application de Thalès — c'est même tout l'objet de sa consigne.
  // Le contrôle des étapes dupliquées ne doit donc pas porter sur ces deux
  // lignes-là ; il porte sur ce qui les suit, et deux applications réellement
  // identiques restent prises par leurs lignes de calcul.
  const GABARIT = /^(في المثلّث |و لدينا$|حسب (عكس )?نظرية طالس لنا$)/;
  const t = brut.etapes.filter(e => !GABARIT.test(e[0])).map(e => e.join(': '));
  if (new Set(t).size !== t.length) probs.push('مراحل مكرّرة');
  // La longueur, elle, se mesure sur la fiche entière — gabarit compris.
  if (brut.etapes.length < 4) probs.push('السلسلة قصيرة جدا');
  if (!brut.indice) probs.push('بلا مساعدة');
  const svg = (brut.enonce || []).find(x => x && typeof x === 'object' && x.svg);
  if (!svg) probs.push('بلا رسم');
  else {
    if ((svg.svg.match(/</g) || []).length !== (svg.svg.match(/>/g) || []).length) {
      probs.push('رسم غير متوازن');
    }
    for (const d of deborde(svg.svg)) probs.push('الرسم يتجاوز إطاره : ' + d);
  }
  return probs;
}

// 6. RIEN NE DÉPASSE DU CADRE — le contrôle né du chapitre des angles, où la
//    lettre du sommet tombait dehors parce que rien ne la mesurait.
function deborde(svg) {
  const vb = /viewBox="([-\d.\s]+)"/.exec(svg);
  if (!vb) return ['بلا viewBox'];
  const [bx, by, L, H] = vb[1].trim().split(/\s+/).map(Number);
  const g = /<g transform="translate\((-?[\d.]+) (-?[\d.]+)\)"/.exec(svg);
  const dx = g ? +g[1] : 0, dy = g ? +g[2] : 0;
  const mauvais = [];
  const voir = (x, y, rx, ry, quoi) => {
    if (x + dx - rx < bx - 0.5 || x + dx + rx > bx + L + 0.5
      || y + dy - ry < by - 0.5 || y + dy + ry > by + H + 0.5) mauvais.push(quoi);
  };
  let m;
  const seg2 = /<line[^>]*x1="(-?[\d.]+)"[^>]*y1="(-?[\d.]+)"[^>]*x2="(-?[\d.]+)"[^>]*y2="(-?[\d.]+)"/g;
  while ((m = seg2.exec(svg))) {
    voir(+m[1], +m[2], 1, 1, 'طرف مستقيم'); voir(+m[3], +m[4], 1, 1, 'طرف مستقيم');
  }
  const cer = /<circle[^>]*cx="(-?[\d.]+)"[^>]*cy="(-?[\d.]+)"[^>]*r="([\d.]+)"/g;
  while ((m = cer.exec(svg))) voir(+m[1], +m[2], +m[3], +m[3], 'نقطة');
  const txt = /<text[^>]*x="(-?[\d.]+)"[^>]*y="(-?[\d.]+)"[^>]*font-size="(\d+)"[^>]*>([^<]*)</g;
  while ((m = txt.exec(svg))) {
    const corps = +m[3], s = m[4];
    voir(+m[1], +m[2] - 4, s.length * corps * 0.36 + 2, corps * 0.8, 'كتابة « ' + s + ' »');
  }
  return [...new Set(mauvais)];
}

// ── Contre-exemples ──────────────────────────────────────────────────────
if (process.env.CONTRE_EXEMPLES) {
  const copie = x => {
    if (typeof x === 'bigint') return x;
    if (Array.isArray(x)) return x.map(copie);
    if (x && typeof x === 'object') {
      const o = {}; for (const k of Object.keys(x)) o[k] = copie(x[k]); return o;
    }
    return x;
  };
  const empreinte = x => JSON.stringify(x, (k, v) => (typeof v === 'bigint' ? v + 'n' : v));
  const cas = [];
  const NUMS = Object.keys(F.PROBLEMES).map(Number);
  // Une falsification qui ne change rien, ou qui reste vraie, ne prouve rien.
  // ON CHERCHE DANS TOUTE LA PAGE, PAS DANS UNE QUESTION SUR QUATRE. Une
  // falsification qui ne vise qu'un type de pas rare — un rapport, un partage
  // — ne le rencontrait qu'avec de la chance, et le harnais concluait
  // « AUCUNE FALSIFICATION POSSIBLE » pour un défaut d'échantillonnage. Un
  // contrôle qui dit « je n'ai pas su » quand il voulait dire « je n'ai pas
  // cherché » est pire que pas de contrôle.
  const pousse = (nom, f) => {
    for (let essai = 0; essai < 120; essai++) {
      const n = NUMS[essai % NUMS.length];
      const tir = F.tirer(n);
      if (!tir.length) continue;
      for (const brut of tir) {
        const avant = copie(brut);
        const c = copie(avant);
        try { f(c); } catch (e) { continue; }
        if (empreinte(c) === empreinte(avant)) continue;
        let probs;
        try { probs = verifierBrut(c); } catch (e) { probs = ['exception']; }
        if (probs.length) return cas.push([nom, c]);
      }
    }
    cas.push([nom + ' — AUCUNE FALSIFICATION POSSIBLE', null]);
  };

  pousse('une longueur faussée d’une unité', c => {
    const p = c.controle.etapesCalcul.find(x => x.fait[0] === 'lg2');
    const [n, d] = p.fait[2].split('/');
    p.fait[2] = (BigInt(n) + BigInt(d)) + '/' + d;
  });
  pousse('un point déplacé sur la figure', c => {
    const n = Object.keys(c.controle.points).pop();
    const [a, b] = c.controle.points[n][0].split('/');
    c.controle.points[n][0] = (BigInt(a) + BigInt(b)) + '/' + b;
  });
  pousse('Thalès pris pour Pythagore', c => {
    const p = c.controle.etapesCalcul.find(x => x.regle === 'thales');
    p.regle = 'pythagore';
  });
  pousse('une règle hors du catalogue', c => {
    c.controle.etapesCalcul[0].regle = 'similitude-des-triangles';
  });
  pousse('une prémisse jamais acquise', c => {
    c.controle.etapesCalcul[0].depuis.push(['lg2', 'ZZ', '1/1']);
  });
  pousse('le milieu qui n’en est pas un', c => {
    const p = c.controle.etapesCalcul.find(x => x.fait[0] === 'milieu')
           || { fait: c.controle.hyp.find(h => h[0] === 'milieu') };
    if (!p.fait) throw new Error('rien à fausser');
    p.fait[3] = Object.keys(c.controle.points).find(z => z !== p.fait[2] && z !== p.fait[3]);
  });
  // L'ÉGALITÉ D'ANGLES EST UNE HYPOTHÈSE COMME UNE AUTRE : elle doit se
  // recalculer. Sans cette épreuve, « ces deux angles sont égaux » serait la
  // seule phrase du chapitre que rien ne mesure — et c'est d'elle que sort le
  // parallélisme de l'ex7.
  pousse('deux angles déclarés égaux sans l’être', c => {
    const h = c.controle.hyp.find(x => x[0] === 'angles');
    if (!h) throw new Error('pas d’angles');
    const autre = Object.keys(c.controle.points).find(z => !h[2].includes(z));
    if (!autre) throw new Error('pas de point libre');
    h[2] = h[2][0] + h[2][1] + autre;
  });
  pousse('un parallélisme inventé', c => {
    const noms = Object.keys(c.controle.points);
    c.controle.etapesCalcul[0].fait = ['para', noms[0] + noms[1], noms[1] + noms[2]];
  });
  // La règle neuve du partage extérieur doit être rejouée comme les autres :
  // c'est elle qui résout « x/(x + 3) = 45/50 », et une longueur fausse ne
  // doit pas pouvoir s'y glisser.
  pousse('le partage extérieur faussé', c => {
    const p = c.controle.etapesCalcul.find(x => x.regle === 'partage-externe');
    if (!p) throw new Error('pas de partage extérieur');
    const [n, d] = p.fait[2].split('/');
    p.fait[2] = (BigInt(n) + BigInt(d)) + '/' + d;
  });
  // L'ALGÈBRE DES RAPPORTS DOIT SE RECALCULER COMME LE RESTE : une valeur
  // fausse glissée dans « AD/AB = 2/5 » se propagerait à tout l'exercice, car
  // c'est d'elle que sortent ensuite les longueurs.
  pousse('un rapport faussé', c => {
    const p = c.controle.etapesCalcul.find(x => x.fait[0] === 'rapport');
    if (!p) throw new Error('pas de rapport');
    const [n, d] = String(p.fait[2]).split('/');
    p.fait[2] = (BigInt(n) + BigInt(d)) + '/' + d;
  });
  pousse('la réponse annoncée changée', c => {
    const d = c.controle.etapesCalcul[c.controle.etapesCalcul.length - 1];
    d.fait = ['lg2', 'AB', '99999/1'];
  });
  pousse('le but glissé dans les données', c => {
    c.controle.hyp.push(['lg2', c.controle.but[1], '1/1']);
  });
  // LE RENDU D'HIER, REJOUÉ. Les autres falsifications abîment des données ;
  // celle-ci abîme le RENDEUR, parce que c'est là qu'était le défaut : la
  // ligne était rendue telle quelle dès qu'une fraction s'y trouvait, et
  // « 7√10 » sortait « 10√7 ». Sans cette épreuve, le contrôle nº 5 serait un
  // contrôle que rien n'a jamais mis à l'épreuve.
  {
    const vrai = F.rendreMath;
    const ancien = s => (s && typeof s === 'object' && s.svg) ? s.svg
      : (/<span class="frac"|<svg/.test(String(s)) ? String(s)
        : (F.ARABE.test(String(s)) ? F.isoMixte(s) : F.bloc(s)));
    let vu = null;
    for (let essai = 0; essai < 120 && !vu; essai++) {
      const n = NUMS[essai % NUMS.length];
      const lot = F.tirer(n);
      for (const b of lot) {
        if (!b.etapes.some(e => /<span class="frac"/.test(String(e[1])))) continue;
        F.rendreMath = ancien;
        let probs; try { probs = verifierBrut(b); } catch (e) { probs = ['exception']; }
        F.rendreMath = vrai;
        if (probs.length) { vu = probs; break; }
      }
    }
    cas.push(['le rendu qui renonce devant une fraction',
              vu ? { __deja: vu } : null]);
  }
  // LE « ≈ » DE LA FEUILLE, REJOUÉ. On remplace l'écriture exacte par une
  // valeur arrondie à deux décimales — ce que font les figures 4, 5 et 6 de
  // « النشاط الثالث » — et l'on exige que le contrôle le refuse.
  {
    const vrai = F.ecrireRacine;
    const arrondi = (c2, mode) => {
      const v = Math.sqrt(Number(c2.n) / Number(c2.d));
      return Number.isInteger(v) ? vrai(c2, mode) : v.toFixed(2).replace('.', ',');
    };
    let vu = null;
    for (let essai = 0; essai < 120 && !vu; essai++) {
      const lot = F.tirer(NUMS[essai % NUMS.length]);
      for (const b of lot) {
        F.ecrireRacine = arrondi;
        let probs; try { probs = verifierBrut(b); } catch (e) { probs = ['exception']; }
        F.ecrireRacine = vrai;
        if (probs.some(x => /تقريبية|قابلة للقراءة/.test(x))) { vu = probs; break; }
      }
    }
    cas.push(['une réponse arrondie à deux décimales', vu ? { __deja: vu } : null]);
  }
  // L'ORDRE DES SOMMETS N'EST PAS DÉCORATIF. « ABCD » parallélogramme et
  // « ABDC » parallélogramme ne disent pas la même chose : le second est
  // croisé. Une permutation doit donc être refusée.
  pousse('un quadrilatère nommé dans le désordre', c => {
    const p2 = c.controle.etapesCalcul.find(x => /pgram|rect4|losange/.test(x.fait[0]));
    if (!p2) throw new Error('rien à permuter');
    const q = p2.fait[1];
    p2.fait[1] = q[0] + q[1] + q[3] + q[2];
  });
  pousse('un centre de gravité déplacé', c => {
    const p2 = c.controle.etapesCalcul.find(x => x.fait[0] === 'gravite');
    if (!p2) throw new Error('rien à fausser');
    p2.fait[1] = p2.fait[2][0];
  });
  // Une relation entre rapports doit se refuser dès qu'un seul rapport bouge.
  pousse('la relation faussée', c => {
    const p2 = c.controle.etapesCalcul.find(x => x.fait[0] === 'relation');
    if (!p2) throw new Error('pas de relation');
    p2.fait[3] = '2/1';
  });
  // LA CONSIGNE DU MAÎTRE, MISE À L'ÉPREUVE. « Ne pas préciser le triangle
  // ou le parallélisme donne une réponse fausse automatiquement, et la note
  // est systématiquement 0. » Une correction amputée de l'un ou de l'autre
  // doit donc être refusée ici — sinon la fiche produirait des copies à zéro.
  pousse('la rédaction sans le nom du triangle', c => {
    const i = c.etapes.findIndex(e => /^في المثلّث /.test(e[0]));
    if (i < 0) throw new Error('pas de rédaction de Thalès');
    c.etapes[i] = ['نطبّق', c.etapes[i][1]];
  });
  pousse('la rédaction sans le parallélisme ni les appartenances', c => {
    const i = c.etapes.findIndex(e => /^في المثلّث /.test(e[0]) && / \/\/ /.test(e[1]));
    if (i < 0) throw new Error('pas de rédaction de Thalès');
    c.etapes[i] = [c.etapes[i][0], 'لدينا المعطيات'];
  });
  // Une raison d'écarter qui n'est pas vraie enseigne le faux : on la
  // fabrique, et l'on exige le refus.
  pousse('une raison d’écarter qui est fausse', c => {
    const it = (c.controle.itineraires || [])[0];
    if (!it) throw new Error('pas d’itinéraire');
    it.ecartee = 'thales';
    it.rivale = null;
  });
  pousse('étape dupliquée', c => { c.etapes[2] = c.etapes[1].slice(); });
  pousse('chaîne tronquée', c => { c.etapes = c.etapes.slice(0, 3); });
  pousse('aide absente', c => { c.indice = ''; });
  pousse('figure retirée', c => {
    c.enonce = c.enonce.filter(x => !(x && typeof x === 'object' && x.svg));
  });
  pousse('le cadre rogné de vingt pixels', c => {
    const f = c.enonce.find(x => x && typeof x === 'object' && x.svg);
    f.svg = f.svg.replace(/viewBox="([-\d.]+) ([-\d.]+) ([\d.]+) ([\d.]+)"/,
      (m0, a, b, w, h) => 'viewBox="' + a + ' ' + b + ' ' + w + ' ' + (+h - 20) + '"');
  });

  // UNE FALSIFICATION QU'ON N'A PAS SU FABRIQUER N'EST PAS UNE RÉUSSITE.
  // Comptée comme telle, elle disait « rejeté » alors que le contrôle n'avait
  // jamais été mis à l'épreuve — c'est ainsi que le nom du théorème est resté
  // décoratif pendant une passe entière.
  let bon = 0;
  for (const [nom, q] of cas) {
    if (!q) { console.log('⚠ NON ÉPROUVÉ ' + nom); continue; }
    let probs;
    if (q.__deja) probs = q.__deja;              // épreuve déjà jouée sur place
    else try { probs = verifierBrut(q); } catch (e) { probs = ['exception: ' + e.message]; }
    console.log((probs.length ? '✗ rejeté  ' : '⚠ ACCEPTÉ ') + nom
      + (probs.length ? ' — ' + String(probs[0]).slice(0, 78) : ''));
    if (probs.length) bon++;
  }
  console.log('\n' + bon + '/' + cas.length + ' falsifications détectées.');
  process.exit(bon === cas.length ? 0 : 1);
}

// ── La passe ordinaire ───────────────────────────────────────────────────
let mauvais = 0, questions = 0;
const formes = {};
for (const n of Object.keys(F.PROBLEMES)) {
  const def = F.PROBLEMES[n];
  formes[n] = new Set();
  const ennuis = [];
  for (let t = 0; t < N; t++) {
    let lot;
    try { lot = F.tirer(n); } catch (e) { ennuis.push(['?', ['exception: ' + e.message]]); continue; }
    if (lot.length < def.questions) ennuis.push([def.titre, ['الصفحة ناقصة']]);
    for (const b of lot) {
      questions++;
      formes[n].add(JSON.stringify(b.etapes));
      let probs;
      try { probs = verifierBrut(b); } catch (e) { probs = ['exception: ' + e.message]; }
      if (probs.length) { ennuis.push([b.source, probs]); mauvais++; }
    }
  }
  const t = 'ex' + n + ' — ' + def.titre;
  console.log(t.padEnd(52) + (ennuis.length ? '✗' : '✓') + '  ('
    + formes[n].size + ' صيغة)');
  for (const [src, probs] of ennuis.slice(0, 4)) {
    console.log('    ' + src);
    probs.slice(0, 3).forEach(p => console.log('      - ' + p));
  }
}
console.log('\n' + N + ' tirages, ' + questions + ' questions, ' + relations
  + ' pas de raisonnement refaits, ' + faits + ' affirmations recalculées sur les coordonnées, '
  + controles + ' contrôles, ' + (mauvais ? mauvais + ' ERREURS.' : '0 erreur.'));
process.exit(mauvais ? 1 : 0);
