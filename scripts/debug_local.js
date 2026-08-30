import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle2' });
  
  await page.waitForSelector('#login-username', { visible: true });

  await page.evaluate(() => window.switchAuth('register'));
  await new Promise(r => setTimeout(r, 1000));
  
  await page.type('#register-username', 'TestUser123');
  await page.type('#register-email', 'test9999@test.com');
  await page.type('#register-password', 'password123');
  await page.click('#register-btn');

  await new Promise(r => setTimeout(r, 5000));
  
  await page.evaluate(() => window.switchAuth('login'));
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => document.getElementById('login-username').value = '');
  await page.evaluate(() => document.getElementById('login-password').value = '');
  
  await page.type('#login-username', 'test9999@test.com');
  await page.type('#login-password', 'password123');
  await page.click('#login-btn');

  await new Promise(r => setTimeout(r, 5000));
  
  const title = await page.$eval('#current-test-title', el => el.textContent).catch(() => 'NOT FOUND');
  console.log("Final title text:", title);
  
  const dropdownHTML = await page.$eval('#test-dropdown', el => el.innerHTML).catch(() => 'NOT FOUND');
  console.log("Dropdown HTML:", dropdownHTML);

  await browser.close();
  process.exit(0);
})();
