# 07 — Phases et sous-étapes

Découpage **accepté par Dhia**, avec la Phase 1 elle-même découpée en étapes.
Chaque étape n'est close que si ses **tests** passent (doc 05) et que la
**non-régression** de l'existant reste verte.

## Vue d'ensemble

| Phase | Contenu | Tables clés |
|---|---|---|
| **1** | Comptes, authentification, rôles, établissements, années, classes, associations | `dv_users`+, `dv_etablissements`, `dv_annees_scolaires`, `dv_niveaux`, `dv_matieres`, `dv_classes`, `dv_classe_professeur`, `dv_classe_eleve`, `dv_parent_eleve(_invitations)`, `dv_audit_logs` |
| **2** | Devoirs, affectations, remises, corrections, résultats | `dv_devoirs`, `dv_devoir_affectations`, `dv_devoir_resultats` |
| **3** | Documents, recommandations, messagerie | `dv_documents`, `dv_recommandations`, `dv_messages` |

## Phase 1 — sous-étapes (ordre imposé)

1. **Audit exact de la base existante** — *fait* (doc 01), à re-confirmer au moment M.
2. **Schéma final & scripts de migration** — *fait* (docs 02, 04). ⛔ En attente
   de validation de Dhia avant exécution.
3. **Authentification** — inscription parent/prof, connexion, déconnexion,
   session, changement/réinitialisation de mot de passe. Tests B.
4. **Rôles & autorisations** — `authz.php` + matrice (doc 03) + journal d'audit
   (`audit.php`). Tests C, F.
5. **Établissements & années scolaires** — référentiels + CRUD admin.
6. **Classes & inscriptions** — création de classes, affectation multi-profs,
   inscriptions historisées. Tests D.
7. **Association parent–élève** — invitations sécurisées, acceptation,
   révocation. Tests E.
8. **Tests d'ensemble** — rejeu complet A→G + non-régression.
9. **Activation progressive** — mise en service sans casser les comptes actuels
   (les anciens profils élèves restent fonctionnels, deviennent « connectables »
   au fur et à mesure).

## Portes de validation (rien ne franchit sans accord)

- 🔒 **Porte 1 — Base de données :** Dhia valide docs 01–04 → autorise l'exécution
  de la migration (après sauvegarde).
- 🔒 **Porte 2 — Développement :** le propriétaire du projet donne « séparément »
  l'autorisation de coder (comme demandé).
- 🔒 **Porte 3 — Mise en service :** après tests verts, activation progressive.

## État actuel

> **Nous sommes AVANT la Porte 1.** Le présent dossier est la mise à jour
> demandée. **Aucun code applicatif n'est écrit, aucune table n'est modifiée.**
> Prochaine action attendue : **retour de Dhia** sur les docs 01–04.
