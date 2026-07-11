# 05 — Scénarios de test de la Phase 1

Objectif : prouver que la Phase 1 fonctionne **et** qu'elle ne casse pas
l'existant. Chaque scénario a un résultat attendu vérifiable. Les tests seront
rejoués après chaque sous-étape (doc 07).

## A. Migration & non-régression

| # | Scénario | Attendu |
|---|----------|---------|
| A1 | Compter les lignes des 3 tables avant/après migration | Nombres **identiques** (aucune perte) |
| A2 | Lire un ancien profil élève après migration | Toutes les données d'origine intactes ; `role='eleve'`, `statut='actif'` |
| A3 | Rejouer l'enregistrement d'un score (`dv_progress`, `dv_analytics`) | Fonctionne comme avant la migration |
| A4 | Exécuter le rollback niveau A puis re-migrer | Base revient à l'état initial puis re-migrée sans erreur |

## B. Authentification & mots de passe (points 5, 6)

| # | Scénario | Attendu |
|---|----------|---------|
| B1 | Inscription prof (e-mail + mot de passe) | Compte créé, `password_hash` non vide, **mot de passe absent en clair** |
| B2 | Connexion avec bon mot de passe | Session ouverte |
| B3 | Connexion avec mauvais mot de passe | Refus **401**, message générique |
| B4 | Le hash stocké n'est jamais réversible / jamais renvoyé au client | Aucun champ `password_hash` dans les réponses API |
| B5 | Élève créé avec `must_change_password=1` | À la 1ʳᵉ connexion, changement imposé |
| B6 | Réinitialisation du mot de passe d'un élève par son prof | Nouveau hash, `must_change_password=1`, action journalisée |
| B7 | Réinitialisation tentée par un prof **non** responsable de l'élève | Refus **403** + journal |

## C. Rôles & périmètre (points 6, 11)

| # | Scénario | Attendu |
|---|----------|---------|
| C1 | Prof modifie un élève **de sa** classe | Autorisé |
| C2 | Prof modifie un élève **d'une autre** classe | Refus **403** (contrôle serveur) |
| C3 | Parent consulte **son** enfant associé | Autorisé |
| C4 | Parent consulte un enfant **non associé** | Refus **403** |
| C5 | Élève tente d'accéder aux données d'un autre élève | Refus **403** |
| C6 | Appel API direct (sans passer par l'interface) hors périmètre | Refus **403** (jamais un simple bouton masqué) |

## D. Classes & inscriptions (points 1, 2, 8)

| # | Scénario | Attendu |
|---|----------|---------|
| D1 | Affecter **2 professeurs** à une même classe | Les deux enregistrés dans `dv_classe_professeur` |
| D2 | Un prof gère **plusieurs** classes | Toutes listées |
| D3 | Inscrire un élève sans année scolaire | Refus (année obligatoire) |
| D4 | Changer un élève de classe | Ancienne inscription **conservée** (`date_sortie` + `statut='sorti'`), nouvelle créée |
| D5 | Unicité d'inscription (même classe + même année) | Doublon refusé |

## E. Association parent–élève (point 7)

| # | Scénario | Attendu |
|---|----------|---------|
| E1 | Générer un code d'association | Code **aléatoire**, stocké **hashé**, `expires_at` défini |
| E2 | Utiliser un code valide | Association créée dans `dv_parent_eleve`, invitation `statut='accepte'` |
| E3 | Réutiliser un code à usage unique déjà consommé | Refus |
| E4 | Utiliser un code **expiré** | Refus, invitation `statut='expire'` |
| E5 | Révoquer un code / une association | `statut='revoque'`, accès parent coupé |
| E6 | Deviner un code (force brute) | Rendu impraticable (aléatoire long + expiration + journalisation) |

## F. Journal d'audit (point 12)

| # | Scénario | Attendu |
|---|----------|---------|
| F1 | Créer/suspendre un compte | Ligne dans `dv_audit_logs` (acteur, action, cible, date) |
| F2 | Réinitialiser un mot de passe | Journalisé |
| F3 | Associer un parent à un élève | Journalisé |
| F4 | Inscrire/retirer un élève d'une classe | Journalisé |

## G. Suppression logique (point 13)

| # | Scénario | Attendu |
|---|----------|---------|
| G1 | « Supprimer » un élève | `deleted_at`/`statut='archive'` renseigné, **ligne conservée** |
| G2 | Un compte archivé ne peut plus se connecter | Connexion refusée |
| G3 | Les données pédagogiques restent lisibles pour l'historique | Oui |

## Méthode

- Tests d'API via requêtes HTTP (avec/sans session, avec chaque rôle).
- Jeu de données de démonstration dédié (établissement + année + 1 classe +
  2 profs + 3 élèves + 2 parents), **séparé** des vraies données.
- Chaque sous-étape de la Phase 1 n'est considérée « faite » que si ses tests
  passent **et** que A1–A3 (non-régression) restent verts.
