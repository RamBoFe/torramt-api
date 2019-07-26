import Router from 'koa-router';
import Nas from 'syno';
import config from '../services/config';

const router = new Router();
const nas = new Nas({
  protocol: 'https',
  host: 'rambof.synology.me',
  port: '5001',
  account: config.get('nas:user'),
  passwd: config.get('nas:pwd'),
});
const FTP_USER = config.get('ftp:user');
const FTP_PWD = config.get('ftp:pwd');

const URI = `ftp://${FTP_USER}:${FTP_PWD}@alcyoneus.feralhosting.com/private/rtorrent/data`;

function createTaskSync(params) {
  return new Promise((resolve, reject) => {
    nas.dl.createTask(params, (error, x) => {
      console.log(x);
      if (x === 0) {
        reject(false);
      } else {
        resolve(x);
      }
    });
  });
}
function listTasksSync(params) {
  return new Promise((resolve, reject) => {
    nas.dl.listTasks(params, (error, x) => {
      console.log(x);
      if (x === 0) {
        reject(false);
      } else {
        resolve(x);
      }
    });
  });
}

router.get('/transfert', async (ctx) => {
  const { path, type } = ctx.query;
  console.log(path);
  console.log(type);

  const uri = `${URI}${path}`;
  const ok = await createTaskSync({ uri, destination: 'music' });
  ctx.body = 'Naass okkk';
});

export default router.routes();
