<?php
/**
 * MODÈLE de configuration — À COPIER en "config.php".
 *
 * Étapes :
 *   1. Copie ce fichier et renomme la copie en  config.php
 *   2. Remplace les valeurs ci-dessous par TES identifiants de base de données
 *      (ceux que tu as déjà). NE mets JAMAIS ce fichier sur GitHub.
 *
 * config.php est déjà ignoré par Git (voir .gitignore) : tes identifiants
 * restent privés, uniquement sur ton serveur.
 */

return [
    'db_host' => 'localhost',                 // en général "localhost" sur un hébergement mutualisé
    'db_port' => '3306',
    'db_name' => 'iusp6955_faouzigharbi',     // le nom de ta base
    'db_user' => 'TON_UTILISATEUR_BASE',      // ← à remplacer
    'db_pass' => 'TON_MOT_DE_PASSE_BASE',     // ← à remplacer

    // Clé secrète pour sécuriser les sessions. Mets une longue suite de
    // caractères au hasard (change-la, ne laisse pas celle-ci).
    'app_secret' => 'change-moi-par-une-longue-chaine-aleatoire',
];
