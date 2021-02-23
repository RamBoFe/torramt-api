import TorrentSearch from 'torrent-search-api';
import config from './config.mjs';

const SERVER_URL = `${config.get('node:protocol')}://${config.get('node:domain')}:${config.get('node:port')}`;
const PROVIDERS_CONFIG = [
  {
    name: 'Yggtorrent',
    login: config.get('ygg:user'),
    pass: config.get('ygg:pwd'),
    domainUrl: `${SERVER_URL}/go?url=`,
    // baseUrl: `${SERVER_URL}/go?url=${config.get('ygg:url')}`,
    baseUrl: `${config.get('ygg:url')}`,
  },
];

(() => {
  PROVIDERS_CONFIG.forEach(async (provider) => {
    if (provider.login && provider.pass) {
      TorrentSearch.enableProvider(provider.name, provider.login, provider.pass);

      if (provider.name === 'Yggtorrent') {
        const yggTorrentProvider = TorrentSearch.getProvider('Yggtorrent');
        yggTorrentProvider.baseUrl = PROVIDERS_CONFIG.find(p => p.name === 'Yggtorrent').baseUrl;
        yggTorrentProvider.enableCloudFareBypass = true;
      }
    } else {
      TorrentSearch.enableProvider(provider.name);
    }
  });
})();

export function getActiveProvidersWithCategories() {
  return TorrentSearch.getActiveProviders();
}

export default async function searchTorrents(search, category, ...providersName) {
  return TorrentSearch.search(providersName, search, category);
}

export function dlTorrentFile(torrent) {
  return TorrentSearch.downloadTorrent(torrent);
}

export function getTorrentDetails(torrent) {
  return TorrentSearch.getTorrentDetails(torrent);
}
