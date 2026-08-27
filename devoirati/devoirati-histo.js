/*!
 * Devoirati — Historique & Favoris
 * ---------------------------------------------------------------
 * 100 % local : rien n'est envoye a un serveur, rien ne quitte
 * l'appareil de l'eleve. Aucune dependance, aucun framework.
 *
 * A injecter sur toutes les pages d'exercices :
 *     <script src="/devoirati-histo.js" defer></script>
 *
 * Le script se debrouille seul : il enregistre la visite, ajoute le
 * bouton flottant (favori + "reussi / erreur / difficile") et detecte
 * le score quand la page en affiche un.
 */
(function () {
  'use strict';

  if (window.__devoiratiHisto) return;      // double injection : on sort
  window.__devoiratiHisto = true;

  var CLE          = 'devoirati.histo.v1';
  var MAX_RECENTS  = 60;                    // taille de la liste "recents"
  var PAGE_HISTO   = '/historique.html';    // <- adapter si autre chemin

  /* =============================================================
     1. STOCKAGE
     Format volontairement compact (cles courtes) : le localStorage
     est limite a ~5 Mo et on veut tenir des milliers de pages.

       pages["/fractions/addition/exo-012.html"] = {
         t : "Addition de fractions",  // titre lisible
         c : "fractions",              // chapitre (1er dossier)
         n : 5,                        // nombre de visites
         d : 1756300000000,            // date de la derniere visite
         f : 1,                        // 1 = favori
         s : "ok"|"err"|"dur",         // statut
         m : 1,                        // statut pose a la main par l'eleve
         b : [8, 10]                   // meilleur score obtenu
       }
     ============================================================= */

  function vide() { return { v: 1, pages: {}, recents: [] }; }

  function lire() {
    try {
      var brut = localStorage.getItem(CLE);
      if (!brut) return vide();
      var d = JSON.parse(brut);
      if (!d || !d.pages) return vide();
      if (!d.recents) d.recents = [];
      return d;
    } catch (e) {
      return vide();                        // navigation privee, quota, JSON casse
    }
  }

  function ecrire(d) {
    try {
      localStorage.setItem(CLE, JSON.stringify(d));
      return true;
    } catch (e) {
      try {                                 // quota plein : on elague et on reessaie
        elaguer(d);
        localStorage.setItem(CLE, JSON.stringify(d));
        return true;
      } catch (e2) {
        return false;                       // on echoue en silence, jamais d'erreur visible
      }
    }
  }

  /* Supprime les pages les plus anciennes, en gardant toujours les
     favoris et les pages que l'eleve a lui-meme etiquetees. */
  function elaguer(d) {
    var gardables = Object.keys(d.pages).filter(function (k) {
      var p = d.pages[k];
      return !p.f && !p.m;
    });
    gardables.sort(function (a, b) { return (d.pages[a].d || 0) - (d.pages[b].d || 0); });
    gardables.slice(0, Math.ceil(gardables.length / 2)).forEach(function (k) {
      delete d.pages[k];
      var i = d.recents.indexOf(k);
      if (i !== -1) d.recents.splice(i, 1);
    });
  }

  /* =============================================================
     2. IDENTITE DE LA PAGE
     Le chemin est la cle. Il doit rester STABLE dans le temps :
     renommer un fichier casse l'historique deja accumule chez les
     eleves, et on n'a aucun moyen de le reparer a distance.
     ============================================================= */

  function chemin() {
    var p = location.pathname;
    try { p = decodeURIComponent(p); } catch (e) {}
    return p.replace(/\/index\.html?$/i, '/');
  }

  function titre() {
    var t = (document.title || '').trim();
    if (!t) {
      var h1 = document.querySelector('h1, h2');
      t = h1 ? (h1.textContent || '').trim() : '';
    }
    if (!t) {                               // dernier recours : le nom du fichier
      t = chemin().split('/').pop().replace(/\.html?$/i, '').replace(/[-_]+/g, ' ');
    }
    return t.slice(0, 120);
  }

  /* Chapitre = premier dossier du chemin. Gratuit si les dossiers
     sont deja organises par theme (/fractions/..., /puissances/...). */
  function chapitre() {
    var seg = chemin().split('/').filter(Boolean);
    return seg.length > 1 ? seg[0] : '';
  }

  /* =============================================================
     3. ENREGISTREMENT DE LA VISITE
     ============================================================= */

  var CHEMIN = chemin();

  function fiche(d) {
    if (!d.pages[CHEMIN]) d.pages[CHEMIN] = { n: 0 };
    return d.pages[CHEMIN];
  }

  function maj(modif) {
    var d = lire();
    var p = fiche(d);
    modif(p, d);
    p.t = titre();
    var c = chapitre();
    if (c) p.c = c;
    ecrire(d);
    return p;
  }

  function enregistrerVisite() {
    maj(function (p, d) {
      p.n = (p.n || 0) + 1;
      p.d = Date.now();
      var i = d.recents.indexOf(CHEMIN);
      if (i !== -1) d.recents.splice(i, 1);
      d.recents.unshift(CHEMIN);
      if (d.recents.length > MAX_RECENTS) d.recents.length = MAX_RECENTS;
    });
  }

  /* =============================================================
     4. DETECTION AUTOMATIQUE DU SCORE
     Beaucoup de pages affichent deja <span id="score"> / <span id="total">.
     On les surveille, sans rien exiger des pages qui n'en ont pas.
     ============================================================= */

  function nombre(el) {
    if (!el) return null;
    var n = parseInt((el.textContent || '').replace(/[^0-9-]/g, ''), 10);
    return isNaN(n) ? null : n;
  }

  function surveillerScore() {
    var elScore = document.getElementById('score');
    var elTotal = document.getElementById('total');
    if (!elScore || !elTotal) return;

    /* Point subtil : #score / #total est un compteur qui AVANCE pendant la
       seance (1/1, puis 2/2, puis 2/3...). Ce n'est pas une suite de
       tentatives independantes. On fige donc le meilleur score des seances
       PRECEDENTES au chargement, et on compare toujours a celui-la : la
       valeur retenue est ainsi le score final de la seance en cours, et non
       le meilleur ratio croise en chemin. */
    var avant = (lire().pages[CHEMIN] || {}).b || null;

    var relever = function () {
      var s = nombre(elScore), t = nombre(elTotal);
      if (s === null || t === null || t <= 0 || s > t) return;
      maj(function (p) {
        if (!avant || (s / t) >= (avant[0] / avant[1])) p.b = [s, t];
        else p.b = avant;
        // statut deduit de la seance en cours, sauf si l'eleve l'a pose lui-meme
        if (!p.m) {
          var r = s / t;
          p.s = r >= 0.8 ? 'ok' : (r < 0.5 ? 'err' : 'dur');
        }
      });
      rafraichirWidget();
    };

    var obs = new MutationObserver(relever);
    obs.observe(elScore, { childList: true, characterData: true, subtree: true });
    obs.observe(elTotal, { childList: true, characterData: true, subtree: true });

    // Filet de securite : on releve aussi l'etat final quand l'eleve quitte.
    window.addEventListener('pagehide', relever);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') relever();
    });
  }

  /* =============================================================
     5. WIDGET FLOTTANT
     Rendu dans un Shadow DOM : indispensable ici, car il doit
     s'afficher par-dessus des dizaines de milliers de pages aux CSS
     tres differents, sans jamais entrer en collision avec elles.
     ============================================================= */

  var racine = null, hote = null;

  var CSS = [
    ':host{all:initial}',
    '*{box-sizing:border-box;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}',
    '.zone{position:fixed;right:16px;bottom:16px;bottom:calc(16px + env(safe-area-inset-bottom));',
      'z-index:2147483000;display:flex;flex-direction:column;align-items:flex-end;gap:10px}',
    '.fab{width:52px;height:52px;border-radius:50%;border:none;cursor:pointer;',
      'background:#2563eb;color:#fff;font-size:22px;line-height:1;',
      'box-shadow:0 4px 14px rgba(0,0,0,.28);display:flex;align-items:center;justify-content:center}',
    '.fab:active{transform:scale(.94)}',
    '.fab.actif{background:#dc2626}',
    '.panneau{background:#fff;color:#111;border-radius:14px;padding:10px;min-width:216px;',
      'box-shadow:0 10px 34px rgba(0,0,0,.3);display:none}',
    '.panneau.ouvert{display:block}',
    '.titre{font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;',
      'margin:2px 4px 8px}',
    '.ligne{display:flex;gap:6px;margin-bottom:8px}',
    '.b{flex:1;border:1px solid #e5e7eb;background:#fff;border-radius:10px;padding:9px 4px;',
      'font-size:11px;color:#374151;cursor:pointer;text-align:center;line-height:1.5}',
    '.b em{display:block;font-style:normal;font-size:17px}',
    '.b:active{background:#f3f4f6}',
    '.b.on{border-color:#2563eb;background:#eff6ff;color:#1d4ed8;font-weight:600}',
    '.b.on.err{border-color:#dc2626;background:#fef2f2;color:#b91c1c}',
    '.b.on.dur{border-color:#d97706;background:#fffbeb;color:#b45309}',
    '.lien{display:block;text-align:center;background:#111827;color:#fff;text-decoration:none;',
      'border-radius:10px;padding:10px;font-size:13px;font-weight:600}',
    '.coeur{border:none;background:none;font-size:19px;cursor:pointer;padding:0 4px;color:#dc2626}',
    '@media (prefers-color-scheme:dark){',
      '.panneau{background:#1f2937;color:#f9fafb}',
      '.b{background:#374151;border-color:#4b5563;color:#e5e7eb}',
      '.lien{background:#2563eb}}'
  ].join('');

  var HTML =
    '<div class="zone">' +
      '<div class="panneau" id="pan">' +
        '<div class="titre">Cet exercice</div>' +
        '<div class="ligne">' +
          '<button class="b" id="ok"  data-s="ok"><em>✅</em>Reussi</button>' +
          '<button class="b" id="err" data-s="err"><em>❌</em>Erreur</button>' +
          '<button class="b" id="dur" data-s="dur"><em>😓</em>Difficile</button>' +
        '</div>' +
        '<div class="ligne">' +
          '<button class="b" id="fav" style="flex:1"><em id="ic">♡</em><span id="lbfav">Enregistrer</span></button>' +
        '</div>' +
        '<a class="lien" id="voir">📚 Mon historique</a>' +
      '</div>' +
      '<button class="fab" id="fab" aria-label="Historique et favoris">♡</button>' +
    '</div>';

  function construire() {
    hote = document.createElement('div');
    hote.id = 'devoirati-histo';
    racine = hote.attachShadow ? hote.attachShadow({ mode: 'open' }) : hote;
    var style = document.createElement('style');
    style.textContent = CSS;
    racine.appendChild(style);
    var boite = document.createElement('div');
    boite.innerHTML = HTML;
    racine.appendChild(boite);
    document.body.appendChild(hote);

    var pan = racine.getElementById('pan');
    racine.getElementById('fab').addEventListener('click', function () {
      pan.classList.toggle('ouvert');
    });
    racine.getElementById('voir').setAttribute('href', PAGE_HISTO);

    racine.getElementById('fav').addEventListener('click', function () {
      maj(function (p) { p.f = p.f ? 0 : 1; });
      rafraichirWidget();
    });

    ['ok', 'err', 'dur'].forEach(function (s) {
      racine.getElementById(s).addEventListener('click', function () {
        maj(function (p) {
          p.s = (p.s === s) ? null : s;   // reclic = on retire l'etiquette
          p.m = p.s ? 1 : 0;              // etiquette posee a la main
        });
        rafraichirWidget();
      });
    });

    rafraichirWidget();
  }

  function rafraichirWidget() {
    if (!racine) return;
    var p = lire().pages[CHEMIN] || {};
    racine.getElementById('ic').textContent      = p.f ? '♥' : '♡';
    racine.getElementById('lbfav').textContent   = p.f ? 'Enregistre' : 'Enregistrer';
    racine.getElementById('fav').classList.toggle('on', !!p.f);
    var fab = racine.getElementById('fab');
    fab.textContent = p.f ? '♥' : '♡';
    fab.classList.toggle('actif', !!p.f);
    ['ok', 'err', 'dur'].forEach(function (s) {
      var b = racine.getElementById(s);
      b.classList.toggle('on', p.s === s);
      b.classList.toggle(s, p.s === s);
    });
  }

  /* =============================================================
     6. API PUBLIQUE
     Pour les pages futures qui voudront declarer un resultat
     elles-memes, sans dependre de la detection automatique.
     ============================================================= */

  window.Devoirati = {
    resultat: function (score, total) {
      maj(function (p) {
        if (typeof score === 'number' && typeof total === 'number' && total > 0) {
          if (!p.b || (score / total) > (p.b[0] / p.b[1])) p.b = [score, total];
          if (!p.m) {
            var r = score / total;
            p.s = r >= 0.8 ? 'ok' : (r < 0.5 ? 'err' : 'dur');
          }
        }
      });
      rafraichirWidget();
    },
    favori:  function () { maj(function (p) { p.f = p.f ? 0 : 1; }); rafraichirWidget(); },
    donnees: lire,
    cle:     CLE
  };

  /* =============================================================
     7. DEMARRAGE
     ============================================================= */

  function demarrer() {
    enregistrerVisite();
    try { construire(); } catch (e) {}     // une page cassee ne doit jamais bloquer l'eleve
    try { surveillerScore(); } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer);
  } else {
    demarrer();
  }
})();
