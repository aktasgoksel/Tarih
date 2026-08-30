import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  page.on('requestfailed', request => console.log('BROWSER REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('https://aktasgoksel.github.io/Tarih/', { waitUntil: 'networkidle2' });
  
  // Call the global function!
  try {
      await page.evaluate(async () => {
         // Fire the load manually since we aren't logged in
         console.log("Manually firing load...");
         // Wait, loadTestsFromFirestore is NOT global! It's an internal function in main.js.
         // BUT wait, it's bundled. It's not accessible globally.
         // But I can evaluate my own Firebase fetch!
      });
  } catch(e) {}
  
  await browser.close();
})();
