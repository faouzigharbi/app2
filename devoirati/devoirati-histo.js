/*!
 * Devoirati — Historique, favoris et synchronisation
 * ------------------------------------------------------------------
 * A inclure depuis utils.js (ou par une balise sur les pages qui ne
 * chargent pas utils.js) :
 *     <script src="/devoirati-histo.js" defer></script>
 *
 * Le carnet vit sur l'appareil de l'eleve. Un code de synchronisation
 * genere tout seul lui permet de le retrouver sur un autre appareil,
 * SANS compte, sans mot de passe, sans nom : le serveur ne connait
 * qu'un code aleatoire et une liste de chemins d'exercices.
 */
(function () {
  'use strict';

  if (window.Devoirati) return;

  /* ---------------------------------------------------------------
     Reglages
     --------------------------------------------------------------- */
  var CLE       = 'devoirati.histo.v1';
  var CLE_CODE  = 'devoirati.code.v1';
  var CLE_TIRE  = 'devoirati.tire.v1';     // date du dernier « tirer »
  var API       = '/api/sync.php';
  var PAGE_HISTO = '/historique.html';
  var MAX_RECENTS = 60;
  var PERIODE   = 3600000;                 // on ne retire du serveur qu'une fois par heure

  /* ---------------------------------------------------------------
     1. STOCKAGE

     pages[chemin] = {
       t titre, c chapitre,
       n visites,  d derniere visite,
       f favori,   fd date du dernier changement de favori,
       s statut ("ok" | "err" | "dur"), m statut pose a la main,
       sd date du dernier changement de statut,
       b meilleur score [obtenu, sur]
     }

     Les champs monotones (n, d, b) fusionnent par maximum ; les champs
     que l'eleve peut ANNULER (f, s) portent leur propre date, sinon
     retirer un favori sur le telephone le verrait revenir a la synchro
     suivante depuis le PC.
     --------------------------------------------------------------- */

  function vide() { return { v: 2, pages: {}, recents: [] }; }

  function lire() {
    try {
      var d = JSON.parse(localStorage.getItem(CLE));
      if (d && d.pages) { if (!d.recents) d.recents = []; return d; }
    } catch (e) {}
    return vide();
  }

  var sale = false;                        // quelque chose a changer depuis le dernier envoi

  function ecrire(d) {
    try {
      localStorage.setItem(CLE, JSON.stringify(d));
      sale = true;
      return true;
    } catch (e) {
      try { elaguer(d); localStorage.setItem(CLE, JSON.stringify(d)); sale = true; return true; }
      catch (e2) { return false; }
    }
  }

  /* Quota plein : on sacrifie les plus anciennes, jamais les favoris
     ni celles que l'eleve a etiquetees lui-meme. */
  function elaguer(d) {
    var jetables = Object.keys(d.pages).filter(function (k) {
      var p = d.pages[k];
      return !p.f && !p.m;
    });
    jetables.sort(function (a, b) { return (d.pages[a].d || 0) - (d.pages[b].d || 0); });
    jetables.slice(0, Math.ceil(jetables.length / 2)).forEach(function (k) {
      delete d.pages[k];
      var i = d.recents.indexOf(k);
      if (i !== -1) d.recents.splice(i, 1);
    });
  }

  /* ---------------------------------------------------------------
     2. FUSION
     Sert a trois endroits : l'import de fichier, le « tirer » du
     serveur, et la fusion faite par le serveur lui-meme. Union et
     maximum : le resultat ne depend pas de l'ordre des synchros, donc
     un appareil qui se reveille avec trois jours de retard complete au
     lieu d'ecraser.
     --------------------------------------------------------------- */
  function fusionner(a, b) {
    if (!b || !b.pages) return a;
    var r = { v: 2, pages: {}, recents: [] };
    var cles = {};
    Object.keys(a.pages || {}).forEach(function (k) { cles[k] = 1; });
    Object.keys(b.pages).forEach(function (k) { cles[k] = 1; });

    Object.keys(cles).forEach(function (k) {
      var x = (a.pages || {})[k], y = b.pages[k];
      if (!x) { r.pages[k] = y; return; }
      if (!y) { r.pages[k] = x; return; }
      var p = {
        n: Math.max(x.n || 0, y.n || 0),
        d: Math.max(x.d || 0, y.d || 0),
        t: (x.d || 0) >= (y.d || 0) ? (x.t || y.t) : (y.t || x.t),
        c: x.c || y.c
      };
      // favori : la modification la plus recente gagne
      var xf = x.fd || 0, yf = y.fd || 0;
      if (xf >= yf) { p.f = x.f || 0; p.fd = xf; } else { p.f = y.f || 0; p.fd = yf; }
      // statut : idem
      var xs = x.sd || 0, ys = y.sd || 0;
      if (xs >= ys) { p.s = x.s || null; p.m = x.m || 0; p.sd = xs; }
      else          { p.s = y.s || null; p.m = y.m || 0; p.sd = ys; }
      // meilleur score : le meilleur ratio des deux
      if (x.b && y.b) p.b = (x.b[0] / x.b[1]) >= (y.b[0] / y.b[1]) ? x.b : y.b;
      else p.b = x.b || y.b;
      r.pages[k] = p;
    });

    r.recents = (a.recents || []).concat(b.recents || [])
      .filter(function (k, i, t) { return t.indexOf(k) === i && r.pages[k]; })
      .sort(function (u, w) { return (r.pages[w].d || 0) - (r.pages[u].d || 0); })
      .slice(0, MAX_RECENTS);
    return r;
  }

  /* ---------------------------------------------------------------
     3. CODE DE SYNCHRONISATION
     Cree en silence a la premiere visite : on ne demande rien a
     l'eleve. Il ne le decouvre que s'il va le chercher.
     --------------------------------------------------------------- */

  // Alphabet sans caracteres confondables : ni O/0, ni I/1, ni S/5, ni B/8,
  // parce que ce code sera recopie a la main sur un telephone.
  var ALPHA = 'ACDEFGHJKLMNPQRTUVWXY34679';

  function fabriquerCode() {
    var n = 8, s = '', t = new Uint8Array(n), i;
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(t);
    else for (i = 0; i < n; i++) t[i] = Math.floor(Math.random() * 256);
    for (i = 0; i < n; i++) s += ALPHA[t[i] % ALPHA.length];
    return s.slice(0, 4) + '-' + s.slice(4);
  }

  function code() {
    var c = null;
    try { c = localStorage.getItem(CLE_CODE); } catch (e) {}
    if (!c || !/^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(c)) {
      c = fabriquerCode();
      try { localStorage.setItem(CLE_CODE, c); } catch (e) {}
    }
    return c;
  }

  /* Relier cet appareil au carnet d'un autre : on garde ce qu'il y a
     deja ici, on ajoute ce qui vient de la-bas. */
  function lierCode(c, fini) {
    c = String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (c.length !== 8) { fini && fini(false, 'format'); return; }
    c = c.slice(0, 4) + '-' + c.slice(4);
    try { localStorage.setItem(CLE_CODE, c); } catch (e) {}
    try { localStorage.removeItem(CLE_TIRE); } catch (e) {}
    tirer(function (ok) {
      if (ok) pousser();
      fini && fini(ok, ok ? null : 'reseau');
    });
  }

  /* ---------------------------------------------------------------
     4. SYNCHRONISATION
     Invisible : rien a cliquer. On recupere au chargement (au plus une
     fois par heure) et on depose en quittant la page.
     --------------------------------------------------------------- */

  function tirer(fini) {
    if (!window.fetch) { fini && fini(false); return; }
    fetch(API + '?code=' + encodeURIComponent(code()), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || !j.carnet) { fini && fini(false); return; }
        ecrire(fusionner(lire(), j.carnet));
        sale = false;                              // on vient de s'aligner
        try { localStorage.setItem(CLE_TIRE, String(Date.now())); } catch (e) {}
        fini && fini(true);
      })
      .catch(function () { fini && fini(false); });
  }

  function pousser() {
    var d = lire();
    if (!Object.keys(d.pages).length) return;      // rien a deposer
    var charge = JSON.stringify({ code: code(), carnet: d });
    try {
      if (navigator.sendBeacon) {
        // sendBeacon part meme quand l'onglet se ferme, sans rien ralentir
        navigator.sendBeacon(API, new Blob([charge], { type: 'application/json' }));
      } else if (window.fetch) {
        fetch(API, { method: 'POST', body: charge, keepalive: true,
                     headers: { 'Content-Type': 'application/json' } }).catch(function () {});
      }
      sale = false;
    } catch (e) {}
  }

  function tirerSiNecessaire(fini) {
    var t = 0;
    try { t = parseInt(localStorage.getItem(CLE_TIRE), 10) || 0; } catch (e) {}
    if (Date.now() - t < PERIODE) { fini && fini(false); return; }
    tirer(fini);
  }

  function deposerSiSale() { if (sale) pousser(); }

  /* ---------------------------------------------------------------
     5. IDENTITE DE LA PAGE
     Le chemin est la cle du carnet. Il doit rester stable : les
     donnees sont chez l'eleve, un fichier renomme casse son historique
     et rien ne peut le reparer a distance.
     --------------------------------------------------------------- */

  function chemin() {
    var p = location.pathname;
    try { p = decodeURIComponent(p); } catch (e) {}
    return p.replace(/\/index\.html?$/i, '/');
  }

  function titre() {
    var t = (document.title || '').trim();
    if (!t) {
      var h = document.querySelector('h1, h2');
      t = h ? (h.textContent || '').trim() : '';
    }
    if (!t) t = chemin().split('/').pop().replace(/\.html?$/i, '').replace(/[-_]+/g, ' ');
    return t.slice(0, 120);
  }

  function chapitre() {
    var seg = chemin().split('/').filter(Boolean);
    return seg.length > 1 ? seg[0] : '';
  }

  var CHEMIN = chemin();

  function maj(modif) {
    var d = lire();
    if (!d.pages[CHEMIN]) d.pages[CHEMIN] = { n: 0 };
    var p = d.pages[CHEMIN];
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

  /* ---------------------------------------------------------------
     6. DETECTION DU SCORE
     --------------------------------------------------------------- */

  function nombre(el) {
    if (!el) return null;
    var n = parseInt((el.textContent || '').replace(/[^0-9-]/g, ''), 10);
    return isNaN(n) ? null : n;
  }

  function surveillerScore() {
    var elS = document.getElementById('score'), elT = document.getElementById('total');
    if (!elS || !elT) return;

    /* #score / #total est un compteur qui AVANCE pendant la seance
       (1/1, puis 2/2, puis 2/3...). On fige donc le record des seances
       precedentes et on compare toujours a celui-la : la valeur retenue
       est le score final de la seance, pas le meilleur ratio croise en
       chemin. */
    var avant = (lire().pages[CHEMIN] || {}).b || null;

    var relever = function () {
      var s = nombre(elS), t = nombre(elT);
      if (s === null || t === null || t <= 0 || s > t) return;
      maj(function (p) {
        p.b = (!avant || (s / t) >= (avant[0] / avant[1])) ? [s, t] : avant;
        if (!p.m) {
          var r = s / t;
          p.s = r >= 0.8 ? 'ok' : (r < 0.5 ? 'err' : 'dur');
          p.sd = Date.now();
        }
      });
      peindre();
    };

    var obs = new MutationObserver(relever);
    obs.observe(elS, { childList: true, characterData: true, subtree: true });
    obs.observe(elT, { childList: true, characterData: true, subtree: true });
    window.addEventListener('pagehide', relever);
  }

  /* ---------------------------------------------------------------
     7. WIDGET FLOTTANT (arabe, RTL)
     Rendu dans un Shadow DOM : il doit s'afficher par-dessus des
     dizaines de milliers de pages aux CSS tres differents sans jamais
     entrer en collision avec elles.

     Note typographique : aucun letter-spacing nulle part. L'arabe est
     cursif — espacer les lettres casse les liaisons et rend le mot
     illisible.
     --------------------------------------------------------------- */

  var CSS =
    ':host{all:initial}' +
    '*{box-sizing:border-box;font-family:"IBM Plex Sans Arabic","Noto Naskh Arabic",' +
      '"Segoe UI",system-ui,sans-serif;letter-spacing:0}' +
    '.zone{position:fixed;inset-inline-start:16px;bottom:16px;' +
      'bottom:calc(16px + env(safe-area-inset-bottom));z-index:2147483000;' +
      'display:flex;flex-direction:column;align-items:flex-start;gap:10px;direction:rtl}' +
    '.fab{width:54px;height:54px;border-radius:50%;border:none;cursor:pointer;' +
      'background:#2563eb;color:#fff;font-size:23px;line-height:1;' +
      'box-shadow:0 4px 16px rgba(0,0,0,.28);display:flex;align-items:center;justify-content:center}' +
    '.fab:active{transform:scale(.94)}' +
    '.fab.aime{background:#dc2626}' +
    '.pan{background:#fff;color:#111827;border-radius:14px;padding:11px;min-width:238px;' +
      'box-shadow:0 10px 34px rgba(0,0,0,.3);display:none;line-height:1.85}' +
    '.pan.ouvert{display:block}' +
    '.tt{font-size:12px;color:#6b7280;margin:2px 4px 9px;font-weight:500}' +
    '.rg{display:flex;gap:6px;margin-bottom:8px}' +
    '.b{flex:1;border:1px solid #e5e7eb;background:#fff;border-radius:10px;padding:9px 4px;' +
      'font-size:12.5px;color:#374151;cursor:pointer;text-align:center;line-height:1.7;font-family:inherit}' +
    '.b em{display:block;font-style:normal;font-size:17px;line-height:1.3}' +
    '.b:active{background:#f3f4f6}' +
    '.b[aria-pressed="true"]{font-weight:700}' +
    '.b[aria-pressed="true"][data-s="ok"]{border-color:#16a34a;background:#f0fdf4;color:#15803d}' +
    '.b[aria-pressed="true"][data-s="err"]{border-color:#dc2626;background:#fef2f2;color:#b91c1c}' +
    '.b[aria-pressed="true"][data-s="dur"]{border-color:#d97706;background:#fffbeb;color:#b45309}' +
    '.b[aria-pressed="true"][data-s="fav"]{border-color:#dc2626;background:#fef2f2;color:#dc2626}' +
    '.go{display:block;width:100%;text-align:center;background:#111827;color:#fff;' +
      'text-decoration:none;border-radius:10px;padding:11px;font-size:13.5px;font-weight:600}' +
    '@media (prefers-color-scheme:dark){' +
      '.pan{background:#1f2937;color:#f9fafb}' +
      '.b{background:#374151;border-color:#4b5563;color:#e5e7eb}' +
      '.go{background:#2563eb}}';

  var HTML =
    '<div class="zone">' +
      '<div class="pan" id="pan">' +
        '<div class="tt">هذا التمرين</div>' +
        '<div class="rg">' +
          '<button class="b" data-s="ok"  aria-pressed="false"><em>✅</em>نجحت</button>' +
          '<button class="b" data-s="err" aria-pressed="false"><em>❌</em>أخطأت</button>' +
          '<button class="b" data-s="dur" aria-pressed="false"><em>😓</em>صعب</button>' +
        '</div>' +
        '<div class="rg">' +
          '<button class="b" data-s="fav" aria-pressed="false" style="flex:1">' +
            '<em id="ic">♡</em><span id="lb">احفظ التمرين</span></button>' +
        '</div>' +
        '<a class="go" id="go">📚 دفتري</a>' +
      '</div>' +
      '<button class="fab" id="fab" aria-label="حفظ التمرين أو وسمه">♡</button>' +
    '</div>';

  var racine = null;

  function construire() {
    var hote = document.createElement('div');
    hote.id = 'devoirati-histo';
    racine = hote.attachShadow ? hote.attachShadow({ mode: 'open' }) : hote;
    var st = document.createElement('style'); st.textContent = CSS; racine.appendChild(st);
    var bo = document.createElement('div'); bo.innerHTML = HTML; racine.appendChild(bo);
    document.body.appendChild(hote);

    racine.getElementById('fab').addEventListener('click', function () {
      racine.getElementById('pan').classList.toggle('ouvert');
    });
    racine.getElementById('go').setAttribute('href', PAGE_HISTO);

    Array.prototype.forEach.call(racine.querySelectorAll('.b'), function (b) {
      b.addEventListener('click', function () {
        var s = b.getAttribute('data-s');
        maj(function (p) {
          if (s === 'fav') { p.f = p.f ? 0 : 1; p.fd = Date.now(); }
          else { p.s = (p.s === s) ? null : s; p.m = p.s ? 1 : 0; p.sd = Date.now(); }
        });
        peindre();
      });
    });
    peindre();
  }

  function peindre() {
    if (!racine) return;
    var p = lire().pages[CHEMIN] || {};
    var fab = racine.getElementById('fab');
    fab.textContent = p.f ? '♥' : '♡';
    fab.classList.toggle('aime', !!p.f);
    racine.getElementById('ic').textContent = p.f ? '♥' : '♡';
    racine.getElementById('lb').textContent = p.f ? 'محفوظ' : 'احفظ التمرين';
    Array.prototype.forEach.call(racine.querySelectorAll('.b'), function (b) {
      var s = b.getAttribute('data-s');
      b.setAttribute('aria-pressed', String(s === 'fav' ? !!p.f : p.s === s));
    });
  }

  /* ---------------------------------------------------------------
     8. API PUBLIQUE
     --------------------------------------------------------------- */

  window.Devoirati = {
    lire: lire, ecrire: ecrire, fusionner: fusionner,
    code: code, lierCode: lierCode,
    tirer: tirer, pousser: pousser,
    cle: CLE, cleCode: CLE_CODE,
    chemin: function () { return CHEMIN; },
    resultat: function (score, total) {
      maj(function (p) {
        if (typeof score === 'number' && typeof total === 'number' && total > 0) {
          if (!p.b || (score / total) > (p.b[0] / p.b[1])) p.b = [score, total];
          if (!p.m) {
            var r = score / total;
            p.s = r >= 0.8 ? 'ok' : (r < 0.5 ? 'err' : 'dur');
            p.sd = Date.now();
          }
        }
      });
      peindre();
    },
    favori: function () {
      maj(function (p) { p.f = p.f ? 0 : 1; p.fd = Date.now(); });
      peindre();
    }
  };

  /* ---------------------------------------------------------------
     9. DEMARRAGE
     La page « dfatri » charge le meme fichier pour partager le
     stockage et la fusion, mais ne veut evidemment pas du bouton
     flottant par-dessus elle-meme.
     --------------------------------------------------------------- */

  function demarrer() {
    var estHisto = document.body.getAttribute('data-devoirati') === 'historique';
    if (!estHisto) {
      enregistrerVisite();
      try { construire(); } catch (e) {}      // une page cassee ne doit jamais bloquer l'eleve
      try { surveillerScore(); } catch (e) {}
    }
    try { tirerSiNecessaire(function (recu) { if (recu) peindre(); }); } catch (e) {}

    window.addEventListener('pagehide', deposerSiSale);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') deposerSiSale();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();
})();
