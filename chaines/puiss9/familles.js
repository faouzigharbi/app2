// LES FAMILLES D'EXERCICES DU CHAPITRE « القوى ».
//
// Chaque famille est une RÈGLE du programme, et non un exercice : elle sait
// fabriquer une chaîne de démonstration sur cette règle, à la difficulté qu'on
// lui demande et au niveau scolaire qu'on lui donne.
//
//     f(niveau, difficulte) → { enonce, indice, etapes, res, controle }
//
//   niveau      7, 8 ou 9. Il borne ce qu'on TIRE, jamais ce qu'on démontre :
//               en 7ème le négatif n'existe pas, en 8ème l'exposant négatif
//               arrive, en 9ème les radicaux et π. Le raisonnement, lui, est
//               le même aux trois niveaux — c'est tout l'intérêt.
//   difficulte  'facile', 'moyen' ou 'difficile'.
//
// LA DIFFICULTÉ N'EST PAS LA TAILLE DES NOMBRES. Elle est le nombre de gestes
// à enchaîner :
//   facile    — la règle s'applique telle quelle, les bases sont écrites ;
//   moyen     — il faut d'abord RECONNAÎTRE quelque chose (que 32 est 2⁵, que
//               l'exposant 1 est sous-entendu) ;
//   difficile — plusieurs règles s'enchaînent, ou il faut revenir en arrière.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Puiss;

  const { ent, choix } = F;

  // ── Petits outils d'écriture ────────────────────────────────────────────

  // « 2^1 » ne s'écrit pas : c'est « 2 ». Et « 2^0 » vaut 1, ce qui est
  // précisément le piège qu'on veut tendre — on le laisse donc s'écrire.
  const p = (b, e) => (e === 1 ? String(b) : b + '^' + e);

  // Le produit d'une liste de facteurs, tel qu'il s'écrit dans la copie.
  const prod = t => t.join(' × ');

  // Les bases qu'on ose faire manipuler, par niveau. En 7ème elles restent
  // petites : l'élève doit pouvoir reconnaître leurs puissances de tête.
  const BASES = { 7: [2, 3, 5, 7, 10, 11], 8: [2, 3, 5, 7, 10, 11, 13], 9: [2, 3, 5, 7, 10, 11, 13] };
  const base = niveau => choix(BASES[niveau] || BASES[9]);

  // Les puissances d'une base que l'élève est censé reconnaître : 4, 8, 16…
  // pour 2 ; 9, 27, 81 pour 3. C'est le cœur de la difficulté « moyen ».
  function connues(b, niveau) {
    const max = niveau === 7 ? 1000 : 100000;
    const out = [];
    for (let e = 2; Math.pow(b, e) <= max; e++) out.push([Math.pow(b, e), e]);
    return out;
  }

  const REGLE_PRODUIT = 'a^n × a^p = a^(n+p)';
  const REGLE_QUOTIENT = 'a^n : a^p = a^(n-p)';
  const REGLE_PUIS = '(a^n)^p = a^(n×p)';
  const REGLE_MEME_EXP = 'a^n × b^n = (a × b)^n';

  // ═══════════════════════════════════════════════════════════════════════
  // 1. aⁿ × aᵖ = aⁿ⁺ᵖ — le produit de deux puissances de même base
  // ═══════════════════════════════════════════════════════════════════════
  function produitMemeBase(niveau, diff) {
    const b = base(niveau);
    let exps, facteurs, etapes = [];

    if (diff === 'facile') {
      exps = [ent(2, 6), ent(2, 6)];
      facteurs = exps.map(e => p(b, e));
    } else if (diff === 'moyen') {
      // L'exposant 1 sous-entendu : « 3 × 3⁶ ». On ne le voit que si on le sait.
      exps = [1, ent(3, 8), ent(2, 6)];
      facteurs = [String(b), p(b, exps[1]), p(b, exps[2])];
    } else {
      // L'exposant 0 en plus, qui ne change rien et qu'on croit toujours perdre.
      exps = [0, ent(4, 9), ent(3, 7), 1];
      facteurs = [p(b, 0), p(b, exps[1]), p(b, exps[2]), String(b)];
    }

    const somme = exps.reduce((a, x) => a + x, 0);
    const expr = prod(facteurs);
    const res = p(b, somme);

    etapes.push(['القاعدة', REGLE_PRODUIT]);
    etapes.push(['نفس الأساس', 'الأساس هو ' + b + ' في كلّ العوامل']);
    if (diff !== 'facile') {
      etapes.push(['الأسّ الضمني', 'العدد ' + b + ' هو ' + b + '^1، و ' + b + '^0 يساوي 1']);
    }
    etapes.push(['نجمع الأسّة', exps.join(' + ') + ' = ' + somme]);
    etapes.push(['النتيجة', 'A = ' + res]);

    return {
      enonce: ['أكتب في صيغة قوّة لعدد صحيح طبيعي:', 'A = ' + expr],
      indice: 'نفس الأساس: نجمع الأسّة',
      etapes,
      res,
      controle: { type: 'valeur', expr, res, forme: 'puissance' }
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 2. (aⁿ)ᵖ = aⁿˣᵖ — la puissance d'une puissance
  // ═══════════════════════════════════════════════════════════════════════
  function puissanceDePuissance(niveau, diff) {
    const b = base(niveau);
    const etapes = [];
    let expr, res, n, q, r;

    if (diff === 'facile') {
      n = ent(2, 6); q = ent(2, 5);
      expr = '(' + p(b, n) + ')^' + q;
      res = p(b, n * q);
      etapes.push(['القاعدة', REGLE_PUIS]);
      etapes.push(['ما معنى ذلك', p(b, n) + ' مضروب في نفسه ' + q + ' مرّات']);
      etapes.push(['نضرب الأسّين', n + ' × ' + q + ' = ' + (n * q)]);
      etapes.push(['النتيجة', 'A = ' + res]);
    } else if (diff === 'moyen') {
      // Deux étages, et un exposant extérieur qui vaut 1 ou 0.
      n = ent(2, 5); q = ent(2, 4); r = ent(2, 3);
      expr = '((' + p(b, n) + ')^' + q + ')^' + r;
      res = p(b, n * q * r);
      etapes.push(['القاعدة', REGLE_PUIS]);
      etapes.push(['نبدأ بالقوس الداخلي', '(' + p(b, n) + ')^' + q + ' = ' + p(b, n * q)]);
      etapes.push(['نطبّق القاعدة مرّة ثانية', '(' + p(b, n * q) + ')^' + r + ' = ' + p(b, n * q * r)]);
      etapes.push(['نتحقّق بضرب الأسّة', n + ' × ' + q + ' × ' + r + ' = ' + (n * q * r)]);
      etapes.push(['النتيجة', 'A = ' + res]);
    } else {
      // Un produit de deux puissances de puissances — deux règles enchaînées.
      n = ent(2, 4); q = ent(2, 4);
      let m = ent(2, 4), s = ent(2, 3);
      // Deux facteurs identiques donneraient deux fois la même ligne de
      // simplification, et deux étapes interchangeables ne font pas une chaîne.
      let garde = 0;
      while (n === m && q === s && garde++ < 20) { m = ent(2, 4); s = ent(2, 3); }
      if (n === m && q === s) s = (s === 2 ? 3 : 2);
      expr = '(' + p(b, n) + ')^' + q + ' × (' + p(b, m) + ')^' + s;
      const t = n * q + m * s;
      res = p(b, t);
      etapes.push(['القاعدة الأولى', REGLE_PUIS]);
      etapes.push(['نبسّط العامل الأوّل', '(' + p(b, n) + ')^' + q + ' = ' + p(b, n * q)]);
      etapes.push(['نبسّط العامل الثاني', '(' + p(b, m) + ')^' + s + ' = ' + p(b, m * s)]);
      etapes.push(['القاعدة الثانية', REGLE_PRODUIT]);
      etapes.push(['نجمع الأسّين', (n * q) + ' + ' + (m * s) + ' = ' + t]);
      etapes.push(['النتيجة', 'A = ' + res]);
    }

    return {
      enonce: ['أكتب في صيغة قوّة لعدد صحيح طبيعي:', 'A = ' + expr],
      indice: 'قوّة القوّة: نضرب الأسّين',
      etapes,
      res,
      controle: { type: 'valeur', expr, res, forme: 'puissance' }
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 3. aⁿ × bⁿ = (a × b)ⁿ — le même exposant, deux bases
  // ═══════════════════════════════════════════════════════════════════════
  function memeExposant(niveau, diff) {
    const etapes = [];
    let a = base(niveau), b = base(niveau);
    while (b === a) b = base(niveau);
    const n = ent(2, diff === 'facile' ? 5 : 7);
    let expr, res;

    if (diff === 'facile') {
      expr = p(a, n) + ' × ' + p(b, n);
      res = p(a * b, n);
      etapes.push(['القاعدة', REGLE_MEME_EXP]);
      etapes.push(['نفس الأسّ', 'الأسّ هو ' + n + ' في العاملين']);
      etapes.push(['نضرب الأساسين', a + ' × ' + b + ' = ' + (a * b)]);
      etapes.push(['النتيجة', 'A = ' + res]);
    } else if (diff === 'moyen') {
      // L'une des deux puissances est écrite en clair : « 3⁴ × 25² » où
      // 25² se lit 5⁴ — il faut d'abord ramener au même exposant.
      const k = ent(2, 3);
      const carre = Math.pow(b, k);
      expr = p(a, n * k) + ' × ' + p(carre, n);
      res = p(a * b, n * k);
      etapes.push(['نلاحظ', 'العدد ' + carre + ' هو ' + p(b, k)]);
      etapes.push(['نعيد الكتابة', p(carre, n) + ' = ' + p(b, n * k)]);
      etapes.push(['نفس الأسّ الآن', 'الأسّ هو ' + (n * k) + ' في العاملين']);
      etapes.push(['القاعدة', REGLE_MEME_EXP]);
      etapes.push(['نضرب الأساسين', a + ' × ' + b + ' = ' + (a * b)]);
      etapes.push(['النتيجة', 'A = ' + res]);
    } else {
      // Trois bases, dont une à reconnaître.
      let c = base(niveau);
      while (c === a || c === b) c = base(niveau);
      const k = 2;
      const carre = Math.pow(c, k);
      expr = p(a, n * k) + ' × ' + p(b, n * k) + ' × ' + p(carre, n);
      res = p(a * b * c, n * k);
      etapes.push(['نلاحظ', 'العدد ' + carre + ' هو ' + p(c, k)]);
      etapes.push(['نعيد الكتابة', p(carre, n) + ' = ' + p(c, n * k)]);
      etapes.push(['نفس الأسّ الآن', 'الأسّ هو ' + (n * k) + ' في العوامل الثلاثة']);
      etapes.push(['القاعدة', REGLE_MEME_EXP]);
      etapes.push(['نضرب الأساسات', a + ' × ' + b + ' × ' + c + ' = ' + (a * b * c)]);
      etapes.push(['النتيجة', 'A = ' + res]);
    }

    return {
      enonce: ['أكتب في صيغة قوّة لعدد صحيح طبيعي:', 'A = ' + expr],
      indice: 'نفس الأسّ: نضرب الأساسات',
      etapes,
      res,
      controle: { type: 'valeur', expr, res, forme: 'puissance' }
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 4. LA BASE À RECONNAÎTRE — « 4 × 2⁷ × 32 » est une puissance de 2
  //
  // C'est la famille la plus formatrice du chapitre : la règle est connue,
  // mais elle ne s'applique qu'après avoir VU que 4, 32 et 2 ont même base.
  // ═══════════════════════════════════════════════════════════════════════
  function baseAReconnaitre(niveau, diff) {
    const b = choix([2, 3, 5]);
    const dispo = connues(b, niveau);
    const etapes = [];
    const nb = diff === 'facile' ? 2 : diff === 'moyen' ? 3 : 4;

    // Des puissances DISTINCTES : deux facteurs égaux donneraient deux fois la
    // même ligne « 4 = 2^2 », et deux étapes interchangeables ne font plus une
    // chaîne.
    const pris = [];
    const restant = dispo.slice();
    for (let i = 0; i < nb && restant.length; i++) {
      const k = ent(0, restant.length - 1);
      pris.push(restant.splice(k, 1)[0]);
    }
    if (pris.length < 2) return baseAReconnaitre(niveau, diff);
    // En difficile, un facteur est la base nue — l'exposant 1 sous-entendu.
    if (diff === 'difficile') pris[nb - 1] = [b, 1];

    const expr = prod(pris.map(x => String(x[0])));
    const somme = pris.reduce((a, x) => a + x[1], 0);
    const res = p(b, somme);

    etapes.push(['نلاحظ', 'كلّ العوامل قوى للعدد ' + b]);
    pris.forEach((x, i) => {
      etapes.push(['نكتب العامل ' + (i + 1) + ' بالأساس ' + b, x[0] + ' = ' + p(b, x[1])]);
    });
    etapes.push(['نعيد كتابة العبارة', 'A = ' + prod(pris.map(x => p(b, x[1])))]);
    etapes.push(['القاعدة', REGLE_PRODUIT]);
    etapes.push(['نجمع الأسّة', pris.map(x => x[1]).join(' + ') + ' = ' + somme]);
    etapes.push(['النتيجة', 'A = ' + res]);

    return {
      enonce: ['أكتب في صيغة قوّة لعدد صحيح طبيعي:', 'A = ' + expr],
      indice: 'كلّ العوامل قوى لنفس العدد: أرجعها إلى الأساس المشترك',
      etapes,
      res,
      controle: { type: 'valeur', expr, res, forme: 'puissance' }
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 5. LE FACTEUR COMMUN — « 3⁵ × 15 − 6 × 3⁵ = 3⁷ »
  //
  // L'exercice long du chapitre, et le plus beau : on met la puissance en
  // facteur, on calcule la parenthèse, et l'on découvre qu'elle est ELLE AUSSI
  // une puissance de la même base. Le résultat retombe sur une seule puissance.
  // ═══════════════════════════════════════════════════════════════════════
  function facteurCommun(niveau, diff) {
    const b = choix([2, 3, 5]);
    const n = ent(3, niveau === 7 ? 8 : 13);
    const etapes = [];
    // On part de la RÉPONSE : la parenthèse doit valoir une puissance de b.
    const k = ent(1, 3);
    const cible = Math.pow(b, k);            // ce que vaudra la parenthèse
    let u, v, expr, signe;

    if (diff === 'facile') {
      // b^n × u + b^n × v, avec u + v = b^k
      u = ent(1, cible - 1); v = cible - u;
      // « 2⁵ × 5 + 2⁵ × 3 » ferait écrire deux fois « 5 + 3 = 8 » : une fois
      // pour la parenthèse, une fois pour la somme des exposants. Deux étapes
      // portant la même relation cessent d'avoir un ordre.
      if (u === n && v === k) return facteurCommun(niveau, diff);
      expr = p(b, n) + ' × ' + u + ' + ' + p(b, n) + ' × ' + v;
      signe = '+';
      etapes.push(['العامل المشترك', 'العامل المشترك هو ' + p(b, n)]);
      etapes.push(['نُخرج العامل المشترك', 'A = ' + p(b, n) + ' × (' + u + ' + ' + v + ')']);
      etapes.push(['ننجز القوس', u + ' + ' + v + ' = ' + cible]);
    } else {
      // Une soustraction, et l'un des termes écrit dans l'autre ordre —
      // « 6 × 3⁵ » et non « 3⁵ × 6 » : il faut voir le facteur quand même.
      v = ent(1, 40); u = v + cible;
      expr = p(b, n) + ' × ' + u + ' - ' + v + ' × ' + p(b, n);
      signe = '-';
      etapes.push(['العامل المشترك', 'العامل المشترك هو ' + p(b, n) + '، و هو موجود في الحدّين']);
      etapes.push(['نُخرج العامل المشترك', 'A = ' + p(b, n) + ' × (' + u + ' - ' + v + ')']);
      etapes.push(['ننجز القوس', u + ' - ' + v + ' = ' + cible]);
    }

    etapes.push(['نعيد الكتابة', 'A = ' + p(b, n) + ' × ' + cible]);
    if (k > 1 || cible !== b) etapes.push(['نلاحظ', 'العدد ' + cible + ' هو ' + p(b, k)]);
    etapes.push(['القاعدة', REGLE_PRODUIT]);
    etapes.push(['نجمع الأسّين', n + ' + ' + k + ' = ' + (n + k)]);
    etapes.push(['النتيجة', 'A = ' + p(b, n + k)]);

    return {
      enonce: ['أكتب في صيغة قوّة لعدد صحيح طبيعي:', 'A = ' + expr],
      indice: 'أخرج القوّة المشتركة، ثمّ انظر إلى ما بقي في القوس',
      etapes,
      res: p(b, n + k),
      controle: { type: 'valeur', expr, res: p(b, n + k), forme: 'puissance' }
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 6. LE CALCUL D'UNE EXPRESSION — priorités, exposant 0, facteur nul
  // ═══════════════════════════════════════════════════════════════════════
  function calcul(niveau, diff) {
    const etapes = [];
    const a = ent(2, 5), b = ent(2, 4), c = ent(2, 5);
    let expr, morceaux = [];

    if (diff === 'facile') {
      expr = p(a, 2) + ' + ' + c + ' × ' + p(b, 2);
      morceaux = [[p(a, 2), Math.pow(a, 2)], [p(b, 2), Math.pow(b, 2)]];
      etapes.push(['نحدّد الأولوية', 'القوى أوّلا، ثمّ الضرب، ثمّ الجمع']);
      etapes.push(['ننجز القوى', p(a, 2) + ' = ' + Math.pow(a, 2) + ' و ' + p(b, 2) + ' = ' + Math.pow(b, 2)]);
      etapes.push(['ننجز الضرب', c + ' × ' + Math.pow(b, 2) + ' = ' + (c * Math.pow(b, 2))]);
      etapes.push(['ننجز الجمع', Math.pow(a, 2) + ' + ' + (c * Math.pow(b, 2)) + ' = '
                                 + (Math.pow(a, 2) + c * Math.pow(b, 2))]);
      etapes.push(['النتيجة', 'A = ' + (Math.pow(a, 2) + c * Math.pow(b, 2))]);
      return fin(expr, Math.pow(a, 2) + c * Math.pow(b, 2));
    }

    if (diff === 'moyen') {
      // L'exposant 0, qui vaut 1 et non 0.
      const d = ent(2, 9);
      expr = p(a, 3) + ' + ' + p(b, 2) + ' × ' + p(d, 0);
      const val = Math.pow(a, 3) + Math.pow(b, 2);
      etapes.push(['القاعدة', 'كلّ عدد غير منعدم مرفوع للأسّ 0 يساوي 1']);
      etapes.push(['نطبّق القاعدة', p(d, 0) + ' = 1']);
      etapes.push(['ننجز القوى', p(a, 3) + ' = ' + Math.pow(a, 3) + ' و ' + p(b, 2) + ' = ' + Math.pow(b, 2)]);
      etapes.push(['ننجز الضرب', Math.pow(b, 2) + ' × 1 = ' + Math.pow(b, 2)]);
      etapes.push(['ننجز الجمع', Math.pow(a, 3) + ' + ' + Math.pow(b, 2) + ' = ' + val]);
      etapes.push(['النتيجة', 'A = ' + val]);
      return fin(expr, val);
    }

    // difficile : une parenthèse, une puissance de parenthèse, et un facteur nul
    const d = ent(2, 6);
    const dedans = Math.pow(a, 2) - b;
    if (dedans <= 0 || c === a || dedans === c || dedans === a) return calcul(niveau, diff);
    expr = '(' + p(a, 2) + ' - ' + b + ')^2 + ' + p(c, 2) + ' × ' + d + '^0';
    const val = Math.pow(dedans, 2) + Math.pow(c, 2);
    etapes.push(['نحدّد الأولوية', 'الأقواس أوّلا، ثمّ القوى، ثمّ الضرب، ثمّ الجمع']);
    etapes.push(['ننجز القوّة داخل القوس', p(a, 2) + ' = ' + Math.pow(a, 2)]);
    etapes.push(['ننجز القوس', Math.pow(a, 2) + ' - ' + b + ' = ' + dedans]);
    etapes.push(['نرفع القوس للأسّ 2', dedans + '^2 = ' + Math.pow(dedans, 2)]);
    etapes.push(['الأسّ 0', d + '^0 = 1']);
    etapes.push(['ننجز الضرب', p(c, 2) + ' × 1 = ' + Math.pow(c, 2)]);
    etapes.push(['ننجز الجمع', Math.pow(dedans, 2) + ' + ' + Math.pow(c, 2) + ' = ' + val]);
    etapes.push(['النتيجة', 'A = ' + val]);
    return fin(expr, val);

    function fin(e, v) {
      return {
        enonce: ['أحسب:', 'A = ' + e],
        indice: 'القوى قبل الضرب، و الضرب قبل الجمع',
        etapes,
        res: String(v),
        controle: { type: 'valeur', expr: e, res: String(v) }
      };
    }
  }

  const API = {
    produitMemeBase, puissanceDePuissance, memeExposant,
    baseAReconnaitre, facteurCommun, calcul
  };
  if (M) module.exports = API; else racine.Familles = API;
})(typeof window !== 'undefined' ? window : globalThis);
