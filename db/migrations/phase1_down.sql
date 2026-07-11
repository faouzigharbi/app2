-- ============================================================
--  Devoirati — Migration Phase 1 (SENS : DOWN / retour arrière)
--
--  Annule EXACTEMENT phase1_up.sql : supprime les tables nouvelles et
--  retire les colonnes ajoutées à dv_users. Ne touche pas aux données
--  d'origine de dv_users / dv_progress / dv_analytics.
--
--  ⚠️ En cas de doute, préférer la restauration complète depuis la
--     sauvegarde (voir docs/04-migration-...md, section 5, niveau B).
-- ============================================================

-- 1) Supprimer les tables nouvelles (ordre sans dépendance bloquante)
DROP TABLE IF EXISTS dv_audit_logs;
DROP TABLE IF EXISTS dv_parent_eleve;
DROP TABLE IF EXISTS dv_parent_eleve_invitations;
DROP TABLE IF EXISTS dv_classe_eleve;
DROP TABLE IF EXISTS dv_classe_professeur;
DROP TABLE IF EXISTS dv_classes;
DROP TABLE IF EXISTS dv_matieres;
DROP TABLE IF EXISTS dv_niveaux;
DROP TABLE IF EXISTS dv_annees_scolaires;
DROP TABLE IF EXISTS dv_etablissements;

-- 2) Retirer les index puis les colonnes ajoutées à dv_users
ALTER TABLE dv_users
  DROP INDEX uq_users_login,
  DROP INDEX uq_users_email,
  DROP INDEX idx_users_role,
  DROP INDEX idx_users_statut,
  DROP INDEX idx_users_etab,
  DROP INDEX idx_users_creator;

ALTER TABLE dv_users
  DROP COLUMN role,
  DROP COLUMN prenom,
  DROP COLUMN login,
  DROP COLUMN email,
  DROP COLUMN password_hash,
  DROP COLUMN must_change_password,
  DROP COLUMN statut,
  DROP COLUMN etablissement_id,
  DROP COLUMN niveau_code,
  DROP COLUMN code_association,
  DROP COLUMN created_by_user_id,
  DROP COLUMN archived_at,
  DROP COLUMN deleted_at;

-- ============================================================
--  Fin du rollback Phase 1. dv_users revient à sa structure d'origine.
-- ============================================================
