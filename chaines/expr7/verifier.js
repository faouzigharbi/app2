// Valide les sept types de la leçon « العبارات الحرفية ».
//   node verifier.js [tirages]   |   CONTRE_EXEMPLES=1 node verifier.js
//
// Le principe : on ne LIT pas les générateurs, on les EXÉCUTE. Chaque étape de
// chaque chaîne est réanalysée et recalculée ; une abréviation est une identité
// et doit tenir pour toutes les valeurs des lettres, une équation ne doit tenir
// qu'en sa solution — et sa solution doit vraiment en être une.
//
// S'ajoute une exigence propre à la 7ème : aucun nombre négatif nulle part,
// ni dans l'énoncé, ni dans une étape, ni dans un résultat.
const F = require('./noyau.js');
const A = require('./expressions.js');
require('./gens.js');

const TIRAGES = Number(process.argv[2]) || 120;
const ECHANTILLONS = 30;
let relations = 0, controles = 0, questions = 0;
const echecs = [];
const rnd = () => F.rat(F.ent(1, 15), F.ent(1, 7));   // POSITIF : on est en 7ème

// « xy » est un seul jeton pour l'analyseur, mais c'est le produit de x par y.
// Sans cette dérivation, l'identité « 5/11 xy(1/3 x + 5y) = 5/33 x^2 y + 25/11 x y^2 »
// serait déclarée fausse, et le contrôle passerait à côté du monôme.
function envAleatoire(vars, composites) {
  const e = {};
  (vars || []).forEach(v => { e[v] = rnd(); });
  if (composites) {
    ['xy', 'ab'].forEach(nom => {
      e[nom] = nom.split('').reduce((r, l) => F.mul(r, e[l] || F.rat(1)), F.rat(1));
    });
  }
  return e;
}

// Les environnements dans lesquels CHAQUE ÉTAPE doit se vérifier.
function environnements(c) {
  if (c.env) {
    // Type 7 : a et b sont des entiers donnés. Les étapes mêlent l'algèbre et
    // les valeurs (« 2(7a + 9b) = 2 × 236 ») : elles ne tiennent qu'ici.
    const e = Object.assign({}, c.env);
    if (c.composites) {
      ['xy', 'ab'].forEach(nom => {
        e[nom] = nom.split('').reduce((r, l) => F.mul(r, e[l] || F.rat(1)), F.rat(1));
      });
    }
    if (c.nom) e[c.nom] = F.analyser(c.gauche, e);
    return [e];
  }
  if (c.type === 'identite') {
    return Array.from({ length: ECHANTILLONS }, () => {
      const e = envAleatoire(c.vars, c.composites);
      if (c.nom) e[c.nom] = F.analyser(c.gauche, e);
      return e;
    });
  }
  if (c.type === 'valeur') return [{ x: c.x0, T: c.val, P: c.val }];
  if (c.type === 'equation') return [{ x: c.x0 }];
  if (c.type === 'systeme') return [{ a: F.rat(c.a), b: F.rat(c.b) }];
  return [{}];
}

// Le contrôle du CLAIM lui-même : ce que l'exercice affirme est-il vrai ?
function controlerClaim(c) {
  const p = [];
  if (c.type === 'identite') {
    for (let i = 0; i < ECHANTILLONS * 2; i++) {
      const e = envAleatoire(c.vars, c.composites);
      const g = F.analyser(c.gauche, e), d = F.analyser(c.droite, e);
      if (!F.egaux(g, d)) {
        p.push(`« ${c.gauche} » ≠ « ${c.droite} » (${F.txt(g)} و ${F.txt(d)})`);
        break;
      }
      controles++;
    }
  } else if (c.type === 'valeur') {
    const v = F.analyser(c.gauche, { x: c.x0 });
    if (!F.egaux(v, c.val)) p.push(`القيمة الحقيقية ${F.txt(v)} ≠ ${F.txt(c.val)}`);
    controles++;
  } else if (c.type === 'equation') {
    // La solution annoncée doit VRAIMENT résoudre l'équation de départ…
    const g = F.analyser(c.gauche, { x: c.x0 });
    const d = c.droite ? F.analyser(c.droite, { x: c.x0 }) : c.val;
    if (!F.egaux(g, d)) p.push(`${F.txt(c.x0)} ليس حلاّ (${F.txt(g)} ≠ ${F.txt(d)})`);
    controles++;
    // …et elle doit être la SEULE : ailleurs, l'égalité tombe.
    let autre = 0;
    for (let i = 0; i < 12; i++) {
      const x = F.add(c.x0, F.rat(F.ent(1, 9), F.ent(1, 5)));
      const gg = F.analyser(c.gauche, { x });
      const dd = c.droite ? F.analyser(c.droite, { x }) : c.val;
      if (F.egaux(gg, dd)) autre++;
      controles++;
    }
    if (autre) p.push('المعادلة تتحقّق لأعداد أخرى: ليست من الدرجة الأولى');
    if (c.x0.n <= 0) p.push('الحلّ ليس عددا كسريا موجبا');
  } else if (c.type === 'systeme') {
    if (c.p * c.a + c.q * c.b !== c.S) p.push('الزوج (a ؛ b) لا يحقّق المعطى');
    if (c.a - c.b !== c.d) p.push('الفرق بين العددين ليس ' + c.d);
    if (c.a <= 0 || c.b <= 0 || c.a % 1 || c.b % 1) p.push('العددان ليسا طبيعيين');
    controles += 3;
  } else p.push('نوع غير معروف: ' + c.type);
  return p;
}

// Programme de 7ème : pas de nombres négatifs. Un « - » ne peut être qu'un
// SIGNE D'OPÉRATION entre deux termes, jamais le signe d'un nombre.
const NEGATIF = /(^|[(:=×*+\-/])\s*-\s*\d/;

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
          const envs = F.environnements(c);
          const rangs = q.fautes.map(f => f.rang);
          if (!q.fautes.length || q.fautes.length > niveau) {
            griefs.push(`التمرين ${n} س${qi + 1}: ${q.fautes.length} أخطاء بدل ${niveau}`);
            mauvais++;
          }
          q.etapes.forEach(([, math], i) => {
            const j = F.evaluerEtape(math, envs);
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
              const j = F.evaluerEtape(opt, envs);
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

function verifierBrut(brut) {
  const probs = [];
  const c = brut.controle;
  const envs = environnements(c);
  let verifiees = 0;

  const textes = brut.enonce.filter(e => typeof e === 'string')
    .concat(brut.etapes.map(e => e[1]).filter(e => typeof e === 'string'));
  for (const t of textes) {
    if (NEGATIF.test(t)) { probs.push('عدد سالب في « ' + t + ' » (برنامج 7 أساسي)'); break; }
  }

  brut.etapes.forEach(([label, math], i) => {
    if (typeof math !== 'string' || F.ARABE.test(math)) return;
    let bon = 0, souci = null;
    for (const env of envs) {
      try {
        const r = F.verifierRelation(String(math).replace(/×/g, '*'), env);
        if (r === null) { souci = `« ${math} » ليست علاقة`; break; }
        if (r) { souci = souci || r; continue; }
        bon++; relations++;
      } catch (e) { souci = `تعذّر « ${math} » (${e.message})`; break; }
    }
    if (bon < envs.length) probs.push(`م${i + 1}: ${souci || 'لا تتحقّق'}`);
    verifiees++;
  });

  if (verifiees < 2) probs.push('عدد المراحل القابلة للتحقق قليل جدا');
  probs.push(...controlerClaim(c));
  const t = brut.etapes.map(e => e.join(': '));
  if (new Set(t).size !== t.length) probs.push('مراحل مكرّرة');
  if (t.length < 4) probs.push('السلسلة قصيرة جدا');
  if (!brut.indice) probs.push('بلا مساعدة');
  return probs;
}

// -------------------------------------------------------------------------
// Mode falsification : on abîme volontairement des exercices justes. Si le
// validateur les accepte, c'est lui qui est faux — pas eux.
// -------------------------------------------------------------------------
if (process.env.CONTRE_EXEMPLES) {
  const copie = q => JSON.parse(JSON.stringify(q), (k, v) =>
    (v && typeof v === 'object' && 'n' in v && 'd' in v) ? v : v);
  const cas = [];
  const pousse = (nom, q, f) => { const c = copie(q); f(c); cas.push([nom, c]); };
  // Trouver un tirage d'un modèle précis : les falsifications doivent MORDRE,
  // et une falsification qui vise un « + » ne mord pas une forme sans « + ».
  const parModele = (n, pred) => {
    for (let i = 0; i < 900; i++) {
      for (const q of F.tirer(n)) if (pred(q)) return q;
    }
    throw new Error('modèle introuvable dans le type ' + n);
  };

  pousse('coefficient réduit faussé', F.tirer(1)[0],
    c => { c.controle.droite = '2 ' + c.controle.droite; });
  pousse('développement amputé', F.tirer(2)[0],
    c => { c.controle.droite = c.controle.droite.replace(/ \+ [^+]*$/, ''); });
  pousse('facteur littéral xy oublié',
    parModele(3, q => q.controle.composites && / xy\(/.test(q.controle.droite)),
    c => { c.controle.droite = c.controle.droite.replace(' xy(', ' x('); });
  pousse('facteur commun mal sorti', F.tirer(3)[0],
    c => { c.controle.droite = c.controle.droite.replace(/\)$/, ' + 1)'); });
  const cpl = F.tirer(4);
  pousse('forme factorisée fausse', cpl[1],
    c => { c.controle.droite = c.controle.droite.replace(/\)$/, ' + 1)'); });
  pousse('valeur numérique décalée', cpl[2],
    c => { c.controle.val = F.add(c.controle.val, F.rat(1)); });
  pousse('solution de l’équation décalée', cpl[3],
    c => { c.controle.x0 = F.add(c.controle.x0, F.rat(1)); });
  pousse('solution négative',
    parModele(5, () => true), c => { c.controle.x0 = F.neg(c.controle.x0); });
  const per = F.tirer(6);
  pousse('périmètre : un côté oublié', per[0],
    c => { c.controle.droite = c.controle.droite.replace(/^\d+/, m => Number(m) - 1); });
  pousse('périmètre : x cherché faux', per[2],
    c => { c.controle.x0 = F.add(c.controle.x0, F.rat(1, 2)); });
  const nat = F.tirer(7);
  pousse('développement de E faussé', nat[0],
    c => { c.controle.droite += ' + 1'; });
  pousse('couple (a ; b) invalide', nat[3], c => { c.controle.a += 1; });
  pousse('étape dupliquée', F.tirer(2)[1],
    c => { c.etapes[2] = c.etapes[1].slice(); });

  let bon = 0;
  for (const [nom, q] of cas) {
    let probs;
    try { probs = verifierBrut(q); } catch (e) { probs = ['exception: ' + e.message]; }
    console.log((probs.length ? '✗ rejeté  ' : '⚠ ACCEPTÉ ') + nom
      + (probs.length ? ' — ' + probs[0].slice(0, 90) : ''));
    if (probs.length) bon++;
  }
  console.log(`\n${bon}/${cas.length} falsifications détectées.`);
  process.exit(bon === cas.length ? 0 : 1);
}

for (const n of Object.keys(F.PROBLEMES).map(Number).sort((a, b) => a - b)) {
  let mauvais = 0; const modeles = new Set(); const vus = new Set();
  for (let t = 0; t < TIRAGES; t++) {
    for (const [i, brut] of F.tirer(n).entries()) {
      questions++;
      vus.add(brut.enonce.map(e => (typeof e === 'string' ? e : '[figure]')).join(' '));
      if (brut.controle.modele) modeles.add(brut.controle.modele);
      const probs = verifierBrut(brut);
      if (probs.length) {
        mauvais++;
        if (echecs.length < 10) {
          echecs.push(`النوع ${n} س${i + 1}: `
            + brut.enonce.map(e => (typeof e === 'string' ? e : '[figure]')).join(' ')
            + '\n    - ' + probs.join('\n    - '));
        }
      }
    }
  }
  console.log(`النوع ${n} — ${F.PROBLEMES[n].titre}`.padEnd(46)
    + `${mauvais ? '✗ ' + mauvais + ' échec(s)' : '✓'}  (${modeles.size} نماذج، ${vus.size} صيغة)`);
}
if (echecs.length) console.log('\n' + echecs.join('\n'));
console.log(`\n${TIRAGES} tirages par type, ${questions} questions,`
  + ` ${relations} relations recalculées et ${controles} contrôles,`
  + ` ${echecs.length ? 'ÉCHECS' : '0 erreur'}.`);
process.exit(echecs.length ? 1 : 0);
