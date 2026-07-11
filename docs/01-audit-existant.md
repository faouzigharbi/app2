# 01 — Audit exact de la base existante

Base : **`iusp6955_faouzigharbi`** — serveur `localhost:3306` — MySQL/MariaDB —
moteur **InnoDB** — interclassement **`latin1_swedish_ci`**.

Source de cet audit : le script `CREATE TABLE` fourni par Dhia + les captures
phpMyAdmin. **À reconfirmer sur le serveur au moment de la migration** (voir la
procédure de vérification en bas).

## 1. Volumétrie constatée

Sur la capture phpMyAdmin fournie, les 3 tables affichaient **0 ligne** :

| Table | Lignes | Moteur | Interclassement |
|-------|:------:|--------|-----------------|
| `dv_analytics` | 0 | InnoDB | latin1_swedish_ci |
| `dv_progress`  | 0 | InnoDB | latin1_swedish_ci |
| `dv_users`     | 0 | InnoDB | latin1_swedish_ci |

> **Conséquence majeure :** si les tables sont toujours vides au moment de la
> migration, la « compatibilité » est **triviale à garantir** (aucune donnée à
> migrer, aucun risque de doublon). Si des données ont été ajoutées depuis, on
> applique la procédure du doc 04. **Cette volumétrie doit être re-vérifiée
> juste avant toute opération.**

## 2. Structure exacte — `dv_users`

Clé primaire : `id` (VARCHAR(36), UUID). Aucune clé étrangère entrante définie
sur cette table.

| Colonne | Type | Défaut / Notes |
|---------|------|----------------|
| `id` | VARCHAR(36) | **PK** |
| `nom` | VARCHAR(100) | NOT NULL |
| `annee` | VARCHAR(10) | NOT NULL |
| `xp` | INT | 0 |
| `niveau` | INT | 1 |
| `niveau_titre` | VARCHAR(50) | `'debutant'` (Dhia a remplacé `'مبتدئ'` par un code latin) |
| `xp_next_level` | INT | 100 |
| `streak` | INT | 0 |
| `last_streak_date` | DATE | |
| `badges` | TEXT | JSON (liste de badges) |
| `created_at` | DATE | |
| `last_seen` | DATE | |
| `updated_at` | DATETIME | |

## 3. Structure exacte — `dv_progress`

Clé primaire : `id` (INT AUTO_INCREMENT). Clé étrangère : `user_id` → `dv_users(id)`.

| Colonne | Type | Défaut / Notes |
|---------|------|----------------|
| `id` | INT AUTO_INCREMENT | **PK** |
| `user_id` | VARCHAR(36) | **FK** → `dv_users(id)` |
| `chapitre_id` | VARCHAR(100) | |
| `etat` | VARCHAR(20) | `'nouveau'` |
| `etape` | INT | 0 |
| `etapes_total` | INT | 5 |
| `progression` | INT | 0 |
| `activite_id` | VARCHAR(200) | |
| `activite_nom` | VARCHAR(200) | |
| `score` | VARCHAR(20) | |
| `erreurs` | TEXT | |
| `activities` | TEXT | |
| `started_at` | DATE | |
| `completed_at` | DATE | |
| `updated_at` | DATETIME | |

## 4. Structure exacte — `dv_analytics`

Clé primaire : `id` (INT AUTO_INCREMENT). Clé étrangère : `user_id` → `dv_users(id)`.

| Colonne | Type | Défaut / Notes |
|---------|------|----------------|
| `id` | INT AUTO_INCREMENT | **PK** |
| `user_id` | VARCHAR(36) | **FK** → `dv_users(id)` |
| `total_sessions` | INT | 0 |
| `total_minutes` | INT | 0 |
| `total_xp` | INT | 0 |
| `daily_data` | TEXT | JSON (activité par jour) |
| `updated_at` | DATETIME | |

## 5. Observations pour la suite

1. **`dv_users` est centrée « élève »** : elle mélange identité et gamification.
   Les colonnes de compte (`role`, `login`, `email`, `password_hash`, `statut`…)
   **n'existent pas encore** → elles seront **ajoutées** (additif, non destructif).
2. **Aucun mécanisme d'authentification** n'existe aujourd'hui (pas de mot de
   passe). Les comptes actuels sont donc, de fait, des « profils élèves » sans
   connexion.
3. **`niveau_titre` est déjà un code latin** (`debutant`) : la convention
   « codes latins traduits à l'affichage » est donc **déjà en place**, on la
   généralise.
4. **Types d'`id` hétérogènes** : `dv_users.id` est un UUID, mais `dv_progress`
   et `dv_analytics` utilisent un `id` INT auto-incrément avec `user_id` en UUID.
   Les nouvelles tables suivront le standard **UUID** pour les `id`.

## 6. Procédure de re-vérification (à exécuter par Dhia avant migration)

Dans phpMyAdmin, onglet **SQL** de la base, exécuter en lecture seule :

```sql
-- Volumétrie réelle au moment M
SELECT 'dv_users' AS t, COUNT(*) AS n FROM dv_users
UNION ALL SELECT 'dv_progress', COUNT(*) FROM dv_progress
UNION ALL SELECT 'dv_analytics', COUNT(*) FROM dv_analytics;

-- Structure réelle au moment M (à comparer avec ce document)
SHOW CREATE TABLE dv_users;
SHOW CREATE TABLE dv_progress;
SHOW CREATE TABLE dv_analytics;
```

Le résultat doit être **archivé** (copie d'écran ou export) : c'est la référence
« avant migration » qui servira au contrôle de retour arrière (doc 04).
