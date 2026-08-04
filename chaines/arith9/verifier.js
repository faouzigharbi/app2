// Valide les neuf exercices de la fiche « الحساب — القسمة و القابلية للقسمة ».
//   node verifier.js [tirages]   |   CONTRE_EXEMPLES=1 node verifier.js
//
// Le principe est le même que pour les autres chapitres : on ne LIT pas les
// générateurs, on les EXÉCUTE. Chaque étape est ré-analysée et recalculée.
//
// Ce qui change ici, c'est que l'élève, lui, ne calcule jamais : il factorise
// et il déduit. Le validateur, lui, a le droit de calculer — et il s'en sert.
// « 2^2011 - 2^2008 = -7 × 2^2008 » est vérifié sur les 606 chiffres, en
// BigInt, exactement. Une factorisation dont le signe a glissé, un cofacteur
// faux, un diviseur annoncé qui ne divise pas : rien de tout cela ne passe.
// Et pour les affirmations vraies/fausses, le validateur re-décide lui-même
// de la vérité avant de la comparer à celle qu'annonce la chaîne.
const F = require('./noyau.js');
const C = require('./criteres.js');
const P = require('./puissances.js');
require('./gens.js');

const TIRAGES = Number(process.argv[2]) || 60;
let relations = 0, controles = 0, questions = 0;
const echecs = [];

const pgcdN = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; };
const estPremier = n => {
  if (n < 2) return false;
  for (let k = 2; k * k <= n; k++) if (n % k === 0) return false;
  return true;
};
const memeListe = (a, b) => a.length === b.length
  && a.slice().sort((x, y) => x - y).join(',') === b.slice().sort((x, y) => x - y).join(',');

// -------------------------------------------------------------------------
// Les environnements dans lesquels chaque étape doit se vérifier.
// La plupart des chaînes ne portent aucune lettre : leur environnement est
// vide, et l'étape doit tenir telle quelle. Celles qui en portent une doivent
// tenir POUR TOUTES ses valeurs — ce sont des identités.
// -------------------------------------------------------------------------
const LETTRES = ['n', 'x', 'y', 'a', 'b', 'k', 'm', 'p', 'q', 'z'];

function envAleatoire(eviter) {
  const e = {};
  LETTRES.forEach(l => {
    let v;
    do { v = F.ent(1, 30); } while (eviter !== undefined && v === eviter);
    e[l] = F.rat(v);
  });
  return e;
}

// Une chaîne peut nommer son expression — « M = 6 + 32/(n + 2) ». Le nom n'est
// pas une variable libre : il DÉSIGNE l'expression de l'énoncé, et c'est elle
// qui lui donne sa valeur dans chaque environnement.
function nommer(c, e) {
  if (c.nom) e[c.nom] = F.analyser(c.source, e);
  return e;
}

function environnements(c) {
  if (c.type === 'valeur') {
    const e = envAleatoire();
    e[c.variable || 'n'] = F.rat(c.x0);
    return [nommer(c, e)];
  }
  return Array.from({ length: 12 }, () => nommer(c, envAleatoire(c.eviter)));
}

// -------------------------------------------------------------------------
// Le contrôle du CLAIM : ce que l'exercice affirme est-il vrai ?
// -------------------------------------------------------------------------
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

function verifierIdentites(c, p) {
  (c.identites || []).forEach(([g, d]) => {
    for (const env of [envAleatoire(), envAleatoire()]) {
      let vg, vd;
      try { vg = F.analyser(g, env); vd = F.analyser(d, env); }
      catch (e) { p.push('تعذّر تحليل « ' + g + ' » أو « ' + d + ' »: ' + e.message); return; }
      if (!F.egaux(vg, vd)) { p.push('« ' + g + ' » ≠ « ' + d + ' »'); return; }
      controles++;
    }
  });
}

function verite(v) {
  switch (v.kind) {
    case 'coprimeToujours': {
      for (let n = 1; n <= 30; n++) {
        const e = { n: F.rat(n) };
        const g = Number(F.analyser(v.e1, e).n), d = Number(F.analyser(v.e2, e).n);
        if (pgcdN(g, d) !== 1) return false;
      }
      return true;
    }
    case 'pgcdVaut': return pgcdN(v.a, v.b) === v.attendu;
    case 'premierToujours': {
      for (let n = v.de; n <= v.a; n++) {
        if (!estPremier(Number(F.analyser(v.expr, { n: F.rat(n) }).n))) return false;
      }
      return true;
    }
    case 'resteToujours': {
      for (let y = 0; y <= 30; y++) {
        if (Number(F.reste(F.analyser(v.expr, { y: F.rat(y) }), v.d)) !== v.r) return false;
      }
      return true;
    }
    case 'divisibleToujours': {
      for (let n = -20; n <= 20; n++) {
        if (!F.divise(v.d, F.analyser(v.expr, { n: F.rat(n) }))) return false;
      }
      return true;
    }
    case 'consecutifs': {
      for (let n = 1; n <= 7; n++) {
        if ((n * 100 + (n + 1) * 10 + (n + 2)) % v.d !== 0) return false;
      }
      return true;
    }
    case 'resteNombre': return v.N % v.d === v.r;
    case 'motifChiffre': {
      for (let a = 0; a <= 9; a++) {
        if ((v.tete * 100 + a * 10 + v.dernier) % v.d !== 0) return false;
      }
      return true;
    }
    default: throw new Error('vérification inconnue: ' + v.kind);
  }
}

function controlerClaim(c) {
  const p = [];
  verifierIdentites(c, p);

  if (c.type === 'divisible') {
    const val = F.analyser(c.expr);
    if (!F.estEntier(val)) p.push('العدد ليس صحيحا');
    else if (!F.divise(c.d, val)) p.push('العدد لا يقبل القسمة على ' + c.d);
    // le diviseur annoncé doit apprendre quelque chose : 1 ne compte pas
    if (c.d < 2) p.push('القاسم تافه');
    controles++;

  } else if (c.type === 'ensemble') {
    const vrais = [];
    for (let n = 0; n < c.domaine; n++) {
      if (F.divise(c.d, F.analyser(c.expr, { n: F.rat(n) }))) vrais.push(n);
      controles++;
    }
    if (!memeListe(vrais, c.trouves)) {
      p.push('مجموعة الحلول: وجدنا ' + vrais.join(';') + ' و أُعلن ' + c.trouves.join(';'));
    }
    if (!vrais.length) p.push('لا حلّ: التمرين بلا معنى');

  } else if (c.type === 'identite') {
    for (let i = 0; i < 20; i++) {
      const e = envAleatoire(c.eviter);
      if (!F.egaux(F.analyser(c.gauche, e), F.analyser(c.droite, e))) {
        p.push('« ' + c.gauche + ' » ≠ « ' + c.droite + ' »'); break;
      }
      controles++;
    }

  } else if (c.type === 'diviseursDe') {
    const vrais = [];
    for (let n = -c.k - c.c - 2; n <= c.k + 2; n++) {
      if (n + c.c !== 0 && c.k % (n + c.c) === 0) vrais.push(n);
      controles++;
    }
    if (!memeListe(vrais, c.trouves)) {
      p.push('قيم n: وجدنا ' + vrais.length + ' قيمة و أُعلن ' + c.trouves.length);
    }

  } else if (c.type === 'valeur') {
    const e = {}; e[c.variable || 'n'] = F.rat(c.x0);
    const v = F.analyser(c.expr, e);
    if (!F.egaux(v, F.rat(c.val))) {
      p.push('القيمة الحقيقية ' + F.txt(v) + ' ≠ ' + c.val);
    }
    controles++;

  } else if (c.type === 'chiffres') {
    const vrais = [];
    for (let y = 0; y <= 9; y++) {
      for (let x = c.px === 0 ? 1 : 0; x <= 9; x++) {
        const t = c.fixes.map((ch, i) => (i === c.px ? x : ch));
        const nb = t[0] * 1000 + t[1] * 100 + t[2] * 10 + y;
        if (nb % c.d === 0) vrais.push(x * 10 + y);
        controles++;
      }
    }
    const annonces = c.trouves.map(([x, y]) => x * 10 + y);
    if (!memeListe(vrais, annonces)) {
      p.push('أزواج (x ؛ y): وجدنا ' + vrais.length + ' و أُعلن ' + annonces.length);
    }

  } else if (c.type === 'verite') {
    const vrai = verite(c.verif);
    if (vrai !== c.valeur) p.push('الجواب المعلن ' + (c.valeur ? 'صواب' : 'خطأ')
      + ' و الصحيح ' + (vrai ? 'صواب' : 'خطأ'));
    controles++;

  } else if (c.type === 'division') {
    const N = F.analyser(c.expr), Q = F.analyser(c.quotient);
    const attendu = F.add(F.mul(Q, F.rat(c.m)), F.rat(c.reste));
    if (!F.egaux(N, attendu)) p.push('القسمة الإقليدية لا تتحقّق: N ≠ m × q + r');
    if (c.reste < 0 || c.reste >= Math.abs(c.m)) p.push('الباقي خارج المجال [0 ؛ |m|[');
    if (Number(F.reste(N, c.m)) !== c.reste) p.push('الباقي المعلن ليس الباقي الحقيقي');
    controles += 3;

  } else if (c.type === 'listeNombres') {
    const tous = [];
    for (const u of c.pool) for (const d of c.pool) for (const ce of c.pool) {
      if (u === d || u === ce || d === ce) continue;
      tous.push(u * 100 + d * 10 + ce);
    }
    const attendus = tous.filter(n => (c.filtre === 'pair' ? n % 2 === 0 : n % 4 === 0));
    if (!memeListe(attendus, c.trouves)) {
      p.push('القائمة: وجدنا ' + attendus.length + ' عددا و أُعلن ' + c.trouves.length);
    }
    controles++;

  } else if (c.type === 'denombrement') {
    // on ne fait pas confiance à la formule : on énumère vraiment
    let compte = 0;
    const vus = [];
    (function place(reste, prof) {
      if (prof === c.k) { compte++; return; }
      for (const v of reste) place(reste.filter(w => w !== v), prof + 1);
    })(Array.from({ length: c.n }, (_, i) => i), 0);
    if (compte !== c.valeur) p.push('التعداد الحقيقي ' + compte + ' ≠ ' + c.valeur);
    controles++;
    void vus;

  } else p.push('نوع غير معروف: ' + c.type);
  return p;
}

function verifierBrut(brut) {
  const probs = [];
  const c = brut.controle;
  const envs = environnements(c);
  let verifiees = 0;

  brut.etapes.forEach(([label, math], i) => {
    if (typeof math !== 'string' || F.ARABE.test(math)) return;
    let bon = 0, souci = null;
    for (const env of envs) {
      try {
        const r = F.verifierRelation(String(math).replace(/×/g, '*'), env);
        if (r === null) { souci = '« ' + math + ' » ليست علاقة'; break; }
        if (r) { souci = souci || r; continue; }
        bon++; relations++;
      } catch (e) { souci = 'تعذّر « ' + math + ' » (' + e.message + ')'; break; }
    }
    if (bon < envs.length) probs.push('م' + (i + 1) + ': ' + (souci || 'لا تتحقّق'));
    verifiees++;
  });

  probs.push(...controlerClaim(c));
  const t = brut.etapes.map(e => e.join(': '));
  if (new Set(t).size !== t.length) probs.push('مراحل مكرّرة');
  if (t.length < 4) probs.push('السلسلة قصيرة جدا');
  if (t.length > 14) probs.push('السلسلة طويلة جدا (' + t.length + ' مراحل)');
  if (!brut.indice) probs.push('بلا مساعدة');
  void verifiees;
  return probs;
}

// -------------------------------------------------------------------------
// Mode falsification : on abîme volontairement des exercices justes.
// -------------------------------------------------------------------------
if (process.env.CONTRE_EXEMPLES) {
  const copie = q => ({ ...q, etapes: q.etapes.map(e => e.slice()),
                        controle: JSON.parse(JSON.stringify(q.controle)) });
  const cas = [];
  const pousse = (nom, q, f) => { const c = copie(q); f(c); cas.push([nom, c]); };
  const parType = (n, i) => F.tirer(n)[i || 0];

  pousse('couple (x ; y) en trop', parType(1), c => { c.controle.trouves.push([9, 9]); });
  pousse('diviseur annoncé qui ne divise pas', parType(2), c => { c.controle.d += 1; });
  // Ajouter « + 1 » DANS la parenthèse ne mord pas quand le cofacteur n'en a
  // pas (« 100 × 5^86 » contre « 5^86 »). On décale donc le membre entier.
  pousse('cofacteur faussé', parType(2), c => {
    c.controle.identites[1][1] = '(' + c.controle.identites[1][1] + ') + 1';
  });
  pousse('verdict vrai/faux retourné', parType(3), c => { c.controle.valeur = !c.controle.valeur; });
  // Doubler le diviseur ne mord pas toujours (30 divise parfois ce que 15
  // divise). On touche donc au NOMBRE : le chiffre des unités décide seul du
  // critère de 2, 4, 5 et 10, et l'augmenter d'une unité le casse à coup sûr.
  pousse('dernier chiffre modifié', parType(4), c => {
    c.controle.expr = c.controle.expr.slice(0, -1)
      + String(Number(c.controle.expr.slice(-1)) + 1);
  });
  pousse('quotient décalé', parType(4, 1), c => {
    c.controle.quotient = c.controle.quotient + ' + 1';
  });
  pousse('un nombre oublié dans la liste', parType(5), c => { c.controle.trouves.pop(); });
  pousse('dénombrement faux', parType(6), c => { c.controle.valeur += 1; });
  pousse('base mal unifiée', parType(7), c => {
    c.controle.identites[0][1] = c.controle.identites[0][1].replace(/\^(\d+)/, (m, e) => '^' + (Number(e) + 1));
  });
  pousse('valeur de n en trop', parType(8), c => {
    c.controle.trouves = c.controle.trouves.concat([c.controle.trouves[0] + 1]);
  });
  pousse('forme réduite fausse', parType(9), c => {
    c.controle.droite = c.controle.droite.replace(/^(\d+)/, m => Number(m) + 1);
  });
  pousse('valeurs de n incomplètes', parType(9, 1), c => { c.controle.trouves.pop(); });
  pousse('valeur numérique décalée', parType(9, 2), c => { c.controle.val += 1; });
  pousse('étape dupliquée', parType(2, 1), c => { c.etapes[2] = c.etapes[1].slice(); });

  let bon = 0;
  for (const [nom, q] of cas) {
    let probs;
    try { probs = verifierBrut(q); } catch (e) { probs = ['exception: ' + e.message]; }
    console.log((probs.length ? '✗ rejeté  ' : '⚠ ACCEPTÉ ') + nom
      + (probs.length ? ' — ' + probs[0].slice(0, 90) : ''));
    if (probs.length) bon++;
  }
  console.log('\n' + bon + '/' + cas.length + ' falsifications détectées.');
  process.exit(bon === cas.length ? 0 : 1);
}

for (const n of Object.keys(F.PROBLEMES).map(Number).sort((a, b) => a - b)) {
  let mauvais = 0; const modeles = new Set(); const vus = new Set();
  for (let t = 0; t < TIRAGES; t++) {
    for (const [i, brut] of F.tirer(n).entries()) {
      questions++;
      vus.add(brut.enonce.join(' '));
      if (brut.controle.modele) modeles.add(brut.controle.modele);
      const probs = verifierBrut(brut);
      if (probs.length) {
        mauvais++;
        if (echecs.length < 10) {
          echecs.push('التمرين ' + n + ' س' + (i + 1) + ': ' + brut.enonce.join(' ')
            + '\n    - ' + probs.join('\n    - '));
        }
      }
    }
  }
  console.log(('التمرين ' + n + ' — ' + F.PROBLEMES[n].titre).padEnd(46)
    + (mauvais ? '✗ ' + mauvais + ' échec(s)' : '✓') + '  (' + modeles.size + ' نماذج، '
    + vus.size + ' صيغة)');
}
if (echecs.length) console.log('\n' + echecs.join('\n'));
console.log('\n' + TIRAGES + ' tirages par exercice, ' + questions + ' questions, '
  + relations + ' relations recalculées et ' + controles + ' contrôles, '
  + (echecs.length ? 'ÉCHECS' : '0 erreur') + '.');
process.exit(echecs.length ? 1 : 0);
