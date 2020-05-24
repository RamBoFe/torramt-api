import Router from 'koa-router';
import jsesc from 'jsesc';
import launchPuppeteer, { HEADERS_TO_REMOVE, RESPONSE_HEADERS_TO_REMOVE } from '../services/puppeteer.mjs';

const router = new Router();

router.all('/', async (ctx) => {
  const url = ctx.url.replace('/go?url=', '');
  let responseBody;
  let responseHeaders;

  const browser = await launchPuppeteer();
  const page = await browser.newPage();

  if (ctx.method === 'POST') {
    await page.removeAllListeners('request');
    await page.setRequestInterception(true);
    page.on('request', (interceptedRequest) => {
      const data = {
        method: 'POST',
        postData: ctx.request.rawBody,
      };
      interceptedRequest.continue(data);
    });
  }

  const client = await page.target().createCDPSession();
  await client.send('Network.setRequestInterception', {
    patterns: [{
      urlPattern: '*',
      resourceType: 'Document',
      interceptionStage: 'HeadersReceived',
    }],
  });

  await client.on('Network.requestIntercepted', async (e) => {
    const obj = { interceptionId: e.interceptionId };
    if (e.isDownload) {
      await client.send('Network.getResponseBodyForInterception', {
        interceptionId: e.interceptionId,
      }).then((result) => {
        if (result.base64Encoded) {
          console.log(result.body);
          responseBody = Buffer.from(result.body, 'base64');
        }
      });
      obj.errorReason = 'BlockedByClient';
      responseHeaders = e.responseHeaders;
    }
    await client.send('Network.continueInterceptedRequest', obj);
    if (e.isDownload) await page.close();
  });

  const { headers } = ctx;
  HEADERS_TO_REMOVE.forEach((header) => {
    delete headers[header];
  });

  await page.setExtraHTTPHeaders(headers);

  try {
    let response;
    response = await page.goto(url, { timeout: 30000, waitUntil: 'domcontentloaded' });
    if ((await page.content()).includes('cf-browser-verification')) response = await page.waitForNavigation({ timeout: 30000, waitUntil: 'domcontentloaded' });
    responseBody = await page.content();
    responseHeaders = response.headers();
    const cookies = await page.cookies();
    if (cookies) {
      cookies.forEach((cookie) => {
        const {
          name, value, secure, expires, domain, ...options
        } = cookie;
        ctx.cookies.set(cookie.name, cookie.value, options);
      });
    }
    await page.close();
  } catch (error) {
    if (!error.toString().includes('ERR_BLOCKED_BY_CLIENT')) {
      ctx.status = 500;
      ctx.body = error;
    }
  }

  RESPONSE_HEADERS_TO_REMOVE.forEach(header => delete responseHeaders[header]);
  Object
    .keys(responseHeaders)
    .forEach(header => ctx.set(header, jsesc(responseHeaders[header])));
  ctx.body = responseBody;
});

export default router.routes();
