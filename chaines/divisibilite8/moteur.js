// Moteur de chaînes de démonstration — fonctionne dans le navigateur et sous Node.
//
// Les exercices de cette série sont générés : les nombres changent à chaque
// rafraîchissement. La chaîne de correction ne peut donc pas être écrite à la
// main, elle est calculée à partir des valeurs tirées.
//
// Invariant tenu par toutes les familles : chaque étape d'une chaîne, si elle
// est calculable, vaut le résultat final. C'est ce que contrôle verifier.js.
(function (racine) {
  'use strict';

  // -------------------------------------------------------------------------
  // Évaluation en entiers naturels
  // -------------------------------------------------------------------------
  const toJs = s => String(s).replace(/×/g, '*').replace(/−/g, '-')
    .replace(/\[/g, '(').replace(/\]/g, ')').replace(/\s*:\s*/g, '/');

  // Replie les signes doubles : une parenthèse peut valoir un nombre négatif
  // lorsqu'on vérifie « le calcul direct donne-t-il le même résultat ? ».
  function normalise(e) {
    let s = String(e).replace(/\s+/g, ' '), avant;
    do {
      avant = s;
      s = s.replace(/-\s*-/g, '+').replace(/\+\s*-/g, '-')
           .replace(/-\s*\+/g, '-').replace(/\+\s*\+/g, '+');
    } while (s !== avant);
    return s.trim();
  }

  function plat(e, bad) {
    const t = normalise(e).match(/\d+|[+\-*/^]/g);
    if (!t) throw new Error('expression vide: ' + e);
    // Les puissances d'abord, de droite à gauche.
    let k;
    while ((k = t.lastIndexOf('^')) > 0) {
      t.splice(k - 1, 3, String(Math.pow(Number(t[k - 1]), Number(t[k + 1]))));
    }
    if (t[0] === '-') t.splice(0, 2, String(-Number(t[1])));
    const p = [t[0]];
    for (let i = 1; i < t.length; i += 2) {
      const op = t[i], b = Number(t[i + 1]);
      if (op === '*' || op === '/') {
        const a = Number(p.pop());
        const r = op === '*' ? a * b : a / b;
        if (op === '/' && !Number.isInteger(r)) bad.push('قسمة غير تامّة: ' + a + ' : ' + b);
        p.push(String(r));
      } else p.push(op, String(b));
    }
    let acc = Number(p[0]);
    for (let i = 1; i < p.length; i += 2) {
      acc = p[i] === '+' ? acc + Number(p[i + 1]) : acc - Number(p[i + 1]);
      if (acc < 0) bad.push('نتيجة وسطى سالبة: ' + acc);
    }
    return acc;
  }

  function evalNat(expr, bad) {
    bad = bad || [];
    let e = toJs(expr).trim(), g = 0;
    while (/\(/.test(e)) {
      if (++g > 60) throw new Error('boucle: ' + expr);
      e = e.replace(/\(([^()]*)\)/, (_, i) => String(plat(i, bad)));
    }
    return plat(e, bad);
  }

  // -------------------------------------------------------------------------
  // Chaîne automatique — priorité des opérations
  //
  // À chaque étape on réduit d'un coup TOUTES les opérations de même priorité
  // au même niveau de parenthèses. Deux produits indépendants tombent dans la
  // même étape : sinon l'ordre inverse, tout aussi correct, serait compté faux.
  // -------------------------------------------------------------------------
  const OUVRANTS = { '(': ')', '[': ']' };

  function groupesProfonds(e) {
    const pile = [], tous = [];
    for (let i = 0; i < e.length; i++) {
      if (OUVRANTS[e[i]]) pile.push({ i: i, c: e[i], prof: pile.length });
      else if (e[i] === ')' || e[i] === ']') {
        const o = pile.pop();
        tous.push({ debut: o.i, fin: i, prof: o.prof, ouvrant: o.c,
                    contenu: e.slice(o.i + 1, i) });
      }
    }
    if (!tous.length) return [];
    const max = Math.max.apply(null, tous.map(g => g.prof));
    return tous.filter(g => g.prof === max).sort((a, b) => a.debut - b.debut);
  }

  const aMul = s => /[×:]/.test(s);
  const aAdd = s => /(\d|\))\s*[+\-]/.test(s);

  function reduireMul(e) {
    const t = e.match(/\d+|[+\-×:]/g);
    const out = [t[0]];
    for (let i = 1; i < t.length; i += 2) {
      const op = t[i], b = t[i + 1];
      if (op === '×' || op === ':') {
        const a = Number(out.pop());
        out.push(String(op === '×' ? a * Number(b) : a / Number(b)));
      } else out.push(op, b);
    }
    return out.join(' ').replace(/\s+/g, ' ');
  }

  // Un nombre « mestedir » : celui qu'on veut voir apparaître.
  const estRond = v => v > 0 && (v % 100 === 0 || (v % 10 === 0 && v >= 20));
  const rondeur = v => (v % 1000 === 0 ? 3 : v % 100 === 0 ? 2 : 1);

  // Cherche un regroupement avantageux dans une chaîne de + et de −.
  // 299 + 277 - 77  →  299 + (277 - 77)  : on fait apparaître 200.
  // a - b - c       →  a - (b + c)       : quand b + c est rond.
  // Seuls les termes VOISINS sont regroupés, et jamais au prix d'un
  // changement de signe : on ne développe pas, on met en facteur.
  function regroupement(e) {
    const t = e.match(/\d+|[+\-]/g);
    if (!t || t.length < 5) return null;            // moins de 3 termes
    const termes = [{ signe: '+', v: Number(t[0]) }];
    for (let i = 1; i < t.length; i += 2) termes.push({ signe: t[i], v: Number(t[i + 1]) });

    let best = null;
    for (let i = 0; i < termes.length - 1; i++) {
      const a = termes[i], b = termes[i + 1];
      let val = null, bloc = null, signe = null;
      if (a.signe === '+') {                        // (a ± b)
        val = b.signe === '+' ? a.v + b.v : a.v - b.v;
        bloc = '(' + a.v + ' ' + b.signe + ' ' + b.v + ')';
        signe = '+';
      } else if (a.signe === '-' && b.signe === '-') {   // -(a + b)
        val = a.v + b.v;
        bloc = '(' + a.v + ' + ' + b.v + ')';
        signe = '-';
      }
      if (val === null || !estRond(val)) continue;
      if (!best || rondeur(val) > rondeur(best.val)) best = { i, val, bloc, signe };
    }
    if (!best) return null;

    const rendu = (remplacement) => termes.map((x, k) => {
      if (k === best.i) return (k === 0 ? '' : best.signe + ' ') + remplacement;
      if (k === best.i + 1) return '';
      return (k === 0 ? '' : x.signe + ' ') + x.v;
    }).filter(Boolean).join(' ').trim();

    return { avec: rendu(best.bloc), apres: rendu(String(best.val)) };
  }

  function chainePriorite(expr) {
    const etapes = [];
    let e = String(expr).trim(), garde = 0, regroupe = false;

    for (;;) {
      if (++garde > 40) throw new Error('boucle: ' + expr);
      const profonds = groupesProfonds(e);

      if (profonds.length) {
        const mixtes = profonds.filter(g => aMul(g.contenu) && aAdd(g.contenu));
        const cibles = mixtes.length ? mixtes : profonds;
        const parties = [];
        let pos = 0;
        for (const g of cibles) {
          parties.push(e.slice(pos, g.debut));
          parties.push(mixtes.length
            ? g.ouvrant + reduireMul(g.contenu) + OUVRANTS[g.ouvrant]
            : String(evalNat(g.contenu)));
          pos = g.fin + 1;
        }
        parties.push(e.slice(pos));
        const suivant = parties.join('').replace(/\s+/g, ' ').trim();
        etapes.push([
          mixtes.length ? 'داخل الأقواس: الضرب أولا'
            : cibles[0].prof > 0 ? 'ننجز القوس الداخلي' : 'ننجز الأقواس',
          suivant
        ]);
        e = suivant;
        continue;
      }

      if (aMul(e)) {
        const suivant = reduireMul(e);
        if (/^\d+$/.test(suivant.trim())) break;
        etapes.push([/:/.test(e) ? 'ننجز الضرب والقسمة' : 'ننجز الضرب', suivant]);
        e = suivant;
        continue;
      }

      // Avant de calculer bêtement de gauche à droite, on regarde s'il y a
      // mieux à faire : c'est la méthode qui compte, pas seulement le résultat.
      if (!regroupe) {
        regroupe = true;
        const r = regroupement(e);
        if (r) {
          etapes.push(['نجمّع ما يعطي عددا مستديرا', r.avec]);
          etapes.push(['ننجز القوس', r.apres]);
          e = r.apres;
          continue;
        }
      }

      const t = e.match(/\d+|[+\-]/g);
      if (t.length <= 3) break;
      const v = t[1] === '+' ? Number(t[0]) + Number(t[2]) : Number(t[0]) - Number(t[2]);
      const suivant = [String(v)].concat(t.slice(3)).join(' ');
      etapes.push(['من اليسار إلى اليمين', suivant]);
      e = suivant;
    }

    const res = evalNat(expr);
    etapes.push(['النتيجة', '= ' + res]);
    const regle = /[([]/.test(expr) ? 'الأقواس ← الضرب والقسمة ← الجمع والطرح'
      : aMul(expr) ? 'الضرب والقسمة قبل الجمع والطرح'
      : 'من اليسار إلى اليمين';
    return { etapes: [['نحدّد الأولوية', regle]].concat(etapes), res: res };
  }

  // -------------------------------------------------------------------------
  // Familles « أحسب بأيسر طريقة »
  // -------------------------------------------------------------------------
  function chaineCommun(o) {
    const res = evalNat(o.reduit);
    return {
      res: res,
      etapes: [
        ['نلاحظ', 'الحد المشترك: ' + o.commun],
        ['القاعدة', o.regle],
        ['نطبّق القاعدة', o.reduit],
        ['النتيجة', '= ' + res]
      ]
    };
  }

  function chaineRegroupe(o) {
    const apres = o.regroupe.replace(/\([^()]*\)/g, m => String(evalNat(m)));
    const et = [['نلاحظ', o.remarque], [o.etiquette || 'نعيد التجميع', o.regroupe]];
    if (apres !== o.regroupe) et.push(['ننجز الأقواس', apres]);
    const res = evalNat(o.regroupe);
    et.push(['النتيجة', '= ' + res]);
    return { etapes: et, res: res };
  }

  function chaineFacteur(o) {
    const apres = o.factorise.replace(/\([^()]*\)/g, m => String(evalNat(m)));
    const res = evalNat(o.factorise);
    return {
      res: res,
      etapes: [
        ['نلاحظ', 'العامل المشترك: ' + o.facteur],
        ['ننشر العامل المشترك', o.factorise],
        ['ننجز القوس', apres],
        ['النتيجة', '= ' + res]
      ]
    };
  }

  // Somme d'une suite régulière : on compte les paires de même total.
  function chaineSerie(o) {
    const et = [
      ['نلاحظ', 'نجمّع الطرف الأول مع الطرف الأخير'],
      ['كل زوج مجموعه', o.paire],
      ['عدد الأزواج', o.paires + ' × ' + o.total + ' = ' + (o.paires * o.total)]
    ];
    if (o.reste) et.push(['نضيف الحد الأوسط', (o.paires * o.total) + ' + ' + o.reste]);
    et.push(['النتيجة', '= ' + o.res]);
    return { etapes: et, res: o.res };
  }

  function chaineBlanc(o) {
    return {
      res: o.res,
      etapes: [['نحدّد المطلوب', o.enonce]]
        .concat(o.etapes.map(e => ['نحسب', e]))
        .concat([['النتيجة', '= ' + o.res]])
    };
  }

  // -------------------------------------------------------------------------
  // Sens d'écriture
  //
  // Dans une page dir="rtl", une expression laissée nue est réordonnée par le
  // navigateur : « 2 × 3 + 4 » s'affiche « 4 + 3 × 2 ». On isole donc chaque
  // portion mathématique, le texte arabe restant dans le flux de la page. Une
  // expression n'est jamais coupée en fin de ligne : coupée, ses parenthèses
  // seraient inversées.
  // -------------------------------------------------------------------------
  const RUN = /[0-9A-Za-z+\-*×÷/:=^().,… ]+/g;
  const PUR = /^[\d\s+\-*×÷/:=().[\]]+$/;
  const rogne = s => s.replace(/^[\s:]+/, '').replace(/[\s:.,]+$/, '');
  const span = (s, atom) => '<span dir="ltr"'
    + (atom ? ' style="display:inline-block;white-space:nowrap"' : '') + '>' + s + '</span>';

  function iso(str, atom) {
    return String(str).replace(RUN, m => {
      const n = rogne(m);
      if (!n || !/\d/.test(n) || !/[+\-*×÷/=^]|\d\s*:\s*\d/.test(n)) return m;
      const i = m.indexOf(n);
      return m.slice(0, i) + span(n, atom) + m.slice(i + n.length);
    });
  }

  const md = (s, atom) => (PUR.test(String(s)) ? span(String(s).trim(), atom) : iso(s, atom));

  // -------------------------------------------------------------------------
  // Fabrication d'une question au format attendu par le gabarit
  // -------------------------------------------------------------------------
  const INDICES = {
    priorite: 'الأقواس أولا، ثم الضرب والقسمة، ثم الجمع والطرح',
    commun: 'لا تحسب الأقواس: ابحث عن الحد المشترك',
    regroupe: 'أعد التجميع قبل أن تحسب',
    facteur: 'أخرج العامل المشترك',
    blanc: 'اعكس العملية للوصول إلى الحد الناقص'
  };

  // enonce : texte arabe déjà rédigé ; math : expression à isoler (facultatif)
  function question(type, enonce, math, chaine) {
    return {
      operation: math ? enonce + ' ' + md(math, true) : iso(enonce, true),
      // LA DIFFICULTÉ SE COMPTE EN NOTIONS, pas en étapes.
      //
      // Une notion, c'est une FORMULE APPLIQUÉE. Un exercice qui applique
      // Pythagore trois fois n'est pas difficile — il est long ; celui qui
      // enchaîne Pythagore, la relation métrique et le cercle circonscrit
      // l'est, parce qu'il faut savoir laquelle choisir à chaque fois.
      //
      //     1 notion → facile · 2 ou 3 → moyen · 4 et plus → difficile
      //
      // Les chapitres de géométrie nomment la règle sous « القاعدة » : c'est
      // sa VALEUR qui distingue. Les chapitres de calcul la nomment dans
      // l'étiquette même — « نفس الأساس », « نجمع الأسّة ». On prend donc l'une
      // ou l'autre, et l'on écarte ce qui n'est qu'ossature.
      difficulte: (() => {
        const CADRE = /المعطيات|النتيجة|نطبّق|نحسب|^[0-9]+\)$/;
        const notions = new Set();
        for (const e of (chaine.etapes || [])) {
          if (CADRE.test(e[0])) continue;
          notions.add(/القاعدة/.test(e[0]) ? String(e[1]) : String(e[0]));
        }
        const n = notions.size;
        return n <= 1 ? 'facile' : (n <= 3 ? 'moyen' : 'difficile');
      })(),
      steps: chaine.etapes.map(e => e[0] + ': ' + md(e[1], true)),
      hint: INDICES[type]
    };
  }

  // Entier aléatoire dans [min, max]
  const ent = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
  const choix = t => t[Math.floor(Math.random() * t.length)];

  const API = { evalNat, regroupement, chainePriorite, chaineCommun, chaineRegroupe,
                chaineFacteur, chaineSerie, chaineBlanc, iso, md, question, ent, choix };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Moteur = API;
})(typeof window !== 'undefined' ? window : globalThis);
