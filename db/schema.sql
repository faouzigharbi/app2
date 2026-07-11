-- ============================================================
--  Devoirati — Schéma de base de données
--  Base : iusp6955_faouzigharbi   (MySQL / MariaDB)
--
--  À exécuter dans phpMyAdmin : onglet "SQL" > coller > Exécuter.
--  Les 3 tables sont vides (0 ligne), on les recrée proprement
--  en utf8mb4 pour un affichage correct de l'arabe et des emojis.
-- ============================================================

SET NAMES utf8mb4;

-- On supprime d'abord les tables filles (à cause des clés étrangères),
-- puis la table parente. Sans danger : elles sont vides.
DROP TABLE IF EXISTS dv_analytics;
DROP TABLE IF EXISTS dv_progress;
DROP TABLE IF EXISTS dv_users;

-- ------------------------------------------------------------
--  UTILISATEURS  — élèves, parents, professeurs
-- ------------------------------------------------------------
CREATE TABLE dv_users (
  id                 INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  role               ENUM('eleve','parent','prof','admin') NOT NULL DEFAULT 'eleve',
  prenom             VARCHAR(80)      NOT NULL,
  nom                VARCHAR(80)      NOT NULL,
  identifiant        VARCHAR(60)      NOT NULL,          -- login (pratique pour les élèves sans e-mail)
  email              VARCHAR(190)     DEFAULT NULL,
  mot_de_passe_hash  VARCHAR(255)     NOT NULL,          -- haché (jamais en clair)
  classe             VARCHAR(40)      DEFAULT NULL,      -- ex : 1AC-B (élève et prof)
  parent_id          INT UNSIGNED     DEFAULT NULL,      -- lie un élève à son parent
  xp                 INT UNSIGNED     NOT NULL DEFAULT 0,
  niveau             SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  serie_jours        SMALLINT UNSIGNED NOT NULL DEFAULT 0,  -- "streak" 🔥
  derniere_activite  DATE             DEFAULT NULL,
  actif              TINYINT(1)       NOT NULL DEFAULT 1,
  cree_le            TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_identifiant (identifiant),
  UNIQUE KEY uq_email (email),
  KEY idx_role (role),
  KEY idx_parent (parent_id),
  KEY idx_classe (classe),
  CONSTRAINT fk_users_parent FOREIGN KEY (parent_id) REFERENCES dv_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
--  PROGRESSION  — un résultat d'exercice par ligne
-- ------------------------------------------------------------
CREATE TABLE dv_progress (
  id              BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  eleve_id        INT UNSIGNED      NOT NULL,
  exercice        VARCHAR(100)      NOT NULL,            -- ex : "division-fractions"
  theme           VARCHAR(60)       NOT NULL,            -- ex : "fractions" / "puissances"
  score           SMALLINT UNSIGNED NOT NULL,            -- bonnes réponses
  total           SMALLINT UNSIGNED NOT NULL,            -- questions posées
  duree_secondes  INT UNSIGNED      DEFAULT NULL,
  xp_gagne        SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  fait_le         TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_eleve (eleve_id),
  KEY idx_theme (theme),
  KEY idx_date (fait_le),
  CONSTRAINT fk_progress_eleve FOREIGN KEY (eleve_id) REFERENCES dv_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
--  ANALYTICS  — maîtrise agrégée par élève et par thème
--  (alimente les diagnostics parent et professeur)
-- ------------------------------------------------------------
CREATE TABLE dv_analytics (
  id               BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  eleve_id         INT UNSIGNED      NOT NULL,
  theme            VARCHAR(60)       NOT NULL,
  maitrise_pct     TINYINT UNSIGNED  NOT NULL DEFAULT 0,  -- 0 à 100
  exercices_faits  INT UNSIGNED      NOT NULL DEFAULT 0,
  reussites        INT UNSIGNED      NOT NULL DEFAULT 0,
  maj_le           TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_eleve_theme (eleve_id, theme),
  KEY idx_theme (theme),
  CONSTRAINT fk_analytics_eleve FOREIGN KEY (eleve_id) REFERENCES dv_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  Fin du schéma. Les badges et affectations viendront ensuite.
-- ============================================================
