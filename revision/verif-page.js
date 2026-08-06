// Ouvre la feuille de révision dans un vrai navigateur, clique une rubrique,
// puis un exercice, et rapporte TOUTE erreur de console. C'est ce contrôle qui
// manquait : le bug d'hier — el('#niv') valant null — tuait le script à la
// première ligne, et rien ne le disait.
const { chromium } = require('playwright');
(async () => {
  const nav = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await nav.newPage();
  const fautes = [];
  page.on('pageerror', e => fautes.push('ERREUR ' + e.message));
  page.on('console', m => { if (m.type() === 'error') fautes.push('CONSOLE ' + m.text()); });
  await page.goto('file://' + process.argv[2]);
  await page.waitForTimeout(600);
  const rubs = await page.$$('button.rub');
  console.log('rubriques trouvées :', rubs.length);
  if (rubs.length) {
    await page.$$eval('details', d => d.forEach(x => x.open = true));
    await page.waitForTimeout(200);
    const r = (await page.$$('button.rub'))[0];
    await r.click(); await page.waitForTimeout(1500);
    const exos = await page.$$('.exo-btn');
    console.log('exercices dépliés :', exos.length);
    if (exos.length) {
      await exos[0].click(); await page.waitForTimeout(400);
      console.log('avis :', (await page.textContent('#avis')).trim());
      console.log('feuille remplie :', (await page.$$('.exo')).length > 0);
    }
  }
  console.log(fautes.length ? 'FAUTES:\n' + fautes.join('\n') : 'aucune erreur de console');
  await nav.close();
})();
