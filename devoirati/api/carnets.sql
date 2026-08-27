-- Devoirati — table unique de la synchronisation.
-- A executer une fois dans cPanel > phpMyAdmin.
--
-- Aucune donnee personnelle : un code aleatoire, et une liste de
-- chemins d'exercices avec des scores. Ni nom, ni e-mail, ni adresse IP.

CREATE TABLE IF NOT EXISTS carnets (
  code      CHAR(9)     NOT NULL,          -- ABCD-EFGH
  donnees   MEDIUMTEXT  NOT NULL,          -- le carnet, en JSON
  maj       DATETIME    NOT NULL,
  cree      DATETIME    NOT NULL,
  PRIMARY KEY (code),
  KEY idx_maj (maj)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Menage : supprimer les carnets abandonnes depuis plus de deux ans.
-- A programmer dans cPanel > Cron jobs, une fois par mois.
--   DELETE FROM carnets WHERE maj < DATE_SUB(NOW(), INTERVAL 2 YEAR);
