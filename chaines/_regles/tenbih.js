// LES « تنبيه » — les remarques qu'on fait en classe, et rien d'autre.
//
// « Notre objectif n'est pas de trop écrire, mais d'attirer l'attention de
// l'élève sur ces points. Une remarque comme "attention, il faut réduire au
// même dénominateur" ou "il faut simplifier" vaut beaucoup — et qu'est-ce
// qu'on fait en classe, sinon corriger ces erreurs ? »
//
// Ce ne sont donc pas des explications : ce sont des ÉCUEILS, nommés à
// l'endroit exact où l'élève tombe. Une phrase, jamais deux.
//
// ELLES NE SONT PAS RÉDIGÉES AU HASARD. Chacune a un DÉCLENCHEUR calculé sur
// la correction elle-même — l'étiquette d'une étape, la forme d'une écriture.
// Une remarque ne peut donc pas apparaître là où le geste n'a pas eu lieu, et
// le validateur du chapitre refait le test. C'est la même discipline que le
// reste : rien n'est écrit qui ne soit vérifiable.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);

  // Chaque remarque : sa clé, son déclencheur (étiquette, texte), sa phrase.
  // L'ordre compte : la première qui mord gagne, et l'on n'en met jamais deux
  // pour la même étape.
  const BANC = [
    { cle: 'denominateurs',
      quand: (lab, txt) => /نوحّد المقامات|المقام المشترك|نوحد المقامات/.test(lab + ' ' + txt),
      dit: 'لا يُجمع كسران قبل توحيد المقامَين، و المقام المشترك ليس دائما جداء المقامَين' },
    { cle: 'simplifier',
      quand: lab => /نختصر|الاختزال|نبسّط/.test(lab),
      dit: 'النتيجة تُترك دائما في أبسط صورة — كسرا غير قابل للاختزال' },
    // LE GESTE, PAS LA FORME. Le premier jet déclenchait sur « − ( » où qu'il
    // fût : 204 exercices sur 380 portaient la même phrase, et une remarque
    // qu'on lit partout n'est plus une remarque. Elle ne se pose désormais
    // qu'à l'étape où l'on OUVRE vraiment les parenthèses, et seulement si le
    // signe moins en précède une qui contient plusieurs termes.
    { cle: 'parenthese-moins',
      quand: (lab, txt) => /بدون أقواس|نرفع القوس|نزيل القوس|نفتح القوس/.test(lab)
        && /[-−]\s*\([^)]*[+\-−]/.test(txt),
      dit: 'علامة الطرح أمام قوس تنقلب على كلّ حدوده، لا على الأوّل فقط' },
    { cle: 'meme-base',
      quand: lab => /نفس الأساس/.test(lab),
      dit: 'نفس الأساس فنجمع الأسّة — و لا نضرب الأسّة في بعضها' },
    { cle: 'puissance-somme',
      quand: (lab, txt) => /\)\s*<sup>2|\)²/.test(txt),
      dit: '(a + b)² لا يساوي a² + b² — هناك حدّ وسط 2ab' },
    { cle: 'racine-somme',
      quand: (lab, txt) => /√/.test(txt) && /\+/.test(txt),
      dit: '√a + √b لا يساوي √(a + b)' },
    { cle: 'division-fraction',
      quand: (lab, txt) => /÷|القسمة/.test(lab + ' ' + txt),
      dit: 'القسمة على كسر هي الضّرب في مقلوبه' },
    { cle: 'produit-croix',
      quand: lab => /جداء الطرفين|في تقاطع/.test(lab),
      dit: 'الضّرب في تقاطع لا يصحّ إلّا في تناسب — أي بين كسرين متساويين' }
  ];

  // Les remarques d'une correction, posées CHACUNE APRÈS L'ÉTAPE qui la
  // déclenche : c'est là que la faute se commet, et donc là qu'on la prévient.
  // Deux au plus par exercice — au-delà, on n'attire plus l'attention, on
  // remplit la page.
  function poser(etapes, max) {
    const out = [];
    const vues = new Set();
    let poses = 0;
    for (const e of etapes) {
      out.push(e);
      if (poses >= (max || 2)) continue;
      const lab = String(e[0] || ''), txt = String(e[1] || '');
      for (const r of BANC) {
        if (vues.has(r.cle)) continue;
        let mord = false;
        try { mord = !!r.quand(lab, txt); } catch (x) { mord = false; }
        if (!mord) continue;
        vues.add(r.cle);
        out.push(['تنبيه', r.dit]);
        poses++;
        break;
      }
    }
    return out;
  }

  // Le validateur s'en sert pour REFAIRE le test : une remarque présente sans
  // son déclencheur est une remarque inventée.
  function declencheurs(etapes) {
    const out = new Set();
    for (const e of etapes) {
      const lab = String(e[0] || ''), txt = String(e[1] || '');
      for (const r of BANC) {
        let mord = false;
        try { mord = !!r.quand(lab, txt); } catch (x) { mord = false; }
        if (mord) out.add(r.dit);
      }
    }
    return out;
  }

  const API = { BANC, poser, declencheurs };
  if (M) module.exports = API; else racine.Tenbih = API;
})(typeof window !== 'undefined' ? window : globalThis);
