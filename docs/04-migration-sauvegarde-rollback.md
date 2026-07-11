# 04 — Migration, sauvegarde et retour arrière (point 10)

> **⚠️ Rien n'est exécuté avant validation de Dhia ET sauvegarde complète.**
> Toute la migration de la Phase 1 est **additive** (ajout de colonnes/tables) :
> aucune colonne existante n'est modifiée ni supprimée.

## 1. Preuve de compatibilité

| Table existante | Modification prévue | Impact sur l'existant |
|---|---|---|
| `dv_users` | **Ajout** de colonnes (`role`, `login`, …) toutes **NULL/défaut** | Aucun : les lignes actuelles restent valides, `role` prend `eleve` par défaut |
| `dv_progress` | **Aucune** | Aucun |
| `dv_analytics` | **Aucune** | Aucun |

Les autres tables de la Phase 1 sont **nouvelles** → elles ne touchent pas
l'existant. La compatibilité est donc garantie **par construction** (additif).
De plus, l'audit (doc 01) indique **0 ligne** dans les 3 tables : à confirmer au
moment M, mais dans ce cas il n'y a **strictement aucune donnée à migrer**.

## 2. Sauvegarde préalable (obligatoire, par Dhia)

Avant toute commande d'écriture :

1. **Export complet** de la base via phpMyAdmin → onglet **Exporter** →
   méthode « personnalisée » → **structure + données** → format SQL →
   fichier `iusp6955_faouzigharbi_AVANT_migration_AAAA-MM-JJ.sql`.
2. Conserver ce fichier **hors du serveur** (téléchargement local).
3. Archiver aussi le résultat des `SHOW CREATE TABLE` (doc 01).

> Sans cette sauvegarde vérifiée, **on n'exécute rien**.

## 3. Script de migration — Phase 1 (PROJET, additif)

> À exécuter **une seule fois**, après sauvegarde, dans l'onglet SQL. Tout est en
> lettres latines → compatible `latin1`.

```sql
-- 3.1 — Extension de dv_users (additif, non destructif)
ALTER TABLE dv_users
  ADD COLUMN role                 VARCHAR(20)  NOT NULL DEFAULT 'eleve',
  ADD COLUMN prenom               VARCHAR(80)  DEFAULT NULL,
  ADD COLUMN login                VARCHAR(60)  DEFAULT NULL,
  ADD COLUMN email                VARCHAR(190) DEFAULT NULL,
  ADD COLUMN password_hash        VARCHAR(255) DEFAULT NULL,
  ADD COLUMN must_change_password TINYINT(1)   NOT NULL DEFAULT 0,
  ADD COLUMN statut               VARCHAR(20)  NOT NULL DEFAULT 'actif',
  ADD COLUMN etablissement_id     VARCHAR(36)  DEFAULT NULL,
  ADD COLUMN niveau_code          VARCHAR(20)  DEFAULT NULL,
  ADD COLUMN code_association     VARCHAR(64)  DEFAULT NULL,
  ADD COLUMN created_by_user_id   VARCHAR(36)  DEFAULT NULL,
  ADD COLUMN archived_at          DATETIME     DEFAULT NULL,
  ADD COLUMN deleted_at           DATETIME     DEFAULT NULL;

ALTER TABLE dv_users
  ADD UNIQUE KEY uq_users_login (login),
  ADD UNIQUE KEY uq_users_email (email),
  ADD KEY idx_users_role (role),
  ADD KEY idx_users_statut (statut),
  ADD KEY idx_users_etab (etablissement_id),
  ADD KEY idx_users_creator (created_by_user_id);

-- 3.2 — Référentiels
CREATE TABLE dv_etablissements (
  id VARCHAR(36) PRIMARY KEY, nom VARCHAR(150) NOT NULL, code VARCHAR(30),
  ville VARCHAR(80), pays VARCHAR(2), statut VARCHAR(20) DEFAULT 'actif',
  created_at DATETIME, updated_at DATETIME, archived_at DATETIME,
  UNIQUE KEY uq_etab_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE dv_annees_scolaires (
  id VARCHAR(36) PRIMARY KEY, etablissement_id VARCHAR(36),
  libelle VARCHAR(20), date_debut DATE, date_fin DATE,
  active TINYINT(1) DEFAULT 0, created_at DATETIME,
  UNIQUE KEY uq_annee (etablissement_id, libelle), KEY idx_annee_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE dv_niveaux (
  code VARCHAR(20) PRIMARY KEY, ordre INT, actif TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE dv_matieres (
  code VARCHAR(30) PRIMARY KEY, actif TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 3.3 — Structure scolaire
CREATE TABLE dv_classes (
  id VARCHAR(36) PRIMARY KEY, nom VARCHAR(60),
  niveau_code VARCHAR(20), etablissement_id VARCHAR(36), annee_scolaire_id VARCHAR(36),
  statut VARCHAR(20) DEFAULT 'actif', created_by_user_id VARCHAR(36),
  created_at DATETIME, updated_at DATETIME, archived_at DATETIME,
  UNIQUE KEY uq_classe (etablissement_id, annee_scolaire_id, nom),
  KEY idx_classe_niveau (niveau_code), KEY idx_classe_annee (annee_scolaire_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE dv_classe_professeur (
  id VARCHAR(36) PRIMARY KEY, classe_id VARCHAR(36), professeur_id VARCHAR(36),
  matiere_code VARCHAR(30), est_professeur_principal TINYINT(1) DEFAULT 0,
  role_dans_classe VARCHAR(30), date_debut DATE, date_fin DATE,
  statut VARCHAR(20) DEFAULT 'actif',
  UNIQUE KEY uq_cp (classe_id, professeur_id, matiere_code),
  KEY idx_cp_prof (professeur_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE dv_classe_eleve (
  id VARCHAR(36) PRIMARY KEY, classe_id VARCHAR(36), eleve_id VARCHAR(36),
  annee_scolaire_id VARCHAR(36), date_inscription DATE, date_sortie DATE,
  statut VARCHAR(20) DEFAULT 'inscrit', created_by_user_id VARCHAR(36),
  UNIQUE KEY uq_ce (classe_id, eleve_id, annee_scolaire_id), KEY idx_ce_eleve (eleve_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 3.4 — Association parent-élève
CREATE TABLE dv_parent_eleve_invitations (
  id VARCHAR(36) PRIMARY KEY, eleve_id VARCHAR(36), code_hash VARCHAR(255),
  relation VARCHAR(20), created_by_user_id VARCHAR(36), expires_at DATETIME,
  max_utilisations INT DEFAULT 1, utilisations INT DEFAULT 0,
  statut VARCHAR(20) DEFAULT 'en_attente', accepted_by_parent_id VARCHAR(36),
  created_at DATETIME, updated_at DATETIME,
  KEY idx_inv_eleve (eleve_id), KEY idx_inv_statut (statut), KEY idx_inv_exp (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE dv_parent_eleve (
  id VARCHAR(36) PRIMARY KEY, parent_id VARCHAR(36), eleve_id VARCHAR(36),
  relation VARCHAR(20), invitation_id VARCHAR(36), statut VARCHAR(20) DEFAULT 'actif',
  validated_at DATETIME, created_at DATETIME,
  UNIQUE KEY uq_pe (parent_id, eleve_id), KEY idx_pe_eleve (eleve_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 3.5 — Journal de sécurité
CREATE TABLE dv_audit_logs (
  id VARCHAR(36) PRIMARY KEY, acteur_id VARCHAR(36), action VARCHAR(50),
  cible_type VARCHAR(30), cible_id VARCHAR(36), details TEXT,
  ip VARCHAR(45), user_agent VARCHAR(255), created_at DATETIME,
  KEY idx_audit_acteur (acteur_id), KEY idx_audit_action (action),
  KEY idx_audit_cible (cible_type, cible_id), KEY idx_audit_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 3.6 — Données de référence initiales
INSERT INTO dv_niveaux (code, ordre, actif) VALUES
  ('7EME',1,1), ('8EME',2,1), ('9EME',3,1);
INSERT INTO dv_matieres (code, actif) VALUES ('MATHEMATIQUES',1);
```

> **Clés étrangères** : ajoutées dans un second temps (une fois les données de
> référence en place), avec `ON DELETE RESTRICT`/`SET NULL`, pour éviter tout
> blocage à la création. Elles feront l'objet d'un sous-script dédié et vérifié.

## 4. Liaison des anciens comptes aux nouveaux (point 10)

Les lignes existantes de `dv_users` sont des **profils élèves sans connexion**.
Procédure de rattachement, **sans perte** :

1. Après migration, elles ont automatiquement `role='eleve'`, `statut='actif'`,
   `login=NULL`, `password_hash=NULL`.
2. Un compte élève ne devient « connectable » que lorsqu'un prof/parent/admin lui
   attribue un `login` + un `password_hash` (avec `must_change_password=1`).
3. **Aucune** génération automatique de mot de passe en clair. Tant qu'aucun
   `login` n'est défini, l'ancien profil continue de fonctionner exactement comme
   avant (gamification, progression) — il n'est simplement pas « connectable ».

**Risques de doublons & garde-fous :**
- `UNIQUE(login)` et `UNIQUE(email)` empêchent les doublons de connexion.
- Avant d'attribuer un `login`, l'API vérifie l'unicité et refuse proprement.
- Les colonnes ajoutées étant NULL par défaut, l'index `UNIQUE` tolère plusieurs
  lignes à `login=NULL` (comportement MySQL attendu) → pas de collision sur les
  anciens profils.

## 5. Retour arrière (rollback)

Deux niveaux, du plus simple au plus sûr :

**Niveau A — annuler les ajouts (si les tables existantes étaient intactes) :**
```sql
-- Supprimer les nouvelles tables
DROP TABLE IF EXISTS dv_audit_logs, dv_parent_eleve, dv_parent_eleve_invitations,
  dv_classe_eleve, dv_classe_professeur, dv_classes,
  dv_matieres, dv_niveaux, dv_annees_scolaires, dv_etablissements;

-- Retirer les colonnes ajoutées à dv_users
ALTER TABLE dv_users
  DROP INDEX uq_users_login, DROP INDEX uq_users_email,
  DROP COLUMN role, DROP COLUMN prenom, DROP COLUMN login, DROP COLUMN email,
  DROP COLUMN password_hash, DROP COLUMN must_change_password, DROP COLUMN statut,
  DROP COLUMN etablissement_id, DROP COLUMN niveau_code, DROP COLUMN code_association,
  DROP COLUMN created_by_user_id, DROP COLUMN archived_at, DROP COLUMN deleted_at;
```

**Niveau B — restauration complète (référence) :** ré-importer le fichier de
sauvegarde `…_AVANT_migration_AAAA-MM-JJ.sql` via phpMyAdmin → onglet
**Importer**. C'est la garantie ultime : on revient à l'état exact d'avant.

## 6. Ordre d'exécution imposé

1. ✅ Sauvegarde complète vérifiée (section 2).
2. ✅ Re-vérification volumétrie + structure (doc 01, section 6).
3. ✅ Exécution du script additif (section 3) — **une seule fois**.
4. ✅ Contrôles post-migration (doc 05).
5. En cas d'anomalie → rollback (section 5).
