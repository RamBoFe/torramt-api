import Router from 'koa-router';
import {
  getTorrents,
  remove,
  start,
  stop,
} from '../../../services/transmission';

const FIELDS = [
  'id',
  'name',
  'status',
  'totalSize',
  'hashString',
  'percentDone',
  'uploadRatio',
  'uploadedEver',
  'downloadedEver',
  'rateDownload',
  'rateUpload',
  'leftUntilDone',
  'doneDate',
  'files',
];

const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = await getTorrents(FIELDS);
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
