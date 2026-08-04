// Les pages « أين الخطأ؟ » — rationnels8.
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
  const F = M ? require('./frac.js') : racine.Frac;
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
      nom: "ترتيب عددين سالبين مقلوب",
      quoi: "بين عددين سالبين، الأكبر قيمة مطلقة هو الأصغر: -9 < -2، و -132 < -70",
      geste: /نقارن|نرتّب|المرفوضة|المقبولة|إشارة|نستنتج|نحدّد/,
      faire: function(math) {
          // Une étape peut porter plusieurs comparaisons séparées par « ; » —
          // « 12/7 > 1/2 ; -9 ≤ -2 ; 1 > 1/2 ». On retourne la première qui s'y
          // prête et l'on recolle : les autres restent justes, comme il se doit.
          const parts = String(math).split(';');
          const neg = t => /^\s*-\s*\d+(\s*\/\s*\d+)?\s*$/.test(t);
          for (let i = 0; i < parts.length; i++) {
            const r = relation(parts[i]);
            if (!r || r.membres.length !== 2) continue;
            const op = r.ops[0];
            if (op === '=') continue;
            if (!neg(r.membres[0]) || !neg(r.membres[1])) continue;
            const inverse = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' }[op];
            if (!inverse) continue;
            const p2 = parts.slice();
            p2[i] = ' ' + r.membres[0].trim() + ' ' + inverse + ' '
                  + r.membres[1].trim() + ' ';
            return p2.join(';').trim();
          }
          return null;
        }
    },
    {
      nom: "مقارنة عدد بالصفر",
      quoi: "كلّ عدد سالب أصغر من الصفر و كلّ عدد موجب أكبر منه: -24/5 < 0 و 0 < 12/5",
      geste: /نتحقّق|نقارن|نستنتج|نحدّد|إشارة/,
      faire: function(math) {
          const parts = String(math).split(';');
          for (let i = 0; i < parts.length; i++) {
            const r = relation(parts[i]);
            if (!r || r.membres.length !== 2) continue;
            const op = r.ops[0];
            const inverse = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' }[op];
            if (!inverse) continue;
            const zero = t => /^\s*0\s*$/.test(t);
            if (!zero(r.membres[0]) && !zero(r.membres[1])) continue;
            const p2 = parts.slice();
            p2[i] = ' ' + r.membres[0].trim() + ' ' + inverse + ' '
                  + r.membres[1].trim() + ' ';
            return p2.join(';').trim();
          }
          return null;
        }
    },
    {
      nom: "قارنّا البسطين و المقامان مختلفان",
      quoi: "لا يُقارن البسطان إلاّ إذا كان المقام واحدا: 1/12 و 11/65 يُقارنان بالضرب التقاطعي أو بتوحيد المقام",
      geste: /نقارن|نستنتج|نحدّد/,
      faire: function(math) {
          const parts = String(math).split(';');
          const lire = t => /^\s*(-?\d+)\s*\/\s*(\d+)\s*$/.exec(t);
          for (let i = 0; i < parts.length; i++) {
            const r = relation(parts[i]);
            if (!r || r.membres.length !== 2) continue;
            const op = r.ops[0];
            if (op === '=') continue;
            const a = lire(r.membres[0]), b = lire(r.membres[1]);
            if (!a || !b || a[2] === b[2]) continue;
            // Le verdict que donnerait la comparaison des seuls numérateurs.
            const na = Number(a[1]), nb = Number(b[1]);
            if (na === nb) continue;
            const naif = na < nb ? '<' : '>';
            if (naif === op || (op === '≤' && naif === '<')
                || (op === '≥' && naif === '>')) continue;
            const p2 = parts.slice();
            p2[i] = ' ' + r.membres[0].trim() + ' ' + naif + ' '
                  + r.membres[1].trim() + ' ';
            return p2.join(';').trim();
          }
          return null;
        }
    },
    {
      nom: "المقام وُحّد و البسط بقي كما هو",
      quoi: "عند توحيد المقامات يُضرب البسط في نفس ما ضُرب فيه المقام: 17/8 = 51/24، لا 17/24",
      geste: /نوحّد|المقام المشترك|نفس المقام|نكتب/,
      faire: function(math) {
          const parts = String(math).split(';');
          for (let i = 0; i < parts.length; i++) {
            const m = /^\s*(-?\d+)\s*\/\s*(\d+)\s*=\s*(-?\d+)\s*\/\s*(\d+)\s*$/
                        .exec(parts[i]);
            if (!m || m[2] === m[4] || m[1] === m[3]) continue;
            const p2 = parts.slice();
            p2[i] = ' ' + m[1] + '/' + m[2] + ' = ' + m[1] + '/' + m[4] + ' ';
            return p2.join(';').trim();
          }
          return null;
        }
    },
    {
      nom: "الطرح لم يشمل كلّ حدود القوس",
      quoi: "طرح قوس يغيّر إشارة كلّ حدوده: (b + 5/4) - (b + 3/4) = 5/4 - 3/4، لا 5/4 + 3/4",
      geste: /نحسب الفرق|الفرق|نرفع القوس|نزيل الأقواس/,
      faire: function(math) {
          const r = relation(math);
          if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
          if (!/-\s*\(/.test(r.membres[0])) return null;
          const t = termes(r.membres[1]);
          if (t.length !== 2) return null;
          const m = /^([+-])\s*(.+)$/.exec(t[1].trim());
          if (!m) return null;
          return r.membres[0].trim() + ' = ' + t[0].trim()
               + (m[1] === '-' ? ' + ' : ' - ') + m[2].trim();
        }
    },
    {
      nom: "المقام تغيّر و البسط بقي كما هو",
      quoi: "عند التحويل إلى المقام المشترك يُضرب البسط في نفس ما ضُرب فيه المقام: 3/8 تصير 15/40، لا 3/40",
      geste: /نوحّد|المقام المشترك|نكتب على نفس المقام|نجمع البسوط|نطرح البسوط/,
      faire: function(math, A) {
          const r = relation(math);
          if (!r) return null;
          const k = r.membres.length - 1;
          const t = termes(r.membres[k]);
          const frac = [];
          t.forEach((x, i) => {
            const m = /^([+-]?\s*)(\d+)\/(\d+)$/.exec(x.trim());
            if (m) frac.push([m, i]);
          });
          if (frac.length < 2) return null;
          const d0 = frac[0][0][3];
          if (!frac.every(f => f[0][3] === d0)) return null;   // même mocam partout
          // Le terme s'écrit avec le NOUVEAU dénominateur et l'ANCIEN numérateur.
          // « 15/40 » vient de « 3/8 » : l'élève qui oublie de multiplier le
          // numérateur écrit « 3/40 ». Réduire la fraction, au contraire, n'en
          // changerait pas la valeur — la faute serait vraie, et le juge la
          // rejetterait à bon droit. C'est arrivé.
          const reduc = frac.filter(f => A.pgcd(Number(f[0][2]), Number(f[0][3])) > 1);
          if (!reduc.length) return null;
          const f = reduc[A.ent(0, reduc.length - 1)];
          const g = A.pgcd(Number(f[0][2]), Number(f[0][3]));
          const t2 = t.slice();
          t2[f[1]] = (f[0][1] || '') + (Number(f[0][2]) / g) + '/' + f[0][3];
          const copie = r.membres.slice();
          copie[k] = t2.join(' ');
          return recoller({ membres: copie, ops: r.ops });
        }
    },
    {
      nom: "جمع البسطين و المقامين",
      quoi: "لجمع كسرين نوحّد المقام؛ جمع البسطين و المقامين ليس جمعا",
      faire: function(math) {
          // Toutes les paires, pas seulement la première : « 3/3 - 1/3 » donne un
          // dénominateur nul et ne peut rien produire, mais « 1/3 + 3/3 » le peut.
          const re = /(\d+)\/(\d+)\s*([+\-])\s*(\d+)\/(\d+)/g;
          let m = null, cand = null;
          while ((cand = re.exec(math))) {
            const nn = cand[3] === '+' ? Number(cand[1]) + Number(cand[4])
                                       : Number(cand[1]) - Number(cand[4]);
            const dd = cand[3] === '+' ? Number(cand[2]) + Number(cand[5])
                                       : Number(cand[2]) - Number(cand[5]);
            if (nn !== 0 && dd !== 0) { m = cand; break; }
            re.lastIndex = cand.index + 1;
          }
          if (!m) return null;
          const n = m[3] === '+' ? Number(m[1]) + Number(m[4]) : Number(m[1]) - Number(m[4]);
          const d = m[3] === '+' ? Number(m[2]) + Number(m[5]) : Number(m[2]) - Number(m[5]);
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
      nom: "اختصرنا في البسط دون المقام",
      quoi: "الاختصار يقسم البسط و المقام معا؛ قسمة البسط وحده تغيّر الكسر",
      geste: /نبسّط|نختصر|قبل الضرب/,
      faire: function(math) {
          const r = relation(math);
          if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
          const F1 = /^\s*\(([^()]+)\)\s*\/\s*\(([^()]+)\)\s*$/;
          const g = F1.exec(r.membres[0]), d = F1.exec(r.membres[1]);
          if (!g || !d) return null;
          // Le numérateur a bien été simplifié, le dénominateur est resté celui
          // d'avant : c'est exactement ce que l'élève écrit quand il barre d'un
          // seul côté de la barre de fraction.
          if (g[2].trim() === d[2].trim()) return null;
          return r.membres[0] + ' = (' + d[1].trim() + ') / (' + g[2].trim() + ')';
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
