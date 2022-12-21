const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context, callback) => {
  //const params = JSON.parse(event.body);

  let res = null;
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true
    });

    let page = await browser.newPage();

		await page.goto(event.url); // || params.url);

    let title = await page.title();
    let body = { title };

    res = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods" : "OPTIONS,POST",
        "X-Requested-With" : "*"
      },
      body: JSON.stringify(body)
    };

  } catch (error) {
    return callback(error);
  } finally {
    if (browser !== null)
      await browser.close();
  }

  return callback(null, res);
};
