-- ============================================================
--  Devoirati — Schéma de base de données
--  Base : iusp6955_faouzigharbi   (MySQL / MariaDB, encodage latin1)
--
--  IMPORTANT :
--  - Les 3 tables existent DÉJÀ (créées par Dhia). Ne PAS les recréer.
--  - La base n'accepte pas l'arabe : on stocke des "codes" en lettres
--    latines (ex. 'debutant', 'fractions') et le code PHP/JS les traduit
--    en arabe à l'affichage.
--  - Ce fichier sert de RÉFÉRENCE (partie 1) + d'AJOUTS non destructifs
--    pour activer les comptes parent/prof (partie 2).
-- ============================================================


-- ============================================================
--  PARTIE 1 — STRUCTURE EXISTANTE (référence, NE PAS RÉEXÉCUTER)
--  Telle que créée par Dhia sur le serveur.
-- ============================================================

-- CREATE TABLE dv_users (
--   id            VARCHAR(36) PRIMARY KEY,           -- identifiant unique (UUID)
--   nom           VARCHAR(100) NOT NULL,
--   annee         VARCHAR(10)  NOT NULL,             -- ex : "1AC"
--   xp            INT DEFAULT 0,
--   niveau        INT DEFAULT 1,
--   niveau_titre  VARCHAR(50) DEFAULT 'debutant',    -- code latin, affiché "مبتدئ"
--   xp_next_level INT DEFAULT 100,
--   streak        INT DEFAULT 0,                     -- série de jours 🔥
--   last_streak_date DATE,
--   badges        TEXT,                              -- JSON : liste des badges
--   created_at    DATE,
--   last_seen     DATE,
--   updated_at    DATETIME
-- );

-- CREATE TABLE dv_progress (
--   id            INT AUTO_INCREMENT PRIMARY KEY,
--   user_id       VARCHAR(36),                       -- -> dv_users.id
--   chapitre_id   VARCHAR(100),
--   etat          VARCHAR(20) DEFAULT 'nouveau',     -- nouveau / en_cours / termine
--   etape         INT DEFAULT 0,
--   etapes_total  INT DEFAULT 5,
--   progression   INT DEFAULT 0,                     -- pourcentage
--   activite_id   VARCHAR(200),
--   activite_nom  VARCHAR(200),
--   score         VARCHAR(20),
--   erreurs       TEXT,
--   activities    TEXT,
--   started_at    DATE,
--   completed_at  DATE,
--   updated_at    DATETIME,
--   FOREIGN KEY (user_id) REFERENCES dv_users(id)
-- );

-- CREATE TABLE dv_analytics (
--   id             INT AUTO_INCREMENT PRIMARY KEY,
--   user_id        VARCHAR(36),                      -- -> dv_users.id
--   total_sessions INT DEFAULT 0,
--   total_minutes  INT DEFAULT 0,
--   total_xp       INT DEFAULT 0,
--   daily_data     TEXT,                             -- JSON : activité par jour
--   updated_at     DATETIME
-- );


-- ============================================================
--  PARTIE 2 — AJOUTS "COMPTES & RÔLES" (non destructif)
--
--  À exécuter par Dhia (c'est son serveur), onglet SQL de phpMyAdmin,
--  APRÈS son accord. Ces commandes AJOUTENT des colonnes : elles
--  n'effacent aucune donnée existante.
--
--  Tout est en lettres latines (rôles, logins, mots de passe hachés) :
--  aucune valeur arabe stockée, donc compatible avec l'encodage actuel.
-- ============================================================

ALTER TABLE dv_users
  ADD COLUMN role          VARCHAR(20)  NOT NULL DEFAULT 'eleve' AFTER nom,  -- eleve / parent / prof / admin
  ADD COLUMN login         VARCHAR(60)  DEFAULT NULL AFTER role,             -- identifiant de connexion (parent/prof)
  ADD COLUMN email         VARCHAR(190) DEFAULT NULL AFTER login,
  ADD COLUMN password_hash VARCHAR(255) DEFAULT NULL AFTER email,            -- mot de passe HACHÉ (jamais en clair)
  ADD COLUMN parent_id     VARCHAR(36)  DEFAULT NULL AFTER annee,            -- relie un élève à son parent (-> dv_users.id)
  ADD COLUMN classe        VARCHAR(40)  DEFAULT NULL AFTER parent_id;        -- classe de l'élève / du prof (ex : 1AC-B)

-- Index pour des recherches rapides et un login unique.
ALTER TABLE dv_users
  ADD UNIQUE KEY uq_login (login),
  ADD KEY idx_role (role),
  ADD KEY idx_parent (parent_id),
  ADD KEY idx_classe (classe);

-- ============================================================
--  Remarque : le lien prof -> élèves se fait par la colonne "classe"
--  (les élèves d'une même classe que le prof). Le lien parent -> enfant
--  se fait par "parent_id". Pas besoin de nouvelle table pour l'instant.
-- ============================================================
