// LE CHOIX DE L'ITINÉRAIRE — pourquoi CETTE règle, et non celle-là.
//
// « À chaque fois, invite l'élève à bien choisir son itinéraire ; c'est le
// plus important. » Une correction qui applique la bonne règle sans dire
// pourquoi celle-là enseigne à recopier, pas à chercher.
//
// Le moteur peut le dire sans rien inventer. À l'instant où il choisit, il
// connaît TOUTES les règles qui pouvaient s'appliquer et ce que chacune
// aurait donné. Il nomme donc :
//
//   — celle qu'il prend, AVEC les données qu'elle utilise ;
//   — une qu'il écarte, avec CE QUI LUI MANQUE — un angle droit, deux
//     parallèles, deux milieux ; ou, si elle s'applique vraiment, avec le
//     résultat qu'elle donne et qui ne mène nulle part.
//
// CE N'EST PAS UNE FORMULE DE POLITESSE : c'est une affirmation, et le
// validateur du chapitre la refait. Dire « il n'y a pas d'angle droit » quand
// il y en a un est un mensonge pédagogique, et la fiche doit être refusée.
//
// Ce fichier ne connaît aucun chapitre : il reçoit son moteur, sa façon
// d'écrire un fait, et la table des ingrédients manquants.
(function (racine) {
  'use strict';
  const M = (typeof module !== 'undefined' && module.exports);

  // cfg = {
  //   R          le moteur (REGLES, chercher, tables, cleFait)
  //   ecrire     un fait → texte arabe
  //   nommerBut  un but → « حساب MN », « إثبات التوازي », …
  //   court      une règle → son nom court
  //   MANQUE     { cleDeRegle: (faits, ctx) → raison ou null }
  //   CANDIDATES [cles] les règles qu'un élève essaie d'abord
  //   sec        un fait → sa forme sérialisée
  // }
  function creer(cfg) {
    const { R, ecrire, nommerBut, court, MANQUE, CANDIDATES, sec } = cfg;

    return function itineraire(suite, but, acquis, ctx, avant) {
      const premier = suite[0];
      if (!premier || !premier.regle) return null;
      const dansLaChaine = new Set(suite.map(n => R.cleFait(n.fait)));
      const connus = new Set(acquis.map(R.cleFait));
      let table;
      try { table = R.tables(acquis); } catch (e) { return null; }

      // UNE RIVALE DOIT ÊTRE UNE AUTRE IDÉE, pas le même théorème sous un
      // autre nom : « pourquoi pas Thalès ? » quand on vient de choisir
      // Thalès n'est pas une question, c'est du bruit, et l'élève cesse de
      // lire.
      const nomChoisi = court(premier.regle);
      const rivales = [];
      for (const r of R.REGLES) {
        if (r.cle === premier.regle.cle || court(r) === nomChoisi) continue;
        let sort = [];
        try { sort = r.chercher(ctx, table); } catch (e) { sort = []; }
        for (const p of sort) {
          const k = R.cleFait(p.but);
          if (connus.has(k) || dansLaChaine.has(k)) continue;
          if (p.depuis.some(d => !connus.has(R.cleFait(d)))) continue;
          rivales.push({ regle: r, but: p.but });
          break;
        }
      }

      const dep = premier.depuis.map(f => ecrire(f)).join('  و  ');
      const t = ['المطلوب : ' + nommerBut(but || premier.fait) + '.',
                 'نختار ' + nomChoisi + ' لأنّ معطياتها متوفّرة : ' + dep + '.'];

      // Une règle célèbre qui NE PEUT PAS s'appliquer, avec sa raison : c'est
      // l'explication la plus utile, et elle passe devant.
      let ecartee = null;
      for (const cle of (CANDIDATES || [])) {
        if (cle === premier.regle.cle || !MANQUE[cle]) continue;
        const r = R.REGLES.find(x => x.cle === cle);
        if (!r || court(r) === nomChoisi) continue;
        const raison = MANQUE[cle](acquis, ctx, table);
        if (raison) { ecartee = { regle: r, raison }; break; }
      }
      if (ecartee) {
        t.push('و لماذا لا ' + court(ecartee.regle) + ' ؟ ' + ecartee.raison + '.');
      } else if (rivales.length) {
        // La fausse piste QUI EST VRAIE : le cas le plus instructif.
        const v = rivales[0];
        t.push('و لماذا لا ' + court(v.regle) + ' ؟ تنطبق فعلا، لكنّها تعطي '
               + nommerBut(v.but) + ' : نتيجة صحيحة لا تظهر فيها المطلوب.');
      } else {
        t.push('لا تنطبق قاعدة أخرى على هذه المعطيات : الطريق واحد.');
      }

      return {
        texte: t.join(' '),
        controle: {
          but: sec(but || premier.fait), choisie: premier.regle.cle,
          avant: avant || 0,
          ecartee: ecartee ? ecartee.regle.cle : null,
          rivale: (!ecartee && rivales.length)
            ? { regle: rivales[0].regle.cle, fait: sec(rivales[0].but) } : null
        }
      };
    };
  }

  const API = { creer };
  if (M) module.exports = API; else racine.Itineraire = API;
})(typeof window !== 'undefined' ? window : globalThis);
