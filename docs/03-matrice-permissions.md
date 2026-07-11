# 03 — Matrice des autorisations (points 6 & 11)

> **Principe non négociable :** tous les contrôles sont réalisés **côté serveur**,
> à chaque requête d'API. Masquer un bouton dans l'interface **ne compte pas**
> comme une protection.

## Légende
- ✅ autorisé — ❌ interdit — 🟡 autorisé **sous condition de périmètre** (voir règles)
- « périmètre » = les données que le rôle a le droit de voir/modifier.

## Matrice par action

| Action | Admin | Professeur | Parent | Élève |
|---|:---:|:---:|:---:|:---:|
| Créer un établissement / année scolaire | ✅ | ❌ | ❌ | ❌ |
| Créer une classe | ✅ | 🟡 (ses classes) | ❌ | ❌ |
| Affecter un prof à une classe | ✅ | 🟡 (si prof principal) | ❌ | ❌ |
| Créer un compte **élève** | ✅ | 🟡 (dans ses classes) | 🟡 (son enfant) | ❌ |
| Créer un compte **parent/prof** | ✅ | ❌ | ❌ | ❌ |
| Modifier un élève | ✅ | 🟡 (élève de ses classes) | 🟡 (enfant associé) | 🟡 (son profil limité) |
| Inscrire/retirer un élève d'une classe | ✅ | 🟡 (ses classes) | ❌ | ❌ |
| Réinitialiser le mot de passe d'un élève | ✅ | 🟡 (ses élèves) | 🟡 (enfant associé) | ❌ |
| Changer **son propre** mot de passe | ✅ | ✅ | ✅ | ✅ |
| Générer un code d'association parent | ✅ | 🟡 (ses élèves) | 🟡 (son enfant) | ❌ |
| Utiliser un code d'association | ❌ | ❌ | ✅ | ❌ |
| Révoquer une association parent–élève | ✅ | 🟡 (ses élèves) | 🟡 (la sienne) | ❌ |
| Consulter la progression d'un élève | ✅ | 🟡 (ses élèves) | 🟡 (enfant associé) | 🟡 (la sienne) |
| Faire un exercice / enregistrer un score | ❌ | ❌ | ❌ | ✅ |
| Créer / publier un devoir *(Phase 2)* | ✅ | 🟡 (ses classes) | ❌ | ❌ |
| Rendre un devoir *(Phase 2)* | ❌ | ❌ | ❌ | 🟡 (si affecté) |
| Corriger / noter un devoir *(Phase 2)* | ✅ | 🟡 (ses classes) | ❌ | ❌ |
| Déposer un document *(Phase 3)* | ✅ | 🟡 (ses classes) | ❌ | ❌ |
| Envoyer un message *(Phase 3)* | ✅ | 🟡 | 🟡 | 🟡 (encadré) |
| Suspendre / archiver un compte | ✅ | ❌ | ❌ | ❌ |
| Changer un rôle | ✅ | ❌ | ❌ | ❌ |
| Consulter le journal d'audit | ✅ | ❌ | ❌ | ❌ |

## Règles de périmètre (à appliquer côté serveur)

1. **Professeur** : n'agit que sur les **classes où il est affecté**
   (`dv_classe_professeur.statut='actif'`) et sur les **élèves inscrits** à ces
   classes (`dv_classe_eleve.statut='inscrit'`). *Un prof ne peut pas modifier un
   élève d'une classe qu'il ne gère pas* (point 6).
2. **Parent** : n'accède qu'aux enfants pour lesquels il existe une association
   **validée** dans `dv_parent_eleve` (`statut='actif'`). *Aucun accès à un
   enfant non associé officiellement* (point 6).
3. **Élève** : accède uniquement à **ses** données (profil limité, sa
   progression, ses devoirs affectés). Ne voit jamais les autres élèves.
4. **Admin** : accès complet, mais **toute action sensible est journalisée**
   (`dv_audit_logs`, point 12).

## Mise en œuvre technique (prévue, non codée)

- Une fonction serveur unique `autoriser($acteur, $action, $cible)` centralise
  les vérifications ; **chaque endpoint l'appelle** avant d'agir.
- Les vérifications de périmètre s'appuient sur des requêtes SQL (`EXISTS …`)
  sur `dv_classe_professeur`, `dv_classe_eleve`, `dv_parent_eleve`.
- Toute violation renvoie **403** et est journalisée.
