import TorrentSearchApi from 'torrent-search-api';

const PRIVATE_PROVIDER_CONFIG = [
  {
    name: 'YggTorrent',
    login: 'chancette',
    pass: 'rivenBot19!',
  },
];

function activeProviderIfExist(providerName, credentials = {}) {
  const isProviderActive = TorrentSearchApi.isProviderActive(providerName);

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
    return true;
  }
  return false;
}

export default async function searchTorrents(providerName, search) {
  const config = PRIVATE_PROVIDER_CONFIG.find(p => p.name === providerName) || {};
  const isActiveProvider = activeProviderIfExist(providerName, config);
  const torrents = await TorrentSearchApi.search(search);

  return isActiveProvider ? torrents : [];
}

export async function dlTorrentFile(torrent) {
  const torrentFile = await TorrentSearchApi.downloadTorrent(torrent);
  return torrentFile;
}
