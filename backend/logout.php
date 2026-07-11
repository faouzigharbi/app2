<?php
/** Déconnexion. POST (sans corps). */

declare(strict_types=1);
require __DIR__ . '/db.php';
require __DIR__ . '/auth.php';

require_method('POST');
logout_user();
json_response(['ok' => true]);
