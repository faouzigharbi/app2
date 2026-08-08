/* Devoirati — noyau : registre des générateurs.
   Chaque module d'exercice s'enregistre ici. Ajouter un chapitre au pilier
   revient donc à déposer un fichier dans assets/js/generators/ et à
   l'ajouter à la liste des <script> — rien d'autre à modifier. */
(function (DV) {
  'use strict';

  var list = [];
  var byId = {};

  /* Contrat d'un générateur :
     {
       id        : identifiant stable, utilisé dans les URL
       title     : titre en arabe
       chapter   : 'fractions' | 'puissances' | ...
       summary   : une phrase de description
       levels    : [{id, label}]  (au moins un)
       make(rng, level) -> {
         prompt      : HTML de l'énoncé
         instruction : consigne courte
         answer      : {kind:'frac'|'int'|'bool', frac?, value?}
         answerHTML  : HTML de la réponse
         steps       : [HTML, ...]  étapes de correction
         hint        : HTML (facultatif)
       }
     } */
  function register(gen) {
    if (!gen || !gen.id) throw new Error('registry : générateur sans id');
    if (byId[gen.id]) throw new Error('registry : id en double « ' + gen.id + ' »');
    if (typeof gen.make !== 'function') throw new Error('registry : « ' + gen.id + ' » sans make()');
    if (!gen.levels || !gen.levels.length) gen.levels = [{ id: 'normal', label: 'عادي' }];
    byId[gen.id] = gen;
    list.push(gen);
    return gen;
  }

  function all() { return list.slice(); }
  function get(id) { return byId[id] || null; }

  function chapters() {
    var order = [];
    var map = {};
    list.forEach(function (g) {
      if (!map[g.chapter]) { map[g.chapter] = []; order.push(g.chapter); }
      map[g.chapter].push(g);
    });
    return order.map(function (c) {
      return { id: c, label: DV.CHAPTER_LABELS[c] || c, generators: map[c] };
    });
  }

  /* Fabrique un exercice en se protégeant des tirages impossibles :
     si un générateur lève une exception (division par zéro sur un tirage
     malheureux, par exemple), on retire une nouvelle graine plutôt que
     de casser la page entière. */
  function makeSafe(gen, rng, level) {
    for (var i = 0; i < 25; i++) {
      try {
        var ex = gen.make(rng, level);
        if (ex && ex.prompt && ex.answer) return ex;
      } catch (e) {
        if (i === 24) throw e;
      }
    }
    throw new Error('registry : « ' + gen.id + ' » n\'a produit aucun exercice valide');
  }

  DV.CHAPTER_LABELS = {
    fractions: 'الكسور',
    puissances: 'القوى'
  };

  DV.registry = {
    register: register,
    all: all,
    get: get,
    chapters: chapters,
    makeSafe: makeSafe
  };
})(window.DV = window.DV || {});
