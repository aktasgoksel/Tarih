import puppeteer from 'puppeteer';

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  page.on('requestfailed', request => console.log('BROWSER REQUEST FAILED:', request.url(), request.failure()?.errorText));

  console.log("Navigating to live site...");
  await page.goto('https://aktasgoksel.github.io/Tarih/', { waitUntil: 'networkidle2' });
  
  console.log("Waiting for auth screen...");
  await page.waitForSelector('#login-email', { visible: true });

  console.log("Clicking Kayıt Ol...");
  await page.click('#toggle-register');
  
  await new Promise(r => setTimeout(r, 1000));

  console.log("Filling registration...");
  await page.type('#register-username', 'TestUser123');
  await page.type('#register-email', 'test9999@test.com');
  await page.type('#register-password', 'password123');
  
  console.log("Submitting registration...");
  await page.click('#register-btn');

  console.log("Waiting 10 seconds for app to initialize...");
  await new Promise(r => setTimeout(r, 10000));
  
  console.log("Checking if verify screen or app screen is visible...");
  // They have email verification! We might get stuck on verify screen!
  // If email verification is required, we can't bypass it unless we use Firebase Admin SDK to verify the user.
  
  await browser.close();
})();
