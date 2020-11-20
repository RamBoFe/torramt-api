import TorrentSearch from 'torrent-search-api';
import config from './config.mjs';

const SERVER_URL = `${config.get('node:protocol')}://${config.get('node:domain')}:${config.get('node:port')}`;
const PROVIDERS_CONFIG = [
  {
    name: 'Yggtorrent',
    login: config.get('ygg:user'),
    pass: config.get('ygg:pwd'),
    domainUrl: `${SERVER_URL}/go?url=`,
    baseUrl: `${SERVER_URL}/go?url=${config.get('ygg:url')}`,
  },
];

(() => {
  PROVIDERS_CONFIG.forEach(async (provider) => {
    if (provider.login && provider.pass) {
      TorrentSearch.enableProvider(provider.name, provider.login, provider.pass);

      if (provider.name === 'Yggtorrent1') {
        const yggTorrentProvider = TorrentSearch.getProvider('Yggtorrent');
        yggTorrentProvider.baseUrl = PROVIDERS_CONFIG.find(p => p.name === 'Yggtorrent').baseUrl;
        yggTorrentProvider.enableCloudFareBypass = false;
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
  const results = await TorrentSearch.search(providersName, search, category);

  // results.map(torrent => Object.assign(torrent, {
  //   desc: `${PROVIDERS_CONFIG.find(p => p.name === 'Yggtorrent').domainUrl + torrent.desc}`,
  // }));

  return results;
}

export function dlTorrentFile(torrent) {
  return TorrentSearch.downloadTorrent(torrent);
}

export function getTorrentDetails(torrent) {
  return TorrentSearch.getTorrentDetails(torrent);
}
