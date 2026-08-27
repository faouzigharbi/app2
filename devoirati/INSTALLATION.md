# Devoirati — دفتري : historique, favoris et synchronisation

Trois choses, dans l'ordre où l'élève les rencontre :

1. **L'historique** — il retrouve les exercices déjà ouverts : récents,
   erreurs, difficiles, réussis.
2. **Les favoris** — un cœur sur chaque exercice, et la liste « محفوظة ».
3. **La synchronisation** — un code à 8 caractères, créé tout seul, qui lui
   permet de retrouver son dfatr sur son téléphone *et* son ordinateur.

Interface entièrement en arabe. Ni compte, ni mot de passe, ni nom, ni
e-mail : le serveur ne connaît qu'un code aléatoire et une liste de chemins
d'exercices.

---

## Fichiers

| Fichier | Où | Rôle |
|---|---|---|
| `devoirati-histo.js` | racine du site | historique, favoris, widget, synchro |
| `historique.html` | racine du site | la page « دفتري » |
| `manifest.json` | racine du site | rend le site installable sur l'écran d'accueil |
| `api/sync.php` | `public_html/api/` | la boîte aux lettres des carnets |
| `api/carnets.sql` | à exécuter une fois | la table (une seule) |
| `api/config.exemple.php` | à copier en `config.php` | identifiants MySQL |
| `injection.php`, `.htaccess.exemple`, `.user.ini.exemple` | *voir plus bas* | seulement pour les pages sans `utils.js` |
| `test-exercice.html` | test local | page de vérification |

---

## Installation

### 1. Brancher le script — le plus simple

`utils.js` étant déjà chargé par ~95 % des pages, il suffit d'y ajouter une
ligne :

```js
document.write('<script src="/devoirati-histo.js" defer><\/script>');
```

ou, plus proprement, de charger `devoirati-histo.js` directement dans le
`<head>` du gabarit, à côté de `utils.js`.

**Les 5 % de pages sans `utils.js` sont le vrai piège :** elles ne sont
jamais enregistrées, sans rien signaler. L'élève y travaille et ne les
retrouve pas dans son dfatr, sans comprendre pourquoi. Deux façons de
boucher le trou :

```bash
# repérer les pages concernées
grep -rL "utils.js" --include="*.html" .

# les compléter en une passe (après sauvegarde)
grep -rLZ "devoirati-histo.js" --include="*.html" . \
  | xargs -0 sed -i 's#</body>#<script src="/devoirati-histo.js" defer></script>\n</body>#I'
```

À relancer après chaque lot de nouvelles pages. Si tu préfères ne jamais y
penser, `injection.php` + `.htaccess` + `.user.ini` font poser la balise par
PHP sur toutes les pages d'un dossier, y compris futures (voir les
commentaires dans ces fichiers).

### 2. Le bouton dans la bannière

Dans la bannière commune, deux liens suffisent :

```html
<a href="/historique.html">📚 دفتري</a>
```

Le cœur, lui, est déjà là : le script dessine son propre bouton flottant.
Si tu préfères l'intégrer à la bannière, appelle `Devoirati.favori()`.

### 3. La base pour la synchronisation

1. cPanel → **Bases de données MySQL** : créer une base et un utilisateur.
2. cPanel → **phpMyAdmin** : exécuter `api/carnets.sql`.
3. Copier `api/config.exemple.php` en `api/config.php` et le remplir.
   Ce fichier ne doit **jamais** être commité (un `.gitignore` est fourni).
4. Déposer `api/sync.php`.

Vérification : `https://ton-site/api/sync.php?code=ABCD-EFGH` doit répondre
`{"carnet":null}`. Si tu obtiens une erreur 500, le problème est dans
`config.php` neuf fois sur dix.

### 4. Les icônes (recommandé)

Ajouter `icone-192.png` et `icone-512.png` à la racine, pour que le site
s'installe proprement sur l'écran d'accueil.

**Pourquoi c'est important sur iPhone :** Safari efface le stockage local
d'un site après 7 jours sans visite. Un site installé sur l'écran d'accueil
échappe à cette purge. Avec la synchronisation, le carnet est de toute façon
récupérable — mais autant éviter le trajet.

---

## Comment la synchronisation fonctionne

Il n'y a **aucun bouton « Synchroniser »**, volontairement : un élève ne
cliquerait pas dessus, et surtout, s'il oubliait de le faire sur le PC, le
téléphone trouverait une boîte vide.

- **Au chargement d'une page** : le navigateur récupère le carnet du serveur,
  au plus une fois par heure.
- **En quittant la page** : il le redépose, par `sendBeacon` — ça part même
  quand l'onglet se ferme, sans rien ralentir.

Les deux appareils n'ont jamais besoin d'être allumés en même temps. Le PC
dépose mardi soir, le téléphone récupère mercredi midi.

**Le serveur fusionne, il n'écrase pas.** C'est la pièce essentielle :
l'envoi part sans aller-retour possible côté navigateur, donc un PC dont
l'onglet est resté ouvert toute la soirée effacerait, en le fermant, ce que
le téléphone a fait entre-temps.

La fusion n'utilise que des unions et des maximums, **sauf** pour le favori
et l'étiquette, que l'élève peut *annuler* : ceux-là portent leur propre date
et c'est la modification la plus récente qui gagne. Sans ça, un favori retiré
sur le téléphone reviendrait à la synchro suivante depuis le PC.
Conséquence utile : l'ordre d'arrivée des synchronisations n'a aucune
importance. Un appareil qui se réveille avec trois jours de retard complète
au lieu d'écraser.

---

## Pour les pages futures

Les pages qui calculent elles-mêmes un score peuvent le déclarer :

```js
Devoirati.resultat(8, 10);
```

Sinon le script repère tout seul les éléments `#score` et `#total`, déjà
présents dans une partie des pages.

---

## Deux points de vigilance

**Les chemins de fichiers sont la clé du carnet.** Renommer un exercice
casse l'historique de tous les élèves qui l'avaient fait, et rien ne peut le
réparer à distance. Figer l'arborescence avant de déployer largement.

**Ne jamais ajouter de champ « prénom » à côté du code.** Tant qu'il n'y a
qu'un code aléatoire et des chemins d'exercices, il n'y a pas de donnée
personnelle et pas de dossier RGPD. Le jour où un nom est saisi, tout change.

---

## Notes de typographie arabe

Trois règles appliquées dans `historique.html`, à conserver si tu retouches
le style :

1. **Aucun `letter-spacing`.** L'arabe est cursif : espacer les lettres casse
   les liaisons entre elles et rend le mot illisible.
2. **Ni italique ni majuscules** — ça n'existe pas en arabe. Pour insister :
   le gras et la couleur.
3. **Corps plus grand (~+12 %) et interlignage 1,8–1,9**, parce que les points
   et les signes débordent au-dessus et en dessous de la ligne.

Et le piège technique : en `dir="rtl"`, l'algorithme bidirectionnel retourne
les formules. `3x + 5 = 20`, les scores `8/10`, les chemins de fichiers et le
code de synchronisation sont donc des îlots `dir="ltr"` (classe `.ltr`).
Les chiffres restent latins, comme en maths au Maghreb.

Police : **IBM Plex Sans Arabic** — la plus lisible à l'écran, et elle
s'accorde avec son pendant latin quand les deux se croisent.
