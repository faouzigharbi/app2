/* Devoirati — client commun : session, appels API, aides UI (Phase 1) */
(function (global) {
  'use strict';

  // Base de l'API, déduite de l'emplacement de ce script (…/app/assets/devoirati.js)
  // -> …/backend/ , quel que soit le sous-dossier d'hébergement.
  var src = (document.currentScript && document.currentScript.src) || '';
  var appRoot = src.replace(/assets\/devoirati\.js.*$/, '');
  var API = appRoot + '../backend/';

  // Racine de l'app (pour les redirections entre pages)
  var APP = appRoot; // …/app/

  async function api(path, method, body) {
    var opt = {
      method: method || 'GET',
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json' }
    };
    if (body !== undefined) {
      opt.headers['Content-Type'] = 'application/json';
      opt.body = JSON.stringify(body);
    }
    var res, data;
    try {
      res = await fetch(API + path, opt);
      data = await res.json();
    } catch (e) {
      return { ok: false, error: "Problème de connexion au serveur." };
    }
    return data;
  }

  var Dev = {
    API: API,
    APP: APP,
    api: api,
    get: function (p) { return api(p, 'GET'); },
    post: function (p, b) { return api(p, 'POST', b || {}); },

    // Session courante ({connecte, user})
    session: function () { return api('session.php', 'GET'); },

    // Redirige vers la page du rôle
    homeFor: function (role) {
      return APP + ({
        eleve: 'eleve/tableau-de-bord.html',
        parent: 'parent/tableau-de-bord.html',
        prof: 'prof/tableau-de-bord.html',
        admin: 'admin/tableau-de-bord.html'
      }[role] || 'login.html');
    },

    // Protège une page : exige la session + un rôle. Renvoie l'utilisateur.
    requireRole: async function (roles) {
      var s = await Dev.session();
      if (!s.ok || !s.connecte) { location.href = APP + 'login.html'; return null; }
      if (s.user.must_change_password) { location.href = APP + 'changer-mot-de-passe.html'; return null; }
      if (roles && roles.indexOf(s.user.role) === -1) { location.href = Dev.homeFor(s.user.role); return null; }
      return s.user;
    },

    logout: async function () {
      await api('logout.php', 'POST', {});
      location.href = APP + 'login.html';
    },

    // Aides UI
    el: function (id) { return document.getElementById(id); },
    esc: function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    }); },
    initials: function (nom, prenom) {
      var a = (prenom || nom || '?').trim()[0] || '?';
      var b = (nom || '').trim()[0] || '';
      return (a + b).toUpperCase();
    },
    alert: function (id, msg, kind) {
      var e = Dev.el(id); if (!e) return;
      e.textContent = msg; e.className = 'alert show ' + (kind === 'ok' ? 'ok' : 'err');
    },
    clearAlert: function (id) { var e = Dev.el(id); if (e) e.className = 'alert'; },

    // Barre supérieure standard avec bouton de déconnexion
    topbar: function (user, sousTitre) {
      return '' +
        '<header class="dv-top"><div class="dv-wrap dv-top-in">' +
        '<div class="dv-logo">د</div>' +
        '<div class="dv-brand"><b>Devoirati</b><span>' + Dev.esc(sousTitre || '') + '</span></div>' +
        '<div class="right"><span class="muted">' + Dev.esc((user.prenom ? user.prenom + ' ' : '') + user.nom) +
        ' · ' + Dev.esc(user.role_label || user.role) + '</span>' +
        '<button class="btn ghost sm" id="dvLogout">Déconnexion</button></div>' +
        '</div></header>';
    },
    wireLogout: function () {
      var b = Dev.el('dvLogout'); if (b) b.addEventListener('click', Dev.logout);
    }
  };

  global.Dev = Dev;
})(window);
