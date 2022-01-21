import config from "./config.mjs";
import axios from 'axios';
import moment from "moment";

const CLOUDFLARE_SESSION_TIMEOUT = 10;

const BYPASS_DATA = {
  clearance: '',
  userAgent: '',
  time: moment().subtract(CLOUDFLARE_SESSION_TIMEOUT + 1, 'minutes')
};

export default async function getBypassData(url) {
  const response = await axios.post(`${config.get('cloudflare:bypass_url')}`,
    {
      cmd: 'request.get',
      url
    },
    {
      headers: { 'Content-Type': 'application/json' }
    });


  const clearance = response.data.solution.cookies.find(cookie => cookie.name === 'cf_clearance');
  BYPASS_DATA.clearance = `cf_clearance=${clearance.value};`;
  BYPASS_DATA.userAgent = response.data.solution.userAgent;
  BYPASS_DATA.time = moment();

  return BYPASS_DATA;
}

export function isBypassDataMustRefreshed() {
  return moment().diff(BYPASS_DATA.time, 'minutes') > CLOUDFLARE_SESSION_TIMEOUT;
}

