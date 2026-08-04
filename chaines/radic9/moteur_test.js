// Test de non-régression du moteur : les expressions sont PRISES DANS LES
// FICHES, et les résultats attendus sont ceux que les fiches publient.
//   node moteur_test.js
const F = require('./noyau.js');
const R = require('./racines.js');

const CAS = [
  // écrire sous la forme a√b  (série 4, exercice 1)
  ['√8', '2√2'], ['√18', '3√2'], ['√32', '4√2'], ['√50', '5√2'], ['√98', '7√2'],
  ['√12', '2√3'], ['√48', '4√3'], ['√75', '5√3'],
  ['√18 + √8', '5√2'], ['2√50', '10√2'], ['√50 - √18', '2√2'], ['2√98 + 3√8', '20√2'],
  // exercices 2, 3, 5, 6, 7
  ['√200 - √50 + √49', '7 + 5√2'],
  ['2√5(√5 - 1) - 4', '6 - 2√5'], ['√245 - √45', '4√5'],
  ['√50 - √8(√2 + 1)', '3√2 - 4'],
  ['1 + √2(2 + √2)', '3 + 2√2'], ['3 + √32 - 3√8', '3 - 2√2'],
  ['(√3 + 2)^2', '7 + 4√3'], ['3√18 - √32 + 7', '7 + 5√2'],
  ['(√5 + 1)/2 × (√5 - 1)/2', '1'],
  ['2√3(√3 - 1) - 2', '4 - 2√3'], ['2√75 - √48 - 2√12', '2√3'],
  // produits et quotients  (série 4, exercices 2 et 4)
  ['15√12/(5√3)', '6'], ['√11 × √(45/44)', '3/2 √5'],
  ['(√3 + 5)(2√3 + 1)', '11 + 11√3'], ['1/√2 + √2/2', '√2'],
  ['-5/√3/(2√3/3)', '-5/2'],
  ['√(20/125) × √50', '2√2'], ['(5√5 - 5)/√5', '5 - √5'],
  ['3√3 × √28/(√27 × √63)', '2/3'],
  ['√27 × √72/√6', '18'], ['√15 × √28/√21', '2√5'],
  ['√25 + √81 - √121', '3'],
  // séries 5 : conjugués, carrés, valeurs absolues
  ['(1 + √5)/(√5 - 1) + (1 - √5)/(√5 + 1)', '√5'],
  ['2√21/√343 - √45/√441', '2/7 √3 - 1/7 √5'],
  ['√((√2 - 2)^2) + √((2 - √2)^2)', '4 - 2√2'],
  ['√((√3 - 2)^2) + (√3 + 2)', '4'],
  ['15√45/√27', '5√15'],
  ['|2 + √2| - |-3 - √2|', '-1'],
  ['√5(√5 + 1) - 3√5', '5 - 2√5'],
  ['2√2 × (3/2 × √2)', '6'],
  ['(√2 + 3)(√2 - 1)', '-1 + 2√2'],
  ['√2(2 - 3√2) - 4(√2 - 9/4)', '3 - 2√2'],
  ['√45 - √20 + 2√80', '9√5'], ['√8 + √200 - √128', '4√2'],
  ['7/(√2 + 1) - 1/(√2 - 1)', '6√2 - 8']
];

let mauvais = 0;
for (const [src, attendu] of CAS) {
  let obtenu;
  try { obtenu = R.ecrire(R.analyser(src)); }
  catch (e) { obtenu = 'ERREUR: ' + e.message; }
  // on compare les NOMBRES, pas les chaînes : « 5√2 + 7 » et « 7 + 5√2 »
  // désignent le même réel, et l'ordre d'écriture n'est pas la question.
  let ok = false;
  try { ok = R.memes(R.analyser(src), R.analyser(attendu)); } catch (e) { ok = false; }
  if (!ok) { mauvais++; console.log('✗ ' + src.padEnd(38) + ' → ' + obtenu + '   [attendu ' + attendu + ']'); }
}
console.log('\n' + CAS.length + ' expressions des fiches, ' + mauvais + ' écart(s).');
process.exit(mauvais ? 1 : 0);
