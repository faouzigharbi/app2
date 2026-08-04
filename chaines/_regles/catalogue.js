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
    {
      id: 'moins-devant-negatif',
      nom: 'ناقص أمام عدد سالب',
      quoi: 'طرح عدد سالب هو إضافة مقابله: a - (-b) = a + b، لا a - b',
      geste: /نحسب|نرفع|نزيل|الفرق|نطرح/,
      faire(math) {
        const m = /-\s*\(\s*-\s*([^()]+?)\s*\)/.exec(math);
        if (!m) return null;
        return math.slice(0, m.index) + '- ' + m[1] + math.slice(m.index + m[0].length);
      }
    },
    {
      id: 'exposant-additionne',
      nom: 'الأسّان جُمعا مكان أن يُضربا',
      quoi: 'عند توحيد الأساس يُضرب الأسّان: (a^p)^m = a^(p×m)، لا a^(p+m). '
          + 'مثال: 49^38 = (7^2)^38 = 7^76، لا 7^40',
      geste: /نوحّد الأساس|الأساس|نكتب بنفس|قوّة/,
      faire(math) {
        const r = relation(math);
        if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
        const g = /^\s*(\d+)\^(\d+)\s*$/.exec(r.membres[0]);
        const d = /^\s*(\d+)\^(\d+)\s*$/.exec(r.membres[1]);
        if (!g || !d) return null;
        const B = Number(g[1]), m1 = Number(g[2]);
        const b = Number(d[1]), k = Number(d[2]);
        if (b < 2 || B === b) return null;
        // B doit être une puissance de b : c'est ce que l'étape vient d'établir.
        let p = 0, v = 1;
        while (v < B) { v *= b; p++; }
        if (v !== B || p * m1 !== k) return null;
        return r.membres[0] + ' = ' + b + '^' + (p + m1);
      }
    },
    {
      id: 'distance-sans-valeur-absolue',
      nom: 'البعد كُتب بدون قيمة مطلقة',
      quoi: 'البعد بين نقطتين هو القيمة المطلقة للفرق: بدونها يصير سالبا أحيانا، '
          + 'و البعد لا يكون سالبا',
      geste: /نكتب الفرق|البعد|المسافة/,
      faire(math) {
        const r = relation(math);
        if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
        const m = /^\s*\|(.+)\|\s*$/.exec(r.membres[1]);
        if (!m) return null;
        // On échange les deux points : le calcul devient l'opposé, et sans les
        // barres il change de signe. C'est la faute, pas une réécriture.
        const t = termes(m[1]);
        if (t.length !== 2) return null;
        const b = sansSigne(t[1]);
        return r.membres[0] + ' = ' + b + ' - ' + t[0];
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
    {
      // Le même aveuglement que ci-dessus, mais dans l'écriture « a√b » : le
      // facteur carré sort de sous le radical SANS qu'on lui prenne sa racine.
      // C'est la faute reine du chapitre « الكتابة على شكل a√b ».
      id: 'carre-parfait-non-extrait',
      nom: 'المربّع الكامل خرج كما هو',
      quoi: 'العامل المربّع يخرج من تحت الجذر بجذره لا بقيمته: '
          + '√112 = √(16 × 7) = 4√7، لا 16√7',
      geste: /نُرجع|نُبسّط|نفصل|نحسب الجذر|نفكّك/,
      faire(math) {
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
      // « √a × √b = √(a×b) » : ce qui est sous les radicaux se multiplie SOUS
      // un radical, et il reste à en prendre la racine. L'élève qui l'oublie
      // écrit « √6 × √6 = 36 » — le geste est juste à mi-chemin.
      id: 'racine-du-produit-non-simplifiee',
      nom: 'ضربنا ما تحت الجذرين و بقي الناتج بلا جذر',
      quoi: '√a × √b = √(a × b) : ما تحت الجذرين يُضرب تحت جذر واحد ثمّ يُؤخذ '
          + 'جذره — √6 × √6 = √36 = 6، لا 36',
      geste: /يختفي|نضرب|جداء|نحسب|نجمع تحت|نُبسّط/,
      faire(math) {
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
      // Ce qui sort du radical est un carré, et il en sort SA RACINE. Le reste
      // y demeure. L'élève qui extrait un facteur quelconque écrit
      // « √20 = 2√10 » : il a bien décomposé 20 = 2 × 10, mais 2 n'est pas
      // un carré, il n'avait pas le droit de sortir.
      id: 'facteur-non-carre-sorti',
      nom: 'عامل غير مربّع خرج من الجذر',
      quoi: 'لا يخرج من تحت الجذر إلاّ عامل مربّع كامل، و يخرج بجذره: '
          + '√20 = √(4 × 5) = 2√5، أمّا √20 = 2√10 فباطلة',
      geste: /نُرجع|نُبسّط|نفصل|نحسب الجذر|نفكّك/,
      faire(math, A) {
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
      // « √a × √b = √(a + b) » — la règle du produit appliquée avec l'opération
      // de la somme. C'est la confusion inverse de `produit-de-racines-devenu-
      // somme` : là on changeait l'opération dehors, ici on la change dessous.
      id: 'radicandes-additionnes-au-produit',
      nom: 'في الجداء جمعنا ما تحت الجذرين',
      quoi: '√a × √b = √(a × b) : ما تحت الجذرين يُضرب، لا يُجمع — '
          + '√25 × √5 = √125 و ليس √30',
      geste: /نفصل|نضرب|جداء|نجمع تحت|نُبسّط/,
      faire(math) {
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
      // (√b)^2 = b, et non b^2 : élever au carré DÉFAIT la racine, il ne
      // s'ajoute pas à elle.
      id: 'carre-de-la-racine-non-simplifie',
      nom: 'مربّع الجذر بقي بلا اختصار',
      quoi: '(√b)^2 = b لأنّ التربيع يُلغي الجذر: (√6)^2 = 6، لا 36',
      geste: /المربّع|نربّع|المتطابقة|نحسب/,
      faire(math) {
        const r = relation(math);
        if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
        const g = /^\s*\(\s*√(\d+)\s*\)\s*\^\s*2\s*$/.exec(r.membres[0]);
        if (!g || !/^\s*\d+\s*$/.test(r.membres[1])) return null;
        const b = Number(g[1]);
        return r.membres[0].trim() + ' = ' + (b * b);
      }
    },
    {
      // Élever au carré, ce n'est pas doubler. La confusion « x^2 = 2x » a la
      // vie dure, et elle se voit très bien sur (√6)^2.
      id: 'carre-confondu-avec-le-double',
      nom: 'التربيع خُلط بالمضاعفة',
      quoi: 'التربيع ضرب العدد في نفسه لا في 2: (√6)^2 = √6 × √6 = 6، و ليس 2√6',
      geste: /المربّع|نربّع|المتطابقة|نحسب/,
      faire(math) {
        const r = relation(math);
        if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
        const g = /^\s*\(\s*(√\d+)\s*\)\s*\^\s*2\s*$/.exec(r.membres[0]);
        if (!g) return null;
        return r.membres[0].trim() + ' = 2' + g[1];
      }
    },
    {
      // La racine carrée n'est pas la moitié. C'est la confusion la plus
      // ancienne du chapitre, et elle survit longtemps : √36 = 18.
      id: 'racine-confondue-avec-la-moitie',
      nom: 'الجذر خُلط بالنصف',
      quoi: 'جذر العدد ليس نصفه: √36 = 6 لأنّ 6 × 6 = 36، و ليس 18',
      geste: /نحسب الجذر|نُبسّط|نُرجع/,
      faire(math) {
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
      // Le facteur commun est √11, pas 11. Le sortir sans son radical change
      // le nombre : c'est le pendant, pour les racines, du facteur mal lu.
      id: 'facteur-radical-sans-racine',
      nom: 'العامل المشترك خرج بلا جذر',
      quoi: 'العامل المشترك بين 6√11 و 3√11 × √13 هو √11، لا 11 : '
          + 'نُخرج ما هو مشترك فعلا',
      geste: /نُخرج|العامل المشترك|نفكّك|الشكل المفكّك/,
      faire(math) {
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
      // Un rationnel et un radical ne se joignent pas — c'est la règle des
      // termes semblables, transportée dans ℝ. « 3 + 8√3 = 11√3 » est la faute
      // la plus fréquente de tout le chapitre du développement.
      id: 'terme-rationnel-joint-au-radical',
      nom: 'عدد ناطق جُمع مع جذر',
      quoi: 'العدد الناطق و الجذر حدّان غير متشابهين: '
          + '3 + 8√3 يبقى كما هو، و ليس 11√3',
      geste: /نجمع|نرتّب|نعيد كتابة|نطرح|الفرق/,
      faire(math) {
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
      // (a + √b)(a - √b) = a^2 - b : c'est une DIFFÉRENCE. L'élève qui écrit
      // a^2 + b a retenu l'identité sans sa soustraction.
      id: 'conjugue-signe-du-carre',
      nom: 'المتلازمان — الفرق صار مجموعا',
      quoi: '(a + √b)(a - √b) = a^2 - b : النتيجة فرق لا مجموع',
      geste: /مرافق|المتلازم|نستعمل|ننشر|نحسب|نطرح/,
      faire(math) {
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
      // La règle ne vaut que pour le PRODUIT ; l'élève l'étend à la somme.
      // C'est le même énoncé que `racine-distribuee`, pris par l'autre bout :
      // là on distribuait sur une somme écrite, ici on remplace le produit
      // écrit par une somme.
      id: 'produit-de-racines-devenu-somme',
      nom: 'الجداء تحت الجذر صار مجموعا',
      quoi: '√(a × b) = √a × √b : القاعدة للجداء وحده. '
          + '√90 = √9 × √10 و ليس √9 + √10',
      geste: /نفصل|نفكّك|نُرجع|نُبسّط/,
      faire(math) {
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
      // Jointes, les racines semblables s'ajoutent PAR LEURS COEFFICIENTS ;
      // ce qui est sous le radical ne bouge pas. L'élève qui l'ajoute aussi
      // écrit « 4√3 + 15√3 = 19√6 ».
      id: 'radicande-additionne',
      nom: 'جمعنا ما تحت الجذر أيضا',
      quoi: 'عند جمع جذور متشابهة تُجمع المعاملات وحدها و يبقى الجذر كما هو: '
          + '2√7 + 3√7 = 5√7، لا 5√14',
      geste: /نجمع|نعيد كتابة|نضيف|الفرق/,
      faire(math) {
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
      // Le facteur commun est ici un RADICAL, mais la règle n'a pas changé :
      // chaque terme se divise par lui. C'est mot pour mot l'exemple du
      // maître — « 5a + 10b + 15 = 5(a + 2b + 15) » — écrit dans ℝ.
      id: 'facteur-radical-non-divise',
      nom: 'حدّ لم يُقسم على الجذر المشترك',
      quoi: 'عند إخراج جذر مشترك يُقسم كلّ حدّ عليه: '
          + '6√11 - 3√11 × √13 = √11(6 - 3√13)، لا √11(6√11 - 3√13)',
      geste: /نُخرج|العامل المشترك|نفكّك|الشكل المفكّك/,
      faire(math, A) {
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
      // Rationaliser, c'est multiplier LES DEUX termes du quotient. Le
      // numérateur seul, et le nombre a changé.
      id: 'racine-au-numerateur-seul',
      nom: 'ضربنا البسط وحده في الجذر',
      quoi: 'لجعل المقام ناطقا نضرب البسط و المقام معا في نفس الجذر: '
          + 'ضرب البسط وحده يغيّر قيمة الكسر',
      geste: /نضرب في|نُنطق|ناطقا|مرافق/,
      faire(math) {
        const r = relation(math);
        if (!r || r.membres.length !== 2 || r.ops[0] !== '=') return null;
        const m = /^\s*(.+?)\/\(\s*(.+?)\s*[×*]\s*(√\d+)\s*\)\s*$/.exec(r.membres[1]);
        if (!m || m[2].indexOf('√') < 0) return null;
        return r.membres[0].trim() + ' = ' + m[1].trim() + '/(' + m[2].trim() + ')';
      }
    },
    {
      // (a + b)^2 = a^2 + 2ab + b^2. Le terme du milieu n'est pas un
      // supplément : il EST l'identité. Sans lui, on a écrit (a+b)^2 = a^2+b^2.
      id: 'double-produit-oublie',
      nom: 'الحدّ الأوسط في المتطابقة سقط',
      quoi: '(a + b)^2 = a^2 + 2ab + b^2 : الحدّ الأوسط جزء من المتطابقة، '
          + 'و ليس (a + b)^2 = a^2 + b^2',
      geste: /نجمع|المتطابقة|الحدّ الأوسط|ننشر|نعيد كتابة/,
      faire(math) {
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
      // (a + √b)(a - √b) = a^2 - b : le radical disparaît parce qu'il est
      // ÉLEVÉ AU CARRÉ. L'élève qui le recopie tel quel n'a pas vu pourquoi
      // les deux conjugués s'appellent ainsi.
      id: 'conjugue-mal-developpe',
      nom: 'المتلازمان — الجذر لم يُربّع',
      quoi: '(a + √b)(a - √b) = a^2 - b : الجذر يختفي لأنّه يُربّع، '
          + 'فلا يبقى √b في النتيجة',
      geste: /مرافق|المتلازم|نستعمل|ننشر|نحسب/,
      faire(math) {
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
      id: 'conjugue-au-numerateur-seul',
      nom: 'المرافق ضُرب في البسط وحده',
      quoi: 'لإنطاق المقام نضرب البسط و المقام معا في المرافق: ضرب البسط وحده '
          + 'يغيّر الكسر',
      geste: /مرافق|نُنطق|إنطاق/,
      faire(math) {
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
      geste: /نقسم|نضرب الطرفين|مقلوب|على المعامل|خارج القسمة|نصيب|عدد|الثمن|نبحث/,
      faire(math) {
        if (math.indexOf(':') < 0) return null;
        return math.replace(':', '×');
      }
    },

    {
      // Tout négatif est plus petit que zéro, tout positif plus grand : c'est
      // la première comparaison du chapitre, celle sur laquelle reposent les
      // autres. La retourner, c'est retourner la droite graduée.
      id: 'signe-et-zero',
      nom: 'مقارنة عدد بالصفر',
      quoi: 'كلّ عدد سالب أصغر من الصفر و كلّ عدد موجب أكبر منه: '
          + '-24/5 < 0 و 0 < 12/5',
      geste: /نتحقّق|نقارن|نستنتج|نحدّد|إشارة/,
      faire(math) {
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
      // Mettre au même dénominateur, c'est multiplier le numérateur PAR LE MÊME
      // nombre. Le dénominateur change tout seul dans la copie de l'élève, et
      // le numérateur reste où il était : 17/8 = 17/24.
      id: 'denominateur-unifie-numerateur-inchange',
      nom: 'المقام وُحّد و البسط بقي كما هو',
      quoi: 'عند توحيد المقامات يُضرب البسط في نفس ما ضُرب فيه المقام: '
          + '17/8 = 51/24، لا 17/24',
      geste: /نوحّد|المقام المشترك|نفس المقام|نكتب/,
      faire(math) {
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
      // Soustraire un parenthèse change le signe de TOUS ses termes. L'élève
      // qui n'en change qu'un écrit « (b + 5/4) - (b + 3/4) = 5/4 + 3/4 » : il
      // a bien vu que b disparaissait, il n'a pas vu pourquoi.
      id: 'soustraction-partielle-du-parenthese',
      nom: 'الطرح لم يشمل كلّ حدود القوس',
      quoi: 'طرح قوس يغيّر إشارة كلّ حدوده: (b + 5/4) - (b + 3/4) = 5/4 - 3/4، '
          + 'لا 5/4 + 3/4',
      geste: /نحسب الفرق|الفرق|نرفع القوس|نزيل الأقواس/,
      faire(math) {
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
      // C'est LA règle de la comparaison des rationnels en 8ème, et la seule
      // qui résiste vraiment : entre deux nombres négatifs, celui qui a la plus
      // grande valeur absolue est le PLUS PETIT. L'élève qui compare -9 et -2
      // comme il comparerait 9 et 2 se trompe de sens, pas de calcul.
      id: 'ordre-des-negatifs',
      nom: 'ترتيب عددين سالبين مقلوب',
      quoi: 'بين عددين سالبين، الأكبر قيمة مطلقة هو الأصغر: -9 < -2، '
          + 'و -132 < -70',
      geste: /نقارن|نرتّب|المرفوضة|المقبولة|إشارة|نستنتج|نحدّد/,
      faire(math) {
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
      // Comparer deux fractions par leurs seuls numérateurs n'a de sens que si
      // les dénominateurs sont égaux. C'est tout l'objet du chapitre, et c'est
      // le raccourci que l'élève prend dès qu'on le laisse.
      id: 'numerateurs-compares-sans-meme-denominateur',
      nom: 'قارنّا البسطين و المقامان مختلفان',
      quoi: 'لا يُقارن البسطان إلاّ إذا كان المقام واحدا: 1/12 و 11/65 '
          + 'يُقارنان بالضرب التقاطعي أو بتوحيد المقام',
      geste: /نقارن|نستنتج|نحدّد/,
      faire(math) {
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

    // ═════ ARITHMÉTIQUE — PUISSANCES ET PRIORITÉS ═════
    //
    // Leur `geste` est écrit À L'ENVERS des autres : au lieu d'énumérer les
    // libellés où la règle a un sens, il énumère ceux où elle n'en a pas —
    // « النتيجة », « نترجم », « نلاحظ », « القاعدة ». C'est que dans ces fiches
    // TOUTE étape calculée est un pivot : chacune applique la règle du chapitre
    // et en tire un nombre. Lister les pivots un par un revenait à en oublier,
    // et l'on a vu « م.م.أ: كل عامل بأكبر أسّ » — le pivot même de la leçon —
    // rester hors d'atteinte parce que son libellé ne commençait pas par
    // « نحسب ».
    //
    // Ces trois-là ont besoin de CALCULER : elles reçoivent `A.nat`, qui
    // évalue une expression d'entiers naturels avec le moteur de la fiche. Les
    // fiches qui n'en ont pas le leur passent null, et les règles s'abstiennent.
    //
    // Une remarque qui vaut pour tout le chapitre : les étapes y sont des
    // ÉGALITÉS NUMÉRIQUES FERMÉES. Une faute de règle qui change les deux
    // membres à la fois — « ق.م.أ avec le plus grand exposant » — reste vraie
    // en elle-même et le juge ne peut pas la certifier fausse. On ne plante
    // donc ici que les fautes qui laissent le donné en place et se trompent
    // sur la valeur : ce sont aussi les seules qu'un élève écrit vraiment.
    {
      id: 'puissance-confondue-avec-le-produit',
      nom: 'القوّة خُلطت بالجداء',
      quoi: 'a^n جداء n عاملا كلّها a، لا a × n : 3^2 = 3 × 3 = 9، و ليس 6',
      geste: /^(?!\s*(?:النتيجة|نترجم|نلاحظ|القاعدة|إذن|وهو المطلوب|العدد المطلوب|الجذر التربيعي|أكبر حرف|كل الحلول))/,
      faire(math, A) {
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
      id: 'priorite-non-respectee',
      nom: 'ترتيب العمليات لم يُحترم',
      quoi: 'الأقواس أوّلا، ثمّ الضرب و القسمة، ثمّ الجمع و الطرح: '
          + '2 × (220 + 200) = 840، و ليس 2 × 220 + 200',
      geste: /^(?!\s*(?:النتيجة|نترجم|نلاحظ|القاعدة|إذن|وهو المطلوب|العدد المطلوب|الجذر التربيعي|أكبر حرف|كل الحلول))/,
      faire(math, A) {
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
      // « on ajoute 1 à chaque exposant PUIS ON MULTIPLIE », « le PPCM prend
      // tous les facteurs, et c'est un PRODUIT ». Chaque fois, la règle finit
      // par une multiplication, et chaque fois l'élève pressé additionne.
      id: 'somme-au-lieu-du-produit',
      nom: 'جمعنا حيث تقول القاعدة نضرب',
      quoi: 'القاعدة تنتهي بجداء لا بمجموع: عدد القواسم (2+1) × (2+1) = 9، '
          + 'و ليس (2+1) + (2+1) = 6',
      geste: /^(?!\s*(?:النتيجة|نترجم|نلاحظ|القاعدة|إذن|وهو المطلوب|العدد المطلوب|الجذر التربيعي|أكبر حرف|كل الحلول))/,
      faire(math, A) {
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
      id: 'exposant-soustrait-au-lieu-de-divise',
      nom: 'الأسّ طُرح بدل أن يُقسم',
      quoi: 'لكتابة عدد على شكل مربّع أو مكعّب يُقسم كلّ أسّ على 2 أو على 3، '
          + 'لا يُطرح منه: 5^6 = (5^3)^2 لأنّ 3 × 2 = 6',
      geste: /^(?!\s*(?:النتيجة|نترجم|نلاحظ|القاعدة|إذن|وهو المطلوب|العدد المطلوب|الجذر التربيعي|أكبر حرف|كل الحلول))/,
      faire(math) {
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
    },


    // ═════ ARITHMÉTIQUE — LA CHAÎNE COMME SUITE D'EXPRESSIONS ═════
    //
    // Dans les fiches de calcul réfléchi, une étape n'est pas une égalité mais
    // une EXPRESSION : la précédente, réécrite plus simplement. L'invariant est
    // qu'elle vaut toujours le même nombre. Une faute s'y voit donc à ce que la
    // réécriture change la valeur — et le juge de la fiche le vérifie.
    {
      id: 'priorite-dans-la-reduction',
      nom: 'الجمع أُنجز قبل الضرب',
      quoi: 'الضرب و القسمة قبل الجمع و الطرح: 26 × 9 + 3 = 234 + 3، '
          + 'و ليس 26 × (9 + 3)',
      geste: /ننجز|نحسب|نطبّق|نعيد/,
      faire(math) {
        const t = String(math).trim();
        if (/[=a-zA-Zأ-ي]/.test(t)) return null;
        // Un produit suivi d'une somme, au même niveau : « a × b + c ».
        const p = /^(.*[×*]\s*)(\d+)\s*([+\-])\s*(\d+)\s*$/.exec(t);
        if (!p) return null;
        return p[1] + '(' + p[2] + ' ' + p[3] + ' ' + p[4] + ')';
      }
    },
    {
      id: 'regroupement-mal-signe',
      nom: 'الإشارة تغيّرت داخل القوس',
      quoi: 'إعادة التجميع تُبقي قيمة العبارة: 487 + (373 - 73) و ليس '
          + '487 + (373 + 73)',
      geste: /نجمّع|نعيد التجميع|ننجز/,
      faire(math) {
        const t = String(math).trim();
        if (/[=a-zA-Zأ-ي]/.test(t)) return null;
        const m = /\((\s*\d+\s*)([+\-])(\s*\d+\s*)\)/.exec(t);
        if (!m) return null;
        return t.slice(0, m.index) + '(' + m[1] + (m[2] === '+' ? '-' : '+') + m[3] + ')'
             + t.slice(m.index + m[0].length);
      }
    },
    {
      id: 'facteurs-regroupes-en-somme',
      nom: 'العوامل جُمعت بدل أن تُضرب',
      quoi: 'إعادة ترتيب العوامل تُبقي الجداء جداء: 50 × 80 × 2 = (50 × 2) × 80، '
          + 'و القوس هنا جداء لا مجموع',
      geste: /نعيد ترتيب|نعيد التجميع|نجمّع/,
      faire(math) {
        const t = String(math).trim();
        if (/[=a-zA-Zأ-ي]/.test(t)) return null;
        const m = /\((\s*\d+\s*)[×*](\s*\d+\s*)\)/.exec(t);
        if (!m) return null;
        return t.slice(0, m.index) + '(' + m[1] + '+' + m[2] + ')'
             + t.slice(m.index + m[0].length);
      }
    },
    {
      id: 'facteur-non-distribue',
      nom: 'التوزيع على الحدّ الأوّل فقط',
      quoi: 'عند نشر k × (a + b) يُضرب k في الحدّين: 37 × (37 + 63)، '
          + 'و ليس 37 × 37 + 63',
      geste: /ننشر|نوزّع|ننجز/,
      faire(math) {
        const t = String(math).trim();
        if (/[=a-zA-Zأ-ي]/.test(t)) return null;
        const m = /^(\d+)\s*[×*]\s*\(\s*(\d+)\s*([+\-])\s*(\d+)\s*\)\s*$/.exec(t);
        if (!m) return null;
        return m[1] + ' × ' + m[2] + ' ' + m[3] + ' ' + m[4];
      }
    },
    {
      id: 'regle-du-terme-commun-mal-signee',
      nom: 'قاعدة الحدّ المشترك — الإشارة',
      quoi: '(أ − ج) − (ب − ج) = أ − ب، و (أ − ج) + (ب + ج) = أ + ب : '
          + 'الإشارة النهائية تُقرأ في القاعدة، لا تُخمَّن',
      geste: /نطبّق القاعدة/,
      faire(math) {
        const t = String(math).trim();
        if (/[=a-zA-Zأ-ي()]/.test(t)) return null;
        const m = /^(\d+)\s*([+\-])\s*(\d+)$/.exec(t);
        if (!m) return null;
        return m[1] + ' ' + (m[2] === '+' ? '-' : '+') + ' ' + m[3];
      }
    },
    {
      id: 'terme-manquant-additionne',
      nom: 'الحدّ المجهول — جمعنا بدل أن نطرح',
      quoi: 'للبحث عن الحدّ المجهول في مجموع نطرح: 55 + ... = 65 يعطي 65 - 55، '
          + 'لا 65 + 55',
      geste: /نحسب/,
      faire(math) {
        const t = String(math).trim();
        if (/[=a-zA-Zأ-ي()]/.test(t)) return null;
        const m = /^(\d+)\s*-\s*(\d+)$/.exec(t);
        if (!m) return null;
        return m[1] + ' + ' + m[2];
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
