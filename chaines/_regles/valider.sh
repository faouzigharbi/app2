#!/bin/sh
# VALIDER TOUTES LES FICHES — les chaînes ET les pages « أين الخطأ؟ ».
#
#   sh _regles/valider.sh [tours]
#
# Rien ne part sans son validateur au vert : c'est la première des sept règles
# du contrat. Ce script les passe toutes et n'affiche qu'une ligne par fiche,
# pour qu'un échec se voie.
cd "$(dirname "$0")/.."
TOURS="${1:-20}"
ROUGE=0

for d in expr7 encadrement sommeq8 addz8 produitq8 factq8 reel9 arith9 \
         gradue8 reels serie1 serie2 serie3 revision2 radic9; do
  [ -f "$d/erreurs.js" ] || continue
  c=$( cd "$d" && node verifier.js "$TOURS" 2>&1 | grep -c 'échec\|ÉCHECS\|✗' )
  e=$( cd "$d" && ERREURS=1 node verifier.js "$TOURS" 2>&1 | grep -c 'خلل\|فشل' )
  p=$( ls "$d"/err[0-9]*.html 2>/dev/null | wc -l | tr -d ' ' )
  printf '%-13s chaînes:%s erreur(s)  erreurs:%s erreur(s)  pages:%s\n' "$d" "$c" "$e" "$p"
  [ "$c" != 0 ] && ROUGE=1
  [ "$e" != 0 ] && ROUGE=1
done

echo
[ "$ROUGE" = 0 ] && echo 'Tout est vert.' || echo 'AU MOINS UNE FICHE EST ROUGE.'
exit "$ROUGE"
