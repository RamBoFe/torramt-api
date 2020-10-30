import TransmissionClient from 'transmission-client';
import pick from 'lodash.pick';
import config from './config.mjs';

const CONFIG = {
  host: config.get('seedbox:host'),
  username: config.get('seedbox:user'),
  password: config.get('seedbox:pwd'),
  url: config.get('seedbox:url'),
  port: config.get('seedbox:port'),
  ssl: (config.get('seedbox:port') === '443'),
};

const DL_DIR = config.get('seedbox:dl_path');
const TransClient = new TransmissionClient.Transmission(CONFIG);

export default function addTorrentToDl(torrentFile) {
  return TransClient.addBase64(Buffer.from(torrentFile).toString('base64'),
    {
      'download-dir': DL_DIR,
    });
}

export async function getTorrents(fields) {
  const { torrents } = await TransClient.get();
  return torrents.map(
    torrent => pick(torrent, fields),
  ).reverse();
}

export async function remove(hashString) {
  const infos = await TransClient.remove(hashString, true);
  return infos;
}

export async function start(hashString) {
  const infos = await TransClient.start(hashString);
  return infos;
}
export async function stop(hashString) {
  const infos = await TransClient.stop(hashString);
  return infos;
}
