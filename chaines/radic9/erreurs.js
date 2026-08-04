// Les pages « أين الخطأ؟ » — radic9.
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
  const F = M ? require('./noyau.js') : racine.Radic;
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
      nom: "المربّع الكامل خرج كما هو",
      quoi: "العامل المربّع يخرج من تحت الجذر بجذره لا بقيمته: √112 = √(16 × 7) = 4√7، لا 16√7",
      geste: /نُرجع|نُبسّط|نفصل|نحسب الجذر|نفكّك/,
      faire: function(math) {
          const r = relation(math);
          if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
          const g = /^\s*√(\d+)\s*$/.exec(r.membres[0]);
          const d = /^\s*(\d+)\s*√(\d+)\s*$/.exec(r.membres[1]);
          if (!g || !d) return null;
          const a = Number(d[1]);
          if (a * a * Number(d[2]) !== Number(g[1])) return null;
          return r.membres[0].trim() + ' = ' + (a * a) + '√' + d[2];
        }
    },
    {
      nom: "عامل غير مربّع خرج من الجذر",
      quoi: "لا يخرج من تحت الجذر إلاّ عامل مربّع كامل، و يخرج بجذره: √20 = √(4 × 5) = 2√5، أمّا √20 = 2√10 فباطلة",
      geste: /نُرجع|نُبسّط|نفصل|نحسب الجذر|نفكّك/,
      faire: function(math, A) {
          const r = relation(math);
          if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
          const g = /^\s*√(\d+)\s*$/.exec(r.membres[0]);
          const d = /^\s*(\d+)(?:\s*√(\d+))?\s*$/.exec(r.membres[1]);
          if (!g || !d) return null;
          const N = Number(g[1]), a = Number(d[1]);
          const carre = k => Math.round(Math.sqrt(k)) * Math.round(Math.sqrt(k)) === k;
          const cands = [];
          for (let c = 2; c < N; c++) {
            if (N % c) continue;
            const m = N / c;
            // m carré parfait laisserait « 5√4 », que personne n'écrit ;
            // c = a² serait l'extraction juste.
            if (m < 2 || carre(m) || c === a * a) continue;
            cands.push(c + '√' + m);
          }
          if (!cands.length) return null;
          return r.membres[0].trim() + ' = ' + cands[A.ent(0, cands.length - 1)];
        }
    },
    {
      nom: "الجذر خُلط بالنصف",
      quoi: "جذر العدد ليس نصفه: √36 = 6 لأنّ 6 × 6 = 36، و ليس 18",
      geste: /نحسب الجذر|نُبسّط|نُرجع/,
      faire: function(math) {
          const r = relation(math);
          if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
          const g = /^\s*√(\d+)\s*$/.exec(r.membres[0]);
          if (!g) return null;
          const N = Number(g[1]);
          // On n'écrit la moitié que si elle est entière : « 25/2 » ne s'écrit
          // pas dans une copie, on y lit « 12,5 » ou rien.
          if (N % 2) return null;
          return r.membres[0].trim() + ' = ' + (N / 2);
        }
    },
    {
      nom: "الجداء تحت الجذر صار مجموعا",
      quoi: "√(a × b) = √a × √b : القاعدة للجداء وحده. √90 = √9 × √10 و ليس √9 + √10",
      geste: /نفصل|نفكّك|نُرجع|نُبسّط/,
      faire: function(math) {
          const r = relation(math);
          if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
          const produit = /√\d+\s*[×*]\s*√\d+/;
          const k = produit.test(r.membres[1]) ? 1 : produit.test(r.membres[0]) ? 0 : -1;
          if (k < 0) return null;
          const copie = r.membres.slice();
          copie[k] = r.membres[k].replace(/[×*]/, '+');
          return copie[0].trim() + ' = ' + copie[1].trim();
        }
    },
    {
      nom: "في الجداء جمعنا ما تحت الجذرين",
      quoi: "√a × √b = √(a × b) : ما تحت الجذرين يُضرب، لا يُجمع — √25 × √5 = √125 و ليس √30",
      geste: /نفصل|نضرب|جداء|نجمع تحت|نُبسّط/,
      faire: function(math) {
          const r = relation(math);
          if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
          const P = /(\d*)\s*√(\d+)\s*[×*]\s*(\d*)\s*√(\d+)/;
          const m1 = P.exec(r.membres[1]);
          // Le produit est dans le membre de DROITE : la faute s'y écrit sur
          // place — « √50 = √25 × √2 » devient « √50 = √27 ».
          if (m1) {
            const coef = Number(m1[1] || 1) * Number(m1[3] || 1);
            const somme = (coef === 1 ? '' : coef) + '√' + (Number(m1[2]) + Number(m1[4]));
            return r.membres[0].trim() + ' = ' + (r.membres[1].slice(0, m1.index) + somme
                   + r.membres[1].slice(m1.index + m1[0].length)).trim();
          }
          // Le produit est le DONNÉ, à gauche : la faute est alors dans le
          // résultat qu'on en tire — « √5 × √5 = √10 ». On ne touche pas au
          // donné : une étape fautive garde sa prémisse et se trompe de conclusion.
          const m0 = P.exec(r.membres[0]);
          if (!m0 || m0[0].trim() !== r.membres[0].trim()) return null;
          const coef = Number(m0[1] || 1) * Number(m0[3] || 1);
          return r.membres[0].trim() + ' = ' + (coef === 1 ? '' : coef)
               + '√' + (Number(m0[2]) + Number(m0[4]));
        }
    },
    {
      nom: "ضربنا ما تحت الجذرين و بقي الناتج بلا جذر",
      quoi: "√a × √b = √(a × b) : ما تحت الجذرين يُضرب تحت جذر واحد ثمّ يُؤخذ جذره — √6 × √6 = √36 = 6، لا 36",
      geste: /يختفي|نضرب|جداء|نحسب|نجمع تحت|نُبسّط/,
      faire: function(math) {
          const r = relation(math);
          if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
          const m = /^\s*(\d*)\s*√(\d+)\s*[×*]\s*(\d*)\s*√(\d+)\s*$/.exec(r.membres[0]);
          // Le second membre est le résultat correct, écrit soit déjà réduit
          // (« = 6 »), soit encore sous le radical (« = √36 ») : dans les deux
          // cas la faute consiste à garder le produit des radicandes tel quel.
          if (!m || !/^\s*(√\s*)?\d+\s*$/.test(r.membres[1])) return null;
          const v = Number(m[1] || 1) * Number(m[3] || 1) * Number(m[2]) * Number(m[4]);
          return r.membres[0].trim() + ' = ' + v;
        }
    },
    {
      nom: "مربّع الجذر بقي بلا اختصار",
      quoi: "(√b)^2 = b لأنّ التربيع يُلغي الجذر: (√6)^2 = 6، لا 36",
      geste: /المربّع|نربّع|المتطابقة|نحسب/,
      faire: function(math) {
          const r = relation(math);
          if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
          const g = /^\s*\(\s*√(\d+)\s*\)\s*\^\s*2\s*$/.exec(r.membres[0]);
          if (!g || !/^\s*\d+\s*$/.test(r.membres[1])) return null;
          const b = Number(g[1]);
          return r.membres[0].trim() + ' = ' + (b * b);
        }
    },
    {
      nom: "التربيع خُلط بالمضاعفة",
      quoi: "التربيع ضرب العدد في نفسه لا في 2: (√6)^2 = √6 × √6 = 6، و ليس 2√6",
      geste: /المربّع|نربّع|المتطابقة|نحسب/,
      faire: function(math) {
          const r = relation(math);
          if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
          const g = /^\s*\(\s*(√\d+)\s*\)\s*\^\s*2\s*$/.exec(r.membres[0]);
          if (!g) return null;
          return r.membres[0].trim() + ' = 2' + g[1];
        }
    },
    {
      nom: "جمعنا ما تحت الجذر أيضا",
      quoi: "عند جمع جذور متشابهة تُجمع المعاملات وحدها و يبقى الجذر كما هو: 2√7 + 3√7 = 5√7، لا 5√14",
      geste: /نجمع|نعيد كتابة|نضيف|الفرق/,
      faire: function(math) {
          const r = relation(math);
          if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
          for (let k = 0; k < 2; k++) {
            const t = termes(r.membres[k]);
            if (t.length < 2) continue;
            // L'AUTRE membre doit être le résultat groupé « c√d » : sinon c'est
            // un nom — « A » — et le remplacer ne raconterait aucune faute.
            if (!/^\s*\d*\s*√\d+\s*$/.test(r.membres[1 - k])) continue;
            let som = 0, rad = null, tot = 0, ok = true;
            for (const x of t) {
              const m = /^([+-]?)(\d*)√(\d+)$/.exec(x.replace(/\s+/g, ''));
              if (!m) { ok = false; break; }
              const d = Number(m[3]);
              if (rad === null) rad = d; else if (rad !== d) { ok = false; break; }
              som += Number(m[2] || 1) * (m[1] === '-' ? -1 : 1);
              tot += d;
            }
            if (!ok || som <= 0 || tot === rad) continue;
            const copie = r.membres.slice();
            copie[1 - k] = (som === 1 ? '' : som) + '√' + tot;
            return copie[0].trim() + ' = ' + copie[1].trim();
          }
          return null;
        }
    },
    {
      nom: "عدد ناطق جُمع مع جذر",
      quoi: "العدد الناطق و الجذر حدّان غير متشابهين: 3 + 8√3 يبقى كما هو، و ليس 11√3",
      geste: /نجمع|نرتّب|نعيد كتابة|نطرح|الفرق/,
      faire: function(math) {
          const r = relation(math);
          if (!r || r.ops.some(o => o !== '=')) return null;
          const k = r.membres.length - 1;
          const t = termes(r.membres[k]);
          if (t.length < 2) return null;
          let ir = -1, iq = -1;
          t.forEach((x, i) => {
            const s = x.replace(/\s+/g, '');
            if (ir < 0 && /^[+-]?\d*√\d+$/.test(s)) ir = i;
            else if (iq < 0 && /^[+-]?\d+$/.test(s)) iq = i;
          });
          if (ir < 0 || iq < 0) return null;
          const lireR = /^([+-]?)(\d*)√(\d+)$/.exec(t[ir].replace(/\s+/g, ''));
          const lireQ = /^([+-]?)(\d+)$/.exec(t[iq].replace(/\s+/g, ''));
          const cr = Number(lireR[2] || 1) * (lireR[1] === '-' ? -1 : 1);
          const cq = Number(lireQ[2]) * (lireQ[1] === '-' ? -1 : 1);
          const s = cr + cq;
          if (s === 0 || s === cr) return null;
          const joint = (s < 0 ? '-' : '') + (Math.abs(s) === 1 ? '' : Math.abs(s))
                      + '√' + lireR[3];
          const t2 = [];
          t.forEach((x, i) => {
            if (i === iq) return;
            t2.push(i === ir ? (t2.length ? (s < 0 ? '- ' : '+ ') + joint.replace(/^-/, '')
                                          : joint)
                             : x);
          });
          const copie = r.membres.slice();
          copie[k] = t2.join(' ');
          return recoller({ membres: copie, ops: r.ops });
        }
    },
    {
      nom: "حدّ لم يُقسم على الجذر المشترك",
      quoi: "عند إخراج جذر مشترك يُقسم كلّ حدّ عليه: 6√11 - 3√11 × √13 = √11(6 - 3√13)، لا √11(6√11 - 3√13)",
      geste: /نُخرج|العامل المشترك|نفكّك|الشكل المفكّك/,
      faire: function(math, A) {
          const r = relation(math);
          if (!r || r.ops.some(o => o !== '=')) return null;
          const k = r.membres.length - 1;
          const m = /^\s*(√\d+)\s*\(([^()]+)\)\s*$/.exec(r.membres[k]);
          if (!m) return null;
          const t = termes(m[2]);
          // Le terme non divisé est un terme SANS radical : c'est celui que
          // l'élève croit étranger au facteur commun.
          const libres = [];
          t.forEach((x, i) => { if (x.indexOf('√') < 0) libres.push(i); });
          if (!libres.length) return null;
          const j = libres[A.ent(0, libres.length - 1)];
          const t2 = t.slice();
          t2[j] = t[j].replace(/\s+$/, '') + m[1];
          const copie = r.membres.slice();
          copie[k] = m[1] + '(' + t2.join(' ') + ')';
          return recoller({ membres: copie, ops: r.ops });
        }
    },
    {
      nom: "العامل المشترك خرج بلا جذر",
      quoi: "العامل المشترك بين 6√11 و 3√11 × √13 هو √11، لا 11 : نُخرج ما هو مشترك فعلا",
      geste: /نُخرج|العامل المشترك|نفكّك|الشكل المفكّك/,
      faire: function(math) {
          const r = relation(math);
          if (!r || r.ops.some(o => o !== '=')) return null;
          const k = r.membres.length - 1;
          const m = /^\s*√(\d+)\s*\(([^()]+)\)\s*$/.exec(r.membres[k]);
          if (!m) return null;
          const copie = r.membres.slice();
          copie[k] = m[1] + '(' + m[2] + ')';
          return recoller({ membres: copie, ops: r.ops });
        }
    },
    {
      nom: "ضربنا البسط وحده في الجذر",
      quoi: "لجعل المقام ناطقا نضرب البسط و المقام معا في نفس الجذر: ضرب البسط وحده يغيّر قيمة الكسر",
      geste: /نضرب في|نُنطق|ناطقا|مرافق/,
      faire: function(math) {
          const r = relation(math);
          if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
          const m = /^\s*(.+?)\/\(\s*(.+?)\s*[×*]\s*(√\d+)\s*\)\s*$/.exec(r.membres[1]);
          if (!m || m[2].indexOf('√') < 0) return null;
          return r.membres[0].trim() + ' = ' + m[1].trim() + '/(' + m[2].trim() + ')';
        }
    },
    {
      nom: "الحدّ الأوسط في المتطابقة سقط",
      quoi: "(a + b)^2 = a^2 + 2ab + b^2 : الحدّ الأوسط جزء من المتطابقة، و ليس (a + b)^2 = a^2 + b^2",
      geste: /نجمع|المتطابقة|الحدّ الأوسط|ننشر|نعيد كتابة/,
      faire: function(math) {
          const r = relation(math);
          if (!r || r.ops.some(o => o !== '=')) return null;
          const k = r.membres.length - 1;
          const t = termes(r.membres[k]);
          if (t.length !== 3) return null;
          // Celui qui tombe est le double produit — le terme du milieu, celui
          // qui porte le radical ou la lettre.
          if (!/√|[a-zA-Z]/.test(t[1])) return null;
          const copie = r.membres.slice();
          copie[k] = t[0] + ' ' + t[2];
          return recoller({ membres: copie, ops: r.ops });
        }
    },
    {
      nom: "المتلازمان — الجذر لم يُربّع",
      quoi: "(a + √b)(a - √b) = a^2 - b : الجذر يختفي لأنّه يُربّع، فلا يبقى √b في النتيجة",
      geste: /مرافق|المتلازم|نستعمل|ننشر|نحسب/,
      faire: function(math) {
          const r = relation(math);
          if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
          const m = /√(\d+)/.exec(r.membres[0]);
          if (!m) return null;
          const t = termes(r.membres[1]);
          if (t.length !== 2) return null;
          const b = /^([+-])\s*(\d+)$/.exec(t[1].replace(/\s+/g, ' ').trim());
          if (!b || b[2] !== m[1]) return null;
          return r.membres[0].trim() + ' = ' + t[0].trim() + ' ' + b[1] + ' √' + b[2];
        }
    },
    {
      nom: "المتلازمان — الفرق صار مجموعا",
      quoi: "(a + √b)(a - √b) = a^2 - b : النتيجة فرق لا مجموع",
      geste: /مرافق|المتلازم|نستعمل|ننشر|نحسب|نطرح/,
      faire: function(math) {
          const r = relation(math);
          if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
          if (!/√/.test(r.membres[0])) return null;
          const t = termes(r.membres[1]);
          if (t.length !== 2) return null;
          const b = /^([+-])\s*(\d+)$/.exec(t[1].replace(/\s+/g, ' ').trim());
          if (!b) return null;
          return r.membres[0].trim() + ' = ' + t[0].trim()
               + (b[1] === '-' ? ' + ' : ' - ') + b[2];
        }
    },
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
