# 06 — Liste précise des fichiers (Phase 1)

Fichiers qui seront **créés** ou **modifiés** quand l'autorisation de coder sera
donnée. Rien de cette liste n'est écrit pour l'instant (hormis les fichiers de
planification et le prototype déjà marqué « non déployable »).

Convention : `backend/` = API PHP (PDO) ; `app/` = pages front (HTML/JS) ;
`db/` = scripts SQL de migration.

## Base de données
| Fichier | Action | Contenu |
|---|---|---|
| `db/migrations/2026xx_phase1_up.sql` | créer | Script additif (doc 04 §3) |
| `db/migrations/2026xx_phase1_down.sql` | créer | Rollback niveau A (doc 04 §5) |
| `db/schema.sql` | remplacer | Référence lisible du schéma final |

## Socle backend (commun)
| Fichier | Action | Rôle |
|---|---|---|
| `backend/config.sample.php` | modifier | + `app_secret`, sans identifiants réels |
| `backend/db.php` | modifier | PDO, session, JSON, `uuid4()`, helpers |
| `backend/labels.php` | modifier | Codes → arabe/français (+ niveaux, matières, relations, statuts) |
| `backend/auth.php` | créer | `current_user()`, `require_user()`, `require_role()` |
| `backend/authz.php` | créer | `autoriser($acteur,$action,$cible)` + règles de périmètre (doc 03) |
| `backend/audit.php` | créer | `journaliser($action,$cible,$details)` → `dv_audit_logs` |
| `backend/util.php` | créer | Génération de codes aléatoires, hash de code, validation |

## API — Authentification & comptes
| Fichier | Action | Rôle |
|---|---|---|
| `backend/register.php` | modifier | Inscription **parent/prof** (e-mail + mot de passe) |
| `backend/login.php` | modifier | Connexion (login **ou** e-mail) + mot de passe |
| `backend/logout.php` | modifier | Déconnexion |
| `backend/session.php` | modifier | Qui suis-je (rôle, périmètre) |
| `backend/password_change.php` | créer | Changer **son** mot de passe (gère `must_change_password`) |
| `backend/password_reset.php` | créer | Réinitialisation par prof/parent/admin autorisé |

## API — Élèves, classes, inscriptions
| Fichier | Action | Rôle |
|---|---|---|
| `backend/students_create.php` | créer | Création d'un élève par prof/parent (avec `created_by_user_id`) |
| `backend/students_update.php` | créer | Modifier un élève (contrôle de périmètre) |
| `backend/classes_create.php` | créer | Créer une classe (année + niveau + établissement) |
| `backend/classes_teachers.php` | créer | Affecter/retirer des profs (`dv_classe_professeur`) |
| `backend/enrollments.php` | créer | Inscrire/retirer un élève (historisé) |

## API — Lecture pour les tableaux de bord
| Fichier | Action | Rôle |
|---|---|---|
| `backend/my_classes.php` | créé | Classes du prof (+ nb élèves) |
| `backend/class_students.php` | créé | Élèves d'une classe |
| `backend/my_children.php` | créé | Enfants associés d'un parent |
| `backend/student_overview.php` | créé | Synthèse d'un élève (gamification, stats, activité) |
| `backend/admin_overview.php` | créé | Compteurs + journal d'audit (admin) |

## API — Association parent–élève
| Fichier | Action | Rôle |
|---|---|---|
| `backend/parent_invite_create.php` | créer | Générer un code (hashé, expirable, révocable) |
| `backend/parent_invite_accept.php` | créer | Le parent utilise un code → association validée |
| `backend/parent_invite_revoke.php` | créer | Révoquer un code / une association |

## Référentiels (admin)
| Fichier | Action | Rôle |
|---|---|---|
| `backend/etablissements.php` | créer | CRUD établissements (admin) |
| `backend/annees_scolaires.php` | créer | CRUD années scolaires (admin) |

## Pages front (Phase 1)
| Fichier | Action | Rôle |
|---|---|---|
| `app/login.html` | créer | Connexion (élève / parent / prof) |
| `app/inscription.html` | créer | Inscription parent/prof |
| `app/changer-mot-de-passe.html` | créer | Changement obligatoire / volontaire |
| `app/prof/tableau-de-bord.html` | créer | Vue prof (classes, élèves, création de comptes) |
| `app/parent/tableau-de-bord.html` | créer | Vue parent (enfants associés, code d'association) |
| `app/eleve/tableau-de-bord.html` | créer | Vue élève (gamification, progression) — d'après la maquette |
| `app/admin/tableau-de-bord.html` | créer | Vue admin (établissements, années, comptes, audit) |
| `app/assets/devoirati.css` | créer | Styles communs (repris de la maquette) |
| `app/assets/devoirati.js` | créer | Appels API, gestion de session, i18n arabe |

## Documentation
| Fichier | Action | Rôle |
|---|---|---|
| `backend/README.md` | modifier | Déploiement, à jour du schéma validé |
| `docs/*` | maintenir | Ce dossier de planification |

> **Estimation** : ~30 fichiers pour la Phase 1. Chaque sous-étape (doc 07) livre
> un sous-ensemble cohérent, testé (doc 05) avant de passer à la suivante.
