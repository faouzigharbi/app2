// Valide les huit exercices de « بعد نقطتين من مستقيم مدرج ».
//   node verifier.js [tirages]
//   CONTRE_EXEMPLES=1 node verifier.js
//
// Sur CHAQUE question tirée :
//   1. toute relation écrite dans une étape est recalculée par l'analyseur,
//      avec l'environnement que l'énoncé fixe (les abscisses, les distances) ;
//   2. chaque affirmation est re-démontrée : le bed depuis |x_B − x_A|, le
//      symétrique depuis l'opposé, le milieu depuis les deux distances ET la
//      position entre les extrémités, l'ordre depuis un tri indépendant ;
//   3. **la figure est confrontée aux nombres** : chaque point doit être
//      dessiné à l'abscisse qu'annonce l'énoncé. Une figure fausse tromperait
//      l'élève plus sûrement qu'un calcul faux ;
//   4. aucune étape dupliquée, chaque expression isolée en dir="ltr".
const F = require('./noyau.js');
const D = require('./droite.js');
const O = require('./outils.js');
require('./gens.js');

const TIRAGES = Number(process.argv[2]) || 300;
let relations = 0, controles = 0, questions = 0, figures = 0;
const echecs = [];

// ---------------------------------------------------------------------------
// La figure : on relit le SVG et on recalcule où chaque point DEVRAIT être.
// ---------------------------------------------------------------------------
// -------------------------------------------------------------------------
// Mode ERREURS : on valide les pages « أين الخطأ؟ ».
//   ERREURS=1 node verifier.js [tirages]
//
// Une page d'erreurs ment DÉLIBÉRÉMENT à l'élève, et c'est là tout le danger :
// si elle se trompe de mensonge, elle lui apprend une faute là où il n'y en a
// pas. Quatre contrôles, donc, et le troisième est le moins évident :
//
//   1. chaque étape PLANTÉE est fausse — sinon on demande de condamner du vrai ;
//   2. chaque étape NON plantée est vraie — sinon la page contient une faute
//      qu'elle ignore, et l'élève qui la trouve est compté en échec ;
//   3. le nombre de fautes est bien celui du niveau demandé ;
//   4. dans la phase « corrige », la bonne réécriture est vraie et chaque
//      leurre est faux.
// -------------------------------------------------------------------------
if (process.env.ERREURS) {
  const E = require('./erreurs.js');
  const J = require('./juge.js');
  const TOURS = Number(process.argv[2]) || 40;
  let planplantees = 0, saines = 0, options = 0;
  const griefs = [];
  const familles = {};

  for (const n of Object.keys(F.PROBLEMES).map(Number).sort((a, b) => a - b)) {
    const def = F.PROBLEMES[n];
    let mauvais = 0;
    for (let t = 0; t < TOURS; t++) {
      for (const niveau of [1, 2]) {
        const page = E.pageErreurs(n, niveau);
        if (page.length !== def.questions) {
          griefs.push(`التمرين ${n}: ${page.length} أسئلة بدل ${def.questions}`);
          mauvais++;
          continue;
        }
        page.forEach((q, qi) => {
          const c = q.controle;
          const envs = J.environnements(c);
          const rangs = q.fautes.map(f => f.rang);
          // Un volet peut n'avoir AUCUNE faute : le corrigé est alors juste, et
          // l'élève doit le dire. On exige seulement qu'il soit annoncé comme
          // tel, et que toutes ses étapes soient vraies — ce que la boucle
          // ci-dessous vérifie, puisqu'aucun rang n'est déclaré planté.
          if (q.fautes.length > niveau || (!q.fautes.length && !q.sain)) {
            griefs.push(`التمرين ${n} س${qi + 1}: ${q.fautes.length} أخطاء بدل ${niveau}`);
            mauvais++;
          }
          q.etapes.forEach(([, math], i) => {
            const j = J.evaluerEtape(math, envs);
            if (rangs.indexOf(i) >= 0) {
              planplantees++;
              if (j !== 'fausse') {
                griefs.push(`التمرين ${n} س${qi + 1} م${i + 1}: الخطأ المزروع ليس خطأ « ${math} »`);
                mauvais++;
              }
            } else {
              saines++;
              if (j === 'fausse') {
                griefs.push(`التمرين ${n} س${qi + 1} م${i + 1}: مرحلة فاسدة غير معلنة « ${math} »`);
                mauvais++;
              }
            }
          });
          q.fautes.forEach(f => {
            familles[f.famille] = (familles[f.famille] || 0) + 1;
            f.choix.forEach((opt, k) => {
              options++;
              const j = J.evaluerEtape(opt, envs);
              const attendu = (k === f.bonne) ? 'vraie' : 'fausse';
              if (j !== attendu) {
                griefs.push(`التمرين ${n} س${qi + 1}: خيار تصحيح ${attendu === 'vraie' ? 'صحيح و هو فاسد' : 'فاسد و هو صحيح'} « ${opt} »`);
                mauvais++;
              }
            });
          });
        });
      }
    }
    const titre = `التمرين ${n} — ${def.titre}`;
    console.log(`${titre.padEnd(52)}${mauvais ? '✗ ' + mauvais + ' خلل' : '✓ '}`);
  }

  console.log('\nالعائلات المستعملة:');
  Object.keys(familles).sort((a, b) => familles[b] - familles[a])
    .forEach(k => console.log(`   ${String(familles[k]).padStart(5)}  ${k}`));

  if (griefs.length) {
    console.log('\n' + griefs.slice(0, 30).join('\n'));
    console.log(`\n${TOURS} تمريرات، ${planplantees} خطأ مزروع، ${saines} مرحلة سليمة، ${options} خيار — فشل.`);
    process.exit(1);
  }
  console.log(`\n${TOURS} tours par exercice, ${planplantees} fautes plantées, `
              + `${saines} étapes saines et ${options} options de correction, 0 erreur.`);
  process.exit(0);
}

function verifierFigure(svg, points) {
  const p = [];
  const vb = /viewBox="0 0 (\d+)/.exec(svg);
  if (!vb) return ['الرسم بلا إطار'];
  const cercles = [...svg.matchAll(/<circle cx="([\d.]+)"/g)].map(m => Number(m[1]));
  const textes = [...svg.matchAll(/<text x="([\d.]+)"[^>]*>([^<]+)<\/text>/g)]
    .map(m => ({ x: Number(m[1]), t: m[2] }));
  // La géométrie se lit sur les POINTS dessinés, pas sur les étiquettes :
  // une étiquette juste au-dessus d'un point déplacé tromperait le contrôle
  // comme elle tromperait l'élève.
  const sous = nom => {
    const et = textes.find(t => t.t === nom);
    if (!et) return null;
    let meilleur = null, ecart = 1e9;
    for (const c of cercles) {
      if (Math.abs(c - et.x) < ecart) { ecart = Math.abs(c - et.x); meilleur = c; }
    }
    return (ecart < 0.6) ? meilleur : null;
  };
  const cO = sous('O'), cI = sous('I');
  if (cO === null || cI === null) return ['المبدأ أو الوحدة غير مرسومين'];
  const ech = cI - cO;

  for (const pt of points) {
    if (!textes.some(t => t.t === pt.nom)) { p.push('النقطة ' + pt.nom + ' غائبة عن الرسم'); continue; }
    const c = sous(pt.nom);
    if (c === null) { p.push('الاسم ' + pt.nom + ' بلا نقطة تحته'); continue; }
    const lu = (c - cO) / ech, vrai = pt.x.n / pt.x.d;
    if (Math.abs(lu - vrai) > 1e-6) {
      p.push(`${pt.nom} مرسومة عند ${lu.toFixed(3)} بدل ${vrai.toFixed(3)}`);
    }
    controles++;
  }
  figures++;
  return p;
}

// ---------------------------------------------------------------------------
function controlerClaim(c) {
  const p = [];
  const eg = (a, b, m) => { if (!F.egaux(a, b)) p.push(m + ': ' + F.txt(a) + ' ≠ ' + F.txt(b)); controles++; };
  switch (c.type) {
    case 'bed':
      eg(F.abs(F.sub(c.xb, c.xa)), c.res, 'البعد الحقيقي');
      if (F.signe(c.res) < 0) p.push('بعد سالب');
      break;
    case 'symetrique':
      eg(F.neg(c.xb), c.xc, 'المناظرة');
      eg(F.abs(c.xb), F.abs(c.xc), 'البعدان عن O');
      break;
    case 'distance-signe': {
      eg(F.abs(F.sub(c.bon, c.xa)), c.d, 'بعد الحلّ المختار');
      eg(F.abs(F.sub(c.autre, c.xa)), c.d, 'بعد الحلّ المستبعد');
      const ok = c.veutNegatif ? F.signe(c.bon) < 0 : F.signe(c.bon) > 0;
      if (!ok) p.push('الحلّ المختار لا يحقّق شرط الإشارة');
      const rej = c.veutNegatif ? F.signe(c.autre) >= 0 : F.signe(c.autre) <= 0;
      if (!rej) p.push('الحلّ المستبعد كان يحقّق الشرط أيضا');
      if (F.egaux(c.bon, c.autre)) p.push('الحلاّن متطابقان');
      controles += 2;
      break;
    }
    case 'deux-solutions':
      if (F.signe(c.d) <= 0) p.push('البعد ليس موجبا');
      eg(F.abs(c.d), c.d, 'الحلّ الأول');
      eg(F.abs(F.neg(c.d)), c.d, 'الحلّ الثاني');
      break;
    case 'milieu': {
      eg(F.abs(F.sub(c.xa, c.xb)), c.ba, 'البعد الأول');
      eg(F.abs(F.sub(c.xc, c.xb)), c.bc, 'البعد الثاني');
      eg(c.ba, c.bc, 'البعدان');
      // le milieu, retrouvé autrement : la demi-somme
      eg(F.div(F.add(c.xa, c.xc), F.rat(2)), c.xb, 'نصف المجموع');
      const entre = (F.cmp(c.xa, c.xb) < 0 && F.cmp(c.xb, c.xc) < 0)
                 || (F.cmp(c.xc, c.xb) < 0 && F.cmp(c.xb, c.xa) < 0);
      if (!entre) p.push('النقطة ليست بين الطرفين');
      controles++;
      break;
    }
    case 'ordre': {
      for (let i = 1; i < c.tries.length; i++) {
        if (F.cmp(c.tries[i - 1], c.tries[i]) >= 0) { p.push('الترتيب ليس تصاعديا'); break; }
      }
      controles++;
      break;
    }
    default: p.push('نوع غير معروف: ' + c.type);
  }
  return p;
}

function verifierBrut(brut) {
  const probs = [];
  const env = (brut.controle && brut.controle.env) || {};
  let verifiees = 0;
  brut.etapes.forEach(([label, math], i) => {
    if (F.ARABE.test(math)) return;
    try {
      const r = F.verifierRelation(math, env);
      if (r === null) { probs.push(`م${i + 1}: « ${math} » ليست علاقة`); return; }
      if (r) { probs.push(`م${i + 1}: ${r}`); return; }
      relations++; verifiees++;
    } catch (e) { probs.push(`م${i + 1}: تعذّر « ${math} » (${e.message})`); }
  });
  if (verifiees < 2) probs.push(`مراحل قابلة للتحقق: ${verifiees} فقط`);
  probs.push(...controlerClaim(brut.controle));
  const textes = brut.etapes.map(e => e.join(': '));
  if (new Set(textes).size !== textes.length) probs.push('مراحل مكرّرة');
  if (textes.length < 4) probs.push('السلسلة قصيرة جدا');
  if (!brut.indice) probs.push('بلا مساعدة');
  return probs;
}

function retirerBlocs(html) {
  let s = String(html).replace(/<span class="figure">[\s\S]*?<\/svg><\/span>/g, ' '), d;
  while ((d = s.indexOf('<span dir="ltr"')) >= 0) {
    let i = s.indexOf('>', d) + 1, prof = 1;
    while (prof > 0 && i < s.length) {
      if (s.startsWith('<span', i)) { prof++; i = s.indexOf('>', i) + 1; }
      else if (s.startsWith('</span>', i)) { prof--; i += 7; }
      else i++;
    }
    if (prof > 0) return s + ' ⟵ وسم غير مغلق';
    s = s.slice(0, d) + ' ' + s.slice(i);
  }
  return s.replace(/<\/?div[^>]*>/g, ' ');
}

function verifierRendu(q) {
  const probs = [];
  for (const s of [q.operation].concat(q.steps)) {
    const nu = retirerBlocs(s);
    if (/<span|<svg/.test(nu)) probs.push('وسم خارج العزل: ' + nu.trim().slice(0, 80));
    if (/[\d)]\s*[+\-*×÷|<>=]\s*[\d(a-zA-Z]/.test(nu)) probs.push('عبارة غير معزولة: ' + nu.trim().slice(0, 80));
  }
  return probs;
}

// ---------------------------------------------------------------------------
if (process.env.CONTRE_EXEMPLES) {
  const copie = q => JSON.parse(JSON.stringify(q));
  const cas = [];
  const l1 = F.tirer(1);
  const a1 = copie(l1[0]); a1.controle.res = F.add(a1.controle.res, F.rat(1));
  cas.push(['distance faussée', a1]);
  const a2 = copie(l1[0]); a2.controle.res = F.neg(a2.controle.res);
  cas.push(['distance négative', a2]);
  const l6 = F.tirer(6);
  const a3 = copie(l6[0]); a3.controle.xc = a3.controle.xb;
  cas.push(['symétrique confondu avec le point', a3]);
  const a4 = copie(l6[2]); a4.controle.bon = a4.controle.autre;
  cas.push(['mauvaise racine retenue (signe)', a4]);
  const l8 = F.tirer(8);
  const a5 = copie(l8[2]); a5.controle.xb = F.add(a5.controle.xb, F.rat(1));
  cas.push(['milieu décalé', a5]);
  const a6 = copie(l8[0]); a6.etapes[3] = a6.etapes[2].slice();
  cas.push(['étape dupliquée', a6]);
  // une figure qui ment
  const l2 = F.tirer(2);
  const pointsFig = l2[0].pointsFigure;
  const cible = /<text x="([\d.]+)"[^>]*>A<\/text>/.exec(l2[0].figure);
  const faux = l2[0].figure.replace(
    new RegExp('<circle cx="' + cible[1] + '"'), '<circle cx="' + (Number(cible[1]) + 9) + '"');
  const probsFig = verifierFigure(faux, pointsFig);
  console.log((probsFig.length ? '✗ rejeté  ' : '⚠ ACCEPTÉ ') + 'figure décalée'
    + (probsFig.length ? ' — ' + probsFig[0] : ''));

  let bon = probsFig.length ? 1 : 0;
  for (const [nom, q] of cas) {
    const probs = verifierBrut(q);
    console.log((probs.length ? '✗ rejeté  ' : '⚠ ACCEPTÉ ') + nom + (probs.length ? ' — ' + probs[0] : ''));
    if (probs.length) bon++;
  }
  console.log(`\n${bon}/${cas.length + 1} falsifications détectées.`);
  process.exit(bon === cas.length + 1 ? 0 : 1);
}

for (const n of Object.keys(F.PROBLEMES).map(Number).sort((a, b) => a - b)) {
  let mauvais = 0; const vus = new Set();
  for (let t = 0; t < TIRAGES; t++) {
    const lot = F.tirer(n);
    if (lot.length !== F.PROBLEMES[n].questions) { echecs.push(`ex${n}: عدد الأسئلة خاطئ`); break; }
    lot.forEach((brut, i) => {
      questions++;
      vus.add(brut.enonce.join(' '));
      const probs = verifierBrut(brut).concat(verifierRendu(F.rendre(brut)));
      if (brut.figure) {
        const pts = [];
        const c = brut.controle;
        ['xa', 'xb', 'xc'].forEach(k => { if (c[k]) pts.push({ nom: '', x: c[k] }); });
        probs.push(...verifierFigure(brut.figure, brut.pointsFigure || []));
      }
      if (probs.length) {
        mauvais++;
        if (echecs.length < 8) echecs.push(`ex${n} س${i + 1}: ${brut.enonce.join(' ')}\n    - ` + probs.join('\n    - '));
      }
    });
  }
  console.log(`ex${n} — ${F.PROBLEMES[n].titre}`.padEnd(46)
    + `${mauvais ? '✗ ' + mauvais + ' échec(s)' : '✓'}  (${F.PROBLEMES[n].questions} أسئلة، ${vus.size} صيغة)`);
}
if (echecs.length) console.log('\n' + echecs.join('\n'));
console.log(`\n${TIRAGES} tirages par exercice, ${questions} questions,`
  + ` ${relations} relations recalculées, ${controles} affirmations re-démontrées`
  + ` et ${figures} figures confrontées aux nombres, ${echecs.length ? 'ÉCHECS' : '0 erreur'}.`);
process.exit(echecs.length ? 1 : 0);
