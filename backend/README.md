# Backend Devoirati — Phase 1

Moteur PHP + PDO : comptes (élève/parent/prof/admin), authentification
sécurisée, rôles et autorisations **côté serveur**, classes multi-professeurs,
inscriptions historisées, association parent-élève par code, journal d'audit.

> **Rappel encodage** : la base est en `latin1`, on ne stocke **jamais** d'arabe.
> Uniquement des **codes latins** (`debutant`, `MATHEMATIQUES`, `pere`…) traduits
> à l'affichage (`labels.php`).

## Déploiement (dans l'ordre)

### 1. Migration de la base — par Dhia, après SAUVEGARDE
Exécuter `../db/migrations/phase1_up.sql` dans l'onglet SQL de phpMyAdmin.
Migration **additive** (voir `../docs/04-migration-sauvegarde-rollback.md`).
Rollback disponible : `../db/migrations/phase1_down.sql`.

### 2. Configuration
Copier `config.sample.php` en `config.php` et renseigner les identifiants réels
de la base + un `app_secret` long et aléatoire. `config.php` est git-ignoré.

### 3. Fichiers
Déposer le dossier `backend/` dans `public_html/`.

### 4. Vérification
`https://TON-SITE/backend/session.php` → `{"ok":true,"connecte":false,...}`.

## API (Phase 1)

| Fichier | Méthode | Rôle requis | Description |
|---|---|---|---|
| `register.php` | POST | public | Inscription parent/prof (e-mail + mot de passe) |
| `login.php` | POST | public | Connexion (login **ou** e-mail) |
| `logout.php` | POST | connecté | Déconnexion |
| `session.php` | GET | — | Utilisateur courant (+ libellés arabes) |
| `password_change.php` | POST | connecté | Changer **son** mot de passe |
| `password_reset.php` | POST | prof/parent/admin | Réinit. mot de passe d'un élève (autorisé) |
| `etablissements.php` | GET/POST | admin (POST) | Établissements |
| `annees_scolaires.php` | GET/POST | admin (POST) | Années scolaires |
| `classes_create.php` | POST | prof/admin | Créer une classe (prof = principal) |
| `classes_teachers.php` | POST | prof princ./admin | Ajouter un prof à une classe |
| `students_create.php` | POST | prof/parent/admin | Créer un compte élève |
| `enrollments.php` | POST | prof/admin | Inscrire/retirer un élève (historisé) |
| `parent_invite_create.php` | POST | prof/parent/admin | Générer un code d'association |
| `parent_invite_accept.php` | POST | parent | Utiliser un code d'association |
| `parent_invite_revoke.php` | POST | prof/parent/admin | Révoquer code/association |

Toutes échangent du **JSON** et répondent `{ "ok": true/false, ... }`.

## Sécurité
- Mots de passe **hachés** (`password_hash`), jamais en clair — même les codes
  d'association sont stockés hachés (HMAC).
- **Autorisations côté serveur** systématiques (`authz.php` + `require_can`).
- Requêtes **préparées** partout. Sessions régénérées à la connexion.
- **Suppression logique** (statut / `archived_at` / `deleted_at`).
- **Journal d'audit** des actions sensibles (`dv_audit_logs`).
- En HTTPS, décommenter le cookie `secure` dans `db.php`.
