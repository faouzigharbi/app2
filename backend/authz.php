<?php
/**
 * Autorisations (points 6 & 11) — appliquées CÔTÉ SERVEUR.
 * Aucune action sensible ne s'exécute sans passer par require_can().
 *
 * Requiert db.php, auth.php.
 */

declare(strict_types=1);

/* ------------------------- Vérifications de périmètre ------------------------- */

/** Le prof est-il affecté (actif) à cette classe ? */
function prof_manages_classe(string $profId, string $classeId): bool
{
    $s = db()->prepare(
        'SELECT 1 FROM dv_classe_professeur
         WHERE professeur_id = ? AND classe_id = ? AND statut = "actif" LIMIT 1'
    );
    $s->execute([$profId, $classeId]);
    return (bool) $s->fetchColumn();
}

/** Le prof gère-t-il cet élève (via une classe qu'il encadre) ? */
function prof_manages_eleve(string $profId, string $eleveId): bool
{
    $s = db()->prepare(
        'SELECT 1
           FROM dv_classe_eleve ce
           JOIN dv_classe_professeur cp ON cp.classe_id = ce.classe_id
          WHERE ce.eleve_id = ? AND cp.professeur_id = ?
            AND ce.statut = "inscrit" AND cp.statut = "actif"
          LIMIT 1'
    );
    $s->execute([$eleveId, $profId]);
    return (bool) $s->fetchColumn();
}

/** Le parent est-il officiellement associé à cet élève ? */
function parent_of(string $parentId, string $eleveId): bool
{
    $s = db()->prepare(
        'SELECT 1 FROM dv_parent_eleve
         WHERE parent_id = ? AND eleve_id = ? AND statut = "actif" LIMIT 1'
    );
    $s->execute([$parentId, $eleveId]);
    return (bool) $s->fetchColumn();
}

/* ------------------------------ Décision d'accès ------------------------------ */

/**
 * Renvoie true si $user peut réaliser $action dans le contexte $ctx.
 * $ctx peut contenir : eleve_id, classe_id, target_user_id.
 */
function can(array $user, string $action, array $ctx = []): bool
{
    $role    = $user['role'];
    $isAdmin = $role === 'admin';
    if ($isAdmin) return true;   // l'admin peut tout (mais tout est journalisé)

    $eleveId  = $ctx['eleve_id']  ?? ($ctx['target_user_id'] ?? null);
    $classeId = $ctx['classe_id'] ?? null;

    switch ($action) {
        // Réservé à l'administrateur
        case 'etablissement.manage':
        case 'annee.manage':
        case 'staff.create':          // créer un compte parent/prof
        case 'role.change':
        case 'account.suspend':
        case 'audit.read':
            return false;

        case 'classe.create':
            return $role === 'prof';

        case 'classe.assign_teacher':
        case 'enrollment.manage':
            return $role === 'prof' && $classeId !== null && prof_manages_classe($user['id'], $classeId);

        case 'student.create':
            if ($role === 'prof')   return $classeId !== null && prof_manages_classe($user['id'], $classeId);
            if ($role === 'parent') return true;   // le parent crée son enfant (association immédiate)
            return false;

        case 'student.update':
        case 'password.reset':
        case 'parent.invite_create':
        case 'parent.invite_revoke':
        case 'progress.read':
            if ($eleveId === null) return false;
            if ($role === 'prof')   return prof_manages_eleve($user['id'], $eleveId);
            if ($role === 'parent') return parent_of($user['id'], $eleveId);
            if ($role === 'eleve' && $action === 'progress.read') return $user['id'] === $eleveId;
            return false;

        case 'parent.invite_accept':
            return $role === 'parent';

        case 'password.change_self':
            return true;   // tout utilisateur connecté change son propre mot de passe

        case 'progress.write':
            return $role === 'eleve' && $user['id'] === $eleveId;

        default:
            return false;   // refus par défaut
    }
}

/**
 * Exige l'autorisation ; sinon 403 + journalisation de la tentative.
 */
function require_can(array $user, string $action, array $ctx = []): void
{
    if (!can($user, $action, $ctx)) {
        if (function_exists('journaliser')) {
            journaliser('authz.denied', $ctx['cible_type'] ?? null,
                $ctx['eleve_id'] ?? ($ctx['classe_id'] ?? null),
                ['action' => $action], $user['id']);
        }
        json_response(['ok' => false, 'error' => "Action non autorisée."], 403);
    }
}
