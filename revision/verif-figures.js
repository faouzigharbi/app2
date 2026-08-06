const { chromium } = require('playwright');
(async () => {
  const nav = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const f of process.argv.slice(2)) {
    const page = await nav.newPage();
    const err = [];
    page.on('pageerror', e => err.push(e.message));
    await page.goto('file://' + f);
    await page.waitForTimeout(900);
    console.log(f.split('/').slice(-2).join('/'),
      '| svg:', (await page.$$('svg.figure')).length,
      '| erreurs:', err.length ? err.join(' ; ') : 'aucune');
    await page.close();
  }
  await nav.close();
})();
