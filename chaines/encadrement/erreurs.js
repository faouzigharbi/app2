// Les pages « erreurs » — le miroir des chaînes de démonstration.
//
// Dans la chaîne, les étapes sont JUSTES et EN DÉSORDRE : l'élève reconstruit
// le raisonnement. Ici elles sont DANS L'ORDRE et l'une d'elles est FAUSSE :
// l'élève juge le raisonnement. C'est le geste du correcteur, et c'est celui
// qui manque le plus — on sait appliquer une règle bien avant de savoir
// repérer qu'elle a été mal appliquée.
//
// DEUX NIVEAUX :
//   * مستوى متوسّط  — une étape fausse ;
//   * مستوى متقدّم — deux étapes fausses.
//
// Chaque étape d'une chaîne est une relation vraie EN ELLE-MÊME, pas une ligne
// de calcul qui hériterait de la précédente. Deux fautes ne peuvent donc pas se
// masquer l'une l'autre, et le niveau avancé n'a pas besoin de précaution
// particulière — c'est la structure des chaînes qui l'offre.
//
// CE QU'ON NE PLANTE JAMAIS AU HASARD. Une faute n'a de valeur que si c'est
// celle qu'un élève commet. D'où un catalogue de FAMILLES nommées : le retour
// ne dit pas « faux », il dit « الترتيب لم ينقلب عند الضرب في عدد سالب ». La
// page n'enseigne pas une correction, elle enseigne une famille de fautes.
//
// Une famille peut exiger le GESTE qui la produit : renverser un encadrement
// n'est la faute de la leçon que là où l'on multiplie, divise ou inverse.
// Ailleurs ce ne serait qu'une étourderie de copie, et l'élève apprendrait à
// chercher des coquilles au lieu de chercher des fautes de raisonnement.
//
// ET CHAQUE FAUTE EST PROUVÉE. Toute étape plantée est repassée au juge du
// noyau — le MÊME que celui du validateur — et rejetée si elle se trouve
// vraie. Une page ne peut donc pas demander à l'élève de condamner une étape
// juste. Les leurres de la phase « corrige » subissent le même contrôle.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);
  const F = M ? require('./noyau.js') : racine.Reel;

  // -------------------------------------------------------------------------
  // Découper une expression en ses termes de PREMIER niveau : « a + b(c - d) »
  // donne « a » et « + b(c - d) ». Un balayage, pas une expression régulière —
  // les parenthèses s'imbriquent et les barres de valeur absolue aussi.
  // -------------------------------------------------------------------------
  function termes(s) {
    const out = [];
    let prof = 0, barres = 0, debut = 0;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === '(') prof++;
      else if (c === ')') prof--;
      else if (c === '|') barres ^= 1;
      else if ((c === '+' || c === '-') && prof === 0 && !barres && i > debut) {
        const avant = s[i - 1];
        if (avant === '(' || avant === '+' || avant === '-' || avant === '×'
            || avant === '*' || avant === '/' || avant === '^') continue;
        out.push(s.slice(debut, i));
        debut = i;
      }
    }
    out.push(s.slice(debut));
    return out.map(t => t.trim()).filter(t => t.length);
  }

  // Les morceaux d'une relation : « a ≤ b ≤ c » donne les trois membres et les
  // deux signes.
  function relation(s) {
    const m = String(s).split(/\s*([<>≤≥=])\s*/);
    if (m.length < 3) return null;
    const membres = [], ops = [];
    for (let i = 0; i < m.length; i++) (i % 2 ? ops : membres).push(m[i]);
    return { membres, ops };
  }

  const estMajal = s => /[[\]][^;]*;/.test(s) || /[∩∪]/.test(s);

  // Une faute doit rester CRÉDIBLE : ce qu'un élève écrit vraiment. On refuse
  // donc les écritures qu'aucune copie ne porte — un coefficient « 1x », une
  // fraction non réduite « 4/2 », un membre identique à son voisin.
  function credible(s) {
    if (/(^|[^\w])([a-zA-Z])\s+\2([^\w]|$)/.test(s)) return false;   // « x x »
    if (/(^|[^\w])1\s*[a-zA-Z(√]/.test(s)) return false;
    let m; const re = /(\d+)\/(\d+)/g;
    while ((m = re.exec(s))) {
      if (Number(m[2]) === 1) return false;                  // « 3/1 »
      if (F.pgcd(Number(m[1]), Number(m[2])) !== 1) return false;
    }
    const r = relation(s);
    if (r) {
      for (let i = 1; i < r.membres.length; i++) {
        if (r.membres[i].trim() === r.membres[i - 1].trim()) return false;
      }
    }
    return true;
  }

  // -------------------------------------------------------------------------
  // LE CATALOGUE. Chaque famille porte son nom — celui que l'élève lira — et
  // sait fabriquer sa faute à partir d'une étape juste, ou renoncer.
  // -------------------------------------------------------------------------
  const FAMILLES = [
    {
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
      nom: 'القوس مقلوب',
      quoi: 'حدّ مأخوذ كُتب مفتوحا، أو حدّ غير مأخوذ كُتب مغلقا',
      faire(math) {
        if (!/[[\]][^;]*;/.test(math)) return null;
        const pos = [];
        for (let i = 0; i < math.length; i++) {
          if (math[i] === '[' || math[i] === ']') pos.push(i);
        }
        if (!pos.length) return null;
        const i = pos[F.ent(0, pos.length - 1)];
        return math.slice(0, i) + (math[i] === '[' ? ']' : '[') + math.slice(i + 1);
      }
    },
    {
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
      nom: 'التقاطع مكان الاتّحاد',
      quoi: 'التقاطع يأخذ ما هو مشترك بين المجالين، و الاتّحاد يأخذ كل ما في أحدهما',
      faire(math) {
        if (!/[∩∪]/.test(math)) return null;
        return math.replace(/[∩∪]/g, c => (c === '∩' ? '∪' : '∩'));
      }
    },
    {
      nom: 'حدّ ضائع في المتطابقة',
      quoi: 'مربّع مجموع ثلاثة حدود لا حدّان: الحدّ الأوسط، ضعف الجداء، ينسى كثيرا',
      faire(math) {
        if (estMajal(math)) return null;
        const r = relation(math);
        if (!r || r.ops.some(o => o !== '=')) return null;
        const dernier = r.membres[r.membres.length - 1];
        const t = termes(dernier);
        if (t.length < 3) return null;
        const k = F.ent(1, t.length - 2);
        const reste = t.slice(0, k).concat(t.slice(k + 1));
        return r.membres.slice(0, -1).join(' = ') + ' = ' + reste.join(' ');
      }
    },
    {
      nom: 'إشارة مقلوبة في حدّ',
      quoi: 'حدّ نُقل أو نُشر دون تغيير إشارته؛ و -(a - b) تساوي -a + b',
      // Elle aussi tient à son geste. Une étape qui ne fait que RECOPIER un
      // encadrement ou poser une définition ne peut pas porter cette faute :
      // ce serait une coquille, et l'élève apprendrait à chasser les coquilles.
      geste: /ننقل|نطرح|نضيف|نرفع|ننشر|نفكّك|نعوّض|نجمع|نوحّد|نختصر|نبسّط/,
      faire(math) {
        if (estMajal(math)) return null;
        // Un signe ne se retourne par ERREUR que s'il y avait une soustraction
        // à mal manier, et sur une expression littérale. Sur « 1/3 + 3/4 »,
        // écrire « - » n'est pas une faute de raisonnement : c'est une faute
        // de copie, et l'élève apprendrait à relire au lieu de raisonner.
        if (!/-/.test(math) || !/[a-zA-Z]/.test(math)) return null;
        const r = relation(math);
        if (!r) return null;
        for (let essai = 0; essai < 8; essai++) {
          const k = F.ent(0, r.membres.length - 1);
          const t = termes(r.membres[k]);
          if (t.length < 2) continue;
          const j = F.ent(1, t.length - 1);
          const u = t[j];
          t[j] = u[0] === '-' ? '+ ' + u.slice(1).trim()
               : u[0] === '+' ? '- ' + u.slice(1).trim() : null;
          if (!t[j]) continue;
          const copie = r.membres.slice();
          copie[k] = t.join(' ');
          let out = copie[0];
          for (let i = 0; i < r.ops.length; i++) out += ' ' + r.ops[i] + ' ' + copie[i + 1];
          return out;
        }
        return null;
      }
    },
    {
      nom: 'عدد مغيّر في الحساب',
      generique: true,
      quoi: 'خطأ عدديّ بسيط: رقم بدل رقم، و كل ما يليه ينهار',
      faire(math) {
        const pos = [];
        const re = /\d+/g;
        let m;
        while ((m = re.exec(math))) {
          const avant = m.index ? math[m.index - 1] : ' ';
          const apres = math[m.index + m[0].length] || ' ';
          if (/[A-Za-z^√]/.test(avant)) continue;      // indice de nom, exposant, radicande
          pos.push([m.index, m[0], apres]);
        }
        if (!pos.length) return null;
        const [i, txt, apres] = pos[F.ent(0, pos.length - 1)];
        const v = Number(txt);
        const w = (v <= 1 || F.ent(0, 1)) ? v + 1 : v - 1;
        if (w === 1 && /[a-zA-Z(√]/.test(apres)) return null;
        if (w === 0) return null;
        return math.slice(0, i) + w + math.slice(i + txt.length);
      }
    }
  ];

  // -------------------------------------------------------------------------
  // Fabriquer une page d'erreurs à partir d'une question de chaîne.
  //
  //   fautes  — 1 au niveau moyen, 2 au niveau avancé
  //
  // On n'abîme que les étapes que le juge sait ÉVALUER : une étape rédigée en
  // arabe ne peut être ni prouvée fausse ni prouvée juste, et l'élève ne
  // pourrait pas la départager.
  // -------------------------------------------------------------------------
  function fabriquer(question, fautes, dejaVues) {
    dejaVues = dejaVues || new Set();
    const c = question.controle;
    const envs = F.environnements(c, F.ECHANTILLON);
    const noms = F.nomsDe(c);
    const juge = m => F.evaluerEtape(m, envs, noms);

    const rangs = [];
    question.etapes.forEach(([, math], i) => {
      if (juge(math) === 'vraie') rangs.push(i);
    });
    // Ce qui compte est le nombre d'étapes qui restent debout, pas le nombre
    // d'étapes calculables : une chaîne peut n'avoir qu'une ligne de calcul et
    // trois de raisonnement, et l'élève y juge très bien. Et le niveau est une
    // intention : à défaut de deux fautes, on en place une.
    fautes = Math.min(fautes, rangs.length, question.etapes.length - 2);
    if (fautes < 1) return null;

    // Pour un rang donné, les fautes que le catalogue sait fabriquer et que le
    // juge confirme fausses. Une famille déjà vue dans la page passe après les
    // autres : une page qui répète dix fois la même faute n'enseigne qu'une
    // faute. Et la famille générique passe après toutes les familles nommées.
    function candidats(i) {
      const vrai = question.etapes[i][1];
      const libelle = question.etapes[i][0];
      const out = [];
      FAMILLES.forEach((fam, rang) => {
        if (fam.geste && !fam.geste.test(libelle)) return;
        for (let essai = 0; essai < 8; essai++) {
          let faux;
          try { faux = fam.faire(vrai); } catch (e) { faux = null; }
          if (!faux || faux === vrai || !credible(faux)) continue;
          if (juge(faux) !== 'fausse') continue;
          out.push({ rang: i, faux, vrai, famille: fam.nom, quoi: fam.quoi,
                     generique: !!fam.generique,
                     priorite: rang + (dejaVues.has(fam.nom) ? 20 : 0)
                             + (fam.generique ? 200 : 0) });
          break;
        }
      });
      return out;
    }

    // ON CHOISIT LA FAUTE, PAS L'ÉTAPE.
    //
    // Le premier jet tirait une étape au hasard, puis prenait la meilleure
    // famille applicable SUR CETTE ÉTAPE. Une étape où seule la famille
    // générique mordait l'emportait donc sur une étape où une faute
    // conceptuelle était possible — et la page se remplissait de coquilles.
    // On énumère maintenant tous les couples (étape, famille) de la chaîne
    // entière, et l'on prend le meilleur, où qu'il soit.
    let tous = [];
    rangs.forEach(i => { tous = tous.concat(candidats(i)); });
    if (!tous.length) return null;

    const choisies = [];
    for (let n = 0; n < fautes; n++) {
      const pris1 = tous.filter(x => choisies.every(c => c.rang !== x.rang));
      if (!pris1.length) return null;
      // Une faute d'inattention ne se prend qu'à défaut d'une faute de
      // raisonnement, et jamais deux fois dans la même question.
      const dejaGenerique = choisies.some(c => c.generique);
      const utiles = pris1.filter(x => !x.generique
                                    && choisies.every(c => c.famille !== x.famille));
      const pool = utiles.length ? utiles
                 : (dejaGenerique ? pris1.filter(x => !x.generique) : pris1);
      if (!pool.length) return null;
      const min = Math.min.apply(null, pool.map(x => x.priorite));
      const pris = F.choix(pool.filter(x => x.priorite === min));
      dejaVues.add(pris.famille);
      choisies.push(pris);
    }
    choisies.sort((a, b) => a.rang - b.rang);

    // La phase « corrige » : la bonne réécriture, et deux leurres FAUX.
    //
    // Un leurre garde le PREMIER MEMBRE de l'étape quand celle-ci est une
    // égalité à deux membres — « donné = travail ». On ne l'exige PAS d'un
    // encadrement « -3 < x < -2 » : ses trois membres forment un seul énoncé,
    // aucun n'y est le donné, et tous ont le droit de bouger.
    function memeDonnee(leurre, vrai) {
      const a = relation(leurre), b = relation(vrai);
      if (!a || !b) return true;
      if (b.ops.length !== 1 || b.ops[0] !== '=') return true;
      return a.membres[0].trim() === b.membres[0].trim();
    }

    for (const f of choisies) {
      const opts = [f.vrai];
      for (let essai = 0; essai < 60 && opts.length < 3; essai++) {
        const fam = F.choix(FAMILLES);
        let leurre;
        try { leurre = fam.faire(f.vrai); } catch (e) { leurre = null; }
        if (!leurre || leurre === f.vrai || leurre === f.faux) continue;
        if (!memeDonnee(leurre, f.vrai)) continue;
        if (!credible(leurre) || opts.indexOf(leurre) >= 0) continue;
        if (juge(leurre) !== 'fausse') continue;
        opts.push(leurre);
      }
      f.choix = melanger(opts);
      f.bonne = f.choix.indexOf(f.vrai);
    }

    return {
      // La page emporte SON contrôle. Sans lui, le validateur re-tirerait la
      // question et jugerait les étapes d'une page dans l'environnement d'une
      // autre — invisible sur une fiche fidèle, fatal sur une fiche générative.
      controle: c,
      enonce: question.enonce,
      indice: question.indice,
      etapes: question.etapes.map(([label, math], i) => {
        const f = choisies.find(x => x.rang === i);
        return [label, f ? f.faux : math];
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

  // Une page entière : toutes les questions d'un exercice, au niveau demandé.
  // Une question qui ne se prête pas à deux fautes est rendue à une seule
  // plutôt que sautée — l'élève doit retrouver TOUTES les questions de
  // l'énoncé, c'est la règle de la méthode.
  // Une correction qui n'offre qu'UNE réécriture n'est pas un choix. On retire
  // donc tant qu'une faute n'a pas au moins un leurre à lui opposer, et l'on
  // se contente du dernier tirage si l'exercice n'en offre décidément pas.
  const complete = p => p && p.fautes.every(f => f.choix.length >= 2);

  function pageErreurs(n, fautes) {
    const vues = new Set();
    return F.tirer(n).map(q => {
      let dernier = null;
      for (let essai = 0; essai < 8; essai++) {
        const p = fabriquer(q, fautes, new Set(vues)) || fabriquer(q, 1, new Set(vues));
        if (!p) continue;
        dernier = p;
        if (complete(p)) break;
      }
      if (dernier) dernier.fautes.forEach(f => vues.add(f.famille));
      return dernier;
    }).filter(Boolean);
  }

  const API = { FAMILLES, termes, relation, credible, fabriquer, pageErreurs };
  if (M) module.exports = API; else racine.Erreurs = API;
})(typeof window !== 'undefined' ? window : globalThis);
