/* Devoirati — connecteur d'exercice.
 * À inclure dans une page d'exercice :
 *   <script src="app/assets/devoirati-exercice.js"></script>
 * Puis, quand l'élève a un résultat :
 *   Devoirati.enregistrer({ chapitre_id:'fractions-simplification', theme:'fractions',
 *                           activite_nom:'Simplification', score:1, total:1 });
 *
 * Si l'élève n'est pas connecté (ou hors ligne / fichier local), l'exercice
 * continue de fonctionner normalement : le connecteur ne fait rien.
 */
(function (g) {
  'use strict';
  var src = (document.currentScript && document.currentScript.src) || '';
  var API = src.replace(/assets\/devoirati-exercice\.js.*$/, '') + '../backend/';

  var eleve = null, ready = false;

  async function loadSession() {
    try {
      var res = await fetch(API + 'session.php', { credentials: 'same-origin' });
      var d = await res.json();
      if (d && d.ok && d.connecte && d.user && d.user.role === 'eleve') eleve = d.user;
    } catch (e) { /* hors ligne : on ignore */ }
    ready = true;
  }

  function toast(msg) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.setAttribute('style', [
      'position:fixed', 'left:50%', 'bottom:24px', 'transform:translateX(-50%)',
      'background:#1F9D63', 'color:#fff', 'font:700 15px/1.2 system-ui,Segoe UI,Arial,sans-serif',
      'padding:12px 18px', 'border-radius:12px', 'box-shadow:0 8px 24px -6px rgba(0,0,0,.35)',
      'z-index:99999', 'opacity:0', 'transition:opacity .25s, bottom .25s', 'direction:ltr'
    ].join(';'));
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.style.opacity = '1'; t.style.bottom = '34px'; });
    setTimeout(function () { t.style.opacity = '0'; setTimeout(function () { t.remove(); }, 300); }, 2600);
  }

  async function enregistrer(p) {
    if (!ready) await loadSession();
    if (!eleve) return { ok: false, hors_ligne: true };
    try {
      var res = await fetch(API + 'save_progress.php', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p || {})
      });
      var d = await res.json();
      if (d && d.ok) {
        var msg = '+' + d.gain_xp + ' XP';
        if (d.level_up) msg += ' · Niveau ' + d.niveau + ' 🎉';
        if (d.nouveaux_badges && d.nouveaux_badges.length) msg += ' · nouveau badge 🏅';
        toast(msg);
      }
      return d;
    } catch (e) { return { ok: false }; }
  }

  g.Devoirati = {
    enregistrer: enregistrer,
    estConnecte: function () { return !!eleve; },
    pret: function () { return loadSession(); }
  };
  loadSession();
})(window);
