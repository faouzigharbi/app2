// Prend un exercice à PLUSIEURS questions et vérifie que la feuille les
// imprime TOUTES — c'est la règle du maître : jamais de troncature.
const { chromium } = require('playwright');
(async () => {
  const nav = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await nav.newPage();
  await page.goto('file://' + process.argv[2]);
  await page.waitForTimeout(500);
  await page.$$eval('details', d => d.forEach(x => x.open = true));
  // On cherche une rubrique du brevet, qui a de longs exercices.
  const rubs = await page.$$('button.rub');
  for (const r of rubs) {
    const t = await r.getAttribute('data-c');
    if (t !== 'brevet') continue;
    await r.click(); await page.waitForTimeout(1200);
    const btn = (await page.$$('.exo-btn'))[0];
    if (!btn) break;
    const lbl = (await btn.textContent()).trim();
    await btn.click(); await page.waitForTimeout(400);
    const txt = await page.textContent('.exo .enonce');
    const n = (txt.match(/\d+\)/g) || []).length;
    console.log('bouton :', lbl, '| questions imprimées :', n);
    console.log('extrait :', txt.replace(/\s+/g, ' ').slice(0, 150));
    break;
  }
  await nav.close();
})();
