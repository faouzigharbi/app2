# Devoirati — Historique & Favoris

Deux fonctions, entierement cote appareil de l'eleve :

- **Historique** — retrouver les exercices deja ouverts, tries par recents,
  erreurs, difficiles, reussis.
- **Favoris** — un bouton coeur sur chaque exercice, et la liste
  « mes exercices enregistres ».

Aucune base de donnees, aucun compte, aucun mot de passe, aucune donnee
envoyee a un serveur. Les 50 000 pages HTML existantes ne sont pas modifiees.

---

## Fichiers

| Fichier | Ou le mettre | Role |
|---|---|---|
| `devoirati-histo.js` | racine du site (`public_html/`) | enregistre les visites + bouton flottant |
| `historique.html` | racine du site | la page « Mon historique » |
| `manifest.json` | racine du site | rend le site installable sur l'ecran d'accueil |
| `injection.php` | racine du site | ajoute la balise `<script>` a chaque page |
| `.user.ini.exemple` | a renommer `.user.ini`, racine | active `injection.php` |
| `.htaccess.exemple` | a renommer `.htaccess`, **dossiers d'exercices** | fait passer les `.html` par PHP |
| `test-exercice.html` | n'importe ou (test local) | page de verification |

---

## Installation sur o2switch

### 1. Tester d'abord en local (5 minutes, sans rien casser)

Ouvrir `test-exercice.html` dans un navigateur, cliquer sur quelques reponses,
puis sur le coeur en bas a droite, puis sur « Mon historique ». Si tout
fonctionne hors ligne, cela fonctionnera sur le serveur.

### 2. Deposer les fichiers

Envoyer `devoirati-histo.js`, `historique.html`, `manifest.json` et
`injection.php` a la racine du site (`public_html/`).

A ce stade, **rien n'a change pour les visiteurs** : les fichiers sont la,
mais aucune page ne les appelle encore.

### 3. Verifier la version de PHP

Dans cPanel > **MultiPHP Manager**, relever la version active du domaine
(8.1, 8.2, 8.3...) et adapter la ligne `AddHandler` du `.htaccess`.

### 4. Activer sur UN SEUL dossier d'exercices

- Copier `.user.ini.exemple` en `.user.ini` a la racine, en corrigeant le
  chemin absolu (visible dans le Gestionnaire de fichiers cPanel).
- Copier `.htaccess.exemple` en `.htaccess` **dans un seul dossier
  d'exercices**, pas a la racine.

Attendre ~5 minutes (o2switch ne relit le `.user.ini` que periodiquement),
puis ouvrir une page de ce dossier : le bouton flottant doit apparaitre.

### 5. Generaliser

Une fois le dossier de test valide, copier le meme `.htaccess` dans les
autres dossiers d'exercices.

> **En cas d'erreur 500** : supprimer le `.htaccess` ajoute, la page
> redevient normale immediatement. Le nom du handler PHP est la cause la
> plus frequente — le corriger et reessayer.

### 6. Icones (facultatif mais recommande)

Ajouter `icone-192.png` et `icone-512.png` a la racine. Sans elles le site
reste installable, mais avec une icone par defaut.

**Pourquoi c'est important sur iPhone :** Safari efface le stockage local
d'un site apres 7 jours sans visite. Un site **installe sur l'ecran
d'accueil** echappe a cette purge. C'est la meilleure protection de
l'historique des eleves — a expliquer aux eleves une fois.

---

## Alternative sans PHP

Si l'injection PHP pose probleme, la balise peut etre ajoutee directement
dans les fichiers, en une passe :

```bash
# a lancer depuis le dossier des exercices, APRES une sauvegarde
grep -rLZ "devoirati-histo.js" --include="*.html" . \
  | xargs -0 sed -i 's#</body>#<script src="/devoirati-histo.js" defer></script>\n</body>#I'
```

Plus simple, mais a relancer a chaque nouvelle page — et il faut penser a
l'ajouter au generateur pour les pages produites automatiquement.

---

## Pour les pages futures

Les pages qui calculent elles-memes un score peuvent le declarer :

```js
Devoirati.resultat(8, 10);   // 8 bonnes reponses sur 10
```

Sinon, le script detecte automatiquement les elements `#score` et `#total`,
deja presents dans une partie des pages existantes.

---

## Point de vigilance

La cle de l'historique est **le chemin de la page** (`/fractions/addition/exo-012.html`).
Les donnees etant chez l'eleve, un fichier renomme casse son historique
sans qu'on puisse rien reparer a distance. Figer l'arborescence avant de
deployer largement.
