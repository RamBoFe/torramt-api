import Router from 'koa-router';
import list, { calculateSize, del } from '../services/ftp';

const router = new Router();

router.get('/', async (ctx) => {
  const { path } = ctx.query;
  ctx.body = await list(path);
});

router.get('/size', async (ctx) => {
  const { path } = ctx.query;
  ctx.body = await calculateSize(path);
});

router.del('/delete', async (ctx) => {
  const { path, type } = ctx.query;

  try {
    await del(path, type);
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, `Impossible de supprimer la ressource (${e.message}).`);
  }
});

export default router.routes();
