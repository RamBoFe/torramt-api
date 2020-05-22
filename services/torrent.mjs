import TorrentSearch from 'torrent-search-api';
import config from './config.mjs';

const PROVIDERS_CONFIG = [
  {
    name: 'YggTorrent',
    login: config.get('ygg:user'),
    pass: config.get('ygg:pwd'),
  },
];

(() => {
  PROVIDERS_CONFIG.forEach((provider) => {
    if (provider.login && provider.pass) {
      TorrentSearch.enableProvider(provider.name, provider.login, provider.pass);
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
