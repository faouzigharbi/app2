<?php
/**
 * Journal de sécurité (point 12) : enregistre les actions sensibles dans
 * dv_audit_logs. Toujours appelé APRÈS une action réussie.
 */

declare(strict_types=1);

/**
 * @param string      $action    code (ex. 'user.create', 'password.reset', 'parent.link')
 * @param string|null $cibleType ex. 'user', 'classe', 'devoir'
 * @param string|null $cibleId
 * @param array       $details   contexte (sera stocké en JSON, sans secret)
 * @param string|null $acteurId  auteur ; par défaut l'utilisateur connecté
 */
function journaliser(string $action, ?string $cibleType = null, ?string $cibleId = null, array $details = [], ?string $acteurId = null): void
{
    try {
        if ($acteurId === null && function_exists('current_user')) {
            $u = current_user();
            $acteurId = $u['id'] ?? null;
        }
        $stmt = db()->prepare(
            'INSERT INTO dv_audit_logs (id, acteur_id, action, cible_type, cible_id, details, ip, user_agent, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            uuid4(), $acteurId, $action, $cibleType, $cibleId,
            $details ? json_encode($details, JSON_UNESCAPED_UNICODE) : null,
            $_SERVER['REMOTE_ADDR'] ?? null,
            mb_substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255),
            now(),
        ]);
    } catch (Throwable $e) {
        // La journalisation ne doit jamais casser l'action métier ; on ignore
        // silencieusement une éventuelle erreur d'écriture du journal.
    }
}
