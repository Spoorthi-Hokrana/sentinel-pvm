const puppeteer = require('puppeteer');

(async () => {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    const errors = [];
    
    page.on('pageerror', err => {
        console.log("PAGE ERROR:", err.message);
        errors.push(err.message);
    });
    
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log("CONSOLE ERROR:", msg.text());
            errors.push(msg.text());
        }
    });
    
    await page.goto('http://127.0.0.1:5177', { waitUntil: 'networkidle2' });
    console.log("Captured errors:", JSON.stringify(errors, null, 2));
    await browser.close();
})();
