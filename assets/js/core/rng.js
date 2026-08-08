/* Devoirati — noyau : générateur pseudo-aléatoire déterministe.
   Une même graine produit toujours la même fiche : c'est ce qui permet
   de partager un « code de fiche » et de réimprimer le corrigé à l'identique. */
(function (DV) {
  'use strict';

  function hashSeed(str) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function Rng(seed) {
    this.seed = String(seed);
    this._next = mulberry32(hashSeed(this.seed));
  }

  Rng.prototype.float = function () { return this._next(); };

  /* Entier dans [min, max] inclus. Tolère min > max (les bornes sont remises en ordre)
     — l'un des bugs des anciens fichiers venait justement d'un intervalle inversé. */
  Rng.prototype.int = function (min, max) {
    min = Math.ceil(min); max = Math.floor(max);
    if (min > max) { var t = min; min = max; max = t; }
    return min + Math.floor(this._next() * (max - min + 1));
  };

  Rng.prototype.pick = function (arr) { return arr[this.int(0, arr.length - 1)]; };

  Rng.prototype.bool = function (p) { return this._next() < (p === undefined ? 0.5 : p); };

  Rng.prototype.shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = this.int(0, i);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };

  /* Entier de [min,max] différent de `not` (évite les boucles infinies). */
  Rng.prototype.intExcept = function (min, max, not) {
    for (var k = 0; k < 40; k++) {
      var v = this.int(min, max);
      if (v !== not) return v;
    }
    return min === not ? min + 1 : min;
  };

  /* Fraction aléatoire réduite, dénominateur dans [dMin,dMax], non entière. */
  Rng.prototype.frac = function (nMin, nMax, dMin, dMax) {
    for (var k = 0; k < 60; k++) {
      var d = this.int(dMin, dMax);
      var n = this.int(nMin, nMax);
      if (d > 1 && n !== 0 && DV.gcd(n, d) === 1) return new DV.Frac(n, d);
    }
    return new DV.Frac(1, 2);
  };

  /* Code de fiche court et lisible, ex. « K7M2QX ». */
  DV.newSeed = function () {
    var abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var s = '';
    for (var i = 0; i < 6; i++) s += abc[Math.floor(Math.random() * abc.length)];
    return s;
  };

  DV.Rng = Rng;
})(window.DV = window.DV || {});
