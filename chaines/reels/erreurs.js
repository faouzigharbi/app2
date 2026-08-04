// Les pages « أين الخطأ؟ » — reels.
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
  const F = M ? require('./noyau.js') : racine.Reel;
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
    if (/[+\-]\s*[+\-]/.test(s)) return false;                           // « --13/5 »
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
      nom: "القيمة المطلقة رُفعت دون تغيير الإشارة",
      quoi: "القيمة المطلقة لعدد سالب هي مقابله، لا هو نفسه — و √(t^2) = |t| لا t",
      faire: function(math) {
          const r = relation(math);
          if (!r || r.ops.some(o => o !== '=')) return null;
          for (let k = 0; k < r.membres.length; k++) {
            const m = /^\s*\|(.+)\|\s*$/.exec(r.membres[k]);
            if (!m) continue;
            const copie = r.membres.slice();
            copie[k] = m[1];
            return copie.join(' = ');
          }
          return null;
        }
    },
    {
      nom: "الجذر وُزّع على مجموع",
      quoi: "الجذر يُوزّع على الجداء لا على المجموع: √(a×b) = √a × √b، لكن √(a+b) ≠ √a + √b",
      geste: /نفصل|نفكّك|نبسّط|نُرجع|نُخرج/,
      faire: function(math) {
          const m = /√\(([^()]+)\)/.exec(math);
          if (!m) return null;
          const t = termes(m[1]);
          if (t.length < 2) return null;
          const distribue = t.map((x, i) => (i ? sansSigne(x).replace(/^/, x[0] + ' √')
                                              : '√' + x)).join(' ');
          return math.slice(0, m.index) + distribue + math.slice(m.index + m[0].length);
        }
    },
    {
      nom: "المربّع الكامل خرج دون جذر",
      quoi: "عند إخراج مربّع كامل من تحت الجذر يخرج جذره: √(16 × 10) = 4√10، لا 16√10",
      geste: /نحسب الجذر|نُبسّط|نفصل|النتيجة/,
      faire: function(math, A) {
          const m = /√(\d+)\s*=\s*(\d+)/.exec(math);
          if (!m) return null;
          const k = Number(m[2]);
          if (k * k !== Number(m[1])) return null;
          return math.slice(0, m.index) + '√' + m[1] + ' = ' + m[1]
               + math.slice(m.index + m[0].length);
        }
    },
    {
      nom: "المرافق ضُرب في البسط وحده",
      quoi: "لإنطاق المقام نضرب البسط و المقام معا في المرافق: ضرب البسط وحده يغيّر الكسر",
      geste: /مرافق|نُنطق|إنطاق/,
      faire: function(math) {
          const r = relation(math);
          if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
          const d = /^\s*(.+?)\s*\/\s*(.+?)\s*$/.exec(r.membres[1]);
          if (!d || !/[√]/.test(r.membres[0])) return null;
          // On garde le numérateur multiplié et l'on rend au dénominateur sa
          // forme d'avant : c'est le geste fait à moitié.
          const g = /\/\s*(.+?)\s*$/.exec(r.membres[0]);
          if (!g || g[1].trim() === d[2].trim()) return null;
          return r.membres[0] + ' = ' + d[1] + '/' + g[1];
        }
    },
    {
      nom: "حدّ لم يُقسم على العامل المشترك",
      quoi: "عند التفكيك يُقسم كل حدّ على العامل المشترك، و الحدّ الثابت مثل غيره. الخطأ الشائع: 5a + 10b + 15 = 5(a + 2b + 15) بدل 5(a + 2b + 3)",
      geste: /نكتب الجداء|نُخرج|نُظهر|عاملا مشتركا|الشكل المفكّك|نفكّك|نضع/,
      faire: function(math, A) {
          const r = relation(math);
          if (!r) return null;
          for (let k = 0; k < r.membres.length; k++) {
            const m = /^(.*?)([0-9]+(?:\/[0-9]+)?)((?:\s*[a-zA-Z^0-9]+)*)\s*\(([^()]+)\)\s*$/
                        .exec(r.membres[k]);
            if (!m) continue;
            const facteur = A.val(m[2]);
            const t = termes(m[4]);
            if (!facteur) continue;
            const cands = [];
            t.forEach((x, i) => { if (monome(x)) cands.push([x, i]); });
            if (!cands.length) continue;
            const pick = cands[A.ent(0, cands.length - 1)];
            const mono = monome(sansSigne(pick[0]));
  
            // Le terme NON DIVISÉ, c'est celui qu'on lit dans l'AUTRE membre —
            // « 7/5 xy(5/2 x + 4 y) = 7/2 x^2 y + 28/5 x y^2 » donne
            // « 7/5 xy(7/2 x^2 y + 4 y) ». C'est la seule écriture qui raconte
            // vraiment la faute. Faute d'autre membre, on ne le retrouve qu'en
            // remultipliant le coefficient, et cela ne suffit que si le facteur
            // commun est purement numérique.
            let brutTexte = null;
            const autre = r.membres[k === 0 ? r.membres.length - 1 : 0];
            const ta = autre ? termes(autre) : [];
            if (ta.length === t.length && ta[pick[1]]) {
              brutTexte = sansSigne(ta[pick[1]]);
            } else if (!m[3].trim()) {
              const c2 = A.val(mono.coef || '1');
              if (!c2) continue;
              const p = A.mul(facteur, c2);
              brutTexte = ((A.txt(p) === '1' && mono.lettre) ? '' : A.txt(p))
                        + (mono.lettre ? ' ' + mono.lettre : '');
            }
            if (!brutTexte || brutTexte.trim() === sansSigne(pick[0])) continue;
            const t2 = t.slice();
            t2[pick[1]] = (pick[1] === 0 ? '' : '+ ') + brutTexte.trim();
            const copie = r.membres.slice();
            copie[k] = m[1] + m[2] + m[3] + '(' + t2.join(' ') + ')';
            return recoller({ membres: copie, ops: r.ops });
          }
          return null;
        }
    },
    {
      nom: "النشر ناقص — حدّ لم يُضرب",
      quoi: "عند نشر جداء قوسين، كل حدّ من الأوّل يُضرب في كل حدّ من الثاني: لا حدّ يُترك",
      geste: /ننشر|نعيد كتابة|نرتّب|نزيل الأقواس|نضرب القوسين|نعوّض/,
      faire: function(math, A) {
          const r = relation(math);
          if (!r || r.ops.some(o => o !== '=') || estMajal(math)) return null;
          const k = r.membres.length - 1;
          const t = termes(r.membres[k]);
          if (t.length < 3) return null;
          const j = A.ent(1, t.length - 2);
          const copie = r.membres.slice();
          copie[k] = t.slice(0, j).concat(t.slice(j + 1)).join(' ');
          return recoller({ membres: copie, ops: r.ops });
        }
    },
    {
      nom: "حدود غير متشابهة جُمعت",
      quoi: "حدود x لا تُجمع مع حدود y: المعاملان لا يُجمعان إلاّ إذا كان الحرف واحدا",
      faire: function(math, A) {
          const r = relation(math);
          if (!r) return null;
          const k = r.membres.length - 1;
          const t = termes(r.membres[k]);
          if (t.length < 2) return null;
          const m1 = monome(t[0]), m2 = monome(t[1]);
          if (!m1 || !m2 || !m1.lettre || !m2.lettre || m1.lettre === m2.lettre) return null;
          const a = A.val(m1.coef || '1'), b = A.val(m2.coef || '1');
          if (!a || !b) return null;
          const s = m2.signe === '-' ? A.sub(a, b) : A.add(a, b);
          const fusion = (A.txt(s) === '1' ? '' : A.txt(s) + ' ') + m1.lettre;
          const copie = r.membres.slice();
          copie[k] = [fusion].concat(t.slice(2)).join(' ');
          return recoller({ membres: copie, ops: r.ops });
        }
    },
    {
      nom: "ناقص أمام عدد سالب",
      quoi: "طرح عدد سالب هو إضافة مقابله: a - (-b) = a + b، لا a - b",
      geste: /نحسب|نرفع|نزيل|الفرق|نطرح/,
      faire: function(math) {
          const m = /-\s*\(\s*-\s*([^()]+?)\s*\)/.exec(math);
          if (!m) return null;
          return math.slice(0, m.index) + '- ' + m[1] + math.slice(m.index + m[0].length);
        }
    },
    {
      nom: "حدّ نُقل دون تغيير إشارته",
      quoi: "حدّ يعبر علامة التساوي يغيّر إشارته: نطرح من الطرفين، لا من طرف واحد",
      geste: /من الطرفين|نضيف|نعزل|ننقل|نجمع حدود/,
      faire: function(math, A) {
          const r = relation(math);
          if (!r || r.ops.some(o => o !== '=') || estMajal(math)) return null;
          for (let essai = 0; essai < 6; essai++) {
            const k = A.ent(0, r.membres.length - 1);
            const t = termes(r.membres[k]);
            if (t.length < 2) continue;
            const j = A.ent(1, t.length - 1);
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
    },
    {
      nom: "التوزيع على الحدّ الأوّل فقط",
      quoi: "عند نشر k(a + b) يُضرب k في كل حدّ، لا في الأوّل وحده",
      faire: function(math) {
          const m = /([0-9a-zA-Z/^]+)\s*\(([^()]+)\)/.exec(math);
          if (!m) return null;
          const t = termes(m[2]);
          if (t.length < 2) return null;
          // Le premier terme doit être NU, sinon la faute s'écrit « 2/3 3/5 a »,
          // que personne n'écrit : elle se repérerait à sa laideur, pas à son
          // erreur.
          if (!/^[a-zA-Z]/.test(t[0])) return null;
          return math.slice(0, m.index) + m[1] + ' ' + t[0] + ' ' + t.slice(1).join(' ')
               + math.slice(m.index + m[0].length);
        }
    },
    {
      nom: "قوس مسبوق بناقص رُفع دون تغيير الإشارات",
      quoi: "قوس مسبوق بـ « - » ترفع إشارات كل حدوده: -(a - b) = -a + b",
      geste: /نرفع القوس|نزيل الأقواس|بدون أقواس|نكتب المقابل/,
      faire: function(math) {
          const r = relation(math);
          if (!r || r.membres.length !== 2) return null;
          const m = /-\s*\(([^()]+)\)/.exec(r.membres[0]);
          if (!m) return null;
          const t = termes(m[1]);
          if (t.length < 2) return null;
          // Le premier terme change de signe, les autres sont recopiés tels
          // quels : c'est exactement ce que l'élève écrit.
          const naif = t.map((x, i) => i === 0 ? '-' + sansSigne(x) : x).join(' ');
          return r.membres[0] + ' = ' + naif;
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
    // Il doit rester du vrai après la faute : une chaîne dont TOUT serait faux
    // ne demanderait plus de juger. Ce qui compte est le nombre d'étapes qui
    // restent debout, pas le nombre d'étapes calculables : une chaîne peut
    // n'avoir qu'une seule ligne de calcul et trois lignes de raisonnement en
    // arabe, et l'élève y juge très bien. C'est le cas d'un exercice entier de
    // rationnels8, qu'on rendait sain à chaque tirage faute de le voir.
    //
    // Et le NIVEAU est une intention, pas une exigence : quand la chaîne
    // n'offre pas de quoi placer deux fautes, on en place une plutôt que de
    // rendre le volet sain. Un volet sain doit être un choix — « aucune règle
    // n'est en jeu ici » — jamais un aveu d'impuissance.
    fautes = Math.min(fautes, rangs.length, question.etapes.length - 2);
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
