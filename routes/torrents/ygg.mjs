import Router from 'koa-router';
import torrentSearch from 'torrent-search-api';

torrentSearch.enableProvider('YggTorrent', 'chancette', 'rivenBot19!');

const router = new Router();
router.get('/search', async (ctx) => {
  const { search } = ctx.query;
  ctx.body = await torrentSearch.search(search);
});

export default router.routes();
