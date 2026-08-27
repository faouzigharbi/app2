<?php
/**
 * Devoirati — injection automatique de l'historique.
 *
 * Ce fichier est ajoute a la fin de CHAQUE page servie, via la directive
 * auto_append_file (voir INSTALLATION.md). Il n'ecrit rien, ne lit aucune
 * base : il ajoute seulement la balise <script>. Les 50 000 pages HTML
 * existantes restent donc totalement inchangees.
 */

// On n'injecte que dans du HTML : ni images, ni CSS, ni JSON.
$html = false;
foreach (headers_list() as $h) {
    if (stripos($h, 'content-type:') === 0) {
        $html = (stripos($h, 'text/html') !== false);
        break;
    }
}
if (!$html && !headers_sent()) {
    // Aucun Content-Type explicite : PHP sert du text/html par defaut.
    $html = true;
}
if (!$html) return;

?>
<link rel="manifest" href="/manifest.json">
<script src="/devoirati-histo.js" defer></script>
