const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const htmlPath = path.resolve(__dirname, '..', 'docs', 'Project-Scope-Chart.html');
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'));
  await page.pdf({
    path: path.resolve(__dirname, '..', 'docs', 'CarePath-Project-Scope-Chart.pdf'),
    format: 'Letter',
    printBackground: true,
    margin: { top: '0.3in', bottom: '0.3in', left: '0.3in', right: '0.3in' },
  });
  await browser.close();
  console.log('PDF generated');
})();
