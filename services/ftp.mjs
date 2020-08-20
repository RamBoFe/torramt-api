import Ssh2SftpClient from 'ssh2-sftp-client';
import config from './config.mjs';

const FTP_CONFIG = {
  host: config.get('ftp:host'),
  port: config.get('ftp:port'),
  username: config.get('ftp:user'),
  password: config.get('ftp:pwd'),
};

export default async function list(path = '/') {
  const sftp = new Ssh2SftpClient();
  await sftp.connect(FTP_CONFIG, 'on');

  const contents = (await sftp.list(`${config.get('ftp:default_path')}${path}`))
    .map(f => (
      {
        type: f.type,
        name: f.name,
        size: f.size,
        modifyTime: f.modifyTime,
      }
    ));

  return contents.filter(c => c.type === 'd')
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .concat(
      contents.filter(c => c.type !== 'd')
        .sort((a, b) => (a.name > b.name ? 1 : -1)),
    );
}

export async function del(path, type = 'd') {
  const sftp = new Ssh2SftpClient();
  await sftp.connect(FTP_CONFIG, 'on');

  const remoteRessource = `${config.get('ftp:default_path')}/${path}`;

  if (type === 'd') {
    await sftp.rmdir(remoteRessource, true);
  } else {
    await sftp.delete(remoteRessource);
  }

  await sftp.end();
}


export async function calculateSize(path) {
  const listItems = await list(path);

  const sizeFiles = listItems
    .filter(item => item.type !== 'd')
    .reduce((acc, item) => acc + item.size, 0);

  const sizeFolders = listItems
    .filter(e => e.type === 'd')
    .map(async (e) => {
      const listFolder = await list(`${path}/${e.name}`);
      return listFolder.reduce((acc, file) => acc + file.size, 0);
    });

  return Promise.all(sizeFolders).then(
    item => sizeFiles + item.reduce((acc, size) => acc + size, 0),
  );
}
