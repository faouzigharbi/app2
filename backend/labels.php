<?php
/**
 * Traductions "code -> texte affiché".
 *
 * Rappel : la base de données ne stocke que des CODES en lettres latines
 * (ex. 'debutant', 'fractions'). C'est ici qu'on les traduit en arabe / français
 * pour l'affichage. On ne stocke jamais d'arabe dans la base.
 */

declare(strict_types=1);

/** Titres de niveau : code -> libellés. */
const DV_NIVEAU_TITRES = [
    'debutant'      => ['ar' => 'مبتدئ',   'fr' => 'Débutant'],
    'intermediaire' => ['ar' => 'متوسط',   'fr' => 'Intermédiaire'],
    'avance'        => ['ar' => 'متقدّم',   'fr' => 'Avancé'],
    'expert'        => ['ar' => 'خبير',    'fr' => 'Expert'],
];

/** Thèmes / chapitres : code -> libellés. */
const DV_THEMES = [
    'fractions'  => ['ar' => 'الكسور',  'fr' => 'Fractions'],
    'puissances' => ['ar' => 'القوى',   'fr' => 'Puissances'],
];

/** Rôles : code -> libellés. */
const DV_ROLES = [
    'eleve'  => ['ar' => 'تلميذ',  'fr' => 'Élève'],
    'parent' => ['ar' => 'ولي',    'fr' => 'Parent'],
    'prof'   => ['ar' => 'أستاذ',  'fr' => 'Professeur'],
    'admin'  => ['ar' => 'مدير',   'fr' => 'Administrateur'],
];

/**
 * Traduit un code dans la langue voulue ; renvoie le code lui-même si inconnu.
 */
function label(array $table, ?string $code, string $lang = 'ar'): string
{
    if ($code !== null && isset($table[$code][$lang])) {
        return $table[$code][$lang];
    }
    return (string) $code;
}
