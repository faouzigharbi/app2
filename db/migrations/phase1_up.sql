-- ============================================================
--  Devoirati — Migration Phase 1 (SENS : UP / installation)
--  Base : iusp6955_faouzigharbi  (MySQL/MariaDB, latin1, InnoDB)
--
--  ⚠️ À exécuter par Dhia UNE SEULE FOIS, dans l'onglet SQL de phpMyAdmin,
--     APRÈS une sauvegarde complète (voir docs/04-migration-...md).
--  Migration ADDITIVE : aucune colonne existante n'est modifiée/supprimée.
--  Rollback : db/migrations/phase1_down.sql
-- ============================================================

-- 1) Extension de dv_users (additif) --------------------------------------
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

-- 2) Référentiels ---------------------------------------------------------
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

-- 3) Structure scolaire ---------------------------------------------------
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

-- 4) Association parent-élève --------------------------------------------
CREATE TABLE dv_parent_eleve_invitations (
  id VARCHAR(36) PRIMARY KEY, eleve_id VARCHAR(36), code_hash VARCHAR(255),
  relation VARCHAR(20), created_by_user_id VARCHAR(36), expires_at DATETIME,
  max_utilisations INT DEFAULT 1, utilisations INT DEFAULT 0,
  statut VARCHAR(20) DEFAULT 'en_attente', accepted_by_parent_id VARCHAR(36),
  created_at DATETIME, updated_at DATETIME,
  KEY idx_inv_eleve (eleve_id), KEY idx_inv_statut (statut),
  KEY idx_inv_exp (expires_at), KEY idx_inv_hash (code_hash)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE dv_parent_eleve (
  id VARCHAR(36) PRIMARY KEY, parent_id VARCHAR(36), eleve_id VARCHAR(36),
  relation VARCHAR(20), invitation_id VARCHAR(36), statut VARCHAR(20) DEFAULT 'actif',
  validated_at DATETIME, created_at DATETIME,
  UNIQUE KEY uq_pe (parent_id, eleve_id), KEY idx_pe_eleve (eleve_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 5) Journal de sécurité --------------------------------------------------
CREATE TABLE dv_audit_logs (
  id VARCHAR(36) PRIMARY KEY, acteur_id VARCHAR(36), action VARCHAR(50),
  cible_type VARCHAR(30), cible_id VARCHAR(36), details TEXT,
  ip VARCHAR(45), user_agent VARCHAR(255), created_at DATETIME,
  KEY idx_audit_acteur (acteur_id), KEY idx_audit_action (action),
  KEY idx_audit_cible (cible_type, cible_id), KEY idx_audit_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 6) Données de référence initiales --------------------------------------
INSERT INTO dv_niveaux (code, ordre, actif) VALUES
  ('7EME',1,1), ('8EME',2,1), ('9EME',3,1);
INSERT INTO dv_matieres (code, actif) VALUES ('MATHEMATIQUES',1);

-- ============================================================
--  Fin de la migration Phase 1 (UP).
--  Les clés étrangères sont ajoutées séparément une fois les données de
--  référence en place — voir phase1_fk.sql (optionnel selon l'hébergement).
-- ============================================================
