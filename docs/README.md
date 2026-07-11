# Dossier de planification — Plateforme Devoirati

> **Statut : PLAN VALIDÉ SUR LE PRINCIPE — CORRECTIONS INTÉGRÉES — EN ATTENTE DE
> VALIDATION FINALE DE DHIA SUR LA PARTIE BASE DE DONNÉES.**
> **⚠️ Aucun code applicatif ne sera écrit, et aucune table existante ne sera
> modifiée, avant l'autorisation explicite (et une sauvegarde complète).**

Ce dossier répond point par point à la revue d'architecture de Dhia (14 points +
découpage des phases + livrables). Il ne contient **que de la conception** :
schéma, dictionnaire de données, contraintes, permissions, migration, tests et
liste des fichiers à venir.

## Sommaire des livrables

| # | Document | Contenu |
|---|----------|---------|
| 01 | [`01-audit-existant.md`](01-audit-existant.md) | Audit exact des 3 tables existantes (noms, colonnes, clés, volumétrie) |
| 02 | [`02-dictionnaire-donnees.md`](02-dictionnaire-donnees.md) | Dictionnaire complet : toutes les tables, colonnes, types, clés, index, unicité |
| 03 | [`03-matrice-permissions.md`](03-matrice-permissions.md) | Matrice des autorisations par rôle (contrôles côté serveur) |
| 04 | [`04-migration-sauvegarde-rollback.md`](04-migration-sauvegarde-rollback.md) | Plan de migration réversible, sauvegarde, retour arrière, liaison anciens↔nouveaux comptes |
| 05 | [`05-tests-phase1.md`](05-tests-phase1.md) | Scénarios de test de la Phase 1 |
| 06 | [`06-fichiers-a-livrer.md`](06-fichiers-a-livrer.md) | Liste précise des fichiers qui seront créés ou modifiés |
| 07 | [`07-phases-et-etapes.md`](07-phases-et-etapes.md) | Découpage en phases, et sous-étapes de la Phase 1 |

## Réponse aux 14 points de Dhia

| Point | Sujet | Traité dans |
|------|-------|-------------|
| 1 | Plusieurs professeurs par classe (`dv_classe_professeur`) | Doc 02 |
| 2 | Année scolaire obligatoire (`dv_annees_scolaires`) | Doc 02 |
| 3 | Établissement (`dv_etablissements`) | Doc 02 |
| 4 | Niveaux & matières en codes stables (`dv_niveaux`, `dv_matieres`) | Doc 02 |
| 5 | Compte élève (statut, hash, changement/réinit. mot de passe) | Doc 02 + 03 |
| 6 | Propriété du compte créé (`created_by_user_id`, contrôles d'accès) | Doc 02 + 03 |
| 7 | Association parent–élève sécurisée (`dv_parent_eleve_invitations`) | Doc 02 |
| 8 | Inscription en classe historisée (`dv_classe_eleve` enrichie) | Doc 02 |
| 9 | Devoirs multi-cibles (`dv_devoir_affectations`) | Doc 02 (Phase 2) |
| 10 | Preuve de compatibilité + migration | Doc 01 + 04 |
| 11 | Rôles & autorisations (matrice, contrôles serveur) | Doc 03 |
| 12 | Journal de sécurité (`dv_audit_logs`) | Doc 02 |
| 13 | Suppression logique (`status`, `archived_at`, `deleted_at`) | Doc 02 |
| 14 | Données personnelles minimales | Doc 02 |

## Conventions transverses (rappel)

- **Encodage `latin1`** : on ne stocke **jamais** d'arabe. Uniquement des **codes
  latins stables** (`debutant`, `MATHEMATIQUES`, `pere`…) traduits à l'affichage.
- **Identifiants** : `id` en `VARCHAR(36)` (UUID) pour toutes les nouvelles
  tables, cohérent avec `dv_users` existant.
- **Sécurité** : mots de passe uniquement en **hash** (`password_hash`), jamais
  en clair ; contrôles d'autorisation **côté serveur** ; suppression **logique**.
- **Historique** : on archive, on ne supprime pas les données pédagogiques.
