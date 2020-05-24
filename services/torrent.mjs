import TorrentSearch from 'torrent-search-api';
import config from './config.mjs';

const PROVIDERS_CONFIG = [
  {
    name: 'YggTorrent',
    login: config.get('ygg:user'),
    pass: config.get('ygg:pwd'),
    domainUrl: 'http://localhost:2223/go?url=',
    baseUrl: 'http://localhost:2223/go?url=https://www2.yggtorrent.se',
  },
];

(() => {
  PROVIDERS_CONFIG.forEach(async (provider) => {
    if (provider.login && provider.pass) {
      TorrentSearch.enableProvider(provider.name, provider.login, provider.pass);

      if (provider.name === 'YggTorrent') {
        const yggTorrentProvider = TorrentSearch.getProvider('Yggtorrent');
        yggTorrentProvider.baseUrl = PROVIDERS_CONFIG.find(p => p.name === 'YggTorrent').baseUrl;
        yggTorrentProvider.enableCloudFareBypass = false;
      }
    } else {
      TorrentSearch.enableProvider(provider.name);
    }
  });
})();

export function getActiveProvidersWithCategories() {
  const activeProviders = TorrentSearch.getActiveProviders();
  return activeProviders;
}

export default async function searchTorrents(search, category, ...providersName) {
  const results = await TorrentSearch.search(providersName, search, category);

  results.map(torrent => Object.assign(torrent, {
    desc: `${PROVIDERS_CONFIG.find(p => p.name === 'YggTorrent').domainUrl + torrent.desc}`,
  }));

  return results;
}

export async function dlTorrentFile(torrent) {
  const buffer = await TorrentSearch.downloadTorrent(torrent);
  return buffer;
}

export async function getTorrentDetails(torrent) {
  const details = await TorrentSearch.getTorrentDetails(torrent);
  return details;
}
