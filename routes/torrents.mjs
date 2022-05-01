import Router from 'koa-router';
import searchTorrents,
{
  dlTorrentFile,
  getTorrentDetails,
  getActiveProvidersWithCategories,
} from '../services/torrent.mjs';

import addTorrentToDl from '../services/transmission.mjs';

const router = new Router();

router.get('/search', async (ctx) => {
  const search = JSON.parse(ctx.query.search);
  if (!search.search || !search.provider || !search.category) {
    ctx.throw(400, 'L\' expression recherchée, la catégorie et le fournisseur sont requis.');
  }
  ctx.body = await searchTorrents(search.search, search.category, search.provider);
});

router.get('/dl', async (ctx) => {
  const torrentFile = await dlTorrentFile(JSON.parse(ctx.query.torrent));
  ctx.body = await addTorrentToDl(torrentFile);
});

router.get('/details', async (ctx) => {
  ctx.body = await getTorrentDetails(JSON.parse(ctx.query.torrent));
});

router.get('/providers', (ctx) => {
  ctx.body = getActiveProvidersWithCategories();
});

export default router.routes();
