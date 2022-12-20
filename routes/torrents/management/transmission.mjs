import Router from 'koa-router';
import {
  list,
  remove,
  start,
  stop,
  get
} from '../../../services/transmission.mjs';

const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = await list();
});

router.get('/:hash', async (ctx) => {
  const { hash } = ctx.params;
  ctx.body = await get(hash.split(','));
});

router.get('/start/:hash', async (ctx) => {
  const { hash } = ctx.params;
  ctx.body = await start(hash);
});

router.get('/stop/:hash', async (ctx) => {
  const { hash } = ctx.params;
  ctx.body = await stop(hash);
});

router.get('/remove/:hash', async (ctx) => {
  const { hash } = ctx.params;
  ctx.body = await remove(hash);
});

export default router.routes();
