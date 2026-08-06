// L'ARITHMÉTIQUE DES GRANDS ENTIERS — pour la séance 11, exercice 2.
//
// Le noyau des radicaux compte en flottants : `3^40` y devient
// 12157665459056929000 au lieu de 12157665459056928801, et `243^1001` devient
// tout simplement l'infini. Or l'exercice 2 de la séance 11 affirme sept fois
// qu'un nombre de deux mille chiffres est divisible par 3, par 21, par 42.
// Une vérification qui déborderait en silence dirait « vrai » sans avoir rien
// calculé — c'est-à-dire exactement ce que cette machine refuse.
//
// D'où ce module : un évaluateur minuscule, en BigInt, pour les seules
// expressions dont ces exercices ont besoin — des entiers, `+`, `-`, `×`, `^`
// et des parenthèses. Rien d'autre. Pas de fraction, pas de radical : dès
// qu'une division apparaîtrait, elle ne serait plus entière, et le module
// refuse au lieu d'arrondir.
//
//   evaluer('243^1001 - 13 × 3^5000')   -> 230 × 3^5000, exactement
//   divise(n, 42)                        -> true / false, sans reste approché
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);

  // ── L'analyseur ────────────────────────────────────────────────────────
  // Une descente récursive de trois étages : somme, produit, puissance. La
  // puissance est associative à DROITE et se lie plus fort que le produit,
  // comme partout ailleurs — `13 × 3^5000` est bien 13 fois la puissance.
  function evaluer(source) {
    const src = String(source);
    let i = 0;

    const blanc = () => { while (i < src.length && /\s/.test(src[i])) i++; };
    const voir = () => { blanc(); return src[i]; };
    const prendre = c => { blanc(); if (src[i] !== c) return false; i++; return true; };

    function somme() {
      let v = produit();
      for (;;) {
        blanc();
        if (prendre('+')) v += produit();
        else if (prendre('-') || prendre('−')) v -= produit();
        else return v;
      }
    }

    function produit() {
      let v = puissance();
      for (;;) {
        blanc();
        if (prendre('×') || prendre('*')) v *= puissance();
        // La juxtaposition « 13(3 + 1) » et « 2 × 25^50 » écrit sans signe.
        else if (voir() === '(') v *= puissance();
        else return v;
      }
    }

    function puissance() {
      const base = atome();
      blanc();
      if (prendre('^')) {
        const e = puissance();
        if (e < 0n) throw new Error('exposant négatif : ' + e);
        // Un garde-fou, pas une limite mathématique : au-delà, ce n'est plus
        // un exercice de 9ᵉ mais une fuite de mémoire.
        if (e > 200000n) throw new Error('exposant démesuré : ' + e);
        return base ** e;
      }
      return base;
    }

    function atome() {
      blanc();
      if (prendre('-') || prendre('−')) return -atome();
      if (prendre('(')) {
        const v = somme();
        if (!prendre(')')) throw new Error('parenthèse non fermée');
        return v;
      }
      const debut = i;
      while (i < src.length && /[0-9]/.test(src[i])) i++;
      if (i === debut) throw new Error('entier attendu en position ' + i
                                     + ' de « ' + src + ' »');
      return BigInt(src.slice(debut, i));
    }

    const v = somme();
    blanc();
    if (i < src.length) throw new Error('reste non lu « ' + src.slice(i) + ' »');
    return v;
  }

  const divise = (n, d) => {
    const q = BigInt(d);
    if (q === 0n) throw new Error('division par zéro');
    return n % q === 0n;
  };

  // Une relation d'égalité ou d'ordre entre deux expressions entières.
  // Rend null si le texte n'est pas une relation — le même contrat que
  // `verifierRelation` du noyau, pour que l'appelant n'ait pas à deviner.
  function verifierRelation(texte) {
    const m = String(texte).match(/^(.*?)(=|<|>|≤|≥)(.*)$/);
    if (!m) return null;
    const g = evaluer(m[1]), d = evaluer(m[3]);
    switch (m[2]) {
      case '=': return g === d ? false : `${g} ≠ ${d}`;
      case '<': return g < d ? false : `${g} n'est pas < ${d}`;
      case '>': return g > d ? false : `${g} n'est pas > ${d}`;
      case '≤': return g <= d ? false : `${g} n'est pas ≤ ${d}`;
      default:  return g >= d ? false : `${g} n'est pas ≥ ${d}`;
    }
  }

  const API = { evaluer, divise, verifierRelation };
  if (M) module.exports = API; else racine.Entiers = API;
})(typeof window !== 'undefined' ? window : globalThis);
