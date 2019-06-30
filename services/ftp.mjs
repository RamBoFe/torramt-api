import Ssh2SftpClient from 'ssh2-sftp-client';


const FTP_CONFIG = {
  host: 'alcyoneus.feralhosting.com',
  port: '22',
  username: 'jillnax',
  password: 'saucisson83',
};

const DEFAULT_PATH = '/media/sdai1/jillnax/private/rtorrent/data';

export default async function list(path = '/') {
  const sftp = new Ssh2SftpClient();
  await sftp.connect(FTP_CONFIG);

  const contents = (await sftp.list(`${DEFAULT_PATH}${path}`))
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
