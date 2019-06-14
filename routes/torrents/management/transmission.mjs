import Router from 'koa-router';
import { getTorrents } from '../../../services/transmission';

const FIELDS = [
  'id',
  'name',
  'status',
  'totalSize',
  'hashString',
  'percentDone',
  'uploadRatio',
  'uploadedEver',
  'isFinished',
];

const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = await getTorrents(FIELDS);
});

export default router.routes();
