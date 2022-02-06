require("dotenv").config();
const pup = require("puppeteer");
const fs = require("fs");

let lyrics;

fs.readFile("./statuses.txt", 'utf-8', (err, data) => {
    if(err) {
        console.error(err);
        return
    }

    

    lyrics = data.split("\r\n");
    
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

 async function changeStatus(webPage, status) {
    await webPage.click(".avatarWrapper-1B9FTW")
    await webPage.click("div#status-picker-custom-status")
    await webPage.waitForSelector("input.inputDefault-3FGxgL.input-2g-os5.input-3AAlUz")

    const input = await webPage.$("input.inputDefault-3FGxgL.input-2g-os5.input-3AAlUz");
    await input.click({ clickCount: 3});
    await input.type(status);
    await webPage.click("button.button-f2h6uQ.lookFilled-yCfaCM.colorBrand-I6CyqQ.sizeMedium-2bFIHr.grow-2sR_-F");
    await sleep(6000);
 }

async function start() {
    const browser = await pup.launch({headless: true, slowMo: 100});
    const page = await browser.newPage();
    await page.goto("https://discord.com/login");
    await page.type('input[name="email"]', process.env.EMAIL);
    await page.type('input[name="password"]', process.env.PASSWORD);
    await Promise.all([page.click('button[type="submit"]'), page.waitForSelector("input.input-2m5SfJ")]);

   statusLoop(page);

}

async function statusLoop(site){
        while(true) {
            for(const verse of lyrics){
                await changeStatus(site, verse);
            }
        }
}

start();
