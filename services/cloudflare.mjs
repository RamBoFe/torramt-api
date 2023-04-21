import config from "./config.mjs";
import axios from 'axios';
import moment from "moment";

const CLOUDFLARE_SESSION = {
  timeout: 10,
  elapsed: moment().subtract(10 + 1, 'minutes')
};
Object.defineProperty(CLOUDFLARE_SESSION, 'timeout', {
  writable: false
})

export default async function getBypassData(url) {
  try {
    const response = await axios.post(`${config.get('cloudflare_bypass_url')}`,
      {
        cmd: 'request.get',
        url
      },
      {
        headers: { 'Content-Type': 'application/json' }
      });

    const clearance = response.data.solution.cookies.find(cookie => cookie.name === 'cf_clearance');

    if (clearance) {
      CLOUDFLARE_SESSION.elapsed = moment();
      return {
        clearance: `cf_clearance=${clearance.value};`,
        userAgent: response.data.solution.userAgent
      }

    }
  } catch (e) {
    throw new Error('Un problème est survenue lors de la résolution du challenge Cloudflare : ', e);
  }

  return false;
}

export function isBypassDataMustRefreshed() {
  return moment().diff(CLOUDFLARE_SESSION.elapsed, 'minutes') > CLOUDFLARE_SESSION.timeout;
}
