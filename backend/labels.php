<?php
/**
 * Traductions "code -> texte affiché".
 * La base ne stocke que des CODES latins ; la traduction en arabe/français
 * se fait ICI, à l'affichage. On ne stocke jamais d'arabe en base.
 */

declare(strict_types=1);

const DV_NIVEAU_TITRES = [
    'debutant'      => ['ar' => 'مبتدئ',  'fr' => 'Débutant'],
    'intermediaire' => ['ar' => 'متوسط',  'fr' => 'Intermédiaire'],
    'avance'        => ['ar' => 'متقدّم',  'fr' => 'Avancé'],
    'expert'        => ['ar' => 'خبير',   'fr' => 'Expert'],
];

const DV_ROLES = [
    'eleve'  => ['ar' => 'تلميذ', 'fr' => 'Élève'],
    'parent' => ['ar' => 'ولي',   'fr' => 'Parent'],
    'prof'   => ['ar' => 'أستاذ', 'fr' => 'Professeur'],
    'admin'  => ['ar' => 'مدير',  'fr' => 'Administrateur'],
];

// Niveaux scolaires (codes stables) — point 4.
const DV_NIVEAUX = [
    '7EME' => ['ar' => 'السابعة', 'fr' => '7ᵉ'],
    '8EME' => ['ar' => 'الثامنة', 'fr' => '8ᵉ'],
    '9EME' => ['ar' => 'التاسعة', 'fr' => '9ᵉ'],
];

const DV_MATIERES = [
    'MATHEMATIQUES' => ['ar' => 'الرياضيات', 'fr' => 'Mathématiques'],
];

// Type de relation parent-élève — point 7.
const DV_RELATIONS = [
    'pere'   => ['ar' => 'الأب',   'fr' => 'Père'],
    'mere'   => ['ar' => 'الأم',   'fr' => 'Mère'],
    'tuteur' => ['ar' => 'الوصي',  'fr' => 'Tuteur'],
    'autre'  => ['ar' => 'آخر',    'fr' => 'Autre responsable'],
];

const DV_STATUTS = [
    'actif'     => ['ar' => 'نشط',    'fr' => 'Actif'],
    'suspendu'  => ['ar' => 'موقوف',  'fr' => 'Suspendu'],
    'archive'   => ['ar' => 'مؤرشف',  'fr' => 'Archivé'],
    'inscrit'   => ['ar' => 'مسجّل',  'fr' => 'Inscrit'],
    'sorti'     => ['ar' => 'خرج',    'fr' => 'Sorti'],
];

/** Traduit un code ; renvoie le code si inconnu. */
function label(array $table, ?string $code, string $lang = 'ar'): string
{
    if ($code !== null && isset($table[$code][$lang])) {
        return $table[$code][$lang];
    }
    return (string) $code;
}
