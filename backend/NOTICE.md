# État du backend — Phase 1 (authentification, rôles, classes, associations)

Ce dossier contient désormais le **code réel de la Phase 1**, conforme au schéma
validé (Porte 1) et à la revue de Dhia.

## ✅ Livré et vérifié (hors base réelle)
- Socle : `db.php`, `util.php`, `labels.php`, `auth.php`, `authz.php`, `audit.php`
- Authentification : `register.php`, `login.php`, `logout.php`, `session.php`,
  `password_change.php`, `password_reset.php`
- Scolarité : `etablissements.php`, `annees_scolaires.php`, `classes_create.php`,
  `classes_teachers.php`, `students_create.php`, `enrollments.php`
- Association parent-élève : `parent_invite_create.php`, `parent_invite_accept.php`,
  `parent_invite_revoke.php`
- **Tests** : lint PHP OK sur tous les fichiers ; **16/16** tests de la logique
  d'autorisation (matrice de permissions) passés.

## ⏳ À faire pour la mise en service (dans l'ordre)
1. **Dhia** applique la migration `db/migrations/phase1_up.sql` **après sauvegarde**.
2. Créer `backend/config.php` depuis `config.sample.php` (identifiants réels).
3. Déposer `backend/` sur l'hébergement.
4. Tests de bout en bout sur le serveur (scénarios `docs/05-tests-phase1.md`).

> Tant que la migration n'est pas appliquée, les API renverront une erreur de
> base (colonnes manquantes). C'est normal : **le code précède l'exécution de la
> migration**, comme convenu.

Voir le guide : [`README.md`](README.md) et le dossier [`../docs/`](../docs/README.md).
