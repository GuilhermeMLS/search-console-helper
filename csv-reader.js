const csv = require('csv-parser');
const fs = require('fs');
const puppeteer = require('puppeteer');

async function processURL(url) {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15');
        await page.goto('https://www.google.com/webmasters/tools/removals?pli=1');

        const elementHandle = await page.waitForSelector('.whsOnd');
        await elementHandle.type('YOUR_EMAIL');
        await page.click(".CwaK9");

        await page.waitForSelector('input[type="password"]', { visible: true });
        await page.type('input[type="password"]', 'YOUR_PASSWORD');
        await page.waitForSelector('#passwordNext', { visible: true });
        await page.click('#passwordNext');

        const elementHandle2 = await page.waitForSelector('.gwt-TextBox');
        await elementHandle2.type(url);
        await page.click(".JX0GPIC-k-a");

        //Solicita remoção
        await page.waitForSelector('button[aria-labelledby="gwt-uid-88"', { visible: true });
        await page.click('button[aria-labelledby="gwt-uid-88"');
        processed++;
        console.log('URLs processadas: '+processed);
        await browser.close();
    } catch (e) {
        console.log('our error', e);
    }
}
let processed = 0;
var urls = [];
i = 0;
fs.createReadStream('YOUR_SHEET.csv')
    .pipe(csv({ separator: ';' }))
    .on('data', (row) => {
        //if(!row.URL.includes('FILTER_WORD')){
            urls.push(row.URL)
        //}
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
        (async function myFlow() {
            for (let i = 0; i < urls.length; i++) {
                await processURL(urls[i]);
            }
        })();

    });



