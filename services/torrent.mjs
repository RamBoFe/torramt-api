import TorrentSearchApi from 'torrent-search-api';
import config from './config';

const PRIVATE_PROVIDER_CONFIG = [
  {
    name: 'YggTorrent',
    login: config.get('ygg:user'),
    pass: config.get('ygg:pwd'),
  },
];

function activeProviderIfExist(providerName, credentials = {}) {
  let isProviderActive = TorrentSearchApi.isProviderActive(providerName);

  if (!isProviderActive) {
    const provider = TorrentSearchApi.getProviders()
      .filter(p => p.name === providerName);

    if (!provider.public) {
      if (credentials
        && (credentials.login && credentials.pass)) {
        TorrentSearchApi.enableProvider(providerName, credentials.login, credentials.pass);
      } else {
        throw new Error('Private provider : keys \'login\' and \'pass\' missing.');
      }
    } else {
      TorrentSearchApi.enableProvider(providerName);
    }
    isProviderActive = true;
  }
  return isProviderActive;
}

export default async function searchTorrents(providerName, search) {
  const providerConfig = PRIVATE_PROVIDER_CONFIG.find(p => p.name === providerName) || {};
  const isActiveProvider = activeProviderIfExist(providerName, providerConfig);
  const torrents = await TorrentSearchApi.search(search);

  return isActiveProvider ? torrents : [];
}

export async function dlTorrentFile(torrent) {
  const buffer = TorrentSearchApi.downloadTorrent(torrent);
  return buffer;
}

export async function torrentDetails(torrent) {
  const details = await TorrentSearchApi.getTorrentDetails(torrent);
  return details;
}
