// import puppeteer from 'puppeteer-extra';
// import stealthPlugin from 'puppeteer-extra-plugin-stealth';
// import adBlockerPlugin from 'puppeteer-extra-plugin-adblocker';
//
// puppeteer.use(adBlockerPlugin());
// puppeteer.use(stealthPlugin());
//
// export const HEADERS_TO_REMOVE = [
//   'host',
//   'user-agent',
//   'accept',
//   'accept-encoding',
//   'content-length',
//   'forwarded',
//   'x-forwarded-proto',
//   'x-forwarded-for',
//   'x-cloud-trace-context',
// ];
// export const RESPONSE_HEADERS_TO_REMOVE = [
//   'Accept-Ranges',
//   'Content-Length',
//   'Keep-Alive',
//   'Connection',
//   'content-encoding',
//   'set-cookie',
// ];
//
// let browser;
// export default async function launchPuppeteer() {
//   if (!browser) {
//     browser = await puppeteer.launch({
//       headless: true,
//       args: ['--no-sandbox', '--disable-setuid-sandbox'],
//     });
//   }
//
//   return browser;
// }
