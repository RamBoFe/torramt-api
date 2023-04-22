import Router from 'koa-router';
import listFiles, { createFolderSync, createTaskSync } from "../services/nas.js";

const router = new Router();

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
      uri: type !== 'd'
        ? `${config.get('ftp:uri')}${path}`
        : `${config.get('ftp:uri')}${path}/`,
      destination: dest,
    });
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, `Impossible de transférer la ressource (${e}).`);
  }
});

router.get('/listFiles', async (ctx) => {
  const { path } = ctx.query;
  const files = await listFiles({folder_path: path});

  ctx.body = files.files;
});

export default router.routes();
