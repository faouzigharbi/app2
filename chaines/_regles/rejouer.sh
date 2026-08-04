#!/bin/sh
# REJOUER TOUT LE PORTAGE — la promesse tenue de la bibliothèque.
#
#   sh _regles/rejouer.sh          rejoue tout
#   sh _regles/rejouer.sh sommeq8  rejoue une fiche
#
# Une règle corrigée dans `_regles/catalogue.js` ne vaut que si elle se rejoue
# PARTOUT. Encore faut-il savoir avec quels arguments chaque fiche a été
# portée : ce fichier les garde. Sans lui, la source unique des règles était
# une intention, pas un fait — on ne pouvait pas rejouer ce qu'on ne savait
# plus reconstituer.
#
# Chaque ligne dit : le dossier, le nom global de son noyau dans le navigateur,
# le badge de ses pages, les modules qu'elles chargent, et la liste des règles
# du programme que ce chapitre met en jeu.
#
# expr7 et encadrement n'y sont PAS : leurs familles ont été écrites à la main
# et ne vivent pas encore dans le catalogue. Leur porter les corrections du
# porteur se fait donc à la main, et c'est dit dans METHODE.md.
set -e
cd "$(dirname "$0")/.."
SEUL="$1"

porte() {
  dossier="$1"; global="$2"; badge="$3"; modules="$4"; regles="$5"; extra="$6"
  [ -n "$SEUL" ] && [ "$SEUL" != "$dossier" ] && return 0
  echo "── $dossier"
  node _regles/porter.js "$dossier" "$global" "$regles" $extra
  node _regles/porter-pages.js "$dossier" "$global" "$badge" $extra $modules
  ( cd "$dossier" && node _build_erreurs.js >/dev/null )
}

COMMUN8='termes-non-semblables,transposition-sans-signe,developpement-incomplet,distribution-partielle,parenthese-negative-mal-levee'
COMMUN9='valeur-absolue-non-levee,racine-distribuee,carre-parfait-mal-sorti,conjugue-au-numerateur-seul,facteur-non-divise,developpement-incomplet,termes-non-semblables,moins-devant-negatif,transposition-sans-signe,distribution-partielle,parenthese-negative-mal-levee'

porte sommeq8   Somme  '8 أساسي'          'formes.js questions.js' \
  "numerateur-oublie,somme-des-numerateurs,parenthese-negative-mal-levee,termes-non-semblables,transposition-sans-signe,developpement-incomplet,distribution-partielle,moins-devant-negatif"
porte addz8     AddZ   '8 أساسي'          'formes.js questions.js equations.js' \
  "moins-devant-negatif,$COMMUN8,facteur-non-divise"
porte produitq8 Produit '8 أساسي'         'produits.js' \
  "produit-croise,simplification-unilaterale,signe-du-produit,denominateur-non-multiplie,somme-des-numerateurs,termes-non-semblables,transposition-sans-signe,parenthese-negative-mal-levee"
porte factq8    Fact   '8 أساسي'          'fact.js' \
  "facteur-non-divise,distribution-partielle,developpement-incomplet,termes-non-semblables,signe-du-produit,transposition-sans-signe,parenthese-negative-mal-levee"
porte reel9     Reel   '9 أساسي'          'algebre.js exercices.js' \
  "termes-non-semblables,parenthese-negative-mal-levee,moins-devant-negatif,transposition-sans-signe,valeur-absolue-non-levee,developpement-incomplet"
porte arith9    Arith  '9 أساسي'          'criteres.js puissances.js' \
  "exposant-additionne,facteur-non-divise,developpement-incomplet,termes-non-semblables,transposition-sans-signe,distribution-partielle"
porte gradue8   Gradue '8 أساسي'          'droite.js outils.js' \
  "moins-devant-negatif,distance-sans-valeur-absolue,valeur-absolue-non-levee,transposition-sans-signe,termes-non-semblables"
porte reels     Reel   'تمارين شاملة'      'reels.js serie3.js serie4.js'  "$COMMUN9"
porte serie1    Reel   '9 أساسي'          'devoir.js'                     "$COMMUN9"
porte serie2    Reel   'سلسلة 2'           'serie2.js'                     "$COMMUN9"
porte serie3    Reel   'الضرب و القسمة في ℝ' 'produit.js produit2.js'      "$COMMUN9"
porte revision2 Reel   'مراجعة'            'revision.js'                   "$COMMUN9,ordre-non-renverse"
porte radic9    Radic  'العمليات في ℝ'     'racines.js exercices.js' \
  "carre-parfait-mal-sorti,carre-parfait-non-extrait,facteur-non-carre-sorti,racine-confondue-avec-la-moitie,produit-de-racines-devenu-somme,radicandes-additionnes-au-produit,racine-du-produit-non-simplifiee,carre-de-la-racine-non-simplifie,carre-confondu-avec-le-double,radicande-additionne,terme-rationnel-joint-au-radical,facteur-radical-non-divise,facteur-radical-sans-racine,racine-au-numerateur-seul,double-produit-oublie,conjugue-mal-developpe,conjugue-signe-du-carre,valeur-absolue-non-levee,racine-distribuee"

porte rationnels8 Frac '8 أساسي — ترتيب الأعداد الناطقة' '' \
  "ordre-des-negatifs,signe-et-zero,numerateurs-compares-sans-meme-denominateur,denominateur-unifie-numerateur-inchange,soustraction-partielle-du-parenthese,numerateur-oublie,somme-des-numerateurs,moins-devant-negatif,termes-non-semblables,transposition-sans-signe,simplification-unilaterale" \
  '--noyau=frac.js'

# ── Les six fiches d'arithmétique ───────────────────────────────────────────
#
# Elles n'appellent pas leur noyau « noyau.js », et leur validateur ne l'appelle
# pas « F » : d'où --noyau et --F. Leur juge ne s'extrait pas d'un validateur,
# il s'engendre — juge-nat.js pour les cinq qui écrivent des égalités, un juge
# écrit à la main pour naturels7, dont les étapes sont des expressions.
#
# premiers7 et naturels7 ont en plus un `pont.js`, qui traduit leur vocabulaire
# — PREUVES au lieu de PROBLEMES, étapes déjà rendues en HTML — vers celui du
# porteur. Leur bloc ERREURS a donc été branché À LA MAIN sur ce pont : s'il
# fallait le réinjecter, il faudrait y remplacer G.PROBLEMES par P.PROBLEMES.
ARITH='puissance-confondue-avec-le-produit,priorite-non-respectee,somme-au-lieu-du-produit,division-devenue-multiplication,exposant-soustrait-au-lieu-de-divise'
CALCUL='priorite-dans-la-reduction,regroupement-mal-signe,facteurs-regroupes-en-somme,facteur-non-distribue,regle-du-terme-commun-mal-signee,terme-manquant-additionne'

jugeNat() { [ -z "$SEUL" ] || [ "$SEUL" = "$1" ] && node _regles/juge-nat.js "$1" Moteur --moteur=moteur.js >/dev/null; }

jugeNat diviseurs7
porte diviseurs7   Arith '7 أساسي — القواسم'          'moteur.js outils.js' "$ARITH" '--noyau=arith.js --F=A'
jugeNat pgcd7
porte pgcd7        Arith '7 أساسي — ق.م.أ و م.م.أ'    'moteur.js'           "$ARITH" '--noyau=arith.js --F=A'
jugeNat divisibilite8
porte divisibilite8 Arith '8 أساسي — القابلية للقسمة' 'moteur.js outils.js' "$ARITH" '--noyau=arith.js --F=A'
jugeNat premiers7
porte premiers7    Pont  '7 أساسي — الأعداد الأوّلية' 'moteur.js generateurs.js' "$ARITH,facteur-non-divise" '--noyau=pont.js --F=G'
# naturels7 garde son juge écrit à la main : ne pas le régénérer.
porte naturels7    Pont  '7 أساسي — الأعداد الطبيعية' 'moteur.js generateurs.js' "$CALCUL" '--noyau=pont.js --F=P'

echo
echo "Portage rejoué. Reste à valider :  sh _regles/valider.sh"
