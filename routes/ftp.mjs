import Router from 'koa-router';
import list from '../services/ftp';

const router = new Router();

router.get('/', async (ctx) => {
  const { path } = ctx.query;
  ctx.body = await list(path);
});

export default router.routes();
