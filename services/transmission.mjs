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

const FIELDS = [
  'id',
  'name',
  'status',
  'totalSize',
  'hashString',
  'percentDone',
  'uploadRatio',
  'uploadedEver',
  'downloadedEver',
  'rateDownload',
  'rateUpload',
  'leftUntilDone',
  'doneDate',
  'files',
];

export default function addTorrentToDl(torrentFile) {
  return TransClient.addBase64(Buffer.from(torrentFile).toString('base64'),
    {
      'download-dir': DL_DIR,
    });
}

export async function list() {
  const { torrents } = await TransClient.all();

  return torrents.map(
    torrent => pick(torrent, FIELDS),
  ).reverse();
}

export async function get(ids) {
  const { torrents } = await TransClient.get(ids);

  return torrents.map(
    torrent => pick(torrent, FIELDS),
  ).reverse();
}

export async function remove(hash) {
  return TransClient.remove(hash, true);
}

export async function start(hash) {
  return TransClient.start(hash);
}
export async function stop(hash) {
 return TransClient.stop(hash);
}
