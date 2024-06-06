const app = require('express')();

let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require('@sparticuz/chromium');
  puppeteer = require('puppeteer-core');
} else {
  puppeteer = require('puppeteer');
}

app.get('/api', async (req, res) => {
  console.log('Request received');
  let options = {};

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    chrome.setHeadlessMode = true;

    // Optional: If you'd like to disable webgl, true is the default.
    chrome.setGraphicsMode = false;

    options = {
      args: chrome.args,
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath(),
      headless: chrome.headless,
    };
  }

  try {
    let browser = await puppeteer.launch(options);
    console.log('Browser launched');
    let page = await browser.newPage();
    await page.goto('https://www.google.com');
    res.send(await page.title());
  } catch (err) {
    console.error(err);
    return null;
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started');
});

module.exports = app;
