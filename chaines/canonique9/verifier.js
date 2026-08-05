// LE VALIDATEUR — il DÉVELOPPE, et il SUBSTITUE.
//
//   node verifier.js [tirages]
//   CONTRE_EXEMPLES=1 node verifier.js
const F = require('./noyau.js');
const I = require('./items.js');
const C = require('./chaines.js');
require('./gens.js');

const N = parseInt(process.argv[2], 10) || 30;
let relations = 0, controles = 0;
const lireQ = t => { const [n, d] = String(t).split('/'); return F.q(BigInt(n), BigInt(d)); };

// SUBSTITUER UNE RACINE IRRATIONNELLE, EXACTEMENT.
//
// Les solutions valent a ± √k, et √k n'est pas rationnel. On calcule donc
// dans ℚ(√k) : un nombre s'y écrit u + v√k, et le carré vaut
// (u² + k·v²) + 2uv·√k. Vérifier que P(a + √k) = 0, c'est vérifier que ses
// DEUX composantes sont nulles — la rationnelle et celle qui porte le radical.
// Se contenter de l'identité « P = (x − a)² − k » reviendrait à croire la
// chaîne sur parole au moment précis où elle conclut.
function polEnRadical(P, u, v, k) {
  let re = F.Q0, im = F.Q0;           // le nombre courant : re + im·√k
  let pre = F.Q1, pim = F.Q0;         // la puissance courante
  for (let i = 0; i < P.length; i++) {
    re = F.qAdd(re, F.qMul(P[i], pre));
    im = F.qAdd(im, F.qMul(P[i], pim));
    // (pre + pim√k)(u + v√k) = (pre·u + k·pim·v) + (pre·v + pim·u)√k
    const nre = F.qAdd(F.qMul(pre, u), F.qMul(k, F.qMul(pim, v)));
    const nim = F.qAdd(F.qMul(pre, v), F.qMul(pim, u));
    pre = nre; pim = nim;
  }
  return [re, im];
}

function verifierBrut(brut) {
  const probs = [];
  const c = brut.controle;
  if (!c || c.type !== 'canonique') { probs.push('نوع غير معروف'); return probs; }
  const P = c.P.map(lireQ), a = lireQ(c.a), k = lireQ(c.k);

  // 1. LA FORME CANONIQUE EST VRAIE : on développe (x − a)² − k et l'on
  //    compare coefficient par coefficient. Rien n'est cru sur parole.
  relations++;
  const dev = F.polAdd(F.polMul([F.qNeg(a), F.Q1], [F.qNeg(a), F.Q1]), [F.qNeg(k)]);
  if (!F.polEgaux(dev, P)) probs.push('الشكل القانوني لا يساوي P');

  // 2. k > 0 — sinon l'équation n'a pas les deux solutions annoncées.
  if (c.but === 'racines' && !F.qPos(k)) probs.push('k غير موجب : لا حلّ بهذا الشكل');

  // 3. LA FACTORISATION, développée à son tour.
  if (c.but === 'facteurs') {
    relations++;
    const b = lireQ(c.b);
    if (!F.qEgaux(F.qMul(b, b), k)) probs.push('b² لا يساوي k');
    const f1 = [F.qNeg(F.qAdd(a, b)), F.Q1];      // x − (a + b)
    const f2 = [F.qNeg(F.qSub(a, b)), F.Q1];      // x − (a − b)
    if (!F.polEgaux(F.polMul(f1, f2), P)) probs.push('الجداء لا يساوي P');
  }

  // 4. LES RACINES, SUBSTITUÉES. a ± √k, dans ℚ(√k).
  if (c.but === 'racines') {
    for (const v of [F.Q1, { n: -1n, d: 1n }]) {
      relations++;
      const [re, im] = polEnRadical(P, a, v, k);
      if (!F.qNul(re) || !F.qNul(im)) {
        probs.push('الجذر لا يُلغي P : ' + F.ecrireQ(re).replace(/<[^>]+>/g, '')
          + ' + ' + F.ecrireQ(im).replace(/<[^>]+>/g, '') + '√k');
      }
    }
  }
  controles++;

  // 5. Rien à l'air libre — un nombre non isolé se retourne dans l'arabe.
  for (const b of [...brut.enonce, ...brut.etapes.map(e => e[1])]) {
    const nu = String(F.rendreMath(b))
      .replace(/<span class="frac" dir="ltr">[\s\S]*?<\/span><\/span>/g, '')
      .replace(/<sup>\d+<\/sup>/g, '')
      .replace(/<span dir="ltr"[^>]*>[\s\S]*?<\/span>/g, '');
    if (/[\d√]/.test(nu)) probs.push('رقم خارج جزيرة لاتينية : ' + String(b).slice(0, 30));
  }
  // 6. LE TRAIT D'UNION EST INTERDIT. « -3 » n'est pas « −3 » : c'est un signe
  //    d'imprimerie qui ne se lit pas comme un moins.
  for (const b of [...brut.enonce, ...brut.etapes.map(e => e[1])]) {
    // On interdit le trait d'union TOUT COURT : il n'a rien à faire dans une
    // expression. Ne chercher que « -3 » collé laissait passer « - 18 », et
    // la falsification refusait donc de mordre.
    if (String(b).indexOf('-') >= 0) {
      probs.push('شرطة بدل علامة الطرح : ' + String(b).replace(/<[^>]+>/g, '').slice(0, 34));
    }
  }

  const t = brut.etapes.map(e => e.join(': '));
  if (new Set(t).size !== t.length) probs.push('مراحل مكرّرة');
  if (t.length < 4) probs.push('السلسلة قصيرة جدا');
  if (!brut.indice) probs.push('بلا مساعدة');
  return probs;
}

if (process.env.CONTRE_EXEMPLES) {
  const copie = x => (Array.isArray(x) ? x.map(copie)
    : (x && typeof x === 'object' ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, copie(v)])) : x));
  const emp = x => JSON.stringify(x);
  const cas = [];
  const NUMS = Object.keys(F.PROBLEMES).map(Number);
  const pousse = (nom, f) => {
    for (let e = 0; e < 120; e++) {
      const lot = F.tirer(NUMS[e % NUMS.length]);
      if (!lot.length) continue;
      const avant = copie(lot[e % lot.length]), c = copie(avant);
      try { f(c); } catch (x) { continue; }
      if (emp(c) === emp(avant)) continue;
      let probs; try { probs = verifierBrut(c); } catch (x) { probs = ['exception']; }
      if (probs.length) return cas.push([nom, c]);
    }
    cas.push([nom + ' — AUCUNE FALSIFICATION POSSIBLE', null]);
  };

  pousse('le sommet décalé d’une unité', c => {
    const [n, d] = c.controle.a.split('/');
    c.controle.a = (BigInt(n) + BigInt(d)) + '/' + d;
  });
  pousse('la constante k changée', c => {
    const [n, d] = c.controle.k.split('/');
    c.controle.k = (BigInt(n) + BigInt(d)) + '/' + d;
  });
  pousse('k rendu négatif', c => {
    if (c.controle.but !== 'racines') throw new Error('pas une équation');
    const [n, d] = c.controle.k.split('/');
    c.controle.k = (-BigInt(n)) + '/' + d;
  });
  pousse('un facteur faussé', c => {
    if (c.controle.but !== 'facteurs') throw new Error('pas une factorisation');
    const [n, d] = c.controle.b.split('/');
    c.controle.b = (BigInt(n) + BigInt(d)) + '/' + d;
  });
  pousse('un trait d’union au lieu du moins', c => {
    c.etapes[0][1] = String(c.etapes[0][1]).replace('−', '-');
  });
  pousse('chaîne tronquée', c => { c.etapes = c.etapes.slice(0, 3); });
  pousse('aide absente', c => { c.indice = ''; });

  let bon = 0;
  for (const [nom, q] of cas) {
    if (!q) { console.log('⚠ NON ÉPROUVÉ ' + nom); continue; }
    let probs; try { probs = verifierBrut(q); } catch (e) { probs = ['exception: ' + e.message]; }
    console.log((probs.length ? '✗ rejeté  ' : '⚠ ACCEPTÉ ') + nom
      + (probs.length ? ' — ' + String(probs[0]).slice(0, 66) : ''));
    if (probs.length) bon++;
  }
  console.log('\n' + bon + '/' + cas.length + ' falsifications détectées.');
  process.exit(bon === cas.length ? 0 : 1);
}

let mauvais = 0, questions = 0;
for (const n of Object.keys(F.PROBLEMES)) {
  const def = F.PROBLEMES[n];
  const formes = new Set(); const ennuis = [];
  for (let t = 0; t < N; t++) {
    let lot; try { lot = F.tirer(n); } catch (e) { ennuis.push(['?', ['exception: ' + e.message]]); continue; }
    if (lot.length < def.questions) ennuis.push([def.titre, ['الصفحة ناقصة']]);
    for (const b of lot) {
      questions++; formes.add(JSON.stringify(b.etapes));
      let probs; try { probs = verifierBrut(b); } catch (e) { probs = ['exception: ' + e.message]; }
      if (probs.length) { ennuis.push([b.source, probs]); mauvais++; }
    }
  }
  console.log(('ex' + n + ' — ' + def.titre).padEnd(46)
    + (ennuis.length ? '✗' : '✓') + '  (' + formes.size + ' صيغة)');
  for (const [src, probs] of ennuis.slice(0, 3)) {
    console.log('    ' + src); probs.slice(0, 3).forEach(p => console.log('      - ' + p));
  }
}
console.log('\n' + N + ' tirages, ' + questions + ' questions, ' + relations
  + ' identités développées ou racines substituées, '
  + (mauvais ? mauvais + ' ERREURS.' : '0 erreur.'));
process.exit(mauvais ? 1 : 0);
