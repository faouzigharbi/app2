// Moteur commun aux chaînes de démonstration du chapitre « الأعداد الصحيحة الطبيعية ».
//
// Invariant respecté par toutes les familles : chaque mérite intermédiaire d'une
// chaîne, s'il est calculable, vaut le résultat final. C'est ce que contrôle
// verifier.js — une étape fausse casse l'égalité et se voit immédiatement.

// ---------------------------------------------------------------------------
// Évaluation en entiers naturels
// ---------------------------------------------------------------------------
const toJs = s => String(s).replace(/×/g, '*').replace(/−/g, '-')
  .replace(/\[/g, '(').replace(/\]/g, ')').replace(/\s*:\s*/g, '/');

// Une parenthèse peut valoir un nombre négatif (l'astuce évite justement de la
// calculer, mais le contrôle « le calcul direct donne-t-il le même résultat ? »
// y passe). On replie donc les signes doubles avant de découper.
function normalise(e) {
  let s = String(e).replace(/\s+/g, ' '), avant;
  do {
    avant = s;
    s = s.replace(/-\s*-/g, '+').replace(/\+\s*-/g, '-')
         .replace(/-\s*\+/g, '-').replace(/\+\s*\+/g, '+');
  } while (s !== avant);
  return s.trim();
}

// Évalue sans parenthèses, en signalant tout écart aux entiers naturels.
function plat(e, bad) {
  const t = normalise(e).match(/\d+|[+\-*/]/g);
  if (!t) throw new Error('expression vide: ' + e);
  const p = [];
  if (t[0] === '-') { p.push(String(-Number(t[1]))); t.splice(0, 2, p[0]); }
  p.length = 0;
  p.push(t[0]);
  for (let i = 1; i < t.length; i += 2) {
    const op = t[i], b = Number(t[i + 1]);
    if (op === '*' || op === '/') {
      const a = Number(p.pop());
      const r = op === '*' ? a * b : a / b;
      if (op === '/' && !Number.isInteger(r)) bad.push(`قسمة غير تامّة: ${a} : ${b}`);
      p.push(String(r));
    } else p.push(op, String(b));
  }
  let acc = Number(p[0]);
  for (let i = 1; i < p.length; i += 2) {
    acc = p[i] === '+' ? acc + Number(p[i + 1]) : acc - Number(p[i + 1]);
    if (acc < 0) bad.push(`نتيجة وسطى سالبة: ${acc}`);
  }
  return acc;
}

function evalNat(expr, bad = []) {
  let e = toJs(expr).trim(), g = 0;
  while (/\(/.test(e)) {
    if (++g > 60) throw new Error('boucle: ' + expr);
    e = e.replace(/\(([^()]*)\)/, (_, i) => String(plat(i, bad)));
  }
  return plat(e, bad);
}

// ---------------------------------------------------------------------------
// Chaîne automatique pour la priorité des opérations
//
// À chaque étape on réduit d'un coup TOUTES les opérations de même priorité au
// même niveau de parenthèses. Deux produits indépendants tombent donc dans la
// même étape : sans cela, l'ordre inverse — tout aussi correct — serait compté
// faux. Le résultat est une chaîne dont l'ordre attendu est unique.
// ---------------------------------------------------------------------------

const OUVRANTS = { '(': ')', '[': ']' };

// Groupes les plus profonds (ils ne contiennent donc aucun autre groupe).
function groupesProfonds(e) {
  const pile = [], tous = [];
  for (let i = 0; i < e.length; i++) {
    if (OUVRANTS[e[i]]) pile.push({ i, c: e[i], prof: pile.length });
    else if (e[i] === ')' || e[i] === ']') {
      const o = pile.pop();
      tous.push({ debut: o.i, fin: i, prof: o.prof, ouvrant: o.c,
                  contenu: e.slice(o.i + 1, i) });
    }
  }
  if (!tous.length) return [];
  const max = Math.max(...tous.map(g => g.prof));
  return tous.filter(g => g.prof === max).sort((a, b) => a.debut - b.debut);
}

const aMul = s => /[×:]/.test(s);
const aAdd = s => /(\d|\))\s*[+\-]/.test(s);

// Réduit les × et : d'une expression sans parenthèses, en une seule passe.
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

function chainePriorite(expr) {
  const etapes = [];
  let e = expr.trim(), garde = 0;

  while (true) {
    if (++garde > 40) throw new Error('boucle: ' + expr);
    const profonds = groupesProfonds(e);

    if (profonds.length) {
      // Un groupe qui mélange les priorités : on n'y fait d'abord que les × et :
      const mixtes = profonds.filter(g => aMul(g.contenu) && aAdd(g.contenu));
      let suivant = '', pos = 0, parties = [];
      const cibles = mixtes.length ? mixtes : profonds;
      for (const g of cibles) {
        parties.push(e.slice(pos, g.debut));
        parties.push(mixtes.length
          ? g.ouvrant + reduireMul(g.contenu) + OUVRANTS[g.ouvrant]
          : String(evalNat(g.contenu)));
        pos = g.fin + 1;
      }
      parties.push(e.slice(pos));
      suivant = parties.join('').replace(/\s+/g, ' ').trim();

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
      // Si tout se résout en un seul nombre, l'étape ferait double emploi
      // avec « النتيجة ».
      if (/^\d+$/.test(suivant.trim())) break;
      etapes.push([/:/.test(e) ? 'ننجز الضرب والقسمة' : 'ننجز الضرب', suivant]);
      e = suivant;
      continue;
    }

    // Plus que des + et des − : de gauche à droite, une opération par étape.
    const t = e.match(/\d+|[+\-]/g);
    if (t.length <= 1) break;
    if (t.length === 3) break;                      // dernière opération
    const v = t[1] === '+' ? Number(t[0]) + Number(t[2]) : Number(t[0]) - Number(t[2]);
    const suivant = [String(v), ...t.slice(3)].join(' ');
    etapes.push(['من اليسار إلى اليمين', suivant]);
    e = suivant;
  }

  const res = evalNat(expr);
  etapes.push(['النتيجة', `= ${res}`]);

  const regle = /[([]/.test(expr) ? 'الأقواس ← الضرب والقسمة ← الجمع والطرح'
    : aMul(expr) ? 'الضرب والقسمة قبل الجمع والطرح'
    : 'من اليسار إلى اليمين';
  return { etapes: [['نحدّد الأولوية', regle], ...etapes], res };
}

// ---------------------------------------------------------------------------
// Familles « أحسب بأيسر طريقة »
// ---------------------------------------------------------------------------

// Terme commun aux deux parenthèses : (a ⊕ c) ⊖ (b ⊕ c)
function chaineCommun({ expr, commun, reduit, regle }) {
  return {
    etapes: [
      ['نلاحظ', `الحد المشترك: ${commun}`],
      ['القاعدة', regle],
      ['نطبّق القاعدة', reduit],
      ['النتيجة', `= ${evalNat(reduit)}`]
    ],
    res: evalNat(reduit)
  };
}

// Regroupement libre : on donne la forme regroupée, le reste se calcule.
function chaineRegroupe({ expr, regroupe, remarque, etiquette }) {
  const groupes = regroupe.match(/\([^()]*\)/g);
  const apres = groupes
    ? regroupe.replace(/\([^()]*\)/g, m => String(evalNat(m)))
    : null;
  const et = [['نلاحظ', remarque], [etiquette || 'نجمّع الحدود المتكاملة', regroupe]];
  if (apres && apres !== regroupe) et.push(['ننجز الأقواس', apres]);
  const res = evalNat(regroupe);
  et.push(['النتيجة', `= ${res}`]);
  return { etapes: et, res };
}

// Somme d'une suite régulière : on compte les paires de même total.
function chaineSerie({ paire, total, paires, reste, res }) {
  const et = [
    ['نلاحظ', 'نجمّع الطرف الأول مع الطرف الأخير'],
    ['كل زوج له نفس المجموع', paire],
    ['عدد الأزواج', `${paires} × ${total} = ${paires * total}`]
  ];
  if (reste) et.push(['نضيف الحد الأوسط', `${paires * total} + ${reste}`]);
  et.push(['النتيجة', `= ${res}`]);
  return { etapes: et, res };
}

// Recherche d'un terme manquant.
function chaineBlanc({ enonce, etapes, res }) {
  return {
    etapes: [
      ['نحدّد المطلوب', enonce],
      ...etapes.map(e => ['نحسب', e]),
      ['النتيجة', `= ${res}`]
    ],
    res
  };
}

// Facteur commun : a×b ± a×c = a×(b ± c)
function chaineFacteur({ expr, facteur, factorise }) {
  const apres = factorise.replace(/\([^()]*\)/g, m => String(evalNat(m)));
  const res = evalNat(factorise);
  return {
    etapes: [
      ['نلاحظ', `العامل المشترك: ${facteur}`],
      ['ننشر العامل المشترك', factorise],
      ['ننجز القوس', apres],
      ['النتيجة', `= ${res}`]
    ],
    res
  };
}

module.exports = { evalNat, chainePriorite, chaineCommun, chaineRegroupe,
                   chaineSerie, chaineBlanc, chaineFacteur };
