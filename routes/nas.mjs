import Router from 'koa-router';
import Nas from 'syno';
import config from '../services/config.mjs';

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
    nas.dl.createTask(params, (error, success) => {
      if (error) {
        reject(error);
      } else {
        resolve(success);
      }
    });
  });
}
function listTasksSync(params) {
  return new Promise((resolve, reject) => {
    nas.dl.listTasks(params, (error, success) => {
      if (error) {
        reject(error);
      } else {
        resolve(success);
      }
    });
  });
}

function createFolderSync(params) {
  return new Promise((resolve, reject) => {
    nas.fs.createFolder(params, (error, success) => {
      if (error) {
        reject(error);
      } else {
        resolve(success);
      }
    });
  });
}

router.get('/transfert', async (ctx) => {
  const { path, type, createSubFolder } = ctx.query;
  let dest = ctx.query.destination;
  const hasSubFolder = !!createSubFolder;

  if (hasSubFolder) {
    const created = await createFolderSync({
      folder_path: `/${dest}`,
      name: createSubFolder,
    });
    ctx.assert(created, 500, 'Le répertoire n\' a pas pu être créé.');
    dest = `${dest}/${createSubFolder}`;
  }

  try {
    await createTaskSync({
      uri: type !== 'd' ? `${URI}${path}` : `${URI}${path}/`,
      destination: dest,
    });
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, `Impossible de transférer la ressource (${e}).`);
  }
});

export default router.routes();
