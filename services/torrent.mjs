import config from './config.mjs';
import TorrentSearch from 'torrent-search-api';
import yggOverrideConfig, { setCloudFlareBypass, CONFIG as YGG_CONFIG } from "./ygg.js";

const PROVIDERS_CONFIG = [
  YGG_CONFIG
];

(() => init())();

export function getActiveProvidersWithCategories() {
  return TorrentSearch.getActiveProviders();
}

export default async function searchTorrents(search, category, providerName) {
  if (providerName === 'Yggtorrent' && config.get('cloudflare:enable') === 'true') {
    await setCloudFlareBypass();
  }

  return TorrentSearch.search([providerName], search, category);
}

export function dlTorrentFile(torrent) {
  return TorrentSearch.downloadTorrent(torrent);
}

export function getTorrentDetails(torrent) {
  return TorrentSearch.getTorrentDetails(torrent);
}

function init() {
  PROVIDERS_CONFIG.forEach(async (provider) => {
    if (provider.login && provider.pass) {
      TorrentSearch.enableProvider(provider.name, provider.login, provider.pass);

      if (provider.name === 'Yggtorrent') {
        yggOverrideConfig();
      }
    } else {
      TorrentSearch.enableProvider(provider.name);
    }
  });
}
