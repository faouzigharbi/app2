# Format de fichier D2D (`.d2d`) — cartographie

> Application : **D2D 3.3 — هندسة ديناميكية مبسطة** (géométrie dynamique simplifiée)
> Source : `https://devoirati.net/assets/outils/D2D.html`
> Ce document décrit le format de sauvegarde `.d2d` (JSON) tel que déduit de
> fichiers d'exemple réels. Il servira de base à l'intégration de D2D dans les
> fiches d'exercices (préchargement de figures + correction automatique).

## Vue d'ensemble

Un fichier `.d2d` est un document **JSON**. C'est l'équivalent D2D d'un fichier
`.ggb` de GeoGebra : il contient **toute la figure** (points, objets
géométriques) et l'état d'affichage (repère, grille, caméra).

Tout est **relationnel** : les objets géométriques et les points *construits*
référencent d'autres points par leur `id`. C'est ce graphe de dépendances qui
rend la géométrie « dynamique » (déplacer un point mère met à jour tout ce qui
en dépend).

## Structure racine

```json
{
  "format": "D2D",
  "version": 4,
  "savedAt": "2026-07-21T00:56:18.926Z",
  "points": { /* dictionnaire id -> point */ },
  "objects": [ /* tableau d'objets géométriques */ ],
  "pointCounter": 13,
  "showAxes": true,
  "showLabels": true,
  "snapToGrid": false,
  "zoomLevel": 1,
  "viewOffset": { "x": 0, "y": 0 },
  "gridCell": 20
}
```

| Champ          | Type    | Rôle                                                                 |
|----------------|---------|---------------------------------------------------------------------|
| `format`       | string  | Signature du format, toujours `"D2D"`.                              |
| `version`      | number  | Version du format (observée : `4`).                                 |
| `savedAt`      | string  | Date ISO de sauvegarde.                                             |
| `points`       | object  | Dictionnaire `id → point` (voir ci-dessous).                       |
| `objects`      | array   | Liste des figures (segments, cercles, polygones, mesures…).        |
| `pointCounter` | number  | Compteur d'`id` **partagé entre points ET objets** (→ `p1`, `p2`…).|
| `showAxes`     | boolean | Afficher les axes du repère.                                       |
| `showLabels`   | boolean | Afficher les noms (A, B, C…).                                      |
| `snapToGrid`   | boolean | Aimanter à la grille.                                              |
| `gridCell`     | number  | Taille d'un carreau de grille (en unités internes).               |
| `zoomLevel`    | number  | Niveau de zoom de la caméra.                                       |
| `viewOffset`   | object  | Décalage de la caméra `{ x, y }`.                                  |

## Points (`points`)

Dictionnaire dont **la clé est l'`id`** du point (`"p1"`, `"p2"`, …) et la
valeur décrit le point.

### Point libre

```json
"p1": { "x": 520.42, "y": 499.00, "visible": true, "label": "A" }
```

| Champ     | Type    | Rôle                                             |
|-----------|---------|--------------------------------------------------|
| `x`, `y`  | number  | Coordonnées dans l'espace interne (voir note ⚠️).|
| `visible` | boolean | Point affiché ou masqué.                         |
| `label`   | string  | Nom affiché (`A`, `B`, …).                        |
| `def`     | object  | *(optionnel)* définition d'un point **construit**.|

### Point construit (`def`)

Un point peut être calculé à partir d'autres points. Il porte alors un objet
`def` décrivant la construction. Exemple observé — **rotation** :

```json
"p12": {
  "x": -220.30, "y": 709.22, "visible": true, "label": "H",
  "def": { "type": "rotation", "center": "p3", "source": "p11", "angle": 60 }
}
```

→ `H` = image de `G` (p11) par la rotation de centre `C` (p3) et d'angle `60°`.
Les `x, y` stockés sont la position *calculée* au moment de la sauvegarde ;
le `def` reste la source de vérité et se recalcule si un point mère bouge.

> ℹ️ Seul le type `rotation` a été observé jusqu'ici. D'autres types de `def`
> existent très probablement (milieu, intersection, translation, symétrie,
> projection…) — à confirmer avec le JavaScript du moteur.

## Objets géométriques (`objects`)

Tableau d'objets. **Champs communs** à tous les objets :

| Champ    | Type   | Rôle                                                   |
|----------|--------|--------------------------------------------------------|
| `id`     | string | Identifiant unique (`p4`, `p7`… — même espace que les points). |
| `type`   | string | Type d'objet (voir table).                            |
| `label`  | string | Nom affiché (`poly1`, `m1`, `c1`, `α1`…).             |
| `stroke` | string | Couleur du trait (hex, ex. `#243b53`).                |
| `width`  | number | Épaisseur du trait.                                    |
| `dash`   | string | Style de trait : `""` continu, sinon motif tirets.    |

**Champs spécifiques par `type`** (tous les `a`, `b`, `c`, `v`, `rp`, `pts`
référencent des `id` de points) :

| `type`          | Signification                         | Champs propres          |
|-----------------|---------------------------------------|-------------------------|
| `polygon`       | Polygone                              | `pts: [id, id, …]`      |
| `perpBisector`  | Médiatrice du segment [a b]           | `a`, `b`                |
| `circleRadius`  | Cercle : centre + rayon fixe          | `c`, `radius` (number)  |
| `circleCP`      | Cercle : centre passant par un point  | `c`, `rp`               |
| `angle`         | Angle `a v̂ b` (sommet `v`)           | `a`, `v`, `b`           |

Exemples réels :

```json
{ "id": "p4",  "type": "polygon",      "pts": ["p1","p2","p3"], "label": "poly1", "stroke":"#243b53","width":5,"dash":"" }
{ "id": "p7",  "type": "perpBisector", "a": "p5", "b": "p6",     "label": "m1"  }
{ "id": "p8",  "type": "circleRadius", "c": "p1", "radius": 100, "label": "c1"  }
{ "id": "p9",  "type": "circleCP",     "c": "p3", "rp": "p2",    "label": "c2"  }
{ "id": "p13", "type": "angle",        "a": "p11","v": "p3","b": "p12", "label": "α1" }
```

> ℹ️ D'autres types d'objets existent sûrement (segment, droite, demi-droite,
> parallèle, perpendiculaire, arc, mesure de longueur…) — à confirmer avec le JS.

## ⚠️ Points à confirmer avec le moteur (JavaScript de `D2D.html`)

Ces éléments ne sont **pas** déductibles des seuls fichiers `.d2d` ; ils
nécessitent le code de l'application (à récupérer depuis `devoirati.net`) :

1. **Conversion `x,y` ↔ coordonnées du repère.** Les `x, y` sont dans un espace
   interne (valeurs jusqu'à ~1100, parfois négatives). Le lien avec les
   graduations affichées (−3…3) dépend de `gridCell`, `zoomLevel` et
   `viewOffset` — formule exacte à extraire du code.
2. **Liste exhaustive des `type` d'objets et de `def`.**
3. **Comment charger/injecter ce JSON** dans une page hôte (paramètre d'URL,
   `#hash`, `postMessage`, ou API JS type `D2D.inject(divId, project)`),
   nécessaire pour la Méthode C (préchargement) et la version « widget ».
4. **Clé de `localStorage`** utilisée par la sauvegarde automatique (pour
   éviter les collisions entre plusieurs exercices d'un même site).

## Fichiers d'exemple

Archivés dans `docs/d2d-samples/` :

- `D2Dprojet_1.d2d` — projet **vide** (montre l'enveloppe minimale du format).
- `D2Dprojet_2.d2d` — figure complète : triangle `ABC`, médiatrice, deux cercles,
  un angle, et un point construit par rotation. Sert de référence pour la
  structure `points` / `objects`.
