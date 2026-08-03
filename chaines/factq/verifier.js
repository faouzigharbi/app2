// Valide les cinq types de factorisation.
//   node verifier.js [tirages]   |   CONTRE_EXEMPLES=1 node verifier.js
//
// Une factorisation est une IDENTITÉ : la forme factorisée et la forme
// développée doivent coïncider PARTOUT. On les évalue donc en des dizaines
// de valeurs tirées au hasard — un facteur commun mal choisi, un signe
// retourné, un coefficient oublié ne survivent pas au premier essai.
const F = require('./noyau.js');
const A = require('./fact.js');
require('./gens.js');

const TIRAGES = Number(process.argv[2]) || 200;
const ECHANTILLONS = 40;
let relations = 0, controles = 0, questions = 0;
const echecs = [];
const rnd = () => F.rat(F.ent(-15, 15), F.ent(1, 7));

const envAleatoire = vars => {
  const e = {};
  vars.forEach(v => { e[v] = rnd(); });
  return e;
};

function environnements(c) {
  if (c.type === 'identite') {
    return Array.from({ length: ECHANTILLONS }, () => {
      const e = envAleatoire(c.vars);
      if (c.nom) e[c.nom] = F.analyser(c.gauche, e);
      return e;
    });
  }
  if (c.type === 'valeur') return [{ x: c.x0, E: c.val }];
  if (c.type === 'equation-produit') {
    return [c.x1, c.x2].map(x => {
      const e = { x };
      if (c.nom) e[c.nom] = F.analyser(c.gauche, e);   // vaut 0 aux racines
      return e;
    });
  }
  return [{}];
}

function controlerClaim(c) {
  const p = [];
  if (c.type === 'identite') {
    for (let i = 0; i < ECHANTILLONS * 2; i++) {
      const e = envAleatoire(c.vars);
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
  } else if (c.type === 'equation-produit') {
    // Les deux racines annoncées doivent annuler l'expression de départ —
    // et la forme factorisée doit lui être identique partout ailleurs.
    for (const x of [c.x1, c.x2]) {
      if (F.analyser(c.gauche, { x }).n !== 0) p.push(`${F.txt(x)} ليس حلاّ`);
      controles++;
    }
    if (F.egaux(c.x1, c.x2)) p.push('الحلاّن متطابقان');
    for (let i = 0; i < ECHANTILLONS; i++) {
      const e = { x: rnd() };
      if (!F.egaux(F.analyser(c.gauche, e), F.analyser(c.fact, e))) {
        p.push('الشكل المفكّك لا يطابق العبارة'); break;
      }
      controles++;
    }
  } else p.push('نوع غير معروف: ' + c.type);
  return p;
}

function verifierBrut(brut) {
  const probs = [];
  const c = brut.controle;
  const envs = environnements(c);
  let verifiees = 0;
  brut.etapes.forEach(([label, math], i) => {
    if (F.ARABE.test(math)) return;
    // Une équation produit décrit une DISJONCTION : « x = x1 ou x = x2 ».
    // Chaque racine ne vaut que dans son cas ; on demande donc que l'étape
    // tienne dans AU MOINS un des deux, et c'est le contrôle de la
    // conclusion qui fait le vrai travail. Partout ailleurs, l'étape doit
    // tenir dans TOUS les environnements.
    const disjonction = c.type === 'equation-produit';
    let bon = 0, souci = null;
    for (const env of envs) {
      try {
        const r = F.verifierRelation(String(math).replace(/×/g, '*'), env);
        if (r === null) { souci = `« ${math} » ليست علاقة`; break; }
        if (r) { souci = souci || r; continue; }
        bon++; relations++;
      } catch (e) { souci = `تعذّر « ${math} » (${e.message})`; break; }
    }
    const attendu = disjonction ? 1 : envs.length;
    if (bon < attendu) probs.push(`م${i + 1}: ${souci || 'لا تتحقّق'}`);
    verifiees++;
  });
  if (verifiees < 1) probs.push('لا مرحلة قابلة للتحقق');
  probs.push(...controlerClaim(c));
  const t = brut.etapes.map(e => e.join(': '));
  if (new Set(t).size !== t.length) probs.push('مراحل مكرّرة');
  if (t.length < 4) probs.push('السلسلة قصيرة جدا');
  if (!brut.indice) probs.push('بلا مساعدة');
  return probs;
}

if (process.env.CONTRE_EXEMPLES) {
  const copie = q => JSON.parse(JSON.stringify(q));
  const cas = [];
  const pousse = (nom, q, f) => { const c = copie(q); f(c); cas.push([nom, c]); };
  pousse('facteur commun faussé', F.tirer(1)[0], c => {
    c.controle.droite = c.controle.droite.replace(/^\(?[^(]*/, m => m + ' ');
    c.controle.droite = '2' + c.controle.droite;
  });
  // La falsification doit MORDRE quelle que soit la forme tirée : retourner
  // « + » en « - » ne change rien si la forme n'a que des « - », et le
  // remplacement suivant pouvait alors retourner celui qu'on venait de créer.
  pousse('signe retourné dans la factorisation', F.tirer(2)[0], c => {
    const d = c.controle.droite;
    c.controle.droite = / \+ /.test(d) ? d.replace(/ \+ /, ' - ')
      : (/ - /.test(d) ? d.replace(/ - /, ' + ') : d.replace(/\)$/, ' + 1)'));
  });
  pousse('facteur caché mal révélé', F.tirer(3)[0], c => {
    c.controle.droite = c.controle.droite.replace(/\)$/, ' + 1)');
  });
  pousse('racine décalée', F.tirer(4)[0], c => {
    c.controle.x1 = F.add(c.controle.x1, F.rat(1));
  });
  pousse('les deux racines confondues', F.tirer(4)[1], c => {
    c.controle.x2 = c.controle.x1;
  });
  const cpl = F.tirer(5);
  pousse('développement faussé', cpl[0], c => { c.controle.droite += ' + 1'; });
  pousse('valeur numérique faussée', cpl[1], c => {
    c.controle.val = F.add(c.controle.val, F.rat(1));
  });
  pousse('étape dupliquée', cpl[2], c => { c.etapes[2] = c.etapes[1].slice(); });

  let bon = 0;
  for (const [nom, q] of cas) {
    const probs = verifierBrut(q);
    console.log((probs.length ? '✗ rejeté  ' : '⚠ ACCEPTÉ ') + nom
      + (probs.length ? ' — ' + probs[0].slice(0, 80) : ''));
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
      vus.add(brut.enonce.join(' '));
      if (brut.controle.modele) modeles.add(brut.controle.modele);
      const probs = verifierBrut(brut);
      if (probs.length) {
        mauvais++;
        if (echecs.length < 8) echecs.push(`ex${n} س${i + 1}: ${brut.enonce.join(' ')}\n    - ` + probs.join('\n    - '));
      }
    }
  }
  console.log(`ex${n} — ${F.PROBLEMES[n].titre}`.padEnd(48)
    + `${mauvais ? '✗ ' + mauvais + ' échec(s)' : '✓'}  (${modeles.size} نماذج، ${vus.size} صيغة)`);
}
if (echecs.length) console.log('\n' + echecs.join('\n'));
console.log(`\n${TIRAGES} tirages par type, ${questions} questions,`
  + ` ${relations} relations recalculées et ${controles} identités re-démontrées,`
  + ` ${echecs.length ? 'ÉCHECS' : '0 erreur'}.`);
process.exit(echecs.length ? 1 : 0);
