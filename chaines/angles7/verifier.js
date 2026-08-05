// Valide toutes les chaînes de la fiche sur un grand nombre de tirages.
//   node verifier.js [tirages]
//   CONTRE_EXEMPLES=1 node verifier.js
//
// DEUX RÉGIMES, ET IL FAUT LES DISTINGUER. C'est la seule fiche du lot où
// tout ne peut pas être exact, et le taire serait pire que la limite elle-même.
//
//   L'ARITHMÉTIQUE EST EXACTE. Chaque mesure qu'une règle calcule est
//   RECALCULÉE ici, en rationnels de degrés, à partir des prémisses que la
//   chaîne invoque. « متتامّتان » veut dire somme 90 et rien d'autre ; un
//   منصّف partage en deux parts égales ; Chasles ajoute. Aucun arrondi.
//
//   LA FIGURE EST APPROCHÉE, et contrôlée comme telle. Elle est tracée par
//   cosinus et sinus — cos 35° n'est pas rationnel, et prétendre le contraire
//   serait mentir sur ce qu'on vérifie. On remesure donc chaque angle DESSINÉ
//   et l'on exige qu'il colle à sa valeur annoncée à un demi-degré près : une
//   figure tracée à 40° sous un texte qui dit 35° est refusée.
//
// Contrôlé en plus, sur chaque question :
//   – les données de l'énoncé sont cohérentes entre elles ;
//   – aucune mesure négative, aucune au-delà de 180° ;
//   – la dernière étape annonce bien la mesure demandée ;
//   – aucune étape dupliquée, et l'aide est présente.
const F = require('./noyau.js');
const R = require('./regles.js');
const C = require('./chaines.js');
const I = require('./items.js');
require('./gens.js');

const TIRAGES = Number(process.argv[2]) || 60;
const TOLERANCE = 0.5;                       // degrés, sur le DESSIN seulement
let questions = 0, relations = 0, controles = 0, dessins = 0;
const echecs = [];

const lireQ = t => {
  const [n, d] = String(t).split('/');
  return F.q(BigInt(n), BigInt(d === undefined ? 1 : d));
};

// ── Refaire un pas de raisonnement ───────────────────────────────────────
//
// On ne relit pas la conclusion : on la recalcule à partir des prémisses que
// l'étape déclare, avec la règle qu'elle nomme. Une règle mal écrite dans le
// catalogue produirait ici un écart, et il serait vu.
function refaire(pas, ctx) {
  const m = i => lireQ(pas.depuis[i][2]);
  const mesures = pas.depuis.filter(d => d[0] === 'mes').map(d => lireQ(d[2]));
  switch (pas.regle) {
    case 'complementaires': return F.qSub(F.DROIT, mesures[0]);
    case 'supplementaires': return F.qSub(F.PLAT, mesures[0]);
    case 'opposees-sommet':
    case 'egales': return mesures[0];
    case 'bissectrice': {
      // Ou bien on descend du tout à la moitié, ou bien on remonte.
      const tout = pas.depuis.find(d => d[0] === 'bis')[2];
      return (pas.depuis.find(d => d[0] === 'mes')[1] === tout)
        ? F.qDiv(mesures[0], F.q(2)) : F.qMul(mesures[0], F.q(2));
    }
    case 'chasles': {
      const adj = pas.depuis.find(d => d[0] === 'adj');
      const trio = ctx.adjacences.find(t =>
        (t[0] === adj[1] && t[1] === adj[2]) || (t[0] === adj[2] && t[1] === adj[1]));
      if (!trio) return null;
      const dits = {};
      pas.depuis.filter(d => d[0] === 'mes').forEach(d => { dits[d[1]] = lireQ(d[2]); });
      // le total est le troisième du trio : somme si on le cherche, différence
      // sinon
      if (pas.angle === trio[2]) return F.qAdd(dits[trio[0]], dits[trio[1]]);
      const autre = (pas.angle === trio[0]) ? trio[1] : trio[0];
      return F.qSub(dits[trio[2]], dits[autre]);
    }
    case 'somme-triangle':
      return F.qSub(F.PLAT, F.qAdd(mesures[0], mesures[1]));
    default: return null;
  }
}

// ── Remesurer la figure ──────────────────────────────────────────────────
function angleDessine(c, nom) {
  const d = F.decoupe(nom);
  if (c.rayons) {
    if (d.O !== c.sommet) return null;
    const r1 = c.rayons.find(r => r.nom === d.a), r2 = c.rayons.find(r => r.nom === d.b);
    if (!r1 || !r2) return null;
    let e = Math.abs(r1.deg - r2.deg) % 360;
    return e > 180 ? 360 - e : e;
  }
  if (c.sommets) {
    const P = c.sommets;
    if (!P[d.a] || !P[d.O] || !P[d.b]) return null;
    const u = [P[d.a][0] - P[d.O][0], P[d.a][1] - P[d.O][1]];
    const v = [P[d.b][0] - P[d.O][0], P[d.b][1] - P[d.O][1]];
    const cos = (u[0] * v[0] + u[1] * v[1])
              / (Math.hypot(u[0], u[1]) * Math.hypot(v[0], v[1]));
    return Math.acos(Math.max(-1, Math.min(1, cos))) * F.R;
  }
  return null;
}

function verifierBrut(brut) {
  const probs = [];
  const c = brut.controle;
  if (!c || c.type !== 'angles') { probs.push('نوع غير معروف'); return probs; }

  // 1. L'arithmétique, exacte.
  const connues = {};
  for (const h of c.hyp) if (h[0] === 'mes') connues[h[1]] = h[2];
  for (const pas of c.etapesCalcul) {
    let attendu;
    try { attendu = refaire(pas, c.ctx); }
    catch (e) { probs.push('exception: ' + e.message); continue; }
    relations++;
    if (attendu === null) { probs.push('قاعدة غير معروفة: ' + pas.regle); continue; }
    const dite = lireQ(pas.mesure);
    if (!F.qEgaux(attendu, dite)) {
      probs.push('حساب فاسد في ' + pas.regle + ': '
        + F.ecrireAngle(pas.angle) + ' = ' + F.qDeg(dite)
        + ' بينما القاعدة تعطي ' + F.qDeg(attendu));
    }
    // 2. Aucune mesure absurde : ni négative, ni au-delà de l'angle plat.
    if (!F.qPos(dite) || F.qNum(dite) > 180) {
      probs.push('قيس مستحيل: ' + F.qDeg(dite));
    }
    connues[pas.angle] = dite;
  }
  controles++;

  // 3. La réponse annoncée est bien celle de l'angle demandé.
  if (!connues[c.but]) probs.push('الزاوية المطلوبة بلا قيس');
  else if (F.qDeg(connues[c.but]) !== c.reponse) {
    probs.push('النتيجة لا توافق الحساب');
  }

  // 4. LE DESSIN, à un demi-degré près. Il est approché par nature ; ce qu'on
  //    lui demande, c'est de ne pas contredire le texte.
  for (const nom of Object.keys(connues)) {
    const vu = angleDessine(c, nom);
    if (vu === null) continue;                // cet angle n'est pas sur la figure
    dessins++;
    const dit = F.qNum(connues[nom]);
    if (Math.abs(vu - dit) > TOLERANCE) {
      probs.push('الرسم لا يوافق النصّ: ' + F.ecrireAngle(nom)
        + ' مرسومة ' + vu.toFixed(1) + '° و النصّ يقول ' + dit + '°');
    }
  }

  const t = brut.etapes.map(e => e.join(': '));
  if (new Set(t).size !== t.length) probs.push('مراحل مكرّرة');
  if (t.length < 4) probs.push('السلسلة قصيرة جدا');
  if (!brut.indice) probs.push('بلا مساعدة');
  const svg = (brut.enonce || []).find(x => x && typeof x === 'object' && x.svg);
  if (!svg) probs.push('بلا رسم');
  else if ((svg.svg.match(/</g) || []).length !== (svg.svg.match(/>/g) || []).length) {
    probs.push('رسم غير متوازن');
  } else for (const d of deborde(svg.svg)) probs.push('الرسم يتجاوز إطاره: ' + d);
  return probs;
}

// 5. RIEN NE DÉPASSE DU CADRE. Le cadre suivait les rayons ; la lettre du
//    sommet, écrite en dessous, tombait dehors dès qu'aucun rayon ne
//    descendait — une fois sur deux, puisque l'éventail tourne. Le défaut
//    n'était pas dans la marge, il était dans ce que personne ne mesurait :
//    on relit donc TOUT ce que le SVG pose, traits, points et lettres.
function deborde(svg) {
  const vb = /viewBox="([-\d.\s]+)"/.exec(svg);
  if (!vb) return ['بلا viewBox'];
  const [bx, by, L, H] = vb[1].trim().split(/\s+/).map(Number);
  const g = /<g transform="translate\((-?[\d.]+)\s+(-?[\d.]+)\)"/.exec(svg);
  const dx = g ? +g[1] : 0, dy = g ? +g[2] : 0;
  const mauvais = [];
  const voir = (x, y, rx, ry, quoi) => {
    if (x + dx - rx < bx - 0.5 || x + dx + rx > bx + L + 0.5
      || y + dy - ry < by - 0.5 || y + dy + ry > by + H + 0.5) mauvais.push(quoi);
  };
  let m;
  const seg = /<line[^>]*x1="(-?[\d.]+)"[^>]*y1="(-?[\d.]+)"[^>]*x2="(-?[\d.]+)"[^>]*y2="(-?[\d.]+)"/g;
  while ((m = seg.exec(svg))) {
    voir(+m[1], +m[2], 1, 1, 'طرف مستقيم');
    voir(+m[3], +m[4], 1, 1, 'طرف مستقيم');
  }
  const cer = /<circle[^>]*cx="(-?[\d.]+)"[^>]*cy="(-?[\d.]+)"[^>]*r="([\d.]+)"/g;
  while ((m = cer.exec(svg))) voir(+m[1], +m[2], +m[3], +m[3], 'نقطة');
  // Même estimation d'encombrement qu'au tracé : si l'une bouge sans l'autre,
  // c'est ici que cela se voit.
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
      const o = {};
      for (const k of Object.keys(x)) o[k] = copie(x[k]);
      return o;
    }
    return x;
  };
  const empreinte = x => JSON.stringify(x, (k, v) => (typeof v === 'bigint' ? v + 'n' : v));
  const cas = [];
  const NUMS = Object.keys(F.PROBLEMES).map(Number);
  // Une falsification qui ne change rien, ou qui reste vraie, ne prouve rien :
  // on retire jusqu'à ce qu'elle morde, et si l'on n'y arrive jamais, on le dit.
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

  pousse('une mesure faussée d’un degré', c => {
    const p = c.controle.etapesCalcul[0];
    if (p) p.mesure = (BigInt(p.mesure.split('/')[0]) + 1n) + '/' + p.mesure.split('/')[1];
  });
  pousse('complémentaires pris pour supplémentaires', c => {
    const p = c.controle.etapesCalcul.find(x => x.regle === 'complementaires');
    if (p) p.regle = 'supplementaires';
  });
  pousse('une bissectrice qui ne partage plus en deux', c => {
    const p = c.controle.etapesCalcul.find(x => x.regle === 'bissectrice');
    if (p) p.mesure = (BigInt(p.mesure.split('/')[0]) * 3n) + '/' + p.mesure.split('/')[1];
  });
  pousse('le dessin décalé de dix degrés', c => {
    if (c.controle.rayons && c.controle.rayons.length > 1) c.controle.rayons[1].deg += 10;
  });
  pousse('la réponse annoncée changée', c => { c.controle.reponse = '999°'; });
  pousse('étape dupliquée', c => { c.etapes[2] = c.etapes[1].slice(); });
  pousse('chaîne tronquée', c => { c.etapes = c.etapes.slice(0, 3); });
  pousse('aide absente', c => { c.indice = ''; });
  pousse('figure retirée', c => {
    c.enonce = c.enonce.filter(x => !(x && typeof x === 'object' && x.svg));
  });
  // Le cadre rogné : c'est le défaut réel qu'on rejoue. La lettre du sommet
  // sortait par le bas, et rien ne s'en plaignait.
  pousse('le cadre rogné de vingt pixels', c => {
    const f = c.enonce.find(x => x && typeof x === 'object' && x.svg);
    if (f) f.svg = f.svg.replace(/viewBox="([-\d.]+) ([-\d.]+) ([\d.]+) ([\d.]+)"/,
      (m0, a, b, w, h) => 'viewBox="' + a + ' ' + b + ' ' + w + ' ' + (+h - 20) + '"');
  });

  let bon = 0;
  for (const [nom, q] of cas) {
    let probs;
    try { probs = q ? verifierBrut(q) : ['aucune falsification']; }
    catch (e) { probs = ['exception: ' + e.message]; }
    console.log((probs.length ? '✗ rejeté  ' : '⚠ ACCEPTÉ ') + nom
      + (probs.length ? ' — ' + String(probs[0]).slice(0, 74) : ''));
    if (probs.length) bon++;
  }
  console.log('\n' + bon + '/' + cas.length + ' falsifications détectées.');
  process.exit(bon === cas.length ? 0 : 1);
}

// ── La passe normale ─────────────────────────────────────────────────────
for (const n of Object.keys(F.PROBLEMES).map(Number).sort((a, b) => a - b)) {
  const def = F.PROBLEMES[n];
  let mauvais = 0;
  const formes = new Set();
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
  console.log(('ex' + n + ' — ' + def.titre).padEnd(50)
    + (mauvais ? '✗ ' + mauvais + ' échec(s)' : '✓') + '  (' + formes.size + ' صيغة)');
}

console.log();
echecs.forEach(e => console.log(e));
console.log('\n' + TIRAGES + ' tirages, ' + questions + ' questions, '
  + relations + ' pas de raisonnement refaits, ' + dessins + ' angles remesurés sur '
  + 'le dessin, ' + controles + ' contrôles, '
  + (echecs.length ? 'ÉCHECS.' : '0 erreur.'));
process.exit(echecs.length ? 1 : 0);
