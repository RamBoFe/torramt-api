import TransmissionClient from 'transmission-client';

const CONFIG = {
  host: 'alcyoneus.feralhosting.com',
  username: '',
  password: 'hFeRxu0FQqBYfWOo',
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
    torrent => fields.map(
      field => torrent[field],
    ),
  );
}
