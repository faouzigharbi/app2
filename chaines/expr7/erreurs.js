// Les pages « أين الخطأ؟ » de la fiche « العبارات الحرفية » — 7 أساسي.
//
// Dans la chaîne, les étapes sont JUSTES et EN DÉSORDRE : l'élève reconstruit
// le raisonnement. Ici elles sont DANS L'ORDRE et l'une d'elles est FAUSSE :
// l'élève juge le raisonnement.
//
// DEUX NIVEAUX : مستوى متوسّط (une faute) et مستوى متقدّم (deux).
//
// CE CATALOGUE NE CONTIENT AUCUNE FAUTE DE CALCUL.
//
// C'est la règle, et elle est absolue. Un chiffre changé, un signe recopié de
// travers, une addition ratée : l'élève qui les trouve n'a rien appris, et
// celui qui les manque n'a rien à réviser. Il aurait appris à RELIRE, quand on
// veut lui apprendre à RAISONNER.
//
// Chaque famille ci-dessous est donc une faute de COMPRÉHENSION, prise dans ce
// que le chapitre enseigne réellement. La première est celle que le professeur
// voit le plus souvent :
//
//        5a + 10b + 15 = 5(a + 2b + 15)
//
// l'élève croit que le terme constant échappe à la factorisation. Il a divisé
// 5a et 10b par 5, et laissé 15 intact. Aucun contrôle numérique ne dirait
// pourquoi c'est faux ; la page, elle, le nomme.
//
// ET CHAQUE FAUTE EST PROUVÉE. Toute étape plantée est repassée au juge du
// noyau — le MÊME que celui du validateur — et rejetée si elle se trouve
// vraie. Les leurres de la phase « corrige » subissent le même contrôle.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Expr;

  // Programme de 7ème : pas de nombres négatifs. Une faute qui en produirait
  // serait hors sujet plutôt que fausse.
  const NEGATIF = /(^|[(:=×*+\-/])\s*-\s*\d/;

  // -------------------------------------------------------------------------
  // Découper une expression en ses termes de PREMIER niveau. Un balayage, pas
  // une expression régulière — les parenthèses s'imbriquent.
  // -------------------------------------------------------------------------
  function termes(s) {
    const out = [];
    let prof = 0, debut = 0;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === '(') prof++;
      else if (c === ')') prof--;
      else if ((c === '+' || c === '-') && prof === 0 && i > debut) {
        const avant = s[i - 1];
        if ('(+-×*/^:'.indexOf(avant) >= 0) continue;
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

  // « 5/2 x » → { signe, coef: '5/2', lettre: 'x' } ; « 15 » → lettre nulle.
  function monome(t) {
    const m = /^\s*([+-]?)\s*([0-9]+(?:\/[0-9]+)?)?\s*([a-zA-Z]+(?:\^[0-9]+)?)?\s*$/.exec(t);
    if (!m || (!m[2] && !m[3])) return null;
    return { signe: m[1] || '+', coef: m[2] || null, lettre: m[3] || null };
  }

  const nombre = t => { const m = monome(t); return !!m && !m.lettre; };

  // Le calcul exact du noyau, pour fabriquer une faute qui A L'AIR d'un calcul
  // juste : « 3 × 1/9 » doit rendre « 1/3 », pas « 3 × 1/9 ».
  function val(t) {
    try { return F.analyser(String(t).replace(/×/g, '*'), {}); }
    catch (e) { return null; }
  }
  const txt = v => F.txt(v);

  // Une faute doit rester CRÉDIBLE : ce qu'un élève écrit vraiment.
  function credible(s) {
    if (NEGATIF.test(s)) return false;
    if (/(^|[^\w])1\s*[a-zA-Z(]/.test(s)) return false;              // « 1x »
    if (/(^|[^\w])([a-zA-Z])\s+\2([^\w]|$)/.test(s)) return false;   // « x x »
    let m; const re = /(\d+)\/(\d+)/g;
    while ((m = re.exec(s))) {
      if (Number(m[2]) === 1) return false;                          // « 3/1 »
      if (F.pgcd(Number(m[1]), Number(m[2])) !== 1) return false;    // « 4/2 »
    }
    const r = relation(s);
    if (r) for (let i = 1; i < r.membres.length; i++) {
      if (r.membres[i].trim() === r.membres[i - 1].trim()) return false;
    }
    return true;
  }

  // -------------------------------------------------------------------------
  // LE CATALOGUE — huit fautes de compréhension, aucune faute de calcul.
  // Chaque famille porte le nom que l'élève lira, et l'explication qui va avec.
  // L'ordre est celui de la priorité : la première applicable l'emporte.
  // -------------------------------------------------------------------------
  const FAMILLES = [
    {
      nom: 'حدّ لم يُقسم على العامل المشترك',
      quoi: 'عند التفكيك يُقسم كل حدّ على العامل المشترك، و الحدّ الثابت مثل غيره. '
          + 'الخطأ الشائع: 5a + 10b + 15 = 5(a + 2b + 15) بدل 5(a + 2b + 3)',
      // Le facteur commun peut porter des lettres — « 1/8 xy(7/3 x + 5/3 y) ».
      // L'élève sort alors le facteur littéral mais oublie de diviser le
      // COEFFICIENT du terme : c'est la même faute, sous un autre habit.
      geste: /نكتب الجداء|نُخرج العامل|عاملا مشتركا|الشكل المفكّك|نفكّك/,
      faire(math) {
        const r = relation(math);
        if (!r) return null;
        for (let k = 0; k < r.membres.length; k++) {
          const m = /^(.*?)([0-9]+(?:\/[0-9]+)?)((?:\s*[a-zA-Z^0-9]+)*)\s*\(([^()]+)\)\s*$/
                      .exec(r.membres[k]);
          if (!m) continue;
          const facteur = val(m[2]);
          const t = termes(m[4]);
          if (!facteur) continue;
          const cands = [];
          t.forEach(function (x, i) { if (monome(x)) cands.push([x, i]); });
          if (!cands.length) continue;
          const pick = cands[F.ent(0, cands.length - 1)];
          const mono = monome(String(pick[0]).replace(/^\+\s*/, ''));

          // Le terme NON DIVISÉ, c'est celui qu'on lit dans l'autre membre —
          // « 7/5 xy(5/2 x + 4 y) = 7/2 x^2 y + 28/5 x y^2 » donne
          // « 7/5 xy(7/2 x^2 y + 4 y) ». C'est la seule écriture qui raconte
          // vraiment la faute. Faute d'autre membre, on ne peut la retrouver
          // qu'en remultipliant le coefficient — et cela ne suffit que si le
          // facteur commun est purement numérique.
          let nonDivise = null;
          const autre = r.membres[k === 0 ? r.membres.length - 1 : 0];
          const ta = autre ? termes(autre) : [];
          if (ta.length === t.length && ta[pick[1]]) {
            nonDivise = String(ta[pick[1]]).replace(/^\+\s*/, '').trim();
          } else if (!m[3].trim()) {
            const brut = val(mono.coef || '1');
            if (!brut) continue;
            const c2 = F.mul(facteur, brut);
            nonDivise = ((txt(c2) === '1' && mono.lettre) ? '' : txt(c2))
                      + (mono.lettre ? ' ' + mono.lettre : '');
          }
          if (!nonDivise) continue;
          if (nonDivise.trim() === String(pick[0]).replace(/^\+\s*/, '').trim()) continue;
          const t2 = t.slice();
          t2[pick[1]] = (pick[1] === 0 ? '' : '+ ') + nonDivise.trim();
          const copie = r.membres.slice();
          copie[k] = m[1] + m[2] + m[3] + '(' + t2.join(' ') + ')';
          return copie.join(' ' + r.ops[0] + ' ');
        }
        return null;
      }
    },
    {
      nom: 'حدود غير متشابهة جُمعت',
      quoi: 'حدود x لا تُجمع مع حدود y: المعاملان لا يُجمعان إلاّ إذا كان الحرف واحدا',
      faire(math) {
        const r = relation(math);
        if (!r) return null;
        const k = r.membres.length - 1;
        const t = termes(r.membres[k]);
        if (t.length < 2) return null;
        const m1 = monome(t[0]), m2 = monome(t[1]);
        if (!m1 || !m2 || !m1.lettre || !m2.lettre) return null;
        if (m1.lettre === m2.lettre) return null;
        const a = val(m1.coef || '1'), b = val(m2.coef || '1');
        if (!a || !b) return null;
        const s = m2.signe === '-' ? F.sub(a, b) : F.add(a, b);
        if (s.n <= 0) return null;
        const fusion = (txt(s) === '1' ? '' : txt(s) + ' ') + m1.lettre;
        const copie = r.membres.slice();
        copie[k] = [fusion].concat(t.slice(2)).join(' ');
        return copie.join(' ' + r.ops[0] + ' ');
      }
    },
    {
      nom: 'معامل الحرف الوحيد نُسي',
      quoi: 'الحرف y وحده معناه 1 × y: معامله 1، و لا يُهمل عند جمع المعاملات',
      faire(math) {
        const r = relation(math);
        if (!r || r.membres.length !== 2) return null;
        const m = /^\(([^()]+)\)\s*([a-zA-Z]+)\s*$/.exec(r.membres[1]);
        if (!m) return null;
        const t = termes(m[1]);
        let i = -1;
        for (let j = 0; j < t.length; j++) if (/^[+-]?\s*1$/.test(t[j])) i = j;
        if (i < 0 || t.length < 3) return null;
        const reste = t.slice(0, i).concat(t.slice(i + 1));
        const copie = r.membres.slice();
        copie[1] = '(' + reste.join(' ') + ')' + m[2];
        return copie.join(' = ');
      }
    },
    {
      nom: 'النشر ناقص — حدّ لم يُضرب',
      quoi: 'عند نشر جداء، كل حدّ من القوس الأوّل يُضرب في كل حدّ من الثاني: لا حدّ يُترك',
      geste: /ننشر|نعيد كتابة|نرتّب|نزيل الأقواس|نعوّض/,
      faire(math) {
        const r = relation(math);
        if (!r || r.ops.some(o => o !== '=')) return null;
        const k = r.membres.length - 1;
        const t = termes(r.membres[k]);
        if (t.length < 3) return null;
        const j = F.ent(1, t.length - 2);
        const copie = r.membres.slice();
        copie[k] = t.slice(0, j).concat(t.slice(j + 1)).join(' ');
        return copie.join(' = ');
      }
    },
    {
      nom: 'التوزيع على الحدّ الأوّل فقط',
      quoi: 'عند نشر k(a + b) يُضرب k في كل حدّ، لا في الأوّل وحده',
      faire(math) {
        const m = /([0-9a-zA-Z/^]+)\s*\(([^()]+)\)/.exec(math);
        if (!m) return null;
        const t = termes(m[2]);
        if (t.length < 2) return null;
        // Le premier terme doit être NU, sinon la faute s'écrit « 2/3 3/5 a »,
        // que personne n'écrit : elle se repérerait à sa laideur.
        if (!/^[a-zA-Z]/.test(t[0])) return null;
        const distribue = m[1] + ' ' + t[0] + ' ' + t.slice(1).join(' ');
        return math.slice(0, m.index) + distribue + math.slice(m.index + m[0].length);
      }
    },
    {
      nom: 'جمع البسطين و المقامين',
      quoi: 'لجمع كسرين نوحّد المقام؛ جمع البسطين و المقامين ليس جمعا',
      faire(math) {
        const m = /(\d+)\/(\d+)\s*([+\-])\s*(\d+)\/(\d+)/.exec(math);
        if (!m) return null;
        const n = m[3] === '+' ? Number(m[1]) + Number(m[4]) : Number(m[1]) - Number(m[4]);
        const d = m[3] === '+' ? Number(m[2]) + Number(m[5]) : Number(m[2]) - Number(m[5]);
        if (n <= 0 || d <= 0) return null;
        // L'élève n'efface pas la somme : il en écrit le mauvais RÉSULTAT.
        const r = relation(math);
        if (r && r.membres.length === 2 && r.ops[0] === '='
            && m.index < r.membres[0].length) {
          return r.membres[0] + ' = ' + n + '/' + d;
        }
        return math.slice(0, m.index) + n + '/' + d + math.slice(m.index + m[0].length);
      }
    },
    {
      nom: 'المقام وُحّد و البسط لم يتغيّر',
      quoi: 'عند توحيد المقامات يُضرب البسط في نفس ما ضُرب فيه المقام: '
          + '9/7 تصير 45/35، لا 9/35',
      geste: /نوحّد|المقام المشترك|نكتب على نفس المقام/,
      faire(math) {
        const r = relation(math);
        if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
        const g = termes(r.membres[0]), d = termes(r.membres[1]);
        if (g.length !== d.length) return null;
        for (let i = 0; i < g.length; i++) {
          const a = /^([+-]?\s*)(\d+)\/(\d+)$/.exec(g[i].trim());
          const b = /^([+-]?\s*)(\d+)\/(\d+)$/.exec(d[i].trim());
          if (!a || !b || a[3] === b[3] || a[2] === b[2]) continue;
          const d2 = d.slice();
          d2[i] = (b[1] || '') + a[2] + '/' + b[3];
          return r.membres[0] + ' = ' + d2.join(' ');
        }
        return null;
      }
    },
    {
      nom: 'قسمنا حيث يجب أن نضرب',
      quoi: 'للتخلّص من معامل نقسم عليه؛ الضرب فيه يُبعد عن الحلّ بدل أن يقرّب',
      geste: /نقسم|نضرب الطرفين|مقلوب/,
      faire(math) {
        if (math.indexOf(':') < 0) return null;
        return math.replace(':', '×');
      }
    },
    {
      nom: 'حدّ نُقل دون تغيير إشارته',
      quoi: 'حدّ يعبر علامة التساوي يغيّر إشارته: نطرح من الطرفين، لا من طرف واحد',
      geste: /من الطرفين|نضيف|نعزل|ننقل|نجمع حدود/,
      faire(math) {
        const r = relation(math);
        if (!r || r.ops.some(o => o !== '=')) return null;
        for (let essai = 0; essai < 6; essai++) {
          const k = F.ent(0, r.membres.length - 1);
          const t = termes(r.membres[k]);
          if (t.length < 2) continue;
          const j = F.ent(1, t.length - 1);
          const u = t[j];
          const bascule = u[0] === '-' ? '+ ' + u.slice(1).trim()
                        : u[0] === '+' ? '- ' + u.slice(1).trim() : null;
          if (!bascule) continue;
          const t2 = t.slice(); t2[j] = bascule;
          const copie = r.membres.slice();
          copie[k] = t2.join(' ');
          return copie.join(' = ');
        }
        return null;
      }
    }
  ];

  // -------------------------------------------------------------------------
  // FAUTES DÉCLARÉES À LA MAIN — elles priment sur tout le catalogue.
  //
  // Le catalogue ci-dessus est une généralisation : chaque famille est écrite à
  // partir du vocabulaire réel de la fiche, mais elle s'applique ensuite seule,
  // à toute étape qui s'y prête. C'est ce qui permet de couvrir cent volets ;
  // ce n'est pas ce qui permet de rendre UNE faute précise sur UNE question
  // précise.
  //
  // Pour cela, on la déclare ici, et elle l'emporte : clé « numéro d'exercice /
  // rang du volet », puis le rang de l'étape à abîmer et le texte exact à
  // mettre à sa place. Le validateur la contrôle comme les autres — une faute
  // déclarée qui se trouverait vraie est rejetée comme n'importe quelle autre.
  //
  //   const MAIN = {
  //     '3/2': [{ rang: 4, faux: 'A = 7/5 xy(7/2 x + 4 y)',
  //               famille: 'حدّ لم يُقسم على العامل المشترك',
  //               quoi: '…' }]
  //   };
  //
  // C'est ici que viennent se poser les fautes vues dans les copies.
  // -------------------------------------------------------------------------
  const MAIN = {};

  // -------------------------------------------------------------------------
  // Fabriquer une page d'erreurs à partir d'une question de chaîne.
  //   fautes — 1 au niveau moyen, 2 au niveau avancé
  // -------------------------------------------------------------------------
  //   interdites — les familles du volet PRÉCÉDENT. Deux fois la même faute à
  //   la suite et l'élève cesse de juger : il applique. L'interdit est donc
  //   dur, pas une simple préférence — on ne cède que si la question n'offre
  //   rien d'autre, car perdre un volet serait pire.
  //   vues — les familles déjà rencontrées ailleurs dans la page : simple
  //   pénalité, pour varier sans rigidité.
  function fabriquer(question, fautes, interdites, vues, cle) {
    interdites = interdites || new Set();
    vues = vues || new Set();
    const c = question.controle;
    const envs = F.environnements(c);
    const juge = m => F.evaluerEtape(m, envs);

    // Une faute déclarée à la main pour CETTE question l'emporte sur tout.
    const mains = (MAIN[cle] || []).filter(f => juge(f.faux) === 'fausse'
                                             && juge(question.etapes[f.rang][1]) === 'vraie');

    const rangs = [];
    question.etapes.forEach(function (e, i) {
      if (juge(e[1]) === 'vraie') rangs.push(i);
    });
    if (rangs.length < fautes + 1) return null;

    function candidats(i) {
      const vrai = question.etapes[i][1];
      const libelle = question.etapes[i][0];
      const out = [];
      FAMILLES.forEach(function (fam, rang) {
        if (fam.geste && !fam.geste.test(libelle)) return;
        for (let essai = 0; essai < 8; essai++) {
          let faux;
          try { faux = fam.faire(vrai); } catch (e) { faux = null; }
          if (!faux || faux === vrai || !credible(faux)) continue;
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

    // AUCUNE FAUTE DE COMPRÉHENSION POSSIBLE ? Alors on n'en invente pas.
    // Le volet garde son corrigé JUSTE, et l'élève doit le dire. C'est même
    // le meilleur usage qu'on puisse en faire : tant qu'une page promet une
    // faute, l'élève cherche la faute ; il ne JUGE que s'il peut répondre
    // « ce corrigé est bon ».
    if (!tous.length) {
      return { controle: c, enonce: question.enonce, indice: question.indice,
               etapes: question.etapes.map(e => [e[0], e[1]]), fautes: [], sain: true };
    }

    const choisies = [];
    for (let n = 0; n < fautes; n++) {
      const libres = tous.filter(x => choisies.every(c2 => c2.rang !== x.rang));
      if (!libres.length) return null;
      // 1. jamais la famille du volet précédent ; 2. jamais deux fois la même
      // dans le volet ; 3. à défaut, on prend ce qui reste plutôt que de
      // perdre la question.
      // Si tout ce que la question offre est la famille du volet précédent, on
      // ne la répète PAS : on laisse le corrigé juste, et l'élève doit le dire.
      // Mieux vaut un volet qui fait réfléchir qu'un volet qui fait appliquer.
      const permises = libres.filter(x => !x.interdite);
      if (!permises.length && !choisies.length) {
        return { controle: c, enonce: question.enonce, indice: question.indice,
                 etapes: question.etapes.map(e => [e[0], e[1]]), fautes: [], sain: true };
      }
      const base = permises.length ? permises : libres;
      const neuves = base.filter(x => choisies.every(c2 => c2.famille !== x.famille));
      const pool = neuves.length ? neuves : base;
      const min = Math.min.apply(null, pool.map(x => x.priorite));
      const pris = F.choix(pool.filter(x => x.priorite === min));
      choisies.push(pris);
    }
    choisies.sort((a, b) => a.rang - b.rang);

    // La phase « corrige » : la bonne réécriture, et deux leurres FAUX.
    choisies.forEach(function (f) {
      const opts = [f.vrai];
      for (let essai = 0; essai < 60 && opts.length < 3; essai++) {
        const fam = F.choix(FAMILLES);
        let leurre;
        try { leurre = fam.faire(f.vrai); } catch (e) { leurre = null; }
        if (!leurre || leurre === f.vrai || leurre === f.faux) continue;
        if (!credible(leurre) || opts.indexOf(leurre) >= 0) continue;
        if (juge(leurre) !== 'fausse') continue;
        opts.push(leurre);
      }
      f.choix = melanger(opts);
      f.bonne = f.choix.indexOf(f.vrai);
    });

    return {
      // La page emporte SON contrôle. Sans lui, le validateur re-tirerait la
      // question et jugerait les étapes d'une page dans l'environnement d'une
      // autre — invisible sur une fiche fidèle, fatal sur une fiche générative.
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

  function melanger(t) {
    const a = t.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = F.ent(0, i);
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  // Une page entière. Une question qui ne se prête pas à deux fautes est rendue
  // à une seule plutôt que sautée — l'élève doit retrouver TOUTES les questions
  // de l'énoncé, c'est la règle de la méthode.
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

  const API = { FAMILLES, termes, relation, credible, fabriquer, pageErreurs };
  if (M) module.exports = API; else racine.Erreurs = API;
})(typeof window !== 'undefined' ? window : globalThis);
