#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Devoirati — audit LECTURE SEULE des pages HTML statiques.

Quantifie deux defauts apparus apres la migration du socle CSS/JS :

  DEFAUT A — balise <style> cassee
      A1 : nombre de "<style" different du nombre de "</style>"
      A2 : du CSS subsiste dans le texte visible (hors <script>/<style>/balises)
      A3 : "media (max-width" present sans le "@" qui devrait le preceder

  DEFAUT B — banniere deplacee par un body en flex/grid
      B1 : une regle CSS ciblant body (ou html, body / body.xxx) pose
           display:flex ou display:grid
      B2 : la page charge le socle (utils.js / basic.js /
           devoirati-erc-bridge.js / script d'injection banniere)
      B3 : la page ne porte pas data-banner="off"

Ce script N'ECRIT JAMAIS dans les fichiers analyses : il les ouvre en
lecture seule ('r'). Les seules ecritures sont les 3 rapports CSV.

Usage :
    python3 scan_defauts_devoirati.py [--root .] [--out .]

stdlib uniquement, Python 3.6+.
"""

import argparse
import csv
import html as html_mod
import os
import re
import sys
from collections import Counter

# --------------------------------------------------------------------------
# Configuration
# --------------------------------------------------------------------------

PROGRESS_EVERY = 2000
EXCERPT_LEN = 120

# Repertoires ignores pendant le parcours.
SKIP_DIRS = {".git", ".svn", ".hg", "node_modules", "__pycache__"}

# B2 — marqueurs de chargement du socle commun.
SOCLE_MARKERS = (
    "utils.js",
    "basic.js",
    "devoirati-erc-bridge.js",
    "devoirati-banner",
    "banner.js",
    "banniere.js",
    "injectbanner",
    "insertbanner",
    "createbanner",
    "devoirati-banniere",
)

# A2 — signatures de CSS retrouve dans le texte visible.
CSS_TEXT_MARKERS = (
    "@media",
    "media (max-width",
    "max-width:",
    "border-radius:",
    "font-size:",
)

# --------------------------------------------------------------------------
# Expressions regulieres (compilees une fois)
# --------------------------------------------------------------------------

RE_STYLE_OPEN = re.compile(r"<style", re.I)
RE_STYLE_CLOSE = re.compile(r"</style", re.I)

RE_SCRIPT_BLOCK = re.compile(r"<script\b[^>]*>.*?</script\s*>", re.I | re.S)
RE_STYLE_BLOCK = re.compile(r"<style\b[^>]*>(.*?)</style\s*>", re.I | re.S)
RE_COMMENT = re.compile(r"<!--.*?-->", re.S)
RE_TAG = re.compile(r"<[^>]*>", re.S)
RE_WS = re.compile(r"\s+")

# A2 — code source AFFICHE volontairement (entites echappees) : une page
# qui montre "&lt;style&gt; ... &lt;/style&gt;" a titre d'exemple n'a pas
# de balise cassee. On retire ces blocs avant de chercher du CSS residuel.
RE_ESCAPED_BLOCK = re.compile(
    r"&lt;\s*(script|style)\b.*?&lt;\s*/\s*\1\s*&gt;", re.I | re.S
)

# A3 : "media (max-width" litteral ; le "@" attendu est teste a part.
RE_MEDIA_NO_AT = re.compile(r"media\s*\(\s*max-width", re.I)

# A2 : bloc { ... : ... ; ... } — capture bornee pour rester lineaire.
RE_BRACE_BLOCK = re.compile(r"\{[^{}]{0,500}\}", re.S)

# B3 : data-banner="off" (guillemets simples/doubles/absents).
RE_BANNER_OFF = re.compile(r"""data-banner\s*=\s*(['"]?)\s*off\s*\1""", re.I)

# <link rel="stylesheet" href="...">
RE_LINK_TAG = re.compile(r"<link\b[^>]*>", re.I)
RE_REL_STYLESHEET = re.compile(r"""rel\s*=\s*(['"]?)\s*stylesheet\s*\1""", re.I)
RE_HREF = re.compile(r"""href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))""", re.I)

# CSS : commentaires, et declarations display / centrage.
RE_CSS_COMMENT = re.compile(r"/\*.*?\*/", re.S)
RE_DISPLAY = re.compile(r"display\s*:\s*([a-zA-Z-]+)", re.I)
RE_CENTERING = re.compile(
    r"(justify-content|align-items|min-height)\s*:\s*([^;}]+)", re.I
)

# B1 : un selecteur individuel ciblant l'element body.
#      "body", "body.xxx", "body#id", "body:not(...)", "body[dir=rtl]"
#      -> OK.  ".Foo_body__x9", "body__fOu5t" -> rejetes.
RE_SELECTOR_BODY = re.compile(
    r"^\s*(?:html\s*)?body(?:[.#:\[][^\s>+~,]*)*\s*$", re.I
)

DISPLAY_FLEXLIKE = {"flex", "grid", "inline-flex", "inline-grid"}


# --------------------------------------------------------------------------
# Utilitaires
# --------------------------------------------------------------------------


def excerpt(text, start=0, length=EXCERPT_LEN):
    """Extrait normalise (sans retours ligne) de `length` caracteres."""
    chunk = text[start : start + length * 3]
    chunk = RE_WS.sub(" ", chunk).strip()
    return chunk[:length]


def rel_path(path, root):
    """Chemin relatif a la racine du scan, separateurs POSIX."""
    try:
        rel = os.path.relpath(path, root)
    except ValueError:  # disques differents sous Windows
        rel = path
    return rel.replace(os.sep, "/")


def dir_of(relative):
    parent = os.path.dirname(relative)
    return parent if parent else "."


# --------------------------------------------------------------------------
# DEFAUT A
# --------------------------------------------------------------------------


def strip_to_visible_text(text):
    """Retire scripts, styles, commentaires puis toutes les balises.

    Retourne (texte_visible, nb_blocs_echappes_retires).  Les blocs de
    code affiches via entites (&lt;style&gt;...) sont retires AVANT le
    unescape final : sans cela, un tutoriel qui montre du CSS serait
    compte comme une balise <style> cassee.
    """
    cleaned = RE_SCRIPT_BLOCK.sub(" ", text)
    cleaned = RE_STYLE_BLOCK.sub(" ", cleaned)
    cleaned = RE_COMMENT.sub(" ", cleaned)
    cleaned = RE_TAG.sub(" ", cleaned)
    cleaned, n_escaped = RE_ESCAPED_BLOCK.subn(" ", cleaned)
    return html_mod.unescape(cleaned), n_escaped


def find_css_in_text(visible):
    """Cherche une signature de CSS dans le texte residuel.

    Retourne (marqueur, position) ou None.
    """
    low = visible.lower()
    best = None
    for marker in CSS_TEXT_MARKERS:
        pos = low.find(marker)
        if pos != -1 and (best is None or pos < best[1]):
            best = (marker, pos)
    if best is not None:
        return best

    # Motif "{ ... : ... ; }" — teste sans backtracking imbrique.
    for match in RE_BRACE_BLOCK.finditer(visible):
        block = match.group(0)
        colon = block.find(":")
        if colon > 0 and block.find(";", colon) > colon:
            return ("{...:...;}", match.start())
    return None


def detect_a(text):
    """Analyse le defaut A.

    Retourne (hits, n_blocs_code_affiche) ou hits = [(cas, extrait), ...].
    """
    hits = []

    n_open = len(RE_STYLE_OPEN.findall(text))
    n_close = len(RE_STYLE_CLOSE.findall(text))
    if n_open != n_close:
        # Extrait : autour de la derniere ouverture de <style>.
        last = None
        for m in RE_STYLE_OPEN.finditer(text):
            last = m
        sample = excerpt(text, last.start()) if last else ""
        hits.append(
            ("A1", "<style>=%d </style>=%d | %s" % (n_open, n_close, sample))
        )

    visible, n_escaped = strip_to_visible_text(text)
    found = find_css_in_text(visible)
    if found is not None:
        marker, pos = found
        hits.append(("A2", "[%s] %s" % (marker, excerpt(visible, pos))))

    for m in RE_MEDIA_NO_AT.finditer(text):
        start = m.start()
        before = text[start - 1] if start > 0 else ""
        if before != "@":
            hits.append(("A3", excerpt(text, max(0, start - 20))))
            break

    return hits, n_escaped


# --------------------------------------------------------------------------
# DEFAUT B
# --------------------------------------------------------------------------


def iter_css_rules(css):
    """Genere (selecteur, corps) pour chaque bloc de declarations.

    Scanner lineaire tolerant aux at-rules imbriquees (@media, @supports) :
    le selecteur retenu est le texte situe apres le dernier '{' ou '}'.
    """
    css = RE_CSS_COMMENT.sub(" ", css)
    selector_start = 0
    depth = 0
    block_start = 0
    pending_selector = ""
    for i, ch in enumerate(css):
        if ch == "{":
            if depth == 0:
                pending_selector = css[selector_start:i]
                block_start = i + 1
            depth += 1
        elif ch == "}":
            if depth > 0:
                depth -= 1
                if depth == 0:
                    body = css[block_start:i]
                    if "{" in body:
                        # At-rule : on redescend d'un niveau.
                        for inner in iter_css_rules(body):
                            yield inner
                    else:
                        yield pending_selector, body
            selector_start = i + 1
        # Les selecteurs qui suivent un '{' de at-rule sont geres par
        # la recursion ci-dessus.


def body_flex_rules(css):
    """Regles ciblant body avec display flex/grid.

    Retourne [(selecteur, display, proprietes_centrage), ...].
    """
    out = []
    for selector, body in iter_css_rules(css):
        selector = RE_WS.sub(" ", selector).strip()
        if not selector or "body" not in selector.lower():
            continue
        parts = [p.strip() for p in selector.split(",") if p.strip()]
        matched = [p for p in parts if RE_SELECTOR_BODY.match(p)]
        if not matched:
            continue

        displays = RE_DISPLAY.findall(body)
        if not displays:
            continue
        # La derniere declaration l'emporte dans un meme bloc.
        value = displays[-1].strip().lower()
        if value not in DISPLAY_FLEXLIKE:
            continue

        centering = []
        for prop, val in RE_CENTERING.findall(body):
            centering.append("%s:%s" % (prop.lower(), RE_WS.sub(" ", val).strip()))
        out.append((selector, value, "; ".join(centering)))
    return out


def collect_css_sources(text, html_path, root, css_cache, errors):
    """Regles body-flex issues du CSS inline + des <link> locaux.

    Les fichiers .css externes sont analyses une seule fois puis mis en
    cache (on ne conserve que le resultat, pas le contenu).
    """
    rules = []

    for m in RE_STYLE_BLOCK.finditer(text):
        rules.extend(body_flex_rules(m.group(1)))

    base_dir = os.path.dirname(html_path)
    for tag in RE_LINK_TAG.findall(text):
        if not RE_REL_STYLESHEET.search(tag):
            continue
        href_match = RE_HREF.search(tag)
        if not href_match:
            continue
        href = next(g for g in href_match.groups() if g is not None).strip()
        if not href or href.startswith(("http://", "https://", "//", "data:")):
            continue
        href = html_mod.unescape(href).split("?")[0].split("#")[0]
        if not href:
            continue

        target = os.path.normpath(os.path.join(base_dir, href.replace("/", os.sep)))
        try:
            key = os.path.realpath(target)
        except OSError:
            key = target

        if key in css_cache:
            rules.extend(css_cache[key])
            continue

        try:
            with open(target, "r", encoding="utf-8", errors="replace") as fh:
                css_text = fh.read()
        except (OSError, IOError) as exc:
            css_cache[key] = []
            errors.append(
                (rel_path(target, root), "css_illisible", "%s (lie depuis %s)"
                 % (exc.__class__.__name__, rel_path(html_path, root)))
            )
            continue

        found = body_flex_rules(css_text)
        css_cache[key] = found
        rules.extend(found)

    return rules


def detect_b(text, html_path, root, css_cache, errors):
    """Retourne la liste des regles B declenchees, ou []."""
    # B2 d'abord : test le moins couteux qui elimine le plus de pages.
    low = text.lower()
    if not any(marker in low for marker in SOCLE_MARKERS):
        return []
    # B3
    if RE_BANNER_OFF.search(text):
        return []
    # B1
    return collect_css_sources(text, html_path, root, css_cache, errors)


# --------------------------------------------------------------------------
# Parcours
# --------------------------------------------------------------------------


def iter_html_files(root):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = sorted(d for d in dirnames if d not in SKIP_DIRS)
        for name in sorted(filenames):
            if name.lower().endswith((".html", ".htm")):
                yield os.path.join(dirpath, name)


def main():
    parser = argparse.ArgumentParser(
        description="Audit lecture seule des pages HTML Devoirati."
    )
    parser.add_argument("--root", default=".", help="dossier a scanner (defaut : .)")
    parser.add_argument("--out", default=".", help="dossier des rapports (defaut : .)")
    args = parser.parse_args()

    root = os.path.abspath(args.root)
    out_dir = os.path.abspath(args.out)
    if not os.path.isdir(root):
        sys.stderr.write("Dossier introuvable : %s\n" % root)
        return 2
    if not os.path.isdir(out_dir):
        sys.stderr.write("Dossier de sortie introuvable : %s\n" % out_dir)
        return 2

    path_a = os.path.join(out_dir, "rapport_style_casse.csv")
    path_b = os.path.join(out_dir, "rapport_banniere_flex.csv")
    path_e = os.path.join(out_dir, "rapport_erreurs.csv")

    total = 0
    case_counts = Counter()          # A1 / A2 / A3 -> nb de pages
    pages_a = 0
    pages_b = 0
    pages_ab = 0
    dirs_a = Counter()
    dirs_b = Counter()
    css_cache = {}
    n_errors = 0
    pages_code_affiche = 0

    # Les lignes sont ecrites au fil de l'eau : rien n'est accumule en
    # memoire hormis les compteurs.
    with open(path_a, "w", encoding="utf-8-sig", newline="") as fa, \
         open(path_b, "w", encoding="utf-8-sig", newline="") as fb, \
         open(path_e, "w", encoding="utf-8-sig", newline="") as fe:

        w_a = csv.writer(fa)
        w_b = csv.writer(fb)
        w_e = csv.writer(fe)
        w_a.writerow(["chemin", "cas", "extrait"])
        w_b.writerow(["chemin", "selecteur", "display", "proprietes_centrage"])
        w_e.writerow(["chemin", "type_erreur", "message"])

        for path in iter_html_files(root):
            total += 1
            if total % PROGRESS_EVERY == 0:
                sys.stderr.write("  ... %d fichiers analyses\n" % total)
                sys.stderr.flush()

            rel = rel_path(path, root)
            errors = []

            try:
                with open(path, "r", encoding="utf-8", errors="replace") as fh:
                    text = fh.read()
            except (OSError, IOError, MemoryError) as exc:
                w_e.writerow([rel, "lecture", "%s: %s" % (exc.__class__.__name__, exc)])
                n_errors += 1
                continue

            try:
                hits_a, n_escaped = detect_a(text)
                if n_escaped:
                    pages_code_affiche += 1
            except Exception as exc:  # le scan ne doit jamais s'interrompre
                hits_a = []
                w_e.writerow([rel, "analyse_A", "%s: %s" % (exc.__class__.__name__, exc)])
                n_errors += 1

            try:
                hits_b = detect_b(text, path, root, css_cache, errors)
            except Exception as exc:
                hits_b = []
                w_e.writerow([rel, "analyse_B", "%s: %s" % (exc.__class__.__name__, exc)])
                n_errors += 1

            for err in errors:
                w_e.writerow(list(err))
                n_errors += 1

            for case, sample in hits_a:
                w_a.writerow([rel, case, sample])
            for selector, display, centering in hits_b:
                w_b.writerow([rel, selector, display, centering])

            if hits_a:
                pages_a += 1
                dirs_a[dir_of(rel)] += 1
                for case in {c for c, _ in hits_a}:
                    case_counts[case] += 1
            if hits_b:
                pages_b += 1
                dirs_b[dir_of(rel)] += 1
            if hits_a and hits_b:
                pages_ab += 1

    # ---------------------------------------------------------------- resume
    def pct(n):
        return (100.0 * n / total) if total else 0.0

    print("")
    print("=" * 66)
    print("  DEVOIRATI — AUDIT LECTURE SEULE (aucun fichier modifie)")
    print("=" * 66)
    print("  Racine scannee : %s" % root)
    print("")
    print("  Fichiers .html analyses ......... %d" % total)
    print("  Feuilles .css externes lues ..... %d" % len(css_cache))
    print("")
    print("  DEFAUT A — balise <style> cassee")
    print("    Pages touchees ................ %d  (%.1f %%)" % (pages_a, pct(pages_a)))
    print("      A1 <style>/</style> desequilibre : %d" % case_counts["A1"])
    print("      A2 CSS visible dans le texte ... : %d" % case_counts["A2"])
    print("      A3 '@' mange (media (max-width)) : %d" % case_counts["A3"])
    print("    Pages exclues de A2 (code source affiche"
          " via entites) : %d" % pages_code_affiche)
    print("")
    print("  DEFAUT B — banniere deplacee (body flex/grid)")
    print("    Pages touchees ................ %d  (%.1f %%)" % (pages_b, pct(pages_b)))
    print("")
    print("  Pages cumulant A ET B ........... %d  (%.1f %%)" % (pages_ab, pct(pages_ab)))
    print("  Fichiers en erreur .............. %d" % n_errors)
    print("")

    for title, counter in (
        ("TOP 15 dossiers — defaut A", dirs_a),
        ("TOP 15 dossiers — defaut B", dirs_b),
    ):
        print("  %s" % title)
        if not counter:
            print("    (aucun)")
        else:
            for name, count in counter.most_common(15):
                print("    %6d  %s" % (count, name))
        print("")

    print("  Rapports ecrits :")
    print("    %s" % rel_path(path_a, os.getcwd()))
    print("    %s" % rel_path(path_b, os.getcwd()))
    print("    %s" % rel_path(path_e, os.getcwd()))
    print("=" * 66)
    return 0


if __name__ == "__main__":
    sys.exit(main())
