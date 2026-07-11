<?php
/**
 * Affecter un professeur à une classe (point 1 : plusieurs profs par classe).
 * Réservé au prof principal de la classe ou à l'admin.
 * POST JSON : { classe_id, professeur_id, matiere_code?, principal? }
 */

declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/util.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/authz.php';
require __DIR__ . '/audit.php';

require_method('POST');
$me = require_role('prof', 'admin');

$in       = json_input();
$classeId = clean_str($in['classe_id'] ?? '', 36);
$profId   = clean_str($in['professeur_id'] ?? '', 36);
$matiere  = clean_str($in['matiere_code'] ?? 'MATHEMATIQUES', 30);
$principal = !empty($in['principal']) ? 1 : 0;
if ($classeId === '' || $profId === '') json_response(['ok' => false, 'error' => "Classe et professeur requis."], 422);

require_can($me, 'classe.assign_teacher', ['classe_id' => $classeId]);

// La cible doit être un professeur actif.
$s = db()->prepare('SELECT role FROM dv_users WHERE id = ? AND statut = "actif" AND deleted_at IS NULL');
$s->execute([$profId]);
if ($s->fetchColumn() !== 'prof') {
    json_response(['ok' => false, 'error' => "Le compte cible n'est pas un professeur actif."], 422);
}

try {
    db()->prepare('INSERT INTO dv_classe_professeur (id, classe_id, professeur_id, matiere_code, est_professeur_principal, role_dans_classe, date_debut, statut) VALUES (?, ?, ?, ?, ?, "titulaire", ?, "actif")')
        ->execute([uuid4(), $classeId, $profId, $matiere, $principal, date('Y-m-d')]);
} catch (Throwable $e) {
    json_response(['ok' => false, 'error' => "Ce professeur est déjà affecté à cette classe pour cette matière."], 409);
}

journaliser('classe.assign_teacher', 'classe', $classeId, ['professeur_id' => $profId, 'matiere' => $matiere]);
json_response(['ok' => true]);
