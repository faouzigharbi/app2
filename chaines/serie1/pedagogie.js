// Contrôles de MÉTHODE, pas seulement de résultat.
//
// Deux règles du programme, que le professeur a rappelées :
//   • on ne développe jamais (57 + 34) - (47 + 34) en 57 + 34 - 47 - 34 ;
//     on repère le terme commun et on l'élimine ;
//   • quand un regroupement fait apparaître un nombre rond, on le montre :
//     299 + 277 - 77 = 299 + (277 - 77) = 299 + 200, et pas 576 - 77.
//
// Les deux sont vérifiables automatiquement — c'est ce qui les empêche de
// se reperdre à la prochaine modification.
const M = require('./moteur.js');

const strip = s => String(s).replace(/<[^>]+>/g, '');
const NUE = /^\d+(\s*[+\-]\s*\d+){3,}$/;          // 4 termes ou plus, sans parenthèse
const CHAINE_PLATE = /^\d+(\s*[+\-]\s*\d+){2,}$/;  // 3 termes ou plus

function corps(s) {
  const t = strip(s);
  const i = t.indexOf(':');
  return (i >= 0 ? t.slice(i + 1) : t).trim();
}

// Renvoie la liste des manquements de méthode d'une question.
function controler(question) {
  const probs = [];
  const enonce = corps(question.operation).replace(/^[A-Za-z]\s*=\s*/, '');
  const etapes = question.steps.map(corps);

  // 1) aucune expansion de parenthèses
  if (/[([]/.test(enonce)) {
    for (const e of etapes) {
      if (NUE.test(e)) probs.push('développement des parenthèses: « ' + e + ' »');
    }
  }

  // 2) un regroupement rond disponible doit être montré
  if (CHAINE_PLATE.test(enonce)) {
    let r = null;
    try { r = M.regroupement(enonce); } catch (e) { /* énoncé non calculable */ }
    if (r && !etapes.some(e => /[([]/.test(e))) {
      probs.push('regroupement rond disponible et non utilisé: « ' + r.avec + ' »');
    }
  }
  return probs;
}

module.exports = { controler };
