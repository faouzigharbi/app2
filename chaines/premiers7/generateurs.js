// Quatre chaînes de démonstration, d'après demo_chain_*.html :
//   1. un nombre est un carré parfait          (المربع الكامل)
//   2. un nombre est le cube d'un entier       (المكعّب)
//   3. un nombre est multiple d'un autre       (المضاعف)
//   4. le produit de deux nombres est un carré (جداء مربع كامل)
//
// Les nombres sont tirés à chaque fois et la chaîne est reconstruite avec eux.
// Les étapes portent les puissances en notation « 7^2 », rendue « 7² » à
// l'affichage : c'est cette forme brute que le validateur peut calculer.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports)
    ? require('./moteur.js') : racine.Moteur;
  const { ent, choix, evalNat } = M;

  // p^1 s'écrit p, pas p^1.
  const pui = (b, e) => (e === 1 ? String(b) : b + '^' + e);
  const PREMIERS = [2, 3, 5, 7];

  function deuxPremiers(pool) {
    const t = pool || PREMIERS;
    const p = choix(t);
    let q = choix(t);
    while (q === p) q = choix(t);
    return [p, q];
  }

  // Deux ou trois facteurs premiers distincts, pour que les énoncés varient.
  function quelquesPremiers(combien) {
    const t = PREMIERS.slice();
    const out = [];
    for (let i = 0; i < combien; i++) out.push(t.splice(Math.floor(Math.random() * t.length), 1)[0]);
    return out.sort((a, b) => a - b);
  }

  // ==========================================================================
  // 1 — Carré parfait
  // ==========================================================================
  function carre() {
    let prems, exps, racine;
    do {
      prems = quelquesPremiers(ent(2, 3));
      exps = prems.map(() => ent(1, 2));
      racine = prems.reduce((r, p, i) => r * Math.pow(p, exps[i]), 1);
    } while (racine > 600);
    const N = racine * racine;
    const base = prems.map((p, i) => pui(p, exps[i])).join(' × ');
    const carreFacteurs = prems.map((p, i) => pui(p, 2 * exps[i])).join(' × ');
    const listeExps = exps.map(e => 2 * e).join(' و ');

    return {
      titre: 'المربع الكامل',
      enonce: ['بيّن بالتفكيك إلى جداء عوامل أوّلية أنّ العدد التالي مربّع كامل، ثمّ احسب جذره التربيعي:',
               String(N)],
      etapes: [
        ['نفكّك إلى عوامل أوّلية', N + ' = ' + carreFacteurs],
        ['نلاحظ', 'الأسس ' + listeExps + ' كلّها زوجية'],
        ['نكتب على شكل مربّع', N + ' = (' + base + ')^2'],
        ['نحسب الأساس', base + ' = ' + racine],
        ['نستنتج', N + ' = ' + racine + '^2'],
        ['الجذر التربيعي', '= ' + racine]
      ],
      res: racine
    };
  }

  // ==========================================================================
  // 2 — Cube d'un entier
  // ==========================================================================
  function cube() {
    let p, q, ep, eq, racine;
    do {
      [p, q] = deuxPremiers([2, 3, 5, 7, 11]);
      ep = ent(1, 2); eq = ent(1, 2);
      racine = Math.pow(p, ep) * Math.pow(q, eq);
    } while (racine > 60);                 // le cube doit rester lisible
    const N = Math.pow(racine, 3);
    const base = pui(p, ep) + ' × ' + pui(q, eq);

    return {
      titre: 'المكعّب',
      enonce: ['بيّن بالتفكيك إلى جداء عوامل أوّلية أنّ العدد التالي مكعّب لعدد صحيح طبيعي، ثمّ حدّده:',
               String(N)],
      etapes: [
        ['نفكّك إلى عوامل أوّلية', N + ' = ' + pui(p, 3 * ep) + ' × ' + pui(q, 3 * eq)],
        ['نلاحظ', 'الأسّان ' + (3 * ep) + ' و ' + (3 * eq) + ' مضاعفان للعدد 3'],
        ['نكتب على شكل مكعّب', N + ' = (' + base + ')^3'],
        ['نحسب الأساس', base + ' = ' + racine],
        ['نستنتج', N + ' = ' + racine + '^3'],
        ['العدد المطلوب', '= ' + racine]
      ],
      res: racine
    };
  }

  // ==========================================================================
  // 3 — Multiple d'un autre nombre
  // ==========================================================================
  function multiple() {
    const [p, q] = deuxPremiers();
    const ep = ent(3, 5), eq = ent(3, 5);
    const B = p * p * q * q;
    const rp = ep - 2, rq = eq - 2;
    const k = Math.pow(p, rp) * Math.pow(q, rq);
    const A = pui(p, ep) + ' × ' + pui(q, eq);
    const facteur = pui(p, rp) + ' × ' + pui(q, rq);

    return {
      titre: 'المضاعف',
      enonce: ['بيّن أنّ العدد A مضاعف للعدد B، ثمّ حدّد خارج القسمة الإقليدية لـ A على B:',
               'A = ' + A + '   و   B = ' + B],
      etapes: [
        ['نكتب B بالعوامل الأوّلية', p + '^2 × ' + q + '^2 = ' + B],
        ['نفصل الأسس لإظهار B', A + ' = (' + p + '^2 × ' + q + '^2) × (' + facteur + ')'],
        ['نعوّض', '(' + p + '^2 × ' + q + '^2) × (' + facteur + ') = ' + B + ' × ' + k],
        ['نلاحظ', 'العامل الثاني عدد صحيح طبيعي، إذن A مضاعف للعدد B'],
        ['خارج القسمة', facteur + ' = ' + k],
        ['النتيجة', '= ' + k]
      ],
      res: k
    };
  }

  // ==========================================================================
  // 4 — Le produit de deux nombres est un carré parfait
  //
  // a = p²×q² − p²×c  avec c = q² − q, donc a = p²×q après mise en facteur.
  // b = 2^(2j) × q × p², donc a×b = (p² × q × 2^j)².
  // On met en facteur, on ne développe jamais.
  // ==========================================================================
  function produitCarre() {
    const [p, q] = deuxPremiers();
    const j = ent(1, 3);

    const c = q * q - q;                    // pour que q² − c = q
    const deux = Math.pow(2, 2 * j);
    const p2 = p * p;
    const a = p2 * q;
    const b = deux * q * p2;
    const racine = p2 * q * Math.pow(2, j);

    const exprA = p + '^2 × ' + q + '^2 - ' + p + '^2 × ' + c;
    const exprB = deux + ' × ' + q + ' × ' + p2;
    const baseFin = p + '^2 × ' + q + ' × ' + pui(2, j);

    return {
      titre: 'جداء مربّع كامل',
      enonce: ['نعتبر العددين a و b التاليين. بيّن أنّ الجداء a × b مربّع كامل، ثمّ احسب جذره التربيعي:',
               'a = ' + exprA + '   و   b = ' + exprB],
      etapes: [
        ['العامل المشترك في a', p + '^2'],
        ['نضع العامل المشترك', exprA + ' = ' + p + '^2 × (' + q + '^2 - ' + c + ')'],
        ['ننجز القوس', p + '^2 × (' + q + '^2 - ' + c + ') = ' + p + '^2 × ' + q],
        ['نفكّك b', exprB + ' = 2^' + (2 * j) + ' × ' + q + ' × ' + p + '^2'],
        ['نحسب الجداء', '(' + p + '^2 × ' + q + ') × (2^' + (2 * j) + ' × ' + q + ' × ' + p + '^2) = 2^'
          + (2 * j) + ' × ' + q + '^2 × ' + p + '^4'],
        ['نلاحظ', 'جميع الأسس زوجية'],
        ['نكتب على شكل مربّع', '2^' + (2 * j) + ' × ' + q + '^2 × ' + p + '^4 = (' + baseFin + ')^2'],
        ['نحسب الأساس', baseFin + ' = ' + racine],
        ['الجذر التربيعي', '= ' + racine]
      ],
      res: racine,
      controle: { a, b, produit: a * b, racine }
    };
  }

  // ==========================================================================
  const PREUVES = {
    1: { titre: 'المربع الكامل', f: carre },
    2: { titre: 'المكعّب', f: cube },
    3: { titre: 'المضاعف', f: multiple },
    4: { titre: 'جداء مربّع كامل', f: produitCarre }
  };

  const PAR_PAGE = 4;

  // Chaînes brutes — c'est cette forme que verifier.js contrôle.
  function tirer(n, combien) {
    const out = [];
    for (let i = 0; i < (combien || PAR_PAGE); i++) out.push(PREUVES[n].f());
    return out;
  }

  // -------------------------------------------------------------------------
  // Rendu : puissances en <sup>, expressions isolées en dir="ltr"
  // -------------------------------------------------------------------------
  const sup = s => String(s).replace(/\^(\d+)/g, '<sup>$1</sup>');
  const bloc = s => '<span dir="ltr" style="display:inline-block;white-space:nowrap">'
    + sup(s) + '</span>';

  // Une étape mêlant arabe et chiffres : on isole seulement les portions math.
  const RUN = /[0-9A-Za-z+\-*×÷/=^().,]+(\s+[0-9A-Za-z+\-*×÷/=^().,]+)*/g;
  function isoMixte(texte) {
    return String(texte).replace(RUN, m => {
      const n = m.trim();
      if (!/\d/.test(n) || !/[+\-*×÷/=^]/.test(n)) return m;
      const i = m.indexOf(n);
      return m.slice(0, i) + bloc(n) + m.slice(i + n.length);
    });
  }

  const estMath = s => /^[\d\s+\-*×÷/=^().]+$/.test(String(s));
  const rendreMath = s => (estMath(s) ? bloc(String(s).trim()) : isoMixte(s));

  function rendre(brut) {
    return {
      operation: brut.enonce[0] + '<br>' + rendreMath(brut.enonce[1]),
      // LA DIFFICULTÉ SE LIT SUR LA CORRECTION — voir noyau.js des chapitres
      // récents : c'est la LONGUEUR du chemin qui fait qu'un exercice est dur,
      // et elle se compte sur la correction elle-même, pas sur la rubrique.
      difficulte: (() => {
        const n = (brut.etapes || []).length;
        return n <= 4 ? 'facile' : (n <= 6 ? 'moyen' : 'difficile');
      })(),
      steps: brut.etapes.map(e => e[0] + ': ' + rendreMath(e[1])),
      hint: 'اقرأ الأسس: هي التي تدل على الشكل المطلوب'
    };
  }

  function construire(n) {
    return {
      id: 'preuve' + n,
      title: 'سلسلة برهان ' + n + ' — ' + PREUVES[n].titre,
      questions: tirer(n).map(rendre)
    };
  }

  const API = { PREUVES, PAR_PAGE, tirer, rendre, construire, evalNat };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Preuves = API;
})(typeof window !== 'undefined' ? window : globalThis);
