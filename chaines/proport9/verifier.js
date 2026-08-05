// LE VALIDATEUR — il REFAIT le produit en croix, et RELIT ce qui est écrit.
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

// Relire un nombre AFFICHÉ et rendre sa valeur. Décimale ou fraction ; tout
// ce qui n'entre dans aucune des deux formes est refusé, car une lecture
// indulgente laisserait passer précisément ce qu'on veut interdire.
function relire(t) {
  const f = /^<span class="frac" dir="ltr"><span class="num">(-?[\d,]+)<\/span><span class="den">(-?[\d,]+)<\/span><\/span>$/.exec(t);
  const nu = x => {
    const d = /^(-?\d+),(\d+)$/.exec(x);
    if (d) return F.q(BigInt(d[1] + d[2]), 10n ** BigInt(d[2].length));
    return /^-?\d+$/.test(x) ? F.q(BigInt(x)) : null;
  };
  if (f) { const a = nu(f[1]), b = nu(f[2]); return (a && b) ? F.qDiv(a, b) : null; }
  return nu(t);
}

function verifierBrut(brut) {
  const probs = [];
  const c = brut.controle;
  if (!c || c.type !== 'proport') { probs.push('نوع غير معروف'); return probs; }
  const fr = c.fractions.map(x => [lireQ(x[0]), lireQ(x[1])]);
  const [i, ou] = c.trou;

  // 1. TOUTES LES FRACTIONS SONT ÉGALES — c'est l'énoncé lui-même qu'on
  //    vérifie, pas seulement la réponse. Le produit en croix, exact.
  for (let k = 1; k < fr.length; k++) {
    relations++;
    if (!F.qEgaux(F.qMul(fr[0][0], fr[k][1]), F.qMul(fr[k][0], fr[0][1]))) {
      probs.push('الكسور ليست متساوية : ' + k);
    }
    if (F.qNul(fr[k][1]) || F.qNul(fr[0][1])) probs.push('مقام منعدم');
  }

  // 2. LA RÉPONSE EST BIEN LE NOMBRE MANQUANT.
  const attendu = (ou === 'n') ? fr[i][0] : fr[i][1];
  if (!F.qEgaux(attendu, lireQ(c.reponse))) probs.push('الجواب لا يوافق الحساب');

  // 3. AUCUNE VALEUR APPROCHÉE — on relit ce qui est écrit.
  const relu = relire(c.ecritReponse);
  if (relu === null) probs.push('كتابة غير قابلة للقراءة : ' + c.ecritReponse);
  else if (!F.qEgaux(relu, attendu)) {
    probs.push('قيمة تقريبية : مكتوبة ' + c.ecritReponse.replace(/<[^>]+>/g, ' ')
      + ' بينما القيمة ' + attendu.n + '/' + attendu.d);
  }

  // 4. LA RÉPONSE N'EST PAS DANS L'ÉNONCÉ. L'énoncé montre « … » à la place.
  const ligne = String(brut.enonce[1]);
  if (!ligne.includes('…')) probs.push('لا يوجد فراغ في النصّ');

  // 5. LE TROU EST UNIQUE. Deux trous, et l'exercice n'a plus de solution.
  if ((ligne.match(/…/g) || []).length !== 1) probs.push('أكثر من فراغ واحد');

  // 6. Rien à l'air libre : chiffres et fractions doivent être isolés, sinon
  //    l'arabe retourne « 7,5 » et le nombre change.
  for (const b of [...brut.enonce, ...brut.etapes.map(e => e[1])]) {
    const nu = String(F.rendreMath(b))
      .replace(/<span class="frac" dir="ltr">[\s\S]*?<\/span><\/span>/g, '')
      .replace(/<span dir="ltr"[^>]*>[\s\S]*?<\/span>/g, '');
    if (/\d/.test(nu)) probs.push('رقم خارج جزيرة لاتينية : ' + String(b).slice(0, 30));
  }

  const t = brut.etapes.map(e => e.join(': '));
  if (new Set(t).size !== t.length) probs.push('مراحل مكرّرة');
  if (t.length < 4) probs.push('السلسلة قصيرة جدا');
  if (!brut.indice) probs.push('بلا مساعدة');
  controles++;
  return probs;
}

if (process.env.CONTRE_EXEMPLES) {
  const copie = x => {
    if (typeof x === 'bigint') return x;
    if (Array.isArray(x)) return x.map(copie);
    if (x && typeof x === 'object') { const o = {}; for (const k of Object.keys(x)) o[k] = copie(x[k]); return o; }
    return x;
  };
  const emp = x => JSON.stringify(x, (k, v) => (typeof v === 'bigint' ? v + 'n' : v));
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

  pousse('un numérateur faussé d’une unité', c => {
    const f = c.controle.fractions[1];
    const [n, d] = f[0].split('/');
    f[0] = (BigInt(n) + BigInt(d)) + '/' + d;
  });
  pousse('la réponse changée', c => { c.controle.reponse = '99999/1'; });
  // Arrondir un ENTIER ne l'abîme pas : « 6,00 » se relit 6. Il faut donc une
  // réponse qui ait vraiment des décimales à perdre, sinon la falsification
  // passe sans mordre et l'on croit le contrôle éprouvé alors qu'il ne l'est
  // pas.
  pousse('la réponse arrondie à deux décimales', c => {
    const a = lireQ(c.controle.reponse);
    const v = Number(a.n) / Number(a.d);
    if (Math.abs(v * 100 - Math.round(v * 100)) < 1e-9) throw new Error('rien à perdre');
    c.controle.ecritReponse = v.toFixed(2).replace('.', ',');
  });
  pousse('le trou rebouché dans l’énoncé', c => {
    c.enonce[1] = String(c.enonce[1]).replace('…', '7');
  });
  pousse('un second trou', c => {
    c.enonce[1] = String(c.enonce[1]) + ' = <span class="frac" dir="ltr"><span class="num">…</span><span class="den">2</span></span>';
  });
  pousse('aide absente', c => { c.indice = ''; });
  pousse('chaîne tronquée', c => { c.etapes = c.etapes.slice(0, 3); });

  let bon = 0;
  for (const [nom, q] of cas) {
    if (!q) { console.log('⚠ NON ÉPROUVÉ ' + nom); continue; }
    let probs; try { probs = verifierBrut(q); } catch (e) { probs = ['exception: ' + e.message]; }
    console.log((probs.length ? '✗ rejeté  ' : '⚠ ACCEPTÉ ') + nom
      + (probs.length ? ' — ' + String(probs[0]).slice(0, 70) : ''));
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
  + ' égalités refaites, ' + controles + ' contrôles, '
  + (mauvais ? mauvais + ' ERREURS.' : '0 erreur.'));
process.exit(mauvais ? 1 : 0);
