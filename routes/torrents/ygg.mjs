import Router from 'koa-router';

const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = 'Torrents results YggTorrents !!!';
});

export default router.routes();
