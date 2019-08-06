import Router from 'koa-router';
import searchTorrents, { dlTorrentFile, torrentDetails } from '../../services/torrent';
import addTorrentToDl from '../../services/transmission';

const router = new Router();

router.get('/search', async (ctx) => {
  const { search } = ctx.query;
  ctx.body = await searchTorrents('YggTorrent', search);
});

router.get('/dl', async (ctx) => {
  let { torrent } = ctx.query;
  torrent = JSON.parse(torrent);
  const torrentFile = await dlTorrentFile(torrent);
  const addInfos = await addTorrentToDl(torrentFile);
  ctx.body = addInfos;
});

router.get('/details', async (ctx) => {
  let { torrent } = ctx.query;
  torrent = JSON.parse(torrent);
  ctx.body = await torrentDetails(torrent);
});

export default router.routes();
