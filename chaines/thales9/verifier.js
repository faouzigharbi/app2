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
const desec = f => f.map((x, i) => (f[0] === 'lg2' && i === 2 && x !== null)
  ? lireQ(x) : x);

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

  // 6. La forme de la fiche.
  const t = brut.etapes.map(e => e.join(': '));
  if (new Set(t).size !== t.length) probs.push('مراحل مكرّرة');
  if (t.length < 4) probs.push('السلسلة قصيرة جدا');
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
  const pousse = (nom, f) => {
    for (let essai = 0; essai < 120; essai++) {
      const n = NUMS[essai % NUMS.length];
      const tir = F.tirer(n);
      if (!tir.length) continue;
      const avant = copie(tir[essai % tir.length]);
      const c = copie(avant);
      try { f(c); } catch (e) { continue; }
      if (empreinte(c) === empreinte(avant)) continue;
      let probs;
      try { probs = verifierBrut(c); } catch (e) { probs = ['exception']; }
      if (probs.length) return cas.push([nom, c]);
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
  pousse('un parallélisme inventé', c => {
    const noms = Object.keys(c.controle.points);
    c.controle.etapesCalcul[0].fait = ['para', noms[0] + noms[1], noms[1] + noms[2]];
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
