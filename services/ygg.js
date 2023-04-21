import TorrentSearch from 'torrent-search-api';
import config from './config.mjs';
import getCloudflareByPassData, { isBypassDataMustRefreshed as isCloudflareBypassDataMustRefreshed } from './cloudflare.mjs';

export const CONFIG = {
  name: 'Yggtorrent',
  login: config.get('ygg:user'),
  pass: config.get('ygg:pwd'),
};

const yggTorrentProvider = TorrentSearch.getProvider('Yggtorrent');

export default function overrideConfig() {
  yggTorrentProvider.overrideConfig({
    baseUrl: config.get('ygg:url'),
    enableCloudFareBypass: false,
  });
}

export async function setCloudFlareBypass() {
  if (isCloudflareBypassDataMustRefreshed()) {
    const cloudflareBypassData = await getCloudflareByPassData(yggTorrentProvider.baseUrl);

    if (cloudflareBypassData) {
      yggTorrentProvider.headers = {
        'User-Agent': cloudflareBypassData.userAgent,
      };
      yggTorrentProvider.setCookies([
        cloudflareBypassData.clearance,
      ]);
    }
  }
}
