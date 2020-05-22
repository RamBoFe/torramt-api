import TransmissionClient from 'transmission-client';
import pick from 'lodash.pick';
import config from './config.mjs';

const CONFIG = {
  host: 'alcyoneus.feralhosting.com',
  username: '',
  password: config.get('transmission:pwd'),
  url: '/jillnax/transmission/rpc',
  port: 443,
  ssl: true,
};

const DL_DIR = '/media/sdai1/jillnax/private/rtorrent/data/RamBoF';
const TransClient = new TransmissionClient.Transmission(CONFIG);

export default async function addTorrentToDl(torrentFile) {
  const infos = await TransClient.addBase64(torrentFile.toString('base64'),
    {
      'download-dir': DL_DIR,
    });
  return infos;
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
