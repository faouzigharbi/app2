// Les exercices de la fiche qui reposent sur LES CRITÈRES DE DIVISIBILITÉ et
// sur le dénombrement — exercices 1, 3, 4, 5 et 6.
//
// Le fil commun : on ne divise jamais. On décompose le diviseur en deux
// facteurs PREMIERS ENTRE EUX, on applique le critère de chacun, et on croise
// les deux conditions. C'est ce croisement que la fiche appelle « شجرة
// الإختيار » : un chiffre d'abord, l'autre ensuite, et l'arbre se referme.
//
// Le point délicat, et il est mathématique : décomposer 12 en 4 × 3 est
// légitime (4 et 3 sont premiers entre eux), mais le décomposer en 6 × 2 ne
// l'est PAS — 12 divise 12, alors que 6 et 2 divisent tous deux 6. Le
// générateur n'utilise donc que des couples premiers entre eux.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Arith;
  const { ent, choix, melanger } = F;

  // « 5^1 » s'écrit « 5 » : une puissance d'exposant 1 ne se note pas.
  const pw = (a, e) => (e === 0 ? '1' : e === 1 ? String(a) : a + '^' + e);

  const pgcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; };
  const somme = t => t.reduce((s, x) => s + x, 0);
  const chiffres = n => String(n).split('').map(Number);
  const listeAr = t => t.join(' ؛ ');

  // -------------------------------------------------------------------------
  // Les critères, et le texte qui les énonce.
  // -------------------------------------------------------------------------
  const CRITERE = {
    2: 'رقم آحاده زوجي',
    4: 'العدد المكوّن من رقمي عشراته و آحاده يقبل القسمة على 4',
    5: 'رقم آحاده 0 أو 5',
    8: 'العدد المكوّن من أرقام مئاته و عشراته و آحاده يقبل القسمة على 8',
    10: 'رقم آحاده 0',
    3: 'مجموع أرقامه يقبل القسمة على 3',
    9: 'مجموع أرقامه يقبل القسمة على 9'
  };
  // combien de chiffres de la fin le critère regarde-t-il ?
  const PORTEE = { 2: 1, 5: 1, 10: 1, 4: 2, 8: 3 };

  // =========================================================================
  // EXERCICE 1 — شجرة الإختيار : deux chiffres inconnus, un diviseur composé.
  // =========================================================================
  function question1() {
    for (let essai = 0; essai < 900; essai++) {
      const u = choix([2, 4, 5, 8, 10]);
      const v = choix([3, 9]);
      const d = u * v;
      // y est toujours le chiffre des unités ; x se place ailleurs, mais jamais
      // dans la zone que regarde le critère de u — sinon les deux conditions
      // s'enchevêtrent et l'arbre n'a plus de branches.
      const positions = [0, 1, 2].filter(p => p < 4 - PORTEE[u]);
      if (!positions.length) continue;
      const px = choix(positions);
      const fixes = [];
      for (let i = 0; i < 3; i++) fixes.push(i === px ? null : ent(0, 9));
      if (fixes[0] === 0) continue;                    // pas de zéro en tête

      const motif = fixes.map((c, i) => (i === px ? 'x' : String(c))).join('') + 'y';
      const nombre = (x, y) => {
        const t = fixes.map((c, i) => (i === px ? x : c));
        return t[0] * 1000 + t[1] * 100 + t[2] * 10 + y;
      };

      // les valeurs de y admises par le critère de u — elles ne dépendent pas
      // de x, c'est exactement ce qu'on a arrangé plus haut
      const ys = [];
      for (let y = 0; y <= 9; y++) {
        const fin = PORTEE[u] === 1 ? y
          : PORTEE[u] === 2 ? fixes[2] * 10 + y
            : fixes[1] * 100 + fixes[2] * 10 + y;
        if (fin % u === 0) ys.push(y);
      }
      if (!ys.length || ys.length > 3) continue;

      const couples = [];
      for (const y of ys) {
        for (let x = px === 0 ? 1 : 0; x <= 9; x++) {
          if (nombre(x, y) % d === 0) couples.push([x, y]);
        }
      }
      if (couples.length < 2 || couples.length > 8) continue;

      const finTexte = PORTEE[u] === 1 ? 'y'
        : PORTEE[u] === 2 ? String(fixes[2]) + 'y'
          : String(fixes[1]) + String(fixes[2]) + 'y';
      const sommeFixe = somme(fixes.filter((c, i) => i !== px));

      const etapes = [
        ['نفكّك القاسم', d + ' = ' + u + ' × ' + v + ' و العددان ' + u + ' و ' + v
          + ' أوليان فيما بينهما، فيكفي أن يقبل العدد القسمة على كلّ منهما'],
        ['شرط القسمة على ' + u, 'العدد يقبل القسمة على ' + u + ' إذا كان ' + CRITERE[u]],
        ['نطبّقه على ' + finTexte, 'القيم الممكنة لـ y هي: ' + listeAr(ys)],
        ['شرط القسمة على ' + v, 'العدد يقبل القسمة على ' + v + ' إذا كان ' + CRITERE[v]],
        ['نكتب مجموع الأرقام', 'مجموع أرقام العدد هو ' + sommeFixe + ' + x + y']
      ];
      for (const y of ys) {
        const xs = couples.filter(c => c[1] === y).map(c => c[0]);
        etapes.push(['الحالة y = ' + y, 'المجموع يصبح ' + (sommeFixe + y)
          + ' + x، و منه ' + (xs.length ? 'x ∈ { ' + listeAr(xs) + ' }' : 'لا حلّ')]);
      }
      etapes.push(['النتيجة', 'الأزواج الممكنة (x ؛ y) هي: '
        + couples.map(c => '(' + c[0] + ' ؛ ' + c[1] + ')').join(' ؛ ')]);

      return {
        enonce: ['أنجز شجرة الإختيار للرقمين x و y ليكون العدد ' + motif
                 + ' قابلا للقسمة على ' + d],
        indice: 'فكّك ' + d + ' إلى ' + u + ' × ' + v + ': ابدأ بشرط ' + u
          + ' الذي يحدّد y، ثمّ شرط ' + v + ' الذي يحدّد x',
        etapes,
        controle: { type: 'chiffres', fixes, px, d, trouves: couples,
                    modele: 'u' + u + 'v' + v }
      };
    }
    return question1();
  }

  const exercice1 = () => Array.from({ length: 4 }, question1);

  // =========================================================================
  // EXERCICE 3 — صواب أو خطأ مع التعليل. Une affirmation, et la chaîne est sa
  // démonstration — ou son contre-exemple. La moitié des énoncés de la fiche
  // sont faux, et c'est le plus instructif : un contre-exemple suffit.
  // =========================================================================
  const MODELES_3 = ['coprimes', 'pairImpair', 'produitPremier', 'resteFaux',
                     'combinaison', 'consecutifs', 'resteNombre', 'chiffreFinal'];

  function question3(modele) {
    if (modele === 'coprimes') {
      // « an + b et cn + d sont premiers entre eux » — faux : g les divise tous
      const g = choix([2, 3, 5, 7]);
      const a = g * ent(1, 4), b = g * ent(1, 4), c = g * ent(1, 4), e = g * ent(1, 4);
      const E1 = a + 'n + ' + b, E2 = c + 'n + ' + e;
      return {
        enonce: ['أجب بصواب أو خطأ مع التعليل:',
                 'العددان ' + E1 + ' و ' + E2 + ' أوليان فيما بينهما مهما يكن العدد الصحيح n'],
        indice: 'ابحث عن عامل مشترك ظاهر في العبارتين',
        etapes: [
          ['نفكّك العبارة الأولى', E1 + ' = ' + g + '(' + (a / g) + 'n + ' + (b / g) + ')'],
          ['نفكّك العبارة الثانية', E2 + ' = ' + g + '(' + (c / g) + 'n + ' + (e / g) + ')'],
          ['نستنتج قاسما مشتركا', 'العدد ' + g + ' يقسم العبارتين مهما يكن n'],
          ['نقارن بالتعريف', 'عددان أوليان فيما بينهما ق.م.أ لهما يساوي 1، و هنا ق.م.أ يقبل القسمة على ' + g],
          ['الجواب', 'خطأ']
        ],
        controle: { type: 'verite', valeur: false, modele,
                    verif: { kind: 'coprimeToujours', e1: E1, e2: E2 } }
      };
    }

    if (modele === 'pairImpair') {
      const g = choix([3, 5, 7, 9]);
      const pair = 2 * g, impair = g * choix([3, 5]);
      return {
        enonce: ['أجب بصواب أو خطأ مع التعليل:',
                 'عدد صحيح زوجي و عدد صحيح فردي يكونان دائما أوليين فيما بينهما'],
        indice: 'يكفي مثال مضادّ واحد لهدم قاعدة',
        etapes: [
          ['ما تقوله العبارة', 'العبارة تدّعي أنّ الزوجية و الفردية تكفيان للأوّلية فيما بينهما'],
          ['نبحث عن مثال مضادّ', 'نأخذ ' + pair + ' و هو زوجي، و ' + impair + ' و هو فردي'],
          ['نفكّك العددين', pair + ' = ' + g + ' × 2 و ' + impair + ' = ' + g + ' × ' + (impair / g)],
          ['نحسب القاسم المشترك', 'العدد ' + g + ' يقسم ' + pair + ' و يقسم ' + impair],
          ['نستنتج', 'ق.م.أ لهما يقبل القسمة على ' + g + ' فهو ليس 1'],
          ['الجواب', 'خطأ']
        ],
        controle: { type: 'verite', valeur: false, modele,
                    verif: { kind: 'pgcdVaut', a: pair, b: impair, attendu: 1 } }
      };
    }

    if (modele === 'produitPremier') {
      // « n^3 - n est premier » ou « n^2 + n est premier » — faux
      const carre = Math.random() < 0.5;
      const expr = carre ? 'n^2 + n' : 'n^3 - n';
      const fact = carre ? 'n(n + 1)' : 'n(n - 1)(n + 1)';
      const n0 = carre ? ent(3, 8) : ent(3, 8);
      const val = carre ? n0 * n0 + n0 : n0 * n0 * n0 - n0;
      return {
        enonce: ['أجب بصواب أو خطأ مع التعليل:',
                 'العدد ' + expr + ' عدد أوّلي مهما يكن العدد الصحيح الطبيعي n'],
        indice: 'فكّك العبارة: عدد أوّلي لا يُكتب جداء عاملين أكبر من 1',
        etapes: [
          ['نفكّك العبارة', expr + ' = ' + fact],
          ['ما هو العدد الأوّلي', 'العدد الأوّلي له قاسمان فقط: 1 و نفسه'],
          ['العبارة جداء', 'العبارة مكتوبة جداء عوامل، فهي ليست أوّلية بصفة عامّة'],
          ['مثال مضادّ', 'من أجل n = ' + n0 + ' نجد ' + expr.replace(/n/g, String(n0))
            + ' = ' + val],
          ['نفكّك المثال', val + ' = ' + fact.replace(/n/g, String(n0))],
          ['الجواب', 'خطأ']
        ],
        controle: { type: 'verite', valeur: false, modele,
                    verif: { kind: 'premierToujours', expr, de: 2, a: 12 } }
      };
    }

    if (modele === 'resteFaux') {
      // « si x = ay + b alors le reste de x par c est b » avec b ≥ c : faux
      const c = choix([4, 5, 6, 8, 9]);
      const a = c * ent(2, 4);
      const b = c + ent(1, c - 1);
      const vrai = b % c;
      return {
        enonce: ['أجب بصواب أو خطأ مع التعليل:',
                 'إذا كان x = ' + a + 'y + ' + b + ' فإنّ باقي قسمة x على ' + c
                 + ' هو ' + b],
        indice: 'الباقي في القسمة الإقليدية أصغر تماما من القاسم',
        etapes: [
          ['شرط الباقي', 'الباقي في القسمة على ' + c + ' يجب أن يكون أصغر تماما من ' + c],
          ['نقارن', b + ' > ' + c],
          ['العدد المقترح ليس باقيا', 'العدد ' + b + ' لا يمكن أن يكون باقي قسمة على ' + c],
          ['نُظهر الباقي الحقيقي', b + ' = ' + c + ' × ' + Math.floor(b / c) + ' + ' + vrai],
          ['نعيد كتابة x', a + 'y + ' + b + ' = ' + c + '(' + (a / c) + 'y + '
            + Math.floor(b / c) + ') + ' + vrai],
          ['الباقي الحقيقي', 'الباقي هو ' + vrai + ' لأنّ ' + vrai + ' < ' + c],
          ['الجواب', 'خطأ']
        ],
        controle: { type: 'verite', valeur: false, modele,
                    verif: { kind: 'resteToujours', expr: a + 'y + ' + b, d: c, r: b } }
      };
    }

    if (modele === 'combinaison') {
      // « an + b est divisible par g » avec g | a et g | b : vrai
      const g = choix([3, 4, 6, 7, 8]);
      const a = g * ent(2, 9), b = g * ent(2, 9);
      const E = a + 'n + ' + b;
      return {
        enonce: ['أجب بصواب أو خطأ مع التعليل:',
                 'مهما يكن العدد الصحيح n فإنّ ' + E + ' يقبل القسمة على ' + g],
        indice: 'انظر إن كان ' + g + ' يقسم المعاملين معا',
        etapes: [
          ['نقسم المعامل الأوّل', a + ' = ' + g + ' × ' + (a / g)],
          ['نقسم الحدّ الثابت', b + ' = ' + g + ' × ' + (b / g)],
          ['نُخرج العامل المشترك', E + ' = ' + g + '(' + (a / g) + 'n + ' + (b / g) + ')'],
          ['نستنتج', 'العبارة مكتوبة ' + g + ' × عدد صحيح، مهما يكن n'],
          ['الجواب', 'صواب']
        ],
        controle: { type: 'verite', valeur: true, modele,
                    verif: { kind: 'divisibleToujours', expr: E, d: g } }
      };
    }

    if (modele === 'consecutifs') {
      // « tout nombre de trois chiffres consécutifs est multiple de d »
      // vrai pour 3, faux pour 9
      const d = choix([3, 9]);
      const bons = [];
      for (let n = 1; n <= 7; n++) {
        const nb = n * 100 + (n + 1) * 10 + (n + 2);
        if (nb % d === 0) bons.push(nb);
      }
      const contre = [];
      for (let n = 1; n <= 7; n++) {
        const nb = n * 100 + (n + 1) * 10 + (n + 2);
        if (nb % d !== 0) contre.push(nb);
      }
      const vrai = contre.length === 0;
      return {
        enonce: ['أجب بصواب أو خطأ مع التعليل:',
                 'كلّ عدد صحيح مكوّن من ثلاثة أرقام متتالية هو مضاعف لـ ' + d],
        indice: 'اكتب العدد بدلالة رقم مئاته n ثمّ احسب مجموع أرقامه',
        etapes: [
          ['نسمّي رقم المئات', 'نسمّي n رقم المئات، فتكون الأرقام n و n + 1 و n + 2'],
          ['شرط القسمة على ' + d, 'العدد يقبل القسمة على ' + d + ' إذا كان ' + CRITERE[d]],
          ['نحسب مجموع الأرقام', 'n + (n + 1) + (n + 2) = 3n + 3'],
          ['نفكّك المجموع', '3n + 3 = 3(n + 1)'],
          [vrai ? 'المجموع مضاعف لـ 3' : 'المجموع ليس دائما مضاعفا لـ 9',
            vrai ? 'المجموع مضاعف لـ 3 مهما يكن n، فالشرط محقّق دائما'
              : 'المجموع 3(n + 1) ليس دائما مضاعفا لـ 9: مثلا العدد ' + contre[0]],
          ['الجواب', vrai ? 'صواب' : 'خطأ']
        ],
        controle: { type: 'verite', valeur: vrai, modele,
                    verif: { kind: 'consecutifs', d } }
      };
    }

    if (modele === 'resteNombre') {
      const d = choix([7, 8, 9, 11, 12]);
      const N = ent(1200, 9800);
      const vrai = N % d;
      const juste = Math.random() < 0.5;
      const annonce = juste ? vrai : (vrai + 1 + ent(0, d - 2)) % d;
      return {
        enonce: ['أجب بصواب أو خطأ مع التعليل:',
                 'باقي القسمة الإقليدية لـ ' + N + ' على ' + d + ' هو ' + annonce],
        indice: 'أنجز القسمة الإقليدية: N = d × q + r مع r أصغر تماما من d',
        etapes: [
          ['نبحث عن الخارج', 'أكبر مضاعف لـ ' + d + ' لا يفوق ' + N + ' هو ' + d
            + ' × ' + Math.floor(N / d)],
          ['نحسب هذا المضاعف', d + ' × ' + Math.floor(N / d) + ' = ' + (d * Math.floor(N / d))],
          ['نحسب الباقي', N + ' - ' + (d * Math.floor(N / d)) + ' = ' + vrai],
          ['نتحقّق من الشرط', vrai + ' < ' + d],
          ['نكتب القسمة الإقليدية', N + ' = ' + d + ' × ' + Math.floor(N / d) + ' + ' + vrai],
          ['الجواب', juste ? 'صواب' : 'خطأ']
        ],
        controle: { type: 'verite', valeur: juste, modele,
                    verif: { kind: 'resteNombre', N, d, r: annonce } }
      };
    }

    // chiffreFinal : « quel que soit le chiffre a, le nombre …a5 est divisible
    // par 4 » — faux, il se termine par un chiffre impair.
    const tete = ent(100, 999);
    const dernier = choix([0, 5]);
    const d = dernier === 0 ? choix([5, 10]) : 4;
    const vrai = dernier === 0;
    const motif = tete + 'a' + dernier;
    const contreEx = tete * 100 + 3 * 10 + dernier;
    return {
      enonce: ['أجب بصواب أو خطأ مع التعليل:',
               'مهما يكن الرقم a فإنّ العدد ' + motif + ' يقبل القسمة على ' + d],
      indice: 'انظر إلى ما يطلبه شرط القسمة على ' + d + ': رقم الآحاد أم رقمان؟',
      etapes: [
        ['شرط القسمة على ' + d, 'العدد يقبل القسمة على ' + d + ' إذا كان ' + CRITERE[d]],
        ['رقم الآحاد معلوم', 'رقم آحاد العدد ' + motif + ' هو ' + dernier],
        [vrai ? 'الشرط لا يتعلّق بـ a' : 'الشرط يتعلّق بـ a',
          vrai ? 'الشرط يتعلّق برقم الآحاد وحده، و هو ' + dernier + ' مهما يكن a'
            : 'الشرط يتعلّق برقمي العشرات و الآحاد، أي بالعدد a' + dernier + ' الذي يتغيّر مع a'],
        [vrai ? 'نستنتج' : 'مثال مضادّ',
          vrai ? 'العدد يقبل القسمة على ' + d + ' مهما يكن a'
            : 'من أجل a = 3 نجد العدد ' + contreEx + ' الذي لا يقبل القسمة على ' + d],
        ['الجواب', vrai ? 'صواب' : 'خطأ']
      ],
      controle: { type: 'verite', valeur: vrai, modele: 'chiffreFinal',
                  verif: { kind: 'motifChiffre', tete, dernier, d } }
    };
  }

  const exercice3 = () => melanger(MODELES_3).slice(0, 4).map(question3);

  // =========================================================================
  // EXERCICE 4 — un grand nombre écrit en toutes lettres, puis une division
  // euclidienne dont le dividende est un produit de puissances.
  // =========================================================================
  function exercice4() {
    // ---- question 1 : critère sur un nombre de dix chiffres ----------------
    let N, u, v, d;
    for (;;) {
      u = choix([2, 4, 5, 10]); v = choix([3, 9]); d = u * v;
      N = ent(1, 9) * 1e9 + Math.floor(Math.random() * 1e9);
      N = Math.round(N / d) * d;
      if (String(N).length !== 10) continue;
      if (N % d !== 0) continue;
      break;
    }
    const cs = chiffres(N), S = somme(cs);
    const finN = PORTEE[u] === 1 ? cs[9] : Number(String(N).slice(-2));

    // ---- question 2 : division euclidienne d'un produit de puissances ------
    let q2 = null;
    for (let essai = 0; essai < 900 && !q2; essai++) {
      const a = choix([2, 3, 5]);
      const p = ent(20, 60), ecart = ent(1, Math.max(1, Math.floor(Math.log(50) / Math.log(a))));
      const s = choix([2, 3]);
      if ((p + ecart) % s !== 0) continue;
      const deguise = Math.pow(a, s) + '^' + ((p + ecart) / s);
      const k = choix([9, 25, 27, 49, 81, 121]);
      const V = 1 - Math.pow(a, ecart);                 // le contenu de la parenthèse
      const total = V * k;                              // le coefficient devant a^p
      const m = choix(diviseursDe(Math.abs(total)).filter(x => x >= 6 && x <= 200));
      if (!m) continue;
      const quotientCoef = total / m;
      const expr = '(' + pw(a, p) + ' - ' + deguise + ') × ' + k;
      const unifie = '(' + pw(a, p) + ' - ' + pw(a, p + ecart) + ') × ' + k;
      const factorise = pw(a, p) + '(1 - ' + pw(a, ecart) + ') × ' + k;
      const produit = total + ' × ' + pw(a, p);
      const quotient = (quotientCoef === 1 ? '' : quotientCoef === -1 ? '-'
        : (quotientCoef < 0 ? '(' + quotientCoef + ') × ' : quotientCoef + ' × '))
        + pw(a, p);
      q2 = {
        enonce: ['حدّد باقي و خارج القسمة الإقليدية للجداء', expr, 'على ' + m + ' و علّل جوابك'],
        indice: 'وحّد الأساس، ضع ' + a + '^' + p + ' عاملا مشتركا، ثمّ اقسم العدد الصغير على ' + m,
        etapes: [
          ['نوحّد الأساس', deguise + ' = ' + pw(a, p + ecart)],
          ['نعيد كتابة الجداء', expr + ' = ' + unifie],
          ['نُخرج العامل المشترك', unifie + ' = ' + factorise],
          ['نحسب داخل القوس', '1 - ' + pw(a, ecart) + ' = ' + V],
          ['نضرب في ' + k, V + ' × ' + k + ' = ' + total],
          ['نكتب الجداء', expr + ' = ' + produit],
          ['نُظهر القاسم ' + m, produit + ' = ' + m + ' × (' + quotient + ')'],
          ['الباقي', 'الجداء مضاعف لـ ' + m + ' فباقي القسمة يساوي 0'],
          ['الخارج', 'الخارج هو ' + quotient]
        ],
        controle: { type: 'division', expr, m, quotient, reste: 0, modele: 'a' + a }
      };
    }

    const q1 = {
      enonce: ['بيّن أنّ العدد ' + N + ' يقبل القسمة على ' + d],
      indice: 'فكّك ' + d + ' إلى ' + u + ' × ' + v + ' و طبّق الشرطين',
      etapes: [
        ['نفكّك القاسم', d + ' = ' + u + ' × ' + v + ' و العددان أوليان فيما بينهما'],
        ['شرط القسمة على ' + u, 'العدد يقبل القسمة على ' + u + ' إذا كان ' + CRITERE[u]],
        ['نتحقّق من الشرط الأوّل', 'نهاية العدد هي ' + finN + ' و هي تقبل القسمة على ' + u],
        ['شرط القسمة على ' + v, 'العدد يقبل القسمة على ' + v + ' إذا كان ' + CRITERE[v]],
        ['نحسب مجموع الأرقام', cs.join(' + ') + ' = ' + S],
        ['نتحقّق من الشرط الثاني', S + ' يقبل القسمة على ' + v],
        ['النتيجة', 'العدد يقبل القسمة على ' + u + ' و على ' + v + ' و هما أوليان فيما بينهما، فهو يقبل القسمة على ' + d]
      ],
      controle: { type: 'divisible', expr: String(N), d, modele: 'u' + u + 'v' + v }
    };
    return q2 ? [q1, q2] : [q1];
  }

  function diviseursDe(n) {
    const d = [];
    for (let k = 1; k <= n; k++) if (n % k === 0) d.push(k);
    return d;
  }

  // =========================================================================
  // EXERCICE 5 — les nombres qu'on peut ÉCRIRE avec des chiffres donnés. Ce
  // n'est plus un critère qu'on applique à un nombre : c'est une liste qu'on
  // construit, et le critère sert à la trier.
  // =========================================================================
  function exercice5() {
    for (let essai = 0; essai < 400; essai++) {
      const pool = melanger([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4).sort((a, b) => a - b);
      const pairs = pool.filter(c => c % 2 === 0);
      if (pairs.length !== 2) continue;

      const tous = [];
      for (const c of pool) for (const b of pool) for (const a of pool) {
        if (c === b || c === a || b === a) continue;
        tous.push(c * 100 + b * 10 + a);
      }
      const zPairs = tous.filter(n => n % 2 === 0).sort((x, y) => x - y);
      const z4 = zPairs.filter(n => n % 4 === 0);
      if (!z4.length || z4.length === zPairs.length) continue;

      const casPar = pairs.map(u => ({
        u, liste: zPairs.filter(n => n % 10 === u)
      }));

      return [
        {
          enonce: ['أوجد الأعداد الزوجية المتكوّنة من ثلاثة أرقام مختلفة'
                   + ' باستعمال الأرقام ' + listeAr(pool)],
          indice: 'عدد زوجي معناه رقم آحاده زوجي: ابدأ بتثبيت رقم الآحاد',
          etapes: [
            ['شرط الزوجية', 'العدد زوجي إذا كان ' + CRITERE[2]],
            ['الأرقام الزوجية المتوفّرة', 'من بين ' + listeAr(pool) + ' الأرقام الزوجية هي '
              + listeAr(pairs)],
            ['نحسب عدد الإمكانيات', 'بعد تثبيت رقم الآحاد يبقى 3 اختيارات للمئات ثمّ 2 للعشرات، أي 6 أعداد'],
            ...casPar.map(c => ['الحالة: رقم الآحاد ' + c.u,
              'الأعداد هي ' + listeAr(c.liste)]),
            ['النتيجة', 'عدد الأعداد الزوجية هو ' + zPairs.length + ' و هي: ' + listeAr(zPairs)]
          ],
          controle: { type: 'listeNombres', pool, filtre: 'pair', trouves: zPairs,
                      modele: 'pairs' }
        },
        {
          enonce: ['استنتج من بين الأعداد المتحصّل عليها الأعداد القابلة للقسمة على 4',
                   'الأعداد الزوجية هي: ' + listeAr(zPairs)],
          indice: 'شرط القسمة على 4 ينظر إلى العدد المكوّن من رقمي العشرات و الآحاد',
          etapes: [
            ['شرط القسمة على 4', 'العدد يقبل القسمة على 4 إذا كان ' + CRITERE[4]],
            ...casPar.map(c => ['نفحص الأعداد المنتهية بـ ' + c.u,
              'من بينها تقبل القسمة على 4: '
              + (c.liste.filter(n => n % 4 === 0).length
                ? listeAr(c.liste.filter(n => n % 4 === 0)) : 'لا شيء')]),
            ['نجمع الحالات', 'نجمع ما وجدناه في الحالتين'],
            ['النتيجة', 'الأعداد القابلة للقسمة على 4 هي: ' + listeAr(z4)]
          ],
          controle: { type: 'listeNombres', pool, filtre: 'div4', trouves: z4,
                      modele: 'div4' }
        }
      ];
    }
    return exercice5();
  }

  // =========================================================================
  // EXERCICE 6 — LE DÉNOMBREMENT. Le principe multiplicatif, et rien d'autre :
  // à chaque place on compte ce qui reste.
  // =========================================================================
  function exercice6() {
    const n = ent(4, 7);
    const k = ent(2, 3);
    const objets = choix([
      { nom: 'سيّارات', place: 'مركز', action: 'تصطفّ أمام خطّ الإنطلاق', tri: 'تتويج' },
      { nom: 'عدّاءين', place: 'مركز', action: 'يشاركون في سباق', tri: 'تتويج' },
      { nom: 'فرق', place: 'مركز', action: 'تشارك في بطولة', tri: 'ترتيب' }
    ]);
    const facteurs = Array.from({ length: k }, (_, i) => n - i);
    const arrangement = facteurs.reduce((a, b) => a * b, 1);
    const total = Array.from({ length: n }, (_, i) => n - i).reduce((a, b) => a * b, 1);
    const fige = Array.from({ length: n - 1 }, (_, i) => n - 1 - i).reduce((a, b) => a * b, 1);

    return [
      {
        enonce: [n + ' ' + objets.nom + ' مرقّمة من 1 إلى ' + n + ' ' + objets.action + '.',
                 'ما هو عدد إمكانيات ' + objets.tri + ' ال' + (k === 2 ? 'أوّلين' : 'ثلاثة الأولى')
                 + ' دون الحصول على اثنين في نفس الرتبة؟'],
        indice: 'املأ المراكز واحدا واحدا: كلّما وُضع واحد نقص الإختيار بواحد',
        etapes: [
          ['المبدأ', 'نملأ المراكز الواحد بعد الآخر، ثمّ نضرب عدد الإختيارات'],
          ...facteurs.map((f, i) => ['المركز ' + (i + 1),
            i === 0 ? 'كلّ ال' + objets.nom + ' ممكنة، أي ' + f + ' إختيارات'
              : 'بقي ' + f + ' إختيارات بعد شغل ' + i + ' من المراكز']),
          ['نضرب الإختيارات', facteurs.join(' × ') + ' = ' + arrangement],
          ['النتيجة', 'عدد الإمكانيات هو ' + arrangement]
        ],
        controle: { type: 'denombrement', n, k, valeur: arrangement, modele: 'arrangement' }
      },
      {
        enonce: ['ما هو عدد الترتيبات الكاملة الممكنة لل' + n + ' ' + objets.nom + '؟'],
        indice: 'نفس المبدأ، لكن إلى غاية المركز الأخير',
        etapes: [
          ['المبدأ', 'نملأ كلّ المراكز، من الأوّل إلى الأخير'],
          ['عدد الإختيارات في كل مركز', 'المركز الأوّل ' + n + '، ثمّ ' + (n - 1)
            + '، و هكذا إلى غاية 1'],
          ['نضرب', Array.from({ length: n }, (_, i) => n - i).join(' × ') + ' = ' + total],
          ['النتيجة', 'عدد الترتيبات الكاملة هو ' + total]
        ],
        controle: { type: 'denombrement', n, k: n, valeur: total, modele: 'permutation' }
      },
      {
        enonce: ['كم ترتيبا كاملا ممكنا إذا كانت ال' + objets.nom.slice(0, 6)
                 + ' رقم 1 في المركز الأوّل دائما؟'],
        indice: 'المركز الأوّل لم يعد حرّا: يبقى ترتيب البقيّة',
        etapes: [
          ['المركز الأوّل محجوز', 'المركز الأوّل له إختيار واحد فقط'],
          ['يبقى الباقي', 'يبقى ' + (n - 1) + ' في ' + (n - 1) + ' مراكز'],
          ['نضرب', '1 × ' + Array.from({ length: n - 1 }, (_, i) => n - 1 - i).join(' × ')
            + ' = ' + fige],
          ['النتيجة', 'عدد الترتيبات هو ' + fige]
        ],
        controle: { type: 'denombrement', n: n - 1, k: n - 1, valeur: fige, modele: 'fige' }
      }
    ];
  }

  const API = { exercice1, exercice3, exercice4, exercice5, exercice6,
                question1, question3, MODELES_3, CRITERE, PORTEE };
  if (M) module.exports = API;
  else racine.Crit = API;
})(typeof window !== 'undefined' ? window : globalThis);
