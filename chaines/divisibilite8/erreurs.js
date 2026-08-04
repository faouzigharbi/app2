// Les pages « أين الخطأ؟ » — divisibilite8.
//
// ENGENDRÉ PAR _regles/porter.js — ne pas éditer à la main. Les règles vivent
// dans _regles/catalogue.js ; une correction s'y fait, puis se rejoue ici.
//
// Dans la chaîne, les étapes sont JUSTES et EN DÉSORDRE : l'élève reconstruit
// le raisonnement. Ici elles sont DANS L'ORDRE et l'une d'elles est FAUSSE :
// l'élève juge le raisonnement.
//
// LES SEPT RÈGLES DU CONTRAT :
//   1. aucune fiche sans son validateur au vert ;
//   2. aucune faute de calcul — un chiffre changé ne viole aucune règle ;
//   3. la faute sur l'étape PIVOT, jamais sur la mise en place ni le résultat ;
//   4. quand aucune règle n'est en jeu, aucune faute : le corrigé reste juste
//      et l'élève doit le dire ;
//   5. MAIN reste ouverte aux fautes vues dans les copies ;
//   6. on dit ce qu'on n'a pas pu faire ;
//   7. jamais deux fois la même faute à la suite.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./arith.js') : racine.Arith;
  const J = M ? require('./juge.js') : racine.Juge;

  const interdit = () => false;

  // ── Outils de découpe ───────────────────────────────────────────────────
  function termes(s) {
      const out = [];
      let prof = 0, barres = 0, debut = 0;
      for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (c === '(' || c === '[') prof++;
        else if (c === ')' || c === ']') prof--;
        else if (c === '|') barres ^= 1;
        else if ((c === '+' || c === '-') && prof === 0 && !barres && i > debut) {
          if ('([+-×*/^:'.indexOf(s[i - 1]) >= 0) continue;
          out.push(s.slice(debut, i));
          debut = i;
        }
      }
      out.push(s.slice(debut));
      return out.map(t => t.trim()).filter(t => t.length);
    }

  function relation(s) {
      const m = String(s).split(/\s*([<>≤≥=])\s*/);
      if (m.length < 3) return null;
      const membres = [], ops = [];
      for (let i = 0; i < m.length; i++) (i % 2 ? ops : membres).push(m[i]);
      return { membres, ops };
    }

  const recoller = r => {
    let out = r.membres[0];
    for (let i = 0; i < r.ops.length; i++) out += ' ' + r.ops[i] + ' ' + r.membres[i + 1];
    return out;
  };

  function monome(t) {
      const m = /^\s*([+-]?)\s*([0-9]+(?:\/[0-9]+)?)?\s*([a-zA-Z]+(?:\^[0-9]+)?)?\s*$/.exec(t);
      if (!m || (!m[2] && !m[3])) return null;
      return { signe: m[1] || '+', coef: m[2] || null, lettre: m[3] || null };
    }

  const estMajal = s => /[[\]][^;]*;/.test(s) || /[∩∪]/.test(s);
  const sansSigne = t => String(t).replace(/^[+-]\s*/, '').trim();

  // L'adaptateur : les fiches n'ont pas toutes le même noyau, les règles ne
  // connaissent que ces noms-là.
  const A = {
    ent: F.ent, choix: F.choix, pgcd: F.pgcd,
    txt: F.txt || F.sTxt || F.rTxt,
    add: F.add || F.sAdd, sub: F.sub || F.sSub, mul: F.mul || F.sMul,
    val: t => { try { return F.analyser(String(t).replace(/×/g, '*'), {}); }
                catch (e) { return null; } },
    // Les fiches d'arithmétique CALCULENT : leur juge expose l'évaluation en
    // entiers naturels, et les règles de puissance et de priorité s'en
    // servent. Les autres fiches n'en ont pas, et ces règles s'y abstiennent.
    nat: (typeof J.nat === 'function') ? J.nat : null
  };

  // Une faute doit rester CRÉDIBLE : ce qu'un élève écrit vraiment. On refuse
  // les écritures qu'aucune copie ne porte — une faute qui se repère à sa
  // laideur plutôt qu'à son erreur n'apprend rien.
  //
  // Le contrôle porte sur ce que la faute INTRODUIT, jamais sur ce que l'étape
  // portait déjà : une fiche qui met des fractions au même dénominateur écrit
  // « 35/15 » à chaque ligne, et refuser toute fraction non réduite y
  // interdirait toutes les fautes. C'est arrivé — et cela avait tué en silence
  // les deux règles du chapitre.
  function credible(s, vrai) {
    if (interdit(s)) return false;
    if (/(^|[^\w])1\s*[a-zA-Z(√]/.test(s)) return false;              // « 1x »
    if (/(^|[^\w])([a-zA-Z])\s+\2([^\w]|$)/.test(s)) return false;   // « x x »
    const dejaLa = new Set(String(vrai || '').match(/\d+\/\d+/g) || []);
    let m; const re = /(\d+)\/(\d+)/g;
    while ((m = re.exec(s))) {
      if (dejaLa.has(m[0])) continue;
      if (Number(m[2]) === 1) return false;                            // « 3/1 »
      if (F.pgcd(Number(m[1]), Number(m[2])) !== 1) return false;      // « 4/2 »
    }
    const r = relation(s);
    if (r) for (let i = 1; i < r.membres.length; i++) {
      if (r.membres[i].trim() === r.membres[i - 1].trim()) return false;
    }
    return true;
  }

  // ── Les règles de CE chapitre ───────────────────────────────────────────
  const FAMILLES = [
    {
      nom: "القوّة خُلطت بالجداء",
      quoi: "a^n جداء n عاملا كلّها a، لا a × n : 3^2 = 3 × 3 = 9، و ليس 6",
      geste: /^(?!\s*(?:النتيجة|نترجم|نلاحظ|القاعدة|إذن|وهو المطلوب|العدد المطلوب|الجذر التربيعي|أكبر حرف|كل الحلول))/,
      faire: function(math, A) {
          if (!A.nat) return null;
          const r = relation(math);
          if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
          // La puissance doit être dans le membre CALCULÉ, à gauche : on récrit
          // la valeur annoncée, jamais le donné.
          if (!/\d\s*\^\s*\d/.test(r.membres[0])) return null;
          // Et le membre annoncé doit être un NOMBRE : une étape qui écrit
          // « 2^4 × 7^4 = (2^2 × 7^2)^2 » annonce une FORME, pas une valeur, et
          // y substituer un nombre ne raconterait aucune faute d'élève.
          if (!/^\s*\d+\s*$/.test(r.membres[1])) return null;
          const naif = r.membres[0].replace(/(\d+)\s*\^\s*(\d+)/g,
                                            (s, a, n) => '(' + a + ' * ' + n + ')');
          const v = A.nat(naif), juste = A.nat(r.membres[1]);
          if (v === null || juste === null || v === juste || v < 0) return null;
          return r.membres[0].trim() + ' = ' + v;
        }
    },
    {
      nom: "ترتيب العمليات لم يُحترم",
      quoi: "الأقواس أوّلا، ثمّ الضرب و القسمة، ثمّ الجمع و الطرح: 2 × (220 + 200) = 840، و ليس 2 × 220 + 200",
      geste: /^(?!\s*(?:النتيجة|نترجم|نلاحظ|القاعدة|إذن|وهو المطلوب|العدد المطلوب|الجذر التربيعي|أكبر حرف|كل الحلول))/,
      faire: function(math, A) {
          if (!A.nat) return null;
          const r = relation(math);
          if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
          const g = r.membres[0];
          if (!/\(/.test(g)) return null;
          // Et le membre annoncé doit être un NOMBRE : une étape qui écrit
          // « 2^4 × 7^4 = (2^2 × 7^2)^2 » annonce une FORME, pas une valeur, et
          // y substituer un nombre ne raconterait aucune faute d'élève.
          if (!/^\s*\d+\s*$/.test(r.membres[1])) return null;
          // Les parenthèses tombent, et l'ordre d'écriture prend leur place :
          // c'est exactement le calcul de l'élève pressé.
          const nu = g.replace(/[()]/g, ' ');
          const v = A.nat(nu), juste = A.nat(g);
          if (v === null || juste === null || v === juste || v < 0) return null;
          return g.trim() + ' = ' + v;
        }
    },
    {
      nom: "جمعنا حيث تقول القاعدة نضرب",
      quoi: "القاعدة تنتهي بجداء لا بمجموع: عدد القواسم (2+1) × (2+1) = 9، و ليس (2+1) + (2+1) = 6",
      geste: /^(?!\s*(?:النتيجة|نترجم|نلاحظ|القاعدة|إذن|وهو المطلوب|العدد المطلوب|الجذر التربيعي|أكبر حرف|كل الحلول))/,
      faire: function(math, A) {
          if (!A.nat) return null;
          const r = relation(math);
          if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
          const g = r.membres[0];
          if (/[×*]/.test(g)) {
            // Même exigence : le membre annoncé est une valeur, pas une forme.
            if (!/^\s*\d+\s*$/.test(r.membres[1])) return null;
            const somme = g.replace(/[×*]/g, '+');
            const v = A.nat(somme), juste = A.nat(g);
            if (v === null || juste === null || v === juste || v < 0) return null;
            return g.trim() + ' = ' + v;
          }
          // Le membre donné est un simple nombre — « 1296 = 216 × 6 » : c'est le
          // produit annoncé qui devient somme. « 4356 = 2^2 + 3^2 + 11^2 » : la
          // décomposition écrite en somme de facteurs premiers, qu'on lit dans
          // les copies chaque année.
          if (!/^\s*\d+\s*$/.test(g) || !/[×*]/.test(r.membres[1])) return null;
          const droite = r.membres[1].replace(/[×*]/g, '+');
          const w = A.nat(droite);
          if (w === null || w === A.nat(g)) return null;
          return g.trim() + ' = ' + droite.trim();
        }
    },
    {
      nom: "قسمنا حيث يجب أن نضرب",
      quoi: "للتخلّص من معامل نقسم عليه؛ الضرب فيه يُبعد عن الحلّ بدل أن يقرّب",
      geste: /نقسم|نضرب الطرفين|مقلوب|على المعامل|خارج القسمة|نصيب|عدد|الثمن|نبحث/,
      faire: function(math) {
          if (math.indexOf(':') < 0) return null;
          return math.replace(':', '×');
        }
    },
    {
      nom: "الأسّ طُرح بدل أن يُقسم",
      quoi: "لكتابة عدد على شكل مربّع أو مكعّب يُقسم كلّ أسّ على 2 أو على 3، لا يُطرح منه: 5^6 = (5^3)^2 لأنّ 3 × 2 = 6",
      geste: /^(?!\s*(?:النتيجة|نترجم|نلاحظ|القاعدة|إذن|وهو المطلوب|العدد المطلوب|الجذر التربيعي|أكبر حرف|كل الحلول))/,
      faire: function(math) {
          const r = relation(math);
          if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
          const m = /^\s*\(([^()]+)\)\s*\^\s*(\d+)\s*$/.exec(r.membres[1]);
          if (!m) return null;
          const k = Number(m[2]);
          let fait = false;
          const base = m[1].replace(/(\d+)\s*\^\s*(\d+)/g, function (s, a, b) {
            const bb = Number(b) * k - k;
            if (fait || bb < 1 || bb === Number(b)) return s;
            fait = true;
            return a + '^' + bb;
          });
          if (!fait) return null;
          return r.membres[0].trim() + ' = (' + base + ')^' + k;
        }
    }
  ];

  // ── Les fautes déclarées à la main, qui priment sur tout ────────────────
  //
  //   '3/2': [{ rang: 4, faux: '…', famille: '…', quoi: '…' }]
  //
  // Clé « numéro d'exercice / rang du volet ». C'est ici que viennent se poser
  // les fautes vues dans les copies. Le validateur les contrôle comme les
  // autres : une faute déclarée qui se trouverait vraie est rejetée.
  const MAIN = {};

  // ── La fabrique ─────────────────────────────────────────────────────────
  //
  //   interdites — les familles du volet PRÉCÉDENT. Deux fois la même faute à
  //   la suite et l'élève cesse de juger : il applique. L'interdit est donc
  //   dur ; si la question n'offre rien d'autre, on n'y met AUCUNE faute
  //   plutôt que de répéter.
  //   vues — les familles déjà rencontrées dans la page : simple pénalité.
  function fabriquer(question, fautes, interdites, vues, cle) {
    interdites = interdites || new Set();
    vues = vues || new Set();
    const c = question.controle;
    const envs = J.environnements(c);
    const juge = m => J.evaluerEtape(m, envs);

    const mains = (MAIN[cle] || []).filter(f => juge(f.faux) === 'fausse'
                                             && juge(question.etapes[f.rang][1]) === 'vraie');

    const sain = () => ({ controle: c, enonce: question.enonce,
                          indice: question.indice,
                          etapes: question.etapes.map(e => [e[0], e[1]]),
                          fautes: [], sain: true });

    const rangs = [];
    question.etapes.forEach(function (e, i) {
      if (juge(e[1]) === 'vraie') rangs.push(i);
    });
    // Il doit rester du vrai après la faute : une chaîne dont tout serait faux
    // ne demanderait plus de juger. Faute de quoi, on laisse le corrigé
    // intact — jamais on ne perd la question, l'élève doit les avoir toutes.
    // Le NIVEAU est une intention, pas une exigence : quand la chaîne n'offre
    // pas de quoi placer deux fautes en laissant du vrai après elles, on en
    // place une plutôt que de rendre le volet sain. Un volet sain doit être un
    // choix — « aucune règle n'est en jeu ici » — jamais un aveu d'impuissance.
    if (rangs.length < fautes + 1) fautes = rangs.length - 1;
    if (fautes < 1) return sain();

    function candidats(i) {
      const vrai = question.etapes[i][1];
      const libelle = question.etapes[i][0];
      const out = [];
      FAMILLES.forEach(function (fam, rang) {
        if (fam.geste && !fam.geste.test(libelle)) return;
        for (let essai = 0; essai < 8; essai++) {
          let faux;
          try { faux = fam.faire(vrai, A); } catch (e) { faux = null; }
          if (!faux || faux === vrai || !credible(faux, vrai)) continue;
          if (juge(faux) !== 'fausse') continue;
          out.push({ rang: i, faux: faux, vrai: vrai, famille: fam.nom,
                     quoi: fam.quoi, interdite: interdites.has(fam.nom),
                     priorite: rang + (vues.has(fam.nom) ? 20 : 0) });
          break;
        }
      });
      return out;
    }

    // ON CHOISIT LA FAUTE, PAS L'ÉTAPE : on énumère tous les couples
    // (étape, famille) de la chaîne entière et l'on prend le meilleur, où
    // qu'il soit. Tirer d'abord une étape ferait gagner les étapes pauvres.
    let tous = mains.map(f => ({ rang: f.rang, faux: f.faux,
                                 vrai: question.etapes[f.rang][1],
                                 famille: f.famille, quoi: f.quoi, priorite: -1 }));
    rangs.forEach(function (i) { tous = tous.concat(candidats(i)); });

    // AUCUNE FAUTE DE COMPRÉHENSION POSSIBLE ? On n'en invente pas.
    if (!tous.length) return sain();

    const choisies = [];
    for (let n = 0; n < fautes; n++) {
      const libres = tous.filter(x => choisies.every(c2 => c2.rang !== x.rang));
      if (!libres.length) return choisies.length ? finir(choisies) : sain();
      const permises = libres.filter(x => !x.interdite);
      if (!permises.length && !choisies.length) return sain();
      const base = permises.length ? permises : libres;
      const neuves = base.filter(x => choisies.every(c2 => c2.famille !== x.famille));
      const pool = neuves.length ? neuves : base;
      const min = Math.min.apply(null, pool.map(x => x.priorite));
      choisies.push(F.choix(pool.filter(x => x.priorite === min)));
    }
    return finir(choisies);

    // La phase « corrige » : la bonne réécriture, et deux leurres FAUX.
    //
    // Un leurre garde le PREMIER MEMBRE de l'étape. Les trois options sont lues
    // côte à côte comme trois réécritures d'une même ligne : celle qui change
    // le membre donné ne réécrit plus rien, elle change la question. On a vu
    // « √5 × √5 = 5 » se faire proposer « √10 = 5 » — l'élève n'y choisit plus,
    // il devine.
    //
    // Le contrôle ne vaut QUE pour l'égalité à deux membres — « donné = travail ».
    // Un encadrement « -3 < x < -2 » n'a pas de donné à gauche : ses trois
    // membres forment un seul énoncé, et tous ont le droit de bouger.
    function memeDonnee(leurre, vrai) {
      const a = relation(leurre), b = relation(vrai);
      if (!a || !b) return true;
      if (b.ops.length !== 1 || b.ops[0] !== '=') return true;
      return a.membres[0].trim() === b.membres[0].trim();
    }

    function finir(choisies) {
    choisies.sort((a, b) => a.rang - b.rang);
    choisies.forEach(function (f) {
      const opts = [f.vrai];
      for (let essai = 0; essai < 60 && opts.length < 3; essai++) {
        const fam = F.choix(FAMILLES);
        let leurre;
        try { leurre = fam.faire(f.vrai, A); } catch (e) { leurre = null; }
        if (!leurre || leurre === f.vrai || leurre === f.faux) continue;
        if (!credible(leurre, f.vrai) || opts.indexOf(leurre) >= 0) continue;
        if (!memeDonnee(leurre, f.vrai)) continue;
        if (juge(leurre) !== 'fausse') continue;
        opts.push(leurre);
      }
      f.choix = melanger(opts);
      f.bonne = f.choix.indexOf(f.vrai);
    });

    return {
      // La page emporte SON contrôle : sans lui, le validateur re-tirerait la
      // question et jugerait les étapes d'une page dans l'environnement d'une
      // autre.
      controle: c,
      enonce: question.enonce,
      indice: question.indice,
      etapes: question.etapes.map(function (e, i) {
        const f = choisies.find(x => x.rang === i);
        return [e[0], f ? f.faux : e[1]];
      }),
      fautes: choisies
    };
    }
  }

  function melanger(t) {
    const a = t.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = F.ent(0, i);
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  const complete = p => !!p && p.fautes.every(f => f.choix.length >= 2);

  function pageErreurs(n, fautes) {
    const vues = new Set();
    let precedentes = new Set();
    const qs = F.tirer(n);
    return qs.map(function (q, qi) {
      let dernier = null;
      const cle = n + '/' + (qi + 1);
      for (let essai = 0; essai < 10; essai++) {
        const p = fabriquer(q, fautes, precedentes, vues, cle)
               || fabriquer(q, 1, precedentes, vues, cle);
        if (!p) continue;
        dernier = p;
        if (complete(p)) break;
      }
      if (dernier) {
        precedentes = new Set(dernier.fautes.map(f => f.famille));
        dernier.fautes.forEach(f => vues.add(f.famille));
      }
      return dernier;
    }).filter(Boolean);
  }

  const API = { FAMILLES, MAIN, termes, relation, credible, fabriquer, pageErreurs };
  if (M) module.exports = API; else racine.Erreurs = API;
})(typeof window !== 'undefined' ? window : globalThis);
