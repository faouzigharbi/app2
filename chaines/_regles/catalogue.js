// LA BIBLIOTHÈQUE DES RÈGLES — la source unique des pages « أين الخطأ؟ ».
//
// Vingt et une fiches, cent cinquante exercices, mille volets : on ne les
// traite pas un par un. On les traite par les RÈGLES DU PROGRAMME qu'ils
// enseignent, et il n'y en a que quelques dizaines pour tout le collège.
// « Le facteur commun divise TOUS les termes » sert en 7ème dans expr7, en
// 8ème dans factq8, en 9ème dans serie3. Écrite ici une fois, contrôlée une
// fois, elle couvre les trois.
//
// ─────────────────────────────────────────────────────────────────────────
// OÙ SE MET L'ERREUR — sur l'étape PIVOT, celle qui porte le geste.
//
// Nos chaînes ont un privilège : chaque étape DIT son geste, en arabe, dans
// son libellé — « نُخرج العامل المشترك », « نقسم على -2 فينقلب الترتيب »,
// « نرفع القيمة المطلقة ». Le « où » n'est donc pas affaire d'intuition, il
// est écrit dans la fiche. Chaque règle porte son `geste` : l'expression
// régulière des libellés où elle a un sens. Une étape de mise en place
// (« نعوّض », « نستعمل المعطى ») et une étape de résultat (« النتيجة ») ne
// sont jamais des pivots.
//
// SON OBJECTIF — faire NOMMER la règle violée.
//
// Pas « trouve l'erreur » : « dis quelle règle a été trahie ». D'où le `nom`,
// que l'élève lit, et le `quoi`, qui la lui rappelle. Et d'où l'exclusion
// absolue de la faute de calcul : un chiffre changé ne viole aucune règle.
// L'élève qui le trouve n'a rien appris, celui qui le manque n'a rien à
// réviser — il aurait appris à relire quand on veut lui apprendre à raisonner.
//
// ─────────────────────────────────────────────────────────────────────────
// CE QU'UNE RÈGLE REÇOIT. Un adaptateur `A`, parce que les fiches n'ont pas
// toutes le même noyau : A.analyser, A.txt, A.add, A.sub, A.mul, A.pgcd,
// A.ent, A.choix. Le porteur le construit à partir du noyau de la fiche.
//
// CE QU'UNE RÈGLE REND. Le texte fautif, ou null si elle ne s'applique pas.
// Elle n'a JAMAIS à se demander si sa faute est bien fausse : le juge de la
// fiche le vérifie après elle, et la rejette sinon.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);

  // ── Outils de découpe, communs à toutes les règles ──────────────────────

  // Les termes de PREMIER niveau : « a + b(c - d) » donne « a » et « + b(c - d) ».
  // Un balayage, pas une expression régulière — les parenthèses s'imbriquent,
  // et les barres de valeur absolue aussi.
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

  // « a ≤ b ≤ c » → membres [a, b, c] et signes [≤, ≤].
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

  // « -5/2 x^2 » → { signe, coef, lettre }. Le cœur de la plupart des règles :
  // c'est en monômes que se lisent les fautes de coefficient et de lettre.
  function monome(t) {
    const m = /^\s*([+-]?)\s*([0-9]+(?:\/[0-9]+)?)?\s*([a-zA-Z]+(?:\^[0-9]+)?)?\s*$/.exec(t);
    if (!m || (!m[2] && !m[3])) return null;
    return { signe: m[1] || '+', coef: m[2] || null, lettre: m[3] || null };
  }

  const estMajal = s => /[[\]][^;]*;/.test(s) || /[∩∪]/.test(s);
  const sansSigne = t => String(t).replace(/^[+-]\s*/, '').trim();

  // ── Les règles, groupées par ce qu'elles enseignent ─────────────────────
  //
  // `id` sert au porteur ; `nom` et `quoi` sont lus par l'élève ; `geste`
  // borne les libellés où la règle a un sens ; `faire(math, A)` fabrique.

  const REGLES = [

    // ═════ FACTORISATION ET DISTRIBUTIVITÉ ═════
    {
      id: 'facteur-non-divise',
      nom: 'حدّ لم يُقسم على العامل المشترك',
      quoi: 'عند التفكيك يُقسم كل حدّ على العامل المشترك، و الحدّ الثابت مثل غيره. '
          + 'الخطأ الشائع: 5a + 10b + 15 = 5(a + 2b + 15) بدل 5(a + 2b + 3)',
      geste: /نكتب الجداء|نُخرج|نُظهر|عاملا مشتركا|الشكل المفكّك|نفكّك|نضع/,
      faire(math, A) {
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
      id: 'distribution-partielle',
      nom: 'التوزيع على الحدّ الأوّل فقط',
      quoi: 'عند نشر k(a + b) يُضرب k في كل حدّ، لا في الأوّل وحده',
      faire(math) {
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
      id: 'developpement-incomplet',
      nom: 'النشر ناقص — حدّ لم يُضرب',
      quoi: 'عند نشر جداء قوسين، كل حدّ من الأوّل يُضرب في كل حدّ من الثاني: لا حدّ يُترك',
      geste: /ننشر|نعيد كتابة|نرتّب|نزيل الأقواس|نضرب القوسين|نعوّض/,
      faire(math, A) {
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

    // ═════ TERMES SEMBLABLES ═════
    {
      id: 'termes-non-semblables',
      nom: 'حدود غير متشابهة جُمعت',
      quoi: 'حدود x لا تُجمع مع حدود y: المعاملان لا يُجمعان إلاّ إذا كان الحرف واحدا',
      faire(math, A) {
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
      id: 'coefficient-un-oublie',
      nom: 'معامل الحرف الوحيد نُسي',
      quoi: 'الحرف y وحده معناه 1 × y: معامله 1، و لا يُهمل عند جمع المعاملات',
      faire(math, A) {
        const r = relation(math);
        if (!r || r.membres.length !== 2) return null;
        const m = /^\(([^()]+)\)\s*([a-zA-Z]+)\s*$/.exec(r.membres[1]);
        if (!m) return null;
        const t = termes(m[1]);
        let i = -1;
        for (let j = 0; j < t.length; j++) if (/^[+-]?\s*1$/.test(t[j])) i = j;
        if (i < 0 || t.length < 3) return null;
        const copie = r.membres.slice();
        copie[1] = '(' + t.slice(0, i).concat(t.slice(i + 1)).join(' ') + ')' + m[2];
        return copie.join(' = ');
      }
    },

    // ═════ FRACTIONS ═════
    {
      id: 'somme-des-numerateurs',
      nom: 'جمع البسطين و المقامين',
      quoi: 'لجمع كسرين نوحّد المقام؛ جمع البسطين و المقامين ليس جمعا',
      faire(math) {
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
      id: 'denominateur-non-multiplie',
      nom: 'المقام لم يُضرب',
      quoi: 'عند ضرب كسرين يُضرب البسط في البسط و المقام في المقام: المقام لا يبقى كما هو',
      geste: /نضرب|جداء الكسرين|نبسّط الجداء/,
      faire(math, A) {
        const m = /(\d+)\/(\d+)\s*[×*]\s*(\d+)\/(\d+)/.exec(math);
        if (!m) return null;
        const n = Number(m[1]) * Number(m[3]);
        const r = relation(math);
        if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
        return r.membres[0] + ' = ' + n + '/' + m[2];
      }
    },

    {
      id: 'numerateur-non-multiplie',
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
      id: 'numerateur-oublie',
      nom: 'المقام تغيّر و البسط بقي كما هو',
      quoi: 'عند التحويل إلى المقام المشترك يُضرب البسط في نفس ما ضُرب فيه المقام: '
          + '3/8 تصير 15/40، لا 3/40',
      geste: /نوحّد|المقام المشترك|نكتب على نفس المقام|نجمع البسوط|نطرح البسوط/,
      faire(math, A) {
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
      id: 'signe-du-produit',
      nom: 'إشارة الجداء',
      quoi: 'جداء عددين سالبين موجب، و جداء عدد سالب في موجب سالب: الإشارة تُحسب '
          + 'قبل القيم المطلقة، و لا تُنسخ من أحد العاملين',
      geste: /الإشارة|إشارة الجداء|إشارة الخارج|نحدّد الإشارة|النتيجة/,
      faire(math) {
        const r = relation(math);
        if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
        const d = r.membres[1].trim();
        const bascule = d[0] === '-' ? d.slice(1).trim() : '-' + d;
        return r.membres[0] + ' = ' + bascule;
      }
    },
    {
      id: 'simplification-unilaterale',
      nom: 'اختصرنا في البسط دون المقام',
      quoi: 'الاختصار يقسم البسط و المقام معا؛ قسمة البسط وحده تغيّر الكسر',
      geste: /نبسّط|نختصر|قبل الضرب/,
      faire(math) {
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
    },
    {
      id: 'produit-croise',
      nom: 'ضربنا البسط في المقام',
      quoi: 'جداء كسرين: البسط في البسط و المقام في المقام. الضرب في تقاطع '
          + 'ليس جداء، إنّه قسمة',
      geste: /جداء|نضرب|نكتب/,
      faire(math) {
        const r = relation(math);
        if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
        const d = /^\s*\(([^()]+)\)\s*\/\s*\(([^()]+)\)\s*$/.exec(r.membres[1]);
        if (!d) return null;
        const hb = d[1].split('×').map(x => x.trim());
        const bb = d[2].split('×').map(x => x.trim());
        if (hb.length !== 2 || bb.length !== 2) return null;
        return r.membres[0] + ' = (' + hb[0] + ' × ' + bb[1] + ') / ('
             + bb[0] + ' × ' + hb[1] + ')';
      }
    },
    // ═════ ORDRE ET ENCADREMENT ═════
    {
      id: 'ordre-non-renverse',
      nom: 'الترتيب لم ينقلب',
      quoi: 'عند الضرب أو القسمة على عدد سالب، و عند أخذ المقلوب، ينقلب ترتيب الحصر',
      geste: /نضرب|نقسم|نقلب|المقلوب|نأخذ/,
      faire(math) {
        const r = relation(math);
        if (!r || r.membres.length !== 3) return null;
        if (r.ops[0] !== r.ops[1] || !/[<>≤≥]/.test(r.ops[0])) return null;
        return r.membres[2] + ' ' + r.ops[0] + ' ' + r.membres[1] + ' '
             + r.ops[1] + ' ' + r.membres[0];
      }
    },
    {
      id: 'crochet-retourne',
      nom: 'القوس مقلوب',
      quoi: 'حدّ مأخوذ يُكتب بقوس مغلق، و حدّ غير مأخوذ بقوس مفتوح',
      faire(math, A) {
        if (!/[[\]][^;]*;/.test(math)) return null;
        const pos = [];
        for (let i = 0; i < math.length; i++) {
          if (math[i] === '[' || math[i] === ']') pos.push(i);
        }
        if (!pos.length) return null;
        const i = pos[A.ent(0, pos.length - 1)];
        return math.slice(0, i) + (math[i] === '[' ? ']' : '[') + math.slice(i + 1);
      }
    },
    {
      id: 'intersection-reunion',
      nom: 'التقاطع مكان الاتّحاد',
      quoi: 'التقاطع يأخذ ما هو مشترك بين المجالين، و الاتّحاد يأخذ كل ما في أحدهما',
      faire(math) {
        if (!/[∩∪]/.test(math)) return null;
        return math.replace(/[∩∪]/g, c => (c === '∩' ? '∪' : '∩'));
      }
    },

    // ═════ VALEUR ABSOLUE ET RADICAUX ═════
    {
      id: 'valeur-absolue-non-levee',
      nom: 'القيمة المطلقة رُفعت دون تغيير الإشارة',
      quoi: 'القيمة المطلقة لعدد سالب هي مقابله، لا هو نفسه — و √(t^2) = |t| لا t',
      faire(math) {
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
      id: 'racine-distribuee',
      nom: 'الجذر وُزّع على مجموع',
      quoi: 'الجذر يُوزّع على الجداء لا على المجموع: √(a×b) = √a × √b، لكن √(a+b) ≠ √a + √b',
      geste: /نفصل|نفكّك|نبسّط|نُرجع|نُخرج/,
      faire(math) {
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
      id: 'carre-parfait-mal-sorti',
      nom: 'المربّع الكامل خرج دون جذر',
      quoi: 'عند إخراج مربّع كامل من تحت الجذر يخرج جذره: √(16 × 10) = 4√10، لا 16√10',
      geste: /نحسب الجذر|نُبسّط|نفصل|النتيجة/,
      faire(math, A) {
        const m = /√(\d+)\s*=\s*(\d+)/.exec(math);
        if (!m) return null;
        const k = Number(m[2]);
        if (k * k !== Number(m[1])) return null;
        return math.slice(0, m.index) + '√' + m[1] + ' = ' + m[1]
             + math.slice(m.index + m[0].length);
      }
    },

    // ═════ ÉQUATIONS ═════
    {
      id: 'transposition-sans-signe',
      nom: 'حدّ نُقل دون تغيير إشارته',
      quoi: 'حدّ يعبر علامة التساوي يغيّر إشارته: نطرح من الطرفين، لا من طرف واحد',
      geste: /من الطرفين|نضيف|نعزل|ننقل|نجمع حدود/,
      faire(math, A) {
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
      id: 'division-devenue-multiplication',
      nom: 'قسمنا حيث يجب أن نضرب',
      quoi: 'للتخلّص من معامل نقسم عليه؛ الضرب فيه يُبعد عن الحلّ بدل أن يقرّب',
      geste: /نقسم|نضرب الطرفين|مقلوب|على المعامل/,
      faire(math) {
        if (math.indexOf(':') < 0) return null;
        return math.replace(':', '×');
      }
    },

    // ═════ SIGNES DANS ℤ ═════
    {
      id: 'parenthese-negative-mal-levee',
      nom: 'قوس مسبوق بناقص رُفع دون تغيير الإشارات',
      quoi: 'قوس مسبوق بـ « - » ترفع إشارات كل حدوده: -(a - b) = -a + b',
      geste: /نرفع القوس|نزيل الأقواس|بدون أقواس|نكتب المقابل/,
      faire(math) {
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

  const API = { REGLES, termes, relation, recoller, monome, estMajal, sansSigne };
  if (M) module.exports = API; else racine.Regles = API;
})(typeof window !== 'undefined' ? window : globalThis);
