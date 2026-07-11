# 02 — Dictionnaire de données complet

> **⚠️ PROJET — Le SQL ci-dessous est une SPÉCIFICATION à valider. Rien ne doit
> être exécuté avant validation de Dhia et sauvegarde complète (doc 04).**

Conventions : `id` = `VARCHAR(36)` (UUID) ; horodatages `created_at` /
`updated_at` = `DATETIME` ; suppression logique via `statut` + `archived_at` /
`deleted_at` ; toutes les valeurs « métier » sont des **codes latins** traduits
à l'affichage. Moteur InnoDB, `CHARSET=latin1` (existant conservé).

Codes de `statut` génériques : `actif` · `suspendu` · `archive` (+ `supprime`
logique via `deleted_at`).

---

## A. Référentiels (Phase 1)

### `dv_etablissements` — *(nouvelle, point 3)*
| Colonne | Type | Contrainte / Notes |
|---|---|---|
| `id` | VARCHAR(36) | **PK** |
| `nom` | VARCHAR(150) | NOT NULL |
| `code` | VARCHAR(30) | **UNIQUE** |
| `ville` | VARCHAR(80) | NULL |
| `pays` | VARCHAR(2) | code ISO (`TN`, `MA`…) |
| `statut` | VARCHAR(20) | `actif` par défaut |
| `created_at` `updated_at` | DATETIME | |
| `archived_at` | DATETIME | NULL |

**Index** : `UNIQUE(code)`.

### `dv_annees_scolaires` — *(nouvelle, point 2)*
| Colonne | Type | Contrainte / Notes |
|---|---|---|
| `id` | VARCHAR(36) | **PK** |
| `etablissement_id` | VARCHAR(36) | **FK** → `dv_etablissements(id)` (NULL = global) |
| `libelle` | VARCHAR(20) | ex. `2025-2026` |
| `date_debut` | DATE | |
| `date_fin` | DATE | |
| `active` | TINYINT(1) | 1 = année en cours |
| `created_at` | DATETIME | |

**Index** : `UNIQUE(etablissement_id, libelle)`, `KEY(active)`.

### `dv_niveaux` — *(nouvelle, point 4)*
| Colonne | Type | Contrainte / Notes |
|---|---|---|
| `code` | VARCHAR(20) | **PK** — `7EME`, `8EME`, `9EME` |
| `ordre` | INT | tri d'affichage |
| `actif` | TINYINT(1) | 1 |

> Libellés arabes (`السابعة`…) gérés dans `backend/labels.php`, jamais en base.

### `dv_matieres` — *(nouvelle, point 4)*
| Colonne | Type | Contrainte / Notes |
|---|---|---|
| `code` | VARCHAR(30) | **PK** — `MATHEMATIQUES` (seule active au départ) |
| `actif` | TINYINT(1) | 1 |

---

## B. Comptes & identités (Phase 1)

### `dv_users` — *(existante, ÉTENDUE — points 5, 6, 13, 14)*

Colonnes **existantes conservées** : `id`, `nom`, `annee`, `xp`, `niveau`,
`niveau_titre`, `xp_next_level`, `streak`, `last_streak_date`, `badges`,
`created_at`, `last_seen`, `updated_at` (voir doc 01).

Colonnes **ajoutées** (additif) :

| Colonne | Type | Contrainte / Notes |
|---|---|---|
| `role` | VARCHAR(20) | `eleve`·`parent`·`prof`·`admin` — défaut `eleve` |
| `prenom` | VARCHAR(80) | NULL (point 14 : minimal) |
| `login` | VARCHAR(60) | **UNIQUE** (identifiant de connexion) |
| `email` | VARCHAR(190) | **UNIQUE**, NULL (facultatif pour l'élève) |
| `password_hash` | VARCHAR(255) | hash uniquement, **jamais en clair** |
| `must_change_password` | TINYINT(1) | 1 = doit changer à la 1ʳᵉ connexion |
| `statut` | VARCHAR(20) | `actif`·`suspendu`·`archive` |
| `etablissement_id` | VARCHAR(36) | **FK** → `dv_etablissements(id)`, NULL |
| `niveau_code` | VARCHAR(20) | **FK** → `dv_niveaux(code)`, NULL (élève) |
| `code_association` | VARCHAR(64) | NULL — *voir note ci-dessous* |
| `created_by_user_id` | VARCHAR(36) | **FK** → `dv_users(id)` (qui a créé ce compte, point 6) |
| `archived_at` | DATETIME | NULL |
| `deleted_at` | DATETIME | NULL (suppression logique) |

> **Note point 7** : le `code_association` en clair n'est **pas** conservé ici.
> Les codes vivent dans `dv_parent_eleve_invitations` (hashés). On garde
> éventuellement sur l'élève un simple drapeau/état, pas le secret.

**Index & unicité** : `UNIQUE(login)`, `UNIQUE(email)`, `KEY(role)`,
`KEY(statut)`, `KEY(etablissement_id)`, `KEY(created_by_user_id)`,
`KEY(niveau_code)`.

**Données personnelles (point 14)** — pour un élève, on ne rend obligatoires que :
`nom`, `prenom`, `login`, `niveau_code`, (classe via inscription), `statut`.
`email`, date de naissance, téléphone, adresse : **non stockés / non obligatoires**.

> Les rôles sont un **code** ; la sécurité réelle repose sur la **matrice de
> permissions** appliquée **côté serveur** (doc 03), pas sur cette colonne seule.

---

## C. Structure scolaire (Phase 1)

### `dv_classes` — *(nouvelle)*
| Colonne | Type | Contrainte / Notes |
|---|---|---|
| `id` | VARCHAR(36) | **PK** |
| `nom` | VARCHAR(60) | ex. `1AC-B` |
| `niveau_code` | VARCHAR(20) | **FK** → `dv_niveaux(code)` |
| `etablissement_id` | VARCHAR(36) | **FK** → `dv_etablissements(id)` |
| `annee_scolaire_id` | VARCHAR(36) | **FK** → `dv_annees_scolaires(id)` |
| `statut` | VARCHAR(20) | `actif`·`archive` |
| `created_by_user_id` | VARCHAR(36) | **FK** → `dv_users(id)` |
| `created_at` `updated_at` | DATETIME | |
| `archived_at` | DATETIME | NULL |

**Index** : `UNIQUE(etablissement_id, annee_scolaire_id, nom)`,
`KEY(niveau_code)`, `KEY(annee_scolaire_id)`.

### `dv_classe_professeur` — *(nouvelle, point 1 — plusieurs profs par classe)*
| Colonne | Type | Contrainte / Notes |
|---|---|---|
| `id` | VARCHAR(36) | **PK** |
| `classe_id` | VARCHAR(36) | **FK** → `dv_classes(id)` |
| `professeur_id` | VARCHAR(36) | **FK** → `dv_users(id)` |
| `matiere_code` | VARCHAR(30) | **FK** → `dv_matieres(code)` |
| `est_professeur_principal` | TINYINT(1) | 0/1 |
| `role_dans_classe` | VARCHAR(30) | code (`titulaire`, `remplacant`…) |
| `date_debut` | DATE | |
| `date_fin` | DATE | NULL |
| `statut` | VARCHAR(20) | `actif`·`archive` |

**Index** : `UNIQUE(classe_id, professeur_id, matiere_code)`,
`KEY(professeur_id)`. Relation **N↔N** classe ↔ prof (un prof gère plusieurs
classes, une classe a plusieurs profs).

### `dv_classe_eleve` — *(nouvelle, point 8 — inscription historisée)*
| Colonne | Type | Contrainte / Notes |
|---|---|---|
| `id` | VARCHAR(36) | **PK** |
| `classe_id` | VARCHAR(36) | **FK** → `dv_classes(id)` |
| `eleve_id` | VARCHAR(36) | **FK** → `dv_users(id)` |
| `annee_scolaire_id` | VARCHAR(36) | **FK** → `dv_annees_scolaires(id)` |
| `date_inscription` | DATE | |
| `date_sortie` | DATE | NULL |
| `statut` | VARCHAR(20) | `inscrit`·`sorti`·`archive` |
| `created_by_user_id` | VARCHAR(36) | **FK** → `dv_users(id)` |

**Index** : `UNIQUE(classe_id, eleve_id, annee_scolaire_id)`, `KEY(eleve_id)`.
**On ne supprime jamais** une inscription : on renseigne `date_sortie` + `statut`.

---

## D. Association parent–élève (Phase 1, point 7)

### `dv_parent_eleve_invitations` — *(nouvelle)* — les **codes/invitations**
| Colonne | Type | Contrainte / Notes |
|---|---|---|
| `id` | VARCHAR(36) | **PK** |
| `eleve_id` | VARCHAR(36) | **FK** → `dv_users(id)` |
| `code_hash` | VARCHAR(255) | **hash** du code (jamais en clair) |
| `relation` | VARCHAR(20) | `pere`·`mere`·`tuteur`·`autre` (code) |
| `created_by_user_id` | VARCHAR(36) | **FK** → `dv_users(id)` (prof/parent/admin émetteur) |
| `expires_at` | DATETIME | durée de validité limitée |
| `max_utilisations` | INT | défaut 1 (usage unique) |
| `utilisations` | INT | 0 |
| `statut` | VARCHAR(20) | `en_attente`·`accepte`·`refuse`·`expire`·`revoque` |
| `accepted_by_parent_id` | VARCHAR(36) | **FK** → `dv_users(id)`, NULL |
| `created_at` `updated_at` | DATETIME | |

**Index** : `KEY(eleve_id)`, `KEY(statut)`, `KEY(expires_at)`.
Le code est **aléatoire**, **hashé**, **à validité limitée**, **révocable** et
son cycle de vie est **journalisé** (statut + `dv_audit_logs`).

### `dv_parent_eleve` — *(nouvelle)* — les **associations validées uniquement**
| Colonne | Type | Contrainte / Notes |
|---|---|---|
| `id` | VARCHAR(36) | **PK** |
| `parent_id` | VARCHAR(36) | **FK** → `dv_users(id)` |
| `eleve_id` | VARCHAR(36) | **FK** → `dv_users(id)` |
| `relation` | VARCHAR(20) | code (`pere`…) |
| `invitation_id` | VARCHAR(36) | **FK** → `dv_parent_eleve_invitations(id)` |
| `statut` | VARCHAR(20) | `actif`·`revoque`·`archive` |
| `validated_at` | DATETIME | |
| `created_at` | DATETIME | |

**Index** : `UNIQUE(parent_id, eleve_id)`, `KEY(eleve_id)`. Relation **N↔N**.

---

## E. Progression & résultats (existant, Phase 1)

- **`dv_progress`** *(existante, inchangée)* — voir doc 01.
- **`dv_analytics`** *(existante, inchangée)* — voir doc 01.

Aucune modification en Phase 1. Si un rattachement à l'année scolaire s'avère
nécessaire plus tard, il se fera de façon **additive** (nouvelle colonne
`annee_scolaire_id` NULL), après validation séparée.

---

## F. Devoirs & résultats (Phase 2, point 9 — spécifié dès maintenant)

### `dv_devoirs` — *(nouvelle)*
| Colonne | Type | Notes |
|---|---|---|
| `id` | VARCHAR(36) | **PK** |
| `auteur_id` | VARCHAR(36) | **FK** → `dv_users(id)` |
| `matiere_code` | VARCHAR(30) | **FK** → `dv_matieres(code)` |
| `titre` | VARCHAR(150) | |
| `consigne` | TEXT | |
| `activite_id` | VARCHAR(200) | exercice lié (option) |
| `bareme` | INT | NULL |
| `tentatives_autorisees` | INT | défaut 1 |
| `type_correction` | VARCHAR(20) | `auto`·`manuelle`·`mixte` (code) |
| `visibilite_reponses` | VARCHAR(20) | code |
| `visibilite_correction` | VARCHAR(20) | code |
| `date_publication` | DATETIME | NULL tant que brouillon |
| `date_limite` | DATETIME | NULL |
| `statut` | VARCHAR(20) | `brouillon`·`publie`·`ferme`·`archive` |
| `created_at` `updated_at` | DATETIME | |
| `archived_at` | DATETIME | NULL |

### `dv_devoir_affectations` — *(nouvelle, point 9 — multi-cibles)*
| Colonne | Type | Notes |
|---|---|---|
| `id` | VARCHAR(36) | **PK** |
| `devoir_id` | VARCHAR(36) | **FK** → `dv_devoirs(id)` |
| `cible_type` | VARCHAR(20) | `classe`·`groupe`·`eleve` (code) |
| `classe_id` | VARCHAR(36) | **FK** → `dv_classes(id)`, NULL |
| `eleve_id` | VARCHAR(36) | **FK** → `dv_users(id)`, NULL |
| `annee_scolaire_id` | VARCHAR(36) | **FK** |
| `created_at` | DATETIME | |

**Index** : `KEY(devoir_id)`, `KEY(classe_id)`, `KEY(eleve_id)`. Permet
d'affecter un devoir à **une ou plusieurs classes**, un **groupe** ou **un élève**.

### `dv_devoir_resultats` — *(nouvelle)*
| Colonne | Type | Notes |
|---|---|---|
| `id` | VARCHAR(36) | **PK** |
| `devoir_id` | VARCHAR(36) | **FK** → `dv_devoirs(id)` |
| `eleve_id` | VARCHAR(36) | **FK** → `dv_users(id)` |
| `tentative_num` | INT | 1..N |
| `etat` | VARCHAR(20) | `a_faire`·`rendu`·`corrige` (code) |
| `score` | VARCHAR(20) | |
| `note` | DECIMAL(5,2) | NULL |
| `feedback` | TEXT | commentaire du correcteur |
| `corrige_par` | VARCHAR(36) | **FK** → `dv_users(id)`, NULL |
| `rendu_le` `corrige_le` | DATETIME | NULL |

**Index** : `UNIQUE(devoir_id, eleve_id, tentative_num)`, `KEY(eleve_id)`.

---

## G. Échanges & ressources (Phase 3, spécifiés en résumé)

- **`dv_documents`** — `id`, `auteur_id` (FK users), `classe_id` (FK, NULL),
  `titre`, `type` (`cours`·`conseil`·`evaluation`·`autre`), `fichier_url`,
  `description`, `statut`, `created_at`, `archived_at`.
- **`dv_messages`** — `id`, `expediteur_id`, `destinataire_id` (FK users),
  `sujet`, `contenu`, `lu` (0/1), `created_at`, `deleted_at`.
- **`dv_recommandations`** — `id`, `eleve_id` (FK users), `theme` (code),
  `texte_code`/`texte`, `source` (`auto`·`prof`), `vue` (0/1), `created_at`.

---

## H. Sécurité & journalisation (Phase 1, point 12)

### `dv_audit_logs` — *(nouvelle)*
| Colonne | Type | Notes |
|---|---|---|
| `id` | VARCHAR(36) | **PK** |
| `acteur_id` | VARCHAR(36) | **FK** → `dv_users(id)`, NULL si système |
| `action` | VARCHAR(50) | code (`user.create`, `password.reset`, `parent.link`, `classe.enroll`, `devoir.publish`, `result.update`…) |
| `cible_type` | VARCHAR(30) | ex. `user`, `classe`, `devoir` |
| `cible_id` | VARCHAR(36) | NULL |
| `details` | TEXT | JSON (avant/après, contexte) |
| `ip` | VARCHAR(45) | |
| `user_agent` | VARCHAR(255) | |
| `created_at` | DATETIME | |

**Index** : `KEY(acteur_id)`, `KEY(action)`, `KEY(cible_type, cible_id)`,
`KEY(created_at)`. Enregistre **toutes les actions sensibles** listées au point 12.

---

## I. Récapitulatif des tables

| Table | État | Phase |
|---|---|---|
| `dv_etablissements` | nouvelle | 1 |
| `dv_annees_scolaires` | nouvelle | 1 |
| `dv_niveaux` | nouvelle | 1 |
| `dv_matieres` | nouvelle | 1 |
| `dv_users` | **étendue** | 1 |
| `dv_classes` | nouvelle | 1 |
| `dv_classe_professeur` | nouvelle | 1 |
| `dv_classe_eleve` | nouvelle | 1 |
| `dv_parent_eleve_invitations` | nouvelle | 1 |
| `dv_parent_eleve` | nouvelle | 1 |
| `dv_audit_logs` | nouvelle | 1 |
| `dv_progress` | existante (inchangée) | 1 |
| `dv_analytics` | existante (inchangée) | 1 |
| `dv_devoirs` | nouvelle | 2 |
| `dv_devoir_affectations` | nouvelle | 2 |
| `dv_devoir_resultats` | nouvelle | 2 |
| `dv_documents` | nouvelle | 3 |
| `dv_messages` | nouvelle | 3 |
| `dv_recommandations` | nouvelle | 3 |

> **Clés étrangères** : à créer avec `ON DELETE RESTRICT` (ou `SET NULL` pour les
> champs « auteur/créateur »), jamais `CASCADE` sur des données pédagogiques —
> cohérent avec la suppression **logique** (point 13).
