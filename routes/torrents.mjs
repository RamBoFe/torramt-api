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
  let { search } = ctx.query;
  search = JSON.parse(search);
  if (!search.searchValue || !search.provider || !search.category) {
    ctx.throw(400, 'L\' expression recherchée, la catégorie et le fournisseur sont recquis.');
  }
  ctx.body = await searchTorrents(search.searchValue, search.category, search.provider);
});

router.get('/dl', async (ctx) => {
  let { torrent } = ctx.query;
  torrent = JSON.parse(torrent);
  const torrentFile = dlTorrentFile(torrent);
  ctx.body = await addTorrentToDl(torrentFile);
});

router.get('/details', async (ctx) => {
  let { torrent } = ctx.query;
  torrent = JSON.parse(torrent);
  ctx.body = await getTorrentDetails(torrent);
});

router.get('/providers', (ctx) => {
  ctx.body = getActiveProvidersWithCategories();
});

export default router.routes();
