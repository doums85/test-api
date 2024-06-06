const app = require('express')();

let chromium = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chromium = require('@sparticuz/chromium');
  puppeteer = require('puppeteer-core');
} else {
  puppeteer = require('puppeteer');
}

app.get('/api', async (req, res) => {
  console.log('Request received');
  let options = {};
  console.log(
    'AWS_LAMBDA_FUNCTION_VERSION',
    process.env.AWS_LAMBDA_FUNCTION_VERSION
  );
  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    chromium.setGraphicsMode = false;

    options = {
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    };
  }

  try {
    let browser = await puppeteer.launch(options);
    console.log('Browser launched');
    let page = await browser.newPage();
    console.log('Page opened');
    await page.goto('https://www.google.com');
    res.send(await page.title());
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error');
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started');
});

module.exports = app;
