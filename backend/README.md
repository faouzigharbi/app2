# Backend Devoirati — guide de mise en ligne

Ce dossier contient le « moteur » PHP de la plateforme : comptes, connexion
sécurisée, enregistrement des scores et gamification (XP, niveaux, séries, badges).

> **Rappel important**
> La base n'accepte pas l'arabe : on stocke des **codes en lettres latines**
> (`debutant`, `fractions`…) et le code les **traduit en arabe à l'affichage**
> (voir `labels.php`). On ne stocke jamais d'arabe dans la base.

## Étape 1 — Préparer la base (à faire par Dhia)

Dans phpMyAdmin, onglet **SQL**, exécuter la **Partie 2** de `../db/schema.sql`
(les commandes `ALTER TABLE`). Elles **ajoutent** les colonnes des comptes
(`role`, `login`, `email`, `password_hash`, `parent_id`, `classe`) **sans rien
effacer**.

## Étape 2 — Déposer les fichiers sur l'hébergement

Copier le dossier `backend/` dans `public_html/` (via le gestionnaire de
fichiers du panneau d'hébergement, ou par FTP). On obtient par exemple :

```
public_html/
├── backend/
│   ├── db.php, labels.php, gamification.php
│   ├── register.php, login.php, logout.php, session.php
│   ├── create_student.php, save_progress.php
│   └── config.php   ← à créer à l'étape 3
└── (les exercices .html)
```

## Étape 3 — Renseigner les identifiants de la base

1. Copier `config.sample.php` en `config.php` (dans le même dossier `backend/`).
2. Ouvrir `config.php` et remplacer par les vrais identifiants de la base
   (`db_user`, `db_pass`, et `db_name` = `iusp6955_faouzigharbi`).
3. Mettre une longue valeur au hasard dans `app_secret`.

> `config.php` n'est **pas** envoyé sur GitHub (voir `.gitignore`) : les
> identifiants restent privés, uniquement sur le serveur.

## Étape 4 — Vérifier

Ouvrir dans un navigateur : `https://TON-SITE/backend/session.php`
→ doit afficher `{"ok":true,"connecte":false,"user":null}`.
Si tu vois une erreur « config.php manquant » ou « Connexion à la base
impossible », c'est que l'étape 3 n'est pas bonne.

## Les API disponibles

| Fichier | Méthode | Rôle |
|---|---|---|
| `register.php` | POST | Inscription parent/prof (e-mail + mot de passe) |
| `login.php` | POST | Connexion (e-mail ou identifiant + mot de passe) |
| `logout.php` | POST | Déconnexion |
| `session.php` | GET | Qui est connecté ? |
| `create_student.php` | POST | Un prof/parent crée un compte élève |
| `save_progress.php` | POST | Enregistre un résultat + XP/niveau/série/badges |

Toutes les API échangent du **JSON** et répondent `{ "ok": true/false, ... }`.

## Sécurité

- Mots de passe **hachés** (`password_hash`), jamais stockés en clair.
- Requêtes **préparées** partout (protège des injections SQL).
- Sessions par cookie `HttpOnly`. **Active le cookie `secure`** (une ligne à
  décommenter dans `db.php`) une fois le site en **HTTPS**.
