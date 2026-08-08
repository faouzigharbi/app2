/* Devoirati — noyau : arithmétique exacte sur les fractions.
   Toutes les fractions sont normalisées : dénominateur > 0, réduite par le PGCD. */
(function (DV) {
  'use strict';

  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { var t = b; b = a % b; a = t; }
    return a || 1;
  }

  function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
  }

  function Frac(n, d) {
    if (d === undefined) d = 1;
    if (!Number.isInteger(n) || !Number.isInteger(d)) {
      throw new Error('Frac : numérateur et dénominateur doivent être entiers (' + n + '/' + d + ')');
    }
    if (d === 0) throw new Error('Frac : dénominateur nul');
    var s = d < 0 ? -1 : 1;
    var g = gcd(n, d);
    this.n = s * n / g;
    this.d = s * d / g;
  }

  Frac.of = function (n, d) { return new Frac(n, d); };

  Frac.cast = function (x) {
    if (x instanceof Frac) return x;
    if (Number.isInteger(x)) return new Frac(x, 1);
    throw new Error('Frac.cast : valeur non convertible');
  };

  Frac.prototype.add = function (o) { o = Frac.cast(o); return new Frac(this.n * o.d + o.n * this.d, this.d * o.d); };
  Frac.prototype.sub = function (o) { o = Frac.cast(o); return new Frac(this.n * o.d - o.n * this.d, this.d * o.d); };
  Frac.prototype.mul = function (o) { o = Frac.cast(o); return new Frac(this.n * o.n, this.d * o.d); };
  Frac.prototype.div = function (o) {
    o = Frac.cast(o);
    if (o.n === 0) throw new Error('Frac : division par zéro');
    return new Frac(this.n * o.d, this.d * o.n);
  };
  Frac.prototype.neg = function () { return new Frac(-this.n, this.d); };
  Frac.prototype.inv = function () {
    if (this.n === 0) throw new Error('Frac : inverse de zéro');
    return new Frac(this.d, this.n);
  };
  Frac.prototype.pow = function (k) {
    if (!Number.isInteger(k)) throw new Error('Frac.pow : exposant entier requis');
    if (k < 0) return this.inv().pow(-k);
    return new Frac(Math.pow(this.n, k), Math.pow(this.d, k));
  };
  Frac.prototype.abs = function () { return new Frac(Math.abs(this.n), this.d); };
  Frac.prototype.eq = function (o) { o = Frac.cast(o); return this.n === o.n && this.d === o.d; };
  Frac.prototype.cmp = function (o) { o = Frac.cast(o); return this.n * o.d - o.n * this.d; };
  Frac.prototype.isInt = function () { return this.d === 1; };
  Frac.prototype.isNeg = function () { return this.n < 0; };
  Frac.prototype.valueOf = function () { return this.n / this.d; };
  Frac.prototype.toString = function () { return this.d === 1 ? String(this.n) : this.n + '/' + this.d; };

  /* Un rationnel est décimal ssi, une fois réduit, son dénominateur
     ne contient que les facteurs premiers 2 et 5. */
  Frac.prototype.isDecimal = function () {
    var d = this.d;
    while (d % 2 === 0) d /= 2;
    while (d % 5 === 0) d /= 5;
    return d === 1;
  };

  /* Décomposition en facteurs premiers : 84 -> [[2,2],[3,1],[7,1]] */
  function factorize(n) {
    n = Math.abs(n);
    var out = [];
    for (var p = 2; p * p <= n; p++) {
      var e = 0;
      while (n % p === 0) { n /= p; e++; }
      if (e) out.push([p, e]);
    }
    if (n > 1) out.push([n, 1]);
    return out;
  }

  DV.Frac = Frac;
  DV.gcd = gcd;
  DV.lcm = lcm;
  DV.factorize = factorize;
})(window.DV = window.DV || {});
