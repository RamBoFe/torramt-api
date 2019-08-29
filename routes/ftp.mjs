import Router from 'koa-router';
import list, { calculateSize } from '../services/ftp';

const router = new Router();

router.get('/', async (ctx) => {
  const { path } = ctx.query;
  ctx.body = await list(path);
});

router.get('/size', async (ctx) => {
  const { path } = ctx.query;
  ctx.body = await calculateSize(path);
});

export default router.routes();
